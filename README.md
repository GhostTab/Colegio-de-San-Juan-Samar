# CSJS Multimedia Animation Learning System

CSJS Multimedia Animation Learning System is a Grade 7-10 lesson app that transforms scraped DepEd LR Portal learning materials into structured, student-friendly digital lessons.

The app is **not** a chatbot for end users. Instead, it uses deterministic application logic to:

- scrape LR-Portal lesson files
- clean and parse raw module text
- build structured lesson content (title, discussion, examples, objectives)
- generate concept-based quizzes and in-app activities
- display lessons by grade + subject + quarter

## Tech Stack

- `React` + `TypeScript` + `Vite`
- `Tailwind CSS`
- `Framer Motion`
- `Vitest` for tests
- Python scraper using `requests` + `pypdf`

## Project Structure

- `src/lib/contentData.ts` - core lesson processing and quiz generation logic
- `src/lib/depedLrModuleIndex.ts` - maps grade/subject to scraped manifest entries
- `src/lib/depedDlpManifest.json` - generated scraped data source
- `src/lib/depedDlpManifest.ts` - TS export of the generated manifest
- `src/pages/LessonViewer.tsx` - lesson player + processed content panels + challenge arena
- `scripts/scrape_deped_manifest.py` - scraper that builds the manifest files
- `src/test/lessonMapping.test.ts` - tests for mapping integrity and processed lesson quality

## Run Locally

```bash
npm install
npm run dev
```

Build and tests:

```bash
npm run build
npm test -- lessonMapping
```

## Scraping and Manifest Generation

Regenerate lesson source data:

```bash
python scripts/scrape_deped_manifest.py
```

This writes:

- `src/lib/depedDlpManifest.json`
- `src/lib/depedDlpManifest.ts`

## Lesson Processing Pipeline

For each scraped module, the app performs:

1. **Title normalization**  
   Cleans raw filename/title noise (LAS tags, copy markers, grade markers) into a readable topic title.

2. **Content cleanup**  
   Removes boilerplate worksheet headers and form noise.

3. **Section extraction**  
   Detects concept/discussion/example cues from the lesson snippet.

4. **Structured lesson output**  
   Produces lesson-player steps:
   - Lesson Introduction
   - Discussion
   - Examples

5. **Processed learning metadata**  
   Produces:
   - main topic
   - key concepts
   - learning objectives
   - visual concept model
   - activity prompt + expected keywords
   - assignment prompt/checklist + expected keywords

6. **Concept-based quiz generation**  
   Builds questions that test topic understanding, not UI labels or section names.

7. **Fallback behavior**  
   If lesson content is incomplete, the app shows a clear unavailability message instead of inventing fake lesson content.

## Why AP Previously Had More Lessons

Earlier, the scraper relied on section-header parsing from page text, which captured AP content more consistently than other subjects.  
It has been updated to infer subject mapping from each downloadable PDF title, so non-AP subjects now collect many more valid quarter entries.

Lesson counts still vary by grade/subject when source files are genuinely missing or unavailable in LR-Portal.

## Current Data Notes

- Counts are driven by available LR-Portal source files.
- Some subjects (for example Grade 10 ICT/TLE) may still have fewer or zero entries until source files are published or discoverable.
- Quarter filtering in the UI uses `grade + subject + quarter`.

## Quality Checks

`lessonMapping` tests verify:

- grade/source alignment
- no Grade 7 leakage into other grades
- cleaned titles (no raw file-name style)
- topic-based quiz wording
- processed lesson metadata presence
- lesson-player steps remain focused and uncluttered
