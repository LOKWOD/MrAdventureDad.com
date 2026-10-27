import {appendFileSync,readFileSync,writeFileSync} from 'node:fs';
import {resolve} from 'node:path';
import {pages} from './content-2026-10-27.mjs';

const root=resolve(process.argv[2]||'.'),date='2026-10-27',start='<!-- DAILY 2026-10-27 -->',end='<!-- END DAILY 2026-10-27 -->';
const read=p=>readFileSync(resolve(root,p),'utf8'),write=(p,s)=>writeFileSync(resolve(root,p),s);
if(pages.length!==3)throw Error('Exactly three October 27 sources required');
const template=read('scripts/publish-daily-2026-10-17.mjs').match(/const pageHtml=p=>(`[\s\S]*?`);\n\nfor\(const p of pages\)/)?.[1];
if(!template)throw Error('Versioned renderer changed');
const render=new Function('date','imageUrl',`return p=>${template}`)(date,n=>`https://mradventuredad.com/assets/images/photos/${n}`);
for(const p of pages){
 let h=render(p).replaceAll('v=20261017','v=20261027').replace(`src="../assets/images/photos/${p.image}"`,`src="../assets/images/photos/${p.image}" width="1600" height="900" style="height:auto"`);
 h=h.replace('<meta name="twitter:card"',`<meta property="og:image:width" content="1600"><meta property="og:image:height" content="900"><meta property="og:image:alt" content="${p.alt}"><meta name="twitter:image:alt" content="${p.alt}"><meta name="twitter:card"`);
 const crumbs={'@context':'https://schema.org','@type':'BreadcrumbList',itemListElement:[{'@type':'ListItem',position:1,name:'Home',item:'https://mradventuredad.com/'},{'@type':'ListItem',position:2,name:'Adventures',item:'https://mradventuredad.com/adventures.html'},{'@type':'ListItem',position:3,name:p.title}]};
 h=h.replace('</head>',`<script type="application/ld+json">${JSON.stringify(crumbs)}</script></head>`);write(`guides/${p.slug}.html`,h);
}
function insert(path,needle,block){let h=read(path).replace(new RegExp(`${start}[\\s\\S]*?${end}`,'g'),'');if(!h.includes(needle))throw Error(path+': insertion marker missing');write(path,h.replace(needle,start+block+end+needle));}
const link=i=>`guides/${pages[i].slug}.html`,img=p=>`<img src="assets/images/photos/${p.image}" width="1600" height="900" style="height:auto;aspect-ratio:16/9;object-fit:contain" alt="${p.alt}" loading="lazy" decoding="async">`;

