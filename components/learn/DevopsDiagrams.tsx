"use client";

import type { RoadmapDetailDiagramId } from "@/lib/challenge-data";

const figClass =
  "mt-3 overflow-hidden rounded-lg border border-[var(--border)] bg-[color-mix(in_oklab,var(--elevated)_45%,transparent)] text-[var(--text)]";

const DEVOPS_IDS = new Set<RoadmapDetailDiagramId>([
  "devops-linux-hierarchy",
  "devops-osi-model",
  "devops-docker-layers",
  "devops-cicd-pipeline",
  "devops-k8s-cluster",
  "devops-terraform-workflow",
  "devops-aws-vpc",
  "devops-prometheus-architecture",
  "devops-ansible-playbook",
  "devops-nginx-proxy",
  "devops-linux-os-stack",
  "devops-linux-permissions",
  "devops-dns-resolution",
  "devops-process-lifecycle",
  "devops-apt-workflow",
  "devops-bash-script-flow",
  "devops-ssh-key-auth",
  "devops-tcp-handshake",
  "devops-subnet-cidr",
  "devops-firewall-nat",
  "devops-network-debug-flow",
  "devops-vpn-tunnel",
  "devops-git-three-areas",
  "devops-git-branching",
  "devops-semver",
  "devops-git-hooks",
  "devops-monorepo-structure",
  "devops-merge-conflict",
  "devops-log-parsing",
  "devops-boto3-workflow",
  "devops-cli-tool",
  "devops-cloud-models",
  "devops-iam-model",
  "devops-ec2-lifecycle",
  "devops-vpc-design",
  "devops-s3-architecture",
  "devops-rds-architecture",
  "devops-alb-asg",
  "devops-cloudwatch",
  "devops-lambda",
  "devops-route53-cloudfront",
  "devops-sg-nacl-waf",
  "devops-ecs-ecr",
  "devops-cfn-sdk",
  "devops-cost-management",
  "devops-container-vs-vm",
  "devops-dockerfile",
  "devops-container-lifecycle",
  "devops-docker-networking",
  "devops-docker-volumes",
  "devops-docker-compose",
]);

export function isDevopsRoadmapDiagram(id: RoadmapDetailDiagramId): boolean {
  return DEVOPS_IDS.has(id);
}

function Caption({ text }: { text: string }) {
  return (
    <p className="border-t border-[var(--border)] px-3 py-2 text-[11px] text-[var(--muted)]">{text}</p>
  );
}

function LinuxHierarchyDiagram() {
  return (
    <figure className={figClass}>
      <svg viewBox="0 0 520 260" className="h-auto w-full" aria-hidden>
        <text x="260" y="22" textAnchor="middle" className="fill-[var(--text)] text-[11px] font-semibold" fontSize="11" fontWeight="600">/  (root)</text>
        <line x1="260" y1="26" x2="260" y2="38" stroke="var(--border)" strokeWidth="1"/>
        {/* Root branches */}
        {[
          { x: 52, label: "/bin", desc: "Binaries" },
          { x: 124, label: "/etc", desc: "Config" },
          { x: 196, label: "/home", desc: "Users" },
          { x: 268, label: "/var", desc: "Variable" },
          { x: 340, label: "/usr", desc: "Programs" },
          { x: 412, label: "/tmp", desc: "Temp" },
          { x: 468, label: "/proc", desc: "Processes" },
        ].map(({ x, label, desc }) => (
          <g key={label}>
            <line x1="260" y1="38" x2={x} y2="58" stroke="var(--border)" strokeWidth="1"/>
            <rect x={x - 28} y="58" width="56" height="26" rx="4" fill="color-mix(in oklab, var(--elevated) 70%, transparent)" stroke="var(--border)" strokeWidth="1"/>
            <text x={x} y="72" textAnchor="middle" className="fill-[var(--accent)] font-mono" fontSize="9.5" fontFamily="monospace">{label}</text>
            <text x={x} y="100" textAnchor="middle" className="fill-[var(--muted)]" fontSize="9">{desc}</text>
          </g>
        ))}
        {/* /usr subtree */}
        {[
          { x: 310, label: "/usr/bin" },
          { x: 340, label: "/usr/lib" },
          { x: 370, label: "/usr/local" },
        ].map(({ x, label }) => (
          <g key={label}>
            <line x1="340" y1="84" x2={x} y2="128" stroke="var(--border)" strokeWidth="1" strokeDasharray="3 2"/>
            <text x={x} y="140" textAnchor="middle" className="fill-[var(--muted)] font-mono" fontSize="8.5" fontFamily="monospace">{label}</text>
          </g>
        ))}
        {/* /var subtree */}
        {[
          { x: 228, label: "/var/log" },
          { x: 268, label: "/var/www" },
        ].map(({ x, label }) => (
          <g key={label}>
            <line x1="268" y1="84" x2={x} y2="128" stroke="var(--border)" strokeWidth="1" strokeDasharray="3 2"/>
            <text x={x} y="140" textAnchor="middle" className="fill-[var(--muted)] font-mono" fontSize="8.5" fontFamily="monospace">{label}</text>
          </g>
        ))}
        {/* Legend */}
        <rect x="20" y="190" width="480" height="56" rx="6" fill="color-mix(in oklab, var(--elevated) 40%, transparent)" stroke="var(--border)" strokeWidth="1"/>
        <text x="36" y="208" className="fill-[var(--muted)]" fontSize="9" fontWeight="600">Key directories:</text>
        <text x="36" y="222" className="fill-[var(--muted)]" fontSize="8.5">/etc = system config · /home = user files · /var/log = logs · /usr/local = custom software</text>
        <text x="36" y="236" className="fill-[var(--muted)]" fontSize="8.5">/proc &amp; /sys = virtual filesystems (kernel data) · /tmp = cleared on reboot</text>
      </svg>
      <Caption text="Linux Filesystem Hierarchy Standard (FHS) — everything under one root /" />
    </figure>
  );
}

function OsiModelDiagram() {
  const layers = [
    { n: 7, name: "Application", proto: "HTTP, DNS, SMTP", color: "#6366f1" },
    { n: 6, name: "Presentation", proto: "TLS, JPEG, ASCII", color: "#8b5cf6" },
    { n: 5, name: "Session", proto: "NetBIOS, RPC", color: "#a855f7" },
    { n: 4, name: "Transport", proto: "TCP, UDP", color: "#3b82f6" },
    { n: 3, name: "Network", proto: "IP, ICMP, OSPF", color: "#06b6d4" },
    { n: 2, name: "Data Link", proto: "Ethernet, Wi-Fi (802.11)", color: "#10b981" },
    { n: 1, name: "Physical", proto: "Cables, hubs, 0s & 1s", color: "#f59e0b" },
  ];
  return (
    <figure className={figClass}>
      <svg viewBox="0 0 520 280" className="h-auto w-full" aria-hidden>
        <text x="16" y="20" fontSize="10" fontWeight="600" fill="var(--text)">Layer</text>
        <text x="68" y="20" fontSize="10" fontWeight="600" fill="var(--text)">Name</text>
        <text x="200" y="20" fontSize="10" fontWeight="600" fill="var(--text)">PDU</text>
        <text x="280" y="20" fontSize="10" fontWeight="600" fill="var(--text)">Protocols / Examples</text>
        {layers.map(({ n, name, proto, color }, i) => {
          const y = 28 + i * 34;
          const pdus = ["Data", "Data", "Data", "Segment", "Packet", "Frame", "Bit"];
          return (
            <g key={n}>
              <rect x="8" y={y} width="500" height="30" rx="3" fill={`${color}18`} stroke={`${color}55`} strokeWidth="1"/>
              <text x="16" y={y + 19} fontSize="11" fontWeight="700" fill={color}>{n}</text>
              <text x="68" y={y + 19} fontSize="10" fill="var(--text)">{name}</text>
              <text x="200" y={y + 19} fontSize="9" fill="var(--muted)" fontFamily="monospace">{pdus[i]}</text>
              <text x="280" y={y + 19} fontSize="9" fill="var(--muted)">{proto}</text>
            </g>
          );
        })}
        {/* Arrows */}
        <text x="490" y="120" fontSize="8" fill="var(--muted)" textAnchor="middle">↑</text>
        <text x="490" y="130" fontSize="7" fill="var(--muted)" textAnchor="middle">Sender</text>
        <text x="490" y="160" fontSize="8" fill="var(--muted)" textAnchor="middle">↓</text>
        <text x="490" y="170" fontSize="7" fill="var(--muted)" textAnchor="middle">Receiver</text>
      </svg>
      <Caption text="OSI 7-layer model — data flows down the sender's stack and up the receiver's stack" />
    </figure>
  );
}

function DockerLayersDiagram() {
  const layers = [
    { label: "Container layer (R/W)", note: "your changes live here — gone on rm", accent: true },
    { label: "App layer", note: "COPY . /app  RUN npm install" },
    { label: "Config layer", note: "ENV NODE_ENV=production  EXPOSE 3000" },
    { label: "Dependency layer", note: "RUN apt-get install curl" },
    { label: "Base OS layer", note: "FROM node:20-alpine" },
  ];
  return (
    <figure className={figClass}>
      <svg viewBox="0 0 500 230" className="h-auto w-full" aria-hidden>
        <text x="250" y="18" textAnchor="middle" fontSize="10" fontWeight="600" fill="var(--text)">Docker image layers (immutable R/O) + container layer (R/W)</text>
        {layers.map(({ label, note, accent }, i) => {
          const y = 28 + i * 36;
          const fill = accent ? "color-mix(in oklab, #6366f1 18%, transparent)" : "color-mix(in oklab, var(--elevated) 60%, transparent)";
          const stroke = accent ? "#6366f166" : "var(--border)";
          return (
            <g key={i}>
              <rect x="20" y={y} width="460" height="28" rx="4" fill={fill} stroke={stroke} strokeWidth="1"/>
              <text x="36" y={y + 17} fontSize="10" fontWeight={accent ? "700" : "500"} fill={accent ? "#818cf8" : "var(--text)"}>{label}</text>
              <text x="320" y={y + 17} fontSize="8.5" fill="var(--muted)">{note}</text>
            </g>
          );
        })}
        <text x="250" y="218" textAnchor="middle" fontSize="8.5" fill="var(--muted)">Each RUN/COPY/ADD instruction creates a new read-only layer — shared across images that reuse the same base</text>
      </svg>
      <Caption text="Docker image layers — layers below the container layer are read-only and shared between containers" />
    </figure>
  );
}

function CicdPipelineDiagram() {
  const stages = [
    { label: "Code", sub: "git push", color: "#6366f1" },
    { label: "Build", sub: "compile / bundle", color: "#3b82f6" },
    { label: "Test", sub: "unit · integration", color: "#06b6d4" },
    { label: "Scan", sub: "SAST · deps", color: "#10b981" },
    { label: "Deploy", sub: "staging → prod", color: "#f59e0b" },
    { label: "Monitor", sub: "metrics · alerts", color: "#ec4899" },
  ];
  return (
    <figure className={figClass}>
      <svg viewBox="0 0 520 130" className="h-auto w-full" aria-hidden>
        <text x="260" y="18" textAnchor="middle" fontSize="10" fontWeight="600" fill="var(--text)">CI/CD Pipeline — code change → production</text>
        {stages.map(({ label, sub, color }, i) => {
          const x = 30 + i * 82;
          return (
            <g key={i}>
              {i > 0 && (
                <path d={`M${x - 12},55 L${x + 2},55`} stroke="var(--border)" strokeWidth="1.5" markerEnd="url(#cicd-arrow)" fill="none"/>
              )}
              <rect x={x} y="38" width="62" height="34" rx="6" fill={`${color}22`} stroke={`${color}66`} strokeWidth="1.2"/>
              <text x={x + 31} y="59" textAnchor="middle" fontSize="10" fontWeight="600" fill={color}>{label}</text>
              <text x={x + 31} y="90" textAnchor="middle" fontSize="8" fill="var(--muted)">{sub}</text>
            </g>
          );
        })}
        <defs>
          <marker id="cicd-arrow" markerWidth="5" markerHeight="5" refX="4" refY="2.5" orient="auto">
            <path d="M0,0 L5,2.5 L0,5 Z" fill="var(--border)"/>
          </marker>
        </defs>
        <text x="260" y="116" textAnchor="middle" fontSize="8.5" fill="var(--muted)">Each stage must pass before the next runs — a failed test blocks the deploy</text>
      </svg>
      <Caption text="CI/CD pipeline — automate the path from commit to production" />
    </figure>
  );
}

function K8sClusterDiagram() {
  return (
    <figure className={figClass}>
      <svg viewBox="0 0 520 240" className="h-auto w-full" aria-hidden>
        {/* Control Plane */}
        <rect x="20" y="10" width="480" height="90" rx="8" fill="color-mix(in oklab, #6366f1 10%, transparent)" stroke="#6366f155" strokeWidth="1.5"/>
        <text x="260" y="28" textAnchor="middle" fontSize="10" fontWeight="700" fill="#818cf8">Control Plane</text>
        {[
          { x: 50, label: "API Server", sub: "kubectl entry-point" },
          { x: 160, label: "etcd", sub: "cluster state DB" },
          { x: 270, label: "Scheduler", sub: "pod placement" },
          { x: 390, label: "Controller Mgr", sub: "reconciliation loops" },
        ].map(({ x, label, sub }) => (
          <g key={label}>
            <rect x={x - 42} y="36" width="84" height="44" rx="5" fill="color-mix(in oklab, var(--elevated) 70%, transparent)" stroke="#6366f133" strokeWidth="1"/>
            <text x={x} y="56" textAnchor="middle" fontSize="9" fontWeight="600" fill="var(--text)">{label}</text>
            <text x={x} y="70" textAnchor="middle" fontSize="7.5" fill="var(--muted)">{sub}</text>
          </g>
        ))}
        {/* Worker Nodes */}
        {[0, 1, 2].map((i) => {
          const x = 50 + i * 160;
          return (
            <g key={i}>
              <rect x={x} y="118" width="130" height="102" rx="8" fill="color-mix(in oklab, #10b981 8%, transparent)" stroke="#10b98144" strokeWidth="1.5"/>
              <text x={x + 65} y="136" textAnchor="middle" fontSize="9" fontWeight="700" fill="#34d399">Worker Node {i + 1}</text>
              <rect x={x + 10} y="142" width="50" height="22" rx="4" fill="color-mix(in oklab, var(--elevated) 65%, transparent)" stroke="var(--border)" strokeWidth="1"/>
              <text x={x + 35} y="157" textAnchor="middle" fontSize="8" fill="var(--text)">Pod</text>
              <rect x={x + 70} y="142" width="50" height="22" rx="4" fill="color-mix(in oklab, var(--elevated) 65%, transparent)" stroke="var(--border)" strokeWidth="1"/>
              <text x={x + 95} y="157" textAnchor="middle" fontSize="8" fill="var(--text)">Pod</text>
              <text x={x + 65} y="182" textAnchor="middle" fontSize="7.5" fill="var(--muted)">kubelet · kube-proxy</text>
              <text x={x + 65} y="196" textAnchor="middle" fontSize="7.5" fill="var(--muted)">container runtime</text>
            </g>
          );
        })}
        {/* Arrows from control plane to nodes */}
        {[115, 275, 435].map((x) => (
          <line key={x} x1={x} y1="100" x2={x} y2="116" stroke="var(--border)" strokeWidth="1" strokeDasharray="3 2"/>
        ))}
      </svg>
      <Caption text="Kubernetes cluster — control plane manages state; worker nodes run the Pods (containers)" />
    </figure>
  );
}

function TerraformWorkflowDiagram() {
  const steps = [
    { label: "Write", sub: "HCL config files\n(.tf)", color: "#6366f1" },
    { label: "Init", sub: "terraform init\ndownload providers", color: "#3b82f6" },
    { label: "Plan", sub: "terraform plan\npreview changes", color: "#06b6d4" },
    { label: "Apply", sub: "terraform apply\ncreate/update infra", color: "#10b981" },
    { label: "Destroy", sub: "terraform destroy\nclean up resources", color: "#ef4444" },
  ];
  return (
    <figure className={figClass}>
      <svg viewBox="0 0 500 150" className="h-auto w-full" aria-hidden>
        <text x="250" y="18" textAnchor="middle" fontSize="10" fontWeight="600" fill="var(--text)">Terraform workflow — from code to cloud infrastructure</text>
        {steps.map(({ label, sub, color }, i) => {
          const x = 30 + i * 92;
          const lines = sub.split("\n");
          return (
            <g key={i}>
              {i > 0 && (
                <line x1={x - 12} y1="62" x2={x} y2="62" stroke="var(--border)" strokeWidth="1.5"/>
              )}
              <rect x={x} y="40" width="74" height="44" rx="6" fill={`${color}1a`} stroke={`${color}55`} strokeWidth="1.2"/>
              <text x={x + 37} y="58" textAnchor="middle" fontSize="11" fontWeight="700" fill={color}>{label}</text>
              {lines.map((line, li) => (
                <text key={li} x={x + 37} y={95 + li * 12} textAnchor="middle" fontSize="8" fill="var(--muted)">{line}</text>
              ))}
            </g>
          );
        })}
        <text x="250" y="138" textAnchor="middle" fontSize="8.5" fill="var(--muted)">State file tracks what Terraform created — never edit manually</text>
      </svg>
      <Caption text="Terraform workflow — declarative infrastructure defined as code, applied reproducibly" />
    </figure>
  );
}

function AwsVpcDiagram() {
  return (
    <figure className={figClass}>
      <svg viewBox="0 0 520 240" className="h-auto w-full" aria-hidden>
        <text x="260" y="18" textAnchor="middle" fontSize="10" fontWeight="600" fill="var(--text)">AWS VPC — public & private subnet architecture</text>
        {/* VPC border */}
        <rect x="16" y="26" width="488" height="200" rx="10" fill="color-mix(in oklab, #f59e0b 6%, transparent)" stroke="#f59e0b55" strokeWidth="1.5"/>
        <text x="30" y="42" fontSize="9" fontWeight="600" fill="#fbbf24">VPC (10.0.0.0/16)</text>
        {/* Internet Gateway */}
        <rect x="210" y="30" width="100" height="24" rx="4" fill="color-mix(in oklab, #f59e0b 25%, transparent)" stroke="#f59e0b88" strokeWidth="1"/>
        <text x="260" y="46" textAnchor="middle" fontSize="9" fill="#fbbf24">Internet Gateway</text>
        {/* Public Subnets */}
        <rect x="30" y="64" width="200" height="130" rx="8" fill="color-mix(in oklab, #3b82f6 8%, transparent)" stroke="#3b82f644" strokeWidth="1.2"/>
        <text x="130" y="80" textAnchor="middle" fontSize="9" fontWeight="600" fill="#60a5fa">Public Subnet (10.0.1.0/24)</text>
        <rect x="46" y="88" width="80" height="36" rx="4" fill="color-mix(in oklab, var(--elevated) 60%, transparent)" stroke="var(--border)" strokeWidth="1"/>
        <text x="86" y="104" textAnchor="middle" fontSize="8.5" fill="var(--text)">EC2 (Web)</text>
        <text x="86" y="116" textAnchor="middle" fontSize="7.5" fill="var(--muted)">public IP</text>
        <rect x="146" y="88" width="72" height="36" rx="4" fill="color-mix(in oklab, var(--elevated) 60%, transparent)" stroke="var(--border)" strokeWidth="1"/>
        <text x="182" y="104" textAnchor="middle" fontSize="8.5" fill="var(--text)">NAT Gateway</text>
        <text x="86" y="146" textAnchor="middle" fontSize="7.5" fill="#3b82f6">→ Route Table → IGW</text>
        {/* Private Subnets */}
        <rect x="250" y="64" width="240" height="130" rx="8" fill="color-mix(in oklab, #10b981 8%, transparent)" stroke="#10b98144" strokeWidth="1.2"/>
        <text x="370" y="80" textAnchor="middle" fontSize="9" fontWeight="600" fill="#34d399">Private Subnet (10.0.2.0/24)</text>
        <rect x="266" y="88" width="80" height="36" rx="4" fill="color-mix(in oklab, var(--elevated) 60%, transparent)" stroke="var(--border)" strokeWidth="1"/>
        <text x="306" y="104" textAnchor="middle" fontSize="8.5" fill="var(--text)">EC2 (App)</text>
        <text x="306" y="116" textAnchor="middle" fontSize="7.5" fill="var(--muted)">no public IP</text>
        <rect x="366" y="88" width="80" height="36" rx="4" fill="color-mix(in oklab, var(--elevated) 60%, transparent)" stroke="var(--border)" strokeWidth="1"/>
        <text x="406" y="104" textAnchor="middle" fontSize="8.5" fill="var(--text)">RDS (DB)</text>
        <text x="406" y="116" textAnchor="middle" fontSize="7.5" fill="var(--muted)">private only</text>
        <text x="370" y="146" textAnchor="middle" fontSize="7.5" fill="#10b981">→ Route Table → NAT GW</text>
        {/* Arrow from IGW to public subnet */}
        <line x1="230" y1="54" x2="130" y2="64" stroke="#f59e0b55" strokeWidth="1.2" strokeDasharray="3 2"/>
      </svg>
      <Caption text="AWS VPC — public subnets face the internet via IGW; private subnets use NAT for outbound-only access" />
    </figure>
  );
}

function PrometheusArchDiagram() {
  return (
    <figure className={figClass}>
      <svg viewBox="0 0 520 200" className="h-auto w-full" aria-hidden>
        <text x="260" y="18" textAnchor="middle" fontSize="10" fontWeight="600" fill="var(--text)">Prometheus architecture — pull-based metrics collection</text>
        {/* Targets */}
        {[
          { x: 50, y: 50, label: "Node Exporter", sub: "host metrics" },
          { x: 50, y: 110, label: "App /metrics", sub: "custom metrics" },
          { x: 50, y: 170, label: "cAdvisor", sub: "container metrics" },
        ].map(({ x, y, label, sub }) => (
          <g key={label}>
            <rect x={x - 44} y={y - 16} width="88" height="32" rx="4" fill="color-mix(in oklab, var(--elevated) 70%, transparent)" stroke="var(--border)" strokeWidth="1"/>
            <text x={x} y={y} textAnchor="middle" fontSize="9" fill="var(--text)">{label}</text>
            <text x={x} y={y + 12} textAnchor="middle" fontSize="7.5" fill="var(--muted)">{sub}</text>
          </g>
        ))}
        {/* Prometheus server */}
        <rect x="170" y="70" width="120" height="80" rx="8" fill="color-mix(in oklab, #ef4444 12%, transparent)" stroke="#ef444455" strokeWidth="1.5"/>
        <text x="230" y="104" textAnchor="middle" fontSize="10" fontWeight="700" fill="#f87171">Prometheus</text>
        <text x="230" y="118" textAnchor="middle" fontSize="8" fill="var(--muted)">scrape / TSDB</text>
        <text x="230" y="130" textAnchor="middle" fontSize="8" fill="var(--muted)">PromQL</text>
        {/* Scrape arrows */}
        {[58, 118, 178].map((y) => (
          <line key={y} x1="106" y1={y} x2="170" y2={y > 100 ? 120 : 96} stroke="var(--border)" strokeWidth="1" strokeDasharray="4 2"/>
        ))}
        {/* Alertmanager */}
        <rect x="340" y="30" width="120" height="44" rx="6" fill="color-mix(in oklab, #f59e0b 12%, transparent)" stroke="#f59e0b55" strokeWidth="1.2"/>
        <text x="400" y="50" textAnchor="middle" fontSize="9" fontWeight="600" fill="#fbbf24">Alertmanager</text>
        <text x="400" y="64" textAnchor="middle" fontSize="7.5" fill="var(--muted)">routes → PagerDuty / Slack</text>
        <line x1="290" y1="96" x2="340" y2="58" stroke="#f59e0b55" strokeWidth="1" strokeDasharray="3 2"/>
        {/* Grafana */}
        <rect x="340" y="110" width="120" height="44" rx="6" fill="color-mix(in oklab, #f97316 12%, transparent)" stroke="#f9731655" strokeWidth="1.2"/>
        <text x="400" y="130" textAnchor="middle" fontSize="9" fontWeight="600" fill="#fb923c">Grafana</text>
        <text x="400" y="144" textAnchor="middle" fontSize="7.5" fill="var(--muted)">dashboards &amp; explore</text>
        <line x1="290" y1="118" x2="340" y2="130" stroke="#f9731655" strokeWidth="1" strokeDasharray="3 2"/>
      </svg>
      <Caption text="Prometheus scrapes /metrics endpoints on a configured interval and stores time-series data locally" />
    </figure>
  );
}

