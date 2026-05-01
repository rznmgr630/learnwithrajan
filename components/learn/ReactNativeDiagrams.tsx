"use client";

import { useId } from "react";
import type { Locale } from "@/lib/i18n/types";
import type { LocalizedString } from "@/lib/i18n/types";
import type { RoadmapDetailDiagramId } from "@/lib/challenge-data";
import { pickLocalized } from "@/lib/i18n/pick";
import { RichText } from "@/components/learn/RichText";

const figClass =
  "mt-3 overflow-hidden rounded-lg border border-[var(--border)] bg-[color-mix(in_oklab,var(--elevated)_45%,transparent)] text-[var(--text)]";

const RN_IDS = new Set<RoadmapDetailDiagramId>([
  "react-native-bridge-architecture",
  "react-native-metro-fast-refresh",
  "react-native-component-tree",
  "react-native-flexbox-mobile",
  "react-native-navigation-stacks",
  "react-native-list-windowing",
  "react-native-data-offline-online",
  "react-native-native-module-bridge",
  "react-native-testing-pyramid-mobile",
  "react-native-release-pipeline",
]);

export function isReactNativeRoadmapDiagram(id: RoadmapDetailDiagramId): boolean {
  return RN_IDS.has(id);
}

const CAPTIONS: Partial<Record<RoadmapDetailDiagramId, LocalizedString>> = {
  "react-native-bridge-architecture": {
    en: "**JS thread** runs React and Metro’s bundle—**native side** renders real UI widgets. The **bridge / JSI path** batches work so neither side freezes the phone for long stretches.",
    np: "JS थ्रेड र नेटिव UI — सेतुले दुवै छेउ समन्वय गर्छ।",
    jp: "**JS スレッド**が React とバンドルを動かし、**ネイティブ**が実機 UI を更新。ブリッジ／JSI で効率よく連携します。",
  },
  "react-native-metro-fast-refresh": {
    en: "**Metro** bundles JS for the simulator/device. **Fast Refresh** swaps component updates while keeping lightweight state—you fix UI without losing every text field.",
    np: "Metro ले बन्डल गर्छ; ताजा रिफ्रेसले स्थिति धेरै जोगाउँछ।",
    jp: "**Metro** がパックし、**Fast Refresh** で状態を残しつつコンポーネント更新。入力の再入力を減らします。",
  },
  "react-native-component-tree": {
    en: "**Tree** mirrors web React: **`App`** → **`Screen`** layout → primitives like **`Text`/`View`**. Styles differ (no cascading CSS)—think flex + platform tokens.",
    np: "रूख React जस्तै — Text/View एटमहरू। शैली flex मा धेरै।",
    jp: "React と同様に **`App → Screen → Text/View`**。スタイルは flex ベースが中心です。",
  },
  "react-native-flexbox-mobile": {
    en: "**Yoga** (flex layout) decides **column** growth and **alignment** inside `View`s—pixels come from **`Dimensions`**, **`useWindowDimensions`**, or **`%`** of parents (not vw like browsers).",
    np: "Flex मूलमा — डाइमेनसन डिभाइस अनुसार।",
    jp: "**Yoga** が flex で配置。**`Dimensions`** と親のサイズ関係が Web の vw と違います。",
  },
  "react-native-navigation-stacks": {
    en: "**Stack** pushes screens onto a pile (back pops). **Tabs** keep parallel roots alive—combine both so deep flows use stacks inside each tab.",
    np: "स्टाक गहिराइ; ट्याब समानान्तर फ्लो राख्छ।",
    jp: "**スタック**は積み上げ、**タブ**は並列。**タブの中にスタック**の構成がよく使われます。",
  },
  "react-native-list-windowing": {
    en: "**`FlatList` virtualizes** — only mounts rows near the viewport. Supply **`keyExtractor`** and a stable **`renderItem`**; avoid huge anonymous inline components.",
    np: "FlatList मात्र छेउँका रो माउन्ट गर्छ — keyExtractor स्थिर राख्नुहोस्।",
    jp: "**FlatList** は表示付近のみマウント（仮想化）。**keyExtractor** と軽い **renderItem** が重要です。",
  },
  "react-native-data-offline-online": {
    en: "**Cache + retry**: show **stale-while-revalidate** UX; queues writes when offline; merges when the socket returns.",
    np: "अफलाइनमा क्याश देखाउँछ अनलाइनमा मिलाउँछ।",
    jp: "オフラインはキャッシュ優先・同期で整合。体感を損ねない並び順を設計します。",
  },
  "react-native-native-module-bridge": {
    en: "**JS** calls **`NativeModules`** / **turbo-modules** wrappers; native code (**Swift/Kotlin/Obj-C**) exposes async-safe APIs.",
    np: "JS लेネイティブ मोड्युल बोलाउँछ — टोलीको डक ध्यान दिनुहोस्।",
    jp: "**JS からネイティブ API**へ。公開 API とスレッド安全性をネイティブ側で約束します。",
  },
  "react-native-testing-pyramid-mobile": {
    en: "**Jest + RNTL** for units; detox / Maestro for device flows—mock network at boundaries; snapshots only for dumb UI blobs.",
    np: "एकाइ Jest/RNTL — यन्त्र टेस्ट डिभाइस प्रवाहका लागि।",
    jp: "**Jest と RNTL** で単体・結合。**Detox/Maestro** で実機フロー。ネットワークは境界でモックします。",
  },
  "react-native-release-pipeline": {
    en: "**EAS Build** cooks binaries per profile; stores need **privacy manifests**, screenshots, versioning—iterate **OTA** updates only within platform rules.",
    np: "EAS ले प्रोफाइल अनुसार बिल्ड — स्टोर नियम पालन।",
    jp: "**EAS Build** でプロフィールごとにバイナリ生成。ストア審査と **OTA** の範囲を把握します。",
  },
};

