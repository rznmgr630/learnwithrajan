import Image from "next/image";
import Link from "next/link";

export const metadata = { title: "Blog | Learn with Rajan", description: "Practical notes on building and learning software." };

export default function BlogPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 sm:py-16">
      <div className="max-w-2xl"><p className="text-sm font-medium text-[var(--accent)]">Notes from the journey</p><h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">Blog</h1><p className="mt-3 text-[var(--muted)]">Beginner-friendly guides for building software and understanding how it works.</p></div>
      <div className="mt-10 space-y-5">
        <Link href="/blog/ai-engineer-roadmap-2027" className="group block overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface)] transition hover:border-[var(--accent)] hover:shadow-lg">
          <div className="grid sm:grid-cols-[220px_1fr]"><Image src="/images/blog/ai-engineer-roadmap-cover.png" alt="Illustration of an AI engineer learning roadmap" width={1200} height={675} className="h-48 w-full object-cover sm:h-full" /><div className="p-6"><div className="flex gap-3 text-xs font-medium text-[var(--accent)]"><span>AI Engineering</span><span className="text-[var(--muted)]">15 min read</span></div><h2 className="mt-3 text-xl font-semibold group-hover:text-[var(--accent)]">AI Engineer Roadmap 2027: From Beginner to Builder</h2><p className="mt-2 text-sm leading-6 text-[var(--muted)]">A practical path from software foundations to safe, useful AI products.</p></div></div>
        </Link>
        <Link href="/blog/cicd-github-actions-beginners" className="group block overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface)] transition hover:border-[var(--accent)] hover:shadow-lg">
          <div className="grid sm:grid-cols-[220px_1fr]"><Image src="/images/blog/cicd-github-actions-cover.png" alt="Illustration of a CI/CD pipeline" width={1200} height={675} className="h-48 w-full object-cover sm:h-full" /><div className="p-6"><div className="flex gap-3 text-xs font-medium text-[var(--accent)]"><span>DevOps</span><span className="text-[var(--muted)]">12 min read</span></div><h2 className="mt-3 text-xl font-semibold group-hover:text-[var(--accent)]">CI/CD Explained: A Beginner-Friendly Guide with GitHub Actions</h2><p className="mt-2 text-sm leading-6 text-[var(--muted)]">Learn how automated checks, pull requests, and deployments work together to keep your code safe.</p></div></div>
        </Link>
      </div>
    </div>
  );
}
