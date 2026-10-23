import {appendFileSync,readFileSync,writeFileSync} from 'node:fs';
import {resolve} from 'node:path';
import {pages} from './content-2026-10-23.mjs';
const root=resolve(process.argv[2]||'.'),date='2026-10-23',start='<!-- DAILY 2026-10-23 -->',end='<!-- END DAILY 2026-10-23 -->';
const read=p=>readFileSync(resolve(root,p),'utf8'),write=(p,s)=>writeFileSync(resolve(root,p),s);
if(pages.length!==3)throw Error('Exactly three October 23 sources required');
const template=read('scripts/publish-daily-2026-10-17.mjs').match(/const pageHtml=p=>(`[\s\S]*?`);\n\nfor\(const p of pages\)/)?.[1];
if(!template)throw Error('Versioned renderer changed');
const render=new Function('date','imageUrl',`return p=>${template}`)(date,n=>`https://mradventuredad.com/assets/images/photos/${n}`);
for(const p of pages){
 let h=render(p).replaceAll('v=20261017','v=20261023').replace(`src="../assets/images/photos/${p.image}"`,`src="../assets/images/photos/${p.image}" width="1600" height="900" style="height:auto"`);
 h=h.replace('<meta name="twitter:card"',`<meta property="og:image:width" content="1600"><meta property="og:image:height" content="900"><meta property="og:image:alt" content="${p.alt}"><meta name="twitter:image:alt" content="${p.alt}"><meta name="twitter:card"`);
 const crumbs={'@context':'https://schema.org','@type':'BreadcrumbList',itemListElement:[{'@type':'ListItem',position:1,name:'Home',item:'https://mradventuredad.com/'},{'@type':'ListItem',position:2,name:'Adventures',item:'https://mradventuredad.com/adventures.html'},{'@type':'ListItem',position:3,name:p.title}]};
 h=h.replace('</head>',`<script type="application/ld+json">${JSON.stringify(crumbs)}</script></head>`);write(`guides/${p.slug}.html`,h);
}
function insert(path,needle,block){let h=read(path).replace(new RegExp(`${start}[\\s\\S]*?${end}`,'g'),'');if(!h.includes(needle))throw Error(path+': insertion marker missing');write(path,h.replace(needle,start+block+end+needle));}
const link=i=>`guides/${pages[i].slug}.html`,img=p=>`<img src="assets/images/photos/${p.image}" width="1600" height="900" style="height:auto;aspect-ratio:16/9;object-fit:contain" alt="${p.alt}" loading="lazy" decoding="async">`;

