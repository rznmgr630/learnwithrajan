import type { LocalizedString } from "@/lib/i18n/types";

/** One self-check question with a hidden answer (accordion). */
export interface SelfCheckItem {
  question: LocalizedString;
  answer: LocalizedString;
  /** Optional pill above the answer (e.g. topic label). */
  tag?: LocalizedString;
  /** Optional left-border quote below the main answer paragraphs. */
  callout?: LocalizedString;
}
