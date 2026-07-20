import { notFound } from "next/navigation";
import { LoksewaITOfficerPage } from "@/components/learn/LoksewaITOfficerPage";
import { IT_OFFICER_CONCEPTS } from "@/lib/loksewa-learning/it-officer-syllabus-data";

export function generateStaticParams() {
  return IT_OFFICER_CONCEPTS.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const concept = IT_OFFICER_CONCEPTS.find((c) => c.slug === slug);
  return { title: concept ? `${concept.title} — Loksewa IT Officer Syllabus` : "Loksewa · Master IT Officer Syllabus" };
}

export default async function LoksewaITOfficerConceptRoute({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const concept = IT_OFFICER_CONCEPTS.find((c) => c.slug === slug);

  if (!concept) notFound();

  return <LoksewaITOfficerPage activeConcept={concept} />;
}
