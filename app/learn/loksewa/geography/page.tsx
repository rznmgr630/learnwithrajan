import { LearnBackNav } from "@/components/learn/LearnBackNav";
import { QAFlashcards } from "@/components/learn/QAFlashcards";
import { LOKSEWA_GEOGRAPHY_QA } from "@/lib/loksewa-learning/geography-qa-data";

export const metadata = { title: "Loksewa · Geography Q&A" };

export default function LoksewaGeographyPage() {
  return (
    <div>
      <div className="border-b border-[var(--border)] bg-[color-mix(in_oklab,var(--surface)_85%,transparent)]">
        <div className="mx-auto flex max-w-5xl items-center gap-4 px-4 py-4 sm:px-6">
          <LearnBackNav href="/learn/loksewa" labelKey="learn.backLoksewa" />
        </div>
      </div>
      <QAFlashcards
        title="Geography Questions & Answer"
        subtitle="General knowledge Q&A for Loksewa prep — click a question to reveal its answer."
        items={LOKSEWA_GEOGRAPHY_QA}
      />
    </div>
  );
}
