import {appendFileSync,readFileSync,writeFileSync} from 'node:fs';
import {resolve} from 'node:path';
import {pages} from './content-2026-10-22.mjs';
const root=resolve(process.argv[2]||'.'),date='2026-10-22',start='<!-- DAILY 2026-10-22 -->',end='<!-- END DAILY 2026-10-22 -->';
const read=p=>readFileSync(resolve(root,p),'utf8'),write=(p,s)=>writeFileSync(resolve(root,p),s);
if(pages.length!==3)throw Error('Exactly three October 22 sources required');
const template=read('scripts/publish-daily-2026-10-17.mjs').match(/const pageHtml=p=>(`[\s\S]*?`);\n\nfor\(const p of pages\)/)?.[1];
if(!template)throw Error('Versioned renderer changed');
const render=new Function('date','imageUrl',`return p=>${template}`)(date,n=>`https://mradventuredad.com/assets/images/photos/${n}`);
for(const p of pages){
 let h=render(p).replaceAll('v=20261017','v=20261022').replace(`src="../assets/images/photos/${p.image}"`,`src="../assets/images/photos/${p.image}" width="1600" height="900" style="height:auto"`);
 h=h.replace('<meta name="twitter:card"',`<meta property="og:image:width" content="1600"><meta property="og:image:height" content="900"><meta property="og:image:alt" content="${p.alt}"><meta name="twitter:image:alt" content="${p.alt}"><meta name="twitter:card"`);
 const crumbs={'@context':'https://schema.org','@type':'BreadcrumbList',itemListElement:[{'@type':'ListItem',position:1,name:'Home',item:'https://mradventuredad.com/'},{'@type':'ListItem',position:2,name:'Adventures',item:'https://mradventuredad.com/adventures.html'},{'@type':'ListItem',position:3,name:p.title}]};
 h=h.replace('</head>',`<script type="application/ld+json">${JSON.stringify(crumbs)}</script></head>`);write(`guides/${p.slug}.html`,h);
}
function insert(path,needle,block){let h=read(path).replace(new RegExp(`${start}[\\s\\S]*?${end}`,'g'),'');if(!h.includes(needle))throw Error(path+': insertion marker missing');write(path,h.replace(needle,start+block+end+needle));}
const link=i=>`guides/${pages[i].slug}.html`,img=p=>`<img src="assets/images/photos/${p.image}" width="1600" height="900" style="height:auto;aspect-ratio:16/9;object-fit:contain" alt="${p.alt}" loading="lazy" decoding="async">`;

