// Derivations from the single program + enrollment model. Screens call these
// instead of hard-coding totals, so credits, index, and status always agree.

import { courseDescriptions, courseUnits, type Bucket, type CourseSlot, type Program } from "./data/programs";
import type { LetterGrade, Learner } from "./data/learner";

export type CourseStatus = "COMPLETE" | "IN PROGRESS" | "PLANNED" | "LOCKED";

const gradePoints: Record<LetterGrade, number | null> = {
  A: 4.0, "A−": 3.7, "B+": 3.3, B: 3.0, "B−": 2.7, "C+": 2.3, C: 2.0, P: null,
};

export const isChoiceSlot = (code: string) => code.startsWith("CONC") || code.startsWith("ELEC");

export function bucketOf(program: Program, code: string): Bucket {
  if (code.startsWith("ORIE")) return "orientation";
  if (code.startsWith("CONC")) return "concentration";
  if (code.startsWith("ELEC")) return "elective";
  if (program.capstoneCodes.includes(code)) return "capstone";
  if (program.methodCodes.includes(code)) return "method";
  return "core";
}

export function allSlots(program: Program): CourseSlot[] {
  return program.terms.flatMap((t) => t.courses);
}

export function programTotals(program: Program) {
  const slots = allSlots(program);
  return { credits: slots.reduce((a, c) => a + c.credits, 0), count: slots.length };
}

export function slotFor(program: Program, code: string): CourseSlot | undefined {
  return allSlots(program).find((c) => c.code === code);
}

// ---------------------------------------------------------------- learner record

export function learnerRecord(learner: Learner, program: Program) {
  const completed = new Map<string, LetterGrade>();
  const active = new Map<string, { grade: LetterGrade; progress: number; week: number }>();
  const titles = new Map<string, string>();
  for (const t of learner.terms) {
    for (const c of t.completed ?? []) {
      completed.set(c.code, c.grade);
      if (c.title) titles.set(c.code, c.title);
    }
    for (const c of t.active ?? []) {
      active.set(c.code, { grade: c.currentGrade, progress: c.progress, week: c.week });
      if (c.title) titles.set(c.code, c.title);
    }
  }

  const creditsOf = (code: string) => slotFor(program, code)?.credits ?? 0;

  let earned = 0;
  let qualityPoints = 0;
  let gradedCredits = 0;
  for (const [code, grade] of completed) {
    const cr = creditsOf(code);
    earned += cr;
    const gp = gradePoints[grade];
    if (gp !== null) {
      qualityPoints += gp * cr;
      gradedCredits += cr;
    }
  }
  const index = gradedCredits ? qualityPoints / gradedCredits : 0;
  const inProgressCredits = [...active.keys()].reduce((a, c) => a + creditsOf(c), 0);

  const status = (code: string): CourseStatus => {
    if (completed.has(code)) return "COMPLETE";
    if (active.has(code)) return "IN PROGRESS";
    const slot = slotFor(program, code);
    const unmet = slot?.prereqs.find((p) => !completed.has(p) && !active.has(p));
    return unmet ? "LOCKED" : "PLANNED";
  };

  const lockReason = (code: string) => {
    const slot = slotFor(program, code);
    const unmet = slot?.prereqs.filter((p) => !completed.has(p) && !active.has(p)) ?? [];
    return unmet.length ? `REQUIRES ${unmet.join(", ")}` : "";
  };

  const currentTermIndex = Math.max(...learner.terms.map((t) => t.termIndex));
  const titleFor = (code: string) => titles.get(code) ?? slotFor(program, code)?.title ?? code;

  return {
    completed,
    active,
    earned,
    index,
    indexText: index.toFixed(2),
    standing: index >= 2.0 ? "Good" : "Probation",
    inProgressCredits,
    totalCredits: programTotals(program).credits,
    completedCount: completed.size,
    currentTermIndex,
    status,
    lockReason,
    titleFor,
  };
}

export type LearnerRecord = ReturnType<typeof learnerRecord>;

/** Term-by-term GPA for transcript headers. */
export function termIndex(learner: Learner, program: Program, termIdx: number) {
  const t = learner.terms.find((x) => x.termIndex === termIdx);
  if (!t?.completed) return null;
  let qp = 0;
  let cr = 0;
  let total = 0;
  for (const c of t.completed) {
    const credits = slotFor(program, c.code)?.credits ?? 0;
    total += credits;
    const gp = gradePoints[c.grade];
    if (gp !== null) {
      qp += gp * credits;
      cr += credits;
    }
  }
  return { credits: total, index: cr ? (qp / cr).toFixed(2) : "—" };
}

