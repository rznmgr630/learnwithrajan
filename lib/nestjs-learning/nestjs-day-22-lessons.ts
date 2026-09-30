import type { LessonDay } from "@/lib/learn/lesson-types";

export const NESTJS_DAY_22_LESSONS: LessonDay = {
  day: 22,
  title: "Configuration",
  totalMinutes: 105,
  difficulty: "Intermediate",
  lessons: [
    {
      id: "environment-variables",
      title: "Environment variables",
      durationMinutes: 18,
      explanation: `Imagine that you are building an online store.

During development, your application might connect to a local database:

\`\`\`env
DATABASE_HOST=localhost
DATABASE_PORT=5432
\`\`\`

But when you deploy the same application to production, the database could be somewhere completely different:

\`\`\`env
DATABASE_HOST=production-db.example.com
DATABASE_PORT=5432
\`\`\`

You do not want to change your TypeScript source code every time the environment changes.

This is where <b>environment variables</b> become useful.

An environment variable is simply a value provided to your application from the environment where it is running.

In Node.js, you can access environment variables through <code>process.env</code>.

For example:

<code>process.env.PORT</code>

If the operating system contains:

<code>PORT=3000</code>

then Node.js can read it through:

<code>process.env.PORT</code>

There is one important thing beginners should understand: environment variables arrive as strings.

So if you have:

<code>PORT=3000</code>

then this:

<code>process.env.PORT</code>

is the string <code>"3000"</code>, not the number <code>3000</code>.

This matters when your application expects a number.

For a small application, you could read values directly from <code>process.env</code>. But as the application grows, doing this everywhere becomes messy.

You might end up with database code reading <code>process.env.DATABASE_HOST</code>, authentication code reading <code>process.env.JWT_SECRET</code>, email code reading <code>process.env.SMTP_HOST</code>, and payment code reading <code>process.env.STRIPE_SECRET_KEY</code>.

NestJS gives us a cleaner solution through the <code>@nestjs/config</code> package.

The package can load environment variables and expose them through <code>ConfigService</code>.

A typical NestJS application can have:

\`\`\`text
.env
ConfigModule
ConfigService
feature services
\`\`\`text

The flow becomes much easier to understand:

\`\`\`text
Environment
    |
    | PORT=3000
    | DATABASE_HOST=localhost
    v
ConfigModule
    |
    v
ConfigService
    |
    +----> UsersService
    |
    +----> ProductsService
    |
    +----> OrdersService
\`\`\`

<b>Real-world example:</b>

Suppose your application sends emails.

Your local environment might use:

<code>SMTP_HOST=localhost</code>

Your staging environment might use:

<code>SMTP_HOST=staging-mail.example.com</code>

Production might use:

<code>SMTP_HOST=production-mail.example.com</code>

The email service should not contain different hard-coded values for each environment.

Instead, the environment provides the value and the application reads it.

NestJS's <code>@nestjs/config</code> package loads a root <code>.env</code> file by default and merges it with environment variables supplied by the runtime. Runtime environment variables take precedence unless the configuration is set to allow the .env file to override them. The current documentation also supports loading a custom env file path and ignoring the env file entirely when values are supplied by the runtime.
`,
      diagram: `                 Development
                     |
                     | .env
                     |
                     v
              +--------------+
              | ConfigModule |
              +--------------+
                     |
                     v
              +--------------+
              | ConfigService|
              +--------------+
                     |
          +----------+----------+
          |          |          |
          v          v          v
       Users      Products    Orders

                 Production
                     |
              Production env
                     |
                     v
              +--------------+
              | ConfigModule |
              +--------------+
                     |
                     v
              Same application code

The code stays the same.
The configuration changes.`,
      codeExample: {
        title: "Reading an environment variable",
        code: `// .env

PORT=3000
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_NAME=shop
DATABASE_USER=postgres
DATABASE_PASSWORD=secret
`,
      },
      keyTakeaways: [
        "Environment variables let configuration change without changing application code.",
        "Node.js exposes environment variables through process.env.",
        "Environment variables are strings by default.",
        "Do not hard-code environment-specific values into your application.",
        "NestJS provides @nestjs/config to manage configuration more cleanly.",
        "A .env file is useful for local development, but production secrets should normally be supplied by the deployment environment or a secret manager.",
      ],
      commonMistakes: [
        "<b>Assuming process.env.PORT is a number.</b> Environment variables are strings unless you convert or validate them.",
        "<b>Hard-coding database passwords.</b> Credentials should not be placed directly in source code.",
        "<b>Putting secrets into Git.</b> A .env file containing secrets should normally be excluded from version control.",
        "<b>Using different source code for development and production.</b> Prefer the same application code with environment-specific configuration.",
      ],
      quiz: [
        {
          question: "Where does Node.js expose environment variables?",
          options: [
            "`process.env`",
            "`process.config`",
            "`nestjs.env`",
            "`ConfigModule.env`",
          ],
          correctIndex: 0,
          explanation: "Node.js makes environment variables available through process.env.",
        },
        {
          question: "What type is `process.env.PORT` by default?",
          options: [
            "number",
            "boolean",
            "string",
            "object",
          ],
          correctIndex: 2,
          explanation: "Environment variables are provided as strings.",
        },
        {
          question: "Why use environment variables?",
          options: [
            "To make TypeScript faster",
            "To separate environment-specific configuration from application code",
            "To replace controllers",
            "To remove modules",
          ],
          correctIndex: 1,
          explanation: "Environment variables allow configuration to change without changing the application source code.",
        },
      ],
    },

    {
      id: "config-module",
      title: "ConfigModule",
      durationMinutes: 18,
      explanation: `The <code>ConfigModule</code> is the main entry point for configuration in a NestJS application.

You install the package first:

<code>npm install @nestjs/config</code>

Then you register the module in your root module.

The simplest version looks like this:

<code>ConfigModule.forRoot()</code>

The word <code>forRoot()</code> is important.

It means that you are configuring the module when your application starts.

When you call:

<code>ConfigModule.forRoot()</code>

NestJS loads the configuration and registers the <code>ConfigService</code> provider.

The simplest setup looks like this:

\`\`\`text
AppModule
    |
    +--> ConfigModule.forRoot()
    |
    +--> UsersModule
    |
    +--> ProductsModule
    |
    +--> OrdersModule
\`\`\`

Then your services can access configuration through <code>ConfigService</code>.

By default, <code>ConfigModule.forRoot()</code> looks for a <code>.env</code> file in the application's working directory. It also merges those values with values already available through <code>process.env</code>.


You can also make the configuration module global.

For example:

\`\`\`ts
ConfigModule.forRoot({
  isGlobal: true,
})
\`\`\`

A global module can be used across the application without repeatedly importing <code>ConfigModule</code> into every feature module.

This is convenient for configuration because many different parts of the application may need it.

Think about a large application:

\`\`\`text
ConfigModule
    |
    +--> DatabaseModule
    |
    +--> AuthModule
    |
    +--> EmailModule
    |
    +--> PaymentModule
    |
    +--> StorageModule
\`\`\`

All of these may need configuration.

If the configuration module is global, feature modules can inject <code>ConfigService</code> without separately importing <code>ConfigModule</code>.

NestJS also allows you to specify a custom env file.

For example:

\`\`\`ts
ConfigModule.forRoot({
  envFilePath: ".development.env",
})
\`\`\`

This can be useful when you intentionally maintain separate environment files.

You can also provide multiple paths when your configuration strategy requires it.

Another useful option is <code>ignoreEnvFile</code>.

For example:

\`\`\`ts
ConfigModule.forRoot({
  ignoreEnvFile: true,
})
\`\`\`

This tells the configuration system not to load a .env file. This can make sense when your deployment platform already provides all environment variables.

<b>Real-world example:</b>

Imagine you deploy your NestJS API to a cloud platform.

You do not necessarily want to upload a production <code>.env</code> file with your application.

Instead, the platform can provide:

\`\`\`text
DATABASE_URL
JWT_SECRET
REDIS_URL
STRIPE_SECRET_KEY
\`\`\`text

Your NestJS application simply reads them through the configuration system.

The application code stays identical between environments.

This is one of the main ideas behind configuration management: <b>code describes behavior; configuration describes the environment in which that behavior runs.</b>`,
      diagram: `Application starts
       |
       v
ConfigModule.forRoot()
       |
       +------> .env
       |
       +------> process.env
       |
       v
Configuration loaded
       |
       v
ConfigService registered
       |
       +------------+-------------+
       |            |             |
       v            v             v
   AuthService  UserService  DatabaseService`,
      codeExample: {
        title: "Registering ConfigModule",
        code: `import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
  ],
})
export class AppModule {}
`,
      },
      keyTakeaways: [
        "ConfigModule is provided by the @nestjs/config package.",
        "ConfigModule.forRoot() initializes configuration when the application starts.",
        "ConfigModule can load values from .env and the runtime environment.",
        "isGlobal: true makes ConfigModule available throughout the application.",
        "envFilePath lets you choose a different env file.",
        "ignoreEnvFile can be useful when configuration is supplied entirely by the deployment environment.",
      ],
      commonMistakes: [
        "<b>Forgetting to install @nestjs/config.</b> ConfigModule and ConfigService come from that package.",
        "<b>Calling ConfigModule.forRoot() in every feature module.</b> Normally initialize configuration once in the root module.",
        "<b>Assuming isGlobal means every environment variable becomes globally available.</b> It only makes the configuration module available for injection throughout the application.",
        "<b>Committing production secrets in .env.</b> Keep secrets out of source control.",
      ],
      quiz: [
        {
          question: "What initializes NestJS configuration?",
          options: [
            "ConfigModule.forRoot()",
            "ConfigService.start()",
            "EnvironmentModule.init()",
            "NestFactory.config()",
          ],
          correctIndex: 0,
          explanation: "ConfigModule.forRoot() initializes the configuration system.",
        },
        {
          question: "What does isGlobal: true do?",
          options: [
            "Makes every variable public",
            "Makes ConfigModule available throughout the application",
            "Makes the server globally accessible",
            "Disables .env files",
          ],
          correctIndex: 1,
          explanation: "A global ConfigModule does not need to be imported again in every module.",
        },
      ],
    },

    {
      id: "config-service",
      title: "ConfigService",
      durationMinutes: 17,
      explanation: `Once <code>ConfigModule</code> has been registered, you normally do not want every service reading <code>process.env</code> directly.

Instead, inject <code>ConfigService</code>.

This follows the same dependency injection pattern you have already learned.

For example:

<code>constructor(
  private readonly configService: ConfigService,
) {}</code>

Then you can read a value:

<code>this.configService.get<string>("DATABASE_HOST")</code>

The flow is:

\`\`\`text
Service
   |
   | asks for ConfigService
   v
Nest DI container
   |
   v
ConfigService
   |
   v
configuration value
\`\`\`

This is much cleaner than scattering <code>process.env</code> throughout your application.

You can also provide a default value.

For example:

<code>this.configService.get<number>("PORT", 3000)</code>

If <code>PORT</code> does not exist, the default value can be used.

You can also read nested configuration values.

For example, if your configuration looks like:

<code>{
  database: {
    host: "localhost",
    port: 5432
  }
}</code>

you can read:

<code>configService.get<string>("database.host")</code>

or:

<code>configService.get<number>("database.port")</code>

This becomes particularly useful when your application gets larger.

Instead of having hundreds of unrelated top-level configuration variables, you can organize them into logical areas.

For example:

\`\`\`text
database.host
database.port
database.name

auth.jwtSecret
auth.expiresIn

mail.host
mail.port

storage.bucket
storage.region
\`\`\`

<b>Beginner example:</b>

Your UsersService needs the API URL.

Instead of:

<code>const url = process.env.USER_SERVICE_URL;</code>

you can use:

<code>const url = this.configService.get<string>("USER_SERVICE_URL");</code>

<b>More realistic example:</b>

Suppose your payment service needs three settings:

\`\`\`text
PAYMENT_API_URL
PAYMENT_TIMEOUT
PAYMENT_MODE
\`\`\`text

Injecting ConfigService gives the payment service one clear dependency for configuration.

<b>Advanced example:</b>

You can also type your configuration so TypeScript can help catch invalid keys.

The current NestJS documentation supports using generic typing with <code>ConfigService</code> to describe known configuration properties.


The important idea is not that ConfigService magically makes values safe. You still need proper validation and conversion.

Configuration should ideally be:

loaded
    |
validated
    |
transformed
    |
consumed

rather than:

loaded
    |
used everywhere
    |
application crashes later

That distinction becomes extremely important in production.`,
      diagram: `UsersService
     |
     | constructor injection
     v
ConfigService
     |
     +--> PORT
     |
     +--> DATABASE_HOST
     |
     +--> JWT_SECRET
     |
     +--> database.host
     |
     +--> database.port

The service does not need to know
where the configuration came from.`,
      codeExample: {
        title: "Injecting ConfigService",
        code: `import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class DatabaseService {
  constructor(
    private readonly configService: ConfigService,
  ) {}

  connect() {
    const host = this.configService.get<string>(
      "DATABASE_HOST",
    );

    const port = this.configService.get<number>(
      "DATABASE_PORT",
      5432,
    );

    console.log({
      host,
      port,
    });
  }
}`,
      },
      keyTakeaways: [
        "ConfigService is the normal way to read configuration inside NestJS services.",
        "Inject ConfigService through the constructor.",
        "Use get() to read configuration values.",
        "You can provide a default value to get().",
        "ConfigService can read nested configuration keys.",
        "Configuration access becomes easier to test when it is injected as a dependency.",
      ],
      commonMistakes: [
        "<b>Reading process.env everywhere.</b> Centralizing access through ConfigService gives your application a cleaner configuration boundary.",
        "<b>Assuming ConfigService converts every value automatically.</b> Environment variables start as strings unless your validation/configuration layer transforms them.",
        "<b>Using get() without thinking about missing values.</b> Required configuration should be validated at startup.",
        "<b>Putting configuration logic into every service.</b> Complex conversion and organization can be moved into configuration factories.",
      ],
      quiz: [
        {
          question: "How do you normally use ConfigService in a service?",
          options: [
            "Extend ConfigService",
            "Inject it through the constructor",
            "Create a global variable",
            "Import process.env",
          ],
          correctIndex: 1,
          explanation: "ConfigService is a provider and can be injected through NestJS dependency injection.",
        },
        {
          question: "What does get() do?",
          options: [
            "Creates a controller",
            "Reads a configuration value",
            "Starts the application",
            "Validates a DTO",
          ],
          correctIndex: 1,
          explanation: "ConfigService.get() reads a configuration value.",
        },
      ],
    },

    {
      id: "environment-specific-configuration",
      title: "Environment-specific configuration",
      durationMinutes: 15,
      explanation: `A real application usually runs in more than one environment.

At minimum, you might have:

Development
Staging
Production

You may also have:

Testing
Preview
Local development
CI/CD

The application logic should usually remain the same, while the configuration changes.

For example:

Development:

<code>DATABASE_HOST=localhost</code>

Staging:

<code>DATABASE_HOST=staging-db.internal</code>

Production:

<code>DATABASE_HOST=production-db.internal</code>

The same <code>DatabaseService</code> can run in all three environments.

This is a very important professional development pattern.

You do not want:

<code>if production then use this database</code>

scattered across your application.

Instead, you want:

Environment
    |
    v
Configuration
    |
    v
Application

The application asks:

"What database host should I use?"

Configuration answers that question.

<b>Beginner example:</b>

You want the API to run on port 3000 locally but another port in production.

Your code can simply read:

<code>PORT</code>

The environment decides the actual value.

<b>Intermediate example:</b>

Your application has different logging levels.

Development:

<code>LOG_LEVEL=debug</code>

Production:

<code>LOG_LEVEL=info</code>

Your logging code does not need to know whether it is running locally or in production.

It simply receives the configured log level.

<b>Advanced example:</b>

Imagine an e-commerce application with:

development
    |
    +--> local PostgreSQL
    +--> fake payment provider
    +--> console email
    +--> verbose logs

staging
    |
    +--> staging PostgreSQL
    +--> payment sandbox
    +--> test email service
    +--> normal logs

production
    |
    +--> production PostgreSQL
    +--> real payment provider
    +--> production email service
    +--> structured logs

The business logic should remain mostly the same.

Only configuration changes.

NestJS supports custom env file paths, and the current documentation also supports using the runtime environment directly when you do not want Nest to load a .env file.


One important production lesson: do not treat <code>.env.production</code> as a magical security system. The important thing is that sensitive production values are supplied securely and are not accidentally committed to source control.`,
      diagram: `                  Same NestJS code
                         |
             +-----------+-----------+
             |           |           |
             v           v           v
        Development   Staging    Production
             |           |           |
             v           v           v
        localhost    staging DB   production DB
        fake payment sandbox      real payment
        debug logs   normal logs  production logs`,
      codeExample: {
        title: "Environment-specific values",
        code: `// .env

NODE_ENV=development
PORT=3000
LOG_LEVEL=debug
PAYMENT_MODE=test
DATABASE_HOST=localhost
`,
      },
      keyTakeaways: [
        "The same application can run in multiple environments.",
        "Configuration should change between environments instead of duplicating application logic.",
        "Development, staging, and production often need different databases, services, logging levels, and credentials.",
        "Do not put environment-specific values directly into business logic.",
        "Production secrets should be supplied securely by the deployment environment or a secrets system.",
      ],
      commonMistakes: [
        "<b>Hard-coding production URLs.</b> Production-specific values belong in configuration.",
        "<b>Using production credentials locally.</b> Local development should use safe development credentials.",
        "<b>Assuming .env files are automatically secure.</b> A .env file is just a file; protect it and avoid committing secrets.",
        "<b>Duplicating business logic for each environment.</b> Prefer configuration differences over code differences.",
      ],
      quiz: [
        {
          question: "What should normally change between development and production?",
          options: [
            "The entire business logic",
            "Configuration",
            "All controllers",
            "All DTOs",
          ],
          correctIndex: 1,
          explanation: "The same application code can use different configuration for different environments.",
        },
        {
          question: "Why might staging use a different payment configuration?",
          options: [
            "To test against a safe payment environment",
            "Because controllers cannot run in staging",
            "Because NestJS requires two applications",
            "Because TypeScript requires it",
          ],
          correctIndex: 0,
          explanation: "Staging commonly uses sandbox or test integrations instead of real production services.",
        },
      ],
    },

    {
      id: "configuration-validation",
      title: "Configuration validation",
      durationMinutes: 16,
      explanation: `Configuration bugs can be painful because they often appear only after the application starts.

Imagine your application requires:

\`\`\`text
DATABASE_URL
JWT_SECRET
PAYMENT_API_KEY
\`\`\`text

You deploy the application.

Everything compiles.

NestJS starts.

Then a user tries to log in and the application crashes because <code>JWT_SECRET</code> was never configured.

This is exactly the kind of problem configuration validation is designed to prevent.

Instead of discovering the problem when a request arrives, you want the application to fail during startup.

The desired flow is:

Application starts
       |
       v
Load environment variables
       |
       v
Validate configuration
       |
       +---- invalid ----> Stop startup
       |
       v
Configuration is valid
       |
       v
Start application

This is called <b>fail fast</b>.

If the application cannot run safely without a required configuration value, it is usually better to discover that immediately.

The current NestJS configuration package supports schema-based validation. The current documentation shows examples using Zod and also supports a custom <code>validate()</code> function.


For example, with Zod:

<code>PORT</code> should be a number.

<code>NODE_ENV</code> should be one of a known set of values.

<code>JWT_SECRET</code> should be required.

Because environment variables are strings, Zod's <code>z.coerce.number()</code> can convert a string such as <code>"3000"</code> into the number <code>3000</code>.


This is much safer than manually converting values throughout your application.

<b>Beginner real-world example:</b>

Your application requires a port.

Without validation:

<code>PORT=hello</code>

The application might not behave as expected.

With validation:

<code>PORT=hello</code>

The application rejects the configuration during startup.

<b>Intermediate example:</b>

Your application accepts only:

\`\`\`text
development
test
production
\`\`\`text

If somebody writes:

<code>NODE_ENV=prodution</code>

the application should fail immediately instead of silently behaving incorrectly.

<b>Advanced example:</b>

A payment service might require:

<code>PAYMENT_MODE</code> = test or live

If <code>PAYMENT_MODE=live</code>, the application may require:

<code>PAYMENT_SECRET_KEY</code>

You can make configuration rules depend on other configuration values.

The general idea is:

Raw environment variables
        |
        v
Validation
        |
        v
Transformation
        |
        v
Application configuration

This is much safer than letting every service interpret raw strings independently.`,
      diagram: `                 Application startup
                         |
                         v
                Read environment
                         |
                         v
                Validate schema
                    /       \\
                   /         \\
               valid        invalid
                 |             |
                 v             v
          Build config      Throw error
                 |             |
                 v             v
          Start NestJS      Stop startup`,
      codeExample: {
        title: "Validating configuration with Zod",
        code: `import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { z } from "zod";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,

      validationSchema: z.object({
        NODE_ENV: z
          .enum(["development", "test", "production"])
          .default("development"),

        PORT: z
          .coerce
          .number()
          .int()
          .positive()
          .default(3000),

        DATABASE_URL: z
          .string()
          .min(1),

        JWT_SECRET: z
          .string()
          .min(32),
      }),
    }),
  ],
})
export class AppModule {}
`,
      },
      keyTakeaways: [
        "Configuration validation catches problems during application startup.",
        "Fail-fast behavior is usually better than discovering missing configuration during a user request.",
        "Environment variables arrive as strings, so validation can also perform useful type conversion.",
        "Zod is supported by the current NestJS configuration package.",
        "Required configuration should be explicitly required.",
        "Known values such as environment names can be restricted to an allowed set.",
      ],
      commonMistakes: [
        "<b>Checking required variables manually inside random services.</b> Centralize startup validation.",
        "<b>Assuming compilation validates environment variables.</b> TypeScript cannot know what production environment variables will exist at runtime.",
        "<b>Forgetting type conversion.</b> PORT from the environment starts as a string.",
        "<b>Giving every required variable a fake default.</b> A default should be used only when there is a safe and meaningful default.",
      ],
      quiz: [
        {
          question: "When should required configuration ideally be validated?",
          options: [
            "After the first user request",
            "During application startup",
            "Only in the frontend",
            "Only during TypeScript compilation",
          ],
          correctIndex: 1,
          explanation: "Startup validation lets the application fail fast when required configuration is missing or invalid.",
        },
        {
          question: "Why is z.coerce.number() useful for PORT?",
          options: [
            "It turns an environment string into a number",
            "It creates a database",
            "It encrypts PORT",
            "It creates a controller",
          ],
          correctIndex: 0,
          explanation: "Environment variables are strings, so coercion converts the value into the expected numeric type.",
        },
      ],
    },

    {
      id: "secrets",
      title: "Secrets and sensitive configuration",
      durationMinutes: 14,
      explanation: `Not every configuration value has the same sensitivity.

Consider these examples:

<code>PORT=3000</code>

This is configuration, but it is not normally a secret.

Now consider:

<code>DATABASE_PASSWORD=super-secret-password</code>

or:

<code>JWT_SECRET=...</code>

or:

<code>STRIPE_SECRET_KEY=...</code>

These are sensitive values.

We call them <b>secrets</b>.

A secret is information that should not be exposed to people or systems that do not need access to it.

A common beginner mistake is putting secrets directly into source code:

<code>const jwtSecret = "my-super-secret-key";</code>

This is dangerous because source code is often:

committed to Git
shared with teammates
uploaded to GitHub
included in backups
reviewed in pull requests
stored in CI systems

Once a secret enters source control, removing it from the latest file does not necessarily remove it from the entire Git history.

A better approach is:

Secret manager / deployment environment
              |
              v
        Environment variable
              |
              v
        ConfigModule
              |
              v
         ConfigService
              |
              v
          Application

<b>Beginner example:</b>

Instead of:

<code>JWT_SECRET = "abc123"</code>

use:

<code>JWT_SECRET=...</code>

and load it from the environment.

<b>Intermediate example:</b>

Your production deployment platform stores:

<code>DATABASE_PASSWORD</code>

as a protected secret.

The NestJS application receives it at runtime.

The source code never contains the actual password.

<b>Advanced real-world example:</b>

A large company may use a dedicated secrets management system.

The deployment process retrieves secrets securely and makes them available to the application.

The application does not need to know where the secret originally came from.

This gives you a useful separation:

Application code
    |
    | needs database password
    v
Configuration
    |
    v
Runtime secret
    |
    v
Database

Another important rule is: <b>do not log secrets.</b>

For example, avoid:

<code>console.log(configService.get("JWT_SECRET"));</code>

Even if you do not commit the secret to Git, logging it can expose it through application logs.

Also be careful with error messages, debugging tools, monitoring systems, and request logging.

The secret should be used only where it is actually needed.`,
      diagram: `Secret Manager / Deployment Platform
                  |
                  | secret value
                  v
           Environment
                  |
                  v
            ConfigModule
                  |
                  v
            ConfigService
                  |
          +-------+-------+
          |               |
          v               v
      AuthService     DatabaseService

Secret should NOT flow into:
- Git repository
- frontend code
- logs
- error messages
- public API responses`,
      codeExample: {
        title: "Using a secret without hard-coding it",
        code: `import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class AuthService {
  constructor(
    private readonly configService: ConfigService,
  ) {}

  createTokenPayload(userId: string) {
    const secret = this.configService.get<string>(
      "JWT_SECRET",
    );

    if (!secret) {
      throw new Error("JWT_SECRET is not configured");
    }

    return {
      userId,
    };
  }
}
`,
      },
      keyTakeaways: [
        "Secrets are sensitive configuration values such as passwords, private keys, and API keys.",
        "Do not hard-code secrets in source code.",
        "Do not commit secrets to Git repositories.",
        "Do not expose secrets to frontend code or API responses.",
        "Avoid logging secrets.",
        "Production applications commonly receive secrets from the deployment environment or a dedicated secrets manager.",
      ],
      commonMistakes: [
        "<b>Putting API keys directly in TypeScript.</b> Use runtime configuration instead.",
        "<b>Committing .env files containing secrets.</b> Keep sensitive local configuration out of source control.",
        "<b>Returning secrets from an API endpoint.</b> Configuration values should never accidentally become response data.",
        "<b>Logging ConfigService values during debugging.</b> Be especially careful with passwords, tokens, and private keys.",
      ],
      quiz: [
        {
          question: "Which is usually a secret?",
          options: [
            "PORT",
            "JWT_SECRET",
            "APP_NAME",
            "LOG_LEVEL",
          ],
          correctIndex: 1,
          explanation: "JWT_SECRET is sensitive and should be protected.",
        },
        {
          question: "Where should production secrets ideally come from?",
          options: [
            "Hard-coded TypeScript",
            "Public GitHub repository",
            "Secure deployment environment or secrets manager",
            "Frontend localStorage",
          ],
          correctIndex: 2,
          explanation: "Production secrets should be supplied through secure runtime configuration or secret-management systems.",
        },
      ],
    },

    {
      id: "configuration-factories",
      title: "Configuration factories and namespaced configuration",
      durationMinutes: 18,
      explanation: `As your application grows, a huge collection of environment variables can become difficult to manage.

Imagine this:

\`\`\`text
DATABASE_HOST
DATABASE_PORT
DATABASE_NAME
DATABASE_USER
JWT_SECRET
JWT_EXPIRES_IN
SMTP_HOST
SMTP_PORT
SMTP_USER
S3_BUCKET
S3_REGION
S3_ENDPOINT
PAYMENT_API_URL
PAYMENT_SECRET_KEY
\`\`\`text

There is nothing inherently wrong with environment variables, but your application code should not have to understand every raw environment variable.

This is where <b>configuration factories</b> become useful.

A configuration factory is a function that reads environment variables and creates a structured configuration object.

For example:

\`\`\`text
database.host
database.port
database.name
\`\`\`text

instead of:

\`\`\`text
DATABASE_HOST
DATABASE_PORT
DATABASE_NAME
\`\`\`text

The factory acts as a translation layer.

Environment
    |
    | DATABASE_HOST
    | DATABASE_PORT
    | DATABASE_NAME
    v
Configuration factory
    |
    v
{
  database: {
    host,
    port,
    name
  }
}
    |
    v
Application

This gives you a place to:

convert strings into numbers
provide safe defaults
organize related values
normalize values
perform custom validation
hide raw environment variable names from the rest of the application

The current NestJS documentation supports custom configuration files through the <code>load</code> option. It also supports namespaced configuration through <code>registerAs()</code>.


<b>Beginner example:</b>

Create:

<code>config/database.config.ts</code>

and return:

<code>{
  host: process.env.DATABASE_HOST,
  port: Number(process.env.DATABASE_PORT),
}</code>

Now database-related settings have one home.

<b>Intermediate example:</b>

Use <code>registerAs("database", ...)</code>.

Now the configuration can be accessed using:

<code>database.host</code>

and:

<code>database.port</code>

<b>Advanced example:</b>

You can strongly type a namespaced configuration and inject it using its configuration key.

This is useful in larger applications because the database service can depend on a database configuration object rather than knowing dozens of unrelated environment variable names.

You can think about it like this:

Bad separation:

DatabaseService
    |
    +--> process.env.DATABASE_HOST
    +--> process.env.DATABASE_PORT
    +--> process.env.DATABASE_USER
    +--> process.env.DATABASE_PASSWORD
    +--> process.env.DATABASE_NAME

Better separation:

Environment
    |
    v
Database configuration factory
    |
    v
DatabaseConfig
    |
    v
DatabaseService

The database service only cares about database configuration.

It does not care whether the value came from a .env file, Docker, Kubernetes, a cloud deployment platform, or a secrets manager.

That is a powerful architectural boundary.

One important current NestJS detail is that configuration loaded through custom configuration files is not automatically validated by the root <code>validationSchema</code> in the same way as raw environment variables. If you need validation or transformation for values created inside a configuration factory, perform that logic inside the factory itself.


For larger applications, this distinction is very useful:

Raw environment validation
        |
        v
Environment variables are valid

Configuration factory
        |
        v
Application-specific configuration is valid

Both layers can have responsibilities.`,
      diagram: `                    process.env
                         |
          +--------------+--------------+
          |              |              |
          v              v              v
     DATABASE_*       JWT_*          SMTP_*
          |              |              |
          v              v              v
   database.config  auth.config   mail.config
          |              |              |
          +--------------+--------------+
                         |
                         v
                   ConfigModule
                         |
                         v
                   ConfigService
                         |
       +-----------------+------------------+
       |                 |                  |
       v                 v                  v
 DatabaseService    AuthService       MailService`,
      codeExample: {
        title: "A namespaced database configuration",
        code: `// config/database.config.ts

import { registerAs } from "@nestjs/config";

export default registerAs("database", () => ({
  host: process.env.DATABASE_HOST,
  port: Number(process.env.DATABASE_PORT ?? 5432),
  name: process.env.DATABASE_NAME,
  username: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
}));
`,
      },
      keyTakeaways: [
        "Configuration factories turn raw environment variables into structured application configuration.",
        "Factories are useful for organizing related configuration.",
        "Factories can convert strings into useful application types.",
        "registerAs() can create a named configuration namespace.",
        "Namespaced configuration makes large applications easier to organize.",
        "Configuration factories are a good place for configuration-specific transformation and validation.",
        "The current NestJS docs note that custom configuration files are not automatically validated by the root environment validation schema, so factory-created configuration may need its own validation.",
      ],
      commonMistakes: [
        "<b>Putting all configuration in one enormous object.</b> Split configuration by responsibility as the application grows.",
        "<b>Leaving every service dependent on raw process.env names.</b> Use configuration factories to create clearer boundaries.",
        "<b>Assuming validationSchema validates custom configuration objects automatically.</b> Factory-created values may need their own validation.",
        "<b>Doing business logic inside configuration factories.</b> Configuration factories should prepare configuration, not implement application behavior.",
      ],
      quiz: [
        {
          question: "What is the main purpose of a configuration factory?",
          options: [
            "Create controllers",
            "Turn environment values into organized application configuration",
            "Handle HTTP requests",
            "Create database records",
          ],
          correctIndex: 1,
          explanation: "A configuration factory provides a structured configuration layer between raw environment variables and application code.",
        },
        {
          question: "What does registerAs() help create?",
          options: [
            "A configuration namespace",
            "A controller route",
            "A DTO",
            "A database table",
          ],
          correctIndex: 0,
          explanation: "registerAs() creates a named configuration namespace.",
        },
        {
          question: "Where can configuration-specific transformation happen?",
          options: [
            "Only inside controllers",
            "Inside a configuration factory",
            "Only inside DTOs",
            "Only inside middleware",
          ],
          correctIndex: 1,
          explanation: "A configuration factory is a natural place to transform and organize raw environment values.",
        },
      ],
    },

    {
      id: "configuration-real-world-architecture",
      title: "Putting configuration together in a real application",
      durationMinutes: 19,
      explanation: `Now let's put everything together using the kind of application you have been building throughout this course.

Imagine your modular e-commerce API:

\`\`\`text
Users
Products
Orders
\`\`\`

Now the application grows and needs:

\`\`\`text
PostgreSQL
JWT authentication
Redis
Email
Object storage
Payments
\`\`\`

You could simply create dozens of environment variables and read them everywhere.

But a larger application benefits from a clear configuration architecture.

A practical structure could look like this:

\`\`\`text
src/
  config/
    database.config.ts
    auth.config.ts
    redis.config.ts
    mail.config.ts
    storage.config.ts
    payment.config.ts
\`\`\`

Then:

\`\`\`text
AppModule
    |
    +--> ConfigModule
            |
            +--> database
            +--> auth
            +--> redis
            +--> mail
            +--> storage
            +--> payment
\`\`\`

Feature modules then depend on the configuration they actually need.

For example:

\`\`\`text
OrdersModule
    |
    +--> PaymentService
             |
             v
       PaymentConfig

UsersModule
    |
    +--> AuthService
             |
             v
          AuthConfig
\`\`\`

This is much easier to maintain than having every service know the entire environment.

<b>Beginner real-world example:</b>

A small application only needs:

\`\`\`text
PORT
DATABASE_URL
\`\`\`text

You can start with <code>ConfigService.get()</code>.

There is no need to create ten configuration files on day one.

<b>Intermediate example:</b>

Your application now has:

\`\`\`text
database
auth
mail
\`\`\`

Create one configuration namespace for each.

Now the code has clear ownership.

<b>Advanced example:</b>

Your payment provider has different settings depending on the environment.

Development:

<code>PAYMENT_MODE=test</code>

Production:

<code>PAYMENT_MODE=live</code>

Your configuration factory can turn the raw environment variables into a configuration object such as:

<code>{
  mode: "live",
  apiUrl: "...",
  timeout: 5000
}</code>

The payment service does not need to know about <code>process.env</code>.

It simply receives configuration.

This is the architectural lesson:

Raw configuration
        |
        v
Validation
        |
        v
Transformation
        |
        v
Structured configuration
        |
        v
Dependency injection
        |
        v
Application services

Configuration is therefore not just "reading .env".

It is the process of safely getting environment-dependent values into the parts of your application that need them.

<b>Production example:</b>

Imagine deploying the API in Docker and then into Kubernetes.

The application image should ideally remain the same.

Development might use a local .env file.

Docker might inject environment variables.

Kubernetes might inject ConfigMaps and Secrets.

A cloud platform might inject runtime environment variables.

Your NestJS services should not care.

They should continue doing:

<code>configService.get("database.host")</code>

or receive a structured configuration object.

That is the benefit of a configuration abstraction.

The infrastructure can change without forcing your business logic to change.

<b>A useful mental model:</b>

Configuration is like the settings panel of your application.

The application says:

"I need to know which database to connect to."

Configuration says:

"Here is the database host, port, username, and password."

The application should not need to know whether those values came from:

\`\`\`text
a .env file
Docker
Kubernetes
a CI/CD pipeline
a cloud platform
a secret manager
\`\`\`

That separation is what makes configuration scalable.`,
      diagram: `                         Infrastructure
                              |
          +-------------------+-------------------+
          |                   |                   |
       .env file           Docker            Kubernetes
          |                   |                   |
          +-------------------+-------------------+
                              |
                              v
                         Environment
                              |
                              v
                      ConfigModule
                              |
              +---------------+---------------+
              |               |               |
              v               v               v
        Validation      Config Factories   Defaults
              |               |               |
              +---------------+---------------+
                              |
                              v
                      ConfigService
                              |
       +----------+-----------+-----------+----------+
       |          |           |           |          |
       v          v           v           v          v
     Auth      Database      Redis       Mail     Payment
       |          |           |           |          |
       v          v           v           v          v
   Services    Services    Services    Services   Services`,
      codeExample: {
        title: "A practical configuration setup",
        code: `// config/database.config.ts

import { registerAs } from "@nestjs/config";

export default registerAs("database", () => ({
  url: process.env.DATABASE_URL,
  poolSize: Number(process.env.DATABASE_POOL_SIZE ?? 10),
}));


// config/auth.config.ts

import { registerAs } from "@nestjs/config";

export default registerAs("auth", () => ({
  jwtSecret: process.env.JWT_SECRET,
  expiresIn: process.env.JWT_EXPIRES_IN ?? "15m",
}));


// app.module.ts

import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { z } from "zod";

import databaseConfig from "./config/database.config";
import authConfig from "./config/auth.config";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,

      load: [
        databaseConfig,
        authConfig,
      ],

      validationSchema: z.object({
        NODE_ENV: z
          .enum(["development", "test", "production"])
          .default("development"),

        PORT: z
          .coerce
          .number()
          .positive()
          .default(3000),

        DATABASE_URL: z
          .string()
          .min(1),

        JWT_SECRET: z
          .string()
          .min(32),

        JWT_EXPIRES_IN: z
          .string()
          .default("15m"),
      }),
    }),
  ],
})
export class AppModule {}
`,
      },
      keyTakeaways: [
        "Start simple and introduce configuration structure as the application grows.",
        "Use ConfigService for straightforward configuration access.",
        "Use configuration factories when configuration becomes more complex or needs organization.",
        "Use namespaces such as database, auth, mail, and payment to group related configuration.",
        "Validate required environment variables during startup.",
        "Keep secrets outside source code and avoid logging them.",
        "Your application should not care whether configuration came from .env, Docker, Kubernetes, or a cloud platform.",
        "Configuration creates a boundary between infrastructure and application code.",
      ],
      commonMistakes: [
        "<b>Overengineering configuration too early.</b> A small application can start with ConfigService and simple keys.",
        "<b>Putting business logic inside configuration files.</b> Configuration should prepare settings, not execute application workflows.",
        "<b>Allowing services to know infrastructure details.</b> Services should consume configuration rather than care where it came from.",
        "<b>Skipping startup validation.</b> Missing production configuration should be discovered before users start making requests.",
        "<b>Mixing secrets with normal public configuration.</b> Treat sensitive values differently and protect them.",
      ],
      quiz: [
        {
          question: "What is the main architectural benefit of configuration?",
          options: [
            "It removes the need for services",
            "It separates environment-specific values from application logic",
            "It replaces controllers",
            "It prevents all runtime errors",
          ],
          correctIndex: 1,
          explanation: "Configuration creates a boundary between environment-specific settings and application behavior.",
        },
        {
          question: "When is a configuration factory especially useful?",
          options: [
            "When configuration needs organization, transformation, or custom validation",
            "Only when creating controllers",
            "Only when using WebSockets",
            "Only when writing DTOs",
          ],
          correctIndex: 0,
          explanation: "Configuration factories are useful when raw environment variables need to become structured application configuration.",
        },
        {
          question: "What should happen when a required production secret is missing?",
          options: [
            "The application should silently use a random value",
            "The application should usually fail during startup",
            "The frontend should provide it",
            "The controller should create it",
          ],
          correctIndex: 1,
          explanation: "Failing during startup makes configuration problems visible before the application begins serving requests.",
        },
      ],
    },
  ],

  finalQuiz: [
    {
      question: "What does ConfigModule.forRoot() primarily do?",
      options: [
        "Creates database tables",
        "Initializes the NestJS configuration system",
        "Creates controllers",
        "Starts a WebSocket server",
      ],
      correctIndex: 1,
      explanation: "ConfigModule.forRoot() initializes the configuration system and registers the configuration providers.",
    },
    {
      question: "Where does Node.js expose environment variables?",
      options: [
        "`process.env`",
        "`process.config`",
        "`ConfigModule.env`",
        "`NestFactory.env`",
      ],
      correctIndex: 0,
      explanation: "Node.js exposes environment variables through process.env.",
    },
    {
      question: "What type are environment variables when read directly from process.env?",
      options: [
        "Numbers",
        "Booleans",
        "Strings",
        "Objects",
      ],
      correctIndex: 2,
      explanation: "Environment variables are represented as strings unless they are converted.",
    },
    {
      question: "How do you normally access configuration inside a NestJS service?",
      options: [
        "Inject ConfigService",
        "Create a global variable",
        "Create a new Nest application",
        "Use a controller parameter",
      ],
      correctIndex: 0,
      explanation: "ConfigService is a NestJS provider and can be injected through the constructor.",
    },
    {
      question: "What does `isGlobal: true` do for ConfigModule?",
      options: [
        "Makes secrets public",
        "Makes ConfigModule available throughout the application",
        "Makes every controller public",
        "Disables environment variables",
      ],
      correctIndex: 1,
      explanation: "A global ConfigModule can be used without repeatedly importing ConfigModule into feature modules.",
    },
    {
      question: "Why is configuration validation useful?",
      options: [
        "It replaces DTO validation",
        "It catches missing or invalid configuration during startup",
        "It removes the need for environment variables",
        "It makes all APIs public",
      ],
      correctIndex: 1,
      explanation: "Configuration validation helps the application fail fast when required runtime configuration is invalid.",
    },
    {
      question: "Why does PORT often need coercion?",
      options: [
        "Environment variables are strings",
        "Ports are always encrypted",
        "NestJS cannot read numbers",
        "Controllers require coercion",
      ],
      correctIndex: 0,
      explanation: "PORT arrives from the environment as a string, so it needs to be converted to a number when numeric behavior is required.",
    },
    {
      question: "Which value should normally be treated as a secret?",
      options: [
        "PORT",
        "LOG_LEVEL",
        "JWT_SECRET",
        "APP_NAME",
      ],
      correctIndex: 2,
      explanation: "JWT_SECRET is sensitive and should be protected.",
    },
    {
      question: "What is the purpose of a configuration factory?",
      options: [
        "To handle HTTP requests",
        "To transform and organize raw configuration into application-friendly configuration",
        "To replace services",
        "To create database rows",
      ],
      correctIndex: 1,
      explanation: "Configuration factories provide a structured layer between raw environment variables and application code.",
    },
    {
      question: "What does `registerAs()` help provide?",
      options: [
        "Configuration namespaces",
        "HTTP methods",
        "DTO validation",
        "Database migrations",
      ],
      correctIndex: 0,
      explanation: "registerAs() creates a named configuration namespace such as database or auth.",
    },
    {
      question: "Where should production secrets ideally be stored?",
      options: [
        "Hard-coded in TypeScript",
        "Public GitHub repository",
        "Secure deployment environment or secrets manager",
        "Frontend source code",
      ],
      correctIndex: 2,
      explanation: "Production secrets should be supplied securely at runtime rather than committed to source code.",
    },
    {
      question: "What is a good configuration architecture?",
      options: [
        "Every service directly reads random environment variables",
        "Environment values are loaded, validated, transformed, and exposed through configuration",
        "Controllers contain all secrets",
        "Frontend code provides database passwords",
      ],
      correctIndex: 1,
      explanation: "A configuration layer provides a clean boundary between runtime environment values and application services.",
    },
  ],

  project: {
    name: "Production-ready configuration system",
    goal: "Build a complete configuration system for the Users, Products, and Orders API you created earlier, including environment variables, validation, secrets, and namespaced configuration.",
    brief: `Take the e-commerce API from the previous days and replace scattered configuration values with a proper NestJS configuration architecture.

Your application should support development, test, and production environments.

The goal is not simply to create a .env file. Build the complete flow:

\`\`\`text
Environment
    ↓
ConfigModule
    ↓
Validation
    ↓
Configuration factories
    ↓
ConfigService / typed configuration
    ↓
Users / Products / Orders / Database / Auth / Payments
\`\`\`

By the end of the project, your business services should not need to know where configuration comes from.`,
    steps: [
      "Install the @nestjs/config package.",
      "Create a local .env file for development configuration.",
      "Create configuration values for PORT, NODE_ENV, DATABASE_URL, JWT_SECRET, JWT_EXPIRES_IN, and LOG_LEVEL.",
      "Register ConfigModule in AppModule.",
      "Make ConfigModule global so feature modules can inject ConfigService without repeatedly importing ConfigModule.",
      "Create a configuration validation schema using Zod.",
      "Make PORT a positive number with a sensible development default.",
      "Restrict NODE_ENV to development, test, or production.",
      "Require DATABASE_URL.",
      "Require JWT_SECRET and enforce a reasonable minimum length.",
      "Create a database configuration factory using registerAs().",
      "Create an auth configuration factory using registerAs().",
      "Create a payment configuration factory.",
      "Group database settings under a database namespace.",
      "Group authentication settings under an auth namespace.",
      "Group payment settings under a payment namespace.",
      "Convert numeric environment values such as database pool size and request timeout into numbers inside the configuration layer.",
      "Inject ConfigService into the database service.",
      "Inject ConfigService into the authentication service.",
      "Use namespaced configuration for at least one feature instead of reading raw process.env values.",
      "Remove direct process.env access from your business services where configuration can be provided through ConfigService or a configuration factory.",
      "Create separate development and production configuration strategies.",
      "Make sure production secrets are not committed to Git.",
      "Add .env files containing secrets to .gitignore where appropriate.",
      "Test what happens when JWT_SECRET is missing.",
      "Test what happens when PORT contains an invalid value.",
      "Test what happens when NODE_ENV contains an unsupported value.",
      "Test what happens when DATABASE_URL is missing.",
      "Start the application and verify that invalid configuration causes startup to fail clearly.",
      "Start the application with valid configuration and verify that the Users, Products, and Orders modules can still run.",
      "Add a small configuration endpoint only if you need one for debugging, but never return secrets from it.",
      "If you create a debug configuration endpoint, return only safe values such as NODE_ENV, PORT, and non-sensitive feature flags.",
      "Document which configuration values are required and which have defaults.",
      "Document where production secrets are expected to come from.",
    ],
    acceptance: [
      "The application uses @nestjs/config.",
      "ConfigModule is initialized from AppModule.",
      "ConfigModule is configured globally.",
      "The application validates required environment variables during startup.",
      "Invalid PORT values prevent the application from starting.",
      "An unsupported NODE_ENV value prevents the application from starting.",
      "Missing DATABASE_URL is detected during startup.",
      "Missing or invalid JWT_SECRET is detected during startup.",
      "Database configuration is organized under a database namespace.",
      "Authentication configuration is organized under an auth namespace.",
      "At least one configuration factory uses registerAs().",
      "At least one numeric environment value is transformed into a number.",
      "Business services use ConfigService or structured configuration instead of scattering process.env throughout the codebase.",
      "Secrets are not hard-coded in TypeScript source code.",
      "Secrets are not returned from API responses.",
      "Secrets are not printed in application logs.",
      "The same application code can run with different configuration values in development and production.",
      "Users, Products, and Orders modules continue to work after the configuration refactor.",
    ],
    stretch: [
      "Create separate database, auth, mail, storage, Redis, and payment configuration namespaces.",
      "Create strongly typed configuration interfaces for your namespaces.",
      "Inject a namespaced configuration object directly into a service instead of calling ConfigService.get() repeatedly.",
      "Create a custom configuration validation function for one complex configuration rule.",
      "Add a payment configuration rule where test mode and live mode require different settings.",
      "Add a configuration factory that validates a numeric range such as a timeout or connection pool size.",
      "Add feature flags such as ENABLE_SIGNUP or ENABLE_DISCOUNTS.",
      "Add environment variable expansion for related values where it makes sense.",
      "Create a safe /health/config endpoint that reports configuration status without exposing secrets.",
      "Add automated tests proving that invalid configuration prevents application startup.",
      "Run the application using Docker environment variables instead of a local .env file.",
      "Deploy the same application image with different configuration values for staging and production.",
      "Experiment with providing configuration through your deployment platform instead of a .env file.",
    ],
  },
};
