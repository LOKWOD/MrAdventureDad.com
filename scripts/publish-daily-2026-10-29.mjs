import {appendFileSync,readFileSync,writeFileSync} from 'node:fs';
import {resolve} from 'node:path';
import {pages} from './content-2026-10-29.mjs';

const root=resolve(process.argv[2]||'.'),date='2026-10-29',start='<!-- DAILY 2026-10-29 -->',end='<!-- END DAILY 2026-10-29 -->';
const read=p=>readFileSync(resolve(root,p),'utf8'),write=(p,s)=>writeFileSync(resolve(root,p),s);
if(pages.length!==3)throw Error('Exactly three October 29 sources required');
const template=read('scripts/publish-daily-2026-10-17.mjs').match(/const pageHtml=p=>(`[\s\S]*?`);\n\nfor\(const p of pages\)/)?.[1];
if(!template)throw Error('Versioned renderer changed');
const render=new Function('date','imageUrl',`return p=>${template}`)(date,n=>`https://mradventuredad.com/assets/images/photos/${n}`);
for(const p of pages){
 let h=render(p).replaceAll('v=20261017','v=20261029').replace(`src="../assets/images/photos/${p.image}"`,`src="../assets/images/photos/${p.image}" width="1600" height="900" style="height:auto"`);
 h=h.replace('<meta name="twitter:card"',`<meta property="og:image:width" content="1600"><meta property="og:image:height" content="900"><meta property="og:image:alt" content="${p.alt}"><meta name="twitter:image:alt" content="${p.alt}"><meta name="twitter:card"`);
 const crumbs={'@context':'https://schema.org','@type':'BreadcrumbList',itemListElement:[{'@type':'ListItem',position:1,name:'Home',item:'https://mradventuredad.com/'},{'@type':'ListItem',position:2,name:'Adventures',item:'https://mradventuredad.com/adventures.html'},{'@type':'ListItem',position:3,name:p.title}]};
 h=h.replace('</head>',`<script type="application/ld+json">${JSON.stringify(crumbs)}</script></head>`);write(`guides/${p.slug}.html`,h);
}
function insert(path,needle,block){let h=read(path).replace(new RegExp(`${start}[\\s\\S]*?${end}`,'g'),'');if(!h.includes(needle))throw Error(path+': insertion marker missing');write(path,h.replace(needle,start+block+end+needle));}
const link=i=>`guides/${pages[i].slug}.html`,img=p=>`<img src="assets/images/photos/${p.image}" width="1600" height="900" style="height:auto;aspect-ratio:16/9;object-fit:contain" alt="${p.alt}" loading="lazy" decoding="async">`;

