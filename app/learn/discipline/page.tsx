import { DisciplinePage } from "@/components/learn/DisciplinePage";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata("Build Discipline", "Practical lessons and exercises for building discipline, consistency, and better daily habits.", "/learn/discipline");

export default function DisciplineRoute() {
  return <DisciplinePage />;
}
