import type { LessonDay } from "@/lib/learn/lesson-types";

export const NEXTJS_DAY_30_LESSONS: LessonDay = {
  day: 30,
  title: "Files and Image Optimization",
  totalMinutes: 83,
  difficulty: "Advanced",
  lessons: [
    {
      id: "nextjs-30-1",
      title: "next/image and Responsive Images",
      durationMinutes: 17,
      explanation: `
Images are often some of the largest resources loaded by a web page. Sending a huge image to a small mobile screen wastes bandwidth and can make the page feel slow.

Next.js provides the Image component from next/image to help manage common image optimization concerns.

A basic example is:

import Image from "next/image";

<Image
  src="/hero.jpg"
  alt="Developer working"
  width={1200}
  height={800}
/>

The width and height describe the image dimensions and help the browser reserve space before the image loads. This reduces layout shift, where page content unexpectedly moves as an image appears.

For responsive layouts, sizes tells the browser how much space the image is expected to occupy at different viewport widths. This helps it choose an appropriate image resource.

fill is useful when the image should fill a positioned parent container. When using fill, the parent normally needs a defined positioning context and the image should have an appropriate object-fit strategy.

The alt attribute is important for accessibility. Do not treat it as optional simply because the image component can render without meaningful text. Decorative images may use an empty alt value when appropriate.
`,
      diagram: `
Original image
     |
     v
next/image
     |
     +--> optimized dimensions
     +--> responsive source selection
     +--> lazy loading
     +--> reserved layout space
     |
     v
Browser
     |
     v
Appropriate image for viewport
`,
      codeExample: {
        title: "Responsive image with fill and sizes",
        code: `import Image from "next/image";

export function HeroImage() {
  return (
    <div className="relative aspect-video w-full">
      <Image
        src="/hero.jpg"
        alt="Developer learning Next.js"
        fill
        sizes="(max-width: 768px) 100vw, 50vw"
        className="object-cover"
      />
    </div>
  );
}`,
      },
      keyTakeaways: [
        "next/image helps optimize image delivery.",
        "Width and height help reserve layout space.",
        "sizes helps the browser choose an appropriate responsive image.",
        "fill is useful when an image should fill a positioned container.",
        "Alt text remains an accessibility responsibility."
      ],
      commonMistakes: [
        "Using fill without a properly sized parent.",
        "Omitting sizes for important responsive images.",
        "Using huge original images for small displays.",
        "Using meaningless alt text such as image123.jpg."
      ],
      quiz: [
        {
          question: "What problem do width and height help prevent?",
          options: ["Layout shift", "Authentication errors", "Database deadlocks", "Route conflicts"],
          correctIndex: 0,
          explanation: "Known image dimensions let the browser reserve space before the image loads."
        },
        {
          question: "What does sizes help communicate?",
          options: [
            "Expected rendered image size at different viewport widths",
            "Database size",
            "Font size",
            "Cookie size"
          ],
          correctIndex: 0,
          explanation: "sizes helps the browser choose an appropriate image resource for the rendered size."
        }
      ]
    },
    {
      id: "nextjs-30-2",
      title: "Image Optimization and Remote Images",
      durationMinutes: 17,
      explanation: `
Images can come from the local application or from an external image host. Local images are straightforward because the application knows where the file comes from.

Remote images require additional configuration. Next.js needs to know which remote hosts are allowed because accepting arbitrary image URLs would create security and resource-management problems.

Modern Next.js uses remotePatterns in next.config.ts to define permitted remote sources.

Example:

const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.example.com",
        pathname: "/**",
      },
    ],
  },
};

The image source should be controlled carefully. Do not simply allow every hostname unless your application genuinely requires it.

Image optimization also involves choosing appropriate dimensions and formats. A 4000px image is not automatically better for a 400px card. Store or generate useful sizes and deliver the size the browser actually needs.

For user-generated images, consider moderation, content validation, storage limits, and image processing. Optimization is a performance concern, but image URLs are also part of your security and infrastructure design.
`,
      diagram: `
Remote image URL
      |
      v
Allowed remotePatterns?
      |
   +-- no --> reject
   |
  yes
   |
   v
Image optimization
   |
   +--> appropriate size
   +--> appropriate format
   +--> caching/delivery
   |
   v
Browser
`,
      codeExample: {
        title: "Allowing a controlled remote image host",
        code: `// next.config.ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.example.com",
        pathname: "/images/**",
      },
    ],
  },
};

export default nextConfig;

// Component
import Image from "next/image";

export function Avatar() {
  return (
    <Image
      src="https://cdn.example.com/images/avatar.jpg"
      alt="User avatar"
      width={64}
      height={64}
    />
  );
}`,
      },
      keyTakeaways: [
        "Remote images should come from explicitly allowed sources.",
        "remotePatterns controls permitted remote image locations.",
        "Do not allow arbitrary remote hosts without a clear reason.",
        "Image dimensions should match actual display needs.",
        "User-generated media needs validation and storage controls."
      ],
      commonMistakes: [
        "Allowing every remote hostname.",
        "Using very large images for tiny UI elements.",
        "Forgetting that remote image configuration affects deployment.",
        "Assuming image optimization alone solves all media performance problems."
      ],
      quiz: [
        {
          question: "Why configure remotePatterns?",
          options: [
            "To control allowed remote image sources",
            "To create database relationships",
            "To define translations",
            "To enable Server Actions"
          ],
          correctIndex: 0,
          explanation: "remotePatterns defines which external image sources Next.js can optimize."
        },
        {
          question: "Why avoid arbitrary remote image hosts?",
          options: [
            "Resource and security control",
            "They cannot contain images",
            "They always use HTTP",
            "They disable React"
          ],
          correctIndex: 0,
          explanation: "Explicitly controlling image sources helps prevent uncontrolled resource access and processing."
        }
      ]
    },
    {
      id: "nextjs-30-3",
      title: "next/font and Static Assets",
      durationMinutes: 15,
      explanation: `
Fonts affect both visual design and performance. Next.js provides next/font to integrate fonts while reducing common loading and layout problems.

Google fonts can be imported through next/font/google, while local fonts can be loaded through next/font/local.

Example:

import { Inter } from "next/font/google";

const inter = Inter({
  subsets: ["latin"],
});

The generated class can then be applied to the document body.

For self-hosted fonts, next/font/local can load files from your project. This can be useful when you have a licensed custom font or want predictable asset ownership.

Static assets that should be served directly can be placed in public/. A file public/logo.svg can then be referenced as /logo.svg.

Do not put every application file in public. Public assets are directly addressable. Source code, private configuration, and sensitive files belong elsewhere.

Favicon and application icon conventions can also be handled through the app directory's metadata file conventions.
`,
      diagram: `
Application
   |
   +--> next/font
   |      |
   |      +--> Google fonts
   |      +--> Local fonts
   |
   +--> public/
          |
          +--> logo.svg
          +--> favicon assets
          +--> public images
`,
      codeExample: {
        title: "Optimized font and static asset",
        code: `import { Inter } from "next/font/google";

const inter = Inter({
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {children}
      </body>
    </html>
  );
}

// public/logo.svg
// Can be referenced as:
// /logo.svg`,
      },
      keyTakeaways: [
        "next/font provides a Next.js-integrated font loading strategy.",
        "Fonts can come from Google or local project files.",
        "public/ contains directly addressable static assets.",
        "Do not put secrets or private files in public/.",
        "Asset organization should reflect whether a file is publicly accessible."
      ],
      commonMistakes: [
        "Putting sensitive files in public/.",
        "Loading fonts manually when next/font can manage them.",
        "Using many font weights unnecessarily.",
        "Forgetting that font choices affect page performance."
      ],
      quiz: [
        {
          question: "Which package API is used for optimized font integration?",
          options: ["next/font", "next/assets", "next/typeface", "next/styles"],
          correctIndex: 0,
          explanation: "Next.js provides next/font for font integration."
        },
        {
          question: "What is a key property of files in public/?",
          options: [
            "They are directly addressable by URL",
            "They are always private",
            "They are database records",
            "They can only be used on the server"
          ],
          correctIndex: 0,
          explanation: "Files in public/ are served as publicly addressable static assets."
        }
      ]
    },
    {
      id: "nextjs-30-4",
      title: "File Uploads and Validation",
      durationMinutes: 17,
      explanation: `
File uploads introduce a different class of application concerns because users can send arbitrary binary data to your server or storage system.

A browser can submit a file through FormData. A Next.js Route Handler or Server Action can receive the form submission, validate the file, and then store it.

A basic upload flow is:

Browser
→ FormData
→ server validation
→ storage
→ database metadata

Validation should include file size, allowed content types, file names where relevant, and business rules. Do not trust a client-side file extension or MIME type as the only security check.

Large files also require an architectural decision. Uploading every large file through your application server can consume memory, CPU, bandwidth, and server execution time.

For small controlled uploads, an application server may be acceptable. For larger production media systems, object storage and direct uploads are often better.

The database normally stores metadata such as the object key, original name, content type, size, owner, and timestamps. The binary file itself lives in storage.
`,
      diagram: `
Browser
   |
   | FormData
   v
Next.js server
   |
   +--> validate size/type
   |
   +--> authenticate user
   |
   v
Object Storage
   |
   +--> file bytes
   |
   v
Database
   |
   +--> key
   +--> owner
   +--> size
   +--> content type
`,
      codeExample: {
        title: "Basic file validation in a Route Handler",
        code: `import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const formData = await request.formData();
  const file = formData.get("file");

  if (!(file instanceof File)) {
    return NextResponse.json(
      { error: "File is required" },
      { status: 400 }
    );
  }

  const maxSize = 5 * 1024 * 1024;

  if (file.size > maxSize) {
    return NextResponse.json(
      { error: "File is too large" },
      { status: 413 }
    );
  }

  const allowedTypes = new Set([
    "image/jpeg",
    "image/png",
    "image/webp",
  ]);

  if (!allowedTypes.has(file.type)) {
    return NextResponse.json(
      { error: "Unsupported file type" },
      { status: 415 }
    );
  }

  // Store the validated file.
  // Do not trust this example as complete malware/content validation.

  return NextResponse.json({ ok: true });
}`,
      },
      keyTakeaways: [
        "File uploads should be validated on the server.",
        "FormData is a common transport for browser file uploads.",
        "Validate size, type, ownership, and application-specific rules.",
        "Client-side validation improves UX but is not a security boundary.",
        "Large uploads often belong in object storage rather than application memory."
      ],
      commonMistakes: [
        "Trusting the file extension alone.",
        "Validating only in the browser.",
        "Allowing unlimited upload sizes.",
        "Storing arbitrary user-uploaded files directly on the application server without a storage strategy."
      ],
      quiz: [
        {
          question: "Where should important upload validation happen?",
          options: ["Only the browser", "The server", "Only CSS", "Only the database UI"],
          correctIndex: 1,
          explanation: "The server must enforce validation because clients cannot be trusted."
        },
        {
          question: "What should a production upload system validate?",
          options: [
            "Only the file name",
            "Size, type, ownership, and application rules",
            "Only the extension",
            "Only the browser"
          ],
          correctIndex: 1,
          explanation: "Production validation should cover multiple properties and the application's authorization rules."
        }
      ]
    },
    {
      id: "nextjs-30-5",
      title: "Object Storage and Production Media Architecture",
      durationMinutes: 17,
      explanation: `
Object storage is designed to store files such as images, videos, documents, and backups. Examples include Amazon S3 and S3-compatible services.

A common production architecture avoids sending a large file through the Next.js application server when the browser can upload it directly to object storage.

The flow can be:

1. Browser asks the application for permission to upload.
2. Server authenticates the user and validates the requested upload.
3. Server creates a short-lived presigned upload URL.
4. Browser uploads directly to object storage.
5. Browser or a backend process tells the application that the upload completed.
6. Database stores metadata and the object key.

A presigned URL is a temporary URL that grants limited access to a specific storage operation. It should expire and should be scoped as narrowly as possible.

The database should generally store metadata rather than the entire file:

media
- id
- ownerId
- objectKey
- contentType
- size
- width
- height
- createdAt

The actual bytes live in object storage.

For delivery, a CDN can cache public or appropriately controlled media closer to users. Image processing can generate thumbnails and multiple sizes so clients do not download the original full-resolution file for every card.
`,
      diagram: `
                 1. Upload request
Browser --------------------> Next.js
                                |
                                | authenticate
                                | validate
                                |
                                v
                         Presigned URL
                                |
                 3. Direct upload
Browser --------------------> Object Storage
                                |
                                v
                         Stored object

                 4. Metadata
Browser/Server -------------> Database
                                |
                         objectKey + metadata

                 Delivery
Browser <---- CDN <---- Object Storage
`,
      codeExample: {
        title: "Conceptual direct-upload flow",
        code: `// Server-side concept:
//
// 1. Authenticate the user.
// 2. Validate file type and size.
// 3. Generate a short-lived presigned upload URL.
// 4. Return the URL to the browser.

// Browser:

async function uploadFile(file: File) {
  const response = await fetch("/api/uploads/presign", {
    method: "POST",
    body: JSON.stringify({
      fileName: file.name,
      contentType: file.type,
      size: file.size,
    }),
    headers: {
      "Content-Type": "application/json",
    },
  });

  const { uploadUrl } = await response.json();

  await fetch(uploadUrl, {
    method: "PUT",
    body: file,
    headers: {
      "Content-Type": file.type,
    },
  });
}`,
      },
      keyTakeaways: [
        "Object storage is designed for large file objects.",
        "Direct uploads can reduce load on the application server.",
        "Presigned URLs provide temporary scoped upload access.",
        "The database usually stores file metadata and object keys.",
        "CDNs and generated image sizes can improve media delivery."
      ],
      commonMistakes: [
        "Creating permanent public upload URLs.",
        "Putting storage credentials in browser code.",
        "Storing huge binary files directly in a relational database without a deliberate reason.",
        "Trusting the browser to choose the storage object key.",
        "Forgetting to authorize who can create or access an object."
      ],
      quiz: [
        {
          question: "Why use direct-to-object-storage uploads?",
          options: [
            "To reduce large-file processing through the application server",
            "To disable authentication",
            "To remove the database",
            "To make all files public"
          ],
          correctIndex: 0,
          explanation: "Direct uploads can reduce bandwidth, memory, and execution load on the application server."
        },
        {
          question: "What does a presigned URL generally provide?",
          options: [
            "Temporary scoped access to a storage operation",
            "A permanent database password",
            "A route group",
            "A CSS class"
          ],
          correctIndex: 0,
          explanation: "Presigned URLs can grant temporary permission for a specific storage operation."
        }
      ]
    }
  ],
  finalQuiz: [
    {
      question: "What does next/image help with?",
      options: [
        "Image optimization and responsive delivery",
        "Database migrations",
        "Authentication",
        "Translations"
      ],
      correctIndex: 0,
      explanation: "next/image provides an optimized image component with responsive and loading-related capabilities."
    },
    {
      question: "Why use remotePatterns?",
      options: [
        "To control allowed remote image sources",
        "To create API routes",
        "To configure databases",
        "To define fonts"
      ],
      correctIndex: 0,
      explanation: "remotePatterns restricts which remote image locations can be used."
    },
    {
      question: "What is public/ intended for?",
      options: [
        "Publicly addressable static assets",
        "Passwords",
        "Private database files",
        "Server secrets"
      ],
      correctIndex: 0,
      explanation: "Files in public/ are directly accessible through URLs."
    },
    {
      question: "Where should upload validation be enforced?",
      options: ["Only in the browser", "On the server", "Only in CSS", "Only after download"],
      correctIndex: 1,
      explanation: "Server-side validation is required because client-side checks can be bypassed."
    },
    {
      question: "What does object storage normally hold?",
      options: ["File bytes", "Only SQL queries", "Only route definitions", "Only React components"],
      correctIndex: 0,
      explanation: "Object storage is designed to store file objects such as images and documents."
    },
    {
      question: "What does the database commonly store for uploaded media?",
      options: [
        "Metadata and object references",
        "Only the browser cache",
        "The user's entire operating system",
        "Only CSS"
      ],
      correctIndex: 0,
      explanation: "A database commonly stores ownership, object key, type, size, timestamps, and other metadata."
    }
  ],
  project: {
    name: "Production Media Management System",
    goal: "Build a Next.js media application that uses optimized images, fonts, static assets, validated uploads, and an object-storage architecture.",
    brief: `
Build a media management application called "MediaHub".

Users should be able to view a responsive image gallery, upload images, and see optimized previews.

Use next/image for gallery images and configure remote images safely. Add next/font for the application's typography and use public/ for appropriate static assets.

Implement an upload endpoint that validates file size and allowed image types. Design the production architecture so large files can be uploaded directly to object storage using presigned URLs.

Store media metadata in the database and keep the actual binary objects in object storage.
`,
    steps: [
      "Create a responsive media gallery.",
      "Use next/image for local images.",
      "Use fill and sizes for at least one responsive image.",
      "Configure an approved remote image host.",
      "Add an optimized application font with next/font.",
      "Add public static assets such as a logo.",
      "Create an upload form using FormData.",
      "Validate upload size and content type on the server.",
      "Add authentication/ownership checks to the upload flow.",
      "Design a media database model containing object metadata.",
      "Create a presigned-upload architecture.",
      "Document how a CDN would deliver stored images.",
      "Generate thumbnails or multiple image sizes as a stretch feature."
    ],
    acceptance: [
      "Images use next/image appropriately.",
      "Responsive images provide useful sizes.",
      "Remote image sources are explicitly controlled.",
      "The application uses next/font.",
      "Static assets are stored appropriately.",
      "Uploads are validated on the server.",
      "Large uploads are designed around object storage.",
      "Storage credentials are never exposed to the browser.",
      "The database stores media metadata rather than relying on the file itself for application state.",
      "The architecture can scale beyond a single application server."
    ],
    stretch: [
      "Implement an actual S3-compatible presigned upload flow.",
      "Generate thumbnails asynchronously.",
      "Add image dimensions to the media metadata.",
      "Serve public media through a CDN.",
      "Add private media using signed download URLs.",
      "Add virus/malware scanning before marking uploads as available."
    ]
  },
};
