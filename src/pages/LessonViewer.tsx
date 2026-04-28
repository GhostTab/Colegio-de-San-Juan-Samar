import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Play,
  Pause,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
  Volume2,
  VolumeX,
  Gauge,
  BookOpen,
  Lightbulb,
  CheckCircle2,
  ArrowLeft,
  Sparkles,
  Loader2,
  Captions,
  CaptionsOff,
  ListChecks,
  Lock,
} from "lucide-react";
import { Link } from "react-router-dom";
import ScrollReveal from "@/components/ScrollReveal";
import { lessons, subjects, type Lesson, type LessonStep } from "@/lib/contentData";
import { completeLesson, getProgress, recordLessonView, updateLessonChallengeStats } from "@/lib/progressStore";
import { Skeleton } from "@/components/ui/skeleton";
import ScenarioDecision from "@/components/lesson/ScenarioDecision";
import SubjectInteractiveLab from "@/components/lesson/SubjectInteractiveLab";

export default function LessonViewer() {
  const [searchParams] = useSearchParams();
  const grade = parseInt(searchParams.get("grade") || "7");
  const subjectId = searchParams.get("subject") || "math";
  const quarter = parseInt(searchParams.get("quarter") || "");

  const subjectLessons = lessons.filter((lesson) => {
    if (lesson.grade !== grade || lesson.subject !== subjectId) return false;
    if (Number.isNaN(quarter)) return true;
    return lessonQuarter(lesson) === quarter;
  });
  const subject = subjects.find(s => s.id === subjectId);

  const [selectedLesson, setSelectedLesson] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [completed, setCompleted] = useState<Set<number>>(new Set());
  const [showCaptions, setShowCaptions] = useState(true);
  const [mediaReady, setMediaReady] = useState(false);
  const [activityResponse, setActivityResponse] = useState("");
  const [activitySubmitted, setActivitySubmitted] = useState(false);
  const [quizChoice, setQuizChoice] = useState<number | null>(null);
  const [quizRevealed, setQuizRevealed] = useState(false);

  const lesson = subjectLessons[selectedLesson];
  const steps = useMemo(() => (lesson ? buildTeachingSlides(lesson) : []), [lesson]);
  const step = steps[currentStep];
  const lessonProgress = steps.length ? Math.round(((currentStep + 1) / steps.length) * 100) : 0;
  const isSourceScrapedLesson = isScrapedSourceLesson(lesson);
  const shouldScrollLessonList = subjectLessons.length > 7;
  const activeActivity = lesson?.processedContent?.activity ?? lesson?.processedContent?.assignment;
  const activeQuiz = lesson?.contentQuiz;
  const activityKeywords = (activeActivity?.expectedKeywords ?? []).filter(Boolean);
  const activityKeywordHits = activityKeywords.filter((keyword) => activityResponse.toLowerCase().includes(keyword.toLowerCase())).length;
  const challengeScore = quizRevealed && typeof quizChoice === "number" && quizChoice === activeQuiz?.correct ? 1 : 0;

  useEffect(() => {
    const progress = getProgress();
    setCompleted(new Set(progress.completedLessons));
  }, []);

  useEffect(() => {
    setCurrentStep(0);
    setPlaying(false);
  }, [selectedLesson]);

  useEffect(() => {
    if (!lesson) return;
    recordLessonView(lesson.id, subjectId);
  }, [lesson, subjectId]);

  useEffect(() => {
    setActivityResponse("");
    setActivitySubmitted(false);
    setQuizChoice(null);
    setQuizRevealed(false);
  }, [selectedLesson, subjectId]);

  useEffect(() => {
    setMediaReady(false);
    const timer = window.setTimeout(() => setMediaReady(true), 450);
    return () => window.clearTimeout(timer);
  }, [lesson?.id, currentStep]);

  // Auto-play
  useEffect(() => {
    if (!playing || !steps.length) return;
    const ms = 3000 / speed;
    const timer = setTimeout(() => {
      if (currentStep < steps.length - 1) setCurrentStep(s => s + 1);
      else setPlaying(false);
    }, ms);
    return () => clearTimeout(timer);
  }, [playing, currentStep, speed, steps.length]);

  const handleComplete = () => {
    if (!lesson) return;
    completeLesson(lesson.id, subjectId);
    updateLessonChallengeStats(lesson.id, activeQuiz ? 1 : 0, challengeScore);
    setCompleted(prev => new Set(prev).add(lesson.id));
  };

  const next = () => setCurrentStep(s => Math.min(s + 1, steps.length - 1));
  const prev = () => setCurrentStep(s => Math.max(s - 1, 0));

  if (!lesson) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center">
        <div className="glass-card p-12 text-center">
          <p className="text-muted-foreground mb-4">Lesson content not available yet for this grade, subject, and quarter selection.</p>
          <Link to={`/subjects?grade=${grade}`} className="text-primary font-medium hover:underline">Back to Subjects</Link>
        </div>
      </div>
    );
  }

  const Icon = subject?.icon;
  const isCompleted = completed.has(lesson.id);
  const isLastStep = currentStep === steps.length - 1;
  const isLessonUnlocked = (lessonIndex: number) => {
    if (lessonIndex === 0) return true;
    const previousLesson = subjectLessons[lessonIndex - 1];
    return previousLesson ? completed.has(previousLesson.id) : false;
  };

  return (
    <div className="min-h-screen pt-20 flex">
      {/* Sidebar */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.aside
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 320, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            className="hidden lg:block sticky top-20 h-[calc(100vh-5rem)] self-start border-r border-border/50 bg-card/50 backdrop-blur-xl overflow-hidden shrink-0"
          >
            <div className="p-4 w-[320px] h-full flex flex-col">
              <Link to={`/subjects?grade=${grade}`} className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-4 transition-colors">
                <ArrowLeft className="w-3 h-3" /> Back to Subjects
              </Link>
              <h3 className="font-bold text-foreground mb-4 flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-primary" /> {subject?.name} · Grade {grade}
              </h3>
              <div className={`space-y-2 ${shouldScrollLessonList ? "flex-1 min-h-0 overflow-y-auto pr-1" : ""}`}>
                {subjectLessons.map((l, i) => (
                  <button
                    key={l.id}
                    onClick={() => {
                      if (!isLessonUnlocked(i)) return;
                      setSelectedLesson(i);
                    }}
                    disabled={!isLessonUnlocked(i)}
                    className={`w-full text-left p-3 rounded-xl text-sm transition-all flex items-center gap-2 ${
                      !isLessonUnlocked(i)
                        ? "cursor-not-allowed opacity-55"
                        : ""
                    } ${
                      selectedLesson === i
                        ? "bg-primary text-primary-foreground"
                        : "hover:bg-secondary text-muted-foreground"
                    }`}
                  >
                    {!isLessonUnlocked(i) && <Lock className="w-4 h-4 text-muted-foreground shrink-0" />}
                    {isLessonUnlocked(i) && completed.has(l.id) && selectedLesson !== i && <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />}
                    <div className="min-w-0">
                      <div className="font-medium leading-snug">{displayLessonTitle(l.title)}</div>
                      <div className={`text-xs mt-0.5 ${selectedLesson === i ? "text-primary-foreground/70" : ""}`}>{l.type}</div>
                    </div>
                  </button>
                ))}
              </div>

              <div className="mt-4 p-4 rounded-2xl bg-primary/5 border border-primary/10 shrink-0">
                <h4 className="font-semibold text-sm text-foreground flex items-center gap-2 mb-2">
                  <Lightbulb className="w-4 h-4 text-accent" /> Tip
                </h4>
                <p className="text-xs text-muted-foreground">
                  Complete all steps to mark a lesson as done and earn progress.
                </p>
              </div>

              <div className="mt-4 p-4 rounded-2xl bg-accent/10 border border-accent/20 shrink-0">
                <h4 className="font-semibold text-sm text-foreground flex items-center gap-2 mb-2">
                  <Sparkles className="w-4 h-4 text-accent" /> Mission Tracker
                </h4>
                <p className="text-xs text-muted-foreground mb-2">
                  Step progress: {lessonProgress}%{activeQuiz ? ` · Quiz score: ${challengeScore}/1` : ""}
                </p>
                <div className="w-full bg-background/70 rounded-full h-2">
                  <div className="h-2 rounded-full bg-gradient-to-r from-primary to-accent transition-all" style={{ width: `${lessonProgress}%` }} />
                </div>
              </div>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        <div className="flex-1 p-4 md:p-8 max-w-4xl mx-auto w-full">
          <ScrollReveal>
            <div className="flex items-center justify-between gap-4 mb-6 flex-wrap">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold leading-tight text-foreground">{displayLessonTitle(lesson.title)}</h1>
                <p className="mt-1 text-muted-foreground">{subject?.name} · Grade {grade} · {lessonQuarter(lesson) ? `Quarter ${lessonQuarter(lesson)}` : "Lesson"}</p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <Link
                  to={`/quiz?grade=${grade}&subject=${subjectId}`}
                  className="inline-flex items-center gap-2 rounded-xl border border-border bg-card px-3 py-2 text-sm font-medium text-foreground hover:bg-secondary/80 transition-colors"
                >
                  <ListChecks className="w-4 h-4 text-primary" />
                  Quiz Practice
                </Link>
                <button onClick={() => setSidebarOpen(!sidebarOpen)} className="hidden lg:flex items-center gap-2 px-4 py-2 rounded-xl bg-secondary text-sm text-secondary-foreground hover:bg-secondary/80 transition-colors">
                  <BookOpen className="w-4 h-4" /> {sidebarOpen ? "Hide" : "Show"} Sidebar
                </button>
              </div>
            </div>
          </ScrollReveal>

          {/* Lesson Display */}
          <div className="glass-card p-6 md:p-8 mb-6 min-h-[400px] relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/[0.02] to-accent/[0.02]" />
            <div className="relative">
              <div>
                <div className="mb-3 flex items-center justify-between text-xs text-muted-foreground">
                  <span className="inline-flex items-center gap-1.5 rounded-lg bg-secondary px-2 py-1">
                    <Play className="h-3.5 w-3.5" />
                    {lesson.type.toUpperCase()} player
                  </span>
                  <span>Step {currentStep + 1} / {steps.length}</span>
                </div>
                <div className="relative min-h-[240px] rounded-2xl border border-border/50 bg-card/85 p-5">
                  {!mediaReady ? (
                    <div className="space-y-3">
                      <Skeleton className="h-6 w-40" />
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-[90%]" />
                      <div className="pt-4 text-xs text-muted-foreground inline-flex items-center gap-2">
                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        Buffering lesson media...
                      </div>
                    </div>
                  ) : (
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={`${lesson.id}-${currentStep}`}
                        initial={{ opacity: 0, x: 28 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -28 }}
                        transition={{ duration: 0.35 }}
                        className="mx-auto max-w-3xl text-left"
                      >
                        <div className="mb-5 flex items-center gap-3">
                          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                            {Icon && <Icon className="h-6 w-6" />}
                          </div>
                          <div>
                            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">Lesson section</p>
                            <h2 className="text-xl font-bold leading-tight text-foreground">{step?.title}</h2>
                          </div>
                        </div>
                        <div className="rounded-2xl bg-background/60 p-4 text-sm leading-7 text-foreground/85 whitespace-pre-line">
                          {step?.content}
                        </div>
                        {isActivityStep(step) && (
                          <div className="mt-4 rounded-2xl border border-border/60 bg-background/45 p-4">
                            <p className="text-sm font-semibold text-foreground">Your Answer</p>
                            <textarea
                              value={activityResponse}
                              onChange={(event) => {
                                setActivityResponse(event.target.value);
                                setActivitySubmitted(false);
                              }}
                              placeholder="Type your answer based on the lesson discussion..."
                              className="mt-3 min-h-28 w-full resize-y rounded-xl border border-border bg-card/80 px-3 py-2 text-sm text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
                            />
                            <div className="mt-3 flex flex-wrap items-center gap-3">
                              <button
                                onClick={() => setActivitySubmitted(true)}
                                disabled={activityResponse.trim().length < 20}
                                className="rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground disabled:cursor-not-allowed disabled:opacity-50"
                              >
                                Submit Answer
                              </button>
                              {activitySubmitted && (
                                <span className="text-xs text-muted-foreground">
                                  Checked: {activityKeywordHits}/{Math.max(activityKeywords.length, 1)} key concepts used
                                </span>
                              )}
                            </div>
                          </div>
                        )}
                        {isQuizStep(step) && activeQuiz && (
                          <div className="mt-4 rounded-2xl border border-border/60 bg-background/45 p-4">
                            <p className="text-sm font-semibold text-foreground">{activeQuiz.question}</p>
                            <div className="mt-3 grid gap-3 sm:grid-cols-2">
                              {activeQuiz.options.map((option, optionIndex) => {
                                const isCorrect = optionIndex === activeQuiz.correct;
                                const isSelected = quizChoice === optionIndex;
                                const optionClass = quizRevealed
                                  ? isCorrect
                                    ? "border-emerald-500 bg-emerald-50 text-emerald-700"
                                    : isSelected
                                      ? "border-destructive bg-destructive/10 text-destructive"
                                      : "border-border text-muted-foreground"
                                  : "border-border hover:border-primary/30 text-foreground";
                                return (
                                  <button
                                    key={option}
                                    onClick={() => {
                                      if (quizRevealed) return;
                                      setQuizChoice(optionIndex);
                                      setQuizRevealed(true);
                                    }}
                                    className={`rounded-xl border-2 px-4 py-3 text-left text-sm font-medium transition-all ${optionClass}`}
                                  >
                                    {option}
                                  </button>
                                );
                              })}
                            </div>
                            {quizRevealed && (
                              <div className="mt-3 rounded-xl bg-secondary/60 px-4 py-3 text-sm">
                                <p className="font-semibold text-foreground">
                                  {quizChoice === activeQuiz.correct ? "Correct." : "Review the discussion and try again."}
                                </p>
                                <p className="mt-1 text-muted-foreground">{activeQuiz.explanation}</p>
                              </div>
                            )}
                          </div>
                        )}
                      </motion.div>
                    </AnimatePresence>
                  )}
                </div>
                <div className="mt-3 flex flex-wrap items-center gap-2">
                  {lesson.type === "video" && (
                    <>
                      <button
                        onClick={() => {
                          setMediaReady(false);
                          window.setTimeout(() => setMediaReady(true), 300);
                        }}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-xs font-medium hover:bg-secondary"
                      >
                        <RotateCcw className="h-3.5 w-3.5" />
                        Replay segment
                      </button>
                      <button
                        onClick={() => setShowCaptions((current) => !current)}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-xs font-medium hover:bg-secondary"
                      >
                        {showCaptions ? <CaptionsOff className="h-3.5 w-3.5" /> : <Captions className="h-3.5 w-3.5" />}
                        {showCaptions ? "Hide captions" : "Show captions"}
                      </button>
                    </>
                  )}
                </div>
                {lesson.type === "video" && showCaptions && (
                  <div className="mt-3 rounded-xl bg-secondary/70 px-3 py-2 text-xs text-muted-foreground">
                    Caption: {step?.content}
                  </div>
                )}
              </div>

            </div>

            {/* Step indicator */}
            <div className="mt-5 flex flex-wrap items-center justify-between gap-2">
              <div className="flex gap-2">
                {steps.map((_, i) => (
                  <button key={i} onClick={() => setCurrentStep(i)}
                    className={`w-2.5 h-2.5 rounded-full transition-all ${i === currentStep ? "bg-primary w-8" : "bg-border hover:bg-muted-foreground/30"}`}
                  />
                ))}
              </div>
              <div className="text-xs text-muted-foreground">
                Learning progress: <span className="font-semibold text-foreground">{lessonProgress}%</span>
              </div>
            </div>
          </div>

          {/* Controls */}
          <div className="sticky bottom-3 z-20 glass-card bg-card/85 backdrop-blur-2xl p-4 flex flex-wrap items-center justify-center gap-3">
            <button onClick={prev} disabled={currentStep === 0}
              className="p-3 rounded-xl hover:bg-secondary transition-colors disabled:opacity-30">
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button onClick={() => setPlaying(!playing)}
              className="p-3 rounded-xl gradient-primary text-primary-foreground">
              {playing ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
            </button>
            <button onClick={() => { setCurrentStep(0); setPlaying(false); }}
              className="p-3 rounded-xl hover:bg-secondary transition-colors">
              <RotateCcw className="w-5 h-5" />
            </button>
            <button onClick={next} disabled={currentStep === steps.length - 1}
              className="p-3 rounded-xl hover:bg-secondary transition-colors disabled:opacity-30">
              <ChevronRight className="w-5 h-5" />
            </button>

            <div className="w-px h-8 bg-border mx-2 hidden sm:block" />

            <button onClick={() => setMuted(!muted)} className="p-3 rounded-xl hover:bg-secondary transition-colors">
              {muted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
            </button>

            <button onClick={() => setSpeed(speed >= 2 ? 0.5 : speed + 0.5)}
              className="flex items-center gap-1 px-3 py-2 rounded-xl hover:bg-secondary transition-colors text-sm font-medium">
              <Gauge className="w-4 h-4" /> {speed}x
            </button>

            <span className="text-sm text-muted-foreground ml-2">
              Step {currentStep + 1} of {steps.length}
            </span>
          </div>

          {/* Complete button */}
          {isLastStep && !isCompleted && (
            <ScrollReveal delay={0.1}>
              <div className="mt-6 text-center">
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={handleComplete}
                  className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl gradient-primary text-primary-foreground font-semibold text-lg shadow-lg"
                >
                  <CheckCircle2 className="w-5 h-5" /> Mark as Completed
                </motion.button>
              </div>
            </ScrollReveal>
          )}

          {isCompleted && (
            <div className="mt-6 text-center">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-50 text-emerald-700 text-sm font-medium">
                <CheckCircle2 className="w-4 h-4" /> Lesson Completed
              </div>
            </div>
          )}

          {!isSourceScrapedLesson && (
            <>
              <ScrollReveal delay={0.24}>
                <div className="mt-8">
                  <ScenarioDecision lesson={lesson} />
                </div>
              </ScrollReveal>
              <SubjectInteractiveLab lesson={lesson} step={step} />
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function isScrapedSourceLesson(lesson?: Lesson) {
  return Boolean(lesson?.sourcePdf?.includes("Source index:"));
}

function displayLessonTitle(title: string) {
  return title.replace(/^G\d+\s+[^:]+:\s*/i, "");
}

function isActivityStep(step?: LessonStep) {
  return Boolean(step?.title.toLowerCase().includes("step 4"));
}

function isQuizStep(step?: LessonStep) {
  return Boolean(step?.title.toLowerCase().includes("step 5"));
}

function lessonQuarter(lesson: Lesson) {
  const match = lesson.title.match(/Quarter\s+(\d+)/i);
  if (match) return Number(match[1]);
  if (typeof lesson.order === "number" && lesson.order >= 1 && lesson.order <= 4) return lesson.order;
  return null;
}

function buildTeachingSlides(lesson: Lesson): LessonStep[] {
  if (isScrapedSourceLesson(lesson)) return lesson.steps;

  const baseSlides = [...lesson.steps];
  if (baseSlides.length >= 5) return baseSlides;

  const keywords = lesson.challengeHints || lesson.steps.flatMap((step) => step.keywords || []);
  const keywordText = keywords.slice(0, 3).join(", ") || "the key concept";

  const generatedSlides: LessonStep[] = [
    {
      title: "Common Mistake Watch",
      content: lesson.misconceptions?.[0]
        ? `A common mistake is: ${lesson.misconceptions[0]}. Avoid it by checking ${keywordText}.`
        : `A common mistake is skipping the main idea. Re-check ${keywordText} before moving on.`,
      icon: "triangle-alert",
      learningObjective: "Identify and avoid a common misconception.",
      difficulty: "medium",
    },
    {
      title: "Apply It",
      content: lesson.challengeHints?.[0]
        ? `Apply this lesson by explaining ${lesson.challengeHints[0]} using your own words and one example.`
        : `Apply this lesson by explaining one key idea and giving one concrete example.`,
      icon: "lightbulb",
      learningObjective: "Transfer understanding into an example.",
      difficulty: "medium",
    },
    {
      title: "Quick Recall",
      content: `Summarize the lesson in two points: what it means and why it matters in real situations.`,
      icon: "brain",
      learningObjective: "Recall and summarize core understanding.",
      difficulty: "easy",
    },
  ];

  return [...baseSlides, ...generatedSlides].slice(0, 6);
}
