import { LearnBackNav } from "@/components/learn/LearnBackNav";
import { QAFlashcards } from "@/components/learn/QAFlashcards";
import { JAPANESE_INTERVIEW_QA } from "@/lib/japanese-learning/interview-qa-data";

export const metadata = { title: "Japanese · Interview Practice" };

export default function JapaneseInterviewPage() {
  return (
    <div>
      <div className="border-b border-[var(--border)] bg-[color-mix(in_oklab,var(--surface)_85%,transparent)]">
        <div className="mx-auto flex max-w-5xl items-center gap-4 px-4 py-4 sm:px-6">
          <LearnBackNav href="/learn/language" labelKey="learn.backLanguage" />
        </div>
      </div>
      <QAFlashcards
        title="Interview Practice"
        subtitle="Common self-introduction interview questions with Japanese and Nepali answers — click a question to reveal its answer."
        items={JAPANESE_INTERVIEW_QA}
      />
    </div>
  );
}