let home=read('index.html').replace(new RegExp(`${start}[\\s\\S]*?${end}`,'g'),'');
const priorPattern=/<!-- DAILY 2026-10-28 -->[\s\S]*?<!-- END DAILY 2026-10-28 -->/g,prior=home.match(priorPattern)?.[0];home=home.replace(priorPattern,'');if(prior)home=home.replace('<div class="field-archive-content">','<div class="field-archive-content">'+prior);
const options=[
 ['TONIGHT · 25 MINUTES · NO-SPEND',link(2),'Log five gear labels privately','Photograph the whole item and its model label, add official support links, then stop.'],
 ['WEEKEND · CURRENT ROUNDUP','weekend-october-31-november-1-2026.html','Use the Halloween-weekend shortlist','The separate Wednesday guide owns current events, tickets and forecasts. Recheck every official source before leaving.'],
 ['HALF DAY · SYRACUSE · FREE',link(0),'Pick three works at the SU Art Museum','Use one question per work, one graphite sketch, and a 75-minute stop rule.'],
 ['AFTER SCHOOL · WET GEAR',link(1),'Run the entryway drip-path test','Compare a boot tray, absorbent mat and rack only after walking the real door-to-hook route.'],
 ['AT HOME · LOW ENERGY',link(2),'Log one lantern label','Take one whole-item photo, one label photo, and save the current official recall route.'],
 ['BREAK · WEATHER BACKUP','guides/family-museum-day-system.html','Use the three-anchor museum system','Keep a finishable indoor route ready when weather or energy fails a bigger outing.']
];
const lead=`<section class="now-plans wrap" aria-labelledby="now-plans-title"><div class="now-plans-head"><div><p class="kicker">FRESH IDEAS · OCTOBER 29, 2026</p><h2 id="now-plans-title">Pick the time you actually have.</h2><p>Use the current weekend shortlist for dated plans, make a short free art-museum visit, control the wet-gear landing zone, or record five product labels before the next recall search.</p></div><a href="adventures.html">Browse all adventures →</a></div><div class="now-plans-grid">${options.map(o=>`<article class="now-plan"><span>${o[0]}</span><h3><a href="${o[1]}">${o[2]}</a></h3><p>${o[3]}</p></article>`).join('')}</div></section>`;
if(!/<section class="now-plans wrap"[\s\S]*?<section class="intro wrap">/.test(home))throw Error('Homepage lead missing');home=home.replace(/<section class="now-plans wrap"[\s\S]*?<section class="intro wrap">/,lead+'<section class="intro wrap">');
const cards=`${start}<section class="stories wrap"><div class="section-head"><div><p class="kicker">THREE DIFFERENT FAMILY PROBLEMS</p><h2>Look at art. Stop the drips. Record the evidence.</h2></div></div><div class="story-grid">${pages.map((p,i)=>`<article class="story-card">${img(p)}<div><span>${['SYRACUSE · CONCEPTUAL UNIVERSITY GALLERY IMAGE','WET-GEAR ENTRYWAY · GENERIC CATEGORY IMAGE','AT HOME · PRIVATE PRODUCT RECORD · CONCEPTUAL IMAGE'][i]}</span><h3><a href="${link(i)}">${p.title}</a></h3><p>${p.description}</p></div></article>`).join('')}</div></section>${end}`;
home=home.replace('<details class="field-archive wrap">',cards+'<details class="field-archive wrap">');write('index.html',home);

insert('adventures.html','<!-- MAD AFFILIATE COMMERCE -->',`<section class="content-section alt"><div class="wrap"><p class="kicker">FREE SYRACUSE ART · WET-GEAR SYSTEM · PRIVATE PRODUCT RECORDS</p><div class="simple-list">${pages.map((p,i)=>`<a href="${link(i)}">${p.title} <b>→</b></a>`).join('')}</div></div></section>`);
insert('destinations.html','</main>',`<section class="content-section alt"><div class="wrap"><p class="kicker">SYRACUSE · FREE MUSEUM · THREE-WORK ROUTE</p><div class="card-grid"><article class="card">${img(pages[0])}<div><h3><a href="${link(0)}">${pages[0].title}</a></h3><p>${pages[0].description}</p></div></article></div></div></section>`);
insert('gear.html','</main>',`<section class="content-section alt"><div class="wrap"><p class="kicker">BOOT TRAY · ABSORBENT MAT · DRYING RACK</p><div class="card-grid"><article class="card">${img(pages[1])}<div><h3><a href="${link(1)}">${pages[1].title}</a></h3><p>${pages[1].description}</p></div></article></div></div></section>`);
insert('outdoors.html','</main>',`<section class="content-section alt"><div class="wrap"><p class="kicker">INDOOR ART · WET-GEAR RESET · PRODUCT RECORDS</p><div class="simple-list"><a href="${link(0)}">${pages[0].title} <b>→</b></a><a href="${link(1)}">${pages[1].title} <b>→</b></a><a href="${link(2)}">${pages[2].title} <b>→</b></a></div></div></section>`);

export const reciprocal=[
 ['everson-museum-with-kids',0,'Compare the Everson with the Syracuse University Art Museum plan: both reward a short route, but campus parking, policies and current exhibitions are separate checks.'],
 ['family-museum-day-system',0,'Use the three-anchor museum system at the Syracuse University Art Museum, then stop after three works and one graphite sketch.'],
 ['family-parking-lot-plan',0,'Run the parking plan before a campus museum visit, especially when Stadium events can change availability and rates.'],
 ['family-boot-dryer-fan-heated-passive-guide',1,'Build the drip-path landing zone before adding powered or passive boot-drying equipment.'],
 ['family-rain-gear-guide',1,'Pair the rain-gear fit system with a landing zone that contains drips and keeps wet layers spaced.'],
 ['family-coat-pocket-reset-20-minute-system',1,'Empty coat pockets while wet layers hang so paper, wrappers and small gear do not stay trapped in damp fabric.'],
 ['kids-bike-helmet-fit-certification-guide',2,'Record the helmet’s actual model label privately, then keep fit, certification and replacement decisions in the separate helmet guide.'],
 ['family-headlamps-flashlights-lanterns',2,'Add a private model-label record for each family light without turning the inventory into a performance claim.'],
 ['family-first-aid-kit-guide',2,'Keep product identifiers separate from medical records; the gear-label log can document the case while the first-aid guide controls contents.']
];
for(const [slug,i,label] of reciprocal)insert(`guides/${slug}.html`,'</main>',`<aside class="note"><a href="${pages[i].slug}.html"><strong>${label}</strong></a></aside>`);

