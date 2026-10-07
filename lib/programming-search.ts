import type { RoadmapWeek } from "@/lib/challenge-data";
import { LARAVEL_ROADMAP_WEEKS } from "@/lib/laravel-learning/laravel-challenge-data";
import { NESTJS_ROADMAP_WEEKS } from "@/lib/nestjs-learning/nestjs-challenge-data";
import { NEXTJS_ROADMAP_WEEKS } from "@/lib/nextjs-learning/nextjs-challenge-data";
import { NODEJS_ROADMAP_WEEKS } from "@/lib/nodejs-learning/nodejs-challenge-data";
import { REACT_ROADMAP_WEEKS } from "@/lib/react-learning/react-challenge-data";
import { DEVOPS_ROADMAP_WEEKS } from "@/lib/devops-learning/devops-challenge-data";
import { SYSTEM_DESIGN_CONCEPTS } from "@/lib/system-design/concepts";

export type ProgrammingSearchTrack = {
  title: string;
  href: string;
};

export const PROGRAMMING_SEARCH_TRACKS: ProgrammingSearchTrack[] = [
  { title: "React", href: "/learn/react" },
  { title: "JavaScript", href: "/learn/javascript" },
  { title: "React Native", href: "/learn/react-native" },
  { title: "Next.js", href: "/learn/nextjs" },
  { title: "Backend Engineering", href: "/learn/backend-engineering" },
  { title: "Laravel", href: "/learn/laravel" },
  { title: "Node.js", href: "/learn/nodejs" },
  { title: "NestJS", href: "/learn/nestjs" },
  { title: "Python", href: "/learn/python" },
  { title: "SQL", href: "/learn/sql" },
  { title: "MongoDB", href: "/learn/mongodb" },
  { title: "Supabase", href: "/learn/supabase" },
  { title: "RabbitMQ", href: "/learn/rabbitmq" },
  { title: "Kafka", href: "/learn/kafka" },
  { title: "DevOps", href: "/learn/devops" },
  { title: "Data Structures and Algorithms", href: "/learn/dsa" },
  { title: "Compiler", href: "/learn/compiler" },
  { title: "Git", href: "/learn/git-7-days" },
  { title: "System Design", href: "/learn/system-design" },
];

export type ProgrammingSearchRoadmap = {
  track: string;
  href: string;
  weeks: RoadmapWeek[];
};

export const PROGRAMMING_SEARCH_ROADMAPS: ProgrammingSearchRoadmap[] = [
  { track: "React", href: "/learn/react", weeks: REACT_ROADMAP_WEEKS },
  { track: "Next.js", href: "/learn/nextjs", weeks: NEXTJS_ROADMAP_WEEKS },
  { track: "Laravel", href: "/learn/laravel", weeks: LARAVEL_ROADMAP_WEEKS },
  { track: "Node.js", href: "/learn/nodejs", weeks: NODEJS_ROADMAP_WEEKS },
  { track: "NestJS", href: "/learn/nestjs", weeks: NESTJS_ROADMAP_WEEKS },
  { track: "DevOps", href: "/learn/devops", weeks: DEVOPS_ROADMAP_WEEKS },
];

export const PROGRAMMING_SEARCH_TOPICS: ProgrammingSearchTrack[] = SYSTEM_DESIGN_CONCEPTS.map((concept) => ({
  title: concept.title,
  href: `/learn/system-design?concept=${concept.id}`,
}));
