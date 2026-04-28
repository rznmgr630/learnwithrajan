import Link from "next/link";
import { JapaneseRoadmap } from "@/components/learn/JapaneseRoadmap";

export default function JapaneseN5Page() {
  return (
    <div>
      <div className="border-b border-neutral-800 bg-neutral-950/80">
        <div className="mx-auto flex max-w-5xl items-center gap-4 px-4 py-4 sm:px-6">
          <Link href="/learn" className="text-sm text-neutral-500 transition hover:text-neutral-300">
            ← Learning hub
          </Link>
        </div>
      </div>
      <JapaneseRoadmap />
    </div>
  );
}
