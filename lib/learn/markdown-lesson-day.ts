import type { LessonDay, LessonQuizQuestion } from "@/lib/learn/lesson-types";
import type { LocalizedString } from "@/lib/i18n/types";
import type { ReactNativeFinalQuizQuestion } from "@/lib/react-native-learning/react-native-final-quizzes";

const local = (en: string): LocalizedString => ({ en, np: en, jp: en });

const reviewQuestion = (topic: string): LessonQuizQuestion => ({
  question: local(`What is the main idea behind ${topic}?`),
  options: [local("Explain what it does, why it matters, and when to use it.")],
  correctIndex: 0,
  explanation: local("Explain what it does, why it matters, and when to use it."),
});

function firstCodeBlock(markdown: string): string {
  return markdown.match(/```(?:tsx|ts|text|css)?\n([\s\S]*?)```/)?.[1].trim() ?? "Review the explanation and build the example yourself.";
}

export function markdownLessonDay(day: number, title: string, markdown: string, finalQuiz?: ReactNativeFinalQuizQuestion[]): LessonDay {
  const lessonSource = markdown.split("## Final project")[0];
  const matches = [...lessonSource.matchAll(/### \d+\.\s+([^\n]+)\n([\s\S]*?)(?=\n---\n\n### \d+\.|$)/g)];
  const lessons = matches.map((match, index) => {
    const lessonTitle = match[1].replaceAll("`", "").trim();
    const explanation = match[2].trim();
    return {
      id: `day-${day}-${index + 1}`,
      title: local(lessonTitle),
      durationMinutes: 6,
      explanation: local(explanation),
      diagram: firstCodeBlock(explanation.match(/```text\n[\s\S]*?```/)?.[0] ?? ""),
      codeExample: { title: local(`${lessonTitle} example`), code: firstCodeBlock(explanation) },
      keyTakeaways: [local(`Understand the purpose and important props of ${lessonTitle}.`)],
      commonMistakes: [local(`Using ${lessonTitle} without considering platform behavior, accessibility, or layout constraints.`)],
      quiz: [reviewQuestion(lessonTitle)],
    };
  });
  const projectMarkdown = markdown.includes("## Final project")
    ? markdown.slice(markdown.indexOf("## Final project")).trim()
    : "Build a responsive screen using the concepts from this day.";

  return {
    day,
    title: local(title),
    totalMinutes: 60,
    difficulty: local("Intermediate"),
    lessons,
    finalQuiz: finalQuiz?.map((item) => ({
      question: local(item.question),
      options: item.options.map(local),
      correctIndex: item.correctIndex,
      explanation: local(item.explanation),
    })) ?? lessons.map((lesson) => reviewQuestion(typeof lesson.title === "string" ? lesson.title : lesson.title.en)),
    project: {
      name: local("Responsive profile screen"),
      goal: local("Build a responsive profile screen using the Day 3 components and layout APIs."),
      brief: local(projectMarkdown),
      steps: [local("Build the profile screen from the supplied requirements."), local("Test narrow and wide layouts."), local("Test on iOS and Android.")],
      acceptance: [local("All supplied requirements and self-check points are covered.")],
    },
  };
}
