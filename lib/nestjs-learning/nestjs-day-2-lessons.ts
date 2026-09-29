import type { LessonDay } from "@/lib/learn/lesson-types";

export const TYPESCRIPT_DAY_2_LESSONS: LessonDay = {
  day: 2,
  title: "TypeScript for NestJS",
  totalMinutes: 112,
  difficulty: "Beginner",

  lessons: [
    {
      id: "types-interfaces-unions-intersections",
      title: "Types, interfaces, unions, and intersections",
      durationMinutes: 24,

      explanation: `When you write normal JavaScript, you can put almost any value into a variable.

For example:

\`const age = 25;\`

Later, JavaScript will allow you to replace it with something completely different:

\`age = "twenty-five";\`

JavaScript is flexible, but this flexibility can also make large applications harder to maintain. TypeScript helps by allowing you to describe <b>what kind of data your code expects</b>.

A <b>type</b> is simply a description of what a value is allowed to be.

For example:

\`let name: string = "Alice";\`

The \`string\` tells TypeScript that \`name\` should contain text.

You can also use types with function parameters:

\`function greet(name: string) {
  return "Hello " + name;
}\`

Now TypeScript can warn you if someone tries to call:

\`greet(123);\`

because the function expects a string.

In a NestJS application, types are extremely useful because backend applications deal with lots of structured data.

For example, a user might have an ID, name, email, and role. We can describe that shape with an <b>interface</b>.

An interface answers a simple question:

<b>"What properties should this object have?"</b>

For example:

\`interface User {
  id: string;
  name: string;
  email: string;
}\`

Now TypeScript knows what a User should look like.

A <b>union type</b> is useful when a value can have one of a small number of possible values.

For example, a user might have one of three statuses:

\`type UserStatus = "active" | "blocked" | "pending";\`

This is much safer than simply using \`string\`, because TypeScript can prevent values such as \`"hello"\` or \`"unknown"\`.

An <b>intersection type</b> combines multiple types.

For example:

\`type UserWithRole = User & {
  role: "admin" | "member";
};\`

This means the value must contain everything required by User <b>and</b> everything required by the second type.

A simple way to remember the difference is:

<b>Union = OR</b>

\`A | B\`

means the value can be A or B.

<b>Intersection = AND</b>

\`A & B\`

means the value must satisfy A and B.

In NestJS, these concepts are commonly used for users, products, orders, request objects, service results, and many other pieces of application data.`,

      diagram: `TypeScript
     |
     +-----------------------------+
     |                             |
     v                             v
Basic types                  Object shapes
     |                             |
 string                         interface
 number                         type
 boolean
     |
     +-----------------------------+
     |
     v
Different possibilities
     |
     +--> Union
     |     A | B
     |     "admin" | "user"
     |
     +--> Intersection
           A & B
           must satisfy both`,

      codeExample: {
        title: "Describing a NestJS user",
        code: `interface User {
  id: string;
  name: string;
  email: string;
}

type UserStatus = "active" | "blocked" | "pending";

type UserWithStatus = User & {
  status: UserStatus;
};

const user: UserWithStatus = {
  id: "u1",
  name: "Alice",
  email: "alice@example.com",
  status: "active",
};`,
      },

      keyTakeaways: [
        "A type describes what kind of value your code expects.",
        "Interfaces are commonly used to describe the shape of objects.",
        "A union means OR: the value can be one of several alternatives.",
        "An intersection means AND: the value must satisfy multiple types.",
        "Good types make NestJS code easier to understand and safer to change.",
      ],

      commonMistakes: [
        "<b>Using string for everything.</b> If a value has a small set of valid choices, use a union such as `\"active\" | \"blocked\"`.",
        "<b>Confusing union and intersection.</b> Remember: `|` means OR and `&` means AND.",
        "<b>Thinking interfaces exist at runtime.</b> TypeScript interfaces help the compiler but are removed from the generated JavaScript.",
        "<b>Thinking types validate incoming HTTP data.</b> TypeScript checks your code during development; it does not automatically validate data sent by a client.",
      ],

      quiz: [
        {
          question: "What does `string` tell TypeScript?",
          options: [
            "The value must contain text",
            "The value must be a database record",
            "The value must be an HTTP request",
            "The value must be a class",
          ],
          correctIndex: 0,
          explanation:
            "The string type tells TypeScript that the value is expected to contain text.",
        },
        {
          question: "What does `A | B` mean?",
          options: [
            "The value must satisfy both A and B",
            "The value can be A or B",
            "The value must be a string",
            "The value must be undefined",
          ],
          correctIndex: 1,
          explanation:
            "A union means the value can match one of the listed alternatives.",
        },
        {
          question: "What does `A & B` mean?",
          options: [
            "The value satisfies neither type",
            "The value can be A or B",
            "The value combines the requirements of A and B",
            "The value becomes optional",
          ],
          correctIndex: 2,
          explanation:
            "An intersection combines the requirements of both types.",
        },
      ],
    },

    {
      id: "generics-and-utility-types",
      title: "Generics and utility types",
      durationMinutes: 24,

      explanation: `As your application grows, you will notice that you often write similar code for different types of data.

For example, imagine you have a repository that stores users.

You might first write:

\`class UserRepository {
  add(user: User) {}
}\`

Later you create an order repository:

\`class OrderRepository {
  add(order: Order) {}
}\`

The two classes are doing almost the same thing. The only real difference is the type of data they store.

This is where <b>generics</b> become useful.

A generic allows you to write code once and tell TypeScript:

<b>"I don't know the exact type yet, but remember the type that the caller gives you."</b>

We commonly represent the unknown type using \`T\`.

For example:

\`class Repository<T> {
  private items: T[] = [];

  add(item: T) {
    this.items.push(item);
  }
}\`

Now we can create:

\`const users = new Repository<User>();\`

or:

\`const orders = new Repository<Order>();\`

The same repository code works for both.

The important benefit is that TypeScript still knows what is inside the repository.

If it is a \`Repository<User>\`, TypeScript expects User objects.

If it is a \`Repository<Order>\`, TypeScript expects Order objects.

TypeScript also provides <b>utility types</b>. Utility types allow you to create a new type based on an existing type.

For example, suppose we have:

\`interface User {
  id: string;
  name: string;
  email: string;
}\`

When creating a user, we may not have an ID yet. Instead of creating another interface manually, we can use:

\`type CreateUser = Omit<User, "id">;\`

Now CreateUser contains:

\`name
email\`

but not:

\`id\`.

Another useful utility type is \`Partial<T>\`.

\`Partial<User>\` means:

<b>"Take User, but make every property optional."</b>

This is useful for update operations.

For example:

\`type UpdateUser = Partial<CreateUser>;\`

Now an update can contain just the property the user wants to change.

Common utility types include:

<b>Partial</b> — makes properties optional.

<b>Pick</b> — keeps only selected properties.

<b>Omit</b> — removes selected properties.

<b>Readonly</b> — prevents properties from being reassigned through that type.

<b>Record</b> — creates an object type with a defined key and value structure.

For beginner NestJS development, you do not need to memorize every utility type. Learn the common ones and understand why they are useful.`,

      diagram: `Generic
   |
   v
Repository<T>
   |
   +--> Repository<User>
   |
   +--> Repository<Order>
   |
   +--> Repository<Product>


Existing type
     |
     v
Utility Type
     |
     +--> Partial
     |      make properties optional
     |
     +--> Pick
     |      keep selected properties
     |
     +--> Omit
     |      remove selected properties
     |
     +--> Readonly
     |      prevent reassignment
     |
     +--> Record
            define key/value structure`,

      codeExample: {
        title: "Generic repository and user request types",
        code: `interface User {
  id: string;
  name: string;
  email: string;
}

// Generic class
class Repository<T> {
  private items: T[] = [];

  add(item: T): void {
    this.items.push(item);
  }

  findAll(): T[] {
    return this.items;
  }
}

// CreateUser does not need an id yet
type CreateUser = Omit<User, "id">;

// Updates can contain any subset of properties
type UpdateUser = Partial<CreateUser>;

const users = new Repository<User>();

users.add({
  id: "u1",
  name: "Alice",
  email: "alice@example.com",
});

const newUser: CreateUser = {
  name: "Bob",
  email: "bob@example.com",
};

const update: UpdateUser = {
  name: "Robert",
};`,
      },

      keyTakeaways: [
        "Generics allow you to write reusable code while keeping type safety.",
        "T is commonly used as the name of a generic type parameter.",
        "Partial makes properties optional.",
        "Pick selects specific properties.",
        "Omit removes specific properties.",
        "Utility types are useful for creating related DTO and request shapes.",
      ],

      commonMistakes: [
        "<b>Using any instead of generics.</b> `any` throws away useful type information.",
        "<b>Creating duplicate types unnecessarily.</b> Utility types can often create simple variations from an existing type.",
        "<b>Making generics too complicated.</b> Start with a simple `T` and add more complexity only when you actually need it.",
        "<b>Thinking generics exist as runtime objects.</b> Generics primarily provide compile-time type information.",
      ],

      quiz: [
        {
          question: "Why are generics useful?",
          options: [
            "They remove TypeScript",
            "They allow reusable code while preserving type information",
            "They only work with databases",
            "They replace JavaScript",
          ],
          correctIndex: 1,
          explanation:
            "Generics allow one piece of code to work with different types while remaining type-safe.",
        },
        {
          question: "What does `Partial<User>` do?",
          options: [
            "Deletes User",
            "Makes User properties optional",
            "Turns User into a number",
            "Creates a database",
          ],
          correctIndex: 1,
          explanation:
            "Partial<T> creates a version of T where its properties are optional.",
        },
        {
          question: "What does `Omit<User, \"id\">` do?",
          options: [
            "Adds an id",
            "Makes id required",
            "Removes id from the resulting type",
            "Converts id to a number",
          ],
          correctIndex: 2,
          explanation:
            "Omit removes the specified property from the resulting type.",
        },
      ],
    },

    {
      id: "classes-access-modifiers-abstract",
      title: "Classes, access modifiers, and abstract classes",
      durationMinutes: 22,

      explanation: `NestJS uses <b>classes everywhere</b>. Controllers are classes. Services are classes. Guards, pipes, interceptors, and many other NestJS components are classes.

So you need to understand the basic idea of a TypeScript class.

A class is a blueprint for creating objects.

For example:

\`class User {
  name: string;

  constructor(name: string) {
    this.name = name;
  }
}\`

The constructor runs when you create a new object:

\`const user = new User("Alice");\`

A class can contain both <b>data</b> and <b>behavior</b>.

Properties represent data.

Methods represent behavior.

For example, a UserService might have methods such as:

\`findAll()
findOne()
create()
update()
remove()\`

TypeScript also gives classes <b>access modifiers</b>.

The most important ones for beginners are:

<b>public</b> means other code can access the member.

<b>private</b> means the member is intended to be used only inside that class.

<b>protected</b> means the member can be used inside the class and inside classes that extend it.

There is also <b>readonly</b>.

Readonly means that once the property has been initialized, you should not assign a new value to it.

You will see a very common NestJS pattern such as:

\`constructor(
  private readonly usersService: UsersService,
) {}\`

This does two things at once.

It creates a property called \`usersService\`.

It also assigns the constructor argument to that property.

The property is private, so it is only used inside the class.

The property is readonly, so the reference cannot later be replaced.

Another important concept is an <b>abstract class</b>.

An abstract class is a base class. You normally do not create an object directly from it.

Instead, another class extends it.

For example:

\`abstract class BaseService {
  abstract execute(): void;
}\`

Then:

\`class UserService extends BaseService {
  execute(): void {
    console.log("Users");
  }
}\`

The abstract class can provide common behavior and can also require child classes to implement certain methods.

You can think of an abstract class as a partially completed blueprint.`,

      diagram: `Class
 |
 +--> properties
 |
 +--> constructor
 |
 +--> methods
 |
 +--> access modifiers
        |
        +--> public
        |      accessible from outside
        |
        +--> private
        |      only inside the class
        |
        +--> protected
               class + subclasses


Abstract class
      |
      +--> shared behavior
      |
      +--> required methods
               |
               +--> UserService
               +--> OrderService`,

      codeExample: {
        title: "A NestJS-style service hierarchy",
        code: `interface Logger {
  log(message: string): void;
}

abstract class BaseService {
  constructor(
    protected readonly logger: Logger,
  ) {}

  protected trace(message: string): void {
    this.logger.log(message);
  }

  abstract execute(): Promise<void>;
}

class UsersService extends BaseService {
  async execute(): Promise<void> {
    this.trace("Loading users");
  }
}`,
      },

      keyTakeaways: [
        "NestJS uses classes for controllers, services, guards, pipes, and other components.",
        "Properties store data and methods perform behavior.",
        "private is intended for use only inside the class.",
        "protected is available to the class and its subclasses.",
        "readonly prevents reassignment of a property.",
        "Abstract classes provide shared behavior and rules for child classes.",
      ],

      commonMistakes: [
        "<b>Making everything public.</b> Keep implementation details private or protected when outside code does not need direct access.",
        "<b>Trying to instantiate an abstract class.</b> Abstract classes are intended to be extended by concrete classes.",
        "<b>Thinking private provides security.</b> TypeScript access modifiers mainly provide compile-time restrictions and cleaner design.",
        "<b>Confusing protected and private.</b> A subclass can access protected members but cannot directly access private members of the parent class.",
      ],

      quiz: [
        {
          question: "Where can a protected property normally be accessed?",
          options: [
            "Only from unrelated functions",
            "Inside the class and its subclasses",
            "Only from the browser",
            "Only from a database",
          ],
          correctIndex: 1,
          explanation:
            "protected members are accessible inside the class and classes that extend it.",
        },
        {
          question: "What does readonly do?",
          options: [
            "Makes a property a string",
            "Prevents reassignment after initialization",
            "Makes a class abstract",
            "Creates a database",
          ],
          correctIndex: 1,
          explanation:
            "readonly prevents the property from being reassigned after it has been initialized.",
        },
        {
          question: "Can you directly instantiate an abstract class?",
          options: [
            "Yes",
            "No",
            "Only from a controller",
            "Only from JSON",
          ],
          correctIndex: 1,
          explanation:
            "Abstract classes are intended to be extended by concrete classes rather than instantiated directly.",
        },
      ],
    },

    {
      id: "decorators-and-metadata",
      title: "Decorators and metadata in NestJS",
      durationMinutes: 26,

      explanation: `One of the first things you notice when learning NestJS is the large number of \`@\` symbols.

For example:

\`@Controller("users")\`

or:

\`@Get()
findAll() {}\`

These are called <b>decorators</b>.

A decorator provides additional information or behavior associated with a class, method, property, or parameter.

NestJS uses decorators heavily because they allow you to describe how your application is structured.

For example:

\`@Controller("users")\`

tells NestJS that a particular class should be treated as a controller and that its routes start with \`/users\`.

Then:

\`@Get()\`

can tell NestJS that a method handles a GET request for that controller.

So:

\`@Controller("users")
class UsersController {
  @Get()
  findAll() {}
}\`

can be understood by a beginner as:

<b>"This class handles users-related HTTP requests, and this method handles GET requests."</b>

Decorators are not simply comments.

Comments are ignored by your application.

Decorators are part of the program's structure and can be used by NestJS to configure how your application behaves.

Another word you will encounter is <b>metadata</b>.

Metadata is simply <b>information about something</b>.

For example, NestJS needs to know:

- Which classes are controllers?
- What URL prefix does a controller use?
- Which methods handle GET requests?
- Which dependencies should be injected?

Decorators help provide this information to the framework.

The exact implementation of decorators and metadata can vary depending on the TypeScript and NestJS versions and project configuration. This is important because you may find older tutorials using configuration that does not exactly match a newer project.

As a beginner, you do not need to understand the internal implementation of decorators yet.

Instead, understand this simple idea:

<b>Decorators give NestJS structured information about your code.</b>

Later, when you learn dependency injection, controllers, guards, pipes, interceptors, and modules, you will see decorators everywhere.`,

      diagram: `Your class
     |
     v
@Controller("users")
     |
     v
NestJS learns:
"This is a controller"


Method
     |
     v
@Get()
     |
     v
NestJS learns:
"This method handles GET"


Decorator
     |
     v
Framework metadata
     |
     v
NestJS uses that information
to build your application`,

      codeExample: {
        title: "A simple NestJS controller",
        code: `import { Controller, Get, Post } from "@nestjs/common";

@Controller("users")
export class UsersController {
  @Get()
  findAll() {
    return ["Alice", "Bob"];
  }

  @Post()
  create() {
    return {
      message: "User created",
    };
  }
}`,
      },

      keyTakeaways: [
        "Decorators use @ syntax.",
        "NestJS uses decorators to describe controllers, routes, dependencies, and other framework relationships.",
        "Metadata is information about program declarations that a framework can use.",
        "Decorators are not simply comments.",
        "You do not need to understand decorator internals before learning to use them.",
        "Always follow the decorator configuration generated by your NestJS project.",
      ],

      commonMistakes: [
        "<b>Thinking decorators are comments.</b> NestJS uses decorator information to configure application behavior.",
        "<b>Copying old TypeScript decorator configuration blindly.</b> TypeScript versions and project configurations can differ.",
        "<b>Thinking decorators are the same as types.</b> Types primarily help at compile time, while NestJS decorators participate in framework behavior and metadata.",
        "<b>Trying to understand the entire decorator system before building anything.</b> First learn what common NestJS decorators do; learn the internals later.",
      ],

      quiz: [
        {
          question: "What does `@Controller(\"users\")` tell NestJS?",
          options: [
            "Create a database table",
            "Treat the class as a controller with a users route prefix",
            "Create a TypeScript interface",
            "Create a CSS selector",
          ],
          correctIndex: 1,
          explanation:
            "NestJS uses @Controller() to identify a controller and configure its route prefix.",
        },
        {
          question: "What is metadata in this context?",
          options: [
            "Information about code that a framework can inspect",
            "A database password",
            "Only a comment",
            "A JavaScript loop",
          ],
          correctIndex: 0,
          explanation:
            "Metadata is information associated with program declarations that tools or frameworks can inspect.",
        },
        {
          question: "Which symbol is used for a decorator?",
          options: [
            "#",
            "@",
            "$",
            "%",
          ],
          correctIndex: 1,
          explanation:
            "TypeScript decorators use the @ symbol.",
        },
      ],
    },

    {
      id: "typescript-for-nestjs-integration",
      title: "Putting TypeScript and NestJS together",
      durationMinutes: 16,

      explanation: `Now let's connect everything you have learned.

TypeScript and NestJS have different responsibilities, but they work very well together.

<b>TypeScript types</b> describe the shape of data.

For example:

\`interface User {
  id: string;
  name: string;
}\`

This tells the TypeScript compiler what a User should look like.

<b>Classes</b> organize application behavior.

For example:

\`class UsersService {
  findAll() {
    // business logic
  }
}\`

The class can contain methods that perform actual work.

<b>Decorators</b> tell NestJS how parts of your application should be treated.

For example:

\`@Controller("users")\`

tells NestJS that a class is a controller.

These pieces work together.

Imagine a request:

\`GET /users\`

NestJS receives the request.

It finds the controller responsible for \`/users\`.

The controller calls a service.

The service performs application logic.

The service can use a repository to retrieve data.

TypeScript helps describe what data is expected at each boundary.

A simple architecture looks like:

<b>Request → Controller → Service → Repository</b>

Each layer has a different job.

The controller deals with HTTP.

The service deals with application or business logic.

The repository deals with storing and retrieving data.

TypeScript helps make the contracts between these pieces clear.

For example, a service might accept a \`CreateUser\` type and return a \`User\`.

This is much easier to understand than passing completely untyped objects around.

One important thing to remember is that <b>TypeScript types are not runtime validation</b>.

Suppose you write:

\`interface CreateUser {
  name: string;
  email: string;
}\`

TypeScript understands that shape while you are developing.

But a real HTTP request comes from outside your application.

A malicious or buggy client could send:

\`{
  "name": 123,
  "email": false
}\`

Your TypeScript interface does not automatically stop that request.

For real applications, NestJS projects commonly use runtime validation tools such as DTO classes together with validation decorators.

The key idea is:

<b>TypeScript protects the code you write. Runtime validation protects the application from data arriving at runtime.</b>

Do not try to make your types extremely complicated.

A beginner-friendly and professional approach is:

- Use simple types for data.
- Use classes for behavior.
- Use decorators for NestJS framework configuration.
- Use services for business logic.
- Use DTOs and runtime validation for external input.
- Keep each part responsible for one clear job.`,

      diagram: `HTTP Request
     |
     v
@Controller()
Controller
     |
     | calls
     v
Service
     |
     | uses
     v
Repository
     |
     v
Database


TypeScript helps describe
the data moving between layers.

Decorators tell NestJS
how the layers are connected.

Runtime validation checks
data that actually arrives.`,

      codeExample: {
        title: "Simple typed NestJS-style architecture",
        code: `interface User {
  id: string;
  name: string;
  email: string;
}

type CreateUser = Omit<User, "id">;

class UsersService {
  create(input: CreateUser): User {
    return {
      id: crypto.randomUUID(),
      ...input,
    };
  }
}

// In a real NestJS application,
// a controller would call UsersService
// and return the User result.`,
      },

      keyTakeaways: [
        "Types describe data contracts.",
        "Classes organize runtime behavior.",
        "Decorators tell NestJS how classes and methods should be used.",
        "Controllers handle HTTP concerns.",
        "Services contain reusable application or business logic.",
        "Repositories commonly handle data access.",
        "TypeScript types do not replace runtime validation.",
      ],

      commonMistakes: [
        "<b>Putting all business logic in the controller.</b> Controllers should usually stay focused on HTTP-related work.",
        "<b>Using interfaces as runtime validation.</b> Interfaces disappear when TypeScript is compiled.",
        "<b>Making every type extremely complicated.</b> Clear and simple types are usually easier to maintain.",
        "<b>Mixing responsibilities.</b> Keep controllers, services, and data-access code focused on their own jobs.",
      ],

      quiz: [
        {
          question: "What is the main job of a TypeScript type?",
          options: [
            "Describe and check data contracts during development",
            "Start a database server",
            "Open a network socket automatically",
            "Replace NestJS",
          ],
          correctIndex: 0,
          explanation:
            "Types describe the expected shape of data and help TypeScript catch mistakes during development.",
        },
        {
          question: "Where should reusable business logic commonly live in NestJS?",
          options: [
            "Only in decorators",
            "In service classes",
            "Inside CSS",
            "Inside package.json",
          ],
          correctIndex: 1,
          explanation:
            "NestJS services are commonly used to organize reusable application and business logic.",
        },
        {
          question: "Do TypeScript interfaces validate incoming HTTP data at runtime?",
          options: [
            "Yes, automatically",
            "No",
            "Only for GET requests",
            "Only in production",
          ],
          correctIndex: 1,
          explanation:
            "Interfaces are compile-time constructs. Runtime input needs actual validation.",
        },
      ],
    },
  ],

  finalQuiz: [
    {
      question: "What does a union such as `\"draft\" | \"published\"` mean?",
      options: [
        "The value must contain both values",
        "The value can be one of the listed alternatives",
        "The value must be a number",
        "The value must be a class",
      ],
      correctIndex: 1,
      explanation:
        "A union allows a value to match one of the specified alternatives.",
    },
    {
      question: "What does `A & B` mean?",
      options: [
        "The value must satisfy both A and B",
        "The value can be A or B",
        "The value must be a string",
        "The value must be null",
      ],
      correctIndex: 0,
      explanation:
        "An intersection combines the requirements of A and B.",
    },
    {
      question: "What is the main benefit of generics?",
      options: [
        "They remove type checking",
        "They allow reusable code while preserving type information",
        "They only work with databases",
        "They replace classes",
      ],
      correctIndex: 1,
      explanation:
        "Generics allow reusable code to work with different types while maintaining type safety.",
    },
    {
      question: "What does `Partial<User>` do?",
      options: [
        "Deletes User",
        "Makes User properties optional",
        "Turns User into a number",
        "Creates a database",
      ],
      correctIndex: 1,
      explanation:
        "Partial<User> creates a type where User's properties are optional.",
    },
    {
      question: "What does `Omit<User, \"id\">` do?",
      options: [
        "Adds an id",
        "Removes id from the resulting type",
        "Makes id a number",
        "Makes every property optional",
      ],
      correctIndex: 1,
      explanation:
        "Omit removes the specified property from the resulting type.",
    },
    {
      question: "Which access modifier allows a member to be used by a class and its subclasses?",
      options: [
        "private",
        "protected",
        "internal",
        "sealed",
      ],
      correctIndex: 1,
      explanation:
        "protected members are accessible inside the class and its subclasses.",
    },
    {
      question: "What does readonly do?",
      options: [
        "Makes a value a string",
        "Prevents reassignment of a property after initialization",
        "Makes a class abstract",
        "Creates a database",
      ],
      correctIndex: 1,
      explanation:
        "readonly prevents a property from being reassigned after initialization.",
    },
    {
      question: "What is an abstract class?",
      options: [
        "A class that must always be instantiated directly",
        "A base class intended to be extended by concrete classes",
        "A database table",
        "A union type",
      ],
      correctIndex: 1,
      explanation:
        "An abstract class provides a base structure and can require subclasses to implement certain behavior.",
    },
    {
      question: "Why does NestJS use decorators such as `@Controller()`?",
      options: [
        "To provide framework information about classes and routes",
        "To create SQL tables",
        "To disable TypeScript",
        "To replace JavaScript",
      ],
      correctIndex: 0,
      explanation:
        "NestJS uses decorators to describe framework relationships such as controllers and routes.",
    },
    {
      question: "Which statement about TypeScript interfaces is correct?",
      options: [
        "They primarily provide compile-time contracts",
        "They automatically validate HTTP requests at runtime",
        "They are database tables",
        "They always exist as JavaScript objects",
      ],
      correctIndex: 0,
      explanation:
        "Interfaces describe types for TypeScript and are erased from the emitted JavaScript.",
    },
    {
      question: "Which layer should usually contain reusable business logic in NestJS?",
      options: [
        "Service",
        "CSS file",
        "package.json",
        "Decorator itself",
      ],
      correctIndex: 0,
      explanation:
        "NestJS services are commonly used to organize reusable application and business logic.",
    },
    {
      question: "Which statement about TypeScript types and runtime validation is correct?",
      options: [
        "TypeScript types automatically validate all HTTP input",
        "TypeScript types only work after the application starts",
        "TypeScript types help during development, while runtime validation checks actual incoming data",
        "TypeScript types replace all validation libraries",
      ],
      correctIndex: 2,
      explanation:
        "TypeScript checks your code during development and compilation. Incoming runtime data still needs runtime validation.",
    },
  ],

  project: {
    name: "Build a typed NestJS Users module",

    goal: "Build a small NestJS users feature that demonstrates the most important beginner TypeScript concepts used in real NestJS applications.",

    brief: `Create a small Users feature with a controller, service, typed user model, and in-memory repository.

The goal is not to build a complicated application.

The goal is to understand why NestJS uses TypeScript so heavily and how types, classes, generics, utility types, access modifiers, and decorators work together.

By the end, you should be able to look at a basic NestJS application and understand what the TypeScript syntax is doing.`,

    steps: [
      "Create a User interface containing id, name, email, and status.",
      "Create a UserStatus union containing three allowed statuses such as 'active', 'blocked', and 'pending'.",
      "Create a CreateUser type using Omit or Pick so that a new user does not need an id.",
      "Create an UpdateUser type using Partial.",
      "Create a generic Repository<T> class that can store and return items.",
      "Create a UsersService class that uses Repository<User>.",
      "Add a createUser method that accepts CreateUser and returns User.",
      "Add a findAll method that returns User[].",
      "Use private or protected members where appropriate.",
      "Create a UsersController using @Controller('users').",
      "Add a GET route that returns users.",
      "Add a POST route that creates a user.",
      "Use TypeScript types for method parameters and return values.",
      "Add comments explaining which parts are TypeScript compile-time features.",
      "Add comments explaining which parts are NestJS runtime decorators.",
      "Run the application and test the endpoints.",
    ],

    acceptance: [
      "The project uses TypeScript types to describe user data.",
      "A User interface or equivalent type is present.",
      "A union type represents allowed user statuses.",
      "A utility type such as Partial, Pick, or Omit is used.",
      "A generic Repository<T> is implemented.",
      "A UsersService class contains application logic.",
      "At least one meaningful access modifier is used.",
      "A NestJS controller uses @Controller().",
      "The controller contains at least one route decorator such as @Get() or @Post().",
      "The code clearly separates controller responsibilities from service responsibilities.",
      "The application demonstrates that TypeScript types are compile-time contracts rather than runtime validation.",
    ],

    stretch: [
      "Create a generic Result<T> type representing success or failure.",
      "Create an abstract BaseRepository<T> and extend it with an in-memory repository.",
      "Create a typed event payload for a user-created event.",
      "Add runtime validation for the create-user request.",
      "Explain in a code comment why TypeScript interfaces alone cannot validate incoming HTTP data.",
      "Add an UpdateUser endpoint that demonstrates Partial<User>.",
      "Add a typed response object instead of returning raw arrays.",
    ],
  },
};
