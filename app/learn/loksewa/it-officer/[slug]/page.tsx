import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { LoksewaITOfficerPage } from "@/components/learn/LoksewaITOfficerPage";
import { IT_OFFICER_CONCEPTS } from "@/lib/loksewa-learning/it-officer-syllabus-data";

export function generateStaticParams() {
  return IT_OFFICER_CONCEPTS.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const concept = IT_OFFICER_CONCEPTS.find((c) => c.slug === slug);
  if (!concept) return { title: "Loksewa · Master IT Officer Syllabus" };

  const description = `${concept.title} for the Loksewa IT Officer syllabus, with beginner-friendly explanations and practice.`;
  const path = `/learn/loksewa/it-officer/${concept.slug}`;

  return {
    title: `${concept.title} — Loksewa IT Officer Syllabus`,
    description,
    alternates: { canonical: path },
    openGraph: { title: `${concept.title} — Loksewa IT Officer Syllabus`, description, url: path },
  };
}

export default async function LoksewaITOfficerConceptRoute({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const concept = IT_OFFICER_CONCEPTS.find((c) => c.slug === slug);

  if (!concept) notFound();

  return <LoksewaITOfficerPage activeConcept={concept} />;
}
