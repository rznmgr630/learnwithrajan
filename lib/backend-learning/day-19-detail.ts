import type { RoadmapDayDetail } from "../challenge-data";

export const DAY_19_DETAIL = {
  overview: [
    "Kubernetes is the standard platform for running containers in production. Think of it as a distributed operating system: it schedules your containers across a pool of machines, keeps actual state matching desired state, and recovers from failures automatically without you doing anything.",
    "Today you will learn how the control plane and worker nodes work together, which workload object to use for each type of job, how cluster networking and DNS work, and how ConfigMaps, Secrets, and namespaces keep configuration organized.",
  ],
  sections: [
    {
      title: "Watch",
      blocks: [
        { type: "youtube", videoId: "s_o8dwzRlu4", title: "Kubernetes Crash Course for Absolute Beginners" },
      ],
    },
    {
      title: "Kubernetes architecture",
      blocks: [
        { type: "diagram", id: "devops-k8s-cluster" },
        {
          type: "paragraph",
          text: "A Kubernetes cluster has two parts: the control plane (which makes decisions) and the worker nodes (which run your actual workloads). The control plane figures out where Pods should run and keeps everything in the desired state. Worker nodes run the Pods. All communication goes through the API server — nothing talks directly to etcd except the API server itself.",
        },
        {
          type: "table",
          headers: ["Plane", "Component", "Role"],
          rows: [
            ["Control plane", "API server (kube-apiserver)", "The single gateway for all cluster state reads and writes. Every kubectl command, controller, and scheduler goes through it. Validates objects, enforces RBAC, and persists to etcd."],
            ["Control plane", "etcd", "Distributed key-value store that holds all cluster state. It is the source of truth. Losing etcd without a backup means losing the cluster."],
            ["Control plane", "Scheduler (kube-scheduler)", "Watches for Pods with no assigned node, scores available nodes against resource requests, affinity rules, and taints, then binds the Pod to the best candidate."],
            ["Control plane", "Controller manager (kube-controller-manager)", "Runs a collection of reconciliation loops: Deployment controller, ReplicaSet controller, Node controller, Job controller, etc. Each loop watches desired state vs actual state and drives toward convergence."],
            ["Worker", "kubelet", "Agent running on every node. Watches the API server for Pods assigned to its node, pulls images, starts containers via the container runtime, and reports back health status."],
            ["Worker", "kube-proxy", "Maintains iptables / IPVS rules on each node to implement Service virtual IPs. Traffic sent to a ClusterIP is NAT-ed to a real Pod IP."],
            ["Worker", "Container runtime", "The software that actually runs containers (containerd, CRI-O). The kubelet talks to it via CRI (Container Runtime Interface)."],
          ],
        },
      ],
    },
    {
      title: "Core workload objects",
      blocks: [
        {
          type: "paragraph",
          text: "Kubernetes gives you several different objects for running workloads. The most common mistake is using a Deployment for everything — pick the one that matches what you actually need.",
        },
        {
          type: "table",
          headers: ["Object", "Purpose", "When to use"],
          rows: [
            ["Pod", "The smallest schedulable unit — one or more tightly coupled containers that share a network namespace and storage volumes.", "Never create raw Pods in production; they are not rescheduled if the node dies. Use a higher-level controller instead."],
            ["ReplicaSet", "Ensures N identical Pod replicas are running at all times. Replaces dead Pods.", "Rarely used directly — Deployment manages ReplicaSets for you. Use directly only for very custom rollout logic."],
            ["Deployment", "Manages a ReplicaSet plus rolling-update and rollback logic. Declarative versioning of your Pod template.", "Stateless apps: web servers, API services, workers that do not need stable network identity or persistent local storage."],
            ["StatefulSet", "Like Deployment but gives each Pod a stable network identity (pod-0, pod-1) and an ordered start/stop sequence. PersistentVolumeClaims are per-Pod and survive rescheduling.", "Databases, Kafka brokers, Elasticsearch nodes, Zookeeper — anything that needs stable identity or ordered initialisation."],
            ["DaemonSet", "Runs exactly one Pod on every (or selected) node.", "Node-level agents: log shippers (Fluentd), monitoring exporters (Prometheus node-exporter), network plugins."],
            ["Job", "Runs one or more Pods to completion. Restarts failed Pods until the desired completion count is reached.", "Batch processing, database migrations, one-off data transforms."],
            ["CronJob", "Creates Jobs on a cron schedule.", "Nightly reports, scheduled cleanup tasks, periodic syncs."],
          ],
        },
        {
          type: "code",
          title: "Deployment YAML — Node.js API with resource limits, liveness & readiness probes",
          code: `apiVersion: apps/v1
kind: Deployment
metadata:
  name: node-api
  namespace: production
  labels:
    app: node-api
spec:
  replicas: 3
  selector:
    matchLabels:
      app: node-api
  strategy:
    type: RollingUpdate
    rollingUpdate:
      maxSurge: 1        # allow 1 extra Pod during update
      maxUnavailable: 0  # never drop below 3 healthy Pods
  template:
    metadata:
      labels:
        app: node-api
    spec:
      containers:
        - name: node-api
          image: registry.example.com/node-api:1.4.2
          ports:
            - containerPort: 3000
          env:
            - name: NODE_ENV
              value: production
            - name: PORT
              value: "3000"
          resources:
            requests:
              cpu: "100m"    # 0.1 core — what the scheduler uses for bin-packing
              memory: "128Mi"
            limits:
              cpu: "500m"    # 0.5 core — hard cap; CPU is throttled, not killed
              memory: "256Mi" # hard cap — OOMKilled if exceeded
          livenessProbe:
            # Is the container alive? Failure → restart the container.
            httpGet:
              path: /healthz
              port: 3000
            initialDelaySeconds: 10
            periodSeconds: 10
            failureThreshold: 3
          readinessProbe:
            # Is the container ready to receive traffic? Failure → remove from Service endpoints.
            httpGet:
              path: /ready
              port: 3000
            initialDelaySeconds: 5
            periodSeconds: 5
            failureThreshold: 2`,
        },
      ],
    },
    {
      title: "Services & networking",
      blocks: [
        {
          type: "paragraph",
          text: "Pod IPs change every time a Pod restarts. A Service gives you a stable IP and DNS name that always routes to the right Pods, no matter how many times they have restarted or been replaced. kube-proxy on each node maintains the rules that translate the Service's virtual IP to actual Pod IPs.",
        },
        {
          type: "table",
          headers: ["Service type", "Accessible from", "When to use"],
          rows: [
            ["ClusterIP (default)", "Inside the cluster only", "Internal microservice-to-microservice communication. 99% of your Services should be ClusterIP."],
            ["NodePort", "Any node's IP at a static port (30000–32767)", "Quick local testing or exposing a service where you manage your own load balancer. Not production-grade on its own."],
            ["LoadBalancer", "External cloud load balancer (AWS ELB, GCP LB, etc.) provisioned automatically", "Production ingress for a single service when you do not need host/path routing. Each Service gets its own cloud LB — expensive at scale."],
            ["ExternalName", "Returns a CNAME to an external DNS name — no proxying", "Giving in-cluster DNS aliases to external services (RDS hostname, third-party API) so Pods do not hard-code external hostnames."],
          ],
        },
        {
          type: "code",
          title: "ClusterIP Service + Ingress with host-based routing",
          code: `# ── Service ─────────────────────────────────────────────────────────────────
apiVersion: v1
kind: Service
metadata:
  name: node-api
  namespace: production
spec:
  type: ClusterIP          # default — only reachable inside the cluster
  selector:
    app: node-api          # selects Pods with this label
  ports:
    - port: 80             # port the Service listens on
      targetPort: 3000     # port on the container

---
# ── Ingress ──────────────────────────────────────────────────────────────────
# Requires an Ingress controller (nginx-ingress, Traefik, AWS ALB controller).
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: api-ingress
  namespace: production
  annotations:
    nginx.ingress.kubernetes.io/rewrite-target: /
    cert-manager.io/cluster-issuer: letsencrypt-prod
spec:
  ingressClassName: nginx
  tls:
    - hosts:
        - api.example.com
      secretName: api-tls
  rules:
    - host: api.example.com
      http:
        paths:
          - path: /v1
            pathType: Prefix
            backend:
              service:
                name: node-api
                port:
                  number: 80
    - host: admin.example.com
      http:
        paths:
          - path: /
            pathType: Prefix
            backend:
              service:
                name: admin-ui
                port:
                  number: 80`,
        },
        {
          type: "paragraph",
          text: "Kubernetes runs CoreDNS inside the cluster. Every Service gets a DNS name automatically in the format: service.namespace.svc.cluster.local. Within the same namespace you can just use the service name (http://node-api). For cross-namespace calls, use the namespace-qualified form (http://node-api.production). Never hard-code Pod IPs — they change constantly.",
        },
      ],
    },
    {
      title: "ConfigMaps, Secrets & namespaces",
      blocks: [
        {
          type: "paragraph",
          text: "ConfigMaps store non-sensitive configuration — feature flags, log levels, URLs. Secrets store sensitive data — passwords, API keys, TLS certificates. Important: Secrets are only base64-encoded by default, not encrypted. Enable Secrets encryption at rest in the API server config and use RBAC to limit who can read them. Both can be injected as environment variables or mounted as files inside your containers.",
        },
        {
          type: "code",
          title: "ConfigMap + Secret — creation and mounting",
          code: `# ── ConfigMap ────────────────────────────────────────────────────────────────
apiVersion: v1
kind: ConfigMap
metadata:
  name: node-api-config
  namespace: production
data:
  LOG_LEVEL: "info"
  CACHE_TTL_SECONDS: "300"
  FEATURE_DARK_MODE: "true"

---
# ── Secret ───────────────────────────────────────────────────────────────────
apiVersion: v1
kind: Secret
metadata:
  name: node-api-secrets
  namespace: production
type: Opaque
data:
  # Values must be base64-encoded: echo -n 'value' | base64
  DATABASE_URL: cG9zdGdyZXM6Ly91c2VyOnBhc3NAcmRzOjU0MzIvYXBp
  JWT_SECRET: c3VwZXJzZWNyZXRrZXkxMjM=

---
# ── Pod template — env vars from ConfigMap + Secret ──────────────────────────
spec:
  containers:
    - name: node-api
      image: registry.example.com/node-api:1.4.2
      envFrom:
        - configMapRef:
            name: node-api-config      # all keys become env vars
        - secretRef:
            name: node-api-secrets     # all keys become env vars (masked in logs)
      # Or mount as files in a volume:
      volumeMounts:
        - name: config-volume
          mountPath: /etc/config       # /etc/config/LOG_LEVEL, etc.
          readOnly: true
        - name: secrets-volume
          mountPath: /etc/secrets      # /etc/secrets/DATABASE_URL, etc.
          readOnly: true
  volumes:
    - name: config-volume
      configMap:
        name: node-api-config
    - name: secrets-volume
      secret:
        secretName: node-api-secrets`,
        },
        {
          type: "table",
          headers: ["Attribute", "ConfigMap", "Secret"],
          rows: [
            ["Encoding", "Plain text stored in etcd", "base64-encoded in etcd (not encrypted by default — enable EncryptionConfiguration)"],
            ["Typical use case", "App config: log levels, feature flags, timeouts, non-sensitive URLs", "Passwords, API keys, OAuth tokens, TLS private keys"],
            ["Rotation", "Update ConfigMap + rollout restart (or watch file mount)", "Update Secret + rollout restart, or use an external secret operator (External Secrets, Vault Agent) for automatic sync"],
            ["RBAC", "Readable by any Pod in the namespace by default — restrict with RBAC", "Same default, but Secret access should be tightly restricted with RBAC get/list/watch rules"],
          ],
        },
        {
          type: "paragraph",
          text: "Namespaces let you divide a cluster into separate zones. Two Deployments named 'api' can coexist in different namespaces without conflict. You can apply resource quotas to limit how much CPU or memory a namespace can use, and scope RBAC rules to a specific team or environment. Without network policies, every Pod in the cluster can reach every other Pod — use network policies to restrict which namespaces can communicate with each other.",
        },
      ],
    },
  ],
  faq: [
    {
      question: "What is the difference between a Pod and a Deployment?",
      answer: "A Pod is the smallest schedulable unit — one or more containers that share a network and storage context. If a Pod's node dies, the Pod is gone and Kubernetes does not reschedule it on its own. A Deployment is a controller that declares 'I want 3 replicas of this Pod template running at all times' and continuously makes that true. When a Pod dies, the Deployment controller creates a replacement. In practice, always use a Deployment (or StatefulSet, DaemonSet, Job) instead of a bare Pod.",
    },
    {
      question: "Why does Kubernetes need etcd?",
      answer: "etcd is the single source of truth for all cluster state: what Deployments exist, which Pods are scheduled where, what Services look like, every Secret and ConfigMap. The API server is the only component that reads and writes to etcd directly. If etcd is lost without a backup, the cluster's entire desired state is gone — you would need to recreate every object from scratch. Always run etcd as a three or five node cluster (requiring a quorum majority to elect a leader) and back it up regularly.",
    },
    {
      question: "What happens when a node goes down?",
      answer: "The Node controller detects that the node stopped sending heartbeats to the API server. After a grace period (around 5 minutes by default), it marks the node NotReady and evicts the Pods. The Deployment controller then sees the replica count dropped and schedules replacement Pods on healthy nodes. StatefulSet Pods are rescheduled with their stable identity (pod-0 stays pod-0) and get their PersistentVolumeClaims reattached. DaemonSet Pods on the failed node are just gone — the DaemonSet does not create extra Pods on other nodes.",
    },
    {
      question: "What is the difference between liveness and readiness probes?",
      answer: "A liveness probe answers 'Is this container still alive?' — if it fails repeatedly, Kubernetes restarts the container. Use it to detect deadlocks or unrecoverable crashes. A readiness probe answers 'Is this container ready to serve traffic right now?' — if it fails, Kubernetes removes the Pod from the Service's endpoint list so no new requests go to it, but the container is not restarted. During a rolling update, new Pods must pass readiness before old ones are removed, ensuring no traffic is dropped.",
    },
    {
      question: "What are resource requests vs limits and why do both matter?",
      answer: "Requests are what the scheduler uses to decide where to place a Pod — it only places the Pod on a node that has at least that much free capacity. Limits are enforced at runtime by the kernel. CPU beyond the limit is throttled; memory beyond the limit triggers an OOMKill and the container restarts. Without requests, the scheduler places Pods without knowing how much they need and nodes get overloaded. Without limits, one runaway Pod can consume all memory on a node and starve everything else.",
    },
    {
      question: "What is a Kubernetes Ingress and when do you need one?",
      answer: "An Ingress is a cluster-wide routing rule that maps incoming HTTP/HTTPS requests to backend Services based on hostname and path, using a single external load balancer. Without an Ingress, each Service of type LoadBalancer creates its own cloud load balancer — expensive and messy at scale. With an Ingress controller (nginx, Traefik, AWS ALB), you have one external entry point and route to many Services by host or path. Ingress also handles TLS termination, often automated with cert-manager for free Let's Encrypt certificates.",
    },
  ],
} satisfies RoadmapDayDetail;
