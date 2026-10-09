import { LearningHubPage } from "@/components/learn/LearningHubPage";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata("Learning Hub", "Free, beginner-friendly learning paths for programming, Japanese, DevOps, personal development, and Loksewa preparation.", "/learn");

export default function LearnPage() {
  return <LearningHubPage />;
}
