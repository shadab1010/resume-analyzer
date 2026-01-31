import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const lib = require('pdf-parse');

console.log('--- DEEP DEBUG ---');
console.log('typeof lib:', typeof lib);
console.log('lib keys:', Object.keys(lib));

for (const key of Object.keys(lib)) {
    console.log(`lib.${key} type:`, typeof lib[key]);
}

if (lib.default) {
    console.log('lib.default exists. Keys:', Object.keys(lib.default));
} else {
    console.log('lib.default is undefined');
}
