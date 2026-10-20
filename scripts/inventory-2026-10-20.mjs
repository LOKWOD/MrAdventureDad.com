import {readFileSync,writeFileSync} from 'node:fs';
// Keep the complete, established inventory fields while snapshotting today's clean production.
const src=readFileSync(new URL('./inventory-2026-10-19.mjs',import.meta.url),'utf8').replaceAll('2026-10-19','2026-10-20');
await import('data:text/javascript;base64,'+Buffer.from(src).toString('base64'));
