import type { RoadmapDayDetail } from "@/lib/challenge-data";
import { DEVOPS_DAY_1_DETAIL } from "./devops-week1-day1-detail";
import { DEVOPS_DAY_2_DETAIL } from "./devops-week1-day2-detail";
import { DEVOPS_DAY_3_DETAIL } from "./devops-week1-day3-detail";
import { DEVOPS_DAY_4_DETAIL } from "./devops-week1-day4-detail";
import { DEVOPS_DAY_5_DETAIL } from "./devops-week1-day5-detail";
import { DEVOPS_DAY_6_DETAIL } from "./devops-week1-day6-detail";
import { DEVOPS_DAY_7_DETAIL } from "./devops-week1-day7-detail";
import { DEVOPS_DAY_8_DETAIL } from "./devops-week2-day8-detail";
import { DEVOPS_DAY_9_DETAIL } from "./devops-week2-day9-detail";
import { DEVOPS_DAY_10_DETAIL } from "./devops-week2-day10-detail";
import { DEVOPS_DAY_11_DETAIL } from "./devops-week2-day11-detail";
import { DEVOPS_DAY_12_DETAIL } from "./devops-week2-day12-detail";
import { DEVOPS_DAY_13_DETAIL } from "./devops-week2-day13-detail";
import { DEVOPS_DAY_14_DETAIL } from "./devops-week2-day14-detail";
import { DEVOPS_DAY_15_DETAIL } from "./devops-week3-day15-detail";
import { DEVOPS_DAY_16_DETAIL } from "./devops-week3-day16-detail";
import { DEVOPS_DAY_17_DETAIL } from "./devops-week3-day17-detail";
import { DEVOPS_DAY_18_DETAIL } from "./devops-week3-day18-detail";
import { DEVOPS_DAY_19_DETAIL } from "./devops-week3-day19-detail";
import { DEVOPS_DAY_20_DETAIL } from "./devops-week3-day20-detail";
import { DEVOPS_DAY_21_DETAIL } from "./devops-week3-day21-detail";
import { DEVOPS_DAY_22_DETAIL } from "./devops-week4-day22-detail";
import { DEVOPS_DAY_23_DETAIL } from "./devops-week4-day23-detail";
import { DEVOPS_DAY_24_DETAIL } from "./devops-week4-day24-detail";
import { DEVOPS_DAY_25_DETAIL } from "./devops-week4-day25-detail";
import { DEVOPS_DAY_26_DETAIL } from "./devops-week4-day26-detail";
import { DEVOPS_DAY_27_DETAIL } from "./devops-week4-day27-detail";
import { DEVOPS_DAY_28_DETAIL } from "./devops-week4-day28-detail";
import { DEVOPS_DAY_29_DETAIL } from "./devops-week5-day29-detail";
import { DEVOPS_DAY_30_DETAIL } from "./devops-week5-day30-detail";
import { DEVOPS_DAY_31_DETAIL } from "./devops-week5-day31-detail";
import { DEVOPS_DAY_32_DETAIL } from "./devops-week5-day32-detail";
import { DEVOPS_DAY_33_DETAIL } from "./devops-week5-day33-detail";
import { DEVOPS_DAY_34_DETAIL } from "./devops-week5-day34-detail";
import { DEVOPS_DAY_35_DETAIL } from "./devops-week5-day35-detail";
import { DEVOPS_DAY_36_DETAIL } from "./devops-week6-day36-detail";
import { DEVOPS_DAY_37_DETAIL } from "./devops-week6-day37-detail";
import { DEVOPS_DAY_38_DETAIL } from "./devops-week6-day38-detail";
import { DEVOPS_DAY_39_DETAIL } from "./devops-week6-day39-detail";
import { DEVOPS_DAY_40_DETAIL } from "./devops-week6-day40-detail";
import { DEVOPS_DAY_41_DETAIL } from "./devops-week6-day41-detail";
import { DEVOPS_DAY_42_DETAIL } from "./devops-week6-day42-detail";
import { DEVOPS_DAY_43_DETAIL } from "./devops-week7-day43-detail";
import { DEVOPS_DAY_44_DETAIL } from "./devops-week7-day44-detail";
import { DEVOPS_DAY_45_DETAIL } from "./devops-week7-day45-detail";
import { DEVOPS_DAY_46_DETAIL } from "./devops-week7-day46-detail";
import { DEVOPS_DAY_47_DETAIL } from "./devops-week7-day47-detail";
import { DEVOPS_DAY_48_DETAIL } from "./devops-week7-day48-detail";
import { DEVOPS_DAY_49_DETAIL } from "./devops-week7-day49-detail";
import { DEVOPS_DAY_50_DETAIL } from "./devops-week8-day50-detail";
import { DEVOPS_DAY_51_DETAIL } from "./devops-week8-day51-detail";
import { DEVOPS_DAY_52_DETAIL } from "./devops-week8-day52-detail";
import { DEVOPS_DAY_53_DETAIL } from "./devops-week8-day53-detail";
import { DEVOPS_DAY_54_DETAIL } from "./devops-week8-day54-detail";
import { DEVOPS_DAY_55_DETAIL } from "./devops-week8-day55-detail";
import { DEVOPS_DAY_56_DETAIL } from "./devops-week8-day56-detail";

