import { useSearchParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Sparkles, Timer, MousePointerClick } from "lucide-react";
import ScrollReveal from "@/components/ScrollReveal";
import { subjects, lessons } from "@/lib/contentData";
import { getProgress } from "@/lib/progressStore";

export default function SubjectSelection() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const grade = parseInt(searchParams.get("grade") || "7");
  const progress = getProgress();

  // Only show subjects that have lessons for this grade
  const availableSubjects = subjects.filter(s =>
    lessons.some(l => l.grade === grade && l.subject === s.id)
  );

  const getSubjectStatus = (subjectId: string) => {
    const subjectLessons = lessons.filter(l => l.grade === grade && l.subject === subjectId);
    const completed = subjectLessons.filter(l => progress.completedLessons.includes(l.id)).length;
    if (completed === 0) return { label: "Not Started", completed: 0, total: subjectLessons.length };
    if (completed === subjectLessons.length) return { label: "Completed", completed, total: subjectLessons.length };
    return { label: `${completed}/${subjectLessons.length} Lessons`, completed, total: subjectLessons.length };
  };

  const getSubjectMeta = (subjectId: string) => {
    const subjectLessons = lessons.filter(l => l.grade === grade && l.subject === subjectId);
    const interactiveCount = subjectLessons.filter(item => item.type !== "video").length;
    return { interactiveCount, preview: subjectLessons.slice(0, 2) };
  };

  return (
    <div className="min-h-screen pt-24 pb-12 px-4">
      <div className="max-w-5xl mx-auto">
        <ScrollReveal>
          <button onClick={() => navigate("/grades")} className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to Grades
          </button>
          <div className="mb-10">
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">Grade {grade} Subjects</h1>
            <p className="text-muted-foreground text-lg">Choose a subject and jump into lessons, missions, and mini activities.</p>
          </div>
        </ScrollReveal>

        {availableSubjects.length > 0 && (
          <ScrollReveal delay={0.05}>
            <div className="glass-card p-5 mb-6 flex flex-wrap items-center gap-3 text-sm">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-primary/10 text-primary font-semibold">
                <Sparkles className="w-4 h-4" />
                {availableSubjects.length} active subjects
              </div>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-secondary text-secondary-foreground">
                <Timer className="w-4 h-4" />
                {lessons.filter(l => l.grade === grade).length} total lessons this grade
              </div>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-secondary text-secondary-foreground">
                <MousePointerClick className="w-4 h-4" />
                {lessons.filter(l => l.grade === grade && l.type !== "video").length} interactive activities
              </div>
            </div>
          </ScrollReveal>
        )}

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {availableSubjects.map((sub, i) => {
            const status = getSubjectStatus(sub.id);
            const meta = getSubjectMeta(sub.id);
            const Icon = sub.icon;
            return (
              <ScrollReveal key={sub.id} delay={i * 0.08}>
                <motion.button
                  whileHover={{ y: -4 }}
                  onClick={() => navigate(`/lessons?grade=${grade}&subject=${sub.id}`)}
                  className="w-full glass-card-hover p-6 text-left group"
                >
                  <div className="flex items-center gap-4 mb-4">
                    <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${sub.color} flex items-center justify-center`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-bold text-foreground">{sub.name}</h3>
                      <p className="text-sm text-muted-foreground">{status.label}</p>
                    </div>
                  </div>

                  {status.completed > 0 && (
                    <div className="mb-3">
                      <div className="w-full bg-secondary rounded-full h-2">
                        <motion.div
                          className={`h-2 rounded-full bg-gradient-to-r ${sub.color}`}
                          initial={{ width: 0 }}
                          animate={{ width: `${(status.completed / status.total) * 100}%` }}
                          transition={{ duration: 0.8 }}
                        />
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">{Math.round((status.completed / status.total) * 100)}% complete</p>
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-2 mb-3">
                    <div className="rounded-xl bg-secondary/70 px-3 py-2">
                      <p className="text-[11px] uppercase tracking-wide text-muted-foreground">Lessons</p>
                      <p className="font-semibold text-foreground">{status.total}</p>
                    </div>
                    <div className="rounded-xl bg-secondary/70 px-3 py-2">
                      <p className="text-[11px] uppercase tracking-wide text-muted-foreground">Interactive</p>
                      <p className="font-semibold text-foreground">{meta.interactiveCount}</p>
                    </div>
                  </div>

                  {meta.preview.length > 0 && (
                    <div className="mb-3">
                      <p className="text-[11px] uppercase tracking-wide text-muted-foreground mb-1.5">Featured lessons</p>
                      <div className="space-y-1.5">
                        {meta.preview.map((item) => (
                          <div key={item.id} className="text-xs text-muted-foreground truncate rounded-lg bg-background/70 px-2.5 py-1.5 border border-border/50">
                            {item.title}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="flex items-center gap-2 text-primary font-medium text-sm">
                    {status.completed > 0 ? "Continue" : "Start Learning"} <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </motion.button>
              </ScrollReveal>
            );
          })}
        </div>

        {availableSubjects.length === 0 && (
          <div className="glass-card p-12 text-center">
            <p className="text-muted-foreground">No lessons available for Grade {grade} yet. Check back soon!</p>
          </div>
        )}
      </div>
    </div>
  );
}
