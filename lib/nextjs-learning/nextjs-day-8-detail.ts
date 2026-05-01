import type { RoadmapDayDetail } from "@/lib/challenge-data";

export const NEXTJS_DAY_8_DETAIL: RoadmapDayDetail = {
  overview: [
    {
      en: "Storing user-uploaded files on your Next.js server is a bad idea: the server's filesystem is **ephemeral** on serverless platforms (Vercel, Railway), it doesn't scale horizontally, and serving large files from your app wastes bandwidth and CPU. Instead, delegate uploads to a cloud storage provider. **Cloudinary** offers a generous free tier, an intuitive JavaScript SDK, the **`next-cloudinary`** package with a drop-in upload widget and optimised `<Image>`-compatible component, plus server-side image transformations.",
      np: "Files server मा store गर्नु राम्रो होइन — serverless मा ephemeral, scale हुँदैन। Cloudinary जस्तो cloud provider प्रयोग गर्नुहोस्। `next-cloudinary` package ले Next.js integration सजिलो बनाउँछ।",
      jp: "サーバーにファイルを保存するのはサーバーレスでは不適切です。Cloudinary などのクラウドストレージを使います。`next-cloudinary` パッケージで簡単に統合できます。",
    },
  ],
  sections: [
    {
      title: {
        en: "Cloudinary setup",
        np: "Cloudinary setup",
        jp: "Cloudinary のセットアップ",
      },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "Create a free account at cloudinary.com. Your **Cloud Name** is visible on the dashboard and is needed client-side. The **API Key** and **API Secret** are server-only credentials used to sign requests. Store them in `.env.local` and expose only the cloud name to the browser via the `NEXT_PUBLIC_` prefix.",
            np: "cloudinary.com मा free account बनाउनुहोस्। Cloud Name browser मा चाहिन्छ (`NEXT_PUBLIC_`). API Key र Secret server-only राख्नुहोस्।",
            jp: "cloudinary.com で無料アカウントを作成します。Cloud Name はブラウザ側でも必要なため `NEXT_PUBLIC_` を付けます。API Key と Secret はサーバー専用です。",
          },
        },
        {
          type: "code",
          title: {
            en: ".env.local — Cloudinary environment variables",
            np: ".env.local environment variables",
            jp: ".env.local の環境変数",
          },
          code: `# .env.local

# Safe to expose to the browser — used by next-cloudinary components
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name

# Server-only — never expose to the client
CLOUDINARY_API_KEY=123456789012345
CLOUDINARY_API_SECRET=your_api_secret_here`,
        },
        {
          type: "code",
          title: {
            en: "Install next-cloudinary",
            np: "next-cloudinary install",
            jp: "next-cloudinary のインストール",
          },
          code: `npm install next-cloudinary`,
        },
        {
          type: "paragraph",
          text: {
            en: "An **upload preset** is a named configuration saved in your Cloudinary dashboard that controls how uploaded assets are stored (folder, transformations, allowed formats, size limits). An **unsigned preset** allows browser clients to upload without a signature — convenient for prototyping but less secure. A **signed preset** requires your server to generate a signed upload token first, preventing abuse.",
            np: "Upload preset Cloudinary dashboard मा save गरिएको named configuration हो। Unsigned preset browser बाट directly upload गर्छ; signed preset server signature चाहिन्छ।",
            jp: "アップロードプリセットは Cloudinary ダッシュボードで保存する名前付き設定です。未署名は直接ブラウザからアップロードでき、署名付きはサーバーでトークンを生成します。",
          },
        },
        {
          type: "code",
          title: {
            en: "CldUploadWidget — minimal unsigned upload example",
            np: "CldUploadWidget minimal example",
            jp: "CldUploadWidget の最小構成例",
          },
          code: `"use client";

import { CldUploadWidget } from "next-cloudinary";
import { useState } from "react";

interface CloudinaryUploadResult {
  public_id: string;
  secure_url: string;
  width: number;
  height: number;
  format: string;
  bytes: number;
}

export default function UploadPage() {
  const [publicId, setPublicId] = useState<string | null>(null);

  return (
    <div className="p-8 flex flex-col gap-4">
      <CldUploadWidget
        uploadPreset="my_unsigned_preset" // Created in Cloudinary dashboard
        onSuccess={(result) => {
          // result.info contains the upload response
          const info = result.info as CloudinaryUploadResult;
          setPublicId(info.public_id);
          console.log("Uploaded:", info.secure_url);
        }}
      >
        {({ open }) => (
          <button
            onClick={() => open()}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Upload Image
          </button>
        )}
      </CldUploadWidget>

      {publicId && (
        <p className="text-sm text-gray-600">
          Uploaded public ID: <code>{publicId}</code>
        </p>
      )}
    </div>
  );
}`,
        },
      ],
    },
    {
      title: {
        en: "Displaying uploaded images",
        np: "Uploaded images देखाउने",
        jp: "アップロード画像の表示",
      },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "Use **`CldImage`** from `next-cloudinary` to display Cloudinary assets. It wraps Next.js `<Image>` and automatically builds the Cloudinary URL with transformations. Pass the `public_id` stored in your database (not the full URL). Cloudinary applies transformations server-side before delivering the image, so the browser always receives the optimally-sized asset.",
            np: "`next-cloudinary` को `CldImage` ले Next.js `<Image>` wrap गर्छ र Cloudinary URL automatically build गर्छ। Database मा `public_id` store गर्नुहोस्, full URL होइन।",
            jp: "`CldImage` は Next.js の `<Image>` をラップし Cloudinary URL を自動生成します。DB には `public_id` を保存します。",
          },
        },
        {
          type: "code",
          title: {
            en: "CldImage with transformation props",
            np: "CldImage transformation props उदाहरण",
            jp: "CldImage と変換プロパティの例",
          },
          code: `import { CldImage } from "next-cloudinary";

interface ProductCardProps {
  name: string;
  imagePublicId: string;
}

export default function ProductCard({ name, imagePublicId }: ProductCardProps) {
  return (
    <div className="rounded-lg overflow-hidden shadow-md">
      {/* Basic usage — just width, height, and alt are required */}
      <CldImage
        src={imagePublicId}       // Cloudinary public_id (not full URL)
        width={400}
        height={300}
        alt={name}
        crop="fill"               // fill, scale, fit, thumb, pad, etc.
        gravity="auto"            // smart crop: auto-detect subject
        quality="auto"            // Cloudinary auto quality optimisation
        format="auto"             // serve WebP/AVIF where supported
        className="w-full object-cover"
      />
      <p className="p-4 font-semibold">{name}</p>
    </div>
  );
}`,
        },
        {
          type: "table",
          caption: {
            en: "Common CldImage transformation props",
            np: "CldImage transformation props",
            jp: "CldImage の主な変換プロパティ",
          },
          headers: [
            { en: "Prop", np: "Prop", jp: "プロパティ" },
            { en: "Values", np: "Values", jp: "値" },
            { en: "Effect", np: "प्रभाव", jp: "効果" },
          ],
          rows: [
            [
              { en: "`crop`", np: "`crop`", jp: "`crop`" },
              { en: "`fill`, `scale`, `fit`, `thumb`, `pad`", np: "fill, scale, fit, thumb, pad", jp: "fill, scale, fit, thumb, pad" },
              { en: "How the image is resized", np: "Image resize method", jp: "リサイズ方法" },
            ],
            [
              { en: "`gravity`", np: "`gravity`", jp: "`gravity`" },
              { en: "`auto`, `face`, `center`, `north`, `south`", np: "auto, face, center, north, south", jp: "auto, face, center, north, south" },
              { en: "Focus area for smart crop", np: "Smart crop focus area", jp: "スマートクロップのフォーカス" },
            ],
            [
              { en: "`quality`", np: "`quality`", jp: "`quality`" },
              { en: "`auto`, `auto:best`, `1`–`100`", np: "auto, 1–100", jp: "auto, 1–100" },
              { en: "Compression level / auto-optimise", np: "Compression level", jp: "圧縮レベル / 自動最適化" },
            ],
            [
              { en: "`format`", np: "`format`", jp: "`format`" },
              { en: "`auto`, `webp`, `avif`, `jpg`, `png`", np: "auto, webp, avif, jpg, png", jp: "auto, webp, avif, jpg, png" },
              { en: "Output image format", np: "Output format", jp: "出力フォーマット" },
            ],
            [
              { en: "`removeBackground`", np: "`removeBackground`", jp: "`removeBackground`" },
              { en: "`true`", np: "true", jp: "true" },
              { en: "AI background removal (paid plan)", np: "AI background removal", jp: "AI 背景削除（有料プラン）" },
            ],
          ],
        },
        {
          type: "code",
          title: {
            en: "Persisting the public_id in a database (example with Prisma)",
            np: "public_id database मा save गर्ने",
            jp: "public_id をデータベースに保存する例",
          },
          code: `"use client";

import { CldUploadWidget } from "next-cloudinary";

interface Props {
  productId: number;
}

export default function ProductImageUploader({ productId }: Props) {
  async function handleSuccess(result: unknown) {
    const info = (result as { info: { public_id: string } }).info;

    // Save public_id to your database via an API route or Server Action
    await fetch(\`/api/products/\${productId}\`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ imagePublicId: info.public_id }),
    });
  }

  return (
    <CldUploadWidget uploadPreset="my_unsigned_preset" onSuccess={handleSuccess}>
      {({ open }) => (
        <button onClick={() => open()}>Change product image</button>
      )}
    </CldUploadWidget>
  );
}`,
        },
      ],
    },
    {
      title: {
        en: "Customising the widget",
        np: "Widget customisation",
        jp: "ウィジェットのカスタマイズ",
      },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "Pass an **`options`** object to `CldUploadWidget` to control allowed file types, maximum file size, maximum number of files, cropping UI, and more. The options map directly to the Cloudinary Upload Widget configuration object documented at cloudinary.com/documentation/upload_widget.",
            np: "`CldUploadWidget` को `options` prop मा allowed file types, max size, max files, cropping UI आदि configure गर्न सकिन्छ।",
            jp: "`CldUploadWidget` の `options` でファイル形式、最大サイズ、最大ファイル数、クロップ UI などを設定できます。",
          },
        },
        {
          type: "code",
          title: {
            en: "options prop — file type restrictions and multiple uploads",
            np: "options prop उदाहरण",
            jp: "options プロパティの使用例",
          },
          code: `"use client";

import { CldUploadWidget } from "next-cloudinary";

export default function AvatarUpload() {
  return (
    <CldUploadWidget
      uploadPreset="my_unsigned_preset"
      options={{
        // Restrict to image types only
        resourceType: "image",
        clientAllowedFormats: ["jpg", "jpeg", "png", "webp"],

        // Maximum file size in bytes (5 MB)
        maxFileSize: 5_000_000,

        // Only allow one file at a time
        multiple: false,

        // Show a cropping step before upload — produces a 1:1 crop
        cropping: true,
        croppingAspectRatio: 1,
        croppingShowDimensions: true,

        // Target folder in your Cloudinary media library
        folder: "avatars",

        // Widget language
        language: "en",
      }}
      onSuccess={(result) => {
        const info = result.info as { public_id: string };
        console.log("Avatar public_id:", info.public_id);
      }}
    >
      {({ open }) => (
        <button
          onClick={() => open()}
          className="px-4 py-2 bg-purple-600 text-white rounded"
        >
          Upload Avatar
        </button>
      )}
    </CldUploadWidget>
  );
}`,
        },
        {
          type: "code",
          title: {
            en: "Signed upload preset — server-side signature generation",
            np: "Signed upload preset — server signature",
            jp: "署名付きアップロードプリセットの例",
          },
          code: `// app/api/cloudinary-sign/route.ts
// Generates a signed upload token so clients cannot abuse your account

import { NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST() {
  const timestamp = Math.round(new Date().getTime() / 1000);

  const signature = cloudinary.utils.api_sign_request(
    { timestamp, folder: "products" },
    process.env.CLOUDINARY_API_SECRET!
  );

  return NextResponse.json({
    timestamp,
    signature,
    apiKey: process.env.CLOUDINARY_API_KEY,
    cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  });
}

// ─── Client component uses the signed params ──────────────────────

// In CldUploadWidget, set:
// signatureEndpoint="/api/cloudinary-sign"
// This tells the widget to fetch the signature before each upload`,
        },
        {
          type: "list",
          variant: "bullet",
          items: [
            {
              en: "For **signed uploads** pass `signatureEndpoint=\"/api/cloudinary-sign\"` to `CldUploadWidget` instead of `uploadPreset` — the widget fetches the signature automatically.",
              np: "Signed upload को लागि `signatureEndpoint` prop pass गर्नुहोस्।",
              jp: "署名付きアップロードには `signatureEndpoint` プロパティを渡します。",
            },
            {
              en: "**`multiple: true`** with `maxFiles: 5` allows batch uploads of up to 5 files.",
              np: "`multiple: true` र `maxFiles` ले batch upload support गर्छ।",
              jp: "`multiple: true` と `maxFiles` でバッチアップロードをサポートします。",
            },
            {
              en: "The widget emits **`onQueuesEnd`** when all files in a batch have finished uploading — useful for showing a completion toast.",
              np: "`onQueuesEnd` ले batch complete भएपछि notification देखाउन सकिन्छ।",
              jp: "`onQueuesEnd` イベントはバッチ全体の完了後に発火し、完了トーストの表示に使えます。",
            },
          ],
        },
      ],
    },
  ],
  faq: [
    {
      question: {
        en: "Do I need a paid Cloudinary plan?",
        np: "Paid Cloudinary plan चाहिन्छ?",
        jp: "Cloudinary の有料プランが必要ですか？",
      },
      answer: {
        en: "No — Cloudinary's **free tier** includes 25 monthly credits (each credit covers roughly 1 GB of storage or 1 GB of bandwidth). For most learning projects and small production apps this is more than enough. Paid features like AI background removal, video transcoding, and advanced transformations are gated behind paid plans, but everything covered in this day's content works on the free tier.",
        np: "Free tier मा 25 monthly credits (storage/bandwidth ~1 GB each) हुन्छ — learning र small production app को लागि पर्याप्त। AI background removal आदि paid feature हो।",
        jp: "無料プランには月 25 クレジット（ストレージ・帯域幅各約 1 GB）が含まれ、学習プロジェクトには十分です。AI 背景削除などは有料機能です。",
      },
    },
    {
      question: {
        en: "What is an upload preset?",
        np: "Upload preset भनेको के हो?",
        jp: "アップロードプリセットとは？",
      },
      answer: {
        en: "An upload preset is a **named server-side configuration** stored in your Cloudinary account. It defines defaults such as the target folder, allowed formats, auto-transformations to apply on ingest, and whether the upload is **unsigned** (no authentication required from the browser) or **signed** (requires a server-generated signature). Create and manage presets in the Cloudinary Dashboard under Settings → Upload → Upload presets.",
        np: "Upload preset Cloudinary account मा save गरिएको named configuration हो। Folder, allowed formats, transformations, unsigned/signed mode define गर्छ। Dashboard → Settings → Upload मा manage गर्न सकिन्छ।",
        jp: "アップロードプリセットは Cloudinary アカウントに保存された名前付き設定です。フォルダ、許可フォーマット、変換、署名の有無などを定義します。Dashboard → Settings → Upload で管理できます。",
      },
    },
    {
      question: {
        en: "How do I restrict the file types users can upload?",
        np: "File types restrict गर्न कसरी?",
        jp: "アップロードできるファイル形式を制限するには？",
      },
      answer: {
        en: "Set **`clientAllowedFormats`** in the `options` prop (e.g. `['jpg', 'png', 'webp']`) to show a validation error in the widget before the file is uploaded. For server-side enforcement, configure the allowed formats in the **upload preset** in the Cloudinary Dashboard — this rejects invalid files even if a user bypasses the widget. Both layers together give the best security.",
        np: "`options` prop मा `clientAllowedFormats` set गर्नुहोस् client-side validation को लागि। Server-side enforcement को लागि upload preset मा allowed formats set गर्नुहोस्।",
        jp: "`clientAllowedFormats` でクライアント側のバリデーションを設定し、アップロードプリセットでサーバー側も制限します。両方を組み合わせると最も安全です。",
      },
    },
    {
      question: {
        en: "Is the public_id different from the filename?",
        np: "`public_id` filename जस्तो हो?",
        jp: "`public_id` はファイル名と異なりますか？",
      },
      answer: {
        en: "Yes. The **`public_id`** is Cloudinary's identifier for the asset, which by default is derived from the filename but without the extension (e.g. uploading `photo.jpg` gives `photo`). If you upload to a folder, the `public_id` includes the path (e.g. `products/photo`). You can override it at upload time. The `public_id` is what you pass to `CldImage` and what you should store in your database — not the full `secure_url`, because the URL format can change with CDN configuration.",
        np: "`public_id` extension बिनाको filename हो (e.g. `photo`). Folder मा upload गरे path include हुन्छ (e.g. `products/photo`). Database मा `public_id` store गर्नुहोस्, full URL होइन।",
        jp: "`public_id` は拡張子を除いたファイル名が基本です（例：`photo.jpg` → `photo`）。フォルダにアップロードするとパスが含まれます。DB には `public_id` を保存します。",
      },
    },
    {
      question: {
        en: "How do I delete images from Cloudinary?",
        np: "Cloudinary बाट images कसरी delete गर्ने?",
        jp: "Cloudinary から画像を削除するには？",
      },
      answer: {
        en: "Use the Cloudinary Node.js SDK in a Route Handler or Server Action. Call **`cloudinary.uploader.destroy(publicId)`** — it requires your API Secret and must run server-side. Never expose deletion logic to the client directly. Always verify the user owns the resource before deleting it. Example: `import { v2 as cloudinary } from 'cloudinary'; await cloudinary.uploader.destroy('products/photo');`",
        np: "Server-side (Route Handler/Server Action) मा `cloudinary.uploader.destroy(publicId)` call गर्नुहोस्। API Secret server-only राख्नुहोस्। Delete अघि ownership verify गर्नुहोस्।",
        jp: "Route Handler や Server Action で `cloudinary.uploader.destroy(publicId)` を呼び出します。API Secret はサーバー専用です。削除前に所有権を確認してください。",
      },
    },
  ],
};
