"use client";

import Link from "next/link";
import { clock, wordCount } from "@/lib/academic";
import { course, essay, lecture } from "@/lib/data/hist210";
import { useLearner } from "./LearnerStore";

const COURSE = `/courses/${course.slug}`;

export function ModuleChecklist() {
  const { state } = useLearner();
  const lectureDone = state.lectureT >= lecture.duration;
  // Annotations saved from the reader this week (seed entries came from earlier sessions).
  const annotated = state.notebook.filter((e) => e.id.startsWith("read-")).length;
  const sourceSetDone = annotated >= 4;
  const doneCount = 1 + (lectureDone ? 1 : 0) + (sourceSetDone ? 1 : 0) + (state.submitted ? 1 : 0);

  return (
    <div className="card mb-20">
      <div className="card__head">
        <h3 className="h3 h3--19">Module checklist</h3>
        <span className="meta">{doneCount} OF 6 COMPLETE</span>
      </div>
      <div style={{ padding: "4px 22px 18px" }}>
        <div className="row">
          <span className="check check--done" aria-label="Complete">✓</span>
          <div style={{ flex: "1 1 180px", minWidth: 0 }} className="task__title task__title--done">Reading — Cline ch. 1; Amarna letters EA 7, 35</div>
          <span className="task__tag">90 MIN</span>
        </div>

        <Link href={`${COURSE}/lectures/${lecture.id}`} className="row row--link">
          <span className={`check ${lectureDone ? "check--done" : "check--active"}`}>{lectureDone ? "✓" : ""}</span>
          <div style={{ flex: "1 1 180px", minWidth: 0 }}>
            <div className={`task__title ${lectureDone ? "task__title--done" : "task__title--strong"}`}>Lecture {lecture.number} — {lecture.title}</div>
            {!lectureDone && <div className="task__sub task__sub--accent">In progress — {clock(state.lectureT)} of {clock(lecture.duration)}</div>}
          </div>
          <span className="task__tag task__tag--accent">{lectureDone ? "REVIEW" : "RESUME"}</span>
        </Link>

        <Link href={`${COURSE}/readings/cline-ch2`} className="row row--link">
          <span className={`check ${sourceSetDone ? "check--done" : "check--todo"}`}>{sourceSetDone ? "✓" : ""}</span>
          <div style={{ flex: "1 1 180px", minWidth: 0 }}>
            <div className={`task__title ${sourceSetDone ? "task__title--done" : ""}`}>Primary source set — six tablets, annotated</div>
            <div className="task__sub">Annotate at least four passages{annotated > 0 && !sourceSetDone ? ` · ${annotated} so far` : ""}</div>
          </div>
          <span className="task__tag">60 MIN</span>
        </Link>

        <a href="#seminar" className="row row--link">
          <span className="check check--todo" />
          <div style={{ flex: "1 1 180px", minWidth: 0 }}>
            <div className="task__title">Seminar post + one substantive reply</div>
            <div className="task__sub task__sub--caution">Due in 3 days · claim + evidence + counter required</div>
          </div>
          <span className="task__tag">15% CAT.</span>
        </a>

        <div className="row">
          <span className={`check ${lectureDone ? "check--todo" : "check--locked"}`} />
          <div style={{ flex: "1 1 180px", minWidth: 0 }}>
            <div className={`task__title ${lectureDone ? "" : "task__title--muted"}`}>Module 4 quiz — 18 items</div>
            <div className={`task__sub ${lectureDone ? "task__sub--caution" : "task__sub--muted"}`}>
              {lectureDone ? "Unlocked · due in 2 days" : `Unlocks when Lecture ${lecture.number} is complete`}
            </div>
          </div>
          <span className="task__tag">{lectureDone ? "OPEN" : "LOCKED"}</span>
        </div>

        <Link href={`${COURSE}/assignments/${essay.id}`} className="row row--link">
          <span className={`check ${state.submitted ? "check--done" : "check--active"}`}>{state.submitted ? "✓" : ""}</span>
          <div style={{ flex: "1 1 180px", minWidth: 0 }}>
            <div className={`task__title ${state.submitted ? "task__title--done" : "task__title--strong"}`}>Comparative essay — {essay.wordLimit.toLocaleString()} words</div>
            <div className="task__sub task__sub--accent">
              {state.submitted ? "Submitted · receipt sealed" : `Draft v${essay.draftVersion} saved · ${wordCount(state.draft).toLocaleString()} words · due Friday`}
            </div>
          </div>
          <span className="task__tag task__tag--accent">{state.submitted ? "RECEIPT" : "WRITE"}</span>
        </Link>
      </div>
    </div>
  );
}
