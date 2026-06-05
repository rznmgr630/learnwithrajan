"use client";

import { useMemo } from "react";

// ─── Types ────────────────────────────────────────────────────────
export type NodeShape = "rect" | "rounded" | "db" | "diamond";
export type NodeColor = "default" | "accent" | "green" | "orange" | "red" | "muted";

export interface SDNode {
  id: string;
  label: string;
  sub?: string;
  shape?: NodeShape;
  color?: NodeColor;
}

export interface SDEdge {
  from: string;
  to: string;
  label?: string;
  dashed?: boolean;
}

export interface SDiagramConfig {
  nodes: SDNode[];
  edges: SDEdge[];
  /** Each inner array is one row of node IDs, top-to-bottom */
  rows: string[][];
}

// ─── Layout constants ─────────────────────────────────────────────
const NW = 112; // node width
const NH = 40;  // node height
const HG = 14;  // horizontal gap between siblings
const VG = 46;  // vertical gap between rows
const PAD = 20; // outer padding

// ─── Color palettes ───────────────────────────────────────────────
const COLORS: Record<NodeColor, { fill: string; stroke: string; text: string }> = {
  default: { fill: "rgba(30,32,48,0.85)",   stroke: "rgba(100,110,140,0.55)", text: "#c8cfe0" },
  accent:  { fill: "rgba(79,70,229,0.18)",  stroke: "rgba(99,102,241,0.65)",  text: "#a5b4fc" },
  green:   { fill: "rgba(16,185,129,0.15)", stroke: "rgba(52,211,153,0.55)",  text: "#6ee7b7" },
  orange:  { fill: "rgba(245,158,11,0.15)", stroke: "rgba(251,191,36,0.55)",  text: "#fcd34d" },
  red:     { fill: "rgba(239,68,68,0.15)",  stroke: "rgba(252,165,165,0.55)", text: "#fca5a5" },
  muted:   { fill: "rgba(30,32,48,0.5)",    stroke: "rgba(60,65,80,0.4)",     text: "#64748b" },
};
const EDGE_DEFAULT = "rgba(99,102,241,0.65)";
const EDGE_DASHED  = "rgba(100,116,139,0.5)";
const LABEL_COLOR  = "rgba(148,163,184,0.9)";

// ─── Node renderer ────────────────────────────────────────────────
function Node({ node, cx, cy, uid }: { node: SDNode; cx: number; cy: number; uid: string }) {
  const { fill, stroke, text } = COLORS[node.color ?? "default"];
  const x = cx - NW / 2;
  const y = cy - NH / 2;
  const hasSub = !!node.sub;
  const labelY = hasSub ? cy - 7 : cy;
  const subY   = cy + 8;

  let shape: React.ReactNode;

  if (node.shape === "db") {
    const ew = NW / 2 - 1, eh = 7;
    shape = (
      <g>
        <rect x={x} y={y + eh} width={NW} height={NH - eh} rx={3} fill={fill} stroke={stroke} strokeWidth={1.2} />
        <ellipse cx={cx} cy={y + eh} rx={ew} ry={eh} fill={fill} stroke={stroke} strokeWidth={1.2} />
        <ellipse cx={cx} cy={y + NH} rx={ew} ry={eh} fill={fill} stroke={stroke} strokeWidth={1.2} />
      </g>
    );
  } else if (node.shape === "diamond") {
    const pts = `${cx},${y} ${x + NW},${cy} ${cx},${y + NH} ${x},${cy}`;
    shape = <polygon points={pts} fill={fill} stroke={stroke} strokeWidth={1.2} />;
  } else if (node.shape === "rounded") {
    shape = <rect x={x} y={y} width={NW} height={NH} rx={NH / 2} fill={fill} stroke={stroke} strokeWidth={1.2} />;
  } else {
    shape = <rect x={x} y={y} width={NW} height={NH} rx={7} fill={fill} stroke={stroke} strokeWidth={1.2} />;
  }

  return (
    <g key={`${uid}-node-${node.id}`}>
      {shape}
      <text x={cx} y={labelY} textAnchor="middle" dominantBaseline="middle"
        fill={text} fontSize={10} fontWeight="500" style={{ fontFamily: "inherit" }}>
        {node.label}
      </text>
      {hasSub && (
        <text x={cx} y={subY} textAnchor="middle" dominantBaseline="middle"
          fill={text} fontSize={7.5} opacity={0.7} style={{ fontFamily: "inherit" }}>
          {node.sub}
        </text>
      )}
    </g>
  );
}

