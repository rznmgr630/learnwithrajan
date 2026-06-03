export type JsTopicOutline = {
  id: string;
  title: string;
  bullets: string[];
};

export const JS_TOPIC_OUTLINE: JsTopicOutline[] = [
  {
    id: "syntax",
    title: "Syntax & types",
    bullets: ["variables", "data types", "type coercion", "operators"],
  },
  {
    id: "functions",
    title: "Functions & scope",
    bullets: ["scope", "hoisting", "closures", "HOF", "currying"],
  },
  {
    id: "data-structures",
    title: "Objects & Arrays",
    bullets: ["destructuring", "spread/rest", "array methods", "deep clone"],
  },
  {
    id: "oop",
    title: "OOP & this",
    bullets: ["this keyword", "prototypes", "classes", "inheritance"],
  },
  {
    id: "async",
    title: "Async & event loop",
    bullets: ["promises", "async/await", "event loop", "microtasks"],
  },
  {
    id: "advanced",
    title: "Advanced JS",
    bullets: ["TypeScript", "Proxy/Reflect", "generators", "design patterns"],
  },
];

export function jsOutlineTopicCount(outline: JsTopicOutline[]): number {
  return outline.length;
}

export function jsOutlineBulletCount(outline: JsTopicOutline[]): number {
  return outline.reduce((n, m) => n + m.bullets.length, 0);
}
