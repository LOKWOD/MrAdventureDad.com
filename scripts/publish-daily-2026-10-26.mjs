import {appendFileSync,readFileSync,writeFileSync} from 'node:fs';
import {resolve} from 'node:path';
import {pages} from './content-2026-10-26.mjs';
const root=resolve(process.argv[2]||'.'),date='2026-10-26',start='<!-- DAILY 2026-10-26 -->',end='<!-- END DAILY 2026-10-26 -->';
const read=p=>readFileSync(resolve(root,p),'utf8'),write=(p,s)=>writeFileSync(resolve(root,p),s);
if(pages.length!==3)throw Error('Exactly three October 26 sources required');
const template=read('scripts/publish-daily-2026-10-17.mjs').match(/const pageHtml=p=>(`[\s\S]*?`);\n\nfor\(const p of pages\)/)?.[1];
if(!template)throw Error('Versioned renderer changed');
const render=new Function('date','imageUrl',`return p=>${template}`)(date,n=>`https://mradventuredad.com/assets/images/photos/${n}`);
for(const p of pages){
 let h=render(p).replaceAll('v=20261017','v=20261026').replace(`src="../assets/images/photos/${p.image}"`,`src="../assets/images/photos/${p.image}" width="1600" height="900" style="height:auto"`);
 h=h.replace('<meta name="twitter:card"',`<meta property="og:image:width" content="1600"><meta property="og:image:height" content="900"><meta property="og:image:alt" content="${p.alt}"><meta name="twitter:image:alt" content="${p.alt}"><meta name="twitter:card"`);
 const crumbs={'@context':'https://schema.org','@type':'BreadcrumbList',itemListElement:[{'@type':'ListItem',position:1,name:'Home',item:'https://mradventuredad.com/'},{'@type':'ListItem',position:2,name:'Adventures',item:'https://mradventuredad.com/adventures.html'},{'@type':'ListItem',position:3,name:p.title}]};
 h=h.replace('</head>',`<script type="application/ld+json">${JSON.stringify(crumbs)}</script></head>`);write(`guides/${p.slug}.html`,h);
}
function insert(path,needle,block){let h=read(path).replace(new RegExp(`${start}[\\s\\S]*?${end}`,'g'),'');if(!h.includes(needle))throw Error(path+': insertion marker missing');write(path,h.replace(needle,start+block+end+needle));}
const link=i=>`guides/${pages[i].slug}.html`,img=p=>`<img src="assets/images/photos/${p.image}" width="1600" height="900" style="height:auto;aspect-ratio:16/9;object-fit:contain" alt="${p.alt}" loading="lazy" decoding="async">`;

