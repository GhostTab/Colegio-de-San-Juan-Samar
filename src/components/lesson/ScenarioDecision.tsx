import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle2, CircleDashed, Sparkles } from "lucide-react";
import type { Lesson } from "@/lib/contentData";

interface ScenarioDecisionProps {
  lesson: Lesson;
}

export default function ScenarioDecision({ lesson }: ScenarioDecisionProps) {
  const [choice, setChoice] = useState<number | null>(null);

  const scenario = useMemo(() => buildScenarioFromLesson(lesson), [lesson]);

  useEffect(() => {
    setChoice(null);
  }, [lesson.id]);

  return (
    <div className="rounded-2xl border border-border/60 bg-card/75 p-5">
      <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-accent/15 px-3 py-1 text-xs font-semibold text-accent">
        <Sparkles className="h-3.5 w-3.5" />
        Scenario mission
      </div>
      <p className="mb-4 text-sm font-semibold text-foreground">{scenario.prompt}</p>

      <div className="space-y-2">
        {scenario.options.map((option, index) => {
          const selected = choice === index;
          const showAnswer = choice !== null;
          const isBest = index === scenario.best;
          const stateClass = showAnswer
            ? isBest
              ? "border-emerald-500 bg-emerald-500/10 text-emerald-700"
              : selected
                ? "border-destructive bg-destructive/10 text-destructive"
                : "border-border text-muted-foreground"
            : "border-border hover:bg-secondary";

          return (
            <motion.button
              key={option}
              whileHover={choice === null ? { y: -1 } : undefined}
              whileTap={choice === null ? { scale: 0.99 } : undefined}
              onClick={() => setChoice(index)}
              disabled={choice !== null}
              className={`w-full rounded-xl border px-4 py-3 text-left text-sm transition-colors ${stateClass}`}
            >
              {option}
            </motion.button>
          );
        })}
      </div>

      {choice !== null && (
        <div className="mt-4 inline-flex items-center gap-2 rounded-lg bg-background/80 px-3 py-2 text-xs text-muted-foreground">
          {choice === scenario.best ? (
            <>
              <CheckCircle2 className="h-4 w-4 text-emerald-500" />
              {scenario.successFeedback}
            </>
          ) : (
            <>
              <CircleDashed className="h-4 w-4 text-primary" />
              {scenario.retryFeedback}
            </>
          )}
        </div>
      )}
    </div>
  );
}

function buildScenarioFromLesson(lesson: Lesson) {
  const focusStep = lesson.steps[1] || lesson.steps[0];
  const objective = focusStep?.learningObjective || extractSentence(focusStep?.content || lesson.description);
  const keywords = focusStep?.keywords || lesson.challengeHints || [];
  const keywordText = keywords.slice(0, 2).join(" and ");
  const misconception = lesson.misconceptions?.[0] || "confusing the main idea with an unrelated guess";
  const objectiveLabel = objective ? objective.toLowerCase() : "the lesson objective";
  const conceptPrompt = keywordText ? ` while checking ${keywordText}` : "";

  return {
    prompt: `A classmate is struggling with "${lesson.title}". What is the best next step to master "${focusStep?.title || "this lesson"}"?`,
    options: [
      `Review the objective (${objectiveLabel}), then replay "${focusStep?.title || "the key step"}"${conceptPrompt} and explain one example out loud.`,
      `Move to a new topic first and return later without checking where the misunderstanding started.`,
      `Memorize terms only, even if you cannot connect them to ${focusStep?.title?.toLowerCase() || "the lesson context"}.`,
    ],
    best: 0,
    successFeedback: `Strong decision. It uses objective-based review and an example, which directly targets retention for ${focusStep?.title || "the lesson"}.`,
    retryFeedback: `Try the option that starts from the objective and guided replay. It corrects "${misconception}" using evidence from the lesson.`,
  };
}

function extractSentence(text: string) {
  return text
    .replace(/\n+/g, " ")
    .split(/[.!?]/)
    .map((segment) => segment.trim())
    .find(Boolean) || "";
}
