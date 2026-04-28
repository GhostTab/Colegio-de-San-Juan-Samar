/**
 * LR-Portal PDF filenames (embedded files on DepEd Google Sites).
 * Teaching text lives in moduleTeachingContent.ts — not duplicated here.
 */
import { depedDlpManifest } from "@/lib/depedDlpManifest";

export type DepedModuleFileRef = {
  file: string;
  quarter: string;
  downloadUrl?: string;
  contentSnippet?: string;
};

export const LR_PORTAL_GRADE_HUB =
  "https://sites.google.com/deped.gov.ph/deped-lrportal/grade-7-10";
export const LR_PORTAL_MATATAG =
  "https://sites.google.com/deped.gov.ph/deped-lrportal/matatag-learning-materials";
export const LR_PORTAL_DLP_BASE =
  "https://sites.google.com/deped.gov.ph/deped-lrportal/dlp-materials";

const subjectPageBySubject: Record<string, string> = {
  math: "https://sites.google.com/deped.gov.ph/deped-lrportal/subjects/grade-7-10/mathematics",
  science: "https://sites.google.com/deped.gov.ph/deped-lrportal/subjects/grade-7-10/science",
  english: "https://sites.google.com/deped.gov.ph/deped-lrportal/subjects/grade-7-10/english",
  filipino: "https://sites.google.com/deped.gov.ph/deped-lrportal/subjects/grade-7-10/filipino",
  ap: "https://sites.google.com/deped.gov.ph/deped-lrportal/subjects/grade-7-10/ap",
  mapeh: "https://sites.google.com/deped.gov.ph/deped-lrportal/subjects/grade-7-10/mapeh",
};

export function resolveLrSubjectPage(subjectId: string, grade: number): string {
  if (subjectId === "ict" || subjectId === "tle") {
    if (grade === 9)
      return "https://sites.google.com/deped.gov.ph/deped-lrportal/subjects/grade-7-10/grade-9-tle";
    if (grade === 10)
      return "https://sites.google.com/deped.gov.ph/deped-lrportal/subjects/grade-7-10/grade-10-tle";
    return "https://sites.google.com/deped.gov.ph/deped-lrportal/subjects/grade-7-10/grade-7-tle";
  }
  return subjectPageBySubject[subjectId] ?? LR_PORTAL_GRADE_HUB;
}

type ManifestEntry = {
  title: string;
  sourcePage: string;
  downloadUrl?: string;
  contentSnippet?: string;
};

function modulesFromManifest(grade: number, subjectId: string): DepedModuleFileRef[] {
  const gradeKey = String(grade) as keyof typeof depedDlpManifest;
  const gradeManifest = depedDlpManifest[gradeKey];
  if (!gradeManifest) return [];

  const subjectManifest = gradeManifest[subjectId as keyof typeof gradeManifest] as
    | Record<string, ManifestEntry>
    | undefined;
  if (!subjectManifest) return [];

  return Object.entries(subjectManifest)
    .sort(([a], [b]) => Number(a) - Number(b))
    .map(([quarter, entry]) => ({
      file: `${entry.title}. Source index: ${entry.sourcePage}`,
      quarter: `Quarter ${quarter}`,
      downloadUrl: entry.downloadUrl,
      contentSnippet: entry.contentSnippet,
    }));
}

export function getLrModulesFor(grade: number, subjectId: string): DepedModuleFileRef[] {
  return modulesFromManifest(grade, subjectId);
}
