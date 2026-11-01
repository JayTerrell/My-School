// Seed catalog. Each program is an ordered list of terms; each term an ordered
// list of course slots. Slot codes starting with CONC / ELEC are choice slots.
//
// Compact course syntax: "CODE|Title|credits|prerequisites" joined by ";".

export type Level = "Bachelor's" | "Master's" | "Certificate";

/** Which degree-audit requirement a slot counts toward. */
export type Bucket = "core" | "method" | "concentration" | "elective" | "capstone" | "orientation";

export interface CourseSlot {
  code: string;
  title: string;
  credits: number;
  /** Prerequisite codes, in order. */
  prereqs: string[];
}

export interface Term {
  label: string;
  courses: CourseSlot[];
}

export interface Program {
  id: string;
  level: Level;
  name: string;
  /** Formal degree title used on the audit and transcript. */
  formalName: string;
  years: string;
  weeklyHours: string;
  intake: string;
  summary: string;
  outcomes: string[];
  terms: Term[];
  /** Codes that count toward the method sequence. */
  methodCodes: string[];
  /** Codes that make up the capstone requirement. */
  capstoneCodes: string[];
}

function term(label: string, spec: string): Term {
  return {
    label,
    courses: spec.split(";").map((row) => {
      const [code, title, credits, pre] = row.split("|");
      return {
        code,
        title,
        credits: Number(credits),
        prereqs: pre ? pre.split(",").map((p) => p.trim()) : [],
      };
    }),
  };
}

