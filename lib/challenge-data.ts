import type { SelfCheckItem } from "@/lib/learn/self-check-types";
import type { LocalizedString } from "@/lib/i18n/types";
export interface RoadmapTag {
  label: LocalizedString;
  slug: string;
}

/** Inline diagram keys rendered as SVG figures in the day detail modal. */
export type RoadmapDetailDiagramId =
  | "node-one-thread-io"
  | "node-event-loop-phases"
  | "node-execution-priority"
  | "nodejs-require-resolution"
  | "nodejs-express-middleware-chain"
  | "nodejs-stream-pipe"
  | "nodejs-event-emitter"
  | "nodejs-async-evolution"
  | "nodejs-mongoose-schema"
  | "nodejs-jest-unit-flow"
  | "nodejs-deploy-pipeline"
  | "go-goroutine-mn"
  | "acid-transaction"
  | "btree-index"
  | "isolation-levels"
  | "rest-graphql-grpc"
  | "cursor-pagination"
  | "rate-limit-token-bucket"
  | "jwt-flow"
  | "oauth2-code-flow"
  | "rbac-model"
  | "cache-layers"
  | "cache-aside-pattern"
  | "log-correlation"
  | "error-classification"
  | "lb-round-robin"
  | "lb-ha-failover"
  | "erd-one-many"
  | "deadlock-cycle"
  | "cap-theorem"
  | "primary-replica"
  | "cqrs-sketch"
  | "inverted-index"
  | "queue-backpressure"
  | "producer-consumer"
  | "git-workdir-staging-repo"
  | "git-local-remote-workflow"
  | "git-first-commit-flow"
  | "git-branch-merge"
  | "git-fetch-pull-push"
  | "git-rebase-linearize"
  | "git-stash-pop"
  | "git-worktree"
  | "git-pr-review-merge"
  | "react-virtual-dom"
  | "react-render-cycle"
  | "react-component-tree"
  | "react-data-flow"
  | "react-use-effect-lifecycle"
  | "react-immutable-update"
  | "react-controlled-input"
  | "react-native-bridge-architecture"
  | "react-native-metro-fast-refresh"
  | "react-native-component-tree"
  | "react-native-flexbox-mobile"
  | "react-native-navigation-stacks"
  | "react-native-list-windowing"
  | "react-native-data-offline-online"
  | "react-native-native-module-bridge"
  | "react-native-testing-pyramid-mobile"
  | "react-native-release-pipeline"
  | "devops-linux-hierarchy"
  | "devops-osi-model"
  | "devops-docker-layers"
  | "devops-cicd-pipeline"
  | "devops-k8s-cluster"
  | "devops-terraform-workflow"
  | "devops-aws-vpc"
  | "devops-prometheus-architecture"
  | "devops-ansible-playbook"
  | "devops-nginx-proxy"
  | "devops-linux-os-stack"
  | "devops-linux-permissions"
  | "devops-dns-resolution"
  | "devops-process-lifecycle"
  | "devops-apt-workflow"
  | "devops-bash-script-flow"
  | "devops-ssh-key-auth"
  | "devops-tcp-handshake"
  | "devops-subnet-cidr"
  | "devops-firewall-nat"
  | "devops-network-debug-flow"
  | "devops-vpn-tunnel"
  | "devops-git-three-areas"
  | "devops-git-branching"
  | "devops-semver"
  | "devops-git-hooks"
  | "devops-monorepo-structure"
  | "devops-merge-conflict"
  | "devops-log-parsing"
  | "devops-boto3-workflow"
  | "devops-cli-tool"
  | "devops-cloud-models"
  | "devops-iam-model"
  | "devops-ec2-lifecycle"
  | "devops-vpc-design"
  | "devops-s3-architecture"
  | "devops-rds-architecture"
  | "devops-alb-asg"
  | "devops-cloudwatch"
  | "devops-lambda"
  | "devops-route53-cloudfront"
  | "devops-sg-nacl-waf"
  | "devops-ecs-ecr"
  | "devops-cfn-sdk"
  | "devops-cost-management"
  | "devops-container-vs-vm"
  | "devops-dockerfile"
  | "devops-container-lifecycle"
  | "devops-docker-networking"
  | "devops-docker-volumes"
  | "devops-docker-compose"
  | "devops-image-registry"
  | "devops-cicd-concepts"
  | "devops-jenkins-architecture"
  | "devops-jenkins-pipeline"
  | "devops-jenkins-triggers"
  | "devops-cicd-testing"
  | "devops-deploy-strategies"
  | "devops-jenkins-advanced"
  | "devops-k8s-workloads"
  | "devops-k8s-config"
  | "devops-k8s-networking"
  | "devops-helm-workflow"
  | "devops-k8s-hpa"
  | "devops-k8s-rbac"
  | "devops-proxy-cache"
  | "devops-nginx-config"
  | "devops-load-balancing"
  | "devops-iptables"
  | "devops-ssl-termination"
  | "devops-ha-patterns"
  | "devops-ansible-arch"
  | "devops-ansible-inventory"
  | "devops-ansible-adhoc"
  | "devops-ansible-playbook"
  | "devops-ansible-templates"
  | "devops-ansible-roles"
  | "devops-ansible-vault"
  | "devops-terraform-overview"
  | "devops-terraform-hcl"
  | "devops-terraform-state"
  | "devops-terraform-variables"
  | "devops-terraform-modules"
  | "devops-terraform-workspaces"
  | "devops-terraform-cicd"
  | "devops-observability-pillars"
  | "devops-grafana-architecture"
  | "devops-alertmanager-architecture"
  | "devops-slo-error-budget"
  | "nextjs-request-lifecycle"
  | "nextjs-client-server-boundary"
  | "nextjs-data-fetch-cache"
  | "nextjs-render-strategies"
  | "nextjs-api-route-flow"
  | "nextjs-prisma-workflow"
  | "nextjs-nextauth-flow"
  | "nextjs-image-optimization"
  | "nextjs-vercel-deploy"
  | "laravel-request-lifecycle"
  | "laravel-service-container"
  | "laravel-eloquent-query"
  | "laravel-eloquent-relations"
  | "laravel-auth-guard"
  | "laravel-queue-job"
  | "laravel-api-resource"
  | "laravel-test-pyramid";

