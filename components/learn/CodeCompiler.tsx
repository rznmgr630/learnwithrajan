"use client";

import { useEffect, useRef, useState } from "react";

type Language = "javascript" | "typescript";
type OutputLine = { type: "log" | "error" | "info"; text: string };

const STARTER_CODE: Record<Language, string> = {
  javascript: `const greeting = "Hello from JavaScript!";\nconsole.log(greeting);\n\nconst numbers = [1, 2, 3, 4, 5];\nconst doubled = numbers.map((number) => number * 2);\nconsole.log(doubled);`,
  typescript: `type User = {\n  name: string;\n  learning: string;\n};\n\nconst user: User = { name: "Rajan", learning: "TypeScript" };\nconsole.log(\`\${user.name} is learning \${user.learning}!\`);`,
};

const RUNNER_DOCUMENT = `<!doctype html><html><body><script>
const format = (value) => {
  if (typeof value === "string") return value;
  try { return JSON.stringify(value, null, 2); } catch { return String(value); }
};
const send = (type, values) => parent.postMessage({ source: "learnwithrajan-compiler", type, text: values.map(format).join(" ") }, "*");
["log", "info", "warn", "error"].forEach((type) => { console[type] = (...values) => send(type === "warn" ? "info" : type, values); });
window.addEventListener("error", (event) => send("error", [event.message]));
window.addEventListener("unhandledrejection", (event) => send("error", [event.reason?.message || String(event.reason)]));
window.addEventListener("message", (event) => {
  if (event.data?.source !== "learnwithrajan-compiler") return;
  try { new Function(event.data.code)(); parent.postMessage({ source: "learnwithrajan-compiler", type: "done" }, "*"); } catch (error) { send("error", [error?.message || String(error)]); parent.postMessage({ source: "learnwithrajan-compiler", type: "done" }, "*"); }
});
</script></body></html>`;

export function CodeCompiler() {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [language, setLanguage] = useState<Language>("javascript");
  const [code, setCode] = useState(STARTER_CODE.javascript);
  const [output, setOutput] = useState<OutputLine[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [runnerKey, setRunnerKey] = useState(0);

  useEffect(() => {
    const receiveOutput = (event: MessageEvent) => {
      if (event.data?.source !== "learnwithrajan-compiler") return;
      if (event.data.type === "done") {
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        setIsRunning(false);
        return;
      }
      setOutput((current) => [...current, { type: event.data.type, text: event.data.text }]);
    };

    window.addEventListener("message", receiveOutput);
    return () => {
      window.removeEventListener("message", receiveOutput);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const updateLanguage = (nextLanguage: Language) => {
    setLanguage(nextLanguage);
    setCode(STARTER_CODE[nextLanguage]);
    setOutput([]);
  };

  const runCode = async () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setOutput([]);
    setIsRunning(true);
    let runnableCode = code;

    try {
      if (language === "typescript") {
        const typescript = await import("typescript");
        runnableCode = typescript.transpileModule(code, {
          compilerOptions: {
            target: typescript.ScriptTarget.ES2020,
            module: typescript.ModuleKind.None,
          },
        }).outputText;
      }

      iframeRef.current?.contentWindow?.postMessage(
        { source: "learnwithrajan-compiler", code: runnableCode },
        "*",
      );
      timeoutRef.current = setTimeout(() => {
        setOutput((current) => [...current, { type: "error", text: "Stopped after 3 seconds." }]);
        setRunnerKey((current) => current + 1);
        setIsRunning(false);
      }, 3000);
    } catch (error) {
      setOutput([{ type: "error", text: error instanceof Error ? error.message : String(error) }]);
      setIsRunning(false);
    }
  };

  const resetCode = () => {
    setCode(STARTER_CODE[language]);
    setOutput([]);
    setRunnerKey((current) => current + 1);
  };

  return (
    <main className="mx-auto max-w-6xl px-4 pb-20 pt-8 sm:px-6">
      <div className="mb-8">
        <p className="text-sm font-medium text-[var(--accent)]">Browser compiler</p>
        <h1 className="mt-1 text-3xl font-semibold tracking-tight text-[var(--text)]">Write, run, and learn.</h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-[var(--muted)]">
          Run JavaScript or TypeScript directly in your browser. Your code is not sent to a server.
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <section className="overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface)] shadow-xl shadow-black/10">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[var(--border)] px-4 py-3">
            <label className="text-sm font-medium text-[var(--text)]">
              Language
              <select
                value={language}
                onChange={(event) => updateLanguage(event.target.value as Language)}
                className="ml-2 rounded-lg border border-[var(--border)] bg-[var(--elevated)] px-2 py-1 text-sm text-[var(--text)] outline-none focus:border-[var(--accent)]"
              >
                <option value="javascript">JavaScript</option>
                <option value="typescript">TypeScript</option>
              </select>
            </label>
            <div className="flex gap-2">
              <button onClick={resetCode} className="rounded-lg px-3 py-1.5 text-sm font-medium text-[var(--muted)] hover:bg-[var(--elevated)]">
                Reset
              </button>
              <button
                onClick={runCode}
                disabled={isRunning}
                className="rounded-lg bg-[var(--accent)] px-3 py-1.5 text-sm font-semibold text-[var(--accent-fg)] transition hover:brightness-110 disabled:opacity-60"
              >
                {isRunning ? "Running..." : "Run code"}
              </button>
            </div>
          </div>
          <textarea
            aria-label="Code editor"
            spellCheck={false}
            value={code}
            onChange={(event) => setCode(event.target.value)}
            className="min-h-[430px] w-full resize-y bg-[#0b0e14] p-4 font-mono text-sm leading-6 text-slate-100 outline-none"
          />
        </section>

        <section className="overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface)] shadow-xl shadow-black/10">
          <div className="border-b border-[var(--border)] px-4 py-3 text-sm font-medium text-[var(--text)]">Console output</div>
          <div className="min-h-[430px] bg-[#0b0e14] p-4 font-mono text-sm leading-6">
            {output.length === 0 ? (
              <p className="text-slate-500">Click “Run code” to see your output here.</p>
            ) : (
              output.map((line, index) => (
                <pre key={`${line.text}-${index}`} className={line.type === "error" ? "whitespace-pre-wrap text-rose-400" : "whitespace-pre-wrap text-slate-100"}>
                  {line.text}
                </pre>
              ))
            )}
          </div>
        </section>
      </div>
      <p className="mt-4 text-xs leading-5 text-[var(--faint)]">Runs in an isolated browser frame. npm packages, files, and server-side APIs are not available.</p>
      <iframe key={runnerKey} ref={iframeRef} title="Code runner" sandbox="allow-scripts" srcDoc={RUNNER_DOCUMENT} className="hidden" />
    </main>
  );
}