let home=read('index.html').replace(new RegExp(`${start}[\\s\\S]*?${end}`,'g'),'');
const priorPattern=/<!-- DAILY 2026-10-21 -->[\s\S]*?<!-- END DAILY 2026-10-21 -->/g,prior=home.match(priorPattern)?.[0];home=home.replace(priorPattern,'');if(prior)home=home.replace('<div class="field-archive-content">','<div class="field-archive-content">'+prior);
const options=[
 ['TONIGHT · 10 MINUTES · WEATHER LOG',link(2),'Start a seven-day rain log','Pick one safe gauge location and write zero, measured, missing or delayed—never chase a storm.'],
 ['WEEKEND · DATED SHORTLIST','weekend-october-24-25-2026.html','Use the October 24–25 roundup','The separate weekly guide owns current event dates, tickets and organizer checks.'],
 ['BREAK DAY · MORAVIA · CALL FIRST',link(1),'Resolve Fillmore Glen’s trail notice','Call the park, verify one exact route and keep the lower park as the honest fallback.'],
 ['AT HOME · PACKING DECISION',link(0),'Total the outing load before buying wheels','Run the cut-list, count the route obstacles and compare carry, cart or leave-it outcomes.'],
 ['LOW ENERGY · FIVE MINUTES',link(2),'Record wet, dry or missing','A consistent safety decision is useful data. The gauge can wait.'],
 ['AFTER SCHOOL · 20 MINUTES','guides/teach-kids-read-trail-map-25-minute-game.html','Read one route at the table','Practice legend, junction and turnaround decisions before the next trail day.']
];
const lead=`<section class="now-plans wrap" aria-labelledby="now-plans-title"><div class="now-plans-head"><div><p class="kicker">FRESH IDEAS · OCTOBER 22, 2026</p><h2 id="now-plans-title">Pick the time you actually have.</h2><p>Measure one rainy week, resolve one park-source conflict or cut the outing load before buying another cart. The separate weekend roundup owns this week’s dated events.</p></div><a href="adventures.html">Browse all adventures →</a></div><div class="now-plans-grid">${options.map(o=>`<article class="now-plan"><span>${o[0]}</span><h3><a href="${o[1]}">${o[2]}</a></h3><p>${o[3]}</p></article>`).join('')}</div></section>`;
if(!/<section class="now-plans wrap"[\s\S]*?<section class="intro wrap">/.test(home))throw Error('Homepage lead missing');home=home.replace(/<section class="now-plans wrap"[\s\S]*?<section class="intro wrap">/,lead+'<section class="intro wrap">');
const cards=`${start}<section class="stories wrap"><div class="section-head"><div><p class="kicker">THREE DISTINCT FAMILY NEEDS</p><h2>Cut the load. Call the park. Measure the week.</h2></div></div><div class="story-grid">${pages.map((p,i)=>`<article class="story-card">${img(p)}<div><span>${['OUTING LOAD · EDITABLE TOOL · GENERIC IMAGE','MORAVIA · CALL-FIRST ROUTE · CONCEPTUAL IMAGE','AT HOME · WEATHER LOG · GENERIC IMAGE'][i]}</span><h3><a href="${link(i)}">${p.title}</a></h3><p>${p.description}</p></div></article>`).join('')}</div></section>${end}`;
home=home.replace('<details class="field-archive wrap">',cards+'<details class="field-archive wrap">');write('index.html',home);

insert('adventures.html','<!-- MAD AFFILIATE COMMERCE -->',`<section class="content-section alt"><div class="wrap"><p class="kicker">LOAD DECISION · CALL-FIRST PARK · SAFE WEATHER LOG</p><div class="simple-list">${pages.map((p,i)=>`<a href="${link(i)}">${p.title} <b>→</b></a>`).join('')}</div></div></section>`);
insert('gear.html','</main>',`<section class="content-section alt"><div class="wrap"><p class="kicker">PACK LESS · TEST THE ROUTE · BUY LAST</p><div class="card-grid"><article class="card">${img(pages[0])}<div><h3><a href="${link(0)}">${pages[0].title}</a></h3><p>${pages[0].description}</p></div></article></div></div></section>`);
insert('destinations.html','</main>',`<section class="content-section alt"><div class="wrap"><p class="kicker">MORAVIA · OFFICIAL-SOURCE CONFLICT · CALL FIRST</p><div class="card-grid"><article class="card">${img(pages[1])}<div><h3><a href="${link(1)}">${pages[1].title}</a></h3><p>${pages[1].description}</p></div></article></div></div></section>`);
insert('outdoors.html','</main>',`<section class="content-section alt"><div class="wrap"><p class="kicker">ROUTE FRICTION · GORGE STATUS · BACKYARD DATA</p><div class="simple-list">${pages.map((p,i)=>`<a href="${link(i)}">${p.title} <b>→</b></a>`).join('')}</div></div></section>`);

export const reciprocal=[
 ['family-folding-wagon-guide',0,'Use the editable outing-load calculator to prove the trimmed load and route earn a cart before buying one.'],
 ['family-day-trip-system',0,'Total the real cooler, water and activity gear, then make the six-line cut-list before departure.'],
 ['family-hiking-daypack-guide',0,'If the trimmed load fits reachable packs, the load calculator may save the family from adding a cart.'],
 ['buttermilk-falls-state-park-with-kids',1,'For another Finger Lakes gorge, the Fillmore Glen call-first plan shows how to handle conflicting official trail notices.'],
 ['taughannock-falls-with-kids',1,'Trail status does not transfer between parks: use the separate Fillmore Glen source-conflict call card.'],
 ['family-outdoor-weather-cutoff-plan',1,'At Fillmore Glen, trail confirmation joins weather, daylight, mobility and energy as a non-negotiable gate.'],
 ['family-noaa-weather-radio-same-hand-crank-guide',2,'Turn weather awareness into a seven-day backyard rain log without confusing a household gauge with official data.'],
 ['seven-night-family-moon-observation-log',2,'For a daytime weather project, use the seven-day rain log with the same consistency-over-drama rule.'],
 ['flashlight-shadow-lab-30-minute-family-science',2,'The rain log adds a week-long observation practice with a strict thunder safety gate.']
];
for(const [slug,i,label] of reciprocal)insert(`guides/${slug}.html`,'</main>',`<aside class="note"><a href="${pages[i].slug}.html"><strong>${label}</strong></a></aside>`);

