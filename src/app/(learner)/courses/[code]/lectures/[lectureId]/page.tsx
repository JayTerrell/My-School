import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { LecturePlayer } from "@/components/LecturePlayer";
import { course, lecture } from "@/lib/data/hist210";

export const metadata: Metadata = { title: `Lecture ${lecture.number} — ${lecture.title}` };

export function generateStaticParams() {
  return [{ code: course.slug, lectureId: lecture.id }];
}

export default async function LecturePage({ params }: { params: Promise<{ code: string; lectureId: string }> }) {
  const { code, lectureId } = await params;
  if (code !== course.slug || lectureId !== lecture.id) notFound();
  return (
    <main className="shell main main--tight">
      <LecturePlayer />
    </main>
  );
}
