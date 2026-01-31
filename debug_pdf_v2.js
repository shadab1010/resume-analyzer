import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const lib = require('pdf-parse');

console.log('--- DEBUG START ---');
console.log('Type of lib:', typeof lib);
console.log('Keys:', Object.keys(lib));
console.log('Is lib a function?', typeof lib === 'function');
console.log('lib.default type:', typeof lib.default);

async function test() {
    const func = lib.default || lib;
    console.log('Chosen function type:', typeof func);
    if (typeof func !== 'function') {
        console.error('CRITICAL: Chosen export is NOT a function!');
        return;
    }

    try {
        console.log('Attempting to call function with empty buffer...');
        await func(Buffer.from('dummy pdf content'));
        console.log('Call executed (result irrelevant)');
    } catch (e) {
        console.log('Call threw error (expected for dummy content):', e.message);
        if (e.message.includes('not a function')) {
            console.error('CRITICAL: Still not a function error!');
        }
    }
}

test();
