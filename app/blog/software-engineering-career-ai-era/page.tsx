import Image from "next/image";
import Link from "next/link";

export const metadata = {
  title: "Software Engineering Career in the AI Era | Learn with Rajan",
  description: "A practical guide to building a durable software engineering career in the AI era.",
};

const CAREER_ARTICLE = `# How to Build a Software Engineering Career in the AI Era

Software engineering has changed. AI can generate code, explain unfamiliar tools, build interfaces, write tests, and speed up routine work.

That does not make engineers less valuable. It changes what valuable engineering looks like.

The goal is not to compete with AI by typing faster. It is to understand problems, make good technical decisions, build useful systems, communicate clearly, and use AI without outsourcing your judgment.

---

## Is Big Tech Actually Dying?

Layoffs do not automatically mean that technology has no opportunities. Companies can reduce one team while hiring in another area, such as AI infrastructure, cybersecurity, cloud systems, or data platforms.

The useful question is not “Are there jobs?” It is:

**What problems are companies willing to invest in solving?**

Build skills that travel across products and tools:

* Understanding databases matters more than memorizing one database.
* Understanding distributed systems matters more than knowing one cloud service.
* Understanding APIs, system design, and problem solving outlasts any one framework.

---

# Be Broad Enough to Understand Systems, Deep Enough to Be Useful

Early in your career, broad knowledge helps. Learn programming, React or another frontend tool, backend basics, SQL, Git, testing, Docker, and cloud fundamentals.

But do not stay broad forever. Develop depth in an area where you want to solve harder problems.

\`\`\`text
Broad foundation
  ├── Programming
  ├── Applications
  ├── Engineering practice
  └── Production basics
          ↓
   One area of depth
\`\`\`

A clear technical identity is easier to hire for than a long list of tools. For example:

> Full-stack engineer specializing in backend systems and APIs.

> Frontend engineer specializing in React and large-scale web applications.

> Cloud engineer specializing in infrastructure and Kubernetes.

Useful specializations include:

### Backend Engineering

APIs, databases, business logic, authentication, queues, caching, and distributed systems. Strong backend engineers understand how data moves through a system, not only how to use a framework.

### Cloud and Infrastructure

Infrastructure, deployment, monitoring, networking, containers, and automation. Tools change, but the underlying ideas remain valuable.

### AI and Machine Learning

AI engineering includes more than calling an API. It can involve data pipelines, model integration, evaluations, retrieval systems, agents, monitoring, and production reliability.

### Cybersecurity and Data Engineering

Security covers identity, permissions, application and infrastructure security. Data engineering covers the pipelines that move, transform, store, and process data. Choose a niche because you want to become genuinely good at it, not because it is popular.

---

# Start Specializing by Asking Better Questions

If you enjoy backend development, do not stop at “I know Node.js.” Ask:

* How does Node.js handle concurrency?
* How does an HTTP request travel through a system?
* How do database indexes and transactions work?
* What happens when two requests update the same record?
* How do you scale and monitor an API?
* What happens when a service becomes unavailable?

These questions move you from framework knowledge to engineering knowledge.

---

# Build Projects That Show Engineering Judgment

A to-do app is useful when you are learning syntax. After that, choose projects that demonstrate how you think.

### Project: Production-Style Job Queue

Build an application where users submit jobs. Include:

* REST API
* PostgreSQL
* Redis
* Background workers
* Retry logic
* Rate limiting
* Authentication
* Logging and monitoring
* Docker
* Automated tests
* CI/CD

\`\`\`text
User request
    ↓
API → database → job queue
                    ↓
             background worker
                    ↓
       result, retry, logs, monitoring
\`\`\`

This does not need to be enormous. It shows that you understand how a real system fits together and can make engineering decisions.

Other useful projects include a real-time collaboration tool, a secure file-processing service, a document assistant, or an API with rate limits and observability. Explain the trade-offs in the README.

---

# Hackathons, Internships, and Personal Projects

Each experience teaches something different.

### Hackathons

Hackathons teach you to build under time pressure, use unfamiliar tools, collaborate, present ideas, and turn an idea into a working prototype.

### Internships

Internships show you code reviews, Git workflows, team communication, product requirements, debugging, production systems, and existing codebases.

### Personal Projects

Personal projects give you freedom to choose the architecture, explore technologies, and build around your interests.

The strongest path is usually a combination of all three. Focus on solving increasingly difficult problems instead of searching for one perfect experience.

---

# Learn in Layers

Do not try to learn everything at once.

### Layer 1: Programming Fundamentals

Variables, functions, data structures, algorithms, object-oriented programming, error handling, and testing.

### Layer 2: Application Development

HTTP, APIs, databases, authentication, frontend development, and backend development.

### Layer 3: Engineering

System design, caching, queues, concurrency, distributed systems, observability, and security.

### Layer 4: Production

Linux, Docker, CI/CD, cloud, monitoring, and infrastructure.

### Layer 5: Specialization

Go deep into the area you want to become known for.

Use courses for structure and books for deeper understanding, but avoid the course-collection trap:

> Course → Course → Course → no project.

Use this cycle instead:

\`\`\`text
Learn → Build → Break → Debug → Improve
\`\`\`

If you learn databases, build with a database. If you learn Docker, containerize your project. If you learn testing, add tests to something you already built.

---

# Learn System Design by Reasoning, Not Memorizing

A system-design interview might ask you to design a URL shortener. You need to think about API design, data structure, scaling, caching, load balancing, reliability, failure handling, and monitoring.

Do not memorize diagrams. Start with requirements, estimate scale, design the simplest system that works, identify bottlenecks, then improve it.

Good system design is making reasonable decisions from the requirements, not drawing the most complicated architecture.

---

# Build Relationships Before You Need a Job

Online applications can feel invisible. A referral is not a shortcut, but it gives your application context from someone who knows your work.

Build relationships while you learn. Talk to engineers, join communities, share what you build, help others, and contribute when you can.

A respectful referral request is specific:

> “I saw that your company is hiring for a backend position. I've been working with Node.js and PostgreSQL and the role looks like a strong match. Would you be comfortable referring me?”

A referral does not guarantee a job. It gives your application a better chance of being seen.

---

# Prepare for Interviews in an AI-Assisted World

Interviews increasingly test more than typing speed. Expect to show problem solving, system design, debugging, communication, code review, architecture, and technical judgment.

AI is a normal development tool, but understanding remains your responsibility.

If AI generates a database query, ask:

* Does it use an index?
* How does it behave with 10 million rows?
* Could it create a race condition?
* What happens when the database connection fails?
* Can I explain and modify it myself?

A strong engineer can say:

> “I used AI to help implement this, but I understand why it works, its limitations, and how I would change it.”

AI can hide gaps in understanding. Use it as a learning accelerator, not a substitute for thinking.

---

# Evaluate the Whole Offer and Build Lasting Value

Junior engineers can negotiate professionally. You can ask:

> “I'm very excited about the opportunity. Based on the role and my experience, is there any flexibility in the compensation?”

Consider salary, bonus, equity, vacation, remote flexibility, learning opportunities, title, and growth. A company may say no, and asking respectfully is still reasonable.

No role is guaranteed forever. Make yourself harder to replace by understanding important systems, taking ownership, improving reliability, reducing technical debt, documenting knowledge, helping teammates, and understanding the business.

Do not become someone who only completes assigned tickets. Become someone who understands why the system exists and how to improve it.

---

# Final Advice for Early-Career Engineers

Start with fundamentals. Build real projects. Learn how production systems work. Choose an area that interests you and go deeper.

Use AI, but do not outsource your understanding to it. Practice system design, improve your communication, build relationships, and learn to explain your decisions.

Your career asset is your ability to solve increasingly difficult problems.

Technology will change. Frameworks, languages, companies, and job titles will change. An engineer who can learn, reason, build, communicate, and adapt will keep creating value.

The goal is not to compete with AI. The goal is to use AI while still thinking like an engineer.`;

