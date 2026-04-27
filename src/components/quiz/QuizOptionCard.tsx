import { motion } from "framer-motion";

interface QuizOptionCardProps {
  option: string;
  index: number;
  answered: boolean;
  selected: number | null;
  correctIndex: number;
  onSelect: (index: number) => void;
}

export default function QuizOptionCard({
  option,
  index,
  answered,
  selected,
  correctIndex,
  onSelect,
}: QuizOptionCardProps) {
  const className = answered
    ? index === correctIndex
      ? "bg-emerald-50 text-emerald-700"
      : index === selected
        ? "bg-destructive/5 text-destructive"
        : "border-border text-muted-foreground"
    : selected === index
      ? "bg-primary/5 text-foreground"
      : "hover:bg-secondary/80 text-foreground";

  return (
    <motion.button
      whileHover={!answered ? { scale: 1.01 } : undefined}
      whileTap={!answered ? { scale: 0.99 } : undefined}
      onClick={() => onSelect(index)}
      className={`w-full text-left rounded-xl bg-secondary/50 p-4 font-medium transition-all ${className}`}
      aria-pressed={selected === index}
    >
      <span className="mr-3 inline-flex h-7 w-7 items-center justify-center rounded-lg bg-secondary text-sm font-bold">
        {String.fromCharCode(65 + index)}
      </span>
      {option}
    </motion.button>
  );
}
