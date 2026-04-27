import { Calculator, FlaskConical, BookText, Globe, Palette, Wrench, Monitor } from "lucide-react";

export const grades = [
  { id: 7, label: "Grade 7", description: "First Year Junior High School", color: "from-blue-500 to-blue-600" },
  { id: 8, label: "Grade 8", description: "Second Year Junior High School", color: "from-emerald-500 to-emerald-600" },
  { id: 9, label: "Grade 9", description: "Third Year Junior High School", color: "from-amber-500 to-amber-600" },
  { id: 10, label: "Grade 10", description: "Fourth Year Junior High School", color: "from-purple-500 to-purple-600" },
];

export const subjects = [
  { id: "math", name: "Mathematics", icon: Calculator, color: "from-blue-500 to-blue-600" },
  { id: "science", name: "Science", icon: FlaskConical, color: "from-emerald-500 to-emerald-600" },
  { id: "english", name: "English", icon: BookText, color: "from-amber-500 to-amber-600" },
  { id: "filipino", name: "Filipino", icon: Globe, color: "from-red-500 to-red-600" },
  { id: "ap", name: "Araling Panlipunan", icon: Globe, color: "from-indigo-500 to-indigo-600" },
  { id: "ict", name: "ICT", icon: Monitor, color: "from-cyan-500 to-cyan-600" },
  { id: "mapeh", name: "MAPEH", icon: Palette, color: "from-pink-500 to-pink-600" },
  { id: "tle", name: "TLE", icon: Wrench, color: "from-orange-500 to-orange-600" },
];

export interface Lesson {
  id: number;
  grade: number;
  subject: string;
  order?: number;
  title: string;
  description: string;
  duration: string;
  durationMinutes?: number;
  type: "video" | "interactive" | "animation";
  challengeHints?: string[];
  misconceptions?: string[];
  /** DepEd LR-Portal embedded PDF filename this lesson follows */
  sourcePdf?: string;
  /** One-line focus used for quizzes and checkpoints */
  learningFocus?: string;
  /** MCQ aligned to this lesson’s teaching steps (not portal navigation) */
  contentQuiz?: {
    question: string;
    options: string[];
    correct: number;
    explanation: string;
  };
  steps: LessonStep[];
}

export interface LessonStep {
  title: string;
  content: string;
  icon: string;
  resourceUrl?: string;
  learningObjective?: string;
  keywords?: string[];
  difficulty?: "easy" | "medium" | "hard";
  examplePrompt?: string;
}

