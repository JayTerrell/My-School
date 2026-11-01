// Request parsing and the pre-written, source-cited answers. Shared by the
// /api/ask route and the single-file preview build (which has no server).

import { interruptActions, quotes, seededAnswers, type InterruptMode, type QuoteId } from "@/lib/data/hist210";
import { seededPassageAnswers } from "./corpus";

export type AskBody =
  | { kind: "interrupt"; mode: InterruptMode; at: number }
  | { kind: "passage"; quote: QuoteId };

export function parseAskBody(raw: unknown): AskBody | null {
  if (!raw || typeof raw !== "object") return null;
  const b = raw as Record<string, unknown>;
  if (b.kind === "interrupt" && interruptActions.some((a) => a.mode === b.mode) && typeof b.at === "number") {
    return { kind: "interrupt", mode: b.mode as InterruptMode, at: b.at };
  }
  if (b.kind === "passage" && typeof b.quote === "string" && b.quote in quotes) {
    return { kind: "passage", quote: b.quote as QuoteId };
  }
  return null;
}

export function seededAnswer(body: AskBody) {
  if (body.kind === "interrupt") return { ...seededAnswers[body.mode], grounded: true, source: "seed" as const };
  return { label: "About this passage", ...seededPassageAnswers[body.quote], grounded: true, source: "seed" as const };
}
