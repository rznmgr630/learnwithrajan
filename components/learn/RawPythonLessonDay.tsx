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
  const end = source.indexOf(delimiter, start + 1);
  return end === -1 ? "" : source.slice(start + 1, end).trim();
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

function parse(source: string, day: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9): LessonDay {
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

export function RawPythonLessonDay({ day, onClose }: { day: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9; onClose: () => void }) {
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
