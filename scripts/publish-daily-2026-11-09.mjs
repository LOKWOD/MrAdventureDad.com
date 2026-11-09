import {appendFileSync,readFileSync,writeFileSync} from 'node:fs';
import {resolve} from 'node:path';
import {pages} from './content-2026-11-09.mjs';

const root=resolve(process.argv[2]||'.'),date='2026-11-09',start='<!-- DAILY 2026-11-09 -->',end='<!-- END DAILY 2026-11-09 -->';
const read=p=>readFileSync(resolve(root,p),'utf8'),write=(p,s)=>writeFileSync(resolve(root,p),s);
if(pages.length!==3)throw Error('Exactly three November 9 sources required');

const template=read('scripts/publish-daily-2026-10-17.mjs').match(/const pageHtml=p=>(`[\s\S]*?`);\n\nfor\(const p of pages\)/)?.[1];
if(!template)throw Error('Versioned renderer changed');
const render=new Function('date','imageUrl',`return p=>${template}`)(date,n=>`https://mradventuredad.com/assets/images/photos/${n}`);
for(const [i,p] of pages.entries()){
 let h=render(p).replaceAll('v=20261017','v=20261109').replace(`src="../assets/images/photos/${p.image}"`,`src="../assets/images/photos/${p.image}" width="1600" height="900" style="height:auto"`);
 h=h.replace('<meta name="twitter:card"',`<meta property="og:image:width" content="1600"><meta property="og:image:height" content="900"><meta property="og:image:alt" content="${p.alt}"><meta name="twitter:image:alt" content="${p.alt}"><meta name="twitter:card"`);
 const section=['Destinations','Gear','Adventures'][i],sectionUrl=['destinations.html','gear.html','adventures.html'][i];
 const crumbs={'@context':'https://schema.org','@type':'BreadcrumbList',itemListElement:[{'@type':'ListItem',position:1,name:'Home',item:'https://mradventuredad.com/'},{'@type':'ListItem',position:2,name:section,item:`https://mradventuredad.com/${sectionUrl}`},{'@type':'ListItem',position:3,name:p.title}]};
 h=h.replace('</head>',`<script type="application/ld+json">${JSON.stringify(crumbs)}</script></head>`);
 write(`guides/${p.slug}.html`,h);
}

function insert(path,needle,block){let h=read(path).replace(new RegExp(`${start}[\\s\\S]*?${end}`,'g'),'');if(!h.includes(needle))throw Error(path+': insertion marker missing');write(path,h.replace(needle,start+block+end+needle));}
const link=i=>`guides/${pages[i].slug}.html`,img=p=>`<img src="assets/images/photos/${p.image}" width="1600" height="900" style="height:auto;aspect-ratio:16/9;object-fit:contain" alt="${p.alt}" loading="lazy" decoding="async">`;

let home=read('index.html').replace(new RegExp(`${start}[\\s\\S]*?${end}`,'g'),'');
const priorPattern=/<!-- DAILY 2026-11-08 -->[\s\S]*?<!-- END DAILY 2026-11-08 -->/g,prior=home.match(priorPattern)?.[0];
home=home.replace(priorPattern,'');
if(prior)home=home.replace('<div class="field-archive-content">','<div class="field-archive-content">'+prior);
const options=[
 ['TONIGHT · 30 MINUTES · NO-SPEND',link(2),'Clean one safe block','Adults scan first. One bag, ordinary dry litter only, and anything hazardous gets reported.'],
 ['WEEKEND · FREE TRAIL',link(0),'Start Great Bear on Apple Trail','Carry the current map, check every junction and turn around before the trail network becomes the activity.'],
 ['SCHOOL NIGHT · CAR SYSTEM',link(1),'Run the visibility-kit driveway drill','Open the triangles, charge the amber beacons and fit the adult vest—never practice on a live road.'],
 ['AT HOME · LOW ENERGY',link(2),'Make the pick-leave-report card','Write four boxes in five minutes. No outdoor cleanup required.'],
 ['BREAK · OUTDOOR RESET','guides/central-new-york-family-trail-picker.html','Choose a different short CNY trail','Use the trail picker when Great Bear’s rustic map, bridges or restroom uncertainty do not fit.'],
 ['WEEKEND · FLEXIBLE','adventures.html','Use an evergreen picker','The November 7–8 roundup is archived; the separate Wednesday automation owns the next dated event list.']
];
const lead=`<section class="now-plans wrap" aria-labelledby="now-plans-title"><div class="now-plans-head"><div><p class="kicker">FRESH IDEAS · NOVEMBER 9, 2026</p><h2 id="now-plans-title">Pick the time you actually have.</h2><p>Clean one safe block tonight, use a map-first Great Bear route this weekend, or audit the car’s warning gear in the driveway.</p></div><a href="adventures.html">Browse all adventures →</a></div><div class="now-plans-grid">${options.map(o=>`<article class="now-plan"><span>${o[0]}</span><h3><a href="${o[1]}">${o[2]}</a></h3><p>${o[3]}</p></article>`).join('')}</div></section>`;
if(!/<section class="now-plans wrap"[\s\S]*?<section class="intro wrap">/.test(home))throw Error('Homepage lead missing');
home=home.replace(/<section class="now-plans wrap"[\s\S]*?<section class="intro wrap">/,lead+'<section class="intro wrap">');
const cards=`${start}<section class="stories wrap"><div class="section-head"><div><p class="kicker">THREE DIFFERENT FAMILY NEEDS</p><h2>Walk the woods. Fix the car kit. Clean one block.</h2></div></div><div class="story-grid">${pages.map((p,i)=>`<article class="story-card">${img(p)}<div><span>${['GREAT BEAR · CONCEPTUAL TRAIL IMAGE','ROADSIDE VISIBILITY · GENERIC CATEGORY IMAGE','NEIGHBORHOOD SERVICE · CONCEPTUAL CLEANUP IMAGE'][i]}</span><h3><a href="${link(i)}">${p.title}</a></h3><p>${p.dek}</p></div></article>`).join('')}</div></section>${end}`;
home=home.replace('<details class="field-archive wrap">',cards+'<details class="field-archive wrap">');
write('index.html',home);