type ArticleBlock =
  | { type: "heading"; level: number; text: string }
  | { type: "paragraph"; text: string }
  | { type: "list"; items: string[] }
  | { type: "code"; text: string }
  | { type: "quote"; text: string }
  | { type: "divider" };

const sectionImages: Record<string, { src: string; alt: string }> = {
  "Be Broad Enough to Understand Systems, Deep Enough to Be Useful": {
    src: "/images/blog/software-engineering-specialization.png",
    alt: "Engineering specialties branching from a strong foundation",
  },
  "Build Projects That Show Engineering Judgment": {
    src: "/images/blog/production-software-project.png",
    alt: "A production-style software project with an API, database, job queue, monitoring, and deployment",
  },
};

function renderInline(text: string) {
  return text.split(/(\*\*.*?\*\*|`.*?`)/g).map((part, index) => {
    if (part.startsWith("**") && part.endsWith("**")) return <strong key={index}>{part.slice(2, -2)}</strong>;
    if (part.startsWith("`") && part.endsWith("`")) return <code key={index}>{part.slice(1, -1)}</code>;
    return part;
  });
}

function toId(text: string) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

function ArticleHeading({ level, text }: { level: number; text: string }) {
  const id = toId(text);
  if (level <= 2) return <h2 id={id} className="scroll-mt-20 mt-12 text-2xl font-bold tracking-tight text-[var(--text)]">{renderInline(text)}</h2>;
  return <h3 id={id} className="scroll-mt-20 mt-8 text-xl font-bold text-[var(--text)]">{renderInline(text)}</h3>;
}

