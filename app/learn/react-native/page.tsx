import { LearnBackNav } from "@/components/learn/LearnBackNav";
import { ReactNativeRoadmap } from "@/components/learn/ReactNativeRoadmap";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata("React Native Roadmap", "Learn React Native from fundamentals to building, testing, and shipping mobile apps for iOS and Android.", "/learn/react-native");

export default function LearnReactNativePage() {
  return (
    <div>
      <div className="border-b border-[var(--border)] bg-[color-mix(in_oklab,var(--surface)_85%,transparent)]">
        <div className="mx-auto flex max-w-5xl items-center gap-4 px-4 py-4 sm:px-6">
          <LearnBackNav href="/learn/programming" labelKey="learn.backProgramming" />
        </div>
      </div>
      <ReactNativeRoadmap />
    </div>
  );
}
