import { stat } from 'node:fs/promises';
const mustNotExist = ['src/routes/about', 'src/routes/blog', 'src/routes/old', 'src/routes/api', 'cms', 'content', '.vercel', '.netlify'];
const bad = [];
for (const p of mustNotExist) { try { await stat(p); bad.push(p); } catch {} }
if (bad.length) { console.error('❌ Disallowed paths present:', bad); process.exit(1); }
console.log('Structure guard passed');
