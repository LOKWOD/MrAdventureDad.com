import {appendFileSync,readFileSync,writeFileSync} from 'node:fs';
import {resolve} from 'node:path';
import {pages} from './content-2026-11-01.mjs';

const root=resolve(process.argv[2]||'.'),date='2026-11-01',start='<!-- DAILY 2026-11-01 -->',end='<!-- END DAILY 2026-11-01 -->';
const read=p=>readFileSync(resolve(root,p),'utf8'),write=(p,s)=>writeFileSync(resolve(root,p),s);
if(pages.length!==3)throw Error('Exactly three November 1 sources required');
const template=read('scripts/publish-daily-2026-10-17.mjs').match(/const pageHtml=p=>(`[\s\S]*?`);\n\nfor\(const p of pages\)/)?.[1];
if(!template)throw Error('Versioned renderer changed');
const render=new Function('date','imageUrl',`return p=>${template}`)(date,n=>`https://mradventuredad.com/assets/images/photos/${n}`);
for(const p of pages){
 let h=render(p).replaceAll('v=20261017','v=20261101').replace(`src="../assets/images/photos/${p.image}"`,`src="../assets/images/photos/${p.image}" width="1600" height="900" style="height:auto"`);
 h=h.replace('<meta name="twitter:card"',`<meta property="og:image:width" content="1600"><meta property="og:image:height" content="900"><meta property="og:image:alt" content="${p.alt}"><meta name="twitter:image:alt" content="${p.alt}"><meta name="twitter:card"`);
 const crumbs={'@context':'https://schema.org','@type':'BreadcrumbList',itemListElement:[{'@type':'ListItem',position:1,name:'Home',item:'https://mradventuredad.com/'},{'@type':'ListItem',position:2,name:'Adventures',item:'https://mradventuredad.com/adventures.html'},{'@type':'ListItem',position:3,name:p.title}]};
 h=h.replace('</head>',`<script type="application/ld+json">${JSON.stringify(crumbs)}</script></head>`);
 write(`guides/${p.slug}.html`,h);
}
function insert(path,needle,block){let h=read(path).replace(new RegExp(`${start}[\\s\\S]*?${end}`,'g'),'');if(!h.includes(needle))throw Error(path+': insertion marker missing');write(path,h.replace(needle,start+block+end+needle));}
const link=i=>`guides/${pages[i].slug}.html`,img=p=>`<img src="assets/images/photos/${p.image}" width="1600" height="900" style="height:auto;aspect-ratio:16/9;object-fit:contain" alt="${p.alt}" loading="lazy" decoding="async">`;

let home=read('index.html').replace(new RegExp(`${start}[\\s\\S]*?${end}`,'g'),'');
const priorPattern=/<!-- DAILY 2026-10-31 -->[\s\S]*?<!-- END DAILY 2026-10-31 -->/g,prior=home.match(priorPattern)?.[0];
home=home.replace(priorPattern,'');
if(prior)home=home.replace('<div class="field-archive-content">','<div class="field-archive-content">'+prior);
const options=[
 ['TONIGHT · 20 MINUTES · NO-SPEND',link(2),'Run the power-outage drill','Find the lights, write the fridge clock and make the CO stop rule boring before it matters.'],
 ['WEEKEND · MADISON COUNTY',link(0),'See Delphi Falls without forcing the hike','Lower falls first, one posted trail only if the surface and family energy earn it.'],
 ['BREAK DAY · WINTER FIT',link(1),'Run the helmet-and-goggle test','Use the real helmet and glasses before choosing youth, OTG or low-light.'],
 ['AT HOME · LOW ENERGY',link(2),'Practice just three outage moves','Find one light, keep the fridge closed and say the no-combustion boundary.'],
 ['HALF DAY · WATERFALL',link(0),'Use the 20-minute turnaround','The waterfall counts before the trail. Leave at the first stop signal.'],
 ['RAINY DAY · INDOOR BACKUP','guides/family-museum-day-system.html','Use the three-anchor museum system','Keep a finishable indoor route ready when ice or high water cancels the park.']
];
const lead=`<section class="now-plans wrap" aria-labelledby="now-plans-title"><div class="now-plans-head"><div><p class="kicker">FRESH IDEAS · NOVEMBER 1, 2026</p><h2 id="now-plans-title">Pick the time you actually have.</h2><p>Take the lower-falls-first route, solve ski-goggle fit before color, or run a calm no-spend outage drill at home. Dated weekend events stay in the separate weekly guide.</p></div><a href="adventures.html">Browse all adventures →</a></div><div class="now-plans-grid">${options.map(o=>`<article class="now-plan"><span>${o[0]}</span><h3><a href="${o[1]}">${o[2]}</a></h3><p>${o[3]}</p></article>`).join('')}</div></section>`;
if(!/<section class="now-plans wrap"[\s\S]*?<section class="intro wrap">/.test(home))throw Error('Homepage lead missing');
home=home.replace(/<section class="now-plans wrap"[\s\S]*?<section class="intro wrap">/,lead+'<section class="intro wrap">');
const cards=`${start}<section class="stories wrap"><div class="section-head"><div><p class="kicker">THREE DIFFERENT FAMILY PROBLEMS</p><h2>See the falls. Fit the goggles. Drill the outage.</h2></div></div><div class="story-grid">${pages.map((p,i)=>`<article class="story-card">${img(p)}<div><span>${['MADISON COUNTY · CONCEPTUAL TRIP-PLANNING IMAGE','SKI GOGGLES · GENERIC CATEGORY IMAGE','AT HOME · CONCEPTUAL DRILL IMAGE'][i]}</span><h3><a href="${link(i)}">${p.title}</a></h3><p>${[p.dek,p.dek,p.dek][i]}</p></div></article>`).join('')}</div></section>${end}`;
home=home.replace('<details class="field-archive wrap">',cards+'<details class="field-archive wrap">');
write('index.html',home);

