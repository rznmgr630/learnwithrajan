import type { LessonDay } from "@/lib/learn/lesson-types";

export const NODEJS_DAY_18_LESSONS: LessonDay = {
  day: 18,
  title: "Authentication",
  totalMinutes: 134,
  difficulty: "Intermediate",
  lessons: [
    {
      id: "authn-vs-authz",
      title: "Authentication and authorization",
      durationMinutes: 9,
      explanation:
        "Two questions that are constantly confused, and the confusion causes real vulnerabilities.\n\n---\n\n## Authentication\n\n<b>Authentication</b> (verifying a user's identity).\n\n> The whole job is answering <b>\"who are you?\"</b> and nothing else. It ends the moment you know which user is making the request. Everything after that, whether they may read this record or delete that one, is a different system with different rules.\n\n```text\nEmail: rajan@example.com\nPassword: ********\n     ↓\n\"Yes, this is Rajan.\"\n```\n\n---\n\n## Authorization\n\n<b>Authorization</b> (deciding what an authenticated user is allowed to do).\n\n> This answers <b>\"what may you do?\"</b>, and it has to be asked <b>per request and per resource</b>. That is the part people get wrong. Authentication happens once at the boundary; authorization has to happen at every single thing you touch, because \"Rajan is logged in\" says nothing about whether invoice 4471 is Rajan's.\n\n```text\nRajan is authenticated\n        ↓\nIs Rajan an admin?\n        ↓\nYes → allow deleting users\nNo  → 403\n```\n\n---\n\n## The bug that lives in the gap\n\nThis route is authenticated and broken:\n\n```javascript\napp.get(\"/invoices/:id\", { preHandler: authenticate }, async (request) => {\n  return db.select().from(invoices).where(eq(invoices.id, request.params.id));\n});\n```\n\n> The `authenticate` hook confirmed there is a real logged-in user. It said nothing about <b>whose invoice this is</b>. So any logged-in user can read every invoice by changing a number in the URL. This has a name, <b>insecure direct object reference</b>, and it is one of the most common serious bugs in web applications precisely because the route <b>looks</b> protected. The fix is that the ownership check belongs in the query, not in a hook:\n>\n> ```javascript\n> .where(and(eq(invoices.id, id), eq(invoices.userId, request.user.id)))\n> ```\n>\n> Putting it in the `WHERE` rather than in an `if` afterwards is deliberate: a row you are not allowed to see is then a row that does not exist, so you cannot forget the check and you cannot leak its existence through a different error message.\n\n---\n\n## 401 and 403\n\n```text\n401 Unauthorized  →  I do not know who you are\n403 Forbidden     →  I know who you are, and no\n```\n\nThe names are historically wrong: 401 is about authentication despite being called Unauthorized. Use 401 when the credential is missing, invalid or expired, and 403 when the identity is fine and the permission is not.\n\n---\n\n## Today's flow\n\n```text\nRegister → hash password → store user\n   ↓\nLogin → verify password → create session or tokens\n   ↓\nAuthenticated requests\n   ↓\nLogout / revoke\n```\n\nToday is authentication only. Authorization gets its own treatment, and the important thing to carry forward is that <b>finishing authentication is not finishing security</b>.",
      diagram: `Two questions, constantly confused

    AUTHENTICATION   who are you?
    AUTHORIZATION    what may you do?

    authn ends the moment you know WHICH user.
    everything after is a different system.


The asymmetry that causes bugs

    authentication   ONCE, at the boundary
    authorization    EVERY request AND
                     EVERY resource

    "Rajan is logged in" says NOTHING about
    whether invoice 4471 is Rajan's.


⚠ The bug that lives in the gap

    app.get("/invoices/:id",
      { preHandler: authenticate },
      async (req) => db.select().from(invoices)
        .where(eq(invoices.id, req.params.id)));

    the hook confirmed a real logged-in user.
    it said nothing about WHOSE invoice this is.

    → any logged-in user reads every invoice by
      changing a number in the URL

    name: INSECURE DIRECT OBJECT REFERENCE

    one of the most common serious bugs, precisely
    because the route LOOKS protected.


The fix goes in the WHERE, not an if

    .where(and(
      eq(invoices.id, id),
      eq(invoices.userId, req.user.id)))

    deliberate: a row you may not see becomes a
    row that DOES NOT EXIST.

      you cannot forget the check
      you cannot leak its existence through a
      different error message


401 vs 403

    401 Unauthorized   I do not know who you are
    403 Forbidden      I know, and NO

    the names are historically wrong: 401 is about
    AUTHENTICATION despite being called
    Unauthorized.

    401  credential missing, invalid or expired
    403  identity fine, permission is not


Today

    register → hash → store
    login → verify → session or tokens
    authenticated requests
    logout / revoke

    authentication only.

    carry forward: FINISHING AUTHENTICATION IS
    NOT FINISHING SECURITY.`,
      codeExample: {
        title: "An authenticated route that is still wide open",
        code: `import Fastify from "fastify";
import { and, eq } from "drizzle-orm";

const app = Fastify({ logger: true });


// ── Authentication: one check, at the boundary ──────────────
async function authenticate(request, reply) {
  const header = request.headers.authorization;
  if (!header?.startsWith("Bearer ")) {
    return reply.code(401).send({ error: "Unauthorized" });
  }
  try {
    const claims = verifyAccessToken(header.slice(7));
    request.user = { id: Number(claims.sub), role: claims.role };
  } catch {
    return reply.code(401).send({ error: "Unauthorized" });
  }
}
// This function's entire job is answering "who are you?".
// It is finished once request.user exists.


// ── ✗ Authenticated, and anyone can read anything ───────────
app.get("/invoices/:id", { preHandler: authenticate }, async (request) => {
  const [invoice] = await db
    .select()
    .from(invoices)
    .where(eq(invoices.id, request.params.id));
  return invoice;
});
//
// GET /invoices/4471
//   Authorization: Bearer <a perfectly valid token for user 9>
//   ->  200, and it is user 3's invoice.
//
// The route has a preHandler. It appears protected. Every
// reviewer skims past it. And it leaks the whole table, one
// integer at a time.
//
// This is an INSECURE DIRECT OBJECT REFERENCE, and it is
// common because authentication looks like security.


// ── ✓ Ownership in the WHERE clause ─────────────────────────
app.get("/invoices/:id", {
  preHandler: authenticate,
  schema: { params: z.object({ id: z.coerce.number().int().positive() }) },
}, async (request, reply) => {
  const [invoice] = await db
    .select()
    .from(invoices)
    .where(and(
      eq(invoices.id, request.params.id),
      eq(invoices.userId, request.user.id),      // ← the whole fix
    ));

  if (!invoice) return reply.code(404).send({ error: "Not found" });
  return invoice;
});
//
// Two reasons the predicate beats an if-statement afterwards.
//
// 1. You cannot forget it. There is no path that fetches the
//    row and then neglects to check, because the query only
//    ever returns rows you may see.
//
// 2. It returns 404, not 403. A 403 tells the caller "this
//    invoice exists and is not yours", which is information.
//    404 tells them nothing.


// ── ✗ And the same bug on a write, which is worse ───────────
app.delete("/invoices/:id", { preHandler: authenticate }, async (request) => {
  await db.delete(invoices).where(eq(invoices.id, request.params.id));
  return { deleted: true };
});
// Any logged-in user can delete any invoice. Day 17's missing
// WHERE lesson and this one are the same shape: the dangerous
// version is the shorter one.

// ✓
app.delete("/invoices/:id", { preHandler: authenticate }, async (request, reply) => {
  const deleted = await db
    .delete(invoices)
    .where(and(
      eq(invoices.id, request.params.id),
      eq(invoices.userId, request.user.id),
    ))
    .returning({ id: invoices.id });

  if (deleted.length === 0) return reply.code(404).send({ error: "Not found" });
  return { deleted: true };
});


// ── 401 vs 403, used correctly ──────────────────────────────
// 401: I do not know who you are.
//   · no Authorization header
//   · malformed token
//   · invalid signature
//   · expired token          ← still 401, not 403
//
// 403: I know exactly who you are, and no.
//   · authenticated user is not an admin
//   · authenticated user's plan does not include this
//
// Getting this wrong breaks clients in a specific way: a
// well-built client refreshes its token on a 401 and shows an
// error on a 403. Return 403 for an expired token and the
// client never refreshes; return 401 for a permission
// failure and it refreshes forever in a loop.


// ── Scoping the hook, from Day 15 ───────────────────────────
app.register(async (publicRoutes) => {
  publicRoutes.post("/register", async () => ({}));
  publicRoutes.post("/login", async () => ({}));
  publicRoutes.get("/health", async () => ({ status: "ok" }));
});

app.register(async (privateRoutes) => {
  privateRoutes.addHook("preHandler", authenticate);
  privateRoutes.get("/me", async (request) => request.user);
  privateRoutes.get("/invoices/:id", async () => ({}));
});
//
// Day 15's encapsulation, doing security work. Whether a
// route is authenticated is decided by which register() call
// it sits in, not by which line of the file it was written
// on. A new route added to the second block is protected by
// default, and that default is the point.`,
      },
      keyTakeaways: [
        "Authentication answers \"who are you?\" and ends the moment you know which user is making the request.",
        "Authorization answers \"what may you do?\" and has to be asked per request and per resource.",
        "That asymmetry is where the bugs live. \"Rajan is logged in\" says nothing about whether invoice 4471 is Rajan's.",
        "An authenticated route with no ownership check is an insecure direct object reference, and it is common because the route looks protected.",
        "Put the ownership check in the `WHERE` clause, not an `if` afterwards. A row you may not see becomes a row that does not exist.",
        "That also gives you 404 rather than 403, so you do not confirm the record exists.",
        "401 means the credential is missing, invalid or expired. 403 means the identity is fine and the permission is not.",
        "Getting those two wrong breaks clients: 403 on an expired token stops the refresh, and 401 on a permission failure causes a refresh loop.",
        "Scope the auth hook to a plugin subtree so new routes in that block are protected by default.",
      ],
      commonMistakes: [
        "Treating an `authenticate` hook as security. It confirms there is a user; it says nothing about which records that user may touch.",
        "Checking ownership with an `if` after fetching the row. Eventually a code path fetches and forgets.",
        "Returning 403 for a resource that is not yours. That confirms it exists. Return 404.",
        "Returning 403 for an expired token, so a well-built client never refreshes and the user is logged out for no reason.",
        "Returning 401 for a permission failure, so the client refreshes its token in a loop and still gets 401.",
        "Adding routes to a file that has a global auth hook with `if` exemptions for public paths, instead of scoping the hook.",
      ],
      quiz: [
        {
          question: "A route has an `authenticate` preHandler and queries `WHERE invoices.id = :id`. What is wrong?",
          options: [
            "Nothing",
            "It never checks ownership, so any logged-in user can read every invoice by changing the URL. That is an insecure direct object reference.",
            "It needs a schema",
            "The hook should be `onRequest`",
          ],
          correctIndex: 1,
          explanation:
            "Authentication happens once at the boundary; authorization has to happen per resource. The route looks protected, which is why this survives review.",
        },
        {
          question: "Why put the ownership check in the `WHERE` clause rather than an `if` afterwards?",
          options: [
            "It is faster",
            "A row you may not see becomes a row that does not exist, so you cannot forget the check and you return 404 rather than confirming it exists",
            "Drizzle requires it",
            "It avoids a second query",
          ],
          correctIndex: 1,
          explanation:
            "Both properties matter: no code path can skip it, and the response leaks nothing about whether the record is real.",
        },
        {
          question: "An access token has expired. Which status?",
          options: [
            "403, the user is not allowed",
            "401, because the credential is invalid and a well-built client refreshes on 401",
            "400",
            "419",
          ],
          correctIndex: 1,
          explanation:
            "Return 403 and the client never refreshes, so the user is logged out for no reason.",
        },
        {
          question: "Why scope the auth hook to a plugin subtree?",
          options: [
            "Performance",
            "New routes added to that block are protected by default, rather than depending on which line they were written on",
            "Hooks cannot be global",
            "To share the token parser",
          ],
          correctIndex: 1,
          explanation:
            "Day 15's encapsulation doing security work. A global hook with `if` exemptions inverts the default.",
        },
      ],
    },
    {
      id: "password-hashing",
      title: "Why password hashing is slow on purpose",
      durationMinutes: 12,
      explanation:
        "Never store this:\n\n```javascript\npassword = \"mypassword123\"\n```\n\nIf the database leaks, every password is exposed, and because people reuse passwords, you have also compromised their email, their bank and their employer.\n\n```text\nPassword → password hashing → hash → database\n```\n\n---\n\n## Password hashing\n\n<b>Password hashing</b> (a deliberately slow, one-way transformation designed to make recovering the original password expensive).\n\n> The word that separates this from every other hash is <b>slow</b>. `SHA-256` is a hash and it is the wrong tool, not because it is weak but because it is <b>fast</b>, and fast is the property an attacker needs. A password hash is a normal hash with an intentional cost bolted on, and that cost is the entire security mechanism.\n\nUse `Argon2` or `bcrypt`. Never use `SHA-256`, `SHA-1` or `MD5` for a password.\n\n---\n\n## The arithmetic that explains everything\n\nAn attacker with your database has emails and hashes, and can guess offline as fast as their hardware allows.\n\n```text\nSHA-256 on a GPU     ~10,000,000,000 guesses/second\nbcrypt cost 12       ~5 guesses/second per core\n```\n\n> That is not a tweak, it is a factor of a billion. A password that falls in one second against SHA-256 takes decades against bcrypt at a realistic cost. Verified locally: `bcrypt.hash` at cost 12 took <b>216ms</b>. That is per attempt, on your CPU, and an attacker gets no discount for having your hash.\n\n---\n\n## Salt\n\n<b>Salt</b> (random data added to a password before hashing, so identical passwords produce different hashes).\n\n> Without a salt the attack is not brute force at all, it is a <b>lookup</b>. Precompute the hash of the ten million most common passwords once, and every unsalted database in the world is readable instantly. A salt breaks that by making the work specific to one row: your precomputation is worth nothing, and cracking a million users costs a million times cracking one.\n\n```text\nUser A: hello123      Without salt      With unique salt\nUser B: hello123      same hash         different hashes\n```\n\nModern libraries generate the salt for you and store it inside the hash string. Do not invent your own salt system, and do not put the salt in a separate column, because there is no need.\n\n---\n\n## Work factor\n\n<b>Work factor</b> (the amount of computation required to produce one hash).\n\n> The only honest way to choose it is to <b>measure</b>, not to copy a number, because the right value depends on your hardware and it moves as hardware gets faster. Verified on this machine: bcrypt cost 10 took 54ms, cost 12 took 216ms, cost 14 took 932ms. Each step of one doubles the cost, which is why the numbers look small and matter so much.\n>\n> Aim for something like 100 to 250ms per hash on your own hardware. Below that you are cheap to attack; far above it and a login spike becomes a self-inflicted outage, which the next lesson is entirely about.\n\n---\n\n## Rehashing\n\n<b>Rehashing</b> (re-computing a stored password hash with stronger parameters when the user next logs in).\n\n> This works because of a detail that is easy to miss: <b>the parameters are stored in the hash string itself</b>. Verified, a bcrypt hash reads `$2b$12$...`, where `12` is the cost, and `bcrypt.getRounds(hash)` returns `12`. Argon2 stores `$argon2id$v=19$m=65536,p=4,t=3$...`, and `argon2.needsRehash()` reads it for you, verified `true` against stronger parameters and `false` against the same ones.\n>\n> So you never need to force a password reset to upgrade. At login you have the one thing you will never have again, the plaintext password, and that is the moment to re-hash it.\n\n```text\nLogin → verify → parameters outdated? → yes → hash again → store\n```\n\n---\n\n## What not to do\n\nDo not add a pepper, a second round, your own salt scheme, or `sha256(password + secret)` before hashing. Every one of those is a way to be clever in a system where clever loses to well-tested.",
      diagram: `Never store the password

    if the DB leaks, every password is exposed.

    and because people REUSE passwords, you have
    also compromised their email, their bank and
    their employer.


The word that separates it: SLOW

    SHA-256 is a hash, and the WRONG TOOL.

    not because it is weak.
    because it is FAST, and fast is the property
    the ATTACKER needs.

    a password hash is a normal hash with an
    intentional cost bolted on, and that cost IS
    the security mechanism.

    ✓ Argon2 · bcrypt · (scrypt, next lesson)
    ✗ SHA-256 · SHA-1 · MD5


The arithmetic

    SHA-256 on a GPU
      ~10,000,000,000 guesses / second

    bcrypt cost 12
      ~5 guesses / second per core

    a factor of a BILLION.

    a password that falls in one second against
    SHA-256 takes decades against bcrypt.

    verified: bcrypt cost 12 = 216ms per hash


Salt: it is not about brute force

    without a salt the attack is a LOOKUP.

      precompute the hash of the 10 million most
      common passwords ONCE
        → every unsalted database on earth is
          readable instantly

    a salt makes the work specific to ONE ROW.

      precomputation worth nothing
      cracking a million users costs a million
      times cracking one

    A: hello123   without salt  same hash
    B: hello123   with salt     different

    libraries generate it and store it INSIDE the
    hash string. no separate column. do not
    invent your own.


Work factor: MEASURE, do not copy

    verified on this machine:

      cost 10    54ms
      cost 12   216ms
      cost 14   932ms

    each step of ONE doubles it, which is why the
    numbers look small and matter so much.

    target ~100-250ms on YOUR hardware.

      below   cheap to attack
      far above   a login spike becomes a
                  self-inflicted outage
                  → next lesson


Rehashing works because of a stored detail

    THE PARAMETERS ARE IN THE HASH STRING.

    verified:
      $2b$12$...          the 12 is the cost
      bcrypt.getRounds(h)  →  12

      $argon2id$v=19$m=65536,p=4,t=3$...
      argon2.needsRehash(h, stronger)  →  true
      argon2.needsRehash(h, same)      →  false

    so you NEVER force a password reset to
    upgrade.

    at login you hold the one thing you will never
    have again: THE PLAINTEXT.
    that is the moment to re-hash.

    login → verify → outdated? → hash again → store


Do not be clever

    ✗ a pepper
    ✗ a second round
    ✗ your own salt scheme
    ✗ sha256(password + secret) first

    every one is a way to be clever in a system
    where clever loses to well-tested.`,
      codeExample: {
        title: "Hashing, verifying, and upgrading in place",
        code: `import bcrypt from "bcrypt";
import argon2 from "argon2";
// Verified with bcrypt 6.0.0 and argon2 0.45.1 on Node 24.14.1


// ── The parameters live in the hash string ──────────────────
const hash = await bcrypt.hash("hunter2", 12);
console.log(hash);
// $2b$12$obYzTJYuEntXWIyftuho0uqj5m7AVrxzyTPenVWsNfCXCHXcjGkPi
//  │  │  └── 22-char salt, then the digest
//  │  └───── cost: 12
//  └──────── algorithm: bcrypt, 2b variant
//
// Everything needed to verify, and to decide whether to
// upgrade, is in that one string. That is why you store one
// column and not three.

console.log(bcrypt.getRounds(hash));      // 12     ← verified

const argonHash = await argon2.hash("hunter2");
console.log(argonHash);
// $argon2id$v=19$m=65536,p=4,t=3$wwUgd8dJ...$G8ClvXLko...
//   │            │        │   └── time cost 3
//   │            │        └────── parallelism 4
//   │            └─────────────── memory 65536 KiB = 64MB
//   └──────────────────────────── argon2id, the right variant
//
// Verified: argon2's defaults are argon2id, 64MB, t=3, p=4,
// and it took 29ms. Note that is FASTER than bcrypt cost 12
// at 216ms, while also being memory-hard. More on that next.


// ── Measure, do not copy a number ───────────────────────────
for (const cost of [10, 12, 14]) {
  const t = performance.now();
  await bcrypt.hash("hunter2", cost);
  console.log(\`cost \${cost}: \${Math.round(performance.now() - t)}ms\`);
}
// Verified on this machine:
//   cost 10:  54ms
//   cost 12: 216ms
//   cost 14: 932ms
//
// Run this on the hardware you will actually deploy to. A
// laptop and a small cloud instance are not the same machine,
// and a number from a 2019 blog post is not a measurement.


// ── Register ────────────────────────────────────────────────
const BCRYPT_COST = 12;

export async function register(db, { email, password }) {
  const passwordHash = await bcrypt.hash(password, BCRYPT_COST);
  //                         ^^^^^^^^^^^^ the async form. The
  //                         next lesson is about why that
  //                         matters more than it looks.

  const [user] = await db
    .insert(users)
    .values({ email, passwordHash })
    .returning({ id: users.id, email: users.email });

  return user;      // never the hash, and obviously never
                    // the password
}
// Note what is NOT here: no salt column, no salt generation,
// no pepper. bcrypt generated a unique salt and put it in the
// string.


// ── Login, with the upgrade built in ────────────────────────
export async function login(db, { email, password }) {
  const [user] = await db.select().from(users).where(eq(users.email, email));
  if (!user) return null;      // ⚠ this early return is a bug.
                               //   The crypto lesson explains
                               //   why, and it is not subtle.

  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) return null;

  // ── Rehash in place ───────────────────────────────────────
  // We hold the plaintext exactly once per login. This is the
  // only moment an upgrade is possible without emailing every
  // user.
  if (bcrypt.getRounds(user.passwordHash) < BCRYPT_COST) {
    const upgraded = await bcrypt.hash(password, BCRYPT_COST);
    await db
      .update(users)
      .set({ passwordHash: upgraded })
      .where(eq(users.id, user.id));
  }

  return user;
}


// ── The same thing with argon2, which reads better ──────────
const ARGON_OPTS = {
  type: argon2.argon2id,
  memoryCost: 2 ** 16,      // 64 MiB
  timeCost: 3,
  parallelism: 4,
};

export async function loginArgon(db, { email, password }) {
  const [user] = await db.select().from(users).where(eq(users.email, email));
  if (!user) return null;

  if (!(await argon2.verify(user.passwordHash, password))) return null;

  if (argon2.needsRehash(user.passwordHash, ARGON_OPTS)) {
    const upgraded = await argon2.hash(password, ARGON_OPTS);
    await db.update(users).set({ passwordHash: upgraded }).where(eq(users.id, user.id));
  }
  return user;
}
// Verified: needsRehash returned true against stronger
// parameters and false against the same ones. It parses the
// hash string for you, so you do not hand-compare numbers.


// ── Migrating between algorithms, not just parameters ───────
// The same trick handles a change of algorithm, because the
// hash string says which one it is.
export async function verifyAny(stored, password) {
  if (stored.startsWith("$argon2")) return argon2.verify(stored, password);
  if (stored.startsWith("$2")) return bcrypt.compare(password, stored);
  throw new Error("unknown password hash format");
}
// Then rehash with argon2 on success. Over a few weeks most
// active users are migrated, and the rest migrate when they
// return. No mass password reset, no downtime.


// ── ✗ Things not to do ──────────────────────────────────────
// createHash("sha256").update(password).digest("hex")
//   Fast. That is the problem, not a feature.
//
// bcrypt.hash(createHash("sha256").update(password).digest("hex"), 12)
//   People do this to dodge bcrypt's length limit (next
//   lesson). It works, and it is a custom scheme you now have
//   to explain to every future maintainer and auditor.
//
// bcrypt.hash(password + PEPPER, 12)
//   A pepper can be defensible, and it is also a secret that
//   must never rotate, never leak and never be lost, or every
//   password in your database becomes unverifiable. Weigh
//   that honestly before adding it.
//
// A hand-written salt in its own column
//   Solving a problem the library already solved, in a way
//   that is easy to get subtly wrong.`,
      },
      keyTakeaways: [
        "SHA-256 is the wrong tool for passwords because it is fast, not because it is weak. Fast is the property the attacker needs.",
        "A password hash is a normal hash with an intentional cost, and that cost is the entire security mechanism.",
        "The gap is roughly a factor of a billion: GPUs do around 10 billion SHA-256 guesses per second against bcrypt's handful per core.",
        "Verified: bcrypt cost 10 was 54ms, cost 12 was 216ms, cost 14 was 932ms. Each step of one doubles the work.",
        "A salt defeats precomputation, not brute force. Without one, cracking a million users costs the same as cracking one.",
        "Libraries generate the salt and store it in the hash string. No separate column, and no scheme of your own.",
        "Choose a work factor by measuring on your deployment hardware, targeting roughly 100 to 250ms per hash.",
        "Verified: parameters live in the hash string. `$2b$12$` with `bcrypt.getRounds()` returning 12, and `$argon2id$v=19$m=65536,p=4,t=3$` with `argon2.needsRehash()` returning true against stronger settings.",
        "So you upgrade at login, where you hold the plaintext for the only time. No mass password reset.",
        "The same trick migrates between algorithms, because the prefix says which algorithm produced the hash.",
      ],
      commonMistakes: [
        "Using SHA-256 or MD5 for passwords. The speed that makes them good hashes makes them useless here.",
        "Copying a work factor from a tutorial instead of measuring on your own hardware.",
        "Storing the salt in a separate column, or generating it yourself. The library already did both.",
        "Adding a pepper without weighing that it becomes a secret which can never rotate or be lost without making every password unverifiable.",
        "Pre-hashing with SHA-256 before bcrypt. It works and it is a custom scheme every future maintainer has to be told about.",
        "Forcing a password reset to upgrade parameters. Rehash at login instead.",
        "Never upgrading at all, so a cost chosen in 2019 is still protecting your users in 2026.",
      ],
      quiz: [
        {
          question: "Why is SHA-256 wrong for passwords?",
          options: [
            "It is cryptographically broken",
            "It is fast, and speed is exactly what an attacker with your database needs",
            "It produces short digests",
            "It cannot be salted",
          ],
          correctIndex: 1,
          explanation:
            "Roughly 10 billion GPU guesses per second against bcrypt's handful per core. A factor of about a billion.",
        },
        {
          question: "What does a salt actually defeat?",
          options: [
            "Brute force",
            "Precomputation. Without one, an attacker hashes the common passwords once and reads every unsalted database instantly.",
            "Timing attacks",
            "Rainbow-free GPUs",
          ],
          correctIndex: 1,
          explanation:
            "A salt makes the work specific to one row, so cracking a million users costs a million times cracking one.",
        },
        {
          question: "How does rehashing at login work without a password reset?",
          options: [
            "The library remembers the old password",
            "The parameters are stored in the hash string, so you can detect an outdated hash, and at login you hold the plaintext once",
            "You decrypt the old hash",
            "It does not; a reset is required",
          ],
          correctIndex: 1,
          explanation:
            "Verified: `bcrypt.getRounds()` returned 12 from `$2b$12$`, and `argon2.needsRehash()` returned true against stronger parameters.",
        },
        {
          question: "How should you pick a bcrypt cost?",
          options: [
            "Use 10, the common default",
            "Measure on your deployment hardware and target roughly 100 to 250ms per hash",
            "The highest your machine allows",
            "Match your token expiry",
          ],
          correctIndex: 1,
          explanation:
            "Verified 54ms, 216ms and 932ms for costs 10, 12 and 14 on one machine. A number from a blog post is not a measurement of yours.",
        },
        {
          question: "Why store the salt inside the hash string rather than a separate column?",
          options: [
            "To save space",
            "Because the library already does it, along with the algorithm and parameters, which is what makes verification and upgrades possible from one value",
            "Salts must be secret",
            "Databases cannot index two columns",
          ],
          correctIndex: 1,
          explanation:
            "One column carries the algorithm, the parameters, the salt and the digest, which is how `needsRehash` and cross-algorithm migration work.",
        },
      ],
    },
    {
      id: "argon2-bcrypt-scrypt",
      title: "Argon2, bcrypt and the scrypt that ships with Node",
      durationMinutes: 12,
      explanation:
        "Three real options, and the differences are not cosmetic.\n\n---\n\n## Argon2\n\n<b>Argon2</b> (the winner of the Password Hashing Competition, and a memory-hard password hashing algorithm).\n\n> The property that matters is <b>memory-hard</b>. bcrypt costs CPU time, which specialised hardware parallelises cheaply; Argon2 also demands a large block of RAM per hash, and RAM is the thing an attacker cannot cheaply multiply across thousands of GPU cores. Verified defaults: `argon2id`, 64MB of memory, `t=3`, `p=4`, and it hashed in <b>29ms</b>. That is faster than bcrypt cost 12 at 216ms, while being harder to attack, which is the whole argument.\n\nUse the `argon2id` variant. It is the default in the `argon2` package, verified from the hash string.\n\n---\n\n## bcrypt, and the limit nobody mentions\n\n<b>bcrypt</b> (a long-established password hashing algorithm based on the Blowfish cipher).\n\n> bcrypt is battle-tested and a perfectly responsible choice, and it has one sharp edge that is genuinely dangerous. <b>It silently ignores everything past 72 bytes.</b> Verified: hashing 72 `\"A\"` characters and then calling `compare` with those 72 characters plus `\"COMPLETELY-DIFFERENT-SUFFIX\"` returned <b>`true`</b>. Verified the boundary too: 71 characters does not match 72, so the cut is exactly at 72 bytes.\n>\n> This punishes exactly the users doing the right thing. A password manager generating a long passphrase, or anything past 72 bytes of UTF-8 (which arrives sooner with non-ASCII characters), gets truncated with no error and no warning. Argon2 has no such limit, verified: the same test returned `false`.\n>\n> If you must use bcrypt, cap the password length at validation with a Zod `.max(72)` so the truncation is a visible rule rather than an invisible one.\n\n---\n\n## scrypt, already in Node\n\n<b>scrypt</b> (a memory-hard password hashing algorithm, available in `node:crypto` with no dependency).\n\n```javascript\nimport { scryptSync, randomBytes } from \"node:crypto\";\n```\n\nNo native build step, no package to audit. And a trap that will cost you an afternoon.\n\n> OWASP's recommended minimum parameters are `N=2^15, r=8, p=1`. Verified: that <b>throws</b> on Node 24.14.1.\n>\n> ```text\n> RangeError: Invalid scrypt params:\n>   error:030000AC:digital envelope routines::memory limit exceeded\n>   code: ERR_CRYPTO_INVALID_SCRYPT_PARAMS\n> ```\n>\n> The reason is arithmetic. scrypt needs `128 × N × r` bytes, which at `N=2^15, r=8` is exactly 32MB, and Node's default `maxmem` is 32MB (33554432 bytes). So the recommended settings sit exactly at the ceiling and fail. Verified: `N=2^14` needs 16MB and works, `N=2^15` needs 32MB and throws, `N=2^16` needs 64MB and throws, and all three succeed once you pass `maxmem: 256 * 1024 * 1024`. Timings then were 21ms, 46ms and 92ms.\n>\n> Note what the error message does not say: anything about `maxmem`. It is an OpenSSL string about a memory limit, which sends people to lower their parameters rather than raise the limit, and lowering the parameters is the wrong fix.\n\n---\n\n## Choosing\n\n```text\nArgon2   default. memory-hard, no length limit, needsRehash built in.\n         costs you a native dependency.\n\nbcrypt   responsible and everywhere. cap the password at 72 bytes.\n         also a native dependency.\n\nscrypt   no dependency at all, already in Node. memory-hard.\n         you handle salt, encoding and parameter storage yourself,\n         and you must set maxmem.\n```\n\n> The honest ranking: Argon2 if you can add a dependency, bcrypt if your team already knows it, scrypt if a native module is genuinely not an option. The one wrong answer is a general-purpose hash. And note what scrypt costs you in practice: because `node:crypto` gives you a raw key derivation rather than a password hashing interface, <b>you</b> write the salt generation, the encoding and the parameter storage, which is exactly the kind of code the previous lesson told you not to write.",
      diagram: `Argon2: the property is MEMORY-HARD

    bcrypt costs CPU TIME
      → specialised hardware parallelises it
        cheaply

    Argon2 also demands a large block of RAM per
    hash
      → RAM is the thing an attacker CANNOT
        cheaply multiply across thousands of
        GPU cores

    verified defaults:
      argon2id · 64MB · t=3 · p=4  →  29ms

    FASTER than bcrypt cost 12 (216ms) while
    being harder to attack. that is the argument.

    use argon2id. it is the package default.


⚠⚠ bcrypt ignores everything past 72 BYTES

    verified:

      hash(72 × "A")
      compare(72 × "A" + "COMPLETELY-DIFFERENT-
              SUFFIX", thatHash)
        →  TRUE

      71 chars vs 72 chars  →  false
        so the cut is EXACTLY 72 bytes

    silently. no error. no warning.

    and it punishes the users doing the RIGHT
    thing:
      a password manager's long passphrase
      any non-ASCII password (72 BYTES arrives
        much sooner than 72 characters)

    Argon2, same test  →  false. no limit.

    if you use bcrypt: cap it at validation with
    Zod .max(72), so the truncation is a VISIBLE
    rule instead of an invisible one.


⚠⚠ scrypt ships with Node, and OWASP's
   recommended parameters THROW

    OWASP minimum:  N=2^15, r=8, p=1

    verified on Node 24.14.1:

      RangeError: Invalid scrypt params:
        ...memory limit exceeded
        ERR_CRYPTO_INVALID_SCRYPT_PARAMS

    the arithmetic:
      scrypt needs 128 × N × r bytes
      N=2^15, r=8  →  exactly 32MB
      Node's default maxmem  →  32MB
                                (33554432)

    the recommended settings sit EXACTLY at the
    ceiling and fail.

    verified:
      N=2^14  16MB  no maxmem   OK    21ms
      N=2^15  32MB  no maxmem   THROW
      N=2^16  64MB  no maxmem   THROW
      all three, maxmem 256MB   OK
                        46ms / 92ms

    ⚠ and note what the error does NOT say:
      anything about maxmem.

      it is an OpenSSL string about a memory
      limit, which sends people to LOWER their
      parameters instead of RAISING the limit.

      lowering the parameters is the wrong fix.


Choosing

    Argon2   memory-hard · no length limit
             needsRehash built in
             costs a native dependency

    bcrypt   responsible · everywhere
             CAP AT 72 BYTES
             also a native dependency

    scrypt   zero dependencies, in Node
             memory-hard
             YOU write salt, encoding and
               parameter storage
             and you MUST set maxmem

    honest ranking:
      Argon2 if you can add a dependency
      bcrypt if your team knows it
      scrypt if a native module is truly not
        an option

    the one wrong answer is a general-purpose
    hash.

    ⚠ and note what scrypt really costs:
      node:crypto gives a raw KEY DERIVATION,
      not a password-hashing interface.

      so YOU write the salt generation, the
      encoding and the parameter storage.

      which is exactly the code the last lesson
      told you not to write.`,
      codeExample: {
        title: "The three, with the traps demonstrated",
        code: `// ═══════════════════════════════════════════════════════════
// Argon2 — the default choice
// ═══════════════════════════════════════════════════════════
import argon2 from "argon2";

const ARGON_OPTS = {
  type: argon2.argon2id,        // the variant to use
  memoryCost: 2 ** 16,          // 64 MiB
  timeCost: 3,
  parallelism: 4,
};

const h = await argon2.hash("hunter2", ARGON_OPTS);
// $argon2id$v=19$m=65536,p=4,t=3$wwUgd8dJ...$G8ClvXLko...
// Verified: 29ms with the package defaults, which are these.

await argon2.verify(h, "hunter2");     // true
await argon2.verify(h, "nope");        // false
argon2.needsRehash(h, ARGON_OPTS);     // false
argon2.needsRehash(h, { memoryCost: 2 ** 17 });   // true
// All four verified. Note how little code this is: no salt
// handling, no encoding, no parameter storage.


// ═══════════════════════════════════════════════════════════
// ⚠ bcrypt — and the 72-byte truncation
// ═══════════════════════════════════════════════════════════
import bcrypt from "bcrypt";

const long = "A".repeat(72);
const longer = "A".repeat(72) + "COMPLETELY-DIFFERENT-SUFFIX";

const hLong = await bcrypt.hash(long, 10);
console.log(await bcrypt.compare(longer, hLong));
// true          ← VERIFIED
//
// Read that again. A password with 27 extra characters was
// accepted against the hash of a shorter one, because bcrypt
// never looked past byte 72.

console.log(await bcrypt.compare("B".repeat(72), await bcrypt.hash("B".repeat(71), 10)));
// false         ← verified, so the boundary is exactly 72

// Argon2 does not do this:
console.log(await argon2.verify(await argon2.hash(long), longer));
// false         ← verified

// ── Who this actually hurts ─────────────────────────────────
// Not the person using "hunter2". The person whose password
// manager generated:
//
//   "correct-horse-battery-staple-magnificent-turbine-
//    quixotic-lampshade-vermillion"      (78 chars)
//
// Everything past 72 is ignored. They believe they have a
// 78-character password. They have a 72-character one.
//
// And it arrives sooner than you think, because the limit is
// 72 BYTES. A password of emoji or non-Latin script hits it
// at roughly 18 to 24 visible characters.

// ── ✓ If you use bcrypt, make the limit visible ─────────────
import { z } from "zod";

const passwordSchema = z
  .string()
  .min(12, { message: "Use at least 12 characters" })
  .max(72, { message: "Password must be 72 bytes or fewer" })
  .refine((v) => Buffer.byteLength(v, "utf8") <= 72, {
    message: "Password must be 72 bytes or fewer",
  });
//   ^^^^^^^^ .max(72) counts CHARACTERS. The refine counts
//            BYTES, which is the actual limit. Both, because
//            the first gives a better message for the common
//            case.
//
// Now a long passphrase is a 400 the user can see and act on,
// instead of a silent truncation nobody knows about.


// ═══════════════════════════════════════════════════════════
// ⚠ scrypt — in Node, and the maxmem trap
// ═══════════════════════════════════════════════════════════
import { scryptSync, randomBytes, timingSafeEqual } from "node:crypto";

// ── The trap. OWASP's recommended minimum. ──────────────────
scryptSync("pw", randomBytes(16), 64, { N: 2 ** 15, r: 8, p: 1 });
//
// RangeError: Invalid scrypt params:
//   error:030000AC:digital envelope routines::memory limit exceeded
//   code: 'ERR_CRYPTO_INVALID_SCRYPT_PARAMS'
//
// VERIFIED on Node 24.14.1. The recommended parameters throw
// out of the box.
//
// Why: scrypt needs 128 * N * r bytes.
//   N = 2^15, r = 8   ->  128 * 32768 * 8  =  33,554,432
//   Node default maxmem                    =  33,554,432
//
// Exactly at the ceiling, so it fails.
//
// Verified across three values:
//   N=2^14  needs 16MB   no maxmem: OK     21ms
//   N=2^15  needs 32MB   no maxmem: THROWS
//   N=2^16  needs 64MB   no maxmem: THROWS
//   all three with maxmem 256MB: OK, 21 / 46 / 92 ms
//
// ⚠ And the error text says nothing about maxmem. It is an
// OpenSSL message about a memory limit, so the natural
// reaction is to LOWER N. That is the wrong fix: it weakens
// your hashing to satisfy a limit you were allowed to raise.

// ── ✓ The working version, with everything you must write ──
const SCRYPT = {
  N: 2 ** 16,
  r: 8,
  p: 1,
  maxmem: 256 * 1024 * 1024,     // ← REQUIRED. 128*N*r = 64MB.
  keylen: 64,
};

export function hashPasswordScrypt(password) {
  const salt = randomBytes(16);                    // you do this
  const key = scryptSync(password, salt, SCRYPT.keylen, SCRYPT);

  // And you invent the storage format, because node:crypto
  // gives you a key, not a password hash.
  return [
    "scrypt",
    SCRYPT.N, SCRYPT.r, SCRYPT.p,
    salt.toString("base64url"),
    key.toString("base64url"),
  ].join("$");
}

export function verifyPasswordScrypt(stored, password) {
  const [scheme, N, r, p, saltB64, keyB64] = stored.split("$");
  if (scheme !== "scrypt") throw new Error("unknown scheme");

  const salt = Buffer.from(saltB64, "base64url");
  const expected = Buffer.from(keyB64, "base64url");

  const actual = scryptSync(password, salt, expected.length, {
    N: Number(N), r: Number(r), p: Number(p),
    maxmem: SCRYPT.maxmem,
    //      ^^^^^^^^^^^^^ needed here too, or verifying a hash
    //      you can create will throw
  });

  return timingSafeEqual(actual, expected);
  //     ^^^^^^^^^^^^^^^ and you have to remember this, which
  //     argon2.verify() does for you
}

export function scryptNeedsRehash(stored) {
  const [, N] = stored.split("$");
  return Number(N) < SCRYPT.N;
}
//
// Count what you just wrote that argon2 gave you for free:
// salt generation, an encoding format, parameter storage, a
// parser, a constant-time comparison, and a rehash check.
// Six chances to be subtly wrong, in security code.
//
// Which is the honest case against scrypt here. The algorithm
// is fine. The interface is a key derivation function, not a
// password hasher, and the gap is code you have to own.


// ── The decision ────────────────────────────────────────────
// Can you add a native dependency?
//   yes  ->  argon2, argon2id, and stop thinking about it
//   no   ->  scrypt, with maxmem set and the wrapper above
//
// Already using bcrypt and it works?
//   Keep it, add the 72-byte validation today, and migrate
//   opportunistically at login using the previous lesson's
//   verifyAny() pattern.`,
      },
      keyTakeaways: [
        "Argon2 is memory-hard, which is the point: RAM is what an attacker cannot cheaply multiply across GPU cores, unlike CPU time.",
        "Verified: argon2 defaults are `argon2id`, 64MB, `t=3`, `p=4`, hashing in 29ms, which is faster than bcrypt cost 12 at 216ms and harder to attack.",
        "Verified and dangerous: bcrypt silently ignores everything past 72 bytes. 72 `\"A\"` characters plus a completely different suffix compared as `true`.",
        "Verified the boundary is exactly 72 bytes: 71 characters does not match 72.",
        "That punishes the users doing the right thing, and the limit is bytes, so a non-ASCII password hits it at roughly 18 to 24 visible characters.",
        "Argon2 has no such limit, verified `false` on the same test.",
        "If you use bcrypt, add a `.max(72)` plus a byte-length refine so the truncation is a visible 400 instead of invisible.",
        "Verified: OWASP's recommended scrypt parameters `N=2^15, r=8` throw on Node 24, because `128 × N × r` is exactly 32MB and Node's default `maxmem` is 32MB.",
        "The error is an OpenSSL string about a memory limit and never mentions `maxmem`, so people lower their parameters, which is the wrong fix.",
        "Verified with `maxmem: 256MB`, `N` of 2^14, 2^15 and 2^16 took 21ms, 46ms and 92ms.",
        "`node:crypto` gives a key derivation function, not a password hasher, so scrypt costs you salt handling, an encoding format, parameter storage, a parser, a constant-time compare and a rehash check.",
      ],
      commonMistakes: [
        "Using bcrypt with no length cap. A password manager's passphrase is silently truncated at 72 bytes.",
        "Setting `.max(72)` on characters only. The limit is bytes, so a non-ASCII password still truncates.",
        "Pre-hashing with SHA-256 to dodge the 72-byte limit. It works and it is a custom scheme you now maintain forever.",
        "Copying OWASP's scrypt parameters into `node:crypto` without `maxmem`, then lowering `N` when it throws.",
        "Forgetting `maxmem` on the verify path after setting it on the hash path. Verifying a hash you can create then throws.",
        "Writing your own scrypt wrapper without `timingSafeEqual`, because the library is not doing it for you.",
        "Choosing argon2's `argon2i` or `argon2d` variant. Use `argon2id`, which is the package default.",
        "Treating \"it ships with Node\" as automatically simpler. Six pieces of security code you own is not simpler.",
      ],
      quiz: [
        {
          question: "What was verified about bcrypt and a 72-byte password?",
          options: [
            "It throws an error",
            "It silently ignores everything past 72 bytes, so 72 characters plus a completely different suffix compared as `true`",
            "It pads the input",
            "It hashes in chunks",
          ],
          correctIndex: 1,
          explanation:
            "Verified the boundary too: 71 characters does not match 72. Argon2 returned `false` on the same test.",
        },
        {
          question: "Why does the 72-byte limit hurt your best-behaved users most?",
          options: [
            "They use special characters",
            "A password manager's long passphrase is truncated, and because the limit is bytes, non-ASCII passwords hit it at roughly 18 to 24 visible characters",
            "They log in more often",
            "They reuse passwords",
          ],
          correctIndex: 1,
          explanation:
            "Add a `.max(72)` and a byte-length refine so it becomes a visible 400 instead of a silent truncation.",
        },
        {
          question: "What happens when you use OWASP's recommended scrypt parameters in `node:crypto`?",
          options: [
            "They work",
            "`N=2^15, r=8` throws `ERR_CRYPTO_INVALID_SCRYPT_PARAMS`, because it needs exactly 32MB and Node's default `maxmem` is 32MB",
            "They are silently reduced",
            "They are too weak",
          ],
          correctIndex: 1,
          explanation:
            "Verified on Node 24.14.1. Raise `maxmem`; do not lower `N`, which is what the OpenSSL error text tempts you into.",
        },
        {
          question: "Why is Argon2's memory-hardness the real argument for it?",
          options: [
            "It uses less CPU",
            "RAM is what an attacker cannot cheaply multiply across thousands of GPU cores, unlike CPU time",
            "It produces longer hashes",
            "It has more parameters",
          ],
          correctIndex: 1,
          explanation:
            "And verified, argon2's defaults hashed in 29ms against bcrypt cost 12's 216ms, so it is both faster and harder to attack.",
        },
        {
          question: "What is the honest cost of using `node:crypto`'s scrypt instead of a library?",
          options: [
            "It is slower",
            "It is a key derivation function, not a password hasher, so you own salt generation, an encoding format, parameter storage, a parser, a constant-time compare and a rehash check",
            "It is less secure",
            "It has no salt support",
          ],
          correctIndex: 1,
          explanation:
            "Six chances to be subtly wrong in security code, which is exactly what the last lesson said not to hand-roll.",
        },
      ],
    },
    {
      id: "hashing-and-the-event-loop",
      title: "Hashing, the event loop and the thread pool",
      durationMinutes: 11,
      explanation:
        "The previous lesson chose a work factor of roughly 200ms per hash. This lesson is about what that does to your server, and it is the part most authentication material skips entirely.\n\n---\n\n## The sync form blocks everything\n\nEvery password library offers a synchronous version, and it is a trap:\n\n```javascript\nbcrypt.hashSync(password, 12);\n```\n\n> Verified with a 10ms interval running alongside. `bcrypt.hash` (async) took 199ms and the event loop ticked <b>18 times</b>. `bcrypt.hashSync` took 200ms and the loop ticked <b>0 times</b>.\n>\n> Zero. For 200ms, your process answered nothing: no other request, no health check, no timer. This is Day 3's blocking lesson with the highest possible stakes, because the blocking call is on your <b>most attacked endpoint</b>. Anyone can make your server freeze for 200ms by POSTing to `/login` with any password at all, and they do not need an account.\n\nSo: never the `Sync` variant, in any password library, anywhere on a request path.\n\n---\n\n## Async does not mean free\n\nThe async version is better than blocking, and it is not unlimited.\n\n> `bcrypt.hash` and `argon2.hash` are native modules that do their work on <b>libuv's thread pool</b>, which by default has <b>4 threads</b>. That is a hard ceiling on concurrent hashing, and it is shared with `fs` operations and DNS lookups.\n>\n> Verified: one hash at cost 12 took 216ms. <b>Eight concurrent hashes took 444ms</b>, which is almost exactly two rounds of four. Not eight in parallel, and not 1.7 seconds serially: four at a time.\n\n```text\nUV_THREADPOOL_SIZE = 4 (default)\n\n8 concurrent logins at 216ms each\n  → 4 run, 4 wait\n  → 444ms total, verified\n```\n\n---\n\n## Why that matters more than it sounds\n\n> Work out the throughput. Four threads at 216ms per hash is about <b>18 logins per second</b>, per instance, no matter how many CPU cores you have. That is a real capacity number, and it is nowhere in your load test if your load test does not log in.\n>\n> It is also a denial-of-service surface. Unauthenticated requests to `/login` consume the thread pool, and the thread pool is shared, so a login flood also delays every `fs` read and every DNS lookup in the process. You cannot fix that by adding a bigger pool alone.\n\n---\n\n## What to actually do\n\nFour things, in order of how much they matter.\n\n<b>Rate limit `/login` and `/register`</b> before anything else. This is the real fix, because it caps the input rather than expanding the capacity.\n\n<b>Raise `UV_THREADPOOL_SIZE`</b> to somewhere near your core count. It is read once at startup and cannot be changed later, so it goes in your process environment, not your code.\n\n<b>Measure your work factor against this ceiling</b>, not just against a security target. Cost 14 at 932ms means roughly four logins per second per instance, which is a different decision than cost 12.\n\n<b>Consider a worker thread</b> from Day 11 for hashing if login volume is genuinely high, so authentication load cannot starve file and DNS work.\n\n> The general lesson is worth keeping: <b>a security parameter is also a capacity parameter</b>. Anything you deliberately make expensive is expensive for you too, and the cost lands on the one endpoint an attacker can hit without credentials.",
      diagram: `⚠⚠ The sync form blocks EVERYTHING

    verified, with a 10ms interval alongside:

      bcrypt.hash     (async)  199ms
        event loop ticked  18 times

      bcrypt.hashSync (sync)   200ms
        event loop ticked   0 TIMES

    ZERO.

    for 200ms the process answered nothing:
      no other request
      no health check
      no timer

    Day 3's blocking lesson, at the highest
    possible stakes, because the blocking call
    sits on your MOST ATTACKED ENDPOINT.

    anyone can freeze your server for 200ms by
    POSTing to /login with any password.
    they do not need an account.

    → never a Sync variant, in any password
      library, anywhere on a request path.


Async is better. It is not free.

    bcrypt.hash and argon2.hash are NATIVE
    modules. they work on LIBUV'S THREAD POOL.

    default size: 4 THREADS

    a hard ceiling on concurrent hashing, and it
    is SHARED with fs operations and DNS lookups.

    verified:
      1 hash  cost 12        216ms
      8 hashes concurrent    444ms

    that is almost exactly TWO ROUNDS OF FOUR.

      not 8 in parallel (216ms)
      not 8 serially   (1.7s)
      FOUR AT A TIME


Do the throughput arithmetic

    4 threads ÷ 216ms per hash
      ≈ 18 LOGINS PER SECOND
        per instance
        regardless of core count

    that is a real capacity number, and it is
    NOWHERE in your load test if your load test
    does not log in.

    and it is a DoS surface:
      unauthenticated /login requests consume
      the pool

      the pool is SHARED, so a login flood also
      delays every fs read and DNS lookup in
      the process

    you cannot fix that by growing the pool
    alone.


What to do, in order of importance

    1. RATE LIMIT /login and /register
       the real fix: it caps the INPUT instead
       of expanding capacity

    2. raise UV_THREADPOOL_SIZE toward your core
       count
       read ONCE at startup, cannot change later
       → process environment, not code

    3. measure the work factor against THIS
       ceiling, not only a security target
       cost 14 = 932ms ≈ 4 logins/sec/instance
       that is a different decision than cost 12

    4. consider a WORKER THREAD (Day 11) if
       login volume is genuinely high, so auth
       load cannot starve fs and DNS


The general lesson

    A SECURITY PARAMETER IS ALSO A CAPACITY
    PARAMETER.

    anything you deliberately make expensive is
    expensive FOR YOU TOO, and the cost lands on
    the one endpoint an attacker can hit without
    credentials.`,
      codeExample: {
        title: "Measuring the ceiling, then defending it",
        code: `import bcrypt from "bcrypt";

// ═══════════════════════════════════════════════════════════
// The measurement. Run this; do not take my word for it.
// ═══════════════════════════════════════════════════════════

// ── A) async: the loop keeps running ────────────────────────
let ticks = 0;
const iv = setInterval(() => ticks++, 10);
let t = performance.now();
await bcrypt.hash("pw", 12);
clearInterval(iv);
console.log(\`async: \${Math.round(performance.now() - t)}ms, \${ticks} ticks\`);
// VERIFIED:  async: 199ms, 18 ticks


// ── B) sync: the loop stops dead ────────────────────────────
let ticks2 = 0;
const iv2 = setInterval(() => ticks2++, 10);
t = performance.now();
bcrypt.hashSync("pw", 12);
clearInterval(iv2);
console.log(\`SYNC:  \${Math.round(performance.now() - t)}ms, \${ticks2} ticks\`);
// VERIFIED:  SYNC: 200ms, 0 ticks
//
// Same duration. Completely different consequence. During the
// sync call your server is not slow, it is absent.


// ── C) the thread pool ceiling ──────────────────────────────
console.log("UV_THREADPOOL_SIZE:", process.env.UV_THREADPOOL_SIZE ?? "(unset, default 4)");

t = performance.now();
await Promise.all(Array.from({ length: 8 }, () => bcrypt.hash("pw", 12)));
console.log(\`8 concurrent: \${Math.round(performance.now() - t)}ms\`);
// VERIFIED:  8 concurrent: 444ms
//
// One hash was 216ms. Eight took 444ms, which is two rounds
// of four, not eight in parallel and not eight in series.
//
// So your login throughput is:
//   4 threads / 0.216s  =  ~18 logins/second/instance
//
// Independent of how many CPU cores the box has, because the
// limit is the pool size and not the cores.


// ═══════════════════════════════════════════════════════════
// The defences, in order of how much they matter
// ═══════════════════════════════════════════════════════════

// ── 1. Rate limit. This is the actual fix. ──────────────────
import rateLimit from "@fastify/rate-limit";

app.register(async (auth) => {
  await auth.register(rateLimit, {
    max: 5,
    timeWindow: "1 minute",
    // Key on the credential AND the address, so one attacker
    // cannot lock out a real user by hammering their email,
    // and cannot dodge the limit by rotating addresses.
    keyGenerator: (request) =>
      \`\${request.ip}:\${request.body?.email ?? ""}\`,
  });

  auth.post("/login", { schema: { body: loginSchema } }, loginHandler);
  auth.post("/register", { schema: { body: registerSchema } }, registerHandler);
});
//
// This caps the INPUT. Everything else on this list expands
// capacity, which is a race you lose against someone with a
// botnet. Do this one first.


// ── 2. Raise the thread pool ────────────────────────────────
// package.json
//   "start": "node server.js"
//
// Dockerfile or your process manager:
//   ENV UV_THREADPOOL_SIZE=16
//
// It is read ONCE, when libuv initialises, so this does not
// work:
//
//   process.env.UV_THREADPOOL_SIZE = "16";   // ✗ too late
//   import bcrypt from "bcrypt";
//
// It has to be in the environment before the process starts.
// Size it near your core count; more threads than cores just
// adds context switching.


// ── 3. Log the queue, so you can see the ceiling ────────────
app.addHook("onResponse", async (request, reply) => {
  const ms = reply.elapsedTime;
  if (request.url === "/login" && ms > 500) {
    request.log.warn({ ms }, "slow login: thread pool likely saturated");
  }
});
// A login taking 500ms when a hash takes 216ms means it spent
// most of that time WAITING for a thread. That is the signal
// that your ceiling is the problem, and it looks nothing like
// a slow database.


// ── 4. Move hashing off the main thread pool ────────────────
// Only if login volume is genuinely high. Day 11's worker
// threads, used to stop authentication starving fs and DNS.
//
// hash-worker.js
import { parentPort } from "node:worker_threads";
import bcrypt from "bcrypt";

parentPort.on("message", async ({ id, action, password, hash }) => {
  try {
    const result = action === "hash"
      ? await bcrypt.hash(password, 12)
      : await bcrypt.compare(password, hash);
    parentPort.postMessage({ id, result });
  } catch (err) {
    parentPort.postMessage({ id, error: err.message });
  }
});
//
// A pool of these gives password hashing its own budget, so a
// login flood degrades logins and leaves your file reads and
// DNS lookups alone. It is real complexity; do not add it
// before the measurement says you need it.


// ── The trade, made explicit ────────────────────────────────
// cost 10:  54ms  ->  4 / 0.054  =  ~74 logins/sec/instance
// cost 12: 216ms  ->  4 / 0.216  =  ~18 logins/sec/instance
// cost 14: 932ms  ->  4 / 0.932  =  ~4  logins/sec/instance
//
// All from verified timings. Pick the cost with both columns
// in front of you, because the second column is the one that
// pages you at 3am.
//
// And note the asymmetry that makes rate limiting non-
// optional: an attacker pays nothing to send a login request,
// and you pay 216ms of a scarce thread to reject it.`,
      },
      keyTakeaways: [
        "Verified: `bcrypt.hash` took 199ms and the event loop ticked 18 times. `bcrypt.hashSync` took 200ms and it ticked 0 times.",
        "So a sync hash on a request path means anyone can freeze your process for 200ms by POSTing to `/login`, with no account needed.",
        "Never use a `Sync` password function anywhere on a request path, in any library.",
        "Async hashing runs on libuv's thread pool, which defaults to 4 threads and is shared with `fs` and DNS.",
        "Verified: one hash at cost 12 was 216ms and eight concurrent hashes were 444ms, which is two rounds of four rather than eight in parallel.",
        "That gives roughly 18 logins per second per instance at cost 12, independent of core count, and it is absent from any load test that does not log in.",
        "Because the pool is shared, a login flood also delays every file read and DNS lookup in the process.",
        "Rate limit `/login` and `/register` first. It caps the input, while everything else expands capacity.",
        "`UV_THREADPOOL_SIZE` is read once at libuv initialisation, so it must be in the environment before the process starts.",
        "A security parameter is also a capacity parameter: cost 14 at 932ms is about four logins per second per instance.",
        "The asymmetry is what makes rate limiting non-optional: the attacker pays nothing to send the request and you pay 216ms of a scarce thread to reject it.",
      ],
      commonMistakes: [
        "Using `hashSync` or `compareSync` because the code reads more simply. Verified to stop the event loop completely.",
        "Assuming async means unlimited concurrency. Four threads is the default ceiling and it is shared.",
        "Load testing an API without including the login endpoint, so the throughput ceiling never appears.",
        "Setting `process.env.UV_THREADPOOL_SIZE` in code. It is read once at startup, before your code runs.",
        "Raising the thread pool instead of rate limiting. That is a capacity race against someone with a botnet.",
        "Choosing a work factor purely on security guidance, without computing the logins per second it allows.",
        "Diagnosing slow logins as a slow database when the time is spent queueing for a thread.",
        "Adding worker threads for hashing before measuring whether the ceiling is actually the problem.",
      ],
      quiz: [
        {
          question: "What was verified about `bcrypt.hashSync` versus `bcrypt.hash`?",
          options: [
            "The sync version is faster",
            "Both took about 200ms, but the event loop ticked 18 times during the async call and 0 times during the sync one",
            "The sync version uses more memory",
            "They are identical",
          ],
          correctIndex: 1,
          explanation:
            "So a sync hash lets anyone freeze the process for 200ms by hitting `/login`, without needing an account.",
        },
        {
          question: "One hash at cost 12 takes 216ms. Eight concurrent hashes took 444ms. Why?",
          options: [
            "Caching",
            "Native hashing runs on libuv's thread pool, which defaults to 4 threads, so eight hashes are two rounds of four",
            "The CPU throttled",
            "bcrypt batches internally",
          ],
          correctIndex: 1,
          explanation:
            "Verified. That gives roughly 18 logins per second per instance, independent of core count.",
        },
        {
          question: "Why does a login flood also slow down unrelated file reads?",
          options: [
            "Disk contention",
            "The thread pool is shared between native hashing, `fs` operations and DNS lookups",
            "The event loop is blocked",
            "Node serialises all I/O",
          ],
          correctIndex: 1,
          explanation:
            "Which is part of why growing the pool is not a complete answer and rate limiting is the real fix.",
        },
        {
          question: "Where does `UV_THREADPOOL_SIZE` have to be set?",
          options: [
            "Anywhere before the first hash",
            "In the process environment before startup, because libuv reads it once at initialisation",
            "In `package.json`",
            "In the Fastify options",
          ],
          correctIndex: 1,
          explanation:
            "`process.env.UV_THREADPOOL_SIZE = \"16\"` in your code is too late to have any effect.",
        },
        {
          question: "What is the asymmetry that makes rate limiting non-optional here?",
          options: [
            "Attackers have faster hardware",
            "The attacker pays nothing to send a login request, and you pay 216ms of a scarce shared thread to reject it",
            "Passwords are short",
            "Hashing cannot be cached",
          ],
          correctIndex: 1,
          explanation:
            "Every other defence expands capacity, which is a race you lose. Rate limiting caps the input instead.",
        },
      ],
    },
    {
      id: "node-crypto-and-timing",
      title: "node:crypto, randomness and timing leaks",
      durationMinutes: 12,
      explanation:
        "Three primitives you will use constantly, and one leak that is far bigger than people expect.\n\n---\n\n## `randomUUID()`\n\n<b>UUID</b> (Universally Unique Identifier).\n\n```javascript\nimport { randomUUID } from \"node:crypto\";\nrandomUUID();     // \"550e8400-e29b-41d4-a716-446655440000\"\n```\n\nVerified: version 4, so 122 random bits.\n\n> Fine as an identifier, and <b>not a secret</b>. A UUID appears in URLs, logs and error reports, and \"unguessable\" is not the same as \"designed to be a credential\". Use `randomBytes` for anything that grants access.\n\n---\n\n## `randomBytes()`\n\n<b>Cryptographically secure random bytes</b> (random bytes from the operating system's CSPRNG, suitable for security use).\n\n```javascript\nrandomBytes(32).toString(\"hex\");     // 64 hex characters, verified\n```\n\nThis is what reset tokens, verification tokens and session identifiers are made of. Use 32 bytes; it is not expensive and there is no reason to economise.\n\n> Never `Math.random()`. It is a fast non-cryptographic generator, its output is predictable from previous outputs, and it was never intended for this. The failure mode is not a slightly weaker token, it is a token an attacker can compute.\n\n---\n\n## `timingSafeEqual()`\n\n<b>Timing-safe comparison</b> (a comparison whose duration does not depend on where the inputs first differ).\n\n> `a === b` on strings returns as soon as it finds a difference, so comparing a secret takes measurably longer when the first character is right. `timingSafeEqual` always reads everything.\n>\n> And it has a sharp edge. Verified: different lengths throw `ERR_CRYPTO_TIMING_SAFE_EQUAL_LENGTH`. So you cannot point it at user input directly, because <b>the throw is itself the leak</b>: the caller learns the secret's length from whether they got an exception. The standard fix is to hash both sides to a fixed length first, then compare:\n>\n> ```javascript\n> const sha = (s) => createHash(\"sha256\").update(s).digest();\n> const safeEq = (a, b) => timingSafeEqual(sha(a), sha(b));\n> ```\n>\n> Verified working on inputs of different lengths.\n\n---\n\n## The leak that is not subtle at all\n\nThis is the most important thing in this lesson. Here is a login function that looks completely reasonable:\n\n```javascript\nconst user = await findByEmail(email);\nif (!user) return false;                     // no hashing happens\nreturn bcrypt.compare(password, user.passwordHash);\n```\n\nVerified timings, averaged over ten attempts each:\n\n```text\nexisting email  →  207.2 ms\nunknown email  →    0.0 ms\n```\n\n> That is not a timing attack requiring statistics and a local network. It is a <b>200 millisecond</b> difference, readable from anywhere on the internet, on one request. Anyone can feed your login endpoint a list of email addresses and get back a clean list of which ones have accounts, from an endpoint that returns an identical error message in both cases.\n>\n> The fix is to always do the work. Compare against a pre-computed dummy hash when the user does not exist, then decide. Verified afterwards: <b>208.4ms and 218.2ms</b>, which is indistinguishable in practice.\n\nThis matters beyond login. Day 16 taught validating at the boundary, and this is the same idea for time: <b>every response should cost about the same, whatever the answer is</b>.\n\n---\n\n## Which hash for which job\n\nOne thing that confuses people who just learned \"never use SHA-256\":\n\n> SHA-256 is <b>wrong for passwords and right for tokens</b>. A password is low-entropy and guessable, so hashing it must be slow. A refresh token is already 32 random bytes, so there is nothing to guess and nothing for slowness to buy. Verified: a 32-byte token base64url-encodes to 43 characters, and `sha256` of it is what you store, so a database leak does not hand over usable credentials.\n\n```text\nPassword  → low entropy  → slow hash (Argon2, bcrypt)\nToken     → 32 random bytes → fast hash (SHA-256)\n```",
      diagram: `randomUUID(): an ID, not a secret

    verified: version 4, so 122 random bits.

    a UUID appears in URLs, logs and error
    reports.

    "unguessable" ≠ "designed to be a credential"

    → use randomBytes for anything that GRANTS
      ACCESS.


randomBytes(): the actual secret generator

    randomBytes(32).toString("hex")
      →  64 hex characters   (verified)

    reset tokens · verification tokens
    session IDs · API keys

    use 32 bytes. it is cheap. do not economise.

    ⚠ never Math.random()
      fast, non-cryptographic, and PREDICTABLE
      from previous outputs.

      the failure mode is not a weaker token.
      it is a token an attacker can COMPUTE.


timingSafeEqual(): and its sharp edge

    a === b returns as soon as it finds a
    difference, so comparing a secret takes
    measurably LONGER when the first character
    is right.

    timingSafeEqual always reads everything.

    ⚠ verified: different lengths THROW
      ERR_CRYPTO_TIMING_SAFE_EQUAL_LENGTH

      so you cannot point it at user input,
      because THE THROW IS THE LEAK: the caller
      learns the secret's LENGTH from whether
      they got an exception.

    ✓ hash both sides to a fixed length first

      const sha = s =>
        createHash("sha256").update(s).digest();
      const safeEq = (a,b) =>
        timingSafeEqual(sha(a), sha(b));

      verified on different-length inputs.


⚠⚠ The leak that is not subtle at all

    const user = await findByEmail(email);
    if (!user) return false;      ← no hashing
    return bcrypt.compare(pw, user.passwordHash);

    VERIFIED, averaged over 10 attempts:

      existing email    207.2 ms
      unknown email       0.0 ms

    this is not a timing attack needing
    statistics and a local network.

    it is TWO HUNDRED MILLISECONDS, readable from
    anywhere on the internet, on ONE request.

    anyone feeds your login endpoint a list of
    emails and gets back a clean list of which
    ones have accounts

      from an endpoint whose error message is
      IDENTICAL in both cases.


✓ The fix: always do the work

    const h = users.get(email) ?? DUMMY_HASH;
    const ok = await bcrypt.compare(password, h);
    return users.has(email) && ok;

    VERIFIED after:  208.4ms  and  218.2ms
      indistinguishable in practice

    Day 16 validated at the boundary.
    this is the same idea for TIME:

      EVERY RESPONSE SHOULD COST ABOUT THE SAME,
      WHATEVER THE ANSWER IS.


Which hash for which job

    you just learned "never use SHA-256".
    that was about PASSWORDS.

    PASSWORD   low entropy, guessable
               → SLOW hash (Argon2, bcrypt)

    TOKEN      already 32 random bytes
               nothing to guess, so slowness
               buys nothing
               → FAST hash (SHA-256)

    verified: 32 bytes → 43 base64url chars,
    and you store sha256 of it, so a database
    leak hands over no usable credential.`,
      codeExample: {
        title: "The primitives, and the 200ms leak",
        code: `import {
  randomUUID, randomBytes, timingSafeEqual, createHash,
} from "node:crypto";
import bcrypt from "bcrypt";


// ── randomUUID: identifiers ─────────────────────────────────
randomUUID();       // "8ced3f20-c607-4a01-b0df-d997f4834f7e"
//                                 ^ verified: version 4
//
// ✓ a request id, a row id, a correlation id
// ✗ a password reset token, an API key, a session id
//
// The distinction is not entropy, it is intent. UUIDs get
// logged, put in URLs and pasted into support tickets,
// because that is what identifiers are for.


// ── randomBytes: secrets ────────────────────────────────────
randomBytes(32).toString("hex");        // 64 chars, verified
randomBytes(32).toString("base64url"); // 43 chars, verified
//
// base64url is the better choice for anything going in a URL:
// shorter, and no + / = to encode.

// ✗ Never:
//   Math.random().toString(36).slice(2)
//
// That is not "less random". Math.random() is a fast
// non-cryptographic PRNG whose future output can be derived
// from its past output, so a token from it is computable, not
// merely guessable.


// ── timingSafeEqual, and why you cannot use it directly ─────
const stored = Buffer.from("a-32-char-secret-token-abcdefgh");

timingSafeEqual(stored, Buffer.from("short"));
// throws: ERR_CRYPTO_TIMING_SAFE_EQUAL_LENGTH
//         "Input buffers must have the same byte length"
// VERIFIED.
//
// Which is a leak of its own. If a wrong-length guess throws
// and a right-length guess returns false, the caller has
// learned the length of your secret by watching which
// response they got.

// ✓ Fixed-length compare
const sha = (s) => createHash("sha256").update(s).digest();
const safeEqual = (a, b) => timingSafeEqual(sha(a), sha(b));

safeEqual("a-32-char-secret-token-abcdefgh", "short");   // false
safeEqual("a-32-char-secret-token-abcdefgh",
          "a-32-char-secret-token-abcdefgh");            // true
// Both verified. Any length in, constant time, no throw.


// ═══════════════════════════════════════════════════════════
// ⚠ The 200ms account enumeration leak
// ═══════════════════════════════════════════════════════════

// ── ✗ The version almost everyone writes first ──────────────
async function loginLeaky(email, password) {
  const user = await findByEmail(email);
  if (!user) return false;              // ← returns instantly
  return bcrypt.compare(password, user.passwordHash);
}
//
// The response body is identical either way:
//   401 { "error": "Invalid email or password" }
//
// The response TIME is not. Verified, averaged over 10 runs:
//
//   existing email    207.2 ms
//   unknown email       0.0 ms
//
// Two hundred milliseconds. That does not need statistics or
// a low-latency network; it is visible in a browser dev tools
// waterfall.
//
// So an attacker POSTs a list of 100,000 email addresses with
// the password "x" and sorts by response time. They now have
// your user list, and they got it from an endpoint that was
// carefully written to give the same error message.


// ── ✓ Always do the work ────────────────────────────────────
// Computed once at startup, never at request time.
const DUMMY_HASH = await bcrypt.hash(
  randomBytes(32).toString("hex"),
  BCRYPT_COST,
);

async function loginSafe(email, password) {
  const user = await findByEmail(email);

  // Hash against a real hash with the same cost, so the work
  // happens whether or not the account exists.
  const hash = user?.passwordHash ?? DUMMY_HASH;
  const passwordOk = await bcrypt.compare(password, hash);

  // Only now combine the two facts.
  if (!user || !passwordOk) return null;
  return user;
}
// Verified afterwards:
//   existing email    208.4 ms
//   unknown email     218.2 ms
//
// Indistinguishable in practice. Note the dummy hash must use
// the SAME cost as your real hashes, or you have swapped a
// 200ms difference for a 150ms one.


// ── The same rule, elsewhere ────────────────────────────────
// Password reset: always respond
//   "If an account exists, we have sent an email."
// AND always take about the same time. A version that skips
// the token generation and the email queue for unknown
// addresses leaks exactly the same way login did.

app.post("/password-reset", async (request, reply) => {
  const { email } = request.body;
  const user = await findByEmail(email);

  if (user) {
    const token = randomBytes(32).toString("base64url");
    await db.insert(resetTokens).values({
      userId: user.id,
      tokenHash: createHash("sha256").update(token).digest("hex"),
      expiresAt: new Date(Date.now() + 15 * 60_000),
    });
    await queueEmail(user.email, token);       // queue, do not send
  }

  // Same body, same status, whether or not the account exists.
  return reply.code(202).send({
    message: "If an account exists, we have sent a reset email.",
  });
});
//
// Queueing rather than sending inline matters for the timing
// too: an inline SMTP call for real users only would put the
// difference straight back.


// ── Which hash for which job ────────────────────────────────
// PASSWORD: low entropy, guessable, so make it slow.
await bcrypt.hash(password, 12);              // 216ms, verified

// TOKEN: already 32 random bytes, so there is nothing to
// guess and nothing slowness can buy. A fast hash is correct.
const refreshToken = randomBytes(32).toString("base64url");  // 43 chars
const stored = createHash("sha256").update(refreshToken).digest("hex");
//
// Store the sha256. If the database leaks, an attacker has
// hashes of tokens and no way back to the tokens themselves,
// so nothing in the dump is a usable credential.
//
// And look up by that hash, so the comparison is an indexed
// equality check rather than a scan plus a compare:
const [row] = await db
  .select()
  .from(refreshTokens)
  .where(eq(refreshTokens.tokenHash, stored));
//
// This is a case where a fast hash is not a compromise. It is
// the right tool, for a different job.`,
      },
      keyTakeaways: [
        "Verified: `randomUUID()` is version 4. It is an identifier, not a credential, because identifiers get logged and put in URLs.",
        "`randomBytes(32)` is what secrets are made of. Verified 64 hex characters or 43 base64url characters.",
        "Never `Math.random()` for a token. Its future output is derivable from its past, so the token is computable rather than merely guessable.",
        "Verified: `timingSafeEqual` throws `ERR_CRYPTO_TIMING_SAFE_EQUAL_LENGTH` on different lengths, and that throw leaks the secret's length.",
        "Hash both sides to a fixed length first, then compare. Verified working across different input lengths.",
        "The big one, verified: a login that returns early for unknown emails took 207.2ms for existing accounts and 0.0ms for unknown ones.",
        "That is a 200ms difference readable from anywhere, so identical error messages do not prevent account enumeration.",
        "Fix it by comparing against a pre-computed dummy hash of the same cost. Verified afterwards: 208.4ms and 218.2ms.",
        "The dummy hash must use the same work factor, or you have traded a 200ms gap for a smaller one.",
        "Every response should cost about the same whatever the answer is. That includes queueing the reset email rather than sending it inline.",
        "SHA-256 is wrong for passwords and right for tokens: a 32-byte token has nothing to guess, so store its `sha256` and look up by that.",
      ],
      commonMistakes: [
        "Using a UUID as a password reset token or API key. It is an identifier by design and it ends up in logs.",
        "`Math.random()` for anything security-relevant. The output is predictable, not just weak.",
        "Passing user input straight to `timingSafeEqual`. Different lengths throw, and the throw is the leak.",
        "Returning early from login when the user does not exist. Verified 207ms versus 0ms, which is account enumeration on a plate.",
        "Believing an identical error message is enough. The timing is a separate channel and it is louder.",
        "Using a cheap dummy hash for the not-found path, which restores a smaller version of the same gap.",
        "Sending the reset email inline for real users only, putting the timing difference straight back.",
        "Concluding from the password lesson that SHA-256 is never appropriate. It is exactly right for hashing a high-entropy token.",
      ],
      quiz: [
        {
          question: "A login returns early when the email is unknown. What was measured?",
          options: [
            "A difference of a few microseconds, needing statistics",
            "207.2ms for an existing email and 0.0ms for an unknown one, which is readable from anywhere on one request",
            "No measurable difference",
            "A difference only on localhost",
          ],
          correctIndex: 1,
          explanation:
            "So an identical error message does not stop enumeration. An attacker sorts a list of emails by response time.",
        },
        {
          question: "How do you fix that, and what did the fix measure?",
          options: [
            "Add a random delay",
            "Compare against a pre-computed dummy hash of the same cost, so the work always happens. Verified 208.4ms and 218.2ms.",
            "Return 404 instead",
            "Rate limit the endpoint",
          ],
          correctIndex: 1,
          explanation:
            "The dummy hash must use the same work factor, or you trade a 200ms gap for a smaller one.",
        },
        {
          question: "Why can you not pass user input straight to `timingSafeEqual`?",
          options: [
            "It only accepts strings",
            "Different lengths throw `ERR_CRYPTO_TIMING_SAFE_EQUAL_LENGTH`, and the throw itself reveals the secret's length",
            "It is synchronous",
            "It needs a key",
          ],
          correctIndex: 1,
          explanation:
            "Verified. Hash both sides to a fixed length first, then compare.",
        },
        {
          question: "Why is SHA-256 the right choice for hashing a refresh token but wrong for a password?",
          options: [
            "Tokens are shorter",
            "A password is low-entropy and guessable so hashing must be slow; a 32-byte token has nothing to guess, so slowness buys nothing",
            "Tokens are not secret",
            "SHA-256 is reversible for tokens",
          ],
          correctIndex: 1,
          explanation:
            "Storing the `sha256` also means a database leak yields no usable credential, and lets you look up by an indexed equality check.",
        },
        {
          question: "Why is `randomUUID()` a poor choice for a reset token?",
          options: [
            "It is too short",
            "It is designed as an identifier, so it ends up in URLs, logs and support tickets. Use `randomBytes` for anything that grants access.",
            "It is not random",
            "It cannot be hashed",
          ],
          correctIndex: 1,
          explanation:
            "Verified version 4, so the entropy is reasonable. The problem is intent and where identifiers end up.",
        },
      ],
    },
    {
      id: "sessions-and-cookies",
      title: "Sessions and cookie flags",
      durationMinutes: 12,
      explanation:
        "## Session\n\n<b>Session</b> (server-side state identifying a logged-in user, referenced by an opaque identifier the client holds).\n\n```text\nBrowser holds:   session_id=abc123\nServer holds:    abc123 → user_id=42\n\nGET /profile\nCookie: session_id=abc123\n    ↓\nlook up abc123\n    ↓\nuser 42\n```\n\n> The defining property is that the identifier is <b>opaque</b>: it carries no information and means nothing without the server's copy. Everything good about sessions follows from that. Logout is `DELETE FROM sessions WHERE id = ...` and the credential is dead immediately. Changing a user's role takes effect on their next request. A stolen session can be revoked the moment you notice.\n>\n> This is the default worth choosing for a normal web application, and the reason most material skips past it is fashion rather than engineering.\n\n---\n\n## The cookie flags\n\n<b>`HttpOnly`</b> (prevents JavaScript in the browser from reading the cookie).\n\n> This is your only real defence-in-depth against cross-site scripting stealing the session. If an attacker gets script running on your page they can still <b>act</b> as the user, but they cannot <b>exfiltrate</b> the credential and use it later from elsewhere. That difference is the difference between an incident and a breach.\n>\n> Note what it implies: a token you store in `localStorage` so your JavaScript can attach it to requests is, by construction, readable by any script on the page. That is the honest security case for cookies over `localStorage`.\n\n<b>`Secure`</b> (send the cookie only over HTTPS).\n\n> Without it the cookie is sent in cleartext on any accidental plain-HTTP request, which is enough to hand the session to anyone on the network path. Set it always in production. Locally you need it off, which is a reason to key it off `NODE_ENV` rather than remembering.\n\n<b>`SameSite`</b> (controls whether the cookie is sent on cross-site requests).\n\n> This is the one that actually stops <b>CSRF</b>, and it is worth knowing what each value does. `Strict` never sends the cookie cross-site, which also means arriving from a link in an email logs you out visually. `Lax` sends it on top-level navigations but not on cross-site form posts or background requests, which blocks the CSRF cases that matter while staying usable, and it is the modern browser default. `None` sends it always and <b>requires</b> `Secure`.\n>\n> `Lax` is the right default. Reach for `None` only when a genuinely cross-site flow needs it, and understand that you have then taken responsibility for CSRF tokens yourself.\n\n<b>`Max-Age` / `Expires`</b> decide whether the session survives closing the browser. No expiry means a session cookie that dies with the tab.\n\n---\n\n## Cookie signing\n\n<b>Cookie signing</b> (attaching a cryptographic signature so the server can detect that a cookie value was modified).\n\n> Two things people get wrong here. First, <b>signing is not encryption</b>: a signed cookie is still readable by the client, so it protects integrity and not confidentiality. Second, and more useful: if your session id is 32 random bytes from `randomBytes`, signing adds almost nothing, because an attacker cannot forge a value that exists in your session store anyway. Signing matters when the cookie <b>contains</b> data you rely on, which is a design you mostly should not have.\n\n---\n\n## Session fixation\n\n> One rule that is easy to miss and genuinely important: <b>issue a new session id when privilege changes</b>. On login, and on any elevation, destroy the old session and create a fresh one.\n>\n> Otherwise an attacker who can set a cookie in the victim's browser plants a session id they know, waits for the victim to log in, and now shares the authenticated session. That is <b>session fixation</b>, and it costs one line to prevent.",
      diagram: `Session: the id is OPAQUE

    browser   session_id=abc123
    server    abc123 → user_id=42

    the id carries NO information and means
    nothing without the server's copy.

    everything good follows from that:

      logout        DELETE the row.
                    credential dead IMMEDIATELY
      role change   effective NEXT REQUEST
      theft         revocable the moment you
                    notice

    the default worth choosing for a normal web
    app. most material skips it out of fashion,
    not engineering.


HttpOnly: the difference between incident
          and breach

    script on your page CAN still ACT as the user

    it CANNOT EXFILTRATE the credential and use
    it later from elsewhere

    and note the implication:

      a token in localStorage so your JS can
      attach it is, BY CONSTRUCTION, readable by
      any script on the page

      that is the honest security case for
      cookies over localStorage


Secure: HTTPS only

    without it, one accidental plain-HTTP request
    sends the session in cleartext to anyone on
    the network path.

    always on in production.
    off locally → key it off NODE_ENV rather than
    remembering.


SameSite: this is what stops CSRF

    Strict   never sent cross-site
             ↳ arriving from an email link looks
               like being logged out

    Lax      sent on top-level NAVIGATIONS
             not on cross-site form posts or
               background requests
             ↳ blocks the CSRF cases that matter,
               stays usable
             ↳ the modern browser default

    None     always sent. REQUIRES Secure.
             ↳ you have now taken on CSRF tokens
               yourself

    → Lax is the right default.


Max-Age / Expires

    absent  →  dies with the tab
    set     →  survives closing the browser


⚠ Cookie signing: two misunderstandings

    1. SIGNING IS NOT ENCRYPTION
       a signed cookie is still READABLE.
       integrity, not confidentiality.

    2. if your session id is 32 random bytes,
       signing adds almost NOTHING

       an attacker cannot forge a value that
       EXISTS IN YOUR SESSION STORE anyway

       signing matters when the cookie CONTAINS
       data you rely on, which is a design you
       mostly should not have


⚠ Session fixation: one line, easily missed

    ISSUE A NEW SESSION ID WHEN PRIVILEGE
    CHANGES.

    on login, and on any elevation:
      destroy the old session
      create a fresh one

    otherwise an attacker who can set a cookie in
    the victim's browser plants an id THEY KNOW,
    waits for the victim to log in, and shares
    the authenticated session.`,
      codeExample: {
        title: "A session implementation with the flags that matter",
        code: `import Fastify from "fastify";
import cookie from "@fastify/cookie";
import { randomBytes, createHash } from "node:crypto";
import { eq, and, gt, isNull } from "drizzle-orm";

const app = Fastify({ logger: true });
await app.register(cookie);

const SESSION_COOKIE = "sid";
const SESSION_TTL_MS = 7 * 24 * 60 * 60 * 1000;      // 7 days


// ── The cookie options, in one place ────────────────────────
const isProd = process.env.NODE_ENV === "production";

const cookieOptions = {
  httpOnly: true,      // no script can read it
  secure: isProd,      // HTTPS only in production; off locally,
                       // keyed off the environment so nobody
                       // has to remember
  sameSite: "lax",     // blocks cross-site form posts and
                       // background requests, still lets an
                       // email link work
  path: "/",
  maxAge: SESSION_TTL_MS / 1000,   // seconds, not ms
};
// Defining these once is not tidiness. A cookie set anywhere
// else with different flags is a hole, and it will be set
// somewhere else eventually.


// ── Creating a session ──────────────────────────────────────
async function createSession(db, userId, request) {
  // 32 random bytes. Not a UUID, not Math.random().
  const raw = randomBytes(32).toString("base64url");      // 43 chars

  await db.insert(sessions).values({
    // Store the hash, not the value. A database leak then
    // yields no usable session. Fast hash is correct here:
    // there are 256 bits of entropy and nothing to guess.
    idHash: createHash("sha256").update(raw).digest("hex"),
    userId,
    userAgent: request.headers["user-agent"]?.slice(0, 255),
    ip: request.ip,
    expiresAt: new Date(Date.now() + SESSION_TTL_MS),
  });

  return raw;
}


// ── Login, with fixation prevented ──────────────────────────
app.post("/login", {
  schema: { body: z.object({ email: z.email(), password: z.string() }) },
}, async (request, reply) => {
  const user = await loginSafe(request.body.email, request.body.password);
  //           ^^^^^^^^^^^^^^^ the dummy-hash version from the
  //           previous lesson, so this endpoint does not leak
  //           which emails exist by timing
  if (!user) return reply.code(401).send({ error: "Invalid email or password" });

  // ⚠ Session fixation: destroy whatever session the browser
  // arrived with before creating the new one. If an attacker
  // planted a session id they know, it stops being useful
  // here.
  const existing = request.cookies[SESSION_COOKIE];
  if (existing) await destroySession(db, existing);

  const sid = await createSession(db, user.id, request);

  return reply
    .setCookie(SESSION_COOKIE, sid, cookieOptions)
    .send({ user: { id: user.id, email: user.email } });
});


// ── The hook that resolves the session ──────────────────────
app.decorateRequest("user", null);
//  ^^ Day 15: declare it, so V8 sees one request shape.

async function loadSession(request, reply) {
  const raw = request.cookies[SESSION_COOKIE];
  if (!raw) return reply.code(401).send({ error: "Unauthorized" });

  const idHash = createHash("sha256").update(raw).digest("hex");

  const [row] = await db
    .select({ userId: sessions.userId, expiresAt: sessions.expiresAt })
    .from(sessions)
    .where(and(
      eq(sessions.idHash, idHash),
      gt(sessions.expiresAt, new Date()),      // expiry in the query
      isNull(sessions.revokedAt),              // revocation too
    ));
  //
  // Both conditions in the WHERE rather than checked after.
  // Day 17's rule and Day 18's first lesson: a row you may
  // not use is a row that does not exist.

  if (!row) {
    return reply
      .clearCookie(SESSION_COOKIE, cookieOptions)
      .code(401)
      .send({ error: "Unauthorized" });
    // Clear the cookie too, or the browser keeps sending a
    // dead session on every request forever.
  }

  request.user = { id: row.userId };
}


// ── Logout: the thing JWTs cannot do ────────────────────────
app.post("/logout", { preHandler: loadSession }, async (request, reply) => {
  await destroySession(db, request.cookies[SESSION_COOKIE]);

  return reply
    .clearCookie(SESSION_COOKIE, cookieOptions)
    .send({ ok: true });
});

async function destroySession(db, raw) {
  const idHash = createHash("sha256").update(raw).digest("hex");
  await db.delete(sessions).where(eq(sessions.idHash, idHash));
}
// One DELETE. The credential is dead on the next request.
// Hold on to how simple this is; two lessons from now it is
// the entire argument.


// ── "Log out everywhere", also nearly free ──────────────────
app.post("/logout-all", { preHandler: loadSession }, async (request, reply) => {
  await db.delete(sessions).where(eq(sessions.userId, request.user.id));
  return reply.clearCookie(SESSION_COOKIE, cookieOptions).send({ ok: true });
});
// And "show me my active sessions", because you stored the
// user agent and address:
app.get("/sessions", { preHandler: loadSession }, async (request) => {
  return db
    .select({
      id: sessions.id,
      userAgent: sessions.userAgent,
      ip: sessions.ip,
      createdAt: sessions.createdAt,
    })
    .from(sessions)
    .where(eq(sessions.userId, request.user.id));
});
// Every account-security feature users expect falls out of
// having the state on the server.


// ── ✗ Cookie flags gone wrong ───────────────────────────────
// reply.setCookie("sid", sid);
//   No flags at all. Readable by script, sent over HTTP,
//   sent cross-site. Three vulnerabilities, one line.
//
// reply.setCookie("sid", sid, { httpOnly: true, sameSite: "none" });
//   sameSite: "none" without secure: true. Browsers reject
//   the cookie outright, so this presents as "login silently
//   does not work" rather than as a security warning.
//
// reply.setCookie("session", JSON.stringify({ userId: 42, role: "admin" }));
//   The session IS the cookie. Signed or not, the client
//   controls their own role at that point, and if it is only
//   signed they can still read it. Keep the id opaque and the
//   state on the server.`,
      },
      keyTakeaways: [
        "A session id is opaque: it carries no information and is useless without the server's record. Everything good about sessions follows from that.",
        "Logout is a `DELETE`, role changes take effect next request, and a stolen session is revocable immediately.",
        "`HttpOnly` means a cross-site scripting bug can act as the user but cannot exfiltrate the credential for later use elsewhere.",
        "That is also the honest argument against `localStorage` tokens: a token your script can read is a token any script can read.",
        "`Secure` prevents one accidental plain-HTTP request from handing the session to the network. Key it off `NODE_ENV`.",
        "`SameSite` is what actually stops CSRF. `Lax` is the right default; `Strict` breaks email links; `None` requires `Secure` and hands CSRF back to you.",
        "Signing is not encryption. A signed cookie is still readable, and with a 32-random-byte id it adds almost nothing anyway.",
        "Issue a new session id on login and on any privilege change, or an attacker who can plant a cookie shares the authenticated session. That is session fixation.",
        "Store the session id's `sha256`, not the id, so a database leak yields no usable session.",
        "Put expiry and revocation in the `WHERE` clause, and clear the cookie on failure so the browser stops sending a dead session.",
      ],
      commonMistakes: [
        "Setting a session cookie with no flags. That is three vulnerabilities in one line.",
        "`sameSite: \"none\"` without `secure: true`. Browsers reject the cookie, so it looks like a broken login rather than a security problem.",
        "Putting user data in the cookie instead of an opaque id. Signed or not, the client then holds their own role.",
        "Not rotating the session id at login, leaving session fixation open.",
        "Storing the raw session id in the database, so a leak is a set of working credentials.",
        "Checking expiry in application code after fetching the row instead of in the query.",
        "Not clearing the cookie on a 401, so the browser sends a dead session on every request indefinitely.",
        "Defining cookie options at each call site. One of them will eventually differ, and that one is the hole.",
      ],
      quiz: [
        {
          question: "What makes a session id's opacity the important property?",
          options: [
            "It is shorter",
            "It means nothing without the server's record, which is why logout is a `DELETE` and revocation is immediate",
            "It cannot be stolen",
            "It is faster to verify",
          ],
          correctIndex: 1,
          explanation:
            "Every good property of sessions, including role changes taking effect next request, follows from the state being on the server.",
        },
        {
          question: "What does `HttpOnly` actually buy you?",
          options: [
            "It prevents XSS",
            "A script on your page can still act as the user, but cannot exfiltrate the credential to use later from elsewhere",
            "It encrypts the cookie",
            "It stops CSRF",
          ],
          correctIndex: 1,
          explanation:
            "That is the difference between an incident and a breach, and it is why a `localStorage` token is weaker by construction.",
        },
        {
          question: "Which flag stops CSRF, and what is the right default?",
          options: [
            "`HttpOnly`, always on",
            "`SameSite`, and `Lax` is the right default because it blocks cross-site posts while still letting an email link work",
            "`Secure`, set to true",
            "`Path`, scoped narrowly",
          ],
          correctIndex: 1,
          explanation:
            "`Strict` makes arriving from a link look like being logged out. `None` requires `Secure` and hands CSRF protection back to you.",
        },
        {
          question: "Why does signing add little to a 32-random-byte session id?",
          options: [
            "Signing is insecure",
            "An attacker cannot forge a value that exists in your session store, so integrity protection on an opaque id buys almost nothing",
            "The id is already encrypted",
            "Cookies cannot be signed",
          ],
          correctIndex: 1,
          explanation:
            "Signing matters when the cookie contains data you rely on, which is a design to avoid. And signing is not encryption: the value stays readable.",
        },
        {
          question: "Why issue a new session id at login?",
          options: [
            "For cleanliness",
            "Otherwise an attacker who can plant a cookie sets an id they know, waits for the victim to log in, and shares the authenticated session",
            "To reset the expiry",
            "Because the old one is signed differently",
          ],
          correctIndex: 1,
          explanation:
            "That is session fixation, and it costs one line: destroy the incoming session before creating the new one.",
        },
      ],
    },
    {
      id: "session-storage",
      title: "Where sessions live",
      durationMinutes: 10,
      explanation:
        "A session needs somewhere to live, and the choice is less dramatic than it is usually made to sound.\n\n---\n\n## Redis\n\n<b>Redis</b> (an in-memory data store used for caching, queues, counters and session storage).\n\n```text\nBrowser → session id → Node → Redis\n```\n\n> The feature that makes Redis the natural fit is <b>TTL</b>. `SET sid ... EX 604800` and expiry is the store's problem, not yours: no cron job, no cleanup query, no table full of dead rows. Combined with sub-millisecond lookups on a hot path that runs for every authenticated request, that is a good match.\n>\n> The trade is a second piece of infrastructure to run, monitor and secure, and one that is memory-bound. And by default Redis is not durable, so a restart logs everyone out. That is usually acceptable for sessions and worth deciding on purpose rather than discovering.\n\n---\n\n## PostgreSQL\n\n```text\nsessions\n────────────\nid_hash\nuser_id\nexpires_at\nrevoked_at\n```\n\n> The argument for the database you already have is stronger than it gets credit for. No new infrastructure, sessions survive a restart, you can join them to users, and you can inspect them with the same tools you already use at 3am. Day 17's warning applies though: this is a query on <b>every authenticated request</b>, so the lookup column must be indexed and it consumes a connection from the same pool your application logic uses.\n>\n> And you own expiry. A row with `expires_at` in the past is dead but still present, so you need both the `WHERE` clause that ignores it and a periodic delete that removes it, or the table grows forever.\n\n---\n\n## Choosing\n\n```text\nAlready running Redis, or many instances   →  Redis\nOne database and no Redis yet             →  PostgreSQL\n```\n\n> Start with the database. Adding Redis later is a small, contained change, because the session store is behind one interface with three operations. Adding infrastructure before you need it is the expensive direction.\n\n---\n\n## The thing to avoid\n\n> <b>Never store sessions in process memory</b> once you run more than one instance. An in-memory `Map` works perfectly in development and then fails in a way that is genuinely hard to diagnose: with two instances behind a load balancer, roughly half of requests find no session, so users are randomly logged out and it looks intermittent rather than structural.\n>\n> This is Day 15's stateless-instance idea arriving as a bug. Anything you keep in a module-level variable is per-instance, and \"works on my machine\" is guaranteed because your machine runs one.\n\n---\n\n## Rolling expiry\n\nTwo models, and the distinction is a product decision rather than a technical one:\n\n```text\nAbsolute  →  expires 7 days after login, always\nRolling   →  expiry extends on each request\n```\n\nRolling keeps active users logged in and means a stolen session stays valid as long as the attacker keeps using it. A common compromise is a rolling window with an absolute cap, so an active session refreshes but nothing lives past thirty days without a fresh login.",
      diagram: `Redis: the feature is TTL

    SET sid ... EX 604800

    expiry becomes the STORE'S problem:
      no cron job
      no cleanup query
      no table of dead rows

    plus sub-millisecond lookups on a path that
    runs for EVERY authenticated request.

    trade:
      a second piece of infrastructure to run,
        monitor and secure
      memory-bound
      not durable by default → a restart logs
        everyone out

    that last one is usually fine for sessions,
    and worth DECIDING rather than discovering.


PostgreSQL: stronger case than it gets credit for

    sessions
      id_hash · user_id
      expires_at · revoked_at

    ✓ no new infrastructure
    ✓ survives a restart
    ✓ joins to users
    ✓ inspectable with the tools you already use
      at 3am

    ⚠ Day 17 applies: this is a query on EVERY
      authenticated request

      index the lookup column
      it takes a connection from the SAME POOL
        as your application logic

    ⚠ and you own expiry

      a row with expires_at in the past is dead
      but still THERE

      so you need BOTH
        the WHERE clause that ignores it
        a periodic delete that removes it

      or the table grows forever.


Choosing

    already running Redis, or many instances
      →  Redis

    one database, no Redis yet
      →  PostgreSQL

    start with the database.

    adding Redis later is small and contained,
    because the store sits behind ONE interface
    with THREE operations.

    adding infrastructure before you need it is
    the expensive direction.


⚠⚠ Never: sessions in process memory

    an in-memory Map works PERFECTLY in dev, then
    fails in a way that is genuinely hard to
    diagnose.

    two instances behind a load balancer
      → roughly HALF of requests find no session
      → users randomly logged out
      → looks INTERMITTENT rather than structural

    Day 15's stateless-instance idea, as a bug.

    anything in a module-level variable is
    PER-INSTANCE, and "works on my machine" is
    guaranteed, because your machine runs one.


Absolute vs rolling expiry

    absolute   7 days after login, always
    rolling    expiry extends on each request

    rolling keeps active users logged in AND
    means a stolen session stays valid as long as
    the attacker keeps using it.

    common compromise:
      rolling window + absolute cap
      → refreshes while active
      → nothing lives past 30 days without a
        fresh login

    this is a PRODUCT decision, not a technical
    one.`,
      codeExample: {
        title: "One interface, two stores",
        code: `// ── The interface. Three operations, and that is all. ───────
// plugins/session-store.js
//
//   get(idHash)     -> { userId } | null
//   create(idHash, userId, ttlMs)
//   destroy(idHash)
//   destroyAllForUser(userId)
//
// Keeping it this small is what makes swapping stores a
// contained change rather than a project.


// ── PostgreSQL ──────────────────────────────────────────────
import fp from "fastify-plugin";
import { and, eq, gt, isNull, lt } from "drizzle-orm";

export default fp(async function sessionStore(app) {
  app.decorate("sessions", {
    async get(idHash) {
      const [row] = await app.db
        .select({ userId: sessions.userId })
        .from(sessions)
        .where(and(
          eq(sessions.idHash, idHash),
          gt(sessions.expiresAt, new Date()),
          isNull(sessions.revokedAt),
        ));
      return row ?? null;
    },

    async create(idHash, userId, ttlMs, meta) {
      await app.db.insert(sessions).values({
        idHash, userId,
        expiresAt: new Date(Date.now() + ttlMs),
        userAgent: meta?.userAgent, ip: meta?.ip,
      });
    },

    async destroy(idHash) {
      await app.db.delete(sessions).where(eq(sessions.idHash, idHash));
    },

    async destroyAllForUser(userId) {
      await app.db.delete(sessions).where(eq(sessions.userId, userId));
    },
  });

  // ── You own cleanup. This is the part people forget. ──────
  // The WHERE clause above means expired rows are never
  // USED. It does not mean they are gone. Without this the
  // table grows forever and every index gets slower.
  const cleanup = setInterval(async () => {
    try {
      await app.db.delete(sessions).where(lt(sessions.expiresAt, new Date()));
    } catch (err) {
      app.log.error({ err }, "session cleanup failed");
    }
  }, 60 * 60 * 1000);

  cleanup.unref();
  //      ^^^^^^^ Day 11: an un-unref'd interval keeps the
  //      event loop alive, so the process will not exit.

  app.addHook("onClose", async () => clearInterval(cleanup));
});

// And the index that makes this viable, from Day 17:
//   CREATE UNIQUE INDEX sessions_id_hash_idx ON sessions (id_hash);
//   CREATE INDEX sessions_user_id_idx ON sessions (user_id);
//
// Without the first one, every authenticated request is a
// sequential scan of your sessions table. It will be fast in
// development with four rows.


// ── Redis ───────────────────────────────────────────────────
import { createClient } from "redis";

export default fp(async function sessionStore(app) {
  const redis = createClient({ url: process.env.REDIS_URL });
  redis.on("error", (err) => app.log.error({ err }, "redis error"));
  await redis.connect();

  app.decorate("sessions", {
    async get(idHash) {
      const userId = await redis.get(\`sess:\${idHash}\`);
      return userId ? { userId: Number(userId) } : null;
    },

    async create(idHash, userId, ttlMs) {
      await redis.set(\`sess:\${idHash}\`, String(userId), { PX: ttlMs });
      //                                                 ^^^^^^^^^^
      // Expiry handed to the store. No cleanup interval, no
      // dead rows, no query filtering on a timestamp. This is
      // the actual reason to choose Redis.

      // For "log out everywhere", keep a set per user.
      await redis.sAdd(\`user-sess:\${userId}\`, idHash);
    },

    async destroy(idHash) {
      await redis.del(\`sess:\${idHash}\`);
    },

    async destroyAllForUser(userId) {
      const ids = await redis.sMembers(\`user-sess:\${userId}\`);
      if (ids.length) await redis.del(ids.map((i) => \`sess:\${i}\`));
      await redis.del(\`user-sess:\${userId}\`);
    },
  });

  app.addHook("onClose", async () => { await redis.quit(); });
});
//
// Note the asymmetry. Redis made expiry free and made "log
// out everywhere" into work you do by hand, because there is
// no WHERE user_id = 42. Postgres was the reverse. Neither is
// better; they trade different chores.


// ── ✗✗ The one that destroys a weekend ──────────────────────
const sessions = new Map();          // module-level

app.post("/login", async (request, reply) => {
  const sid = randomBytes(32).toString("base64url");
  sessions.set(sid, { userId: user.id });
  return reply.setCookie("sid", sid, cookieOptions).send({ ok: true });
});
//
// Works perfectly. Every test passes. Ship it behind a load
// balancer with two instances and:
//
//   request 1  ->  instance A  ->  login, session in A's Map
//   request 2  ->  instance B  ->  B's Map is empty  ->  401
//   request 3  ->  instance A  ->  fine
//   request 4  ->  instance B  ->  401
//
// The report you get is "I keep getting logged out randomly",
// which sounds like a cookie problem, a clock problem or a
// flaky network. It is none of those. It is that half your
// instances have never heard of this session.
//
// And it gets worse with a rolling deploy, because every new
// pod starts with an empty Map, so every deploy logs out
// everyone who lands on a new instance.
//
// Day 15's point restated: an instance must be able to serve
// any request. Module-level state breaks that quietly.


// ── Rolling expiry with an absolute cap ─────────────────────
const ROLLING_MS = 7 * 24 * 60 * 60 * 1000;      // extend by 7 days
const ABSOLUTE_MS = 30 * 24 * 60 * 60 * 1000;    // never past 30

async function loadSession(request, reply) {
  const raw = request.cookies.sid;
  if (!raw) return reply.code(401).send({ error: "Unauthorized" });

  const idHash = createHash("sha256").update(raw).digest("hex");
  const session = await app.sessions.get(idHash);
  if (!session) {
    return reply.clearCookie("sid", cookieOptions)
      .code(401).send({ error: "Unauthorized" });
  }

  request.user = { id: session.userId };

  // Extend, but never past the absolute cap from first login.
  const cap = new Date(session.createdAt.getTime() + ABSOLUTE_MS);
  const next = new Date(Math.min(Date.now() + ROLLING_MS, cap.getTime()));

  // Only write when it moves meaningfully, or you have added
  // an UPDATE to every single authenticated request.
  if (next.getTime() - session.expiresAt.getTime() > 60 * 60 * 1000) {
    await app.sessions.touch(idHash, next);
  }
}
// That last condition matters. Naive rolling expiry writes to
// the database on every request, which turns a read-heavy hot
// path into a write-heavy one for no benefit.`,
      },
      keyTakeaways: [
        "Redis's real advantage is TTL: expiry becomes the store's job, so there is no cleanup query and no table of dead rows.",
        "Redis costs you a second piece of infrastructure and is not durable by default, so a restart logs everyone out. Decide that rather than discover it.",
        "PostgreSQL needs no new infrastructure, survives restarts, joins to users and is inspectable with the tools you already have.",
        "With Postgres you own expiry: the `WHERE` clause stops expired rows being used, and a periodic delete stops the table growing forever.",
        "Session lookup runs on every authenticated request, so index the lookup column and remember it takes a connection from your application pool.",
        "Start with the database. The store sits behind one interface with three operations, so adding Redis later is contained.",
        "Never keep sessions in a module-level `Map` once you run more than one instance.",
        "That failure presents as \"I keep getting randomly logged out\", which sounds like a cookie or network problem and is neither.",
        "Every rolling deploy also logs out everyone who lands on a new pod, because each pod starts with an empty map.",
        "Rolling expiry keeps active users logged in and keeps a stolen session alive while it is used. A rolling window with an absolute cap is the usual compromise.",
        "Only write the extended expiry when it moves meaningfully, or you have added an `UPDATE` to every authenticated request.",
      ],
      commonMistakes: [
        "An in-memory session map. It works in development because development runs one instance.",
        "Not indexing the session lookup column, so every authenticated request scans the table.",
        "Relying only on the `expires_at` predicate with no periodic delete, so the table grows forever.",
        "Adding Redis at the start for a single-instance application, before there is anything it solves.",
        "Not knowing Redis is non-durable by default, then being surprised that a restart logged everyone out.",
        "Writing the rolling expiry on every request, turning a read path into a write path.",
        "Rolling expiry with no absolute cap, so a session that is used continuously never expires.",
        "Forgetting `unref()` on the cleanup interval, so the process refuses to exit.",
      ],
      quiz: [
        {
          question: "What is Redis's real advantage for sessions?",
          options: [
            "It is more secure",
            "TTL. Expiry becomes the store's job, so there is no cleanup query and no table of dead rows.",
            "It is durable",
            "It joins to other tables",
          ],
          correctIndex: 1,
          explanation:
            "Sub-millisecond lookups help too, but TTL is the chore it removes. Postgres makes you own expiry.",
        },
        {
          question: "Why does an in-memory session map fail so confusingly in production?",
          options: [
            "Memory leaks",
            "With two instances behind a load balancer, roughly half of requests find no session, so it looks like random logouts rather than a structural bug",
            "The map is not thread-safe",
            "Cookies are not shared",
          ],
          correctIndex: 1,
          explanation:
            "And every rolling deploy logs out anyone who lands on a new pod, because each starts empty.",
        },
        {
          question: "You store sessions in Postgres with an `expires_at` predicate. What is still missing?",
          options: [
            "Nothing",
            "A periodic delete. The predicate stops expired rows being used; it does not remove them, so the table grows forever.",
            "A unique constraint",
            "A foreign key",
          ],
          correctIndex: 1,
          explanation:
            "And index the lookup column, since this query runs on every authenticated request.",
        },
        {
          question: "Which store should you start with?",
          options: [
            "Redis, for performance",
            "The database you already have. The store is one interface with three operations, so adding Redis later is a contained change.",
            "In-memory, then migrate",
            "Both, for redundancy",
          ],
          correctIndex: 1,
          explanation:
            "Adding infrastructure before you need it is the expensive direction.",
        },
        {
          question: "What is the trade-off with rolling expiry?",
          options: [
            "It is less secure in every way",
            "It keeps active users logged in, and keeps a stolen session valid as long as the attacker keeps using it. Hence a rolling window with an absolute cap.",
            "It requires Redis",
            "It breaks `SameSite`",
          ],
          correctIndex: 1,
          explanation:
            "Also only write the new expiry when it moves meaningfully, or every authenticated request becomes a write.",
        },
      ],
    },
    {
      id: "jwt-structure",
      title: "JWT: structure, decoding and verification",
      durationMinutes: 12,
      explanation:
        "## JWT\n\n<b>JWT (JSON Web Token)</b> (a signed token carrying claims that a holder of the key can verify without looking anything up).\n\n```text\nHeader.Payload.Signature\nxxxxx.yyyyy.zzzzz\n```\n\n> The property that makes JWTs interesting is <b>self-contained</b>: the token carries the claims, so verification needs the key and nothing else. No database, no Redis, no network call. That is genuinely useful across service boundaries, and everything difficult about JWTs is the same property seen from the other side, which is the next lesson.\n\n---\n\n## The three parts\n\n```javascript\n// header\n{ \"alg\": \"HS256\", \"typ\": \"JWT\" }\n\n// payload\n{ \"sub\": \"123\", \"role\": \"user\", \"iat\": 1788537961, \"exp\": 1788538561 }\n```\n\nThe signature proves the header and payload were produced by someone holding the key.\n\n---\n\n## A JWT is not encrypted\n\nThis is the single most misunderstood thing about them.\n\n> Verified, with no secret involved:\n>\n> ```text\n> Buffer.from(payloadPart, \"base64url\").toString()\n> → {\"sub\":\"123\",\"role\":\"user\",\"email\":\"rajan@example.com\",...}\n> ```\n>\n> base64url is an <b>encoding</b>, not a cipher. Anyone holding the token reads every claim, including the user's browser, anything in `localStorage`, your access logs if a token ever lands in a URL, and any third-party script on your page. The signature protects <b>integrity</b>, so nobody can change a claim, and does nothing for <b>confidentiality</b>.\n>\n> So no passwords, no card numbers, no internal identifiers you would rather not publish, and nothing you would not put on a postcard.\n\n---\n\n## `decode` is not `verify`\n\n> Verified, and worth seeing: take a valid token, corrupt the last six characters of the signature, and `jwt.decode()` returns <b>every claim, cheerfully</b>. `jwt.verify()` on the same token throws `JsonWebTokenError: invalid signature`.\n>\n> `decode` parses base64. It checks nothing. So any code path that reaches for `decode` because `verify` was inconvenient has no authentication at all, and it will look like it works, because the claims are right there.\n\n```text\ndecode  →  parses. trusts everything.\nverify  →  checks signature, expiry, and what you tell it to.\n```\n\n---\n\n## What `verify` must be told\n\nVerified behaviours on `jsonwebtoken@9.0.3`:\n\n```text\ncorrupted signature       →  JsonWebTokenError: invalid signature\nexpired token             →  TokenExpiredError: jwt expired\nalg: none                 →  JsonWebTokenError: jwt signature is required\nHS256 token, algorithms:[RS256]  →  JsonWebTokenError: invalid algorithm\n```\n\n> The good news is that the historic `alg: \"none\"` attack is closed: the library refuses it rather than accepting an unsigned token as valid. Verified.\n>\n> The one you still have to handle yourself is <b>pinning the algorithm</b>. Always pass `algorithms: [\"HS256\"]` or whichever you actually use. The attack it prevents is algorithm confusion: with an RS256 setup, the public key is public, so an attacker signs a token with HS256 using that public key as the shared secret, and a server that accepts whatever `alg` the token claims will verify it. Verified that pinning rejects a mismatch with `invalid algorithm`.\n\nAlso verify `exp`, and `iss` and `aud` if more than one service issues tokens, so a token minted for a different audience is not accepted here.",
      diagram: `The property: SELF-CONTAINED

    Header.Payload.Signature

    the token carries the claims, so verification
    needs THE KEY AND NOTHING ELSE.

      no database
      no Redis
      no network call

    genuinely useful across service boundaries.

    and everything difficult about JWTs is this
    same property seen from the other side.
      → next lesson


⚠⚠ A JWT IS NOT ENCRYPTED

    verified, no secret involved:

      Buffer.from(payload, "base64url").toString()
      → {"sub":"123","role":"user",
         "email":"rajan@example.com", ...}

    base64url is an ENCODING, not a cipher.

    everyone holding the token reads every claim:
      the user's browser
      anything in localStorage
      your ACCESS LOGS, if a token lands in a URL
      any third-party script on your page

    the signature protects INTEGRITY
      → nobody can CHANGE a claim
    it does nothing for CONFIDENTIALITY
      → everybody can READ one

    so: nothing you would not put on a postcard.


⚠ decode ≠ verify

    verified: corrupt the last 6 chars of the
    signature, then

      jwt.decode(tampered)
        →  returns EVERY CLAIM, cheerfully

      jwt.verify(tampered, secret)
        →  JsonWebTokenError: invalid signature

    decode parses base64. IT CHECKS NOTHING.

    so any code path that reaches for decode
    because verify was inconvenient has NO
    AUTHENTICATION, and it will look like it
    works, because the claims are right there.


What verify does, verified on 9.0.3

    corrupted signature
      JsonWebTokenError: invalid signature

    expired
      TokenExpiredError: jwt expired

    alg: none
      JsonWebTokenError: jwt signature is
                         required
      ← the historic attack is CLOSED. good.

    HS256 token, algorithms: ["RS256"]
      JsonWebTokenError: invalid algorithm


⚠ The one you must still do: PIN THE ALGORITHM

    always pass algorithms: ["HS256"]

    the attack is ALGORITHM CONFUSION:

      RS256 setup → the PUBLIC key is public

      attacker signs a token with HS256, using
      that public key as the shared secret

      a server that accepts whatever alg the
      TOKEN claims will verify it

    verified: pinning rejects the mismatch with
    "invalid algorithm".


Also verify

    exp        always
    iss, aud   if more than one service issues
               tokens, so a token minted for a
               different audience is not accepted
               here`,
      codeExample: {
        title: "What is readable, what is checked, and what you must pin",
        code: `import jwt from "jsonwebtoken";
// Verified with jsonwebtoken 9.0.3

const secret = process.env.JWT_SECRET;


// ── Signing ─────────────────────────────────────────────────
const token = jwt.sign(
  { sub: "123", role: "user", email: "rajan@example.com" },
  secret,
  { expiresIn: "10m", algorithm: "HS256", issuer: "users-api", audience: "web" },
);


// ── ⚠ Anyone can read the payload. Verified. ────────────────
const [headerPart, payloadPart] = token.split(".");

Buffer.from(headerPart, "base64url").toString();
// {"alg":"HS256","typ":"JWT"}

Buffer.from(payloadPart, "base64url").toString();
// {"sub":"123","role":"user","email":"rajan@example.com",
//  "iat":1788537961,"exp":1788538561}
//
// No secret. No library. Two lines of Node, or paste it into
// any online JWT decoder.
//
// So this is a data leak:
jwt.sign({ sub: user.id, email: user.email, ssn: user.ssn }, secret);
//                                          ^^^^^^^^^^^^^^ published
//
// And so are the subtler ones: an internal customer id, a
// feature flag that reveals an unannounced product, a plan
// name that tells a competitor your pricing tiers.
//
// Keep the payload to what the client is allowed to know:
jwt.sign({ sub: String(user.id), role: user.role }, secret, { expiresIn: "10m" });


// ── ⚠ decode does not verify. Verified. ─────────────────────
const tampered = token.slice(0, -6) + "AAAAAA";

jwt.decode(tampered);
// { sub: '123', role: 'user', email: 'rajan@example.com', ... }
//   ^^ every claim, from a token with a broken signature

try { jwt.verify(tampered, secret); }
catch (err) { console.log(err.name, err.message); }
// JsonWebTokenError invalid signature
//
// ✗ So this is not authentication. It is reading a header the
//   client controls:
//
//     const claims = jwt.decode(token);
//     request.user = { id: claims.sub, role: claims.role };
//
//   An attacker writes their own token with role: "admin",
//   does not sign it at all, and your server believes it.
//   And it will pass every test, because a real token decodes
//   correctly too.


// ── ⚠ alg: none — closed, verified ──────────────────────────
const noneToken =
  Buffer.from(JSON.stringify({ alg: "none", typ: "JWT" })).toString("base64url")
  + "." +
  Buffer.from(JSON.stringify({ sub: "1", role: "admin" })).toString("base64url")
  + ".";

jwt.decode(noneToken);            // { sub: '1', role: 'admin' }

try { jwt.verify(noneToken, secret); }
catch (err) { console.log(err.name, err.message); }
// JsonWebTokenError jwt signature is required
//
// Verified: the library rejects it. The historic attack where
// you strip the signature and set alg to none does not work
// on jsonwebtoken 9. Good, and it is not a reason to stop
// pinning algorithms, because of the next one.


// ── ⚠ Algorithm confusion — you must prevent this ───────────
const hs = jwt.sign({ sub: "1" }, secret, { algorithm: "HS256" });

try { jwt.verify(hs, secret, { algorithms: ["RS256"] }); }
catch (err) { console.log(err.name, err.message); }
// JsonWebTokenError invalid algorithm        ← verified

jwt.verify(hs, secret, { algorithms: ["HS256"] });
// { sub: '1', iat: 1788537961 }              ← verified
//
// Why this matters on an RS256 setup:
//
//   You sign with a private key and verify with a public key.
//   The public key is, by definition, public.
//
//   An attacker takes your public key, treats it as an HMAC
//   shared secret, and signs their own token with HS256.
//
//   A server that verifies with "whatever alg the token says"
//   uses the public key as an HMAC key, and the signature
//   checks out. The attacker just minted a valid token.
//
// Pinning algorithms closes it, and it is one option.


// ── ✓ The verification you should actually write ────────────
export function verifyAccessToken(token) {
  return jwt.verify(token, secret, {
    algorithms: ["HS256"],       // pin it. never omit this.
    issuer: "users-api",         // minted by us
    audience: "web",             // minted for this client
    clockTolerance: 5,           // seconds, for clock skew
  });
}

async function authenticate(request, reply) {
  const header = request.headers.authorization;
  if (!header?.startsWith("Bearer ")) {
    return reply.code(401).send({ error: "Unauthorized" });
  }

  try {
    const claims = verifyAccessToken(header.slice(7));
    request.user = { id: Number(claims.sub), role: claims.role };
  } catch (err) {
    // TokenExpiredError is worth distinguishing, so the client
    // knows to refresh rather than to show a login screen.
    if (err.name === "TokenExpiredError") {
      return reply.code(401).send({ error: "token_expired" });
    }
    request.log.warn({ err: err.name }, "token verification failed");
    return reply.code(401).send({ error: "Unauthorized" });
  }
}
// Both are 401, from Day 18's first lesson: the credential is
// the problem, not the permission. The distinguishing code in
// the body is what lets a client refresh instead of logging
// the user out.


// ── The claims that are not optional ────────────────────────
// exp   expiry. Without it the token is valid forever, and a
//       token valid forever is a password you cannot change.
//       Verified error: TokenExpiredError: jwt expired.
//
// sub   who the token is about.
//
// iss   who minted it. Matters as soon as two services issue
//       tokens, so service A's token is not accepted by
//       service B by accident.
//
// aud   who it is for. Stops a token issued for your mobile
//       app being replayed against your admin API.
//
// iat   when. Lets you reject tokens issued before a
//       password change, which is the cheapest revocation
//       mechanism a JWT has. More on that next.`,
      },
      keyTakeaways: [
        "A JWT's defining property is that it is self-contained: verification needs the key and nothing else, with no database or network call.",
        "Verified: the payload decodes with two lines of Node and no secret. base64url is an encoding, not a cipher.",
        "The signature protects integrity, not confidentiality. Nobody can change a claim, and everybody can read one.",
        "So the payload must contain nothing you would not put on a postcard, including internal ids, plan names and unannounced flags.",
        "Verified: `jwt.decode()` returned every claim from a token with a corrupted signature, while `jwt.verify()` threw `invalid signature`.",
        "So any code path using `decode` for authentication has none, and it passes tests because real tokens decode correctly too.",
        "Verified: `alg: \"none\"` is rejected by `jsonwebtoken` 9 with `jwt signature is required`. That historic attack is closed.",
        "You must still pin `algorithms`. Verified that an HS256 token against `algorithms: [\"RS256\"]` throws `invalid algorithm`.",
        "The attack it prevents is algorithm confusion: on an RS256 setup, an attacker signs with HS256 using your public key as the shared secret.",
        "Verify `exp` always, and `iss` and `aud` once more than one service issues tokens, so a token for another audience is not accepted.",
        "Distinguish `TokenExpiredError` in the response body so a client refreshes rather than showing a login screen.",
      ],
      commonMistakes: [
        "Putting anything sensitive in the payload. It is published to anyone holding the token, including your access logs.",
        "Using `jwt.decode()` to read a user's identity. That is trusting a client-controlled string and it looks like it works.",
        "Omitting the `algorithms` option, leaving algorithm confusion open on any asymmetric setup.",
        "Signing without `expiresIn`. A token valid forever is a password you cannot change.",
        "Ignoring `iss` and `aud` in a multi-service system, so one service's token is silently accepted by another.",
        "Treating an expired token as 403. The client then never refreshes.",
        "Assuming a signature means the payload is private. It means the payload is unmodified.",
        "Believing `alg: none` is still a live threat and treating that as the only algorithm concern. The live one is confusion, and pinning fixes both.",
      ],
      quiz: [
        {
          question: "What does a JWT signature protect?",
          options: [
            "The confidentiality of the payload",
            "Its integrity. Nobody can change a claim; verified that anyone can read one with two lines of Node and no secret.",
            "Both integrity and confidentiality",
            "Only the header",
          ],
          correctIndex: 1,
          explanation:
            "base64url is an encoding, not a cipher. The payload must contain nothing you would not put on a postcard.",
        },
        {
          question: "What did `jwt.decode()` return for a token with a corrupted signature?",
          options: [
            "`null`",
            "Every claim, cheerfully, while `jwt.verify()` threw `invalid signature`",
            "An error",
            "Only the header",
          ],
          correctIndex: 1,
          explanation:
            "Verified. So `decode`-based authentication is no authentication, and it passes tests because real tokens decode correctly too.",
        },
        {
          question: "Why pass `algorithms: [\"HS256\"]` to `verify` when `alg: none` is already rejected?",
          options: [
            "Performance",
            "To prevent algorithm confusion: on an RS256 setup an attacker signs with HS256 using your public key as the shared secret",
            "The library requires it",
            "To support key rotation",
          ],
          correctIndex: 1,
          explanation:
            "Verified: an HS256 token against `algorithms: [\"RS256\"]` throws `invalid algorithm`. Pinning closes it.",
        },
        {
          question: "What is `aud` for?",
          options: [
            "Audit logging",
            "Naming who the token is for, so a token issued for your mobile app cannot be replayed against your admin API",
            "The algorithm",
            "The expiry window",
          ],
          correctIndex: 1,
          explanation:
            "Along with `iss`, it stops one service's tokens being silently accepted by another once you have more than one issuer.",
        },
        {
          question: "Why distinguish `TokenExpiredError` in your 401 body?",
          options: [
            "For logging",
            "So a client knows to refresh its token instead of showing a login screen",
            "Because it should be a 403",
            "To trigger a retry",
          ],
          correctIndex: 1,
          explanation:
            "Both are 401, because the credential is the problem. The code in the body is what makes the client's behaviour correct.",
        },
      ],
    },
    {
      id: "jwt-revocation",
      title: "The revocation problem",
      durationMinutes: 11,
      explanation:
        "The last lesson's selling point was that a JWT needs no lookup. This lesson is the bill for that.\n\n---\n\n## The problem, stated plainly\n\n```text\nJWT expires in 1 hour\nUser clicks \"Log out\"\n     ↓\nToken is still valid for 59 minutes\n```\n\n> There is nowhere to delete it. That is not an oversight in the design, it is <b>the design</b>: a token is valid because the signature checks out, and the signature will keep checking out until `exp` passes. Your server has no record of the token, which was the entire point, and consequently no way to say no.\n\nThat is not only logout. Every one of these has the same shape:\n\n```text\nUser logs out                    → token still works\nAdmin bans an account            → token still works\nUser changes their password      → token still works\nYou revoke an admin's access     → token still works\nA token is posted publicly       → token still works\n```\n\n> The password one deserves a moment. A user notices a suspicious login, changes their password, and feels safe. The attacker's access token keeps working until it expires. Almost nobody tells the user that.\n\n---\n\n## The four real options\n\n<b>1. Short expiry.</b> The standard answer, and it is mitigation rather than a fix: a 10-minute access token means a 10-minute window. Good enough for a stolen token, not good enough for banning an account, because \"banned in up to ten minutes\" is not banned.\n\n<b>2. A denylist.</b> Keep revoked token ids in Redis until they expire, and check on every request.\n\n> Look at what that is. You have added a store, a lookup on every request, and operational state, in order to get back the thing sessions had for free. <b>You have rebuilt sessions, with extra steps and a worse story.</b> Worse because the token still carries its claims, so a role change is not picked up even though you are now doing a lookup anyway.\n\n<b>3. A version counter.</b> Put `tokenVersion` on the user row and in the token, and reject when they differ. One integer bumps to invalidate every token for that user. Still a lookup per request, but it is a lookup you may already be doing, and it handles the password-change case cleanly.\n\n<b>4. Accept it.</b> Short access tokens, revocation on the refresh token instead. This is the real answer, and the next lesson.\n\n---\n\n## When a JWT genuinely earns its place\n\n> Not \"my SPA talks to my API\". That is one client and one server sharing a database, which is exactly where a session is simpler and better.\n>\n> A JWT earns its keep when a <b>different</b> party has to verify the token: several services with no shared session store, a third party you cannot give database access to, or a gateway making an authorization decision without a round trip. There the self-contained property buys something real.\n\n---\n\n## The honest summary\n\n```text\nSession: revocation is a DELETE\nJWT:     revocation is an architecture\n```\n\n> If your reason for choosing JWTs is that they scale better, price the denylist you will eventually need. If your reason is that everyone uses them, that is fashion. And if you do need them, the right structure is not \"make access tokens revocable\", it is <b>a short access token you do not try to revoke, plus a refresh token you can</b>.",
      diagram: `The bill for "no lookup required"

    JWT expires in 1 hour
    user clicks Log out
       ↓
    valid for 59 more minutes

    there is NOWHERE TO DELETE IT.

    not an oversight. THE DESIGN.

      a token is valid because the signature
      checks out, and it will keep checking out
      until exp passes

      your server has no record of the token,
      which WAS THE POINT, and therefore no way
      to say no


Same shape, five problems

    user logs out              → still works
    admin bans an account      → still works
    user changes password      → still works
    you revoke admin access    → still works
    a token is posted publicly → still works

    ⚠ the password one:

      a user notices a suspicious login, changes
      their password, feels safe.

      the attacker's access token keeps working
      until it expires.

      almost nobody tells the user that.


The four real options

    1. SHORT EXPIRY
       mitigation, not a fix.
       10 minutes = a 10-minute window.
       fine for a stolen token.
       not fine for a ban: "banned within ten
       minutes" is not banned.

    2. A DENYLIST
       revoked ids in Redis until they expire,
       checked every request.

       ⚠ look at what that is:
         a store
         a lookup on every request
         operational state

         to get back what sessions had FOR FREE.

       YOU HAVE REBUILT SESSIONS, WITH EXTRA
       STEPS AND A WORSE STORY.

       worse, because the token still carries its
       claims, so a ROLE CHANGE is still not
       picked up, even though you are now doing
       a lookup anyway.

    3. A VERSION COUNTER
       tokenVersion on the user row AND in the
       token. reject when they differ.
       one integer invalidates every token for
       that user.
       still a lookup, but often one you already
       do, and it handles password-change
       cleanly.

    4. ACCEPT IT
       short access tokens, revocation on the
       REFRESH token instead.
       the real answer. → next lesson


When a JWT genuinely earns its place

    ✗ "my SPA talks to my API"
      one client, one server, one database.
      a session is simpler AND better.

    ✓ a DIFFERENT PARTY must verify:
        several services, no shared session store
        a third party you cannot give DB access
        a gateway deciding without a round trip

      there, self-contained buys something real.


The honest summary

    SESSION   revocation is a DELETE
    JWT       revocation is an ARCHITECTURE

    choosing JWTs because they "scale better"?
      price the denylist you will need.

    choosing them because everyone does?
      that is fashion.

    and if you DO need them, the structure is not
    "make access tokens revocable". it is:

      a SHORT access token you do not try to
      revoke
      + a REFRESH token you can`,
      codeExample: {
        title: "Three revocation strategies, and what each really costs",
        code: `// ═══════════════════════════════════════════════════════════
// The problem
// ═══════════════════════════════════════════════════════════
app.post("/logout", async (request, reply) => {
  return reply.send({ ok: true });
});
//
// That is a complete JWT logout endpoint. It does nothing,
// because there is nothing to do. The client throws its token
// away; the token remains valid.
//
// Compare with the sessions lesson:
//
//   await db.delete(sessions).where(eq(sessions.idHash, idHash));
//
// One statement, and the credential is dead. Hold that
// comparison in mind for the rest of this lesson.


// ═══════════════════════════════════════════════════════════
// Option 2: a denylist. Watch what it turns into.
// ═══════════════════════════════════════════════════════════
import { randomUUID } from "node:crypto";

// Every token needs an id so it can be named later.
function signAccessToken(user) {
  return jwt.sign(
    { sub: String(user.id), role: user.role, jti: randomUUID() },
    secret,
    { expiresIn: "15m", algorithm: "HS256" },
  );
}

app.post("/logout", { preHandler: authenticate }, async (request, reply) => {
  const { jti, exp } = request.tokenClaims;

  // Keep it only as long as the token could still be used.
  const ttlSeconds = exp - Math.floor(Date.now() / 1000);
  if (ttlSeconds > 0) {
    await redis.set(\`revoked:\${jti}\`, "1", { EX: ttlSeconds });
  }

  return reply.send({ ok: true });
});

async function authenticate(request, reply) {
  // ... verify signature as in the previous lesson ...
  const claims = verifyAccessToken(token);

  // And now a network call on EVERY authenticated request.
  if (await redis.get(\`revoked:\${claims.jti}\`)) {
    return reply.code(401).send({ error: "Unauthorized" });
  }

  request.user = { id: Number(claims.sub), role: claims.role };
}
//
// Count what this costs:
//   · Redis, running and monitored
//   · a lookup on every authenticated request
//   · a jti on every token
//   · TTL bookkeeping
//
// And what it bought: revocation, which sessions had for
// free.
//
// Now the part that makes it worse than sessions. Promote a
// user to admin:
//
//   UPDATE users SET role = 'admin' WHERE id = 42;
//
// Their token still says role: "user", and nothing above
// notices, because the denylist answers "is this token
// revoked?" and not "who is this user now?". With a session
// you read the row and the new role is simply there.
//
// So you have paid the lookup and not received the benefit.
// If you are going to do a lookup, do a useful one.


// ═══════════════════════════════════════════════════════════
// Option 3: a version counter. Better value per lookup.
// ═══════════════════════════════════════════════════════════
// users table gains:  token_version INTEGER NOT NULL DEFAULT 0

function signAccessToken(user) {
  return jwt.sign(
    { sub: String(user.id), role: user.role, ver: user.tokenVersion },
    secret,
    { expiresIn: "15m", algorithm: "HS256" },
  );
}

async function authenticate(request, reply) {
  const claims = verifyAccessToken(token);

  const [user] = await db
    .select({ id: users.id, role: users.role, tokenVersion: users.tokenVersion,
              bannedAt: users.bannedAt })
    .from(users)
    .where(eq(users.id, Number(claims.sub)));

  if (!user || user.bannedAt) return reply.code(401).send({ error: "Unauthorized" });
  if (user.tokenVersion !== claims.ver) {
    return reply.code(401).send({ error: "token_expired" });
  }

  // Take the role from the DATABASE, not the token.
  request.user = { id: user.id, role: user.role };
}

// Invalidate every token for one user, with one integer:
async function revokeAllTokens(userId) {
  await db
    .update(users)
    .set({ tokenVersion: sql\`\${users.tokenVersion} + 1\` })
    .where(eq(users.id, userId));
}
//
// Called on: password change, ban, "log out everywhere",
// and any suspicious-activity response.
//
// ⚠ And this is the case worth wiring up on day one:
async function changePassword(db, userId, newPassword) {
  await db.transaction(async (tx) => {
    await tx.update(users)
      .set({
        passwordHash: await argon2.hash(newPassword, ARGON_OPTS),
        tokenVersion: sql\`\${users.tokenVersion} + 1\`,
      })
      .where(eq(users.id, userId));

    // And the refresh tokens, from the next lesson.
    await tx.update(refreshTokens)
      .set({ revokedAt: new Date() })
      .where(and(eq(refreshTokens.userId, userId), isNull(refreshTokens.revokedAt)));
  });
}
// Without the tokenVersion bump, a user who changes their
// password because they suspect a breach has not logged the
// attacker out. They think they have.
//
// Note Day 17's rule: one transaction, and every statement
// on tx.


// ═══════════════════════════════════════════════════════════
// ⚠ Notice where we ended up
// ═══════════════════════════════════════════════════════════
// Option 3 does a database read on every authenticated
// request and takes the role from the row rather than the
// token.
//
// That is a session. The JWT is now doing one job: telling
// you which user id to look up, which a 32-byte opaque
// session id also does, without a signature, a library, an
// algorithm to pin, or a payload that publishes your claims.
//
// Which is the honest conclusion of this lesson:
//
//   If you need per-request revocation and current roles,
//   you need server-side state, and a session is the
//   simplest way to have it.
//
//   If you can genuinely live with a short window, use
//   short access tokens and put revocation on the refresh
//   token. That is the next lesson, and it is the design
//   that actually works.


// ── Where a JWT is genuinely right ──────────────────────────
// Service A calls Service B. B has no access to A's session
// store and no reason to.
//
//   A: sign with a private key
//   B: verify with A's public key, from a JWKS endpoint
//
// B validates the caller with no shared database, no network
// call to A, and no coupling to A's storage. That is worth
// the self-contained trade, and it is a different situation
// from a browser talking to the API that owns its data.`,
      },
      keyTakeaways: [
        "A JWT cannot be revoked because there is nowhere to delete it. That is the design, not an oversight: it is valid while the signature checks out.",
        "Logout, bans, password changes, permission revocation and a publicly posted token are all the same problem.",
        "The password case is the sharpest: a user changes their password after a suspicious login and the attacker's access token keeps working.",
        "Short expiry is mitigation, not a fix. \"Banned within ten minutes\" is not banned.",
        "A denylist adds a store, a per-request lookup and TTL bookkeeping to recover what sessions had for free.",
        "It is also worse than a session, because the token still carries its claims, so a role change is missed even though you are now doing a lookup.",
        "A version counter gives better value per lookup: one integer on the user row invalidates every token for that user, and you read the current role from the row.",
        "Bump the version inside the same transaction as a password change, or the user has not logged the attacker out.",
        "Once you read the user row on every request and trust the row over the token, you have built a session with extra steps.",
        "A JWT earns its place when a different party must verify it: separate services, a third party, or a gateway deciding without a round trip.",
        "\"My SPA talks to my API\" is not that case. One client, one server, one database is where a session is simpler and better.",
      ],
      commonMistakes: [
        "Building a logout endpoint that returns 200 and does nothing, then telling users they have been logged out.",
        "Choosing JWTs for scalability without pricing the denylist you will eventually need.",
        "Adding a denylist and still reading the role from the token, so you pay the lookup and get none of the benefit.",
        "Changing a password without invalidating existing tokens. The user believes they have locked the attacker out.",
        "Relying on short expiry for account bans. A banned user with a valid token is not banned.",
        "Using JWTs between a browser and the single API that owns the data, where a session is strictly simpler.",
        "Treating the per-request database read as a JWT implementation detail rather than as evidence you wanted sessions.",
      ],
      quiz: [
        {
          question: "Why can a JWT not be revoked?",
          options: [
            "Libraries do not support it",
            "There is nowhere to delete it. It is valid because the signature checks out, and the server keeps no record of it, which was the point.",
            "The expiry is immutable",
            "Only the issuer can revoke it",
          ],
          correctIndex: 1,
          explanation:
            "That is the design rather than an oversight, and logout, bans and password changes are all the same problem.",
        },
        {
          question: "You add a Redis denylist checked on every request. What have you built?",
          options: [
            "A scalable stateless system",
            "Sessions, with extra steps, and worse, because the token still carries stale claims so a role change is missed",
            "A rate limiter",
            "A token cache",
          ],
          correctIndex: 1,
          explanation:
            "If you are going to pay for a lookup on every request, do a useful one and read the current user row.",
        },
        {
          question: "Why is short expiry not a solution for banning an account?",
          options: [
            "It is too slow to issue",
            "\"Banned within up to ten minutes\" is not banned. It mitigates a stolen token; it does not enforce a decision.",
            "Bans need a denylist by law",
            "It is fine, actually",
          ],
          correctIndex: 1,
          explanation:
            "Short expiry limits a window. It cannot express a decision that must take effect now.",
        },
        {
          question: "What must happen alongside a password change?",
          options: [
            "Nothing",
            "Invalidate existing tokens, for instance by bumping a `tokenVersion` in the same transaction, or the attacker's token keeps working",
            "Force a new email verification",
            "Rotate the signing secret",
          ],
          correctIndex: 1,
          explanation:
            "The user changes their password precisely because they think someone else is in. Without this, they are wrong.",
        },
        {
          question: "When does a JWT genuinely earn its place?",
          options: [
            "Any API with a JavaScript frontend",
            "When a different party must verify it: separate services with no shared store, a third party, or a gateway deciding without a round trip",
            "Whenever you need scale",
            "When you want stateless logout",
          ],
          correctIndex: 1,
          explanation:
            "A browser talking to the one API that owns its data is the case where a session is simpler and better.",
        },
      ],
    },
    {
      id: "access-and-refresh-tokens",
      title: "Access tokens, refresh rotation and reuse detection",
      durationMinutes: 13,
      explanation:
        "This is the design that makes token-based authentication work, and the piece most tutorials leave out is the last one.\n\n---\n\n## The two tokens\n\n<b>Access token</b> (a short-lived credential presented on every request to a protected resource).\n\n<b>Refresh token</b> (a longer-lived credential whose only purpose is obtaining new access tokens).\n\n```text\nLogin\n  ↓\nAccess token   10-15 minutes   sent on every request\nRefresh token  7-30 days       sent only to /refresh\n```\n\n> The split exists to resolve a real conflict. A credential sent on every request is exposed constantly, so it should be short-lived. But a credential that expires in ten minutes means logging in every ten minutes, which nobody accepts. So you separate the two jobs: the token that travels everywhere is nearly worthless because it dies quickly, and the token that is valuable travels to exactly <b>one endpoint</b>.\n>\n> That last part is the bit people skip, and it does most of the work. A refresh token that is sent on every request has all the exposure of an access token and all the value of a long-lived one, which is the worst of both.\n\n---\n\n## Refresh tokens are not JWTs\n\n> Make the refresh token an opaque random string, store its `sha256` in your database, and look it up. Verified from the crypto lesson: `randomBytes(32).toString(\"base64url\")` is 43 characters, and a fast hash is correct here because there is nothing to guess.\n>\n> The reason is that a refresh token <b>must</b> be revocable, and you already know a self-contained token cannot be. There is no cost either: you are hitting the database on refresh anyway, which happens once every ten minutes rather than on every request. This is where the previous lesson's problem gets solved, by putting the state exactly where it is affordable.\n\n---\n\n## Rotation\n\n<b>Refresh token rotation</b> (issuing a new refresh token every time one is used, and invalidating the old one).\n\n```text\nLogin → Refresh A\nA used → Access + Refresh B, A now invalid\nB used → Access + Refresh C, B now invalid\n```\n\n> Rotation on its own is worth less than it looks. It shortens each token's life, and if an attacker steals refresh token B and uses it, they simply get C and carry on. Rotation is valuable because of what it makes <b>detectable</b>, which is the next part.\n\n---\n\n## Reuse detection\n\n> Here is the insight the whole design rests on. After rotation, an old refresh token should <b>never</b> be presented again. A legitimate client has already replaced it. So a request bearing an already-used token means one of exactly two things: an attacker is using a stolen copy, or a legitimate client is retrying and the attacker has the current one. <b>Both are theft.</b>\n>\n> That makes reuse a signal you can act on, and it is the only mechanism in this whole design that detects a stolen credential rather than merely limiting its lifetime.\n\n```text\nA → B → C  (current)\nSomeone presents A\n     ↓\nreuse detected → revoke the entire family\n```\n\n---\n\n## Token families\n\n<b>Token family</b> (the chain of refresh tokens descending from one login, tracked together so any of them can invalidate all of them).\n\n> Revoking the family and not just the presented token is the point. You do not know which side of the chain is the attacker, so you invalidate the whole login and force a fresh authentication. The legitimate user logs in again and is mildly annoyed; the attacker's stolen token is worthless and the theft has been detected, logged and alertable.\n>\n> Without families you revoke only the replayed token, the attacker keeps the current one, and you have learned about a compromise and done nothing about it.\n\n---\n\n## Where the refresh token lives\n\n> An `HttpOnly`, `Secure`, `SameSite` cookie scoped with `path=/auth/refresh`, so the browser sends it to the refresh endpoint and nowhere else. That combines the cookie lesson's protections with the exposure reduction that makes the split worth having in the first place. `localStorage` gives you neither.\n\n---\n\n## Two things that will bite you\n\n> <b>Concurrent refresh.</b> A page fires five requests, all get a 401, and all five call `/refresh` with the same token. One rotates; the other four look exactly like reuse, and you have just logged out a legitimate user and raised a security alert about them. This is the most common way a correct implementation of this design fails in production. The fixes are a short grace window where the immediately-previous token returns the same new pair, and a single-flight refresh in the client so only one request refreshes and the others wait.\n>\n> <b>Rotation must be atomic.</b> Invalidating the old token and issuing the new one are one transaction, with Day 17's rule about using `tx` everywhere. Get it wrong and a crash between the two leaves the user with no valid refresh token at all.",
      diagram: `The split resolves a real conflict

    a credential sent on EVERY request is exposed
    constantly → should be short-lived

    a credential expiring in 10 minutes means
    logging in every 10 minutes → nobody accepts

    so SEPARATE THE JOBS:

      access token   10-15 min
                     travels EVERYWHERE
                     nearly worthless, dies fast

      refresh token  7-30 days
                     travels to ONE ENDPOINT
                     valuable, rarely exposed

    ⚠ that last part does most of the work.

      a refresh token sent on every request has
      the EXPOSURE of an access token and the
      VALUE of a long-lived one.
      the worst of both.


Refresh tokens are NOT JWTs

    opaque random string
    store its sha256
    look it up

    randomBytes(32).toString("base64url")
      → 43 chars   (verified)

    why: a refresh token MUST be revocable, and
    you already know a self-contained token
    cannot be.

    and it costs nothing: you hit the database on
    refresh anyway, which is once every ten
    minutes, not every request.

    → the last lesson's problem, solved by
      putting the state where it is AFFORDABLE.


Rotation, and why it is not enough alone

    login   → A
    A used  → Access + B,  A invalid
    B used  → Access + C,  B invalid

    on its own this is worth less than it looks:

      steal B, use B, get C, carry on.

    rotation is valuable because of what it makes
    DETECTABLE.


⚠ Reuse detection: the whole design rests here

    after rotation, an old refresh token should
    NEVER appear again. a legitimate client
    already replaced it.

    so a request bearing a used token means
    exactly one of two things:

      an attacker is using a stolen copy
      a legitimate client is retrying and the
        ATTACKER has the current one

    BOTH ARE THEFT.

    → reuse is an ACTIONABLE SIGNAL, and it is
      the only mechanism here that DETECTS a
      stolen credential rather than just
      limiting its lifetime.


Token families: revoke the chain, not the token

    A → B → C (current)
    someone presents A
         ↓
    revoke the ENTIRE FAMILY

    you do not know which side is the attacker,
    so you invalidate the whole login.

      legitimate user   logs in again, mildly
                        annoyed
      attacker          token worthless, and the
                        theft is detected,
                        logged and alertable

    without families:
      you revoke only the replayed token
      the attacker keeps the CURRENT one
      you learned about a compromise and did
        nothing about it


Where it lives

    HttpOnly · Secure · SameSite
    path=/auth/refresh

    so the browser sends it to the refresh
    endpoint AND NOWHERE ELSE.

    localStorage gives you neither the flags nor
    the path scoping.


⚠⚠ Two things that will bite you

    1. CONCURRENT REFRESH

       a page fires 5 requests
       all 5 get 401
       all 5 call /refresh with the SAME token

       one rotates. the other four look EXACTLY
       like reuse.

       you have just logged out a legitimate user
       and raised a security alert about them.

       → the most common way a CORRECT
         implementation of this design fails in
         production.

       fixes:
         a short grace window where the
           immediately-previous token returns the
           SAME new pair
         single-flight refresh in the client, so
           one request refreshes and the rest
           wait

    2. ROTATION MUST BE ATOMIC

       invalidating the old and issuing the new
       are ONE TRANSACTION (Day 17: use tx
       everywhere).

       a crash between the two leaves the user
       with NO valid refresh token at all.`,
      codeExample: {
        title: "Rotation with reuse detection, and the concurrency fix",
        code: `import { randomBytes, createHash } from "node:crypto";
import { and, eq, isNull, gt } from "drizzle-orm";

// ── The tables ──────────────────────────────────────────────
// users
//   id · email · password_hash · token_version · banned_at
//
// refresh_tokens
//   id · user_id · family_id
//   token_hash        ← sha256, never the token
//   parent_id         ← the token this replaced
//   expires_at · revoked_at · used_at
//   user_agent · ip   ← so an alert says something useful
//
// Indexes, from Day 17:
//   UNIQUE (token_hash)         every refresh looks this up
//   INDEX (family_id)           family revocation
//   INDEX (user_id)             log out everywhere

const ACCESS_TTL = "15m";
const REFRESH_TTL_MS = 30 * 24 * 60 * 60 * 1000;
const REUSE_GRACE_MS = 10_000;      // the concurrency fix

const sha = (s) => createHash("sha256").update(s).digest("hex");


// ── Issuing a pair ──────────────────────────────────────────
async function issuePair(tx, user, { familyId, parentId, meta }) {
  const raw = randomBytes(32).toString("base64url");   // 43 chars

  const [row] = await tx
    .insert(refreshTokens)
    .values({
      userId: user.id,
      familyId: familyId ?? randomUUID(),   // a new login starts a family
      tokenHash: sha(raw),                  // never the raw value
      parentId: parentId ?? null,
      expiresAt: new Date(Date.now() + REFRESH_TTL_MS),
      userAgent: meta?.userAgent?.slice(0, 255),
      ip: meta?.ip,
    })
    .returning({ id: refreshTokens.id, familyId: refreshTokens.familyId });

  const accessToken = jwt.sign(
    { sub: String(user.id), role: user.role, ver: user.tokenVersion },
    secret,
    { expiresIn: ACCESS_TTL, algorithm: "HS256", issuer: "users-api", audience: "web" },
  );

  return { accessToken, refreshToken: raw, refreshRow: row };
}


// ── Login ───────────────────────────────────────────────────
app.post("/auth/login", {
  schema: { body: z.object({ email: z.email(), password: z.string() }) },
}, async (request, reply) => {
  const user = await loginSafe(request.body.email, request.body.password);
  //           ^^^^^^^^^^^^^^^ the dummy-hash version, so this
  //           does not leak which emails exist by timing
  if (!user) return reply.code(401).send({ error: "Invalid email or password" });

  const pair = await db.transaction((tx) =>
    issuePair(tx, user, { meta: { userAgent: request.headers["user-agent"], ip: request.ip } }),
  );

  return reply
    .setCookie("rt", pair.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/auth/refresh",
      //    ^^^^^^^^^^^^^^^ the whole point. The browser sends
      //    this cookie to the refresh endpoint and nowhere
      //    else, so it is not exposed on 99% of requests.
      maxAge: REFRESH_TTL_MS / 1000,
    })
    .send({ accessToken: pair.accessToken });
});


// ── Refresh, with rotation and reuse detection ──────────────
app.post("/auth/refresh", async (request, reply) => {
  const raw = request.cookies.rt;
  if (!raw) return reply.code(401).send({ error: "Unauthorized" });

  const tokenHash = sha(raw);

  try {
    const pair = await db.transaction(async (tx) => {
      // Lock the row, so two concurrent refreshes cannot both
      // pass the checks below. Day 17's FOR UPDATE.
      const [token] = await tx
        .select()
        .from(refreshTokens)
        .where(eq(refreshTokens.tokenHash, tokenHash))
        .for("update");

      if (!token) throw new UnauthorizedError("unknown refresh token");

      // ── ⚠ REUSE DETECTION ─────────────────────────────────
      if (token.usedAt || token.revokedAt) {
        // Grace window: if this token was used moments ago and
        // its replacement still stands, this is almost
        // certainly a concurrent request from a legitimate
        // client, not an attacker.
        const age = Date.now() - (token.usedAt?.getTime() ?? 0);
        if (token.usedAt && !token.revokedAt && age < REUSE_GRACE_MS) {
          const [child] = await tx
            .select()
            .from(refreshTokens)
            .where(and(
              eq(refreshTokens.parentId, token.id),
              isNull(refreshTokens.revokedAt),
            ));
          if (child) {
            // Hand back a fresh access token WITHOUT rotating
            // again. The client keeps the refresh cookie it
            // already has.
            const [user] = await tx.select().from(users).where(eq(users.id, token.userId));
            request.log.info({ familyId: token.familyId }, "refresh within grace window");
            return { accessToken: signAccessToken(user), rotated: false };
          }
        }

        // Otherwise: theft. Revoke the whole family.
        await tx
          .update(refreshTokens)
          .set({ revokedAt: new Date() })
          .where(and(
            eq(refreshTokens.familyId, token.familyId),
            isNull(refreshTokens.revokedAt),
          ));

        request.log.error({
          userId: token.userId,
          familyId: token.familyId,
          originalIp: token.ip,
          replayIp: request.ip,
          originalUserAgent: token.userAgent,
          replayUserAgent: request.headers["user-agent"],
        }, "refresh token reuse detected: family revoked");
        // Log both sides. When someone investigates this
        // alert, "the same token was used from two different
        // addresses" is the whole story in one line.

        throw new UnauthorizedError("refresh token reuse detected");
      }

      if (token.expiresAt < new Date()) {
        throw new UnauthorizedError("refresh token expired");
      }

      const [user] = await tx.select().from(users).where(eq(users.id, token.userId));
      if (!user || user.bannedAt) throw new UnauthorizedError("user unavailable");

      // ── Rotate. Atomically. ───────────────────────────────
      await tx
        .update(refreshTokens)
        .set({ usedAt: new Date() })
        .where(eq(refreshTokens.id, token.id));

      const next = await issuePair(tx, user, {
        familyId: token.familyId,        // same family
        parentId: token.id,              // chain it
        meta: { userAgent: request.headers["user-agent"], ip: request.ip },
      });

      return { ...next, rotated: true };
      // Both statements are on tx. Day 17: one db.update in
      // here instead of tx.update and the old token is marked
      // used even when the transaction rolls back, which locks
      // the user out permanently.
    });

    const res = reply.send.bind(reply);
    if (pair.rotated) {
      return reply
        .setCookie("rt", pair.refreshToken, { /* same options */ })
        .send({ accessToken: pair.accessToken });
    }
    return res({ accessToken: pair.accessToken });
  } catch (err) {
    return reply
      .clearCookie("rt", { path: "/auth/refresh" })
      .code(401)
      .send({ error: "Unauthorized" });
  }
});


// ── Logout: now there IS something to delete ────────────────
app.post("/auth/logout", async (request, reply) => {
  const raw = request.cookies.rt;
  if (raw) {
    const [token] = await db
      .select({ familyId: refreshTokens.familyId })
      .from(refreshTokens)
      .where(eq(refreshTokens.tokenHash, sha(raw)));

    if (token) {
      // Revoke the family, not just this token, so a stolen
      // descendant cannot keep refreshing.
      await db
        .update(refreshTokens)
        .set({ revokedAt: new Date() })
        .where(eq(refreshTokens.familyId, token.familyId));
    }
  }

  return reply.clearCookie("rt", { path: "/auth/refresh" }).send({ ok: true });
});
// The access token stays valid for up to 15 more minutes.
// That is the trade you accepted, and it is why 15 minutes
// and not 15 hours.


// ── ⚠ The client side of the concurrency problem ────────────
// Even with the grace window, fix it on the client too.
// Single-flight: one refresh, everyone else waits for it.
let refreshInFlight = null;

async function authedFetch(url, options = {}) {
  let res = await fetch(url, withToken(options));

  if (res.status === 401 && (await res.clone().json()).error === "token_expired") {
    refreshInFlight ??= fetch("/auth/refresh", { method: "POST" })
      .then((r) => r.json())
      .finally(() => { refreshInFlight = null; });

    const { accessToken } = await refreshInFlight;
    setAccessToken(accessToken);
    res = await fetch(url, withToken(options));
  }

  return res;
}
// Without this, five parallel 401s become five refresh
// requests. The server-side grace window catches it, and
// relying on a grace window for something the client can
// simply not do is the wrong order.`,
      },
      keyTakeaways: [
        "The split resolves a real conflict: a credential sent on every request must be short-lived, but nobody logs in every ten minutes.",
        "Most of the value comes from the refresh token going to exactly one endpoint. Sending it on every request gives you the worst of both.",
        "Make refresh tokens opaque random strings, not JWTs, and store the `sha256`. They must be revocable, and you are hitting the database anyway.",
        "That is where the previous lesson's revocation problem gets solved: state where it is affordable, once per ten minutes rather than per request.",
        "Rotation alone is worth little. Steal token B, use it, get C, carry on.",
        "Rotation's value is reuse detection: after rotation an old token should never reappear, so a used token means theft on one side of the chain or the other.",
        "That is the only mechanism in this design that detects a stolen credential rather than limiting its lifetime.",
        "Revoke the whole family, not just the replayed token, because you do not know which side the attacker is on.",
        "Scope the refresh cookie to `path=/auth/refresh` so the browser never sends it anywhere else.",
        "Concurrent refresh is the most common production failure of a correct implementation: five parallel 401s look exactly like reuse.",
        "Fix it with a short grace window server-side and a single-flight refresh client-side, in that order of trust.",
        "Rotation must be one transaction with every statement on `tx`, or a crash between the two locks the user out permanently.",
        "Log both the original and replay address and user agent on a reuse alert, so an investigation has the story in one line.",
      ],
      commonMistakes: [
        "Making the refresh token a JWT. It cannot then be revoked, which was the reason to have one.",
        "Sending the refresh token on every request or storing it in `localStorage`, which removes the exposure benefit entirely.",
        "Implementing rotation without reuse detection. Rotation alone does not detect theft.",
        "Revoking only the replayed token, so the attacker keeps the current one and you have detected a breach and ignored it.",
        "Ignoring concurrent refresh, then logging out real users and alerting on them.",
        "Relying only on the server grace window instead of also making the client refresh once.",
        "Using `db` instead of `tx` inside the rotation transaction, so a rollback leaves the old token marked used and the user permanently locked out.",
        "Storing the raw refresh token, so a database leak is a set of working credentials.",
        "Logging a reuse alert with no addresses or user agents, so nobody can tell what happened.",
      ],
      quiz: [
        {
          question: "What does most of the work in the access-plus-refresh split?",
          options: [
            "The shorter expiry",
            "That the refresh token travels to exactly one endpoint, so the valuable credential is rarely exposed",
            "That refresh tokens are longer",
            "Signing them with different keys",
          ],
          correctIndex: 1,
          explanation:
            "A refresh token sent on every request has the exposure of an access token and the value of a long-lived one.",
        },
        {
          question: "Why should a refresh token not be a JWT?",
          options: [
            "JWTs are too large",
            "It must be revocable, and a self-contained token cannot be. The database hit costs nothing because refresh happens once every ten minutes.",
            "JWTs cannot be stored in cookies",
            "Signature verification is too slow",
          ],
          correctIndex: 1,
          explanation:
            "This is where the revocation problem gets solved: server state placed where it is affordable.",
        },
        {
          question: "Why is rotation without reuse detection nearly pointless?",
          options: [
            "It is not, rotation is enough",
            "An attacker who steals a token uses it, receives the next one, and carries on. Rotation's value is making theft detectable.",
            "Rotation breaks concurrency",
            "It doubles the database writes",
          ],
          correctIndex: 1,
          explanation:
            "After rotation an old token should never reappear, so a used token means theft on one side of the chain.",
        },
        {
          question: "Why revoke the whole family rather than the replayed token?",
          options: [
            "It is simpler to implement",
            "You do not know which side of the chain is the attacker, so you invalidate the login and force a fresh authentication",
            "Families expire together anyway",
            "To reduce database rows",
          ],
          correctIndex: 1,
          explanation:
            "Revoking only the replayed token leaves the attacker holding the current one, which is detecting a breach and doing nothing.",
        },
        {
          question: "Five parallel requests get a 401 and all call `/refresh`. What happens, and what fixes it?",
          options: [
            "Nothing, they all succeed",
            "Four look exactly like reuse, so you log out a real user and alert on them. Fix it with a server grace window and a single-flight client refresh.",
            "The server queues them",
            "The cookie prevents it",
          ],
          correctIndex: 1,
          explanation:
            "This is the most common way a correct implementation of this design fails in production.",
        },
        {
          question: "Why must rotation be one transaction with every statement on `tx`?",
          options: [
            "For speed",
            "A crash or a stray `db` call between marking the old token used and issuing the new one leaves the user with no valid refresh token at all",
            "To avoid deadlocks",
            "Because of the unique index",
          ],
          correctIndex: 1,
          explanation:
            "Day 17's rule with a direct consequence: the old token is marked used even when the transaction rolls back, locking the user out permanently.",
        },
      ],
    },
    {
      id: "oauth-oidc-passkeys",
      title: "OAuth, OIDC and passkeys",
      durationMinutes: 12,
      explanation:
        "## OAuth 2.0\n\n<b>OAuth 2.0</b> (an authorization framework letting an application obtain limited access to a resource without handling the owner's password).\n\n> OAuth was designed to answer <b>\"may this app read my calendar?\"</b>, not \"who is this person?\". It is a delegation protocol, and the confusion between the two is not pedantry: it produced a real class of vulnerability where applications treated an OAuth access token as proof of identity. A token proves someone granted your app access to an API. It does not tell you <b>who</b>, and it does not tell you the token was issued <b>to you</b>.\n\n---\n\n## OIDC\n\n<b>OIDC (OpenID Connect)</b> (an identity layer on top of OAuth 2.0, which adds an ID token describing who authenticated).\n\n```text\nOAuth 2.0  →  authorization  →  \"may this app do X?\"\nOIDC       →  authentication →  \"who are you?\"\n```\n\n> The concrete difference is the <b>ID token</b>: a signed JWT about the user, with an `aud` claim naming your application. That `aud` is what makes it identity rather than access, because it lets you check the token was minted for you. If you are implementing \"Sign in with Google\", you want OIDC, and the thing that makes it safe is verifying the ID token's signature, issuer and audience rather than trusting what came back.\n\n---\n\n## The flow\n\n```text\nBrowser → your app → provider's authorization server\n   ↓\nuser authenticates\n   ↓\nauthorization code → your backend\n   ↓\nexchange code (with your client secret) → ID token + access token\n   ↓\nverify the ID token\n   ↓\ncreate a local session\n```\n\n> Two details in that diagram carry the security. The <b>code goes to your backend</b>, which exchanges it using a secret the browser never sees, so an intercepted code is useless without it. And the <b>last step is a local session</b>: after OIDC tells you who someone is, you are back to today's earlier lessons, and the provider is not involved in your subsequent requests.\n\n---\n\n## Do not implement this yourself\n\n> This is the one place today where the advice is unqualified. The <b>`state` parameter</b> prevents CSRF on the callback, <b>PKCE</b> prevents authorization code interception, `nonce` prevents ID token replay, and the ID token needs signature, issuer, audience and expiry checks against a key set that rotates. Every one of those is a step you can omit and still have a working login, which is exactly what makes hand-rolling it dangerous: <b>the broken version demos perfectly</b>.\n\nUse a mature library, and the same applies to every provider you would otherwise add by hand.\n\n---\n\n## Passkeys\n\n<b>Passkeys</b> (WebAuthn credentials using public-key cryptography, where the private key never leaves the user's device).\n\n```text\nRegistration               Login\nDevice makes a key pair    Server sends a challenge\nprivate → stays on device  Device signs it\npublic  → your server      Server verifies the signature\n```\n\n> What makes this categorically different from everything else today: <b>there is no shared secret</b>. Your database holds only public keys, so a database leak reveals nothing worth stealing. And because the signature is bound to the origin by the browser, a phishing site cannot obtain a usable one. That is the property passwords, TOTP codes and magic links all lack, and it is why passkeys are the first genuinely <b>phishing-resistant</b> option.\n>\n> The honest costs: account recovery becomes the hard problem, because a lost device is a lost credential and your recovery path is now the weakest link. Users are unfamiliar with it. And you will support passwords alongside for years.",
      diagram: `OAuth 2.0: a DELEGATION protocol

    designed to answer
      "may this app read my calendar?"

    NOT
      "who is this person?"

    ⚠ and the confusion is not pedantry.

      it produced a real class of vulnerability
      where apps treated an OAuth ACCESS TOKEN
      as proof of identity.

      an access token proves someone granted your
      app access to an API.

      it does not say WHO.
      it does not say it was issued TO YOU.


OIDC: the identity layer

    OAuth 2.0   authorization   "may this app X?"
    OIDC        authentication  "who are you?"

    the concrete difference: the ID TOKEN

      a signed JWT about the user
      with an aud claim NAMING YOUR APP

    that aud is what makes it identity rather
    than access: it lets you check the token was
    minted FOR YOU.

    "Sign in with Google" → OIDC

    and what makes it safe is VERIFYING the ID
    token's signature, issuer and audience.
    not trusting what came back.


The flow, and where the security lives

    browser → your app → authorization server
       ↓
    user authenticates
       ↓
    authorization CODE → YOUR BACKEND
       ↓
    exchange code + CLIENT SECRET
       ↓
    ID token + access token
       ↓
    VERIFY the ID token
       ↓
    create a LOCAL SESSION

    two details carry it:

      1. the code goes to your BACKEND, which
         exchanges it with a secret the browser
         never sees
         → an intercepted code is useless

      2. the last step is a LOCAL SESSION
         → after OIDC says who someone is, you
           are back to this day's earlier
           lessons, and the provider is not
           involved in later requests


⚠⚠ Do not implement this yourself

    the one unqualified piece of advice today.

    state    prevents CSRF on the callback
    PKCE     prevents code interception
    nonce    prevents ID token replay
    ID token needs signature + iss + aud + exp
             checked against a key set THAT
             ROTATES

    every one of those is a step you can OMIT and
    still have a working login.

    which is exactly what makes hand-rolling it
    dangerous:

      THE BROKEN VERSION DEMOS PERFECTLY.


Passkeys: no shared secret at all

    REGISTRATION          LOGIN
    device makes a        server sends a
      key pair              challenge
    private stays on      device signs it
      device
    public → server       server verifies

    what makes this categorically different:

      THERE IS NO SHARED SECRET.

      your database holds only PUBLIC KEYS, so a
      leak reveals nothing worth stealing

      the signature is bound to the ORIGIN by
      the browser, so a phishing site cannot
      obtain a usable one

    → the first genuinely PHISHING-RESISTANT
      option. passwords, TOTP codes and magic
      links all lack this.


    honest costs:

      ACCOUNT RECOVERY becomes the hard problem
        a lost device is a lost credential
        your recovery path is now the weakest
        link

      users are unfamiliar

      you will support passwords alongside for
      years`,
      codeExample: {
        title: "The OIDC callback, and what a library is doing for you",
        code: `// ── What "sign in with Google" actually involves ────────────
// Written out not so you implement it, but so you can see how
// many steps have a security consequence.

import { randomBytes, createHash } from "node:crypto";

// ── Step 1: start the flow ──────────────────────────────────
app.get("/auth/google", async (request, reply) => {
  // state: a random value you will check on the way back.
  // Without it, an attacker can complete a login flow in the
  // victim's browser and link their own provider account.
  const state = randomBytes(32).toString("base64url");

  // PKCE: prove the client that redeems the code is the one
  // that started the flow.
  const verifier = randomBytes(32).toString("base64url");
  const challenge = createHash("sha256").update(verifier).digest("base64url");

  // nonce: goes into the ID token, so a replayed token from
  // an old flow is rejected.
  const nonce = randomBytes(16).toString("base64url");

  // All three must be stored server-side against this browser,
  // in a short-lived HttpOnly cookie or a session entry. Not
  // in localStorage, and not in the URL.
  await storeFlow(reply, { state, verifier, nonce });

  const url = new URL("https://accounts.google.com/o/oauth2/v2/auth");
  url.searchParams.set("client_id", process.env.GOOGLE_CLIENT_ID);
  url.searchParams.set("redirect_uri", process.env.GOOGLE_REDIRECT_URI);
  url.searchParams.set("response_type", "code");
  url.searchParams.set("scope", "openid email profile");
  //                                    ^^^^^^ this scope is
  //                                    what makes it OIDC
  //                                    rather than plain OAuth
  url.searchParams.set("state", state);
  url.searchParams.set("code_challenge", challenge);
  url.searchParams.set("code_challenge_method", "S256");
  url.searchParams.set("nonce", nonce);

  return reply.redirect(url.toString());
});


// ── Step 2: the callback ────────────────────────────────────
app.get("/auth/google/callback", async (request, reply) => {
  const { code, state } = request.query;
  const flow = await loadFlow(request);

  // ⚠ Check 1: state. Skip this and the login still works.
  if (!flow || !state || state !== flow.state) {
    return reply.code(400).send({ error: "invalid_state" });
  }

  // Exchange the code from the BACKEND, with the secret.
  const res = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "content-type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      code,
      client_id: process.env.GOOGLE_CLIENT_ID,
      client_secret: process.env.GOOGLE_CLIENT_SECRET,
      redirect_uri: process.env.GOOGLE_REDIRECT_URI,
      grant_type: "authorization_code",
      code_verifier: flow.verifier,        // PKCE
    }),
  });
  const { id_token } = await res.json();

  // ⚠ Check 2: the ID token. Day 18's JWT lesson, applied to
  // somebody else's token, which is where it matters most.
  const claims = await verifyGoogleIdToken(id_token, {
    audience: process.env.GOOGLE_CLIENT_ID,   // minted for US
    issuer: "https://accounts.google.com",
    nonce: flow.nonce,
  });

  // ⚠ Check 3: the one that is easy to miss.
  if (!claims.email_verified) {
    return reply.code(400).send({ error: "email_not_verified" });
  }
  // Without this, anyone who can create an account at a
  // provider with an unverified address can claim someone
  // else's email at your application. That is account
  // takeover through a field you did not read.

  // Then: back to your own system. The provider is done.
  const user = await findOrCreateUserByProviderId({
    provider: "google",
    providerId: claims.sub,      // ← the stable id, NOT the email
    email: claims.email,
    name: claims.name,
  });

  const sid = await createSession(db, user.id, request);
  return reply.setCookie("sid", sid, cookieOptions).redirect("/");
});


// ── ⚠ Why key on sub and not email ──────────────────────────
// People change their email address at their provider. If you
// key the account on email:
//
//   · a user changes their Google email and becomes a new,
//     empty account at your app
//   · worse, if an old address is released and taken by
//     someone else, that person logs into the original
//     account
//
// claims.sub is stable for the life of the provider account.
// Store it, and treat email as a mutable attribute.


// ── ⚠ And the vulnerability class this all avoids ───────────
// ✗ Treating an OAuth access token as identity:
//
//     const res = await fetch("https://api.provider.com/me", {
//       headers: { authorization: \`Bearer \${accessToken}\` },
//     });
//     const me = await res.json();
//     login(me.email);            // ← no.
//
//   That access token was issued to SOME application, and it
//   proves someone granted access to an API. It does not
//   prove it was issued to yours. An attacker can obtain a
//   token for their own app with the same scopes and present
//   it here.
//
//   The ID token's aud claim is what closes that, and only
//   OIDC gives you one.


// ── The honest version of all of the above ──────────────────
// Use a library. Every check above is one you can omit while
// still shipping a login that works in a demo:
//
//   no state          -> login works
//   no PKCE           -> login works
//   no nonce          -> login works
//   decode the ID token instead of verifying   -> login works
//   key on email      -> login works, until it does not
//   ignore email_verified  -> login works
//
// Six omissions, six working logins, six vulnerabilities. A
// mature library ships all six checks and gets audited. This
// is not a "prefer" recommendation.


// ── Passkeys, in outline ────────────────────────────────────
import { generateRegistrationOptions, verifyRegistrationResponse,
         generateAuthenticationOptions, verifyAuthenticationResponse }
  from "@simplewebauthn/server";

// Registration
app.post("/passkeys/register/start", { preHandler: loadSession }, async (request) => {
  const options = await generateRegistrationOptions({
    rpName: "Example",
    rpID: "example.com",
    userID: Buffer.from(String(request.user.id)),
    userName: request.user.email,
    attestationType: "none",
  });
  await storeChallenge(request.user.id, options.challenge);
  return options;
});

app.post("/passkeys/register/finish", { preHandler: loadSession }, async (request) => {
  const expected = await takeChallenge(request.user.id);

  const { verified, registrationInfo } = await verifyRegistrationResponse({
    response: request.body,
    expectedChallenge: expected,
    expectedOrigin: "https://example.com",
    expectedRPID: "example.com",
    //             ^^^^^^^^^^^ this binding is what makes
    //             passkeys phishing-resistant. A signature
    //             produced on evil.example is not valid here,
    //             and the browser will not produce one.
  });
  if (!verified) throw new Error("registration failed");

  // What you store is a PUBLIC key. A database leak of this
  // table gives an attacker nothing to authenticate with,
  // which is not true of any password table however well
  // hashed.
  await db.insert(credentials).values({
    userId: request.user.id,
    credentialId: registrationInfo.credential.id,
    publicKey: registrationInfo.credential.publicKey,
    counter: registrationInfo.credential.counter,
  });

  return { ok: true };
});
//
// And the part to plan before you ship it: recovery. A user
// with one passkey on one lost phone has no way in. Whatever
// you build for that case becomes the real security boundary
// of the account, so an email magic link makes the account as
// phishable as the email inbox. Passkeys move the problem;
// they do not remove it.`,
      },
      keyTakeaways: [
        "OAuth 2.0 answers \"may this app do X?\". It is a delegation protocol, not an identity one.",
        "Treating an OAuth access token as identity is a real vulnerability class: it proves access was granted to some app, not that it was issued to yours.",
        "OIDC adds an ID token, a signed JWT about the user with an `aud` claim naming your application, which is what makes it identity.",
        "Verify the ID token's signature, issuer, audience and nonce. Do not trust what came back.",
        "The authorization code goes to your backend, which exchanges it with a secret the browser never sees, so an intercepted code is useless.",
        "The flow ends in a local session. After OIDC tells you who someone is, the provider is not involved in later requests.",
        "`state` prevents callback CSRF, PKCE prevents code interception, `nonce` prevents ID token replay, and each can be omitted while the login still works.",
        "That is why hand-rolling is dangerous: the broken version demos perfectly. Use a library.",
        "Key accounts on `sub`, not email. Emails change at the provider, and a released address taken by someone else becomes account takeover.",
        "Check `email_verified`. Without it, an unverified address at a provider can claim someone else's account at yours.",
        "Passkeys have no shared secret: your database holds public keys, so a leak yields nothing to authenticate with.",
        "The origin binding is what makes passkeys phishing-resistant, which passwords, TOTP and magic links all lack.",
        "Account recovery becomes the hard problem, and whatever you build for it becomes the account's real security boundary.",
      ],
      commonMistakes: [
        "Using an OAuth access token as proof of identity. It says nothing about who, or about who it was issued to.",
        "Decoding the ID token instead of verifying it. Day 18's `decode` versus `verify` lesson, on somebody else's token.",
        "Omitting `state`, PKCE or `nonce`. The login works, which is precisely the problem.",
        "Implementing the flow by hand. Six checks can each be skipped and still produce a working demo.",
        "Keying accounts on email. When the provider address changes or is reassigned, you get a lost account or a stolen one.",
        "Ignoring `email_verified`, which turns an unverified provider account into account takeover at yours.",
        "Exchanging the authorization code in the browser, where the client secret cannot be kept.",
        "Shipping passkeys without designing recovery, so a lost phone is a lost account or the recovery path is the weak link.",
        "Assuming passkeys remove phishing risk entirely, when an email-based recovery path makes the account as phishable as the inbox.",
      ],
      quiz: [
        {
          question: "What is the difference between OAuth 2.0 and OIDC?",
          options: [
            "OIDC is a newer version",
            "OAuth answers \"may this app do X?\"; OIDC adds an ID token about the user with an `aud` claim, which makes it identity",
            "OAuth is for APIs, OIDC for browsers",
            "They are the same",
          ],
          correctIndex: 1,
          explanation:
            "The `aud` claim is what lets you check the token was minted for your application, which an access token cannot tell you.",
        },
        {
          question: "Why is treating an OAuth access token as identity a vulnerability?",
          options: [
            "Access tokens expire",
            "It proves someone granted an app access to an API, not who they are and not that the token was issued to your app",
            "Access tokens are not signed",
            "It is fine if you use HTTPS",
          ],
          correctIndex: 1,
          explanation:
            "An attacker can obtain a token for their own application with the same scopes and present it to yours.",
        },
        {
          question: "Why is hand-rolling an OIDC flow specifically dangerous?",
          options: [
            "The cryptography is hard to implement",
            "`state`, PKCE, `nonce` and the ID token checks can each be omitted and the login still works, so the broken version demos perfectly",
            "Providers change their APIs",
            "It requires a client secret",
          ],
          correctIndex: 1,
          explanation:
            "Six omissions, six working logins, six vulnerabilities. This is the one unqualified \"use a library\" in the whole day.",
        },
        {
          question: "Why key a social account on `sub` rather than email?",
          options: [
            "`sub` is shorter",
            "Emails change at the provider, and a released address taken by someone else lets that person into the original account",
            "Emails are not returned",
            "`sub` is encrypted",
          ],
          correctIndex: 1,
          explanation:
            "`sub` is stable for the life of the provider account. Treat email as a mutable attribute.",
        },
        {
          question: "What makes passkeys phishing-resistant?",
          options: [
            "Biometrics",
            "The signature is bound to the origin by the browser, so a phishing site cannot obtain a usable one",
            "The private key is encrypted",
            "They expire quickly",
          ],
          correctIndex: 1,
          explanation:
            "Passwords, TOTP codes and magic links can all be relayed by a phishing site. An origin-bound signature cannot.",
        },
        {
          question: "What becomes the hard problem once you adopt passkeys?",
          options: [
            "Key storage",
            "Account recovery. A lost device is a lost credential, and whatever recovery path you build becomes the account's real security boundary.",
            "Browser support",
            "Database size",
          ],
          correctIndex: 1,
          explanation:
            "An email magic link for recovery makes the account exactly as phishable as the inbox. Passkeys move the problem rather than removing it.",
        },
      ],
    },
    {
      id: "account-flows-and-build-vs-buy",
      title: "Account flows, MFA and build versus buy",
      durationMinutes: 12,
      explanation:
        "Login is the part people build. These are the parts that leak.\n\n---\n\n## Email verification\n\n```text\nRegister → create account → random token → email\n   ↓\nuser clicks → verify token → email_verified = true\n```\n\n> Do not treat an address as verified because someone typed it. And be clear about what verification is protecting: it stops a user claiming <b>someone else's</b> address, which matters because email is your account recovery channel and therefore the root of trust for the whole account. An unverified address means your password reset can send a reset link to a stranger's inbox.\n\n---\n\n## Password reset\n\n```text\nEnter email → random token → store the HASH → email\n   ↓\nverify token + expiry → set new password → invalidate token\n```\n\n> Four properties, and all four matter. <b>Random</b>, from `randomBytes`, never a UUID or a counter. <b>Short-lived</b>, fifteen minutes to an hour, because this is a credential sitting in an inbox. <b>Single-use</b>, deleted on success, or a link that stays in an email archive stays a working key. And <b>stored as a hash</b>, verified from the crypto lesson, so a database leak does not hand over live reset links for every pending request.\n>\n> And one step that is nearly always missed: a completed reset must <b>revoke every existing session and refresh token</b>. Someone resetting their password usually believes an attacker is in their account. If the attacker's session survives, the reset achieved nothing and the user thinks otherwise.\n\n---\n\n## Account enumeration\n\n<b>Account enumeration</b> (discovering which email addresses have accounts).\n\n```text\n✗ \"That email does not exist.\"\n✓ \"If an account exists, we have sent a reset email.\"\n```\n\n> The identical message is only half of it, and this is where the crypto lesson comes back. Verified there: a login that skipped hashing for unknown emails answered in <b>0.0ms</b> against <b>207.2ms</b> for real ones. The same trap applies here, because generating a token and queueing an email takes time you only spend for real users.\n>\n> So the rule is <b>same message, same status, same timing</b>. Registration is the case people forget entirely: \"email already in use\" is a perfect enumeration oracle, and the way out is to accept the registration and send an email that says either \"confirm your account\" or \"someone tried to register with your address\".\n\n---\n\n## TOTP\n\n<b>TOTP (Time-based One-Time Password)</b> (a short numeric code derived from a shared secret and the current time).\n\n```text\nEnrol:  server generates a secret → QR code → user confirms a code\nLogin:  password correct → code correct → in\n```\n\n> Two things that make a real difference. Codes must be <b>single-use within their window</b>, or a code phished thirty seconds ago still works; store the last accepted counter and reject it. And <b>generate recovery codes at enrolment</b>, because the alternative is a support process that bypasses MFA, which is then your actual security level.\n>\n> Also be honest about what TOTP does. It defeats a stolen password and it does <b>not</b> defeat phishing: a site that asks for your password and your code relays both in real time. Only the origin binding from the passkeys lesson stops that.\n\n---\n\n## Build versus buy\n\nThe surface you have just seen:\n\n```text\nhashing · sessions · cookies · CSRF · JWT · refresh rotation\nreuse detection · OAuth · OIDC · passkeys · MFA · verification\npassword reset · enumeration · recovery\n```\n\n> The realistic reading of today is that <b>the primitives are easy and the composition is not</b>. Every individual lesson was a page of code. The failures were all in the joins: the login that leaked by timing, the transaction that used `db` instead of `tx`, the reset that did not revoke sessions, the concurrent refresh that looked like theft.\n>\n> A reasonable default: use a library or an identity provider for anything involving OAuth, OIDC, passkeys or MFA, because those are where a working implementation and a safe one look identical. Password and session authentication is genuinely fine to own, if you have read this day and you write the tests.\n>\n> And the one piece of advice worth more than the rest: <b>check the current status of any auth library before you adopt it</b>. This ecosystem moves. Lucia was widely recommended and has since changed direction; that is normal, not a scandal, and it is why an old tutorial is a liability in this area specifically.",
      diagram: `Email verification: what it protects

    do not treat an address as verified because
    someone TYPED it.

    it stops a user claiming SOMEONE ELSE'S
    address.

    which matters because email is your ACCOUNT
    RECOVERY CHANNEL, and therefore the ROOT OF
    TRUST for the whole account.

    an unverified address means your password
    reset can send a reset link to a stranger's
    inbox.


Password reset: four properties, all required

    RANDOM        randomBytes. never a UUID,
                  never a counter
    SHORT-LIVED   15-60 min. this is a credential
                  sitting in an inbox
    SINGLE-USE    deleted on success, or a link
                  in an email archive stays a
                  working key
    STORED HASHED so a DB leak does not hand over
                  live reset links for every
                  pending request

⚠ and the step nearly always missed

    a completed reset must REVOKE EVERY EXISTING
    SESSION AND REFRESH TOKEN.

    someone resetting their password usually
    believes an attacker is IN their account.

    if the attacker's session survives, the reset
    achieved NOTHING, and the user thinks
    otherwise.


Enumeration: message AND timing

    ✗ "That email does not exist."
    ✓ "If an account exists, we have sent a
       reset email."

    the identical message is HALF of it.

    verified earlier today:
      login skipping the hash for unknown emails
        0.0ms   vs   207.2ms

    the same trap is here: generating a token and
    queueing an email takes time you only spend
    for REAL users.

    → SAME MESSAGE · SAME STATUS · SAME TIMING

    ⚠ registration is the forgotten case:

      "email already in use" is a perfect
      enumeration oracle.

      way out: accept the registration, and send
      an email saying either
        "confirm your account"
        "someone tried to register with your
         address"


TOTP: two details that matter

    enrol  secret → QR → user confirms a code
    login  password ✓ → code ✓ → in

    1. SINGLE-USE WITHIN THE WINDOW
       or a code phished 30 seconds ago still
       works.
       store the last accepted counter, reject it.

    2. RECOVERY CODES AT ENROLMENT
       the alternative is a support process that
       BYPASSES MFA, which is then your actual
       security level.

    ⚠ and be honest about what it does:

      defeats a STOLEN PASSWORD          ✓
      defeats PHISHING                   ✗

      a site asking for your password and your
      code relays both in real time.

      only the ORIGIN BINDING from passkeys
      stops that.


Build vs buy

    the surface:
      hashing · sessions · cookies · CSRF
      JWT · rotation · reuse detection
      OAuth · OIDC · passkeys · MFA
      verification · reset · enumeration
      recovery

    the realistic reading of today:

      THE PRIMITIVES ARE EASY.
      THE COMPOSITION IS NOT.

      every lesson was a page of code.
      every failure was in the JOINS:

        the login that leaked by timing
        the transaction using db instead of tx
        the reset that did not revoke sessions
        the concurrent refresh that looked like
          theft

    a reasonable default:

      OAuth · OIDC · passkeys · MFA
        → library or identity provider
          (a working implementation and a safe
           one look IDENTICAL here)

      password + session auth
        → fine to own, if you have read this day
          and you write the tests


⚠ The advice worth more than the rest

    CHECK THE CURRENT STATUS OF ANY AUTH LIBRARY
    BEFORE ADOPTING IT.

    this ecosystem moves. Lucia was widely
    recommended and has since changed direction.

    that is normal, not a scandal, and it is why
    an old tutorial is a LIABILITY in this area
    specifically.`,
      codeExample: {
        title: "The flows that leak, written so they do not",
        code: `import { randomBytes, createHash, timingSafeEqual } from "node:crypto";

const sha = (s) => createHash("sha256").update(s).digest("hex");


// ── Password reset: request ─────────────────────────────────
app.post("/auth/password-reset", {
  schema: { body: z.object({ email: z.email().toLowerCase() }) },
  config: { rateLimit: { max: 3, timeWindow: "1 hour" } },
}, async (request, reply) => {
  const [user] = await db
    .select({ id: users.id, email: users.email })
    .from(users)
    .where(eq(users.email, request.body.email));

  if (user) {
    const token = randomBytes(32).toString("base64url");   // 43 chars

    await db.insert(passwordResets).values({
      userId: user.id,
      tokenHash: sha(token),        // the HASH. never the token.
      expiresAt: new Date(Date.now() + 15 * 60_000),
    });

    // QUEUE it, do not send it. An inline SMTP call for real
    // users only puts the timing difference straight back,
    // and 0.0ms vs 207ms was verified earlier today.
    await queue.add("send-reset-email", { email: user.email, token });
  }

  // Identical body, identical status, whether or not the
  // account exists.
  return reply.code(202).send({
    message: "If an account exists, we have sent a reset email.",
  });
});


// ── Password reset: complete ────────────────────────────────
app.post("/auth/password-reset/confirm", {
  schema: {
    body: z.object({
      token: z.string().min(20),
      password: z.string().min(12).max(72),
      //                          ^^^^^^^ the bcrypt limit,
      //                          made visible. Drop it if you
      //                          use argon2.
    }),
  },
}, async (request, reply) => {
  const tokenHash = sha(request.body.token);

  try {
    await db.transaction(async (tx) => {
      const [reset] = await tx
        .select()
        .from(passwordResets)
        .where(and(
          eq(passwordResets.tokenHash, tokenHash),
          gt(passwordResets.expiresAt, new Date()),
          isNull(passwordResets.usedAt),
          //     ^^^^^^^^^^^^^^^^^^^^^ single use, in the
          //     query. A link in an email archive is not a
          //     working key.
        ))
        .for("update");

      if (!reset) throw new BadRequestError("invalid or expired token");

      await tx
        .update(passwordResets)
        .set({ usedAt: new Date() })
        .where(eq(passwordResets.id, reset.id));

      await tx
        .update(users)
        .set({
          passwordHash: await argon2.hash(request.body.password, ARGON_OPTS),
          tokenVersion: sql\`\${users.tokenVersion} + 1\`,
        })
        .where(eq(users.id, reset.userId));

      // ⚠ THE STEP EVERYONE MISSES.
      // This person is resetting their password because they
      // think somebody else is in their account. Without
      // these three statements, that person still is.
      await tx.delete(sessions).where(eq(sessions.userId, reset.userId));

      await tx
        .update(refreshTokens)
        .set({ revokedAt: new Date() })
        .where(and(
          eq(refreshTokens.userId, reset.userId),
          isNull(refreshTokens.revokedAt),
        ));

      // And invalidate any other pending reset tokens, so an
      // attacker who also requested one cannot use it.
      await tx
        .update(passwordResets)
        .set({ usedAt: new Date() })
        .where(and(
          eq(passwordResets.userId, reset.userId),
          isNull(passwordResets.usedAt),
        ));
    });
    // Every statement on tx. Day 17: one db.update in here and
    // a rollback leaves the password changed with the
    // attacker's session intact, or the reverse.

    return reply.send({ ok: true });
  } catch {
    return reply.code(400).send({ error: "invalid or expired token" });
  }
});


// ── ⚠ Registration, the forgotten enumeration oracle ────────
// ✗ The obvious version:
app.post("/auth/register", async (request, reply) => {
  const existing = await findByEmail(request.body.email);
  if (existing) {
    return reply.code(409).send({ error: "Email already in use" });
    //                                    ^^^^^^^^^^^^^^^^^^^
    // A clean yes/no oracle for any address, with no rate
    // limit worth speaking of, on an endpoint that has to be
    // public. All the care taken over the login and reset
    // endpoints is undone here.
  }
  // ...
});

// ✓ Respond identically either way, and let the email carry
//   the difference.
app.post("/auth/register", {
  schema: { body: z.object({
    email: z.email().toLowerCase(),
    password: z.string().min(12).max(72),
  }) },
  config: { rateLimit: { max: 5, timeWindow: "1 hour" } },
}, async (request, reply) => {
  const { email, password } = request.body;

  // Hash first, unconditionally, so the timing does not depend
  // on whether the account exists.
  const passwordHash = await argon2.hash(password, ARGON_OPTS);

  const existing = await findByEmail(email);

  if (existing) {
    // Tell the real owner, not the requester.
    await queue.add("send-registration-attempt-email", { email });
  } else {
    const token = randomBytes(32).toString("base64url");
    await db.transaction(async (tx) => {
      const [user] = await tx
        .insert(users)
        .values({ email, passwordHash, emailVerified: false })
        .returning({ id: users.id });
      await tx.insert(emailVerifications).values({
        userId: user.id,
        tokenHash: sha(token),
        expiresAt: new Date(Date.now() + 24 * 60 * 60_000),
      });
    });
    await queue.add("send-verification-email", { email, token });
  }

  return reply.code(202).send({
    message: "Check your email to finish signing up.",
  });
});
//
// The requester learns nothing. The address owner learns
// everything. Note the unconditional hash: without it, the
// existing-account path skips ~30ms of argon2 and you have
// rebuilt the timing oracle you just closed.


// ── TOTP, with the two details that matter ──────────────────
import { authenticator } from "otplib";

// Enrol
app.post("/mfa/totp/start", { preHandler: loadSession }, async (request) => {
  const secret = authenticator.generateSecret();
  // Pending, not enabled. MFA turns on only after the user
  // proves they can produce a code, or you have locked them
  // out of their own account.
  await db.update(users).set({ totpSecretPending: secret })
    .where(eq(users.id, request.user.id));

  return {
    otpauth: authenticator.keyuri(request.user.email, "Example", secret),
  };
});

app.post("/mfa/totp/confirm", { preHandler: loadSession }, async (request, reply) => {
  const [user] = await db.select().from(users).where(eq(users.id, request.user.id));
  if (!authenticator.check(request.body.code, user.totpSecretPending)) {
    return reply.code(400).send({ error: "invalid code" });
  }

  // ⚠ Recovery codes, generated now, shown once, stored
  // hashed. Without these your support process becomes an MFA
  // bypass, and a support process that bypasses MFA is your
  // actual security level.
  const recoveryCodes = Array.from({ length: 10 }, () =>
    randomBytes(10).toString("hex"));

  await db.transaction(async (tx) => {
    await tx.update(users)
      .set({ totpSecret: user.totpSecretPending, totpSecretPending: null,
             totpEnabledAt: new Date() })
      .where(eq(users.id, user.id));

    await tx.insert(recoveryCodesTable).values(
      recoveryCodes.map((code) => ({ userId: user.id, codeHash: sha(code) })),
    );
  });

  return reply.send({ recoveryCodes });     // shown exactly once
});

// Login, second factor
async function verifyTotp(db, user, code) {
  if (!authenticator.check(code, user.totpSecret)) return false;

  // ⚠ Single use within the window. Without this, a code
  // phished 30 seconds ago is still valid, which removes most
  // of the point.
  const counter = Math.floor(Date.now() / 30_000);
  if (user.lastTotpCounter === counter) return false;

  await db.update(users).set({ lastTotpCounter: counter })
    .where(eq(users.id, user.id));
  return true;
}
//
// And be honest with yourself about the threat model. This
// stops someone who has only the password. It does not stop a
// phishing page that asks for both and relays them in real
// time, because there is nothing binding the code to your
// origin. Only passkeys have that property.


// ── Build vs buy, as a decision rather than a slogan ────────
// Own it:
//   email + password, sessions in your database, the cookie
//   flags from earlier today. Roughly 300 lines, and every
//   trap is in this day's material.
//
// Do not own it:
//   OAuth and OIDC     — six checks, each omittable, each
//                        producing a working login
//   passkeys           — WebAuthn ceremony details
//   MFA at scale       — enrolment, recovery, rate limits,
//                        support flows
//
// Consider an identity provider outright when compliance,
// SSO, SCIM or enterprise SAML appear, because at that point
// authentication is somebody's full-time job and it may as
// well be somebody else's.
//
// ⚠ And whatever you pick: check its current status TODAY.
// Better Auth and Auth.js are active. Lucia was widely
// recommended and has since changed direction. None of that
// is a scandal; it is why a two-year-old auth tutorial is a
// liability in a way a two-year-old database tutorial is not.`,
      },
      keyTakeaways: [
        "Email verification stops a user claiming someone else's address, which matters because email is your recovery channel and so the root of trust for the account.",
        "Reset tokens must be random from `randomBytes`, short-lived, single-use and stored as a hash.",
        "A completed reset must revoke every session and refresh token, or the attacker the user was worried about is still in.",
        "Preventing enumeration needs the same message, the same status and the same timing. Verified earlier: 0.0ms versus 207.2ms.",
        "Queue the reset email rather than sending it inline, or the timing difference returns for real users only.",
        "Registration is the forgotten oracle: \"email already in use\" answers the question cleanly. Respond identically and let the email carry the difference.",
        "Hash the password unconditionally on registration too, or the existing-account path skips the work and rebuilds the timing oracle.",
        "TOTP codes must be single-use within their window, or a code phished thirty seconds ago still works.",
        "Generate recovery codes at enrolment, because otherwise your support process becomes an MFA bypass and that is your real security level.",
        "TOTP defeats a stolen password and not phishing. A relay site asks for both and forwards them; only origin binding stops that.",
        "The primitives are easy and the composition is not. Every failure today was in the joins, not the pieces.",
        "Use a library or provider for OAuth, OIDC, passkeys and MFA, where a working implementation and a safe one look identical.",
        "Check any auth library's current status before adopting it. This ecosystem moves, which makes an old tutorial a liability here specifically.",
      ],
      commonMistakes: [
        "Treating a typed email as verified, leaving your recovery channel pointed at an address the user may not own.",
        "Storing reset tokens in plaintext, so a database leak is a set of live reset links.",
        "Reset tokens with no single-use check, so a link in an email archive keeps working.",
        "Completing a reset without revoking sessions and refresh tokens. The user believes they have locked the attacker out.",
        "An identical error message with different timing. The timing is the louder channel.",
        "Sending the reset email inline, which restores the timing difference you just removed.",
        "Returning 409 \"email already in use\" on registration, undoing every other enumeration defence.",
        "Enabling MFA before the user has proved they can produce a code, locking them out of their own account.",
        "No recovery codes, so support becomes the bypass.",
        "Accepting the same TOTP code twice within its window.",
        "Adopting an auth library from an old tutorial without checking whether it is still recommended.",
      ],
      quiz: [
        {
          question: "What is the step almost everyone misses when completing a password reset?",
          options: [
            "Sending a confirmation email",
            "Revoking every existing session and refresh token, since the user is resetting because they think someone else is in",
            "Rehashing with stronger parameters",
            "Logging the IP address",
          ],
          correctIndex: 1,
          explanation:
            "Without it the reset achieves nothing against the actual threat, and the user believes otherwise.",
        },
        {
          question: "Why is an identical error message not enough to prevent enumeration?",
          options: [
            "Attackers read the source",
            "Timing is a separate channel, and it was verified as 0.0ms versus 207.2ms when the code skipped work for unknown accounts",
            "Status codes differ",
            "Headers leak it",
          ],
          correctIndex: 1,
          explanation:
            "Same message, same status, same timing. Queue the email rather than sending it inline for real users only.",
        },
        {
          question: "How do you avoid enumeration on registration?",
          options: [
            "Return 409 with a vague message",
            "Respond identically either way, hash unconditionally, and send an email that either confirms the account or warns the real owner",
            "Rate limit it heavily",
            "Require a CAPTCHA",
          ],
          correctIndex: 1,
          explanation:
            "\"Email already in use\" is a clean oracle. The unconditional hash matters too, or the existing-account path is faster.",
        },
        {
          question: "Why must a TOTP code be single-use within its window?",
          options: [
            "To prevent replay across days",
            "Otherwise a code phished thirty seconds ago still works, which removes most of the benefit",
            "The library requires it",
            "To keep the counter in sync",
          ],
          correctIndex: 1,
          explanation:
            "Store the last accepted counter and reject a repeat.",
        },
        {
          question: "What does TOTP not protect against?",
          options: [
            "A stolen password",
            "Phishing. A site that asks for the password and the code relays both in real time, because nothing binds the code to your origin.",
            "Brute force",
            "Database leaks",
          ],
          correctIndex: 1,
          explanation:
            "Only the origin binding from passkeys defeats a real-time relay.",
        },
        {
          question: "What is the honest lesson about building authentication yourself?",
          options: [
            "Never do it",
            "The primitives are easy and the composition is not. Every failure today was in the joins, so own passwords and sessions and buy OAuth, OIDC, passkeys and MFA.",
            "Always build it, libraries are risky",
            "Use an identity provider for everything",
          ],
          correctIndex: 1,
          explanation:
            "In those bought areas a working implementation and a safe one look identical, which is what makes them the wrong thing to hand-roll.",
        },
      ],
    },
  ],
  finalQuiz: [
    {
      question: "A route has an `authenticate` preHandler and queries `WHERE invoices.id = :id`. What is the bug?",
      options: [
        "Nothing",
        "No ownership check, so any logged-in user reads every invoice. Authentication happens once; authorization has to happen per resource.",
        "The hook is the wrong stage",
        "It needs a response schema",
      ],
      correctIndex: 1,
      explanation:
        "An insecure direct object reference, and it survives review because the route looks protected. Put the ownership check in the `WHERE` so a row you may not see does not exist.",
    },
    {
      question: "Why is SHA-256 wrong for passwords but right for hashing a refresh token?",
      options: [
        "It is broken for one and not the other",
        "A password is low-entropy so hashing must be slow; a 32-byte random token has nothing to guess, so slowness buys nothing",
        "Tokens are not secret",
        "SHA-256 is only wrong for passwords over 72 bytes",
      ],
      correctIndex: 1,
      explanation:
        "Storing the token's `sha256` also means a database leak yields no usable credential, and lets you look it up with an indexed equality check.",
    },
    {
      question: "What was verified about bcrypt and a password longer than 72 bytes?",
      options: [
        "It throws",
        "It silently ignores everything past 72 bytes: 72 characters plus a completely different suffix compared as `true`",
        "It hashes in blocks",
        "It truncates at 64 bytes",
      ],
      correctIndex: 1,
      explanation:
        "The boundary was verified at exactly 72, and Argon2 returned `false` on the same test. If you use bcrypt, cap the length at validation.",
    },
    {
      question: "What happens when you use OWASP's recommended scrypt parameters in `node:crypto`?",
      options: [
        "They work fine",
        "`N=2^15, r=8` throws `ERR_CRYPTO_INVALID_SCRYPT_PARAMS`, because it needs exactly 32MB and Node's default `maxmem` is 32MB",
        "They are silently reduced",
        "scrypt is not available",
      ],
      correctIndex: 1,
      explanation:
        "Verified on Node 24.14.1. Raise `maxmem`; the OpenSSL error text tempts you into lowering `N`, which weakens your hashing instead.",
    },
    {
      question: "What was verified about `bcrypt.hashSync` versus `bcrypt.hash`?",
      options: [
        "The sync one is faster",
        "Both took about 200ms, but the event loop ticked 18 times during the async call and 0 times during the sync one",
        "They are equivalent",
        "The async one uses more memory",
      ],
      correctIndex: 1,
      explanation:
        "So a sync hash lets anyone freeze the process for 200ms by POSTing to `/login`, with no account needed.",
    },
    {
      question: "One hash at cost 12 took 216ms. Eight concurrent hashes took 444ms. Why?",
      options: [
        "CPU throttling",
        "Native hashing runs on libuv's thread pool, which defaults to 4 threads, so eight hashes are two rounds of four",
        "bcrypt batches internally",
        "The results were cached",
      ],
      correctIndex: 1,
      explanation:
        "That is roughly 18 logins per second per instance, independent of core count, and the pool is shared with `fs` and DNS.",
    },
    {
      question: "A login returns early when the email is unknown. What was measured, and what is the fix?",
      options: [
        "A microsecond difference; use a random delay",
        "207.2ms for existing versus 0.0ms for unknown. Compare against a pre-computed dummy hash of the same cost; verified 208.4ms and 218.2ms after.",
        "No difference; nothing to fix",
        "A 5ms difference; add rate limiting",
      ],
      correctIndex: 1,
      explanation:
        "Identical error messages do not prevent enumeration. Two hundred milliseconds is readable from anywhere on one request.",
    },
    {
      question: "Why can you not pass user input straight to `timingSafeEqual`?",
      options: [
        "It only takes strings",
        "Different lengths throw `ERR_CRYPTO_TIMING_SAFE_EQUAL_LENGTH`, and the throw itself reveals the secret's length",
        "It is synchronous",
        "It requires a key",
      ],
      correctIndex: 1,
      explanation:
        "Verified. Hash both sides to a fixed length first, then compare.",
    },
    {
      question: "Which cookie flag actually stops CSRF, and what is the right default?",
      options: [
        "`HttpOnly`, always true",
        "`SameSite`, and `Lax` is the right default because it blocks cross-site posts while still letting an email link work",
        "`Secure`, always true",
        "`Path`, scoped narrowly",
      ],
      correctIndex: 1,
      explanation:
        "`Strict` makes arriving from a link look like being logged out. `None` requires `Secure` and hands CSRF protection back to you.",
    },
    {
      question: "Why issue a new session id at login?",
      options: [
        "To reset the expiry",
        "Otherwise an attacker who can plant a cookie sets an id they know and shares the session once the victim logs in. That is session fixation.",
        "For cleaner logs",
        "So the signature changes",
      ],
      correctIndex: 1,
      explanation:
        "It costs one line: destroy the incoming session before creating the new one.",
    },
    {
      question: "What did `jwt.decode()` return for a token with a corrupted signature?",
      options: [
        "`null`",
        "Every claim, cheerfully, while `jwt.verify()` threw `invalid signature`",
        "An error object",
        "The header only",
      ],
      correctIndex: 1,
      explanation:
        "Verified. `decode`-based authentication is no authentication, and it passes tests because real tokens decode correctly too.",
    },
    {
      question: "Why pin `algorithms` on `jwt.verify` when `alg: none` is already rejected?",
      options: [
        "Performance",
        "To prevent algorithm confusion: on an RS256 setup an attacker signs with HS256 using your public key as the shared secret",
        "The library requires it",
        "For key rotation",
      ],
      correctIndex: 1,
      explanation:
        "Verified: `alg: none` throws `jwt signature is required`, and an HS256 token against `algorithms: [\"RS256\"]` throws `invalid algorithm`.",
    },
    {
      question: "You add a Redis denylist checked on every request to make JWTs revocable. What have you built?",
      options: [
        "A stateless scalable system",
        "Sessions with extra steps, and worse, because the token still carries stale claims so a role change is missed",
        "A rate limiter",
        "A token cache",
      ],
      correctIndex: 1,
      explanation:
        "If you are paying for a lookup on every request, do a useful one and read the current user row.",
    },
    {
      question: "Why is refresh token rotation nearly pointless without reuse detection?",
      options: [
        "Rotation is enough on its own",
        "An attacker uses the stolen token, receives the next one and carries on. Rotation's value is making theft detectable.",
        "It breaks concurrency",
        "It doubles the writes",
      ],
      correctIndex: 1,
      explanation:
        "After rotation an old token should never reappear, so a used token means theft on one side of the chain. Revoke the whole family.",
    },
    {
      question: "Five parallel requests 401 and all call `/refresh`. What happens?",
      options: [
        "All five succeed",
        "Four look exactly like reuse, so you log out a real user and alert on them. Fix it with a server grace window and a single-flight client refresh.",
        "The server queues them",
        "The cookie prevents it",
      ],
      correctIndex: 1,
      explanation:
        "This is the most common way a correct implementation of rotation and reuse detection fails in production.",
    },
    {
      question: "What is the difference between OAuth 2.0 and OIDC, and why does it matter?",
      options: [
        "OIDC is a newer version of OAuth",
        "OAuth answers \"may this app do X?\"; OIDC adds an ID token with an `aud` claim naming your app, which is what makes it identity rather than access",
        "OAuth is for APIs, OIDC for browsers",
        "There is no practical difference",
      ],
      correctIndex: 1,
      explanation:
        "Treating an OAuth access token as identity is a real vulnerability class: an attacker can present a token issued to their own app with the same scopes.",
    },
    {
      question: "Why key a social login account on `sub` rather than email?",
      options: [
        "`sub` is shorter",
        "Emails change at the provider, and a released address taken by someone else would let that person into the original account",
        "Emails are not always returned",
        "`sub` is signed separately",
      ],
      correctIndex: 1,
      explanation:
        "`sub` is stable for the life of the provider account. Also check `email_verified`, or an unverified provider address can claim someone else's account.",
    },
    {
      question: "What makes passkeys phishing-resistant when TOTP is not?",
      options: [
        "Biometrics are harder to steal",
        "The signature is bound to the origin by the browser, so a relay site cannot obtain a usable one. A phishing page can relay a password and a TOTP code in real time.",
        "The codes are longer",
        "The private key is encrypted",
      ],
      correctIndex: 1,
      explanation:
        "And your database holds only public keys, so a leak yields nothing to authenticate with.",
    },
    {
      question: "What is the step almost everyone misses when completing a password reset?",
      options: [
        "Sending a confirmation email",
        "Revoking every session and refresh token, since the user is resetting because they believe someone else is in their account",
        "Rehashing with stronger parameters",
        "Expiring the old password",
      ],
      correctIndex: 1,
      explanation:
        "Without it the reset achieves nothing against the actual threat, and the user believes otherwise.",
    },
    {
      question: "What is the honest build-versus-buy conclusion from this day?",
      options: [
        "Never build authentication",
        "The primitives are easy and the composition is not. Own passwords and sessions; use a library for OAuth, OIDC, passkeys and MFA, where a working implementation and a safe one look identical.",
        "Always use an identity provider",
        "Build everything so you understand it",
      ],
      correctIndex: 1,
      explanation:
        "Every failure in this day was in the joins: the timing leak, the `db` instead of `tx`, the reset that did not revoke, the concurrent refresh. Also check any library's current status before adopting it.",
    },
  ],
  project: {
    name: "day-18",
    goal: "Build register, login, refresh, logout and password reset with Argon2 hashing, short access tokens and rotating refresh tokens, then break each one on purpose and measure the leak before you fix it.",
    brief:
      "Most authentication exercises stop at a working login, which is exactly the problem: every failure in this day produced a working login. So this build is organised around reproducing the leaks yourself. Measure the 200ms enumeration gap before you close it. Watch the event loop stop during a sync hash. Steal your own refresh token and see reuse detection fire. Use db instead of tx in the rotation transaction and lock yourself out permanently. Each of those takes a few minutes and none of them is something you will forget afterwards. Do the measurements with real numbers written down, because the numbers are the part that changes how you write this code next time.",
    steps: [
      "Create `day-18/` with `\"type\": \"module\"`, then install `fastify`, `fastify-plugin`, `@fastify/cookie`, `@fastify/rate-limit`, `argon2`, `bcrypt`, `jsonwebtoken`, `zod`, `drizzle-orm` and `pg`.",
      "Start from Day 15's `app.js` and `server.js` split with the Zod type provider from Day 16.",
      "Write the schema: `users` with `token_version` and `banned_at`, `sessions`, `refresh_tokens` with `family_id`, `parent_id`, `token_hash`, `used_at` and `revoked_at`, and `password_resets`. Index `token_hash` uniquely.",
      "Measure your hardware: time `argon2.hash` at the defaults and `bcrypt.hash` at costs 10, 12 and 14, and write the four numbers down.",
      "Reproduce the sync block: run `bcrypt.hashSync` at cost 12 with a 10ms `setInterval` counting alongside, then the async version, and record both tick counts.",
      "Reproduce the thread pool ceiling: run 8 concurrent `bcrypt.hash` calls at cost 12 and compare the total against one call. Then rerun with `UV_THREADPOOL_SIZE=16` in the environment.",
      "Reproduce the bcrypt truncation: hash 72 `\"A\"` characters, then `compare` with those 72 plus a different suffix, and confirm it returns `true`. Repeat with argon2 and confirm `false`.",
      "Try `scryptSync` with `N: 2 ** 15, r: 8, p: 1` and no `maxmem`, record the exact error, then add `maxmem` and confirm it works.",
      "Build `POST /auth/register` with unconditional hashing and an identical 202 whether or not the account exists.",
      "Build `POST /auth/login` with the early-return version first. Time 10 attempts with a known email and 10 with an unknown one, and write both averages down.",
      "Now add the dummy-hash fix and re-measure both. Confirm the gap has closed.",
      "Add rehashing at login: hash a user's password with `memoryCost: 2 ** 14`, log in, and confirm `needsRehash` fired and the stored hash changed.",
      "Issue a 15-minute access token and an opaque refresh token stored as `sha256`, with the refresh cookie scoped to `path=/auth/refresh` and `httpOnly`, `secure` and `sameSite` set.",
      "Verify the payload is public: decode your own access token's payload with `Buffer.from(part, \"base64url\")` and no secret.",
      "Corrupt a token's signature, then confirm `jwt.decode` returns the claims and `jwt.verify` throws.",
      "Build `POST /auth/refresh` with rotation inside a transaction, chaining `parent_id` and keeping `family_id`.",
      "Add reuse detection: save a refresh token, use it, then send the saved one again. Confirm the whole family is revoked and the alert logs both addresses.",
      "Break rotation on purpose: change one `tx.update` to `db.update`, force a throw after it, then confirm the user can no longer refresh at all.",
      "Reproduce concurrent refresh: fire five `/refresh` calls in parallel with the same token and watch reuse detection log out a legitimate user.",
      "Add the grace window so the immediately-previous token returns an access token without rotating, and confirm the five parallel calls now succeed.",
      "Build `POST /auth/logout` that revokes the family, and confirm the access token still works until it expires.",
      "Build the password reset pair with a hashed, single-use, 15-minute token, and make the completion revoke all sessions and refresh tokens in one transaction.",
      "Prove that: log in on two clients, reset the password from one, and confirm the other can no longer refresh.",
      "Add an ownership check to a protected resource route, then confirm that another user's id returns 404 rather than 403.",
      "Write tests with `app.inject()`: reuse detection revokes the family, a reset kills existing sessions, an expired access token returns 401 with `token_expired`, and another user's record returns 404.",
    ],
    acceptance: [
      "You have written down argon2 and bcrypt timings from your own machine, at three bcrypt costs.",
      "You recorded the event loop tick counts for the sync and async hash, and can state why the sync one is a denial of service on `/login`.",
      "You measured 8 concurrent hashes against 1 and can state your logins per second per instance, plus what changed with a larger `UV_THREADPOOL_SIZE`.",
      "You saw `bcrypt.compare` return `true` for a 72-character prefix with a different suffix, and `false` from argon2 on the same test.",
      "You have the exact `scryptSync` error text for OWASP's parameters without `maxmem`, and it works with `maxmem` set.",
      "You have before-and-after login timings for a known and an unknown email, and the gap closed after the dummy hash.",
      "Rehashing fired at login for a weakly-hashed user and the stored hash changed, with no password reset involved.",
      "You decoded your own access token payload with no secret, and can say what must never go in it.",
      "`jwt.decode` returned claims from a token whose signature you corrupted, and `jwt.verify` threw on the same token.",
      "Replaying a used refresh token revoked the entire family, and the log line contains both the original and replay address.",
      "Using `db` instead of `tx` in rotation locked the user out permanently, and you can explain exactly why.",
      "Five parallel refreshes triggered a false reuse alert before the grace window and succeeded after it.",
      "Resetting the password from one client stopped the other client refreshing.",
      "Another user's record returns 404, not 403, and you can say why that matters.",
      "The refresh cookie is `httpOnly`, `secure` in production, `sameSite` set, and scoped to `path=/auth/refresh`.",
      "`npx tsc --noEmit` passes and `node --test` passes with no socket opened.",
    ],
    stretch: [
      "Implement the `tokenVersion` check on every request, then promote a user to admin and confirm the change takes effect without a new login.",
      "Build the same login with sessions instead of tokens, then count the lines and the moving parts against the token version.",
      "Add TOTP with `otplib`, including recovery codes and the single-use-per-window counter, then submit the same code twice.",
      "Add a `/sessions` endpoint listing active sessions with user agent and address, and a \"log out everywhere\" button.",
      "Add `@fastify/rate-limit` keyed on address plus email, then confirm a login flood no longer saturates the thread pool.",
      "Implement rolling session expiry with an absolute cap, and only write the new expiry when it moves by more than an hour.",
      "Add a `POST /auth/register` path for an existing address and confirm from the response alone that you cannot tell whether the account exists.",
      "Wire up Google OIDC with a library, then deliberately remove the `state` check and confirm the login still works, which is the point.",
      "Store a password with bcrypt, then migrate that user to argon2 at their next login using a `verifyAny` dispatcher on the hash prefix.",
      "Write a load test that logs in, and compare requests per second against the same test using an existing session cookie.",
    ],
  },
};
