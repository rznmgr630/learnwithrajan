"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
  arrayMove,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { supabase, type TaskRow } from "@/lib/supabase";

type Task = {
  id: string;
  text: string;
  completed: boolean;
  scheduledDate: string; // YYYY-MM-DD
};

const STORAGE_KEY = "daily-planner-tasks";

const MOTIVATIONS = [
  "You crushed it today. Keep the momentum going.",
  "All done! You're building something incredible, one task at a time.",
  "Your future self is proud of you. Every task completed counts.",
  "Finished! Discipline beats motivation every single time.",
  "Everything checked off. That's the consistency that changes lives.",
  "Clean sweep. You showed up and delivered — that's everything.",
  "All tasks done. Rest well — you've earned it.",
];

function dateStr(offset = 0) {
  const d = new Date();
  d.setDate(d.getDate() + offset);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function formatDate(iso: string) {
  const d = new Date(iso + "T00:00:00");
  return d.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" });
}

function toTask(row: TaskRow): Task {
  return { id: row.id, text: row.text, completed: row.completed, scheduledDate: row.scheduled_date };
}

function toRow(task: Task, sortOrder: number): TaskRow {
  return { id: task.id, text: task.text, completed: task.completed, scheduled_date: task.scheduledDate, sort_order: sortOrder };
}

type TodoPageProps = {
  userId?: string;
  userName?: string;
  onSignOut?: () => void;
};

export function TodoPage({ userId, userName, onSignOut }: TodoPageProps) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [todayInput, setTodayInput] = useState("");
  const [tomorrowInput, setTomorrowInput] = useState("");
  const [mounted, setMounted] = useState(false);
  const [syncing, setSyncing] = useState(false);
  // Track IDs known to Supabase so we can distinguish insert vs update
  const remoteIds = useRef<Set<string>>(new Set());

  // Load: localStorage first (instant), then Supabase (replaces)
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setTasks(JSON.parse(raw));
    } catch {}

    if (supabase) {
      setSyncing(true);
      supabase
        .from("tasks")
        .select("*")
        .order("sort_order", { ascending: true })
        .then(({ data, error }) => {
          if (!error && data) {
            const fetched = (data as TaskRow[]).map(toTask);
            setTasks(fetched);
            localStorage.setItem(STORAGE_KEY, JSON.stringify(fetched));
            remoteIds.current = new Set(fetched.map((t) => t.id));
          }
          setSyncing(false);
        });
    }

    setMounted(true);
  }, []);

  // Write to localStorage and optimistically update state;
  // Supabase ops are fire-and-forget via the returned async function
  const persist = useCallback((next: Task[]) => {
    setTasks(next);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  }, []);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
  );

  if (!mounted) return null;

  const today = dateStr(0);
  const tomorrow = dateStr(1);

  const todayTasks = tasks.filter((t) => t.scheduledDate === today && !t.completed);
  const overdueTasks = tasks.filter((t) => t.scheduledDate < today && !t.completed);
  const tomorrowTasks = tasks.filter((t) => t.scheduledDate === tomorrow && !t.completed);
  const doneTasks = tasks.filter((t) => t.completed);

  const todayHadTasks = tasks.some((t) => t.scheduledDate === today);
  const allTodayDone = todayHadTasks && todayTasks.length === 0;
  const motivation = MOTIVATIONS[doneTasks.filter((t) => t.scheduledDate === today).length % MOTIVATIONS.length];

  async function addTask(scheduledDate: string, text: string) {
    const trimmed = text.trim();
    if (!trimmed) return;
    const id = Math.random().toString(36).slice(2) + Date.now().toString(36);
    const task: Task = { id, text: trimmed, completed: false, scheduledDate };
    const next = [...tasks, task];
    persist(next);

    if (supabase) {
      await supabase.from("tasks").insert({ ...toRow(task, next.length - 1), user_id: userId });
      remoteIds.current.add(id);
    }
  }

  async function toggle(id: string) {
    const next = tasks.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t));
    persist(next);

    if (supabase) {
      const updated = next.find((t) => t.id === id)!;
      await supabase.from("tasks").update({ completed: updated.completed }).eq("id", id);
    }
  }

  async function remove(id: string) {
    persist(tasks.filter((t) => t.id !== id));
    if (supabase) {
      await supabase.from("tasks").delete().eq("id", id);
      remoteIds.current.delete(id);
    }
  }

  async function clearDone() {
    const doneIds = tasks.filter((t) => t.completed).map((t) => t.id);
    persist(tasks.filter((t) => !t.completed));
    if (supabase && doneIds.length > 0) {
      await supabase.from("tasks").delete().in("id", doneIds);
      doneIds.forEach((id) => remoteIds.current.delete(id));
    }
  }

  function handleDragEnd(sectionTasks: Task[]) {
    return async (event: DragEndEvent) => {
      const { active, over } = event;
      if (!over || active.id === over.id) return;

      const oldIdx = sectionTasks.findIndex((t) => t.id === active.id);
      const newIdx = sectionTasks.findIndex((t) => t.id === over.id);
      const reordered = arrayMove(sectionTasks, oldIdx, newIdx);

      const sectionIds = new Set(sectionTasks.map((t) => t.id));
      const result = [...tasks];
      const globalIdxs = tasks.map((t, i) => (sectionIds.has(t.id) ? i : -1)).filter((i) => i !== -1);
      reordered.forEach((task, i) => { result[globalIdxs[i]] = task; });
      persist(result);

      if (supabase) {
        const rows = result.map((t, i) => toRow(t, i));
        const sectionRows = rows.filter((r) => sectionIds.has(r.id));
        await supabase.from("tasks").upsert(sectionRows);
      }
    };
  }

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <div className="relative overflow-hidden border-b border-[var(--border)]">
        <div aria-hidden className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-[var(--glow)] blur-3xl" />
        <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-[var(--border)] bg-[var(--elevated)] px-3 py-1 text-xs font-medium text-[var(--muted)]">
                <span className="h-1.5 w-1.5 rounded-full bg-[var(--accent)]" />
                Daily Planner
              </span>
              {syncing && (
                <span className="flex items-center gap-1.5 text-xs text-[var(--faint)]">
                  <svg className="h-3 w-3 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                  </svg>
                  Syncing…
                </span>
              )}
              {!syncing && supabase && (
                <span className="flex items-center gap-1 text-xs text-[var(--faint)]">
                  <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
                  Synced
                </span>
              )}
            </div>
            {onSignOut && (
              <div className="flex items-center gap-3">
                {userName && (
                  <span className="text-xs text-[var(--muted)]">
                    Hey, <span className="font-medium text-[var(--text)]">{userName.split(" ")[0]}</span>
                  </span>
                )}
                <button
                  onClick={onSignOut}
                  className="rounded-lg border border-[var(--border)] px-3 py-1.5 text-xs text-[var(--faint)] transition hover:border-[var(--muted)] hover:text-[var(--text)]"
                >
                  Sign out
                </button>
              </div>
            )}
          </div>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight text-[var(--text)] sm:text-4xl">
            Plan your next 2 days
          </h1>
          <p className="mt-2 max-w-lg text-sm text-[var(--muted)]">
            Keep today sharp. Set tomorrow up. Incomplete tasks carry forward as overdue automatically.
          </p>
        </div>
      </div>

      {/* Sections */}
      <div className="mx-auto max-w-3xl space-y-12 px-4 py-10 sm:px-6">
        {/* TODAY */}
        <section>
          <SectionHeader title="Today" date={formatDate(today)} count={todayTasks.length} />

          {allTodayDone && (
            <div className="mt-4 flex items-start gap-3 rounded-2xl border border-[color-mix(in_oklab,var(--accent)_35%,var(--border))] bg-[color-mix(in_oklab,var(--accent)_8%,var(--surface))] px-4 py-4">
              <span className="text-2xl leading-none">🎯</span>
              <div>
                <p className="text-sm font-semibold text-[var(--accent)]">All done for today!</p>
                <p className="mt-0.5 text-sm text-[var(--text)]">{motivation}</p>
              </div>
            </div>
          )}

          <div className="mt-4">
            {todayTasks.length === 0 && !allTodayDone && (
              <p className="py-3 text-sm italic text-[var(--faint)]">No tasks yet — add one below.</p>
            )}
            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd(todayTasks)}>
              <SortableContext items={todayTasks.map((t) => t.id)} strategy={verticalListSortingStrategy}>
                <div className="space-y-2">
                  {todayTasks.map((task) => (
                    <SortableTaskRow key={task.id} task={task} onToggle={toggle} onDelete={remove} />
                  ))}
                </div>
              </SortableContext>
            </DndContext>
          </div>

          <div className="mt-4">
            <AddInput
              value={todayInput}
              onChange={setTodayInput}
              onAdd={() => { addTask(today, todayInput); setTodayInput(""); }}
              placeholder="Add a task for today…"
            />
          </div>
        </section>

        <div className="border-t border-[var(--border)]" />

        {/* TOMORROW */}
        <section>
          <SectionHeader title="Tomorrow" date={formatDate(tomorrow)} count={overdueTasks.length + tomorrowTasks.length} />

          {overdueTasks.length > 0 && (
            <div className="mt-4">
              <div className="mb-2 flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full" style={{ background: "#f59e0b" }} />
                <p className="text-xs font-semibold" style={{ color: "#f59e0b" }}>Carried over · overdue</p>
              </div>
              <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd(overdueTasks)}>
                <SortableContext items={overdueTasks.map((t) => t.id)} strategy={verticalListSortingStrategy}>
                  <div className="space-y-2">
                    {overdueTasks.map((task) => (
                      <SortableTaskRow key={task.id} task={task} onToggle={toggle} onDelete={remove} overdue />
                    ))}
                  </div>
                </SortableContext>
              </DndContext>
            </div>
          )}

          <div className="mt-4">
            {tomorrowTasks.length === 0 && overdueTasks.length === 0 && (
              <p className="py-3 text-sm italic text-[var(--faint)]">Nothing planned yet — add something below.</p>
            )}
            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd(tomorrowTasks)}>
              <SortableContext items={tomorrowTasks.map((t) => t.id)} strategy={verticalListSortingStrategy}>
                <div className="space-y-2">
                  {tomorrowTasks.map((task) => (
                    <SortableTaskRow key={task.id} task={task} onToggle={toggle} onDelete={remove} />
                  ))}
                </div>
              </SortableContext>
            </DndContext>
          </div>

          <div className="mt-4">
            <AddInput
              value={tomorrowInput}
              onChange={setTomorrowInput}
              onAdd={() => { addTask(tomorrow, tomorrowInput); setTomorrowInput(""); }}
              placeholder="Add a task for tomorrow…"
            />
          </div>
        </section>

        {/* DONE */}
        {doneTasks.length > 0 && (
          <>
            <div className="border-t border-[var(--border)]" />
            <section>
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-[var(--text)]">Done</h2>
                  <p className="text-xs text-[var(--muted)]">{doneTasks.length} completed</p>
                </div>
                <button
                  onClick={clearDone}
                  className="mt-1 rounded-lg border border-[var(--border)] px-3 py-1 text-xs text-[var(--faint)] transition hover:border-red-500/40 hover:text-red-500"
                >
                  Clear all
                </button>
              </div>

              <div className="mt-4 space-y-2">
                {doneTasks.map((task) => (
                  <DoneTaskRow
                    key={task.id}
                    task={task}
                    today={today}
                    tomorrow={tomorrow}
                    onToggle={toggle}
                    onDelete={remove}
                  />
                ))}
              </div>
            </section>
          </>
        )}
      </div>
    </div>
  );
}

