import { motion } from "framer-motion";
import { Upload, Users, FileText, BarChart3, ArrowRight, Sparkles, ClipboardCheck } from "lucide-react";
import ScrollReveal from "@/components/ScrollReveal";
import { lessons, studentData, subjects } from "@/lib/contentData";
import { getProgress } from "@/lib/progressStore";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { useNavigate } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";

const COLORS = ["hsl(172,66%,30%)", "hsl(38,92%,60%)", "hsl(220,70%,55%)", "hsl(340,65%,50%)", "hsl(260,55%,55%)", "hsl(20,80%,55%)"];

export default function TeacherPanel() {
  const navigate = useNavigate();
  const [analyticsReady, setAnalyticsReady] = useState(false);
  const progress = getProgress();
  const chartData = subjects.map((s) => {
    const subjectLessons = lessons.filter((lesson) => lesson.subject === s.id);
    const completed = subjectLessons.filter((lesson) => progress.completedLessons.includes(lesson.id)).length;
    const progressPct = subjectLessons.length ? Math.round((completed / subjectLessons.length) * 100) : 0;
    return { name: s.name, progress: progressPct, lessons: subjectLessons.length };
  });
  const totalLessons = lessons.length;
  const completedLessons = progress.completedLessons.filter((id) => lessons.some((lesson) => lesson.id === id)).length;
  const challengeAttempts = progress.challengeAttempts || 0;
  const challengeCorrect = progress.challengeCorrect || 0;
  const challengeAccuracy = challengeAttempts ? Math.round((challengeCorrect / challengeAttempts) * 100) : 0;
  const averageStudentProgress = Math.round(
    studentData.reduce((sum, student) => sum + student.progress, 0) / Math.max(studentData.length, 1),
  );
  const lessonReactions = useMemo(() => {
    const reactions = Object.values(progress.lessonReactions);
    return {
      likes: reactions.filter((reaction) => reaction === "like").length,
      dislikes: reactions.filter((reaction) => reaction === "dislike").length,
    };
  }, [progress.lessonReactions]);

  useEffect(() => {
    const timer = window.setTimeout(() => setAnalyticsReady(true), 450);
    return () => window.clearTimeout(timer);
  }, []);

  const pieData = [
    { name: "Completed", value: completedLessons },
    { name: "Remaining", value: Math.max(totalLessons - completedLessons, 0) },
    { name: "Challenge Correct", value: challengeCorrect },
    { name: "Challenge Missed", value: Math.max(challengeAttempts - challengeCorrect, 0) },
  ];

  return (
    <div className="min-h-screen pt-24 pb-12 px-4">
      <div className="max-w-7xl mx-auto">
        <ScrollReveal>
          <div className="mb-10 rounded-3xl border border-border/60 bg-card/70 p-6 md:p-8">
            <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
              <Sparkles className="h-3.5 w-3.5" />
              Teacher Command Center
            </div>
            <h1 className="mt-4 text-3xl font-bold text-foreground mb-2">Teacher Panel</h1>
            <p className="text-muted-foreground">Manage lessons, track student growth, and act on real-time insights.</p>
          </div>
        </ScrollReveal>

        <ScrollReveal delay={0.05}>
          <div className="mb-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
            {[
              { label: "Course Completion", value: `${Math.round((completedLessons / Math.max(totalLessons, 1)) * 100)}%` },
              { label: "Challenge Accuracy", value: `${challengeAccuracy}%` },
              { label: "Avg Student Progress", value: `${averageStudentProgress}%` },
              { label: "Lesson Feedback", value: `${lessonReactions.likes} 👍 / ${lessonReactions.dislikes} 👎` },
            ].map((item) => (
              <div key={item.label} className="glass-card p-4">
                <p className="text-xs text-muted-foreground">{item.label}</p>
                <p className="mt-1 text-xl font-bold text-foreground">{item.value}</p>
                <p className="mt-2 text-[11px] text-muted-foreground">Updated now</p>
              </div>
            ))}
          </div>
        </ScrollReveal>

        {/* Quick Actions */}
        <ScrollReveal delay={0.1}>
          <div className="grid sm:grid-cols-3 gap-4 mb-10">
            {[
              { icon: Upload, label: "Upload Lesson", desc: "Add new multimedia content", to: "/lessons?grade=7&subject=math" },
              { icon: FileText, label: "Create Quiz", desc: "Build assessments for students", to: "/quiz" },
              { icon: Users, label: "View Students", desc: "Monitor student progress", to: "/dashboard" },
            ].map((a, i) => (
              <motion.button key={i} whileHover={{ y: -3 }}
                className="glass-card-hover p-6 text-left"
                onClick={() => navigate(a.to)}>
                <a.icon className="w-8 h-8 text-primary mb-3" />
                <h3 className="font-bold text-foreground">{a.label}</h3>
                <p className="text-sm text-muted-foreground">{a.desc}</p>
                <span className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-primary">
                  Open <ArrowRight className="h-3.5 w-3.5" />
                </span>
              </motion.button>
            ))}
          </div>
        </ScrollReveal>

        {analyticsReady ? (
        <div className="grid lg:grid-cols-2 gap-6 mb-10">
          {/* Bar Chart */}
          <ScrollReveal>
            <div className="glass-card p-6">
              <h3 className="font-bold text-foreground mb-4 flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-primary" /> Subject Progress
              </h3>
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(220,13%,91%)" />
                  <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip contentStyle={{ borderRadius: 12, border: "none", boxShadow: "0 4px 24px -4px rgba(0,0,0,0.1)" }} />
                  <Bar dataKey="progress" radius={[8, 8, 0, 0]}>
                    {chartData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </ScrollReveal>

          {/* Pie Chart */}
          <ScrollReveal delay={0.1}>
            <div className="glass-card p-6">
              <h3 className="font-bold text-foreground mb-4">Lesson Completion Status</h3>
              <ResponsiveContainer width="100%" height={280}>
                <PieChart>
                  <Pie data={pieData} cx="50%" cy="50%" innerRadius={60} outerRadius={100} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                    {pieData.map((_, i) => <Cell key={i} fill={COLORS[i]} />)}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </ScrollReveal>
        </div>
        ) : (
          <div className="mb-10 grid gap-6 lg:grid-cols-2">
            <Skeleton className="h-[320px] rounded-3xl" />
            <Skeleton className="h-[320px] rounded-3xl" />
          </div>
        )}

        {/* Student Table */}
        <ScrollReveal delay={0.15}>
          <div className="glass-card p-6">
            <h3 className="font-bold text-foreground mb-4 flex items-center gap-2">
              <Users className="w-5 h-5 text-primary" /> Student Progress
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-4 text-muted-foreground font-medium">Student</th>
                    <th className="text-left py-3 px-4 text-muted-foreground font-medium">Grade</th>
                    <th className="text-left py-3 px-4 text-muted-foreground font-medium">Progress</th>
                    <th className="text-left py-3 px-4 text-muted-foreground font-medium">Quiz Avg</th>
                  </tr>
                </thead>
                <tbody>
                  {studentData.map((s, i) => (
                    <motion.tr key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.05 }}
                      className="border-b border-border/50 hover:bg-secondary/50 transition-colors">
                      <td className="py-3 px-4 font-medium text-foreground">{s.name}</td>
                      <td className="py-3 px-4 text-muted-foreground">Grade {s.grade}</td>
                      <td className="py-3 px-4">            
                        <div className="flex items-center gap-2">
                          <div className="w-24 bg-secondary rounded-full h-2">
                            <div className="h-2 rounded-full gradient-primary" style={{ width: `${s.progress}%` }} />
                          </div>
                          <span className="text-muted-foreground">{s.progress}%</span>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-1 rounded-lg text-xs font-medium ${
                          s.quizAvg >= 85 ? "bg-emerald-100 text-emerald-700" : s.quizAvg >= 70 ? "bg-amber-100 text-amber-700" : "bg-red-100 text-red-700"
                        }`}>{s.quizAvg}%</span>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </ScrollReveal>

        <ScrollReveal delay={0.2}>
          <div className="glass-card p-6">
            <h3 className="mb-3 flex items-center gap-2 font-bold text-foreground">
              <ClipboardCheck className="h-5 w-5 text-primary" />
              Teaching Recommendations
            </h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>Use lesson replay and captions for classes below 70% challenge accuracy.</li>
              <li>Assign drag-and-drop sequencing activities after concept-heavy lessons.</li>
              <li>Review lessons with more dislikes and collect student comments from class check-ins.</li>
            </ul>
          </div>
        </ScrollReveal>
      </div>
    </div>
  );
}
