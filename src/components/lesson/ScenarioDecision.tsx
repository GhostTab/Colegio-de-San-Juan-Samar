import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle2, CircleDashed, Sparkles } from "lucide-react";
import type { Lesson } from "@/lib/contentData";

interface ScenarioDecisionProps {
  lesson: Lesson;
}

export default function ScenarioDecision({ lesson }: ScenarioDecisionProps) {
  const [choice, setChoice] = useState<number | null>(null);

  const scenario = useMemo(
    () => ({
      prompt: `A classmate is struggling with "${lesson.title}". What is the best next step?`,
      options: [
        "Review the lesson objective, then replay one step with captions.",
        "Skip to another topic and hope it becomes easier.",
        "Memorize terms without checking examples.",
      ],
      best: 0,
    }),
    [lesson.title],
  );

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
              Strong decision. You used an active learning strategy.
            </>
          ) : (
            <>
              <CircleDashed className="h-4 w-4 text-primary" />
              Tip: replay + captions + objective review helps most students retain concepts.
            </>
          )}
        </div>
      )}
    </div>
  );
}
