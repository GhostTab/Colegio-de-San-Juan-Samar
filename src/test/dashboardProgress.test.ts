import { describe, expect, it } from "vitest";
import { calculateCompletionProgress } from "@/lib/dashboardProgress";
import type { Lesson } from "@/lib/contentData";

function lesson(id: number, grade: number): Lesson {
  return {
    id,
    grade,
    subject: "math",
    title: `Lesson ${id}`,
    description: "",
    duration: "10 min",
    type: "video",
    steps: [],
  };
}

describe("dashboard completion progress", () => {
  it("counts only completed lessons from the active grade", () => {
    const allLessons = [
      lesson(1, 7),
      lesson(2, 7),
      lesson(3, 7),
      lesson(4, 8),
      lesson(5, 8),
    ];

    const progress = calculateCompletionProgress([1, 2, 3, 4, 5], allLessons, 7);

    expect(progress).toEqual({ completed: 3, total: 3, percent: 100 });
  });

  it("ignores completed lesson ids that are not in the lesson catalog", () => {
    const allLessons = [lesson(1, 7), lesson(2, 7)];

    const progress = calculateCompletionProgress([1, 2, 999], allLessons, 7);

    expect(progress).toEqual({ completed: 2, total: 2, percent: 100 });
  });
});
