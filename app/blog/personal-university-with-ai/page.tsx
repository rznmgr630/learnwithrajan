import Image from "next/image";
import Link from "next/link";
import { Source_Serif_4 } from "next/font/google";

export const metadata = {
  title: "Build Your Own Personal University With AI | Learn with Rajan",
  description: "Use AI as an advisor, librarian, tutor, editor, and roommate to build a learning system around your goals.",
};

const sourceSerif = Source_Serif_4({ subsets: ["latin"], weight: "variable", style: ["normal", "italic"] });

function SectionTitle({ children }: { children: string }) {
  return <h2 className="mt-14 border-t border-[var(--border)] pt-7 text-2xl font-semibold leading-tight tracking-tight text-[var(--text)] sm:text-3xl">{children}</h2>;
}

function Subheading({ children }: { children: string }) {
  return <h3 className="mt-9 text-xl font-semibold leading-tight text-[var(--text)]">{children}</h3>;
}

function Prompt({ children }: { children: string }) {
  return <pre className="my-8 overflow-x-auto rounded-lg border border-slate-700 bg-[#101827] p-5 font-mono text-sm leading-6 text-slate-200 shadow-lg"><code>{children}</code></pre>;
}

export default function PersonalUniversityWithAiPage() {
  return (
    <article className="mx-auto max-w-5xl px-4 py-10 sm:px-6 sm:py-14">
      <div className="mx-auto max-w-3xl">
        <Link href="/blog" className="text-sm text-[var(--muted)] transition hover:text-[var(--text)]">← Back to blog</Link>
        <p className="mt-7 text-xs font-semibold tracking-[0.18em] text-[var(--accent)]">AI LEARNING · 18 MIN READ</p>
        <h1 className="mt-4 max-w-3xl text-4xl font-semibold leading-[1.08] tracking-tight text-[var(--text)] sm:text-6xl">Build Your Own Personal University With AI</h1>
        <p className="mt-6 max-w-2xl text-xl leading-8 text-[var(--muted)]">A practical guide to using AI as an advisor, librarian, tutor, editor, and roommate so you can learn anything with more focus.</p>
      </div>

      <Image src="/images/blog/personal-ai-university-cover.png" alt="A learner building a personal university with AI" width={1200} height={675} priority className="mx-auto mt-10 aspect-[16/8] w-full rounded-lg object-cover shadow-2xl shadow-black/15" />

      <div className={`${sourceSerif.className} prose mx-auto mt-10 max-w-2xl prose-p:text-[1.125rem] prose-p:text-[var(--muted)] prose-p:leading-8 prose-strong:font-semibold prose-strong:text-[var(--text)] prose-li:text-[1.05rem] prose-li:leading-8 prose-li:text-[var(--muted)] dark:prose-invert`}>
        <p className="first-letter:mr-2 first-letter:float-left first-letter:text-5xl first-letter:font-semibold first-letter:leading-[0.8] first-letter:text-[var(--text)]">What if you could build a university around your own goals, available whenever you need it, without paying thousands in tuition?</p>
        <p>You may want to master backend development, improve your English, learn Japanese, understand finance, or enter a completely new field. AI can bring many learning resources together. But access to information does not automatically create knowledge.</p>
        <p><strong>The real challenge is building a system that helps you learn the right things, understand them deeply, practise consistently, and improve your work.</strong></p>
        <p>The University in a Box framework treats AI as five learning partners: an Advisor, Librarian, Tutor, Editor, and Roommate. Each has a distinct job.</p>

        <SectionTitle>1. Start With a Different Way of Thinking About Education</SectionTitle>
        <p>Free courses, documentation, books, lectures, and tutorials are easier to access than ever. Yet many learners collect resources, create ambitious plans, and never develop the skill they originally wanted.</p>
        <p>Having access to education and successfully learning something are different things. If you want to become a backend engineer, you can easily jump between database optimization, distributed systems, Kubernetes, system design, and programming languages without mastering any of them.</p>
        <p>A personal university needs a learning system that answers five questions:</p>
        <ul><li>What should I learn?</li><li>Which resources deserve my attention?</li><li>Do I genuinely understand what I am studying?</li><li>How can I improve my work?</li><li>How can I expand my perspective beyond what I already know?</li></ul>

        <SectionTitle>2. Role One: The Advisor</SectionTitle>
        <p>A good advisor does not give every student the same plan. It considers current knowledge, goals, weaknesses, and available time. AI can do the same when you ask it to design a path around a specific outcome, rather than simply saying, “Teach me backend development.”</p>
        <Subheading>Define your destination</Subheading>
        <p>“Learn finance” is too broad. A useful goal might be understanding revenue, expenses, cash flow, and profitability well enough to make better business decisions. For programming, it might be designing, building, testing, and deploying a production-ready API.</p>
        <Subheading>Establish your baseline</Subheading>
        <p>Ask AI to interview you before it creates a curriculum. Someone who understands programming fundamentals may need database transactions, caching, and architecture, not another week on variables and loops.</p>
        <Subheading>Decide the sequence, cut list, and milestones</Subheading>
        <p>Topics should build on one another. Learn transactions and replication before distributed consistency. Create a cut list for subjects you can safely postpone. Then define proof of ability, such as analysing a slow SQL query and explaining why an index improves it.</p>
        <Prompt>{`Act as my personal academic advisor and curriculum designer.\n\nI want to build a structured learning path for [TOPIC] so I can [SPECIFIC GOAL].\n\nInterview me first about my knowledge, weaknesses, study time, and learning preferences. Then guide me through:\n1. Destination: abilities I should have\n2. Baseline: knowledge gaps\n3. Sequence: prerequisites to advanced concepts\n4. Cut list: what to postpone\n5. Milestones: measurable exercises and projects\n\nAsk one question at a time. Create a practical week-by-week plan only after the interview.`}</Prompt>

        <SectionTitle>3. Role Two: The Librarian</SectionTitle>
        <p>Once you have a curriculum, the next problem is deciding what to study. Search engines and social media expose you to enormous amounts of information, but not every popular resource is accurate, relevant, or suitable for your level.</p>
        <p>Build a small, reliable collection instead of dozens of bookmarks: perhaps one textbook or reference, one structured course, official documentation or primary sources, and a few supporting articles or demonstrations.</p>
        <p>Ask AI to describe the author, publication, audience, prerequisites, relevance, and limitations of a source. For technical subjects, official documentation and hands-on examples are especially valuable. Verify important claims against the original source.</p>
        <Prompt>{`Act as my research librarian for [TOPIC]. My goal is [LEARNING GOAL] and my level is [LEVEL].\n\nRecommend a small collection of high-quality resources. For each include title, author or organization, link, type, intended audience, prerequisites, curriculum fit, credibility, and limitations.\n\nPrioritize official documentation, reputable textbooks, primary sources, established institutions, and credible research. Do not invent sources. Finish with the three to five resources I should start with.`}</Prompt>

        <SectionTitle>4. Role Three: The Tutor</SectionTitle>
        <p>Reading an explanation or watching a lecture can feel like understanding. The real test comes when you must explain it, solve an unfamiliar problem, or apply it in a different situation.</p>
        <p>A teacher explains a subject. A tutor diagnoses your particular confusion. The key is a conversation in which you explain your thinking, receive feedback, and try again.</p>
        <ol><li>Explain a concept in your own words.</li><li>Answer a question that tests your understanding.</li><li>Receive feedback on what is correct and missing.</li><li>Work through an example or practical problem.</li><li>Explain the concept again without notes.</li></ol>
        <Prompt>{`Act as my one-on-one tutor for [TOPIC OR CONCEPT].\n\nAsk one question at a time. Do not lecture or immediately reveal answers. Make me explain my reasoning, identify gaps and incorrect assumptions, and use progressively harder questions.\n\nIf I am wrong, offer a hint or smaller example before explaining. End by summarizing what I understand, misunderstand, and should practise next.`}</Prompt>

        <Image src="/images/blog/personal-ai-university-roles.png" alt="Five AI learning roles connected to one learner" width={1200} height={675} className="my-12 rounded-lg" />

        <SectionTitle>5. Role Four: The Editor</SectionTitle>
        <p>Understanding a subject is one achievement. Producing excellent work is another. You may understand software architecture but design a poorly structured system, or know English grammar but struggle to write a clear professional email.</p>
        <p>The editor closes the gap between knowing and delivering. Instead of asking, “Is this good?”, give AI a focused task. Ask it to identify failure scenarios, security weaknesses, performance bottlenecks, weak arguments, repetition, unclear explanations, or unnecessary detail.</p>
        <p>AI can suggest changes, but it does not know your full context or priorities. Review its feedback and keep ownership of the final result.</p>
        <Prompt>{`Act as a rigorous editor and reviewer of my [CODE / ARTICLE / DESIGN / PROPOSAL]. My audience is [AUDIENCE] and my goal is [OBJECTIVE].\n\nReview for factual errors, gaps in reasoning, weak structure, repetition, ambiguous language, missing details, and practical risks. Give a prioritized critique with examples, then suggest improvements.\n\nPreserve my meaning and voice. Separate definite errors from subjective suggestions. I make the final decisions.`}</Prompt>

        <SectionTitle>6. Role Five: The Roommate</SectionTitle>
        <p>The roommate helps you see the world differently. Conversations with people from other fields can introduce new ideas about design, craftsmanship, aesthetics, entrepreneurship, strategy, and more.</p>
        <p>Ask AI to explore meaningful connections between fields. What can software engineers learn from architects about durable systems? What can cooking teach about time, constraints, and resources? What can product designers learn from game designers about engagement?</p>
        <p>The goal is not to force a connection. It is to examine alternative viewpoints and see whether they reveal something useful.</p>
        <Prompt>{`Act as my intellectually curious roommate. My main field is [YOUR FIELD].\n\nExplore another field, such as psychology, economics, architecture, music, biology, history, design, or philosophy. Find a meaningful connection to my work, challenge my assumptions, and use concrete examples.\n\nDistinguish established knowledge from speculation. Make it a conversation and start with one surprising but useful connection.`}</Prompt>

        <SectionTitle>7. Combine the Five Roles Into One System</SectionTitle>
        <p>These roles work best together. The Advisor chooses the destination. The Librarian selects trustworthy resources. The Tutor tests your understanding. The Editor improves your output. The Roommate expands your perspective.</p>
        <p>For database performance, your Advisor could create a path through query execution, indexes, transactions, connection pooling, and analysis. Your Librarian selects official documentation and examples. Your Tutor asks you to read execution plans. Your Editor reviews your optimizations. Your Roommate connects database work with queueing theory or economics.</p>
        <p>Repeat the cycle as you advance. The Advisor updates the plan when you discover gaps, the Librarian finds the right material, and the Tutor and Editor turn knowledge into ability.</p>

        <SectionTitle>8. Automate the Plan So You Can Focus on Learning</SectionTitle>
        <p>A plan is useful only if you follow it. With the right integrations and permissions, an AI assistant can save your curriculum to a document, organize it by week, add study sessions to your calendar, and schedule reminders.</p>
        <p>You can begin without automation. A simple document, calendar, and checklist are enough. Spend less time organizing the idea of learning and more time learning.</p>

        <SectionTitle>9. A Simple Weekly Routine</SectionTitle>
        <Image src="/images/blog/personal-ai-university-system.png" alt="A weekly AI-assisted learning workflow at a desk" width={1200} height={675} className="my-10 rounded-lg" />
        <div className="not-prose grid gap-3 sm:grid-cols-2">
          {[['Mon', 'Plan and learn', 'Review your milestone, study the first topic, and write down questions.'], ['Tue–Wed', 'Study and practise', 'Use selected resources and the tutor to uncover knowledge gaps.'], ['Thu', 'Build or explain', 'Complete an exercise, solve a problem, or explain it without notes.'], ['Fri', 'Review and improve', 'Ask the editor to identify the most important corrections.'], ['Weekend', 'Reflect and connect', 'Check the milestone, revise weak areas, and explore another field.']].map(([day, title, description]) => <div key={day} className="rounded-lg border border-[var(--border)] bg-[var(--surface)] p-5"><p className="m-0 text-sm font-semibold text-[var(--accent)]">{day}</p><h3 className="mt-2 text-lg font-semibold text-[var(--text)]">{title}</h3><p className="mt-2 text-sm leading-6 text-[var(--muted)]">{description}</p></div>)}
        </div>
        <p>Treat this as a starting point, not a rigid schedule. Do not move on just because the week ended. If you cannot demonstrate the skill, revisit the material or practise with new examples.</p>

        <SectionTitle>10. AI Is a Learning Partner, Not an Infallible Authority</SectionTitle>
        <ul><li><strong>Verify important claims.</strong> Check consequential facts against reliable original sources.</li><li><strong>Practise without AI.</strong> Periodically solve problems and explain concepts independently.</li><li><strong>Demand evidence.</strong> Ask for reasoning and uncertainties behind recommendations.</li><li><strong>Keep human judgment.</strong> AI feedback informs decisions, but you are responsible for the final result.</li><li><strong>Measure ability, not activity.</strong> Videos watched and lessons completed are not proof of competence.</li></ul>
        <p>The purpose is not to make AI do your thinking. It is to make your own thinking, practise, and learning more effective.</p>

        <SectionTitle>The Best Learning System Is the One You Start Using</SectionTitle>
        <p>You do not need to implement all five roles perfectly. Start with one subject, define one meaningful goal, and use AI to take the next step.</p>
        <p>You can spend weeks collecting resources and designing the perfect curriculum. Or you can choose a destination, begin with a manageable lesson, and improve your approach as you go.</p>
        <p><strong>Your personal university does not begin when the plan is perfect. It begins when you start learning.</strong></p>
      </div>
    </article>
  );
}
