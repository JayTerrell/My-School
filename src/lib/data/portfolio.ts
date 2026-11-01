// Public dossier content for the seed learner.

export const transparency = [
  { label: "Lectures attended (generated, source-grounded)", value: "61 H · 23 SOURCES", good: false },
  { label: "Tutor sessions, logged with transcripts", value: "74 · 19 H 40 M", good: false },
  { label: "Papers with generated prose in the submission", value: "0 OF 4", good: true },
  { label: "Oral defenses, recorded and public", value: "1 · 22 MIN", good: false },
  { label: "Integrity flags raised, and their outcome", value: "1 · WITHDRAWN AFTER REVIEW", good: false },
];

export const writtenWork = [
  { title: "Reading the Amarna Correspondence", meta: "HIST 240 · 2,100 WORDS · A−" },
  { title: "What the Uluburun Manifest Cannot Tell Us", meta: "HIST 210 · 1,600 WORDS · 94" },
  { title: "Cities Before Writing", meta: "HIST 101 · 2,400 WORDS · A" },
  { title: "Two Readings of the Mycenaean Tablets", meta: "HIST 102 · 1,800 WORDS · B+" },
];

export const reviewerQuotes = [
  { quote: "Reads primary material with unusual care for a second-year student. Should be braver about disagreeing with her sources.", by: "H. MÁRQUEZ, PhD · ESSAY EVALUATOR" },
  { quote: "Defense was calm and specific. When pressed on chronology she conceded the limits of her evidence rather than bluffing — the right instinct.", by: "ORAL DEFENSE PANEL · HIST 101" },
];

export type Visibility = "PUBLIC" | "LINK ONLY" | "PRIVATE";

export const visibility: Array<{ artifact: string; level: Visibility }> = [
  { artifact: "Transcript & grades", level: "PUBLIC" },
  { artifact: "Papers & receipts", level: "PUBLIC" },
  { artifact: "Defense recordings", level: "LINK ONLY" },
  { artifact: "Tutor transcripts", level: "PRIVATE" },
];

export const courseClaim = {
  code: "HIST 101",
  done: ["14 modules · 11 h 20 m of lecture, 96% complete", "1,240 pages across 19 approved sources", "12 quizzes · 3 papers · 26 seminar posts"],
  scored: ["Quizzes 91 · Papers 95 · Seminar 93", "Midterm 89 · Final 94", "Rubrics locked before opening"],
  checked: ["Final paper evaluated by H. Márquez, PhD", "Oral defense, 22 min, recorded", "Scope & sequence reviewed Jan 2026"],
};

export const paperClaim = {
  meta: "HIST 240 · PAPER · B+ → A− ON REVISION",
  title: "Wrote a defensible reading of the Amarna letters",
  thesis:
    "The formulas of brotherhood in the Amarna archive are best read as a protocol of exchange rather than a description of standing — but the Alashiya letters are a real problem for that reading, and I do not think Liverani can be dismissed.",
  process: ["4 drafts over 9 days", "11 tagged quotes, 8 cited", "3 tutor sessions, 41 min, all logged"],
  ai: ["Thesis pressure-testing · yes", "Counterarguments generated then answered · yes", "Generated prose in submission · no"],
  evaluation: ["Rubric 88 → 91 after revision", "Counterargument 13/20 → 17/20", "Evaluator: H. Márquez, PhD"],
};

export const portfolioCounts = { papers: 4, defenses: 1 };