export const programs: Program[] = [
  {
    id: "wh",
    level: "Bachelor's",
    name: "BA World History",
    formalName: "Bachelor of Arts, World History",
    years: "4 yrs",
    weeklyHours: "18–22 h",
    intake: "Next intake Jan 2027",
    summary:
      "Human history from the first cities to the present, read from primary sources and argued in writing. Ends in a thesis and a recorded oral defense.",
    outcomes: [
      "Read a primary source as evidence, and say what it cannot show.",
      "Build a defensible chronology across regions and centuries.",
      "Write an argument that states and answers its strongest objection.",
    ],
    methodCodes: ["HIST 240", "HIST 330", "HIST 340", "HIST 450"],
    capstoneCodes: ["HIST 499", "HIST 495"],
    terms: [
      term("Year 1 · Autumn", "ORIE 100|Orientation to Independent Study|1;HIST 101|Prehistory to 1000 BCE|4;WRIT 110|Academic Writing & Citation|3;HIST 150|Reading Ancient Texts in Translation|3;ARTH 140|Material Culture & Artefacts|4"),
      term("Year 1 · Spring", "HIST 102|Early Civilisations|4|HIST 101;GEOG 120|Historical Geography|3;PHIL 105|Logic & Argument|3;LANG 101|Latin or Greek I|5"),
      term("Year 2 · Autumn", "HIST 210|World History I: Antiquity|4|HIST 102;HIST 240|Sources & Historical Method|3|WRIT 110;PHIL 180|Ancient Political Thought|3|PHIL 105;LANG 102|Latin or Greek II|5|LANG 101"),
      term("Year 2 · Spring", "HIST 211|World History II: Classical & Late Antique|4|HIST 210;HIST 320|Archaeology Seminar|3|HIST 240;ECON 150|Economic History of the Pre-modern World|4;HIST 260|Religion & Ritual in Antiquity|4"),
      term("Year 3 · Autumn", "HIST 310|Medieval Worlds, 500–1500|4|HIST 211;HIST 330|Historiography|4|HIST 240;CONC 1|Regional Concentration I|4;ELEC 1|Elective|3"),
      term("Year 3 · Spring", "HIST 311|Early Modern Global Connections|4|HIST 310;HIST 340|Digital & Quantitative Methods|3|HIST 240;CONC 2|Regional Concentration II|4|CONC 1;ELEC 2|Elective|4"),
      term("Year 4 · Autumn", "HIST 410|The Modern World Since 1750|4|HIST 311;CONC 3|Regional Concentration III|4|CONC 2;HIST 450|Research Design & Thesis Proposal|3|HIST 330;ELEC 3|Elective|4"),
      term("Year 4 · Spring", "HIST 499|Capstone Thesis|8|HIST 450;CONC 4|Regional Concentration IV|4|CONC 3;HIST 495|Oral Defense & Public Dossier|3|HIST 499"),
    ],
  },
  {
    id: "econ",
    level: "Bachelor's",
    name: "BA Economics",
    formalName: "Bachelor of Arts, Economics",
    years: "4 yrs",
    weeklyHours: "18–22 h",
    intake: "Next intake Jan 2027",
    summary:
      "Micro, macro, and econometrics taught alongside the history of economic thought, so models are always read against the arguments that produced them.",
    outcomes: [
      "Build and critique a formal economic model.",
      "Estimate a causal effect from real data and defend the identification.",
      "Write policy analysis a non-economist can act on.",
    ],
    methodCodes: ["STAT 120", "STAT 220", "STAT 221", "ECON 450"],
    capstoneCodes: ["ECON 499", "ECON 495"],
    terms: [
      term("Year 1 · Autumn", "ORIE 100|Orientation to Independent Study|1;ECON 101|Principles of Microeconomics|4;MATH 110|Calculus for Social Science|4;WRIT 110|Academic Writing & Citation|3;HIST 120|Economic History of the Modern World|3"),
      term("Year 1 · Spring", "ECON 102|Principles of Macroeconomics|4|ECON 101;STAT 120|Statistics I|4|MATH 110;PHIL 105|Logic & Argument|3;ECON 130|Money & Banking|4|ECON 101"),
      term("Year 2 · Autumn", "ECON 201|Intermediate Microeconomics|4|ECON 101, MATH 110;STAT 220|Econometrics I|4|STAT 120;ECON 230|Public Finance|3|ECON 102;ELEC 1|Elective|4"),
      term("Year 2 · Spring", "ECON 202|Intermediate Macroeconomics|4|ECON 102;STAT 221|Econometrics II|4|STAT 220;ECON 240|International Trade|4|ECON 201;ECON 250|History of Economic Thought|3"),
      term("Year 3 · Autumn", "ECON 310|Labor Economics|4|ECON 201;ECON 320|Game Theory|4|ECON 201;ELEC 2|Elective|4;ELEC 3|Elective|3"),
      term("Year 3 · Spring", "ECON 330|Development Economics|4|ECON 202;ECON 340|Behavioral Economics|4|ECON 201;ECON 350|Applied Data Project|3|STAT 221;ELEC 4|Elective|4"),
      term("Year 4 · Autumn", "ECON 410|Economic Policy Seminar|4|ECON 330;ECON 450|Research Design & Thesis Proposal|3|STAT 221;ELEC 5|Elective|4;ELEC 6|Elective|4"),
      term("Year 4 · Spring", "ECON 499|Capstone Thesis|8|ECON 450;ECON 420|Political Economy|4|ECON 250;ECON 495|Oral Defense & Public Dossier|3|ECON 499"),
    ],
  },
  {
    id: "phil",
    level: "Bachelor's",
    name: "BA Philosophy & Theology",
    formalName: "Bachelor of Arts, Philosophy & Theology",
    years: "4 yrs",
    weeklyHours: "18–22 h",
    intake: "Next intake Jan 2027",
    summary:
      "The major questions of philosophy and the theological traditions that answered them, read in the original texts with two years of Greek or Latin.",
    outcomes: [
      "Reconstruct an argument from a primary text and test it.",
      "Read Greek or Latin philosophical prose with a lexicon.",
      "Defend a position on a contested question in writing and aloud.",
    ],
    methodCodes: ["PHIL 105", "PHIL 450"],
    capstoneCodes: ["PHIL 499", "PHIL 495"],
    terms: [
      term("Year 1 · Autumn", "ORIE 100|Orientation to Independent Study|1;PHIL 101|Introduction to Philosophy|4;THEO 101|Scripture & Its Interpreters|4;WRIT 110|Academic Writing & Citation|3;PHIL 105|Logic & Argument|3"),
      term("Year 1 · Spring", "PHIL 120|Ancient Philosophy|4|PHIL 101;THEO 120|Early Christian Thought|4|THEO 101;LANG 101|Greek or Latin I|5;HIST 102|Early Civilisations|3"),
      term("Year 2 · Autumn", "PHIL 210|Medieval Philosophy|4|PHIL 120;THEO 210|Systematic Theology I|4|THEO 120;LANG 102|Greek or Latin II|5|LANG 101;PHIL 230|Ethics|3"),
      term("Year 2 · Spring", "PHIL 220|Early Modern Philosophy|4|PHIL 210;THEO 220|Systematic Theology II|4|THEO 210;PHIL 240|Philosophy of Religion|4;ELEC 1|Elective|3"),
      term("Year 3 · Autumn", "PHIL 310|Metaphysics|4|PHIL 220;THEO 310|Comparative Religious Traditions|4;PHIL 330|Political Philosophy|4|PHIL 230;ELEC 2|Elective|3"),
      term("Year 3 · Spring", "PHIL 320|Epistemology|4|PHIL 220;THEO 320|Moral Theology|4|PHIL 230;PHIL 340|Philosophy of Mind|4;ELEC 3|Elective|3"),
      term("Year 4 · Autumn", "PHIL 410|Major Author Seminar|4|PHIL 310;PHIL 450|Research Design & Thesis Proposal|3;ELEC 4|Elective|4;ELEC 5|Elective|4"),
      term("Year 4 · Spring", "PHIL 499|Capstone Thesis|8|PHIL 450;THEO 410|Theology Seminar|4|THEO 320;PHIL 495|Oral Defense & Public Dossier|3|PHIL 499"),
    ],
  },
  {
    id: "cs",
    level: "Bachelor's",
    name: "BS Computer Science",
    formalName: "Bachelor of Science, Computer Science",
    years: "4 yrs",
    weeklyHours: "20–24 h",
    intake: "Next intake Jan 2027",
    summary:
      "Programming, theory, and systems built up in sequence, with every project committed to a public repository you can show an employer.",
    outcomes: [
      "Design and analyse algorithms with proofs of correctness.",
      "Build and ship a working system with tests and documentation.",
      "Reason about the security and ethical consequences of software.",
    ],
    methodCodes: ["CS 230", "CS 450"],
    capstoneCodes: ["CS 499", "CS 495"],
    terms: [
      term("Year 1 · Autumn", "ORIE 100|Orientation to Independent Study|1;CS 101|Programming Fundamentals|4;MATH 120|Discrete Mathematics|4;MATH 130|Calculus I|4;WRIT 110|Academic Writing & Citation|3"),
      term("Year 1 · Spring", "CS 102|Data Structures|4|CS 101;MATH 131|Calculus II|4|MATH 130;CS 110|Computer Systems|4|CS 101;PHIL 105|Logic & Argument|3"),
      term("Year 2 · Autumn", "CS 201|Algorithms|4|CS 102, MATH 120;MATH 210|Linear Algebra|4|MATH 131;CS 210|Databases|4|CS 102;ELEC 1|Elective|3"),
      term("Year 2 · Spring", "CS 220|Operating Systems|4|CS 110;CS 230|Software Engineering|4|CS 102;STAT 210|Probability & Statistics|4|MATH 131;ELEC 2|Elective|3"),
      term("Year 3 · Autumn", "CS 310|Theory of Computation|4|CS 201;CS 320|Computer Networks|4|CS 220;CS 330|Machine Learning|4|MATH 210, STAT 210;ELEC 3|Elective|3"),
      term("Year 3 · Spring", "CS 340|Programming Languages|4|CS 201;CS 350|Security|4|CS 220;CS 360|Human–Computer Interaction|3|CS 230;ELEC 4|Elective|4"),
      term("Year 4 · Autumn", "CS 410|Distributed Systems|4|CS 320;CS 450|Capstone Proposal|3|CS 230;ELEC 5|Elective|4;ELEC 6|Elective|4"),
      term("Year 4 · Spring", "CS 499|Capstone Project|8|CS 450;CS 420|Ethics of Computing|4;CS 495|Oral Defense & Public Dossier|3|CS 499"),
    ],
  },
  {
    id: "ds",
    level: "Master's",
    name: "MS Data Science",
    formalName: "Master of Science, Data Science",
    years: "2 yrs",
    weeklyHours: "15–18 h",
    intake: "Next intake Sep 2027",
    summary:
      "A part-time graduate program in inference, machine learning, and causal analysis for working professionals, ending in an applied capstone on real data.",
    outcomes: [
      "Choose and defend the right model for a question.",
      "Separate correlation from causation in observational data.",
      "Communicate uncertainty honestly to decision-makers.",
    ],
    methodCodes: ["DS 501", "DS 620"],
    capstoneCodes: ["DS 690", "DS 695"],
    terms: [
      term("Year 1 · Autumn", "DS 501|Statistical Inference|3;DS 510|Programming for Data Science|3;DS 520|Data Management|3"),
      term("Year 1 · Spring", "DS 530|Machine Learning|3|DS 501, DS 510;DS 540|Causal Inference|3|DS 501;DS 550|Data Visualisation|3|DS 510"),
      term("Year 2 · Autumn", "DS 610|Deep Learning|3|DS 530;DS 620|Experimental Design|3|DS 540;ELEC 1|Elective|3"),
      term("Year 2 · Spring", "DS 690|Applied Capstone|6|DS 610, DS 620;DS 695|Oral Defense & Public Dossier|3|DS 690"),
    ],
  },
  {
    id: "cert",
    level: "Certificate",
    name: "Certificate in Historical Research",
    formalName: "Certificate in Historical Research",
    years: "1 yr",
    weeklyHours: "8–10 h",
    intake: "Rolling start",
    summary:
      "A one-year, part-time sequence in source criticism and research methods for writers, genealogists, and anyone preparing for graduate study.",
    outcomes: [
      "Locate, date, and assess an archival source.",
      "Design a research question the evidence can answer.",
      "Produce a cited research report from primary material.",
    ],
    methodCodes: ["HIST 240", "HIST 340"],
    capstoneCodes: ["HIST 380"],
    terms: [
      term("Term 1", "HIST 240|Sources & Historical Method|3;WRIT 110|Academic Writing & Citation|3;HIST 150|Reading Ancient Texts in Translation|3"),
      term("Term 2", "HIST 340|Digital & Quantitative Methods|3|HIST 240;HIST 380|Research Practicum|4|HIST 240"),
    ],
  },
];

