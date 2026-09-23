export function BookLoader() {
  return (
    <div className="flex flex-col items-center gap-4 text-sm text-[var(--muted)]">
      <div className="book-loader" aria-hidden="true">
        <span className="book-loader__cover" />
        <span className="book-loader__page book-loader__page--one" />
        <span className="book-loader__page book-loader__page--two" />
        <span className="book-loader__page book-loader__page--three" />
      </div>
      <span>Loading your book…</span>
    </div>
  );
}