function AnsiblePlaybookDiagram() {
  return (
    <figure className={figClass}>
      <svg viewBox="0 0 520 190" className="h-auto w-full" aria-hidden>
        <text x="260" y="18" textAnchor="middle" fontSize="10" fontWeight="600" fill="var(--text)">Ansible execution flow — control node → managed hosts</text>
        {/* Control Node */}
        <rect x="20" y="36" width="120" height="110" rx="8" fill="color-mix(in oklab, #6366f1 10%, transparent)" stroke="#6366f155" strokeWidth="1.5"/>
        <text x="80" y="56" textAnchor="middle" fontSize="9" fontWeight="700" fill="#818cf8">Control Node</text>
        <text x="80" y="74" textAnchor="middle" fontSize="8" fill="var(--muted)">inventory.ini</text>
        <text x="80" y="88" textAnchor="middle" fontSize="8" fill="var(--muted)">playbook.yml</text>
        <text x="80" y="102" textAnchor="middle" fontSize="8" fill="var(--muted)">ansible.cfg</text>
        <text x="80" y="130" textAnchor="middle" fontSize="8" fill="var(--text)">ansible-playbook</text>
        {/* SSH arrows */}
        {[70, 110, 150].map((y, i) => (
          <g key={i}>
            <line x1="140" y1="96" x2="280" y2={y} stroke="var(--border)" strokeWidth="1" strokeDasharray="4 2"/>
            <text x="210" y={y - 4} textAnchor="middle" fontSize="7.5" fill="var(--muted)">SSH</text>
          </g>
        ))}
        {/* Managed hosts */}
        {["web-01", "db-01", "cache-01"].map((host, i) => (
          <g key={host}>
            <rect x="280" y={50 + i * 46} width="100" height="36" rx="6" fill="color-mix(in oklab, #10b981 10%, transparent)" stroke="#10b98155" strokeWidth="1.2"/>
            <text x="330" y={64 + i * 46} textAnchor="middle" fontSize="9" fontWeight="600" fill="#34d399">{host}</text>
            <text x="330" y={76 + i * 46} textAnchor="middle" fontSize="7.5" fill="var(--muted)">Python (sftp)</text>
          </g>
        ))}
        {/* Task outcomes */}
        <rect x="400" y="50" width="104" height="108" rx="6" fill="color-mix(in oklab, var(--elevated) 55%, transparent)" stroke="var(--border)" strokeWidth="1"/>
        <text x="452" y="68" textAnchor="middle" fontSize="9" fontWeight="600" fill="var(--text)">Task Results</text>
        {[["ok", "#10b981"], ["changed", "#f59e0b"], ["failed", "#ef4444"], ["skipped", "#6b7280"]].map(([s, c], i) => (
          <g key={s}>
            <circle cx="420" cy={85 + i * 18} r="4" fill={c}/>
            <text x="430" y={89 + i * 18} fontSize="8" fill="var(--muted)">{s}</text>
          </g>
        ))}
        <line x1="380" y1="110" x2="400" y2="110" stroke="var(--border)" strokeWidth="1" strokeDasharray="3 2"/>
      </svg>
      <Caption text="Ansible is agentless — it pushes Python modules over SSH; idempotent tasks mean re-running is safe" />
    </figure>
  );
}

function NginxProxyDiagram() {
  return (
    <figure className={figClass}>
      <svg viewBox="0 0 520 180" className="h-auto w-full" aria-hidden>
        <text x="260" y="18" textAnchor="middle" fontSize="10" fontWeight="600" fill="var(--text)">Nginx as reverse proxy — single entry point for multiple backends</text>
        {/* Clients */}
        {[40, 90, 140].map((y, i) => (
          <g key={i}>
            <rect x="10" y={y - 14} width="64" height="28" rx="4" fill="color-mix(in oklab, var(--elevated) 65%, transparent)" stroke="var(--border)" strokeWidth="1"/>
            <text x="42" y={y + 5} textAnchor="middle" fontSize="9" fill="var(--text)">Client {i + 1}</text>
          </g>
        ))}
        {/* Arrows to Nginx */}
        {[40, 90, 140].map((y) => (
          <line key={y} x1="74" y1={y} x2="180" y2="90" stroke="var(--border)" strokeWidth="1"/>
        ))}
        {/* Nginx */}
        <rect x="180" y="56" width="100" height="68" rx="8" fill="color-mix(in oklab, #10b981 12%, transparent)" stroke="#10b98155" strokeWidth="1.5"/>
        <text x="230" y="84" textAnchor="middle" fontSize="11" fontWeight="700" fill="#34d399">Nginx</text>
        <text x="230" y="100" textAnchor="middle" fontSize="8" fill="var(--muted)">:80 / :443</text>
        <text x="230" y="114" textAnchor="middle" fontSize="8" fill="var(--muted)">TLS termination</text>
        {/* Arrows to backends */}
        {[50, 90, 130].map((y) => (
          <line key={y} x1="280" y1="90" x2="360" y2={y} stroke="var(--border)" strokeWidth="1" strokeDasharray="4 2"/>
        ))}
        {/* Backends */}
        {[
          { y: 50, label: "App :3001", sub: "/api/*" },
          { y: 90, label: "App :3002", sub: "/" },
          { y: 130, label: "Static :8080", sub: "/static/*" },
        ].map(({ y, label, sub }) => (
          <g key={label}>
            <rect x="360" y={y - 16} width="100" height="32" rx="4" fill="color-mix(in oklab, #3b82f6 10%, transparent)" stroke="#3b82f655" strokeWidth="1"/>
            <text x="410" y={y} textAnchor="middle" fontSize="9" fill="#60a5fa">{label}</text>
            <text x="410" y={y + 12} textAnchor="middle" fontSize="7.5" fill="var(--muted)">{sub}</text>
          </g>
        ))}
        <text x="260" y="165" textAnchor="middle" fontSize="8.5" fill="var(--muted)">location blocks route requests to backends — clients only see one IP</text>
      </svg>
      <Caption text="Nginx reverse proxy — routes /api/* to Node, /* to React, /static/* to file server, handles TLS" />
    </figure>
  );
}

function LinuxOsStackDiagram() {
  const userLayers = [
    { label: "Applications", sub: "nginx · docker · python · your services", color: "#10b981", y: 32 },
    { label: "Shell  (bash / zsh / sh)", sub: "parses commands · expands variables · forks processes", color: "#06b6d4", y: 72 },
    { label: "System Libraries  (glibc)", sub: "printf · malloc · fopen · pthread · wraps syscalls", color: "#3b82f6", y: 112 },
  ];
  return (
    <figure className={figClass}>
      <svg viewBox="0 0 520 268" className="h-auto w-full" aria-hidden>
        <text x="260" y="18" textAnchor="middle" fontSize="10" fontWeight="600" fill="var(--text)">Linux OS Stack — from hardware to your terminal</text>
        {userLayers.map(({ label, sub, color, y }) => (
          <g key={label}>
            <rect x="16" y={y} width="430" height="32" rx="4" fill={`${color}1a`} stroke={`${color}66`} strokeWidth="1.2"/>
            <text x="30" y={y + 14} fontSize="10" fontWeight="600" fill={color}>{label}</text>
            <text x="30" y={y + 26} fontSize="8" fill="var(--muted)">{sub}</text>
          </g>
        ))}
        {/* User Space bracket */}
        <line x1="452" y1="32" x2="452" y2="144" stroke="var(--muted)" strokeWidth="1" strokeDasharray="3 2"/>
        <line x1="452" y1="32" x2="460" y2="32" stroke="var(--muted)" strokeWidth="1"/>
        <line x1="452" y1="144" x2="460" y2="144" stroke="var(--muted)" strokeWidth="1"/>
        <text x="468" y="93" fontSize="8.5" fill="var(--muted)" fontStyle="italic">User</text>
        <text x="468" y="105" fontSize="8.5" fill="var(--muted)" fontStyle="italic">Space</text>
        {/* Syscall boundary */}
        <line x1="16" y1="152" x2="446" y2="152" stroke="#f59e0b88" strokeWidth="1.5" strokeDasharray="6 3"/>
        <text x="230" y="163" textAnchor="middle" fontSize="8" fill="#fbbf24">── syscall boundary ──</text>
        {/* Kernel layer */}
        <rect x="16" y="170" width="430" height="54" rx="4" fill="#6366f11a" stroke="#6366f166" strokeWidth="1.5"/>
        <text x="30" y="188" fontSize="10" fontWeight="700" fill="#818cf8">Linux Kernel</text>
        <text x="30" y="202" fontSize="8" fill="var(--muted)">Process Scheduler · Memory Manager · Device Drivers · Networking</text>
        <text x="30" y="214" fontSize="8" fill="var(--muted)">Virtual Filesystem (VFS) · Security (SELinux / AppArmor)</text>
        {/* Kernel Space bracket */}
        <line x1="452" y1="170" x2="452" y2="224" stroke="var(--muted)" strokeWidth="1" strokeDasharray="3 2"/>
        <line x1="452" y1="170" x2="460" y2="170" stroke="var(--muted)" strokeWidth="1"/>
        <line x1="452" y1="224" x2="460" y2="224" stroke="var(--muted)" strokeWidth="1"/>
        <text x="468" y="198" fontSize="8.5" fill="var(--muted)" fontStyle="italic">Kernel</text>
        <text x="468" y="210" fontSize="8.5" fill="var(--muted)" fontStyle="italic">Space</text>
        {/* Hardware layer */}
        <rect x="16" y="232" width="430" height="28" rx="4" fill="#f59e0b1a" stroke="#f59e0b66" strokeWidth="1.2"/>
        <text x="30" y="250" fontSize="10" fontWeight="600" fill="#fbbf24">Hardware</text>
        <text x="120" y="250" fontSize="8.5" fill="var(--muted)">CPU · RAM · SSD/HDD · NIC · GPU</text>
        {/* Hardware bracket */}
        <line x1="452" y1="232" x2="452" y2="260" stroke="var(--muted)" strokeWidth="1" strokeDasharray="3 2"/>
        <text x="468" y="250" fontSize="8.5" fill="var(--muted)" fontStyle="italic">Physical</text>
        {/* Down arrows showing call direction */}
        <text x="8" y="58" textAnchor="middle" fontSize="9" fill="var(--muted)">↓</text>
        <text x="8" y="98" textAnchor="middle" fontSize="9" fill="var(--muted)">↓</text>
        <text x="8" y="138" textAnchor="middle" fontSize="9" fill="var(--muted)">↓</text>
        <text x="8" y="200" textAnchor="middle" fontSize="9" fill="var(--muted)">↓</text>
      </svg>
      <Caption text="No user program ever touches hardware directly — syscalls are the only crossing point between user space and the kernel" />
    </figure>
  );
}

function LinuxPermissionsDiagram() {
  return (
    <figure className={figClass}>
      <svg viewBox="0 0 520 230" className="h-auto w-full" aria-hidden>
        <text x="260" y="16" textAnchor="middle" fontSize="10" fontWeight="600" fill="var(--text)">Linux permission bits — reading ls -l output</text>
        {/* ls -l example line */}
        <rect x="16" y="24" width="488" height="28" rx="4" fill="color-mix(in oklab, var(--elevated) 65%, transparent)" stroke="var(--border)" strokeWidth="1"/>
        <text x="30" y="43" fontSize="10" fontFamily="monospace" fill="var(--text)">-  rwx  r-x  r--   2   alice  devs   4.2K   Jan 12  deploy.sh</text>
        {/* Bracket annotations */}
        {[
          { x1: 30, x2: 38,  label: "type",  sub: "- = file", color: "#94a3b8", ly: 86 },
          { x1: 42, x2: 66,  label: "owner", sub: "rwx",      color: "#6366f1", ly: 86 },
          { x1: 69, x2: 93,  label: "group", sub: "r-x",      color: "#06b6d4", ly: 86 },
          { x1: 96, x2: 120, label: "other", sub: "r--",      color: "#10b981", ly: 86 },
          { x1: 127,x2: 134, label: "links", sub: "2",        color: "#94a3b8", ly: 86 },
          { x1: 138,x2: 166, label: "owner", sub: "alice",    color: "#f59e0b", ly: 86 },
          { x1: 169,x2: 193, label: "group", sub: "devs",     color: "#f59e0b", ly: 86 },
        ].map(({ x1, x2, label, color, ly }) => {
          const mid = (x1 + x2) / 2;
          return (
            <g key={label + x1}>
              <line x1={mid} y1="52" x2={mid} y2={ly - 14} stroke={color} strokeWidth="1" strokeDasharray="3 2"/>
              <text x={mid} y={ly} textAnchor="middle" fontSize="8" fontWeight="600" fill={color}>{label}</text>
            </g>
          );
        })}
        {/* Permission bit breakdown */}
        <text x="260" y="110" textAnchor="middle" fontSize="9" fontWeight="600" fill="var(--text)">Permission bits breakdown</text>
        {[
          { label: "r", name: "read",    owner: true,  group: true,  other: true,  color: "#6366f1" },
          { label: "w", name: "write",   owner: true,  group: false, other: false, color: "#f59e0b" },
          { label: "x", name: "execute", owner: true,  group: true,  other: false, color: "#10b981" },
        ].map(({ label, name, owner, group, other, color }, i) => {
          const y = 120 + i * 28;
          return (
            <g key={label}>
              <text x="30" y={y + 12} fontSize="11" fontFamily="monospace" fontWeight="700" fill={color}>{label}</text>
              <text x="50" y={y + 12} fontSize="9" fill="var(--muted)">{name}</text>
              {[
                { cx: 150, active: owner, who: "owner" },
                { cx: 270, active: group, who: "group" },
                { cx: 390, active: other, who: "other" },
              ].map(({ cx, active, who }) => (
                <g key={who}>
                  <rect x={cx - 28} y={y} width="56" height="22" rx="3"
                    fill={active ? `${color}22` : "color-mix(in oklab, var(--elevated) 60%, transparent)"}
                    stroke={active ? `${color}88` : "var(--border)"} strokeWidth="1"/>
                  <text x={cx} y={y + 15} textAnchor="middle" fontSize="9"
                    fill={active ? color : "var(--muted)"}>{active ? `${who}: ✓` : `${who}: –`}</text>
                </g>
              ))}
            </g>
          );
        })}
        {/* Octal cheatsheet */}
        <rect x="16" y="208" width="488" height="18" rx="3" fill="color-mix(in oklab, var(--elevated) 45%, transparent)" stroke="var(--border)" strokeWidth="1"/>
        <text x="30" y="221" fontSize="8.5" fill="var(--muted)">Octal: r=4  w=2  x=1 → rwx=7  r-x=5  r--=4 → chmod 754 means owner=rwx group=r-x other=r--</text>
      </svg>
      <Caption text="Each file has three permission sets (owner · group · other) × three bits (read · write · execute)" />
    </figure>
  );
}

function DnsResolutionDiagram() {
  return (
    <figure className={figClass}>
      <div className="flex flex-col gap-2 px-4 py-3 text-xs leading-relaxed text-[var(--muted)]">
        <p className="text-[var(--text)]">DNS lookup path (simplified)</p>
        <ol className="list-decimal space-y-1 pl-4 marker:text-[var(--muted)]">
          <li>Stub resolver → recursive resolver</li>
          <li>Recursive resolver queries root → TLD → authoritative</li>
          <li>Answer cached along the path for TTL</li>
        </ol>
      </div>
      <Caption text="Recursive DNS resolves names stepwise until an authoritative server answers." />
    </figure>
  );
}

function ProcessLifecycleDiagram() {
  const states = [
    { label: "Running\n(R)", x: 200, y: 50, color: "#10b981" },
    { label: "Sleeping\n(S)", x: 340, y: 130, color: "#3b82f6" },
    { label: "Stopped\n(T)", x: 60, y: 130, color: "#f59e0b" },
    { label: "Zombie\n(Z)", x: 200, y: 210, color: "#ef4444" },
  ];
  return (
    <figure className={figClass}>
      <svg viewBox="0 0 520 290" className="h-auto w-full" aria-hidden>
        <text x="260" y="16" textAnchor="middle" fontSize="10" fontWeight="600" fill="var(--text)">Linux Process Lifecycle — five states every DevOps engineer must know</text>
        {/* State boxes */}
        {states.map(({ label, x, y, color }) => (
          <g key={label}>
            <rect x={x - 40} y={y - 18} width="80" height="36" rx="6" fill={`${color}22`} stroke={color} strokeWidth="1.5"/>
            {label.split("\n").map((line, i) => (
              <text key={i} x={x} y={y - 4 + i * 13} textAnchor="middle" fontSize="9" fontWeight="600" fill={color}>{line}</text>
            ))}
          </g>
        ))}
        {/* Created → Running */}
        <line x1="60" y1="50" x2="158" y2="50" stroke="#6366f1" strokeWidth="1.2" markerEnd="url(#arr)"/>
        <rect x="5" y="40" width="50" height="20" rx="4" fill="#6366f122" stroke="#6366f166" strokeWidth="1"/>
        <text x="30" y="53" textAnchor="middle" fontSize="8" fill="#818cf8">Created</text>
        <text x="110" y="44" textAnchor="middle" fontSize="7.5" fill="var(--muted)">fork()</text>
        {/* Running → Sleeping */}
        <line x1="240" y1="68" x2="320" y2="112" stroke="#3b82f6" strokeWidth="1.2" markerEnd="url(#arr)"/>
        <text x="295" y="82" fontSize="7.5" fill="var(--muted)">I/O wait</text>
        {/* Sleeping → Running */}
        <line x1="312" y1="112" x2="232" y2="68" stroke="#10b981" strokeWidth="1.2" markerEnd="url(#arr)"/>
        <text x="255" y="102" fontSize="7.5" fill="var(--muted)">I/O done</text>
        {/* Running → Stopped */}
        <line x1="160" y1="68" x2="100" y2="112" stroke="#f59e0b" strokeWidth="1.2" markerEnd="url(#arr)"/>
        <text x="110" y="82" fontSize="7.5" fill="var(--muted)">SIGSTOP</text>
        {/* Stopped → Running */}
        <line x1="100" y1="112" x2="160" y2="68" stroke="#10b981" strokeWidth="1.2" markerEnd="url(#arr)" strokeDasharray="4 2"/>
        <text x="60" y="100" fontSize="7.5" fill="var(--muted)">SIGCONT</text>
        {/* Running → Zombie */}
        <line x1="200" y1="68" x2="200" y2="192" stroke="#ef4444" strokeWidth="1.2" markerEnd="url(#arr)"/>
        <text x="215" y="140" fontSize="7.5" fill="var(--muted)">exit()</text>
        {/* Signal table */}
        <rect x="16" y="248" width="488" height="34" rx="4" fill="color-mix(in oklab, var(--elevated) 55%, transparent)" stroke="var(--border)" strokeWidth="1"/>
        <text x="30" y="262" fontSize="8" fontWeight="600" fill="var(--text)">Key signals:</text>
        <text x="110" y="262" fontSize="8" fill="var(--muted)">SIGTERM (15) = graceful stop</text>
        <text x="270" y="262" fontSize="8" fill="var(--muted)">SIGKILL (9) = force kill</text>
        <text x="400" y="262" fontSize="8" fill="var(--muted)">SIGHUP (1) = reload</text>
        <text x="110" y="274" fontSize="8" fill="var(--muted)">SIGINT (2) = Ctrl+C</text>
        <text x="270" y="274" fontSize="8" fill="var(--muted)">SIGSTOP (19) = pause</text>
        <text x="400" y="274" fontSize="8" fill="var(--muted)">SIGCONT (18) = resume</text>
        <defs>
          <marker id="arr" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
            <path d="M0,0 L0,6 L6,3 z" fill="var(--muted)"/>
          </marker>
        </defs>
      </svg>
      <Caption text="Processes transition between states via syscalls and signals — zombie processes accumulate when a parent forgets to wait()" />
    </figure>
  );
}

function AptWorkflowDiagram() {
  const steps = [
    { x: 40, label: "apt update", sub: "fetch package index\nfrom /etc/apt/sources.list", color: "#06b6d4" },
    { x: 160, label: "apt search", sub: "filter index by\nname/description", color: "#3b82f6" },
    { x: 280, label: "apt install", sub: "resolve deps →\ndownload .deb → dpkg -i", color: "#6366f1" },
    { x: 400, label: "apt upgrade", sub: "install newer\nversions of all pkgs", color: "#10b981" },
  ];
  return (
    <figure className={figClass}>
      <svg viewBox="0 0 520 230" className="h-auto w-full" aria-hidden>
        <text x="260" y="16" textAnchor="middle" fontSize="10" fontWeight="600" fill="var(--text)">APT Package Manager — how a package goes from repo to running binary</text>
        {/* Flow boxes */}
        {steps.map(({ x, label, sub, color }, i) => (
          <g key={label}>
            <rect x={x - 50} y="32" width="100" height="50" rx="5" fill={`${color}1a`} stroke={`${color}66`} strokeWidth="1.5"/>
            <text x={x} y="53" textAnchor="middle" fontSize="9" fontWeight="700" fontFamily="monospace" fill={color}>{label}</text>
            {sub.split("\n").map((line, j) => (
              <text key={j} x={x} y={66 + j * 11} textAnchor="middle" fontSize="7.5" fill="var(--muted)">{line}</text>
            ))}
            {i < steps.length - 1 && (
              <line x1={x + 50} y1="57" x2={x + 60} y2="57" stroke="var(--muted)" strokeWidth="1.2" markerEnd="url(#arrd)"/>
            )}
          </g>
        ))}
        {/* Cache & dpkg */}
        <rect x="16" y="110" width="228" height="36" rx="4" fill="#6366f11a" stroke="#6366f155" strokeWidth="1"/>
        <text x="130" y="125" textAnchor="middle" fontSize="9" fontWeight="600" fill="#818cf8">Package Cache  /var/cache/apt/archives/</text>
        <text x="130" y="139" textAnchor="middle" fontSize="8" fill="var(--muted)">.deb files stored here before install</text>
        <rect x="260" y="110" width="244" height="36" rx="4" fill="#10b9811a" stroke="#10b98155" strokeWidth="1"/>
        <text x="382" y="125" textAnchor="middle" fontSize="9" fontWeight="600" fill="#10b981">dpkg — low-level installer</text>
        <text x="382" y="139" textAnchor="middle" fontSize="8" fill="var(--muted)">apt calls dpkg; dpkg does the actual unpack</text>
        {/* GPG key */}
        <rect x="16" y="160" width="488" height="54" rx="4" fill="color-mix(in oklab, var(--elevated) 55%, transparent)" stroke="var(--border)" strokeWidth="1"/>
        <text x="30" y="175" fontSize="9" fontWeight="600" fill="#f59e0b">Third-party repos (PPA / vendor)</text>
        <text x="30" y="189" fontSize="8" fill="var(--muted)">1. curl -fsSL https://vendor/key.gpg | gpg --dearmor | sudo tee /etc/apt/keyrings/vendor.gpg</text>
        <text x="30" y="202" fontSize="8" fill="var(--muted)">2. echo "deb [signed-by=/etc/apt/keyrings/vendor.gpg] https://vendor/apt stable main" | sudo tee /etc/apt/sources.list.d/vendor.list</text>
        <text x="30" y="213" fontSize="8" fill="var(--muted)">3. sudo apt update &amp;&amp; sudo apt install package-name</text>
        <defs>
          <marker id="arrd" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
            <path d="M0,0 L0,6 L6,3 z" fill="var(--muted)"/>
          </marker>
        </defs>
      </svg>
      <Caption text="APT is a frontend to dpkg — it resolves dependencies, fetches packages, verifies GPG signatures, then delegates unpacking to dpkg" />
    </figure>
  );
}

function BashScriptFlowDiagram() {
  const blocks = [
    { y: 30, label: "#!/usr/bin/env bash", sub: "shebang — tells kernel which interpreter to use", color: "#06b6d4" },
    { y: 80, label: "set -euo pipefail", sub: "-e exit on error  -u undefined vars are errors  -o pipefail pipe failures propagate", color: "#f59e0b" },
    { y: 130, label: "Variables & Args", sub: 'VAR="value"  $1 $2 … $@  ${VAR:-default}', color: "#3b82f6" },
    { y: 180, label: "Functions", sub: "my_fn() { local x=$1; ... }  — call like: my_fn arg", color: "#6366f1" },
    { y: 230, label: "Control flow", sub: "if/elif/else  for/while  case  [ ] vs [[ ]]", color: "#10b981" },
    { y: 280, label: "Exit codes", sub: "0 = success  non-zero = failure  $? = last exit code", color: "#ef4444" },
  ];
  return (
    <figure className={figClass}>
      <svg viewBox="0 0 520 310" className="h-auto w-full" aria-hidden>
        <text x="260" y="16" textAnchor="middle" fontSize="10" fontWeight="600" fill="var(--text)">Bash Script Anatomy — the skeleton every production script follows</text>
        {blocks.map(({ y, label, sub, color }, i) => (
          <g key={label}>
            <rect x="16" y={y} width="488" height="42" rx="4" fill={`${color}18`} stroke={`${color}66`} strokeWidth="1.2"/>
            <text x="30" y={y + 15} fontSize="9" fontWeight="700" fontFamily="monospace" fill={color}>{label}</text>
            <text x="30" y={y + 30} fontSize="8" fill="var(--muted)">{sub}</text>
            {i < blocks.length - 1 && (
              <text x="260" y={y + 50} textAnchor="middle" fontSize="10" fill="var(--muted)">↓</text>
            )}
          </g>
        ))}
      </svg>
      <Caption text="Every serious Bash script starts with a shebang + set -euo pipefail — skipping these is the most common source of silent failures in CI" />
    </figure>
  );
}

function SshKeyAuthDiagram() {
  return (
    <figure className={figClass}>
      <svg viewBox="0 0 520 250" className="h-auto w-full" aria-hidden>
        <text x="260" y="16" textAnchor="middle" fontSize="10" fontWeight="600" fill="var(--text)">SSH Key Authentication — no passwords, no MITM risk</text>
        {/* Client box */}
        <rect x="16" y="28" width="160" height="80" rx="6" fill="#3b82f61a" stroke="#3b82f666" strokeWidth="1.5"/>
        <text x="96" y="46" textAnchor="middle" fontSize="10" fontWeight="600" fill="#60a5fa">Client (your laptop)</text>
        <text x="96" y="62" textAnchor="middle" fontSize="8" fill="var(--muted)">~/.ssh/id_ed25519</text>
        <text x="96" y="75" textAnchor="middle" fontSize="8" fill="#f59e0b">private key — NEVER share</text>
        <text x="96" y="88" textAnchor="middle" fontSize="8" fill="var(--muted)">~/.ssh/id_ed25519.pub</text>
        <text x="96" y="100" textAnchor="middle" fontSize="8" fill="#10b981">public key — copy to server</text>
        {/* Server box */}
        <rect x="344" y="28" width="160" height="80" rx="6" fill="#10b9811a" stroke="#10b98166" strokeWidth="1.5"/>
        <text x="424" y="46" textAnchor="middle" fontSize="10" fontWeight="600" fill="#10b981">Server (EC2 / VPS)</text>
        <text x="424" y="62" textAnchor="middle" fontSize="8" fill="var(--muted)">~/.ssh/authorized_keys</text>
        <text x="424" y="75" textAnchor="middle" fontSize="8" fill="#10b981">stores your public key</text>
        <text x="424" y="88" textAnchor="middle" fontSize="8" fill="var(--muted)">/etc/ssh/sshd_config</text>
        <text x="424" y="100" textAnchor="middle" fontSize="8" fill="var(--muted)">PasswordAuth no</text>
        {/* Handshake steps */}
        <text x="260" y="128" textAnchor="middle" fontSize="9" fontWeight="600" fill="var(--text)">Handshake (simplified)</text>
        {[
          { label: "1. Client → Server: Hello, I want to log in as alice", dir: "→", y: 142 },
          { label: "2. Server → Client: Sign this random challenge with your private key", dir: "←", y: 156 },
          { label: "3. Client → Server: Here is the signature (private key never leaves client)", dir: "→", y: 170 },
          { label: "4. Server verifies signature using stored public key → grants shell", dir: "", y: 184 },
        ].map(({ label, dir, y }) => (
          <text key={y} x={dir === "←" ? 504 : 16} y={y} textAnchor={dir === "←" ? "end" : "start"} fontSize="8" fill="var(--muted)">{label}</text>
        ))}
        {/* ssh-copy-id hint */}
        <rect x="16" y="200" width="488" height="40" rx="4" fill="color-mix(in oklab, var(--elevated) 55%, transparent)" stroke="var(--border)" strokeWidth="1"/>
        <text x="30" y="215" fontSize="8" fontWeight="600" fill="var(--text)">Setup commands</text>
        <text x="30" y="229" fontSize="8" fontFamily="monospace" fill="#06b6d4">ssh-keygen -t ed25519 -C "you@company.com"</text>
        <text x="280" y="229" fontSize="8" fontFamily="monospace" fill="#10b981">ssh-copy-id user@server-ip</text>
      </svg>
      <Caption text="The private key signs a server-generated challenge — the server only needs your public key, so a stolen server cannot impersonate you" />
    </figure>
  );
}

