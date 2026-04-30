import type { LocalizedString } from "@/lib/i18n/types";
import type { RoadmapTag } from "@/lib/challenge-data";

const REACT_TAG: Record<string, LocalizedString> = {
  basics: {
    en: "basics",
    np: "आधारभूत",
    jp: "基礎",
  },
  setup: {
    en: "setup",
    np: "सेटअप",
    jp: "セットアップ",
  },
  tooling: {
    en: "tooling",
    np: "उपकरण",
    jp: "ツール",
  },
  structure: {
    en: "structure",
    np: "संरचना",
    jp: "構成",
  },
  components: {
    en: "components",
    np: "कम्पोनेन्ट",
    jp: "コンポーネント",
  },
  lists: {
    en: "lists & events",
    np: "सूची र घटना",
    jp: "リストとイベント",
  },
  props: {
    en: "props",
    np: "props",
    jp: "props",
  },
  state: {
    en: "state",
    np: "state",
    jp: "state",
  },
  styling: {
    en: "styling",
    np: "शैली",
    jp: "スタイル",
  },
  css: {
    en: "CSS",
    np: "CSS",
    jp: "CSS",
  },
  hooks: {
    en: "hooks",
    np: "hooks",
    jp: "Hooks",
  },
  immutability: {
    en: "immutability",
    np: "अपरिवर्तनीयता",
    jp: "イミュータビリティ",
  },
  forms: {
    en: "forms",
    np: "फर्म",
    jp: "フォーム",
  },
  validation: {
    en: "validation",
    np: "प्रमाणीकरण",
    jp: "バリデーション",
  },
  effects: {
    en: "effects & useEffect",
    np: "effects र useEffect",
    jp: "副作用と useEffect",
  },
  api: {
    en: "HTTP & API",
    np: "HTTP र API",
    jp: "HTTP と API",
  },
};

export function reactTags(slugs: [string, string]): RoadmapTag[] {
  return [
    { slug: slugs[0], label: REACT_TAG[slugs[0]] ?? { en: slugs[0], np: slugs[0], jp: slugs[0] } },
    { slug: slugs[1], label: REACT_TAG[slugs[1]] ?? { en: slugs[1], np: slugs[1], jp: slugs[1] } },
  ];
}

const REACT_DAY_TITLE: Record<number, LocalizedString> = {
  1: {
    en: "Prerequisites & Hello React",
    np: "पूर्वआवश्यकता र Hello React",
    jp: "前提知識と Hello React",
  },
  2: {
    en: "Environment, scaffold & project layout",
    np: "वातावरण, scaffold र परियोजना लेआउट",
    jp: "環境・スキャフォールドとプロジェクト構成",
  },
  3: {
    en: "ListGroup, lists, conditionals & events",
    np: "ListGroup, सूची, सर्तीय render र घटना",
    jp: "ListGroup・リスト・条件分岐・イベント",
  },
  4: {
    en: "Props, state, children & DevTools",
    np: "Props, state, children र DevTools",
    jp: "props・state・children・DevTools",
  },
  5: {
    en: "CSS approaches, UI kits, icons & Like",
    np: "CSS विधि, UI kit, आइकन र Like",
    jp: "CSS・UIキット・アイコン・Like",
  },
  6: {
    en: "useState, immutability, Immer & ExpandableText",
    np: "useState, immutability, Immer र ExpandableText",
    jp: "useState・イミュータブル・Immer・ExpandableText",
  },
  7: {
    en: "Building forms, RHF, Zod & Expense Tracker",
    np: "फर्म, React Hook Form, Zod र Expense Tracker",
    jp: "フォーム・React Hook Form・Zod・Expense Tracker",
  },
  8: {
    en: "useEffect, fetch, CRUD & API layering",
    np: "useEffect, fetch, CRUD र API परत",
    jp: "useEffect・fetch・CRUD・API の層構造",
  },
};

const REACT_WEEK_TITLE: Record<string, LocalizedString> = {
  "react-getting-started": {
    en: "Getting started",
    np: "सुरुवात",
    jp: "はじめに",
  },
  "react-building-components": {
    en: "Building components (~58m)",
    np: "कम्पोनेन्ट निर्माण (~५८m)",
    jp: "コンポーネント構築（約58分）",
  },
  "react-managing-state": {
    en: "Managing state (~35m)",
    np: "state व्यवस्थापन (~३५m)",
    jp: "状態管理（約35分）",
  },
  "react-styling-components": {
    en: "Styling components (~32m)",
    np: "कम्पोनेन्ट शैली (~३२m)",
    jp: "スタイル（約32分）",
  },
  "react-managing-component-state": {
    en: "Managing component state (~41m)",
    np: "कम्पोनेन्ट state व्यवस्थापन (~४१m)",
    jp: "コンポーネントの状態（約41分）",
  },
  "react-building-forms": {
    en: "Building forms (~1h)",
    np: "फर्म निर्माण (~१ घण्टा)",
    jp: "フォーム構築（約1時間）",
  },
  "react-connecting-backend": {
    en: "Connecting to the backend (~1h)",
    np: "ब्याकएन्ड जडान (~१ घण्टा)",
    jp: "バックエンド接続（約1時間）",
  },
};

export function reactDayTitle(day: number): LocalizedString {
  return REACT_DAY_TITLE[day] ?? { en: `Day ${day}`, np: `दिन ${day}`, jp: `Day ${day}` };
}

export function reactWeekTitle(weekId: string): LocalizedString {
  return REACT_WEEK_TITLE[weekId] ?? { en: weekId, np: weekId, jp: weekId };
}
