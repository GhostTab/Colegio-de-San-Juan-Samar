import { Progress } from "@/components/ui/progress";

type ProgressTrackerProps = {
  value: number;
  label?: string;
};

export default function ProgressTracker({ value, label = "Progress" }: ProgressTrackerProps) {
  const safe = Math.max(0, Math.min(100, Math.round(value)));

  return (
    <div className="rounded-xl bg-secondary/40 p-3">
      <div className="mb-2 flex items-center justify-between text-xs text-muted-foreground">
        <span>{label}</span>
        <span className="font-semibold text-foreground">{safe}%</span>
      </div>
      <Progress value={safe} className="h-2" />
    </div>
  );
}
