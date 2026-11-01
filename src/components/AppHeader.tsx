"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import { Brand } from "./Brand";

const COURSE = "/courses/hist-210";

const tabs = [
  { label: "Dashboard", href: "/dashboard", match: (p: string) => p === "/dashboard" },
  { label: "Catalog", href: "/", match: (p: string) => p === "/" || p.startsWith("/programs") },
  { label: "Program", href: "/program", match: (p: string) => p === "/program" },
  { label: "Course", href: COURSE, match: (p: string) => p === COURSE },
  { label: "Lecture", href: `${COURSE}/lectures/4-1`, match: (p: string) => p.includes("/lectures/") },
  { label: "Reading", href: `${COURSE}/readings/cline-ch2`, match: (p: string) => p.includes("/readings/") },
  { label: "Essay", href: `${COURSE}/assignments/comparative`, match: (p: string) => p.includes("/assignments/") },
  { label: "Records", href: "/records", match: (p: string) => p === "/records" },
  { label: "Portfolio", href: "/u/ada-reyes", match: (p: string) => p.startsWith("/u/") },
];

export function AppHeader({ name, meta, initials }: { name: string; meta: string; initials: string }) {
  const pathname = usePathname();
  const nav = useRef<HTMLElement>(null);
  // On phones the tabs are a scrolling strip: keep the active tab in view.
  useEffect(() => {
    nav.current?.querySelector(".tab--active")?.scrollIntoView({ block: "nearest", inline: "center" });
  }, [pathname]);
  return (
    <header className="site-header">
      <div className="shell site-header__inner">
        <Brand href="/dashboard" />
        <div className="spacer" />
        <div className="whoami">
          <div className="whoami__text">
            <div className="whoami__name">{name}</div>
            <div className="whoami__meta">{meta}</div>
          </div>
          <div className="avatar avatar--34" aria-hidden>{initials}</div>
        </div>
        <nav className="tabs" aria-label="Learner" ref={nav}>
          {tabs.map((t) => {
            const active = t.match(pathname);
            return (
              <Link key={t.label} href={t.href} className={`tab${active ? " tab--active" : ""}`} aria-current={active ? "page" : undefined}>
                {t.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
