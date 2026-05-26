# Resume AI Feedback — Gemini 2.5 Flash

**Author: Muhammad Nouman Qaiser — Deakin University**

A Python script that analyzes a resume PDF using Google's Gemini 2.5 Flash model and returns a detailed, structured evaluation with scores and actionable suggestions.

---

## What It Does

For any resume PDF, the script produces:

| Output | Description |
|---|---|
| **Content Score** | Writing quality, action verbs, quantified achievements |
| **Structure Score** | Logical flow, section ordering, readability |
| **ATS Score** | Keyword density, standard headings, parseable format |
| **Overall Score** | Weighted average (Content 40% + Structure 30% + ATS 30%) |
| **Summary** | 2–3 sentence overview of the resume's current state |
| **Strengths & Weaknesses** | Key positives and areas of concern |
| **Suggestions** | 5 prioritised, actionable improvements |
| **Keywords** | Found vs. missing industry keywords |
| **Section Checklist** | Detects Contact Info, Summary, Experience, Education, Skills, Achievements |
| **JSON Output** | Full results saved to `resume_feedback_output.json` |

---

## Requirements

- Python 3.8 or higher
- A free Gemini API key → [Get one here](https://aistudio.google.com/apikey)

### Dependencies

The script auto-installs these on first run, or install manually:

```bash
pip install google-generativeai pypdf python-dotenv
```

---

## Setup & Usage

**1. Clone or download the script**

```bash
git clone <your-repo-url>
cd <repo-folder>
```

**2. Place your resume PDF in the same folder as the script**

```
resume_feedback.py
your_resume.pdf        ← put it here
```

**3. Open `resume_feedback.py` and edit the configuration section**

```python
# Line ~25 — paste your Gemini API key
GEMINI_API_KEY = "your_actual_api_key_here"

# Line ~28 — set your PDF filename
RESUME_FILENAME = "your_resume.pdf"
```

**4. Run the script**

```bash
python resume_feedback.py
```

---

## Output

### Console (sample)

```
============================================================
📊  SCORES
============================================================
  Content      ████████████████░░░░  78/100  (Good)
  Structure    ██████████████░░░░░░  70/100  (Good)
  Ats          ████████████░░░░░░░░  62/100  (Fair)
  Overall      ██████████████░░░░░░  71/100  (Good)

────────────────────────────────────────────────────────────
📝  SUMMARY
────────────────────────────────────────────────────────────
  The resume demonstrates solid technical experience but lacks
  quantified achievements and strong ATS optimisation...

🎯  SUGGESTIONS
────────────────────────────────────────────────────────────

  [HIGH] Content
  🔹 Add measurable impact to each bullet point.
  💡 Quantified results dramatically increase recruiter engagement.
...
```

### JSON file

A file called `resume_feedback_output.json` is saved alongside the script, containing the full structured feedback including all scores, suggestions, keywords, and metadata.

---

## Score Interpretation

| Range | Label |
|---|---|
| 80–100 | Excellent |
| 65–79 | Good |
| 50–64 | Fair |
| 0–49 | Needs Work |

---

## Troubleshooting

**"Could not find PDF" error**
Make sure the PDF filename in `RESUME_FILENAME` exactly matches the file in the same folder (including capitalisation and spaces).

**"Very little text extracted" warning**
Your PDF may be scanned/image-based. To fix: open it in Chrome → File → Print → Save as PDF. This re-renders it as a text-based PDF.

**JSON parse error**
This is rare. It means Gemini returned an unexpected format. Re-running the script usually resolves it.

**API key not working**
Double-check the key at [aistudio.google.com](https://aistudio.google.com/apikey) and make sure it has the Generative Language API enabled.

---

## Project Structure

```
.
├── resume_feedback.py          # Main script
├── your_resume.pdf             # Your resume (you provide this)
└── resume_feedback_output.json # Generated after each run
```

---

## License

MIT — free to use, modify, and distribute.