export const lessons: Lesson[] = [
  // Grade 7 Math
  { id: 1, grade: 7, subject: "math", title: "Introduction to Algebra", description: "Learn variables, expressions, and equations", duration: "15 min", type: "video",
    steps: [
      { title: "What is Algebra?", content: "Algebra is a branch of mathematics that uses symbols and letters (called variables) to represent numbers and quantities in formulas and equations.", icon: "variable" },
      { title: "Variables", content: "A variable is a symbol (usually a letter like x or y) that represents an unknown value. Think of it as a placeholder for a number we need to find.", icon: "x-square" },
      { title: "Expressions", content: "An algebraic expression combines numbers, variables, and operations. For example: 3x + 5 is an expression where x is the variable.", icon: "sparkles" },
      { title: "Equations", content: "An equation states that two expressions are equal, using the = sign. For example: 2x + 3 = 11.", icon: "equal" },
      { title: "Solving Equations", content: "To solve 2x + 3 = 11:\n1. Subtract 3 from both sides: 2x = 8\n2. Divide both sides by 2: x = 4", icon: "target" },
    ] },
  { id: 2, grade: 7, subject: "math", title: "Linear Equations", description: "Solving one-variable linear equations", duration: "20 min", type: "interactive",
    steps: [
      { title: "What is a Linear Equation?", content: "A linear equation is an equation where the highest power of the variable is 1. Example: 3x + 2 = 14.", icon: "trending-up" },
      { title: "Isolating the Variable", content: "To solve, we isolate the variable on one side by performing inverse operations on both sides.", icon: "move" },
      { title: "Practice", content: "Solve: 5x - 10 = 25\nStep 1: Add 10 → 5x = 35\nStep 2: Divide by 5 → x = 7", icon: "check-circle" },
    ] },
  { id: 3, grade: 7, subject: "math", title: "Graphing Linear Functions", description: "Plotting and interpreting linear graphs", duration: "18 min", type: "video",
    steps: [
      { title: "The Coordinate Plane", content: "A coordinate plane has two axes: x (horizontal) and y (vertical). Points are plotted as (x, y).", icon: "grid" },
      { title: "Plotting Points", content: "To plot (3, 2): move 3 units right on x-axis, then 2 units up on y-axis.", icon: "crosshair" },
    ] },
  // Grade 7 Science
  { id: 4, grade: 7, subject: "science", title: "Cells and Their Parts", description: "Understanding cell structure and organelles", duration: "22 min", type: "animation",
    steps: [
      { title: "What is a Cell?", content: "A cell is the basic structural and functional unit of all living organisms. It is the smallest unit of life.", icon: "circle" },
      { title: "Cell Membrane", content: "The cell membrane is a thin, flexible barrier that surrounds the cell and controls what enters and exits.", icon: "shield" },
      { title: "Nucleus", content: "The nucleus is the control center of the cell. It contains DNA and directs cell activities.", icon: "brain" },
      { title: "Mitochondria", content: "Mitochondria are the 'powerhouse' of the cell. They produce energy (ATP) through cellular respiration.", icon: "zap" },
    ] },
  { id: 5, grade: 7, subject: "science", title: "Photosynthesis Process", description: "How plants convert light to energy", duration: "25 min", type: "interactive",
    steps: [
      { title: "Overview", content: "Photosynthesis is the process by which plants use sunlight, water, and CO₂ to produce glucose and oxygen.", icon: "sun" },
      { title: "Light Reactions", content: "Light reactions occur in the thylakoid membranes. Chlorophyll absorbs light energy to split water molecules.", icon: "lightbulb" },
    ] },
  // Grade 7 English
  { id: 6, grade: 7, subject: "english", title: "Parts of Speech", description: "Nouns, verbs, adjectives, and more", duration: "12 min", type: "video",
    steps: [
      { title: "Nouns", content: "A noun is a word that represents a person, place, thing, or idea. Examples: teacher, school, book, happiness.", icon: "tag" },
      { title: "Verbs", content: "A verb expresses an action, state, or occurrence. Examples: run, think, is, become.", icon: "play" },
      { title: "Adjectives", content: "An adjective describes or modifies a noun. Examples: tall, beautiful, three, this.", icon: "palette" },
    ] },
  // Grade 8 Math
  { id: 7, grade: 8, subject: "math", title: "Systems of Linear Equations", description: "Solving two-variable systems", duration: "25 min", type: "interactive",
    steps: [
      { title: "Introduction", content: "A system of linear equations consists of two or more equations with the same variables.", icon: "layers" },
      { title: "Substitution Method", content: "Solve one equation for a variable and substitute into the other equation.", icon: "replace" },
    ] },
  // Grade 8 Science
  { id: 8, grade: 8, subject: "science", title: "Forces and Motion", description: "Newton's Laws of Motion explained", duration: "20 min", type: "animation",
    steps: [
      { title: "Newton's First Law", content: "An object at rest stays at rest, and an object in motion stays in motion unless acted upon by an external force.", icon: "circle-stop" },
      { title: "Newton's Second Law", content: "Force equals mass times acceleration (F = ma). The greater the force, the greater the acceleration.", icon: "arrow-right" },
      { title: "Newton's Third Law", content: "For every action, there is an equal and opposite reaction.", icon: "arrows-left-right" },
    ] },
  // Grade 9
  { id: 9, grade: 9, subject: "math", title: "Quadratic Equations", description: "Understanding parabolas and solving quadratics", duration: "30 min", type: "video",
    steps: [
      { title: "Standard Form", content: "A quadratic equation has the form ax² + bx + c = 0, where a ≠ 0.", icon: "square" },
      { title: "Quadratic Formula", content: "x = (-b ± √(b²-4ac)) / 2a — this formula solves any quadratic equation.", icon: "calculator" },
    ] },
  // Grade 10
  { id: 10, grade: 10, subject: "math", title: "Polynomial Functions", description: "Analyzing higher-degree polynomials", duration: "28 min", type: "video",
    steps: [
      { title: "What are Polynomials?", content: "A polynomial is an expression consisting of variables and coefficients, combined using addition, subtraction, and multiplication.", icon: "sigma" },
      { title: "Degree of a Polynomial", content: "The degree is the highest power of the variable. It determines the shape and behavior of the graph.", icon: "trending-up" },
    ] },
  { id: 11, grade: 10, subject: "science", title: "Chemical Reactions", description: "Types of chemical reactions and balancing equations", duration: "22 min", type: "animation",
    steps: [
      { title: "Types of Reactions", content: "There are five main types: synthesis, decomposition, single replacement, double replacement, and combustion.", icon: "flask-conical" },
      { title: "Balancing Equations", content: "The law of conservation of mass requires equal atoms on both sides of a chemical equation.", icon: "scale" },
    ] },
  // Added content pack - more subjects and activities
  { id: 12, grade: 7, subject: "math", title: "Integers and Number Line", description: "Positive/negative numbers and ordering", duration: "16 min", type: "interactive",
    steps: [
      { title: "Integers Around Us", content: "Integers include whole numbers, their opposites, and zero. Examples: -3, 0, 5.", icon: "hash" },
      { title: "Number Line Movement", content: "Moving right increases value. Moving left decreases value.", icon: "move-horizontal" },
      { title: "Comparing Integers", content: "A number farther right is always greater.", icon: "arrow-right-left" },
    ] },
  { id: 13, grade: 7, subject: "science", title: "States of Matter", description: "Solid, liquid, gas and particle behavior", duration: "19 min", type: "animation",
    steps: [
      { title: "Three Common States", content: "Matter commonly appears as solid, liquid, or gas based on particle movement and spacing.", icon: "layers" },
      { title: "Particle Model", content: "In solids, particles vibrate in place; in liquids, they slide; in gases, they move freely.", icon: "atom" },
      { title: "Changes of State", content: "Melting, freezing, evaporation, and condensation happen when heat changes particle energy.", icon: "thermometer" },
    ] },
  { id: 14, grade: 7, subject: "english", title: "Sentence Structure Basics", description: "Simple, compound, and complex sentences", duration: "14 min", type: "interactive",
    steps: [
      { title: "Simple Sentence", content: "A simple sentence has one independent clause. Example: The class started early.", icon: "pen-line" },
      { title: "Compound Sentence", content: "A compound sentence joins two independent clauses using conjunctions.", icon: "link" },
      { title: "Complex Sentence", content: "A complex sentence has one independent and one dependent clause.", icon: "git-branch" },
    ] },
  { id: 15, grade: 7, subject: "filipino", title: "Pangngalan at Panghalip", description: "Pagkilala at wastong gamit", duration: "13 min", type: "video",
    steps: [
      { title: "Pangngalan", content: "Ang pangngalan ay ngalan ng tao, hayop, bagay, pook, o pangyayari.", icon: "book-text" },
      { title: "Panghalip", content: "Ang panghalip ay salitang pamalit sa pangngalan upang maiwasan ang pag-uulit.", icon: "replace" },
      { title: "Paggamit sa Pangungusap", content: "Piliin ang tamang pangngalan at panghalip ayon sa konteksto.", icon: "check" },
    ] },
  { id: 16, grade: 7, subject: "ap", title: "Kasaysayan ng Pilipinas: Panimula", description: "Mahahalagang yugto sa kasaysayan", duration: "17 min", type: "video",
    steps: [
      { title: "Sinaunang Pamayanan", content: "May maunlad nang pamayanan sa Pilipinas bago pa man dumating ang mga dayuhan.", icon: "landmark" },
      { title: "Panahon ng Kolonyalismo", content: "Naging malaking bahagi ng kasaysayan ang pananakop ng Espanya at Estados Unidos.", icon: "flag" },
      { title: "Pagkamakabansa", content: "Umusbong ang nasyonalismo sa pamamagitan ng mga kilusan at bayani.", icon: "shield" },
    ] },
  { id: 17, grade: 7, subject: "ict", title: "Digital Citizenship", description: "Safe, ethical, and responsible online behavior", duration: "15 min", type: "interactive",
    steps: [
      { title: "Online Identity", content: "Everything you post contributes to your digital footprint.", icon: "user-round" },
      { title: "Privacy and Security", content: "Use strong passwords and never share sensitive information publicly.", icon: "lock" },
      { title: "Respectful Communication", content: "Practice netiquette and verify information before sharing.", icon: "message-square" },
    ] },
  { id: 18, grade: 7, subject: "mapeh", title: "Elements of Music", description: "Rhythm, melody, harmony, and dynamics", duration: "18 min", type: "animation",
    steps: [
      { title: "Rhythm", content: "Rhythm is the pattern of beats in music.", icon: "audio-lines" },
      { title: "Melody", content: "Melody is the tune we recognize and remember.", icon: "music" },
      { title: "Dynamics", content: "Dynamics describe loud and soft changes in musical performance.", icon: "volume-2" },
    ] },
  { id: 19, grade: 7, subject: "tle", title: "Kitchen Safety Fundamentals", description: "Safe handling and proper hygiene", duration: "16 min", type: "interactive",
    steps: [
      { title: "Workstation Safety", content: "Keep your station clean, dry, and organized to prevent accidents.", icon: "shield-check" },
      { title: "Tool Handling", content: "Use knives and appliances correctly; never rush while preparing food.", icon: "wrench" },
      { title: "Food Hygiene", content: "Wash hands and ingredients properly before food preparation.", icon: "droplets" },
    ] },
  { id: 20, grade: 8, subject: "english", title: "Figures of Speech", description: "Metaphor, simile, personification, and more", duration: "18 min", type: "video",
    steps: [
      { title: "Simile and Metaphor", content: "Similes compare using 'like' or 'as'; metaphors compare directly.", icon: "speech" },
      { title: "Personification", content: "Personification gives human traits to non-human things.", icon: "user" },
      { title: "Application", content: "Identify figures of speech in short literary passages.", icon: "highlighter" },
    ] },
  { id: 21, grade: 8, subject: "ict", title: "Intro to Spreadsheets", description: "Rows, columns, formulas, and charts", duration: "21 min", type: "interactive",
    steps: [
      { title: "Workbook Basics", content: "Spreadsheets organize data into rows and columns.", icon: "table" },
      { title: "Formulas", content: "Use formulas like =SUM(A1:A5) to automate calculations.", icon: "calculator" },
      { title: "Charts", content: "Charts help visualize trends and compare values quickly.", icon: "bar-chart-3" },
    ] },
  { id: 22, grade: 9, subject: "science", title: "Cell Division: Mitosis", description: "Stages and significance of mitosis", duration: "24 min", type: "animation",
    steps: [
      { title: "Cell Cycle Overview", content: "Cells grow, replicate DNA, and divide in a repeating cycle.", icon: "refresh-cw" },
      { title: "Mitosis Stages", content: "Prophase, metaphase, anaphase, and telophase happen in sequence.", icon: "workflow" },
      { title: "Why It Matters", content: "Mitosis supports growth, repair, and replacement of cells.", icon: "heart-pulse" },
    ] },
  { id: 23, grade: 10, subject: "english", title: "Argumentative Writing", description: "Claims, evidence, and counterarguments", duration: "26 min", type: "interactive",
    steps: [
      { title: "Strong Claim", content: "An argumentative essay starts with a clear and debatable claim.", icon: "megaphone" },
      { title: "Evidence", content: "Use credible sources, facts, and examples to support your argument.", icon: "file-check" },
      { title: "Counterargument", content: "Address opposing views and explain why your claim remains valid.", icon: "scale" },
    ] },
  { id: 24, grade: 10, subject: "ict", title: "Web Design Foundations", description: "Structure, style, and user experience", duration: "23 min", type: "video",
    steps: [
      { title: "HTML Structure", content: "HTML organizes content into semantic elements like headers, sections, and articles.", icon: "code" },
      { title: "CSS Styling", content: "CSS controls layout, typography, colors, and responsive behavior.", icon: "palette" },
      { title: "UX Basics", content: "Good UI design is clear, accessible, and focused on user goals.", icon: "mouse-pointer-click" },
    ] },
  { id: 25, grade: 8, subject: "math", title: "Slope and Rate of Change", description: "Understanding slope from tables and graphs", duration: "19 min", type: "interactive",
    steps: [
      { title: "Meaning of Slope", content: "Slope measures how steep a line is and represents rate of change.", icon: "trending-up" },
      { title: "Slope Formula", content: "Use m = (y2 - y1)/(x2 - x1) for two points on a line.", icon: "calculator" },
      { title: "Interpreting Results", content: "Positive, negative, zero, and undefined slopes describe line behavior.", icon: "line-chart" },
    ] },
  { id: 26, grade: 9, subject: "science", title: "Ecosystems and Energy Flow", description: "Food chains, food webs, and trophic levels", duration: "21 min", type: "animation",
    steps: [
      { title: "Producers and Consumers", content: "Producers make food while consumers rely on other organisms for energy.", icon: "leaf" },
      { title: "Food Chain", content: "A food chain shows one path of energy transfer from one organism to another.", icon: "link" },
      { title: "Food Web", content: "Food webs connect multiple food chains within the same ecosystem.", icon: "network" },
    ] },
  { id: 27, grade: 8, subject: "english", title: "Context Clues in Reading", description: "Inferring meanings of unfamiliar words", duration: "17 min", type: "interactive",
    steps: [
      { title: "Definition Clues", content: "Writers may define unfamiliar words directly in the sentence.", icon: "book-open" },
      { title: "Example Clues", content: "Examples around a word help reveal its meaning.", icon: "list-checks" },
      { title: "Inference", content: "Readers combine clues and prior knowledge to infer meaning.", icon: "search" },
    ] },
  { id: 28, grade: 8, subject: "filipino", title: "Sanaysay at Layunin Nito", description: "Uri at bahagi ng sanaysay", duration: "16 min", type: "video",
    steps: [
      { title: "Kahulugan ng Sanaysay", content: "Ang sanaysay ay akdang nagpapahayag ng opinyon, kaalaman, o karanasan.", icon: "file-text" },
      { title: "Bahagi ng Sanaysay", content: "May panimula, katawan, at wakas ang isang maayos na sanaysay.", icon: "columns-3" },
      { title: "Wastong Organisasyon", content: "Ang malinaw na pagkakasunod-sunod ng ideya ay mahalaga sa pagsulat.", icon: "align-left" },
    ] },
  { id: 29, grade: 8, subject: "ap", title: "Heograpiya ng Asya", description: "Lokasyon, klima, at likas na yaman", duration: "20 min", type: "animation",
    steps: [
      { title: "Mga Rehiyon ng Asya", content: "Binubuo ang Asya ng iba-ibang rehiyon na may natatanging katangian.", icon: "map" },
      { title: "Klima at Panahon", content: "Naaapektuhan ng lokasyon at anyong lupa ang klima ng mga bansa sa Asya.", icon: "cloud-sun" },
      { title: "Likas na Yaman", content: "Mahalagang mapangalagaan ang likas na yaman para sa sustenableng kaunlaran.", icon: "mountain" },
    ] },
  { id: 30, grade: 9, subject: "ict", title: "Data Privacy and Cybersecurity", description: "Protecting personal data online", duration: "18 min", type: "interactive",
    steps: [
      { title: "Personal Data", content: "Personal data includes names, addresses, account credentials, and IDs.", icon: "shield" },
      { title: "Common Threats", content: "Phishing, malware, and weak passwords are common cybersecurity risks.", icon: "alert-triangle" },
      { title: "Protection Habits", content: "Use multi-factor authentication and strong, unique passwords.", icon: "lock-keyhole" },
    ] },
  { id: 31, grade: 8, subject: "mapeh", title: "Principles of Art", description: "Balance, contrast, rhythm, and emphasis", duration: "18 min", type: "animation",
    steps: [
      { title: "Balance", content: "Balance gives visual stability in an artwork.", icon: "scale" },
      { title: "Contrast", content: "Contrast highlights differences in color, texture, and size.", icon: "circle-dot" },
      { title: "Emphasis", content: "Emphasis draws the viewer's attention to a focal point.", icon: "focus" },
    ] },
  { id: 32, grade: 8, subject: "tle", title: "Entrepreneurship Basics", description: "Planning simple products and services", duration: "19 min", type: "interactive",
    steps: [
      { title: "Needs and Wants", content: "Good products solve real needs of a target market.", icon: "target" },
      { title: "Cost and Pricing", content: "Pricing considers production cost, effort, and market value.", icon: "coins" },
      { title: "Simple Business Plan", content: "A basic plan includes goal, product idea, and selling strategy.", icon: "clipboard-list" },
    ] },
  { id: 33, grade: 9, subject: "math", title: "Factoring Quadratics", description: "Methods for factoring trinomials", duration: "23 min", type: "interactive",
    steps: [
      { title: "Common Factors", content: "Start by checking if a common factor can be factored out.", icon: "scissors" },
      { title: "Trinomial Pattern", content: "For x² + bx + c, find two numbers that multiply to c and add to b.", icon: "search-check" },
      { title: "Verification", content: "Expand your factors to verify the original expression.", icon: "check" },
    ] },
  { id: 34, grade: 9, subject: "english", title: "Literary Devices in Poetry", description: "Imagery, symbolism, and tone", duration: "20 min", type: "video",
    steps: [
      { title: "Imagery", content: "Imagery appeals to senses and creates vivid mental pictures.", icon: "image" },
      { title: "Symbolism", content: "Symbols represent deeper meanings beyond literal interpretation.", icon: "gem" },
      { title: "Tone", content: "Tone expresses the speaker's attitude toward the subject.", icon: "mic" },
    ] },
  { id: 35, grade: 9, subject: "filipino", title: "Pagsusuri ng Tula", description: "Elemento at mensahe ng tula", duration: "18 min", type: "interactive",
    steps: [
      { title: "Sukat at Tugma", content: "Tinitingnan ang bilang ng pantig at pagkakatugma ng huling tunog.", icon: "music-2" },
      { title: "Talinghaga", content: "Ang talinghaga ay masining na pahayag na may malalim na kahulugan.", icon: "sparkles" },
      { title: "Pagpapakahulugan", content: "Sinusuri ang mensahe at damdaming ipinahihiwatig ng tula.", icon: "book-open-check" },
    ] },
  { id: 36, grade: 9, subject: "ap", title: "Ekonomiks: Pangunahing Konsepto", description: "Kakulangan, pangangailangan, at kagustuhan", duration: "21 min", type: "video",
    steps: [
      { title: "Kakulangan", content: "Limitado ang pinagkukunang-yaman kaya mahalaga ang tamang pagpili.", icon: "triangle-alert" },
      { title: "Pangangailangan at Kagustuhan", content: "Magkaiba ang pangunahing pangangailangan at kagustuhan.", icon: "list" },
      { title: "Pagdedesisyon", content: "Ang opportunity cost ay ang kapalit ng napiling alternatibo.", icon: "git-compare" },
    ] },
  { id: 37, grade: 9, subject: "ict", title: "Intro to Programming Logic", description: "Sequence, conditionals, and loops", duration: "22 min", type: "interactive",
    steps: [
      { title: "Sequence", content: "Programs run instructions in order unless redirected by logic.", icon: "arrow-down-01" },
      { title: "Conditionals", content: "If-else statements make decisions based on conditions.", icon: "split" },
      { title: "Loops", content: "Loops repeat instructions until a condition changes.", icon: "repeat" },
    ] },
  { id: 38, grade: 9, subject: "mapeh", title: "Physical Fitness Principles", description: "Endurance, strength, and flexibility", duration: "17 min", type: "animation",
    steps: [
      { title: "Cardiovascular Endurance", content: "Improves heart and lung efficiency during activity.", icon: "heart" },
      { title: "Muscular Strength", content: "Strength training supports posture and movement.", icon: "dumbbell" },
      { title: "Flexibility", content: "Stretching improves range of motion and prevents injury.", icon: "person-standing" },
    ] },
  { id: 39, grade: 9, subject: "tle", title: "Basic Electrical Safety", description: "Safe use of tools and home circuits", duration: "20 min", type: "interactive",
    steps: [
      { title: "Electrical Hazards", content: "Damaged cords and wet conditions increase shock risk.", icon: "zap-off" },
      { title: "Protective Measures", content: "Use insulated tools and switch off power before repairs.", icon: "shield-plus" },
      { title: "Circuit Basics", content: "Understand live, neutral, and grounding for safety.", icon: "circuit-board" },
    ] },
  { id: 40, grade: 10, subject: "math", title: "Rational Functions", description: "Domain, asymptotes, and graph behavior", duration: "24 min", type: "video",
    steps: [
      { title: "Form of Rational Functions", content: "Rational functions are ratios of polynomials.", icon: "fraction" },
      { title: "Domain Restrictions", content: "Values making denominator zero are excluded from the domain.", icon: "ban" },
      { title: "Asymptotes", content: "Vertical and horizontal asymptotes describe end behavior.", icon: "chart-no-axes-combined" },
    ] },
  { id: 41, grade: 10, subject: "science", title: "Earth's Tectonic Processes", description: "Plate movement and geologic activity", duration: "23 min", type: "animation",
    steps: [
      { title: "Plate Boundaries", content: "Convergent, divergent, and transform boundaries create different effects.", icon: "move-3d" },
      { title: "Earthquakes", content: "Stress release along faults causes earthquake events.", icon: "waves" },
      { title: "Volcanic Activity", content: "Magma movement and pressure drive volcanic eruptions.", icon: "flame" },
    ] },
  { id: 42, grade: 10, subject: "filipino", title: "Pagsulat ng Editoryal", description: "Paninindigan at lohikal na pangangatwiran", duration: "22 min", type: "interactive",
    steps: [
      { title: "Pangunahing Isyu", content: "Pumili ng napapanahong paksa na may malinaw na paninindigan.", icon: "newspaper" },
      { title: "Ebidensiya", content: "Gumamit ng datos at mapagkakatiwalaang sanggunian.", icon: "files" },
      { title: "Malinaw na Kongklusyon", content: "Tapusin ang editoryal sa konkretong panawagan o rekomendasyon.", icon: "flag-triangle-right" },
    ] },
  { id: 43, grade: 10, subject: "ap", title: "Globalisasyon at Lipunan", description: "Epekto sa ekonomiya at kultura", duration: "21 min", type: "video",
    steps: [
      { title: "Kahulugan ng Globalisasyon", content: "Mas mabilis ang ugnayan ng mga bansa sa kalakalan at impormasyon.", icon: "globe" },
      { title: "Benepisyo", content: "Nagbubukas ito ng oportunidad sa trabaho at teknolohiya.", icon: "briefcase-business" },
      { title: "Hamon", content: "May hamon sa lokal na industriya at pagkakakilanlang kultural.", icon: "triangle-alert" },
    ] },
  { id: 44, grade: 10, subject: "ict", title: "Networking Fundamentals", description: "LAN, WAN, and internet basics", duration: "24 min", type: "interactive",
    steps: [
      { title: "Network Types", content: "LAN covers small areas while WAN spans large geographic regions.", icon: "network" },
      { title: "IP Address Basics", content: "Devices use IP addresses to identify and communicate on networks.", icon: "binary" },
      { title: "Routers and Switches", content: "Routers direct traffic between networks; switches connect local devices.", icon: "router" },
    ] },
  { id: 45, grade: 10, subject: "mapeh", title: "Contemporary Philippine Arts", description: "Themes, media, and expression", duration: "19 min", type: "animation",
    steps: [
      { title: "Modern Themes", content: "Contemporary art reflects social issues and personal identity.", icon: "palette" },
      { title: "Mixed Media", content: "Artists combine materials and digital tools for expression.", icon: "paintbrush" },
      { title: "Critique and Appreciation", content: "Art criticism involves observing, analyzing, and interpreting works.", icon: "message-circle" },
    ] },
  { id: 46, grade: 10, subject: "tle", title: "Small Business Operations", description: "Inventory, customer service, and records", duration: "22 min", type: "interactive",
    steps: [
      { title: "Inventory Tracking", content: "Accurate stock monitoring prevents shortages and waste.", icon: "boxes" },
      { title: "Customer Service", content: "Good service builds trust and repeat customers.", icon: "users" },
      { title: "Basic Bookkeeping", content: "Simple records of income and expenses support decisions.", icon: "notebook-tabs" },
    ] },
  { id: 47, grade: 8, subject: "science", title: "Weather Systems", description: "Air masses, fronts, and storms", duration: "20 min", type: "animation",
    steps: [
      { title: "Air Masses", content: "Air masses carry specific temperature and humidity characteristics.", icon: "wind" },
      { title: "Fronts", content: "When air masses meet, fronts form and influence weather changes.", icon: "cloud" },
      { title: "Storm Formation", content: "Temperature differences and pressure shifts can trigger storms.", icon: "cloud-lightning" },
    ] },
  { id: 48, grade: 9, subject: "english", title: "Research Writing Basics", description: "Question, sources, and citation", duration: "22 min", type: "interactive",
    steps: [
      { title: "Research Question", content: "A focused question guides the direction of your research.", icon: "help-circle" },
      { title: "Source Evaluation", content: "Check author credibility, publication date, and evidence quality.", icon: "shield-check" },
      { title: "Citation Ethics", content: "Proper citation avoids plagiarism and credits original ideas.", icon: "quote" },
    ] },
  { id: 49, grade: 8, subject: "science", order: 4, title: "Waves and Sound", description: "How waves travel and produce sound", duration: "21 min", durationMinutes: 21, type: "animation",
    challengeHints: ["frequency", "amplitude", "vibration"],
    misconceptions: ["Sound travels in empty space", "Higher amplitude means higher pitch"],
    steps: [
      { title: "What is a Wave?", content: "A wave is a disturbance that transfers energy from one place to another.", icon: "waves", learningObjective: "Define a wave and identify what moves.", keywords: ["energy transfer", "disturbance"] },
      { title: "Wave Parts", content: "Crest, trough, wavelength, and amplitude are key parts used to describe a wave.", icon: "activity", difficulty: "easy" },
      { title: "Frequency and Pitch", content: "Higher frequency creates higher pitch in sounds we hear.", icon: "audio-lines", learningObjective: "Connect frequency to pitch.", keywords: ["frequency", "pitch"] },
      { title: "How Sound Travels", content: "Sound needs a medium such as air, water, or solids because particles must vibrate.", icon: "volume-2", difficulty: "medium" },
      { title: "Everyday Application", content: "Musical instruments produce sound by making strings, membranes, or air columns vibrate.", icon: "music-4", examplePrompt: "Name one instrument and explain how it vibrates." },
    ] },
  { id: 50, grade: 8, subject: "filipino", order: 2, title: "Wastong Gamit ng Pang-uri", description: "Paglalarawan at antas ng pang-uri", duration: "18 min", durationMinutes: 18, type: "interactive",
    challengeHints: ["lantay", "pahambing", "pasukdol"],
    misconceptions: ["Pang-uri and pang-abay are always interchangeable"],
    steps: [
      { title: "Ano ang Pang-uri?", content: "Ang pang-uri ay salitang naglalarawan sa pangngalan o panghalip.", icon: "pen-tool", learningObjective: "Matukoy ang pang-uri sa pangungusap." },
      { title: "Lantay", content: "Ang lantay ay karaniwang anyo ng pang-uri na walang paghahambing.", icon: "minus", keywords: ["lantay"] },
      { title: "Pahambing", content: "Sa pahambing, inihahambing ang katangian ng dalawa o higit pang bagay.", icon: "git-compare-arrows", difficulty: "medium" },
      { title: "Pasukdol", content: "Ang pasukdol ang pinakamataas na antas ng paglalarawan.", icon: "arrow-up", keywords: ["pinaka"] },
      { title: "Pagsasanay sa Konteksto", content: "Piliin ang angkop na antas ng pang-uri batay sa sitwasyon ng pangungusap.", icon: "check-check", examplePrompt: "Gumawa ng 2 pangungusap na may pahambing." },
    ] },
  { id: 51, grade: 8, subject: "ap", order: 2, title: "Kabihasnang Asyano", description: "Ambag ng sinaunang kabihasnan sa kasalukuyan", duration: "22 min", durationMinutes: 22, type: "video",
    challengeHints: ["kabihasnan", "ambag", "pamana"],
    misconceptions: ["Iisang kabihasnan lamang ang umunlad sa Asya"],
    steps: [
      { title: "Kahulugan ng Kabihasnan", content: "Ang kabihasnan ay organisadong pamumuhay na may sistema ng pamahalaan, kultura, at ekonomiya.", icon: "building-2" },
      { title: "Mga Sinaunang Sentro", content: "Umunlad ang mahahalagang kabihasnan sa lambak-ilog at estratehikong lokasyon.", icon: "map-pinned", keywords: ["lambak-ilog"] },
      { title: "Ambag sa Pagsulat", content: "Nakatulong ang pag-unlad ng sistema ng pagsulat sa pagpreserba ng kaalaman.", icon: "scroll-text", difficulty: "easy" },
      { title: "Ambag sa Pamahalaan", content: "Ang ilang sinaunang sistema ng pamahalaan ay naging batayan ng modernong institusyon.", icon: "landmark" },
      { title: "Pamana sa Kasalukuyan", content: "Marami sa ating kaugalian, teknolohiya, at batas ay may ugat sa sinaunang kabihasnan.", icon: "history", examplePrompt: "Magbigay ng isang pamana at epekto nito ngayon." },
    ] },
  { id: 52, grade: 8, subject: "mapeh", order: 3, title: "Fundamental Dance Patterns", description: "Timing, coordination, and expression", duration: "17 min", durationMinutes: 17, type: "animation",
    challengeHints: ["timing", "coordination", "formation"],
    misconceptions: ["Dance is only memorizing steps"],
    steps: [
      { title: "Body Alignment", content: "Proper posture improves balance, safety, and movement quality.", icon: "person-standing" },
      { title: "Counting and Timing", content: "Dancers use counts to stay synchronized with rhythm and music.", icon: "timer-reset", learningObjective: "Follow 8-count sequences." },
      { title: "Basic Travel Steps", content: "Traveling steps move dancers smoothly across formation space.", icon: "move-right" },
      { title: "Coordination Practice", content: "Upper and lower body coordination improves with repetition and tempo control.", icon: "activity" },
      { title: "Performance Reflection", content: "Self-evaluation helps identify strengths and areas for refinement.", icon: "clipboard-check" },
    ] },
  { id: 53, grade: 8, subject: "tle", order: 3, title: "Household Budget Planning", description: "Income, expenses, and smart spending", duration: "20 min", durationMinutes: 20, type: "interactive",
    challengeHints: ["fixed expenses", "variable expenses", "savings"],
    misconceptions: ["Savings happen only if money is left over"],
    steps: [
      { title: "Budget Basics", content: "A budget is a plan for how income will be used each month.", icon: "wallet" },
      { title: "Classifying Expenses", content: "Fixed expenses stay similar monthly while variable expenses change.", icon: "list-filter" },
      { title: "Needs vs Wants", content: "Prioritizing needs supports financial stability and prevents overspending.", icon: "target" },
      { title: "Saving Strategy", content: "Set a savings amount first before allocating optional spending.", icon: "piggy-bank", difficulty: "medium" },
      { title: "Budget Simulation", content: "Use a sample income and allocate values to expenses and savings.", icon: "calculator", examplePrompt: "Create a basic budget for PHP 5,000." },
    ] },
  { id: 54, grade: 9, subject: "filipino", order: 2, title: "Tekstong Persuweysib", description: "Paggamit ng panghihikayat at ebidensya", duration: "19 min", durationMinutes: 19, type: "interactive",
    challengeHints: ["claim", "ebidensya", "target na mambabasa"],
    misconceptions: ["Persuweysib writing is pure opinion"],
    steps: [
      { title: "Layunin ng Persuweysib", content: "Layunin nitong mahikayat ang mambabasa na tanggapin ang paninindigan.", icon: "megaphone" },
      { title: "Malinaw na Pahayag", content: "Dapat tiyak at lohikal ang pangunahing pahayag o claim.", icon: "file-signature" },
      { title: "Ebidensiyang Suporta", content: "Gumamit ng datos, halimbawa, at mapagkakatiwalaang sanggunian.", icon: "files", difficulty: "medium" },
      { title: "Pagkilala sa Mambabasa", content: "Iayon ang tono at halimbawa sa target na mambabasa.", icon: "users-round" },
      { title: "Pangwakas na Panawagan", content: "Tapusin ang teksto sa konkretong aksyong nais mong gawin ng mambabasa.", icon: "flag" },
    ] },
  { id: 55, grade: 9, subject: "ap", order: 3, title: "Pambansang Kita at Produksiyon", description: "Pagsukat ng ekonomiya sa antas pambansa", duration: "23 min", durationMinutes: 23, type: "video",
    challengeHints: ["GDP", "GNP", "sektor"],
    misconceptions: ["Mas mataas GDP means equal wealth distribution"],
    steps: [
      { title: "Ano ang Pambansang Kita?", content: "Pambansang kita ang kabuuang halagang nalilikha ng ekonomiya sa isang takdang panahon.", icon: "coins" },
      { title: "GDP at GNP", content: "GDP ay produksyon sa loob ng bansa; GNP ay kita ng mamamayan saan mang lugar.", icon: "chart-bar" },
      { title: "Sektor ng Ekonomiya", content: "Agrikultura, industriya, at serbisyo ang pangunahing sektor ng produksyon.", icon: "factory" },
      { title: "Interpretasyon ng Datos", content: "Ang pagtaas ng pambansang kita ay dapat suriin kasama ang kalidad ng pamumuhay.", icon: "line-chart" },
      { title: "Pag-uugnay sa Mamamayan", content: "Mahalaga ang pambansang kita sa pagpaplano ng trabaho, buwis, at serbisyo publiko.", icon: "users" },
    ] },
  { id: 56, grade: 9, subject: "mapeh", order: 3, title: "Nutrition and Wellness", description: "Balanced diet and healthy lifestyle decisions", duration: "18 min", durationMinutes: 18, type: "animation",
    challengeHints: ["macronutrients", "hydration", "wellness habits"],
    misconceptions: ["Skipping meals helps long-term health"],
    steps: [
      { title: "Balanced Nutrition", content: "A balanced meal includes carbohydrates, proteins, healthy fats, vitamins, and minerals.", icon: "utensils-crossed" },
      { title: "Hydration", content: "Adequate water intake supports metabolism, concentration, and physical performance.", icon: "droplets" },
      { title: "Daily Activity", content: "Regular movement improves cardiovascular health, mood, and stamina.", icon: "footprints" },
      { title: "Sleep and Recovery", content: "Quality sleep is essential for memory, growth, and immune function.", icon: "moon-star" },
      { title: "Habit Tracker", content: "Monitoring meals, activity, and sleep helps build consistent wellness routines.", icon: "notebook-pen" },
    ] },
  { id: 57, grade: 9, subject: "tle", order: 3, title: "Project Planning in TLE", description: "Planning outputs from idea to execution", duration: "21 min", durationMinutes: 21, type: "interactive",
    challengeHints: ["objective", "timeline", "resources"],
    misconceptions: ["Execution is more important than planning"],
    steps: [
      { title: "Project Goal", content: "A project goal must be specific and measurable to guide output quality.", icon: "target" },
      { title: "Resource Mapping", content: "List tools, materials, and time requirements before starting.", icon: "package-search" },
      { title: "Timeline Setup", content: "Break large tasks into milestones with realistic deadlines.", icon: "calendar-clock" },
      { title: "Risk Check", content: "Identify possible delays and prepare backup actions.", icon: "shield-alert" },
      { title: "Post-Project Review", content: "Evaluate process and output to improve future projects.", icon: "clipboard-check" },
    ] },
  { id: 58, grade: 10, subject: "english", order: 3, title: "Critical Reading of Arguments", description: "Evaluating claims, evidence, and bias", duration: "24 min", durationMinutes: 24, type: "interactive",
    challengeHints: ["claim", "evidence", "bias", "fallacy"],
    misconceptions: ["Strong tone equals strong argument"],
    steps: [
      { title: "Identify the Claim", content: "The claim is the central point the author wants the reader to accept.", icon: "search" },
      { title: "Evaluate Evidence", content: "Good evidence is relevant, sufficient, and from credible sources.", icon: "badge-check" },
      { title: "Detect Bias", content: "Bias appears when language selectively favors one side without fair support.", icon: "scale" },
      { title: "Spot Logical Fallacies", content: "Fallacies weaken arguments by using faulty reasoning patterns.", icon: "triangle-alert", difficulty: "hard" },
      { title: "Write a Response", content: "Summarize the argument and critique its strongest and weakest parts.", icon: "pen-square", examplePrompt: "Write a 3-sentence critique." },
    ] },
  { id: 59, grade: 10, subject: "filipino", order: 3, title: "Akademikong Pagsulat", description: "Lohikal at organisadong pagbuo ng talata", duration: "23 min", durationMinutes: 23, type: "video",
    challengeHints: ["tesis", "coherence", "transition"],
    misconceptions: ["Longer paragraph is always better"],
    steps: [
      { title: "Tesis na Pahayag", content: "Ang tesis ang pangunahing ideyang pinaiikot sa buong sulatin.", icon: "file-signature" },
      { title: "Balangkas", content: "Ang malinaw na balangkas ay nagpapadali sa lohikal na daloy ng ideya.", icon: "list-tree" },
      { title: "Kaugnayan ng Talata", content: "Bawat talata ay dapat may iisang pokus at sumusuporta sa tesis.", icon: "align-left" },
      { title: "Transisyon", content: "Gumamit ng salitang nag-uugnay upang maging tuloy-tuloy ang pagbasa.", icon: "arrow-right" },
      { title: "Rebisyon", content: "Suriin ang gramatika, lohika, at linaw bago isumite ang sulatin.", icon: "file-check-2" },
    ] },
  { id: 60, grade: 10, subject: "ap", order: 3, title: "Karapatang Pantao at Pananagutan", description: "Mga karapatan at tungkulin ng mamamayan", duration: "20 min", durationMinutes: 20, type: "video",
    challengeHints: ["karapatan", "pananagutan", "batas"],
    misconceptions: ["Rights exist without responsibilities"],
    steps: [
      { title: "Batayang Karapatan", content: "May likas at legal na karapatan ang bawat mamamayan na dapat igalang.", icon: "shield" },
      { title: "Pananagutan sa Lipunan", content: "Kasabay ng karapatan ang tungkuling sumunod sa batas at igalang ang iba.", icon: "users" },
      { title: "Rule of Law", content: "Ang batas ang nagtitiyak ng kaayusan at patas na pagtrato sa lipunan.", icon: "scale" },
      { title: "Paglahok sa Pamayanan", content: "Mahalaga ang aktibong pakikilahok sa usaping pampubliko at demokratiko.", icon: "messages-square" },
      { title: "Case Reflection", content: "Suriin kung paano nababalanse ang karapatan at pananagutan sa isang sitwasyon.", icon: "clipboard-list" },
    ] },
  { id: 61, grade: 10, subject: "science", order: 4, title: "Electricity and Magnetism", description: "Circuits, current, and magnetic effects", duration: "25 min", durationMinutes: 25, type: "animation",
    challengeHints: ["current", "resistance", "electromagnet"],
    misconceptions: ["Current is used up by first bulb"],
    steps: [
      { title: "Electric Current", content: "Electric current is the flow of charge through a conductor.", icon: "zap" },
      { title: "Simple Circuit", content: "A complete path is needed for current to flow in a circuit.", icon: "circuit-board", learningObjective: "Identify open and closed circuits." },
      { title: "Resistance", content: "Resistance limits current and affects brightness and heat.", icon: "gauge" },
      { title: "Magnetic Effect", content: "Current in a wire can create a magnetic field.", icon: "magnet" },
      { title: "Electromagnet Uses", content: "Electromagnets are used in motors, relays, and speakers.", icon: "speaker" },
    ] },
  { id: 62, grade: 10, subject: "mapeh", order: 3, title: "Health Promotion Campaign", description: "Designing student wellness campaigns", duration: "20 min", durationMinutes: 20, type: "interactive",
    challengeHints: ["target audience", "health message", "action plan"],
    misconceptions: ["Awareness posters alone change behavior"],
    steps: [
      { title: "Define the Issue", content: "Choose a relevant health issue that affects the school community.", icon: "stethoscope" },
      { title: "Know Your Audience", content: "Identify who needs the message and what barriers they face.", icon: "users-round" },
      { title: "Craft a Clear Message", content: "A health message should be concise, accurate, and actionable.", icon: "message-circle" },
      { title: "Choose Delivery Channels", content: "Use suitable channels such as posters, assemblies, and social media.", icon: "send" },
      { title: "Measure Impact", content: "Track participation and behavior change to evaluate campaign effectiveness.", icon: "chart-column" },
    ] },
  { id: 63, grade: 10, subject: "tle", order: 3, title: "Workplace Communication Skills", description: "Professional communication in practical settings", duration: "19 min", durationMinutes: 19, type: "interactive",
    challengeHints: ["clarity", "professional tone", "active listening"],
    misconceptions: ["Fast talking means effective communication"],
    steps: [
      { title: "Professional Tone", content: "Use respectful, concise language in workplace communication.", icon: "message-square" },
      { title: "Instruction Clarity", content: "Clear instructions reduce errors and improve team coordination.", icon: "clipboard-pen" },
      { title: "Active Listening", content: "Active listening means confirming and clarifying before responding.", icon: "ear" },
      { title: "Feedback Etiquette", content: "Constructive feedback focuses on behavior and improvement.", icon: "badge-info" },
      { title: "Scenario Practice", content: "Role-play workplace scenarios to practice clear communication.", icon: "users" },
    ] },
  { id: 64, grade: 9, subject: "math", order: 3, title: "Real-World Quadratic Applications", description: "Applying quadratic models to motion and area", duration: "24 min", durationMinutes: 24, type: "interactive",
    challengeHints: ["vertex", "maximum", "model"],
    misconceptions: ["Quadratics are only abstract equations"],
    steps: [
      { title: "Quadratic in Context", content: "Quadratic relationships appear in projectile motion and area optimization.", icon: "rocket" },
      { title: "Interpreting the Vertex", content: "The vertex can represent maximum height or optimal value in context.", icon: "mountain" },
      { title: "Building the Model", content: "Translate verbal situations into quadratic expressions.", icon: "file-pen-line" },
      { title: "Solving for Solutions", content: "Use factoring, completing the square, or formula methods as needed.", icon: "calculator" },
      { title: "Decision Making", content: "Interpret computed values to make practical recommendations.", icon: "check-circle-2" },
    ] },
];