insert('adventures.html','<!-- MAD AFFILIATE COMMERCE -->',`<section class="content-section alt"><div class="wrap"><p class="kicker">THREE DIFFERENT FAMILY NEEDS</p><div class="simple-list">${pages.map(p=>`<a href="guides/${p.slug}.html">${p.title} <b>→</b></a>`).join('')}</div></div></section>`);
insert('destinations.html','</main>',`<section class="content-section alt"><div class="wrap"><p class="kicker">MADISON COUNTY · LOWER FALLS FIRST</p><div class="card-grid"><article class="card">${img(pages[0])}<div><span>75–120 MINUTES · NO SWIMMING</span><h3><a href="${link(0)}">Delphi Falls County Park with kids</a></h3><p>Let the first permitted waterfall view count, then choose one posted trail only if today’s surface earns it.</p></div></article></div></div></section>`);
insert('gear.html','</main>',`<section class="content-section alt"><div class="wrap"><p class="kicker">SKI GOGGLES · FIT BEFORE COLOR</p><div class="card-grid"><article class="card">${img(pages[1])}<div><span>YOUTH · OTG · LOW-LIGHT</span><h3><a href="${link(1)}">Kids’ ski goggles: start with the helmet test</a></h3><p>Compare face seal, helmet interface, real glasses and documented VLT before lens color.</p></div></article></div></div></section>`);
insert('outdoors.html','</main>',`<section class="content-section alt"><div class="wrap"><p class="kicker">OUTSIDE, ON THE HILL OR HOME</p><div class="simple-list"><a href="${link(0)}">Use the lower-falls-first Delphi Falls route <b>→</b></a><a href="${link(1)}">Fit youth, OTG and low-light ski goggles <b>→</b></a><a href="${link(2)}">Run the no-spend power-outage drill <b>→</b></a></div></div></section>`);

