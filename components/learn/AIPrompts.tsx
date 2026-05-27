"use client";

import Image from "next/image";
import { useState, useEffect } from "react";

interface PromptItem {
  id: number;
  title: string;
  image?: string;
  imageAlt?: string;
  prompt: string;
}

const PROMPTS: PromptItem[] = [
  {
    id: 1,
    title: "MS PAINT EFFECT",
    image: "/prompts/ms-paint.png",
    imageAlt: "MS Paint style redraw result",
    prompt:
      "Redraw the attached image in the most clumsy, scribbly, and utterly pathetic way possible. Use a white background, and make it look like it was drawn in an old computer painting program with a mouse. It should be vaguely similar but also not really, kind of matching but also off in a confusing, awkward way, with that low-quality pixel-by-pixel feel that really emphasizes how ridiculously bad it is. Actually, you know what, whatever, just draw it however you want. MS paint type",
  },
  {
    id: 2,
    title: "SKIN ENHANCER",
    image: "/prompts/skin_enhancer.png",
    imageAlt: "Skin enhancer before and after result",
    prompt:
      "Skin enhancement retouch, preserve original identity and structure, refine skin texture without smoothing, maintain pores, freckles, and natural variation, reduce temporary blemishes and redness only, even out tone subtly without flattening depth, retain natural highlights and shadow transitions, keep under-eye detail intact with slight softening not removal, avoid plastic or airbrushed finish, maintain original lighting and color balance, enhance micro-contrast for realistic texture, lips and eyes untouched except for natural clarity, no reshaping of facial features, no artificial glow, no over-sharpening, seamless integration with original image, invisible edit with high realism.",
  },
  {
    id: 3,
    title: "MINECRAFT EFFECT",
    image: "/prompts/minecraft.png",
    imageAlt: "Minecraft effect before and after result",
    prompt:
      "Keep the human subject 100 percent photorealistic and untouched. No pixel filter, no stylization, no lighting remap on skin. Preserve exact facial detail, pores, fabric weave, hair strands, natural shadows. Expression and posture remain identical. Rebuild the background as a structurally accurate Minecraft voxel replica of the original location. Do not reinterpret. Match the exact layout, spacing, depth, and geometry from the reference image. If there is a path, replicate its exact curve and width using gravel or dirt blocks. If there are trees, match trunk positions, height ratios, canopy spread using appropriate log and leaf blocks. If there are buildings, recreate their silhouette, window placement, roof angle using Minecraft block geometry. If there are rocks, benches, fences, signs, convert them into block equivalents but maintain their exact position and proportion relative to the subject. Perspective must match the original photo perfectly. Horizon line, camera height, focal distance, framing, subject scale all identical. Any object physically touching the subject must convert into Minecraft logic.",
  },
  {
    id: 4,
    title: "GROUP SELFIE",
    image: "/prompts/group_selfie.png",
    imageAlt: "Group selfie AI generated result",
    prompt:
      "Raw iPhone selfie, subjects from reference images standing close together, both leaning slightly into frame, casual shoulder-to-shoulder composition, direct gaze into camera with relaxed neutral expressions, handheld at arm's length with slight upward tilt, soft indoor lighting mixed with phone flash causing mild overexposure on highlights and shadow falloff, natural skin texture visible with pores and subtle makeup detail, stray hairs and fabric creases present, background loosely visible with everyday environment elements slightly out of focus, minor motion blur in edges, slight lens distortion from close proximity, off-center framing with imperfect crop, subtle ISO grain and uneven white balance, unpolished, candid realism.",
  },
  {
    id: 5,
    title: "LEGO EFFECT",
    image: "/prompts/lego_effect.png",
    imageAlt: "LEGO effect before and after result",
    prompt:
      "Keep the human subject 100 percent photorealistic and untouched. No pixel filter, no stylization, no lighting remap on skin. Preserve exact facial detail, pores, fabric weave, hair strands, natural shadows. Expression and posture remain identical. Rebuild the background as a structurally accurate LEGO replica of the original location. Do not reinterpret. Match the exact layout, spacing, depth, and geometry from the reference image. If there is a path, replicate its exact curve and width using LEGO tile and plate construction. If there are trees, match trunk positions, height ratios, canopy spread using appropriate LEGO trunk builds and layered foliage elements. If there are buildings, recreate their silhouette, window placement, roof angle using authentic LEGO architecture geometry and brick proportions. If there are rocks, benches, fences, signs, convert them into LEGO-built equivalents but maintain their exact position and proportion relative to the subject. Perspective must match the original photo perfectly. Horizon line, camera height, focal distance, framing, subject scale all identical. Any object physically touching the subject must convert into LEGO logic. Real animal becomes a LEGO animal or molded figure equivalent. Held object becomes a brick-built version scaled correctly to the hand. Objects not touching the subject remain LEGO-built but positioned exactly where they appear in the reference. Lighting recreated as realistic daylight interacting with LEGO plastic materials while matching the direction and intensity of the original photo. Preserve subtle specular highlights on LEGO surfaces, natural shadow falloff, soft environmental reflections, and realistic material response. If fog exists, rebuild it using layered atmospheric haze while preserving the same depth falloff. Maintain recognizable background identity. The location should be immediately identifiable from composition alone, just rendered in detailed LEGO construction. High-resolution cinematic realism. Realistic LEGO material texture with visible seams, studs, injection molding detail, slight surface scuffs, authentic plastic reflections. No UI, no text, no overlays.",
  },
];

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
  useEffect(() => {
    if (!item) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [item, onClose]);

  if (!item) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end" role="dialog" aria-modal="true">
      {/* Backdrop */}
      <button
        type="button"
        className="absolute inset-0 bg-black/60 backdrop-blur-[2px]"
        aria-label="Close"
        onClick={onClose}
      />

      {/* Panel */}
      <aside className="relative flex h-full w-full max-w-2xl flex-col border-l border-[var(--border)] bg-[var(--background)] shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between gap-3 border-b border-[var(--border)] p-5">
          <div className="flex items-center gap-3 min-w-0">
            <h2 className="text-lg font-semibold leading-snug text-[var(--text)] truncate">{item.title}</h2>
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

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto p-5 flex flex-col gap-6">
          {/* Image */}
          {item.image && (
            <div className="overflow-hidden rounded-xl border border-[var(--border)]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={item.image}
                alt={item.imageAlt ?? item.title}
                className="h-auto w-full"
              />
            </div>
          )}

          {/* Prompt */}
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

export function AIPrompts() {
  const [active, setActive] = useState<PromptItem | null>(null);

  return (
    <>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {PROMPTS.map((item) => (
          <button
            key={item.id}
            onClick={() => setActive(item)}
            className="group flex flex-col overflow-hidden rounded-2xl border border-[var(--border)] bg-[color-mix(in_oklab,var(--elevated)_50%,transparent)] text-left shadow-sm transition hover:border-[color-mix(in_oklab,var(--accent)_40%,var(--border))] hover:bg-[var(--elevated)]"
          >
            {/* Image */}
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
            ) : (
              <div className="flex h-44 items-center justify-center bg-[color-mix(in_oklab,var(--elevated)_60%,transparent)]">
                <span className="text-xs text-[var(--muted)]">BEFORE / AFTER</span>
              </div>
            )}

            {/* Title */}
            <div className="px-4 py-3">
              <span className="text-sm font-semibold tracking-wide text-[var(--text)] group-hover:text-[var(--accent)]">
                {item.title}
              </span>
            </div>
          </button>
        ))}
      </div>

      <PromptDrawer item={active} onClose={() => setActive(null)} />
    </>
  );
}
