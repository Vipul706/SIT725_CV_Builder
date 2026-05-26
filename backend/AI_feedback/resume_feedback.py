"""
Resume AI Feedback — Gemini 2.5 Flash
Author: Muhammad Nouman Qaiser — Deakin University

Analyzes a resume PDF and returns:
  - Content Score  — writing quality, action verbs, achievements
  - Structure Score — flow, section ordering, readability
  - ATS Score      — keyword density, parseable format, standard headings
  - Overall Score  — weighted average
  - Actionable suggestions to improve the resume
"""

# ── Cell 1 ── Install dependencies (run once) ──────────────────────────────
import subprocess
import sys

subprocess.check_call([
    sys.executable, '-m', 'pip', 'install',
    'google-generativeai', 'pypdf', 'python-dotenv', '--quiet'
])
print('✅ Dependencies ready')


# ── Cell 2 ── CONFIGURATION  ← Edit this section ───────────────────────────

# Your Gemini API key (get one free at https://aistudio.google.com/apikey)
GEMINI_API_KEY = "your_gemini_api_key_here"

# Name of your resume PDF (must be in the same folder as this script)
RESUME_FILENAME = "MUHAMMAD-NOUMAN-QAISER-.pdf"

print(f'📄 Resume file : {RESUME_FILENAME}')
print(f'🔑 API key set : {"Yes ✅" if GEMINI_API_KEY != "your_gemini_api_key_here" else "❌ NOT SET — edit this file"}')


# ── Cell 3 ── Extract text from the PDF ────────────────────────────────────
import os
from pypdf import PdfReader

# Look for the PDF in the same folder as this script
script_dir = os.path.dirname(os.path.abspath(__file__))
pdf_path = os.path.join(script_dir, RESUME_FILENAME)

if not os.path.exists(pdf_path):
    raise FileNotFoundError(
        f"Could not find '{RESUME_FILENAME}' in {script_dir}\n"
        f"Make sure the PDF is in the same folder as this script."
    )

reader = PdfReader(pdf_path)
pages = reader.pages
resume_text = ''

for i, page in enumerate(pages):
    text = page.extract_text() or ''
    resume_text += text + '\n'

resume_text = resume_text.strip()
word_count = len(resume_text.split())
file_size_kb = os.path.getsize(pdf_path) / 1024

print(f'✅ PDF loaded successfully')
print(f'   File     : {RESUME_FILENAME} ({file_size_kb:.1f} KB)')
print(f'   Pages    : {len(pages)}')
print(f'   Words    : {word_count}')
print(f'   Chars    : {len(resume_text)}')

if word_count < 20:
    print('\n⚠️  Very little text extracted.')
    print('   This may be a scanned/image-based PDF.')
    print('   Try: Open in Chrome → File → Print → Save as PDF')
else:
    print(f'\n--- Text preview (first 400 chars) ---')
    print(resume_text[:400])
    print('...')


# ── Cell 4 ── Send to Gemini 2.5 Flash for analysis ────────────────────────
import google.generativeai as genai
import json
import re
import time

genai.configure(api_key=GEMINI_API_KEY)

# max_output_tokens raised to 8192 to prevent truncated JSON
model = genai.GenerativeModel(
    model_name='gemini-2.5-flash',
    generation_config=genai.GenerationConfig(
        response_mime_type='application/json',
        temperature=0.2,
        max_output_tokens=8192,
    ),
    system_instruction=(
        'You are an expert resume coach and ATS specialist with 15+ years of HR experience. '
        'Evaluate resumes objectively and return ONLY a valid JSON object — no markdown, no backticks.'
    )
)

prompt = f"""Analyze the following resume and return a JSON object with EXACTLY this schema:

{{
  "scores": {{
    "content": <integer 0-100>,
    "structure": <integer 0-100>,
    "ats": <integer 0-100>,
    "overall": <integer 0-100>
  }},
  "summary": "<2-3 sentence overview of the resume's current state>",
  "strengths": ["<strength 1>", "<strength 2>", "<strength 3>"],
  "weaknesses": ["<weakness 1>", "<weakness 2>", "<weakness 3>"],
  "suggestions": [
    {{
      "category": "<Content|Structure|ATS|Keywords|Formatting>",
      "priority": "<High|Medium|Low>",
      "suggestion": "<specific actionable improvement>",
      "impact": "<why this matters for the job search>"
    }}
  ],
  "keywords": {{
    "found": ["<keyword present in resume>"],
    "missing": ["<important missing keyword>"]
  }},
  "sectionAnalysis": {{
    "hasContactInfo": <true|false>,
    "hasSummary": <true|false>,
    "hasExperience": <true|false>,
    "hasEducation": <true|false>,
    "hasSkills": <true|false>,
    "hasAchievements": <true|false>
  }}
}}

Scoring rubric:
- content (0-100): Writing quality, action verbs, quantified achievements, relevance
- structure (0-100): Logical flow, section ordering, readability, consistency
- ats (0-100): Keyword density, standard headings, parseable format, no tables/graphics
- overall (0-100): Weighted — content 40% + structure 30% + ats 30%

Keep suggestions concise (1-2 sentences each). Provide exactly 5 suggestions ordered by priority.

Resume ({len(pages)} pages, {word_count} words):
---
{resume_text[:8000]}
---"""