function TcpHandshakeDiagram() {
  return (
    <figure className={figClass}>
      <svg viewBox="0 0 520 260" className="h-auto w-full" aria-hidden>
        <text x="260" y="16" textAnchor="middle" fontSize="10" fontWeight="600" fill="var(--text)">TCP Three-Way Handshake — before any data flows</text>
        {/* Client column */}
        <rect x="16" y="26" width="100" height="28" rx="5" fill="#3b82f61a" stroke="#3b82f666" strokeWidth="1.5"/>
        <text x="66" y="44" textAnchor="middle" fontSize="10" fontWeight="600" fill="#60a5fa">Client</text>
        <line x1="66" y1="54" x2="66" y2="230" stroke="#3b82f655" strokeWidth="1.5" strokeDasharray="4 3"/>
        {/* Server column */}
        <rect x="404" y="26" width="100" height="28" rx="5" fill="#10b9811a" stroke="#10b98166" strokeWidth="1.5"/>
        <text x="454" y="44" textAnchor="middle" fontSize="10" fontWeight="600" fill="#10b981">Server</text>
        <line x1="454" y1="54" x2="454" y2="230" stroke="#10b98155" strokeWidth="1.5" strokeDasharray="4 3"/>
        {/* SYN */}
        <line x1="66" y1="85" x2="454" y2="105" stroke="#6366f1" strokeWidth="1.5" markerEnd="url(#arre)"/>
        <text x="260" y="88" textAnchor="middle" fontSize="9" fontWeight="600" fill="#818cf8">SYN  (seq=x)</text>
        <text x="260" y="100" textAnchor="middle" fontSize="8" fill="var(--muted)">"I want to connect, my starting seq is x"</text>
        {/* SYN-ACK */}
        <line x1="454" y1="130" x2="66" y2="150" stroke="#10b981" strokeWidth="1.5" markerEnd="url(#arre2)"/>
        <text x="260" y="133" textAnchor="middle" fontSize="9" fontWeight="600" fill="#10b981">SYN-ACK  (seq=y, ack=x+1)</text>
        <text x="260" y="145" textAnchor="middle" fontSize="8" fill="var(--muted)">"OK, my seq is y, I got your x"</text>
        {/* ACK */}
        <line x1="66" y1="170" x2="454" y2="190" stroke="#f59e0b" strokeWidth="1.5" markerEnd="url(#arre3)"/>
        <text x="260" y="173" textAnchor="middle" fontSize="9" fontWeight="600" fill="#fbbf24">ACK  (ack=y+1)</text>
        <text x="260" y="185" textAnchor="middle" fontSize="8" fill="var(--muted)">"Got your y — connection established!"</text>
        {/* Data */}
        <line x1="66" y1="205" x2="454" y2="205" stroke="var(--muted)" strokeWidth="1" strokeDasharray="5 3" markerEnd="url(#arre4)"/>
        <text x="260" y="200" textAnchor="middle" fontSize="8" fill="var(--muted)">Data flows (HTTP, SSH, TLS…)</text>
        <text x="260" y="222" textAnchor="middle" fontSize="8" fill="var(--muted)">FIN → FIN-ACK → ACK  (4-way teardown)</text>
        <defs>
          <marker id="arre" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto"><path d="M0,0 L0,6 L6,3 z" fill="#818cf8"/></marker>
          <marker id="arre2" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto"><path d="M0,0 L0,6 L6,3 z" fill="#10b981"/></marker>
          <marker id="arre3" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto"><path d="M0,0 L0,6 L6,3 z" fill="#fbbf24"/></marker>
          <marker id="arre4" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto"><path d="M0,0 L0,6 L6,3 z" fill="var(--muted)"/></marker>
        </defs>
      </svg>
      <Caption text="TCP guarantees ordered, reliable delivery — the handshake establishes sequence numbers so both sides can detect lost or out-of-order packets" />
    </figure>
  );
}

function SubnetCidrDiagram() {
  return (
    <figure className={figClass}>
      <svg viewBox="0 0 520 270" className="h-auto w-full" aria-hidden>
        <text x="260" y="16" textAnchor="middle" fontSize="10" fontWeight="600" fill="var(--text)">CIDR & Subnetting — splitting 10.0.0.0/16 into /24 subnets</text>
        {/* VPC block */}
        <rect x="16" y="26" width="488" height="220" rx="8" fill="#6366f108" stroke="#6366f166" strokeWidth="1.5" strokeDasharray="6 3"/>
        <text x="36" y="44" fontSize="10" fontWeight="600" fill="#818cf8">VPC  10.0.0.0/16  — 65 534 usable hosts</text>
        {/* Public subnets */}
        {[
          { x: 30, label: "Public Subnet A", cidr: "10.0.1.0/24", hosts: "254 hosts", color: "#10b981", az: "AZ-a" },
          { x: 190, label: "Public Subnet B", cidr: "10.0.2.0/24", hosts: "254 hosts", color: "#10b981", az: "AZ-b" },
        ].map(({ x, label, cidr, hosts, color, az }) => (
          <g key={cidr}>
            <rect x={x} y="56" width="148" height="70" rx="5" fill={`${color}18`} stroke={`${color}66`} strokeWidth="1.2"/>
            <text x={x + 74} y="73" textAnchor="middle" fontSize="8.5" fontWeight="600" fill={color}>{label}</text>
            <text x={x + 74} y="87" textAnchor="middle" fontSize="9" fontFamily="monospace" fill="var(--text)">{cidr}</text>
            <text x={x + 74} y="100" textAnchor="middle" fontSize="8" fill="var(--muted)">{hosts}  ·  {az}</text>
            <text x={x + 74} y="114" textAnchor="middle" fontSize="7.5" fill={color}>Internet Gateway route</text>
          </g>
        ))}
        {/* Private subnets */}
        {[
          { x: 30, label: "Private Subnet A", cidr: "10.0.10.0/24", hosts: "254 hosts", color: "#3b82f6", az: "AZ-a" },
          { x: 190, label: "Private Subnet B", cidr: "10.0.11.0/24", hosts: "254 hosts", color: "#3b82f6", az: "AZ-b" },
        ].map(({ x, label, cidr, hosts, color, az }) => (
          <g key={cidr}>
            <rect x={x} y="140" width="148" height="70" rx="5" fill={`${color}18`} stroke={`${color}66`} strokeWidth="1.2"/>
            <text x={x + 74} y="157" textAnchor="middle" fontSize="8.5" fontWeight="600" fill={color}>{label}</text>
            <text x={x + 74} y="171" textAnchor="middle" fontSize="9" fontFamily="monospace" fill="var(--text)">{cidr}</text>
            <text x={x + 74} y="184" textAnchor="middle" fontSize="8" fill="var(--muted)">{hosts}  ·  {az}</text>
            <text x={x + 74} y="198" textAnchor="middle" fontSize="7.5" fill={color}>NAT Gateway route</text>
          </g>
        ))}
        {/* CIDR cheat table */}
        <rect x="350" y="56" width="148" height="154" rx="5" fill="color-mix(in oklab, var(--elevated) 55%, transparent)" stroke="var(--border)" strokeWidth="1"/>
        <text x="424" y="72" textAnchor="middle" fontSize="9" fontWeight="600" fill="var(--text)">CIDR Quick Reference</text>
        {[
          ["/8", "16 M hosts"],
          ["/16", "65 K hosts"],
          ["/24", "254 hosts"],
          ["/28", "14 hosts"],
          ["/30", "2 hosts"],
          ["/32", "1 host (exact IP)"],
        ].map(([cidr, hosts], i) => (
          <g key={cidr}>
            <text x="364" y={88 + i * 18} fontSize="8.5" fontFamily="monospace" fill="#06b6d4">{cidr}</text>
            <text x="410" y={88 + i * 18} fontSize="8" fill="var(--muted)">{hosts}</text>
          </g>
        ))}
        <text x="364" y="198" fontSize="8" fill="var(--muted)">Formula: 2^(32-N) - 2</text>
      </svg>
      <Caption text="A /16 gives 65 K IPs — split it into /24 blocks (254 usable each) to isolate public-facing, private, and database tiers" />
    </figure>
  );
}

function FirewallNatDiagram() {
  return (
    <figure className={figClass}>
      <svg viewBox="0 0 520 250" className="h-auto w-full" aria-hidden>
        <text x="260" y="16" textAnchor="middle" fontSize="10" fontWeight="600" fill="var(--text)">Firewall + NAT — how traffic is filtered and translated at the network edge</text>
        {/* Internet */}
        <rect x="16" y="30" width="80" height="40" rx="5" fill="#ef44441a" stroke="#ef444466" strokeWidth="1.5"/>
        <text x="56" y="52" textAnchor="middle" fontSize="10" fontWeight="600" fill="#ef4444">Internet</text>
        <text x="56" y="64" textAnchor="middle" fontSize="7.5" fill="var(--muted)">untrusted</text>
        {/* Firewall */}
        <rect x="130" y="30" width="90" height="40" rx="5" fill="#f59e0b1a" stroke="#f59e0b66" strokeWidth="1.5"/>
        <text x="175" y="49" textAnchor="middle" fontSize="9" fontWeight="600" fill="#fbbf24">Firewall</text>
        <text x="175" y="62" textAnchor="middle" fontSize="7.5" fill="var(--muted)">iptables / nftables / SG</text>
        {/* Router / NAT */}
        <rect x="260" y="30" width="90" height="40" rx="5" fill="#6366f11a" stroke="#6366f166" strokeWidth="1.5"/>
        <text x="305" y="49" textAnchor="middle" fontSize="9" fontWeight="600" fill="#818cf8">Router / NAT</text>
        <text x="305" y="62" textAnchor="middle" fontSize="7.5" fill="var(--muted)">rewrites src IP</text>
        {/* LAN */}
        <rect x="394" y="30" width="110" height="40" rx="5" fill="#10b9811a" stroke="#10b98166" strokeWidth="1.5"/>
        <text x="449" y="49" textAnchor="middle" fontSize="9" fontWeight="600" fill="#10b981">Private LAN</text>
        <text x="449" y="62" textAnchor="middle" fontSize="7.5" fill="var(--muted)">192.168.x.x / 10.x.x.x</text>
        {/* Arrows */}
        <line x1="96" y1="50" x2="130" y2="50" stroke="var(--muted)" strokeWidth="1.2" markerEnd="url(#arrf)"/>
        <line x1="220" y1="50" x2="260" y2="50" stroke="var(--muted)" strokeWidth="1.2" markerEnd="url(#arrf)"/>
        <line x1="350" y1="50" x2="394" y2="50" stroke="var(--muted)" strokeWidth="1.2" markerEnd="url(#arrf)"/>
        {/* Firewall rules */}
        <rect x="16" y="88" width="220" height="75" rx="4" fill="color-mix(in oklab, var(--elevated) 55%, transparent)" stroke="var(--border)" strokeWidth="1"/>
        <text x="30" y="104" fontSize="9" fontWeight="600" fill="#f59e0b">Firewall rules (iptables / UFW)</text>
        <text x="30" y="118" fontSize="8" fontFamily="monospace" fill="#10b981">ALLOW  443/tcp  0.0.0.0/0  (HTTPS)</text>
        <text x="30" y="131" fontSize="8" fontFamily="monospace" fill="#10b981">ALLOW  22/tcp   10.0.0.0/8  (SSH internal)</text>
        <text x="30" y="144" fontSize="8" fontFamily="monospace" fill="#ef4444">DROP   0.0.0.0/0  (default deny)</text>
        <text x="30" y="157" fontSize="7.5" fill="var(--muted)">Rules evaluated top-to-bottom; first match wins</text>
        {/* NAT */}
        <rect x="252" y="88" width="252" height="75" rx="4" fill="color-mix(in oklab, var(--elevated) 55%, transparent)" stroke="var(--border)" strokeWidth="1"/>
        <text x="266" y="104" fontSize="9" fontWeight="600" fill="#818cf8">NAT (Network Address Translation)</text>
        <text x="266" y="119" fontSize="8" fill="var(--muted)">Outbound: src 192.168.1.5:4523 → 1.2.3.4:4523</text>
        <text x="266" y="133" fontSize="8" fill="var(--muted)">  NAT rewrites to: src 203.0.113.1:4523</text>
        <text x="266" y="147" fontSize="8" fill="var(--muted)">Inbound reply: dst 203.0.113.1:4523</text>
        <text x="266" y="160" fontSize="8" fill="var(--muted)">  NAT rewrites back: dst 192.168.1.5:4523</text>
        {/* iptables chain */}
        <rect x="16" y="178" width="488" height="58" rx="4" fill="color-mix(in oklab, var(--elevated) 50%, transparent)" stroke="var(--border)" strokeWidth="1"/>
        <text x="30" y="193" fontSize="9" fontWeight="600" fill="var(--text)">iptables chain flow</text>
        {["PREROUTING", "INPUT", "FORWARD", "OUTPUT", "POSTROUTING"].map((chain, i) => (
          <g key={chain}>
            <rect x={30 + i * 96} y="200" width="88" height="28" rx="3" fill="#6366f115" stroke="#6366f144" strokeWidth="1"/>
            <text x={74 + i * 96} y="218" textAnchor="middle" fontSize="8" fill="#818cf8">{chain}</text>
            {i < 4 && <text x={124 + i * 96} y="218" fontSize="9" fill="var(--muted)">→</text>}
          </g>
        ))}
        <defs>
          <marker id="arrf" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto"><path d="M0,0 L0,6 L6,3 z" fill="var(--muted)"/></marker>
        </defs>
      </svg>
      <Caption text="Firewall decides which packets pass; NAT hides private IPs behind a single public IP — together they secure and expose only what you intend" />
    </figure>
  );
}

function NetworkDebugFlowDiagram() {
  const steps = [
    { q: "Can I reach the host?", cmd: "ping -c4 host", pass: "Layer 3 OK", fail: "routing / firewall", color: "#10b981" },
    { q: "Can I reach the port?", cmd: "nc -zv host 443\ncurl -I https://host", pass: "Layer 4 OK", fail: "port closed / firewall", color: "#3b82f6" },
    { q: "Is DNS resolving?", cmd: "dig host +short\nresolvectl query host", pass: "DNS OK", fail: "DNS misconfigured", color: "#6366f1" },
    { q: "Is the path clear?", cmd: "traceroute host\nmtr --report host", pass: "Route found", fail: "packet loss mid-path", color: "#f59e0b" },
    { q: "TLS/cert valid?", cmd: "openssl s_client -connect host:443\ncurl -v https://host", pass: "Cert OK", fail: "expired / wrong CN", color: "#06b6d4" },
  ];
  return (
    <figure className={figClass}>
      <svg viewBox="0 0 520 310" className="h-auto w-full" aria-hidden>
        <text x="260" y="16" textAnchor="middle" fontSize="10" fontWeight="600" fill="var(--text)">Network Debug Flowchart — systematic approach, bottom-up the OSI stack</text>
        {steps.map(({ q, cmd, pass, fail, color }, i) => (
          <g key={q}>
            <rect x="16" y={28 + i * 54} width="230" height="44" rx="5" fill="color-mix(in oklab, var(--elevated) 55%, transparent)" stroke="var(--border)" strokeWidth="1"/>
            <text x="26" y={46 + i * 54} fontSize="9" fontWeight="600" fill="var(--text)">{q}</text>
            {cmd.split("\n").map((line, j) => (
              <text key={j} x="26" y={59 + i * 54 + j * 10} fontSize="7.5" fontFamily="monospace" fill={color}>{line}</text>
            ))}
            <rect x="260" y={36 + i * 54} width="80" height="18" rx="3" fill={`${color}22`} stroke={`${color}66`} strokeWidth="1"/>
            <text x="300" y={48 + i * 54} textAnchor="middle" fontSize="8" fill={color}>✓ {pass}</text>
            <rect x="356" y={36 + i * 54} width="148" height="18" rx="3" fill="#ef444415" stroke="#ef444455" strokeWidth="1"/>
            <text x="430" y={48 + i * 54} textAnchor="middle" fontSize="8" fill="#ef4444">✗ → {fail}</text>
            {i < steps.length - 1 && <text x="131" y={80 + i * 54} textAnchor="middle" fontSize="10" fill="var(--muted)">↓</text>}
          </g>
        ))}
      </svg>
      <Caption text="Always debug bottom-up: physical → IP → port → DNS → app layer. Each step proves the previous layer works." />
    </figure>
  );
}

function VpnTunnelDiagram() {
  return (
    <figure className={figClass}>
      <svg viewBox="0 0 520 240" className="h-auto w-full" aria-hidden>
        <text x="260" y="16" textAnchor="middle" fontSize="10" fontWeight="600" fill="var(--text)">VPN Tunnel — encrypting traffic across an untrusted network</text>
        {/* Engineer laptop */}
        <rect x="16" y="32" width="110" height="60" rx="6" fill="#3b82f61a" stroke="#3b82f666" strokeWidth="1.5"/>
        <text x="71" y="52" textAnchor="middle" fontSize="9" fontWeight="600" fill="#60a5fa">Engineer</text>
        <text x="71" y="65" textAnchor="middle" fontSize="8" fill="var(--muted)">10.8.0.2 (VPN IP)</text>
        <text x="71" y="78" textAnchor="middle" fontSize="8" fill="var(--muted)">203.x.x.x (real IP)</text>
        <text x="71" y="91" textAnchor="middle" fontSize="7.5" fill="#3b82f6">WireGuard / OpenVPN</text>
        {/* Internet cloud */}
        <rect x="180" y="44" width="80" height="36" rx="18" fill="#ef44441a" stroke="#ef444433" strokeWidth="1"/>
        <text x="220" y="63" textAnchor="middle" fontSize="9" fill="var(--muted)">Internet</text>
        {/* VPN gateway */}
        <rect x="316" y="32" width="110" height="60" rx="6" fill="#6366f11a" stroke="#6366f166" strokeWidth="1.5"/>
        <text x="371" y="52" textAnchor="middle" fontSize="9" fontWeight="600" fill="#818cf8">VPN Gateway</text>
        <text x="371" y="65" textAnchor="middle" fontSize="8" fill="var(--muted)">10.8.0.1 (VPN IP)</text>
        <text x="371" y="78" textAnchor="middle" fontSize="8" fill="var(--muted)">54.x.x.x (public IP)</text>
        <text x="371" y="91" textAnchor="middle" fontSize="7.5" fill="#6366f1">acts as jump host</text>
        {/* Private servers */}
        <rect x="444" y="32" width="72" height="60" rx="6" fill="#10b9811a" stroke="#10b98166" strokeWidth="1.5"/>
        <text x="480" y="52" textAnchor="middle" fontSize="9" fontWeight="600" fill="#10b981">Private</text>
        <text x="480" y="64" textAnchor="middle" fontSize="9" fontWeight="600" fill="#10b981">Servers</text>
        <text x="480" y="77" textAnchor="middle" fontSize="8" fill="var(--muted)">10.0.0.0/8</text>
        <text x="480" y="89" textAnchor="middle" fontSize="7.5" fill="var(--muted)">no public IP</text>
        {/* Encrypted tunnel arc */}
        <path d="M 126 62 Q 220 20 314 62" fill="none" stroke="#6366f1" strokeWidth="2" strokeDasharray="6 3"/>
        <text x="220" y="30" textAnchor="middle" fontSize="8" fontWeight="600" fill="#818cf8">Encrypted tunnel  (UDP 51820)</text>
        <text x="220" y="42" textAnchor="middle" fontSize="7.5" fill="var(--muted)">plaintext packets wrapped in WireGuard frames</text>
        {/* Internal arrow */}
        <line x1="426" y1="62" x2="444" y2="62" stroke="#10b981" strokeWidth="1.2" markerEnd="url(#arrvpn)"/>
        <text x="435" y="57" textAnchor="middle" fontSize="7.5" fill="var(--muted)">LAN</text>
        {/* SSH jump box note */}
        <rect x="16" y="112" width="488" height="55" rx="4" fill="color-mix(in oklab, var(--elevated) 55%, transparent)" stroke="var(--border)" strokeWidth="1"/>
        <text x="30" y="128" fontSize="9" fontWeight="600" fill="var(--text)">SSH Jump Host (alternative to VPN)</text>
        <text x="30" y="142" fontSize="8" fontFamily="monospace" fill="#06b6d4">ssh -J bastion.company.com user@private-server-10.0.1.5</text>
        <text x="30" y="156" fontSize="8" fill="var(--muted)">~/.ssh/config:  Host private-*  ProxyJump bastion.company.com  — jump transparently through the bastion</text>
        {/* Port forwarding */}
        <rect x="16" y="180" width="488" height="48" rx="4" fill="color-mix(in oklab, var(--elevated) 50%, transparent)" stroke="var(--border)" strokeWidth="1"/>
        <text x="30" y="196" fontSize="9" fontWeight="600" fill="var(--text)">SSH Local Port Forwarding</text>
        <text x="30" y="210" fontSize="8" fontFamily="monospace" fill="#06b6d4">ssh -L 5432:db.internal:5432 user@bastion</text>
        <text x="30" y="222" fontSize="8" fill="var(--muted)">Now localhost:5432 tunnels through bastion to the private database — psql -h localhost works</text>
        <defs>
          <marker id="arrvpn" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto"><path d="M0,0 L0,6 L6,3 z" fill="#10b981"/></marker>
        </defs>
      </svg>
      <Caption text="VPN wraps packets in an encrypted tunnel so private servers never need a public IP — SSH jump hosts achieve the same without VPN software" />
    </figure>
  );
}

function GitThreeAreasDiagram() {
  const areas = [
    { x: 16, label: "Working Tree", sub: "your editor\nuntracked &\nmodified files", color: "#f59e0b", cmd: "git add <file>" },
    { x: 186, label: "Staging Area\n(Index)", sub: "snapshot of\nwhat your next\ncommit will be", color: "#6366f1", cmd: "git commit" },
    { x: 356, label: "Repository\n(.git/objects)", sub: "compressed\ncommit history\nSHA-1 addressed", color: "#10b981", cmd: "git push" },
  ];
  return (
    <figure className={figClass}>
      <svg viewBox="0 0 520 240" className="h-auto w-full" aria-hidden>
        <text x="260" y="16" textAnchor="middle" fontSize="10" fontWeight="600" fill="var(--text)">Git Three Areas — every git command moves content between these</text>
        {areas.map(({ x, label, sub, color, cmd }, i) => (
          <g key={label}>
            <rect x={x} y="26" width="148" height="110" rx="6" fill={`${color}1a`} stroke={`${color}66`} strokeWidth="1.5"/>
            {label.split("\n").map((line, j) => (
              <text key={j} x={x + 74} y={46 + j * 13} textAnchor="middle" fontSize="10" fontWeight="600" fill={color}>{line}</text>
            ))}
            {sub.split("\n").map((line, j) => (
              <text key={j} x={x + 74} y={78 + j * 12} textAnchor="middle" fontSize="8" fill="var(--muted)">{line}</text>
            ))}
            {i < areas.length - 1 && (
              <g>
                <line x1={x + 148} y1="81" x2={x + 186} y2="81" stroke="var(--muted)" strokeWidth="1.2" markerEnd="url(#arrg)"/>
                <text x={x + 167} y="74" textAnchor="middle" fontSize="8" fontFamily="monospace" fill="var(--text)">{cmd}</text>
              </g>
            )}
          </g>
        ))}
        {/* Remote */}
        <rect x="16" y="156" width="488" height="28" rx="5" fill="#3b82f61a" stroke="#3b82f666" strokeWidth="1.2" strokeDasharray="5 3"/>
        <text x="260" y="173" textAnchor="middle" fontSize="9" fontWeight="600" fill="#60a5fa">Remote  (GitHub / GitLab)  ← git push  ·  git pull / git fetch + merge</text>
        {/* Reverse arrows */}
        <text x="260" y="204" textAnchor="middle" fontSize="9" fontWeight="600" fill="var(--text)">Going backward</text>
        <text x="260" y="218" textAnchor="middle" fontSize="8" fill="var(--muted)">git restore &lt;file&gt; — discard working tree changes  ·  git restore --staged &lt;file&gt; — unstage  ·  git reset HEAD~1 — undo commit</text>
        <defs>
          <marker id="arrg" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto"><path d="M0,0 L0,6 L6,3 z" fill="var(--muted)"/></marker>
        </defs>
      </svg>
      <Caption text="Understanding the three areas explains every confusing git command — files must pass through staging before they can be committed" />
    </figure>
  );
}