function getBlocks(source: string): ArticleBlock[] {
  const blocks: ArticleBlock[] = [];
  const lines = source.split("\n");
  let codeLines: string[] = [];
  let listItems: string[] = [];
  let inCode = false;

  const flushList = () => {
    if (listItems.length) blocks.push({ type: "list", items: listItems });
    listItems = [];
  };

  for (const line of lines) {
    if (line.startsWith("```")) {
      if (inCode) {
        blocks.push({ type: "code", text: codeLines.join("\n") });
        codeLines = [];
      }
      inCode = !inCode;
      continue;
    }

    if (inCode) {
      codeLines.push(line);
      continue;
    }

    if (!line.trim()) {
      flushList();
      continue;
    }

    const heading = line.match(/^(#{1,3})\s+(.+)$/);
    if (heading) {
      flushList();
      blocks.push({ type: "heading", level: heading[1].length, text: heading[2] });
      continue;
    }

    if (line.startsWith("* ")) {
      listItems.push(line.slice(2));
      continue;
    }

    flushList();
    if (line === "---") blocks.push({ type: "divider" });
    else if (line.startsWith("> ")) blocks.push({ type: "quote", text: line.slice(2) });
    else blocks.push({ type: "paragraph", text: line });
  }

  flushList();
  return blocks;
}

export default function SoftwareEngineeringCareerPage() {
  const blocks = getBlocks(CAREER_ARTICLE);
  const title = blocks[0]?.type === "heading" ? blocks[0].text : "How to Build a Software Engineering Career in the AI Era";
  const intro = blocks
    .slice(1, 4)
    .filter((block): block is Extract<ArticleBlock, { type: "paragraph" }> => block.type === "paragraph")
    .map((block) => block.text)
    .join(" ");
  const bodyBlocks = blocks.slice(4);

  return (
    <article className="mx-auto max-w-3xl px-4 py-10 sm:px-6 sm:py-16">
      <Link href="/blog" className="text-sm text-[var(--muted)] hover:text-[var(--text)]">← Back to blog</Link>
      <p className="mt-8 text-sm font-medium text-[var(--accent)]">CAREER · 15 MIN READ</p>
      <h1 className="mt-3 text-3xl font-semibold tracking-tight text-[var(--text)] sm:text-5xl">{title}</h1>
      <p className="mt-5 text-lg leading-8 text-[var(--muted)]">{renderInline(intro)}</p>
      <Image src="/images/blog/software-engineering-career-cover.png" alt="An upward software engineering career path in the AI era" width={1200} height={675} priority className="mt-8 rounded-2xl border border-[var(--border)]" />

      <div className="mt-10 max-w-none">
        {bodyBlocks.map((block, index) => {
          if (block.type === "heading") {
            const image = sectionImages[block.text];

            return (
              <div key={index}>
                <ArticleHeading level={block.level} text={block.text} />
                {image ? <Image src={image.src} alt={image.alt} width={1200} height={675} className="my-8 rounded-2xl border border-[var(--border)]" /> : null}
              </div>
            );
          }

          if (block.type === "paragraph") return <p key={index} className="mt-5 text-[1.05rem] leading-8 text-[var(--muted)]">{renderInline(block.text)}</p>;
          if (block.type === "list") return <ul key={index} className="mt-6 list-disc space-y-2 rounded-xl border border-[var(--border)] bg-[var(--surface)] px-6 py-5 pl-10 leading-7 text-[var(--muted)]">{block.items.map((item) => <li key={item}>{renderInline(item)}</li>)}</ul>;
          if (block.type === "code") return <pre key={index} className="my-7 overflow-x-auto rounded-xl border border-slate-800 bg-slate-950 p-5 font-mono text-sm leading-6 text-slate-100 shadow-sm"><code>{block.text}</code></pre>;
          if (block.type === "quote") return <blockquote key={index} className="my-7 rounded-r-xl border-l-4 border-[var(--accent)] bg-[color-mix(in_oklab,var(--accent)_7%,var(--surface))] px-5 py-4 text-lg leading-8 text-[var(--muted)]">{renderInline(block.text)}</blockquote>;
          return null;
        })}
      </div>
    </article>
  );
}
