import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  BookOpen,
  Clock,
  TrendingUp,
  Award,
  ArrowRight,
  Inbox,
  Trophy,
  Compass,
  Sparkles,
} from "lucide-react";
import ScrollReveal from "@/components/ScrollReveal";
import { subjects, lessons, badges as allBadges } from "@/lib/contentData";
import { calculateCompletionProgress } from "@/lib/dashboardProgress";
import { getProgress } from "@/lib/progressStore";
import { Skeleton } from "@/components/ui/skeleton";
import { useEffect, useMemo, useState } from "react";

export default function Dashboard() {
  const [ready, setReady] = useState(false);
  const progress = getProgress();
  const hasActivity = progress.completedLessons.length > 0;
  const grade = progress.grade;

  // Subjects user has accessed
  const accessedSubjectIds = Object.keys(progress.lastAccessed);
  const accessedSubjects = subjects.filter(s => accessedSubjectIds.includes(s.id));

  // Stats — only real data
  const completedCount = progress.completedLessons.length;
  const challengeAccuracy = progress.challengeAttempts
    ? Math.round((progress.challengeCorrect / progress.challengeAttempts) * 100)
    : 0;
  const likedLessons = Object.values(progress.lessonReactions).filter((reaction) => reaction === "like").length;
  const dislikedLessons = Object.values(progress.lessonReactions).filter((reaction) => reaction === "dislike").length;
  const completionProgress = calculateCompletionProgress(progress.completedLessons, lessons, grade);

  // Recent lessons
  const recentLessons = progress.completedLessons
    .map(id => lessons.find(l => l.id === id))
    .filter(Boolean)
    .slice(-4)
    .reverse();

  const badgeProgress = useMemo(
    () => [
      { ...allBadges[0], earned: completedCount >= 1 },
      { ...allBadges[1], earned: Object.values(progress.quizScores).some((score) => score === 100) },
      { ...allBadges[2], earned: completedCount >= 5 },
      { ...allBadges[3], earned: accessedSubjects.length >= subjects.length },
    ],
    [completedCount, progress.quizScores, accessedSubjects.length],
  );

  useEffect(() => {
    const timer = window.setTimeout(() => setReady(true), 350);
    return () => window.clearTimeout(timer);
  }, []);

  if (!ready) {
    return (
      <div className="min-h-screen px-4 pb-12 pt-24">
        <div className="mx-auto max-w-7xl space-y-6">
          <Skeleton className="h-20 w-full rounded-3xl" />
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <Skeleton key={index} className="h-24 w-full rounded-2xl" />
            ))}
          </div>
          <Skeleton className="h-64 w-full rounded-3xl" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-12 px-4">
      <div className="max-w-7xl mx-auto">
        <ScrollReveal>
          <div className="mb-8 rounded-3xl border border-border/60 bg-card/65 p-6 md:p-8">
            <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
              <Sparkles className="h-3.5 w-3.5" />
              Student Dashboard
            </div>
            <h1 className="mt-4 text-3xl md:text-4xl font-bold text-foreground mb-2">
              Welcome back, Student!
            </h1>
            <p className="text-muted-foreground text-lg">
              {grade ? `Grade ${grade}` : "Select a grade to get started"} · {hasActivity ? "Continue your learning journey." : "Start your first lesson today."}
            </p>
            <div className="mt-5 flex flex-wrap gap-3 text-xs">
              <Link to={grade ? `/subjects?grade=${grade}` : "/grades"} className="inline-flex items-center gap-2 rounded-xl border border-border px-3 py-2 hover:bg-secondary">
                <Compass className="h-3.5 w-3.5" />
                Lesson Hub
              </Link>
              <Link to="/quiz" className="inline-flex items-center gap-2 rounded-xl border border-border px-3 py-2 hover:bg-secondary">
                <Trophy className="h-3.5 w-3.5" />
                Practice Activities
              </Link>
            </div>
          </div>
        </ScrollReveal>

        {!hasActivity ? (
          <ScrollReveal delay={0.1}>
            <div className="glass-card p-12 text-center">
              <Inbox className="w-16 h-16 text-muted-foreground/40 mx-auto mb-4" />
              <h2 className="text-xl font-bold text-foreground mb-2">No lessons started yet</h2>
              <p className="text-muted-foreground mb-6">Begin your learning journey by selecting a grade and subject.</p>
              <Link to="/grades" className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl gradient-primary text-primary-foreground font-semibold hover:-translate-y-0.5 transition-transform">
                Explore Lessons <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </ScrollReveal>
        ) : (
          <>
            {/* Stats */}
            <ScrollReveal delay={0.1}>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
                {[
                  { icon: BookOpen, label: "Lessons Done", value: String(completedCount), color: "text-primary" },
                  { icon: Clock, label: "Subjects Explored", value: String(accessedSubjects.length), color: "text-accent" },
                  { icon: TrendingUp, label: "Challenge Accuracy", value: progress.challengeAttempts > 0 ? `${challengeAccuracy}%` : "—", color: "text-emerald-500" },
                  { icon: Award, label: "Best Streak", value: String(progress.bestStreak), color: "text-purple-500" },
                ].map((s, i) => (
                  <motion.div key={i} whileHover={{ y: -3 }} className="glass-card p-5">
                    <s.icon className={`w-6 h-6 ${s.color} mb-2`} />
                    <div className="text-2xl font-bold text-foreground">{s.value}</div>
                    <div className="text-sm text-muted-foreground">{s.label}</div>
                  </motion.div>
                ))}
              </div>
            </ScrollReveal>

            <ScrollReveal delay={0.12}>
              <div id="progress" className="mb-10 grid gap-4 lg:grid-cols-[2fr_1fr]">
                <div className="glass-card p-5">
                  <div className="mb-3 flex items-center justify-between gap-3">
                    <h3 className="font-semibold text-foreground">Completion Progress</h3>
                    <span className="text-sm font-semibold text-primary">{completionProgress.percent}%</span>
                  </div>
                  <div className="h-2.5 rounded-full bg-secondary">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${completionProgress.percent}%` }}
                      transition={{ duration: 0.8 }}
                      className="h-2.5 rounded-full bg-gradient-to-r from-primary to-accent"
                    />
                  </div>
                  <p className="mt-2 text-xs text-muted-foreground">
                    {completionProgress.completed} of {completionProgress.total || lessons.length} lessons completed
                  </p>
                </div>
                <div className="glass-card p-5">
                  <h3 className="font-semibold text-foreground">Lesson Reactions</h3>
                  <p className="mt-1 text-xs text-muted-foreground">Student feedback from lesson view</p>
                  <div className="mt-3 flex items-center gap-3 text-sm">
                    <span className="rounded-lg bg-emerald-500/15 px-2 py-1 font-semibold text-emerald-700">👍 {likedLessons}</span>
                    <span className="rounded-lg bg-destructive/10 px-2 py-1 font-semibold text-destructive">👎 {dislikedLessons}</span>
                  </div>
                </div>
              </div>
            </ScrollReveal>

            {/* Accessed Subjects */}
            {accessedSubjects.length > 0 && (
              <ScrollReveal delay={0.15}>
                <h2 className="text-2xl font-bold mb-6 text-foreground">Your Subjects</h2>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-12">
                  {accessedSubjects.map((sub, i) => {
                    const Icon = sub.icon;
                    const subLessons = lessons.filter(l => l.subject === sub.id && (grade ? l.grade === grade : true));
                    const completed = subLessons.filter(l => progress.completedLessons.includes(l.id)).length;
                    const pct = subLessons.length > 0 ? Math.round((completed / subLessons.length) * 100) : 0;
                    return (
                      <motion.div key={sub.id} whileHover={{ y: -4 }} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}>
                        <Link to={`/lessons?grade=${grade}&subject=${sub.id}`} className="block glass-card-hover p-6">
                          <div className="flex items-center gap-4 mb-4">
                            <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${sub.color} flex items-center justify-center`}>
                              <Icon className="w-6 h-6 text-white" />
                            </div>
                            <div>
                              <h3 className="font-bold text-foreground">{sub.name}</h3>
                              <p className="text-sm text-muted-foreground">{completed}/{subLessons.length} lessons</p>
                            </div>
                          </div>
                          <div className="w-full bg-secondary rounded-full h-2.5">
                            <motion.div
                              className={`h-2.5 rounded-full bg-gradient-to-r ${sub.color}`}
                              initial={{ width: 0 }}
                              animate={{ width: `${pct}%` }}
                              transition={{ duration: 1, delay: 0.3 + i * 0.1 }}
                            />
                          </div>
                          <p className="text-sm text-muted-foreground mt-2">{pct}% complete</p>
                        </Link>
                      </motion.div>
                    );
                  })}
                </div>
              </ScrollReveal>
            )}

            <ScrollReveal delay={0.18}>
              <h2 className="text-2xl font-bold mb-6 text-foreground">Achievement Badges</h2>
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
                {badgeProgress.map((badge) => (
                  <div key={badge.id} className="glass-card p-5">
                    <div className={`mb-2 inline-flex rounded-xl px-2.5 py-1 text-xs font-semibold ${badge.earned ? "bg-emerald-500/15 text-emerald-700" : "bg-secondary text-muted-foreground"}`}>
                      {badge.earned ? "Unlocked" : "Locked"}
                    </div>
                    <p className="font-semibold text-foreground">{badge.name}</p>
                    <p className="mt-1 text-sm text-muted-foreground">{badge.description}</p>
                  </div>
                ))}
              </div>
            </ScrollReveal>

            {/* Recent Lessons */}
            {recentLessons.length > 0 && (
              <ScrollReveal delay={0.2}>
                <h2 className="text-2xl font-bold mb-6 text-foreground">Recent Lessons</h2>
                <div className="space-y-3">
                  {recentLessons.map((lesson) => lesson && (
                    <Link key={lesson.id} to={`/lessons?grade=${lesson.grade}&subject=${lesson.subject}`}>
                      <motion.div whileHover={{ x: 4 }} className="glass-card p-5 flex items-center justify-between hover:shadow-[var(--shadow-hover)] transition-shadow">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-primary/10 text-primary font-bold text-sm">
                            ✓
                          </div>
                          <div>
                            <h4 className="font-semibold text-foreground">{lesson.title}</h4>
                            <p className="text-sm text-muted-foreground">{lesson.description}</p>
                          </div>
                        </div>
                        <div className="hidden sm:flex items-center gap-3 text-sm text-muted-foreground">
                          <span className="px-3 py-1 rounded-full bg-secondary capitalize">{lesson.type}</span>
                        </div>
                      </motion.div>
                    </Link>
                  ))}
                </div>
              </ScrollReveal>
            )}
          </>
        )}
      </div>
    </div>
  );
}
