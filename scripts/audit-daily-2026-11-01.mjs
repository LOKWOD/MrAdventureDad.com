import {existsSync,readFileSync} from 'node:fs';
import {resolve} from 'node:path';
import {pages} from './content-2026-11-01.mjs';

const root=resolve(process.argv[2]||'.'),fail=m=>{throw Error(m)},read=p=>readFileSync(resolve(root,p),'utf8');
if(pages.length!==3)fail('Exactly three source pages required');
if(new Set(pages.map(p=>p.slug)).size!==3)fail('Duplicate source slug');
if(new Set(pages.map(p=>p.title)).size!==3)fail('Duplicate source title');
if(new Set(pages.map(p=>p.image)).size!==3)fail('Duplicate source image');
const inventory=JSON.parse(read('reports/inventory-2026-11-01.json'));
if(inventory.previousPageCount!==197||inventory.pageCount!==200||inventory.newPages?.length!==3)fail('Inventory count mismatch');
const sitemap=read('sitemap.xml'),home=read('index.html'),credits=JSON.parse(read('assets/images/credits.json'));
let paid=0;
for(const [i,p] of pages.entries()){
 const path=`guides/${p.slug}.html`,h=read(path),url=`https://mradventuredad.com/guides/${p.slug}.html`;
 if(!h.includes(`<h1>${p.title}</h1>`))fail(path+': heading mismatch');
 if(!h.includes(`<link rel="canonical" href="${url}">`))fail(path+': canonical mismatch');
 for(const token of ['og:title','og:description','og:url','og:image','og:image:alt','twitter:image:alt','article:published_time','Article','BreadcrumbList'])if(!h.includes(token))fail(path+': missing '+token);
 if(!h.includes('"2026-11-01"')&&!h.includes('2026-11-01'))fail(path+': date missing');
 if(!h.includes(`alt="${p.alt}"`))fail(path+': hero alt mismatch');
 if(!existsSync(resolve(root,`assets/images/photos/${p.image}`)))fail(path+': image file missing');
 if(!credits[`assets/images/photos/${p.image}`])fail(path+': image credit missing');
 if(!sitemap.includes(`<loc>${url}</loc><lastmod>2026-11-01</lastmod>`))fail(path+': sitemap row missing');
 if(!home.includes(`guides/${p.slug}.html`))fail(path+': homepage link missing');
 const internal=[...h.matchAll(/href="([^"]+\.html)"/g)].map(m=>m[1]).filter(x=>!x.startsWith('https://'));
 if(new Set(internal.filter(x=>!x.includes('../index')&&!x.includes('../adventures')&&!x.includes('../destinations')&&!x.includes('../outdoors')&&!x.includes('../gear')&&!x.includes('../about')&&!x.includes('../privacy')&&!x.includes('../photo-credits'))).size<3)fail(path+': fewer than three contextual internal links');
 const words=h.replace(/<script[\s\S]*?<\/script>/gi,' ').replace(/<style[\s\S]*?<\/style>/gi,' ').replace(/<[^>]+>/g,' ').replace(/&[a-z0-9#]+;/gi,' ').trim().split(/\s+/).length;
 if(words<900)fail(path+': thin copy '+words);
 const amazon=[...h.matchAll(/<a[^>]+href="https:\/\/www\.amazon\.com[^"]+"[^>]*>/g)].map(m=>m[0]);
 if(i===1){
  if(amazon.length!==3)fail(path+': expected three affiliate links');
  if(!h.includes('Commercial disclosure:')||!h.includes('affiliate-disclosure'))fail(path+': disclosure missing');
  for(const a of amazon){for(const token of ['sponsored','nofollow','noopener','data-affiliate-active="true"'])if(!a.includes(token))fail(path+': affiliate markup missing '+token);}
  paid+=amazon.length;
 } else if(amazon.length)fail(path+': unexpected affiliate link');
}
if(paid!==3)fail('Expected three active affiliate links');
for(const surface of ['adventures.html','destinations.html','gear.html','outdoors.html'])for(const p of pages)if(surface==='adventures.html'&&!read(surface).includes(`guides/${p.slug}.html`))fail(surface+': missing '+p.slug);
for(const p of pages)if(!read('photo-credits.html').includes(p.image))fail('photo-credits missing '+p.image);
for(const path of ['reports/editorial-decision-2026-11-01.md','reports/image-qa-2026-11-01.md','reports/search-console-editorial-log.md','reports/authority-opportunities.md'])if(!existsSync(resolve(root,path)))fail(path+': missing');
console.log('November 1 daily audit passed: 3 pages, 3 unique titles/slugs/images, 3 active affiliate links, discovery/schema/credits/internal links present.');
