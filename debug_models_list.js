import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';
dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function listModels() {
    try {
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" }); // Just to initialize, though we use genAI directly usually if API supports it, but the SDK doesn't expose listModels directly on genAI instance in some versions?
        // Actually, newer SDK has specific ways. Let's try the generic REST approach if SDK fails, but SDK is better.
        // Wait, the error message said "Call ListModels".

        // In @google/generative-ai, there isn't a direct listModels helper exposed easily in all versions without using the model manager or similar, 
        // BUT the error message implies it's an API capability.

        // Let's rely on a direct fetch to the API to be 100% sure what the API sees, independent of SDK wrappers potentially.
        const key = process.env.GEMINI_API_KEY;
        if (!key) {
            console.error("No API KEY found");
            return;
        }

        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${key}`);
        const data = await response.json();

        if (data.models) {
            console.log("Available Models:");
            data.models.forEach(m => {
                if (m.supportedGenerationMethods.includes("generateContent")) {
                    console.log(`- ${m.name} (Display: ${m.displayName})`);
                }
            });
        } else {
            console.log("Unexpected response:", JSON.stringify(data, null, 2));
        }

    } catch (error) {
        console.error("Error listing models:", error);
    }
}

listModels();
