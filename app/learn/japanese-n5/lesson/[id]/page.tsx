import { notFound } from "next/navigation";
import { N5LessonAccordionPage } from "@/components/learn/N5LessonAccordionPage";
import { getLessonPage, N5_LESSON_PAGES } from "@/lib/japanese-learning/n5/n5-lesson-pages";
import { twentyKanjiForDay } from "@/lib/japanese-learning/n5/n5-kanji-pool";

export function generateStaticParams() {
  return N5_LESSON_PAGES.map((l) => ({ id: String(l.id) }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const lesson = getLessonPage(parseInt(id, 10));
  return {
    title: lesson ? `${lesson.title} — JLPT N5` : "N5 Lesson not found",
  };
}

export default async function N5LessonPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const lessonId = parseInt(id, 10);
  if (Number.isNaN(lessonId)) notFound();

  const lesson = getLessonPage(lessonId);
  if (!lesson) notFound();

  const kanjiItems = twentyKanjiForDay(lessonId);

  return <N5LessonAccordionPage lesson={lesson} kanjiItems={kanjiItems} />;
}