// ─── Edge renderer ────────────────────────────────────────────────
function Edge({
  fromX, fromY, toX, toY, edge, uid, idx,
}: {
  fromX: number; fromY: number; toX: number; toY: number;
  edge: SDEdge; uid: string; idx: number;
}) {
  const markerId = `${uid}-arrow-${idx}`;
  const color = edge.dashed ? EDGE_DASHED : EDGE_DEFAULT;
  const dy = toY - fromY;

  let d: string;
  let arrowEndX: number, arrowEndY: number;

  if (Math.abs(dy) > 10) {
    // Vertical (or mostly vertical) — exit bottom, enter top
    const sx = fromX, sy = fromY + NH / 2;
    const ex = toX,   ey = toY  - NH / 2 - 6; // -6 so arrow tip lands on the border
    const mY = (sy + ey) / 2;
    d = `M ${sx} ${sy} C ${sx} ${mY}, ${ex} ${mY}, ${ex} ${ey}`;
    arrowEndX = ex; arrowEndY = ey;
  } else {
    // Horizontal — exit right, enter left
    const sx = fromX + NW / 2, sy = fromY;
    const ex = toX   - NW / 2 - 6, ey = toY;
    const mX = (sx + ex) / 2;
    d = `M ${sx} ${sy} C ${mX} ${sy}, ${mX} ${ey}, ${ex} ${ey}`;
    arrowEndX = ex; arrowEndY = ey;
  }

  const midX = (fromX + toX) / 2;
  const midY = (fromY + toY) / 2 - 8;

  return (
    <g key={`${uid}-edge-${idx}`}>
      <defs>
        <marker id={markerId} markerWidth="8" markerHeight="8"
          refX="6" refY="4" orient="auto">
          <polygon points="0 1, 8 4, 0 7" fill={color} />
        </marker>
      </defs>
      <path
        d={d}
        fill="none"
        stroke={color}
        strokeWidth={1.4}
        strokeDasharray={edge.dashed ? "5 3.5" : undefined}
        markerEnd={`url(#${markerId})`}
      />
      {edge.label && (
        <text x={midX} y={midY} textAnchor="middle"
          fill={LABEL_COLOR} fontSize={7.5} style={{ fontFamily: "inherit" }}>
          {edge.label}
        </text>
      )}
    </g>
  );
}

// ─── Main component ───────────────────────────────────────────────
export function SdDiagram({
  config,
  uid = "sd",
}: {
  config: SDiagramConfig;
  uid?: string;
}) {
  const { nodes, edges, rows } = config;

  // Build position map from rows layout
  const positions = useMemo<Record<string, { cx: number; cy: number }>>(() => {
    const maxCols = Math.max(...rows.map((r) => r.length));
    const svgW = Math.max(maxCols * NW + (maxCols - 1) * HG + 2 * PAD, NW + 2 * PAD);
    const pos: Record<string, { cx: number; cy: number }> = {};

    rows.forEach((row, ri) => {
      const rowW = row.length * NW + (row.length - 1) * HG;
      const startX = (svgW - rowW) / 2;
      row.forEach((id, ci) => {
        pos[id] = {
          cx: startX + ci * (NW + HG) + NW / 2,
          cy: PAD + NH / 2 + ri * (NH + VG),
        };
      });
    });
    return pos;
  }, [rows]);

  const maxCols = Math.max(...rows.map((r) => r.length));
  const svgW = Math.max(maxCols * NW + (maxCols - 1) * HG + 2 * PAD, NW + 2 * PAD);
  const svgH = rows.length * NH + (rows.length - 1) * VG + 2 * PAD;

  const nodeMap = useMemo(
    () => Object.fromEntries(nodes.map((n) => [n.id, n])),
    [nodes]
  );

  return (
    <svg
      viewBox={`0 0 ${svgW} ${svgH}`}
      className="h-auto w-full"
      aria-hidden="true"
    >
      {/* Edges behind nodes */}
      {edges.map((edge, i) => {
        const fp = positions[edge.from];
        const tp = positions[edge.to];
        if (!fp || !tp) return null;
        return (
          <Edge
            key={i}
            fromX={fp.cx} fromY={fp.cy}
            toX={tp.cx}   toY={tp.cy}
            edge={edge}
            uid={uid}
            idx={i}
          />
        );
      })}
      {/* Nodes on top */}
      {nodes.map((node) => {
        const pos = positions[node.id];
        if (!pos) return null;
        return <Node key={node.id} node={node} cx={pos.cx} cy={pos.cy} uid={uid} />;
      })}
    </svg>
  );
}
