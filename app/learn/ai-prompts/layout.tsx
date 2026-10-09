import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata("AI Prompt Guide", "Learn practical prompting techniques for getting clearer, more useful results from AI tools.", "/learn/ai-prompts");

export default function AiPromptsLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children;
}
