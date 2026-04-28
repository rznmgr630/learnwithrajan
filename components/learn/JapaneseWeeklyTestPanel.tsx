"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useLocale } from "@/components/i18n/LocaleProvider";
import type {
  JapaneseWeeklyTest,
  JapaneseWeeklyTestItem,
  JapaneseWeeklyTestSection,
} from "@/lib/japanese-learning/types";
import { pickLocalized } from "@/lib/i18n/pick";

type Props = {
  test: JapaneseWeeklyTest | null;
  onClose: () => void;
  isWeeklyTestDone: (id: string) => boolean;
  onToggleWeeklyTest: (id: string) => void;
};

const LABELS = ["A", "B", "C", "D", "E", "F"];

function choiceLetter(i: number) {
  return LABELS[i] ?? String(i + 1);
}

function scoreMcqsFromSections(
  sections: JapaneseWeeklyTestSection[],
  picks: Record<string, number | undefined>,
): { correct: number; total: number } {
  let correct = 0;
  let total = 0;
  for (const sec of sections) {
    for (const item of sec.items) {
      if (item.kind !== "mcq") continue;
      total += 1;
      const chosen = picks[item.id];
      if (chosen !== undefined && chosen === item.correctIndex) correct += 1;
    }
  }
  return { correct, total };
}

function stripChoiceKeysWithPrefix(obj: Record<string, number>, prefix: string): Record<string, number> {
  const next: Record<string, number> = {};
  for (const [k, v] of Object.entries(obj)) {
    if (!k.startsWith(prefix)) next[k] = v;
  }
  return next;
}

function stripShortKeysWithPrefix(obj: Record<string, string>, prefix: string): Record<string, string> {
  const next: Record<string, string> = {};
  for (const [k, v] of Object.entries(obj)) {
    if (!k.startsWith(prefix)) next[k] = v;
  }
  return next;
}

