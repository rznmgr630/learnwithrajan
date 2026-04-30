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
    default: return null;
  }
}
