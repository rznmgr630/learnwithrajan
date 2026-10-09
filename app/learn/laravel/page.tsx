import { LearnBackNav } from "@/components/learn/LearnBackNav";
import { LaravelRoadmap } from "@/components/learn/LaravelRoadmap";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata("Laravel Roadmap", "Learn Laravel from beginner to production-ready developer with a structured hands-on roadmap.", "/learn/laravel");

export default function LearnLaravelPage() {
  return (
    <div>
      <div className="border-b border-[var(--border)] bg-[color-mix(in_oklab,var(--surface)_85%,transparent)]">
        <div className="mx-auto flex max-w-5xl items-center gap-4 px-4 py-4 sm:px-6">
          <LearnBackNav href="/learn/programming" labelKey="learn.backProgramming" />
        </div>
      </div>
      <LaravelRoadmap />
    </div>
  );
}
