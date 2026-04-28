import type { LessonStep } from "./mockData";

export type ModuleQuiz = {
  question: string;
  options: string[];
  correct: number;
  explanation: string;
};

export type ModuleTeachingBundle = {
  shortTitle: string;
  summary: string;
  learningFocus: string;
  misconception: string;
  steps: LessonStep[];
  quiz: ModuleQuiz;
};

function step(
  title: string,
  content: string,
  icon: string,
  learningObjective: string,
  extra?: Partial<LessonStep>,
): LessonStep {
  return {
    title,
    content,
    icon,
    learningObjective,
    difficulty: extra?.difficulty ?? "medium",
    keywords: extra?.keywords,
  };
}

function mathBundle(grade: number, slot: 0 | 1 | 2 | 3): ModuleTeachingBundle {
  const g = grade;
  if (slot === 0) {
    return {
      shortTitle: "Integers & order of operations",
      summary: `Grade ${g} Math Q1: integers, absolute value, and PEMDAS with signed numbers.`,
      learningFocus: "Compute with integers and respect grouping symbols before × and ÷.",
      misconception: "Subtraction always makes numbers smaller, even when subtracting a negative.",
      steps: [
        step(
          "Integers on the number line",
          `Positive and negative whole numbers are integers. On a number line, values increase to the right. For Grade ${g}, compare −5 and −2: −2 is greater because it sits farther right.`,
          "move-horizontal",
          "Locate and compare integers using distance and direction from zero.",
          { difficulty: "easy", keywords: ["integers", "number line", "compare"] },
        ),
        step(
          "Adding and subtracting integers",
          "Adding a negative is the same as moving left. Subtracting a negative flips direction: 4 − (−3) = 4 + 3 = 7. Practice: (−8) + 5 = −3.",
          "plus",
          "Rewrite subtraction as addition of the opposite when helpful.",
          { keywords: ["add", "subtract", "negative"] },
        ),
        step(
          "Multiplying and dividing integers",
          "Same signs → positive product or quotient. Different signs → negative. Example: (−6)(−2) = 12 and (−12) ÷ 3 = −4.",
          "x-square",
          "Predict sign first, then multiply or divide absolute values.",
          { keywords: ["multiply", "divide", "sign rules"] },
        ),
        step(
          "Order of operations (PEMDAS)",
          "Parentheses and other grouping symbols first, then exponents, then × and ÷ left to right, then + and −. Try: 2 + 3 × 4 = 14, not 20.",
          "list-ordered",
          "Evaluate expressions without skipping grouping or operation order.",
          { keywords: ["PEMDAS", "grouping", "expression"] },
        ),
        step(
          "Short application",
          `A ${g}th-grade club owes ₱250 and pays back ₱80. Model as −250 + 80 = −170 (still owes ₱170). Translate words into integer operations.`,
          "target",
          "Model simple real situations with integer addition or subtraction.",
          { difficulty: "hard", keywords: ["word problem", "integers"] },
        ),
      ],
      quiz: {
        question: "What is (−4) × (−5)?",
        options: ["20", "−20", "−9", "1"],
        correct: 0,
        explanation: "Two negatives multiply to a positive: (−4)(−5) = 20.",
      },
    };
  }
  if (slot === 1) {
    return {
      shortTitle: "Expressions & like terms",
      summary: `Grade ${g} Math Q1: variables, terms, coefficients, and simplifying algebraic expressions.`,
      learningFocus: "Combine only like terms and substitute values carefully.",
      misconception: "2x + 3 means multiply 2 and x then add 3, not add 2 and x first.",
      steps: [
        step(
          "Variables and terms",
          "A variable represents an unknown. In 7x + 2y − 3, the terms are 7x, 2y, and −3. The coefficient of x is 7.",
          "variable",
          "Name parts of an algebraic expression: terms, coefficients, constants.",
          { difficulty: "easy", keywords: ["variable", "term", "coefficient"] },
        ),
        step(
          "Like and unlike terms",
          "Like terms have the same variable part: 5x and −2x combine to 3x. 5x and 5y cannot be combined into one term.",
          "git-branch",
          "Identify which terms may be combined in simplification.",
          { keywords: ["like terms", "combine"] },
        ),
        step(
          "Distributive property",
          "a(b + c) = ab + ac. Example: 3(x + 4) = 3x + 12. Watch signs: −2(3 − y) = −6 + 2y.",
          "layers",
          "Expand grouped products before combining like terms.",
          { keywords: ["distributive", "expand"] },
        ),
        step(
          "Evaluating expressions",
          `If x = −2 in 2x² + 3x, substitute: 2(4) + (−6) = 8 − 6 = 2. Exponents apply before multiplication for Grade ${g} algebra readiness.`,
          "calculator",
          "Substitute values and respect order of operations inside expressions.",
          { difficulty: "medium", keywords: ["substitute", "evaluate"] },
        ),
        step(
          "Perimeter mini-problem",
          "A rectangle has length (x + 5) and width x. Perimeter = 2(length + width) = 2(2x + 5) = 4x + 10. Check by expanding step by step.",
          "square",
          "Build a simple geometric model with a linear expression.",
          { keywords: ["perimeter", "expression"] },
        ),
      ],
      quiz: {
        question: "Simplify: 4a + 2 − a + 7",
        options: ["3a + 9", "5a + 9", "3a + 7", "4a + 9"],
        correct: 0,
        explanation: "Combine like terms: 4a − a = 3a and 2 + 7 = 9 → 3a + 9.",
      },
    };
  }
  return {
    shortTitle: "Mixed review & reasoning",
    summary: `Grade ${g} Math Q1 review: proportional reasoning, tables, and short multi-step items typical of SLeM packs.`,
    learningFocus: "Show organized work so each step can be checked.",
    misconception: "Guessing a final answer without units or labels is enough for word problems.",
    steps: [
      step(
        "Tables and patterns",
        "A table shows how one quantity changes with another. If y = 3x, then x = 1 → y = 3, x = 2 → y = 6. Extend the pattern to x = 5.",
        "table",
        "Read and extend patterns from a table of values.",
        { difficulty: "easy", keywords: ["table", "pattern"] },
      ),
      step(
        "Unit rates",
        "A unit rate compares quantities per one unit: 240 km in 3 hours → 80 km per hour. Use it to predict distance in 5 hours: 400 km.",
        "gauge",
        "Compute and interpret unit rates in context.",
        { keywords: ["rate", "ratio"] },
      ),
      step(
        "Percent of a number",
        "25% of 80 = 0.25 × 80 = 20. For mental math: 10% is one-tenth; double it for 20%, add 5% for 25%.",
        "percent",
        "Find percents using decimal or benchmark strategies.",
        { keywords: ["percent", "decimal"] },
      ),
      step(
        "Multi-step reasoning",
        `A shirt costs ₱400 with 15% off. Discount = 0.15(400) = 60; sale price = 340. For Grade ${g}, always label discount versus final price.`,
        "list-checks",
        "Break a word problem into labeled sub-steps before the final answer.",
        { difficulty: "hard", keywords: ["multi-step", "percent"] },
      ),
      step(
        "Check your answer",
        "Plug results back into the situation: does the sale price + discount equal the original? Does the rate × time match distance? Self-checks catch sign errors.",
        "check-circle",
        "Verify solutions with a quick inverse or reasonableness test.",
        { keywords: ["verify", "reasonableness"] },
      ),
    ],
    quiz: {
      question: "What is 15% of 200?",
      options: ["30", "15", "45", "300"],
      correct: 0,
      explanation: "0.15 × 200 = 30.",
    },
  };
}

