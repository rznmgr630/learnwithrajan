export interface SystemDesignConcept {
  id: number;
  section: string;
  title: string;
  tagline: string;
  description: string;
  note?: string;
  whyItMatters: string;
  diagramNote: string;
  example: string;
  interviewTip: string;
  tags: string[];
}

export const SYSTEM_DESIGN_SECTIONS = [
  "Foundation",
  "Requirements",
  "Communication",
  "Data Layer",
  "Scaling & Distribution",
  "Reliability",
  "Case Study",
  "Advanced Topics",
] as const;

export const SYSTEM_DESIGN_CONCEPTS: SystemDesignConcept[] = [
  // ─────────────────────────────────────────────
  // FOUNDATION
  // ─────────────────────────────────────────────
  {
    id: 1,
    section: "Foundation",
    title: "What is System Design",
    tagline: "Building systems that work at scale",
    description:
      "A system is a group of components working together to achieve a common goal. System design is the process of deciding what those components should be and how they should interact to solve a problem reliably and at scale.\n\nThink of a bank. At first, there's only one cashier serving customers (a single server). When the line gets long, the first step is to make the cashier work faster (optimize the code and algorithms). If that's not enough, you give the cashier better tools, like a cash-counting machine (vertical scaling — adding more CPU or RAM).\n\nWhen customers keep increasing, you open more counters (horizontal scaling). But now each counter has its own vault, which can lead to inconsistent data. To solve this, all counters share a single central vault (a centralized database).\n\nAs the bank grows, customers may crowd around one counter while others sit idle. To distribute traffic evenly, a guard at the entrance directs each customer to the least busy counter (a load balancer).\n\nEach time a new problem appeared, a new system design concept was introduced to solve it. That's the essence of system design: identifying bottlenecks and choosing the right solutions as the system grows.",
    whyItMatters:
      "Anyone can write code that works for 10 users. System design is what makes it work for 10 million at once. Interviews test whether you can evolve a simple design as constraints change — exactly what the bank story demonstrates.",
    diagramNote:
      "Fig. 1.1 — Each problem at the bank introduced a new system design concept. The five-step evolution mirrors how every real system grows.",
    example:
      "WhatsApp handles 2–10 million messages per day using distributed servers, a centralized database, and load balancers — the exact same evolution as the alien bank, just at internet scale.",
    interviewTip:
      "When given any design prompt, state: 'A system is components + a common goal. Let me identify the components.' Then evolve from the simplest design step by step — single server → scale out → add DB → add cache → add load balancer. This structured evolution shows depth.",
    tags: ["Architecture", "Scale", "Components", "High Level Design", "Bank Analogy"],
  },
  {
    id: 2,
    section: "Foundation",
    title: "Data vs Compute Intensive",
    tagline: "Identify where the bottleneck actually lives",
    description:
      "Every system is mainly either data-intensive or compute-intensive.\n\nBefore comparing the two, it helps to understand what a bottleneck is. A bottleneck is the slowest part of a system — the single point that limits overall performance. Think of a highway with 6 lanes that suddenly narrows to 1. No matter how fast cars move on the wide section, everyone slows down at the narrow point. In system design, the bottleneck is where your system gets stuck. Fixing anything else won't help until you fix that one part first.\n\nData-intensive systems spend most of their time storing, retrieving, and moving data. The CPU is usually not the bottleneck — it's idle most of the time, just waiting for data to arrive. Examples include Instagram feeds, WhatsApp messages, banking transactions, and analytics dashboards. Performance is improved through better database design, caching, replication, sharding, indexing, and optimized queries.\n\nCompute-intensive systems spend most of their time performing calculations. The database is usually not the bottleneck — data comes in fine, but the CPU or GPU is always busy crunching numbers. Examples include video rendering, image processing, machine learning training, flight simulators, and cryptography. Performance is improved by adding more CPU or GPU power, using parallel processing, and optimizing algorithms.\n\nA simple way to tell the difference: if the system is slow because it's waiting for data to be stored, fetched, or transferred, it's data-intensive. If the system is slow because it's busy performing calculations, it's compute-intensive.\n\nMany real-world applications contain both. YouTube is data-intensive when serving videos to users, but compute-intensive when generating video recommendations. Understanding which part of the system is the bottleneck helps you choose the right fix — and avoid wasting effort on the wrong layer.",
    whyItMatters:
      "Throwing GPU at a database bottleneck wastes money. Throwing more databases at a CPU bottleneck also wastes money. Identifying the bottleneck type first saves engineering time and cost by pointing you at the right layer to fix.",
    diagramNote:
      "Fig. 2.1 — Data-intensive systems bottleneck at the database; compute-intensive systems bottleneck at the CPU/GPU.",
    example:
      "Instagram is data-intensive: millions of images/videos moving from CDN to users. The bottleneck is data movement, so they use aggressive caching and distributed CDN — not more CPU. ML recommendation features on the same platform are compute-intensive — they run on GPU farms doing matrix math, not on extra databases.",
    interviewTip:
      "Before drawing any architecture, classify the feature: 'This is data-intensive so I'll focus on caching, CDN, and read replicas.' Or: 'This is compute-intensive so I'll design parallel GPU workers with a job queue.' Using this distinction immediately signals engineering maturity.",
    tags: ["Bottleneck", "Data Intensive", "Compute Intensive", "GPU", "Performance"],
  },

  // ─────────────────────────────────────────────
  // REQUIREMENTS
  // ─────────────────────────────────────────────
  {
    id: 3,
    section: "Requirements",
    title: "Functional Requirements",
    tagline: "What the system must do",
    description:
      "Functional requirements are simply the features a system must provide — in other words, what the user can actually do in the application.\n\nFor an e-commerce app, functional requirements include things like:\n\n• Signing up for a new account\n• Logging into the system\n• Viewing a list of products\n• Searching for specific products\n• Filtering products by category, price, or other attributes\n• Adding products to a shopping cart\n• Applying discount coupons\n• Placing an order\n• Processing payment\n• Tracking order status after purchase\n\nEach of these represents a clear user action or feature. If a feature doesn't describe what a user can do, it's not a functional requirement.\n\nIn system design, functional requirements are the starting point of everything. They help you define what you are building before thinking about how to build it. Once these are clear, you design the system components (like APIs, databases, services, and queues) to directly support these features.\n\nA good rule of thumb:\nIf a component or service doesn't support at least one functional requirement, it is likely unnecessary or over-engineered.\n\nIn short, functional requirements keep your system focused, simple, and directly tied to real user needs.",
    whyItMatters:
      "You can't design what you haven't defined. Functional requirements prevent scope creep, keep the interview structured, and ensure every architectural decision traces back to a real user need.",
    diagramNote:
      "Fig. 3.1 — Functional requirements mapped as a sequential user journey, from registration to order tracking.",
    example:
      "Amazon's functional requirements include product catalog browsing, search with filters, cart management, order placement, payment processing, and delivery tracking. Each maps to a dedicated microservice in their actual architecture.",
    interviewTip:
      "Spend the first 2–3 minutes clarifying functional requirements with the interviewer before drawing anything. Ask: 'Should I include user auth? Payment processing? Notifications?' This shows maturity, sets scope, and prevents designing the wrong system.",
    tags: ["Requirements", "Features", "Scope", "Use Cases", "API Design"],
  },
  {
    id: 4,
    section: "Requirements",
    title: "Non-Functional Requirements",
    tagline: "How the system must perform",
    description:
      "Non-functional requirements describe how well a system works, not what features it has.\n\nWhile functional requirements are about what the user can do, non-functional requirements are about how the system behaves when those features are used.\n\nHere are the main types explained simply:\n\n<b>Scalability</b>\nThe system should handle growth in users and traffic. For example, if traffic increases 10× during a sale, the system should still work smoothly. This is usually achieved using vertical scaling (bigger machines) or horizontal scaling (more machines).\n\n<b>Availability</b>\nThe system should stay up and running most of the time. For example, 99.9% uptime means very little downtime in a year. This is often defined using SLAs (Service Level Agreements) or SLOs (Service Level Objectives).\n\n<b>Reliability</b>\nThe system should not lose data and should behave correctly even when things fail. If a server crashes, the system should recover without breaking user data or transactions.\n\n<b>Performance</b>\nThe system should respond quickly. For example, a request should be processed in under 200ms (often measured using p99 latency, meaning 99% of requests are faster than this limit).\n\n<b>Security</b>\nThe system should protect user data and prevent unauthorized access. This includes login systems (authentication), permissions (authorization), and encryption for data both in storage and while being sent over the network.\n\n<b>Observability</b>\nThe system should be easy to monitor and debug. This means having logs, metrics, and tracing so engineers can understand issues without directly accessing production or guessing what went wrong.",
    note:
      "In system design, these are not extra features — they are engineering constraints. They shape how the system is built.\n\nIf you ignore them, the result is not just missing functionality — it can lead to serious problems like outages, slow systems, data loss, or security breaches.",
    whyItMatters:
      "A feature-complete app that crashes under load, leaks user data, or takes 10 seconds to respond fails in production. NFRs define the quality bar the system must meet — and they directly drive architectural decisions.",
    diagramNote:
      "Fig. 4.1 — Non-functional requirements define the quality constraints every architecture component must satisfy.",
    example:
      "Amazon's NFRs drive their entire architecture: < 200ms p99 latency → CDN + cache. 99.999% uptime → multi-region with automatic failover. 10× traffic on Black Friday → auto-scaling groups. Each NFR is a SLA commitment backed by engineering design.",
    interviewTip:
      "Before drawing any boxes, state your NFRs: 'I'll target 99.9% availability, p99 latency under 500ms, and the system should handle 1M daily active users with peaks of 10× that.' Then justify every component in terms of these. Interviewers score heavily on this.",
    tags: ["SLA", "SLO", "Availability", "Scalability", "Performance", "Security", "Reliability"],
  },

  // ─────────────────────────────────────────────
  // COMMUNICATION
  // ─────────────────────────────────────────────
  {
    id: 5,
    section: "Communication",
    title: "DNS",
    tagline: "Translates domain names to IP addresses",
    description:
      "Computers don't understand website names like \"telesco.com\". They only understand IP addresses like 192.168.1.1.\n\nSo we use DNS (Domain Name System) to translate human-friendly names into IP addresses.\n\n<b>How DNS lookup works (step by step)</b>\n\nWhen you type a website in your browser, DNS follows a chain:\n\n<b>Root Server</b>\nThis is the starting point. There are 13 root server groups (A–M), managed by different organizations. They don't know the exact IP of the website. They only know where to find the next level (like which server handles .com, .net, .org, etc.).\n\n<b>TLD Server (Top-Level Domain Server)</b>\nThis handles domains like .com, .net, .in, etc. It doesn't know the final IP either. It points you to the authoritative name server for the domain.\n\n<b>Authoritative Name Server</b>\nThis is the final source of truth for a domain. It is managed by the domain provider (like GoDaddy or Google Domains). It stores the actual mapping: telesco.com → 192.168.1.1. It returns the real IP address.\n\n<b>What happens after the first lookup (caching)</b>\n\nTo make things faster, DNS results are saved (cached):\n\n• Browser cache (Chrome, Firefox, etc.)\n• Operating System cache\n• DNS resolver cache (usually your ISP or public DNS like Google DNS)\n\nSo next time you visit the site, it often skips the full lookup process.\n\n<b>TTL (Time To Live)</b>\n\nEach DNS record has a TTL value, which tells how long it can be cached before it must be refreshed. Short TTL = more frequent updates, long TTL = faster repeat visits.\n\n<b>Subdomains</b>\n\nSubdomains like docs.telesco.com and api.telesco.com are handled by the same system. The authoritative server uses a DNS zone, which contains records for the main domain and all its subdomains.",
    note:
      "DNS is like a multi-step phonebook system for the internet:\n\n• Root → finds direction\n• TLD → narrows it down\n• Authoritative server → gives exact IP\n• Cache → makes everything faster\n\nWithout DNS, we'd have to remember IP addresses instead of simple website names.",
    whyItMatters:
      "Every web request starts with a DNS lookup. Understanding DNS explains geo-routing (send Indian users to Indian servers via DNS), CDN edge selection, failover, and why domain changes can take hours to propagate (TTL).",
    diagramNote:
      "Fig. 5.1 — A DNS lookup walks four servers in sequence; subsequent lookups short-circuit via cache at each layer.",
    example:
      "When you type google.com, your browser checks its own cache first. On miss, asks the OS. On miss, asks your ISP's DNS resolver. On miss, the resolver walks the full tree: root → .com TLD → google's authoritative NS → gets 216.58.x.x. This entire process completes in ~50ms and is then cached.",
    interviewTip:
      "Mention DNS when discussing global distribution: 'I'd configure DNS geo-routing so users in India resolve to the Mumbai server IP, users in the US resolve to the Virginia server IP — cutting latency by reducing physical distance.'",
    tags: ["DNS", "Domain", "IP Address", "TTL", "Root Server", "TLD", "Authoritative NS"],
  },
  {
    id: 6,
    section: "Communication",
    title: "API Types",
    tagline: "Different protocols for different communication needs",
    description:
      "There are five common types of APIs, and each one is used for different kinds of communication between systems.\n\n<b>1. REST (Most commonly used)</b>\nUses normal HTTP methods like GET, POST, PUT, DELETE. Data is usually sent in JSON format. Works in a stateless way — each request is independent. Easy to understand and works with almost any client (web, mobile, etc.).\n\nUsed for most public APIs like e-commerce, social media, etc.\n\n<b>2. SOAP (Older enterprise standard)</b>\nUses XML, which is more heavy and verbose than JSON. Very strict rules and structure. Common in banks, insurance, and government systems. Still used in legacy systems, but less common in modern apps.\n\n<b>3. GraphQL</b>\nHas a single endpoint instead of multiple ones. The client asks for exactly what it needs — no more, no less. Prevents over-fetching (getting unnecessary data). Great for apps where bandwidth matters, like mobile apps.\n\nExample: instead of getting 50 fields, you can request only 3.\n\n<b>4. gRPC</b>\nCreated by Google for fast internal communication. Uses Protocol Buffers (binary format) instead of JSON. Much smaller and faster than REST (3–10× more efficient). Best used for communication between microservices.\n\n<b>5. WebSockets</b>\nCreates a persistent connection between client and server. Allows real-time two-way communication. Server can push updates instantly without the client asking again.\n\nUsed for: Chat apps, Live notifications, Stock prices or sports scores, Collaborative tools.",
    note:
      "Simple rule of thumb:\n\n• REST → Public APIs (most common)\n• gRPC → Internal microservices (fast communication)\n• WebSockets → Real-time features\n• GraphQL → Flexible frontend data fetching (especially mobile)\n• SOAP → Legacy enterprise systems\n\nIn short, each API type is just a different way for systems to talk, optimized for different needs like speed, flexibility, or structure.",
    whyItMatters:
      "Choosing the wrong API type adds unnecessary latency or complexity. gRPC is 3–10× faster than REST for internal calls. WebSockets eliminate wasteful polling for real-time features. Knowing when to use each separates junior from senior engineers.",
    diagramNote:
      "Fig. 6.1 — Five API protocols compared by communication style, payload format, and primary use case.",
    example:
      "Uber: REST for the public mobile app API. gRPC between internal microservices (driver matching, surge pricing engine). WebSockets to push live driver location to the rider's app every second without the app asking repeatedly.",
    interviewTip:
      "Default to REST for client-server. Say: 'For internal microservice calls I'd use gRPC for lower latency and smaller payloads.' Only propose WebSockets when the feature genuinely requires real-time push from server to client (chat, notifications, live collaboration).",
    tags: ["REST", "gRPC", "GraphQL", "SOAP", "WebSockets", "Protobuf", "HTTP"],
  },
  {
    id: 7,
    section: "Communication",
    title: "REST APIs in Depth",
    tagline: "Methods, status codes, and design best practices",
    description:
      "<b>HTTP Methods (What action you are doing)</b>\n\n<b>GET</b> → Read data\nExample: Get user details. Safe and does not change data.\n\n<b>POST</b> → Create new data\nExample: Create a new user or order. Not idempotent — calling twice may create duplicates.\n\n<b>PUT</b> → Replace the entire resource\nExample: Update a user profile fully. If you send only partial data, missing fields may become null.\n\n<b>PATCH</b> → Update part of a resource\nExample: Update only the user's email. Safer for partial updates.\n\n<b>DELETE</b> → Remove data\nExample: Delete a user or post.\n\n<b>Ways to send data in APIs</b>\n\n<b>Path parameters</b> → Identify a specific resource\nExample: /users/123 → user with ID 123\n\n<b>Query parameters</b> → Filter, sort, or paginate data\nExample: /users?sort=asc&q=java → sort users and search for \"java\"\n\n<b>Request body</b> → Send actual data\nUsed for: creating user details, updating profile info, passwords (sensitive data), complex structured data.\n\n<b>HTTP Status Codes (Server response meaning)</b>\n\n200 OK → Request successful\n201 Created → New resource created\n204 No Content → Success but no response body (common for DELETE)\n301 Permanent Redirect → URL has permanently changed\n302 Temporary Redirect → Temporary redirect to another URL\n400 Bad Request → Client sent invalid data\n401 Unauthorized → User not logged in\n403 Forbidden → User logged in but not allowed\n404 Not Found → Resource does not exist\n500 Internal Server Error → Server crashed or unexpected error\n\n<b>API Response Best Practice</b>\n\nAlways return responses inside an object, not a raw array.\n\nBad: `[1, 2, 3]`\n\nGood: `{ \"data\": [1, 2, 3], \"count\": 3 }`\n\nThis way you can later add pagination info, metadata, or error messages without breaking existing clients.\n\n<b>Resource Design Best Practices</b>\n\nNested resources show relationships — `/blogs/1/comments` → comments of blog 1\n\nQuery params for complex filtering — `/products?category=shoes&price_lt=100`",
    note:
      "HTTP methods define what action you perform. Params define how you send data. Status codes tell the client what happened.\n\nIn short: good API design is about making communication between systems clear, predictable, and scalable.",
    whyItMatters:
      "REST is the dominant API style you'll build and consume throughout your career. Getting methods, status codes, and response format right from the start prevents breaking changes and client bugs at scale.",
    diagramNote:
      "Fig. 7.1 — REST API design: standard HTTP methods mapped to resource URLs and their expected behavior.",
    example:
      "GitHub API: GET /repos/{owner}/{repo} returns repo data (200). POST /repos/{owner}/{repo}/issues creates issue (201). PATCH /repos/{owner}/{repo} updates repo settings (200). All responses are objects with nested fields — never bare arrays. Invalid auth returns 401, missing repo returns 404.",
    interviewTip:
      "Use plural nouns for resources (/users, /orders). Nest related resources (/orders/1/items) for clear relationships. Query params for filtering (/products?color=blue&max_price=100). Always wrap responses in objects. Return 404 for missing resources, 400 for bad input, 401 for missing auth, 403 for insufficient permissions, 500 for server bugs.",
    tags: ["HTTP Methods", "Status Codes", "REST", "JSON", "Path Params", "Query Params", "API Design"],
  },

  // ─────────────────────────────────────────────
  // DATA LAYER
  // ─────────────────────────────────────────────
  {
    id: 8,
    section: "Data Layer",
    title: "SQL Databases",
    tagline: "Structured data with enforced relationships",
    description:
      "SQL databases store data in tables, similar to spreadsheets.\n\n• Rows = individual records (like one user, one order)\n• Columns = fields or properties (like name, email, price)\n\nA `users` table might store: `id`, `name`, `email` — each row is one user.\n\n<b>Tables represent real-world things</b>\n\nIn SQL, you usually create one table per entity:\n\n• `users` → user data\n• `posts` → blog posts\n• `orders` → purchases\n\n<b>Constraints (rules that protect data quality)</b>\n\n<b>PRIMARY KEY</b> → Uniquely identifies each row\nExample: `user_id`\n\n<b>UNIQUE</b> → No duplicate values allowed\nExample: usernames must be different\n\n<b>NOT NULL</b> → Field cannot be empty\nExample: `first_name` must exist\n\n<b>FOREIGN KEY</b> → Connects two tables together\nExample: `posts.author_id` → `users.id`\n\n<b>CHECK</b> → Adds validation rules\nExample: `balance >= 0`, `password_length > 8`\n\n<b>DEFAULT</b> → Gives a value if none is provided\nExample: `role = 'student'`\n\n<b>Types of relationships between tables</b>\n\n<b>1. One-to-Many</b>\nOne record in a table relates to many in another.\nExample: One user → many posts. Each post has an `author_id`.\n\n<b>2. Many-to-Many</b>\nBoth sides can relate to many records.\nExample: Students ↔ Courses. Requires a junction table `students_courses` with `student_id` and `course_id`.\n\n<b>3. One-to-One</b>\nOne record maps to exactly one other record.\nExample: `content` → `video_details`. Often stored in separate tables but linked by the same ID.\n\n<b>When to use SQL databases</b>\n\n• Data has clear structure and relationships\n• You need strong consistency and safety (ACID transactions) — e.g., payments, banking, bookings\n• The schema is stable and predictable",
    note:
      "SQL databases are best for structured, reliable, relationship-heavy data. They work by storing data in tables, enforcing rules using constraints, connecting data using relationships, and ensuring data consistency through transactions.\n\nSQL = structured + reliable + strongly consistent data storage system.",
    whyItMatters:
      "Most business data has natural relationships. SQL enforces those at the database level — preventing orphaned records, duplicate usernames, and corrupted data. ACID guarantees mean money never disappears mid-transaction.",
    diagramNote:
      "Fig. 8.1 — Relational data modeling: one-to-many (FK column) and many-to-many (junction table) patterns.",
    example:
      "A bank uses PostgreSQL: accounts table has PRIMARY KEY on account_id, NOT NULL and CHECK (balance >= 0) on balance. transactions table has two FOREIGN KEYs referencing accounts. ACID ensures that a transfer debits one account and credits another atomically — either both happen or neither does.",
    interviewTip:
      "Choose SQL when: the schema is fixed, data has relationships, consistency is critical (payments, inventory), or you need complex queries with joins. Explain which constraints you'd use and why — this signals you think about data integrity, not just features.",
    tags: ["SQL", "PostgreSQL", "MySQL", "ACID", "Foreign Key", "Joins", "Constraints"],
  },
  {
    id: 9,
    section: "Data Layer",
    title: "NoSQL Databases",
    tagline: "Flexible storage for unstructured or massive data",
    description:
      "NoSQL is not one single type of database. It's a group of different database models designed for flexibility, speed, and large-scale systems.\n\nUnlike SQL (tables and fixed schema), NoSQL systems are more flexible and scale horizontally very well.\n\nThere are 4 main types:\n\n<b>1. Key–Value Stores</b>\nExamples: Redis, DynamoDB\n\nData is stored as `key → value`. Very simple and extremely fast.\n\nUse cases:\n• Caching\n• User sessions (logged-in users)\n• Real-time counters (likes, views)\n\nThink of it like a dictionary or map.\n\n<b>2. Column-Family / Columnar Databases</b>\nExamples: Cassandra, BigQuery, Redshift\n\nData is stored by columns instead of rows. Optimized for reading large amounts of data from specific columns.\n\nUse cases:\n• Analytics\n• Reporting systems\n• Big data queries\n\nNot good for frequent row-by-row updates. Example: \"Give me total sales for last 2 years\" across millions of records.\n\n<b>3. Graph Databases</b>\nExample: Neo4j\n\nData is stored as nodes (entities like users, posts) and edges (relationships between them). Both nodes and relationships can have properties.\n\nUse cases:\n• Social networks (friends, followers)\n• Fraud detection\n• Recommendation systems (\"people also liked…\")\n\nBest when relationships matter more than raw data.\n\n<b>4. Document Databases</b>\nExamples: MongoDB, CouchDB\n\nData is stored as JSON-like documents. Each document can have a different structure (flexible schema).\n\nUse cases:\n• User profiles\n• Content management systems\n• Logging systems\n\nExample: one user might have extra fields like hobbies, another might not.\n\n<b>When to use NoSQL</b>\n\n• Data is unstructured or changing often\n• You need high scalability (horizontal scaling)\n• You don't need complex joins\n• You care more about speed and availability than strict consistency\n\n<b>Real-world usage</b>\n\n• Netflix → Cassandra for large-scale activity data\n• Amazon → DynamoDB for scalable key-value storage\n• Twitter → Redis for caching and fast timeline delivery",
    note:
      "NoSQL is a collection of databases designed for different needs:\n\n• Key–Value → fast lookups and caching\n• Columnar → big analytics and reporting\n• Graph → relationship-heavy data\n• Document → flexible JSON data\n\nIn short: NoSQL trades strict structure for speed and scalability at massive scale.",
    whyItMatters:
      "SQL schema rigidity becomes a bottleneck at scale — adding a column to a 500M-row table takes hours. NoSQL's flexibility and horizontal scalability are why every major tech company uses it for at least one service.",
    diagramNote:
      "Fig. 9.1 — The four NoSQL data models, each optimized for a different access pattern.",
    example:
      "Instagram stores user account data in PostgreSQL (relational, consistent), activity feed in Cassandra (high write throughput, horizontally scalable), and hot timeline data in Redis (key-value, microsecond reads). Three different NoSQL types for three different access patterns.",
    interviewTip:
      "Don't default to MongoDB for everything. Ask: 'What's the access pattern?' Sessions/cache → key-value (Redis). Analytics on huge data → columnar (Cassandra/BigQuery). Social graph/recommendations → graph DB. Flexible content/profiles/logs → document (MongoDB). Match the model to the access pattern.",
    tags: ["NoSQL", "MongoDB", "Redis", "Cassandra", "DynamoDB", "Key-Value", "Graph DB", "Columnar"],
  },
  {
    id: 10,
    section: "Data Layer",
    title: "Caching",
    tagline: "Store hot data in fast memory to avoid database hits",
    description:
      "A cache is a fast temporary memory layer that stores frequently used data so you don't have to repeatedly fetch it from a slow database.\n\nThink of it like a \"shortcut memory\" for your system.\n\n<b>Why caching is used</b>\n\nDatabases are relatively slow compared to memory. So instead of hitting the database every time, we store popular data in cache and serve it directly from there. This makes the system much faster.\n\n<b>Cache hit vs Cache miss</b>\n\n<b>Cache hit</b>\nData is found in cache. Response is extremely fast (milliseconds or less).\nExample: User requests profile → data already in cache → return immediately.\n\n<b>Cache miss</b>\nData is NOT in cache. System goes to the database (slower), then stores the result in cache for future use.\nExample: First time fetching a product → DB lookup → store in cache.\n\n<b>TTL (Time To Live)</b>\n\nEvery cached item has an expiry time. After TTL expires, the data is automatically removed.\n\nWhy? Because data can become outdated.\nExample: Product price cached for 10 minutes → after 10 minutes, refresh from database.\n\n<b>Cache size rule</b>\n\nCache is kept small on purpose. A large cache becomes slow to search and defeats the purpose of being fast. So we only store hot data — frequently accessed data.\n\n<b>Types of caching layers</b>\n\n<b>1. Browser cache</b>\nStores static files (images, CSS, JS). Makes websites load faster on repeat visits.\n\n<b>2. DNS cache</b>\nStores domain → IP mappings. Avoids repeated DNS lookups.\n\n<b>3. Server-side cache (most important)</b>\nExamples: Redis, Memcached. Stores application data, fully controlled by backend engineers. Major performance booster.\n\n<b>4. Database cache / query cache</b>\nStores results of expensive queries. Reduces load on database.\n\n<b>Simple flow</b>\n\n1. Request comes in\n2. Check cache first\n3. If found → return instantly\n4. If not → go to DB\n5. Save result in cache\n6. Return response\n\n<b>Key idea</b>\n\nCaching works because most systems follow the 80/20 rule — 20% of data is accessed 80% of the time. So we cache only the frequently used data.",
    note:
      "A cache stores hot data to reduce database load and improve response time dramatically.\n\nCache hit = instant response from memory\nCache miss = fetch from DB, then store in cache\nTTL = controls how long cached data stays fresh",
    whyItMatters:
      "A DB query taking 100ms costs 100ms every time without cache. The same query served from Redis takes < 1ms. Caching is typically the first optimization that multiplies system capacity by 10–100× with minimal infrastructure change.",
    diagramNote:
      "Fig. 10.1 — Cache hit vs. miss paths: a hit returns instantly from memory; a miss fetches from the DB and populates the cache.",
    example:
      "telesco.com homepage shows 6 featured courses, each requiring 4 database table joins. Without cache: 24 DB queries per page load × 10,000 daily users = 240,000 DB queries. With Redis cache + 10-min TTL: 24 queries total per cache window, regardless of user count.",
    interviewTip:
      "Always discuss cache invalidation — the hard part. Options: TTL (simplest, tolerates brief staleness), event-driven invalidation (update cache when DB changes), versioned keys (cache key includes a version number). Also mention cold start: what happens when the cache is empty right after a deploy?",
    tags: ["Redis", "Memcached", "Cache Hit", "Cache Miss", "TTL", "Latency", "Server-Side Cache"],
  },
  {
    id: 11,
    section: "Data Layer",
    title: "Cache Read/Write Strategies",
    tagline: "When to read from and write to cache",
    description:
      "When you add a cache to your system, you need a strategy for how data flows between the cache and the database. There are four main approaches.\n\n<b>Read Through Cache (RTC)</b>\n\nEvery read goes to the cache first. If the data is missing (cache miss), the cache itself fetches it from the database, stores it, and returns it.\n\n• Writes go directly to the database, bypassing cache\n• Cache fills gradually as data is requested\n• Simple to use — the app always talks to the cache, never directly to the DB\n\nGood for: read-heavy systems where most data is eventually needed.\n\n<b>Write Through Cache (WTC)</b>\n\nEvery write goes to the cache first, then immediately to the database — both happen before the response is sent.\n\n• Cache is always up to date\n• Slightly slower writes (must wait for both cache and DB to confirm)\n• No stale data risk\n\nGood for: systems where reading fresh data right after a write is critical, like stock prices or live inventory.\n\n<b>Write Around Cache (WAC)</b>\n\nWrites go directly to the database, skipping the cache entirely. Data only enters the cache when it is read.\n\n• Cache won't hold data that was just written but never read\n• Avoids filling the cache with data that may never be needed again\n\nGood for: data that is written once and read rarely, like audit logs or archival records.\n\n<b>Write Back Cache (WBC)</b>\n\nWrites go to the cache only. The database is updated asynchronously in the background, after the response has already been sent.\n\n• Fastest write path — the user gets a response instantly\n• Risk of data loss if the cache crashes before the async DB write completes\n\nGood for: high-write systems where speed matters more than strict consistency, like real-time order status updates or live game scores.",
    note:
      "The right strategy depends on your access pattern:\n\n• Read-heavy → Read Through\n• Need fresh reads after writes → Write Through\n• Rare reads of written data → Write Around\n• Very high write volume, can tolerate some data loss → Write Back",
    whyItMatters:
      "The wrong strategy either makes your cache stale (users see old data) or makes writes a bottleneck (defeats the performance purpose). Matching strategy to access pattern is key.",
    diagramNote:
      "Fig. 11.1 — Four caching strategies: read-through, write-through, write-around, and write-behind differ in when the DB is updated.",
    example:
      "Swiggy order status changes rapidly (confirmed → packed → picked up → out for delivery → delivered). They use WBC — write status to cache instantly (user sees fast updates), flush to database asynchronously. Speed matters more than strict consistency here. If cache crashes, the last N status updates might be lost, but the order itself is safe in DB.",
    interviewTip:
      "Match strategy to access pattern: read-heavy with occasional writes → RTC. Writes that must be immediately readable → WTC. Write-then-read-later data → WAC. Very high write throughput with acceptable loss risk → WBC. In an interview, state which you chose and why — don't just say 'I'd use caching'.",
    tags: ["RTC", "WTC", "WAC", "WBC", "Read Through", "Write Through", "Write Back", "Cache Strategy"],
  },
  {
    id: 12,
    section: "Data Layer",
    title: "Cache Eviction Policies",
    tagline: "Which data gets removed when cache is full",
    description:
      "A cache has limited memory. When it fills up, something has to be removed to make room for new data. An eviction policy decides which item gets removed.\n\n<b>LRU — Least Recently Used</b>\n\nRemoves the item that has not been accessed for the longest time.\n\n• If you searched \"iPhone 17\" today but last searched \"iPhone 11\" three weeks ago, the iPhone 11 entry gets evicted first\n• Most commonly used default — works well for most applications\n\n<b>MRU — Most Recently Used</b>\n\nRemoves the most recently accessed item — the opposite of LRU.\n\n• Sounds counter-intuitive, but makes sense for video streaming\n• The segment you just watched won't be needed again, so evict it first to free space for upcoming segments\n\n<b>LFU — Least Frequently Used</b>\n\nRemoves the item that has been accessed the fewest total times across its entire history.\n\n• A product you searched once on a whim gets evicted before a product searched every day\n• Good for capturing long-term popularity rather than recency\n\n<b>FIFO — First In, First Out</b>\n\nRemoves the oldest item added to the cache, regardless of how often it has been accessed.\n\n• Simple and predictable — no extra tracking needed\n• Does not consider whether the data is still being used\n\n<b>LIFO — Last In, First Out</b>\n\nRemoves the most recently added item.\n\n• Useful when older data is more stable and valuable than newly added data\n• Example: historical reference tables or configuration data that rarely changes",
    note:
      "LRU is the safe default for most caches. Use MRU for media buffers where recently played content won't be replayed. Use LFU when long-term popularity matters more than recency, like a product recommendation cache.",
    whyItMatters:
      "The wrong eviction policy keeps cold data and evicts hot data — a cache full of stale entries is worse than no cache. LRU is the safe default but each policy fits specific patterns.",
    diagramNote:
      "Fig. 12.1 — Five cache eviction policies: each defines a different rule for which entry to remove when the cache is full.",
    example:
      "Redis defaults to LRU. A social feed cache fits LRU perfectly — yesterday's viral post gradually cools and gets evicted. A video streaming buffer fits MRU — segments you've already played won't be replayed. An e-commerce product cache fits LFU — products viewed once during a random browse are less valuable than daily bestsellers.",
    interviewTip:
      "Default to LRU for general-purpose caches. Call out MRU specifically for media streaming buffers (segments already played). Mention LFU when long-term access frequency matters more than recency (recommendation engines, product catalogs). Interviewers appreciate knowing why, not just which.",
    tags: ["LRU", "MRU", "LFU", "FIFO", "LIFO", "Eviction Policy", "Cache"],
  },

  // ─────────────────────────────────────────────
  // SCALING & DISTRIBUTION
  // ─────────────────────────────────────────────
  {
    id: 13,
    section: "Scaling & Distribution",
    title: "Load Balancer",
    tagline: "Routes traffic across servers and monitors health",
    description:
      "A load balancer sits in front of your servers and does two jobs: distribute incoming requests evenly and monitor which servers are healthy.\n\n<b>Layer 4 vs Layer 7</b>\n\n<b>Layer 4 (L4) — Transport Layer</b>\nRoutes traffic based on IP address and port number. It doesn't look at the content of the request at all. Very fast and simple.\n\n• Example: AWS NLB (Network Load Balancer)\n• Use when raw speed is the priority, like game servers or real-time streaming\n\n<b>Layer 7 (L7) — Application Layer</b>\nRoutes based on HTTP headers, URL paths, and cookies. Smarter routing decisions.\n\n• Example: AWS ALB (Application Load Balancer)\n• Can route `/api/*` to your app servers and `/images/*` to a CDN\n• Use when you need content-aware routing\n\n<b>Routing Algorithms</b>\n\n• `Round Robin` — send requests to servers in order, one by one\n• `Least Connections` — send to the server with the fewest active requests\n• `Least Time` — send to the server that responds fastest\n• `IP Hash` — same client always goes to the same server (useful for sessions)\n• `Weighted Round Robin` — more powerful servers receive more traffic\n• `Geo-Based` — route users to the server closest to their location\n\n<b>Health Checks</b>\n\nLoad balancers need to know which servers are alive:\n\n• `Passive` — observe real traffic; if a server returns too many errors, mark it unhealthy\n• `Active` — send synthetic test requests on a schedule; remove the server if it doesn't respond\n\n<b>The SPOF Problem</b>\n\nThe load balancer itself can become a single point of failure. If it goes down, all traffic stops.\n\n• `Active-Passive` — two load balancers share a virtual IP (VIP). The active one handles all traffic. The passive one watches via heartbeat. If the active one fails, the passive takes over the VIP in seconds.\n• `Active-Active` — both handle traffic simultaneously. Higher throughput, but more complex to set up.",
    note:
      "The load balancer solves two problems: distributing load across servers and detecting failures automatically. Without it, adding more servers does nothing — clients only know one address.\n\nAlways make the load balancer itself redundant with an Active-Passive setup to avoid a single point of failure.",
    whyItMatters:
      "Without a load balancer, adding servers does nothing — clients only know one IP. L7 enables intelligent routing; L4 gives raw speed. The SPOF question is one of the most common load balancer follow-ups in interviews.",
    diagramNote:
      "Fig. 13.1 — Active/passive load balancer failover with VIP handoff; L4 routes by IP/port, L7 routes by request content.",
    example:
      "AWS ALB (L7) routes /api/* to ECS containers and /images/* to S3. AWS NLB (L4) handles raw TCP for game servers needing microsecond latency. Both are deployed across two AZs in active-active mode — if one AZ fails, the other takes all traffic with no manual intervention.",
    interviewTip:
      "Always distinguish L4 vs L7 when asked about load balancers. Say: 'I'd use an L7 load balancer here because I need to route by URL path.' For the SPOF question: 'The load balancer itself would be a SPOF — I'd fix this with an active-passive pair sharing a virtual IP, with automatic failover via heartbeat.' This answer specifically is asked in the Session 1 review of many courses.",
    tags: ["Round Robin", "Least Connections", "L4", "L7", "Health Check", "SPOF", "Active-Passive", "ALB", "NLB"],
  },
  {
    id: 14,
    section: "Scaling & Distribution",
    title: "Horizontal & Vertical Scaling",
    tagline: "Two ways to add capacity to your system",
    description:
      "When your system gets more traffic than a single server can handle, you have two options for adding capacity.\n\n<b>Vertical Scaling — Scale Up</b>\n\nUpgrade the existing machine with more CPU, more RAM, or faster disk.\n\n• No code changes needed — the simplest option\n• Has a hard ceiling — you can only fit so much RAM in one machine\n• Still a single point of failure — if that one machine goes down, everything goes down\n• Good for: databases that are hard to distribute, simple applications with moderate traffic\n\nUsing the bank analogy: vertical scaling is giving your one cashier a faster computer and a cash-counting machine.\n\n<b>Horizontal Scaling — Scale Out</b>\n\nAdd more machines and distribute traffic across all of them.\n\n• Near-unlimited capacity — just keep adding commodity servers\n• No single point of failure — if one server crashes, others keep running\n• Requires a load balancer to distribute requests\n• Requires stateless services — user sessions must be stored in a shared store like Redis, not in server memory\n\nUsing the bank analogy: horizontal scaling is opening more cashier counters.\n\n<b>Key Prerequisite: Stateless Services</b>\n\nFor horizontal scaling to work, your servers must be stateless. This means:\n\n• User session data goes in Redis, not in the server's RAM\n• Any server can handle any request — they are interchangeable\n• If a server restarts, no user data is lost\n\n<b>Which to choose?</b>\n\n• Start with vertical scaling — it's simpler and requires no architecture changes\n• Move to horizontal scaling when you hit the hardware ceiling or need fault tolerance\n• Most production systems at scale use horizontal scaling as the primary strategy",
    note:
      "Vertical scaling is fast to set up but has limits. Horizontal scaling is the foundation of internet-scale systems but requires stateless architecture.\n\nThe rule of thumb: scale up first, scale out when needed.",
    whyItMatters:
      "Vertical scaling has hard limits and creates a single point of failure. Horizontal scaling is the foundation of every internet-scale system. But it requires stateless service design from the start.",
    diagramNote:
      "Fig. 14.1 — Vertical scaling grows one machine until it hits a hardware ceiling; horizontal scaling adds stateless machines behind a load balancer.",
    example:
      "Netflix autoscales from 1,000 to 10,000 EC2 instances during peak hours. Each instance is stateless — user session and preferences are stored in ElastiCache (Redis), not in the server's memory. Any instance can handle any user.",
    interviewTip:
      "Design stateless services from day one — it's the prerequisite for horizontal scaling. Store session, cart, and user state in Redis or a database, never in server memory. When discussing scaling, say: 'I'd first exhaust vertical scaling, then move to horizontal once the single-server limit is hit, requiring a load balancer and stateless architecture.'",
    tags: ["Vertical Scaling", "Horizontal Scaling", "Stateless", "Auto Scaling", "Load Balancer", "Elasticity"],
  },
  {
    id: 15,
    section: "Scaling & Distribution",
    title: "Replication",
    tagline: "Copy data across nodes for reliability and read scale",
    description:
      "Replication means keeping copies of the same data on multiple servers. If one server goes down, others still have the data. It also lets you spread read traffic across multiple servers instead of hammering one.\n\nThere are three main models of replication:\n\n<b>1. Single Leader (Most common)</b>\n\nOne server is the leader (also called primary or master). All writes go to the leader only. The leader then copies those writes to follower servers (also called replicas or standbys).\n\n• `Async replication` — the leader responds to the client immediately and updates followers in the background. Faster, but followers may briefly be slightly behind.\n• `Sync replication` — the leader waits for all followers to confirm before responding. Data is always consistent, but writes are slower.\n• Most systems choose async replication — the small lag is acceptable in exchange for better write performance.\n\nWhat happens if the leader crashes? A follower with the most recent data is promoted to become the new leader. This is called failover.\n\n<b>2. Multi-Leader</b>\n\nMultiple servers can accept writes at the same time. Each one replicates changes to the others.\n\n• Useful for multi-region setups — each region has a leader for low latency writes\n• The challenge: if two leaders accept different writes for the same data at the same time, you get a conflict\n• Conflict resolution strategies: last write wins (by timestamp), higher-ranked server wins, or prompt the user (like a Git merge conflict)\n\n<b>3. Leaderless (Dynamo-style)</b>\n\nAny server can accept writes. There is no single leader.\n\n• Writes go to multiple nodes simultaneously\n• A write is only considered successful when a majority (quorum) of nodes confirm it\n• Quorum rule: if there are N nodes, require W nodes to confirm a write and R nodes to confirm a read, where W + R > N\n• This overlap guarantees at least one node has the latest data on every read\n\nUsed by: Cassandra, DynamoDB",
    note:
      "Replication protects your data and spreads read traffic. Single-leader async replication is the most common choice — it balances performance and reliability.\n\nAsync = faster writes, possible brief stale reads\nSync = always consistent, slower writes\nLeaderless = no single point of failure, uses quorum for consistency",
    whyItMatters:
      "A single database node is a single point of failure and a read bottleneck. Replication is the foundation of high availability (failover if primary dies) and read scaling (route reads to replicas).",
    diagramNote:
      "Fig. 15.1 — Three replication models: single-leader (one writer), multi-leader (multiple writers), and leaderless (quorum-based writes).",
    example:
      "PostgreSQL streaming replication: primary streams WAL (write-ahead log) to standbys. Instagram routes all SELECT queries to read replicas and writes to the primary — 3 replicas = 4× total read throughput. If primary dies, promotion of a replica takes < 30 seconds.",
    interviewTip:
      "State your replication model and why. Async = lower write latency but stale reads possible (fine for social feeds). Sync = strong consistency but higher latency (needed for banking). For leaderless systems (Cassandra), explain the quorum formula: write to W nodes, read from R nodes, W + R > N ensures overlap.",
    tags: ["Single Leader", "Multi-Leader", "Leaderless", "Quorum", "Async", "Sync", "Failover", "WAL"],
  },
  {
    id: 16,
    section: "Scaling & Distribution",
    title: "Partitioning / Sharding",
    tagline: "Split large data across multiple nodes",
    description:
      "When a single database gets too large to fit on one machine, or receives more writes than one server can handle, you split the data across multiple servers. Each server holds a piece (called a shard or partition). Together, all shards hold the complete dataset.\n\nThe most important goal of sharding: distribute data evenly so no single shard becomes a bottleneck.\n\n<b>Two main partitioning methods</b>\n\n<b>Key-Range Partitioning</b>\nAssign ranges of data to each shard.\n\n• Example: users 1–50,000 → shard 1, users 50,001–100,000 → shard 2\n• Simple and easy to understand\n• Risk: hotspots — if most traffic comes from one range, that shard gets overloaded while others are idle\n\n<b>Hash Partitioning</b>\nUse a hash function to assign data to shards: `shard = hash(id) % N`\n\n• Distributes data more evenly — no predictable range to get overloaded\n• Downside: if you add a new shard (change N), most keys remap to different shards, requiring data migration\n• Consistent hashing solves this migration problem (see concept 49)\n\n<b>Secondary Indexes on Sharded Data</b>\n\nQuerying sharded data by something other than the shard key is tricky.\n\n<b>Local Secondary Index</b>\nEach shard maintains its own index covering only its data.\n\n• Fast writes — each shard updates only its own index\n• Queries spanning multiple shards require a scatter-gather — send the query to all shards and merge results. Slower.\n\n<b>Global Secondary Index</b>\nOne dedicated partition holds an index covering data across all shards.\n\n• Fast reads — one lookup finds which shard has the data\n• Slower writes — every write must update the global index partition too\n\n<b>Hotspots</b>\n\nA hotspot is when one shard receives far more traffic than others.\n\n• Example: sharding by country puts most traffic on the US shard while the Maldives shard sits mostly idle\n• Solution: choose shard keys that distribute writes evenly — user ID hash is usually a safe choice",
    note:
      "Sharding lets your database scale beyond a single machine by splitting data across multiple servers. Choose your shard key carefully — a bad key creates hotspots and defeats the purpose.\n\nHash partitioning gives the most even distribution. Key-range partitioning is simpler but prone to hotspots.",
    whyItMatters:
      "When data grows beyond a single machine, you must partition. Sharding is how every database at scale works — Cassandra, DynamoDB, Instagram, YouTube all use it.",
    diagramNote:
      "Fig. 16.1 — Database sharding splits data by shard key; a hotspot forms when one partition receives disproportionate traffic.",
    example:
      "Cassandra uses consistent hashing — each node owns a range on a hash ring. Adding a new node takes half the range from one existing node, moving only ~1/N of data. Instagram shards users by user_id hash across 50 shards — any user's data lives entirely on one shard for fast lookups.",
    interviewTip:
      "Choose shard keys that distribute writes evenly and avoid cross-shard joins. user_id is usually safe. timestamp is usually a hotspot (all recent writes hit the latest time bucket). State: 'I'd shard by user_id hash because it distributes writes evenly and most queries are per-user — no cross-shard joins needed.'",
    tags: ["Sharding", "Partitioning", "Consistent Hashing", "Hotspot", "Shard Key", "Global Index", "Local Index"],
  },
  {
    id: 17,
    section: "Scaling & Distribution",
    title: "CAP Theorem",
    tagline: "In distributed systems, choose two of three guarantees",
    description:
      "The CAP Theorem states that a distributed database can only guarantee two out of three properties at the same time.\n\n<b>The three properties</b>\n\n<b>C — Consistency</b>\nEvery read returns the most recent write. No node ever returns stale data.\n\n<b>A — Availability</b>\nEvery request gets a response, even if the data might be slightly out of date. The system never returns an error just because it can't verify freshness.\n\n<b>P — Partition Tolerance</b>\nThe system keeps working even if some servers can't talk to each other (a network partition).\n\n<b>Why the real choice is always CP vs AP</b>\n\nIn any real distributed system, network partitions happen. A cable gets cut, a data center has an outage, a server is temporarily unreachable. You cannot avoid partitions — so Partition Tolerance is not optional.\n\nThis means the actual trade-off you make is between Consistency and Availability:\n\n<b>CP Systems — Consistency over Availability</b>\nDuring a network partition, the system would rather return an error than return stale data.\n\n• Examples: HBase, ZooKeeper\n• Use when: data must always be correct — banking, inventory, reservations\n• \"I'd rather show an error than show you the wrong balance\"\n\n<b>AP Systems — Availability over Consistency</b>\nDuring a network partition, the system keeps responding but may return slightly stale data.\n\n• Examples: Cassandra, DynamoDB, CouchDB\n• Use when: brief inconsistency is acceptable — social feeds, activity logs, analytics\n• \"I'd rather show you a post from 200ms ago than show an error page\"\n\n<b>CA — Does not exist in distributed systems</b>\nYou cannot guarantee both consistency and availability without partition tolerance. Once data is spread across multiple nodes, partitions are inevitable.",
    note:
      "You cannot avoid network partitions in a distributed system. So the real decision is:\n\n• CP — correct data, possible downtime during a partition (banking, payments)\n• AP — always available, possibly slightly stale data (social feeds, analytics)\n\nMatch your choice to how serious inconsistency would be for your use case.",
    whyItMatters:
      "Database choice is fundamentally a CAP choice. Saying 'I'll use Cassandra because it gives AP — eventual consistency is acceptable for social feeds' shows architectural reasoning, not just tool knowledge.",
    diagramNote:
      "Fig. 17.1 — CAP theorem triangle: since partitions are inevitable in distributed systems, the real trade-off is always CP vs AP.",
    example:
      "Payment system: CP. During a network split between two data centers, block the transaction rather than risk processing it twice (double-charge). Social feed: AP. During a split, show posts from 200ms ago rather than show an error page. The financial cost of inconsistency is high for payments; the social cost of momentary staleness is low for feeds.",
    interviewTip:
      "Know that CA does not exist in distributed systems — you can't avoid partitions in a multi-node setup. Real choice is CP vs AP. Frame database decisions: 'For payment processing I need CP because data consistency is non-negotiable. For the activity feed I'd use AP because eventual consistency is acceptable and availability matters more.'",
    tags: ["CAP Theorem", "Consistency", "Availability", "Partition Tolerance", "CP", "AP", "Eventual Consistency"],
  },

  // ─────────────────────────────────────────────
  // RELIABILITY
  // ─────────────────────────────────────────────
  {
    id: 18,
    section: "Reliability",
    title: "Message Queues",
    tagline: "Async communication between services via a broker",
    description:
      "Some operations in a system need to happen immediately. Others can happen in the background. A message queue is how you handle the second category.\n\n<b>Synchronous vs Asynchronous</b>\n\n• `Synchronous` — the caller waits for a response before continuing. Example: checking inventory before confirming an order. Must happen right now.\n• `Asynchronous` — the caller fires off a task and moves on. The work happens later. Example: sending an order confirmation email. The user doesn't need to wait for the email to be sent.\n\nA message queue sits between two services — a producer that creates work and a consumer that processes it. The producer drops a message in, and the consumer picks it up when it's ready.\n\n<b>Key Concepts</b>\n\n<b>Dead Letter Queue (DLQ)</b>\nIf a message fails to be processed after several retries, it gets moved to a separate DLQ instead of being dropped silently. This lets you inspect and debug failed messages later.\n\n<b>Poison Messages</b>\nA poison message is one that always causes the consumer to crash or fail. Without a DLQ, it would keep getting retried forever, blocking everything else. The DLQ contains it.\n\n<b>Priority Queue</b>\nMessages can be given a priority number. High-priority messages are processed first, even if they arrived later.\n\n<b>Pull vs Push</b>\n• `Pull` — the consumer asks the queue for new messages when it's ready\n• `Push` — the queue pushes messages to the consumer as soon as they arrive\n\n<b>Pub/Sub Model</b>\nInstead of one producer sending to one consumer, a publisher sends a message to a topic. Multiple independent subscribers all receive that same message.\n\n• Example: an order is placed → order service publishes to a topic → email service, SMS service, and analytics service all receive the event independently\n\n<b>Deduplication</b>\nQueues may deliver the same message more than once (network retries, failures). Your consumer must track which messages it has already processed to avoid doing the same work twice.",
    note:
      "A message queue decouples services so they can scale and fail independently. Without a queue, a slow email service would block your entire checkout flow.\n\nKey tools: AWS SQS, RabbitMQ, Kafka. Always configure a Dead Letter Queue to catch failed messages.",
    whyItMatters:
      "Without queues, a slow email service blocks your entire order flow. Queues let services scale independently, survive each other's failures, and handle traffic spikes by buffering work.",
    diagramNote:
      "Fig. 18.1 — Message queue (point-to-point with DLQ) vs. pub/sub (one publisher, many independent subscribers).",
    example:
      "Amazon order: place order (sync: inventory check, must succeed immediately) → then three async messages pushed to queue: (1) email service sends confirmation, (2) delivery partner notified, (3) analytics updated. If email service is down, the message sits in queue. When it recovers, it processes the backlog — the order is already confirmed.",
    interviewTip:
      "Use message queues when: operations are slow (email, image resize, ML inference), services need to scale independently, work can be retried, or you're decoupling services. Don't use them when: you need immediate acknowledgement, the operation must complete synchronously, or volume is too low to justify the infrastructure cost. Always mention DLQ for failed message handling.",
    tags: ["Pub/Sub", "FIFO", "Priority Queue", "DLQ", "Dead Letter Queue", "Async", "RabbitMQ", "SQS", "Producer", "Consumer"],
  },
  {
    id: 19,
    section: "Reliability",
    title: "Fault Tolerance",
    tagline: "Designing for inevitable failures",
    description:
      "No system runs perfectly forever. Hardware breaks. Bugs slip into production. Engineers make mistakes. Fault tolerance is about designing your system so that when something goes wrong, it fails gracefully — not catastrophically.\n\nThere are three main categories of faults, each requiring a different type of fix.\n\n<b>1. Hardware Faults</b>\n\nPhysical failures that are random and unpredictable.\n\n• Disk fills up or fails\n• Server runs out of memory\n• Network cable is damaged\n• Power outage in a data center\n• Server overheats and shuts down\n\nSolution: redundancy. Run multiple servers. Replicate your database. Use RAID for disk redundancy. Add UPS (uninterruptible power supply) for power.\n\nYou can't predict these failures — you prepare for them by making every component replaceable.\n\n<b>2. Software Faults</b>\n\nBugs and bad code that are deterministic — if it happened once, it will happen again under the same conditions.\n\n• Unhandled exceptions crashing the server\n• A bad deployment breaking a feature\n• Config mismatch between development and production\n• A merge conflict introducing a regression\n• An N+1 query slowing the database under load\n\nSolution: process improvements. Thorough testing, code reviews, staged rollouts (deploy to 1% of users first), environment parity (staging matches production), and load testing before release.\n\n<b>3. Human Faults</b>\n\nMistakes made by engineers — the hardest to prevent and the most unpredictable.\n\n• Wrong config pushed to production\n• Accidentally deleting production data\n• Running a database migration on the wrong environment\n• A quick hotfix made without testing\n\nSolution: guard rails and process. Mandatory code reviews, staging environments, confirmation dialogs for destructive actions, dry-run mode for migrations, and detailed audit logs so you can trace what happened.",
    note:
      "Fault tolerance means the system degrades gracefully — one failure doesn't take down everything.\n\n• Hardware faults → redundancy (more servers, replicated DB)\n• Software faults → process (testing, staged rollouts, code review)\n• Human faults → guard rails (staging, audit logs, confirm-before-delete)",
    whyItMatters:
      "No system is 100% reliable. Hardware breaks. Deployments go wrong. Engineers make mistakes. A fault-tolerant system handles each failure category with a different strategy — redundancy for hardware, process for humans, testing for software.",
    diagramNote:
      "Fig. 19.1 — Three fault categories — hardware, software, and human — each requiring a different class of mitigation.",
    example:
      "AWS designs for hardware failure as the default assumption — every EC2 instance is expected to eventually fail. Auto Scaling Groups automatically replace failed instances. Multi-AZ deployments mean a data center fire doesn't cause downtime. Software failures are caught by canary deployments (route 1% of traffic to new version first).",
    interviewTip:
      "Mention fault tolerance proactively: 'This service needs redundancy — if the primary DB goes down, the replica promotes automatically. I'd also add retry with exponential backoff for transient network failures, and a circuit breaker to stop hammering a failing downstream service.'",
    tags: ["Redundancy", "Resilience", "Hardware Faults", "Software Bugs", "Human Error", "Recovery", "Availability"],
  },
  {
    id: 20,
    section: "Reliability",
    title: "Monitoring & Observability",
    tagline: "Logs, metrics, and percentiles to understand system health",
    description:
      "Monitoring is how you know your system is working correctly. Observability is your ability to understand what is happening inside a system by looking at its outputs.\n\nYou monitor two layers: your APIs and your machines.\n\n<b>API Monitoring</b>\n\n<b>Throughput</b>\nHow many requests per second is your system handling?\n\n• Alert when you're approaching your server's capacity limit (commonly set at 80%)\n• A sudden spike in throughput could mean a traffic surge — good — or a bot attack — bad\n\n<b>Error Rates</b>\nTrack how often requests return error status codes.\n\n• `5xx` errors (500, 503) mean your server is broken\n• `4xx` errors (400, 404) mean clients are sending bad requests\n• A sudden spike in error rate usually means a bad deployment or a failing dependency\n\n<b>Latency Percentiles — Never Use Averages</b>\nAverages lie. Use percentiles instead.\n\n• `P50` — 50% of requests complete faster than this value\n• `P90` — 90% of requests complete faster than this value\n• `P99` — 99% of requests complete faster than this value\n\nExample: P50 = 50ms, P99 = 8 seconds. The average might look like 100ms and seem fine. But 1 in every 100 users is waiting 8 full seconds. Percentiles reveal this; averages hide it.\n\nP99 is the gold standard — it represents your worst real-user experience.\n\n<b>Machine Monitoring</b>\n\nTrack the health of the servers running your application:\n\n• `CPU` — alert at 70–80% sustained usage\n• `Memory` — alert at 85–90% (leaving headroom prevents crashes)\n• `Disk I/O` — alert when disk is consistently at capacity\n• `Network bandwidth` — alert when approaching the limit of the network interface\n\n<b>SLOs — Service Level Objectives</b>\n\nAn SLO formalizes your performance target. Example: \"P99 latency must be under 500ms for 99.9% of minutes in a month.\"\n\nSLOs turn vague goals like \"the system should be fast\" into concrete, measurable engineering requirements.",
    note:
      "Never use average latency. Always use percentiles. P99 is the number that represents your real worst-case user experience.\n\nSet alerts on P99 latency, error rate, and machine resource usage before users start complaining — not after.",
    whyItMatters:
      "Averages hide tail latency — where real user pain lives. P99 at 8 seconds means 1 in 100 requests fails badly. Without percentile monitoring, you'd see a fine average and miss it entirely until users start complaining.",
    diagramNote:
      "Fig. 20.1 — Observability dashboards: API metrics (latency percentiles, error rate, throughput) alongside machine metrics (CPU, memory, disk, network).",
    example:
      "P50 = 50ms, P90 = 150ms, P99 = 8 seconds. The average is ~100ms — looks fine. But that P99 trace reveals a DB query with no index running across 100M rows. Add the index; P99 drops to 80ms. Percentile monitoring found a problem averages completely masked.",
    interviewTip:
      "Always say percentiles, never averages, for latency. P99 is the gold standard for user experience — that's the worst case your real users face. Mention SLOs: 'I'd set an SLO of P99 < 500ms and alert with PagerDuty when it's breached for 5 consecutive minutes.' This shows production-grade thinking.",
    tags: ["P99", "P95", "P90", "Percentile", "Latency", "Throughput", "SLO", "Metrics", "Alerting", "Observability"],
  },

  // ─────────────────────────────────────────────
  // CASE STUDY
  // ─────────────────────────────────────────────
  {
    id: 21,
    section: "Case Study",
    title: "Video Streaming Architecture",
    tagline: "How YouTube-style streaming actually works end to end",
    description:
      "A video = image frames + audio. At 30fps, 1 hour = 108,000 individual frames. Naive approach: download the entire 2GB file before playing — high latency, wastes bandwidth if user stops early. Real approach: split video into small segments (e.g., 1 second each), stream via RTMP/RTSP protocol over TCP (TCP maintains segment ordering). Client pulls segments one by one. Adaptive Bitrate Streaming (ABR): pre-encode each segment at multiple resolutions (4K, 1080p, 720p, 480p, 240p). The player monitors available network bandwidth and switches quality in real time — drops from 4K to 480p if bandwidth falls from 300Mbps to 10Mbps, avoiding buffering. Quality switches seamlessly between segments. Architecture pipeline: User uploads → Transformation Service (detects video metadata) → Message Queue → parallel Worker services (one per resolution, encode simultaneously) → Distributed CDN (edge servers near users worldwide) → Client requests segments. Math example: a 20-min 4K video at 50GB splits into 1,200 segments. Combined size across 5 quality levels ≈ 72MB per segment group.",
    whyItMatters:
      "Video streaming is one of the most data-intensive architectures. It touches CDN, message queues, parallel encoding pipelines, and adaptive algorithms simultaneously — a rich system design question that tests multiple concepts at once.",
    diagramNote:
      "Fig. 21.1 — Video pipeline: upload triggers parallel encoding workers per resolution; outputs are distributed via a multi-region CDN with adaptive bitrate switching.",
    example:
      "YouTube processes 500 hours of video uploaded every minute. Each video is split, encoded at 6+ quality levels in parallel workers, distributed to edge CDN servers globally, and served to 2 billion users who all get a different quality based on their current connection speed — all automatically.",
    interviewTip:
      "For video streaming questions, hit these points in order: (1) segments not full download, (2) adaptive bitrate based on network bandwidth, (3) CDN for geo-distributed serving, (4) message queue for async encoding pipeline, (5) parallel workers per quality level. Then do quick math: 'A 20-min video at 50GB splits into ~1200 segments; across 5 qualities that's ~72MB per segment group.'",
    tags: ["Video Streaming", "CDN", "Adaptive Bitrate", "RTMP", "RTSP", "Encoding", "Segments", "FFmpeg", "ABR"],
  },

  // ─────────────────────────────────────────────
  // ADVANCED TOPICS
  // ─────────────────────────────────────────────
  {
    id: 22,
    section: "Advanced Topics",
    title: "CDN",
    tagline: "Serves static content from locations close to users",
    description:
      "A Content Delivery Network is a globally distributed network of edge servers that cache static assets (images, JS, CSS, videos) close to users. When a user requests a file, DNS routes them to the nearest edge server (Point of Presence). On cache miss, the edge fetches from the origin and caches for future requests. Modern CDNs (Cloudflare, Fastly, Akamai) also support edge compute for dynamic logic. CDN cache control headers (Cache-Control, ETag) determine how long assets are cached at the edge and when to revalidate. Latency is proportional to physical distance — a user in Tokyo hitting Virginia adds ~200ms. A CDN brings assets to < 10ms from any location.",
    whyItMatters:
      "CDNs offload 80–95% of traffic from origin servers and reduce latency for global users. Without a CDN, every static file request travels to origin — wasteful and slow at scale.",
    diagramNote:
      "Fig. 22.1 — CDN topology: users hit the nearest edge server; on a cache miss the edge fetches once from origin and caches locally for all subsequent requests.",
    example:
      "Netflix built Open Connect — their own CDN with appliances inside ISPs. Netflix video bytes never leave the local network. Cache hit rate > 95%. YouTube uses Google's global edge network to serve 1B hours of video daily with < 50ms start time for most users.",
    interviewTip:
      "Mention CDNs for any system with media, high read traffic, or global users. Note the limitation: CDNs only help with cacheable content — dynamic, personalized data must still hit the origin. For static assets: long TTL. For versioned files (bundle.a3f8b.js): infinite TTL since the filename itself changes on redeploy.",
    tags: ["CDN", "Edge", "Latency", "Static Assets", "Cache Control", "Cloudflare", "Fastly"],
  },
  {
    id: 23,
    section: "Advanced Topics",
    title: "Database Indexing",
    tagline: "Makes queries fast by avoiding full table scans",
    description:
      "An index is a data structure (B-tree or hash) maintained alongside a table to enable fast lookups without scanning every row. Without an index on user_id: SELECT * FROM orders WHERE user_id = 123 scans all 100M rows — O(n). With a B-tree index on user_id: O(log n) — milliseconds. Composite indexes cover multiple columns: an index on (user_id, status) serves WHERE user_id = 123 AND status = 'pending' in one lookup. Covering indexes include all columns a query needs — no main table access required. Tradeoffs: indexes speed reads but slow writes (index must be updated on every INSERT/UPDATE/DELETE) and consume disk space. Every write to an indexed table touches the index too.",
    whyItMatters:
      "An unindexed query on a 100M-row table can take minutes. With a proper index, the same query takes milliseconds. Missing indexes are the most common cause of database performance problems at scale.",
    diagramNote:
      "Fig. 23.1 — B-tree index turns an O(n) full table scan into an O(log n) lookup; composite indexes add a second level to the tree.",
    example:
      "SELECT * FROM orders WHERE user_id = 123 AND status = 'pending' without index: full scan of 100M rows, ~2 minutes. With composite index on (user_id, status): direct lookup, ~1ms. EXPLAIN ANALYZE shows the difference: 'Seq Scan' vs 'Index Scan'.",
    interviewTip:
      "When discussing a query-heavy system, ask: 'What are the access patterns?' Then design indexes around those. Mention EXPLAIN ANALYZE to verify index usage. Warn about index overhead on write-heavy tables. For a system like Twitter with billions of tweets, mention that indexes on tweet_id and user_id are critical but add cost to every tweet write.",
    tags: ["B-tree", "Composite Index", "Covering Index", "Query Optimization", "SQL", "EXPLAIN"],
  },
  {
    id: 24,
    section: "Advanced Topics",
    title: "Rate Limiting",
    tagline: "Prevents API abuse by capping request rates",
    description:
      "Rate limiting caps how many requests a client can make in a time window. Four algorithms: Fixed Window — counter resets every minute. Simple but allows doubling at window boundaries (100 req in last second of minute 1 + 100 req in first second of minute 2 = 200 in 2 seconds). Sliding Window Log — store timestamp of every request in a list; count entries in the last 60 seconds. Precise but memory-heavy. Token Bucket — tokens refill at a constant rate (e.g. 10/sec), max bucket size 100. Each request consumes 1 token. If bucket is empty, reject. Allows bursting up to bucket size. Most common. Leaky Bucket — requests enter a fixed-size queue (the bucket). They are processed at a constant output rate regardless of how fast they arrive (like water leaking from a hole at the bottom). If the bucket is full, new requests are dropped. Key difference from Token Bucket: Token Bucket allows bursts; Leaky Bucket enforces a strictly constant output rate, smoothing all traffic spikes. Good for rate-limiting outbound calls to third-party APIs. State stored in Redis with atomic INCR + EXPIRE. Return HTTP 429 with Retry-After header.",
    whyItMatters:
      "Without rate limiting, one bad actor exhausts server resources and starves legitimate users. Leaky Bucket is specifically important for smoothing bursty traffic before it hits a downstream service that cannot handle spikes.",
    diagramNote:
      "Fig. 24.1 — Token bucket allows controlled bursts by accumulating tokens; leaky bucket enforces a strict constant output rate regardless of incoming traffic.",
    example:
      "Stripe uses Token Bucket for their API — allows short bursts for legitimate use cases like batch operations. An API gateway calling a third-party payment provider uses Leaky Bucket — no matter how many orders arrive simultaneously, calls to the payment API go out at a steady 50/sec to avoid overwhelming the vendor.",
    interviewTip:
      "Walk through Leaky Bucket step by step in interviews: 'Requests enter a queue. A worker drains the queue at a fixed rate — say 10 requests per second. If the queue is full, new requests are dropped or rejected with 429. This smooths any traffic spike into a constant stream.' Use Token Bucket when clients need burst capacity; use Leaky Bucket when downstream systems need protection from bursts.",
    tags: ["Token Bucket", "Leaky Bucket", "Sliding Window", "Fixed Window", "Redis", "HTTP 429", "Throttling"],
  },
  {
    id: 25,
    section: "Advanced Topics",
    title: "WebSockets",
    tagline: "Persistent bidirectional real-time communication",
    description:
      "WebSockets establish a persistent, full-duplex connection between client and server over a single TCP connection. Unlike HTTP (client requests, server responds, connection closes), WebSockets keep the connection open — the server can push data to clients at any time. Handshake: starts as HTTP with Upgrade: websocket header, then protocol switches. Once connected, either side sends messages at any time. Alternatives: Long Polling (client asks 'anything new?' every few seconds — simple but wasteful). Server-Sent Events / SSE (server pushes to client over HTTP, client cannot send — good for notifications and feeds, simpler than WebSockets). Use SSE when you only need server-to-client push. Use WebSockets when you need bidirectional communication (chat, gaming, collaborative editing).",
    whyItMatters:
      "Polling wastes bandwidth and adds latency. WebSockets enable sub-100ms real-time updates without wasted requests. For chat and live collaboration, polling is simply too slow and too expensive.",
    diagramNote:
      "Fig. 25.1 — WebSockets maintain a persistent full-duplex connection; HTTP closes after each response; SSE is server-to-client push only.",
    example:
      "Slack uses WebSockets for real-time message delivery. Figma uses them for collaborative design — move a shape and all 10 co-editors see it move in < 50ms. telesco.com quiz channels also use WebSockets to push real-time score updates as students submit answers.",
    interviewTip:
      "Compare WebSockets vs SSE vs long polling when asked about real-time features. Use SSE for server-push-only (live scores, feed updates, notifications). Use WebSockets for bidirectional (chat, gaming, live cursors). For WebSocket scale: sticky sessions at the load balancer or a Redis pub/sub layer to fan out messages across multiple backend instances.",
    tags: ["WebSockets", "Real-time", "SSE", "Long Polling", "Bidirectional", "Full-duplex", "TCP"],
  },
  {
    id: 26,
    section: "Advanced Topics",
    title: "Idempotency",
    tagline: "The same request shouldn't cause duplicate effects",
    description:
      "An idempotent operation produces the same result whether executed once or many times. GET, PUT, and DELETE are naturally idempotent — calling them twice gives the same result as once. POST is not — submitting a payment form twice charges twice. To make POST idempotent: the client sends a unique Idempotency-Key header (UUID) with every request. The server stores the result keyed by this value. If the same key arrives again (network retry after timeout), return the cached result instead of processing again. This is critical because networks are unreliable — clients must retry on timeout, and without idempotency, retries cause double-charges, duplicate orders, and duplicate emails.",
    whyItMatters:
      "Networks are unreliable. Clients retry on timeout. Without idempotency, every retry is a potential duplicate side effect. For payments, this means double-charging. For emails, this means spamming. At-least-once delivery + idempotent consumers = exactly-once semantics.",
    diagramNote:
      "Fig. 26.1 — Idempotency key flow: the server stores the result of the first request so any retry returns the same response without re-processing.",
    example:
      "Stripe's API accepts an Idempotency-Key header on all charge creation requests. If your server retries a failed HTTP call to Stripe, Stripe returns the original charge object instead of creating a second charge. This makes payment systems safe to retry without risk of double-billing.",
    interviewTip:
      "Bring up idempotency whenever designing payment processing, order placement, or any mutation with real-world consequences. Show the formula: 'At-least-once delivery + idempotent consumers = exactly-once semantics.' Store idempotency keys in Redis with TTL (24 hours is common).",
    tags: ["Idempotency", "Retries", "Payments", "Exactly-Once", "Idempotency-Key", "Stripe"],
  },
  {
    id: 27,
    section: "Advanced Topics",
    title: "Kafka",
    tagline: "High-throughput distributed event streaming",
    description:
      "Kafka is a distributed event streaming platform designed for high throughput and durability. Unlike traditional queues (message deleted after consumption), Kafka retains events in an ordered, immutable log for a configurable retention period (days to forever). Consumers track their own offset — they can replay from any point, multiple independent consumers can read the same data, and time-travel debugging is possible. Topics are partitioned for parallelism: each partition is a separate ordered log, handled by one consumer at a time within a consumer group. Each partition is replicated across brokers for fault tolerance. Kafka handles millions of events per second with millisecond end-to-end latency. Use Kafka over SQS/RabbitMQ when: multiple consumers need the same data, you need replay/audit capability, throughput is very high, or you're doing event sourcing.",
    whyItMatters:
      "At massive scale, traditional queues become bottlenecks. Kafka's log-based architecture enables real-time analytics, event sourcing, CDC (change data capture), and feeding multiple downstream systems from a single event stream without duplication.",
    diagramNote:
      "Fig. 27.1 — Kafka topics are partitioned logs; each consumer group tracks its own offset, enabling independent replay and parallel consumption.",
    example:
      "LinkedIn (Kafka's creator) processes 7 trillion messages per day — activity tracking, metrics pipeline, recommendation model updates. Uber uses Kafka for real-time trip matching, surge pricing calculation, and driver analytics — all reading from the same stream of trip events independently.",
    interviewTip:
      "Use Kafka when: multiple consumers need the same event stream, you need replay for debugging/reprocessing, throughput is very high (millions/sec), or you're building event sourcing. Consumer groups enable parallel processing within a topic while ensuring each message is handled once per group. Mention that Kafka is overkill for simple task queues — use SQS/RabbitMQ instead.",
    tags: ["Kafka", "Event Streaming", "Log", "Partitions", "Consumer Groups", "Replay", "CDC"],
  },
  {
    id: 28,
    section: "Advanced Topics",
    title: "Circuit Breaker & Retry",
    tagline: "Stop cascading failures and handle transient errors safely",
    description:
      "Circuit Breaker: wraps calls to an external service and monitors for failures. States: Closed (requests pass through normally), Open (after failure threshold exceeded, requests fail immediately without calling the downstream service — gives it time to recover), Half-Open (after a timeout, send a probe request; if it succeeds, close the circuit again; if it fails, re-open). Prevents a slow downstream service from exhausting all threads and taking down unrelated services. Retry with Exponential Backoff: automatically re-attempt failed requests. Without backoff, immediate retries under load create a thundering herd — thousands of clients hammering a recovering service simultaneously. Wait = base × 2^attempt (e.g., 1s, 2s, 4s, 8s). Add jitter (randomness) to desync clients. Only retry transient failures (503, network timeout) — not permanent failures (404, 400). Always pair retry with idempotency.",
    whyItMatters:
      "In microservices, a slow database or downstream API can hold connections, exhaust thread pools, and take down unrelated services. Circuit breakers contain failures. Backoff prevents retry storms. Together they make systems self-healing.",
    diagramNote:
      "Fig. 28.1 — Circuit breaker state machine: trips open after repeated failures, probes with half-open, and recovers to closed on success.",
    example:
      "Netflix resilience4j wraps every inter-service call. If the recommendation service fails 50% of requests in 10 seconds, the circuit opens and returns cached recommendations instead of calling a struggling service. AWS SDK retries with exponential backoff + jitter by default — DynamoDB throttled requests get retried after 1s, 2s, 4s delays.",
    interviewTip:
      "Pair circuit breakers with fallbacks: 'If the recommendation service is open, return the user's top 10 most-watched genres as a fallback.' Always pair retry with idempotency — retrying a non-idempotent operation creates duplicate side effects. Mention retry budgets (max 3 retries) to prevent infinite retry loops.",
    tags: ["Circuit Breaker", "Retry", "Exponential Backoff", "Jitter", "Thundering Herd", "Resilience", "Fallback"],
  },
  {
    id: 29,
    section: "Advanced Topics",
    title: "Microservices",
    tagline: "Decompose applications into independent deployable services",
    description:
      "Microservices decompose an application into small services, each owning its data and business logic, deployable independently. Services communicate via APIs (REST/gRPC) or events (Kafka/SQS). Each service can use the best technology for its purpose, be scaled independently, and be deployed without affecting other services. Key patterns: API Gateway (single entry point for clients — handles auth, routing, rate limiting), Service Discovery (services register their address; clients look up dynamically), Service Mesh (Istio — handles inter-service TLS, retries, circuit breaking at infrastructure level). Tradeoffs: distributed system complexity, network latency between services, data consistency across service boundaries, harder debugging (requires distributed tracing). Start with a modular monolith — extract services only when boundaries are clear and scale demands it.",
    whyItMatters:
      "Monoliths become hard to scale and deploy at a certain size — a bug in the payments module forces redeploying the entire app. Microservices let teams move independently and scale only what needs scaling.",
    diagramNote:
      "Fig. 29.1 — Microservices communicate synchronously via gRPC and asynchronously via Kafka; each service owns its own database.",
    example:
      "Netflix has 700+ microservices: separate services for search, recommendations, billing, streaming, and device management. Each team owns their service end-to-end and deploys dozens of times per day without coordinating with other teams.",
    interviewTip:
      "Don't over-engineer early — a well-structured monolith is simpler to operate and debug. Extract services when you have: clear domain boundaries, independent scaling needs, or separate team ownership. Discuss distributed tracing (Jaeger/Zipkin) as essential for debugging in a microservices architecture.",
    tags: ["Microservices", "API Gateway", "Service Mesh", "gRPC", "Domain-Driven Design", "Distributed Tracing"],
  },
  {
    id: 30,
    section: "Advanced Topics",
    title: "Pagination",
    tagline: "Loads large result sets in small chunks",
    description:
      "Pagination splits large result sets into pages so the server never has to load millions of rows at once. Offset pagination (LIMIT 20 OFFSET 100): simple — the DB skips the first 100 rows and returns the next 20. But at large depth (page 5000) the DB still scans and discards all 100,000 preceding rows — O(n) and slow. Cursor-based pagination uses a pointer to the last seen item (WHERE id > last_seen_id LIMIT 20) — O(1) regardless of page depth because the DB jumps directly to the cursor position using an index. For infinite scroll (Twitter, Instagram, TikTok), cursor-based is the standard. For page-number UIs (page 1, 2, 3) with small datasets, offset is fine. Always define a maximum page size to prevent clients requesting 1M rows in one call.",
    whyItMatters:
      "Returning all records in a single response is a common anti-pattern that causes out-of-memory crashes, slow responses, and wasted bandwidth. Every API that returns a list needs a pagination strategy from day one — retrofitting it later is painful.",
    diagramNote:
      "Fig. 30.1 — Offset pagination scans to the page boundary on every request; cursor pagination jumps directly to the last seen ID.",
    example:
      "Twitter's timeline API returns 20 tweets with a next_cursor token. Passing that token to the next call returns the following 20 without overlap or gap — and it's instant regardless of how far back in the timeline you are. GitHub's API uses Link headers with cursor tokens for repository list pagination.",
    interviewTip:
      "Default to cursor-based for feeds and time-ordered data. Use offset only for admin dashboards with small datasets where users need to jump to page N. Always state your max page size. Mention that cursors must be opaque to clients (base64 encoded) so the server can change the internal implementation without breaking clients.",
    tags: ["Cursor", "Offset", "Infinite Scroll", "API Design", "Keyset Pagination"],
  },
  {
    id: 31,
    section: "Advanced Topics",
    title: "Distributed Locking",
    tagline: "Prevents concurrent conflicts across servers",
    description:
      "When multiple servers need to ensure only one can perform an operation at a time (inventory decrement, cron job, auction bid), a distributed lock coordinates access. Redis SETNX (SET if Not eXists) with an expiry implements a simple lock: acquire by setting a key with a TTL, release by deleting it. Only the server that successfully sets the key gets the lock — all others see the key already exists and must wait or retry. Redlock algorithm uses multiple Redis nodes for fault tolerance — acquire from majority of N nodes, so a single Redis node failure doesn't break locking. ZooKeeper and etcd provide stronger consistency guarantees. Locks must always have TTLs to prevent deadlocks if the lock-holding server crashes before releasing. Fencing tokens (monotonically increasing version numbers) prevent stale lock holders from making changes after their lock has expired.",
    whyItMatters:
      "In a distributed system, race conditions are subtle and dangerous. Without distributed locking, two servers can simultaneously think they won an auction, oversell inventory by 1, or run the same daily cron job twice — all silent bugs that only appear under concurrent load.",
    diagramNote:
      "Fig. 31.1 — Redis distributed lock: SETNX grants the lock to the first requester; all others are denied until the key is deleted or its TTL expires.",
    example:
      "An e-commerce site uses Redis distributed lock when decrementing inventory: SETNX lock:item:42 server1 PX 5000. Only the server that acquired the lock can decrement. When it's done, DEL lock:item:42. If server1 crashes mid-operation, the PX 5000 TTL ensures the lock auto-expires in 5 seconds so no deadlock.",
    interviewTip:
      "Discuss three things: (1) TTL — long enough for the operation, short enough to auto-recover from crashes. (2) Fencing tokens — pass an incrementing version to the downstream system so stale lock holders can't write after their lock expired. (3) Alternatives — sometimes optimistic concurrency (compare-and-swap) is simpler than locks and avoids the lock-holder-crash problem entirely.",
    tags: ["Redis", "SETNX", "Redlock", "Race Condition", "Fencing Token", "Deadlock", "TTL"],
  },
  {
    id: 32,
    section: "Advanced Topics",
    title: "Consistency vs Availability",
    tagline: "The core trade-off in every distributed system",
    description:
      "When a network partition occurs in a distributed system, you must choose one of two behaviors. Consistency: every read returns the most recent write, or returns an error — the system refuses to serve stale data. Availability: every request gets a response (possibly stale) — the system never errors out, even if it can't guarantee freshness. This is the practical meaning of CAP theorem. CP systems (ZooKeeper, etcd, HBase): block or error during a partition to preserve consistency. AP systems (Cassandra, DynamoDB, CouchDB): keep serving during a partition, accepting eventual consistency. Most real systems make this decision per feature: banking and inventory require consistency; social feeds, analytics, and notifications tolerate eventual consistency. The key insight: you can tune this per operation, not just per database.",
    whyItMatters:
      "Understanding this trade-off prevents two expensive mistakes: choosing 'strong consistency everywhere' makes your system unavailable under network issues; choosing 'eventual consistency everywhere' causes subtle data correctness bugs in financial flows.",
    diagramNote:
      "Fig. 32.1 — During a network partition, CP systems block to preserve consistency while AP systems serve potentially stale data.",
    example:
      "When you post a tweet, it is fine if followers see it 200ms later — eventual consistency, AP. When you transfer money, the balance must be immediately correct on all nodes — strong consistency, CP. Both happen in the same company (Twitter, then Twitter Payments), choosing differently per feature.",
    interviewTip:
      "Frame every database choice around this trade-off explicitly: 'I'll use PostgreSQL here because transfers require strong consistency — I need CP guarantees.' Or: 'I'll use Cassandra for the activity feed because availability matters more than perfect freshness — AP is acceptable.' This framing shows architectural reasoning over tool preference.",
    tags: ["CAP Theorem", "Eventual Consistency", "Strong Consistency", "PACELC", "CP", "AP"],
  },
  {
    id: 33,
    section: "Advanced Topics",
    title: "Retry & Backoff",
    tagline: "Handles transient failures without creating retry storms",
    description:
      "Retries automatically re-attempt failed requests to recover from transient failures (network hiccup, brief overload, 503). Without backoff, immediate retries under load create a thundering herd — thousands of clients simultaneously hammering a recovering service, preventing it from recovering. Exponential backoff: wait = base × 2^attempt (1s, 2s, 4s, 8s, 16s). Jitter adds randomness to desync clients from retrying at exactly the same moment — without jitter, all clients wake up simultaneously and create spikes. Max retries cap the total attempts to avoid infinite loops. Only retry transient failures (503, 429, network timeout) — never retry permanent failures (400 Bad Request, 404 Not Found) since they won't succeed regardless. Retry budget: limit the total time spent retrying across an entire request chain to prevent cascading delays.",
    whyItMatters:
      "Without retries, any transient network hiccup causes a user-visible error. Without backoff, retries make failures worse — the recovering service gets hammered before it can stabilize. Exponential backoff with jitter is the standard solution used by every major cloud SDK.",
    diagramNote:
      "Fig. 33.1 — Exponential backoff doubles the wait time between retries; jitter staggers client retry times to prevent a synchronized thundering herd.",
    example:
      "AWS SDK retries with exponential backoff + jitter by default — DynamoDB throttled requests get retried after 1s, 2s, 4s with random jitter. Without jitter, a DynamoDB table going over capacity would cause all Lambda functions to retry simultaneously, creating a retry spike that makes recovery worse.",
    interviewTip:
      "Always pair retry with idempotency — retrying a non-idempotent operation creates duplicate side effects (double charge, double email). Mention retry budgets to prevent tail latency from compounding across multiple service calls. Combine with circuit breakers: stop retrying when the circuit is open (downstream is clearly down, not just hiccuping).",
    tags: ["Exponential Backoff", "Jitter", "Thundering Herd", "Retry Budget", "Transient Failure", "Resilience"],
  },
  {
    id: 43,
    section: "Advanced Topics",
    title: "Distributed Unique ID Generation",
    tagline: "Generating unique IDs at scale without a central bottleneck",
    description:
      "Every distributed system needs unique IDs for records, events, and messages. Three main approaches: Auto-increment (simple, sequential, but a single database bottleneck — hard to scale across machines). UUID v4 (128-bit random — globally unique, no coordination needed, but NOT sortable and performs poorly as a clustered index primary key because random insertions fragment the B-tree). Snowflake (Twitter's solution — a 64-bit integer composed of: 41 bits for timestamp in milliseconds since a custom epoch, 10 bits for machine/worker ID, 12 bits for a per-machine sequence number. Total: ~4 million unique IDs per millisecond per machine. Chronologically sortable because the timestamp is the most significant bits — newer IDs are always numerically larger). Snowflake ID structure: [sign 1 bit][timestamp 41 bits][machine ID 10 bits][sequence 12 bits]. Machine ID is assigned at worker startup (from ZooKeeper or a config). Sequence resets to 0 each millisecond. ULID (Universally Unique Lexicographically Sortable Identifier) is a more modern alternative — 128-bit, URL-safe, sortable.",
    whyItMatters:
      "ID generation is a hidden bottleneck in distributed systems. Using a database auto-increment as ID source becomes a write bottleneck at scale. Snowflake IDs are the standard answer — they're fast, unique, sortable, and require no central coordinator after machine IDs are assigned.",
    diagramNote:
      "Fig. 43.1 — Snowflake ID structure: 41-bit timestamp prefix ensures chronological sort order across 4,096 IDs per millisecond per worker.",
    example:
      "Twitter originally used MySQL auto-increment for tweet IDs, which became a write bottleneck at scale. They built Snowflake — a service that generates 64-bit IDs distributed across machines, each machine assigned a unique 10-bit ID. Discord uses a Snowflake variant for message IDs — you can extract the exact creation timestamp of any Discord message from its ID by reading the timestamp bits.",
    interviewTip:
      "When a design needs IDs, say: 'I'd use a Snowflake-style ID — 41-bit timestamp, 10-bit machine ID, 12-bit sequence. This gives me sortable IDs, 4M/ms throughput, and no central coordinator bottleneck.' Walk through the bit breakdown — interviewers specifically ask 'why is it chronologically sortable?' The answer: timestamp occupies the most significant bits, so higher IDs always represent later events.",
    tags: ["Snowflake", "UUID", "Distributed ID", "ULID", "Auto-increment", "Twitter", "Timestamp", "Unique ID"],
  },

  // ─── FOUNDATION GAPS ──────────────────────────────────────────
  {
    id: 34,
    section: "Foundation",
    title: "Latency & Throughput",
    tagline: "The two core performance metrics every engineer must know",
    description:
      "Two of the most important performance metrics in system design are latency and throughput.\n\nLatency is the time it takes to complete a single request, usually measured in milliseconds (ms). Lower latency means users get responses faster.\n\nThroughput is the number of requests a system can handle in a given period, usually measured in requests per second (req/s). Higher throughput means the system can process more work.\n\nAlthough related, they measure different things. A system can have high throughput but high latency, or low latency but limited throughput. A batch-processing system might process 10,000 items per second (high throughput), but each individual item may take 2 seconds to complete (high latency). A real-time API might respond in 50ms (low latency) but handle fewer requests overall unless more servers are added.\n\nAs traffic increases, throughput usually increases as well — up to a point. Eventually the system reaches its capacity limit. Beyond that point, it cannot process requests fast enough, and latency starts increasing rapidly. This sudden spike in latency is often the first sign that a system is becoming overloaded.\n\nWhen measuring performance, don't rely only on average latency. Instead, pay attention to percentiles — especially P99. P50 latency means 50% of requests are faster than that value. P99 latency means 99% of requests are faster than that value. If P50 = 50ms but P99 = 8 seconds, 1 out of every 100 users waits 8 seconds. An average of 100ms would completely hide this problem. That's why engineers monitor tail latency (P95, P99, P99.9) instead of averages.\n\nAs a general rule: CDN edge response under 10ms, cache hit under 1ms, web API response under 200ms, database query under 50ms.\n\nThe key takeaway: throughput tells you how much work a system can do, while latency tells you how fast it responds. A good system balances both and keeps latency low even as traffic grows.",
    whyItMatters:
      "Every performance conversation in interviews uses these two terms. Knowing the difference tells you which problem you're solving: 'system is slow for each user' (latency) vs 'system can't handle enough users at once' (throughput). They require different fixes.",
    diagramNote:
      "Fig. 34.1 — Latency and throughput diverge under load: throughput plateaus at capacity while latency spikes as the queue grows.",
    example:
      "Google Search: P99 latency < 200ms while handling ~99,000 req/s throughput. Redis: < 1ms latency at 1M+ ops/sec throughput because everything stays in RAM. A slow DB query (high latency) doesn't necessarily mean low throughput — if you run 1,000 queries in parallel, throughput stays high even though each individual query is slow.",
    interviewTip:
      "State both metrics when asked about performance targets: 'I'll target P99 latency under 200ms at 10,000 req/s throughput.' Always say P99, never average. When a system is 'slow', ask yourself: is every request slow (latency problem → check DB query, add index, add cache)? Or is it fine for one user but breaks under load (throughput problem → add servers, load balancer, scale horizontally)?",
    tags: ["Latency", "Throughput", "P99", "P50", "Performance", "Capacity", "Tail Latency"],
  },
  {
    id: 35,
    section: "Foundation",
    title: "Capacity Estimation",
    tagline: "Back-of-envelope math that every interview requires",
    description:
      "Before designing any system, the first step is to estimate its scale. These estimates help you choose the right architecture, databases, caches, and infrastructure.\n\nA common approach is to start with Daily Active Users (DAU) and work through this chain: DAU → Requests per Day → Requests per Second (RPS) → Storage → Bandwidth.\n\nThe most important formula to remember is: RPS = Requests per Day ÷ 86,400. There are 86,400 seconds in a day, so dividing total daily requests by that gives the average requests per second. For example, 1 million DAU making 10 requests each = 10 million requests/day ≈ 116 RPS. 100 million DAU making 10 requests each = 1 billion requests/day ≈ 12,000 RPS.\n\nStorage estimation follows the same logic. 1 million users × 1 KB profile data = 1 GB. 1 million photos per day × 200 KB each = 200 GB/day.\n\nTraffic is rarely evenly distributed. Events like Black Friday, product launches, or viral content cause sudden spikes. A common rule of thumb is: Peak Traffic ≈ Average Traffic × 3.\n\nCaching is another key consideration. In most systems, a small portion of the data receives most of the traffic. Following the 80/20 rule, roughly 20% of the data generates 80% of the requests. A reasonable starting estimate for cache size is 20% of your active daily data.\n\nTo estimate servers needed: Servers = Peak RPS ÷ Single Server Capacity. For example, if peak traffic is 15,000 RPS and one server handles 3,000 RPS, you need 5 servers.\n\nIn interviews and real-world discussions, the goal is not perfect accuracy. The goal is to make reasonable assumptions and quickly estimate the order of magnitude. Always state your assumptions clearly, round numbers aggressively, and focus on understanding the scale rather than performing exact calculations.\n\nThe key takeaway: good system design starts with estimating traffic, storage, and growth. Once you know the scale, architectural decisions become much easier.",
    whyItMatters:
      "Capacity estimation drives every architecture decision. '12,000 req/s means one server is not enough — I need a load balancer and at least 6 servers.' Without estimation, your design has no foundation. Interviewers use it to see if you think at production scale.",
    diagramNote:
      "Fig. 35.1 — Back-of-envelope estimation: chain DAU through request rate to server count, then independently estimate daily and yearly storage.",
    example:
      "Twitter estimation: 300M DAU × 20 tweet-reads/day = 6B reads/day = 70,000 read req/s. Writes: 100M tweets/day × 280 bytes = 28GB text/day. Images: 10% of tweets have images × 200KB = 2TB/day image storage. Conclusion: read replicas are essential (70K read req/s), separate object storage for images (2TB/day can't go in SQL), cache the timeline heavily (same tweets read by millions).",
    interviewTip:
      "Use these 5 steps every interview: (1) State DAU. (2) Calculate req/s = DAU × requests per user ÷ 86,400. (3) Storage/day = req/s × data per request × 86,400. (4) Peak = average × 3. (5) Servers = peak req/s ÷ 1,000. Say all math out loud: 'If 1M DAU each make 10 requests, that's 10M per day, divide by 86,400 seconds, roughly 116 req/s, peak of about 350.' Rounding to nice numbers shows comfort with estimation.",
    tags: ["Capacity Estimation", "DAU", "RPS", "Back-of-Envelope", "Storage", "Throughput", "Scalability"],
  },

  // ─── DATA LAYER GAP ───────────────────────────────────────────
  {
    id: 36,
    section: "Data Layer",
    title: "Cache-aside Pattern",
    tagline: "The most common cache pattern — the app controls the cache",
    description:
      "Cache-aside (also called lazy loading) is the most widely used caching pattern. The application code is in charge of all cache interactions — the cache is not automatically in the data path.\n\n<b>Read Flow</b>\n\n1. The app checks the cache first\n2. `Cache HIT` — data is found → return it immediately, no DB query needed\n3. `Cache MISS` — data is not in cache → query the database\n4. Store the result in cache with a TTL (expiry time)\n5. Return the result to the caller\n\nThe key idea: data only enters the cache when it is actually requested. Cold data (never requested) never fills up the cache.\n\n<b>Write Flow</b>\n\nWhen data is updated:\n\n1. Write the new data to the database\n2. Delete (invalidate) the corresponding cache key\n3. The next read will re-populate the cache with fresh data\n\nWhy delete instead of update? Deleting is simpler and avoids the risk of writing stale computed values into the cache.\n\n<b>How it differs from Read-Through and Write-Through</b>\n\n• `Read-Through` — the cache layer itself fetches from the DB on a miss. The app only ever talks to the cache, never directly to the DB.\n• `Write-Through` — every write goes to the cache and the DB together, automatically.\n• `Cache-aside` — the application code explicitly handles all cache reads and writes. More flexible, but requires more code.\n\n<b>Why cache-aside is preferred</b>\n\n• You can cache any computed result — not just raw DB rows\n• You can combine multiple DB queries into a single cache entry\n• You have precise control over what gets cached and for how long\n• Works even when the cache and DB cannot be directly connected",
    note:
      "Cache-aside is your default answer when someone asks how you would add caching to a system. The app checks cache first, falls back to DB on miss, then populates the cache.\n\nOn writes: update the DB, then delete the cache key. Simple and reliable.",
    whyItMatters:
      "Cache-aside is the most widely used caching pattern in production. It's simple, explicit, and puts the app in control. It's what most engineers mean when they say 'add Redis caching.' The curriculum names it specifically because interviewers ask for it by name.",
    diagramNote:
      "Fig. 36.1 — Cache-aside read path: check cache first, fall back to DB on miss, populate cache; write path updates DB and invalidates the cache key.",
    example:
      "A product page: first user requests product #42 — cache miss, app fetches from DB, stores in Redis with 5-min TTL. Next 10,000 users hit Redis — zero DB queries. When product price changes, app updates DB then deletes the Redis key. Next request re-fetches fresh price from DB and re-populates cache. This delete-on-write approach is simpler than update-on-write and avoids stale data.",
    interviewTip:
      "Cache-aside is your default answer when asked about caching strategy. Say: 'I'd use cache-aside — on miss, the application fetches from DB and populates Redis with a TTL. On writes, I'd invalidate the cache key so the next read gets fresh data.' Distinguish it from read-through by saying the app (not the cache infrastructure) is responsible for loading data. This distinction matters for systems where cache and DB can't be directly connected.",
    tags: ["Cache-aside", "Lazy Loading", "Cache Invalidation", "Redis", "Cache Strategy", "Read-Through"],
  },

  // ─── ADVANCED TOPICS GAPS ─────────────────────────────────────
  {
    id: 37,
    section: "Advanced Topics",
    title: "Reverse Proxy",
    tagline: "The gatekeeper that sits in front of your backend",
    description:
      "A reverse proxy is a server that accepts all client requests and forwards them to backend servers, then returns the backend response to the client. The client never talks directly to a backend — it only ever sees the reverse proxy. What it handles: SSL/TLS termination (reverse proxy manages HTTPS so backend servers run plain HTTP internally, no certificate management per server), request routing (send /api/* to app servers, /static/* to object storage), response compression (gzip before sending to client), caching (serve cached responses without hitting backend), rate limiting, and authentication. Difference from load balancer: a load balancer is a specialized reverse proxy focused on distributing traffic across identical servers. A reverse proxy has broader responsibilities. NGINX and HAProxy are the most common reverse proxy tools. In microservices, the API Gateway is the reverse proxy that routes requests to specific services.",
    whyItMatters:
      "A reverse proxy is the single entry point to your system. Without it, backend servers are exposed directly to the internet, each client must know which server to hit, SSL must be handled on every server, and you have no central place for auth, rate limiting, or caching.",
    diagramNote:
      "Fig. 37.1 — Reverse proxy sits in front of servers (SSL termination, routing, rate limiting); forward proxy sits in front of clients (VPN, anonymity).",
    example:
      "NGINX as reverse proxy: all traffic hits NGINX on port 443 (HTTPS). NGINX terminates SSL, strips certificate overhead, and forwards plain HTTP to backend servers on port 8080 internally. Backend servers never touch the public internet. NGINX also caches static assets, applies rate limits per IP, and routes /api/* to Node.js servers while serving /static/* from disk.",
    interviewTip:
      "Distinguish from load balancer in interviews: 'A load balancer is a reverse proxy specialized for traffic distribution. A reverse proxy has additional responsibilities: SSL termination, routing, caching, auth.' In microservices, call it an API Gateway — same concept, named for the microservices context. When designing any system, add a reverse proxy/API Gateway as the first layer clients hit.",
    tags: ["Reverse Proxy", "NGINX", "SSL Termination", "API Gateway", "HAProxy", "Load Balancer"],
  },
  {
    id: 38,
    section: "Advanced Topics",
    title: "Object Storage",
    tagline: "Where files, images, and videos actually live at scale",
    description:
      "Object storage (Amazon S3, Google Cloud Storage, Azure Blob) stores binary data as objects — each object has a key (path/filename), the data (raw bytes), and metadata. Unlike a relational database (structured queries) or a file system (folder hierarchy), object storage is a flat key-value store for binary blobs, massively scalable to trillions of objects. The standard architecture: your application stores the object URL in your database (column: photo_url TEXT) and stores the actual bytes in S3 — never binary blobs in SQL. Access pattern: upload goes App → S3 directly. Reads go through CDN → S3 origin on cache miss. Pre-signed URLs generate temporary access links for private files without making the S3 bucket public — the URL is signed with your credentials and expires after N minutes. Never store video, images, audio, or large documents in a SQL database — it makes the DB huge, slows every query that scans tables, and prevents efficient serving via CDN.",
    whyItMatters:
      "Any system with user-uploaded content (photos, videos, documents, backups) requires object storage. Saying 'store images in the database' in an interview is the most common red flag for senior roles. Object storage is the correct answer whenever binary data appears in a design.",
    diagramNote:
      "Fig. 38.1 — Blob storage pattern: the DB stores only the URL; S3 stores the bytes; the CDN caches bytes at the edge for fast delivery.",
    example:
      "Instagram upload: user posts a photo → upload service generates a unique ID → image bytes go to S3 at path users/{user_id}/{photo_id}.jpg → the S3 URL is stored in PostgreSQL next to post metadata → CloudFront CDN caches the image at 200+ edge locations worldwide. The database row is 200 bytes. The image file is 2MB. Storing the image in the DB would make it 10,000× larger.",
    interviewTip:
      "Whenever any design involves user uploads, immediately say: 'I'd use object storage like S3 for the actual file bytes, store just the URL in the database, and put a CDN in front of S3 for fast global reads.' For private content (medical records, private DMs with attachments), say 'pre-signed URLs that expire after 15 minutes — never make the bucket public.' This answer alone separates candidates who have built real systems from those who haven't.",
    tags: ["S3", "Object Storage", "Blob Storage", "GCS", "CDN", "Pre-signed URL", "Binary Data", "Media Storage"],
  },
  {
    id: 39,
    section: "Advanced Topics",
    title: "Authentication",
    tagline: "Who are you — JWT, OAuth, and sessions explained",
    description:
      "Authentication (authn) = verifying who the user is. Authorization (authz) = what they are allowed to do. Three approaches: Session-based — server stores session data in Redis, client sends a session ID cookie on every request. Stateful: every request hits the session store. Simple for monoliths. JWT (JSON Web Token) — server signs a token with a secret key and sends it to the client. Client sends the token in every request (Authorization: Bearer <token>). Server verifies the signature locally — no database lookup. Stateless, scales horizontally, ideal for microservices. JWT payload contains user_id, roles, and expiry — base64 encoded (not encrypted, so never store secrets in it). Access tokens: short-lived (15 min). Refresh tokens: long-lived (7 days), used to silently get a new access token when it expires. OAuth 2.0 — delegated authorization. 'Login with Google' lets users authenticate via Google; Google gives your app a token proving identity without your app ever seeing the user's Google password.",
    whyItMatters:
      "Every API has authentication. Getting it wrong means any user can access any other user's data. JWT is the standard for stateless, horizontally-scalable auth. OAuth is the standard for third-party identity. These come up in almost every API design question.",
    diagramNote:
      "Fig. 39.1 — JWT authentication: the server signs a self-contained token once; every subsequent request is verified without a database lookup.",
    example:
      "A typical mobile app: login returns a JWT (expires 15 min) + refresh token (expires 7 days). The app stores both. Every API call sends the JWT. After 15 min, the app silently calls POST /auth/refresh with the refresh token to get a new JWT — user never sees a re-login prompt. When the user logs out, the refresh token is deleted from the DB (revoked). The old JWT still works for up to 15 min — that's the trade-off of stateless tokens.",
    interviewTip:
      "In any API design, add auth immediately: 'Every endpoint requires a JWT in the Authorization: Bearer header. The API gateway validates the JWT signature before routing to any service — individual services never handle auth.' Mention the JWT revocation problem: since JWTs are stateless, you can't invalidate them before expiry. Solution: maintain a small token blacklist in Redis. Short TTL (15 min) limits the blast radius.",
    tags: ["JWT", "OAuth", "Authentication", "Authorization", "Session", "Refresh Token", "Bearer Token", "Stateless"],
  },

  // ─── CASE STUDY ADDITIONS ─────────────────────────────────────
  {
    id: 40,
    section: "Case Study",
    title: "URL Shortener Design",
    tagline: "Design bit.ly — hashing, redirection, and scale",
    description:
      "Functional requirements: given a long URL, generate a unique short code (bit.ly/abc123). Given a short code, redirect to the original URL. Optionally: analytics (click count, location). Capacity: 100M shortening requests/day = ~1,200 write req/s. 10B redirections/day = ~116,000 read req/s. Heavily read-skewed. Key design choice — generating the short code: (1) Hash the URL (MD5, take 7 chars) — risk of collision. (2) Base62-encode an auto-incremented ID — 62 characters (a–z, A–Z, 0–9), 7 chars = 62^7 = 3.5 trillion unique codes, no collision. Option 2 is preferred. Redirect: 301 (permanent, browser caches — fewer server calls but no analytics after first visit) vs 302 (temporary, every click hits server — accurate analytics). Database: a simple key-value table: short_code → {long_url, user_id, created_at, click_count}. Read path: short code lookup → cache first → DB on miss → return 301/302 redirect. Cache: 80% of traffic goes to 20% of URLs — LRU cache of popular short codes in Redis.",
    whyItMatters:
      "URL shortener is the most common starter system design question. It tests: unique ID generation, read-heavy scaling, caching, and database choice. The patterns (ID generation, redirect strategy, cache-aside) reuse in dozens of other designs.",
    diagramNote:
      "Fig. 40.1 — URL shortener: write path generates a Base62 key and stores the mapping; read path checks Redis before falling back to the DB.",
    example:
      "bit.ly serves 10B+ clicks/month. They use Base62 encoding with a distributed ID generator (like Snowflake) to avoid collisions. Popular links like a viral tweet's shortened URL might get 10M clicks in an hour — pure cache hits in Redis, the database is rarely touched for those. Analytics are batched: click counts are incremented in Redis and flushed to DB periodically to avoid write storms.",
    interviewTip:
      "Hit these points in order: (1) Clarify requirements — custom aliases? expiry? analytics? (2) Capacity — 1200 write req/s, 116K read req/s, read-heavy. (3) Short code generation — Base62 of auto-incremented ID, 7 chars = 3.5T URLs. (4) Database — single table: short_code PK, long_url, created_at. (5) Cache — Redis with LRU, cache the hot 20%. (6) Redirect — 302 for analytics, 301 for performance. (7) Scale reads with read replicas and cache.",
    tags: ["URL Shortener", "Base62", "Hashing", "Redirect", "Cache-aside", "Read-heavy", "Case Study"],
  },
  {
    id: 41,
    section: "Case Study",
    title: "News Feed Design",
    tagline: "Design Twitter/Instagram feed — fan-out and ranking",
    description:
      "Functional requirements: user sees a personalized feed of posts from people they follow, sorted by time or relevance. Two core approaches for feed generation: Fan-out on write (push model) — when user A posts, immediately write the post ID to all followers' feed lists. Feed reads are instant (pre-computed list). Problem: if a celebrity has 10M followers, one post triggers 10M writes. Fan-out on read (pull model) — when a user opens their feed, fetch recent posts from all followees and merge. No pre-computation, always fresh. Problem: reading from 1,000 followees on every page load is slow. Hybrid (production approach): push for normal users (< 10K followers), pull for celebrities (> 10K followers). Feed storage: per-user feed stored in Redis as a sorted set (score = timestamp), containing post IDs (not full post data). Post content fetched separately by ID. Database: posts in PostgreSQL, follow relationships in a graph or SQL table, full post content in a post store.",
    whyItMatters:
      "News feed is one of the five canonical system design questions. It tests fan-out strategies, the tradeoff between read and write amplification, caching, and real-time delivery. The push-vs-pull pattern appears in notifications, activity streams, and recommendation feeds.",
    diagramNote:
      "Fig. 41.1 — News feed fan-out: push pre-writes to followers' caches (fast reads, expensive writes); pull reads at request time (always fresh, slow). Hybrid merges both for celebrity accounts.",
    example:
      "Twitter uses a hybrid approach: when you tweet, your post is pushed to the Redis feed cache of your followers instantly (if they have < 10K followers). When a celebrity (10M followers) tweets, their posts are NOT pushed — instead, when you open your timeline, Twitter pulls the celebrity's recent tweets and merges them with your pre-computed feed in real time. This keeps write fanout manageable.",
    interviewTip:
      "Start with requirements: 'Does the feed need to be real-time? Can it be slightly stale?' Then state the tradeoff clearly: 'Fan-out on write gives fast reads but expensive writes — problem for celebrities. Fan-out on read gives fresh data but slow reads at scale. I'd use hybrid: push for < 10K followers, pull for celebrities.' Store only post IDs in the feed cache, not full content — content fetched by ID separately for storage efficiency.",
    tags: ["News Feed", "Fan-out", "Push Model", "Pull Model", "Redis", "Timeline", "Celebrity Problem", "Case Study"],
  },
  {
    id: 42,
    section: "Case Study",
    title: "Messaging App Design",
    tagline: "Design WhatsApp — real-time delivery, storage, and receipts",
    description:
      "Functional requirements: send a message to a user, receive messages in real-time, delivery receipts (sent / delivered / read), group chats, offline message handling. Real-time delivery: each client maintains a persistent WebSocket connection to a chat server. When sender sends a message → chat server stores it in DB → delivers to recipient via their WebSocket connection. If recipient is offline, message is stored and pushed when they reconnect via push notification (APNs/FCM). Message storage: Cassandra is ideal — high write throughput, time-series data, scales horizontally. Schema: (conversation_id, message_id, sender_id, content, timestamp, status). message_id uses a time-sortable unique ID (Snowflake) so messages are stored in chronological order. Group messages: sender → message service → fan-out to all group members' active connections + store for offline members. Media: images/videos go to object storage (S3), message stores the S3 URL. End-to-end encryption: keys are stored on devices only, server stores only ciphertext.",
    whyItMatters:
      "Messaging app design is one of the most common senior-level interview questions. It tests WebSocket connection management at scale, offline message queuing, database choice for high-write time-series data, and real-time fan-out for groups.",
    diagramNote:
      "Fig. 42.1 — Chat message flow: online recipients receive via WebSocket; offline recipients get a push notification and fetch on next open.",
    example:
      "WhatsApp handles 2 billion users with roughly 100 billion messages/day. They use Erlang for chat servers (designed for massive concurrent connections), Mnesia/custom storage for message queues, and store media in object storage. The three delivery receipts (single grey tick = sent to server, double grey tick = delivered to device, double blue tick = read by recipient) are implemented via acknowledgement messages sent back through the WebSocket channel.",
    interviewTip:
      "Cover these five areas: (1) Real-time: WebSocket connections, each server handles 50K connections, users route to same server via consistent hashing on user_id. (2) Storage: Cassandra for messages (high write, time-series), partitioned by conversation_id. (3) Offline: store messages in DB, push notification to wake up client. (4) Groups: fan-out to all members, cap group size to limit fan-out cost. (5) Media: S3 for files, store URL in message. The delivery receipt flow is a common follow-up — trace the ACK messages explicitly.",
    tags: ["Messaging", "WhatsApp", "WebSockets", "Cassandra", "Real-time", "Fan-out", "Offline Queue", "Case Study"],
  },
  {
    id: 44,
    section: "Case Study",
    title: "Web Crawler Design",
    tagline: "Design a Google-scale web crawler — queues, deduplication, and politeness",
    description:
      "A web crawler systematically downloads and indexes web pages. Core components: URL Frontier (priority queue of URLs to visit — breadth-first for general crawling, priority-weighted for important pages), Fetcher (downloads HTML from URLs), Link Extractor / Parser (pulls all links from downloaded HTML), Deduplicator (prevents re-crawling the same URL — use a Bloom filter for fast membership checks, or a hash set of seen URL fingerprints), Content Store (saves crawled HTML for indexing). Key challenges: Deduplication — the same page can be reached from thousands of links. Normalize URLs (lowercase, remove trailing slash, sort query params) before hashing. Use a Bloom filter (space-efficient probabilistic structure) for fast near-duplicate detection. Politeness — don't hammer one server. Respect robots.txt. Rate-limit crawls per domain using a per-domain queue and delay timer. Scale — distribute crawl workers; partition URL frontier by domain hash so each worker owns a set of domains. DNS caching — crawlers cache DNS results to avoid a lookup per URL.",
    whyItMatters:
      "Web crawler design tests queue management, deduplication, distributed architecture, and politeness policies — skills that apply to any large-scale data ingestion system, not just crawlers.",
    diagramNote:
      "Fig. 44.1 — Web crawler loop: the frontier feeds fetchers; parsed links are deduplicated via Bloom filter before re-entering the frontier.",
    example:
      "Googlebot crawls billions of pages. It uses a distributed URL frontier sharded by domain, respects crawl-delay in robots.txt, caches DNS lookups per domain for efficiency, and uses a distributed content-addressable hash to detect near-duplicate pages (e.g., a page with and without www). Crawl budget is allocated per domain — important sites are crawled daily, low-quality sites monthly.",
    interviewTip:
      "Hit four points: (1) URL Frontier — priority queue, not just FIFO. Rank by PageRank or last-modified header. (2) Deduplication — Bloom filter for URL seen-check, MD5 hash of content for duplicate page detection. (3) Politeness — per-domain rate limiting, robots.txt, crawl-delay header. (4) Scale — partition frontier by domain hash, each worker owns a shard. The deduplication strategy is the most common deep-dive question.",
    tags: ["Web Crawler", "Bloom Filter", "Deduplication", "URL Frontier", "robots.txt", "Politeness", "Case Study"],
  },
  {
    id: 45,
    section: "Case Study",
    title: "Notification System Design",
    tagline: "Design push, email, and SMS notifications at scale",
    description:
      "A notification system delivers messages across multiple channels: push notifications (iOS via APNs, Android via FCM), email (SMTP / SendGrid), and SMS (Twilio). Core architecture: Notification Service (API endpoint: POST /notify) → Message Queue → Channel Workers (one per channel type). This decoupling ensures a slow email provider doesn't block push notifications. User preferences: a settings table lets users opt out per channel or notification type — check this before sending. Deduplication: assign each notification an idempotency key. Workers check this key before sending — retry-safe, no duplicate emails. High-volume handling: batch notifications (send digest instead of 100 individual emails), rate-limit per user (max 3 push/hour), and throttle bursts through the queue. Delivery tracking: store notification status (queued → sending → delivered / failed) in a status table. Retry failed notifications with exponential backoff. Real-time in-app alerts: use WebSockets or SSE — when a notification is created, push the badge count update instantly to connected clients.",
    whyItMatters:
      "Notification systems appear in almost every design — social apps, e-commerce, SaaS. The architecture pattern (API → queue → per-channel workers) is reusable for any async multi-provider delivery system.",
    diagramNote:
      "Fig. 45.1 — Notification pipeline: a queue decouples ingestion from delivery workers for push, email, and SMS; failed deliveries land in a DLQ.",
    example:
      "When you like someone's Instagram post, a notification is created: Notification Service publishes to a queue → Push Worker calls APNs with the device token → the like notification appears on the recipient's phone. If the user has push disabled in preferences, the worker skips the APNs call. Instagram sends billions of push notifications per day across iOS and Android simultaneously using this fan-out pattern.",
    interviewTip:
      "Structure the answer around: (1) Channels — push (APNs/FCM), email, SMS. (2) Queue per channel — so slow providers don't block fast ones. (3) User preferences — always check opt-out before sending. (4) Deduplication — idempotency key per notification prevents duplicate sends on retry. (5) Rate limiting — max N notifications per user per hour. The interviewer often asks: 'What if APNs is down?' Answer: messages sit in queue, retry with backoff, DLQ after N failures.",
    tags: ["Notifications", "Push Notifications", "APNs", "FCM", "Email", "SMS", "Fan-out", "Idempotency", "Case Study"],
  },
  {
    id: 46,
    section: "Foundation",
    title: "System Design Interview Framework",
    tagline: "The 4-step structure that turns knowledge into a passing interview",
    description:
      "A system design interview is a structured 45-minute problem-solving discussion. One of the biggest mistakes candidates make is jumping straight into architecture diagrams before understanding the problem.\n\nA simple way to approach any system design interview is to follow a 4-step framework.\n\nStep 1: Understand the Problem (5–10 minutes). Before designing anything, ask clarifying questions. Who are the users? What features are required? What scale are we targeting — 1 million or 100 million daily active users? Define both the functional requirements (what the system should do) and non-functional requirements (scale, latency, availability, reliability).\n\nStep 2: Create a High-Level Design (10–15 minutes). Identify the main components of the system, such as clients, APIs, servers, databases, and caches. Walk through the request flow for one or two key features. Focus on the overall architecture and avoid unnecessary complexity at this stage.\n\nStep 3: Deep Dive into Bottlenecks (15–20 minutes). Identify the most challenging part of the design and explore it in detail. Discuss topics such as database scaling, caching strategies, data partitioning, fault tolerance, and performance optimization. For example: \"At this scale, the database becomes a bottleneck, so I would introduce read replicas and shard data by user_id.\"\n\nStep 4: Wrap Up and Discuss Trade-offs (5 minutes). Summarize your design, explain the trade-offs you made, and discuss potential failure scenarios. For example: \"This design prioritizes availability over strict consistency.\" End by mentioning how the system could evolve if given more time or higher scale requirements.\n\nThe goal of a system design interview is not to find the perfect architecture. It is to demonstrate a clear thought process, make reasonable assumptions, identify bottlenecks, and explain the trade-offs behind your decisions.",
    whyItMatters:
      "Interviewers don't grade on whether you design the perfect system — they grade on whether you think like a senior engineer. The framework shows structured thinking, asking the right questions, and knowing where to go deep vs. stay high-level.",
    diagramNote:
      "Fig. 46.1 — System design interview timeline: four phases with common mistakes to avoid at each stage.",
    example:
      "Given 'Design WhatsApp':\n\n1. Understand the Problem — ask about scale (2B users), required features (text, media, group chats), and latency target (under 1 second for message delivery).\n2. High-Level Design — draw the core flow: client → WebSocket server → message database → push notification service.\n3. Deep Dive — focus on message storage. At 100 billion messages per day, a relational database won't scale. Use Cassandra partitioned by conversation_id to handle the write volume and time-series access pattern.\n4. Trade-offs — this design delivers messages at least once. Duplicates are possible but handled by message deduplication on the client side.",
    interviewTip:
      "Practice saying 'Before I start drawing, let me clarify a few things' — this single sentence signals seniority. Never assume scale. Never assume features. Ask: users, scale, read/write ratio, latency requirements. Then restate: 'So I'm designing for 10M DAU, read-heavy, with < 200ms latency for the feed.' This confirmation prevents 30 minutes of work in the wrong direction.",
    tags: ["Interview Framework", "System Design", "Requirements", "High-level Design", "Trade-offs", "Bottlenecks"],
  },

  // ─── INTERVIEW Q&A ADDITIONS ─────────────────────────────────
  {
    id: 47,
    section: "Data Layer",
    title: "ACID vs BASE",
    tagline: "Two opposing consistency models for databases",
    description:
      "ACID and BASE are two different ways databases handle data.\n\n<b>ACID (Focuses on Data Correctness)</b>\n\nACID makes sure your data is always correct and reliable.\n\n• <b>Atomicity</b>: A transaction either completes fully or doesn't happen at all.\n  ↳ Example: When transferring $100 from Account A to Account B, both the debit and credit must happen together. If one fails, everything is rolled back.\n\n• <b>Consistency</b>: Data always stays valid.\n  ↳ Example: If a bank account cannot have a negative balance, the database prevents transactions that would break that rule.\n\n• <b>Isolation</b>: Multiple users can perform transactions at the same time without interfering with each other.\n  ↳ Example: Two people trying to buy the last ticket won't both get it.\n\n• <b>Durability</b>: Once data is saved, it stays saved even if the server crashes.\n  ↳ Example: If you receive a payment confirmation, that payment won't disappear after a restart.\n\nUse ACID when data accuracy is critical, such as:\n• Banking systems\n• Payment processing\n• Inventory management\n• Booking systems\n\n<b>BASE (Focuses on Availability and Speed)</b>\n\nBASE is designed for large distributed systems where keeping the application available is more important than showing the latest data immediately.\n\n• <b>Basically Available</b>: The system keeps working even if some servers fail.\n• <b>Soft State</b>: Different servers may temporarily have different versions of the data.\n• <b>Eventual Consistency</b>: Given enough time, all servers will eventually have the same data.\n\nExample:\nImagine you post a photo on social media. Some users might see the new post immediately, while others might see it a few seconds later. Eventually, everyone sees the same data.\n\nUse BASE when:\n• High availability is important\n• Small delays in data synchronization are acceptable\n• The system serves millions of users\n\nExamples:\n• Social media feeds\n• Analytics dashboards\n• Activity logs\n• Recommendation systems\n\n<b>Simple Rule</b>\n\n• Choose <b>ACID</b> when data correctness is the top priority.\n• Choose <b>BASE</b> when availability and performance are more important than seeing the latest data instantly.",
    whyItMatters:
      "The choice between ACID and BASE affects which database you pick and how your system behaves.\n\nIf you need perfect accuracy, you usually go with databases like PostgreSQL or MySQL (ACID).\nIf you need high speed and can tolerate small delays in syncing data, you use systems like Cassandra, DynamoDB, or CouchDB (BASE).\n\nIf you choose the wrong one:\n• Using BASE when you need accuracy can cause wrong or inconsistent data\n• Using ACID when you need massive scale can make your system slow or hard to scale",
    diagramNote:
      "Fig. 47.1 — ACID enforces strict correctness on every transaction; BASE trades consistency for availability and performance in distributed systems.",
    example:
      "<b>1. Payments system (ACID)</b>\nWhen you send $100 to someone:\n• Money should NOT disappear or get duplicated\n• Either both things happen:\n  ↳ Your account is debited\n  ↳ Their account is credited\n• Or nothing happens at all\n\nWe use PostgreSQL / MySQL here because correctness is critical.\n\n<b>2. Social media feed (BASE)</b>\nWhen someone posts something:\n• Some users might see it instantly\n• Others might see it a few seconds later\n• Eventually everyone sees it\n\nThis is fine because:\n• No money is involved\n• Slight delays don't matter\n\nWe use systems like Cassandra or DynamoDB.",
    interviewTip:
      "\"I'll use an ACID database when data must always be correct, like payments or bookings.\"\n\"I'll use a BASE system when I need to handle large-scale data and can accept small delays, like feeds or logs.\"\n\nACID and BASE are not something you use together — they represent two different design choices.",
    tags: ["ACID", "BASE", "Atomicity", "Consistency", "Eventual Consistency", "PostgreSQL", "Cassandra", "Transactions"],
  },
  {
    id: 48,
    section: "Data Layer",
    title: "Eventual Consistency",
    tagline: "All nodes converge to the same value — given enough time",
    description:
      "Eventual consistency means that in a distributed system (multiple servers), when you update data on one server, the other servers will catch up — but not immediately.\n\nThink of it like this: you like a photo on Instagram. Your friend in another country might not see your like for a second or two. But eventually, everyone sees the same data.\n\n<b>Two types of consistency</b>\n\n• <b>Strong Consistency</b>: Every server shows the same data at the same time. Slower, but always accurate.\n  ↳ Example: You update your bank balance — everyone sees it instantly, everywhere.\n\n• <b>Eventual Consistency</b>: One server gets the update first. Others catch up shortly after. Faster, but briefly out of sync.\n  ↳ Example: You post a tweet — some followers see it immediately, others see it 1–2 seconds later.\n\n<b>How it works (step by step)</b>\n\n1. You write data to Server A\n2. Server A saves it and responds immediately\n3. In the background, Server A sends the update to Server B and Server C\n4. For a brief moment, Server B and C still have old data\n5. Once the update arrives, all servers match\n\n<b>When eventual consistency is okay</b>\n\n• Social media likes and comments\n• Product view counts\n• Activity feeds\n• DNS updates — your domain change can take hours to spread worldwide, but eventually it does\n\n<b>When it is NOT okay</b>\n\n• Bank transfers — you can't show different balances to different users\n• Inventory — you can't sell the same item twice\n• Booking systems — you can't give the same seat to two people\n\n<b>Simple Rule</b>\n\n• Use eventual consistency when small delays are fine and availability matters more\n• Use strong consistency when accuracy is critical and wrong data causes real problems",
    whyItMatters:
      "Most high-scale systems like Instagram, Twitter, and Netflix use eventual consistency because it lets them stay fast and available even when millions of users are active at the same time.\n\nIf every server had to agree before replying, the system would be too slow.\nWith eventual consistency, each server responds immediately and syncs up shortly after.\n\nIf you choose wrong:\n• Using strong consistency everywhere can make your system slow at scale\n• Using eventual consistency where accuracy matters can cause real data problems",
    diagramNote:
      "Fig. 48.1 — Eventual consistency: after a write to one node, replicas receive the update asynchronously; all converge to the same value within milliseconds to seconds.",
    example:
      "<b>1. Social media likes (Eventual Consistency)</b>\nYou like a post on Instagram.\n• Your screen shows the like immediately\n• Your friend on the other side of the world sees it 1–2 seconds later\n• Eventually, all servers show the same count\n\nThis is fine — a small delay in like counts doesn't hurt anyone.\n\n<b>2. DNS updates (Eventual Consistency in real life)</b>\nYou change your website's domain settings.\n• Some users get the new address right away\n• Others still see the old address for a few hours\n• After 24–48 hours, everyone gets the correct address\n\nSmall delays are acceptable here because no money or critical data is involved.",
    interviewTip:
      "\"I'd use eventual consistency here because this is a feed — small delays in syncing are acceptable and we need the system to stay fast and available.\"\n\n\"I would NOT use eventual consistency for payments or bookings — those need to be accurate at all times.\"\n\nBonus: systems like Cassandra let you choose per request — strong consistency for critical reads, eventual consistency for high-volume writes.",
    tags: ["Eventual Consistency", "CAP Theorem", "AP", "Replication Lag", "Cassandra", "DynamoDB", "DNS"],
  },
  {
    id: 49,
    section: "Scaling & Distribution",
    title: "Consistent Hashing",
    tagline: "Add or remove servers without remapping all keys",
    description:
      "Standard hash partitioning maps a key to a shard using: shard = hash(key) % N. When N changes (adding or removing a server), almost every key remaps to a new shard, requiring a massive data migration — impractical for live systems.\n\nConsistent hashing solves this by arranging both servers and keys on a hash ring (an abstract circle from 0 to 2^32 - 1). Each server is placed at a position on the ring by hashing its name or ID. A key is assigned to the first server encountered when moving clockwise around the ring from the key's position.\n\nWhen a server is added, it takes over only the keys between itself and its predecessor on the ring — approximately 1/N of all keys. When a server is removed, its keys are absorbed by its successor — again approximately 1/N. In contrast to standard hashing, the vast majority of keys remain mapped to the same server.\n\nVirtual nodes (vnodes): real servers are typically assigned multiple positions on the ring (100–200 virtual nodes each). This evens out load distribution, since a single physical position can create hot spots when servers are unevenly spaced. Virtual nodes also let larger machines hold more positions, giving them proportionally more keys.\n\nUsed in: Cassandra (partitions data across nodes), DynamoDB (consistent key-to-partition mapping), Memcached, load balancers (session stickiness), CDN edge selection.",
    whyItMatters:
      "Without consistent hashing, scaling a cache cluster by adding one server invalidates all cached data — every key remaps. With consistent hashing, only 1/N of keys move. This is what enables Cassandra and DynamoDB to scale horizontally without full data reshuffling.",
    diagramNote:
      "Fig. 49.1 — Consistent hash ring: servers placed at hash positions; a key maps to the first clockwise server. Adding a server transfers only the keys between it and its predecessor.",
    example:
      "Cassandra uses consistent hashing to partition data. Each node owns a token range on the ring. Adding a 5th node to a 4-node cluster means that new node takes a fraction of one existing node's range — only ~20% of data moves, not 100%. This hot addition does not require taking the cluster offline.",
    interviewTip:
      "Bring up consistent hashing when discussing distributed caches or NoSQL databases: 'I'd use consistent hashing to partition keys across nodes so that adding a node only invalidates 1/N of cached data, not everything.' Mention virtual nodes when asked about uneven load: 'To handle hot spots and weight nodes by capacity, I'd assign each physical server multiple virtual positions on the ring.'",
    tags: ["Consistent Hashing", "Hash Ring", "Virtual Nodes", "Cassandra", "DynamoDB", "Partitioning", "Sharding"],
  },
  {
    id: 50,
    section: "Advanced Topics",
    title: "Bloom Filter",
    tagline: "Tells you definitely NOT in set, probably IN set",
    description:
      "A Bloom filter is a data structure that quickly answers one question: \"Is this item in the set?\"\n\nIt has one unusual property: it can tell you with certainty that something is NOT in the set, but it can only tell you that something probably IS in the set — with a small chance of being wrong.\n\n• `Definitely NOT in set` → 100% accurate — the item was never inserted\n• `Probably IN set` → usually correct, but occasionally a false positive\n\nThere are no false negatives. If something was inserted, the filter will always say it's present.\n\n<b>How it works</b>\n\nA Bloom filter is just a bit array — a large list of 0s and 1s, initially all zeros.\n\n<b>Inserting an item:</b>\n1. Run the item through K different hash functions\n2. Each hash function gives a position in the bit array\n3. Set all K positions to 1\n\n<b>Checking if an item is in the set:</b>\n1. Run the item through the same K hash functions\n2. Check those K positions in the bit array\n3. If any position is 0 → definitely not in the set\n4. If all positions are 1 → probably in the set (could be a coincidence from other inserts)\n\n<b>Why false positives happen</b>\nDifferent items can hash to the same bit positions. When the filter says \"probably present\", it might just be seeing bits that were set by other items.\n\n<b>When to use a Bloom filter</b>\n\n• `Cache layer` — before doing an expensive DB lookup, check the Bloom filter. If it says \"definitely not\", skip the DB query entirely. Saves database load.\n• `Web crawlers` — check if a URL has already been visited before fetching it\n• `Spam filters` — check if an email address is in a blocklist\n• `Database internals` — Google BigTable and Apache Cassandra use Bloom filters to skip reading files that definitely don't contain a key\n\n<b>Why it's space-efficient</b>\n\nStoring 1 billion visited URLs as full strings would require hundreds of gigabytes. A Bloom filter can track the same 1 billion URLs in about 1–2 GB of memory, with a small false positive rate.",
    note:
      "A Bloom filter never has false negatives — if it says something is not present, that's guaranteed. It trades a small false positive rate for massive memory savings.\n\nUse it anywhere you want to avoid expensive lookups for items that definitely don't exist.",
    whyItMatters:
      "Bloom filters eliminate unnecessary expensive lookups. A cache miss that hits the DB for a non-existent key wastes a DB round trip. A Bloom filter intercepts that miss in O(1) time with near-zero memory. Google BigTable, Apache Cassandra, and HBase all use Bloom filters for this exact purpose.",
    diagramNote:
      "Fig. 50.1 — Bloom filter bit array: insert sets K bits; lookup checks K bits — all 1 means probably present, any 0 means definitely absent.",
    example:
      "A web crawler maintains a Bloom filter of all visited URLs. Before fetching a page, it checks the filter. If definitely not visited (any bit is 0), fetch it and add to filter. If probably visited (all bits are 1), skip it. The filter uses 1GB of memory to track 1 billion URLs — storing 1 billion full URL strings would require 100–500GB.",
    interviewTip:
      "Mention Bloom filters when designing caches or crawlers: 'I'd use a Bloom filter in front of the cache to eliminate DB lookups for keys I know don't exist — it never has false negatives, only rare false positives, which just mean an unnecessary DB query, not a wrong result.' Also bring it up when asked about reducing cache misses or avoiding expensive downstream calls.",
    tags: ["Bloom Filter", "Probabilistic", "Membership Test", "False Positive", "Caching", "Web Crawler", "BigTable"],
  },
  {
    id: 51,
    section: "Data Layer",
    title: "Denormalization",
    tagline: "Duplicate data to eliminate joins and speed up reads",
    description:
      "First, understand what <b>Normalization</b> is:\n\nNormalization means storing each piece of data in only one place. Tables are linked together, and you use joins to combine them when reading.\n\nExample — a blog:\n• `users` table stores the author's name\n• `posts` table stores the post content\n• To show a post with the author's name, you JOIN both tables every single time\n\nThis is clean and avoids duplicate data. But joins have a cost — especially when millions of people are reading at the same time.\n\n<b>What is Denormalization?</b>\n\nDenormalization means copying data into multiple places to avoid those joins and make reads faster.\n\nInstead of joining the `users` table every time someone reads a post, you store `author_name` directly in the `posts` table.\n\n• Before (normalized): Read `posts` + JOIN `users` → 2 operations\n• After (denormalized): Read `posts` only → 1 operation, much faster\n\n<b>The trade-offs</b>\n\n• <b>Faster reads</b> — no joins needed, one query does the job\n• <b>More storage</b> — same data is stored in multiple places\n• <b>Harder to update</b> — if an author changes their name, you must update every post they wrote, not just one record\n• <b>Risk of inconsistency</b> — two copies of the same value can get out of sync if not handled carefully\n\n<b>When to use Denormalization</b>\n\n• Reads happen much more than writes (social feeds, product pages, news articles)\n• Read speed is critical for a good user experience\n• The duplicated data rarely changes (author names, category labels, product titles)\n\n<b>When NOT to use it</b>\n\n• Data changes frequently (stock prices, inventory counts)\n• You cannot afford inconsistency between copies",
    note:
      "Denormalization trades storage and write complexity for dramatically faster reads. Use it when read performance is critical and your data is read far more often than it is written.\n\nThe classic signal: a page that runs 6 table joins every time it loads.",
    whyItMatters:
      "As your app grows, joining multiple tables on millions of requests per day becomes slow and expensive.\n\nDenormalization is a deliberate choice to store some data in more than one place so that reading it is instant.\n\nIf you choose wrong:\n• Too much normalization at scale = slow reads and a struggling database\n• Too much denormalization = complicated updates and data that can get out of sync",
    diagramNote:
      "Fig. 51.1 — Normalized schema joins 3 tables to render one post; denormalized schema stores redundant data on one row, eliminating the joins at query time.",
    example:
      "<b>1. Blog post page (Normalized — slower)</b>\nTo show one post, you need to:\n• Read `posts` table (for content)\n• Join `users` table (for author name and photo)\n• Join `categories` table (for topic label)\n\nAt 10 users, this is fine. At 10 million daily readers, these joins slow everything down.\n\n<b>2. Blog post page (Denormalized — faster)</b>\nStore `author_name`, `author_avatar`, and `category_name` directly in the `posts` table.\n• Reading a post = one query, no joins\n• If the author changes their name, a background job updates every post they wrote\n\nThe tradeoff is worth it because posts are read millions of times but author names almost never change.",
    interviewTip:
      "\"I'd denormalize author_name into the posts table to eliminate a join at read time. Reads outnumber writes 100:1 on a feed, so the extra write complexity is worth it.\"\n\nAlways state the trade-off: more storage, harder writes. And mention materialized views as the database-managed way to handle denormalization automatically.",
    tags: ["Denormalization", "Normalization", "Joins", "Materialized View", "Read Performance", "Data Redundancy"],
  },
  {
    id: 52,
    section: "Advanced Topics",
    title: "Service Discovery",
    tagline: "How microservices find each other dynamically",
    description:
      "In a microservices system, services are deployed across dynamic environments — cloud VMs that come and go, containers that restart on different ports, auto-scaling groups that change instance counts. Static IP configuration is impractical. Service discovery automatically detects healthy service instances so clients can find them without hardcoded addresses.\n\nTwo models: Client-side discovery — the client queries a service registry (Consul, Eureka, etcd) to get a list of healthy instances, then chooses one using a load-balancing algorithm. The client has the registry client library embedded. Examples: Netflix Eureka, HashiCorp Consul. Server-side discovery — the client sends a request to a load balancer or API gateway. The gateway queries the registry and forwards the request. The client knows only one stable address (the gateway). Examples: AWS ALB with ECS service discovery, Kubernetes kube-proxy.\n\nService registry: a key-value store where each service registers its name, IP, port, and health status. Services send heartbeats to the registry; if a heartbeat is missed, the registry marks the instance unhealthy and removes it from the list. Registration can be self-registration (service registers itself on startup) or third-party registration (a sidecar or orchestrator handles registration).\n\nHealth checks are integral: liveness (is the process alive?), readiness (is it ready to accept traffic?). Kubernetes native support for both.",
    whyItMatters:
      "Without service discovery, updating a service's IP requires manually reconfiguring all callers — impossible in dynamic cloud environments. Service discovery is the infrastructure that makes microservices work at scale.",
    diagramNote:
      "Fig. 52.1 — Client-side discovery: clients query the registry to get instance list. Server-side discovery: gateway queries registry; client sees only the gateway.",
    example:
      "Netflix runs thousands of microservice instances. Eureka is their service registry. When a new Recommendation Service instance starts, it registers with Eureka. Other services that need recommendations query Eureka and get the current list of healthy Recommendation Service instances. If an instance fails its health check, Eureka removes it — callers never route traffic to dead instances.",
    interviewTip:
      "Include service discovery when designing any microservices architecture: 'Services register their address with a Consul registry on startup and send heartbeats every 10 seconds. Callers query Consul for healthy instances — the client library handles load balancing among them. If a service crashes, Consul removes it within 30 seconds (3 missed heartbeats).' For Kubernetes, say 'Kubernetes DNS and kube-proxy handle service discovery natively via Service objects.'",
    tags: ["Service Discovery", "Consul", "Eureka", "Service Registry", "Health Check", "Microservices", "Kubernetes"],
  },
  {
    id: 53,
    section: "Advanced Topics",
    title: "API Gateway",
    tagline: "Single entry point that handles cross-cutting concerns",
    description:
      "An API Gateway is a reverse proxy that acts as the single entry point for all client requests in a microservices architecture. Instead of clients knowing the address of every microservice, they make all requests to the gateway. The gateway routes each request to the correct service.\n\nCore responsibilities: Routing — /api/users/* → User Service, /api/orders/* → Order Service, /api/products/* → Product Service. Authentication and authorization — validate JWT tokens before forwarding requests; individual services never handle auth. Rate limiting — cap requests per client per minute using token bucket or sliding window algorithms stored in Redis. Request/response transformation — convert request format, add headers, strip sensitive fields from responses. Load balancing — distribute traffic across healthy instances of each service. Logging and tracing — add a correlation ID to every request, log at the gateway, pass the ID to all downstream services. SSL termination — handle HTTPS at the gateway; internal microservice communication runs over plain HTTP.\n\nPopular gateways: AWS API Gateway, Kong, NGINX, Traefik, Envoy. In Kubernetes, an Ingress controller (typically NGINX) serves as the API Gateway.\n\nDifference from load balancer: a load balancer distributes traffic across identical instances of one service. An API Gateway routes traffic across many different services and handles cross-cutting concerns like auth and rate limiting.",
    whyItMatters:
      "Without an API Gateway, every microservice must implement authentication, rate limiting, and logging independently — massive duplication. The gateway centralizes these concerns, so services focus only on business logic.",
    diagramNote:
      "Fig. 53.1 — API Gateway: clients hit one address; the gateway authenticates, rate-limits, and routes to the correct microservice.",
    example:
      "Uber's mobile app makes all API calls to a single gateway endpoint. The gateway validates the driver's JWT, checks rate limits (max 1000 req/min per device), routes /trip/start to the Trip Service, /payment to the Payment Service, and /location to the Location Service. Each backend service receives the request pre-authenticated with the user context injected in a header.",
    interviewTip:
      "In any microservices design, add an API Gateway as the first layer: 'All clients talk to the API Gateway. It handles JWT validation, rate limiting (100 req/sec per user), and routes requests to the appropriate service. Individual services trust the gateway — they never re-validate auth.' This eliminates duplicated auth logic across 20+ services and gives you a single place to enforce policies.",
    tags: ["API Gateway", "Routing", "Authentication", "Rate Limiting", "Microservices", "Kong", "NGINX", "Reverse Proxy"],
  },
  {
    id: 54,
    section: "Reliability",
    title: "Bulkhead Pattern",
    tagline: "Isolate failures so one service can't sink the whole ship",
    description:
      "The bulkhead pattern comes from naval engineering — ships are divided into watertight compartments so that if one floods, the rest stay buoyant. In software, it isolates resources (threads, connection pools, memory) so that a failure or slowdown in one part of the system doesn't exhaust shared resources and take down everything else.\n\nWithout bulkheads: a single thread pool serves all downstream calls (Payment Service, Inventory Service, Email Service). If the Email Service becomes slow and holds threads waiting for responses, all threads fill up. Now requests to the Payment Service also queue, even though the Payment Service is healthy. One slow service takes down all services.\n\nWith bulkheads: each downstream service gets its own dedicated thread pool (or connection pool). The Email Service's pool can fill up completely; Payment Service requests still use their own pool and process normally. Failure blast radius is contained to one bulkhead.\n\nImplementation: in Java (Hystrix, resilience4j), configure a semaphore or thread pool per service dependency. In Go, use goroutine pools with bounded work queues. In microservices, bulkhead often means separate Kubernetes pods, separate databases, or separate message queue consumers per service — so resource starvation in one service can't starve others.\n\nBulkhead + Circuit Breaker: circuit breaker detects failures and stops calling a service. Bulkhead limits the damage while the circuit is still closed (before the breaker trips).",
    whyItMatters:
      "In a microservices system sharing a common thread pool, one slow external dependency can cascade into a full outage. Bulkheads contain the blast radius — only the affected service's pool fills; everything else keeps running.",
    diagramNote:
      "Fig. 54.1 — Without bulkhead: shared thread pool exhausted by slow email service blocks all requests. With bulkhead: per-service pools isolate failures.",
    example:
      "An e-commerce checkout service calls: Payment Service (critical), Inventory Service (critical), Email Service (non-critical), Recommendation Service (optional). Using bulkheads: Payment and Inventory each get 50 threads. Email gets 10. Recommendations gets 5. When the email provider goes down and holds all 10 email threads, checkout still processes payments and inventory updates normally. Without bulkheads, 50 slow email threads could starve Payment Service of capacity.",
    interviewTip:
      "Pair bulkhead with circuit breaker: 'I'd use bulkheads to give each downstream service its own connection pool, so a slow email provider doesn't exhaust the shared pool. I'd combine this with a circuit breaker — after 50% failure rate in 10 seconds, stop calling the email service entirely and queue notifications for later.' Mention that bulkhead answers 'what happens while the circuit is still closed?'",
    tags: ["Bulkhead Pattern", "Thread Pool", "Resource Isolation", "Fault Tolerance", "Resilience", "Circuit Breaker", "Blast Radius"],
  },
  {
    id: 55,
    section: "Advanced Topics",
    title: "Event Sourcing",
    tagline: "Store state changes as events, not current state",
    description:
      "Traditional databases store the current state of data — the last value written. When an order status changes from 'pending' to 'shipped', the row is updated and the history is lost.\n\nEvent sourcing stores every state change as an immutable event in an append-only log. The current state is not stored directly — it is derived by replaying events from the beginning. An order's events: OrderPlaced, PaymentProcessed, OrderPacked, OrderShipped, OrderDelivered. Replaying these events reconstructs the complete order state at any point in time.\n\nBenefits: Complete audit trail — you know exactly what happened, when, and by whom. Temporal queries — replay events up to a specific timestamp to answer 'what was the state at 3pm on Tuesday?' Debugging and root cause analysis — full history of every state change. Event replay — if a downstream service missed events due to downtime, replay from the last processed event. Natural fit for CQRS — the write side appends events; the read side builds projections from those events.\n\nChallenges: Increased storage — storing all events forever grows without bounds (use snapshots: periodically checkpoint current state so replay starts from the snapshot). Event versioning complexity — changing the structure of an event after it has been stored requires migration strategies. Eventual consistency — read-side projections may lag behind the event log.\n\nEvent sourcing is commonly used with Kafka (events stored durably) and CQRS (separate read models built from event streams).",
    whyItMatters:
      "Traditional CRUD databases lose history. Event sourcing makes every change observable and replayable — critical for financial systems, audit trails, compliance, and debugging production incidents where you need to reconstruct what happened.",
    diagramNote:
      "Fig. 55.1 — Event store appends immutable events; current state is a projection derived by replaying events from the log.",
    example:
      "A bank account implemented with event sourcing: events are AccountOpened($1000), MoneyDeposited($500), MoneyWithdrawn($200), MoneyTransferred($300). The current balance is computed by replaying: 1000 + 500 - 200 - 300 = $1000. To audit a dispute: replay events up to the disputed timestamp to see the exact state at that moment. The original transaction can never be modified — only corrective events appended.",
    interviewTip:
      "Propose event sourcing for systems needing audit trails or temporal queries: 'I'd use event sourcing for the payment service — every state change is an immutable event. This gives us a complete audit trail for compliance, lets us replay events to reconstruct state after a bug, and integrates naturally with our Kafka event pipeline.' Always mention snapshots to handle the growing-log problem.",
    tags: ["Event Sourcing", "Immutable Events", "Audit Trail", "Replay", "Temporal Query", "CQRS", "Kafka", "Append-only Log"],
  },
  {
    id: 56,
    section: "Advanced Topics",
    title: "CQRS",
    tagline: "Separate the read model from the write model",
    description:
      "CQRS (Command Query Responsibility Segregation) separates read and write operations into different models. Commands change state (write model). Queries return data (read model). Each is optimized for its purpose independently.\n\nIn a traditional system, the same data model serves both reads and writes. At scale, this creates conflicts: writes need normalized, consistent data with strict constraints. Reads need denormalized, pre-joined, cached data that returns fast. A single model can't be optimal for both.\n\nWith CQRS: the write side handles commands (PlaceOrder, UpdateProfile, PostTweet) and enforces business rules and consistency. It writes to a normalized database optimized for transactions. The read side handles queries and serves from a read-optimized store — a denormalized projection, a cache, or a search index. Separate read models can be built for different consumers (mobile app, admin dashboard, analytics) without affecting the write path.\n\nHow the read model stays in sync: whenever the write side processes a command successfully, it publishes an event (OrderPlaced, ProfileUpdated). The read side subscribes to these events and updates its projections asynchronously. This introduces eventual consistency — the read model may lag by milliseconds.\n\nCQRS + Event Sourcing: the write side stores events; the read side builds projections by consuming those events. Enables rebuilding any read model from scratch by replaying the event log.\n\nWhen to use: complex domains with many read patterns, high read-to-write ratios, need to scale reads and writes independently, teams owning read vs. write paths separately.",
    whyItMatters:
      "When the same database serves 100,000 reads/sec and 1,000 writes/sec, those workloads compete. CQRS decouples them — the read model can be a Redis cache or Elasticsearch index; the write model can be PostgreSQL. Each scales independently.",
    diagramNote:
      "Fig. 56.1 — CQRS: commands go to the write model (normalized DB); events publish to the read model (denormalized projection/cache). Read queries never touch the write DB.",
    example:
      "An e-commerce product catalog: writes go to PostgreSQL (ACID, normalized, inventory constraints). Reads serve from Elasticsearch (full-text search, denormalized product documents with category, price, rating all in one document). When a product price changes, a ProductPriceUpdated event triggers an update to the Elasticsearch document. 99% of traffic is reads — served entirely from Elasticsearch without touching PostgreSQL.",
    interviewTip:
      "Propose CQRS when you have very different read and write patterns: 'I'd use CQRS here — the write model uses PostgreSQL for ACID guarantees on inventory. The read model is a Redis-cached denormalized view updated asynchronously via events. This lets us handle 100K read req/sec without touching the write database.' Always state the consistency trade-off: 'Read model may lag by up to 200ms.'",
    tags: ["CQRS", "Command Query Responsibility Segregation", "Read Model", "Write Model", "Event Sourcing", "Eventual Consistency", "Projection"],
  },
  {
    id: 57,
    section: "Reliability",
    title: "Heartbeat and Health Checks",
    tagline: "How distributed systems detect and recover from failures",
    description:
      "In a distributed system, services can fail silently — a process may crash, a network partition may occur, or a service may become unresponsive without explicitly notifying its callers. Heartbeats and health checks are the mechanisms that detect these silent failures.\n\nA heartbeat is a periodic signal sent by a service to confirm it is alive. The service sends a heartbeat message (usually a lightweight ping) to its service registry or load balancer every N seconds. If the registry misses K consecutive heartbeats, it marks the service as unhealthy and stops routing traffic to it.\n\nHealth checks go deeper than 'is the process alive?'. They verify that the service is functional. Two types: Liveness probe — is the process alive and not deadlocked? If this fails, restart the container. Readiness probe — is the service ready to accept traffic? Checks that all dependencies (database, cache) are reachable. If this fails, remove the instance from the load balancer but don't restart it.\n\nKubernetes implements both probes natively: livenessProbe (restarts the pod on failure), readinessProbe (removes the pod from Service endpoints until healthy).\n\nActive vs passive health checks: active (the load balancer or registry sends synthetic pings to each instance on a schedule), passive (the load balancer monitors real traffic — if N consecutive requests to an instance return 5xx, mark it unhealthy). Active checks catch silent failures faster; passive checks reflect real user traffic.",
    whyItMatters:
      "Without health checks, a load balancer keeps routing traffic to crashed instances — users get errors. Heartbeats and health checks are what enable automatic failover, the foundation of high availability. Zero-downtime deployments depend on readiness probes: new instances only receive traffic once they pass readiness checks.",
    diagramNote:
      "Fig. 57.1 — Heartbeat flow: service pings registry every 10s; 3 missed heartbeats mark it unhealthy; load balancer stops routing traffic to it.",
    example:
      "Kubernetes readiness probe: a pod serving an API starts, but the database connection pool takes 5 seconds to warm up. During warmup, the readiness probe (GET /health/ready) returns 503. Kubernetes keeps the pod out of the Service endpoint list. After 5 seconds, /health/ready returns 200 and Kubernetes adds the pod to the load balancer. Users never hit an unready pod.",
    interviewTip:
      "Always include health checks when designing any service: 'Each service exposes GET /health/live (liveness) and GET /health/ready (readiness). The load balancer polls /health/ready every 10 seconds and removes unhealthy instances. Kubernetes uses the same endpoints for its probes. The liveness endpoint only checks the process is running; readiness checks that the DB connection pool and cache are reachable.' This answer specifically separates candidates who've operated production systems.",
    tags: ["Heartbeat", "Health Check", "Liveness Probe", "Readiness Probe", "Kubernetes", "Load Balancer", "Failover", "High Availability"],
  },
  {
    id: 58,
    section: "Advanced Topics",
    title: "Distributed Tracing",
    tagline: "Follow a request as it flows across every microservice",
    description:
      "In a microservices architecture, a single user request might touch 10–20 services. When the request takes 2 seconds, which service is slow? Distributed tracing answers this question by tracking the entire request flow, capturing latency at every hop.\n\nHow it works: when a request enters the system at the API Gateway, a unique trace ID is generated (e.g., UUID). This trace ID is injected into every outgoing request header (typically X-Trace-ID or using the W3C Trace Context standard). Every service that receives a request creates a span — a record of the operation including start time, end time, service name, and parent span ID. All spans share the trace ID. At the end of the request, all spans are collected and assembled into a trace tree.\n\nThe trace tree shows: which services were called in sequence vs. in parallel, how long each service took, where errors occurred, and what the critical path was (the sequence of spans that determined total latency).\n\nTools: Jaeger (open-source, CNCF), Zipkin (open-source, originally from Twitter), AWS X-Ray (managed), Datadog APM, Honeycomb.\n\nIntegration with logs and metrics: a good observability platform correlates trace ID with logs (filter all logs for a trace ID to see what happened) and metrics (see which service's latency spike caused the trace to be slow).",
    whyItMatters:
      "In a monolith, a slow DB query shows up in a stack trace. In microservices, the slow service is one hop in a chain of 15 — invisible without distributed tracing. Tracing is the tool that makes distributed systems debuggable.",
    diagramNote:
      "Fig. 58.1 — Distributed trace: a single request generates spans across 5 services; the waterfall view shows which service added the most latency.",
    example:
      "A user's checkout takes 3 seconds. Distributed tracing reveals: API Gateway: 5ms, Auth Service: 10ms, Cart Service: 20ms, Inventory Service: 2,800ms, Payment Service: 100ms. The Inventory Service is the bottleneck — its span shows a full table scan with no index. Without tracing, identifying this would require checking logs across 5 services manually.",
    interviewTip:
      "Include distributed tracing in any microservices design: 'I'd use Jaeger for distributed tracing. Every request gets a trace ID at the API Gateway, passed in the X-Trace-ID header. Each service creates spans for its operations and reports to the Jaeger collector. When a request is slow, I can pull up the trace in Jaeger and see the exact service and operation causing latency.' Mention it as part of the observability trio: logs + metrics + traces.",
    tags: ["Distributed Tracing", "Jaeger", "Zipkin", "Span", "Trace ID", "Observability", "Microservices", "Latency"],
  },
  {
    id: 59,
    section: "Reliability",
    title: "Logging vs Metrics vs Tracing",
    tagline: "The three pillars of observability",
    description:
      "Observability is the ability to understand the internal state of a system from its external outputs. The three pillars are logging, metrics, and tracing — each answers a different question.\n\nLogging records discrete events as structured text. Each log entry captures what happened at a specific moment: 'User 123 placed order 456', 'Database query failed with timeout', 'Cache miss for key product:789'. Logs are best for debugging specific errors and auditing events. They are high-cardinality (many unique values) and high-volume. Storage and search is expensive at scale. Tools: ELK Stack (Elasticsearch, Logstash, Kibana), Splunk, Loki.\n\nMetrics are numerical measurements aggregated over time: requests per second, error rate, P99 latency, CPU usage, memory consumption. Metrics are low-cardinality (a small number of distinct values) and cheap to store as time series. Alerts are built on metrics. Dashboards show metrics. Tools: Prometheus (collection and storage), Grafana (visualization).\n\nTracing tracks a request's journey across services (see concept 58). It answers 'where did this specific request spend its time?'. Unlike logs (what happened) or metrics (how many?), tracing answers 'which path did it take?'. Tools: Jaeger, Zipkin, AWS X-Ray.\n\nTogether they form a complete observability picture: metrics show something is wrong (P99 latency spiked), logs explain what is wrong (specific error messages), tracing shows where it's wrong (which service in the chain is slow).",
    whyItMatters:
      "Without all three, you are blind to different failure modes. Metrics catch regressions early. Logs provide the detail to diagnose. Tracing localizes failures in distributed systems. Using only one means slow debugging and undetected issues.",
    diagramNote:
      "Fig. 59.1 — Observability triangle: metrics (Prometheus) detect anomalies, logs (ELK) explain them, traces (Jaeger) localize them in distributed request chains.",
    example:
      "A P99 latency spike is caught by a Prometheus alert (metric: latency > 500ms for 5 minutes). The on-call engineer opens Grafana and sees the spike started at 14:32. They filter Loki logs for ERROR level at 14:32 and find 'InventoryService: connection pool exhausted'. They pull a Jaeger trace from 14:32 and confirm the Inventory Service span is 2.5 seconds — 3 pillars together resolve the incident in 10 minutes instead of hours.",
    interviewTip:
      "When asked about monitoring, name all three pillars and their tools: 'I'd use Prometheus and Grafana for metrics (P99 latency, error rate, RPS), ELK for logs (structured JSON logs with trace ID), and Jaeger for distributed tracing. Alerts fire on metrics breaches — logs and traces are the diagnostic tools you reach for when an alert fires.' This answer signals production experience.",
    tags: ["Logging", "Metrics", "Tracing", "Observability", "Prometheus", "Grafana", "ELK", "Jaeger", "Three Pillars"],
  },
  {
    id: 60,
    section: "Reliability",
    title: "Disaster Recovery and RPO/RTO",
    tagline: "How fast you recover and how much data you can afford to lose",
    description:
      "Disaster recovery (DR) is a business continuity plan for recovering from system failures — hardware failures, data center outages, cyberattacks, or catastrophic data loss. Two key metrics quantify recovery requirements.\n\nRPO (Recovery Point Objective): the maximum acceptable amount of data loss, measured in time. If RPO = 1 hour, the system can recover from a disaster by restoring to a state from up to 1 hour ago — losing at most 1 hour of data. RPO drives backup frequency: if RPO = 15 minutes, backups must run every 15 minutes.\n\nRTO (Recovery Time Objective): the maximum acceptable downtime. If RTO = 4 hours, the system must be fully operational within 4 hours of a disaster being declared. RTO drives your recovery infrastructure investment — faster RTO requires hot standbys and automated failover; slower RTO allows cold backups restored manually.\n\nStrategies (from cheapest/slowest to most expensive/fastest): Backup and Restore — periodic snapshots to object storage (S3); RPO = backup interval, RTO = hours. Pilot Light — critical infrastructure running in a second region at minimal scale; RTO = 10s of minutes. Warm Standby — a scaled-down version of production runs continuously in a DR region; RTO = minutes. Active-Active Multi-Region — production runs in two or more regions simultaneously; RTO = seconds, RPO = seconds. Users automatically rerouted via DNS or load balancer when one region fails.\n\nMost organizations choose a strategy based on cost vs. business impact: a banking system needs near-zero RPO and RTO; a developer tool may tolerate 4-hour RPO and 1-day RTO.",
    whyItMatters:
      "Every system fails eventually. Without a defined RPO and RTO, you don't know if your recovery solution is adequate until disaster strikes. These two metrics quantify the business's risk tolerance and force you to design DR infrastructure that can actually meet the requirements.",
    diagramNote:
      "Fig. 60.1 — RPO defines maximum data loss (backup interval); RTO defines maximum downtime (recovery speed). Multi-region active-active achieves near-zero for both.",
    example:
      "A fintech company's RPO = 0 seconds (no data loss tolerated), RTO = 30 seconds (system must be live within 30 seconds of failure). This requires: synchronous replication to a second region (RPO = 0), automated DNS failover (RTO = 30s). A content blog's RPO = 24 hours (daily backup is fine), RTO = 4 hours (half a day to restore is acceptable). Cost difference: $50K/month vs $500/month.",
    interviewTip:
      "When designing any data-handling system, state RPO and RTO upfront: 'For this payment service, I'll target RPO = 1 minute and RTO = 5 minutes. This means: synchronous replication to a hot standby in a second AZ, automated failover via Route 53 health checks, and point-in-time recovery backups to S3 every minute.' Then justify each component against those targets.",
    tags: ["Disaster Recovery", "RPO", "RTO", "Backup", "Multi-Region", "Failover", "Business Continuity", "High Availability"],
  },
  {
    id: 61,
    section: "Foundation",
    title: "How to Design a Scalable System",
    tagline: "10 key principles for building systems that grow with you",
    description:
      "Scalability is the ability to handle growing load — more users, more data, more requests — without degrading performance or reliability. Every scalable system applies a core set of principles.\n\n(1) Load balance traffic: distribute requests across multiple servers. A single server is both a bottleneck and a single point of failure. Add a load balancer in front of a horizontally scaled server pool.\n\n(2) Cache aggressively: serve frequently accessed data from memory (Redis, Memcached) to avoid repeated database queries. Apply caching at multiple layers: CDN edge, API gateway, application, database query cache.\n\n(3) Shard data: split large datasets across multiple database nodes using consistent hashing or range partitioning. No single database node should hold all data or handle all writes.\n\n(4) Use async processing: decouple slow or non-critical operations using message queues (Kafka, SQS). Order confirmation emails, image resizing, analytics events — none of these need to block the user's request.\n\n(5) Separate concerns with microservices: decompose the application into independent services. Scale only the services that are under load instead of scaling the entire application.\n\n(6) Monitor and alert: use metrics (Prometheus), logs (ELK), and traces (Jaeger) to detect problems before users do. Set P99 latency and error rate alerts.\n\n(7) Plan for failures: assume components will fail. Add circuit breakers, retries with exponential backoff, bulkheads, and replica failover. Design for graceful degradation.\n\n(8) Use CDN for static content: serve images, CSS, JS, and videos from edge servers near users. Reduce origin load by 80–95%.\n\n(9) Optimize databases: use indexes, read replicas, connection pooling, and query optimization before reaching for scaling solutions. Most database problems are query problems.\n\n(10) Document architecture: maintain up-to-date architecture diagrams and runbooks. Systems that aren't documented are systems that can't be operated under pressure.",
    whyItMatters:
      "These 10 principles are the checklist that turns a single-server prototype into a production system capable of serving millions of users. Each principle addresses a specific class of failure at scale — missing any one of them creates a predictable bottleneck.",
    diagramNote:
      "Fig. 61.1 — Scalable system anatomy: load balancer → stateless app servers → cache layer → sharded databases → async queue → CDN for static assets.",
    example:
      "Instagram's early architecture applied all 10 principles: Django app servers behind a load balancer, PostgreSQL sharded by user_id, Redis for feed cache and session storage, Gearman for async photo processing, Akamai CDN for images, Graphite for metrics, HAProxy for load balancing — serving 30 million users with 13 engineers before the Facebook acquisition.",
    interviewTip:
      "Use these 10 principles as a checklist at the end of any system design: 'Let me review against scalability principles: am I load balancing? Yes — ALB. Am I caching? Yes — Redis for hot data. Am I sharding? Yes — user_id hash across 50 shards. Am I using async? Yes — Kafka for notifications and analytics. Do I have monitoring? Yes — Prometheus with P99 alerts.' Walking through this checklist shows systematic thinking.",
    tags: ["Scalability", "Load Balancing", "Caching", "Sharding", "Async", "Microservices", "CDN", "Monitoring", "Best Practices"],
  },
];

export const CONCEPT_COUNT = SYSTEM_DESIGN_CONCEPTS.length;
