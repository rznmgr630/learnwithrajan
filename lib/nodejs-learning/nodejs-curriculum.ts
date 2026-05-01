/** Topic buckets for the Node.js programming hub stats line. */

export type NodejsTopicOutline = {
  id: string;
  title: string;
  bullets: string[];
};

export const NODEJS_TOPIC_OUTLINE: NodejsTopicOutline[] = [
  {
    id: "runtime",
    title: "Runtime & modules",
    bullets: ["Event loop", "CommonJS", "core modules", "npm"],
  },
  {
    id: "apis",
    title: "HTTP & Express",
    bullets: ["REST", "middleware", "routing", "validation"],
  },
  {
    id: "data",
    title: "MongoDB stack",
    bullets: ["Mongoose", "validation", "relations", "auth"],
  },
  {
    id: "quality",
    title: "Quality & ship",
    bullets: ["Errors", "Jest", "integration tests", "deploy"],
  },
];

export function nodejsOutlineTopicCount(outline: NodejsTopicOutline[]): number {
  return outline.length;
}

export function nodejsOutlineBulletCount(outline: NodejsTopicOutline[]): number {
  return outline.reduce((n, m) => n + m.bullets.length, 0);
}