function scienceBundle(grade: number, slot: 0 | 1 | 2 | 3): ModuleTeachingBundle {
  const g = grade;
  if (slot === 0) {
    return {
      shortTitle: "Investigating like a scientist",
      summary: `Grade ${g} Science Q1: questions, variables, fair tests, and representing data.`,
      learningFocus: "Separate independent, dependent, and controlled variables in an investigation.",
      misconception: "A hypothesis is the same as a guess with no link to evidence.",
      steps: [
        step(
          "Questions and hypotheses",
          "Science starts with a testable question. A hypothesis predicts a relationship you can support or refute with data—not a random opinion.",
          "help-circle",
          "Turn a broad wonder into one focused, testable question.",
          { difficulty: "easy", keywords: ["hypothesis", "question"] },
        ),
        step(
          "Variables in experiments",
          "Independent variable: what you change. Dependent: what you measure. Controlled: what you keep the same so the test is fair.",
          "sliders-horizontal",
          "Label variables to plan a fair investigation.",
          { keywords: ["variables", "experiment"] },
        ),
        step(
          "Measurement and units",
          "Always record magnitude and SI units (m, s, kg, °C where appropriate). Consistent units let others repeat and trust your results.",
          "ruler",
          "Choose tools and units that match the precision you need.",
          { keywords: ["measurement", "SI"] },
        ),
        step(
          "Tables and graphs",
          "Tables organize trials; line graphs show change over time; bar graphs compare categories. Title axes with quantity and unit.",
          "line-chart",
          "Represent data so patterns are visible to the reader.",
          { keywords: ["graph", "data"] },
        ),
        step(
          "Evidence-based claims",
          `For Grade ${g}, a claim cites specific data from the investigation (trends, comparisons) and explains how the evidence supports it.`,
          "shield-check",
          "Link conclusions directly to observations or measurements.",
          { difficulty: "hard", keywords: ["claim", "evidence"] },
        ),
      ],
      quiz: {
        question: "In an experiment on plant growth with different amounts of light, what is the dependent variable?",
        options: [
          "Height (or mass) of the plants",
          "Amount of light given",
          "Type of soil kept the same",
          "Water temperature if unchanged",
        ],
        correct: 0,
        explanation: "The dependent variable is what you measure—in this case growth.",
      },
    };
  }
  if (slot === 1) {
    return {
      shortTitle: "Matter & the particle model",
      summary: `Grade ${g} Science Q1: states of matter, particles, and changes that conserve mass in a closed system.`,
      learningFocus: "Explain properties of solids, liquids, and gases using particle spacing and motion.",
      misconception: "When water boils, the tiny water bits disappear completely from the universe.",
      steps: [
        step(
          "States of matter",
          "Solids: particles tightly packed, vibrate in place. Liquids: close but can flow. Gases: far apart, random motion. Macroscopic properties come from this model.",
          "layers",
          "Relate everyday properties to particle pictures.",
          { difficulty: "easy", keywords: ["solid", "liquid", "gas"] },
        ),
        step(
          "Changes of state",
          "Melting, freezing, evaporation, and condensation involve energy transfer without changing identity of the substance (for a pure sample).",
          "thermometer",
          "Name the change of state and whether energy is absorbed or released.",
          { keywords: ["melting", "evaporation", "energy"] },
        ),
        step(
          "Conservation idea",
          "In a closed container, mass before and after a physical change is the same—water vapor still has the same atoms as liquid water.",
          "scale",
          "Connect physical changes to conservation of mass in closed systems.",
          { keywords: ["conservation", "physical change"] },
        ),
        step(
          "Mixtures vs pure substances",
          "A mixture can be separated by physical means (filtration, evaporation). A compound needs chemical change to split into new substances.",
          "flask-conical",
          "Classify samples using separation and behavior.",
          { keywords: ["mixture", "pure substance"] },
        ),
        step(
          "Local example",
          `Link to a Grade ${g} context: sea water as a mixture, or metal gate rusting as chemical change versus ice melting as physical change.`,
          "map-pin",
          "Distinguish physical and chemical changes using local examples.",
          { difficulty: "medium", keywords: ["local", "classification"] },
        ),
      ],
      quiz: {
        question: "Which change is primarily physical?",
        options: [
          "Ice melting into water",
          "Iron rusting",
          "Paper burning",
          "Food digesting into new molecules",
        ],
        correct: 0,
        explanation: "Melting is a physical change—same substance, different state.",
      },
    };
  }
  return {
    shortTitle: "Energy in everyday systems",
    summary: `Grade ${g} Science Q1 review: forms of energy, transfers, and simple efficiency ideas.`,
    learningFocus: "Track where energy comes from and where it goes in a simple system.",
    misconception: "Energy disappears when a ball stops rolling.",
    steps: [
      step(
        "Forms of energy",
        "Common forms: kinetic, gravitational potential, thermal, light, sound, chemical. Many processes convert one form into another.",
        "zap",
        "Identify energy forms in a short scenario (fan, lamp, moving car).",
        { difficulty: "easy", keywords: ["kinetic", "potential", "thermal"] },
      ),
      step(
        "Energy transfer",
        "Energy moves from hotter to cooler regions; mechanical work can increase kinetic energy. Draw a simple before/after arrow diagram.",
        "arrow-right",
        "Describe direction of energy transfer in words.",
        { keywords: ["transfer", "heat"] },
      ),
      step(
        "Simple circuits (conceptual)",
        "A complete path lets charge flow. Open switch → no steady current. Relate brightness to power in introductory models.",
        "circuit-board",
        "Explain why a bulb goes out when the path opens.",
        { keywords: ["circuit", "current"] },
      ),
      step(
        "Efficiency in plain language",
        "Useful output divided by total input (often as a percent). Lost energy often becomes thermal—warm wires, warm air.",
        "gauge",
        "Interpret “wasted” energy as energy that did not do the intended job.",
        { difficulty: "medium", keywords: ["efficiency", "energy loss"] },
      ),
      step(
        "Sustainable choices",
        `Grade ${g} learners connect shorter trips, LED use, or shade trees to reduced energy demand—evidence-based habit, not slogans.`,
        "leaf",
        "Relate one daily choice to energy use or local climate comfort.",
        { keywords: ["sustainability", "choice"] },
      ),
    ],
    quiz: {
      question: "A ball slows on the floor mainly because kinetic energy is converted to…",
      options: ["Thermal energy in the ball and floor", "Nuclear energy", "Dark matter", "New mass from nothing"],
      correct: 0,
      explanation: "Friction does work against motion; kinetic energy becomes thermal energy in the surfaces.",
    },
  };
}

