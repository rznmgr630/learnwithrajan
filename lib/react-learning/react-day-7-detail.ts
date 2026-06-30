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
  ],
};
