import { LoksewaHubPage } from "@/components/learn/LoksewaHubPage";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata("Loksewa Preparation", "Prepare for Nepal Loksewa exams with structured general knowledge and IT Officer practice materials.", "/learn/loksewa");

export default function LearnLoksewaPage() {
  return <LoksewaHubPage />;
}