function englishBundle(grade: number, slot: 0 | 1 | 2 | 3): ModuleTeachingBundle {
  const g = grade;
  if (slot === 0) {
    return {
      shortTitle: "Reading for main ideas",
      summary: `Grade ${g} English Q1: central idea, supporting details, and text evidence.`,
      learningFocus: "State a central idea and cite sentences that support it.",
      misconception: "The first sentence is always the main idea of the whole passage.",
      steps: [
        step(
          "Preview and purpose",
          "Skim title, headings, and first/last paragraphs to predict topic and author purpose (inform, persuade, entertain).",
          "book-open",
          "Set a purpose before close reading.",
          { difficulty: "easy", keywords: ["preview", "purpose"] },
        ),
        step(
          "Central idea vs topic",
          "Topic is the subject; central idea is what the author says about that subject in one complete thought.",
          "text",
          "Write central idea as a full statement, not a single word.",
          { keywords: ["central idea", "topic"] },
        ),
        step(
          "Supporting details",
          "Facts, examples, statistics, and quotes that back the central idea. Weak support is vague or off-topic.",
          "list",
          "Sort sentences into support versus interesting but irrelevant detail.",
          { keywords: ["details", "evidence"] },
        ),
        step(
          "Inference with evidence",
          "Inferences go beyond the text but must be grounded in clues. Label: “The text says… so I infer…”",
          "lightbulb",
          "Distinguish explicit statements from reasonable inferences.",
          { difficulty: "medium", keywords: ["inference", "evidence"] },
        ),
        step(
          "Short practice frame",
          `For Grade ${g}, summarize a 1-paragraph model in two sentences: one for idea, one for key support.`,
          "pen-line",
          "Produce a tight summary without copying long phrases.",
          { keywords: ["summary", "paraphrase"] },
        ),
      ],
      quiz: {
        question: "Which best describes a central idea?",
        options: [
          "A full sentence stating what the author says about the topic",
          "Only the title of the passage",
          "Any interesting fact from the text",
          "The reader’s opinion without text support",
        ],
        correct: 0,
        explanation: "Central idea is a complete thought about the topic, supported by the passage.",
      },
    };
  }
  if (slot === 1) {
    return {
      shortTitle: "Sentences that work",
      summary: `Grade ${g} English Q1: clauses, sentence types, and fixing fragments/run-ons.`,
      learningFocus: "Write and punctuate complete sentences with clear subjects and predicates.",
      misconception: "A long line of words is a sentence if it sounds long enough.",
      steps: [
        step(
          "Subject and predicate",
          "Every complete sentence needs a subject (who/what) and a predicate (what they do or are). “Running fast.” is a fragment.",
          "type",
          "Identify subject and simple predicate in model sentences.",
          { difficulty: "easy", keywords: ["subject", "predicate"] },
        ),
        step(
          "Independent vs dependent clauses",
          "Independent clauses can stand alone. Dependent clauses begin with subordinators (because, although, when) and need attachment.",
          "git-branch",
          "Mark which clause can stand alone as a sentence.",
          { keywords: ["clause", "dependent"] },
        ),
        step(
          "Simple, compound, complex",
          "Simple: one independent clause. Compound: two joined properly. Complex: independent + dependent. Match purpose to structure.",
          "layers",
          "Choose structure to show relationship between ideas.",
          { keywords: ["compound", "complex"] },
        ),
        step(
          "Fragments and run-ons",
          "Fragments lack a complete thought; run-ons jam clauses without correct punctuation or conjunctions. Fix with revision strategies.",
          "scissors",
          "Revise a run-on into two correct sentences or one properly joined sentence.",
          { difficulty: "medium", keywords: ["fragment", "run-on"] },
        ),
        step(
          "Punctuation partners",
          "Commas with coordinating conjunctions (FANBOYS) between independent clauses; periods to separate complete thoughts.",
          "quote",
          "Apply comma and period rules to a short paragraph model.",
          { keywords: ["comma", "FANBOYS"] },
        ),
      ],
      quiz: {
        question: "Which is a fragment?",
        options: [
          "Because the bell rang late",
          "The bell rang late.",
          "We hurried, but we arrived on time.",
          "Although it rained, the game continued.",
        ],
        correct: 0,
        explanation: "“Because…” cannot stand alone; it is a dependent clause fragment.",
      },
    };
  }
  return {
    shortTitle: "Short composed response",
    summary: `Grade ${g} English Q1: planning, drafting, and revising a short paragraph with a clear claim and example.`,
    learningFocus: "State one clear point and support it with a specific example.",
    misconception: "More adjectives always make writing stronger.",
    steps: [
      step(
        "Topic and audience",
        "Choose a narrow focus your reader can follow in one paragraph. Name audience and tone (formal for school reports).",
        "users",
        "Limit scope so the paragraph stays coherent.",
        { difficulty: "easy", keywords: ["audience", "focus"] },
      ),
      step(
        "Claim sentence",
        "First or second sentence states your point directly—no burying the idea at the end.",
        "anchor",
        "Write a topic sentence that can be agreed or disagreed with.",
        { keywords: ["claim", "topic sentence"] },
      ),
      step(
        "Example and explanation",
        "After an example, add a sentence that explains how it proves the claim. Example without explanation is just a list.",
        "link",
        "Glue example to claim with explicit reasoning.",
        { keywords: ["example", "explanation"] },
      ),
      step(
        "Revise for clarity",
        "Cut repeated words, replace vague “thing/stuff” with specifics, read aloud for awkward rhythm.",
        "refresh-cw",
        "Improve one draft sentence for precision.",
        { difficulty: "medium", keywords: ["revise", "clarity"] },
      ),
      step(
        "Checklist",
        `Grade ${g} writers confirm: one main idea, evidence, complete sentences, and basic capitalization/punctuation.`,
        "list-checks",
        "Self-assess with a short checklist before submitting.",
        { keywords: ["checklist", "edit"] },
      ),
    ],
    quiz: {
      question: "Which pair best shows claim + supporting example?",
      options: [
        "“Students need breaks.” + “For instance, a 5-minute walk improved focus in our class survey.”",
        "“School is long.” + “Tuesday exists.”",
        "“I like colors.” + “The sky is big.”",
        "“Maybe.” + “Sometimes.”",
      ],
      correct: 0,
      explanation: "The first option ties a clear claim to a concrete example.",
    },
  };
}

