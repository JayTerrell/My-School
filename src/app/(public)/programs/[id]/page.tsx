import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Schedule } from "@/components/Schedule";
import { buildSchedule } from "@/lib/academic";
import { getProgram, programs } from "@/lib/data/programs";

export function generateStaticParams() {
  return programs.map((p) => ({ id: p.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  return { title: getProgram(id)?.name ?? "Program" };
}

export default async function ProgramDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const p = getProgram(id);
  if (!p) notFound();
  const sched = buildSchedule(p);

  return (
    <main className="shell main main--catalog">
      <Link href="/#programs" className="action" style={{ display: "inline-block", fontSize: 12.5, marginBottom: 22 }}>← All programs</Link>

      <div style={{ display: "flex", flexWrap: "wrap", gap: 28, alignItems: "flex-end", paddingBottom: 28, borderBottom: "1px solid var(--line-strong)", marginBottom: 24 }}>
        <div style={{ flex: "1 1 460px" }}>
          <div className="label label--lg label--accent" style={{ fontWeight: 500, marginBottom: 12 }}>{p.level} · {p.intake}</div>
          <h1 className="h1--program">{p.name}</h1>
          <p className="lede" style={{ fontSize: 16.5, lineHeight: 1.65, color: "var(--ink-secondary)", maxWidth: "60ch" }}>{p.summary}</p>
        </div>
        <div className="stat-strip stat-strip--sm">
          <div><div className="label">Length</div><div className="val">{p.years}</div></div>
          <div><div className="label">Terms</div><div className="val">{p.terms.length}</div></div>
          <div><div className="label">Courses</div><div className="val">{sched.count}</div></div>
          <div><div className="label">Credits</div><div className="val">{sched.credits}</div></div>
          <div><div className="label">Weekly</div><div className="val">{p.weeklyHours}</div></div>
        </div>
      </div>

      <div style={{ marginBottom: 30 }}>
        <div className="label" style={{ marginBottom: 10 }}>Time frame</div>
        <div className="timeline">
          {sched.terms.map((t) => (
            <div key={t.num}>
              <div className="label label--accent" style={{ fontWeight: 500, letterSpacing: 0 }}>{t.num}</div>
              <div style={{ font: "400 13px/1.35 var(--sans)", margin: "4px 0 6px" }}>{t.label}</div>
              <div className="meta" style={{ fontSize: 10 }}>{t.courses.length} courses · {t.credits} cr</div>
            </div>
          ))}
        </div>
      </div>

      <div className="cols" style={{ gap: 24 }}>
        <div className="card" style={{ flex: "1 1 580px", minWidth: 0, padding: "clamp(20px,3vw,32px)" }}>
          <h2 className="h2--section">Program schedule — every class, in order</h2>
          <p className="lede" style={{ fontSize: 14, margin: "0 0 26px", maxWidth: "60ch" }}>
            Open any course to read its syllabus, weekly time, and how it&apos;s assessed.
          </p>
          <Schedule terms={sched.terms} />
        </div>

        <div className="col-side sticky-side">
          <div className="card card--pad-22">
            <h3 className="h3 h3--19" style={{ marginBottom: 14 }}>By the end you will be able to</h3>
            {p.outcomes.map((o) => (
              <div key={o} className="objective" style={{ fontSize: 13.5, lineHeight: 1.6, padding: "10px 0 10px 12px", borderTop: "1px solid var(--line-faint)", marginBottom: 6 }}>{o}</div>
            ))}
          </div>
          <div className="card card--pad-22">
            <h3 className="h3 h3--19" style={{ marginBottom: 10 }}>How you&apos;re assessed</h3>
            <p className="body-sm" style={{ lineHeight: 1.65 }}>
              Rubrics are fixed before each assignment opens. Papers are read by named evaluators, and the final project ends in a
              recorded oral defense. Every grade links to the work that earned it.
            </p>
          </div>
          <div className="card card--tint card--pad-22" id="begin">
            <div className="label label--accent" style={{ marginBottom: 8 }}>{p.intake}</div>
            <div style={{ font: "400 19px/1.3 var(--serif)", marginBottom: 14 }}>Ready to begin?</div>
            <Link href={`/apply?program=${p.id}`} className="btn btn--primary btn--block btn--lg" style={{ marginBottom: 8 }}>Begin application</Link>
            <Link href="/courses/hist-210/lectures/4-1" className="btn btn--outline btn--block btn--lg">Try the first lecture free</Link>
          </div>
        </div>
      </div>
    </main>
  );
}
