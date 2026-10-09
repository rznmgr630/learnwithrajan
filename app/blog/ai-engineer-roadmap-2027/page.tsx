import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  title: "AI Engineer Roadmap 2027 | Learn with Rajan",
  description: "A practical AI Engineer roadmap for building real AI products, from software foundations to production systems.",
  alternates: { canonical: "/blog/ai-engineer-roadmap-2027" },
  openGraph: {
    title: "AI Engineer Roadmap 2027",
    description: "A practical AI Engineer roadmap for building real AI products, from software foundations to production systems.",
    type: "article",
    url: "/blog/ai-engineer-roadmap-2027",
    images: "/images/blog/ai-engineer-roadmap-cover.png",
  },
};

function Flow({ children }: { children: string }) {
  return <pre className="my-6 overflow-x-auto rounded-xl border border-slate-800 bg-slate-950 p-5 font-mono text-sm leading-6 text-slate-100 shadow-sm">{children}</pre>;
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return <h2 className="mt-12 text-2xl font-bold tracking-tight text-[var(--text)]">{children}</h2>;
}

export default function AiEngineerRoadmapPage() {
  return (
    <article className="mx-auto max-w-3xl px-4 py-10 sm:px-6 sm:py-16">
      <Link href="/blog" className="text-sm text-[var(--muted)] hover:text-[var(--text)]">← Back to blog</Link>
      <p className="mt-8 text-sm font-medium text-[var(--accent)]">AI ENGINEERING · 15 MIN READ</p>
      <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-5xl">AI Engineer Roadmap 2027: From Beginner to Builder</h1>
      <p className="mt-5 text-lg leading-8 text-[var(--muted)]">AI engineering is not about learning every model or framework. It is about learning the stable ideas that help you build useful AI products.</p>
      <Image src="/images/blog/ai-engineer-roadmap-cover.png" alt="An abstract roadmap from software engineering foundations to AI product building" width={1200} height={675} priority className="mt-8 rounded-2xl border border-[var(--border)]" />

      <div className="prose mt-10 max-w-none prose-p:text-[var(--muted)] prose-p:leading-8 prose-li:text-[var(--muted)] dark:prose-invert">
        <SectionTitle>First, choose the path you are actually taking</SectionTitle>
        <p>There are two broad paths. <strong>AI research</strong> focuses on discovering methods, training models, and pushing the field forward. <strong>AI product development</strong> uses existing models to solve real user problems.</p>
        <p>This roadmap is for the second path. You might be called an AI Engineer, Applied AI Engineer, Generative AI Developer, or AI Product Engineer. The job is similar: connect models to products, data, tools, and users.</p>
        <Flow>{"AI research\n  → Create or improve models\n\nAI product development\n  → Use models to build helpful products"}</Flow>

        <SectionTitle>The complete roadmap at a glance</SectionTitle>
        <p>Do not start with agents or a trendy framework. Start with the layers underneath. Each stage makes the next one easier to understand and safer to build.</p>
        <Flow>{"Software engineering\n        ↓\nAI primitives\n        ↓\nAI systems\n        ↓\nProduction AI\n        ↓\nBuilder mindset + products"}</Flow>

        <h3 className="mt-8 text-xl font-bold text-[var(--text)]">Stage 1: Software engineering</h3>
        <p>An LLM is only one component of an AI product. You still need APIs, databases, authentication, backend logic, infrastructure, streaming, and a usable interface.</p>
        <Flow>{"Frontend\n   ↓\nAPI\n   ↓\nAI application\n ├── Database\n ├── LLM API\n └── External tools"}</Flow>
        <p>Python is excellent for AI work. JavaScript or TypeScript is excellent when you want one ecosystem across your frontend and backend. Learn the language you need, but do not let syntax become the main goal. The important ideas transfer.</p>

        <SectionTitle>Stage 2: AI primitives</SectionTitle>
        <p>AI primitives are the small building blocks behind AI applications. Learn how to call an LLM, give it instructions, send relevant context, and use its response safely.</p>
        <ul>
          <li><strong>LLM fundamentals:</strong> requests, responses, tokens, latency, cost, and model limits.</li>
          <li><strong>Prompting:</strong> clear task instructions, examples, and system messages.</li>
          <li><strong>Context engineering:</strong> give the model the right information, not every piece of information.</li>
          <li><strong>Model selection:</strong> match text, vision, audio, or multimodal models to the task.</li>
        </ul>
        <Flow>{"System instructions\n+ User request\n+ Relevant history\n+ Retrieved facts\n+ Tool results\n        ↓\n      LLM response"}</Flow>
        <p>Context bloat is a common beginner mistake. More context is not always better. Give the model the smallest useful set of facts for the current task.</p>

        <SectionTitle>Stage 3: Build AI systems</SectionTitle>
        <p>This is where a simple chat prompt becomes an application. You learn how a model can return structured data, call tools, remember useful details, and work with your company data.</p>
        <Image src="/images/blog/ai-agent-tools.png" alt="AI agent connected to database, web search, and calendar tools" width={1200} height={675} className="my-8 rounded-2xl border border-[var(--border)]" />
        <h3 className="mt-8 text-xl font-bold text-[var(--text)]">Agents and workflows</h3>
        <p>An <strong>agent</strong> decides what to do next. A <strong>workflow</strong> follows a sequence your application already knows. Start with a workflow when the steps are predictable. Add an agent only when decisions really need flexibility.</p>
        <Flow>{"Agent\nLLM → decide → tool → decide → answer\n\nWorkflow\nStep 1 → Step 2 → Step 3 → result"}</Flow>
        <h3 className="mt-8 text-xl font-bold text-[var(--text)]">Structured output, tools, memory, and RAG</h3>
        <p>Use <strong>structured output</strong> when software must consume the answer. Use <strong>tool calling</strong> when the model needs a database, calendar, search, payments, or another API. Add memory only when a conversation needs to retain relevant information.</p>
        <p><strong>RAG</strong>, short for Retrieval-Augmented Generation, lets an application retrieve relevant company knowledge before asking the model to answer. It is useful for support bots, document assistants, and internal search.</p>
        <Flow>{"Company documents\n       ↓\nKnowledge base → search → relevant facts\n                              ↓\n                         LLM answer"}</Flow>

        <SectionTitle>Stage 4: Make AI safe in production</SectionTitle>
        <p>A demo that works once is not yet a product. Production AI needs guardrails, observability, evaluations, authentication, pricing rules, and a plan for failure.</p>
        <Image src="/images/blog/production-ai-system.png" alt="Production AI system protected by monitoring, evaluation, and security controls" width={1200} height={675} className="my-8 rounded-2xl border border-[var(--border)]" />
        <ul>
          <li><strong>Guardrails:</strong> stop unsafe, invalid, or out-of-scope actions.</li>
          <li><strong>Observability:</strong> see prompts, tool calls, latency, cost, and failures.</li>
          <li><strong>Evals:</strong> test whether the system produces useful answers for real cases.</li>
          <li><strong>Authentication and permissions:</strong> never let an AI tool access data a user cannot access.</li>
          <li><strong>Fine-tuning and self-hosting:</strong> learn these after you can evaluate whether you actually need them.</li>
        </ul>
        <Flow>{"User request\n    ↓\nPermissions → guardrails → model + tools\n    ↓\nEvaluations + monitoring\n    ↓\nSafe product response"}</Flow>

        <SectionTitle>Stage 5: Build products, not just demos</SectionTitle>
        <p>Use AI as leverage after you understand the foundations. It can help you move faster, but it cannot replace knowing what to build, how to test it, or how to keep user data safe.</p>
        <p>Build small projects that solve a real problem: a document Q&A assistant, customer-support helper, meeting summarizer, research workflow, or a focused AI feature inside an existing app. Each project teaches product judgment that tutorials cannot.</p>
        <Flow>{"Find a real problem\n       ↓\nBuild the smallest useful version\n       ↓\nGet feedback\n       ↓\nMeasure quality and cost\n       ↓\nImprove or move on"}</Flow>

        <SectionTitle>Your first learning checklist</SectionTitle>
        <ul>
          <li>Build a normal web application with an API, database, and authentication.</li>
          <li>Call an LLM and handle text plus structured output.</li>
          <li>Add useful context and one reliable tool call.</li>
          <li>Build one RAG feature using your own documents.</li>
          <li>Add evaluations, logging, and access control before calling it production-ready.</li>
          <li>Repeat with projects that solve problems you genuinely care about.</li>
        </ul>

        <SectionTitle>Final takeaway</SectionTitle>
        <p>You do not need to learn every framework, model, or research paper. Learn software engineering first, then the AI concepts that do not disappear when tools change. The goal is simple: build AI products that are useful, dependable, and safe for real people.</p>
      </div>
    </article>
  );
}

