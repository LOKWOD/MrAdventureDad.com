import {appendFileSync,readFileSync,writeFileSync} from 'node:fs';
import {resolve} from 'node:path';
import {pages} from './content-2026-10-30.mjs';

const root=resolve(process.argv[2]||'.'),date='2026-10-30',start='<!-- DAILY 2026-10-30 -->',end='<!-- END DAILY 2026-10-30 -->';
const read=p=>readFileSync(resolve(root,p),'utf8'),write=(p,s)=>writeFileSync(resolve(root,p),s);
if(pages.length!==3)throw Error('Exactly three October 30 sources required');
const template=read('scripts/publish-daily-2026-10-17.mjs').match(/const pageHtml=p=>(`[\s\S]*?`);\n\nfor\(const p of pages\)/)?.[1];
if(!template)throw Error('Versioned renderer changed');
const render=new Function('date','imageUrl',`return p=>${template}`)(date,n=>`https://mradventuredad.com/assets/images/photos/${n}`);
for(const p of pages){
 let h=render(p).replaceAll('v=20261017','v=20261030').replace(`src="../assets/images/photos/${p.image}"`,`src="../assets/images/photos/${p.image}" width="1600" height="900" style="height:auto"`);
 h=h.replace('<meta name="twitter:card"',`<meta property="og:image:width" content="1600"><meta property="og:image:height" content="900"><meta property="og:image:alt" content="${p.alt}"><meta name="twitter:image:alt" content="${p.alt}"><meta name="twitter:card"`);
 const crumbs={'@context':'https://schema.org','@type':'BreadcrumbList',itemListElement:[{'@type':'ListItem',position:1,name:'Home',item:'https://mradventuredad.com/'},{'@type':'ListItem',position:2,name:'Adventures',item:'https://mradventuredad.com/adventures.html'},{'@type':'ListItem',position:3,name:p.title}]};
 h=h.replace('</head>',`<script type="application/ld+json">${JSON.stringify(crumbs)}</script></head>`);write(`guides/${p.slug}.html`,h);
}
function insert(path,needle,block){let h=read(path).replace(new RegExp(`${start}[\\s\\S]*?${end}`,'g'),'');if(!h.includes(needle))throw Error(path+': insertion marker missing');write(path,h.replace(needle,start+block+end+needle));}
const link=i=>`guides/${pages[i].slug}.html`,img=p=>`<img src="assets/images/photos/${p.image}" width="1600" height="900" style="height:auto;aspect-ratio:16/9;object-fit:contain" alt="${p.alt}" loading="lazy" decoding="async">`;

let home=read('index.html').replace(new RegExp(`${start}[\\s\\S]*?${end}`,'g'),'');
const priorPattern=/<!-- DAILY 2026-10-29 -->[\s\S]*?<!-- END DAILY 2026-10-29 -->/g,prior=home.match(priorPattern)?.[0];home=home.replace(priorPattern,'');if(prior)home=home.replace('<div class="field-archive-content">','<div class="field-archive-content">'+prior);
const options=[
 ['TONIGHT · 25 MINUTES · NO-SPEND',link(2),'Read one EnergyGuide label','Copy energy use, estimated cost and comparison range—then write one evidence sentence and stop.'],
 ['WEEKEND · CURRENT ROUNDUP','weekend-october-31-november-1-2026.html','Use the Halloween-weekend shortlist','The separate Wednesday guide owns current events, tickets and forecasts. Recheck every official source before leaving.'],
 ['HALF DAY · LIVERPOOL',link(0),'Use the three-story Skä•noñh route','Start with the Center’s welcome exhibit, follow its interpretation, and add only a short open lake walk.'],
 ['AFTER SCHOOL · GARAGE TEST',link(1),'Test snow-tool reach before the storm','Wear winter gloves, keep both feet down, and find the one clearing job the current kit cannot do.'],
 ['AT HOME · LOW ENERGY',link(2),'Read the yellow number, not the whole market','Use one official sample label and finish two fields in 10 minutes.'],
 ['BREAK · WEATHER BACKUP','guides/family-museum-day-system.html','Use the three-anchor museum system','Keep a finishable indoor route ready when weather or energy cancels a larger outing.']
];
const lead=`<section class="now-plans wrap" aria-labelledby="now-plans-title"><div class="now-plans-head"><div><p class="kicker">FRESH IDEAS · OCTOBER 30, 2026</p><h2 id="now-plans-title">Pick the time you actually have.</h2><p>Use the current weekend shortlist for dated plans, take a respectful three-story cultural-center route, test the family car’s snow tools before the storm, or decode one EnergyGuide label at home.</p></div><a href="adventures.html">Browse all adventures →</a></div><div class="now-plans-grid">${options.map(o=>`<article class="now-plan"><span>${o[0]}</span><h3><a href="${o[1]}">${o[2]}</a></h3><p>${o[3]}</p></article>`).join('')}</div></section>`;
if(!/<section class="now-plans wrap"[\s\S]*?<section class="intro wrap">/.test(home))throw Error('Homepage lead missing');home=home.replace(/<section class="now-plans wrap"[\s\S]*?<section class="intro wrap">/,lead+'<section class="intro wrap">');
const cards=`${start}<section class="stories wrap"><div class="section-head"><div><p class="kicker">THREE DIFFERENT FAMILY PROBLEMS</p><h2>Listen closely. Clear the car. Read the label.</h2></div></div><div class="story-grid">${pages.map((p,i)=>`<article class="story-card">${img(p)}<div><span>${['LIVERPOOL · CONCEPTUAL CULTURAL LEARNING IMAGE','WINTER CAR TOOLS · GENERIC CATEGORY IMAGE','AT HOME · CONCEPTUAL ENERGY-LABEL IMAGE'][i]}</span><h3><a href="${link(i)}">${p.title}</a></h3><p>${p.description}</p></div></article>`).join('')}</div></section>${end}`;
home=home.replace('<details class="field-archive wrap">',cards+'<details class="field-archive wrap">');write('index.html',home);

