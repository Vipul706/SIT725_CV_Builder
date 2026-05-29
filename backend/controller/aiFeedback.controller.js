import { GoogleGenerativeAI } from '@google/generative-ai'
import { AIFeedback } from '../model/aiFeedback/aiFeedback.table.js'

function extractJson (raw) {
  try { return JSON.parse(raw.trim()) } catch (_) {}
  const stripped = raw.replace(/```json|```/g, '').trim()
  try { return JSON.parse(stripped) } catch (_) {}
  const start = stripped.indexOf('{')
  if (start === -1) throw new Error('No JSON found in AI response')
  let depth = 0; let inStr = false; let esc = false
  for (let i = start; i < stripped.length; i++) {
    const c = stripped[i]
    if (esc) { esc = false; continue }
    if (c === '\\' && inStr) { esc = true; continue }
    if (c === '"') inStr = !inStr
    if (!inStr) {
      if (c === '{') depth++
      else if (c === '}') { depth--; if (depth === 0) return JSON.parse(stripped.slice(start, i + 1)) }
    }
  }
  throw new Error('Could not extract valid JSON from AI response')
}

const getAIFeedback = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file uploaded. Send a PDF with field name "resume".' })
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)
    const model = genAI.getGenerativeModel({
      model: 'gemini-2.5-flash',
      generationConfig: {
        responseMimeType: 'application/json',
        temperature: 0.2,
        maxOutputTokens: 8192
      },
      systemInstruction:
        'You are an expert resume coach and ATS specialist with 15+ years of HR experience. ' +
        'Return ONLY a valid JSON object — no markdown, no backticks.'
    })

    // Send PDF directly to Gemini as inline data — no text extraction needed
    const pdfBase64 = req.file.buffer.toString('base64')

    const prompt = `Analyze the resume in the attached PDF and return a JSON object with EXACTLY this schema:

{
  "scores": {
    "content": <integer 0-100>,
    "structure": <integer 0-100>,
    "ats": <integer 0-100>,
    "overall": <integer 0-100>
  },
  "summary": "<2-3 sentence overview>",
  "strengths": ["<strength 1>", "<strength 2>", "<strength 3>"],
  "weaknesses": ["<weakness 1>", "<weakness 2>", "<weakness 3>"],
  "suggestions": [
    {
      "category": "<Content|Structure|ATS|Keywords|Formatting>",
      "priority": "<High|Medium|Low>",
      "suggestion": "<actionable improvement>",
      "impact": "<why it matters>"
    }
  ],
  "keywords": {
    "found": ["<keyword>"],
    "missing": ["<keyword>"]
  },
  "sectionAnalysis": {
    "hasContactInfo": <bool>,
    "hasSummary": <bool>,
    "hasExperience": <bool>,
    "hasEducation": <bool>,
    "hasSkills": <bool>,
    "hasAchievements": <bool>
  }
}

Scoring: content=40%, structure=30%, ats=30% for overall. Provide exactly 5 suggestions by priority.`

    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error('AI analysis timed out')), 30000)
    )

    let aiResult
    try {
      const result = await Promise.race([
        model.generateContent([
          {
            inlineData: {
              mimeType: 'application/pdf',
              data: pdfBase64
            }
          },
          { text: prompt }
        ]),
        timeoutPromise
      ])
      aiResult = extractJson(result.response.text())
    } catch (err) {
      return res.status(502).json({ success: false, message: 'AI analysis failed. Please try again.', error: err.message })
    }

    for (const key of ['content', 'structure', 'ats', 'overall']) {
      if (typeof aiResult.scores?.[key] === 'number') {
        aiResult.scores[key] = Math.min(100, Math.max(0, Math.round(aiResult.scores[key])))
      }
    }

    let savedFeedback = null
    try {
      if (req.body.resumeId) {
        savedFeedback = await AIFeedback.create({
          resumeId: req.body.resumeId,
          contentScore: aiResult.scores.content,
          structureScore: aiResult.scores.structure,
          atsScore: aiResult.scores.ats,
          overallScore: aiResult.scores.overall,
          suggestions: (aiResult.suggestions || []).map(s => s.suggestion)
        })
      }
    } catch (_) {}

    return res.status(200).json({
      success: true,
      meta: { filename: req.file.originalname },
      feedback: aiResult,
      ...(savedFeedback && { savedId: savedFeedback._id })
    })
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Server error.', error: error.message })
  }
}

export { getAIFeedback }