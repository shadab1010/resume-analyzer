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

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

class AIResumeAnalyzer {
    async extractTextFromBuffer(buffer, mimetype) {
        if (mimetype === 'application/pdf') {
            try {
                const data = await pdf(buffer);
                return data.text;
            } catch (error) {
                console.error('---------------- PDF PARSING ERROR ----------------');
                console.error(error);
                console.error('Buffer details:', {
                    isBuffer: Buffer.isBuffer(buffer),
                    length: buffer.length
                });
                console.error('---------------------------------------------------');
                throw new Error(`Failed to parse PDF file. Reason: ${error.message}`);
            }
        }
        // Default to text
        return buffer.toString('utf-8');
    }

    async analyzeResume(text) {
        if (!process.env.GEMINI_API_KEY) {
            throw new Error('GEMINI_API_KEY is not configured in .env file');
        }

        const modelsToTry = ["gemini-2.0-flash", "gemini-2.5-flash", "gemini-2.5-pro"];
        let result = null;
        let lastError = null;

        for (const modelName of modelsToTry) {
            try {
                console.log(`Attempting analysis with model: ${modelName}`);
                const model = genAI.getGenerativeModel({ model: modelName });

                const prompt = `
                You are an expert ATS (Applicant Tracking System) and Resume Coach. 
                Analyze the following resume text. 
                
                Provide a detailed analysis in JSON format with the following structure:
                {
                    "atsScore": <number 0-100>,
                    "overallScore": <number 0-100>,
                    "contentScore": <number 0-100>,
                    "kpis": {
                        "quantifyingImpact": <number 0-100>,
                        "actionVerbs": <number 0-100>,
                        "repetition": <number 0-100>,
                        "spelling": <number 0-100>
                    },
                    "skills": [
                        { "name": "<Skill Name>", "category": "<Category e.g., Technical, Soft, Language>", "confidence": <0.0-1.0>, "isRelevant": true }
                    ],
                    "extractedContactInfo": {
                        "email": "<email or null>",
                        "phone": "<phone or null>",
                        "linkedin": "<linkedin url or null>"
                    },
                    "errors": [
                        { "type": "<content|formatting|spelling>", "severity": "<high|medium|low>", "message": "<Issue description>", "suggestion": "<How to fix>" }
                    ],
                    "suggestions": [
                        { "category": "<category>", "title": "<Short Title>", "description": "<Actionable advice>", "impact": "<high|medium>" }
                    ],
                    "sections": [
                         { "name": "<Section Name>", "score": <0-100 number>, "feedback": "<Specific feedback>" }
                    ]
                }
        
                Be strict regarding ATS compatibility (formatting issues, missing keywords).
                Extract ALL technical and soft skills found.
                
                RESUME TEXT:
                ${text.substring(0, 30000)}
                `;

                result = await model.generateContent(prompt);
                break; // If successful, exit loop
            } catch (e) {
                console.warn(`Model ${modelName} failed:`, e.message);
                lastError = e;
            }
        }

        if (!result) {
            console.error("All models failed.");
            console.error("Last error details:", JSON.stringify(lastError, Object.getOwnPropertyNames(lastError), 2));
            throw new Error(`AI Analysis Failed: ${lastError?.message || 'Unknown error'}`);
        }

        try {
            const response = await result.response;
            const textResponse = response.text();

            // Clean up Markdown code blocks if present
            const jsonStr = textResponse.replace(/^```json\s*/, '').replace(/\s*```$/, '');
            const data = JSON.parse(jsonStr);

            return {
                id: Date.now().toString(),
                fileName: 'uploaded_resume',
                uploadDate: new Date().toISOString(),
                ...data,
                textLength: text.length,
                wordCount: text.split(/\s+/).length
            };
        } catch (e) {
            console.error("Response parsing error:", e);
            throw new Error("Failed to parse AI response.");
        }
    }
}

// Health Check
app.get('/api/health', (req, res) => {
    res.json({
        status: 'healthy',
        ai_powered: true,
        timestamp: new Date().toISOString()
    });
});

// Root endpoint
app.get('/', (req, res) => {
    res.json({
        message: 'Resume Analyzer AI Server',
        status: 'running',
        endpoints: ['/api/health', '/api/analyze']
    });
});

// Analyze Endpoint
app.post('/api/analyze', upload.single('file'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }

        console.log(`Received file: ${req.file.originalname} (${req.file.mimetype}, ${req.file.size} bytes)`);

        const analyzer = new AIResumeAnalyzer();
        const text = await analyzer.extractTextFromBuffer(req.file.buffer, req.file.mimetype);

        console.log(`Extracted ${text.length} characters. Sending to AI...`);
        const analysis = await analyzer.analyzeResume(text);

        res.json(analysis);

    } catch (error) {
        console.error('Request Error:', error);
        res.status(500).json({
            error: error.message,
            details: 'Check server logs for more info'
        });
    }
});
// ✅ Use dynamic port for cloud deployment (Render / Railway / etc.)
const PORT = process.env.PORT || 5000;

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Resume Analyzer AI Server running on port ${PORT}`);
    console.log('Ensure you have a .env file with GEMINI_API_KEY');
});