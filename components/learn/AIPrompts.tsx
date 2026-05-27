"use client";

import Image from "next/image";
import { useState } from "react";
import type React from "react";

interface PromptItem {
  id: number;
  category: string;
  title: string;
  image?: string;
  imageAlt?: string;
  prompt: string;
}

const PROMPTS: PromptItem[] = [
  // ── Image Effects ──────────────────────────────────────────────────────────
  {
    id: 1,
    category: "Image Effects",
    title: "MS PAINT EFFECT",
    image: "/prompts/ms-paint.png",
    imageAlt: "MS Paint style redraw result",
    prompt:
      "Redraw the attached image in the most clumsy, scribbly, and utterly pathetic way possible. Use a white background, and make it look like it was drawn in an old computer painting program with a mouse. It should be vaguely similar but also not really, kind of matching but also off in a confusing, awkward way, with that low-quality pixel-by-pixel feel that really emphasizes how ridiculously bad it is. Actually, you know what, whatever, just draw it however you want. MS paint type",
  },
  {
    id: 2,
    category: "Image Effects",
    title: "SKIN ENHANCER",
    image: "/prompts/skin_enhancer.png",
    imageAlt: "Skin enhancer before and after result",
    prompt:
      "Skin enhancement retouch, preserve original identity and structure, refine skin texture without smoothing, maintain pores, freckles, and natural variation, reduce temporary blemishes and redness only, even out tone subtly without flattening depth, retain natural highlights and shadow transitions, keep under-eye detail intact with slight softening not removal, avoid plastic or airbrushed finish, maintain original lighting and color balance, enhance micro-contrast for realistic texture, lips and eyes untouched except for natural clarity, no reshaping of facial features, no artificial glow, no over-sharpening, seamless integration with original image, invisible edit with high realism.",
  },
  {
    id: 3,
    category: "Image Effects",
    title: "MINECRAFT EFFECT",
    image: "/prompts/minecraft.png",
    imageAlt: "Minecraft effect before and after result",
    prompt:
      "Keep the human subject 100 percent photorealistic and untouched. No pixel filter, no stylization, no lighting remap on skin. Preserve exact facial detail, pores, fabric weave, hair strands, natural shadows. Expression and posture remain identical. Rebuild the background as a structurally accurate Minecraft voxel replica of the original location. Do not reinterpret. Match the exact layout, spacing, depth, and geometry from the reference image. If there is a path, replicate its exact curve and width using gravel or dirt blocks. If there are trees, match trunk positions, height ratios, canopy spread using appropriate log and leaf blocks. If there are buildings, recreate their silhouette, window placement, roof angle using Minecraft block geometry. If there are rocks, benches, fences, signs, convert them into block equivalents but maintain their exact position and proportion relative to the subject. Perspective must match the original photo perfectly. Horizon line, camera height, focal distance, framing, subject scale all identical. Any object physically touching the subject must convert into Minecraft logic.",
  },
  {
    id: 4,
    category: "Image Effects",
    title: "GROUP SELFIE",
    image: "/prompts/group_selfie.png",
    imageAlt: "Group selfie AI generated result",
    prompt:
      "Raw iPhone selfie, subjects from reference images standing close together, both leaning slightly into frame, casual shoulder-to-shoulder composition, direct gaze into camera with relaxed neutral expressions, handheld at arm's length with slight upward tilt, soft indoor lighting mixed with phone flash causing mild overexposure on highlights and shadow falloff, natural skin texture visible with pores and subtle makeup detail, stray hairs and fabric creases present, background loosely visible with everyday environment elements slightly out of focus, minor motion blur in edges, slight lens distortion from close proximity, off-center framing with imperfect crop, subtle ISO grain and uneven white balance, unpolished, candid realism.",
  },
  {
    id: 5,
    category: "Image Effects",
    title: "LEGO EFFECT",
    image: "/prompts/lego_effect.png",
    imageAlt: "LEGO effect before and after result",
    prompt:
      "Keep the human subject 100 percent photorealistic and untouched. No pixel filter, no stylization, no lighting remap on skin. Preserve exact facial detail, pores, fabric weave, hair strands, natural shadows. Expression and posture remain identical. Rebuild the background as a structurally accurate LEGO replica of the original location. Do not reinterpret. Match the exact layout, spacing, depth, and geometry from the reference image. If there is a path, replicate its exact curve and width using LEGO tile and plate construction. If there are trees, match trunk positions, height ratios, canopy spread using appropriate LEGO trunk builds and layered foliage elements. If there are buildings, recreate their silhouette, window placement, roof angle using authentic LEGO architecture geometry and brick proportions. If there are rocks, benches, fences, signs, convert them into LEGO-built equivalents but maintain their exact position and proportion relative to the subject. Perspective must match the original photo perfectly. Horizon line, camera height, focal distance, framing, subject scale all identical. Any object physically touching the subject must convert into LEGO logic. Real animal becomes a LEGO animal or molded figure equivalent. Held object becomes a brick-built version scaled correctly to the hand. Objects not touching the subject remain LEGO-built but positioned exactly where they appear in the reference. Lighting recreated as realistic daylight interacting with LEGO plastic materials while matching the direction and intensity of the original photo. Preserve subtle specular highlights on LEGO surfaces, natural shadow falloff, soft environmental reflections, and realistic material response. If fog exists, rebuild it using layered atmospheric haze while preserving the same depth falloff. Maintain recognizable background identity. The location should be immediately identifiable from composition alone, just rendered in detailed LEGO construction. High-resolution cinematic realism. Realistic LEGO material texture with visible seams, studs, injection molding detail, slight surface scuffs, authentic plastic reflections. No UI, no text, no overlays.",
  },
  {
    id: 6,
    category: "Image Effects",
    title: "4K EFFECT",
    image: "/prompts/4k.png",
    imageAlt: "4K enhancement before and after result",
    prompt:
      "Ultra-high-resolution 4K enhancement based strictly on the provided reference image. Absolute fidelity to original facial anatomy, proportions, and identity. Preserve expression, gaze, pose, camera angle, framing, and perspective with zero deviation. Clothing, hair, skin, and background elements must remain unchanged in structure, placement, and design. Recover fine-grain detail with natural realism. Enhance pores, fine lines, hair strands, eyelashes, fabric weave, seams, and material edges without introducing stylization. Maintain original color science, white balance, and tonal relationships exactly as captured. Lighting direction, intensity, contrast, and shadow behavior must match the source image precisely, with only improved clarity and expanded dynamic range. No relighting, no reshaping. Remove any grain. Apply controlled sharpening and high-frequency detail reconstruction. Remove compression artifacts and noise while retaining authentic texture. No smoothing, no plastic skin, no artificial gloss. Facial features must remain consistent across the entire image with coherent anatomy and clean, stable edges. Negative constraints: no warping, no facial drift, no added or missing anatomy, no altered hands, no distortions, no perspective shift, no text or graphics, no hallucinated detail, no stylized rendering. Output must read as a true-to-life, photorealistic upscale that matches the reference exactly, only clearer, sharper, and higher resolution.",
  },

  // ── Learning ───────────────────────────────────────────────────────────────
  {
    id: 7,
    category: "Learning",
    title: "LEARN ANYTHING IN 20 HOURS",
    prompt:
      "I need to learn [topic] fast. Build me a 20-hour plan focused on the 20% that drives 80% of results. Break it into 10 two-hour sessions with the best resources and a 15-minute review at the end of each.",
  },
  {
    id: 8,
    category: "Learning",
    title: "CREATE A ONE-PAGE CHEAT SHEET",
    prompt:
      "Summarize the key concepts of [topic] on a single page. Use bullet points, diagrams, and examples so I can review it in 5 minutes.",
  },
  {
    id: 9,
    category: "Learning",
    title: "QUIZ ME UNTIL I BREAK",
    prompt:
      "I just studied [topic]. Give me 10 progressively harder questions to test my understanding. After each answer, grade me and explain what I missed.",
  },
  {
    id: 10,
    category: "Learning",
    title: "BUILD A LEARNING LADDER",
    prompt:
      "Break [topic] into 5 levels of difficulty. Show me how to go from Level 1 (beginner) to Level 5 (advanced) with a clear milestone at each step.",
  },
  {
    id: 11,
    category: "Learning",
    title: "FIND THE BEST LEARNING RESOURCES",
    prompt:
      "List the top 5 resources (books, videos, courses, or people) for learning [topic] fast, and explain why each is worth my time.",
  },
  {
    id: 12,
    category: "Learning",
    title: "USE THE FEYNMAN TECHNIQUE",
    prompt:
      "Explain [topic] to me in the simplest terms. Then have me re-explain it back. Point out gaps, re-teach what I miss, and repeat until I can explain it clearly on my own.",
  },
];

