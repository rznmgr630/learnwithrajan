import { BlogPostList } from "@/components/blog/BlogPostList";

export const metadata = { title: "Blog | Learn with Rajan", description: "Practical notes on building and learning software." };

export default function BlogPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 sm:py-16">
      <div className="max-w-2xl"><p className="text-sm font-medium text-[var(--accent)]">Notes from the journey</p><h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">Blog</h1><p className="mt-3 text-[var(--muted)]">Beginner-friendly guides for building software and understanding how it works.</p></div>
      <BlogPostList />
    </div>
  );
}
