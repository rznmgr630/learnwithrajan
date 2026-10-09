import { LearnBackNav } from "@/components/learn/LearnBackNav";
import { JsRoadmap } from "@/components/learn/JsRoadmap";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata("JavaScript Roadmap", "Learn modern JavaScript from fundamentals to advanced browser, async, and TypeScript-ready skills.", "/learn/javascript");

export default function LearnJavaScriptPage() {
  return (
    <div>
      <div className="border-b border-[var(--border)] bg-[color-mix(in_oklab,var(--surface)_85%,transparent)]">
        <div className="mx-auto flex max-w-5xl items-center gap-4 px-4 py-4 sm:px-6">
          <LearnBackNav href="/learn/programming" labelKey="learn.backProgramming" />
        </div>
      </div>
      <JsRoadmap />
    </div>
  );
}
