"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";

export interface CourseSidebarItem {
  id: string | number;
  label: string;
  /** When provided, the item renders as a link to this URL instead of firing onSelectItem alone. */
  href?: string;
  /** Nested sub-items, rendered as a collapsible group indented under this item. */
  children?: CourseSidebarItem[];
}

export interface CourseSidebarSection {
  id: string;
  label: string;
  items: CourseSidebarItem[];
}

interface CourseSidebarProps {
  heading: string;
  sections: CourseSidebarSection[];
  activeItemId?: string | number | null;
  onSelectItem?: (id: string | number) => void;
  storageKeyPrefix: string;
  /** Pixels from the viewport top where the sidebar should stick, i.e. the combined height of any sticky bars above it. Defaults to 101 (site header + local back-nav bar). */
  stickyTop?: number;
  /** Controlled mobile-overlay state, for when the trigger button lives outside this component (e.g. in a page's own nav bar). Omit to let CourseSidebar manage its own trigger + state. */
  mobileOpen?: boolean;
  onMobileOpenChange?: (open: boolean) => void;
  /** Hide the built-in "Menu" trigger button, e.g. when a page renders its own trigger elsewhere and drives mobileOpen/onMobileOpenChange instead. */
  hideMobileTrigger?: boolean;
}

function containsActiveId(items: CourseSidebarItem[], activeItemId?: string | number | null): boolean {
  if (activeItemId == null) return false;
  return items.some((item) => item.id === activeItemId || (item.children && containsActiveId(item.children, activeItemId)));
}

