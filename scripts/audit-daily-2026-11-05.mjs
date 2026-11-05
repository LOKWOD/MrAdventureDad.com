import {existsSync,readFileSync,readdirSync,statSync} from 'node:fs';
import {resolve} from 'node:path';
import {pages} from './content-2026-11-05.mjs';

const root=resolve(process.argv[2]||'.'),fail=m=>{throw Error(m)},read=p=>readFileSync(resolve(root,p),'utf8');
if(pages.length!==3)fail('Exactly three source pages required');
for(const key of ['slug','title','image'])if(new Set(pages.map(p=>p[key])).size!==3)fail('Duplicate source '+key);
const inventory=JSON.parse(read('reports/inventory-2026-11-05.json'));
if(inventory.previousPageCount!==210||inventory.pageCount!==213||inventory.newPages?.length!==3||inventory.pages?.length!==213)fail('Complete inventory count mismatch');
const sitemap=read('sitemap.xml'),home=read('index.html'),credits=JSON.parse(read('assets/images/credits.json'));
let paid=0;
for(const [i,p] of pages.entries()){
 const path=`guides/${p.slug}.html`,h=read(path),url=`https://mradventuredad.com/guides/${p.slug}.html`;
 if(!h.includes(`<h1>${p.title}</h1>`))fail(path+': heading mismatch');
 if(!h.includes(`<link rel="canonical" href="${url}">`))fail(path+': canonical mismatch');
 for(const token of ['og:title','og:description','og:url','og:image','og:image:alt','twitter:image:alt','article:published_time','Article','Guide','BreadcrumbList'])if(!h.includes(token))fail(path+': missing '+token);
 if(!h.includes('2026-11-05'))fail(path+': date missing');
 if(!h.includes(`alt="${p.alt}"`))fail(path+': hero alt mismatch');
 if(!existsSync(resolve(root,`assets/images/photos/${p.image}`)))fail(path+': image file missing');
 if(!credits[`assets/images/photos/${p.image}`])fail(path+': image credit missing');
 if(!sitemap.includes(`<loc>${url}</loc><lastmod>2026-11-05</lastmod>`))fail(path+': sitemap row missing');
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
if(sitewidePaid!==261)fail(`Expected 261 active affiliate links sitewide, found ${sitewidePaid}`);
for(const p of pages)if(!read('adventures.html').includes(`guides/${p.slug}.html`))fail('adventures.html missing '+p.slug);
if(!read('destinations.html').includes(`guides/${pages[0].slug}.html`))fail('destinations.html missing destination');
if(!read('gear.html').includes(`guides/${pages[1].slug}.html`))fail('gear.html missing commercial guide');
for(const p of pages)if(!read('photo-credits.html').includes(p.image))fail('photo-credits missing '+p.image);
const reciprocal={
 'guides/family-museum-day-system.html':pages[0].slug,
 'guides/erie-canal-museum-with-kids.html':pages[0].slug,
 'guides/most-syracuse-with-kids.html':pages[0].slug,
 'guides/first-ski-day-with-kids.html':pages[1].slug,
 'guides/kids-ski-goggles-youth-otg-low-light-fit-guide.html':pages[1].slug,
 'guides/kids-winter-hats-beanie-earflap-balaclava-fit-guide.html':pages[1].slug,
 'guides/neighborhood-sound-map-20-minute-family-activity.html':pages[2].slug,
 'guides/family-foley-sound-effects-lab-30-minutes.html':pages[2].slug,
 'guides/paper-bridge-load-test-25-minute-family-stem.html':pages[2].slug
};
if(Object.keys(reciprocal).length!==9)fail('Expected nine reciprocal links');
for(const [path,slug] of Object.entries(reciprocal))if(!read(path).includes(`${slug}.html`))fail(path+': reciprocal link missing');
for(const path of ['reports/editorial-decision-2026-11-05.md','reports/image-qa-2026-11-05.md','reports/search-console-editorial-log.md','reports/authority-opportunities.md'])if(!existsSync(resolve(root,path)))fail(path+': missing');
for(const source of ['https://nysm.nysed.gov/visit','https://nysm.nysed.gov/exhibitions/ongoing','https://nysm.nysed.gov/exhibitions/ongoing/new-york-state-museum-carousel','https://nysm.nysed.gov/museum-renovation','https://empirestateplaza.ny.gov/parking'])if(!read(`guides/${pages[0].slug}.html`).includes(source))fail('Museum source missing '+source);
for(const source of ['https://www.cdc.gov/heads-up/safety/index.html/','https://www.cdc.gov/heads-up/media/pdfs/helmets/headsup_helmetfactsheet_ski_508.pdf','https://www.cpsc.gov/Recalls','https://store.astm.org/f2040-18.html'])if(!read(`guides/${pages[1].slug}.html`).includes(source))fail('Helmet source missing '+source);
for(const source of ['https://www.sciencebuddies.org/stem-activities/rubber-band-guitar','https://annex.exploratorium.edu/science-explorer/ear_guitar.html'])if(!read(`guides/${pages[2].slug}.html`).includes(source))fail('Sound source missing '+source);
if(!home.includes('FRESH IDEAS · NOVEMBER 5, 2026'))fail('Homepage lead date not refreshed');
if(!home.includes('weekend-november-7-8-2026.html'))fail('Current weekly roundup homepage link missing');
if(!existsSync(resolve(root,'weekend-november-7-8-2026.html')))fail('Current Nov 7-8 weekend roundup missing');
const placements=pages.reduce((n,p)=>n+allHtml.reduce((m,h)=>m+[...h.matchAll(new RegExp(`<img\\b[^>]*src="[^"]*${p.image.replaceAll('.','\\.')}`, 'g'))].length,0),0);
if(placements!==11)fail(`Expected 11 image placements across articles, homepage, hubs and credits, found ${placements}`);
console.log('November 5 daily audit passed: 3 pages, full 213-page inventory, 3 unique titles/slugs/images, 3 new and 261 sitewide affiliate links, primary sources, current weekly-roundup separation, schema, credits and internal links present.');