// ---------------------------------------------------------------- calendar

/** Calendar label for a program term, given an autumn start year. */
export function termCalendar(startYear: number, termIdx: number) {
  const year = startYear + Math.ceil(termIdx / 2);
  return termIdx % 2 === 0 ? `Autumn ${year}` : `Spring ${year}`;
}

export function projectedCompletion(startYear: number, program: Program) {
  const last = program.terms.length - 1;
  const year = startYear + Math.ceil(last / 2);
  return last % 2 === 0 ? `Dec ${year}` : `May ${year}`;
}

// ---------------------------------------------------------------- degree audit

const bucketLabels: Record<Bucket, string> = {
  core: "Core",
  method: "Method",
  concentration: "Concentration",
  elective: "Electives",
  capstone: "Capstone",
  orientation: "Orientation",
};

export function degreeAudit(program: Program, record: LearnerRecord) {
  const order: Bucket[] = ["core", "method", "concentration", "elective", "capstone", "orientation"];
  return order
    .map((b) => {
      const slots = allSlots(program).filter((s) => bucketOf(program, s.code) === b);
      const required = slots.reduce((a, s) => a + s.credits, 0);
      const earned = slots.filter((s) => record.completed.has(s.code)).reduce((a, s) => a + s.credits, 0);
      const inProgress = slots.filter((s) => record.active.has(s.code)).reduce((a, s) => a + s.credits, 0);
      return { bucket: b, label: bucketLabels[b], required, earned, inProgress, done: required > 0 && earned >= required };
    })
    .filter((b) => b.required > 0);
}

// ---------------------------------------------------------------- schedule rows

export interface ScheduleRow {
  n: string;
  key: string;
  code: string;
  displayCode: string;
  title: string;
  credits: number;
  prereqs: string[];
  description: string;
  units: string[];
  time: string;
  assessment: string;
  status?: CourseStatus;
}

export interface ScheduleTerm {
  num: string;
  label: string;
  credits: number;
  courses: ScheduleRow[];
}

function assessmentFor(slot: CourseSlot) {
  if (/Thesis|Capstone/.test(slot.title)) return "Staged drafts · named evaluator · oral defense";
  if (/Defense/.test(slot.title)) return "Recorded oral examination · pass / fail";
  if (slot.code.startsWith("LANG")) return "Weekly translation · two sight-reading exams";
  if (slot.code === "ORIE 100") return "Integrity agreement · planning exercise · pass / fail";
  return "Quizzes 20 · Papers 35 · Seminar 15 · Midterm 15 · Final 15";
}

function descriptionFor(slot: CourseSlot) {
  const known = courseDescriptions[slot.code];
  if (known) return known;
  if (slot.code.startsWith("CONC"))
    return "One course in your chosen region — the Mediterranean, East Asia, South Asia, Africa, or the Americas — taken in sequence across years 3 and 4.";
  if (slot.code.startsWith("ELEC"))
    return "Your choice from any program in the catalog, subject to prerequisites. Approved with your advisor at the start of the term.";
  return `${slot.title} — the full syllabus, reading list, and rubric are published here once the course passes academic review.`;
}

export function buildSchedule(program: Program, record?: LearnerRecord) {
  let n = 0;
  const terms: ScheduleTerm[] = program.terms.map((t, ti) => ({
    num: `TERM ${String(ti + 1).padStart(2, "0")}`,
    label: t.label,
    credits: t.courses.reduce((a, c) => a + c.credits, 0),
    courses: t.courses.map((c) => {
      n += 1;
      return {
        n: String(n).padStart(2, "0"),
        key: `${program.id}:${c.code}`,
        code: c.code,
        displayCode: isChoiceSlot(c.code) ? "—" : c.code,
        title: record ? record.titleFor(c.code) : c.title,
        credits: c.credits,
        prereqs: c.prereqs,
        description: descriptionFor(c),
        units: courseUnits[c.code] ?? [],
        time: `15 weeks · about ${c.credits * 3} h per week`,
        assessment: assessmentFor(c),
        status: record?.status(c.code),
      };
    }),
  }));
  return { terms, ...programTotals(program) };
}

// ---------------------------------------------------------------- formatting

export function clock(t: number) {
  const m = Math.floor(t / 60);
  const s = Math.floor(t % 60);
  return `${m}:${String(s).padStart(2, "0")}`;
}

export function wordCount(text: string) {
  return text.trim().split(/\s+/).filter(Boolean).length;
}
