import type { LessonDay, LessonQuizQuestion } from "@/lib/learn/lesson-types";
import type { LocalizedString } from "@/lib/i18n/types";

export const text = (en: string): LocalizedString => ({ en, np: en, jp: en });
export const quiz = (question: string, answer: string): LessonQuizQuestion => ({ question: text(question), options: [text(answer)], correctIndex: 0, explanation: text(answer) });
export const foundationLesson = (day: number, title: string, topic: string, detail: string): LessonDay => ({
  day, title: text(title), totalMinutes: 60, difficulty: text("Beginner"),
  lessons: [{ id: topic.toLowerCase().replaceAll(" ", "-"), title: text(topic), durationMinutes: 25, explanation: text(detail), diagram: "React / TypeScript\n       ↓\nReact Native runtime\n       ↓\niOS and Android UI", codeExample: { title: text("Practice"), code: "import { Text, View } from \"react-native\";\n\nexport function Screen() {\n  return <View><Text>Hello</Text></View>;\n}" }, keyTakeaways: [text("Build the mental model before adding features."), text("Test the same idea on iOS and Android.")], commonMistakes: [text("Treating React Native as browser React."), text("Ignoring native platform behavior.")], quiz: [quiz("What should you understand first?", "The React Native runtime and how it maps React code to native UI.")] }],
  finalQuiz: [quiz("What is the main goal of this day?", "Understand the foundation before building on it.")],
  project: { name: text("Foundation check"), goal: text("Explain the core idea in your own words."), brief: text("Run the example and identify each layer involved."), steps: [text("Run the example."), text("Change one value."), text("Explain what changes on screen.")], acceptance: [text("The example runs."), text("You can explain the mental model.")] },
});
