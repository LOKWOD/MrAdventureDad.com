import {appendFileSync,readFileSync,writeFileSync} from 'node:fs';
import {resolve} from 'node:path';
import {pages} from './content-2026-10-31.mjs';

const root=resolve(process.argv[2]||'.'),date='2026-10-31',start='<!-- DAILY 2026-10-31 -->',end='<!-- END DAILY 2026-10-31 -->';
const read=p=>readFileSync(resolve(root,p),'utf8'),write=(p,s)=>writeFileSync(resolve(root,p),s);
if(pages.length!==3)throw Error('Exactly three October 31 sources required');
const template=read('scripts/publish-daily-2026-10-17.mjs').match(/const pageHtml=p=>(`[\s\S]*?`);\n\nfor\(const p of pages\)/)?.[1];
if(!template)throw Error('Versioned renderer changed');
const render=new Function('date','imageUrl',`return p=>${template}`)(date,n=>`https://mradventuredad.com/assets/images/photos/${n}`);
for(const p of pages){
 let h=render(p).replaceAll('v=20261017','v=20261031').replace(`src="../assets/images/photos/${p.image}"`,`src="../assets/images/photos/${p.image}" width="1600" height="900" style="height:auto"`);
 h=h.replace('<meta name="twitter:card"',`<meta property="og:image:width" content="1600"><meta property="og:image:height" content="900"><meta property="og:image:alt" content="${p.alt}"><meta name="twitter:image:alt" content="${p.alt}"><meta name="twitter:card"`);
 const crumbs={'@context':'https://schema.org','@type':'BreadcrumbList',itemListElement:[{'@type':'ListItem',position:1,name:'Home',item:'https://mradventuredad.com/'},{'@type':'ListItem',position:2,name:'Adventures',item:'https://mradventuredad.com/adventures.html'},{'@type':'ListItem',position:3,name:p.title}]};
 h=h.replace('</head>',`<script type="application/ld+json">${JSON.stringify(crumbs)}</script></head>`);write(`guides/${p.slug}.html`,h);
}
function insert(path,needle,block){let h=read(path).replace(new RegExp(`${start}[\\s\\S]*?${end}`,'g'),'');if(!h.includes(needle))throw Error(path+': insertion marker missing');write(path,h.replace(needle,start+block+end+needle));}
const link=i=>`guides/${pages[i].slug}.html`,img=p=>`<img src="assets/images/photos/${p.image}" width="1600" height="900" style="height:auto;aspect-ratio:16/9;object-fit:contain" alt="${p.alt}" loading="lazy" decoding="async">`;

let home=read('index.html').replace(new RegExp(`${start}[\\s\\S]*?${end}`,'g'),'');
const priorPattern=/<!-- DAILY 2026-10-30 -->[\s\S]*?<!-- END DAILY 2026-10-30 -->/g,prior=home.match(priorPattern)?.[0];home=home.replace(priorPattern,'');if(prior)home=home.replace('<div class="field-archive-content">','<div class="field-archive-content">'+prior);
const options=[
 ['TONIGHT · 25 MINUTES · NO-SPEND',link(2),'Run the six-test foil-boat lab','Use equal foil sheets, identical washers, one shape change and a real evidence sentence.'],
 ['WEEKEND · CURRENT ROUNDUP','weekend-october-31-november-1-2026.html','Use the Halloween-weekend shortlist','The separate Wednesday guide owns current events, tickets and forecasts. Recheck every official source before leaving.'],
 ['HALF DAY · ALTMAR',link(0),'Watch one hatchery life stage','Call first, choose one visible process, ask three evidence questions and leave after 75 minutes.'],
 ['AFTER SCHOOL · SIDELINE TEST',link(1),'Test the blanket against a damp bench','Use the blanket already owned, find the real failure point, and buy only for the missing job.'],
 ['AT HOME · LOW ENERGY',link(2),'Build one foil boat and name the failure','One supervised test is enough when comparison energy is gone.'],
 ['BREAK · WEATHER BACKUP','guides/family-museum-day-system.html','Use the three-anchor museum system','Keep a finishable indoor route ready when weather or energy cancels a larger outing.']
];
const lead=`<section class="now-plans wrap" aria-labelledby="now-plans-title"><div class="now-plans-head"><div><p class="kicker">FRESH IDEAS · OCTOBER 31, 2026</p><h2 id="now-plans-title">Pick the time you actually have.</h2><p>Use the separate current-weekend shortlist for dated plans, make a focused Altmar hatchery visit, test the family’s sideline blanket, or run a no-spend foil-boat lab at home.</p></div><a href="adventures.html">Browse all adventures →</a></div><div class="now-plans-grid">${options.map(o=>`<article class="now-plan"><span>${o[0]}</span><h3><a href="${o[1]}">${o[2]}</a></h3><p>${o[3]}</p></article>`).join('')}</div></section>`;
if(!/<section class="now-plans wrap"[\s\S]*?<section class="intro wrap">/.test(home))throw Error('Homepage lead missing');home=home.replace(/<section class="now-plans wrap"[\s\S]*?<section class="intro wrap">/,lead+'<section class="intro wrap">');
const cards=`${start}<section class="stories wrap"><div class="section-head"><div><p class="kicker">THREE DIFFERENT FAMILY PROBLEMS</p><h2>Watch the fish. Test the blanket. Count the load.</h2></div></div><div class="story-grid">${pages.map((p,i)=>`<article class="story-card">${img(p)}<div><span>${['ALTMAR · CONCEPTUAL TRIP-PLANNING IMAGE','SIDELINE BLANKETS · GENERIC CATEGORY IMAGE','AT HOME · CONCEPTUAL FOIL-BOAT LAB IMAGE'][i]}</span><h3><a href="${link(i)}">${p.title}</a></h3><p>${p.description}</p></div></article>`).join('')}</div></section>${end}`;
home=home.replace('<details class="field-archive wrap">',cards+'<details class="field-archive wrap">');write('index.html',home);