export const reciprocal={
 'guides/chittenango-falls-with-kids.html':`<aside class="note"><strong>Need a shorter county-park waterfall plan?</strong> Use the <a href="${pages[0].slug}.html">lower-falls-first Delphi Falls route</a> and decide on one trail only after arrival.</aside>`,
 'guides/central-new-york-family-trail-picker.html':`<aside class="note"><strong>Apply the trail gate to a real stop:</strong> the <a href="${pages[0].slug}.html">Delphi Falls family plan</a> uses one posted route and a 20-minute turnaround.</aside>`,
 'guides/family-outdoor-weather-cutoff-plan.html':`<aside class="note"><strong>Waterfall-day proof:</strong> pair this cutoff with the <a href="${pages[0].slug}.html">Delphi Falls lower-falls-first plan</a>.</aside>`,
 'guides/first-ski-day-with-kids.html':`<aside class="note"><strong>Before the hill:</strong> run the <a href="${pages[1].slug}.html">kids’ ski-goggle helmet-and-glasses fit test</a>.</aside>`,
 'guides/kids-winter-hats-beanie-earflap-balaclava-fit-guide.html':`<aside class="note"><strong>Adding a helmet and goggles?</strong> Use the <a href="${pages[1].slug}.html">youth, OTG and low-light goggle guide</a> without assuming a bulky layer is compatible.</aside>`,
 'guides/kids-winter-boots-pac-snow-hiking-guide.html':`<aside class="note"><strong>Finish the first-ski fit check:</strong> compare the real helmet and glasses with the <a href="${pages[1].slug}.html">kids’ ski-goggle guide</a>.</aside>`,
 'guides/family-headlamps-flashlights-lanterns.html':`<aside class="note"><strong>Put the light into a behavior plan:</strong> the <a href="${pages[2].slug}.html">20-minute outage drill</a> fixes flashlight locations without turning the house dark.</aside>`,
 'guides/family-power-banks-car-chargers.html':`<aside class="note"><strong>Power belongs in a larger plan:</strong> use the <a href="${pages[2].slug}.html">family power-outage drill</a> for phones, fridge timing and the CO stop rule.</aside>`,
 'guides/family-noaa-weather-radio-same-hand-crank-guide.html':`<aside class="note"><strong>Practice the household layer:</strong> the <a href="${pages[2].slug}.html">20-minute power-outage drill</a> connects alerts to lights, food, phones and medical needs.</aside>`
};
for(const [path,block] of Object.entries(reciprocal))insert(path,'</main>',block);

for(const path of ['index.html','adventures.html','destinations.html','gear.html','outdoors.html'])write(path,read(path).replace(/href="assets\/css\/style\.css(?:\?v=\d+)?"/,'href="assets/css/style.css?v=20261101"'));

let map=read('sitemap.xml');
for(const p of pages)map=map.replace(new RegExp(`  <url><loc>https://mradventuredad\\.com/guides/${p.slug}\\.html</loc><lastmod>[^<]+</lastmod></url>\\n?`,'g'),'');
map=map.replace('</urlset>',pages.map(p=>`  <url><loc>https://mradventuredad.com/guides/${p.slug}.html</loc><lastmod>${date}</lastmod></url>`).join('\n')+'\n</urlset>');
write('sitemap.xml',map);

const credits=JSON.parse(read('assets/images/credits.json'));
credits['assets/images/photos/delphi-falls-family-plan.webp']={title:'Conceptual family waterfall-day planning still life',creator:'Mr Adventure Dad Editorial Desk with OpenAI image generation',source:'Original AI-assisted editorial photography',license:'Copyright Mr Adventure Dad',verified:date,notes:'Conceptual generic waterfall planning scene; explicitly not Delphi Falls, a park trail, present water level, access or conditions. Not affiliate/product imagery.'};
credits['assets/images/photos/kids-ski-goggles-fit-categories.webp']={title:'Generic youth ski-goggle fit categories',creator:'Mr Adventure Dad Editorial Desk with OpenAI image generation',source:'Original AI-assisted editorial photography',license:'Copyright Mr Adventure Dad',verified:date,notes:'Unbranded youth, OTG and low-light category stand-ins with helmet and glasses; not exact products, testing, certification, optical performance or compatibility. Not affiliate/product imagery.'};
credits['assets/images/photos/family-power-outage-drill.webp']={title:'Conceptual family power-outage drill kit',creator:'Mr Adventure Dad Editorial Desk with OpenAI image generation',source:'Original AI-assisted editorial photography',license:'Copyright Mr Adventure Dad',verified:date,notes:'Conceptual planning still life; no active outage, flame, generator, fuel, live wiring or product claim. Not affiliate/product imagery.'};
write('assets/images/credits.json',JSON.stringify(credits,null,2)+'\n');

insert('photo-credits.html','</section><h2>Additional editorial photography</h2>',pages.map((p,i)=>`<article class="photo-credit-card"><img src="assets/images/photos/${p.image}" alt="${p.alt}" loading="lazy" decoding="async"><div><h2>${['Waterfall-day planning still life','Youth ski-goggle category comparison','Family power-outage drill kit'][i]}</h2><p>Original AI-assisted editorial photograph created for Mr Adventure Dad.</p><p>${['Conceptual only; not Delphi Falls, a current trail, access feature, water level or condition.','Generic unbranded categories; not affiliate imagery, exact products, certification, optical testing or helmet compatibility.','Conceptual drill kit; no active outage, live wiring, flame, generator, fuel or readiness proof.'][i]}</p></div></article>`).join(''));