let home=read('index.html').replace(new RegExp(`${start}[\\s\\S]*?${end}`,'g'),'');
const priorPattern=/<!-- DAILY 2026-10-25 -->[\s\S]*?<!-- END DAILY 2026-10-25 -->/g,prior=home.match(priorPattern)?.[0];home=home.replace(priorPattern,'');if(prior)home=home.replace('<div class="field-archive-content">','<div class="field-archive-content">'+prior);
const options=[
 ['TONIGHT · 20 MINUTES · NO-SPEND',link(2),'Empty one coat, then stop','Use five zones, keep private items private, and reload only what belongs in the pocket.'],
 ['WEEKEND · DATED SHORTLIST','weekend-october-24-25-2026.html','Keep the latest roundup archived','The separate weekly guide owns the completed October 24–25 event window; do not carry its expired cards forward.'],
 ['HALF DAY · VICTOR · HISTORY',link(0),'Gallery, Longhouse, one trail','Check the Wednesday–Saturday schedule, listen first, and add only the route the slowest kid can finish.'],
 ['WINTER PREP · RENT FIRST',link(1),'Fit snowshoes to the boot','Use the exact maker load range, test every strap with gloves, and keep the first walk short.'],
 ['LOW ENERGY · INDOORS',link(0),'Do one gallery section','The Creation Story film or one exhibit loop can be the whole Ganondagan visit.'],
 ['AFTER SCHOOL · 20 MINUTES','guides/family-laundry-care-label-sort-25-minute-lesson.html','Read five care labels','Use the existing wash-nothing lesson when coat pockets are already under control.']
];
const lead=`<section class="now-plans wrap" aria-labelledby="now-plans-title"><div class="now-plans-head"><div><p class="kicker">FRESH IDEAS · OCTOBER 26, 2026</p><h2 id="now-plans-title">Pick the time you actually have.</h2><p>Reset coat pockets tonight, plan a respectful Ganondagan half day, or rent snowshoes before buying. The completed weekend roundup stays archived instead of pretending expired events are current.</p></div><a href="adventures.html">Browse all adventures →</a></div><div class="now-plans-grid">${options.map(o=>`<article class="now-plan"><span>${o[0]}</span><h3><a href="${o[1]}">${o[2]}</a></h3><p>${o[3]}</p></article>`).join('')}</div></section>`;
if(!/<section class="now-plans wrap"[\s\S]*?<section class="intro wrap">/.test(home))throw Error('Homepage lead missing');home=home.replace(/<section class="now-plans wrap"[\s\S]*?<section class="intro wrap">/,lead+'<section class="intro wrap">');
const cards=`${start}<section class="stories wrap"><div class="section-head"><div><p class="kicker">THREE DIFFERENT FAMILY PROBLEMS</p><h2>Listen first. Rent first. Empty the pockets.</h2></div></div><div class="story-grid">${pages.map((p,i)=>`<article class="story-card">${img(p)}<div><span>${['VICTOR · CULTURAL SITE · CONCEPTUAL IMAGE','YOUTH SNOWSHOES · GENERIC CATEGORY IMAGE','SCHOOL NIGHT · NO-SPEND SYSTEM · CONCEPTUAL IMAGE'][i]}</span><h3><a href="${link(i)}">${p.title}</a></h3><p>${p.description}</p></div></article>`).join('')}</div></section>${end}`;
home=home.replace('<details class="field-archive wrap">',cards+'<details class="field-archive wrap">');write('index.html',home);

insert('adventures.html','<!-- MAD AFFILIATE COMMERCE -->',`<section class="content-section alt"><div class="wrap"><p class="kicker">CULTURAL SITE · WINTER FIT · SCHOOL-NIGHT RESET</p><div class="simple-list">${pages.map((p,i)=>`<a href="${link(i)}">${p.title} <b>→</b></a>`).join('')}</div></div></section>`);
insert('gear.html','</main>',`<section class="content-section alt"><div class="wrap"><p class="kicker">RENT FIRST · BOOT FIT · LOAD RANGE</p><div class="card-grid"><article class="card">${img(pages[1])}<div><h3><a href="${link(1)}">${pages[1].title}</a></h3><p>${pages[1].description}</p></div></article></div></div></section>`);
insert('destinations.html','</main>',`<section class="content-section alt"><div class="wrap"><p class="kicker">VICTOR · LISTEN FIRST · ONE TRAIL</p><div class="card-grid"><article class="card">${img(pages[0])}<div><h3><a href="${link(0)}">${pages[0].title}</a></h3><p>${pages[0].description}</p></div></article></div></div></section>`);
insert('outdoors.html','</main>',`<section class="content-section alt"><div class="wrap"><p class="kicker">GANONDAGAN PLAN · SNOWSHOE FIT · POCKET RESET</p><div class="simple-list"><a href="${link(0)}">${pages[0].title} <b>→</b></a><a href="${link(1)}">${pages[1].title} <b>→</b></a><a href="${link(2)}">${pages[2].title} <b>→</b></a></div></div></section>`);

