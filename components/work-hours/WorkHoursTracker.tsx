"use client";

import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
} from "firebase/firestore";
import { type FormEvent, useEffect, useMemo, useRef, useState } from "react";
import { SiteHeader } from "@/components/SiteHeader";
import { useAuth } from "@/context/AuthContext";
import { db } from "@/lib/firebase";

type Job = { id: string; name: string };
type Workday = { id: string; date: string; hours: number; minutes: number; jobId: string; jobName: string };
const JOB_PILL_COLORS = [
  "bg-blue-500 text-white dark:bg-blue-500 dark:text-white",
  "bg-emerald-500 text-white dark:bg-emerald-500 dark:text-white",
  "bg-violet-500 text-white dark:bg-violet-500 dark:text-white",
  "bg-amber-500 text-slate-950 dark:bg-amber-400 dark:text-slate-950",
  "bg-rose-500 text-white dark:bg-rose-500 dark:text-white",
  "bg-cyan-500 text-white dark:bg-cyan-500 dark:text-white",
];
function EditIcon() {
  return <svg aria-hidden="true" viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="m15 5 4 4M4 20l4.2-.8L19 8.4a2.1 2.1 0 0 0-3-3L5.2 16.2 4 20Z" /></svg>;
}
function DeleteIcon() {
  return <svg aria-hidden="true" viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M4 7h16M10 11v6m4-6v6M6 7l1 13h10l1-13M9 7V4h6v3" /></svg>;
}

const localDate = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};
const localMonth = (date: Date) => localDate(date).slice(0, 7);
const monthDateBounds = (month: string) => {
  if (!/^\d{4}-\d{2}$/.test(month)) return { min: undefined, max: undefined };
  const [year, monthNumber] = month.split("-").map(Number);
  const lastDay = new Date(year, monthNumber, 0).getDate();
  return {
    min: `${month}-01`,
    max: `${month}-${String(lastDay).padStart(2, "0")}`,
  };
};
const formatDate = (value: string, options: Intl.DateTimeFormatOptions) => {
  const [year, month, day] = value.split("-").map(Number);
  return new Intl.DateTimeFormat(undefined, options).format(
    new Date(year, month - 1, day),
  );
};
const formatMinutes = (minutes: number) => `${Math.floor(minutes / 60)} h${minutes % 60 ? ` ${minutes % 60} min` : ""}`;

