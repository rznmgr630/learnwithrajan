import { LearnBackNav } from "@/components/learn/LearnBackNav";
import { NestjsRoadmap } from "@/components/learn/NestjsRoadmap";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata("NestJS Roadmap", "Learn NestJS from fundamentals to building maintainable APIs, authentication, testing, and deployment.", "/learn/nestjs");

export default function LearnNestjsPage() {
  return (
    <div>
      <div className="border-b border-[var(--border)] bg-[color-mix(in_oklab,var(--surface)_85%,transparent)]">
        <div className="mx-auto flex max-w-5xl items-center gap-4 px-4 py-4 sm:px-6">
          <LearnBackNav href="/learn/programming" labelKey="learn.backProgramming" />
        </div>
      </div>
      <NestjsRoadmap />
    </div>
  );
}