export const quizQuestions = [
  {
    id: 1, grade: 7, subject: "math",
    question: "What is the value of x in: 2x + 5 = 15?",
    options: ["x = 3", "x = 5", "x = 10", "x = 7"],
    correct: 1, explanation: "Subtract 5 from both sides: 2x = 10. Divide by 2: x = 5."
  },
  {
    id: 2, grade: 7, subject: "science",
    question: "Which organelle is known as the 'powerhouse of the cell'?",
    options: ["Nucleus", "Mitochondria", "Ribosome", "Chloroplast"],
    correct: 1, explanation: "Mitochondria produce ATP through cellular respiration."
  },
  {
    id: 3, grade: 7, subject: "english",
    question: "What part of speech describes an action?",
    options: ["Noun", "Adjective", "Verb", "Adverb"],
    correct: 2, explanation: "Verbs express actions, states, or occurrences."
  },
  {
    id: 4, grade: 7, subject: "science",
    question: "What is the process by which plants make food?",
    options: ["Respiration", "Digestion", "Photosynthesis", "Fermentation"],
    correct: 2, explanation: "Photosynthesis uses sunlight, water, and CO₂ to produce glucose."
  },
  {
    id: 5, grade: 7, subject: "math",
    question: "Simplify: 3(x + 4) = ?",
    options: ["3x + 4", "3x + 12", "x + 12", "3x + 7"],
    correct: 1, explanation: "Distribute 3: 3·x + 3·4 = 3x + 12."
  },
];

