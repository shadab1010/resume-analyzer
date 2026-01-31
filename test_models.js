
import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';
dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

async function listModels() {
    try {
        console.log('Fetching available models...');
        // Note: listModels is on the genAI instance or model manager? 
        // Checking doc: genAI.getGenerativeModel is the main entry. 
        // Actually, there isn't a direct "listModels" helper in the high-level SDK easily accessible without setup.
        // But we can try a simple generation with a known valid model like "gemini-1.5-flash" again with debug logging to see if it was a quota issue.

        // Actually, let's just try to generate with gemini-1.5-flash and see the SPECIFIC error for that.
        // The previous error for flash was masked.

        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        console.log('Testing gemini-1.5-flash...');
        const result = await model.generateContent("Hello");
        console.log('Success! gemini-1.5-flash is working.');
        console.log('Response:', result.response.text());

    } catch (error) {
        console.error('Error with gemini-1.5-flash:');
        console.error(error.message);

        try {
            console.log('Testing gemini-1.0-pro...');
            const model2 = genAI.getGenerativeModel({ model: "gemini-1.0-pro" });
            const result2 = await model2.generateContent("Hello");
            console.log('Success! gemini-1.0-pro is working.');
        } catch (e2) {
            console.error('Error with gemini-1.0-pro:', e2.message);
        }
    }
}

listModels();
