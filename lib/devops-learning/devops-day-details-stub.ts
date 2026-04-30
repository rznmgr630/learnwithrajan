import type { RoadmapDayDetail } from "@/lib/challenge-data";

/** Placeholder detail until per-day content is split into week modules (week1-linux, …). */
function stubDayDetail(_day: number): RoadmapDayDetail {
  return {
    bullets: [
      {
        en: "Align today’s practice with the two tags on the roadmap card (topic + subtopic).",
        np: "कार्डका दुई ट्याग अनुसार अभ्यास।",
        jp: "カードの2つのタグ（トピックとサブトピック）に合わせて学習する。",
      },
      {
        en: "Prefer disposable VMs, cloud sandboxes, or local containers over shared machines with long-lived credentials.",
        np: "अलग VM वा sandbox प्रयोग गर्नुहोस्।",
        jp: "使い捨て VM・クラウドのサンドボックス・ローカルコンテナを優先する。",
      },
    ],
  };
}

export const DEVOPS_DAY_DETAILS: Record<number, RoadmapDayDetail> = (() => {
  const out: Record<number, RoadmapDayDetail> = {};
  for (let d = 1; d <= 91; d += 1) out[d] = stubDayDetail(d);
  return out;
})();
