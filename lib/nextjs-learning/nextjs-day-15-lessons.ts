import type { LessonDay } from "@/lib/learn/lesson-types";

export const NEXTJS_DAY_15_LESSONS: LessonDay = {
  day: 15,
  title: "Production Data Layer",
  totalMinutes: 94,
  difficulty: "Advanced",
  lessons: [
    {
      id: "production-data-layer-architecture",
      title: "Designing the production data layer",
      durationMinutes: 18,
      explanation: `
A small application can put a database query directly inside a Server Component and still work. As the application grows, however, mixing UI rendering, business rules, validation, database queries, and error handling in one file becomes difficult to maintain.

A production data layer separates these responsibilities.

The architecture for this lesson is:

UI
↓
Server Component
↓
Service Layer
↓
Repository / ORM
↓
PostgreSQL

### Server Component

The Server Component owns the rendering concern. It decides what data the page needs and how that data should be displayed.

### Service layer

The service layer represents business operations. Examples include:
- createOrder;
- publishPost;
- updateProfile;
- cancelSubscription.

A service should express what the application is doing, not merely how a SQL query is written.

### Repository / ORM

The repository or data-access layer handles persistence details. It knows how to query PostgreSQL through the ORM.

This separation means the service does not need to know whether the repository uses Drizzle, Prisma, or another database library.

### Why this matters

The goal is not to create five files for every database query. The goal is to create boundaries when responsibilities are meaningfully different.

A simple read may not need a huge abstraction. A complex business operation with validation, transactions, multiple queries, and side effects usually benefits from a clear service boundary.
      `,
      diagram: `
UI
 |
 v
Server Component
 |
 | "I need to publish this post"
 v
Service Layer
 |
 | business rules
 | validation coordination
 | transaction
 v
Repository / ORM
 |
 | SQL
 v
PostgreSQL
      `,
      codeExample: {
        title: "Separating the UI, service, and repository",
        code: `// Server Component
const post = await getPost(postId);

// Service layer
export async function publishPost(input: PublishPostInput) {
  const data = validatePublishInput(input);

  const post = await postRepository.findById(data.postId);

  if (!post) {
    throw new PostNotFoundError();
  }

  if (post.status !== "draft") {
    throw new InvalidPostStateError();
  }

  return postRepository.markPublished(post.id);
}

// Repository
export async function findById(id: number) {
  return db.query.posts.findFirst({
    where: (posts, { eq }) => eq(posts.id, id),
  });
}`,
      },
      keyTakeaways: [
        "A production data layer separates rendering, business logic, persistence, and database concerns.",
        "Services should represent business operations.",
        "Repositories should own persistence details.",
        "Do not introduce abstractions without a real responsibility boundary.",
      ],
      commonMistakes: [
        "Putting business rules directly into JSX.",
        "Creating repositories that simply rename every ORM method without adding a useful boundary.",
        "Making every tiny function pass through many unnecessary layers.",
      ],
      quiz: [
        {
          question: "What should a service layer primarily represent?",
          options: [
            "Business operations and rules.",
            "CSS classes.",
            "Raw browser events.",
            "Database connection strings.",
          ],
          correctIndex: 0,
          explanation:
            "A service layer is useful for expressing application-level business operations.",
        },
      ],
    },

    {
      id: "repository-pattern-and-dtos",
      title: "Repository pattern and DTOs",
      durationMinutes: 19,
      explanation: `
The repository pattern creates a boundary around persistence operations.

A repository might expose methods such as:
- findUserById;
- findOrdersByUser;
- createOrder;
- updateOrderStatus.

The rest of the application does not need to know the exact ORM query used internally.

### Repository responsibilities

A repository should focus on persistence:
- constructing database queries;
- mapping database results;
- handling database-specific operations;
- exposing useful data-access methods.

Business rules should normally remain in the service layer.

### DTOs

A DTO (Data Transfer Object) describes the data crossing a boundary.

A database row often contains more fields than the UI should receive. For example, a users table might contain internal identifiers, security metadata, and timestamps that should not be returned to a browser component.

A service can transform the database record into a DTO containing only the fields needed by the caller.

### DTOs are not automatically validation

A TypeScript DTO type describes what your code expects at compile time. It does not automatically validate untrusted runtime input.

For request data, combine a clear DTO shape with runtime validation when the input comes from a user or external system.
      `,
      diagram: `
PostgreSQL row
     |
     v
 Repository
     |
     v
 Service
     |
     +--> validate / business rules
     |
     +--> map DB record
     |
     v
 DTO
     |
     v
 Server Component
      `,
      codeExample: {
        title: "Mapping a database row to a DTO",
        code: `type UserDto = {
  id: number;
  name: string;
  email: string;
};

function toUserDto(user: {
  id: number;
  name: string;
  email: string;
  passwordHash: string;
  internalNotes: string | null;
}): UserDto {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
  };
}

// The DTO deliberately does not expose passwordHash
// or internalNotes.`,
      },
      keyTakeaways: [
        "Repositories provide a persistence boundary.",
        "Services should contain business rules rather than database-specific details.",
        "DTOs define the shape of data crossing application boundaries.",
        "DTO types do not replace runtime validation.",
      ],
      commonMistakes: [
        "Returning entire database rows to UI code.",
        "Putting business rules inside repository methods.",
        "Assuming TypeScript interfaces validate incoming JSON.",
      ],
      quiz: [
        {
          question: "Why map a database record to a DTO?",
          options: [
            "To control which data crosses the application boundary.",
            "To make PostgreSQL a browser database.",
            "To replace all validation.",
            "To remove all business rules.",
          ],
          correctIndex: 0,
          explanation:
            "DTO mapping lets the application expose only the data appropriate for the next layer.",
        },
      ],
    },

    {
      id: "validation-and-error-handling",
      title: "Validation and production error handling",
      durationMinutes: 19,
      explanation: `
Production systems receive invalid input. Validation is the process of checking that input before using it in business logic or persistence operations.

There are two useful categories:

### Shape validation

Does the input contain the expected fields and types?

Example:
- title is a string;
- price is a number;
- email has an acceptable format.

### Business validation

Does the request make sense for the current state of the application?

Example:
- an already-published post cannot be published again;
- an order cannot be cancelled after shipment;
- a user cannot modify another user's resource.

A schema validation library can help with runtime shape validation, while the service layer should enforce business rules.

### Error categories

Production code should distinguish expected domain errors from unexpected infrastructure failures.

Examples:
- ProductNotFoundError;
- ValidationError;
- ForbiddenError;
- ConflictError;
- DatabaseUnavailableError.

The UI can map expected errors to useful user messages while unexpected errors should be logged and exposed through safe generic UI.

### Do not leak internals

Database SQL, stack traces, secret values, and internal infrastructure details should not be returned directly to users.

Log enough information for developers to diagnose the problem, but keep the user-facing response safe.
      `,
      diagram: `
Untrusted input
      |
      v
Runtime validation
      |
      v
Business validation
      |
      v
Service operation
      |
   +--+--+
   |     |
 expected unexpected
 error    error
   |       |
   v       v
safe UI   log + safe UI
      `,
      codeExample: {
        title: "Validation before a service operation",
        code: `type CreatePostInput = {
  title: string;
  body: string;
};

function validateCreatePost(input: CreatePostInput) {
  if (input.title.trim().length < 3) {
    throw new ValidationError(
      "Title must contain at least 3 characters."
    );
  }

  if (input.body.trim().length === 0) {
    throw new ValidationError(
      "Post body cannot be empty."
    );
  }
}

export async function createPost(input: CreatePostInput) {
  validateCreatePost(input);

  return postRepository.create({
    title: input.title.trim(),
    body: input.body,
  });
}`,
      },
      keyTakeaways: [
        "Validate untrusted input at runtime.",
        "Separate shape validation from business-rule validation.",
        "Use meaningful domain errors for expected failures.",
        "Never expose database internals or stack traces to end users.",
      ],
      commonMistakes: [
        "Validating only in the browser.",
        "Treating validation as a security boundary by itself.",
        "Returning raw database errors to users.",
      ],
      quiz: [
        {
          question: "Where should important business validation live?",
          options: [
            "Only in the browser.",
            "In the trusted server-side business layer.",
            "Only in CSS.",
            "Only inside the database UI.",
          ],
          correctIndex: 1,
          explanation:
            "Business rules must be enforced in trusted server-side code because browser validation can be bypassed.",
        },
      ],
    },

    {
      id: "transactions-and-connection-pooling",
      title: "Transactions and connection pooling in production",
      durationMinutes: 20,
      explanation: `
Transactions and connection management become especially important as an application handles more concurrent traffic.

### Transactions in the service layer

A service is often the right place to decide that several persistence operations form one business operation.

For example, creating an order may require:
1. creating the order;
2. creating order items;
3. reserving inventory;
4. recording an initial status.

The repository can provide transaction-aware operations, while the service defines the business transaction boundary.

### Connection pooling

A PostgreSQL server has a finite ability to handle connections. Opening a new connection for every query can create unnecessary overhead and eventually exhaust the database's connection capacity.

A connection pool maintains a controlled number of reusable connections.

The application checks out a connection, runs its query or transaction, and returns the connection to the pool.

### Pool sizing

More connections are not automatically better. Too many concurrent database connections can overwhelm PostgreSQL and increase contention.

The correct pool size depends on:
- database capacity;
- application instances;
- query duration;
- concurrency;
- hosting provider limits.

If the application runs multiple server instances, remember that each instance can have its own pool. A pool of 10 connections across 20 instances is potentially far more than 10 database connections.

### Transactions and pooled connections

A transaction must remain on the same database connection for its entire lifetime. Your ORM's transaction API normally handles this for you.
      `,
      diagram: `
Application instance
 |
 +--> Connection pool
 |      |
 |      +--> Conn 1
 |      +--> Conn 2
 |      +--> Conn 3
 |
 v
PostgreSQL
 |
 +--> max connection capacity
      `,
      codeExample: {
        title: "A service-controlled transaction",
        code: `export async function createOrder(input: CreateOrderInput) {
  validateCreateOrder(input);

  return db.transaction(async (tx) => {
    const order = await orderRepository.create(tx, {
      userId: input.userId,
    });

    await orderItemRepository.createMany(tx, {
      orderId: order.id,
      items: input.items,
    });

    await inventoryRepository.reserve(tx, input.items);

    return order;
  });
}`,
      },
      keyTakeaways: [
        "Business services can define transaction boundaries.",
        "Connection pools manage reusable database connections.",
        "More connections do not automatically mean better performance.",
        "Pool capacity must be considered across all application instances.",
      ],
      commonMistakes: [
        "Creating unlimited database connections.",
        "Using a separate database connection for each query inside one transaction.",
        "Sizing a pool without considering how many application instances exist.",
      ],
      quiz: [
        {
          question: "Why is connection pooling important?",
          options: [
            "It provides controlled reuse of database connections.",
            "It replaces PostgreSQL.",
            "It makes all queries parallel.",
            "It removes the need for transactions.",
          ],
          correctIndex: 0,
          explanation:
            "Pooling controls and reuses database connections instead of repeatedly creating uncontrolled connections.",
        },
      ],
    },

    {
      id: "production-data-flow",
      title: "End-to-end production data flow",
      durationMinutes: 18,
      explanation: `
The complete production data layer should make responsibility boundaries easy to understand.

A typical flow is:

UI
↓
Server Component
↓
Service
↓
Repository
↓
ORM
↓
PostgreSQL

For a mutation, the flow may also include:
- input validation;
- authorization;
- business rules;
- transaction;
- DTO mapping;
- cache invalidation;
- safe error mapping.

### Example: publishing a blog post

The UI sends a request to publish a post.

The server:
1. authenticates the user;
2. validates the input;
3. checks whether the user owns or can edit the post;
4. loads the post;
5. checks that its current status allows publishing;
6. updates the post inside the appropriate transaction;
7. invalidates affected cached data;
8. returns a safe result.

Each layer has a clear responsibility.

### Avoiding over-engineering

A production architecture does not mean every function needs an interface, factory, repository, service, DTO, and five wrappers.

The architecture should reduce complexity, not create it.

Use a repository when persistence abstraction is useful. Use a service when business rules or multi-step operations exist. Use DTOs when you need a controlled data boundary. Use transactions when atomicity is required.
      `,
      diagram: `
UI
 |
 v
Server Component / Action
 |
 +--> Authentication
 |
 +--> Validation
 |
 v
Service
 |
 +--> Business rules
 |
 +--> Transaction
 |
 v
Repository
 |
 v
ORM
 |
 v
PostgreSQL
 |
 v
Result
 |
 +--> DTO
 |
 +--> Cache invalidation
 |
 v
UI
      `,
      codeExample: {
        title: "A complete service flow",
        code: `export async function publishPost(
  input: PublishPostInput,
  currentUserId: number
) {
  const data = validatePublishInput(input);

  const post = await postRepository.findById(data.postId);

  if (!post) {
    throw new PostNotFoundError();
  }

  if (post.authorId !== currentUserId) {
    throw new ForbiddenError();
  }

  if (post.status !== "draft") {
    throw new InvalidPostStateError();
  }

  const published = await db.transaction(async (tx) => {
    return postRepository.publish(tx, post.id);
  });

  // Invalidate affected cached post data after success.
  revalidateTag(\`post:\${post.id}\`);

  return toPostDto(published);
}`,
      },
      keyTakeaways: [
        "A production data layer should have clear responsibility boundaries.",
        "Authentication, authorization, validation, business rules, persistence, and caching are separate concerns.",
        "Transactions protect multi-step database operations.",
        "DTOs control the data returned across boundaries.",
        "Good architecture reduces complexity instead of adding abstraction for its own sake.",
      ],
      commonMistakes: [
        "Letting UI components directly perform complex database mutations.",
        "Forgetting authorization because the route is already protected by authentication.",
        "Invalidating cache before the transaction succeeds.",
        "Returning raw ORM/database objects to the UI.",
      ],
      quiz: [
        {
          question: "Which sequence best represents the target architecture?",
          options: [
            "UI -> PostgreSQL -> Browser",
            "UI -> Server Component -> Service -> Repository/ORM -> PostgreSQL",
            "UI -> CSS -> ORM",
            "Browser -> PostgreSQL directly",
          ],
          correctIndex: 1,
          explanation:
            "The layered architecture keeps rendering, business logic, persistence, and database responsibilities separate.",
        },
      ],
    },
  ],

  finalQuiz: [
    {
      question: "What is the main purpose of a service layer?",
      options: [
        "To contain business operations and rules.",
        "To render CSS.",
        "To replace PostgreSQL.",
        "To expose database credentials.",
      ],
      correctIndex: 0,
      explanation:
        "Services provide a trusted place for application-level business logic.",
    },
    {
      question: "What is the main purpose of a repository?",
      options: [
        "To own persistence and database access details.",
        "To render React components.",
        "To authenticate browsers.",
        "To replace validation.",
      ],
      correctIndex: 0,
      explanation:
        "Repositories provide a persistence boundary around database operations.",
    },
    {
      question: "Why use DTOs?",
      options: [
        "To control and document the shape of data crossing a boundary.",
        "To create database connections.",
        "To make every request static.",
        "To replace all runtime validation.",
      ],
      correctIndex: 0,
      explanation:
        "DTOs define the data shape exposed to another layer or consumer.",
    },
    {
      question: "Where should business validation be enforced?",
      options: [
        "Only in browser JavaScript.",
        "In trusted server-side business logic.",
        "Only in CSS.",
        "Only in URL query strings.",
      ],
      correctIndex: 1,
      explanation:
        "Client validation improves UX but cannot be the only enforcement point.",
    },
    {
      question: "Why must connection pooling be considered across application instances?",
      options: [
        "Each instance can maintain its own pool, increasing total database connections.",
        "Pools only exist in browsers.",
        "PostgreSQL automatically merges all application pools.",
        "Connection count has no effect on databases.",
      ],
      correctIndex: 0,
      explanation:
        "A pool is generally local to an application process/instance, so total connections can grow with the number of instances.",
    },
  ],

  project: {
    name: "Production blog data layer",
    goal: "Build a layered production-style data architecture for a blog.",
    brief:
      "Refactor the Day 14 blog into a clear UI -> Server Component -> Service -> Repository/ORM -> PostgreSQL architecture. Add validation, DTOs, authorization, transactions, safe errors, and cache invalidation.",
    steps: [
      "Create server-only repository functions for users, posts, and comments.",
      "Create a post service containing business rules.",
      "Create DTOs for post data returned to the UI.",
      "Add runtime validation for create and update inputs.",
      "Add authorization checks before mutations.",
      "Use a transaction for a multi-step post operation.",
      "Configure a controlled PostgreSQL connection pool.",
      "Map expected domain errors to safe user-facing messages.",
      "Invalidate the appropriate cached post data after successful mutations.",
      "Keep the Server Component focused on data requirements and rendering rather than database implementation details.",
    ],
    acceptance: [
      "The UI does not contain direct ORM queries.",
      "Business rules live in a service layer.",
      "Database access is isolated behind repositories/data-access functions.",
      "Mutation input is validated at runtime.",
      "Authorization is enforced server-side.",
      "At least one multi-step operation uses a transaction.",
      "DTOs prevent unnecessary database fields from crossing the boundary.",
      "Database connections are managed through a pool.",
      "Expected errors are safe and understandable.",
    ],
    stretch: [
      "Add structured server-side logging with request IDs.",
      "Add repository integration tests against PostgreSQL.",
      "Add an outbox table for a post-published event.",
      "Document the connection-pool sizing assumptions for multiple application instances.",
    ],
  },
};
