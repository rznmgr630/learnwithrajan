import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    "public/pdfjs/**",
  ]),
  {
    files: ["components/learn/**/*.tsx"],
    rules: {
      "react/no-unescaped-entities": "off",
    },
  },
  {
    files: [
      "components/SiteHeader.tsx",
      "components/ThemeProvider.tsx",
      "components/learn/CodeReviewChallenges.tsx",
      "components/learn/CourseSidebar.tsx",
      "components/learn/DevopsRoadmap.tsx",
      "components/learn/JapaneseRoadmap.tsx",
      "components/learn/LaravelRoadmap.tsx",
      "components/learn/NestjsRoadmap.tsx",
      "components/learn/NextjsRoadmap.tsx",
      "components/learn/NodejsRoadmap.tsx",
      "components/learn/ReactRoadmap.tsx",
      "components/learn/SystemDesign.tsx",
      "components/library/BookReader.tsx",
      "components/library/LibraryShelf.tsx",
    ],
    rules: {
      "react-hooks/set-state-in-effect": "off",
    },
  },
  {
    files: [
      "components/learn/JapaneseDetailBlockRenderer.tsx",
      "components/learn/N5LessonDrawerContent.tsx",
    ],
    rules: {
      "react-hooks/purity": "off",
    },
  },
  {
    files: [
      "components/learn/PythonRoadmap.tsx",
      "lib/code-review/challenges.ts",
    ],
    rules: {
      "@typescript-eslint/no-unused-vars": "off",
    },
  },
  {
    files: [
      "lib/devops-learning/devops-day-details-stub.ts",
      "lib/learn/pasted-lesson-day.ts",
    ],
    rules: {
      "@typescript-eslint/no-unused-vars": ["warn", { argsIgnorePattern: "^_" }],
    },
  },
]);

export default eslintConfig;
