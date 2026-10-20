"use client";

import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  setDoc,
  updateDoc,
  writeBatch,
} from "firebase/firestore";
import { type FormEvent, useEffect, useMemo, useRef, useState } from "react";
import { SiteHeader } from "@/components/SiteHeader";
import { useAuth } from "@/context/AuthContext";
import { db } from "@/lib/firebase";

type Category = {
  id: string;
  name: string;
  limit: number;
  type: "needs" | "wants";
};
type Transaction = {
  id: string;
  amount: number;
  categoryId: string;
  date: string;
  note: string;
};
type RecurringBill = {
  id: string;
  name: string;
  amount: number;
  dueDay: number;
};
type DeletionTarget = {
  group: "categories" | "transactions" | "bills";
  id: string;
  name: string;
};

const monthlyKey = () =>
  new Date().toLocaleDateString("en-CA", { year: "numeric", month: "2-digit" });
const today = () => new Date().toLocaleDateString("en-CA");
const monthEnd = (month: string) => {
  const [year, monthNumber] = month.split("-").map(Number);
  return `${month}-${String(new Date(year, monthNumber, 0).getDate()).padStart(2, "0")}`;
};
const currencies = [
  "JPY",
  "USD",
  "NRS",
  "EUR",
  "GBP",
  "AUD",
  "CAD",
  "INR",
  "CNY",
  "KRW",
] as const;
type Currency = (typeof currencies)[number];
const currencyLabels: Record<Currency, string> = {
  JPY: "🇯🇵 JPY",
  USD: "🇺🇸 USD",
  NRS: "🇳🇵 NRS",
  EUR: "🇪🇺 EUR",
  GBP: "🇬🇧 GBP",
  AUD: "🇦🇺 AUD",
  CAD: "🇨🇦 CAD",
  INR: "🇮🇳 INR",
  CNY: "🇨🇳 CNY",
  KRW: "🇰🇷 KRW",
};
const currencyNames: Record<Currency, string> = { JPY: "Japanese yen", USD: "US dollars", NRS: "Nepali rupees", EUR: "euros", GBP: "British pounds", AUD: "Australian dollars", CAD: "Canadian dollars", INR: "Indian rupees", CNY: "Chinese yuan", KRW: "South Korean won" };
type MoneyFormatter = { format: (value: number) => string };
const defaultMoney = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "JPY",
  maximumFractionDigits: 0,
});
const asAmount = (value: unknown) => Math.max(0, Number(value) || 0);
const chartColors = [
  "#6366f1",
  "#14b8a6",
  "#f59e0b",
  "#ec4899",
  "#8b5cf6",
  "#0ea5e9",
];

function PencilIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="h-4 w-4 fill-none stroke-current stroke-2"
    >
      <path d="M12 20h9" />
      <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L8 18l-4 1 1-4Z" />
    </svg>
  );
}
function TrashIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="h-4 w-4 fill-none stroke-current stroke-2"
    >
      <path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6M10 11v5M14 11v5" />
    </svg>
  );
}

function BudgetPlan({
  income,
  needs,
  wants,
  money,
}: {
  income: number;
  needs: number;
  wants: number;
  money: MoneyFormatter;
}) {
  const items = [
    {
      label: "Needs",
      target: income * 0.5,
      spent: needs,
      hint: "50% for essentials",
      help: "Rent, utilities, groceries, transport, and other essentials.",
    },
    {
      label: "Wants",
      target: income * 0.3,
      spent: wants,
      hint: "30% for life and fun",
      help: "Dining out, entertainment, hobbies, and other optional spending.",
    },
    {
      label: "Savings or debt",
      target: income * 0.2,
      spent: 0,
      hint: "20% to set aside",
      help: "Money for savings, investing, emergency funds, or paying off debt.",
    },
  ];
  return (
    <section className="order-2 mt-6 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5">
      <div>
        <h2 className="text-lg font-semibold text-[var(--text)]">
          50/30/20 plan
        </h2>
        <p className="mt-1 text-sm text-[var(--muted)]">
          A guide for how much to spend and save from this month&apos;s income.
        </p>
      </div>
      <div className="mt-4 grid gap-3 sm:grid-cols-3">
        {items.map((item) => (
          <article
            key={item.label}
            className="rounded-xl bg-[var(--elevated)] p-4"
          >
            <p className="flex items-center gap-1 font-medium text-[var(--text)]">
              {item.label}
              {item.help && (
                <span
                  title={item.help}
                  aria-label={item.help}
                  className="cursor-help rounded-full border border-[var(--faint)] px-1 text-xs text-[var(--muted)]"
                >
                  ?
                </span>
              )}
            </p>
            <p className="mt-2 text-lg font-semibold text-[var(--text)]">
              {money.format(item.target)}
            </p>
            <p className="text-xs text-[var(--faint)]">{item.hint}</p>
            {item.label !== "Savings or debt" && (
              <p
                className={
                  item.spent > item.target
                    ? "mt-3 text-xs text-red-500"
                    : "mt-3 text-xs text-[var(--muted)]"
                }
              >
                {money.format(item.spent)} spent ·{" "}
                {money.format(item.target - item.spent)} left
              </p>
            )}
          </article>
        ))}
      </div>
    </section>
  );
}