export const reciprocal=[
 ['iroquois-museum-with-kids',0,'Compare this museum visit with Ganondagan’s gallery-first, Longhouse-when-open and one-trail route.'],
 ['womens-rights-national-historical-park-with-kids',0,'For another history day, Ganondagan uses a listen-first cultural-site plan with an explicit one-trail gate.'],
 ['family-museum-day-system',0,'Use the museum-day system before Ganondagan, then let official Seneca interpretation lead the visit.'],
 ['kids-winter-boots-pac-snow-hiking-guide',1,'Fit the waterproof boot first, then use the separate snowshoe binding and total-load checks.'],
 ['kids-trekking-poles-adjustable-fixed-folding-guide',1,'Poles are optional balance tools; the snowshoe guide keeps binding, boot and route compatibility primary.'],
 ['family-outdoor-weather-cutoff-plan',1,'Run the weather cutoff before a short snowshoe test and cancel for hidden-water, ice or visibility concerns.'],
 ['family-day-trip-system',2,'The pocket reset is a small school-night layer beneath the full day-trip system, not a replacement for it.'],
 ['family-medicine-away-from-home-plan',2,'Keep medication under the established adult-managed plan; a coat-pocket reset never relabels or casually redistributes it.'],
 ['family-laundry-care-label-sort-25-minute-lesson',2,'After emptying pockets, use the care-label lesson before washing or heat-drying the coat.']
];
for(const [slug,i,label] of reciprocal)insert(`guides/${slug}.html`,'</main>',`<aside class="note"><a href="${pages[i].slug}.html"><strong>${label}</strong></a></aside>`);

let map=read('sitemap.xml');for(const p of pages){const url=`https://mradventuredad.com/guides/${p.slug}.html`;if(!map.includes(`<loc>${url}</loc>`))map=map.replace('</urlset>',`  <url><loc>${url}</loc><lastmod>${date}</lastmod></url>\n</urlset>`);}
for(const path of ['','adventures.html','destinations.html','gear.html','outdoors.html',...reciprocal.map(([s])=>`guides/${s}.html`)]){const url='https://mradventuredad.com/'+path;map=map.replace(new RegExp(`(<loc>${url.replaceAll('.','\\.')}</loc><lastmod>)[^<]+`),`$1${date}`);}write('sitemap.xml',map);

const credits=JSON.parse(read('assets/images/credits.json'));for(const p of pages)credits['assets/images/photos/'+p.image]={title:p.alt,creator:'Mr Adventure Dad Editorial Desk with OpenAI image generation',source:'Original AI-assisted conceptual editorial image',license:'Original AI-assisted image; published by Mr Adventure Dad',verified:date,notes:p.caption};write('assets/images/credits.json',JSON.stringify(credits,null,2)+'\n');
insert('photo-credits.html','</section><h2>Additional editorial photography</h2>',pages.map(p=>`<article class="photo-credit-card">${img(p)}<div><h2>${p.title}</h2><p>${p.caption}</p><p>Creator: Mr Adventure Dad Editorial Desk with OpenAI image generation. Original AI-assisted editorial asset, not third-party destination or exact product photography. Reviewed October 26, 2026.</p></div></article>`).join(''));

