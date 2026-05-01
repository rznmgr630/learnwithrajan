/** Topic buckets for the Programming hub stats line (Next.js track). */

export type NextjsTopicOutline = {
  id: string;
  title: string;
  bullets: string[];
};

export const NEXTJS_TOPIC_OUTLINE: NextjsTopicOutline[] = [
  {
    id: "framework",
    title: "Framework role",
    bullets: ["React UI", "routing", "bundling", "prod builds"],
  },
  {
    id: "app-router",
    title: "App Router",
    bullets: ["Segments", "dynamic routes", "not-found", "groups", "_private"],
  },
  {
    id: "shell",
    title: "Layouts & SEO",
    bullets: ["layout.tsx", "metadata", "generateMetadata", "Link"],
  },
  {
    id: "ux",
    title: "Loading & errors",
    bullets: ["loading.tsx", "Suspense", "streaming", "error.tsx"],
  },
  {
    id: "advanced",
    title: "Advanced & data",
    bullets: ["Parallel routes", "handlers", "cookies", "middleware", "fetch cache"],
  },
];

export function nextjsOutlineTopicCount(outline: NextjsTopicOutline[]): number {
  return outline.length;
}

export function nextjsOutlineBulletCount(outline: NextjsTopicOutline[]): number {
  return outline.reduce((n, m) => n + m.bullets.length, 0);
}
