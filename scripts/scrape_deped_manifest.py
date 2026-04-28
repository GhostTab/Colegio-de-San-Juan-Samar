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
    json_output = Path("src/lib/depedDlpManifest.json")
    json_output.write_text(json.dumps(manifest, indent=2, ensure_ascii=False), encoding="utf-8")

    ts_output = Path("src/lib/depedDlpManifest.ts")
    ts_output.write_text(
        f"export const depedDlpManifest = {json.dumps(manifest, indent=2, ensure_ascii=False)} as const;\n",
        encoding="utf-8",
    )
    print(f"Wrote {json_output}")
    print(f"Wrote {ts_output}")


if __name__ == "__main__":
    main()
