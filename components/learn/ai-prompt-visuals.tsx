"use client";

import type React from "react";

export const PROMPT_VISUALS: Record<string, { gradient: string; icon: React.ReactNode }> = {
  "TURN CLAUDE INTO A FULL STARTUP ENGINEERING TEAM": {
    gradient: "from-cyan-500 to-blue-600",
    icon: (
      <svg viewBox="0 0 48 48" fill="none" className="h-14 w-14 opacity-90" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M24 6l4 10h10l-8 6 3 10-9-6-9 6 3-10-8-6h10z" />
        <line x1="24" y1="32" x2="24" y2="42" />
        <line x1="18" y1="42" x2="30" y2="42" />
      </svg>
    ),
  },
  "TURN CLAUDE INTO A PRODUCTION-LEVEL DEBUGGING MONSTER": {
    gradient: "from-red-500 to-rose-600",
    icon: (
      <svg viewBox="0 0 48 48" fill="none" className="h-14 w-14 opacity-90" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <ellipse cx="24" cy="26" rx="9" ry="11" />
        <path d="M18 16c0-3.3 2.7-6 6-6s6 2.7 6 6" />
        <line x1="15" y1="22" x2="9" y2="18" />
        <line x1="15" y1="30" x2="9" y2="30" />
        <line x1="15" y1="36" x2="9" y2="40" />
        <line x1="33" y1="22" x2="39" y2="18" />
        <line x1="33" y1="30" x2="39" y2="30" />
        <line x1="33" y1="36" x2="39" y2="40" />
        <circle cx="21" cy="24" r="1.5" fill="white" stroke="none" />
        <circle cx="27" cy="24" r="1.5" fill="white" stroke="none" />
      </svg>
    ),
  },
  "TURN CLAUDE INTO A PERFORMANCE OPTIMIZATION ENGINEER": {
    gradient: "from-yellow-500 to-orange-500",
    icon: (
      <svg viewBox="0 0 48 48" fill="none" className="h-14 w-14 opacity-90" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M8 36a20 20 0 0 1 32 0" />
        <line x1="24" y1="36" x2="24" y2="20" />
        <line x1="24" y1="36" x2="34" y2="26" />
        <circle cx="24" cy="36" r="3" fill="white" stroke="none" opacity="0.5" />
        <line x1="8" y1="36" x2="6" y2="36" />
        <line x1="40" y1="36" x2="42" y2="36" />
        <line x1="24" y1="16" x2="24" y2="14" />
        <line x1="14" y1="19" x2="13" y2="17.4" />
        <line x1="34" y1="19" x2="35" y2="17.4" />
      </svg>
    ),
  },
  "MAKE CLAUDE REBUILD MESSY CODE INTO CLEAN SCALABLE ARCHITECTURE": {
    gradient: "from-teal-500 to-cyan-400",
    icon: (
      <svg viewBox="0 0 48 48" fill="none" className="h-14 w-14 opacity-90" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="8" y="8" width="14" height="10" rx="2" />
        <rect x="26" y="8" width="14" height="10" rx="2" />
        <rect x="17" y="30" width="14" height="10" rx="2" />
        <line x1="15" y1="18" x2="24" y2="30" />
        <line x1="33" y1="18" x2="24" y2="30" />
      </svg>
    ),
  },
  "MAKE CLAUDE ARCHITECT YOUR ENTIRE STARTUP BACKEND": {
    gradient: "from-blue-600 to-indigo-500",
    icon: (
      <svg viewBox="0 0 48 48" fill="none" className="h-14 w-14 opacity-90" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <ellipse cx="24" cy="12" rx="14" ry="5" />
        <path d="M10 12v8c0 2.8 6.3 5 14 5s14-2.2 14-5v-8" />
        <path d="M10 20v8c0 2.8 6.3 5 14 5s14-2.2 14-5v-8" />
        <path d="M10 28v8c0 2.8 6.3 5 14 5s14-2.2 14-5v-8" />
      </svg>
    ),
  },
  "TURN CLAUDE INTO AN ENTIRE AI ENGINEERING TEAM": {
    gradient: "from-purple-500 to-violet-600",
    icon: (
      <svg viewBox="0 0 48 48" fill="none" className="h-14 w-14 opacity-90" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="24" cy="12" r="5" />
        <circle cx="10" cy="34" r="5" />
        <circle cx="38" cy="34" r="5" />
        <line x1="24" y1="17" x2="24" y2="26" />
        <line x1="24" y1="26" x2="10" y2="29" />
        <line x1="24" y1="26" x2="38" y2="29" />
        <circle cx="24" cy="26" r="3" fill="white" stroke="none" opacity="0.3" />
      </svg>
    ),
  },
  "TURN CLAUDE INTO A SENIOR FRONTEND ENGINEER": {
    gradient: "from-sky-500 to-cyan-500",
    icon: (
      <svg viewBox="0 0 48 48" fill="none" className="h-14 w-14 opacity-90" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="6" y="10" width="36" height="24" rx="3" />
        <line x1="18" y1="38" x2="30" y2="38" />
        <line x1="24" y1="34" x2="24" y2="38" />
        <polyline points="14,22 20,28 28,18" />
        <line x1="30" y1="22" x2="36" y2="22" />
        <line x1="30" y1="26" x2="34" y2="26" />
      </svg>
    ),
  },
  "AI TECHNICAL LEAD MODE": {
    gradient: "from-amber-500 to-yellow-400",
    icon: (
      <svg viewBox="0 0 48 48" fill="none" className="h-14 w-14 opacity-90" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="24" cy="16" r="7" />
        <path d="M10 42c0-7.7 6.3-14 14-14s14 6.3 14 14" />
        <polyline points="30,10 34,14 38,8" />
      </svg>
    ),
  },
  "PRODUCTION SECURITY AUDIT": {
    gradient: "from-slate-600 to-gray-500",
    icon: (
      <svg viewBox="0 0 48 48" fill="none" className="h-14 w-14 opacity-90" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M24 6l14 5v10c0 9-6 17-14 21C16 38 10 30 10 21V11z" />
        <polyline points="18,24 22,28 30,18" />
      </svg>
    ),
  },
  "SENIOR DEVOPS + DEPLOYMENT ENGINEER": {
    gradient: "from-green-500 to-emerald-400",
    icon: (
      <svg viewBox="0 0 48 48" fill="none" className="h-14 w-14 opacity-90" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M32 20c0-4.4-3.6-8-8-8s-8 3.6-8 8c-4 0-7 3-7 7s3 7 7 7h16c4 0 7-3 7-7s-3-7-7-7z" />
        <line x1="24" y1="28" x2="24" y2="38" />
        <polyline points="20,34 24,38 28,34" />
      </svg>
    ),
  },
  "SYSTEM DESIGN CONCEPTS CRASH COURSE": {
    gradient: "from-cyan-600 to-blue-700",
    icon: (
      <svg viewBox="0 0 48 48" fill="none" className="h-14 w-14 opacity-90" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="6" y="8" width="12" height="8" rx="2" />
        <rect x="30" y="8" width="12" height="8" rx="2" />
        <rect x="18" y="32" width="12" height="8" rx="2" />
        <line x1="12" y1="16" x2="12" y2="24" />
        <line x1="36" y1="16" x2="36" y2="24" />
        <line x1="12" y1="24" x2="24" y2="32" />
        <line x1="36" y1="24" x2="24" y2="32" />
      </svg>
    ),
  },
  "MOCK SYSTEM DESIGN INTERVIEW": {
    gradient: "from-indigo-600 to-violet-600",
    icon: (
      <svg viewBox="0 0 48 48" fill="none" className="h-14 w-14 opacity-90" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="8" y="8" width="32" height="22" rx="3" />
        <line x1="8" y1="34" x2="40" y2="34" />
        <line x1="16" y1="40" x2="32" y2="40" />
        <line x1="24" y1="34" x2="24" y2="40" />
        <line x1="14" y1="16" x2="20" y2="16" />
        <line x1="14" y1="21" x2="28" y2="21" />
        <circle cx="34" cy="18" r="4" />
        <line x1="37" y1="21" x2="40" y2="24" />
      </svg>
    ),
  },
  "DEEP DIVE ANY SYSTEM DESIGN CONCEPT": {
    gradient: "from-blue-700 to-cyan-500",
    icon: (
      <svg viewBox="0 0 48 48" fill="none" className="h-14 w-14 opacity-90" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="24" cy="24" r="14" />
        <circle cx="24" cy="24" r="6" />
        <line x1="24" y1="6" x2="24" y2="10" />
        <line x1="24" y1="38" x2="24" y2="42" />
        <line x1="6" y1="24" x2="10" y2="24" />
        <line x1="38" y1="24" x2="42" y2="24" />
      </svg>
    ),
  },
  "GENERATE INTERVIEW QUESTIONS FOR ANY ROLE": {
    gradient: "from-emerald-600 to-teal-500",
    icon: (
      <svg viewBox="0 0 48 48" fill="none" className="h-14 w-14 opacity-90" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="10" y="6" width="28" height="36" rx="3" />
        <line x1="16" y1="14" x2="32" y2="14" />
        <line x1="16" y1="20" x2="32" y2="20" />
        <line x1="16" y1="26" x2="24" y2="26" />
        <circle cx="30" cy="32" r="5" />
        <line x1="34" y1="36" x2="37" y2="39" />
      </svg>
    ),
  },
  "MOCK TECHNICAL INTERVIEW": {
    gradient: "from-orange-500 to-red-500",
    icon: (
      <svg viewBox="0 0 48 48" fill="none" className="h-14 w-14 opacity-90" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="8" y="10" width="32" height="26" rx="3" />
        <polyline points="16,22 20,26 28,18" />
        <line x1="32" y1="20" x2="36" y2="20" />
        <line x1="32" y1="25" x2="36" y2="25" />
        <line x1="16" y1="40" x2="32" y2="40" />
        <line x1="24" y1="36" x2="24" y2="40" />
      </svg>
    ),
  },
  "PERFECT BEHAVIORAL INTERVIEW ANSWERS": {
    gradient: "from-pink-500 to-rose-500",
    icon: (
      <svg viewBox="0 0 48 48" fill="none" className="h-14 w-14 opacity-90" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M24 6c-7 0-12 4.5-12 10 0 3.5 2 6.5 5 8.5V28l5-3h2c7 0 12-4.5 12-10S31 6 24 6z" />
        <line x1="20" y1="14" x2="20" y2="18" />
        <line x1="24" y1="12" x2="24" y2="18" />
        <line x1="28" y1="14" x2="28" y2="18" />
        <path d="M18 34c0 4 2.7 8 6 8s6-4 6-8" />
      </svg>
    ),
  },
  "EXPLAIN HOW TO ANSWER ANY INTERVIEW QUESTION": {
    gradient: "from-violet-600 to-purple-500",
    icon: (
      <svg viewBox="0 0 48 48" fill="none" className="h-14 w-14 opacity-90" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="24" cy="18" r="10" />
        <path d="M21 15c0-1.7 1.3-3 3-3s3 1.3 3 3c0 1.5-1.5 2.5-2 4h-2" />
        <circle cx="24" cy="22" r="1" fill="white" stroke="none" />
        <path d="M14 32h20M14 38h14" />
      </svg>
    ),
  },
  "CRACK THE SALARY NEGOTIATION": {
    gradient: "from-yellow-500 to-amber-400",
    icon: (
      <svg viewBox="0 0 48 48" fill="none" className="h-14 w-14 opacity-90" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="24" cy="24" r="16" />
        <path d="M24 12v2M24 34v2M18 16.5l1 1.7M29 29.8l1 1.7M12 24h2M34 24h2M18 31.5l1-1.7M29 18.2l1-1.7" />
        <text x="24" y="28" textAnchor="middle" fontSize="12" fill="white" stroke="none" fontWeight="bold">$</text>
      </svg>
    ),
  },
  "BUILD A 30-DAY INTERVIEW PREP PLAN": {
    gradient: "from-teal-600 to-emerald-500",
    icon: (
      <svg viewBox="0 0 48 48" fill="none" className="h-14 w-14 opacity-90" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="8" y="10" width="32" height="32" rx="3" />
        <line x1="8" y1="18" x2="40" y2="18" />
        <line x1="16" y1="8" x2="16" y2="14" />
        <line x1="32" y1="8" x2="32" y2="14" />
        <line x1="14" y1="25" x2="22" y2="25" />
        <line x1="14" y1="31" x2="22" y2="31" />
        <line x1="14" y1="37" x2="22" y2="37" />
        <polyline points="27,28 30,31 36,25" />
      </svg>
    ),
  },
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
