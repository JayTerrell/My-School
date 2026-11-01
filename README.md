# Athenaeum

An independent online university where every claim, grade, and AI interaction can be inspected.
Programs run like full degrees; lectures, practice, and tutoring are generated **only from each course's approved sources**;
work is assessed by named reviewers against locked rubrics; and the learner's whole record is publishable as a public dossier.

This repo is the first working build of the design handoff in [`docs/design-handoff/`](docs/design-handoff/README.md)
(design brief, clickable prototype, and the founder's full 23-area product spec).

## See it

A hosted, clickable preview of the whole site (no install): https://claude.ai/artifact/VXV4SLXXEgHAYpY295ZSwj
(private to the owner until shared from the page's Share menu). It uses the same pages and components as the app, routed
in the browser, with the pre-written course answers. `npm run build:preview` regenerates it as `dist/athenaeum.html`.

## Run it locally

```bash
npm install
```

```bash
npm run dev
```

Open http://localhost:3000. The public catalog is at `/`; the learner app starts at `/dashboard`.

Optional: copy `.env.example` to `.env.local` and set `ANTHROPIC_API_KEY`. With a key, lecture interruptions and
"Ask about this passage" are answered live by Claude from the course's retrieved source passages. Without one, the app
serves pre-written, source-cited answers, so everything works offline.

## What's built

| Screen | Route | Works |
|---|---|---|
| Catalog (public) | `/` | Level filter (`?level=`), program cards, "how it works" |
| Program detail (public) | `/programs/[id]` | Term timeline, every class in order with syllabus accordion, outcomes, apply CTA |
| Dashboard | `/dashboard` | Agenda deep-links, live lecture position / draft words / reading progress |
| Degree audit | `/program` | Requirement buckets, curriculum map, graduation criteria, provenance, full schedule with status |
| Course home | `/courses/hist-210` | Module strip, live checklist (quiz unlocks when the lecture finishes), seminar, grade build-up, corpus |
| Lecture | `/courses/hist-210/lectures/4-1` | Play/pause/seek/speed/bookmark, 5 interrupt modes, transcript sync, claim inspector, timestamped notes, knowledge check |
| Reading | `/courses/hist-210/readings/cline-ch2` | Highlight → annotate → tag → auto Chicago citation → notebook; ask about a passage; mark section worked through |
| Essay | `/courses/hist-210/assignments/comparative` | Live word count, cite from notebook at the cursor, AI-use declaration with integrity routing, submit seals the receipt |
| Records | `/records?tab=course\|term\|outcome` | Gradebook, transcript, outcome mastery |
| Portfolio (public) | `/u/ada-reyes` | Claim → evidence accordions, transparency record, visibility controls |

**One source of truth.** Credits, index, standing, course status (complete / in progress / planned / locked with reason),
degree-audit buckets, and projected completion are all derived in `src/lib/academic.ts` from the program and enrollment
seed. That fixes the mismatched numbers noted in the handoff: the learner has **30** credits and a **3.66** index everywhere,
not 38 / 3.74 in some places.

**The authorship receipt is real.** Every interruption, inspected source, saved quote, section read, and submission is
appended to the learner's process log and shows up on the essay's receipt.

**Source-bounded AI** (`src/app/api/ask/route.ts`): the model sees only passages retrieved from the course corpus
(`src/lib/ai/corpus.ts`), returns structured JSON naming the passage ids it used, and the server attaches citation labels
from the corpus — so a citation can't point outside the approved sources. If the passages can't support an answer, it
says so and cites nothing.

## Not built yet

- **Persistence and accounts.** Learner state lives in the browser (`localStorage`) behind `LearnerStore`; each action maps
  to a row a Postgres store would write (authorship events, notebook entries, drafts, declarations). There is no login.
- **Placeholder buttons:** Practice these, Compose a seminar post, Compare with EA 35, Five questions, Where does this need
  evidence?, Outline view, Export dossier (PDF), Verify this record, and the portfolio artifact buttons.
- **Audio/TTS** for lectures (the clock is simulated), and real vector retrieval over licensed source text.
- The rest of the founder's spec: onboarding and admissions, quiz-taking, graded feedback view, tutor chat, oral defense
  scheduling and recording, integrity review, reviewer console, curriculum studio, source library, payments, notifications,
  accessibility settings.

All sources, quotes, and people in the seed data are illustrative. Verify licensing before using real course material.

## Layout

```
src/app/(public)/      catalog, program detail, apply, public portfolio (marketing header)
src/app/(learner)/     dashboard, program, course, lecture, reading, essay, records (learner header)
src/app/api/ask/       source-bounded answer endpoint
src/components/        headers, schedule accordion, lecture player, reader, essay workspace, learner store
src/lib/data/          seed data: programs, learner, HIST 210 course content, portfolio
src/lib/academic.ts    every derived number and status
src/app/globals.css    design tokens (one accent, one caution) and components
```

Stack: Next.js 16 (App Router), React 19, TypeScript, plain CSS variables, `@anthropic-ai/sdk`.
