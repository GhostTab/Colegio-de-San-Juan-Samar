import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, XCircle } from "lucide-react";
import { useState } from "react";

export type QuizItem = {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
};

type QuizComponentProps = {
  item: QuizItem;
  onAnswered?: (isCorrect: boolean) => void;
};

export default function QuizComponent({ item, onAnswered }: QuizComponentProps) {
  const [selected, setSelected] = useState<number | null>(null);
  const answered = selected !== null;
  const isCorrect = selected === item.correctIndex;

  const choose = (index: number) => {
    if (answered) return;
    setSelected(index);
    onAnswered?.(index === item.correctIndex);
  };

  return (
    <div className="rounded-2xl border border-border/60 bg-background/20 p-4">
      <p className="font-semibold text-foreground mb-3">{item.question}</p>
      <div className="space-y-2">
        {item.options.map((option, index) => {
          const state = answered
            ? index === item.correctIndex
              ? "border-emerald-500 bg-emerald-50 text-emerald-700"
              : index === selected
                ? "border-destructive bg-destructive/10 text-destructive"
                : "border-border text-muted-foreground"
            : "border-border hover:border-primary/40 text-foreground";

          return (
            <button
              key={`${option}-${index}`}
              onClick={() => choose(index)}
              className={`w-full rounded-xl border px-3 py-2 text-left text-sm transition-colors ${state}`}
            >
              {option}
            </button>
          );
        })}
      </div>

      <AnimatePresence>
        {answered && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-3 rounded-xl bg-secondary/70 px-3 py-2 text-sm"
          >
            <p className="font-semibold flex items-center gap-2 text-foreground">
              {isCorrect ? <CheckCircle2 className="h-4 w-4 text-emerald-500" /> : <XCircle className="h-4 w-4 text-destructive" />}
              {isCorrect ? "Correct" : "Try this explanation"}
            </p>
            <p className="text-muted-foreground mt-1">{item.explanation}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
