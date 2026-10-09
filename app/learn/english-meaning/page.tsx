import { EnglishMeaningPage } from "@/components/learn/EnglishMeaningPage";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata("English Word Meanings", "Learn clear English word meanings, examples, and practical usage for everyday communication.", "/learn/english-meaning");

export default function EnglishMeaningLearnPage() {
  return <EnglishMeaningPage />;
}
