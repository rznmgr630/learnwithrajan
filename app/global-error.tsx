"use client";

export default function GlobalError({ reset }: Readonly<{ reset: () => void }>) {
  return (
    <html lang="en">
      <body style={{ margin: 0, background: "#07080c", color: "#e8eaef", fontFamily: "system-ui, sans-serif" }}>
        <main style={{ display: "grid", minHeight: "100vh", placeItems: "center", padding: "24px" }}>
          <section style={{ maxWidth: "440px", padding: "32px", border: "1px solid #2b3040", borderRadius: "24px", textAlign: "center", background: "#0f1118" }}>
            <p style={{ color: "#38bdf8", fontWeight: 600 }}>Something went wrong</p>
            <h1 style={{ margin: "12px 0", fontSize: "24px" }}>The app could not load.</h1>
            <p style={{ color: "#9aa3b5", lineHeight: 1.6 }}>Try again. If the problem continues, return later.</p>
            <button type="button" onClick={reset} style={{ marginTop: "20px", border: 0, borderRadius: "12px", padding: "12px 16px", background: "#38bdf8", color: "#041018", fontWeight: 600, cursor: "pointer" }}>
              Try again
            </button>
          </section>
        </main>
      </body>
    </html>
  );
}
