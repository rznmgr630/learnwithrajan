import { LearnBackNav } from "@/components/learn/LearnBackNav";
import { JapaneseN4Roadmap } from "@/components/learn/JapaneseN4Roadmap";

export default function JapaneseN4Page() {
  return (
    <div>
      <div className="border-b border-[var(--border)] bg-[color-mix(in_oklab,var(--surface)_85%,transparent)]">
        <div className="mx-auto flex max-w-5xl items-center gap-4 px-4 py-4 sm:px-6">
          <LearnBackNav />
        </div>
      </div>
      <JapaneseN4Roadmap />
    </div>
  );
}