const CATEGORIES = Array.from(new Set(PROMPTS.map((p) => p.category)));

const PROMPT_VISUALS: Record<string, { gradient: string; icon: React.ReactNode }> = {
  "LEARN ANYTHING IN 20 HOURS": {
    gradient: "from-violet-600 to-indigo-500",
    icon: (
      <svg viewBox="0 0 48 48" fill="none" className="h-14 w-14 opacity-90" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="24" cy="24" r="18" />
        <polyline points="24,12 24,24 32,28" />
        <path d="M16 6.5 Q24 2 32 6.5" strokeDasharray="2 2" />
      </svg>
    ),
  },
  "CREATE A ONE-PAGE CHEAT SHEET": {
    gradient: "from-emerald-500 to-teal-400",
    icon: (
      <svg viewBox="0 0 48 48" fill="none" className="h-14 w-14 opacity-90" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="10" y="6" width="28" height="36" rx="3" />
        <line x1="16" y1="16" x2="32" y2="16" />
        <line x1="16" y1="22" x2="32" y2="22" />
        <line x1="16" y1="28" x2="26" y2="28" />
        <circle cx="33" cy="35" r="5" fill="white" stroke="none" opacity="0.25" />
        <path d="M30 35l2 2 4-4" stroke="white" strokeWidth="1.5" />
      </svg>
    ),
  },
  "QUIZ ME UNTIL I BREAK": {
    gradient: "from-rose-500 to-orange-400",
    icon: (
      <svg viewBox="0 0 48 48" fill="none" className="h-14 w-14 opacity-90" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="24" cy="20" r="12" />
        <path d="M20 17c0-2.2 1.8-4 4-4s4 1.8 4 4c0 2-2 3-2 5h-4" />
        <circle cx="24" cy="25" r="1" fill="white" stroke="none" />
        <path d="M17 36l7-8 7 8" />
        <line x1="24" y1="36" x2="24" y2="42" />
      </svg>
    ),
  },
  "BUILD A LEARNING LADDER": {
    gradient: "from-amber-500 to-yellow-400",
    icon: (
      <svg viewBox="0 0 48 48" fill="none" className="h-14 w-14 opacity-90" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="14" y1="8" x2="14" y2="42" />
        <line x1="34" y1="8" x2="34" y2="42" />
        <line x1="14" y1="16" x2="34" y2="16" />
        <line x1="14" y1="24" x2="34" y2="24" />
        <line x1="14" y1="32" x2="34" y2="32" />
        <line x1="14" y1="40" x2="34" y2="40" />
        <circle cx="34" cy="8" r="4" fill="white" stroke="none" opacity="0.3" />
        <path d="M32 8l1.5 1.5L36 7" stroke="white" strokeWidth="1.5" />
      </svg>
    ),
  },
  "FIND THE BEST LEARNING RESOURCES": {
    gradient: "from-sky-500 to-blue-400",
    icon: (
      <svg viewBox="0 0 48 48" fill="none" className="h-14 w-14 opacity-90" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="21" cy="20" r="11" />
        <line x1="29" y1="29" x2="40" y2="40" />
        <line x1="16" y1="20" x2="26" y2="20" />
        <line x1="21" y1="15" x2="21" y2="25" />
      </svg>
    ),
  },
  "USE THE FEYNMAN TECHNIQUE": {
    gradient: "from-fuchsia-500 to-pink-400",
    icon: (
      <svg viewBox="0 0 48 48" fill="none" className="h-14 w-14 opacity-90" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M24 6c-7 0-12 5-12 11 0 4 2 7.5 5 9.5V30l4-2h3c7 0 12-5 12-11S31 6 24 6z" />
        <line x1="24" y1="34" x2="24" y2="42" />
        <line x1="20" y1="42" x2="28" y2="42" />
        <circle cx="24" cy="18" r="2" fill="white" stroke="none" opacity="0.6" />
      </svg>
    ),
  },
};

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <button
      onClick={handleCopy}
      aria-label={copied ? "Copied" : "Copy prompt"}
      className="flex items-center gap-1.5 rounded-lg border border-[var(--border)] bg-[var(--elevated)] px-3 py-1.5 text-xs font-medium text-[var(--muted)] transition hover:border-[color-mix(in_oklab,var(--accent)_40%,var(--border))] hover:text-[var(--accent)]"
    >
      {copied ? (
        <>
          <svg className="h-3.5 w-3.5 text-emerald-500" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
            <path strokeLinecap="round" strokeLinejoin="round" d="M2.5 8.5l3.5 3.5 7-7" />
          </svg>
          <span className="text-emerald-500">Copied!</span>
        </>
      ) : (
        <>
          <svg className="h-3.5 w-3.5" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
            <rect x="5.5" y="5.5" width="8" height="8" rx="1.5" />
            <path strokeLinecap="round" d="M5.5 10.5H4a1.5 1.5 0 01-1.5-1.5V4A1.5 1.5 0 014 2.5h5A1.5 1.5 0 0110.5 4v1.5" />
          </svg>
          Copy prompt
        </>
      )}
    </button>
  );
}

