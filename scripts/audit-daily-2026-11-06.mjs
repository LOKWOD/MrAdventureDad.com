import {existsSync,readFileSync,readdirSync,statSync} from 'node:fs';
import {resolve} from 'node:path';
import {pages} from './content-2026-11-06.mjs';

const root=resolve(process.argv[2]||'.'),fail=m=>{throw Error(m)},read=p=>readFileSync(resolve(root,p),'utf8');
if(pages.length!==3)fail('Exactly three source pages required');
for(const key of ['slug','title','image'])if(new Set(pages.map(p=>p[key])).size!==3)fail('Duplicate source '+key);
const inventory=JSON.parse(read('reports/inventory-2026-11-06.json'));
if(inventory.previousPageCount!==213||inventory.pageCount!==216||inventory.newPages?.length!==3||inventory.pages?.length!==216)fail('Complete inventory count mismatch');
const sitemap=read('sitemap.xml'),home=read('index.html'),credits=JSON.parse(read('assets/images/credits.json'));
let paid=0;
for(const [i,p] of pages.entries()){
 const path=`guides/${p.slug}.html`,h=read(path),url=`https://mradventuredad.com/guides/${p.slug}.html`;
 if(!h.includes(`<h1>${p.title}</h1>`))fail(path+': heading mismatch');
 if(!h.includes(`<link rel="canonical" href="${url}">`))fail(path+': canonical mismatch');
 for(const token of ['og:title','og:description','og:url','og:image','og:image:alt','twitter:image:alt','article:published_time','Article','Guide','BreadcrumbList'])if(!h.includes(token))fail(path+': missing '+token);
 if(!h.includes('2026-11-06'))fail(path+': date missing');
 if(!h.includes(`alt="${p.alt}"`))fail(path+': hero alt mismatch');
 if(!existsSync(resolve(root,`assets/images/photos/${p.image}`)))fail(path+': image file missing');
 if(!credits[`assets/images/photos/${p.image}`])fail(path+': image credit missing');
 if(!sitemap.includes(`<loc>${url}</loc><lastmod>2026-11-06</lastmod>`))fail(path+': sitemap row missing');
 if(!home.includes(`guides/${p.slug}.html`))fail(path+': homepage link missing');
 const contextual=[...h.matchAll(/href="([^"]+\.html)"/g)].map(m=>m[1]).filter(x=>!x.startsWith('https://')&&!/(?:index|adventures|destinations|outdoors|gear|about|privacy|photo-credits)\.html/.test(x));
 if(new Set(contextual).size<3)fail(path+': fewer than three contextual internal links');
 const words=h.replace(/<script[\s\S]*?<\/script>/gi,' ').replace(/<style[\s\S]*?<\/style>/gi,' ').replace(/<[^>]+>/g,' ').replace(/&[a-z0-9#]+;/gi,' ').trim().split(/\s+/).length;
 if(words<900)fail(path+': thin copy '+words);
 const amazon=[...h.matchAll(/<a[^>]+href="https:\/\/www\.amazon\.com[^"]+"[^>]*>/g)].map(m=>m[0]);
 if(i===1){
  if(amazon.length!==3)fail(path+': expected three affiliate links');
  if(!h.includes('Commercial disclosure:')||!h.includes('affiliate-disclosure'))fail(path+': disclosure missing');
  for(const a of amazon)for(const token of ['sponsored','nofollow','noopener','noreferrer','data-affiliate-active="true"'])if(!a.includes(token))fail(path+': affiliate markup missing '+token);
  paid+=amazon.length;
 }else if(amazon.length)fail(path+': unexpected affiliate link');
}
if(paid!==3)fail('Expected three new active affiliate links');
const allHtml=[];function walk(d){for(const n of readdirSync(d)){if(['.git','node_modules'].includes(n))continue;const p=resolve(d,n),s=statSync(p);if(s.isDirectory())walk(p);else if(n.endsWith('.html'))allHtml.push(readFileSync(p,'utf8'));}}walk(root);
const sitewidePaid=allHtml.reduce((n,h)=>n+(h.match(/data-affiliate-active="true"/g)||[]).length,0);
if(sitewidePaid!==264)fail(`Expected 264 active affiliate links sitewide, found ${sitewidePaid}`);
for(const p of pages)if(!read('adventures.html').includes(`guides/${p.slug}.html`))fail('adventures.html missing '+p.slug);
if(!read('destinations.html').includes(`guides/${pages[0].slug}.html`))fail('destinations.html missing destination');
if(!read('gear.html').includes(`guides/${pages[1].slug}.html`))fail('gear.html missing commercial guide');
for(const p of pages)if(!read('photo-credits.html').includes(p.image))fail('photo-credits missing '+p.image);
const reciprocal={
 'guides/family-day-trip-system.html':pages[0].slug,
 'guides/family-grocery-receipt-detective-25-minute-math-activity.html':pages[0].slug,
 'guides/family-parking-lot-plan.html':pages[0].slug,
 'guides/family-calendar-reset-20-minute-plan.html':pages[1].slug,
 'guides/after-school-nature-walk-30-minute-plan.html':pages[1].slug,
 'guides/family-library-night-45-minute-plan.html':pages[1].slug,
 'guides/family-home-utility-map-20-minute-adults-operate.html':pages[2].slug,
 'guides/family-energyguide-label-check-25-minute-activity.html':pages[2].slug,
 'guides/family-power-outage-drill-20-minutes.html':pages[2].slug
};
if(Object.keys(reciprocal).length!==9)fail('Expected nine reciprocal links');
for(const [path,slug] of Object.entries(reciprocal))if(!read(path).includes(`${slug}.html`))fail(path+': reciprocal link missing');
for(const path of ['reports/editorial-decision-2026-11-06.md','reports/image-qa-2026-11-06.md','reports/search-console-editorial-log.md','reports/authority-opportunities.md'])if(!existsSync(resolve(root,path)))fail(path+': missing');
for(const source of ['https://www.cnyregionalmarket.org/visit','https://www.cnyregionalmarket.org/frequently-asked-questions','https://www.cnyregionalmarket.org/vendor-list'])if(!read(`guides/${pages[0].slug}.html`).includes(source))fail('Market source missing '+source);
for(const source of ['https://www.healthychildren.org/English/family-life/Media/Pages/Tips-for-Parents-Digital-Age.aspx','https://www.healthychildren.org/English/family-life/Media/Pages/screen-time-and-temper-tantrums-helpful-tips-for-parents.aspx','https://www.cpsc.gov/Safety-Education/Safety-Education-Centers/Button-Cell-and-Coin-Battery','https://www.cpsc.gov/Recalls'])if(!read(`guides/${pages[1].slug}.html`).includes(source))fail('Timer source missing '+source);
for(const source of ['https://www.energy.gov/sites/default/files/2021-08/ES-Home%20Energy%20Assessments_080221.pdf','https://www.energy.gov/sites/default/files/2021-08/ES-Air%20Sealing_080421.pdf'])if(!read(`guides/${pages[2].slug}.html`).includes(source))fail('Draft source missing '+source);
if(!home.includes('FRESH IDEAS · NOVEMBER 6, 2026'))fail('Homepage lead date not refreshed');
if(!home.includes('weekend-november-7-8-2026.html'))fail('Current weekly roundup homepage link missing');
if(!existsSync(resolve(root,'weekend-november-7-8-2026.html')))fail('Current Nov 7-8 weekend roundup missing');
const placements=pages.reduce((n,p)=>n+allHtml.reduce((m,h)=>m+[...h.matchAll(new RegExp(`<img\\b[^>]*src="[^"]*${p.image.replaceAll('.','\\.')}`, 'g'))].length,0),0);
if(placements!==11)fail(`Expected 11 image placements across articles, homepage, hubs and credits, found ${placements}`);
console.log('November 6 daily audit passed: 3 pages, full 216-page inventory, 3 unique titles/slugs/images, 3 new and 264 sitewide affiliate links, primary sources, current weekly-roundup separation, schema, credits and internal links present.');
