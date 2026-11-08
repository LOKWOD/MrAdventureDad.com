import {appendFileSync,readFileSync,writeFileSync} from 'node:fs';
import {resolve} from 'node:path';
import {pages} from './content-2026-11-08.mjs';

const root=resolve(process.argv[2]||'.'),date='2026-11-08',start='<!-- DAILY 2026-11-08 -->',end='<!-- END DAILY 2026-11-08 -->';
const read=p=>readFileSync(resolve(root,p),'utf8'),write=(p,s)=>writeFileSync(resolve(root,p),s);
if(pages.length!==3)throw Error('Exactly three November 8 sources required');

const template=read('scripts/publish-daily-2026-10-17.mjs').match(/const pageHtml=p=>(`[\s\S]*?`);\n\nfor\(const p of pages\)/)?.[1];
if(!template)throw Error('Versioned renderer changed');
const render=new Function('date','imageUrl',`return p=>${template}`)(date,n=>`https://mradventuredad.com/assets/images/photos/${n}`);
for(const [i,p] of pages.entries()){
 let h=render(p).replaceAll('v=20261017','v=20261108').replace(`src="../assets/images/photos/${p.image}"`,`src="../assets/images/photos/${p.image}" width="1600" height="900" style="height:auto"`);
 h=h.replace('<meta name="twitter:card"',`<meta property="og:image:width" content="1600"><meta property="og:image:height" content="900"><meta property="og:image:alt" content="${p.alt}"><meta name="twitter:image:alt" content="${p.alt}"><meta name="twitter:card"`);
 const section=['Destinations','Gear','Adventures'][i],sectionUrl=['destinations.html','gear.html','adventures.html'][i];
 const crumbs={'@context':'https://schema.org','@type':'BreadcrumbList',itemListElement:[{'@type':'ListItem',position:1,name:'Home',item:'https://mradventuredad.com/'},{'@type':'ListItem',position:2,name:section,item:`https://mradventuredad.com/${sectionUrl}`},{'@type':'ListItem',position:3,name:p.title}]};
 h=h.replace('</head>',`<script type="application/ld+json">${JSON.stringify(crumbs)}</script></head>`);
 write(`guides/${p.slug}.html`,h);
}

function insert(path,needle,block){let h=read(path).replace(new RegExp(`${start}[\\s\\S]*?${end}`,'g'),'');if(!h.includes(needle))throw Error(path+': insertion marker missing');write(path,h.replace(needle,start+block+end+needle));}
const link=i=>`guides/${pages[i].slug}.html`,img=p=>`<img src="assets/images/photos/${p.image}" width="1600" height="900" style="height:auto;aspect-ratio:16/9;object-fit:contain" alt="${p.alt}" loading="lazy" decoding="async">`;

let home=read('index.html').replace(new RegExp(`${start}[\\s\\S]*?${end}`,'g'),'');
home=home.replace(/<section class="stories" id="october-family-plans">[\s\S]*?(?=<section class="now-plans wrap")/,'');
const priorPattern=/<!-- DAILY 2026-11-07 -->[\s\S]*?<!-- END DAILY 2026-11-07 -->/g,prior=home.match(priorPattern)?.[0];
home=home.replace(priorPattern,'');
if(prior)home=home.replace('<div class="field-archive-content">','<div class="field-archive-content">'+prior);
const options=[
 ['TONIGHT · 20 MINUTES · NO-SPEND',link(2),'Read one NOAA weather map','Find the valid time, one pressure center and one front—then use the real local forecast.'],
 ['WEEKEND · CURRENT EVENTS','weekend-november-7-8-2026.html','Use the November 7–8 family guide','The separate Wednesday roundup owns this weekend’s live dates, tickets and event schedules.'],
 ['WEEKEND · 75-MINUTE MUSEUM',link(0),'Pick three OHA exhibits','Use one local overview, one deeper story and one child choice. Leave the research center for another day.'],
 ['SCHOOL NIGHT · GEAR FIT',link(1),'Run the boot-seal test','Fit the actual boot, snow pant and calf; reject any gaiter that changes the child’s walk.'],
 ['AT HOME · LOW ENERGY',link(2),'Decode one front in five minutes','Read the timestamp, trace one symbol and stop before the activity becomes a forecast.'],
 ['BREAK · INDOOR BACKUP','guides/family-three-object-mini-museum-30-minute-activity.html','Build a three-object mini museum','Use one table and three honest labels when downtown parking or museum hours do not fit.']
];
const lead=`<section class="now-plans wrap" aria-labelledby="now-plans-title"><div class="now-plans-head"><div><p class="kicker">FRESH IDEAS · NOVEMBER 8, 2026</p><h2 id="now-plans-title">Pick the time you actually have.</h2><p>Read a NOAA map tonight without pretending to forecast, use the separate weekend roundup for live events, or give Syracuse history a three-exhibit finish line.</p></div><a href="adventures.html">Browse all adventures →</a></div><div class="now-plans-grid">${options.map(o=>`<article class="now-plan"><span>${o[0]}</span><h3><a href="${o[1]}">${o[2]}</a></h3><p>${o[3]}</p></article>`).join('')}</div></section>`;
if(!/<section class="now-plans wrap"[\s\S]*?<section class="intro wrap">/.test(home))throw Error('Homepage lead missing');
home=home.replace(/<section class="now-plans wrap"[\s\S]*?<section class="intro wrap">/,lead+'<section class="intro wrap">');
const cards=`${start}<section class="stories wrap"><div class="section-head"><div><p class="kicker">THREE DIFFERENT FAMILY NEEDS</p><h2>Pick three exhibits. Seal the boot. Read the map.</h2></div></div><div class="story-grid">${pages.map((p,i)=>`<article class="story-card">${img(p)}<div><span>${['SYRACUSE HISTORY · CONCEPTUAL PLANNING IMAGE','KIDS’ WINTER GAITERS · GENERIC CATEGORY IMAGE','AT HOME · EXACT WEATHER-MAP SETUP'][i]}</span><h3><a href="${link(i)}">${p.title}</a></h3><p>${p.dek}</p></div></article>`).join('')}</div></section>${end}`;
home=home.replace('<details class="field-archive wrap">',cards+'<details class="field-archive wrap">');
write('index.html',home);

