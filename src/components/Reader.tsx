"use client";

import { useState } from "react";
import { annotationTags, quotes, reading, readingParagraphs, readingTail, type QuoteId } from "@/lib/data/hist210";
import { useLearner } from "./LearnerStore";

interface PassageAnswer {
  title: string;
  paragraphs: string[];
  citations: string[];
  source?: "seed" | "model";
}

const CURRENT_SECTION = 4; // §5, the section on this page

export function Reader() {
  const { state, dispatch, log } = useLearner();
  const [selected, setSelected] = useState<QuoteId | null>(null);
  const [note, setNote] = useState("");
  const [tags, setTags] = useState<string[]>([annotationTags[0]]);
  const [answer, setAnswer] = useState<{ quote: QuoteId; a: PassageAnswer } | null>(null);
  const [asking, setAsking] = useState(false);

  const pick = (id: QuoteId) => {
    setSelected(id);
    setNote("");
    setTags([annotationTags[0]]);
  };

  const save = () => {
    if (!selected) return;
    const q = quotes[selected];
    const tone = readingParagraphs.flat().find((p) => typeof p !== "string" && p.quote === selected);
    dispatch({
      type: "saveToNotebook",
      entry: {
        id: `read-${selected}-${Date.now()}`,
        tag: tags[0] ?? "UNTAGGED",
        tone: typeof tone !== "string" && tone?.tone === "complicates" ? "caution" : "accent",
        text: q.text,
        cite: q.short,
        note: note.trim() || undefined,
      },
    });
    setSelected(null);
    setNote("");
  };

  const ask = async () => {
    if (!selected) return;
    setAsking(true);
    log(`Tutor · asked about passage, ${quotes[selected].short}`);
    try {
      const res = await fetch("/api/ask", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ kind: "passage", quote: selected }) });
      if (!res.ok) throw new Error(String(res.status));
      setAnswer({ quote: selected, a: await res.json() });
    } catch {
      setAnswer({ quote: selected, a: { title: "The tutor couldn't be reached", paragraphs: ["Nothing was generated. Try again in a moment."], citations: [] } });
    } finally {
      setAsking(false);
    }
  };

  const sectionDone = state.readSections > CURRENT_SECTION;
  const q = selected ? quotes[selected] : null;

  return (
    <div className="cols">
      <div className="reader-left">
        <div className="card card--pad" style={{ marginBottom: 16 }}>
          <div className="label" style={{ marginBottom: 10 }}>Assigned source</div>
          <h3 style={{ font: "400 19px/1.3 var(--serif)", margin: "0 0 6px" }}>{reading.title}</h3>
          <div style={{ font: "300 13px/1.5 var(--sans)", color: "var(--ink-muted)" }}>{reading.author} · {reading.publisher}</div>
          <div style={{ marginTop: 14, paddingTop: 14, borderTop: "1px solid var(--line-faint)", font: "400 10.5px/1.8 var(--mono)", color: "var(--ink-muted)" }}>
            <div>TYPE · {reading.type}</div>
            <div>ACCESS · {reading.access}</div>
            <div>REVIEWED · {reading.reviewed}</div>
          </div>
        </div>
        <div className="card card--pad">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 12 }}>
            <h3 className="h3" style={{ fontSize: 17 }}>{reading.chapter}</h3>
            <span className="meta" style={{ fontSize: 10, color: "var(--accent)" }}>{state.readSections} / {reading.sections.length}</span>
          </div>
          {reading.sections.map((s, i) => (
            <div
              key={s}
              className={`section-item${i < state.readSections ? " section-item--done" : i === state.readSections ? " section-item--current" : ""}`}
            >
              {s}
            </div>
          ))}
          <p style={{ font: "300 11.5px/1.55 var(--sans)", color: "var(--ink-subtle)", margin: "14px 0 0", paddingTop: 12, borderTop: "1px solid var(--line-faint)" }}>
            Sections count as read when you&apos;ve worked through them — not when the page opens.
          </p>
        </div>
      </div>

      <div className="reader-main">
        <article className="card reader-page">
          <div className="label">{reading.page.section}</div>
          <h2>{reading.page.heading}</h2>
          <div className="reader-text">
            {readingParagraphs.map((para, i) => (
              <p key={i}>
                {para.map((part, j) =>
                  typeof part === "string" ? (
                    <span key={j}>{part}</span>
                  ) : (
                    <span
                      key={j}
                      role="button"
                      tabIndex={0}
                      className={`passage${part.tone === "complicates" ? " passage--complicates" : ""}${selected === part.quote ? " passage--on" : ""}`}
                      onClick={() => pick(part.quote)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          pick(part.quote);
                        }
                      }}
                      aria-label={`Annotate passage (${part.tone})`}
                    >
                      {part.text}
                    </span>
                  ),
                )}
              </p>
            ))}
            <p className="tail">{readingTail}</p>
          </div>
          <div className="reader-actions">
            <button type="button" className="btn btn--primary" onClick={ask} disabled={!selected || asking} title={selected ? undefined : "Select a highlighted passage first"}>
              {asking ? "Searching the corpus…" : selected ? "Ask about this passage" : "Select a passage to ask about it"}
            </button>
            <button type="button" className="btn btn--secondary">Compare with EA 35</button>
            <button type="button" className="btn btn--secondary">Five questions on §5</button>
            <button type="button" className="btn btn--tertiary" disabled={sectionDone} onClick={() => dispatch({ type: "markSectionRead" })}>
              {sectionDone ? "§5 worked through ✓" : "Mark §5 worked through"}
            </button>
          </div>
          {answer && (
            <div className="card card--tint" style={{ padding: 20, marginTop: 20 }} aria-live="polite">
              <div style={{ display: "flex", justifyContent: "space-between", gap: 10, alignItems: "baseline", marginBottom: 10 }}>
                <div className="label label--accent">Tutor · {quotes[answer.quote].short}</div>
                <button type="button" className="close-x" onClick={() => setAnswer(null)} aria-label="Close answer">✕</button>
              </div>
              <h3 style={{ font: "400 19px/1.3 var(--serif)", margin: "0 0 10px" }}>{answer.a.title}</h3>
              {answer.a.paragraphs.map((p, i) => (
                <p key={i} style={{ font: "300 14.5px/1.7 var(--sans)", color: "var(--ink-reading-2)", margin: "0 0 10px" }}>{p}</p>
              ))}
              <div style={{ borderTop: "1px solid var(--accent-tint-border)", paddingTop: 12, marginTop: 4 }}>
                <div className="label label--accent" style={{ marginBottom: 6 }}>{answer.a.citations.length ? "Drawn from" : "No sources cited"}</div>
                {answer.a.citations.map((c) => <div key={c} className="mono" style={{ fontSize: 12, lineHeight: 1.6, color: "var(--accent-ink)" }}>{c}</div>)}
              </div>
            </div>
          )}
        </article>
      </div>

      <div className="reader-right">
        {q && selected && (
          <div className="card card--focus card--pad">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 12 }}>
              <div className="label label--accent">New annotation</div>
              <button type="button" className="close-x" onClick={() => setSelected(null)} aria-label="Close annotation">✕</button>
            </div>
            <p className="quote quote--accent" style={{ fontSize: 14.5, lineHeight: 1.7, fontWeight: 400, paddingLeft: 12, marginBottom: 14 }}>{q.text}</p>
            <textarea className="textarea" style={{ minHeight: 80 }} placeholder="What do you make of it?" value={note} onChange={(e) => setNote(e.target.value)} aria-label="Annotation note" />
            <div className="label" style={{ margin: "14px 0 8px" }}>Tag as evidence for</div>
            <div className="btn-row" style={{ gap: 6, marginBottom: 14 }}>
              {annotationTags.map((t) => {
                const on = tags.includes(t);
                return (
                  <button
                    key={t}
                    type="button"
                    className={`chip${on ? " chip--accent" : ""}`}
                    aria-pressed={on}
                    onClick={() => setTags((cur) => (on ? cur.filter((x) => x !== t) : [...cur, t]))}
                  >
                    {t}
                  </button>
                );
              })}
            </div>
            <div className="cite-box">
              <div className="label" style={{ fontSize: 9.5, letterSpacing: ".1em", marginBottom: 6 }}>Citation · Chicago, auto-built</div>
              <div>{q.cite}</div>
            </div>
            <button type="button" className="btn btn--primary btn--block" style={{ padding: 11 }} onClick={save}>Save to research notebook</button>
          </div>
        )}

        <div className="card card--pad">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 6 }}>
            <h3 className="h3">Research notebook</h3>
            <span className="meta" style={{ fontSize: 10 }}>{state.notebook.length} ENTRIES</span>
          </div>
          <p className="body-xs" style={{ marginBottom: 14 }}>Tagged quotes become citeable evidence in the essay workspace.</p>
          {[...state.notebook].reverse().map((e) => (
            <div className="nb-entry" key={e.id}>
              <div className={`tag${e.tone === "accent" ? " tag--accent" : e.tone === "caution" ? " tag--caution" : ""}`}>{e.tag}</div>
              <p>&ldquo;{e.text}&rdquo;</p>
              {e.note && <div className="body-xs" style={{ marginBottom: 6 }}>{e.note}</div>}
              <div className="meta" style={{ fontSize: 10 }}>{e.cite}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