let home=read('index.html').replace(new RegExp(`${start}[\\s\\S]*?${end}`,'g'),'');
const priorPattern=/<!-- DAILY 2026-10-26 -->[\s\S]*?<!-- END DAILY 2026-10-26 -->/g,prior=home.match(priorPattern)?.[0];home=home.replace(priorPattern,'');if(prior)home=home.replace('<div class="field-archive-content">','<div class="field-archive-content">'+prior);
const options=[
 ['TONIGHT · 25 MINUTES · NO-SPEND',link(2),'Check one pantry shelf','Read the date wording, let an adult inspect every package, plan one use-soon meal and stop.'],
 ['WEEKEND · WATERFALL OVERLOOK',link(0),'Use the short upper trail','Confirm weather and DEC status, stay behind barriers and skip the gorge entirely.'],
 ['BREAK · PACKING RESET',link(1),'Test the bag before buying cubes','Use three containers already at home, measure the loaded shapes and buy only a proven gap.'],
 ['AT HOME · LOW ENERGY',link(2),'Read five labels, not the pantry','Keep/use-soon/adult-check is enough for a useful ten-minute version.'],
 ['HALF DAY · INDOOR FALLBACK','guides/most-syracuse-with-kids.html','Use the MOST decision plan','Keep a verified indoor route ready when waterfall roads, ice or rain fail the gate.'],
 ['ARCHIVE · WEEKEND EVENTS','weekend-october-24-25-2026.html','Keep the completed roundup archived','The separate weekly guide owns that finished event window; today adds no competing event page.']
];
const lead=`<section class="now-plans wrap" aria-labelledby="now-plans-title"><div class="now-plans-head"><div><p class="kicker">FRESH IDEAS · OCTOBER 27, 2026</p><h2 id="now-plans-title">Pick the time you actually have.</h2><p>Check one pantry shelf tonight, test travel organizers before buying, or plan a strict upper-overlook visit at Salmon River Falls. Current conditions still get the final vote.</p></div><a href="adventures.html">Browse all adventures →</a></div><div class="now-plans-grid">${options.map(o=>`<article class="now-plan"><span>${o[0]}</span><h3><a href="${o[1]}">${o[2]}</a></h3><p>${o[3]}</p></article>`).join('')}</div></section>`;
if(!/<section class="now-plans wrap"[\s\S]*?<section class="intro wrap">/.test(home))throw Error('Homepage lead missing');home=home.replace(/<section class="now-plans wrap"[\s\S]*?<section class="intro wrap">/,lead+'<section class="intro wrap">');
const cards=`${start}<section class="stories wrap"><div class="section-head"><div><p class="kicker">THREE DIFFERENT FAMILY PROBLEMS</p><h2>Stay above the gorge. Test the bag. Read the label.</h2></div></div><div class="story-grid">${pages.map((p,i)=>`<article class="story-card">${img(p)}<div><span>${['OSWEGO COUNTY · CONCEPTUAL OVERLOOK IMAGE','TRAVEL ORGANIZATION · GENERIC CATEGORY IMAGE','AT HOME · NO-SPEND SYSTEM · CONCEPTUAL IMAGE'][i]}</span><h3><a href="${link(i)}">${p.title}</a></h3><p>${p.description}</p></div></article>`).join('')}</div></section>${end}`;
home=home.replace('<details class="field-archive wrap">',cards+'<details class="field-archive wrap">');write('index.html',home);

insert('adventures.html','<!-- MAD AFFILIATE COMMERCE -->',`<section class="content-section alt"><div class="wrap"><p class="kicker">UPPER OVERLOOK · BAG-FIT TEST · PANTRY CHECK</p><div class="simple-list">${pages.map((p,i)=>`<a href="${link(i)}">${p.title} <b>→</b></a>`).join('')}</div></div></section>`);
insert('destinations.html','</main>',`<section class="content-section alt"><div class="wrap"><p class="kicker">OSWEGO COUNTY · UPPER TRAIL ONLY</p><div class="card-grid"><article class="card">${img(pages[0])}<div><h3><a href="${link(0)}">${pages[0].title}</a></h3><p>${pages[0].description}</p></div></article></div></div></section>`);
insert('gear.html','</main>',`<section class="content-section alt"><div class="wrap"><p class="kicker">NO-BUY-FIRST · BAG-FIT TEST</p><div class="card-grid"><article class="card">${img(pages[1])}<div><h3><a href="${link(1)}">${pages[1].title}</a></h3><p>${pages[1].description}</p></div></article></div></div></section>`);
insert('outdoors.html','</main>',`<section class="content-section alt"><div class="wrap"><p class="kicker">OVERLOOK PLAN · TRAVEL SYSTEM · HOME RESET</p><div class="simple-list"><a href="${link(0)}">${pages[0].title} <b>→</b></a><a href="${link(1)}">${pages[1].title} <b>→</b></a><a href="${link(2)}">${pages[2].title} <b>→</b></a></div></div></section>`);

