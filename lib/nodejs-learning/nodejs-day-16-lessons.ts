import type { LessonDay } from "@/lib/learn/lesson-types";

export const NODEJS_DAY_16_LESSONS: LessonDay = {
  day: 16,
  title: "Validation and serialization",
  totalMinutes: 106,
  difficulty: "Intermediate",
  lessons: [
    {
      id: "the-boundary",
      title: "The boundary, and why it exists",
      durationMinutes: 10,
      explanation:
        "A client can send anything:\n\n```javascript\n{ \"name\": 123, \"email\": \"hello\", \"age\": \"banana\" }\n```\n\nYour backend should never blindly trust it. Today's whole shape:\n\n```text\nClient\n   ↓\nValidate\n   ↓\nTransform\n   ↓\nBusiness logic\n   ↓\nSerialize response\n   ↓\nClient\n```\n\nNote that there are <b>two</b> arrows through the boundary. Most people guard the first and forget the second, which is why the second half of today is about what leaves.\n\n---\n\n## Boundary\n\n<b>Boundary</b> (the point where untrusted external data enters your application).\n\n> The useful part of that definition is <b>point</b>, singular. Validation is only worth anything if there is exactly one place data can get in. Scatter checks through your service layer and you have no boundary, you have a habit, and the one function that forgot is the bug.\n\n```text\nBrowser\n   ↓\nHTTP request\n   ↓\n🚧 Boundary\n   ↓\nYour application\n```\n\nEverything from outside is untrusted:\n\n```text\nRequest body\nQuery parameters\nURL parameters\nHeaders\nCookies\nWebhooks\nExternal APIs\n```\n\nThat last one catches people. A response from a payment provider or your own internal service is still external data. It can be malformed, it can change shape without warning, and `response.data.user.email` will throw on a Tuesday when they ship a change.\n\n---\n\n## Never trust the client\n\nYou expect:\n\n```javascript\n{ \"name\": \"Rajan\", \"age\": 30 }\n```\n\nA malicious or simply broken client sends:\n\n```javascript\n{ \"name\": null, \"age\": \"hello\", \"isAdmin\": true }\n```\n\n> \"Malicious\" is the smaller half of this. Most bad input is a mobile app two versions behind, a retry with a truncated body, or a colleague's script. You are not mainly defending against an attacker; you are defending against <b>the world being messy</b>, and an attacker is one messy case out of many.\n\nWithout validation:\n\n```text\nBad input → business logic → database → 💥\n```\n\nWith validation:\n\n```text\nBad input → schema → ❌ 400 Bad Request\n```\n\nThat `isAdmin: true` in the middle is not decoration. Day 15 verified that a Fastify JSON Schema which does not mention `isAdmin` lets it through anyway. Hold that thought; the third lesson is about it.\n\n---\n\n## Schema\n\n<b>Schema</b> (a formal definition describing what data should look like).\n\n> The word to notice is <b>formal</b>. An `if (!body.email) return 400` is a check. A schema is a value you can pass around, so the same definition can validate, produce a TypeScript type and generate documentation. That is the difference the rest of today is built on.\n\n```text\nUser\n├── name  → string\n├── email → valid email\n└── age   → number\n```\n\nA schema answers one question: <b>what data do I accept?</b>",
      diagram: `Two arrows, not one

    Client
       ↓        ← everyone guards this
    Validate
       ↓
    Transform
       ↓
    Business logic
       ↓
    Serialize response
       ↓        ← almost nobody guards this
    Client

    the second half of today is about what LEAVES.


Boundary: the word is POINT, singular

    Browser  →  HTTP request  →  🚧  →  your app

    validation is only worth something if there is
    exactly ONE place data can get in.

    scatter checks through the service layer and
    you do not have a boundary, you have a habit,
    and the one function that forgot is the bug.


Everything outside is untrusted

    request body       cookies
    query parameters   webhooks
    URL parameters     external APIs   ← this one
    headers                              catches people

    a payment provider's response is still
    external data. it can change shape without
    warning, and response.data.user.email throws
    on a Tuesday.


"Malicious" is the smaller half

    most bad input is:
      a mobile app two versions behind
      a retry with a truncated body
      a colleague's script

    you are defending against the WORLD BEING
    MESSY. an attacker is one messy case of many.


Schema: the word is FORMAL

    if (!body.email) return 400
        └─ a check

    a schema
        └─ a VALUE you can pass around

    so ONE definition can
      validate  ·  make a type  ·  make docs

    that difference is what today is built on.


⚠ Carry this from Day 15

    a Fastify JSON Schema that does not mention
    isAdmin lets isAdmin through anyway. verified.

    lesson 3 is about that.`,
      codeExample: {
        title: "What actually arrives at a public endpoint",
        code: `// ── The shape you designed for ──────────────────────────────
// POST /users
// {
//   "name": "Rajan",
//   "email": "rajan@example.com",
//   "age": 30
// }


// ── The shapes you will actually receive ────────────────────
//
// An old mobile client, two releases behind:
//   { "name": "Rajan", "e_mail": "rajan@example.com" }
//
// A retry after a dropped connection:
//   { "name": "Raj
//
// A form that submitted every field as a string:
//   { "name": "Rajan", "email": "r@e.co", "age": "30" }
//
// A cURL from a colleague debugging something:
//   { "name": "test" }
//
// An empty body with the right content type:
//   {}
//
// No body at all:
//   (request.body is undefined)
//
// Someone probing:
//   { "name": "Rajan", "email": "r@e.co", "age": 30,
//     "isAdmin": true, "role": "admin", "id": 1 }
//
// A number where a string belongs:
//   { "name": 123, "email": "hello", "age": "banana" }


// ── Without a boundary, this is what you write ──────────────
app.post("/users", async (request, reply) => {
  const { name, email, age } = request.body ?? {};

  if (typeof name !== "string" || name.length === 0) {
    return reply.code(400).send({ error: "name is required" });
  }
  if (typeof email !== "string" || !email.includes("@")) {
    return reply.code(400).send({ error: "email is invalid" });
  }
  const parsedAge = Number(age);
  if (!Number.isInteger(parsedAge) || parsedAge <= 0) {
    return reply.code(400).send({ error: "age must be a positive integer" });
  }

  return createUser({ name, email, age: parsedAge });
});
//
// Three problems with that, and none of them is length.
//
// 1. email.includes("@") is not email validation, and the
//    next person will not know that you knew.
// 2. This exists once per route. Route seventeen will forget
//    the age check, and nothing will tell you.
// 3. The types live nowhere. TypeScript still thinks
//    request.body is any, so downstream code guesses.


// ── External data is external too ───────────────────────────
const res = await fetch("https://api.payments.example/charge/123");
const charge = await res.json();

// charge is \`any\`. You are one provider deploy away from:
//
//   const email = charge.customer.email;
//   TypeError: Cannot read properties of undefined
//
// A schema here is not paranoia. It turns "their API changed
// and our checkout broke at 2am" into a logged validation
// error with the field name in it.


// ── The shape today is heading toward ───────────────────────
// One schema. Four uses.
//
//   const createUserSchema = z.object({ ... });
//
//   validate     →  the request never reaches you dirty
//   type         →  z.infer, so TypeScript knows the shape
//   response     →  only listed fields can leave
//   docs         →  OpenAPI generated from the same object
//
// Everything below builds to that.`,
      },
      keyTakeaways: [
        "There are two arrows through the boundary. Almost everyone guards what comes in and forgets what goes out.",
        "The word in \"boundary\" that matters is point, singular. Scattered checks are a habit, not a boundary, and the function that forgot is the bug.",
        "External APIs are untrusted input. A provider changing a field shape breaks `response.data.user.email` with a `TypeError`, not a validation error you can read.",
        "Most bad input is not an attack. It is old clients, truncated retries and colleagues' scripts. An attacker is one messy case among many.",
        "A schema is a value, not a check. That is what lets one definition validate, produce a type and generate docs.",
        "Hand-rolled validation has three problems: it is subtly wrong, it exists once per route, and it leaves TypeScript knowing nothing.",
        "Carry Day 15's verified finding into today: a Fastify JSON Schema that omits `isAdmin` lets `isAdmin` through anyway.",
      ],
      commonMistakes: [
        "Validating in the service layer instead of at the boundary. Now every caller has to remember, and one will not.",
        "Treating a response from another service as trusted because it is \"internal\". It is another team's deploy schedule.",
        "`email.includes(\"@\")` as email validation. It accepts `\"@\"` and rejects nothing useful.",
        "Assuming bad input means an attacker. It usually means an old client, and that changes what a good error message should say.",
        "Writing per-route `if` checks. They pass review, they work, and route seventeen will forget one.",
        "Validating the request and returning the raw database row. You guarded one of the two arrows.",
      ],
      quiz: [
        {
          question: "Why does the definition of boundary emphasise a single point?",
          options: [
            "Performance",
            "Validation only means something if there is exactly one place data can enter; scattered checks are a habit and one will be missed",
            "Because HTTP has one entry point",
            "To keep the code short",
          ],
          correctIndex: 1,
          explanation:
            "A boundary you can point at is auditable. Checks spread through the service layer are not.",
        },
        {
          question: "Which of these is untrusted input?",
          options: [
            "Only the request body",
            "The body, query, params, headers, cookies, webhooks and responses from other APIs",
            "Everything except internal services",
            "Only data from browsers",
          ],
          correctIndex: 1,
          explanation:
            "An internal service is another team's deploy schedule. Its response can change shape without telling you.",
        },
        {
          question: "What makes a schema different from an `if` check?",
          options: [
            "It is faster",
            "It is a value you can pass around, so one definition can validate, produce a type and generate docs",
            "It runs at compile time",
            "It cannot be bypassed",
          ],
          correctIndex: 1,
          explanation:
            "That reusability is the whole argument for today's single-source-of-truth pattern.",
        },
        {
          question: "What is the second arrow through the boundary?",
          options: [
            "Logging",
            "The response leaving your API, which needs its own control over what is allowed out",
            "Database writes",
            "Error handling",
          ],
          correctIndex: 1,
          explanation:
            "Guarding only the inbound arrow is how `passwordHash` ends up in a JSON response.",
        },
      ],
    },
    {
      id: "zod-basics",
      title: "Zod, parse and safeParse",
      durationMinutes: 11,
      explanation:
        "## Zod\n\n<b>Zod</b> (a TypeScript-first schema validation library).\n\n> \"TypeScript-first\" is not marketing. It means the schema is the source and the type is derived from it, rather than the two being written separately and drifting. Verified on Zod 4.5.4, which matters because Zod 4 moved several things: `z.email()` is now top-level, where Zod 3 wrote `z.string().email()`. Tutorial code from 2024 will not run.\n\n```javascript\nimport { z } from \"zod\";\n\nconst userSchema = z.object({\n  name: z.string(),\n  email: z.email(),\n  age: z.number(),\n});\n```\n\nOne definition of what a valid user is.\n\n---\n\n## `parse()`\n\n<b>`parse()`</b> (validates the input and returns the typed value, throwing if it does not match).\n\n> The word people miss is <b>returns</b>. `parse` is not a check that returns a boolean, it returns a <b>new value</b>, and that value is not always the one you passed in. It has unknown keys removed and any coercions and transformations applied. So `schema.parse(body)` and then using `body` is a bug: you validated one object and kept using the other.\n\n```javascript\nconst user = userSchema.parse(data);      // typed, or throws\n```\n\nVerified: a bad payload throws a `ZodError` carrying an `issues` array, with <b>one entry per problem</b>. Two bad fields gave two issues, not one. That matters for error messages, because a client fixing one field at a time is a slow loop.\n\n---\n\n## `safeParse()`\n\n<b>`safeParse()`</b> (validates the input and returns a result object instead of throwing).\n\n```javascript\nconst result = userSchema.safeParse(data);\n\nif (!result.success) {\n  console.log(result.error.issues);\n  return;\n}\n\nconsole.log(result.data);       // typed\n```\n\n> The real difference is not the try/catch. It is that `safeParse` makes TypeScript force you to handle the failure: `result.data` does not exist until you have narrowed on `result.success`. With `parse` you can forget the try/catch and TypeScript will not say a word.\n\n---\n\n## Which one\n\nNeither is better. The question is what should happen next.\n\n```text\nparse()\n  ↳ invalid input is exceptional\n  ↳ something above you handles it\n  ↳ config loading, startup, inside a framework\n\nsafeParse()\n  ↳ invalid input is expected\n  ↳ you must turn it into a response\n  ↳ HTTP handlers, external API responses\n```\n\nOne practical rule: use `parse` where a throw is genuinely fatal, such as validating environment variables at startup, where you <b>want</b> the process to die rather than boot half-configured. Use `safeParse` where the failure is a 400 you have to construct.\n\n---\n\n## The default that is the opposite of Day 15\n\nVerified, and this is the important one:\n\n```javascript\nuserSchema.safeParse({ name: \"R\", email: \"a@b.co\", age: 30, isAdmin: true });\n// data: { name: \"R\", email: \"a@b.co\", age: 30 }\n```\n\n`isAdmin` is <b>gone</b>. Zod strips unknown keys by default.\n\n> Day 15 verified that Fastify's JSON Schema does the exact opposite with the exact same input: it passes `isAdmin` through. Two validators, one payload, opposite outcomes, and neither says anything about it. This is not a detail to skim, it is the reason the next lesson exists.\n\nAnd if you want a rejection rather than a silent strip:\n\n```javascript\nuserSchema.strict().safeParse({ ... isAdmin: true });\n// success: false, issue code: \"unrecognized_keys\"\n```\n\nVerified. Three behaviours from one library, before you even involve Fastify.",
      diagram: `Zod 4, not Zod 3

    verified on 4.5.4

    z.email()            ← Zod 4, top-level
    z.string().email()   ← Zod 3

    tutorial code from 2024 will not run.


parse() RETURNS a value

    const user = schema.parse(data);

    the word people miss is RETURNS.
    it is not a boolean check.

    the returned value is NOT always what you
    passed in:
      unknown keys removed
      coercions applied
      transformations applied

    so:
      schema.parse(body);
      use(body);            ✗ wrong object

      const clean = schema.parse(body);
      use(clean);           ✓


parse() throws a ZodError with MANY issues

    verified: 2 bad fields  →  2 issues

    one entry per problem, not one per call.
    matters, because a client fixing one field
    per round trip is a slow loop.


safeParse() makes TypeScript force your hand

    const r = schema.safeParse(data);
    if (!r.success) { ... return; }
    r.data                ← only exists after narrowing

    with parse() you can forget the try/catch and
    TypeScript says nothing.


Which one: what should happen NEXT?

    parse()      invalid is EXCEPTIONAL
                 something above handles it
                 → config, startup, inside a
                   framework
                 → env vars: you WANT the process
                   to die, not boot half-configured

    safeParse()  invalid is EXPECTED
                 you must build a response
                 → HTTP handlers, external APIs


⚠ Zod's default is the OPPOSITE of Day 15's

    same payload:  { ..., isAdmin: true }

    Zod            isAdmin GONE       (stripped)
    JSON Schema    isAdmin THROUGH    (allowed)

    both verified. neither says a word.

    → that is why lesson 3 exists.

    Zod .strict()  →  success: false
                      "unrecognized_keys"

    three behaviours from one library, before
    Fastify is even involved.`,
      codeExample: {
        title: "parse, safeParse, and the stripping default",
        code: `import { z } from "zod";
// Verified on zod 4.5.4

const userSchema = z.object({
  name: z.string(),
  email: z.email(),          // Zod 4. In Zod 3: z.string().email()
  age: z.number(),
});


// ── parse() returns a NEW value ─────────────────────────────
const body = { name: "Rajan", email: "r@e.co", age: 30, isAdmin: true };

const clean = userSchema.parse(body);

console.log(clean);
// { name: 'Rajan', email: 'r@e.co', age: 30 }      ← verified
console.log(body.isAdmin);
// true         ← the original is untouched
//
// So this is a real bug, and it type-checks fine:
//
//   userSchema.parse(request.body);
//   await db.insert(users).values(request.body);
//                                ^^^^^^^^^^^^ still dirty
//
// You validated one object and inserted another.


// ── parse() throws, with one issue per problem ──────────────
try {
  userSchema.parse({ name: "R", email: "nope", age: "thirty" });
} catch (err) {
  console.log(err.constructor.name);   // ZodError
  console.log(err.issues.length);      // 2        ← verified
  // Two bad fields, two issues. Report them all at once, or
  // the client fixes one field per round trip.
}


// ── safeParse() returns a result ────────────────────────────
const result = userSchema.safeParse({ name: "R", email: "nope", age: 1 });

if (!result.success) {
  console.log(result.error.issues[0].message);
  // "Invalid email address"
} else {
  console.log(result.data);
}
//
// The TypeScript benefit: result.data does not exist until
// you have narrowed on result.success. You cannot forget.


// ── ⚠ Zod strips unknown keys. Verified. ────────────────────
const r = userSchema.safeParse({
  name: "R", email: "a@b.co", age: 30, isAdmin: true,
});
console.log(r.data);
// { name: 'R', email: 'a@b.co', age: 30 }
//
// isAdmin is gone. Silently. 
//
// Day 15 verified that Fastify's JSON Schema, given that
// exact payload, hands isAdmin STRAIGHT THROUGH to your
// handler.
//
//   Zod            →  stripped
//   JSON Schema    →  allowed
//
// Same input. Opposite outcomes. No warning from either.


// ── .strict() rejects instead of stripping ──────────────────
const strict = userSchema.strict().safeParse({
  name: "R", email: "a@b.co", age: 30, isAdmin: true,
});
console.log(strict.success);                        // false
console.log(strict.error.issues[0].code);           // "unrecognized_keys"
// Verified.
//
// Which to use: strip when clients may send extra fields you
// do not care about (very common, and forgiving). Reject when
// an unexpected field means the client misunderstood your API
// and should be told, or when silently ignoring a field would
// lose data the client thinks it sent.


// ── parse() where a throw is what you want ──────────────────
const envSchema = z.object({
  DATABASE_URL: z.string().min(1),
  PORT: z.coerce.number().int().positive().default(3000),
  NODE_ENV: z.enum(["development", "test", "production"]),
});

export const env = envSchema.parse(process.env);
//
// This is the right place for parse(). If DATABASE_URL is
// missing you do NOT want a running server that fails on
// first request; you want a dead process and a clear message
// at deploy time. Day 4's fail-fast, applied to config.
//
// Note it also strips: env has exactly three keys, not every
// variable in your shell.


// ── safeParse() at an HTTP boundary ─────────────────────────
app.post("/users", async (request, reply) => {
  const parsed = userSchema.safeParse(request.body);

  if (!parsed.success) {
    return reply.code(400).send({
      error: "Bad Request",
      issues: parsed.error.issues.map((i) => ({
        field: i.path.join("."),
        message: i.message,
      })),
    });
  }

  return createUser(parsed.data);      // the clean value
});
//
// Correct, and you will not write it this way for long. The
// next lessons hand this whole block to Fastify.`,
      },
      keyTakeaways: [
        "Verified on Zod 4.5.4. `z.email()` is top-level in Zod 4; Zod 3's `z.string().email()` is what older tutorials show.",
        "`parse()` returns a new value with unknown keys removed and coercions applied. Validating `request.body` and then using `request.body` is a bug.",
        "Verified: a `ZodError` carries one issue per problem. Two bad fields gave two issues, so you can report them all at once.",
        "`safeParse()` makes TypeScript force you to handle failure: `result.data` does not exist until you narrow on `result.success`.",
        "Use `parse` where a throw is what you want, such as environment variables at startup. Use `safeParse` where you must build a 400.",
        "Verified: Zod strips unknown keys by default. `isAdmin: true` disappeared.",
        "Day 15 verified Fastify's JSON Schema passes that same field through. Two validators, one payload, opposite results, no warnings.",
        "Verified: `.strict()` rejects instead, with issue code `unrecognized_keys`. That is three behaviours from Zod alone.",
      ],
      commonMistakes: [
        "Copying Zod 3 syntax. `z.string().email()` and `z.email()` are different library versions, and the error is confusing.",
        "Calling `parse()` for its side effect and then using the original object. The stripping and coercion happened to the return value.",
        "Reporting only `issues[0]`. The client then fixes one field per request, and blames your API for it.",
        "Using `parse` in a request handler with no try/catch. It throws a `ZodError` that becomes a 500 unless something catches it.",
        "Assuming Zod and JSON Schema treat extra fields the same way. Verified: they are opposites.",
        "Using `.strict()` everywhere because rejecting sounds safer. A client that adds a harmless field now gets a 400 and cannot deploy.",
      ],
      quiz: [
        {
          question: "What does `schema.parse(data)` actually give you back?",
          options: [
            "A boolean",
            "A new value with unknown keys stripped and coercions applied, or a thrown `ZodError`",
            "The same object reference",
            "A promise",
          ],
          correctIndex: 1,
          explanation:
            "Which is why `parse(request.body)` followed by using `request.body` inserts the unvalidated object.",
        },
        {
          question: "You send `{ name, email, age, isAdmin }` to a Zod object schema that lists only the first three. What is in `result.data`?",
          options: [
            "All four fields",
            "Three fields; `isAdmin` was silently stripped",
            "A validation error",
            "Three fields plus a warning",
          ],
          correctIndex: 1,
          explanation:
            "Verified. And Day 15 verified that Fastify's JSON Schema passes the same field straight through.",
        },
        {
          question: "What is the practical advantage of `safeParse` over `parse` in an HTTP handler?",
          options: [
            "It is faster",
            "TypeScript will not let you touch `result.data` until you have handled `result.success`, so you cannot forget the failure path",
            "It validates more strictly",
            "It returns a promise",
          ],
          correctIndex: 1,
          explanation:
            "With `parse` you can omit the try/catch and TypeScript stays silent, which turns a 400 into a 500.",
        },
        {
          question: "Where is `parse()` the right choice?",
          options: [
            "Every request handler",
            "Validating environment variables at startup, where you want the process to die rather than boot half-configured",
            "Never",
            "Only in tests",
          ],
          correctIndex: 1,
          explanation:
            "Day 4's fail-fast rule applied to config. A dead process at deploy beats one failing on first request.",
        },
        {
          question: "What does `.strict()` change?",
          options: [
            "It makes types stricter only",
            "An unknown key becomes a validation failure with code `unrecognized_keys` instead of being stripped",
            "It disables coercion",
            "It makes all fields required",
          ],
          correctIndex: 1,
          explanation:
            "Verified. Reject when an extra field means the client misunderstood you; strip when extra fields are harmless.",
        },
      ],
    },
    {
      id: "four-tools-one-payload",
      title: "Four tools, one payload",
      durationMinutes: 12,
      explanation:
        "This lesson is one table, and it is the most useful thing in today's material.\n\nTake a single request body:\n\n```javascript\n{ \"name\": \"Rajan\", \"email\": \"a@b.co\", \"isAdmin\": true }\n```\n\nagainst a schema that lists `name` and `email` and says nothing about `isAdmin`. Four common setups, all verified, four different outcomes:\n\n```text\nFastify JSON Schema, default        →  200, isAdmin REACHES your handler\nFastify + additionalProperties:false →  200, isAdmin stripped\nZod, default                        →  200, isAdmin stripped\nZod + .strict()                     →  400, unrecognized_keys\n```\n\n> Read that top line again, because it is the one that hurts. The route has a schema. Validation passed. And an extra field you never declared is sitting in `request.body`. <b>A schema does not imply a filter.</b> Assuming it does is worse than having no schema at all, because with no schema you would still be treating the body carefully.\n\n---\n\n## Why this matters concretely\n\n```javascript\napp.post(\"/users\", { schema: { body: userSchema } }, async (request) => {\n  return db.insert(users).values(request.body);\n});\n```\n\nThat line looks clean and reviews well. On the default JSON Schema setting it lets a client write any column your table has: `isAdmin`, `role`, `credits`, `id`. This class of bug has a name, <b>mass assignment</b>, and it is a schema-shaped trap rather than a beginner mistake.\n\nThe same applies to updates:\n\n```javascript\nObject.assign(user, request.body);\nawait user.save();\n```\n\n---\n\n## Mass assignment\n\n<b>Mass assignment</b> (assigning a whole request payload onto a database record, so the client controls which fields are written).\n\n> The fix is not \"be careful\". It is to <b>never pass a request body onward as a whole</b>. Take the fields you meant: `const { name, email } = parsed.data`. That is boring, explicit, and immune to the next field somebody adds to the table.\n\n---\n\n## Strip or reject\n\nBoth are defensible, and the choice is about your clients rather than security:\n\n```text\nStrip   →  forgiving. an old client sending a\n           dead field keeps working.\n           the risk: a field the client thinks\n           it sent is silently discarded.\n\nReject  →  loud. the client learns immediately\n           that it misunderstood the API.\n           the risk: adding a harmless field to\n           a client now breaks it in production.\n```\n\nOne useful default: <b>strip on write endpoints, reject on anything where losing a field silently would be worse than an error</b>. A payment amount arriving under a misspelled key should be a 400, not a charge for zero.\n\n---\n\n## Why Fastify's validation is fast\n\nFastify compiles each JSON Schema into a purpose-built validator function at startup:\n\n```text\nSchema → compile → optimized validator → validate every request\n```\n\nrather than walking the schema object per request. That is why schema-based validation is not a performance cost in Fastify, and it is the same reason serialization is fast later today.\n\n> Which sets up a genuine trade-off. Zod validates by walking its schema at runtime, so it is slower per request than a compiled JSON Schema validator, and it gives you type inference that JSON Schema cannot. The next lesson is how to stop choosing between them.",
      diagram: `ONE payload. FOUR verified outcomes.

    body:  { name, email, isAdmin: true }
    schema lists:  name, email

    Fastify JSON Schema, default
        200 · isAdmin REACHES your handler

    Fastify + additionalProperties: false
        200 · isAdmin stripped

    Zod, default
        200 · isAdmin stripped

    Zod + .strict()
        400 · unrecognized_keys

    all four verified. all four silent about it.


The line that hurts

    the route HAS a schema.
    validation PASSED.
    an undeclared field is in request.body.

    A SCHEMA DOES NOT IMPLY A FILTER.

    assuming it does is worse than no schema:
    with no schema you would still be careful.


How it actually becomes a vulnerability

    db.insert(users).values(request.body)
    Object.assign(user, request.body)

    reviews fine. reads clean.
    on the default setting, the client can write
    any column you have:
      isAdmin · role · credits · id

    the name for this is MASS ASSIGNMENT.
    it is a schema-shaped trap, not a beginner
    mistake.


The fix is not "be careful"

    never pass a body onward WHOLE.

    const { name, email } = parsed.data;

    boring · explicit · immune to the next
    column somebody adds


Strip or reject: about clients, not security

    STRIP   forgiving
            old client with a dead field
            keeps working
            risk: a field the client THINKS it
            sent is silently discarded

    REJECT  loud
            client learns it misunderstood
            risk: adding a harmless field breaks
            it in production

    useful default:
      strip on writes
      reject where losing a field silently is
      worse than an error

    a payment amount under a misspelled key
    should be a 400, not a charge for zero.


Why Fastify validation is not a cost

    schema → COMPILE at startup
           → purpose-built validator function
           → run it per request

    not: walk the schema object every request.


And the trade that follows

    Zod            walks its schema at runtime
                   slower per request
                   gives you TYPE INFERENCE

    JSON Schema    compiled
                   faster
                   no types

    → next lesson: stop choosing.`,
      codeExample: {
        title: "The four behaviours, and the vulnerability they produce",
        code: `// ── 1. Fastify JSON Schema, default ─────────────────────────
import Fastify from "fastify";
const app = Fastify();

app.post("/users", {
  schema: {
    body: {
      type: "object",
      required: ["name", "email"],
      properties: {
        name: { type: "string" },
        email: { type: "string" },
      },
    },
  },
}, async (request) => ({ received: request.body }));

// POST { "name": "R", "email": "a@b", "isAdmin": true }
//   200 {"received":{"name":"R","email":"a@b","isAdmin":true}}
//                                    ^^^^^^^^^^^^^^^ verified
// The schema validated. isAdmin arrived anyway.


// ── 2. additionalProperties: false ──────────────────────────
app.post("/strict", {
  schema: {
    body: {
      type: "object",
      required: ["name"],
      additionalProperties: false,
      properties: { name: { type: "string" } },
    },
  },
}, async (request) => ({ received: request.body }));

// POST { "name": "R", "isAdmin": true }
//   200 {"received":{"name":"R"}}          ← verified
// Stripped, not rejected. Still a 200.


// ── 3. Zod, default ─────────────────────────────────────────
import { z } from "zod";
const userSchema = z.object({ name: z.string(), email: z.email() });

userSchema.safeParse({ name: "R", email: "a@b.co", isAdmin: true }).data;
// { name: 'R', email: 'a@b.co' }           ← verified
// Stripped.


// ── 4. Zod .strict() ────────────────────────────────────────
userSchema.strict().safeParse({ name: "R", email: "a@b.co", isAdmin: true });
// { success: false, issues: [{ code: 'unrecognized_keys' }] }
//                                          ← verified
// Rejected.


// ═══════════════════════════════════════════════════════════
// The vulnerability, written the way it appears in real code
// ═══════════════════════════════════════════════════════════

// users table:
//   id · name · email · password_hash · role · credits · is_admin

// ✗ Mass assignment. Reviews fine.
app.post("/users", {
  schema: { body: { type: "object", required: ["name", "email"],
    properties: { name: { type: "string" }, email: { type: "string" } } } },
}, async (request) => {
  return db.insert(users).values(request.body);
  //                             ^^^^^^^^^^^^
  // POST { "name": "R", "email": "a@b", "is_admin": true, "credits": 99999 }
  //
  // The schema does not mention is_admin or credits. On the
  // default setting they are in request.body. They go
  // straight into the INSERT.
});

// ✗ The same bug on an update, which is worse because the
//   record already exists and belongs to someone.
app.patch("/users/:id", async (request) => {
  const user = await findUser(request.params.id);
  Object.assign(user, request.body);
  return user.save();
  // PATCH { "role": "admin" }
});

// ✓ Take the fields you meant. Boring and immune.
app.post("/users", {
  schema: { body: { type: "object", required: ["name", "email"],
    additionalProperties: false,
    properties: { name: { type: "string" }, email: { type: "string" } } } },
}, async (request) => {
  const { name, email } = request.body;
  return db.insert(users).values({ name, email, role: "user" });
  //                              ^^^^^^^^^^^^^^^^^^^^^^^^^^^
  // Two belts: additionalProperties: false, and an explicit
  // field list. The second one survives someone removing the
  // first, and survives the next column being added.
});


// ── Choosing strip or reject ────────────────────────────────
//
// Strip, on a normal write endpoint:
//   An iOS client three versions old still sends "avatar_url",
//   which you removed. Stripping keeps it working. Rejecting
//   breaks every user who has not updated.
//
// Reject, where silence is expensive:
const chargeSchema = z.object({
  amountCents: z.number().int().positive(),
  currency: z.enum(["usd", "eur"]),
}).strict();
//
// A client that sends "amount_cents" instead of "amountCents"
// should get a 400 telling them so. With stripping, the field
// is dropped, required kicks in, and you get a confusing
// "amountCents is required" for a request that clearly
// contained an amount. Worse, if the field were optional with
// a default, you would charge the wrong number.`,
      },
      keyTakeaways: [
        "One payload, four verified outcomes: JSON Schema default allows the extra field, `additionalProperties: false` strips it, Zod strips it, Zod `.strict()` rejects it.",
        "A schema does not imply a filter. Verified: an undeclared field reaches your handler on Fastify's default setting.",
        "Assuming a schema filters is worse than having no schema, because you stop treating the body carefully.",
        "`db.insert(users).values(request.body)` and `Object.assign(user, request.body)` are mass assignment. The client picks which columns get written.",
        "The fix is not care, it is to never pass a body onward whole. Destructure the fields you meant.",
        "Strip is forgiving and risks silently discarding a field the client thinks it sent. Reject is loud and risks breaking clients that add a harmless field.",
        "Useful default: strip on writes, reject where losing a field silently costs more than an error. A misspelled payment amount should be a 400.",
        "Fastify compiles each schema into a validator function at startup, which is why validation is not a per-request cost. Zod walks its schema at runtime and gives you types instead.",
      ],
      commonMistakes: [
        "Believing that because a route has a body schema, `request.body` contains only the declared fields. Verified false on the default setting.",
        "Spreading or assigning a request body into a database call. That is the entire mass assignment class in one line.",
        "Setting `additionalProperties: false` and treating the problem as solved. It is one belt; the explicit field list is the one that survives refactors.",
        "Using `.strict()` on every schema because rejecting sounds safer, then breaking older clients that send one dead field.",
        "Stripping unknown keys on a money endpoint. A misspelled amount silently becomes absent, and a default could make it zero.",
        "Assuming Zod and JSON Schema behave the same because they are both validators. On this exact input they do opposite things.",
      ],
      quiz: [
        {
          question: "A Fastify route has a body schema listing `name` and `email`. A client sends `isAdmin: true` too, with default settings. What does `request.body` contain?",
          options: [
            "`name` and `email` only",
            "All three fields, including `isAdmin`",
            "Nothing, it 400s",
            "It depends on the content type",
          ],
          correctIndex: 1,
          explanation:
            "Verified. A schema validates; it does not filter unless you tell it to.",
        },
        {
          question: "What do Zod's default and `additionalProperties: false` have in common?",
          options: [
            "Both return 400",
            "Both strip the unknown field and succeed, so you get a 200 with the field silently gone",
            "Both reject unknown keys",
            "Neither affects unknown keys",
          ],
          correctIndex: 1,
          explanation:
            "Verified for both. Only Zod's `.strict()` turns it into a validation failure.",
        },
        {
          question: "Why is `db.insert(users).values(request.body)` dangerous even with a schema?",
          options: [
            "It is slow",
            "Undeclared fields can be present, so the client chooses which columns get written. That is mass assignment.",
            "Drizzle does not accept objects",
            "It bypasses the connection pool",
          ],
          correctIndex: 1,
          explanation:
            "The fix is to destructure the fields you meant rather than passing the body onward whole.",
        },
        {
          question: "When should you reject unknown keys rather than strip them?",
          options: [
            "Always",
            "When silently discarding a field the client believes it sent would cost more than an error, such as a payment amount",
            "Never, stripping is always safer",
            "Only on GET requests",
          ],
          correctIndex: 1,
          explanation:
            "A misspelled `amount_cents` should be a 400, not a dropped field and possibly a charge for zero.",
        },
        {
          question: "Why is Fastify's JSON Schema validation not a per-request performance cost?",
          options: [
            "It only validates in development",
            "Each schema is compiled into a purpose-built validator function at startup rather than walked per request",
            "It samples requests",
            "It runs in a worker thread",
          ],
          correctIndex: 1,
          explanation:
            "The same compilation trick makes serialization fast, and it is the reason Zod is slower per request while giving you types.",
        },
      ],
    },
    {
      id: "type-inference",
      title: "Type inference, and one schema for both jobs",
      durationMinutes: 11,
      explanation:
        "## `z.infer`\n\n<b>`z.infer`</b> (derives a TypeScript type from a Zod schema).\n\n> This is the reason to accept Zod's runtime cost. A JSON Schema is a plain object, so TypeScript knows nothing about what it describes; `request.body` stays `any` and every downstream function guesses. `z.infer` makes the type <b>a consequence of</b> the validation rule, so the two cannot disagree.\n\n```typescript\nconst userSchema = z.object({\n  name: z.string(),\n  email: z.email(),\n  age: z.number(),\n});\n\ntype User = z.infer<typeof userSchema>;\n// { name: string; email: string; age: number }\n```\n\nNo duplicate interface, and no way for one to drift from the other.\n\n---\n\n## The drift you are avoiding\n\nWithout inference you write the shape three times:\n\n```text\nValidation says   email required\nTypeScript says   email optional\nDocs say          email required\n```\n\nAll three were correct when written. One of them was updated. Nothing failed, because nothing connects them, and now you have a type that lies. A lying type is worse than no type: you stop checking, because the compiler said it was fine.\n\n---\n\n## `fastify-type-provider-zod`\n\n<b>`fastify-type-provider-zod`</b> (an integration that lets Fastify validate and serialize with Zod schemas while connecting them to Fastify's TypeScript types).\n\n> What it actually does is replace Fastify's two compilers. `setValidatorCompiler` swaps how a route's schema validates, and `setSerializerCompiler` swaps how the response is serialized. Once both are Zod's, `request.body` is typed from the schema and Zod's stripping applies in both directions.\n\nVerified end to end on `fastify-type-provider-zod@7.0.0` with Zod 4.5.4:\n\n```javascript\napp.setValidatorCompiler(validatorCompiler);\napp.setSerializerCompiler(serializerCompiler);\n\napp.post(\"/users\", {\n  schema: {\n    body: z.object({ name: z.string().min(1), email: z.email(), age: z.number().int().positive() }),\n    response: { 200: z.object({ id: z.number(), name: z.string(), email: z.email() }) },\n  },\n}, async (request) => ({ id: 1, ...request.body, passwordHash: \"SECRET\" }));\n```\n\nResults, both verified:\n\n```text\n{ name, email, age, isAdmin: true }\n   → 200  { \"id\":1, \"name\":\"Rajan\", \"email\":\"r@e.co\" }\n     isAdmin stripped on the way in\n     passwordHash and age stripped on the way out\n\n{ name, email: \"nope\", age }\n   → 400  \"body/email Invalid email address\"\n```\n\nLook at that response. The handler explicitly returned `passwordHash: \"SECRET\"` and the client did not get it. Both arrows of the boundary, from one pair of schemas.\n\n---\n\n## One schema, four jobs\n\n```text\n              User Schema\n                   │\n     ┌─────────┬───┴───┬─────────┐\n     ↓         ↓       ↓         ↓\n Validation  Types  Response  OpenAPI\n```\n\n> The honest caveat: this is one schema per <b>direction</b>, not one schema for everything. A create-user body and a user response are genuinely different shapes, because one has no `id` and the other must never have a password. Trying to force them into a single object is how you end up with a type full of optional fields that means nothing. Derive them instead: `userSchema.omit({ passwordHash: true })`, `createUserSchema.partial()` for a PATCH.",
      diagram: `z.infer: why Zod's cost is worth paying

    JSON Schema is a plain object.
    TypeScript knows NOTHING about it.
      request.body stays any
      every downstream function guesses

    type User = z.infer<typeof userSchema>;

    the type becomes a CONSEQUENCE of the
    validation rule. they cannot disagree.


The drift you are avoiding

    validation says   email required
    TypeScript says   email optional
    docs say          email required

    all three were right when written.
    one was updated.
    nothing failed, because nothing connects them.

    now you have a type that LIES.
    that is worse than no type: you stop checking,
    because the compiler said it was fine.


What the type provider actually does

    setValidatorCompiler(validatorCompiler)
        └─ swaps HOW a route's schema validates

    setSerializerCompiler(serializerCompiler)
        └─ swaps HOW the response serializes

    once both are Zod's:
      request.body is typed from the schema
      Zod's stripping applies BOTH directions


Verified end to end
  fastify-type-provider-zod 7.0.0 · zod 4.5.4

    in:   { name, email, age, isAdmin: true }
    out:  200 { id, name, email }

      isAdmin        stripped going IN
      passwordHash   stripped going OUT
      age            stripped going OUT

    the handler LITERALLY returned
    passwordHash: "SECRET" and the client
    did not get it.

    in:   { name, email: "nope", age }
    out:  400  "body/email Invalid email address"


One schema, four jobs

              User Schema
                   │
      ┌────────┬───┴───┬────────┐
      ↓        ↓       ↓        ↓
  Validation Types Response  OpenAPI


⚠ The honest caveat

    one schema per DIRECTION, not one for
    everything.

    create-user body   no id
    user response      never a password

    forcing them into one object gives you a type
    full of optional fields that means nothing.

    DERIVE instead:
      userSchema.omit({ passwordHash: true })
      createUserSchema.partial()      for PATCH`,
      codeExample: {
        title: "Fastify plus Zod, verified end to end",
        code: `// ── The setup, two lines ────────────────────────────────────
import Fastify from "fastify";
import { z } from "zod";
import {
  serializerCompiler,
  validatorCompiler,
} from "fastify-type-provider-zod";

const app = Fastify({ logger: true });

app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);
// Verified on fastify-type-provider-zod 7.0.0 with zod 4.5.4.
// From here, route schemas are Zod objects instead of JSON
// Schema, in both directions.


// ── Derive the shapes, do not repeat them ───────────────────
// The full internal user. This is your model, not your API.
const userSchema = z.object({
  id: z.number().int().positive(),
  name: z.string().min(1),
  email: z.email(),
  age: z.number().int().positive(),
  passwordHash: z.string(),
  isAdmin: z.boolean(),
});

// What a client may CREATE: no id, no passwordHash, no isAdmin.
const createUserSchema = userSchema.omit({
  id: true,
  passwordHash: true,
  isAdmin: true,
});

// What a client may SEE. Note this is not the model minus one
// field; it is a deliberate, separate list.
const userResponseSchema = z.object({
  id: z.number(),
  name: z.string(),
  email: z.email(),
});

// What a PATCH may change: the creatable fields, all optional.
const updateUserSchema = createUserSchema.partial();

// And the types come free, from the same objects.
type User = z.infer<typeof userSchema>;
type CreateUser = z.infer<typeof createUserSchema>;
type UserResponse = z.infer<typeof userResponseSchema>;
//
// CreateUser is { name: string; email: string; age: number }
// with no id, because omit() said so. There is no second
// place for that to drift from.


// ── The route ───────────────────────────────────────────────
app.post("/users", {
  schema: {
    body: createUserSchema,
    response: { 201: userResponseSchema },
  },
}, async (request, reply) => {
  // request.body is typed as CreateUser. Not any.
  const { name, email, age } = request.body;

  const created = await createUser({ name, email, age });
  // created is the full row: id, name, email, age,
  // passwordHash, isAdmin.

  return reply.code(201).send(created);
  // The response schema lists three fields. The rest never
  // leave the process.
});


// ── Verified behaviour ──────────────────────────────────────
//
// POST { "name": "Rajan", "email": "r@e.co", "age": 30,
//        "isAdmin": true }
//
//   200  {"id":1,"name":"Rajan","email":"r@e.co"}
//
//   isAdmin      stripped on the way IN   (Zod's default)
//   passwordHash stripped on the way OUT  (response schema)
//   age          stripped on the way OUT  (not listed)
//
// The handler literally returned passwordHash: "SECRET" in
// the test and the client did not receive it.
//
// POST { "name": "Rajan", "email": "nope", "age": 30 }
//
//   400  {"statusCode":400,"code":"FST_ERR_VALIDATION",
//         "error":"Bad Request",
//         "message":"body/email Invalid email address"}
//
// Note the message names the field AND the path. That is
// better than most hand-written validation produces.


// ── Why not just use z.infer without the provider ───────────
// You could do this:
//
//   app.post("/users", async (request) => {
//     const parsed = createUserSchema.safeParse(request.body);
//     if (!parsed.success) return reply.code(400).send(...);
//     ...
//   });
//
// It works. What you lose:
//   · request.body is still \`any\` at the top of the handler
//   · you write the 400 shape once per route
//   · nothing filters the response
//   · nothing can generate OpenAPI from it
//
// The provider is not sugar. It moves the schema from
// "something the handler calls" to "part of the route
// definition", which is what makes the other three jobs
// possible.


// ── The drift this prevents, concretely ─────────────────────
// Without inference, somebody makes email optional in the
// interface because a test needed it:
//
//   interface CreateUser {
//     name: string;
//     email?: string;      // ← "temporarily"
//     age: number;
//   }
//
// The Zod schema still requires it. So does the OpenAPI doc.
// TypeScript now believes a field is optional that the
// runtime rejects, and every  if (user.email)  guard written
// after that point is dead code protecting nothing.
//
// With z.infer there is no interface to edit.`,
      },
      keyTakeaways: [
        "`z.infer` makes the TypeScript type a consequence of the validation rule, so they cannot disagree. A plain JSON Schema leaves `request.body` as `any`.",
        "The drift is real and silent: validation requires a field, the hand-written interface makes it optional, nothing connects them, and now the type lies.",
        "A lying type is worse than no type, because you stop checking.",
        "`fastify-type-provider-zod` replaces Fastify's validator and serializer compilers, so Zod schemas work in both directions and type the request.",
        "Verified on 7.0.0 with Zod 4.5.4: `isAdmin` stripped on the way in, `passwordHash` and an unlisted `age` stripped on the way out, and a readable `body/email Invalid email address` on a 400.",
        "The handler explicitly returned `passwordHash: \"SECRET\"` and the client did not receive it. That is the response schema working as a control.",
        "One schema per direction, not one for everything. A create body and a user response are genuinely different shapes.",
        "Derive them rather than repeating them: `.omit()` for the response, `.partial()` for a PATCH body.",
      ],
      commonMistakes: [
        "Writing a Zod schema and a matching `interface` by hand. That is the drift the library exists to remove.",
        "Trying to serve create, update and response from one schema. You get a type full of optional fields that guarantees nothing.",
        "Calling `safeParse` inside handlers instead of registering the compilers. It works, and you lose typing, the shared 400 shape, response filtering and OpenAPI.",
        "Setting only `setValidatorCompiler`. Without the serializer compiler, response schemas do nothing and `passwordHash` ships.",
        "Deriving the response schema as \"the model minus the password\". It should be a deliberate list, so adding a column does not expose it.",
        "Copying a Zod 3 type-provider setup. The 7.x provider targets Fastify 5 and Zod 4, and the older combinations do not interchange.",
      ],
      quiz: [
        {
          question: "What does `z.infer` actually buy you?",
          options: [
            "Faster validation",
            "The TypeScript type becomes a consequence of the schema, so the two cannot drift apart",
            "Runtime type checks",
            "Smaller bundles",
          ],
          correctIndex: 1,
          explanation:
            "A plain JSON Schema is just an object; TypeScript knows nothing about it and `request.body` stays `any`.",
        },
        {
          question: "Why is a hand-written interface alongside a schema dangerous?",
          options: [
            "It is more code",
            "Nothing connects them, so when one changes the type silently starts lying and you stop checking",
            "It slows compilation",
            "TypeScript rejects duplicates",
          ],
          correctIndex: 1,
          explanation:
            "Every `if (user.email)` guard written after the drift is dead code protecting nothing.",
        },
        {
          question: "What does `fastify-type-provider-zod` replace?",
          options: [
            "The router",
            "Fastify's validator and serializer compilers, so Zod handles both directions",
            "The JSON parser",
            "The logger",
          ],
          correctIndex: 1,
          explanation:
            "Registering only the validator compiler means response schemas do nothing, and `passwordHash` ships.",
        },
        {
          question: "The handler returns `passwordHash: \"SECRET\"` and the response schema lists `id`, `name`, `email`. What did the verified test show?",
          options: [
            "A 500",
            "`{\"id\":1,\"name\":\"Rajan\",\"email\":\"r@e.co\"}` with `passwordHash` never leaving the process",
            "The field, nulled",
            "A warning in the logs",
          ],
          correctIndex: 1,
          explanation:
            "Both arrows of the boundary guarded by one pair of schemas.",
        },
        {
          question: "Should a create body and a user response share one schema?",
          options: [
            "Yes, that is single source of truth",
            "No. They are different shapes, so derive them with `.omit()` and `.partial()` from a common definition",
            "Yes, with optional fields",
            "It does not matter",
          ],
          correctIndex: 1,
          explanation:
            "One schema per direction. Forcing one object to serve both gives you a type full of optionals that guarantees nothing.",
        },
      ],
    },
    {
      id: "validating-every-input",
      title: "Validating body, query, params and headers",
      durationMinutes: 11,
      explanation:
        "Four inputs, four schemas, same idea.\n\n---\n\n## Body\n\n```typescript\nconst createUserSchema = z.object({\n  name: z.string().min(1),\n  email: z.email(),\n});\n```\n\nThe one from the last lesson. Nothing new.\n\n---\n\n## Query parameters\n\n```text\nGET /users?page=2&limit=20\n```\n\nDay 15 verified these arrive as strings. So:\n\n```typescript\nconst querySchema = z.object({\n  page: z.coerce.number().int().positive().default(1),\n  limit: z.coerce.number().int().positive().max(100).default(20),\n});\n```\n\n> Note the `.max(100)`. Without it, `?limit=1000000` is a perfectly valid request that asks your database for a million rows, and Day 17 will show you what that does to a connection pool. A pagination schema without an upper bound is a denial-of-service endpoint with good intentions.\n\n---\n\n## Route parameters\n\n```typescript\nconst paramsSchema = z.object({\n  id: z.coerce.number().int().positive(),\n});\n```\n\nDay 15 verified that plain JSON Schema already coerces `\"123\"` to `123` with `{ type: \"integer\" }`, so this is not new capability. What it adds is the type: `request.params.id` is now a `number` to TypeScript as well as at runtime.\n\n---\n\n## Headers\n\n```typescript\nconst headersSchema = z.object({\n  \"x-api-key\": z.string().min(1),\n});\n```\n\n> Two things about headers specifically. They are <b>lower-cased</b>, as Day 10 established, so `\"X-API-Key\"` in your schema will never match. And a header schema must not be strict: browsers and proxies send dozens of headers you have never heard of, so rejecting unknown keys here rejects every real request.\n\n---\n\n## Custom error messages\n\nDefault messages are for developers:\n\n```text\nInvalid input\n```\n\nYours should be for whoever has to fix the request:\n\n```typescript\nz.string().min(1, { message: \"Name is required\" });\nz.number().int().min(18, { message: \"Age must be at least 18\" });\n```\n\nVerified: the custom message comes back in `issues[0].message`.\n\nAnd report <b>all</b> the issues. Zod gives you one per problem, verified as two issues for two bad fields. Mapping them into a list is a few lines and it turns a five-round-trip debugging session into one.\n\n```typescript\nissues: error.issues.map((i) => ({ field: i.path.join(\".\"), message: i.message }))\n```\n\n> One caution that is easy to get wrong. Validation errors describe the <b>request</b>, so they are safe to return. That is not a licence to return every error: Day 15 verified that a thrown error's message reaches the client, and a database error's message is not a validation message. Keep the two paths separate in your error handler.",
      diagram: `Four inputs, four schemas

    body      z.object({ name, email })
    query     z.coerce, with BOUNDS
    params    z.coerce.number()
    headers   lower-cased, never strict


⚠ Query: the bound is not optional

    page:  z.coerce.number().int().positive()
                            .default(1)
    limit: z.coerce.number().int().positive()
                            .max(100)
                            .default(20)

    without .max():
      ?limit=1000000
      a perfectly valid request that asks your
      database for a million rows  (Day 17)

    a pagination schema with no upper bound is a
    denial-of-service endpoint with good
    intentions.


Params: not new capability, new TYPE

    Day 15 verified JSON Schema already coerces
    "123" → 123 with { type: "integer" }

    what Zod adds:
      request.params.id is a number to
      TYPESCRIPT too, not just at runtime


⚠ Headers: two traps

    1. LOWER-CASED  (Day 10)
       "X-API-Key" in your schema never matches

    2. never .strict()
       browsers and proxies send dozens of
       headers you have never heard of.
       rejecting unknown keys here rejects
       every real request.


Error messages are for whoever fixes the request

    default:  "Invalid input"
    yours:    "Age must be at least 18"

    z.string().min(1, { message: "Name is required" })

    verified: it comes back in issues[0].message


Report ALL of them

    verified: 2 bad fields → 2 issues

    issues: error.issues.map(i => ({
      field: i.path.join("."),
      message: i.message,
    }))

    a few lines. turns a five-round-trip debugging
    session into one.


⚠ But not every error

    validation errors describe the REQUEST,
    so they are safe to return.

    that is NOT a licence to return every error.

    Day 15 verified a thrown error's message
    reaches the client. a database error's
    message is not a validation message.

    keep the two paths separate.`,
      codeExample: {
        title: "All four inputs, with the bounds and the error shape",
        code: `import Fastify from "fastify";
import { z } from "zod";
import { serializerCompiler, validatorCompiler } from "fastify-type-provider-zod";

const app = Fastify({ logger: true });
app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);


// ── Query: coerce, bound, default ───────────────────────────
const listQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
  sort: z.enum(["name", "createdAt"]).default("createdAt"),
  order: z.enum(["asc", "desc"]).default("desc"),
  q: z.string().max(200).optional(),
});

app.get("/users", {
  schema: { querystring: listQuerySchema },
}, async (request) => {
  // Every value is the right type, bounded, and defaulted.
  const { page, limit, sort, order, q } = request.query;
  return listUsers({ page, limit, sort, order, q });
});
//
// GET /users                  ->  page 1, limit 20
// GET /users?limit=1000000    ->  400, "Too big: expected
//                                  number to be <=100"
// GET /users?sort=DROP        ->  400, invalid enum value
//
// That .max(100) is the difference between pagination and an
// endpoint anyone can point at your database. Day 17 will
// show what a million-row query does to a connection pool.


// ── Params: coerce, and the type comes with it ──────────────
const idParamsSchema = z.object({
  id: z.coerce.number().int().positive(),
});

app.get("/users/:id", {
  schema: {
    params: idParamsSchema,
    response: { 200: userResponseSchema },
  },
}, async (request, reply) => {
  const user = await findUser(request.params.id);   // a number
  if (!user) return reply.code(404).send({ error: "Not found" });
  return user;
});
//
// GET /users/123   ->  id is 123, a number
// GET /users/abc   ->  400 before the handler
// GET /users/-1    ->  400, .positive() caught it
// GET /users/0     ->  400 as well. Decide whether you want
//                      that; .nonnegative() allows zero.


// ── Headers: lower-case, and never strict ───────────────────
const authHeadersSchema = z.object({
  "x-api-key": z.string().min(1, { message: "x-api-key header is required" }),
  //  ^^^^^^^^ lower-case. "X-API-Key" would never match,
  //           because Node normalizes header names. (Day 10)
});
// Note: NOT .strict(). A browser sends accept, accept-encoding,
// accept-language, user-agent, referer, sec-fetch-mode and a
// dozen more. Strict here rejects every real request.

app.get("/admin/stats", {
  schema: { headers: authHeadersSchema },
}, async () => {
  return { users: 42 };
});


// ── Custom messages, verified ───────────────────────────────
const signupSchema = z.object({
  name: z.string()
    .min(1, { message: "Name is required" })
    .max(80, { message: "Name must be 80 characters or fewer" }),
  email: z.email({ message: "Enter a valid email address" }),
  age: z.number()
    .int({ message: "Age must be a whole number" })
    .min(18, { message: "You must be at least 18" }),
  password: z.string()
    .min(12, { message: "Use at least 12 characters" }),
});
// Verified: the custom text is what lands in
// issues[0].message, not Zod's default.


// ── Reporting every issue, not just the first ───────────────
app.setErrorHandler((error, request, reply) => {
  request.log.error({ err: error });

  // Fastify's validation errors, from any of the four schemas.
  if (error.validation) {
    return reply.code(400).send({
      error: "Bad Request",
      issues: (error.validation ?? []).map((v) => ({
        field: v.instancePath || v.params?.issue?.path?.join("."),
        message: v.message,
      })),
    });
  }

  // Everything else. Day 15's rule: 4xx carries a message,
  // 5xx does not, because a database error's message is not
  // a validation message.
  if (error.statusCode && error.statusCode < 500) {
    return reply.code(error.statusCode).send({ error: error.message });
  }
  return reply.code(500).send({
    error: "Internal Server Error",
    requestId: request.id,
  });
});
//
// Verified with Zod directly: two bad fields produce two
// issues. So this returns:
//
//   { "error": "Bad Request", "issues": [
//       { "field": "email", "message": "Enter a valid email address" },
//       { "field": "age",   "message": "You must be at least 18" }
//   ]}
//
// rather than making the client discover them one request at
// a time.


// ── If you are validating by hand instead ───────────────────
const parsed = signupSchema.safeParse(request.body);
if (!parsed.success) {
  return reply.code(400).send({
    error: "Bad Request",
    issues: parsed.error.issues.map((i) => ({
      field: i.path.join("."),        // "address.postcode" for nested
      message: i.message,
      code: i.code,                   // "too_small", "invalid_type", ...
    })),
  });
}
// i.path is an array, which is why join(".") is the right
// move: a nested failure gives you the full path rather than
// just the leaf field name.`,
      },
      keyTakeaways: [
        "All four inputs take schemas: body, querystring, params and headers.",
        "A pagination schema without `.max()` is a denial-of-service endpoint. `?limit=1000000` is otherwise a valid request.",
        "Zod on params adds the TypeScript type, not the coercion. Day 15 verified plain JSON Schema already coerces with `{ type: \"integer\" }`.",
        "Header names are lower-cased by Node, so `\"X-API-Key\"` in a schema never matches.",
        "Never make a header schema strict. Browsers and proxies send many headers you did not plan for.",
        "Verified: a custom `{ message: ... }` is what lands in `issues[0].message`.",
        "Verified: two bad fields give two issues. Map them all into the 400 or the client debugs one round trip at a time.",
        "`i.path` is an array, so `join(\".\")` gives you the full path for a nested failure rather than the leaf name.",
        "Validation errors describe the request and are safe to return. Day 15 verified other thrown messages reach the client too, and those are not safe.",
      ],
      commonMistakes: [
        "Writing a pagination schema with no upper bound on `limit`. It validates, and it hands your database an unbounded query.",
        "Putting `\"X-API-Key\"` in a header schema. Node lower-cased it, so the field is always missing.",
        "Calling `.strict()` on a header schema. Every browser request now 400s on `accept-encoding`.",
        "Returning only `issues[0]`. The client fixes one field per request and concludes your API is hostile.",
        "Using `i.path[0]` for the field name. Nested failures need `i.path.join(\".\")`.",
        "Returning `error.message` for every error because validation messages are safe. A database error's message is not a validation message.",
        "Forgetting `.positive()` on an id, then querying with `-1` or `0` and getting an empty result rather than a 400.",
      ],
      quiz: [
        {
          question: "What is wrong with `limit: z.coerce.number().int().positive()` on a list endpoint?",
          options: [
            "Nothing",
            "It has no upper bound, so `?limit=1000000` is a valid request that asks the database for a million rows",
            "`coerce` is unnecessary",
            "`positive()` rejects 1",
          ],
          correctIndex: 1,
          explanation:
            "Add `.max(100)`. Without it you have written a denial-of-service endpoint with good intentions.",
        },
        {
          question: "Why does `\"X-API-Key\": z.string()` never match?",
          options: [
            "Hyphens are invalid",
            "Node lower-cases header names, so the key is `\"x-api-key\"`",
            "Zod cannot validate headers",
            "It needs quotes removed",
          ],
          correctIndex: 1,
          explanation:
            "Day 10's header normalization, arriving as a schema bug that looks like a missing header.",
        },
        {
          question: "Why should a header schema never be strict?",
          options: [
            "Performance",
            "Browsers and proxies send many headers you did not declare, so rejecting unknown keys rejects every real request",
            "Fastify forbids it",
            "Headers are already validated",
          ],
          correctIndex: 1,
          explanation:
            "This is the one place where stripping or ignoring unknown keys is clearly correct.",
        },
        {
          question: "Two fields are invalid. What should the 400 contain?",
          options: [
            "The first issue",
            "Both issues, since Zod produces one per problem and reporting all of them saves round trips",
            "A generic message",
            "A count",
          ],
          correctIndex: 1,
          explanation:
            "Verified two issues for two bad fields. Mapping them is a few lines and it saves the client a debugging loop.",
        },
        {
          question: "Why `i.path.join(\".\")` rather than `i.path[0]`?",
          options: [
            "Style",
            "`path` is an array, so a nested failure needs the full path, like `address.postcode`",
            "`path[0]` is always empty",
            "`join` is faster",
          ],
          correctIndex: 1,
          explanation:
            "With `path[0]` a nested error reports the top-level object and the client cannot tell which field failed.",
        },
      ],
    },
    {
      id: "coercion-and-transformation",
      title: "Coercion and transformation",
      durationMinutes: 11,
      explanation:
        "## Coercion\n\n<b>Coercion</b> (converting an input value from one type into another before validating it).\n\n> The reason this exists is that HTTP has no types. `?page=10` is the three characters `\"10\"`, and no amount of schema wishing makes it a number. Coercion is where you admit that and convert once, at the boundary, instead of calling `Number(...)` in every handler.\n\n```typescript\nz.coerce.number()      // \"10\" → 10\n```\n\n---\n\n## The coercion trap\n\nCoercion uses JavaScript's own conversion rules, and those have some famous corners. Verified:\n\n```text\nz.coerce.number().int().positive()\n\n\"10\"      →  10        ✓\n\"banana\"  →  fails, \"expected number, received NaN\"   ✓\n\"\"        →  fails, but only because of .positive()\n```\n\nThat last line is the one to remember. `Number(\"\")` is <b>0</b>, not `NaN`. So an empty query parameter, which is exactly what `?page=` gives you, coerces to a perfectly valid zero.\n\n> Verified: the empty string got as far as producing the issue `\"Too small: expected number to be >0\"`, which means `.positive()` is the only thing that caught it. Write `z.coerce.number()` on its own and `?page=` silently becomes page 0. Then `OFFSET (0 - 1) * 20` is `-20` and your query either errors or returns something surprising. <b>Always constrain a coerced number</b>, with `.positive()`, `.min()` or `.max()`. Coercion without a constraint is not validation.\n\nThe same care applies to booleans. `z.coerce.boolean()` follows JavaScript truthiness, so the string `\"false\"` is truthy and becomes `true`. For a query flag you want an explicit mapping instead:\n\n```typescript\nz.enum([\"true\", \"false\"]).transform((v) => v === \"true\")\n```\n\n---\n\n## When not to coerce\n\nCoerce where the transport forces strings: query parameters, route parameters, headers, environment variables, form bodies.\n\nDo <b>not</b> coerce a JSON body. JSON has real types, so if a client sends `{ \"age\": \"30\" }` that is a client bug, and coercing it hides the bug from both of you until something else breaks.\n\n---\n\n## Transformation\n\n<b>Transformation</b> (changing valid input into another useful representation).\n\n```typescript\nz.string().trim().toLowerCase()      // \"  RAJAN@X.COM \" → \"rajan@x.com\"\n```\n\nVerified: `z.string().trim().toUpperCase().parse(\"  rajan  \")` gives `\"RAJAN\"`.\n\n> Keep the two words apart, because they answer different questions. Validation asks <b>\"is this acceptable?\"</b> Transformation asks <b>\"how should I represent this internally?\"</b> Mixing them produces the bug where a value is normalized before the check that was supposed to reject it, or checked before the normalization that would have made it valid.\n\nThe order matters and it is not obvious. `z.string().trim().min(1)` rejects `\"   \"`, because it trims first and then finds an empty string. `z.string().min(1).trim()` accepts it, because three spaces passed `min(1)` before being trimmed away. Same two rules, opposite outcomes.\n\n---\n\n## Where a transformation earns its keep\n\nEmail is the clearest case. Store `\"Rajan@Example.COM\"` as typed and you will have two accounts for one person, a failing login, and a support ticket that makes no sense. `z.email().toLowerCase()` at the boundary makes that impossible for every route at once, which is the argument for the boundary in one example.",
      diagram: `Coercion exists because HTTP has no types

    ?page=10   is the three characters "10"

    no amount of schema wishing makes it 10.

    coerce ONCE at the boundary, instead of
    Number(...) in every handler.


⚠ The trap, verified

    z.coerce.number().int().positive()

    "10"       →  10                      ✓
    "banana"   →  fails, "received NaN"   ✓
    ""         →  fails, but ONLY because
                  of .positive()

    Number("")  is  0.   Not NaN.

    ?page=      gives you the empty string
                which coerces to a valid ZERO

    verified issue text:
      "Too small: expected number to be >0"
      ← .positive() was the only thing that
        caught it

    z.coerce.number() alone
        → ?page= becomes page 0
        → OFFSET (0 - 1) * 20  is  -20
        → error, or something surprising

    ALWAYS constrain a coerced number.
    coercion without a constraint is not
    validation.


⚠ Booleans are worse

    z.coerce.boolean() follows JS truthiness

    "false"  →  true      (non-empty string)

    for a query flag, map explicitly:
      z.enum(["true","false"])
       .transform(v => v === "true")


Where to coerce, and where not to

    COERCE      the transport forces strings
                query · params · headers
                env vars · form bodies

    DO NOT      a JSON body
                JSON has real types.
                { "age": "30" } is a CLIENT BUG.
                coercing hides it from both of
                you until something else breaks.


Two words, two questions

    validation        "is this acceptable?"
    transformation    "how do I represent this
                       internally?"

    mixing them gives you the bug where a value
    is normalized before the check meant to
    reject it, or checked before the
    normalization that would have made it valid.


⚠ Order is not obvious

    z.string().trim().min(1)   rejects "   "
        trims first, finds "" → too small

    z.string().min(1).trim()   ACCEPTS "   "
        three spaces pass min(1), then vanish

    same two rules. opposite outcomes.


Where transformation earns its keep

    "Rajan@Example.COM" stored as typed
        → two accounts for one person
        → a failing login
        → a support ticket that makes no sense

    z.email().toLowerCase()  at the boundary
        → impossible, for every route at once

    that is the argument for the boundary,
    in one example.`,
      codeExample: {
        title: "Coercion, its traps, and transformation order",
        code: `import { z } from "zod";
// All behaviour below verified on zod 4.5.4


// ── The happy path ──────────────────────────────────────────
const q = z.object({
  page: z.coerce.number().int().positive(),
});

q.safeParse({ page: "10" }).data;        // { page: 10 }        ✓
q.safeParse({ page: "banana" }).success; // false               ✓
// message: "Invalid input: expected number, received NaN"


// ── ⚠ The trap: Number("") is 0 ─────────────────────────────
q.safeParse({ page: "" });
// {
//   success: false,
//   issues: [{ code: 'too_small', minimum: 0,
//              message: 'Too small: expected number to be >0' }]
// }
//
// Read the issue code. It is too_small, NOT invalid_type.
// The empty string coerced to a valid 0 and then .positive()
// rejected it.
//
// So without the constraint:
const loose = z.object({ page: z.coerce.number() });
loose.safeParse({ page: "" }).data;      // { page: 0 }   ← passes!
//
// GET /users?page=
//   page = 0
//   OFFSET (page - 1) * limit  =  -20
//   Postgres: ERROR: OFFSET must not be negative
//
// or worse, with a different formula, a query that silently
// returns the wrong page and nobody notices for a month.
//
// Rule: a coerced number always gets a constraint.
//   .positive()  .min()  .max()  .int()


// ── ⚠ Booleans follow JS truthiness ─────────────────────────
z.coerce.boolean().parse("false");       // true
z.coerce.boolean().parse("0");           // true
z.coerce.boolean().parse("");            // false
//
// Every non-empty string is truthy, so "false" is true. For
// a query flag that is never what you want:

const flagSchema = z.object({
  includeDeleted: z
    .enum(["true", "false"])
    .default("false")
    .transform((v) => v === "true"),
});

flagSchema.parse({ includeDeleted: "false" });  // { includeDeleted: false }
flagSchema.parse({ includeDeleted: "yes" });    // throws — good.
//
// Explicit mapping, and an unexpected value is an error
// rather than a silent true.


// ── Where to coerce, and where not to ───────────────────────

// ✓ Query string: the transport forces strings.
const listQuery = z.object({
  page: z.coerce.number().int().positive().max(10_000).default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
});

// ✓ Environment variables: always strings.
const envSchema = z.object({
  PORT: z.coerce.number().int().positive().default(3000),
  MAX_POOL: z.coerce.number().int().min(1).max(50).default(10),
});

// ✗ A JSON body: JSON has real types.
const badBody = z.object({ age: z.coerce.number() });
// { "age": "30" }  ->  30, and everybody stays happy until
// the mobile team wonders why their string field works on
// your API and not on the next one.
//
// ✓ Say what you mean, and let the client fix their bug.
const goodBody = z.object({ age: z.number().int().positive() });
// { "age": "30" }  ->  400, "expected number, received string"


// ── Transformation, and why order matters ───────────────────
z.string().trim().toUpperCase().parse("  rajan  ");   // "RAJAN"   ✓ verified

// The order is the whole behaviour:
z.string().trim().min(1).safeParse("   ").success;    // false
//    trim first  ->  ""  ->  min(1) fails.  Correct.

z.string().min(1).trim().safeParse("   ").success;    // true
//    min(1) sees three characters and passes, THEN it is
//    trimmed to "". You have stored an empty name.
//
// Same two rules. Opposite outcomes. Read your chains.


// ── Where transformation earns its keep ─────────────────────
const emailSchema = z.email().toLowerCase();

emailSchema.parse("Rajan@Example.COM");     // "rajan@example.com"
//
// Without this, one person creates two accounts, cannot log
// in with the capitalisation they used the second time, and
// files a support ticket that makes no sense to anyone.
//
// Doing it at the boundary fixes it for every route at once,
// including the ones written next year. Doing it in a service
// fixes it for the callers who remembered.

const signupSchema = z.object({
  email: z.email({ message: "Enter a valid email address" }).toLowerCase(),
  name: z.string().trim().min(1, { message: "Name is required" }).max(80),
  // trim BEFORE min, so "   " is rejected rather than stored.
  username: z.string().trim().toLowerCase().regex(/^[a-z0-9_]{3,20}$/),
  // normalize, then check. "Rajan_M " becomes "rajan_m" and
  // then has to pass the pattern.
});


// ── The distinction, stated once ────────────────────────────
//
//   validation      "is this acceptable?"
//   transformation  "how should I represent this?"
//
//   "30"      -> coercion       -> 30
//   " Rajan " -> transformation -> "Rajan"
//
// Both happen at the boundary. Neither belongs in a handler.`,
      },
      keyTakeaways: [
        "Coercion exists because HTTP has no types. `?page=10` is the string `\"10\"` and always will be.",
        "Verified trap: `Number(\"\")` is 0, so `?page=` coerces to a valid zero. Only `.positive()` caught it, with issue code `too_small`.",
        "So a coerced number always needs a constraint. `z.coerce.number()` alone is not validation.",
        "Verified: `z.coerce.boolean()` follows JavaScript truthiness, so the string `\"false\"` becomes `true`. Map query flags explicitly with an enum and a transform.",
        "Coerce where the transport forces strings: query, params, headers, env vars, form bodies. Do not coerce a JSON body, because JSON has types and `{ \"age\": \"30\" }` is a client bug.",
        "Validation asks whether the value is acceptable. Transformation asks how to represent it. They answer different questions.",
        "Order in a chain is the behaviour. `.trim().min(1)` rejects `\"   \"`; `.min(1).trim()` accepts it and stores an empty string.",
        "`z.email().toLowerCase()` at the boundary prevents duplicate accounts for every route at once. That is the boundary argument in one example.",
      ],
      commonMistakes: [
        "`z.coerce.number()` with no constraint on a query parameter. `?page=` becomes 0 and your offset arithmetic goes negative.",
        "Using `z.coerce.boolean()` for a query flag. `?deleted=false` sets it to `true`.",
        "Coercing JSON body fields. It hides the client's type bug from both teams until something downstream breaks.",
        "`z.string().min(1).trim()`. Three spaces pass the length check and then become an empty string.",
        "Normalizing email in a service instead of at the boundary. It works for the callers who remembered.",
        "Treating coercion as validation. Converting a value and checking a value are different steps, and only one of them can reject.",
      ],
      quiz: [
        {
          question: "`z.coerce.number().int().positive()` receives the empty string. What was verified?",
          options: [
            "It fails with `invalid_type`",
            "It fails with `too_small`, because `Number(\"\")` is 0 and only `.positive()` caught it",
            "It passes as 0",
            "It throws a TypeError",
          ],
          correctIndex: 1,
          explanation:
            "So `z.coerce.number()` alone would accept `?page=` as page 0, and your offset arithmetic goes negative.",
        },
        {
          question: "What does `z.coerce.boolean().parse(\"false\")` return?",
          options: ["`false`", "`true`", "It throws", "`undefined`"],
          correctIndex: 1,
          explanation:
            "Verified. Every non-empty string is truthy. Use `z.enum([\"true\",\"false\"]).transform(v => v === \"true\")` for a flag.",
        },
        {
          question: "Should you coerce a numeric field in a JSON body?",
          options: [
            "Yes, always",
            "No. JSON has real types, so `{ \"age\": \"30\" }` is a client bug and coercing hides it",
            "Only for integers",
            "Only in development",
          ],
          correctIndex: 1,
          explanation:
            "Coerce where the transport forces strings: query, params, headers, env vars, form bodies.",
        },
        {
          question: "What is the difference between `z.string().trim().min(1)` and `z.string().min(1).trim()`?",
          options: [
            "Nothing",
            "The first rejects `\"   \"`; the second accepts it and leaves you with an empty string",
            "The second is faster",
            "The first is invalid",
          ],
          correctIndex: 1,
          explanation:
            "Order in the chain is the behaviour. Trim before you check length.",
        },
        {
          question: "Why put `z.email().toLowerCase()` at the boundary rather than in a service?",
          options: [
            "It is faster there",
            "It applies to every route at once, including ones written later, instead of only the callers who remembered",
            "Services cannot transform",
            "It is required by Zod",
          ],
          correctIndex: 1,
          explanation:
            "Without it, one person gets two accounts and a login failure that makes no sense to support.",
        },
      ],
    },
    {
      id: "response-serialization",
      title: "Response serialization, and never leaking fields",
      durationMinutes: 12,
      explanation:
        "Now the other arrow. Most people validate `Request → API` and stop, but `API → Client` needs the same discipline.\n\nYour database user probably looks like this:\n\n```javascript\n{\n  id: 1,\n  name: \"Rajan\",\n  email: \"rajan@example.com\",\n  passwordHash: \"$2b$10$...\",\n  resetToken: \"a1b2c3\",\n  internalNotes: \"flagged for review\",\n  isAdmin: true\n}\n```\n\nAnd the route that ships all of it is two lines that look completely reasonable:\n\n```javascript\nconst user = await db.user.findById(id);\nreturn user;\n```\n\n---\n\n## Response serialization\n\n<b>Response serialization</b> (converting your application's response into the exact representation sent over HTTP).\n\n> The word to hold onto is <b>exact</b>. A response schema is an <b>allowlist</b>, so the question stops being \"did I remember to delete the password\" and becomes \"is this field in the contract\". That flips the default from leak-unless-you-remember to hide-unless-you-declared, and defaults are the only security control that survives a team.\n\nVerified in Day 15: a handler returning `{ id, name, passwordHash, internalNotes, isAdmin }` against a schema listing `id` and `name` sent exactly `{\"id\":1,\"name\":\"Rajan\"}`. Three fields never left the process.\n\n---\n\n## Why the manual version fails\n\nThe alternative is deleting fields on the way out:\n\n```javascript\nconst { passwordHash, resetToken, ...safe } = user;\nreturn safe;\n```\n\nThat is correct today. It is a denylist, and denylists fail on the next migration: someone adds a `twoFactorSecret` column, no route mentions it, and every endpoint returning a user starts shipping it. Nothing breaks, no test fails, and there is no diff to review because nobody edited those routes.\n\n> This is the whole argument for the schema in one sentence. <b>An allowlist fails closed and a denylist fails open.</b> A new column with an allowlist is invisible until you add it; a new column with a denylist is public immediately.\n\n---\n\n## Serialization is also why Fastify is fast\n\nFastify compiles a response schema into a purpose-built serializer:\n\n```text\nNo schema  →  JSON.stringify walks the object, discovering\n              keys and types at runtime\n\nSchema     →  a function that already knows every field and\n              type, and builds the string directly\n```\n\nSo the schema you added to stop leaking `passwordHash` is the same thing that makes the response faster. Safety and speed from one declaration, which is unusual enough to be worth noticing.\n\n---\n\n## The sharp edge\n\nVerified in Day 15: if a response schema marks a field `required` and your handler omits it, you get a <b>500</b> with `\"name\" is required!`.\n\n> Defensible, since returning a response that violates your own contract is a bug. But be deliberate: a nullable column now produces a server error rather than a partial object. If a field can genuinely be absent, say so with `.nullable()` or `.optional()` rather than discovering it in production.\n\n---\n\n## Status codes get their own schemas\n\n```javascript\nresponse: {\n  200: userResponseSchema,\n  404: errorSchema,\n}\n```\n\nA 404 body that has no schema is serialized generically, which means your carefully filtered success path sits next to an error path that ships whatever the error object happened to contain. Give error responses a schema too.",
      diagram: `The other arrow

    Request → API      everyone guards this
    API → Client       this needs the same rules


The two lines that leak everything

    const user = await db.user.findById(id);
    return user;

    reads fine. reviews fine.

    the row:
      id · name · email
      passwordHash · resetToken
      internalNotes · isAdmin


Response schema = ALLOWLIST

    the word is EXACT.

    the question stops being
      "did I remember to delete the password"
    and becomes
      "is this field in the contract"

    default flips:
      leak-unless-you-remember
          ↓
      hide-unless-you-declared

    defaults are the only security control that
    survives a team.

    verified (Day 15):
      handler returned id, name, passwordHash,
        internalNotes, isAdmin
      schema listed id, name
      client got {"id":1,"name":"Rajan"}

      three fields never left the process.


⚠ Why the manual version fails

    const { passwordHash, resetToken, ...safe } = user;
    return safe;

    correct TODAY. it is a DENYLIST.

    next migration adds twoFactorSecret
      no route mentions it
      every user endpoint ships it
      nothing breaks
      no test fails
      NO DIFF TO REVIEW, because nobody
        edited those routes

    ALLOWLIST fails CLOSED
    DENYLIST  fails OPEN

    new column + allowlist  →  invisible
    new column + denylist   →  public


Serialization is also the speed story

    no schema
      JSON.stringify walks the object,
      discovering keys and types at runtime

    schema
      a function that already knows every field
      and type, building the string directly

    the schema you added to stop leaking
    passwordHash is the same thing that makes
    the response faster.

    safety and speed from one declaration.


⚠ The sharp edge, verified

    response schema marks "name" required
    handler returns { id: 1 }
        →  500   "name" is required!

    defensible: you broke your own contract.
    but a nullable column is now a server error.

    if a field can be absent, SAY SO:
      .nullable()   .optional()


Error responses need schemas too

    response: {
      200: userResponseSchema,
      404: errorSchema,
    }

    a 404 with no schema serializes generically,
    so your filtered success path sits next to an
    error path shipping whatever the error object
    happened to hold.`,
      codeExample: {
        title: "Allowlist responses, and the denylist that fails open",
        code: `import { z } from "zod";

// ── The row your database actually returns ──────────────────
// users table:
//   id · name · email · password_hash · reset_token
//   internal_notes · is_admin · created_at · deleted_at


// ── ✗ The leak, in two reasonable-looking lines ─────────────
app.get("/users/:id", async (request) => {
  const user = await db.user.findById(request.params.id);
  return user;
});
// Response:
// {
//   "id": 1,
//   "name": "Rajan",
//   "email": "rajan@example.com",
//   "passwordHash": "$2b$10$...",
//   "resetToken": "a1b2c3",
//   "internalNotes": "flagged for review",
//   "isAdmin": true
// }
//
// That resetToken is an account takeover. The passwordHash is
// an offline cracking target. internalNotes is whatever
// someone typed assuming it was private.


// ── ✗ The denylist. Correct today. Fails open tomorrow. ─────
app.get("/users/:id", async (request) => {
  const user = await db.user.findById(request.params.id);
  const { passwordHash, resetToken, internalNotes, ...safe } = user;
  return safe;
});
//
// Now someone runs a migration:
//
//   ALTER TABLE users ADD COLUMN two_factor_secret TEXT;
//
// No route was edited. No test failed. No diff mentions any
// endpoint. And every route shaped like this now returns
// twoFactorSecret to whoever asks.
//
// A denylist fails OPEN. That is the whole problem.


// ── ✓ The allowlist. Fails closed. ──────────────────────────
const userResponseSchema = z.object({
  id: z.number(),
  name: z.string(),
  email: z.email(),
  createdAt: z.iso.datetime(),
});

app.get("/users/:id", {
  schema: {
    params: z.object({ id: z.coerce.number().int().positive() }),
    response: {
      200: userResponseSchema,
      404: z.object({ error: z.string() }),
    },
  },
}, async (request, reply) => {
  const user = await db.user.findById(request.params.id);
  if (!user) return reply.code(404).send({ error: "Not found" });

  return user;          // the whole row, and that is fine
});
//
// Verified in Day 15 with the equivalent JSON Schema: the
// handler returned passwordHash and internalNotes, and the
// client received only the listed fields.
//
// Add two_factor_secret to the table now. This route does not
// change. The field is invisible until somebody deliberately
// adds it to the schema, which is a diff a reviewer can see.


// ── Lists, and nesting ──────────────────────────────────────
app.get("/users", {
  schema: {
    response: { 200: z.array(userResponseSchema) },
  },
}, async () => db.user.findMany());
// Every element filtered, not just the outer object.

const postResponseSchema = z.object({
  id: z.number(),
  title: z.string(),
  author: userResponseSchema,      // nested, so also filtered
});
// Worth checking on nested objects specifically. This is
// where a leak usually hides: the top level was reviewed and
// the embedded author object was not.


// ── ⚠ The required trap, verified in Day 15 ─────────────────
const strictResponse = z.object({
  id: z.number(),
  name: z.string(),          // required
  bio: z.string(),           // required, and nullable in the DB
});
// A user with no bio  ->  500, '"bio" is required!'
//
// Say what is true instead:
const honestResponse = z.object({
  id: z.number(),
  name: z.string(),
  bio: z.string().nullable(),        // may be null
  avatarUrl: z.string().optional(),  // may be absent
});


// ── Deriving, so there is one source of truth ───────────────
const userModel = z.object({
  id: z.number(),
  name: z.string(),
  email: z.email(),
  passwordHash: z.string(),
  isAdmin: z.boolean(),
  createdAt: z.iso.datetime(),
});

// Public view: an explicit pick, not the model minus one field.
const publicUser = userModel.pick({
  id: true, name: true, email: true, createdAt: true,
});

// Admin view: more fields, still an allowlist.
const adminUser = userModel.omit({ passwordHash: true });

// What a client may create.
const createUser = userModel.pick({ name: true, email: true });

// What a PATCH may change.
const updateUser = createUser.partial();

type PublicUser = z.infer<typeof publicUser>;
//
// pick() over omit() for the public view is deliberate. With
// omit(), a new column is public until someone remembers to
// omit it. With pick(), a new column is private until someone
// adds it. Same reasoning as allowlist over denylist, one
// level up.


// ── Testing the boundary ────────────────────────────────────
test("GET /users/:id never returns passwordHash", async (t) => {
  const app = buildApp({ logger: false });
  t.after(() => app.close());

  const res = await app.inject({ url: "/users/1" });
  const body = res.json();

  assert.equal(body.passwordHash, undefined);
  assert.equal(body.resetToken, undefined);
  assert.deepEqual(
    Object.keys(body).sort(),
    ["createdAt", "email", "id", "name"],
  );
  //
  // That last assertion is the valuable one. It fails when a
  // field is ADDED, which is exactly when you want to be
  // asked whether it should be public.
});`,
      },
      keyTakeaways: [
        "A response schema is an allowlist, so the question becomes \"is this field in the contract\" rather than \"did I remember to delete the password\".",
        "Verified in Day 15: a handler returning `passwordHash` and `internalNotes` against a two-field schema sent only those two fields.",
        "An allowlist fails closed; a denylist fails open. A new column is invisible with the first and public immediately with the second.",
        "The denylist failure has no diff: nobody edited the routes, no test failed, and a migration made data public.",
        "The same schema makes serialization faster, because the compiled serializer already knows every field and type instead of reflecting like `JSON.stringify`.",
        "Verified: a `required` response field that the handler omits gives a 500. Use `.nullable()` or `.optional()` where absence is real.",
        "Give error statuses their own response schemas, or your filtered 200 sits beside a 404 that ships whatever the error contained.",
        "Prefer `.pick()` over `.omit()` for a public view, for the same reason: a new column stays private until somebody adds it.",
        "Assert the exact key set in a test. It fails when a field is added, which is when you want to be asked about it.",
      ],
      commonMistakes: [
        "Returning the database row directly. The two lines that do it look completely reasonable.",
        "Destructuring the sensitive fields away. Correct today, and the next migration makes it wrong with no diff to review.",
        "Filtering the top-level object and forgetting a nested one. That is where leaks usually hide.",
        "Using `.omit()` to build a public view. A new column is exposed until someone remembers it.",
        "Marking a response field `required` when the column is nullable, turning missing data into a 500.",
        "Leaving error responses without schemas, so the error path serializes whatever the error object held.",
        "Testing only that a response has the right fields. Assert the exact key set, so an added field fails the test.",
      ],
      quiz: [
        {
          question: "Why is a response schema better than destructuring sensitive fields away?",
          options: [
            "It is shorter",
            "An allowlist fails closed, so a new column is invisible until declared; a denylist fails open and exposes it immediately",
            "Destructuring is slow",
            "Schemas run at compile time",
          ],
          correctIndex: 1,
          explanation:
            "The denylist failure is worse than it sounds: no route was edited, no test failed, and there is no diff for a reviewer to catch.",
        },
        {
          question: "Your handler returns `passwordHash` and the response schema does not list it. What was verified?",
          options: [
            "A 500",
            "Only the listed fields are sent; `passwordHash` never leaves the process",
            "The field is sent as `null`",
            "A warning is logged",
          ],
          correctIndex: 1,
          explanation:
            "Which is what makes a response schema a security control rather than documentation.",
        },
        {
          question: "Why does a response schema make serialization faster?",
          options: [
            "It caches responses",
            "The compiled serializer already knows every field and type, so it builds the string directly instead of reflecting like `JSON.stringify`",
            "It skips fields",
            "It uses a native serializer",
          ],
          correctIndex: 1,
          explanation:
            "The declaration you added for safety pays for itself twice, which is unusual enough to notice.",
        },
        {
          question: "A response schema marks `bio` required and the column is nullable. What happens for a user with no bio?",
          options: [
            "The field is omitted",
            "A 500, because the response violates your own contract",
            "It is sent as an empty string",
            "A 404",
          ],
          correctIndex: 1,
          explanation:
            "Verified in Day 15. Say what is true with `.nullable()` rather than finding out in production.",
        },
        {
          question: "Why prefer `.pick()` over `.omit()` when deriving a public view?",
          options: [
            "It is shorter",
            "`pick` keeps a new column private until someone adds it; `omit` exposes it until someone remembers to exclude it",
            "`omit` is deprecated",
            "`pick` is type-safe and `omit` is not",
          ],
          correctIndex: 1,
          explanation:
            "The allowlist-versus-denylist argument, one level up in the schema definitions themselves.",
        },
      ],
    },
    {
      id: "openapi-and-docs",
      title: "OpenAPI and Swagger UI",
      durationMinutes: 10,
      explanation:
        "## OpenAPI\n\n<b>OpenAPI</b> (a standard specification for describing HTTP APIs).\n\n> The value is not that it is a document, it is that it is a <b>machine-readable</b> one. Because a tool can read it, one file gives you documentation, a mock server, generated clients in any language, and contract tests. Prose documentation gives you prose.\n\nAn OpenAPI document describes your endpoints along with their parameters, request bodies, responses, status codes, schemas and authentication:\n\n```text\nYour API\n   ↓\nOpenAPI specification\n   ↓\nTools\n   ├── Swagger UI\n   ├── Generated API clients\n   └── Documentation\n```\n\n---\n\n## Swagger UI\n\n<b>Swagger UI</b> (a browser-based interface that renders an OpenAPI specification as interactive API documentation).\n\n> The part that changes team behaviour is the word <b>interactive</b>. A frontend developer can send a real request and read a real response without writing a line of code or asking you anything. That removes most of the messages you currently answer by hand.\n\n---\n\n## Where the document comes from\n\nThis is the point of today. You already wrote the schemas:\n\n```text\n              Zod Schema\n                   │\n     ┌─────────┬───┴───┬─────────┐\n     ↓         ↓       ↓         ↓\n Validation  Types  Response  OpenAPI\n```\n\nWith `@fastify/swagger` plus `fastify-type-provider-zod`'s transform, the document is generated from the same route definitions that validate the requests. You do not write it, and it cannot be out of date, because there is nothing separate to update.\n\nThe alternative is maintaining the shape in three or four places:\n\n```text\nZod schema\nTypeScript interface\nOpenAPI YAML\nSwagger annotations in comments\n```\n\nAll four correct on the day they were written. One gets updated.\n\n---\n\n## What to actually add\n\nGenerated docs are only as good as the metadata on the route:\n\n```javascript\nschema: {\n  summary: \"Create a user\",\n  description: \"Creates a user and returns the public view.\",\n  tags: [\"users\"],\n  body: createUserSchema,\n  response: { 201: userResponseSchema, 400: errorSchema, 409: errorSchema },\n}\n```\n\n> The two that get skipped and matter most are <b>`tags`</b> and <b>the error responses</b>. Without tags, forty routes render as one flat list nobody scrolls. Without a 400 and a 409 in the response map, your documentation claims every request succeeds, and a client generated from it has no error type at all.\n\n---\n\n## One thing to be careful about\n\nSwagger UI is a live console pointed at your API.\n\n> On a public production service, think about whether an anonymous visitor should be able to enumerate every endpoint and fire requests at them from a browser. Internal or staging: fine. Public and unauthenticated: decide deliberately rather than by leaving the default on. The document itself is also a map of your API surface, which is useful to you and to anyone probing it.",
      diagram: `OpenAPI: the value is MACHINE-READABLE

    not "it is a document".
    a TOOL can read it.

    one file gives you:
      documentation
      a mock server
      generated clients, any language
      contract tests

    prose documentation gives you prose.


Swagger UI: the word is INTERACTIVE

    a frontend developer sends a real request
    and reads a real response

    without writing code
    without asking you

    that removes most of the messages you
    currently answer by hand.


Where the document comes from

              Zod Schema
                   │
      ┌────────┬───┴───┬────────┐
      ↓        ↓       ↓        ↓
  Validation Types Response  OpenAPI

    @fastify/swagger + the zod transform
    generate it from the SAME route definitions
    that validate requests.

    you do not write it.
    it cannot be out of date.
    there is nothing separate to update.


The alternative you are avoiding

    Zod schema
    TypeScript interface
    OpenAPI YAML
    Swagger annotations in comments

    all four correct the day they were written.
    one gets updated.


What to actually put on a route

    summary      one line
    description  the details
    tags         ["users"]
    body         createUserSchema
    response     201 · 400 · 409

    the two that get skipped and matter most:

    TAGS
      without them, forty routes render as one
      flat list nobody scrolls

    ERROR RESPONSES
      without a 400 and a 409, your docs claim
      every request succeeds, and a generated
      client has no error type at all


⚠ Swagger UI is a live console on your API

    internal or staging        fine
    public + unauthenticated   decide, do not
                               default

    an anonymous visitor can enumerate every
    endpoint and fire requests from a browser.

    the document is also a map of your API
    surface: useful to you, useful to anyone
    probing it.`,
      codeExample: {
        title: "Generating docs from the schemas you already wrote",
        code: `import Fastify from "fastify";
import { z } from "zod";
import swagger from "@fastify/swagger";
import swaggerUi from "@fastify/swagger-ui";
import {
  serializerCompiler,
  validatorCompiler,
  jsonSchemaTransform,
} from "fastify-type-provider-zod";

const app = Fastify({ logger: true });

app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);


// ── Register the generator ──────────────────────────────────
await app.register(swagger, {
  openapi: {
    info: {
      title: "Users API",
      description: "Example API for the Node.js track.",
      version: "1.0.0",
    },
    servers: [{ url: "http://localhost:3000" }],
    components: {
      securitySchemes: {
        apiKey: { type: "apiKey", name: "x-api-key", in: "header" },
      },
    },
  },
  transform: jsonSchemaTransform,
  //         ^^^^^^^^^^^^^^^^^^ this is the whole trick. It
  //         converts each route's Zod schemas into the JSON
  //         Schema that OpenAPI expects. Without it, the
  //         document has no request or response shapes.
});

// Only in environments where a live console is appropriate.
if (process.env.NODE_ENV !== "production") {
  await app.register(swaggerUi, { routePrefix: "/docs" });
}


// ── The schemas. Same ones. Nothing new. ────────────────────
const userResponseSchema = z.object({
  id: z.number().describe("Numeric user id"),
  name: z.string().describe("Display name"),
  email: z.email().describe("Primary email, always lower-cased"),
}).describe("The public view of a user");

const createUserSchema = z.object({
  name: z.string().min(1).max(80).describe("Display name"),
  email: z.email().describe("Must be unique"),
  age: z.number().int().positive().describe("Years"),
});

const errorSchema = z.object({
  error: z.string(),
  message: z.string().optional(),
});
//
// .describe() is what turns a generated document from a type
// dump into something someone can read. It costs one call.


// ── A fully documented route ────────────────────────────────
app.post("/users", {
  schema: {
    summary: "Create a user",
    description:
      "Creates a user and returns the public view. Email is " +
      "lower-cased before storage, so addresses differing only " +
      "in case collide.",
    tags: ["users"],
    security: [{ apiKey: [] }],
    body: createUserSchema,
    response: {
      201: userResponseSchema,
      400: errorSchema.describe("Validation failed"),
      409: errorSchema.describe("Email already registered"),
    },
  },
}, async (request, reply) => {
  const { name, email, age } = request.body;
  const created = await createUser({ name, email, age });
  return reply.code(201).send(created);
});
//
// Everything in that block does at least two jobs:
//
//   body            validates AND documents the request
//   response 201    filters AND documents the success shape
//   response 400    documents the failure your validator
//                   already produces
//   tags            groups the route in the UI
//   security        tells the UI to send x-api-key
//
// One declaration. Four outputs.


// ── The two things people skip ──────────────────────────────
//
// 1. tags
//    Without them, every route lands in a "default" group.
//    Forty routes in one flat list is a document nobody uses.
//
// 2. error responses
//    A response map with only 200 in it says, in a
//    machine-readable way, that this endpoint always
//    succeeds. A generated TypeScript client then has no
//    error type, so the frontend has nothing to narrow on.


// ── Getting the document itself ─────────────────────────────
// GET /docs/json                    the OpenAPI document
// GET /docs                         Swagger UI
//
// Or write it out at build time, for CI:
//
//   const spec = app.swagger();
//   await writeFile("openapi.json", JSON.stringify(spec, null, 2));
//
// Committing that file makes API changes visible in code
// review. A pull request that removes a response field shows
// up as a diff in openapi.json, which is a much better
// review signal than hoping someone reads the route.


// ── Two things the generated document is worth ──────────────
//
// A generated client:
//   npx openapi-typescript openapi.json -o api-types.ts
//   The frontend now has your exact types, from your
//   validation rules, without you writing them twice.
//
// A contract test:
//   Assert the committed openapi.json has not changed
//   unexpectedly. Any accidental change to a public response
//   shape fails CI instead of reaching a client.


// ── ⚠ The production question ───────────────────────────────
// Swagger UI is a live console pointed at your API. An
// anonymous visitor can list every endpoint and send
// requests from a browser.
//
// Internal service or staging: fine, and useful.
// Public and unauthenticated: decide deliberately. The
// document is a map of your API surface, which is exactly as
// useful to someone probing it as it is to your frontend
// team.`,
      },
      keyTakeaways: [
        "OpenAPI's value is that it is machine-readable, which is what gives you generated clients, mock servers and contract tests rather than just prose.",
        "The document is generated from the same route schemas that validate requests, using `@fastify/swagger` and `jsonSchemaTransform`. There is nothing separate to keep in sync.",
        "The alternative is the same shape in a Zod schema, a TypeScript interface, an OpenAPI file and Swagger comments. All four are correct until one is updated.",
        "`jsonSchemaTransform` is what converts Zod schemas into the JSON Schema OpenAPI expects. Without it the document has no request or response shapes.",
        "`.describe()` turns a generated document from a type dump into something a person can read.",
        "The two skipped things that matter most are `tags` and error responses. Without tags the UI is one flat list; without a 400 in the response map, a generated client has no error type.",
        "Committing the generated `openapi.json` makes a removed response field show up as a diff in code review.",
        "Swagger UI is a live console on your API. Internal and staging, fine. Public and unauthenticated, decide deliberately rather than leaving the default.",
      ],
      commonMistakes: [
        "Writing an OpenAPI file by hand alongside your schemas. It will disagree with the code, and the code is the one clients actually hit.",
        "Registering `@fastify/swagger` without `jsonSchemaTransform` when using Zod, then wondering why every endpoint documents no body.",
        "Leaving every route untagged. The UI renders one flat list and nobody uses it.",
        "Documenting only the 200. Your document then claims the endpoint cannot fail, and a generated client has no error type.",
        "Exposing Swagger UI on a public production service without thinking about it.",
        "Skipping `.describe()`. A document full of `string` and `number` with no prose is a type dump, not documentation.",
      ],
      quiz: [
        {
          question: "What makes OpenAPI more useful than written documentation?",
          options: [
            "It is shorter",
            "It is machine-readable, so one file yields generated clients, mock servers and contract tests",
            "It is versioned",
            "It renders in a browser",
          ],
          correctIndex: 1,
          explanation:
            "Prose documentation gives you prose. A machine-readable document gives you tools.",
        },
        {
          question: "What does `jsonSchemaTransform` do?",
          options: [
            "Validates requests",
            "Converts each route's Zod schemas into the JSON Schema that OpenAPI expects, so the document has request and response shapes",
            "Generates TypeScript types",
            "Serializes responses",
          ],
          correctIndex: 1,
          explanation:
            "Register `@fastify/swagger` without it and every endpoint documents no body.",
        },
        {
          question: "Why do error responses belong in the response map?",
          options: [
            "Fastify requires them",
            "Otherwise the document claims the endpoint always succeeds, and a generated client has no error type to narrow on",
            "They make validation stricter",
            "For the status code to work",
          ],
          correctIndex: 1,
          explanation:
            "Along with `tags`, this is the most commonly skipped metadata and the most costly to skip.",
        },
        {
          question: "Why commit the generated `openapi.json`?",
          options: [
            "For deployment",
            "So a change to a public response shape appears as a diff in code review instead of reaching clients unnoticed",
            "To speed up the server",
            "Swagger UI requires it",
          ],
          correctIndex: 1,
          explanation:
            "It also lets you fail CI on an unintended contract change, which is a real contract test for very little work.",
        },
        {
          question: "What is the caution about Swagger UI in production?",
          options: [
            "It is slow",
            "It is a live console on your API, so an anonymous visitor can enumerate endpoints and send requests",
            "It leaks memory",
            "It requires authentication to render",
          ],
          correctIndex: 1,
          explanation:
            "Internal or staging is fine. Public and unauthenticated is a decision to make deliberately.",
        },
      ],
    },
    {
      id: "single-source-of-truth",
      title: "Single source of truth",
      durationMinutes: 10,
      explanation:
        "Everything today reduces to one picture:\n\n```text\n                 UNTRUSTED INPUT\n                       │\n                       ↓\n                    SCHEMA\n                       │\n                ┌──────┼──────┐\n                ↓      ↓      ↓\n             Validate Type   Docs\n                │\n                ↓\n           Business Logic\n                │\n                ↓\n             DB result\n                │\n                ↓\n         Response Schema\n                │\n                ↓\n          Serialization\n                │\n                ↓\n              Client\n```\n\n---\n\n## The failure you are preventing\n\nThe bad version keeps three definitions:\n\n```typescript\nconst userSchema = z.object({ email: z.email() });   // required\n\ninterface User { email?: string }                    // optional\n\n// openapi.yaml: email required\n```\n\n> Nothing here is a mistake, and that is the point. Each definition was correct when it was written. There is no compiler error, no failing test and no code review that catches it, because <b>nothing connects them</b>. Drift is not caused by carelessness, it is caused by having more than one place to be careful about.\n\nAnd the consequence is worse than an out-of-date document. Once TypeScript believes `email` is optional, every `if (user.email)` written after that point is dead code protecting nothing, and the reviewer who wrote it was right to trust the type.\n\n---\n\n## Single source of truth\n\n<b>Single source of truth</b> (deriving every representation of a concept from one definition, so they cannot disagree).\n\n> The word that does the work is <b>derived</b>. Copying a shape into three files and keeping them in sync by discipline is not a single source of truth, it is three sources and a promise. The test is mechanical: if you can change one and not the others, and nothing complains, you have not got one.\n\n---\n\n## What this looks like in practice\n\n```typescript\nconst userModel = z.object({ /* everything */ });\n\nconst publicUser  = userModel.pick({ id: true, name: true, email: true });\nconst createUser  = userModel.pick({ name: true, email: true });\nconst updateUser  = createUser.partial();\n\ntype PublicUser = z.infer<typeof publicUser>;\n```\n\nFour shapes, one definition, and each derivation states its intent. Change the model and every derived shape follows, or fails to compile in a place that tells you why.\n\n---\n\n## Where the line actually is\n\nOne honest caveat, because \"one schema\" is easy to take too far.\n\n> A single source of truth per <b>concept and direction</b>, not one object for the entire application. A create body, an update body, a public response and an admin response are four genuinely different contracts. Forcing them into one schema with optional fields everywhere produces a type that permits nonsense and validates nothing. Derive them from a shared model instead: the model is the source of truth, and each contract is an explicit, reviewable narrowing of it.\n\nDay 17 continues the same thread one layer down, where the database schema becomes the source your types are derived from rather than another place to write them.",
      diagram: `The whole day, one picture

              UNTRUSTED INPUT
                    │
                    ↓
                 SCHEMA
                    │
             ┌──────┼──────┐
             ↓      ↓      ↓
          Validate Type   Docs
             │
             ↓
        Business Logic
             │
             ↓
          DB result
             │
             ↓
      Response Schema
             │
             ↓
       Serialization
             │
             ↓
           Client


The failure, and why nobody catches it

    schema     email required
    interface  email optional
    openapi    email required

    nothing here is a MISTAKE.
    each was correct when written.

    no compiler error.
    no failing test.
    no review that catches it.

    because NOTHING CONNECTS THEM.

    drift is not carelessness.
    it is having more than one place to be
    careful about.


And the consequence is worse than stale docs

    once TypeScript believes email is optional,
    every  if (user.email)  written after that
    is dead code protecting nothing

    and the person who wrote it was RIGHT to
    trust the type.


The mechanical test

    single source of truth = DERIVED

    copying a shape into three files and syncing
    by discipline is not one source of truth.
    it is three sources and a promise.

    the test:
      can you change one and not the others,
      with nothing complaining?
      then you have not got one.


In practice

    const userModel = z.object({ everything });

    publicUser = userModel.pick({ id, name, email })
    createUser = userModel.pick({ name, email })
    updateUser = createUser.partial()

    type PublicUser = z.infer<typeof publicUser>

    four shapes · one definition
    each derivation states its intent

    change the model and every shape follows,
    or fails to compile somewhere that says why.


⚠ Where the line is

    one source of truth per CONCEPT and
    DIRECTION. not one object for the app.

    create body · update body
    public response · admin response
      = four genuinely different contracts

    forcing them into one schema full of
    optionals gives you a type that permits
    nonsense and validates nothing.

    DERIVE from a shared model:
      the model is the source
      each contract is an explicit,
      reviewable narrowing


    Day 17 continues this one layer down, where
    the DATABASE schema becomes the source your
    types are derived from.`,
      codeExample: {
        title: "One model, four contracts, no drift",
        code: `// ── ✗ Three definitions, three chances to drift ─────────────

// validation/user.ts
export const userSchema = z.object({
  name: z.string(),
  email: z.email(),          // required
  age: z.number(),
});

// types/user.ts
export interface User {
  name: string;
  email?: string;            // ← someone made this optional
  age: number;               //   for a test, six months ago
}

// docs/openapi.yaml
//   User:
//     required: [name, email, age]

// Three files. Three answers. No error anywhere.
//
// And now:
//
//   function sendWelcome(user: User) {
//     if (user.email) {           // ← dead code. email is
//       mail(user.email);         //   always present at
//     }                           //   runtime, because the
//   }                             //   validator requires it.
//
// The person who wrote that guard was right to trust the
// type. The type was wrong.


// ── ✓ One model. Everything derived. ────────────────────────

// modules/users/schema.ts
import { z } from "zod";

// The source of truth: the full internal shape.
const userModel = z.object({
  id: z.number().int().positive(),
  name: z.string().min(1).max(80),
  email: z.email(),
  age: z.number().int().positive(),
  passwordHash: z.string(),
  isAdmin: z.boolean(),
  createdAt: z.iso.datetime(),
  deletedAt: z.iso.datetime().nullable(),
});

// ── Each contract is an explicit narrowing ──────────────────

// What a client may CREATE.
export const createUserSchema = userModel.pick({
  name: true,
  email: true,
  age: true,
});

// What a client may CHANGE. Derived from create, not from the
// model, so a field you never let them set cannot be patched.
export const updateUserSchema = createUserSchema.partial();

// What the public may SEE. pick(), not omit(), so a new column
// is private until somebody adds it here.
export const publicUserSchema = userModel.pick({
  id: true,
  name: true,
  email: true,
  createdAt: true,
});

// What an admin may see. Still an allowlist.
export const adminUserSchema = userModel.omit({
  passwordHash: true,
});

// And the types, from the same objects.
export type User = z.infer<typeof userModel>;
export type CreateUser = z.infer<typeof createUserSchema>;
export type UpdateUser = z.infer<typeof updateUserSchema>;
export type PublicUser = z.infer<typeof publicUserSchema>;

// There is no interface to edit, so there is nothing to drift.
// Rename email in userModel and every derivation fails to
// compile, each in a place that tells you exactly what it was
// for.


// ── The routes, using them ──────────────────────────────────
export default async function userRoutes(app) {
  app.post("/", {
    schema: {
      summary: "Create a user",
      tags: ["users"],
      body: createUserSchema,
      response: {
        201: publicUserSchema,
        400: errorSchema,
        409: errorSchema,
      },
    },
  }, async (request, reply) => {
    const created = await app.users.create(request.body);
    return reply.code(201).send(created);
  });

  app.patch("/:id", {
    schema: {
      tags: ["users"],
      params: z.object({ id: z.coerce.number().int().positive() }),
      body: updateUserSchema,
      response: { 200: publicUserSchema, 404: errorSchema },
    },
  }, async (request, reply) => {
    const updated = await app.users.update(request.params.id, request.body);
    if (!updated) return reply.code(404).send({ error: "Not found" });
    return updated;
  });

  app.get("/:id", {
    schema: {
      tags: ["users"],
      params: z.object({ id: z.coerce.number().int().positive() }),
      response: { 200: publicUserSchema, 404: errorSchema },
    },
  }, async (request, reply) => {
    const user = await app.users.findById(request.params.id);
    if (!user) return reply.code(404).send({ error: "Not found" });
    return user;      // the full row. The schema decides what leaves.
  });
}
//
// Count what each schema object is doing here:
//
//   createUserSchema   validates the body
//                      types request.body
//                      documents the request
//
//   publicUserSchema   filters the response
//                      types the return value
//                      documents the response
//
// Two objects. Six jobs. Nothing to keep in sync.


// ── The mechanical test for a source of truth ───────────────
//
// Ask: can I change one representation and have nothing
// complain?
//
//   Three hand-written files   ->  yes. Not a source of truth.
//   pick() from one model      ->  no, it fails to compile.
//                                  That is one.
//
// If keeping things aligned depends on somebody remembering,
// it is not a single source of truth. It is a promise.


// ── ⚠ And where to stop ─────────────────────────────────────
//
// ✗ One schema for everything:
//   const userSchema = z.object({
//     id: z.number().optional(),          // absent on create
//     passwordHash: z.string().optional(),// absent on response
//     name: z.string().optional(),        // absent on patch
//   });
//
//   Every field optional. It permits {} and validates
//   nothing. You have written a type that means "an object".
//
// ✓ One model, four narrowings, each with a name that says
//   what it is for. That is a source of truth per concept AND
//   direction, which is the useful version of the idea.`,
      },
      keyTakeaways: [
        "Drift is not carelessness. Three hand-written definitions each correct when written, with nothing connecting them, and no compiler error to catch the divergence.",
        "A type that lies is worse than no type: every guard written after the drift is dead code, and the person who wrote it was right to trust it.",
        "The word that matters is derived. Copying a shape into three files and syncing by discipline is three sources and a promise.",
        "The mechanical test: if you can change one representation and nothing complains, you do not have a single source of truth.",
        "One model, then `.pick()`, `.omit()` and `.partial()` for each contract. Rename a field and every derivation fails to compile where it tells you why.",
        "Derive the update body from the create body, not from the model, so a field clients may never set cannot be patched.",
        "One source of truth per concept and direction. Create, update, public and admin are four genuinely different contracts.",
        "Forcing them into one schema of optional fields gives you a type that permits `{}` and validates nothing.",
      ],
      commonMistakes: [
        "Writing a Zod schema and a matching interface. Nothing links them, so eventually one is wrong and nothing says so.",
        "Maintaining an OpenAPI file by hand next to the schemas that actually run.",
        "Believing discipline is a substitute for derivation. It works until the week someone is in a hurry.",
        "Making one schema serve every direction with optional fields everywhere. It validates nothing.",
        "Deriving the update body from the model rather than from the create body, which lets a client patch a field they were never allowed to set.",
        "Using `.omit()` for a public view, so the next column is exposed until someone remembers to exclude it.",
      ],
      quiz: [
        {
          question: "Why is drift between a schema, an interface and a docs file so hard to catch?",
          options: [
            "Developers are careless",
            "Each definition was correct when written and nothing connects them, so there is no compiler error, failing test or reviewable diff",
            "TypeScript ignores schemas",
            "Docs are never read",
          ],
          correctIndex: 1,
          explanation:
            "Drift is caused by having more than one place to be careful about, not by a lack of care.",
        },
        {
          question: "What is the mechanical test for a single source of truth?",
          options: [
            "It lives in one file",
            "Whether you can change one representation and have nothing complain. If you can, you do not have one.",
            "Whether it is typed",
            "Whether it is validated at runtime",
          ],
          correctIndex: 1,
          explanation:
            "If alignment depends on somebody remembering, it is a promise rather than a source of truth.",
        },
        {
          question: "Why derive the update schema from the create schema rather than from the model?",
          options: [
            "It is shorter",
            "So a field a client may never set cannot be patched either",
            "The model has no types",
            "`partial()` only works on picks",
          ],
          correctIndex: 1,
          explanation:
            "Deriving from the model would make `isAdmin` and `passwordHash` patchable the moment someone reaches for `.partial()`.",
        },
        {
          question: "What goes wrong if one schema serves create, update and response?",
          options: [
            "Nothing, it is DRY",
            "Every field becomes optional, so the type permits `{}` and validates nothing",
            "It is slower",
            "OpenAPI rejects it",
          ],
          correctIndex: 1,
          explanation:
            "One source of truth per concept and direction. Four contracts derived from one model, each named for its purpose.",
        },
        {
          question: "What does a lying type cost you beyond an inaccurate signature?",
          options: [
            "Nothing measurable",
            "Every guard written afterwards is dead code, and the person who wrote it was right to trust the type",
            "Slower compilation",
            "Larger bundles",
          ],
          correctIndex: 1,
          explanation:
            "Which is why a type that lies is worse than no type at all: it stops people checking.",
        },
      ],
    },
  ],
  finalQuiz: [
    {
      question: "A Fastify route has a body schema listing `name` and `email`. A client also sends `isAdmin: true`, on default settings. What reaches your handler?",
      options: [
        "`name` and `email` only",
        "All three fields, because JSON Schema allows unlisted properties by default",
        "A 400",
        "A 422",
      ],
      correctIndex: 1,
      explanation:
        "Verified. A schema validates; it does not filter. Which is why `db.insert(request.body)` is mass assignment even on a validated route.",
    },
    {
      question: "Same payload, against a Zod object schema. What is in `result.data`?",
      options: [
        "All three fields",
        "Two fields; Zod strips unknown keys by default",
        "A validation error",
        "An empty object",
      ],
      correctIndex: 1,
      explanation:
        "Verified, and the exact opposite of Fastify's JSON Schema default on the same input. Neither says anything about it.",
    },
    {
      question: "How do you make an unknown key a validation failure in Zod?",
      options: [
        "It already is",
        "`.strict()`, which produces issue code `unrecognized_keys`",
        "`.required()`",
        "`.passthrough()`",
      ],
      correctIndex: 1,
      explanation:
        "Verified. That gives you four behaviours for one payload across the two libraries.",
    },
    {
      question: "`z.coerce.number().int().positive()` receives the empty string. What happens and why?",
      options: [
        "Fails with `invalid_type`",
        "Fails with `too_small`, because `Number(\"\")` is 0 and only `.positive()` rejected it",
        "Passes as 0",
        "Throws a TypeError",
      ],
      correctIndex: 1,
      explanation:
        "Verified. Without the constraint, `?page=` becomes page 0 and offset arithmetic goes negative. Always constrain a coerced number.",
    },
    {
      question: "What is wrong with `limit: z.coerce.number().int().positive()` on a list endpoint?",
      options: [
        "Nothing",
        "No upper bound, so `?limit=1000000` is a valid request for a million rows",
        "`coerce` is redundant",
        "It rejects 1",
      ],
      correctIndex: 1,
      explanation:
        "Add `.max(100)`. Day 17 shows what an unbounded query does to a connection pool.",
    },
    {
      question: "What is the difference between `z.string().trim().min(1)` and `z.string().min(1).trim()`?",
      options: [
        "Nothing",
        "The first rejects `\"   \"`; the second accepts it and stores an empty string",
        "The second is faster",
        "The first is invalid syntax",
      ],
      correctIndex: 1,
      explanation:
        "Order in a chain is the behaviour. Normalize before you check.",
    },
    {
      question: "Why is a response schema better than destructuring sensitive fields away?",
      options: [
        "Less code",
        "An allowlist fails closed, so a new column stays invisible; a denylist fails open and exposes it with no diff to review",
        "Destructuring is slow",
        "Schemas run at compile time",
      ],
      correctIndex: 1,
      explanation:
        "The denylist failure has no failing test and no edited route. A migration made data public.",
    },
    {
      question: "Verified: a handler returns `passwordHash` and the response schema does not list it. What is sent?",
      options: [
        "The whole object",
        "Only the listed fields; `passwordHash` never leaves the process",
        "A 500",
        "The field as `null`",
      ],
      correctIndex: 1,
      explanation:
        "Confirmed end to end with the Zod type provider as well. Both arrows of the boundary from one pair of schemas.",
    },
    {
      question: "Why does adding a response schema make serialization faster?",
      options: [
        "It caches",
        "The compiled serializer already knows every field and type, instead of reflecting like `JSON.stringify`",
        "It sends fewer bytes only",
        "It uses a native serializer",
      ],
      correctIndex: 1,
      explanation:
        "The declaration you added for safety pays for itself twice.",
    },
    {
      question: "What does `z.infer` prevent?",
      options: [
        "Runtime errors",
        "A hand-written type drifting from the validation rule, which makes every later `if (user.email)` guard dead code",
        "SQL injection",
        "Unknown keys",
      ],
      correctIndex: 1,
      explanation:
        "A lying type is worse than no type, because it stops people checking. There is no interface to edit if the type is derived.",
    },
    {
      question: "Why register `setSerializerCompiler` and not just `setValidatorCompiler`?",
      options: [
        "For performance",
        "Without it, Zod response schemas do nothing and `passwordHash` ships",
        "It is required for types",
        "It enables OpenAPI",
      ],
      correctIndex: 1,
      explanation:
        "The validator compiler guards the inbound arrow only. The serializer compiler is the outbound one.",
    },
    {
      question: "Should one schema serve create, update, public response and admin response?",
      options: [
        "Yes, that is single source of truth",
        "No. Derive four narrowings from one model, or every field becomes optional and the type validates nothing",
        "Yes, with optional fields",
        "Only if they share a name",
      ],
      correctIndex: 1,
      explanation:
        "One source of truth per concept and direction. `pick`, `omit` and `partial` make each contract explicit and reviewable.",
    },
  ],
  project: {
    name: "day-16",
    goal: "Define one model schema, derive the create, update, public and admin contracts from it, and use them for validation, TypeScript types, response filtering and OpenAPI on a real Fastify route.",
    brief:
      "The exercise is not really about Zod syntax. It is about seeing three specific things happen with your own eyes, because each is silent and each is a real bug you will meet. First, that a schema-validated route hands you a field the schema never mentioned, so you understand why db.insert(request.body) is dangerous. Second, that the same payload behaves in four different ways across JSON Schema and Zod, so you stop assuming validators agree. Third, that a response schema stops passwordHash leaving even when your handler explicitly returns it. Then wire OpenAPI to the same schemas and confirm the document changes when you change a route, because that is the payoff for all of it.",
    steps: [
      "Create `day-16/` with `\"type\": \"module\"`, then `npm install fastify fastify-plugin zod fastify-type-provider-zod @fastify/swagger @fastify/swagger-ui`.",
      "Start from Day 15's `app.js` and `server.js` split, and register `setValidatorCompiler` and `setSerializerCompiler` from the Zod type provider.",
      "Before using Zod, add a plain JSON Schema body route listing `name` and `email`. POST it with an extra `isAdmin: true` and record what `request.body` contains.",
      "Add `additionalProperties: false` to that same route and POST again. Record the status code and the body, and note that it stripped rather than rejected.",
      "Now do the same two experiments with a Zod schema and with `.strict()`. Write the four results in a comment block so you have the table in your own words.",
      "Define `userModel` in `modules/users/schema.ts` with `id`, `name`, `email`, `age`, `passwordHash`, `isAdmin`, `createdAt` and a nullable `deletedAt`.",
      "Derive `createUserSchema` with `.pick()`, `updateUserSchema` as `createUserSchema.partial()`, `publicUserSchema` with `.pick()`, and `adminUserSchema` with `.omit({ passwordHash: true })`.",
      "Export the four types with `z.infer` and confirm no hand-written interface exists anywhere in the project.",
      "Build `POST /users`, `PATCH /users/:id` and `GET /users/:id` using those schemas, with `response` maps covering 200 or 201, 400 and 404.",
      "Make the `GET` handler return the whole row including `passwordHash`, then confirm the client does not receive it.",
      "Add a list route with `page` and `limit` query params. Coerce both, and give `limit` a `.max(100)`. Request `?limit=1000000` and confirm the 400.",
      "Request `?page=` with an empty value and confirm the failure. Then remove `.positive()` and confirm it becomes page 0.",
      "Add `z.email().toLowerCase()` and `z.string().trim().min(1)` to the create schema. Submit `\"  Rajan  \"` and `\"Rajan@Example.COM\"` and confirm what gets stored.",
      "Swap the chain to `.min(1).trim()`, submit three spaces, and confirm it now passes with an empty name.",
      "Write an error handler that maps every validation issue into an `issues` array with `field` and `message`. Submit a body with two bad fields and confirm both come back.",
      "Register `@fastify/swagger` with `jsonSchemaTransform` and `@fastify/swagger-ui` at `/docs`, guarded so it does not register in production.",
      "Add `summary`, `tags` and `.describe()` calls, then open `/docs` and confirm the request and response shapes are there.",
      "Write `openapi.json` out with `app.swagger()`, commit it, then remove a field from `publicUserSchema` and regenerate to see the diff.",
      "Write tests with `app.inject()`: one asserting the 400 lists both bad fields, one asserting the exact key set of a `GET /users/:id` response, and one asserting `?limit=101` is rejected.",
    ],
    acceptance: [
      "You have a comment block in your own words recording all four verified behaviours for the same extra-field payload.",
      "You can explain why `db.insert(users).values(request.body)` is dangerous on a schema-validated route, referring to what you saw.",
      "Exactly one `userModel` exists, and the other four contracts are derived with `pick`, `omit` or `partial`.",
      "No hand-written `interface` or `type` describing a user shape exists. `grep -rn \"interface User\" src/` finds nothing.",
      "`updateUserSchema` is derived from `createUserSchema`, so `PATCH { \"isAdmin\": true }` cannot set it.",
      "A `GET /users/:id` handler returns `passwordHash` and the client receives only the four public fields, with a test asserting the exact key set.",
      "`?limit=1000000` returns 400 and you can say what would happen without the `.max()`.",
      "You saw `?page=` fail with `too_small` and, with `.positive()` removed, become page 0.",
      "You saw `.trim().min(1)` reject three spaces and `.min(1).trim()` accept them, and can state which order you want and why.",
      "A body with two invalid fields returns both issues in one response, each with a field path.",
      "`/docs` renders grouped by tag, with request and response shapes present, and does not register when `NODE_ENV=production`.",
      "`openapi.json` is committed, and removing a response field produces a visible diff in it.",
      "`npx tsc --noEmit` passes and `node --test` passes with no socket opened.",
    ],
    stretch: [
      "Add a `.refine()` rule that needs two fields, such as `passwordConfirmation` matching `password`, and check where the issue path points.",
      "Add a `.superRefine()` async check for email uniqueness and then explain why database checks usually belong in the service rather than the schema.",
      "Validate `process.env` with a Zod schema using `parse()` at startup, delete a required variable, and compare that failure with a server that boots and fails on first request.",
      "Validate a `fetch()` response from a public API with a schema, then change one field name in the schema to see what a provider-side change would look like as a logged error.",
      "Generate a TypeScript client with `npx openapi-typescript openapi.json` and use its types in a small script that calls your API.",
      "Add a CI check that regenerates `openapi.json` and fails if it differs from the committed copy.",
      "Write the same three routes with plain JSON Schema instead of Zod, then compare: count the lines, and say what you lost.",
      "Set `additionalProperties: false` and Zod `.strict()` on a money endpoint, send the amount under a misspelled key, and compare the two error messages a client would have to debug.",
    ],
  },
};
