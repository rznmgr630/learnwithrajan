"use client";
import { useEffect, useState } from "react";
type Detail = { title: string; overview: string; features: string[]; structure: string[]; checklist: string[] };
function values(source: string, field: string) { const match = source.match(new RegExp(`${field}:\\s*\\[([\\s\\S]*?)\\]`, "m")); return match ? [...match[1].matchAll(/"([\s\S]*?)"/g)].map((item) => item[1]) : []; }
function parse(source: string): Detail { const text = (field: string) => source.match(new RegExp(`${field}:\\s*"([\\s\\S]*?)"`, "m"))?.[1] ?? ""; return { title: text("title"), overview: text("overview"), features: values(source, "features"), structure: values(source, "suggestedFileStructure"), checklist: values(source, "checkList") }; }
export function PythonProjectSource({ project, onClose }: { project: 1 | 2; onClose: () => void }) {
  const [detail, setDetail] = useState<Detail | null>(null);
  useEffect(() => { fetch(`/python-lessons/project-${project}.ts.txt`).then((r) => r.text()).then((source) => setDetail(parse(source))); }, [project]);
  if (!detail) return null;
  return <div className="fixed inset-0 z-50 flex justify-end"><button className="absolute inset-0 bg-black/60" onClick={onClose} aria-label="Close project" /><aside className="relative h-full w-full max-w-2xl overflow-y-auto bg-[var(--background)] p-6"><button onClick={onClose} className="float-right">Close</button><h2 className="text-xl font-semibold">{detail.title}</h2><p className="mt-5 text-[var(--muted)]">{detail.overview}</p><h3 className="mt-7 font-semibold">Features</h3><ul>{detail.features.map((item) => <li key={item}>• {item}</li>)}</ul><h3 className="mt-7 font-semibold">Suggested file structure</h3><pre className="rounded-lg bg-zinc-950 p-4 text-zinc-100">{detail.structure.join("\n")}</pre><h3 className="mt-7 font-semibold">Checklist</h3><ul>{detail.checklist.map((item) => <li key={item}>• {item}</li>)}</ul></aside></div>;
}
