export function BrandMark({ className }: { className?: string }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 5.5h5A3 3 0 0 1 12 8.5v11A3 3 0 0 0 9 16.5H4zM20 5.5h-5a3 3 0 0 0-3 3v11a3 3 0 0 1 3-3h5z" />
      <path d="M12 15V9.5m0 0-2 2m2-2 2 2M17.5 3.5v2m-1 1h2" />
    </svg>
  );
}