function GitBranchingDiagram() {
  return (
    <figure className={figClass}>
      <svg viewBox="0 0 520 260" className="h-auto w-full" aria-hidden>
        <text x="260" y="16" textAnchor="middle" fontSize="10" fontWeight="600" fill="var(--text)">GitHub Flow — the simplest branching model that ships daily</text>
        {/* Main branch line */}
        <line x1="30" y1="80" x2="490" y2="80" stroke="#10b981" strokeWidth="2.5"/>
        <text x="10" y="84" fontSize="8" fontWeight="600" fill="#10b981">main</text>
        {/* Commits on main */}
        {[60, 130, 430, 490].map((x) => (
          <circle key={x} cx={x} cy="80" r="6" fill="#10b981"/>
        ))}
        <text x="60" y="98" textAnchor="middle" fontSize="7.5" fill="var(--muted)">initial</text>
        <text x="430" y="98" textAnchor="middle" fontSize="7.5" fill="var(--muted)">merge</text>
        <text x="490" y="98" textAnchor="middle" fontSize="7.5" fill="var(--muted)">deploy</text>
        {/* Feature branch */}
        <path d="M 130 80 Q 170 80 200 130" fill="none" stroke="#6366f1" strokeWidth="2"/>
        <line x1="200" y1="130" x2="380" y2="130" stroke="#6366f1" strokeWidth="2"/>
        <path d="M 380 130 Q 410 130 430 80" fill="none" stroke="#6366f1" strokeWidth="2"/>
        <text x="135" y="118" fontSize="8" fill="#818cf8">branch off</text>
        {[200, 280, 380].map((x, i) => (
          <circle key={x} cx={x} cy="130" r="5" fill="#6366f1"/>
        ))}
        <text x="180" y="148" textAnchor="middle" fontSize="7.5" fill="var(--muted)">commit</text>
        <text x="280" y="148" textAnchor="middle" fontSize="7.5" fill="var(--muted)">commit</text>
        <text x="380" y="148" textAnchor="middle" fontSize="7.5" fill="var(--muted)">commit</text>
        <rect x="200" y="153" width="180" height="18" rx="3" fill="#6366f11a" stroke="#6366f155" strokeWidth="1"/>
        <text x="290" y="165" textAnchor="middle" fontSize="8" fill="#818cf8">feat/user-auth  (PR → code review → CI)</text>
        {/* Rules */}
        <rect x="16" y="186" width="488" height="66" rx="4" fill="color-mix(in oklab, var(--elevated) 55%, transparent)" stroke="var(--border)" strokeWidth="1"/>
        <text x="30" y="202" fontSize="9" fontWeight="600" fill="var(--text)">GitHub Flow rules</text>
        {[
          "1. main is always deployable",
          "2. branch from main with a descriptive name (feat/x, fix/y, chore/z)",
          "3. commit early and often — small commits are easier to review",
          "4. open a PR when ready for review (or as draft for early feedback)",
          "5. merge only after CI passes and at least one approval",
          "6. deploy immediately after merge to main",
        ].map((rule, i) => (
          <text key={rule} x="30" y={215 + i * 12} fontSize="7.5" fill="var(--muted)">{rule}</text>
        ))}
      </svg>
      <Caption text="GitHub Flow's strength is simplicity — main is always green, every change is a PR, and deployment is automatic on merge" />
    </figure>
  );
}

function SemverDiagram() {
  return (
    <figure className={figClass}>
      <svg viewBox="0 0 520 250" className="h-auto w-full" aria-hidden>
        <text x="260" y="16" textAnchor="middle" fontSize="10" fontWeight="600" fill="var(--text)">Semantic Versioning — what each number communicates to your users</text>
        {/* Version label */}
        <text x="260" y="54" textAnchor="middle" fontSize="36" fontWeight="700" fontFamily="monospace" fill="var(--text)">2 . 14 . 3</text>
        {/* Brackets */}
        <line x1="166" y1="60" x2="166" y2="78" stroke="#ef4444" strokeWidth="1.5"/>
        <line x1="166" y1="78" x2="200" y2="78" stroke="#ef4444" strokeWidth="1.5"/>
        <text x="183" y="93" textAnchor="middle" fontSize="9" fontWeight="700" fill="#ef4444">MAJOR</text>
        <text x="183" y="106" textAnchor="middle" fontSize="8" fill="var(--muted)">breaking change</text>
        <text x="183" y="118" textAnchor="middle" fontSize="8" fill="var(--muted)">bump when API</text>
        <text x="183" y="130" textAnchor="middle" fontSize="8" fill="var(--muted)">is incompatible</text>

        <line x1="260" y1="60" x2="260" y2="78" stroke="#f59e0b" strokeWidth="1.5"/>
        <text x="260" y="93" textAnchor="middle" fontSize="9" fontWeight="700" fill="#f59e0b">MINOR</text>
        <text x="260" y="106" textAnchor="middle" fontSize="8" fill="var(--muted)">new feature</text>
        <text x="260" y="118" textAnchor="middle" fontSize="8" fill="var(--muted)">backwards</text>
        <text x="260" y="130" textAnchor="middle" fontSize="8" fill="var(--muted)">compatible</text>

        <line x1="354" y1="60" x2="354" y2="78" stroke="#10b981" strokeWidth="1.5"/>
        <line x1="316" y1="78" x2="354" y2="78" stroke="#10b981" strokeWidth="1.5"/>
        <text x="335" y="93" textAnchor="middle" fontSize="9" fontWeight="700" fill="#10b981">PATCH</text>
        <text x="335" y="106" textAnchor="middle" fontSize="8" fill="var(--muted)">bug fix</text>
        <text x="335" y="118" textAnchor="middle" fontSize="8" fill="var(--muted)">backwards</text>
        <text x="335" y="130" textAnchor="middle" fontSize="8" fill="var(--muted)">compatible</text>

        {/* Decision table */}
        <rect x="16" y="148" width="488" height="90" rx="4" fill="color-mix(in oklab, var(--elevated) 55%, transparent)" stroke="var(--border)" strokeWidth="1"/>
        <text x="30" y="165" fontSize="9" fontWeight="600" fill="var(--text)">When to bump</text>
        {[
          ["Change type", "Version bump", "Example", "#ef4444"],
          ["Remove / rename public API, break compat", "MAJOR  2.x.x → 3.0.0", "Delete endpoint, rename param", "#ef4444"],
          ["Add feature without breaking existing code", "MINOR  2.13.x → 2.14.0", "New /api/v2/upload route", "#f59e0b"],
          ["Fix bug with no API change", "PATCH  2.14.2 → 2.14.3", "Fix null-pointer in auth", "#10b981"],
          ["Pre-release / RC", "MAJOR.MINOR.PATCH-rc.1", "2.14.0-rc.1", "#06b6d4"],
        ].map(([change, bump, ex, color], i) => (
          <g key={change}>
            <text x="30" y={178 + i * 13} fontSize="8" fill={i === 0 ? "var(--text)" : "var(--muted)"}>{change}</text>
            <text x="266" y={178 + i * 13} fontSize="8" fontFamily="monospace" fill={i === 0 ? "var(--text)" : color}>{bump}</text>
            <text x="420" y={178 + i * 13} fontSize="7.5" fill="var(--muted)">{ex}</text>
          </g>
        ))}
      </svg>
      <Caption text="SemVer lets users know instantly whether an upgrade is safe — PATCH is always safe, MINOR adds features, MAJOR may break your code" />
    </figure>
  );
}

function GitHooksDiagram() {
  const hooks = [
    { name: "pre-commit", trigger: "git commit", side: "client", use: "lint, format, secret scan", color: "#10b981" },
    { name: "commit-msg", trigger: "after editor", side: "client", use: "enforce Conventional Commits", color: "#06b6d4" },
    { name: "pre-push", trigger: "git push", side: "client", use: "run tests before push", color: "#3b82f6" },
    { name: "pre-receive", trigger: "on server", side: "server", use: "policy enforcement, branch protection", color: "#6366f1" },
    { name: "post-receive", trigger: "after push accepted", side: "server", use: "trigger CI, send Slack notification", color: "#f59e0b" },
  ];
  return (
    <figure className={figClass}>
      <svg viewBox="0 0 520 300" className="h-auto w-full" aria-hidden>
        <text x="260" y="16" textAnchor="middle" fontSize="10" fontWeight="600" fill="var(--text)">Git Hook Lifecycle — automate checks at key points in the git workflow</text>
        {/* Timeline bar */}
        <line x1="30" y1="50" x2="490" y2="50" stroke="var(--border)" strokeWidth="1.5"/>
        {[
          { x: 90, label: "edit\ncode" },
          { x: 195, label: "git\ncommit" },
          { x: 300, label: "message\neditor" },
          { x: 400, label: "git\npush" },
          { x: 490, label: "server\naccepts" },
        ].map(({ x, label }) => (
          <g key={x}>
            <circle cx={x} cy="50" r="5" fill="var(--muted)"/>
            {label.split("\n").map((line, j) => (
              <text key={j} x={x} y={62 + j * 11} textAnchor="middle" fontSize="8" fill="var(--muted)">{line}</text>
            ))}
          </g>
        ))}
        {/* Hook entries */}
        {hooks.map(({ name, trigger, use, color }, i) => (
          <g key={name}>
            <rect x="16" y={96 + i * 40} width="488" height="32" rx="4" fill={`${color}12`} stroke={`${color}55`} strokeWidth="1"/>
            <rect x="16" y={96 + i * 40} width="130" height="32" rx="4" fill={`${color}22`} stroke={`${color}66`} strokeWidth="1"/>
            <text x="30" y={116 + i * 40} fontSize="9" fontWeight="700" fontFamily="monospace" fill={color}>{name}</text>
            <text x="155" y={109 + i * 40} fontSize="8" fill="var(--muted)">trigger: {trigger}</text>
            <text x="155" y={122 + i * 40} fontSize="8" fill="var(--text)">{use}</text>
          </g>
        ))}
      </svg>
      <Caption text="Client hooks live in .git/hooks/ and are not committed — use the pre-commit framework or Husky to share them with your team" />
    </figure>
  );
}

function MonorepoStructureDiagram() {
  return (
    <figure className={figClass}>
      <svg viewBox="0 0 520 270" className="h-auto w-full" aria-hidden>
        <text x="260" y="16" textAnchor="middle" fontSize="10" fontWeight="600" fill="var(--text)">Monorepo vs Multi-repo — trade-offs at a glance</text>
        {/* Monorepo */}
        <rect x="16" y="28" width="230" height="170" rx="6" fill="#6366f108" stroke="#6366f166" strokeWidth="1.5"/>
        <text x="131" y="46" textAnchor="middle" fontSize="10" fontWeight="600" fill="#818cf8">Monorepo</text>
        <text x="131" y="58" textAnchor="middle" fontSize="8" fill="var(--muted)">one repo, many packages</text>
        <text x="30" y="68" fontSize="8" fontFamily="monospace" fill="var(--muted)">repo/</text>
        {["  apps/web", "  apps/api", "  apps/mobile", "  packages/ui", "  packages/utils", "  packages/config", "  turbo.json / nx.json"].map((line, i) => (
          <text key={line} x="30" y={80 + i * 12} fontSize="8" fontFamily="monospace" fill={line.includes("packages") ? "#06b6d4" : line.includes("apps") ? "#10b981" : "#f59e0b"}>{line}</text>
        ))}
        {[
          ["✓", "atomic cross-service commits", "#10b981"],
          ["✓", "shared tooling & config", "#10b981"],
          ["✓", "easy code sharing", "#10b981"],
          ["✗", "slow CI without affected builds", "#ef4444"],
          ["✗", "steep initial tooling setup", "#ef4444"],
        ].map(([icon, text, color], i) => (
          <text key={text} x="30" y={174 + i * 13} fontSize="8" fill={color}>{icon} {text}</text>
        ))}
        {/* Multi-repo */}
        <rect x="274" y="28" width="230" height="170" rx="6" fill="#3b82f608" stroke="#3b82f666" strokeWidth="1.5"/>
        <text x="389" y="46" textAnchor="middle" fontSize="10" fontWeight="600" fill="#60a5fa">Multi-repo</text>
        <text x="389" y="58" textAnchor="middle" fontSize="8" fill="var(--muted)">one repo per service</text>
        {["org/web-app", "org/api-service", "org/mobile-app", "org/design-system", "org/shared-utils"].map((repo, i) => (
          <g key={repo}>
            <rect x="288" y={70 + i * 22} width="202" height="18" rx="3" fill="#3b82f61a" stroke="#3b82f655" strokeWidth="1"/>
            <text x="300" y={83 + i * 22} fontSize="8" fontFamily="monospace" fill="#60a5fa">{repo}</text>
          </g>
        ))}
        {[
          ["✓", "independent versioning & deploy", "#10b981"],
          ["✓", "clear ownership per team", "#10b981"],
          ["✗", "cross-repo changes need multiple PRs", "#ef4444"],
          ["✗", "dependency drift over time", "#ef4444"],
        ].map(([icon, text, color], i) => (
          <text key={text} x="288" y={186 + i * 13} fontSize="8" fill={color}>{icon} {text}</text>
        ))}
        {/* Turborepo hint */}
        <rect x="16" y="212" width="488" height="44" rx="4" fill="color-mix(in oklab, var(--elevated) 55%, transparent)" stroke="var(--border)" strokeWidth="1"/>
        <text x="30" y="228" fontSize="9" fontWeight="600" fill="var(--text)">Turborepo — remote caching + affected builds for monorepos</text>
        <text x="30" y="242" fontSize="8" fontFamily="monospace" fill="#f59e0b">turbo run build --filter=...HEAD~1</text>
        <text x="230" y="242" fontSize="8" fill="var(--muted)"> — only rebuild packages changed since last commit</text>
        <text x="30" y="254" fontSize="8" fontFamily="monospace" fill="#06b6d4">npx turbo run lint test build</text>
        <text x="195" y="254" fontSize="8" fill="var(--muted)"> — runs tasks in parallel with dependency awareness</text>
      </svg>
      <Caption text="Monorepos win on code sharing and atomic commits; multi-repo wins on autonomy — Turborepo/Nx make monorepos scale by skipping unchanged packages" />
    </figure>
  );
}

function MergeConflictDiagram() {
  return (
    <figure className={figClass}>
      <svg viewBox="0 0 520 270" className="h-auto w-full" aria-hidden>
        <text x="260" y="16" textAnchor="middle" fontSize="10" fontWeight="600" fill="var(--text)">Three-Way Merge — how git finds and marks conflicts</text>
        {/* Base */}
        <rect x="186" y="28" width="148" height="54" rx="5" fill="color-mix(in oklab, var(--elevated) 60%, transparent)" stroke="var(--border)" strokeWidth="1.5"/>
        <text x="260" y="45" textAnchor="middle" fontSize="9" fontWeight="600" fill="var(--muted)">Common Ancestor</text>
        <text x="260" y="59" textAnchor="middle" fontSize="8" fontFamily="monospace" fill="var(--muted)">const timeout = 5000;</text>
        <text x="260" y="71" textAnchor="middle" fontSize="7.5" fill="var(--muted)">(the base / merge-base)</text>
        {/* Branch lines */}
        <line x1="186" y1="82" x2="116" y2="110" stroke="var(--muted)" strokeWidth="1" strokeDasharray="4 2"/>
        <line x1="334" y1="82" x2="404" y2="110" stroke="var(--muted)" strokeWidth="1" strokeDasharray="4 2"/>
        {/* Ours */}
        <rect x="16" y="110" width="200" height="62" rx="5" fill="#3b82f61a" stroke="#3b82f666" strokeWidth="1.5"/>
        <text x="116" y="127" textAnchor="middle" fontSize="9" fontWeight="600" fill="#60a5fa">Ours  (HEAD / main)</text>
        <text x="116" y="141" textAnchor="middle" fontSize="8" fontFamily="monospace" fill="#60a5fa">const timeout = 3000;</text>
        <text x="116" y="154" textAnchor="middle" fontSize="7.5" fill="var(--muted)">Alice changed to 3 s</text>
        <text x="116" y="166" textAnchor="middle" fontSize="7.5" fill="var(--muted)">for faster failure detection</text>
        {/* Theirs */}
        <rect x="304" y="110" width="200" height="62" rx="5" fill="#10b9811a" stroke="#10b98166" strokeWidth="1.5"/>
        <text x="404" y="127" textAnchor="middle" fontSize="9" fontWeight="600" fill="#10b981">Theirs  (feature branch)</text>
        <text x="404" y="141" textAnchor="middle" fontSize="8" fontFamily="monospace" fill="#10b981">const timeout = 10000;</text>
        <text x="404" y="154" textAnchor="middle" fontSize="7.5" fill="var(--muted)">Bob changed to 10 s</text>
        <text x="404" y="166" textAnchor="middle" fontSize="7.5" fill="var(--muted)">for slow network tolerance</text>
        {/* Merge arrows */}
        <line x1="116" y1="172" x2="210" y2="198" stroke="#3b82f6" strokeWidth="1.2" markerEnd="url(#arrm)"/>
        <line x1="404" y1="172" x2="310" y2="198" stroke="#10b981" strokeWidth="1.2" markerEnd="url(#arrm)"/>
        {/* Conflict result */}
        <rect x="80" y="198" width="360" height="58" rx="5" fill="#ef44441a" stroke="#ef444466" strokeWidth="1.5"/>
        <text x="260" y="214" textAnchor="middle" fontSize="8.5" fontWeight="600" fill="#ef4444">Conflict markers in file</text>
        <text x="96" y="228" fontSize="7.5" fontFamily="monospace" fill="#60a5fa">{"<<<<<<< HEAD"}</text>
        <text x="96" y="239" fontSize="7.5" fontFamily="monospace" fill="#60a5fa">{"const timeout = 3000;"}</text>
        <text x="96" y="250" fontSize="7.5" fontFamily="monospace" fill="var(--muted)">{"======="}</text>
        <text x="96" y="261" fontSize="7.5" fontFamily="monospace" fill="#10b981">{"const timeout = 10000; >>>>>>> feature/bob"}</text>
        <defs>
          <marker id="arrm" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto"><path d="M0,0 L0,6 L6,3 z" fill="var(--muted)"/></marker>
        </defs>
      </svg>
      <Caption text="Git compares both branches against their common ancestor — if both changed the same line differently, you get a conflict marker to resolve manually" />
    </figure>
  );
}

function LogParsingDiagram() {
  const steps = [
    { x: 30, label: "App / Service", sub: "writes stdout\nor log file", color: "#3b82f6" },
    { x: 155, label: "Log File", sub: "app.log\naccess.log", color: "#6366f1" },
    { x: 280, label: "Python Parser", sub: "json.loads()\nre.compile()\ncsv.DictReader()", color: "#f59e0b" },
    { x: 405, label: "Structured\nOutput", sub: "JSON / CSV\nmetrics / alerts", color: "#10b981" },
  ];
  return (
    <figure className={figClass}>
      <svg viewBox="0 0 520 260" className="h-auto w-full" aria-hidden>
        <text x="260" y="16" textAnchor="middle" fontSize="10" fontWeight="600" fill="var(--text)">Log Parsing Pipeline — from raw log bytes to actionable structured data</text>
        {steps.map(({ x, label, sub, color }, i) => (
          <g key={label}>
            <rect x={x} y="28" width="110" height="62" rx="6" fill={`${color}1a`} stroke={`${color}66`} strokeWidth="1.5"/>
            {label.split("\n").map((line, j) => (
              <text key={j} x={x + 55} y={47 + j * 13} textAnchor="middle" fontSize="9" fontWeight="600" fill={color}>{line}</text>
            ))}
            {sub.split("\n").map((line, j) => (
              <text key={j} x={x + 55} y={72 + j * 11} textAnchor="middle" fontSize="7.5" fontFamily="monospace" fill="var(--muted)">{line}</text>
            ))}
            {i < steps.length - 1 && (
              <line x1={x + 110} y1="59" x2={x + 125} y2="59" stroke="var(--muted)" strokeWidth="1.2" markerEnd="url(#arrlp)"/>
            )}
          </g>
        ))}
        {/* Format examples */}
        <rect x="16" y="108" width="488" height="130" rx="4" fill="color-mix(in oklab, var(--elevated) 55%, transparent)" stroke="var(--border)" strokeWidth="1"/>
        <text x="30" y="124" fontSize="9" fontWeight="600" fill="var(--text)">Log formats you will encounter</text>
        {[
          { format: "JSON Lines  (structured — easiest to parse)", ex: '{"ts":"2024-01-01T10:00:00Z","level":"ERROR","msg":"timeout","duration_ms":3001}', color: "#10b981" },
          { format: "nginx access log  (combined format)", ex: '192.168.1.5 - - [01/Jan/2024:10:00:00 +0000] "GET /api/health HTTP/1.1" 200 42', color: "#3b82f6" },
          { format: "syslog", ex: "Jan  1 10:00:00 server sshd[1234]: Accepted publickey for alice from 10.0.0.5", color: "#6366f1" },
          { format: "CSV  (export / report format)", ex: "timestamp,level,service,message\n2024-01-01,ERROR,api,connection refused", color: "#f59e0b" },
        ].map(({ format, ex, color }, i) => (
          <g key={format}>
            <text x="30" y={140 + i * 26} fontSize="8" fontWeight="600" fill={color}>{format}</text>
            <text x="30" y={152 + i * 26} fontSize="7.5" fontFamily="monospace" fill="var(--muted)">{ex}</text>
          </g>
        ))}
        <defs>
          <marker id="arrlp" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto"><path d="M0,0 L0,6 L6,3 z" fill="var(--muted)"/></marker>
        </defs>
      </svg>
      <Caption text="Parse logs bottom-up: detect format first, then extract fields — JSON logs require zero regex while combined format needs a single re.compile() pattern" />
    </figure>
  );
}

function Boto3WorkflowDiagram() {
  const services = [
    { label: "S3", sub: "upload/download\nlist objects\npresigned URLs", color: "#10b981", x: 340, y: 36 },
    { label: "EC2", sub: "describe instances\nstart/stop/terminate\nfilter by tags", color: "#3b82f6", x: 340, y: 116 },
    { label: "IAM", sub: "list users\ncreate roles\nattach policies", color: "#6366f1", x: 340, y: 196 },
  ];
  return (
    <figure className={figClass}>
      <svg viewBox="0 0 520 270" className="h-auto w-full" aria-hidden>
        <text x="260" y="16" textAnchor="middle" fontSize="10" fontWeight="600" fill="var(--text)">boto3 Architecture — session → client/resource → AWS service APIs</text>
        {/* Local machine */}
        <rect x="16" y="28" width="290" height="220" rx="8" fill="#f59e0b08" stroke="#f59e0b44" strokeWidth="1.5" strokeDasharray="5 3"/>
        <text x="30" y="46" fontSize="8.5" fontWeight="600" fill="#fbbf24">Your Python script / Lambda / EC2</text>
        {/* Session */}
        <rect x="28" y="54" width="130" height="36" rx="5" fill="#f59e0b1a" stroke="#f59e0b66" strokeWidth="1.2"/>
        <text x="93" y="69" textAnchor="middle" fontSize="9" fontWeight="600" fill="#fbbf24">boto3.Session()</text>
        <text x="93" y="82" textAnchor="middle" fontSize="7.5" fill="var(--muted)">region · profile · role</text>
        {/* Client */}
        <rect x="28" y="106" width="120" height="36" rx="5" fill="#3b82f61a" stroke="#3b82f666" strokeWidth="1.2"/>
        <text x="88" y="122" textAnchor="middle" fontSize="9" fontWeight="600" fill="#60a5fa">client('s3')</text>
        <text x="88" y="135" textAnchor="middle" fontSize="7.5" fill="var(--muted)">low-level, 1:1 API</text>
        {/* Resource */}
        <rect x="162" y="106" width="120" height="36" rx="5" fill="#10b9811a" stroke="#10b98166" strokeWidth="1.2"/>
        <text x="222" y="122" textAnchor="middle" fontSize="9" fontWeight="600" fill="#10b981">resource('ec2')</text>
        <text x="222" y="135" textAnchor="middle" fontSize="7.5" fill="var(--muted)">OOP wrapper</text>
        {/* Credentials note */}
        <rect x="28" y="158" width="254" height="72" rx="4" fill="color-mix(in oklab, var(--elevated) 60%, transparent)" stroke="var(--border)" strokeWidth="1"/>
        <text x="42" y="173" fontSize="8.5" fontWeight="600" fill="var(--text)">Credential resolution order (never hardcode!)</text>
        {["1. Env vars: AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY", "2. ~/.aws/credentials profile", "3. EC2/ECS instance metadata (IAM role) ← best for AWS", "4. AWS SSO / web identity token"].map((line, i) => (
          <text key={line} x="42" y={186 + i * 11} fontSize="7.5" fill="var(--muted)">{line}</text>
        ))}
        {/* AWS cloud */}
        {services.map(({ label, sub, color, x, y }) => (
          <g key={label}>
            <rect x={x} y={y} width="164" height="68" rx="5" fill={`${color}18`} stroke={`${color}66`} strokeWidth="1.5"/>
            <text x={x + 82} y={y + 18} textAnchor="middle" fontSize="10" fontWeight="700" fill={color}>{label}</text>
            {sub.split("\n").map((line, j) => (
              <text key={j} x={x + 82} y={y + 32 + j * 12} textAnchor="middle" fontSize="7.5" fill="var(--muted)">{line}</text>
            ))}
          </g>
        ))}
        {/* Arrows */}
        <line x1="306" y1="90" x2="338" y2="65" stroke="#f59e0b" strokeWidth="1" strokeDasharray="4 2" markerEnd="url(#arrboto)"/>
        <line x1="306" y1="115" x2="338" y2="145" stroke="#3b82f6" strokeWidth="1" strokeDasharray="4 2" markerEnd="url(#arrboto)"/>
        <line x1="282" y1="200" x2="338" y2="225" stroke="#6366f1" strokeWidth="1" strokeDasharray="4 2" markerEnd="url(#arrboto)"/>
        <text x="320" y="8" textAnchor="middle" fontSize="8" fill="var(--muted)">AWS Cloud</text>
        <defs>
          <marker id="arrboto" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto"><path d="M0,0 L0,6 L6,3 z" fill="var(--muted)"/></marker>
        </defs>
      </svg>
      <Caption text="boto3 Session is the root object — create one per region/profile, derive clients and resources from it, never call boto3.client() at module level" />
    </figure>
  );
}

