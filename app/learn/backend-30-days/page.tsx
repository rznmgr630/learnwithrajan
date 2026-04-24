import Link from "next/link";
import { BackendRoadmap } from "@/components/learn/BackendRoadmap";

export default function Backend30DaysPage() {
  return (
    <div>
      <div className="border-b border-neutral-800 bg-neutral-950/80">
        <div className="mx-auto flex max-w-5xl items-center gap-4 px-4 py-4 sm:px-6">
          <Link
            href="/learn"
            className="text-sm text-neutral-500 transition hover:text-neutral-300"
          >
            ← Learning hub
          </Link>
        </div>
      </div>
      <BackendRoadmap />
    </div>
  );
}
