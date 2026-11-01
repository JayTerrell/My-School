import type { Metadata } from "next";
import Link from "next/link";
import { DraftWords, LectureClock, LectureStatusText, SectionsRead } from "@/components/Live";
import { learnerRecord, slotFor } from "@/lib/academic";
import { course, essay, lecture, reading } from "@/lib/data/hist210";
import { dashboard, learner } from "@/lib/data/learner";
import { getProgram } from "@/lib/data/programs";

export const metadata: Metadata = { title: "Dashboard" };

const COURSE = `/courses/${course.slug}`;

export default function Dashboard() {
  const program = getProgram(learner.programId)!;
  const rec = learnerRecord(learner, program);
  const current = learner.terms.find((t) => t.termIndex === rec.currentTermIndex)!;
  const inProgress = (current.active ?? []).slice(0, 3);

  return (
    <main className="shell main">
      <div style={{ display: "flex", flexWrap: "wrap", alignItems: "flex-end", gap: 24, marginBottom: 28 }}>
        <div style={{ flex: "1 1 380px" }}>
          <div className="label label--lg">{dashboard.termLabel}</div>
          <h1 className="h1--greeting">Good morning, {learner.firstName}.</h1>
          <p className="lede lede--16">{dashboard.lede}</p>
        </div>
        <div className="stat-strip">
          <div><div className="label">Credits</div><div className="val">{rec.earned}<small> / {rec.totalCredits}</small></div></div>
          <div><div className="label">Index</div><div className="val">{rec.indexText}</div></div>
          <div><div className="label">Standing</div><div className="val" style={{ color: "var(--accent)" }}>{rec.standing}</div></div>
        </div>
      </div>

      <div className="dash-grid">
        <section className="card span-2">
          <div className="card__head">
            <h2 className="h2">Today&apos;s agenda</h2>
            <span className="meta">{dashboard.plannedToday}</span>
          </div>
          <div className="card__body" style={{ paddingTop: 6 }}>
            <Link href={`${COURSE}/lectures/${lecture.id}`} className="agenda-row">
              <div className="agenda-row__time">09:00</div>
              <div style={{ flex: "1 1 180px", minWidth: 0 }}>
                <div className="agenda-row__title">Lecture {lecture.number} — {lecture.title}</div>
                <div className="agenda-row__meta">{course.code} · 42 min · {lecture.format} · <LectureStatusText /></div>
              </div>
              <div className="action" style={{ alignSelf: "center" }}>Resume →</div>
            </Link>
            <Link href={`${COURSE}/readings/${reading.id}`} className="agenda-row">
              <div className="agenda-row__time">11:00</div>
              <div style={{ flex: "1 1 180px", minWidth: 0 }}>
                <div className="agenda-row__title">Reading — Cline, <em className="work">1177 B.C.</em>, ch. 2</div>
                <div className="agenda-row__meta">{reading.pages} · <SectionsRead /> sections worked through</div>
              </div>
              <div className="action" style={{ alignSelf: "center" }}>Open →</div>
            </Link>
            <Link href={`${COURSE}/assignments/${essay.id}`} className="agenda-row">
              <div className="agenda-row__time">14:30</div>
              <div style={{ flex: "1 1 180px", minWidth: 0 }}>
                <div className="agenda-row__title">Draft — comparative essay, {essay.wordLimit.toLocaleString()} words</div>
                <div className="agenda-row__meta">Draft v{essay.draftVersion} · <DraftWords /> words · due Friday 23:59</div>
              </div>
              <div className="action" style={{ alignSelf: "center" }}>Write →</div>
            </Link>
          </div>
        </section>

        <section className="card">
          <div className="card__head"><h2 className="h2">Due soon</h2></div>
          <div className="card__body">
            {dashboard.dueSoon.map((d) => (
              <div key={d.title} className="row" style={{ justifyContent: "space-between", padding: "13px 0", gap: 10 }}>
                <span style={{ font: "400 14px/1.4 var(--sans)" }}>{d.title}</span>
                <span style={{ font: "500 11px var(--mono)", whiteSpace: "nowrap", color: d.days <= 3 ? "var(--caution)" : d.days <= 7 ? "var(--ink-muted)" : "var(--ink-label)" }}>
                  {d.days} DAYS
                </span>
              </div>
            ))}
          </div>
        </section>

        <section className="span-2">
          <h2 className="h2" style={{ marginBottom: 14 }}>Courses in progress</h2>
          <div className="course-cards">
            {inProgress.map((c) => {
              const slot = slotFor(program, c.code)!;
              const inner = (
                <>
                  <div className="label" style={{ fontWeight: 500, letterSpacing: ".1em" }}>{c.code} · {slot.credits} CR</div>
                  <div className="course-card__title">{rec.titleFor(c.code)}</div>
                  <div className="bar"><span style={{ width: `${c.progress}%` }} /></div>
                  <div className="course-card__foot"><span>{c.progress}% complete</span><b>{c.currentGrade}</b></div>
                </>
              );
              return c.code === course.code ? (
                <Link key={c.code} href={COURSE} className="card card--link course-card">{inner}</Link>
              ) : (
                <div key={c.code} className="card course-card">{inner}</div>
              );
            })}
          </div>
        </section>

        <section className="card">
          <div className="card__head card__head--block">
            <h2 className="h2">Where you&apos;re thinnest</h2>
            <p className="body-sm" style={{ marginTop: 6 }}>Drawn from quiz items, seminar posts, and rubric scores.</p>
          </div>
          <div className="card__body" style={{ paddingBottom: 20 }}>
            {dashboard.thinnest.map((s, i) => {
              const weak = s.pct < 70;
              return (
                <div key={s.skill} style={{ padding: i === dashboard.thinnest.length - 1 ? "14px 0 18px" : "14px 0", borderBottom: i === dashboard.thinnest.length - 1 ? "none" : "1px solid var(--line-faint)" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", gap: 10, alignItems: "baseline" }}>
                    <span style={{ font: "400 14px/1.4 var(--sans)" }}>{s.skill}</span>
                    <span style={{ font: "500 11px var(--mono)", color: weak ? "var(--caution)" : "var(--ink-muted)" }}>{s.pct}%</span>
                  </div>
                  <div className={`bar bar--2 ${weak ? "bar--caution" : "bar--muted"}`} style={{ marginTop: 8 }}><span style={{ width: `${s.pct}%` }} /></div>
                </div>
              );
            })}
            <button type="button" className="btn btn--primary btn--block" style={{ padding: "11px 16px", fontSize: 13 }}>Practice these — 14 min</button>
          </div>
        </section>

        <section className="card">
          <div className="card__head"><h2 className="h2">Recent feedback</h2></div>
          <div style={{ padding: "20px 22px" }}>
            <div className="label">{dashboard.feedback.context}</div>
            <p className="quote" style={{ margin: "12px 0 14px" }}>{dashboard.feedback.quote}</p>
            <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
              <div className="avatar avatar--28" aria-hidden>{dashboard.feedback.initials}</div>
              <div>
                <div style={{ font: "500 12px var(--sans)" }}>{dashboard.feedback.reviewer}</div>
                <div className="meta" style={{ fontSize: 10 }}>{dashboard.feedback.role}</div>
              </div>
            </div>
          </div>
        </section>

        <section className="card card--tint span-2" style={{ padding: 22, display: "flex", flexWrap: "wrap", gap: 20, alignItems: "center" }}>
          <div style={{ flex: "1 1 300px" }}>
            <div className="label label--accent">Recommended next</div>
            <div style={{ font: "400 21px/1.3 var(--serif)", margin: "8px 0 6px" }}>Finish Lecture {lecture.number}, then answer Liverani</div>
            <p style={{ font: "300 14px/1.6 var(--sans)", color: "var(--accent-ink)", margin: 0, maxWidth: "56ch" }}>
              The last eleven minutes of the lecture cover exactly the dependency argument your reviewer asked about. Listen, then draft
              the counter-paragraph while it&apos;s fresh.
            </p>
          </div>
          <Link href={`${COURSE}/lectures/${lecture.id}`} className="btn btn--primary btn--lg">Resume at <LectureClock /></Link>
        </section>
      </div>
    </main>
  );
}