function CliToolDiagram() {
  const frameworks = [
    { name: "argparse", lines: "~40 lines", pro: "Zero deps, always available", con: "Verbose, boilerplate-heavy", color: "#6366f1" },
    { name: "Click", lines: "~20 lines", pro: "Decorator-based, readable", con: "Needs install, no type hints", color: "#3b82f6" },
    { name: "Typer", lines: "~12 lines", pro: "Type hints → CLI, best DX", con: "Newest — requires Python 3.7+", color: "#10b981" },
  ];
  return (
    <figure className={figClass}>
      <svg viewBox="0 0 520 270" className="h-auto w-full" aria-hidden>
        <text x="260" y="16" textAnchor="middle" fontSize="10" fontWeight="600" fill="var(--text)">Python CLI Tool — from argv to production-grade command-line tool</text>
        {/* Input → Parser → Handler → Output */}
        {[
          { x: 16, label: "User input", sub: "python deploy.py\nstart --env prod\n--region us-east-1", color: "#f59e0b" },
          { x: 146, label: "Arg parser", sub: "argparse / Click\n/ Typer validates\ntypes & choices", color: "#6366f1" },
          { x: 276, label: "Command\nhandler", sub: "business logic\nboto3 / subprocess\nlogging", color: "#3b82f6" },
          { x: 406, label: "Output", sub: "stdout / stderr\nexit code 0 / 1\n--output json", color: "#10b981" },
        ].map(({ x, label, sub, color }, i) => (
          <g key={label}>
            <rect x={x} y="26" width="114" height="72" rx="5" fill={`${color}18`} stroke={`${color}66`} strokeWidth="1.5"/>
            {label.split("\n").map((line, j) => (
              <text key={j} x={x + 57} y={45 + j * 13} textAnchor="middle" fontSize="9" fontWeight="600" fill={color}>{line}</text>
            ))}
            {sub.split("\n").map((line, j) => (
              <text key={j} x={x + 57} y={71 + j * 11} textAnchor="middle" fontSize="7.5" fill="var(--muted)">{line}</text>
            ))}
            {i < 3 && <line x1={x + 114} y1="62" x2={x + 126} y2="62" stroke="var(--muted)" strokeWidth="1.2" markerEnd="url(#arrcli)"/>}
          </g>
        ))}
        {/* Framework comparison */}
        <text x="260" y="118" textAnchor="middle" fontSize="9" fontWeight="600" fill="var(--text)">Framework comparison — same deploy CLI</text>
        {frameworks.map(({ name, lines, pro, con, color }, i) => (
          <g key={name}>
            <rect x="16" y={128 + i * 42} width="488" height="36" rx="4" fill={`${color}10`} stroke={`${color}44`} strokeWidth="1"/>
            <rect x="16" y={128 + i * 42} width="72" height="36" rx="4" fill={`${color}22`} stroke={`${color}66`} strokeWidth="1"/>
            <text x="52" y={150 + i * 42} textAnchor="middle" fontSize="9" fontWeight="700" fill={color}>{name}</text>
            <text x="96" y={142 + i * 42} fontSize="8" fontFamily="monospace" fill="var(--muted)">{lines}</text>
            <text x="96" y={155 + i * 42} fontSize="8" fill="#10b981">✓ {pro}</text>
            <text x="296" y={155 + i * 42} fontSize="8" fill="#ef4444">✗ {con}</text>
          </g>
        ))}
        <defs>
          <marker id="arrcli" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto"><path d="M0,0 L0,6 L6,3 z" fill="var(--muted)"/></marker>
        </defs>
      </svg>
      <Caption text="Typer generates --help, validates types, and requires 70% less boilerplate than argparse — the right default for new Python CLI tools in 2024" />
    </figure>
  );
}

function CloudModelsDiagram() {
  const layers = [
    { label: "SaaS", sub: "Software as a Service", examples: "Gmail · GitHub · Datadog · Slack", you: "just use the app", color: "#10b981" },
    { label: "PaaS", sub: "Platform as a Service", examples: "Heroku · Elastic Beanstalk · Vercel · Cloud Run", you: "your code + config", color: "#3b82f6" },
    { label: "IaaS", sub: "Infrastructure as a Service", examples: "EC2 · GCE · Azure VMs · DigitalOcean Droplets", you: "OS + runtime + code", color: "#6366f1" },
    { label: "On-Prem", sub: "You manage everything", examples: "Your own data center / rack", you: "hardware → app", color: "#f59e0b" },
  ];
  return (
    <figure className={figClass}>
      <svg viewBox="0 0 520 270" className="h-auto w-full" aria-hidden>
        <text x="260" y="16" textAnchor="middle" fontSize="10" fontWeight="600" fill="var(--text)">Cloud Service Models — what you manage vs what the provider manages</text>
        {layers.map(({ label, sub, examples, you, color }, i) => (
          <g key={label}>
            <rect x="16" y={28 + i * 50} width="488" height="44" rx="5" fill={`${color}18`} stroke={`${color}66`} strokeWidth="1.5"/>
            <rect x="16" y={28 + i * 50} width="72" height="44" rx="5" fill={`${color}28`} stroke={`${color}88`} strokeWidth="1.5"/>
            <text x="52" y={47 + i * 50} textAnchor="middle" fontSize="10" fontWeight="700" fill={color}>{label}</text>
            <text x="52" y={62 + i * 50} textAnchor="middle" fontSize="7" fill={color}>{sub.split(" ")[0]}</text>
            <text x="100" y={45 + i * 50} fontSize="8.5" fontWeight="600" fill="var(--text)">{sub}</text>
            <text x="100" y={58 + i * 50} fontSize="7.5" fill="var(--muted)">{examples}</text>
            <text x="400" y={52 + i * 50} fontSize="8" fill={color}>You manage: {you}</text>
          </g>
        ))}
        {/* Shared responsibility */}
        <rect x="16" y="232" width="488" height="30" rx="4" fill="color-mix(in oklab, var(--elevated) 55%, transparent)" stroke="var(--border)" strokeWidth="1"/>
        <text x="30" y="247" fontSize="8.5" fontWeight="600" fill="var(--text)">AWS Shared Responsibility Model</text>
        <text x="200" y="247" fontSize="8" fill="#3b82f6">AWS: security OF the cloud  (hardware, AZs, hypervisor)</text>
        <text x="30" y="258" fontSize="8" fill="#f59e0b">You: security IN the cloud  (OS patches, IAM policies, encryption, firewall rules, app security)</text>
      </svg>
      <Caption text="IaaS gives maximum control (you manage the OS); PaaS abstracts the runtime (you deploy code); SaaS is fully managed — pick based on the control vs effort trade-off" />
    </figure>
  );
}

function IamModelDiagram() {
  return (
    <figure className={figClass}>
      <svg viewBox="0 0 520 290" className="h-auto w-full" aria-hidden>
        <text x="260" y="16" textAnchor="middle" fontSize="10" fontWeight="600" fill="var(--text)">AWS IAM — principals, policies, and the permission evaluation flow</text>
        {/* Principals */}
        <rect x="16" y="28" width="140" height="160" rx="6" fill="#3b82f608" stroke="#3b82f666" strokeWidth="1.5"/>
        <text x="86" y="46" textAnchor="middle" fontSize="9" fontWeight="600" fill="#60a5fa">Principals</text>
        {[
          { label: "Root account", note: "god mode — MFA + lock away", color: "#ef4444" },
          { label: "IAM User", note: "human or service, long-term creds", color: "#f59e0b" },
          { label: "IAM Group", note: "attach policies here, not to users", color: "#6366f1" },
          { label: "IAM Role", note: "temporary creds, assumed by anything", color: "#10b981" },
        ].map(({ label, note, color }, i) => (
          <g key={label}>
            <rect x="24" y={56 + i * 32} width="124" height="26" rx="3" fill={`${color}18`} stroke={`${color}55`} strokeWidth="1"/>
            <text x="34" y={68 + i * 32} fontSize="8" fontWeight="600" fill={color}>{label}</text>
            <text x="34" y={78 + i * 32} fontSize="7" fill="var(--muted)">{note}</text>
          </g>
        ))}
        {/* Policies */}
        <rect x="172" y="28" width="176" height="160" rx="6" fill="#6366f108" stroke="#6366f166" strokeWidth="1.5"/>
        <text x="260" y="46" textAnchor="middle" fontSize="9" fontWeight="600" fill="#818cf8">IAM Policy (JSON)</text>
        <rect x="180" y="54" width="160" height="124" rx="3" fill="color-mix(in oklab, var(--elevated) 60%, transparent)" stroke="var(--border)" strokeWidth="1"/>
        {[
          '{  "Version": "2012-10-17",',
          '  "Statement": [{',
          '    "Effect": "Allow",',
          '    "Action": ["s3:GetObject",',
          '               "s3:PutObject"],',
          '    "Resource":',
          '      "arn:aws:s3:::my-bucket/*",',
          '    "Condition": {',
          '      "Bool": {"aws:SecureTransport"',
          '              : "true"} } }] }',
        ].map((line, i) => (
          <text key={i} x="186" y={67 + i * 11} fontSize="7" fontFamily="monospace" fill={i === 2 ? "#10b981" : i === 4 ? "#3b82f6" : "var(--muted)"}>{line}</text>
        ))}
        {/* Resources */}
        <rect x="364" y="28" width="140" height="160" rx="6" fill="#10b98108" stroke="#10b98166" strokeWidth="1.5"/>
        <text x="434" y="46" textAnchor="middle" fontSize="9" fontWeight="600" fill="#10b981">AWS Resources</text>
        {["S3 bucket", "EC2 instance", "Lambda function", "DynamoDB table", "Secrets Manager"].map((svc, i) => (
          <g key={svc}>
            <rect x="372" y={56 + i * 26} width="124" height="20" rx="3" fill="#10b98115" stroke="#10b98144" strokeWidth="1"/>
            <text x="434" y={69 + i * 26} textAnchor="middle" fontSize="8" fill="#10b981">{svc}</text>
          </g>
        ))}
        {/* Arrows */}
        <line x1="156" y1="108" x2="172" y2="108" stroke="var(--muted)" strokeWidth="1.2" markerEnd="url(#arriam)"/>
        <line x1="348" y1="108" x2="364" y2="108" stroke="var(--muted)" strokeWidth="1.2" markerEnd="url(#arriam)"/>
        <text x="164" y="104" textAnchor="middle" fontSize="7.5" fill="var(--muted)">attached</text>
        <text x="356" y="104" textAnchor="middle" fontSize="7.5" fill="var(--muted)">controls</text>
        {/* Eval order */}
        <rect x="16" y="202" width="488" height="76" rx="4" fill="color-mix(in oklab, var(--elevated) 55%, transparent)" stroke="var(--border)" strokeWidth="1"/>
        <text x="30" y="218" fontSize="9" fontWeight="600" fill="var(--text)">Policy evaluation order  (first match wins)</text>
        {[
          { label: "1. Explicit DENY", note: "anywhere in any policy → DENY immediately", color: "#ef4444" },
          { label: "2. Explicit ALLOW", note: "identity or resource policy → ALLOW", color: "#10b981" },
          { label: "3. Implicit DENY", note: "nothing said Allow → DENY by default", color: "#f59e0b" },
        ].map(({ label, note, color }, i) => (
          <g key={label}>
            <rect x="24" y={224 + i * 18} width="112" height="14" rx="2" fill={`${color}22`} stroke={`${color}55`} strokeWidth="1"/>
            <text x="30" y={234 + i * 18} fontSize="8" fontWeight="600" fill={color}>{label}</text>
            <text x="142" y={234 + i * 18} fontSize="8" fill="var(--muted)">{note}</text>
          </g>
        ))}
        <defs>
          <marker id="arriam" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto"><path d="M0,0 L0,6 L6,3 z" fill="var(--muted)"/></marker>
        </defs>
      </svg>
      <Caption text="IAM roles beat long-lived access keys for anything on AWS — EC2 and Lambda assume roles automatically, so credentials rotate without any human action" />
    </figure>
  );
}

function Ec2LifecycleDiagram() {
  const states = [
    { label: "Pending", x: 200, y: 44, color: "#f59e0b" },
    { label: "Running", x: 360, y: 44, color: "#10b981" },
    { label: "Stopping", x: 360, y: 144, color: "#6366f1" },
    { label: "Stopped", x: 200, y: 144, color: "#3b82f6" },
    { label: "Terminated", x: 280, y: 220, color: "#ef4444" },
  ];
  const pricing = [
    { model: "On-Demand", discount: "—", useCase: "dev/test, unpredictable load", risk: "highest cost" },
    { model: "Reserved (1yr)", discount: "~40%", useCase: "steady production workloads", risk: "upfront commit" },
    { model: "Reserved (3yr)", discount: "~60%", useCase: "long-lived databases, NAT GW", risk: "long lock-in" },
    { model: "Spot", discount: "~80%", useCase: "CI runners, batch, ML training", risk: "2-min termination notice" },
    { model: "Savings Plans", discount: "~50%", useCase: "flexible compute commitment", risk: "$/hr commitment" },
  ];
  return (
    <figure className={figClass}>
      <svg viewBox="0 0 520 340" className="h-auto w-full" aria-hidden>
        <text x="260" y="16" textAnchor="middle" fontSize="10" fontWeight="600" fill="var(--text)">EC2 Instance Lifecycle & Pricing Models</text>
        {/* State boxes */}
        {states.map(({ label, x, y, color }) => (
          <g key={label}>
            <rect x={x - 50} y={y - 16} width="100" height="32" rx="5" fill={`${color}22`} stroke={color} strokeWidth="1.5"/>
            <text x={x} y={y + 5} textAnchor="middle" fontSize="9" fontWeight="600" fill={color}>{label}</text>
          </g>
        ))}
        {/* Transitions */}
        <line x1="250" y1="44" x2="308" y2="44" stroke="#10b981" strokeWidth="1.2" markerEnd="url(#arre2l)"/>
        <text x="279" y="38" textAnchor="middle" fontSize="7.5" fill="var(--muted)">boot</text>
        <line x1="360" y1="60" x2="360" y2="128" stroke="#6366f1" strokeWidth="1.2" markerEnd="url(#arre2l)"/>
        <text x="376" y="98" fontSize="7.5" fill="var(--muted)">stop</text>
        <line x1="308" y1="144" x2="252" y2="144" stroke="#3b82f6" strokeWidth="1.2" markerEnd="url(#arre2l)"/>
        <text x="279" y="138" textAnchor="middle" fontSize="7.5" fill="var(--muted)">stopped</text>
        <line x1="200" y1="128" x2="200" y2="60" stroke="#f59e0b" strokeWidth="1.2" markerEnd="url(#arre2l)" strokeDasharray="4 2"/>
        <text x="184" y="98" textAnchor="end" fontSize="7.5" fill="var(--muted)">start</text>
        <line x1="360" y1="60" x2="318" y2="206" stroke="#ef4444" strokeWidth="1.2" markerEnd="url(#arre2l)" strokeDasharray="4 2"/>
        <text x="362" y="140" fontSize="7.5" fill="#ef4444">terminate</text>
        <line x1="200" y1="160" x2="260" y2="206" stroke="#ef4444" strokeWidth="1.2" markerEnd="url(#arre2l)" strokeDasharray="4 2"/>
        {/* Note */}
        <text x="260" y="266" textAnchor="middle" fontSize="8" fill="var(--muted)">Stopped = no compute charge (EBS still billed). Terminated = irreversible, root volume deleted.</text>
        {/* Pricing table */}
        <rect x="16" y="278" width="488" height="56" rx="4" fill="color-mix(in oklab, var(--elevated) 55%, transparent)" stroke="var(--border)" strokeWidth="1"/>
        <text x="30" y="293" fontSize="8.5" fontWeight="600" fill="var(--text)">Pricing models</text>
        {pricing.map(({ model, discount, useCase, risk }, i) => (
          <g key={model}>
            <text x="30" y={305 + i * 11} fontSize="7.5" fontWeight="600" fill={i === 3 ? "#10b981" : "var(--text)"}>{model}</text>
            <text x="130" y={305 + i * 11} fontSize="7.5" fill={discount === "—" ? "var(--muted)" : "#10b981"}>{discount}</text>
            <text x="175" y={305 + i * 11} fontSize="7.5" fill="var(--muted)">{useCase}</text>
            <text x="380" y={305 + i * 11} fontSize="7.5" fill="#f59e0b">{risk}</text>
          </g>
        ))}
        <defs>
          <marker id="arre2l" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto"><path d="M0,0 L0,6 L6,3 z" fill="var(--muted)"/></marker>
        </defs>
      </svg>
      <Caption text="Stopped instances don't incur compute charges but EBS volumes do — terminate unused instances and delete orphaned volumes to avoid surprise bills" />
    </figure>
  );
}

function VpcDesignDiagram() {
  return (
    <figure className={figClass}>
      <svg viewBox="0 0 520 310" className="h-auto w-full" aria-hidden>
        <text x="260" y="16" textAnchor="middle" fontSize="10" fontWeight="600" fill="var(--text)">3-Tier VPC Design — the production pattern for every AWS deployment</text>
        {/* VPC boundary */}
        <rect x="16" y="26" width="488" height="268" rx="8" fill="#6366f106" stroke="#6366f155" strokeWidth="1.5" strokeDasharray="6 3"/>
        <text x="30" y="42" fontSize="8.5" fontWeight="600" fill="#818cf8">VPC  10.0.0.0/16</text>
        {/* Internet & IGW */}
        <rect x="210" y="24" width="100" height="22" rx="4" fill="#ef44441a" stroke="#ef444455" strokeWidth="1"/>
        <text x="260" y="38" textAnchor="middle" fontSize="8" fill="#ef4444">Internet</text>
        <line x1="260" y1="46" x2="260" y2="58" stroke="var(--muted)" strokeWidth="1.2" markerEnd="url(#arrvpc)"/>
        <rect x="208" y="58" width="104" height="18" rx="3" fill="#f59e0b1a" stroke="#f59e0b66" strokeWidth="1"/>
        <text x="260" y="70" textAnchor="middle" fontSize="7.5" fontWeight="600" fill="#fbbf24">Internet Gateway</text>
        {/* AZ-a column */}
        <rect x="26" y="82" width="220" height="200" rx="6" fill="#3b82f608" stroke="#3b82f633" strokeWidth="1" strokeDasharray="4 2"/>
        <text x="136" y="96" textAnchor="middle" fontSize="8" fill="#60a5fa">Availability Zone A</text>
        {/* AZ-b column */}
        <rect x="274" y="82" width="220" height="200" rx="6" fill="#10b98108" stroke="#10b98133" strokeWidth="1" strokeDasharray="4 2"/>
        <text x="384" y="96" textAnchor="middle" fontSize="8" fill="#10b981">Availability Zone B</text>
        {/* Tier rows */}
        {[
          { tier: "Public", y: 100, colorA: "#10b981", colorB: "#10b981", textA: "10.0.1.0/24", textB: "10.0.2.0/24", note: "ALB only — no EC2" },
          { tier: "Private App", y: 166, colorA: "#3b82f6", colorB: "#3b82f6", textA: "10.0.10.0/24", textB: "10.0.11.0/24", note: "EC2 / ECS tasks" },
          { tier: "Private Data", y: 232, colorA: "#6366f1", colorB: "#6366f1", textA: "10.0.20.0/24", textB: "10.0.21.0/24", note: "RDS / ElastiCache" },
        ].map(({ tier, y, colorA, colorB, textA, textB, note }) => (
          <g key={tier}>
            <rect x="34" y={y} width="200" height="48" rx="4" fill={`${colorA}18`} stroke={`${colorA}66`} strokeWidth="1.2"/>
            <text x="134" y={y + 15} textAnchor="middle" fontSize="8" fontWeight="600" fill={colorA}>{tier}  Subnet A</text>
            <text x="134" y={y + 28} textAnchor="middle" fontSize="8" fontFamily="monospace" fill="var(--text)">{textA}</text>
            <text x="134" y={y + 41} textAnchor="middle" fontSize="7.5" fill="var(--muted)">{note}</text>
            <rect x="282" y={y} width="200" height="48" rx="4" fill={`${colorB}18`} stroke={`${colorB}66`} strokeWidth="1.2"/>
            <text x="382" y={y + 15} textAnchor="middle" fontSize="8" fontWeight="600" fill={colorB}>{tier}  Subnet B</text>
            <text x="382" y={y + 28} textAnchor="middle" fontSize="8" fontFamily="monospace" fill="var(--text)">{textB}</text>
            <text x="382" y={y + 41} textAnchor="middle" fontSize="7.5" fill="var(--muted)">{note}</text>
          </g>
        ))}
        {/* NAT GW indicators */}
        <text x="134" y="156" textAnchor="middle" fontSize="7.5" fill="#f59e0b">↑ NAT Gateway (in public subnet)</text>
        <text x="382" y="156" textAnchor="middle" fontSize="7.5" fill="#f59e0b">↑ NAT Gateway (in public subnet)</text>
        {/* Route legend */}
        <text x="260" y="292" textAnchor="middle" fontSize="7.5" fill="var(--muted)">Public: 0.0.0.0/0 → IGW  ·  Private: 0.0.0.0/0 → NAT GW  ·  Local: 10.0.0.0/16 → local (auto)</text>
        <defs>
          <marker id="arrvpc" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto"><path d="M0,0 L0,6 L6,3 z" fill="var(--muted)"/></marker>
        </defs>
      </svg>
      <Caption text="Always deploy across ≥ 2 AZs — if one data center fails, the other AZ keeps serving traffic. Only the load balancer lives in the public subnet." />
    </figure>
  );
}

function S3ArchitectureDiagram() {
  const classes = [
    { label: "Standard", avail: "99.99%", retrieval: "instant", costHint: "highest", color: "#10b981" },
    { label: "Intelligent-Tiering", avail: "99.9%", retrieval: "instant", costHint: "auto-moves data", color: "#06b6d4" },
    { label: "Standard-IA", avail: "99.9%", retrieval: "instant", costHint: "retrieval fee", color: "#3b82f6" },
    { label: "Glacier Instant", avail: "99.9%", retrieval: "ms", costHint: "cheap storage", color: "#6366f1" },
    { label: "Glacier Deep Archive", avail: "99.99%", retrieval: "12 hrs", costHint: "cheapest", color: "#f59e0b" },
  ];
  return (
    <figure className={figClass}>
      <svg viewBox="0 0 520 290" className="h-auto w-full" aria-hidden>
        <text x="260" y="16" textAnchor="middle" fontSize="10" fontWeight="600" fill="var(--text)">S3 Storage Architecture — data model, access control & storage classes</text>
        {/* Bucket */}
        <rect x="16" y="26" width="200" height="130" rx="6" fill="#10b98108" stroke="#10b98155" strokeWidth="1.5"/>
        <text x="116" y="44" textAnchor="middle" fontSize="9" fontWeight="600" fill="#10b981">S3 Bucket</text>
        <text x="116" y="58" textAnchor="middle" fontSize="8" fill="var(--muted)">globally unique name</text>
        {/* Object anatomy */}
        <rect x="28" y="64" width="176" height="82" rx="4" fill="color-mix(in oklab, var(--elevated) 60%, transparent)" stroke="var(--border)" strokeWidth="1"/>
        <text x="40" y="78" fontSize="8" fontWeight="600" fill="var(--text)">Object anatomy</text>
        <text x="40" y="92" fontSize="7.5" fontFamily="monospace" fill="#06b6d4">Key:  photos/2024/jan/img.jpg</text>
        <text x="40" y="104" fontSize="7.5" fill="var(--muted)">  (no real folders — slash in key name)</text>
        <text x="40" y="116" fontSize="7.5" fontFamily="monospace" fill="#3b82f6">Data: 0 B → 5 TB</text>
        <text x="40" y="128" fontSize="7.5" fontFamily="monospace" fill="#6366f1">Metadata: content-type, custom tags</text>
        <text x="40" y="140" fontSize="7.5" fontFamily="monospace" fill="#f59e0b">Version ID: (if versioning enabled)</text>
        {/* Access control stack */}
        <rect x="232" y="26" width="272" height="130" rx="6" fill="#6366f108" stroke="#6366f155" strokeWidth="1.5"/>
        <text x="368" y="44" textAnchor="middle" fontSize="9" fontWeight="600" fill="#818cf8">Access control layers</text>
        {[
          { label: "Block Public Access", note: "account + bucket level safety net", color: "#ef4444" },
          { label: "Bucket Policy (JSON)", note: "resource-based, cross-account grants", color: "#f59e0b" },
          { label: "IAM Policy", note: "identity-based, who in your account", color: "#3b82f6" },
          { label: "ACL (legacy)", note: "avoid for new buckets", color: "#94a3b8" },
        ].map(({ label, note, color }, i) => (
          <g key={label}>
            <rect x="242" y={54 + i * 26} width="252" height="20" rx="3" fill={`${color}18`} stroke={`${color}55`} strokeWidth="1"/>
            <text x="252" y={67 + i * 26} fontSize="8" fontWeight="600" fill={color}>{label}</text>
            <text x="252" y={78 + i * 26} fontSize="7" fill="var(--muted)">{note}</text>
          </g>
        ))}
        {/* Storage classes */}
        <text x="260" y="174" textAnchor="middle" fontSize="9" fontWeight="600" fill="var(--text)">Storage classes — lifecycle rules move data automatically</text>
        {classes.map(({ label, avail, retrieval, costHint, color }, i) => (
          <g key={label}>
            <rect x={16 + i * 98} y="180" width="92" height="54" rx="4" fill={`${color}18`} stroke={`${color}66`} strokeWidth="1.2"/>
            <text x={62 + i * 98} y="196" textAnchor="middle" fontSize="7.5" fontWeight="600" fill={color}>{label}</text>
            <text x={62 + i * 98} y="208" textAnchor="middle" fontSize="7" fill="var(--muted)">{avail}</text>
            <text x={62 + i * 98} y="220" textAnchor="middle" fontSize="7" fill="var(--muted)">retrieve: {retrieval}</text>
            <text x={62 + i * 98} y="232" textAnchor="middle" fontSize="7" fill={color}>{costHint}</text>
          </g>
        ))}
        {/* Lifecycle arrow */}
        <line x1="108" y1="260" x2="498" y2="260" stroke="var(--muted)" strokeWidth="1" markerEnd="url(#arrs3)"/>
        <text x="260" y="256" textAnchor="middle" fontSize="7.5" fill="var(--muted)">time / access frequency →</text>
        <text x="30" y="280" fontSize="7.5" fill="var(--muted)">30 days → IA</text>
        <text x="180" y="280" fontSize="7.5" fill="var(--muted)">90 days → Glacier Instant</text>
        <text x="340" y="280" fontSize="7.5" fill="var(--muted)">365 days → Deep Archive or expire</text>
        <defs>
          <marker id="arrs3" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto"><path d="M0,0 L0,6 L6,3 z" fill="var(--muted)"/></marker>
        </defs>
      </svg>
      <Caption text="Lifecycle rules are free money — automatically transitioning old objects to Glacier Deep Archive costs 95% less than Standard with zero application changes" />
    </figure>
  );
}

