import { subjects } from "@/lib/mockData";
import type { Lesson } from "@/lib/mockData";
import { getLrModulesFor } from "@/lib/depedLrModuleIndex";

export { subjects, grades, badges, studentData, surveyCategories } from "@/lib/mockData";
export type { Lesson, LessonStep } from "@/lib/mockData";

const targetGrades = [7, 8, 9, 10] as const;

function deriveSourceTopic(sourceRef: string, fallback: string): string {
  const raw = sourceRef
    .replace(/\([^)]*https?:\/\/[^)]*\)/gi, "")
    .replace(/https?:\/\/\S+/gi, "")
    .replace(/Source index:\s*/gi, "")
    .trim();
  const pdfMatch = raw.match(/([A-Za-z0-9 _().&-]+)\.pdf/i);
  const base = (pdfMatch?.[1] ?? raw).trim();
  const cleaned = base
    .replace(/[_-]+/g, " ")
    .replace(/\b(Q[1-4]|Quarter\s*[1-4]|LAS\d*|LAS|TN|RTP|FIN|DLP|CONSOLIDATED|Copy|Final|Camera Ready)\b/gi, " ")
    .replace(/\b(FCS|HE|TLE|TVL|SLEM|ADM|CO|MELC)\s*\d*\b/gi, " ")
    .replace(/\b(Eng|Math|Science|Filipino|AP|ICT|TLE|MA|PEH)\s*\d{0,2}\b/gi, " ")
    .replace(/\bG\d{1,2}\b/gi, " ")
    .replace(/\bGrade\s*\d{1,2}\b/gi, " ")
    .replace(/\b\d{1,2}\s+\d{1,2}\b/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  return cleaned.length >= 8 ? cleaned : fallback;
}

