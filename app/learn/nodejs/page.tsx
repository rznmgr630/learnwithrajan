import { LearnBackNav } from "@/components/learn/LearnBackNav";
import { NodejsRoadmap } from "@/components/learn/NodejsRoadmap";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata("Node.js Roadmap", "Learn Node.js from fundamentals to production APIs, databases, authentication, testing, and deployment.", "/learn/nodejs");

export default function LearnNodejsPage() {
  return (
    <div>
      <div className="border-b border-[var(--border)] bg-[color-mix(in_oklab,var(--surface)_85%,transparent)]">
        <div className="mx-auto flex max-w-5xl items-center gap-4 px-4 py-4 sm:px-6">
          <LearnBackNav href="/learn/programming" labelKey="learn.backProgramming" />
        </div>
      </div>
      <NodejsRoadmap />
    </div>
  );
}
