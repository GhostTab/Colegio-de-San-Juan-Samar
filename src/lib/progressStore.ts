// Simple localStorage-based progress tracking
// Progress only appears after user interaction

export interface UserProgress {
  grade: number | null;
  completedLessons: number[]; // lesson IDs
  quizScores: Record<string, number>; // "quizId" -> score
  challengeAttempts: number;
  challengeCorrect: number;
  bestStreak: number;
  currentStreak: number;
  lessonChallengeScores: Record<string, { attempted: number; correct: number; bestScore: number; updatedAt: string }>;
  earnedBadges: string[];
  lastAccessed: Record<string, string>; // "subjectId" -> ISO date
  lessonReactions: Record<string, "like" | "dislike" | null>;
  lessonViewCounts: Record<string, number>;
  onboardingComplete: boolean;
  soundEnabled: boolean;
}

const STORAGE_KEY = "csjs_progress";

const defaultProgress: UserProgress = {
  grade: null,
  completedLessons: [],
  quizScores: {},
  challengeAttempts: 0,
  challengeCorrect: 0,
  bestStreak: 0,
  currentStreak: 0,
  lessonChallengeScores: {},
  earnedBadges: [],
  lastAccessed: {},
  lessonReactions: {},
  lessonViewCounts: {},
  onboardingComplete: false,
  soundEnabled: false,
};

export function getProgress(): UserProgress {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) return { ...defaultProgress, ...JSON.parse(stored) };
  } catch {
    // Ignore malformed localStorage payloads and fall back to defaults.
  }
  return { ...defaultProgress };
}

export function saveProgress(progress: UserProgress) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
}

export function updateProgress(updates: Partial<UserProgress>) {
  const current = getProgress();
  const updated = { ...current, ...updates };
  saveProgress(updated);
  return updated;
}

export function completeLesson(lessonId: number, subjectId: string): UserProgress {
  const current = getProgress();
  if (!current.completedLessons.includes(lessonId)) {
    current.completedLessons.push(lessonId);
  }
  current.lastAccessed[subjectId] = new Date().toISOString();
  saveProgress(current);
  return current;
}

export function recordLessonView(lessonId: number, subjectId: string): UserProgress {
  const current = getProgress();
  const key = String(lessonId);
  const views = current.lessonViewCounts[key] ?? 0;
  current.lessonViewCounts[key] = views + 1;
  current.lastAccessed[subjectId] = new Date().toISOString();
  saveProgress(current);
  return current;
}

export function setLessonReaction(lessonId: number, reaction: "like" | "dislike" | null): UserProgress {
  const current = getProgress();
  current.lessonReactions[String(lessonId)] = reaction;
  saveProgress(current);
  return current;
}

export function resetProgress() {
  localStorage.removeItem(STORAGE_KEY);
}

export function updateLessonChallengeStats(lessonId: number, attempted: number, correct: number): UserProgress {
  const current = getProgress();
  const safeAttempted = Math.max(0, attempted);
  const safeCorrect = Math.max(0, Math.min(correct, safeAttempted));
  const key = String(lessonId);
  const previous = current.lessonChallengeScores[key];
  const previousAccuracy = previous?.attempted ? previous.correct / previous.attempted : 0;
  const newAccuracy = safeAttempted ? safeCorrect / safeAttempted : 0;
  const improvedOrEqual = newAccuracy >= previousAccuracy;

  current.lessonChallengeScores[key] = {
    attempted: safeAttempted,
    correct: safeCorrect,
    bestScore: Math.max(previous?.bestScore || 0, safeCorrect),
    updatedAt: new Date().toISOString(),
  };

  current.challengeAttempts = Object.values(current.lessonChallengeScores).reduce((sum, item) => sum + item.attempted, 0);
  current.challengeCorrect = Object.values(current.lessonChallengeScores).reduce((sum, item) => sum + item.correct, 0);
  current.currentStreak = improvedOrEqual ? current.currentStreak + 1 : 0;
  current.bestStreak = Math.max(current.bestStreak, current.currentStreak);

  saveProgress(current);
  return current;
}