insert('adventures.html','<!-- MAD AFFILIATE COMMERCE -->',`<section class="content-section alt"><div class="wrap"><p class="kicker">FREE TRAIL · CAR SYSTEM · NO-SPEND SERVICE</p><div class="simple-list">${pages.map(p=>`<a href="guides/${p.slug}.html">${p.title} <b>→</b></a>`).join('')}</div></div></section>`);
insert('destinations.html','</main>',`<section class="content-section alt"><div class="wrap"><p class="kicker">GREAT BEAR · APPLE TRAIL FIRST · MAP EVERY JUNCTION</p><div class="card-grid"><article class="card">${img(pages[0])}<div><span>FREE · DAWN TO DUSK · RUSTIC SHARED-USE TRAILS</span><h3><a href="${link(0)}">Great Bear with kids</a></h3><p>Use the Apple Trail, a 35-minute turnaround and a three-clue junction check.</p></div></article></div></div></section>`);
insert('gear.html','</main>',`<section class="content-section alt"><div class="wrap"><p class="kicker">ROADSIDE VISIBILITY · TRIANGLES · AMBER BEACONS · VEST</p><div class="card-grid"><article class="card">${img(pages[1])}<div><span>THREE DEVICE CATEGORIES · DRIVEWAY DRILL · NO LIVE-ROAD PRACTICE</span><h3><a href="${link(1)}">Build a family roadside visibility kit</a></h3><p>Compare reflective triangles, amber beacons and flares without pretending any gadget makes a shoulder safe.</p></div></article></div></div></section>`);

export const reciprocal={
 'guides/central-new-york-family-trail-picker.html':`<aside class="note"><strong>Add a free rustic option:</strong> the <a href="${pages[0].slug}.html">Great Bear first-visit plan</a> uses Apple Trail, a 35-minute turnaround and map checks at every junction.</aside>`,
 'guides/teach-kids-read-trail-map-25-minute-game.html':`<aside class="note"><strong>Use the skill on a real trail:</strong> the <a href="${pages[0].slug}.html">Great Bear family plan</a> gives the child one marker job while the adult owns navigation.</aside>`,
 'guides/family-outdoor-weather-cutoff-plan.html':`<aside class="note"><strong>Apply the cutoff to a rustic shared-use system:</strong> the <a href="${pages[0].slug}.html">Great Bear plan</a> adds daylight, bridge, map and restroom gates.</aside>`,
 'guides/family-roadside-breakdown-plan.html':`<aside class="note"><strong>Build the visibility layer:</strong> the <a href="${pages[1].slug}.html">triangles vs amber beacons vs flares guide</a> starts with vehicle position, hazards, calling and child control.</aside>`,
 'guides/winter-car-adventure-kit.html':`<aside class="note"><strong>Inspect the warning gear separately:</strong> the <a href="${pages[1].slug}.html">family roadside visibility guide</a> adds a no-live-road driveway drill and a no-deployment option.</aside>`,
 'guides/family-walking-visibility-gear-reflective-vest-bands-clip-light.html':`<aside class="note"><strong>Do not confuse walking gear with roadside control:</strong> the <a href="${pages[1].slug}.html">vehicle visibility kit guide</a> separates adult vest fit from triangles, beacons and safe placement.</aside>`,
 'guides/neighborhood-sound-map-20-minute-family-activity.html':`<aside class="note"><strong>Want a small service project instead?</strong> The <a href="${pages[2].slug}.html">30-minute neighborhood cleanup</a> uses one safe block, one bag and a hard hazard stop list.</aside>`,
 'guides/family-first-aid-kit-guide.html':`<aside class="note"><strong>Use the kit to support, not justify, cleanup:</strong> the <a href="${pages[2].slug}.html">one-bag family cleanup plan</a> keeps kids off roadways and away from hazardous debris.</aside>`,
 'guides/family-coat-pocket-reset-20-minute-system.html':`<aside class="note"><strong>Put the reset to work outdoors:</strong> the <a href="${pages[2].slug}.html">30-minute cleanup plan</a> calls for fitted gloves, bright layers and a stop-and-report rule.</aside>`
};
for(const [path,block] of Object.entries(reciprocal))insert(path,'</main>',block);