let home=read('index.html').replace(new RegExp(`${start}[\\s\\S]*?${end}`,'g'),'');
const priorPattern=/<!-- DAILY 2026-10-22 -->[\s\S]*?<!-- END DAILY 2026-10-22 -->/g,prior=home.match(priorPattern)?.[0];home=home.replace(priorPattern,'');if(prior)home=home.replace('<div class="field-archive-content">','<div class="field-archive-content">'+prior);
const options=[
 ['TONIGHT · 15 MINUTES · READINESS',link(0),'Rehearse the cave tour before buying','Try stairs, dim light, guide voice and the stop phrase while the child controls the exit.'],
 ['WEEKEND · DATED SHORTLIST','weekend-october-24-25-2026.html','Use the October 24–25 roundup','The separate weekly guide owns current event dates, tickets and organizer checks.'],
 ['BREAK DAY · FREE · 60 MINUTES',link(1),'Walk one Old Erie Canal out-and-back','Pick a legal access, turn at thirty minutes and let one piece of infrastructure carry the history lesson.'],
 ['AT HOME · 10 MINUTES · BAG FIT',link(2),'Test the snack container you already own','Pack the real food, cold sources and bag before buying a matching set.'],
 ['LOW ENERGY · ONE SAFE SNACK',link(2),'Use one familiar container','Food timing, temperature and a closure the child can open beat a clever system.'],
 ['AFTER SCHOOL · 25 MINUTES','guides/teach-kids-read-trail-map-25-minute-game.html','Read one canal section map','Practice parking, route, turnaround and bailout decisions at the table.']
];
const lead=`<section class="now-plans wrap" aria-labelledby="now-plans-title"><div class="now-plans-head"><div><p class="kicker">FRESH IDEAS · OCTOBER 23, 2026</p><h2 id="now-plans-title">Pick the time you actually have.</h2><p>Rehearse one cave tour, walk one canal hour or prove the snack container fits before buying more plastic. The separate weekend roundup owns this week's dated events.</p></div><a href="adventures.html">Browse all adventures →</a></div><div class="now-plans-grid">${options.map(o=>`<article class="now-plan"><span>${o[0]}</span><h3><a href="${o[1]}">${o[2]}</a></h3><p>${o[3]}</p></article>`).join('')}</div></section>`;
if(!/<section class="now-plans wrap"[\s\S]*?<section class="intro wrap">/.test(home))throw Error('Homepage lead missing');home=home.replace(/<section class="now-plans wrap"[\s\S]*?<section class="intro wrap">/,lead+'<section class="intro wrap">');
const cards=`${start}<section class="stories wrap"><div class="section-head"><div><p class="kicker">THREE DISTINCT FAMILY NEEDS</p><h2>Rehearse the cave. Walk the canal. Pack the snack.</h2></div></div><div class="story-grid">${pages.map((p,i)=>`<article class="story-card">${img(p)}<div><span>${['CAVE TOUR · FOUR GATES · CONCEPTUAL IMAGE','OLD ERIE CANAL · ONE HOUR · CONCEPTUAL IMAGE','DAY-TRIP FOOD · CATEGORY GUIDE · GENERIC IMAGE'][i]}</span><h3><a href="${link(i)}">${p.title}</a></h3><p>${p.description}</p></div></article>`).join('')}</div></section>${end}`;
home=home.replace('<details class="field-archive wrap">',cards+'<details class="field-archive wrap">');write('index.html',home);

insert('adventures.html','<!-- MAD AFFILIATE COMMERCE -->',`<section class="content-section alt"><div class="wrap"><p class="kicker">CAVE READINESS · CANAL HOUR · SNACK SYSTEM</p><div class="simple-list">${pages.map((p,i)=>`<a href="${link(i)}">${p.title} <b>→</b></a>`).join('')}</div></div></section>`);
insert('gear.html','</main>',`<section class="content-section alt"><div class="wrap"><p class="kicker">FOOD FIRST · CONTAINER SECOND</p><div class="card-grid"><article class="card">${img(pages[2])}<div><h3><a href="${link(2)}">${pages[2].title}</a></h3><p>${pages[2].description}</p></div></article></div></div></section>`);
insert('destinations.html','</main>',`<section class="content-section alt"><div class="wrap"><p class="kicker">CENTRAL NEW YORK · FREE · MAP FIRST</p><div class="card-grid"><article class="card">${img(pages[1])}<div><h3><a href="${link(1)}">${pages[1].title}</a></h3><p>${pages[1].description}</p></div></article></div></div></section>`);
insert('outdoors.html','</main>',`<section class="content-section alt"><div class="wrap"><p class="kicker">ONE HOUR · ONE TURNAROUND · ONE HISTORY CLUE</p><div class="simple-list"><a href="${link(1)}">${pages[1].title} <b>→</b></a><a href="${link(0)}">${pages[0].title} <b>→</b></a></div></div></section>`);

export const reciprocal=[
 ['howe-caverns-with-kids',0,'Before buying a nonrefundable cave ticket, use the four-gate readiness plan for mobility, sensory load, rules and exit.'],
 ['what-to-wear-howe-caverns-with-kids',0,'Clothing comes after readiness: run the cave-tour gate and home rehearsal before packing the 52°F layer.'],
 ['family-medicine-away-from-home-plan',0,'For a bag-restricted cave tour, confirm how essential medication can remain available before purchasing.'],
 ['erie-canal-museum-with-kids',1,'Take the history outdoors with a 60-minute Old Erie Canal out-and-back built around one visible infrastructure clue.'],
 ['camillus-erie-canal-park-with-kids',1,'The Old Erie Canal State Historic Park is separately operated; use its map-first one-hour plan and current rules.'],
 ['central-new-york-family-trail-picker',1,'When the family wants a short, flat-looking history walk, test one mapped Old Erie Canal access instead of promising the whole corridor.'],
 ['family-day-trip-cooler-guide',2,'Choose the snack container only after the perishable-food temperature plan and cold sources fit the bag.'],
 ['family-food-allergy-day-trip-plan',2,'A divider is not allergen control; use the snack-container guide only inside the clinician-directed family plan.'],
 ['family-day-trip-system',2,'Assign one snack stop and prove the container, cold sources and return mess fit the day-trip bag.']
];
for(const [slug,i,label] of reciprocal)insert(`guides/${slug}.html`,'</main>',`<aside class="note"><a href="${pages[i].slug}.html"><strong>${label}</strong></a></aside>`);

