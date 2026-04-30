import type { RoadmapDayDetail } from "@/lib/challenge-data";

/** Day 7 — Building forms (~1h): native forms, controlled inputs, RHF, Zod, submit UX, Expense Tracker project. */
export const REACT_DAY_7_DETAIL: RoadmapDayDetail = {
  overview: [
    {
      en: "Day 7 connects **user input** to **React state** safely: building a **form**, handling **submit**, reading fields with **refs or controlled values**, then scaling with **React Hook Form** and **Zod** for validation and **disabled submit** states. The second half is an **Expense Tracker** mini-project — list, filter, form, schema wiring, and **adding expenses** immutably.",
      np: "दिन ७ **प्रयोगकर्ता इनपुट** लाई **React state** सँग: **फर्म**, **submit**, **controlled**, **React Hook Form**, **Zod**, **submit disable**। पछि **Expense Tracker** — सूची, फिल्टर, फर्म, schema, **खर्च थप**।",
      jp: "7日目は**フォーム**を中心に、**送信**・**入力の扱い**・**制御コンポーネント**から **React Hook Form** と **Zod**、**送信ボタンの無効化**まで進みます。後半は **Expense Tracker** で一覧・フィルタ・フォーム・スキーマ連携・**追加**をまとめます。",
    },
    {
      en: "Playlist totals about **one hour**; timestamps in headings (**0m24s** through **~3m35s** on adding an expense) are **pacing hints**.",
      np: "प्लेलिस्ट **~१ घण्टा**; शीर्षकमा समय **संकेत** मात्र।",
      jp: "再生時間は **約1時間**。見出しの時間は**目安**です。",
    },
  ],
  sections: [
    {
      title: {
        en: "Introduction (~0m 24s)",
        np: "परिचय (~०m २४s)",
        jp: "イントロ（約 0m24s）",
      },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "Forms bridge **HTML semantics** (`<form>`, `<label>`, `name`, `type`) with **application state**. Goals: **accessible** controls, **predictable** submit handling, **validation feedback** before or after submit, and **clear ownership** of field values (controlled vs uncontrolled).",
            np: "फर्मले **HTML semantics** र **app state** जोड्छ। लक्ष्य: **पहुँच**, **पूर्वानुमेय submit**, **validation**, **मानको मालिक** (controlled/uncontrolled)।",
            jp: "フォームは **HTML の意味** と **アプリの状態** をつなぎます。**アクセシビリティ**、**送信の流れ**、**検証**、値の持ち方（制御／非制御）を揃えます。",
          },
        },
      ],
    },
    {
      title: {
        en: "Building a form (~3m 45s)",
        np: "फर्म बनाउँदै (~३m ४५s)",
        jp: "フォームを作る（約 3m45s）",
      },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "Wrap inputs in **`<form>`**, associate **`<label htmlFor>`** with matching **`id`** on controls, and give submit actions **`type=\"submit\"`** (other buttons default to **`type=\"button\"`** inside the form to avoid accidental submits).",
            np: "**`<form>`** भित्र इनपुट; **`<label htmlFor>`** र **`id`** मेल; submit **`type=\"submit\"`**; अरू **`type=\"button\"`**।",
            jp: "**`<form>`** で囲み、**`<label htmlFor>`** と **`id`** を対応させます。送信は **`type=\"submit\"`**、それ以外のボタンは **`type=\"button\"`** にします。",
          },
        },
      ],
    },
    {
      title: {
        en: "Handling form submission (~2m 23s)",
        np: "फर्म submit (~२m २३s)",
        jp: "フォーム送信（約 2m23s）",
      },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "Listen with **`onSubmit` on the `<form>`** and call **`event.preventDefault()`** so the browser does not navigate away. Centralize side effects (**`fetch`**, analytics) in one handler; keep **validation** either inline or delegated to a schema library later.",
            np: "**`<form>` `onSubmit`** + **`preventDefault()`**। side effect (**`fetch`**) एक ठाउँ; **validation** पछि schema।",
            jp: "**`<form onSubmit>`** で **`preventDefault()`** し、ページ遷移を防ぎます。副作用は一箇所にまとめます。",
          },
        },
      ],
    },
    {
      title: {
        en: "Accessing input fields (~5m 46s)",
        np: "इनपुट फिल्ड पहुँच (~५m ४६s)",
        jp: "入力フィールドへのアクセス（約 5m46s）",
      },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "**Uncontrolled:** read **`event.currentTarget.elements`** or attach **`useRef`** to inputs and read `.value` on submit.**Controlled:** store each value in **`useState`** and drive **`value` + `onChange`**. Controlled scales better with **instant validation**; uncontrolled is fine for simple forms.",
            np: "**Uncontrolled:** `elements` वा `useRef`। **Controlled:** `useState` + `value`/`onChange`। जटिलमा controlled।",
            jp: "**非制御**は `elements` や **ref**。**制御**は state と **`value` / `onChange`**。リアルタイム検証なら制御が向きます。",
          },
        },
      ],
    },
    {
      title: {
        en: "Controlled components (~4m 33s)",
        np: "नियन्त्रित कम्पोनेन्ट (~४m ३३s)",
        jp: "制御コンポーネント（約 4m33s）",
      },
      blocks: [
        {
          type: "code",
          title: {
            en: "Minimal controlled text field",
            np: "न्यूनतम controlled text",
            jp: "制御テキスト例",
          },
          code: `const [title, setTitle] = useState(\"\");

<input
  id=\"title\"
  name=\"title\"
  value={title}
  onChange={(e) => setTitle(e.target.value)}
/>`,
        },
      ],
    },
    {
      title: {
        en: "Managing forms with React Hook Form (~4m 33s)",
        np: "React Hook Form (~४m ३३s)",
        jp: "React Hook Form（約 4m33s）",
      },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "**RHF** minimizes re-renders by registering **refs** to inputs while still supporting **validation** and **watch**. Typical API: **`useForm`**, **`register`**, **`handleSubmit(onValid, onInvalid)`**, **`formState.errors`**. Use **`Controller`** for custom components (rich selects, third-party inputs) that do not forward a native ref cleanly.",
            np: "**RHF** — कम re-render, **`useForm`**, **`register`**, **`handleSubmit`**, **`errors`**। **Controller** custom इनपुटको लागि।",
            jp: "**RHF** は **`useForm`**・**`register`**・**`handleSubmit`**・**`formState`** を中心にします。**`Controller`** はカスタム入力向けです。",
          },
        },
        {
          type: "code",
          title: {
            en: "Sketch — useForm + register",
            np: "useForm + register",
            jp: "useForm の骨子",
          },
          code: `import { useForm } from "react-hook-form";

export function QuickForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  return (
    <form onSubmit={handleSubmit((data) => console.log(data))}>
      <input {...register(\"email\", { required: true })} />
      {errors.email ? <p role=\"alert\">Required</p> : null}
      <button type=\"submit\">Save</button>
    </form>
  );
}`,
        },
      ],
    },
    {
      title: {
        en: "Applying validation (~5m 38s)",
        np: "validation लागू (~५m ३८s)",
        jp: "バリデーションの適用（約 5m38s）",
      },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "Combine **field-level rules** (`required`, `minLength`, `pattern`) with **form-level checks** (two fields must match). Surface errors next to fields with **`aria-describedby`** pointing at error ids for screen readers.",
            np: "**फिल्ड-स्तर** नियम + **फर्म-स्तर** जाँच। त्रुटि **`aria-describedby`** सहित।",
            jp: "**フィールド単位**のルールと、**フォーム全体**の条件を組み合わせます。**`aria-describedby`** でエラーを関連付けます。",
          },
        },
      ],
    },
    {
      title: {
        en: "Schema-based validation with Zod (~7m 33s)",
        np: "Zod स्किमा (~७m ३३s)",
        jp: "Zod によるスキーマ検証（約 7m33s）",
      },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "Define a **`z.object({ ... })`** schema once, infer TypeScript types with **`z.infer<typeof schema>`**, and wire **`zodResolver(schema)`** from **`@hookform/resolvers/zod`** into **`useForm`**. Single source of truth for **client validation**; reuse similar shapes on the server with the same Zod module when possible.",
            np: "`z.object` + **`z.infer`** + **`zodResolver`**। **client validation** एक स्रोत; server मा पुन: प्रयोग।",
            jp: "**`z.object`** でスキーマを定義し、**`zodResolver`** を **`useForm`** に渡します。**`z.infer`** で型を揃え、可能ならサーバでも同じスキーマを再利用します。",
          },
        },
        {
          type: "code",
          title: {
            en: "Schema + resolver sketch",
            np: "स्किमा + resolver",
            jp: "スキーマと resolver",
          },
          code: `import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

const expenseSchema = z.object({
  description: z.string().min(1, \"Required\"),
  amount: z.coerce.number().positive(\"Must be positive\"),
  category: z.enum([\"food\", \"travel\", \"utilities\"]),
});

export type ExpenseInput = z.infer<typeof expenseSchema>;

export function useExpenseForm() {
  return useForm<ExpenseInput>({
    resolver: zodResolver(expenseSchema),
    defaultValues: { description: \"\", amount: 0, category: \"food\" },
  });
}`,
        },
      ],
    },
    {
      title: {
        en: "Disabling the submit button (~0m 45s)",
        np: "submit बटन असक्षम (~०m ४५s)",
        jp: "送信ボタンを無効化（約 0m45s）",
      },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "Disable while **`isSubmitting`** is true to prevent double posts, and optionally when **`!formState.isValid`** if you validate **on change / on blur**. Pair with **`aria-busy`** or a spinner on the button for clarity.",
            np: "**`isSubmitting`** मा disable; **`!isValid`** वैकल्पिक। **`aria-busy`** / spinner।",
            jp: "**`isSubmitting`** 中は二重送信を防ぐため無効化し、**`isValid`** と組み合わせることもあります。**`aria-busy`** やスピナーで状態を示します。",
          },
        },
      ],
    },
    {
      title: {
        en: "Project — Expense Tracker intro (~1m 23s)",
        np: "परियोजना — Expense Tracker (~१m २३s)",
        jp: "プロジェクト：Expense Tracker（約 1m23s）",
      },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "The project stitches **three regions**: a **list** of expenses, a **filter** (category or text), and a **create form**. **Lift expenses state** in `App` (or a context provider) so list + filter + form stay synchronized after each add.",
            np: "तीन खण्ड: **सूची**, **फिल्टर**, **फर्म**। **expenses state** `App` मा lift — थप पछि sync।",
            jp: "**一覧**・**フィルタ**・**作成フォーム**の三つをつなぎます。**`App` などで expenses を持ち上げ**、追加後も一覧と連動させます。",
          },
        },
      ],
    },
    {
      title: {
        en: "Building ExpenseList (~10m 28s)",
        np: "ExpenseList (~१०m २८s)",
        jp: "ExpenseList（約 10m28s）",
      },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "Render **`expenses.map`** to rows; pass **`key={expense.id}`**; show amount with **tabular numerals** (`className=\"tabular-nums\"`) for alignment. Empty state messaging helps first-time users.",
            np: "`map` + **`key=id`**। रकम **tabular-nums**। खाली सूची सन्देश।",
            jp: "**`expenses.map`** で行を描画し、**`key`** は安定した **id** にします。金額は **`tabular-nums`** で揃えると読みやすいです。",
          },
        },
      ],
    },
    {
      title: {
        en: "Building ExpenseFilter (~5m 51s)",
        np: "ExpenseFilter (~५m ५१s)",
        jp: "ExpenseFilter（約 5m51s）",
      },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "Store **filter criteria in parent state** and derive **`visibleExpenses`** with **`useMemo`** (or inline filter) from `expenses` + criteria. Pass **`value` + `onChange`** so the filter stays controlled.",
            np: "**filter state** अभिभावकमा; **`visibleExpenses`** `useMemo`। **controlled** `value`/`onChange`।",
            jp: "**フィルタ条件は親の state** に置き、**`useMemo`** で `visibleExpenses` を派生させます。入力は **制御**にします。",
          },
        },
      ],
    },
    {
      title: {
        en: "Building the Expense form (~4m 36s)",
        np: "Expense फर्म (~४m ३६s)",
        jp: "Expense フォーム（約 4m36s）",
      },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "Fields typically include **description**, **amount** (number input with **`step`** / **`inputMode=\"decimal\"`** hints), and **category** (`<select>` or radio group). Reset partially after submit with **`reset`** from RHF or manual `setValue` calls.",
            np: "**description**, **amount** (number), **category**। submit पछि **`reset`** वा `setValue`।",
            jp: "**説明・金額・カテゴリ** をそろえ、数値は **`inputMode`** などで入力しやすくします。送信後は **`reset`** で初期化します。",
          },
        },
      ],
    },
    {
      title: {
        en: "Integrating React Hook Form and Zod (~9m 54s)",
        np: "RHF + Zod (~९m ५४s)",
        jp: "RHF と Zod の連携（約 9m54s）",
      },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "Share **`ExpenseInput`** types between **`useForm<ExpenseInput>`** and your **`onSubmit`** handler. Map **`fieldErrors`** from RHF to UI with **`{...register(\"amount\")}`** error text under each control. Keep schema messages **user-facing** (short, actionable).",
            np: "**`ExpenseInput`** प्रकार साझा; **`register`** त्रुटि UI; सन्देश **प्रयोगकर्ता-मुखी**।",
            jp: "**`useForm<ExpenseInput>`** と **`onSubmit`** で型を共有し、**`register`** のエラーを各フィールド下に表示します。メッセージは**短く具体的**にします。",
          },
        },
      ],
    },
    {
      title: {
        en: "Adding an expense (~3m 35s)",
        np: "खर्च थप (~३m ३५s)",
        jp: "支出の追加（約 3m35s）",
      },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "On valid submit, **`setExpenses((prev) => [{ ...data, id: crypto.randomUUID() }, ...prev])`** (or server-returned id) so the list updates **immutably**. Clear the form and **focus** the first field or announce success for assistive tech.",
            np: "valid submit मा **`setExpenses` immutable** + `id`; फर्म reset; **focus** वा घोषणा।",
            jp: "**検証成功時**に **`setExpenses(prev => [newItem, ...prev])`** のように**イミュータブル**で追加します。**`crypto.randomUUID()`** などで一時 id を付け、フォームをリセットします。",
          },
        },
      ],
    },
  ],
  faq: [
    {
      question: {
        en: "Controlled vs uncontrolled — which should I default to?",
        np: "controlled बनाम uncontrolled?",
        jp: "制御と非制御、どちらをデフォルトに？",
      },
      answer: {
        en: "**Controlled** when you need **live validation**, **formatting**, or **dependent fields**. **Uncontrolled** is acceptable for **one-shot** forms where you only read values on submit and want less state wiring.",
        np: "**Controlled** — **जीवित validation/formatting**। **Uncontrolled** — **submit मात्र** पढ्न।",
        jp: "**ライブ検証や整形**が要るなら**制御**。送信時だけ読むなら**非制御**でも構いません。",
      },
    },
    {
      question: {
        en: "Why use React Hook Form instead of only `useState` for every field?",
        np: "प्रत्येक फिल्ड `useState` बिना RHF किन?",
        jp: "各フィールドを全部 useState ではダメ？",
      },
      answer: {
        en: "RHF **centralizes registration, validation, dirty/touched flags, and submit lifecycle** with fewer manual `useEffect`s. For **very small** forms, plain `useState` is fine — adopt RHF when boilerplate hurts.",
        np: "RHF ले **registration, validation, dirty/touched, submit** केन्द्रित। **सानो** फर्ममा `useState` मिल्छ।",
        jp: "RHF は **登録・検証・dirty・送信** をまとめます。**小さいフォーム**は `useState` のままでもよいです。",
      },
    },
    {
      question: {
        en: "Can Zod run on the server too?",
        np: "Zod server मा पनि?",
        jp: "Zod はサーバでも使える？",
      },
      answer: {
        en: "**Yes** — Zod is plain JavaScript. Share schemas between **client and server** (Node, Edge) to reject bad payloads before they hit the database. Never trust **client-only** validation for security.",
        np: "**हो** — Zod JS। **client+server** साझा schema। सुरक्षामा **client मात्र** विश्वास नगर्नुहोस्।",
        jp: "**使えます。** クライアントとサーバで**同じスキーマ**を共有しやすいです。**クライアントだけの検証は信頼しない**でください。",
      },
    },
    {
      question: {
        en: "What is `defaultValues` in `useForm`?",
        np: "`defaultValues` के हो?",
        jp: "`defaultValues` とは？",
      },
      answer: {
        en: "Initial values for **controlled RHF fields** and the baseline for **dirty** comparisons. Update with **`reset(newValues)`** after async loads or successful submit when you need a fresh form state.",
        np: "**सुरुवात मान** र **dirty** आधार। async पछि वा submit पछि **`reset`**।",
        jp: "**初期値**と **dirty** 判定の基準になります。取得後や送信後に **`reset`** で更新します。",
      },
    },
    {
      question: {
        en: "How do I validate a dependent field (confirm password)?",
        np: "निर्भर फिल्ड (confirm password)?",
        jp: "依存フィールド（確認用パスワード）は？",
      },
      answer: {
        en: "In Zod use **`.refine` or `.superRefine`** on the object schema. In RHF you can also **`watch`** one field inside another field’s `validate` rule — keep rules **pure** and fast.",
        np: "Zod मा **`.refine`**। RHF मा **`watch`**। नियम **शुद्ध** र छिटो।",
        jp: "Zod では **`.refine`** など。RHF では **`watch`** と組み合わせることもあります。",
      },
    },
    {
      question: {
        en: "Should ExpenseFilter run on every keystroke?",
        np: "ExpenseFilter हरेक keystroke?",
        jp: "ExpenseFilter は毎キー入力で動かす？",
      },
      answer: {
        en: "For small lists, **immediate filtering** is fine. For large data, **debounce** text filters or move filtering to a **memoized selector** / server query so typing stays smooth.",
        np: "सानो सूचीमा **तुरुन्त**। ठूलोमा **debounce** वा server query।",
        jp: "データが小さければそのままでよいです。**大きい場合は debounce** やサーバ検索を検討します。",
      },
    },
    {
      question: {
        en: "Why `crypto.randomUUID()` for client ids?",
        np: "client id मा `randomUUID` किन?",
        jp: "クライアントの id に randomUUID を使う理由は？",
      },
      answer: {
        en: "Collision-resistant ids until a **server assigns** canonical ids. If you optimistically render and later replace with server data, key stability matters — consider **temporary id + server id swap** patterns.",
        np: "collision कम जबसम्म **server id** आउँदैन। optimistic UI मा **id swap**।",
        jp: "**サーバ id が来るまで**の一時的な一意キーに向きます。後から差し替える場合は **キーの安定性**に注意します。",
      },
    },
    {
      question: {
        en: "What if `register` does not work on a custom component?",
        np: "`register` custom मा काम गर्दैन?",
        jp: "`register` がカスタムで効かないときは？",
      },
      answer: {
        en: "Use **`Controller`** (or **`useController`**) so RHF drives **`value`/`onChange`** explicitly. Ensure the underlying input is still a **real form control** or exposes the right props.",
        np: "**`Controller`** / **`useController`** — **`value`/`onChange`** स्पष्ट।",
        jp: "**`Controller`** で **`value` / `onChange`** を明示的につなぎます。",
      },
    },
  ],
  bullets: [
    {
      en: "Build one native controlled form with `onSubmit` + `preventDefault`, then rebuild the same fields with **RHF + `register`**.",
      np: "native controlled + **RHF register** मा पुन: निर्माण।",
      jp: "ネイティブ制御フォームを作ったあと、**RHF** で同じ項目を組み直す。",
    },
    {
      en: "Add a **Zod** schema + **`zodResolver`**; surface `formState.errors` next to each field with accessible ids.",
      np: "**Zod** + **`zodResolver`**; `formState.errors` + पहुँच id।",
      jp: "**Zod** と **`zodResolver`** を入れ、**`formState.errors`** をアクセシブルに出す。",
    },
    {
      en: "Complete **Expense Tracker**: filter derives a memoized list; submit appends immutably and resets the form.",
      np: "**Expense Tracker**: memo filter; immutable append; reset।",
      jp: "**Expense Tracker** を完成させ、フィルタは派生リスト、追加はイミュータブル、送信後は reset。",
    },
  ],
};
