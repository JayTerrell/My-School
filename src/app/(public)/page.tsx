import Link from "next/link";
import { programTotals } from "@/lib/academic";
import { levels, programs } from "@/lib/data/programs";

const ideas = [
  {
    n: "01",
    title: "Every claim traces to a source",
    body: "Each statement in a lecture, tutor answer, or quiz links to the passage it rests on. Where the sources disagree, the claim is marked disputed.",
  },
  {
    n: "02",
    title: "Proof of authorship",
    body: "Notebook, outline, drafts, tutor sessions, submission — the writing process is recorded as a receipt that stays attached to the work.",
  },
  {
    n: "03",
    title: "Lectures you can interrupt",
    body: "Stop any lecture to ask for a simpler version, more depth, an example, the opposing view, or a check. Every answer cites the course sources.",
  },
  {
    n: "04",
    title: "Seminars, not feeds",
    body: "Posts carry a claim, the evidence for it, and the strongest objection. A facilitator replies using only the course sources.",
  },
];

export default async function CatalogPage({ searchParams }: { searchParams: Promise<{ level?: string }> }) {
  const { level } = await searchParams;
  const active = levels.find((l) => l === level) ?? "All";
  const shown = programs.filter((p) => active === "All" || p.level === active);

  return (
    <main className="shell main main--catalog">
      <section className="hero">
        <div>
          <div className="label label--lg" style={{ letterSpacing: ".16em", marginBottom: 14 }}>Catalog of programs · 2026–27</div>
          <h1 className="h1--hero">A full course of study, every step of it in the open.</h1>
          <p className="lede lede--17">
            Each program below lists every class you&apos;ll take, in the order you&apos;ll take it, with its syllabus and the time it asks
            of you. Nothing is revealed after you enroll that you can&apos;t read now.
          </p>
        </div>
        <div className="hero__aside">
          Athenaeum is an independent school and is not accredited. Programs lead to an independent credential backed by a public,
          inspectable record of the work.
        </div>
      </section>

      <div className="filters" id="programs">
        <span className="label" style={{ marginRight: 6 }}>Show</span>
        {levels.map((l) => (
          <Link
            key={l}
            href={l === "All" ? "/#programs" : `/?level=${encodeURIComponent(l)}#programs`}
            scroll={false}
            className={`filter${l === active ? " filter--on" : ""}`}
            aria-current={l === active ? "true" : undefined}
          >
            {l}
          </Link>
        ))}
        <span className="meta" style={{ marginLeft: "auto" }}>
          {shown.length} {shown.length === 1 ? "PROGRAM" : "PROGRAMS"}
        </span>
      </div>

      <div className="program-grid">
        {shown.map((p) => {
          const totals = programTotals(p);
          return (
            <Link key={p.id} href={`/programs/${p.id}`} className="card card--link program-card">
              <div style={{ display: "flex", justifyContent: "space-between", gap: 10, alignItems: "baseline" }}>
                <span className="label label--accent" style={{ fontWeight: 500 }}>{p.level}</span>
                <span className="meta" style={{ fontSize: 10 }}>{p.intake}</span>
              </div>
              <h2>{p.name}</h2>
              <p>{p.summary}</p>
              <div className="program-card__stats">
                <div><div className="label">Length</div><div>{p.years}</div></div>
                <div><div className="label">Credits</div><div>{totals.credits}</div></div>
                <div><div className="label">Courses</div><div>{totals.count}</div></div>
              </div>
              <div className="action" style={{ fontSize: 12.5 }}>See every class and syllabus →</div>
            </Link>
          );
        })}
      </div>

      <section id="how-it-works" style={{ scrollMarginTop: 90 }}>
        <div className="ideas">
          {ideas.map((i) => (
            <div className="card" key={i.n}>
              <div className="label label--accent">{i.n}</div>
              <h3>{i.title}</h3>
              <p className="body-sm">{i.body}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
