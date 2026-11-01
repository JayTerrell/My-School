"use client";

// The learner's working state: lecture position, notes, research notebook,
// essay draft, AI-use declaration, and the authorship log. Persisted to this
// browser for now; each action maps 1:1 to a row a Postgres store would write
// (AuthorshipEvents, NotebookEntries, Drafts, AIDeclaration).

import { createContext, useCallback, useContext, useEffect, useMemo, useReducer, useRef, useState } from "react";
import {
  essay,
  lecture,
  reading,
  seedNotebook,
  type AuthorshipEvent,
  type DeclarationKey,
  type NotebookEntry,
} from "@/lib/data/hist210";

export interface LearnerState {
  lectureT: number;
  notes: Array<{ at: number; text: string }>;
  bookmarks: number[];
  kcAnswer: number | null;
  notebook: NotebookEntry[];
  readSections: number;
  draft: string;
  draftSavedAt: number | null;
  disclosure: string;
  ai: Record<DeclarationKey, boolean>;
  submitted: boolean;
  /** Process events recorded in this browser, newest last. */
  events: AuthorshipEvent[];
}

const initialState: LearnerState = {
  lectureT: lecture.resumeAt,
  notes: lecture.seedNotes,
  bookmarks: [],
  kcAnswer: null,
  notebook: seedNotebook,
  readSections: reading.seedRead,
  draft: essay.seedDraft,
  draftSavedAt: null,
  disclosure: essay.seedDisclosure,
  ai: Object.fromEntries(essay.declarations.map((d) => [d.key, d.seed])) as Record<DeclarationKey, boolean>,
  submitted: false,
  events: [],
};

type Action =
  | { type: "hydrate"; state: LearnerState }
  | { type: "reset" }
  | { type: "seek"; t: number }
  | { type: "addNote"; at: number; text: string }
  | { type: "bookmark"; at: number }
  | { type: "answerCheck"; choice: number }
  | { type: "saveToNotebook"; entry: NotebookEntry }
  | { type: "markSectionRead" }
  | { type: "setDraft"; text: string }
  | { type: "setDisclosure"; text: string }
  | { type: "toggleAi"; key: DeclarationKey }
  | { type: "submit" }
  | { type: "log"; text: string };

export function stampNow(d = new Date()) {
  const day = d.toLocaleDateString("en-GB", { weekday: "short" }).toUpperCase();
  return `${day} ${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
}

function withEvent(state: LearnerState, text: string): LearnerState {
  return { ...state, events: [...state.events, { stamp: stampNow(), text }] };
}

function reducer(state: LearnerState, action: Action): LearnerState {
  switch (action.type) {
    case "hydrate":
      return action.state;
    case "reset":
      return initialState;
    case "seek":
      return { ...state, lectureT: Math.max(0, Math.min(lecture.duration, action.t)) };
    case "addNote":
      return { ...state, notes: [...state.notes, { at: action.at, text: action.text }].sort((a, b) => a.at - b.at) };
    case "bookmark":
      return state.bookmarks.includes(action.at) ? state : { ...state, bookmarks: [...state.bookmarks, action.at].sort((a, b) => a - b) };
    case "answerCheck":
      return { ...state, kcAnswer: action.choice };
    case "saveToNotebook":
      return withEvent({ ...state, notebook: [...state.notebook, action.entry] }, `Notebook · quote saved — ${action.entry.cite}`);
    case "markSectionRead": {
      if (state.readSections >= reading.sections.length) return state;
      const next = state.readSections + 1;
      return withEvent({ ...state, readSections: next }, `Reading · ${reading.sections[state.readSections]} worked through`);
    }
    case "setDraft":
      return { ...state, draft: action.text, draftSavedAt: Date.now() };
    case "setDisclosure":
      return { ...state, disclosure: action.text };
    case "toggleAi":
      return { ...state, ai: { ...state.ai, [action.key]: !state.ai[action.key] } };
    case "submit":
      if (state.submitted) return state;
      return withEvent(
        { ...state, submitted: true },
        state.ai.draft ? "Submitted to integrity review · declaration + draft history attached" : "Submitted with declaration · receipt sealed",
      );
    case "log":
      return withEvent(state, action.text);
  }
}

const STORAGE_KEY = "athenaeum:learner:v1";

interface Store {
  state: LearnerState;
  dispatch: React.Dispatch<Action>;
  log: (text: string) => void;
  hydrated: boolean;
}

const LearnerContext = createContext<Store | null>(null);

export function LearnerProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [hydrated, setHydrated] = useState(false);
  const loaded = useRef(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) dispatch({ type: "hydrate", state: { ...initialState, ...JSON.parse(raw) } });
    } catch {
      /* storage unavailable or corrupt: keep the seed */
    }
    loaded.current = true;
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!loaded.current) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      /* private mode etc. */
    }
  }, [state]);

  const log = useCallback((text: string) => dispatch({ type: "log", text }), []);
  const value = useMemo(() => ({ state, dispatch, log, hydrated }), [state, log, hydrated]);
  return <LearnerContext.Provider value={value}>{children}</LearnerContext.Provider>;
}

export function useLearner() {
  const ctx = useContext(LearnerContext);
  if (!ctx) throw new Error("useLearner must be used inside <LearnerProvider>");
  return ctx;
}