function SortableTaskRow({
  task,
  onToggle,
  onDelete,
  overdue = false,
}: {
  task: Task;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  overdue?: boolean;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: task.id });
  const style = { transform: CSS.Transform.toString(transform), transition };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={[
        "flex items-center gap-3 rounded-xl border px-4 py-3 transition-colors",
        overdue
          ? "border-[color-mix(in_oklab,#f59e0b_30%,var(--border))] bg-[color-mix(in_oklab,#f59e0b_6%,var(--surface))]"
          : "border-[var(--border)] bg-[var(--elevated)]",
        isDragging ? "shadow-lg ring-1 ring-[var(--accent)] z-10" : "",
      ].join(" ")}
    >
      <button
        {...attributes}
        {...listeners}
        aria-label="Drag to reorder"
        className="shrink-0 cursor-grab touch-none text-[var(--faint)] transition hover:text-[var(--muted)] active:cursor-grabbing"
      >
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 8h16M4 16h16" />
        </svg>
      </button>

      <button
        onClick={() => onToggle(task.id)}
        aria-label="Mark complete"
        className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 border-[var(--muted)] transition hover:border-[var(--accent)]"
      />

      <span className="flex-1 text-sm text-[var(--text)]">{task.text}</span>

      <button
        onClick={() => onDelete(task.id)}
        aria-label="Delete task"
        className="shrink-0 text-[var(--faint)] transition hover:text-red-500"
      >
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
}