function RdsArchitectureDiagram() {
  return (
    <figure className={figClass}>
      <svg viewBox="0 0 520 280" className="h-auto w-full" aria-hidden>
        <text x="260" y="16" textAnchor="middle" fontSize="10" fontWeight="600" fill="var(--text)">RDS High Availability — Multi-AZ failover & read replica scaling</text>
        {/* App tier */}
        <rect x="196" y="26" width="128" height="36" rx="5" fill="#3b82f61a" stroke="#3b82f666" strokeWidth="1.5"/>
        <text x="260" y="44" textAnchor="middle" fontSize="9" fontWeight="600" fill="#60a5fa">Application tier</text>
        <text x="260" y="56" textAnchor="middle" fontSize="7.5" fill="var(--muted)">writes to primary endpoint</text>
        {/* RDS Proxy */}
        <rect x="196" y="78" width="128" height="28" rx="4" fill="#f59e0b1a" stroke="#f59e0b55" strokeWidth="1"/>
        <text x="260" y="95" textAnchor="middle" fontSize="8.5" fontWeight="600" fill="#fbbf24">RDS Proxy</text>
        <line x1="260" y1="62" x2="260" y2="78" stroke="var(--muted)" strokeWidth="1.2" markerEnd="url(#arrrds)"/>
        {/* Primary */}
        <rect x="160" y="122" width="120" height="56" rx="5" fill="#10b9811a" stroke="#10b98166" strokeWidth="1.5"/>
        <text x="220" y="142" textAnchor="middle" fontSize="9" fontWeight="600" fill="#10b981">Primary (AZ-a)</text>
        <text x="220" y="155" textAnchor="middle" fontSize="8" fontFamily="monospace" fill="var(--muted)">rw.cluster.rds</text>
        <text x="220" y="167" textAnchor="middle" fontSize="7.5" fill="var(--muted)">Multi-AZ: sync repl.</text>
        <line x1="240" y1="106" x2="220" y2="122" stroke="var(--muted)" strokeWidth="1.2" markerEnd="url(#arrrds)"/>
        {/* Standby */}
        <rect x="16" y="122" width="120" height="56" rx="5" fill="#6366f11a" stroke="#6366f166" strokeWidth="1.5"/>
        <text x="76" y="142" textAnchor="middle" fontSize="9" fontWeight="600" fill="#818cf8">Standby (AZ-b)</text>
        <text x="76" y="155" textAnchor="middle" fontSize="7.5" fill="var(--muted)">sync replica</text>
        <text x="76" y="167" textAnchor="middle" fontSize="7.5" fill="#ef4444">NOT readable</text>
        <line x1="160" y1="150" x2="136" y2="150" stroke="#6366f1" strokeWidth="1.2" markerEnd="url(#arrrds)"/>
        <text x="148" y="143" textAnchor="middle" fontSize="7" fill="#818cf8">sync</text>
        {/* Failover arrow */}
        <path d="M76 122 Q76 96 196 96" fill="none" stroke="#ef4444" strokeWidth="1" strokeDasharray="5 3" markerEnd="url(#arrrds)"/>
        <text x="130" y="100" textAnchor="middle" fontSize="7.5" fill="#ef4444">auto failover ~60s</text>
        {/* Read replicas */}
        <rect x="308" y="122" width="120" height="56" rx="5" fill="#3b82f61a" stroke="#3b82f666" strokeWidth="1.5"/>
        <text x="368" y="142" textAnchor="middle" fontSize="9" fontWeight="600" fill="#60a5fa">Read Replica 1</text>
        <text x="368" y="155" textAnchor="middle" fontSize="8" fontFamily="monospace" fill="var(--muted)">ro.cluster.rds</text>
        <text x="368" y="167" textAnchor="middle" fontSize="7.5" fill="var(--muted)">async repl.</text>
        <rect x="384" y="122" width="120" height="56" rx="5" fill="#3b82f61a" stroke="#3b82f633" strokeWidth="1" strokeDasharray="3 2"/>
        <text x="444" y="142" textAnchor="middle" fontSize="9" fontWeight="600" fill="#60a5fa">Read Replica 2</text>
        <text x="444" y="167" textAnchor="middle" fontSize="7.5" fill="var(--muted)">up to 15 (Aurora)</text>
        <line x1="280" y1="150" x2="308" y2="150" stroke="#3b82f6" strokeWidth="1.2" markerEnd="url(#arrrds)"/>
        <text x="294" y="143" textAnchor="middle" fontSize="7" fill="#3b82f6">async</text>
        {/* Security */}
        <rect x="16" y="196" width="488" height="72" rx="4" fill="color-mix(in oklab, var(--elevated) 55%, transparent)" stroke="var(--border)" strokeWidth="1"/>
        <text x="30" y="212" fontSize="9" fontWeight="600" fill="var(--text)">Security layers (always use all three)</text>
        {[
          { label: "Encryption at rest", detail: "KMS key encrypts data, WAL, snapshots, replicas — enable at creation (can't be added later)", color: "#10b981" },
          { label: "SSL in transit", detail: "rds.force_ssl=1 in parameter group; psql sslmode=require in connection string", color: "#3b82f6" },
          { label: "IAM auth / Secrets Manager", detail: "No plaintext passwords — use generate-db-auth-token (15 min TTL) or auto-rotate via Secrets Manager", color: "#6366f1" },
        ].map(({ label, detail, color }, i) => (
          <g key={label}>
            <text x="30" y={226 + i * 16} fontSize="8" fontWeight="600" fill={color}>{label}: </text>
            <text x="160" y={226 + i * 16} fontSize="7.5" fill="var(--muted)">{detail}</text>
          </g>
        ))}
        <defs>
          <marker id="arrrds" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto"><path d="M0,0 L0,6 L6,3 z" fill="var(--muted)"/></marker>
        </defs>
      </svg>
      <Caption text="Multi-AZ is for HA (automatic failover, standby not readable). Read replicas are for scale (async, readable, promote manually). Use RDS Proxy to absorb Lambda connection bursts." />
    </figure>
  );
}

function AlbAsgDiagram() {
  return (
    <figure className={figClass}>
      <svg viewBox="0 0 520 290" className="h-auto w-full" aria-hidden>
        <text x="260" y="16" textAnchor="middle" fontSize="10" fontWeight="600" fill="var(--text)">ALB + Auto Scaling Group — horizontal scaling on AWS</text>
        {/* Internet */}
        <rect x="210" y="26" width="100" height="22" rx="4" fill="#ef44441a" stroke="#ef444455" strokeWidth="1"/>
        <text x="260" y="40" textAnchor="middle" fontSize="8" fill="#ef4444">Internet traffic</text>
        <line x1="260" y1="48" x2="260" y2="58" stroke="var(--muted)" strokeWidth="1.2" markerEnd="url(#arralb)"/>
        {/* ALB */}
        <rect x="130" y="58" width="260" height="34" rx="5" fill="#f59e0b1a" stroke="#f59e0b66" strokeWidth="1.5"/>
        <text x="260" y="73" textAnchor="middle" fontSize="9" fontWeight="600" fill="#fbbf24">Application Load Balancer (Layer 7)</text>
        <text x="260" y="85" textAnchor="middle" fontSize="7.5" fill="var(--muted)">/api/* → api-tg  ·  /* → web-tg  ·  health check /health every 30s</text>
        {/* ASG */}
        <rect x="16" y="108" width="488" height="112" rx="6" fill="#6366f108" stroke="#6366f155" strokeWidth="1.5" strokeDasharray="5 3"/>
        <text x="30" y="124" fontSize="8.5" fontWeight="600" fill="#818cf8">Auto Scaling Group  (min: 2  desired: 3  max: 8)</text>
        {/* Instances */}
        {[
          { x: 30, label: "EC2 :AZ-a", status: "healthy", color: "#10b981" },
          { x: 178, label: "EC2 :AZ-b", status: "healthy", color: "#10b981" },
          { x: 326, label: "EC2 :AZ-a", status: "healthy", color: "#10b981" },
          { x: 400, label: "EC2 scaling…", status: "launching", color: "#f59e0b" },
        ].map(({ x, label, status, color }) => (
          <g key={label}>
            <rect x={x} y="132" width="136" height="72" rx="5" fill={`${color}18`} stroke={`${color}66`} strokeWidth="1.2"/>
            <text x={x + 68} y="150" textAnchor="middle" fontSize="8" fontWeight="600" fill={color}>{label}</text>
            <text x={x + 68} y="163" textAnchor="middle" fontSize="7.5" fill="var(--muted)">Launch Template</text>
            <text x={x + 68} y="175" textAnchor="middle" fontSize="7.5" fill="var(--muted)">AMI + user-data + SG</text>
            <text x={x + 68} y="187" textAnchor="middle" fontSize="7.5" fill="var(--muted)">IAM role + EBS</text>
            <text x={x + 68} y="199" textAnchor="middle" fontSize="8" fill={color}>{status}</text>
          </g>
        ))}
        {/* Arrows from ALB to ASG */}
        <line x1="200" y1="92" x2="120" y2="132" stroke="var(--muted)" strokeWidth="1" markerEnd="url(#arralb)"/>
        <line x1="260" y1="92" x2="260" y2="132" stroke="var(--muted)" strokeWidth="1" markerEnd="url(#arralb)"/>
        <line x1="320" y1="92" x2="380" y2="132" stroke="var(--muted)" strokeWidth="1" markerEnd="url(#arralb)"/>
        {/* Scaling policy */}
        <rect x="16" y="234" width="488" height="46" rx="4" fill="color-mix(in oklab, var(--elevated) 55%, transparent)" stroke="var(--border)" strokeWidth="1"/>
        <text x="30" y="250" fontSize="8.5" fontWeight="600" fill="var(--text)">Scaling policies</text>
        {[
          { label: "Target Tracking", detail: "maintain CPU at 50% — AWS manages alarms automatically (recommended default)", color: "#10b981" },
          { label: "Step Scaling", detail: "CPU 70-90% → +2 instances · CPU >90% → +4 instances (manual alarm setup)", color: "#3b82f6" },
          { label: "Scheduled", detail: "scale to 6 at 8AM weekdays, scale to 2 at 8PM — predictable traffic patterns", color: "#6366f1" },
        ].map(({ label, detail, color }, i) => (
          <text key={label} x="30" y={262 + i * 11} fontSize="7.5" fill={i === 0 ? color : "var(--muted)"}><tspan fontWeight="600" fill={color}>{label}: </tspan>{detail}</text>
        ))}
        <defs>
          <marker id="arralb" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto"><path d="M0,0 L0,6 L6,3 z" fill="var(--muted)"/></marker>
        </defs>
      </svg>
      <Caption text="Target tracking is the recommended default — set CPU target at 50% and AWS automatically adds/removes instances as needed, no manual alarm configuration required" />
    </figure>
  );
}

function CloudWatchDiagram() {
  const sources = [
    { label: "EC2 / ASG", sub: "CPU, network, status", x: 40, color: "#f59e0b" },
    { label: "Lambda", sub: "Invocations, errors, duration", x: 160, color: "#8b5cf6" },
    { label: "RDS / ELB", sub: "Connections, latency, 5xx", x: 280, color: "#3b82f6" },
    { label: "Custom App", sub: "put-metric-data / CW Agent", x: 400, color: "#10b981" },
  ];
  const pillars = [
    { label: "Metrics", sub: "Time-series numbers\n15-month retention", color: "#6366f1", x: 30 },
    { label: "Logs", sub: "Log groups & streams\nLogs Insights queries", color: "#0ea5e9", x: 155 },
    { label: "Alarms", sub: "Threshold evaluation\nComposite alarms", color: "#ef4444", x: 280 },
    { label: "Dashboards", sub: "Widgets & graphs\nAnomaly detection", color: "#f59e0b", x: 405 },
  ];
  const actions = [
    { label: "SNS / Email / PagerDuty", color: "#ef4444" },
    { label: "EC2 Stop / Reboot / Recover", color: "#f59e0b" },
    { label: "ASG Scale-out / Scale-in", color: "#10b981" },
  ];

  return (
    <figure className={figClass}>
      <svg viewBox="0 0 520 310" className="w-full" aria-label="CloudWatch architecture: data sources → Metrics, Logs, Alarms, Dashboards → actions">
        {/* Title */}
        <text x="260" y="18" textAnchor="middle" fontSize="11" fontWeight="700" fill="var(--text)">CloudWatch — Unified Observability</text>

        {/* Data sources row */}
        <text x="260" y="36" textAnchor="middle" fontSize="8" fill="var(--muted)">DATA SOURCES</text>
        {sources.map(({ label, sub, x, color }) => (
          <g key={label}>
            <rect x={x} y="42" width="100" height="34" rx="5" fill={`${color}22`} stroke={color} strokeWidth="1.2"/>
            <text x={x + 50} y="57" textAnchor="middle" fontSize="8.5" fontWeight="600" fill={color}>{label}</text>
            <text x={x + 50} y="69" textAnchor="middle" fontSize="7" fill="var(--muted)">{sub}</text>
          </g>
        ))}

        {/* Arrows down to CloudWatch */}
        {sources.map(({ x }) => (
          <line key={x} x1={x + 50} y1="77" x2={x + 50} y2="102" stroke="var(--border)" strokeWidth="1" strokeDasharray="3 2" markerEnd="url(#arrcw)"/>
        ))}

        {/* CloudWatch box */}
        <rect x="20" y="103" width="480" height="16" rx="4" fill="color-mix(in oklab, #6366f1 18%, transparent)" stroke="#6366f155" strokeWidth="1.5"/>
        <text x="260" y="115" textAnchor="middle" fontSize="9" fontWeight="700" fill="#818cf8">CloudWatch</text>

        {/* Arrows down to pillars */}
        {pillars.map(({ x }) => (
          <line key={x} x1={x + 55} y1="119" x2={x + 55} y2="138" stroke="var(--border)" strokeWidth="1" strokeDasharray="3 2" markerEnd="url(#arrcw)"/>
        ))}

        {/* Pillars row */}
        <text x="260" y="136" textAnchor="middle" fontSize="8" fill="var(--muted)">SERVICES</text>
        {pillars.map(({ label, sub, color, x }) => {
          const lines = sub.split("\n");
          return (
            <g key={label}>
              <rect x={x} y="142" width="110" height="46" rx="5" fill={`${color}18`} stroke={color} strokeWidth="1.2"/>
              <text x={x + 55} y="157" textAnchor="middle" fontSize="9" fontWeight="700" fill={color}>{label}</text>
              {lines.map((line, i) => (
                <text key={i} x={x + 55} y={169 + i * 11} textAnchor="middle" fontSize="7" fill="var(--muted)">{line}</text>
              ))}
            </g>
          );
        })}

        {/* Arrow from Alarms down to Actions */}
        <line x1="335" y1="189" x2="335" y2="214" stroke="#ef444488" strokeWidth="1.2" markerEnd="url(#arrcw)"/>
        <text x="260" y="212" textAnchor="middle" fontSize="8" fill="var(--muted)">ALARM ACTIONS (state transition: OK → ALARM)</text>

        {/* Actions row */}
        {actions.map(({ label, color }, i) => (
          <g key={label}>
            <rect x={20 + i * 165} y="218" width="155" height="22" rx="4" fill={`${color}18`} stroke={color} strokeWidth="1.2"/>
            <text x={20 + i * 165 + 77} y="233" textAnchor="middle" fontSize="7.5" fontWeight="600" fill={color}>{label}</text>
          </g>
        ))}

        {/* Legend */}
        <rect x="20" y="254" width="480" height="44" rx="4" fill="#6366f10d" stroke="#6366f133" strokeWidth="1"/>
        {[
          { key: "Metrics", val: "Namespace + MetricName + Dimensions → numeric time-series", color: "#6366f1" },
          { key: "Alarms", val: "Threshold + eval periods + treat-missing-data → OK / ALARM / INSUFFICIENT_DATA", color: "#ef4444" },
          { key: "Agent", val: "Installs on EC2 to ship memory, disk, and custom log files AWS cannot see otherwise", color: "#10b981" },
        ].map(({ key, val, color }, i) => (
          <text key={key} x="28" y={266 + i * 11} fontSize="7.5" fill="var(--muted)">
            <tspan fontWeight="700" fill={color}>{key}: </tspan>{val}
          </text>
        ))}

        <defs>
          <marker id="arrcw" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
            <path d="M0,0 L0,6 L6,3 z" fill="var(--muted)"/>
          </marker>
        </defs>
      </svg>
      <Caption text="CloudWatch collects metrics and logs from every AWS service. The CloudWatch Agent is required for OS-level data (memory, disk). Alarms evaluate metrics and can trigger SNS notifications, EC2 actions, or ASG scaling automatically." />
    </figure>
  );
}

function LambdaDiagram() {
  const triggers = [
    { label: "API Gateway", sub: "HTTP sync", color: "#6366f1", x: 10 },
    { label: "S3 Event", sub: "Async upload", color: "#f59e0b", x: 115 },
    { label: "SQS Queue", sub: "Poll-based", color: "#10b981", x: 220 },
    { label: "EventBridge", sub: "Schedule/rule", color: "#3b82f6", x: 325 },
    { label: "DynamoDB", sub: "Stream CDC", color: "#8b5cf6", x: 430 },
  ];

  return (
    <figure className={figClass}>
      <svg viewBox="0 0 530 300" className="w-full" aria-label="Lambda execution model: triggers → execution environment → cold/warm start phases → destinations">
        <text x="265" y="16" textAnchor="middle" fontSize="11" fontWeight="700" fill="var(--text)">Lambda Execution Model</text>

        {/* Triggers row */}
        <text x="265" y="32" textAnchor="middle" fontSize="8" fill="var(--muted)">EVENT SOURCES / TRIGGERS</text>
        {triggers.map(({ label, sub, color, x }) => (
          <g key={label}>
            <rect x={x} y="38" width="95" height="28" rx="4" fill={`${color}22`} stroke={color} strokeWidth="1.2"/>
            <text x={x + 47} y="51" textAnchor="middle" fontSize="8" fontWeight="600" fill={color}>{label}</text>
            <text x={x + 47} y="62" textAnchor="middle" fontSize="7" fill="var(--muted)">{sub}</text>
          </g>
        ))}

        {/* Arrows to Lambda */}
        {triggers.map(({ x, color }) => (
          <line key={x} x1={x + 47} y1="67" x2={x + 47} y2="88" stroke={color} strokeWidth="1" strokeDasharray="3 2" markerEnd="url(#arrlambda)"/>
        ))}

        {/* Lambda service bar */}
        <rect x="10" y="89" width="510" height="16" rx="4" fill="color-mix(in oklab, #f59e0b 18%, transparent)" stroke="#f59e0b55" strokeWidth="1.5"/>
        <text x="265" y="101" textAnchor="middle" fontSize="9" fontWeight="700" fill="#f59e0b">AWS Lambda Service — scales 0 → 1,000+ concurrent environments automatically</text>

        {/* Cold start box */}
        <rect x="10" y="114" width="240" height="96" rx="6" fill="color-mix(in oklab, #ef4444 8%, transparent)" stroke="#ef444455" strokeWidth="1.2"/>
        <text x="130" y="128" textAnchor="middle" fontSize="8.5" fontWeight="700" fill="#ef4444">COLD START (first invocation)</text>
        {[
          "1. Provision micro-VM (~50–200ms)",
          "2. Download deployment package",
          "3. Initialize runtime (Node/Python/Java)",
          "4. Run your init code (DB connect, imports)",
          "5. Run handler → response",
        ].map((line, i) => (
          <text key={i} x="20" y={141 + i * 12} fontSize="7.5" fill="var(--muted)">{line}</text>
        ))}
        <text x="130" y="206" textAnchor="middle" fontSize="7" fill="#ef4444">Total: +100ms–1s overhead</text>

        {/* Warm start box */}
        <rect x="280" y="114" width="240" height="96" rx="6" fill="color-mix(in oklab, #10b981 8%, transparent)" stroke="#10b98155" strokeWidth="1.2"/>
        <text x="400" y="128" textAnchor="middle" fontSize="8.5" fontWeight="700" fill="#10b981">WARM START (reused environment)</text>
        {[
          "1. Existing micro-VM reused ✓",
          "2. Package already loaded ✓",
          "3. Runtime already running ✓",
          "4. Init code already ran ✓",
          "5. Run handler → response",
        ].map((line, i) => (
          <text key={i} x="290" y={141 + i * 12} fontSize="7.5" fill="var(--muted)">{line}</text>
        ))}
        <text x="400" y="206" textAnchor="middle" fontSize="7" fill="#10b981">Total: handler time only (~ms)</text>

        {/* Arrow down */}
        <line x1="265" y1="211" x2="265" y2="232" stroke="var(--border)" strokeWidth="1" markerEnd="url(#arrlambda)"/>

        {/* Execution environment persistent state */}
        <rect x="80" y="233" width="360" height="22" rx="4" fill="#6366f11a" stroke="#6366f133" strokeWidth="1"/>
        <text x="265" y="248" textAnchor="middle" fontSize="8" fill="var(--text)">
          <tspan fontWeight="600" fill="#818cf8">Execution Environment reuse: </tspan>/tmp (up to 10 GB) · module-level vars · DB connections persist across warm invocations
        </text>

        {/* Config strip */}
        <rect x="10" y="264" width="510" height="28" rx="4" fill="color-mix(in oklab, var(--elevated) 50%, transparent)" stroke="var(--border)" strokeWidth="1"/>
        {[
          { key: "Memory", val: "128 MB – 10 GB (CPU scales with memory)" },
          { key: "Timeout", val: "max 15 min" },
          { key: "Concurrency", val: "Reserved + Provisioned" },
          { key: "Layers", val: "up to 5 (250 MB total)" },
        ].map(({ key, val }, i) => (
          <text key={key} x={18 + i * 130} y="282" fontSize="7.5" fill="var(--muted)">
            <tspan fontWeight="700" fill="var(--text)">{key}: </tspan>{val}
          </text>
        ))}

        <defs>
          <marker id="arrlambda" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
            <path d="M0,0 L0,6 L6,3 z" fill="var(--muted)"/>
          </marker>
        </defs>
      </svg>
      <Caption text="Cold starts add 100ms–1s of overhead the first time an execution environment is created. Warm starts reuse the existing environment and only run your handler. Use Provisioned Concurrency to pre-warm environments for latency-sensitive APIs." />
    </figure>
  );
}

