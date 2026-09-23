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

interface LibraryBookReaderProps {
  title: string;
  pdfUrl: string;
}

export function LibraryBookReader({ title, pdfUrl }: LibraryBookReaderProps) {
  return <BookReader title={title} pdfUrl={pdfUrl} />;
}

export function FinanceBookReader() {
  return <LibraryBookReader title="Rich Dad Poor Dad" pdfUrl="/api/library/finance-book" />;
}
