import { LearnBackNav } from "@/components/learn/LearnBackNav";
import { ReactRoadmap } from "@/components/learn/ReactRoadmap";

export default function LearnReactPage() {
  return (
    <div>
      <div className="border-b border-[var(--border)] bg-[color-mix(in_oklab,var(--surface)_85%,transparent)]">
        <div className="mx-auto flex max-w-5xl items-center gap-4 px-4 py-4 sm:px-6">
          <LearnBackNav href="/learn/programming" labelKey="learn.backProgramming" />
        </div>
      </div>
      <ReactRoadmap />
    </div>
  );
}