write('reports/editorial-decision-2026-11-01.md',`# Editorial decision record — November 1, 2026

## Inventory and duplication gate

The complete October 31 production inventory contained 197 HTML documents before this batch. Titles, slugs, locations, trip angles, commercial categories, images, the previous fourteen days and the separate October 31–November 1 weekend roundup were checked. No November 1 trio existed. Existing Chittenango, Pratts, Salmon River, Letchworth, ski-day, winter-hat, winter-boot, lighting, power-bank and weather-radio intent was preserved; the three new pages solve distinct problems.

## Search Console decision

The private report was generated October 28, 2026 for September 28 through October 25. MrAdventureDad.com recorded 711 impressions, 7 clicks, 0.98% CTR and average position 17.96. The zero-click Adventures (15 impressions, position 7.7), Destinations (9, 13.9) and Gear (10, 13.9) hubs justified stronger homepage, hub, sitemap and reciprocal discovery. Howe Caverns (81 impressions), folding wagons (27), camping sleep (9) and travel bags (8) already have established pages and recent support, so another derivative page would risk cannibalization. One- and two-impression fragments were ignored as too weak.

## Portfolio labels

- **Authority-expansion — Delphi Falls County Park With Kids:** a distinct Madison County lower-falls-first route with current county rules, a one-trail decision and access questions.
- **Authority-expansion — Kids’ Ski Goggles:** a fit-first commercial framework for youth, OTG and low-light needs using the real helmet and glasses.
- **Exploration — 20-Minute Family Power-Outage Drill:** a no-spend school-night preparedness system with adult-only electrical and fuel boundaries.

## Authority action

Each page adds a citation-ready decision asset: a lower-falls-first 20-minute turnaround, an eight-minute helmet-and-glasses fit test, and a five-box outage card grounded in Ready.gov and CDC guidance. Nine established guides now link back, while the current homepage, four hubs, sitemap and credit records strengthen discovery and trust.

## Image gate before publication

Three original editorial images were visually inspected at final 1600×900 dimensions against title, copy, caption, alt and credits. All are explicitly conceptual or generic. There are zero affiliate/product images. A second rendered live pass remains required after deployment.
`);
write('reports/image-qa-2026-11-01.md',`# Image QA — November 1, 2026

## Pass 1: final assets

- Delphi Falls page: final 1600×900 conceptual planning image visually checked; the copy and caption explicitly state it is not Delphi Falls or current conditions.
- Ski-goggle page: final 1600×900 generic unbranded category image visually checked; it shows three frames, ordinary eyeglasses and a helmet without exact product or performance claims.
- Power-outage page: final 1600×900 conceptual drill image visually checked; no flame, generator, fuel, live panel or active emergency is shown.
- Affiliate/product images: 0.

## Pass 2: live rendered

- Pending deployment.
`);
if(!read('reports/search-console-editorial-log.md').includes('# 2026-11-01'))appendFileSync(resolve(root,'reports/search-console-editorial-log.md'),`
# 2026-11-01

- Report generated: 2026-10-28; window 2026-09-28 through 2026-10-25.
- Used: 711 impressions, 7 clicks, 0.98% CTR and position 17.96, plus zero-click Adventures (15 / 7.7), Destinations (9 / 13.9) and Gear (10 / 13.9), to strengthen discovery through the homepage, four hubs, sitemap and nine reciprocal links.
- Deliberately not chased: Howe Caverns (81 impressions), folding wagons (27), camping sleep (9) and travel bags (8) already have established pages and recent support; another derivative page risked cannibalization.
- Ignored as weak: one- and two-impression query fragments.
- Portfolio: two authority-expansion items and one exploration; no derivative data-led page and no overlap with the October 31–November 1 roundup.
`);
let auth=read('reports/authority-opportunities.md');
if(!auth.includes('## 2026-11-01'))auth+=`
## 2026-11-01

- **Madison County Planning / Delphi Falls County Park** — https://www.madisoncounty.ny.gov/2873/Delphi-Falls-County-Park — factual-correction and accessible-route review for the independent lower-falls-first family plan; no endorsement implied.
- **Ski Areas of New York** — https://www.iskiny.com/contact — family-education angle for the helmet-and-glasses ski-goggle fit test, with manufacturer documentation and no paid placement request.
- **Onondaga County Emergency Management** — https://www.ongov.net/em/ — local-preparedness resource angle for the five-box family outage drill grounded in Ready.gov and CDC guidance.

No outreach, submission, account creation or paid placement was performed.
`;
write('reports/authority-opportunities.md',auth);
console.log('Generated exactly three November 1 guides, homepage time windows, four hubs, nine reciprocal links, sitemap, credits and authority records.');
