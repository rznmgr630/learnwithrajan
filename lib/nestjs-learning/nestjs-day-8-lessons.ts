import type { LessonDay } from "@/lib/learn/lesson-types";

export const NESTJS_DAY_8_LESSONS: LessonDay = {
  day: 8,
  title: "Controllers",
  totalMinutes: 115,
  difficulty: "Beginner",
  lessons: [
    {
      id: "controllers-and-routes",
      title: "Controllers and routes",
      durationMinutes: 16,
      explanation: `A <b>controller</b> is one of the main places where your NestJS application receives HTTP requests.

When a client sends a request to your API, NestJS needs to know which piece of code should handle that request.

That is where controllers come in.

For example, imagine your application has a users feature.

You might have:

\`GET /users\`

\`GET /users/123\`

\`POST /users\`

\`PATCH /users/123\`

\`DELETE /users/123\`

These are different HTTP requests, but they can all belong to the same \`UsersController\`.

You create a controller with the \`@Controller()\` decorator.

For example:

\`@Controller("users")\`

The string \`"users"\` becomes the base path for the controller.

Then you use method decorators such as:

\`@Get()\`

\`@Post()\`

\`@Patch()\`

\`@Delete()\`

to define individual routes.

For example:

\`@Controller("users")\`

combined with:

\`@Get()\`

creates:

\`GET /users\`

If you write:

\`@Get("active")\`

the route becomes:

\`GET /users/active\`

This is called <b>route mapping</b>.

NestJS looks at the decorators on your controller and creates the appropriate routes when the application starts.

A controller method does not have to be named after the HTTP method.

You might write:

\`findAll()\`

under:

\`@Get()\`

The method name is for your code.

The decorator determines how an HTTP request reaches that method.

For example:

\`@Get()\`

\`findAll()\`

means:

"When a GET request comes to this controller's base route, call \`findAll()\`."

This separation is useful because it makes your code readable.

A controller normally focuses on HTTP concerns.

It receives the request, gets the information it needs, calls a service, and returns a result.

The service can then handle the actual application logic.

A common flow looks like:

<b>Client → Route → Controller → Service → Response</b>

Understanding this flow is one of the most important things to learn when starting NestJS.`,
      diagram: `Client
  |
  | GET /users
  v
NestJS Router
  |
  | matches @Controller("users")
  | + @Get()
  v
UsersController
  |
  | findAll()
  v
UsersService
  |
  v
Data
  |
  v
Response
  |
  v
Client`,
      codeExample: {
        title: "A basic UsersController",
        code: `import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
} from "@nestjs/common";

@Controller("users")
export class UsersController {
  @Get()
  findAll() {
    return "All users";
  }

  @Post()
  create() {
    return "Create user";
  }

  @Patch(":id")
  update() {
    return "Update user";
  }

  @Delete(":id")
  remove() {
    return "Delete user";
  }
}`,
      },
      keyTakeaways: [
        "Controllers receive HTTP requests.",
        "`@Controller()` defines the base route for a controller.",
        "HTTP method decorators such as `@Get()` and `@Post()` define individual routes.",
        "The method name does not determine the HTTP route; the decorators do.",
        "A controller commonly receives request data, calls a service, and returns a response.",
        "Multiple related routes can live inside the same controller.",
      ],
      commonMistakes: [
        "<b>Thinking the method name creates the route.</b> `findAll()` does not automatically create `/findAll`. The route is defined by decorators.",
        "<b>Putting all business logic inside controllers.</b> Controllers should normally delegate application logic to services.",
        "<b>Forgetting the controller prefix.</b> `@Controller(\"users\")` becomes part of every route inside that controller.",
        "<b>Using the wrong HTTP decorator.</b> `@Get()`, `@Post()`, `@Patch()`, and `@Delete()` represent different HTTP methods.",
      ],
      quiz: [
        {
          question: "What does `@Controller(\"users\")` define?",
          options: [
            "The database table",
            "The base route for the controller",
            "A service",
            "A TypeScript type",
          ],
          correctIndex: 1,
          explanation: "The string passed to `@Controller()` becomes the base path for the controller.",
        },
        {
          question: "Which decorator creates a GET route?",
          options: [
            "`@Get()`",
            "`@Route()`",
            "`@Fetch()`",
            "`@Request()`",
          ],
          correctIndex: 0,
          explanation: "`@Get()` maps an HTTP GET request to a controller method.",
        },
        {
          question: "What is a common controller responsibility?",
          options: [
            "Receive HTTP requests and connect them to application logic",
            "Compile TypeScript",
            "Manage Git",
            "Install Node.js",
          ],
          correctIndex: 0,
          explanation: "Controllers are the HTTP entry points of NestJS features.",
        },
      ],
    },

    {
      id: "http-methods",
      title: "HTTP methods",
      durationMinutes: 16,
      explanation: `HTTP methods tell the server what kind of operation the client is requesting.

The most common methods you will use when building REST APIs are:

\`GET\`

\`POST\`

\`PUT\`

\`PATCH\`

\`DELETE\`

Each method has a different meaning.

<b>GET</b> is normally used to retrieve information.

For example:

\`GET /users\`

can mean:

"Give me the users."

Another example is:

\`GET /users/123\`

which can mean:

"Give me user 123."

<b>POST</b> is commonly used to create a new resource.

For example:

\`POST /users\`

with a request body containing user information can mean:

"Create a new user."

<b>PUT</b> is commonly associated with replacing an existing resource.

For example:

\`PUT /users/123\`

might mean:

"Replace the representation of user 123 with this new representation."

<b>PATCH</b> is commonly used for a partial update.

For example:

\`PATCH /users/123\`

might contain only:

\`{ "name": "Alice" }\`

This can mean:

"Change the name of user 123, but leave the other fields alone."

<b>DELETE</b> is normally used to remove a resource.

For example:

\`DELETE /users/123\`

can mean:

"Delete user 123."

These meanings are conventions used when designing HTTP APIs.

NestJS gives you decorators that correspond to these methods:

\`@Get()\`

\`@Post()\`

\`@Put()\`

\`@Patch()\`

\`@Delete()\`

It is important to understand that the HTTP method is part of the route.

For example:

\`GET /users\`

and:

\`POST /users\`

have the same path but represent different operations.

You can have both in the same controller.

This is very common in REST-style APIs.

When deciding which method to use, think about what the client is trying to do.

Is it retrieving something?

Creating something?

Replacing something?

Partially updating something?

Deleting something?

Choosing the correct HTTP method makes your API easier for other developers to understand.`,
      diagram: `                 HTTP Methods

GET       --> Read / retrieve
POST      --> Create
PUT       --> Replace
PATCH     --> Partially update
DELETE    --> Remove


Example:

GET    /users
POST   /users

GET    /users/123
PUT    /users/123
PATCH  /users/123
DELETE /users/123`,
      codeExample: {
        title: "Mapping HTTP methods in NestJS",
        code: `import {
  Controller,
  Get,
  Post,
  Put,
  Patch,
  Delete,
} from "@nestjs/common";

@Controller("users")
export class UsersController {
  @Get()
  findAll() {
    return "Get all users";
  }

  @Get(":id")
  findOne() {
    return "Get one user";
  }

  @Post()
  create() {
    return "Create user";
  }

  @Put(":id")
  replace() {
    return "Replace user";
  }

  @Patch(":id")
  update() {
    return "Update part of user";
  }

  @Delete(":id")
  remove() {
    return "Delete user";
  }
}`,
      },
      keyTakeaways: [
        "GET is commonly used to retrieve resources.",
        "POST is commonly used to create resources.",
        "PUT is commonly associated with replacing a resource.",
        "PATCH is commonly used for partial updates.",
        "DELETE is commonly used to remove a resource.",
        "NestJS provides decorators that map directly to these HTTP methods.",
        "The HTTP method and URL path together identify the request route.",
      ],
      commonMistakes: [
        "<b>Using POST for every operation.</b> HTTP methods communicate the intended operation and should be chosen intentionally.",
        "<b>Confusing PUT and PATCH.</b> PUT is commonly used for replacement, while PATCH is commonly used for partial updates.",
        "<b>Thinking `/users` only represents one endpoint.</b> `GET /users` and `POST /users` are different routes because their HTTP methods differ.",
        "<b>Using DELETE for a read operation.</b> DELETE communicates that a resource should be removed.",
      ],
      quiz: [
        {
          question: "Which HTTP method is commonly used to retrieve data?",
          options: [
            "GET",
            "POST",
            "DELETE",
            "PATCH",
          ],
          correctIndex: 0,
          explanation: "GET is normally used to retrieve resources.",
        },
        {
          question: "Which HTTP method is commonly used to create a resource?",
          options: [
            "GET",
            "POST",
            "DELETE",
            "HEAD",
          ],
          correctIndex: 1,
          explanation: "POST is commonly used when creating a new resource.",
        },
        {
          question: "Which method is commonly used for a partial update?",
          options: [
            "PATCH",
            "GET",
            "DELETE",
            "OPTIONS",
          ],
          correctIndex: 0,
          explanation: "PATCH is commonly used to partially update an existing resource.",
        },
      ],
    },

    {
      id: "route-parameters",
      title: "Route parameters",
      durationMinutes: 15,
      explanation: `Sometimes the URL needs to contain a value that identifies a specific resource.

For example:

\`GET /users/42\`

The number \`42\` identifies a particular user.

This is called a <b>route parameter</b>.

In NestJS, you define a route parameter using a colon:

\`@Get(":id")\`

The \`:id\` part means:

"There should be a value in this part of the URL, and I want to call that value \`id\`."

You can then access the value using the \`@Param()\` decorator.

For example:

\`@Param("id") id: string\`

Now if the client requests:

\`GET /users/42\`

the value of \`id\` will be:

\`"42"\`

Notice that it is a string.

This is important.

Even though \`42\` looks like a number in the URL, URL parameters arrive as strings unless you transform them.

If your service expects a number, you might convert it:

\`Number(id)\`

For example:

\`this.usersService.findOne(Number(id))\`

NestJS also allows you to get the complete parameter object.

For example:

\`@Param() params\`

could give you an object such as:

\`{ id: "42" }\`

You can also have multiple route parameters.

For example:

\`@Get("users/:userId/posts/:postId")\`

could match:

\`GET /users/42/posts/7\`

The parameters would be:

\`userId = "42"\`

and:

\`postId = "7"\`

Route parameters are useful when the value is an important part of identifying the resource.

For example:

\`/users/42\`

is usually clearer than:

\`/users?id=42\`

when you are specifically requesting user 42.

The important distinction is:

<b>Route parameters are part of the URL path.</b>

Query parameters, which you will learn next, come after a question mark.`,
      diagram: `Request:

GET /users/42
          |
          +--> route parameter
               id = "42"


NestJS:

@Get(":id")
findOne(@Param("id") id: string) {
  return this.usersService.findOne(
    Number(id)
  );
}


Multiple parameters:

GET /users/42/posts/7

:userId = "42"
:postId = "7"`,
      codeExample: {
        title: "Using a route parameter",
        code: `import {
  Controller,
  Get,
  Param,
} from "@nestjs/common";

@Controller("users")
export class UsersController {
  @Get(":id")
  findOne(@Param("id") id: string) {
    const userId = Number(id);

    return {
      message: "Finding user",
      id: userId,
    };
  }
}`,
      },
      keyTakeaways: [
        "Route parameters are values embedded inside the URL path.",
        "You define them with a colon, such as `:id`.",
        "`@Param(\"id\")` reads the `id` route parameter.",
        "Route parameters normally arrive as strings.",
        "Convert the value when your application needs a number.",
        "A route can contain multiple parameters.",
      ],
      commonMistakes: [
        "<b>Assuming `id` is automatically a number.</b> URL parameters normally arrive as strings.",
        "<b>Forgetting the colon.</b> `:id` defines a route parameter; `id` without the colon is just a literal path segment.",
        "<b>Using the wrong parameter name.</b> `@Get(\":id\")` should normally be read using `@Param(\"id\")`.",
        "<b>Not validating route parameters.</b> Converting `abc` with `Number()` does not produce a valid user ID. Real applications should validate input.",
      ],
      quiz: [
        {
          question: "What does `@Get(\":id\")` define?",
          options: [
            "A route containing an `id` parameter",
            "A database column",
            "A query parameter",
            "A request header",
          ],
          correctIndex: 0,
          explanation: "The `:id` syntax defines a dynamic route parameter.",
        },
        {
          question: "What value does `@Param(\"id\")` read?",
          options: [
            "The `id` route parameter",
            "The request body",
            "The cookie",
            "The HTTP method",
          ],
          correctIndex: 0,
          explanation: "`@Param(\"id\")` reads the route parameter named `id`.",
        },
        {
          question: "What type does a URL parameter commonly arrive as?",
          options: [
            "string",
            "number",
            "boolean",
            "object",
          ],
          correctIndex: 0,
          explanation: "URL parameters are commonly received as strings.",
        },
      ],
    },

    {
      id: "query-parameters",
      title: "Query parameters",
      durationMinutes: 15,
      explanation: `Query parameters are values that appear at the end of a URL after a question mark.

For example:

\`GET /users?role=admin\`

Here, \`role=admin\` is a query parameter.

Another example is:

\`GET /users?page=2&limit=10\`

This request contains two query parameters:

\`page = 2\`

\`limit = 10\`

Query parameters are commonly used for things such as:

- filtering
- searching
- sorting
- pagination
- optional settings

For example:

\`GET /products?category=books\`

could mean:

"Give me products in the books category."

Or:

\`GET /products?search=typescript\`

could mean:

"Search for products related to TypeScript."

Or:

\`GET /users?page=2&limit=20\`

could be used for pagination.

In NestJS, you can read query parameters with the \`@Query()\` decorator.

For example:

\`@Query("search") search: string\`

reads the \`search\` query parameter.

If the request is:

\`GET /users?search=alice\`

then:

\`search\`

will contain:

\`"alice"\`

You can also read multiple query parameters at once:

\`@Query() query\`

This gives you an object containing the query parameters.

For example:

\`GET /users?page=2&limit=10\`

can result in something similar to:

\`{ page: "2", limit: "10" }\`

Again, notice that these values are strings.

If you need \`page\` as a number, you need to validate and transform it.

This becomes especially important in real applications.

For example, if someone sends:

\`?limit=hello\`

your application should not blindly assume it is a valid number.

Later, you will learn about DTOs, validation pipes, and transformation, which make this much safer.

The important distinction is:

<b>Route parameters identify a resource inside the path.</b>

<b>Query parameters provide additional information about the request.</b>

For example:

\`GET /users/42\`

uses a route parameter to identify user 42.

While:

\`GET /users?role=admin\`

uses a query parameter to filter users.`,
      diagram: `URL:

GET /users?page=2&limit=10
          |
          +--> query string
                |
                +--> page = "2"
                |
                +--> limit = "10"


NestJS:

@Get()
findAll(
  @Query("page") page: string,
  @Query("limit") limit: string,
) {
  // ...
}`,
      codeExample: {
        title: "Reading query parameters",
        code: `import {
  Controller,
  Get,
  Query,
} from "@nestjs/common";

@Controller("users")
export class UsersController {
  @Get()
  findAll(
    @Query("search") search?: string,
    @Query("page") page?: string,
    @Query("limit") limit?: string,
  ) {
    return {
      search,
      page,
      limit,
    };
  }
}

// Example:
// GET /users?search=alice&page=2&limit=10

// Result:
// {
//   search: "alice",
//   page: "2",
//   limit: "10"
// }`,
      },
      keyTakeaways: [
        "Query parameters appear after `?` in a URL.",
        "Multiple query parameters are separated with `&`.",
        "`@Query()` reads query parameters in NestJS.",
        "Query parameters are commonly used for filtering, searching, sorting, and pagination.",
        "Query parameter values commonly arrive as strings.",
        "Query parameters are different from route parameters.",
      ],
      commonMistakes: [
        "<b>Confusing query parameters with route parameters.</b> `/users/42` uses a route parameter, while `/users?id=42` uses a query parameter.",
        "<b>Assuming query values are numbers.</b> `page=2` normally arrives as the string `\"2\"`.",
        "<b>Assuming a query parameter is always present.</b> Query parameters are often optional.",
        "<b>Trusting user input without validation.</b> Query parameters come from the client and should be validated before important operations.",
      ],
      quiz: [
        {
          question: "Where do query parameters appear?",
          options: [
            "After `?` in the URL",
            "Inside the HTTP method",
            "Inside the response status",
            "Inside the database",
          ],
          correctIndex: 0,
          explanation: "Query parameters appear in the URL query string after `?`.",
        },
        {
          question: "Which decorator reads query parameters?",
          options: [
            "`@Query()`",
            "`@Param()`",
            "`@Body()`",
            "`@Headers()`",
          ],
          correctIndex: 0,
          explanation: "`@Query()` is used to access URL query parameters.",
        },
        {
          question: "What is `page=2` commonly received as?",
          options: [
            "A string",
            "A number automatically",
            "A boolean",
            "A database record",
          ],
          correctIndex: 0,
          explanation: "Query parameter values commonly arrive as strings.",
        },
      ],
    },

    {
      id: "request-body",
      title: "Request body",
      durationMinutes: 15,
      explanation: `The request body is the data sent inside an HTTP request.

You will use request bodies frequently when building APIs.

For example, when creating a user, the client might send:

\`POST /users\`

with:

\`{ "name": "Alice", "email": "alice@example.com" }\`

The JSON object is the <b>request body</b>.

In NestJS, you can read the request body with the \`@Body()\` decorator.

For example:

\`@Body() body\`

gives you access to the entire request body.

You can also select a specific property:

\`@Body("name") name: string\`

This reads only the \`name\` property.

Request bodies are especially common with:

\`POST\`

\`PUT\`

\`PATCH\`

because these methods frequently send information to the server.

For example, creating a user might use POST:

\`POST /users\`

with:

\`{ "name": "Alice" }\`

Updating a user might use PATCH:

\`PATCH /users/42\`

with:

\`{ "name": "Alice Smith" }\`

The body contains the data that should be created or changed.

In a real application, you should not simply trust whatever the client sends.

The client could send:

\`{ "name": 123 }\`

when your application expects a string.

Or it could omit required properties.

Or it could send unexpected values.

That is why NestJS applications commonly use <b>DTOs</b> and <b>validation</b>.

You will learn about those concepts later, but for now remember:

<b>Request data comes from the outside world, so it needs to be treated as untrusted input.</b>

You should also understand the difference between request body and query parameters.

For example:

\`POST /users?sendWelcomeEmail=true\`

has a query parameter:

\`sendWelcomeEmail=true\`

and might also have a request body:

\`{ "name": "Alice", "email": "alice@example.com" }\`

They are separate parts of the HTTP request.

The body is especially useful for larger structured data.

For example, a product creation request might contain:

\`name\`

\`description\`

\`price\`

\`category\`

and other fields.

NestJS gives you a clean decorator-based way to access that data.`,
      diagram: `POST /users

Headers
   |
   +--> Content-Type: application/json
   |
Body
   |
   +--> {
   |      "name": "Alice",
   |      "email": "alice@example.com"
   |    }
   |
   v
@Body()
   |
   v
Controller
   |
   v
Service`,
      codeExample: {
        title: "Reading a request body",
        code: `import {
  Body,
  Controller,
  Post,
} from "@nestjs/common";

@Controller("users")
export class UsersController {
  @Post()
  create(
    @Body()
    body: {
      name: string;
      email: string;
    },
  ) {
    return {
      message: "Creating user",
      user: body,
    };
  }
}

// POST /users
//
// Body:
// {
//   "name": "Alice",
//   "email": "alice@example.com"
// }`,
      },
      keyTakeaways: [
        "The request body contains data sent inside an HTTP request.",
        "`@Body()` gives a controller access to the request body.",
        "You can read the entire body or a specific property.",
        "Request bodies are common with POST, PUT, and PATCH requests.",
        "Request body data comes from the client and should be validated.",
        "DTOs are commonly used later to define and validate expected request data.",
      ],
      commonMistakes: [
        "<b>Using `@Query()` when you need the request body.</b> Query parameters and body data are different parts of the HTTP request.",
        "<b>Trusting request data without validation.</b> Clients can send missing, incorrect, or unexpected values.",
        "<b>Forgetting the request content type.</b> JSON request bodies are normally sent with an appropriate `Content-Type` header.",
        "<b>Putting all body processing directly into the controller.</b> Keep business logic in appropriate services.",
      ],
      quiz: [
        {
          question: "Which decorator reads the request body?",
          options: [
            "`@Body()`",
            "`@Param()`",
            "`@Query()`",
            "`@Headers()`",
          ],
          correctIndex: 0,
          explanation: "`@Body()` is used to access data sent in the request body.",
        },
        {
          question: "Which request commonly sends JSON data to create a resource?",
          options: [
            "POST",
            "GET",
            "DELETE",
            "HEAD",
          ],
          correctIndex: 0,
          explanation: "POST is commonly used to create resources and often carries the new resource data in the request body.",
        },
        {
          question: "Should request body data be trusted automatically?",
          options: [
            "Yes",
            "No, it should be validated",
            "Only in production",
            "Only when using TypeScript",
          ],
          correctIndex: 1,
          explanation: "Request data comes from the client and should be validated before your application relies on it.",
        },
      ],
    },

    {
      id: "headers",
      title: "Headers",
      durationMinutes: 13,
      explanation: `HTTP headers are additional pieces of information sent with an HTTP request or response.

They are not normally part of the URL path or request body.

For example, a request might contain:

\`Content-Type: application/json\`

This tells the server what kind of data is being sent.

Another common header is:

\`Authorization: Bearer token\`

This can contain authentication credentials or an access token.

There are many different HTTP headers, and applications can also define custom headers.

In NestJS, you can read request headers with the \`@Headers()\` decorator.

For example:

\`@Headers("authorization") authorization: string\`

reads the authorization header.

You can also read all headers:

\`@Headers() headers\`

This gives you an object containing the request headers.

Headers are useful for information that describes the request rather than being the main resource data.

For example:

The URL might tell you:

"Get user 42."

The query parameters might tell you:

"Only return active data."

The body might tell you:

"Create this user."

The headers might tell you:

"This request contains JSON" or "Here is the client's authentication information."

Headers can also be sent by the server in the response.

For example, a server might return:

\`Content-Type: application/json\`

or caching-related headers.

You will use headers heavily when working with authentication, caching, content types, APIs, and browser behavior.

One important security rule is that headers are also <b>client-controlled input</b>.

You should not assume a header is trustworthy simply because it has a familiar name.

For example, if your application expects an authorization header, the server must actually validate the token.

Reading a header is not the same as authenticating a user.

That distinction is important.`,
      diagram: `HTTP Request

GET /users

Headers
-------------------------
Content-Type: application/json
Authorization: Bearer abc123
Accept: application/json
-------------------------

Body
-------------------------
Usually empty for this example
-------------------------

          |
          v
     NestJS Controller
          |
          v
       @Headers()`,
      codeExample: {
        title: "Reading request headers",
        code: `import {
  Controller,
  Get,
  Headers,
} from "@nestjs/common";

@Controller("users")
export class UsersController {
  @Get()
  findAll(
    @Headers("authorization")
    authorization?: string,
  ) {
    return {
      authorization,
    };
  }
}

// Request:
// GET /users
//
// Authorization: Bearer abc123`,
      },
      keyTakeaways: [
        "HTTP headers contain additional request or response information.",
        "`@Headers()` reads request headers.",
        "You can read one header or all headers.",
        "`Content-Type` describes the format of request data.",
        "`Authorization` is commonly used to carry authentication credentials.",
        "Reading an authorization header does not automatically authenticate the user.",
        "Headers are client-controlled input and should be handled carefully.",
      ],
      commonMistakes: [
        "<b>Thinking headers are private.</b> Headers are sent by the client and should not automatically be trusted.",
        "<b>Thinking reading `Authorization` means authentication is complete.</b> Your application still needs to validate the credential.",
        "<b>Using headers for normal resource data.</b> Resource data usually belongs in the request body, route, or query depending on the situation.",
      ],
      quiz: [
        {
          question: "Which decorator can read a request header?",
          options: [
            "`@Headers()`",
            "`@Body()`",
            "`@Param()`",
            "`@Query()`",
          ],
          correctIndex: 0,
          explanation: "`@Headers()` provides access to HTTP request headers.",
        },
        {
          question: "What is `Content-Type` commonly used for?",
          options: [
            "Describing the format of the request data",
            "Identifying a database",
            "Defining a route",
            "Starting the server",
          ],
          correctIndex: 0,
          explanation: "`Content-Type` tells the server what media type or format the request body uses.",
        },
        {
          question: "Does reading an Authorization header automatically authenticate a user?",
          options: [
            "Yes",
            "No",
            "Only with GET",
            "Only with POST",
          ],
          correctIndex: 1,
          explanation: "The application still needs to validate the credentials contained in the header.",
        },
      ],
    },

    {
      id: "cookies",
      title: "Cookies",
      durationMinutes: 12,
      explanation: `Cookies are small pieces of data that a browser can store and send back to a server with later requests.

You will often encounter cookies when working with browser-based authentication, sessions, preferences, and other state that needs to be associated with a browser.

For example, a server might send a response containing a cookie:

\`Set-Cookie: sessionId=abc123\`

The browser can store that cookie.

On a later request, the browser may send:

\`Cookie: sessionId=abc123\`

This allows the server to recognize information associated with that browser.

Cookies are different from headers in an important way:

A cookie is a type of data that is transported through the HTTP \`Cookie\` header.

In NestJS, you may read the raw Cookie header with the \`@Headers()\` decorator.

For example:

\`@Headers("cookie") cookie: string\`

However, when working with cookies in a real NestJS application, you will often use the appropriate cookie parsing middleware or package so that cookies can be accessed more conveniently.

For example, with cookie parsing configured, you may access cookies through the request object.

The exact setup depends on the HTTP adapter and packages used by your application.

Cookies are especially important for authentication.

For example, a server might store a session identifier in a cookie.

The browser sends that cookie with later requests.

The server can then use the session identifier to find the associated session.

Cookies can also have important security attributes.

Some commonly discussed cookie attributes are:

<b>HttpOnly</b>

This prevents normal client-side JavaScript from reading the cookie.

<b>Secure</b>

This tells the browser to send the cookie only over HTTPS in normal secure configurations.

<b>SameSite</b>

This controls how cookies are sent in cross-site situations and is important for reducing certain cross-site request risks.

These settings matter greatly when cookies are used for authentication.

For now, the beginner-level idea is:

<b>The browser stores cookies and sends them with requests according to the cookie's rules.</b>

The server can read those cookies and use them as part of its application logic.

Do not put sensitive information directly into a cookie just because the browser can store it.

Cookie security and authentication should be designed carefully.`,
      diagram: `First response:

Server
  |
  | Set-Cookie: sessionId=abc123
  v
Browser
  |
  | stores cookie
  v
Cookie storage


Later request:

Browser
  |
  | Cookie: sessionId=abc123
  v
Server
  |
  v
NestJS Controller
  |
  v
Session/Auth logic`,
      codeExample: {
        title: "Reading a cookie from the request",
        code: `import {
  Controller,
  Get,
  Headers,
} from "@nestjs/common";

@Controller("account")
export class AccountController {
  @Get()
  getAccount(
    @Headers("cookie")
    cookie?: string,
  ) {
    return {
      cookie,
    };
  }
}

// Example request header:
//
// Cookie: sessionId=abc123`,
      },
      keyTakeaways: [
        "Cookies are small pieces of data stored by the browser.",
        "Browsers can send cookies back to the server with later requests.",
        "Cookies are transported using the HTTP `Cookie` header.",
        "NestJS applications can read the raw Cookie header with `@Headers()`.",
        "Cookie parsing middleware or packages can make cookie handling easier.",
        "`HttpOnly`, `Secure`, and `SameSite` are important cookie security attributes.",
        "Authentication cookies should be designed and configured carefully.",
      ],
      commonMistakes: [
        "<b>Thinking cookies are automatically secure.</b> Cookie security depends on how they are configured and used.",
        "<b>Putting sensitive information directly into a cookie.</b> Cookie data should be handled carefully, especially for authentication.",
        "<b>Confusing `Set-Cookie` and `Cookie`.</b> Servers commonly use `Set-Cookie` in responses, while browsers send cookies back using the `Cookie` header.",
        "<b>Thinking HttpOnly prevents the server from reading the cookie.</b> HttpOnly primarily prevents normal browser JavaScript from accessing the cookie.",
      ],
      quiz: [
        {
          question: "Where are cookies commonly stored?",
          options: [
            "By the browser",
            "Only in the database",
            "Only inside NestJS",
            "Inside TypeScript files",
          ],
          correctIndex: 0,
          explanation: "Browsers store cookies and send them according to their configured rules.",
        },
        {
          question: "Which response header is commonly used by a server to set a cookie?",
          options: [
            "Set-Cookie",
            "Set-Header",
            "Cookie-Create",
            "Browser-Cookie",
          ],
          correctIndex: 0,
          explanation: "Servers use `Set-Cookie` to instruct browsers to store or update cookies.",
        },
        {
          question: "What does HttpOnly mainly prevent?",
          options: [
            "Normal client-side JavaScript from reading the cookie",
            "The server from reading the cookie",
            "The browser from storing the cookie",
            "HTTP requests from existing",
          ],
          correctIndex: 0,
          explanation: "HttpOnly prevents normal client-side JavaScript from accessing the cookie.",
        },
      ],
    },

    {
      id: "response-handling",
      title: "Response handling",
      durationMinutes: 13,
      explanation: `After a controller receives a request and performs its work, it needs to send a response back to the client.

The simplest way to return a response in NestJS is to return a value from the controller method.

For example:

\`return { message: "Hello" };\`

NestJS will normally serialize the object as JSON and send it as the HTTP response.

This is one of the things that makes NestJS controllers convenient.

You do not normally need to manually call a low-level response method for every request.

For example:

\`@Get()\`

\`findAll() {\`

\`return this.usersService.findAll();\`

\`}\`

The value returned by the service becomes the controller response.

NestJS also lets you control the HTTP status code using decorators.

For example:

\`@HttpCode(201)\`

can set the response status code to 201.

You can also use the \`@Res()\` decorator to access the underlying response object.

However, you should understand that using the raw response object changes how NestJS handles the response.

For beginners, prefer returning values directly from controller methods unless you have a specific reason to take manual control of the response.

For example, this is simple:

\`@Get()\`

\`findAll() {\`

\`return this.usersService.findAll();\`

\`}\`

If you need a custom status code, you can often use:

\`@HttpCode(...)\`

For example, a successful resource creation commonly uses status 201.

You can also throw NestJS HTTP exceptions when something goes wrong.

For example:

\`throw new NotFoundException("User not found");\`

NestJS can then turn that exception into an appropriate HTTP error response.

This is better than returning a successful-looking object such as:

\`{ error: "User not found" }\`

with a 200 status code.

The status code is part of the meaning of the response.

Some common response status codes are:

\`200 OK\`

The request succeeded.

\`201 Created\`

A resource was created.

\`204 No Content\`

The request succeeded and there is no response body.

\`400 Bad Request\`

The request data is invalid.

\`401 Unauthorized\`

Authentication is required or failed.

\`403 Forbidden\`

The server understood the request but refuses to allow the operation.

\`404 Not Found\`

The requested resource could not be found.

\`500 Internal Server Error\`

An unexpected server-side problem occurred.

You do not need to memorize every status code immediately.

The important idea is that a response contains more than just JSON data.

It can include:

- a status code
- headers
- cookies
- a response body

NestJS gives you convenient abstractions for handling these pieces while still allowing lower-level control when needed.`,
      diagram: `Client
  |
  | HTTP Request
  v
Controller
  |
  v
Service
  |
  v
Result
  |
  v
Controller returns value
  |
  +--> Status code
  |
  +--> Headers
  |
  +--> Cookies
  |
  +--> Body
  |
  v
HTTP Response
  |
  v
Client`,
      codeExample: {
        title: "Returning responses and status codes",
        code: `import {
  Controller,
  Get,
  Post,
  HttpCode,
  HttpStatus,
  NotFoundException,
} from "@nestjs/common";

@Controller("users")
export class UsersController {
  @Get()
  findAll() {
    return [
      { id: 1, name: "Alice" },
      { id: 2, name: "Bob" },
    ];
  }

  @Get(":id")
  findOne() {
    const user = {
      id: 1,
      name: "Alice",
    };

    if (!user) {
      throw new NotFoundException("User not found");
    }

    return user;
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create() {
    return {
      id: 3,
      name: "Charlie",
    };
  }
}`,
      },
      keyTakeaways: [
        "A controller can return a value directly as the HTTP response.",
        "Objects are commonly returned as JSON responses.",
        "`@HttpCode()` can be used to customize the response status code.",
        "NestJS provides HTTP exceptions such as `NotFoundException`.",
        "HTTP status codes communicate what happened with the request.",
        "The response can contain a status code, headers, cookies, and a body.",
        "Returning values directly is usually simpler than manually controlling the raw response object.",
      ],
      commonMistakes: [
        "<b>Returning an error object with status 200.</b> Use an appropriate HTTP exception when the request failed.",
        "<b>Using raw `@Res()` unnecessarily.</b> Directly returning values is usually simpler and keeps NestJS's response handling available.",
        "<b>Always returning status 200.</b> Different outcomes have different appropriate HTTP status codes.",
        "<b>Confusing response body with response status.</b> `{ message: \"Created\" }` is body data; `201` is the HTTP status.",
      ],
      quiz: [
        {
          question: "What happens when a controller method returns an object?",
          options: [
            "NestJS can serialize it into the HTTP response",
            "The application shuts down",
            "It becomes a database table",
            "It becomes a route",
          ],
          correctIndex: 0,
          explanation: "NestJS normally serializes returned objects and sends them as the response body.",
        },
        {
          question: "Which decorator can set a custom HTTP status code?",
          options: [
            "`@HttpCode()`",
            "`@Status()`",
            "`@ResponseCode()`",
            "`@Code()`",
          ],
          correctIndex: 0,
          explanation: "`@HttpCode()` allows you to specify a response status code.",
        },
        {
          question: "Which exception is appropriate when a requested resource cannot be found?",
          options: [
            "`NotFoundException`",
            "`CreatedException`",
            "`SuccessException`",
            "`RouteException`",
          ],
          correctIndex: 0,
          explanation: "`NotFoundException` represents an HTTP 404 Not Found response.",
        },
      ],
    },
  ],

  finalQuiz: [
    {
      question: "What is the main purpose of a NestJS controller?",
      options: [
        "Handle HTTP requests",
        "Compile TypeScript",
        "Store database tables",
        "Install packages",
      ],
      correctIndex: 0,
      explanation: "Controllers act as HTTP entry points and connect incoming requests to application logic.",
    },
    {
      question: "What does `@Controller(\"users\")` define?",
      options: [
        "The base route `/users`",
        "A database table",
        "A service",
        "A request body",
      ],
      correctIndex: 0,
      explanation: "The value passed to `@Controller()` becomes the controller's base route.",
    },
    {
      question: "Which decorator creates a GET route?",
      options: [
        "`@Get()`",
        "`@Fetch()`",
        "`@Route()`",
        "`@Request()`",
      ],
      correctIndex: 0,
      explanation: "`@Get()` maps an HTTP GET request to a controller method.",
    },
    {
      question: "Which HTTP method is commonly used to create a resource?",
      options: [
        "POST",
        "GET",
        "DELETE",
        "OPTIONS",
      ],
      correctIndex: 0,
      explanation: "POST is commonly used to create a new resource.",
    },
    {
      question: "Which HTTP method is commonly used for a partial update?",
      options: [
        "PATCH",
        "GET",
        "DELETE",
        "HEAD",
      ],
      correctIndex: 0,
      explanation: "PATCH is commonly used to partially update an existing resource.",
    },
    {
      question: "What does `@Get(\":id\")` define?",
      options: [
        "A route containing a dynamic `id` parameter",
        "A query parameter",
        "A request body",
        "A response header",
      ],
      correctIndex: 0,
      explanation: "The `:id` syntax defines a route parameter.",
    },
    {
      question: "Which decorator reads a route parameter?",
      options: [
        "`@Param()`",
        "`@Query()`",
        "`@Body()`",
        "`@Headers()`",
      ],
      correctIndex: 0,
      explanation: "`@Param()` reads values embedded in the route path.",
    },
    {
      question: "What does `/users/42` represent when the route is `@Get(\":id\")`?",
      options: [
        "`id` is `42`",
        "The query parameter is `42`",
        "The body is `42`",
        "The header is `42`",
      ],
      correctIndex: 0,
      explanation: "The `:id` route parameter receives the value `42`.",
    },
    {
      question: "Where do query parameters appear?",
      options: [
        "After `?` in the URL",
        "Inside the HTTP method",
        "Inside the response body only",
        "Inside the route decorator name",
      ],
      correctIndex: 0,
      explanation: "Query parameters appear in the URL after `?`.",
    },
    {
      question: "Which decorator reads query parameters?",
      options: [
        "`@Query()`",
        "`@Param()`",
        "`@Body()`",
        "`@Headers()`",
      ],
      correctIndex: 0,
      explanation: "`@Query()` provides access to query string values.",
    },
    {
      question: "Which decorator reads the request body?",
      options: [
        "`@Body()`",
        "`@Query()`",
        "`@Param()`",
        "`@Headers()`",
      ],
      correctIndex: 0,
      explanation: "`@Body()` provides access to data sent in the request body.",
    },
    {
      question: "Which decorator reads request headers?",
      options: [
        "`@Headers()`",
        "`@Body()`",
        "`@Query()`",
        "`@Param()`",
      ],
      correctIndex: 0,
      explanation: "`@Headers()` provides access to HTTP request headers.",
    },
    {
      question: "Which header is commonly used to describe the request body format?",
      options: [
        "Content-Type",
        "Route-Type",
        "Body-Format",
        "Request-Format",
      ],
      correctIndex: 0,
      explanation: "`Content-Type` describes the media type or format of the request body.",
    },
    {
      question: "Which response header is commonly used to set a cookie?",
      options: [
        "Set-Cookie",
        "Create-Cookie",
        "Cookie-Set",
        "Browser-Cookie",
      ],
      correctIndex: 0,
      explanation: "Servers commonly use `Set-Cookie` to instruct the browser to store a cookie.",
    },
    {
      question: "What does HttpOnly mainly prevent?",
      options: [
        "Normal client-side JavaScript from reading the cookie",
        "The server from receiving the cookie",
        "The browser from storing the cookie",
        "The request from using HTTPS",
      ],
      correctIndex: 0,
      explanation: "HttpOnly prevents normal client-side JavaScript from accessing the cookie.",
    },
    {
      question: "What happens when a NestJS controller returns an object?",
      options: [
        "NestJS can serialize it as the response body",
        "It becomes a route",
        "It becomes a database table",
        "The server shuts down",
      ],
      correctIndex: 0,
      explanation: "NestJS normally serializes returned objects and sends them as the response body.",
    },
    {
      question: "Which decorator can set a custom HTTP response status code?",
      options: [
        "`@HttpCode()`",
        "`@ResponseStatus()`",
        "`@StatusCode()`",
        "`@Code()`",
      ],
      correctIndex: 0,
      explanation: "`@HttpCode()` allows a controller method to specify a response status code.",
    },
    {
      question: "Which exception represents a 404 response?",
      options: [
        "`NotFoundException`",
        "`CreatedException`",
        "`SuccessException`",
        "`RequestException`",
      ],
      correctIndex: 0,
      explanation: "`NotFoundException` represents the HTTP 404 Not Found response.",
    },
    {
      question: "What is the difference between `/users/42` and `/users?id=42`?",
      options: [
        "The first uses a route parameter; the second uses a query parameter",
        "They are always exactly the same",
        "The first uses a request body; the second uses a header",
        "The first uses a cookie; the second uses a body",
      ],
      correctIndex: 0,
      explanation: "`/users/42` contains a value in the route path, while `/users?id=42` contains a query parameter.",
    },
    {
      question: "Which is a good responsibility for a controller?",
      options: [
        "Receive request data and call the appropriate service",
        "Contain every business rule in the application",
        "Manage the database directly in every method",
        "Compile the application",
      ],
      correctIndex: 0,
      explanation: "Controllers should handle HTTP concerns and delegate application logic to services or other providers.",
    },
  ],

  project: {
    name: "Build a Users REST Controller",
    goal: "Build a practical NestJS Users API that uses routes, HTTP methods, route parameters, query parameters, request bodies, headers, cookies, and proper response handling.",
    brief: "Create a Users feature with a controller and service. The API should allow clients to retrieve users, retrieve a single user by ID, filter users with query parameters, create users using a request body, update users, delete users, read a request header, and demonstrate cookie handling.",
    steps: [
      "Create a `UsersModule` using the Nest CLI.",
      "Create a `UsersController` using the Nest CLI.",
      "Create a `UsersService` using the Nest CLI.",
      "Make sure the users module is connected to the application's module structure.",
      "Create an in-memory list containing at least five users in `UsersService`.",
      "Create `GET /users` to return all users.",
      "Create `GET /users/:id` to return one user.",
      "Read the `id` using `@Param()`.",
      "Convert the route ID from a string into a number.",
      "Return a `NotFoundException` when the requested user does not exist.",
      "Add a query parameter such as `search` to `GET /users`.",
      "Use `@Query()` to read the search value.",
      "Filter the users when a search value is provided.",
      "Add another query parameter such as `role`.",
      "Allow requests such as `GET /users?role=admin`.",
      "Add pagination-style query parameters such as `page` and `limit`.",
      "Read `page` and `limit` with `@Query()`.",
      "Remember that query values arrive as strings and convert them when needed.",
      "Create `POST /users` for creating a user.",
      "Use `@Body()` to read the incoming user data.",
      "Return the newly created user.",
      "Use an appropriate created response status.",
      "Create `PATCH /users/:id` for updating part of a user.",
      "Read the user ID using `@Param()`.",
      "Read update data using `@Body()`.",
      "Create `DELETE /users/:id` for deleting a user.",
      "Return an appropriate response after deletion.",
      "Create a route that reads the `Authorization` header using `@Headers()`.",
      "Do not treat the presence of an Authorization header as proof that the user is authenticated.",
      "Add a simple cookie-reading example.",
      "Read the raw Cookie header or configure appropriate cookie parsing.",
      "Create at least one response that returns a custom HTTP status.",
      "Use `NotFoundException` when a requested user cannot be found.",
      "Test every endpoint with an API client such as Postman, Insomnia, curl, or another HTTP client.",
      "Test GET requests.",
      "Test POST requests with JSON bodies.",
      "Test PATCH requests with JSON bodies.",
      "Test DELETE requests.",
      "Test route parameters.",
      "Test query parameters.",
      "Test request headers.",
      "Test cookies.",
      "Inspect the status code of every response.",
      "Inspect the response body of every request.",
    ],
    acceptance: [
      "A UsersController exists.",
      "A UsersService exists.",
      "The controller uses `@Controller(\"users\")`.",
      "The API contains a `GET /users` route.",
      "The API contains a `GET /users/:id` route.",
      "The API contains a `POST /users` route.",
      "The API contains a `PATCH /users/:id` route.",
      "The API contains a `DELETE /users/:id` route.",
      "The application reads at least one route parameter using `@Param()`.",
      "The application reads at least one query parameter using `@Query()`.",
      "The application reads request data using `@Body()`.",
      "The application reads at least one request header using `@Headers()`.",
      "The application demonstrates reading a cookie.",
      "The application returns an appropriate 404 response when a user does not exist.",
      "The application returns an appropriate success status for resource creation.",
      "The controller delegates application logic to the service.",
      "The API can be tested successfully with an HTTP client.",
      "The learner understands the difference between route parameters and query parameters.",
      "The learner understands the difference between request headers and request body.",
      "The learner understands that returned controller values become HTTP response bodies.",
    ],
    stretch: [
      "Create a `GET /users/:id/orders` route using multiple related resources.",
      "Add `sort` and `order` query parameters.",
      "Add `minAge` and `maxAge` query parameters.",
      "Add validation for numeric route and query parameters.",
      "Create DTO classes for user creation and user updates.",
      "Add request validation using NestJS validation pipes.",
      "Add a custom response header to one endpoint.",
      "Set a cookie in a response and then read it from a later request.",
      "Configure cookie parsing and use parsed cookies instead of manually reading the raw Cookie header.",
      "Experiment with `HttpOnly`, `Secure`, and `SameSite` cookie settings in a local development setup.",
      "Add a global API prefix such as `/api` and observe how every route changes.",
      "Add a global exception filter after learning how NestJS exception handling works.",
      "Replace the in-memory users array with a real database repository after learning NestJS database integration.",
      "Document every endpoint with its HTTP method, URL, parameters, body, headers, and expected response.",
    ],
  },
};
