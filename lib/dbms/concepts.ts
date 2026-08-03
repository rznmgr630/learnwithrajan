export interface DBMSConcept {
  id: number;
  section: string;
  title: string;
  tagline: string;
  description: string;
  note?: string;
  diagram?: string;
  example: string;
  tip: string;
  tags: string[];
}

export const DBMS_SECTIONS = [
  "DBMS",
  "Data Models",
  "ER Model",
  "Relational Database",
  "SQL",
  "Advanced Database",
] as const;

export const DBMS_CONCEPTS: DBMSConcept[] = [

  // ─────────────────────────────────────────────
  // DBMS
  // ─────────────────────────────────────────────
  {
    id: 1,
    section: "DBMS",
    title: "Database",
    tagline: "An organized collection of related data stored for easy access, management, and updates",
    description:
      "A database is an organized collection of related data, stored electronically so it can be easily accessed, managed, and updated.\n\nThink of it like a digital filing cabinet:\n• Instead of paper folders, data lives in structured files on a disk\n• Instead of searching drawer by drawer, you query directly for the record you need\n• Multiple people can read and update the same cabinet at the same time, safely\n\n<b>Why not just use a spreadsheet or a text file?</b>\n• Files do not enforce structure — anyone can type anything anywhere\n• Files do not handle multiple simultaneous writers safely\n• Files have no built-in way to search, filter, or relate data across tables\n• Files cannot easily enforce rules like \"age must be a number\" or \"email must be unique\"\n\n<b>Common examples</b>\n• A banking app storing account balances and transactions\n• An e-commerce site storing products, orders, and customers\n• A social app storing users, posts, and comments",
    note:
      "A database is just the data itself. The software that lets you create, read, update, and delete that data is a separate thing, called a DBMS. Keep the two words distinct: database = the data, DBMS = the software managing it.",
    example:
      "-- A tiny slice of a real database: one table, two rows\n\nCREATE TABLE customers (\n  id    INT PRIMARY KEY,\n  name  VARCHAR(100),\n  email VARCHAR(100) UNIQUE\n);\n\nINSERT INTO customers (id, name, email) VALUES\n  (1, 'Asha Gurung', 'asha@example.com'),\n  (2, 'Bikash Rai',  'bikash@example.com');\n\n-- The DATABASE is the stored data (the customers table + its rows).\n-- The software that ran these commands is the DBMS.",
    tip: "In interviews, define it precisely: 'A database is the organized data itself; the DBMS is the software that manages it.' People use the words interchangeably casually, but the distinction matters once you talk about DBMS vs RDBMS.",
    tags: ["Database", "Data Storage", "Fundamentals"],
  },

  {
    id: 2,
    section: "DBMS",
    title: "DBMS",
    tagline: "The software layer that creates, reads, updates, deletes, and protects a database",
    description:
      "A DBMS (Database Management System) is the software that sits between users/applications and the actual data files, handling every operation safely and efficiently.\n\n<b>What a DBMS actually does</b>\n• Stores and organizes data on disk\n• Lets applications create, read, update, and delete records (CRUD)\n• Enforces rules — data types, uniqueness, required fields\n• Controls who can access what (security and permissions)\n• Manages multiple users reading/writing at the same time without corrupting data\n• Recovers data after a crash (backups, logs)\n\n<b>Without a DBMS</b>\n• Every application would need to write its own file-reading, locking, and validation logic from scratch\n• Two users updating the same record at once could easily corrupt it\n\n<b>Examples of DBMS software</b>\n• MySQL, PostgreSQL, Oracle, SQL Server → relational (RDBMS)\n• MongoDB, Redis, Cassandra → non-relational (NoSQL)",
    note:
      "A DBMS is the engine; a database is the fuel it manages. When someone says 'we use MySQL,' they mean the DBMS software — the actual data still lives in one or more databases running inside it.",
    diagram:
      "  Application\n      │\n      │  SQL query / API call\n      ↓\n  ┌──────────────────────────┐\n  │           DBMS            │  ← enforces rules, manages access,\n  │  (MySQL / PostgreSQL...)   │    handles concurrency, recovery\n  └──────────────────────────┘\n      │\n      ↓\n  Database files on disk",
    example:
      "-- The DBMS is what executes and enforces this command\n\nCREATE TABLE employees (\n  id     INT PRIMARY KEY,\n  name   VARCHAR(100) NOT NULL,\n  salary DECIMAL(10,2) CHECK (salary > 0)\n);\n\n-- If two apps try to insert the same id at the same time,\n-- the DBMS is what prevents duplicate primary keys.",
    tip: "When asked 'what is a DBMS,' don't just say 'software that stores data' — mention the four things it guarantees: structure enforcement, concurrent access control, security, and recovery.",
    tags: ["DBMS", "CRUD", "Concurrency", "Data Integrity"],
  },

  {
    id: 3,
    section: "DBMS",
    title: "RDBMS",
    tagline: "A DBMS that organizes data into related tables, enforced by rules and keys",
    description:
      "An RDBMS (Relational Database Management System) is a DBMS that stores data in tables (relations) made of rows and columns, and lets those tables reference each other through keys.\n\n<b>What makes it \"relational\"</b>\n• Data lives in tables — each table represents one type of entity (customers, orders, products)\n• Tables relate to each other through foreign keys (an order references a customer)\n• Every RDBMS enforces schema rules: fixed columns, defined data types, constraints\n\n<b>RDBMS vs plain DBMS</b>\n• Every RDBMS is a DBMS, but not every DBMS is relational\n• MongoDB is a DBMS but not an RDBMS — it stores flexible JSON-like documents, not related tables\n• MySQL, PostgreSQL, Oracle, SQL Server are RDBMS — they speak SQL and enforce table relationships\n\n<b>Why RDBMS became the industry default</b>\n• Strong consistency — the same customer id always means the same customer\n• Powerful querying across related tables via JOINs\n• Decades of tooling, transactions, and standardization around SQL",
    note:
      "If you remember one distinction for interviews: DBMS is the umbrella term (any system managing data); RDBMS is the subset that stores data as related tables and speaks SQL.",
    diagram:
      "  customers                  orders\n  ┌────┬─────────┐           ┌────┬─────────────┬────────┐\n  │ id │ name    │           │ id │ customer_id │ total  │\n  ├────┼─────────┤           ├────┼─────────────┼────────┤\n  │ 1  │ Asha    │ ◄─────────┤101 │      1      │ 49.99  │\n  │ 2  │ Bikash  │ ◄─────────┤102 │      2      │ 19.50  │\n  └────┴─────────┘  foreign  └────┴─────────────┴────────┘\n                      key",
    example:
      "CREATE TABLE customers (\n  id   INT PRIMARY KEY,\n  name VARCHAR(100)\n);\n\nCREATE TABLE orders (\n  id          INT PRIMARY KEY,\n  customer_id INT REFERENCES customers(id),  -- foreign key: the 'relational' part\n  total       DECIMAL(10,2)\n);\n\n-- JOIN across the relationship\nSELECT c.name, o.total\nFROM orders o\nJOIN customers c ON o.customer_id = c.id;",
    tip: "A quick litmus test: 'Does it store data as tables linked by foreign keys and enforce a fixed schema?' If yes → RDBMS. If it stores flexible documents/key-value pairs without enforced relationships → NoSQL DBMS.",
    tags: ["RDBMS", "Tables", "Foreign Key", "SQL"],
  },

  {
    id: 4,
    section: "DBMS",
    title: "Schema",
    tagline: "The blueprint that defines what tables, columns, types, and rules a database has",
    description:
      "A schema is the structural blueprint of a database — it defines what tables exist, what columns each table has, what data type each column holds, and what rules apply (primary keys, foreign keys, constraints).\n\nThink of it like the floor plan of a house:\n• The floor plan (schema) shows where each room is and what it's for\n• The furniture and people inside (the actual data/rows) can change every day\n• The floor plan itself changes rarely, and only through deliberate renovation\n\n<b>What a schema includes</b>\n• Table names and their columns\n• Data types per column (`INT`, `VARCHAR`, `DATE`, ...)\n• Constraints (`NOT NULL`, `UNIQUE`, `PRIMARY KEY`, `FOREIGN KEY`, `CHECK`)\n• Relationships between tables\n\n<b>Schema vs data</b>\n• Schema = structure (rarely changes)\n• Data = the actual rows stored inside that structure (changes constantly)\n• Changing a schema (adding a column, renaming a table) is called a migration",
    note:
      "\"Schema\" is also used loosely to mean an entire named namespace of tables inside a database (e.g. PostgreSQL's `public` schema). Both meanings point to the same idea: a defined structure that data must follow.",
    diagram:
      "  SCHEMA (structure — defined once)\n  Table: users\n  ┌──────────┬──────────────┬──────────┐\n  │ column   │ type         │ rule     │\n  ├──────────┼──────────────┼──────────┤\n  │ id       │ INT          │ PRIMARY  │\n  │ email    │ VARCHAR(255) │ UNIQUE   │\n  │ created  │ DATE         │ NOT NULL │\n  └──────────┴──────────────┴──────────┘\n\n  DATA (rows — changes constantly)\n  1 | asha@example.com   | 2026-01-04\n  2 | bikash@example.com | 2026-02-11",
    example:
      "-- This CREATE TABLE statement defines the schema\nCREATE TABLE users (\n  id      INT PRIMARY KEY,\n  email   VARCHAR(255) UNIQUE NOT NULL,\n  created DATE NOT NULL DEFAULT CURRENT_DATE\n);\n\n-- Altering the schema later (a migration)\nALTER TABLE users ADD COLUMN is_active BOOLEAN DEFAULT true;",
    tip: "Contrast schema with instance clearly: schema is the design (changes rarely, via migrations); instance is the data snapshot at a given moment (changes constantly). This pairing is a classic DBMS interview question.",
    tags: ["Schema", "Constraints", "Migration", "Structure"],
  },

  {
    id: 5,
    section: "DBMS",
    title: "Instance",
    tagline: "The actual data stored in a database at one specific moment in time",
    description:
      "An instance is the actual content of a database at a particular point in time — the real rows sitting inside the schema's structure right now.\n\nUsing the floor-plan analogy again:\n• Schema = the floor plan (fixed structure)\n• Instance = a photo of the house right now, with people and furniture in their current positions\n\n<b>Why the distinction matters</b>\n• The schema for a `users` table never changes just because someone signs up\n• But the instance changes every single time a row is inserted, updated, or deleted\n• Two databases can share the exact same schema but have completely different instances (e.g. a production database and a test database with the same table structure but different rows)\n\n<b>Instance in practice</b>\n• `SELECT * FROM users;` returns the current instance of that table\n• Backups capture an instance at a specific timestamp\n• \"Restore to yesterday\" means going back to yesterday's instance under today's schema",
    note:
      "Schema answers 'what shape does the data have?' Instance answers 'what does the data look like right now?' Schema changes are rare and deliberate (migrations); instance changes constantly (every insert/update/delete).",
    diagram:
      "  Schema (fixed):  users(id, name, email)\n\n  Instance at 9:00am:         Instance at 9:05am:\n  1 | Asha   | asha@...       1 | Asha   | asha@...\n  2 | Bikash | bikash@...     2 | Bikash | bikash@...\n                              3 | Kiran  | kiran@...   ← new row inserted\n\n  Same schema, different instance.",
    example:
      "-- Schema stays the same, instance changes with every write\nINSERT INTO users (id, name, email) VALUES (3, 'Kiran Thapa', 'kiran@example.com');\n\n-- The instance right now:\nSELECT * FROM users;\n-- returns whatever rows currently exist -- this result set IS the instance",
    tip: "A common interview trap: 'what changes more often, schema or instance?' Answer instance — schema changes are deliberate migrations, instance changes with every ordinary insert/update/delete.",
    tags: ["Instance", "Schema", "Data Snapshot"],
  },

  // ─────────────────────────────────────────────
  // DATA MODELS
  // ─────────────────────────────────────────────
  {
    id: 6,
    section: "Data Models",
    title: "Hierarchical Model",
    tagline: "Data organized as a tree — each child has exactly one parent",
    description:
      "The hierarchical model organizes data as a tree structure, where each record (child) has exactly one parent record, and a parent can have many children.\n\nThink of a company org chart:\n• The CEO is the root\n• Each manager reports to exactly one person above them\n• Each employee has exactly one manager\n\n<b>How it works</b>\n• Data is linked with parent-child pointers, like a file system with folders and subfolders\n• To find a record, you traverse the tree from the root down\n\n<b>Limitations</b>\n• A child can only have one parent — real-world relationships are often many-to-many (a student takes many courses, a course has many students), which trees cannot represent naturally\n• Restructuring the tree requires touching many linked records\n\n<b>Where it's still used</b>\n• File systems (folders and files)\n• XML and JSON document structures\n• IBM's IMS (Information Management System), one of the earliest DBMS products",
    note:
      "The hierarchical model's one-parent-per-child rule is exactly why the relational model was invented — it could not naturally express many-to-many relationships.",
    diagram:
      "              [Company]\n              /        \\\n       [Engineering]   [Sales]\n         /      \\           \\\n   [Backend]  [Frontend]   [Sales Rep]\n\n  Each box has exactly ONE parent above it.",
    example:
      "// Hierarchical structure expressed as nested JSON (conceptually similar)\n{\n  \"department\": \"Engineering\",\n  \"teams\": [\n    { \"name\": \"Backend\",  \"employees\": [\"Asha\", \"Bikash\"] },\n    { \"name\": \"Frontend\", \"employees\": [\"Kiran\"] }\n  ]\n}\n// To reassign Bikash to Frontend, you must edit the tree structure itself.",
    tip: "If asked to name a real system still using the hierarchical model, say 'file systems' — folders and files are a textbook hierarchical structure everyone already understands.",
    tags: ["Hierarchical Model", "Tree Structure", "Data Model"],
  },

  {
    id: 7,
    section: "Data Models",
    title: "Network Model",
    tagline: "Data organized as a graph — a child can have multiple parents",
    description:
      "The network model is an extension of the hierarchical model that allows a child record to have multiple parent records, forming a graph instead of a strict tree.\n\n<b>Why it was created</b>\n• The hierarchical model's one-parent rule couldn't represent real relationships like 'a student enrolls in many courses, and a course has many students'\n• The network model solves this by allowing multiple parent-child links per record\n\n<b>How it works</b>\n• Records are connected through explicit pointers called 'sets'\n• A single record can participate as a child in multiple sets — i.e. have multiple parents\n\n<b>Limitations</b>\n• Navigating the graph requires following pointer chains manually in application code — there's no simple query language like SQL\n• Any structural change means updating pointers throughout the graph\n\n<b>Where it's used today</b>\n• Mostly historical (CODASYL databases from the 1970s)\n• Conceptually lives on in graph databases (Neo4j) which solved the same many-to-many problem with a modern query language",
    note:
      "The network model was the direct ancestor of today's graph databases. Both solve the same problem — many-to-many relationships — but graph databases add a proper query language (Cypher) instead of manual pointer navigation.",
    diagram:
      "  [Course: Math]     [Course: Physics]\n        \\                /\n         \\              /\n        [Student: Asha]\n         /              \\\n        /                \\\n  [Course: Chemistry]  [Student: Bikash]\n\n  Asha (a child record) has TWO parent courses — not possible in a strict tree.",
    example:
      "// Conceptual network-model link (pointer-based, not SQL)\nStudentRecord(Asha) -> memberOf -> CourseSet(Math)\nStudentRecord(Asha) -> memberOf -> CourseSet(Physics)\n\n// Compare to the relational fix for the same problem:\nCREATE TABLE enrollments (\n  student_id INT REFERENCES students(id),\n  course_id  INT REFERENCES courses(id),\n  PRIMARY KEY (student_id, course_id)\n);",
    tip: "If asked what problem the network model solved that hierarchical couldn't: many-to-many relationships. What replaced it: the relational model, using junction tables instead of manual pointers.",
    tags: ["Network Model", "Many-to-Many", "Graph Structure", "CODASYL"],
  },

  {
    id: 8,
    section: "Data Models",
    title: "Relational Model",
    tagline: "Data organized as tables of rows and columns, connected through keys",
    description:
      "The relational model, introduced by Edgar F. Codd in 1970, organizes data into tables (relations) made of rows (tuples) and columns (attributes), with relationships expressed through shared key values rather than physical pointers.\n\n<b>Why it was revolutionary</b>\n• No pointers to navigate manually — you query by value using a declarative language (SQL): \"give me all orders where customer_id = 1\"\n• Any table can relate to any other table simply by matching key values\n• Adding a new relationship doesn't require rewiring pointers, just adding a foreign key column\n\n<b>Core building blocks</b>\n• Table (relation) — a named collection of rows about one entity type\n• Row (tuple) — one record\n• Column (attribute) — one field of that record\n• Primary key — uniquely identifies a row\n• Foreign key — links a row to a row in another table\n\n<b>Why it won</b>\n• Simpler mental model than trees/graphs\n• SQL gave a standard, powerful query language\n• Strong mathematical foundation (set theory, relational algebra) made it provably consistent",
    note:
      "This is the model underlying every RDBMS you'll use — MySQL, PostgreSQL, Oracle, SQL Server. When people say 'relational database,' they mean a database built on this model.",
    diagram:
      "  students             enrollments               courses\n  ┌────┬───────┐       ┌────────────┬───────────┐  ┌────┬─────────┐\n  │ id │ name  │       │ student_id │ course_id │  │ id │ name    │\n  ├────┼───────┤       ├────────────┼───────────┤  ├────┼─────────┤\n  │ 1  │ Asha  │◄──────┤     1      │    10     ├─►│ 10 │ Math    │\n  │ 2  │Bikash │◄──────┤     1      │    20     ├─►│ 20 │ Physics │\n  └────┴───────┘       └────────────┴───────────┘  └────┴─────────┘\n\n  No pointers — just matching key VALUES across tables.",
    example:
      "CREATE TABLE students (id INT PRIMARY KEY, name VARCHAR(100));\nCREATE TABLE courses  (id INT PRIMARY KEY, name VARCHAR(100));\nCREATE TABLE enrollments (\n  student_id INT REFERENCES students(id),\n  course_id  INT REFERENCES courses(id),\n  PRIMARY KEY (student_id, course_id)\n);\n\n-- Query the relationship by VALUE, not by pointer traversal\nSELECT s.name, c.name AS course\nFROM enrollments e\nJOIN students s ON e.student_id = s.id\nJOIN courses  c ON e.course_id  = c.id;",
    tip: "If asked who invented the relational model and why it matters: Edgar F. Codd, 1970 — the key insight was relating data by value (matching keys via SQL) instead of by physical pointer.",
    tags: ["Relational Model", "Codd", "SQL", "Tables", "Keys"],
  },

  {
    id: 9,
    section: "Data Models",
    title: "Object-Oriented Model",
    tagline: "Data stored as objects, with classes, inheritance, and behavior bundled together",
    description:
      "The object-oriented model stores data as objects — the same kind of object you'd use in OOP code — bundling both the data (attributes) and the behavior (methods) together, and supporting inheritance between object types.\n\n<b>How it differs from the relational model</b>\n• Relational: data is flat rows in tables; there is no built-in inheritance or behavior\n• Object-oriented: data is stored as objects with classes, and a `Manager` class can inherit from an `Employee` class, reusing its structure\n\n<b>Why it appeared</b>\n• In the 1980s–90s, applications were increasingly written in object-oriented languages (C++, Java)\n• Every time an object was saved to a relational database, it had to be manually flattened into rows — the 'object-relational impedance mismatch'\n• Object-oriented databases aimed to store objects directly, with no translation step\n\n<b>Where the idea lives on today</b>\n• Rarely used as a standalone DBMS today (db4o, ObjectDB are niche)\n• The core idea survives in ORMs (Object-Relational Mappers) like Prisma, Sequelize, Hibernate — they let you code against objects while the ORM handles translating to relational tables underneath",
    note:
      "You'll rarely deploy a pure object-oriented database today, but you use its core idea daily through ORMs — writing `User.find(1)` in code instead of hand-writing `SELECT * FROM users WHERE id = 1`.",
    diagram:
      "  class Employee { name; salary; }\n  class Manager extends Employee { teamSize; }   ← inheritance\n\n  Object-oriented DB stores the OBJECT directly:\n  Manager { name: 'Asha', salary: 90000, teamSize: 5 }\n\n  vs. relational model needing it split across flat tables:\n  employees(id, name, salary) + managers(employee_id, team_size)",
    example:
      "// Modern equivalent: an ORM hides the object <-> table translation (Prisma example)\n\nconst manager = await prisma.employee.create({\n  data: {\n    name: 'Asha Gurung',\n    salary: 90000,\n    teamSize: 5,       // ORM maps this object shape onto relational tables\n  },\n});\n\n// You write and think in objects; the ORM generates the SQL underneath.",
    tip: "If asked why object-oriented databases didn't replace relational ones: the relational model's mathematical simplicity, SQL, and tooling ecosystem won. The impedance mismatch is instead solved today with ORMs layered on relational databases.",
    tags: ["Object-Oriented Model", "Inheritance", "ORM", "Impedance Mismatch"],
  },

  // ─────────────────────────────────────────────
  // ER MODEL
  // ─────────────────────────────────────────────
  {
    id: 10,
    section: "ER Model",
    title: "Entity",
    tagline: "A real-world thing or concept that a database stores information about",
    description:
      "An entity is a real-world object or concept that you want to store data about — a student, a product, an order, a car. In a relational database, each entity typically becomes one table.\n\n<b>Entity vs entity instance</b>\n• Entity = the general concept, e.g. \"Student\"\n• Entity instance = one specific occurrence, e.g. \"Asha Gurung, id 1\"\n• A table represents the entity type; each row represents one entity instance\n\n<b>Strong vs weak entities</b>\n• Strong entity — has its own primary key and can exist independently (e.g. `Student`)\n• Weak entity — depends on another entity for identification (e.g. `Dependent` of an employee, identified only in combination with the employee's key)\n\n<b>In an ER diagram</b>\n• Entities are typically drawn as rectangles",
    note:
      "An entity becomes a table; an attribute of that entity becomes a column; one entity instance becomes one row. This mapping is the bridge from ER diagrams to actual SQL schema.",
    diagram:
      "  ┌───────────┐        ┌───────────┐\n  │  Student  │        │  Course   │   ← entities (rectangles)\n  └───────────┘        └───────────┘\n\n  Entity instance: Student(id=1, name='Asha')",
    example:
      "-- The Student entity becomes a table; each row is an entity instance\nCREATE TABLE students (\n  id   INT PRIMARY KEY,\n  name VARCHAR(100)\n);\n\nINSERT INTO students (id, name) VALUES (1, 'Asha Gurung');  -- one entity instance",
    tip: "In ER-to-schema conversion questions, state the rule directly: entity → table, attribute → column, entity instance → row.",
    tags: ["Entity", "ER Model", "Strong Entity", "Weak Entity"],
  },

  {
    id: 11,
    section: "ER Model",
    title: "Attribute",
    tagline: "A property or characteristic that describes an entity",
    description:
      "An attribute is a specific piece of data that describes an entity — a Student entity might have attributes like name, age, and email.\n\n<b>Types of attributes</b>\n• Simple attribute — cannot be divided further (e.g. `age`)\n• Composite attribute — can be split into smaller parts (e.g. `name` → `first_name` + `last_name`)\n• Single-valued attribute — holds one value (e.g. one `date_of_birth`)\n• Multi-valued attribute — can hold multiple values (e.g. a person can have several `phone_numbers`)\n• Derived attribute — calculated from another attribute, not stored directly (e.g. `age` derived from `date_of_birth`)\n\n<b>In an ER diagram</b>\n• Attributes are typically drawn as ovals connected to their entity\n• Multi-valued attributes get a double oval; derived attributes get a dashed oval",
    note:
      "Multi-valued attributes (like multiple phone numbers) cannot be stored as a single column in a relational table — they need their own separate table, linked back by a foreign key.",
    diagram:
      "        (name)   (age)\n           \\       /\n         ┌───────────┐\n         │  Student  │\n         └───────────┘\n           /        \\\n     (email)   ((phone_numbers))  ← double oval = multi-valued",
    example:
      "-- Simple + single-valued attributes map directly to columns\nCREATE TABLE students (\n  id    INT PRIMARY KEY,\n  name  VARCHAR(100),\n  age   INT\n);\n\n-- A multi-valued attribute (phone_numbers) needs its own table\nCREATE TABLE student_phones (\n  student_id INT REFERENCES students(id),\n  phone      VARCHAR(20)\n);",
    tip: "If asked how to store a multi-valued attribute in a relational table, don't say 'comma-separated in one column' — the correct answer is a separate linked table, keeping the design in proper normal form.",
    tags: ["Attribute", "ER Model", "Multi-valued", "Derived Attribute"],
  },

  {
    id: 12,
    section: "ER Model",
    title: "Relationship",
    tagline: "How two or more entities are connected to each other",
    description:
      "A relationship describes how two or more entities are associated with each other — a Student enrolls in a Course, an Employee manages a Department.\n\n<b>Degree of a relationship</b>\n• Unary (degree 1) — an entity relates to itself (an Employee supervises another Employee)\n• Binary (degree 2) — the most common — two entities relate (Student enrolls in Course)\n• Ternary (degree 3) — three entities participate together (Supplier supplies Part to Project)\n\n<b>Participation</b>\n• Total participation — every instance of the entity must participate in the relationship (every Order must have a Customer)\n• Partial participation — participation is optional (not every Employee manages a Department)\n\n<b>In an ER diagram</b>\n• Relationships are drawn as diamonds connecting the related entities",
    note:
      "In the final relational schema, a relationship usually becomes a foreign key (for one-to-many) or an entirely separate junction table (for many-to-many).",
    diagram:
      "  ┌──────────┐        ┌───────────┐        ┌──────────┐\n  │ Student  ├──────< │ enrolls in │ >──────┤  Course  │\n  └──────────┘        └───────────┘        └──────────┘\n                        (diamond)",
    example:
      "-- Binary relationship 'enrolls in' between Student and Course\n-- becomes a junction table for many-to-many\nCREATE TABLE enrollments (\n  student_id INT REFERENCES students(id),\n  course_id  INT REFERENCES courses(id),\n  PRIMARY KEY (student_id, course_id)\n);",
    tip: "If asked to identify relationship degree, count the distinct entity types involved, not the number of rows. 'Student enrolls in Course' is binary (degree 2) regardless of how many students or courses exist.",
    tags: ["Relationship", "ER Model", "Participation", "Degree"],
  },

  {
    id: 13,
    section: "ER Model",
    title: "Cardinality",
    tagline: "How many instances of one entity can relate to instances of another",
    description:
      "Cardinality defines the numerical relationship between two entities — how many instances of Entity A can be associated with how many instances of Entity B.\n\n<b>The four cardinality types</b>\n• One-to-One (1:1) — one Employee has one Parking Spot, one Parking Spot belongs to one Employee\n• One-to-Many (1:N) — one Customer places many Orders, but each Order belongs to one Customer\n• Many-to-One (N:1) — the reverse view of the same 1:N relationship, seen from the 'many' side\n• Many-to-Many (M:N) — many Students enroll in many Courses, and vice versa\n\n<b>How cardinality is implemented in tables</b>\n• 1:1 — foreign key on either table (often with a UNIQUE constraint)\n• 1:N — foreign key placed on the 'many' side table\n• M:N — needs a separate junction/bridge table, since neither table alone can hold multiple foreign keys per row cleanly",
    note:
      "Getting cardinality wrong at design time is expensive to fix later — it decides which table gets the foreign key, and whether you need a junction table at all. Confirm cardinality before writing CREATE TABLE statements.",
    diagram:
      "  1:1     Employee ──────── ParkingSpot\n  1:N     Customer ───────< Order          (FK lives on Order)\n  M:N     Student  >─────── Course          (needs a junction table)",
    example:
      "-- 1:N — foreign key on the 'many' side (orders)\nCREATE TABLE orders (\n  id          INT PRIMARY KEY,\n  customer_id INT REFERENCES customers(id)\n);\n\n-- M:N — needs a junction table, no single FK column works\nCREATE TABLE enrollments (\n  student_id INT REFERENCES students(id),\n  course_id  INT REFERENCES courses(id),\n  PRIMARY KEY (student_id, course_id)\n);",
    tip: "Interviewers often probe cardinality with 'where does the foreign key go?' Rule: the foreign key goes on the 'many' side in a 1:N relationship; many-to-many always needs its own junction table.",
    tags: ["Cardinality", "One-to-Many", "Many-to-Many", "ER Model"],
  },

  // ─────────────────────────────────────────────
  // RELATIONAL DATABASE
  // ─────────────────────────────────────────────
  {
    id: 14,
    section: "Relational Database",
    title: "Relation",
    tagline: "The formal name for a table — a set of tuples sharing the same attributes",
    description:
      "In relational database theory, a relation is the formal term for what we casually call a table — a set of tuples (rows), each having the same set of attributes (columns).\n\n<b>Properties of a relation</b>\n• Each row (tuple) is unique — no two rows are entirely identical\n• The order of rows does not matter\n• The order of columns does not matter\n• Each cell holds a single, atomic value (no lists or nested tables inside a cell)\n\n<b>Relation vs table</b>\n• 'Relation' is the mathematical/theoretical term from Codd's original 1970 paper\n• 'Table' is the everyday, practical term used in SQL and by developers\n• They mean the same thing in day-to-day work",
    note:
      "You'll rarely hear 'relation' outside of textbooks — in real SQL work, everyone just says 'table.' But knowing the formal term shows you understand where the term 'relational database' actually comes from.",
    diagram:
      "  Relation: students\n  ┌────┬─────────┐\n  │ id │ name    │   ← attributes (columns)\n  ├────┼─────────┤\n  │ 1  │ Asha    │   ← tuple (row)\n  │ 2  │ Bikash  │   ← tuple (row)\n  └────┴─────────┘",
    example:
      "-- This CREATE TABLE defines a relation named 'students'\nCREATE TABLE students (\n  id   INT PRIMARY KEY,\n  name VARCHAR(100)\n);",
    tip: "If asked where the term 'relational database' comes from: a 'relation' is the formal name for a table, from Codd's 1970 paper — not because tables 'relate' to each other via foreign keys, a common misconception.",
    tags: ["Relation", "Table", "Relational Model"],
  },

  {
    id: 15,
    section: "Relational Database",
    title: "Tuple",
    tagline: "The formal name for a single row in a relation",
    description:
      "A tuple is the formal term for a single row in a relation (table) — one complete record, holding one value for each attribute.\n\n<b>Key properties</b>\n• A tuple represents one entity instance — e.g. one specific student\n• Every tuple in a relation must be unique (no two identical rows)\n• The values within a tuple are ordered according to the relation's attribute order, but the tuples themselves have no inherent order\n\n<b>Tuple vs row</b>\n• 'Tuple' is the formal relational-algebra term\n• 'Row' or 'record' is the everyday SQL term for the same thing",
    note:
      "A table with zero tuples is still a valid relation — an empty table. The schema (attributes/columns) can exist before any tuples (rows) are inserted.",
    diagram:
      "  students\n  ┌────┬─────────┬────────────────────┐\n  │ id │ name    │ email              │\n  ├────┼─────────┼────────────────────┤\n  │ 1  │ Asha    │ asha@example.com   │  ← one tuple\n  │ 2  │ Bikash  │ bikash@example.com │  ← another tuple\n  └────┴─────────┴────────────────────┘",
    example:
      "INSERT INTO students (id, name, email)\nVALUES (1, 'Asha Gurung', 'asha@example.com');  -- inserts one tuple",
    tip: "If a question uses relational-algebra vocabulary, just translate mentally: tuple = row, attribute = column, relation = table. The concepts are identical, only the vocabulary differs.",
    tags: ["Tuple", "Row", "Relational Model"],
  },

  {
    id: 16,
    section: "Relational Database",
    title: "Attribute",
    tagline: "A named column of a relation, holding one type of value per tuple",
    description:
      "In relational database theory, an attribute is a named column of a relation — a single property that every tuple in that relation has a value for.\n\n<b>Key properties</b>\n• Every attribute has a name and a defined domain (the set of allowed values)\n• Every tuple supplies exactly one value per attribute (or NULL, if allowed)\n• Attributes are what you SELECT, filter with WHERE, and JOIN across tables\n\n<b>Attribute vs column</b>\n• 'Attribute' is the formal relational-model term\n• 'Column' or 'field' is the everyday SQL term for the same thing\n\n<b>Why attributes must be atomic</b>\n• The relational model requires each attribute value to be a single, indivisible value (this is the basis of First Normal Form) — no storing a list of values inside one cell",
    note:
      "This is the same underlying concept as the 'Attribute' entry under ER Model — an ER diagram's attribute becomes a relational database's attribute (column) once the design is implemented as tables.",
    diagram:
      "  Relation: orders\n  ┌────┬─────────────┬────────┐\n  │ id │ customer_id │ total  │  ← attributes\n  └────┴─────────────┴────────┘",
    example:
      "SELECT id, customer_id, total   -- selecting specific attributes\nFROM orders\nWHERE total > 100;              -- filtering by an attribute's value",
    tip: "If a question distinguishes ER-model 'attribute' from relational-model 'attribute,' explain the pipeline: ER diagram attribute → relational attribute (column) → must hold atomic values to satisfy 1NF.",
    tags: ["Attribute", "Column", "Domain", "Relational Model"],
  },

  {
    id: 17,
    section: "Relational Database",
    title: "Domain",
    tagline: "The set of valid values that an attribute is allowed to hold",
    description:
      "A domain is the complete set of legal, allowed values for a given attribute. Every attribute is defined over exactly one domain.\n\n<b>Examples of domains</b>\n• `age` → domain is positive integers, typically 0–120\n• `gender` → domain might be a fixed enum like {'M', 'F', 'Other'}\n• `email` → domain is strings matching a valid email pattern\n• `status` → domain might be {'pending', 'shipped', 'delivered'}\n\n<b>How domains are enforced in SQL</b>\n• Data types (`INT`, `VARCHAR`, `DATE`) enforce the broad shape of the domain\n• `CHECK` constraints narrow the domain further (e.g. `CHECK (age >= 0)`)\n• `ENUM` types or foreign keys to a lookup table restrict values to an exact allowed set\n\n<b>Why domains matter</b>\n• They stop invalid data from ever entering the database\n• Two attributes are 'domain-compatible' only if they share the same domain — this matters for operations like UNION in relational algebra, which requires matching domains",
    note:
      "A domain is stricter than just a data type. `INT` is a data type; 'an integer between 0 and 120' is the actual domain. CHECK constraints are how you express the full domain, not just the type.",
    diagram:
      "  Attribute: age        Domain: integers 0-120\n  Attribute: status     Domain: {'pending','shipped','delivered'}\n  Attribute: email      Domain: strings matching a valid email format",
    example:
      "CREATE TABLE students (\n  id     INT PRIMARY KEY,\n  age    INT CHECK (age BETWEEN 0 AND 120),      -- domain enforced\n  status VARCHAR(20) CHECK (status IN ('pending','shipped','delivered'))\n);",
    tip: "If asked to define a domain precisely: 'the set of all valid values an attribute can take.' Then show you can enforce it in SQL with CHECK constraints or ENUM types, not just choosing a data type.",
    tags: ["Domain", "Constraints", "Data Integrity", "CHECK"],
  },

  // ─────────────────────────────────────────────
  // SQL
  // ─────────────────────────────────────────────
  {
    id: 18,
    section: "SQL",
    title: "DDL — Data Definition Language",
    tagline: "SQL commands that define and modify the structure of the database itself",
    description:
      "DDL (Data Definition Language) is the group of SQL commands used to define, modify, and remove the structure of database objects — tables, schemas, indexes — not the data inside them.\n\n<b>The three core DDL commands</b>\n• `CREATE` — builds a new database object (table, index, view, schema)\n• `ALTER` — modifies the structure of an existing object (add/drop/rename a column, change a data type)\n• `DROP` — permanently deletes an object and all the data inside it\n\n<b>Key trait: auto-commit</b>\n• In most databases, DDL statements auto-commit immediately — you generally cannot roll back a `DROP TABLE` the way you can roll back a data change\n\n<b>DDL vs DML</b>\n• DDL changes the shape of the database (the schema)\n• DML changes the data living inside that shape",
    note:
      "DROP TABLE is one of the most dangerous commands in SQL — it deletes the structure and all the data, and in most databases cannot be undone with ROLLBACK. Always double-check the table name and environment before running it.",
    diagram:
      "  DDL — changes STRUCTURE\n\n  CREATE  → build a new table/index/schema\n  ALTER   → modify an existing table's structure\n  DROP    → permanently remove a table/object",
    example:
      "-- CREATE: define a new table's structure\nCREATE TABLE products (\n  id    INT PRIMARY KEY,\n  name  VARCHAR(100),\n  price DECIMAL(10,2)\n);\n\n-- ALTER: modify the structure\nALTER TABLE products ADD COLUMN in_stock BOOLEAN DEFAULT true;\n\n-- DROP: remove the object entirely\nDROP TABLE products;",
    tip: "Remember DDL with the phrase 'shapes the schema.' If a command changes what a table looks like (its columns, types, or existence) rather than the rows inside it, it's DDL.",
    tags: ["DDL", "CREATE", "ALTER", "DROP", "SQL Commands"],
  },

  {
    id: 19,
    section: "SQL",
    title: "DML — Data Manipulation Language",
    tagline: "SQL commands that insert, update, and delete the data inside existing tables",
    description:
      "DML (Data Manipulation Language) is the group of SQL commands used to manipulate the actual data stored inside tables — without changing the table's structure.\n\n<b>The three core DML commands</b>\n• `INSERT` — adds new rows to a table\n• `UPDATE` — modifies values in existing rows\n• `DELETE` — removes existing rows\n\n<b>Key trait: transactional</b>\n• Unlike DDL, DML statements are typically part of a transaction and can be rolled back with `ROLLBACK` before being made permanent with `COMMIT`\n\n<b>DML vs DDL</b>\n• DML changes what's inside the table (the rows)\n• DDL changes the table's shape itself (columns, types, existence)",
    note:
      "Always run `UPDATE`/`DELETE` with a `WHERE` clause you have tested first — omitting it modifies or deletes every row in the table. Wrapping the statement in a transaction lets you `ROLLBACK` if something looks wrong.",
    diagram:
      "  DML — changes DATA inside existing tables\n\n  INSERT  → add new rows\n  UPDATE  → modify existing rows\n  DELETE  → remove existing rows",
    example:
      "-- INSERT: add a new row\nINSERT INTO products (id, name, price) VALUES (1, 'Keyboard', 29.99);\n\n-- UPDATE: modify existing rows\nUPDATE products SET price = 24.99 WHERE id = 1;\n\n-- DELETE: remove rows\nDELETE FROM products WHERE id = 1;",
    tip: "Remember DML with the phrase 'manipulates the data, not the design.' If the table's columns stay the same but the rows change, it's DML — INSERT, UPDATE, DELETE.",
    tags: ["DML", "INSERT", "UPDATE", "DELETE", "SQL Commands"],
  },

  {
    id: 20,
    section: "SQL",
    title: "DQL — Data Query Language",
    tagline: "The single SQL command used to read and retrieve data — SELECT",
    description:
      "DQL (Data Query Language) consists of a single command — `SELECT` — used purely to retrieve data from one or more tables without modifying it.\n\n<b>Why SELECT gets its own category</b>\n• Unlike DDL (structure) and DML (write operations), `SELECT` is read-only\n• It is by far the most frequently used SQL command in everyday application code\n\n<b>What SELECT can do</b>\n• Choose specific columns to return\n• Filter rows with `WHERE`\n• Combine data across tables with `JOIN`\n• Group and summarize with `GROUP BY` and aggregate functions (`COUNT`, `SUM`, `AVG`)\n• Sort results with `ORDER BY`, limit results with `LIMIT`\n\n<b>DQL vs DML</b>\n• Some textbooks fold `SELECT` into DML since it's technically 'manipulating' a result set\n• Most modern courses separate it into its own DQL category because it never writes data",
    note:
      "Some references skip 'DQL' entirely and just call SELECT part of DML. Either classification is fine to know — what matters is understanding SELECT is the only read-only command among the five categories.",
    diagram:
      "  DQL — reads DATA, never modifies it\n\n  SELECT columns\n  FROM table\n  WHERE condition\n  JOIN other_table\n  GROUP BY column\n  ORDER BY column",
    example:
      "SELECT p.name, p.price\nFROM products p\nWHERE p.price > 20\nORDER BY p.price DESC\nLIMIT 10;",
    tip: "If a question asks 'which SQL category has only one command,' the answer is DQL — just SELECT. It's the easiest of the five categories to remember for exactly that reason.",
    tags: ["DQL", "SELECT", "SQL Commands"],
  },

  {
    id: 21,
    section: "SQL",
    title: "DCL — Data Control Language",
    tagline: "SQL commands that grant or revoke access permissions on database objects",
    description:
      "DCL (Data Control Language) is the group of SQL commands used to control who is allowed to access or modify specific database objects — permissions and security, not data or structure.\n\n<b>The two core DCL commands</b>\n• `GRANT` — gives a user or role a specific permission (e.g. SELECT, INSERT, UPDATE on a table)\n• `REVOKE` — removes a previously granted permission\n\n<b>Why DCL matters</b>\n• Not every application or user should be able to do everything — a reporting dashboard might only need `SELECT`, never `DELETE`\n• Following the principle of least privilege (only grant the minimum access needed) reduces the damage a bug or compromised credential can do",
    note:
      "A common real-world pattern: create a read-only database role for analytics/reporting tools using `GRANT SELECT` only, and a separate, more privileged role for the application backend that also needs `INSERT`/`UPDATE`/`DELETE`.",
    diagram:
      "  DCL — controls WHO can do WHAT\n\n  GRANT   → give a permission to a user/role\n  REVOKE  → take a permission away",
    example:
      "-- Give a reporting user read-only access\nGRANT SELECT ON products TO reporting_user;\n\n-- Give an app user full data access, but not structural changes\nGRANT SELECT, INSERT, UPDATE, DELETE ON products TO app_user;\n\n-- Revoke a permission that's no longer needed\nREVOKE DELETE ON products FROM app_user;",
    tip: "In interviews on database security, mention the principle of least privilege: grant only the exact permissions a role needs, and use REVOKE to tighten access as requirements change.",
    tags: ["DCL", "GRANT", "REVOKE", "Permissions", "Security"],
  },

  {
    id: 22,
    section: "SQL",
    title: "TCL — Transaction Control Language",
    tagline: "SQL commands that manage the boundaries of a transaction",
    description:
      "TCL (Transaction Control Language) is the group of SQL commands used to manage transactions — grouping multiple DML statements so they succeed or fail together.\n\n<b>The two core TCL commands</b>\n• `COMMIT` — permanently saves all changes made in the current transaction\n• `ROLLBACK` — undoes all changes made in the current transaction, reverting to the state before it began\n\n<b>Why TCL matters</b>\n• Some operations require multiple steps to be atomic — e.g. transferring money means debiting one account and crediting another; both must succeed, or neither should\n• Without TCL, a crash halfway through could leave the database in an inconsistent state (money deducted but never credited)\n\n<b>Related command</b>\n• `SAVEPOINT` — marks an intermediate point inside a transaction that you can roll back to, without undoing the entire transaction",
    note:
      "TCL is what makes the 'Atomicity' in ACID possible — COMMIT and ROLLBACK are the actual mechanism that guarantees a transaction either fully happens or doesn't happen at all.",
    diagram:
      "  BEGIN TRANSACTION\n      │\n      ├── UPDATE accounts SET balance = balance - 100 WHERE id = 1;  (debit)\n      ├── UPDATE accounts SET balance = balance + 100 WHERE id = 2;  (credit)\n      │\n      ├── all good?  → COMMIT    (both changes saved permanently)\n      └── error?     → ROLLBACK  (both changes undone, as if nothing happened)",
    example:
      "BEGIN TRANSACTION;\n\nUPDATE accounts SET balance = balance - 100 WHERE id = 1;\nUPDATE accounts SET balance = balance + 100 WHERE id = 2;\n\n-- If both updates succeeded:\nCOMMIT;\n\n-- If something went wrong instead:\n-- ROLLBACK;",
    tip: "The money-transfer example is the classic way to explain TCL: 'debit account A, credit account B — COMMIT only if both succeed, ROLLBACK if either fails, so money is never lost or duplicated.'",
    tags: ["TCL", "COMMIT", "ROLLBACK", "Transactions", "SQL Commands"],
  },

  // ─────────────────────────────────────────────
  // ADVANCED DATABASE
  // ─────────────────────────────────────────────
  {
    id: 23,
    section: "Advanced Database",
    title: "Normalization",
    tagline: "The process of organizing tables to reduce redundancy and avoid data anomalies",
    description:
      "Normalization is the step-by-step process of structuring tables to minimize data redundancy and prevent update, insert, and delete anomalies. It progresses through a series of 'normal forms,' each stricter than the last.\n\n<b>First Normal Form (1NF)</b>\n• Every column must hold a single, atomic value — no lists or repeating groups in one cell\n• Fix: split multi-valued data into its own row or table\n\n<b>Second Normal Form (2NF)</b>\n• Must already be in 1NF\n• Every non-key column must depend on the entire primary key, not just part of it (only matters with composite primary keys)\n• Fix: move columns that depend on only part of the key into their own table\n\n<b>Third Normal Form (3NF)</b>\n• Must already be in 2NF\n• No non-key column may depend on another non-key column (no 'transitive dependency')\n• Fix: move the transitively dependent column into its own table\n\n<b>Boyce-Codd Normal Form (BCNF)</b>\n• A stricter version of 3NF\n• Every determinant (a column that determines another column's value) must be a candidate key\n• Handles rare edge cases 3NF misses, usually involving overlapping candidate keys\n\n<b>Why normalize</b>\n• Prevents the same fact from being stored in multiple places, which could go out of sync\n• Makes updates safer — change a fact in exactly one place",
    note:
      "Normalization trades write-safety for read complexity — a fully normalized schema needs more JOINs to reassemble data. In read-heavy systems, teams sometimes deliberately denormalize after normalizing first, to accept controlled redundancy for fewer JOINs.",
    diagram:
      "  UNNORMALIZED (repeating group)          1NF (atomic rows)         3NF (price moved out)\n  order:1, items:                         id | item | price          orders(order_id, item)\n   ['pen,$1','pad,$3']      ───split──►    1  | pen  | $1     ──►    items(item, price)\n                                           1  | pad  | $3            no repeated price fact",
    example:
      "-- BEFORE (violates 1NF): items stored as a comma list in one column\n-- orders(id, items_and_prices)  ->  1, 'pen:$1, pad:$3'\n\n-- AFTER 1NF: atomic values, one row per item\nCREATE TABLE order_items (\n  order_id INT,\n  item     VARCHAR(50),\n  price    DECIMAL(10,2)\n);\n\n-- AFTER 3NF: price depends only on the item, not the order,\n-- so it moves to its own table to avoid repeating/inconsistent prices\nCREATE TABLE items (\n  name  VARCHAR(50) PRIMARY KEY,\n  price DECIMAL(10,2)\n);\nCREATE TABLE order_items (\n  order_id INT REFERENCES orders(id),\n  item     VARCHAR(50) REFERENCES items(name)\n);",
    tip: "Define each normal form by the anomaly it fixes: 1NF fixes repeating groups, 2NF fixes partial key dependency, 3NF fixes transitive dependency, BCNF fixes edge cases with overlapping candidate keys.",
    tags: ["Normalization", "1NF", "2NF", "3NF", "BCNF", "Redundancy"],
  },

  {
    id: 24,
    section: "Advanced Database",
    title: "Indexing",
    tagline: "A lookup structure that lets the database find rows without scanning the whole table",
    description:
      "An index is an auxiliary data structure (usually a B-tree) built on one or more columns that lets the database jump directly to matching rows instead of scanning every row in the table.\n\nThink of a book's index at the back:\n• Without it, finding \"quantum physics\" means reading every page\n• With it, you jump straight to page 214\n\n<b>How it works</b>\n• The database maintains a sorted structure mapping column values to row locations\n• A query filtering on an indexed column can binary-search the index instead of scanning every row (a full table scan)\n\n<b>The trade-off</b>\n• Reads (`SELECT ... WHERE`) become much faster on indexed columns\n• Writes (`INSERT`/`UPDATE`/`DELETE`) become slightly slower, since every index on the table must also be updated\n• Indexes use extra disk space\n\n<b>What to index</b>\n• Columns frequently used in `WHERE`, `JOIN`, and `ORDER BY` clauses\n• Avoid over-indexing tables that are written to far more often than they're read",
    note:
      "An index speeds up reads but slows down writes — every INSERT/UPDATE/DELETE must also update every index on that table. Index the columns you filter/join on often, not every column.",
    diagram:
      "  WITHOUT INDEX (full table scan)\n  Row1 → Row2 → Row3 → ... → Row10000   (check every row for a match)\n\n  WITH INDEX (B-tree on 'email')\n            [m]\n          /     \\\n       [b-l]   [n-z]\n       /   \\     /   \\\n    ...    ...  ...   ...\n  → jump directly to the matching branch, skip everything else",
    example:
      "-- Without an index, this scans every row in a large table\nSELECT * FROM users WHERE email = 'asha@example.com';\n\n-- Add an index to make that lookup fast\nCREATE INDEX idx_users_email ON users(email);\n\n-- Now the same query can use the index instead of a full scan\nEXPLAIN SELECT * FROM users WHERE email = 'asha@example.com';",
    tip: "If asked 'why not index every column?', explain the write cost: every index must be updated on every INSERT/UPDATE/DELETE, so indexing a rarely-queried, frequently-written column wastes performance for no read benefit.",
    tags: ["Indexing", "B-Tree", "Performance", "Query Optimization"],
  },

  {
    id: 25,
    section: "Advanced Database",
    title: "Views",
    tagline: "A saved, virtual table defined by a query — computed on the fly, not stored",
    description:
      "A view is a saved SQL query that behaves like a virtual table. It doesn't store data itself — every time you query the view, the underlying query runs fresh against the real tables.\n\n<b>Why use a view</b>\n• Simplify a complex, frequently-used JOIN into a single simple `SELECT * FROM view_name`\n• Restrict access — expose only certain columns/rows to a user, without giving them the base table's full contents\n• Provide a stable interface — the view's shape stays the same even if the underlying table structure changes internally\n\n<b>Regular view vs materialized view</b>\n• Regular view — no data stored, runs the query every time (always up to date, but no faster than the underlying query)\n• Materialized view — the query result IS physically stored and must be refreshed periodically; faster to read, but can be stale until refreshed",
    note:
      "A view is not a performance optimization by itself — a regular view runs its underlying query every time it's queried. For actual query speed-up, use a materialized view (and remember to refresh it) or add proper indexes to the base tables.",
    diagram:
      "  CREATE VIEW → stores the QUERY, not the data\n\n  active_customers VIEW\n      │\n      │  defined as: SELECT * FROM customers WHERE status = 'active'\n      ↓\n  Querying the view re-runs that SELECT against the real customers table",
    example:
      "-- Create a view hiding inactive customers and sensitive columns\nCREATE VIEW active_customers AS\nSELECT id, name, email\nFROM customers\nWHERE status = 'active';\n\n-- Query it exactly like a table\nSELECT * FROM active_customers WHERE name LIKE 'A%';\n\n-- A materialized view, refreshed on demand (PostgreSQL)\nCREATE MATERIALIZED VIEW customer_totals AS\nSELECT customer_id, SUM(total) AS lifetime_spend FROM orders GROUP BY customer_id;\n\nREFRESH MATERIALIZED VIEW customer_totals;",
    tip: "If asked whether a view improves performance, say no by default — a plain view just wraps a query. Only a materialized view actually caches results, at the cost of the data being potentially stale until the next refresh.",
    tags: ["Views", "Materialized View", "Query Abstraction"],
  },

  {
    id: 26,
    section: "Advanced Database",
    title: "Stored Procedures",
    tagline: "Precompiled SQL logic saved in the database and executed on demand",
    description:
      "A stored procedure is a named block of SQL (and often procedural logic like loops and conditionals) saved inside the database itself and executed with a single call.\n\n<b>Why use them</b>\n• Bundle multi-step logic (several INSERTs/UPDATEs, validation, conditionals) into one reusable unit\n• Reduce network round-trips — the application sends one call instead of several separate queries\n• Precompiled and optimized by the database, often faster than sending equivalent ad-hoc queries repeatedly\n• Centralize business logic that must run consistently regardless of which application calls it\n\n<b>Trade-offs</b>\n• Harder to version control and test compared to application code\n• Ties business logic to a specific database vendor's procedural SQL dialect\n• Many modern teams prefer keeping business logic in the application layer, reserving stored procedures for tight, database-specific operations",
    note:
      "Stored procedures shine for logic that must be atomic and fast (e.g. bulk data processing inside the database), but overusing them for general business logic makes an application harder to test, version, and port to a different database.",
    diagram:
      "  Application\n      │\n      │  CALL transfer_funds(1, 2, 100);   ← one call\n      ↓\n  ┌──────────────────────────────┐\n  │  Stored Procedure (in DB)      │\n  │  1. debit account 1             │\n  │  2. credit account 2            │\n  │  3. log the transaction          │\n  └──────────────────────────────┘\n  All three steps run inside the database, as one unit.",
    example:
      "CREATE PROCEDURE transfer_funds(sender_id INT, receiver_id INT, amount DECIMAL)\nLANGUAGE plpgsql AS $$\nBEGIN\n  UPDATE accounts SET balance = balance - amount WHERE id = sender_id;\n  UPDATE accounts SET balance = balance + amount WHERE id = receiver_id;\n  INSERT INTO transaction_log (sender_id, receiver_id, amount) VALUES (sender_id, receiver_id, amount);\nEND;\n$$;\n\n-- Calling it from the application\nCALL transfer_funds(1, 2, 100);",
    tip: "Use a stored procedure when several statements must run as a single fast, atomic unit close to the data. Keep general business logic in the application layer for easier testing and portability.",
    tags: ["Stored Procedures", "Business Logic", "Performance"],
  },

  {
    id: 27,
    section: "Advanced Database",
    title: "Triggers",
    tagline: "Code that automatically runs in response to an INSERT, UPDATE, or DELETE",
    description:
      "A trigger is a block of code attached to a table that automatically executes when a specific event happens — before or after an `INSERT`, `UPDATE`, or `DELETE`.\n\n<b>Common uses</b>\n• Auditing — automatically log every change to a sensitive table\n• Enforcing complex business rules that a simple `CHECK` constraint can't express\n• Keeping a derived/summary value in sync (e.g. updating a `product_count` whenever a row is inserted or deleted)\n• Preventing invalid changes (e.g. blocking a `DELETE` on a record that still has active dependents)\n\n<b>BEFORE vs AFTER triggers</b>\n• `BEFORE` trigger — runs before the change is applied; can validate or modify the incoming data\n• `AFTER` trigger — runs after the change is applied; typically used for logging or cascading updates\n\n<b>Caution</b>\n• Triggers run silently and automatically — they can make debugging harder if a developer doesn't know a trigger exists and is modifying data behind the scenes",
    note:
      "Overusing triggers creates 'invisible' side effects that are easy to forget about and hard to debug — an UPDATE that seems simple in application code might silently cascade into several other table changes. Document any trigger clearly.",
    diagram:
      "  INSERT INTO orders (...) VALUES (...);\n      │\n      ▼\n  Trigger fires automatically (AFTER INSERT)\n      │\n      ▼\n  UPDATE customers SET order_count = order_count + 1 WHERE id = NEW.customer_id;\n\n  The application never explicitly ran that UPDATE — the trigger did it.",
    example:
      "CREATE TRIGGER increment_order_count\nAFTER INSERT ON orders\nFOR EACH ROW\nEXECUTE FUNCTION bump_customer_order_count();\n\nCREATE FUNCTION bump_customer_order_count() RETURNS TRIGGER AS $$\nBEGIN\n  UPDATE customers SET order_count = order_count + 1 WHERE id = NEW.customer_id;\n  RETURN NEW;\nEND;\n$$ LANGUAGE plpgsql;",
    tip: "If asked for a real trigger use case, audit logging is the safest example: an AFTER trigger on UPDATE/DELETE that writes the old row values into an audit_log table, with zero risk of blocking the original operation.",
    tags: ["Triggers", "Automation", "Auditing", "BEFORE/AFTER"],
  },

  {
    id: 28,
    section: "Advanced Database",
    title: "Transactions",
    tagline: "A group of one or more SQL operations executed as a single, all-or-nothing unit",
    description:
      "A transaction is a sequence of one or more SQL operations grouped together so they either all succeed or all fail — there is no in-between, partially-applied state.\n\n<b>The classic example</b>\n• Transferring money between two bank accounts requires two updates: debit account A, credit account B\n• If only the debit succeeds and the credit fails (e.g. a crash), money disappears — the transaction wraps both updates so that either both happen or neither does\n\n<b>Lifecycle of a transaction</b>\n• `BEGIN` (or `START TRANSACTION`) — marks the start\n• One or more DML statements\n• `COMMIT` — makes all changes permanent\n• `ROLLBACK` — undoes all changes since `BEGIN`, as if none of it happened\n\n<b>Why transactions matter</b>\n• They are the mechanism that makes ACID guarantees possible in practice\n• Without transactions, a crash or error partway through a multi-step operation can leave the database in an inconsistent state",
    note:
      "A transaction's boundary should be as short as practically possible — long-running transactions hold locks longer, increasing the chance of blocking other queries or causing deadlocks.",
    diagram:
      "  BEGIN\n    │\n    ├── UPDATE accounts SET balance = balance - 100 WHERE id = 1;\n    ├── UPDATE accounts SET balance = balance + 100 WHERE id = 2;\n    │\n    ▼\n  COMMIT   ← both changes become permanent together\n  (or ROLLBACK → both changes undone together)",
    example:
      "BEGIN;\n\nUPDATE accounts SET balance = balance - 100 WHERE id = 1;\nUPDATE accounts SET balance = balance + 100 WHERE id = 2;\n\nCOMMIT;  -- both updates are now permanent, or neither happened if it failed before this line",
    tip: "When asked to define a transaction precisely, lead with 'all-or-nothing' — partial completion is never an acceptable outcome, enforced through COMMIT and ROLLBACK.",
    tags: ["Transactions", "ACID", "COMMIT", "ROLLBACK"],
  },

  {
    id: 29,
    section: "Advanced Database",
    title: "ACID Properties",
    tagline: "The four guarantees that make database transactions safe and reliable",
    description:
      "ACID is an acronym for the four properties that guarantee a database transaction behaves safely and predictably, even under failures or concurrent access.\n\n<b>Atomicity</b>\n• A transaction is all-or-nothing — either every operation inside it succeeds, or none of them take effect\n• Example: a money transfer's debit and credit either both happen or neither does\n\n<b>Consistency</b>\n• A transaction can only move the database from one valid state to another valid state, never violating defined rules (constraints, keys, triggers)\n• Example: a `CHECK (balance >= 0)` constraint prevents a transaction from ever leaving an account negative\n\n<b>Isolation</b>\n• Concurrent transactions do not interfere with each other's intermediate state — each transaction behaves as if it were running alone\n• Example: two people transferring money at the same time should not see each other's half-finished updates\n\n<b>Durability</b>\n• Once a transaction is committed, its changes survive permanently — even a power failure or crash immediately after\n• Example: after `COMMIT` returns success, that data is written to durable storage, not just held in memory",
    note:
      "Remember ACID with the money-transfer example for all four letters at once: Atomicity (both legs happen or neither), Consistency (balances never go invalid), Isolation (concurrent transfers don't see each other's half-done state), Durability (once confirmed, it survives a crash).",
    diagram:
      "  A — Atomicity     : all steps succeed, or none do\n  C — Consistency   : constraints/rules always hold, before and after\n  I — Isolation      : concurrent transactions don't see each other's half-done work\n  D — Durability     : once committed, survives crashes/power loss",
    example:
      "BEGIN;\n\n-- Atomicity: both updates commit together or not at all\nUPDATE accounts SET balance = balance - 100 WHERE id = 1;\nUPDATE accounts SET balance = balance + 100 WHERE id = 2;\n\n-- Consistency: a CHECK constraint on the table (e.g. CHECK (balance >= 0))\n-- would reject this transaction if it drove a balance negative\n\nCOMMIT;  -- Durability: guaranteed to survive a crash right after this line",
    tip: "Define each ACID letter with a concrete failure it prevents: Atomicity prevents partial updates, Consistency prevents invalid states, Isolation prevents dirty reads between transactions, Durability prevents losing committed data on crash.",
    tags: ["ACID", "Atomicity", "Consistency", "Isolation", "Durability"],
  },

  {
    id: 30,
    section: "Advanced Database",
    title: "Concurrency Control",
    tagline: "The mechanisms that let multiple transactions run at once without corrupting data",
    description:
      "Concurrency control is the set of techniques a DBMS uses to let multiple transactions execute at the same time while still preserving correctness — no lost updates, no reading half-finished changes from another transaction.\n\n<b>Problems concurrency control prevents</b>\n• <b>Lost update</b> — two transactions read the same value, both update it, and one update silently overwrites the other\n• <b>Dirty read</b> — a transaction reads data written by another transaction that hasn't committed yet, and that data later gets rolled back\n• <b>Non-repeatable read</b> — a transaction reads the same row twice and gets different values because another transaction updated it in between\n• <b>Phantom read</b> — a transaction re-runs the same query and sees new rows that appeared due to another transaction's insert\n\n<b>Main techniques</b>\n• Locking — transactions acquire locks on the data they touch (see: Locking)\n• Optimistic concurrency control — proceed without locks, then check for conflicts before committing (used when conflicts are rare)\n• Multi-Version Concurrency Control (MVCC) — keep multiple versions of a row so readers never block writers (used by PostgreSQL, MySQL InnoDB)\n\n<b>Isolation levels</b>\n• Databases let you choose how strictly to prevent these problems via isolation levels: Read Uncommitted, Read Committed, Repeatable Read, Serializable — each trading some performance for stricter correctness",
    note:
      "Higher isolation levels prevent more anomalies but reduce concurrency (more blocking/waiting). Most applications default to 'Read Committed' as a practical middle ground, reaching for 'Serializable' only when correctness is critical enough to accept the performance cost.",
    diagram:
      "  Without concurrency control (LOST UPDATE):\n  T1: read balance = 100\n  T2: read balance = 100\n  T1: write balance = 100 - 30 = 70\n  T2: write balance = 100 - 50 = 50   ← overwrites T1's update, $30 debit is lost!\n\n  With concurrency control (locking):\n  T1: lock row → read 100 → write 70 → unlock\n  T2: (waits for lock) → read 70 → write 20 → unlock   ← correct final balance",
    example:
      "-- Isolation level controls how strictly anomalies are prevented\nSET TRANSACTION ISOLATION LEVEL SERIALIZABLE;\n\nBEGIN;\nSELECT balance FROM accounts WHERE id = 1;   -- read\nUPDATE accounts SET balance = balance - 30 WHERE id = 1;\nCOMMIT;\n\n-- Under SERIALIZABLE, a concurrent conflicting transaction\n-- would be forced to retry rather than silently lose this update",
    tip: "If asked to name the four classic concurrency anomalies, list them in severity order: dirty read (worst), non-repeatable read, phantom read, lost update — then map each to which isolation level prevents it.",
    tags: ["Concurrency Control", "Isolation Levels", "MVCC", "Lost Update"],
  },

  {
    id: 31,
    section: "Advanced Database",
    title: "Locking",
    tagline: "Reserving access to data so other transactions must wait before touching it",
    description:
      "Locking is the mechanism where a transaction reserves a piece of data (a row, page, or table) so that other transactions cannot conflict with it until the lock is released.\n\n<b>Types of locks</b>\n• Shared lock (read lock) — multiple transactions can hold a shared lock on the same data at once; used for reading\n• Exclusive lock (write lock) — only one transaction can hold it at a time; used for writing; blocks both reads and writes from others\n\n<b>Lock granularity</b>\n• Row-level locking — locks only the specific rows touched; allows high concurrency\n• Table-level locking — locks the entire table; simpler, but blocks far more concurrent work\n\n<b>Two-Phase Locking (2PL)</b>\n• Growing phase — a transaction acquires all the locks it needs\n• Shrinking phase — once it starts releasing locks, it cannot acquire any new ones\n• This protocol guarantees the transaction schedule is serializable (behaves as if transactions ran one at a time)\n\n<b>The cost of locking</b>\n• Locks prevent corruption, but they also make other transactions wait — too much locking, or locks held too long, causes contention and slows the whole system down",
    note:
      "Locking trades concurrency for correctness. Row-level locks (not table-level) and keeping transactions short are the two biggest levers for minimizing how much locking hurts throughput.",
    diagram:
      "  T1: BEGIN; UPDATE accounts SET balance = balance - 100 WHERE id = 1;\n      → acquires EXCLUSIVE lock on row id=1\n\n  T2: UPDATE accounts SET balance = balance + 50 WHERE id = 1;\n      → BLOCKS, waiting for T1's lock to release\n\n  T1: COMMIT;  → lock released\n  T2: → now proceeds with its update",
    example:
      "-- Explicitly lock a row for update, blocking other writers until COMMIT\nBEGIN;\nSELECT * FROM accounts WHERE id = 1 FOR UPDATE;  -- exclusive row lock\nUPDATE accounts SET balance = balance - 100 WHERE id = 1;\nCOMMIT;  -- lock released here",
    tip: "`SELECT ... FOR UPDATE` is the go-to example of explicit row-level locking — it tells the database 'I'm about to modify this row, block anyone else from touching it until I commit.'",
    tags: ["Locking", "Shared Lock", "Exclusive Lock", "Two-Phase Locking"],
  },

  {
    id: 32,
    section: "Advanced Database",
    title: "Deadlock",
    tagline: "Two transactions each waiting on a lock the other is holding — neither can proceed",
    description:
      "A deadlock happens when two (or more) transactions each hold a lock the other one needs, and each is waiting for the other to release it — neither can ever proceed on its own.\n\n<b>The classic scenario</b>\n• Transaction 1 locks Row A, then tries to lock Row B\n• Transaction 2 locks Row B, then tries to lock Row A\n• T1 waits for T2's lock on B; T2 waits for T1's lock on A — permanent standstill\n\n<b>How databases handle it</b>\n• Most DBMSs run a deadlock detection algorithm that periodically checks for these circular waits\n• When found, the database picks one transaction as the 'victim,' forcibly rolls it back, and lets the other proceed\n• The application receives a deadlock error on the rolled-back transaction and should retry it\n\n<b>How to avoid deadlocks in application design</b>\n• Always acquire locks on multiple rows/tables in a consistent, agreed order across all parts of the application\n• Keep transactions as short as possible — the shorter the window, the less chance of overlapping lock requests\n• Use appropriate isolation levels rather than over-locking manually",
    note:
      "The single most effective deadlock prevention technique is lock ordering: if every transaction in your codebase always locks accounts in ascending id order, for example, two transactions can never form a circular wait in the first place.",
    diagram:
      "  T1: locks Row A ──┐              T2: locks Row B ──┐\n                      │                                 │\n  T1: wants Row B ◄───┼── held by T2                    │\n                      │                                 │\n  T2: wants Row A ◄───┴─────────────────────────────────┘  held by T1\n\n  T1 waits on T2, T2 waits on T1 — circular wait = DEADLOCK\n  Database detects this and rolls back one transaction (the 'victim').",
    example:
      "-- Transaction 1                             -- Transaction 2\nBEGIN;                                        BEGIN;\nUPDATE accounts SET balance = balance - 10    UPDATE accounts SET balance = balance - 5\n  WHERE id = 1;   -- locks row 1                 WHERE id = 2;   -- locks row 2\nUPDATE accounts SET balance = balance + 10    UPDATE accounts SET balance = balance + 5\n  WHERE id = 2;   -- waits for T2's lock          WHERE id = 1;   -- waits for T1's lock\n                                               -- DEADLOCK: database rolls back one, e.g. T2\nCOMMIT;                                       -- app catches the error and retries T2",
    tip: "If asked how to prevent deadlocks at the application level: consistent lock ordering — always acquire locks on resources in the same fixed order (e.g. always the lower account id first) across every code path.",
    tags: ["Deadlock", "Locking", "Concurrency", "Lock Ordering"],
  },
];

export const DBMS_CONCEPT_COUNT = DBMS_CONCEPTS.length;
