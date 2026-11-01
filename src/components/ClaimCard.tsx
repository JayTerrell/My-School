"use client";

import { useState } from "react";

export function ClaimCard({ meta, title, defaultOpen = false, children }: { meta: string; title: string; defaultOpen?: boolean; children: React.ReactNode }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="card">
      <button type="button" className="claim__head" aria-expanded={open} onClick={() => setOpen((o) => !o)}>
        <div style={{ flex: "1 1 300px" }}>
          <div className="label" style={{ letterSpacing: ".1em", marginBottom: 6 }}>{meta}</div>
          <div className="claim__title">{title}</div>
        </div>
        <div className="textlink" style={{ flex: "0 0 auto" }}>{open ? "CLOSE ✕" : "INSPECT →"}</div>
      </button>
      {open && <div className="claim__body">{children}</div>}
    </div>
  );
}

export function Facts({ cols }: { cols: Array<{ label: string; items: string[] }> }) {
  return (
    <div className="facts">
      {cols.map((c) => (
        <div key={c.label}>
          <div className="label">{c.label}</div>
          <ul>{c.items.map((i) => <li key={i}>{i}</li>)}</ul>
        </div>
      ))}
    </div>
  );
}
