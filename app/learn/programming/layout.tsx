import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata("Programming Learning Paths", "Choose a beginner-friendly programming roadmap for web development, backend engineering, DevOps, databases, and system design.", "/learn/programming");

export default function ProgrammingLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children;
}
