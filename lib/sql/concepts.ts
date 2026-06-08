export interface SqlConcept {
  id: number;
  section: string;
  title: string;
  tagline: string;
  description: string;
  example: string;
  tip: string;
}

export const SQL_SECTIONS = [
  "Basics",
  "Querying",
  "Relationships",
  "Constraints & Design",
  "Transactions",
] as const;

export const SQL_CONCEPTS: SqlConcept[] = [
  {
    id: 1,
    section: "Basics",
    title: "What is a Database?",
    tagline: "Structured storage for your app's data — not just a fancy spreadsheet.",
    description:
      "A database is an organised collection of data that can be stored, retrieved, and updated efficiently. Think of it like a digital filing cabinet: every drawer has a label, every folder has a name, and nothing gets lost.\n\nA spreadsheet (like Google Sheets) might look similar at first glance, but it breaks down quickly. It struggles with millions of rows, it has no real access control, and it can't enforce rules like 'this field must always have a value'. Databases solve all of that.\n\nRelational databases (the kind covered here) organise data into tables — rows and columns — just like a spreadsheet, but with a powerful query language (SQL) on top. Every major app you use — Instagram, Spotify, your bank — stores its data in a database.",
    example:
      "-- A spreadsheet might store your contacts like this:\n-- Name | Email | Phone\n-- Rajan | r@x.com | 123\n\n-- A database stores it in a structured table:\nCREATE TABLE contacts (\n  id        INT PRIMARY KEY AUTO_INCREMENT,\n  name      VARCHAR(100) NOT NULL,\n  email     VARCHAR(255) UNIQUE NOT NULL,\n  phone     VARCHAR(20)\n);",
    tip: "When someone asks 'why not just use a spreadsheet?', talk about scale, integrity, and concurrency. A spreadsheet with 10 users editing at once is chaos. A database handles thousands of concurrent writes safely.",
  },
  {
    id: 2,
    section: "Basics",
    title: "Tables & Rows",
    tagline: "Tables are the containers; rows are the individual records inside them.",
    description:
      "A table is the basic unit of storage in a relational database. You can think of it like a single sheet inside a spreadsheet workbook. Each table has a fixed set of columns that define what kind of data it holds.\n\nA row (also called a record or tuple) represents one specific thing in that table. If the table is 'users', each row is one user. If the table is 'orders', each row is one order. Rows are added, updated, and deleted as your application runs.\n\nA database usually contains many tables, and those tables can be linked together. For example, an e-commerce app might have a 'users' table, an 'orders' table, and a 'products' table — all related to each other.",
    example:
      "-- The 'users' table might look like this:\n-- id | name    | email           | created_at\n--  1 | Rajan   | r@x.com         | 2024-01-15\n--  2 | Aisha   | a@x.com         | 2024-01-16\n--  3 | Carlos  | c@x.com         | 2024-01-17\n\n-- Each line above is one ROW in the users table.",
    tip: "A good mental model: a database is a workbook, a table is a sheet, and a row is a single data entry in that sheet. This analogy breaks down at scale, but it is perfect for getting started.",
  },
  {
    id: 3,
    section: "Basics",
    title: "Columns & Data Types",
    tagline: "Columns define the shape of your data; data types enforce what's allowed.",
    description:
      "Every column in a table has a name and a data type. The data type tells the database what kind of value can be stored in that column — a number, a piece of text, a date, etc. This is how the database protects your data from being saved incorrectly.\n\nThe most common data types are:\n- INT — whole numbers (age, count, quantity)\n- VARCHAR(n) — variable-length text up to n characters (name, email, status)\n- TEXT — unlimited text (blog posts, comments)\n- BOOLEAN — true or false (is_active, is_verified)\n- DATE — a calendar date (2024-01-15)\n- TIMESTAMP — a date and time (2024-01-15 09:30:00)\n\nChoosing the right data type matters for storage efficiency and data integrity. Storing a phone number as INT, for example, would strip leading zeros — always use VARCHAR for phone numbers.",
    example:
      "CREATE TABLE products (\n  id          INT PRIMARY KEY AUTO_INCREMENT,\n  name        VARCHAR(200) NOT NULL,\n  description TEXT,\n  price       DECIMAL(10, 2) NOT NULL,\n  in_stock    BOOLEAN DEFAULT TRUE,\n  created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP\n);",
    tip: "A common beginner mistake is using TEXT for everything. Use VARCHAR for short fields (it is faster to index) and TEXT only for long free-form content. Also use DECIMAL (not FLOAT) for money — floating point rounding will bite you.",
  },
  {
    id: 4,
    section: "Basics",
    title: "Primary Key",
    tagline: "Every row needs a unique ID — that's the primary key.",
    description:
      "A primary key is a column (or combination of columns) that uniquely identifies each row in a table. No two rows can share the same primary key value, and it can never be NULL. It is the 'address' of a row.\n\nThe most common pattern is an auto-incremented integer column called 'id'. The database automatically assigns the next available number each time a new row is inserted — 1, 2, 3, and so on. You never have to think about it.\n\nPrimary keys also improve query performance. When you look up a row by its primary key, the database uses a special index to find it almost instantly, even in a table with millions of rows.",
    example:
      "CREATE TABLE users (\n  id    INT PRIMARY KEY AUTO_INCREMENT,\n  name  VARCHAR(100) NOT NULL,\n  email VARCHAR(255) NOT NULL\n);\n\n-- Inserting rows:\nINSERT INTO users (name, email) VALUES ('Rajan', 'r@x.com');\nINSERT INTO users (name, email) VALUES ('Aisha', 'a@x.com');\n\n-- The database assigns id = 1 and id = 2 automatically.",
    tip: "There is debate between using auto-increment integers vs UUIDs as primary keys. Integers are smaller and faster to index. UUIDs are globally unique (useful for distributed systems). For most apps, start with auto-increment integers.",
  },
  {
    id: 5,
    section: "Querying",
    title: "SELECT",
    tagline: "The most important SQL keyword — read data from a table.",
    description:
      "SELECT is how you read data from a database. It is the most frequently used SQL statement by far. You tell the database which table to read from and which columns you want back.\n\nSELECT * means 'give me all columns'. This is handy for exploration but avoid it in production code — always specify the columns you actually need. This makes your queries faster and your code more predictable when table schemas change.\n\nSQL is not case-sensitive for keywords, but the convention is to write keywords in uppercase (SELECT, FROM, WHERE) and table/column names in lowercase. It makes queries easier to scan.",
    example:
      "-- Get all columns from the users table:\nSELECT * FROM users;\n\n-- Get only specific columns:\nSELECT name, email FROM users;\n\n-- Rename a column in the result (aliasing):\nSELECT name AS full_name, email FROM users;\n\n-- Count how many users exist:\nSELECT COUNT(*) AS total_users FROM users;",
    tip: "Avoid SELECT * in application code. When you add a column to a table later, SELECT * silently includes it, which can break code that expects a fixed number of columns or accidentally expose sensitive fields.",
  },
  {
    id: 6,
    section: "Querying",
    title: "WHERE",
    tagline: "Filter rows so you only get back what you actually need.",
    description:
      "The WHERE clause lets you filter rows based on conditions. Without it, SELECT returns every row in the table. With WHERE, you get only the rows that match your criteria.\n\nYou can compare values with =, !=, >, <, >=, <=. You can combine multiple conditions with AND (both must be true) or OR (either must be true). You can also check for NULL values with IS NULL or IS NOT NULL.\n\nWHERE works with UPDATE and DELETE too — not just SELECT. In fact, running an UPDATE or DELETE without a WHERE clause will affect every single row in the table, which is a very common and painful mistake for beginners.",
    example:
      "-- Users older than 18:\nSELECT * FROM users WHERE age > 18;\n\n-- Active users with a specific role:\nSELECT name, email FROM users\nWHERE status = 'active' AND role = 'admin';\n\n-- Users who have not verified their email:\nSELECT * FROM users WHERE email_verified_at IS NULL;\n\n-- Users from two specific countries:\nSELECT * FROM users\nWHERE country = 'Nepal' OR country = 'Japan';",
    tip: "Always double-check your WHERE clause before running a DELETE or UPDATE in production. A common trick: run the equivalent SELECT first with the same WHERE to verify you are targeting the right rows before deleting or modifying them.",
  },
  {
    id: 7,
    section: "Querying",
    title: "INSERT",
    tagline: "Add a new row to a table.",
    description:
      "INSERT INTO is how you add new data to a table. You specify the table name, the columns you are setting, and the corresponding values. Columns you omit will use their DEFAULT value (if one is defined) or NULL.\n\nYou can insert multiple rows in a single statement by providing multiple value sets separated by commas. This is much more efficient than running many individual INSERT statements.\n\nIn most frameworks and ORMs, INSERT is called behind the scenes when you do something like User.create() or model.save(). Understanding the raw SQL helps you debug ORM-generated queries.",
    example:
      "-- Insert a single row:\nINSERT INTO users (name, email)\nVALUES ('Rajan', 'rajan@example.com');\n\n-- Insert multiple rows at once:\nINSERT INTO users (name, email) VALUES\n  ('Aisha', 'aisha@example.com'),\n  ('Carlos', 'carlos@example.com'),\n  ('Mei', 'mei@example.com');\n\n-- The database auto-assigns id and created_at\n-- if those columns have defaults defined.",
    tip: "Never put user-supplied values directly into an INSERT string using string concatenation — that is the classic SQL injection vulnerability. Always use parameterised queries or prepared statements. Your ORM or query builder handles this automatically.",
  },
  {
    id: 8,
    section: "Querying",
    title: "UPDATE",
    tagline: "Modify existing rows in a table.",
    description:
      "UPDATE modifies the values of one or more columns in rows that match a WHERE condition. It does not add new rows — it changes existing ones.\n\nThe SET clause lists which columns to change and their new values. You can update multiple columns at once by separating them with commas.\n\nThe golden rule: always include a WHERE clause. UPDATE without WHERE changes every row in the table. This is the kind of mistake that can ruin a production database and cause a very stressful incident. Some database tools even refuse to run an UPDATE without WHERE unless you explicitly confirm.",
    example:
      "-- Update a single user's email:\nUPDATE users\nSET email = 'new@example.com'\nWHERE id = 1;\n\n-- Update multiple columns at once:\nUPDATE users\nSET email = 'new@example.com',\n    name = 'Rajan Magar',\n    updated_at = CURRENT_TIMESTAMP\nWHERE id = 1;\n\n-- Mark all unverified users as inactive:\nUPDATE users\nSET status = 'inactive'\nWHERE email_verified_at IS NULL;",
    tip: "Before running an UPDATE in production, first run a SELECT with the same WHERE clause to verify you are targeting exactly the rows you intend. This two-second habit can save you from multi-hour recovery efforts.",
  },
  {
    id: 9,
    section: "Querying",
    title: "DELETE",
    tagline: "Remove rows from a table — carefully.",
    description:
      "DELETE removes rows from a table. Like UPDATE, it works with a WHERE clause to target specific rows. And just like UPDATE, omitting WHERE deletes every row in the table — leaving you with an empty table.\n\nDELETE is permanent (unless you are inside a transaction that you can roll back). Once committed, the data is gone. This is why many production systems prefer 'soft deletes' — adding a 'deleted_at' timestamp column and filtering those rows out of queries rather than actually removing them.\n\nSoft deletes let you recover accidentally deleted data, maintain audit history, and avoid breaking foreign key references.",
    example:
      "-- Delete a specific user:\nDELETE FROM users WHERE id = 42;\n\n-- Delete all users from a specific country:\nDELETE FROM users WHERE country = 'TestLand';\n\n-- DANGER — deletes every row in the table:\n-- DELETE FROM users;\n\n-- Soft delete pattern (preferred in many apps):\nUPDATE users\nSET deleted_at = CURRENT_TIMESTAMP\nWHERE id = 42;\n\n-- Then filter deleted rows in queries:\nSELECT * FROM users WHERE deleted_at IS NULL;",
    tip: "In production systems, prefer soft deletes over hard deletes unless you have a strong reason (e.g., GDPR data erasure requests). Soft deletes give you a safety net and an audit trail.",
  },
  {
    id: 10,
    section: "Querying",
    title: "ORDER BY & LIMIT",
    tagline: "Sort your results and cap how many rows come back.",
    description:
      "ORDER BY sorts the rows in the result set. You specify a column to sort by and a direction: ASC (ascending, smallest to largest, A to Z) or DESC (descending, largest to smallest, Z to A). If you omit the direction, ASC is the default.\n\nLIMIT caps the number of rows returned. This is essential for pagination and for avoiding huge result sets that slow down your app. Fetching 10 rows instead of 10,000 is a massive performance difference.\n\nCombining ORDER BY with LIMIT is the standard pattern for 'get the N most recent things' — a query you will write in almost every application you ever build.",
    example:
      "-- Get the 10 most recently created users:\nSELECT id, name, created_at\nFROM users\nORDER BY created_at DESC\nLIMIT 10;\n\n-- Get the cheapest 5 products:\nSELECT name, price\nFROM products\nORDER BY price ASC\nLIMIT 5;\n\n-- Pagination: page 2 (rows 11-20):\nSELECT * FROM users\nORDER BY id ASC\nLIMIT 10 OFFSET 10;",
    tip: "Without an ORDER BY, the database can return rows in any order — and that order can change between queries. Never rely on the 'natural' order of rows. Always sort explicitly if order matters to your application.",
  },
  {
    id: 11,
    section: "Relationships",
    title: "Foreign Key",
    tagline: "The glue between tables — links one row to a row in another table.",
    description:
      "A foreign key is a column in one table that references the primary key of another table. It creates a formal relationship between the two tables and tells the database: 'the value in this column must exist in that other table'.\n\nFor example, a 'posts' table might have a 'user_id' column that references 'users.id'. This means you cannot create a post for a user that does not exist. And if referential integrity is enforced, you also cannot delete a user who still has posts (unless you set up cascading rules).\n\nForeign keys are the foundation of relational databases. They prevent orphaned data — rows that reference non-existent parents — and keep your data consistent across tables.",
    example:
      "CREATE TABLE users (\n  id   INT PRIMARY KEY AUTO_INCREMENT,\n  name VARCHAR(100) NOT NULL\n);\n\nCREATE TABLE posts (\n  id      INT PRIMARY KEY AUTO_INCREMENT,\n  user_id INT NOT NULL,\n  title   VARCHAR(255) NOT NULL,\n  FOREIGN KEY (user_id) REFERENCES users(id)\n);\n\n-- This will FAIL if user with id=999 does not exist:\nINSERT INTO posts (user_id, title)\nVALUES (999, 'Ghost post');",
    tip: "Always add foreign keys during schema design, not as an afterthought. They enforce data integrity at the database level, which is far more reliable than enforcing it only in application code where bugs and race conditions can slip through.",
  },
  {
    id: 12,
    section: "Relationships",
    title: "INNER JOIN",
    tagline: "Combine two tables, keeping only rows that match in both.",
    description:
      "A JOIN is how you combine data from two or more tables into a single result. An INNER JOIN is the most common type — it returns only the rows where there is a match in both tables based on the join condition.\n\nThink of it as the overlap in a Venn diagram. If a user has no posts, they do not appear in an INNER JOIN between users and posts. If a post somehow has no matching user, it does not appear either.\n\nThe ON clause specifies how the two tables relate — almost always by matching a foreign key to a primary key.",
    example:
      "-- Get each post with its author's name:\nSELECT\n  users.name  AS author,\n  posts.title AS post_title\nFROM users\nINNER JOIN posts ON users.id = posts.user_id;\n\n-- Using aliases to shorten table names:\nSELECT\n  u.name  AS author,\n  p.title AS post_title,\n  p.created_at\nFROM users u\nINNER JOIN posts p ON u.id = p.user_id\nORDER BY p.created_at DESC\nLIMIT 10;",
    tip: "When column names are ambiguous (exist in both tables), always prefix them with the table name or alias: u.id instead of just id. Otherwise the database will throw an error or silently pick one, depending on the engine.",
  },
  {
    id: 13,
    section: "Relationships",
    title: "LEFT JOIN",
    tagline: "Get all rows from the left table, even if there's no match on the right.",
    description:
      "A LEFT JOIN returns all rows from the left table (the one in the FROM clause) and the matching rows from the right table. If there is no match on the right side, the right-side columns come back as NULL.\n\nThis is useful when you want to include records regardless of whether they have related data. For example: 'show me all users, and if they have posts, show the post count — but include users with zero posts too'.\n\nThe difference from INNER JOIN: INNER JOIN silently drops rows with no match. LEFT JOIN keeps them, with NULLs for the right-side columns. This distinction matters a lot for reports and analytics.",
    example:
      "-- Get all users and their post count (including users with no posts):\nSELECT\n  u.name,\n  COUNT(p.id) AS post_count\nFROM users u\nLEFT JOIN posts p ON u.id = p.user_id\nGROUP BY u.id, u.name;\n\n-- Find users who have never posted:\nSELECT u.name\nFROM users u\nLEFT JOIN posts p ON u.id = p.user_id\nWHERE p.id IS NULL;",
    tip: "A neat trick: use LEFT JOIN + WHERE right.id IS NULL to find rows in the left table that have no match in the right table. This is more readable than a subquery for this common 'find orphaned records' pattern.",
  },
  {
    id: 14,
    section: "Constraints & Design",
    title: "UNIQUE Constraint",
    tagline: "Guarantee no two rows share the same value in this column.",
    description:
      "A UNIQUE constraint enforces that every value in a column (or combination of columns) is different across all rows. Unlike a primary key, a UNIQUE column can hold NULL values (though behaviour varies by database engine).\n\nThe classic example is an email column on a users table. You want to prevent two users from registering with the same email address. Adding a UNIQUE constraint means the database itself enforces this rule — even if your application code has a bug or a race condition.\n\nYou can also create a composite unique constraint spanning multiple columns — for example, ensuring a user can only 'like' a post once by making (user_id, post_id) unique in a 'likes' table.",
    example:
      "-- Single-column unique constraint:\nCREATE TABLE users (\n  id       INT PRIMARY KEY AUTO_INCREMENT,\n  email    VARCHAR(255) UNIQUE NOT NULL,\n  username VARCHAR(50)  UNIQUE NOT NULL\n);\n\n-- This INSERT will FAIL if the email already exists:\nINSERT INTO users (email, username)\nVALUES ('existing@example.com', 'newuser');\n\n-- Composite unique (user can only like a post once):\nCREATE TABLE likes (\n  user_id INT NOT NULL,\n  post_id INT NOT NULL,\n  UNIQUE (user_id, post_id)\n);",
    tip: "Always add UNIQUE constraints at the database level for fields like email and username — not just in your application layer. Application-level checks alone are vulnerable to race conditions where two requests arrive simultaneously, both pass the check, and both insert successfully.",
  },
  {
    id: 15,
    section: "Constraints & Design",
    title: "NOT NULL & DEFAULT",
    tagline: "NOT NULL makes a field required; DEFAULT provides a fallback value.",
    description:
      "NOT NULL is a constraint that prevents a column from storing NULL. NULL in SQL means 'no value' or 'unknown' — it is not zero, not an empty string, it is the absence of a value. Making a column NOT NULL means the field is required: every row must supply a value for it.\n\nDEFAULT lets you specify what value a column gets if none is provided during INSERT. This is handy for things like created_at timestamps, boolean flags, or status fields that should start with a sensible value.\n\nCombining NOT NULL with DEFAULT is the most common pattern for columns that should always have a value but do not need to be explicitly set every time — like a 'status' column that defaults to 'pending'.",
    example:
      "CREATE TABLE orders (\n  id         INT PRIMARY KEY AUTO_INCREMENT,\n  user_id    INT NOT NULL,\n  status     VARCHAR(20) NOT NULL DEFAULT 'pending',\n  total      DECIMAL(10,2) NOT NULL,\n  notes      TEXT,                           -- nullable, optional\n  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP\n);\n\n-- This works (status and created_at use defaults):\nINSERT INTO orders (user_id, total)\nVALUES (1, 49.99);\n\n-- This FAILS (total is NOT NULL and has no default):\nINSERT INTO orders (user_id) VALUES (1);",
    tip: "Avoid nullable columns unless NULL genuinely has a distinct meaning in your domain. Nullable columns complicate queries (you always need to handle IS NULL cases), make aggregations tricky, and make your data model harder to reason about.",
  },
  {
    id: 16,
    section: "Constraints & Design",
    title: "CHECK Constraint",
    tagline: "Validate data at the database level before it's ever stored.",
    description:
      "A CHECK constraint defines a condition that must be true for any row in the table. If an INSERT or UPDATE violates the condition, the database rejects it with an error. The validation happens at the storage layer — before the data ever touches your application logic.\n\nThis is one of the most underused features by beginners. Validating data only in application code means that bugs, direct database access, or migration scripts can sneak in bad data. CHECK constraints are your last line of defence.\n\nCommon examples: ensuring a price is never negative, an age is in a valid range, a status column only accepts known values, or an end date is after a start date.",
    example:
      "CREATE TABLE accounts (\n  id      INT PRIMARY KEY AUTO_INCREMENT,\n  owner   VARCHAR(100) NOT NULL,\n  balance DECIMAL(12, 2) NOT NULL DEFAULT 0.00,\n  CHECK (balance >= 0)           -- balance can never go negative\n);\n\nCREATE TABLE events (\n  id         INT PRIMARY KEY AUTO_INCREMENT,\n  title      VARCHAR(255) NOT NULL,\n  starts_at  DATETIME NOT NULL,\n  ends_at    DATETIME NOT NULL,\n  CHECK (ends_at > starts_at)    -- end must be after start\n);\n\n-- This INSERT will FAIL:\nINSERT INTO accounts (owner, balance) VALUES ('Rajan', -100);",
    tip: "CHECK constraints are especially valuable for monetary columns (balance >= 0), enum-like status fields (status IN ('pending','active','closed')), and date ranges. They give you data integrity guarantees that no amount of application-layer validation can fully replicate.",
  },
  {
    id: 17,
    section: "Constraints & Design",
    title: "Indexes",
    tagline: "Speed up queries dramatically — at the cost of a little write overhead.",
    description:
      "An index is a separate data structure the database maintains alongside your table to speed up lookups. Without an index, a query like WHERE email = 'x@x.com' forces the database to scan every single row — an O(n) operation. With an index on 'email', it can jump straight to the matching row — roughly O(log n) using a B-tree.\n\nIndexes are created automatically for primary keys and UNIQUE columns. For other columns you query frequently (especially in WHERE or JOIN conditions), you add them manually.\n\nThe trade-off: indexes speed up reads but slow down writes slightly, because every INSERT or UPDATE must also update the index. A table with 20 indexes on it can be very slow to write to. Index thoughtfully — not every column needs one.",
    example:
      "-- Add an index on a frequently-queried column:\nCREATE INDEX idx_users_email ON users (email);\n\n-- Composite index for queries that filter on both columns:\nCREATE INDEX idx_posts_user_created\n  ON posts (user_id, created_at);\n\n-- See which indexes exist on a table (MySQL):\nSHOW INDEX FROM users;\n\n-- Check if a query uses an index (MySQL):\nEXPLAIN SELECT * FROM users WHERE email = 'r@x.com';",
    tip: "Use EXPLAIN (MySQL/PostgreSQL) to check whether your queries are using indexes. A full table scan on a large table is almost always a performance problem. If you see 'type: ALL' in MySQL's EXPLAIN output, you need an index.",
  },
  {
    id: 18,
    section: "Transactions",
    title: "ACID Transactions",
    tagline: "The four guarantees that make database operations safe and reliable.",
    description:
      "A transaction is a group of SQL operations that are treated as a single unit. Either all of them succeed together, or none of them do. This is the foundation of data integrity in databases.\n\nACID stands for four properties:\n- Atomicity: all operations in the transaction succeed or all are rolled back. There is no 'halfway' state.\n- Consistency: the database moves from one valid state to another. Constraints and rules are always honoured.\n- Isolation: concurrent transactions do not interfere with each other. Each transaction sees a consistent snapshot of the data.\n- Durability: once a transaction is committed, it is permanently saved — even if the server crashes immediately after.\n\nThe classic example is a bank transfer: debit $100 from account A and credit $100 to account B. If the debit succeeds but the server crashes before the credit, you have just lost $100. A transaction wraps both operations — if anything fails, everything rolls back.",
    example:
      "-- Start a transaction:\nBEGIN;\n\n-- Debit from sender:\nUPDATE accounts\nSET balance = balance - 100\nWHERE id = 1;\n\n-- Credit to receiver:\nUPDATE accounts\nSET balance = balance + 100\nWHERE id = 2;\n\n-- If both succeeded, save permanently:\nCOMMIT;\n\n-- If anything went wrong, undo everything:\n-- ROLLBACK;",
    tip: "Keep transactions as short as possible. Long-running transactions hold locks that block other queries and can cause cascading slowdowns across your entire application. Do the minimal amount of work inside a transaction, and commit quickly.",
  },
];

export const SQL_CONCEPT_COUNT = SQL_CONCEPTS.length;
