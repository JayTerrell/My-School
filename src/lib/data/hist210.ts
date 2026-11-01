// HIST 210 — World History I: Antiquity. The one fully built-out course in the
// seed: module, lecture, reading, essay, gradebook, and its approved corpus.
// All sources and quotes are illustrative seed content.

export const course = {
  code: "HIST 210",
  slug: "hist-210",
  title: "World History I: Antiquity",
  credits: 4,
  term: "Autumn 2026",
  summary: "Fourteen modules from the first cities to the end of the Bronze Age, taught from an approved corpus of 23 sources.",
  grade: { letter: "A−", score: 91.4, gradedPct: 62 },
  moduleCount: 14,
  currentModule: 4,
  aiLevel: 2,
};

export const currentModule = {
  number: 4,
  week: 6,
  hours: "≈ 7 h",
  title: "The Bronze Age World: Trade, Palaces, Religion, and Collapse",
  purpose:
    "By the end of this module you should be able to argue — from evidence, not assertion — why a network of literate palace economies came apart within two generations.",
  objectives: [
    "Map the tin and copper routes and explain palace dependence on them.",
    "Read a diplomatic tablet as evidence of parity or dependency.",
    "Weigh the four standing explanations of the collapse against each other.",
    "Distinguish what the archaeology shows from what it is taken to show.",
  ],
};

export const gradeWeights = [
  { name: "Papers", weight: 35, score: 93 as number | null },
  { name: "Quizzes", weight: 20, score: 88 as number | null },
  { name: "Seminar", weight: 15, score: 95 as number | null },
  { name: "Midterm", weight: 15, score: null as number | null },
  { name: "Final", weight: 15, score: null as number | null },
];

export interface CorpusSource {
  id: string;
  short: string;
  /** Rendered as "{author}, <em>{work}</em>{after}" */
  author: string;
  work: string;
  after?: string;
  access: "LICENSED" | "OPEN";
}

export const corpus: { total: number; listed: CorpusSource[] } = {
  total: 23,
  listed: [
    { id: "cline", short: "CLINE 2021", author: "Cline", work: "1177 B.C.", access: "LICENSED" },
    { id: "moran", short: "MORAN 1992", author: "Moran", work: "The Amarna Letters", access: "LICENSED" },
    { id: "kaniewski", short: "KANIEWSKI 2013", author: "Kaniewski et al.", work: "PLoS ONE", after: " 2013", access: "OPEN" },
    { id: "uluburun", short: "ULUBURUN CATALOGUE", author: "Uluburun wreck catalogue, INA", work: "", access: "OPEN" },
  ],
};

export const seminar = {
  prompt:
    "Single-cause explanations of the Bronze Age collapse have all failed. Choose the one you find weakest and say precisely what evidence defeats it.",
  post: {
    author: "J. Tarrant",
    initials: "JT",
    meta: "COHORT · 2 DAYS AGO",
    claim: "The drought-only explanation is the weakest, because its timeline is too coarse to explain the sequence of destructions.",
    evidence: "Kaniewski's pollen cores give a multi-decade signal; Ugarit and Hattusa fall within a handful of years of each other.",
    objection: "Drought need not be proximate — it could raise the probability of every other cause at once.",
  },
  facilitator:
    "Ada — Tarrant's objection is the interesting one, and it's the same move Liverani makes against you in your last paper. If drought is a multiplier rather than a cause, what observation would tell the two apart? Cline offers one on p. 152; say whether you find it decisive.",
};

// ------------------------------------------------------------------ lecture

export type InterruptMode = "simpler" | "deeper" | "example" | "counter" | "quiz";

export const interruptActions: Array<{ mode: InterruptMode; label: string }> = [
  { mode: "simpler", label: "Say that more simply" },
  { mode: "deeper", label: "Go deeper" },
  { mode: "example", label: "Give me an example" },
  { mode: "counter", label: "Who disagrees?" },
  { mode: "quiz", label: "Check I understood" },
];

export interface GroundedAnswer {
  label: string;
  title: string;
  paragraphs: string[];
  citations: string[];
}

