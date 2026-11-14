"use client";

import {
  collection,
  deleteDoc,
  doc,
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

type Workday = { date: string; hours: number; minutes: number };

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

export function WorkHoursTracker() {
  const { user, isAdmin, isLoading } = useAuth();
  const [workdays, setWorkdays] = useState<Workday[]>([]);
  const [selectedDate, setSelectedDate] = useState(localDate(new Date()));
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
    return onSnapshot(
      query(entries, orderBy("date", "desc")),
      (snapshot) => {
        setWorkdays(
          snapshot.docs.flatMap((item) => {
            const date = String(item.data().date ?? item.id);
            const value = Number(item.data().hours);
            const storedMinutes = Number(item.data().minutes);
            if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || !Number.isFinite(value) || value <= 0) return [];
            if (Number.isInteger(storedMinutes) && storedMinutes >= 0 && storedMinutes <= 59)
              return [{ date, hours: value, minutes: storedMinutes }];
            const totalMinutes = Math.round(value * 60);
            return [{ date, hours: Math.floor(totalMinutes / 60), minutes: totalMinutes % 60 }];
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
  const totalHoursLabel = `${Math.floor(totalMinutes / 60)} h${totalMinutes % 60 ? ` ${totalMinutes % 60} min` : ""}`;
  const selectedWorkday = workdays.find((workday) => workday.date === selectedDate);
  const selectedHours = hours ?? String(Math.min(12, Math.max(1, selectedWorkday?.hours ?? 1)));
  const selectedMinutes = minutes ?? String(selectedWorkday?.minutes ?? 0);
  const dateBounds = monthDateBounds(month);

  async function saveWorkday(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const isUpdating = workdays.some((workday) => workday.date === selectedDate);
    const hourValue = Number(selectedHours);
    const minuteValue = Number(selectedMinutes);
    if (!db || !user || !isAdmin) return;
    if (!selectedDate || selectedDate.slice(0, 7) !== month) {
      setError("Choose a date within the selected month.");
      return;
    }
    if (!Number.isInteger(hourValue) || hourValue < 1 || hourValue > 12 || !Number.isInteger(minuteValue) || minuteValue < 0 || minuteValue > 59) {
      setError("Choose hours from 1 to 12 and minutes from 0 to 59.");
      return;
    }
    setIsSaving(true);
    setError("");
    try {
      await setDoc(doc(db, "users", user.uid, "workHours", selectedDate), {
        date: selectedDate,
        hours: hourValue,
        minutes: minuteValue,
        updatedAt: serverTimestamp(),
      });
      setMonth(selectedDate.slice(0, 7));
      setSelectedDate("");
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

  async function removeWorkday(date: string) {
    if (!db || !user || !isAdmin) return;
    setError("");
    try {
      await deleteDoc(doc(db, "users", user.uid, "workHours", date));
      if (selectedDate === date) {
        setSelectedDate("");
        setHours(null);
        setMinutes(null);
      }
      setToast("Workday deleted.");
    } catch {
      setError("We could not remove this workday. Check your Firestore rules.");
      setToast("Could not delete workday.");
    }
  }

  function editWorkday(workday: Workday) {
    setSelectedDate(workday.date);
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
      <main className="mx-auto flex w-full max-w-5xl flex-col gap-6 px-4 py-8 sm:px-6 sm:py-12">
        <header>
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[var(--accent)]">Admin tool</p>
          <h1 className="mt-1 text-3xl font-semibold text-[var(--text)]">Work hours</h1>
          <p className="mt-2 text-sm text-[var(--muted)]">Log the hours you worked. Only logged workdays appear in the table.</p>
        </header>

        <form ref={formRef} onSubmit={saveWorkday} className="grid gap-3 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4 shadow-sm sm:grid-cols-[1fr_1.4fr_auto] sm:items-end sm:p-5">
          <label className="grid gap-1.5 text-sm font-medium text-[var(--text)]">
            Date
            <input type="date" required min={dateBounds.min} max={dateBounds.max} value={selectedDate} onChange={(event) => { setSelectedDate(event.target.value); setHours(null); setMinutes(null); }} className="min-h-11 rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 text-sm" />
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
            {isSaving ? "Saving…" : workdays.some((item) => item.date === selectedDate) ? "Update workday" : "Add workday"}
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
                        <p className="text-xs font-medium text-[var(--muted)]">Day {index + 1}</p>
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
                        <td className="px-5 py-3.5 text-[var(--muted)]">{index + 1}</td>
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
