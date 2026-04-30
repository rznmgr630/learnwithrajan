import type { LocalizedString } from "@/lib/i18n/types";
import type { RoadmapDay, RoadmapDayDetail, RoadmapWeek } from "@/lib/challenge-data";
import { DEVOPS_DAY_DETAILS } from "./devops-day-details-stub";
import { devopsDayTitle, devopsTags, devopsWeekTitle } from "./devops-roadmap-i18n";

export const DEVOPS_CURRENT_DAY = 1;
export const DEVOPS_TOTAL_DAYS = 91;

type DayTagPair = [string, string];

const WEEK_DAY_TAGS: Record<number, DayTagPair> = {
  1: ["linux", "fundamentals"], 2: ["linux", "filesystem"], 3: ["linux", "security"],
  4: ["linux", "processes"], 5: ["linux", "packages"], 6: ["linux", "scripting"], 7: ["linux", "networking"],
  8: ["networking", "theory"], 9: ["networking", "ip"], 10: ["networking", "dns"],
  11: ["networking", "http"], 12: ["networking", "firewall"], 13: ["networking", "tools"], 14: ["networking", "vpn"],
  15: ["git", "fundamentals"], 16: ["git", "branching"], 17: ["git", "tagging"],
  18: ["git", "hooks"], 19: ["git", "patterns"], 20: ["git", "collaboration"], 21: ["git", "workflow"],
  22: ["python", "fundamentals"], 23: ["python", "scripting"], 24: ["python", "api"],
  25: ["bash", "scripting"], 26: ["python", "parsing"], 27: ["python", "automation"], 28: ["python", "cli"],
  29: ["aws", "cloud"], 30: ["aws", "iam"], 31: ["aws", "ec2"],
  32: ["aws", "vpc"], 33: ["aws", "s3"], 34: ["aws", "rds"], 35: ["aws", "scaling"],
  36: ["aws", "monitoring"], 37: ["aws", "serverless"], 38: ["aws", "dns"],
  39: ["aws", "security"], 40: ["aws", "containers"], 41: ["aws", "cli"], 42: ["aws", "cost"],
  43: ["docker", "fundamentals"], 44: ["docker", "images"], 45: ["docker", "containers"],
  46: ["docker", "networking"], 47: ["docker", "volumes"], 48: ["docker", "compose"], 49: ["docker", "registry"],
  50: ["cicd", "fundamentals"], 51: ["jenkins", "fundamentals"], 52: ["jenkins", "pipelines"],
  53: ["jenkins", "automation"], 54: ["cicd", "testing"], 55: ["cicd", "deployment"], 56: ["jenkins", "scripting"],
  57: ["kubernetes", "fundamentals"], 58: ["kubernetes", "workloads"], 59: ["kubernetes", "config"],
  60: ["kubernetes", "networking"], 61: ["helm", "kubernetes"], 62: ["kubernetes", "scaling"], 63: ["kubernetes", "production"],
  64: ["nginx", "proxy"], 65: ["nginx", "cache"], 66: ["nginx", "scripting"],
  67: ["nginx", "loadbalancer"], 68: ["firewall", "security"], 69: ["ssl", "security"], 70: ["nginx", "ha"],
  71: ["ansible", "fundamentals"], 72: ["ansible", "inventory"], 73: ["ansible", "tools"],
  74: ["ansible", "playbooks"], 75: ["ansible", "scripting"], 76: ["ansible", "roles"], 77: ["ansible", "vault"],
  78: ["terraform", "iac"], 79: ["terraform", "fundamentals"], 80: ["terraform", "state"],
  81: ["terraform", "modules"], 82: ["terraform", "modules"], 83: ["terraform", "workspaces"], 84: ["terraform", "cicd"],
  85: ["monitoring", "observability"], 86: ["prometheus", "monitoring"], 87: ["prometheus", "tools"],
  88: ["prometheus", "promql"], 89: ["prometheus", "alerting"], 90: ["grafana", "monitoring"], 91: ["monitoring", "production"],
};

function devopsDayRow(day: number): RoadmapDay {
  const tagPair = WEEK_DAY_TAGS[day] as DayTagPair ?? ["fundamentals", "tools"];
  return {
    day,
    title: devopsDayTitle(day),
    tags: devopsTags(tagPair),
    detail: DEVOPS_DAY_DETAILS[day],
  };
}

function daysRange(start: number, end: number): RoadmapDay[] {
  const days: RoadmapDay[] = [];
  for (let d = start; d <= end; d++) days.push(devopsDayRow(d));
  return days;
}