export const lecture = {
  id: "4-1",
  number: "4.1",
  title: "Palaces, Tin, and the Sea",
  subtitle: "Why a network of palace economies needed metal it could not produce, and what that dependence cost them.",
  duration: 2520,
  format: "audio-first",
  /** Where the learner left off (seconds). */
  resumeAt: 1104,
  knowledgeCheck: {
    at: "21:00",
    question: "Which of these would most weaken a drought-only account of the collapse?",
    options: [
      "Destruction layers separated by only a few years",
      "Pollen cores showing a long dry period",
      "Letters requesting emergency grain shipments",
    ],
    correct: 0,
    explanation:
      "A drought signal runs over decades. Destructions clustered within a few years are too tightly timed for drought alone to explain — which is Tarrant's point in the seminar. The other two options are evidence a drought account would welcome.",
  },
  segments: [
    {
      at: 902,
      text: "A palace at Mycenae or Ugarit could grow its own grain, press its own oil, and weave its own cloth. What it could not do was make bronze. The tin came from somewhere east of Mesopotamia — perhaps Afghanistan — and the copper from Cyprus.",
      claim: "S1",
    },
    {
      at: 1060,
      text: "So every palace was structurally dependent on people it could not govern. You can watch the anxiety of that dependence in the diplomatic correspondence: kings addressing each other as brothers while haggling over shipments of copper.",
      claim: "S2",
    },
    {
      at: 1215,
      text: "Then, within about fifty years, nearly every one of these palaces burns or is abandoned. I want to be careful here, because this is where the corpus you've been assigned does not speak with one voice.",
      claim: "S3",
    },
    {
      at: 1428,
      text: "Cline treats the collapse as a systems failure — a network so interdependent that shocks propagated. Liverani reads the same evidence as the end of a particular political form…",
      claim: null,
    },
  ] as Array<{ at: number; text: string; claim: ClaimId | null }>,
  seedNotes: [
    { at: 912, text: "Bronze = imported tin + imported copper. Dependence is built into the material itself. Use this as the essay's opening move." },
    { at: 1075, text: "\"Brothers\" language ≠ parity. Check EA 35 again — is Alashiya negotiating from strength?" },
  ],
};

export type ClaimId = "S1" | "S2" | "S3";

export interface Claim {
  status: string;
  disputed: boolean;
  source: string;
  loc: string;
  kind: string;
  excerpt: string;
  note: string;
  short: string;
}

export const claims: Record<ClaimId, Claim> = {
  S1: {
    status: "CORROBORATED · 2 SOURCES AGREE",
    disputed: false,
    source: "Uluburun wreck catalogue",
    loc: "Items 1–40 · INA, Bodrum",
    kind: "PRIMARY · ARCHAEOLOGICAL",
    excerpt: "354 copper oxhide ingots and approximately one tonne of tin, stowed amidships; Cypriot copper by lead-isotope analysis.",
    note: "The lecture claim that tin came from far east of the palaces rests on isotope and trace-element work, not on any text. Cline reports it at 48–50.",
    short: "ULUBURUN CATALOGUE, INA · ITEMS 1–40",
  },
  S2: {
    status: "SUPPORTED · READING IS CONTESTED",
    disputed: false,
    source: "Moran, The Amarna Letters",
    loc: "EA 35 · pp. 107–109",
    kind: "PRIMARY · TRANSLATION",
    excerpt: "\"Send me much copper… and I will send you whatever you desire from my land.\" — the king of Alashiya to the king of Egypt.",
    note: "The words are not in dispute. Whether they show parity or dependency is exactly the question your essay has to answer.",
    short: "AMARNA EA 35 · MORAN 1992, 107",
  },
  S3: {
    status: "DISPUTED · THE CORPUS DISAGREES",
    disputed: true,
    source: "Cline 2021 vs. Liverani 1987",
    loc: "Cline 139–170 · Liverani 66–73",
    kind: "SECONDARY · CONFLICT",
    excerpt: "Cline: a systems collapse propagating through a connected network. Liverani: the end of a political form, not of a civilisation.",
    note: "This segment is marked disputed deliberately. The lecture will not resolve it, and a quiz item will never require you to pick a side — only to state the evidence each reading depends on.",
    short: "CLINE 2021, 139–170 · LIVERANI 1987, 66–73",
  },
};