function PromptDrawer({ item, onClose }: { item: PromptItem | null; onClose: () => void }) {
  const [copied, setCopied] = useState(false);

  if (!item) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end" role="dialog" aria-modal="true">
      <button type="button" className="absolute inset-0 bg-black/60 backdrop-blur-[2px]" aria-label="Close" onClick={onClose} />
      <aside className="relative flex h-full w-full max-w-2xl flex-col border-l border-[var(--border)] bg-[var(--background)] shadow-2xl">
        <div className="flex items-center justify-between gap-3 border-b border-[var(--border)] p-5">
          <div className="min-w-0">
            <span className="text-[10px] font-semibold uppercase tracking-widest text-[var(--accent)]">{item.category}</span>
            <h2 className="truncate text-lg font-semibold leading-snug text-[var(--text)]">{item.title}</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="grid h-9 w-9 shrink-0 place-items-center rounded-lg text-[var(--muted)] transition hover:bg-[var(--elevated)] hover:text-[var(--text)]"
            aria-label="Close"
          >
            <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden>
              <path d="M6.28 5.22a.75.75 0 0 0-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 1 0 1.06 1.06L10 11.06l3.72 3.72a.75.75 0 1 0 1.06-1.06L11.06 10l3.72-3.72a.75.75 0 0 0-1.06-1.06L10 8.94 6.28 5.22Z" />
            </svg>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-5 flex flex-col gap-6">
          {item.image ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={item.image} alt={item.imageAlt ?? item.title} className="h-auto w-full rounded-xl border border-[var(--border)]" />
          ) : PROMPT_VISUALS[item.title] ? (
            <div className={`flex h-48 items-center justify-center rounded-xl bg-gradient-to-br ${PROMPT_VISUALS[item.title].gradient}`}>
              {PROMPT_VISUALS[item.title].icon}
            </div>
          ) : null}
          <div>
            <div className="flex items-center justify-between gap-3 mb-2">
              <span className="text-xs font-semibold uppercase tracking-widest text-[var(--muted)]">Prompt</span>
              <CopyButton text={item.prompt} />
            </div>
            <div className="rounded-xl border border-[var(--border)] bg-[color-mix(in_oklab,var(--surface)_70%,transparent)] px-4 py-3">
              <p className="font-mono text-sm leading-relaxed text-[var(--text)]">{item.prompt}</p>
            </div>
          </div>
        </div>
      </aside>
    </div>
  );
}

