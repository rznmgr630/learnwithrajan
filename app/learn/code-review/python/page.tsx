import { CodeReviewChallenges } from "@/components/learn/CodeReviewChallenges";
import { PYTHON_CODE_REVIEW_CHALLENGES } from "@/lib/code-review/python-challenges";

export const metadata = {
  title: "Python Code Review Challenge",
};

export default function PythonCodeReviewPage() {
  return <CodeReviewChallenges challenges={PYTHON_CODE_REVIEW_CHALLENGES} language="Python" />;
}
