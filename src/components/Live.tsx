"use client";

// Small client islands that show the learner's live working state inside
// otherwise server-rendered pages.

import { clock, wordCount } from "@/lib/academic";
import { lecture, reading } from "@/lib/data/hist210";
import { useLearner } from "./LearnerStore";

export function LectureClock() {
  return <>{clock(useLearner().state.lectureT)}</>;
}

export function LectureStatusText() {
  const { lectureT } = useLearner().state;
  return lectureT >= lecture.duration ? <>Complete</> : <>{clock(lectureT)} in</>;
}

export function SectionsRead() {
  return <>{useLearner().state.readSections} of {reading.sections.length}</>;
}

export function DraftWords() {
  return <>{wordCount(useLearner().state.draft).toLocaleString()}</>;
}

export function NotebookCount() {
  return <>{useLearner().state.notebook.length}</>;
}
