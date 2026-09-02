import type { LessonDay } from "@/lib/learn/lesson-types";

export const NODEJS_DAY_4_LESSONS: LessonDay = {
  day: 4,
  title: "Errors, process and lifecycle",
  totalMinutes: 94,
  difficulty: "Intermediate",
  lessons: [
    {
      id: "error-object",
      title: "The Error object — message, stack and cause",
      durationMinutes: 10,
      explanation:
        "A production application is not just about making the <b>happy path</b> work. You also need to know what happens when something fails, how errors move through your application, when Node should continue and when it should crash, and how to shut down without losing work.\n\nToday takes you from basic `try/catch` to production-level process and error handling.\n\n---\n\n## The `Error` object\n\n<b>`Error`</b> (a built-in JavaScript object representing something that went wrong).\n\n```javascript\nconst error = new Error(\"Database connection failed\");\n\nconsole.log(error.message);\n```\n\n```text\nDatabase connection failed\n```\n\nThe three properties that matter:\n\n```text\nerror.message\nerror.stack\nerror.cause\n```\n\n---\n\n## `.message`\n\n<b>`.message`</b> (the human-readable description).\n\n```javascript\nconst error = new Error(\"User not found\");\n\nconsole.log(error.message);\n```\n\n```text\nUser not found\n```\n\nOne habit worth forming now: write the message for the person debugging at 3am, not for the user. Include the identifier that would let them reproduce it. `\"User 4821 not found\"` is worth far more than `\"Not found\"`.\n\n---\n\n## `.stack`\n\n<b>`.stack`</b> (where the error was created, and the chain of calls that led there).\n\n```javascript\nfunction getUser() {\n  throw new Error(\"User not found\");\n}\n\nfunction getProfile() {\n  getUser();\n}\n\ngetProfile();\n```\n\n```text\nError: User not found\n    at getUser (...)\n    at getProfile (...)\n    at ...\n```\n\nThink of `.stack` as:\n\n```text\nWhat happened?\n     +\nWhere did it happen?\n     +\nHow did we get there?\n```\n\nIn production debugging, stack traces are the most valuable thing you have. Which is exactly why the next point matters: the stack is captured at the moment `new Error()` runs, not when it is thrown. Create the error where the problem is.\n\nAnd it is why `throw \"something went wrong\"` is a mistake. A thrown string has no stack, no message property and no type. Always throw an `Error`.\n\n---\n\n## `.cause`\n\nSometimes an error happens because of another error:\n\n```text\nAPI request failed\n       ↓\nDatabase request failed\n       ↓\nConnection timeout\n```\n\n<b>`.cause`</b> (the original error behind this one).\n\n```javascript\ntry {\n  await database.query();\n} catch (error) {\n  throw new Error(\"Failed to load users\", {\n    cause: error,\n  });\n}\n```\n\nThen:\n\n```javascript\ntry {\n  await getUsers();\n} catch (error) {\n  console.log(error.message);\n  console.log(error.cause);\n}\n```\n\nYou keep the original instead of throwing away the useful part.\n\nThis solves a real problem. The two bad alternatives are re-throwing the raw low-level error, which tells the caller nothing about which operation failed, or replacing it entirely, which loses the actual reason. `cause` gives you both layers: what you were trying to do, and why it did not work.\n\nOne practical note: `console.error(error)` prints the cause chain for you, but many log formatters only serialise `message`. If you use structured logging, make sure your formatter walks `cause` or you will lose the useful half.",
      diagram: `The three properties, and what each answers

    new Error("User 4821 not found", { cause: dbError })
              └────────┬──────────┘         └───┬────┘
                    .message                 .cause
                    WHAT happened            WHY it happened

    .stack
      Error: User 4821 not found
          at getUser      ─┐
          at getProfile    ├─ WHERE, and HOW you got there
          at handler      ─┘


The stack is captured at CREATION, not at throw

    const e = new Error("late")     ← stack captured HERE
    ...
    ...100 lines later...
    throw e                          ← not here

    Create the error where the problem is.


Why cause exists: neither alternative is good

    re-throw the raw error
      "ECONNREFUSED 127.0.0.1:5432"
      └─ true, but which operation? no idea

    replace it entirely
      throw new Error("Failed to load users")
      └─ useful, but WHY? gone

    wrap it
      new Error("Failed to load users", { cause: dbError })
      └─ both layers kept

    Failed to load users
      caused by: ECONNREFUSED 127.0.0.1:5432
        caused by: connect timeout


Never throw a string

    throw "oops"          no stack, no .message, no type
    throw new Error(...)  everything you need to debug`,
      codeExample: {
        title: "Building an error worth debugging",
        code: `// ── message, stack, cause ───────────────────────────────────
const error = new Error("Database connection failed");

console.log(error.message);        // Database connection failed
console.log(error.name);           // Error
console.log(error.stack);          // Error: ... \\n    at ...


// ── Write the message for the person debugging at 3am ───────
// ✗ throw new Error("Not found");
// ✓ throw new Error(\`User \${id} not found\`);
//   The id is what lets them reproduce it.


// ── The stack is captured at creation, not at throw ─────────
function getUser() {
  throw new Error("User 4821 not found");
}

function getProfile() {
  getUser();
}

try {
  getProfile();
} catch (e) {
  console.log(e.stack.split("\\n").slice(0, 3).join("\\n"));
  // Error: User 4821 not found
  //     at getUser
  //     at getProfile
}


// ── cause: keep both layers ─────────────────────────────────
async function query() {
  throw new Error("ECONNREFUSED 127.0.0.1:5432");
}

async function getUsers() {
  try {
    return await query();
  } catch (cause) {
    throw new Error("Failed to load users", { cause });
  }
}

try {
  await getUsers();
} catch (e) {
  console.log(e.message);          // Failed to load users
  console.log(e.cause.message);    // ECONNREFUSED 127.0.0.1:5432

  // walk the whole chain
  let current = e;
  while (current) {
    console.log("→", current.message);
    current = current.cause;
  }
}
// console.error(e) prints the chain for you, but a custom
// log formatter that only reads .message will drop the cause.


// ── Never throw a string ────────────────────────────────────
try {
  throw "something went wrong";
} catch (e) {
  console.log(typeof e);           // "string"
  console.log(e.message);          // undefined
  console.log(e.stack);            // undefined
  // No type to check, no stack to read. Always throw an Error.
}`,
      },
      keyTakeaways: [
        "`Error` carries three things worth knowing: `.message`, `.stack` and `.cause`.",
        "Write `.message` for the person debugging at 3am. Include the identifier that reproduces it.",
        "`.stack` answers what, where and how you got there. It is your most valuable production tool.",
        "The stack is captured when `new Error()` runs, <b>not</b> when it is thrown. Create it where the problem is.",
        "`.cause` keeps the original error when you wrap it in a more meaningful one.",
        "`cause` beats both alternatives: re-throwing loses context, replacing loses the reason.",
        "`console.error(error)` prints the cause chain, but a custom log formatter may drop it.",
        "<b>Never throw a string.</b> No stack, no `.message`, no type to check.",
      ],
      commonMistakes: [
        "<b>Throwing a string or an object literal</b> — you lose the stack entirely, and every `instanceof` check downstream fails.",
        "<b>Writing `\"Not found\"` with no identifier</b> — useless in a log with a thousand similar lines.",
        "<b>Creating an error early and throwing it much later</b> — the stack points at the creation site, not the failure.",
        "<b>Swallowing the original and throwing a fresh error</b> — you keep the context and lose the reason. Pass it as `cause`.",
        "<b>Logging only `error.message`</b> — no stack, no cause. Log the error object, or serialise all three.",
        "<b>Sending `error.stack` to the client</b> — it leaks file paths and internals. Log it, return a message.",
      ],
      quiz: [
        {
          question: "You create an error at the top of a function and throw it 50 lines later. Where does the stack trace point?",
          options: [
            "To the `throw` statement",
            "To the line where `new Error()` ran",
            "To the caller of the function",
            "It contains both locations",
          ],
          correctIndex: 1,
          explanation:
            "The stack is captured at construction. That is why you should create the error where the problem actually is, rather than reusing a pre-built one.",
        },
        {
          question: "Why is `throw new Error(\"Failed to load users\", { cause: dbError })` better than either alternative?",
          options: [
            "It runs faster",
            "It keeps both what you were doing and why it failed",
            "It prevents the error from propagating",
            "It automatically retries the query",
          ],
          correctIndex: 1,
          explanation:
            "Re-throwing the raw database error says why but not which operation. Replacing it says which operation but not why. Wrapping with `cause` keeps both layers.",
        },
        {
          question: "What do you lose by writing `throw \"something went wrong\"`?",
          options: [
            "Nothing, strings are valid to throw",
            "The stack trace, the `.message` property, and any type you could check with `instanceof`",
            "Only the stack trace",
            "Only the ability to log it",
          ],
          correctIndex: 1,
          explanation:
            "A thrown string is just a string. No stack, no `message`, and nothing for `instanceof` to match, so every typed error check downstream silently fails.",
        },
      ],
    },
    {
      id: "custom-errors",
      title: "Custom error classes",
      durationMinutes: 10,
      explanation:
        "As an application grows you get different <b>kinds</b> of failure, and they need different responses.\n\n```text\nValidationError\nAuthenticationError\nAuthorizationError\nNotFoundError\nDatabaseError\nPaymentError\n```\n\n---\n\n## Creating one\n\n```javascript\nclass NotFoundError extends Error {\n  constructor(message) {\n    super(message);\n\n    this.name = \"NotFoundError\";\n  }\n}\n```\n\n```javascript\nthrow new NotFoundError(\"User not found\");\n```\n\nAnd detecting it:\n\n```javascript\ntry {\n  throw new NotFoundError(\"User not found\");\n} catch (error) {\n  if (error instanceof NotFoundError) {\n    console.log(\"Handle not found\");\n  }\n}\n```\n\nTwo details in that constructor. `super(message)` is what sets `.message` and captures the stack, so it is never optional. And `this.name` has to be set by hand, because a subclass does not pick up its own name automatically. Skip it and your logs say `Error` for everything.\n\n---\n\n## Why bother?\n\nImagine your API throws:\n\n```javascript\nthrow new Error(\"User not found\");\n```\n\n```javascript\nthrow new Error(\"Email already exists\");\n```\n\n```javascript\nthrow new Error(\"Invalid password\");\n```\n\nThey are all just:\n\n```text\nError\n```\n\nSo the only way to tell them apart is to match on the message text, which breaks the moment someone rewords it.\n\nCustom errors give you real categories:\n\n```text\nError\n │\n ├── NotFoundError\n ├── ValidationError\n ├── AuthenticationError\n └── DatabaseError\n```\n\nNow code can respond differently:\n\n```javascript\nif (error instanceof NotFoundError) {\n  return res.status(404).json({\n    message: error.message,\n  });\n}\n```\n\nThat is the real payoff, and it arrives on Day 15 when you write error-handling middleware. One function maps error <b>types</b> to status codes, and no route handler has to think about HTTP at all.\n\nThe pattern that makes this clean is to put the status code on the error itself:\n\n```javascript\nclass AppError extends Error {\n  constructor(message, statusCode, options) {\n    super(message, options);\n    this.name = this.constructor.name;\n    this.statusCode = statusCode;\n  }\n}\n\nclass NotFoundError extends AppError {\n  constructor(message) {\n    super(message, 404);\n  }\n}\n```\n\nOne base class, `this.constructor.name` so every subclass names itself, and `options` passed through so `cause` still works.\n\n---\n\n## `Error.captureStackTrace()`\n\n<b>`Error.captureStackTrace()`</b> (a V8 feature for capturing a stack trace onto an object).\n\n```javascript\nclass ValidationError extends Error {\n  constructor(message) {\n    super(message);\n\n    this.name = \"ValidationError\";\n\n    Error.captureStackTrace(this, ValidationError);\n  }\n}\n```\n\nThe second argument tells V8 where to start, which hides the constructor frame so the trace begins at the code that actually threw.\n\n### You usually do not need this\n\nModern JavaScript subclasses `Error` properly on its own. One tidy frame is rarely worth the extra line. Reach for it when you genuinely want control over the trace, such as in a library where a factory function would otherwise clutter every stack.",
      diagram: `One type or many

    all plain Errors                    typed errors
    ┌────────────────────────┐          ┌────────────────────────┐
    │ Error "User not found" │          │ NotFoundError      404 │
    │ Error "Email exists"   │          │ ValidationError    422 │
    │ Error "Bad password"   │          │ AuthenticationErr  401 │
    └────────────────────────┘          └────────────────────────┘
       tell them apart HOW?                instanceof, or
       match the message text              error.statusCode
       breaks when reworded                survives rewording


The hierarchy, and where it pays off

              Error
                │
             AppError            message + statusCode + cause
                │
      ┌─────────┼─────────┬──────────────┐
      ↓         ↓         ↓              ↓
  NotFound  Validation  AuthN        Database
    404        422       401           500

    then ONE middleware (Day 15):
      res.status(error.statusCode ?? 500)
         .json({ message: error.message })

    no route handler thinks about HTTP


The two constructor lines you must not skip

    class NotFoundError extends Error {
      constructor(message) {
        super(message)              ← sets .message,
                                      captures the stack
        this.name = "NotFoundError" ← NOT automatic;
      }                               skip it and logs
    }                                 all say "Error"


captureStackTrace just trims a frame

    without                        with
    Error: bad email               Error: bad email
        at new ValidationError  ←      at validateUser
        at validateUser                at handler
        at handler

    Nice. Rarely worth the line.`,
      codeExample: {
        title: "A base class every error inherits from",
        code: `// ── The minimal custom error ────────────────────────────────
class NotFoundErrorSimple extends Error {
  constructor(message) {
    super(message);                    // sets .message, captures stack
    this.name = "NotFoundError";       // NOT automatic
  }
}


// ── The pattern worth using: one base class ─────────────────
class AppError extends Error {
  constructor(message, statusCode, options) {
    super(message, options);           // options passes cause through
    this.name = this.constructor.name; // every subclass names itself
    this.statusCode = statusCode;
    this.isOperational = true;         // see the next lesson
  }
}

class NotFoundError extends AppError {
  constructor(message) {
    super(message, 404);
  }
}

class ValidationError extends AppError {
  constructor(message, fields) {
    super(message, 422);
    this.fields = fields;              // extra context, per type
  }
}

class DatabaseError extends AppError {
  constructor(message, options) {
    super(message, 500, options);      // keeps the cause
  }
}


// ── Using them ──────────────────────────────────────────────
function loadUser(id) {
  if (!id) throw new ValidationError("id is required", ["id"]);
  if (id !== 1) throw new NotFoundError(\`User \${id} not found\`);
  return { id, name: "Rajan" };
}

for (const id of [0, 99, 1]) {
  try {
    console.log(loadUser(id));
  } catch (error) {
    console.log(error.name, error.statusCode, error.message);
    // ValidationError 422 id is required
    // NotFoundError   404 User 99 not found
  }
}


// ── Why this pays off: one place maps type → status ─────────
function toResponse(error) {
  return {
    status: error.statusCode ?? 500,
    body: { message: error.statusCode ? error.message : "Internal error" },
  };
}
// Untyped errors become a generic 500, so an unexpected bug
// never leaks its message to a client. Day 15 builds this
// into Express middleware.


// ── instanceof still works through the chain ────────────────
const e = new NotFoundError("nope");
console.log(e instanceof NotFoundError);   // true
console.log(e instanceof AppError);        // true
console.log(e instanceof Error);           // true


// ── captureStackTrace: trims the constructor frame ──────────
class TidyError extends Error {
  constructor(message) {
    super(message);
    this.name = "TidyError";
    Error.captureStackTrace(this, TidyError);
  }
}
// Optional. Modern subclassing is fine without it.`,
      },
      keyTakeaways: [
        "Custom error classes turn \"something failed\" into <b>which kind</b> of failure.",
        "`super(message)` sets `.message` and captures the stack. Never skip it.",
        "`this.name` is <b>not</b> automatic in a subclass. Set it, or every log says `Error`.",
        "`this.name = this.constructor.name` in a base class makes every subclass name itself.",
        "Without types, the only way to tell errors apart is matching message text, which breaks on rewording.",
        "Put `statusCode` on the error, and one middleware maps type to HTTP response (Day 15).",
        "Pass `options` through `super(message, options)` so `cause` still works on custom errors.",
        "An untyped error should become a generic 500, so an unexpected bug never leaks its message.",
        "`Error.captureStackTrace(this, MyError)` trims the constructor frame. Nice, rarely necessary.",
      ],
      commonMistakes: [
        "<b>Forgetting `super(message)`</b> — `.message` is empty and the stack is missing or wrong.",
        "<b>Forgetting `this.name`</b> — logs and monitoring show `Error` for every custom type.",
        "<b>Branching on `error.message` text</b> — the moment someone rewords the message, the branch silently stops matching.",
        "<b>Not passing `options` to `super`</b> — `new MyError(\"failed\", { cause })` quietly drops the cause.",
        "<b>Returning `error.message` for every error</b> — an unexpected bug's message goes straight to the client. Only do that for typed, operational errors.",
        "<b>Creating a class per individual failure</b> — you want a handful of categories, not thirty classes.",
        "<b>Using `Error.captureStackTrace` everywhere by reflex</b> — modern subclassing already works. Use it when you actually want the trace trimmed.",
      ],
      quiz: [
        {
          question: "You write `class NotFoundError extends Error { constructor(m) { super(m); } }` and log `error.name`. What do you get?",
          options: ["`\"NotFoundError\"`", "`\"Error\"`", "`undefined`", "`\"CustomError\"`"],
          correctIndex: 1,
          explanation:
            "`name` is inherited from `Error` and is not set from the class name automatically. You have to assign it, and `this.name = this.constructor.name` in a base class does it for every subclass at once.",
        },
        {
          question: "Why put `statusCode` on the error object rather than deciding it in each route handler?",
          options: [
            "It makes errors serialise faster",
            "One middleware can then map any error to a response, so handlers never think about HTTP",
            "Express requires it",
            "It prevents the error from being thrown",
          ],
          correctIndex: 1,
          explanation:
            "The error knows what kind of failure it is, so it can carry the status. That lets a single handler translate every error to a response, and it means an untyped error defaults to a safe generic 500.",
        },
        {
          question: "What is wrong with `if (error.message === \"User not found\")`?",
          options: [
            "Nothing, it is the standard approach",
            "It breaks silently as soon as anyone rewords the message",
            "`message` is not a string",
            "It only works in CommonJS",
          ],
          correctIndex: 1,
          explanation:
            "Message text is for humans and gets edited freely. `instanceof NotFoundError` or a `statusCode` field expresses the category in a way that survives rewording.",
        },
      ],
    },
    {
      id: "operational-vs-programmer",
      title: "Operational errors vs programmer errors",
      durationMinutes: 10,
      explanation:
        "This distinction is <b>very important in production Node.js</b>, and it decides everything else today: whether you handle a failure, or let the process die.\n\n---\n\n## Operational error\n\n<b>Operational error</b> (an expected failure that happens during normal operation).\n\n```text\nDatabase temporarily unavailable\nNetwork timeout\nFile doesn't exist\nInvalid user input\nExternal API unavailable\nConnection refused\n```\n\n```javascript\ntry {\n  await fetch(\"https://api.example.com\");\n} catch (error) {\n  // Network failure\n}\n```\n\nNothing is wrong with your code. The world is just unreliable. Your application can handle this: retry, return a 503, fall back to a cache, tell the user their input was invalid.\n\n---\n\n## Programmer error\n\n<b>Programmer error</b> (a bug in your code, which should be fixed rather than handled).\n\n```javascript\nconst user = null;\n\nconsole.log(user.name);\n```\n\n```javascript\nfunction add(a, b) {\n  return a + b;\n}\n\nadd(1);\n```\n\n```javascript\nconst result = undefined.someMethod();\n```\n\nSomething is wrong with the program itself. So do not write this:\n\n```javascript\ntry {\n  // entire application\n} catch {\n  // Ignore everything\n}\n```\n\nThat hides bugs. The error was information, and you deleted it.\n\n---\n\n## The rule\n\n```text\nExpected failure\n      ↓\nHandle it\n\nUnexpected bug\n      ↓\nFix it\n```\n\n```text\nUser entered wrong password\n      ↓\nExpected\n      ↓\nReturn 401\n```\n\nBut:\n\n```text\nApplication accessed undefined.someProperty\n      ↓\nBug\n      ↓\nInvestigate / fix / restart if necessary\n```\n\n---\n\n## The question to ask\n\nThe useful test is not \"what type is this error\" but:\n\n> <b>Do I know what state the application is in?</b>\n\nA failed `fetch` tells you nothing is broken internally. You know exactly where you are, so you can carry on.\n\nA `TypeError` from reading a property of `undefined` means your assumptions were wrong somewhere. You do not know what else those assumptions touched, what got half-written, or which invariant is now false. Continuing is a guess.\n\nThat is why the `isOperational` flag from the last lesson is worth carrying:\n\n```javascript\nclass AppError extends Error {\n  constructor(message, statusCode) {\n    super(message);\n    this.isOperational = true;\n  }\n}\n```\n\nEverything you threw deliberately is operational. Everything else, a `TypeError`, a `ReferenceError`, something from a library you did not expect, is not. That single boolean is what lets a top-level handler decide between \"return 500 and keep serving\" and \"log, drain, exit\".\n\n---\n\n## The middle ground\n\nOne honest caveat: a programmer error inside a <b>single request handler</b> usually does not corrupt the whole process. In practice most servers catch it, return a 500 for that request, log it loudly, and keep serving. That is a reasonable trade.\n\nThe important part is the <b>loudly</b>. A caught programmer error must reach your logs and your alerts. Silently returning 500 and moving on is how a bug survives for months.\n\nAnd the moment the failure is not confined to one request, a corrupted cache, a half-applied migration, a connection pool in an unknown state, restarting is the safer choice. The next lesson covers what that looks like.",
      diagram: `The real question is not the error type

    "Do I know what state the application is in?"
                      │
         ┌────────────┴────────────┐
        YES                        NO
         │                          │
    OPERATIONAL                PROGRAMMER
    the world failed           your assumptions failed
         │                          │
    fetch timed out            user.name where user is null
    file missing               add(1) with b undefined
    bad user input             undefined.someMethod()
    connection refused
         │                          │
    handle it:                 you do not know what else
    retry, 503, 401,           is now wrong
    fall back, validate             │
                               log loudly, and consider
                               restarting


Carry the answer on the error itself

    thrown deliberately by you  →  isOperational = true
    TypeError, ReferenceError,  →  no such flag
    anything unexpected

    top-level handler:
      isOperational  →  respond, keep serving
      anything else  →  log, drain, exit


The honest middle ground

    programmer error inside ONE request handler
        │
        ├─► catch it, return 500 for that request,
        │   log LOUDLY, keep serving        ← reasonable
        │
        └─► the "loudly" is the whole point.
            a silent 500 is how a bug lives
            for six months

    programmer error that touched shared state
        │
        └─► corrupted cache, half-applied write,
            pool in unknown state
            restarting is safer


Never do this

    try {
      // the entire application
    } catch {
      // ignore
    }

    The error was information. You deleted it.`,
      codeExample: {
        title: "Deciding what to do with a failure",
        code: `class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.name = this.constructor.name;
    this.statusCode = statusCode;
    this.isOperational = true;         // I threw this on purpose
  }
}

class NotFoundError extends AppError {
  constructor(message) { super(message, 404); }
}
class ServiceUnavailableError extends AppError {
  constructor(message, options) { super(message, 503); this.cause = options?.cause; }
}


// ── Operational: the world failed, carry on ─────────────────
async function loadFromApi(url) {
  try {
    const response = await fetch(url, { signal: AbortSignal.timeout(2000) });
    if (!response.ok) {
      throw new ServiceUnavailableError(\`Upstream returned \${response.status}\`);
    }
    return await response.json();
  } catch (cause) {
    // A timeout or refused connection says nothing about our state
    throw new ServiceUnavailableError("Upstream unavailable", { cause });
  }
}


// ── Programmer error: an assumption was wrong ───────────────
function badCode() {
  const user = null;
  return user.name;                    // TypeError
}

try {
  badCode();
} catch (error) {
  console.log(error.name);             // TypeError
  console.log(error.isOperational);    // undefined  ← the signal
}


// ── The top-level decision ──────────────────────────────────
function handleFailure(error, res) {
  if (error.isOperational) {
    // Known failure, known state. Respond and keep serving.
    res.status(error.statusCode).json({ message: error.message });
    return "continue";
  }

  // Unknown state. Log everything, do not leak the message.
  console.error("UNEXPECTED", error);   // ← loudly, always
  res.status(500).json({ message: "Internal error" });
  return "investigate";
}


// ── What NOT to write ───────────────────────────────────────
// try {
//   await runEverything();
// } catch {
//   // keep going
// }
//
// Every bug now looks like success. The error was the only
// thing telling you the code was wrong.


// ── The distinction in one table ────────────────────────────
// operational   fetch failed, file missing, bad input
//               → retry / 4xx / 503 / fall back
//
// programmer    TypeError, ReferenceError, wrong arity
//               → log loudly, fix the code, restart if
//                 shared state may be affected`,
      },
      keyTakeaways: [
        "<b>Operational error</b>: an expected failure. The world is unreliable, your code is fine.",
        "<b>Programmer error</b>: a bug. Your assumptions were wrong.",
        "The useful test is not the error type, it is: <b>do I know what state the application is in?</b>",
        "A failed `fetch` leaves you in a known state. A `TypeError` does not.",
        "Carry `isOperational = true` on errors you threw deliberately. Everything else is unexpected by definition.",
        "That one boolean is what lets a top-level handler choose between responding and restarting.",
        "A programmer error inside one request handler usually will not corrupt the process. Catching it and returning 500 is reasonable.",
        "But it must be logged <b>loudly</b>. A silent 500 is how a bug survives for months.",
        "Never wrap the application in a catch-all that ignores errors. You are deleting information.",
      ],
      commonMistakes: [
        "<b>Wrapping everything in a catch-all that continues</b> — every bug now looks like success.",
        "<b>Returning 500 silently for an unexpected error</b> — the response is fine, the missing alert is the problem.",
        "<b>Retrying a programmer error</b> — a `TypeError` will fail identically every time. Retries are for operational failures.",
        "<b>Sending the raw message for an unexpected error</b> — it leaks internals. Only typed operational errors should surface their message.",
        "<b>Treating a validation failure as a crash</b> — bad user input is entirely expected. Return 4xx.",
        "<b>Assuming any programmer error means you must restart</b> — one confined to a single handler usually does not. Judge by what shared state it touched.",
      ],
      quiz: [
        {
          question: "What is the most useful question for deciding whether to handle an error or let the process die?",
          options: [
            "Is it a TypeError?",
            "Do I know what state the application is in?",
            "Did it come from a library?",
            "Is it inside a try/catch?",
          ],
          correctIndex: 1,
          explanation:
            "A failed network call leaves your state intact, so you can respond and carry on. A broken assumption means you no longer know what else is wrong, which makes continuing a guess.",
        },
        {
          question: "Why does the `isOperational` flag work as a signal?",
          options: [
            "Node sets it automatically on network errors",
            "Anything you threw deliberately has it; a TypeError or ReferenceError never will",
            "It marks errors that are safe to ignore",
            "It tells the logger which level to use",
          ],
          correctIndex: 1,
          explanation:
            "You only set it on errors you constructed on purpose, so its absence identifies anything unexpected. That gives a top-level handler a clean binary decision.",
        },
        {
          question: "A programmer error is caught in a request handler and a 500 is returned. What is the remaining risk?",
          options: [
            "The response status is wrong",
            "If it is not logged loudly, the bug can survive for months unnoticed",
            "The process will crash later anyway",
            "There is no risk, this is the correct handling",
          ],
          correctIndex: 1,
          explanation:
            "Returning 500 for one bad request is a reasonable trade. The danger is the silent part: with no log and no alert, nothing ever tells you the code is wrong.",
        },
      ],
    },
    {
      id: "errors-in-three-styles",
      title: "Errors in callbacks, promises and async/await",
      durationMinutes: 8,
      explanation:
        "Three async styles, three places errors surface. You need to recognise all three, because a real codebase contains all three.\n\n---\n\n## Callbacks\n\nOlder Node APIs use:\n\n```text\n(error, result)\n```\n\n```javascript\nimport fs from \"node:fs\";\n\nfs.readFile(\"file.txt\", (error, data) => {\n  if (error) {\n    console.error(error);\n    return;\n  }\n\n  console.log(data);\n});\n```\n\nYou <b>must</b> check the error:\n\n```text\nCallback\n   ↓\n(error, result)\n   │\n   ├── error\n   └── result\n```\n\nAnd note the `return`. Handling the error does not stop execution, so without it you fall through to the success path with `undefined` data.\n\nThe trap worth knowing here: a `try/catch` around a callback API catches <b>nothing</b>. The callback runs later, on a different tick, long after the `try` block has finished.\n\n---\n\n## Promises\n\n```javascript\nfetchData()\n  .then(data => {\n    console.log(data);\n  })\n  .catch(error => {\n    console.error(error);\n  });\n```\n\nOne `.catch()` covers every step before it. Put it last.\n\n---\n\n## `async/await`\n\n```javascript\ntry {\n  const data = await fetchData();\n\n  console.log(data);\n} catch (error) {\n  console.error(error);\n}\n```\n\nThe three styles:\n\n```text\nCallback\n↓\nif (error)\n\nPromise\n↓\n.catch()\n\nasync/await\n↓\ntry/catch\n```\n\n---\n\n## What `try/catch` actually covers\n\nThis is where people get caught out. `try/catch` only catches what it <b>awaits</b>.\n\n```javascript\ntry {\n  doAsyncThing();          // not awaited: rejection escapes\n} catch (error) {\n  // never runs\n}\n```\n\n```javascript\ntry {\n  await doAsyncThing();    // awaited: caught\n} catch (error) {\n  // runs\n}\n```\n\nMissing one `await` turns a handled error into an unhandled rejection, which on modern Node crashes the process. It is the single most common way a well-structured `try/catch` fails to do its job.\n\nThe same applies inside callbacks:\n\n```javascript\napp.get(\"/users\", (req, res) => {\n  doAsyncThing();          // rejection escapes the handler entirely\n});\n```\n\n---\n\n## Mixing the styles\n\nYou will meet old callback APIs in a promise codebase. Two ways across:\n\n```javascript\nimport { readFile } from \"node:fs/promises\";      // built-in promise version\nimport { promisify } from \"node:util\";            // convert an old one\n\nconst lookup = promisify(oldCallbackFunction);\n```\n\nDo not hand-roll a `new Promise` wrapper when either of those exists. And if you must write one, remember to call `reject` on every failure path. A promise that never settles is worse than one that rejects: it hangs silently, forever.",
      diagram: `Three styles, three places the error appears

    CALLBACK                    error is an ARGUMENT
      fs.readFile(f, (error, data) => {
        if (error) { handle(error); return }   ← the return
        use(data)                                matters
      })

    PROMISE                     error goes to .catch()
      fetchData()
        .then(use)
        .catch(handle)          ← one catch, whole chain

    ASYNC/AWAIT                 error goes to catch block
      try {
        use(await fetchData())
      } catch (error) { handle(error) }


try/catch around a callback catches NOTHING

    try {
      fs.readFile(f, (error, data) => {
        throw new Error("boom")     ← different tick
      })
    } catch (e) {
      // never runs. the try block finished
      // before the callback existed
    }


The missing await

    try {
      doAsyncThing()          ✗ rejection escapes,
    } catch (e) {               becomes an unhandled
      // never runs             rejection → crash
    }

    try {
      await doAsyncThing()    ✓ caught
    } catch (e) {
      // runs
    }

    One missing keyword turns handled into fatal.`,
      codeExample: {
        title: "Where the error surfaces, in each style",
        code: `import fs from "node:fs";
import { readFile } from "node:fs/promises";
import { promisify } from "node:util";

// ── 1. Callback: check the error argument, then RETURN ──────
fs.readFile("missing.txt", "utf8", (error, data) => {
  if (error) {
    console.error("callback:", error.code);   // ENOENT
    return;                                   // ← without this,
  }                                           //   data is undefined
  console.log(data);
});


// ── try/catch cannot see into a callback ────────────────────
try {
  fs.readFile("missing.txt", (error) => {
    if (error) throw error;        // thrown on a later tick
  });
} catch (e) {
  console.log("never reached");    // the try block already finished
}


// ── 2. Promise: one .catch(), placed last ───────────────────
readFile("missing.txt", "utf8")
  .then((data) => console.log(data))
  .catch((error) => console.error("promise:", error.code))
  .finally(() => console.log("done either way"));


// ── 3. async/await: try/catch ───────────────────────────────
try {
  const data = await readFile("missing.txt", "utf8");
  console.log(data);
} catch (error) {
  console.error("await:", error.code);        // ENOENT
}


// ── The missing await ───────────────────────────────────────
async function boom() {
  throw new Error("async failure");
}

try {
  boom();                          // ✗ not awaited
} catch (error) {
  console.log("never runs");
}
// → UnhandledPromiseRejection, which crashes on modern Node

try {
  await boom();                    // ✓ awaited
} catch (error) {
  console.log("caught:", error.message);
}


// ── Same trap inside a route handler ────────────────────────
// app.get("/users", (req, res) => {
//   loadUsers().then(users => res.json(users));   ✗ no .catch
// });
//
// app.get("/users", async (req, res, next) => {
//   try {
//     res.json(await loadUsers());
//   } catch (error) {
//     next(error);                                ✓ Day 15
//   }
// });


// ── Crossing from callbacks to promises ─────────────────────
function oldStyle(id, callback) {
  setTimeout(() => {
    if (id > 0) callback(null, { id });
    else callback(new Error("bad id"));
  }, 10);
}

const lookup = promisify(oldStyle);
console.log(await lookup(1));      // { id: 1 }

// If you hand-roll a wrapper, reject on EVERY failure path.
// A promise that never settles hangs silently, forever.`,
      },
      keyTakeaways: [
        "Callbacks put the error <b>first</b>, as an argument. Check it, and `return` after handling it.",
        "A `try/catch` around a callback API catches nothing. The callback runs on a later tick.",
        "Promises send errors to `.catch()`, and one `.catch()` covers the whole chain before it.",
        "`async/await` sends errors to `try/catch`, which is the same mechanism with nicer syntax.",
        "<b>`try/catch` only covers what it awaits.</b> A missing `await` lets the rejection escape.",
        "That escaped rejection becomes an unhandled rejection, which crashes on modern Node.",
        "The same trap hits route handlers: a promise with no `.catch()` escapes the handler entirely.",
        "Use `node:fs/promises` and friends, or `util.promisify`, instead of hand-rolling wrappers.",
        "If you do write a wrapper, reject on every failure path. A promise that never settles hangs forever.",
      ],
      commonMistakes: [
        "<b>Forgetting `return` after handling a callback error</b> — the success path runs too, with `undefined` data.",
        "<b>Wrapping a callback API in `try/catch`</b> — it catches nothing, and you get a false sense of safety.",
        "<b>Forgetting `await` inside a `try`</b> — the most common way a correct-looking `try/catch` does nothing.",
        "<b>Putting `.catch()` before the `.then()`s</b> — it only sees errors from earlier in the chain.",
        "<b>A promise with no rejection handler in a route</b> — the error escapes the handler and takes the process with it.",
        "<b>Hand-rolling `new Promise` around something that already returns one</b> — the explicit construction antipattern.",
        "<b>Missing a `reject` path in a hand-written wrapper</b> — the promise never settles and the request hangs.",
      ],
      quiz: [
        {
          question: "Why does a `try/catch` wrapped around `fs.readFile(path, cb)` never catch anything?",
          options: [
            "`readFile` swallows its own errors",
            "The callback runs on a later tick, after the try block has already finished",
            "`try/catch` does not work with file operations",
            "You need `catch (error)` with a type annotation",
          ],
          correctIndex: 1,
          explanation:
            "The `try` block completes as soon as `readFile` is called. When the callback eventually runs, there is no enclosing try block on the stack any more.",
        },
        {
          question: "What happens if you write `doAsyncThing()` without `await` inside a `try` block?",
          options: [
            "The catch block still runs",
            "The rejection escapes as an unhandled rejection, which crashes on modern Node",
            "Node awaits it for you",
            "The promise is cancelled",
          ],
          correctIndex: 1,
          explanation:
            "`try/catch` only covers what it awaits. Without `await`, the promise settles outside the block, and an unhandled rejection terminates the process by default.",
        },
        {
          question: "You hand-write a `new Promise` wrapper and forget one `reject` path. What is the symptom?",
          options: [
            "An unhandled rejection",
            "The promise never settles, so the caller hangs silently",
            "A TypeError at construction",
            "The promise resolves with `undefined`",
          ],
          correctIndex: 1,
          explanation:
            "Neither `resolve` nor `reject` is called, so the promise stays pending forever. That is worse than a rejection, because there is no error to see and the request just hangs.",
        },
      ],
    },
    {
      id: "unhandled-and-uncaught",
      title: "Unhandled rejections, uncaught exceptions, and why you should crash",
      durationMinutes: 12,
      explanation:
        "The two process-level events, and the production judgement they force.\n\n---\n\n## Unhandled promise rejections\n\n```javascript\nasync function main() {\n  throw new Error(\"Something went wrong\");\n}\n\nmain();\n```\n\nThe promise `main()` returned rejects, and nobody handles it.\n\n> <b>Unhandled rejection</b> (a promise rejection with no rejection handler attached).\n\nOn modern Node the default is to <b>crash the process</b>. That is deliberate: an unhandled rejection used to print a warning and continue, which meant errors vanished silently. Treating it as fatal was the fix.\n\nSo `main()` should be `main().catch(...)`. Every top-level async call needs a handler.\n\n---\n\n## `process.on(\"unhandledRejection\")`\n\n```javascript\nprocess.on(\"unhandledRejection\", (reason, promise) => {\n  console.error(\"Unhandled rejection:\", reason);\n});\n```\n\n```javascript\nprocess.on(\"unhandledRejection\", (reason) => {\n  console.error(\"Unhandled rejection:\", reason);\n});\n\nPromise.reject(new Error(\"Database failed\"));\n```\n\nThis gives you visibility into a serious problem.\n\n### Important\n\nDo not use it as:\n\n```javascript\n\"Catch everything and continue.\"\n```\n\nAn unhandled rejection may mean the application is in an unsafe state. In production, have a deliberate policy: log it, clean up, and probably terminate.\n\nThere is a specific trap here. <b>Registering a handler replaces the default crash</b>. So adding this listener to \"improve logging\" quietly converts a fatal error into a silent one, and you have re-created the old behaviour that Node changed on purpose. If you register it, exit at the end of it.\n\n---\n\n## Uncaught exceptions\n\n<b>Uncaught exception</b> (an exception that escapes all handling and reaches the process).\n\n```javascript\nthrow new Error(\"Fatal problem\");\n```\n\nNode terminates the process. You can observe it:\n\n```javascript\nprocess.on(\"uncaughtException\", error => {\n  console.error(\"Uncaught exception:\", error);\n});\n```\n\nBut:\n\n> <b>Do not treat `uncaughtException` as a recovery mechanism.</b>\n\nSame trap, more dangerous. Registering a handler stops Node exiting, so the process keeps running <b>after a stack was abandoned mid-execution</b>. Whatever that function was in the middle of, a half-written record, an unreleased lock, an open transaction, stays that way.\n\nThe only correct shape is: log, attempt cleanup, exit anyway.\n\n---\n\n## Why should you crash?\n\nOne of the most important production concepts.\n\n```text\nUnexpected programmer error\n        ↓\nApplication state may be corrupted\n        ↓\nContinue running?\n```\n\nYou do not know what state you are in. Continuing produces:\n\n```text\nCorrupted state\n      ↓\nWrong responses\n      ↓\nBad data\n      ↓\nMore failures\n```\n\nInstead:\n\n```text\nFatal unexpected error\n        ↓\nLog it\n        ↓\nStop accepting work\n        ↓\nExit\n        ↓\nProcess manager restarts application\n```\n\n```text\nDocker\nKubernetes\nsystemd\nCloud platforms\n```\n\n> <b>Crash safely rather than continuing in an unknown state.</b>\n\nThis feels wrong the first time you hear it, because crashing sounds like the bad outcome. It is not. A restart costs you a few seconds of one process. Serving wrong data from a corrupted process costs you data you cannot get back, and it is much harder to notice.\n\nThe reason this works at all is that <b>something restarts you</b>. Kubernetes, systemd or your platform brings the process straight back, usually before anyone notices. Crashing is only a safe strategy because a supervisor exists, so make sure one does before you rely on it.\n\nAnd crash <b>safely</b>, not instantly: log the error with its stack, stop accepting new work, give in-flight requests a moment, then exit non-zero. That is the graceful shutdown the rest of this day builds.",
      diagram: `Registering a handler changes the default

    unhandledRejection
      no handler   ──►  Node crashes          ← the default,
                                                on purpose
      handler      ──►  Node does NOT crash   ← you now own
                                                the decision

    uncaughtException
      no handler   ──►  Node crashes
      handler      ──►  Node does NOT crash   ← and the stack
                                                was abandoned
                                                mid-execution

    Adding a listener "just for logging" silently turns a
    fatal error into a hidden one. If you register it, exit.


Why crashing is the safe choice

    continue after a programmer error
        │
        ↓
    corrupted state ──► wrong responses ──► bad data
        │                                      │
        └─► and it is HARD TO NOTICE ◄─────────┘

    crash instead
        │
        ↓
    log ─► stop new work ─► finish in flight ─► exit 1
        │
        ↓
    supervisor restarts you        seconds of downtime
    (k8s, systemd, Docker)         in ONE process

    A restart costs seconds. Bad data costs data.


But only because someone restarts you

    crash + supervisor      = self-healing
    crash + no supervisor   = outage

    Check which one you have before relying on this.


The only correct handler shape

    process.on("uncaughtException", (error) => {
      logger.fatal(error)          ← with the stack
      server.close()               ← stop accepting work
      setTimeout(() => process.exit(1), 5000).unref()
    })                             ← exit ANYWAY`,
      codeExample: {
        title: "Handlers that log and then exit anyway",
        code: `// ── The bug: a top-level async call with no handler ─────────
async function main() {
  throw new Error("Something went wrong");
}

// main();                    ✗ unhandled rejection → crash
main().catch((error) => {  // ✓ every top-level async call
  console.error("main failed:", error.message);
  process.exitCode = 1;
});


// ── Observing an unhandled rejection ────────────────────────
process.on("unhandledRejection", (reason, promise) => {
  console.error("UNHANDLED REJECTION:", reason);
  // Registering this REPLACED Node's default crash.
  // So do the crashing yourself:
  process.exitCode = 1;
  shutdown("unhandledRejection");
});


// ── Observing an uncaught exception ─────────────────────────
process.on("uncaughtException", (error, origin) => {
  console.error("UNCAUGHT EXCEPTION:", error, origin);
  // A stack was abandoned mid-execution. Something may be
  // half-written, a lock unreleased, a transaction open.
  // Never "recover" here.
  process.exitCode = 1;
  shutdown("uncaughtException");
});


// ── Crash SAFELY, not instantly ─────────────────────────────
let shuttingDown = false;

function shutdown(reason) {
  if (shuttingDown) return;          // a second signal is not a
  shuttingDown = true;               // reason to start over

  console.error(\`shutting down: \${reason}\`);

  server.close(() => {               // stop accepting new work
    console.error("server closed");
    process.exit(process.exitCode ?? 1);
  });

  // never wait forever
  setTimeout(() => {
    console.error("forced exit");
    process.exit(1);
  }, 5000).unref();                  // .unref() so this timer
}                                    // does not hold us open


// ── exitCode vs exit() ──────────────────────────────────────
process.exitCode = 1;
// The process finishes its work, then exits 1. Pending
// writes complete.

// process.exit(1);
// Immediate. Buffered stdout may be truncated, which is how
// you lose the very log line explaining the crash.


// ── What NOT to write ───────────────────────────────────────
// process.on("uncaughtException", (error) => {
//   console.error(error);          // logged...
// });                             // ...and now we keep running
//                                 //    in an unknown state
//
// This is the old behaviour Node deliberately moved away from.`,
      },
      keyTakeaways: [
        "An <b>unhandled rejection</b> crashes the process by default on modern Node. That change was deliberate.",
        "So every top-level async call needs `.catch()`. `main()` should be `main().catch(...)`.",
        "<b>Registering a handler replaces the default crash.</b> Adding one \"for logging\" hides a fatal error.",
        "An <b>uncaught exception</b> means a stack was abandoned mid-execution. Something may be half-done.",
        "Never treat `uncaughtException` as recovery. Log, clean up, exit anyway.",
        "Continuing after a programmer error risks corrupted state, wrong responses and bad data.",
        "A restart costs seconds in one process. Bad data costs data, and is much harder to notice.",
        "Crashing is only safe because a <b>supervisor restarts you</b>. Confirm one exists.",
        "Crash <b>safely</b>: log with the stack, stop new work, let in-flight finish, then exit non-zero.",
        "`process.exitCode = 1` lets the process finish and flush. `process.exit(1)` can truncate your logs.",
      ],
      commonMistakes: [
        "<b>Adding an `unhandledRejection` or `uncaughtException` listener that only logs</b> — you have disabled the crash and recreated the silent-failure behaviour Node fixed.",
        "<b>Calling `main()` without `.catch()`</b> — any throw inside becomes an unhandled rejection.",
        "<b>Treating `uncaughtException` as a retry point</b> — the abandoned stack may have left a lock held or a write half-applied.",
        "<b>Calling `process.exit()` immediately inside the handler</b> — buffered stdout is truncated, so you lose the log explaining the crash.",
        "<b>Relying on crash-and-restart with no supervisor</b> — that is not self-healing, it is an outage.",
        "<b>No timeout on the shutdown path</b> — one stuck request keeps a broken process alive indefinitely.",
        "<b>Letting a second signal restart the shutdown</b> — guard with a `shuttingDown` flag.",
      ],
      quiz: [
        {
          question: "You add `process.on(\"uncaughtException\", error => console.error(error))` to improve logging. What have you actually changed?",
          options: [
            "Nothing, Node still exits afterwards",
            "Node no longer exits, so the process continues after a stack was abandoned mid-execution",
            "Errors are now caught before they throw",
            "Only the log format",
          ],
          correctIndex: 1,
          explanation:
            "Registering a handler replaces the default termination. The process keeps running in whatever state the abandoned function left behind, which is exactly the silent-failure mode Node moved away from.",
        },
        {
          question: "Why is crashing on an unexpected error the safer choice?",
          options: [
            "Crashes are faster than error handling",
            "A restart costs seconds in one process, while serving wrong data from a corrupted process is costly and hard to notice",
            "Node cannot continue after any error",
            "It avoids writing error handling code",
          ],
          correctIndex: 1,
          explanation:
            "After a programmer error you do not know what state you are in. Restarting returns you to a known one. This only works because a supervisor brings the process back.",
        },
        {
          question: "What is the difference between `process.exitCode = 1` and `process.exit(1)`?",
          options: [
            "They are identical",
            "`exitCode` lets the process finish and flush output; `exit()` is immediate and can truncate logs",
            "`exitCode` only works in ESM",
            "`exit()` returns a success code",
          ],
          correctIndex: 1,
          explanation:
            "Setting `exitCode` records the verdict and lets pending work and buffered writes complete. Calling `exit()` stops immediately, which is how you lose the log line explaining the crash.",
        },
      ],
    },
    {
      id: "lifecycle-events",
      title: "Process lifecycle — exit, beforeExit and signals",
      durationMinutes: 10,
      explanation:
        "How a Node process learns it is about to stop.\n\n---\n\n## `process.on(\"exit\")`\n\n```javascript\nprocess.on(\"exit\", code => {\n  console.log(`Process exiting with code ${code}`);\n});\n```\n\n```javascript\nprocess.on(\"exit\", code => {\n  console.log(\"Exiting:\", code);\n});\n\nprocess.exit(0);\n```\n\n```text\nExiting: 0\n```\n\n### Important\n\nThe `exit` event is for <b>synchronous cleanup only</b>. This does not work:\n\n```javascript\nprocess.on(\"exit\", async () => {\n  await database.disconnect();\n});\n```\n\nThe process is already leaving. Async work will not keep it alive, and the `await` never resumes.\n\nThat makes `exit` almost useless for real cleanup. Closing a database connection, flushing logs, draining a queue: all async. Do that work in a signal handler instead, where the process is still willing to wait. Use `exit` for a final synchronous log line and nothing more.\n\n---\n\n## `beforeExit`\n\n```javascript\nprocess.on(\"beforeExit\", code => {\n  console.log(\"Before exit:\", code);\n});\n```\n\n<b>`beforeExit`</b> (emitted when Node has no more scheduled work and is about to exit naturally).\n\nThe difference:\n\n### `beforeExit`\n\nThe process can still continue if you schedule more work.\n\n### `exit`\n\nThe process is actually leaving.\n\n```text\nbeforeExit\n    ↓\n\"Looks like there's no more work.\"\n\nexit\n    ↓\n\"I'm leaving now.\"\n```\n\nOne catch: `beforeExit` is <b>not</b> emitted on an explicit `process.exit()` or on an uncaught exception. It fires only when the event loop empties on its own, so it is not a reliable cleanup hook either.\n\n---\n\n## Signals\n\nThe operating system can send signals to a process. Two matter for servers:\n\n```text\nSIGINT\nSIGTERM\n```\n\n---\n\n## `SIGINT`\n\n<b>`SIGINT`</b> (interrupt, usually from pressing `Ctrl+C`).\n\n```bash\nCtrl + C\n```\n\n```javascript\nprocess.on(\"SIGINT\", () => {\n  console.log(\"Received SIGINT\");\n});\n```\n\nOne surprise: <b>once you register a handler, `Ctrl+C` no longer kills the process</b>. You have taken responsibility for exiting. Register a handler that only logs and you have made your own server unkillable by `Ctrl+C`, which is a memorable few minutes the first time.\n\n---\n\n## `SIGTERM`\n\n<b>`SIGTERM`</b> (a request to terminate gracefully, from the OS or a process manager).\n\nExtremely important in production:\n\n```text\nKubernetes\n   ↓\nSIGTERM\n   ↓\nNode.js application\n```\n\nYour application should:\n\n```text\nStop accepting new requests\n        ↓\nFinish existing requests\n        ↓\nClose database connections\n        ↓\nClose other resources\n        ↓\nExit\n```\n\nThat is <b>graceful shutdown</b> (stopping cleanly rather than immediately).\n\n---\n\n## The one you cannot catch\n\n```text\nSIGTERM   catchable   \"please stop\"\nSIGINT    catchable   Ctrl+C\nSIGKILL   NOT catchable   dies instantly, no cleanup\n```\n\n`SIGKILL` (`kill -9`) cannot be handled, and that shapes the whole design. Kubernetes sends `SIGTERM`, waits `terminationGracePeriodSeconds` (30 by default), then sends `SIGKILL`. Docker's `docker stop` does the same with 10 seconds.\n\nSo your graceful shutdown has a <b>deadline you do not control</b>. Make your own forced-exit timeout shorter than that window, or the platform kills you mid-cleanup and you get the abrupt shutdown you were trying to avoid.\n\nHandle both signals with the same function, since the difference between a developer pressing `Ctrl+C` and Kubernetes rolling a pod is not something your cleanup code cares about.",
      diagram: `Which hook can actually do async work

    SIGTERM / SIGINT     ✓ process still willing to wait
                           close DB, drain queues, flush logs
                           ← do real cleanup HERE

    beforeExit           ~ can schedule more work, BUT not
                           emitted on process.exit() or on
                           an uncaught exception

    exit                 ✗ synchronous only. an await here
                           never resumes. one last log line,
                           nothing more


The signals, and the one you cannot catch

    SIGTERM    catchable      "please stop"  ← k8s, docker stop
    SIGINT     catchable      Ctrl+C
    SIGKILL    NOT catchable  instant death, no cleanup


Your deadline is set by the platform

    Kubernetes
      SIGTERM ──────────────────────────► SIGKILL
              └── terminationGracePeriod ──┘
                  30s by default

    Docker
      SIGTERM ──────────► SIGKILL
              └── 10s ────┘

    your forced-exit timeout MUST be shorter,
    or the platform kills you mid-cleanup


Registering a handler takes responsibility

    no SIGINT handler   ──►  Ctrl+C kills the process
    SIGINT handler      ──►  Ctrl+C does NOT kill it

    process.on("SIGINT", () => console.log("bye"))
      └─ congratulations, your server now ignores Ctrl+C`,
      codeExample: {
        title: "The lifecycle hooks, and what each can do",
        code: `// ── exit: synchronous only ──────────────────────────────────
process.on("exit", (code) => {
  console.log("exiting with code", code);      // ✓ sync log
});

// process.on("exit", async () => {
//   await database.disconnect();               ✗ never resumes
// });
//
// The process is already leaving. Async work cannot keep it
// alive, so real cleanup belongs in a signal handler.


// ── beforeExit: the loop emptied on its own ─────────────────
process.on("beforeExit", (code) => {
  console.log("beforeExit", code);
  // You CAN schedule more work here, which keeps the process
  // alive. But this never fires on process.exit() or on an
  // uncaught exception, so it is not a reliable cleanup hook.
});


// ── Signals: where real cleanup goes ────────────────────────
let shuttingDown = false;

async function shutdown(signal) {
  if (shuttingDown) {
    console.log("already shutting down, forcing exit");
    process.exit(1);                 // second Ctrl+C = force
  }
  shuttingDown = true;

  console.log(\`\${signal} received, shutting down\`);

  // async cleanup is fine HERE
  // await server.close();
  // await database.disconnect();
  // await queue.drain();

  console.log("cleanup complete");
  process.exit(0);
}

// same handling for both: your cleanup does not care whether
// a developer pressed Ctrl+C or Kubernetes rolled the pod
process.on("SIGTERM", () => shutdown("SIGTERM"));
process.on("SIGINT", () => shutdown("SIGINT"));

// ⚠ Registering SIGINT means Ctrl+C no longer kills the
//   process by itself. You now own the exit.


// ── SIGKILL cannot be caught ────────────────────────────────
// process.on("SIGKILL", ...)        // has no effect
//
// kill -9 dies instantly, no cleanup, no handler.
// That is why your window is finite:
//
//   Kubernetes:  SIGTERM → 30s (terminationGracePeriodSeconds)
//                        → SIGKILL
//   docker stop: SIGTERM → 10s → SIGKILL
//
// Keep your forced-exit timeout BELOW that number, or the
// platform kills you mid-cleanup.


// ── Try it ──────────────────────────────────────────────────
// node lifecycle.js
//   then press Ctrl+C          → SIGINT  → graceful
//   or from another terminal:
//   kill -TERM <pid>           → SIGTERM → graceful
//   kill -9 <pid>              → SIGKILL → instant, no logs`,
      },
      keyTakeaways: [
        "`process.on(\"exit\")` is <b>synchronous only</b>. An `await` inside it never resumes.",
        "So `exit` is nearly useless for real cleanup, since closing connections is async. Use it for one last log line.",
        "`beforeExit` fires when the loop empties naturally, and you can still schedule work.",
        "But `beforeExit` is skipped on `process.exit()` and on uncaught exceptions, so it is not reliable either.",
        "Real cleanup belongs in a <b>signal handler</b>, where the process is still willing to wait.",
        "`SIGINT` is `Ctrl+C`. `SIGTERM` is a process manager asking you to stop.",
        "<b>Registering a `SIGINT` handler means `Ctrl+C` no longer kills the process.</b> You own the exit now.",
        "`SIGKILL` cannot be caught. No handler, no cleanup, instant death.",
        "Kubernetes sends `SIGTERM`, waits 30s, then `SIGKILL`. `docker stop` waits 10s.",
        "Your forced-exit timeout must be <b>shorter</b> than that window, or you get killed mid-cleanup.",
        "Handle `SIGTERM` and `SIGINT` with the same function. Your cleanup does not care which one it was.",
      ],
      commonMistakes: [
        "<b>Doing async cleanup in `process.on(\"exit\")`</b> — the `await` never resumes and the cleanup silently does not happen.",
        "<b>Relying on `beforeExit`</b> — it does not fire on `process.exit()` or on an uncaught exception.",
        "<b>Registering a `SIGINT` handler that only logs</b> — you have made your own server unkillable by `Ctrl+C`.",
        "<b>Handling only `SIGINT`</b> — production sends `SIGTERM`, so your graceful path never runs where it matters.",
        "<b>Trying to handle `SIGKILL`</b> — it cannot be caught, by design.",
        "<b>A shutdown timeout longer than the platform's grace period</b> — the platform kills you mid-cleanup, defeating the point.",
        "<b>Not guarding against a second signal</b> — an impatient second `Ctrl+C` restarts the shutdown instead of forcing an exit.",
      ],
      quiz: [
        {
          question: "Why does `process.on(\"exit\", async () => { await db.disconnect(); })` not work?",
          options: [
            "`exit` does not accept a function",
            "The process is already leaving, so async work cannot keep it alive and the `await` never resumes",
            "`db.disconnect()` is synchronous",
            "It works, but only in CommonJS",
          ],
          correctIndex: 1,
          explanation:
            "By the time `exit` fires, the event loop is finished. Nothing will run your continuation. Async cleanup belongs in a signal handler, where the process is still willing to wait.",
        },
        {
          question: "You register `process.on(\"SIGINT\", () => console.log(\"bye\"))`. What happens when you press Ctrl+C?",
          options: [
            "It logs and exits as normal",
            "It logs, and the process keeps running because you now own the exit",
            "Node ignores the handler and exits",
            "The process exits with code 130",
          ],
          correctIndex: 1,
          explanation:
            "Registering a handler replaces the default termination. Without an explicit exit in your handler, the server carries on and Ctrl+C no longer kills it.",
        },
        {
          question: "Kubernetes has `terminationGracePeriodSeconds: 30`. What should your forced-exit timeout be?",
          options: [
            "Exactly 30 seconds",
            "Comfortably under 30 seconds",
            "60 seconds, to be safe",
            "It does not matter, SIGKILL waits for you",
          ],
          correctIndex: 1,
          explanation:
            "After the grace period Kubernetes sends an uncatchable `SIGKILL`. If your own timeout is at or above it, the platform terminates you mid-cleanup and you get the abrupt shutdown you were avoiding.",
        },
      ],
    },
    {
      id: "graceful-shutdown",
      title: "Graceful shutdown, in practice",
      durationMinutes: 14,
      explanation:
        "The payoff of the last two lessons, and the part you will actually ship.\n\n---\n\n## The problem\n\nYour API is processing:\n\n```text\nRequest A ────────────────→ finished\nRequest B ────────→ finished\nRequest C ─────────→ finished\n```\n\nThen the server receives:\n\n```text\nSIGTERM\n```\n\nDo not immediately kill the process. Instead:\n\n```text\nSIGTERM\n  ↓\nStop accepting new requests\n  ↓\nWait for active requests\n  ↓\nClose resources\n  ↓\nExit\n```\n\nThis prevents users seeing:\n\n```text\nConnection reset\n502\n503\nPartial response\n```\n\nThose failures are not hypothetical. Every deploy, every autoscaling event, every pod reschedule sends `SIGTERM`. Without graceful shutdown, every one of them drops requests, and it shows up as a small unexplained error rate that correlates with your deploys.\n\n---\n\n## The basic version\n\n```javascript\nimport http from \"node:http\";\n\nconst server = http.createServer((req, res) => {\n  res.end(\"Hello\");\n});\n\nserver.listen(3000);\n\nprocess.on(\"SIGTERM\", () => {\n  console.log(\"SIGTERM received\");\n\n  server.close(() => {\n    console.log(\"Server closed\");\n\n    process.exit(0);\n  });\n});\n```\n\n`server.close()` stops accepting new connections while letting existing ones finish.\n\n```text\nExisting request\n      ↓\nFinish\n\nNew request\n      ↓\nRejected / no longer accepted\n\nAll done\n      ↓\nExit\n```\n\n---\n\n## With a timeout\n\nDo not wait forever:\n\n```javascript\nimport http from \"node:http\";\n\nconst server = http.createServer((req, res) => {\n  setTimeout(() => {\n    res.end(\"Finished\");\n  }, 5000);\n});\n\nserver.listen(3000);\n\nprocess.on(\"SIGTERM\", () => {\n  console.log(\"Shutting down...\");\n\n  server.close(() => {\n    console.log(\"Shutdown complete\");\n\n    process.exit(0);\n  });\n\n  setTimeout(() => {\n    console.error(\"Forced shutdown\");\n\n    process.exit(1);\n  }, 10_000).unref();\n});\n```\n\n```text\nSIGTERM\n   ↓\nGraceful shutdown\n   ↓\nWait\n   ↓\nRequests finish\n   ↓\nExit\n\nBUT\n\nToo long\n   ↓\nForce exit\n```\n\nOne broken request cannot keep the server alive forever. Note the `.unref()`, which stops that timer from holding the process open once everything else has finished.\n\n---\n\n## The gotcha that makes this look broken\n\nYou will write the code above, test it, and find the server takes 5 seconds to shut down with no requests in flight. It looks like a bug in your handler. It is not.\n\n`server.close()` waits for every connection to <b>close</b>, and HTTP keep-alive connections stay open idle between requests. A browser or a load balancer holds them open by design, so `close()` waits for them to time out.\n\nThe fix, on Node 18.2 and later:\n\n```javascript\nserver.close(callback);\nserver.closeIdleConnections();   // drop the idle ones now\n```\n\nAnd if you need to be firmer at the end of your grace period, `server.closeAllConnections()` terminates the rest.\n\n---\n\n## Meaningful exit codes\n\nYou already know:\n\n```text\n0 → success\nnon-zero → failure\n```\n\n```javascript\nprocess.exit(0);   // successful shutdown\nprocess.exit(1);   // general failure\n```\n\nOther non-zero codes are fine where your environment gives them meaning. Consistency is the important part.\n\nThe distinction that matters here: a shutdown you asked for should exit `0`, and a shutdown caused by a crash should exit non-zero. Your platform reads that difference. A pod exiting `0` during a rolling update is normal. A pod exiting `1` is a crash to investigate, and repeated ones trigger a backoff.\n\n---\n\n## What else needs closing\n\nThe HTTP server is the start, not the whole job. Real shutdown order:\n\n```text\n1. mark unhealthy      so the load balancer stops routing\n2. server.close()      no new connections\n3. finish in flight    plus closeIdleConnections()\n4. drain workers       let queue jobs finish or requeue\n5. close the database  pool, Redis, message broker\n6. flush logs          especially async transports\n7. exit 0\n```\n\nStep 1 gets skipped most often and matters most. Your load balancer needs a few seconds to notice you are going away, and it usually finds out from a health check rather than from the signal. Fail the health check first, wait a moment, then start closing. Otherwise traffic keeps arriving at a server that has already stopped accepting it, which produces exactly the connection resets you were trying to prevent.",
      diagram: `Why this matters every single deploy

    without graceful shutdown
      deploy ──► SIGTERM ──► process dies ──► requests in
                                              flight DROPPED
      symptom: a small error rate that correlates
               with your deploys, and nothing else


The order, and the step everyone skips

    1  mark unhealthy        ← SKIPPED MOST, MATTERS MOST
       │                       the load balancer learns from
       │                       a health check, not the signal
       ↓
    2  server.close()          no new connections
       ↓
    3  finish in flight        + closeIdleConnections()
       ↓
    4  drain workers           finish or requeue jobs
       ↓
    5  close DB / Redis / broker
       ↓
    6  flush logs              async transports especially
       ↓
    7  exit 0


The gotcha: close() waits for keep-alive

    server.close()
        │
        └─► waits for every connection to CLOSE
              │
              └─► keep-alive connections sit open idle
                    by design (browsers, load balancers)
                      │
                      └─► your shutdown "hangs" for seconds
                          with zero requests in flight

    fix (Node 18.2+)
      server.close(cb)
      server.closeIdleConnections()   drop idle now
      server.closeAllConnections()    firmer, at the deadline


The exit code is read by your platform

    exit 0   asked-for shutdown    normal during a rollout
    exit 1   crash                 investigate; repeated
                                   ones trigger a backoff


The timeout, and why .unref()

    setTimeout(force, 10_000).unref()
                              └─ without this, the timer
                                 itself keeps the process
                                 alive for 10s after
                                 everything else finished`,
      codeExample: {
        title: "A graceful shutdown you can actually ship",
        code: `import http from "node:http";

let activeRequests = 0;
let healthy = true;
let shuttingDown = false;

const server = http.createServer(async (req, res) => {
  // health check: the load balancer's only window into us
  if (req.url === "/health") {
    res.writeHead(healthy ? 200 : 503).end(healthy ? "ok" : "draining");
    return;
  }

  activeRequests += 1;
  res.on("close", () => { activeRequests -= 1; });

  if (req.url === "/slow") {
    await new Promise((r) => setTimeout(r, 5000));
  }
  res.end("Hello");
});

server.listen(3000, () => console.log("listening on 3000"));


// ── The shutdown sequence ───────────────────────────────────
const GRACE_MS = 8000;          // must be UNDER the platform's
                                // terminationGracePeriodSeconds

async function shutdown(signal) {
  if (shuttingDown) {
    console.error("second signal, forcing exit");
    process.exit(1);
  }
  shuttingDown = true;

  console.log(\`\${signal} received\`);

  // 1. stop being routed to, BEFORE closing anything
  healthy = false;
  console.log("marked unhealthy, waiting for the load balancer");
  await new Promise((r) => setTimeout(r, 1000));

  // 2. stop accepting new connections
  console.log("stopping server...");
  server.close(async () => {
    console.log("server closed");

    // 4-6. everything else, now that no requests remain
    // await queue.drain();
    // await database.end();
    // await logger.flush();

    console.log("process exiting");
    process.exit(0);
  });

  // 3. keep-alive connections would otherwise hold close()
  //    open for seconds with nothing in flight
  server.closeIdleConnections();

  console.log(\`waiting for \${activeRequests} active requests...\`);

  // the deadline: one stuck request cannot hold us forever
  setTimeout(() => {
    console.error(\`forced shutdown, \${activeRequests} still active\`);
    server.closeAllConnections?.();
    process.exit(1);
  }, GRACE_MS).unref();          // .unref() so this timer does
}                                // not keep us alive on its own

process.on("SIGTERM", () => shutdown("SIGTERM"));
process.on("SIGINT", () => shutdown("SIGINT"));


// ── Try it ──────────────────────────────────────────────────
// terminal 1:  node server.js
// terminal 2:  curl localhost:3000/slow &
//              kill -TERM $(pgrep -f server.js)
//
// SIGTERM received
// marked unhealthy, waiting for the load balancer
// stopping server...
// waiting for 1 active requests...
//   ...5 seconds, the /slow request completes...
// server closed
// process exiting
//
// The in-flight request finished. No connection reset.`,
      },
      keyTakeaways: [
        "Every deploy, autoscale and pod reschedule sends `SIGTERM`. Without graceful shutdown, each one drops requests.",
        "The symptom is a small error rate that correlates with your deploys and nothing else.",
        "`server.close()` stops new connections and lets existing ones finish.",
        "<b>Mark yourself unhealthy first.</b> The load balancer learns you are going away from a health check, not the signal.",
        "Skipping that step means traffic keeps arriving at a server that has stopped accepting it.",
        "`server.close()` waits for keep-alive connections to close, so shutdown appears to hang with nothing in flight.",
        "`server.closeIdleConnections()` fixes that. `server.closeAllConnections()` is the firmer version for your deadline.",
        "Always have a forced-exit timeout, and `.unref()` it so the timer does not hold the process open.",
        "Keep that timeout comfortably under the platform's grace period.",
        "Exit `0` for a shutdown you asked for, non-zero for a crash. Your platform treats them differently.",
        "The HTTP server is step one. Workers, database pools, brokers and async log transports all need closing too.",
      ],
      commonMistakes: [
        "<b>Closing the server before failing the health check</b> — the load balancer keeps sending traffic to a server that will refuse it.",
        "<b>Not calling `closeIdleConnections()`</b> — `server.close()` waits out keep-alive timeouts and your shutdown looks broken.",
        "<b>No forced-exit timeout</b> — one stuck request keeps a dying process alive indefinitely.",
        "<b>Forgetting `.unref()` on the force timer</b> — the timer itself holds the process open for the full duration.",
        "<b>A grace period longer than the platform's</b> — `SIGKILL` arrives mid-cleanup and you lose the requests anyway.",
        "<b>Closing the database before requests finish</b> — in-flight handlers fail at the last moment. Order matters.",
        "<b>Exiting non-zero on a normal shutdown</b> — your platform reads that as a crash and may start backing off restarts.",
        "<b>Only handling `SIGINT`</b> — production sends `SIGTERM`, so the path you tested is not the path that runs.",
      ],
      quiz: [
        {
          question: "Your graceful shutdown takes 5 seconds even with no requests in flight. Why?",
          options: [
            "`server.close()` always waits 5 seconds",
            "Idle HTTP keep-alive connections stay open, and `close()` waits for them",
            "The event loop is blocked",
            "`process.exit()` is being called too early",
          ],
          correctIndex: 1,
          explanation:
            "`close()` waits for every connection to close, and keep-alive connections sit open idle by design. `server.closeIdleConnections()` drops them immediately.",
        },
        {
          question: "Which shutdown step is most often skipped, and why does it matter most?",
          options: [
            "Closing the database, because connections leak",
            "Marking the instance unhealthy first, because the load balancer learns from a health check rather than the signal",
            "Flushing logs, because you lose the shutdown record",
            "Calling `process.exit()`, because the process hangs",
          ],
          correctIndex: 1,
          explanation:
            "Nothing tells your load balancer that a `SIGTERM` arrived. It finds out from the next health check, so failing that first and pausing briefly is what actually stops new traffic.",
        },
        {
          question: "Why call `.unref()` on the forced-shutdown timer?",
          options: [
            "To make it fire sooner",
            "So the timer itself does not keep the process alive after everything else has finished",
            "To allow it to be cancelled",
            "It is required for `setTimeout` in a signal handler",
          ],
          correctIndex: 1,
          explanation:
            "A pending timer counts as scheduled work and keeps the event loop alive. Without `.unref()`, a clean shutdown still sits there waiting out the full timeout.",
        },
      ],
    },
    {
      id: "process-introspection",
      title: "Looking at your own process",
      durationMinutes: 8,
      explanation:
        "Four small `process` APIs that turn up whenever you are diagnosing something.\n\n---\n\n## `process.memoryUsage()`\n\n<b>`process.memoryUsage()`</b> (memory currently used by the process).\n\n```javascript\nconsole.log(process.memoryUsage());\n```\n\n```text\n{\n  rss: ...,\n  heapTotal: ...,\n  heapUsed: ...,\n  external: ...,\n  arrayBuffers: ...\n}\n```\n\nThe three worth knowing:\n\n```text\nheapUsed\n    ↓\nJavaScript heap currently being used\n\nheapTotal\n    ↓\nJavaScript heap allocated\n\nrss\n    ↓\nTotal resident memory used by the process\n```\n\nUseful when investigating memory problems. The important habit: a single reading tells you almost nothing, because a heap between collections is expected to grow. <b>The trend is the signal.</b> Sample every few seconds and watch whether `heapUsed` returns to a baseline after each collection or keeps climbing.\n\nAnd watch `rss` against your container limit, because that is the number the platform kills you on. A container OOM kill gives you no Node error at all, just an exit code and a puzzling restart.\n\n---\n\n## `process.uptime()`\n\n<b>`process.uptime()`</b> (seconds this process has been running).\n\n```javascript\nconsole.log(process.uptime());\n```\n\n```text\n125.42\n```\n\nSmall but revealing. An uptime that keeps resetting to a few seconds means something is crash-looping, and that one number distinguishes \"the app is slow\" from \"the app is restarting constantly\". Worth exposing from a health endpoint.\n\n---\n\n## `process.cwd()`\n\n<b>`process.cwd()`</b> (the directory the process was started from).\n\n```javascript\nconsole.log(process.cwd());\n```\n\n```text\n/Users/rajan/projects/my-api\n```\n\nThe distinction that bites:\n\n```text\nprocess.cwd()\n    ↓\nWhere the process was started\n\nimport.meta.dirname\n    ↓\nWhere the current module is located\n```\n\nNot the same thing. `cwd()` changes depending on where someone typed `node`, which is why a relative `fs` path works locally and breaks in Docker or under a process manager. Anchor file paths to `import.meta.dirname`. Use `cwd()` only for things genuinely relative to the invocation, like a CLI argument.\n\n---\n\n## `process.hrtime.bigint()`\n\n<b>`process.hrtime.bigint()`</b> (a high-resolution timestamp for measuring elapsed time).\n\n```javascript\nconst start = process.hrtime.bigint();\n\ndoSomething();\n\nconst end = process.hrtime.bigint();\n\nconst duration = end - start;\n\nconsole.log(`${duration} nanoseconds`);\n```\n\nConverting:\n\n```javascript\nconst milliseconds = Number(duration) / 1_000_000;\n\nconsole.log(`${milliseconds}ms`);\n```\n\nUseful for precise timing. `performance.now()` is often more convenient, and both share the property that makes them correct for this job: they come from a <b>monotonic</b> clock.\n\n`Date.now()` does not. It can jump backwards when the system clock is adjusted, so a duration measured with it can come out negative. Never use `Date.now()` for elapsed time.\n\nOne gotcha: `hrtime.bigint()` returns a `BigInt`, so you cannot mix it with regular numbers. `duration / 1_000_000` throws; you need `Number(duration) / 1_000_000`.",
      diagram: `Memory: the trend is the signal

    a single reading                sampling over time
    heapUsed: 48MB                  48 → 52 → 41 → 55 → 44
        │                                    │
    means nothing.                  returns to a baseline
    a heap between                  after each GC  ✓ healthy
    collections is
    SUPPOSED to grow                48 → 61 → 74 → 88 → 103
                                             │
                                    never comes back  ✗ leak


    rss vs your container limit

    rss ──────────────────────► container memory limit
                                        │
                                   OOM kill
                                        │
                        no Node error, no stack, just an
                        exit code and a puzzling restart


cwd() vs import.meta.dirname

    cd /app        && node src/server.js   cwd = /app
    cd /app/src    && node server.js       cwd = /app/src

    same code, different cwd
        │
        └─► readFile("./data.json") looks in a different
            place depending on where someone typed node

    anchor to the MODULE instead:
      join(import.meta.dirname, "data.json")


Monotonic vs wall clock

    process.hrtime.bigint()   monotonic  ✓ for durations
    performance.now()         monotonic  ✓ for durations
    Date.now()                wall clock ✗ can jump BACKWARDS
                                           when the clock is
                                           adjusted, giving a
                                           negative duration`,
      codeExample: {
        title: "The four APIs, used the way they should be",
        code: `import { join } from "node:path";

// ── memoryUsage: sample it, do not read it once ─────────────
const mb = (bytes) => Math.round(bytes / 1024 / 1024);

setInterval(() => {
  const { rss, heapUsed, heapTotal } = process.memoryUsage();
  console.log(\`rss \${mb(rss)}MB  heap \${mb(heapUsed)}/\${mb(heapTotal)}MB\`);
}, 5000).unref();
//
// heapUsed sawtoothing back to a baseline  → healthy
// heapUsed climbing and never returning    → a leak
// rss approaching your container limit     → OOM kill,
//   which gives you no Node error at all


// ── uptime: is it slow, or is it crash-looping? ─────────────
console.log(\`up \${process.uptime().toFixed(1)}s\`);
//
// An uptime that keeps resetting to a few seconds is the
// clearest sign of a restart loop. Worth exposing here:
//
// if (req.url === "/health") {
//   res.end(JSON.stringify({
//     ok: true,
//     uptime: process.uptime(),
//     memory: mb(process.memoryUsage().heapUsed),
//   }));
// }


// ── cwd vs the module's own directory ───────────────────────
console.log("cwd:      ", process.cwd());          // where node ran
console.log("module:   ", import.meta.dirname);    // where this file is

// ✗ breaks when someone runs node from another folder,
//   which is exactly what Docker and process managers do
// const data = readFileSync("./data.json", "utf8");

// ✓ anchored to the file
const dataPath = join(import.meta.dirname, "data.json");


// ── hrtime.bigint: monotonic, and a BigInt ──────────────────
const start = process.hrtime.bigint();

let total = 0;
for (let i = 0; i < 1_000_000; i += 1) total += i;

const duration = start !== undefined ? process.hrtime.bigint() - start : 0n;

// const ms = duration / 1_000_000;          ✗ TypeError:
//   cannot mix BigInt and other types
const ms = Number(duration) / 1_000_000;  // ✓
console.log(\`\${duration} ns  =  \${ms.toFixed(3)}ms\`);


// ── Why not Date.now() for durations ────────────────────────
// const t0 = Date.now();
// ...
// const elapsed = Date.now() - t0;
//
// Date.now() reads the WALL CLOCK, which can be adjusted
// backwards by NTP. That makes elapsed negative. Use
// performance.now() or hrtime for anything you measure.`,
      },
      keyTakeaways: [
        "`process.memoryUsage()` gives `heapUsed`, `heapTotal` and `rss`, among others.",
        "A single memory reading means little. <b>The trend is the signal</b>: sample and watch whether it returns to a baseline.",
        "Watch `rss` against your container limit. An OOM kill produces no Node error, just a restart.",
        "`process.uptime()` distinguishes \"slow\" from \"crash-looping\". Expose it from a health endpoint.",
        "`process.cwd()` is where `node` was run. `import.meta.dirname` is where the file lives. They differ.",
        "Anchor file paths to `import.meta.dirname`. A relative `fs` path breaks under Docker and process managers.",
        "`process.hrtime.bigint()` and `performance.now()` are <b>monotonic</b>, which is what makes them correct for durations.",
        "`Date.now()` reads the wall clock and can jump backwards. Never use it for elapsed time.",
        "`hrtime.bigint()` returns a `BigInt`, so convert with `Number(duration)` before dividing.",
      ],
      commonMistakes: [
        "<b>Diagnosing a leak from one memory reading</b> — a heap between collections is meant to be growing. Sample over time.",
        "<b>Watching only `heapUsed` when the container limit is on `rss`</b> — buffers and native memory count too, and the OOM kill is silent.",
        "<b>Using a relative path with `fs`</b> — it resolves against `cwd()`, so it breaks the moment the process starts elsewhere.",
        "<b>Confusing `cwd()` with the module directory</b> — they happen to match while you develop, which is what makes this bite in production.",
        "<b>Measuring durations with `Date.now()`</b> — a clock adjustment can make the result negative.",
        "<b>Dividing a `BigInt` by a number</b> — `duration / 1_000_000` throws. Convert first.",
        "<b>Leaving a memory-logging `setInterval` un-`unref()`ed</b> — it keeps the process alive during shutdown.",
      ],
      quiz: [
        {
          question: "You read `process.memoryUsage().heapUsed` once and it looks high. What can you conclude?",
          options: [
            "There is a memory leak",
            "Almost nothing, since a heap between garbage collections is expected to grow",
            "The process is about to crash",
            "`heapTotal` must be higher",
          ],
          correctIndex: 1,
          explanation:
            "A single sample cannot distinguish normal growth before a collection from a leak. Sample over time and check whether it returns to a baseline or keeps climbing.",
        },
        {
          question: "Why should you avoid `Date.now()` for measuring how long an operation took?",
          options: [
            "It is slower to call",
            "It reads the wall clock, which can be adjusted backwards, making the duration negative",
            "It only has second precision",
            "It is deprecated",
          ],
          correctIndex: 1,
          explanation:
            "`Date.now()` tracks calendar time, so an NTP adjustment can move it backwards mid-measurement. `performance.now()` and `process.hrtime.bigint()` are monotonic and cannot.",
        },
        {
          question: "`readFileSync(\"./data.json\")` works locally but fails in Docker. What is the likely cause?",
          options: [
            "The file was not copied into the image",
            "The path resolves against `process.cwd()`, which differs from where the module lives",
            "`readFileSync` is unavailable in containers",
            "The encoding argument is missing",
          ],
          correctIndex: 1,
          explanation:
            "`fs` paths resolve against the working directory, not the file. Locally those often coincide, which is why this surfaces only once something else starts the process. Anchor to `import.meta.dirname`.",
        },
      ],
    },
    {
      id: "async-context",
      title: "AsyncLocalStorage and diagnostics_channel",
      durationMinutes: 12,
      explanation:
        "Two advanced APIs. One you will genuinely use, one you should recognise.\n\n---\n\n## `AsyncLocalStorage`\n\n<b>`AsyncLocalStorage`</b> (keeps context attached to an asynchronous execution chain).\n\nAn API receives:\n\n```text\nRequest 1\nrequestId = abc123\n\nRequest 2\nrequestId = xyz789\n```\n\nAnd your code calls through layers:\n\n```text\nRequest\n ↓\nController\n ↓\nService\n ↓\nDatabase\n ↓\nLogger\n```\n\nYou want every layer to know `requestId = abc123` without passing it by hand:\n\n```javascript\nservice(requestId);\ndatabase(requestId);\nlogger(requestId);\n```\n\nA plain module-level variable cannot do this. With many requests interleaved on one thread, whatever you stored last wins, and request 1's logs get request 2's id. `AsyncLocalStorage` is the answer, and it is the only correct one.\n\n---\n\n## The API\n\n```javascript\nimport { AsyncLocalStorage } from \"node:async_hooks\";\n\nconst storage = new AsyncLocalStorage();\n```\n\nWhen a request begins:\n\n```javascript\nstorage.run(\n  { requestId: \"abc123\" },\n  async () => {\n    await doSomething();\n\n    console.log(storage.getStore());\n  }\n);\n```\n\nAnywhere in that async chain:\n\n```javascript\nconsole.log(storage.getStore());\n```\n\n```javascript\n{\n  requestId: \"abc123\"\n}\n```\n\nThe store follows the chain through every `await`, timer and callback, without being passed anywhere.\n\n---\n\n## Why this is useful\n\nThe common case is <b>request tracing</b>:\n\n```text\nRequest\nrequestId = abc123\n     ↓\nController\n     ↓\nService\n     ↓\nDatabase\n     ↓\nLogger\n```\n\nYour logger can include it automatically:\n\n```text\n[abc123] User lookup started\n[abc123] Database query started\n[abc123] User lookup finished\n```\n\nwithout threading `requestId` through every function.\n\nOther uses:\n\n```text\nRequest ID\nCorrelation ID\nTracing\nLogging context\nTenant ID\nTransaction context\n```\n\nThe payoff shows up the first time you debug production. Instead of interleaved lines from fifty concurrent requests, you filter by one id and read a single request's story start to finish. That is usually the difference between finding a bug in minutes and not finding it.\n\nTwo practical notes. Wrap the whole request in `run()` at the very edge, in middleware, so everything downstream is covered. And `getStore()` returns `undefined` outside any `run()`, so read it defensively: `getStore()?.requestId ?? \"-\"`.\n\nA word on cost: it is not free, since Node has to track context across async boundaries. For per-request tracing that trade is well worth it. It is not the place for large objects or hot-path data.\n\n---\n\n## `diagnostics_channel`\n\n<b>`diagnostics_channel`</b> (an API for publishing and subscribing to diagnostic information inside an application or library).\n\n```javascript\nimport diagnostics_channel from \"node:diagnostics_channel\";\n```\n\n```javascript\nconst channel = diagnostics_channel.channel(\"my-app.requests\");\n```\n\nPublishing:\n\n```javascript\nchannel.publish({\n  method: \"GET\",\n  path: \"/users\",\n});\n```\n\nSubscribing:\n\n```javascript\nchannel.subscribe(message => {\n  console.log(\"Request:\", message);\n});\n```\n\n```text\nApplication\n     ↓\nDiagnostic event\n     ↓\nChannel\n     ↓\nInstrumentation / monitoring\n```\n\n---\n\n## Why it is useful\n\n* Instrumentation\n* Observability\n* Performance monitoring\n* Debugging\n* Application telemetry\n\n<b>Instrumentation</b> (adding code that observes what an application is doing).\n\n```text\nHTTP request\n     ↓\ndiagnostics_channel\n     ↓\nMonitoring system\n     ↓\nMetrics / traces\n```\n\nThe design property that makes it interesting: publishing is <b>nearly free when nobody is listening</b>. `channel.hasSubscribers` lets you skip building the message entirely, so you can leave instrumentation points in production code permanently at no cost.\n\nIt also decouples the two sides. A library can publish events without depending on any monitoring tool, and an APM agent can subscribe without patching the library's internals. Node core and several major libraries already publish on well-known channels, which is how your tracing tool knows about your HTTP requests without you writing anything.\n\nYou will not reach for this every day, but recognising it explains how observability tooling attaches to a Node application.\n\n---\n\n## The complete mental model\n\n```text\n                    Node.js Process\n                          │\n             ┌────────────┼────────────┐\n             ↓            ↓            ↓\n          JavaScript    Async I/O    Timers\n             │\n             ↓\n         Event Loop\n             │\n             ↓\n         Application\n             │\n      ┌──────┴───────┐\n      ↓              ↓\n   Success         Error\n                      │\n             ┌────────┴────────┐\n             ↓                 ↓\n        Operational       Programmer\n           error             error\n             ↓                 ↓\n          Handle          Fix / crash\n```\n\nAnd when the process needs to stop:\n\n```text\nSIGTERM\n   ↓\nStop accepting new work\n   ↓\nFinish in-flight requests\n   ↓\nClose DB / Redis / queues\n   ↓\nExit\n```\n\n> <b>The production mindset:</b> an error is not just something to `console.log()`. You decide whether the application can safely continue, how the failure is observed, and how the process shuts down without losing work.",
      diagram: `Why a module variable cannot do this

    let currentRequestId                  ✗ BROKEN

    req A arrives  → currentRequestId = "abc"
    req A awaits db
    req B arrives  → currentRequestId = "xyz"   ← overwritten
    req A resumes  → logs "xyz"                 ← wrong request

    one thread, interleaved requests, last write wins


AsyncLocalStorage follows the chain

    storage.run({ requestId: "abc" }, async () => {
      │
      ├── controller()        getStore() → { requestId: "abc" }
      │     ├── await service()
      │     │     └── await db.query()
      │     │           └── logger.info()   still "abc"
      │     └── setTimeout(cleanup)          still "abc"
      └──
    })

    through every await, timer and callback,
    passed nowhere


The payoff, the first time you debug production

    without                          with
    [db] query started               [abc] request started
    [db] query started               [abc] db query started
    [http] 200                       [abc] db query 12ms
    [db] query failed                [abc] 200 in 34ms
    [http] 500                       └─ filter by one id and
    └─ which request?                   read one story


diagnostics_channel decouples the two sides

    your library                      an APM agent
        │                                  │
    channel.publish(msg) ──► channel ──► channel.subscribe(fn)
        │                                  │
    no dependency on any              no patching of your
    monitoring tool                   internals

    and nearly FREE when nobody listens:

    if (channel.hasSubscribers) {
      channel.publish(buildExpensiveMessage())
    }
    └─ leave instrumentation in production permanently`,
      codeExample: {
        title: "Request tracing with AsyncLocalStorage",
        code: `import { AsyncLocalStorage } from "node:async_hooks";
import diagnostics_channel from "node:diagnostics_channel";
import http from "node:http";
import { randomUUID } from "node:crypto";

const storage = new AsyncLocalStorage();

// ── A logger that reads the context itself ──────────────────
function log(message) {
  const id = storage.getStore()?.requestId ?? "-";   // defensive:
  console.log(\`[\${id}] \${message}\`);                 // undefined
}                                                     // outside run()


// ── Wrap the whole request, at the very edge ────────────────
const server = http.createServer((req, res) => {
  const requestId = req.headers["x-request-id"] ?? randomUUID().slice(0, 6);

  storage.run({ requestId, startedAt: performance.now() }, async () => {
    log("request started");

    await handle(req, res);

    const { startedAt } = storage.getStore();
    log(\`finished in \${Math.round(performance.now() - startedAt)}ms\`);
  });
});


// ── Nothing below is passed the requestId ───────────────────
async function handle(req, res) {
  const user = await loadUser(1);
  res.end(JSON.stringify(user));
}

async function loadUser(id) {
  log("db query started");                  // still knows the id
  await new Promise((r) => setTimeout(r, 20));
  log("db query finished");                 // through the timer too
  return { id, name: "Rajan" };
}

server.listen(3000);

// [a3f9c1] request started
// [a3f9c1] db query started
// [a3f9c1] db query finished
// [a3f9c1] finished in 23ms
//
// Fifty concurrent requests stay separate. Filter by one id
// and read a single request's story start to finish.


// ── What a module variable would do instead ─────────────────
// let currentRequestId;
//
// req A → currentRequestId = "abc"
// req A awaits the db
// req B → currentRequestId = "xyz"      ← overwritten
// req A resumes, logs "xyz"             ← wrong request
//
// One thread with interleaved requests. Last write wins.


// ── diagnostics_channel: publish, subscribe, decoupled ──────
const channel = diagnostics_channel.channel("my-app.requests");

// the monitoring side
channel.subscribe((message) => {
  console.log("[metrics]", message.method, message.path, message.ms);
});

// the application side
function record(method, path, ms) {
  if (!channel.hasSubscribers) return;      // nearly free when
  channel.publish({ method, path, ms });    // nobody is listening
}

record("GET", "/users", 23);
// [metrics] GET /users 23
//
// Your code does not know what is listening, and the listener
// does not patch your internals. This is how APM agents attach
// to Node core and popular libraries without you writing
// anything.`,
      },
      keyTakeaways: [
        "`AsyncLocalStorage` keeps a value attached to an async execution chain.",
        "A module-level variable <b>cannot</b> do this: interleaved requests overwrite each other, so request A logs request B's id.",
        "`storage.run(store, callback)` starts the context. `storage.getStore()` reads it anywhere downstream.",
        "The store survives every `await`, timer and callback, without being passed to anything.",
        "The main use is <b>request tracing</b>: a logger that includes the request id on its own.",
        "The payoff is debugging production: filter by one id and read one request's story instead of interleaved noise.",
        "Wrap the request at the very edge, in middleware, so everything downstream is covered.",
        "`getStore()` returns `undefined` outside a `run()`. Read it as `getStore()?.requestId ?? \"-\"`.",
        "It is not free. Good for per-request context, not for large objects or hot-path data.",
        "`diagnostics_channel` publishes diagnostic events that anything can subscribe to.",
        "`channel.hasSubscribers` makes publishing nearly free, so instrumentation can stay in production permanently.",
        "It decouples both sides: libraries publish without depending on a tool, and agents subscribe without patching internals.",
      ],
      commonMistakes: [
        "<b>Using a module-level variable for request context</b> — it works with one request at a time and breaks silently under any concurrency.",
        "<b>Calling `getStore()` outside a `run()`</b> — it returns `undefined`, so read it defensively.",
        "<b>Starting `run()` deep in a service</b> — anything above it has no context. Wrap at the edge.",
        "<b>Storing large objects in the store</b> — it is per-request context, not a cache.",
        "<b>Mutating the store expecting callers to see it</b> — treat it as read-mostly, and put mutable state in a field you control.",
        "<b>Building the diagnostics message before checking `hasSubscribers`</b> — you pay the cost even when nothing listens.",
        "<b>Treating `diagnostics_channel` as a logging system</b> — it is for instrumentation that monitoring tools consume.",
      ],
      quiz: [
        {
          question: "Why can a module-level `let currentRequestId` not replace `AsyncLocalStorage`?",
          options: [
            "Module variables are read-only",
            "Concurrent requests interleave on one thread, so each new request overwrites the value the earlier one still needs",
            "It would leak memory",
            "`let` is not allowed at module scope",
          ],
          correctIndex: 1,
          explanation:
            "While request A is awaiting, request B arrives and overwrites the variable. When A resumes it reads B's id. `AsyncLocalStorage` keeps a separate store per async chain.",
        },
        {
          question: "Where should you call `storage.run()` for request tracing?",
          options: [
            "Inside each service function",
            "At the very edge of the request, in middleware, so everything downstream inherits the context",
            "In the logger",
            "Once at application startup",
          ],
          correctIndex: 1,
          explanation:
            "Only code inside the `run()` callback can see the store. Wrapping at the edge means every controller, service and query below it inherits the context for free.",
        },
        {
          question: "What does `channel.hasSubscribers` let you avoid?",
          options: [
            "Registering duplicate subscribers",
            "Building the message payload when nothing is listening",
            "Publishing to the wrong channel",
            "Memory leaks in the channel",
          ],
          correctIndex: 1,
          explanation:
            "Guarding on it means an unobserved instrumentation point costs almost nothing, which is what makes it safe to leave these calls in production code permanently.",
        },
      ],
    },
  ],
  finalQuiz: [
    {
      question: "Which question best decides whether to handle an error or let the process die?",
      options: [
        "Is it a TypeError?",
        "Do I know what state the application is in?",
        "Was it thrown inside a try block?",
        "Did it come from a dependency?",
      ],
      correctIndex: 1,
      explanation:
        "A failed network call leaves your state intact, so handle it. A broken assumption means you no longer know what else is wrong, which is why an unexpected error argues for restarting.",
    },
    {
      question: "You add `process.on(\"uncaughtException\", err => logger.error(err))` and nothing else. What have you done?",
      options: [
        "Improved logging with no other effect",
        "Disabled Node's default exit, so the process continues after a stack was abandoned mid-execution",
        "Made all errors recoverable",
        "Changed only the exit code",
      ],
      correctIndex: 1,
      explanation:
        "Registering the handler replaces the default termination. Without an explicit exit you have re-created the silent-failure behaviour Node deliberately moved away from.",
    },
    {
      question: "Why does `throw new Error(\"Failed to load users\", { cause: dbError })` beat both alternatives?",
      options: [
        "It is faster to serialise",
        "It keeps what you were doing and why it failed, where re-throwing loses one and replacing loses the other",
        "It prevents propagation",
        "It sets the status code automatically",
      ],
      correctIndex: 1,
      explanation:
        "The raw error says why but not which operation. A fresh error says which operation but not why. `cause` keeps both layers of the chain.",
    },
    {
      question: "Which shutdown step is most often skipped, and why does it matter most?",
      options: [
        "Flushing logs, because you lose the shutdown record",
        "Failing the health check first, because the load balancer learns you are leaving from a health check, not from the signal",
        "Closing the database, because connections leak",
        "Setting the exit code, because the platform cannot tell",
      ],
      correctIndex: 1,
      explanation:
        "Nothing tells your load balancer that a `SIGTERM` arrived. Marking yourself unhealthy and pausing briefly is what actually stops new traffic arriving at a closing server.",
    },
    {
      question: "Your graceful shutdown takes seconds even with no requests in flight. Why?",
      options: [
        "`process.exit()` is being called too late",
        "Idle keep-alive connections stay open and `server.close()` waits for them",
        "The event loop is blocked",
        "The forced-exit timer is not `unref()`ed",
      ],
      correctIndex: 1,
      explanation:
        "`close()` waits for every connection to close, and keep-alive connections sit open idle by design. `server.closeIdleConnections()` drops them straight away.",
    },
    {
      question: "Kubernetes has `terminationGracePeriodSeconds: 30`. What should your own shutdown timeout be?",
      options: [
        "Exactly 30 seconds",
        "Comfortably under 30 seconds",
        "45 seconds, for safety",
        "Unlimited, since SIGKILL waits",
      ],
      correctIndex: 1,
      explanation:
        "After the grace period an uncatchable `SIGKILL` arrives. A timeout at or above it means the platform terminates you mid-cleanup, which is the abrupt shutdown you were avoiding.",
    },
    {
      question: "Why can a module-level variable not hold a per-request id?",
      options: [
        "Module variables cannot be reassigned",
        "Concurrent requests interleave on one thread, so a later request overwrites the value an earlier one still needs",
        "It would be garbage collected",
        "It works fine, `AsyncLocalStorage` is only an optimisation",
      ],
      correctIndex: 1,
      explanation:
        "While one request awaits, another arrives and overwrites the variable. The first then logs the wrong id. `AsyncLocalStorage` keeps a store per async chain.",
    },
    {
      question: "What is the difference between `process.exitCode = 1` and `process.exit(1)`?",
      options: [
        "None",
        "`exitCode` lets pending work and buffered output finish; `exit()` is immediate and can truncate the log explaining the failure",
        "`exit()` is graceful",
        "`exitCode` only works with signals",
      ],
      correctIndex: 1,
      explanation:
        "Setting `exitCode` records the verdict and lets the process wind down normally. Calling `exit()` stops right away, which is how you lose the very output you need.",
    },
  ],
  project: {
    name: "day-04",
    goal: "Build an HTTP server that survives SIGTERM: stop accepting new requests, let in-flight ones finish, then shut down cleanly.",
    brief:
      "The test is whether a five-second request survives a SIGTERM sent one second in. If it does, you have the thing that stops every deploy from dropping requests. Watch for the keep-alive gotcha: without `closeIdleConnections()`, your shutdown will appear to hang even with nothing in flight, and it looks like a bug in your handler when it is not.",
    steps: [
      "Create `day-04/server.js` with `\"type\": \"module\"` in `package.json`.",
      "Build an `http.createServer` that responds `Hello` on `/` and takes five seconds to respond on `/slow`.",
      "Register a `SIGTERM` handler that calls `server.close(...)` and then `process.exit(0)` from the callback.",
      "Start the server, `curl localhost:3000/slow &`, then send `kill -TERM <pid>` about a second later.",
      "Confirm the `/slow` request still completes and the process exits after it, rather than dying immediately.",
      "Add `server.closeIdleConnections()` right after `server.close()` and notice shutdown stops hanging when nothing is in flight.",
      "Handle `SIGINT` with the same function, and check that Ctrl+C now runs your graceful path.",
    ],
    acceptance: [
      "A `/slow` request in flight when `SIGTERM` arrives finishes normally and returns its full response.",
      "A new request that arrives after `SIGTERM` is not accepted.",
      "The process exits by itself once the last request completes, with code 0.",
      "Shutdown logs read in order: `SIGTERM received`, `Stopping server...`, `Waiting for active requests...`, `All requests finished`, `Server closed`, `Process exiting`.",
      "A shutdown that exceeds ten seconds forces an exit with a non-zero code.",
      "An `activeRequests` counter increments per request, decrements on completion, and its value is printed during shutdown.",
      "Every request gets a unique `requestId` via `AsyncLocalStorage`, and the handler logs `[abc123] Request started` / `Processing` / `Request finished` without passing the id to any function.",
      "Ctrl+C runs the same graceful path as `SIGTERM`.",
    ],
    stretch: [
      "Add a `/health` endpoint that returns 503 once shutdown starts, and pause a second after failing it before calling `server.close()`.",
      "Guard against a second signal: the first starts a graceful shutdown, the second forces an immediate exit.",
      "Add a custom `AppError` base class with `statusCode` and `isOperational`, then a top-level handler that returns the message for operational errors and a generic 500 for anything else.",
      "Register `unhandledRejection` and `uncaughtException` handlers that log the error and then run the same shutdown, exiting non-zero.",
      "Log `process.memoryUsage().heapUsed` and `process.uptime()` from the health endpoint, and time each request with `performance.now()`.",
    ],
  },
};
