import type { LessonDay } from "@/lib/learn/lesson-types";

export const LARAVEL_DAY_22_LESSONS: LessonDay = {
  day: 22,
  title: "File storage, the HTTP client & processes",
  totalMinutes: 92,
  difficulty: "Intermediate",
  lessons: [
    {
      id: "filesystem-disks",
      title: "Disks — local, public & S3",
      durationMinutes: 12,
      explanation: "Three things your application talks to that live outside it:\n\n```text\nApplication\n   │\n   ├── Files            →  local / public / S3\n   ├── External APIs    →  HTTP client\n   └── System commands  →  Process\n```\n\nAnd one idea running through all of them:\n\n> <b>Your application should not care where a file physically lives or how an external service is implemented. It should talk to an abstraction.</b>\n\n---\n\n### 1. Basic — what a disk is\n\nInstead of writing paths:\n\n```php\nfile_put_contents('/var/www/app/storage/reports/report.pdf', $contents);\n```\n\nyou write:\n\n```php\nStorage::put('reports/report.pdf', $contents);\n```\n\n<b>A <i>disk</i></b> (a named, configured storage location) is what the second version is talking to. Configured in `config/filesystems.php`, and the three you will meet are:\n\n```text\nlocal     storage/app, not reachable from the web\npublic    storage/app/public, meant to be served\ns3        object storage, not on your server at all\n```\n\n```php\nStorage::disk('s3')->put('reports/report.pdf', $contents);\n```\n\n<b>The gain is that the path is configuration, not code.</b> Moving from the server to S3 changes a `.env` value rather than every method that touches a file.\n\n---\n\n### 2. Intermediate — public, and the link\n\nThe `public` disk is for files users are meant to fetch: avatars, uploaded images, a logo.\n\nBut it writes to `storage/app/public`, and the web server only serves `public/`. Putting a file there does not make it reachable. <b>That is what `storage:link` is for:</b>\n\n```bash\nphp artisan storage:link\n```\n\n```text\nstorage/app/public\n        │\n        │ symbolic link\n        ▼\npublic/storage\n```\n\nNow a file stored as `avatars/user.jpg` is served at `/storage/avatars/user.jpg`.\n\n```text\nupload\n  ↓\npublic disk\n  ↓\nstorage:link\n  ↓\n/storage/avatars/user.jpg\n```\n\nThe symptom of forgetting it is a 404 on every uploaded image, with the file plainly sitting on disk. And it has to be run on every environment, which is why it belongs in your deploy script rather than your memory.\n\n<b>The `local` disk is the opposite</b>: nothing under it is reachable from the web, which is right for anything private. Serving one of those means reading it through a controller that checks authorization first.\n\n---\n\n### 3. Advanced — why object storage\n\nOn one server, the local disk is fine. Add a second and it stops being fine:\n\n```text\nuser uploads → Server 1 → the file is on Server 1\n\nuser reloads → Server 2 → file missing\n```\n\nThe load balancer sent them elsewhere, and the file is not there. <b>The local disk assumes there is one server, forever.</b>\n\n```text\nServer 1 ─┐\nServer 2 ─┼──→  S3\nServer 3 ─┘\n```\n\nOne store, every server. And it survives replacing a server, which a modern deploy does routinely.\n\nThree more reasons it is usually right in production: your files stop counting towards the disk on your application server, backups become somebody else's problem, and large files can be served without passing through PHP at all.\n\nThe practical arrangement most applications land on:\n\n```text\nlocal    temporary files, caches, things you can regenerate\npublic   small public assets, on a single-server app\ns3       anything a user uploaded, in production\n```\n\nAnd because the disk name is configuration, <b>the same code runs against `local` in tests and `s3` in production</b>, which is the reason to use `Storage` even on a one-server application you are sure will never grow.",
      diagram: `Three things outside your application

  Application
     │
     ├── Files            →  local / public / S3
     ├── External APIs    →  HTTP client
     └── System commands  →  Process

  Your code should say "store this file", not
  "write to /var/www/...".


A disk is a named, configured location

  file_put_contents('/var/www/app/storage/...')   a path in code
  Storage::put('reports/report.pdf', ...)          a disk

  local     storage/app, NOT reachable from the web
  public    storage/app/public, meant to be served
  s3        object storage, not on your server at all

  The path becomes configuration. Moving to S3 is a
  .env change, not a rewrite.


public, and the link

  The public disk writes to storage/app/public.
  The web server serves public/. Those are different
  places, so a file there is not reachable.

    php artisan storage:link

    storage/app/public
            │
            │ symbolic link
            ▼
    public/storage

  Stored as avatars/user.jpg → served at
  /storage/avatars/user.jpg

  Forgetting it: a 404 on every image, with the file
  plainly sitting on disk. Run it on every environment,
  from the deploy script rather than from memory.

  The local disk is the opposite: nothing under it is
  web-reachable, which is right for private files. Serve
  those through a controller that authorizes first.


Why object storage

  One server: local is fine.
  Two servers:

    user uploads → Server 1 → the file is on Server 1
    user reloads → Server 2 → file missing

  The local disk assumes one server, forever.

    Server 1 ─┐
    Server 2 ─┼──→  S3
    Server 3 ─┘

  One store, every server. And it survives replacing a
  server, which deploys do routinely.

  Plus: files stop filling your application disk, backups
  are somebody else's problem, and large files can be
  served without passing through PHP.


Where most applications land

  local    temporary files, caches, regenerable things
  public   small public assets, single-server apps
  s3       anything a user uploaded, in production

  And because the disk is configuration, the same code
  runs against local in tests and s3 in production.
  That is the reason to use Storage even on an app you
  are sure will never grow.`,
      codeExample: {
        title: "Disks, and the link that catches everyone",
        code: `<?php
// config/filesystems.php

return [
    'default' => env('FILESYSTEM_DISK', 'local'),

    'disks' => [

        // Not reachable from the web. Private by default.
        'local' => [
            'driver' => 'local',
            'root'   => storage_path('app/private'),
        ],

        // Meant to be served, once storage:link exists.
        'public' => [
            'driver'     => 'local',
            'root'       => storage_path('app/public'),
            'url'        => env('APP_URL') . '/storage',
            'visibility' => 'public',
        ],

        // Not on your server at all.
        's3' => [
            'driver' => 's3',
            'key'    => env('AWS_ACCESS_KEY_ID'),
            'secret' => env('AWS_SECRET_ACCESS_KEY'),
            'region' => env('AWS_DEFAULT_REGION'),
            'bucket' => env('AWS_BUCKET'),

            // For MinIO, DigitalOcean Spaces and anything
            // else S3-compatible but not S3 itself:
            'endpoint'                => env('AWS_ENDPOINT'),
            'use_path_style_endpoint' => env('AWS_USE_PATH_STYLE_ENDPOINT', false),
        ],

    ],
];


# ---------- The S3 driver is a separate package ----------

composer require league/flysystem-aws-s3-v3

# Laravel ships the disk configuration; the adapter that
# talks to S3 is not installed by default.


# ---------- The link ----------

php artisan storage:link

#   storage/app/public  →  public/storage
#
# Put it in your deploy script. Forgetting it on a new
# environment is a 404 on every uploaded image, with the
# file sitting plainly on disk.


<?php
// ---------- Using them ----------

use Illuminate\\Support\\Facades\\Storage;

// The default disk, from FILESYSTEM_DISK.
Storage::put('reports/report.pdf', $contents);

// A named disk.
Storage::disk('public')->put('avatars/user.jpg', $contents);
Storage::disk('s3')->put('invoices/2026/INV-001.pdf', $contents);

// The same line of application code, wherever the file goes.


# ---------- Which is why this works ----------

# .env, locally
FILESYSTEM_DISK=public

# .env, in production
FILESYSTEM_DISK=s3

# phpunit.xml, in tests
# <env name="FILESYSTEM_DISK" value="local"/>


<?php
// ---------- Private files are not served directly ----------

// The local disk is not web-reachable, so this is the
// only way in, and it can authorize first.
Route::get('/invoices/{invoice}/pdf', function (Invoice $invoice) {
    Gate::authorize('view', $invoice);

    return Storage::disk('local')->download($invoice->pdf_path);
})->middleware('auth');`,
      },
      keyTakeaways: [
        "<b>Your application should say \"store this file\", not name a path on a server.</b>",
        "<b>A disk is a named, configured storage location</b>, defined in `config/filesystems.php`.",
        "<b>`local` is not reachable from the web; `public` is meant to be served; `s3` is not on your server.</b>",
        "Because the disk is configuration, the same code can write locally in tests and to S3 in production.",
        "<b>The `public` disk writes to `storage/app/public`, which the web server does not serve.</b>",
        "<b>`php artisan storage:link` creates the symlink</b> that makes those files reachable at `/storage/...`.",
        "Forgetting the link is a 404 on every image, so run it from your deploy script.",
        "<b>The local disk assumes there is one server forever</b>, and breaks the moment there are two.",
        "<b>Object storage gives every server one store</b>, and survives a server being replaced.",
        "Private files belong on a non-public disk and are served through a controller that authorizes first.",
      ],
      commonMistakes: [
        "<b>Forgetting `storage:link` on a new environment.</b> Every uploaded image 404s while sitting on disk.",
        "<b>Writing absolute paths instead of using `Storage`.</b> Moving to S3 then means rewriting every call.",
        "<b>Putting private files on the public disk.</b> The URL is guessable and nothing checks who is asking.",
        "<b>Using the local disk on a multi-server deployment.</b> Half the requests cannot find the file.",
        "<b>Assuming `storage:link` is one-time.</b> It is per environment, including every fresh container.",
      ],
      quiz: [
        {
          question: "What does `php artisan storage:link` create?",
          options: [
            "A new disk",
            "A symlink from `public/storage` to `storage/app/public`, so those files can be served",
            "A database record",
            "An S3 bucket",
          ],
          correctIndex: 1,
          explanation: "Without it, files on the public disk are on disk but not reachable.",
        },
        {
          question: "Why does the local disk break on a multi-server deployment?",
          options: [
            "It is slower",
            "The file exists only on the server that received the upload",
            "Laravel disables it",
            "It has a size limit",
          ],
          correctIndex: 1,
          explanation: "The next request may be served by a different machine.",
        },
        {
          question: "Where do private user files belong?",
          options: [
            "The public disk, with a long random filename",
            "A non-public disk, served through a controller that authorizes first",
            "The database",
            "The public disk, with `.htaccess`",
          ],
          correctIndex: 1,
          explanation: "A guessable URL with nothing checking who is asking is not protection.",
        },
        {
          question: "What is the main benefit of the `Storage` abstraction?",
          options: [
            "Faster file access",
            "The storage location becomes configuration, so the same code runs against local or S3",
            "Automatic backups",
            "Built-in image resizing",
          ],
          correctIndex: 1,
          explanation: "Which is why it is worth using even on a one-server application.",
        },
      ],
    },
    {
      id: "storing-files",
      title: "Storing files — put, store & the filename question",
      durationMinutes: 11,
      explanation: "Five methods that all write a file, and one decision underneath them.\n\n---\n\n### 1. Basic — contents you already have\n\n```php\nStorage::put('documents/file.txt', $contents);\n\nStorage::disk('s3')->put('documents/file.txt', $contents);\n```\n\n```text\npath + contents  →  Storage\n```\n\nYou name the file, you supply the bytes. That is right for something your application generated: a PDF, an export, a report.\n\n---\n\n### 2. Intermediate — files that arrived from a user\n\nAn upload is different, because you have an `UploadedFile` rather than a string, and <b>you almost certainly do not want the name it came with.</b>\n\nFour methods, and the difference is who chooses the filename and where you call it from:\n\n```text\nStorage::putFile('documents', $file)               Laravel names it\nStorage::putFileAs('documents', $file, 'a.pdf')    you name it\n\n$file->store('documents')                          Laravel names it\n$file->storeAs('documents', 'a.pdf')               you name it\n```\n\nThe `Storage::` pair and the `$file->` pair do the same thing; the second reads better in a controller and takes the disk as a last argument:\n\n```php\n$path = $request->file('avatar')->store('avatars', 'public');\n\n$path = $request->file('avatar')->storeAs('avatars', \"user-{$user->id}.jpg\", 'public');\n```\n\n<b>Every one of them returns the path</b>, and that is what you store on the model. Not the URL, which changes if you move disks or domains, and not the original name.\n\n---\n\n### 3. Advanced — why the generated name is the safe default\n\nA filename from a browser is user input, and it has been the source of several distinct problems:\n\n```text\n../../.env                path traversal\nreport.pdf.php            an executable extension\nCV.pdf uploaded twice     one overwrites the other\nsome very long name…      breaks on some filesystems\nrésumé (1).pdf            encoding, spaces, brackets in URLs\n```\n\n`store()` sidesteps all of it by generating a random name and keeping only the extension. <b>Use `store()` by default and `storeAs()` only when the name genuinely matters</b>, and even then build it from your own data (`user-{id}`, `invoice-{number}`) rather than from theirs.\n\nWhen you do want to show people the original name, keep it as data:\n\n```php\n$invoice->update([\n    'path'          => $request->file('doc')->store('invoices', 's3'),\n    'original_name' => $request->file('doc')->getClientOriginalName(),\n]);\n```\n\nThe path is what the filesystem uses; the original name is a label you render, and later hand to `download()` as the name the browser should save it under.\n\nTwo more things worth doing every time.\n\n<b>Validate before storing.</b> `['required', 'file', 'mimes:pdf', 'max:10240']` checks the actual file, not the claimed content type, and `max` is in kilobytes. Without a size limit, the upload limit is whatever PHP allows.\n\n<b>And never trust the client's `Content-Type`.</b> It is a header the sender wrote. `mimes:` inspects the file itself, which is the difference between a rule and a suggestion.",
      diagram: `Contents you already have

  Storage::put('documents/file.txt', \$contents)

    path + contents  →  Storage

  Right for something you generated: a PDF, an export.


Files that arrived from a user

  You have an UploadedFile, not a string — and almost
  certainly do not want the name it came with.

  Storage::putFile('documents', \$file)             Laravel names it
  Storage::putFileAs('documents', \$file, 'a.pdf')  you name it

  \$file->store('documents')                        Laravel names it
  \$file->storeAs('documents', 'a.pdf')             you name it

  Same thing. The \$file-> pair reads better in a
  controller and takes the disk last.

  All of them return the PATH. Store that on the model.
  Not the URL, which changes with the disk or domain.
  Not the original name.


Why the generated name is the safe default

  A filename from a browser is user input:

    ../../.env              path traversal
    report.pdf.php          an executable extension
    CV.pdf, twice           one overwrites the other
    a very long name…       breaks on some filesystems
    résumé (1).pdf          encoding, spaces, brackets

  store() sidesteps all of it: a random name, the
  extension kept.

  Use store() by default. Use storeAs() only when the
  name matters, and build it from YOUR data:
  user-{id}, invoice-{number}.

  Want to show the original name? Keep it as DATA:

    'path'          => \$file->store('invoices', 's3'),
    'original_name' => \$file->getClientOriginalName(),

  The path is what the filesystem uses. The original
  name is a label you render, and later hand to
  download() as the name the browser saves it under.


Every time

  Validate first
    ['required', 'file', 'mimes:pdf', 'max:10240']
    max is in KILOBYTES. Without it, your upload limit
    is whatever PHP allows.

  Never trust Content-Type
    It is a header the sender wrote. mimes: inspects the
    file itself. That is the difference between a rule
    and a suggestion.`,
      codeExample: {
        title: "Storing an upload safely",
        code: `<?php

use Illuminate\\Http\\Request;
use Illuminate\\Support\\Facades\\Storage;

// ---------- Contents you generated ----------

Storage::put('reports/2026-09.pdf', $pdfContents);
Storage::disk('s3')->put('exports/invoices.csv', $csv);


// ---------- An upload ----------

public function store(Request $request)
{
    // Validate first. mimes: inspects the file, not the
    // Content-Type header the sender wrote.
    $request->validate([
        'document' => ['required', 'file', 'mimes:pdf', 'max:10240'],
    ]);

    // Laravel generates a random name and keeps the extension.
    $path = $request->file('document')->store('documents', 's3');
    // documents/9f2b1c...pdf

    // Store the PATH on the model, not a URL.
    $invoice->update([
        'document_path' => $path,

        // The original name is a label you render later.
        'document_name' => $request->file('document')->getClientOriginalName(),
    ]);
}


// ---------- The four ways, side by side ----------

Storage::putFile('documents', $file);                 // Laravel names it
Storage::putFileAs('documents', $file, 'report.pdf'); // you name it

$file->store('documents', 'public');                  // Laravel names it
$file->storeAs('documents', 'report.pdf', 'public');  // you name it

// All of them return the path.


// ---------- When the name matters ----------

// ❌ The name came from the browser.
$file->storeAs('documents', $file->getClientOriginalName());

// The generated name on its own, when you want Laravel's
// name but your own directory or disk:
$name = $file->hashName();            // 8f3c…d1.pdf
$file->storeAs('invoices/2026', $name, 's3');

// A filename is user input:
//   ../../.env          path traversal
//   report.pdf.php      an executable extension
//   CV.pdf twice        one overwrites the other

// ✓ Build it from your own data.
$file->storeAs(
    'invoices',
    "invoice-{$invoice->number}.pdf",
    's3',
);


// ---------- Giving the original name back at download time ----------

return Storage::disk('s3')->download(
    $invoice->document_path,     // where it actually is
    $invoice->document_name,     // what the browser saves it as
);


// ---------- Cleaning up ----------

// Replacing a file? Delete the old one, or the bucket
// grows forever with orphans nothing points at.
if ($invoice->document_path) {
    Storage::disk('s3')->delete($invoice->document_path);
}

$invoice->document_path = $request->file('document')->store('documents', 's3');
$invoice->save();`,
      },
      keyTakeaways: [
        "<b>`Storage::put()` writes contents you already have</b>, which suits files your application generated.",
        "<b>An upload gives you an `UploadedFile`</b>, and `store()`, `storeAs()`, `putFile()` and `putFileAs()` handle it.",
        "<b>`store()` generates a filename; `storeAs()` lets you choose one.</b>",
        "The `$file->` methods read better in a controller and take the disk as the last argument.",
        "<b>All of them return the path, and that is what you store on the model</b>, not a URL.",
        "<b>A filename from a browser is user input</b>, and has caused path traversal, executable extensions and collisions.",
        "<b>Use `store()` by default</b>, and build any custom name from your own data rather than theirs.",
        "Keep the original name as a separate column, to render and to pass to `download()`.",
        "<b>Validate with `mimes:` and `max:` before storing</b>; `max` is in kilobytes.",
        "<b>Never trust the client's `Content-Type`</b>, because it is a header the sender wrote.",
      ],
      commonMistakes: [
        "<b>Storing the file under its original name.</b> That accepts a path, an extension and a collision from the user.",
        "<b>Saving a URL on the model instead of the path.</b> It breaks the moment the disk or domain changes.",
        "<b>Validating on `Content-Type`.</b> The sender chose that value; `mimes:` inspects the file.",
        "<b>Omitting `max:`.</b> Your upload limit becomes whatever PHP happens to allow.",
        "<b>Replacing a file without deleting the old one.</b> The bucket fills with orphans nothing points at.",
      ],
      quiz: [
        {
          question: "What do `store()` and `storeAs()` return?",
          options: ["A URL", "The stored path", "The UploadedFile", "A boolean"],
          correctIndex: 1,
          explanation: "Store the path on the model; a URL breaks when the disk changes.",
        },
        {
          question: "Why not store an upload under its original filename?",
          options: [
            "It is slower",
            "The name is user input, and has caused path traversal, executable extensions and collisions",
            "Laravel does not allow it",
            "Filenames must be unique in S3",
          ],
          correctIndex: 1,
          explanation: "`store()` generates a name and keeps only the extension.",
        },
        {
          question: "Why is validating on the client's `Content-Type` not enough?",
          options: [
            "It is often missing",
            "It is a header the sender wrote, so it can say anything",
            "Laravel ignores it",
            "It is only for images",
          ],
          correctIndex: 1,
          explanation: "`mimes:` inspects the file itself.",
        },
        {
          question: "How do you show the user their original filename on download?",
          options: [
            "Store the file under that name",
            "Keep it in a separate column and pass it as the second argument to `download()`",
            "Read it from the path",
            "It is not possible",
          ],
          correctIndex: 1,
          explanation: "The path is for the filesystem; the original name is data you render.",
        },
      ],
    },
    {
      id: "retrieving-and-serving",
      title: "Reading, downloading & temporary URLs",
      durationMinutes: 12,
      explanation: "Getting a file back out, and the security decision hiding in it.\n\n---\n\n### 1. Basic — reading\n\n```php\nStorage::exists('documents/report.pdf');\n\n$contents = Storage::get('documents/report.pdf');\n\n$url = Storage::disk('public')->url('avatars/user.jpg');\n```\n\n`get()` reads the whole file into memory, which is fine for a text file and a bad idea for a video.\n\nAnd `url()` only means something on a disk that has one. On a private disk it will not give you a working address, which is the point of that disk.\n\nTo send a file to the browser as a download:\n\n```php\nreturn Storage::download('documents/report.pdf');\n\nreturn Storage::download('documents/report.pdf', 'my-report.pdf');\n```\n\nThe second argument is what the browser saves it as, which is where the original filename from the last lesson goes. `download()` sets `Content-Disposition: attachment`:\n\n```text\ndon't display this\nsave it\n```\n\n---\n\n### 2. Intermediate — do not read big files into memory\n\n```php\n$contents = Storage::get('videos/video.mp4');   // the whole file, in RAM\n```\n\nA 500 MB video is 500 MB of PHP memory, per concurrent request. Ten of those and the server is gone.\n\n```text\n❌ file → RAM → response\n✓ file → stream → response\n```\n\n```php\nreturn Storage::disk('s3')->response('videos/video.mp4');\n\nreturn Storage::download('videos/video.mp4');     // also streamed\n```\n\nThese send the file in chunks, so memory stays flat whatever the size.\n\n<b>The rule: memory use should not depend on the file's size.</b> Anywhere it does, you have a limit you did not choose, and you find it when somebody uploads something large.\n\nThe files this matters for are predictable: videos, backups, exports, large PDFs.\n\n---\n\n### 3. Advanced — public, private, and temporary URLs\n\n<b>Visibility</b> is whether a stored file is readable by anybody with the address:\n\n```php\nStorage::disk('s3')->put('reports/report.pdf', $contents, 'private');\n```\n\nAnd it is a real decision, not a detail:\n\n```text\npublic     an avatar, a logo, a product photo\nprivate    an invoice, a medical document, an export,\n           anything belonging to one person\n```\n\nA private file has no public URL, which raises the obvious question: how does the owner get it?\n\nOne answer is to stream it through your application, which is the controller from the first lesson: authorize, then `download()`. Correct, and every byte passes through PHP.\n\nThe better answer for object storage is a <b>temporary URL</b>:\n\n```php\n$url = Storage::disk('s3')->temporaryUrl($path, now()->addMinutes(10));\n```\n\n```text\nprivate file\n     ↓\nyour application authorizes the user\n     ↓\nsigned URL, valid for ten minutes\n     ↓\nthe browser fetches it from S3 directly\n     ↓\nthe URL expires\n```\n\n<b>Your application makes the decision; S3 does the delivering.</b> The download does not touch your server at all, which for a large file is the difference between a slow page and no load.\n\nThree things to get right.\n\n<b>The expiry is a real trade-off.</b> Long enough to click and download, short enough that a copied link stops working. Ten minutes is a reasonable default; hours are not.\n\n<b>A temporary URL is not authorization.</b> It says \"whoever holds this link, for the next ten minutes\". Your application decides who gets handed one, and that check is the actual protection.\n\n<b>And it needs a private file to be worth anything.</b> Generating a temporary URL for a file on the public disk is theatre: the file is already reachable at a plain, permanent address.",
      diagram: `Reading

  Storage::exists('documents/report.pdf')
  Storage::get('documents/report.pdf')        the WHOLE file, in memory
  Storage::disk('public')->url('avatars/x.jpg')

  url() only means something on a disk that has one.
  On a private disk it does not give you a working
  address, which is the point of that disk.

  Storage::download(\$path)
  Storage::download(\$path, 'my-report.pdf')   what the browser saves it as

    Content-Disposition: attachment
      → don't display this, save it


Do not read big files into memory

  \$contents = Storage::get('videos/video.mp4')

  A 500 MB video is 500 MB of PHP memory, PER concurrent
  request. Ten of those and the server is gone.

    ❌  file → RAM → response
    ✓  file → stream → response

  Storage::disk('s3')->response(\$path)
  Storage::download(\$path)              also streamed

  Rule: memory use should not depend on the file's size.
  Anywhere it does, you have a limit you did not choose,
  and you find it when somebody uploads something large.

  Predictable culprits: videos, backups, exports, big PDFs.


Visibility is a real decision

  public     an avatar, a logo, a product photo
  private    an invoice, a medical document, an export,
             anything belonging to one person

  A private file has no public URL. So how does the
  owner get it?

  Option 1: stream it through your app
    authorize, then download()
    correct, and every byte passes through PHP

  Option 2: a temporary URL

    private file
         ↓
    your application authorizes the user
         ↓
    signed URL, valid ten minutes
         ↓
    the browser fetches from S3 DIRECTLY
         ↓
    the URL expires

  Your application decides. S3 delivers. The download
  never touches your server.


Three things to get right

  The expiry is a trade-off
    long enough to click and download, short enough
    that a copied link stops working.
    Ten minutes is reasonable. Hours are not.

  A temporary URL is not authorization
    it says "whoever holds this link, for ten minutes".
    Deciding who gets handed one is the real protection.

  It needs a PRIVATE file to mean anything
    generating one for a file on the public disk is
    theatre: it is already at a plain permanent address.`,
      codeExample: {
        title: "Serving files, publicly and privately",
        code: `<?php

use Illuminate\\Support\\Facades\\Storage;

// ---------- Reading ----------

Storage::exists('documents/report.pdf');       // true / false
$contents = Storage::get('documents/report.pdf');
$size = Storage::size('documents/report.pdf');
$when = Storage::lastModified('documents/report.pdf');
$type = Storage::mimeType('documents/report.pdf');   // application/pdf

// The inverse of exists(), which reads better in a guard:
if (Storage::missing($path)) {
    abort(404);
}

// A public URL, on a disk that has one.
$url = Storage::disk('public')->url('avatars/user.jpg');


// ---------- Downloads ----------

return Storage::download('documents/report.pdf');

// The second argument is what the browser saves it as.
return Storage::download($invoice->path, $invoice->original_name);


// ---------- Big files ----------

// ❌ 500 MB of PHP memory, per concurrent request.
$contents = Storage::get('videos/video.mp4');
return response($contents);

// ✓ Streamed in chunks. Memory stays flat.
return Storage::disk('s3')->response('videos/video.mp4');

// Memory use should not depend on the file's size.


<?php
// ---------- Visibility ----------

Storage::disk('s3')->put('avatars/user.jpg', $contents, 'public');
Storage::disk('s3')->put('invoices/INV-001.pdf', $contents, 'private');

Storage::disk('s3')->setVisibility('invoices/INV-001.pdf', 'private');


<?php
// ---------- Serving a private file: through the app ----------

Route::get('/invoices/{invoice}/download', function (Invoice $invoice) {
    Gate::authorize('view', $invoice);

    // Correct, and every byte passes through PHP.
    return Storage::disk('s3')->download(
        $invoice->path,
        $invoice->original_name,
    );
})->middleware('auth');


<?php
// ---------- Serving a private file: a temporary URL ----------

Route::get('/invoices/{invoice}/link', function (Invoice $invoice) {
    // Your application decides. This check is the real protection.
    Gate::authorize('view', $invoice);

    // S3 delivers. The download never touches your server.
    return redirect(
        Storage::disk('s3')->temporaryUrl(
            $invoice->path,
            now()->addMinutes(10),
        )
    );
})->middleware('auth');


// The expiry is a trade-off: long enough to click and
// download, short enough that a copied link stops working.

// ❌ A day is not a temporary URL.
Storage::disk('s3')->temporaryUrl($path, now()->addDay());

// ❌ Theatre: the file is already at a plain permanent address.
Storage::disk('public')->temporaryUrl($path, now()->addMinutes(10));


<?php
// ---------- Temporary upload URLs, for large files ----------

// The same idea in reverse: the browser uploads straight
// to S3 and never sends the file through your server.
$upload = Storage::disk('s3')->temporaryUploadUrl(
    'uploads/' . Str::uuid(),
    now()->addMinutes(5),
);`,
      },
      keyTakeaways: [
        "<b>`exists()`, `get()`, `size()` and `url()` read a file and its metadata.</b>",
        "<b>`get()` loads the whole file into memory</b>, which is fine for text and wrong for a video.",
        "<b>`download()` sends a file as an attachment</b>, and its second argument is the name the browser saves.",
        "<b>Memory use should not depend on the file's size</b>, so stream anything large with `response()` or `download()`.",
        "<b>Visibility decides whether a file is readable by anybody with the address.</b>",
        "Avatars and logos are public; invoices, exports and anything belonging to one person are private.",
        "<b>A private file can be streamed through a controller that authorizes first</b>, at the cost of passing every byte through PHP.",
        "<b>A temporary URL lets your application authorize and object storage deliver</b>, so the download misses your server.",
        "<b>The expiry is a trade-off</b>: long enough to use, short enough that a copied link dies.",
        "<b>A temporary URL is not authorization</b>, and on a public file it is theatre.",
      ],
      commonMistakes: [
        "<b>Reading a large file with `get()` before returning it.</b> Memory scales with file size and concurrency.",
        "<b>Putting private files on the public disk.</b> The address is permanent and nothing checks the requester.",
        "<b>Generating a temporary URL for a public file.</b> The plain URL still works forever.",
        "<b>Setting a long expiry.</b> A day-long \"temporary\" link is a permanent link with extra steps.",
        "<b>Treating the temporary URL as the security.</b> The authorization before you hand it out is the protection.",
      ],
      quiz: [
        {
          question: "Why not use `Storage::get()` to serve a large video?",
          options: [
            "It is not supported on S3",
            "It loads the whole file into memory, per concurrent request",
            "It corrupts binary files",
            "It is slower to write",
          ],
          correctIndex: 1,
          explanation: "Stream it instead, so memory does not depend on the file's size.",
        },
        {
          question: "What does the second argument to `download()` do?",
          options: [
            "Picks the disk",
            "Sets the filename the browser saves the file as",
            "Sets the content type",
            "Sets an expiry",
          ],
          correctIndex: 1,
          explanation: "Which is where the stored original filename goes.",
        },
        {
          question: "What does a temporary URL let you do?",
          options: [
            "Make a public file private",
            "Authorize in your application while object storage delivers the file directly",
            "Compress the file",
            "Cache the file locally",
          ],
          correctIndex: 1,
          explanation: "The download never passes through your server.",
        },
        {
          question: "Why is a temporary URL for a file on the public disk pointless?",
          options: [
            "Laravel throws an error",
            "The file already has a plain, permanent address",
            "It expires immediately",
            "It is not pointless",
          ],
          correctIndex: 1,
          explanation: "Temporary URLs only mean something for private files.",
        },
      ],
    },
    {
      id: "managing-and-read-through",
      title: "Deleting, listing & the read-through driver",
      durationMinutes: 9,
      explanation: "Housekeeping, and one Laravel 13 addition worth understanding as an idea rather than a config block.\n\n---\n\n### 1. Basic — deleting and listing\n\n```php\nStorage::delete('documents/report.pdf');\n\nStorage::delete(['a.txt', 'b.txt']);\n\nStorage::disk('s3')->delete($invoice->path);\n\nStorage::deleteDirectory('exports/2025');\n```\n\n```php\n$files = Storage::files('documents');\n$all   = Storage::allFiles('documents');       // recursive\n\n$dirs  = Storage::directories('documents');\n$allDirs = Storage::allDirectories('documents');\n```\n\nUseful for admin tools, cleanup jobs and storage audits.\n\n<b>And `allFiles()` on a large bucket is a lot of requests.</b> On S3 each page is an API call, so listing a bucket with a hundred thousand objects is slow and metered. Fine in a command, wrong in a web request.\n\n---\n\n### 2. Intermediate — the orphan problem\n\nThe thing nobody plans for: files outlive the rows that pointed at them.\n\n```text\ninvoice deleted\n      ↓\nrow gone\n      ↓\nthe PDF is still in the bucket, forever\n```\n\nNothing cleans it up, because nothing knows it exists. A year later the bucket is full of files no record references, and working out which is which means listing everything and comparing.\n\nDay 14's model events are the fix, applied deliberately:\n\n```php\nstatic::deleting(function (Invoice $invoice) {\n    Storage::disk('s3')->delete($invoice->path);\n});\n```\n\nWith two caveats you already know. <b>A mass delete fires no events</b>, so `Invoice::where(...)->delete()` leaves every file behind. And <b>a soft delete is an update</b>, so the file should survive until the record is really gone, which means `forceDeleted` rather than `deleting`.\n\nThe habit worth forming: <b>whenever you write code that stores a file, write the code that removes it in the same sitting.</b> Otherwise it never gets written.\n\n---\n\n### 3. Advanced — the read-through driver\n\nLaravel 13 adds a <b>read-through</b> filesystem driver, and the idea is worth more than the configuration.\n\nThe problem it solves: your canonical storage is remote, and something reads the same files repeatedly. Every read is a network round trip to S3, paid for in latency and requests.\n\n```text\nApplication\n     ↓\nread-through filesystem\n     │\n     ├── is it here locally?\n     │        ↓\n     │       yes → read the local copy\n     │\n     └── no\n          ↓\n      read from the source\n          ↓\n      keep a local copy\n          ↓\n      return it\n```\n\nSo the first read is remote and the rest are local.\n\n> <b>Separate the canonical storage location from the local read cache.</b>\n\nThat sentence is the takeaway. S3 remains the truth; the local disk is a cache, and a cache being empty or stale is never a correctness problem because the source is still there.\n\nWhich also tells you when it fits and when it does not:\n\n```text\nfits              read many times, changes rarely\n                  templates, assets, reference documents\n\ndoes not fit      read once each          nothing to reuse\n                  changes often           the cache is wrong\n                  user uploads            read by their owner, once\n```\n\nAnd it is the same shape as every cache you will meet later in the track: a fast copy in front of a slow source of truth, useful exactly when reads repeat.",
      diagram: `Deleting and listing

  Storage::delete(\$path)
  Storage::delete(['a.txt', 'b.txt'])
  Storage::deleteDirectory('exports/2025')

  Storage::files('documents')            one level
  Storage::allFiles('documents')         recursive
  Storage::directories('documents')

  ⚠️  allFiles() on a large bucket is a lot of API calls.
      On S3 each page is a request: slow and metered.
      Fine in a command. Wrong in a web request.


The orphan problem

  invoice deleted
        ↓
  row gone
        ↓
  the PDF is still in the bucket, forever

  Nothing cleans it up because nothing knows it exists.
  A year later the bucket is full of files no record
  references, and telling them apart means listing
  everything and comparing.

  Day 14's model events, applied deliberately:

    static::deleting(fn (\$invoice) =>
        Storage::disk('s3')->delete(\$invoice->path));

  Two caveats you already know:

    a MASS delete fires no events
      Invoice::where(...)->delete() leaves every file

    a SOFT delete is an update
      the file should survive until the record really
      goes → use forceDeleted, not deleting

  Habit: whenever you write code that stores a file,
  write the code that removes it in the same sitting.
  Otherwise it never gets written.


The read-through driver

  Problem: canonical storage is remote, and something
  reads the same files repeatedly. Every read is a
  round trip, paid in latency and requests.

  Application
       ↓
  read-through filesystem
       │
       ├── is it here locally?
       │        ↓
       │       yes → read the local copy
       │
       └── no
            ↓
        read from the source
            ↓
        keep a local copy
            ↓
        return it

  First read remote. The rest local.

  > Separate the canonical storage location from the
    local read cache.

  S3 stays the truth. The local disk is a cache, so an
  empty or stale cache is never a correctness problem.


  fits           read many times, changes rarely
                 templates, assets, reference documents

  does not fit   read once each      nothing to reuse
                 changes often       the cache is wrong
                 user uploads        read by their owner, once


  The same shape as every cache later in the track:
  a fast copy in front of a slow source of truth,
  useful exactly when reads repeat.`,
      codeExample: {
        title: "Cleanup that actually happens",
        code: `<?php

use Illuminate\\Support\\Facades\\Storage;

// ---------- Copying and moving ----------

Storage::copy('invoices/draft.pdf', 'invoices/archive/draft.pdf');
Storage::move('invoices/draft.pdf', 'invoices/final.pdf');

// Both stay on the same disk. Across disks, read and write:
Storage::disk('s3')->put($path, Storage::disk('local')->get($path));


// ---------- Appending to a file ----------

Storage::append('logs/import.log', "row {$id} skipped");
Storage::prepend('logs/import.log', '--- newest first ---');

// Fine for a small audit trail. Not a substitute for a
// log channel, and not safe with several writers at once.


// ---------- Deleting ----------

Storage::delete('documents/report.pdf');
Storage::delete(['exports/a.csv', 'exports/b.csv']);
Storage::disk('s3')->delete($invoice->path);
Storage::deleteDirectory('exports/2025');


// ---------- Listing ----------

Storage::files('documents');            // one level
Storage::allFiles('documents');         // recursive
Storage::directories('documents');
Storage::allDirectories('documents');

// ⚠️ On S3 each page is an API call. Listing a bucket
//    with 100,000 objects belongs in a command, not in
//    a web request.


<?php
// ---------- The orphan problem ----------

namespace App\\Models;

use Illuminate\\Database\\Eloquent\\Model;
use Illuminate\\Database\\Eloquent\\SoftDeletes;
use Illuminate\\Support\\Facades\\Storage;

class Invoice extends Model
{
    use SoftDeletes;

    protected static function booted(): void
    {
        // Soft deleted invoices keep their file: they can
        // be restored. Only a real deletion removes it.
        static::forceDeleted(function (Invoice $invoice) {
            if ($invoice->document_path) {
                Storage::disk('s3')->delete($invoice->document_path);
            }
        });
    }
}

// ⚠️ A mass delete fires no events, so this leaves
//    every file behind:
Invoice::where('created_at', '<', now()->subYears(7))->forceDelete();

// ✓ Load them, so the event runs.
Invoice::onlyTrashed()
    ->where('deleted_at', '<', now()->subMonths(3))
    ->chunkById(500, function ($invoices) {
        foreach ($invoices as $invoice) {
            $invoice->forceDelete();
        }
    });


<?php
// ---------- Finding the orphans you already have ----------

// php artisan make:command AuditStorage

$referenced = Invoice::withTrashed()
    ->whereNotNull('document_path')
    ->pluck('document_path')
    ->flip();

foreach (Storage::disk('s3')->allFiles('invoices') as $path) {
    if (! $referenced->has($path)) {
        $this->warn("Orphan: {$path}");
        // Storage::disk('s3')->delete($path);
    }
}

// Report first, delete later. A cleanup script with a
// wrong assumption is worse than the orphans.


<?php
// ---------- Read-through: canonical vs cache ----------

// The idea, whatever the configuration looks like:
//
//   S3     the truth
//   local  a cache in front of it
//
// First read fetches from S3 and keeps a copy.
// Later reads are local.
//
// An empty or stale cache is never a correctness problem,
// because the source is still there.
//
//   fits:         read many times, changes rarely
//   does not fit: read once, or changes often`,
      },
      keyTakeaways: [
        "<b>`delete()` takes a path or an array</b>, and `deleteDirectory()` removes a whole prefix.",
        "`files()`, `allFiles()`, `directories()` and `allDirectories()` inspect what is stored.",
        "<b>Listing a large bucket is many API calls</b>, so it belongs in a command rather than a web request.",
        "<b>Files outlive the rows that pointed at them</b>, and nothing cleans them up because nothing knows they exist.",
        "<b>Delete the file from a model event</b>, and use `forceDeleted` when the model soft deletes.",
        "<b>A mass delete fires no events</b>, so it leaves every associated file behind.",
        "<b>Write the code that removes a file in the same sitting as the code that stores it.</b>",
        "<b>The read-through driver keeps a local copy of remote files</b>, so the first read is remote and the rest are local.",
        "<b>Separate the canonical storage location from the local read cache</b>: the source stays the truth.",
        "It fits files read many times and changed rarely, and not files read once or changing often.",
      ],
      commonMistakes: [
        "<b>Deleting a record and leaving its file.</b> The bucket fills with orphans nothing references.",
        "<b>Using `deleting` on a soft-deleting model.</b> The file goes while the record can still be restored.",
        "<b>Cleaning up with a mass delete.</b> No models load, so no events fire and no files are removed.",
        "<b>Calling `allFiles()` in a web request.</b> On a large bucket that is many API calls and a slow page.",
        "<b>Treating a read-through cache as storage.</b> It is a copy; the remote disk is still the truth.",
      ],
      quiz: [
        {
          question: "Why do orphaned files accumulate?",
          options: [
            "Storage drivers keep backups",
            "Deleting a record does not delete its file, and nothing else knows the file exists",
            "S3 versions everything",
            "Laravel caches them",
          ],
          correctIndex: 1,
          explanation: "Delete from a model event, in the same sitting as the storing code.",
        },
        {
          question: "Which event should delete the file on a soft-deleting model?",
          options: ["`deleting`", "`deleted`", "`forceDeleted`", "`restored`"],
          correctIndex: 2,
          explanation: "A soft-deleted record can be restored, so its file must survive.",
        },
        {
          question: "Why does a mass delete leave files behind?",
          options: [
            "Storage is asynchronous",
            "No models are loaded, so no model events fire",
            "The paths are cached",
            "It does not",
          ],
          correctIndex: 1,
          explanation: "Loop with `chunkById()` when the events matter.",
        },
        {
          question: "What is the read-through driver's core idea?",
          options: [
            "Writing to two disks at once",
            "Separating the canonical storage location from a local read cache",
            "Compressing files on read",
            "Streaming large files",
          ],
          correctIndex: 1,
          explanation: "The source stays the truth, so a stale cache is not a correctness problem.",
        },
      ],
    },
    {
      id: "image-processing",
      title: "Image processing — resize, convert & HEIC",
      durationMinutes: 11,
      explanation: "An uploaded image is rarely the image you want to serve.\n\n---\n\n### 1. Basic — the pipeline\n\nLaravel 13 adds an `Image` facade:\n\n```php\n$image = Image::read($request->file('avatar'));\n\n$image->resize(width: 800, height: 800);\n```\n\nThe shape is always the same:\n\n```text\nupload\n  ↓\ndecode\n  ↓\ntransform      resize, crop, rotate\n  ↓\nencode         JPEG, WebP, AVIF\n  ↓\nstore\n```\n\nAnd the reason to bother is bandwidth. A phone camera produces a four-thousand-pixel photograph; an avatar is displayed at two hundred. Serving the original sends about four hundred times more data than the page uses, on every view, to every visitor.\n\n<b>Resize once on upload, serve the small one forever.</b>\n\n---\n\n### 2. Intermediate — format, and what it is worth\n\nConverting is often a bigger win than resizing:\n\n```text\nJPEG  →  Image  →  WebP\n```\n\nThe same photograph as WebP is typically a good deal smaller with no visible difference, and every current browser reads it. On an image-heavy page that is the single cheapest performance change available.\n\nFormat affects:\n\n```text\nfile size\nquality\nbrowser support\ntransparency\n```\n\nTwo more Laravel 13 capabilities worth knowing.\n\n<b>Dominant colour detection</b> gives you the average colour of an image:\n\n```text\nimage  →  analyse pixels  →  dominant colour\n```\n\nStore it alongside the path and you have a placeholder: the layout can show that colour while the image loads, instead of an empty box that shifts the page when it arrives.\n\n<b>HEIC support</b> matters because modern iPhones produce HEIC by default, and browsers largely do not display it. Without conversion, an iPhone user uploads a photograph that nobody can see:\n\n```text\nHEIC upload  →  processing  →  JPEG / WebP  →  storage\n```\n\nThe user never knows anything happened, which is the correct outcome.\n\n---\n\n### 3. Advanced — images are a memory and CPU surface\n\nThis is the part that belongs to yesterday's lesson as much as this one.\n\n<b>Decoding an image allocates memory in proportion to its dimensions, not its file size.</b> A 10 MB JPEG might be modest; a carefully constructed one can decompress to hundreds of megabytes of raw pixels. That is a <i>decompression bomb</i>, and `max:10240` on the upload does not stop it, because the limit is on the file and the cost is in the pixels.\n\nSo validate the dimensions too:\n\n```php\n'avatar' => ['required', 'image', 'max:10240', 'dimensions:max_width=6000,max_height=6000'],\n```\n\nAnd think about where the work happens. Resizing a large photograph takes real CPU time, and doing it in the request means the user waits and your worker is busy:\n\n```text\nin the request     small images, one at a time\nin a queued job    anything large, or several sizes\n```\n\nThree more habits worth having:\n\n<b>Strip metadata.</b> A photograph carries EXIF, and EXIF carries GPS coordinates. Publishing an uploaded image unchanged can publish where it was taken.\n\n<b>Respect orientation.</b> EXIF also records rotation, and a decode that ignores it turns every phone photograph on its side.\n\n<b>And keep the original if you might need other sizes later.</b> Resizing from an already-resized copy loses quality each time; going back to the original does not.",
      diagram: `The pipeline

  upload
    ↓
  decode
    ↓
  transform      resize, crop, rotate
    ↓
  encode         JPEG, WebP, AVIF
    ↓
  store

  Why bother: a phone camera makes a 4,000px photograph.
  An avatar displays at 200px. Serving the original sends
  about 400× more data than the page uses, on every view,
  to every visitor.

  Resize once on upload. Serve the small one forever.


Format is often the bigger win

  JPEG  →  Image  →  WebP

  The same photograph, meaningfully smaller, no visible
  difference, read by every current browser. On an
  image-heavy page it is the cheapest performance change
  available.

  Format affects: file size · quality · browser support
                  transparency


  Dominant colour

    image → analyse pixels → dominant colour

  Store it next to the path and the layout can show that
  colour while the image loads, instead of an empty box
  that shifts the page when it arrives.


  HEIC

    iPhones produce HEIC by default. Browsers largely do
    not display it. Without conversion, an iPhone user
    uploads a photograph nobody can see.

    HEIC upload → processing → JPEG / WebP → storage

    The user never knows. That is the correct outcome.


Images are a memory and CPU surface

  ⚠️  Decoding allocates memory in proportion to
      DIMENSIONS, not file size.

      A 10 MB JPEG can decompress to hundreds of MB of
      raw pixels. That is a decompression bomb, and
      max:10240 does not stop it: the limit is on the
      file, the cost is in the pixels.

    'dimensions:max_width=6000,max_height=6000'

  And decide where the work happens:

    in the request     small images, one at a time
    in a queued job    anything large, or several sizes


Three more habits

  Strip metadata
    a photograph carries EXIF, and EXIF carries GPS.
    Publishing it unchanged publishes where it was taken.

  Respect orientation
    EXIF also records rotation. Ignore it and every
    phone photograph appears on its side.

  Keep the original
    resizing from a resized copy loses quality each
    time. Going back to the original does not.`,
      codeExample: {
        title: "An upload pipeline that holds up",
        code: `<?php

use Illuminate\\Http\\Request;
use Illuminate\\Support\\Facades\\Storage;
use Illuminate\\Support\\Str;

class AvatarController extends Controller
{
    public function store(Request $request)
    {
        // Validate the file AND the dimensions. max: limits
        // the file; dimensions: limits what decoding will cost.
        $request->validate([
            'avatar' => [
                'required',
                'image',
                'max:10240',                                   // 10 MB
                'dimensions:max_width=6000,max_height=6000',
            ],
        ]);

        $image = Image::read($request->file('avatar'));

        // EXIF records rotation. Ignore it and every phone
        // photograph ends up on its side.
        $image->orient();

        // Constrain the long edge rather than forcing a square.
        $image->scaleDown(width: 800, height: 800);

        $path = 'avatars/' . Str::uuid() . '.webp';

        Storage::disk('s3')->put(
            $path,
            (string) $image->toWebp(quality: 82),
            'private',
        );

        $request->user()->update([
            'avatar_path'  => $path,

            // A placeholder colour, so the layout does not
            // shift when the image arrives.
            'avatar_color' => (string) $image->pickColor(0, 0),
        ]);

        return back();
    }
}


<?php
// ---------- Why the dimensions rule matters ----------

// Decoding allocates memory for WIDTH × HEIGHT pixels.
//
//   a 10 MB JPEG               modest
//   a crafted 10 MB JPEG       decompresses to hundreds
//                              of MB of raw pixels
//
// max:10240 does not stop that: the limit is on the file,
// the cost is in the pixels.


<?php
// ---------- Move the work off the request ----------

// Small images, one at a time → fine in the request.
// Anything large, or several sizes → a job.

class GenerateThumbnails implements ShouldQueue
{
    public function __construct(public Media $media) {}

    public function handle(): void
    {
        // Always from the original, never from a resized copy:
        // resizing a resize loses quality each time.
        $image = Image::read(
            Storage::disk('s3')->get($this->media->original_path)
        );

        foreach ([200, 800, 1600] as $width) {
            $resized = (clone $image)->scaleDown(width: $width);

            Storage::disk('s3')->put(
                "media/{$this->media->id}/{$width}.webp",
                (string) $resized->toWebp(quality: 82),
            );
        }
    }
}


<?php
// ---------- HEIC ----------

// An iPhone uploads HEIC by default, and browsers largely
// will not display it. Convert on the way in, and the user
// never knows anything happened.

$image = Image::read($request->file('photo'));   // reads HEIC

Storage::disk('s3')->put(
    'photos/' . Str::uuid() . '.webp',
    (string) $image->toWebp(),
);


// ---------- Metadata ----------

// A photograph carries EXIF, and EXIF carries GPS.
// Re-encoding drops it, which is one more reason to
// convert rather than store the upload untouched.`,
      },
      keyTakeaways: [
        "<b>The pipeline is always decode, transform, encode, store.</b>",
        "<b>A phone photograph is far larger than the space it is displayed in</b>, so resize once on upload.",
        "<b>Converting to WebP is often a bigger win than resizing</b>, with no visible difference.",
        "<b>Dominant colour gives you a placeholder</b>, so the layout does not shift when the image loads.",
        "<b>iPhones produce HEIC, which browsers largely do not display</b>, so convert on the way in.",
        "<b>Decoding allocates memory in proportion to dimensions, not file size</b>, which `max:` does not limit.",
        "<b>Validate `dimensions:` as well</b>, or a crafted image can exhaust memory within your size limit.",
        "<b>Do large or multi-size processing in a queued job</b>, not in the request.",
        "<b>Re-encoding strips EXIF</b>, which otherwise publishes the GPS coordinates of an uploaded photograph.",
        "<b>Respect EXIF orientation, and keep the original</b>, because resizing a resize loses quality each time.",
      ],
      commonMistakes: [
        "<b>Serving the uploaded original.</b> Every visitor downloads several megabytes to see a thumbnail.",
        "<b>Relying on `max:` alone.</b> The file is small and the decoded pixels are not.",
        "<b>Resizing large images in the request.</b> The user waits and the worker is blocked.",
        "<b>Ignoring EXIF orientation.</b> Every phone photograph appears rotated.",
        "<b>Generating new sizes from a resized copy.</b> Quality drops with each pass; go back to the original.",
      ],
      quiz: [
        {
          question: "Why resize an uploaded image rather than serving the original?",
          options: [
            "Originals cannot be served",
            "A phone photograph is far larger than the space it is displayed in, so every visitor downloads data the page never uses",
            "It is required for WebP",
            "To strip the filename",
          ],
          correctIndex: 1,
          explanation: "Resize once on upload, serve the small one forever.",
        },
        {
          question: "Why does `max:10240` not protect against a decompression bomb?",
          options: [
            "It is measured in bytes",
            "It limits the file, while decoding allocates memory in proportion to the dimensions",
            "It only applies to PDFs",
            "It does protect against it",
          ],
          correctIndex: 1,
          explanation: "Add a `dimensions:` rule as well.",
        },
        {
          question: "Why convert HEIC uploads?",
          options: [
            "HEIC files are larger",
            "Browsers largely do not display HEIC, so the uploaded photograph would be invisible",
            "Laravel cannot store them",
            "It removes the need to resize",
          ],
          correctIndex: 1,
          explanation: "Convert on the way in and the user never notices.",
        },
        {
          question: "What does re-encoding an uploaded photograph also do?",
          options: [
            "Improves quality",
            "Strips EXIF metadata, which can contain GPS coordinates",
            "Adds a watermark",
            "Sets the visibility",
          ],
          correctIndex: 1,
          explanation: "Publishing an untouched upload can publish where it was taken.",
        },
      ],
    },
    {
      id: "http-client-basics",
      title: "The HTTP client — requests, headers & auth",
      durationMinutes: 12,
      explanation: "Files were one thing outside your application. External services are the next.\n\n---\n\n### 1. Basic — making a request\n\n```php\n$response = Http::get('https://api.example.com/users');\n\n$response = Http::post('https://api.example.com/users', [\n    'name' => 'Rajan',\n]);\n```\n\nAlso `put()`, `patch()` and `delete()`. The response is an object, not a string:\n\n```php\n$response->json();          // decoded, as an array\n$response->json('data.0.id');\n$response->body();          // the raw string\n$response->status();        // 200\n$response->successful();    // true for 2xx\n```\n\n<b>`json()` is the one you will use.</b> It decodes for you and, given a key, digs into the structure with dot notation, which saves the usual chain of array accesses that break when a field is missing.\n\n---\n\n### 2. Intermediate — headers, auth and query strings\n\n```php\nHttp::withHeaders(['Accept' => 'application/json'])\n    ->get('https://api.example.com/users');\n```\n\n```php\nHttp::withToken($token)->get(...);                  // Authorization: Bearer ...\nHttp::withBasicAuth($username, $password)->get(...);\n```\n\nQuery parameters go as an array on `get()`:\n\n```php\nHttp::get('https://api.example.com/users', ['page' => 2, 'limit' => 20]);\n```\n\n```text\nGET /users?page=2&limit=20\n```\n\nor fluently, which reads better when they are built up:\n\n```php\nHttp::withQueryParameters(['page' => 2, 'limit' => 20])->get(...);\n```\n\nEither way, <b>the client encodes them</b>, so a value containing a space or an ampersand is handled rather than breaking the URL.\n\nOnce you have more than one call to a service, the repetition is worth removing:\n\n```php\nHttp::baseUrl('https://api.example.com')\n    ->withToken(config('services.example.token'))\n    ->acceptJson();\n```\n\nAnd Laravel lets you name that once, as a macro, so every call site says `Http::example()->get('/users')`. <b>One place holds the base URL, the token and the timeouts</b>, which is also the one place to change when any of them do.\n\n---\n\n### 3. Advanced — one method worth not misreading\n\nLaravel 13 adds:\n\n```php\nHttp::query(...);\n```\n\nand it is <i>not</i> a way to add query-string parameters to a `GET`. It sends an HTTP request using the `QUERY` method.\n\n```text\nHttp::get($url, ['page' => 2])       →  GET /users?page=2\nHttp::withQueryParameters([...])     →  GET /users?page=2\n\nHttp::query($url, [...])             →  QUERY /users\n```\n\nThe problem `QUERY` exists to solve: a search with a large or structured set of criteria does not fit in a URL, so APIs use `POST` for it. But `POST` means \"create something\", so caches will not cache it and clients cannot safely retry it. `QUERY` is a read with a body: safe to retry, cacheable, and not pretending to be a write.\n\nYou will meet it rarely. <b>The distinction to keep is that `Http::query()` is a verb, and `withQueryParameters()` is a URL.</b>\n\nOne last habit, connecting to yesterday. <b>API credentials belong in config, read from the environment.</b>\n\n```php\nHttp::withToken(config('services.example.token'))\n```\n\nnot the token itself, and never `env()` outside a config file, because cached config returns null for it in production.",
      diagram: `Making a request

  Http::get(\$url)
  Http::post(\$url, ['name' => 'Rajan'])
  Http::put / patch / delete

  The response is an object:

    ->json()            decoded, as an array
    ->json('data.0.id') dot notation into the structure
    ->body()            the raw string
    ->status()          200
    ->successful()      true for 2xx

  json() with a key saves the chain of array accesses
  that breaks when a field is missing.


Headers, auth, query strings

  ->withHeaders(['Accept' => 'application/json'])
  ->withToken(\$token)                Authorization: Bearer ...
  ->withBasicAuth(\$user, \$pass)

  Http::get(\$url, ['page' => 2, 'limit' => 20])
  ->withQueryParameters(['page' => 2, 'limit' => 20])

    GET /users?page=2&limit=20

  Either way the client ENCODES them, so a value with a
  space or an ampersand is handled rather than breaking
  the URL.


Once there is more than one call to a service

  Http::baseUrl('https://api.example.com')
      ->withToken(config('services.example.token'))
      ->acceptJson()

  Name it once, as a macro:

    Http::example()->get('/users')

  One place holds the base URL, the token and the
  timeouts — and one place to change when any of
  them do.


One method worth not misreading

  Http::query() is NOT a way to add query parameters.
  It sends an HTTP request with the QUERY method.

    Http::get(\$url, ['page' => 2])    →  GET /users?page=2
    ->withQueryParameters([...])      →  GET /users?page=2

    Http::query(\$url, [...])          →  QUERY /users

  Why QUERY exists: a search with large or structured
  criteria does not fit in a URL, so APIs use POST. But
  POST means "create something": caches will not cache
  it and clients cannot safely retry it.

  QUERY is a READ with a body: retryable, cacheable,
  and not pretending to be a write.

  Http::query() is a VERB.
  withQueryParameters() is a URL.


  And credentials come from config, read from the
  environment:

    ->withToken(config('services.example.token'))

  never the token itself, and never env() outside a
  config file — cached config returns null in production.`,
      codeExample: {
        title: "Talking to an API",
        code: `<?php

use Illuminate\\Support\\Facades\\Http;

// ---------- The verbs ----------

$response = Http::get('https://api.example.com/users');

$response = Http::post('https://api.example.com/users', [
    'name'  => 'Rajan',
    'email' => 'rajan@example.com',
]);

Http::put('https://api.example.com/users/1', [...]);
Http::patch('https://api.example.com/users/1', [...]);
Http::delete('https://api.example.com/users/1');


// ---------- Reading the response ----------

$response->json();               // decoded array
$response->json('data.0.id');    // dot notation into it
$response->body();               // raw string
$response->status();             // 200
$response->header('X-Request-Id');
$response->successful();         // 2xx
$response->failed();


// ---------- Not everything wants JSON ----------

// Older APIs and almost every OAuth token endpoint want
// application/x-www-form-urlencoded, not JSON:
Http::asForm()->post('https://api.example.com/oauth/token', [
    'grant_type'    => 'client_credentials',
    'client_id'     => config('services.example.id'),
    'client_secret' => config('services.example.secret'),
]);

// Sending a file to somebody else's API is multipart:
Http::attach(
    'document',
    Storage::get($invoice->path),
    'invoice.pdf',
)->post('https://api.example.com/documents');

// attach() switches the request to multipart, so do not
// also call asJson() — pass the other fields as the
// second argument to post().


// ---------- Headers and auth ----------

Http::withHeaders([
    'Accept'       => 'application/json',
    'X-Client-Id'  => config('services.example.client_id'),
])->get('https://api.example.com/users');

// Authorization: Bearer ...
Http::withToken(config('services.example.token'))->get(...);

Http::withBasicAuth($username, $password)->get(...);


// ---------- Query parameters ----------

Http::get('https://api.example.com/users', ['page' => 2, 'limit' => 20]);

Http::withQueryParameters(['page' => 2, 'limit' => 20])
    ->get('https://api.example.com/users');

// GET /users?page=2&limit=20
// The client encodes the values, so spaces and
// ampersands do not break the URL.


<?php
// ---------- One place for everything about a service ----------

// app/Providers/AppServiceProvider.php

use Illuminate\\Support\\Facades\\Http;

public function boot(): void
{
    Http::macro('example', function () {
        return Http::baseUrl('https://api.example.com')
            ->withToken(config('services.example.token'))
            ->acceptJson()
            ->timeout(5)
            ->connectTimeout(2)
            ->retry(3, 200);
    });
}

// Every call site:
$users = Http::example()->get('/users')->json();
Http::example()->post('/users', ['name' => 'Rajan']);

// The base URL, the token and the timeouts live in one
// place, which is also the one place to change them.


<?php
// ---------- Credentials ----------

// config/services.php
'example' => [
    'token' => env('EXAMPLE_API_TOKEN'),
],

// ✓
Http::withToken(config('services.example.token'));

// ❌ Committed to the repository forever.
Http::withToken('sk_live_51H...');

// ❌ Cached config returns null for this in production.
Http::withToken(env('EXAMPLE_API_TOKEN'));


<?php
// ---------- The QUERY method (Laravel 13) ----------

// A read with a body: retryable and cacheable, unlike
// a POST used for searching.
Http::query('https://api.example.com/search', [
    'filters' => ['status' => 'active', 'tags' => ['a', 'b']],
]);

// Not the same thing as:
Http::withQueryParameters(['q' => 'active'])->get('/search');`,
      },
      keyTakeaways: [
        "<b>`Http::get()`, `post()`, `put()`, `patch()` and `delete()` cover the verbs</b>, and return a response object.",
        "<b>`json()` decodes the body</b>, and with a key it digs in using dot notation.",
        "`withHeaders()`, `withToken()` and `withBasicAuth()` handle headers and authentication readably.",
        "<b>Query parameters go as an array on `get()` or through `withQueryParameters()`</b>, and are encoded for you.",
        "<b>`baseUrl()` plus a macro puts everything about a service in one place</b>: the URL, the token, the timeouts.",
        "That one place is also the only place to change when any of them do.",
        "<b>`Http::query()` sends an HTTP `QUERY` request; it does not add query-string parameters.</b>",
        "<b>`QUERY` is a read with a body</b>, so it is retryable and cacheable where a `POST` search is neither.",
        "<b>API credentials come from `config()`</b>, never hard-coded, and never `env()` outside a config file.",
      ],
      commonMistakes: [
        "<b>Reading `Http::query()` as \"add query parameters\".</b> It is an HTTP verb, not a URL builder.",
        "<b>Building a query string by hand.</b> The client encodes values; concatenation breaks on a space.",
        "<b>Hard-coding an API token.</b> It is then in the repository history permanently.",
        "<b>Calling `env()` for a token outside a config file.</b> Cached config returns null in production.",
        "<b>Repeating the base URL and token at every call site.</b> One macro holds them, and one change updates them.",
      ],
      quiz: [
        {
          question: "What does `$response->json('data.0.id')` do?",
          options: [
            "Sends a JSON request",
            "Decodes the body and reads that key using dot notation",
            "Validates the response",
            "Sets the Accept header",
          ],
          correctIndex: 1,
          explanation: "It replaces the chain of array accesses that breaks on a missing field.",
        },
        {
          question: "What does `Http::query()` do?",
          options: [
            "Adds query-string parameters to a GET",
            "Sends a request using the HTTP `QUERY` method",
            "Builds a database query",
            "Fetches and caches a response",
          ],
          correctIndex: 1,
          explanation: "`withQueryParameters()` is the one that builds the URL.",
        },
        {
          question: "Why does the `QUERY` method exist?",
          options: [
            "It is faster than GET",
            "A search needs a body, and a POST used for reading is neither cacheable nor safely retryable",
            "GET cannot be encrypted",
            "It replaces PATCH",
          ],
          correctIndex: 1,
          explanation: "A read with a body, without pretending to be a write.",
        },
        {
          question: "Where should an API token come from?",
          options: [
            "Hard-coded in the calling class",
            "`config()`, which reads it from the environment",
            "`env()` at the call site",
            "The database",
          ],
          correctIndex: 1,
          explanation: "Cached config returns null for a direct `env()` call in production.",
        },
      ],
    },
    {
      id: "timeouts-retries-errors",
      title: "Timeouts, retries & handling failure",
      durationMinutes: 12,
      explanation: "An external API is a dependency you do not control, and the interesting question is not what happens when it works.\n\n---\n\n### 1. Basic — never wait forever\n\n```php\nHttp::timeout(5)->get('https://api.example.com/users');\n```\n\nWithout it, a slow API holds your request open for as long as it likes.\n\n<b>And that failure is worse than it sounds.</b> Each waiting request occupies a PHP worker. If an API you call hangs and you have twenty workers, twenty stuck requests take your whole application down, including every page that has nothing to do with that API.\n\n```text\nAPI stops responding\n        ↓\nrequests pile up waiting\n        ↓\nevery worker is busy\n        ↓\nyour site is down\n```\n\nA timeout turns somebody else's outage into a handled error on one feature.\n\nTwo timeouts, because there are two different failures:\n\n```php\nHttp::connectTimeout(3)->timeout(10)->get(...);\n```\n\n```text\nconnectTimeout   how long to establish a connection\ntimeout          how long for the whole request\n```\n\nA host that is down fails the first quickly. A host that answers slowly fails the second. <b>Set both</b>, and keep them well under your own request limit, or a queued job's.\n\n---\n\n### 2. Intermediate — retries\n\nA network blip should not fail an operation that would work a moment later:\n\n```php\nHttp::retry(3, 100)->get('https://api.example.com/users');\n```\n\n```text\nattempt 1  →  fail\n   wait 100ms\nattempt 2  →  fail\n   wait 100ms\nattempt 3  →  success\n```\n\nUse a growing delay rather than a fixed one, so a struggling service is not hit three times in a third of a second:\n\n```php\nHttp::retry(3, fn (int $attempt) => $attempt * 200)\n```\n\nAnd retry only what is worth retrying. A 500 or a timeout may pass; a 404 or a 422 will not, and retrying it three times just makes the failure slower:\n\n```php\nHttp::retry(3, 200, function ($exception, $request) {\n    return $exception instanceof ConnectionException\n        || $exception->response?->status() === 429;\n})\n```\n\n---\n\n### 3. Advanced — when retrying is dangerous\n\nHere is the part that matters.\n\n```text\nGET /users            safe to retry\nPOST /charge-card     not safe\n```\n\nThe failure case is not the request that failed. It is the request that <i>succeeded</i> and whose response you never received:\n\n```text\nyou send   POST /charge-card\nthey       charge the card\nthe response is lost\nyou see    a timeout\nyou retry\nthey       charge the card again\n```\n\nFrom your side both look identical: no response. From the customer's side, they have been charged twice.\n\n<b>The fix is an idempotency key</b>: a value you generate per operation and send with every attempt. The provider records it, and a second request with the same key returns the first result instead of doing the work again.\n\n```php\nHttp::withHeaders(['Idempotency-Key' => $payment->uuid])\n    ->retry(3, 200)\n    ->post('https://payments.example.com/charge', [...]);\n```\n\nSo the rule:\n\n```text\nreads                    retry freely\nwrites, no idempotency   do not retry automatically\nwrites, with a key       retry safely\n```\n\nIf the provider offers no idempotency, do not retry the write. Record the attempt, and reconcile.\n\n---\n\n### Handling the response\n\n```php\n$response->successful();   // 2xx\n$response->failed();       // 4xx or 5xx\n$response->clientError();  // 4xx: usually your bug\n$response->serverError();  // 5xx: usually theirs\n```\n\n<b>A failed HTTP response is not an exception by default.</b> A 500 comes back as a response object, and `$response->json()` on it returns whatever the error body held. Code that forgets to check carries on with nonsense.\n\n```php\n$response = Http::get(...)->throw();\n```\n\nmakes a non-2xx throw instead, which is usually what you want in a job or a service: fail loudly rather than continue with an empty array.\n\n```text\n2xx  →  continue\nelse →  exception\n```\n\nAnd the distinction is worth acting on. <b>A 4xx is usually your bug</b>, so retrying is pointless and an alert is appropriate. <b>A 5xx is usually theirs</b>, so a retry is reasonable and repeated failures mean their outage, not yours.",
      diagram: `Never wait forever

  Http::timeout(5)->get(\$url)

  Without it, a slow API holds your request open as
  long as it likes. And each waiting request occupies
  a PHP worker:

    API stops responding
            ↓
    requests pile up waiting
            ↓
    every worker is busy
            ↓
    YOUR SITE is down

  including every page unrelated to that API.

  A timeout turns somebody else's outage into a handled
  error on one feature.

  Two timeouts, two failures:

    connectTimeout(3)   establishing a connection
    timeout(10)         the whole request

  A host that is down fails the first quickly.
  A host that answers slowly fails the second.
  Set both, well under your own request limit.


Retries

  Http::retry(3, 100)

    attempt 1 → fail → wait 100ms
    attempt 2 → fail → wait 100ms
    attempt 3 → success

  Grow the delay, so a struggling service is not hit
  three times in a third of a second:

    retry(3, fn (\$attempt) => \$attempt * 200)

  And retry only what can succeed. A 500 or a timeout
  may pass. A 404 or a 422 will not, and retrying makes
  the failure slower.


When retrying is DANGEROUS

  GET /users          safe
  POST /charge-card   not safe

  The failure case is not the request that failed. It is
  the one that SUCCEEDED and whose response was lost:

    you send   POST /charge-card
    they       charge the card
    the response is lost
    you see    a timeout
    you retry
    they       charge the card AGAIN

  Identical from your side. Not from the customer's.

  The fix: an idempotency key, generated per operation
  and sent with every attempt. A second request with the
  same key returns the first result.

    ->withHeaders(['Idempotency-Key' => \$payment->uuid])

    reads                     retry freely
    writes, no idempotency    do not retry automatically
    writes, with a key        retry safely

  No idempotency available? Do not retry the write.
  Record the attempt and reconcile.


Handling the response

  successful()   2xx
  failed()       4xx or 5xx
  clientError()  4xx — usually YOUR bug
  serverError()  5xx — usually THEIRS

  ⚠️  A failed response is NOT an exception by default.
      A 500 comes back as a response object, and json()
      returns whatever the error body held. Code that
      forgets to check carries on with nonsense.

    Http::get(...)->throw()

      2xx  → continue
      else → exception

  Fail loudly rather than continue with an empty array.`,
      codeExample: {
        title: "Failure, handled",
        code: `<?php

use Illuminate\\Http\\Client\\ConnectionException;
use Illuminate\\Support\\Facades\\Http;

// ---------- Timeouts: both of them ----------

Http::connectTimeout(3)   // establishing the connection
    ->timeout(10)         // the whole request
    ->get('https://api.example.com/users');

// ❌ No timeout: a hanging API occupies a worker until
//    something else gives up. Twenty workers, twenty
//    stuck requests, and your whole site is down.
Http::get('https://api.example.com/users');


// ---------- Retries ----------

Http::retry(3, 100)->get(...);

// A growing delay, so a struggling service is not hit
// three times in a third of a second.
Http::retry(3, fn (int $attempt) => $attempt * 200)->get(...);

// Retry only what can succeed. A 404 will still be a 404.
Http::retry(3, 200, function ($exception, $request) {
    return $exception instanceof ConnectionException
        || $exception->response?->status() === 429
        || $exception->response?->serverError();
})->get(...);


<?php
// ---------- The dangerous retry ----------

// ❌ The request may have SUCCEEDED and the response been
//    lost. Retrying charges the card again.
Http::retry(3, 200)->post('https://payments.example.com/charge', [
    'amount' => 5000,
]);

// ✓ An idempotency key: generated per operation, sent with
//    every attempt. A repeat returns the first result.
Http::withHeaders([
    'Idempotency-Key' => $payment->uuid,
])->retry(3, 200)->post('https://payments.example.com/charge', [
    'amount' => 5000,
]);

// If the provider offers no idempotency, do not retry the
// write. Record the attempt and reconcile.


<?php
// ---------- Checking the response ----------

$response = Http::get('https://api.example.com/users');

$response->successful();    // 2xx
$response->failed();        // 4xx or 5xx
$response->clientError();   // 4xx — usually your bug
$response->serverError();   // 5xx — usually theirs

if ($response->failed()) {
    Log::warning('Users API failed', [
        'status' => $response->status(),
        'body'   => $response->body(),
    ]);

    return collect();
}


// ---------- Or throw ----------

// A failed response is not an exception by default, so
// this carries on with whatever the error body held:
$users = Http::get('https://api.example.com/users')->json();

// ✓ Fail loudly instead.
$users = Http::get('https://api.example.com/users')
    ->throw()
    ->json();

// Conditionally:
$response->throwIf($response->serverError());
$response->throwUnless($response->successful());
$response->throwUnlessStatus(201);      // anything but 201 throws


<?php
// ---------- What it looks like put together ----------

class ExampleApi
{
    public function users(): array
    {
        try {
            return Http::baseUrl(config('services.example.url'))
                ->withToken(config('services.example.token'))
                ->connectTimeout(2)
                ->timeout(5)
                ->retry(3, fn ($attempt) => $attempt * 200, function ($e) {
                    return $e instanceof ConnectionException
                        || $e->response?->serverError();
                })
                ->get('/users')
                ->throw()
                ->json('data');
        } catch (RequestException $e) {
            // Their outage should degrade one feature,
            // not take down the page.
            report($e);

            return [];
        }
    }
}`,
      },
      keyTakeaways: [
        "<b>Without a timeout, a slow API holds your request open indefinitely</b>, and each one occupies a worker.",
        "<b>Enough stuck requests takes your whole site down</b>, including pages unrelated to that API.",
        "<b>`connectTimeout()` covers reaching the host; `timeout()` covers the whole request.</b> Set both.",
        "<b>`retry()` handles a transient failure</b>, and a growing delay avoids hammering a struggling service.",
        "<b>Retry only what can succeed</b>: a 500 or a timeout may pass, a 404 will not.",
        "<b>The dangerous case is a write that succeeded and whose response was lost</b>, because a retry repeats it.",
        "<b>An idempotency key makes a repeated write safe</b>, by letting the provider return the first result.",
        "Without idempotency, do not retry a write; record the attempt and reconcile.",
        "<b>A failed HTTP response is not an exception by default</b>, so code that forgets to check continues with nonsense.",
        "<b>`throw()` turns a non-2xx into an exception</b>, and 4xx is usually your bug while 5xx is usually theirs.",
      ],
      commonMistakes: [
        "<b>Calling an API with no timeout.</b> Their outage becomes your outage.",
        "<b>Setting only `timeout()`.</b> A host that is unreachable still waits the full duration.",
        "<b>Retrying a payment or any non-idempotent write.</b> The customer is charged twice.",
        "<b>Retrying a 4xx.</b> It will fail again; you have only made the failure slower.",
        "<b>Calling `json()` without checking the response.</b> A 500's error body becomes your data.",
      ],
      quiz: [
        {
          question: "Why is calling an API without a timeout dangerous?",
          options: [
            "The response may be truncated",
            "Each waiting request occupies a worker, so a hanging API can take your whole site down",
            "Laravel caches the failure",
            "It is not dangerous",
          ],
          correctIndex: 1,
          explanation: "A timeout turns their outage into a handled error on one feature.",
        },
        {
          question: "What is the difference between `connectTimeout()` and `timeout()`?",
          options: [
            "None",
            "One limits establishing the connection; the other limits the whole request",
            "`timeout()` is for POST only",
            "`connectTimeout()` is in milliseconds",
          ],
          correctIndex: 1,
          explanation: "An unreachable host fails the first quickly; a slow one fails the second.",
        },
        {
          question: "Why is retrying `POST /charge-card` dangerous?",
          options: [
            "POST cannot be retried",
            "The first request may have succeeded with its response lost, so the retry charges again",
            "It is slower",
            "The body cannot be resent",
          ],
          correctIndex: 1,
          explanation: "An idempotency key lets the provider return the first result instead.",
        },
        {
          question: "What does `->throw()` change?",
          options: [
            "It retries the request",
            "A non-2xx response raises an exception instead of being returned",
            "It logs the response",
            "It validates the JSON",
          ],
          correctIndex: 1,
          explanation: "Otherwise a 500's error body silently becomes your data.",
        },
      ],
    },
    {
      id: "pooling-faking-and-process",
      title: "Pooling, faking & running processes",
      durationMinutes: 13,
      explanation: "Three things to finish: making several calls at once, testing without the internet, and the third boundary out of your application.\n\n---\n\n### 1. Basic — concurrent requests\n\nA page needing three APIs, done sequentially, waits for each in turn:\n\n```text\nUser API → wait → Orders API → wait → Billing API\n\ntotal = T1 + T2 + T3\n```\n\nThree calls at 400ms each is 1.2 seconds of a user watching a spinner, almost all of it spent waiting on somebody else's network.\n\n<b>`Http::pool()` sends them together:</b>\n\n```php\n$responses = Http::pool(fn ($pool) => [\n    $pool->get('https://api.example.com/users'),\n    $pool->get('https://api.example.com/orders'),\n    $pool->get('https://api.example.com/billing'),\n]);\n```\n\n```text\n             ┌→ User API\nApplication ─┼→ Orders API\n             └→ Billing API\n\ntotal ≈ max(T1, T2, T3)\n```\n\n1.2 seconds becomes 400ms.\n\nName them, or you are indexing an array by position:\n\n```php\n$pool->as('users')->get(...);\n$responses['users']->json();\n```\n\n<b>Pooling only works when the calls are independent.</b> If the second needs the first's result, they are sequential by nature and no amount of pooling changes that.\n\nAnd each response still needs checking. One failing does not fail the pool; you get a response object per request, and one of them may be a 500.\n\n---\n\n### 2. Intermediate — faking in tests\n\nA test that calls a real API is slow, needs the internet, fails when somebody else deploys, and may cost money.\n\n```php\nHttp::fake();\n```\n\nEvery request now returns an empty 200 and nothing leaves the machine. Usually you want specific responses:\n\n```php\nHttp::fake([\n    'api.example.com/users' => Http::response(['id' => 1, 'name' => 'Rajan'], 200),\n    'api.example.com/*'     => Http::response([], 404),\n]);\n```\n\n```text\nwithout fakes            with fakes\n─────────────            ──────────\ntest → internet          test → Http::fake()\n    → external API           → a response you chose\n    → slow, flaky            → fast, deterministic\n    → costs money            → free\n```\n\n<b>The bigger win is testing failure.</b> You cannot ask a real API for a 500 on demand, so the error handling from the last lesson is untestable against it. A fake produces one instantly, which means retries, timeouts and the `throw()` path all get covered.\n\nAnd you can assert what you sent:\n\n```php\nHttp::assertSent(fn ($request) =>\n    $request->url() === 'https://api.example.com/users'\n    && $request['name'] === 'Rajan');\n```\n\n```text\nwhat did the API return?      the fake\ndid we call it correctly?     assertSent\n```\n\nBoth halves matter. A test that only fakes the response passes when you send the wrong body to the wrong endpoint.\n\n---\n\n### 3. Advanced — processes, and the boundary\n\nThe third door out of your application:\n\n```php\n$result = Process::run('php artisan about');\n\n$result->successful();\n$result->output();\n$result->errorOutput();\n```\n\n```text\nLaravel  →  Process  →  the operating system  →  a command\n```\n\nUseful for the things PHP cannot do itself:\n\n```text\nffmpeg          video and audio\nImageMagick     images beyond what PHP handles\ngit\npython scripts\nany CLI utility\n```\n\n<b>And it is a security boundary, in the same way SQL was.</b>\n\n```php\nProcess::run(\"rm -rf {$userInput}\");\n```\n\nThe user's input becomes part of the command. A value of `/tmp/x; rm -rf /` is two commands, and the shell runs both. This is yesterday's SQL injection with a different interpreter.\n\nThe fix is the same shape: <b>pass the command as an array</b>, so arguments stay arguments:\n\n```php\nProcess::run(['ffmpeg', '-i', $inputPath, $outputPath]);\n```\n\nNo shell parses that, so a semicolon in a filename is a semicolon in a filename. As with SQL, values can be passed safely and <i>structure</i> cannot: a user-chosen flag or command name needs a whitelist.\n\nTwo more habits: <b>set a timeout</b>, because a hung `ffmpeg` is the stuck-worker problem again, and <b>run anything slow in a queued job</b> rather than a request.\n\n---\n\n### The day, in one picture\n\n```text\n                  Laravel\n                     │\n        ┌────────────┼────────────┐\n        ▼            ▼            ▼\n   Filesystem   HTTP Client    Process\n        │            │            │\n   local / S3   external APIs    the OS\n```\n\nYour code says \"store this file\", \"call this API\", \"run this process\". <b>Not \"write to /var/www\", \"construct a cURL handle\", or \"build a shell string\".</b> That is what makes an application testable, movable and possible to scale.",
      diagram: `Concurrent requests

  Sequential:

    User API → wait → Orders API → wait → Billing API
    total = T1 + T2 + T3

  Three calls at 400ms is 1.2 seconds of spinner,
  almost all of it waiting on somebody else's network.

  Http::pool(fn (\$pool) => [ ... ])

               ┌→ User API
  Application ─┼→ Orders API
               └→ Billing API

    total ≈ max(T1, T2, T3)      1.2s becomes 400ms

  Name them, or you are indexing by position:
    \$pool->as('users')->get(...)
    \$responses['users']->json()

  Only works when the calls are INDEPENDENT. If the
  second needs the first's result, they are sequential
  by nature.

  And each response still needs checking: one failing
  does not fail the pool.


Faking in tests

  without fakes           with fakes
  ─────────────           ──────────
  test → internet         test → Http::fake()
      → external API          → a response you chose
      → slow, flaky           → fast, deterministic
      → costs money           → free

  Http::fake([
      'api.example.com/users' => Http::response([...], 200),
      'api.example.com/*'     => Http::response([], 404),
  ]);

  The bigger win: testing FAILURE. You cannot ask a real
  API for a 500 on demand, so your retry, timeout and
  throw() paths are untestable against it. A fake
  produces one instantly.

  And assert what you SENT:

    Http::assertSent(fn (\$r) =>
        \$r->url() === '...' && \$r['name'] === 'Rajan');

    what did the API return?   the fake
    did we call it correctly?  assertSent

  A test that only fakes the response passes when you
  send the wrong body to the wrong endpoint.


Processes, and the boundary

  Laravel → Process → the operating system → a command

  ffmpeg · ImageMagick · git · python · any CLI utility


  ⚠️  Process::run("rm -rf {\$userInput}")

      /tmp/x; rm -rf /   is TWO commands, and the shell
      runs both. This is SQL injection with a different
      interpreter.

  Same fix, same shape: pass an ARRAY.

    Process::run(['ffmpeg', '-i', \$input, \$output])

  No shell parses that, so a semicolon in a filename is
  a semicolon in a filename.

  As with SQL: values can be passed safely, STRUCTURE
  cannot. A user-chosen flag or command needs a whitelist.

  Set a timeout — a hung ffmpeg is the stuck-worker
  problem again. And run anything slow in a job.


The day

                    Laravel
                       │
          ┌────────────┼────────────┐
          ▼            ▼            ▼
     Filesystem   HTTP Client    Process
          │            │            │
     local / S3   external APIs    the OS

  "store this file"   not  "write to /var/www"
  "call this API"     not  "construct a cURL handle"
  "run this process"  not  "build a shell string"`,
      codeExample: {
        title: "Pooling, fakes and processes",
        code: `<?php

use Illuminate\\Support\\Facades\\Http;
use Illuminate\\Support\\Facades\\Process;

// ---------- Concurrent, and named ----------

$responses = Http::pool(fn ($pool) => [
    $pool->as('users')->get('https://api.example.com/users'),
    $pool->as('orders')->get('https://api.example.com/orders'),
    $pool->as('billing')->get('https://api.example.com/billing'),
]);

// Each one still needs checking: one failing does not
// fail the pool.
if ($responses['users']->successful()) {
    $users = $responses['users']->json();
}

// Only for INDEPENDENT calls. If the second needs the
// first's id, they are sequential by nature.


<?php
// ---------- Faking ----------

class InvoiceSyncTest extends TestCase
{
    public function test_it_stores_the_returned_invoices(): void
    {
        Http::fake([
            'api.example.com/invoices' => Http::response([
                'data' => [
                    ['number' => 'INV-001', 'total' => 100],
                ],
            ], 200),

            // Anything else is a 404, so an unexpected call
            // fails the test instead of hitting the network.
            '*' => Http::response([], 404),
        ]);

        (new InvoiceSync)->run();

        $this->assertDatabaseHas('invoices', ['number' => 'INV-001']);

        // Did we call it correctly? The fake alone does not
        // tell you: a test that only fakes the response
        // passes when you post the wrong body to the wrong URL.
        Http::assertSent(fn ($request) =>
            $request->url() === 'https://api.example.com/invoices'
            && $request->hasHeader('Authorization'));

        // And the half people skip: proving you did NOT
        // call something.
        Http::assertNotSent(fn ($request) =>
            str_contains($request->url(), '/charge'));
    }

    public function test_it_survives_a_server_error(): void
    {
        // You cannot ask a real API for a 500 on demand,
        // which is why the error path is untestable without
        // a fake.
        Http::fake(['*' => Http::response([], 500)]);

        (new InvoiceSync)->run();

        $this->assertDatabaseCount('invoices', 0);
    }
}


<?php
// ---------- Processes ----------

$result = Process::run('php artisan about');

$result->successful();
$result->exitCode();
$result->output();
$result->errorOutput();


// ❌ The user's value becomes part of the command.
//    "/tmp/x; rm -rf /" is two commands, and the shell
//    runs both. SQL injection, different interpreter.
Process::run("ffmpeg -i {$userPath} out.mp4");

// ✓ An array. No shell parses it, so a semicolon in a
//   filename is a semicolon in a filename.
Process::timeout(120)->run([
    'ffmpeg',
    '-i', $inputPath,
    '-vf', 'scale=1280:-2',
    $outputPath,
]);

// As with SQL: values pass safely, structure does not.
// A user-chosen flag or command name needs a whitelist.

$preset = in_array(request('preset'), ['fast', 'slow'], true)
    ? request('preset')
    : 'fast';


<?php
// ---------- And off the request ----------

class TranscodeVideo implements ShouldQueue
{
    public function handle(): void
    {
        // A hung ffmpeg in a request is the stuck-worker
        // problem from the last lesson.
        $result = Process::timeout(600)->run([
            'ffmpeg', '-i', $this->input, $this->output,
        ]);

        if (! $result->successful()) {
            throw new RuntimeException($result->errorOutput());
        }
    }
}


<?php
// ---------- Faking processes too ----------

Process::fake([
    'ffmpeg *' => Process::result(output: 'done', exitCode: 0),
]);`,
      },
      keyTakeaways: [
        "<b>`Http::pool()` sends independent requests concurrently</b>, so the total is the slowest rather than the sum.",
        "<b>Name pooled requests with `as()`</b>, rather than indexing the results by position.",
        "<b>Pooling only helps when the calls are independent</b>, and each response still needs checking.",
        "<b>`Http::fake()` stops tests reaching the network</b>, making them fast, deterministic and free.",
        "<b>The bigger win is testing failure</b>, because a real API will not return a 500 on request.",
        "<b>`Http::assertSent()` checks that you called the API correctly</b>, which a fake alone cannot tell you.",
        "<b>`Process::run()` executes a system command</b>, for the things PHP cannot do itself.",
        "<b>Interpolating user input into a command is injection</b>, exactly as it was with SQL.",
        "<b>Pass the command as an array</b>, so arguments stay arguments and no shell parses them.",
        "<b>Set a process timeout and run slow commands in a queued job</b>, or you are back to stuck workers.",
        "<b>Your code should say \"store this file\", \"call this API\", \"run this process\"</b>, never name a path, a cURL handle or a shell string.",
      ],
      commonMistakes: [
        "<b>Pooling calls that depend on each other.</b> The second needs the first's result, so they cannot overlap.",
        "<b>Assuming a pool fails as a whole.</b> Each response is separate, and one may be a 500.",
        "<b>Calling real APIs in tests.</b> Slow, flaky, sometimes expensive, and the failure paths stay untested.",
        "<b>Faking the response without asserting the request.</b> The test passes with the wrong body and the wrong URL.",
        "<b>Building a shell command by string interpolation.</b> A semicolon in the value runs a second command.",
      ],
      quiz: [
        {
          question: "What does `Http::pool()` change about three API calls?",
          options: [
            "They are cached",
            "They run concurrently, so the total is roughly the slowest rather than the sum",
            "They are retried automatically",
            "They share one connection",
          ],
          correctIndex: 1,
          explanation: "Only when the calls are independent of each other.",
        },
        {
          question: "What is the biggest testing win from `Http::fake()`?",
          options: [
            "Faster tests",
            "You can produce failures such as a 500 on demand, which a real API will not do",
            "It removes the need for assertions",
            "It records real responses",
          ],
          correctIndex: 1,
          explanation: "Retries, timeouts and the `throw()` path become testable.",
        },
        {
          question: "Why use `Http::assertSent()` as well as a fake?",
          options: [
            "It speeds the test up",
            "The fake shows what came back, not whether you called the right endpoint with the right body",
            "It is required by Laravel",
            "It replaces the fake",
          ],
          correctIndex: 1,
          explanation: "Both halves matter: what they returned and what you sent.",
        },
        {
          question: "Why pass a command to `Process::run()` as an array?",
          options: [
            "It is faster",
            "No shell parses it, so a value containing a semicolon cannot become a second command",
            "Arrays support timeouts",
            "It captures output better",
          ],
          correctIndex: 1,
          explanation: "The same shape as parameter binding in SQL.",
        },
      ],
    },
  ],
  finalQuiz: [
    {
      question: "What does `php artisan storage:link` create?",
      options: [
        "A new disk in config",
        "A symlink from `public/storage` to `storage/app/public`",
        "An S3 bucket",
        "A database table",
      ],
      correctIndex: 1,
      explanation: "Without it, files on the public disk sit on disk unreachable.",
    },
    {
      question: "Why is S3 usually better than the local disk in production?",
      options: [
        "It is faster to write",
        "Every application server shares one store, and files survive a server being replaced",
        "It compresses files",
        "It is cheaper",
      ],
      correctIndex: 1,
      explanation: "The local disk assumes there is one server, forever.",
    },
    {
      question: "What is the difference between `store()` and `storeAs()`?",
      options: [
        "The disk used",
        "`store()` generates the filename; `storeAs()` lets you choose it",
        "`storeAs()` streams the file",
        "None",
      ],
      correctIndex: 1,
      explanation: "Prefer `store()`, because a filename from a browser is user input.",
    },
    {
      question: "When should a stored file be private?",
      options: [
        "When it is large",
        "When it belongs to one person: an invoice, an export, a medical document",
        "Only in production",
        "When it is not an image",
      ],
      correctIndex: 1,
      explanation: "Avatars and logos are public; anything belonging to somebody is not.",
    },
    {
      question: "What does a temporary URL let you do?",
      options: [
        "Make a public file expire",
        "Authorize in your application while object storage delivers the file directly",
        "Compress the download",
        "Cache the file locally",
      ],
      correctIndex: 1,
      explanation: "The download never passes through your server.",
    },
    {
      question: "What problem does the read-through filesystem driver solve?",
      options: [
        "Files being deleted",
        "Repeatedly fetching the same remote file, by keeping a local read cache in front of the canonical store",
        "Uploading large files",
        "Generating thumbnails",
      ],
      correctIndex: 1,
      explanation: "The source stays the truth, so a stale cache is not a correctness problem.",
    },
    {
      question: "Why does `max:10240` not protect against a huge image?",
      options: [
        "It is in bytes",
        "It limits the file size, while decoding allocates memory in proportion to the dimensions",
        "Images are exempt",
        "It does protect against it",
      ],
      correctIndex: 1,
      explanation: "Add a `dimensions:` rule as well.",
    },
    {
      question: "Why must external HTTP calls have timeouts?",
      options: [
        "To reduce bandwidth",
        "Each waiting request occupies a worker, so a hanging API can take your whole site down",
        "Laravel requires it",
        "To enable retries",
      ],
      correctIndex: 1,
      explanation: "A timeout turns their outage into a handled error on one feature.",
    },
    {
      question: "When is retrying an HTTP request dangerous?",
      options: [
        "On any GET",
        "On a non-idempotent write, because the first attempt may have succeeded with its response lost",
        "When the API is slow",
        "Never",
      ],
      correctIndex: 1,
      explanation: "An idempotency key is what makes a repeated write safe.",
    },
    {
      question: "Why fake HTTP calls in tests?",
      options: [
        "Only for speed",
        "For speed and determinism, and because a real API will not return a 500 on demand so failure paths stay untested",
        "Laravel blocks real calls in tests",
        "To avoid writing assertions",
      ],
      correctIndex: 1,
      explanation: "Pair the fake with `assertSent()` to check what you sent.",
    },
    {
      question: "Why is interpolating user input into a `Process` command dangerous?",
      options: [
        "It is slow",
        "The value can contain shell syntax and become a second command",
        "Processes cannot take arguments",
        "It breaks the output",
      ],
      correctIndex: 1,
      explanation: "Pass the command as an array, so no shell parses it.",
    },
    {
      question: "What is the difference between `Http::query()` and adding query parameters to a GET?",
      options: [
        "None",
        "`Http::query()` sends an HTTP `QUERY` request; query parameters build the URL of a `GET`",
        "`Http::query()` is for databases",
        "`Http::query()` encodes the parameters",
      ],
      correctIndex: 1,
      explanation: "`QUERY` is a read with a body: retryable and cacheable where a POST search is neither.",
    },
  ],
  project: {
    name: "InvoiceHub",
    goal: "Give InvoiceHub file handling and an external integration: PDF invoices on private storage with temporary links, uploaded logos resized and converted, and an exchange-rate API that survives being down.",
    brief: "InvoiceHub stores rows and nothing else. Today it gets files and a dependency.\n\nBoth are places where your application stops being in control. A file lives somewhere you have to choose, and an external API is a service that will one day be slow, wrong or unreachable while your page is still expected to load.\n\nSo the discipline for today is <b>build the failure case first</b>. Before the happy path works, point the API at a URL that does not answer and decide what the page does. Before the upload works, try a file that is not what it claims to be. The code that handles the good case writes itself; the code that handles the rest is the day.\n\nAnd one rule throughout: nothing in your application should name a filesystem path or construct a URL by hand. Every file goes through `Storage`, so the same code can run against the local disk in tests and S3 in production.",
    steps: [
      "Configure three disks: `local` for private files, `public` for assets, and `s3` if you have credentials, or a second local disk standing in for it. Run `storage:link` and add it to your deploy notes.",
      "Add a logo upload to the customer form. Validate it with `image`, `max:` and a `dimensions:` rule, and write down in a comment what each rule stops.",
      "Store it with `store()` and confirm the filename is generated. Then deliberately try `storeAs()` with the original filename and note three things that could go wrong.",
      "Read the image, correct its orientation, scale it down to 400px and store it as WebP. Compare the stored size with the original and record both numbers.",
      "Extract the dominant colour and store it on the customer. Use it as the background while the logo loads, and reload the page to see the difference.",
      "Generate an invoice PDF and store it on a private disk. Confirm from an incognito window that there is no URL that reaches it.",
      "Add a download route that authorizes with yesterday's policy and streams the file with `download()`, passing the original name. Confirm a second user gets a 403.",
      "Now add a temporary URL route instead: authorize, then redirect to a ten-minute signed URL. Copy the URL, wait for it to expire, and confirm it stops working.",
      "Write down the difference between those two routes: what passes through your server in each, and which you would use for a 50 MB file.",
      "Add a `forceDeleted` hook that removes the PDF, then delete an invoice properly and confirm the file is gone. Then run a mass delete and confirm the file is not.",
      "Write a command that lists stored invoice files and reports any with no matching record. Report only; do not delete.",
      "Add an exchange-rate lookup using the HTTP client, with `connectTimeout`, `timeout` and a `retry` that only retries connection errors and 5xx.",
      "Point it at a URL that does not respond and load the page. Decide what a user sees: a cached rate, a blank field, an error. Write down the decision and implement it.",
      "Wrap the API in a small class with a macro holding the base URL, token and timeouts, so no controller knows where the service lives.",
      "Fake the API in a test: one test for the successful response, one for a 500, and one asserting you called the right endpoint with the right headers.",
      "Add a second API call the page needs and combine them with `Http::pool()`. Time the page before and after, and record both numbers.",
      "Add a PDF page-count using `Process` with an array command and a timeout. Then try the string-interpolated version with a filename containing a semicolon, see what happens, and revert.",
      "Finally, list every file your application writes and answer for each: which disk, public or private, who may read it, and what deletes it.",
    ],
    acceptance: [
      "No path in the application is written by hand; every file goes through `Storage`.",
      "An uploaded logo is stored with a generated name, correctly oriented, resized and converted, and you recorded the before and after sizes.",
      "The dominant colour appears as a placeholder before the logo loads.",
      "Invoice PDFs are on a private disk with no reachable URL.",
      "The download route refuses a second user with a 403, and the temporary URL stops working after it expires.",
      "You can explain what passes through your server in each of the two serving routes.",
      "Deleting an invoice removes its PDF, and you know why a mass delete does not.",
      "The audit command reports orphaned files without deleting anything.",
      "With the exchange-rate API unreachable, the page still loads and behaves the way you decided it should.",
      "Three tests cover the API: success, a 500, and an assertion about the request you sent.",
      "The two API calls run concurrently, and you recorded the page timing before and after.",
      "Every `Process` call passes an array and has a timeout.",
      "You can list every file the application writes, with its disk, its visibility, its readers, and what deletes it.",
    ],
    stretch: [
      "Generate three logo sizes in a queued job from the stored original, and serve the right one per breakpoint.",
      "Add a temporary upload URL so a large attachment goes from the browser straight to S3, never through your server.",
      "Add an idempotency key to a write against an external API and demonstrate that a retry does not duplicate the effect.",
    ],
  },
};
