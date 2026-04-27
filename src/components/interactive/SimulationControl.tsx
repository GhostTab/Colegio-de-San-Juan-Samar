import { motion } from "framer-motion";
import { useMemo, useState } from "react";

type SimulationControlProps = {
  title: string;
  subtitle: string;
  min: number;
  max: number;
  initial: number;
  unit?: string;
  evaluate: (value: number) => { label: string; detail: string };
};

export default function SimulationControl({ title, subtitle, min, max, initial, unit = "", evaluate }: SimulationControlProps) {
  const [value, setValue] = useState(initial);
  const result = useMemo(() => evaluate(value), [evaluate, value]);

  return (
    <div className="rounded-2xl border border-border/60 bg-background/20 p-4">
      <h4 className="font-semibold text-foreground">{title}</h4>
      <p className="text-sm text-muted-foreground mb-3">{subtitle}</p>

      <div className="flex items-center justify-between mb-2 text-sm">
        <span className="text-muted-foreground">Variable</span>
        <span className="font-semibold text-foreground">
          {value}
          {unit}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={(event) => setValue(Number(event.target.value))}
        className="w-full accent-primary"
      />

      <motion.div key={value} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="mt-3 rounded-xl bg-secondary/70 px-3 py-2 text-sm">
        <p className="font-semibold text-foreground">{result.label}</p>
        <p className="text-muted-foreground mt-1">{result.detail}</p>
      </motion.div>
    </div>
  );
}
