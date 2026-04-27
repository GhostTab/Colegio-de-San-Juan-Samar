import { subjects } from "@/lib/mockData";
import type { Lesson } from "@/lib/mockData";
import { getLrModulesFor } from "@/lib/depedLrModuleIndex";
import { getModuleTeachingContent } from "@/lib/moduleTeachingContent";

export { subjects, grades, badges, studentData, surveyCategories } from "@/lib/mockData";
export type { Lesson, LessonStep } from "@/lib/mockData";

const targetGrades = [7, 8, 9, 10] as const;

function subjectLabel(subjectId: string): string {
  return subjects.find((s) => s.id === subjectId)?.name ?? subjectId;
}

let nextLessonId = 1;

export const lessons: Lesson[] = targetGrades.flatMap((grade) =>
  subjects.flatMap((subject) => {
    const modules = getLrModulesFor(grade, subject.id);

    return modules.map((mod, orderIndex) => {
      const slot = orderIndex as 0 | 1 | 2;
      const bundle = getModuleTeachingContent(subject.id, grade, slot);
      const id = nextLessonId++;
      const hintPool = bundle.steps.flatMap((s) => s.keywords ?? []);
      const challengeHints = [...new Set(hintPool)].slice(0, 6);
      if (challengeHints.length < 3) {
        challengeHints.push(bundle.shortTitle, mod.quarter, subject.id);
      }

      return {
        id,
        grade,
        subject: subject.id,
        order: orderIndex + 1,
        title: `G${grade} ${subject.name}: ${bundle.shortTitle}`,
        description: bundle.summary,
        duration: "30 min",
        durationMinutes: 30,
        type: "interactive",
        challengeHints,
        misconceptions: [bundle.misconception],
        sourcePdf: mod.file,
        learningFocus: bundle.learningFocus,
        contentQuiz: bundle.quiz,
        steps: bundle.steps,
      };
    });
  }),
);

export type ContentQuizQuestion = {
  id: number;
  grade: number;
  subject: string;
  sourcePdf?: string;
  question: string;
  options: string[];
  correct: number;
  explanation: string;
};

function withShiftedCorrectOption(
  options: string[],
  correct: number,
  seed: number,
): { options: string[]; correct: number } {
  if (!options.length) return { options, correct };
  const safeCorrect = Math.max(0, Math.min(correct, options.length - 1));
  const shift = seed % options.length;
  if (shift === 0) return { options, correct: safeCorrect };

  const rotated = options.map((_, i) => options[(i + shift) % options.length]);
  const nextCorrect = (safeCorrect - shift + options.length) % options.length;
  return { options: rotated, correct: nextCorrect };
}

export const quizQuestions: ContentQuizQuestion[] = lessons.map((lesson, index) => {
  const q = lesson.contentQuiz;
  if (!q) {
    const fallback = withShiftedCorrectOption(
      ["Review the lesson objectives and examples.", "Skip all reading.", "Guess only.", "Ignore practice items."],
      0,
      lesson.id + index,
    );
    return {
      id: index + 1,
      grade: lesson.grade,
      subject: lesson.subject,
      sourcePdf: lesson.sourcePdf,
      question: `Grade ${lesson.grade} ${subjectLabel(lesson.subject)}: ${lesson.learningFocus ?? "Review the lesson steps."}`,
      options: fallback.options,
      correct: fallback.correct,
      explanation: lesson.learningFocus ?? "Use the lesson steps to review.",
    };
  }
  const shifted = withShiftedCorrectOption(q.options, q.correct, lesson.id + index);
  return {
    id: index + 1,
    grade: lesson.grade,
    subject: lesson.subject,
    sourcePdf: lesson.sourcePdf,
    question: q.question,
    options: shifted.options,
    correct: shifted.correct,
    explanation: q.explanation,
  };
});

export function filterQuizQuestions(
  all: ContentQuizQuestion[],
  grade: number | null,
  subjectId: string | null,
): ContentQuizQuestion[] {
  let pool = all;
  if (grade != null && !Number.isNaN(grade)) {
    pool = pool.filter((q) => q.grade === grade);
  }
  if (subjectId != null && subjectId !== "") {
    pool = pool.filter((q) => q.subject === subjectId);
  }
  if (pool.length === 0) return all;
  return pool;
}
