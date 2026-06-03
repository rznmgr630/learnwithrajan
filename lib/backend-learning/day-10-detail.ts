import type { RoadmapDayDetail } from "../challenge-data";

export const DAY_10_DETAIL = {
  overview: [
    "A transaction is a unit of work that either completes fully or does not happen at all. ACID properties define what 'correctly' means at the database level. Isolation levels control how much one transaction can see of another's in-progress work. Getting this wrong causes bugs that only show up under concurrent load — one of the hardest kinds of production incident to debug.",
    "Today covers what ACID means in practice, the isolation level trade-offs, how PostgreSQL uses MVCC to avoid most locking, and how to prevent deadlocks.",
  ],
  sections: [
    {
      title: "Watch",
      blocks: [
        { type: "youtube", videoId: "LoxO-P7hhUQ", title: "SQL Transactions and ACID Properties" },
      ],
    },
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
          text: "PostgreSQL uses Multi-Version Concurrency Control (MVCC). Every row has hidden system columns that track which transaction created it and which one deleted or updated it. When you read a row, PostgreSQL shows you the latest version that was committed before your transaction started — without needing to lock the row. Writers create a new row version instead of overwriting the existing one.",
        },
        {
          type: "list",
          variant: "bullet",
          items: [
            "Readers never block writers and writers never block readers. Only two writers trying to modify the same row at the same time block each other.",
            "VACUUM cleans up old row versions that are no longer needed. Autovacuum runs automatically but can fall behind on heavily-written tables.",
            "PostgreSQL's transaction ID space wraps around every ~2 billion transactions. Monitor pg_database.datfrozenxid and run VACUUM FREEZE on old tables proactively to stay safe.",
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
          text: "A deadlock happens when two transactions each hold a lock that the other one needs, and both are waiting. PostgreSQL detects this automatically and cancels one of them with error code 40P01. Your application needs to catch this and retry.",
        },
        {
          type: "list",
          variant: "bullet",
          items: [
            "Prevent deadlocks by always acquiring locks in the same order across all transactions — for example, always lock the account with the lower ID first in a funds transfer.",
            "Keep transactions short — the longer a transaction holds locks, the more likely a deadlock.",
            "Use SELECT FOR UPDATE SKIP LOCKED for job queues — workers skip rows already locked by another worker instead of waiting.",
            "In production, check pg_locks and pg_stat_activity to find long-held locks.",
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
        "Atomicity: everything in the transaction succeeds or nothing does. Consistency: constraints always hold — the database transitions from one valid state to another. Isolation: concurrent transactions do not interfere with each other. Durability: once committed, the data survives a crash.",
        "Isolation is the hardest to get right. Full serializability is expensive — most databases default to Read Committed which allows some anomalies. Understanding MVCC, locking, and the trade-offs at each isolation level is what separates a solid backend engineer from someone who just writes queries.",
      ].join("\n\n"),
      callout: "D is cheapest (WAL + fsync). I is most nuanced. Know all four cold.",
    },
    {
      question: "What is a non-repeatable read and why does Read Committed allow it?",
      tag: "Isolation anomalies",
      answer: [
        "A non-repeatable read happens when you read the same row twice in one transaction and get different values because another transaction committed a change in between. Read Committed prevents dirty reads (seeing uncommitted data) but not non-repeatable reads — each statement sees the latest committed data.",
        "To prevent non-repeatable reads, use Repeatable Read or Serializable isolation. In PostgreSQL, Repeatable Read takes a snapshot at transaction start and all queries in the transaction see that consistent snapshot.",
      ].join("\n\n"),
    },
    {
      question: "How does MVCC work in PostgreSQL?",
      tag: "MVCC",
      answer: [
        "Every row version has two hidden fields: xmin (the transaction that created it) and xmax (the transaction that deleted or updated it). When you run a SELECT, PostgreSQL checks which row versions were committed before your transaction started and shows you those — newer or uncommitted versions are invisible.",
        "Writers create new row versions instead of overwriting old ones. This means readers and writers do not block each other — only two writers trying to modify the same row at the same time block each other.",
      ].join("\n\n"),
    },
    {
      question: "When should I use SELECT FOR UPDATE?",
      tag: "Locking",
      answer: [
        "Use SELECT FOR UPDATE when you read a value and then make a decision that depends on that value not changing before you write. The classic example: decrementing inventory before confirming a purchase.",
        "Without FOR UPDATE, two concurrent transactions could both read quantity=1, both decide to allow the purchase, and both decrement — ending up at quantity=-1 (oversell). SELECT FOR UPDATE makes them wait for each other so only one proceeds at a time.",
      ].join("\n\n"),
      callout: "Read-check-write sequences without FOR UPDATE are race conditions.",
    },
    {
      question: "How do you prevent deadlocks in a funds transfer?",
      tag: "Deadlocks",
      answer: [
        "The classic deadlock in a transfer: Transaction A locks account 1, then tries to lock account 2. Transaction B has already locked account 2 and is trying to lock account 1. Neither can proceed.",
        "Prevention: always acquire locks in a consistent global order — for example, always lock the account with the lower ID first. Since both transactions follow the same order, one simply waits for the other instead of creating a deadlock cycle.",
      ].join("\n\n"),
    },
    {
      question: "What is the difference between optimistic and pessimistic locking?",
      tag: "Locking strategies",
      answer: [
        "Pessimistic locking grabs a lock on the row when you read it and holds it until you commit. No one else can modify that row in the meantime. Best when conflicts are frequent and retrying is expensive.",
        "Optimistic locking reads without a lock, then checks if the data changed when you try to write (using a version number). If it changed, the write fails and you retry. Best when conflicts are rare — most writes succeed and occasional retries are acceptable.",
      ].join("\n\n"),
    },
    {
      question: "What is Serializable Snapshot Isolation (SSI)?",
      tag: "Serializability",
      answer: [
        "SSI is PostgreSQL's implementation of the Serializable isolation level using MVCC with extra conflict tracking. It detects when concurrent transactions have a read-write dependency cycle that would produce a non-serializable result, and cancels one of them.",
        "Unlike lock-based serializability (which blocks concurrent reads), SSI allows high concurrency and only aborts when an actual conflict would occur. The trade-off is that you must handle serialization failure (40001) and retry the transaction.",
      ].join("\n\n"),
    },
    {
      question: "Why should you keep transactions short?",
      tag: "Transaction design",
      answer: [
        "Long transactions hold row locks and pile up dead row versions (MVCC bloat). If autovacuum cannot keep up, queries slow down over time. In extreme cases, transaction ID wraparound becomes a risk.",
        "Best practice: do all your reads before opening the transaction, compute the new state in application code, then open a transaction only for the writes. This keeps the lock window down to milliseconds instead of seconds.",
      ].join("\n\n"),
    },
  ],
  bullets: [
    "Write a test that shows a dirty read under Read Uncommitted and confirms it is prevented under Read Committed (use two concurrent database connections).",
    "Implement optimistic concurrency in a REST handler: read version, update with WHERE version = ?, return 409 on conflict.",
    "Trigger a deadlock in a local PostgreSQL instance, observe error code 40P01, and implement the consistent-lock-order fix.",
  ],
} satisfies RoadmapDayDetail;
