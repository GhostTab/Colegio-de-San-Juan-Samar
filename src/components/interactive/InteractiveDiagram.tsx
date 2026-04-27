import { motion } from "framer-motion";
import { useState } from "react";
import type { ReactNode } from "react";

type DiagramPoint = {
  id: string;
  label: string;
  x: number;
  y: number;
  detail: string;
};

type InteractiveDiagramProps = {
  title: string;
  subtitle: string;
  points: DiagramPoint[];
  background?: ReactNode;
  helperText?: string;
};

export default function InteractiveDiagram({ title, subtitle, points, background, helperText }: InteractiveDiagramProps) {
  const [active, setActive] = useState(points[0]?.id ?? "");
  const current = points.find((point) => point.id === active) ?? points[0];

  return (
    <div className="rounded-2xl border border-border/60 bg-background/20 p-4">
      <h4 className="font-semibold text-foreground">{title}</h4>
      <p className="text-sm text-muted-foreground mb-3">{subtitle}</p>

      <div className="relative h-48 overflow-hidden rounded-xl border border-border bg-card/60">
        {background ? <div className="pointer-events-none absolute inset-0">{background}</div> : null}
        {points.map((point) => (
          <button
            key={point.id}
            onClick={() => setActive(point.id)}
            className={`absolute h-7 min-w-7 rounded-full px-2 text-[10px] font-semibold transition-colors ${
              active === point.id ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground"
            }`}
            style={{ left: `${point.x}%`, top: `${point.y}%`, transform: "translate(-50%, -50%)" }}
          >
            {point.label}
          </button>
        ))}
      </div>
      {helperText ? <p className="mt-2 text-xs text-muted-foreground">{helperText}</p> : null}

      {current ? (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-3 rounded-xl bg-secondary/70 px-3 py-2 text-sm text-foreground">
          <span className="font-semibold">{current.label}:</span> {current.detail}
        </motion.div>
      ) : null}
    </div>
  );
}
