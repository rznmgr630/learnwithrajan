import Image from "next/image";
import Link from "next/link";
import { Source_Serif_4 } from "next/font/google";

export const metadata = {
  title: "How to Build a Reading Habit That Actually Lasts | Learn with Rajan",
  description: "A practical, pressure-free system for building a reading habit you can return to.",
};

const sourceSerif = Source_Serif_4({ subsets: ["latin"], weight: "variable", style: ["normal", "italic"] });

function SectionTitle({ children }: { children: string }) {
  return <h2 className="mt-14 border-t border-[var(--border)] pt-7 text-2xl font-semibold leading-tight tracking-tight text-[var(--text)] sm:text-3xl">{children}</h2>;
}

function Subheading({ children }: { children: string }) {
  return <h3 className="mt-9 text-xl font-semibold leading-tight text-[var(--text)]">{children}</h3>;
}

export default function ReadingHabitPage() {
  return (
    <article className="mx-auto max-w-5xl px-4 py-10 sm:px-6 sm:py-14">
      <div className="mx-auto max-w-3xl">
        <Link href="/blog" className="text-sm text-[var(--muted)] transition hover:text-[var(--text)]">← Back to blog</Link>
        <p className="mt-7 text-xs font-semibold tracking-[0.18em] text-[var(--accent)]">READING · 12 MIN READ</p>
        <h1 className="mt-4 max-w-2xl text-4xl font-semibold leading-[1.08] tracking-tight text-[var(--text)] sm:text-6xl">How to Build a Reading Habit That Actually Lasts</h1>
        <p className="mt-6 max-w-xl text-xl leading-8 text-[var(--muted)]">A gentle system for making reading easy to return to, even after a busy day or a missed week.</p>
      </div>
      <Image src="/images/blog/reading-habit-cover.png" alt="A calm reading chair with an open book and warm evening light" width={1200} height={675} priority className="mx-auto mt-10 aspect-[16/8] w-full rounded-lg object-cover shadow-2xl shadow-black/15" />

      <div className={`${sourceSerif.className} prose mx-auto mt-10 max-w-2xl prose-p:text-[1.125rem] prose-p:text-[var(--muted)] prose-p:leading-8 prose-strong:font-semibold prose-strong:text-[var(--text)] prose-li:text-[1.05rem] prose-li:leading-8 prose-li:text-[var(--muted)] dark:prose-invert`}>
        <SectionTitle>You Don&apos;t Have a Reading Problem. You Have a Returning Problem.</SectionTitle>
        <p className="first-letter:mr-2 first-letter:float-left first-letter:text-5xl first-letter:font-semibold first-letter:leading-[0.8] first-letter:text-[var(--text)]">How many books have you started with excitement but never finished? You read a few pages, perhaps several chapters, then life gets busy. A missed day becomes a missed week, and the book becomes decoration.</p>
        <p>That does not mean you are lazy or lack discipline. The problem is often that returning to a book feels harder than reaching for your phone.</p>
        <p>Most advice focuses on volume: ten pages a day, thirty minutes, fifty books a year. Those goals can help, but they miss the hardest part.</p>
        <p><strong>The hardest part is not reading today&apos;s pages. It is opening the book again tomorrow.</strong></p>
        <p>Build a system that makes returning feel natural, even when you are tired, distracted, or have not read for several days.</p>

        <SectionTitle>1. Stop Reading While You&apos;re Still Curious</SectionTitle>
        <p>When a book is good, it is tempting to continue until you are exhausted. Then tomorrow&apos;s reading begins with resistance. Instead, stop while a little curiosity is still alive.</p>
        <p>Do not wait until you are bored or rereading the same sentence. Stop where you still want to know what happens next.</p>
        <p>For fiction, this could be after an unexpected revelation, in the middle of an important scene, or when a character is about to make a difficult decision. For nonfiction, stop after an interesting idea and ask whether you agree, how you could apply it, or what the author will explain next.</p>
        <p>The goal is not to leave every chapter unfinished. It is to avoid making exhaustion the normal ending of every session. You want tomorrow to begin with curiosity, not resistance.</p>

        <SectionTitle>2. Create a Curiosity Bookmark</SectionTitle>
        <p>A bookmark can be more than a marker for the page. Before closing your book, write one short question on it or on a sticky note.</p>
        <Image src="/images/blog/reading-curiosity-bookmark.png" alt="An open book with a curiosity bookmark" width={1200} height={675} className="my-10 rounded-lg" />
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="border-y border-[var(--border)] py-5"><h3 className="m-0 text-xl font-semibold text-[var(--text)]">For fiction</h3><ul><li>What was behind the door?</li><li>Is the character telling the truth?</li><li>Why did she disappear?</li></ul></div>
          <div className="border-y border-[var(--border)] py-5"><h3 className="m-0 text-xl font-semibold text-[var(--text)]">For nonfiction</h3><ul><li>How can I use this idea?</li><li>Will the author prove this point?</li><li>What is the next step?</li></ul></div>
        </div>
        <p>Keep it short. Four or five words are enough. The question reminds you what interested you and gives your attention somewhere to go. You leave yourself an invitation instead of another task.</p>

        <SectionTitle>3. Make Your Book Easier to Reach Than Your Phone</SectionTitle>
        <p>When two activities compete for attention, the easier one usually wins. If your phone is beside your pillow and your book is hidden in a cupboard, you will reach for the phone without thinking.</p>
        <Image src="/images/blog/reading-environment.png" alt="A book within reach and phone placed away in a bag" width={1200} height={675} className="my-10 rounded-lg" />
        <Subheading>Put the book where the habit happens</Subheading>
        <p>Keep it beside your bed if you read at night, by your tea spot if you read with tea, or in the bag you actually carry if you read on your commute. You can even place it on your pillow in the morning, so it becomes a reminder at night.</p>
        <Subheading>Give your phone one extra step</Subheading>
        <ul><li>Place it on a table away from your bed.</li><li>Put it inside your bag.</li><li>Turn the screen face down.</li><li>Use focus mode if notifications distract you.</li></ul>
        <p><strong>Do not make every reading session a battle between willpower and your phone. Change the setup so reading has an advantage.</strong></p>

        <SectionTitle>4. Don&apos;t Expect One Book to Match Every Mood</SectionTitle>
        <p>Your attention changes through the day. A detailed history or difficult novel may be perfect on a quiet morning but too demanding late at night. That does not make you a bad reader.</p>
        <Subheading>Level 1: A demanding book</Subheading><p>A challenging novel, detailed history, or complex nonfiction work for when you have energy to focus.</p>
        <Subheading>Level 2: An accessible book</Subheading><p>An engaging novel, practical book, or biography for an ordinary day.</p>
        <Subheading>Level 3: A low-effort book</Subheading><p>A comic, short stories, poetry, or short essays for tired days.</p>
        <p><strong>A few pages of an enjoyable book are better than abandoning reading because you lack energy for a demanding one.</strong></p>

        <SectionTitle>5. When You Miss a Day, Don&apos;t Punish Yourself</SectionTitle>
        <p>One missed day does not have to become a missed week. Do not promise an ambitious recovery plan or wait for Monday. <strong>When you miss a day, do not catch up. Just return.</strong></p>
        <Subheading>Try the five-minute rescue</Subheading>
        <ol><li>Open your book to the bookmark.</li><li>Read the question you left yourself.</li><li>Set a timer for five minutes.</li><li>Read until the timer ends.</li><li>Stop without guilt if you want to.</li></ol>
        <p>Sometimes five minutes becomes twenty. Sometimes it stays five. Both outcomes count because the point is making restarting easy. Never turn a fragile habit into a punishment.</p>

        <SectionTitle>6. Track Your Returns, Not Your Pages</SectionTitle>
        <p>You do not need a spreadsheet recording every page, minute, chapter, and book. Draw seven empty circles on your bookmark. Each day you return to your book, color one circle.</p>
        <p>It does not matter whether you read five minutes or fifty. Ask what made reading easier, when you enjoyed it most, what distracted you, and what helped you return after a busy day. Improve the system instead of judging yourself.</p>

        <SectionTitle>7. Follow a Seven-Day Reading Reset</SectionTitle>
        <ol><li><strong>Day 1:</strong> Choose a book you genuinely want to read.</li><li><strong>Day 2:</strong> Create your curiosity bookmark.</li><li><strong>Day 3:</strong> Put the book in the right place.</li><li><strong>Day 4:</strong> Move your phone away.</li><li><strong>Day 5:</strong> Prepare a lighter reading option.</li><li><strong>Day 6:</strong> Practice the five-minute rescue.</li><li><strong>Day 7:</strong> Review what made returning easiest.</li></ol>
        <p>You do not need a perfect routine. You need a routine that fits your actual life.</p>

        <SectionTitle>The Real Goal Is to Become Someone Who Returns</SectionTitle>
        <p>You do not become a reader only when you finish fifty books a year. You become a reader every time you return to the next page.</p>
        <ol><li>Stop while you are still curious.</li><li>Leave a question on your bookmark.</li><li>Make your book easier to reach than distractions.</li><li>Match your book to your energy.</li><li>Use the five-minute rescue after a missed day.</li></ol>
        <p>Make it easy to begin. Make it enjoyable to continue. Most importantly, make it easy to return.</p>
        <p><strong>Tonight, choose one book, write your first curiosity question, and leave it somewhere you will see it tomorrow.</strong></p>
      </div>
    </article>
  );
}
