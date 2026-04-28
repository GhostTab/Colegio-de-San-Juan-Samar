import { subjects } from "@/lib/mockData";
import type { Lesson } from "@/lib/mockData";
import { lessonContentProcessed } from "@/lib/lessonContentProcessed";
import { lessonContentRaw } from "@/lib/lessonContentRaw";

export { subjects, grades, badges, studentData, surveyCategories } from "@/lib/mockData";
export type { Lesson, LessonStep } from "@/lib/mockData";

const targetGrades = [7, 8, 9, 10] as const;
const subjectIds = ["math", "science", "english", "filipino", "ap", "ict", "mapeh", "tle"] as const;

type SubjectId = (typeof subjectIds)[number];
type ProcessedEntry = {
  title: string;
  fallbackReason?: string;
  discussion: string;
  keyConcepts: string[];
  learningObjectives?: string[];
  examples: string[];
  visualModel?: { title: string; nodes: string[]; caption: string };
  activity?: { prompt: string; expectedKeywords: string[] };
  assignment?: { prompt: string; checklist: string[]; expectedKeywords?: string[] };
  quiz?: Array<{ question: string; options: string[]; correct: number; explanation: string }>;
};
type RawEntry = { title: string; sourcePage: string };

const processedData = lessonContentProcessed as unknown as Record<string, Record<SubjectId, Record<string, ProcessedEntry>>>;
const rawData = lessonContentRaw as unknown as Record<string, Record<SubjectId, Record<string, RawEntry>>>;

function sanitizeProcessedTitle(rawTitle: string, keyConcepts: string[] = [], discussion = "") {
  const sanitizeCore = (value: string) =>
    value
      .replace(/[_-]+/g, " ")
      .replace(/\b(fin|q[1-4]|quarter\s*[1-4]|las(?:&tn)?\d*|las|tn|rtp|consolidated|copy|final|camera\s*ready)\b/gi, " ")
      .replace(/\b(eng|math|science|filipino|ap|ict|tle|ma|peh)\s*\d{0,2}\b/gi, " ")
      .replace(/\b(g\d{1,2}|grade\s*\d{1,2})\b/gi, " ")
      .replace(/[&/\\]/g, " ")
      .replace(/\b\d+\b/g, " ")
      .replace(/[^\p{L}\p{N}\s-]/gu, " ")
      .replace(/\s+/g, " ")
      .trim();

  const cleaned = sanitizeCore(rawTitle);
  const conceptCandidate = keyConcepts[0]?.split(/[:\-]/)[0]?.trim() ?? "";
  const safeConcept = sanitizeCore(conceptCandidate);

  const inferred = inferTopicFromDiscussion(discussion);
  const base = cleaned.length >= 5 && !looksLikeRawTokenTitle(cleaned)
    ? cleaned
    : safeConcept.length >= 5 && !looksLikeRawTokenTitle(safeConcept)
      ? safeConcept
      : inferred.length >= 5
        ? inferred
        : "Lesson Topic";
  return base
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
}

function looksLikeRawTokenTitle(value: string) {
  return /\b(las|fin|tn|rtp|q[1-4]|consolidated|final)\b/i.test(value) || value.split(" ").length <= 2;
}

function inferTopicFromDiscussion(discussion: string) {
  const clean = discussion
    .replace(/\b(Concept Development|Tala ng Konsepto|Buod|KONSEPTONG ARALIN|Dynamic Learning Program)\b/gi, " ")
    .replace(/\s+/g, " ")
    .trim();
  const phraseMatch = clean.match(/(?:Ang|A|An)\s+([A-Za-zÀ-ÿ][A-Za-zÀ-ÿ\s-]{3,60}?)\s+(?:ay|is|are)\b/i);
  if (phraseMatch) return `Understanding ${phraseMatch[1].trim()}`;
  const firstChunk = clean.split(/[.!?]/)[0]?.trim() ?? "";
  return firstChunk.split(" ").slice(0, 7).join(" ");
}

function toQuarterLabel(quarter: string) {
  return `Quarter ${quarter}`;
}

