import { BackendRoadmap } from "@/components/learn/BackendRoadmap";
import { LearnBackNav } from "@/components/learn/LearnBackNav";

export default function Backend30DaysPage() {
  return (
    <div>
      <div className="border-b border-neutral-800 bg-neutral-950/80">
        <div className="mx-auto flex max-w-5xl items-center gap-4 px-4 py-4 sm:px-6">
          <LearnBackNav />
        </div>
      </div>
      <BackendRoadmap />
    </div>
  );
}
