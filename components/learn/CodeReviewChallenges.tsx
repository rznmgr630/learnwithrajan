"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { LearnBackNav } from "@/components/learn/LearnBackNav";
import { CODE_REVIEW_CHALLENGES, CODE_REVIEW_LEVELS, CODE_REVIEW_PROBLEMS_PER_LEVEL, type CodeReviewChallenge, type ChallengeLevel } from "@/lib/code-review/challenges";
import { useCodeReviewProgress } from "@/hooks/use-code-review-progress";

type OutputLine = { type: "log" | "error"; text: string };

const RUNNER_DOCUMENT = `<!doctype html><html><body><script>
const format = (value) => {
  if (typeof value === "string") return value;
  try { return JSON.stringify(value, null, 2); } catch { return String(value); }
};
const send = (type, values) => parent.postMessage({ source: "learnwithrajan-code-review", type, text: values.map(format).join(" ") }, "*");
["log", "error"].forEach((type) => { console[type] = (...values) => send(type, values); });
window.addEventListener("error", (event) => send("error", [event.message]));
window.addEventListener("unhandledrejection", (event) => send("error", [event.reason?.message || String(event.reason)]));
window.addEventListener("message", (event) => {
  if (event.data?.source !== "learnwithrajan-code-review") return;
  try { new Function(event.data.code)(); } catch (error) { send("error", [error?.message || String(error)]); }
  parent.postMessage({ source: "learnwithrajan-code-review", type: "done" }, "*");
});
</script></body></html>`;

const LEVEL_STYLE = {
  Basic: "border-emerald-500/30 bg-emerald-500/10 text-emerald-400",
  Intermediate: "border-amber-500/30 bg-amber-500/10 text-amber-400",
  Advanced: "border-rose-500/30 bg-rose-500/10 text-rose-400",
} as const;

const PROBLEMS_PER_PAGE = 5;

function ChallengeCard({ number, active, completed, onSelect }: {
  number: number;
  active: boolean;
  completed: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={[
        "w-full rounded-xl border p-3 text-left transition",
        active
          ? "border-[var(--accent)] bg-[color-mix(in_oklab,var(--accent)_10%,var(--elevated))]"
          : "border-[var(--border)] bg-[var(--elevated)] hover:border-[var(--accent)]/50",
      ].join(" ")}
    >
      <div className="flex items-start justify-between gap-2">
        <span className="text-xs font-semibold text-[var(--faint)]">Problem {String(number).padStart(2, "0")}</span>
        {completed && <span className="text-xs font-semibold text-[var(--accent)]">Done</span>}
      </div>
    </button>
  );
}

