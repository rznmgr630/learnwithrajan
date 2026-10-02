import type { LessonDay } from "@/lib/learn/lesson-types";

export const PAGINATION_DAY_47_LESSONS: LessonDay = {
  day: 47,
  title: "Pagination",
  totalMinutes: 100,
  difficulty: "Advanced",
  lessons: [
    {
      id: "day-47-lesson-1",
      title: "Offset Pagination",
      durationMinutes: 25,
      explanation: `
<b>Imagine you are building an e-commerce product catalog.</b> A customer opens your online store, and the product listing page tries to show every single product at once. If your store has 50 products, that works fine. But what happens when you have 50,000 products? Or 5 million? The browser freezes. The API response becomes huge. The database has to scan and return massive amounts of data. Nobody wants to scroll through 5 million products in one page.

This is the exact problem pagination solves. <b>Pagination is the technique of splitting a large list of data into smaller, manageable chunks called "pages."</b> Instead of returning everything at once, your API returns a small slice, and the client asks for the next slice when needed.

Think of it like a phone book. You do not read the entire phone book at once. You flip to one page, find what you need, and if it is not there, you flip to the next page. The book contains thousands of entries, but you only look at a small portion at a time.

<b>Offset pagination is the simplest and most common form of pagination.</b> It works by telling the database: "Skip the first N records and give me the next M records." The "skip" number is called the <b>offset</b>, and the "give me" number is called the <b>limit</b> (sometimes called "take" in TypeORM or "page size" in general conversation).

In SQL, offset pagination looks like this:

\`\`\`sql
SELECT * FROM products ORDER BY id LIMIT 10 OFFSET 0;   -- Page 1 (items 1-10)
SELECT * FROM products ORDER BY id LIMIT 10 OFFSET 10;  -- Page 2 (items 11-20)
SELECT * FROM products ORDER BY id LIMIT 10 OFFSET 20;  -- Page 3 (items 21-30)
\`\`\`

Each page shows 10 products. To get to page N (starting from page 1), the offset is \`(N - 1) * limit\`. So page 5 with a limit of 10 has an offset of 40.

<b>Why does offset pagination exist?</b> Because it is intuitive. Every user understands "page 1, page 2, page 3." Every UI framework supports it. You can tell a user "there are 500 results across 50 pages," and they can jump directly to page 37 if they want. This is exactly how Google search results work — you click a page number and jump straight to it.

<b>When should you use offset pagination?</b>
- When the total count matters to the user (e.g., "500 results found")
- When users need to jump to a specific page (e.g., "show me page 37")
- When the dataset is small or medium-sized (thousands to low millions)
- When the data does not change frequently between page requests

<b>When should you NOT use offset pagination?</b>
- When the dataset is very large (tens of millions of rows). The database still has to scan through all the skipped rows, which becomes slow.
- When data is frequently inserted or deleted (rows shift between requests, causing items to be skipped or duplicated).
- When you need infinite scroll or "load more" behavior (cursor pagination is better here).

<b>Here is where beginners usually get confused.</b> They think that OFFSET 1000000 is just as fast as OFFSET 0. It is not. PostgreSQL has to physically walk through the first 1,000,000 rows, discard them, and then return the next 10. That is a lot of wasted work. We will dig into this performance problem in lesson 3.

Let us look at a concrete NestJS example using TypeORM:

<b>BEGINNER level:</b> The simplest possible offset pagination.

\`\`\`typescript
// A basic repository call with offset pagination
async findAll(page: number, limit: number) {
  return this.productRepository.find({
    skip: (page - 1) * limit,  // How many rows to skip
    take: limit,                // How many rows to return
    order: { id: 'ASC' },       // ALWAYS order before paginating
  });
}
\`\`\`

<b>Important:</b> You must always include an \`order\` clause. Without it, the database does not guarantee which rows appear on which page. If you paginate without ordering, the same product might appear on page 1 and page 3, while another product never appears at all.

<b>INTERMEDIATE level:</b> Returning both the data and the total count so the UI can show "Page 3 of 50".

\`\`\`typescript
async findAll(page: number, limit: number) {
  const [items, total] = await this.productRepository.findAndCount({
    skip: (page - 1) * limit,
    take: limit,
    order: { createdAt: 'DESC' },
  });

  return {
    items,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  };
}
\`\`\`

<b>Notice the \`findAndCount\` method.</b> It runs two queries in the background: one to get the actual rows (\`LIMIT / OFFSET\`), and one to count the total (\`SELECT COUNT(*)\`). This is why offset pagination has a cost: even to show page 1, the database must count every single row in the table so you can display "500 results."

<b>ADVANCED level:</b> Production concerns with offset pagination.

In a real e-commerce application, you would:
1. <b>Validate the inputs.</b> If a malicious client sends \`limit=1000000\`, your server would try to return a million rows in one request and crash. Always cap the limit.
2. <b>Add indexes.</b> The \`ORDER BY\` column should be indexed, otherwise every query does a full table scan.
3. <b>Avoid \`findAndCount\` on huge tables.</b> The \`COUNT(*)\` query can take seconds on a 100-million-row table. Consider caching the count or showing "many results" instead.
4. <b>Watch for consistency issues.</b> If a new product is inserted between page 1 and page 2 requests, all items shift down by one, and the user will see one product twice.

Here is a production-style example with validation and safe defaults:

\`\`\`typescript
export class PaginationDto {
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @IsOptional()
  page: number = 1;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)  // Never let clients request more than 100 items at once
  @IsOptional()
  limit: number = 20;
}

async findAll(dto: PaginationDto) {
  const { page, limit } = dto;
  const skip = (page - 1) * limit;

  const [items, total] = await this.productRepository.findAndCount({
    skip,
    take: limit,
    order: { createdAt: 'DESC' },
  });

  return {
    items,
    meta: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      hasNextPage: page * limit < total,
      hasPreviousPage: page > 1,
    },
  };
}
\`\`\`

<b>What can go wrong if offset pagination is used incorrectly?</b>
- <b>No ORDER BY:</b> Results are non-deterministic. Users see duplicates and missing items.
- <b>Unbounded limit:</b> A single request can pull millions of rows and crash the server.
- <b>Deep offsets:</b> \`OFFSET 5000000\` becomes extremely slow because PostgreSQL must scan and discard five million rows.
- <b>COUNT(*) on every request:</b> Doubles the query cost and can dominate response time on large tables.
- <b>Ignoring data changes:</b> Between page requests, new rows can shift the entire dataset, causing skipped or duplicated items.

Offset pagination is perfect for admin dashboards, product catalogs, and any list where the user wants to see "page X of Y" and jump around. It is not the right tool for infinite scroll on a Twitter-like feed with millions of posts. That is where cursor pagination comes in — which is exactly what we will look at next.
      `,
      diagram: `
Offset Pagination (LIMIT / OFFSET)

Client request: page=3, limit=10
        |
        v
  Compute: skip = (3-1) * 10 = 20
        |
        v
+---------------------------+
|   PostgreSQL products     |
|  ---------------------    |
|  Row 1   (skip)           |
|  Row 2   (skip)           |
|  ...                      |
|  Row 20  (skip)           |
|  Row 21  <-- RETURN       |
|  Row 22  <-- RETURN       |
|  ...                      |
|  Row 30  <-- RETURN       |
+---------------------------+
        |
        v
  [20 items skipped, 10 returned]
        |
        v
  Response: { items: [...10], total: 500, page: 3 }

Cost: DB must scan the first 20 rows just to discard them.
Deep pages (page 50000) = very expensive.
      `,
      codeExample: { title: "Example", code: `
// ============================================
// OFFSET PAGINATION — BEGINNER TO ADVANCED
// ============================================

// ---------- BEGINNER ----------
// The smallest possible offset pagination.
async findAllSimple(page: number, limit: number) {
  return this.productRepository.find({
    skip: (page - 1) * limit,
    take: limit,
    order: { id: 'ASC' }, // MUST order, otherwise results are random
  });
}

// ---------- INTERMEDIATE ----------
// Return items + metadata for the UI.

// pagination.dto.ts
import { Type } from 'class-transformer';
import { IsInt, IsOptional, Max, Min } from 'class-validator';

export class PaginationDto {
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @IsOptional()
  page: number = 1;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100) // Hard cap: no client can request more than 100 at once
  @IsOptional()
  limit: number = 20;
}

// products.service.ts
async findAll(dto: PaginationDto) {
  const { page, limit } = dto;
  const skip = (page - 1) * limit;

  const [items, total] = await this.productRepository.findAndCount({
    skip,
    take: limit,
    order: { createdAt: 'DESC' },
  });

  return {
    items,
    meta: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      hasNextPage: page * limit < total,
      hasPreviousPage: page > 1,
    },
  };
}

// ---------- ADVANCED (PRODUCTION) ----------
// Cached total count to avoid running COUNT(*) on every request.

// products.service.ts
import { Injectable, Inject } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @Inject(CACHE_MANAGER)
    private readonly cache: Cache,
  ) {}

  async findAll(dto: PaginationDto) {
    const { page, limit } = dto;
    const skip = (page - 1) * limit;

    // Cache the total count for 60 seconds.
    // COUNT(*) on a huge table is expensive and changes slowly.
    let total = await this.cache.get<number>('products:total');
    if (total === undefined || total === null) {
      total = await this.productRepository.count();
      await this.cache.set('products:total', total, 60_000);
    }

    // We still use findAndCount here for simplicity, but in a real
    // production system you would split the two queries so the count
    // is served from cache.
    const items = await this.productRepository.find({
      skip,
      take: limit,
      order: { createdAt: 'DESC' },
      // Only select fields the client actually needs.
      select: ['id', 'name', 'price', 'thumbnail'],
    });

    return {
      items,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }
}
      ` },
      keyTakeaways: [
        "Offset pagination uses `LIMIT` and `OFFSET` to skip N rows and return M rows.",
        "Always include an `ORDER BY` clause — without it, page results are non-deterministic.",
        "`skip = (page - 1) * limit` is the standard formula for calculating offset.",
        "Cap the `limit` value (e.g. max 100) to prevent a single request from pulling millions of rows.",
        "`COUNT(*)` on large tables is expensive — cache it or skip it if the UI can work without it.",
        "Offset pagination shines when the UI needs 'Page X of Y' navigation and jump-to-page.",
        "Deep offsets (e.g. `OFFSET 1000000`) are slow because the database scans and discards every skipped row.",
      ],
      commonMistakes: [
        "<b>Forgetting the ORDER BY clause.</b> Without it, PostgreSQL can return rows in any order. Page 1 and page 2 might both contain the same product, while another product never shows up.",
        "<b>Not capping the limit.</b> If a client sends `limit=999999`, your server will attempt to load nearly a million rows into memory, causing slow responses or crashes. Always use `@Max(100)` or similar.",
        "<b>Running `COUNT(*)` on every request against a huge table.</b> This doubles the work and can take seconds. Cache the count, or drop it in favor of 'has more?' style responses.",
        "<b>Assuming OFFSET is O(1).</b> It is not. `OFFSET 5000000` forces the database to scan 5 million rows and throw them away. Deep pages get progressively slower.",
        "<b>Ignoring data changes between page requests.</b> If a user is on page 1 and a new item is inserted at the top, page 2 will show the last item of page 1 again. This is called the 'shifting page' problem.",
      ],
      quiz: [
        {
          question:
            "You are building an admin dashboard that lists orders. The UI shows 'Page 3 of 47' and lets users jump to any page. Which pagination style fits best?",
          options: [
            "Cursor pagination, because it is always faster.",
            "Offset pagination, because the UI needs total page count and jump-to-page.",
            "No pagination, just return everything.",
            "Random sampling.",
          ],
          correctIndex: 1,
          explanation:
            "Offset pagination is the natural fit when the UI needs 'Page X of Y' and jump-to-page. Cursor pagination cannot easily tell you the total count or let you jump to an arbitrary page number.",
        },
        {
          question:
            "Your product table has 80 million rows. A client requests `?page=500000&limit=20`. What is the main problem?",
          options: [
            "The query will fail with a syntax error.",
            "PostgreSQL must scan and discard 10 million rows before returning the 20 requested rows, making the query extremely slow.",
            "It will return too many rows.",
            "It will return the wrong rows.",
          ],
          correctIndex: 1,
          explanation:
            "OFFSET does not jump directly to a row. The database walks through every skipped row and discards it. Deep offsets are the classic performance killer for offset pagination.",
        },
        {
          question:
            "Why is it important to cap the `limit` value on the server side?",
          options: [
            "Because TypeScript requires it.",
            "Because without a cap, a malicious or buggy client could request millions of rows in one call, overwhelming the database and server memory.",
            "Because the database rejects limits above 10.",
            "Because the UI cannot display more than 100 items.",
          ],
          correctIndex: 1,
          explanation:
            "A limit cap (e.g. `@Max(100)`) protects the server from abusive or accidental large requests. It is a form of defensive programming and resource protection.",
        },
        {
          question:
            "What happens if you paginate without an `ORDER BY` clause?",
          options: [
            "The database throws an error.",
            "The database automatically orders by primary key.",
            "The order of rows is not guaranteed, so pages can contain duplicates or miss items entirely.",
            "Pagination becomes faster.",
          ],
          correctIndex: 2,
          explanation:
            "SQL does not guarantee row order without an explicit ORDER BY. Pages may overlap or skip rows because the underlying order can change between queries.",
        },
      ],
    },
    {
      id: "day-47-lesson-2",
      title: "Cursor and Keyset Pagination",
      durationMinutes: 30,
      explanation: `
<b>Imagine you are building the Twitter/X-style feed.</b> Millions of users post every second. A user opens the app and sees the latest 20 posts. They scroll down, and the app loads 20 more. And then 20 more. This is called <b>infinite scroll</b>, and if you try to implement it with offset pagination, you will run into two big problems:

<b>Problem 1: Speed.</b> When the user has scrolled to the 10,000th post, the offset is 199,980. PostgreSQL must scan and discard 199,980 rows every single time. The feed becomes sluggish.

<b>Problem 2: Shifting data.</b> New posts are being inserted constantly at the top. Between page 1 and page 2 requests, 50 new posts might appear. Now the offset for page 2 is off by 50, and the user sees 50 posts twice.

<b>Cursor pagination (also called keyset pagination) fixes both problems.</b> Instead of saying "skip the first N rows," it says "give me rows that come after this specific row." That specific row is identified by a <b>cursor</b> — a value that points to a position in the ordered list.

Think of it like reading a book with a bookmark. With offset pagination, you are counting pages from the beginning every time you want to continue reading. With cursor pagination, you just put a bookmark where you stopped and continue from there. No counting, no rescanning.

<b>How does it work internally?</b> The database uses an index on the ordering column (usually \`created_at\` or \`id\`). Instead of scanning from row 0, it does an index seek directly to the cursor position and reads forward. This makes it <b>O(log n) instead of O(n)</b> — dramatically faster for deep pages.

Here is the SQL comparison:

\`\`\`sql
-- Offset: slow at deep pages, skips rows by counting
SELECT * FROM posts ORDER BY created_at DESC LIMIT 20 OFFSET 100000;

-- Cursor (keyset): fast at any depth, seeks directly to cursor
SELECT * FROM posts
WHERE created_at < '2024-05-01T10:00:00Z'  -- the cursor value
ORDER BY created_at DESC
LIMIT 20;
\`\`\`

<b>What exactly is a cursor?</b> It is just a value (or a set of values) that uniquely identifies a row and its position in the sort order. Usually the cursor is:
- The \`id\` of the last row on the previous page (if sorting by id)
- The \`created_at\` timestamp of the last row (if sorting by date)
- A combination like \`(created_at, id)\` when \`created_at\` is not unique (many posts can share a timestamp)

The combination approach is important. If two posts have the exact same \`created_at\`, then \`WHERE created_at < X\` would skip or duplicate one. Using \`(created_at, id) < (X, Y)\` handles ties correctly.

<b>Why does cursor pagination exist?</b>
- It is fast at any depth (page 1 and page 1,000,000 cost the same).
- It is stable when data changes (new rows do not shift the position of already-seen rows).
- It works naturally with infinite scroll and "load more" buttons.

<b>When should you use cursor pagination?</b>
- Infinite scroll feeds (Twitter, Instagram, Reddit).
- Any API where users do not need to jump to a specific page number.
- Very large datasets (tens of millions of rows and up).
- Real-time data where new rows are constantly being inserted.

<b>When should you NOT use cursor pagination?</b>
- When the UI needs "Page X of Y" navigation with a total count.
- When users need to jump to an arbitrary page (e.g. "go to page 47").
- When the sort order is unstable or user-configurable in complex ways.
- When you need random access — cursor pagination only goes forward or backward from a known position.

<b>Here is where beginners usually get confused:</b> they think the cursor must be an opaque, encrypted string. It does not have to be. The cursor is just a value the server tells the client to use on the next request. It can be as simple as the last item's ID. In public APIs, some developers encode it as base64 to signal "this is an opaque token, do not construct it yourself." That is a design choice, not a technical requirement.

Let us look at the levels.

<b>BEGINNER level:</b> The simplest cursor pagination using the id column.

\`\`\`typescript
async getFeed(cursor?: number, limit: number = 20) {
  return this.postRepository.find({
    where: cursor ? { id: LessThan(cursor) } : {},
    order: { id: 'DESC' },
    take: limit,
  });
}
\`\`\`

The client sends \`?cursor=1234&limit=20\`. The server returns posts with id less than 1234, ordered newest first. The response includes the id of the last returned post, which becomes the next cursor.

<b>INTERMEDIATE level:</b> Using \`(created_at, id)\` as a compound cursor to handle ties correctly.

\`\`\`typescript
async getFeed(cursor?: { createdAt: Date; id: number }, limit = 20) {
  const qb = this.postRepository.createQueryBuilder('post');

  if (cursor) {
    // Compound comparison: either createdAt is older, OR
    // createdAt is the same but id is smaller (tie-breaker).
    qb.where(
      '(post.createdAt, post.id) < (:createdAt, :id)',
      { createdAt: cursor.createdAt, id: cursor.id },
    );
  }

  const items = await qb
    .orderBy('post.createdAt', 'DESC')
    .addOrderBy('post.id', 'DESC')
    .take(limit)
    .getMany();

  const nextCursor = items.length
    ? { createdAt: items[items.length - 1].createdAt, id: items[items.length - 1].id }
    : null;

  return { items, nextCursor };
}
\`\`\`

<b>ADVANCED level:</b> A production-ready cursor pagination with an opaque base64 cursor, proper indexes, and both forward and backward navigation.

\`\`\`typescript
// Cursor payload — this is what the client sees (base64-encoded).
interface CursorPayload {
  createdAt: string; // ISO string
  id: number;
  direction: 'forward' | 'backward';
}

@Injectable()
export class FeedService {
  constructor(
    @InjectRepository(Post)
    private readonly postRepository: Repository<Post>,
  ) {}

  private encodeCursor(payload: CursorPayload): string {
    return Buffer.from(JSON.stringify(payload)).toString('base64url');
  }

  private decodeCursor(cursor: string): CursorPayload {
    try {
      return JSON.parse(Buffer.from(cursor, 'base64url').toString('utf-8'));
    } catch {
      throw new BadRequestException('Invalid cursor');
    }
  }

  async getFeed(rawCursor?: string, limit: number = 20) {
    // Cap limit to protect the server.
    limit = Math.min(limit, 100);

    const qb = this.postRepository.createQueryBuilder('post');

    if (rawCursor) {
      const cursor = this.decodeCursor(rawCursor);

      if (cursor.direction === 'forward') {
        // Fetch items older than the cursor (next page).
        qb.where(
          '(post.createdAt, post.id) < (:createdAt, :id)',
          { createdAt: cursor.createdAt, id: cursor.id },
        );
      } else {
        // Fetch items newer than the cursor (previous page).
        qb.where(
          '(post.createdAt, post.id) > (:createdAt, :id)',
          { createdAt: cursor.createdAt, id: cursor.id },
        );
      }
    }

    // Fetch limit + 1 so we can detect whether there is a next page.
    const rows = await qb
      .orderBy('post.createdAt', 'DESC')
      .addOrderBy('post.id', 'DESC')
      .take(limit + 1)
      .getMany();

    const hasMore = rows.length > limit;
    const items = hasMore ? rows.slice(0, limit) : rows;

    const nextCursor = hasMore
      ? this.encodeCursor({
          createdAt: items[items.length - 1].createdAt.toISOString(),
          id: items[items.length - 1].id,
          direction: 'forward',
        })
      : null;

    const prevCursor = items.length
      ? this.encodeCursor({
          createdAt: items[0].createdAt.toISOString(),
          id: items[0].id,
          direction: 'backward',
        })
      : null;

    return { items, nextCursor, prevCursor };
  }
}
\`\`\`

<b>Why fetch limit + 1?</b> Because this trick tells you whether there is another page without running a separate COUNT query. If you asked for 20 and got 21 back, you know there is at least one more. Then you return only 20 and set the next cursor. This is a common production pattern that avoids an expensive COUNT.

<b>Critical requirement: the database index.</b> Cursor pagination is only fast if there is a proper index on the sort columns. For the example above you need:

\`\`\`sql
CREATE INDEX idx_posts_created_at_id ON posts (created_at DESC, id DESC);
\`\`\`

Without this index, PostgreSQL will still scan the entire table — defeating the purpose.

<b>What can go wrong?</b>
- <b>Unstable sort order:</b> If you sort by a column that can change (e.g. \`updated_at\`), a row might move between pages and be skipped or duplicated. Sort by immutable columns like \`created_at\` and \`id\`.
- <b>Non-unique cursor:</b> If you only use \`created_at\` and two rows share the same timestamp, one might be skipped. Always add a tie-breaker like \`id\`.
- <b>Missing index:</b> Without an index on \`(created_at, id)\`, performance degrades to full table scans.
- <b>Client constructs cursor:</b> If you expose raw cursor values, clients may try to construct their own and get unexpected results. Encoding as base64 signals "opaque token."

Cursor pagination is the right tool for infinite scroll and large datasets. It gives up the ability to jump to arbitrary pages in exchange for speed and stability. Choose it when your users scroll forward more than they jump around.
      `,
      diagram: `
Cursor (Keyset) Pagination

Request 1: GET /feed?limit=20
        |
        v
  SELECT ... ORDER BY created_at DESC, id DESC LIMIT 21
        |
        v
  Returns 20 posts + nextCursor (base64 of last row's created_at + id)
        |
        v
Client stores nextCursor

Request 2: GET /feed?limit=20&cursor=<base64>
        |
        v
  SELECT ... WHERE (created_at, id) < (:createdAt, :id)
             ORDER BY created_at DESC, id DESC LIMIT 21
        |
        v
  Returns next 20 posts + a new nextCursor
        |
        v
Repeat until nextCursor is null

Index requirement:
  posts (created_at DESC, id DESC)

Cost: constant, regardless of page depth.
No OFFSET, no skipping. Straight to the position.
      `,
      codeExample: { title: "Example", code: `
// ============================================
// CURSOR PAGINATION — BEGINNER TO ADVANCED
// ============================================

// ---------- BEGINNER ----------
// Simplest form: use the primary key as cursor.
async getFeedSimple(cursor?: number, limit = 20) {
  return this.postRepository.find({
    where: cursor ? { id: LessThan(cursor) } : {},
    order: { id: 'DESC' },
    take: limit,
  });
}

// ---------- INTERMEDIATE ----------
// Compound cursor (createdAt + id) to handle duplicate timestamps.

// feed.service.ts
async getFeed(cursor?: { createdAt: Date; id: number }, limit = 20) {
  const qb = this.postRepository.createQueryBuilder('post');

  if (cursor) {
    qb.where(
      '(post.createdAt, post.id) < (:createdAt, :id)',
      { createdAt: cursor.createdAt, id: cursor.id },
    );
  }

  const items = await qb
    .orderBy('post.createdAt', 'DESC')
    .addOrderBy('post.id', 'DESC')
    .take(limit)
    .getMany();

  const nextCursor = items.length
    ? { createdAt: items[items.length - 1].createdAt, id: items[items.length - 1].id }
    : null;

  return { items, nextCursor };
}

// ---------- ADVANCED (PRODUCTION) ----------
// Opaque base64 cursor + forward/backward + limit+1 trick to avoid COUNT.

interface CursorPayload {
  createdAt: string;
  id: number;
  direction: 'forward' | 'backward';
}

@Injectable()
export class FeedService {
  constructor(
    @InjectRepository(Post)
    private readonly postRepository: Repository<Post>,
  ) {}

  private encodeCursor(payload: CursorPayload): string {
    return Buffer.from(JSON.stringify(payload)).toString('base64url');
  }

  private decodeCursor(cursor: string): CursorPayload {
    try {
      return JSON.parse(Buffer.from(cursor, 'base64url').toString('utf-8'));
    } catch {
      throw new BadRequestException('Invalid cursor');
    }
  }

  async getFeed(rawCursor?: string, limit = 20) {
    limit = Math.min(limit, 100);

    const qb = this.postRepository.createQueryBuilder('post');

    if (rawCursor) {
      const cursor = this.decodeCursor(rawCursor);
      const op = cursor.direction === 'forward' ? '<' : '>';
      qb.where(
        \`(post.createdAt, post.id) \${op} (:createdAt, :id)\`,
        { createdAt: cursor.createdAt, id: cursor.id },
      );
    }

    const rows = await qb
      .orderBy('post.createdAt', 'DESC')
      .addOrderBy('post.id', 'DESC')
      .take(limit + 1)
      .getMany();

    const hasMore = rows.length > limit;
    const items = hasMore ? rows.slice(0, limit) : rows;

    const nextCursor = hasMore
      ? this.encodeCursor({
          createdAt: items[items.length - 1].createdAt.toISOString(),
          id: items[items.length - 1].id,
          direction: 'forward',
        })
      : null;

    const prevCursor = items.length
      ? this.encodeCursor({
          createdAt: items[0].createdAt.toISOString(),
          id: items[0].id,
          direction: 'backward',
        })
      : null;

    return { items, nextCursor, prevCursor };
  }
}

// Required index (TypeORM migration):
// CREATE INDEX idx_posts_created_at_id
//   ON posts (created_at DESC, id DESC);
      ` },
      keyTakeaways: [
        "Cursor pagination uses a bookmark-like value to fetch the next set of rows instead of skipping N rows.",
        "It is O(log n) at any depth, so page 1 and page 1,000,000 cost the same.",
        "Cursors should be based on immutable, unique-ordered columns like `(created_at, id)`.",
        "Always add a tie-breaker (usually `id`) when the sort column is not unique.",
        "An index on the sort columns is mandatory, otherwise performance collapses to full table scans.",
        "The `limit + 1` trick detects whether a next page exists without running `COUNT(*)`.",
        "Encoding cursors as base64 signals to clients that the cursor is an opaque token they should not construct themselves.",
      ],
      commonMistakes: [
        "<b>Sorting by a mutable column.</b> If you paginate by `updated_at`, a row whose timestamp changes can move between pages, causing it to be skipped or duplicated.",
        "<b>Using only `created_at` as the cursor.</b> Two rows with the same timestamp break the comparison. Always include a unique tie-breaker like `id`.",
        "<b>Forgetting the database index.</b> Cursor pagination without an index on `(created_at, id)` is no faster than offset pagination. The index is what makes the seek fast.",
        "<b>Exposing raw cursor values.</b> Clients may try to build their own cursors, leading to inconsistent behavior. Encode them as opaque strings.",
        "<b>Not capping the limit.</b> Even cursor pagination can be abused with `limit=1000000`. Always cap the page size on the server side.",
      ],
      quiz: [
        {
          question:
            "You are building an infinite-scroll feed for a social app with 50 million posts. Which pagination style is the best fit?",
          options: [
            "Offset pagination, because it shows total pages.",
            "Cursor pagination, because it stays fast at any depth and remains stable when new posts are inserted.",
            "No pagination, just load everything.",
            "Random sampling.",
          ],
          correctIndex: 1,
          explanation:
            "Cursor pagination is designed for infinite scroll and large datasets. It uses an index seek to jump directly to the last-seen position, so page depth does not affect performance. Offset pagination would become slower and slower.",
        },
        {
          question:
            "Why is `(created_at, id)` a better cursor than just `created_at`?",
          options: [
            "Because `id` is faster to query.",
            "Because multiple rows can share the same `created_at`, and without a tie-breaker one of them could be skipped or duplicated across pages.",
            "Because `created_at` is not indexed.",
            "Because `id` is always unique and `created_at` is not.",
          ],
          correctIndex: 1,
          explanation:
            "If two rows have the same timestamp, `WHERE created_at < X` cannot distinguish between them. Adding `id` as a tie-breaker makes the sort order strictly deterministic, so no row is skipped or duplicated.",
        },
        {
          question:
            "You fetch `LIMIT 21` when the client asked for 20. Why?",
          options: [
            "To slow down the request on purpose.",
            "Because the database requires it.",
            "To detect whether a next page exists without running a separate `COUNT(*)` query.",
            "Because 21 is a magic number.",
          ],
          correctIndex: 2,
          explanation:
            "The `limit + 1` trick lets you check if there are more rows by seeing if you got one extra. If you did, there is a next page. Then you slice off the extra row and return only `limit` items. This avoids the expensive `COUNT(*)`.",
        },
        {
          question:
            "Which of these is a valid reason NOT to use cursor pagination?",
          options: [
            "The UI needs to show 'Page 5 of 47' and let users jump to page 30.",
            "The dataset is huge.",
            "New rows are inserted frequently.",
            "The data needs to be sorted by `created_at`.",
          ],
          correctIndex: 0,
          explanation:
            "Cursor pagination cannot easily show total page count or let users jump to an arbitrary page. If your UI needs 'Page X of Y' navigation, offset pagination is usually the better fit.",
        },
      ],
    },
    {
      id: "day-47-lesson-3",
      title: "Pagination Performance and API Design",
      durationMinutes: 25,
      explanation: `
<b>Imagine you are the engineer on call when the production database suddenly pegs at 100% CPU.</b> Your biggest endpoint — the product listing — is timing out. You check the query logs and see this over and over:

\`\`\`sql
SELECT * FROM products ORDER BY created_at DESC LIMIT 20 OFFSET 980000;
SELECT COUNT(*) FROM products;
\`\`\`

There is your problem. Deep offset pagination plus an unconditional \`COUNT(*)\` on a table with 12 million rows. Each request scans nearly a million rows twice. When 200 users do this simultaneously, the database falls over.

This lesson is about making pagination <b>fast, predictable, and safe</b> in production — and about designing the API around it so clients use it correctly.

<b>Performance problem 1: Deep offsets.</b> As we discussed, \`OFFSET N\` forces the database to scan N rows and throw them away. This is O(N) per request. On a table with millions of rows, deep pages become unusably slow. <b>Fix:</b> cap the maximum offset, switch to cursor pagination, or use "keyset" fallback for deep pages. For example, you could allow offset pagination up to page 100 and switch to cursor pagination beyond that. This gives users jump-to-page for the first 2,000 items (which covers 99% of real usage) without the deep offset penalty.

<b>Performance problem 2: COUNT(*) on every request.</b> The query \`SELECT COUNT(*) FROM products\` has to scan an entire index (or the whole table) to count rows. On a 12-million-row table this can take 500ms–2s. Doing it on every page request doubles your query cost and often dominates response time. <b>Fix:</b> cache the count, or skip it. Options:
- Cache the count for 30–60 seconds.
- Show "10,000+" instead of an exact count when the number is very large.
- Use "has more?" (via limit+1) instead of a total count for infinite scroll.
- Use an approximate count from \`pg_class.reltuples\` when an estimate is good enough.

<b>Performance problem 3: Missing indexes.</b> If your \`ORDER BY\` column is not indexed, PostgreSQL must sort the entire table on every request. With an index, it can read rows in order directly. <b>Fix:</b> create the index that matches your \`WHERE\`, \`ORDER BY\`, and pagination columns together.

For example, if your feed always does:
\`\`\`sql
SELECT * FROM posts
WHERE author_id = 42
ORDER BY created_at DESC, id DESC
LIMIT 20;
\`\`\`

Then the correct index is:
\`\`\`sql
CREATE INDEX idx_posts_author_created_id
  ON posts (author_id, created_at DESC, id DESC);
\`\`\`

The column order matters. The equality filter (\`author_id\`) comes first, then the sort columns.

<b>Performance problem 4: Selecting more than you need.</b> \`SELECT *\` pulls every column, including large text fields, JSON blobs, and binary data. The database transfers more bytes, and the Node process holds more memory. <b>Fix:</b> select only what the list view needs. Detail pages can fetch the rest.

\`\`\`typescript
this.productRepository.find({
  select: ['id', 'name', 'price', 'thumbnail'], // list view fields only
  skip,
  take: limit,
  order: { createdAt: 'DESC' },
});
\`\`\`

<b>Performance problem 5: Serialization cost.</b> Returning 10,000 items from the API means NestJS has to serialize 10,000 objects to JSON and the client has to parse them. Even if the database returns quickly, the Node event loop will choke. <b>Fix:</b> cap page size. 100 items per page is a common upper bound. For most UIs, 20–50 is plenty.

<b>Now let us talk about API design.</b> Pagination is not just a database concern — it is an API contract. The way you design the request and response shapes affects every client that uses your API forever. Here are the patterns that work.

<b>Pattern 1: Query parameters vs body.</b> Use query parameters for \`GET\` endpoints. It is the HTTP convention, it works with caching, and it is easy to share URLs.

\`\`\`
GET /products?page=2&limit=20
GET /feed?cursor=eyJjcmVhdGVkQXQiOi...&limit=20
\`\`\`

Never use \`POST\` for pagination just to sneak pagination into a request body.

<b>Pattern 2: A consistent response envelope.</b> Clients (and future you) will thank you for returning pagination metadata in a predictable structure:

\`\`\`json
{
  "items": [ ... ],
  "meta": {
    "page": 2,
    "limit": 20,
    "total": 483,
    "totalPages": 25,
    "hasNextPage": true,
    "hasPreviousPage": true
  }
}
\`\`\`

For cursor-based endpoints, the envelope changes slightly:

\`\`\`json
{
  "items": [ ... ],
  "meta": {
    "limit": 20,
    "nextCursor": "eyJjcmVhdGVkQXQiOi...",
    "prevCursor": "eyJjcmVhdGVkQXQiOi...",
    "hasMore": true
  }
}
\`\`\`

Whichever style you choose, use it everywhere. Consistency across endpoints is worth more than cleverness in any single endpoint.

<b>Pattern 3: Sensible defaults and hard caps.</b> Set \`limit = 20\` as the default. Set \`MAX_LIMIT = 100\` as the hard cap. If a client sends \`limit=5000\`, either reject the request with a 400 error or silently clamp it to 100. Both are acceptable; pick one and document it.

<b>Pattern 4: Validation.</b> Never trust \`page\` and \`limit\` as numbers directly from the query string. They arrive as strings. Convert them, validate them, and reject invalid values. NestJS \`ValidationPipe\` plus \`class-validator\` handles this cleanly.

\`\`\`typescript
export class PaginationDto {
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @IsOptional()
  page: number = 1;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  @IsOptional()
  limit: number = 20;
}
\`\`\`

<b>Pattern 5: Links (optional but powerful).</b> Some APIs return hypermedia-style links so clients do not have to construct URLs:

\`\`\`json
{
  "items": [ ... ],
  "links": {
    "self": "/products?page=2&limit=20",
    "first": "/products?page=1&limit=20",
    "prev": "/products?page=1&limit=20",
    "next": "/products?page=3&limit=20",
    "last": "/products?page=25&limit=20"
  }
}
\`\`\`

This is nice but optional. Many teams skip it for simplicity.

<b>Pattern 6: Document your pagination style.</b> Cursor and offset pagination cannot be mixed arbitrarily on the same endpoint. Pick one style per resource and document it. If you ever need to change it, version the endpoint.

<b>What can go wrong in production?</b>
- <b>Underestimated scale:</b> A query that takes 5ms with 10,000 rows can take 5 seconds with 10 million.
- <b>Uncapped limits:</b> A single client requesting \`limit=1000000\` can OOM your Node process.
- <b>COUNT on every request:</b> Multiplies database load and often becomes the slowest part of the response.
- <b>Wrong index order:</b> An index on \`(created_at, author_id)\` does not help a query filtered by \`author_id\` and ordered by \`created_at\`. Order matters.
- <b>N+1 queries inside pagination:</b> Fetching 20 items then doing a separate query for each item's author is 21 queries. Use a join or \`relations\` option.
- <b>No monitoring:</b> Slow pagination queries do not show up until they break. Log slow queries and set alerts on p99 latency.

<b>How experienced engineers think about this:</b> pagination is a first-class API concern, not an afterthought. Decide the pagination style before you write the endpoint. Decide the response envelope before the frontend integrates. Decide the index before the table gets its first million rows. Changing any of these later is expensive.

Real-world sizing rule of thumb:
- Under 100K rows: offset pagination is fine, COUNT is fast, index still matters.
- 100K–10M rows: offset pagination still works but COUNT should be cached. Consider cursor for feeds.
- Over 10M rows: cursor pagination for anything with infinite scroll. Offset pagination only for admin tools with shallow pages. COUNT should be approximate or omitted.
      `,
      diagram: `
Pagination Performance Decision Tree

  How many rows?
       |
       +-- < 100K
       |     |
       |     v
       |   Offset pagination OK
       |   COUNT(*) OK
       |   Index still required
       |
       +-- 100K - 10M
       |     |
       |     v
       |   Offset pagination + cached COUNT
       |   OR cursor pagination for feeds
       |   Index mandatory
       |
       +-- > 10M
             |
             v
           Cursor pagination for feeds / scroll
           Offset only for admin (shallow pages)
           Approximate or no COUNT
           Index mandatory, correct column order

Index design rule:
  (WHERE column, ORDER BY column, tie-breaker)
  e.g. (author_id, created_at DESC, id DESC)

Response envelope (offset):
  { items, meta: { page, limit, total, totalPages } }

Response envelope (cursor):
  { items, meta: { limit, nextCursor, prevCursor, hasMore } }
      `,
      codeExample: { title: "Example", code: `
// ============================================
// PAGINATION PERFORMANCE & API DESIGN
// ============================================

// ---------- 1. Safe validation DTO ----------
import { Type } from 'class-transformer';
import { IsInt, IsOptional, Max, Min } from 'class-validator';

export class PaginationDto {
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @IsOptional()
  page: number = 1;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100) // hard cap
  @IsOptional()
  limit: number = 20;
}

// ---------- 2. Consistent response envelope ----------
export interface PaginatedResponse<T> {
  items: T[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
}

// ---------- 3. Cached COUNT + selective fields ----------
@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @Inject(CACHE_MANAGER) private readonly cache: Cache,
  ) {}

  async findAll(dto: PaginationDto): Promise<PaginatedResponse<Product>> {
    const { page, limit } = dto;
    const skip = (page - 1) * limit;

    // Cache the COUNT for 60 seconds to avoid hammering the DB.
    let total = await this.cache.get<number>('products:total');
    if (total == null) {
      total = await this.productRepository.count();
      await this.cache.set('products:total', total, 60_000);
    }

    const items = await this.productRepository.find({
      select: ['id', 'name', 'price', 'thumbnail'], // list-view fields only
      skip,
      take: limit,
      order: { createdAt: 'DESC', id: 'DESC' },
    });

    return {
      items,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        hasNextPage: page * limit < total,
        hasPreviousPage: page > 1,
      },
    };
  }
}

// ---------- 4. Cursor response envelope ----------
export interface CursorPaginatedResponse<T> {
  items: T[];
  meta: {
    limit: number;
    nextCursor: string | null;
    prevCursor: string | null;
    hasMore: boolean;
  };
}

// ---------- 5. Correct index for a filtered feed ----------
// TypeORM migration:
// CREATE INDEX idx_posts_author_created_id
//   ON posts (author_id, created_at DESC, id DESC);

// ---------- 6. Hybrid strategy: offset for shallow, cursor for deep ----------
async findProducts(
  page: number,
  limit: number,
  cursor?: string,
): Promise<PaginatedResponse<Product> | CursorPaginatedResponse<Product>> {
  const MAX_OFFSET_PAGE = 100;

  if (page > MAX_OFFSET_PAGE || cursor) {
    // Deep page: switch to cursor-based fetch.
    // (Implementation would mirror the cursor pattern from lesson 2.)
    return this.findByCursor(cursor, limit);
  }

  // Shallow page: offset pagination with cached count.
  return this.findAll({ page, limit });
}

// ---------- 7. Slow-query logging (production safety net) ----------
async findAllWithLogging(dto: PaginationDto) {
  const start = Date.now();
  const result = await this.findAll(dto);
  const duration = Date.now() - start;

  if (duration > 200) {
    // In production, send this to your logging/monitoring system.
    console.warn(
      \`Slow pagination query: page=\${dto.page} limit=\${dto.limit} took \${duration}ms\`,
    );
  }

  return result;
}
      ` },
      keyTakeaways: [
        "Deep offsets are O(N). Cap the maximum offset or switch to cursor pagination beyond a threshold.",
        "`COUNT(*)` on large tables is expensive — cache it, approximate it, or skip it entirely.",
        "Index the exact combination of `WHERE` columns followed by `ORDER BY` columns and a tie-breaker.",
        "Select only the fields the list view needs, not `SELECT *`.",
        "Cap the page size (e.g. `@Max(100)`) to protect the Node process and the database.",
        "Use a consistent response envelope across every paginated endpoint.",
        "Log slow pagination queries so you notice performance regressions before users do.",
      ],
      commonMistakes: [
        "<b>Uncapped `limit`.</b> One client requesting `limit=1000000` can allocate gigabytes of memory and crash the server.",
        "<b>Running `COUNT(*)` on every request.</b> On a 12-million-row table this can take seconds. Cache it or replace it with 'has more?' logic.",
        "<b>Wrong index column order.</b> An index on `(created_at, author_id)` does not help a query that filters by `author_id` and orders by `created_at`. The equality filter must come first.",
        "<b>N+1 queries inside the paginated list.</b> Fetching 20 items and then one query per item's author is 21 queries instead of one. Use `relations` or a join.",
        "<b>Inconsistent response shapes.</b> If one endpoint returns `{ data, total }` and another returns `{ items, count }`, every client has to special-case each endpoint.",
        "<b>No slow-query monitoring.</b> Pagination performance degrades silently as data grows. Without logging and alerts, the first sign of trouble is a production outage.",
      ],
      quiz: [
        {
          question:
            "Why is `SELECT COUNT(*) FROM products` on every page request a problem in production?",
          options: [
            "Because SQL does not allow COUNT inside pagination.",
            "Because COUNT forces the database to scan an entire index or table every time, which can take seconds on large tables and doubles the cost of every request.",
            "Because COUNT is deprecated.",
            "Because the client cannot parse it.",
          ],
          correctIndex: 1,
          explanation:
            "COUNT(*) is not free. On a 12-million-row table it can take hundreds of milliseconds to seconds. Doing it on every page request multiplies the database load and often dominates response time. Cache it or approximate it.",
        },
        {
          question:
            "You have a query: `WHERE author_id = 42 ORDER BY created_at DESC, id DESC LIMIT 20`. Which index serves it best?",
          options: [
            "`(created_at DESC, id DESC, author_id)`",
            "`(id)` only",
            "`(author_id, created_at DESC, id DESC)`",
            "`(created_at DESC)` only",
          ],
          correctIndex: 2,
          explanation:
            "Put the equality filter column first, then the ORDER BY columns in the same order, then the tie-breaker. This allows PostgreSQL to seek directly to author 42 and read the rows in the requested order without sorting.",
        },
        {
          question:
            "A client sends `?page=1&limit=5000`. What is the safest server-side response?",
          options: [
            "Return 5000 items to keep the client happy.",
            "Ignore the limit and return everything.",
            "Reject with 400, or silently clamp the limit to the maximum allowed (e.g. 100) — but never actually return 5000 items.",
            "Crash with an unhandled error.",
          ],
          correctIndex: 2,
          explanation:
            "Always enforce a hard cap. Either reject the request with a validation error or clamp the limit to the maximum. Returning 5000 items risks OOM and slows the event loop for every other request.",
        },
        {
          question:
            "Your team wants to change the pagination style of an existing public endpoint from offset to cursor. What is the safest approach?",
          options: [
            "Just change it — clients will adapt.",
            "Version the endpoint (e.g. `/v2/products`) so existing clients keep working while new clients use the new style.",
            "Return both styles mixed in the same response.",
            "Remove pagination entirely.",
          ],
          correctIndex: 1,
          explanation:
            "Changing pagination style is a breaking change for clients. Version the endpoint so existing integrations keep working. Introducing cursor pagination as a new version is the standard approach.",
        },
      ],
    },
    {
      id: "day-47-lesson-4",
      title: "Pagination in NestJS",
      durationMinutes: 20,
      explanation: `
<b>Now we bring it all together.</b> You have seen offset pagination, cursor pagination, and the performance and API design considerations behind them. In this final lesson, we will build a complete, production-style pagination setup in NestJS — with modules, controllers, DTOs, services, and repositories each doing their job.

<b>The NestJS architecture we are aiming for:</b>

\`\`\`
Client
  |
  v
Controller  <- receives query params, validates via DTO
  |
  v
Service     <- business logic, decides offset vs cursor
  |
  v
Repository  <- talks to PostgreSQL with LIMIT/OFFSET or keyset
  |
  v
PostgreSQL  <- the actual data, using indexes
\`\`\`

Each layer has a clear responsibility:
- <b>Controller:</b> Parse HTTP input, hand validated data to the service, return the response. No business logic.
- <b>DTO:</b> Declare the shape and validation rules for the query parameters. This is where the limit cap lives.
- <b>Service:</b> Orchestrate the pagination logic, decide on caching, build the response envelope.
- <b>Repository:</b> Execute the query with the correct \`WHERE\`, \`ORDER BY\`, \`LIMIT\`, and \`OFFSET\` or cursor comparison.

<b>Why this separation matters:</b> if the DB schema changes, you update the repository. If the pagination style changes, you update the service. If the request format changes, you update the DTO. Each change touches one layer. If everything is smushed into the controller, every change risks breaking everything.

<b>BEGINNER level:</b> A single controller using offset pagination inline.

\`\`\`typescript
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  findAll(@Query('page') page = '1', @Query('limit') limit = '20') {
    const p = parseInt(page, 10);
    const l = parseInt(limit, 10);
    return this.productsService.findAll(p, l);
  }
}
\`\`\`

This works but has problems: no validation, no cap, no type safety, and \`parseInt\` can return \`NaN\` if a client sends \`?page=abc\`.

<b>INTERMEDIATE level:</b> DTO-driven validation with the \`ValidationPipe\`.

\`\`\`typescript
// pagination.dto.ts
export class PaginationDto {
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @IsOptional()
  page: number = 1;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  @IsOptional()
  limit: number = 20;
}

// products.controller.ts
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  findAll(@Query() dto: PaginationDto) {
    return this.productsService.findAll(dto);
  }
}
\`\`\`

You must enable \`ValidationPipe\` globally (or on this controller):

\`\`\`typescript
// main.ts
app.useGlobalPipes(
  new ValidationPipe({ transform: true, whitelist: true }),
);
\`\`\`

The \`transform: true\` is important — it triggers the \`@Type(() => Number)\` conversion so that \`page\` and \`limit\` arrive as numbers, not strings. The \`whitelist: true\` strips unknown query parameters, which prevents accidental injection of unsupported options.

<b>ADVANCED level:</b> A reusable pagination abstraction.

Once you have three or four endpoints that paginate, you will notice the same code repeating. Solve it with a small, focused helper.

\`\`\`typescript
// pagination.helper.ts
export interface Paginated<T> {
  items: T[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
}

export async function paginate<T>(
  repo: Repository<T>,
  dto: PaginationDto,
  options: FindManyOptions<T> = {},
): Promise<Paginated<T>> {
  const { page, limit } = dto;
  const skip = (page - 1) * limit;

  const [items, total] = await repo.findAndCount({
    ...options,
    skip,
    take: limit,
  });

  return {
    items,
    meta: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      hasNextPage: page * limit < total,
      hasPreviousPage: page > 1,
    },
  };
}
\`\`\`

Then any service can use it:

\`\`\`typescript
async findAll(dto: PaginationDto) {
  return paginate(this.productRepository, dto, {
    order: { createdAt: 'DESC' },
    select: ['id', 'name', 'price'],
  });
}

async findActive(dto: PaginationDto) {
  return paginate(this.productRepository, dto, {
    where: { isActive: true },
    order: { createdAt: 'DESC' },
  });
}
\`\`\`

This is the kind of small utility that pays for itself across an application. It guarantees that every paginated endpoint returns the same response shape and applies the same offset math. If you ever need to add a new meta field (like \`links\`), you change one file.

<b>Cursor pagination in NestJS:</b> the same structure applies. The DTO holds \`cursor\` instead of \`page\`, and the service builds the keyset query we saw in lesson 2. You can have both styles coexist by having separate DTOs and separate service methods.

<b>Testing pagination:</b> always test the boundaries, not just the happy path. Write tests for:
- Page 1 with default limit.
- Last page with fewer items than the limit.
- Page beyond the last page (should return empty items, not crash).
- Invalid page number (\`page=0\`, \`page=-1\`, \`page=abc\`) → 400.
- Limit above the cap (\`limit=5000\`) → clamped or rejected.
- Empty result set → meta shows total: 0, totalPages: 0.

Here is a quick NestJS test using \`supertest\`:

\`\`\`typescript
it('rejects page below 1', async () => {
  await request(app.getHttpServer())
    .get('/products?page=0')
    .expect(400);
});

it('clamps or rejects limit above max', async () => {
  const res = await request(app.getHttpServer())
    .get('/products?limit=5000')
    .expect(400); // or 200 with clamped limit if you chose that policy
});

it('returns empty array when page is past the end', async () => {
  const res = await request(app.getHttpServer())
    .get('/products?page=99999&limit=20')
    .expect(200);

  expect(res.body.items).toEqual([]);
  expect(res.body.meta.hasNextPage).toBe(false);
});
\`\`\`

<b>Production considerations:</b>
- <b>Caching.</b> The first page is requested far more often than page 2, 3, or 4. Cache the first page aggressively (Redis, in-memory) and cache the total count.
- <b>Rate limiting.</b> Even with a page cap, some clients will hammer your endpoint. Apply rate limits per API key or per IP.
- <b>Monitoring.</b> Log slow pagination queries and set alerts on p99 latency. Track how often clients hit deep pages — if they do, they probably need cursor pagination or a search feature.
- <b>Consistency across endpoints.</b> Every list endpoint should return the same envelope. Build the helper once and use it everywhere.
- <b>Documentation.</b> Swagger / OpenAPI should clearly document the defaults, caps, and response shape. Use \`@ApiPropertyOptional\` on your DTO fields so clients know what to expect.

<b>How this fits into a real application:</b> in an e-commerce backend, you will use offset pagination for the admin order list and product catalog (where "Page X of Y" matters), cursor pagination for the customer-facing activity feed and notifications, and cached counts for the popular product listing. All three use the same DTO validation, the same response envelope conventions, and the same monitoring. That consistency is what makes the codebase maintainable as it grows from 5 endpoints to 500.

<b>What can go wrong in NestJS specifically?</b>
- <b>Forgetting \`transform: true\`</b> on the global ValidationPipe: your DTO fields stay strings, and \`@Min(1)\` on a string behaves unexpectedly.
- <b>Using \`@Query('page')\` without a DTO:</b> no validation, no cap, and \`parseInt\` silently returns \`NaN\` on garbage input.
- <b>Mixing offset and cursor on the same endpoint</b> without clear rules: clients get confused, and your tests get messy.
- <b>Returning raw entities instead of a DTO for the response:</b> leaking internal fields (password hashes, internal flags) to clients.
- <b>Not handling the empty result:</b> \`items[items.length - 1]\` throws if \`items\` is empty and you try to build a cursor from it. Always guard.
      `,
      diagram: `
NestJS Pagination Architecture

  HTTP Request: GET /products?page=2&limit=20
        |
        v
+-------------------------------+
|  Controller                   |
|  @Get() findAll(@Query() dto) |
+-------------------------------+
        |
        v
+-------------------------------+
|  ValidationPipe + PaginationDto |
|  - transform strings to numbers |
|  - validate min/max            |
|  - clamp or reject             |
+-------------------------------+
        |
        v
+-------------------------------+
|  Service                      |
|  - decides offset vs cursor   |
|  - uses paginate() helper     |
|  - returns Paginated<T>       |
+-------------------------------+
        |
        v
+-------------------------------+
|  Repository (TypeORM/Prisma)  |
|  findAndCount / createQueryBuilder |
|  skip / take / order          |
+-------------------------------+
        |
        v
+-------------------------------+
|  PostgreSQL                   |
|  uses index on (created_at,id)|
+-------------------------------+
        |
        v
  Response envelope:
  {
    items: [...],
    meta: { page, limit, total, totalPages, hasNextPage, hasPreviousPage }
  }
      `,
      codeExample: { title: "Example", code: `
// ============================================
// PAGINATION IN NESTJS — FULL EXAMPLE
// ============================================

// ---------- 1. DTO (validation lives here) ----------
// pagination.dto.ts
import { Type } from 'class-transformer';
import { IsInt, IsOptional, Max, Min } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class PaginationDto {
  @ApiPropertyOptional({ default: 1, minimum: 1 })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @IsOptional()
  page: number = 1;

  @ApiPropertyOptional({ default: 20, minimum: 1, maximum: 100 })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  @IsOptional()
  limit: number = 20;
}

// ---------- 2. Reusable helper ----------
// common/pagination.helper.ts
import { FindManyOptions, Repository } from 'typeorm';

export interface Paginated<T> {
  items: T[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
}

export async function paginate<T>(
  repo: Repository<T>,
  dto: PaginationDto,
  options: FindManyOptions<T> = {},
): Promise<Paginated<T>> {
  const { page, limit } = dto;
  const skip = (page - 1) * limit;

  const [items, total] = await repo.findAndCount({
    ...options,
    skip,
    take: limit,
  });

  return {
    items,
    meta: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      hasNextPage: page * limit < total,
      hasPreviousPage: page > 1,
    },
  };
}

// ---------- 3. Service (business logic lives here) ----------
// products.service.ts
@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  async findAll(dto: PaginationDto): Promise<Paginated<Product>> {
    return paginate(this.productRepository, dto, {
      select: ['id', 'name', 'price', 'thumbnail'],
      order: { createdAt: 'DESC', id: 'DESC' },
    });
  }

  async findActive(dto: PaginationDto): Promise<Paginated<Product>> {
    return paginate(this.productRepository, dto, {
      where: { isActive: true },
      select: ['id', 'name', 'price', 'thumbnail'],
      order: { createdAt: 'DESC', id: 'DESC' },
    });
  }
}

// ---------- 4. Controller (HTTP layer only) ----------
// products.controller.ts
@ApiTags('products')
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  @ApiOkResponse({ overview: 'Paginated list of products' })
  findAll(@Query() dto: PaginationDto) {
    return this.productsService.findAll(dto);
  }

  @Get('active')
  findActive(@Query() dto: PaginationDto) {
    return this.productsService.findActive(dto);
  }
}

// ---------- 5. Module wiring ----------
// products.module.ts
@Module({
  imports: [TypeOrmModule.forFeature([Product])],
  controllers: [ProductsController],
  providers: [ProductsService],
})
export class ProductsModule {}

// ---------- 6. Bootstrap: enable validation pipeline ----------
// main.ts
async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,   // convert query strings to numbers using @Type
      whitelist: true,   // strip unknown properties
      forbidNonWhitelisted: true,
    }),
  );

  await app.listen(3000);
}
bootstrap();

// ---------- 7. Example curl requests ----------
// GET /products?page=1&limit=20
// GET /products?page=2&limit=50
// GET /products?limit=5000      -> 400 (exceeds @Max(100))
// GET /products?page=0          -> 400 (fails @Min(1))
// GET /products                 -> uses defaults page=1, limit=20
      ` },
      keyTakeaways: [
        "Keep pagination responsibilities in the right layers: DTO for validation, service for logic, repository for the query.",
        "Enable `ValidationPipe` with `transform: true` so query strings are converted to numbers by `@Type(() => Number)`.",
        "Use `@Max(100)` on the `limit` field to enforce a hard cap on every paginated endpoint.",
        "Build a reusable `paginate()` helper so every endpoint returns the same response envelope.",
        "Test the boundaries: page 0, page beyond the end, oversized limit, and empty results.",
        "Document the defaults, caps, and response shape in Swagger so clients know what to expect.",
        "Add slow-query logging and monitor p99 latency to catch pagination regressions before they become outages.",
      ],
      commonMistakes: [
        "<b>Forgetting `transform: true` on the global ValidationPipe.</b> Without it, `@Type(() => Number)` never runs, and `page`/`limit` stay as strings — `@Min(1)` then behaves unexpectedly.",
        "<b>Reading query params with `@Query('page')` instead of a DTO.</b> No validation, no cap, and `parseInt('abc')` returns `NaN`, which propagates silently into your query.",
        "<b>Duplicating pagination code across services.</b> Every endpoint reinvents the envelope. Bugs fix in one place but stay in others. Build the helper once.",
        "<b>Not guarding against empty items.</b> `items[items.length - 1]` throws on an empty array. Always check `items.length > 0` before building a cursor.",
        "<b>Returning entities directly instead of a DTO.</b> This leaks internal fields (password hashes, soft-delete flags) to clients. Use a response DTO or `class-transformer`'s `@Exclude`.",
        "<b>No Swagger documentation.</b> Clients guess at the defaults and caps, then complain when their requests fail validation.",
      ],
      quiz: [
        {
          question:
            "Where should the `@Max(100)` limit cap live in a NestJS pagination setup?",
          options: [
            "In the controller method body.",
            "In the DTO field for `limit`, so `ValidationPipe` rejects or caps oversized values automatically.",
            "In the database schema.",
            "In the frontend.",
          ],
          correctIndex: 1,
          explanation:
            "The DTO is the right place for input validation. `ValidationPipe` reads the decorators and rejects invalid requests before they reach your service. This keeps validation declarative and centralized.",
        },
        {
          question:
            "Why must you enable `transform: true` on the global `ValidationPipe` for pagination DTOs to work correctly?",
          options: [
            "Because NestJS requires it for all DTOs.",
            "Because query parameters arrive as strings, and `@Type(() => Number)` needs `transform: true` to actually convert them into numbers before `@Min`/`@Max` run.",
            "Because it speeds up the request.",
            "Because it enables caching.",
          ],
          correctIndex: 1,
          explanation:
            "Without `transform: true`, the DTO fields keep their raw string values and numeric validators like `@Min(1)` do not behave as expected. `transform: true` triggers class-transformer to run `@Type` conversions.",
        },
        {
          question:
            "You have five endpoints that all return a paginated list. What is the best way to keep them consistent?",
          options: [
            "Copy-paste the same envelope code into each service.",
            "Return raw arrays from each endpoint and let the frontend figure out pagination metadata.",
            "Build a reusable `paginate()` helper that wraps `findAndCount` and returns the standard envelope.",
            "Use a different response shape for each endpoint to fit its specific needs.",
          ],
          correctIndex: 2,
          explanation:
            "A reusable helper guarantees the same envelope, the same offset math, and the same defaults on every endpoint. When you need to change something (e.g. add a `links` field), you change one file.",
        },
        {
          question:
            "A client requests `GET /products?page=99999&limit=20` on a dataset with only 500 products. What should the endpoint do?",
          options: [
            "Return a 500 error.",
            "Return items from page 1 instead.",
            "Return 200 with an empty `items` array and `hasNextPage: false` in the meta.",
            "Hang until the client gives up.",
          ],
          correctIndex: 2,
          explanation:
            "Requesting a page beyond the end of the dataset is not an error — it is a valid request with an empty result. Return 200 with an empty `items` array and correct meta. This is the behavior clients expect.",
        },
      ],
    },
  ],
  finalQuiz: [
    {
      question:
        "Which pagination style is the best fit for a Twitter-style infinite scroll feed with hundreds of millions of posts?",
      options: [
        "Offset pagination with a large page size.",
        "Cursor (keyset) pagination using an immutable compound cursor like `(created_at, id)`.",
        "No pagination, return everything at once.",
        "Pagination by `updated_at`.",
      ],
      correctIndex: 1,
      explanation:
        "Cursor pagination using immutable ordering columns gives constant-time access at any depth and remains stable when new rows are inserted. Offset pagination would be slow and unstable at that scale.",
    },
    {
      question:
        "What is the correct formula to compute `skip` for offset pagination?",
      options: [
        "`skip = page * limit`",
        "`skip = (page - 1) * limit`",
        "`skip = page + limit`",
        "`skip = limit / page`",
      ],
      correctIndex: 1,
      explanation:
        "Page 1 has skip 0, page 2 has skip = limit, page 3 has skip = 2 * limit, and so on. The formula `skip = (page - 1) * limit` produces this sequence.",
    },
    {
      question:
        "Why must you always include an `ORDER BY` clause when paginating?",
      options: [
        "Because SQL requires it.",
        "Because without it, row order is undefined, and pages can contain duplicates or skip items entirely.",
        "Because it speeds up the query.",
        "Because TypeORM throws an error otherwise.",
      ],
      correctIndex: 1,
      explanation:
        "Without ORDER BY, the database is free to return rows in any order, and that order can vary between requests. Pagination assumes a stable order, so an explicit ORDER BY is mandatory.",
    },
    {
      question:
        "You need to paginate a feed that is filtered by `author_id` and ordered by `created_at DESC, id DESC`. Which index serves it best?",
      options: [
        "`(created_at DESC, id DESC)`",
        "`(id)` only",
        "`(author_id, created_at DESC, id DESC)`",
        "`(author_id)` only",
      ],
      correctIndex: 2,
      explanation:
        "Put equality filter columns first, then the ORDER BY columns in the same direction, then the tie-breaker. This lets PostgreSQL seek to the author and read rows in the requested order without an extra sort.",
    },
    {
      question:
        "What does the `limit + 1` trick accomplish in cursor pagination?",
      options: [
        "It reduces the size of the response.",
        "It detects whether a next page exists without running a separate `COUNT(*)` query.",
        "It makes the query faster on the database side.",
        "It prevents SQL injection.",
      ],
      correctIndex: 1,
      explanation:
        "By fetching one extra row, you can tell whether more rows exist. If you got `limit + 1` rows back, there is another page. You slice off the extra row and return only `limit` items.",
    },
    {
      question:
        "Why is `COUNT(*)` often skipped or cached in production pagination?",
      options: [
        "Because COUNT is deprecated in PostgreSQL.",
        "Because COUNT cannot be used with LIMIT.",
        "Because on large tables it scans a whole index or table and can take hundreds of milliseconds to seconds, doubling the cost of each paginated request.",
        "Because it always returns the wrong number.",
      ],
      correctIndex: 2,
      explanation:
        "COUNT(*) is not free. On large tables it is expensive and often dominates response time. Caching it, approximating it, or replacing it with a 'has more?' flag keeps pagination fast.",
    },
    {
      question:
        "In a NestJS pagination DTO, why is `@Type(() => Number)` combined with `transform: true` important?",
      options: [
        "Because it makes the DTO immutable.",
        "Because query parameters arrive as strings, and this combination converts them to numbers so numeric validators work correctly.",
        "Because it enables caching.",
        "Because it prevents SQL injection.",
      ],
      correctIndex: 1,
      explanation:
        "Query strings are always strings. `@Type(() => Number)` marks the field for conversion, and `transform: true` on the global ValidationPipe actually runs the conversion before validation. Together they make `@Min` and `@Max` work as intended.",
    },
    {
      question:
        "A client sends `?limit=100000`. What should your server do?",
      options: [
        "Return 100000 items — the client asked for them.",
        "Reject with 400 or clamp to the maximum allowed limit — never return more than the cap.",
        "Silently ignore the limit and use the default.",
        "Crash and log the request.",
      ],
      correctIndex: 1,
      explanation:
        "Always enforce a hard cap. Either reject oversized requests with a validation error or clamp them to the max allowed. Returning 100,000 items risks memory exhaustion and slow response times.",
    },
    {
      question:
        "What is the main consistency risk of offset pagination when new rows are inserted between page requests?",
      options: [
        "The database may crash.",
        "Rows shift, so a user can see duplicates or miss items entirely as they move from one page to the next.",
        "The response becomes invalid JSON.",
        "The index is corrupted.",
      ],
      correctIndex: 1,
      explanation:
        "OFFSET counts rows from the beginning every time. If new rows are inserted before the user's cursor position, previously seen items get pushed down and reappear on later pages — while some items get skipped.",
    },
    {
      question:
        "Which of these is NOT an appropriate place to put pagination validation logic in NestJS?",
      options: [
        "In the DTO using `class-validator` decorators.",
        "In the global `ValidationPipe` configuration.",
        "Directly inside the raw SQL string built by string concatenation.",
        "In the controller via `@Query() dto: PaginationDto`.",
      ],
      correctIndex: 2,
      explanation:
        "Building SQL by concatenating raw query parameters is a recipe for SQL injection and inconsistent behavior. Validation belongs in the DTO and ValidationPipe. Parameterized queries handle safe data flow to the database.",
    },
    {
      question:
        "Why might you choose a hybrid pagination strategy (offset for shallow pages, cursor for deep pages)?",
      options: [
        "Because the database requires it.",
        "Because users mostly jump to early pages where offset is fine, but deep scrolling needs cursor's constant-time performance.",
        "Because TypeORM only supports hybrid mode.",
        "Because it saves disk space.",
      ],
      correctIndex: 1,
      explanation:
        "Most users stay on the first few pages where offset is perfectly acceptable and gives them 'Page X of Y'. Deep pagination (rare) benefits from cursor's constant cost. Hybrid gives you the best of both worlds.",
    },
    {
      question:
        "What is a realistic consequence of returning entities directly from a paginated endpoint instead of a response DTO?",
      options: [
        "The response is faster.",
        "The response is smaller.",
        "Internal fields like password hashes or soft-delete flags can leak to clients.",
        "Pagination stops working.",
      ],
      correctIndex: 2,
      explanation:
        "Entities often contain fields that should never leave the server. Returning a response DTO (or using `class-transformer`'s `@Exclude`) ensures clients only see the fields you intend them to see.",
    },
    {
      question:
        "Your API returns `{ data: [...], count: 50 }` on one endpoint and `{ items: [...], total: 50 }` on another. Why is this a problem?",
      options: [
        "It is not a problem — clients can handle it.",
        "It forces every client to special-case each endpoint, and any shared pagination UI has to know both shapes.",
        "It makes the API slower.",
        "It violates HTTP.",
      ],
      correctIndex: 1,
      explanation:
        "Consistency matters more than cleverness. When every paginated endpoint returns the same envelope, clients can use one pagination component, one parser, one set of types. Different shapes multiply client complexity and bugs.",
    },
  ],
  project: {
    name: "Build a Paginated Product Catalog and Activity Feed for a Mini E-Commerce Store",
    goal:
      "Apply offset pagination, cursor pagination, DTO validation, caching, and correct index design in a single NestJS application that behaves like a real e-commerce backend.",
    brief:
      "You are building the backend for a small e-commerce store. Customers browse a product catalog (where 'Page X of Y' matters) and scroll through an activity feed of recent orders (where infinite scroll is the natural UX). You must implement both pagination styles in NestJS with proper validation, a consistent response envelope, correct database indexes, and cached counts. The project ties together everything from today's lessons: offset pagination, cursor pagination, performance, API design, and NestJS layering.",
    steps: [
      "Create a new NestJS project with `nest new pagination-project`. Add TypeORM and PostgreSQL (`@nestjs/typeorm pg`). Add `class-validator` and `class-transformer`.",
      "Define two entities: `Product` (id, name, price, thumbnail, createdAt, isActive) and `Order` (id, customerName, total, createdAt). Add a TypeORM migration that creates both tables.",
      "Add the required indexes via migration: `CREATE INDEX idx_products_created_id ON products (created_at DESC, id DESC);` and `CREATE INDEX idx_orders_created_id ON orders (created_at DESC, id DESC);`.",
      "Create a `PaginationDto` with `page` (default 1, min 1) and `limit` (default 20, min 1, max 100). Use `@Type(() => Number)` on both fields.",
      "Enable the global `ValidationPipe` with `transform: true` and `whitelist: true` in `main.ts`.",
      "Build a reusable `paginate()` helper that wraps `findAndCount` and returns the standard envelope: `{ items, meta: { page, limit, total, totalPages, hasNextPage, hasPreviousPage } }`.",
      "Implement `GET /products` using the helper. It should return active products ordered by `createdAt DESC, id DESC`, selecting only list-view fields (`id`, `name`, `price`, `thumbnail`).",
      "Implement `GET /orders/feed` using cursor pagination. The cursor should be a base64-encoded JSON payload containing `{ createdAt, id, direction }`. Use the `(created_at, id) < (:createdAt, :id)` keyset comparison. Use the `limit + 1` trick to detect `hasMore`. Return `{ items, meta: { limit, nextCursor, prevCursor, hasMore } }`.",
      "Cache the total product count in memory for 60 seconds so `GET /products` does not run `COUNT(*)` on every request.",
      "Add Swagger via `@nestjs/swagger`. Annotate `PaginationDto` fields with `@ApiPropertyOptional` and document both endpoints with `@ApiOkResponse`.",
      "Write e2e tests with `supertest` covering: page 1 default, last page, page beyond the end (empty items), `page=0` (400), `limit=5000` (400), and a full cursor walk through several pages of the order feed.",
    ],
    acceptance: [
      "`GET /products?page=1&limit=20` returns 20 products and meta with correct `total`, `totalPages`, `hasNextPage`, `hasPreviousPage`.",
      "`GET /products?page=0` returns 400 with a clear validation error.",
      "`GET /products?limit=5000` returns 400 (or a clamped result if you chose clamping — document which).",
      "`GET /products?page=99999` returns 200 with `items: []` and `hasNextPage: false`.",
      "`GET /orders/feed?limit=20` returns 20 orders plus a `nextCursor`. Calling again with that cursor returns the next 20 orders with no duplicates or gaps.",
      "Deleting rows between feed requests does not cause items to be skipped or duplicated (unlike offset pagination).",
      "`EXPLAIN ANALYZE` on both queries shows index usage (Index Scan, not Seq Scan).",
      "The total count for `/products` is served from cache on subsequent requests within 60 seconds.",
      "All e2e tests pass.",
    ],
    stretch: [
      "Add a hybrid strategy to `GET /products`: if `page > 100` or a `cursor` query parameter is provided, switch to cursor pagination automatically. Document the switch in Swagger.",
      "Add a `/products/search?q=...` endpoint that combines full-text search with cursor pagination.",
      "Add Redis-backed caching (via `@nestjs/cache-manager` with a Redis store) for the product count, and invalidate it whenever a product is created or deleted.",
      "Add a rate-limiting guard using `@nestjs/throttler` so a single client cannot hammer the paginated endpoints.",
      "Add structured slow-query logging: any paginated query above 200ms is logged with `page`, `limit`, and duration. Optionally emit a Prometheus metric.",
      "Add response DTOs with `class-transformer`'s `@Exclude` to guarantee no internal fields leak, and add a test that asserts a known internal field is not present in the response.",
      "Implement 'load more' and 'load previous' in a tiny React/HTML frontend that consumes the cursor endpoints, so you can see the UX difference between offset and cursor pagination in practice.",
    ],
  },
};