for(const path of ['index.html','adventures.html','destinations.html','gear.html'])write(path,read(path).replace(/href="assets\/css\/style\.css(?:\?v=\d+)?"/,'href="assets/css/style.css?v=20261109"'));
let map=read('sitemap.xml');
for(const p of pages)map=map.replace(new RegExp(`  <url><loc>https://mradventuredad\\.com/guides/${p.slug}\\.html</loc><lastmod>[^<]+</lastmod></url>\\n?`,'g'),'');
map=map.replace('</urlset>',pages.map(p=>`  <url><loc>https://mradventuredad.com/guides/${p.slug}.html</loc><lastmod>${date}</lastmod></url>`).join('\n')+'\n</urlset>');
write('sitemap.xml',map);

const credits=JSON.parse(read('assets/images/credits.json'));
credits['assets/images/photos/great-bear-family-trail-plan.webp']={title:'Conceptual Central New York family trail planning scene',creator:'Mr Adventure Dad Editorial Desk with OpenAI image generation',source:'Original AI-assisted editorial photography',license:'Copyright Mr Adventure Dad',verified:date,notes:'Generic late-autumn wooded trail, adult, two school-age children and folded map; explicitly not Great Bear Recreation Area, a named trail, sign, bridge, access feature or current condition. Not affiliate/product imagery.'};
credits['assets/images/photos/family-roadside-visibility-kit.webp']={title:'Generic family roadside visibility kit categories',creator:'Mr Adventure Dad Editorial Desk with OpenAI image generation',source:'Original AI-assisted editorial photography',license:'Copyright Mr Adventure Dad',verified:date,notes:'Fictional unbranded reflective triangles, cases, amber beacons, adult vest, gloves and flashlight; not exact products, certification, legal approval, testing, price, rating, stock or affiliate imagery.'};
credits['assets/images/photos/family-block-cleanup-plan.webp']={title:'Conceptual family neighborhood cleanup scene',creator:'Mr Adventure Dad Editorial Desk with OpenAI image generation',source:'Original AI-assisted editorial photography',license:'Copyright Mr Adventure Dad',verified:date,notes:'Generic adult and school-age children collecting ordinary paper and bottles on a quiet sidewalk verge; not a named block, official program, hazardous debris, private property or live traffic condition. Not affiliate/product imagery.'};
write('assets/images/credits.json',JSON.stringify(credits,null,2)+'\n');
insert('photo-credits.html','</section><h2>Additional editorial photography</h2>',pages.map((p,i)=>`<article class="photo-credit-card">${img(p)}<div><h2>${['Great Bear family trail planning','Family roadside visibility kit categories','Family neighborhood cleanup planning'][i]}</h2><p>Original AI-assisted editorial photograph created for Mr Adventure Dad.</p><p>${['Conceptual only; not Great Bear, a named trail, sign, bridge, access feature or current condition.','Generic fictional categories; not exact products, certification, legal approval, testing, prices, ratings, stock or affiliate imagery.','Conceptual only; ordinary litter on a quiet sidewalk verge, not a named block, official program, hazard, private property or live traffic condition.'][i]}</p></div></article>`).join(''));

