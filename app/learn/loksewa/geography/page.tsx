import { LearnBackNav } from "@/components/learn/LearnBackNav";
import { LoksewaGeographyQA } from "@/components/learn/LoksewaGeographyQA";

export const metadata = { title: "Loksewa · Geography Q&A" };

export default function LoksewaGeographyPage() {
  return (
    <div>
      <div className="border-b border-[var(--border)] bg-[color-mix(in_oklab,var(--surface)_85%,transparent)]">
        <div className="mx-auto flex max-w-5xl items-center gap-4 px-4 py-4 sm:px-6">
          <LearnBackNav href="/learn/loksewa" labelKey="learn.backLoksewa" />
        </div>
      </div>
      <LoksewaGeographyQA />
    </div>
  );
}
