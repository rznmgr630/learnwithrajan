import { LearnBackNav } from "@/components/learn/LearnBackNav";
import { JapaneseRoadmap } from "@/components/learn/JapaneseRoadmap";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata("JLPT N5 Japanese Roadmap", "Start learning Japanese for JLPT N5 with daily lessons, vocabulary, kanji, grammar, and practice tests.", "/learn/japanese-n5");

export default function JapaneseN5Page() {
  return (
    <div>
      <div className="border-b border-[var(--border)] bg-[color-mix(in_oklab,var(--surface)_85%,transparent)]">
        <div className="mx-auto flex max-w-5xl items-center gap-4 px-4 py-4 sm:px-6">
          <LearnBackNav href="/learn/language" labelKey="learn.backLanguage" />
        </div>
      </div>
      <JapaneseRoadmap />
    </div>
  );
}