function WeeklyTestItemBlock({
  item,
  submitted,
  selectedIndex,
  onSelectChoice,
  shortDraft,
  onShortChange,
}: {
  item: JapaneseWeeklyTestItem;
  submitted: boolean;
  selectedIndex: number | undefined;
  onSelectChoice: (idx: number) => void;
  shortDraft: string;
  onShortChange: (value: string) => void;
}) {
  const { locale, t, tParams } = useLocale();

  if (item.kind === "listeningIntro") {
    return (
      <div className="rounded-lg border border-sky-900/40 bg-sky-950/15 p-4">
        <p className="text-[11px] font-semibold uppercase tracking-wide text-sky-300">聴解 · 準備</p>
        <p className="mt-2 text-sm text-neutral-300">{item.scenario}</p>
        <p className="mt-3 text-xs font-semibold uppercase tracking-wide text-neutral-500">{t("weeklyPanel.task")}</p>
        <p className="mt-1 text-sm text-neutral-400">{item.instruction}</p>
        {item.embedVideoId ? (
          <div className="mt-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-neutral-500">{t("weeklyPanel.embedClip")}</p>
            <div className="mt-2 aspect-video w-full overflow-hidden rounded-lg border border-neutral-800 bg-black">
              <iframe
                title="Listening sample clip"
                src={`https://www.youtube-nocookie.com/embed/${item.embedVideoId}`}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                className="h-full w-full"
              />
            </div>
          </div>
        ) : null}
        {item.youtubeVideos.length > 0 ? (
          <div className="mt-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-rose-300/95">{t("weeklyPanel.moreListening")}</p>
            <ul className="mt-2 space-y-2">
              {item.youtubeVideos.map((v, vi) => (
                <li key={`${v.url}-${vi}`}>
                  <a
                    href={v.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-sky-400 underline-offset-2 hover:text-sky-300 hover:underline"
                  >
                    {v.title}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </div>
    );
  }

  if (item.kind === "short") {
    return (
      <div className="rounded-lg border border-neutral-800 bg-neutral-900/40 p-4">
        <p className="whitespace-pre-wrap text-sm font-medium text-neutral-200">{item.prompt}</p>
        {!submitted ? (
          <textarea
            value={shortDraft}
            onChange={(e) => onShortChange(e.target.value)}
            rows={4}
            placeholder={t("weeklyPanel.placeholderShort")}
            className="mt-4 w-full resize-y rounded-lg border border-neutral-700 bg-neutral-950/80 px-3 py-2 text-sm text-neutral-100 placeholder:text-neutral-600 focus:border-indigo-500/60 focus:outline-none focus:ring-1 focus:ring-indigo-500/40"
          />
        ) : (
          <div className="mt-4 space-y-4">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wide text-neutral-500">{t("weeklyPanel.yourAnswer")}</p>
              <p className="mt-1 whitespace-pre-wrap rounded-lg border border-neutral-700 bg-neutral-950/60 px-3 py-2 text-sm text-neutral-300">
                {shortDraft.trim() === "" ? t("weeklyPanel.emptyAnswer") : shortDraft}
              </p>
            </div>
            <div className="rounded-lg border border-emerald-900/45 bg-emerald-950/20 p-3">
              <p className="text-[11px] font-semibold uppercase tracking-wide text-emerald-400/90">{t("weeklyPanel.modelAnswer")}</p>
              <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-emerald-100/90">{item.modelAnswer}</p>
            </div>
          </div>
        )}
      </div>
    );
  }

  const mcq = item;
  const alt = mcq.choicesLocale?.[locale];
  const choiceLabels =
    alt && alt.length === mcq.choices.length ? alt : mcq.choices;

  return (
    <div className="rounded-lg border border-neutral-800 bg-neutral-900/40 p-4">
      <p className="whitespace-pre-wrap text-sm font-medium text-neutral-200">{mcq.prompt}</p>
      <ol className="mt-3 space-y-2">
        {choiceLabels.map((c, ci) => {
          const letter = choiceLetter(ci);
          const selected = selectedIndex === ci;
          const isCorrect = ci === mcq.correctIndex;

          let btnClass =
            "w-full rounded-lg border px-3 py-2.5 text-left text-sm leading-relaxed transition";

          if (!submitted) {
            btnClass += selected
              ? " border-indigo-500/55 bg-indigo-950/35 text-neutral-100 ring-1 ring-indigo-500/25"
              : " border-neutral-700 bg-neutral-950/50 text-neutral-300 hover:border-neutral-500";
          } else {
            if (isCorrect) {
              btnClass += " border-emerald-500/65 bg-emerald-950/25 text-emerald-50 ring-1 ring-emerald-500/25";
            } else if (selected && !isCorrect) {
              btnClass += " border-red-500/70 bg-red-950/30 text-neutral-100 ring-1 ring-red-500/35";
            } else {
              btnClass += " border-neutral-800/90 bg-neutral-950/25 text-neutral-500";
            }
          }

          return (
            <li key={ci}>
              <button
                type="button"
                disabled={submitted}
                onClick={() => onSelectChoice(ci)}
                className={btnClass}
              >
                <span className="font-mono text-xs opacity-80">{letter}.</span> {c}
              </button>
            </li>
          );
        })}
      </ol>

      {submitted ? (
        <div className="mt-4 space-y-2 rounded-md border border-neutral-800/90 bg-neutral-950/40 p-3">
          {selectedIndex === undefined ? (
            <p className="text-xs text-amber-200/90">{t("weeklyPanel.noOption")}</p>
          ) : selectedIndex === mcq.correctIndex ? (
            <p className="text-xs text-emerald-300/90">{t("weeklyPanel.correctShort")}</p>
          ) : (
            <p className="text-xs text-red-300/90">
              {tParams("weeklyPanel.incorrectShort", {
                yours: choiceLetter(selectedIndex),
                correct: choiceLetter(mcq.correctIndex),
              })}
            </p>
          )}
          {mcq.explanation ? (
            <p className="border-t border-neutral-800/80 pt-2 text-xs leading-relaxed text-neutral-400">
              {pickLocalized(mcq.explanation, locale)}
            </p>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}

export function JapaneseWeeklyTestPanel({ test, onClose, isWeeklyTestDone, onToggleWeeklyTest }: Props) {
  const { locale, t } = useLocale();
  const open = test !== null;
  const hasSubTests = Boolean(test?.subTests?.length);
  const [activeSubIdx, setActiveSubIdx] = useState(0);
  const [submittedMap, setSubmittedMap] = useState<Record<string, boolean>>({});
  const [choicePick, setChoicePick] = useState<Record<string, number>>({});
  const [shortDrafts, setShortDrafts] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!open) return;
    setActiveSubIdx(0);
    setSubmittedMap({});
    setChoicePick({});
    setShortDrafts({});
  }, [open, test?.id]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  const activeSections = useMemo(() => {
    if (!test) return [];
    if (hasSubTests && test.subTests?.[activeSubIdx]) return test.subTests[activeSubIdx].sections;
    return test.sections;
  }, [test, hasSubTests, activeSubIdx]);

  const paperKey = useMemo(() => {
    if (!test) return "";
    if (hasSubTests && test.subTests?.[activeSubIdx]) return test.subTests[activeSubIdx].id;
    return test.id;
  }, [test, hasSubTests, activeSubIdx]);

  const submitted = Boolean(submittedMap[paperKey]);

  const score = useMemo(
    () => scoreMcqsFromSections(activeSections, choicePick),
    [activeSections, choicePick],
  );

  const percent = score.total > 0 ? Math.round((score.correct / score.total) * 100) : 0;

  const repeatTest = useCallback(() => {
    const prefix = `${paperKey}-`;
    setSubmittedMap((prev) => ({ ...prev, [paperKey]: false }));
    setChoicePick((prev) => stripChoiceKeysWithPrefix(prev, prefix));
    setShortDrafts((prev) => stripShortKeysWithPrefix(prev, prefix));
  }, [paperKey]);

  const handleSubmit = useCallback(() => {
    setSubmittedMap((prev) => ({ ...prev, [paperKey]: true }));
  }, [paperKey]);

  if (!open || !test) return null;

  const done = isWeeklyTestDone(test.id);

  const activeSub = hasSubTests ? test.subTests?.[activeSubIdx] : undefined;
  const introBlurb =
    hasSubTests && activeSub?.intro !== undefined ? activeSub.intro : pickLocalized(test.intro, locale);

  const paperSubtitle =
    hasSubTests && activeSub?.subtitle !== undefined ? pickLocalized(activeSub.subtitle, locale) : null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end" role="dialog" aria-modal="true">
      <button
        type="button"
        className="absolute inset-0 bg-black/60 backdrop-blur-[2px]"
        aria-label={t("weeklyPanel.close")}
        onClick={onClose}
      />
      <aside className="relative flex h-full w-full max-w-2xl flex-col border-l border-neutral-800 bg-neutral-950 shadow-2xl">
        <div className="flex items-start justify-between gap-3 border-b border-neutral-800 p-5">
          <div>
            <p className="text-xs font-medium text-indigo-400/90">
              {pickLocalized(test.weekLabel, locale)}
              {test.id === "jn5-full-mock" ? t("weeklyPanel.tagFullMock") : t("weeklyPanel.tagWeekly")}
            </p>
            <p className="mt-0.5 text-[11px] font-medium uppercase tracking-wide text-neutral-500">{t("weeklyPanel.skillsLine")}</p>
            <h2 className="mt-1 text-lg font-semibold leading-snug text-neutral-100">{pickLocalized(test.title, locale)}</h2>
            <p className="mt-1 text-sm text-neutral-500">{pickLocalized(test.subtitle, locale)}</p>
            {paperSubtitle ? <p className="mt-1 text-xs text-neutral-500">{paperSubtitle}</p> : null}
            <p className="mt-2 text-xs text-neutral-600">
              {t("weeklyPanel.daysRange")} {test.coversDayRange[0]}–{test.coversDayRange[1]}
              {hasSubTests && test.subTests ? (
                <>
                  {" "}
                  {t("weeklyPanel.paperProgress")} {activeSubIdx + 1} / {test.subTests.length}
                  {test.subTests[activeSubIdx]?.label ? ` (${test.subTests[activeSubIdx].label})` : ""}
                </>
              ) : null}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="grid h-9 w-9 shrink-0 place-items-center rounded-lg text-neutral-400 transition hover:bg-neutral-800 hover:text-neutral-100"
            aria-label={t("weeklyPanel.close")}
          >
            <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden>
              <path d="M6.28 5.22a.75.75 0 0 0-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 1 0 1.06 1.06L10 11.06l3.72 3.72a.75.75 0 1 0 1.06-1.06L11.06 10l3.72-3.72a.75.75 0 0 0-1.06-1.06L10 8.94 6.28 5.22Z" />
            </svg>
          </button>
        </div>

        {hasSubTests && test.subTests ? (
          <div className="flex flex-wrap gap-2 border-b border-neutral-800 px-5 py-3">
            {test.subTests.map((st, i) => (
              <button
                key={st.id}
                type="button"
                onClick={() => setActiveSubIdx(i)}
                className={[
                  "rounded-lg px-3 py-1.5 text-sm font-medium transition",
                  i === activeSubIdx
                    ? "bg-indigo-600 text-white"
                    : submittedMap[st.id]
                      ? "border border-emerald-800/60 bg-emerald-950/25 text-emerald-100/90"
                      : "border border-neutral-700 bg-neutral-900 text-neutral-400 hover:border-neutral-600 hover:text-neutral-200",
                ].join(" ")}
              >
                {st.label}
                {submittedMap[st.id] ? " ✓" : ""}
              </button>
            ))}
          </div>
        ) : null}

        {submitted ? (
          <div className="border-b border-neutral-800 bg-neutral-900/50 px-5 py-4">
            <p className="text-[11px] font-semibold uppercase tracking-wide text-neutral-500">
              {t("weeklyPanel.result")} {paperKey}
            </p>
            <p className="mt-1 text-lg font-semibold tabular-nums text-neutral-100">
              {score.correct} / {score.total} {t("weeklyPanel.correct")} ({percent}%)
            </p>
            <p className="mt-1 text-xs text-neutral-500">{t("weeklyPanel.scoreNote")}</p>
          </div>
        ) : null}

        <div className="flex flex-1 flex-col gap-6 overflow-y-auto p-5">
          <p className="text-sm leading-relaxed text-neutral-400">{introBlurb}</p>
          {!submitted ? (
            <p className="rounded-lg border border-neutral-800 bg-neutral-900/40 px-3 py-2 text-xs text-neutral-500">{t("weeklyPanel.introHint")}</p>
          ) : null}

          {activeSections.map((sec) => (
            <div key={sec.title}>
              <h3 className="text-xs font-semibold uppercase tracking-wide text-neutral-500">{sec.title}</h3>
              {sec.blurb ? <p className="mt-1 text-xs text-neutral-600">{sec.blurb}</p> : null}
              <div className="mt-4 space-y-6">
                {sec.items.map((item) => (
                  <WeeklyTestItemBlock
                    key={item.id}
                    item={item}
                    submitted={submitted}
                    selectedIndex={choicePick[item.id]}
                    onSelectChoice={(idx) =>
                      setChoicePick((prev) => ({
                        ...prev,
                        [item.id]: idx,
                      }))
                    }
                    shortDraft={item.kind === "short" ? (shortDrafts[item.id] ?? "") : ""}
                    onShortChange={(value) =>
                      setShortDrafts((prev) => ({
                        ...prev,
                        [item.id]: value,
                      }))
                    }
                  />
                ))}
              </div>
            </div>
          ))}

          {test.closingNote ? (
            <div className="rounded-lg border border-neutral-800 bg-neutral-900/30 p-4">
              <p className="text-[11px] font-semibold uppercase tracking-wide text-neutral-500">{t("weeklyPanel.noteHeading")}</p>
              <p className="mt-2 text-sm leading-relaxed text-neutral-400">{pickLocalized(test.closingNote, locale)}</p>
            </div>
          ) : null}
        </div>

        <div className="flex flex-col gap-3 border-t border-neutral-800 p-5">
          {!submitted ? (
            <button
              type="button"
              onClick={handleSubmit}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-indigo-500"
            >
              {t("weeklyPanel.submit")}
            </button>
          ) : (
            <button
              type="button"
              onClick={repeatTest}
              className="flex w-full items-center justify-center gap-2 rounded-xl border border-neutral-600 bg-neutral-900 px-4 py-3 text-sm font-semibold text-neutral-100 transition hover:bg-neutral-800"
            >
              {t("weeklyPanel.repeat")}
            </button>
          )}
          <button
            type="button"
            onClick={() => onToggleWeeklyTest(test.id)}
            className={[
              "flex w-full items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold transition",
              done
                ? "bg-neutral-800 text-neutral-200 hover:bg-neutral-700"
                : "bg-neutral-700 text-neutral-100 hover:bg-neutral-600",
            ].join(" ")}
          >
            {test.id === "jn5-full-mock"
              ? done
                ? t("weeklyPanel.markMockNotDone")
                : t("weeklyPanel.markMockDone")
              : done
                ? t("weeklyPanel.markNotDone")
                : t("weeklyPanel.markDone")}
          </button>
        </div>
      </aside>
    </div>
  );
}
