"use client";

import { useEffect, useState } from "react";
import { LessonDayDetail } from "@/components/learn/LessonDayDetail";
import type { LessonDay, LessonProject, LessonQuizQuestion } from "@/lib/learn/lesson-types";

const same = (en: string) => ({ en, np: en, jp: en });

function fieldStart(source: string, field: string): number {
  const match = new RegExp(`\\b${field}\\s*:\\s*`).exec(source);
  return match ? match.index + match[0].length : -1;
}

function balancedAt(source: string, start: number, open: string, close: string): string {
  if (source[start] !== open) return "";

  let depth = 0;
  let quote = "";
  for (let index = start; index < source.length; index += 1) {
    const char = source[index];
    if (quote) {
      if (char === "\\") index += 1;
      else if (char === quote) quote = "";
      continue;
    }
    if (char === '"' || char === "'" || char === "`") {
      quote = char;
      continue;
    }
    if (char === open) depth += 1;
    if (char === close) depth -= 1;
    if (depth === 0) return source.slice(start + 1, index);
  }
  return "";
}

function fieldArray(source: string, field: string): string {
  const start = fieldStart(source, field);
  return start === -1 ? "" : balancedAt(source, start, "[", "]");
}

function fieldObject(source: string, field: string): string {
  const start = fieldStart(source, field);
  return start === -1 ? "" : balancedAt(source, start, "{", "}");
}

function blocks(source: string): string[] {
  const result: string[] = [];
  for (let index = 0; index < source.length; index += 1) {
    if (source[index] !== "{") continue;
    const block = balancedAt(source, index, "{", "}");
    if (!block) continue;
    result.push(block);
    index += block.length + 1;
  }
  return result;
}

