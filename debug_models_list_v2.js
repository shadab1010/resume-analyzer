import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';
import fs from 'fs';
import { createRequire } from 'module';

// Polyfill require for createRequire usage if needed, but we are in module mode.
// Actually, let's just use standard fetch since we are in node 18+ likely (or at least recent enough).
// Or just use the same logic as before but simpler writing.

dotenv.config();

const key = process.env.GEMINI_API_KEY;

async function listModels() {
    try {
        if (!key) {
            fs.writeFileSync('models.txt', "Error: No API Key");
            return;
        }

        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${key}`);
        const data = await response.json();

        let output = "Available Models:\n";
        if (data.models) {
            data.models.forEach(m => {
                if (m.supportedGenerationMethods.includes("generateContent")) {
                    output += `- ${m.name}\n`;
                }
            });
        } else {
            output += "Unexpected response: " + JSON.stringify(data, null, 2);
        }

        fs.writeFileSync('models.txt', output);
        console.log("Done");

    } catch (error) {
        fs.writeFileSync('models.txt', "Error: " + error.message);
        console.error(error);
    }
}

listModels();
