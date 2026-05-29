# CVCraft AI — CV Builder with AI Review

A full-stack CV builder web application with AI-powered resume feedback using **Gemini 2.5 Flash**. Users can register, log in, build their CV, and receive detailed AI analysis across content, structure, and ATS compatibility.

---

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [API Reference](#api-reference)
- [AI Review Feature](#ai-review-feature)
- [User Stories](#user-stories)
- [Troubleshooting](#troubleshooting)

---

## Features

- **User Authentication** — Register, login, logout with JWT + bcrypt
- **CV Editor** — Build and edit your CV with live preview
- **Template Selection** — Choose from multiple CV templates
- **AI CV Review** — Upload a PDF and get instant AI feedback powered by Gemini 2.5 Flash
  - Content Score (0–100)
  - Structure Score (0–100)
  - ATS Compatibility Score (0–100)
  - Overall Score (0–100)
  - Strengths, Weaknesses, Actionable Suggestions
  - Keyword analysis (found vs missing)
  - Section checklist

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | HTML, CSS, Vanilla JavaScript |
| Backend | Node.js, Express.js (ESM) |
| Database | MongoDB + Mongoose |
| AI | Google Gemini 2.5 Flash |
| Auth | JWT + bcrypt |
| Validation | Joi |
| File Upload | Multer (memory storage) |

---

## Project Structure

```
cv-builder/
├── backend/
│   ├── app.js                          ← Express entry point
│   ├── .env                            ← Environment variables (not committed)
│   ├── .env.example                    ← Environment variable template
│   ├── package.json
│   ├── controller/
│   │   ├── user.controller.js          ← Register, login, logout
│   │   └── aiFeedback.controller.js    ← AI resume analysis (Gemini 2.5 Flash)
│   ├── middleware/
│   │   ├── authenticate.js             ← JWT verification
│   │   ├── joiValidation.js            ← Request validation
│   │   └── schema/
│   │       ├── userLogin.js
│   │       └── userRegistration.js
│   ├── model/
│   │   ├── registerTables.js           ← Register all Mongoose models
│   │   ├── user/user.table.js
│   │   ├── aiFeedback/aiFeedback.table.js
│   │   ├── authToken/authToken.table.js
│   │   ├── resume/resume.table.js
│   │   ├── resumeSection/resumeSection.table.js
│   │   ├── files/files.table.js
│   │   ├── template/template.table.js
│   │   └── feedbackHistory/feedbackHistory.table.js
│   └── routes/
│       ├── routes.js                   ← Route registration
│       ├── user/userRoute.js           ← Auth routes
│       └── ai/aiFeedbackRoute.js       ← AI feedback route
└── frontend/
    └── index.html                      ← Single-page application
```

---

## Getting Started

### Prerequisites

- Node.js v18+
- MongoDB (local or Atlas)
- Google Gemini API key — [aistudio.google.com/apikey](https://aistudio.google.com/apikey)

### 1. Clone the repository

```bash
git clone https://github.com/Vipul706/SIT725_CV_Builder.git
cd SIT725_CV_Builder
```

### 2. Install backend dependencies

```bash
cd backend
npm install
```

### 3. Configure environment variables

```bash
cp ".env (2).example" .env
```

Edit `.env` with your values (see [Environment Variables](#environment-variables)).

### 4. Start the backend

```bash
npm start
```

You should see:
```
MongoDB connected
All tables registered
server running on port 3000
```

### 5. Serve the frontend

Open a new terminal:

```bash
cd frontend
npx serve . -l 4000
```

### 6. Open in browser

Navigate to **`http://localhost:4000`**

---

## Environment Variables

Create a `.env` file in the `backend/` folder:

```env
# Database
MONGO_URI=mongodb://localhost:27017/cv_builder

# Authentication
JWT_SECRET=your_jwt_secret_here

# AI — Gemini 2.5 Flash
# Get a free key at: https://aistudio.google.com/apikey
GEMINI_API_KEY=your_gemini_api_key_here

# Server
PORT=3000
```

---

## API Reference

Base URL: `http://localhost:3000`

### Authentication

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/UserRegister` | Register a new user | No |
| POST | `/UserLogin` | Login and get JWT token | No |
| POST | `/UserLogout` | Logout and invalidate token | Yes |

#### Register
```bash
curl -X POST http://localhost:3000/UserRegister \
  -H "Content-Type: application/json" \
  -d '{"firstName":"John","lastName":"Doe","email":"john@example.com","password":"password123"}'
```

#### Login
```bash
curl -X POST http://localhost:3000/UserLogin \
  -H "Content-Type: application/json" \
  -d '{"email":"john@example.com","password":"password123"}'
```

### AI Feedback

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/ai/feedback` | Analyze a resume PDF | No |

#### Analyze Resume
```bash
curl -X POST http://localhost:3000/ai/feedback \
  -F "resume=@/path/to/resume.pdf"
```

#### Response
```json
{
  "success": true,
  "meta": {
    "filename": "resume.pdf"
  },
  "feedback": {
    "scores": {
      "content": 70,
      "structure": 60,
      "ats": 65,
      "overall": 66
    },
    "summary": "Strong leadership and technical skills...",
    "strengths": ["...", "...", "..."],
    "weaknesses": ["...", "...", "..."],
    "suggestions": [
      {
        "category": "Structure",
        "priority": "High",
        "suggestion": "Condense resume to 2 pages",
        "impact": "Easier to read and parse by ATS"
      }
    ],
    "keywords": {
      "found": ["Python", "Machine Learning"],
      "missing": ["Supply Chain", "Agile"]
    },
    "sectionAnalysis": {
      "hasContactInfo": true,
      "hasSummary": true,
      "hasExperience": true,
      "hasEducation": true,
      "hasSkills": true,
      "hasAchievements": true
    }
  }
}
```

---

## AI Review Feature

The AI Review page (Page 5) allows users to:

1. Upload any resume PDF
2. The PDF is sent directly to **Gemini 2.5 Flash** as base64
3. Gemini reads and analyzes the resume natively
4. Results are displayed as a visual report including:
   - Color-coded score cards (green ≥ 75, amber ≥ 50, red < 50)
   - Animated progress bars for each score
   - Categorized suggestions with priority badges
   - Keyword chips (found vs missing)
   - Section presence checklist

### Scoring Rubric

| Score | Weight | Measures |
|-------|--------|---------|
| Content | 40% | Writing quality, action verbs, quantified achievements |
| Structure | 30% | Logical flow, section ordering, readability |
| ATS | 30% | Keyword density, standard headings, parseable format |
| Overall | — | Weighted average of above three |

---

## User Stories

| ID | Story | Status |
|----|-------|--------|
| US1 | As a user, I can register an account | ✅ Done |
| US2 | As a user, I can log in to my account | ✅ Done |
| US3 | As a user, I can log out | ✅ Done |
| US4 | As a user, I can upload my resume and get AI feedback | ✅ Done |
| US5 | As a user, I can see scores for content, structure, ATS, and overall | ✅ Done |
| US6 | As a user, I can see actionable suggestions to improve my resume | ✅ Done |

---

## Troubleshooting

| Problem | Fix |
|---------|-----|
| `MongoDB connected` not showing | Make sure MongoDB is running: `mongod` |
| `GEMINI_API_KEY` error | Add your key to `.env` — get one free at [aistudio.google.com](https://aistudio.google.com/apikey) |
| CORS error in browser | Make sure `app.use(cors())` is in `app.js` with no restrictions |
| Frontend can't reach backend | Backend must be on port 3000, frontend on a different port (e.g. 4000) |
| `Cannot GET /` | Normal — the backend has no root route, only `/UserRegister`, `/UserLogin`, `/ai/feedback` |
| AI analysis timeout | Gemini 2.5 Flash may take 15–30s — wait it out |

---

## Links

- GitHub: [github.com/Vipul706/SIT725_CV_Builder](https://github.com/Vipul706/SIT725_CV_Builder)
- Gemini API: [aistudio.google.com](https://aistudio.google.com)
- Node.js: [nodejs.org](https://nodejs.org)
- MongoDB: [mongodb.com](https://mongodb.com)