function fallbackSteps(title: string) {
  return [
    {
      title: "Step 1 - Introduction",
      content: "Lesson content not available yet.",
      icon: "book-open",
      learningObjective: `Wait for processed lesson content for ${title}.`,
      difficulty: "easy" as const,
      keywords: [title, "unavailable"],
    },
  ];
}

function buildSteps(
  title: string,
  discussion: string,
  examples: string[],
  learningObjectives: string[],
  keyConcepts: string[],
  visualModel?: { nodes: string[] },
) {
  const cleanedExamples = examples.map((item) => cleanForLessonDisplay(item)).filter(Boolean);
  const cleanedDiscussion = cleanForLessonDisplay(discussion);
  const repairedConcepts = normalizeKeyConcepts(keyConcepts, cleanedDiscussion, title);
  const teachingCards = buildDiscussionCards(cleanedDiscussion, repairedConcepts);
  const visualNodes = sanitizeVisualNodes(visualModel?.nodes ?? [], title, repairedConcepts);

  const exampleContent = cleanedExamples.length
    ? cleanedExamples.map((item, index) => `${index + 1}. ${item}`).join("\n")
    : `No concrete examples were extracted for ${title} yet.`;
  const objectivesText = learningObjectives.length
    ? learningObjectives.map((objective, index) => `${index + 1}. ${objective}`).join("\n")
    : `1. Understand ${title}\n2. Explain the core concept\n3. Apply the lesson to examples`;
  const conceptText = repairedConcepts.length
    ? repairedConcepts.slice(0, 4).map((concept, index) => `${index + 1}. ${concept}`).join("\n")
    : `1. Main concept\n2. Supporting idea\n3. Practical relevance`;
  const visualText = visualNodes.length
    ? `Starter visual:\n${visualNodes.slice(0, 5).join(" -> ")}`
    : "Starter visual: Topic -> Key Concept -> Example";
  const discussionText = teachingCards.join("\n\n");
  const discussionExample = cleanedExamples[0] ?? `Think of a real-life situation where ${title} appears and explain how the concept applies.`;
  const discussionVisual = visualNodes.length
    ? `Visual connection: ${visualNodes.join(" -> ")}`
    : "Visual connection: main idea -> key details -> example.";

  return [
    {
      title: "Step 1 - Introduction",
      content: `Lesson overview: ${title}\n\nLearning objectives:\n${objectivesText}\n\nStarter example and visual:\n${visualText}`,
      icon: "book-open",
      learningObjective: `Understand the lesson topic: ${title}.`,
      difficulty: "easy" as const,
      keywords: [title, "introduction"],
    },
    {
      title: "Step 2 - Main Discussion",
      content: `Topic: ${title}\n\n${discussionText}\n\nWorked example:\n${discussionExample}\n\n${discussionVisual}\n\nKey concepts:\n${conceptText}`,
      icon: "lightbulb",
      learningObjective: `Explain the important ideas behind ${title}.`,
      difficulty: "medium" as const,
      keywords: [title, "discussion"],
    },
    {
      title: "Step 3 - Guided Examples / Practice",
      content: `${exampleContent}\n\nGuided practice:\n1. Identify the concept used in each example.\n2. Explain why the example matches the lesson.\n3. Write one more example in your own words.`,
      icon: "list-checks",
      learningObjective: `Connect ${title} to concrete examples.`,
      difficulty: "medium" as const,
      keywords: [title, "examples"],
    },
    {
      title: "Step 4 - Interactive Activity or Assignment",
      content: `Complete the in-player activity/assignment below. Your answer should use key lesson concepts and one concrete example.`,
      icon: "clipboard-check",
      learningObjective: `Apply lesson understanding through an interactive task.`,
      difficulty: "medium" as const,
      keywords: [title, "activity"],
    },
    {
      title: "Step 5 - Quiz / Assessment",
      content: `Answer the assessment question below based on the lesson discussion and guided examples.`,
      icon: "list-checks",
      learningObjective: `Demonstrate understanding through topic-based assessment.`,
      difficulty: "medium" as const,
      keywords: [title, "quiz"],
    },
  ];
}

