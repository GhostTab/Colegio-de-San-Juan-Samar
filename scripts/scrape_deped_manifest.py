import html
import io
import json
import re
from pathlib import Path

import requests
from pypdf import PdfReader

GRADES = [7, 8, 9, 10]
QUARTERS = [1, 2, 3, 4]
MATATAG_URL = "https://sites.google.com/deped.gov.ph/deped-lrportal/matatag-learning-materials"
DLP_BASE_URL = "https://sites.google.com/deped.gov.ph/deped-lrportal/dlp-materials"
SUBJECT_IDS = ["math", "science", "english", "filipino", "ap", "ict", "mapeh", "tle"]
MAX_SNIPPET_CHARS = 1200


def normalize_space(value: str) -> str:
    return re.sub(r"\s+", " ", value).strip()


def infer_subject_from_title(title: str, grade: int) -> str | None:
    upper = title.upper()

    # If a different grade is explicitly tagged, skip this file.
    other_grade = re.search(r"\bG(?:RADE)?\s*([7-9]|10)\b", upper)
    if other_grade and int(other_grade.group(1)) != grade:
        return None

    token_map: list[tuple[str, tuple[str, ...]]] = [
        ("ap", (" ARALING PANLIPUNAN", " AP", "_AP", "-AP", "AP7", "AP8", "AP9", "AP10")),
        ("math", (" MATH", "MATHEMATICS", "_MATH", "-MATH")),
        ("science", (" SCIENCE", "_SCIENCE", "-SCIENCE")),
        ("english", (" ENGLISH", " ENG", "_ENG", "-ENG")),
        ("filipino", (" FILIPINO", " FIL", "_FIL", "-FIL")),
        ("ict", (" ICT", "TLE - ICT", "CSS", "COMPUTER")),
        ("mapeh", (" MAPEH", "MUSIC", "ARTS", "PEH", "MA8", "MA7", "MA9", "MA10", "-MA", "_MA")),
        ("tle", (" TLE", "FCS", "AFA", "IA", "EIM", "BEAUTY", "WELLNESS", "HOSPITALITY", "TOURISM")),
    ]

    for subject_id, patterns in token_map:
        if any(pattern in upper for pattern in patterns):
            return subject_id
    return None


def normalize_title(raw_title: str) -> str:
    base_title = re.sub(r"\.pdf$", "", raw_title, flags=re.IGNORECASE)
    title = re.sub(
        r"\b(Q[1-4]|Quarter\s*[1-4]|LAS\d*|LAS(?:&TN)?|TN|RTP|FIN|DLP|CONSOLIDATED|Copy|Final|Camera Ready)\b",
        " ",
        base_title,
        flags=re.IGNORECASE,
    )
    title = re.sub(r"\b(FCS|HE|TLE|TVL|SLEM|ADM|CO|MELC)\s*\d*\b", " ", title, flags=re.IGNORECASE)
    title = re.sub(r"\b(Eng|Math|Science|Filipino|AP|ICT|TLE|MA|PEH)\s*\d{0,2}\b", " ", title, flags=re.IGNORECASE)
    title = re.sub(r"\bG\d{1,2}\b", " ", title, flags=re.IGNORECASE)
    title = re.sub(r"\bGrade\s*\d{1,2}\b", " ", title, flags=re.IGNORECASE)
    title = re.sub(r"\b\d+\b", " ", title)
    title = normalize_space(re.sub(r"[_-]+", " ", title))
    if not title:
        title = normalize_space(re.sub(r"[_-]+", " ", base_title))
        title = re.sub(r"\b(Q[1-4]|Quarter\s*[1-4]|G\d{1,2}|Grade\s*\d{1,2})\b", " ", title, flags=re.IGNORECASE)
        title = normalize_space(title)
    if not title:
        return "Untitled Lesson"
    words = title.split(" ")
    small = {"ang", "at", "ng", "sa", "of", "and", "or", "the", "to", "in"}
    titled = []
    for idx, word in enumerate(words):
        lower = word.lower()
        if idx > 0 and lower in small:
            titled.append(lower)
        else:
            titled.append(lower.capitalize())
    fixed = " ".join(titled)
    fixed = re.sub(r"\b(Ict|Ap|Tle|Mapeh)\b", lambda m: m.group(1).upper(), fixed)
    return fixed


def split_sentences(text: str) -> list[str]:
    chunks = [part.strip() for part in re.split(r"(?<=[.!?])\s+", normalize_space(text)) if part.strip()]
    return [c for c in chunks if len(c) >= 18]


def clean_snippet(value: str) -> str:
    text = normalize_space(value)
    text = re.sub(r"https?://\S+", " ", text, flags=re.IGNORECASE)
    text = re.sub(r"Dynamic Learning Program[^.]*\.?", " ", text, flags=re.IGNORECASE)
    text = re.sub(r"Learning Activity Sheet", " ", text, flags=re.IGNORECASE)
    text = re.sub(r"Pangalan:\s*_*|Iskor:\s*_*|Baitang at Seksiyon:\s*_*|Petsa:\s*_*", " ", text, flags=re.IGNORECASE)
    text = re.sub(r"\s+", " ", text).strip()
    return text


