// Indexed excerpts from HIST 210's approved corpus, plus a small keyword
// retriever. In production these rows come from the Source Library (licensed
// text extracted where permitted) and retrieval is a vector + keyword search;
// the contract is the same: the model only ever sees what this returns.
// Excerpts are illustrative seed content.

export interface Passage {
  id: string;
  /** Citation label shown to the learner. */
  cite: string;
  kind: "PRIMARY" | "SECONDARY";
  text: string;
}

export const passages: Passage[] = [
  {
    id: "cline-44",
    cite: "CLINE 2021, ch. 2, pp. 44–51 — trade and metal supply",
    kind: "SECONDARY",
    text: "Bronze requires copper and tin, which rarely occur together and occur nowhere near the major palaces of the Aegean and Levant. Copper came chiefly from Cyprus; tin travelled from much farther east, probably from Afghanistan, through Mesopotamian intermediaries. Every palace that wanted bronze tools, weapons, or prestige goods was therefore dependent on a supply chain it did not control.",
  },
  {
    id: "cline-48",
    cite: "CLINE 2021, 48–50 — reading the manifest",
    kind: "SECONDARY",
    text: "The Uluburun cargo's ten tonnes of copper and one tonne of tin approximate the nine-to-one ratio of working bronze. The shipment looks like a deliberate, matched consignment of both metals — evidence of a supply system able to assemble metals from separate regions and move them together by sea. Isotope and trace-element analyses, not texts, establish where the metals came from.",
  },
  {
    id: "uluburun",
    cite: "ULUBURUN CATALOGUE, INA — cargo manifest, items 1–40",
    kind: "PRIMARY",
    text: "354 copper oxhide ingots and approximately one tonne of tin, stowed amidships; Cypriot copper by lead-isotope analysis. Also recovered: glass ingots, ebony, ivory, Canaanite jars of terebinth resin, and luxury goods from at least seven cultures.",
  },
  {
    id: "moran-ea35",
    cite: "MORAN 1992, EA 35, pp. 107–109",
    kind: "PRIMARY",
    text: "The king of Alashiya to the king of Egypt, his brother: he sends 500 talents of copper and apologises that it is so little, because the hand of Nergal — a plague — has struck his land. \"Send me much copper… and I will send you whatever you desire from my land.\" He asks for silver, an ox, oil, and the return of goods belonging to a subject who died in Egypt.",
  },
  {
    id: "cline-61",
    cite: "CLINE 2021, 61–64 — the Alashiya problem",
    kind: "SECONDARY",
    text: "Cyprus held the copper, and the Cypriot king writes with a confidence that sits oddly beside the deferential formulas he is obliged to use. Historians have read this either as evidence of a genuine multipolar order or as evidence that the formulas had come loose from the realities they once described.",
  },
  {
    id: "cline-62",
    cite: "CLINE 2021, 62 — kings as brothers",
    kind: "SECONDARY",
    text: "The language of kinship in these archives is a protocol, not a description. It regulates what may be asked for and in what tone; it does not tell us who needed whom. A king who must write three times for a shipment of copper is not, whatever he is called, an equal.",
  },
  {
    id: "cline-63",
    cite: "CLINE 2021, 63 — what the archive omits",
    kind: "SECONDARY",
    text: "What survives at Amarna is what one Egyptian administration chose to keep, in one place, for a few decades. Arguments about the whole system rest on a keyhole view of it.",
  },
  {
    id: "cline-139",
    cite: "CLINE 2021, 139–170 — systems collapse",
    kind: "SECONDARY",
    text: "No single cause — earthquake, drought, invasion by the Sea Peoples, internal revolt — explains the collapse. The palaces were so interconnected that a shock to one part of the network propagated through all of it: a systems collapse, in which the very interdependence that produced prosperity became the mechanism of failure.",
  },
  {
    id: "cline-152",
    cite: "CLINE 2021, 152 — drought as multiplier",
    kind: "SECONDARY",
    text: "If drought were the proximate cause, destructions should track the regional onset of aridity; instead they cluster within a few years across regions with different climatic histories. Drought is better treated as a stressor that raised the probability of every other failure than as a cause on its own.",
  },
  {
    id: "liverani-1987",
    cite: "LIVERANI, \"The Collapse of the Near Eastern Regional System\", 1987, 66–73",
    kind: "SECONDARY",
    text: "What ends c. 1200 is a particular political form — palace redistribution and the diplomatic system of great kings — not a civilisation. Trade, settlement, and population persist in changed forms; reading the end of the palaces as catastrophe mistakes the vantage point of the archive for the experience of the region.",
  },
  {
    id: "kaniewski-2013",
    cite: "KANIEWSKI et al., PLoS ONE 2013 — pollen cores",
    kind: "PRIMARY",
    text: "Pollen cores from coastal Syria and Cyprus record a shift to drier conditions lasting from roughly the late thirteenth into the tenth century BCE: a multi-decade to multi-century climatic signal.",
  },
];

const STOP = new Set("the a an of and or to in on at for is are was were be by it its this that with as from not what who which how why do does me my i you your".split(" "));

function tokens(s: string) {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter((w) => w.length > 2 && !STOP.has(w));
}

/** Rank passages by keyword overlap with the query. Returns at most `k`. */
export function retrieve(query: string, k = 5): Passage[] {
  const q = new Set(tokens(query));
  return passages
    .map((p) => {
      const words = tokens(p.text + " " + p.cite);
      const score = words.reduce((a, w) => a + (q.has(w) ? 1 : 0), 0) / Math.sqrt(words.length);
      return { p, score };
    })
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, k)
    .map((x) => x.p);
}

/** Pre-written answers for "Ask about this passage" in the reader. */
export const seededPassageAnswers: Record<string, { title: string; paragraphs: string[]; citations: string[] }> = {
  Q1: {
    title: "Protocol, not description",
    paragraphs: [
      "Cline is separating what the words do from what they report. The kinship terms set the rules of the exchange — who may ask for what, and how politely — so their presence tells you a letter is diplomatic, not that the two kings were equals.",
      "That is why he turns to the number of times a king has to ask. Repeated requests are evidence of need; the formula of brotherhood is not evidence either way. It is exactly the distinction your essay's thesis depends on.",
    ],
    citations: ["CLINE 2021, 62 — kings as brothers", "MORAN 1992, EA 35, pp. 107–109"],
  },
  Q2: {
    title: "Why Alashiya complicates the dependency reading",
    paragraphs: [
      "If the formulas only dressed up hierarchy, you would expect the weaker party to write from need. The king of Alashiya writes as a supplier: he holds the copper, apologises for a short shipment, and names what he wants in return.",
      "So the same archive contains a ruler who is formally deferential but materially strong. That is the strongest objection to a straight dependency thesis, and it is the one your essay must state and answer.",
    ],
    citations: ["CLINE 2021, 61–64 — the Alashiya problem", "MORAN 1992, EA 35, pp. 107–109"],
  },
  Q3: {
    title: "A keyhole, not a window",
    paragraphs: [
      "The Amarna tablets are one administration's file, kept for a few decades. Anything you conclude about the whole Late Bronze Age system from them is an inference from a narrow sample.",
      "Cline does not say the inference is wrong — only that it has to be stated as one. Note the limit in your essay and say why you still think the evidence is enough for your claim.",
    ],
    citations: ["CLINE 2021, 63 — what the archive omits"],
  },
};
