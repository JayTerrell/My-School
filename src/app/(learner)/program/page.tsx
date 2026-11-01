import type { Metadata } from "next";
import Link from "next/link";
import { Schedule } from "@/components/Schedule";
import { buildSchedule, degreeAudit, learnerRecord, projectedCompletion, slotFor, type CourseStatus } from "@/lib/academic";
import { course, provenance } from "@/lib/data/hist210";
import { learner } from "@/lib/data/learner";
import { getProgram } from "@/lib/data/programs";

export const metadata: Metadata = { title: "Degree audit" };

const words = ["zero", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten"];

export default function ProgramPage() {
  const program = getProgram(learner.programId)!;
  const rec = learnerRecord(learner, program);
  const audit = degreeAudit(program, rec);
  const sched = buildSchedule(program, rec);
  const method = audit.find((b) => b.bucket === "method");
  const orientation = audit.find((b) => b.bucket === "orientation");

  const criteria = [
    { ok: rec.earned >= rec.totalCredits && rec.index >= 2, text: `${rec.totalCredits} credits, min. 2.0 index`, note: `${rec.earned} earned` },
    { ok: !!orientation?.done, text: "Orientation & integrity agreement" },
    { ok: !!method?.done, text: `Method sequence, ${method?.required ?? 0} cr`, note: method && !method.done ? `${method.earned} earned${method.inProgress ? `, ${method.inProgress} in progress` : ""}` : undefined },
    { ok: false, text: "Capstone thesis + oral defense" },
    { ok: false, text: "Public dossier published" },
  ];

  const chipNote = (code: string, status: CourseStatus) => {
    const cr = slotFor(program, code)?.credits ?? 0;
    if (status === "COMPLETE") {
      const g = rec.completed.get(code)!;
      return `${cr} CR · ${g === "P" ? "PASS" : g}`;
    }
    if (status === "IN PROGRESS") {
      const a = rec.active.get(code)!;
      return `${cr} CR · ${a.grade} · WEEK ${a.week}`;
    }
    if (status === "LOCKED") return rec.lockReason(code);
    return `${cr} CR · PLANNED`;
  };

  return (
    <main className="shell main">
      <div className="page-head" style={{ gap: 28, marginBottom: 30 }}>
        <div>
          <div className="label label--lg">Degree audit · version {learner.auditVersion}</div>
          <h1 className="h1">{program.formalName}</h1>
          <p className="lede">
            {rec.totalCredits} workload credits · {words[program.terms.length] ?? program.terms.length} terms · capstone thesis with oral defense.
          </p>
        </div>
        <div>
          <div className="label">Projected completion</div>
          <div style={{ font: "400 30px/1.1 var(--serif)", marginTop: 6 }}>{projectedCompletion(learner.startYear, program)}</div>
        </div>
      </div>

      <div className="buckets">
        {audit.map((b) => (
          <div className="card" key={b.bucket}>
            <div className="label" style={{ letterSpacing: ".1em" }}>{b.label}</div>
            {b.bucket === "orientation" && b.done ? (
              <div className="val" style={{ color: "var(--accent)" }}>Passed</div>
            ) : (
              <div className="val">{b.earned}<small> / {b.required}</small></div>
            )}
            <div className="bar"><span style={{ width: `${Math.round((b.earned / b.required) * 100)}%` }} /></div>
            {b.inProgress > 0 && <div className="meta" style={{ fontSize: 10, marginTop: 8 }}>+{b.inProgress} IN PROGRESS</div>}
          </div>
        ))}
      </div>

      <div className="cols">
        <div className="col-main">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", flexWrap: "wrap", gap: 12, marginBottom: 14 }}>
            <h2 className="h2" style={{ fontSize: 22 }}>Curriculum map</h2>
            <div className="legend">
              <span><i className="k-complete" />COMPLETE</span>
              <span><i className="k-active" />ACTIVE</span>
              <span><i className="k-planned" />PLANNED</span>
              <span><i className="k-locked" />LOCKED</span>
            </div>
          </div>
          <div className="cmap">
            {program.terms.map((t, ti) => {
              const isCurrent = ti === rec.currentTermIndex;
              return (
                <div key={t.label} className="card" style={isCurrent ? { border: "2px solid var(--accent)" } : undefined}>
                  <div className="cmap__head" style={isCurrent ? { color: "var(--accent)" } : undefined}>
                    {t.label.toUpperCase()}{isCurrent ? " — CURRENT" : ""}
                  </div>
                  <div className="cmap__chips">
                    {t.courses.map((c) => {
                      const st = rec.status(c.code);
                      const cls = `cchip cchip--${st.replace(" ", "-")}`;
                      const label = `${c.code.startsWith("ELEC") || c.code.startsWith("CONC") ? "" : c.code + " — "}${rec.titleFor(c.code)}`;
                      const body = (<>{label}<small>{chipNote(c.code, st)}</small></>);
                      return c.code === course.code ? (
                        <Link key={c.code} href={`/courses/${course.slug}`} className={cls}>{body}</Link>
                      ) : (
                        <div key={c.code} className={cls}>{body}</div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="col-side">
          <div className="card card--pad">
            <h3 className="h3" style={{ marginBottom: 12 }}>Graduation criteria</h3>
            {criteria.map((c) => (
              <div className="criterion" key={c.text}>
                <span style={{ color: c.ok ? "var(--accent)" : "var(--ink-disabled)", fontSize: 13 }}>{c.ok ? "✓" : "○"}</span>
                <span style={{ flex: 1 }}>
                  {c.text}
                  {c.note && <span style={{ color: "var(--ink-label)" }}> — {c.note}</span>}
                </span>
              </div>
            ))}
          </div>
          <div className="card card--pad">
            <h3 className="h3" style={{ marginBottom: 6 }}>Curriculum provenance</h3>
            <p className="body-sm" style={{ marginBottom: 14 }}>Each badge states exactly what was inspected.</p>
            {provenance.map((b) => (
              <div key={b.text} className={`badge${b.assigned ? "" : " badge--pending"}`}>{b.text}</div>
            ))}
          </div>
          <div className="disclosure">
            <div className="label label--caution" style={{ marginBottom: 8 }}>Disclosure</div>
            <p className="body-xs">
              Athenaeum is not an accredited institution and does not confer accredited degrees. This program yields an independent
              credential whose value rests on the inspectable work behind it.
            </p>
          </div>
        </div>
      </div>

      <div className="card" style={{ marginTop: 28, padding: "clamp(20px,3vw,32px)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", gap: 16, flexWrap: "wrap", alignItems: "flex-end", marginBottom: 24 }}>
          <div style={{ flex: "1 1 360px" }}>
            <div className="label" style={{ marginBottom: 8 }}>Full schedule · {sched.count} courses · {sched.credits} credits</div>
            <h2 className="h2--section">Every class in your program, in order</h2>
            <p className="lede" style={{ fontSize: 14, maxWidth: "60ch" }}>Open any course for its syllabus, weekly time, and how it&apos;s assessed.</p>
          </div>
          <div className="legend" style={{ color: "var(--ink-muted)" }}>
            <span><i className="k-complete" />COMPLETE</span>
            <span><i className="k-active" />IN PROGRESS</span>
            <span><i className="k-planned" />PLANNED</span>
            <span><i className="k-locked" />LOCKED</span>
          </div>
        </div>
        <Schedule terms={sched.terms} />
      </div>
    </main>
  );
}