def first_sentence(text: str, fallback: str) -> str:
    sentences = split_sentences(text)
    if not sentences:
        return fallback
    value = sentences[0]
    return value[:120] + "..." if len(value) > 120 else value


def extract_key_concepts(text: str, topic: str) -> list[str]:
    concepts: list[str] = []
    for match in re.finditer(
        r"([A-ZÀ-ÚA-Za-zÀ-ÿ][A-Za-zÀ-ÿ\s-]{3,45})\s+(?:ay|is|are|means|refers to)\s+([^.!?]{24,150})",
        text,
        flags=re.IGNORECASE,
    ):
        concept = f"{normalize_title(match.group(1))}: {normalize_space(match.group(2))}"
        if not re.search(r"learning|activity|pagsasanay|panuto", concept, flags=re.IGNORECASE):
            concepts.append(concept)

    for match in re.finditer(r"([A-ZÀ-ÚA-Za-zÀ-ÿ][A-Za-zÀ-ÿ\s-]{3,45})\s*\(([^)]{3,50})\)", text):
        concepts.append(f"{normalize_title(match.group(1))}: {normalize_space(match.group(2))}")

    for token in re.split(r"\s+(?:at|and|ng|sa|of|to|in)\s+", topic, flags=re.IGNORECASE):
        token = normalize_space(token)
        if len(token) >= 5:
            concepts.append(normalize_title(token))

    unique: list[str] = []
    seen: set[str] = set()
    for item in concepts:
        key = item.lower()
        if key in seen:
            continue
        seen.add(key)
        unique.append(item)
    return unique[:5]


def extract_examples(text: str, topic: str) -> list[str]:
    cues = re.compile(r"(halimbawa|example|tulad|gamit ang|for instance|1\.|2\.|3\.)", re.IGNORECASE)
    examples = [s for s in split_sentences(text) if cues.search(s)]
    if examples:
        return examples[:3]
    return [
        f"When studying {topic}, connect each key term to a real situation and explain why the example fits the lesson.",
    ]


def keyword_from_concept(concept: str) -> str:
    return normalize_space(re.sub(r"[^\w\s-]", "", concept.split(":")[0]))


def build_processed_entry(raw_entry: dict[str, str]) -> dict[str, object]:
    snippet = clean_snippet(raw_entry.get("contentSnippet", ""))
    title = normalize_title(raw_entry.get("title", ""))
    if len(snippet) < 120:
        return {
            "title": title,
            "fallbackReason": "Lesson content not available yet",
            "discussion": "",
            "keyConcepts": [],
            "examples": [],
        }

    sentences = split_sentences(snippet)
    discussion = " ".join(sentences[:5]) if sentences else ""
    key_concepts = extract_key_concepts(snippet, title)
    objectives = [
        f"Explain the main idea of {title}.",
        f"Identify key concepts related to {title}.",
        f"Use examples to apply {title} in context.",
    ]
    examples = extract_examples(snippet, title)
    expected_keywords = [keyword_from_concept(c) for c in key_concepts if keyword_from_concept(c)][:4]
    visual_nodes = [title] + [keyword_from_concept(c) for c in key_concepts if keyword_from_concept(c)]
    visual_nodes = [n for n in visual_nodes if n][:5]

    correct = first_sentence(discussion, f"The lesson explains {title}.")
    wrong_pool = [
        f"It focuses on unrelated details rather than the core concept of {title}.",
        f"It lists terms without explaining how they connect to {title}.",
        first_sentence(" ".join(examples), "It gives an unrelated classroom instruction."),
    ]

    return {
        "title": title,
        "discussion": discussion,
        "keyConcepts": key_concepts,
        "learningObjectives": objectives,
        "examples": examples,
        "visualModel": {
            "title": f"{title} Concept Map",
            "nodes": visual_nodes if len(visual_nodes) >= 2 else [title],
            "caption": "Read this from left to right: topic to key ideas.",
        },
        "activity": {
            "prompt": f"In your own words, explain {title}. Include one real example and connect it to at least two key concepts.",
            "expectedKeywords": expected_keywords,
        },
        "assignment": {
            "prompt": f"Write a short study note about {title}. Explain the main idea, include one example, and cite one key concept.",
            "checklist": [
                "States the main idea clearly",
                "Uses at least one lesson concept",
                "Includes a concrete example",
                "Explains why the example fits",
            ],
            "expectedKeywords": expected_keywords,
        },
        "quiz": [
            {
                "question": f"What is the main idea of '{title}'?",
                "options": [correct, *wrong_pool],
                "correct": 0,
                "explanation": correct,
            }
        ],
    }


