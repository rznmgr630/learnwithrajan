import type { RoadmapDayDetail } from "../challenge-data";

export const DAY_16_DETAIL = {
  overview: [
    "Containers bundle your application with its exact runtime dependencies into one portable, reproducible unit. Unlike virtual machines, containers share the host kernel — they achieve isolation through Linux namespaces and resource limits through cgroups. The result is near-native performance with startup times measured in milliseconds.",
    "Today you will learn how Docker images are built layer by layer, how to run and network containers, and the production practices that make the difference between a demo container and a secure, production-ready one. You will write a multi-stage Dockerfile and a Docker Compose stack for a Node.js app backed by PostgreSQL.",
  ],
  sections: [
    {
      title: "Watch",
      blocks: [
        { type: "youtube", videoId: "pg19Z8LL06w", title: "Docker Crash Course for Absolute Beginners" },
      ],
    },
    {
      title: "Containers vs VMs",
      blocks: [
        {
          type: "paragraph",
          text: "A virtual machine runs a full operating system — its own kernel, drivers, and everything — on top of a hypervisor. A container runs as a process on the host kernel, isolated using Linux namespaces. Each container gets its own view of the filesystem, network stack, process tree, and hostname. cgroups limit how much CPU and memory the container can use. Since containers share the host kernel, there is nothing to boot — they start in milliseconds and use megabytes instead of gigabytes.",
        },
        {
          type: "table",
          headers: ["Dimension", "Container", "Virtual Machine"],
          rows: [
            [
              "Startup time",
              "Milliseconds — process start only",
              "Seconds to minutes — full OS boot sequence",
            ],
            [
              "Image size",
              "Megabytes (base image + app layers)",
              "Gigabytes (full OS disk image)",
            ],
            [
              "Isolation",
              "Process-level via namespaces — host kernel is shared",
              "Full hardware-level isolation — separate kernel per VM",
            ],
            [
              "Kernel sharing",
              "Yes — all containers share the host kernel",
              "No — each VM runs its own kernel",
            ],
            [
              "Security boundary",
              "Weaker — a kernel exploit can escape the namespace",
              "Stronger — hypervisor separates guest from host",
            ],
            [
              "Density",
              "Hundreds of containers on a single host",
              "Tens of VMs on a single host",
            ],
            [
              "Use cases",
              "Microservices, CI jobs, dev environments, serverless functions",
              "Workloads requiring strong isolation, different OS, or kernel version",
            ],
          ],
        },
      ],
    },
    {
      title: "Images and layers",
      blocks: [
        {
          type: "diagram",
          id: "devops-docker-layers",
        },
        {
          type: "paragraph",
          text: "A Docker image is a stack of read-only layers. Each Dockerfile instruction that changes the filesystem creates a new layer. Docker caches each layer by its content — if nothing changed in that instruction or any instruction before it, the cached layer is reused. This is why instruction order matters: put things that change rarely (like installing dependencies) before things that change often (like copying your source code). At runtime, Docker adds a thin writable layer on top for the running container.",
        },
        {
          type: "table",
          headers: ["Instruction", "Purpose", "Cache behaviour"],
          rows: [
            ["FROM", "Set the base image for subsequent instructions", "Cache busted if the base image digest changes"],
            ["RUN", "Execute a shell command and commit the result as a new layer", "Cache busted if the command string or any preceding layer changes"],
            ["COPY", "Copy files from build context into the image", "Cache busted if file content or permissions change — use before RUN when files drive installs"],
            ["ADD", "Like COPY but also extracts tar archives and fetches URLs", "Prefer COPY — ADD's implicit URL fetch and tar extraction is surprising and hard to cache"],
            ["ENV", "Set environment variables available at build time and runtime", "Invalidates cache for all subsequent layers if the value changes"],
            ["ARG", "Build-time variable, not present in final image", "Cache busted if the --build-arg value changes"],
            ["EXPOSE", "Document which port the container listens on", "Metadata only — does not publish the port; use -p on docker run"],
            ["CMD", "Default command run when container starts — overridable at runtime", "Metadata only — no layer created"],
            ["ENTRYPOINT", "Executable that always runs — CMD becomes its default arguments", "Metadata only — no layer created"],
            ["USER", "Switch to a non-root user for subsequent instructions and the final container", "No layer; changes execution context"],
            ["HEALTHCHECK", "Define a command Docker runs to determine container health", "Metadata only"],
          ],
        },
        {
          type: "code",
          title: "Production multi-stage Dockerfile for a Node.js app",
          code: `# syntax=docker/dockerfile:1

# ── Stage 1: dependency install ──────────────────────────────────────────────
# Use an exact digest or pinned minor version, never :latest
FROM node:20.15.0-alpine3.20 AS deps

WORKDIR /app

# Copy only package manifests first — maximises layer cache
# npm ci only runs when package-lock.json changes
COPY package.json package-lock.json ./
RUN npm ci --omit=dev

# ── Stage 2: build ───────────────────────────────────────────────────────────
FROM node:20.15.0-alpine3.20 AS build

WORKDIR /app

# Install all deps (including devDependencies) for the build
COPY package.json package-lock.json ./
RUN npm ci

COPY tsconfig.json ./
COPY src/ ./src/
RUN npm run build   # emits compiled JS to /app/dist

# ── Stage 3: production runtime ──────────────────────────────────────────────
FROM node:20.15.0-alpine3.20 AS runtime

# Principle of least privilege: create a non-root user
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

WORKDIR /app

# Copy only production artefacts from earlier stages
COPY --from=deps  /app/node_modules ./node_modules
COPY --from=build /app/dist         ./dist

# Mark filesystem read-only where possible — writable dirs as explicit exceptions
VOLUME ["/tmp"]

# Switch to non-root before the final CMD
USER appuser

EXPOSE 3000

# HEALTHCHECK lets Docker (and orchestrators) know when the app is ready
HEALTHCHECK --interval=30s --timeout=5s --start-period=15s --retries=3 \\
  CMD wget -qO- http://localhost:3000/health || exit 1

# Use exec form (JSON array) — avoids spawning a shell, receives signals directly
CMD ["node", "dist/server.js"]`,
        },
      ],
    },
    {
      title: "Running and networking containers",
      blocks: [
        {
          type: "paragraph",
          text: "Containers on the same Docker network can talk to each other using their service names as hostnames — Docker's built-in DNS resolves those names to container IPs. Port publishing (-p) maps a port on your host to a port inside the container. Volumes (-v) mount directories into the container for data that needs to survive restarts. Environment variables (-e) inject configuration at runtime without hardcoding it into the image.",
        },
        {
          type: "code",
          title: "docker build and docker run with common flags",
          code: `# Build the image, tag it, pass a build argument
docker build \\
  --tag myapp:1.0.0 \\
  --build-arg NODE_ENV=production \\
  --file Dockerfile \\
  .

# Run a container in detached mode with all common options
docker run \\
  --detach \\                          # run in background
  --name myapp \\                      # assign a stable name
  --publish 8080:3000 \\               # host:container port mapping
  --volume /data/uploads:/app/uploads \\ # bind mount for persistent uploads
  --env-file .env.production \\        # load env vars from file
  --env NODE_ENV=production \\         # individual env var
  --network myapp-network \\           # attach to a named network
  --restart unless-stopped \\          # restart policy
  --memory 512m \\                     # hard memory limit
  --cpus 1.5 \\                        # CPU quota (1.5 cores)
  --read-only \\                       # read-only root filesystem
  --tmpfs /tmp \\                      # writable tmpfs for /tmp
  --rm \\                              # (remove this OR --restart, not both)
  myapp:1.0.0

# Execute a command in a running container for debugging
docker exec -it myapp sh

# Follow logs from a running container
docker logs -f myapp

# Inspect container networking and IP address
docker inspect myapp | jq '.[0].NetworkSettings.Networks'`,
        },
        {
          type: "table",
          headers: ["Flag", "Short form", "What it does"],
          rows: [
            ["--detach", "-d", "Run container in background; print container ID"],
            ["--publish", "-p", "Publish a container port to the host: -p 8080:3000"],
            ["--volume", "-v", "Bind mount or named volume: -v /host/path:/container/path or -v myvolume:/data"],
            ["--env", "-e", "Set a single environment variable: -e DB_HOST=postgres"],
            ["--env-file", "", "Load environment variables from a file — one KEY=VALUE per line"],
            ["--name", "", "Assign a human-readable name to the container"],
            ["--network", "", "Connect to a named Docker network; containers on the same network resolve each other by name"],
            ["--rm", "", "Automatically remove the container when it exits — useful for one-off tasks and CI"],
            ["--restart", "", "Restart policy: no | always | on-failure | unless-stopped"],
            ["--read-only", "", "Mount root filesystem as read-only — forces explicit tmpfs/volume for any writes"],
            ["--memory", "-m", "Hard memory limit: -m 512m. Container is OOM-killed if exceeded"],
            ["--cpus", "", "CPU quota in cores: --cpus 1.5 limits to 1.5 CPU cores"],
          ],
        },
        {
          type: "code",
          title: "Docker Compose for Node.js + PostgreSQL",
          code: `# docker-compose.yml
version: "3.9"

services:
  app:
    build:
      context: .
      dockerfile: Dockerfile
      target: runtime          # use the final stage from the multi-stage build
    image: myapp:latest
    container_name: myapp
    restart: unless-stopped
    ports:
      - "3000:3000"
    environment:
      NODE_ENV: production
      DATABASE_URL: postgres://appuser:secret@postgres:5432/myapp
    env_file:
      - .env.production        # additional secrets
    depends_on:
      postgres:
        condition: service_healthy  # wait until postgres passes its healthcheck
    networks:
      - backend
    volumes:
      - uploads:/app/uploads
    deploy:
      resources:
        limits:
          memory: 512m
          cpus: "1.5"

  postgres:
    image: postgres:16.3-alpine
    container_name: myapp-postgres
    restart: unless-stopped
    environment:
      POSTGRES_USER: appuser
      POSTGRES_PASSWORD: secret
      POSTGRES_DB: myapp
    volumes:
      - pgdata:/var/lib/postgresql/data   # named volume — survives container restarts
    networks:
      - backend
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U appuser -d myapp"]
      interval: 10s
      timeout: 5s
      retries: 5
      start_period: 30s

volumes:
  pgdata:       # managed by Docker — persists across container restarts
  uploads:

networks:
  backend:
    driver: bridge   # default; containers on this network resolve each other by service name`,
        },
      ],
    },
    {
      title: "Container best practices",
      blocks: [
        {
          type: "table",
          headers: ["Practice", "Why it matters"],
          rows: [
            [
              "Run as a non-root user",
              "A process running as root inside a container is root on the host if it escapes the namespace. Non-root limits the blast radius of a container escape.",
            ],
            [
              "Use a .dockerignore file",
              "Prevents sending node_modules, .git, .env, and build artefacts to the Docker build context. Smaller context means faster builds and no accidental secret leaks.",
            ],
            [
              "Multi-stage builds",
              "Strip build tools, devDependencies, and intermediate artefacts from the production image. Only the compiled output and runtime dependencies reach production — smaller image, smaller attack surface.",
            ],
            [
              "Pin base image versions",
              "FROM node:20.15.0-alpine3.20 is reproducible. FROM node:latest or FROM node:20 can change silently, breaking your build or introducing vulnerabilities.",
            ],
            [
              "Add HEALTHCHECK",
              "Allows Docker (and Kubernetes) to distinguish a running container from a healthy one. Orchestrators use health status to decide when to route traffic and when to restart.",
            ],
            [
              "Read-only root filesystem",
              "Mount the container filesystem as read-only (--read-only). Any attempt by a compromised process to write a backdoor or modify binaries fails immediately. Use --tmpfs or named volumes for legitimate writable paths.",
            ],
            [
              "One process per container",
              "Containers should run a single main process so PID 1 maps directly to your application. Multiple processes require a process supervisor (tini, s6) which adds complexity without benefit over separate services.",
            ],
            [
              "Use exec form CMD / ENTRYPOINT",
              'CMD ["node", "dist/server.js"] (exec form) replaces the shell as PID 1 so signals like SIGTERM reach your process directly. CMD node dist/server.js (shell form) spawns a shell as PID 1 that does not forward signals.',
            ],
          ],
        },
      ],
    },
  ],
  faq: [
    {
      question: "What is the difference between CMD and ENTRYPOINT?",
      answer: 'ENTRYPOINT sets the executable that always runs when the container starts. CMD provides its default arguments. When both are set, Docker runs ENTRYPOINT with CMD as arguments. At runtime, you can override CMD by appending to docker run, but overriding ENTRYPOINT requires the --entrypoint flag.\n\nA common pattern: ENTRYPOINT ["node"] and CMD ["dist/server.js"]. Running docker run myapp dist/worker.js overrides only CMD — node stays as the entrypoint. For a single-purpose container with no argument variation, CMD alone is simpler.',
    },
    {
      question: "Why use multi-stage builds?",
      answer: "Multi-stage builds solve the tension between build-time dependencies and production security. Compiling TypeScript needs the TypeScript compiler, ts-node, and all dev dependencies — none of which should be in a production image.\n\nWith multi-stage builds, an early stage installs everything and runs the build. The final stage starts from a clean base image and copies only the compiled output and production dependencies. Build tools never enter the final image — the result might be 300 MB instead of 800 MB, with a much smaller attack surface. Every package not in the image is one less vulnerability that can be exploited.",
    },
    {
      question: "What is the difference between docker stop and docker kill?",
      answer: "docker stop sends SIGTERM to the container's PID 1 and waits up to the timeout (10 seconds by default) for the process to exit gracefully. If it is still running after the timeout, Docker sends SIGKILL. This gives your app time to finish in-flight requests, close database connections, and flush buffers.\n\ndocker kill sends SIGKILL immediately by default (or a specified signal with --signal). The process gets no chance to clean up. Use docker kill only when docker stop has hung and you need to force termination, or when sending a specific signal like SIGHUP to trigger a config reload.",
    },
    {
      question: "How do containers communicate with each other?",
      answer: "Containers on the same Docker network communicate using their container name or service name as a hostname — Docker's embedded DNS resolves these to container IP addresses. This is why in a Docker Compose file you can set DATABASE_URL to postgres://postgres:5432/myapp and the app container resolves 'postgres' to the right IP.\n\nContainers on different networks cannot reach each other by default — you must connect them to a shared network. For external access, you publish ports with -p, which maps a host port to a container port through NAT rules. Container-to-container traffic on the same network stays inside Docker's bridge and never touches the host network stack.",
    },
  ],
} satisfies RoadmapDayDetail;
