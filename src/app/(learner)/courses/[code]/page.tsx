import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ModuleChecklist } from "@/components/ModuleChecklist";
import { corpus, course, currentModule, gradeWeights, seminar } from "@/lib/data/hist210";

export const metadata: Metadata = { title: `${course.code} — ${course.title}` };

export function generateStaticParams() {
  return [{ code: course.slug }];
}

export default async function CoursePage({ params }: { params: Promise<{ code: string }> }) {
  const { code } = await params;
  if (code !== course.slug) notFound();

  return (
    <main className="shell main">
      <div className="page-head">
        <div>
          <div className="label label--lg">{course.code} · {course.credits} credits · {course.term}</div>
          <h1 className="h1">{course.title}</h1>
          <p className="lede">{course.summary}</p>
        </div>
        <div style={{ textAlign: "right" }}>
          <div className="label">Current grade</div>
          <div style={{ font: "400 34px/1 var(--serif)", marginTop: 6 }}>{course.grade.letter}</div>
          <div className="mono" style={{ fontSize: 12, color: "var(--ink-muted)", marginTop: 4 }}>{course.grade.score} / 100</div>
        </div>
      </div>

      <div className="modules" aria-label="Modules">
        <div className="label" style={{ flex: "0 0 auto", paddingRight: 8, letterSpacing: ".1em" }}>Modules</div>
        {Array.from({ length: course.moduleCount }, (_, i) => i + 1).map((n) => (
          <div
            key={n}
            className={`module-sq ${n < course.currentModule ? "module-sq--done" : n === course.currentModule ? "module-sq--current" : "module-sq--todo"}`}
            aria-label={`Module ${n}${n < course.currentModule ? ", complete" : n === course.currentModule ? ", current" : ""}`}
          >
            {n}
          </div>
        ))}
      </div>

      <div className="cols">
        <div className="col-main">
          <div className="card card--pad-26 mb-20">
            <div className="label label--accent">Module {currentModule.number} · Week {currentModule.week} · {currentModule.hours}</div>
            <h2 style={{ font: "400 clamp(22px,2.6vw,29px)/1.2 var(--serif)", margin: "10px 0 14px", maxWidth: "26ch" }}>{currentModule.title}</h2>
            <p className="lede" style={{ lineHeight: 1.65, margin: "0 0 20px", maxWidth: "64ch" }}>{currentModule.purpose}</p>
            <div className="objectives">
              {currentModule.objectives.map((o) => <div key={o} className="objective">{o}</div>)}
            </div>
          </div>

          <ModuleChecklist />

          <div className="card" id="seminar" style={{ scrollMarginTop: 120 }}>
            <div className="card__head card__head--block">
              <h3 className="h3 h3--19">Seminar — Module {currentModule.number}</h3>
              <p className="body-sm" style={{ marginTop: 6 }}>Posts are structured: a claim, the evidence for it, and the strongest objection you can find.</p>
            </div>
            <div style={{ padding: "20px 22px" }}>
              <div className="card card--inset" style={{ padding: 16, marginBottom: 18 }}>
                <div className="label" style={{ marginBottom: 8 }}>This week&apos;s prompt</div>
                <p style={{ font: "400 16px/1.6 var(--serif)", margin: 0, color: "var(--ink-reading-2)" }}>{seminar.prompt}</p>
              </div>
              <div className="post">
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8, flexWrap: "wrap" }}>
                  <div className="avatar avatar--22" aria-hidden>{seminar.post.initials}</div>
                  <span style={{ font: "500 12.5px var(--sans)" }}>{seminar.post.author}</span>
                  <span className="meta" style={{ fontSize: 10 }}>{seminar.post.meta}</span>
                </div>
                <div className="tag">CLAIM</div>
                <p>{seminar.post.claim}</p>
                <div className="tag">EVIDENCE</div>
                <p>{seminar.post.evidence}</p>
                <div className="tag tag--caution">STRONGEST OBJECTION</div>
                <p style={{ margin: 0, color: "var(--ink-muted)" }}>{seminar.post.objection}</p>
              </div>
              <div className="card card--tint" style={{ padding: 16, marginBottom: 18 }}>
                <div className="label label--accent" style={{ marginBottom: 8 }}>Facilitator · grounded in the course corpus</div>
                <p style={{ font: "300 14px/1.65 var(--sans)", margin: 0, color: "var(--ink-reading-2)" }}>{seminar.facilitator}</p>
              </div>
              <button type="button" className="btn btn--primary" style={{ padding: "12px 18px", fontSize: 13 }}>Compose claim → evidence → counter</button>
            </div>
          </div>
        </div>

        <div className="col-side" style={{ flexBasis: 290 }}>
          <div className="card card--pad">
            <h3 className="h3" style={{ marginBottom: 4 }}>How the grade is built</h3>
            <div className="meta" style={{ fontSize: 10, marginBottom: 16 }}>EARNED {course.grade.score} · {course.grade.gradedPct}% OF TERM GRADED</div>
            {gradeWeights.map((w) => (
              <div className="weight" key={w.name}>
                <div className="weight__row">
                  <span>{w.name} · {w.weight}%</span>
                  <span className={w.score === null ? "empty" : ""}>{w.score ?? "—"}</span>
                </div>
                <div className="bar"><span style={{ width: `${w.score ?? 0}%` }} /></div>
              </div>
            ))}
          </div>

          <div className="card card--pad">
            <h3 className="h3" style={{ marginBottom: 12 }}>Approved corpus</h3>
            <p className="body-sm" style={{ marginBottom: 14 }}>
              Nothing in this course — lecture, quiz, or tutor answer — is drawn from outside these {corpus.total} sources without being marked supplemental.
            </p>
            {corpus.listed.map((s) => (
              <div className="source-line" key={s.id}>
                {s.work ? <>{s.author}, <em className="work">{s.work}</em>{s.after}</> : s.author}{" "}
                <span className="meta" style={{ color: s.access === "OPEN" ? "var(--accent)" : undefined }}>· {s.access}</span>
              </div>
            ))}
            <div className="textlink" style={{ display: "block", borderTop: "1px solid var(--line-faint)", paddingTop: 12 }}>
              + {corpus.total - corpus.listed.length} more →
            </div>
          </div>

          <div className="disclosure">
            <div className="label label--caution" style={{ marginBottom: 8 }}>AI use in this course</div>
            <p className="body-xs" style={{ marginBottom: 10 }}>
              <strong style={{ fontWeight: 500, color: "var(--ink)" }}>Level {course.aiLevel}.</strong> Tutoring, practice, outlining, and
              feedback are permitted and logged. Generated prose may not appear in submitted work.
            </p>
            <div className="textlink">Read the full policy →</div>
          </div>
        </div>
      </div>
    </main>
  );
}
