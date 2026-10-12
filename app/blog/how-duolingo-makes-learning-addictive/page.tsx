import Image from "next/image";
import Link from "next/link";
import { Source_Serif_4 } from "next/font/google";

export const metadata = {
  title: "How Duolingo Makes Learning Addictive | Learn with Rajan",
  description: "What Duolingo's design teaches us about accessible, engaging, and meaningful learning.",
};

const sourceSerif = Source_Serif_4({ subsets: ["latin"], weight: "variable", style: ["normal", "italic"] });

function SectionTitle({ children }: { children: string }) {
  return <h2 className="mt-14 border-t border-[var(--border)] pt-7 text-2xl font-semibold tracking-tight text-[var(--text)] sm:text-3xl">{children}</h2>;
}

export default function DuolingoLearningPage() {
  return (
    <article className="mx-auto max-w-5xl px-4 py-10 sm:px-6 sm:py-14">
      <div className="mx-auto max-w-3xl">
        <Link href="/blog" className="text-sm text-[var(--muted)] hover:text-[var(--text)]">← Back to blog</Link>
        <p className="mt-7 text-xs font-semibold tracking-[0.18em] text-[var(--accent)]">LEARNING · 15 MIN READ</p>
        <h1 className="mt-4 max-w-2xl text-4xl font-semibold leading-[1.08] tracking-tight text-[var(--text)] sm:text-6xl">How Duolingo Makes Learning Addictive and What We Can Learn From It</h1>
        <p className="mt-6 max-w-xl text-xl leading-8 text-[var(--muted)]">Duolingo borrows the best parts of games and mobile products to make learning easier to return to.</p>
      </div>
      <Image src="/images/blog/duolingo-learning-cover.png" alt="Learner using a language-learning app with a progress path" width={1200} height={675} priority className="mt-10 aspect-[16/8] w-full rounded-lg object-cover shadow-2xl shadow-black/15" />

      <div className={`${sourceSerif.className} prose mx-auto mt-10 max-w-2xl prose-p:text-[1.125rem] prose-p:text-[var(--muted)] prose-p:leading-8 prose-strong:font-semibold prose-strong:text-[var(--text)] prose-li:text-[1.05rem] prose-li:leading-8 prose-li:text-[var(--muted)] dark:prose-invert`}>
        <p className="first-letter:mr-2 first-letter:float-left first-letter:text-5xl first-letter:font-semibold first-letter:leading-[0.8] first-letter:text-[var(--text)]">Most people know they should spend more time learning and less time scrolling. But knowing what is good for us does not always mean we will do it.</p>
        <p>We may open our phones intending to study for ten minutes, then find ourselves scrolling for an hour. The problem is not always motivation. Often, learning is simply less engaging than the distractions competing for our attention.</p>
        <p>Duolingo approached this challenge differently. Instead of asking people to fight their phones, it built an educational experience using techniques from social media and mobile games, while keeping a larger mission: make education accessible regardless of financial circumstances.</p>

        <SectionTitle>1. Education Can Either Reduce Inequality or Reinforce It</SectionTitle>
        <p>Duolingo co-founder Luis von Ahn grew up in Guatemala, where access to high-quality education can depend heavily on money. People with resources can afford better schools and opportunities, while people with fewer resources are often left with less.</p>
        <p>His experience shaped a long-term goal: give more people access to education. Building schools everywhere would be expensive, so the team began with one skill that could travel through a device people already owned.</p>

        <SectionTitle>2. Why Duolingo Started With Language Learning</SectionTitle>
        <p>Language learning had a huge potential audience and a direct economic benefit. English, for example, can help a waiter qualify for a hotel role serving international guests. It was a practical starting point for a skill that many people wanted and could use to improve their lives.</p>

        <SectionTitle>3. Smartphones Made Education Easier to Distribute</SectionTitle>
        <p>Smartphones offered a way to reach people without requiring a nearby school or expensive class. That made education easier to distribute, but access alone was not enough. The product also needed a model that could stay available to people who could not pay.</p>

        <SectionTitle>4. The Freemium Model Helps Support Free Education</SectionTitle>
        <p>Duolingo&apos;s core experience is free, while subscriptions pay for extras such as an ad-free experience. Paying users, often from wealthier countries, help support access for users who cannot afford to pay.</p>
        <p>The wider lesson is that a product with public benefit does not have to be funded only by the people who need it most. A thoughtful business model can widen access.</p>

        <SectionTitle>5. Making Education Compete With Entertainment</SectionTitle>
        <p>Phones offer endless entertainment with quick rewards and novelty. Learning often needs repetition and effort before its rewards are visible. Duolingo borrowed engagement techniques from games and social products, not just to make people open the app, but to help them return regularly.</p>

        <SectionTitle>6. Streaks Turn Learning Into a Daily Habit</SectionTitle>
        <p>A streak makes an invisible habit visible. When a learner practices each day, the number grows. On a low-motivation day, not wanting to lose that progress can be enough to complete a short lesson.</p>
        <Image src="/images/blog/duolingo-learning-streak.png" alt="A learner following a weekly language-learning streak" width={1200} height={675} className="my-10 rounded-lg" />
        <p>Streaks should support learning, not replace it. Missing a day does not erase knowledge. <strong>Make progress visible, but keep the real objective in focus.</strong></p>

        <SectionTitle>7. Notifications Work Best When They Support an Existing Intention</SectionTitle>
        <p>Notifications become annoying when they interrupt people without value. They can help when someone already wants to learn but forgets to make time. A reminder near the time a person studied yesterday can fit naturally into an existing routine.</p>
        <p>The lesson is not to use guilt. Use reminders that are relevant, timely, limited, and connected to an activity the person values.</p>

        <SectionTitle>8. A Memorable Personality Makes a Product Feel Human</SectionTitle>
        <p>Duolingo&apos;s green owl gives its reminders a recognizable personality. Instead of a generic system message, users receive a nudge from a familiar character. Tone, humor, and continuity can make a routine interaction feel more engaging.</p>
        <p>Personality cannot rescue a poor learning experience, but it can strengthen a product that already offers real value.</p>

        <SectionTitle>9. An Educational Product Does Not Have to Beat TikTok at Everything</SectionTitle>
        <p>Education may not always win on immediate entertainment. It has another advantage: after a learning session, people can feel that they gained something meaningful. The goal is not to make education more addictive than every entertainment product. It is to make learning engaging enough that people return and can feel its value.</p>

        <SectionTitle>10. Gamification Works Especially Well for Repetition</SectionTitle>
        <p>Vocabulary, elementary mathematics, reading, and programming all improve through repeated practice. Repetition can become boring, which is where careful gamification can help.</p>
        <Image src="/images/blog/duolingo-gamified-practice.png" alt="Gamified learning practice with repeated cards and visible progress" width={1200} height={675} className="my-10 rounded-lg" />
        <ul><li><strong>Vocabulary:</strong> show progress for practicing and remembering words.</li><li><strong>Mathematics:</strong> give immediate feedback and gradually harder problems.</li><li><strong>Reading:</strong> track consistent sessions and celebrate milestones.</li><li><strong>Programming:</strong> use small challenges and unlock more complex work as skills grow.</li></ul>
        <p>Points, badges, and streaks only matter when they connect to progress in the underlying skill. Complex concepts may need other tools, such as clear explanations and videos.</p>

        <SectionTitle>11. What We Can Apply to Our Own Learning</SectionTitle>
        <ul><li><strong>Make the goal small enough to repeat.</strong> Ten consistent minutes beats an ambitious plan that burns out.</li><li><strong>Make progress visible.</strong> Use a calendar, checklist, or habit tracker.</li><li><strong>Choose a reliable time.</strong> Attach study to a routine you already have.</li><li><strong>Use reminders thoughtfully.</strong> Set them when you are realistically available.</li><li><strong>Reward the behavior, not only the result.</strong> Showing up counts.</li></ul>

        <SectionTitle>Conclusion: Make Learning Accessible, Engaging, and Meaningful</SectionTitle>
        <p>Duolingo shows that access to education means more than putting lessons online. The product must be affordable, convenient, and engaging enough for people to return.</p>
        <p>Technology can support meaningful behavior rather than merely compete for attention. The challenge is not simply to give everyone access to learning. It is to build experiences that help people want to learn and keep coming back to it.</p>
      </div>
    </article>
  );
}