export function CodeReviewChallenges() {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [runnerKey, setRunnerKey] = useState(0);
  const [selectedId, setSelectedId] = useState(1);
  const [code, setCode] = useState(CODE_REVIEW_CHALLENGES[0].code);
  const [output, setOutput] = useState<OutputLine[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [showReview, setShowReview] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [pages, setPages] = useState<Record<ChallengeLevel, number>>({ Basic: 0, Intermediate: 0, Advanced: 0 });
  const [mobileLevel, setMobileLevel] = useState<ChallengeLevel>("Basic");
  const { completed, completedCount, toggleCompleted } = useCodeReviewProgress();

  const challenge = useMemo(
    () => CODE_REVIEW_CHALLENGES.find((item) => item.id === selectedId) ?? CODE_REVIEW_CHALLENGES[0],
    [selectedId],
  );
  const levelProblemNumber = CODE_REVIEW_CHALLENGES
    .filter((item) => item.level === challenge.level)
    .findIndex((item) => item.id === challenge.id) + 1;

  useEffect(() => {
    const receiveOutput = (event: MessageEvent) => {
      if (event.data?.source !== "learnwithrajan-code-review") return;
      if (event.data.type === "done") {
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        setIsRunning(false);
        return;
      }
      if (event.data.type === "log" || event.data.type === "error") {
        setOutput((current) => [...current, { type: event.data.type, text: event.data.text }]);
      }
    };

    window.addEventListener("message", receiveOutput);
    return () => {
      window.removeEventListener("message", receiveOutput);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  useEffect(() => {
    const closeDetails = () => setShowDetails(false);
    window.addEventListener("pageshow", closeDetails);
    return () => window.removeEventListener("pageshow", closeDetails);
  }, []);

  const selectChallenge = (next: CodeReviewChallenge) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setSelectedId(next.id);
    setMobileLevel(next.level);
    setCode(next.code);
    setOutput([]);
    setShowReview(false);
    setShowDetails(false);
    setIsRunning(false);
    setRunnerKey((current) => current + 1);
  };

  const runCode = () => {
    if (!iframeRef.current?.contentWindow) return;
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setOutput([]);
    setIsRunning(true);
    iframeRef.current.contentWindow.postMessage({ source: "learnwithrajan-code-review", code }, "*");
    timeoutRef.current = setTimeout(() => {
      setOutput([{ type: "error", text: "Stopped after 3 seconds." }]);
      setIsRunning(false);
      setRunnerKey((current) => current + 1);
    }, 3000);
  };

  const setPage = (level: ChallengeLevel, page: number) => {
    setPages((current) => ({ ...current, [level]: page }));
  };

  const renderLevelSection = (level: ChallengeLevel) => {
    const levelChallenges = CODE_REVIEW_CHALLENGES.filter((item) => item.level === level);
    const pageCount = Math.max(1, Math.ceil(levelChallenges.length / PROBLEMS_PER_PAGE));
    const page = Math.min(pages[level], pageCount - 1);
    const visibleChallenges = levelChallenges.slice(page * PROBLEMS_PER_PAGE, (page + 1) * PROBLEMS_PER_PAGE);

    return (
      <section key={level}>
        <div className="mb-2 flex items-center gap-2">
          <span className={`rounded-full border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${LEVEL_STYLE[level]}`}>
            {level}
          </span>
          <span className="text-xs text-[var(--faint)]">
            {level === "Basic" ? "2 to 5 lines" : level === "Intermediate" ? "8 to 15 lines" : "20+ lines"}
          </span>
        </div>
        <div className="space-y-2">
          {visibleChallenges.map((item, index) => (
            <ChallengeCard
              key={item.id}
              number={page * PROBLEMS_PER_PAGE + index + 1}
              active={item.id === challenge.id}
              completed={completed.has(item.id)}
              onSelect={() => selectChallenge(item)}
            />
          ))}
        </div>
        <div className="mt-3 flex items-center justify-between gap-2 text-xs text-[var(--muted)]">
          <button
            type="button"
            disabled={page === 0}
            onClick={() => setPage(level, page - 1)}
            className="rounded-md px-2 py-1 hover:bg-[var(--elevated)] disabled:cursor-not-allowed disabled:opacity-40"
          >
            ← Previous
          </button>
          <span>{page + 1} / {pageCount}</span>
          <button
            type="button"
            disabled={page === pageCount - 1}
            onClick={() => setPage(level, page + 1)}
            className="rounded-md px-2 py-1 hover:bg-[var(--elevated)] disabled:cursor-not-allowed disabled:opacity-40"
          >
            Next →
          </button>
        </div>
        <p className="mt-2 text-[10px] text-[var(--faint)]">Target: {CODE_REVIEW_PROBLEMS_PER_LEVEL} problems</p>
      </section>
    );
  };

  return (
    <main className="mx-auto max-w-7xl px-4 pb-20 pt-6 sm:px-6">
      <LearnBackNav href="/learn/programming" labelKey="learn.backProgramming" />

      <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-medium text-[var(--accent)]">JavaScript practice</p>
          <h1 className="mt-1 text-3xl font-semibold tracking-tight text-[var(--text)]">Code Review Challenge</h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-[var(--muted)]">
            Read code like an AI reviewer should: run it, find the issue, then compare your review with the expected answer.
          </p>
        </div>
        <span className="rounded-full border border-[var(--border)] bg-[var(--elevated)] px-3 py-1.5 text-sm font-medium text-[var(--text)]">
          {completedCount}/{CODE_REVIEW_CHALLENGES.length} available completed
        </span>
      </div>

      <div className="mt-8 grid gap-5 lg:grid-cols-[260px_minmax(0,1fr)]">
        <aside className="lg:sticky lg:top-4 lg:self-start">
          <div className="mb-5 flex rounded-xl border border-[var(--border)] bg-[var(--surface)] p-1 lg:hidden">
            {CODE_REVIEW_LEVELS.map((level) => (
              <button
                key={level}
                type="button"
                onClick={() => setMobileLevel(level)}
                className={`flex-1 rounded-lg px-2 py-2 text-xs font-semibold transition ${mobileLevel === level ? "bg-[var(--accent)] text-[var(--accent-fg)]" : "text-[var(--muted)]"}`}
              >
                {level}
              </button>
            ))}
          </div>
          <div className="lg:hidden">{renderLevelSection(mobileLevel)}</div>
          <div className="hidden space-y-6 lg:block">
            {CODE_REVIEW_LEVELS.map(renderLevelSection)}
          </div>
        </aside>

        <section className="min-w-0">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <span className={`rounded-full border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${LEVEL_STYLE[challenge.level]}`}>
                {challenge.level}
              </span>
              <h2 className="mt-2 text-xl font-semibold tracking-tight text-[var(--text)]">Problem {String(levelProblemNumber).padStart(2, "0")}</h2>
            </div>
            <button
              type="button"
              onClick={() => toggleCompleted(challenge.id)}
              className="rounded-lg border border-[var(--border)] px-3 py-2 text-sm font-medium text-[var(--text)] hover:border-[var(--accent)]/60"
            >
              {completed.has(challenge.id) ? "Mark incomplete" : "Mark complete"}
            </button>
          </div>

          <section className="mt-4 rounded-xl border border-[var(--border)] bg-[var(--surface)] px-4 py-3">
            <button
              type="button"
              onClick={() => setShowDetails((current) => !current)}
              aria-expanded={showDetails}
              className="flex w-full items-center justify-between text-left text-sm font-medium text-[var(--text)]"
            >
              <span>{showDetails ? "Hide details" : "View details"}</span>
              <svg className={`h-4 w-4 transition-transform ${showDetails ? "rotate-180" : ""}`} viewBox="0 0 16 16" fill="none" aria-hidden>
                <path d="m4 6 4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            {showDetails && <p className="mt-3 text-sm leading-6 text-[var(--muted)]">{challenge.prompt}</p>}
          </section>

          <div className="mt-4 grid gap-4 xl:grid-cols-[minmax(0,1fr)_minmax(280px,0.7fr)]">
            <section className="overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface)] shadow-xl shadow-black/10">
              <div className="flex items-center justify-between gap-3 border-b border-[var(--border)] px-4 py-3">
                <span className="text-sm font-medium text-[var(--text)]">Review this code</span>
                <div className="flex gap-2">
                  <button type="button" onClick={() => setCode(challenge.code)} className="rounded-lg px-3 py-1.5 text-sm text-[var(--muted)] hover:bg-[var(--elevated)]">Reset</button>
                  <button
                    type="button"
                    onClick={runCode}
                    disabled={isRunning}
                    className="rounded-lg bg-[var(--accent)] px-3 py-1.5 text-sm font-semibold text-[var(--accent-fg)] disabled:opacity-60"
                  >
                    {isRunning ? "Running..." : "Run code"}
                  </button>
                </div>
              </div>
              <textarea
                aria-label="Challenge code editor"
                spellCheck={false}
                value={code}
                onChange={(event) => setCode(event.target.value)}
                className="min-h-[390px] w-full resize-y bg-[#0b0e14] p-4 font-mono text-sm leading-6 text-slate-100 outline-none"
              />
            </section>

            <div className="space-y-4">
              <section className="overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface)] shadow-xl shadow-black/10">
                <div className="border-b border-[var(--border)] px-4 py-3 text-sm font-medium text-[var(--text)]">Console output</div>
                <div className="min-h-40 bg-[#0b0e14] p-4 font-mono text-sm leading-6">
                  {output.length === 0 ? (
                    <p className="text-slate-500">Run the code to inspect its behaviour.</p>
                  ) : output.map((line, index) => (
                    <pre key={`${line.text}-${index}`} className={line.type === "error" ? "whitespace-pre-wrap text-rose-400" : "whitespace-pre-wrap text-slate-100"}>{line.text}</pre>
                  ))}
                </div>
              </section>

              <section className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4">
                <button type="button" onClick={() => setShowReview((current) => !current)} className="text-sm font-semibold text-[var(--accent)]">
                  {showReview ? "Hide expected review" : "Reveal expected review"}
                </button>
                {showReview && (
                  <div className="mt-4 space-y-4">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wider text-[var(--faint)]">Issue found</p>
                      <ul className="mt-2 space-y-2 text-sm leading-6 text-[var(--muted)]">
                        {challenge.issues.map((issue) => <li key={issue}>• {issue}</li>)}
                      </ul>
                    </div>
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wider text-[var(--faint)]">One possible fix</p>
                      <pre className="mt-2 overflow-x-auto rounded-lg bg-[#0b0e14] p-3 text-xs leading-5 text-slate-100">{challenge.fixedCode}</pre>
                    </div>
                  </div>
                )}
              </section>
            </div>
          </div>
          <p className="mt-4 text-xs leading-5 text-[var(--faint)]">Code runs in an isolated browser frame and is not sent to your server.</p>
        </section>
      </div>
      <iframe key={runnerKey} ref={iframeRef} title="Code review runner" sandbox="allow-scripts" srcDoc={RUNNER_DOCUMENT} className="hidden" />
    </main>
  );
}
