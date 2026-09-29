import type { LessonDay } from "@/lib/learn/lesson-types";

export const NODEJS_DAY_1_LESSONS: LessonDay = {
  day: 1,
  title: "Node.js Backend Fundamentals",
  totalMinutes: 150,
  difficulty: "Beginner",

  lessons: [
    {
      id: "nodejs-runtime",
      title: "What is Node.js?",
      durationMinutes: 18,

      explanation: `
Node.js lets you run JavaScript <b>outside of a web browser</b>.

If you have only used JavaScript in a browser, you may have written code like this:

\`\`\`js
console.log("Hello");
document.querySelector("button");
\`\`\`

The browser provides things such as buttons, HTML elements, the DOM, and \`window\`.

But backend programs need to do different things.

A backend program may need to:

- Read a file from the computer.
- Connect to a database.
- Receive HTTP requests.
- Send HTTP responses.
- Work with environment variables.
- Create a web server.
- Communicate with another API.
- Work with operating-system features.

Node.js provides an environment where JavaScript can do these kinds of backend tasks.

<b>Very important:</b> Node.js is not a programming language.

JavaScript is the programming language.

Node.js is the runtime environment that allows JavaScript to run outside the browser and provides additional APIs for backend work.

Think about it like this:

<b>JavaScript = the language you speak.</b>

<b>Node.js = the environment where you can use that language for backend work.</b>

When you run:

\`\`\`bash
node app.js
\`\`\`

you are asking the Node.js program to start, load your JavaScript file, and execute the code inside it.

A simple Node.js program can be:

\`\`\`js
console.log("Hello from Node.js!");
\`\`\`

Save this as \`app.js\`.

Then run:

\`\`\`bash
node app.js
\`\`\`

You should see:

\`\`\`
Hello from Node.js!
\`\`\`

That is your first important idea:

<b>Node.js allows JavaScript to run as a standalone program.</b>

---

### What happens when Node.js starts?

When you run:

\`\`\`bash
node app.js
\`\`\`

a simplified version of what happens is:

1. The Node.js program starts.
2. Node.js loads your JavaScript file.
3. The V8 JavaScript engine executes your JavaScript.
4. Node.js provides APIs such as file-system and networking APIs.
5. Node.js continues running while there is work to do.

You will learn about V8, the event loop, and asynchronous work in the next lessons.

For now, remember this simple picture:

\`\`\`
Your JavaScript code
        |
        v
     Node.js
        |
        +---- V8 executes JavaScript
        |
        +---- Node.js APIs
        |       |
        |       +---- Files
        |       +---- HTTP
        |       +---- Processes
        |       +---- Streams
        |
        v
   Your backend program
\`\`\`

---

### Browser JavaScript vs Node.js

The same JavaScript language can be used in different environments.

For example:

Browser:

\`\`\`js
document.querySelector("h1");
\`\`\`

Node.js:

\`\`\`js
import { readFile } from "node:fs";
\`\`\`

The first example uses a browser API.

The second example uses a Node.js API for working with files.

So JavaScript itself did not change.

The environment changed.

This is a very important concept for backend development.

---

### Why is Node.js useful for backend development?

Imagine you are building a website.

A user clicks:

"Show my profile."

The browser sends a request to your backend.

Your Node.js server can receive that request, look up the user's information, and send a response.

A simplified flow looks like this:

\`\`\`
User's browser
      |
      | HTTP request
      v
Node.js backend
      |
      | database query
      v
Database
      |
      | user data
      v
Node.js backend
      |
      | HTTP response
      v
User's browser
\`\`\`

Node.js is one of the tools that can sit in the middle and handle this backend work.

---

### A simple mental model

Think of Node.js as a workshop.

JavaScript is the language used by the workers.

V8 is the part that understands and executes the JavaScript.

Node.js APIs are the tools available in the workshop.

Your application is the thing you are building.

So:

<b>JavaScript + V8 + Node.js APIs + runtime infrastructure = Node.js application environment.</b>
`,

      diagram: `
JavaScript code
      |
      v
  Node.js runtime
      |
      +---- V8
      |      |
      |      +---- Executes JavaScript
      |
      +---- Node.js APIs
      |      |
      |      +---- Files
      |      +---- HTTP
      |      +---- Processes
      |      +---- Streams
      |
      +---- Runtime infrastructure
             |
             +---- Event loop
             +---- Asynchronous I/O
`,

      codeExample: {
        title: "Your first Node.js program",
        code: `console.log("Hello from Node.js!");

const name = "Alice";

console.log("Welcome, " + name);`,
      },

      keyTakeaways: [
        "Node.js lets you run JavaScript outside the browser.",
        "JavaScript is the language; Node.js is the runtime environment.",
        "Node.js provides APIs for backend tasks such as files, networking, and processes.",
        "Node.js uses the V8 JavaScript engine.",
        "A Node.js program can be a server, command-line application, background worker, or many other types of program.",
      ],

      commonMistakes: [
        "<b>Thinking Node.js is a programming language.</b> JavaScript is the language. Node.js is the runtime.",
        "<b>Thinking Node.js is a browser.</b> Node.js does not automatically provide browser features such as the DOM.",
        "<b>Thinking Node.js is only for web servers.</b> Node.js can also be used for scripts, command-line programs, workers, tools, and many other applications.",
      ],

      quiz: [
        {
          question: "What is Node.js?",
          options: [
            "A programming language",
            "A JavaScript runtime",
            "A database",
            "A web browser",
          ],
          correctIndex: 1,
          explanation:
            "Node.js is a runtime environment that allows JavaScript to run outside the browser.",
        },
        {
          question: "Which statement is correct?",
          options: [
            "JavaScript and Node.js are the same thing",
            "Node.js replaces JavaScript",
            "JavaScript is the language and Node.js is a runtime",
            "Node.js is a database",
          ],
          correctIndex: 2,
          explanation:
            "JavaScript is the programming language. Node.js provides an environment in which JavaScript can run outside the browser.",
        },
      ],
    },

    {
      id: "v8-engine",
      title: "V8: The JavaScript Engine",
      durationMinutes: 15,

      explanation: `
You now know that Node.js runs JavaScript.

But there is another important question:

<b>Who actually executes the JavaScript?</b>

The answer is <b>V8</b>.

V8 is a JavaScript engine created by Google.

A JavaScript engine is software that understands JavaScript code and executes it.

You can think of V8 as the part of the system that takes JavaScript instructions and makes the computer perform those instructions.

For example:

\`\`\`js
const a = 10;
const b = 20;

const result = a + b;

console.log(result);
\`\`\`

V8 is responsible for executing the JavaScript instructions involved in this code.

---

### JavaScript engine vs runtime

This distinction is extremely important.

<b>V8 is not Node.js.</b>

V8 is one major component used by Node.js.

A simplified picture is:

\`\`\`
             Node.js
                |
        +-------+-------+
        |               |
        v               v
       V8          Node.js APIs
        |               |
        |               +---- fs
        |               +---- http
        |               +---- path
        |               +---- process
        |
        v
 Executes JavaScript
\`\`\`

V8 knows how to execute JavaScript.

Node.js adds useful capabilities around it.

For example:

\`\`\`js
console.log("Hello");
\`\`\`

This is JavaScript that V8 can execute.

But something like:

\`\`\`js
import { readFile } from "node:fs";
\`\`\`

uses a Node.js API for accessing the file system.

V8 itself is not a complete operating-system API.

---

### Why do we need an engine?

Computers ultimately execute low-level machine instructions.

Humans, however, can write much more convenient code such as:

\`\`\`js
const total = price * quantity;
\`\`\`

A JavaScript engine is responsible for taking JavaScript and executing it.

Modern JavaScript engines perform many sophisticated optimizations.

For a beginner, you do not need to understand every optimization.

Just remember:

<b>V8 is the engine that executes JavaScript in Node.js.</b>

---

### V8 is also used outside Node.js

V8 is most famous for being used by Google Chrome and Node.js.

This is another useful lesson:

A JavaScript engine and a JavaScript runtime are not necessarily the same thing.

Different runtimes can use the same engine while providing different APIs.

That means JavaScript can run in different environments with different capabilities.

---

### Simple mental model

Imagine an engine inside a car.

The engine does important work, but the engine is not the entire car.

Similarly:

<b>V8 is an important engine inside Node.js, but Node.js is larger than V8.</b>
`,

      diagram: `
Your JavaScript
      |
      v
     V8
      |
      +---- Understand JavaScript
      +---- Execute JavaScript
      +---- Optimize JavaScript
      |
      v
 JavaScript execution

        +

 Node.js runtime APIs
      |
      +---- fs
      +---- http
      +---- path
      +---- process
      +---- streams
`,

      codeExample: {
        title: "JavaScript executed by V8",
        code: `function add(a, b) {
  return a + b;
}

const result = add(10, 20);

console.log(result); // 30`,
      },

      keyTakeaways: [
        "V8 is a JavaScript engine.",
        "Node.js uses V8 to execute JavaScript.",
        "V8 is not the entire Node.js runtime.",
        "Node.js provides additional APIs around V8.",
        "Different JavaScript environments can use JavaScript engines and provide different APIs.",
      ],

      commonMistakes: [
        "<b>Thinking V8 and Node.js are identical.</b> V8 is an engine used by Node.js.",
        "<b>Thinking V8 provides every Node.js API.</b> APIs such as fs and http are part of the Node.js environment.",
        "<b>Thinking JavaScript runs without an engine.</b> JavaScript needs a runtime environment containing a JavaScript engine.",
      ],

      quiz: [
        {
          question: "What is V8?",
          options: [
            "A JavaScript engine",
            "A database",
            "A Node.js package manager",
            "An HTTP server",
          ],
          correctIndex: 0,
          explanation:
            "V8 is Google's JavaScript engine and is used by Node.js.",
        },
        {
          question: "Which statement is correct?",
          options: [
            "V8 is the entire Node.js runtime",
            "Node.js uses V8 and provides additional runtime APIs",
            "V8 is a database",
            "Node.js does not use a JavaScript engine",
          ],
          correctIndex: 1,
          explanation:
            "Node.js embeds V8 and adds APIs such as fs, http, streams, and process.",
        },
      ],
    },

    {
      id: "event-loop",
      title: "The Event Loop: How Node.js Handles Waiting",
      durationMinutes: 20,

      explanation: `
One of the most important Node.js concepts is the <b>event loop</b>.

You do not need to understand every internal detail on your first day.

The beginner-level idea is this:

<b>Node.js can start an operation, continue doing other work, and later handle the result when it is ready.</b>

This is especially useful for operations that involve waiting.

Examples include:

- Reading a file.
- Waiting for a network response.
- Waiting for a database response.
- Waiting for a timer.
- Receiving data from a network connection.

Imagine that your application asks the operating system:

"Please read this file."

Reading the file may take some time.

If JavaScript had to completely stop and wait every time this happened, a server could become slow and unresponsive.

Instead, Node.js can arrange for the operation to happen asynchronously.

When the result is ready, the relevant callback or continuation can be processed.

---

### A simple restaurant analogy

Imagine a restaurant with one waiter.

The waiter takes your order and gives it to the kitchen.

The waiter does not stand in the kitchen waiting for the food.

Instead, the waiter can:

1. Take another customer's order.
2. Serve another table.
3. Answer a question.
4. Come back when the kitchen says the food is ready.

The waiter represents the JavaScript execution flow.

The kitchen represents work that takes time.

The notification that the food is ready is similar to work becoming ready for the event loop to process.

This is only an analogy, but it gives you the right beginner mental model.

---

### A simple JavaScript example

Look at this:

\`\`\`js
console.log("1");

setTimeout(() => {
  console.log("3");
}, 0);

console.log("2");
\`\`\`

You might expect:

\`\`\`
1
3
2
\`\`\`

But the typical output is:

\`\`\`
1
2
3
\`\`\`

Why?

Because the first and third \`console.log()\` statements are synchronous.

They run immediately.

The timer callback is scheduled to run later.

So JavaScript first executes:

\`\`\`
console.log("1");
\`\`\`

Then it schedules the timer.

Then it executes:

\`\`\`
console.log("2");
\`\`\`

Only after the current synchronous work has completed can the timer callback run.

---

### What does "non-blocking" mean?

When Node.js documentation says an API is asynchronous or non-blocking, it generally means that the current JavaScript execution does not have to stop and wait for the operation to finish.

For example:

\`\`\`js
readFile("large-file.txt", callback);

console.log("Continue working");
\`\`\`

The program can continue to the second statement while the file operation is being handled.

Later, the callback can run when the file data is ready.

---

### Very important: async does not mean "everything happens at the same time"

This is a common beginner misunderstanding.

Node.js does not simply run unlimited JavaScript code simultaneously on one JavaScript execution thread.

Instead, Node.js coordinates asynchronous operations and decides when their callbacks can run.

Think:

<b>Start work → continue → work becomes ready → callback runs.</b>

---

### Why blocking is dangerous

Consider:

\`\`\`js
while (true) {
  // endless work
}
\`\`\`

This JavaScript never finishes.

The event loop cannot move on to process other JavaScript callbacks.

If this happened inside a server, other requests could be delayed.

This is why backend developers need to be careful with expensive synchronous operations.

---

### The main lesson

The event loop is one reason Node.js is well suited to applications that spend a lot of time waiting for I/O.

It allows Node.js to coordinate many pending operations without requiring your JavaScript code to sit idle while every operation finishes.
`,

      diagram: `
JavaScript
    |
    | Start asynchronous operation
    v
Node.js / runtime
    |
    | operation is being handled
    |
    v
JavaScript can continue
    |
    |
    v
Operation finishes
    |
    v
Callback becomes ready
    |
    v
Event loop
    |
    v
JavaScript callback runs
`,

      codeExample: {
        title: "Understanding asynchronous scheduling",
        code: `console.log("1");

setTimeout(() => {
  console.log("3");
}, 0);

console.log("2");

// Typical output:
// 1
// 2
// 3`,
      },

      keyTakeaways: [
        "The event loop helps Node.js coordinate asynchronous work.",
        "Node.js can continue JavaScript execution while certain I/O operations are waiting.",
        "Callbacks run when the runtime schedules them.",
        "setTimeout(..., 0) does not mean 'run immediately'.",
        "Long-running synchronous JavaScript can block other work.",
      ],

      commonMistakes: [
        "<b>Thinking setTimeout(..., 0) runs immediately.</b> The callback is scheduled for later.",
        "<b>Thinking asynchronous means unlimited simultaneous JavaScript.</b> The runtime still coordinates JavaScript execution.",
        "<b>Thinking await blocks the entire server.</b> await suspends the current async function; it does not automatically freeze unrelated runtime work.",
        "<b>Running expensive CPU-heavy loops inside request handlers.</b> Long synchronous work can prevent other callbacks from being processed promptly.",
      ],

      quiz: [
        {
          question: "Why does the timer callback run after the synchronous console.log calls?",
          options: [
            "Timers always run before normal JavaScript",
            "The timer callback is scheduled for later",
            "Node.js ignores timers",
            "console.log is asynchronous",
          ],
          correctIndex: 1,
          explanation:
            "The synchronous code finishes first. The timer callback is scheduled to run later.",
        },
        {
          question: "What can happen if JavaScript performs a very long synchronous operation?",
          options: [
            "The event loop cannot process other JavaScript callbacks during that time",
            "Node.js automatically creates unlimited JavaScript threads",
            "The operation becomes asynchronous automatically",
            "V8 shuts down",
          ],
          correctIndex: 0,
          explanation:
            "Long-running synchronous JavaScript can prevent the event loop from processing other callbacks.",
        },
      ],
    },

    {
      id: "libuv",
      title: "libuv: The Infrastructure Behind Async I/O",
      durationMinutes: 15,

      explanation: `
You have learned that the event loop helps Node.js coordinate asynchronous work.

Now we can introduce another important name:

<b>libuv</b>.

libuv is a library used by Node.js for important parts of its asynchronous I/O and event-loop infrastructure.

You do not normally call libuv directly when writing a Node.js application.

Instead, you use Node.js APIs.

For example:

\`\`\`js
readFile("notes.txt", callback);
\`\`\`

You are using a Node.js API.

Behind the scenes, Node.js and libuv help coordinate what happens next.

---

### Why does Node.js need libuv?

Operating systems are different.

Windows, Linux, and macOS have different operating-system APIs.

Node.js wants developers to have a consistent programming interface.

libuv helps provide cross-platform asynchronous I/O infrastructure.

A simplified flow looks like:

\`\`\`
Your JavaScript
      |
      v
Node.js API
      |
      v
    libuv
      |
      +---- Operating system
      |
      +---- Thread pool when appropriate
      |
      v
Operation completes
      |
      v
Event loop
      |
      v
Your JavaScript callback
\`\`\`

This diagram is simplified, but it gives you the important idea.

---

### What is the thread pool?

Some operations cannot simply be handed off to an operating-system asynchronous API in the same way as network operations.

For certain types of work, libuv can use a thread pool.

You may hear:

"Node.js is single-threaded."

That statement needs clarification.

Your normal JavaScript execution is primarily handled on the main JavaScript thread.

But Node.js can use other threads internally for certain tasks.

So saying:

"Node.js has only one thread"

is too simplistic.

A better beginner statement is:

<b>JavaScript execution is primarily coordinated on one main thread, while Node.js can use operating-system facilities and a thread pool for certain asynchronous work.</b>

---

### Event loop vs thread pool

These are not the same thing.

The event loop is responsible for coordinating when JavaScript callbacks can run.

The thread pool can perform certain operations away from the main JavaScript execution path.

Think of them as two different jobs:

<b>Event loop:</b>

"When is JavaScript ready to handle this result?"

<b>Thread pool:</b>

"Can this particular operation be performed on a worker thread?"

---

### Do you need to learn libuv deeply?

Not yet.

As a beginner, you mainly need to know:

- libuv is part of Node.js internals.
- It helps Node.js handle asynchronous I/O.
- It is closely related to the event loop.
- It can use a thread pool for certain operations.
- You normally interact with Node.js APIs rather than libuv directly.
`,

      diagram: `
Your code
   |
   v
Node.js API
   |
   v
 libuv
   |
   +----------------+
   |                |
   v                v
OS async I/O    Thread pool
   |                |
   +-------+--------+
           |
           v
     Operation ready
           |
           v
       Event loop
           |
           v
    JavaScript callback
`,

      codeExample: {
        title: "Asynchronous file reading",
        code: `import { readFile } from "node:fs";

readFile("notes.txt", "utf8", (error, data) => {
  if (error) {
    console.error("Could not read file:", error);
    return;
  }

  console.log(data);
});

console.log("The program can continue.");`,
      },

      keyTakeaways: [
        "libuv is an important part of Node.js asynchronous I/O infrastructure.",
        "libuv works with operating-system facilities and a thread pool where appropriate.",
        "The event loop and thread pool have different responsibilities.",
        "You normally use Node.js APIs instead of calling libuv directly.",
        "Saying Node.js is simply 'single-threaded' is an incomplete explanation.",
      ],

      commonMistakes: [
        "<b>Thinking libuv is the JavaScript engine.</b> V8 executes JavaScript; libuv helps with runtime I/O infrastructure.",
        "<b>Thinking every asynchronous operation uses the thread pool.</b> Some operations use operating-system asynchronous mechanisms.",
        "<b>Thinking the thread pool executes normal JavaScript callbacks.</b> JavaScript callbacks are executed by the JavaScript runtime.",
      ],

      quiz: [
        {
          question: "What is libuv associated with?",
          options: [
            "CSS rendering",
            "Asynchronous I/O and event-loop infrastructure",
            "React components",
            "SQL table design",
          ],
          correctIndex: 1,
          explanation:
            "libuv provides important infrastructure used by Node.js for asynchronous I/O and the event loop.",
        },
        {
          question: "Are the event loop and thread pool the same thing?",
          options: [
            "Yes",
            "No, they have different responsibilities",
            "Only on Windows",
            "Only when using TypeScript",
          ],
          correctIndex: 1,
          explanation:
            "The event loop coordinates callback execution, while the thread pool can handle certain operations away from the main JavaScript execution path.",
        },
      ],
    },

    {
      id: "promises",
      title: "Promises: Representing Future Results",
      durationMinutes: 16,

      explanation: `
A <b>Promise</b> is one of the most important ideas in modern JavaScript.

A Promise represents a value that you do not have yet but expect to receive later.

For example, imagine asking a restaurant:

"Please prepare my food."

You do not have the food immediately.

You have a request that will eventually result in:

- success: the food is ready
- failure: something went wrong

A Promise works similarly.

It represents the eventual result of an asynchronous operation.

---

### Promise states

A Promise has three important states:

<b>Pending</b>

The operation is still in progress.

<b>Fulfilled</b>

The operation succeeded and produced a result.

<b>Rejected</b>

The operation failed.

The flow looks like:

\`\`\`
             Promise
                |
             Pending
             /     \\
            /       \\
     success         failure
        |               |
        v               v
   Fulfilled        Rejected
\`\`\`

A Promise does not mean:

"This value is available right now."

It means:

"This operation has a result that will become available later."

---

### Creating a Promise

Here is a simple example:

\`\`\`js
function getUser() {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve("Alice");
    }, 1000);
  });
}
\`\`\`

The function returns a Promise immediately.

The string "Alice" is not returned immediately.

After one second, the Promise is fulfilled with "Alice".

---

### Using then()

You can use \`.then()\` to handle a successful result:

\`\`\`js
getUser().then((user) => {
  console.log(user);
});
\`\`\`

When the Promise is fulfilled, the callback runs.

---

### Handling errors

Promises can fail.

You can use \`.catch()\`:

\`\`\`js
getUser()
  .then((user) => {
    console.log(user);
  })
  .catch((error) => {
    console.error(error);
  });
\`\`\`

This gives you a way to handle failure.

---

### Why are Promises useful?

Promises make asynchronous operations easier to combine.

Imagine:

1. Get a user.
2. Get that user's orders.
3. Get product information.
4. Create a response.

Promises let you connect these operations together.

Later, async/await gives us an even easier way to read this code.

---

### Promise vs synchronous value

Compare these:

\`\`\`js
const name = "Alice";
\`\`\`

The value is already available.

But:

\`\`\`js
const user = getUser();
\`\`\`

If \`getUser()\` returns a Promise, then \`user\` is not the actual user.

It is a Promise representing the future user result.

This distinction is extremely important.
`,

      diagram: `
                 Promise
                    |
             +------+------+
             |             |
          Success        Failure
             |             |
             v             v
         Fulfilled      Rejected
             |             |
             v             v
          .then()       .catch()
`,

      codeExample: {
        title: "A simple Promise",
        code: `function getUser() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve("Alice");
    }, 500);
  });
}

getUser()
  .then((user) => {
    console.log("User:", user);
  })
  .catch((error) => {
    console.error("Failed:", error);
  });`,
      },

      keyTakeaways: [
        "A Promise represents the eventual result of an asynchronous operation.",
        "A Promise can be pending, fulfilled, or rejected.",
        "then() handles successful results.",
        "catch() handles rejected Promises.",
        "A Promise is not the same thing as the final value.",
      ],

      commonMistakes: [
        "<b>Thinking a Promise is the final value.</b> A Promise represents a value that may become available later.",
        "<b>Ignoring rejected Promises.</b> Failed asynchronous operations need appropriate error handling.",
        "<b>Forgetting to return Promises in chains.</b> Returning a Promise allows later steps to wait for it correctly.",
      ],

      quiz: [
        {
          question: "What does a pending Promise mean?",
          options: [
            "The operation has not finished yet",
            "The operation definitely failed",
            "The operation definitely succeeded",
            "The program has stopped",
          ],
          correctIndex: 0,
          explanation:
            "Pending means the Promise has not yet fulfilled or rejected.",
        },
        {
          question: "Which method is commonly used to handle Promise rejection?",
          options: [
            ".map()",
            ".catch()",
            ".push()",
            ".filter()",
          ],
          correctIndex: 1,
          explanation:
            "catch() is commonly used to handle rejected Promises.",
        },
      ],
    },

    {
      id: "async-await",
      title: "async/await: A Cleaner Way to Use Promises",
      durationMinutes: 16,

      explanation: `
Promises are useful, but long Promise chains can sometimes become difficult to read.

JavaScript provides another syntax called <b>async/await</b>.

async/await is built on top of Promises.

It does not remove Promises.

Instead, it gives you a cleaner way to work with them.

---

### The async keyword

When you put \`async\` before a function:

\`\`\`js
async function getData() {
  return "Hello";
}
\`\`\`

that function always returns a Promise.

Even though the function appears to return a string, the caller receives a Promise.

For example:

\`\`\`js
const result = getData();

console.log(result);
\`\`\`

The result is a Promise.

---

### The await keyword

Inside an async function, you can use \`await\`:

\`\`\`js
async function loadUser() {
  const user = await getUser();

  console.log(user);
}
\`\`\`

This means:

"Wait for this Promise to settle, then give me its result."

But there is an important detail:

<b>await does not freeze the entire Node.js process.</b>

It pauses the current async function while other work can continue.

---

### Think about await like a pause button

Imagine your function is following these instructions:

\`\`\`
1. Ask for user
2. Wait for user
3. Print user
4. Continue
\`\`\`

At step 2, the current async function waits for the Promise.

Other Node.js work can continue.

When the Promise settles, your function continues.

---

### Error handling with try/catch

A very common pattern is:

\`\`\`js
async function loadUser() {
  try {
    const user = await getUser();

    console.log(user);
  } catch (error) {
    console.error("Something failed:", error);
  }
}
\`\`\`

If the Promise is rejected, execution moves to the \`catch\` block.

---

### Promise syntax vs async/await

Promise style:

\`\`\`js
getUser()
  .then((user) => {
    console.log(user);
  })
  .catch((error) => {
    console.error(error);
  });
\`\`\`

async/await style:

\`\`\`js
async function loadUser() {
  try {
    const user = await getUser();

    console.log(user);
  } catch (error) {
    console.error(error);
  }
}
\`\`\`

Both are working with Promises.

The second style is often easier for beginners to read because it looks more like normal step-by-step code.
`,

      diagram: `
async function
      |
      v
  await Promise
      |
      +-------------------+
      |                   |
      v                   |
Promise pending           |
      |                   |
      | other Node.js     |
      | work can continue |
      |                   |
      +-------------------+
               |
               v
       Promise settles
               |
               v
      async function continues
`,

      codeExample: {
        title: "Using async/await",
        code: `async function loadUser() {
  try {
    const user = await getUser();

    console.log("User:", user);
  } catch (error) {
    console.error("Failed:", error);
  }
}

loadUser();`,
      },

      keyTakeaways: [
        "async/await is built on top of Promises.",
        "An async function always returns a Promise.",
        "await waits for a Promise inside the current async function.",
        "await does not freeze the entire Node.js process.",
        "try/catch is commonly used to handle errors from awaited Promises.",
      ],

      commonMistakes: [
        "<b>Thinking async functions return normal values directly.</b> They always return Promises.",
        "<b>Thinking await blocks the entire server.</b> It pauses the current async function while other work can continue.",
        "<b>Forgetting error handling.</b> Rejected Promises should be handled or intentionally allowed to propagate.",
      ],

      quiz: [
        {
          question: "What does an async function always return?",
          options: [
            "A Promise",
            "A string",
            "A callback",
            "A Buffer",
          ],
          correctIndex: 0,
          explanation:
            "Every async function returns a Promise.",
        },
        {
          question: "What does await do?",
          options: [
            "Stops the entire Node.js process",
            "Waits for a Promise inside the current async function",
            "Creates a database",
            "Starts a new JavaScript runtime",
          ],
          correctIndex: 1,
          explanation:
            "await suspends the current async function until the awaited Promise settles.",
        },
      ],
    },

    {
      id: "event-emitters",
      title: "EventEmitter: Reacting to Events",
      durationMinutes: 14,

      explanation: `
Node.js uses an <b>event-driven</b> style in many places.

An event is simply something that happened.

Examples:

- A user registered.
- A file finished loading.
- A connection was opened.
- A message arrived.
- A request was received.

An <b>EventEmitter</b> allows one part of your program to announce that something happened while other parts of the program listen for that event.

Node.js provides EventEmitter through the \`node:events\` module.

---

### on()

The \`on()\` method registers a listener.

For example:

\`\`\`js
bus.on("message", () => {
  console.log("A message arrived");
});
\`\`\`

This means:

"When the message event happens, run this function."

---

### emit()

The \`emit()\` method announces that an event happened.

\`\`\`js
bus.emit("message");
\`\`\`

Now the listener registered for "message" can run.

---

### Complete example

\`\`\`js
import { EventEmitter } from "node:events";

const bus = new EventEmitter();

bus.on("message", (text) => {
  console.log("Received:", text);
});

bus.emit("message", "Hello!");
\`\`\`

The flow is:

\`\`\`
emit("message", "Hello!")
             |
             v
       EventEmitter
             |
             v
     registered listener
             |
             v
      console.log(...)
\`\`\`

---

### Why is this useful?

Imagine an application where a user creates an account.

Several things might need to happen:

- Save the user.
- Send a welcome email.
- Record analytics.
- Write a log.

Instead of putting every operation into one giant function, your application could emit:

\`\`\`
"userRegistered"
\`\`\`

Different listeners can respond.

This can make systems easier to organize.

---

### EventEmitter vs Promise

A Promise usually represents one eventual result.

For example:

\`\`\`
Get user
   |
   v
One result
\`\`\`

An EventEmitter can emit many events:

\`\`\`
message
message
message
message
...
\`\`\`

So a useful mental model is:

<b>Promise = eventual result.</b>

<b>EventEmitter = ongoing stream of named events.</b>
`,

      diagram: `
Event producer
      |
      | emit("userRegistered", user)
      v
 EventEmitter
      |
      +---- Listener A
      |
      +---- Listener B
      |
      +---- Listener C
`,

      codeExample: {
        title: "Creating an EventEmitter",
        code: `import { EventEmitter } from "node:events";

const bus = new EventEmitter();

bus.on("message", (text) => {
  console.log("Received:", text);
});

bus.emit("message", "Hello Node.js!");`,
      },

      keyTakeaways: [
        "An EventEmitter allows code to emit named events.",
        "on() registers an event listener.",
        "emit() triggers an event.",
        "Multiple listeners can respond to the same event.",
        "Promises represent an eventual result, while EventEmitters can represent repeated events over time.",
      ],

      commonMistakes: [
        "<b>Confusing on() and emit().</b> on() listens; emit() announces an event.",
        "<b>Thinking an EventEmitter can only emit one event.</b> One emitter can manage many named events.",
        "<b>Adding listeners repeatedly without thinking about cleanup.</b> Long-running applications should manage listener lifecycles carefully.",
      ],

      quiz: [
        {
          question: "Which method registers an EventEmitter listener?",
          options: [
            "emit()",
            "on()",
            "listenNow()",
            "start()",
          ],
          correctIndex: 1,
          explanation:
            "on() registers a listener for a named event.",
        },
        {
          question: "What does emit() do?",
          options: [
            "Creates a database",
            "Triggers an event",
            "Stops Node.js",
            "Reads a file",
          ],
          correctIndex: 1,
          explanation:
            "emit() announces that a named event has occurred.",
        },
      ],
    },

    {
      id: "streams-and-buffers",
      title: "Buffers and Streams",
      durationMinutes: 20,

      explanation: `
Two important Node.js concepts are <b>Buffers</b> and <b>Streams</b>.

They are related, but they are not the same thing.

---

## What is a Buffer?

A Buffer is an object used by Node.js to work with <b>raw binary data</b>.

Computers ultimately store data as bytes.

Text, images, videos, network packets, and files can all be represented using bytes.

For example:

\`\`\`js
const buffer = Buffer.from("Hello");

console.log(buffer);
\`\`\`

You may see something similar to:

\`\`\`
<Buffer 48 65 6c 6c 6f>
\`\`\`

Those values are bytes representing the text.

You can also inspect the number of bytes:

\`\`\`js
const buffer = Buffer.from("Hello");

console.log(buffer.length);
\`\`\`

For ordinary English text like "Hello", the result is 5 bytes.

But remember:

<b>characters and bytes are not always the same thing.</b>

Some characters require multiple bytes when encoded as UTF-8.

---

## What is a Stream?

A stream is a way of handling data <b>piece by piece</b> instead of waiting for all the data to arrive at once.

Imagine downloading a huge movie.

You would not necessarily want to load the entire movie into memory before processing any of it.

Instead, data can arrive in chunks.

For example:

\`\`\`
Chunk 1
Chunk 2
Chunk 3
Chunk 4
...
\`\`\`

A stream lets your application work with these chunks as they arrive.

---

## Why are streams useful?

Imagine a 10 GB file.

If you load the entire file into memory:

\`\`\`
10 GB file
    |
    v
Memory
    |
    v
Process
\`\`\`

That can require a huge amount of memory.

With a stream:

\`\`\`
10 GB file
    |
    v
Stream
    |
    +--> chunk 1
    +--> chunk 2
    +--> chunk 3
    +--> ...
\`\`\`

You can process a small part at a time.

This is one of the major reasons streams are useful in backend applications.

---

## Readable and writable streams

A <b>readable stream</b> produces data.

Examples:

- Reading a file.
- Receiving an HTTP request body.

A <b>writable stream</b> accepts data.

Examples:

- Writing a file.
- Sending data somewhere.

A stream can therefore be thought of as a moving flow of data.

---

## Stream events

A readable stream commonly emits events such as:

\`data\`

A chunk of data is available.

\`end\`

There is no more data.

\`error\`

Something went wrong.

For example:

\`\`\`js
stream.on("data", (chunk) => {
  console.log(chunk);
});

stream.on("end", () => {
  console.log("Finished");
});

stream.on("error", (error) => {
  console.error(error);
});
\`\`\`

---

## Buffer vs Stream

This is worth remembering:

<b>Buffer = a piece of data.</b>

<b>Stream = a way of moving or processing data over time.</b>

A stream may provide data in Buffer chunks.

So they often work together.
`,

      diagram: `
Large file
    |
    v
Readable Stream
    |
    +---- Chunk 1 -> Buffer
    |
    +---- Chunk 2 -> Buffer
    |
    +---- Chunk 3 -> Buffer
    |
    +---- Chunk 4 -> Buffer
    |
    v
Writable Stream

Data is processed progressively.
`,

      codeExample: {
        title: "Reading a file as a stream",
        code: `import { createReadStream } from "node:fs";

const stream = createReadStream("large.log", {
  encoding: "utf8",
});

stream.on("data", (chunk) => {
  console.log("Received chunk:", chunk.length);
});

stream.on("end", () => {
  console.log("Finished reading");
});

stream.on("error", (error) => {
  console.error("Read failed:", error);
});`,
      },

      keyTakeaways: [
        "A Buffer represents raw binary data.",
        "A Stream is a way to process data progressively.",
        "Streams are useful for large files and network data.",
        "Readable streams produce data.",
        "Writable streams consume data.",
        "A stream can provide data in chunks, often represented as Buffers.",
      ],

      commonMistakes: [
        "<b>Thinking a Buffer and a Stream are the same.</b> A Buffer is data; a Stream is a mechanism for moving or processing data.",
        "<b>Assuming streams are only for files.</b> Streams are also important for HTTP and other data sources.",
        "<b>Ignoring stream errors.</b> Stream operations can fail and should be handled.",
        "<b>Assuming characters always equal bytes.</b> Encodings such as UTF-8 can use multiple bytes for a character.",
      ],

      quiz: [
        {
          question: "What is a Buffer commonly used for?",
          options: [
            "Raw binary data",
            "CSS styles",
            "Database schemas",
            "HTML templates only",
          ],
          correctIndex: 0,
          explanation:
            "Buffers are used to work with raw binary data.",
        },
        {
          question: "Why are streams useful for large files?",
          options: [
            "They require the entire file to be loaded into memory",
            "They allow data to be processed incrementally",
            "They turn files into databases",
            "They disable asynchronous operations",
          ],
          correctIndex: 1,
          explanation:
            "Streams allow data to be processed piece by piece instead of requiring the entire file in memory.",
        },
      ],
    },

    {
      id: "commonjs-vs-esm",
      title: "Modules: CommonJS vs ESM",
      durationMinutes: 16,

      explanation: `
As your Node.js applications become larger, putting everything into one file becomes difficult.

Modules solve this problem.

A module is simply a file or unit of code that can expose functionality for other parts of your application to use.

For example, you might have:

\`\`\`
project/
  app.js
  users.js
  database.js
  utils.js
\`\`\`

Your application can import functionality from these files.

Node.js supports two major module systems:

<b>CommonJS</b>

and

<b>ECMAScript Modules (ESM)</b>.

---

## CommonJS

CommonJS is the older and historically very common Node.js module system.

It commonly uses:

\`\`\`js
require()
\`\`\`

to import something.

It commonly uses:

\`\`\`js
module.exports
\`\`\`

to export something.

Example:

\`\`\`js
// math.js

function add(a, b) {
  return a + b;
}

module.exports = {
  add,
};
\`\`\`

Then:

\`\`\`js
// app.js

const { add } = require("./math");

console.log(add(10, 20));
\`\`\`

---

## ESM

ESM stands for ECMAScript Modules.

It uses the standard JavaScript:

\`\`\`js
import
export
\`\`\`

syntax.

Example:

\`\`\`js
// math.js

export function add(a, b) {
  return a + b;
}
\`\`\`

Then:

\`\`\`js
// app.js

import { add } from "./math.js";

console.log(add(10, 20));
\`\`\`

---

## Which one should you use?

For this course, it is useful to understand both.

Modern Node.js applications commonly use ESM, while CommonJS remains important because many existing Node.js projects and packages use it.

The important thing is consistency.

Do not randomly mix:

\`\`\`js
require()
\`\`\`

and:

\`\`\`js
import
\`\`\`

without understanding how your project is configured.

---

## How does Node.js know which module system you are using?

For ESM, a project can use:

\`\`\`json
{
  "type": "module"
}
\`\`\`

inside \`package.json\`.

Another option is using the \`.mjs\` file extension.

CommonJS can use \`.cjs\` when you want to explicitly identify a file as CommonJS.

The exact module behavior depends on the file extension and project configuration.

---

## The node: prefix

When importing built-in Node.js modules, you will often see:

\`\`\`js
import { readFile } from "node:fs";
\`\`\`

or:

\`\`\`js
import { EventEmitter } from "node:events";
\`\`\`

The \`node:\` prefix clearly indicates that this is a built-in Node.js module.

Examples include:

\`\`\`
node:fs
node:path
node:http
node:events
node:stream
\`\`\`

This is a useful modern style for Node.js code.
`,

      diagram: `
                  Modules
                     |
             +-------+-------+
             |               |
             v               v
        CommonJS           ESM
             |               |
             +--> require    +--> import
             +--> exports    +--> export

             Node.js
                 |
                 +--> node:fs
                 +--> node:path
                 +--> node:http
                 +--> node:events
`,

      codeExample: {
        title: "CommonJS and ESM",
        code: `// CommonJS

const path = require("node:path");

module.exports = {
  getFileName: (filePath) => path.basename(filePath),
};


// ESM

import path from "node:path";

export function getFileName(filePath) {
  return path.basename(filePath);
}`,
      },

      keyTakeaways: [
        "Modules allow applications to split code into separate files.",
        "CommonJS commonly uses require() and module.exports.",
        "ESM uses import and export.",
        "Node.js supports both CommonJS and ESM.",
        "Project configuration and file extensions affect module behavior.",
        "The node: prefix is commonly used for built-in Node.js modules.",
      ],

      commonMistakes: [
        "<b>Mixing module systems without understanding the configuration.</b> Decide how your project will handle modules.",
        "<b>Assuming import works identically in every Node.js file.</b> Module configuration matters.",
        "<b>Confusing exports and module.exports.</b> They are related in CommonJS but have different behavior.",
        "<b>Forgetting file extensions when using ESM imports.</b> Node.js ESM resolution has specific rules.",
      ],

      quiz: [
        {
          question: "Which syntax is commonly associated with CommonJS?",
          options: [
            "require()",
            "import only",
            "export default only",
            "include()",
          ],
          correctIndex: 0,
          explanation:
            "CommonJS commonly uses require() to import modules.",
        },
        {
          question: "Which syntax belongs to ESM?",
          options: [
            "module.exports",
            "require()",
            "import/export",
            "include()",
          ],
          correctIndex: 2,
          explanation:
            "ECMAScript Modules use import and export.",
        },
      ],
    },
  ],

  finalQuiz: [
    {
      question: "What is Node.js?",
      options: [
        "A programming language",
        "A JavaScript runtime",
        "A database",
        "A CSS framework",
      ],
      correctIndex: 1,
      explanation:
        "Node.js is a runtime environment that allows JavaScript to run outside the browser.",
    },
    {
      question: "What is V8?",
      options: [
        "A JavaScript engine",
        "A database",
        "A package manager",
        "An HTTP framework",
      ],
      correctIndex: 0,
      explanation:
        "V8 is Google's JavaScript engine and is used by Node.js.",
    },
    {
      question: "What does the event loop help Node.js do?",
      options: [
        "Coordinate asynchronous callbacks and work",
        "Create HTML",
        "Store database tables",
        "Replace JavaScript",
      ],
      correctIndex: 0,
      explanation:
        "The event loop helps Node.js coordinate when asynchronous callbacks are ready to run.",
    },
    {
      question: "What is libuv associated with?",
      options: [
        "Asynchronous I/O and runtime infrastructure",
        "CSS rendering",
        "SQL queries",
        "React components",
      ],
      correctIndex: 0,
      explanation:
        "libuv provides important asynchronous I/O and event-loop infrastructure used by Node.js.",
    },
    {
      question: "What does a Promise represent?",
      options: [
        "An eventual result",
        "A database",
        "A browser tab",
        "A file extension",
      ],
      correctIndex: 0,
      explanation:
        "A Promise represents the eventual result of an asynchronous operation.",
    },
    {
      question: "What does await do?",
      options: [
        "Stops the entire Node.js process",
        "Waits for a Promise inside the current async function",
        "Creates a new JavaScript language",
        "Disables the event loop",
      ],
      correctIndex: 1,
      explanation:
        "await suspends the current async function until the awaited Promise settles.",
    },
    {
      question: "What does EventEmitter provide?",
      options: [
        "Named event emission and listeners",
        "A database engine",
        "A JavaScript compiler",
        "A file format",
      ],
      correctIndex: 0,
      explanation:
        "EventEmitter allows code to emit named events and register listeners for those events.",
    },
    {
      question: "Why are streams useful for large data?",
      options: [
        "They require everything to be loaded into memory first",
        "They allow data to be processed incrementally",
        "They remove asynchronous behavior",
        "They only work with numbers",
      ],
      correctIndex: 1,
      explanation:
        "Streams allow data to be processed in chunks instead of loading everything into memory.",
    },
    {
      question: "What is a Buffer?",
      options: [
        "A representation of raw binary data",
        "A database connection",
        "An HTTP route",
        "A module system",
      ],
      correctIndex: 0,
      explanation:
        "Buffers are used to work with raw binary data in Node.js.",
    },
    {
      question: "Which pair correctly matches the module system?",
      options: [
        "CommonJS: require/module.exports; ESM: import/export",
        "CommonJS: import/export; ESM: require/module.exports",
        "CommonJS: async/await; ESM: Promise",
        "CommonJS: Buffer; ESM: Stream",
      ],
      correctIndex: 0,
      explanation:
        "CommonJS commonly uses require/module.exports, while ESM uses import/export.",
    },
  ],

  project: {
    name: "Build a Node.js Fundamentals Explorer",

    goal:
      "Build a small Node.js command-line application that demonstrates the major concepts from Day 1: modules, asynchronous operations, EventEmitter, streams, Buffers, and error handling.",

    brief:
      "Create a Node.js command-line application that reads a text file asynchronously, reports information about it, emits an event when processing finishes, reads the same file using a stream, and demonstrates how Buffers represent binary data.",

    steps: [
      "Create a new Node.js project directory.",
      "Run npm init -y to create package.json.",
      "Choose ESM or CommonJS and configure the project consistently.",
      "Create an input.txt file containing several lines of text.",
      "Create an application entry file such as app.js.",
      "Import the Node.js file-system APIs needed by your chosen module system.",
      "Read input.txt asynchronously.",
      "Use async/await with a Promise-based file operation.",
      "Print the number of characters or bytes in the file.",
      "Create an EventEmitter.",
      "Register a listener for a fileProcessed event.",
      "Emit fileProcessed after the asynchronous file read succeeds.",
      "Create a readable stream for input.txt.",
      "Print information about each chunk received from the stream.",
      "Handle the stream end event.",
      "Handle file and stream errors.",
      "Create a Buffer from a short string.",
      "Print the Buffer and its byte length.",
      "Add comments explaining where asynchronous I/O and the event loop are involved.",
      "Run the program with Node.js and verify each part works.",
    ],

    acceptance: [
      "The project runs successfully with Node.js.",
      "The project uses either CommonJS or ESM consistently.",
      "The application reads a file asynchronously.",
      "The application uses async/await with a Promise-based operation.",
      "An EventEmitter event is registered and emitted.",
      "The application processes the file using a readable stream.",
      "A Buffer is created and its byte length is displayed.",
      "File and stream errors are handled.",
      "The application produces clear console output explaining what each operation is doing.",
    ],

    stretch: [
      "Add a fileError event that is emitted when reading the file fails.",
      "Use a writable stream to create a processed-output.txt file.",
      "Pipe the readable stream into the writable stream.",
      "Add a second EventEmitter listener that records a simple processing log.",
      "Convert the project from CommonJS to ESM, or from ESM to CommonJS.",
      "Create a small HTTP server that returns the processed file information as JSON.",
      "Add a setTimeout() call and explain why its callback does not necessarily execute immediately.",
      "Display both character length and Buffer byte length for text containing non-English characters.",
    ],
  },
};
