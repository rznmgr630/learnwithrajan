import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata("Language Learning", "Learn Japanese and English through beginner-friendly lessons, vocabulary practice, and clear explanations.", "/learn/language");

export default function LanguageLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children;
}
