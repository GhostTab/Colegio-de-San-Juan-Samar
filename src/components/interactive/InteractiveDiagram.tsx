import { motion } from "framer-motion";
import { useState } from "react";

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
};

export default function InteractiveDiagram({ title, subtitle, points }: InteractiveDiagramProps) {
  const [active, setActive] = useState(points[0]?.id ?? "");
  const current = points.find((point) => point.id === active) ?? points[0];

  return (
    <div className="rounded-2xl border border-border/60 bg-background/20 p-4">
      <h4 className="font-semibold text-foreground">{title}</h4>
      <p className="text-sm text-muted-foreground mb-3">{subtitle}</p>

      <div className="relative h-48 rounded-xl border border-border bg-card/60">
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

      {current ? (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-3 rounded-xl bg-secondary/70 px-3 py-2 text-sm text-foreground">
          <span className="font-semibold">{current.label}:</span> {current.detail}
        </motion.div>
      ) : null}
    </div>
  );
}
