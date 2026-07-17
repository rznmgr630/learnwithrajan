import { LearnBackNav } from "@/components/learn/LearnBackNav";
import { QAFlashcards } from "@/components/learn/QAFlashcards";
import { LOKSEWA_PRODUCTS_QA } from "@/lib/loksewa-learning/products-qa-data";

export const metadata = { title: "Loksewa · Products Q&A" };

export default function LoksewaProductsPage() {
  return (
    <div>
      <div className="border-b border-[var(--border)] bg-[color-mix(in_oklab,var(--surface)_85%,transparent)]">
        <div className="mx-auto flex max-w-5xl items-center gap-4 px-4 py-4 sm:px-6">
          <LearnBackNav href="/learn/loksewa" labelKey="learn.backLoksewa" />
        </div>
      </div>
      <QAFlashcards
        title="Places Famous for Various Products in Nepal"
        subtitle="General knowledge Q&A for Loksewa prep — click a question to reveal its answer."
        items={LOKSEWA_PRODUCTS_QA}
      />
    </div>
  );
}