insert('adventures.html','<!-- MAD AFFILIATE COMMERCE -->',`<section class="content-section alt"><div class="wrap"><p class="kicker">LOCAL HISTORY · WINTER FIT · WEATHER LITERACY</p><div class="simple-list">${pages.map(p=>`<a href="guides/${p.slug}.html">${p.title} <b>→</b></a>`).join('')}</div></div></section>`);
insert('destinations.html','</main>',`<section class="content-section alt"><div class="wrap"><p class="kicker">DOWNTOWN SYRACUSE · FINISHABLE LOCAL HISTORY</p><div class="card-grid"><article class="card">${img(pages[0])}<div><span>THREE EXHIBITS · CURRENT HOURS, COST, PARKING AND ACCESS GATES</span><h3><a href="${link(0)}">Onondaga Historical Museum with kids</a></h3><p>Choose three exhibits, bring the current adult admission and leave the research center for another day.</p></div></article></div></div></section>`);
insert('gear.html','</main>',`<section class="content-section alt"><div class="wrap"><p class="kicker">KIDS’ WINTER GAITERS · SEAL THE REAL BOOT</p><div class="card-grid"><article class="card">${img(pages[1])}<div><span>LOW · MID-CALF · TALLER SNOW COVERAGE · WALK TEST</span><h3><a href="${link(1)}">Choose kids’ gaiters by the boot and snow depth</a></h3><p>Match the shortest useful height, inspect the instep strap and reject any fit that changes walking.</p></div></article></div></div></section>`);

export const reciprocal={
 'guides/family-museum-day-system.html':`<aside class="note"><strong>Use the pick-three rule downtown:</strong> the <a href="${pages[0].slug}.html">Onondaga Historical Museum family plan</a> adds current hours, admission, parking, access and a three-exhibit route.</aside>`,
 'guides/erie-canal-museum-with-kids.html':`<aside class="note"><strong>Want a second Syracuse history option?</strong> The <a href="${pages[0].slug}.html">Onondaga Historical Museum plan</a> uses one local overview, one deeper story and one child choice.</aside>`,
 'guides/skanonh-great-law-of-peace-center-with-kids.html':`<aside class="note"><strong>Keep the local-history cluster honest:</strong> the <a href="${pages[0].slug}.html">downtown OHA guide</a> separates its exhibit route from Skä•noñh’s Haudenosaunee-centered work.</aside>`,
 'guides/kids-winter-boots-pac-snow-hiking-guide.html':`<aside class="note"><strong>Snow still enters over the boot?</strong> The <a href="${pages[1].slug}.html">kids’ winter-gaiter guide</a> adds a five-point boot-seal and walk test without pretending to fix bad boot fit.</aside>`,
 'guides/kids-snow-pants-bibs-waist-one-piece-guide.html':`<aside class="note"><strong>Check the boot cuff next:</strong> the <a href="${pages[1].slug}.html">low vs mid vs taller gaiter guide</a> matches coverage to actual snow depth and the dressed calf.</aside>`,
 'guides/kids-snowshoes-molded-adjustable-frame-fit-guide.html':`<aside class="note"><strong>Keep snowshoe spray out only after the binding fits:</strong> the <a href="${pages[1].slug}.html">kids’ gaiter boot-seal test</a> checks height, straps and walking separately.</aside>`,
 'guides/family-outdoor-weather-cutoff-plan.html':`<aside class="note"><strong>Teach the map without handing over the decision:</strong> the <a href="${pages[2].slug}.html">20-minute NOAA weather-map read</a> ends at the official local forecast.</aside>`,
 'guides/family-noaa-weather-radio-same-hand-crank-guide.html':`<aside class="note"><strong>Pair alerts with basic map literacy:</strong> the <a href="${pages[2].slug}.html">four-box weather-map activity</a> covers valid time, pressure centers, fronts and the forecast boundary.</aside>`,
 'guides/seven-day-family-backyard-rain-log.html':`<aside class="note"><strong>Add a national-map snapshot without chasing weather:</strong> the <a href="${pages[2].slug}.html">20-minute front-and-pressure activity</a> stays indoors and uses the local forecast for decisions.</aside>`
};
for(const [path,block] of Object.entries(reciprocal))insert(path,'</main>',block);