function SidebarItemRow({
  item,
  depth,
  storageKeyPrefix,
  activeItemId,
  onSelectItem,
}: {
  item: CourseSidebarItem;
  depth: number;
  storageKeyPrefix: string;
  activeItemId?: string | number | null;
  onSelectItem?: (id: string | number) => void;
}) {
  const hasChildren = !!item.children?.length;
  const storageKey = `${storageKeyPrefix}:item:${item.id}`;
  const [open, setOpen] = useState(() => containsActiveId(item.children ?? [], activeItemId));

  useEffect(() => {
    if (!hasChildren) return;
    try {
      const saved = sessionStorage.getItem(storageKey);
      if (saved !== null) setOpen(saved === "1");
    } catch {}
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const isActive = activeItemId === item.id;
  const linkClassName = `flex-1 rounded-md px-2.5 py-1.5 text-left text-sm transition ${
    isActive
      ? "bg-[var(--accent)]/10 font-medium text-[var(--accent)]"
      : "text-[var(--muted)] hover:bg-[var(--elevated)] hover:text-[var(--text)]"
  }`;

  return (
    <div style={depth ? { paddingLeft: depth * 14 } : undefined}>
      <div className="flex items-center gap-0.5">
        {item.href ? (
          <Link key={item.id} href={item.href} onClick={() => onSelectItem?.(item.id)} className={linkClassName}>
            {item.label}
          </Link>
        ) : (
          <button key={item.id} type="button" onClick={() => onSelectItem?.(item.id)} className={linkClassName}>
            {item.label}
          </button>
        )}
        {hasChildren && (
          <button
            type="button"
            onClick={() =>
              setOpen((prev) => {
                const next = !prev;
                try {
                  sessionStorage.setItem(storageKey, next ? "1" : "0");
                } catch {}
                return next;
              })
            }
            aria-label={open ? "Collapse" : "Expand"}
            className="grid h-6 w-6 shrink-0 place-items-center rounded-md text-[var(--muted)] transition hover:bg-[var(--elevated)] hover:text-[var(--text)]"
          >
            <svg
              className={`h-3.5 w-3.5 shrink-0 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
              viewBox="0 0 20 20"
              fill="currentColor"
              aria-hidden
            >
              <path
                fillRule="evenodd"
                d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.94a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        )}
      </div>
      {hasChildren && open && (
        <div className="mt-0.5 flex flex-col gap-0.5">
          {item.children!.map((child) => (
            <SidebarItemRow
              key={child.id}
              item={child}
              depth={depth + 1}
              storageKeyPrefix={storageKeyPrefix}
              activeItemId={activeItemId}
              onSelectItem={onSelectItem}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function SidebarAccordionSection({
  section,
  storageKeyPrefix,
  activeItemId,
  onSelectItem,
}: {
  section: CourseSidebarSection;
  storageKeyPrefix: string;
  activeItemId?: string | number | null;
  onSelectItem?: (id: string | number) => void;
}) {
  const ref = useRef<HTMLDetailsElement>(null);
  const storageKey = `${storageKeyPrefix}:${section.id}`;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    try {
      const saved = sessionStorage.getItem(storageKey);
      if (saved !== null) el.open = saved === "1";
    } catch {}
    function onToggle() {
      try {
        sessionStorage.setItem(storageKey, el!.open ? "1" : "0");
      } catch {}
    }
    el.addEventListener("toggle", onToggle);
    return () => el.removeEventListener("toggle", onToggle);
  }, [storageKey]);

  return (
    <details
      ref={ref}
      open
      className="open:[&_.course-sidebar-chevron]:rotate-180 overflow-hidden rounded-lg border border-[var(--border)] bg-[color-mix(in_oklab,var(--surface)_92%,transparent)]"
    >
      <summary className="flex cursor-pointer list-none items-center justify-between gap-2 px-3 py-2.5 text-left transition hover:bg-[color-mix(in_oklab,var(--elevated)_35%,transparent)] [&::-webkit-details-marker]:hidden">
        <span className="text-sm font-semibold text-[var(--text)]">{section.label}</span>
        <svg
          className="course-sidebar-chevron h-4 w-4 shrink-0 text-[var(--muted)] transition-transform duration-200"
          viewBox="0 0 20 20"
          fill="currentColor"
          aria-hidden
        >
          <path
            fillRule="evenodd"
            d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.94a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
            clipRule="evenodd"
          />
        </svg>
      </summary>
      <div className="flex flex-col gap-0.5 border-t border-[var(--border)] px-2 py-2">
        {section.items.map((item) => (
          <SidebarItemRow
            key={item.id}
            item={item}
            depth={0}
            storageKeyPrefix={storageKeyPrefix}
            activeItemId={activeItemId}
            onSelectItem={onSelectItem}
          />
        ))}
      </div>
    </details>
  );
}

function SidebarNavList({
  heading,
  sections,
  activeItemId,
  onSelectItem,
  storageKeyPrefix,
  onItemClick,
}: CourseSidebarProps & { onItemClick?: () => void }) {
  return (
    <nav className="flex flex-col gap-3">
      <h2 className="px-1 text-xs font-semibold uppercase tracking-widest text-[var(--faint)]">{heading}</h2>
      {sections.map((section) => (
        <SidebarAccordionSection
          key={section.id}
          section={section}
          storageKeyPrefix={storageKeyPrefix}
          activeItemId={activeItemId}
          onSelectItem={(id) => {
            onSelectItem?.(id);
            onItemClick?.();
          }}
        />
      ))}
    </nav>
  );
}

export function CourseSidebar(props: CourseSidebarProps) {
  const { stickyTop = 101 } = props;
  const [internalOpen, setInternalOpen] = useState(false);
  const mobileOpen = props.mobileOpen ?? internalOpen;
  const setMobileOpen = props.onMobileOpenChange ?? setInternalOpen;
  const navScrollRef = useRef<HTMLDivElement>(null);
  const navScrollStorageKey = `${props.storageKeyPrefix}:navScrollTop`;

  useEffect(() => {
    if (!mobileOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [mobileOpen]);

  // Restore the sidebar's own scroll position after a navigation remounts this
  // component — otherwise clicking a deeply nested item makes the whole menu
  // snap back to its top instead of only the content pane changing.
  useEffect(() => {
    const el = navScrollRef.current;
    if (!el) return;
    try {
      const saved = sessionStorage.getItem(navScrollStorageKey);
      if (saved !== null) el.scrollTop = Number(saved);
    } catch {}
  }, [navScrollStorageKey]);

  function handleNavScroll(e: React.UIEvent<HTMLDivElement>) {
    try {
      sessionStorage.setItem(navScrollStorageKey, String(e.currentTarget.scrollTop));
    } catch {}
  }

  return (
    <>
      <aside className="hidden shrink-0 md:block md:w-64">
        <div
          ref={navScrollRef}
          onScroll={handleNavScroll}
          className="sticky overflow-y-auto pr-1"
          style={{ top: stickyTop, maxHeight: `calc(100vh - ${stickyTop + 16}px)` }}
        >
          <SidebarNavList {...props} />
        </div>
      </aside>

      {!props.hideMobileTrigger && (
        <button
          type="button"
          onClick={() => setMobileOpen(true)}
          className="flex items-center gap-2 self-start rounded-lg border border-[var(--border)] bg-[color-mix(in_oklab,var(--elevated)_50%,transparent)] px-3 py-2 text-sm font-medium text-[var(--text)] transition hover:bg-[var(--elevated)] md:hidden"
        >
          <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden>
            <path fillRule="evenodd" d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 5A.75.75 0 012.75 9h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 9.75zM2.75 14a.75.75 0 000 1.5h14.5a.75.75 0 000-1.5H2.75z" clipRule="evenodd" />
          </svg>
          {props.heading}
        </button>
      )}

      {mobileOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden" role="dialog" aria-modal="true">
          <button
            type="button"
            className="absolute inset-0 bg-black/60 backdrop-blur-[2px]"
            aria-label="Close menu"
            onClick={() => setMobileOpen(false)}
          />
          <div className="relative flex h-full w-full max-w-xs flex-col overflow-y-auto bg-[var(--background)] p-5 shadow-2xl">
            <div className="mb-4 flex items-center justify-between">
              <span className="text-sm font-semibold text-[var(--text)]">{props.heading}</span>
              <button
                type="button"
                onClick={() => setMobileOpen(false)}
                aria-label="Close"
                className="grid h-8 w-8 shrink-0 place-items-center rounded-lg text-[var(--muted)] transition hover:bg-[var(--elevated)] hover:text-[var(--text)]"
              >
                <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M6.28 5.22a.75.75 0 0 0-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 1 0 1.06 1.06L10 11.06l3.72 3.72a.75.75 0 1 0 1.06-1.06L11.06 10l3.72-3.72a.75.75 0 0 0-1.06-1.06L10 8.94 6.28 5.22Z" />
                </svg>
              </button>
            </div>
            <SidebarNavList {...props} onItemClick={() => setMobileOpen(false)} />
          </div>
        </div>
      )}
    </>
  );
}