insert('adventures.html','<!-- MAD AFFILIATE COMMERCE -->',`<section class="content-section alt"><div class="wrap"><p class="kicker">CULTURAL CENTER · WINTER CAR · HOME ENERGY LITERACY</p><div class="simple-list">${pages.map((p,i)=>`<a href="${link(i)}">${p.title} <b>→</b></a>`).join('')}</div></div></section>`);
insert('destinations.html','</main>',`<section class="content-section alt"><div class="wrap"><p class="kicker">LIVERPOOL · CULTURAL CENTER · THREE-STORY ROUTE</p><div class="card-grid"><article class="card">${img(pages[0])}<div><h3><a href="${link(0)}">${pages[0].title}</a></h3><p>${pages[0].description}</p></div></article></div></div></section>`);
insert('gear.html','</main>',`<section class="content-section alt"><div class="wrap"><p class="kicker">ICE SCRAPER · SNOW BRUSH · FOAM HEAD</p><div class="card-grid"><article class="card">${img(pages[1])}<div><h3><a href="${link(1)}">${pages[1].title}</a></h3><p>${pages[1].description}</p></div></article></div></div></section>`);
insert('outdoors.html','</main>',`<section class="content-section alt"><div class="wrap"><p class="kicker">LOCAL LEARNING · WINTER PREP · NO-SPEND ACTIVITY</p><div class="simple-list"><a href="${link(0)}">${pages[0].title} <b>→</b></a><a href="${link(1)}">${pages[1].title} <b>→</b></a><a href="${link(2)}">${pages[2].title} <b>→</b></a></div></div></section>`);

export const reciprocal=[
 ['onondaga-lake-park-with-kids',0,'Pair the larger Onondaga Lake Park plan with the Skä•noñh Center’s separate hours, admission, access and cultural-learning checks.'],
 ['iroquois-museum-with-kids',0,'Compare the Iroquois Museum and Skä•noñh Center as separate Haudenosaunee-led learning destinations with different locations, missions and current policies.'],
 ['family-museum-day-system',0,'Use the three-anchor museum system to keep the Skä•noñh Center visit respectful and finishable after the welcome and three stories.'],
 ['winter-car-adventure-kit',1,'Add the approved snow-removal tools to the winter car kit without burying them under luggage or turning them into loose cargo.'],
 ['family-roadside-breakdown-plan',1,'Clear the car before travel, but let the roadside plan govern people first if the vehicle becomes disabled.'],
 ['family-portable-tire-inflator-guide',1,'Run the same dry glove, reach, storage and vehicle-manual checks before adding a tire inflator to the winter car system.'],
 ['family-grocery-receipt-detective-25-minute-math-activity',2,'Use the EnergyGuide like-for-like gate beside the receipt activity: prominent numbers only compare when units and categories match.'],
 ['family-recipe-scaling-25-minute-math-lab',2,'Carry the recipe lab’s unit discipline into the EnergyGuide activity so kilowatt-hours and per-year estimates stay attached to numbers.'],
 ['family-room-measure-estimate-draw-25-minute-activity',2,'Use the room-measure activity for the next no-spend lesson, then connect dimensions to the FTC’s appliance-space and ventilation reminder.']
];
for(const [slug,i,label] of reciprocal)insert(`guides/${slug}.html`,'</main>',`<aside class="note"><a href="${pages[i].slug}.html"><strong>${label}</strong></a></aside>`);