insert('adventures.html','<!-- MAD AFFILIATE COMMERCE -->',`<section class="content-section alt"><div class="wrap"><p class="kicker">ALTMAR HATCHERY · SIDELINE WARMTH · NO-SPEND STEM</p><div class="simple-list">${pages.map((p,i)=>`<a href="${link(i)}">${p.title} <b>→</b></a>`).join('')}</div></div></section>`);
insert('destinations.html','</main>',`<section class="content-section alt"><div class="wrap"><p class="kicker">ALTMAR · WORKING HATCHERY · 75-MINUTE ROUTE</p><div class="card-grid"><article class="card">${img(pages[0])}<div><h3><a href="${link(0)}">${pages[0].title}</a></h3><p>${pages[0].description}</p></div></article></div></div></section>`);
insert('gear.html','</main>',`<section class="content-section alt"><div class="wrap"><p class="kicker">FLEECE · WOOL-BLEND · PACKABLE INSULATED</p><div class="card-grid"><article class="card">${img(pages[1])}<div><h3><a href="${link(1)}">${pages[1].title}</a></h3><p>${pages[1].description}</p></div></article></div></div></section>`);
insert('outdoors.html','</main>',`<section class="content-section alt"><div class="wrap"><p class="kicker">FISH HATCHERY · SIDELINE SYSTEM · FAMILY STEM</p><div class="simple-list"><a href="${link(0)}">${pages[0].title} <b>→</b></a><a href="${link(1)}">${pages[1].title} <b>→</b></a><a href="${link(2)}">${pages[2].title} <b>→</b></a></div></div></section>`);

export const reciprocal=[
 ['carpenters-brook-fish-hatchery-with-kids',0,'Compare this local hatchery visit with the Salmon River Hatchery’s separate season, species, working areas and call-first checks.'],
 ['salmon-river-falls-with-kids',0,'Keep the Salmon River Falls hike separate from the working hatchery visit; each needs its own weather, access and stop rules.'],
 ['family-bathroom-stop-plan',0,'Use the bathroom-stop plan before the rural Altmar drive instead of assuming the hatchery can meet every facility need.'],
 ['family-picnic-seating-blanket-chair-stadium-seat',1,'Use the new wet-bench test when the broader picnic-seating decision comes down to a shared passive blanket.'],
 ['family-wet-gear-entryway-boot-tray-mat-rack-guide',1,'Open and dry a damp sideline blanket through the wet-gear entryway system instead of leaving it compressed in the car.'],
 ['kids-winter-hats-beanie-earflap-balaclava-fit-guide',1,'Build the sideline system from dry clothing and head coverage first; a blanket cannot repair a poor hat-and-hood fit.'],
 ['paper-bridge-load-test-25-minute-family-stem',2,'Run the foil-boat lab after the paper bridge to compare two load tests without pretending water and dry spans fail the same way.'],
 ['flashlight-shadow-lab-30-minute-family-science',2,'Use the foil-boat lab as the wet-work alternative to the dry flashlight shadow experiment.'],
 ['family-room-measure-estimate-draw-25-minute-activity',2,'Carry the room activity’s measurement discipline into equal foil sheets and one-variable boat testing.']
];
for(const [slug,i,label] of reciprocal)insert(`guides/${slug}.html`,'</main>',`<aside class="note"><a href="${pages[i].slug}.html"><strong>${label}</strong></a></aside>`);

