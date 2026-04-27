/**
 * LR-Portal PDF filenames (embedded files on DepEd Google Sites).
 * Teaching text lives in moduleTeachingContent.ts — not duplicated here.
 */

export type DepedModuleFileRef = {
  file: string;
  quarter: string;
};

export const LR_PORTAL_GRADE_HUB =
  "https://sites.google.com/deped.gov.ph/deped-lrportal/grade-7-10";
export const LR_PORTAL_MATATAG =
  "https://sites.google.com/deped.gov.ph/deped-lrportal/matatag-learning-materials";

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

function mathModules(grade: number): DepedModuleFileRef[] {
  const g = grade;
  return [
    { file: `MATH${g} ADM MODULE 1.pdf`, quarter: "Quarter 1" },
    { file: `MATH${g} ADM MODULE 2.pdf`, quarter: "Quarter 1" },
    { file: `G${g}-Q1-MATH-SLEM.pdf`, quarter: "Quarter 1" },
  ];
}

function scienceModules(grade: number): DepedModuleFileRef[] {
  const g = grade;
  return [
    { file: `SCI${g} ADM MODULE 1.pdf`, quarter: "Quarter 1" },
    { file: `SCI${g} ADM MODULE 2.pdf`, quarter: "Quarter 1" },
    { file: `G${g}-Q1-SCI-SLEM.pdf`, quarter: "Quarter 1" },
  ];
}

function englishModules(grade: number): DepedModuleFileRef[] {
  const g = grade;
  return [
    { file: `ENG${g} ADM MODULE 1.pdf`, quarter: "Quarter 1" },
    { file: `ENG${g} ADM MODULE 2.pdf`, quarter: "Quarter 1" },
    { file: `G${g}-Q1-ENG-LAS.pdf`, quarter: "Quarter 1" },
  ];
}

function filipinoModules(grade: number): DepedModuleFileRef[] {
  const g = grade;
  return [
    { file: `FIL${g} ADM MODULE 1.pdf`, quarter: "Quarter 1" },
    { file: `FIL${g} ADM MODULE 2.pdf`, quarter: "Quarter 1" },
    { file: `G${g}-Q1-FIL-SLEM.pdf`, quarter: "Quarter 1" },
  ];
}

function apModules(grade: number): DepedModuleFileRef[] {
  const g = grade;
  return [
    { file: `AP${g} ADM MODULE 1.pdf`, quarter: "Quarter 1" },
    { file: `AP${g} ADM MODULE 2.pdf`, quarter: "Quarter 1" },
    { file: `G${g}-Q1-AP-LAS.pdf`, quarter: "Quarter 1" },
  ];
}

function ictTleModules(grade: number, subjectId: "ict" | "tle"): DepedModuleFileRef[] {
  const label = subjectId === "ict" ? "ICT" : "TLE";
  return [
    { file: `${label} ${grade} Q1 Module 1.pdf`, quarter: "Quarter 1" },
    { file: `${label} ${grade} Q1 Module 2.pdf`, quarter: "Quarter 1" },
    { file: `G${grade}-Q1-${label}-LAS.pdf`, quarter: "Quarter 1" },
  ];
}

function mapehModules(grade: number): DepedModuleFileRef[] {
  if (grade === 7) {
    return [
      {
        file: "music7_q1_mod1_music of lowlands of luzon folksongs from the lowlands_v2.pdf",
        quarter: "Quarter 1 — Music",
      },
      {
        file: "Arts7_Q1_Mod1_ArtsAndCraftsOfLuzonAttiresFabricsAndTapestriesCraftsAndAccessoriesAndBodyOrnament_v2.pdf",
        quarter: "Quarter 1 — Arts",
      },
      { file: "pe7_q1_mod1_physical-fitness-test_v2.pdf", quarter: "Quarter 1 — PE" },
    ];
  }
  const g = grade;
  return [
    {
      file: `music${g}_q1_mod1_(see LR-Portal MAPEH embedded list for exact filename).pdf`,
      quarter: "Quarter 1 — Music",
    },
    {
      file: `Arts${g}_Q1_Mod1_(see LR-Portal MAPEH embedded list).pdf`,
      quarter: "Quarter 1 — Arts",
    },
    { file: `pe${g}_q1_mod1_(see LR-Portal MAPEH embedded list).pdf`, quarter: "Quarter 1 — PE" },
  ];
}

export function getLrModulesFor(grade: number, subjectId: string): DepedModuleFileRef[] {
  switch (subjectId) {
    case "math":
      return mathModules(grade);
    case "science":
      return scienceModules(grade);
    case "english":
      return englishModules(grade);
    case "filipino":
      return filipinoModules(grade);
    case "ap":
      return apModules(grade);
    case "mapeh":
      return mapehModules(grade);
    case "ict":
    case "tle":
      return ictTleModules(grade, subjectId);
    default:
      return mathModules(grade);
  }
}
