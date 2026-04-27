import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import ScrollReveal from "@/components/ScrollReveal";
import { grades } from "@/lib/mockData";
import { updateProgress } from "@/lib/progressStore";

export default function GradeSelection() {
  const navigate = useNavigate();

  const handleSelect = (gradeId: number) => {
    updateProgress({ grade: gradeId });
    navigate(`/subjects?grade=${gradeId}`);
  };

  return (
    <div className="min-h-screen pt-24 pb-12 px-4">
      <div className="max-w-4xl mx-auto">
        <ScrollReveal>
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 mb-4">
              <img
                src="/csjs-logo.png"
                alt="Colegio de San Juan Samar logo"
                className="h-12 w-12 rounded-xl object-cover"
              />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-3">Select Your Grade Level</h1>
            <p className="text-muted-foreground text-lg">Choose your grade to access curriculum-aligned lessons and activities.</p>
          </div>
        </ScrollReveal>

        <div className="grid sm:grid-cols-2 gap-6">
          {grades.map((grade, i) => (
            <ScrollReveal key={grade.id} delay={i * 0.1}>
              <motion.button
                whileHover={{ y: -6, scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleSelect(grade.id)}
                className="w-full glass-card-hover p-8 text-left group"
              >
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${grade.color} flex items-center justify-center mb-4`}>
                  <span className="text-2xl font-bold text-white">{grade.id}</span>
                </div>
                <h3 className="text-xl font-bold text-foreground mb-1">{grade.label}</h3>
                <p className="text-muted-foreground mb-4">{grade.description}</p>
                <div className="flex items-center gap-2 text-primary font-medium text-sm">
                  Select Grade <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </motion.button>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </div>
  );
}
