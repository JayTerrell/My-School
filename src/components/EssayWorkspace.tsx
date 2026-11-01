"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { wordCount } from "@/lib/academic";
import { course, essay, seedReceipt } from "@/lib/data/hist210";
import { useLearner } from "./LearnerStore";

/** "AMARNA EA 35 · MORAN 1992, 107" → "(Amarna EA 35; Moran 1992, 107)" */
function inlineCitation(short: string) {
  const body = short
    .split(" · ")
    .map((part) => part.replace(/\b([A-Z])([A-Z]{2,})\b/g, (_, a: string, b: string) => a + b.toLowerCase()))
    .join("; ");
  return `(${body})`;
}

function savedAgo(ts: number | null, now: number) {
  if (!ts) return "2 MIN AGO";
  const s = Math.max(0, Math.round((now - ts) / 1000));
  if (s < 10) return "JUST NOW";
  if (s < 60) return `${s}S AGO`;
  return `${Math.round(s / 60)} MIN AGO`;
}

export function EssayWorkspace() {
  const { state, dispatch } = useLearner();
  const editor = useRef<HTMLTextAreaElement>(null);
  // Last caret position in the editor; null until the learner has clicked into it (then citations append).
  const caret = useRef<{ start: number; end: number } | null>(null);
  const [picking, setPicking] = useState(false);
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const iv = window.setInterval(() => setNow(Date.now()), 5000);
    return () => window.clearInterval(iv);
  }, []);

  const words = wordCount(state.draft);
  const over = words > essay.wordLimit;
  const locked = state.submitted;

  const insert = (short: string) => {
    if (locked) return;
    const el = editor.current;
    const cite = inlineCitation(short);
    const start = caret.current?.start ?? state.draft.length;
    const end = caret.current?.end ?? start;
    const before = state.draft.slice(0, start);
    const pad = before && !/\s$/.test(before) ? " " : "";
    const next = `${before}${pad}${cite}${state.draft.slice(end)}`;
    dispatch({ type: "setDraft", text: next });
    setPicking(false);
    requestAnimationFrame(() => {
      if (!el) return;
      el.focus();
      const pos = start + pad.length + cite.length;
      el.setSelectionRange(pos, pos);
      caret.current = { start: pos, end: pos };
    });
  };

  const receipt = [...seedReceipt, ...state.events];

  return (
    <div className="cols">
      <div style={{ flex: "1 1 520px", minWidth: 0 }}>
        <div className="card card--inset" style={{ padding: 22, marginBottom: 20 }}>
          <div className="label" style={{ marginBottom: 10 }}>The prompt</div>
          <p style={{ font: "400 17px/1.6 var(--serif)", margin: "0 0 16px", color: "var(--ink-reading-2)", maxWidth: "62ch" }}>{essay.prompt}</p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 20, font: "400 11px/1.5 var(--mono)", color: "var(--ink-muted)" }}>
            {essay.constraints.map((c) => <span key={c}>{c}</span>)}
          </div>
        </div>

        <div className="card mb-20">
          <div className="card__head" style={{ padding: "14px 20px" }}>
            <div className="label" style={{ letterSpacing: ".1em" }}>
              DRAFT v{essay.draftVersion} · {locked ? "SUBMITTED" : `SAVED ${savedAgo(state.draftSavedAt, now)}`}
            </div>
            <div className="mono" style={{ fontSize: 11, color: over ? "var(--caution)" : "var(--ink-muted)" }} aria-live="polite">
              {words.toLocaleString()} / {essay.wordLimit} WORDS
            </div>
          </div>
          <textarea
            ref={editor}
            className="editor"
            value={state.draft}
            readOnly={locked}
            onChange={(e) => dispatch({ type: "setDraft", text: e.target.value })}
            onSelect={(e) => {
              caret.current = { start: e.currentTarget.selectionStart, end: e.currentTarget.selectionEnd };
            }}
            aria-label="Essay draft"
          />
          <div style={{ padding: "14px 20px", borderTop: "1px solid var(--line-soft)", position: "relative" }}>
            <div className="btn-row">
              <button type="button" className="btn btn--secondary btn--sm" onClick={() => setPicking((p) => !p)} disabled={locked} aria-expanded={picking}>
                Insert citation from notebook
              </button>
              <button type="button" className="btn btn--secondary btn--sm" disabled={locked}>Where does this need evidence?</button>
              <button type="button" className="btn btn--tertiary btn--sm">Outline view</button>
            </div>
            {picking && (
              <div className="card" style={{ marginTop: 12 }}>
                {state.notebook.map((e) => (
                  <button
                    key={e.id}
                    type="button"
                    className="row row--link"
                    style={{ width: "100%", textAlign: "left", background: "none", border: "none", borderBottom: "1px solid var(--line-faint)", padding: "11px 14px" }}
                    onClick={() => insert(e.cite)}
                  >
                    <span style={{ flex: "1 1 auto", font: "400 13px/1.5 var(--serif)", color: "var(--ink-reading-2)" }}>&ldquo;{e.text}&rdquo;</span>
                    <span className="meta" style={{ fontSize: 10 }}>{e.cite}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="card card--pad-22">
          <h3 className="h3 h3--19">AI use declaration</h3>
          <p className="lede" style={{ fontSize: 13.5, margin: "6px 0 18px" }}>
            This assignment is <strong style={{ fontWeight: 500, color: "var(--ink)" }}>Level {course.aiLevel}</strong>: tutoring, outlining, and feedback are
            permitted; generated prose in the submission is not. Your tutor sessions are already logged — confirm what you actually used.
          </p>
          {essay.declarations.map((d) => {
            const on = state.ai[d.key];
            return (
              <button
                key={d.key}
                type="button"
                role="checkbox"
                aria-checked={on}
                disabled={locked}
                className={`decl${on ? " decl--on" : ""}${d.prohibited ? " decl--warn" : ""}`}
                onClick={() => dispatch({ type: "toggleAi", key: d.key })}
              >
                <span className="decl__box" aria-hidden>{on ? "✓" : ""}</span>
                <span>
                  <span className="decl__title" style={{ display: "block" }}>{d.title}</span>
                  <span className="decl__sub" style={{ display: "block" }}>{d.evidence}</span>
                </span>
              </button>
            );
          })}

          <div className="label" style={{ margin: "20px 0 8px" }}>Your statement, published with the paper</div>
          <textarea
            className="textarea"
            style={{ minHeight: 86, padding: 13, fontSize: 13.5, lineHeight: 1.7 }}
            value={state.disclosure}
            readOnly={locked}
            onChange={(e) => dispatch({ type: "setDisclosure", text: e.target.value })}
            aria-label="Public AI-use statement"
          />

          {state.ai.draft && (
            <div className="warn" style={{ marginTop: 14 }} role="status">
              You&apos;ve declared generated prose in the submission, which this assignment&apos;s policy prohibits. You can still submit — it will go to
              integrity review with your draft history attached, and you&apos;ll be asked to discuss it.
            </div>
          )}

          <div className="btn-row" style={{ gap: 10, marginTop: 18 }}>
            <button type="button" className="btn btn--primary btn--lg" onClick={() => dispatch({ type: "submit" })} disabled={locked}>
              {locked ? "Submitted ✓" : state.ai.draft ? "Submit to integrity review" : "Submit with declaration"}
            </button>
            <span style={{ font: "300 12.5px var(--sans)", color: "var(--ink-subtle)" }}>
              {locked ? "Receipt sealed. One revision remains." : "Your authorship receipt is attached automatically."}
            </span>
          </div>
        </div>
      </div>

      <div className="col-side">
        <div className="card card--pad">
          <h3 className="h3" style={{ marginBottom: 4 }}>Rubric — locked</h3>
          <p className="body-xs" style={{ margin: "6px 0 14px", lineHeight: 1.55 }}>
            Fixed before the assignment opened. Grading runs against these criteria, not an impression of the prose.
          </p>
          {essay.rubric.map((r) => (
            <div className="rule-top" key={r.name}>
              <div style={{ display: "flex", justifyContent: "space-between", gap: 10, font: "500 13px var(--sans)" }}>
                <span>{r.name}</span>
                <span className="mono" style={{ color: "var(--ink-label)" }}>{r.pts}</span>
              </div>
              <div style={{ font: "300 12px/1.5 var(--sans)", color: "var(--ink-muted)", marginTop: 3 }}>{r.desc}</div>
            </div>
          ))}
        </div>

        <div className="card card--pad">
          <h3 className="h3" style={{ marginBottom: 14 }}>Evidence to hand</h3>
          {state.notebook.slice(-4).map((e) => (
            <div className="rule-top" key={e.id}>
              <p style={{ font: "400 13.5px/1.6 var(--serif)", margin: "0 0 6px", color: "var(--ink-reading-2)" }}>&ldquo;{e.text}&rdquo;</p>
              <div style={{ display: "flex", justifyContent: "space-between", gap: 8, flexWrap: "wrap" }}>
                <span className="meta" style={{ fontSize: 10 }}>{e.cite}</span>
                <button type="button" className="textlink" style={{ fontSize: 10, fontWeight: 500 }} onClick={() => insert(e.cite)} disabled={locked}>CITE</button>
              </div>
            </div>
          ))}
          <Link href={`/courses/${course.slug}/readings/cline-ch2`} className="textlink" style={{ display: "block", paddingTop: 12, borderTop: "1px solid var(--line-faint)" }}>
            Open notebook · {state.notebook.length} entries →
          </Link>
        </div>

        <div className="card card--pad" id="receipt" style={{ scrollMarginTop: 120 }}>
          <h3 className="h3" style={{ marginBottom: 4 }}>Authorship receipt</h3>
          <p className="body-xs" style={{ margin: "6px 0 16px", lineHeight: 1.55 }}>
            Built as you work. It travels with the paper and is visible to anyone who inspects it.
          </p>
          <div className="receipt">
            {receipt.map((e, i) => (
              <div key={`${e.stamp}-${i}`} className={i >= seedReceipt.length ? "fresh" : undefined}>
                <div className="stamp">{e.stamp}</div>
                <div className="text">{e.text}</div>
              </div>
            ))}
            {!locked && (
              <div className="pending">
                <div className="stamp">PENDING</div>
                <div className="text">Submission, rubric scores, oral defense</div>
              </div>
            )}
            {locked && (
              <div className="pending">
                <div className="stamp">PENDING</div>
                <div className="text">Rubric scores by a named evaluator, oral defense if requested</div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
