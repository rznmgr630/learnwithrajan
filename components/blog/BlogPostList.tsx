"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

const posts = [
  {
    href: "/blog/software-engineering-career-ai-era",
    image: "/images/blog/software-engineering-career-cover.png",
    alt: "Illustration of a software engineering career path",
    category: "Career",
    readTime: "12 min read",
    title: "How to Build a Software Engineering Career in the AI Era",
    description: "Build durable skills, choose a specialty, and create projects that prove your engineering judgment.",
  },
  {
    href: "/blog/ai-engineer-roadmap-2027",
    image: "/images/blog/ai-engineer-roadmap-cover.png",
    alt: "Illustration of an AI engineer learning roadmap",
    category: "AI Engineering",
    readTime: "15 min read",
    title: "AI Engineer Roadmap 2027: From Beginner to Builder",
    description: "A practical path from software foundations to safe, useful AI products.",
  },
  {
    href: "/blog/cicd-github-actions-beginners",
    image: "/images/blog/cicd-github-actions-cover.png",
    alt: "Illustration of a CI/CD pipeline",
    category: "DevOps",
    readTime: "12 min read",
    title: "CI/CD Explained: A Beginner-Friendly Guide with GitHub Actions",
    description: "Learn how automated checks, pull requests, and deployments work together to keep your code safe.",
  },
] as const;

const categories = ["All", ...new Set(posts.map((post) => post.category))] as const;
type Category = (typeof categories)[number];
const categoryStorageKey = "blog:selected-category";
const postsPerPage = 8;

export function BlogPostList() {
  const [selectedCategory, setSelectedCategory] = useState<Category>("All");
  const [currentPage, setCurrentPage] = useState(1);
  const filteredPosts = selectedCategory === "All" ? posts : posts.filter((post) => post.category === selectedCategory);
  const totalPages = Math.ceil(filteredPosts.length / postsPerPage);
  const visiblePosts = filteredPosts.slice((currentPage - 1) * postsPerPage, currentPage * postsPerPage);

  useEffect(() => {
    const savedCategory = window.sessionStorage.getItem(categoryStorageKey);
    if (savedCategory && categories.includes(savedCategory as Category)) setSelectedCategory(savedCategory as Category);
  }, []);

  function selectCategory(category: Category) {
    window.sessionStorage.setItem(categoryStorageKey, category);
    setSelectedCategory(category);
    setCurrentPage(1);
  }

  return (
    <>
      <div className="mt-8 flex flex-wrap gap-2" aria-label="Blog categories">
        {categories.map((category) => {
          const isSelected = category === selectedCategory;

          return (
            <button
              key={category}
              type="button"
              onClick={() => selectCategory(category)}
              aria-pressed={isSelected}
              className={`rounded-full border px-4 py-2 text-sm font-medium transition ${isSelected ? "border-[var(--accent)] bg-[var(--accent)] text-white" : "border-[var(--border)] bg-[var(--surface)] text-[var(--muted)] hover:border-[var(--accent)] hover:text-[var(--text)]"}`}
            >
              {category}
            </button>
          );
        })}
      </div>

      <div className="mt-6 space-y-5">
        {visiblePosts.map((post) => (
          <Link key={post.href} href={post.href} className="group block overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface)] transition hover:border-[var(--accent)] hover:shadow-lg">
            <div className="grid sm:grid-cols-[220px_1fr]">
              <Image src={post.image} alt={post.alt} width={1200} height={675} className="h-48 w-full object-cover sm:h-full" />
              <div className="p-6">
                <div className="flex gap-3 text-xs font-medium text-[var(--accent)]"><span>{post.category}</span><span className="text-[var(--muted)]">{post.readTime}</span></div>
                <h2 className="mt-3 text-xl font-semibold group-hover:text-[var(--accent)]">{post.title}</h2>
                <p className="mt-2 text-sm leading-6 text-[var(--muted)]">{post.description}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {totalPages > 1 ? (
        <nav className="mt-8 flex items-center justify-center gap-2" aria-label="Blog pagination">
          <button type="button" onClick={() => setCurrentPage((page) => page - 1)} disabled={currentPage === 1} className="rounded-lg border border-[var(--border)] px-3 py-2 text-sm font-medium text-[var(--muted)] transition hover:border-[var(--accent)] hover:text-[var(--text)] disabled:cursor-not-allowed disabled:opacity-40">Previous</button>
          {Array.from({ length: totalPages }, (_, index) => index + 1).map((page) => (
            <button key={page} type="button" onClick={() => setCurrentPage(page)} aria-current={page === currentPage ? "page" : undefined} className={`h-9 w-9 rounded-lg border text-sm font-medium transition ${page === currentPage ? "border-[var(--accent)] bg-[var(--accent)] text-white" : "border-[var(--border)] text-[var(--muted)] hover:border-[var(--accent)] hover:text-[var(--text)]"}`}>{page}</button>
          ))}
          <button type="button" onClick={() => setCurrentPage((page) => page + 1)} disabled={currentPage === totalPages} className="rounded-lg border border-[var(--border)] px-3 py-2 text-sm font-medium text-[var(--muted)] transition hover:border-[var(--accent)] hover:text-[var(--text)] disabled:cursor-not-allowed disabled:opacity-40">Next</button>
        </nav>
      ) : null}
    </>
  );
}
