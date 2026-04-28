import { describe, expect, it } from "vitest";
import { getLrModulesFor } from "@/lib/depedLrModuleIndex";
import { lessons } from "@/lib/contentData";

function extractGradeFromSource(source?: string) {
  if (!source) return null;
  const match = source.match(/dlp-grade-(\d+)/i);
  return match ? Number(match[1]) : null;
}

describe("deped lesson mapping", () => {
  it("maps AP modules to grade-specific DLP quarter pages", () => {
    const g7 = getLrModulesFor(7, "ap");
    const g8 = getLrModulesFor(8, "ap");

    expect(g7.length).toBeGreaterThan(0);
    expect(g8.length).toBeGreaterThan(0);
    expect(g7.every((m) => m.file.includes("dlp-grade-7"))).toBe(true);
    expect(g8.every((m) => m.file.includes("dlp-grade-8"))).toBe(true);
  });

  it("does not fallback unknown subjects to Grade 7 templates", () => {
    const unknown = getLrModulesFor(8, "unknown-subject-id");
    expect(unknown).toEqual([]);
  });

  it("keeps lesson source grade aligned with lesson grade", () => {
    const mismatched = lessons.filter((lesson) => {
      const sourceGrade = extractGradeFromSource(lesson.sourcePdf);
      return sourceGrade !== null && sourceGrade !== lesson.grade;
    });
    expect(mismatched).toEqual([]);
  });

  it("does not produce unavailable placeholder lessons", () => {
    const badTitles = lessons.filter((lesson) => /lesson content not available yet/i.test(lesson.title));
    expect(badTitles).toEqual([]);
  });

  it("does not include fake framework section names in lesson titles", () => {
    const fake = lessons.filter((lesson) => /(discussion|explanation and examples|overview|mastery check)/i.test(lesson.title));
    expect(fake).toEqual([]);
  });

  it("uses scraped content for Grade 7 AP quarter 1 lesson", () => {
    const lesson = lessons.find((item) => item.grade === 7 && item.subject === "ap" && item.order === 1);

    expect(lesson).toBeDefined();
    expect(lesson?.steps.length).toBeGreaterThan(1);
    expect(lesson?.steps.map((step) => step.content).join(" ")).toContain("Timog");
    expect(lesson?.steps.map((step) => step.content).join(" ")).not.toMatch(/Actual lesson content not available/i);
  });

  it("turns scraped lessons into a five-step teaching flow", () => {
    const scrapedLesson = lessons.find((lesson) => lesson.sourcePdf?.includes("Source index:"));

    expect(scrapedLesson).toBeDefined();
    expect(scrapedLesson?.steps.map((step) => step.title)).toEqual([
      "Step 1 - Introduction",
      "Step 2 - Main Discussion",
      "Step 3 - Guided Examples / Practice",
      "Step 4 - Interactive Activity or Assignment",
      "Step 5 - Quiz / Assessment",
    ]);
  });

  it("does not expose source links or raw source labels in lesson step content", () => {
    const leakedSourceText = lessons
      .flatMap((lesson) => lesson.steps.map((step) => step.content))
      .filter((content) => /https?:\/\/|Source index|Source link|Open DepEd resource/i.test(content));

    expect(leakedSourceText).toEqual([]);
  });

  it("uses cleaned topic titles instead of raw file names", () => {
    const rawTitles = lessons.filter((lesson) => /^G\d+\s|\bLAS\d*\b|FCS\s+LAS|\.pdf/i.test(lesson.title));

    expect(rawTitles).toEqual([]);
  });

  it("generates topic-based quiz questions instead of structure questions", () => {
    const weakQuestions = lessons
      .map((lesson) => lesson.contentQuiz?.question ?? "")
      .filter((question) => /lesson step|Lesson Content|Which idea matches/i.test(question));

    expect(weakQuestions).toEqual([]);
  });

  it("builds processed learning content from scraped lessons", () => {
    const scrapedLesson = lessons.find((lesson) => lesson.sourcePdf?.includes("Source index:"));

    expect(scrapedLesson?.processedContent?.mainTopic).toBe(scrapedLesson?.title);
    expect(scrapedLesson?.processedContent?.learningObjectives.length).toBeGreaterThan(0);
    expect(scrapedLesson?.processedContent?.activity?.prompt).toBeTruthy();
    expect(scrapedLesson?.processedContent?.assignment?.prompt).toBeTruthy();
  });

  it("keeps activity and quiz steps inside the lesson player flow", () => {
    const playerOnlySections = lessons
      .flatMap((lesson) => lesson.steps.map((step) => step.title))
      .filter((title) => /Step 4 - Interactive Activity or Assignment|Step 5 - Quiz \/ Assessment/i.test(title));

    expect(playerOnlySections.length).toBeGreaterThan(0);
  });

  it("does not render dangling references to missing UI materials", () => {
    const dangling = lessons
      .flatMap((lesson) => lesson.steps.map((step) => step.content))
      .filter((content) =>
        /\bon the left|on the right|see image|see chart|see map|see diagram|refer to (the )?(poem|passage|chart|map|diagram|image)|read (the )?(poem|passage)\b/i.test(
          content,
        ),
      );

    expect(dangling).toEqual([]);
  });

  it("repairs weak concept fragments into labeled concepts", () => {
    const weakFragments = lessons
      .flatMap((lesson) => lesson.processedContent?.keyConcepts ?? [])
      .filter((concept) => /^(this|what|if|it)\s*[:\-]/i.test(concept));

    expect(weakFragments).toEqual([]);
  });

  it("does not expose card or internal processor labels in student step content", () => {
    const leakedInternalLabels = lessons
      .flatMap((lesson) => lesson.steps.map((step) => step.content))
      .filter((content) => /\bCard\s+\d+\b|Focus concept:/i.test(content));

    expect(leakedInternalLabels).toEqual([]);
  });
});
