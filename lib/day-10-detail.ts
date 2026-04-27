import type { RoadmapDayDetail } from "./challenge-data";

export const DAY_10_DETAIL = {
  overview: [
    "A transaction is a unit of work that is atomic — it either completes fully or not at all. ACID properties define what 'correctly' means at the database level. Isolation levels control how much work in progress one transaction can see from another. Getting these wrong causes bugs that only appear under concurrent load — the hardest class of production incident to diagnose.",
    "Day 10 builds the mental model: ACID guarantees, isolation level anomalies, locking mechanics, and deadlocks. These topics appear in every senior system-design and backend interview.",
  ],
  sections: [
    {
      title: "ACID properties",
      blocks: [
        {
          type: "diagram",
          id: "acid-transaction",
        },
        {
          type: "table",
          caption: "All four must hold for a system to be considered transactionally correct.",
          headers: ["Property", "What it guarantees", "How it is achieved"],
          rows: [
            [
              "Atomicity",
              "All operations in the transaction commit, or none do",
              "Write-ahead log (WAL) — uncommitted changes are rolled back on crash",
            ],
            [
              "Consistency",
              "Every transaction transitions the DB from one valid state to another",
              "Constraints, triggers, and FK checks enforced before commit",
            ],
            [
              "Isolation",
              "Concurrent transactions appear as if they ran serially",
              "Locks (pessimistic) or MVCC (optimistic) prevent interference",
            ],
            [
              "Durability",
              "Committed data survives crashes",
              "WAL flushed to disk (fsync) before ACK is sent to client",
            ],
          ],
        },
      ],
    },
    {
      title: "Isolation levels — anomalies and defences",
      blocks: [
        {
          type: "diagram",
          id: "isolation-levels",
        },
        {
          type: "table",
          caption: "PostgreSQL default is Read Committed. MySQL InnoDB default is Repeatable Read.",
          headers: ["Level", "Dirty read", "Non-repeatable read", "Phantom read", "Use when"],
          rows: [
            [
              "Read Uncommitted",
              "Possible",
              "Possible",
              "Possible",
              "Almost never — not supported in PostgreSQL",
            ],
            [
              "Read Committed",
              "Prevented",
              "Possible",
              "Possible",
              "Default for most OLTP; good enough for most operations",
            ],
            [
              "Repeatable Read",
              "Prevented",
              "Prevented",
              "Possible (prevented in PostgreSQL via MVCC)",
              "Consistent read across multiple queries in same tx (reports)",
            ],
            [
              "Serializable",
              "Prevented",
              "Prevented",
              "Prevented",
              "Financial ledgers, inventory counters, anything needing true serializability",
            ],
          ],
        },
        {
          type: "table",
          caption: "Know the anomaly definitions — interviewers ask for them.",
          headers: ["Anomaly", "Definition", "Example"],
          rows: [
            [
              "Dirty read",
              "Transaction reads uncommitted changes from another",
              "Tx A updates balance to 0. Tx B reads 0. Tx A rolls back. Tx B acted on phantom data.",
            ],
            [
              "Non-repeatable read",
              "Same SELECT returns different data within a single transaction",
              "Tx A reads price=100. Tx B commits price=200. Tx A reads again: 200. Same tx, different result.",
            ],
            [
              "Phantom read",
              "A range query returns different rows within a single transaction",
              "Tx A counts posts WHERE status='draft': 5. Tx B inserts a draft. Tx A counts again: 6.",
            ],
          ],
        },
      ],
    },
    {
      title: "MVCC — how PostgreSQL avoids most locks",
      blocks: [
        {
          type: "paragraph",
          text: "PostgreSQL uses Multi-Version Concurrency Control (MVCC). Every row has hidden xmin (transaction that created it) and xmax (transaction that deleted/updated it) columns. A reader always sees the latest committed version as of its transaction start — no read lock needed. Writers create a new row version rather than overwriting.",
        },
        {
          type: "list",
          variant: "bullet",
          items: [
            "Readers never block writers. Writers never block readers. Only writers on the same row block each other.",
            "VACUUM reclaims dead row versions (old xmax'd rows). Autovacuum runs automatically but can lag on high-write tables.",
            "Transaction ID wraparound: PostgreSQL's 32-bit XID space wraps every ~2 billion transactions. Monitor pg_database.datfrozenxid; run VACUUM FREEZE proactively on old tables.",
          ],
        },
      ],
    },
    {
      title: "Locking — pessimistic vs optimistic",
      blocks: [
        {
          type: "table",
          headers: ["Strategy", "How", "Use when"],
          rows: [
            [
              "Pessimistic (SELECT FOR UPDATE)",
              "Lock the row on read; other readers are blocked until commit",
              "High-contention rows (inventory counters, seat reservations) where conflicts are frequent",
            ],
            [
              "Optimistic (version column / ETag)",
              "Read without lock; on write, check that version hasn't changed; retry on conflict",
              "Low-contention reads with rare conflicts (user profile edits)",
            ],
            [
              "Advisory locks (pg_advisory_lock)",
              "Application-level named locks; not tied to a row",
              "Serializing a background job; distributed mutex without a Redis dependency",
            ],
          ],
        },
        {
          type: "code",
          title: "Pessimistic lock — SELECT FOR UPDATE",
          code: `-- Safe inventory decrement (prevents oversell)
BEGIN;
SELECT quantity FROM inventory WHERE product_id = 42 FOR UPDATE;
-- Other transactions block here until we COMMIT or ROLLBACK

UPDATE inventory SET quantity = quantity - 1 WHERE product_id = 42 AND quantity > 0;
COMMIT;`,
        },
        {
          type: "code",
          title: "Optimistic concurrency — version column",
          code: `-- Read
SELECT id, balance, version FROM accounts WHERE id = 7;
-- { id: 7, balance: 1000, version: 5 }

-- Write (in application code)
const result = await db.query(
  "UPDATE accounts SET balance = $1, version = version + 1 WHERE id = $2 AND version = $3",
  [newBalance, 7, 5]
);
if (result.rowCount === 0) throw new ConflictError("stale version — retry");`,
        },
      ],
    },
    {
      title: "Deadlocks — detection and prevention",
      blocks: [
        {
          type: "diagram",
          id: "deadlock-cycle",
        },
        {
          type: "paragraph",
          text: "A deadlock occurs when two transactions each hold a lock the other needs, and both wait indefinitely. PostgreSQL detects cycles automatically and rolls back one transaction (the victim) with error code 40P01. Your application must catch this and retry.",
        },
        {
          type: "list",
          variant: "bullet",
          items: [
            "Prevent deadlocks by always acquiring locks in a consistent order across transactions (e.g. always lock the lower account ID first in a funds transfer).",
            "Keep transactions short — the longer a transaction holds locks, the more likely a deadlock.",
            "Use SELECT FOR UPDATE SKIP LOCKED for job queues — workers skip locked rows instead of waiting.",
            "Monitor pg_locks and pg_stat_activity for long-held locks in production.",
          ],
        },
        {
          type: "code",
          title: "Deadlock-safe funds transfer — consistent lock order",
          code: `async function transfer(fromId: number, toId: number, amount: number) {
  // Always lock lower ID first to prevent deadlock cycles
  const [first, second] = fromId < toId ? [fromId, toId] : [toId, fromId];

  await db.transaction(async (trx) => {
    const [a, b] = await trx.raw(
      "SELECT id, balance FROM accounts WHERE id = ANY(?) ORDER BY id FOR UPDATE",
      [[first, second]]
    );
    if (a.balance < amount) throw new Error("Insufficient funds");
    await trx("accounts").where("id", fromId).decrement("balance", amount);
    await trx("accounts").where("id", toId).increment("balance", amount);
  });
}`,
        },
      ],
    },
    {
      title: "Transaction anti-patterns",
      blocks: [
        {
          type: "table",
          headers: ["Anti-pattern", "Problem", "Fix"],
          rows: [
            [
              "Long transactions",
              "Hold locks for seconds; block other writers; MVCC bloat",
              "Keep transactions short — read outside the transaction, write inside",
            ],
            [
              "Transaction per HTTP request blindly",
              "Slow routes hold transactions for the full request duration",
              "Wrap only the DB writes in a transaction, not the whole handler",
            ],
            [
              "N+1 inside a transaction",
              "Many queries hold locks longer than necessary",
              "Batch queries; use JOINs; load all data before starting the write transaction",
            ],
            [
              "Catching and ignoring DB errors",
              "Swallowing 40P01 (deadlock) leaves the caller with stale state",
              "Always propagate deadlock / serialization errors; implement retry with backoff",
            ],
          ],
        },
      ],
    },
    {
      title: "Savepoints — partial rollback",
      blocks: [
        {
          type: "code",
          title: "Savepoint usage (PostgreSQL)",
          code: `BEGIN;
  INSERT INTO orders (user_id, total) VALUES (1, 99.00);
  SAVEPOINT before_items;

  -- This may fail (e.g., product out of stock)
  INSERT INTO order_items (order_id, product_id, qty) VALUES (1, 42, 100);

  -- On failure, roll back only to savepoint, not the whole transaction
  ROLLBACK TO SAVEPOINT before_items;

  -- Try a different product or quantity
  INSERT INTO order_items (order_id, product_id, qty) VALUES (1, 43, 1);
COMMIT;`,
        },
      ],
    },
  ],
  faq: [
    {
      question: "What does ACID mean and which property is hardest to achieve?",
      tag: "ACID",
      answer: [
        "Atomicity: all or nothing. Consistency: constraints hold after every transaction. Isolation: concurrent transactions appear serial. Durability: committed data survives crashes.",
        "Isolation is the hardest. Full serializability is expensive — most databases default to Read Committed which allows non-repeatable reads. Getting isolation right under concurrency requires understanding MVCC, locking, and anomaly trade-offs.",
      ].join("\n\n"),
      callout: "D is cheapest (WAL + fsync). I is most nuanced. Know all four cold.",
    },
    {
      question: "What is a non-repeatable read and why does Read Committed allow it?",
      tag: "Isolation anomalies",
      answer: [
        "A non-repeatable read happens when a transaction reads the same row twice and gets different values because another transaction committed a change between the two reads. Read Committed prevents dirty reads (uncommitted data) but not non-repeatable reads — each statement in the transaction sees the latest committed snapshot.",
        "To prevent it, use Repeatable Read or Serializable. In PostgreSQL, Repeatable Read takes a snapshot at transaction start and all queries in the transaction see that consistent snapshot.",
      ].join("\n\n"),
    },
    {
      question: "How does MVCC work in PostgreSQL?",
      tag: "MVCC",
      answer: [
        "Each row version has hidden xmin (transaction ID that created it) and xmax (transaction ID that deleted it). When a reader runs a SELECT, PostgreSQL determines which row versions are visible based on its transaction snapshot — versions committed before the transaction started are visible; uncommitted or later versions are not.",
        "Writers create a new row version rather than overwriting the existing one. This means readers never wait for writers and writers never wait for readers — only writers trying to modify the same row block each other.",
      ].join("\n\n"),
    },
    {
      question: "When should I use SELECT FOR UPDATE?",
      tag: "Locking",
      answer: [
        "Use SELECT FOR UPDATE when you read a value and then make a decision that must be based on that value being unchanged at write time — the classic check-then-act pattern. Examples: decrementing inventory before confirming a purchase, claiming a job from a queue.",
        "Without FOR UPDATE, two concurrent transactions could both read quantity=1, both decide to allow the purchase, and both decrement — resulting in quantity=-1 (oversell). FOR UPDATE serializes the two transactions on that row.",
      ].join("\n\n"),
      callout: "Read-check-write sequences without FOR UPDATE are race conditions.",
    },
    {
      question: "How do you prevent deadlocks in a funds transfer?",
      tag: "Deadlocks",
      answer: [
        "The classic deadlock in a transfer: Tx A locks account 1 then tries to lock account 2; Tx B has locked account 2 and tries to lock account 1. Neither can proceed.",
        "Prevention: always acquire locks in a consistent global order — e.g., always lock the account with the lower ID first. Since both transactions follow the same order, neither can create a cycle. This turns a potential deadlock into a predictable wait.",
      ].join("\n\n"),
    },
    {
      question: "What is the difference between optimistic and pessimistic locking?",
      tag: "Locking strategies",
      answer: [
        "Pessimistic locking acquires a lock on read and holds it until commit. No other writer can modify the row in the meantime. Best when conflicts are frequent and the cost of retrying is high.",
        "Optimistic locking reads without a lock, increments a version counter on write, and fails if the version has changed since the read. Best when conflicts are rare — most writes succeed, occasional conflicts are retried. Adds a version column to the table and a conditional UPDATE.",
      ].join("\n\n"),
    },
    {
      question: "What is Serializable Snapshot Isolation (SSI)?",
      tag: "Serializability",
      answer: [
        "SSI is PostgreSQL's implementation of the Serializable isolation level using MVCC extended with conflict tracking. It detects read-write dependency cycles that would produce a non-serializable result and rolls back one transaction in the cycle.",
        "Unlike lock-based serializability (which blocks concurrent reads), SSI allows high concurrency and only aborts when an actual serialization anomaly would occur. The tradeoff is a retry requirement — you must catch serialization failure (40001) and retry the transaction.",
      ].join("\n\n"),
    },
    {
      question: "Why should you keep transactions short?",
      tag: "Transaction design",
      answer: [
        "Long transactions hold row locks (for SELECT FOR UPDATE) and accumulate dead row versions (MVCC bloat). If autovacuum cannot keep up with dead tuple accumulation, queries slow down. In extreme cases, transaction ID wraparound becomes a risk.",
        "Best practice: do all reads outside the transaction, compute the new state in application code, then open a transaction only for the write operations. This keeps the lock window in the microseconds-to-milliseconds range rather than seconds.",
      ].join("\n\n"),
    },
  ],
  bullets: [
    "Write a test that demonstrates a dirty read at Read Uncommitted and shows it is prevented at Read Committed (use two concurrent connections).",
    "Implement optimistic concurrency in a REST handler: read version, update with WHERE version = ?, return 409 on conflict.",
    "Create a deadlock in a local PostgreSQL instance, observe the error code 40P01, and implement the consistent-lock-order fix.",
  ],
} satisfies RoadmapDayDetail;
