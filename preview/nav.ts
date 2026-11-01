// Navigation for the single-file preview. The hosted page can only carry a
// plain "#name" in its address, so each site path maps to a short view name.

import { useSyncExternalStore } from "react";
import { levels } from "@/lib/data/programs";

const COURSE = "/courses/hist-210";

const fixed: Record<string, string> = {
  dashboard: "/dashboard",
  "degree-audit": "/program",
  course: COURSE,
  lecture: `${COURSE}/lectures/4-1`,
  reading: `${COURSE}/readings/cline-ch2`,
  essay: `${COURSE}/assignments/comparative`,
  portfolio: "/u/ada-reyes",
};

const levelSlug = (l: string) => l.toLowerCase().replace(/[^a-z]/g, "");

/** Turn a site href like "/records?tab=term#x" into a view name and an in-page anchor. */
export function hrefToView(href: string): { name: string; anchor: string | null } {
  const [beforeHash, anchor = null] = href.split("#");
  const [path, qs = ""] = beforeHash.split("?");
  const q = new URLSearchParams(qs);
  if (path === "") return { name: current.name, anchor };
  if (path === "/") {
    const level = q.get("level");
    return { name: level && level !== "All" ? `catalog-${levelSlug(level)}` : "catalog", anchor };
  }
  if (path.startsWith("/programs/")) return { name: `programs-${path.split("/")[2]}`, anchor };
  if (path === "/apply") return { name: q.get("program") ? `apply-${q.get("program")}` : "apply", anchor };
  if (path === "/records") return { name: q.get("tab") && q.get("tab") !== "course" ? `records-${q.get("tab")}` : "records", anchor };
  const named = Object.entries(fixed).find(([, p]) => p === path);
  return { name: named ? named[0] : "catalog", anchor };
}

export interface View {
  name: string;
  path: string;
  params: Record<string, string>;
  searchParams: Record<string, string>;
}

/** Resolve a view name back to the site path and the params its page expects. */
export function resolveView(name: string): View | null {
  if (name === "" || name === "catalog") return { name: "catalog", path: "/", params: {}, searchParams: {} };
  if (name.startsWith("catalog-")) {
    const level = levels.find((l) => levelSlug(l) === name.slice(8));
    return level ? { name, path: "/", params: {}, searchParams: { level } } : null;
  }
  if (name.startsWith("programs-")) return { name, path: `/programs/${name.slice(9)}`, params: { id: name.slice(9) }, searchParams: {} };
  if (name === "apply") return { name, path: "/apply", params: {}, searchParams: {} };
  if (name.startsWith("apply-")) return { name, path: "/apply", params: {}, searchParams: { program: name.slice(6) } };
  if (name === "records") return { name, path: "/records", params: {}, searchParams: {} };
  if (name.startsWith("records-")) return { name, path: "/records", params: {}, searchParams: { tab: name.slice(8) } };
  const path = fixed[name];
  if (!path) return null;
  const parts = path.split("/");
  const params: Record<string, string> =
    path.startsWith(COURSE) ? { code: "hist-210", lectureId: "4-1", readingId: "cline-ch2", assignmentId: "comparative" } : path.startsWith("/u/") ? { handle: parts[2] } : {};
  return { name, path, params, searchParams: {} };
}

// ------------------------------------------------------------------ store

let current: View = resolveView(readHash()) ?? resolveView("catalog")!;
let pendingAnchor: string | null = null;
const listeners = new Set<() => void>();

function readHash() {
  try {
    return decodeURIComponent(window.location.hash.replace(/^#/, ""));
  } catch {
    return "";
  }
}

function emit() {
  listeners.forEach((l) => l());
}

export function scrollToAnchor(anchor: string | null) {
  if (anchor) {
    const el = document.getElementById(anchor);
    if (el) {
      el.scrollIntoView({ block: "start" });
      return;
    }
  }
  window.scrollTo(0, 0);
}

export function navigate(href: string) {
  const { name, anchor } = hrefToView(href);
  const view = resolveView(name);
  if (!view) return;
  if (view.name === current.name) {
    scrollToAnchor(anchor);
    return;
  }
  pendingAnchor = anchor;
  current = view;
  try {
    window.location.hash = view.name;
  } catch {
    /* the frame may refuse; the in-page store still moves */
  }
  emit();
}

export function takePendingAnchor() {
  const a = pendingAnchor;
  pendingAnchor = null;
  return a;
}

window.addEventListener("hashchange", () => {
  const name = readHash();
  if (name === current.name) return;
  const view = resolveView(name);
  if (view) {
    current = view;
    emit();
  } else {
    // A plain in-page anchor such as "#seminar": scroll, stay on this view.
    scrollToAnchor(name);
  }
});

export function useView() {
  return useSyncExternalStore(
    (l) => {
      listeners.add(l);
      return () => listeners.delete(l);
    },
    () => current,
  );
}
