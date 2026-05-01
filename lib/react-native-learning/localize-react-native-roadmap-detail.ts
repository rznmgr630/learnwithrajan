import type { Locale } from "@/lib/i18n/types";
import type { LocalizedString } from "@/lib/i18n/types";
import type {
  RoadmapDayDetail,
  RoadmapDayDetailSection,
  RoadmapDayFaqItem,
  RoadmapDetailBlock,
  RoadmapDetailBlockResolved,
} from "@/lib/challenge-data";
import { pickLocalized } from "@/lib/i18n/pick";
import type {
  ResolvedRoadmapDayDetail,
  ResolvedRoadmapDayDetailSection,
  ResolvedRoadmapDayFaqItem,
} from "@/lib/backend-learning/localize-roadmap-detail";

function ls(s: LocalizedString, locale: Locale): string {
  return typeof s === "string" ? s : pickLocalized(s, locale);
}

/** Resolves React Native roadmap day detail copy for en / np / jp. */
export function localizeReactNativeRoadmapDayDetail(detail: RoadmapDayDetail, locale: Locale): ResolvedRoadmapDayDetail {
  const ov = detail.overview;
  const overview =
    ov === undefined ? [] : Array.isArray(ov) ? ov.map((x) => ls(x, locale)) : [ls(ov, locale)];

  const sections = detail.sections?.map((sec) => localizeRnSection(sec, locale));
  const faq = detail.faq?.map((item) => localizeRnFaq(item, locale));
  const bullets = detail.bullets?.map((b) => ls(b, locale));

  return {
    overview,
    ...(sections !== undefined ? { sections } : {}),
    ...(faq !== undefined ? { faq } : {}),
    ...(bullets !== undefined ? { bullets } : {}),
  };
}

function localizeRnSection(sec: RoadmapDayDetailSection, locale: Locale): ResolvedRoadmapDayDetailSection {
  return {
    ...sec,
    title: ls(sec.title, locale),
    items: sec.items?.map((i) => ls(i, locale)),
    blocks: sec.blocks?.map((b) => localizeRnBlock(b, locale)),
  };
}

function localizeRnBlock(block: RoadmapDetailBlock, locale: Locale): RoadmapDetailBlockResolved {
  switch (block.type) {
    case "paragraph":
      return { ...block, text: ls(block.text, locale) };
    case "list":
      return { ...block, items: block.items.map((i) => ls(i, locale)) };
    case "table":
      return {
        ...block,
        caption: block.caption !== undefined ? ls(block.caption, locale) : undefined,
        headers: block.headers.map((h) => ls(h, locale)),
        rows: block.rows.map((row) => row.map((c) => ls(c, locale))),
      };
    case "code":
      return {
        ...block,
        title: block.title !== undefined ? ls(block.title, locale) : undefined,
        code: block.code,
      };
    case "diagram":
      return block;
    default:
      return block;
  }
}

function localizeRnFaq(item: RoadmapDayFaqItem, locale: Locale): ResolvedRoadmapDayFaqItem {
  return {
    question: ls(item.question, locale),
    answer: ls(item.answer, locale),
    tag: item.tag !== undefined ? ls(item.tag, locale) : undefined,
    callout: item.callout !== undefined ? ls(item.callout, locale) : undefined,
  };
}
