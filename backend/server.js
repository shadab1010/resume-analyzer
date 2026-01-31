import express from 'express';
import multer from 'multer';
import cors from 'cors';
import dotenv from 'dotenv';
import { createRequire } from 'module';
import { GoogleGenerativeAI } from '@google/generative-ai';

const require = createRequire(import.meta.url);
const pdf = require('pdf-parse');

dotenv.config();

const app = express();
const upload = multer({ storage: multer.memoryStorage() });

app.use(cors());
app.use(express.json());

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

// --- Helper Functions ---

/**
 * Parses PDF buffer using pdf-parse (v1.1.1 compliant)
 */
async function parsePDF(buffer) {
    try {
        const data = await pdf(buffer);
        return data.text;
    } catch (error) {
        console.error("PDF Parsing Error:", error);
        throw new Error("Failed to parse PDF content.");
    }
}

/**
 * Tries to generate content using a list of models for fallback.
 */
async function generateWithFallback(prompt) {
    // Models found in users available list (prioritizing 2.0 stable -> latest aliases)
    const models = ["gemini-2.0-flash-001", "gemini-2.0-flash", "gemini-flash-latest", "gemini-pro-latest"];
    let lastError = null;

    for (const modelName of models) {
        try {
            console.log(`[AI] Treating with model: ${modelName}`);
            const model = genAI.getGenerativeModel({ model: modelName });
            const result = await model.generateContent(prompt);
            const response = await result.response;
            return response.text();
        } catch (e) {
            console.warn(`[AI] Model ${modelName} failed: ${e.message}`);
            lastError = e;
        }
    }
    throw new Error(`All AI models failed. Last error: ${lastError?.message}`);
}

// --- Routes ---

app.get('/', (req, res) => {
    res.json({ status: 'active', service: 'Resume Manager AI Backend' });
});

app.get('/api/health', (req, res) => {
    res.json({
        status: 'healthy',
        timestamp: new Date().toISOString(),
        spacy_loaded: true, // Compatibility flag for frontend
        openai_available: true // Compatibility flag for frontend
    });
});

app.post('/api/analyze', upload.single('file'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: "No file uploaded" });
        }

        console.log(`Processing file: ${req.file.originalname}`);

        // 1. Extract Text
        let text = '';
        if (req.file.mimetype === 'application/pdf') {
            text = await parsePDF(req.file.buffer);
        } else {
            text = req.file.buffer.toString('utf-8');
        }

        if (!text || text.trim().length === 0) {
            throw new Error("Extracted text is empty");
        }

        console.log(`Extracted ${text.length} chars. Sending to AI...`);

        // 2. Analyze with AI
        const prompt = `
        You are an elite ATS resume analyzer. Analyze this resume text and return strict JSON.
        
        RETURN FORMAT (JSON ONLY):
        {
            "atsScore": number (0-100),
            "overallScore": number (0-100),
            "skills": [ { "name": "Skill", "category": "Category", "confidence": 0-1, "isRelevant": true } ],
            "extractedContactInfo": { "email": "...", "phone": "...", "linkedin": "..." },
            "errors": [ { "type": "...", "severity": "high/medium/low", "message": "...", "suggestion": "..." } ],
            "suggestions": [ { "category": "...", "title": "...", "description": "...", "impact": "high/medium" } ],
            "sections": [ { "name": "...", "score": 0-100, "feedback": "..." } ]
        }

        RESUME CONTENT:
        ${text.substring(0, 25000)}
        `;

        const rawResponse = await generateWithFallback(prompt);

        // 3. Parse JSON safely
        const jsonStr = rawResponse.replace(/```json/g, '').replace(/```/g, '').trim();
        const analysis = JSON.parse(jsonStr);

        res.json({
            id: Date.now().toString(),
            fileName: req.file.originalname,
            ...analysis
        });

    } catch (error) {
        console.error("Handler Error:", error);
        res.status(500).json({
            error: error.message,
            details: "Processing failed. Please check server logs."
        });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Backend running on http://localhost:${PORT}`);
});