print('🚀 Sending to Gemini 2.5 Flash...')
start = time.time()

response = model.generate_content(prompt)
raw = response.text

elapsed = time.time() - start
print(f'✅ Response received in {elapsed:.1f}s')
print(f'   Raw response length: {len(raw)} chars')


def extract_json(text):
    """Robust JSON extraction — handles markdown fences, leading/trailing text."""
    # Try direct parse first
    try:
        return json.loads(text.strip())
    except json.JSONDecodeError:
        pass
    # Strip markdown fences
    text = re.sub(r'^```(?:json)?\s*', '', text.strip(), flags=re.MULTILINE)
    text = re.sub(r'```\s*$', '', text.strip(), flags=re.MULTILINE)
    try:
        return json.loads(text.strip())
    except json.JSONDecodeError:
        pass
    # Extract first complete JSON object using brace matching
    start_idx = text.find('{')
    if start_idx == -1:
        raise ValueError('No JSON object found in response')
    depth = 0
    in_string = False
    escape_next = False
    for i, ch in enumerate(text[start_idx:], start=start_idx):
        if escape_next:
            escape_next = False
            continue
        if ch == '\\' and in_string:
            escape_next = True
            continue
        if ch == '"':
            in_string = not in_string
        if not in_string:
            if ch == '{':
                depth += 1
            elif ch == '}':
                depth -= 1
                if depth == 0:
                    return json.loads(text[start_idx:i + 1])
    raise ValueError(f'Could not extract valid JSON. Response preview: {text[:300]}')


try:
    feedback = extract_json(raw)
except Exception as e:
    print(f'❌ JSON parse error: {e}')
    print(f'Raw response (first 500 chars):\n{raw[:500]}')
    raise

# Clamp scores 0-100
for key in ['content', 'structure', 'ats', 'overall']:
    if key in feedback.get('scores', {}):
        feedback['scores'][key] = min(100, max(0, round(feedback['scores'][key])))

print('📊 Analysis complete!')


# ── Cell 5 ── Display results (plain-text version for CLI) ─────────────────

def score_label(n):
    if n >= 80: return 'Excellent'
    if n >= 65: return 'Good'
    if n >= 50: return 'Fair'
    return 'Needs Work'


scores = feedback['scores']

print('\n' + '=' * 60)
print('📊  SCORES')
print('=' * 60)
for key in ['content', 'structure', 'ats', 'overall']:
    n = scores.get(key, 0)
    bar = '█' * (n // 5) + '░' * (20 - n // 5)
    print(f'  {key.capitalize():12} {bar} {n:3}/100  ({score_label(n)})')

print('\n' + '─' * 60)
print('📝  SUMMARY')
print('─' * 60)
print(f"  {feedback.get('summary', '')}\n")

print('─' * 60)
print('💪  STRENGTHS')
print('─' * 60)
for s in feedback.get('strengths', []):
    print(f'  ✅ {s}')

print('\n─' * 60)
print('⚠️   WEAKNESSES')
print('─' * 60)
for w in feedback.get('weaknesses', []):
    print(f'  ❌ {w}')

print('\n─' * 60)
print('🎯  SUGGESTIONS')
print('─' * 60)
for s in feedback.get('suggestions', []):
    print(f"\n  [{s.get('priority','').upper()}] {s.get('category','')} ")
    print(f"  🔹 {s.get('suggestion','')}")
    print(f"  💡 {s.get('impact','')}")

kw = feedback.get('keywords', {})
print('\n─' * 60)
print('🔑  KEYWORDS')
print('─' * 60)
print(f"  Found   : {', '.join(kw.get('found', []))}")
print(f"  Missing : {', '.join(kw.get('missing', []))}")

sa = feedback.get('sectionAnalysis', {})
print('\n─' * 60)
print('📋  SECTION CHECKLIST')
print('─' * 60)
section_map = [
    ('hasContactInfo', 'Contact Info'),
    ('hasSummary', 'Summary'),
    ('hasExperience', 'Experience'),
    ('hasEducation', 'Education'),
    ('hasSkills', 'Skills'),
    ('hasAchievements', 'Achievements'),
]
for key, label in section_map:
    icon = '✅' if sa.get(key, False) else '❌'
    print(f'  {icon} {label}')

print(f'\n  Analysis by Gemini 2.5 Flash · {elapsed:.1f}s · {word_count} words analyzed')


# ── Cell 6 ── Save raw JSON output to file ──────────────────────────────────

output_path = os.path.join(script_dir, 'resume_feedback_output.json')
with open(output_path, 'w', encoding='utf-8') as f:
    json.dump({
        'meta': {
            'filename': RESUME_FILENAME,
            'pages': len(pages),
            'wordCount': word_count,
            'processingTimeSeconds': round(elapsed, 2)
        },
        'feedback': feedback
    }, f, indent=2, ensure_ascii=False)

print(f'\n✅ JSON saved to: {output_path}')