let map=read('sitemap.xml');for(const p of pages){const url=`https://mradventuredad.com/guides/${p.slug}.html`;if(!map.includes(`<loc>${url}</loc>`))map=map.replace('</urlset>',`  <url><loc>${url}</loc><lastmod>${date}</lastmod></url>\n</urlset>`);}
for(const path of ['','adventures.html','destinations.html','gear.html','outdoors.html',...reciprocal.map(([s])=>`guides/${s}.html`)]){const url='https://mradventuredad.com/'+path;map=map.replace(new RegExp(`(<loc>${url.replaceAll('.','\\.')}</loc><lastmod>)[^<]+`),`$1${date}`);}write('sitemap.xml',map);

const credits=JSON.parse(read('assets/images/credits.json'));for(const p of pages)credits['assets/images/photos/'+p.image]={title:p.alt,creator:'Mr Adventure Dad Editorial Desk with OpenAI image generation',source:'Original AI-assisted conceptual editorial image',license:'Original AI-assisted image; published by Mr Adventure Dad',verified:date,notes:p.caption};write('assets/images/credits.json',JSON.stringify(credits,null,2)+'\n');
insert('photo-credits.html','</section><h2>Additional editorial photography</h2>',pages.map(p=>`<article class="photo-credit-card">${img(p)}<div><h2>${p.title}</h2><p>${p.caption}</p><p>Creator: Mr Adventure Dad Editorial Desk with OpenAI image generation. Original AI-assisted editorial asset, not third-party destination or exact product photography. Reviewed October 31, 2026.</p></div></article>`).join(''));

