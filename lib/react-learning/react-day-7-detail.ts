import type { RoadmapDayDetail } from "@/lib/challenge-data";

export const REACT_DAY_7_DETAIL: RoadmapDayDetail = {
  overview: [
    {
      en: "Forms are the primary way users send data to your app — login forms, checkout forms, search boxes, settings pages. React handles forms differently from HTML: instead of letting the DOM manage the input value, you store it in state and control every keystroke. This is called a <b>controlled component</b>.\n\nAnother approach is <b>uncontrolled</b> — the DOM holds the value and you only read it when you need it. Both have their place, but controlled components are the default in React because they give you full control over validation and UI feedback.",
      np: "Forms React मा controlled component रूपमा handle हुन्छन् — React Hook Form र Zod validation सहित।",
      jp: "フォームは制御コンポーネントとして実装。React Hook Form と Zod バリデーションを使います。",
    },
    {
      en: "In this day we cover:\n• <b>Controlled inputs</b> — value stored in React state, updated on every keystroke\n• <b>React Hook Form (RHF)</b> — less boilerplate, better performance for complex forms\n• <b>Zod</b> — schema-based validation that works seamlessly with RHF\n• <b>Form states</b> — idle, loading, success, error lifecycle\n• <b>File uploads</b> — file inputs, image preview, and FormData",
      np: "Controlled inputs, RHF, Zod, form states, file upload।",
      jp: "制御入力・RHF・Zod・フォーム状態・ファイルアップロードを網羅します。",
    },
  ],
  sections: [
    {
      title: { en: "Controlled inputs", np: "Controlled inputs", jp: "制御コンポーネント" },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "<b>Controlled</b> means React owns the value — every character the user types goes through your state. <b>Uncontrolled</b> means the DOM owns the value and you read it with a ref when you need it.\n\nAnalogy: a controlled input is like a live captionist who types every word in real-time so you can see and correct it immediately. An uncontrolled input is like handing someone a blank notepad and only reading it when they hand it back.\n\n• Use controlled inputs when: you need real-time validation, dependent fields, or immediate UI feedback\n  ↳ Most forms in production apps are controlled\n• Use uncontrolled when: you have a very simple form with no validation and want to avoid re-renders\n  ↳ Rarely the right choice — RHF (Section 2) solves the performance concern",
            np: "Controlled = React state ले value राख्छ। Uncontrolled = DOM ले ref सहित।",
            jp: "制御：React がステートで値を持つ。非制御：DOM が持ち ref で読む。",
          },
        },
        {
          type: "code",
          title: { en: "Controlled login form", np: "Controlled login form", jp: "制御ログインフォーム" },
          code: `import { useState } from "react";

function LoginForm() {
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [error, setError]       = useState("");

  function handleSubmit(e) {
    e.preventDefault(); // stop the browser from reloading the page
    if (!email.includes("@")) {
      setError("Please enter a valid email.");
      return;
    }
    console.log("Submitting:", { email, password });
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="email"
        value={email}
        onChange={e => setEmail(e.target.value)}
        placeholder="Email"
      />
      <input
        type="password"
        value={password}
        onChange={e => setPassword(e.target.value)}
        placeholder="Password"
      />
      {error && <p className="text-red-500">{error}</p>}
      <button type="submit">Log in</button>
    </form>
  );
}`,
        },
      ],
    },
    {
      title: { en: "React Hook Form — forms without the boilerplate", np: "React Hook Form", jp: "React Hook Form" },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "Manually wiring `value` and `onChange` for every input causes a re-render on every keystroke. For a 20-field form that is noisy and slow.\n\nAnalogy: manually managing form state is like tracking inventory by hand — you write down every item, every change. <b>React Hook Form</b> is like a barcode scanner — scan once, the system does the rest.\n\nRHF registers inputs using a ref under the hood (not state), so the form only re-renders when needed — on submit, on error, or when you explicitly trigger a validation check.\n\n• `register` — connects an input to RHF without a controlled `value/onChange` pair\n• `handleSubmit` — wraps your submit handler; only calls it when validation passes\n• `formState.errors` — validation error messages per field\n• `isSubmitting` — `true` while your async onSubmit is running (auto disables submit)",
            np: "RHF ले ref प्रयोग गर्छ — हरेक keystroke मा re-render हुँदैन।",
            jp: "RHF は ref ベースなので再レンダーが最小化されます。",
          },
        },
        {
          type: "code",
          title: { en: "React Hook Form with built-in validation", np: "RHF validation", jp: "RHF バリデーション" },
          code: `import { useForm } from "react-hook-form";

function SignupForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();

  async function onSubmit(data) {
    await saveToApi(data); // RHF only calls this when validation passes
    console.log(data);
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input
        {...register("email", {
          required: "Email is required",
          pattern: { value: /^\\S+@\\S+$/i, message: "Invalid email" },
        })}
        placeholder="Email"
      />
      {errors.email && <p>{errors.email.message}</p>}

      <input
        {...register("password", {
          required: "Password required",
          minLength: { value: 8, message: "Min 8 characters" },
        })}
        type="password"
        placeholder="Password"
      />
      {errors.password && <p>{errors.password.message}</p>}

      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Saving..." : "Sign up"}
      </button>
    </form>
  );
}`,
        },
      ],
    },
    {
      title: { en: "Zod — schema-based validation", np: "Zod validation", jp: "Zod バリデーション" },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "<b>Zod</b> lets you define a data schema in one place and use it for both TypeScript types and runtime validation. Instead of scattering validation rules across inputs, you declare them all in a schema object.\n\nAnalogy: Zod is like a customs form — you define exactly what is allowed through the border (the form submit), and anything that does not match is flagged with a clear reason.\n\n• `zodResolver(schema)` connects Zod to RHF — when the form submits, Zod validates the data before your `onSubmit` handler runs\n  ↳ Errors from Zod automatically populate `formState.errors`\n• `z.infer<typeof schema>` gives you the TypeScript type for free — no need to write it manually",
            np: "Zod schema एकैठाउँमा define — RHF zodResolver सहित।",
            jp: "Zod でスキーマ定義 → zodResolver で RHF に接続。",
          },
        },
        {
          type: "code",
          title: { en: "Zod schema + zodResolver integration", np: "Zod + RHF", jp: "Zod + RHF" },
          code: `import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

const schema = z.object({
  email:    z.string().email("Invalid email"),
  password: z.string().min(8, "Min 8 characters"),
  age:      z.number({ invalid_type_error: "Age must be a number" }).min(18, "Must be 18+"),
  role:     z.enum(["admin", "editor", "viewer"]),
});

type FormData = z.infer<typeof schema>; // TypeScript type for free!

function UserForm() {
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  return (
    <form onSubmit={handleSubmit(data => console.log(data))}>
      <input {...register("email")} placeholder="Email" />
      {errors.email && <p>{errors.email.message}</p>}

      <input {...register("age", { valueAsNumber: true })} type="number" placeholder="Age" />
      {errors.age && <p>{errors.age.message}</p>}

      <select {...register("role")}>
        <option value="viewer">Viewer</option>
        <option value="editor">Editor</option>
        <option value="admin">Admin</option>
      </select>

      <button type="submit">Save</button>
    </form>
  );
}`,
        },
        {
          type: "table",
          caption: { en: "Common Zod validators", np: "Zod validators", jp: "Zod バリデーター一覧" },
          headers: [
            { en: "Validator", np: "Validator", jp: "バリデーター" },
            { en: "Description", np: "विवरण", jp: "説明" },
          ],
          rows: [
            [{ en: "`z.string().email()`", np: "`z.string().email()`", jp: "`z.string().email()`" }, { en: "Valid email format", np: "Valid email", jp: "メール形式" }],
            [{ en: "`z.string().min(8)`", np: "`z.string().min(8)`", jp: "`z.string().min(8)`" }, { en: "Minimum string length", np: "न्यूनतम लम्बाइ", jp: "最小文字数" }],
            [{ en: "`z.number().min(0)`", np: "`z.number().min(0)`", jp: "`z.number().min(0)`" }, { en: "Numeric minimum value", np: "न्यूनतम संख्या", jp: "数値の最小値" }],
            [{ en: "`z.enum([...])`", np: "`z.enum([...])`", jp: "`z.enum([...])`" }, { en: "Must be one of the listed values", np: "सूचीबद्ध मध्ये", jp: "列挙値の一つ" }],
            [{ en: "`z.string().optional()`", np: "`z.string().optional()`", jp: "`z.string().optional()`" }, { en: "Field may be undefined", np: "Optional", jp: "省略可能" }],
          ],
        },
      ],
    },
    {
      title: { en: "Form lifecycle — idle, loading, success & error states", np: "Form states", jp: "フォームの状態管理" },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "Every form that talks to an API has a lifecycle:\n• <b>Idle</b> — the form is ready, waiting for the user\n• <b>Loading</b> — the form was submitted and we are waiting for the server response\n  ↳ Disable the submit button to prevent double-submits\n• <b>Success</b> — the server responded OK; show a success message or redirect\n• <b>Error</b> — the server returned an error; show the message so the user can fix it\n\nRHF's `isSubmitting` flag covers the loading state automatically — it is `true` while your async `onSubmit` is running.",
            np: "Form lifecycle: idle → loading → success/error। RHF isSubmitting flag।",
            jp: "フォームのライフサイクル：idle → loading → success/error。",
          },
        },
        {
          type: "code",
          title: { en: "Form with full state lifecycle", np: "Full form lifecycle", jp: "フォーム状態ライフサイクル" },
          code: `import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const schema = z.object({
  email:   z.string().email(),
  message: z.string().min(10),
});

function ContactForm() {
  const [submitError, setSubmitError] = useState("");
  const [success, setSuccess]         = useState(false);

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } =
    useForm({ resolver: zodResolver(schema) });

  async function onSubmit(data) {
    setSubmitError("");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error(await res.text());
      setSuccess(true);
      reset();
    } catch (e) {
      setSubmitError(e.message);
    }
  }

  if (success) return <p>Message sent! We will be in touch.</p>;

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register("email")} placeholder="Email" />
      {errors.email && <p className="error">{errors.email.message}</p>}

      <textarea {...register("message")} placeholder="Message" />
      {errors.message && <p className="error">{errors.message.message}</p>}

      {submitError && <p className="error">{submitError}</p>}

      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Sending..." : "Send message"}
      </button>
    </form>
  );
}`,
        },
      ],
    },
    {
      title: { en: "File upload inputs — preview & FormData", np: "File upload", jp: "ファイルアップロード" },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "File inputs are uncontrolled by nature — the browser controls which file is selected (you cannot programmatically set a file for security reasons). You read the selected file via `e.target.files[0]`.\n\nKey concepts:\n• <b>`URL.createObjectURL(file)`</b> — creates a temporary browser URL for a local file so you can show a preview without uploading first\n  ↳ Always call `URL.revokeObjectURL(url)` in a cleanup effect to avoid memory leaks\n• <b>`FormData`</b> — the right way to send files to a server; do NOT use `JSON.stringify` for file uploads\n  ↳ The browser sets the `Content-Type` header (with the multipart boundary) automatically when you pass FormData\n• `accept=\"image/*\"` — hints to the OS file picker to only show image files (but server must still validate!)",
            np: "File input uncontrolled। URL.createObjectURL preview। FormData upload।",
            jp: "ファイル入力は非制御。URL.createObjectURL でプレビュー、FormData で送信。",
          },
        },
        {
          type: "code",
          title: { en: "Image upload with live preview", np: "Image upload preview", jp: "画像アップロードとプレビュー" },
          code: `import { useState, useEffect } from "react";

function AvatarUpload() {
  const [file, setFile]           = useState(null);
  const [preview, setPreview]     = useState(null);
  const [uploading, setUploading] = useState(false);

  // Create a temporary URL for the preview, clean up when file changes
  useEffect(() => {
    if (!file) { setPreview(null); return; }
    const url = URL.createObjectURL(file);
    setPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  async function handleUpload() {
    if (!file) return;
    setUploading(true);
    const fd = new FormData();
    fd.append("avatar", file);
    await fetch("/api/avatar", { method: "POST", body: fd });
    setUploading(false);
  }

  return (
    <div>
      <input
        type="file"
        accept="image/*"
        onChange={e => setFile(e.target.files?.[0] ?? null)}
      />
      {preview && (
        <img
          src={preview}
          alt="Preview"
          style={{ width: 100, height: 100, objectFit: "cover", borderRadius: 8 }}
        />
      )}
      <button onClick={handleUpload} disabled={!file || uploading}>
        {uploading ? "Uploading..." : "Upload avatar"}
      </button>
    </div>
  );
}`,
        },
      ],
    },
    {
      title: { en: "Dynamic Forms — adding and removing fields at runtime", np: "Dynamic Forms — runtime मा fields थप्ने/हटाउने", jp: "動的フォーム — 実行時にフィールドを追加・削除" },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "Some forms need a variable number of the same field — multiple phone numbers, multiple invoice line items, multiple team members. `register`ing a fixed set of named fields does not work here since you do not know the count ahead of time. RHF's `useFieldArray` manages an array of fields as its own mini form.\n\nAnalogy: `useFieldArray` is like a checklist with a `+` button — each row is independent, has its own validation, and you can insert or remove a row without disturbing the others.\n\n• `fields` — the current array of field objects (each has a stable `id`, not your data's own id — always use `field.id` as the React `key`, never the array index)\n• `append(value)` — adds a new row at the end\n• `remove(index)` — removes a row by index\n• Each row's inputs are registered as `` `items.${index}.name` `` — nested paths into the array",
            np: "Variable-length fields (phone numbers, line items) को लागि `useFieldArray` use गर्नुहोस्। `field.id` लाई key बनाउनुहोस्, index होइन।",
            jp: "可変長フィールド（電話番号、明細行など）には `useFieldArray` を使う。key には `field.id` を使い、インデックスは使わない。",
          },
        },
        {
          type: "code",
          title: { en: "Invoice line items with useFieldArray", np: "useFieldArray उदाहरण", jp: "useFieldArray の例" },
          code: `import { useForm, useFieldArray } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const schema = z.object({
  items: z.array(
    z.object({
      description: z.string().min(1, "Required"),
      amount: z.number().min(0.01, "Must be positive"),
    })
  ).min(1, "Add at least one item"),
});

type FormData = z.infer<typeof schema>;

function InvoiceForm() {
  const { register, control, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { items: [{ description: "", amount: 0 }] },
  });

  const { fields, append, remove } = useFieldArray({ control, name: "items" });

  return (
    <form onSubmit={handleSubmit(data => console.log(data))}>
      {fields.map((field, index) => (
        // field.id is a stable RHF-generated id — NOT your data's id, and NOT the index
        <div key={field.id} className="flex gap-2">
          <input {...register(\`items.\${index}.description\`)} placeholder="Description" />
          {errors.items?.[index]?.description && <p>{errors.items[index]?.description?.message}</p>}

          <input
            {...register(\`items.\${index}.amount\`, { valueAsNumber: true })}
            type="number"
            placeholder="Amount"
          />
          <button type="button" onClick={() => remove(index)}>Remove</button>
        </div>
      ))}

      <button type="button" onClick={() => append({ description: "", amount: 0 })}>
        + Add line item
      </button>
      <button type="submit">Save invoice</button>
    </form>
  );
}`,
        },
      ],
    },
    {
      title: { en: "Multi-step Forms — wizards that split one form across steps", np: "Multi-step Forms — steps मा बाँडिएको form", jp: "マルチステップフォーム — 複数ステップに分けたフォーム" },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "A signup wizard (account info → address → payment) is still ONE logical form — you don't want to lose step 1's data when the user reaches step 3. The common approach: keep a single `useForm()` instance for the whole wizard, and a `step` state variable that controls which fields are visible. Analogy: it's one long hallway with several doors — you only show one room at a time, but it's the same house.\n\n• Render all steps' fields inside the same `<form>`, but conditionally hide inactive steps with CSS or conditional rendering (do not unmount them if you want RHF to keep their values registered)\n• Use `trigger([\"field1\", \"field2\"])` to validate only the current step's fields before letting the user click \"Next\" — this avoids showing step 3's errors while the user is still on step 1\n• On the final step, `handleSubmit` validates the WHOLE schema and submits everything at once",
            np: "Multi-step wizard एउटै `useForm()` instance प्रयोग गर्छ, `step` state ले कुन fields देखाउने control गर्छ। `trigger()` ले current step मात्र validate गर्छ।",
            jp: "マルチステップウィザードは1つの `useForm()` インスタンスを使い、`step` state で表示フィールドを制御。`trigger()` で現在のステップのみ検証する。",
          },
        },
        {
          type: "code",
          title: { en: "3-step signup wizard with per-step validation", np: "3-step wizard उदाहरण", jp: "3ステップウィザードの例" },
          code: `import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const schema = z.object({
  name:    z.string().min(1, "Required"),
  email:   z.string().email(),
  address: z.string().min(1, "Required"),
  city:    z.string().min(1, "Required"),
  cardNumber: z.string().length(16, "16 digits"),
});
type FormData = z.infer<typeof schema>;

const STEP_FIELDS: Record<number, (keyof FormData)[]> = {
  1: ["name", "email"],
  2: ["address", "city"],
  3: ["cardNumber"],
};

function SignupWizard() {
  const [step, setStep] = useState(1);
  const { register, trigger, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  async function goNext() {
    const valid = await trigger(STEP_FIELDS[step]); // validate ONLY this step's fields
    if (valid) setStep(s => s + 1);
  }

  return (
    <form onSubmit={handleSubmit(data => console.log("Submitting all steps:", data))}>
      <progress value={step} max={3} /> {/* progress indicator */}

      {step === 1 && (
        <>
          <input {...register("name")} placeholder="Full name" />
          {errors.name && <p>{errors.name.message}</p>}
          <input {...register("email")} placeholder="Email" />
          {errors.email && <p>{errors.email.message}</p>}
        </>
      )}

      {step === 2 && (
        <>
          <input {...register("address")} placeholder="Address" />
          {errors.address && <p>{errors.address.message}</p>}
          <input {...register("city")} placeholder="City" />
          {errors.city && <p>{errors.city.message}</p>}
        </>
      )}

      {step === 3 && (
        <input {...register("cardNumber")} placeholder="Card number" />
      )}

      <div>
        {step > 1 && <button type="button" onClick={() => setStep(s => s - 1)}>Back</button>}
        {step < 3
          ? <button type="button" onClick={goNext}>Next</button>
          : <button type="submit">Finish signup</button>}
      </div>
    </form>
  );
}`,
        },
      ],
    },
    {
      title: { en: "Form performance — why React Hook Form re-renders less", np: "Form performance — RHF ले किन कम re-render गर्छ", jp: "フォームのパフォーマンス — RHF が再レンダーを抑える理由" },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "A naive controlled form with `useState` per field re-renders the ENTIRE form component on every keystroke in every field — for a 30-field form, that's 30 fields worth of re-renders (plus any expensive children) for each character typed anywhere.\n\n`register` avoids this by attaching a plain DOM `ref` to the input instead of controlling it through state — RHF reads the value straight from the DOM node when needed (on submit, on blur, or on an explicit `trigger()` call), and only triggers a React re-render for the specific parts of the form that must visually update (like showing a new error message).\n\n<b>Choosing a validation mode for large forms:</b>\n• `mode: 'onSubmit'` (default) — validates once, on submit. Fewest re-renders, but the user only sees errors after clicking submit\n• `mode: 'onBlur'` — validates when a field loses focus. Good balance for large forms — feedback per field without a re-render on every keystroke\n• `mode: 'onChange'` — validates on every keystroke. Best UX for short forms (login), but causes the most re-renders — avoid for forms with 20+ fields",
            np: "Naive useState-per-field ले हरेक keystroke मा पूरा form re-render गर्छ। RHF ले ref प्रयोग गरी केवल आवश्यक भाग मात्र re-render गर्छ। ठूला forms मा `mode: 'onBlur'` राम्रो सन्तुलन हो।",
            jp: "素朴な useState 方式は毎回全フォームを再レンダーする。RHF は ref を使い必要な部分のみ再レンダー。大規模フォームには `mode: 'onBlur'` がバランス良い。",
          },
        },
        {
          type: "code",
          title: { en: "Memoizing field rows in a 50+ field form", np: "50+ field form मा memoize", jp: "50フィールド超のフォームでの memo 化" },
          code: `import { memo } from "react";
import { useForm } from "react-hook-form";

// Naive approach — DO NOT do this for large forms:
// function BadForm() {
//   const [values, setValues] = useState({ field1: "", field2: "", /* ...48 more */ });
//   // Typing in field1 re-renders the WHOLE component, recomputing all 50 inputs' JSX
// }

// Memoized field row — only re-renders if ITS OWN error changes, not the whole form
const FieldRow = memo(function FieldRow({
  name,
  label,
  register,
  error,
}: {
  name: string;
  label: string;
  register: ReturnType<typeof useForm>["register"];
  error?: string;
}) {
  return (
    <div>
      <label>{label}</label>
      <input {...register(name)} />
      {error && <p className="error">{error}</p>}
    </div>
  );
});

function LargeSettingsForm() {
  const { register, handleSubmit, formState: { errors } } = useForm({ mode: "onBlur" });
  const fieldDefs = [
    { name: "displayName", label: "Display name" },
    { name: "bio", label: "Bio" },
    // ...48 more field definitions, driven by an array instead of hand-written JSX
  ];

  return (
    <form onSubmit={handleSubmit(data => console.log(data))}>
      {fieldDefs.map(f => (
        <FieldRow
          key={f.name}
          name={f.name}
          label={f.label}
          register={register}
          error={errors[f.name]?.message as string | undefined}
        />
      ))}
      <button type="submit">Save settings</button>
    </form>
  );
}`,
        },
      ],
    },
  ],
  faq: [
    {
      question: { en: "What is a controlled component?", np: "Controlled component के हो?", jp: "制御コンポーネントとは？" },
      answer: {
        en: "A controlled component is one where React state is the single source of truth for the input value. The input always displays `value={stateVar}` and updates state via `onChange`. This lets React intercept every keystroke for real-time validation or dependent field logic.",
        np: "React state नै input को value — onChange मा state update।",
        jp: "React ステートが入力値を持ち、onChange で更新する形です。",
      },
    },
    {
      question: { en: "Why does React re-render on every keystroke?", np: "Keystroke मा re-render किन?", jp: "キーストロークで再レンダーする理由は？" },
      answer: {
        en: "Because the input value is tied to state — calling `setState` on every `onChange` triggers a re-render. For simple forms this is fine. For large forms, React Hook Form avoids this by using refs instead of state, only re-rendering on submit or explicit validation triggers.",
        np: "State update = re-render। RHF ले ref प्रयोग गरेर यो avoid गर्छ।",
        jp: "state 更新 = 再レンダー。RHF は ref で管理して回避します。",
      },
    },
    {
      question: { en: "What is the difference between RHF `register` and `Controller`?", np: "`register` र `Controller` फरक?", jp: "`register` と `Controller` の違いは？" },
      answer: {
        en: "`register` uses a ref directly on native HTML inputs (`<input>`, `<select>`, `<textarea>`). `Controller` is a wrapper for third-party controlled components (like a custom date picker or Select2 dropdown) that do not expose a native ref. Use `register` for everything you can; fall back to `Controller` for external UI library components.",
        np: "`register` native inputs। `Controller` third-party controlled components।",
        jp: "`register` はネイティブ入力用、`Controller` は外部コンポーネント用です。",
      },
    },
    {
      question: { en: "How do I reset a form after submission?", np: "Submit पछि form reset?", jp: "送信後のフォームリセット方法は？" },
      answer: {
        en: "Call `reset()` from `useForm()`. By default it clears all fields to their `defaultValues`. You can also reset to specific values: `reset({ email: '', name: 'Rajan' })`. RHF also exposes `resetField('fieldName')` for resetting a single field without affecting the rest.",
        np: "`reset()` call गर्नुस् — सबै fields defaultValues मा।",
        jp: "`reset()` で全フィールドを defaultValues にリセットします。",
      },
    },
    {
      question: { en: "Can I use multiple Zod schemas in one form?", np: "एक form मा multiple schemas?", jp: "1フォームに複数スキーマ？" },
      answer: {
        en: "Yes — use `z.discriminatedUnion` if the schema depends on a field value (e.g. different fields based on `role`). For multi-step forms, each step has its own schema; validate only the current step by using `.pick()` on the full schema and passing a narrower resolver.",
        np: "z.discriminatedUnion वा step अनुसार .pick()।",
        jp: "`z.discriminatedUnion` や `.pick()` でステップごとに対応します。",
      },
    },
    {
      question: { en: "Why does useFieldArray need field.id instead of my own data's id?", np: "useFieldArray मा field.id किन चाहिन्छ, आफ्नै data id किन होइन?", jp: "useFieldArray で自前の id でなく field.id が必要な理由は？" },
      answer: {
        en: "`field.id` is generated and tracked internally by RHF specifically to keep React's reconciliation stable when rows are appended, removed, or reordered — your own data may not have an id yet (e.g. a brand-new row before it's saved), and reusing the array index as a key breaks reconciliation exactly like Day 13 explains for regular lists.",
        np: "field.id ले rows add/remove/reorder हुँदा React reconciliation स्थिर राख्छ — आफ्नै data मा id नहुन सक्छ।",
        jp: "field.id は行の追加・削除・並び替え時に reconciliation を安定させるため。自前データには id がまだない場合もあります。",
      },
    },
    {
      question: { en: "Should I validate on every keystroke for the best UX?", np: "राम्रो UX को लागि हरेक keystroke मा validate गर्ने?", jp: "最高の UX のため毎回のキー入力で検証すべき？" },
      answer: {
        en: "Not always. `mode: 'onChange'` gives the fastest feedback but re-renders the most, which matters once a form has 20+ fields. A common middle ground: validate `onBlur` for most fields, but re-enable `onChange` just for the field the user already got wrong once (RHF does this automatically via `reValidateMode: 'onChange'`, which is the default paired with `mode: 'onBlur'`).",
        np: "सधैं होइन — 20+ fields भएमा `onBlur` राम्रो। RHF को default `reValidateMode: 'onChange'` ले पहिले गल्ती भएको field मात्र onChange validate गर्छ।",
        jp: "常にではありません。20フィールド以上なら `onBlur` が良い。RHF のデフォルト `reValidateMode: 'onChange'` は一度エラーになったフィールドのみ onChange で再検証します。",
      },
    },
  ],
};