let map=read('sitemap.xml');for(const p of pages){const url=`https://mradventuredad.com/guides/${p.slug}.html`;if(!map.includes(`<loc>${url}</loc>`))map=map.replace('</urlset>',`  <url><loc>${url}</loc><lastmod>${date}</lastmod></url>\n</urlset>`);}
for(const path of ['','adventures.html','destinations.html','gear.html','outdoors.html',...reciprocal.map(([s])=>`guides/${s}.html`)]){const url='https://mradventuredad.com/'+path;map=map.replace(new RegExp(`(<loc>${url.replaceAll('.','\\.')}</loc><lastmod>)[^<]+`),`$1${date}`);}write('sitemap.xml',map);

const credits=JSON.parse(read('assets/images/credits.json'));for(const p of pages)credits['assets/images/photos/'+p.image]={title:p.alt,creator:'Mr Adventure Dad Editorial Desk with OpenAI image generation',source:'Original AI-assisted conceptual editorial image',license:'Original AI-assisted image; published by Mr Adventure Dad',verified:date,notes:p.caption};write('assets/images/credits.json',JSON.stringify(credits,null,2)+'\n');
insert('photo-credits.html','</section><h2>Additional editorial photography</h2>',pages.map(p=>`<article class="photo-credit-card">${img(p)}<div><h2>${p.title}</h2><p>${p.caption}</p><p>Creator: Mr Adventure Dad Editorial Desk with OpenAI image generation. Original AI-assisted editorial asset, not third-party destination or exact product photography. Reviewed October 22, 2026.</p></div></article>`).join(''));

