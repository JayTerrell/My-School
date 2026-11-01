import type { Metadata } from "next";
import Link from "next/link";
import { getProgram, programs } from "@/lib/data/programs";

export const metadata: Metadata = { title: "Apply" };

export default async function ApplyPage({ searchParams }: { searchParams: Promise<{ program?: string }> }) {
  const { program } = await searchParams;
  const chosen = program ? getProgram(program) : undefined;

  return (
    <main className="shell main main--catalog">
      <div style={{ maxWidth: 720 }}>
        <div className="label label--lg">Admissions · 2026–27</div>
        <h1 className="h1">{chosen ? `Apply to ${chosen.name}` : "Begin an application"}</h1>
        <p className="lede" style={{ marginBottom: 28 }}>
          Applications open with each program&apos;s next intake. Admission starts with an advising conversation about what you want
          to study and the time you can give it — then a short diagnostic, and the orientation course.
        </p>
        <div className="card">
          {programs.map((p) => (
            <Link key={p.id} href={`/programs/${p.id}`} className="row row--link" style={{ padding: "16px 22px", background: p.id === chosen?.id ? "var(--bg-hover)" : undefined }}>
              <div style={{ flex: "1 1 auto" }}>
                <div style={{ font: "400 17px/1.3 var(--serif)" }}>{p.name}</div>
                <div className="meta" style={{ fontSize: 10, marginTop: 4 }}>{p.level.toUpperCase()} · {p.years.toUpperCase()}</div>
              </div>
              <span className="label label--accent">{p.intake}</span>
            </Link>
          ))}
        </div>
        <div className="disclosure" style={{ marginTop: 20 }}>
          <div className="label label--caution" style={{ marginBottom: 8 }}>Before you apply</div>
          <p className="body-xs">
            Athenaeum is not an accredited institution and does not confer accredited degrees. Programs yield an independent credential
            whose value rests on the inspectable work behind it.
          </p>
        </div>
      </div>
    </main>
  );
}