function RetirementPlanner({ money, onClose }: { money: MoneyFormatter; onClose: () => void }) {
  const [currentAge, setCurrentAge] = useState("30");
  const [retirementAge, setRetirementAge] = useState("50");
  const [saved, setSaved] = useState("");
  const [monthly, setMonthly] = useState("");
  const [returnRate, setReturnRate] = useState("5");
  const years = Math.max(0, Number(retirementAge) - Number(currentAge));
  const months = years * 12;
  const monthlyRate = Number(returnRate) / 1200;
  const currentValue = asAmount(saved) * (1 + monthlyRate) ** months;
  const contributions = monthlyRate
    ? asAmount(monthly) * (((1 + monthlyRate) ** months - 1) / monthlyRate)
    : asAmount(monthly) * months;
  const total = currentValue + contributions;
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/50 p-4" role="dialog" aria-modal="true" aria-labelledby="retirement-title"><button type="button" aria-label="Close retirement planner" onClick={onClose} className="absolute inset-0 cursor-default" /><section className="relative w-full max-w-2xl rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5">
      <div className="flex items-center justify-between"><h2 id="retirement-title" className="text-lg font-semibold text-[var(--text)]">
        Retirement plan
      </h2><button type="button" onClick={onClose} className="cursor-pointer text-sm text-[var(--muted)] hover:text-[var(--text)]">Close</button></div>
      <p className="mt-1 text-sm text-[var(--muted)]">
        Estimate what regular saving could grow to. Returns are not guaranteed.
      </p>
      <div className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-5">
        <input
          type="number"
          min="0"
          value={currentAge}
          onChange={(event) => setCurrentAge(event.target.value)}
          placeholder="Current age"
          className="rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm"
        />
        <input
          type="number"
          min="1"
          value={retirementAge}
          onChange={(event) => setRetirementAge(event.target.value)}
          placeholder="Retirement age"
          className="rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm"
        />
        <input
          type="number"
          min="0"
          value={saved}
          onChange={(event) => setSaved(event.target.value)}
          placeholder="Current savings"
          className="rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm"
        />
        <input
          type="number"
          min="0"
          value={monthly}
          onChange={(event) => setMonthly(event.target.value)}
          placeholder="Monthly saving"
          className="rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm"
        />
        <input
          type="number"
          min="0"
          step="0.1"
          value={returnRate}
          onChange={(event) => setReturnRate(event.target.value)}
          placeholder="Annual return %"
          className="rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm"
        />
      </div>
      <div className="mt-4 rounded-xl bg-[var(--elevated)] p-4">
        <p className="text-sm text-[var(--muted)]">
          Estimated value at age {retirementAge || "?"} in {years} years
        </p>
        <p className="mt-1 text-2xl font-semibold text-[var(--text)]">
          {money.format(total)}
        </p>
      </div>
    </section></div>
  );
}

function Summary({
  label,
  value,
  hint,
  money = defaultMoney,
  className = "text-[var(--text)]",
}: {
  label: string;
  value: number;
  hint: string;
  money?: MoneyFormatter;
  className?: string;
}) {
  return (
    <article className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 shadow-sm">
      <p className="text-sm text-[var(--muted)]">{label}</p>
      <p className={`mt-2 text-2xl font-semibold ${className}`}>
        {money.format(value)}
      </p>
      <p className="mt-1 text-xs text-[var(--faint)]">{hint}</p>
    </article>
  );
}