/** Pre-written, source-cited answers. Served when no model is configured. */
export const seededAnswers: Record<InterruptMode, GroundedAnswer> = {
  simpler: {
    label: "Plainer restatement",
    title: "The short version",
    paragraphs: [
      "Bronze needs two metals. Tin and copper almost never occur in the same place, and neither occurs near the big palaces. So every palace had to import at least one of them, constantly, from people it did not rule.",
      "That is the whole point of this segment: their most important material — for tools, for weapons, for prestige — could only be had by keeping foreign relationships alive. Prosperity and vulnerability were the same fact.",
    ],
    citations: ["CLINE 2021, ch. 2, pp. 44–51 — trade and metal supply", "ULUBURUN CATALOGUE, INA — 10 t copper, 1 t tin"],
  },
  deeper: {
    label: "Deeper",
    title: "What the ratio actually demands",
    paragraphs: [
      "Bronze runs roughly nine parts copper to one part tin. The Uluburun ship carried about ten tonnes of copper ingots and one tonne of tin — a ratio close enough to working bronze that the cargo reads as a deliberate alloy shipment, not a random haul.",
      "That single wreck implies a supply chain competent enough to assemble matched quantities of two metals from different regions and move them together by sea. Infrastructure of that quality does not appear in the archive by accident, and it does not survive a shock lightly.",
    ],
    citations: ["ULUBURUN CATALOGUE, INA — cargo manifest, items 1–40", "CLINE 2021, 48–50 — reading the manifest"],
  },
  example: {
    label: "Worked example",
    title: "EA 35: the king of Alashiya writes",
    paragraphs: [
      "In Amarna letter EA 35 the Cypriot king sends 500 talents of copper to Egypt with an apology — his land has been struck by plague — and then asks for what he wants in return. He calls Akhenaten his brother and uses the deferential formula throughout.",
      "Read it twice. The first reading gives you diplomatic courtesy between equals. The second gives you a supplier explaining a shortfall to a customer he cannot afford to lose. The letter does not tell you which reading is right — that is the argument you are being asked to make.",
    ],
    citations: ["MORAN 1992, EA 35, pp. 107–109", "CLINE 2021, 61–64 — the Alashiya problem"],
  },
  counter: {
    label: "The disagreement",
    title: "Cline and Liverani read this differently",
    paragraphs: [
      "Cline treats the collapse as a systems failure: a network so interdependent that a shock anywhere propagated everywhere. On that account the metal dependency I have just described is the mechanism of failure.",
      "Liverani objects that this mistakes a change of political form for a catastrophe. Palace redistribution ends; trade and population do not stop. The corpus you have been assigned contains both arguments, and the module does not settle it for you — your essay has to.",
    ],
    citations: ["CLINE 2021, 139–170 — systems collapse", "LIVERANI, \"The Collapse of the Near Eastern Regional System\", 1987"],
  },
  quiz: {
    label: "Comprehension check",
    title: "Three questions on what you just heard",
    paragraphs: [
      "1. Name the two metals a palace had to import and say which one travelled furthest. 2. Explain why the Uluburun cargo ratio matters to the argument. 3. State the difference between 'the palaces were interdependent' and 'interdependence caused the collapse'.",
      "Answer aloud or in the note field. Your answers are scored against this lecture's source segments only — if the corpus does not support an answer, you will be told so rather than marked wrong.",
    ],
    citations: ["GROUNDED IN SEGMENTS 15:02–23:48", "ITEMS MAPPED TO LO3, LO4"],
  },
};

// ------------------------------------------------------------------ reading

export type QuoteId = "Q1" | "Q2" | "Q3";

export const reading = {
  id: "cline-ch2",
  title: "1177 B.C.: The Year Civilization Collapsed",
  author: "Eric H. Cline",
  publisher: "Princeton UP, rev. ed. 2021",
  type: "SECONDARY, MONOGRAPH",
  access: "LICENSED",
  reviewed: "H. MÁRQUEZ, JAN 2026",
  chapter: "Chapter 2",
  pages: "pp. 43–78",
  sections: [
    "§1 A cosmopolitan age",
    "§2 The Uluburun ship",
    "§3 Tin from the east",
    "§4 Palace accounting",
    "§5 Kings as brothers",
    "§6 The Alashiya problem",
    "§7 Trade and warfare",
    "§8 Diplomatic gifts",
    "§9 What the archive omits",
  ],
  /** Sections already worked through in the seed. */
  seedRead: 4,
  page: { section: "§5 · pp. 61–64", heading: "Kings as brothers" },
};