function textField(source: string, field: string): string {
  const start = fieldStart(source, field);
  if (start === -1) return "";
  const delimiter = source[start];
  if (delimiter !== '"' && delimiter !== "`") return "";
  const content = source.slice(start + 1);
  const end = delimiter === "`"
    ? content.search(/`(?=,\s*(?:\n\s*[A-Za-z_$][\w$]*\s*:|}))/)
    : content.indexOf(delimiter);
  return end === -1 ? "" : content.slice(0, end).trim();
}

function sectionContent(source: string, title: string): string {
  return blocks(fieldArray(source, "sections"))
    .find((section) => textField(section, "title") === title)
    ?.trim() ?? "";
}

function parseSectionLesson(source: string, index: number) {
  const duration = Number(source.match(/duration:\s*"(\d+)/)?.[1] ?? 0);
  const quizText = sectionContent(source, "Mini Quiz");

  return {
    id: `lesson-${source.match(/id:\s*(\d+)/)?.[1] ?? index + 1}`,
    title: same(textField(source, "title") || "Lesson"),
    durationMinutes: duration,
    explanation: same(sectionContent(source, "Explanation")),
    diagram: sectionContent(source, "Visual Diagram"),
    codeExample: { title: same("Code example"), code: sectionContent(source, "Code Example") },
    keyTakeaways: [same(sectionContent(source, "Key Takeaways"))].filter((item) => item.en.length > 0),
    commonMistakes: [same(sectionContent(source, "Common Mistakes"))].filter((item) => item.en.length > 0),
    quiz: [],
    rawMiniQuiz: quizText ? same(quizText) : undefined,
  };
}

function day26FinalQuiz(): LessonQuizQuestion[] {
  return [
    { question: same("Which collection is designed to count repeated values?"), options: [same("Counter"), same("deque"), same("namedtuple"), same("range")], correctIndex: 0, explanation: same("Counter stores counts for each value.") },
    { question: same("When is defaultdict(list) a good fit?"), options: [same("Grouping values under keys"), same("Sorting numbers"), same("Reading files"), same("Creating classes")], correctIndex: 0, explanation: same("It creates an empty list for each new grouping key.") },
    { question: same("Why use a deque for a queue?"), options: [same("Fast work at both ends"), same("It automatically sorts items"), same("It only stores strings"), same("It replaces dictionaries")], correctIndex: 0, explanation: same("deque supports efficient appends and removals from either end.") },
    { question: same("What is the main benefit of iterator pipelines?"), options: [same("They can process data without loading all of it at once"), same("They always make code faster"), same("They convert every value to a list"), same("They remove validation")], correctIndex: 0, explanation: same("Iterators can reduce memory use by producing values as needed.") },
  ];
}

function day29FinalQuiz(): LessonQuizQuestion[] {
  return [
    { question: same("Which logging level is usually used for detailed diagnostic information?"), options: [same("DEBUG"), same("WARNING"), same("ERROR"), same("CRITICAL")], correctIndex: 0, explanation: same("DEBUG records detailed information useful while diagnosing behavior.") },
    { question: same("What does a logging handler do?"), options: [same("Sends log records to an output destination"), same("Changes Python syntax"), same("Stores environment variables"), same("Creates a virtual environment")], correctIndex: 0, explanation: same("Handlers decide where log records go, such as the console or a file.") },
    { question: same("Which call records a stack trace with an exception?"), options: [same("logger.exception(...)"), same("logger.debug(...)"), same("print(...)"), same("raise logger")], correctIndex: 0, explanation: same("logger.exception records the active exception and traceback inside an except block.") },
    { question: same("Why prefer logging over print in production code?"), options: [same("Logging has levels, routing, and structured context"), same("print cannot show strings"), same("Logging removes all errors"), same("print only works on Windows")], correctIndex: 0, explanation: same("Logging can be filtered, formatted, written to destinations, and searched later.") },
  ];
}

function parseSectionDay(source: string, day: number): LessonDay {
  const lessons = blocks(fieldArray(source, "lessons")).map(parseSectionLesson);
  const isCollectionsDay = day === 26;
  const isLoggingDay = day === 29;

  return {
    day,
    title: same(textField(source, "title") || "Python lesson"),
    totalMinutes: Number(source.match(/duration:\s*"(\d+)/)?.[1] ?? 0),
    difficulty: same(textField(source, "level") || "Beginner"),
    lessons,
    finalQuiz: isCollectionsDay ? day26FinalQuiz() : isLoggingDay ? day29FinalQuiz() : [],
    project: isCollectionsDay ? {
      name: same("Log Processing Pipeline"),
      goal: same("Process a large stream of delivery events with the right collection and itertools tools."),
      brief: same("Build a small command-line report that groups, counts, and processes delivery events without loading unnecessary intermediate data."),
      steps: [same("Read delivery events as an iterator."), same("Count event types with Counter."), same("Group package IDs with defaultdict(list)."), same("Use deque as a fixed-size recent-event queue."), same("Process a transformed iterator pipeline and print a summary.")],
      acceptance: [same("The report uses Counter and defaultdict for their natural jobs."), same("A deque keeps recent events."), same("At least one itertools tool processes values lazily."), same("The final output reports counts and grouped package data.")],
      stretch: [same("Use islice to inspect only the first 100 failed events."), same("Add a namedtuple or dataclass event record.")],
    } : isLoggingDay ? {
      name: same("Production Log Pipeline"),
      goal: same("Configure clear, searchable logs for a delivery-processing script."),
      brief: same("Replace ad-hoc prints with a logger that writes useful context to the console and a file while preserving exception details."),
      steps: [same("Create a named logger for the delivery tracker."), same("Add console and file handlers with readable formatters."), same("Log normal processing at INFO level and detailed data at DEBUG level."), same("Wrap one risky operation in try/except and use logger.exception."), same("Include package ID and event type in relevant log messages.")],
      acceptance: [same("Logs appear in both the console and a file."), same("Log levels are used consistently."), same("Exceptions include a traceback in the log."), same("Each package event includes enough context to investigate later.")],
      stretch: [same("Emit JSON-like structured log fields."), same("Add a rotating file handler for long-running processing.")],
    } : undefined,
  };
}

function strings(source: string): string[] {
  return source
    .split("\n")
    .map((line) => line.trim().match(/^"(.*)"[,]?$/)?.[1])
    .filter((item): item is string => Boolean(item));
}

function normalizeRichText(text: string): string {
  return text
    .replace(/<br\s*\/?>(?:\r?\n)?/gi, "\n")
    .replace(/<code>([\s\S]*?)<\/code>/gi, "`$1`");
}

function quiz(source: string, field: string): LessonQuizQuestion[] {
  return blocks(fieldArray(source, field)).map((block) => {
    const question = block.match(/question:\s*"([\s\S]*?)",\s*options:/)?.[1] ?? "";
    const explanation = block.match(/explanation:\s*"([\s\S]*?)"\s*$/)?.[1] ?? "";
    return {
      question: same(question),
      options: strings(fieldArray(block, "options")).map(same),
      correctIndex: Number(block.match(/correctIndex:\s*(\d+)/)?.[1] ?? 0),
      explanation: same(explanation),
    };
  });
}

function project(source: string): LessonProject | undefined {
  const rawProject = fieldObject(source, "project");
  if (!rawProject) return undefined;
  return {
    name: same(textField(rawProject, "name")),
    goal: same(textField(rawProject, "goal")),
    brief: same(normalizeRichText(textField(rawProject, "brief"))),
    steps: strings(fieldArray(rawProject, "steps")).map(same),
    acceptance: strings(fieldArray(rawProject, "acceptance")).map(same),
    stretch: strings(fieldArray(rawProject, "stretch")).map(same),
  };
}

function parse(source: string, day: number): LessonDay {
  if (source.includes("sections: [")) return parseSectionDay(source, day);

  const lessons = blocks(fieldArray(source, "lessons")).map((block, index) => ({
    id: textField(block, "id") || `lesson-${index + 1}`,
    title: same(textField(block, "title") || "Lesson"),
    durationMinutes: Number(block.match(/durationMinutes:\s*(\d+)/)?.[1] ?? 0),
    explanation: same(normalizeRichText(textField(block, "explanation"))),
    diagram: textField(block, "diagram"),
    codeExample: { title: same("Code example"), code: textField(block, "codeExample") },
    keyTakeaways: strings(fieldArray(block, "keyTakeaways")).map(same),
    commonMistakes: strings(fieldArray(block, "commonMistakes")).map(same),
    quiz: quiz(block, "quizzes"),
  }));

  return {
    day,
    title: same(textField(source, "topic") || "Python lesson"),
    totalMinutes: Number(source.match(/totalMinutes:\s*(\d+)/)?.[1] ?? 0),
    difficulty: same(textField(source, "difficulty") || "Beginner"),
    lessons,
    finalQuiz: quiz(source, "finalQuiz"),
    project: project(source),
  };
}

export function RawPythonLessonDay({ day, onClose }: { day: number; onClose: () => void }) {
  const [lessonDay, setLessonDay] = useState<LessonDay | null>(null);

  useEffect(() => {
    let active = true;
    fetch(`/python-lessons/day-${day}.ts.txt`)
      .then((response) => response.text())
      .then((source) => active && setLessonDay(parse(source, day)));
    return () => {
      active = false;
    };
  }, [day]);

  return lessonDay ? (
    <LessonDayDetail open onClose={onClose} day={lessonDay} previousDay={null} nextDay={null} onNavigateDay={() => undefined} track="python" />
  ) : null;
}
