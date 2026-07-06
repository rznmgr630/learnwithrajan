# learnwithrajan

Next.js 16 (App Router) + React 19 + Tailwind 4 personal learning platform. Structured courses and concept guides across programming, DSA, Japanese, DevOps, etc.

Owner: Rajan (git author `rznmgr`, email rajan.magar@carepilot.com). He brings screenshots/images of source material; expects direct implementation, commit, and push without being asked.

## Stack
- Next.js 16.2.4, React 19.2.4, TypeScript 5, Tailwind 4
- App Router: pages under `app/`, components under `components/`, data under `lib/`
- i18n: EN/NP/JP via `lib/i18n/catalog.ts` (`UiStringKey` type auto-derived from keys), `useLocale()` / `t(key)` hook in `components/i18n/LocaleProvider.tsx`

## Working style
- Provide direct implementation, no long narration. Commit and push without waiting to be asked, unless told otherwise for a specific task.
- Keep responses concise. No recap sections unless the change spans many files.
- Comfortable with code but not full-time engineering — surface trade-offs at the UX/workflow level for big decisions, not deep architecture debates.
- Responses to Rajan should be in plain English and beginner-friendly — avoid unexplained jargon, define terms on first use if needed.

## Core principles
- Apply DRY and SOLID on every component:
  - DRY: extract shared logic/UI into reusable components (e.g. `VideoCard.tsx`) instead of duplicating.
  - Single Responsibility: page components compose, leaf components render.
  - Open/Closed: accept props/config for variation instead of forking copies.
  - Interface Segregation: keep prop interfaces minimal; don't pass data a component doesn't need.
  - Dependency Inversion: depend on props/types, not siblings' internals.
- Minimal correct change. Fix root causes, no speculative abstraction.
- Match existing file/repo style. Don't reformat unrelated code. Don't add/remove comments unless asked.
- Always run `npx tsc --noEmit` before committing.

## Git rules
- Commit as `rznmgr` only. **Never** add `Co-Authored-By` trailers.
- Push to `origin main` (`rznmgr630/learnwithrajan.git`).
- Only commit when explicitly asked — this applies to delegated/background agents too. If delegating file edits via a sub-agent, explicitly tell it "do not run git commit." Check `git log`/`git status` after delegated work completes before reporting done.

## Text formatting conventions (in all content/description strings)
- `<b>Heading</b>` for bold — **never** `**text**` markdown. Renderers parse `<b>...</b>` directly.
- `` `code` `` backtick spans for inline code. Escape embedded double quotes: `\"key\"`.
- `•` (U+2022) for bullets, `  ↳` (2 spaces + arrow) for sub-items/clarifying examples.
- `\n\n` for paragraph breaks, `\n` for line breaks within a paragraph.
- ASCII-only diagrams using box-drawing chars (`─│↓►←↑`), aligned with spaces.
- Tone: plain English, beginner-friendly analogies, real-world comparisons.
- Prefer a proper flow/ASCII diagram over a long numbered list of steps when explaining a process or sequence — diagrams communicate flow faster than prose steps.

## Active modules
- **System Design** — `lib/system-design/concepts.ts`, `components/learn/SystemDesign.tsx` — 61 concepts, 8 sections (Foundation → Requirements → Communication → Data Layer → Scaling & Distribution → Reliability → Case Study → Advanced Topics)
- **Message Queues** (own accordion group, not under System Design):
  - RabbitMQ — `lib/rabbitmq/concepts.ts`, `components/learn/RabbitMQConcepts.tsx`, `/learn/rabbitmq` — 9 concepts, `amqplib` examples
  - Kafka — `lib/kafka/concepts.ts`, `components/learn/KafkaConcepts.tsx`, `/learn/kafka` — 9 concepts, `kafkajs` examples
- **Supabase** — `lib/supabase-learn/concepts.ts`, `components/learn/SupabaseConcepts.tsx`, `/learn/supabase` — 21 concepts
- SQL, MongoDB, DSA, JavaScript, React Native, DevOps, Git-7-days, Backend Engineering
- **Laravel roadmap** — `lib/laravel-learning/`, `components/learn/LaravelRoadmap.tsx` — 22 days / 8 weeks, novice-to-ninja
- **React roadmap** — `lib/react-learning/`, `components/learn/ReactRoadmap.tsx` — 27 days / 10 weeks, novice-to-ninja
- Developer Websites section (Exercism, VisuAlgo, Project Euler, Refactoring Guru, Codewars)
- JLPT N5 lesson drawer (kanji, vocab, YouTube embeds) — Days 1–7 complete

Hub: `components/learn/ProgrammingTracks.tsx` — accordion grouping all programming tracks (`groupDatabase`, `groupMessaging`, `groupBackend`, etc.), uses `learnHubCardClass` from `components/learn/learn-hub-card-class.ts`. Accordion open/closed state persists to `sessionStorage` keyed by `titleKey` (e.g. `acc:hub.programming.groupMessaging`), restoring and scrolling into view on back-navigation.

## Recipe: adding a new standalone concept module (RabbitMQ/Kafka/Supabase pattern)

Touch exactly 5 files, in order:

**1. `lib/{topic}/concepts.ts`**
```ts
export interface XConcept {
  id: number;
  section: string;
  title: string;
  tagline: string;
  description: string;   // <b>bold</b>, `code`, \n\n paragraphs, • bullets
  note?: string;          // blue "Key Takeaway" callout
  diagram?: string;       // ASCII art, \n line breaks
  example: string;        // code block
  tip: string;            // accent "Beginner Tip" / "Production Tip" callout
  tags: string[];
}
export const X_SECTIONS = ["Intro", "Core", ...] as const;
export const X_CONCEPTS: XConcept[] = [ ... ];
export const X_CONCEPT_COUNT = X_CONCEPTS.length;
```