const DOT_COLORS: Record<string, string> = {
  "devops-w1": "bg-orange-500",
  "devops-w2": "bg-blue-500",
  "devops-w3": "bg-[var(--accent)]",
  "devops-w4": "bg-yellow-500",
  "devops-w5": "bg-amber-500",
  "devops-w6": "bg-amber-400",
  "devops-w7": "bg-cyan-500",
  "devops-w8": "bg-green-500",
  "devops-w9": "bg-indigo-500",
  "devops-w10": "bg-violet-500",
  "devops-w11": "bg-red-500",
  "devops-w12": "bg-purple-500",
  "devops-w13": "bg-pink-500",
};

export const DEVOPS_ROADMAP_WEEKS: RoadmapWeek[] = [
  { id: "devops-w1", title: devopsWeekTitle("devops-w1"), dotClass: DOT_COLORS["devops-w1"], days: daysRange(1, 7) },
  { id: "devops-w2", title: devopsWeekTitle("devops-w2"), dotClass: DOT_COLORS["devops-w2"], days: daysRange(8, 14) },
  { id: "devops-w3", title: devopsWeekTitle("devops-w3"), dotClass: DOT_COLORS["devops-w3"], days: daysRange(15, 21) },
  { id: "devops-w4", title: devopsWeekTitle("devops-w4"), dotClass: DOT_COLORS["devops-w4"], days: daysRange(22, 28) },
  { id: "devops-w5", title: devopsWeekTitle("devops-w5"), dotClass: DOT_COLORS["devops-w5"], days: daysRange(29, 35) },
  { id: "devops-w6", title: devopsWeekTitle("devops-w6"), dotClass: DOT_COLORS["devops-w6"], days: daysRange(36, 42) },
  { id: "devops-w7", title: devopsWeekTitle("devops-w7"), dotClass: DOT_COLORS["devops-w7"], days: daysRange(43, 49) },
  { id: "devops-w8", title: devopsWeekTitle("devops-w8"), dotClass: DOT_COLORS["devops-w8"], days: daysRange(50, 56) },
  { id: "devops-w9", title: devopsWeekTitle("devops-w9"), dotClass: DOT_COLORS["devops-w9"], days: daysRange(57, 63) },
  { id: "devops-w10", title: devopsWeekTitle("devops-w10"), dotClass: DOT_COLORS["devops-w10"], days: daysRange(64, 70) },
  { id: "devops-w11", title: devopsWeekTitle("devops-w11"), dotClass: DOT_COLORS["devops-w11"], days: daysRange(71, 77) },
  { id: "devops-w12", title: devopsWeekTitle("devops-w12"), dotClass: DOT_COLORS["devops-w12"], days: daysRange(78, 84) },
  { id: "devops-w13", title: devopsWeekTitle("devops-w13"), dotClass: DOT_COLORS["devops-w13"], days: daysRange(85, 91) },
];

export function getAllDevopsRoadmapDays(): RoadmapDay[] {
  return DEVOPS_ROADMAP_WEEKS.flatMap((w) => w.days).sort((a, b) => a.day - b.day);
}

export function getDevopsRoadmapDayContext(dayNumber: number): { weekTitle: LocalizedString; day: RoadmapDay } | null {
  for (const week of DEVOPS_ROADMAP_WEEKS) {
    const day = week.days.find((d) => d.day === dayNumber);
    if (day) return { weekTitle: week.title, day };
  }
  return null;
}

export function resolveDevopsDayDetail(day: RoadmapDay): RoadmapDayDetail {
  if (day.detail) return day.detail;
  return {
    bullets: [
      {
        en: "Review the day title, tags, and your primary course notes for this topic.",
        np: "दिनको शीर्षक, ट्याग, र तपाईंको मुख्य पाठ्यक्रम नोट समीक्षा गर्नुहोस्।",
        jp: "日のタイトル・タグ・主教材のノートでこのトピックを振り返る。",
      },
      { en: "Try the hands-on exercises in a practice environment.", np: "अभ्यास वातावरणमा व्यावहारिक अभ्यास गर्नुहोस्।", jp: "練習環境でハンズオンを試してみましょう。" },
    ],
  };
}

export function seedDevopsCompletedDayNumbers(): Set<number> {
  const done = new Set<number>();
  for (let d = 1; d < DEVOPS_CURRENT_DAY; d += 1) done.add(d);
  return done;
}
