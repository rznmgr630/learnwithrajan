/** Topic buckets for the Laravel hub stats line (mirrors React outline pattern). */

export type LaravelTopicOutline = {
  id: string;
  title: string;
  bullets: string[];
};

export const LARAVEL_TOPIC_OUTLINE: LaravelTopicOutline[] = [
  {
    id: "foundation",
    title: "Foundation",
    bullets: ["MVC", "Composer & vendor", "Artisan", ".env", "maintenance mode"],
  },
  {
    id: "http-layer",
    title: "HTTP layer",
    bullets: ["Routing", "Controllers", "Middleware", "Request / URL helpers"],
  },
  {
    id: "presentation",
    title: "Presentation",
    bullets: ["Blade", "Components", "Validation & forms"],
  },
  {
    id: "data",
    title: "Data",
    bullets: ["Query Builder", "Eloquent", "Relationships", "CRUD"],
  },
  {
    id: "integrations",
    title: "Session, i18n & integrations",
    bullets: ["Session & flash", "Localization", "HTTP client", "Mail", "Fluent strings", "Stubs"],
  },
];

export function laravelOutlineTopicCount(outline: LaravelTopicOutline[]): number {
  return outline.length;
}

export function laravelOutlineBulletCount(outline: LaravelTopicOutline[]): number {
  return outline.reduce((n, m) => n + m.bullets.length, 0);
}
