import { GitRoadmap } from "@/components/learn/GitRoadmap";
import { LearnBackNav } from "@/components/learn/LearnBackNav";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata("Learn Git in 7 Days", "A beginner-friendly seven-day Git roadmap covering commits, branches, merges, pull requests, and collaboration.", "/learn/git-7-days");

export default function Git7DaysPage() {
  return (
    <div>
      <div className="border-b border-[var(--border)] bg-[color-mix(in_oklab,var(--surface)_85%,transparent)]">
        <div className="mx-auto flex max-w-5xl items-center gap-4 px-4 py-4 sm:px-6">
          <LearnBackNav href="/learn/programming" labelKey="learn.backProgramming" />
        </div>
      </div>
      <GitRoadmap />
    </div>
  );
}