/** One rich block inside a section (tables, code, diagrams, or prose). */
export type RoadmapDetailBlock =
  | { type: "paragraph"; text: LocalizedString }
  | { type: "list"; items: LocalizedString[]; variant?: "bullet" | "number" }
  | { type: "table"; caption?: LocalizedString; headers: LocalizedString[]; rows: LocalizedString[][] }
  | { type: "code"; title?: LocalizedString; code: string }
  | { type: "diagram"; id: RoadmapDetailDiagramId }
  | { type: "youtube"; videoId: string; title?: string };

/** Same blocks after applying UI locale (plain strings for rendering). */
export type RoadmapDetailBlockResolved =
  | { type: "paragraph"; text: string }
  | { type: "list"; items: string[]; variant?: "bullet" | "number" }
  | { type: "table"; caption?: string; headers: string[]; rows: string[][] }
  | { type: "code"; title?: string; code: string }
  | { type: "diagram"; id: RoadmapDetailDiagramId }
  | { type: "youtube"; videoId: string; title?: string };

/** Optional subsection in a day detail (e.g. “HTTP methods”). */
export interface RoadmapDayDetailSection {
  title: LocalizedString;
  /** Simple bullet list (use when you do not need tables/diagrams). */
  items?: LocalizedString[];
  /** Rich layout: tables, code samples, SVG diagrams. If set, `items` is ignored. */
  blocks?: RoadmapDetailBlock[];
}

/** One self-check question with a hidden answer (accordion). */
export type RoadmapDayFaqItem = SelfCheckItem;

/** One multiple-choice question for a day's closing quiz. */
export interface RoadmapDayQuizQuestion {
  question: LocalizedString;
  options: LocalizedString[];
  correctIndex: number;
  explanation: LocalizedString;
}

/** Shown in the day detail panel when a card is opened. */
export interface RoadmapDayDetail {
  /** One paragraph or several for longer write-ups. Omit when sections (or bullets alone) carry the narrative. */
  overview?: LocalizedString | LocalizedString[];
  /** Optional themed blocks rendered after the overview. */
  sections?: RoadmapDayDetailSection[];
  /** Optional FAQ; answers show in an accordion (collapsed by default). */
  faq?: RoadmapDayFaqItem[];
  /** Optional closing quiz, scored and stored like the lesson quizzes. */
  quiz?: RoadmapDayQuizQuestion[];
  bullets?: LocalizedString[];
}

export interface RoadmapDay {
  day: number;
  label?: LocalizedString;
  title: LocalizedString;
  tags: RoadmapTag[];
  /** Optional; if omitted, the UI uses a short generic template. */
  detail?: RoadmapDayDetail;
}

export interface RoadmapWeek {
  id: string;
  title: LocalizedString;
  /** Tailwind class for the week bullet (e.g. `bg-purple-500`). */
  dotClass: string;
  days: RoadmapDay[];
}