function cleanForLessonDisplay(value: string) {
  const sanitized = normalizeExtractedText(stripDanglingReferences(value))
    .replace(/\b(concept development|dynamic learning program|las\s*&?\s*tn)\b/gi, " ")
    .replace(/\s+/g, " ")
    .trim();

  if (!sanitized) return "";
  return sanitized;
}

function stripDanglingReferences(value: string) {
  const sentences = value
    .split(/(?<=[.!?])\s+/)
    .map((sentence) => sentence.trim())
    .filter(Boolean);

  const danglingPatterns = [
    /\b(on the left|on the right|below|above|see image|see chart|see map|see diagram|refer to (the )?(poem|passage|chart|map|diagram|image)|read (the )?(poem|passage)|refer to the text)\b/i,
    /\b(in the figure|in the graph|in the table|from the picture)\b/i,
    /\b(things described in the poem|details from the poem|based on the poem)\b/i,
  ];

  const kept = sentences.filter((sentence) => !danglingPatterns.some((pattern) => pattern.test(sentence)));
  return kept.join(" ");
}

function normalizeExtractedText(value: string) {
  const normalized = value
    .replace(/[\u2022•]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  if (!normalized) return "";

  const parts = normalized
    .split(/(?<=[.!?])\s+/)
    .map((item) => item.trim())
    .filter(Boolean);

  const cleanedParts: string[] = [];
  for (const part of parts) {
    const compact = part.replace(/\s+/g, " ").trim();
    if (isParserNoiseFragment(compact)) continue;
    if (cleanedParts.length > 0 && areNearDuplicateSentences(cleanedParts[cleanedParts.length - 1], compact)) continue;
    cleanedParts.push(compact);
  }
  return cleanedParts.join(" ");
}

function isParserNoiseFragment(value: string) {
  if (!value) return true;
  if (/^(this|what|if|and|or|&)\.?$/i.test(value)) return true;
  if (/^(this|what|if)\s*:/i.test(value) && value.length < 24) return true;
  if (/^(figure|image|chart|map)\s*\d*$/i.test(value)) return true;
  return false;
}

function areNearDuplicateSentences(a: string, b: string) {
  const normalize = (v: string) => v.toLowerCase().replace(/[^\p{L}\p{N}\s]/gu, "").trim();
  const na = normalize(a);
  const nb = normalize(b);
  if (!na || !nb) return false;
  if (na === nb) return true;
  return na.length > 20 && nb.length > 20 && (na.includes(nb) || nb.includes(na));
}

function normalizeKeyConcepts(keyConcepts: string[], discussion: string, title: string) {
  const normalized = keyConcepts
    .map((raw) => raw.replace(/^[^A-Za-zÀ-ÿ]+/, "").trim())
    .filter((raw) => raw && raw !== "&")
    .map((raw) => {
      const parts = raw.split(":");
      const labelRaw = parts[0]?.trim() ?? "";
      const detailRaw = parts.slice(1).join(":").trim();
      const detail = cleanForLessonDisplay(detailRaw || labelRaw);
      if (!detail || detail.length < 12) return "";

      let label = labelRaw;
      if (isWeakConceptLabel(labelRaw)) {
        label = inferConceptLabel(detail);
      }
      label = label
        .replace(/\b(the|a|an)\b/gi, " ")
        .replace(/\s+/g, " ")
        .trim();
      if (!label || label.length < 3) label = inferConceptLabel(detail);
      return `${toHeadline(label)} - ${detail}`;
    })
    .filter(Boolean);

  if (normalized.length > 0) {
    return [...new Set(normalized)].slice(0, 6);
  }

  const inferred = inferConceptsFromDiscussion(discussion, title);
  return inferred.length ? inferred : [`${title} - Understand the main idea and explain it clearly.`];
}

function isWeakConceptLabel(label: string) {
  return /^(this|what|the|if|it|and|or|example|concept|idea)$/i.test(label.trim());
}

function inferConceptLabel(detail: string) {
  const cleaned = detail
    .replace(/^(this|it)\s+(refers to|means)\s+/i, "")
    .replace(/^(the|a|an)\s+/i, "")
    .trim();
  const known = cleaned.match(/\b(internal conflict|external conflict|character vs nature|character vs society|character vs self|main idea|theme|plot|setting)\b/i);
  if (known) return known[1];

  const words = cleaned
    .split(" ")
    .filter(Boolean)
    .filter((word) => !/^(this|what|if|when|where|which|that)$/i.test(word))
    .slice(0, 4);
  return words.join(" ");
}

function inferConceptsFromDiscussion(discussion: string, title: string) {
  const matches = [...discussion.matchAll(/\b([A-Za-zÀ-ÿ][A-Za-zÀ-ÿ\s-]{3,40})\s+(?:is|are|ay)\s+([^.!?]{12,180})/gi)];
  const inferred = matches.slice(0, 4).map((match) => `${toHeadline(match[1].trim())} - ${match[2].trim()}`);
  if (inferred.length) return inferred;
  const first = discussion.split(/[.!?]/).map((segment) => segment.trim()).find(Boolean);
  return first ? [`${title} - ${first}`] : [];
}

function toHeadline(value: string) {
  return value
    .split(" ")
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
}

function buildDiscussionCards(discussion: string, concepts: string[]) {
  const sentencePool = discussion
    .split(/(?<=[.!?])\s+/)
    .map((sentence) => sentence.trim())
    .filter((sentence) => sentence.length > 20);

  if (sentencePool.length === 0) {
    return [discussion || "Lesson content not available yet."];
  }

  const cards: string[] = [];
  const conceptDeck = concepts.slice(0, 3);
  let cursor = 0;
  const targetCardCount = Math.min(4, Math.max(2, Math.ceil(sentencePool.length / 2)));

  for (let cardIndex = 0; cardIndex < targetCardCount; cardIndex += 1) {
    const chunk = sentencePool.slice(cursor, cursor + 2);
    cursor += 2;
    if (!chunk.length) break;
    const conceptHint = conceptDeck[cardIndex]
      ? `This section highlights ${conceptDeck[cardIndex].split(" - ")[0]}.`
      : "";
    const card = [chunk.join(" "), conceptHint].filter(Boolean).join(" ");
    cards.push(card);
  }

  if (!cards.length) return [sentencePool.join(" ")];
  return cards;
}

function sanitizeVisualNodes(nodes: string[], title: string, concepts: string[]) {
  const conceptLabels = concepts.map((item) => item.split(" - ")[0]).filter(Boolean);
  const cleaned = nodes
    .map((node) => cleanForLessonDisplay(node))
    .filter((node) => node.length >= 3)
    .filter((node) => !/^(this|what|if|and|or|&|las|eng|math|science)\b/i.test(node))
    .map((node) => toHeadline(node));

  const merged = [...new Set([...cleaned, ...conceptLabels])].slice(0, 5);
  if (merged.length >= 2) return merged;
  return [title, ...conceptLabels.slice(0, 2)];
}

function resolveSource(grade: number, subjectId: SubjectId, quarter: string) {
  const raw = rawData[String(grade)]?.[subjectId]?.[quarter];

  if (!raw) return undefined;
  return `${raw.title}. Source index: ${raw.sourcePage}`;
}

let nextLessonId = 1;

export const lessons: Lesson[] = targetGrades.flatMap((grade) =>
  subjectIds.flatMap((subjectId) => {
    const subjectName = subjects.find((subject) => subject.id === subjectId)?.name ?? subjectId;
    const subjectProcessed = processedData[String(grade)]?.[subjectId] ?? {};
    const quarterEntries = Object.entries(subjectProcessed).sort(([a], [b]) => Number(a) - Number(b));

    if (quarterEntries.length === 0) {
      console.warn(`[lesson-scrape] Lesson content not available yet for grade=${grade}, subject=${subjectId}`);
      return [];
    }

    return quarterEntries.map(([quarter, entry], orderIndex) => {
      const cleanedDiscussion = cleanForLessonDisplay(entry.discussion ?? "");
      const provisionalTitle = sanitizeProcessedTitle(
        entry.title || "Lesson content not available yet",
        entry.keyConcepts ?? [],
        cleanedDiscussion,
      );
      const normalizedConcepts = normalizeKeyConcepts(entry.keyConcepts ?? [], cleanedDiscussion, provisionalTitle);
      const title = sanitizeProcessedTitle(
        entry.title || provisionalTitle,
        normalizedConcepts,
        cleanedDiscussion,
      );
      const quarterLabel = toQuarterLabel(quarter);
      const steps = entry.fallbackReason
        ? fallbackSteps(title)
        : buildSteps(
            title,
            cleanedDiscussion,
            entry.examples,
            entry.learningObjectives ?? [],
            normalizedConcepts,
            entry.visualModel,
          ).map((step) => ({
            ...step,
            keywords: [...new Set([...(step.keywords ?? []), subjectId, `grade-${grade}`, quarterLabel.toLowerCase().replace(/\s+/g, "-")])],
          }));

      const activity = entry.activity
        ? {
            prompt: cleanForLessonDisplay(entry.activity.prompt),
            expectedKeywords: [...new Set([...(entry.activity.expectedKeywords ?? []), ...normalizedConcepts.map((item) => item.split(" - ")[0])])]
              .map((item) => item.trim())
              .filter((item) => item.length >= 3)
              .slice(0, 6),
          }
        : undefined;

      const assignment = entry.assignment
        ? {
            prompt: cleanForLessonDisplay(entry.assignment.prompt),
            checklist: entry.assignment.checklist.map((item) => cleanForLessonDisplay(item)).filter(Boolean),
            expectedKeywords: [...new Set([...(entry.assignment.expectedKeywords ?? []), ...normalizedConcepts.map((item) => item.split(" - ")[0])])]
              .map((item) => item.trim())
              .filter((item) => item.length >= 3)
              .slice(0, 6),
          }
        : undefined;

      const lesson: Lesson = {
        id: nextLessonId++,
        grade,
        subject: subjectId,
        order: orderIndex + 1,
        title,
        description: `${quarterLabel}: ${title} for Grade ${grade} ${subjectName}.`,
        duration: `${Math.max(45, steps.length * 8)} min`,
        durationMinutes: Math.max(45, steps.length * 8),
        type: "interactive",
        challengeHints: [title, subjectId, quarterLabel],
        misconceptions: [entry.fallbackReason ? "Lesson content not available yet." : "Verify details using processed lesson concepts."],
        sourcePdf: resolveSource(grade, subjectId, quarter),
        learningFocus: entry.fallbackReason ? "Lesson content not available yet." : `Understand and apply ${title}.`,
        contentQuiz: entry.quiz?.[0]
          ? {
              question: cleanForLessonDisplay(entry.quiz[0].question),
              options: entry.quiz[0].options.map((option) => cleanForLessonDisplay(option) || "Option not available."),
              correct: Math.max(0, Math.min(entry.quiz[0].correct, Math.max(entry.quiz[0].options.length - 1, 0))),
              explanation: cleanForLessonDisplay(entry.quiz[0].explanation),
            }
          : undefined,
        processedContent: {
          mainTopic: title,
          keyConcepts: normalizedConcepts,
          learningObjectives: [...(entry.learningObjectives ?? [])],
          visualModel: entry.visualModel
            ? {
                title: entry.visualModel.title,
                nodes: [...entry.visualModel.nodes],
                caption: entry.visualModel.caption,
              }
            : undefined,
          activity,
          assignment,
          fallbackReason: entry.fallbackReason,
        },
        steps,
      };

      return lesson;
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
  }

  if (!q) {
    const focus = firstSentence(lesson.learningFocus, `The lesson explains ${lesson.title}.`);
    const shifted = withShiftedCorrectOption(
      [
        focus,
        `It focuses on unrelated details rather than the core concept of ${lesson.title}.`,
        `It lists terms without explaining how they connect to ${lesson.title}.`,
        "It gives instructions without discussing the lesson concept.",
      ],
      0,
      lesson.id + lessonIndex,
    );
    drafts.push({
      grade: lesson.grade,
      subject: lesson.subject,
      sourcePdf: lesson.sourcePdf,
      question: `What best summarizes the lesson topic "${lesson.title}"?`,
      options: shifted.options,
      correct: shifted.correct,
      explanation: focus,
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