let map=read('sitemap.xml');for(const p of pages){const url=`https://mradventuredad.com/guides/${p.slug}.html`;if(!map.includes(`<loc>${url}</loc>`))map=map.replace('</urlset>',`  <url><loc>${url}</loc><lastmod>${date}</lastmod></url>\n</urlset>`);}
for(const path of ['','adventures.html','destinations.html','gear.html','outdoors.html',...reciprocal.map(([s])=>`guides/${s}.html`)]){const url='https://mradventuredad.com/'+path;map=map.replace(new RegExp(`(<loc>${url.replaceAll('.','\\.')}</loc><lastmod>)[^<]+`),`$1${date}`);}write('sitemap.xml',map);

const credits=JSON.parse(read('assets/images/credits.json'));for(const p of pages)credits['assets/images/photos/'+p.image]={title:p.alt,creator:'Mr Adventure Dad Editorial Desk with OpenAI image generation',source:'Original AI-assisted conceptual editorial image',license:'Original AI-assisted image; published by Mr Adventure Dad',verified:date,notes:p.caption};write('assets/images/credits.json',JSON.stringify(credits,null,2)+'\n');
insert('photo-credits.html','</section><h2>Additional editorial photography</h2>',pages.map(p=>`<article class="photo-credit-card">${img(p)}<div><h2>${p.title}</h2><p>${p.caption}</p><p>Creator: Mr Adventure Dad Editorial Desk with OpenAI image generation. Original AI-assisted editorial asset, not third-party destination or exact product photography. Reviewed October 30, 2026.</p></div></article>`).join(''));

