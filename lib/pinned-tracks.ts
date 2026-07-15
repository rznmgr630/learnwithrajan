import type { UiStringKey } from "@/lib/i18n/catalog";

export interface PinnableTrackMeta {
  id: string;
  href: string;
  titleKey?: UiStringKey;
  title?: string;
  groupKey: UiStringKey;
}

export const PINNABLE_TRACKS: PinnableTrackMeta[] = [
  { id: "react", href: "/learn/react", titleKey: "hub.react.title", groupKey: "hub.sectionProgramming" },
  { id: "javascript", href: "/learn/javascript", titleKey: "hub.js.title", groupKey: "hub.sectionProgramming" },
  { id: "react-native", href: "/learn/react-native", titleKey: "hub.reactNative.title", groupKey: "hub.sectionProgramming" },
  { id: "nextjs", href: "/learn/nextjs", titleKey: "hub.nextjs.title", groupKey: "hub.sectionProgramming" },
  { id: "backend-30-days", href: "/learn/backend-30-days", titleKey: "hub.backend.title", groupKey: "hub.sectionProgramming" },
  { id: "laravel", href: "/learn/laravel", titleKey: "hub.laravel.title", groupKey: "hub.sectionProgramming" },
  { id: "nodejs", href: "/learn/nodejs", titleKey: "hub.nodejs.title", groupKey: "hub.sectionProgramming" },
  { id: "sql", href: "/learn/sql", titleKey: "hub.sql.title", groupKey: "hub.sectionProgramming" },
  { id: "mongodb", href: "/learn/mongodb", titleKey: "hub.mongodb.title", groupKey: "hub.sectionProgramming" },
  { id: "supabase", href: "/learn/supabase", titleKey: "hub.supabase.title", groupKey: "hub.sectionProgramming" },
  { id: "rabbitmq", href: "/learn/rabbitmq", title: "RabbitMQ", groupKey: "hub.sectionProgramming" },
  { id: "kafka", href: "/learn/kafka", title: "Apache Kafka", groupKey: "hub.sectionProgramming" },
  { id: "devops", href: "/learn/devops", titleKey: "hub.devops.title", groupKey: "hub.sectionProgramming" },
  { id: "dsa", href: "/learn/dsa", titleKey: "hub.dsa.title", groupKey: "hub.sectionProgramming" },
  { id: "git-7-days", href: "/learn/git-7-days", titleKey: "hub.git.title", groupKey: "hub.sectionProgramming" },
  { id: "system-design", href: "/learn/system-design", titleKey: "hub.systemDesign.title", groupKey: "hub.sectionProgramming" },
  { id: "backend-engineering", href: "/learn/backend-engineering", titleKey: "hub.backendEngineering.title", groupKey: "hub.sectionProgramming" },
  { id: "japanese-n5", href: "/learn/japanese-n5", titleKey: "hub.japanese.title", groupKey: "hub.sectionLanguage" },
  { id: "japanese-n4", href: "/learn/japanese-n4", titleKey: "hub.japaneseN4.title", groupKey: "hub.sectionLanguage" },
  { id: "japanese-n3", href: "/learn/japanese-n3", titleKey: "hub.japaneseN3.title", groupKey: "hub.sectionLanguage" },
  { id: "loksewa-geography", href: "/learn/loksewa/geography", titleKey: "hub.loksewaGeography.title", groupKey: "hub.sectionLoksewa" },
  { id: "loksewa-gk", href: "/learn/loksewa/gk", titleKey: "hub.loksewaGK.title", groupKey: "hub.sectionLoksewa" },
  { id: "loksewa-it-officer", href: "/learn/loksewa/it-officer", titleKey: "hub.loksewaITOfficer.title", groupKey: "hub.sectionLoksewa" },
  { id: "focus-goals", href: "/learn/focus-goals", title: "Staying Focused on Goals", groupKey: "hub.sectionPersonalDev" },
  { id: "discipline", href: "/learn/discipline", title: "Unbreakable Discipline", groupKey: "hub.sectionPersonalDev" },
  { id: "focus-music", href: "/learn/focus-music", title: "Focus & Learn Music", groupKey: "hub.sectionPersonalDev" },
  { id: "exercise", href: "/learn/exercise", title: "Exercise", groupKey: "hub.sectionPersonalDev" },
];

export function getPinnableTrack(id: string): PinnableTrackMeta | undefined {
  return PINNABLE_TRACKS.find((track) => track.id === id);
}
