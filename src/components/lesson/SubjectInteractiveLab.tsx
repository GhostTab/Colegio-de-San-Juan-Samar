import { useMemo, useState } from "react";
import type { LessonStep } from "@/lib/contentData";
import type { Lesson } from "@/lib/mockData";
import ProgressTracker from "@/components/interactive/ProgressTracker";
import QuizComponent, { type QuizItem } from "@/components/interactive/QuizComponent";
import DragDropActivity from "@/components/interactive/DragDropActivity";
import InteractiveDiagram from "@/components/interactive/InteractiveDiagram";
import SimulationControl from "@/components/interactive/SimulationControl";

type SubjectInteractiveLabProps = {
  lesson: Lesson;
  step: LessonStep;
};

function buildQuickQuiz(step: LessonStep, lesson: Lesson): QuizItem {
  const keyWord = step.keywords?.[0] || step.title.toLowerCase();
  const options = [
    `Focus on ${keyWord} and apply it to the activity`,
    "Skip the concept and guess the answer",
    "Memorize only one sentence without understanding",
    "Ignore instructions and move to the next lesson",
  ];
  const shift = lesson.id % options.length;
  const rotated = options.map((_, index) => options[(index + shift) % options.length]);
  const correctIndex = (0 - shift + options.length) % options.length;

  return {
    question: `Quick check: what is the best strategy for this step?`,
    options: rotated,
    correctIndex,
    explanation: `Use ${keyWord} actively so you understand, not just memorize.`,
  };
}

function MathActivities() {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <DragDropActivity
        title="Equation Steps"
        instructions="Arrange the steps to solve 3x + 2 = 14."
        items={["Subtract 2 from both sides", "x = 4", "3x = 12", "Divide both sides by 3"]}
        targetOrder={["Subtract 2 from both sides", "3x = 12", "Divide both sides by 3", "x = 4"]}
      />
      <SimulationControl
        title="Geometry Explorer"
        subtitle="Move the angle value and observe the triangle type."
        min={20}
        max={140}
        initial={60}
        unit="°"
        evaluate={(value) => ({
          label: value < 90 ? "Acute angle" : value === 90 ? "Right angle" : "Obtuse angle",
          detail: `At ${value}°, identify where this angle appears in real objects and classify it correctly.`,
        })}
      />
    </div>
  );
}

function ScienceActivities() {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <InteractiveDiagram
        title="Plant Parts Diagram"
        subtitle="Click each label to reveal the function."
        points={[
          { id: "leaf", label: "Leaf", x: 30, y: 25, detail: "Leaves capture light for photosynthesis." },
          { id: "stem", label: "Stem", x: 50, y: 50, detail: "Stem supports the plant and transports water." },
          { id: "root", label: "Root", x: 45, y: 80, detail: "Roots absorb water and minerals from soil." },
        ]}
      />
      <SimulationControl
        title="Photosynthesis Simulation"
        subtitle="Adjust light intensity and see oxygen output."
        min={0}
        max={100}
        initial={50}
        unit="%"
        evaluate={(value) => ({
          label: value < 25 ? "Low output" : value < 70 ? "Moderate output" : "High output",
          detail: "As light increases (up to a point), photosynthesis generally increases too.",
        })}
      />
    </div>
  );
}

function EnglishActivities() {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <DragDropActivity
        title="Sentence Builder"
        instructions="Arrange words to form a correct sentence."
        items={["library", "The", "students", "in", "read"]}
        targetOrder={["The", "students", "read", "in", "library"]}
      />
      <InteractiveDiagram
        title="Vocabulary Match Board"
        subtitle="Click word cards and read meaning hints."
        points={[
          { id: "infer", label: "Infer", x: 20, y: 35, detail: "To conclude based on evidence and clues." },
          { id: "claim", label: "Claim", x: 55, y: 20, detail: "A statement that needs support." },
          { id: "evidence", label: "Evidence", x: 70, y: 65, detail: "Facts or details that support a claim." },
        ]}
      />
    </div>
  );
}

function APActivities() {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <DragDropActivity
        title="Timeline Sequencing"
        instructions="Arrange events from earliest to latest."
        items={["Event C", "Event A", "Event D", "Event B"]}
        targetOrder={["Event A", "Event B", "Event C", "Event D"]}
      />
      <InteractiveDiagram
        title="Map Interaction"
        subtitle="Click map points to reveal region facts."
        points={[
          { id: "north", label: "North", x: 45, y: 20, detail: "Mountain-rich areas influence livelihood patterns." },
          { id: "center", label: "Center", x: 50, y: 48, detail: "Central regions connect trade and governance hubs." },
          { id: "south", label: "South", x: 55, y: 78, detail: "Southern routes support maritime exchange." },
        ]}
      />
    </div>
  );
}

function ICTActivities() {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <DragDropActivity
        title="Computer Parts Order"
        instructions="Arrange startup flow from power to display."
        items={["Operating System Loads", "Press Power", "POST Check", "Desktop Appears"]}
        targetOrder={["Press Power", "POST Check", "Operating System Loads", "Desktop Appears"]}
      />
      <SimulationControl
        title="Process Visualizer"
        subtitle="Adjust CPU load to observe system responsiveness."
        min={10}
        max={100}
        initial={40}
        unit="%"
        evaluate={(value) => ({
          label: value < 50 ? "Stable" : value < 80 ? "Busy" : "Overloaded",
          detail: "Higher process load can reduce response speed and increase waiting time.",
        })}
      />
    </div>
  );
}

export default function SubjectInteractiveLab({ lesson, step }: SubjectInteractiveLabProps) {
  const [quizAttempts, setQuizAttempts] = useState(0);
  const [quizCorrect, setQuizCorrect] = useState(0);
  const quizItem = useMemo(() => buildQuickQuiz(step, lesson), [lesson, step]);
  const progress = quizAttempts ? (quizCorrect / quizAttempts) * 100 : 0;

  return (
    <div className="mt-8 glass-card p-6 md:p-8 space-y-4">
      <div>
        <h3 className="text-lg font-bold text-foreground">Interactive Lab</h3>
        <p className="text-sm text-muted-foreground">Try activities designed for {lesson.subject.toUpperCase()} learning.</p>
      </div>

      {lesson.subject === "math" && <MathActivities />}
      {lesson.subject === "science" && <ScienceActivities />}
      {lesson.subject === "english" && <EnglishActivities />}
      {lesson.subject === "ap" && <APActivities />}
      {(lesson.subject === "ict" || lesson.subject === "tle") && <ICTActivities />}
      {!["math", "science", "english", "ap", "ict", "tle"].includes(lesson.subject) && <EnglishActivities />}

      <ProgressTracker value={progress} label="Lab quiz accuracy" />
      <QuizComponent
        item={quizItem}
        onAnswered={(correct) => {
          setQuizAttempts((count) => count + 1);
          if (correct) setQuizCorrect((count) => count + 1);
        }}
      />
    </div>
  );
}
