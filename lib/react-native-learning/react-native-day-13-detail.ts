import type { RoadmapDayDetail } from "@/lib/challenge-data";

/** Day 13 — Forms: Formik, Yup, reusable Field components + listing edit. */
export const REACT_NATIVE_DAY_13_DETAIL: RoadmapDayDetail = {
  overview: [
    {
      en: "**Forms** chapter aligns with **Login form**, **Formik**, **Yup**, **ErrorMessage**, **touched**, **Field**, **SubmitButton**, **Form shell**, organizing components, **Listing Edit** exercise, **placeholder color fix** mindset.",
                                                                                    np: "फर्म टुटौरियल।",
      jp: "フォーム：**Formik + Yup + 部品化** と編集画面の定型。",
    },
  ],
  sections: [
    {
      title: {
        en: "Introduction",
                                                                                    np: "परिचय",
        jp: "Introduction",
      },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "**Declarative validation** separates UI from schema—helps align RN + eventual web dashboards sharing Yup.",
                                                                                      np: "युप एकै।",
            jp: "Yup でスキーマを共有すると将来 Web と揃えやすい。",
          },
        },
      ],
    },
    {
      title: {
        en: "Building the Login Form",
                                                                                    np: "लगइन फर्म",
        jp: "Building the Login Form",
      },
      blocks: [
        {
          type: "code",
          title: {
            en: "`Formik` + `initialValues`",
                                                                                      np: "फर्मिक",
            jp: "Formik skeleton",
          },
          code: `import { Formik } from 'formik';
import { Button, View } from 'react-native';
import { AppFormField } from '../components/forms/AppFormField';

export function LoginForm({ onSubmit }: { onSubmit: (vals: LoginValues) => Promise<void> }) {
  return (
    <Formik
      initialValues={{ email: '', password: '' }}
      onSubmit={onSubmit}
      validationSchema={loginSchema}>
      {({ handleSubmit }) => (
        <View style={{ gap: 12 }}>
          <AppFormField name="email" placeholder="Email" keyboardType="email-address" />
          <AppFormField name="password" placeholder="Password" secureTextEntry />
          <Button title="Login" onPress={() => handleSubmit()} />
        </View>
      )}
    </Formik>
  );
}

type LoginValues = { email: string; password: string };
// loginSchema exported from validations/login.ts`,
        },
      ],
    },
    {
      title: {
        en: "Building Better Forms with Formik",
                                                                                    np: "Formik गहिराइ",
        jp: "Building Better Forms with Formik",
      },
      blocks: [
        {
          type: "list",
          variant: "bullet",
          items: [
            {
              en: "**`useFormikContext`** exposes errors/touched/setFieldValue deeper in trees without prop drilling explosions.",
                                                                                      np: "सन्दर्भ।",
              jp: "**useFormikContext** で深い子にもエラー状態を読ませられる。",
            },
            {
              en: "**`resetForm`** after async success resets dirty flags for navigation guards.",
              np: "रीसेट नेभ गार्ड.",
              jp: "**resetForm** でナビゲーションの離脱確認と整合。",
            },
          ],
        },
      ],
    },
    {
      title: {
        en: "Form Validation with Yup",
                                                                                    np: "Yup",
        jp: "Form Validation with Yup",
      },
      blocks: [
        {
          type: "code",
          title: {
            en: "Schema sample",
                                                                                    np: "युप कोड",
            jp: "Yup サンプル",
          },
          code: `import * as Yup from 'yup';

export const loginSchema = Yup.object({
  email: Yup.string().email().label('Email').required(),
  password: Yup.string().label('Password').required().min(6),
});`,
        },
      ],
    },
    {
      title: {
        en: "Building the ErrorMessage Component",
                                                                                    np: "त्रुटि सन्देश",
        jp: "Building the ErrorMessage Component",
      },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "**`useField`/`useFormikContext`** reads error & touched—conditionally render **`Text`** in brand danger color beneath inputs.",
                                                          np: "छोउ र देखाइ।",
              jp: "touched かつエラーだけ表示。**Text** で統一スタイル。",
          },
        },
      ],
    },
    {
      title: {
        en: "The Touched State",
                                                                                    np: "छोउ स्थितिमान",
        jp: "The Touched State",
      },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "**`onBlur` → `handleBlur`** propagates blur events so errors do not shout before interaction.",
                                                                              np: "फोकस टुटाइ।",
            jp: "**handleBlur** を TextInput に渡し、触る前は黙らせる。",
          },
        },
      ],
    },
    {
      title: {
        en: "Building the Field Component",
                                                                                    np: "फेल्ड घटक",
        jp: "Building the Field Component",
      },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "**`AppFormField`** composes **`useField`** + **`AppTextInput`** + **`ErrorMessage`**.",
            np: "संयोग।",
            jp: "**AppFormField**：useField + 入力 UI + ErrorMessage。",
          },
        },
      ],
    },
    {
      title: {
        en: "Building the SubmitButton Component",
                                                    np: "पेश बटन",
        jp: "Building the SubmitButton Component",
      },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "Disable submission while **`isSubmitting`**; show **`ActivityIndicator`** inline with label.",
                                                                              np: "इन्डिकेटर।",
            jp: "**isSubmitting** 中は無効＋インジケータ表示。",
          },
        },
      ],
    },
    {
      title: {
        en: "Building the Form Component",
                                                    np: "फर्म घोल",
        jp: "Building the Form Component",
      },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "Thin wrapper around **`Formik`** child function—handles keyboard avoiding container + **`enableReinitialize`** for edit screens.",
                                                                              np: "सम्पादन स्क्रिन।",
              jp: "編集モードでは **enableReinitialize** でサーバデータを初期値へ。",
          },
        },
      ],
    },
    {
      title: {
        en: "Organizing Components",
                                                    np: "संरचना फोल्डर",
        jp: "Organizing Components",
      },
      blocks: [
        {
          type: "list",
          variant: "bullet",
          items: [
            {
              en: "`/components/forms/*` grouping keeps marketing UI separate from transactional flows.",
                                                                              np: "फर्म उपफोल्डर।",
              jp: "**components/forms/** に集約すると見通しが良い。",
            },
          ],
        },
      ],
    },
    {
      title: {
        en: "Exercises · Building the Listing Edit Screen",
                                                    np: "सम्पादन स्क्रिन",
        jp: "Exercises · Building the Listing Edit Screen",
      },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "**Multi-field edits** reuse same components with **`initialValues` from fetched listing**. Watch **controlled pickers tied to Yup enums**.",
                                                                              np: "आरम्भ मूल्य।",
            jp: "取得した listing で **initialValues**。選択肢と Yup を一致させる。",
          },
        },
      ],
    },
    {
      title: {
        en: "Fixing the Placeholder Color",
                                                    np: "प्लेसहोल्डर रङ",
        jp: "Fixing the Placeholder Color",
      },
      blocks: [
        {
          type: "code",
          title: {
            en: "`placeholderTextColor` prop",
                                                    np: "रङ प्रप",
            jp: "placeholderTextColor",
          },
          code: `<AppTextInput
  placeholder="Title"
  placeholderTextColor="#9CA3AF"
/>`,
        },
      ],
    },
  ],
  faq: [
    {
      question: {
        en: "Avoid Formik?",
                                                    np: "फर्मिक बिहाय?",
        jp: "Formik を使わない？",
      },
      answer: {
        en: "Alternatives: **React Hook Form + zod resolver** — pick per team ergonomics.**Lessons emphasize Formik/Yup familiarity** prevalent in Udemy-era tutorials.",
                                                                              np: "रHF विकल्प।",
              jp: "RHF+zod も可。講義は Formik が多く出てくるイメージ。",
      },
    },
  ],
};
