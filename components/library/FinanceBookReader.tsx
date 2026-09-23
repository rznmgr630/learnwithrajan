"use client";

import dynamic from "next/dynamic";
import { BookLoader } from "@/components/library/BookLoader";

const BookReader = dynamic(
  () => import("@/components/library/BookReader").then((module) => module.BookReader),
  {
    loading: () => <main className="grid min-h-96 place-items-center"><BookLoader /></main>,
    ssr: false,
  },
);

export function FinanceBookReader() {
  return <BookReader title="Rich Dad Poor Dad" pdfUrl="/api/library/finance-book" />;
}
