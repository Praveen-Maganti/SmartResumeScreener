# Smart Resume Screener

Smart Resume Screener is an AI-powered applicant tracking system (ATS) that automates the recruitment process by screening candidate resumes against job descriptions using Google's Gemini Large Language Model (LLM).

## Project Structure

The project is divided into a frontend web application and a microservices-based backend.

```text
Smart Resume Screener/
├── smart-resume-screener-frontend/    # Frontend Web Application (Vite + React)
│   ├── src/
│   │   ├── components/                # Reusable UI components (Topbar, Sidebar, Modal, DataTable, etc.)
│   │   ├── pages/                     # Main views (Admin Dashboard, Candidate Portal, Settings, etc.)
│   │   ├── services/                  # API client integration (api.js connecting to the backend gateway)
│   │   ├── contexts/                  # React Contexts (e.g., AuthContext for session management)
│   │   └── utils/                     # Helper functions
│   ├── tailwind.config.js             # Styling configuration
│   └── package.json                   # Frontend dependencies
│
└── smart-resume-screener-backend/     # Backend Microservices Architecture (Spring Boot & Java)
    ├── api-gateway/                   # Spring Cloud Gateway (Routes traffic to respective services)
    ├── auth-service/                  # User registration, authentication, and JWT generation
    ├── job-service/                   # Job creation, storage, and requirement extraction
    ├── resume-service/                # Resume text parsing and candidate profile storage
    ├── screening-service/             # Orchestrates candidate evaluation, scoring, and application state
    └── llm-service/                   # Dedicated service to interface with the Gemini API
```

## AI Integration (LLM Prompts)

The system delegates complex text analysis to the Gemini API via the `llm-service`. We enforce strict JSON responses so the backend can seamlessly deserialize the LLM output into Java DTOs.

Here are the specific prompts used within `LlmServiceImpl`:

### 1. Resume Parsing (`analyzeResume`)
Used to automatically extract structured data from raw resume text when a candidate applies.
```text
You are an expert technical recruiter AI. Extract the following information from this resume. Respond ONLY with a valid raw JSON object, no markdown formatting. Schema: 
{ "candidateName": "string", "skills": ["skill1", "skill2"], "yearsOfExperience": number, "educationLevel": "string" }

Resume:
[Resume Text Provided Here]
```

### 2. Job Description Analysis (`analyzeJobDescription`)
Used when an Admin creates a new job to automatically extract and categorize the required and preferred skills.
```text
You are an expert technical recruiter AI. Analyze this job description and extract required and preferred skills. Respond ONLY with a valid raw JSON object, no markdown formatting. Schema: 
{ "requiredSkills": ["skill1"], "preferredSkills": ["skill2"] }

Job Description:
[Job Description Text Provided Here]
```

### 3. Candidate Evaluation (`evaluateCandidate`)
Used to compare a candidate's parsed resume against a specific job's requirements, generating a match score and detailed feedback.
```text
You are an expert technical recruiter AI. Evaluate this candidate against the job requirements. Respond ONLY with a valid raw JSON object, no markdown formatting. Schema: 
{ "score": number (0-100), "strengths": ["strength1"], "weaknesses": ["weakness1"], "improvementSuggestions": ["suggestion1"], "unfitReasons": ["reason1"], "recommendation": "STRONG SHORTLIST" or "SHORTLIST" or "REVIEW", "summary": "string" }

Job Description:
[Job Description Text Provided Here]
Required Skills:
[Job Skills Provided Here]

Candidate Resume:
[Resume Text Provided Here]
```

## Demo Video

[▶️ Watch the Project Demo](https://drive.google.com/file/d/1vU9ME6_dZxHhmCQAEUW0IyK-WpovrZEk/view?usp=drive_link)

The demo showcases the AI-powered resume screening workflow, including resume parsing, candidate evaluation, and application management.
