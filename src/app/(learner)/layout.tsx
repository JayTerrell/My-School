import { AppHeader } from "@/components/AppHeader";
import { LearnerProvider } from "@/components/LearnerStore";
import { learner } from "@/lib/data/learner";
import { getProgram } from "@/lib/data/programs";

export default function LearnerLayout({ children }: { children: React.ReactNode }) {
  const program = getProgram(learner.programId)!;
  return (
    <LearnerProvider>
      <AppHeader name={learner.name} initials={learner.initials} meta={`${program.name.toUpperCase()} · YR ${learner.year}`} />
      {children}
    </LearnerProvider>
  );
}