export const reciprocal=[
 ['chittenango-falls-with-kids',0,'Compare the short Chittenango route with Salmon River Falls’ upper-overlook-only plan and hard gorge restrictions.'],
 ['central-new-york-family-trail-picker',0,'Add Salmon River Falls only when the short upper trail, road, weather and child-boundary gates all pass.'],
 ['family-outdoor-weather-cutoff-plan',0,'Apply the weather cutoff before the Salmon River Falls drive; thunder, ice, high water or poor roads cancel the overlook.'],
 ['family-travel-bags-rolling-carry-on-duffel-backpack',1,'After choosing the bag format, use the separate cube-and-pouch guide to test the interior with containers already at home.'],
 ['family-hotel-room-system',1,'Give each tested cube or pouch a landing place in the hotel room instead of buying an oversized matching set.'],
 ['family-day-trip-system',1,'For overnight packing, the cube guide adds a measured bag-fit test without replacing the day-trip load and contact system.'],
 ['family-grocery-receipt-detective-25-minute-math-activity',2,'Follow receipt math with the pantry date-label check: kids can read; an adult inspects packages and decides.'],
 ['family-food-allergy-day-trip-plan',2,'Keep allergen decisions adult-managed during the pantry check; intact labels and original packaging preserve critical information.'],
 ['family-recipe-scaling-25-minute-math-lab',2,'Choose only an adult-approved use-soon ingredient before turning it into a separate recipe-scaling lesson.']
];
for(const [slug,i,label] of reciprocal)insert(`guides/${slug}.html`,'</main>',`<aside class="note"><a href="${pages[i].slug}.html"><strong>${label}</strong></a></aside>`);

let map=read('sitemap.xml');for(const p of pages){const url=`https://mradventuredad.com/guides/${p.slug}.html`;if(!map.includes(`<loc>${url}</loc>`))map=map.replace('</urlset>',`  <url><loc>${url}</loc><lastmod>${date}</lastmod></url>\n</urlset>`);}
for(const path of ['','adventures.html','destinations.html','gear.html','outdoors.html',...reciprocal.map(([s])=>`guides/${s}.html`)]){const url='https://mradventuredad.com/'+path;map=map.replace(new RegExp(`(<loc>${url.replaceAll('.','\\.')}</loc><lastmod>)[^<]+`),`$1${date}`);}write('sitemap.xml',map);

const credits=JSON.parse(read('assets/images/credits.json'));for(const p of pages)credits['assets/images/photos/'+p.image]={title:p.alt,creator:'Mr Adventure Dad Editorial Desk with OpenAI image generation',source:'Original AI-assisted conceptual editorial image',license:'Original AI-assisted image; published by Mr Adventure Dad',verified:date,notes:p.caption};write('assets/images/credits.json',JSON.stringify(credits,null,2)+'\n');
insert('photo-credits.html','</section><h2>Additional editorial photography</h2>',pages.map(p=>`<article class="photo-credit-card">${img(p)}<div><h2>${p.title}</h2><p>${p.caption}</p><p>Creator: Mr Adventure Dad Editorial Desk with OpenAI image generation. Original AI-assisted editorial asset, not third-party destination or exact product photography. Reviewed October 27, 2026.</p></div></article>`).join(''));

