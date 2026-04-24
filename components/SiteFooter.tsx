export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-[var(--border)] py-10">
      <div className="mx-auto flex max-w-5xl flex-col gap-2 px-4 text-sm text-[var(--muted)] sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <p>Built with Next.js and Tailwind — pure frontend, no API routes.</p>
        <p className="font-mono text-xs text-[var(--faint)]">learnwithrajan</p>
      </div>
    </footer>
  );
}
