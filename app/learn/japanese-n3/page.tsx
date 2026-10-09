import { LearnBackNav } from "@/components/learn/LearnBackNav";
import { JapaneseN3Roadmap } from "@/components/learn/JapaneseN3Roadmap";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata("JLPT N3 Japanese Roadmap", "Study for JLPT N3 with structured lessons, vocabulary, kanji, grammar, and weekly practice.", "/learn/japanese-n3");

export default function JapaneseN3Page() {
  return (
    <div>
      <div className="border-b border-[var(--border)] bg-[color-mix(in_oklab,var(--surface)_85%,transparent)]">
        <div className="mx-auto flex max-w-5xl items-center gap-4 px-4 py-4 sm:px-6">
          <LearnBackNav href="/learn/language" labelKey="learn.backLanguage" />
        </div>
      </div>
      <JapaneseN3Roadmap />
    </div>
  );
}
