import { useMemo, useRef } from "react";
import { Link } from "react-router-dom";
import { motion, useScroll, useTransform } from "framer-motion";
import {
  ArrowRight,
  Sparkles,
  Play,
  Zap,
  Target,
  BarChart3,
  Layers3,
  BookOpen,
  CheckCircle2,
} from "lucide-react";
import ScrollReveal from "@/components/ScrollReveal";

export default function Landing() {
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroY = useTransform(scrollYProgress, [0, 1], [0, 140]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const backgroundY = useTransform(scrollYProgress, [0, 1], [0, 110]);

  const features = [
    { icon: Play, title: "Lesson Player", desc: "Students move through guided lesson steps with controls and captions." },
    { icon: Zap, title: "Challenge Arena", desc: "Each lesson includes checkpoint questions linked to the current step." },
    { icon: Target, title: "Quiz Practice", desc: "Students can open subject quizzes to review and test understanding." },
    { icon: BarChart3, title: "Progress Tracking", desc: "Dashboard and teacher view show completion and challenge performance." },
  ];

  const pillars = useMemo(
    () => [
      {
        icon: Layers3,
        title: "Grade-to-Subject Flow",
        detail: "Students select grade, choose subject, then follow lessons in sequence.",
      },
      {
        icon: Sparkles,
        title: "Built-in Classroom Tools",
        detail: "Includes lesson controls, challenge checkpoints, and teacher-facing progress views.",
      },
    ],
    [],
  );

  return (
    <div className="min-h-screen overflow-hidden bg-background text-foreground">
      <section ref={heroRef} className="relative flex min-h-screen items-center overflow-hidden px-4 py-24 md:py-14">
        <motion.div style={{ y: backgroundY }} className="absolute inset-0 aurora-mesh pointer-events-none" />
        <div className="absolute inset-0 grain-overlay pointer-events-none" />

        <motion.div
          className="absolute top-24 left-[8%] h-36 w-36 rounded-full bg-primary/20 blur-3xl pointer-events-none"
          animate={{ y: [0, 18, 0], x: [0, -12, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-24 right-[10%] h-52 w-52 rounded-full bg-accent/20 blur-3xl pointer-events-none"
          animate={{ y: [0, -22, 0], x: [0, 10, 0] }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        />

        <motion.div style={{ y: heroY, opacity: heroOpacity }} className="relative z-10 mx-auto w-full max-w-3xl text-center">
          <div>
            <motion.div
              initial={{ opacity: 0, y: 22 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              className="inline-flex items-center justify-center gap-2 rounded-full border border-border/70 bg-card/70 px-4 py-2 text-sm font-semibold text-primary backdrop-blur-xl"
            >
              <Sparkles className="h-4 w-4" />
              Colegio de San Juan Samar - Research Platform
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 36 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.06, ease: [0.22, 1, 0.36, 1] }}
              className="mt-5 text-balance text-4xl font-black leading-[1.05] tracking-tight md:text-6xl"
            >
              Learn with motion,
              <br />
              remember with meaning.
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.85, delay: 0.14, ease: [0.22, 1, 0.36, 1] }}
              className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-muted-foreground md:text-lg"
            >
              A learning experience for Grades 7-10 where each concept is delivered as an interactive
              scene, not a static lecture.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 22 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
              className="mt-7 flex flex-col items-center justify-center gap-4 sm:flex-row"
            >
              <Link
                to="/grades"
                className="group inline-flex items-center justify-center gap-2 rounded-2xl bg-primary px-8 py-4 text-base font-semibold text-primary-foreground shadow-[var(--shadow-hover)] transition-all duration-300 hover:-translate-y-0.5 hover:brightness-110"
              >
                Start Learning
                <ArrowRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
              <Link
                to="/lessons?grade=7&subject=math"
                className="inline-flex items-center justify-center gap-2 rounded-2xl border border-border/70 bg-card/80 px-8 py-4 text-base font-semibold text-foreground backdrop-blur-xl transition-colors duration-300 hover:bg-secondary/80"
              >
                <Play className="h-5 w-5" />
                View Demo
              </Link>
            </motion.div>
          </div>
        </motion.div>
      </section>

      <section className="px-4 pb-8 md:pb-14">
        <div className="mx-auto grid max-w-7xl gap-5 rounded-[2rem] border border-border/60 bg-card/65 p-5 backdrop-blur-2xl md:grid-cols-3 md:p-7">
          {pillars.map((pillar, index) => (
            <ScrollReveal key={pillar.title} delay={index * 0.08}>
              <div className="rounded-3xl border border-border/60 bg-background/75 p-5">
                <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-primary/15 text-primary">
                  <pillar.icon className="h-5 w-5" />
                </div>
                <h3 className="text-lg font-bold">{pillar.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{pillar.detail}</p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </section>

      <section className="relative px-4 py-24">
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-primary/[0.04] to-transparent" />
        <div className="relative mx-auto max-w-7xl">
          <ScrollReveal>
            <div className="mb-14 max-w-3xl">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Core learning features</p>
              <h2 className="mt-3 text-4xl font-black leading-tight md:text-5xl">What students and teachers can do.</h2>
              <p className="mt-4 text-base leading-relaxed text-muted-foreground md:text-lg">
                The platform supports lessons, checkpoints, quizzes, and progress monitoring for Grades 7-10.
              </p>
            </div>
          </ScrollReveal>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {features.map((feature, index) => (
              <ScrollReveal key={feature.title} delay={index * 0.1}>
                <motion.article
                  whileHover={{ y: -7, scale: 1.01 }}
                  transition={{ duration: 0.25 }}
                  className="h-full rounded-3xl border border-border/60 bg-card/75 p-6 backdrop-blur-xl"
                >
                  <div className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-accent text-primary-foreground shadow-[var(--shadow-soft)]">
                    <feature.icon className="h-6 w-6" />
                  </div>
                  <h3 className="text-lg font-bold">{feature.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{feature.desc}</p>
                </motion.article>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 py-24">
        <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <ScrollReveal>
            <div className="rounded-[2rem] border border-border/60 bg-card/75 p-8 backdrop-blur-2xl md:p-10">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">In this system</p>
              <h2 className="mt-3 text-4xl font-black leading-tight md:text-5xl">
                Lesson progression,
                <br />
                guided by completion.
              </h2>
              <p className="mt-5 max-w-2xl text-base leading-relaxed text-muted-foreground">
                Students complete a lesson before opening the next one, keeping the flow structured and consistent.
              </p>
              <div className="mt-8 grid gap-4 sm:grid-cols-2">
                {[
                  { icon: BookOpen, value: "4", label: "grade levels (7-10)" },
                  { icon: Target, value: "1", label: "challenge arena per lesson view" },
                ].map((stat) => (
                  <div key={stat.label} className="rounded-2xl border border-border/70 bg-background/75 p-4">
                    <div className="mb-3 inline-flex h-9 w-9 items-center justify-center rounded-xl bg-primary/15 text-primary">
                      <stat.icon className="h-5 w-5" />
                    </div>
                    <p className="text-2xl font-extrabold text-foreground">{stat.value}</p>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={0.1}>
            <div className="h-full rounded-[2rem] border border-border/60 bg-gradient-to-br from-primary/15 via-card/80 to-accent/15 p-8 backdrop-blur-2xl md:p-10">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">What students get</p>
              <ul className="mt-6 space-y-4">
                {[
                  "Step-by-step lessons with play, replay, captions, and speed controls",
                  "Challenge Arena checkpoints tied to the current lesson step",
                  "Quiz Practice by grade and subject",
                  "Progress tracking through student dashboard and teacher panel",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3 text-sm leading-relaxed text-foreground/90">
                    <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </ScrollReveal>
        </div>
      </section>

      <section className="px-4 pb-24">
        <ScrollReveal>
          <div className="mx-auto max-w-5xl rounded-[2rem] border border-border/60 bg-card/70 px-8 py-14 text-center backdrop-blur-2xl md:px-14 md:py-16">
            <h2 className="text-3xl font-black md:text-5xl">Ready to start the lesson flow?</h2>
            <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-muted-foreground md:text-lg">
              Choose a grade, open a subject, and begin structured lesson and challenge activities.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link
                to="/grades"
                className="group inline-flex items-center justify-center gap-2 rounded-2xl bg-primary px-8 py-4 text-base font-semibold text-primary-foreground shadow-[var(--shadow-hover)] transition-all duration-300 hover:-translate-y-0.5 hover:brightness-110"
              >
                Explore Lessons
                <ArrowRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
              <Link
                to="/dashboard"
                className="inline-flex items-center justify-center gap-2 rounded-2xl border border-border/70 bg-background/80 px-8 py-4 text-base font-semibold text-foreground backdrop-blur-xl transition-colors duration-300 hover:bg-secondary/80"
              >
                Teacher Dashboard
              </Link>
            </div>
          </div>
        </ScrollReveal>
      </section>

      <footer className="border-t border-border/60 px-4 py-8">
        <div className="mx-auto max-w-7xl text-center text-sm text-muted-foreground">
          © 2026 CSJS Multimedia Animation Learning System - Colegio de San Juan Samar, Northern Samar
        </div>
      </footer>
    </div>
  );
}