export const levels: Array<"All" | Level> = ["All", "Bachelor's", "Master's", "Certificate"];

export function getProgram(id: string): Program | undefined {
  return programs.find((p) => p.id === id);
}

/** Course descriptions shared across programs (a course code means the same course everywhere). */
export const courseDescriptions: Record<string, string> = {
  "ORIE 100": "How independent study works here: the integrity agreement, the AI-use levels, how rubrics and oral defenses run, and how to plan a week.",
  "HIST 101": "From the first toolmakers to the Late Bronze Age: how we know anything about people who left no writing.",
  "HIST 102": "Mesopotamia, Egypt, the Indus, and early China compared — cities, scripts, kingship, and the state.",
  "HIST 150": "Close reading of ancient texts in translation, with attention to what a translation hides.",
  "HIST 210": "Fourteen modules from the first cities to the end of the Bronze Age, taught from an approved corpus of 23 sources.",
  "HIST 211": "Persia, Greece, Rome, the Mauryas and Han, through to the transformations of late antiquity.",
  "HIST 240": "Provenance, bias, dating, and corroboration. The core methods course; every later paper depends on it.",
  "HIST 310": "Byzantium, the Islamic caliphates, Latin Christendom, the Mongols, and the Indian Ocean world.",
  "HIST 330": "How historians have argued about the past, from Herodotus to the global turn.",
  "HIST 450": "Choose a question, build a source base, and defend a thesis proposal before a reviewer.",
  "HIST 499": "A 12,000-word thesis on original research, supervised by a named evaluator.",
  "HIST 495": "A recorded 30-minute oral defense of the thesis, and publication of your public dossier.",
  "WRIT 110": "Argument, structure, and citation. Every claim located; every quotation checked.",
  "LANG 101": "Grammar and reading from the first week, built toward unadapted prose by the end of year two.",
};