/** Placeholder detail until per-day content is split into week modules (week1-linux, …). */
function stubDayDetail(_day: number): RoadmapDayDetail {
  return {
    bullets: [
      {
        en: "Align today's practice with the two tags on the roadmap card (topic + subtopic).",
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
  out[1] = DEVOPS_DAY_1_DETAIL;
  out[2] = DEVOPS_DAY_2_DETAIL;
  out[3] = DEVOPS_DAY_3_DETAIL;
  out[4] = DEVOPS_DAY_4_DETAIL;
  out[5] = DEVOPS_DAY_5_DETAIL;
  out[6] = DEVOPS_DAY_6_DETAIL;
  out[7] = DEVOPS_DAY_7_DETAIL;
  out[8] = DEVOPS_DAY_8_DETAIL;
  out[9] = DEVOPS_DAY_9_DETAIL;
  out[10] = DEVOPS_DAY_10_DETAIL;
  out[11] = DEVOPS_DAY_11_DETAIL;
  out[12] = DEVOPS_DAY_12_DETAIL;
  out[13] = DEVOPS_DAY_13_DETAIL;
  out[14] = DEVOPS_DAY_14_DETAIL;
  out[15] = DEVOPS_DAY_15_DETAIL;
  out[16] = DEVOPS_DAY_16_DETAIL;
  out[17] = DEVOPS_DAY_17_DETAIL;
  out[18] = DEVOPS_DAY_18_DETAIL;
  out[19] = DEVOPS_DAY_19_DETAIL;
  out[20] = DEVOPS_DAY_20_DETAIL;
  out[21] = DEVOPS_DAY_21_DETAIL;
  out[22] = DEVOPS_DAY_22_DETAIL;
  out[23] = DEVOPS_DAY_23_DETAIL;
  out[24] = DEVOPS_DAY_24_DETAIL;
  out[25] = DEVOPS_DAY_25_DETAIL;
  out[26] = DEVOPS_DAY_26_DETAIL;
  out[27] = DEVOPS_DAY_27_DETAIL;
  out[28] = DEVOPS_DAY_28_DETAIL;
  out[29] = DEVOPS_DAY_29_DETAIL;
  out[30] = DEVOPS_DAY_30_DETAIL;
  out[31] = DEVOPS_DAY_31_DETAIL;
  out[32] = DEVOPS_DAY_32_DETAIL;
  out[33] = DEVOPS_DAY_33_DETAIL;
  out[34] = DEVOPS_DAY_34_DETAIL;
  out[35] = DEVOPS_DAY_35_DETAIL;
  out[36] = DEVOPS_DAY_36_DETAIL;
  out[37] = DEVOPS_DAY_37_DETAIL;
  out[38] = DEVOPS_DAY_38_DETAIL;
  out[39] = DEVOPS_DAY_39_DETAIL;
  out[40] = DEVOPS_DAY_40_DETAIL;
  out[41] = DEVOPS_DAY_41_DETAIL;
  out[42] = DEVOPS_DAY_42_DETAIL;
  out[43] = DEVOPS_DAY_43_DETAIL;
  out[44] = DEVOPS_DAY_44_DETAIL;
  out[45] = DEVOPS_DAY_45_DETAIL;
  out[46] = DEVOPS_DAY_46_DETAIL;
  out[47] = DEVOPS_DAY_47_DETAIL;
  out[48] = DEVOPS_DAY_48_DETAIL;
  out[49] = DEVOPS_DAY_49_DETAIL;
  out[50] = DEVOPS_DAY_50_DETAIL;
  out[51] = DEVOPS_DAY_51_DETAIL;
  out[52] = DEVOPS_DAY_52_DETAIL;
  out[53] = DEVOPS_DAY_53_DETAIL;
  out[54] = DEVOPS_DAY_54_DETAIL;
  out[55] = DEVOPS_DAY_55_DETAIL;
  out[56] = DEVOPS_DAY_56_DETAIL;
  return out;
})();