/** Paragraphs of §5. A string is plain text; an object is a highlightable passage. */
export const readingParagraphs: Array<Array<string | { quote: QuoteId; text: string; tone: "supports" | "complicates" }>> = [
  ["The letters exchanged between the great courts of the fourteenth century are, on their surface, documents of warmth. Rulers address one another as brothers. They ask after each other's households, horses, and chariots, and they send extravagant gifts."],
  [
    "But ",
    { quote: "Q1", tone: "supports", text: "the language of kinship in these archives is a protocol, not a description. It regulates what may be asked for and in what tone; it does not tell us who needed whom." },
    " A king who must write three times for a shipment of copper is not, whatever he is called, an equal.",
  ],
  [
    "The Alashiya correspondence is the sharpest case. ",
    { quote: "Q2", tone: "complicates", text: "Cyprus held the copper, and the Cypriot king writes with a confidence that sits oddly beside the deferential formulas he is obliged to use." },
    " Historians have read this either as evidence of a genuine multipolar order or as evidence that the formulas had come loose from the realities they once described.",
  ],
  [
    "We should be candid that the archive is partial. ",
    { quote: "Q3", tone: "supports", text: "What survives at Amarna is what one Egyptian administration chose to keep, in one place, for a few decades." },
    " Arguments about the whole system rest on a keyhole view of it.",
  ],
];

export const readingTail = "Even so, the keyhole shows something unmistakable: an economy of prestige goods that moved by sea, in quantity, under royal sanction…";

const CLINE_CHICAGO = "Cline, Eric H. 1177 B.C.: The Year Civilization Collapsed. Rev. ed. Princeton: Princeton University Press, 2021";

function passageText(id: QuoteId): string {
  for (const para of readingParagraphs)
    for (const part of para) if (typeof part !== "string" && part.quote === id) return part.text;
  return "";
}

export const quotes: Record<QuoteId, { text: string; cite: string; short: string }> = {
  Q1: { text: passageText("Q1"), cite: `${CLINE_CHICAGO}, 62.`, short: "CLINE 2021, 62" },
  Q2: { text: passageText("Q2"), cite: `${CLINE_CHICAGO}, 62–63.`, short: "CLINE 2021, 62–63" },
  Q3: { text: passageText("Q3"), cite: `${CLINE_CHICAGO}, 63.`, short: "CLINE 2021, 63" },
};

export const annotationTags = ["THESIS 2 — DEPENDENCY", "MODULE 4", "COMP. ESSAY"];

export interface NotebookEntry {
  id: string;
  tag: string;
  tone: "accent" | "caution" | "neutral";
  text: string;
  cite: string;
  note?: string;
}

export const seedNotebook: NotebookEntry[] = [
  { id: "n1", tag: "THESIS 2 — DEPENDENCY", tone: "accent", text: "A king who must write three times for a shipment of copper is not, whatever he is called, an equal.", cite: "CLINE 2021, 62" },
  { id: "n2", tag: "COUNTER — PARITY READING", tone: "caution", text: "Send me much copper… and I will send you whatever you desire from my land.", cite: "AMARNA EA 35 · MORAN 1992, 107" },
  { id: "n3", tag: "ARCHIVE LIMITS", tone: "neutral", text: "Arguments about the whole system rest on a keyhole view of it.", cite: "CLINE 2021, 63" },
];

// ------------------------------------------------------------------ essay

export const essay = {
  id: "comparative",
  title: "Comparative essay — parity or dependency?",
  context: "HIST 210 · Module 4 · Papers category, 35%",
  terms: "1,500 words · due Friday 23:59 · one revision permitted after feedback · oral defense may be requested.",
  wordLimit: 1500,
  draftVersion: 3,
  prompt:
    "Using at least three approved sources, of which one must be primary, argue whether the Amarna correspondence shows a genuinely multipolar order or a hierarchy dressed in the language of brotherhood. You must state and answer the strongest objection to your reading.",
  constraints: ["SOURCES · APPROVED CORPUS", "OUTSIDE SOURCES · PERMITTED IF MARKED", "OUTCOMES · LO2, LO4, LO6"],
  seedDraft:
    "The letters exchanged between the great courts of the fourteenth century BCE are, on their surface, documents of warmth. Rulers address one another as brothers; they ask after each other's households and send extravagant gifts. I argue that this language is a protocol of exchange rather than a description of standing.\n\nThe clearest evidence is asymmetry of need. Bronze required tin and copper that no palace could produce for itself, and the correspondence records kings writing repeatedly for shipments that did not arrive. A king who must ask three times is not an equal, whatever he is called.\n\nThe strongest objection to this reading comes from Liverani, who holds that",
  seedDisclosure:
    "I used the tutor to pressure-test my thesis and to generate counterarguments, which I then answered in my own words. All prose in this submission is mine.",
  declarations: [
    { key: "ideas", title: "Brainstorming and thesis pressure-testing", evidence: "3 logged tutor sessions · 41 min total", prohibited: false, seed: true },
    { key: "counter", title: "Generating counterarguments I then answered", evidence: "1 logged session · used in section 3", prohibited: false, seed: true },
    { key: "feedback", title: "Feedback on my own draft prose", evidence: "Permitted at Level 2", prohibited: false, seed: false },
    { key: "draft", title: "Generated prose appears in my submission", evidence: "Prohibited here — checking this routes the work to integrity review", prohibited: true, seed: false },
  ] as const,
  rubric: [
    { name: "Thesis & stakes", pts: 25, desc: "A contestable claim, not a summary." },
    { name: "Use of primary evidence", pts: 25, desc: "Quoted accurately, located, and read rather than gestured at." },
    { name: "Counterargument", pts: 20, desc: "The strongest objection, stated fairly, then answered." },
    { name: "Citation quality", pts: 15, desc: "Every claim traceable to a location in the corpus." },
    { name: "Prose & structure", pts: 15, desc: "Readable, ordered, and yours." },
  ],
};