let map=read('sitemap.xml');for(const p of pages){const url=`https://mradventuredad.com/guides/${p.slug}.html`;if(!map.includes(`<loc>${url}</loc>`))map=map.replace('</urlset>',`  <url><loc>${url}</loc><lastmod>${date}</lastmod></url>\n</urlset>`);}
for(const path of ['','adventures.html','destinations.html','gear.html','outdoors.html',...reciprocal.map(([s])=>`guides/${s}.html`)]){const url='https://mradventuredad.com/'+path;map=map.replace(new RegExp(`(<loc>${url.replaceAll('.','\\.')}</loc><lastmod>)[^<]+`),`$1${date}`);}write('sitemap.xml',map);

const credits=JSON.parse(read('assets/images/credits.json'));for(const p of pages)credits['assets/images/photos/'+p.image]={title:p.alt,creator:'Mr Adventure Dad Editorial Desk with OpenAI image generation',source:'Original AI-assisted conceptual editorial image',license:'Original AI-assisted image; published by Mr Adventure Dad',verified:date,notes:p.caption};write('assets/images/credits.json',JSON.stringify(credits,null,2)+'\n');
insert('photo-credits.html','</section><h2>Additional editorial photography</h2>',pages.map(p=>`<article class="photo-credit-card">${img(p)}<div><h2>${p.title}</h2><p>${p.caption}</p><p>Creator: Mr Adventure Dad Editorial Desk with OpenAI image generation. Original AI-assisted editorial asset, not third-party destination or exact product photography. Reviewed October 23, 2026.</p></div></article>`).join(''));

