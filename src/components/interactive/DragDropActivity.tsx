import { ArrowDown, ArrowUp, CheckCircle2, RotateCcw, XCircle } from "lucide-react";
import { useMemo, useState } from "react";

type DragDropActivityProps = {
  title: string;
  instructions: string;
  items: string[];
  targetOrder: string[];
};

export default function DragDropActivity({ title, instructions, items, targetOrder }: DragDropActivityProps) {
  const [current, setCurrent] = useState(items);
  const [checked, setChecked] = useState(false);

  const solved = useMemo(
    () => current.length === targetOrder.length && current.every((item, index) => item === targetOrder[index]),
    [current, targetOrder],
  );

  const move = (index: number, dir: -1 | 1) => {
    const nextIndex = index + dir;
    if (nextIndex < 0 || nextIndex >= current.length) return;
    setCurrent((prev) => {
      const next = [...prev];
      [next[index], next[nextIndex]] = [next[nextIndex], next[index]];
      return next;
    });
    setChecked(false);
  };

  const reset = () => {
    setCurrent(items);
    setChecked(false);
  };

  return (
    <div className="rounded-2xl border border-border/60 bg-background/20 p-4">
      <div className="mb-3 flex items-center justify-between">
        <h4 className="font-semibold text-foreground">{title}</h4>
        <button onClick={reset} className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground">
          <RotateCcw className="h-3.5 w-3.5" /> Reset
        </button>
      </div>
      <p className="text-sm text-muted-foreground mb-3">{instructions}</p>

      <div className="space-y-2">
        {current.map((item, index) => (
          <div key={`${item}-${index}`} className="flex items-center justify-between rounded-xl border border-border bg-card/70 px-3 py-2">
            <span className="text-sm text-foreground">{item}</span>
            <div className="flex items-center gap-1">
              <button onClick={() => move(index, -1)} className="rounded-md p-1 hover:bg-secondary" aria-label="Move up">
                <ArrowUp className="h-4 w-4" />
              </button>
              <button onClick={() => move(index, 1)} className="rounded-md p-1 hover:bg-secondary" aria-label="Move down">
                <ArrowDown className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-3 flex items-center gap-2">
        <button onClick={() => setChecked(true)} className="rounded-lg bg-primary px-3 py-2 text-xs font-semibold text-primary-foreground">
          Check Order
        </button>
        {checked && (
          <span className={`inline-flex items-center gap-1 text-xs font-medium ${solved ? "text-emerald-600" : "text-destructive"}`}>
            {solved ? <CheckCircle2 className="h-3.5 w-3.5" /> : <XCircle className="h-3.5 w-3.5" />}
            {solved ? "Great sequencing!" : "Not yet, try again."}
          </span>
        )}
      </div>
    </div>
  );
}