def build_processed_manifest(
    raw_manifest: dict[str, dict[str, dict[str, dict[str, str]]]]
) -> dict[str, dict[str, dict[str, dict[str, object]]]]:
    processed: dict[str, dict[str, dict[str, dict[str, object]]]] = {}
    for grade, grade_value in raw_manifest.items():
        processed[grade] = {}
        for subject, subject_value in grade_value.items():
            processed[grade][subject] = {}
            for quarter, entry in subject_value.items():
                processed[grade][subject][quarter] = build_processed_entry(entry)
    return processed


def extract_download_links(page_html: str) -> dict[str, str]:
    links: dict[str, str] = {}
    pattern = re.compile(
        r'data-embed-download-url="([^"]+)"[\s\S]{0,1200}?aria-label="Drive,\s*([^"]+?\.pdf)"',
        re.IGNORECASE,
    )
    for raw_url, raw_title in pattern.findall(page_html):
        title = html.unescape(raw_title).strip()
        url = html.unescape(raw_url).replace("&amp;", "&")
        links.setdefault(title, url)
    return links


def extract_pdf_snippet(download_url: str, cache: dict[str, str]) -> str:
    if download_url in cache:
        return cache[download_url]

    try:
        response = requests.get(download_url, timeout=45)
        response.raise_for_status()
        reader = PdfReader(io.BytesIO(response.content))
        text_chunks: list[str] = []
        for page in reader.pages[:3]:
            extracted = page.extract_text() or ""
            if extracted:
                text_chunks.append(extracted)
        snippet = normalize_space(" ".join(text_chunks))
        cache[download_url] = snippet[:MAX_SNIPPET_CHARS]
        return cache[download_url]
    except Exception:
        cache[download_url] = ""
        return ""


def scrape() -> dict[str, dict[str, dict[str, dict[str, str]]]]:
    # Ensure MATATAG index is reachable (source of truth entry point).
    requests.get(MATATAG_URL, timeout=30)

    manifest: dict[str, dict[str, dict[str, dict[str, str]]]] = {
        str(grade): {subject_id: {} for subject_id in SUBJECT_IDS} for grade in GRADES
    }

    snippet_cache: dict[str, str] = {}

    for grade in GRADES:
        for quarter in QUARTERS:
            source_page = f"{DLP_BASE_URL}/dlp-grade-{grade}/quarter-{quarter}"
            try:
                page = requests.get(source_page, timeout=30).text
            except Exception:
                continue

            download_map = extract_download_links(page)
            for raw_title, download_url in download_map.items():
                title = normalize_space(raw_title)
                upper = title.upper()
                if ".PDF" not in upper:
                    continue
                if f"Q{quarter}" not in upper and f"QUARTER {quarter}" not in upper:
                    continue

                section = infer_subject_from_title(title, grade)
                if section is None:
                    continue

                if str(quarter) in manifest[str(grade)][section]:
                    continue

                content_snippet = extract_pdf_snippet(download_url, snippet_cache) if download_url else ""
                manifest[str(grade)][section][str(quarter)] = {
                    "title": title,
                    "sourcePage": source_page,
                    "downloadUrl": download_url,
                    "contentSnippet": content_snippet,
                }

    return manifest


def main() -> None:
    manifest = scrape()
    processed_manifest = build_processed_manifest(manifest)
    json_output = Path("src/lib/depedDlpManifest.json")
    json_output.write_text(json.dumps(manifest, indent=2, ensure_ascii=False), encoding="utf-8")

    ts_output = Path("src/lib/depedDlpManifest.ts")
    ts_output.write_text(
        f"export const depedDlpManifest = {json.dumps(manifest, indent=2, ensure_ascii=False)} as const;\n",
        encoding="utf-8",
    )
    print(f"Wrote {json_output}")
    print(f"Wrote {ts_output}")

    raw_json_output = Path("src/lib/lessonContentRaw.json")
    raw_json_output.write_text(json.dumps(manifest, indent=2, ensure_ascii=False), encoding="utf-8")
    raw_ts_output = Path("src/lib/lessonContentRaw.ts")
    raw_ts_output.write_text(
        f"export const lessonContentRaw = {json.dumps(manifest, indent=2, ensure_ascii=False)} as const;\n",
        encoding="utf-8",
    )

    processed_json_output = Path("src/lib/lessonContentProcessed.json")
    processed_json_output.write_text(json.dumps(processed_manifest, indent=2, ensure_ascii=False), encoding="utf-8")
    processed_ts_output = Path("src/lib/lessonContentProcessed.ts")
    processed_ts_output.write_text(
        f"export const lessonContentProcessed = {json.dumps(processed_manifest, indent=2, ensure_ascii=False)} as const;\n",
        encoding="utf-8",
    )

    print(f"Wrote {raw_json_output}")
    print(f"Wrote {raw_ts_output}")
    print(f"Wrote {processed_json_output}")
    print(f"Wrote {processed_ts_output}")


if __name__ == "__main__":
    main()
