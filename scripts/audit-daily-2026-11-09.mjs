import {existsSync,readFileSync,readdirSync,statSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {resolve} from 'node:path';
import {pages} from './content-2026-11-09.mjs';

const root=resolve(process.argv[2]||'.'),fail=m=>{throw Error(m)},read=p=>readFileSync(resolve(root,p),'utf8');
if(pages.length!==3)fail('Exactly three source pages required');
for(const key of ['slug','title','image'])if(new Set(pages.map(p=>p[key])).size!==3)fail('Duplicate source '+key);
const inventory=JSON.parse(read('reports/inventory-2026-11-09.json'));
if(inventory.previousPageCount!==222||inventory.pageCount!==225||inventory.newPages?.length!==3||inventory.pages?.length!==225)fail('Complete inventory count mismatch');
const sitemap=read('sitemap.xml'),home=read('index.html'),credits=JSON.parse(read('assets/images/credits.json')),approvedTag=read('scripts/inject-affiliate-commerce.mjs').match(/const tag = "([^"]+)"/)?.[1],newImageHashes=new Set();
let paid=0;
for(const [i,p] of pages.entries()){
 const path=`guides/${p.slug}.html`,h=read(path),url=`https://mradventuredad.com/guides/${p.slug}.html`;
 if(!h.includes(`<h1>${p.title}</h1>`))fail(path+': heading mismatch');
 if(!h.includes(`<link rel="canonical" href="${url}">`))fail(path+': canonical mismatch');
 for(const token of ['og:title','og:description','og:url','og:image','og:image:alt','twitter:image:alt','article:published_time','Article','Guide','BreadcrumbList'])if(!h.includes(token))fail(path+': missing '+token);
 if(!h.includes('2026-11-09'))fail(path+': date missing');
 if(!h.includes(`alt="${p.alt}"`))fail(path+': hero alt mismatch');
 if(!existsSync(resolve(root,`assets/images/photos/${p.image}`)))fail(path+': image file missing');
 if(!credits[`assets/images/photos/${p.image}`])fail(path+': image credit missing');
 const hash=createHash('sha256').update(readFileSync(resolve(root,`assets/images/photos/${p.image}`))).digest('hex');
 if(newImageHashes.has(hash))fail(path+': duplicate new image bytes');
 newImageHashes.add(hash);
 for(const [creditPath] of Object.entries(credits))if(creditPath!==`assets/images/photos/${p.image}`&&creditPath.startsWith('assets/images/photos/')&&existsSync(resolve(root,creditPath))&&createHash('sha256').update(readFileSync(resolve(root,creditPath))).digest('hex')===hash)fail(path+': reused existing image bytes');
 if(!sitemap.includes(`<loc>${url}</loc><lastmod>2026-11-09</lastmod>`))fail(path+': sitemap row missing');
 if(!home.includes(`guides/${p.slug}.html`))fail(path+': homepage link missing');
 const contextual=[...h.matchAll(/href="([^"]+\.html)"/g)].map(m=>m[1]).filter(x=>!x.startsWith('https://')&&!/(?:index|adventures|destinations|outdoors|gear|about|privacy|photo-credits)\.html/.test(x));
 if(new Set(contextual).size<3)fail(path+': fewer than three contextual internal links');
 const words=h.replace(/<script[\s\S]*?<\/script>/gi,' ').replace(/<style[\s\S]*?<\/style>/gi,' ').replace(/<[^>]+>/g,' ').replace(/&[a-z0-9#]+;/gi,' ').trim().split(/\s+/).length;
 if(words<900)fail(path+': thin copy '+words);
 const amazon=[...h.matchAll(/<a[^>]+href="https:\/\/www\.amazon\.com[^"]+"[^>]*>/g)].map(m=>m[0]);
 if(i===1){
  if(amazon.length!==3)fail(path+': expected three affiliate links');
  if(!h.includes('Commercial disclosure:')||!h.includes('affiliate-disclosure'))fail(path+': disclosure missing');
  for(const a of amazon){for(const token of ['sponsored','nofollow','noopener','noreferrer','data-affiliate-active="true"'])if(!a.includes(token))fail(path+': affiliate markup missing '+token);if(!approvedTag||!a.includes(`data-affiliate-tag="${approvedTag}"`))fail(path+': approved affiliate tag missing');}
  paid+=amazon.length;
 }else if(amazon.length)fail(path+': unexpected affiliate link');
}
if(paid!==3)fail('Expected three new active affiliate links');
const allHtml=[];function walk(d){for(const n of readdirSync(d)){if(['.git','node_modules'].includes(n))continue;const p=resolve(d,n),s=statSync(p);if(s.isDirectory())walk(p);else if(n.endsWith('.html'))allHtml.push(readFileSync(p,'utf8'));}}walk(root);
const sitewidePaid=allHtml.reduce((n,h)=>n+(h.match(/data-affiliate-active="true"/g)||[]).length,0);
if(sitewidePaid!==273)fail(`Expected 273 active affiliate links sitewide, found ${sitewidePaid}`);
for(const p of pages)if(!read('adventures.html').includes(`guides/${p.slug}.html`))fail('adventures.html missing '+p.slug);
if(!read('destinations.html').includes(`guides/${pages[0].slug}.html`))fail('destinations.html missing destination');
if(!read('gear.html').includes(`guides/${pages[1].slug}.html`))fail('gear.html missing commercial guide');
for(const p of pages)if(!read('photo-credits.html').includes(p.image))fail('photo-credits missing '+p.image);
const reciprocal={
 'guides/central-new-york-family-trail-picker.html':pages[0].slug,
 'guides/teach-kids-read-trail-map-25-minute-game.html':pages[0].slug,
 'guides/family-outdoor-weather-cutoff-plan.html':pages[0].slug,
 'guides/family-roadside-breakdown-plan.html':pages[1].slug,
 'guides/winter-car-adventure-kit.html':pages[1].slug,
 'guides/family-walking-visibility-gear-reflective-vest-bands-clip-light.html':pages[1].slug,
 'guides/neighborhood-sound-map-20-minute-family-activity.html':pages[2].slug,
 'guides/family-first-aid-kit-guide.html':pages[2].slug,
 'guides/family-coat-pocket-reset-20-minute-system.html':pages[2].slug
};
if(Object.keys(reciprocal).length!==9)fail('Expected nine reciprocal links');
for(const [path,slug] of Object.entries(reciprocal))if(!read(path).includes(`${slug}.html`))fail(path+': reciprocal link missing');
for(const path of ['reports/editorial-decision-2026-11-09.md','reports/image-qa-2026-11-09.md','reports/search-console-editorial-log.md','reports/authority-opportunities.md'])if(!existsSync(resolve(root,path)))fail(path+': missing');
for(const source of ['https://friendsofgreatbear.org/maps','https://friendsofgreatbear.org/activities','https://townofvolney.gov/faqs/what-can-i-do-at-great-bear-trails-and-what-are-its-operating-hours/'])if(!read(`guides/${pages[0].slug}.html`).includes(source))fail('Great Bear source missing '+source);
for(const source of ['https://www.nhtsa.gov/winter-driving-safety','https://www.nhtsa.gov/move-over-its-law','https://dmv.ny.gov/book/export/html/1576','https://www.nhtsa.gov/interpretations/06-005538drn'])if(!read(`guides/${pages[1].slug}.html`).includes(source))fail('Roadside source missing '+source);
for(const source of ['https://dec.ny.gov/environmental-protection/recycling-composting/waste-reduction/recycling-events-you-can-organize','https://extapps.dec.ny.gov/docs/materials_minerals_pdf/litter.pdf','https://www.syr.gov/cityline','https://www.syr.gov/Living/My-Home/Homeowner-Landlord-Responsibilities/Safe-Disposal-for-Sharps-and-Medications'])if(!read(`guides/${pages[2].slug}.html`).includes(source))fail('Cleanup source missing '+source);
if(!home.includes('FRESH IDEAS · NOVEMBER 9, 2026'))fail('Homepage lead date not refreshed');
if(!home.includes('The November 7–8 roundup is archived'))fail('Wednesday roundup separation missing');
if(!existsSync(resolve(root,'weekend-november-7-8-2026.html')))fail('Current Nov 7-8 weekend roundup missing');
if(!existsSync(resolve(root,'weekend-november-14-15-2026.html')))fail('Current Nov 14-15 weekend roundup missing');
const placements=pages.reduce((n,p)=>n+allHtml.reduce((m,h)=>m+[...h.matchAll(new RegExp(`<img\\b[^>]*src="[^"]*${p.image.replaceAll('.','\\.')}`, 'g'))].length,0),0);
if(placements!==11)fail(`Expected 11 image placements across articles, homepage, hubs and credits, found ${placements}`);
console.log('November 9 daily audit passed: 3 pages, full 225-page inventory, 3 unique titles/slugs/images, 3 new and 273 sitewide affiliate links, primary sources, weekly-roundup separation, schema, credits and internal links present.');