write('reports/editorial-decision-2026-10-31.md',`# Editorial decision record — October 31, 2026

## Inventory and duplication gate

The complete inventory contained 194 HTML pages before this batch. Existing titles, slugs, intents, locations, commercial categories, section angles and image records were checked, including October 17–30 and the separate October 31–November 1 roundup. A paper-airplane draft was explicitly rejected because a 25-minute paper-airplane distance lab already exists. Another Howe Caverns, wagon, travel-bag, museum, winter-clothing or dated-event variation was also rejected. The selected pages add a working-hatchery observation route, a passive sideline-blanket decision system and a controlled foil-boat buoyancy lab. No October 31 trio existed.

## Search Console decision

The private report was generated October 28, 2026 for September 28–October 25. MrAdventureDad.com recorded 711 impressions, 7 clicks, 0.98% CTR and average position 17.96. Howe Caverns (81 impressions / 1 click / position 9.1), folding wagons (27 / 1 / 10.7), camping sleep (9 / 1 / 8.4) and travel bags (8 / 2 / 14.1) were considered, but each already has distinct recent support and the travel-bag sample remains small. Zero-click Adventures (15 impressions / position 7.7), Destinations (9 / 13.9) and Gear (10 / 13.9) were used as discovery signals: the current homepage, four hubs, sitemap and nine reciprocal paths were strengthened. No page is labeled Data-led because a derivative page would risk cannibalization. One- and two-impression query fragments were ignored as too weak or irrelevant.

## Portfolio labels

- **Authority-expansion — Salmon River Fish Hatchery With Kids:** an official-source Altmar route built around one visible life stage or hatchery job, three evidence questions and a clear stop rule.
- **Authority-expansion — Family Sideline Blankets:** a high-intent passive-category guide using a wet-bench test, seven-field comparison card, venue gate and heated-product exclusion.
- **Exploration — Family Foil-Boat Load Lab:** a no-spend 25-minute buoyancy activity using equal sheets, identical washers, three trials per shape and a six-test evidence card.

The trio is deliberately diverse in place, intent and format: a regional working-hatchery destination, a commercial sideline-warmth decision and an at-home STEM experiment. No page competes with the separate weekly event roundup.

## Authority action

Three citation-ready tools were created: a one-stage/three-question hatchery evidence card, a sideline blanket failure-mode matrix plus wet-bench test, and a six-test foil-boat evidence card with a one-variable gate. Nine established pages now link back contextually. Primary sourcing, dated review, explicit uncertainty, safety boundaries, image labels and commercial separation strengthen trust.

## Qualified opportunities — log only; no outreach sent

1. **NYS DEC Salmon River Fish Hatchery** — https://dec.ny.gov/things-to-do/freshwater-fishing/hatcheries/salmon-river — factual-correction angle for the independent 75-minute family route; invite corrections without implying DEC endorsement or a live operating promise.
2. **Oswego County Tourism** — https://www.visitoswegocounty.com/contact-us/ — local-resource angle for a call-first working-hatchery family plan that sends operating facts to DEC.
3. **NASA STEM engagement** — https://www.nasa.gov/learning-resources/ — educator-resource angle for the equal-sheet six-test foil-boat evidence card with direct NASA attribution and no product promotion.

## Image gate before publication

Three unique 1600×900 editorial images were visually inspected against final titles, copy, captions, alt text, credits and linked context. The hatchery image is explicitly conceptual planning material and not destination evidence; the sideline image shows generic unbranded passive blanket categories with no performance claim; the foil-boat image shows the specified towel-lined water tub, two foil shapes and uniform washers without NASA branding or a result claim. Zero affiliate/product images are used. A second live rendered pass remains required.
`);
write('reports/image-qa-2026-10-31.md',`# Image QA — October 31, 2026\n\n## Pass 1: pre-publication\n\n- 3 unique 1600×900 editorial images visually inspected after final WebP conversion.\n- 0 affiliate/product images used.\n- Final title, copy, caption, alt, credit and linked destination/category context checked for all three assets.\n- Salmon River Hatchery page: conceptual jackets, pack, bottles and fish cards only; explicitly not the named destination, fish, facilities, access or current conditions.\n- Sideline blanket page: generic unbranded fleece, wool-blend and quilted insulated categories on empty bleachers; no exact product, testing, warmth, waterproofing or venue claim.\n- Foil-boat page: towel-lined clear tub, two foil shapes, identical large washers and blank results grid; no NASA branding, product claim or claimed result.\n\n## Pass 2: live rendered\n\n- Pending deployment.\n`);
if(!read('reports/search-console-editorial-log.md').includes('# 2026-10-31'))appendFileSync(resolve(root,'reports/search-console-editorial-log.md'),`\n# 2026-10-31\n\n- Report generated: 2026-10-28; window 2026-09-28 through 2026-10-25.\n- Used: 711 impressions, 7 clicks, 0.98% CTR and average position 17.96, plus zero-click Adventures (15 impressions / position 7.7), Destinations (9 / 13.9) and Gear (10 / 13.9), to strengthen the current homepage, four hubs, sitemap and nine reciprocal links.\n- Deliberately not chased: Howe Caverns (81 impressions / 1 click / position 9.1), folding wagons (27 / 1 / 10.7), camping sleep (9 / 1 / 8.4) and travel bags (8 / 2 / 14.1) already have distinct recent support; the travel-bag sample is still small.\n- Ignored as weak or irrelevant: one- and two-impression query fragments.\n- Portfolio: two authority-expansion items and one exploration; no derivative data-led page and no overlap with the October 31–November 1 roundup.\n`);
let auth=read('reports/authority-opportunities.md');if(!auth.includes('## 2026-10-31'))auth+=`\n## 2026-10-31\n\n- **NYS DEC Salmon River Fish Hatchery** — https://dec.ny.gov/things-to-do/freshwater-fishing/hatcheries/salmon-river — factual-correction angle for the independent 75-minute family route; invite corrections without implying endorsement or a live operating promise.\n- **Oswego County Tourism** — https://www.visitoswegocounty.com/contact-us/ — local-resource angle for a call-first working-hatchery family plan that sends operating facts to DEC.\n- **NASA STEM engagement** — https://www.nasa.gov/learning-resources/ — educator-resource angle for the equal-sheet six-test foil-boat evidence card with direct NASA attribution and no product promotion.\n\nNo outreach, submission or account creation was performed.\n`;write('reports/authority-opportunities.md',auth);
console.log('Generated exactly three October 31 guides, homepage time windows, four hubs, nine reciprocal links, sitemap, credits and authority records.');