function filipinoBundle(grade: number, slot: 0 | 1 | 2 | 3): ModuleTeachingBundle {
  const g = grade;
  if (slot === 0) {
    return {
      shortTitle: "Pangungusap at paksa",
      summary: `Filipino G${g} Q1: uri ng pangungusap, simuno at panaguri, at wastong tono.`,
      learningFocus: "Buuin ang pangungusap na may simuno at panaguri.",
      misconception: "Ang payak at tambalan ay pareho kung may kuha lang na panag-uri.",
      steps: [
        step(
          "Simuno at panaguri",
          "Ang simuno ang pinag-uusapan; ang panaguri ang sinasabi tungkol dito. Halimbawa: Ang mga mag-aaral (simuno) ay nagbasa (panaguri).",
          "text",
          "Tukuyin ang simuno at panaguri sa payak na pangungusap.",
          { difficulty: "easy", keywords: ["simuno", "panaguri"] },
        ),
        step(
          "Payak, tambalan, hugnayan",
          "Payak: isang diwa. Tambalan: dalawang payak na pinagsama ng at, ngunit, o kundi. Hugnayan: may sugnay na nakasalalay.",
          "git-branch",
          "Pag-uriin ang pangungusap ayon sa istraktura.",
          { keywords: ["payak", "tambalan", "hugnayan"] },
        ),
        step(
          "Paksa at layunin",
          "Ang paksa ay ang nilalaman; ang layunin ay gustong mangyari ng manunulat (magbigay-kaalaman, humikayat, maglibang).",
          "book-open",
          "Itala ang paksa at layunin batay sa pamagat at unang talata.",
          { keywords: ["paksa", "layunin"] },
        ),
        step(
          "Wastong bantas",
          "Tuldok sa wakas ng pahayag, tandang pananong sa tanong, kuwit sa magkakaugnay na bahagi ng listahan.",
          "quote",
          "Gamitin ang angkop na bantas sa maikling talata.",
          { difficulty: "medium", keywords: ["bantas", "tuldok"] },
        ),
        step(
          "Sanayin sa G" + String(g),
          "Basahin ang isang talata at sumulat ng dalawang pangungusap: isa na nagbubuod ng paksa, isa na nagtatanong nang wasto.",
          "pen-line",
          "Isulat ang buod at tanong gamit ang tamang simuno-panaguri.",
          { keywords: ["buod", "tanong"] },
        ),
      ],
      quiz: {
        question: "Alin ang may tamang simuno at panaguri?",
        options: [
          "Ang guro ay naghahanda ng aralin.",
          "Naghahanda ng aralin.",
          "Ang guro at ang aralin.",
          "Nang naghahanda.",
        ],
        correct: 0,
        explanation: "May buong simuno (Ang guro) at panaguri (ay naghahanda ng aralin).",
      },
    };
  }
  if (slot === 1) {
    return {
      shortTitle: "Pandiwa at aspekto",
      summary: `Filipino G${g} Q1: pandiwa, aspekto ng panahunan, at pokus ng pangungusap.`,
      learningFocus: "Tukuyin ang pandiwa at kung nasa pangnagdaan, kasalukuyan, o panghinaharap.",
      misconception: "Lahat ng salitang may '-in' ay laging pokus sa layon.",
      steps: [
        step(
          "Ano ang pandiwa?",
          "Ang pandiwa ay salitang nagsasaad ng kilos, pangyayari, o katayuan. Halimbawa: tumakbo, kumain, naroroon.",
          "zap",
          "Hanapin ang pandiwa sa pangungusap.",
          { difficulty: "easy", keywords: ["pandiwa", "kilos"] },
        ),
        step(
          "Aspekto",
          "Pangnagdaan: naglakad na. Kasalukuyan: naglalakad. Panghinaharap: maglalakad. Unawain ang panahon ng kuwento.",
          "clock",
          "Itugma ang pandiwa sa tamang panahon.",
          { keywords: ["aspekto", "panahon"] },
        ),
        step(
          "Pokus: tagaganap at layon",
          "Sa pokus sa tagaganap, ang tagaganap ang simuno. Sa pokus sa layon, ang layon ang simuno (hal. 'Binasa ni Ana ang libro' → layon ang libro kung ito ang simuno sa ibang balangkas).",
          "arrow-right-left",
          "Tukuyin kung sino o ano ang sentro ng pangungusap.",
          { difficulty: "medium", keywords: ["pokus", "tagaganap"] },
        ),
        step(
          "Sanhi at bunga sa teksto",
          "Dahil… kaya…; upang…; kung… Suriin kung paano ikinakabit ng may-akda ang mga pangyayari.",
          "link",
          "Kilalanin ang relasyong sanhi-bunga sa talata.",
          { keywords: ["sanhi", "bunga"] },
        ),
        step(
          "Maikling gawain",
          `Sa antas ${g}, pumili ng tatlong pandiwa mula sa teksto at isulat ang aspekto ng bawat isa.`,
          "list-checks",
          "Ilapat ang kaalaman sa tunay na teksto ng module.",
          { keywords: ["gawain", "teksto"] },
        ),
      ],
      quiz: {
        question: "Alin ang nasa aspekto panghinaharap?",
        options: ["Mag-aaral ako bukas.", "Nag-aral ako kahapon.", "Nag-aaral ako ngayon.", "Nagaral na ako."],
        correct: 0,
        explanation: "“Mag-aaral” ay plano sa hinaharap.",
      },
    };
  }
  return {
    shortTitle: "Pagbasa at talata",
    summary: `Filipino G${g} Q1: impormasyon mula sa teksto at pagsulat ng maikling talata.`,
    learningFocus: "Kunin ang mahahalagang detalye at isalin sa sariling salita.",
    misconception: "Ang kopya ng pangungusap mula sa teksto ay kapareho ng buod.",
    steps: [
        step(
          "Suriin ang pamagat at larawan",
          "Magtala ng hula tungkol sa paksa bago basahin ang buong teksto.",
          "image",
          "Gamitin ang biswal bilang suporta sa pag-unawa.",
          { difficulty: "easy", keywords: ["biswal", "hula"] },
        ),
        step(
          "Mahahalagang detalye",
          "Itala ang tauhan, lugar, problema, at solusyon kung naratibo; o ang pangunahing datos kung impormatibo.",
          "list",
          "Hiwalayin ang mahalaga sa pantulong lamang na detalye.",
          { keywords: ["detalye", "impormasyon"] },
        ),
        step(
          "Buod sa sariling salita",
          "Isulat ang buod nang hindi dinikit ang mga parirala ng may-akda; panatilihin ang katotohanan ng teksto.",
          "refresh-cw",
          "Gumawa ng maikling buod ng dalawa hanggang tatlong pangungusap.",
          { difficulty: "medium", keywords: ["buod", "paraprase"] },
        ),
        step(
          "Talata: isang paksa",
          "Isang pangunahing ideya, tatlong pangungusap na nagpapatibay, at pangwakas na pangungusap.",
          "align-left",
          "Ayusin ang talata ayon sa isang paksa lamang.",
          { keywords: ["talata", "ideya"] },
        ),
        step(
          "Wastong baybay",
          "Suriin ang malalaking titik, bantas, at angkop na pangalan ng sarili at lugar.",
          "spell-check-2",
          "I-edit ang talata bago isumite.",
          { keywords: ["edit", "baybay"] },
        ),
      ],
      quiz: {
        question: "Alin ang mabuting gawi sa paggawa ng buod?",
        options: [
          "Isulat sa sariling salita habang pinapanatili ang diwa ng teksto",
          "Kopyahin ang buong talata",
          "Magdagdag ng hindi nasa teksto nang walang batayan",
          "Iwanan ang teksto nang hindi binasa",
        ],
        correct: 0,
        explanation: "Ang buod ay nagpapakita ng pag-unawa, hindi direktang kopya.",
      },
  };
}

