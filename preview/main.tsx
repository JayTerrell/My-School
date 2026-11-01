// Single-file preview of the whole site: the same pages and components as the
// Next.js app, routed in the browser instead of on a server.

import { createRoot } from "react-dom/client";
import { useEffect, useState } from "react";
import { AppHeader } from "@/components/AppHeader";
import { LearnerProvider } from "@/components/LearnerStore";
import { PublicHeader } from "@/components/PublicHeader";
import { parseAskBody, seededAnswer } from "@/lib/ai/seeded";
import { learner } from "@/lib/data/learner";
import { getProgram } from "@/lib/data/programs";
import { scrollToAnchor, takePendingAnchor, useView, type View } from "./nav";

import CatalogPage from "@/app/(public)/page";
import ProgramDetail from "@/app/(public)/programs/[id]/page";
import ApplyPage from "@/app/(public)/apply/page";
import PortfolioPage from "@/app/(public)/u/[handle]/page";
import Dashboard from "@/app/(learner)/dashboard/page";
import ProgramPage from "@/app/(learner)/program/page";
import CoursePage from "@/app/(learner)/courses/[code]/page";
import LecturePage from "@/app/(learner)/courses/[code]/lectures/[lectureId]/page";
import ReadingPage from "@/app/(learner)/courses/[code]/readings/[readingId]/page";
import AssignmentPage from "@/app/(learner)/courses/[code]/assignments/[assignmentId]/page";
import RecordsPage from "@/app/(learner)/records/page";

type PageFn = (props: { params: Promise<any>; searchParams: Promise<any> }) => React.ReactNode | Promise<React.ReactNode>;

function pageFor(view: View): { Page: PageFn; audience: "public" | "learner" } {
  const p = view.path;
  if (p === "/") return { Page: CatalogPage as PageFn, audience: "public" };
  if (p.startsWith("/programs/")) return { Page: ProgramDetail as PageFn, audience: "public" };
  if (p === "/apply") return { Page: ApplyPage as PageFn, audience: "public" };
  if (p.startsWith("/u/")) return { Page: PortfolioPage as PageFn, audience: "public" };
  if (p === "/dashboard") return { Page: Dashboard as PageFn, audience: "learner" };
  if (p === "/program") return { Page: ProgramPage as PageFn, audience: "learner" };
  if (p === "/records") return { Page: RecordsPage as PageFn, audience: "learner" };
  if (p.includes("/lectures/")) return { Page: LecturePage as PageFn, audience: "learner" };
  if (p.includes("/readings/")) return { Page: ReadingPage as PageFn, audience: "learner" };
  if (p.includes("/assignments/")) return { Page: AssignmentPage as PageFn, audience: "learner" };
  return { Page: CoursePage as PageFn, audience: "learner" };
}

// No server here: answer /api/ask with the pre-written, source-cited answers.
const realFetch = window.fetch.bind(window);
window.fetch = async (input: RequestInfo | URL, init?: RequestInit) => {
  if (String(input) === "/api/ask") {
    const body = parseAskBody(JSON.parse(String(init?.body ?? "null")));
    await new Promise((r) => setTimeout(r, 450));
    return new Response(JSON.stringify(body ? seededAnswer(body) : { error: "Invalid request" }), {
      status: body ? 200 : 400,
      headers: { "Content-Type": "application/json" },
    });
  }
  return realFetch(input, init);
};

function NotFound() {
  return (
    <main className="shell main">
      <div className="label label--lg">Not found</div>
      <h1 className="h1">This page isn&apos;t part of the catalog yet.</h1>
    </main>
  );
}

function App() {
  const view = useView();
  const [content, setContent] = useState<{ key: string; node: React.ReactNode } | null>(null);
  const { Page, audience } = pageFor(view);

  useEffect(() => {
    let live = true;
    Promise.resolve()
      .then(() => Page({ params: Promise.resolve(view.params), searchParams: Promise.resolve(view.searchParams) }))
      .then(
        (node) => live && setContent({ key: view.name, node }),
        () => live && setContent({ key: view.name, node: <NotFound /> }),
      );
    return () => {
      live = false;
    };
  }, [view, Page]);

  useEffect(() => {
    if (content?.key === view.name) requestAnimationFrame(() => scrollToAnchor(takePendingAnchor()));
  }, [content, view.name]);

  const program = getProgram(learner.programId)!;
  return (
    <>
      {audience === "public" ? (
        <PublicHeader />
      ) : (
        <AppHeader name={learner.name} initials={learner.initials} meta={`${program.name.toUpperCase()} · YR ${learner.year}`} />
      )}
      <div key={content?.key}>{content?.node}</div>
    </>
  );
}

createRoot(document.getElementById("root")!).render(
  <LearnerProvider>
    <App />
  </LearnerProvider>,
);
