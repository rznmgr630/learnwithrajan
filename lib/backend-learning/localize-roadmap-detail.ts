import type { Locale } from "@/lib/i18n/types";
import type { LocalizedString } from "@/lib/i18n/types";
import type {
  RoadmapDayDetail,
  RoadmapDayDetailSection,
  RoadmapDayFaqItem,
  RoadmapDetailBlock,
  RoadmapDetailBlockResolved,
} from "@/lib/challenge-data";
import { resolveBackendCopy } from "@/lib/backend-learning/backend-copy-i18n";

export type ResolvedRoadmapDayFaqItem = {
  question: string;
  answer: string;
  tag?: string;
  callout?: string;
};

export type ResolvedRoadmapDayDetailSection = Omit<RoadmapDayDetailSection, "title" | "items" | "blocks"> & {
  title: string;
  items?: string[];
  blocks?: RoadmapDetailBlockResolved[];
};

/** Narrow detail shape after locale resolution (strings only for prose). */
export type ResolvedRoadmapDayDetail = Omit<RoadmapDayDetail, "overview" | "sections" | "faq" | "bullets"> & {
  overview: string | string[];
  sections?: ResolvedRoadmapDayDetailSection[];
  faq?: ResolvedRoadmapDayFaqItem[];
  bullets?: string[];
};

/** Recursively resolves English lesson copy to the active UI locale. */
export function localizeRoadmapDayDetail(detail: RoadmapDayDetail, locale: Locale): ResolvedRoadmapDayDetail {
  const ls = (s: LocalizedString) => resolveBackendCopy(s, locale);

  const ov = detail.overview;
  const overview =
    ov === undefined ? [] : Array.isArray(ov) ? ov.map(ls) : [ls(ov)];

  const sections = detail.sections?.map((sec) => localizeSection(sec, locale));
  const faq = detail.faq?.map((item) => localizeFaq(item, locale));
  const bullets = detail.bullets?.map(ls);

  return {
    overview,
    ...(sections !== undefined ? { sections } : {}),
    ...(faq !== undefined ? { faq } : {}),
    ...(bullets !== undefined ? { bullets } : {}),
  };
}

function localizeSection(sec: RoadmapDayDetailSection, locale: Locale): ResolvedRoadmapDayDetailSection {
  const ls = (s: LocalizedString) => resolveBackendCopy(s, locale);
  return {
    ...sec,
    title: ls(sec.title),
    items: sec.items?.map(ls),
    blocks: sec.blocks?.map((b) => localizeBlock(b, locale)),
  };
}

function localizeBlock(block: RoadmapDetailBlock, locale: Locale): RoadmapDetailBlockResolved {
  const ls = (s: LocalizedString) => resolveBackendCopy(s, locale);
  switch (block.type) {
    case "paragraph":
      return { ...block, text: ls(block.text) };
    case "list":
      return { ...block, items: block.items.map(ls) };
    case "table":
      return {
        ...block,
        caption: block.caption !== undefined ? ls(block.caption) : undefined,
        headers: block.headers.map(ls),
        rows: block.rows.map((row) => row.map(ls)),
      };
    case "code":
      return {
        ...block,
        title: block.title !== undefined ? ls(block.title) : undefined,
        code: block.code,
      };
    case "diagram":
      return block;
    default:
      return block;
  }
}

function localizeFaq(item: RoadmapDayFaqItem, locale: Locale): ResolvedRoadmapDayFaqItem {
  const ls = (s: LocalizedString) => resolveBackendCopy(s, locale);
  return {
    question: ls(item.question),
    answer: ls(item.answer),
    tag: item.tag !== undefined ? ls(item.tag) : undefined,
    callout: item.callout !== undefined ? ls(item.callout) : undefined,
  };
}