write('reports/editorial-decision-2026-11-09.md',`# Editorial decision record — November 9, 2026

## Inventory and duplicate gate

The complete production site contained 222 HTML documents before this batch. Every title, slug, heading, description, primary keyword, location, trip angle, commercial category and image was checked, including the previous fourteen days and the separate November 7–8 weekly roundup. No November 9 daily trio existed. Museum, ski, snowshoe, wagon, weather-map, stop-motion and dated-event variants were rejected. Great Bear, a device-specific roadside visibility decision, and a traffic-free one-bag cleanup are distinct uncovered intents.

## Search Console decision

The private report was generated November 4, 2026 for October 5 through November 1—five days old and inside the eight-day gate. MrAdventureDad.com recorded 660 impressions, 5 clicks, 0.8% CTR and average position 19.5. Gear (12 impressions, zero clicks, position 19.8), Adventures (16/0/12.2) and Destinations (10/0/13.0) supported stronger hub, homepage, sitemap and reciprocal discovery. Howe Caverns (70/1/9.4), MOST (41/1/13.8), folding wagon (23/1/13.2) and one-to-three-impression query fragments were deliberately not chased.

## Portfolio labels

- **Authority-expansion — Great Bear Recreation Area With Kids:** an official-map-led Central New York trail plan with an Apple Trail first route, facilities uncertainty and shared-use boundaries.
- **Data-led — Family Roadside Visibility Kits:** one focused reinforcement of the zero-click Gear hub and the existing car-system cluster, with a different device-comparison intent from the broad winter kit and breakdown plan.
- **Exploration — 30-Minute Family Neighborhood Cleanup:** a no-spend after-school service plan with a primary-source hazard triage card and no event/date dependency.

The batch spans destination planning, high-intent gear and community service; only one page follows an analytics-supported cluster.

## Authority action

The cleanup page adds a citation-ready pick/leave/report/emergency hazard card built from DEC and Syracuse primary sources. Nine established pages add reciprocal contextual links, strengthening the CNY trail, family car-system and no-spend neighborhood clusters.

## Image gate before publication

Three unique final 1600×900 editorial images were visually inspected after WebP conversion against title, copy, caption, alt, credit and linked subject. The destination and cleanup images are explicitly conceptual; the gear image shows fictional unbranded categories rather than linked products. There are zero affiliate/product images. A second rendered live pass remains required after deployment.
`);
write('reports/image-qa-2026-11-09.md',`# Image QA — November 9, 2026

## Pass 1: final assets

- 3 unique 1600×900 editorial images visually inspected after final WebP conversion.
- 0 affiliate/product images used.
- Great Bear plan: generic late-autumn wooded path, adult, two school-age children, folded map and daypacks; explicitly not the named destination or current conditions.
- Roadside visibility kit: three reflective triangles with cases, two amber beacons, adult vest, gloves and flashlight; no brands, labels, model or certification claim.
- Neighborhood cleanup: adult and two school-age children with gloves and grabbers collecting ordinary paper/bottles on a quiet verge; no hazards or traffic interaction.
- Titles, final copy, captions, alt text, credits and linked subject/category context checked.

## Pass 2: live rendered

- Pending deployment.
`);
if(!read('reports/search-console-editorial-log.md').includes('# 2026-11-09'))appendFileSync(resolve(root,'reports/search-console-editorial-log.md'),`\n# 2026-11-09\n\n- Report generated: 2026-11-04; window 2026-10-05 through 2026-11-01; age five days.\n- Used: 660 impressions, 5 clicks, 0.8% CTR and position 19.5, plus Gear (12/0/19.8), Adventures (16/0/12.2) and Destinations (10/0/13.0), to add one focused car-system guide and strengthen three hubs, homepage, sitemap and nine reciprocal paths.\n- Deliberately not chased: Howe Caverns (70/1/9.4), MOST (41/1/13.8) and folding wagon (23/1/13.2) already serve their intents.\n- Ignored as weak: one-to-three-impression fragments, branded noise and unstable isolated positions.\n- Portfolio: one Data-led, one Authority-expansion and one Exploration page.\n`);
let auth=read('reports/authority-opportunities.md');
if(!auth.includes('## 2026-11-09'))auth+=`\n## 2026-11-09\n\n- **Friends of Great Bear** — https://friendsofgreatbear.org/contact — factual-correction and family-route review for the Apple Trail first-visit framework, especially current map, bridge and access details.\n- **City of Syracuse Adopt-A-Block / Cityline** — https://www.syr.gov/cityline — local family-service resource fit for the pick/leave/report hazard card; pitch clear separation from the formal Adopt-A-Block program.\n- **New York State DEC recycling education** — https://dec.ny.gov/environmental-protection/recycling-composting/waste-reduction/recycling-events-you-can-organize — educational-resource fit for the one-bag, traffic-free family cleanup framework.\n\nNo outreach, submission, account creation or paid placement was performed.\n`;
write('reports/authority-opportunities.md',auth);
console.log('Generated exactly three November 9 guides, current homepage time windows, three hubs, nine reciprocal links, sitemap, credits and authority records.');
