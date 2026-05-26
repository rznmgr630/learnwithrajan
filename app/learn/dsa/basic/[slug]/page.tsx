import { notFound } from "next/navigation";
import { DSAProblemDetail } from "@/components/learn/DSAProblemDetail";
import { DSA_BASIC_PROBLEMS } from "@/lib/dsa/dsa-problems";

export function generateStaticParams() {
  return DSA_BASIC_PROBLEMS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const problem = DSA_BASIC_PROBLEMS.find((p) => p.slug === slug);
  return { title: problem ? `${problem.title} — DSA` : "Problem not found" };
}

export default async function DSABasicProblemPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const problem = DSA_BASIC_PROBLEMS.find((p) => p.slug === slug);

  if (!problem) notFound();

  return <DSAProblemDetail problem={problem} backHref="/learn/dsa/basic" />;
}
