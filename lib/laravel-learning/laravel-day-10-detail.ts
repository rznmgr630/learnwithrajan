import type { RoadmapDayDetail } from "@/lib/challenge-data";

export const LARAVEL_DAY_10_DETAIL: RoadmapDayDetail = {
  overview: [
    {
      en: "Finish the loop with outbound HTTP, mail, string helpers, and code generators. Then level up with Form Requests, API resources, queues, and task scheduling—first-class Laravel features for production APIs.",
      np: "HTTP client, मेल, स्ट्रिङ, stub। अगाडि Form Request, queue आदि।",
      jp: "HTTP クライアント・メール・文字列・stub の後は Form Request・キュー・スケジュールなど本番機能へ。",
    },
  ],
  sections: [
    {
      title: { en: "HTTP client", np: "HTTP क्लाइन्ट", jp: "HTTP クライアント" },
      blocks: [
        {
          type: "code",
          code: `use Illuminate\\Support\\Facades\\Http;

$response = Http::timeout(5)->get('https://api.example.com/items');
$data = $response->json();
$response->throw(); // raise on 4xx/5xx if desired`,
        },
      ],
    },
    {
      title: { en: "Mailables (outline)", np: "मेल", jp: "メール送信の流れ" },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "Configure `MAIL_*` in `.env` (use app passwords for SMTP providers—never commit secrets). Run `php artisan make:mail WelcomeMail`, define `envelope()` / `content()`, call `Mail::to($user)->send(new WelcomeMail($data)). Prefer queued mailables for slow SMTP.",
            np: "`.env` मा `MAIL_*`; `make:mail`; `Mail::send`। गोप्य मान commit नगर्नु।",
            jp: "`.env` の `MAIL_*` を設定（認証情報は秘密に）。`make:mail` で Mailable を作成し `Mail::` で送信。遅い場合はキューへ。",
          },
        },
      ],
    },
    {
      title: { en: "Fluent strings & stubs", np: "Fluent स्ट्रिङ र stub", jp: "Fluent 文字列と stub" },
      blocks: [
        {
          type: "code",
          code: `use Illuminate\\Support\\Str;

Str::of('  Laravel  ')->trim()->slug('-')->upper();

php artisan stub:publish`,
        },
      ],
    },
    {
      title: { en: "Next steps — Laravel 11 depth", np: "अगाडि को कदम", jp: "次のステップ" },
      blocks: [
        {
          type: "list",
          variant: "bullet",
          items: [
            {
              en: "Form Requests (`make:request`) centralize authorization + validation rules per endpoint.",
              np: "Form Request ले नियम र नीति एक ठाउँमा।",
              jp: "Form Request で検証と認可をエンドポイント単位にまとめる。",
            },
            {
              en: "API Resources shape JSON consistently for consumers.",
              np: "API Resource ले JSON आकार एकरूप।",
              jp: "API Resource で JSON の形を統一。",
            },
            {
              en: "Queues & Horizon offload slow mail / webhooks; `Schedule::` in `routes/console.php` for cron-like tasks.",
              np: "Queue भारी कार्य; `Schedule` समयबद्ध कार्य।",
              jp: "キュー で重い処理を非同期。`routes/console.php` の `Schedule` で定期実行。",
            },
            {
              en: "Policies / Gates layer authorization after authentication.",
              np: "Policy/Gate प्रमाणीकरण पछि अनुमति।",
              jp: "Policy / Gate で認可を実装。",
            },
          ],
        },
      ],
    },
  ],
  faq: [
    {
      question: {
        en: "Why publish stubs?",
        np: "stub प्रकाशन किन?",
        jp: "stub を publish する理由は？",
      },
      answer: {
        en: "`php artisan stub:publish` copies generator templates so `make:*` commands emit your namespaces, strict types, or base classes—team consistency across new files.",
        np: "`make:*` ले तपाईंको टेम्प्लेट प्रयोग गर्छ।",
        jp: "`stub:publish` で `make:model` などが生成する雛形をチーム仕様に合わせられます。",
      },
    },
  ],
};
