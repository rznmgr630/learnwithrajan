import { DuolingoPage } from "@/components/learn/DuolingoPage";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata("Duolingo Japanese Meanings", "Understand Japanese words and phrases from Duolingo with clear English meanings and examples.", "/learn/duolingo");

export default function DuolingoLearnPage() {
  return <DuolingoPage />;
}