function FigCaption({ caption }: { caption: string }) {
  return (
    <figcaption className="border-b border-[var(--border)] px-3 py-2 text-xs font-medium text-[var(--muted)]">
      <RichText text={caption} />
    </figcaption>
  );
}

export function ReactNativeDiagram({ id, locale }: { id: RoadmapDetailDiagramId; locale: Locale }) {
  const cap = CAPTIONS[id];
  const caption = cap ? pickLocalized(cap, locale) : "";
  const uid = useId().replace(/:/g, "");

  const arrowMarker = (
    <marker id={`rna-${uid}`} markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto">
      <path d="M0,0 L8,4 L0,8 Z" className="fill-[var(--accent)]" />
    </marker>
  );

  switch (id) {
    case "react-native-bridge-architecture":
      return (
        <figure className={figClass}>
          <FigCaption caption={caption} />
          <svg viewBox="0 0 400 168" className="h-auto w-full" aria-hidden>
            <defs>{arrowMarker}</defs>
            <rect x="20" y="24" width="140" height="120" rx="10" className="fill-[color-mix(in_oklab,var(--accent)_12%,transparent)] stroke-[var(--border)]" strokeWidth="1.5" />
            <text x="90" y="56" textAnchor="middle" className="fill-[var(--text)] text-[12px] font-semibold">
              JS thread
            </text>
            <text x="90" y="78" textAnchor="middle" className="fill-[var(--muted)] text-[10px]">
              React • Metro bundle
            </text>
            <rect x="250" y="24" width="130" height="120" rx="10" className="fill-[color-mix(in_oklab,var(--elevated)_70%,transparent)] stroke-[var(--border)]" strokeWidth="1.5" />
            <text x="315" y="56" textAnchor="middle" className="fill-[var(--text)] text-[12px] font-semibold">
              Native
            </text>
            <text x="315" y="78" textAnchor="middle" className="fill-[var(--muted)] text-[10px]">
              UIView / Android views
            </text>
            <line x1="168" y1="84" x2="238" y2="84" stroke="var(--accent)" strokeWidth="2" markerEnd={`url(#rna-${uid})`} />
            <text x="203" y="74" textAnchor="middle" className="fill-[var(--muted)] text-[9px]">
              bridge / JSI
            </text>
          </svg>
        </figure>
      );
    case "react-native-metro-fast-refresh":
      return (
        <figure className={figClass}>
          <FigCaption caption={caption} />
          <svg viewBox="0 0 400 140" className="h-auto w-full" aria-hidden>
            <defs>{arrowMarker}</defs>
            <text x="50" y="28" textAnchor="middle" className="fill-[var(--muted)] text-[10px] uppercase">
              Dev machine
            </text>
            <rect x="10" y="36" width="80" height="44" rx="6" className="fill-[color-mix(in_oklab,var(--elevated)_60%,transparent)] stroke-[var(--border)]" />
            <text x="50" y="62" textAnchor="middle" className="fill-[var(--text)] text-[11px]">
              Metro
            </text>
            <line x1="94" y1="58" x2="130" y2="58" stroke="var(--accent)" strokeWidth="2" markerEnd={`url(#rna-${uid})`} />
            <rect x="132" y="36" width="88" height="44" rx="6" className="fill-[color-mix(in_oklab,var(--accent)_15%,transparent)] stroke-[var(--accent)] stroke-opacity-50" strokeWidth="1.5" />
            <text x="176" y="62" textAnchor="middle" className="fill-[var(--text)] text-[11px]">
              JS bundle
            </text>
            <line x1="224" y1="58" x2="270" y2="58" stroke="var(--accent)" strokeWidth="2" markerEnd={`url(#rna-${uid})`} />
            <rect x="272" y="28" width="118" height="72" rx="10" className="fill-[color-mix(in_oklab,var(--elevated)_70%,transparent)] stroke-[var(--border)]" strokeWidth="1.5" />
            <text x="331" y="52" textAnchor="middle" className="fill-[var(--text)] text-[11px] font-semibold">
              Simulator /
            </text>
            <text x="331" y="68" textAnchor="middle" className="fill-[var(--text)] text-[11px] font-semibold">
              device app
            </text>
            <text x="200" y="118" textAnchor="middle" className="fill-[var(--accent)] text-[10px]">
              Fast Refresh updates components without losing all state
            </text>
          </svg>
        </figure>
      );
    case "react-native-component-tree":
      return (
        <figure className={figClass}>
          <FigCaption caption={caption} />
          <svg viewBox="0 0 360 160" className="h-auto w-full" aria-hidden>
            <rect x="130" y="10" width="100" height="36" rx="6" className="fill-[color-mix(in_oklab,var(--accent)_14%,transparent)] stroke-[var(--accent)] stroke-opacity-50" strokeWidth="1.25" />
            <text x="180" y="32" textAnchor="middle" className="fill-[var(--text)] text-[11px] font-semibold">
              App / Root
            </text>
            <line x1="180" y1="46" x2="180" y2="58" stroke="var(--border)" strokeWidth="1.5" />
            <line x1="100" y1="58" x2="260" y2="58" stroke="var(--border)" strokeWidth="1.5" />
            <line x1="100" y1="58" x2="100" y2="74" stroke="var(--border)" strokeWidth="1.5" />
            <line x1="260" y1="58" x2="260" y2="74" stroke="var(--border)" strokeWidth="1.5" />
            <rect x="50" y="74" width="100" height="36" rx="6" className="fill-[color-mix(in_oklab,var(--elevated)_65%,transparent)] stroke-[var(--border)]" />
            <text x="100" y="94" textAnchor="middle" className="fill-[var(--text)] text-[10px]">
              Screen shell
            </text>
            <rect x="210" y="74" width="100" height="36" rx="6" className="fill-[color-mix(in_oklab,var(--elevated)_65%,transparent)] stroke-[var(--border)]" />
            <text x="260" y="94" textAnchor="middle" className="fill-[var(--text)] text-[10px]">
              Modal host
            </text>
            <line x1="100" y1="110" x2="100" y2="124" stroke="var(--border)" strokeWidth="1.5" />
            <rect
              x="40"
              y="124"
              width="120"
              height="30"
              rx="6"
              className="fill-[color-mix(in_oklab,var(--elevated)_45%,transparent)] stroke-[var(--border)]"
              strokeDasharray="4 3"
              strokeWidth="1"
            />
            <text x="100" y="142" textAnchor="middle" className="fill-[var(--muted)] text-[9px]">
              View / Text / Pressable …
            </text>
          </svg>
        </figure>
      );
    case "react-native-flexbox-mobile":
      return (
        <figure className={figClass}>
          <FigCaption caption={caption} />
          <svg viewBox="0 0 380 148" className="h-auto w-full" aria-hidden>
            <defs>{arrowMarker}</defs>
            <rect x="24" y="40" width="332" height="88" rx="8" className="fill-[color-mix(in_oklab,var(--elevated)_50%,transparent)] stroke-[var(--border)]" />
            <text x="190" y="30" textAnchor="middle" className="fill-[var(--muted)] text-[10px]">
              Parent View — flexDirection: &quot;row&quot;
            </text>
            <line x1="40" y1="56" x2="320" y2="56" stroke="var(--accent)" strokeWidth="2" markerEnd={`url(#rna-${uid})`} />
            <text x="182" y="52" textAnchor="middle" className="fill-[var(--accent)] text-[9px]">
              main axis
            </text>
            <rect x="48" y="72" width="72" height="44" rx="4" className="fill-[color-mix(in_oklab,var(--accent)_18%,transparent)] stroke-[var(--border)]" />
            <rect x="134" y="72" width="72" height="44" rx="4" className="fill-[color-mix(in_oklab,var(--accent)_18%,transparent)] stroke-[var(--border)]" />
            <rect x="220" y="72" width="120" height="44" rx="4" className="fill-[color-mix(in_oklab,var(--accent)_18%,transparent)] stroke-[var(--border)]" />
            <text x="84" y="96" textAnchor="middle" className="fill-[var(--text)] text-[9px]">
              flex:1?
            </text>
            <text x="170" y="96" textAnchor="middle" className="fill-[var(--text)] text-[9px]">
              fixed
            </text>
            <text x="280" y="96" textAnchor="middle" className="fill-[var(--text)] text-[9px]">
              grows
            </text>
          </svg>
        </figure>
      );
    case "react-native-navigation-stacks":
      return (
        <figure className={figClass}>
          <FigCaption caption={caption} />
          <svg viewBox="0 0 400 156" className="h-auto w-full" aria-hidden>
            <rect x="20" y="24" width="110" height="108" rx="8" className="fill-[color-mix(in_oklab,var(--elevated)_60%,transparent)] stroke-[var(--border)]" />
            <text x="75" y="42" textAnchor="middle" className="fill-[var(--text)] text-[10px] font-semibold">
              Tab A (stack)
            </text>
            <rect x="32" y="52" width="86" height="28" rx="4" className="fill-[color-mix(in_oklab,var(--accent)_12%,transparent)] stroke-[var(--border)]" />
            <text x="75" y="69" textAnchor="middle" className="fill-[var(--muted)] text-[9px]">
              Screen 1
            </text>
            <rect x="32" y="86" width="86" height="36" rx="4" className="stroke-[var(--accent)] fill-transparent" strokeWidth="2" />
            <text x="75" y="106" textAnchor="middle" className="fill-[var(--text)] text-[9px]">
              Screen 2 (top)
            </text>
            <rect
              x="145"
              y="24"
              width="110"
              height="108"
              rx="8"
              className="fill-[color-mix(in_oklab,var(--elevated)_38%,transparent)] stroke-[var(--border)]"
              strokeDasharray="5 4"
              strokeWidth="1.5"
            />
            <text x="200" y="42" textAnchor="middle" className="fill-[var(--muted)] text-[10px]">
              Tab B
            </text>
            <rect
              x="278"
              y="24"
              width="102"
              height="108"
              rx="8"
              className="fill-[color-mix(in_oklab,var(--elevated)_38%,transparent)] stroke-[var(--border)]"
              strokeDasharray="5 4"
              strokeWidth="1.5"
            />
            <text x="329" y="42" textAnchor="middle" className="fill-[var(--muted)] text-[10px]">
              Tab C
            </text>
          </svg>
        </figure>
      );
    case "react-native-list-windowing":
      return (
        <figure className={figClass}>
          <FigCaption caption={caption} />
          <svg viewBox="0 0 380 150" className="h-auto w-full" aria-hidden>
            <rect x="100" y="16" width="180" height="118" rx="8" className="fill-[color-mix(in_oklab,var(--elevated)_55%,transparent)] stroke-[var(--border)]" />
            <text x="190" y="34" textAnchor="middle" className="fill-[var(--muted)] text-[9px]">
              Visible window
            </text>
            <rect x="118" y="44" width="144" height="18" rx="3" className="fill-[color-mix(in_oklab,var(--accent)_20%,transparent)]" />
            <rect x="118" y="68" width="144" height="18" rx="3" className="fill-[color-mix(in_oklab,var(--accent)_20%,transparent)]" />
            <rect x="118" y="92" width="144" height="18" rx="3" className="fill-[color-mix(in_oklab,var(--accent)_20%,transparent)]" />
            <text x="190" y="138" textAnchor="middle" className="fill-[var(--muted)] text-[9px]">
              Rows far above/below recycle — keep renderItem pure &amp; memoized rows
            </text>
          </svg>
        </figure>
      );
    case "react-native-data-offline-online":
      return (
        <figure className={figClass}>
          <FigCaption caption={caption} />
          <svg viewBox="0 0 400 134" className="h-auto w-full" aria-hidden>
            <defs>{arrowMarker}</defs>
            <rect x="28" y="40" width="96" height="56" rx="8" className="fill-[color-mix(in_oklab,var(--elevated)_60%,transparent)] stroke-[var(--border)]" />
            <text x="76" y="72" textAnchor="middle" className="fill-[var(--text)] text-[10px]">
              App UI
            </text>
            <rect x="152" y="40" width="96" height="56" rx="8" className="fill-[color-mix(in_oklab,var(--accent)_12%,transparent)] stroke-[var(--accent)] stroke-opacity-50" />
            <text x="200" y="72" textAnchor="middle" className="fill-[var(--text)] text-[10px]">
              Cache layer
            </text>
            <line x1="128" y1="68" x2="146" y2="68" stroke="var(--accent)" strokeWidth="2" markerEnd={`url(#rna-${uid})`} />
            <rect x="276" y="40" width="96" height="56" rx="8" className="fill-[color-mix(in_oklab,var(--elevated)_55%,transparent)] stroke-[var(--border)]" />
            <text x="324" y="72" textAnchor="middle" className="fill-[var(--text)] text-[10px]">
              Backend API
            </text>
            <line x1="252" y1="68" x2="268" y2="68" stroke="var(--accent)" strokeWidth="2" markerEnd={`url(#rna-${uid})`} />
            <text x="200" y="118" textAnchor="middle" className="fill-[var(--muted)] text-[9px]">
              Prefer optimistic UI only when merges are clearly defined on reconnect
            </text>
          </svg>
        </figure>
      );
    case "react-native-native-module-bridge":
      return (
        <figure className={figClass}>
          <FigCaption caption={caption} />
          <svg viewBox="0 0 400 146" className="h-auto w-full" aria-hidden>
            <defs>{arrowMarker}</defs>
            <rect x="32" y="36" width="120" height="72" rx="8" className="fill-[color-mix(in_oklab,var(--accent)_14%,transparent)] stroke-[var(--border)]" />
            <text x="92" y="76" textAnchor="middle" className="fill-[var(--text)] text-[11px] font-semibold">
              JavaScript
            </text>
            <rect x="248" y="36" width="120" height="72" rx="8" className="fill-[color-mix(in_oklab,var(--elevated)_62%,transparent)] stroke-[var(--border)]" />
            <text x="308" y="76" textAnchor="middle" className="fill-[var(--text)] text-[11px] font-semibold">
              Native code
            </text>
            <line x1="156" y1="62" x2="236" y2="62" stroke="var(--accent)" strokeWidth="2" markerEnd={`url(#rna-${uid})`} />
            <line x1="236" y1="82" x2="156" y2="82" stroke="var(--muted)" strokeWidth="1.5" markerEnd={`url(#rna-${uid})`} opacity="0.5" />
            <text x="196" y="54" textAnchor="middle" className="fill-[var(--muted)] text-[8px]">
              call
            </text>
            <text x="196" y="98" textAnchor="middle" className="fill-[var(--muted)] text-[8px]">
              callback / promise
            </text>
          </svg>
        </figure>
      );
    case "react-native-testing-pyramid-mobile":
      return (
        <figure className={figClass}>
          <FigCaption caption={caption} />
          <svg viewBox="0 0 360 150" className="h-auto w-full" aria-hidden>
            <polygon points="180,22 72,132 288,132" className="fill-[color-mix(in_oklab,var(--elevated)_40%,transparent)] stroke-[var(--border)]" strokeWidth="1.5" />
            <polygon points="180,48 100,132 260,132" className="fill-[color-mix(in_oklab,var(--accent)_12%,transparent)] stroke-[var(--accent)] stroke-opacity-50" strokeWidth="1.25" />
            <polygon points="180,78 134,132 226,132" className="fill-[color-mix(in_oklab,var(--accent)_22%,transparent)] stroke-[var(--accent)]" strokeWidth="1.25" />
            <text x="180" y="116" textAnchor="middle" className="fill-[var(--text)] text-[9px]">
              E2E (few)
            </text>
            <text x="180" y="96" textAnchor="middle" className="fill-[var(--text)] text-[9px]">
              Integration / RNTL
            </text>
            <text x="180" y="74" textAnchor="middle" className="fill-[var(--text)] text-[9px] font-semibold">
              Unit (many)
            </text>
          </svg>
        </figure>
      );
    case "react-native-release-pipeline":
      return (
        <figure className={figClass}>
          <FigCaption caption={caption} />
          <svg viewBox="0 0 420 130" className="h-auto w-full" aria-hidden>
            <defs>{arrowMarker}</defs>
            {[0, 1, 2, 3].map((i) => {
              const x = 24 + i * 98;
              return (
                <g key={i}>
                  <rect x={x} y="42" width="84" height="48" rx="8" className="fill-[color-mix(in_oklab,var(--elevated)_58%,transparent)] stroke-[var(--border)]" />
                  <text x={x + 42} y="70" textAnchor="middle" className="fill-[var(--text)] text-[9px]">
                    {["Dev build", "CI tests", "Store binary", "Users"][i]}
                  </text>
                  {i < 3 ? (
                    <line x1={x + 84} y1="66" x2={x + 98} y2="66" stroke="var(--accent)" strokeWidth="2" markerEnd={`url(#rna-${uid})`} />
                  ) : null}
                </g>
              );
            })}
          </svg>
        </figure>
      );
    default:
      return null;
  }
}