for(const path of ['index.html','adventures.html','destinations.html','gear.html'])write(path,read(path).replace(/href="assets\/css\/style\.css(?:\?v=\d+)?"/,'href="assets/css/style.css?v=20261108"'));

let map=read('sitemap.xml');
for(const p of pages)map=map.replace(new RegExp(`  <url><loc>https://mradventuredad\\.com/guides/${p.slug}\\.html</loc><lastmod>[^<]+</lastmod></url>\\n?`,'g'),'');
map=map.replace('</urlset>',pages.map(p=>`  <url><loc>https://mradventuredad.com/guides/${p.slug}.html</loc><lastmod>${date}</lastmod></url>`).join('\n')+'\n</urlset>');
write('sitemap.xml',map);

const credits=JSON.parse(read('assets/images/credits.json'));
credits['assets/images/photos/onondaga-historical-museum-family-plan.webp']={title:'Conceptual Onondaga Historical Museum family planning still life',creator:'Mr Adventure Dad Editorial Desk with OpenAI image generation',source:'Original AI-assisted editorial photography',license:'Copyright Mr Adventure Dad',verified:date,notes:'Blank three-stop card, generic industry, train and civic symbols, sketchbook, shoes, layer, water and bag; explicitly not the named museum, collection, exhibit, ticket, parking, access feature or current condition. Not affiliate/product imagery.'};
credits['assets/images/photos/kids-winter-gaiter-categories.webp']={title:'Generic child-size winter gaiter height categories',creator:'Mr Adventure Dad Editorial Desk with OpenAI image generation',source:'Original AI-assisted editorial photography',license:'Copyright Mr Adventure Dad',verified:date,notes:'Fictional unbranded low, mid-calf and taller gaiter forms beside generic boots and snow pants; not exact products, sizing, waterproofing, testing, prices, stock, ratings or affiliate imagery.'};
credits['assets/images/photos/family-weather-map-read.webp']={title:'Family weather-map reading activity setup',creator:'Mr Adventure Dad Editorial Desk with OpenAI image generation',source:'Original AI-assisted editorial photography',license:'Copyright Mr Adventure Dad',verified:date,notes:'Tablet with fictional generic H, L and front symbols, blank four-box card, pencil, timer and observation card; not current weather, a live forecast, warning, app, location or product endorsement.'};
write('assets/images/credits.json',JSON.stringify(credits,null,2)+'\n');

insert('photo-credits.html','</section><h2>Additional editorial photography</h2>',pages.map((p,i)=>`<article class="photo-credit-card">${img(p)}<div><h2>${['Onondaga Historical Museum family planning','Kids’ winter gaiter height categories','Family weather-map reading setup'][i]}</h2><p>Original AI-assisted editorial photograph created for Mr Adventure Dad.</p><p>${['Conceptual only; not the named museum, collection, exhibit, ticket, parking, access feature or live condition.','Generic fictional categories; not exact products, sizing, waterproofing, testing, prices, ratings, stock or affiliate imagery.','Exact generic activity setup; fictional map only, not current weather, a live forecast, warning, app or location.'][i]}</p></div></article>`).join(''));