export function WorkHoursTracker() {
  const { user, isAdmin, isLoading } = useAuth();
  const [workdays, setWorkdays] = useState<Workday[]>([]);
  const [jobs, setJobs] = useState<Job[]>([{ id: "job-1", name: "Job 1" }]);
  const [selectedJobId, setSelectedJobId] = useState("job-1");
  const [newJobName, setNewJobName] = useState("");
  const [editingJobId, setEditingJobId] = useState<string | null>(null);
  const [editingJobName, setEditingJobName] = useState("");
  const [workdayToDelete, setWorkdayToDelete] = useState<Workday | null>(null);
  const [jobToDelete, setJobToDelete] = useState<Job | null>(null);
  const [selectedDate, setSelectedDate] = useState(localDate(new Date()));
  const [editingWorkdayId, setEditingWorkdayId] = useState<string | null>(null);
  const [hours, setHours] = useState<string | null>(null);
  const [minutes, setMinutes] = useState<string | null>(null);
  const [month, setMonth] = useState(localMonth(new Date()));
  const [isLoadingEntries, setIsLoadingEntries] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");
  const [toast, setToast] = useState("");
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (!toast) return;
    const timeout = window.setTimeout(() => setToast(""), 3200);
    return () => window.clearTimeout(timeout);
  }, [toast]);

  useEffect(() => {
    if (!db || !user || !isAdmin) return;
    const entries = collection(db, "users", user.uid, "workHours");
    const jobEntries = collection(db, "users", user.uid, "workJobs");
    const unsubscribeJobs = onSnapshot(query(jobEntries, orderBy("createdAt", "asc")), (snapshot) => {
      const savedJobs = snapshot.docs.map((item) => ({ id: item.id, name: String(item.data().name ?? "").trim() })).filter((job) => job.name);
      setJobs(savedJobs.length ? savedJobs : [{ id: "job-1", name: "Job 1" }]);
    });
    const unsubscribeWorkdays = onSnapshot(
      query(entries, orderBy("date", "desc")),
      (snapshot) => {
        setWorkdays(
          snapshot.docs.flatMap((item) => {
            const date = String(item.data().date ?? item.id);
            const jobId = String(item.data().jobId ?? "job-1");
            const jobName = String(item.data().jobName ?? "Job 1").trim() || "Job 1";
            const value = Number(item.data().hours);
            const storedMinutes = Number(item.data().minutes);
            if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || !Number.isFinite(value) || value <= 0) return [];
            if (Number.isInteger(storedMinutes) && storedMinutes >= 0 && storedMinutes <= 59)
              return [{ id: item.id, date, hours: value, minutes: storedMinutes, jobId, jobName }];
            const totalMinutes = Math.round(value * 60);
            return [{ id: item.id, date, hours: Math.floor(totalMinutes / 60), minutes: totalMinutes % 60, jobId, jobName }];
          }),
        );
        setIsLoadingEntries(false);
        setError("");
      },
      () => {
        setError("We could not load your work hours. Check your Firestore rules.");
        setIsLoadingEntries(false);
      },
    );
    return () => { unsubscribeJobs(); unsubscribeWorkdays(); };
  }, [isAdmin, user]);

  const monthWorkdays = useMemo(
    () => workdays.filter((workday) => workday.date.startsWith(month)),
    [month, workdays],
  );
  const sortedMonthWorkdays = useMemo(
    () => [...monthWorkdays].sort((a, b) => b.date.localeCompare(a.date)),
    [monthWorkdays],
  );
  const totalMinutes = monthWorkdays.reduce((total, workday) => total + workday.hours * 60 + workday.minutes, 0);
  const monthlyJobTotals = jobs.map((job) => ({
    ...job,
    workdays: monthWorkdays.filter((workday) => workday.jobId === job.id),
  })).map((job) => ({
    ...job,
    days: job.workdays.length,
    minutes: job.workdays.reduce((sum, workday) => sum + workday.hours * 60 + workday.minutes, 0),
  })).filter((job) => job.minutes > 0);
  const totalHoursLabel = formatMinutes(totalMinutes);
  const selectedWorkday = workdays.find((workday) => workday.date === selectedDate && workday.jobId === selectedJobId);
  const jobNameFor = (workday: Workday) => jobs.find((job) => job.id === workday.jobId)?.name ?? workday.jobName;
  const jobColorFor = (jobId: string) => {
    if (jobId === "job-1") return JOB_PILL_COLORS[0];
    const otherJobs = jobs.filter((job) => job.id !== "job-1");
    const jobIndex = otherJobs.findIndex((job) => job.id === jobId);
    return JOB_PILL_COLORS[(jobIndex + 1) % JOB_PILL_COLORS.length] ?? JOB_PILL_COLORS[1];
  };
  const selectedHours = hours ?? String(Math.min(12, Math.max(1, selectedWorkday?.hours ?? 1)));
  const selectedMinutes = minutes ?? String(selectedWorkday?.minutes ?? 0);
  const dateBounds = monthDateBounds(month);

  async function saveWorkday(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const job = jobs.find((item) => item.id === selectedJobId);
    const jobName = job?.name.trim() ?? "";
    const existing = editingWorkdayId
      ? workdays.find((workday) => workday.id === editingWorkdayId)
      : workdays.find((workday) => workday.date === selectedDate && workday.jobId === selectedJobId);
    const conflictingEntry = workdays.find((workday) => workday.id !== existing?.id && workday.date === selectedDate && workday.jobId === selectedJobId);
    const isUpdating = Boolean(existing);
    const hourValue = Number(selectedHours);
    const minuteValue = Number(selectedMinutes);
    if (!db || !user || !isAdmin) return;
    if (!selectedDate || selectedDate.slice(0, 7) !== month) {
      setError("Choose a date within the selected month.");
      return;
    }
    if (!job || !jobName) {
      setError("Choose a job before saving work hours.");
      return;
    }
    if (conflictingEntry) {
      setError(`There is already a workday for ${jobName} on this date. Edit or delete that entry first.`);
      return;
    }
    if (!Number.isInteger(hourValue) || hourValue < 1 || hourValue > 12 || !Number.isInteger(minuteValue) || minuteValue < 0 || minuteValue > 59) {
      setError("Choose hours from 1 to 12 and minutes from 0 to 59.");
      return;
    }
    setIsSaving(true);
    setError("");
    try {
      const entryId = existing?.id ?? `${selectedDate}__${selectedJobId}`;
      await setDoc(doc(db, "users", user.uid, "workHours", entryId), {
        date: selectedDate,
        jobId: selectedJobId,
        jobName,
        hours: hourValue,
        minutes: minuteValue,
        updatedAt: serverTimestamp(),
      });
      setMonth(selectedDate.slice(0, 7));
      setSelectedDate("");
      setEditingWorkdayId(null);
      setHours(null);
      setMinutes(null);
      setToast(isUpdating ? "Workday updated." : "Workday added.");
    } catch {
      setError("We could not save this workday. Check your Firestore rules.");
      setToast("Could not save workday.");
    } finally {
      setIsSaving(false);
    }
  }

  async function addJob(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const name = newJobName.trim();
    if (!db || !user || !isAdmin || !name) return;
    if (jobs.some((job) => job.name.toLocaleLowerCase() === name.toLocaleLowerCase())) {
      setError("A job with that name already exists.");
      return;
    }
    const id = `job-${crypto.randomUUID()}`;
    setError("");
    try {
      const [savedJobs, savedWorkdays] = await Promise.all([
        getDocs(collection(db, "users", user.uid, "workJobs")),
        getDocs(collection(db, "users", user.uid, "workHours")),
      ]);
      const hasSavedJob1 = savedJobs.docs.some((item) => item.id === "job-1");
      const hasJob1Workdays = savedWorkdays.docs.some((item) => String(item.data().jobId ?? "job-1") === "job-1");
      if (!hasSavedJob1 && hasJob1Workdays) {
        await setDoc(doc(db, "users", user.uid, "workJobs", "job-1"), { name: "Job 1", createdAt: serverTimestamp() });
      }
      await setDoc(doc(db, "users", user.uid, "workJobs", id), { name, createdAt: serverTimestamp() });
      setSelectedJobId(id);
      setNewJobName("");
      setToast(`${name} added.`);
    } catch {
      setError("We could not add this job. Check your Firestore rules.");
    }
  }

  async function saveJobName(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const job = jobs.find((item) => item.id === editingJobId);
    const name = editingJobName.trim();
    if (!db || !user || !isAdmin || !job || !name) return;
    if (jobs.some((item) => item.id !== job.id && item.name.toLocaleLowerCase() === name.toLocaleLowerCase())) {
      setError("A job with that name already exists.");
      return;
    }
    setError("");
    try {
      await setDoc(doc(db, "users", user.uid, "workJobs", job.id), { name }, { merge: true });
      setWorkdays((current) => current.map((workday) => workday.jobId === job.id ? { ...workday, jobName: name } : workday));
      setEditingJobId(null);
      setEditingJobName("");
      setToast("Job name updated.");
    } catch {
      setError("We could not update this job. Check your Firestore rules.");
    }
  }

  async function removeJob(job: Job) {
    if (!db || !user || !isAdmin) return;
    if (jobs.length <= 1) {
      setError("Keep at least one job in your list.");
      return;
    }
    try {
      const entries = await getDocs(collection(db, "users", user.uid, "workHours"));
      const hasWorkdays = entries.docs.some((entry) => String(entry.data().jobId ?? "job-1") === job.id);
      if (hasWorkdays) {
        setError(`“${job.name}” cannot be deleted because it has logged workdays.`);
        return;
      }
      await deleteDoc(doc(db, "users", user.uid, "workJobs", job.id));
      if (selectedJobId === job.id) setSelectedJobId(jobs.find((item) => item.id !== job.id)?.id ?? "job-1");
      if (editingJobId === job.id) setEditingJobId(null);
      setJobToDelete(null);
      setError("");
      setToast(`${job.name} deleted.`);
    } catch {
      setError("We could not delete this job. Check your Firestore rules.");
    }
  }

  async function removeWorkday() {
    if (!db || !user || !isAdmin) return;
    if (!workdayToDelete) return;
    setError("");
    try {
      const workday = workdayToDelete;
      await deleteDoc(doc(db, "users", user.uid, "workHours", workday.id));
      if (workday && selectedDate === workday.date && selectedJobId === workday.jobId) {
        setSelectedDate("");
        setEditingWorkdayId(null);
        setHours(null);
        setMinutes(null);
      }
      setWorkdayToDelete(null);
      setToast("Workday deleted.");
    } catch {
      setError("We could not remove this workday. Check your Firestore rules.");
      setToast("Could not delete workday.");
    }
  }

  function editWorkday(workday: Workday) {
    setEditingWorkdayId(workday.id);
    setSelectedDate(workday.date);
    setSelectedJobId(workday.jobId);
    setHours(String(Math.min(12, Math.max(1, workday.hours))));
    setMinutes(String(workday.minutes));
    setToast(`Editing work hours for ${formatDate(workday.date, { month: "short", day: "numeric" })}.`);
    formRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
  }

  if (isLoading || (isAdmin && isLoadingEntries))
    return <><SiteHeader /><main className="mx-auto min-h-[calc(100dvh-3.5rem)] max-w-5xl px-4 py-12" /></>;

  if (!user || !isAdmin || !db)
    return <><SiteHeader /><main className="mx-auto max-w-5xl px-4 py-12 text-sm text-[var(--muted)]">This page is only available to the admin.</main></>;

  return (
    <>
      <SiteHeader />
      {toast && <div role="status" aria-live="polite" className="fixed bottom-5 right-5 z-50 max-w-[calc(100vw-2.5rem)] rounded-xl border border-[var(--border)] bg-[var(--surface)] px-4 py-3 text-sm font-medium text-[var(--text)] shadow-xl">{toast}</div>}
      {(workdayToDelete || jobToDelete) && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 p-4" onMouseDown={(event) => { if (event.target === event.currentTarget) { setWorkdayToDelete(null); setJobToDelete(null); setError(""); } }}>
          <section role="dialog" aria-modal="true" aria-labelledby="delete-workday-title" className="w-full max-w-md rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 shadow-2xl">
            <h2 id="delete-workday-title" className="text-lg font-semibold text-[var(--text)]">{workdayToDelete ? "Delete this workday?" : "Delete this job?"}</h2>
            {workdayToDelete ? (
              <>
                <p className="mt-2 text-sm leading-6 text-[var(--muted)]">This will remove the workday entry for <strong className="font-semibold text-[var(--text)]">{formatDate(workdayToDelete.date, { year: "numeric", month: "long", day: "numeric" })}</strong>.</p>
                <div className="mt-4 flex flex-wrap items-center gap-2 rounded-xl bg-[var(--elevated)] p-3 text-sm">
                  <span className={`rounded-full px-3 py-1 text-xs font-normal ${jobColorFor(workdayToDelete.jobId)}`}>{jobNameFor(workdayToDelete)}</span>
                  <span className="font-medium tabular-nums text-[var(--text)]">{workdayToDelete.hours} h{workdayToDelete.minutes ? ` ${workdayToDelete.minutes} min` : ""}</span>
                </div>
              </>
            ) : (
              <p className="mt-2 text-sm leading-6 text-[var(--muted)]">Delete <strong className="font-semibold text-[var(--text)]">{jobToDelete?.name}</strong>? This job can only be deleted when it has no workday entries.</p>
            )}
            {error && <p role="alert" className="mt-3 text-sm text-red-600">{error}</p>}
            <div className="mt-5 flex justify-end gap-2">
              <button type="button" onClick={() => { setWorkdayToDelete(null); setJobToDelete(null); setError(""); }} className="min-h-10 rounded-lg border border-[var(--border)] px-4 text-sm font-medium text-[var(--text)] hover:bg-[var(--elevated)]">Cancel</button>
              <button type="button" onClick={() => workdayToDelete ? void removeWorkday() : jobToDelete ? void removeJob(jobToDelete) : undefined} className="min-h-10 rounded-lg bg-red-600 px-4 text-sm font-semibold text-white hover:bg-red-700">{workdayToDelete ? "Delete workday" : "Delete job"}</button>
            </div>
          </section>
        </div>
      )}
      <main className="mx-auto flex w-full max-w-5xl flex-col gap-6 px-4 py-8 sm:px-6 sm:py-12">
        <header>
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[var(--accent)]">Admin tool</p>
          <h1 className="mt-1 text-3xl font-semibold text-[var(--text)]">Work hours</h1>
          <p className="mt-2 text-sm text-[var(--muted)]">Log hours for each job. Only logged workdays appear in the table.</p>
        </header>

        <section aria-labelledby="jobs-heading" className="overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface)] shadow-sm">
          <div className="flex items-center justify-between gap-3 px-5 pt-5">
            <div>
              <h2 id="jobs-heading" className="text-base font-semibold text-[var(--text)]">Your jobs</h2>
              <p className="mt-1 text-sm text-[var(--muted)]">Manage the jobs you track work for.</p>
            </div>
            <span className="rounded-full bg-[var(--elevated)] px-3 py-1 text-xs font-medium text-[var(--muted)]">{jobs.length} {jobs.length === 1 ? "job" : "jobs"}</span>
          </div>
          <form onSubmit={addJob} className="flex flex-col gap-2 px-5 py-4 sm:flex-row">
            <label className="sr-only" htmlFor="new-job-name">New job name</label>
            <input id="new-job-name" required maxLength={80} value={newJobName} onChange={(event) => setNewJobName(event.target.value)} placeholder="Enter a job name, e.g. Consulting" className="min-h-11 min-w-0 flex-1 rounded-xl border border-[var(--border)] bg-[var(--background)] px-4 text-sm text-[var(--text)] outline-none transition focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent)]/15" />
            <button type="submit" className="min-h-11 rounded-xl bg-[var(--accent)] px-5 text-sm font-semibold text-white shadow-sm transition hover:opacity-90">Add job</button>
          </form>
          <div className="border-t border-[var(--border)] px-3 pb-3">
            {jobs.map((job) => {
              const hasWorkdays = workdays.some((workday) => workday.jobId === job.id);
              const cannotDelete = hasWorkdays || jobs.length <= 1;
              return editingJobId === job.id ? (
                <form key={job.id} onSubmit={saveJobName} className="my-2 flex flex-col gap-2 rounded-xl bg-[var(--elevated)] p-3 sm:flex-row sm:items-center">
                  <label className="sr-only" htmlFor={`edit-job-${job.id}`}>Edit {job.name}</label>
                  <input id={`edit-job-${job.id}`} required maxLength={80} autoFocus value={editingJobName} onChange={(event) => setEditingJobName(event.target.value)} className="min-h-10 min-w-0 flex-1 rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 text-sm text-[var(--text)] outline-none focus:border-[var(--accent)]" />
                  <div className="flex justify-end gap-2">
                    <button type="button" onClick={() => setEditingJobId(null)} className="min-h-9 rounded-lg px-3 text-sm text-[var(--muted)] hover:bg-[var(--surface)]">Cancel</button>
                    <button type="submit" className="min-h-9 rounded-lg bg-[var(--accent)] px-4 text-sm font-semibold text-white hover:opacity-90">Save</button>
                  </div>
                </form>
              ) : (
                <div key={job.id} className="group flex items-center gap-3 border-b border-[var(--border)] px-2 py-3 last:border-b-0">
                  <span aria-hidden="true" className={`h-2.5 w-2.5 shrink-0 rounded-full ${jobColorFor(job.id).split(" ")[0]}`} />
                  <span className="min-w-0 flex-1 truncate text-sm font-medium text-[var(--text)]">{job.name}</span>
                  {hasWorkdays && <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-emerald-100 px-2.5 py-1 text-[11px] font-medium text-emerald-800 dark:bg-emerald-950 dark:text-emerald-200"><span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-emerald-500" />In use</span>}
                  <button type="button" onClick={() => { setEditingJobId(job.id); setEditingJobName(job.name); setError(""); }} aria-label={`Rename ${job.name}`} className="inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-medium text-[var(--muted)] transition hover:bg-[var(--elevated)] hover:text-[var(--text)]"><EditIcon />Edit</button>
                  <button type="button" onClick={() => { setJobToDelete(job); setError(""); }} aria-label={`Delete ${job.name}`} title={hasWorkdays ? "This job has workdays and cannot be deleted" : jobs.length <= 1 ? "Keep at least one job" : "Delete this job"} disabled={cannotDelete} className="inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-medium text-red-600 transition hover:bg-red-500/10 disabled:cursor-not-allowed disabled:opacity-35"><DeleteIcon />Delete</button>
                </div>
              );
            })}
          </div>
        </section>

        <form ref={formRef} onSubmit={saveWorkday} className="grid gap-3 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4 shadow-sm sm:grid-cols-[1fr_1fr_1.4fr_auto] sm:items-end sm:p-5">
          <label className="grid gap-1.5 text-sm font-medium text-[var(--text)]">Job
            <select required value={selectedJobId} onChange={(event) => setSelectedJobId(event.target.value)} className="min-h-11 rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 text-sm">
              {jobs.map((job) => <option key={job.id} value={job.id}>{job.name}</option>)}
            </select>
          </label>
          <label className="grid gap-1.5 text-sm font-medium text-[var(--text)]">
            Date
            <input type="date" required min={dateBounds.min} max={dateBounds.max} value={selectedDate} onChange={(event) => { setSelectedDate(event.target.value); setEditingWorkdayId(null); setHours(null); setMinutes(null); }} className="min-h-11 rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 text-sm" />
          </label>
          <div className="grid grid-cols-2 gap-2">
            <label className="grid gap-1.5 text-sm font-medium text-[var(--text)]">
              Hours
              <select required value={selectedHours} onChange={(event) => setHours(event.target.value)} className="min-h-11 rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 text-sm">
                {Array.from({ length: 12 }, (_, index) => index + 1).map((hour) => <option key={hour} value={hour}>{hour} {hour === 1 ? "hour" : "hours"}</option>)}
              </select>
            </label>
            <label className="grid gap-1.5 text-sm font-medium text-[var(--text)]">
              Minutes
              <select required value={selectedMinutes} onChange={(event) => setMinutes(event.target.value)} className="min-h-11 rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 text-sm">
                {Array.from({ length: 60 }, (_, minute) => <option key={minute} value={minute}>{minute} {minute === 1 ? "minute" : "minutes"}</option>)}
              </select>
            </label>
          </div>
          <button type="submit" disabled={isSaving} className="min-h-11 rounded-lg bg-[var(--accent)] px-5 text-sm font-semibold text-white transition hover:opacity-90 disabled:cursor-wait disabled:opacity-60">
            {isSaving ? "Saving…" : editingWorkdayId || workdays.some((item) => item.date === selectedDate && item.jobId === selectedJobId) ? "Update workday" : "Add workday"}
          </button>
        </form>

        {error && <p role="alert" className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-600">{error}</p>}

        <section className="overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface)] shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[var(--border)] p-4 sm:px-5">
            <div>
              <h2 className="text-lg font-semibold text-[var(--text)]">Logged workdays</h2>
              <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1">
                <span className="text-sm text-[var(--muted)]">{monthWorkdays.length} {monthWorkdays.length === 1 ? "logged day" : "logged days"}</span>
                <span aria-hidden="true" className="hidden h-4 border-l border-[var(--border)] sm:block" />
                <span className="text-sm font-semibold tabular-nums text-[var(--accent)]">{totalHoursLabel} total hours</span>
              </div>
            </div>
            <label className="flex items-center gap-2 rounded-full bg-[var(--elevated)] px-3 py-2 text-sm text-[var(--muted)]">
              Month
              <input type="month" value={month} onChange={(event) => { setMonth(event.target.value); setSelectedDate(""); setHours(null); setMinutes(null); }} className="bg-transparent text-[var(--text)] outline-none" />
            </label>
          </div>
          {sortedMonthWorkdays.length === 0 ? (
            <p className="px-5 py-12 text-center text-sm text-[var(--muted)]">No workdays logged for this month yet.</p>
          ) : (
            <>
              <div className="grid gap-3 p-3 sm:p-4 md:hidden">
                {sortedMonthWorkdays.map((workday, index) => (
                  <article key={workday.date} className="rounded-xl border border-[var(--border)] bg-[var(--background)] p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="text-xs font-medium text-[var(--muted)]">Day {sortedMonthWorkdays.length - index}</p>
                        <h3 className="mt-1 truncate font-medium text-[var(--text)]">{formatDate(workday.date, { weekday: "long" })}</h3>
                        <p className="mt-0.5 text-sm text-[var(--muted)]">{formatDate(workday.date, { year: "numeric", month: "short", day: "numeric" })}</p>
                      </div>
                      <p className="shrink-0 rounded-lg bg-[var(--elevated)] px-3 py-2 text-sm font-semibold tabular-nums text-[var(--text)]">{workday.hours} h{workday.minutes ? ` ${workday.minutes} min` : ""}</p>
                    </div>
                    <div className="mt-3 flex justify-end gap-2 border-t border-[var(--border)] pt-2">
                      <button type="button" onClick={() => editWorkday(workday)} aria-label={`Edit work hours for ${workday.date}`} className="rounded-md px-3 py-2 text-sm font-medium text-[var(--accent)] hover:bg-[var(--elevated)]">Edit</button>
                      <button type="button" onClick={() => void removeWorkday(workday.date)} aria-label={`Delete work hours for ${workday.date}`} className="rounded-md px-3 py-2 text-sm text-[var(--muted)] hover:bg-red-500/10 hover:text-red-600">Delete</button>
                    </div>
                  </article>
                ))}
              </div>
              <div className="hidden overflow-x-auto md:block">
                <table className="w-full min-w-[600px] text-left text-sm">
                  <thead className="bg-[var(--elevated)] text-xs uppercase tracking-wide text-[var(--muted)]">
                    <tr><th scope="col" className="px-5 py-3 font-medium">No.</th><th scope="col" className="px-5 py-3 font-medium">Day</th><th scope="col" className="px-5 py-3 font-medium">Date</th><th scope="col" className="px-5 py-3 text-right font-medium">Hours worked</th><th scope="col" className="px-5 py-3"><span className="sr-only">Actions</span></th></tr>
                  </thead>
                  <tbody className="divide-y divide-[var(--border)]">
                    {sortedMonthWorkdays.map((workday, index) => (
                      <tr key={workday.date} className="text-[var(--text)]">
                        <td className="px-5 py-3.5 text-[var(--muted)]">{sortedMonthWorkdays.length - index}</td>
                        <td className="px-5 py-3.5">{formatDate(workday.date, { weekday: "long" })}</td>
                        <td className="px-5 py-3.5">{formatDate(workday.date, { year: "numeric", month: "short", day: "numeric" })}</td>
                        <td className="px-5 py-3.5 text-right font-medium tabular-nums">{workday.hours} h{workday.minutes ? ` ${workday.minutes} min` : ""}</td>
                        <td className="px-5 py-3.5 text-right"><div className="flex justify-end gap-1"><button type="button" onClick={() => editWorkday(workday)} aria-label={`Edit work hours for ${workday.date}`} className="rounded-md px-2 py-1 text-xs text-[var(--accent)] hover:bg-[var(--elevated)]">Edit</button><button type="button" onClick={() => void removeWorkday(workday.date)} aria-label={`Delete work hours for ${workday.date}`} className="rounded-md px-2 py-1 text-xs text-[var(--muted)] hover:bg-red-500/10 hover:text-red-600">Delete</button></div></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </section>
      </main>
    </>
  );
}