write('reports/editorial-decision-2026-10-27.md',`# Editorial decision record — October 27, 2026

## Inventory and duplication gate

The complete inventory contained 181 HTML pages before this batch. Existing titles, slugs, intents, locations, commercial categories, section angles and image records were checked, including October 13–26 and the separate October 24–25 roundup. Another Howe Caverns, MOST, folding-wagon, snowshoe, generic waterfall-loop, travel-bag-format or dated-event variation was rejected. Salmon River Falls adds a site-specific upper-overlook plan; packing cubes answer an interior-organization and bag-fit decision rather than bag selection; the pantry check is a no-spend household food-label system. No October 27 trio existed.

## Search Console decision

The private report was generated October 21, 2026 for September 21–October 18. MrAdventureDad.com recorded 781 impressions, 9 clicks, 1.15% CTR and average position 14.02. Howe Caverns (103 impressions / 2 clicks / position 8.7), MOST (45 / 1 / 15.47) and folding wagons (28 / 1 / 10.32) remain credible, but each already received recent, distinct support. Seven impressions on the travel-bag page and one- or two-impression query fragments were too weak to justify a data-led derivative. No item today is labeled Data-led. The contradictory zero-indexed/153-submitted sitemap row remains a discovery warning, so homepage, four hubs, sitemap and nine reciprocal paths were strengthened.

## Portfolio labels

- **Authority-expansion — Salmon River Falls With Kids:** a current DEC-grounded, upper-trail-only destination plan with hard cliff, high-water, seasonal and daylight gates.
- **Authority-expansion — Family Packing Cubes:** a commercially useful no-buy-first framework that separates mesh, wipe-clean and compression jobs without competing with the bag-format guide.
- **Exploration — Family Pantry Date Check:** a no-spend school-night system grounded in USDA/FDA date-label and package-damage guidance.

The trio is deliberately diverse in place, intent and format: a regional outdoor destination, a travel-organization purchase decision and an at-home food-label lesson. No page competes with the separate weekly event roundup.

## Authority action

Three citation-ready tools were created: the Salmon River Falls upper-trail decision card, an eight-step packing-container bag-fit test and a three-zone pantry date/package triage card. Nine established pages now link back contextually. Primary sourcing, dated review, explicit uncertainty, correction routes, image labels and commercial separation strengthen trust.

## Qualified opportunities — log only; no outreach sent

1. **NYS DEC Region 7 Lands and Forests** — https://dec.ny.gov/places/salmon-river-falls-unique-area — factual-correction angle for the family upper-overlook route; invite corrections without asking for endorsement.
2. **Oswego County Tourism** — https://visitoswegocounty.com/contact/ — family-resource angle for a conservative Salmon River Falls plan that sends live conditions and rules back to DEC.
3. **USDA Food Safety Education** — https://www.fsis.usda.gov/contact-us — resource angle for the family date-label lesson, with exact attribution and no claim of partnership.

## Image gate before publication

Three unique 1600×900 editorial images were visually inspected against final titles, copy, captions, alt text, credits and linked context. The waterfall image is explicitly conceptual and not destination evidence; the organizer image shows generic unbranded categories; the pantry image uses blank intact packages and does not imply a safety result. Zero affiliate/product images are used. A second live rendered pass remains required.
`);
write('reports/image-qa-2026-10-27.md',`# Image QA — October 27, 2026\n\n## Pass 1: pre-publication\n\n- 3 unique 1600×900 editorial images visually inspected after final WebP conversion.\n- 0 affiliate/product images used.\n- Final title, copy, caption, alt, credit and linked destination/category context checked for all three assets.\n- Salmon River Falls image: generic conceptual waterfall overlook; explicitly not the named destination, real barriers or live conditions.\n- Packing-cube image: generic unbranded mesh cube, opaque pouch and compression category forms; no product or performance claim.\n- Pantry image: generic family sorting intact blank packages; no real date, recall, damage or safety finding.\n\n## Pass 2: live rendered\n\n- Pending deployment.\n`);
if(!read('reports/search-console-editorial-log.md').includes('# 2026-10-27'))appendFileSync(resolve(root,'reports/search-console-editorial-log.md'),`\n# 2026-10-27\n\n- Report generated: 2026-10-21; window 2026-09-21 through 2026-10-18.\n- Used: overall discovery and CTR weakness to strengthen homepage, four hubs, sitemap and nine reciprocal links.\n- Deliberately not chased: Howe Caverns (103 impressions / 2 clicks), MOST (45 / 1) and folding wagons (28 / 1) already received recent distinct support.\n- Ignored as weak: seven-impression travel-bag activity and one- or two-impression fragments; the cube guide is authority-expansion, not data-led.\n- Portfolio: two authority-expansion items and one exploration; no derivative data-led page and no overlap with the October 24–25 roundup.\n`);
let auth=read('reports/authority-opportunities.md');if(!auth.includes('## 2026-10-27'))auth+=`\n## 2026-10-27\n\n- **NYS DEC Region 7 Lands and Forests** — https://dec.ny.gov/places/salmon-river-falls-unique-area — factual-correction angle for the family upper-overlook route; invite corrections without asking for endorsement.\n- **Oswego County Tourism** — https://visitoswegocounty.com/contact/ — family-resource angle for a conservative Salmon River Falls plan that sends live conditions and rules back to DEC.\n- **USDA Food Safety Education** — https://www.fsis.usda.gov/contact-us — resource angle for the family date-label lesson, with exact attribution and no claim of partnership.\n\nNo outreach, submission or account creation was performed.\n`;write('reports/authority-opportunities.md',auth);
console.log('Generated exactly three October 27 guides, homepage time windows, four hubs, nine reciprocal links, sitemap, credits and authority records.');