let map=read('sitemap.xml');for(const p of pages){const url=`https://mradventuredad.com/guides/${p.slug}.html`;if(!map.includes(`<loc>${url}</loc>`))map=map.replace('</urlset>',`  <url><loc>${url}</loc><lastmod>${date}</lastmod></url>\n</urlset>`);}
for(const path of ['','adventures.html','destinations.html','gear.html','outdoors.html',...reciprocal.map(([s])=>`guides/${s}.html`)]){const url='https://mradventuredad.com/'+path;map=map.replace(new RegExp(`(<loc>${url.replaceAll('.','\\.')}</loc><lastmod>)[^<]+`),`$1${date}`);}write('sitemap.xml',map);

const credits=JSON.parse(read('assets/images/credits.json'));for(const p of pages)credits['assets/images/photos/'+p.image]={title:p.alt,creator:'Mr Adventure Dad Editorial Desk with OpenAI image generation',source:'Original AI-assisted conceptual editorial image',license:'Original AI-assisted image; published by Mr Adventure Dad',verified:date,notes:p.caption};write('assets/images/credits.json',JSON.stringify(credits,null,2)+'\n');
insert('photo-credits.html','</section><h2>Additional editorial photography</h2>',pages.map(p=>`<article class="photo-credit-card">${img(p)}<div><h2>${p.title}</h2><p>${p.caption}</p><p>Creator: Mr Adventure Dad Editorial Desk with OpenAI image generation. Original AI-assisted editorial asset, not third-party destination or exact product photography. Reviewed October 29, 2026.</p></div></article>`).join(''));

