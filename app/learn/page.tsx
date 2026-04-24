import { LearningHubCards } from "@/components/learn/LearningHubCards";

export default function LearnPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 sm:py-16">
      <div className="max-w-2xl">
        <h1 className="text-3xl font-semibold tracking-tight text-neutral-100 sm:text-4xl">
          My learning
        </h1>
        <p className="mt-3 text-neutral-400">
          Pick a track to open the full syllabus. More cards will show up here as new topics go live.
        </p>
      </div>
      <div className="mt-10">
        <LearningHubCards />
      </div>
    </div>
  );
}