write('reports/editorial-decision-2026-10-26.md',`# Editorial decision record — October 26, 2026

## Inventory and duplication gate

The complete inventory contained 178 HTML pages before this batch. Existing titles, slugs, intents, locations, commercial categories and image records were checked, including October 12–25 and the separate October 24–25 roundup. Another cave, MOST, wagon, travel-bag, rain-boot, ice-skate or dated-event variation was rejected. Ganondagan adds a distinct Seneca cultural-site route; snowshoes answer a separate boot-binding-load decision; the coat-pocket reset is a school-night household system. No October 26 trio existed.

## Search Console decision

The private report was generated October 21, 2026 for September 21–October 18. MrAdventureDad.com recorded 781 impressions, 9 clicks, 1.15% CTR and average position 14.02. Howe Caverns (103 impressions / 2 clicks / position 8.7), MOST (45 / 1 / 15.47) and folding wagons (28 / 1 / 10.32) were meaningful, but each already received distinct support in the preceding days. No page today is primarily data-led because another derivative would risk cannibalization. Seven-impression travel-bag activity and one- or two-impression fragments were too weak to steer the batch. The reported zero-indexed row conflicts with observed clicks and remains a discovery warning, so homepage, four hubs, sitemap and reciprocal paths were strengthened.

## Portfolio labels

- **Authority-expansion — Ganondagan With Kids:** adds a verified gallery-first, Longhouse-second and one-trail plan grounded in official Seneca interpretation, hours and admission.
- **Authority-expansion — Kids’ Snowshoes:** adds a rent-first commercial framework distinct from boots, skates and poles, with binding, total-load, marked-route and first-walk gates.
- **Exploration — Family Coat-Pocket Reset:** adds a no-spend school-night system with privacy, medication, battery, laundry and stop-time boundaries.

The trio is deliberately diverse in place, intent and format: a cultural destination, a commercial winter-equipment decision and a household reset. No item competes with the completed weekly event roundup.

## Authority action

Three citation-worthy tools were created: a three-part Ganondagan route card, an eight-step snowshoe boot-binding-load test, and a five-zone pocket reset. Nine established pages now link back contextually. Primary sourcing, explicit unknowns, date-stamped review, image labels, commercial separation and a correction route strengthen trust.

## Qualified opportunities — log only; no outreach sent

1. **Friends of Ganondagan** — https://www.ganondagan.org/contact — factual-correction and family-resource angle for the independent gallery/Longhouse/one-trail plan; invite correction, not endorsement.
2. **Visit Finger Lakes** — https://www.visitfingerlakes.com/about/contact-us/ — family-resource angle for a respectful Victor cultural-site plan that sends volatile details to Ganondagan.
3. **National Park Service winter recreation editors** — https://www.nps.gov/aboutus/contactus.htm — resource angle for a family snowshoe fit-and-first-walk checklist that cites NPS hazard guidance without implying endorsement.

## Image gate before publication

Three unique 1600×900 editorial images were visually inspected against final titles, copy, captions, alt text, credits and linked context. The Ganondagan-adjacent scene is explicitly conceptual, not destination evidence; the snowshoes are generic unbranded categories; the pocket reset shows only harmless blank materials. Zero affiliate/product images are used. A second live rendered pass remains required.
`);
write('reports/image-qa-2026-10-26.md',`# Image QA — October 26, 2026\n\n## Pass 1: pre-publication\n\n- 3 unique 1600×900 editorial images visually inspected after final WebP conversion.\n- 0 affiliate/product images used.\n- Final title, copy, caption, alt, credit and linked destination/category context checked for all three assets.\n- Ganondagan image: respectful generic cultural-center family scene; not documentary destination or exhibit evidence.\n- Snowshoe image: generic unbranded molded and frame category forms; no exact product or performance claim.\n- Pocket-reset image: generic no-spend home sorting scene with blank materials and no private information.\n\n## Pass 2: live rendered\n\n- Pending deployment.\n`);
if(!read('reports/search-console-editorial-log.md').includes('# 2026-10-26'))appendFileSync(resolve(root,'reports/search-console-editorial-log.md'),`\n# 2026-10-26\n\n- Report generated: 2026-10-21; window 2026-09-21 through 2026-10-18.\n- Used: overall discovery and CTR weakness to strengthen homepage, four hubs, sitemap and nine reciprocal links.\n- Deliberately not chased: Howe Caverns (103 impressions / 2 clicks), MOST (45 / 1) and folding wagons (28 / 1) already received distinct October 22–24 support.\n- Ignored as weak: seven-impression travel-bag activity and one- or two-impression fragments.\n- Portfolio: two authority-expansion items and one exploration; no derivative data-led page and no overlap with the October 24–25 roundup.\n`);
let auth=read('reports/authority-opportunities.md');if(!auth.includes('## 2026-10-26'))auth+=`\n## 2026-10-26\n\n- **Friends of Ganondagan** — https://www.ganondagan.org/contact — factual-correction and family-resource angle for the independent gallery/Longhouse/one-trail plan; invite correction, not endorsement.\n- **Visit Finger Lakes** — https://www.visitfingerlakes.com/about/contact-us/ — family-resource angle for a respectful Victor cultural-site plan that sends volatile details to Ganondagan.\n- **National Park Service winter recreation editors** — https://www.nps.gov/aboutus/contactus.htm — resource angle for a family snowshoe fit-and-first-walk checklist that cites NPS hazard guidance without implying endorsement.\n\nNo outreach, submission or account creation was performed.\n`;write('reports/authority-opportunities.md',auth);
console.log('Generated exactly three October 26 guides, homepage time windows, four hubs, nine reciprocal links, sitemap, credits and authority records.');
