import { CodeReviewChallenges } from "@/components/learn/CodeReviewChallenges";
import { LARAVEL_CODE_REVIEW_CHALLENGES } from "@/lib/code-review/laravel-challenges";

export const metadata = {
  title: "Laravel Code Review Challenge",
};

export default function LaravelCodeReviewPage() {
  return <CodeReviewChallenges challenges={LARAVEL_CODE_REVIEW_CHALLENGES} language="Laravel" />;
}
