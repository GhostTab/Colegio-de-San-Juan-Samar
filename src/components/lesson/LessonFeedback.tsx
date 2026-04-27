import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ThumbsDown, ThumbsUp } from "lucide-react";
import { getProgress, setLessonReaction } from "@/lib/progressStore";

type LessonReaction = "like" | "dislike" | null;

interface LessonFeedbackProps {
  lessonId: number;
}

export default function LessonFeedback({ lessonId }: LessonFeedbackProps) {
  const [reaction, setReaction] = useState<LessonReaction>(null);

  useEffect(() => {
    const current = getProgress();
    setReaction(current.lessonReactions[String(lessonId)] ?? null);
  }, [lessonId]);

  const handleReaction = (nextReaction: Exclude<LessonReaction, null>) => {
    const value = reaction === nextReaction ? null : nextReaction;
    setReaction(value);
    setLessonReaction(lessonId, value);
  };

  return (
    <div className="rounded-2xl border border-border/60 bg-card/70 p-4">
      <p className="text-sm font-semibold text-foreground">Was this lesson helpful?</p>
      <p className="mt-1 text-xs text-muted-foreground">Your feedback helps teachers improve content quality.</p>

      <div className="mt-3 flex flex-wrap gap-3">
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={() => handleReaction("like")}
          className={`inline-flex items-center gap-2 rounded-xl border px-4 py-2 text-sm font-medium transition-colors ${
            reaction === "like"
              ? "border-emerald-500 bg-emerald-500/10 text-emerald-600"
              : "border-border hover:bg-secondary"
          }`}
          aria-pressed={reaction === "like"}
        >
          <ThumbsUp className="h-4 w-4" />
          Like
        </motion.button>
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={() => handleReaction("dislike")}
          className={`inline-flex items-center gap-2 rounded-xl border px-4 py-2 text-sm font-medium transition-colors ${
            reaction === "dislike"
              ? "border-destructive bg-destructive/10 text-destructive"
              : "border-border hover:bg-secondary"
          }`}
          aria-pressed={reaction === "dislike"}
        >
          <ThumbsDown className="h-4 w-4" />
          Needs work
        </motion.button>
      </div>
    </div>
  );
}
