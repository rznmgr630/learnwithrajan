"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/Page/TextLayer.css";
import { BookLoader } from "@/components/library/BookLoader";

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url,
).toString();

interface BookReaderProps {
  title: string;
  pdfUrl: string;
}

interface WordMeaning {
  definition: string | null;
  translation: string | null;
}

export function BookReader({ title, pdfUrl }: BookReaderProps) {
  const pageStorageKey = `library:book-page:${pdfUrl}`;
  const [pageCount, setPageCount] = useState<number>();
  const [pageNumber, setPageNumber] = useState(() => {
    if (typeof window === "undefined") {
      return 1;
    }

    const savedPage = Number(window.localStorage.getItem(pageStorageKey));
    return Number.isInteger(savedPage) && savedPage > 0 ? savedPage : 1;
  });
  const [pageHeight, setPageHeight] = useState(520);
  const [zoom, setZoom] = useState(1);
  const [failed, setFailed] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [selectedWord, setSelectedWord] = useState<string>();
  const [meaning, setMeaning] = useState<WordMeaning>();
  const [meaningError, setMeaningError] = useState<string>();
  const [meaningPosition, setMeaningPosition] = useState({ left: 16, top: 16 });
  const readerRef = useRef<HTMLElement>(null);
  const touchStartRef = useRef<{ x: number; y: number } | undefined>(undefined);
  const secondPage = pageNumber < (pageCount ?? 0) ? pageNumber + 1 : undefined;
  const renderedPageHeight = Math.round(pageHeight * zoom);

  useEffect(() => {
    const updatePageHeight = () => setPageHeight(Math.max(240, window.innerHeight - 190));

    updatePageHeight();
    window.addEventListener("resize", updatePageHeight);
    return () => window.removeEventListener("resize", updatePageHeight);
  }, []);

  useEffect(() => {
    window.localStorage.setItem(pageStorageKey, String(pageNumber));
  }, [pageNumber, pageStorageKey]);

  useEffect(() => {
    const onFullscreenChange = () => setIsFullscreen(document.fullscreenElement === readerRef.current);
    const onKeyDown = (event: KeyboardEvent) => {
      if (!pageCount || event.target instanceof Element && event.target.closest("a, button, input, textarea, select")) {
        return;
      }

      if (event.key === "ArrowLeft") {
        event.preventDefault();
        setPageNumber((page) => Math.max(1, page - 1));
      }
      if (event.key === "ArrowRight") {
        event.preventDefault();
        setPageNumber((page) => Math.min(pageCount, page + 1));
      }
    };

    document.addEventListener("fullscreenchange", onFullscreenChange);
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("fullscreenchange", onFullscreenChange);
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [pageCount]);

  useEffect(() => {
    if (!selectedWord) {
      return;
    }

    const controller = new AbortController();
    setMeaning(undefined);
    setMeaningError(undefined);

    fetch(`/api/word-meaning?word=${encodeURIComponent(selectedWord)}`, { signal: controller.signal })
      .then(async (response) => {
        const data = await response.json() as WordMeaning & { error?: string };
        if (!response.ok) {
          throw new Error(data.error ?? "Meaning is unavailable right now.");
        }
        setMeaning(data);
      })
      .catch((error: unknown) => {
        if (error instanceof DOMException && error.name === "AbortError") {
          return;
        }
        setMeaningError(error instanceof Error ? error.message : "Meaning is unavailable right now.");
      });

    return () => controller.abort();
  }, [selectedWord]);

  async function toggleFullscreen() {
    if (document.fullscreenElement) {
      await document.exitFullscreen();
      return;
    }

    await readerRef.current?.requestFullscreen();
  }

  function showSelectedWordMeaning() {
    const selection = window.getSelection();
    const word = selection?.toString().trim().toLowerCase() ?? "";

    if (!/^[a-z]+(?:['-][a-z]+)?$/.test(word) || !selection?.rangeCount) {
      return;
    }

    const rect = selection.getRangeAt(0).getBoundingClientRect();
    setMeaningPosition({
      left: Math.max(16, Math.min(window.innerWidth - 296, rect.left)),
      top: Math.max(16, Math.min(window.innerHeight - 180, rect.bottom + 12)),
    });
    setSelectedWord(word);
  }

  function handleTouchStart(event: React.TouchEvent<HTMLDivElement>) {
    const touch = event.touches[0];
    touchStartRef.current = { x: touch.clientX, y: touch.clientY };
  }

  function handleTouchEnd(event: React.TouchEvent<HTMLDivElement>) {
    const start = touchStartRef.current;
    const touch = event.changedTouches[0];
    touchStartRef.current = undefined;

    if (!start || !touch || !pageCount) {
      return;
    }

    const horizontalDistance = touch.clientX - start.x;
    const verticalDistance = touch.clientY - start.y;
    if (Math.abs(horizontalDistance) < 72 || Math.abs(horizontalDistance) <= Math.abs(verticalDistance)) {
      return;
    }

    setPageNumber((page) => horizontalDistance < 0 ? Math.min(pageCount, page + 1) : Math.max(1, page - 1));
  }

  return (
    <main ref={readerRef} className="fixed inset-0 z-30 flex min-h-0 flex-col overflow-hidden bg-[var(--background)] px-4 py-5 sm:px-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <Link href="/library" className="text-sm font-medium text-[var(--accent)] transition hover:brightness-110">← Library</Link>
          <h1 className="mt-2 text-2xl font-semibold tracking-tight text-[var(--text)]">{title}</h1>
        </div>
        <div className="flex items-center gap-3">
          {pageCount && <p className="text-sm text-[var(--muted)]">Page {pageNumber} of {pageCount}</p>}
          <div className="flex items-center overflow-hidden rounded-lg border border-[var(--border)] text-sm font-medium text-[var(--text)]">
            <button type="button" onClick={() => setZoom((value) => Math.max(0.8, Number((value - 0.1).toFixed(1))))} disabled={zoom === 0.8} className="px-3 py-2 transition hover:bg-[var(--elevated)] disabled:cursor-not-allowed disabled:opacity-40" aria-label="Decrease text size">A−</button>
            <span className="border-x border-[var(--border)] px-3 py-2 text-[var(--muted)]">{Math.round(zoom * 100)}%</span>
            <button type="button" onClick={() => setZoom((value) => Math.min(1.5, Number((value + 0.1).toFixed(1))))} disabled={zoom === 1.5} className="px-3 py-2 transition hover:bg-[var(--elevated)] disabled:cursor-not-allowed disabled:opacity-40" aria-label="Increase text size">A+</button>
          </div>
          <button type="button" onClick={toggleFullscreen} className="rounded-lg border border-[var(--border)] px-3 py-2 text-sm font-medium text-[var(--text)] transition hover:bg-[var(--elevated)]">
            {isFullscreen ? "Exit full screen" : "Full screen"}
          </button>
        </div>
      </div>

      <div onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd} className={`mt-5 flex min-h-0 flex-1 justify-center overflow-auto rounded-2xl border border-[var(--border)] bg-[var(--elevated)] p-3 shadow-sm sm:p-6 ${zoom > 1 ? "items-start" : "items-center"}`}>
        {failed ? (
          <div className="grid min-h-80 place-items-center text-center text-sm text-[var(--muted)]">
            <p>Unable to load this book. Check that the Drive file is still shared for anyone with the link.</p>
          </div>
        ) : (
          <Document
            file={pdfUrl}
            loading={<div className="grid min-h-80 place-items-center"><BookLoader /></div>}
            onLoadSuccess={({ numPages }) => {
              setPageCount(numPages);
              setPageNumber((page) => Math.min(page, numPages));
            }}
            onLoadError={() => setFailed(true)}
            className="flex justify-center"
          >
            <div onMouseUp={showSelectedWordMeaning} className="flex max-h-full items-center justify-center gap-px bg-[color-mix(in_oklab,var(--border)_75%,transparent)] shadow-xl">
              <Page pageNumber={pageNumber} height={renderedPageHeight} renderTextLayer renderAnnotationLayer={false} />
              {secondPage && <Page pageNumber={secondPage} height={renderedPageHeight} renderTextLayer renderAnnotationLayer={false} className="hidden xl:block" />}
            </div>
          </Document>
        )}
      </div>

      {!failed && pageCount && (
        <nav className="mt-5 flex items-center justify-between" aria-label="Book pages">
          <button type="button" onClick={() => setPageNumber((page) => Math.max(1, page - 1))} disabled={pageNumber === 1} className="rounded-lg border border-[var(--border)] px-4 py-2 text-sm font-medium text-[var(--text)] disabled:cursor-not-allowed disabled:opacity-40">Previous</button>
          <button type="button" onClick={() => setPageNumber((page) => Math.min(pageCount, page + 1))} disabled={pageNumber === pageCount} className="rounded-lg bg-[var(--accent)] px-4 py-2 text-sm font-medium text-[var(--accent-fg)] disabled:cursor-not-allowed disabled:opacity-40">Next</button>
        </nav>
      )}

      {selectedWord && (
        <aside style={meaningPosition} className="fixed z-40 w-72 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4 shadow-2xl" aria-live="polite">
          <div className="flex items-start justify-between gap-3">
            <p className="text-base font-semibold text-[var(--text)]">{selectedWord}</p>
            <button type="button" onClick={() => setSelectedWord(undefined)} className="text-lg leading-none text-[var(--muted)] hover:text-[var(--text)]" aria-label="Close meaning">×</button>
          </div>
          {!meaning && !meaningError && <p className="mt-3 text-sm text-[var(--muted)]">Looking up meaning…</p>}
          {meaning?.definition && <p className="mt-3 text-sm leading-6 text-[var(--text)]">{meaning.definition}</p>}
          {meaning?.translation && <p className="mt-3 border-t border-[var(--border)] pt-3 text-sm text-[var(--muted)]"><span className="font-medium text-[var(--text)]">नेपाली: </span>{meaning.translation}</p>}
          {meaningError && <p className="mt-3 text-sm text-rose-500">{meaningError}</p>}
        </aside>
      )}
    </main>
  );
}
