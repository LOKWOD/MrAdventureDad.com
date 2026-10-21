import {readFileSync} from 'node:fs';
// Freeze the complete pre-publication inventory before October 21 output exists.
const src=readFileSync(new URL('./inventory-2026-10-19.mjs',import.meta.url),'utf8')
  .replaceAll('2026-10-19','2026-10-21')
  .replace(/Candidate overlap:[\s\S]*?\);/,`Candidate overlap:',pages.filter(p=>/sleeping pad|stony brook|time capsule/i.test([p.title,p.description,p.heading,p.keywords,p.angles.join(' ')].join(' '))).map(p=>p.path));`);
await import('data:text/javascript;base64,'+Buffer.from(src).toString('base64'));
