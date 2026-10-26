import {readdirSync,readFileSync,writeFileSync} from 'node:fs';
const clean=s=>(s||'').replace(/<[^>]*>/g,' ').replace(/\s+/g,' ').trim(),pages=[];
for(const dir of ['.','guides'])for(const name of readdirSync(dir).filter(n=>n.endsWith('.html'))){
 const path=dir==='.'?name:`${dir}/${name}`,h=readFileSync(path,'utf8');
 pages.push({path,title:clean(h.match(/<title>([\s\S]*?)<\/title>/i)?.[1]),heading:clean(h.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i)?.[1]),description:h.match(/name="description" content="([^"]*)"/)?.[1]||'',keywords:h.match(/name="keywords" content="([^"]*)"/)?.[1]||'',datePublished:h.match(/"datePublished":"([^"]+)"/)?.[1]||'',angles:[...h.matchAll(/<h2[^>]*>([\s\S]*?)<\/h2>/gi)].map(m=>clean(m[1])),images:[...h.matchAll(/<img\b[^>]*>/gi)].map(m=>({src:m[0].match(/src="([^"]+)"/)?.[1],alt:m[0].match(/alt="([^"]*)"/)?.[1]})),commercialCategories:[...h.matchAll(/data-affiliate-(?:query|product)="([^"]+)"/gi)].map(m=>m[1])});
}
writeFileSync('reports/inventory-2026-10-26.json',JSON.stringify({date:'2026-10-26',stage:'post-publication',pageCount:pages.length,pages},null,2)+'\n');
console.log(`Inventoried ${pages.length} pages, including titles, slugs, intent evidence, dates, section angles, explicit keywords, commercial categories and images.`);
console.log('Candidate overlap:',pages.filter(p=>/ganondagan|kids. snowshoes|coat.pocket reset/i.test([p.title,p.description,p.heading,p.angles.join(' ')].join(' '))).map(p=>p.path));
