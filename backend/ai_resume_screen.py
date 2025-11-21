# backend/ai_resume_screen.py
import os
import re
from datetime import datetime
import fitz
import docx2txt
from sentence_transformers import SentenceTransformer, util

# Embedding model (loads once)
model = SentenceTransformer("sentence-transformers/all-MiniLM-L6-v2")


# ============ TEXT EXTRACTION ==================
def extract_text(path):
    ext = os.path.splitext(path)[1].lower()
    try:
        if ext == ".pdf":
            text = ""
            with fitz.open(path) as doc:
                for p in doc:
                    text += p.get_text()
            return text
        elif ext == ".docx":
            return docx2txt.process(path)
        elif ext == ".txt":
            return open(path, "r", encoding="utf-8", errors="ignore").read()
    except:
        return ""
    return ""


# ============ NORMALIZATION ==================
def normalize(text):
    text = text.lower()
    text = re.sub(r"[^a-z0-9\s\+\#\-\._]", " ", text)
    text = re.sub(r"\s+", " ", text)
    return text.strip()


# ============ PARSE JD (WITH OR-GROUP SUPPORT) ==================
def parse_jd(jd_text):
    def find(name):
        m = re.search(rf"{name}\s*[:\-]\s*(.*)", jd_text, re.IGNORECASE)
        return m.group(1) if m else ""

    def process_section(text_block):
        if not text_block:
            return []

        groups = [grp.strip() for grp in re.split(r"[,\n;\|]+", text_block) if grp.strip()]
        final = []

        for grp in groups:
            if "/" in grp:
                or_parts = [p.strip() for p in grp.split("/") if p.strip()]
                final.append(or_parts)
            else:
                final.append(grp.strip())

        return final

    primary = process_section(find("Primary Skills") or find("Primary"))
    secondary = process_section(find("Secondary Skills") or find("Secondary"))
    other = process_section(find("Other Skills") or find("Other"))

    return {"primary": primary, "secondary": secondary, "other": other}


# ============ AUTO-SYNONYMS FOR SKILLS ==================
def expand_skill(skill):
    s = normalize(skill)
    parts = re.split(r"[\/,]+", s)
    expansions = set(parts)

    for p in parts:
        expansions.add(p)
        expansions.add(p.replace(" ", ""))
        expansions.add(p.replace(" ", "-"))
        expansions.add(p.replace("-", ""))
        expansions.add(p.replace("-", " "))

        if "swift" in p:
            expansions.update([
                "swift ui",
                "swiftui",
                "swift-ui",
                "ios swift",
                "ios developer swift",
                "ios swiftui",
                "swift programming"
            ])

    return list(expansions)


# ============ SEMANTIC MATCH ==================
def semantic_match(skill, resume_text, threshold=0.55):
    skill_emb = model.encode(skill)
    sentences = [s.strip() for s in re.split(r"[,\n;]+", resume_text) if s.strip()]
    if not sentences:
        sentences = [resume_text]

    for sent in sentences:
        sim = util.cos_sim(skill_emb, model.encode(sent)).item()
        if sim >= threshold:
            print(f"  ✓ Semantic match: '{skill}' ↔ '{sent[:60]}' (sim={sim:.2f})")
            return True
    return False


# ============ MATCH ONE SKILL ==================
def match_skill(skill, resume_text, resume_norm):
    variants = expand_skill(skill)
    for v in variants:
        if v in resume_norm:
            print(f"  ✓ Text match: '{skill}' → '{v}' found in resume")
            return True

    for v in variants:
        if semantic_match(v, resume_text):
            return True

    print(f"  ✗ NO match found for '{skill}'")
    return False


# ============ MATCH SKILL GROUP (OR CONDITION) ==================
def match_skill_group(skill_group, resume_text, resume_norm):
    if isinstance(skill_group, list):
        print(f"Checking OR-Group: {skill_group}")
        for skill in skill_group:
            if match_skill(skill, resume_text, resume_norm):
                print(f"  ✓ OR-Group satisfied by: {skill}")
                return True
        print(f"  ✗ OR-Group failed: {skill_group}")
        return False
    return match_skill(skill_group, resume_text, resume_norm)


# ============ YEARS OF EXPERIENCE (exclude education) ==================
def extract_years_of_experience(resume_text):
    text = resume_text.lower()

    education_keywords = [
        "education", "academic", "academics", "qualification", "qualifications",
        "b.e", "btech", "b.tech", "m.tech", "bsc", "msc", "graduation",
        "university", "college", "degree", "pg", "ug"
    ]

    for edu in education_keywords:
        idx = text.find(edu)
        if idx != -1:
            start = max(0, idx - 50)
            end = min(len(text), idx + 500)
            text = text[:start] + " " + text[end:]

    date_pattern = re.compile(
        r'(?P<start>(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)?\.?\s*\d{4}|\d{4})'
        r'\s*[-–to]+\s*'
        r'(?P<end>(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)?\.?\s*\d{4}|present|current)',
        re.IGNORECASE
    )

    matches = list(date_pattern.finditer(text))
    if not matches:
        return 0

    start_years = []
    end_years = []

    def extract_year(val):
        m = re.search(r"\d{4}", val)
        return int(m.group()) if m else None

    for match in matches:
        start = match.group("start")
        end = match.group("end")

        sy = extract_year(start)
        if not sy or sy < 1975 or sy > datetime.now().year:
            continue

        if "present" in end.lower() or "current" in end.lower():
            ey = datetime.now().year
        else:
            ey = extract_year(end)

        if ey and ey >= sy:
            start_years.append(sy)
            end_years.append(ey)

    if not start_years or not end_years:
        return 0

    total = max(end_years) - min(start_years)
    return round(total, 1)


# ============ ANALYZE RESUME ==================
def analyze_resume(jd_skills, resume_text):
    resume_norm = normalize(resume_text)

    primary = jd_skills.get("primary", [])
    secondary = jd_skills.get("secondary", [])
    other = jd_skills.get("other", [])

    matched_primary = []
    matched_secondary = []
    matched_other = []

    for group in primary:
        if match_skill_group(group, resume_text, resume_norm):
            matched_primary.append(group)

    for group in secondary:
        if match_skill_group(group, resume_text, resume_norm):
            matched_secondary.append(group)

    for group in other:
        if match_skill_group(group, resume_text, resume_norm):
            matched_other.append(group)

    missing_primary = [g for g in primary if g not in matched_primary]
    missing_secondary = [g for g in secondary if g not in matched_secondary]

    p_score = round(len(matched_primary) / len(primary) * 100, 2) if primary else 0
    s_score = round(len(matched_secondary) / len(secondary) * 100, 2) if secondary else 0
    overall = round(p_score * 0.8 + s_score * 0.2, 2)
    status = "Selected" if overall >= 60 else "Not Selected"

    def stringify(groups):
        result = []
        for g in groups:
            if isinstance(g, list):
                result.append("/".join(g))
            else:
                result.append(g)
        return ", ".join(result)

    years_exp = extract_years_of_experience(resume_text)

    return {
        "Strengths": stringify(matched_primary + matched_secondary + matched_other),
        "Missing Primary": stringify(missing_primary),
        "Missing Secondary": stringify(missing_secondary),
        "Primary Score": p_score,
        "Secondary Score": s_score,
        "Overall Score": overall,
        "Years of Experience": years_exp,
        "Status": status
    }