function SpendingChart({
  slices,
  total,
  money = defaultMoney,
}: {
  slices: { name: string; amount: number }[];
  total: number;
  money?: MoneyFormatter;
}) {
  if (!total)
    return (
      <section className="order-3 mt-6 rounded-2xl border border-dashed border-[var(--border)] px-5 py-8 text-center">
        <h2 className="text-lg font-semibold text-[var(--text)]">
          Spending by category
        </h2>
        <p className="mt-2 text-sm text-[var(--muted)]">
          Add an expense to see this month&apos;s breakdown.
        </p>
      </section>
    );
  const arcs = slices.map((slice, index) => ({
    slice,
    length: (slice.amount / total) * 100,
    offset: slices
      .slice(0, index)
      .reduce((sum, item) => sum + (item.amount / total) * 100, 0),
  }));
  return (
    <section className="order-3 mt-6 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5">
      <h2 className="text-lg font-semibold text-[var(--text)]">
        Spending by category
      </h2>
      <div className="mt-5 grid items-center gap-6 lg:grid-cols-[10rem_minmax(0,1fr)]">
        <svg
          viewBox="0 0 100 100"
          role="img"
          aria-labelledby="spending-chart-title"
          className="mx-auto h-40 w-40"
        >
          <title id="spending-chart-title">
            This month&apos;s spending by category
          </title>
          <circle
            cx="50"
            cy="50"
            r="42"
            pathLength="100"
            fill="none"
            stroke="var(--elevated)"
            strokeWidth="16"
          />
          {arcs.map(({ slice, length, offset }, index) => (
            <circle
              key={slice.name}
              cx="50"
              cy="50"
              r="42"
              pathLength="100"
              fill="none"
              stroke={chartColors[index % chartColors.length]}
              strokeWidth="16"
              strokeDasharray={`${length} ${100 - length}`}
              strokeDashoffset={-offset}
              strokeLinecap="butt"
              transform="rotate(-90 50 50)"
            />
          ))}
          <text
            x="50"
            y="47"
            textAnchor="middle"
            className="fill-[var(--muted)] text-[8px]"
          >
            Spent
          </text>
          <text
            x="50"
            y="58"
            textAnchor="middle"
            className="fill-[var(--text)] text-[10px] font-semibold"
          >
            {money.format(total)}
          </text>
        </svg>
        <ul className="space-y-2">
          {slices.map((slice, index) => (
            <li key={slice.name} className="flex items-center gap-3 text-sm">
              <span
                aria-hidden="true"
                className="h-2.5 w-2.5 rounded-full"
                style={{
                  backgroundColor: chartColors[index % chartColors.length],
                }}
              />
              <span className="min-w-0 flex-1 truncate text-[var(--muted)]">
                {slice.name}
              </span>
              <span className="font-medium text-[var(--text)]">
                {money.format(slice.amount)}
              </span>
              <span className="w-10 text-right text-xs text-[var(--faint)]">
                {Math.round((slice.amount / total) * 100)}%
              </span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function BudgetSkeleton() {
  return (
    <main className="mx-auto max-w-5xl animate-pulse px-4 py-8 sm:px-6 sm:py-12">
      <div className="flex items-end justify-between">
        <div>
          <div className="h-4 w-24 rounded bg-[var(--elevated)]" />
          <div className="mt-3 h-9 w-32 rounded bg-[var(--elevated)]" />
          <div className="mt-3 h-4 w-64 rounded bg-[var(--elevated)]" />
        </div>
        <div className="h-9 w-32 rounded-full bg-[var(--elevated)]" />
      </div>
      <section className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }, (_, index) => (
          <article
            key={index}
            className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5"
          >
            <div className="h-4 w-24 rounded bg-[var(--elevated)]" />
            <div className="mt-3 h-8 w-32 rounded bg-[var(--elevated)]" />
            <div className="mt-3 h-3 w-20 rounded bg-[var(--elevated)]" />
          </article>
        ))}
      </section>
      <section className="mt-6 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5">
        <div className="h-6 w-48 rounded bg-[var(--elevated)]" />
        <div className="mt-5 grid items-center gap-6 lg:grid-cols-[10rem_minmax(0,1fr)]">
          <div className="mx-auto h-40 w-40 rounded-full border-[18px] border-[var(--elevated)]" />
          <div className="space-y-4">
            {Array.from({ length: 4 }, (_, index) => (
              <div key={index} className="h-4 rounded bg-[var(--elevated)]" />
            ))}
          </div>
        </div>
      </section>
      <section className="mt-6 grid gap-6 lg:grid-cols-2">
        {Array.from({ length: 2 }, (_, index) => (
          <article
            key={index}
            className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5"
          >
            <div className="h-6 w-36 rounded bg-[var(--elevated)]" />
            <div className="mt-4 h-10 rounded-lg bg-[var(--elevated)]" />
          </article>
        ))}
      </section>
    </main>
  );
}

function DeleteConfirmModal({
  target,
  isDeleting,
  onCancel,
  onConfirm,
}: {
  target: DeletionTarget | null;
  isDeleting: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  if (!target) return null;
  return (
    <div
      className="fixed inset-0 z-50 grid place-items-center bg-black/50 px-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="delete-confirm-title"
    >
      <button
        type="button"
        aria-label="Cancel delete"
        onClick={onCancel}
        disabled={isDeleting}
        className="absolute inset-0 cursor-default"
      />
      <section className="relative w-full max-w-sm rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-2xl">
        <h2
          id="delete-confirm-title"
          className="text-xl font-semibold text-[var(--text)]"
        >
          Delete {target.name}?
        </h2>
        <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
          This cannot be undone.
        </p>
        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            disabled={isDeleting}
            className="rounded-lg px-4 py-2 text-sm font-medium text-[var(--muted)] hover:bg-[var(--elevated)] disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isDeleting}
            className="rounded-lg bg-red-500 px-4 py-2 text-sm font-semibold text-white hover:bg-red-600 disabled:opacity-50"
          >
            {isDeleting ? "Deleting…" : "Delete"}
          </button>
        </div>
      </section>
    </div>
  );
}

export function BudgetTracker() {
  const { user, isAdmin, isLoading } = useAuth();
  const firestore = db;
  const [income, setIncome] = useState(0);
  const [currency, setCurrency] = useState<Currency>("JPY");
  const [categories, setCategories] = useState<Category[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [bills, setBills] = useState<RecurringBill[]>([]);
  const [month, setMonth] = useState(monthlyKey);
  const [isMonthLoading, setIsMonthLoading] = useState(true);
  const [error, setError] = useState("");
  const [categoryName, setCategoryName] = useState("");
  const [categoryLimit, setCategoryLimit] = useState("");
  const [categoryType, setCategoryType] = useState<"needs" | "wants">("needs");
  const [categoryToEdit, setCategoryToEdit] = useState("");
  const [editedCategoryName, setEditedCategoryName] = useState("");
  const [editedCategoryLimit, setEditedCategoryLimit] = useState("");
  const [editedCategoryType, setEditedCategoryType] = useState<"needs" | "wants">("needs");
  const [expenseAmount, setExpenseAmount] = useState("");
  const [expenseCategory, setExpenseCategory] = useState("");
  const [expenseDate, setExpenseDate] = useState(today);
  const [expenseNote, setExpenseNote] = useState("");
  const [editingTransaction, setEditingTransaction] =
    useState<Transaction | null>(null);
  const [billName, setBillName] = useState("");
  const [billAmount, setBillAmount] = useState("");
  const [billDueDay, setBillDueDay] = useState("");
  const [billToEdit, setBillToEdit] = useState("");
  const [editedBillName, setEditedBillName] = useState("");
  const [editedBillAmount, setEditedBillAmount] = useState("");
  const [editedBillDueDay, setEditedBillDueDay] = useState("1");
  const expenseEditorRef = useRef<HTMLInputElement>(null);
  const categoryEditorRef = useRef<HTMLInputElement>(null);
  const billEditorRef = useRef<HTMLInputElement>(null);
  const [deletionTarget, setDeletionTarget] = useState<DeletionTarget | null>(
    null,
  );
  const [pendingAction, setPendingAction] = useState<
    "income" | "category" | "expense" | "bill" | "delete" | null
  >(null);
  const [isRetirementOpen, setIsRetirementOpen] = useState(false);

  useEffect(() => {
    if (!editingTransaction) return;
    const frame = requestAnimationFrame(() => {
      const editor = expenseEditorRef.current;
      if (!editor) return;
      window.scrollTo({
        top: editor.getBoundingClientRect().top + window.scrollY - 96,
        behavior: "smooth",
      });
      editor.focus({ preventScroll: true });
    });
    return () => cancelAnimationFrame(frame);
  }, [editingTransaction]);

  useEffect(() => {
    if (!firestore || !user || !isAdmin) return;
    const settings = doc(firestore, "users", user.uid, "budget", "settings");
    const monthSetup = doc(settings, "months", month);
    let pendingSources = 5;
    const markLoaded = () => {
      pendingSources -= 1;
      if (pendingSources === 0) setIsMonthLoading(false);
    };
    if (month === monthlyKey()) {
      void (async () => {
        const existingSetup = await getDoc(monthSetup);
        if (existingSetup.exists()) return;
        const [legacySettings, legacyCategories, legacyBills] =
          await Promise.all([
            getDoc(settings),
            getDocs(collection(settings, "categories")),
            getDocs(collection(settings, "bills")),
          ]);
        if (
          !legacySettings.exists() &&
          legacyCategories.empty &&
          legacyBills.empty
        )
          return;
        const batch = writeBatch(firestore);
        batch.set(monthSetup, {
          income: asAmount(legacySettings.data()?.income),
        });
        legacyCategories.docs.forEach((item) =>
          batch.set(doc(monthSetup, "categories", item.id), item.data()),
        );
        legacyBills.docs.forEach((item) =>
          batch.set(doc(monthSetup, "bills", item.id), item.data()),
        );
        await batch.commit();
      })().catch(() =>
        setError(
          "We could not migrate the current budget setup. Check your Firestore rules.",
        ),
      );
    }
    const stopCurrency = onSnapshot(
      settings,
      (snapshot) => {
        const savedCurrency = String(snapshot.data()?.currency ?? "JPY");
        const displayCurrency = savedCurrency === "NPR" ? "NRS" : savedCurrency;
        setCurrency(
          currencies.includes(displayCurrency as Currency)
            ? (displayCurrency as Currency)
            : "JPY",
        );
        markLoaded();
      },
      () => {
        setError(
          "We could not load the budget settings. Check your Firestore rules.",
        );
        markLoaded();
      },
    );
    const stopSettings = onSnapshot(
      monthSetup,
      (snapshot) => {
        setIncome(asAmount(snapshot.data()?.income));
        markLoaded();
      },
      () => {
        setError("We could not load the budget. Check your Firestore rules.");
        markLoaded();
      },
    );
    const stopCategories = onSnapshot(
      query(collection(settings, "categories"), orderBy("name")),
      (snapshot) => {
        setCategories(
          snapshot.docs.map((item) => ({
            id: item.id,
            name: String(item.data().name ?? "Untitled"),
            limit: asAmount(item.data().limit),
            type: item.data().type === "wants" ? "wants" : "needs",
          })),
        );
        markLoaded();
      },
      () => {
        setError("We could not load categories. Check your Firestore rules.");
        markLoaded();
      },
    );
    const stopTransactions = onSnapshot(
      query(collection(settings, "transactions"), orderBy("date", "desc")),
      (snapshot) => {
        setTransactions(
          snapshot.docs.map((item) => ({
            id: item.id,
            amount: asAmount(item.data().amount),
            categoryId: String(item.data().categoryId ?? ""),
            date: String(item.data().date ?? ""),
            note: String(item.data().note ?? ""),
          })),
        );
        markLoaded();
      },
      () => {
        setError("We could not load transactions. Check your Firestore rules.");
        markLoaded();
      },
    );
    const stopBills = onSnapshot(
      query(collection(monthSetup, "bills"), orderBy("dueDay")),
      (snapshot) => {
        setBills(
          snapshot.docs.map((item) => ({
            id: item.id,
            name: String(item.data().name ?? "Untitled"),
            amount: asAmount(item.data().amount),
            dueDay: Math.min(31, Math.max(1, Number(item.data().dueDay) || 1)),
          })),
        );
        markLoaded();
      },
      () => {
        setError(
          "We could not load recurring bills. Check your Firestore rules.",
        );
        markLoaded();
      },
    );
    return () => {
      stopCurrency();
      stopSettings();
      stopCategories();
      stopTransactions();
      stopBills();
    };
  }, [firestore, isAdmin, month, user]);

  const monthTransactions = useMemo(
    () => transactions.filter((item) => item.date.startsWith(month)),
    [month, transactions],
  );
  const money = useMemo<MoneyFormatter>(() => {
    if (currency === "NRS") {
      const formatter = new Intl.NumberFormat("en-US", {
        maximumFractionDigits: 2,
      });
      return { format: (value) => `Rs ${formatter.format(value)}` };
    }
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency,
      maximumFractionDigits: currency === "JPY" || currency === "KRW" ? 0 : 2,
    });
  }, [currency]);
  const spent = monthTransactions.reduce(
    (total, item) => total + item.amount,
    0,
  );
  const planned = categories.reduce((total, item) => total + item.limit, 0);
  const recurring = bills.reduce((total, item) => total + item.amount, 0);
  const chartSlices = useMemo(
    () =>
      Object.entries(
        monthTransactions.reduce<Record<string, number>>(
          (totals, transaction) => {
            const name =
              categories.find(
                (category) => category.id === transaction.categoryId,
              )?.name ?? "Deleted category";
            totals[name] = (totals[name] ?? 0) + transaction.amount;
            return totals;
          },
          {},
        ),
      )
        .map(([name, amount]) => ({ name, amount }))
        .sort((left, right) => right.amount - left.amount),
    [categories, monthTransactions],
  );
  const spendingByType = useMemo(
    () =>
      monthTransactions.reduce(
        (totals, transaction) => {
          const type =
            categories.find(
              (category) => category.id === transaction.categoryId,
            )?.type ?? "needs";
          totals[type] += transaction.amount;
          return totals;
        },
        { needs: 0, wants: 0 },
      ),
    [categories, monthTransactions],
  );
  const settings =
    firestore && user
      ? doc(firestore, "users", user.uid, "budget", "settings")
      : null;
  const monthSetup = settings ? doc(settings, "months", month) : null;

  async function saveIncome(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!monthSetup || pendingAction) return;
    setPendingAction("income");
    try {
      await setDoc(monthSetup, { income }, { merge: true });
    } catch {
      setError("We could not save income. Check your Firestore rules.");
    } finally {
      setPendingAction(null);
    }
  }
  async function saveCurrency(nextCurrency: Currency) {
    if (!settings || pendingAction || nextCurrency === currency) return;
    setPendingAction("income");
    try {
      await setDoc(
        settings,
        { currency: nextCurrency === "NRS" ? "NPR" : nextCurrency },
        { merge: true },
      );
    } catch {
      setError("We could not save the currency. Check your Firestore rules.");
    } finally {
      setPendingAction(null);
    }
  }
  async function addCategory(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!settings || !categoryName.trim() || pendingAction) return;
    setPendingAction("category");
    try {
      await addDoc(collection(settings, "categories"), {
        name: categoryName.trim(),
        limit: asAmount(categoryLimit),
        type: categoryType,
      });
      setCategoryName("");
      setCategoryLimit("");
      setCategoryType("needs");
    } catch {
      setError("We could not add that category. Check your Firestore rules.");
    } finally {
      setPendingAction(null);
    }
  }
  async function updateCategory(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (
      !settings ||
      !categoryToEdit ||
      !editedCategoryName.trim() ||
      pendingAction
    )
      return;
    setPendingAction("category");
    try {
      await updateDoc(doc(settings, "categories", categoryToEdit), {
        name: editedCategoryName.trim(),
        limit: asAmount(editedCategoryLimit),
        type: editedCategoryType,
      });
      setCategoryToEdit("");
      setEditedCategoryName("");
      setEditedCategoryLimit("");
      setEditedCategoryType("needs");
    } catch {
      setError(
        "We could not update that category. Check your Firestore rules.",
      );
    } finally {
      setPendingAction(null);
    }
  }
  async function addExpense(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (
      !settings ||
      !expenseCategory ||
      asAmount(expenseAmount) <= 0 ||
      pendingAction
    )
      return;
    setPendingAction("expense");
    try {
      const expense = {
        amount: asAmount(expenseAmount),
        categoryId: expenseCategory,
        date: expenseDate,
        note: expenseNote.trim(),
      };
      if (editingTransaction)
        await updateDoc(
          doc(settings, "transactions", editingTransaction.id),
          expense,
        );
      else await addDoc(collection(settings, "transactions"), expense);
      setExpenseAmount("");
      setExpenseNote("");
      setEditingTransaction(null);
    } catch {
      setError("We could not save that expense. Check your Firestore rules.");
    } finally {
      setPendingAction(null);
    }
  }
  async function addBill(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (
      !monthSetup ||
      !billName.trim() ||
      asAmount(billAmount) <= 0 ||
      pendingAction
    )
      return;
    setPendingAction("bill");
    try {
      await addDoc(collection(monthSetup, "bills"), {
        name: billName.trim(),
        amount: asAmount(billAmount),
        dueDay: Math.min(31, Math.max(1, Number(billDueDay) || 1)),
      });
      setBillName("");
      setBillAmount("");
      setBillDueDay("");
    } catch {
      setError("We could not add that bill. Check your Firestore rules.");
    } finally {
      setPendingAction(null);
    }
  }
  async function updateBill(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (
      !monthSetup ||
      !billToEdit ||
      !editedBillName.trim() ||
      asAmount(editedBillAmount) <= 0 ||
      pendingAction
    )
      return;
    setPendingAction("bill");
    try {
      await updateDoc(doc(monthSetup, "bills", billToEdit), {
        name: editedBillName.trim(),
        amount: asAmount(editedBillAmount),
        dueDay: Math.min(31, Math.max(1, Number(editedBillDueDay) || 1)),
      });
      setBillToEdit("");
      setEditedBillName("");
      setEditedBillAmount("");
      setEditedBillDueDay("1");
    } catch {
      setError("We could not update that bill. Check your Firestore rules.");
    } finally {
      setPendingAction(null);
    }
  }
  async function deleteItem() {
    if (!deletionTarget || pendingAction) return;
    const item = deletionTarget;
    const target = item.group === "bills" ? monthSetup : settings;
    if (!target) return;
    setPendingAction("delete");
    try {
      await deleteDoc(doc(target, item.group, item.id));
      setDeletionTarget(null);
    } catch {
      setError("We could not remove that item. Check your Firestore rules.");
      setDeletionTarget(null);
    } finally {
      setPendingAction(null);
    }
  }

  if (isLoading)
    return (
      <>
        <SiteHeader />
        <main className="min-h-[calc(100dvh-3.5rem)]" />
      </>
    );
  if (!user || !isAdmin || !firestore)
    return (
      <>
        <SiteHeader />
        <main className="mx-auto max-w-5xl px-4 py-12 text-sm text-[var(--muted)]">
          This page is only available to the admin.
        </main>
      </>
    );
  if (isMonthLoading)
    return (
      <>
        <SiteHeader />
        <BudgetSkeleton />
      </>
    );

  return (
    <>
      <SiteHeader />
      <main className="mx-auto flex w-full min-w-0 max-w-5xl flex-col overflow-x-clip px-4 py-8 sm:px-6 sm:py-12">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[var(--accent)]">
              Admin tool
            </p>
            <h1 className="mt-1 text-3xl font-semibold text-[var(--text)]">
              Budget
            </h1>
            <p className="mt-2 text-sm text-[var(--muted)]">
              Track spending and what remains safe to use.
            </p>
          </div>
          <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:items-center">
            <label className="flex items-center justify-between gap-2 rounded-full bg-[var(--elevated)] px-3 py-1.5 text-sm text-[var(--muted)] sm:justify-start">
              <span>Currency</span>
              <select
                value={currency}
                onChange={(event) =>
                  void saveCurrency(event.target.value as Currency)
                }
                disabled={Boolean(pendingAction)}
                className="bg-transparent text-[var(--text)] outline-none disabled:opacity-50"
              >
                {currencies.map((item) => (
                  <option key={item} value={item}>
                    {currencyLabels[item]}
                  </option>
                ))}
              </select>
            </label>
            <label className="flex items-center justify-between gap-2 rounded-full bg-[var(--elevated)] px-3 py-1.5 text-sm text-[var(--muted)] sm:justify-start">
              <span>Month</span>
              <input
                type="month"
                value={month}
                onChange={(event) => {
                  const nextMonth = event.target.value;
                  setIsMonthLoading(true);
                  setExpenseDate(`${nextMonth}-01`);
                  setMonth(nextMonth);
                }}
                className="bg-transparent text-[var(--text)] outline-none"
              />
            </label>
          </div>
        </div>
        <section className="order-1 mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Summary
            label="Monthly income"
            value={income}
            hint="Set your monthly amount below"
            money={money}
          />
          <Summary
            label="Spent this month"
            value={spent}
            hint={`${monthTransactions.length} transactions`}
            money={money}
            className="text-red-500"
          />
          <Summary
            label="Available to spend"
            value={income - spent - recurring}
            hint="After spending and recurring bills"
            money={money}
            className={
              income - spent - recurring < 0 ? "text-red-500" : "text-[var(--accent)]"
            }
          />
          <Summary
            label="Recurring bills"
            value={recurring}
            hint={`${bills.length} planned each month`}
            money={money}
          />
        </section>
        <SpendingChart slices={chartSlices} total={spent} money={money} />
        <BudgetPlan
          income={income}
          needs={spendingByType.needs}
          wants={spendingByType.wants}
          money={money}
        />
        <button type="button" onClick={() => setIsRetirementOpen(true)} className="order-2 mt-4 cursor-pointer self-start text-sm font-medium text-[var(--accent)] hover:underline">Plan retirement savings</button>
        <section className="hidden">
          <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5">
            <h2 className="text-lg font-semibold text-[var(--text)]">
              Edit category
            </h2>
            <form
              onSubmit={updateCategory}
              className="mt-4 grid gap-2 sm:grid-cols-2"
            >
              <select
                value={categoryToEdit}
                onChange={(event) => {
                  const item = categories.find(
                    (category) => category.id === event.target.value,
                  );
                  setCategoryToEdit(event.target.value);
                  setEditedCategoryName(item?.name ?? "");
                  setEditedCategoryLimit(item ? String(item.limit) : "");
                }}
                className="sm:col-span-2 rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm text-[var(--text)]"
              >
                <option value="">Choose category</option>
                {categories.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.name}
                  </option>
                ))}
              </select>
              <input
                value={editedCategoryName}
                onChange={(event) => setEditedCategoryName(event.target.value)}
                disabled={!categoryToEdit}
                placeholder="Category name"
                className="min-w-0 rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm text-[var(--text)] disabled:opacity-50"
              />
              <input
                type="number"
                min="0"
                value={editedCategoryLimit}
                onChange={(event) => setEditedCategoryLimit(event.target.value)}
                disabled={!categoryToEdit}
                placeholder="Limit"
                className="min-w-0 rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm text-[var(--text)] disabled:opacity-50"
              />
              <button
                disabled={!categoryToEdit}
                className="sm:col-span-2 rounded-lg bg-[var(--accent)] px-4 py-2 text-sm font-semibold text-[var(--accent-fg)] disabled:opacity-50"
              >
                Save category
              </button>
            </form>
          </div>
          <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5">
            <h2 className="text-lg font-semibold text-[var(--text)]">
              Edit recurring bill
            </h2>
            <form
              onSubmit={updateBill}
              className="mt-4 grid gap-2 sm:grid-cols-2"
            >
              <select
                value={billToEdit}
                onChange={(event) => {
                  const item = bills.find(
                    (bill) => bill.id === event.target.value,
                  );
                  setBillToEdit(event.target.value);
                  setEditedBillName(item?.name ?? "");
                  setEditedBillAmount(item ? String(item.amount) : "");
                  setEditedBillDueDay(item ? String(item.dueDay) : "1");
                }}
                className="sm:col-span-2 rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm text-[var(--text)]"
              >
                <option value="">Choose recurring bill</option>
                {bills.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.name}
                  </option>
                ))}
              </select>
              <input
                value={editedBillName}
                onChange={(event) => setEditedBillName(event.target.value)}
                disabled={!billToEdit}
                placeholder="Bill name"
                className="min-w-0 rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm text-[var(--text)] disabled:opacity-50"
              />
              <input
                type="number"
                min="1"
                value={editedBillAmount}
                onChange={(event) => setEditedBillAmount(event.target.value)}
                disabled={!billToEdit}
                placeholder="Amount"
                className="min-w-0 rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm text-[var(--text)] disabled:opacity-50"
              />
              <input
                type="number"
                min="1"
                max="31"
                value={editedBillDueDay}
                onChange={(event) => setEditedBillDueDay(event.target.value)}
                disabled={!billToEdit}
                aria-label="Due day"
                className="min-w-0 rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm text-[var(--text)] disabled:opacity-50"
              />
              <button
                disabled={!billToEdit}
                className="rounded-lg bg-[var(--accent)] px-4 py-2 text-sm font-semibold text-[var(--accent-fg)] disabled:opacity-50"
              >
                Save bill
              </button>
            </form>
          </div>
        </section>
        {error && (
          <p className="mt-5 rounded-xl bg-red-500/10 px-4 py-3 text-sm text-red-600">
            {error}
          </p>
        )}
        <section className="order-5 mt-8 grid gap-6 lg:grid-cols-2">
          <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5">
            <h2 className="text-lg font-semibold text-[var(--text)]">
              Monthly take-home income
            </h2>
            <form onSubmit={saveIncome} className="mt-4 flex gap-2">
              <input
                type="number"
                min="0"
                value={income || ""}
                onChange={(event) => setIncome(asAmount(event.target.value))}
                placeholder="Monthly income"
                className="min-w-0 flex-1 rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm text-[var(--text)]"
              />
              <button className="rounded-lg bg-[var(--accent)] px-4 text-sm font-semibold text-[var(--accent-fg)]">
                Save
              </button>
            </form>
            <p className="mt-3 text-xs text-[var(--faint)]">
              Currency is {currencyNames[currency]}.
            </p>
          </div>
          <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5">
            <h2 className="text-lg font-semibold text-[var(--text)]">
              {billToEdit ? "Edit recurring bill" : "Add recurring bill"}
            </h2>
            <form
              onSubmit={billToEdit ? updateBill : addBill}
              className="mt-4 grid gap-2 sm:grid-cols-2"
            >
              <input
                ref={billEditorRef}
                value={billToEdit ? editedBillName : billName}
                onChange={(event) =>
                  billToEdit
                    ? setEditedBillName(event.target.value)
                    : setBillName(event.target.value)
                }
                placeholder="Rent or subscription"
                className="min-w-0 rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm text-[var(--text)]"
              />
              <input
                type="number"
                min="1"
                value={billToEdit ? editedBillAmount : billAmount}
                onChange={(event) =>
                  billToEdit
                    ? setEditedBillAmount(event.target.value)
                    : setBillAmount(event.target.value)
                }
                placeholder="Amount"
                className="min-w-0 rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm text-[var(--text)]"
              />
              <input
                type="number"
                min="1"
                max="31"
                value={billToEdit ? editedBillDueDay : billDueDay}
                onChange={(event) =>
                  billToEdit
                    ? setEditedBillDueDay(event.target.value)
                    : setBillDueDay(event.target.value)
                }
                placeholder="Due day"
                aria-label="Due day"
                className="min-w-0 rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm text-[var(--text)]"
              />
              <button className="rounded-lg border border-[var(--border)] px-3 py-2 text-sm font-semibold text-[var(--text)]">
                {billToEdit ? "Save changes" : "Add"}
              </button>
            </form>
          </div>
        </section>
        <section className="order-4 mt-6 grid gap-6 lg:grid-cols-[1.1fr_.9fr]">
          <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-[var(--text)]">
                {editingTransaction ? "Edit spending" : "Spending"}
              </h2>
              <span className="text-sm text-[var(--muted)]">
                {money.format(spent)}
              </span>
            </div>
            <form
              onSubmit={addExpense}
              className="mt-4 grid gap-2 sm:grid-cols-2"
            >
              <input
                ref={expenseEditorRef}
                type="number"
                min="1"
                value={expenseAmount}
                onChange={(event) => setExpenseAmount(event.target.value)}
                placeholder="Amount"
                className="rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm text-[var(--text)]"
              />
              <select
                value={expenseCategory}
                onChange={(event) => setExpenseCategory(event.target.value)}
                className="rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm text-[var(--text)]"
              >
                <option value="">Choose category</option>
                {categories.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.name}
                  </option>
                ))}
              </select>
              <input
                type="date"
                min={`${month}-01`}
                max={monthEnd(month)}
                value={expenseDate}
                onChange={(event) => setExpenseDate(event.target.value)}
                className="rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm text-[var(--text)]"
              />
              <input
                value={expenseNote}
                onChange={(event) => setExpenseNote(event.target.value)}
                placeholder="Note, optional"
                className="rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm text-[var(--text)]"
              />
              <div className="flex gap-2 sm:col-span-2">
                <button
                  disabled={!categories.length}
                  className="flex-1 rounded-lg bg-[var(--accent)] px-4 py-2 text-sm font-semibold text-[var(--accent-fg)] disabled:opacity-50"
                >
                  {editingTransaction ? "Save changes" : "Add expense"}
                </button>
                {editingTransaction && (
                  <button
                    type="button"
                    onClick={() => {
                      setEditingTransaction(null);
                      setExpenseAmount("");
                      setExpenseCategory("");
                      setExpenseDate(`${month}-01`);
                      setExpenseNote("");
                    }}
                    className="rounded-lg border border-[var(--border)] px-4 py-2 text-sm font-semibold text-[var(--text)]"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </form>
            <ul className="mt-5 divide-y divide-[var(--border)]">
              {monthTransactions.length ? (
                monthTransactions.map((item) => (
                  <li
                    key={item.id}
                    className="flex flex-wrap items-center gap-3 py-3 text-sm sm:flex-nowrap"
                  >
                    <div className="min-w-0 w-full sm:w-auto sm:flex-1">
                      <p className="truncate font-medium text-[var(--text)]">
                        {categories.find(
                          (category) => category.id === item.categoryId,
                        )?.name ?? "Deleted category"}
                      </p>
                      <p className="truncate text-xs text-[var(--faint)]">
                        {item.date}
                        {item.note ? ` · ${item.note}` : ""}
                      </p>
                    </div>
                    <span className="font-medium text-[var(--text)]">
                      {money.format(item.amount)}
                    </span>
                    <button
                      onClick={() => {
                        setEditingTransaction(item);
                        setExpenseAmount(String(item.amount));
                        setExpenseCategory(item.categoryId);
                        setExpenseDate(item.date);
                        setExpenseNote(item.note);
                      }}
                      aria-label="Edit expense"
                      title="Edit expense"
                      className="cursor-pointer rounded p-1 text-[var(--accent)] hover:bg-[var(--elevated)]"
                    >
                      <PencilIcon />
                    </button>
                    <button
                      onClick={() =>
                        setDeletionTarget({
                          group: "transactions",
                          id: item.id,
                          name: "this expense",
                        })
                      }
                      aria-label="Delete expense"
                      title="Delete expense"
                      className="cursor-pointer rounded p-1 text-red-500 hover:bg-red-500/10"
                    >
                      <TrashIcon />
                    </button>
                  </li>
                ))
              ) : (
                <li className="py-8 text-center text-sm text-[var(--muted)]">
                  No expenses recorded this month.
                </li>
              )}
            </ul>
          </div>
          <div className="space-y-6">
            <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5">
              <h2 className="text-lg font-semibold text-[var(--text)]">
                Categories
              </h2>
              <form
                onSubmit={categoryToEdit ? updateCategory : addCategory}
                className="mt-4 grid grid-cols-[minmax(0,1fr)_auto_auto] gap-2 sm:flex"
              >
                <input
                  ref={categoryEditorRef}
                  value={categoryToEdit ? editedCategoryName : categoryName}
                  onChange={(event) =>
                    categoryToEdit
                      ? setEditedCategoryName(event.target.value)
                      : setCategoryName(event.target.value)
                  }
                  placeholder="Groceries"
                  className="col-span-full min-w-0 flex-1 rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm text-[var(--text)] sm:col-auto"
                />
                <input
                  type="number"
                  min="0"
                  value={categoryToEdit ? editedCategoryLimit : categoryLimit}
                  onChange={(event) =>
                    categoryToEdit
                      ? setEditedCategoryLimit(event.target.value)
                      : setCategoryLimit(event.target.value)
                  }
                  placeholder="Limit"
                  className="w-full rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm text-[var(--text)] sm:w-24"
                />
                <select
                    value={categoryToEdit ? editedCategoryType : categoryType}
                    onChange={(event) =>
                      categoryToEdit ? setEditedCategoryType(event.target.value as "needs" | "wants") : setCategoryType(event.target.value as "needs" | "wants")
                    }
                    className="rounded-lg border border-[var(--border)] bg-[var(--background)] px-2 text-sm text-[var(--text)]"
                  >
                    <option value="needs">Need</option>
                    <option value="wants">Want</option>
                  </select>
                <button className="rounded-lg border border-[var(--border)] px-3 text-sm font-semibold text-[var(--text)]">
                  {categoryToEdit ? "Save changes" : "Add"}
                </button>
              </form>
              <p className="mt-3 text-xs text-[var(--faint)]">
                Planned total: {money.format(planned)}
              </p>
              <ul className="mt-3 divide-y divide-[var(--border)]">
                {categories.map((item) => {
                  const categorySpent = monthTransactions
                    .filter((transaction) => transaction.categoryId === item.id)
                    .reduce(
                      (total, transaction) => total + transaction.amount,
                      0,
                    );
                  const left = item.limit - categorySpent;
                  return (
                    <li
                      key={item.id}
                      className="flex flex-wrap items-center gap-3 py-3 text-sm sm:flex-nowrap"
                    >
                      <div className="min-w-0 w-full sm:w-auto sm:flex-1">
                        <p className="truncate font-medium text-[var(--text)]">
                          {item.name}
                        </p>
                        <p
                          className={
                            left < 0
                              ? "text-xs text-red-500"
                              : "text-xs text-[var(--faint)]"
                          }
                        >
                          {money.format(categorySpent)} spent ·{" "}
                          {money.format(left)} left
                        </p>
                      </div>
                      <button
                        onClick={() => {
                          setCategoryToEdit(item.id);
                          setEditedCategoryName(item.name);
                          setEditedCategoryLimit(String(item.limit));
                          setEditedCategoryType(item.type);
                          requestAnimationFrame(() => {
                            categoryEditorRef.current?.scrollIntoView({
                              behavior: "smooth",
                              block: "center",
                            });
                            categoryEditorRef.current?.focus({
                              preventScroll: true,
                            });
                          });
                        }}
                        aria-label={`Edit ${item.name}`}
                        title="Edit category"
                        className="cursor-pointer rounded p-1 text-[var(--accent)] hover:bg-[var(--elevated)]"
                      >
                        <PencilIcon />
                      </button>
                      <button
                        onClick={() =>
                          setDeletionTarget({
                            group: "categories",
                            id: item.id,
                            name: item.name,
                          })
                        }
                        aria-label={`Delete ${item.name}`}
                        title="Delete category"
                        className="cursor-pointer rounded p-1 text-red-500 hover:bg-red-500/10"
                      >
                        <TrashIcon />
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
            <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5">
              <h2 className="text-lg font-semibold text-[var(--text)]">
                Recurring bills
              </h2>
              <ul className="mt-3 divide-y divide-[var(--border)]">
                {bills.length ? (
                  bills.map((item) => (
                    <li
                      key={item.id}
                      className="flex flex-wrap items-center gap-3 py-3 text-sm sm:flex-nowrap"
                    >
                      <div className="min-w-0 w-full sm:w-auto sm:flex-1">
                        <p className="truncate font-medium text-[var(--text)]">
                          {item.name}
                        </p>
                        <p className="text-xs text-[var(--faint)]">
                          Due on day {item.dueDay}
                        </p>
                      </div>
                      <span className="text-[var(--text)]">
                        {money.format(item.amount)}
                      </span>
                      <button
                        onClick={() => {
                          setBillToEdit(item.id);
                          setEditedBillName(item.name);
                          setEditedBillAmount(String(item.amount));
                          setEditedBillDueDay(String(item.dueDay));
                          requestAnimationFrame(() => {
                            billEditorRef.current?.scrollIntoView({
                              behavior: "smooth",
                              block: "center",
                            });
                            billEditorRef.current?.focus({
                              preventScroll: true,
                            });
                          });
                        }}
                        aria-label={`Edit ${item.name}`}
                        title="Edit recurring bill"
                        className="cursor-pointer rounded p-1 text-[var(--accent)] hover:bg-[var(--elevated)]"
                      >
                        <PencilIcon />
                      </button>
                      <button
                        onClick={() =>
                          setDeletionTarget({
                            group: "bills",
                            id: item.id,
                            name: item.name,
                          })
                        }
                        aria-label={`Delete ${item.name}`}
                        title="Delete recurring bill"
                        className="cursor-pointer rounded p-1 text-red-500 hover:bg-red-500/10"
                      >
                        <TrashIcon />
                      </button>
                    </li>
                  ))
                ) : (
                  <li className="py-5 text-sm text-[var(--muted)]">
                    No recurring bills yet.
                  </li>
                )}
              </ul>
            </div>
          </div>
        </section>
      </main>
      {isRetirementOpen && <RetirementPlanner money={money} onClose={() => setIsRetirementOpen(false)} />}
      {pendingAction && pendingAction !== "delete" && (
        <div
          aria-hidden="true"
          className="fixed inset-0 z-30 cursor-wait bg-black/5"
        />
      )}
      {pendingAction && (
        <div
          role="status"
          className="fixed bottom-5 right-5 z-40 flex items-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--surface)] px-4 py-3 text-sm font-medium text-[var(--text)] shadow-xl"
        >
          <span className="h-3 w-3 animate-spin rounded-full border-2 border-[var(--accent)] border-t-transparent" />
          {pendingAction === "delete" ? "Deleting…" : "Saving…"}
        </div>
      )}
      <DeleteConfirmModal
        target={deletionTarget}
        isDeleting={pendingAction === "delete"}
        onCancel={() => setDeletionTarget(null)}
        onConfirm={() => void deleteItem()}
      />
    </>
  );
}