function apBundle(grade: number, slot: 0 | 1 | 2 | 3): ModuleTeachingBundle {
  const g = grade;
  if (slot === 0) {
    return {
      shortTitle: "Heograpiya at mapa",
      summary: `AP G${g} Q1: lokasyon, grid, at kahalagahan ng heograpiya sa pamumuhay.`,
      learningFocus: "Basahin ang mapa gamit ang simbolo, legend, at direksyon.",
      misconception: "Ang latitude at longitude ay parehong nagsasabi ng direksyon lamang.",
      steps: [
        step(
          "Absolute at relative location",
          "Absolute: tiyak na koordinada o adres. Relative: tinutukoy ang lugar kaugnay ng iba (hilaga ng Maynila).",
          "map",
          "Ilahad ang lokasyon ng komunidad sa dalawang paraan.",
          { difficulty: "easy", keywords: ["lokasyon", "mapa"] },
        ),
        step(
          "Mga elemento ng mapa",
          "Pamagat, legend, sukat ng sukat, direksyon (NSEW), at grid. Walang legend, mahirap basahin ang simbolo.",
          "compass",
          "Gamitin ang legend upang tukuyin ang simbolo.",
          { keywords: ["legend", "grid"] },
        ),
        step(
          "Anyong tubig at lupa",
          "Iugnay ang anyong lupa at tubig sa hanapbuhay at transportasyon sa rehiyon.",
          "mountain",
          "Tukuyin kung paano nakaaapekto ang heograpiya sa pamumuhay.",
          { difficulty: "medium", keywords: ["anyong lupa", "tubig"] },
        ),
        step(
          "Klima at gawain",
          "Ang uri ng klima ay humuhubog sa agrikultura at tirahan. Bigyang-halimbawa mula sa Pilipinas.",
          "cloud-sun",
          "Ipaliwanag ang ugnayan ng klima at ekonomiya sa antas ng komunidad.",
          { keywords: ["klima", "agrikultura"] },
        ),
        step(
          "Sanay sa G" + String(g),
          "Magtala ng tatlong datos mula sa simpleng mapa (rehiyon, kabisera, karatig-bansa) at suriin ang kawastuhan.",
          "list-checks",
          "Ilapat ang pagbabasa ng mapa sa isang tanong mula sa module.",
          { keywords: ["datos", "mapa"] },
        ),
      ],
      quiz: {
        question: "Alin ang tumutulong sa pagbabasa ng simbolo sa mapa?",
        options: ["Legend (key)", "Lamang pamagat", "Kulay ng papel", "Laki ng mapa lamang"],
        correct: 0,
        explanation: "Ang legend ay nagpapaliwanag ng simbolo.",
      },
    };
  }
  if (slot === 1) {
    return {
      shortTitle: "Sinaunang pamayanan",
      summary: `AP G${g} Q1: kultura, kalakalan, at pamamahala bago ang malawakang kolonyalismo.`,
      learningFocus: "Ilarawan ang mayayamang pamayanan gamit ang ebidensya mula sa aralin.",
      misconception: "Walang sistema ng pamamahala ang sinaunang Pilipino bago dumating ang mga dayuhan.",
      steps: [
        step(
          "Pinagmulan at migrasyon",
          "Mga modelo ng migrasyon at pakikipag-ugnayan sa kapwa rehiyon sa Asya at Pasipiko.",
          "ship",
          "Ipaliwanag kung bakit mahalaga ang migrasyon sa pagbuo ng kultura.",
          { difficulty: "easy", keywords: ["migrasyon", "kultura"] },
        ),
        step(
          "Kabuhayan at kalakalan",
          "Pagsasaka, pangingisda, at kalakalan sa dagat—ugat ng yamang pantao at teknikal.",
          "fish",
          "Itala ang pangunahing hanapbuhay at kalakip na kasanayan.",
          { keywords: ["kalakalan", "kabuhayan"] },
        ),
        step(
          "Pamamahala at batas",
          "Barangay, datu, at mga tuntunin sa komunidad. May kaayusan bago ang kolonyal na estruktura.",
          "landmark",
          "Ikumpara ang lokal na pamamahala sa mas malawak na sistema sa kalaunan.",
          { difficulty: "medium", keywords: ["barangay", "pamamahala"] },
        ),
        step(
          "Kultura at paniniwala",
          "Wika, sining, at ritwal bilang bahagi ng pagkakakilanlan; igalang ang iba’t ibang tradisyon.",
          "palette",
          "Tukuyin ang papel ng sining at ritwal sa komunidad.",
          { keywords: ["kultura", "ritwal"] },
        ),
        step(
          "Koneksyon ngayon",
          `Sa antas ${g}, iugnay ang isang katangian ng sinaunang pamayanan sa isang halimbawa sa kasalukuyang pamayanan.`,
          "link",
          "Gumawa ng maikling paliwanag na may halimbawa mula sa kasalukuyan.",
          { keywords: ["kasalukuyan", "ugnayan"] },
        ),
      ],
      quiz: {
        question: "Alin ang katangian ng maraming sinaunang pamayanan sa Pilipinas?",
        options: [
          "May lokal na pamamahala at ugnayang pangkabuhayan",
          "Walang wika o tradisyon",
          "Ganap na hiwalay sa dagat",
          "Walang pinagmulang kultura",
        ],
        correct: 0,
        explanation: "May lokal na pamamahala at ugnayan sa kalakalan at kapaligiran.",
      },
    };
  }
  return {
    shortTitle: "Kasaysayan at kasalukuyan",
    summary: `AP G${g} Q1: pagsusuri ng pinagmulan ng isyu at paggamit ng mapa/talahanayan.`,
    learningFocus: "Basahin ang talahanayan o timeline at tukuyin ang sanhi at bunga.",
    misconception: "Ang petsa lamang ang mahalaga; ang konteksto ay opsyonal.",
    steps: [
        step(
          "Timeline",
          "Ayusin ang mga pangyayari batay sa panahon; tukuyin ang bago at pagkatapos.",
          "calendar",
          "Ilagay ang mga pangyayari sa tamang pagkakasunud-sunod.",
          { difficulty: "easy", keywords: ["timeline", "petsa"] },
        ),
        step(
          "Sanhi at bunga",
          "Isang pangyayari ang maaaring maging sanhi ng iba; iwasan ang hasty generalization.",
          "git-branch",
          "Magtala ng isang sanhi at isang bunga mula sa aralin.",
          { keywords: ["sanhi", "bunga"] },
        ),
        step(
          "Primary at secondary source",
          "Primary: orihinal na dokumento o artifact. Secondary: interpretasyon. Pareho ay may gamit sa pag-aaral.",
          "file-text",
          "Pag-uriin ang pinagmulan ng impormasyon.",
          { difficulty: "medium", keywords: ["primary", "secondary"] },
        ),
        step(
          "Mapa at datos",
          "Basahin ang mapa o talahanayan ng populasyon/ekonomiya upang suportahan ang paliwanag.",
          "table",
          "Kumuha ng datos mula sa biswal at isulat ang interpretasyon.",
          { keywords: ["datos", "mapa"] },
        ),
        step(
          "Maikling sanaysay",
          "Isang talata: tanong, ebidensya mula sa aralin, at konklusyon na may paggalang sa iba’t ibang pananaw.",
          "pen-line",
          "Isulat ang paliwanag gamit ang ebidensya mula sa module.",
          { keywords: ["sanaysay", "ebidensya"] },
        ),
      ],
      quiz: {
        question: "Alin ang halimbawa ng primary source?",
        options: [
          "Lumaang liham na isinulat noong panahong iyon",
          "Textbook na sumasalaysay ng kasaysayan ngayon",
          "Pelikula batay sa nobela",
          "Komento sa social media",
        ],
        correct: 0,
        explanation: "Ang orihinal na dokumento mula sa panahon ay primary source.",
      },
  };
}

