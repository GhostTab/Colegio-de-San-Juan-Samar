import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, ChevronLeft, Send, CheckCircle2, BarChart3 } from "lucide-react";
import ScrollReveal from "@/components/ScrollReveal";
import { surveyCategories } from "@/lib/mockData";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const likertLabels = ["Strongly Disagree", "Disagree", "Neutral", "Agree", "Strongly Agree"];

export default function Survey() {
  const [categoryIdx, setCategoryIdx] = useState(0);
  const [responses, setResponses] = useState<Record<string, number[]>>(() => {
    const init: Record<string, number[]> = {};
    surveyCategories.forEach((c) => { init[c.id] = Array(c.questions.length).fill(0); });
    return init;
  });
  const [submitted, setSubmitted] = useState(false);
  const [profile, setProfile] = useState({ name: "", grade: "7", section: "" });

  const cat = surveyCategories[categoryIdx];
  const totalQuestions = surveyCategories.reduce((sum, c) => sum + c.questions.length, 0);
  const answeredQuestions = Object.values(responses).flat().filter((v) => v > 0).length;

  const setRating = (qIdx: number, val: number) => {
    setResponses((prev) => {
      const copy = { ...prev };
      copy[cat.id] = [...copy[cat.id]];
      copy[cat.id][qIdx] = val;
      return copy;
    });
  };

  const handleSubmit = () => {
    localStorage.setItem("survey_responses", JSON.stringify({ profile, responses, timestamp: new Date().toISOString() }));
    setSubmitted(true);
  };

  const getAverage = (catId: string) => {
    const vals = responses[catId].filter((v) => v > 0);
    return vals.length ? (vals.reduce((a, b) => a + b, 0) / vals.length).toFixed(2) : "0";
  };

  if (submitted) {
    const chartData = surveyCategories.map((c) => ({ name: c.title, average: parseFloat(getAverage(c.id)) }));
    return (
      <div className="min-h-screen pt-24 pb-12 px-4">
        <div className="max-w-3xl mx-auto">
          <ScrollReveal>
            <div className="glass-card p-12 text-center mb-8">
              <CheckCircle2 className="w-16 h-16 text-primary mx-auto mb-4" />
              <h2 className="text-3xl font-bold text-foreground mb-2">Thank You!</h2>
              <p className="text-muted-foreground">Your responses have been recorded successfully.</p>
            </div>
          </ScrollReveal>
          <ScrollReveal delay={0.1}>
            <div className="glass-card p-6">
              <h3 className="font-bold text-foreground mb-4 flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-primary" /> Summary Results (Weighted Mean)
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={chartData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(220,13%,91%)" />
                  <XAxis type="number" domain={[0, 5]} tick={{ fontSize: 12 }} />
                  <YAxis dataKey="name" type="category" width={150} tick={{ fontSize: 12 }} />
                  <Tooltip contentStyle={{ borderRadius: 12, border: "none" }} />
                  <Bar dataKey="average" fill="hsl(172,66%,30%)" radius={[0, 8, 8, 0]} />
                </BarChart>
              </ResponsiveContainer>
              <div className="mt-4 grid sm:grid-cols-2 gap-3">
                {chartData.map((d) => (
                  <div key={d.name} className="p-3 rounded-xl bg-secondary flex justify-between">
                    <span className="text-sm font-medium text-foreground">{d.name}</span>
                    <span className="text-sm font-bold text-primary">{d.average}</span>
                  </div>
                ))}
              </div>
            </div>
          </ScrollReveal>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-12 px-4">
      <div className="max-w-3xl mx-auto">
        <ScrollReveal>
          <h1 className="text-3xl font-bold text-foreground mb-2">System Evaluation Survey 📋</h1>
          <p className="text-muted-foreground mb-8">Help us improve by sharing your experience.</p>
        </ScrollReveal>

        {/* Progress */}
        <div className="mb-8">
          <div className="flex justify-between text-sm text-muted-foreground mb-2">
            <span>{answeredQuestions} of {totalQuestions} questions answered</span>
            <span>{Math.round((answeredQuestions / totalQuestions) * 100)}%</span>
          </div>
          <div className="w-full bg-secondary rounded-full h-2">
            <motion.div className="h-2 rounded-full gradient-primary" animate={{ width: `${(answeredQuestions / totalQuestions) * 100}%` }} />
          </div>
        </div>

        {/* Category tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {surveyCategories.map((c, i) => (
            <button key={c.id} onClick={() => setCategoryIdx(i)}
              className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
                i === categoryIdx ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground hover:text-foreground"
              }`}>
              {c.title}
            </button>
          ))}
        </div>

        {/* Profile section (first category) */}
        {categoryIdx === 0 && (
          <ScrollReveal>
            <div className="glass-card p-6 mb-6">
              <h3 className="font-bold text-foreground mb-4">User Profile</h3>
              <div className="grid sm:grid-cols-3 gap-4">
                <div>
                  <label className="text-sm text-muted-foreground mb-1 block">Name (Optional)</label>
                  <input value={profile.name} onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                    className="w-full p-3 rounded-xl border border-border bg-background text-foreground focus:ring-2 focus:ring-primary/20 outline-none transition-all" placeholder="Your name" />
                </div>
                <div>
                  <label className="text-sm text-muted-foreground mb-1 block">Grade Level</label>
                  <select value={profile.grade} onChange={(e) => setProfile({ ...profile, grade: e.target.value })}
                    className="w-full p-3 rounded-xl border border-border bg-background text-foreground">
                    <option value="7">Grade 7</option>
                    <option value="8">Grade 8</option>
                    <option value="9">Grade 9</option>
                    <option value="10">Grade 10</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm text-muted-foreground mb-1 block">Section</label>
                  <input value={profile.section} onChange={(e) => setProfile({ ...profile, section: e.target.value })}
                    className="w-full p-3 rounded-xl border border-border bg-background text-foreground focus:ring-2 focus:ring-primary/20 outline-none transition-all" placeholder="Your section" />
                </div>
              </div>
            </div>
          </ScrollReveal>
        )}

        {/* Questions */}
        <AnimatePresence mode="wait">
          <motion.div key={cat.id} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
            <div className="space-y-4">
              {cat.questions.map((q, qIdx) => (
                <div key={qIdx} className="glass-card p-6">
                  <p className="font-medium text-foreground mb-4">{qIdx + 1}. {q}</p>
                  <div className="flex flex-wrap gap-2">
                    {likertLabels.map((label, val) => (
                      <motion.button key={val} whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                        onClick={() => setRating(qIdx, val + 1)}
                        className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                          responses[cat.id][qIdx] === val + 1
                            ? "gradient-primary text-primary-foreground"
                            : "bg-secondary text-muted-foreground hover:text-foreground"
                        }`}>
                        {val + 1} - {label}
                      </motion.button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Navigation */}
        <div className="flex justify-between mt-8">
          <button onClick={() => setCategoryIdx(Math.max(0, categoryIdx - 1))} disabled={categoryIdx === 0}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-secondary text-secondary-foreground font-medium disabled:opacity-30">
            <ChevronLeft className="w-4 h-4" /> Previous
          </button>
          {categoryIdx < surveyCategories.length - 1 ? (
            <button onClick={() => setCategoryIdx(categoryIdx + 1)}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl gradient-primary text-primary-foreground font-semibold">
              Next <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button onClick={handleSubmit}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl gradient-primary text-primary-foreground font-semibold">
              Submit <Send className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