const report=`# Editorial decision record — October 22, 2026

## Inventory and duplication gate

The complete source and generated inventory contained 166 HTML pages before this batch. Every title, slug, heading, angle, commercial category and image was checked, including the prior fourteen days and the separate October 24–25 roundup. Existing Baltimore Woods, headlamp, flashlight-shadow, museum and recent camping-pad intent were rejected. No October 22 trio existed.

## Search Console decision

The private report was generated October 21, 2026 for September 21–October 18. MrAdventureDad.com recorded 781 impressions, 9 clicks, 1.2% CTR and average position 14.0. The family folding-wagon guide had 28 impressions, 1 click and position 10.29, enough to justify one non-cannibalizing support asset: an editable load and route-friction calculator whose intent is pre-purchase packing math rather than another wagon buying guide. The travel-bag page's 7 impressions and query fragments at one or two impressions were deliberately ignored as too weak. The sitemap row's 0 indexed / 153 submitted conflicts with observable page performance; it was treated as a discovery warning, so the batch strengthens homepage, hubs, sitemap and reciprocal links.

## Portfolio labels

- **Data-led — Family Outing Load Calculator:** supports the wagon cluster with a different intent and a no-buy-first tool.
- **Authority-expansion — Fillmore Glen With Kids:** transparently resolves an official page that simultaneously shows open and closed Gorge Trail language by requiring a park-office call and a lower-park fallback.
- **Exploration — Seven-Day Family Rain Log:** a no-spend home observation system with standardized-equipment boundaries and a strict National Weather Service thunder rule.

## Authority action

The batch creates three citation-worthy assets: an interactive carry/cart/cut calculator, a five-question official-source-conflict call card, and a seven-row household rain-observation method. Nine established pages now provide reciprocal contextual links. Sources, review date, editorial inference, commercial separation and correction route are explicit.

## Qualified opportunities — log only; no outreach sent

1. **New York State Parks — Fillmore Glen State Park** — https://parks.ny.gov/visit/state-parks/fillmore-glen-state-park — factual-correction angle for the conflicting Gorge Trail notices and the exact call-first family decision card.
2. **Cayuga County Office of Tourism** — https://www.tourcayuga.com/contact-us/ — practical family-resource angle for a transparent Fillmore Glen route-status and lower-park fallback guide.
3. **CoCoRaHS New York** — https://www.cocorahs.org/state.aspx?state=ny — weather-literacy resource angle for a household rain log that clearly distinguishes casual learning from trained reportable observations.

## Image gate before publication

Three unique 1600×900 editorial images were visually inspected against final title, copy, caption, alt and credit. The load scene shows generic unbranded gear; the Fillmore image is explicitly conceptual and not a destination photograph; the rain image shows generic uncalibrated equipment. Zero affiliate/product images are used. A second live rendered pass remains required.
`;
write('reports/editorial-decision-2026-10-22.md',report);
write('reports/image-qa-2026-10-22.md',`# Image QA — October 22, 2026\n\n## Pass 1: pre-publication\n\n- 3 unique 1600×900 editorial images visually inspected.\n- 0 affiliate/product images used.\n- Final title, copy, caption, alt, credit and link context checked for all three assets.\n- Load image: generic cargo and packing scene; no child-passenger, brand or testing claim.\n- Fillmore image: conceptual gorge-planning scene; caption and alt state it is not Fillmore Glen or a current-condition record.\n- Rain image: generic manual gauge; no readable scale, official-station or precision claim.\n\n## Pass 2: live rendered\n\n- Completed October 22, 2026 after production deployment of commit \`fb5f8aea682c20de4d9de5fb5ea45153203de5a5\`.\n- 11 editorial placements visually rechecked: 3 article heroes, 3 homepage cards, 1 gear-hub card, 1 destinations-hub card and 3 photo-credit records.\n- All 3 assets loaded at 1600×900 with the intended crop, title association, caption/credit context and accessible alt text; no broken source, fallback or card substitution appeared.\n- 0 affiliate/product images were present, so no product-image checks were required.\n- The homepage and hub thumbnails were allowed to finish native lazy-loading before approval.\n`);
if(!read('reports/search-console-editorial-log.md').includes('# 2026-10-22'))appendFileSync(resolve(root,'reports/search-console-editorial-log.md'),`\n# 2026-10-22\n\n- Report generated: 2026-10-21; window 2026-09-21 through 2026-10-18.\n- Used: folding-wagon page at 28 impressions / 1 click / position 10.29 for one distinct pre-purchase load calculator.\n- Ignored: travel-bag page at 7 impressions and one- or two-impression query fragments as too weak; binocular queries were already served.\n- Discovery: homepage, four hubs, sitemap and nine reciprocal links strengthened; 0 indexed / 153 submitted treated as a warning because it conflicts with observed clicks.\n- Portfolio: one data-led calculator, one authority-expansion destination plan and one fresh no-spend weather log; the October 24–25 roundup remains featured and unduplicated.\n`);
let auth=read('reports/authority-opportunities.md');if(!auth.includes('## 2026-10-22'))auth+=`\n## 2026-10-22\n\n- **New York State Parks — Fillmore Glen State Park** — https://parks.ny.gov/visit/state-parks/fillmore-glen-state-park — factual-correction angle for the conflicting Gorge Trail notices and exact call-first family decision card.\n- **Cayuga County Office of Tourism** — https://www.tourcayuga.com/contact-us/ — practical family-resource angle for the transparent Fillmore Glen status and lower-park fallback guide.\n- **CoCoRaHS New York** — https://www.cocorahs.org/state.aspx?state=ny — weather-literacy resource angle for a household rain log that clearly separates casual learning from trained reportable observations.\n\nNo outreach, submission or account creation was performed.\n`;write('reports/authority-opportunities.md',auth);
console.log('Generated exactly three October 22 guides, homepage time windows, four hubs, nine reciprocal links, sitemap, credits and authority records.');
