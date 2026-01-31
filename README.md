# 🧠 AI-Based Resume Analyzer

**Author:** MD SHADAB ALAM
**Technology Stack:** React + TypeScript + Tailwind CSS + Flask + spaCy + Vite  

---

## 📘 Project Abstract

The **AI-Based Resume Analyzer** is an intelligent system designed to evaluate resumes using **Artificial Intelligence (AI)** and **Natural Language Processing (NLP)**.  
It helps job seekers and recruiters by providing deep insights into resume quality, ATS (Applicant Tracking System) compatibility, skill analysis, and content improvement suggestions.  

This project demonstrates the integration of modern web technologies with AI/NLP capabilities for smarter recruitment assistance.

---

## 🎯 Project Objective

- Automate the evaluation of resumes to save recruiters’ time.  
- Improve candidate resumes by identifying weak sections.  
- Check ATS (Applicant Tracking System) compatibility.  
- Provide data-driven feedback using NLP models and AI insights.  

---

## 📄 Key Features

- 📁 **File Upload Support** — Accepts `.txt`, `.pdf`, and `.docx` files  
- 🧠 **Intelligent Analysis** — Extracts, evaluates, and scores resume content  
- ⚙️ **Mock AI Integration** — Simulated AI recommendations for improvement  
- 🧩 **ATS Compatibility** — Ensures resumes are machine-readable for hiring systems  
- 💡 **Skills Extraction** — Detects and categorizes technical and soft skills  
- 🧾 **Content Scoring** — Assigns quality scores to each resume section  
- ❌ **Error Detection** — Highlights formatting and structure issues  
- 🔁 **Improvement Suggestions** — Provides detailed advice for better resumes  

---

## 🛠️ Tech Stack

### 🖥️ Frontend
- React + TypeScript  
- Tailwind CSS  
- Lucide React Icons  
- Vite  

### ⚙️ Backend
- Python (Flask Framework)  
- spaCy for NLP  
- PyPDF2 / pdfplumber for PDF parsing  
- python-docx for DOCX processing  
- Optional OpenAI API integration for advanced analysis  

---

## ⚙️ Setup and Installation

### 📁 Project Directory
```bash
cd "D:\Resume BOlt\project"

### Backend
1. Start the backend server:
   ```bash
   node server.js
   ```

The backend will run on `http://localhost:5000`

### Frontend Setup

The frontend is already configured and will automatically connect to the backend.

1. **Start the development server:**
   ```bash
   npm run dev
   ```

The frontend will run on `http://localhost:5173`

## API Endpoints

### `POST /api/analyze`
Upload and analyze a resume file.

**Request:**
- `file`: PDF or DOCX file (multipart/form-data)

**Response:**
```json
{
  "id": "unique-id",
  "fileName": "resume.pdf",
  "uploadDate": "2024-01-01T00:00:00",
  "atsScore": 85,
  "overallScore": 82,
  "skills": [...],
  "errors": [...],
  "suggestions": [...],
  "sections": [...]
}
```

### `GET /api/health`
Check backend health and dependencies.

## Features in Detail

### ATS Compatibility Analysis
- Checks for special characters that may cause parsing issues
- Validates presence of essential contact information
- Analyzes resume structure and standard sections

### Skills Extraction
- Uses spaCy NLP for intelligent skill detection
- Categorizes skills (technical, soft, industry-specific)
- Provides confidence scores for each skill

### Content Analysis
- Evaluates different resume sections
- Provides scoring and feedback
- Identifies missing or weak areas

### Error Detection
- Formatting issues
- Missing information
- ATS compatibility problems
- Content quality issues

## Dependencies

### Python Packages
- Flask: Web framework
- spaCy: NLP processing
- PyPDF2: PDF text extraction
- pdfplumber: Advanced PDF parsing
- python-docx: DOCX file processing
- OpenAI: AI-powered analysis (optional)

### Required Models
- spaCy English model (`en_core_web_sm`)
- NLTK data (punkt, stopwords)

## Environment Variables

- `OPENAI_API_KEY`: OpenAI API key for advanced analysis (optional)

## File Structure

```
├── app.py                 # Flask backend server
├── requirements.txt       # Python dependencies
├── setup_backend.py      # Setup script
├── uploads/              # Temporary file storage
├── src/
│   ├── components/       # React components
│   ├── services/         # API service layer
│   ├── types/           # TypeScript types
│   └── App.tsx          # Main application
└── README.md
```

## Usage

1. Start both backend and frontend servers
2. Open the application in your browser
3. Upload a PDF or DOCX resume file
4. View comprehensive analysis results
5. Review suggestions and implement improvements

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License - see LICENSE file for details

## API Endpoints

- `POST /api/analyze` - Upload and analyze resume files

## Environment Variables

```bash
export OPENAI_API_KEY='your-openai-api-key'
```
