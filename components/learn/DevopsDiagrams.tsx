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
    default: return null;
  }
}
