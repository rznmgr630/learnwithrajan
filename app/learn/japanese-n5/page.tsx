import { LearnBackNav } from "@/components/learn/LearnBackNav";
import { JapaneseRoadmap } from "@/components/learn/JapaneseRoadmap";

export default function JapaneseN5Page() {
  return (
    <div>
      <div className="border-b border-neutral-800 bg-neutral-950/80">
        <div className="mx-auto flex max-w-5xl items-center gap-4 px-4 py-4 sm:px-6">
          <LearnBackNav />
        </div>
      </div>
      <JapaneseRoadmap />
    </div>
  );
}
