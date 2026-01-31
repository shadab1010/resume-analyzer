
import https from 'https';
import fs from 'fs';
import dotenv from 'dotenv';
dotenv.config();

const API_KEY = process.env.GEMINI_API_KEY;

if (!API_KEY) {
    console.error('No API Key found in .env');
    process.exit(1);
}

const options = {
    hostname: 'generativelanguage.googleapis.com',
    path: `/v1beta/models?key=${API_KEY}`,
    method: 'GET',
    headers: {
        'Content-Type': 'application/json'
    }
};

const req = https.request(options, (res) => {
    let body = '';
    res.on('data', (chunk) => body += chunk);
    res.on('end', () => {
        if (res.statusCode === 200) {
            fs.writeFileSync('models.json', body);
            console.log('Saved models to models.json');
        } else {
            console.error('FAILURE: API Response:', body);
        }
    });
});

req.on('error', (e) => {
    console.error('Request Error:', e);
});

req.end();