write('reports/editorial-decision-2026-10-29.md',`# Editorial decision record — October 29, 2026

## Inventory and duplication gate

The complete inventory contained 188 HTML pages before this batch. Existing titles, slugs, intents, locations, commercial categories, section angles and image records were checked, including October 15–28 and the separate October 31–November 1 roundup. Another Howe Caverns, MOST, folding-wagon, binocular, packing, winter-clothing, measurement or dated-event variation was rejected. The Syracuse University Art Museum adds a distinct free campus-gallery plan; the wet-gear entryway adds a home landing-zone purchase decision; the gear-label log adds private product evidence and recall lookup. No October 29 daily trio existed.

## Search Console decision

The private report was generated October 28, 2026 for September 28–October 25. MrAdventureDad.com recorded 711 impressions, 7 clicks, 0.98% CTR and average position 17.96. Howe Caverns (81 impressions / 1 click / position 9.1), folding wagons (27 / 1 / 10.7), family camping sleep system (9 / 1 / 8.4) and family travel bags (8 / 2 / 14.1) are credible page signals, but all already received distinct supporting coverage in the previous fourteen days. The zero-click Adventures, Destinations and Gear hub impressions were used as a discovery signal: homepage, four hubs, sitemap and nine reciprocal paths were strengthened. No item today is labeled Data-led because another derivative support page would risk cannibalization. One- or two-impression binocular and branded fragments were ignored as too weak or already served.

## Portfolio labels

- **Authority-expansion — Syracuse University Art Museum With Kids:** a current official-source free Syracuse plan with a three-work looking route, graphite-only sketch rule, campus parking gate and access questions.
- **Authority-expansion — Family Wet-Gear Entryway:** a commercially useful no-buy-first framework comparing a boot tray, absorbent mat and freestanding rack by drip path, floor compatibility and cleanup.
- **Exploration — Family Gear Label Log:** a no-spend 25-minute evidence system using CPSC recall and registration sources without exposing serial numbers or claiming recall status.

The trio is deliberately diverse in place, intent and format: a regional free indoor destination, a home cleanup purchase decision and an at-home product-record activity. No page competes with the separate weekly event roundup.

## Authority action

Three citation-ready tools were created: a three-work museum route, an eight-step entryway drip-path test and a five-field product evidence card. Nine established pages now link back contextually. Primary sourcing, dated review, explicit uncertainty, correction routes, privacy boundaries, image labels and commercial separation strengthen trust.

## Qualified opportunities — log only; no outreach sent

1. **Syracuse University Art Museum** — https://museum.syr.edu/about/staff/ — factual-correction angle for the independent three-work family route; invite corrections without requesting endorsement.
2. **Visit Syracuse** — https://www.visitsyracuse.com/contact/ — free-family-resource angle for a short campus art visit that sends hours, parking and access questions to official University sources.
3. **U.S. Consumer Product Safety Commission Recall Outreach** — https://www.cpsc.gov/About-CPSC/Contact-Information — consumer-education angle for the five-field gear-label evidence card with direct CPSC recall attribution.

## Image gate before publication

Three unique 1600×900 editorial images were visually inspected against final titles, copy, captions, alt text, credits and linked context. The art-museum image is explicitly conceptual and not named-place evidence; the entryway image shows generic tray, mat and rack jobs without performance claims; the label-log image contains blank labels and no private data. Zero affiliate/product images are used. A second live rendered pass remains required.
`);
write('reports/image-qa-2026-10-29.md',`# Image QA — October 29, 2026\n\n## Pass 1: pre-publication\n\n- 3 unique 1600×900 editorial images visually inspected after final WebP conversion.\n- 0 affiliate/product images used.\n- Final title, copy, caption, alt, credit and linked destination/category context checked for all three assets.\n- Art-museum image: generic conceptual university gallery with invented artworks; explicitly not Syracuse University Art Museum, Shaffer Art Building, real exhibitions, access or live conditions.\n- Wet-entryway image: generic unbranded boot tray, absorbent mat and freestanding rack; no exact product, material, floor-compatibility, waterproofing, absorbency, load or drying claim.\n- Label-log image: generic helmet, lantern, binocular case and backpack with blank labels and grid; no serial numbers, private data, registration, warranty or recall claim.\n\n## Pass 2: live rendered\n\n- Pending deployment.\n`);
if(!read('reports/search-console-editorial-log.md').includes('# 2026-10-29'))appendFileSync(resolve(root,'reports/search-console-editorial-log.md'),`\n# 2026-10-29\n\n- Report generated: 2026-10-28; window 2026-09-28 through 2026-10-25.\n- Used: 711 impressions, 7 clicks, 0.98% CTR, average position 17.96, plus zero-click hub visibility to strengthen homepage, four hubs, sitemap and nine reciprocal links.\n- Deliberately not chased: Howe Caverns (81 impressions / 1 click / position 9.1), folding wagons (27 / 1 / 10.7), camping sleep (9 / 1 / 8.4) and travel bags (8 / 2 / 14.1) already received distinct support in the previous fourteen days.\n- Ignored as weak or already served: one- or two-impression binocular and branded fragments.\n- Portfolio: two authority-expansion items and one exploration; no derivative data-led page and no overlap with the October 31–November 1 roundup.\n`);
let auth=read('reports/authority-opportunities.md');if(!auth.includes('## 2026-10-29'))auth+=`\n## 2026-10-29\n\n- **Syracuse University Art Museum** — https://museum.syr.edu/about/staff/ — factual-correction angle for the independent three-work family route; invite corrections without requesting endorsement.\n- **Visit Syracuse** — https://www.visitsyracuse.com/contact/ — free-family-resource angle for a short campus art visit that sends hours, parking and access questions to official University sources.\n- **U.S. Consumer Product Safety Commission Recall Outreach** — https://www.cpsc.gov/About-CPSC/Contact-Information — consumer-education angle for the five-field gear-label evidence card with direct CPSC recall attribution.\n\nNo outreach, submission or account creation was performed.\n`;write('reports/authority-opportunities.md',auth);
console.log('Generated exactly three October 29 guides, homepage time windows, four hubs, nine reciprocal links, sitemap, credits and authority records.');