function DoneTaskRow({
  task,
  today,
  tomorrow,
  onToggle,
  onDelete,
}: {
  task: Task;
  today: string;
  tomorrow: string;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}) {
  const dayLabel =
    task.scheduledDate === today ? "Today"
    : task.scheduledDate === tomorrow ? "Tomorrow"
    : task.scheduledDate < today ? "Overdue"
    : null;

  return (
    <div className="flex items-center gap-3 rounded-xl border border-[var(--border)] bg-[var(--elevated)] px-4 py-3 opacity-60">
      <button
        onClick={() => onToggle(task.id)}
        aria-label="Mark incomplete"
        className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 border-[var(--accent)] bg-[var(--accent)] transition hover:opacity-75"
      >
        <svg className="h-3 w-3 text-[var(--accent-fg)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
      </button>

      <span className="flex-1 text-sm line-through text-[var(--faint)]">{task.text}</span>

      {dayLabel && (
        <span className="shrink-0 rounded-full bg-[var(--surface)] px-2 py-0.5 text-[10px] font-medium text-[var(--faint)]">
          {dayLabel}
        </span>
      )}

      <button
        onClick={() => onDelete(task.id)}
        aria-label="Delete task"
        className="shrink-0 text-[var(--faint)] transition hover:text-red-500"
      >
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
}

function SectionHeader({ title, date, count }: { title: string; date: string; count: number }) {
  return (
    <div className="flex items-start justify-between">
      <div>
        <h2 className="text-lg font-semibold text-[var(--text)]">{title}</h2>
        <p className="text-xs text-[var(--muted)]">{date}</p>
      </div>
      {count > 0 && (
        <span className="mt-1 rounded-full bg-[var(--elevated)] px-3 py-1 font-mono text-xs text-[var(--accent)]">
          {count}
        </span>
      )}
    </div>
  );
}

function AddInput({
  value,
  onChange,
  onAdd,
  placeholder,
}: {
  value: string;
  onChange: (v: string) => void;
  onAdd: () => void;
  placeholder: string;
}) {
  return (
    <div className="flex gap-2">
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => { if (e.key === "Enter") onAdd(); }}
        placeholder={placeholder}
        className="flex-1 rounded-xl border border-[var(--border)] bg-[var(--surface)] px-4 py-2.5 text-sm text-[var(--text)] placeholder:text-[var(--faint)] focus:border-[var(--accent)] focus:outline-none transition"
      />
      <button
        onClick={onAdd}
        className="flex items-center gap-1.5 rounded-xl bg-[var(--accent)] px-4 py-2.5 text-sm font-medium text-[var(--accent-fg)] transition hover:opacity-90"
      >
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
        </svg>
        Add
      </button>
    </div>
  );
}
