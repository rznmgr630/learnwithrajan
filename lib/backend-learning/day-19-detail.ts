import type { RoadmapDayDetail } from "../challenge-data";

export const DAY_19_DETAIL = {
  overview: [
    "Kubernetes is the de-facto standard for running containerised workloads in production. Rather than thinking of it as 'Docker but bigger,' the correct mental model is a distributed operating system: it schedules work across a pool of machines, reconciles actual state toward desired state, and self-heals without operator intervention.",
    "Day 19 builds that mental model from the ground up — control-plane vs worker anatomy, every core workload object and when to reach for each, how cluster networking and DNS work, and how ConfigMaps, Secrets, and namespaces keep configuration clean. Work through the tables and YAML examples before Day 20.",
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
          text: "A Kubernetes cluster is divided into a control plane (the brain) and worker nodes (the muscle). The control plane makes scheduling decisions and drives reconciliation loops. Worker nodes run the actual Pod workloads. Every component communicates only through the API server — nothing talks directly to etcd except the API server itself.",
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
          text: "Kubernetes exposes several abstractions for running work. Choosing the wrong one is the most common beginner mistake — reach for the most appropriate primitive, not always Deployment.",
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
          text: "Pods are ephemeral — their IPs change on every restart. A Service provides a stable virtual IP (ClusterIP) and DNS name that load-balances across a set of Pods selected by a label selector. kube-proxy translates the ClusterIP to a real Pod IP using iptables or IPVS rules on every node.",
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
          text: "Kubernetes runs a built-in DNS server (CoreDNS) in the cluster. Every Service automatically gets a DNS record in the form: <service>.<namespace>.svc.cluster.local. So a Pod in namespace 'production' can call http://node-api (short form within same namespace), http://node-api.production (cross-namespace), or the full FQDN http://node-api.production.svc.cluster.local. Use the short form for same-namespace calls and the namespace-qualified form for cross-namespace calls — never hard-code Pod IPs.",
        },
      ],
    },
    {
      title: "ConfigMaps, Secrets & namespaces",
      blocks: [
        {
          type: "paragraph",
          text: "ConfigMaps hold non-sensitive configuration (feature flags, URLs, log levels). Secrets hold sensitive data (passwords, API keys, TLS certs) and are base64-encoded at rest — that is not encryption; enable Secrets encryption at rest in the API server config and use RBAC to restrict access. Both can be injected as environment variables or mounted as files.",
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
          text: "Namespaces provide soft multi-tenancy within a cluster. They scope names (two Deployments named 'api' can coexist in different namespaces), enable resource quotas (limit total CPU/memory per team), and allow RBAC policies scoped to a team or environment. Common patterns: one namespace per environment (dev, staging, production), one per team, or one per application. Network policies can restrict traffic between namespaces — without them, all Pods in the cluster can reach each other regardless of namespace.",
        },
      ],
    },
  ],
  faq: [
    {
      question: "What is the difference between a Pod and a Deployment?",
      answer: "A Pod is the smallest schedulable unit — one or more containers that share a network and storage context. If a raw Pod's node dies, the Pod is gone; Kubernetes does not reschedule it. A Deployment is a controller that declares desired state ('I want 3 replicas of this Pod template running') and continuously reconciles actual state toward it. When a Pod dies or a node fails, the Deployment controller notices the replica count dropped and creates a replacement. In practice you always create a Deployment (or StatefulSet, DaemonSet, Job) rather than a bare Pod.",
    },
    {
      question: "Why does Kubernetes need etcd?",
      answer: "etcd is the single source of truth for all cluster state: what Deployments exist, which Pods are scheduled on which nodes, what Service endpoints look like, every Secret and ConfigMap. The API server is the only component that reads from and writes to etcd directly. Every other component (scheduler, controllers, kubelet) watches the API server for changes. If etcd is lost without a backup, the cluster's entire desired state is gone — you would have to recreate every object from scratch. This is why etcd should always run as a three-node or five-node cluster (requiring a quorum majority to elect a leader) and be backed up regularly.",
    },
    {
      question: "What happens when a node goes down?",
      answer: "The Node controller in the controller manager detects that the node stopped sending heartbeats to the API server. After a configurable grace period (default ~5 minutes), it marks the node NotReady and evicts the Pods. The Deployment controller then sees the actual replica count is below desired and schedules replacement Pods on healthy nodes. StatefulSet Pods are also rescheduled, preserving their stable identity (pod-0 stays pod-0) and reattaching their PersistentVolumeClaims. DaemonSet Pods on the failed node are simply gone — the DaemonSet does not create extras on other nodes, since by definition one-per-node is correct.",
    },
    {
      question: "What is the difference between liveness and readiness probes?",
      answer: "A liveness probe answers 'Is this container still alive and worth keeping?' — if it fails repeatedly, Kubernetes restarts the container. Use it to detect deadlocks or unrecoverable crashes. A readiness probe answers 'Is this container ready to serve traffic right now?' — if it fails, Kubernetes removes the Pod from the Service's endpoint list so no new requests are routed to it, but the container is not restarted. Use readiness probes to handle startup time (warm-up, migrations), dependency unavailability (database down), or temporary overload. A container can be live but not ready; during a rolling update, new Pods must pass readiness before old Pods are removed, ensuring zero traffic drop.",
    },
    {
      question: "What are resource requests vs limits and why do both matter?",
      answer: "Requests are what the scheduler uses for bin-packing: it only places a Pod on a node that has at least that much free capacity. Limits are hard runtime caps enforced by the Linux kernel's cgroups. CPU beyond the limit is throttled; memory beyond the limit triggers an OOMKill and the container is restarted. If you set no requests, the scheduler places Pods with no consideration for available headroom and nodes become overloaded. If you set no limits, one runaway Pod can consume all memory on a node and starve other Pods. Always set both; set requests to the typical sustained usage and limits to the maximum safe usage.",
    },
    {
      question: "What is a Kubernetes Ingress and when do you need one?",
      answer: "An Ingress is a cluster-wide L7 routing rule that maps incoming HTTP/HTTPS requests to backend Services based on hostname and path, using a single external load balancer. Without an Ingress, each Service of type LoadBalancer provisions its own cloud load balancer — which is expensive and operationally messy at scale. With an Ingress controller (nginx-ingress, Traefik, AWS ALB Ingress Controller), you have one external entry point and route to many Services by host or path. Ingress also handles TLS termination, often integrated with cert-manager for automatic Let's Encrypt certificates.",
    },
  ],
} satisfies RoadmapDayDetail;