export type DeclarationKey = (typeof essay.declarations)[number]["key"];

export interface AuthorshipEvent {
  stamp: string;
  text: string;
}

export const seedReceipt: AuthorshipEvent[] = [
  { stamp: "MON 14:02", text: "Notebook opened · 6 quotes tagged to thesis 2" },
  { stamp: "MON 15:40", text: "Outline v1 — three sections, counter in §3" },
  { stamp: "TUE 09:12", text: "Draft v1 · opening section · 68 min of typing" },
  { stamp: "TUE 18:30", text: "Tutor session — \"is my thesis falsifiable?\" · 14 min" },
  { stamp: "WED 11:05", text: "Draft v3 · Liverani objection begun in §3" },
];

// ------------------------------------------------------------------ records

export type GradeStatus = "GRADED" | "LOCKED" | "DRAFT v3";

export const gradebook: Array<{ name: string; category: string; status: GradeStatus; score: string | null; evidence: string | null; href?: string; revised?: boolean }> = [
  { name: "Module 1 quiz", category: "Quizzes", status: "GRADED", score: "17/18", evidence: "ITEMS" },
  { name: "Source analysis 1 — Uluburun manifest", category: "Papers", status: "GRADED", score: "94", evidence: "RUBRIC" },
  { name: "Module 2 quiz", category: "Quizzes", status: "GRADED", score: "14/18", evidence: "ITEMS" },
  { name: "Seminar — modules 1–3", category: "Seminar", status: "GRADED", score: "95", evidence: "POSTS", href: "/courses/hist-210#seminar" },
  { name: "Source analysis 2 — Amarna letters", category: "Papers", status: "GRADED", score: "88", evidence: "RUBRIC", revised: true },
  { name: "Module 4 quiz", category: "Quizzes", status: "LOCKED", score: null, evidence: null },
  { name: "Comparative essay", category: "Papers", status: "DRAFT v3", score: null, evidence: "RECEIPT", href: "/courses/hist-210/assignments/comparative#receipt" },
];

export const rubricHistory = [
  { name: "Thesis & stakes", got: 23, of: 25 },
  { name: "Primary evidence", got: 24, of: 25 },
  { name: "Counterargument", got: 13, of: 20 },
  { name: "Citation quality", got: 14, of: 15 },
  { name: "Prose & structure", got: 14, of: 15 },
];

export const projection = [
  { scenario: "Essay at 90+", result: "A− → A", caution: false },
  { scenario: "Essay at 80–89", result: "A− holds", caution: false },
  { scenario: "Missed entirely", result: "B−", caution: true },
];

export const outcomeMastery = [
  { name: "LO1 · Situate events in a defensible chronology", pct: 62, items: 31, label: "WEAK", note: "Errors cluster on relative dating across regions. Nine practice items are queued." },
  { name: "LO2 · Read a primary source as evidence", pct: 91, items: 44, label: "STRONG", note: "" },
  { name: "LO3 · Explain economic interdependence in the Bronze Age", pct: 84, items: 22, label: "", note: "" },
  { name: "LO4 · State and answer the strongest objection", pct: 65, items: 12, label: "WEAK", note: "Two reviewers have now flagged this. It is the single highest-leverage thing to fix this term." },
  { name: "LO6 · Cite accurately and locate every claim", pct: 93, items: 38, label: "STRONG", note: "" },
];

export const provenance = [
  { text: "Scope & sequence reviewed — H. Márquez, PhD, Jan 2026", assigned: true },
  { text: "Reading list reviewed for balance — T. Osei, MLIS, Feb 2026", assigned: true },
  { text: "Capstone external examiner — not yet assigned", assigned: false },
];
