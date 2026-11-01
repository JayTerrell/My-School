// Seed learner and enrollment. Every credit total, index, and status on every
// screen is derived from this record (see lib/academic.ts) — nothing is typed
// in twice.

export type LetterGrade = "A" | "A−" | "B+" | "B" | "B−" | "C+" | "C" | "P";

export interface CompletedCourse {
  code: string;
  /** Title as it appears on the transcript (may name the language chosen). */
  title?: string;
  grade: LetterGrade;
}

export interface ActiveCourse {
  code: string;
  title?: string;
  currentGrade: LetterGrade;
  /** Share of the course's graded work completed, 0–100. */
  progress: number;
  week: number;
}

export interface EnrolledTerm {
  /** Index into the program's ordered terms. */
  termIndex: number;
  /** Calendar label, e.g. "Autumn 2025". */
  calendar: string;
  completed?: CompletedCourse[];
  active?: ActiveCourse[];
}

export interface Learner {
  id: string;
  handle: string;
  name: string;
  firstName: string;
  initials: string;
  programId: string;
  year: number;
  auditVersion: string;
  /** Calendar year in which term 1 (an autumn term) began. */
  startYear: number;
  terms: EnrolledTerm[];
}

export const learner: Learner = {
  id: "ATH-2025-0193",
  handle: "ada-reyes",
  name: "Ada Reyes",
  firstName: "Ada",
  initials: "AR",
  programId: "wh",
  year: 2,
  auditVersion: "3.1",
  startYear: 2025,
  terms: [
    {
      termIndex: 0,
      calendar: "Autumn 2025",
      completed: [
        { code: "ORIE 100", grade: "P" },
        { code: "HIST 101", grade: "A" },
        { code: "WRIT 110", grade: "A−" },
        { code: "HIST 150", grade: "A−" },
        { code: "ARTH 140", grade: "B+" },
      ],
    },
    {
      termIndex: 1,
      calendar: "Spring 2026",
      completed: [
        { code: "HIST 102", grade: "B+" },
        { code: "GEOG 120", grade: "A" },
        { code: "PHIL 105", grade: "A−" },
        { code: "LANG 101", title: "Latin I", grade: "A−" },
      ],
    },
    {
      termIndex: 2,
      calendar: "Autumn 2026",
      active: [
        { code: "HIST 210", currentGrade: "A−", progress: 62, week: 6 },
        { code: "HIST 240", currentGrade: "B+", progress: 48, week: 6 },
        { code: "PHIL 180", currentGrade: "A", progress: 55, week: 6 },
        { code: "LANG 102", title: "Latin II", currentGrade: "A−", progress: 58, week: 6 },
      ],
    },
  ],
};

/** Dashboard content for the current week. */
export const dashboard = {
  termLabel: "Autumn Term 2026 · Week 6 of 15",
  lede: "You're two sessions from finishing Module 4. Take the lecture first — the quiz unlocks when you do, and your essay leans on the same sources.",
  plannedToday: "≈ 2 H 40 M PLANNED",
  dueSoon: [
    { title: "Module 4 quiz", days: 2 },
    { title: "Seminar post + reply", days: 3 },
    { title: "Comparative essay draft", days: 5 },
    { title: "Midterm window opens", days: 12 },
  ],
  thinnest: [
    { skill: "Chronology of the collapse", pct: 52 },
    { skill: "Primary vs. secondary evidence", pct: 61 },
    { skill: "Citing archaeological data", pct: 74 },
  ],
  feedback: {
    context: "HIST 240 · Source analysis 2 · B+",
    quote:
      "Your reading of the Amarna correspondence is careful and your provenance note is exactly right. What's missing is the counter-case: Liverani would not accept that the letters show dependency rather than parity. Answer him in one paragraph and this is an A.",
    reviewer: "Dr. Helen Márquez",
    initials: "HM",
    role: "Essay evaluator · verified reviewer",
  },
};