function ictTleBundle(grade: number, slot: 0 | 1 | 2 | 3, subjectId: "ict" | "tle"): ModuleTeachingBundle {
  const g = grade;
  const isTle = subjectId === "tle";
  const label = isTle ? "TLE" : "ICT";
  if (slot === 0) {
    return {
      shortTitle: isTle ? "Kaligtasan sa workshop" : "Digital citizenship",
      summary: `${label} G${g} Q1: ligtas na gawi sa computer o workshop, at responsableng paggamit ng impormasyon.`,
      learningFocus: "Tukuyin ang panganib at tamang gawi bago magsanay ng kasanayan.",
      misconception: "Lahat ng nakita sa internet ay awtomatikong tama at ligtas.",
      steps: [
        step(
          isTle ? "PPE at kalinisan" : "Password at account",
          isTle
            ? "Suot ang tamang PPE (kung kinakailangan), panatilihing malinis ang lugar, at alamin ang emergency stop."
            : "Gumamit ng matibay na password, huwag ibahagi ang OTP, at mag-log out sa shared device.",
          "shield",
          "Listahan ng bawal at dapat bago magsimula.",
          { difficulty: "easy", keywords: [isTle ? "PPE" : "password", "safety"] },
        ),
        step(
          "Panganib sa kapaligiran",
          isTle
            ? "Makinarya, kuryente, at maingat na hawak ng kasangkapan."
            : "Phishing, malware, at pekeng link—huwag mag-click kung hindi sigurado.",
          "alert-triangle",
          "Kilalanin ang babala at tamang aksyon.",
          { keywords: ["panganib", "alerto"] },
        ),
        step(
          "Tamang paghawak ng datos",
          "Respetuhin ang privacy ng iba; huwag kumuha ng personal na datos nang walang pahintulot.",
          "lock",
          "Ilapat ang etika sa datos sa isang sitwasyon sa paaralan.",
          { difficulty: "medium", keywords: ["privacy", "datos"] },
        ),
        step(
          "Mga patakaran sa paaralan",
          "Acceptable use policy: oras ng paggamit, mga site na pinapayagan, at parusa sa paglabag.",
          "scroll-text",
          "Isalin ang patakaran sa isang personal na commitment (isang pangungusap).",
          { keywords: ["patakaran", "AUP"] },
        ),
        step(
          "Checklist bago magsimula",
          `G${g}: kumpletuhin ang mental checklist: ligtas, may pahintulot, alam ang emergency contact.`,
          "list-checks",
          "Suriin ang sarili gamit ang checklist ng module.",
          { keywords: ["checklist", "simula"] },
        ),
      ],
      quiz: {
        question: isTle
          ? "Ano ang unang dapat tiyakin bago gamitin ang isang power tool?"
          : "Alin ang mabuting gawi para sa password?",
        options: isTle
          ? [
              "Nakasuot ng tamang proteksyon at alam ang emergency stop",
              "Bumilis nang walang basbas",
              "Iwanan na bukas ang makina",
              "Huwag basahin ang manwal",
            ]
          : [
              "Matibay at hindi madaling hulaan na password",
              "I-post ang password sa social media",
              "Ipareho ang password sa lahat ng site magpakailanman",
              "Iwanan ang session na naka-log in sa computer ng iba",
            ],
        correct: 0,
        explanation: isTle
          ? "Kaligtasan at alam ang kontrol bago operasyon."
          : "Ang matibay na password ay proteksyon ng account.",
      },
    };
  }
  if (slot === 1) {
    return {
      shortTitle: isTle ? "Kasangkapan at sukat" : "Mga tool sa produktibidad",
      summary: `${label} G${g} Q1: tamang gamit ng tool, sukat, o software batay sa gawain.`,
      learningFocus: "Piliin ang tamang tool at sundin ang hakbang-hakbang.",
      misconception: "Mas maraming feature ay laging mas mabilis ang gawain.",
      steps: [
        step(
          isTle ? "Pagkilala sa kasangkapan" : "Interface ng software",
          isTle
            ? "Tukuyin ang pangalan at gamit ng screwdriver, wrench, o measuring tape ayon sa module."
            : "Menu, toolbar, at shortcut keys na pinapayagan sa lab—iwas sa hindi awtorisadong software.",
          "wrench",
          "Pangalanan ang mga bahagi ng tool o interface.",
          { difficulty: "easy", keywords: ["tool", "interface"] },
        ),
        step(
          "Sukat at katumpakan",
          isTle
            ? "Sukat bago gupitin o mag-butas; double-check ang unit (mm o cm)."
            : "I-align ang margins at page setup bago mag-print.",
          "ruler",
          "Ipakita kung paano binabawasan ang error sa sukat o layout.",
          { keywords: ["sukat", "katumpakan"] },
        ),
        step(
          "Sunud-sunod na proseso",
          "Ang module ay may hakbang 1→2→3; huwag laktawan ang paghahanda.",
          "list-ordered",
          "Isulat ang maikling listahan ng hakbang para sa isang gawain.",
          { keywords: ["proseso", "hakbang"] },
        ),
        step(
          "Kalidad ng output",
          isTle
            ? "Linisin ang pinaggawaan, suriin ang pagkakapantay at tibay."
            : "Spell check, alignment, at tamang file format bago isumite.",
          "check-circle",
          "Gumamit ng rubric ng module para sa sariling gawa.",
          { difficulty: "medium", keywords: ["kalidad", "rubric"] },
        ),
        step(
          "Pag-iingat pagkatapos",
          isTle ? "I-off ang makina, ilagay ang kasangkapan sa tamang lugar." : "I-save ang backup at isara ang file nang tama.",
          "power",
          "Taposin ang gawain ayon sa protocol ng lab.",
          { keywords: ["wrap-up", "protocol"] },
        ),
      ],
      quiz: {
        question: isTle
          ? "Bakit mahalaga ang dobleng pagsukat bago permanenteng hiwa?"
          : "Bakit kailangan i-save ang file sa tamang format?",
        options: isTle
          ? [
              "Upang mabawasan ang pagkakamali at sayang na materyales",
              "Upang tumagal ang proseso nang walang saysay",
              "Dahil bawal ang ruler",
              "Dahil hindi kailangan ng plano",
            ]
          : [
              "Upang mabuksan at maipakita nang tama sa ibang device o guro",
              "Dahil pareho ang lahat ng format",
              "Dahil hindi na kailangan i-save",
              "Dahil laging PDF ang dokumento",
            ],
        correct: 0,
        explanation: isTle
          ? "Ang tumpak na sukat ay nakakatipid at nagpapataas ng kalidad."
          : "Ang format ay nakaaapekto sa compatibility at kalidad ng ipinapakita.",
      },
    };
  }
  return {
    shortTitle: isTle ? "LAS at proyektong gawa" : "Output at presentasyon",
    summary: `${label} G${g} Q1: pagsasama ng kasanayan mula sa naunang module sa isang gawain.`,
    learningFocus: "Isumite ang gawain ayon sa rubric at dokumentasyon.",
    misconception: "Ang huling minuto lamang ang oras ng tunay na pag-aaral.",
    steps: [
        step(
          "Basahin ang rubric",
          "Tukuyin ang criteria bago magsimula upang alam ang inaasahan.",
          "clipboard-list",
          "Itala ang tatlong criteria na pinakamabigat ang timbang.",
          { difficulty: "easy", keywords: ["rubric", "criteria"] },
        ),
        step(
          "Plano at materyales",
          "Listahan ng materyales at oras; iwas sa kulang sa huling sandali.",
          "package",
          "Gumawa ng maikling plano ng gawain.",
          { keywords: ["plano", "materyales"] },
        ),
        step(
          "Paggawa at dokumentasyon",
          isTle
            ? "Kuha ng litrato o log ng hakbang kung hinihingi ng guro."
            : "I-screenshot ang mahahalagang screen kung kinakailangan sa portfolio.",
          "camera",
          "Magdokumento ng proseso ayon sa tagubilin.",
          { difficulty: "medium", keywords: ["dokumentasyon", "proseso"] },
        ),
        step(
          "Pagsusuri at pagwawasto",
          "Ikumpara ang gawa sa rubric; ayusin bago isumite.",
          "refresh-cw",
          "Gawin ang isang round ng self-check.",
          { keywords: ["wasto", "self-check"] },
        ),
        step(
          "Pagsumite at refleksyon",
          "Isulat ang isang pangungusap: ano ang pinaka-natutunan at ano ang susunod na pagpapahusay.",
          "message-square",
          "Magrefleksyon batay sa tunay na gawain.",
          { keywords: ["refleksyon", "submit"] },
        ),
      ],
      quiz: {
        question: "Bakit basahin muna ang rubric bago gumawa?",
        options: [
          "Upang malaman ang criteria at maiwasan ang hindi pagtugon sa gawain",
          "Dahil hindi mahalaga ang rubric",
          "Dahil bawal magtanong sa guro",
          "Dahil palaging pareho ang rubric",
        ],
        correct: 0,
        explanation: "Ang rubric ang gabay sa tagumpay ng gawain.",
      },
    };
}