function PromptCard({ item, onClick }: { item: PromptItem; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="group flex flex-col overflow-hidden rounded-2xl border border-[var(--border)] bg-[color-mix(in_oklab,var(--elevated)_50%,transparent)] text-left shadow-sm transition hover:border-[color-mix(in_oklab,var(--accent)_40%,var(--border))] hover:bg-[var(--elevated)]"
    >
      {item.image ? (
        <div className="overflow-hidden">
          <Image
            src={item.image}
            alt={item.imageAlt ?? item.title}
            width={400}
            height={280}
            className="h-44 w-full object-cover transition duration-300 group-hover:scale-105"
          />
        </div>
      ) : PROMPT_VISUALS[item.title] ? (
        <div className={`flex h-44 items-center justify-center bg-gradient-to-br ${PROMPT_VISUALS[item.title].gradient} transition duration-300 group-hover:brightness-110`}>
          {PROMPT_VISUALS[item.title].icon}
        </div>
      ) : null}
      <div className="flex flex-1 items-center px-4 py-4">
        <span className="text-sm font-semibold tracking-wide text-[var(--text)] group-hover:text-[var(--accent)]">
          {item.title}
        </span>
      </div>
    </button>
  );
}

export function AIPrompts() {
  const [active, setActive] = useState<PromptItem | null>(null);

  return (
    <>
      <div className="flex flex-col gap-4">
        {CATEGORIES.map((category) => {
          const items = PROMPTS.filter((p) => p.category === category);
          return (
            <details
              key={category}
              className="group overflow-hidden rounded-xl border border-[var(--border)] bg-[color-mix(in_oklab,var(--surface)_92%,transparent)] shadow-sm open:[&_.cat-chevron]:rotate-180"
              open
            >
              <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-4 py-3.5 transition hover:bg-[color-mix(in_oklab,var(--elevated)_35%,transparent)] [&::-webkit-details-marker]:hidden">
                <div className="flex items-center gap-2.5">
                  <h2 className="text-base font-semibold tracking-tight text-[var(--text)]">{category}</h2>
                  <span className="rounded-full bg-[var(--elevated)] px-2 py-0.5 text-xs text-[var(--muted)]">
                    {items.length}
                  </span>
                </div>
                <svg
                  className="cat-chevron h-5 w-5 shrink-0 text-[var(--muted)] transition-transform duration-200"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden
                >
                  <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.94a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clipRule="evenodd" />
                </svg>
              </summary>
              <div className="border-t border-[var(--border)] px-4 pb-4 pt-4">
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {items.map((item) => (
                    <PromptCard key={item.id} item={item} onClick={() => setActive(item)} />
                  ))}
                </div>
              </div>
            </details>
          );
        })}
      </div>

      <PromptDrawer item={active} onClose={() => setActive(null)} />
    </>
  );
}
