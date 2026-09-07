import type { LessonDay } from "@/lib/learn/lesson-types";

export const NODEJS_DAY_27_LESSONS: LessonDay = {
  day: 27,
  title: "Docker & containers",
  totalMinutes: 98,
  difficulty: "Intermediate",
  lessons: [
    {
      id: "images-and-layers",
      title: "Images, layers and the cache",
      durationMinutes: 12,
      explanation:
        "## Container\n\n<b>Container</b> (an isolated process with its own filesystem, running on the host's kernel).\n\n> The distinction from a virtual machine matters for a practical reason: a container shares the host kernel, so it starts in milliseconds and costs almost nothing beyond the process itself. That is why you can run twenty of them and why an orchestrator can restart one in a second.\n\n<b>Image</b> (the read-only filesystem a container starts from).\n\n<b>Dockerfile</b> (the instructions that build an image).\n\n---\n\n## What Docker actually solves\n\n```text\n\"works on my machine\"  →  ships the machine\n```\n\n> Concretely: your Node version, your native module builds, your `NODE_ENV`, your locale, and the exact `node_modules` tree. Day 12's `npm ci` and a lockfile get you a reproducible dependency tree; the image gets you a reproducible everything else.\n\n---\n\n## Layers\n\n<b>Layer</b> (the filesystem diff produced by one Dockerfile instruction).\n\n<b>Build cache</b> (Docker reusing a layer when its inputs have not changed).\n\n> The rule that decides your build times: <b>a changed layer invalidates every layer after it</b>. So the order of your Dockerfile is not cosmetic. Copy your lockfile and install, and only then copy your source, because your source changes on every commit and your dependencies do not.\n>\n> Get that backwards and every one-character change reinstalls `node_modules`.\n\n---\n\n## Base images, measured\n\nVerified with `docker pull` and `docker images`:\n\n```text\nnode:24          1.64 GB\nnode:24-slim      351 MB\nnode:24-alpine    231 MB\n```\n\n> `node:24` is Debian with a full build toolchain, which is why it is over a gigabyte. `slim` is Debian without the toolchain. `alpine` uses musl instead of glibc, which is smaller and is also the reason to be careful: a native module compiled for glibc will not load, and some behave differently.\n>\n> The honest recommendation is <b>slim</b> as a default. 120MB more than alpine, glibc, and no debugging session that ends in \"it works on Debian\".\n\n---\n\n## And a size claim worth checking\n\n> The common target of \"under 150MB\" is <b>not reachable with an official Node base image</b>. Measured below, a well-built multi-stage alpine image with production dependencies came out at <b>247MB</b>, and slim at <b>364MB</b>. Alpine's 231MB base is most of the alpine number.\n>\n> So aim to go from 1.7GB to about 250MB, which is the real win. Getting under 150 means a distroless or scratch base, which is a different exercise.",
      diagram: `Container vs VM

    a container SHARES THE HOST KERNEL.

    → starts in MILLISECONDS
    → costs almost nothing beyond the process

    that is why you can run twenty, and why an
    orchestrator can restart one in a second.


What Docker actually solves

    "works on my machine"  →  SHIPS THE MACHINE

    concretely:
      your Node version
      your native module builds
      your NODE_ENV
      your locale
      the exact node_modules tree

    Day 12's npm ci + lockfile   = reproducible
                                   dependencies
    the image                    = reproducible
                                   EVERYTHING ELSE


⚠⚠ Layers and the cache

    LAYER   the filesystem diff from ONE
            instruction

    THE RULE THAT DECIDES YOUR BUILD TIMES:

      A CHANGED LAYER INVALIDATES EVERY LAYER
      AFTER IT.

    → the order of your Dockerfile is NOT
      cosmetic

    ✓ copy the lockfile, install, THEN copy source

      your source changes every commit.
      your dependencies do not.

    ✗ backwards, and every one-character change
      reinstalls node_modules


Base images. VERIFIED with docker images.

    node:24          1.64 GB
    node:24-slim      351 MB
    node:24-alpine    231 MB

    node:24    Debian + a full build toolchain
               → over a gigabyte
    slim       Debian WITHOUT the toolchain
    alpine     musl instead of glibc
               → smaller, and the reason to be
                 careful:

               ⚠ a native module compiled for
                 glibc WILL NOT LOAD, and some
                 behave differently

    ✓ the honest default: SLIM

      120MB more than alpine, glibc, and no
      debugging session ending in "it works on
      Debian".


⚠⚠ A size claim worth checking

    "under 150MB" is NOT REACHABLE with an
    official Node base image.

    measured, multi-stage, prod deps only:

      alpine   247 MB
      slim     364 MB

    alpine's 231MB BASE is most of the 247.

    → aim for 1.7GB → ~250MB. that is the real
      win.

      under 150 means DISTROLESS or SCRATCH, a
      different exercise.`,
      codeExample: {
        title: "A Dockerfile, and why the order is what it is",
        code: `// ── ✗ The version that rebuilds everything, every time ──────
//
//   FROM node:24
//   WORKDIR /app
//   COPY . .                    ← ⚠ source FIRST
//   RUN npm install
//   CMD ["npm", "start"]
//
// Four things wrong, and they compound.
//
// 1. node:24 is 1.64GB before you add anything (VERIFIED).
// 2. COPY . . before the install means ANY source change
//    invalidates the npm install layer. Fix a typo, wait two
//    minutes.
// 3. npm install can resolve versions differently from your
//    lockfile. Day 12: npm ci is the reproducible one.
// 4. It brings devDependencies, your .git directory, your
//    local .env and your node_modules built on macOS.
//
// Measured: this produces a 1.7GB image that runs as root.


// ── ✓ Multi-stage, cache-ordered ────────────────────────────
//
//   # ---- build ----
//   FROM node:24-slim AS build
//   WORKDIR /app
//
//   COPY package*.json ./       ← ⚠ lockfile FIRST
//   RUN npm ci
//   #   ^ this layer is cached until your DEPENDENCIES change
//
//   COPY . .
//   RUN npm run build
//
//   # ---- runtime ----
//   FROM node:24-slim
//   WORKDIR /app
//   ENV NODE_ENV=production
//
//   COPY package*.json ./
//   RUN npm ci --omit=dev && npm cache clean --force
//   #                        ^^^^^^^^^^^^^^^^^^^^^^ the cache
//   #   lives in the layer otherwise, so cleaning it in the
//   #   SAME RUN is what actually removes it
//
//   COPY --from=build /app/dist ./dist
//
//   USER node
//   EXPOSE 3000
//   CMD ["node", "dist/server.js"]
//
// Measured: 364MB, runs as node.
//
// From 1.7GB to 364MB, which is the win that matters. The
// alpine version of the same file measured 247MB.


// ── ⚠ Why "in the same RUN" is not a detail ─────────────────
//
//   ✗ RUN npm ci --omit=dev
//     RUN npm cache clean --force
//
// Two layers. The first one contains the cache, the second
// one contains a filesystem diff that deletes it. The image
// still ships both, so it is bigger AND the files are still
// in there.
//
// The same applies to a secret. Copying a .npmrc with a token
// in one layer and deleting it in the next leaves the token
// in the image, readable by anyone who pulls it. That is what
// build secrets exist for.


// ── .dockerignore, which is not optional ────────────────────
//
//   node_modules
//   .git
//   .env
//   .env.*
//   dist
//   coverage
//   *.log
//   .DS_Store
//   Dockerfile
//   docker-compose.yml
//
// Three reasons, in order of how much they bite.
//
// node_modules: yours were built on your OS. Copying them in
// and then installing on top gives you a mix of macOS and
// Linux binaries, and native modules fail in confusing ways.
//
// .env: Day 20's point. Your local secrets end up baked into
// an image you push to a registry.
//
// .git: often the largest thing in the directory, and it
// contains every version of every file you ever committed,
// including the credential you removed in a later commit.
//
// And a fourth: every ignored file is one Docker does not
// send to the daemon, which is why builds feel faster with
// this file than without it.


// ── Checking your own numbers ───────────────────────────────
// $ docker images node --format "{{.Tag}}\\t{{.Size}}"
//   24          1.64GB       ← VERIFIED
//   24-slim     351MB
//   24-alpine   231MB
//
// $ docker build -t app:slim -f Dockerfile.slim .
// $ docker images app --format "{{.Tag}}\\t{{.Size}}"
//   naive    1.7GB
//   slim     364MB
//   alpine   247MB
//
// ⚠ Note what that says about the popular "get under 150MB"
// target: alpine's BASE is 231MB, so 247MB is the base plus
// 16MB of your application and dependencies. There is almost
// nothing left to trim.
//
// If 150MB genuinely matters, the next step is a distroless
// or scratch base with a bundled application, which trades
// away having a shell in the container. That is a real option
// and it is not a Dockerfile tweak.
//
// $ docker history app:slim
//   Use this to see WHICH layer is large. Usually it is the
//   base, sometimes it is an apt-get without a cleanup, and
//   occasionally it is a COPY that picked up something your
//   .dockerignore missed.


// ── Alpine, and the caution that goes with it ───────────────
// alpine uses musl libc rather than glibc. Two consequences.
//
// A prebuilt native binary targeting glibc will not load:
//
//   Error: Error loading shared library ld-linux-x86-64.so.2
//
// So a package like bcrypt, sharp or a database driver with a
// prebuilt binary may need compiling from source, which means
// adding build tools to the build stage:
//
//   RUN apk add --no-cache python3 make g++
//
// And a few behaviours differ: DNS resolution and some locale
// handling are not identical to glibc, which produces bugs
// that only appear in the container.
//
// ✓ So: slim unless the 120MB matters to you. If you use
//   alpine, run your tests IN the container, not just on your
//   machine.`,
      },
      keyTakeaways: [
        "A container shares the host kernel, so it starts in milliseconds, which is why an orchestrator can restart one in a second.",
        "`npm ci` and a lockfile give reproducible dependencies. The image gives reproducible everything else: Node version, native builds, locale.",
        "A changed layer invalidates every layer after it, so Dockerfile order decides your build times.",
        "Copy the lockfile and install before copying source, because source changes every commit and dependencies do not.",
        "Verified: `node:24` is 1.64GB, `node:24-slim` is 351MB, `node:24-alpine` is 231MB.",
        "`node:24` is over a gigabyte because it carries a full build toolchain.",
        "slim is the honest default: 120MB more than alpine, glibc, and no bug that only appears in the container.",
        "Alpine uses musl, so a native module built for glibc will not load and some behaviours differ.",
        "Measured: a naive image was 1.7GB and ran as root. Multi-stage slim was 364MB, alpine 247MB.",
        "The popular \"under 150MB\" target is not reachable with an official Node base, since alpine's base alone is 231MB.",
        "So the real win is 1.7GB to about 250MB. Under 150 needs distroless or scratch, which is a different exercise.",
        "Clean the npm cache in the same `RUN`, or the cache ships in one layer and its deletion in the next.",
        "The same applies to secrets: a token copied in one layer and deleted in the next is still in the image.",
        "`.dockerignore` keeps out macOS-built `node_modules`, your `.env`, and a `.git` directory containing every credential you ever removed.",
      ],
      commonMistakes: [
        "`COPY . .` before the install, so every source change reinstalls all dependencies.",
        "`npm install` instead of `npm ci`, which can resolve versions differently from the lockfile.",
        "Using `node:24` as a runtime base, which is 1.64GB of mostly build toolchain.",
        "Choosing alpine for the 120MB and then debugging a native module that needs glibc.",
        "Chasing an \"under 150MB\" target that no official Node base can reach.",
        "Cleaning the npm cache in a separate `RUN`, so both the cache and its deletion ship.",
        "Copying a token-bearing file and deleting it later, leaving it readable in an earlier layer.",
        "No `.dockerignore`, so macOS `node_modules`, `.env` and the whole `.git` history go into the image.",
        "Shipping devDependencies, which is both size and attack surface for code that never runs in production.",
        "Testing only on the host when building on alpine, so musl differences surface in production.",
      ],
      quiz: [
        {
          question: "Why does the lockfile get copied before the source?",
          options: [
            "npm requires it",
            "A changed layer invalidates every layer after it, so copying source first makes every commit reinstall all dependencies",
            "It is faster to copy",
            "For security",
          ],
          correctIndex: 1,
          explanation:
            "Source changes on every commit and dependencies do not, so the install layer should sit above the source copy.",
        },
        {
          question: "What were the measured sizes of the Node base images?",
          options: [
            "All around 300MB",
            "`node:24` 1.64GB, `node:24-slim` 351MB, `node:24-alpine` 231MB",
            "alpine was largest",
            "They are identical, only the tags differ",
          ],
          correctIndex: 1,
          explanation:
            "`node:24` carries a full build toolchain. slim drops it, and alpine also swaps glibc for musl.",
        },
        {
          question: "A well-built multi-stage alpine image measured 247MB. What does that tell you about a \"under 150MB\" target?",
          options: [
            "The build was wrong",
            "It is not reachable with an official Node base, since alpine's base alone is 231MB. Getting under 150 needs distroless or scratch.",
            "Use slim instead",
            "Remove more dependencies",
          ],
          correctIndex: 1,
          explanation:
            "The real win is going from a 1.7GB naive image to about 250MB, not shaving the last hundred megabytes.",
        },
        {
          question: "Why clean the npm cache in the same `RUN` as the install?",
          options: [
            "npm needs it",
            "A separate `RUN` is a new layer, so the image ships the cache in one layer and its deletion in the next",
            "It is faster",
            "To reduce build time",
          ],
          correctIndex: 1,
          explanation:
            "The same reason a secret copied in one layer and deleted in the next is still readable in the image.",
        },
        {
          question: "What is the main risk of choosing alpine?",
          options: [
            "It is slower",
            "musl instead of glibc, so a native module with a glibc-targeted prebuilt binary will not load, and some behaviours differ",
            "No package manager",
            "It cannot run Node",
          ],
          correctIndex: 1,
          explanation:
            "slim is 120MB larger and avoids a class of bug that only appears inside the container.",
        },
      ],
    },
    {
      id: "non-root-and-secrets",
      title: "Running as a real user, and keeping secrets out",
      durationMinutes: 11,
      explanation:
        "## Root by default\n\nVerified on the naive image:\n\n```bash\n$ docker run --rm --entrypoint id app:naive -un\nroot\n```\n\n> Containers run as root unless you say otherwise, and that is worth being precise about. Root in a container is not root on the host in the normal case, so this is not an instant compromise. What it is, is the removal of one layer of defence: a path traversal or an arbitrary write that would fail against a read-only application directory now succeeds, and a container escape becomes far more useful to an attacker.\n>\n> Official Node images already ship a `node` user, so this costs one line.\n\n```dockerfile\nUSER node\n```\n\nVerified on the fixed image:\n\n```bash\n$ docker run --rm --entrypoint id app:slim -un\nnode\n```\n\n---\n\n## Where the line goes\n\n> `USER node` must come <b>after</b> the instructions that need to write, because everything after it runs as `node`. So install and copy first, then switch. And anything the application writes at runtime needs to be owned by `node`, which is what `--chown` on the `COPY` is for.\n\n---\n\n## Read-only filesystems\n\n```bash\ndocker run --read-only --tmpfs /tmp app:slim\n```\n\n> Worth doing once you know what your application writes, and the way to find out is to try it. Most Node applications write nothing except temporary files, so a `tmpfs` for `/tmp` is usually the whole requirement.\n\n---\n\n## Secrets\n\n> Three ways secrets get into an image, and all three are common.\n>\n> <b>ENV in the Dockerfile</b>. It is in the image, visible to anyone who runs `docker history`, and it is in your git repository too.\n>\n> <b>A copied file, deleted later</b>. The layer that added it is still there. Deleting a file in a later layer does not remove it from the image.\n>\n> <b>A build argument</b>. `ARG` values appear in the image metadata, so `--build-arg NPM_TOKEN=...` is not private either.\n>\n> The mechanism that actually works is a <b>build secret</b>, mounted for one `RUN` and never written to a layer.\n\n---\n\n## And at runtime\n\n> Day 20 covered this and the container framing adds one thing: an environment variable is visible in `docker inspect` and to anything that can read the process environment, whereas a <b>mounted file</b> is readable only by the user who needs it and can be rotated without restarting anything. That is why orchestrators mount secrets as files.",
      diagram: `⚠⚠ Root by default. Verified.

    $ docker run --rm --entrypoint id app:naive -un
      root

    be precise about WHY this matters:

      root in a container is NOT root on the host
      in the normal case.

      so it is not an instant compromise.

    what it IS: the removal of ONE LAYER OF
    DEFENCE.

      a path traversal or arbitrary write that
      would fail against a read-only application
      directory now SUCCEEDS

      and a container escape becomes far more
      useful to an attacker

    ✓ official Node images already ship a node
      user. this costs ONE LINE:

        USER node

    $ docker run --rm --entrypoint id app:slim -un
      node                              ← VERIFIED


Where the line goes

    USER node must come AFTER the instructions
    that need to write, because everything after
    it runs as node.

      install and copy first
      THEN switch

    and anything written at runtime must be owned
    by node → COPY --chown=node:node


Read-only filesystems

    docker run --read-only --tmpfs /tmp app:slim

    worth doing once you know what your app
    writes, and the way to find out is to TRY IT.

    most Node apps write nothing but temp files,
    so a tmpfs for /tmp is usually the whole
    requirement.


⚠⚠ Three ways secrets get into an image

    ENV IN THE DOCKERFILE
      in the image, visible to docker history,
      and in your git repo too

    A COPIED FILE, DELETED LATER
      the layer that ADDED it is still there.
      deleting in a later layer does not remove
      it.

    A BUILD ARGUMENT
      ARG values appear in image METADATA, so
      --build-arg NPM_TOKEN=... is not private

    ✓ the mechanism that works: a BUILD SECRET,
      mounted for one RUN, never written to a
      layer


And at runtime (Day 20, plus one thing)

    an ENV VAR is visible in docker inspect and to
    anything that can read the process
    environment.

    a MOUNTED FILE is readable only by the user
    who needs it, and can be ROTATED WITHOUT
    RESTARTING anything.

    → that is why orchestrators mount secrets as
      files.`,
      codeExample: {
        title: "Non-root, and secrets that stay out of the image",
        code: `// ── ⚠ The measurement, both ways ────────────────────────────
// $ docker run --rm --entrypoint id app:naive -un
//   root                                      ← VERIFIED
//
// $ docker run --rm --entrypoint id app:slim -un
//   node                                      ← VERIFIED
//
// One line of Dockerfile is the whole difference.


// ── ✓ Where USER goes, and why ──────────────────────────────
//
//   FROM node:24-slim
//   WORKDIR /app
//   ENV NODE_ENV=production
//
//   # Still root here, because npm ci writes to /app.
//   COPY package*.json ./
//   RUN npm ci --omit=dev && npm cache clean --force
//
//   # --chown so the files belong to the user that will run.
//   COPY --chown=node:node . .
//
//   USER node
//   #    ^ everything AFTER this line runs as node
//
//   EXPOSE 3000
//   CMD ["node", "server.js"]
//
// ⚠ Put USER node before the npm ci and the install fails on
// permissions. Put it after everything and the application
// cannot write to a directory it owns nothing in. The order
// above is the one that works.
//
// And if your app writes at runtime:
//
//   RUN mkdir -p /app/uploads && chown node:node /app/uploads
//
// before the USER line, or the first write fails with EACCES
// in production and nowhere else.


// ── Read-only, once you know what it writes ─────────────────
// $ docker run --read-only --tmpfs /tmp -p 3000:3000 app:slim
//
// Try it and see what breaks. Most Node applications need
// nothing beyond /tmp, and the ones that do usually want a
// volume anyway rather than a writable image.
//
// In compose:
//
//   services:
//     api:
//       image: app:slim
//       read_only: true
//       tmpfs:
//         - /tmp
//       cap_drop:
//         - ALL
//       security_opt:
//         - no-new-privileges:true
//
// Each of those closes something specific. cap_drop removes
// capabilities a web application has no use for, and
// no-new-privileges stops a setuid binary inside the image
// from being useful.


// ── ✗✗ The three ways secrets end up in an image ────────────
//
// 1. ENV in the Dockerfile.
//
//   ✗ ENV DATABASE_URL=postgres://user:realpassword@host/db
//
//   $ docker history app:bad --no-trunc | grep DATABASE
//     → there it is, for anyone who pulls the image.
//
//   And the Dockerfile is committed, so it is in git history
//   too, which outlives the image.
//
// 2. A file copied then deleted.
//
//   ✗ COPY .npmrc /root/.npmrc
//     RUN npm ci
//     RUN rm /root/.npmrc          ← does NOT remove it
//
//   The layer that ADDED .npmrc is still part of the image.
//   The rm is a later layer recording a deletion. Anyone can
//   extract the earlier layer.
//
//   $ docker save app:bad | tar -x -O | grep -a "authToken"
//     → the token, from the layer where it was added.
//
// 3. A build argument.
//
//   ✗ ARG NPM_TOKEN
//     RUN echo "//registry.npmjs.org/:_authToken=\${NPM_TOKEN}" > .npmrc \\
//         && npm ci && rm .npmrc
//
//   $ docker build --build-arg NPM_TOKEN=xxx .
//   $ docker inspect app:bad | grep -i npm_token
//     → ARG values are recorded in image metadata.


// ── ✓ A build secret, which is the mechanism that works ─────
//
//   # syntax=docker/dockerfile:1
//   FROM node:24-slim AS build
//   WORKDIR /app
//   COPY package*.json ./
//
//   RUN --mount=type=secret,id=npmrc,target=/root/.npmrc \\
//       npm ci
//
// $ docker build --secret id=npmrc,src=$HOME/.npmrc -t app .
//
// The file exists only while that RUN executes. It is not in
// any layer, not in the metadata, and not in docker history.
//
// Note the first line: the syntax directive is required for
// --mount=type=secret, and leaving it out gives you a
// confusing parse error rather than a helpful one.


// ── Runtime secrets: env var or mounted file ────────────────
// Day 20's config module reads process.env, and that is fine.
// But it is worth knowing what an env var exposes:
//
//   $ docker inspect api | jq '.[0].Config.Env'
//     [ "DATABASE_URL=postgres://user:pass@host/db", ... ]
//
// Anyone who can talk to the Docker socket can read every
// secret in every container. Same for a crash reporter that
// helpfully attaches the environment to an error report.
//
// ✓ A mounted file, which is what orchestrators do:
import { readFileSync, existsSync } from "node:fs";

function secret(name) {
  // Kubernetes and Docker swarm both mount secrets as files.
  const path = \`/run/secrets/\${name}\`;
  if (existsSync(path)) return readFileSync(path, "utf8").trim();

  // Fall back to the env var, so local development is
  // unchanged and Day 20's validation still runs.
  const fromEnv = process.env[name.toUpperCase()];
  if (fromEnv) return fromEnv;

  throw new Error(\`missing secret: \${name}\`);
  //              ^ Day 20's rule: fail at startup, loudly,
  //                rather than at 3am on the one code path
  //                that needed it.
}

export const config = {
  databaseUrl: secret("database_url"),
  jwtSecret: secret("jwt_secret"),
};
//
// Two things this buys you. The file is readable only by the
// user that needs it, and rotating it does not require a
// restart, because you can re-read it. An env var is fixed
// for the life of the process.


// ── Scan the thing you built ────────────────────────────────
// $ docker scout cves app:slim
// $ trivy image app:slim
//
// This finds two categories, and the second is the one people
// forget. Vulnerabilities in your dependencies, which
// npm audit also finds. And vulnerabilities in the BASE
// IMAGE's system packages, which npm audit knows nothing
// about, and which are the reason to rebuild on a base image
// update even when your own code has not changed.`,
      },
      keyTakeaways: [
        "Verified: the naive image ran as `root` and the fixed one ran as `node`, and the difference is one Dockerfile line.",
        "Root in a container is usually not root on the host, so it is not an instant compromise. It removes a layer of defence.",
        "Concretely, an arbitrary write that would fail against a read-only app directory now succeeds, and an escape becomes far more useful.",
        "Official Node images already ship a `node` user, so `USER node` costs nothing.",
        "`USER node` goes after the install and copy, because everything after it runs as that user.",
        "Use `COPY --chown=node:node` and pre-create writable directories, or the first runtime write fails with EACCES only in production.",
        "`--read-only` with a `tmpfs` for `/tmp` covers most Node applications. Try it and see what breaks.",
        "`cap_drop: ALL` and `no-new-privileges` each close something specific and cost nothing for a web application.",
        "`ENV` in a Dockerfile puts a secret in the image, in `docker history` and in git history, which outlives the image.",
        "A copied file deleted in a later layer is still in the image, because the layer that added it remains.",
        "`ARG` values are recorded in image metadata, so `--build-arg` is not a private channel either.",
        "A build secret mounted for one `RUN` is the mechanism that actually works, and it needs the syntax directive.",
        "At runtime, an env var is visible in `docker inspect` to anyone with the Docker socket, and to a crash reporter that attaches the environment.",
        "A mounted secret file is readable only by the user that needs it and can be rotated without a restart.",
        "Image scanning finds base-image system vulnerabilities that `npm audit` knows nothing about, which is why you rebuild on a base update.",
      ],
      commonMistakes: [
        "No `USER` line, so the container runs as root, verified on the naive build.",
        "Putting `USER node` before `npm ci`, so the install fails on permissions.",
        "Forgetting `--chown` or a pre-created writable directory, so the first runtime write fails only in production.",
        "Overstating the risk as instant host root, or dismissing it entirely. It is one removed layer of defence.",
        "`ENV SECRET=...` in a Dockerfile, which lands in the image, in `docker history` and in git.",
        "Copying a `.npmrc` and deleting it in a later `RUN`, which leaves the token in an extractable layer.",
        "Passing a token via `--build-arg`, which is recorded in image metadata.",
        "Using `--mount=type=secret` without the syntax directive, which fails with a confusing parse error.",
        "Assuming an env var is private, when the Docker socket exposes every container's environment.",
        "Scanning dependencies only, and never rebuilding when the base image's system packages get a fix.",
      ],
      quiz: [
        {
          question: "What did `docker run --entrypoint id app:naive -un` print, and what does it mean?",
          options: [
            "`node`, which is correct",
            "`root`. Usually not host root, so not an instant compromise, but a removed layer of defence: an arbitrary write now succeeds and an escape becomes more useful.",
            "An error",
            "Nothing, containers have no users",
          ],
          correctIndex: 1,
          explanation:
            "Official Node images ship a `node` user, so `USER node` fixes it in one line, verified on the rebuilt image.",
        },
        {
          question: "Where does `USER node` belong in the Dockerfile?",
          options: [
            "First line",
            "After the install and copy, because everything after it runs as that user and `npm ci` needs to write",
            "It does not matter",
            "Only in the build stage",
          ],
          correctIndex: 1,
          explanation:
            "Also use `--chown` and pre-create any runtime-writable directory, or the first write fails with EACCES in production only.",
        },
        {
          question: "You copy a `.npmrc` with a token, run `npm ci`, then `rm` it in the next `RUN`. Is the token in the image?",
          options: [
            "No, it was deleted",
            "Yes. The layer that added it is still part of the image; the `rm` is a later layer recording a deletion.",
            "Only in the build stage",
            "Only if you push it",
          ],
          correctIndex: 1,
          explanation:
            "A build secret mounted for one `RUN` never becomes a layer, which is the mechanism that actually works.",
        },
        {
          question: "Why is `--build-arg NPM_TOKEN=...` not a safe way to pass a secret?",
          options: [
            "It is safe",
            "`ARG` values are recorded in the image metadata, so `docker inspect` shows them",
            "It is too slow",
            "It only works in multi-stage builds",
          ],
          correctIndex: 1,
          explanation:
            "Along with `ENV` and copy-then-delete, that is the third of the three common ways secrets end up in an image.",
        },
        {
          question: "Why do orchestrators mount secrets as files rather than env vars?",
          options: [
            "Files are faster",
            "An env var is visible in `docker inspect` to anyone with the Docker socket, and to a crash reporter that attaches the environment. A file is readable only by the user that needs it and can be rotated without a restart.",
            "Env vars have a size limit",
            "No real reason",
          ],
          correctIndex: 1,
          explanation:
            "Read `/run/secrets/<name>` with a fallback to the env var, so local development is unchanged and Day 20's startup validation still runs.",
        },
      ],
    },
    {
      id: "signals-and-pid1",
      title: "Signals, PID 1, and the deploy that drops requests",
      durationMinutes: 12,
      explanation:
        "## The measurement first\n\nThe same application, the same graceful shutdown code from Day 22, two different `CMD` lines. Both verified with `docker stop`.\n\n<b>With `CMD [\"node\", \"server.js\"]`:</b>\n\n```text\nnode is PID 1\nreceived SIGTERM, shutting down gracefully\nclosed cleanly\nstop took 0s\n```\n\n<b>With `CMD [\"npm\", \"start\"]`:</b>\n\n```text\nnpm error signal SIGTERM\nnpm error command sh -c node server.js\nstop took 1s\nthe graceful shutdown message never printed\n```\n\n> Read the last line again. The Day 22 code was present and correct in both images, and in the npm version it <b>never ran</b>. Every in-flight request was dropped, and npm exited with an error status on a routine deploy.\n\n---\n\n## Why\n\n<b>PID 1</b> (the first process in a container, which receives the signals sent to it).\n\n> `docker stop` sends `SIGTERM` to PID 1 and nothing else. With `CMD [\"npm\", \"start\"]`, PID 1 is npm, which spawns `sh -c node server.js`, which spawns node. The signal reaches npm and stops there.\n>\n> Confirmed locally without Docker too: sending `SIGTERM` to `npm start` left the `node server.js` child running.\n>\n> So this is not a Docker quirk. It is what a process manager in front of your application does, and it is invisible until a deploy drops requests.\n\n---\n\n## The fix\n\n```dockerfile\nCMD [\"node\", \"server.js\"]\n```\n\n> Exec form, node directly. Then node is PID 1 and gets the signal, which is exactly what Day 22's handler expects.\n\n---\n\n## And the shell form does the same thing\n\n```dockerfile\nCMD node server.js        ✗  runs as sh -c \"node server.js\"\nCMD [\"node\", \"server.js\"] ✓  execs node directly\n```\n\n> The shell form wraps your command in `/bin/sh -c`, so `sh` becomes PID 1 and the same signal problem returns. The brackets are not a style preference.\n\n---\n\n## The one job PID 1 has\n\n> Being PID 1 also means <b>reaping zombies</b>: adopting orphaned child processes and collecting their exit status. Node does not do this.\n>\n> It only matters if your application spawns processes, which Day 10's `child_process` lesson did. If it does, `docker run --init` gives you a tiny init as PID 1 that reaps them and forwards signals. If it does not, node as PID 1 is fine.\n\n---\n\n## The deploy sequence this all serves\n\n> Day 21's readiness probe and Day 22's drain are the same story from the container side. The orchestrator marks the pod not-ready, stops sending new traffic, sends `SIGTERM`, and waits a grace period before `SIGKILL`.\n>\n> That only works if your process receives the signal, stops accepting connections, finishes what it has, and exits <b>within the grace period</b>. Miss any of those and a routine deploy is a small outage.",
      diagram: `⚠⚠ THE MEASUREMENT FIRST

    same app. same Day 22 graceful shutdown code.
    two CMD lines. both verified with docker stop.

    CMD ["node", "server.js"]

      node is PID 1
      received SIGTERM, shutting down gracefully
      closed cleanly
      stop took 0s

    CMD ["npm", "start"]

      npm error signal SIGTERM
      npm error command sh -c node server.js
      stop took 1s
      THE GRACEFUL SHUTDOWN MESSAGE NEVER PRINTED

    read that last line again.

    the Day 22 code was PRESENT AND CORRECT in
    both images, and in the npm version IT NEVER
    RAN.

    → every in-flight request dropped
    → npm exits with an ERROR STATUS on a routine
      deploy


Why

    docker stop sends SIGTERM to PID 1 and NOTHING
    ELSE.

    CMD ["npm", "start"]:

      PID 1   npm
        └─    sh -c node server.js
              └─  node        ← never gets it

    the signal reaches npm and STOPS THERE.

    confirmed locally without Docker: SIGTERM to
    npm start left the node child RUNNING.

    → not a Docker quirk. that is what a process
      manager in front of your app does, and it is
      INVISIBLE until a deploy drops requests.


The fix

    CMD ["node", "server.js"]

    exec form, node directly. node is PID 1 and
    gets the signal, which is what Day 22's
    handler expects.


⚠ And the shell form does the same thing

    CMD node server.js         ✗ runs as
                                 sh -c "node ..."
    CMD ["node", "server.js"]  ✓ execs node

    the shell form wraps you in /bin/sh -c, so sh
    becomes PID 1 and the problem returns.

    the brackets are NOT a style preference.


The one job PID 1 has

    REAPING ZOMBIES: adopting orphaned children
    and collecting their exit status.

    node does NOT do this.

    → only matters if you spawn processes
      (Day 10's child_process)

      if you do:   docker run --init
      if you don't: node as PID 1 is fine


The deploy sequence this serves

    Day 21's readiness + Day 22's drain, from the
    container side:

      1  orchestrator marks pod NOT READY
      2  stops sending NEW traffic
      3  sends SIGTERM
      4  waits a GRACE PERIOD
      5  SIGKILL

    that only works if your process:

      receives the signal
      stops accepting connections
      finishes what it has
      EXITS WITHIN THE GRACE PERIOD

    miss any one, and a routine deploy is a small
    outage.`,
      codeExample: {
        title: "The two CMD lines, measured",
        code: `// ── The application, identical in both images ───────────────
// Day 22's graceful shutdown, unchanged.
import http from "node:http";

const server = http.createServer((req, res) => {
  res.end("ok\\n");
});

server.listen(3000, () => {
  console.log("listening, pid", process.pid);
  //                            ^^^^^^^^^^^ prints 1 when
  //                            node is PID 1
});

let shuttingDown = false;

for (const signal of ["SIGTERM", "SIGINT"]) {
  process.on(signal, () => {
    if (shuttingDown) return;
    shuttingDown = true;
    console.log(\`received \${signal}, shutting down gracefully\`);

    server.close(() => {
      console.log("closed cleanly");
      process.exit(0);
    });

    // Day 22's backstop: if a connection will not close,
    // exit anyway rather than waiting for SIGKILL.
    setTimeout(() => {
      console.log("forcing exit");
      process.exit(1);
    }, 10_000).unref();
  });
}


// ── ✓ CMD ["node", "server.js"] ─────────────────────────────
//   FROM node:24-slim
//   WORKDIR /app
//   COPY . .
//   USER node
//   CMD ["node", "server.js"]
//
// $ docker run -d --name good app:good
// $ docker exec good ps -o pid,comm
//     PID COMMAND
//       1 node                          ← node IS PID 1
//
// $ time docker stop good
//   real  0m0.0s
//
// $ docker logs good
//   listening, pid 1
//   received SIGTERM, shutting down gracefully   ← ✓ VERIFIED
//   closed cleanly                               ← ✓ VERIFIED
//
// The handler ran, the server drained, the process exited 0.


// ── ✗✗ CMD ["npm", "start"] ─────────────────────────────────
//   CMD ["npm", "start"]
//
// $ docker run -d --name bad app:bad
// $ docker exec bad ps -o pid,comm
//     PID COMMAND
//       1 npm                           ← ⚠ npm is PID 1
//      18 sh
//      19 node                          ← your app, 2 levels down
//
// $ time docker stop bad
//   real  0m1.0s
//
// $ docker logs bad
//   > app@1.0.0 start
//   > node server.js
//   listening, pid 19
//   npm error signal SIGTERM                    ← VERIFIED
//   npm error command sh -c node server.js      ← VERIFIED
//   npm error command failed
//
// ⚠⚠ Notice what is NOT in that output:
//
//   "received SIGTERM, shutting down gracefully"
//   "closed cleanly"
//
// The handler never ran. Same code, same image contents, one
// different CMD line.
//
// So on every deploy:
//   - in-flight requests are cut off mid-response
//   - the database connection pool is not closed
//   - Day 24's in-progress job is abandoned rather than
//     released back to the queue
//   - npm reports a failure, so your deploy logs are full of
//     errors from a NORMAL shutdown, which trains you to
//     ignore them


// ── And it is not Docker's fault ────────────────────────────
// Reproduce it locally, no container involved:
//
// $ npm start &
// $ ps -o pid,ppid,comm | grep -E "npm|node"
//   41234  40001 npm
//   41240  41234 node
//
// $ kill -TERM 41234        ← signal npm
// $ ps -p 41240
//   41240 node              ← ⚠ STILL RUNNING
//
// VERIFIED. npm does not forward the signal to its child.
// The container just makes the consequence visible, because
// docker stop only signals PID 1.
//
// The same applies to anything you put in front of node:
// a shell wrapper, a supervisor, an entrypoint script that
// ends in a plain command rather than exec.


// ── ⚠ The shell form has the same problem ───────────────────
//   ✗ CMD node server.js
//
// $ docker exec x ps -o pid,comm
//     PID COMMAND
//       1 sh                            ← sh is PID 1
//       7 node
//
// The shell form is run as /bin/sh -c "node server.js". Some
// shells exec the final command and some do not, so this is
// unreliable rather than reliably broken, which is worse.
//
//   ✓ CMD ["node", "server.js"]
//
// Same for ENTRYPOINT. And if you need an entrypoint script:
//
//   #!/bin/sh
//   set -e
//   run-migrations
//   exec node server.js
//   ^^^^ ⚠ WITHOUT exec, the shell stays as PID 1 and node
//        is its child. With exec, node REPLACES the shell
//        and becomes PID 1.


// ── Zombie reaping, and when to care ────────────────────────
// PID 1 also has to adopt orphaned children and collect
// their exit status. Node does not do that.
//
// If your app spawns processes (Day 10):
import { execFile } from "node:child_process";
execFile("convert", ["in.png", "out.jpg"], () => {});
//
// then over time you can accumulate defunct entries:
//
//   $ docker exec app ps -o pid,stat,comm | grep Z
//     4521 Z    convert <defunct>
//
// ✓ $ docker run --init app:slim
//
//   $ docker exec app ps -o pid,comm
//       1 docker-init         ← reaps, and forwards signals
//       7 node
//
// In compose: init: true. In Kubernetes it is usually not
// needed, since the shared process namespace is off and the
// pod sandbox handles it.
//
// ⚠ If you do not spawn processes, node as PID 1 is fine and
// --init buys you nothing. Do not add it reflexively.


// ── The full deploy sequence, and the grace period ──────────
// What the orchestrator does:
//
//   1. mark the pod NOT READY      (Day 21's readiness probe)
//   2. stop routing new traffic
//   3. SIGTERM to PID 1
//   4. wait terminationGracePeriodSeconds
//   5. SIGKILL
//
// ⚠ Step 4 is the one people get wrong. Kubernetes defaults
// to 30 seconds. If your drain can take 45, you are SIGKILLed
// mid-request every deploy, and the logs will show a clean
// shutdown starting and never finishing.
//
// So the numbers have to line up:
//
//   your Day 22 backstop timeout   10s
//   the grace period               30s
//   → fine
//
//   your longest request           60s
//   the grace period               30s
//   → ⚠ broken, and only under load
//
// ✓ And one detail that catches everyone: add a short delay
//   BEFORE you start draining.
setTimeout(() => server.close(...), 5_000);
//
// The readiness change takes a moment to propagate through
// the load balancer, so requests can still arrive for a
// second or two after the SIGTERM. Closing instantly means
// those get connection-refused. Waiting five seconds first
// means they get served.`,
      },
      keyTakeaways: [
        "Verified with the same Day 22 shutdown code in both images: `CMD [\"node\", \"server.js\"]` logged the graceful shutdown and stopped in 0s.",
        "Verified: `CMD [\"npm\", \"start\"]` logged `npm error signal SIGTERM`, took 1s, and the graceful shutdown message never printed.",
        "So the handler never ran, meaning in-flight requests were dropped and npm exited with an error status on a routine deploy.",
        "`docker stop` sends `SIGTERM` to PID 1 and nothing else, and with npm as PID 1 the signal stops there.",
        "Confirmed without Docker too: `SIGTERM` to `npm start` left the `node server.js` child running.",
        "So it is not a Docker quirk, it is what any process manager in front of your application does.",
        "The shell form `CMD node server.js` runs as `sh -c`, so `sh` becomes PID 1 and the problem returns. The brackets are not style.",
        "In an entrypoint script, `exec node server.js` replaces the shell so node becomes PID 1. Without `exec` it does not.",
        "PID 1 also has to reap zombies, which node does not do. That only matters if you spawn processes.",
        "`docker run --init` gives a tiny init that reaps and forwards signals. Do not add it if you spawn nothing.",
        "The deploy sequence is: mark not ready, stop new traffic, SIGTERM, wait the grace period, SIGKILL.",
        "Your drain must finish inside the grace period, which defaults to 30 seconds in Kubernetes.",
        "A 60-second request against a 30-second grace period is broken, and only under load.",
        "Wait a few seconds before draining, because the readiness change takes time to reach the load balancer.",
      ],
      commonMistakes: [
        "`CMD [\"npm\", \"start\"]`, which was measured to skip the graceful shutdown entirely.",
        "Believing the shutdown code works because it is present and correct. It was, in the image where it never ran.",
        "Using the shell form `CMD node server.js`, which puts `sh` at PID 1.",
        "An entrypoint script ending in a plain command instead of `exec`, which leaves the shell as PID 1.",
        "Ignoring `npm error signal SIGTERM` in deploy logs, which trains you to ignore all shutdown errors.",
        "Adding `--init` reflexively when the application spawns no child processes.",
        "Spawning processes with node as PID 1 and never reaping, accumulating defunct entries.",
        "A drain longer than the grace period, so every deploy ends in SIGKILL mid-request.",
        "Closing the server the instant SIGTERM arrives, so requests still in flight from the load balancer get connection-refused.",
        "No backstop timeout, so one held-open connection keeps the process alive until SIGKILL.",
      ],
      quiz: [
        {
          question: "With the same graceful shutdown code, what did `CMD [\"npm\", \"start\"]` do on `docker stop`?",
          options: [
            "Shut down gracefully in 0s",
            "Logged `npm error signal SIGTERM`, took 1s, and never printed the graceful shutdown message, so the handler never ran",
            "Hung until SIGKILL",
            "Behaved the same as node directly",
          ],
          correctIndex: 1,
          explanation:
            "`docker stop` signals PID 1 only. npm was PID 1 and did not forward it, which was also confirmed locally without Docker.",
        },
        {
          question: "Why is `CMD node server.js` not equivalent to `CMD [\"node\", \"server.js\"]`?",
          options: [
            "They are equivalent",
            "The shell form runs as `/bin/sh -c`, so `sh` becomes PID 1 and the signal problem returns",
            "The shell form is slower",
            "It only affects logging",
          ],
          correctIndex: 1,
          explanation:
            "Some shells exec the final command and some do not, so it is unreliable rather than reliably broken, which is harder to catch.",
        },
        {
          question: "In an entrypoint script that runs migrations then starts the app, why does `exec` matter?",
          options: [
            "It is faster",
            "`exec node server.js` replaces the shell so node becomes PID 1. Without it the shell stays PID 1 and node never gets the signal.",
            "It sets environment variables",
            "It is only a convention",
          ],
          correctIndex: 1,
          explanation:
            "Same mechanism as the npm case: anything sitting in front of node absorbs the signal.",
        },
        {
          question: "When does `--init` actually buy you something?",
          options: [
            "Always",
            "When your application spawns child processes, since PID 1 must reap orphans and node does not. Otherwise it buys nothing.",
            "Only in Kubernetes",
            "Never",
          ],
          correctIndex: 1,
          explanation:
            "It also forwards signals, but node as PID 1 already receives them, so the reaping is the reason.",
        },
        {
          question: "Your longest request takes 60 seconds and the grace period is 30. What happens on deploy?",
          options: [
            "The orchestrator waits",
            "SIGKILL mid-request, every deploy, and only visible under load. The drain has to finish inside the grace period.",
            "The request is retried",
            "Nothing, readiness handles it",
          ],
          correctIndex: 1,
          explanation:
            "The logs show a clean shutdown starting and never finishing, which is easy to misread as fine.",
        },
        {
          question: "Why wait a few seconds before starting to drain?",
          options: [
            "To flush logs",
            "The readiness change takes time to reach the load balancer, so requests can still arrive for a second or two after SIGTERM and would get connection-refused",
            "To let the database catch up",
            "It is not needed",
          ],
          correctIndex: 1,
          explanation:
            "Closing instantly refuses traffic that was already on its way. Waiting first means those requests get served.",
        },
      ],
    },
    {
      id: "compose-and-deploying",
      title: "Compose, health checks and deploying",
      durationMinutes: 12,
      explanation:
        "## Compose\n\n<b>Docker Compose</b> (running several containers together from one file).\n\n> Its real value is not orchestration, it is that a new person clones your repository, runs one command, and has Postgres, Redis and your application on the versions you actually use. That deletes a page of setup instructions and a class of \"works on my machine\".\n\n---\n\n## depends_on is weaker than it looks\n\n> `depends_on` waits for the container to <b>start</b>, not for the service inside it to be <b>ready</b>. Postgres accepts a container start long before it accepts connections, so your application starts, fails to connect, and exits.\n>\n> `condition: service_healthy` with a real `healthcheck` is what you want. And even then, Day 22's retry with backoff still belongs in your application, because a database can go away at any time after startup, not only during it.\n\n---\n\n## Health checks in two places\n\n<b>HEALTHCHECK</b> (a command Docker runs to decide if a container is healthy).\n\n> Day 21's distinction carries over exactly. A <b>liveness</b> check should be cheap and answer \"is this process alive\", and it must not check the database, or a database blip restarts every one of your containers and turns a degradation into an outage.\n>\n> A <b>readiness</b> check answers \"can I serve traffic\", and that one does check dependencies, because the right response to a missing database is to stop receiving requests rather than to die.\n\n---\n\n## Volumes\n\n<b>Volume</b> (storage that outlives the container).\n\n> The thing to internalise: a container's filesystem is <b>gone</b> when it is removed. That is a feature for your application and a disaster for your database, which is why the Postgres data directory needs a named volume.\n>\n> And a bind mount of your source in development gives you file watching inside the container, with the standard trap: mount your source but keep `node_modules` in the container, or your macOS-built native modules get mounted over the Linux ones.\n\n---\n\n## Where the image goes\n\n```text\nbuild → tag → push to a registry → the platform pulls it\n```\n\n> Tag with the commit SHA, not just `latest`. `latest` is not a version, it is a pointer, so \"redeploy latest\" is not a rollback and you cannot tell what is running.\n\n---\n\n## And the honest summary of the day\n\n> The measurements: 1.7GB to 247MB, root to `node`, and a `CMD` line that decided whether graceful shutdown ran at all. The last one is the one that would have dropped requests on every deploy while looking completely fine in the code.",
      diagram: `Compose: what it is actually for

    not orchestration.

    a new person clones the repo, runs ONE
    command, and has Postgres, Redis and your app
    on the versions you actually use.

    → deletes a page of setup instructions and a
      class of "works on my machine"


⚠⚠ depends_on is weaker than it looks

    depends_on waits for the container to START,
    not for the service to be READY.

    Postgres accepts a container start long before
    it accepts CONNECTIONS.

    → your app starts, fails to connect, exits

    ✓ condition: service_healthy, with a real
      healthcheck

    ⚠ and EVEN THEN, Day 22's retry with backoff
      still belongs in your app:

      a database can go away at ANY TIME after
      startup, not only during it


Health checks in two places (Day 21)

    LIVENESS    "is this process alive"

      cheap. and it MUST NOT CHECK THE DATABASE.

      ⚠ if it does, a database blip restarts every
        container and turns a DEGRADATION into an
        OUTAGE

    READINESS   "can I serve traffic"

      this one DOES check dependencies.

      the right response to a missing database is
      to STOP RECEIVING REQUESTS, not to die.


Volumes

    a container's filesystem is GONE when it is
    removed.

      a feature for your app
      a DISASTER for your database

    → the Postgres data directory needs a NAMED
      VOLUME

    ⚠ and the dev bind-mount trap:

      mount your SOURCE, keep node_modules IN THE
      CONTAINER

      or your macOS-built native modules get
      mounted over the Linux ones


Where the image goes

    build → tag → push to a registry
                → the platform pulls it

    ⚠ tag with the COMMIT SHA, not just latest.

      latest is not a version, it is a POINTER.

      → "redeploy latest" is not a rollback, and
        you cannot tell what is running


The honest summary of the day

    1.7GB          →  247 MB
    root           →  node
    CMD ["npm",…]  →  CMD ["node", …]

    the last one decided whether graceful shutdown
    RAN AT ALL, and it would have dropped requests
    on every deploy while looking completely fine
    in the code.`,
      codeExample: {
        title: "A compose file that works, and shipping the image",
        code: `// ── docker-compose.yml ──────────────────────────────────────
//
//   services:
//     api:
//       build: .
//       ports:
//         - "3000:3000"
//       environment:
//         NODE_ENV: development
//         DATABASE_URL: postgres://app:app@db:5432/app
//         #                                ^^ the SERVICE NAME,
//         #  not localhost. Compose gives you DNS between
//         #  services, and "localhost" inside a container means
//         #  that container.
//         REDIS_URL: redis://cache:6379
//       depends_on:
//         db:
//           condition: service_healthy      ← ⚠ not just "db:"
//         cache:
//           condition: service_started
//       volumes:
//         - ./src:/app/src                  ← source, for watching
//         - /app/node_modules               ← ⚠ see below
//       init: true                          ← only if you spawn
//       command: ["node", "--watch", "src/server.js"]
//
//     db:
//       image: postgres:17-alpine
//       environment:
//         POSTGRES_USER: app
//         POSTGRES_PASSWORD: app
//         POSTGRES_DB: app
//       volumes:
//         - pgdata:/var/lib/postgresql/data   ← ⚠ or you lose it
//       healthcheck:
//         test: ["CMD-SHELL", "pg_isready -U app"]
//         interval: 5s
//         timeout: 3s
//         retries: 10
//         start_period: 10s
//
//     cache:
//       image: redis:8-alpine
//       command: ["redis-server", "--maxmemory", "256mb",
//                 "--maxmemory-policy", "allkeys-lru"]
//       #  Day 23: a cache with no eviction policy is a
//       #  memory leak with extra steps.
//
//   volumes:
//     pgdata:


// ── ⚠⚠ Why depends_on alone is not enough ───────────────────
//   ✗ depends_on:
//       - db
//
// That waits for the CONTAINER to start. Postgres starts its
// container in about 100ms and accepts connections a few
// seconds later, so:
//
//   api    | Error: connect ECONNREFUSED 172.18.0.2:5432
//   api exited with code 1
//
// ✓ condition: service_healthy waits for the healthcheck to
//   pass, which is a real readiness signal.
//
// ⚠ And keep Day 22's retry anyway:
async function connectWithRetry(url, attempts = 10) {
  for (let i = 1; i <= attempts; i++) {
    try {
      const pool = new Pool({ connectionString: url });
      await pool.query("SELECT 1");
      return pool;
    } catch (err) {
      if (i === attempts) throw err;
      const delay = Math.min(1000 * 2 ** (i - 1), 10_000);
      log().warn({ attempt: i, delay }, "database not ready, retrying");
      await new Promise((r) => setTimeout(r, delay));
    }
  }
}
// service_healthy solves startup ordering. It does nothing
// for the database restarting at 3am, which is the case that
// actually pages you.


// ── ⚠ The node_modules volume trick ─────────────────────────
//   volumes:
//     - ./src:/app/src
//     - /app/node_modules
//     ^^^^^^^^^^^^^^^^^^ an ANONYMOUS volume
//
// Without the second line, if you mount ./ over /app your
// host's node_modules shadows the container's. Those were
// built on macOS, so:
//
//   Error: \\invalid ELF header
//
// The anonymous volume keeps the container's node_modules in
// place underneath the mount. Mounting only ./src, as above,
// avoids the problem entirely and is the cleaner answer.


// ── HEALTHCHECK, and Day 21's distinction ───────────────────
//   In the Dockerfile:
//
//   HEALTHCHECK --interval=10s --timeout=3s --start-period=20s --retries=3 \\
//     CMD node -e "fetch('http://127.0.0.1:3000/health/live').then(r=>process.exit(r.ok?0:1)).catch(()=>process.exit(1))"
//
// ⚠ Note which endpoint. This is the LIVENESS one:
app.get("/health/live", async () => ({ status: "ok" }));
//   Cheap, no dependencies. It answers "is this process
//   running and able to respond", which is the only question
//   whose right answer is "restart me".

// ✗ The version that causes outages:
app.get("/health/live", async () => {
  await app.db.query("SELECT 1");        // ⚠ NO
  return { status: "ok" };
});
//   Now a 30-second database blip fails the liveness check on
//   every container at once, and Docker or Kubernetes restarts
//   all of them. You have converted a partial degradation into
//   a total outage, and the restarts make the database's
//   recovery harder.

// ✓ Readiness is where dependencies belong:
app.get("/health/ready", async (request, reply) => {
  const checks = { db: false, redis: false };
  try { await app.db.query("SELECT 1"); checks.db = true; } catch {}
  try { await app.redis.ping(); checks.redis = true; } catch {}

  const ready = checks.db;      // Redis degrades, the DB does not
  reply.code(ready ? 200 : 503);
  return { ready, checks };
});
// A failing readiness check means "stop sending me traffic",
// which is recoverable. A failing liveness check means
// "destroy me", which is not.


// ── Shipping it ─────────────────────────────────────────────
// $ SHA=$(git rev-parse --short HEAD)
// $ docker build -t registry.example.com/app:$SHA .
// $ docker tag registry.example.com/app:$SHA registry.example.com/app:latest
// $ docker push registry.example.com/app:$SHA
// $ docker push registry.example.com/app:latest
//
// ⚠ Tag with the SHA. latest is a POINTER, not a version, so:
//
//   ✗ "roll back to latest"     → latest IS the broken one
//   ✗ "what is running?"        → latest, which tells you
//                                 nothing
//   ✓ "roll back to a1b2c3d"    → an actual thing
//
// Multi-platform, since your laptop is probably arm64 and
// your server is probably amd64:
//
// $ docker buildx build --platform linux/amd64,linux/arm64 \\
//     -t registry.example.com/app:$SHA --push .
//
// Without this, an image built on an Apple laptop fails to
// start on an amd64 host with "exec format error", which is
// a confusing message for a simple cause.


// ── The final Dockerfile, with everything from today ────────
//   # syntax=docker/dockerfile:1
//   FROM node:24-slim AS build
//   WORKDIR /app
//   COPY package*.json ./
//   RUN --mount=type=secret,id=npmrc,target=/root/.npmrc npm ci
//   COPY . .
//   RUN npm run build
//
//   FROM node:24-slim
//   WORKDIR /app
//   ENV NODE_ENV=production
//   COPY package*.json ./
//   RUN npm ci --omit=dev && npm cache clean --force
//   COPY --from=build --chown=node:node /app/dist ./dist
//   USER node
//   EXPOSE 3000
//   HEALTHCHECK --interval=10s --timeout=3s --start-period=20s \\
//     CMD node -e "fetch('http://127.0.0.1:3000/health/live').then(r=>process.exit(r.ok?0:1)).catch(()=>process.exit(1))"
//   CMD ["node", "dist/server.js"]
//
// Measured: 364MB, runs as node, node is PID 1, and
// docker stop produced "received SIGTERM, shutting down
// gracefully / closed cleanly" in 0s.
//
// The naive version of the same application: 1.7GB, root,
// npm as PID 1, and the graceful shutdown handler never ran.`,
      },
      keyTakeaways: [
        "Compose's real value is that one command gives a new person Postgres, Redis and your app on the versions you use.",
        "`depends_on` waits for the container to start, not the service to be ready, so Postgres refuses connections and your app exits.",
        "`condition: service_healthy` with a real `healthcheck` fixes startup ordering.",
        "Keep Day 22's retry with backoff anyway, because a database can go away long after startup, which is the case that pages you.",
        "Use the service name, not `localhost`, in connection URLs. Inside a container `localhost` is that container.",
        "A liveness check must not check the database, or one blip restarts every container and turns a degradation into an outage.",
        "A readiness check does check dependencies, because the right response to a missing database is to stop taking traffic.",
        "A container's filesystem is gone when it is removed, so the Postgres data directory needs a named volume.",
        "Mount your source but keep `node_modules` in the container, or macOS-built native modules shadow the Linux ones and you get an invalid ELF header.",
        "Give Redis a `maxmemory` and an eviction policy, since Day 23's cache without one is a leak with extra steps.",
        "Tag images with the commit SHA. `latest` is a pointer, not a version, so it cannot answer \"what is running\" or serve as a rollback target.",
        "Build multi-platform, or an image from an arm64 laptop fails on an amd64 host with \"exec format error\".",
        "The measured day: 1.7GB to 364MB slim or 247MB alpine, root to `node`, and a `CMD` line that decided whether graceful shutdown ran at all.",
      ],
      commonMistakes: [
        "Plain `depends_on`, which waits for container start and lets your app die on ECONNREFUSED.",
        "Relying on `service_healthy` instead of an application-level retry, which leaves you exposed to any later database restart.",
        "Using `localhost` for a service URL inside a container.",
        "A liveness check that queries the database, converting a blip into a mass restart.",
        "A readiness check with no dependency checks, so a broken instance keeps receiving traffic.",
        "No named volume for the database, so removing the container deletes the data.",
        "Bind-mounting the whole project over `/app`, so host `node_modules` shadows the container's.",
        "Redis with no `maxmemory` or eviction policy.",
        "Deploying only `latest`, so you cannot identify or roll back what is running.",
        "Building on an Apple laptop for an amd64 host without buildx, producing \"exec format error\".",
      ],
      quiz: [
        {
          question: "Why is plain `depends_on: [db]` not enough?",
          options: [
            "It is enough",
            "It waits for the container to start, not the service to accept connections, so your app fails on ECONNREFUSED and exits",
            "It only works with images, not builds",
            "It is deprecated",
          ],
          correctIndex: 1,
          explanation:
            "`condition: service_healthy` fixes startup ordering, and an application-level retry is still needed for later restarts.",
        },
        {
          question: "Why must a liveness check not query the database?",
          options: [
            "It is too slow",
            "A database blip would fail liveness on every container at once and restart all of them, converting a degradation into an outage",
            "It needs credentials",
            "It should, that is the point",
          ],
          correctIndex: 1,
          explanation:
            "Dependencies belong in readiness, where the response is to stop taking traffic rather than to be destroyed.",
        },
        {
          question: "You bind-mount your whole project over `/app`. What breaks?",
          options: [
            "Nothing",
            "Your host `node_modules` shadows the container's, so macOS-built native modules produce an invalid ELF header",
            "File watching",
            "The healthcheck",
          ],
          correctIndex: 1,
          explanation:
            "Mount only your source, or add an anonymous volume at `/app/node_modules` to keep the container's copy underneath.",
        },
        {
          question: "Why tag with the commit SHA rather than only `latest`?",
          options: [
            "Registries require it",
            "`latest` is a pointer, not a version, so it cannot tell you what is running and \"redeploy latest\" is not a rollback",
            "It is faster to pull",
            "For caching",
          ],
          correctIndex: 1,
          explanation:
            "Rolling back to `a1b2c3d` is an actual thing. Rolling back to `latest` is redeploying the broken build.",
        },
        {
          question: "What was the single most consequential difference measured today?",
          options: [
            "The image size",
            "The `CMD` line. With npm as PID 1 the graceful shutdown handler never ran, so every deploy dropped in-flight requests while the code looked fine.",
            "The base image choice",
            "The healthcheck interval",
          ],
          correctIndex: 1,
          explanation:
            "Size went 1.7GB to 247MB and root to `node`, both worth doing. Only the CMD line silently broke correctness.",
        },
      ],
    },
  ],
  finalQuiz: [
    {
      question: "Why does the lockfile get copied before the source?",
      options: [
        "npm requires it",
        "A changed layer invalidates every layer after it, so source-first makes every commit reinstall all dependencies",
        "Copying is faster",
        "Security",
      ],
      correctIndex: 1,
      explanation:
        "Source changes every commit and dependencies do not, so the install layer belongs above the source copy.",
    },
    {
      question: "What were the measured Node base image sizes?",
      options: [
        "All around 300MB",
        "`node:24` 1.64GB, `node:24-slim` 351MB, `node:24-alpine` 231MB",
        "alpine was largest",
        "Identical, only tags differ",
      ],
      correctIndex: 1,
      explanation:
        "`node:24` carries a full build toolchain. slim drops it; alpine also swaps glibc for musl.",
    },
    {
      question: "A well-built multi-stage alpine image measured 247MB. What does that say about a 150MB target?",
      options: [
        "The build was wrong",
        "Not reachable with an official Node base, since alpine's base alone is 231MB. Under 150 needs distroless or scratch.",
        "Switch to slim",
        "Drop more dependencies",
      ],
      correctIndex: 1,
      explanation:
        "The real win is 1.7GB to about 250MB, not shaving the last hundred megabytes.",
    },
    {
      question: "Why clean the npm cache in the same `RUN` as the install?",
      options: [
        "npm requires it",
        "A separate `RUN` is a new layer, so the image ships the cache in one layer and its deletion in the next",
        "Speed",
        "Build time",
      ],
      correctIndex: 1,
      explanation:
        "The same reason a secret copied in one layer and deleted in the next remains readable in the image.",
    },
    {
      question: "What is the main risk of alpine?",
      options: [
        "Slower",
        "musl instead of glibc, so a glibc-targeted prebuilt native module will not load and some behaviours differ",
        "No package manager",
        "It cannot run Node",
      ],
      correctIndex: 1,
      explanation:
        "slim is 120MB larger and avoids a class of bug that appears only inside the container.",
    },
    {
      question: "What did `docker run --entrypoint id app:naive -un` print, and what does that mean?",
      options: [
        "`node`, which is correct",
        "`root`. Usually not host root, so not an instant compromise, but one removed layer of defence.",
        "An error",
        "Containers have no users",
      ],
      correctIndex: 1,
      explanation:
        "An arbitrary write that would fail against a read-only app directory now succeeds, and an escape becomes more useful.",
    },
    {
      question: "Where does `USER node` belong?",
      options: [
        "First line",
        "After the install and copy, because everything after it runs as that user and `npm ci` needs to write",
        "It does not matter",
        "Build stage only",
      ],
      correctIndex: 1,
      explanation:
        "Also `--chown` and pre-create runtime-writable directories, or the first write fails with EACCES in production only.",
    },
    {
      question: "You copy a `.npmrc` with a token, install, then `rm` it in the next `RUN`. Is the token in the image?",
      options: [
        "No, it was deleted",
        "Yes. The layer that added it is still part of the image; the `rm` is a later layer recording a deletion.",
        "Only in the build stage",
        "Only if pushed",
      ],
      correctIndex: 1,
      explanation:
        "A build secret mounted for one `RUN` never becomes a layer, which is the mechanism that works.",
    },
    {
      question: "Why is `--build-arg` unsafe for a secret?",
      options: [
        "It is safe",
        "`ARG` values are recorded in image metadata, so `docker inspect` reveals them",
        "Too slow",
        "Multi-stage only",
      ],
      correctIndex: 1,
      explanation:
        "That is the third of the three common routes, alongside `ENV` and copy-then-delete.",
    },
    {
      question: "Why do orchestrators mount secrets as files?",
      options: [
        "Files are faster",
        "An env var is visible in `docker inspect` to anyone with the Docker socket, and to a crash reporter attaching the environment. A file is readable only by the user that needs it and can be rotated without a restart.",
        "Env size limits",
        "No real reason",
      ],
      correctIndex: 1,
      explanation:
        "Read `/run/secrets/<name>` with an env fallback so local development is unchanged and Day 20's startup validation still runs.",
    },
    {
      question: "With the same shutdown code, what did `CMD [\"npm\", \"start\"]` do on `docker stop`?",
      options: [
        "Shut down gracefully in 0s",
        "Logged `npm error signal SIGTERM`, took 1s, and never printed the graceful shutdown message, so the handler never ran",
        "Hung until SIGKILL",
        "Same as node directly",
      ],
      correctIndex: 1,
      explanation:
        "`docker stop` signals PID 1 only. npm was PID 1 and did not forward it, also confirmed locally without Docker.",
    },
    {
      question: "Why is `CMD node server.js` not equivalent to the exec form?",
      options: [
        "They are equivalent",
        "The shell form runs as `/bin/sh -c`, so `sh` becomes PID 1 and the signal problem returns",
        "Slower",
        "Only affects logging",
      ],
      correctIndex: 1,
      explanation:
        "Some shells exec the final command and some do not, making it unreliable rather than reliably broken.",
    },
    {
      question: "In an entrypoint script, why does `exec node server.js` matter?",
      options: [
        "Speed",
        "It replaces the shell so node becomes PID 1. Without `exec`, the shell stays PID 1 and node never gets the signal.",
        "It sets env vars",
        "Convention only",
      ],
      correctIndex: 1,
      explanation:
        "Anything sitting in front of node absorbs the signal, which is the same mechanism as the npm case.",
    },
    {
      question: "When does `--init` buy you something?",
      options: [
        "Always",
        "When your app spawns child processes, because PID 1 must reap orphans and node does not",
        "Kubernetes only",
        "Never",
      ],
      correctIndex: 1,
      explanation:
        "It forwards signals too, but node as PID 1 already receives them, so the reaping is the reason.",
    },
    {
      question: "Your longest request takes 60s and the grace period is 30. What happens on deploy?",
      options: [
        "The orchestrator waits",
        "SIGKILL mid-request every deploy, visible only under load. The drain must finish inside the grace period.",
        "The request retries",
        "Readiness handles it",
      ],
      correctIndex: 1,
      explanation:
        "The logs show a clean shutdown starting and never finishing, which is easy to misread as fine.",
    },
    {
      question: "Why wait a few seconds before draining?",
      options: [
        "To flush logs",
        "The readiness change takes time to reach the load balancer, so requests still arriving would get connection-refused",
        "For the database",
        "Not needed",
      ],
      correctIndex: 1,
      explanation:
        "Closing instantly refuses traffic already on its way. Waiting first means those requests get served.",
    },
    {
      question: "Why is plain `depends_on: [db]` not enough?",
      options: [
        "It is enough",
        "It waits for container start, not for the service to accept connections, so your app fails on ECONNREFUSED and exits",
        "It needs an image",
        "It is deprecated",
      ],
      correctIndex: 1,
      explanation:
        "`condition: service_healthy` fixes ordering, and an application-level retry is still needed for later restarts.",
    },
    {
      question: "Why must a liveness check avoid the database?",
      options: [
        "Too slow",
        "A blip would fail liveness on every container at once and restart all of them, turning a degradation into an outage",
        "It needs credentials",
        "It should check it",
      ],
      correctIndex: 1,
      explanation:
        "Dependencies belong in readiness, where the response is to stop taking traffic rather than to be destroyed.",
    },
    {
      question: "Why tag with the commit SHA rather than only `latest`?",
      options: [
        "Registries require it",
        "`latest` is a pointer, not a version, so it cannot say what is running and \"redeploy latest\" is not a rollback",
        "Faster pulls",
        "Caching",
      ],
      correctIndex: 1,
      explanation:
        "Rolling back to `a1b2c3d` is an actual thing; rolling back to `latest` redeploys the broken build.",
    },
    {
      question: "What was the single most consequential difference measured today?",
      options: [
        "Image size",
        "The `CMD` line. With npm as PID 1 the graceful shutdown handler never ran, so every deploy dropped in-flight requests while the code looked fine.",
        "The base image",
        "The healthcheck interval",
      ],
      correctIndex: 1,
      explanation:
        "1.7GB to 247MB and root to `node` are both worth doing. Only the CMD line silently broke correctness.",
    },
  ],
  project: {
    name: "day-27",
    goal: "Containerise the API properly and prove each claim with a command: the size drop, the user it runs as, and that graceful shutdown actually runs.",
    brief:
      "Build the bad version first, on purpose. You need the 1.7GB root-running image with `CMD [\"npm\", \"start\"]` in front of you, because the last one is the interesting failure: the graceful shutdown code is present and correct and never runs. Measure everything. \"It looks right\" is what the broken image also looks like.",
    steps: [
      "Take the Day 25 application and write `Dockerfile.naive`: `FROM node:24`, `COPY . .`, `RUN npm install`, `CMD [\"npm\", \"start\"]`. No `.dockerignore`.",
      "Build it and record the size from `docker images`.",
      "Run `docker run --rm --entrypoint id <image> -un` and record the user.",
      "Run `docker exec <container> ps -o pid,comm` and record which process is PID 1.",
      "Start it, send a request that takes 10 seconds, and `docker stop` it mid-request. Record the exit time, the logs, and whether your graceful shutdown message appeared.",
      "Write a `.dockerignore` covering `node_modules`, `.git`, `.env*`, `dist`, `coverage` and logs.",
      "Write `Dockerfile.slim`: multi-stage on `node:24-slim`, lockfile copied before the install, `npm ci --omit=dev` with the cache cleaned in the same `RUN`, `--chown=node:node`, `USER node`, and `CMD [\"node\", ...]`.",
      "Build it and record the size. Compute the ratio against the naive image.",
      "Repeat the user and PID 1 checks and record both.",
      "Repeat the mid-request `docker stop` and record the logs. Confirm the graceful shutdown message now appears.",
      "Write `Dockerfile.alpine` as the same multi-stage build on alpine, and record its size.",
      "Note whether any dependency needed build tools on alpine, and what the error looked like if so.",
      "Run `docker history` on your slim image and identify the largest layer.",
      "Deliberately build an image with `ENV SECRET=...`, then find it with `docker history`.",
      "Deliberately copy a token file and `rm` it in a later `RUN`, then extract it from the layer to prove it is still there.",
      "Convert that to `--mount=type=secret` with the syntax directive, and confirm the token is absent from history and metadata.",
      "Add a `HEALTHCHECK` pointing at a liveness endpoint that does not touch the database.",
      "Write a second version pointing at a database-dependent endpoint, stop Postgres, and record what happens to your container.",
      "Write `docker-compose.yml` with your API, Postgres and Redis, using service names in the URLs.",
      "Use plain `depends_on: [db]` first, `docker compose up`, and record whether the API survived.",
      "Change to `condition: service_healthy` with a `pg_isready` healthcheck and confirm it now starts.",
      "Restart only Postgres while the stack is running, and record whether your app recovered.",
      "Add the Day 22 retry with backoff if it did not, and repeat the test.",
      "Add a named volume for Postgres. Write data, `docker compose down`, `up` again, and confirm the data survived.",
      "Remove the volume, repeat, and confirm the data is gone.",
      "Bind-mount your whole project over `/app` and record the error. Then fix it by mounting only `src`.",
      "Add `read_only: true` with a `tmpfs` for `/tmp`, run your tests against the container, and record anything that broke.",
      "Add `cap_drop: ALL` and `no-new-privileges` and confirm the app still works.",
      "Spawn a child process from a route, hit it 50 times, and check `ps` for defunct entries. Add `init: true` and repeat.",
      "Tag with the short commit SHA and push to a registry, then pull by SHA on a different machine or under a different tag and run it.",
      "Run `docker scout cves` or `trivy image` on your slim image, and note how many findings come from the base image rather than your dependencies.",
      "Write the report as a table: naive against slim against alpine, on size, user, PID 1, stop time, and whether graceful shutdown ran.",
    ],
    acceptance: [
      "You have naive, slim and alpine sizes recorded from `docker images`, with the ratio computed.",
      "You have `id -un` output for the naive and the fixed image, showing root and node.",
      "You have `ps` output showing npm as PID 1 in one image and node as PID 1 in the other.",
      "You have the logs from both mid-request stops, and can point at where the graceful shutdown message is missing.",
      "You can state the stop time for each and explain the difference.",
      "`docker history` shows your largest layer, and you can say what it is.",
      "You found the `ENV` secret with `docker history` and extracted the copy-then-deleted token from a layer.",
      "The build-secret version has the token in neither history nor metadata.",
      "You recorded what happened to your container when the database went away with a database-dependent liveness check.",
      "Plain `depends_on` failed and `service_healthy` succeeded, with both outcomes recorded.",
      "Restarting Postgres mid-run either recovered or you added the retry and it then recovered.",
      "Data survived a `down` and `up` with the named volume and was lost without it.",
      "You have the exact error from bind-mounting over `node_modules`.",
      "The container runs read-only with a `tmpfs`, with dropped capabilities and no-new-privileges.",
      "You have `ps` output showing defunct entries without `init` and none with it, or you can explain why it did not reproduce.",
      "An image tagged by SHA was pushed, pulled and run.",
      "You can say how many scan findings came from the base image rather than your own dependencies.",
      "The final table covers size, user, PID 1, stop time and graceful shutdown for all three images.",
      "`npx tsc --noEmit` passes if you used TypeScript, and your tests pass inside the container.",
    ],
    stretch: [
      "Build a distroless or scratch image with a bundled application and see how far under 247MB you can get, then list what you gave up.",
      "Build multi-platform with buildx and confirm the arm64 image runs on an arm64 host and the amd64 one does not.",
      "Add a GitHub Actions workflow that builds, scans, tags by SHA and pushes, failing on a high-severity finding.",
      "Measure cold start time for each of the three images and see whether size predicts it.",
      "Add layer caching in CI and measure the build time difference across three commits that touch only source.",
      "Run the whole stack with a 5-second grace period and find the shortest drain your application can achieve.",
      "Add a readiness endpoint that reports per-dependency status and wire it to a compose healthcheck for a dependent service.",
      "Run two API replicas behind a load balancer in compose and perform a rolling restart with zero dropped requests, proving it with a load generator running throughout.",
      "Write a test that fails if the Dockerfile lacks a `USER` line or uses the shell form of `CMD`.",
      "Compare `node:24-slim` with a Debian base you install Node onto yourself, on size and on scan findings.",
    ],
  },
};
