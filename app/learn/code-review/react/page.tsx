import { CodeReviewChallenges } from "@/components/learn/CodeReviewChallenges";
import { REACT_CODE_REVIEW_CHALLENGES } from "@/lib/code-review/react-challenges";

export const metadata = {
  title: "React Code Review Challenge",
};

export default function ReactCodeReviewPage() {
  return <CodeReviewChallenges challenges={REACT_CODE_REVIEW_CHALLENGES} language="React" />;
}