function mapehBundle(grade: number, slot: 0 | 1 | 2 | 3): ModuleTeachingBundle {
  const g = grade;
  if (slot === 0) {
    return {
      shortTitle: g === 7 ? "Musika: Lowland folksong" : `Musika G${g} Q1`,
      summary:
        g === 7
          ? "Musika Q1: mga awiting-bayan ng mabababang lupain ng Luzon at konteksto nito."
          : `Musika G${g} Q1: pakikinig, elemento ng musika, at kontekstong kultural.`,
      learningFocus: "Tukuyin ang tunog, tekstura, at gamit panlipunan ng awitin.",
      misconception: "Lahat ng tradisyonal na awit ay pareho ng ritmo at layunin.",
      steps: [
        step(
          "Pakikinig na may pokus",
          "Unang pakikinig: kabuuang impresyon. Ikalawang pakikinig: melodya at ritmo.",
          "headphones",
          "Magtala ng dalawang obserbasyon batay sa pakikinig.",
          { difficulty: "easy", keywords: ["pakikinig", "ritmo"] },
        ),
        step(
          "Konteksto ng awitin",
          g === 7
            ? "Ang mga awitin sa mabababang lupain ay may kaugnayan sa hanapbuhay, pag-ibig, at ritwal."
            : `Sa antas ${g}, iugnay ang awitin sa rehiyon at okasyon ng pagtatanghal.`,
          "map-pin",
          "Ipaliwanag kung bakit may partikular na gamit ang awitin sa komunidad.",
          { keywords: ["konteksto", "komunidad"] },
        ),
        step(
          "Elemento: pitch at rhythm",
          "Taas-baba ng tono at paghahati ng kumpas. Gumamit ng patak-patak o palakpak bilang gabay.",
          "music",
          "Sundan ang kumpas o pattern na ibinigay sa module.",
          { difficulty: "medium", keywords: ["pitch", "rhythm"] },
        ),
        step(
          "Paggalang sa pinagmulan",
          "Ang kultura ay buhay; iwasan ang caricature at pakinggan nang may respeto.",
          "heart",
          "Isulat ang isang pangungusap ng paggalang bilang tagapakinig.",
          { keywords: ["respeto", "kultura"] },
        ),
        step(
          "Maikling tugon",
          "Pumili ng isang awitin o tugtugin mula sa aralin at ilarawan kung paano ito nagpapahayag ng damdamin o kuwento.",
          "pen-line",
          "Isulat ang tugon sa 3–5 pangungusap.",
          { keywords: ["tugon", "interpretasyon"] },
        ),
      ],
      quiz: {
        question: "Ano ang mabuting unang hakbang bago suriin ang isang tradisyonal na awitin?",
        options: [
          "Makinig nang buo upang makuha ang kabuuang pakiramdam at konteksto",
          "Balewalain ang konteksto",
          "Huwag ulitin ang pakikinig",
          "Iwasan ang pagtatala ng obserbasyon",
        ],
        correct: 0,
        explanation: "Ang ulit na pakikinig at konteksto ay nagpapalinaw ng interpretasyon.",
      },
    };
  }
  if (slot === 1) {
    return {
      shortTitle: g === 7 ? "Sining: Luzon attire & crafts" : `Sining G${g} Q1`,
      summary:
        g === 7
          ? "Sining Q1: kasuotan, telang disenyo, at palamuti sa Luzon bilang pagpapahayag ng kultura."
          : `Sining G${g} Q1: elemento ng sining sa lokal na disenyo at materyales.`,
      learningFocus: "Tukuyin ang linya, hugis, kulay, at tekstura sa isang artifact.",
      misconception: "Ang “maganda” ay walang pamantayang elemento ng sining.",
      steps: [
        step(
          "Paghahambing ng disenyo",
          "Tingnan ang linya at uliran: organic vs geometric; paano ginagamit sa telang disenyo?",
          "shapes",
          "Magtala ng dalawang uri ng linya o hugis na nakita.",
          { difficulty: "easy", keywords: ["linya", "hugis"] },
        ),
        step(
          "Kulay at kahulugan",
          "Ang kulay ay may simboliko sa maraming kultura; basahin ang paliwanag sa module.",
          "palette",
          "Pumili ng isang kulay at ipaliwanag ang kahulugan sa konteksto ng disenyo.",
          { keywords: ["kulay", "simbolo"] },
        ),
        step(
          "Tekstura at materyales",
          "Makinis, magaspang, makintab—paano nakaaapekto sa hitsura at gamit?",
          "layers",
          "Ilarawan ang tekstura ng isang halimbawa mula sa aralin.",
          { difficulty: "medium", keywords: ["tekstura", "materyales"] },
        ),
        step(
          "Paggawa ng pagpapahayag",
          "Gumuhit o mag-collage ng simpleng disenyo gamit ang elemento na natutunan (sa papel kung walang materyales sa lab).",
          "pen-tool",
          "Ilapat ang elemento ng sining sa sariling maliit na disenyo.",
          { keywords: ["disenyo", "elemento"] },
        ),
        step(
          "Paggalang sa pinagmulang kultura",
          "Iwasan ang pagkopya nang walang pagkilala; bigyang-pansin ang pinagmulan ng motif.",
          "info",
          "Isulat ang pinagmulan o inspirasyon ng iyong disenyo.",
          { keywords: ["kultura", "atribusyon"] },
        ),
      ],
      quiz: {
        question: "Alin ang elemento ng sining na tumutukoy sa taas at bababa ng tono o dami ng kulay?",
        options: ["Value (lilim at liwanag) o intensity", "Lamang laki ng papel", "Bilang ng guhit lamang", "Lamang presyo"],
        correct: 0,
        explanation: "Ang value at intensity ay kaugnay ng liwanag at kulay.",
      },
    };
  }
  return {
    shortTitle: g === 7 ? "PE: Physical Fitness Test" : `PE G${g} Q1`,
    summary:
      g === 7
        ? "PE Q1: mga bahagi ng PFT, tamang porma, at pagrekord ng resulta."
        : `PE G${g} Q1: kalusugang pangkatawan, warmup, at ligtas na pagsasanay.`,
    learningFocus: "Bigyang-diin ang tamang porma bago bilis o dami.",
    misconception: "Ang mas maraming ulit nang maling porma ay mas mainam.",
    steps: [
      step(
        "Warm-up at hydration",
        "5–10 minutong pag-init ng kasukasuan at inuming tubig bago magsanay.",
        "activity",
        "Ipaliwanag kung bakit kailangan ang warm-up.",
        { difficulty: "easy", keywords: ["warm-up", "hydration"] },
      ),
      step(
        g === 7 ? "Mga bahagi ng PFT" : "Sukat ng fitness",
        g === 7
          ? "Tukuyin ang mga pagsubok sa module (hal. flexibility, muscular endurance) at layunin ng bawat isa."
          : "Tukuyin ang sukat na ginagamit sa antas na ito at kung ano ang ibinubunga nito.",
        "list-checks",
        "Ilahad ang layunin ng bawat pagsubok o sukat.",
        { keywords: ["PFT", "fitness"] },
      ),
      step(
        "Tamang porma",
        "Video o diagram sa module: alisin ang baluktot na likod, protektahan ang tuhod at balikat.",
        "user-check",
        "Ituwid ang isang karaniwang mali sa porma batay sa gabay.",
        { difficulty: "medium", keywords: ["porma", "safety"] },
      ),
      step(
        "Pagrekord",
        "Isulat ang resulta sa tamang yunit at petsa; huwag ikumpara ang sarili nang di-makatwiran sa iba.",
        "clipboard",
        "Gumawa ng sample entry ng log batay sa hypothetical score.",
        { keywords: ["rekord", "log"] },
      ),
      step(
        "Cool-down",
        "Banayad na pag-unat at paghinga pagkatapos; bawasan ang biglaang pagtigil.",
        "wind",
        "Isulat ang isang cool-down routine na 3 hakbang.",
        { keywords: ["cool-down", "recovery"] },
      ),
    ],
    quiz: {
      question: "Alin ang dapat unahin bago dagdagan ang bilis o bigat ng ehersisyo?",
      options: [
        "Tamang porma at warm-up",
        "Agad na maximum na bigat",
        "Walang pag-init",
        "Pag-iwas sa tubig",
      ],
      correct: 0,
      explanation: "Ang porma at warm-up ay nagpapababa ng pinsala at nagpapahusay ng resulta.",
    },
  };
}

export function getModuleTeachingContent(subjectId: string, grade: number, slot: 0 | 1 | 2 | 3): ModuleTeachingBundle {
  switch (subjectId) {
    case "math":
      return mathBundle(grade, slot);
    case "science":
      return scienceBundle(grade, slot);
    case "english":
      return englishBundle(grade, slot);
    case "filipino":
      return filipinoBundle(grade, slot);
    case "ap":
      return apBundle(grade, slot);
    case "mapeh":
      return mapehBundle(grade, slot);
    case "ict":
      return ictTleBundle(grade, slot, "ict");
    case "tle":
      return ictTleBundle(grade, slot, "tle");
    default:
      return mathBundle(grade, slot);
  }
}
