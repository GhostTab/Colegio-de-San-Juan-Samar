import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { ArrowDown, ArrowUp, CheckCircle2, GripVertical, RefreshCcw, XCircle } from "lucide-react";

interface DragSortActivityProps {
  lessonId: number;
  items: string[];
}

function createDeterministicShuffle(items: string[], seed: number) {
  const shuffled = [...items];
  for (let i = shuffled.length - 1; i > 0; i -= 1) {
    const j = (seed + i * 7) % (i + 1);
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export default function DragSortActivity({ lessonId, items }: DragSortActivityProps) {
  const orderedItems = useMemo(() => items.slice(0, 4), [items]);
  const [activityItems, setActivityItems] = useState<string[]>(() =>
    createDeterministicShuffle(orderedItems, lessonId),
  );
  const [draggedItem, setDraggedItem] = useState<string | null>(null);
  const [isCorrectOrder, setIsCorrectOrder] = useState<boolean | null>(null);

  useEffect(() => {
    setActivityItems(createDeterministicShuffle(orderedItems, lessonId));
    setIsCorrectOrder(null);
  }, [lessonId, orderedItems]);

  const moveItem = (fromIndex: number, toIndex: number) => {
    if (toIndex < 0 || toIndex >= activityItems.length) return;
    const next = [...activityItems];
    const [moved] = next.splice(fromIndex, 1);
    next.splice(toIndex, 0, moved);
    setActivityItems(next);
  };

  const handleDrop = (targetItem: string) => {
    if (!draggedItem || draggedItem === targetItem) return;
    const from = activityItems.indexOf(draggedItem);
    const to = activityItems.indexOf(targetItem);
    if (from === -1 || to === -1) return;
    moveItem(from, to);
    setDraggedItem(null);
  };

  const evaluate = () => {
    const ok = activityItems.every((item, index) => item === orderedItems[index]);
    setIsCorrectOrder(ok);
  };

  const reset = () => {
    setActivityItems(createDeterministicShuffle(orderedItems, lessonId + 3));
    setIsCorrectOrder(null);
  };

  return (
    <div className="rounded-2xl border border-border/60 bg-card/75 p-5">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h4 className="text-sm font-semibold text-foreground">Drag-and-drop sequencing</h4>
          <p className="text-xs text-muted-foreground">Arrange the learning flow in the correct order.</p>
        </div>
        <button
          onClick={reset}
          className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-xs font-medium hover:bg-secondary"
        >
          <RefreshCcw className="h-3.5 w-3.5" />
          Reshuffle
        </button>
      </div>

      <div className="space-y-2">
        {activityItems.map((item, index) => (
          <motion.div
            key={item}
            layout
            draggable
            onDragStart={() => setDraggedItem(item)}
            onDragOver={(event) => event.preventDefault()}
            onDrop={() => handleDrop(item)}
            className="flex items-center gap-2 rounded-xl border border-border/70 bg-background/80 px-3 py-2"
          >
            <GripVertical className="h-4 w-4 text-muted-foreground" />
            <span className="flex-1 text-sm text-foreground">{item}</span>
            <div className="flex items-center gap-1">
              <button
                onClick={() => moveItem(index, index - 1)}
                className="rounded-md p-1 hover:bg-secondary"
                aria-label={`Move ${item} up`}
              >
                <ArrowUp className="h-3.5 w-3.5" />
              </button>
              <button
                onClick={() => moveItem(index, index + 1)}
                className="rounded-md p-1 hover:bg-secondary"
                aria-label={`Move ${item} down`}
              >
                <ArrowDown className="h-3.5 w-3.5" />
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-3">
        <button
          onClick={evaluate}
          className="rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:brightness-110"
        >
          Check sequence
        </button>
        {isCorrectOrder !== null && (
          <div
            className={`inline-flex items-center gap-2 rounded-lg px-3 py-1.5 text-xs font-semibold ${
              isCorrectOrder
                ? "bg-emerald-500/15 text-emerald-700"
                : "bg-destructive/10 text-destructive"
            }`}
          >
            {isCorrectOrder ? <CheckCircle2 className="h-3.5 w-3.5" /> : <XCircle className="h-3.5 w-3.5" />}
            {isCorrectOrder ? "Perfect order!" : "Not yet. Try again."}
          </div>
        )}
      </div>
    </div>
  );
}