export const surveyCategories = [
  {
    id: "usability", title: "Usability",
    questions: [
      "The system is easy to navigate.",
      "The interface design is visually appealing.",
      "I can find lessons and activities quickly.",
      "The system responds quickly to my actions.",
    ],
  },
  {
    id: "content", title: "Content Quality",
    questions: [
      "The lessons are clear and easy to understand.",
      "The multimedia content (animations, visuals) enhances learning.",
      "The content is relevant to the curriculum.",
      "The difficulty level is appropriate for my grade.",
    ],
  },
  {
    id: "effectiveness", title: "Instructional Effectiveness",
    questions: [
      "The system helps me understand difficult concepts.",
      "Interactive activities improve my engagement.",
      "I feel more motivated to study using this system.",
      "The quizzes provide helpful feedback.",
    ],
  },
  {
    id: "features", title: "System Features",
    questions: [
      "The progress tracking feature is useful.",
      "The animation controls (play, pause, speed) work well.",
      "I would recommend this system to other students.",
      "Overall, I am satisfied with the system.",
    ],
  },
];

export const studentData = [
  { name: "Maria Santos", grade: 8, progress: 78, quizAvg: 85 },
  { name: "Juan Cruz", grade: 7, progress: 62, quizAvg: 72 },
  { name: "Ana Reyes", grade: 9, progress: 91, quizAvg: 93 },
  { name: "Pedro Garcia", grade: 10, progress: 45, quizAvg: 68 },
  { name: "Rosa Mendoza", grade: 8, progress: 83, quizAvg: 88 },
];

export const badges = [
  { id: "first-lesson", name: "First Steps", description: "Complete your first lesson", icon: "rocket" },
  { id: "quiz-ace", name: "Quiz Ace", description: "Score 100% on a quiz", icon: "trophy" },
  { id: "five-lessons", name: "Dedicated Learner", description: "Complete 5 lessons", icon: "medal" },
  { id: "all-subjects", name: "Explorer", description: "Try all subjects", icon: "compass" },
];