write('reports/editorial-decision-2026-10-30.md',`# Editorial decision record — October 30, 2026

## Inventory and duplication gate

The complete inventory contained 191 HTML pages before this batch. Existing titles, slugs, intents, locations, commercial categories, section angles and image records were checked, including October 16–29 and the separate October 31–November 1 roundup. Another Howe Caverns, wagon, packing, winter clothing, museum-art, gear-label, wet-entryway or dated-event variation was rejected. Skä•noñh adds a distinct Haudenosaunee cultural-learning plan; the car snow-tool page solves a vehicle-specific winter clearing decision; the EnergyGuide activity adds no-spend household energy literacy. No October 30 trio existed.

## Search Console decision

The private report was generated October 28, 2026 for September 28–October 25. MrAdventureDad.com recorded 711 impressions, 7 clicks, 0.98% CTR and average position 17.96. Howe Caverns (81 impressions / 1 click / position 9.1), folding wagons (27 / 1 / 10.7), family camping sleep system (9 / 1 / 8.4) and family travel bags (8 / 2 / 14.1) are credible page signals, but each received distinct support within the previous fourteen days. Zero-click Adventures (15 impressions / position 7.7), Destinations (9 / 13.9) and Gear (10 / 13.9) were used as discovery signals: the homepage, four hubs, sitemap and nine reciprocal paths were strengthened. No item is labeled Data-led because another derivative page would risk cannibalization. One- or two-impression binocular and branded fragments were ignored as too weak or already served.

## Portfolio labels

- **Authority-expansion — Skä•noñh Center With Kids:** an official-source, respectful local cultural-center route that separates Center interpretation, family questions and optional park logistics.
- **Authority-expansion — Family Car Snow Tools:** a high-intent, no-buy-first comparison of scraper, brush and foam head using a dry reach test, vehicle-manual boundary and full-vehicle clearing sequence.
- **Exploration — Family EnergyGuide Label Check:** a no-spend 25-minute activity that teaches energy use, estimated cost, comparison range and the distinction between EnergyGuide and ENERGY STAR.

The trio is deliberately diverse in place, intent and format: a regional cultural destination, a winter vehicle buying decision and an at-home consumer-literacy activity. No page competes with the separate weekly event roundup.

## Authority action

Three citation-ready tools were created: a one-greeting/three-story respectful museum route, a snow-tool job matrix plus dry reach test, and a five-field EnergyGuide evidence card with a like-for-like gate. Nine established pages now link back contextually. Primary sourcing, dated review, explicit uncertainty, cultural-respect boundaries, image labels and commercial separation strengthen trust.

## Qualified opportunities — log only; no outreach sent

1. **Skä•noñh – Great Law of Peace Center** — https://www.skanonhcenter.org/contact-us — factual-correction angle for the independent respectful family route; invite corrections without implying endorsement or cultural authority.
2. **Onondaga County Parks** — https://onondagacountyparks.com/contact/ — local-resource angle for the Center-plus-short-lake-walk planner that sends all park status and restroom checks to the County.
3. **FTC Consumer Advice** — https://www.ftc.gov/about-ftc/contact — consumer-education angle for the five-field EnergyGuide evidence card with direct FTC attribution and no shopping recommendation.

## Image gate before publication

Three unique 1600×900 editorial images were visually inspected against final titles, copy, captions, alt text, credits and linked context. The cultural-center image is explicitly conceptual and not Skä•noñh destination evidence; the snow-tool image shows generic unbranded categories with no compatibility claim; the EnergyGuide image uses fictional cards with no official label, model or cost claim. Zero affiliate/product images are used. A second live rendered pass remains required.
`);
write('reports/image-qa-2026-10-30.md',`# Image QA — October 30, 2026\n\n## Pass 1: pre-publication\n\n- 3 unique 1600×900 editorial images visually inspected after final WebP conversion.\n- 0 affiliate/product images used.\n- Final title, copy, caption, alt, credit and linked destination/category context checked for all three assets.\n- Skä•noñh page image: generic conceptual museum learning space and invented map-like display; explicitly not the named Center, its building, exhibits, cultural materials, access or live conditions.\n- Snow-tool image: generic unbranded handheld scraper, long brush and broad foam head beside a generic vehicle; no exact product, vehicle compatibility, paint safety, reach, durability, price or testing claim.\n- EnergyGuide image: fictional yellow comparison cards in a generic kitchen; no official label recreation, brand, model, energy use, cost, certification or household data.\n\n## Pass 2: live rendered\n\n- Pending deployment.\n`);
if(!read('reports/search-console-editorial-log.md').includes('# 2026-10-30'))appendFileSync(resolve(root,'reports/search-console-editorial-log.md'),`\n# 2026-10-30\n\n- Report generated: 2026-10-28; window 2026-09-28 through 2026-10-25.\n- Used: 711 impressions, 7 clicks, 0.98% CTR, average position 17.96, plus zero-click Adventures (15 impressions / position 7.7), Destinations (9 / 13.9) and Gear (10 / 13.9) visibility to strengthen homepage, four hubs, sitemap and nine reciprocal links.\n- Deliberately not chased: Howe Caverns (81 impressions / 1 click / position 9.1), folding wagons (27 / 1 / 10.7), camping sleep (9 / 1 / 8.4) and travel bags (8 / 2 / 14.1) already received distinct support in the previous fourteen days.\n- Ignored as weak or already served: one- or two-impression binocular and branded fragments.\n- Portfolio: two authority-expansion items and one exploration; no derivative data-led page and no overlap with the October 31–November 1 roundup.\n`);
let auth=read('reports/authority-opportunities.md');if(!auth.includes('## 2026-10-30'))auth+=`\n## 2026-10-30\n\n- **Skä•noñh – Great Law of Peace Center** — https://www.skanonhcenter.org/contact-us — factual-correction angle for the independent respectful family route; invite corrections without implying endorsement or cultural authority.\n- **Onondaga County Parks** — https://onondagacountyparks.com/contact/ — local-resource angle for the Center-plus-short-lake-walk planner that sends park status and restroom checks to the County.\n- **FTC Consumer Advice** — https://www.ftc.gov/about-ftc/contact — consumer-education angle for the five-field EnergyGuide evidence card with direct FTC attribution and no shopping recommendation.\n\nNo outreach, submission or account creation was performed.\n`;write('reports/authority-opportunities.md',auth);
console.log('Generated exactly three October 30 guides, homepage time windows, four hubs, nine reciprocal links, sitemap, credits and authority records.');
