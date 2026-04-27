import { useCallback, useEffect, useLayoutEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, XCircle, ArrowRight, RotateCcw, Trophy, Gauge, Keyboard, Flame } from "lucide-react";
import ScrollReveal from "@/components/ScrollReveal";
import { quizQuestions as allQuizQuestions, filterQuizQuestions, subjects } from "@/lib/contentData";
import QuizOptionCard from "@/components/quiz/QuizOptionCard";

export default function Quiz() {
  const [params] = useSearchParams();
  const gradeParam = params.get("grade");
  const subjectParam = params.get("subject");
  const gradeFilter = gradeParam != null && gradeParam !== "" ? Number(gradeParam) : null;
  const subjectFilter = subjectParam != null && subjectParam !== "" ? subjectParam : null;

  const quizQuestions = useMemo(
    () => filterQuizQuestions(allQuizQuestions, gradeFilter, subjectFilter),
    [gradeFilter, subjectFilter],
  );

  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [answers, setAnswers] = useState<(number | null)[]>(() => Array(quizQuestions.length).fill(null));
  const [showResult, setShowResult] = useState(false);
  const [questionStartedAt, setQuestionStartedAt] = useState(Date.now());
  const [responseTimes, setResponseTimes] = useState<number[]>(() => Array(quizQuestions.length).fill(0));
  const [currentStreak, setCurrentStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);

  useLayoutEffect(() => {
    setCurrent(0);
    setSelected(null);
    setAnswers(Array(quizQuestions.length).fill(null));
    setResponseTimes(Array(quizQuestions.length).fill(0));
    setShowResult(false);
    setCurrentStreak(0);
    setBestStreak(0);
    setQuestionStartedAt(Date.now());
  }, [quizQuestions]);

  const q = quizQuestions[current];
  const answered = selected !== null;
  const isCorrect = selected === q.correct;

  useEffect(() => {
    setQuestionStartedAt(Date.now());
  }, [current]);

  const handleSelect = useCallback((i: number) => {
    if (answered) return;
    setSelected(i);
    setAnswers((currentAnswers) => {
      const next = [...currentAnswers];
      next[current] = i;
      return next;
    });

    const elapsedSeconds = Math.max(1, Math.round((Date.now() - questionStartedAt) / 1000));
    setResponseTimes((currentTimes) => {
      const next = [...currentTimes];
      next[current] = elapsedSeconds;
      return next;
    });

    const correct = i === q.correct;
    setCurrentStreak((prev) => {
      const next = correct ? prev + 1 : 0;
      setBestStreak((best) => Math.max(best, next));
      return next;
    });
  }, [answered, current, q.correct, questionStartedAt]);

  const handleNext = useCallback(() => {
    if (current < quizQuestions.length - 1) {
      setCurrent(current + 1);
      setSelected(null);
    } else {
      setShowResult(true);
    }
  }, [current, quizQuestions.length]);

  useEffect(() => {
    const handleKeyboard = (event: KeyboardEvent) => {
      if (showResult) return;
      if (answered && event.key === "Enter") {
        event.preventDefault();
        handleNext();
        return;
      }
      if (answered) return;

      const key = event.key.toLowerCase();
      const keyMap: Record<string, number> = { "1": 0, "2": 1, "3": 2, "4": 3, a: 0, b: 1, c: 2, d: 3 };
      const nextIndex = keyMap[key];
      if (typeof nextIndex === "number" && nextIndex < q.options.length) {
        event.preventDefault();
        handleSelect(nextIndex);
      }
    };

    window.addEventListener("keydown", handleKeyboard);
    return () => window.removeEventListener("keydown", handleKeyboard);
  }, [answered, q?.options.length, showResult, handleNext, handleSelect]);

  const score = answers.filter((a, i) => a === quizQuestions[i]?.correct).length;
  const averageResponseTime = Math.round(
    responseTimes.filter(Boolean).reduce((sum, value) => sum + value, 0) /
      Math.max(responseTimes.filter(Boolean).length, 1),
  );

  const restart = () => {
    setCurrent(0);
    setSelected(null);
    setAnswers(Array(quizQuestions.length).fill(null));
    setShowResult(false);
    setResponseTimes(Array(quizQuestions.length).fill(0));
    setCurrentStreak(0);
    setBestStreak(0);
    setQuestionStartedAt(Date.now());
  };

  const filterDescription =
    gradeFilter != null && !Number.isNaN(gradeFilter) && subjectFilter
      ? `Grade ${gradeFilter} · ${subjects.find((s) => s.id === subjectFilter)?.name ?? subjectFilter}`
      : gradeFilter != null && !Number.isNaN(gradeFilter)
        ? `Grade ${gradeFilter}`
        : subjectFilter
          ? subjects.find((s) => s.id === subjectFilter)?.name ?? subjectFilter
          : null;

  const excellentThreshold = Math.max(2, Math.ceil(quizQuestions.length * 0.75));
  const goodThreshold = Math.max(1, Math.ceil(quizQuestions.length * 0.5));

  if (quizQuestions.length === 0) {
    return (
      <div className="min-h-screen pt-24 pb-12 px-4 flex items-center justify-center">
        <p className="text-muted-foreground">No quiz items available.</p>
      </div>
    );
  }

  if (showResult) {
    return (
      <div className="min-h-screen pt-24 pb-12 px-4 flex items-center justify-center">
        <ScrollReveal>
          <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} className="glass-card p-12 max-w-md text-center">
            <Trophy className="w-16 h-16 text-accent mx-auto mb-4" />
            <h2 className="text-3xl font-bold mb-2 text-foreground">Quiz Complete!</h2>
            <p className="text-muted-foreground mb-6">You scored</p>
            <div className="text-6xl font-extrabold text-primary mb-2">{score}/{quizQuestions.length}</div>
            <p className="text-muted-foreground mb-8">{score >= excellentThreshold ? "Excellent work! 🎉" : score >= goodThreshold ? "Good job! Keep it up! 💪" : "Keep practicing! You'll get there! 📚"}</p>

            <div className="mb-6 grid grid-cols-2 gap-3 text-left">
              <div className="rounded-xl bg-secondary/70 p-3">
                <p className="text-xs text-muted-foreground">Best streak</p>
                <p className="mt-1 text-xl font-bold text-foreground">{bestStreak}</p>
              </div>
              <div className="rounded-xl bg-secondary/70 p-3">
                <p className="text-xs text-muted-foreground">Avg response</p>
                <p className="mt-1 text-xl font-bold text-foreground">{averageResponseTime}s</p>
              </div>
            </div>

            <div className="space-y-2 mb-8 text-left">
              {quizQuestions.map((qq, i) => (
                <div key={i} className={`p-3 rounded-xl text-sm flex items-center gap-3 ${answers[i] === qq.correct ? "bg-emerald-50 text-emerald-700" : "bg-destructive/5 text-destructive"}`}>
                  {answers[i] === qq.correct ? <CheckCircle2 className="w-4 h-4 shrink-0" /> : <XCircle className="w-4 h-4 shrink-0" />}
                  <span className="truncate">{qq.question}</span>
                </div>
              ))}
            </div>

            <button onClick={restart} className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl gradient-primary text-primary-foreground font-semibold">
              <RotateCcw className="w-4 h-4" /> Try Again
            </button>
          </motion.div>
        </ScrollReveal>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-12 px-4">
      <div className="max-w-2xl mx-auto">
        <ScrollReveal>
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">Quiz Time! 🧠</h1>
            <p className="text-muted-foreground">
              Questions match the skills in your lesson steps
              {filterDescription ? ` (${filterDescription})` : ""}.
            </p>
            <div className="mt-4 flex flex-wrap gap-2 text-xs">
              <span className="inline-flex items-center gap-1.5 rounded-lg bg-secondary px-2.5 py-1.5 text-secondary-foreground">
                <Keyboard className="h-3.5 w-3.5" /> Use A-D or 1-4 keys
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-lg bg-secondary px-2.5 py-1.5 text-secondary-foreground">
                <Flame className="h-3.5 w-3.5 text-primary" /> Streak: {currentStreak}
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-lg bg-secondary px-2.5 py-1.5 text-secondary-foreground">
                <Gauge className="h-3.5 w-3.5" /> Avg speed: {averageResponseTime || 0}s
              </span>
            </div>
          </div>
        </ScrollReveal>

        {/* Progress */}
        <div className="mb-8">
          <div className="flex justify-between text-sm text-muted-foreground mb-2">
            <span>Question {current + 1} of {quizQuestions.length}</span>
            <span>{Math.round(((current + (answered ? 1 : 0)) / quizQuestions.length) * 100)}%</span>
          </div>
          <div className="w-full bg-secondary rounded-full h-2">
            <motion.div className="h-2 rounded-full gradient-primary" animate={{ width: `${((current + (answered ? 1 : 0)) / quizQuestions.length) * 100}%` }} />
          </div>
          <div className="mt-3 flex gap-2">
            {quizQuestions.map((_, index) => (
              <span
                key={index}
                className={`h-2 w-2 rounded-full ${index <= current ? "bg-primary" : "bg-border"}`}
              />
            ))}
          </div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div key={current} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}>
            <div className="glass-card p-8 mb-6">
              <h2 className="text-xl font-bold text-foreground mb-6">{q.question}</h2>
              <div className="space-y-3">
                {q.options.map((opt, i) => (
                  <QuizOptionCard
                    key={i}
                    option={opt}
                    index={i}
                    answered={answered}
                    selected={selected}
                    correctIndex={q.correct}
                    onSelect={handleSelect}
                  />
                ))}
              </div>
            </div>

            {/* Feedback */}
            <AnimatePresence>
              {answered && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                  className={`glass-card p-6 mb-6 border-l-4 ${isCorrect ? "border-l-emerald-500" : "border-l-destructive"}`}>
                  <div className="flex items-center gap-2 font-bold mb-2">
                    {isCorrect ? <CheckCircle2 className="w-5 h-5 text-emerald-500" /> : <XCircle className="w-5 h-5 text-destructive" />}
                    <span className={isCorrect ? "text-emerald-700" : "text-destructive"}>{isCorrect ? "Correct!" : "Incorrect"}</span>
                  </div>
                  <p className="text-sm text-muted-foreground">{q.explanation}</p>
                </motion.div>
              )}
            </AnimatePresence>

          </motion.div>
        </AnimatePresence>

        {answered && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="fixed inset-x-0 bottom-4 z-40 pointer-events-none"
          >
            <div className="mx-auto w-full max-w-2xl px-4">
              <button
                onClick={handleNext}
                className="pointer-events-auto inline-flex w-full items-center justify-center gap-2 rounded-2xl gradient-primary px-6 py-3 font-semibold text-primary-foreground shadow-lg hover:-translate-y-0.5 transition-transform"
              >
                {current < quizQuestions.length - 1 ? "Next Question" : "See Results"} <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
