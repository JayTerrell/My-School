import type { Metadata } from "next";
import Link from "next/link";
import { learnerRecord, slotFor, termIndex } from "@/lib/academic";
import { course, gradebook, outcomeMastery, projection, rubricHistory } from "@/lib/data/hist210";
import { learner } from "@/lib/data/learner";
import { getProgram } from "@/lib/data/programs";

export const metadata: Metadata = { title: "Records" };

const TABS = [
  { id: "course", label: "Course gradebook" },
  { id: "term", label: "Program transcript" },
  { id: "outcome", label: "Outcome mastery" },
] as const;

export default async function RecordsPage({ searchParams }: { searchParams: Promise<{ tab?: string }> }) {
  const { tab } = await searchParams;
  const active = TABS.find((t) => t.id === tab)?.id ?? "course";
  const program = getProgram(learner.programId)!;
  const rec = learnerRecord(learner, program);
  const weakest = [...rubricHistory].sort((a, b) => a.got / a.of - b.got / b.of)[0];

  return (
    <main className="shell main">
      <div style={{ marginBottom: 24 }}>
        <div className="label label--lg">Academic record · {learner.name} · {learner.id}</div>
        <h1 className="h1" style={{ fontSize: "clamp(24px,3vw,36px)" }}>Gradebook and transcript</h1>
        <p className="lede" style={{ maxWidth: "64ch" }}>Every grade here links to the work that earned it, the rubric it was scored against, and the sources cited in it.</p>
      </div>

      <nav className="subtabs" aria-label="Records">
        {TABS.map((t) => (
          <Link key={t.id} href={`/records?tab=${t.id}`} scroll={false} className={`subtab${active === t.id ? " subtab--on" : ""}`} aria-current={active === t.id ? "page" : undefined}>
            {t.label}
          </Link>
        ))}
      </nav>

      {active === "course" && (
        <div>
          <div className="card gb">
            <div className="card__head" style={{ padding: "20px 22px", alignItems: "baseline" }}>
              <h2 className="h2">{course.code} — {course.title}</h2>
              <div className="mono" style={{ fontSize: 11, color: "var(--ink-muted)" }}>{course.grade.letter} · {course.grade.score} · {course.grade.gradedPct}% GRADED</div>
            </div>
            <div className="gb__table" role="table">
              <div className="gb__row gb__row--head" role="row">
                <div className="gb__name">ASSIGNMENT</div><div className="gb__cat">CATEGORY</div><div className="gb__status">STATUS</div>
                <div className="gb__score">SCORE</div><div className="gb__ev">EVIDENCE</div>
              </div>
              {gradebook.map((g) => {
                const statusColor = g.status === "GRADED" ? "var(--accent)" : g.status === "LOCKED" ? "var(--ink-label)" : "var(--caution)";
                return (
                  <div key={g.name} role="row" className={`gb__row${g.status !== "GRADED" ? " gb__row--pending" : ""}`}>
                    <div className="gb__name">{g.name}{g.revised && <span className="revised">REVISED</span>}</div>
                    <div className="gb__cat">{g.category}</div>
                    <div className="gb__status" style={{ color: statusColor }}>{g.status}</div>
                    <div className="gb__score" style={{ color: g.score ? "var(--ink)" : "var(--ink-disabled)" }}>{g.score ?? "—"}</div>
                    <div className="gb__ev">
                      {g.evidence ? (
                        g.href ? <Link href={g.href} style={{ color: "var(--accent)" }}>{g.evidence} →</Link> : <span style={{ color: "var(--accent)" }}>{g.evidence} →</span>
                      ) : (
                        <span style={{ color: "var(--ink-disabled)" }}>—</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))", gap: 16, marginTop: 20 }}>
            <div className="card card--pad-22">
              <h3 className="h3" style={{ marginBottom: 14 }}>Rubric history — papers</h3>
              <p className="body-sm" style={{ lineHeight: 1.6, marginBottom: 16 }}>
                {weakest.name} is your weakest dimension across three papers. It is also worth {weakest.of} points on Friday&apos;s essay.
              </p>
              {rubricHistory.map((h) => {
                const pct = Math.round((h.got / h.of) * 100);
                const weak = pct < 70;
                return (
                  <div key={h.name} style={{ marginBottom: 11 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", gap: 10, font: "400 12.5px var(--sans)", marginBottom: 5 }}>
                      <span>{h.name}</span>
                      <span className="mono" style={{ color: weak ? "var(--caution)" : "var(--accent)" }}>{h.got} / {h.of}</span>
                    </div>
                    <div className={`bar${weak ? " bar--caution" : ""}`}><span style={{ width: `${pct}%` }} /></div>
                  </div>
                );
              })}
            </div>
            <div className="card card--pad-22">
              <h3 className="h3" style={{ marginBottom: 14 }}>If Friday goes well</h3>
              <p className="body-sm" style={{ lineHeight: 1.6, marginBottom: 18 }}>Projection, not a promise. Assumes current performance holds on the midterm and final.</p>
              {projection.map((p) => (
                <div className="proj" key={p.scenario}>
                  <span>{p.scenario}</span>
                  <span style={{ color: p.caution ? "var(--caution)" : undefined }}>{p.result}</span>
                </div>
              ))}
              <div className="proj" style={{ color: "var(--ink-muted)" }}><span>Program index effect</span><span>±0.04</span></div>
            </div>
          </div>
        </div>
      )}

      {active === "term" && (
        <div className="card transcript">
          <div className="transcript__head">
            <div className="label">Athenaeum · Independent Programs of Study</div>
            <h2>Record of Study</h2>
            <div style={{ font: "300 14px var(--sans)", color: "var(--ink-muted)" }}>{learner.name} · {program.name} · {learner.id}</div>
            <div className="meta" style={{ fontSize: 10, marginTop: 8 }}>
              UNOFFICIAL · GENERATED {new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }).toUpperCase()} · NOT AN ACCREDITED DEGREE
            </div>
          </div>

          {learner.terms.map((t) => {
            const pTerm = program.terms[t.termIndex];
            const done = Boolean(t.completed);
            const ti = termIndex(learner, program, t.termIndex);
            const credits = pTerm.courses.reduce((a, c) => a + c.credits, 0);
            const head = `${pTerm.label.toUpperCase()} ${t.calendar.split(" ")[1]} — ${done ? `COMPLETE · ${ti?.credits ?? credits} CR · ${ti?.index}` : `IN PROGRESS · ${credits} CR`}`;
            const rows = done
              ? t.completed!.map((c) => ({ code: c.code, grade: c.grade as string, ip: false }))
              : (t.active ?? []).map((c) => ({ code: c.code, grade: `${c.currentGrade}*`, ip: true }));
            return (
              <div className="tx-term" key={t.termIndex}>
                <div className="tx-term__head">{head}</div>
                {rows.map((r) => (
                  <div className="tx-row" key={r.code}>
                    <span>{r.code}</span>
                    <span>{rec.titleFor(r.code)}</span>
                    <span>{slotFor(program, r.code)?.credits}</span>
                    <span className={r.ip ? "ip" : undefined}>{r.grade}</span>
                  </div>
                ))}
              </div>
            );
          })}

          <div className="tx-foot">
            <div style={{ font: "300 12px/1.6 var(--sans)", color: "var(--ink-subtle)", maxWidth: "46ch" }}>
              * In progress; not yet locked. Locked grades cannot be altered after a term closes except through the documented appeals
              process. Every line links to its assignments, rubrics, and cited sources.
            </div>
            <div style={{ display: "flex", gap: 28, flexWrap: "wrap" }}>
              <div className="tx-total"><div className="label">Credits</div><div>{rec.earned}</div></div>
              <div className="tx-total"><div className="label">Index</div><div>{rec.indexText}</div></div>
            </div>
          </div>
          <div className="btn-row" style={{ marginTop: 24 }}>
            <button type="button" className="btn btn--primary" style={{ padding: "11px 17px" }}>Export dossier (PDF)</button>
            <Link href={`/u/${learner.handle}`} className="btn btn--secondary" style={{ padding: "11px 17px" }}>Public verification page</Link>
          </div>
        </div>
      )}

      {active === "outcome" && (
        <div className="card card--pad-26">
          <h2 className="h2" style={{ fontSize: 21, marginBottom: 6 }}>Mastery by learning outcome</h2>
          <p className="lede" style={{ fontSize: 14, margin: "0 0 24px" }}>
            Scored from every item that assessed the outcome — quiz questions, rubric dimensions, seminar posts — not from course averages.
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            {outcomeMastery.map((o) => {
              const weak = o.pct < 70;
              return (
                <div key={o.name}>
                  <div style={{ display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap", alignItems: "baseline", marginBottom: 8 }}>
                    <div style={{ font: "500 14.5px var(--sans)", flex: "1 1 300px" }}>{o.name}</div>
                    <div className="mono" style={{ fontSize: 11, color: weak ? "var(--caution)" : "var(--accent)" }}>
                      {o.pct}% · {o.items} ITEMS{o.label ? ` · ${o.label}` : ""}
                    </div>
                  </div>
                  <div className={`bar bar--5${weak ? " bar--caution" : ""}`}><span style={{ width: `${o.pct}%` }} /></div>
                  {o.note && <p className="body-xs" style={{ margin: "8px 0 0" }}>{o.note}</p>}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </main>
  );
}
