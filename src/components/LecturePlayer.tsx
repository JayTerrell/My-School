"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { clock } from "@/lib/academic";
import { claims, course, interruptActions, lecture, type ClaimId, type GroundedAnswer, type InterruptMode } from "@/lib/data/hist210";
import { useLearner } from "./LearnerStore";

const SPEEDS = [1, 1.25, 1.5, 2];

type Answer = GroundedAnswer & { grounded?: boolean; source?: "seed" | "model"; at: number; mode: InterruptMode };

export function LecturePlayer() {
  const { state, dispatch, log } = useLearner();
  const t = state.lectureT;
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [answer, setAnswer] = useState<Answer | null>(null);
  const [loading, setLoading] = useState<InterruptMode | null>(null);
  const [claim, setClaim] = useState<ClaimId | null>(null);
  const [draftNote, setDraftNote] = useState("");
  const tRef = useRef(t);
  tRef.current = t;

  // Playback clock. A real build syncs this to the audio element's currentTime.
  useEffect(() => {
    if (!playing) return;
    const iv = window.setInterval(() => {
      const next = tRef.current + 1;
      if (next >= lecture.duration) {
        dispatch({ type: "seek", t: lecture.duration });
        setPlaying(false);
        log(`Lecture ${lecture.number} completed · quiz unlocked`);
      } else {
        dispatch({ type: "seek", t: next });
      }
    }, 1000 / speed);
    return () => window.clearInterval(iv);
  }, [playing, speed, dispatch, log]);

  const toggle = () => {
    if (!playing) setAnswer(null);
    setPlaying((p) => !p);
  };

  const interrupt = async (mode: InterruptMode, label: string) => {
    setPlaying(false);
    setLoading(mode);
    const at = tRef.current;
    log(`Lecture paused at ${clock(at)} · "${label}"`);
    try {
      const res = await fetch("/api/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ kind: "interrupt", mode, at }),
      });
      if (!res.ok) throw new Error(String(res.status));
      setAnswer({ ...(await res.json()), at, mode });
    } catch {
      setAnswer({
        label: "Unavailable",
        title: "The tutor couldn't be reached",
        paragraphs: ["Nothing was generated, so nothing is shown. Resume the lecture and try again in a moment."],
        citations: [],
        grounded: false,
        at,
        mode,
      });
    } finally {
      setLoading(null);
    }
  };

  const inspect = (id: ClaimId) => {
    setClaim(id);
    log(`Source inspected · ${id} — ${claims[id].source}`);
  };

  const saveClaim = () => {
    if (!claim) return;
    const c = claims[claim];
    if (state.notebook.some((e) => e.id === `claim-${claim}`)) return;
    dispatch({
      type: "saveToNotebook",
      entry: { id: `claim-${claim}`, tag: `LECTURE ${lecture.number} · ${claim}`, tone: c.disputed ? "caution" : "accent", text: c.excerpt.replace(/^"|"$/g, ""), cite: c.short },
    });
  };

  const stampNote = () => {
    const text = draftNote.trim();
    if (!text) return;
    dispatch({ type: "addNote", at: tRef.current, text });
    setDraftNote("");
  };

  const pct = (t / lecture.duration) * 100;
  const current = lecture.segments.filter((s) => s.at <= t).pop();
  const C = claim ? claims[claim] : null;
  const kc = lecture.knowledgeCheck;
  const savedClaim = claim ? state.notebook.some((e) => e.id === `claim-${claim}`) : false;

  return (
    <div className="cols">
      <div style={{ flex: "1 1 560px", minWidth: 0 }}>
        <div className={`player${answer || loading ? " player--attached" : ""}`}>
          <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 12, alignItems: "baseline" }}>
            <div className="label" style={{ letterSpacing: ".14em" }}>{course.code} · Module 4 · Lecture {lecture.number}</div>
            <div className="label" style={{ letterSpacing: ".1em" }} aria-live="polite">{t >= lecture.duration ? "COMPLETE" : playing ? "PLAYING" : "PAUSED"}</div>
          </div>
          <h1>{lecture.title}</h1>
          <p>{lecture.subtitle}</p>
          <div className="player__controls">
            <button type="button" className="play-btn" onClick={toggle} aria-label={playing ? "Pause" : "Play"} disabled={t >= lecture.duration}>
              {playing ? "❙❙" : "▶"}
            </button>
            <div className="scrub">
              <div
                className="scrub__track"
                role="slider"
                aria-label="Lecture position"
                aria-valuemin={0}
                aria-valuemax={lecture.duration}
                aria-valuenow={t}
                aria-valuetext={clock(t)}
                tabIndex={0}
                onClick={(e) => {
                  const r = e.currentTarget.getBoundingClientRect();
                  dispatch({ type: "seek", t: Math.round(((e.clientX - r.left) / r.width) * lecture.duration) });
                }}
                onKeyDown={(e) => {
                  if (e.key === "ArrowRight") dispatch({ type: "seek", t: t + 10 });
                  if (e.key === "ArrowLeft") dispatch({ type: "seek", t: t - 10 });
                }}
              >
                <span style={{ width: `${pct.toFixed(1)}%` }} />
              </div>
              <div className="scrub__times"><span>{clock(t)}</span><span>{clock(lecture.duration)}</span></div>
            </div>
            <div style={{ flex: "0 0 auto", display: "flex", gap: 6 }}>
              <button type="button" className="dark-btn" onClick={() => setSpeed(SPEEDS[(SPEEDS.indexOf(speed) + 1) % SPEEDS.length])} aria-label="Playback speed">
                {Number.isInteger(speed) ? speed.toFixed(1) : speed}×
              </button>
              <button
                type="button"
                className="dark-btn"
                onClick={() => {
                  dispatch({ type: "bookmark", at: t });
                  log(`Lecture bookmarked at ${clock(t)}`);
                }}
              >
                {state.bookmarks.includes(t) ? "BOOKMARKED" : "BOOKMARK"}
              </button>
            </div>
          </div>
          <div className="interrupts">
            <div className="label" style={{ marginBottom: 12 }}>Interrupt the lecture</div>
            <div className="btn-row">
              {interruptActions.map((a) => (
                <button
                  key={a.mode}
                  type="button"
                  className={`interrupt${answer?.mode === a.mode || loading === a.mode ? " interrupt--on" : ""}`}
                  onClick={() => interrupt(a.mode, a.label)}
                  disabled={loading !== null}
                >
                  {a.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {loading && !answer && (
          <div className="answer" aria-live="polite">
            <div className="label label--accent">Paused at {clock(t)} · searching the approved corpus…</div>
          </div>
        )}
        {answer && (
          <div className="answer" aria-live="polite">
            <div style={{ display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap", alignItems: "baseline", marginBottom: 12 }}>
              <div className="label label--accent">Paused at {clock(answer.at)} · {answer.label}</div>
              <button type="button" className="action" style={{ background: "none", border: "none", padding: 0 }} onClick={toggle}>Resume lecture ↻</button>
            </div>
            <h3>{answer.title}</h3>
            {answer.paragraphs.map((p, i) => <p key={i}>{p}</p>)}
            <div className="answer__cites">
              <div className="label label--accent" style={{ marginBottom: 8 }}>{answer.citations.length ? "Drawn from" : "No sources cited"}</div>
              {answer.citations.map((c) => <div key={c}>{c}</div>)}
              {!answer.citations.length && <div>The corpus does not support an answer here, so none was given.</div>}
            </div>
            {answer.source && (
              <div className="answer__source">
                {answer.source === "model" ? "GENERATED NOW FROM RETRIEVED PASSAGES · LOGGED" : "PRE-WRITTEN COURSE ANSWER · LOGGED"}
              </div>
            )}
          </div>
        )}

        <div className="card" style={{ marginTop: 20 }}>
          <div className="card__head">
            <h2 className="h2" style={{ fontSize: 19 }}>Transcript</h2>
            <span className="label" style={{ letterSpacing: ".08em" }}>Tap a source mark to inspect the claim</span>
          </div>
          <div style={{ padding: "8px 22px 24px" }}>
            {lecture.segments.map((s) => {
              const ahead = s.at > t;
              const now = current === s;
              return (
                <div key={s.at} className={`seg${claim && s.claim === claim ? " seg--hl" : ""}${ahead ? " seg--ahead" : ""}${now ? " seg--now" : ""}`}>
                  <button type="button" className="seg__at" onClick={() => dispatch({ type: "seek", t: s.at })} aria-label={`Jump to ${clock(s.at)}`}>
                    {clock(s.at)}
                  </button>
                  <p>
                    {s.text}
                    {s.claim && (
                      <button
                        type="button"
                        className={`smark${claims[s.claim].disputed ? " smark--disputed" : ""}`}
                        onClick={() => inspect(s.claim!)}
                        aria-label={`Inspect claim ${s.claim}${claims[s.claim].disputed ? " (disputed)" : ""}`}
                      >
                        {s.claim}
                      </button>
                    )}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="col-side">
        {C && claim && (
          <div className="card card--focus card--pad">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 10, marginBottom: 12 }}>
              <div className="label label--accent">Claim inspector · {claim}</div>
              <button type="button" className="close-x" onClick={() => setClaim(null)} aria-label="Close claim inspector">✕</button>
            </div>
            <div className="mono" style={{ fontSize: 11, letterSpacing: ".06em", color: C.disputed ? "var(--caution)" : "var(--accent)", marginBottom: 12 }}>{C.status}</div>
            <h3 style={{ font: "400 17px/1.35 var(--serif)", margin: "0 0 4px" }}>{C.source}</h3>
            <div className="meta" style={{ marginBottom: 14 }}>{C.loc} · {C.kind}</div>
            <p className="quote" style={{ fontSize: 14.5, lineHeight: 1.7, fontWeight: 400, paddingLeft: 12, marginBottom: 14 }}>{C.excerpt}</p>
            <p className="body-sm" style={{ lineHeight: 1.6, marginBottom: 16 }}>{C.note}</p>
            <div className="btn-row">
              <Link href={`/courses/${course.slug}/readings/cline-ch2`} className="btn btn--primary btn--sm">Open in reader</Link>
              <button type="button" className="btn btn--secondary btn--sm" onClick={saveClaim} disabled={savedClaim}>
                {savedClaim ? "Saved to notebook ✓" : "Save to notebook"}
              </button>
            </div>
          </div>
        )}

        <div className="card card--pad">
          <h3 className="h3" style={{ marginBottom: 14 }}>Notes at timestamps</h3>
          {state.notes.map((n, i) => (
            <div className="note" key={`${n.at}-${i}`}>
              <button type="button" className="stamp" onClick={() => dispatch({ type: "seek", t: n.at })} aria-label={`Jump to ${clock(n.at)}`}>{clock(n.at)}</button>
              <p>{n.text}</p>
            </div>
          ))}
          {state.bookmarks.length > 0 && (
            <div className="note">
              <div className="label" style={{ marginBottom: 6 }}>Bookmarks</div>
              <div className="btn-row">
                {state.bookmarks.map((b) => (
                  <button key={b} type="button" className="chip chip--accent" onClick={() => dispatch({ type: "seek", t: b })}>{clock(b)}</button>
                ))}
              </div>
            </div>
          )}
          <textarea
            className="textarea"
            style={{ marginTop: 12, minHeight: 74 }}
            placeholder="Note at this moment — it will be stamped and linked…"
            value={draftNote}
            onChange={(e) => setDraftNote(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) stampNote();
            }}
            aria-label="New note"
          />
          <button type="button" className="btn btn--secondary btn--sm" style={{ marginTop: 8 }} onClick={stampNote} disabled={!draftNote.trim()}>
            Stamp note at {clock(t)}
          </button>
        </div>

        <div className="card card--pad">
          <div className="label" style={{ marginBottom: 10 }}>Knowledge check at {kc.at}</div>
          <p style={{ font: "400 16px/1.5 var(--serif)", margin: "0 0 14px", color: "var(--ink-reading-2)" }}>{kc.question}</p>
          {kc.options.map((o, i) => {
            const answered = state.kcAnswer !== null;
            const cls = answered ? (i === kc.correct ? " option--right" : i === state.kcAnswer ? " option--wrong" : "") : "";
            return (
              <button
                key={o}
                type="button"
                className={`option${cls}`}
                disabled={answered}
                onClick={() => {
                  dispatch({ type: "answerCheck", choice: i });
                  log(`Knowledge check answered · ${i === kc.correct ? "correct" : "incorrect"}`);
                }}
              >
                {o}
              </button>
            );
          })}
          {state.kcAnswer !== null && (
            <p className="body-sm" style={{ marginTop: 8, color: state.kcAnswer === kc.correct ? "var(--accent)" : "var(--caution-ink)" }}>
              {state.kcAnswer === kc.correct ? "Right. " : "Not quite. "}
              {kc.explanation}
            </p>
          )}
        </div>

        <div className="disclosure">
          <div className="label" style={{ marginBottom: 8 }}>Recorded this session</div>
          <p className="body-xs">
            Lecture time, interruptions, and every source you inspected are written to your authorship record. You can see exactly what it says.
          </p>
          {state.events.length > 0 && (
            <Link href={`/courses/${course.slug}/assignments/comparative#receipt`} className="textlink" style={{ display: "inline-block", marginTop: 10 }}>
              {state.events.length} events recorded →
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
