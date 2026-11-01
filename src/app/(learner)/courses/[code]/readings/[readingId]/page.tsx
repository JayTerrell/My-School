import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Reader } from "@/components/Reader";
import { course, reading } from "@/lib/data/hist210";

export const metadata: Metadata = { title: `Reading — ${reading.title}` };

export function generateStaticParams() {
  return [{ code: course.slug, readingId: reading.id }];
}

export default async function ReadingPage({ params }: { params: Promise<{ code: string; readingId: string }> }) {
  const { code, readingId } = await params;
  if (code !== course.slug || readingId !== reading.id) notFound();
  return (
    <main className="shell main main--tight">
      <Reader />
    </main>
  );
}