function Route53CloudFrontDiagram() {
  const policies = [
    { label: "Simple", color: "#6366f1" },
    { label: "Weighted", color: "#3b82f6" },
    { label: "Latency", color: "#10b981" },
    { label: "Failover", color: "#ef4444" },
    { label: "Geolocation", color: "#f59e0b" },
  ];

  return (
    <figure className={figClass}>
      <svg viewBox="0 0 530 290" className="w-full" aria-label="Route 53 and CloudFront: DNS resolution flow and CDN caching architecture">
        <text x="265" y="16" textAnchor="middle" fontSize="11" fontWeight="700" fill="var(--text)">Route 53 + CloudFront — DNS & CDN Architecture</text>

        {/* User */}
        <rect x="220" y="24" width="90" height="24" rx="5" fill="color-mix(in oklab, #6366f1 15%, transparent)" stroke="#6366f155" strokeWidth="1.2"/>
        <text x="265" y="40" textAnchor="middle" fontSize="9" fontWeight="600" fill="#818cf8">User Browser</text>

        {/* Arrow to Route 53 */}
        <line x1="265" y1="48" x2="180" y2="72" stroke="#6366f188" strokeWidth="1" strokeDasharray="3 2" markerEnd="url(#arrr53)"/>
        <text x="190" y="65" fontSize="7" fill="var(--muted)">1. DNS query</text>

        {/* Route 53 box */}
        <rect x="20" y="72" width="145" height="56" rx="6" fill="color-mix(in oklab, #6366f1 10%, transparent)" stroke="#6366f155" strokeWidth="1.5"/>
        <text x="92" y="88" textAnchor="middle" fontSize="9" fontWeight="700" fill="#818cf8">Route 53</text>
        <text x="92" y="100" textAnchor="middle" fontSize="7.5" fill="var(--muted)">Hosted Zone</text>
        <text x="92" y="112" textAnchor="middle" fontSize="7" fill="var(--muted)">A / AAAA / CNAME / Alias / MX</text>
        <text x="92" y="122" textAnchor="middle" fontSize="7" fill="var(--muted)">Health checks · Routing policies</text>

        {/* Routing policies pills */}
        {policies.map(({ label, color }, i) => (
          <g key={label}>
            <rect x={20 + i * 30} y="136" width="28" height="13" rx="3" fill={`${color}22`} stroke={color} strokeWidth="0.8"/>
            <text x={20 + i * 30 + 14} y="146" textAnchor="middle" fontSize="6.5" fontWeight="600" fill={color}>{label}</text>
          </g>
        ))}

        {/* Arrow from Route53 → user (returns CF domain) */}
        <line x1="165" y1="100" x2="220" y2="74" stroke="#6366f188" strokeWidth="1" strokeDasharray="3 2" markerEnd="url(#arrr53)"/>
        <text x="176" y="82" fontSize="7" fill="var(--muted)">2. returns CF domain</text>

        {/* Arrow user → CloudFront edge */}
        <line x1="310" y1="36" x2="380" y2="60" stroke="#f59e0b88" strokeWidth="1" markerEnd="url(#arrr53)"/>
        <text x="330" y="53" fontSize="7" fill="var(--muted)">3. HTTPS request</text>

        {/* CloudFront edge box */}
        <rect x="365" y="60" width="150" height="68" rx="6" fill="color-mix(in oklab, #f59e0b 10%, transparent)" stroke="#f59e0b55" strokeWidth="1.5"/>
        <text x="440" y="76" textAnchor="middle" fontSize="9" fontWeight="700" fill="#f59e0b">CloudFront Edge</text>
        <text x="440" y="88" textAnchor="middle" fontSize="7.5" fill="var(--muted)">450+ PoPs worldwide</text>
        <text x="440" y="100" textAnchor="middle" fontSize="7" fill="var(--muted)">Cache hit → serve locally</text>
        <text x="440" y="111" textAnchor="middle" fontSize="7" fill="var(--muted)">Cache miss → forward to origin</text>
        <text x="440" y="122" textAnchor="middle" fontSize="7" fill="var(--muted)">TLS termination · HTTP/3 · gzip</text>

        {/* Arrow user ← CloudFront (cached) */}
        <line x1="365" y1="82" x2="310" y2="48" stroke="#10b98188" strokeWidth="1" strokeDasharray="3 2" markerEnd="url(#arrr53)"/>
        <text x="312" y="76" fontSize="7" fill="#10b981">4. cached response</text>

        {/* Origins row */}
        <text x="265" y="162" textAnchor="middle" fontSize="8" fill="var(--muted)">ORIGINS (on cache miss)</text>
        {[
          { label: "S3 Bucket", sub: "Static assets\n(OAC)", color: "#f59e0b", x: 30 },
          { label: "ALB", sub: "Dynamic app\n/api/*", color: "#3b82f6", x: 160 },
          { label: "API Gateway", sub: "REST/HTTP\nAPI", color: "#8b5cf6", x: 290 },
          { label: "Custom HTTP", sub: "On-premise\nor EC2", color: "#10b981", x: 420 },
        ].map(({ label, sub, color, x }) => {
          const lines = sub.split("\n");
          return (
            <g key={label}>
              <rect x={x} y="168" width="110" height="38" rx="5" fill={`${color}18`} stroke={color} strokeWidth="1.2"/>
              <text x={x + 55} y="181" textAnchor="middle" fontSize="8.5" fontWeight="600" fill={color}>{label}</text>
              {lines.map((l, i) => <text key={i} x={x + 55} y={192 + i * 9} textAnchor="middle" fontSize="7" fill="var(--muted)">{l}</text>)}
            </g>
          );
        })}

        {/* Arrows CF → origins */}
        {[85, 215, 345, 475].map((x, i) => (
          <line key={i} x1={440} y1={128} x2={x} y2={168} stroke="var(--border)" strokeWidth="1" strokeDasharray="3 2" markerEnd="url(#arrr53)"/>
        ))}

        {/* Security note */}
        <rect x="20" y="218" width="490" height="30" rx="4" fill="#6366f10d" stroke="#6366f133" strokeWidth="1"/>
        <text x="265" y="230" textAnchor="middle" fontSize="8" fontWeight="700" fill="#818cf8">Security layers on CloudFront</text>
        <text x="265" y="242" textAnchor="middle" fontSize="7.5" fill="var(--muted)">HTTPS enforced (redirect-to-https) · TLSv1.2_2021 min · OAC locks S3 · WAF WebACL blocks SQLi/XSS · Signed URLs for private content</text>

        {/* Alias note */}
        <rect x="20" y="256" width="490" height="24" rx="4" fill="#10b9810d" stroke="#10b98133" strokeWidth="1"/>
        <text x="265" y="272" textAnchor="middle" fontSize="7.5" fill="var(--muted)">
          <tspan fontWeight="700" fill="#10b981">Alias vs CNAME: </tspan>Always use Alias for AWS resources — works at zone apex, free, no extra DNS lookup · CloudFront hosted zone ID is always Z2FDTNDATAQYW2
        </text>

        <defs>
          <marker id="arrr53" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
            <path d="M0,0 L0,6 L6,3 z" fill="var(--muted)"/>
          </marker>
        </defs>
      </svg>
      <Caption text="Route 53 resolves DNS using routing policies (latency, weighted, failover, geolocation). CloudFront serves cached content from 450+ edge locations and forwards cache misses to the origin. Always use Alias records for AWS resources — they work at the zone apex and are free." />
    </figure>
  );
}

function SgNaclWafDiagram() {
  const layers = [
    { label: "AWS WAF", sub: "Layer 7 — inspects HTTP payload\nSQLi · XSS · Rate limit · IP block", color: "#ef4444", y: 44 },
    { label: "ALB Security Group", sub: "Allow TCP 443/80 from 0.0.0.0/0\nStateful — return traffic auto-allowed", color: "#f59e0b", y: 106 },
    { label: "NACL (Public Subnet)", sub: "Stateless — rule 50: DENY bad CIDRs · rule 100: ALLOW 443 · rule 110: ALLOW 1024-65535\nBoth inbound AND outbound rules required", color: "#3b82f6", y: 168 },
    { label: "App Security Group", sub: "Allow TCP 8080 from ALB-SG only — not from 0.0.0.0/0\nStateful — reference SG ID, not CIDR", color: "#10b981", y: 230 },
  ];

  return (
    <figure className={figClass}>
      <svg viewBox="0 0 530 330" className="w-full" aria-label="Defence in depth: WAF, Security Groups, and NACLs layered in a production VPC">
        <text x="265" y="16" textAnchor="middle" fontSize="11" fontWeight="700" fill="var(--text)">Defence-in-Depth — WAF · SG · NACL</text>

        {/* Internet user */}
        <rect x="215" y="20" width="100" height="18" rx="4" fill="color-mix(in oklab, #6366f1 12%, transparent)" stroke="#6366f155" strokeWidth="1"/>
        <text x="265" y="33" textAnchor="middle" fontSize="8.5" fontWeight="600" fill="#818cf8">Internet Traffic</text>

        {layers.map(({ label, sub, color, y }) => {
          const lines = sub.split("\n");
          return (
            <g key={label}>
              <line x1="265" y1={y - 6} x2="265" y2={y} stroke={color} strokeWidth="1.2" markerEnd="url(#arrsec)"/>
              <rect x="20" y={y} width="490" height="52" rx="5" fill={`${color}12`} stroke={color} strokeWidth="1.3"/>
              <text x="265" y={y + 15} textAnchor="middle" fontSize="9" fontWeight="700" fill={color}>{label}</text>
              {lines.map((l, i) => (
                <text key={i} x="265" y={y + 27 + i * 12} textAnchor="middle" fontSize="7.5" fill="var(--muted)">{l}</text>
              ))}
            </g>
          );
        })}

        {/* Arrow down to RDS */}
        <line x1="265" y1="282" x2="265" y2="296" stroke="#8b5cf688" strokeWidth="1.2" markerEnd="url(#arrsec)"/>

        {/* RDS */}
        <rect x="160" y="296" width="210" height="24" rx="5" fill="color-mix(in oklab, #8b5cf6 12%, transparent)" stroke="#8b5cf655" strokeWidth="1.2"/>
        <text x="265" y="312" textAnchor="middle" fontSize="8.5" fontWeight="600" fill="#8b5cf6">RDS Security Group — TCP 5432 from App-SG only</text>

        <defs>
          <marker id="arrsec" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
            <path d="M0,0 L0,6 L6,3 z" fill="var(--muted)"/>
          </marker>
        </defs>
      </svg>
      <Caption text="Security Groups are stateful and are the primary control — always configure them first. NACLs are stateless subnet barriers; remember to allow ephemeral ports 1024–65535 outbound. WAF inspects the HTTP payload before traffic hits your compute layer." />
    </figure>
  );
}

function EcsEcrDiagram() {
  const sources = [
    { label: "Developer", sub: "git push", color: "#6366f1", x: 30 },
    { label: "CI/CD Pipeline", sub: "GitHub Actions / CodeBuild", color: "#3b82f6", x: 160 },
    { label: "ECR Registry", sub: "Private Docker registry\nVuln scanning · lifecycle", color: "#f59e0b", x: 290 },
    { label: "ECS Service", sub: "Desired count · rolling deploy\nALB · auto scaling", color: "#10b981", x: 420 },
  ];

  return (
    <figure className={figClass}>
      <svg viewBox="0 0 530 270" className="w-full" aria-label="ECS and ECR workflow: code to container to service">
        <text x="265" y="15" textAnchor="middle" fontSize="11" fontWeight="700" fill="var(--text)">ECS + ECR — Container Platform Architecture</text>

        {/* Flow row */}
        {sources.map(({ label, sub, color, x }, i) => {
          const lines = sub.split("\n");
          return (
            <g key={label}>
              {i > 0 && <line x1={x - 10} y1="58" x2={x + 2} y2="58" stroke={color} strokeWidth="1.2" markerEnd="url(#arrecs)"/>}
              <rect x={x} y="38" width="110" height={lines.length > 1 ? 44 : 34} rx="5" fill={`${color}18`} stroke={color} strokeWidth="1.2"/>
              <text x={x + 55} y="54" textAnchor="middle" fontSize="8.5" fontWeight="600" fill={color}>{label}</text>
              {lines.map((l, j) => <text key={j} x={x + 55} y={66 + j * 11} textAnchor="middle" fontSize="7" fill="var(--muted)">{l}</text>)}
            </g>
          );
        })}

        {/* ECS cluster box */}
        <rect x="20" y="108" width="490" height="100" rx="6" fill="color-mix(in oklab, #10b981 6%, transparent)" stroke="#10b98133" strokeWidth="1.5"/>
        <text x="265" y="122" textAnchor="middle" fontSize="9" fontWeight="700" fill="#10b981">ECS Cluster</text>

        {/* Launch types */}
        {[
          { label: "Fargate Task", sub: "Serverless · AWS manages EC2\nPay per vCPU/mem-sec · 30s cold start", color: "#10b981", x: 35 },
          { label: "Fargate Task", sub: "Second replica (Multi-AZ)\nALB routes between tasks", color: "#10b981", x: 185 },
          { label: "EC2 Task", sub: "Self-managed instances\nCheaper for sustained load", color: "#3b82f6", x: 335 },
        ].map(({ label, sub, color, x }) => {
          const lines = sub.split("\n");
          return (
            <g key={`${label}-${x}`}>
              <rect x={x} y="130" width="140" height="68" rx="4" fill={`${color}15`} stroke={color} strokeWidth="1"/>
              <text x={x + 70} y="145" textAnchor="middle" fontSize="8" fontWeight="600" fill={color}>{label}</text>
              {lines.map((l, i) => <text key={i} x={x + 70} y={157 + i * 11} textAnchor="middle" fontSize="7" fill="var(--muted)">{l}</text>)}
            </g>
          );
        })}

        {/* ALB below */}
        <line x1="265" y1="210" x2="265" y2="224" stroke="#3b82f688" strokeWidth="1" markerEnd="url(#arrecs)"/>
        <rect x="120" y="224" width="290" height="20" rx="4" fill="color-mix(in oklab, #3b82f6 12%, transparent)" stroke="#3b82f655" strokeWidth="1.2"/>
        <text x="265" y="238" textAnchor="middle" fontSize="8.5" fontWeight="600" fill="#3b82f6">Application Load Balancer — distributes traffic across tasks</text>

        {/* Key concepts strip */}
        <rect x="20" y="252" width="490" height="14" rx="3" fill="#6366f10d" stroke="#6366f133" strokeWidth="1"/>
        {[
          { k: "Task Def", v: "blueprint (image + CPU/mem + env + role)" },
          { k: "Service", v: "maintains desired count · rolling deploy" },
          { k: "Target type", v: "ip (required for Fargate)" },
        ].map(({ k, v }, i) => (
          <text key={k} x={28 + i * 170} y="262" fontSize="7" fill="var(--muted)">
            <tspan fontWeight="700" fill="var(--text)">{k}: </tspan>{v}
          </text>
        ))}

        <defs>
          <marker id="arrecs" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
            <path d="M0,0 L0,6 L6,3 z" fill="var(--muted)"/>
          </marker>
        </defs>
      </svg>
      <Caption text="Build and push to ECR in CI/CD, then ECS pulls the image and runs it as Fargate or EC2 tasks. The Service maintains desired task count and integrates with ALB. Use target type 'ip' (not 'instance') for Fargate." />
    </figure>
  );
}

function CfnSdkDiagram() {
  const tools = [
    { label: "AWS CLI", sub: "Terminal · scripts · CI/CD\n--query JMESPath · --profile", color: "#6366f1", x: 20 },
    { label: "boto3 SDK", sub: "Python application code\nSession · Paginator · Waiter", color: "#3b82f6", x: 185 },
    { label: "CloudFormation", sub: "IaC — YAML/JSON templates\nStack · Change Set · Drift", color: "#f59e0b", x: 350 },
  ];

  return (
    <figure className={figClass}>
      <svg viewBox="0 0 530 250" className="w-full" aria-label="AWS CLI, boto3 SDK, and CloudFormation — three automation tools">
        <text x="265" y="15" textAnchor="middle" fontSize="11" fontWeight="700" fill="var(--text)">AWS Automation Tools</text>

        {tools.map(({ label, sub, color, x }) => {
          const lines = sub.split("\n");
          return (
            <g key={label}>
              <rect x={x} y="24" width="135" height="54" rx="6" fill={`${color}18`} stroke={color} strokeWidth="1.3"/>
              <text x={x + 67} y="40" textAnchor="middle" fontSize="9.5" fontWeight="700" fill={color}>{label}</text>
              {lines.map((l, i) => <text key={i} x={x + 67} y={53 + i * 12} textAnchor="middle" fontSize="7.5" fill="var(--muted)">{l}</text>)}
            </g>
          );
        })}

        {/* Arrows all → AWS APIs */}
        {[87, 252, 417].map(x => (
          <line key={x} x1={x} y1="79" x2={x} y2="100" stroke="var(--border)" strokeWidth="1" markerEnd="url(#arrcfn)"/>
        ))}

        <rect x="20" y="100" width="490" height="16" rx="4" fill="color-mix(in oklab, #6366f1 15%, transparent)" stroke="#6366f155" strokeWidth="1.5"/>
        <text x="265" y="112" textAnchor="middle" fontSize="9" fontWeight="700" fill="#818cf8">AWS Service APIs (same underlying APIs — different interfaces)</text>

        {/* CloudFormation flow */}
        <rect x="20" y="128" width="490" height="78" rx="6" fill="color-mix(in oklab, #f59e0b 6%, transparent)" stroke="#f59e0b33" strokeWidth="1.2"/>
        <text x="265" y="143" textAnchor="middle" fontSize="8.5" fontWeight="700" fill="#f59e0b">CloudFormation Stack Lifecycle</text>
        {[
          { label: "Template\n(YAML/JSON)", color: "#f59e0b", x: 30 },
          { label: "Change Set\n(preview diff)", color: "#3b82f6", x: 145 },
          { label: "Stack\n(deployed)", color: "#10b981", x: 260 },
          { label: "Drift\n(detect change)", color: "#ef4444", x: 375 },
          { label: "Delete\n(full teardown)", color: "#6366f1", x: 455 },
        ].map(({ label, color, x }, i) => {
          const lines = label.split("\n");
          return (
            <g key={label}>
              {i > 0 && <line x1={x - 8} y1="170" x2={x} y2="170" stroke="var(--border)" strokeWidth="1" markerEnd="url(#arrcfn)"/>}
              <rect x={x} y="155" width="68" height="34" rx="4" fill={`${color}18`} stroke={color} strokeWidth="1"/>
              {lines.map((l, j) => <text key={j} x={x + 34} y={168 + j * 12} textAnchor="middle" fontSize="7.5" fontWeight="600" fill={color}>{l}</text>)}
            </g>
          );
        })}
        <text x="265" y="206" textAnchor="middle" fontSize="7" fill="var(--muted)">Never edit stack resources outside CloudFormation — causes drift · Always review Change Set before execute</text>

        {/* Bottom legend */}
        <rect x="20" y="218" width="490" height="24" rx="3" fill="#6366f10d" stroke="#6366f133" strokeWidth="1"/>
        {[
          { k: "--query", v: "JMESPath filter on CLI output" },
          { k: "Paginator", v: "auto-handles multi-page API responses" },
          { k: "Waiter", v: "polls until resource reaches desired state" },
        ].map(({ k, v }, i) => (
          <text key={k} x={28 + i * 170} y="233" fontSize="7.5" fill="var(--muted)">
            <tspan fontWeight="700" fill="var(--text)">{k}: </tspan>{v}
          </text>
        ))}

        <defs>
          <marker id="arrcfn" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
            <path d="M0,0 L0,6 L6,3 z" fill="var(--muted)"/>
          </marker>
        </defs>
      </svg>
      <Caption text="AWS CLI, boto3, and CloudFormation all call the same underlying AWS APIs. Use CLI for scripts and ad-hoc tasks, boto3 for application code, and CloudFormation for repeatable infrastructure — always review a Change Set before executing." />
    </figure>
  );
}

function CostManagementDiagram() {
  const tools = [
    { label: "Cost Explorer", sub: "Visualize by service\nregion · tag · type", color: "#6366f1", x: 20 },
    { label: "AWS Budgets", sub: "Alert at 80%/100%\nactual & forecasted", color: "#ef4444", x: 155 },
    { label: "Compute Optimizer", sub: "Right-size EC2/Lambda\nunder-utilized instances", color: "#10b981", x: 290 },
    { label: "Savings Plans", sub: "1yr/3yr commit\nUp to 66–72% off", color: "#f59e0b", x: 420 },
  ];

  const options = [
    { label: "On-Demand", pct: "0%", color: "#94a3b8" },
    { label: "Savings Plan", pct: "Up to 66%", color: "#10b981" },
    { label: "Reserved", pct: "Up to 72%", color: "#3b82f6" },
    { label: "Spot", pct: "Up to 90%", color: "#f59e0b" },
  ];

  return (
    <figure className={figClass}>
      <svg viewBox="0 0 530 260" className="w-full" aria-label="AWS cost management tools and purchasing options">
        <text x="265" y="15" textAnchor="middle" fontSize="11" fontWeight="700" fill="var(--text)">AWS Cost Management</text>

        {tools.map(({ label, sub, color, x }) => {
          const lines = sub.split("\n");
          return (
            <g key={label}>
              <rect x={x} y="24" width="125" height="48" rx="5" fill={`${color}18`} stroke={color} strokeWidth="1.3"/>
              <text x={x + 62} y="39" textAnchor="middle" fontSize="8.5" fontWeight="700" fill={color}>{label}</text>
              {lines.map((l, i) => <text key={i} x={x + 62} y={51 + i * 12} textAnchor="middle" fontSize="7" fill="var(--muted)">{l}</text>)}
            </g>
          );
        })}

        {/* Purchasing options */}
        <text x="265" y="90" textAnchor="middle" fontSize="8" fontWeight="600" fill="var(--muted)">EC2 PURCHASING OPTIONS — discount vs flexibility trade-off</text>
        {options.map(({ label, pct, color }, i) => (
          <g key={label}>
            <rect x={20 + i * 122} y="96" width="115" height="36" rx="4" fill={`${color}18`} stroke={color} strokeWidth="1.2"/>
            <text x={20 + i * 122 + 57} y="111" textAnchor="middle" fontSize="8.5" fontWeight="700" fill={color}>{label}</text>
            <text x={20 + i * 122 + 57} y="124" textAnchor="middle" fontSize="9" fontWeight="800" fill={color}>{pct}</text>
          </g>
        ))}

        {/* Quick wins */}
        <rect x="20" y="142" width="490" height="90" rx="6" fill="color-mix(in oklab, #10b981 6%, transparent)" stroke="#10b98133" strokeWidth="1.2"/>
        <text x="265" y="157" textAnchor="middle" fontSize="9" fontWeight="700" fill="#10b981">Quick-Win Cost Reduction Checklist</text>
        {[
          "Delete unattached EBS volumes and idle Elastic IPs",
          "Set CloudWatch Log retention on ALL log groups (never leave 'Never Expire')",
          "S3 lifecycle policies: IA after 30 days · Glacier after 90 days",
          "Stop dev/staging EC2 outside business hours (pay EBS only)",
          "Buy Compute Savings Plans for baseline (always-on) usage",
        ].map((item, i) => (
          <g key={i}>
            <circle cx="30" cy={169 + i * 12} r="2.5" fill="#10b981"/>
            <text x="38" y={173 + i * 12} fontSize="7.5" fill="var(--muted)">{item}</text>
          </g>
        ))}

        {/* Well-Architected note */}
        <rect x="20" y="240" width="490" height="14" rx="3" fill="#6366f10d" stroke="#6366f133" strokeWidth="1"/>
        <text x="265" y="251" textAnchor="middle" fontSize="7.5" fill="var(--muted)">
          <tspan fontWeight="700" fill="#818cf8">Well-Architected Cost Pillar: </tspan>measure everything · eliminate waste · right-size · use managed services · review monthly
        </text>
      </svg>
      <Caption text="Use Cost Explorer to find top spenders, Budgets to get alerts before you overspend, and Compute Optimizer to right-size. Savings Plans cut baseline EC2/Fargate/Lambda by up to 66%; Spot cuts batch/CI workloads by up to 90%." />
    </figure>
  );
}

export function DevopsDiagram({ id }: { id: RoadmapDetailDiagramId }) {
  switch (id) {
    case "devops-linux-hierarchy": return <LinuxHierarchyDiagram />;
    case "devops-osi-model": return <OsiModelDiagram />;
    case "devops-docker-layers": return <DockerLayersDiagram />;
    case "devops-cicd-pipeline": return <CicdPipelineDiagram />;
    case "devops-k8s-cluster": return <K8sClusterDiagram />;
    case "devops-terraform-workflow": return <TerraformWorkflowDiagram />;
    case "devops-aws-vpc": return <AwsVpcDiagram />;
    case "devops-prometheus-architecture": return <PrometheusArchDiagram />;
    case "devops-ansible-playbook": return <AnsiblePlaybookDiagram />;
    case "devops-nginx-proxy": return <NginxProxyDiagram />;
    case "devops-linux-os-stack": return <LinuxOsStackDiagram />;
    case "devops-linux-permissions": return <LinuxPermissionsDiagram />;
    case "devops-dns-resolution": return <DnsResolutionDiagram />;
    case "devops-process-lifecycle": return <ProcessLifecycleDiagram />;
    case "devops-apt-workflow": return <AptWorkflowDiagram />;
    case "devops-bash-script-flow": return <BashScriptFlowDiagram />;
    case "devops-ssh-key-auth": return <SshKeyAuthDiagram />;
    case "devops-tcp-handshake": return <TcpHandshakeDiagram />;
    case "devops-subnet-cidr": return <SubnetCidrDiagram />;
    case "devops-firewall-nat": return <FirewallNatDiagram />;
    case "devops-network-debug-flow": return <NetworkDebugFlowDiagram />;
    case "devops-vpn-tunnel": return <VpnTunnelDiagram />;
    case "devops-git-three-areas": return <GitThreeAreasDiagram />;
    case "devops-git-branching": return <GitBranchingDiagram />;
    case "devops-semver": return <SemverDiagram />;
    case "devops-git-hooks": return <GitHooksDiagram />;
    case "devops-monorepo-structure": return <MonorepoStructureDiagram />;
    case "devops-merge-conflict": return <MergeConflictDiagram />;
    case "devops-log-parsing": return <LogParsingDiagram />;
    case "devops-boto3-workflow": return <Boto3WorkflowDiagram />;
    case "devops-cli-tool": return <CliToolDiagram />;
    case "devops-cloud-models": return <CloudModelsDiagram />;
    case "devops-iam-model": return <IamModelDiagram />;
    case "devops-ec2-lifecycle": return <Ec2LifecycleDiagram />;
    case "devops-vpc-design": return <VpcDesignDiagram />;
    case "devops-s3-architecture": return <S3ArchitectureDiagram />;
    case "devops-rds-architecture": return <RdsArchitectureDiagram />;
    case "devops-alb-asg": return <AlbAsgDiagram />;
    case "devops-cloudwatch": return <CloudWatchDiagram />;
    case "devops-lambda": return <LambdaDiagram />;
    case "devops-route53-cloudfront": return <Route53CloudFrontDiagram />;
    case "devops-sg-nacl-waf": return <SgNaclWafDiagram />;
    case "devops-ecs-ecr": return <EcsEcrDiagram />;
    case "devops-cfn-sdk": return <CfnSdkDiagram />;
    case "devops-cost-management": return <CostManagementDiagram />;
    case "devops-container-vs-vm": return <ContainerVsVmDiagram />;
    case "devops-dockerfile": return <DockerfileDiagram />;
    case "devops-container-lifecycle": return <ContainerLifecycleDiagram />;
    case "devops-docker-networking": return <DockerNetworkingDiagram />;
    case "devops-docker-volumes": return <DockerVolumesDiagram />;
    case "devops-docker-compose": return <DockerComposeDiagram />;
    default: return null;
  }
}

