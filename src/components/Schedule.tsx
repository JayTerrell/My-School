"use client";

// "Every class, in order" accordion. Shared by the public program page and the
// learner's degree audit (which adds a per-course status chip). One row open at a time.

import { useState } from "react";
import type { ScheduleTerm } from "@/lib/academic";

export function Schedule({ terms }: { terms: ScheduleTerm[] }) {
  const [open, setOpen] = useState<string | null>(null);
  return (
    <div>
      {terms.map((t) => (
        <div className="sched-term" key={t.num}>
          <div className="sched-term__head">
            <div style={{ display: "flex", gap: 12, alignItems: "baseline", flexWrap: "wrap" }}>
              <span className="label label--accent" style={{ fontWeight: 500 }}>{t.num}</span>
              <span style={{ font: "400 18px var(--serif)" }}>{t.label}</span>
            </div>
            <span className="label" style={{ letterSpacing: ".08em" }}>
              {t.courses.length} COURSES · {t.credits} CR
            </span>
          </div>
          {t.courses.map((c) => {
            const isOpen = open === c.key;
            return (
              <div className="sched-row" key={c.key}>
                <button
                  type="button"
                  className="sched-row__btn"
                  aria-expanded={isOpen}
                  onClick={() => setOpen(isOpen ? null : c.key)}
                >
                  <span className="sched-row__n">{c.n}</span>
                  <span className="sched-row__code">{c.displayCode}</span>
                  <span className="sched-row__title">
                    {c.title}
                    {c.prereqs.length > 0 && <span className="sched-row__pre">Requires {c.prereqs.join(", ")}</span>}
                  </span>
                  {c.status && <span className={`status status--${c.status.replace(" ", "-")}`}>{c.status}</span>}
                  <span className="sched-row__cr">{c.credits} CR</span>
                  <span className="sched-row__chev" aria-hidden>{isOpen ? "−" : "+"}</span>
                </button>
                {isOpen && (
                  <div className="sched-row__body">
                    <div style={{ flex: "1 1 300px", minWidth: 0 }}>
                      <p className="serif-body" style={{ margin: "0 0 14px", maxWidth: "62ch" }}>{c.description}</p>
                      {c.units.length > 0 && (
                        <>
                          <div className="label" style={{ fontSize: 9.5, marginBottom: 6 }}>Syllabus — units in order</div>
                          {c.units.map((u, i) => (
                            <div className="unit" key={u}>
                              <span>UNIT {i + 1}</span>
                              <span>{u}</span>
                            </div>
                          ))}
                        </>
                      )}
                    </div>
                    <div className="sched-row__facts">
                      <div className="label">Time</div>
                      <div style={{ margin: "2px 0 10px" }}>{c.time}</div>
                      <div className="label">Assessment</div>
                      <div style={{ margin: "2px 0 10px" }}>{c.assessment}</div>
                      <div className="label">Prerequisites</div>
                      <div style={{ marginTop: 2 }}>{c.prereqs.length ? c.prereqs.join(", ") : "None"}</div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}
