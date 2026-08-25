import { LearnBackNav } from "@/components/learn/LearnBackNav";
import { QAFlashcards } from "@/components/learn/QAFlashcards";
import { LOKSEWA_ETHNIC_GROUPS_QA } from "@/lib/loksewa-learning/ethnic-groups-qa-data";

export const metadata = { title: "Loksewa · Ethnic Groups Q&A" };

export default function LoksewaEthnicGroupsPage() {
  return (
    <div>
      <div className="border-b border-[var(--border)] bg-[color-mix(in_oklab,var(--surface)_85%,transparent)]">
        <div className="mx-auto flex max-w-5xl items-center gap-4 px-4 py-4 sm:px-6">
          <LearnBackNav href="/learn/loksewa" labelKey="learn.backLoksewa" />
        </div>
      </div>
      <QAFlashcards
        title="Ethnic Groups of Nepal"
        subtitle="Customs, festivals and settlements of Nepal's ethnic groups — Q&A for Loksewa prep."
        items={LOKSEWA_ETHNIC_GROUPS_QA}
      />
    </div>
  );
}