write('reports/editorial-decision-2026-11-08.md',`# Editorial decision record — November 8, 2026

## Inventory and duplication gate

The complete production site contained 219 HTML documents before this batch. Every title, slug, heading, description, primary keyword, location, trip angle, commercial category and image was checked, including the previous fourteen days and the separate November 7–8 weekly roundup. No November 8 daily trio existed. Sleds, snow pants, food jars, walkie-talkies, museum-day systems, trail-map reading, stop motion and event pages were rejected as existing or near-duplicate intent. Onondaga Historical Museum, child-size winter gaiter fit and a zero-forecasting NOAA map read have no dedicated page and do not compete with the weekly roundup.

## Search Console decision

The private report was generated November 4, 2026 for October 5 through November 1—four days old and within the eight-day gate. MrAdventureDad.com recorded 660 impressions, 5 clicks, 0.8% CTR and average position 19.5. Folding wagon (23 impressions, one click, position 13.2), Howe Caverns (70/1/9.4), MOST (41/1/13.8) and Letchworth (3/1/9.7) already serve their intents, so derivative pages were rejected. Zero-click Adventures (16 impressions, position 12.2), Destinations (10/0/13.0) and Gear (12/0/19.8) supported stronger hub, homepage, sitemap and reciprocal discovery. One-to-three-impression query fragments, branded noise and isolated weak terms were deliberately ignored.

## Portfolio labels

- **Authority-expansion — Onondaga Historical Museum With Kids:** a distinct Syracuse history destination with a three-exhibit route and current official hours, price, parking, access and renovation gates.
- **Authority-expansion — Kids’ Winter Gaiters:** a commercial fit framework that separates low, mid-calf and taller coverage and requires the real boot, child and walk test.
- **Exploration — 20-Minute Family Weather-Map Read:** a no-spend school-night literacy activity that teaches valid time, pressure centers and fronts while keeping decisions with the official local forecast.

No new page is primarily Data-led because the credible report supports hub discovery and existing page reinforcement rather than an uncovered query. Diversity is preserved across a local indoor destination, a winter clothing interface purchase and a no-spend NOAA literacy activity.

## Authority action

The batch creates three citation-ready tools: a three-exhibit local-history route, a four-option gaiter height matrix with a five-point boot-seal test, and a four-box weather-map evidence card. Nine established guides link back, the three primary hubs are strengthened, and each page states source dates and fact/inference boundaries.

## Image gate before publication

Three unique final 1600×900 editorial images were visually inspected after WebP conversion against title, body, caption, alt, credit and linked subject. The OHA image is explicitly conceptual; the gaiter image shows fictional unbranded category forms rather than linked products; the weather image shows the exact generic setup with a fictional map. There are zero affiliate/product images. A second rendered live pass remains required after deployment.
`);
write('reports/image-qa-2026-11-08.md',`# Image QA — November 8, 2026

## Pass 1: final assets

- 3 unique 1600×900 editorial images visually inspected after final WebP conversion.
- 0 affiliate/product images used.
- OHA museum plan: blank three-stop card, generic industry/train/civic symbols, shoes, sketchbook, layer, water and closed bag; explicitly not the named museum, collection, exhibit, ticket, parking, accessibility or live condition.
- Winter gaiters: three fictional unbranded child-size height categories beside generic boots and snow pants; no exact product, size, waterproofing, testing, price, rating, stock or affiliate claim.
- Weather map: tablet with a fictional generic map, H/L, cold- and warm-front symbols, blank evidence card, timer and observation card; not current weather, a forecast, warning, app or named location.
- Titles, final copy, captions, alt text, credits and linked subject/category context checked.

## Pass 2: live rendered

- Pending deployment.
`);
if(!read('reports/search-console-editorial-log.md').includes('# 2026-11-08'))appendFileSync(resolve(root,'reports/search-console-editorial-log.md'),`
# 2026-11-08

- Report generated: 2026-11-04; window 2026-10-05 through 2026-11-01; age four days.
- Used: 660 impressions, 5 clicks, 0.8% CTR and position 19.5, plus zero-click Adventures (16 / 12.2), Destinations (10 / 13.0) and Gear (12 / 19.8), to strengthen three hubs, homepage, sitemap and nine reciprocal paths.
- Deliberately not chased: folding wagon (23 impressions, one click, position 13.2), Howe Caverns (70/1/9.4), MOST (41/1/13.8) and Letchworth (3/1/9.7) already have dedicated pages and support.
- Ignored as weak: one-to-three-impression fragments, branded noise and unstable isolated positions.
- Portfolio: two authority-expansion pages and one exploration; no Data-led new page because the usable evidence was hub-level rather than an uncovered query.
`);
let auth=read('reports/authority-opportunities.md');
if(!auth.includes('## 2026-11-08'))auth+=`
## 2026-11-08

- **Onondaga Historical Association** — https://www.cnyhistory.org/contact/ — factual-correction and family-access review for the three-exhibit route, especially current exhibit access, renovation status and accessible-entry details.
- **National Weather Service Binghamton education/outreach** — https://www.weather.gov/bgm/ — local weather-literacy resource fit for the four-box, zero-forecasting map-read framework; pitch the decision boundary, not a forecast endorsement.
- **Onondaga County Public Library family services** — https://www.onlib.org/contact-us — no-cost family-learning resource fit for the NOAA map activity and local-history route.

No outreach, submission, account creation or paid placement was performed.
`;
write('reports/authority-opportunities.md',auth);
console.log('Generated exactly three November 8 guides, current homepage time windows, three hubs, nine reciprocal links, sitemap, credits and authority records.');