function DockerComposeDiagram() {
  const services = [
    { name: "proxy", color: "#38bdf8", port: "80:80", nets: ["frontend"] },
    { name: "api", color: "#34d399", port: "3000", nets: ["frontend", "backend"] },
    { name: "db", color: "#f472b6", port: "5432", nets: ["backend"] },
    { name: "cache", color: "#fbbf24", port: "6379", nets: ["backend"] },
  ];
  return (
    <figure className="not-prose overflow-x-auto rounded-xl border border-[var(--border)] bg-[var(--surface)]">
      <svg viewBox="0 0 530 240" className="w-full" aria-label="Docker Compose multi-service architecture">
        <text x="265" y="16" textAnchor="middle" fontSize="11" fontWeight="700" fill="var(--fg)">Docker Compose — Multi-Service Application Stack</text>

        {/* Internet */}
        <rect x="220" y="24" width="90" height="20" rx="5" fill="#1e293b" stroke="#334155" strokeWidth="1"/>
        <text x="265" y="38" textAnchor="middle" fontSize="8" fill="var(--muted)">Internet / Browser</text>
        <line x1="265" y1="44" x2="265" y2="58" stroke="#475569" strokeWidth="1.2" strokeDasharray="3,2"/>

        {/* Service boxes */}
        {services.map((s, i) => (
          <g key={i}>
            <rect x={20 + i * 122} y="58" width="108" height="40" rx="6"
              fill={`color-mix(in oklab, ${s.color} 12%, transparent)`}
              stroke={`${s.color}44`} strokeWidth="1.3"/>
            <text x={74 + i * 122} y="73" textAnchor="middle" fontSize="9" fontWeight="700" fill={s.color}>{s.name}</text>
            <text x={74 + i * 122} y="88" textAnchor="middle" fontSize="7" fill="var(--muted)">{s.port}</text>
          </g>
        ))}

        {/* Network bands */}
        <rect x="16" y="106" width="250" height="16" rx="4" fill="color-mix(in oklab, #38bdf8 8%, transparent)" stroke="#38bdf833" strokeWidth="1"/>
        <text x="141" y="118" textAnchor="middle" fontSize="7.5" fontWeight="600" fill="#38bdf8">frontend-net (proxy ↔ api)</text>
        <rect x="138" y="106" width="376" height="16" rx="4" fill="color-mix(in oklab, #34d399 8%, transparent)" stroke="#34d39933" strokeWidth="1"/>
        <text x="326" y="118" textAnchor="middle" fontSize="7.5" fontWeight="600" fill="#34d399">backend-net (api ↔ db ↔ cache)</text>

        {/* Volume row */}
        <rect x="16" y="130" width="490" height="20" rx="4" fill="color-mix(in oklab, #f59e0b 6%, transparent)" stroke="#f59e0b33" strokeWidth="1"/>
        <text x="265" y="144" textAnchor="middle" fontSize="8" fill="var(--muted)">
          <tspan fontWeight="700" fill="#f59e0b">Named Volumes: </tspan>pgdata → /var/lib/postgresql/data   redisdata → /data
        </text>

        {/* Compose file anatomy */}
        <rect x="16" y="158" width="498" height="74" rx="6" fill="#0f172a" stroke="#1e293b" strokeWidth="1"/>
        <text x="265" y="172" textAnchor="middle" fontSize="8.5" fontWeight="700" fill="var(--fg)">docker-compose.yml — top-level sections</text>
        {[
          { key: "services:", desc: "one entry per container — image/build, ports, env, healthcheck, depends_on, restart" },
          { key: "networks:", desc: "named networks; default driver=bridge; containers reach each other by service name" },
          { key: "volumes:", desc: "named volumes for persistent data; reference in services.volumes" },
          { key: "secrets:", desc: "files mounted at /run/secrets/<name> — safer than env vars for credentials" },
        ].map((r, i) => (
          <g key={i}>
            <text x="28" y={185 + i * 11} fontSize="8" fontWeight="700" fill="#818cf8">{r.key}</text>
            <text x="100" y={185 + i * 11} fontSize="7.5" fill="var(--muted)">{r.desc}</text>
          </g>
        ))}
      </svg>
      <Caption text="Docker Compose describes your entire stack in one YAML file. Services communicate by name on user-defined networks. Named volumes persist data. Use depends_on with condition: service_healthy so services wait for dependencies to be ready." />
    </figure>
  );
}

function DockerVolumesDiagram() {
  const types = [
    { label: "Named Volume", color: "#34d399", loc: "/var/lib/docker/volumes/", note: "Docker-managed · survives rm" },
    { label: "Bind Mount", color: "#38bdf8", loc: "/host/absolute/path", note: "Host-owned · dev live-reload" },
    { label: "tmpfs Mount", color: "#f472b6", loc: "Host RAM only", note: "Never hits disk · secrets/tmp" },
  ];
  return (
    <figure className="not-prose overflow-x-auto rounded-xl border border-[var(--border)] bg-[var(--surface)]">
      <svg viewBox="0 0 530 230" className="w-full" aria-label="Docker storage types — named volume, bind mount, tmpfs">
        <text x="265" y="16" textAnchor="middle" fontSize="11" fontWeight="700" fill="var(--fg)">Docker Storage Types — Named Volume · Bind Mount · tmpfs</text>

        {/* Container box */}
        <rect x="190" y="26" width="150" height="60" rx="8" fill="color-mix(in oklab, #6366f1 10%, transparent)" stroke="#6366f133" strokeWidth="1.4"/>
        <text x="265" y="46" textAnchor="middle" fontSize="9" fontWeight="700" fill="#818cf8">Container</text>
        {types.map((t, i) => (
          <text key={i} x={210 + i * 44} y="68" textAnchor="middle" fontSize="7" fill={t.color}>/data{i + 1}</text>
        ))}

        {/* Lines to storage types */}
        {types.map((t, i) => (
          <line key={i} x1={210 + i * 44} y1="86" x2={80 + i * 185} y2="116"
            stroke={t.color} strokeWidth="1.4" strokeDasharray="4,3"/>
        ))}

        {/* Storage type boxes */}
        {types.map((t, i) => (
          <g key={i}>
            <rect x={20 + i * 165} y="116" width="140" height="52" rx="7"
              fill={`color-mix(in oklab, ${t.color} 10%, transparent)`}
              stroke={`${t.color}44`} strokeWidth="1.3"/>
            <text x={90 + i * 165} y="132" textAnchor="middle" fontSize="8.5" fontWeight="700" fill={t.color}>{t.label}</text>
            <text x={90 + i * 165} y="145" textAnchor="middle" fontSize="7" fill="var(--muted)">{t.loc}</text>
            <text x={90 + i * 165} y="158" textAnchor="middle" fontSize="7" fill="var(--muted)">{t.note}</text>
          </g>
        ))}

        {/* Summary table */}
        <rect x="20" y="178" width="490" height="44" rx="5" fill="#0f172a" stroke="#1e293b" strokeWidth="1"/>
        {[
          { h: "Type", vals: ["Named Volume", "Bind Mount", "tmpfs"] },
          { h: "Survives rm?", vals: ["yes", "yes (host owns)", "no"] },
          { h: "Docker manages?", vals: ["yes", "no", "yes (RAM)"] },
          { h: "Use in prod?", vals: ["✓ databases", "✓ dev only", "✓ secrets"] },
        ].map((row, ri) => (
          <g key={ri}>
            <text x={30 + ri * 120} y="192" fontSize="7.5" fontWeight="700" fill="var(--muted)">{row.h}</text>
            {row.vals.map((v, vi) => (
              <text key={vi} x={30 + ri * 120} y={202 + vi * 9} fontSize="7" fill={types[vi].color}>{v}</text>
            ))}
          </g>
        ))}
      </svg>
      <Caption text="Use named volumes for production databases and stateful services — Docker manages the path and they survive container removal. Use bind mounts only in development for live-reload. Use tmpfs for secrets and tmp data that must never touch disk." />
    </figure>
  );
}

function DockerNetworkingDiagram() {
  return (
    <figure className="not-prose overflow-x-auto rounded-xl border border-[var(--border)] bg-[var(--surface)]">
      <svg viewBox="0 0 530 270" className="w-full" aria-label="Docker networking drivers — bridge, host, overlay">
        <text x="265" y="16" textAnchor="middle" fontSize="11" fontWeight="700" fill="var(--fg)">Docker Network Drivers — bridge · host · overlay</text>

        {/* User-defined bridge */}
        <rect x="16" y="26" width="160" height="120" rx="8" fill="color-mix(in oklab, #38bdf8 6%, transparent)" stroke="#38bdf833" strokeWidth="1.4"/>
        <text x="96" y="41" textAnchor="middle" fontSize="8.5" fontWeight="700" fill="#38bdf8">User-defined bridge</text>
        <text x="96" y="52" textAnchor="middle" fontSize="7" fill="var(--muted)">frontend-net</text>
        {[{ n: "web", x: 30, col: "#38bdf8" }, { n: "api", x: 110, col: "#38bdf8" }].map((c) => (
          <g key={c.n}>
            <rect x={c.x} y="60" width="48" height="22" rx="4"
              fill={`color-mix(in oklab, ${c.col} 15%, transparent)`}
              stroke={`${c.col}44`} strokeWidth="1"/>
            <text x={c.x + 24} y="75" textAnchor="middle" fontSize="8" fontWeight="600" fill={c.col}>{c.n}</text>
          </g>
        ))}
        <line x1="78" y1="82" x2="110" y2="82" stroke="#38bdf8" strokeWidth="1.5" strokeDasharray="3,2"/>
        <text x="96" y="96" textAnchor="middle" fontSize="7" fill="#38bdf8">DNS: ping api ✓</text>
        <rect x="26" y="102" width="140" height="16" rx="3" fill="#1e293b" stroke="#334155" strokeWidth="1"/>
        <text x="96" y="114" textAnchor="middle" fontSize="7" fill="var(--muted)">docker0-like bridge (iptables NAT)</text>
        <text x="96" y="135" textAnchor="middle" fontSize="7" fill="var(--muted)">isolated from other networks</text>

        {/* Host network */}
        <rect x="186" y="26" width="158" height="120" rx="8" fill="color-mix(in oklab, #f59e0b 6%, transparent)" stroke="#f59e0b33" strokeWidth="1.4"/>
        <text x="265" y="41" textAnchor="middle" fontSize="8.5" fontWeight="700" fill="#f59e0b">Host network</text>
        <rect x="200" y="52" width="130" height="22" rx="4"
          fill="color-mix(in oklab, #f59e0b 14%, transparent)" stroke="#f59e0b44" strokeWidth="1"/>
        <text x="265" y="67" textAnchor="middle" fontSize="8" fontWeight="600" fill="#f59e0b">container (--network host)</text>
        <line x1="265" y1="74" x2="265" y2="90" stroke="#f59e0b" strokeWidth="1.5" strokeDasharray="3,2"/>
        <rect x="200" y="90" width="130" height="22" rx="4" fill="#1e293b" stroke="#334155" strokeWidth="1"/>
        <text x="265" y="105" textAnchor="middle" fontSize="7.5" fontWeight="600" fill="var(--fg)">Host Network Stack</text>
        <text x="265" y="126" textAnchor="middle" fontSize="7" fill="var(--muted)">no NAT · no port mapping</text>
        <text x="265" y="137" textAnchor="middle" fontSize="7" fill="var(--muted)">shares host eth0 / lo</text>

        {/* Overlay */}
        <rect x="354" y="26" width="160" height="120" rx="8" fill="color-mix(in oklab, #a78bfa 6%, transparent)" stroke="#a78bfa33" strokeWidth="1.4"/>
        <text x="434" y="41" textAnchor="middle" fontSize="8.5" fontWeight="700" fill="#a78bfa">Overlay (Swarm)</text>
        {[{ n: "svc_A\nHost 1", x: 365 }, { n: "svc_A\nHost 2", x: 430 }].map((c, i) => (
          <g key={i}>
            <rect x={c.x} y="50" width="54" height="28" rx="4"
              fill="color-mix(in oklab, #a78bfa 15%, transparent)" stroke="#a78bfa44" strokeWidth="1"/>
            <text x={c.x + 27} y="64" textAnchor="middle" fontSize="7.5" fontWeight="600" fill="#a78bfa">{c.n.split("\n")[0]}</text>
            <text x={c.x + 27} y="73" textAnchor="middle" fontSize="7" fill="var(--muted)">{c.n.split("\n")[1]}</text>
          </g>
        ))}
        <line x1="419" y1="65" x2="430" y2="65" stroke="#a78bfa" strokeWidth="1.5" strokeDasharray="3,2"/>
        <text x="434" y="94" textAnchor="middle" fontSize="7" fill="#a78bfa">VXLAN tunnel</text>
        <rect x="364" y="99" width="140" height="16" rx="3" fill="#1e293b" stroke="#334155" strokeWidth="1"/>
        <text x="434" y="111" textAnchor="middle" fontSize="7" fill="var(--muted)">encrypted overlay (UDP 4789)</text>
        <text x="434" y="134" textAnchor="middle" fontSize="7" fill="var(--muted)">DNS: by service name</text>

        {/* Physical host bar */}
        <rect x="16" y="152" width="498" height="18" rx="4" fill="#1e293b" stroke="#334155" strokeWidth="1"/>
        <text x="265" y="165" textAnchor="middle" fontSize="8" fontWeight="600" fill="var(--muted)">Physical / Cloud Host — eth0 · iptables · kernel network stack</text>

        {/* Reference table */}
        <rect x="16" y="176" width="498" height="86" rx="6" fill="color-mix(in oklab, #6366f1 5%, transparent)" stroke="#6366f133" strokeWidth="1"/>
        <text x="265" y="190" textAnchor="middle" fontSize="8.5" fontWeight="700" fill="var(--fg)">Quick Reference</text>
        {[
          { driver: "bridge (default)", dns: "no (IP only)", use: "legacy — avoid" },
          { driver: "bridge (user-def)", dns: "yes (name)", use: "single-host apps ✓" },
          { driver: "host", dns: "n/a", use: "high-throughput / proxies" },
          { driver: "none", dns: "n/a", use: "sandboxed / offline tasks" },
          { driver: "overlay", dns: "yes (svc name)", use: "multi-host Swarm" },
          { driver: "macvlan", dns: "no", use: "LAN-visible containers" },
        ].map((r, i) => (
          <g key={i}>
            <text x="30" y={204 + i * 10} fontSize="7.5" fill="#38bdf8">{r.driver}</text>
            <text x="200" y={204 + i * 10} fontSize="7.5" fill="var(--muted)">{r.dns}</text>
            <text x="320" y={204 + i * 10} fontSize="7.5" fill="var(--muted)">{r.use}</text>
          </g>
        ))}
      </svg>
      <Caption text="Always use user-defined bridge networks — Docker's embedded DNS resolves container names automatically. Use host network for latency-sensitive proxies/exporters. Overlay spans Swarm nodes via encrypted VXLAN." />
    </figure>
  );
}

function ContainerLifecycleDiagram() {
  const states = [
    { id: "created", x: 60, y: 90, color: "#94a3b8" },
    { id: "running", x: 200, y: 90, color: "#34d399" },
    { id: "paused", x: 340, y: 40, color: "#fbbf24" },
    { id: "stopped", x: 340, y: 140, color: "#f87171" },
    { id: "removed", x: 460, y: 90, color: "#64748b" },
  ];
  const arrows = [
    { from: [130, 98], to: [172, 98], label: "start", ly: 88 },
    { from: [272, 82], to: [320, 54], label: "pause", ly: 60 },
    { from: [320, 70], to: [272, 92], label: "unpause", ly: 85 },
    { from: [272, 104], to: [320, 136], label: "stop/kill", ly: 132 },
    { from: [320, 148], to: [272, 108], label: "start", ly: 124 },
    { from: [392, 90], to: [432, 90], label: "rm", ly: 84 },
  ];
  return (
    <figure className="not-prose overflow-x-auto rounded-xl border border-[var(--border)] bg-[var(--surface)]">
      <svg viewBox="0 0 530 200" className="w-full" aria-label="Docker container lifecycle state machine">
        <defs>
          <marker id="arrowCL" markerWidth="7" markerHeight="7" refX="6" refY="3.5" orient="auto">
            <polygon points="0 0, 7 3.5, 0 7" fill="#475569"/>
          </marker>
        </defs>
        <text x="265" y="16" textAnchor="middle" fontSize="11" fontWeight="700" fill="var(--fg)">Container Lifecycle — State Machine</text>

        {arrows.map((a, i) => (
          <g key={i}>
            <line x1={a.from[0]} y1={a.from[1]} x2={a.to[0]} y2={a.to[1]}
              stroke="#475569" strokeWidth="1.4" markerEnd="url(#arrowCL)"/>
            <text x={(a.from[0] + a.to[0]) / 2} y={a.ly} textAnchor="middle" fontSize="7" fill="var(--muted)">{a.label}</text>
          </g>
        ))}

        {states.map((s) => (
          <g key={s.id}>
            <rect x={s.x} y={s.y - 14} width="68" height="26" rx="6"
              fill={`color-mix(in oklab, ${s.color} 18%, transparent)`}
              stroke={`${s.color}55`} strokeWidth="1.5"/>
            <text x={s.x + 34} y={s.y + 4} textAnchor="middle" fontSize="9" fontWeight="700" fill={s.color}>{s.id}</text>
          </g>
        ))}

        {/* Commands reference */}
        <rect x="20" y="168" width="490" height="24" rx="5" fill="#0f172a" stroke="#1e293b" strokeWidth="1"/>
        {[
          "docker create → created",
          "docker start → running",
          "docker pause/unpause",
          "docker stop (SIGTERM+SIGKILL)",
          "docker rm → removed",
        ].map((cmd, i) => (
          <text key={i} x={30 + i * 98} y="183" fontSize="7" fill="var(--muted)">{cmd}</text>
        ))}
      </svg>
      <Caption text="A container moves through created → running → paused/stopped → removed. docker stop sends SIGTERM (graceful) then SIGKILL after timeout. Use --restart=unless-stopped for services that must survive daemon restarts." />
    </figure>
  );
}

function DockerfileDiagram() {
  const layers = [
    { label: "ENTRYPOINT/CMD", color: "#f472b6", desc: "container start command" },
    { label: "USER appuser", color: "#a78bfa", desc: "drop root privilege" },
    { label: "HEALTHCHECK", color: "#818cf8", desc: "orchestrator readiness" },
    { label: "EXPOSE 3000", color: "#38bdf8", desc: "document port" },
    { label: "COPY dist/ ./dist/", color: "#34d399", desc: "app build output" },
    { label: "RUN npm ci --omit=dev", color: "#34d399", desc: "prod dependencies" },
    { label: "WORKDIR /app", color: "#fbbf24", desc: "set working dir" },
    { label: "FROM node:20-alpine", color: "#f97316", desc: "base OS + runtime" },
  ];
  return (
    <figure className="not-prose overflow-x-auto rounded-xl border border-[var(--border)] bg-[var(--surface)]">
      <svg viewBox="0 0 530 250" className="w-full" aria-label="Dockerfile layer anatomy">
        <text x="265" y="18" textAnchor="middle" fontSize="11" fontWeight="700" fill="var(--fg)">Dockerfile Layer Anatomy — Each Instruction = One Layer</text>

        {layers.map((layer, i) => {
          const y = 28 + (layers.length - 1 - i) * 24;
          return (
            <g key={i}>
              <rect x="60" y={y} width="300" height="20" rx="4"
                fill={`color-mix(in oklab, ${layer.color} 15%, transparent)`}
                stroke={`${layer.color}44`} strokeWidth="1.2"/>
              <text x="70" y={y + 13} fontSize="8.5" fontWeight="600" fill={layer.color}>{layer.label}</text>
              <text x="370" y={y + 13} fontSize="7.5" fill="var(--muted)">{layer.desc}</text>
              {i < layers.length - 1 && (
                <text x="205" y={y - 2} textAnchor="middle" fontSize="9" fill="#475569">▲</text>
              )}
            </g>
          );
        })}

        {/* Cache hit/miss annotation */}
        <rect x="380" y="50" width="140" height="80" rx="6" fill="#0f172a" stroke="#1e293b" strokeWidth="1"/>
        <text x="450" y="65" textAnchor="middle" fontSize="8.5" fontWeight="700" fill="var(--fg)">Layer Cache</text>
        <text x="450" y="80" textAnchor="middle" fontSize="7.5" fill="#34d399">✓ CACHED</text>
        <text x="450" y="92" textAnchor="middle" fontSize="7" fill="var(--muted)">if instruction + context</text>
        <text x="450" y="103" textAnchor="middle" fontSize="7" fill="var(--muted)">hash unchanged</text>
        <text x="450" y="115" textAnchor="middle" fontSize="7.5" fill="#f87171">✗ INVALIDATED</text>
        <text x="450" y="126" textAnchor="middle" fontSize="7" fill="var(--muted)">cascades to all</text>
        <text x="450" y="137" textAnchor="middle" fontSize="7" fill="var(--muted)">layers above it</text>

        {/* Multi-stage callout */}
        <rect x="20" y="220" width="490" height="22" rx="4" fill="color-mix(in oklab, #6366f1 8%, transparent)" stroke="#6366f133" strokeWidth="1"/>
        <text x="265" y="235" textAnchor="middle" fontSize="8" fill="var(--muted)">
          <tspan fontWeight="700" fill="#818cf8">Multi-stage: </tspan>build stage compiles → runtime stage copies only artefacts → builder layers never ship
        </text>
      </svg>
      <Caption text="Put rarely-changing instructions (FROM, package manifests, npm install) near the bottom to maximise cache hits. Put frequently-changing instructions (COPY src) near the top to minimise rebuild cost." />
    </figure>
  );
}

function ContainerVsVmDiagram() {
  const containerItems = ["App A", "App B", "App C"];
  const vmItems = ["App A", "App B"];
  return (
    <figure className="not-prose overflow-x-auto rounded-xl border border-[var(--border)] bg-[var(--surface)]">
      <svg viewBox="0 0 530 260" className="w-full" aria-label="Container vs VM architecture comparison">
        <text x="265" y="18" textAnchor="middle" fontSize="11" fontWeight="700" fill="var(--fg)">Container vs Virtual Machine — Architecture Comparison</text>

        {/* Container side */}
        <text x="130" y="36" textAnchor="middle" fontSize="10" fontWeight="700" fill="#38bdf8">Containers</text>
        {containerItems.map((app, i) => (
          <g key={i}>
            <rect x={20 + i * 80} y="44" width="70" height="36" rx="5" fill="color-mix(in oklab, #38bdf8 12%, transparent)" stroke="#38bdf833" strokeWidth="1.2"/>
            <text x={55 + i * 80} y="58" textAnchor="middle" fontSize="8.5" fontWeight="600" fill="#38bdf8">{app}</text>
            <text x={55 + i * 80} y="72" textAnchor="middle" fontSize="7.5" fill="var(--muted)">libs+deps</text>
          </g>
        ))}
        <rect x="20" y="86" width="230" height="20" rx="4" fill="color-mix(in oklab, #6366f1 10%, transparent)" stroke="#6366f133" strokeWidth="1"/>
        <text x="135" y="100" textAnchor="middle" fontSize="8" fontWeight="600" fill="#818cf8">Container Runtime (Docker)</text>
        <rect x="20" y="112" width="230" height="20" rx="4" fill="color-mix(in oklab, #10b981 10%, transparent)" stroke="#10b98133" strokeWidth="1"/>
        <text x="135" y="126" textAnchor="middle" fontSize="8" fontWeight="600" fill="#10b981">Host OS Kernel (shared)</text>
        <rect x="20" y="138" width="230" height="20" rx="4" fill="#1e293b" stroke="#334155" strokeWidth="1"/>
        <text x="135" y="152" textAnchor="middle" fontSize="8" fill="var(--muted)">Physical Hardware</text>

        {/* VM side */}
        <text x="400" y="36" textAnchor="middle" fontSize="10" fontWeight="700" fill="#f472b6">Virtual Machines</text>
        {vmItems.map((app, i) => (
          <g key={i}>
            <rect x={290 + i * 120} y="44" width="108" height="78" rx="5" fill="color-mix(in oklab, #f472b6 8%, transparent)" stroke="#f472b633" strokeWidth="1.2"/>
            <text x={344 + i * 120} y="60" textAnchor="middle" fontSize="8.5" fontWeight="600" fill="#f472b6">{app}</text>
            <text x={344 + i * 120} y="74" textAnchor="middle" fontSize="7.5" fill="var(--muted)">libs+deps</text>
            <rect x={298 + i * 120} y="80" width="92" height="16" rx="3" fill="#1e293b" stroke="#334155" strokeWidth="1"/>
            <text x={344 + i * 120} y="92" textAnchor="middle" fontSize="7" fill="#94a3b8">Guest OS kernel</text>
          </g>
        ))}
        <rect x="290" y="128" width="230" height="20" rx="4" fill="color-mix(in oklab, #f59e0b 10%, transparent)" stroke="#f59e0b33" strokeWidth="1"/>
        <text x="405" y="142" textAnchor="middle" fontSize="8" fontWeight="600" fill="#f59e0b">Hypervisor (KVM / VMware)</text>
        <rect x="290" y="154" width="230" height="20" rx="4" fill="color-mix(in oklab, #10b981 10%, transparent)" stroke="#10b98133" strokeWidth="1"/>
        <text x="405" y="168" textAnchor="middle" fontSize="8" fontWeight="600" fill="#10b981">Host OS</text>
        <rect x="290" y="180" width="230" height="20" rx="4" fill="#1e293b" stroke="#334155" strokeWidth="1"/>
        <text x="405" y="194" textAnchor="middle" fontSize="8" fill="var(--muted)">Physical Hardware</text>

        {/* Divider */}
        <line x1="263" y1="32" x2="263" y2="210" stroke="#334155" strokeWidth="1" strokeDasharray="4,3"/>

        {/* Key differences */}
        <rect x="20" y="212" width="490" height="40" rx="5" fill="#0f172a" stroke="#1e293b" strokeWidth="1"/>
        {[
          { label: "Startup", c: "~ms", v: "~30–90s" },
          { label: "Size", c: "MBs", v: "GBs" },
          { label: "Isolation", c: "namespace", v: "full OS" },
          { label: "Overhead", c: "minimal", v: "high" },
        ].map((item, i) => (
          <g key={i}>
            <text x={40 + i * 120} y="228" textAnchor="middle" fontSize="7.5" fontWeight="700" fill="var(--muted)">{item.label}</text>
            <text x={40 + i * 120} y="242" textAnchor="middle" fontSize="8" fill="#38bdf8">{item.c}</text>
            <text x={40 + i * 120} y="246" textAnchor="middle" fontSize="6" fill="var(--muted)">vs</text>
            <text x={40 + i * 120} y="248" textAnchor="middle" fontSize="8" fill="#f472b6">{item.v}</text>
          </g>
        ))}
      </svg>
      <Caption text="Containers share the host kernel and add only app+libs on top — millisecond startup, MB footprint. VMs run a full guest OS per VM — stronger isolation but seconds to start and GB overhead." />
    </figure>
  );
}
