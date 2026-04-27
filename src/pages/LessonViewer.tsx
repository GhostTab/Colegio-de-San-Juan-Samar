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
  MousePointerClick,
  CheckCircle2,
  ArrowLeft,
  Trophy,
  Sparkles,
  Flame,
  Loader2,
  Captions,
  CaptionsOff,
  ListChecks,
  ExternalLink,
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

  const subjectLessons = lessons.filter(l => l.grade === grade && l.subject === subjectId);
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
  const [challengeSelections, setChallengeSelections] = useState<Record<number, number>>({});
  const [challengeRevealedMap, setChallengeRevealedMap] = useState<Record<number, boolean>>({});

  const lesson = subjectLessons[selectedLesson];
  const steps = useMemo(() => (lesson ? buildTeachingSlides(lesson) : []), [lesson]);
  const step = steps[currentStep];
  const lessonProgress = steps.length ? Math.round(((currentStep + 1) / steps.length) * 100) : 0;
  const challengePool = useMemo(() => (lesson ? buildLessonChallenges(lesson, steps, subjectLessons) : []), [lesson, steps, subjectLessons]);
  const shouldScrollLessonList = subjectLessons.length > 7;

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
    setChallengeSelections({});
    setChallengeRevealedMap({});
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
    updateLessonChallengeStats(lesson.id, challengePool.length, challengeScore);
    setCompleted(prev => new Set(prev).add(lesson.id));
  };

  const next = () => setCurrentStep(s => Math.min(s + 1, steps.length - 1));
  const prev = () => setCurrentStep(s => Math.max(s - 1, 0));

  if (!lesson) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center">
        <div className="glass-card p-12 text-center">
          <p className="text-muted-foreground mb-4">No lessons available for this subject and grade yet.</p>
          <Link to={`/subjects?grade=${grade}`} className="text-primary font-medium hover:underline">Back to Subjects</Link>
        </div>
      </div>
    );
  }

  const Icon = subject?.icon;
  const isCompleted = completed.has(lesson.id);
  const isLastStep = currentStep === steps.length - 1;
  const challengeIndex = Math.min(currentStep, Math.max(challengePool.length - 1, 0));
  const challenge = challengePool[challengeIndex];
  const challengeChoice = challengeSelections[challengeIndex] ?? null;
  const challengeRevealed = challengeRevealedMap[challengeIndex] ?? false;
  const challengeScore = challengePool.reduce((total, item, index) => {
    const picked = challengeSelections[index];
    return total + (typeof picked === "number" && picked === item.correct ? 1 : 0);
  }, 0);

  const selectChallenge = (optionIndex: number) => {
    if (challengeRevealed || !challenge) return;
    setChallengeSelections((current) => ({ ...current, [challengeIndex]: optionIndex }));
    setChallengeRevealedMap((current) => ({ ...current, [challengeIndex]: true }));
  };

  const restartChallenges = () => {
    setChallengeSelections({});
    setChallengeRevealedMap({});
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
                    onClick={() => setSelectedLesson(i)}
                    className={`w-full text-left p-3 rounded-xl text-sm transition-all flex items-center gap-2 ${
                      selectedLesson === i
                        ? "bg-primary text-primary-foreground"
                        : "hover:bg-secondary text-muted-foreground"
                    }`}
                  >
                    {completed.has(l.id) && selectedLesson !== i && <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />}
                    <div>
                      <div className="font-medium">{l.title}</div>
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
                  Step progress: {lessonProgress}% · Challenge score: {challengeScore}/{Math.max(challengePool.length, 1)}
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
                <h1 className="text-2xl md:text-3xl font-bold text-foreground">{lesson.title}</h1>
                <p className="text-muted-foreground">{subject?.name} · Grade {grade}</p>
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
                        className="text-center"
                      >
                        <motion.div animate={{ scale: [1, 1.1, 1] }} transition={{ duration: 2, repeat: Infinity }} className="mb-5">
                          {Icon && <Icon className="mx-auto h-14 w-14 text-primary" />}
                        </motion.div>
                        <h2 className="text-xl font-bold text-foreground">{step?.title}</h2>
                        <p className="mt-3 text-sm leading-relaxed text-muted-foreground whitespace-pre-line">{step?.content}</p>
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
                  {step?.resourceUrl && (
                    <a
                      href={step.resourceUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 rounded-lg border border-primary/30 bg-primary/5 px-3 py-1.5 text-xs font-semibold text-primary hover:bg-primary/10"
                    >
                      <ExternalLink className="h-3.5 w-3.5" />
                      Open DepEd resource
                    </a>
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

          {/* Interactive Element */}
          <ScrollReveal delay={0.2}>
            <div className="mt-8 glass-card p-8">
              <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                <h3 className="font-bold text-lg text-foreground flex items-center gap-2">
                  <MousePointerClick className="w-5 h-5 text-primary" /> Challenge Arena
                </h3>
                <div className="inline-flex items-center gap-2 text-xs px-3 py-1.5 rounded-full bg-secondary">
                  <Trophy className="w-3.5 h-3.5 text-accent" />
                  Score {challengeScore}/{Math.max(challengePool.length, 1)}
                </div>
              </div>

              <p className="text-muted-foreground mb-4 text-sm">
                Checkpoint {challengeIndex + 1} of {Math.max(challengePool.length, 1)} linked to Step {currentStep + 1}
              </p>

              <div className="rounded-2xl border border-border/60 bg-background/25 backdrop-blur-xl p-5">
                <p className="font-semibold text-foreground mb-4">{challenge?.question}</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {(challenge?.options || []).map((option, optionIndex) => {
                    const isCorrect = optionIndex === challenge?.correct;
                    const isSelected = challengeChoice === optionIndex;
                    const revealedClass = challengeRevealed
                      ? isCorrect
                        ? "border-emerald-500 bg-emerald-50 text-emerald-700"
                        : isSelected
                          ? "border-destructive bg-destructive/10 text-destructive"
                          : "border-border text-muted-foreground"
                      : "border-border hover:border-primary/30 text-foreground";

                    return (
                      <motion.button
                        key={option}
                        whileHover={!challengeRevealed ? { scale: 1.02 } : undefined}
                        whileTap={!challengeRevealed ? { scale: 0.98 } : undefined}
                        onClick={() => selectChallenge(optionIndex)}
                        className={`rounded-xl border-2 px-4 py-3 text-left font-medium transition-all ${revealedClass}`}
                      >
                        {option}
                      </motion.button>
                    );
                  })}
                </div>

                {challengeRevealed && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-4 rounded-xl bg-secondary/60 px-4 py-3 text-sm"
                  >
                    <p className="font-semibold text-foreground flex items-center gap-2">
                      <Flame className="w-4 h-4 text-primary" />
                      {challengeChoice === challenge?.correct ? "Great job!" : "Nice try - keep going!"}
                    </p>
                    <p className="text-muted-foreground mt-1">{challenge?.explanation}</p>
                  </motion.div>
                )}
              </div>

              <div className="mt-4 flex flex-wrap gap-3">
                <button
                  onClick={restartChallenges}
                  className="px-4 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-semibold"
                >
                  Reset Checkpoints
                </button>
                <span className="text-xs text-muted-foreground self-center">
                  This checkpoint updates as you move through lesson slides.
                </span>
              </div>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={0.24}>
            <div className="mt-8">
              <ScenarioDecision lesson={lesson} />
            </div>
          </ScrollReveal>
          <SubjectInteractiveLab lesson={lesson} step={step} />
        </div>
      </div>
    </div>
  );
}

type Challenge = {
  type: "mcq" | "fill_blank";
  question: string;
  options: string[];
  correct: number;
  explanation: string;
};

function buildLessonChallenges(lesson: Lesson, steps: LessonStep[], subjectLessons: Lesson[]): Challenge[] {
  const lessonFacts = steps.map((step) => extractLessonFact(step.content)).filter(Boolean);
  const lessonDistractors = [
    ...(lesson.misconceptions || []),
    ...steps.flatMap((step) => step.keywords || []),
  ];
  const subjectFactPool = subjectLessons
    .flatMap((item) => item.steps.map((step) => extractLessonFact(step.content)))
    .filter(Boolean);

  return steps.map((step, index) => {
    const fact = lessonFacts[index] || extractLessonFact(step.content) || extractLessonFact(lesson.description);
    const candidateDistractors = [...lessonDistractors, ...subjectFactPool.filter((candidate) => candidate !== fact)];
    const factOptions = buildOptions(fact, candidateDistractors, lesson.id + index);
    const englishChallenge = buildEnglishFillBlankChallenge(step, fact, lesson.id + index);

    if (lesson.subject === "english" && englishChallenge && index % 2 === 0) {
      return englishChallenge;
    }

    return {
      type: "mcq",
      question: buildStem(step, lesson, index),
      options: factOptions.options,
      correct: factOptions.correct,
      explanation: `Lesson checkpoint: ${fact}`,
    };
  });
}

function buildTeachingSlides(lesson: Lesson): LessonStep[] {
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

function buildStem(step: LessonStep, lesson: Lesson, index: number) {
  const stems = [
    `Which statement best matches what this step teaches about "${step.title}"?`,
    `A student is reviewing "${lesson.title}". Which idea is correct for this checkpoint?`,
    `Select the most accurate concept from this part of the lesson.`,
    `Which statement should students remember after this slide?`,
  ];
  return stems[index % stems.length];
}

function buildEnglishFillBlankChallenge(step: LessonStep, fact: string, seed: number): Challenge | null {
  const blankWord = pickBlankWord(step, fact);
  if (!blankWord) return null;

  const question = `Fill in the blank for "${step.title}": ${maskWordInSentence(fact, blankWord)}`;
  const distractorPool = [
    "idea",
    "topic",
    "sentence",
    "detail",
    "evidence",
    "claim",
    "summary",
    "inference",
  ];
  const wrong = [...new Set(distractorPool.filter((item) => item.toLowerCase() !== blankWord.toLowerCase()))].slice(0, 3);
  const base = [...wrong];
  while (base.length < 3) base.push(`word${base.length + 1}`);
  const insertAt = seed % 4;
  const options = [...base];
  options.splice(insertAt, 0, blankWord);

  return {
    type: "fill_blank",
    question,
    options: options.slice(0, 4),
    correct: insertAt,
    explanation: `The best word is "${blankWord}" based on the step focus.`,
  };
}

function buildOptions(correct: string, pool: string[], seed: number): { options: string[]; correct: number } {
  const distractors = [...new Set(pool.filter((item) => item !== correct && item.length > 0))].slice(0, 3);
  const base = [...distractors];
  while (base.length < 3) base.push(createDistractorFromFact(correct, base.length + seed));
  const insertAt = seed % 4;
  const options = [...base];
  options.splice(insertAt, 0, correct);
  return { options: options.slice(0, 4), correct: insertAt };
}

function pickBlankWord(step: LessonStep, fact: string) {
  const keywordCandidate = (step.keywords || []).find((word) => word.length >= 4 && /^[a-z-]+$/i.test(word));
  if (keywordCandidate) return keywordCandidate;

  const tokens = fact.match(/[A-Za-z][A-Za-z'-]{3,}/g) || [];
  const stopWords = new Set(["this", "that", "with", "from", "about", "which", "should", "after", "before", "their"]);
  return tokens.find((token) => !stopWords.has(token.toLowerCase())) || null;
}

function maskWordInSentence(sentence: string, word: string) {
  const escaped = word.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const pattern = new RegExp(`\\b${escaped}\\b`, "i");
  if (!pattern.test(sentence)) {
    return `${sentence} (missing key term: ____ )`;
  }
  return sentence.replace(pattern, "____");
}

function extractLessonFact(text: string) {
  const firstSentence = text
    .replace(/\n+/g, " ")
    .split(/[.!?]/)
    .map((segment) => segment.trim())
    .find(Boolean);

  if (!firstSentence) return "";
  return firstSentence.length > 130 ? `${firstSentence.slice(0, 127)}...` : firstSentence;
}

function createDistractorFromFact(fact: string, seed: number) {
  const swaps: Array<[RegExp, string]> = [
    [/\b(increases|greater|up|right)\b/gi, "decreases"],
    [/\b(decreases|lower|down|left)\b/gi, "increases"],
    [/\b(always|all|every)\b/gi, "sometimes"],
    [/\b(can|may)\b/gi, "cannot"],
  ];

  let distractor = fact;
  const [pattern, replacement] = swaps[seed % swaps.length];
  distractor = distractor.replace(pattern, replacement);

  if (distractor === fact) {
    if (seed % 2 === 0) return `This statement reverses the key lesson idea.`;
    return `This statement confuses the main concept with an incorrect interpretation.`;
  }

  return distractor;
}
