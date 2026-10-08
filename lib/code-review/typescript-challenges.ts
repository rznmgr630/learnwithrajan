import { CODE_REVIEW_CHALLENGES, type CodeReviewChallenge } from "@/lib/code-review/challenges";

const TYPE_CONTEXT = `type ReviewMetadata = {
  requestId: string;
  actorId: string;
};

const reviewMetadata: ReviewMetadata = {
  requestId: "req_1",
  actorId: "u1",
};

void reviewMetadata;
`;

function asTypeScriptChallenge(challenge: CodeReviewChallenge): CodeReviewChallenge {
  return {
    ...challenge,
    id: challenge.id + 1000,
    code: `${TYPE_CONTEXT}\n${challenge.code}`,
    fixedCode: `${TYPE_CONTEXT}\n${challenge.fixedCode}`,
  };
}

export const TYPESCRIPT_CODE_REVIEW_CHALLENGES = CODE_REVIEW_CHALLENGES.map(asTypeScriptChallenge);
