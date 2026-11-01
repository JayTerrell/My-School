import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ClaimCard, Facts } from "@/components/ClaimCard";
import { learnerRecord, slotFor } from "@/lib/academic";
import { learner } from "@/lib/data/learner";
import { courseClaim, paperClaim, portfolioCounts, reviewerQuotes, transparency, visibility, writtenWork } from "@/lib/data/portfolio";
import { getProgram } from "@/lib/data/programs";

export const metadata: Metadata = { title: `${learner.name} — public dossier` };

export function generateStaticParams() {
  return [{ handle: learner.handle }];
}

const ordinal = ["first", "second", "third", "fourth", "fifth", "sixth", "seventh", "eighth"];
const gradeWord = (g: string) => (g.startsWith("A") ? `an ${g}` : `a ${g}`);

export default async function PortfolioPage({ params }: { params: Promise<{ handle: string }> }) {
  const { handle } = await params;
  if (handle !== learner.handle) notFound();
  const program = getProgram(learner.programId)!;
  const rec = learnerRecord(learner, program);
  const claimGrade = rec.completed.get(courseClaim.code)!;
  const claimTerm = learner.terms.find((t) => t.completed?.some((c) => c.code === courseClaim.code))!;
  const subject = program.formalName.split(", ")[1];

  return (
    <main className="shell main main--tight">
      <div className="card dossier-hero">
        <div style={{ display: "flex", flexWrap: "wrap", gap: 30, alignItems: "flex-start", justifyContent: "space-between" }}>
          <div style={{ flex: "1 1 420px" }}>
            <div className="label" style={{ letterSpacing: ".2em", marginBottom: 14 }}>Public dossier · athenaeum.study/{learner.handle}</div>
            <h1>{learner.name}</h1>
            <p style={{ font: "300 17px/1.6 var(--sans)", color: "var(--ink-secondary)", margin: "0 0 20px", maxWidth: "56ch" }}>
              Reading toward a BA in {subject} — {rec.earned} of {rec.totalCredits} credits, {ordinal[rec.currentTermIndex]} term. Everything below can be opened and checked.
            </p>
            <div className="btn-row">
              <span className="chip chip--accent" style={{ padding: "6px 10px" }}>PUBLIC · VERIFIABLE</span>
              <span className="chip" style={{ padding: "6px 10px" }}>INDEX {rec.indexText}</span>
              <span className="chip" style={{ padding: "6px 10px" }}>
                {rec.completedCount} COURSES · {portfolioCounts.papers} PAPERS · {portfolioCounts.defenses} DEFENSE
              </span>
            </div>
          </div>
          <div className="card card--inset" style={{ flex: "0 1 240px", padding: 20 }}>
            <div className="label" style={{ fontSize: 9.5, marginBottom: 10 }}>Credential status</div>
            <p className="body-xs" style={{ marginBottom: 12 }}>
              Independent program credential. Athenaeum is not accredited and this is not a degree. Its weight comes from the work, which is open.
            </p>
            <div className="textlink">Verify this record →</div>
          </div>
        </div>
      </div>

      <h2 style={{ font: "400 clamp(20px,2.4vw,26px) var(--serif)", margin: "0 0 6px" }}>Claims, and the evidence under them</h2>
      <p className="lede" style={{ fontSize: 14.5, margin: "0 0 18px", maxWidth: "64ch" }}>Open any claim to see what it rests on. Nothing here asks to be taken on trust.</p>

      <div className="stack-12" style={{ marginBottom: 28 }}>
        <ClaimCard
          defaultOpen
          meta={`${courseClaim.code} · ${claimTerm.calendar.toUpperCase()} · LOCKED`}
          title={`Completed ${slotFor(program, courseClaim.code)?.title} with ${gradeWord(claimGrade)}`}
        >
          <Facts cols={[
            { label: "What was done", items: courseClaim.done },
            { label: "How it was scored", items: courseClaim.scored },
            { label: "Who checked it", items: courseClaim.checked },
          ]} />
          <div className="btn-row" style={{ marginTop: 20 }}>
            <button type="button" className="btn btn--primary btn--sm">Read the final paper</button>
            <button type="button" className="btn btn--secondary btn--sm">Watch the defense</button>
            <button type="button" className="btn btn--secondary btn--sm">Authorship receipt</button>
            <button type="button" className="btn btn--tertiary btn--sm">Source list</button>
          </div>
        </ClaimCard>

        <ClaimCard meta={paperClaim.meta} title={paperClaim.title}>
          <p className="quote" style={{ fontSize: 16, lineHeight: 1.75, fontWeight: 400, margin: "20px 0 16px", maxWidth: "64ch" }}>&ldquo;{paperClaim.thesis}&rdquo;</p>
          <Facts cols={[
            { label: "Process", items: paperClaim.process },
            { label: "AI use, declared", items: paperClaim.ai },
            { label: "Evaluation", items: paperClaim.evaluation },
          ]} />
          <div className="btn-row" style={{ marginTop: 20 }}>
            <button type="button" className="btn btn--primary btn--sm">Read both versions side by side</button>
            <button type="button" className="btn btn--secondary btn--sm">Draft timeline</button>
            <button type="button" className="btn btn--secondary btn--sm">Reviewer&apos;s full comments</button>
          </div>
        </ClaimCard>

        <ClaimCard meta="TRANSPARENCY RECORD · ALL TERMS" title="Used AI throughout, and declared all of it">
          <p style={{ font: "300 14.5px/1.7 var(--sans)", color: "var(--ink-secondary)", margin: "20px 0 18px", maxWidth: "66ch" }}>
            The lectures, practice questions, and tutoring in this program are generated from an approved corpus. That is not hidden — it is
            the point, and here is the full accounting of where it touched my work.
          </p>
          {transparency.map((t) => (
            <div key={t.label} style={{ display: "flex", gap: 14, flexWrap: "wrap", padding: "12px 0", borderTop: "1px solid var(--line-faint)", font: "400 13.5px var(--sans)" }}>
              <span style={{ flex: "1 1 240px" }}>{t.label}</span>
              <span className="mono" style={{ fontSize: 12, color: t.good ? "var(--accent)" : "var(--ink-muted)" }}>{t.value}</span>
            </div>
          ))}
        </ClaimCard>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))", gap: 16 }}>
        <div className="card card--pad-22">
          <h3 className="h3" style={{ marginBottom: 14 }}>Written work</h3>
          {writtenWork.map((w) => (
            <div key={w.title} className="rule-top" style={{ padding: "12px 0" }}>
              <div style={{ font: "400 14.5px/1.4 var(--serif)" }}>{w.title}</div>
              <div className="meta" style={{ fontSize: 10, marginTop: 4 }}>{w.meta}</div>
            </div>
          ))}
        </div>
        <div className="card card--pad-22">
          <h3 className="h3" style={{ marginBottom: 14 }}>What reviewers said</h3>
          {reviewerQuotes.map((r) => (
            <div key={r.by} className="rule-top" style={{ padding: "14px 0" }}>
              <p style={{ font: "300 14px/1.7 var(--serif)", color: "var(--ink-reading-2)", margin: "0 0 8px" }}>&ldquo;{r.quote}&rdquo;</p>
              <div className="meta" style={{ fontSize: 10 }}>{r.by}</div>
            </div>
          ))}
        </div>
        <div className="card card--inset card--pad-22">
          <h3 className="h3" style={{ marginBottom: 14 }}>What this page controls</h3>
          <p className="body-sm" style={{ lineHeight: 1.65, marginBottom: 16 }}>
            You choose what is public. Grades, papers, receipts, and defenses can each be shown, hidden, or shared by private link — and a viewer
            is always told when something is withheld.
          </p>
          {visibility.map((v) => (
            <div className="vis-row" key={v.artifact}>
              <span>{v.artifact}</span>
              <span style={{ color: v.level === "PUBLIC" ? "var(--accent)" : v.level === "LINK ONLY" ? "var(--ink-muted)" : "var(--ink-label)" }}>{v.level}</span>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