**2. `app/learn/{topic}/page.tsx`** — trivial wrapper:
```tsx
import { XConcepts } from "@/components/learn/XConcepts";
export const metadata = { title: "X — Beginner to Advanced" };
export default function XPage() { return <XConcepts />; }
```

**3. `components/learn/XConcepts.tsx`** — copy an existing module's component (e.g. `KafkaConcepts.tsx`) exactly, rename `Kafka`→`X` / `KAFKA_`→`X_`, update hero text. Structure never changes: `renderLine` → `renderDescription` → `ConceptDrawer` → `ConceptCard` → main export with section grouping. Back nav: `<LearnBackNav href="/learn/programming" labelKey="learn.backProgramming" />`. Drawer section order: Tags · Explanation · Key Takeaway (note) · Flow Diagram · Code Example · Beginner Tip.

**4. `lib/i18n/catalog.ts`** — add 3 keys:
```ts
"hub.{topic}.title":    { en: "X", np: "X", jp: "X" },
"hub.{topic}.subtitle": { en: "one-liner", np: "...", jp: "..." },
"hub.{topic}.cta":      { en: "Start learning →", np: "सिक्न सुरु गर्नुहोस् →", jp: "学習を始める →" },
```

**5. `components/learn/ProgrammingTracks.tsx`** — add a card `<Link>` inside the correct `<ProgrammingAccordionSection>`.

Then always: `npx tsc --noEmit` before committing.

## Recipe: adding a new day to Laravel/React roadmap tracks

File map (Laravel / React parallel structure):
| Concern | Laravel | React |
|---|---|---|
| Day detail data | `lib/laravel-learning/laravel-day-{n}-detail.ts` | `lib/react-learning/react-day-{n}-detail.ts` |
| Week + day registry | `laravel-challenge-data.ts` | `react-challenge-data.ts` |
| i18n (titles, tags) | `laravel-roadmap-i18n.ts` | `react-roadmap-i18n.ts` |
| Roadmap UI | `LaravelRoadmap.tsx` | `ReactRoadmap.tsx` |
| Progress hook | `use-laravel-progress.ts` | `use-react-progress.ts` |
| Day detail drawer | `components/learn/DayDetailPanel.tsx` (shared, `track="laravel"|"react"`) | same |

4 steps:
1. Day detail file — `RoadmapDayDetail` with `overview` + `sections[]` of `blocks` (types: `paragraph`, `list`, `table`, `code`, `diagram`, `youtube`). Use `<b>bold</b>`, `• bullet`, `↳ sub-item`.
2. i18n file — add day title (EN/NP/JP) + any new tag slugs.
3. `challenge-data.ts` — import the detail constant, register it, add the day row to the correct week's `days[]`. Bump total-days constant if needed.
4. `npx tsc --noEmit` → commit as `rznmgr`, no Co-Authored-By.

Key types (`lib/challenge-data.ts`):
```ts
RoadmapDayDetail = { overview?: LocalizedString | LocalizedString[]; sections?: RoadmapDayDetailSection[]; faq?: RoadmapDayFaqItem[]; bullets?: LocalizedString[] }
RoadmapDetailBlock =
  | { type: "paragraph"; text: LocalizedString }
  | { type: "list"; items: LocalizedString[]; variant?: "bullet"|"number" }
  | { type: "table"; caption?: LocalizedString; headers: LocalizedString[]; rows: LocalizedString[][] }
  | { type: "code"; title?: LocalizedString; code: string }   // code is a plain string, not localized
  | { type: "diagram"; id: RoadmapDetailDiagramId }
  | { type: "youtube"; videoId: string; title?: string }
RoadmapWeek = { id: string; title: LocalizedString; dotClass: string; days: RoadmapDay[] }
RoadmapDay = { day: number; title: LocalizedString; tags: RoadmapTag[]; detail?: RoadmapDayDetail }
```
Note: paragraph blocks use `text`, not `content`.

Track structure: Laravel = 8 weeks / 22 days (MVC → deployment). React = 10 weeks / 27 days (JSX → production architecture).

`dotClass` week color convention: `bg-[color-mix(in_oklab,var(--accent)_XX%,#RRGGBB)]`, `XX%` decreasing week over week (100% pure accent at week 1, blending toward a secondary hue in later weeks).

## System Design module specifics
Interface adds `whyItMatters` and `interviewTip` fields beyond the standard concept shape. Card styling: `border-l-4` utility — Key Takeaway `border-l-blue-500/60`, Why it matters `border-l-amber-500/60`, Interview tip `border-l-[var(--accent)]`. Writing pattern: description opens with one plain-English sentence → `<b>Section</b>` headings → bullets → sub-examples; whyItMatters opens with a hook + "If you choose wrong:" bullet block; example uses a real company + numbered `<b>1. Setup</b>` / `<b>2. What happens</b>` / `<b>3. The result</b>` structure with concrete numbers; interviewTip opens with a quoted sentence + numbered `<b>N. Topic</b>` bullets + one-sentence close.

## Global response/collaboration defaults (apply everywhere, not just this repo)
- Be terse. Lead with the answer/change, no filler, no restating the request.
- Short bullets over paragraphs. No unchanged code pasted back — diffs/line refs only.
- Never use em dashes.
- Explain reasoning only when asked, non-obvious, or correctness-relevant.
- Plan first and confirm the split before building large multi-file tasks.
- Add/update tests for logic likely to regress; never weaken tests to pass.
- Before "done": run the relevant build/lint/test and state the exact command + result. If unverifiable, say so plainly.