const report=`# Editorial decision record — October 23, 2026

## Inventory and duplication gate

The complete source and generated inventory contained 169 HTML pages before this batch. All 150 existing guide intents, titles, slugs, commercial categories and image records were checked, including October 9–22 and the separate October 24–25 roundup. Another gorge guide, museum comparison, paper STEM activity, wagon variation and near-duplicate cold-weather boot guide were rejected. No October 23 trio existed.

## Search Console decision

The private report was generated October 21, 2026 for September 21–October 18. MrAdventureDad.com recorded 781 impressions, 9 clicks, 1.15% CTR and average position 14.02. Howe Caverns had 103 impressions, 2 clicks and position 8.70, enough to justify one non-cannibalizing support page: a general pre-booking cave-tour readiness framework whose intent is mobility, sensory and exit fit rather than another Howe itinerary or clothing guide. The MOST page at 45 impressions / 1 click / position 15.47 was deliberately not chased because existing museum, outing-picker and membership coverage already serves adjacent intent; one- and two-impression query fragments were ignored as too weak. The 0 indexed / 153 submitted sitemap row conflicts with observable page clicks and was treated as a discovery warning, so this batch strengthens homepage, four hubs, sitemap and reciprocal links.

## Portfolio labels

- **Data-led — First Cave Tour With Kids:** turns the proven Howe cluster into a distinct four-gate pre-booking decision and 15-minute home rehearsal.
- **Authority-expansion — Old Erie Canal State Historic Park With Kids:** adds a map-first, free one-hour history walk to the Central New York trail/canal cluster without competing with the dated weekend roundup.
- **Exploration — Family Day-Trip Snack Containers:** tests a new everyday food-and-packing need with honest category commerce, USDA temperature boundaries and a no-buy path.

## Authority action

The batch creates three citation-worthy decision assets: a four-gate cave-tour readiness card, a five-part linear-park access gate with one-hour itinerary, and an eight-check snack-container keep-or-return framework. Nine established pages now provide reciprocal contextual links, while source dates, official fallbacks, commercial separation, conceptual-image labels and a correction route strengthen trust.

## Qualified opportunities — log only; no outreach sent

1. **Howe Caverns guest services** — https://howecaverns.com/contact-us/ — family-readiness resource angle for a pre-booking call card that accurately cites current Traditional Tour requirements and routes readers back to official tickets.
2. **New York State Parks — Old Erie Canal State Historic Park** — https://parks.ny.gov/visit/state-parks/old-erie-canal-state-historic-park — local family-resource angle for a map-first one-hour walk that foregrounds current alerts and designated access.
3. **Erie Canalway National Heritage Corridor** — https://eriecanalway.org/contact — educational resource angle for a short infrastructure-observation walk that links canal history to official maps rather than inventing a trail narrative.

## Image gate before publication

Three unique 1600×900 editorial images were visually inspected against final title, copy, caption, alt, credit and destination/category context. The cave image is explicitly generic and not Howe Caverns; the canal image is explicitly conceptual and not a current Old Erie Canal trail photograph; the snack image shows generic category forms and not affiliate products. Zero affiliate/product images are used. A second live rendered pass remains required.
`;
write('reports/editorial-decision-2026-10-23.md',report);
write('reports/image-qa-2026-10-23.md',`# Image QA — October 23, 2026\n\n## Pass 1: pre-publication\n\n- 3 unique 1600×900 editorial images visually inspected after final WebP conversion.\n- 0 affiliate/product images used.\n- Final title, copy, caption, alt, credit and linked destination/category context checked for all three assets.\n- Cave image: generic show-cave readiness scene; no named-place, access, route or current-condition claim.\n- Canal image: conceptual towpath planning scene; no claim that the image is Old Erie Canal State Historic Park or documents current accessibility.\n- Snack image: generic box, screw-top cup and zipper pouch; no exact product, material, allergen, food-safety or affiliate claim.\n\n## Pass 2: live rendered\n\n- Pending deployment.\n`);
if(!read('reports/search-console-editorial-log.md').includes('# 2026-10-23'))appendFileSync(resolve(root,'reports/search-console-editorial-log.md'),`\n# 2026-10-23\n\n- Report generated: 2026-10-21; window 2026-09-21 through 2026-10-18.\n- Used: Howe Caverns page at 103 impressions / 2 clicks / position 8.70 for one distinct pre-booking cave readiness guide.\n- Ignored: MOST at 45 impressions / 1 click because adjacent museum, picker and membership coverage is already strong; one- and two-impression query fragments were too weak.\n- Discovery: homepage, four hubs, sitemap and nine reciprocal links strengthened; 0 indexed / 153 submitted treated as a warning because it conflicts with observed clicks.\n- Portfolio: one data-led readiness framework, one authority-expansion canal outing and one fresh commercial snack-container guide; the October 24–25 roundup remains featured and unduplicated.\n`);
let auth=read('reports/authority-opportunities.md');if(!auth.includes('## 2026-10-23'))auth+=`\n## 2026-10-23\n\n- **Howe Caverns guest services** — https://howecaverns.com/contact-us/ — family-readiness resource angle for a four-gate pre-booking call card that accurately cites current Traditional Tour requirements and routes readers to official tickets.\n- **New York State Parks — Old Erie Canal State Historic Park** — https://parks.ny.gov/visit/state-parks/old-erie-canal-state-historic-park — local family-resource angle for a map-first one-hour walk that foregrounds current alerts and designated access.\n- **Erie Canalway National Heritage Corridor** — https://eriecanalway.org/contact — educational resource angle for a short infrastructure-observation walk that links canal history to official maps.\n\nNo outreach, submission or account creation was performed.\n`;write('reports/authority-opportunities.md',auth);
console.log('Generated exactly three October 23 guides, homepage time windows, four hubs, nine reciprocal links, sitemap, credits and authority records.');
