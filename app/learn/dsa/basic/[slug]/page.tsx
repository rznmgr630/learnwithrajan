import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { DSAProblemDetail } from "@/components/learn/DSAProblemDetail";
import { DSA_BASIC_PROBLEMS } from "@/lib/dsa/dsa-problems";

export function generateStaticParams() {
  return DSA_BASIC_PROBLEMS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const problem = DSA_BASIC_PROBLEMS.find((p) => p.slug === slug);
  if (!problem) return { title: "Problem not found" };

  const description = problem.description.split("\n")[0].replaceAll("**", "");
  const path = `/learn/dsa/basic/${problem.slug}`;

  return {
    title: `${problem.title} — DSA`,
    description,
    alternates: { canonical: path },
    openGraph: { title: `${problem.title} — DSA`, description, url: path },
  };
}

export default async function DSABasicProblemPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const problem = DSA_BASIC_PROBLEMS.find((p) => p.slug === slug);

  if (!problem) notFound();

  return <DSAProblemDetail problem={problem} backHref="/learn/dsa/basic" />;
}
