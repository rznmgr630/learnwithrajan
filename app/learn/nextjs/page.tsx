import { LearnBackNav } from "@/components/learn/LearnBackNav";
import { NextjsRoadmap } from "@/components/learn/NextjsRoadmap";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata("Next.js Roadmap", "Learn Next.js with a practical roadmap covering App Router, data fetching, APIs, authentication, and deployment.", "/learn/nextjs");

export default function LearnNextjsPage() {
  return (
    <div>
      <div className="border-b border-[var(--border)] bg-[color-mix(in_oklab,var(--surface)_85%,transparent)]">
        <div className="mx-auto flex max-w-5xl items-center gap-4 px-4 py-4 sm:px-6">
          <LearnBackNav href="/learn/programming" labelKey="learn.backProgramming" />
        </div>
      </div>
      <NextjsRoadmap />
    </div>
  );
}
