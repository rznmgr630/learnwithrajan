import { DevopsRoadmap } from "@/components/learn/DevopsRoadmap";
import { LearnBackNav } from "@/components/learn/LearnBackNav";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata("DevOps Roadmap", "A beginner-friendly DevOps roadmap covering Linux, Git, Docker, CI/CD, cloud, monitoring, and production workflows.", "/learn/devops");

export default function DevopsPage() {
  return (
    <div>
      <div className="border-b border-[var(--border)] bg-[color-mix(in_oklab,var(--surface)_85%,transparent)]">
        <div className="mx-auto flex max-w-5xl items-center gap-4 px-4 py-4 sm:px-6">
          <LearnBackNav href="/learn/programming" labelKey="learn.backProgramming" />
        </div>
      </div>
      <DevopsRoadmap />
    </div>
  );
}
