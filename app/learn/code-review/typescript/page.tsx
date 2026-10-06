import { CodeReviewChallenges } from "@/components/learn/CodeReviewChallenges";
import { TYPESCRIPT_CODE_REVIEW_CHALLENGES } from "@/lib/code-review/typescript-challenges";

export const metadata = {
  title: "TypeScript Code Review Challenge",
};

export default function TypeScriptCodeReviewPage() {
  return <CodeReviewChallenges challenges={TYPESCRIPT_CODE_REVIEW_CHALLENGES} language="TypeScript" />;
}
