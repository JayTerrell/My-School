import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { EssayWorkspace } from "@/components/EssayWorkspace";
import { course, essay } from "@/lib/data/hist210";

export const metadata: Metadata = { title: essay.title };

export function generateStaticParams() {
  return [{ code: course.slug, assignmentId: essay.id }];
}

export default async function AssignmentPage({ params }: { params: Promise<{ code: string; assignmentId: string }> }) {
  const { code, assignmentId } = await params;
  if (code !== course.slug || assignmentId !== essay.id) notFound();
  return (
    <main className="shell main main--tight">
      <div style={{ marginBottom: 24 }}>
        <div className="label label--lg">{essay.context}</div>
        <h1 className="h1" style={{ fontSize: "clamp(24px,3vw,36px)" }}>{essay.title}</h1>
        <p className="lede" style={{ maxWidth: "66ch" }}>{essay.terms}</p>
      </div>
      <EssayWorkspace />
    </main>
  );
}