function cleanSnippetText(snippet?: string) {
  const raw = (snippet ?? "").replace(/\s+/g, " ").trim();
  if (!raw) return "";

  return raw
    .replace(/Dynamic Learning Program[^.]*\.?/gi, " ")
    .replace(/DepEd\s+Complex[^.]*\.?/gi, " ")
    .replace(/Republic of the Philippines|Department of Education/gi, " ")
    .replace(/S\.?Y\.?\s*\d{4}\s*[–-]\s*\d{4}/gi, " ")
    .replace(/Learning Activity Sheet/gi, " ")
    .replace(/LAS\s*No\.?\s*\d+/gi, " ")
    .replace(/Pangalan:\s*_{0,}/gi, " ")
    .replace(/Iskor:\s*_{0,}/gi, " ")
    .replace(/Baitang at Seksiyon:\s*_{0,}/gi, " ")
    .replace(/Petsa:\s*_{0,}/gi, " ")
    .replace(/Uri ng Gawain:[^.]*\.?/gi, " ")
    .replace(/https?:\/\/\S+/gi, " ")
    .replace(/_{3,}/g, " blank ")
    .replace(/[□■●]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function splitSnippetIntoSections(snippet: string) {
  const headingRegex =
    /(Tala ng Konsepto|Buod|Gawain|Pagsasanay|Panuto|Reflection|Paglalahat|Konklusyon)\s*:?/gi;
  const matches = [...snippet.matchAll(headingRegex)];
  if (matches.length === 0) {
    return [
      {
        title: "Lesson Content",
        content: snippet,
      },
    ];
  }

  const sections: Array<{ title: string; content: string }> = [];
  for (let i = 0; i < matches.length; i += 1) {
    const current = matches[i];
    const next = matches[i + 1];
    const start = current.index ?? 0;
    const end = next?.index ?? snippet.length;
    const block = snippet.slice(start, end).trim();
    const heading = (current[1] ?? "Lesson Content").replace(/\s+/g, " ").trim();
    const body = block.replace(headingRegex, "").trim();
    if (body.length > 0) {
      sections.push({ title: heading, content: body });
    }
  }
  return sections.length
    ? sections
    : [
        {
          title: "Lesson Content",
          content: snippet,
        },
      ];
}

function cleanLessonTitle(topic: string) {
  const cleaned = topic
    .replace(/\b(LAS\d*|LAS|FCS|HE|TLE|TVL|Q[1-4])\b/gi, " ")
    .replace(/\b\d+\b/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  const normalized = toTitleCase(cleaned.length >= 4 ? cleaned : topic);
  if (/^(introduction|pagkilala|panimula|pagsulat|paggamit|understanding|exploring)\b/i.test(normalized)) {
    return normalized;
  }

  if (/^[A-Za-z][A-Za-z\s&,-]+$/.test(normalized) && normalized.split(/\s+/).length <= 6) {
    return `Introduction to ${normalized}`;
  }

  return normalized;
}

function toTitleCase(value: string) {
  const smallWords = new Set(["ang", "at", "ng", "sa", "of", "and", "or", "the", "to", "in"]);
  return value
    .toLowerCase()
    .split(/\s+/)
    .map((word, index) => {
      if (index > 0 && smallWords.has(word)) return word;
      return word.charAt(0).toUpperCase() + word.slice(1);
    })
    .join(" ")
    .replace(/\b(Ict|Ap|Tle|Mapeh)\b/g, (match) => match.toUpperCase());
}

function splitSentences(text: string) {
  return text
    .replace(/\s+/g, " ")
    .split(/(?<=[.!?])\s+/)
    .map((sentence) => sentence.trim())
    .filter((sentence) => sentence.length >= 18 && !/^(A|B|C|D)\.\s*$/i.test(sentence));
}

function conciseText(text: string, maxSentences = 4) {
  const sentences = splitSentences(text);
  return sentences.slice(0, maxSentences).join(" ");
}

function findSectionText(sections: Array<{ title: string; content: string }>, names: RegExp) {
  return sections
    .filter((section) => names.test(section.title))
    .map((section) => section.content)
    .join(" ");
}

function extractKeyConcepts(text: string, topic: string) {
  const definitionConcepts = [...text.matchAll(/([A-ZÀ-ÚA-Za-zÀ-ÿ][A-Za-zÀ-ÿ\s-]{3,45})\s+(?:ay|is|are|means|refers to)\s+([^.!?]{24,150})/gi)]
    .map((match) => `${toTitleCase(match[1].trim())}: ${match[2].trim()}`)
    .filter((concept) => !/learning|activity|pagsasanay|panuto/i.test(concept));
  const parentheticalConcepts = [...text.matchAll(/([A-ZÀ-ÚA-Za-zÀ-ÿ][A-Za-zÀ-ÿ\s-]{3,45})\s*\(([^)]{3,50})\)/g)]
    .map((match) => `${toTitleCase(match[1].trim())}: ${match[2].trim()}`);
  const titleConcepts = topic
    .split(/\s+(?:at|and|ng|sa|of|to|in)\s+/i)
    .map((part) => part.trim())
    .filter((part) => part.length >= 5)
    .map((part) => toTitleCase(part));

  return [...new Set([...definitionConcepts, ...parentheticalConcepts, ...titleConcepts])]
    .filter((concept) => concept.length >= 5)
    .slice(0, 5);
}

function buildExampleText(topic: string, fullText: string) {
  const exampleSentences = splitSentences(fullText).filter((sentence) =>
    /(halimbawa|example|tulad|gamit ang|for instance|1\.|2\.|3\.)/i.test(sentence),
  );
  if (exampleSentences.length > 0) return exampleSentences.slice(0, 3).join(" ");
  return `Example: When studying ${topic}, connect each key term to a real situation, object, place, or action from the lesson. Then explain why the example fits the concept.`;
}

function buildLearningObjectives(topic: string, keyConcepts: string[]) {
  const firstConcept = keyConcepts[0]?.split(":")[0] ?? topic;
  return [
    `Explain the main idea of ${topic}.`,
    `Identify how ${firstConcept} connects to the lesson topic.`,
    `Use an example to show understanding of ${topic}.`,
  ];
}

function buildVisualModel(topic: string, keyConcepts: string[]) {
  const nodes = [topic, ...keyConcepts.map((concept) => concept.split(":")[0])].slice(0, 5);
  if (nodes.length < 3) return undefined;

  return {
    title: `${topic} Concept Map`,
    nodes,
    caption: `Read this from left to right: the main topic leads to the key ideas students should connect during the lesson.`,
  };
}

function keywordFromConcept(concept: string) {
  return concept
    .split(":")[0]
    .replace(/[^\p{L}\p{N}\s-]/gu, "")
    .trim();
}

function buildActivity(topic: string, activityText: string, keyConcepts: string[]) {
  const expectedKeywords = keyConcepts.map(keywordFromConcept).filter(Boolean).slice(0, 4);
  const sourcePrompt = conciseText(activityText, 2);
  return {
    prompt:
      sourcePrompt ||
      `In your own words, explain ${topic}. Include one real example and connect it to at least two key concepts from the lesson.`,
    expectedKeywords,
  };
}

function buildAssignment(topic: string, keyConcepts: string[]) {
  return {
    prompt: `Write a short study note about ${topic}. Explain the main idea, include one example, and mention the key concept that helped you understand it most.`,
    checklist: [
      "States the main idea clearly",
      "Uses at least one lesson concept",
      "Includes a concrete example",
      "Explains why the example fits",
    ],
    expectedKeywords: keyConcepts.map(keywordFromConcept).filter(Boolean).slice(0, 4),
  };
}

function buildProcessedContent(topic: string, cleanSnippet: string, sections: Array<{ title: string; content: string }>) {
  const keyConcepts = extractKeyConcepts(cleanSnippet, topic);
  const activityText = findSectionText(sections, /gawain|pagsasanay|panuto|activity/i);
  const learningObjectives = buildLearningObjectives(topic, keyConcepts);

  return {
    mainTopic: topic,
    keyConcepts,
    learningObjectives,
    visualModel: buildVisualModel(topic, keyConcepts),
    activity: buildActivity(topic, activityText, keyConcepts),
    assignment: buildAssignment(topic, keyConcepts),
  };
}

function buildStructuredSteps(topic: string, cleanSnippet: string, sections: Array<{ title: string; content: string }>) {
  const conceptText = findSectionText(sections, /tala ng konsepto|buod|discussion|konsepto/i) || cleanSnippet;
  const discussion = conciseText(conceptText, 5) || conciseText(cleanSnippet, 5);
  const examples = buildExampleText(topic, cleanSnippet);

  return [
    {
      title: "Lesson Introduction",
      content: `In this lesson, you will study ${topic}. Focus on the main idea, the key terms, and how the concept appears in real examples.`,
      icon: "book-open",
      learningObjective: `Understand the purpose and focus of ${topic}.`,
      difficulty: "easy" as const,
      keywords: [topic, "introduction"],
    },
    {
      title: "Discussion",
      content: discussion,
      icon: "lightbulb",
      learningObjective: `Explain the important ideas behind ${topic}.`,
      difficulty: "medium" as const,
      keywords: [topic, "discussion"],
    },
    {
      title: "Examples",
      content: examples,
      icon: "list-checks",
      learningObjective: `Connect ${topic} to concrete examples.`,
      difficulty: "medium" as const,
      keywords: [topic, "examples"],
    },
  ];
}

function buildTopicQuiz(topic: string, subjectName: string, steps: ReturnType<typeof buildStructuredSteps>, seed: number) {
  const discussionFact = firstSentence(steps.find((step) => step.title === "Discussion")?.content, `The lesson explains ${topic}.`);
  const exampleFact = firstSentence(steps.find((step) => step.title === "Examples")?.content, `Examples help explain ${topic}.`);
  const correct = discussionFact;
  const distractors = buildTopicDistractors(topic, subjectName, exampleFact, correct);
  const shifted = withShiftedCorrectOption([correct, ...distractors], 0, seed);
  return {
    question: `What is the main idea of "${topic}"?`,
    options: shifted.options,
    correct: shifted.correct,
    explanation: correct,
  };
}

function buildTopicDistractors(topic: string, subjectName: string, exampleFact: string, correct: string) {
  const subject = subjectName.toLowerCase();
  const subjectSpecific =
    subject.includes("araling")
      ? [
          `It only names places or events without explaining their relationships.`,
          `It focuses on memorizing labels instead of interpreting social or geographic meaning.`,
        ]
      : subject.includes("tle")
        ? [
            `It only lists tools or services without explaining when they are used.`,
            `It focuses on workplace terms but misses the skill or service being practiced.`,
          ]
        : subject.includes("science")
          ? [
              `It describes an observation but does not explain the process behind it.`,
              `It focuses on isolated terms without connecting cause and effect.`,
            ]
          : subject.includes("mathematics")
            ? [
                `It gives a procedure but does not explain why the rule works.`,
                `It treats the topic as a single answer instead of a repeatable method.`,
              ]
            : [
                `It focuses on isolated details without explaining the main concept.`,
                `It gives an example but misses the broader idea of ${topic}.`,
              ];

  return [...subjectSpecific, exampleFact === correct ? `It explains a related classroom task but not the lesson concept.` : exampleFact].slice(0, 3);
}

function isUnavailableTopic(topic: string) {
  const clean = topic.toLowerCase();
  return clean === "" || clean.includes("las tn") || clean.includes("consolidated") || clean === "lesson content not available yet";
}

function buildScrapedLessonBundle(
  grade: number,
  subjectName: string,
  topic: string,
  quarter: string,
  snippet?: string,
) {
  const cleanSnippet = cleanSnippetText(snippet);
  const hasActualContent = cleanSnippet.length >= 120;
  const cleanTitle = cleanLessonTitle(topic);
  const sourceSections = hasActualContent ? splitSnippetIntoSections(cleanSnippet) : [];
  const sectionSteps = hasActualContent ? buildStructuredSteps(cleanTitle, cleanSnippet, sourceSections) : [];
  const processedContent = hasActualContent
    ? buildProcessedContent(cleanTitle, cleanSnippet, sourceSections)
    : {
        mainTopic: cleanTitle,
        keyConcepts: [],
        learningObjectives: [],
        fallbackReason: "Lesson content not available yet.",
      };

  return {
    title: cleanTitle,
    summary: `${quarter}: ${cleanTitle} for Grade ${grade} ${subjectName}.`,
    learningFocus: `Understand and apply ${cleanTitle}.`,
    misconception: hasActualContent ? `Common misconception should be verified from source details.` : `Actual lesson content not available from source.`,
    quiz: hasActualContent ? buildTopicQuiz(cleanTitle, subjectName, sectionSteps, grade + cleanTitle.length) : undefined,
    processedContent,
    steps: hasActualContent
      ? sectionSteps
      : [
          {
            title: cleanTitle,
            content: `Lesson content not available yet.`,
            icon: "book-open",
            learningObjective: `Retrieve complete lesson details for ${cleanTitle}.`,
            difficulty: "easy" as const,
            keywords: [cleanTitle, `grade-${grade}`],
          },
        ],
  };
}

let nextLessonId = 1;

export const lessons: Lesson[] = targetGrades.flatMap((grade) =>
  subjects.flatMap((subject) => {
    const modules = getLrModulesFor(grade, subject.id);
    if (modules.length === 0) {
      console.warn(`[lesson-scrape] Lesson content not available yet for grade=${grade}, subject=${subject.id}`);
    }

    return modules.flatMap((mod, orderIndex) => {
      const sourceTopic = deriveSourceTopic(mod.file, "Lesson content not available yet");
      if (isUnavailableTopic(sourceTopic)) {
        return [];
      }

      const bundle = buildScrapedLessonBundle(grade, subject.name, sourceTopic, mod.quarter, mod.contentSnippet);
      const steps = bundle.steps.map((step) => ({
        ...step,
        keywords: [...new Set([...(step.keywords ?? []), subject.id, `grade-${grade}`, mod.quarter.toLowerCase().replace(/\s+/g, "-")])],
      }));
      const id = nextLessonId++;
      const durationMinutes = Math.max(45, steps.length * 6);
      const hintPool = steps.flatMap((s) => s.keywords ?? []);
      const challengeHints = [...new Set(hintPool)].slice(0, 6);
      if (challengeHints.length < 3) {
        challengeHints.push(sourceTopic, mod.quarter, subject.id);
      }

      const lesson: Lesson = {
        id,
        grade,
        subject: subject.id,
        order: orderIndex + 1,
        title: bundle.title,
        description: `${mod.quarter}: ${bundle.summary}`,
        duration: `${durationMinutes} min`,
        durationMinutes,
        type: "interactive",
        challengeHints,
        misconceptions: [bundle.misconception],
        sourcePdf: mod.file,
        learningFocus: bundle.learningFocus,
        contentQuiz: bundle.quiz,
        processedContent: bundle.processedContent,
        steps,
      };
      return [lesson];
    });
  }),
);

export type ContentQuizQuestion = {
  id: number;
  grade: number;
  subject: string;
  sourcePdf?: string;
  question: string;
  options: string[];
  correct: number;
  explanation: string;
};

type QuizQuestionDraft = Omit<ContentQuizQuestion, "id">;

function withShiftedCorrectOption(
  options: string[],
  correct: number,
  seed: number,
): { options: string[]; correct: number } {
  if (!options.length) return { options, correct };
  const safeCorrect = Math.max(0, Math.min(correct, options.length - 1));
  const shift = seed % options.length;
  if (shift === 0) return { options, correct: safeCorrect };

  const rotated = options.map((_, i) => options[(i + shift) % options.length]);
  const nextCorrect = (safeCorrect - shift + options.length) % options.length;
  return { options: rotated, correct: nextCorrect };
}

function compactText(value?: string) {
  return (value ?? "").replace(/\s+/g, " ").trim();
}

function firstSentence(value?: string, fallback = "Review the lesson details.") {
  const clean = compactText(value);
  if (!clean) return fallback;
  const first = clean.split(/[.!?]/)[0]?.trim() ?? clean;
  return first.length > 120 ? `${first.slice(0, 117)}...` : first;
}

function quizTitle(lesson: Lesson) {
  return lesson.title.replace(/^G\d+\s+[^:]+:\s*/i, "");
}

function buildLessonQuizDrafts(lesson: Lesson, lessonIndex: number): QuizQuestionDraft[] {
  const drafts: QuizQuestionDraft[] = [];
  const q = lesson.contentQuiz;

  if (q) {
    const shifted = withShiftedCorrectOption(q.options, q.correct, lesson.id + lessonIndex);
    drafts.push({
      grade: lesson.grade,
      subject: lesson.subject,
      sourcePdf: lesson.sourcePdf,
      question: q.question,
      options: shifted.options,
      correct: shifted.correct,
      explanation: q.explanation,
    });
  } else {
    const fallback = withShiftedCorrectOption(
      [
        `Explain the main idea of ${quizTitle(lesson)} using an example.`,
        `Give one related example but leave out the explanation of why it fits.`,
        `Define one term from the lesson but do not connect it to the full topic.`,
        `Describe a classroom task without explaining the lesson concept.`,
      ],
      0,
      lesson.id + lessonIndex,
    );
    drafts.push({
      grade: lesson.grade,
      subject: lesson.subject,
      sourcePdf: lesson.sourcePdf,
      question: `What is the best way to show understanding of ${quizTitle(lesson)}?`,
      options: fallback.options,
      correct: fallback.correct,
      explanation: lesson.learningFocus ?? "Use the lesson steps to review.",
    });
  }

  const stepPool = lesson.steps.filter((step) => compactText(step.title) && compactText(step.content));
  const maxAutoQuestions = Math.min(2, stepPool.length);

  for (let stepIndex = 0; stepIndex < maxAutoQuestions; stepIndex += 1) {
    const step = stepPool[stepIndex];
    const otherSteps = stepPool.filter((candidate, i) => i !== stepIndex && !/activity|assignment/i.test(candidate.title));
    const correctSummary = firstSentence(step.content, step.title);
    const fallbackDistractors = [
      `It gives a related detail but misses the main relationship in ${quizTitle(lesson)}.`,
      `It names a term from the topic without explaining how it is used.`,
      `It focuses on an activity direction instead of the concept being taught.`,
    ];

    const distractors = [
      ...otherSteps.map((other) => firstSentence(other.content, other.title)),
      ...fallbackDistractors,
    ];

    const uniqueDistractors = [...new Set(distractors.filter((text) => text && text !== correctSummary))].slice(0, 3);
    while (uniqueDistractors.length < 3) {
      uniqueDistractors.push(fallbackDistractors[uniqueDistractors.length % fallbackDistractors.length]);
    }

    const baseOptions = [correctSummary, ...uniqueDistractors];
    const shifted = withShiftedCorrectOption(
      baseOptions,
      0,
      lesson.id * 100 + stepIndex * 17 + lessonIndex * 13,
    );

    drafts.push({
      grade: lesson.grade,
      subject: lesson.subject,
      sourcePdf: lesson.sourcePdf,
      question: `Which statement best explains an important idea from ${quizTitle(lesson)}?`,
      options: shifted.options,
      correct: shifted.correct,
      explanation: `This step emphasizes: ${correctSummary}`,
    });
  }

  return drafts;
}

export const quizQuestions: ContentQuizQuestion[] = lessons
  .flatMap((lesson, index) => buildLessonQuizDrafts(lesson, index))
  .map((question, index) => ({ ...question, id: index + 1 }));

export function filterQuizQuestions(
  all: ContentQuizQuestion[],
  grade: number | null,
  subjectId: string | null,
): ContentQuizQuestion[] {
  let pool = all;
  if (grade != null && !Number.isNaN(grade)) {
    pool = pool.filter((q) => q.grade === grade);
  }
  if (subjectId != null && subjectId !== "") {
    pool = pool.filter((q) => q.subject === subjectId);
  }
  return dedupeQuizPoolByStem(pool);
}

function dedupeQuizPoolByStem(pool: ContentQuizQuestion[]) {
  const seen = new Set<string>();
  const unique: ContentQuizQuestion[] = [];

  for (const item of pool) {
    const key = normalizeQuizStem(item.question);
    if (seen.has(key)) continue;
    seen.add(key);
    unique.push(item);
  }

  return unique;
}

function normalizeQuizStem(question: string) {
  return question
    .toLowerCase()
    .replace(/\s+/g, " ")
    .replace(/^grade\s+\d+\s+[a-z]+\s*-\s*[^:]+:\s*/i, "")
    .replace(/^[^:]{3,120}:\s*/i, "")
    .replace(/[^\w\s]/g, "")
    .trim();
}