/** Published syllabus units, in order. */
export const courseUnits: Record<string, string[]> = {
  "HIST 101": ["Deep time and the evidence for it", "The Neolithic transition", "Villages to towns", "Metal, trade, and inequality", "Writing and the end of prehistory"],
  "HIST 102": ["Sumer and the first cities", "Egypt under the Old Kingdom", "The Indus cities", "Shang China and oracle bones", "Comparing early states"],
  "HIST 210": ["The first cities", "Kingship and law: Hammurabi to the Hittites", "Egypt, Kush, and the Nile world", "The Bronze Age world: trade, palaces, collapse", "Iron, empires, and the Assyrians", "Israel and the Levant", "Persia", "Review and midterm"],
  "HIST 211": ["Archaic and Classical Greece", "Alexander and the Hellenistic world", "The Roman Republic", "Empire: Rome and Han compared", "Late antiquity and its religions"],
  "HIST 240": ["What counts as a source", "Provenance and transmission", "Bias, silence, and the archive", "Corroboration and dating", "Writing from evidence"],
  "HIST 310": ["Byzantium", "The rise of Islam and the caliphates", "Latin Christendom", "The Mongol world", "The Indian Ocean economy"],
  "HIST 311": ["The Atlantic world", "Gunpowder empires", "Silver and global trade", "Reformation and confessional states", "Science and its publics"],
  "HIST 410": ["Revolutions, 1750–1850", "Industry and empire", "World wars", "Decolonisation", "Globalisation and its critics"],
  "HIST 499": ["Literature review", "Source chapter drafts", "Full draft and reviewer response", "Revision", "Final submission"],
};
