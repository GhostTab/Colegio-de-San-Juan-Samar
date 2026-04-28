import type { Lesson } from "@/lib/contentData";

export function calculateCompletionProgress(completedLessonIds: number[], allLessons: Lesson[], grade: number | null) {
  const scopedLessons = allLessons.filter((lesson) => (grade ? lesson.grade === grade : true));
  const completedLessonSet = new Set(completedLessonIds);
  const completed = scopedLessons.filter((lesson) => completedLessonSet.has(lesson.id)).length;
  const total = scopedLessons.length;
  const percent = total ? Math.min(100, Math.round((completed / total) * 100)) : 0;

  return { completed, total, percent };
}
