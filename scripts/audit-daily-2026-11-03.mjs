import {existsSync,readFileSync,readdirSync,statSync} from 'node:fs';
import {resolve} from 'node:path';
import {pages} from './content-2026-11-03.mjs';

const root=resolve(process.argv[2]||'.'),fail=m=>{throw Error(m)},read=p=>readFileSync(resolve(root,p),'utf8');
if(pages.length!==3)fail('Exactly three source pages required');
for(const key of ['slug','title','image'])if(new Set(pages.map(p=>p[key])).size!==3)fail('Duplicate source '+key);
const inventory=JSON.parse(read('reports/inventory-2026-11-03.json'));
if(inventory.previousPageCount!==203||inventory.pageCount!==206||inventory.newPages?.length!==3||inventory.pages?.length!==206)fail('Complete inventory count mismatch');
const sitemap=read('sitemap.xml'),home=read('index.html'),credits=JSON.parse(read('assets/images/credits.json'));
let paid=0;
for(const [i,p] of pages.entries()){
 const path=`guides/${p.slug}.html`,h=read(path),url=`https://mradventuredad.com/guides/${p.slug}.html`;
 if(!h.includes(`<h1>${p.title}</h1>`))fail(path+': heading mismatch');
 if(!h.includes(`<link rel="canonical" href="${url}">`))fail(path+': canonical mismatch');
 for(const token of ['og:title','og:description','og:url','og:image','og:image:alt','twitter:image:alt','article:published_time','Article','BreadcrumbList'])if(!h.includes(token))fail(path+': missing '+token);
 if(!h.includes('2026-11-03'))fail(path+': date missing');
 if(!h.includes(`alt="${p.alt}"`))fail(path+': hero alt mismatch');
 if(!existsSync(resolve(root,`assets/images/photos/${p.image}`)))fail(path+': image file missing');
 if(!credits[`assets/images/photos/${p.image}`])fail(path+': image credit missing');
 if(!sitemap.includes(`<loc>${url}</loc><lastmod>2026-11-03</lastmod>`))fail(path+': sitemap row missing');
 if(!home.includes(`guides/${p.slug}.html`))fail(path+': homepage link missing');
 const contextual=[...h.matchAll(/href="([^"]+\.html)"/g)].map(m=>m[1]).filter(x=>!x.startsWith('https://')&&!/(?:index|adventures|destinations|outdoors|gear|about|privacy|photo-credits)\.html/.test(x));
 if(new Set(contextual).size<3)fail(path+': fewer than three contextual internal links');
 const words=h.replace(/<script[\s\S]*?<\/script>/gi,' ').replace(/<style[\s\S]*?<\/style>/gi,' ').replace(/<[^>]+>/g,' ').replace(/&[a-z0-9#]+;/gi,' ').trim().split(/\s+/).length;
 if(words<900)fail(path+': thin copy '+words);
 const amazon=[...h.matchAll(/<a[^>]+href="https:\/\/www\.amazon\.com[^"]+"[^>]*>/g)].map(m=>m[0]);
 if(i===1){
  if(amazon.length!==3)fail(path+': expected three affiliate links');
  if(!h.includes('Commercial disclosure:')||!h.includes('affiliate-disclosure'))fail(path+': disclosure missing');
  for(const a of amazon)for(const token of ['sponsored','nofollow','noopener','data-affiliate-active="true"'])if(!a.includes(token))fail(path+': affiliate markup missing '+token);
  paid+=amazon.length;
 }else if(amazon.length)fail(path+': unexpected affiliate link');
}
if(paid!==3)fail('Expected three new active affiliate links');
const allHtml=[];function walk(d){for(const n of readdirSync(d)){if(['.git','node_modules'].includes(n))continue;const p=resolve(d,n),s=statSync(p);if(s.isDirectory())walk(p);else if(n.endsWith('.html'))allHtml.push(readFileSync(p,'utf8'));}}walk(root);
const sitewidePaid=allHtml.reduce((n,h)=>n+(h.match(/data-affiliate-active="true"/g)||[]).length,0);
if(sitewidePaid!==255)fail(`Expected 255 active affiliate links sitewide, found ${sitewidePaid}`);
for(const p of pages)if(!read('adventures.html').includes(`guides/${p.slug}.html`))fail('adventures.html missing '+p.slug);
if(!read('destinations.html').includes(`guides/${pages[0].slug}.html`))fail('destinations.html missing destination');
if(!read('gear.html').includes(`guides/${pages[1].slug}.html`))fail('gear.html missing commercial guide');
for(const p of pages)if(!read('outdoors.html').includes(`guides/${p.slug}.html`))fail('outdoors.html missing '+p.slug);
for(const p of pages)if(!read('photo-credits.html').includes(p.image))fail('photo-credits missing '+p.image);
const reciprocal={
 'guides/utica-zoo-with-kids.html':pages[0].slug,
 'guides/family-museum-day-system.html':pages[0].slug,
 'guides/most-syracuse-with-kids.html':pages[0].slug,
 'guides/kids-winter-boots-pac-snow-hiking-guide.html':pages[1].slug,
 'guides/kids-snowshoes-molded-adjustable-frame-fit-guide.html':pages[1].slug,
 'guides/family-outdoor-weather-cutoff-plan.html':pages[1].slug,
 'guides/seven-night-family-moon-observation-log.html':pages[2].slug,
 'guides/family-headlamps-flashlights-lanterns.html':pages[2].slug,
 'guides/family-binoculars-8x-vs-10x.html':pages[2].slug
};
if(Object.keys(reciprocal).length!==9)fail('Expected nine reciprocal links');
for(const [path,slug] of Object.entries(reciprocal))if(!read(path).includes(`${slug}.html`))fail(path+': reciprocal link missing');
for(const path of ['reports/editorial-decision-2026-11-03.md','reports/image-qa-2026-11-03.md','reports/search-console-editorial-log.md','reports/authority-opportunities.md'])if(!existsSync(resolve(root,path)))fail(path+': missing');
for(const source of ['https://www.uticachildrensmuseum.org/visit/','https://www.uticachildrensmuseum.org/explore/'])if(!read(`guides/${pages[0].slug}.html`).includes(source))fail('Museum source missing '+source);
for(const source of ['https://dec.ny.gov/things-to-do/hiking/winter-safety','https://kahtoola.com/traction/microspikes-footwear-traction/','https://yaktrax.ca/pages/frequently-asked-questions'])if(!read(`guides/${pages[1].slug}.html`).includes(source))fail('Traction source missing '+source);
for(const source of ['https://science.nasa.gov/solar-system/how-to-find-good-places-to-stargaze/','https://science.nasa.gov/solar-system/what-is-the-north-star-and-how-do-you-find-it/'])if(!read(`guides/${pages[2].slug}.html`).includes(source))fail('Stargazing source missing '+source);
if(!home.includes('FRESH IDEAS · NOVEMBER 3, 2026'))fail('Homepage lead date not refreshed');
if(!home.includes('Dated weekend events stay in the separate weekly guide'))fail('Weekly roundup separation missing');
if(!existsSync(resolve(root,'weekend-october-31-november-1-2026.html')))fail('Current separate weekend roundup missing');
if(!existsSync(resolve(root,'weekend-november-7-8-2026.html')))fail('Current Nov 7-8 weekend roundup missing');
console.log('November 3 daily audit passed: 3 pages, full 206-page inventory, 3 unique titles/slugs/images, 3 new and 255 sitewide affiliate links, sources/discovery/schema/credits/internal links present.');
