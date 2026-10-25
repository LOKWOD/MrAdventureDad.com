import {appendFileSync,readFileSync,writeFileSync} from 'node:fs';
import {resolve} from 'node:path';
import {pages} from './content-2026-10-25.mjs';
const root=resolve(process.argv[2]||'.'),date='2026-10-25',start='<!-- DAILY 2026-10-25 -->',end='<!-- END DAILY 2026-10-25 -->';
const read=p=>readFileSync(resolve(root,p),'utf8'),write=(p,s)=>writeFileSync(resolve(root,p),s);
if(pages.length!==3)throw Error('Exactly three October 25 sources required');
const template=read('scripts/publish-daily-2026-10-17.mjs').match(/const pageHtml=p=>(`[\s\S]*?`);\n\nfor\(const p of pages\)/)?.[1];
if(!template)throw Error('Versioned renderer changed');
const render=new Function('date','imageUrl',`return p=>${template}`)(date,n=>`https://mradventuredad.com/assets/images/photos/${n}`);
for(const p of pages){
 let h=render(p).replaceAll('v=20261017','v=20261025').replace(`src="../assets/images/photos/${p.image}"`,`src="../assets/images/photos/${p.image}" width="1600" height="900" style="height:auto"`);
 h=h.replace('<meta name="twitter:card"',`<meta property="og:image:width" content="1600"><meta property="og:image:height" content="900"><meta property="og:image:alt" content="${p.alt}"><meta name="twitter:image:alt" content="${p.alt}"><meta name="twitter:card"`);
 const crumbs={'@context':'https://schema.org','@type':'BreadcrumbList',itemListElement:[{'@type':'ListItem',position:1,name:'Home',item:'https://mradventuredad.com/'},{'@type':'ListItem',position:2,name:'Adventures',item:'https://mradventuredad.com/adventures.html'},{'@type':'ListItem',position:3,name:p.title}]};
 h=h.replace('</head>',`<script type="application/ld+json">${JSON.stringify(crumbs)}</script></head>`);write(`guides/${p.slug}.html`,h);
}
function insert(path,needle,block){let h=read(path).replace(new RegExp(`${start}[\\s\\S]*?${end}`,'g'),'');if(!h.includes(needle))throw Error(path+': insertion marker missing');write(path,h.replace(needle,start+block+end+needle));}
const link=i=>`guides/${pages[i].slug}.html`,img=p=>`<img src="assets/images/photos/${p.image}" width="1600" height="900" style="height:auto;aspect-ratio:16/9;object-fit:contain" alt="${p.alt}" loading="lazy" decoding="async">`;

let home=read('index.html').replace(new RegExp(`${start}[\\s\\S]*?${end}`,'g'),'');
const priorPattern=/<!-- DAILY 2026-10-24 -->[\s\S]*?<!-- END DAILY 2026-10-24 -->/g,prior=home.match(priorPattern)?.[0];home=home.replace(priorPattern,'');if(prior)home=home.replace('<div class="field-archive-content">','<div class="field-archive-content">'+prior);
const options=[
 ['TONIGHT · 25 MINUTES · NO-SPEND',link(2),'Double three fictional lines, cook nothing','Use paper fractions, prove the answer twice, and stop before food or appliances enter the lesson.'],
 ['WEEKEND · DATED SHORTLIST','weekend-october-24-25-2026.html','Use the October 24–25 roundup','The separate weekly guide owns current events, tickets, organizer links and date-specific decisions.'],
 ['HALF DAY · CANASTOTA · OUTDOORS',link(0),'Walk one wetland loop','Check daylight and mud, make three observations, and leave the bird blind quiet.'],
 ['AT HOME · WINTER GEAR',link(1),'Rent skates before buying','Match the program, fit both feet in thin socks, and reject heel lift instead of buying growth room.'],
 ['LOW ENERGY · 15 MINUTES',link(0),'Walk out by timer, then return','One quiet stop and a calm exit count; wildlife sightings and mileage do not.'],
 ['AFTER SCHOOL · 20 MINUTES','guides/family-grocery-receipt-detective-25-minute-math-activity.html','Run a receipt math round','Use the established no-spend math backup when fractions are too much today.']
];
const lead=`<section class="now-plans wrap" aria-labelledby="now-plans-title"><div class="now-plans-head"><div><p class="kicker">FRESH IDEAS · OCTOBER 25, 2026</p><h2 id="now-plans-title">Pick the time you actually have.</h2><p>Walk one wetland loop, rent before buying ice skates, or scale a fictional recipe without cooking. The separate weekend roundup keeps ownership of this week's dated events.</p></div><a href="adventures.html">Browse all adventures →</a></div><div class="now-plans-grid">${options.map(o=>`<article class="now-plan"><span>${o[0]}</span><h3><a href="${o[1]}">${o[2]}</a></h3><p>${o[3]}</p></article>`).join('')}</div></section>`;
if(!/<section class="now-plans wrap"[\s\S]*?<section class="intro wrap">/.test(home))throw Error('Homepage lead missing');home=home.replace(/<section class="now-plans wrap"[\s\S]*?<section class="intro wrap">/,lead+'<section class="intro wrap">');
const cards=`${start}<section class="stories wrap"><div class="section-head"><div><p class="kicker">THREE DIFFERENT FAMILY PROBLEMS</p><h2>Check the mud. Test the heel. Double every line.</h2></div></div><div class="story-grid">${pages.map((p,i)=>`<article class="story-card">${img(p)}<div><span>${['CANASTOTA · WETLAND WALK · CONCEPTUAL IMAGE','ICE SKATES · CATEGORY GUIDE · GENERIC IMAGE','AT HOME · NO-SPEND MATH · CONCEPTUAL IMAGE'][i]}</span><h3><a href="${link(i)}">${p.title}</a></h3><p>${p.description}</p></div></article>`).join('')}</div></section>${end}`;
home=home.replace('<details class="field-archive wrap">',cards+'<details class="field-archive wrap">');write('index.html',home);

insert('adventures.html','<!-- MAD AFFILIATE COMMERCE -->',`<section class="content-section alt"><div class="wrap"><p class="kicker">WETLAND LOOP · RENT-FIRST FIT · PAPER MATH</p><div class="simple-list">${pages.map((p,i)=>`<a href="${link(i)}">${p.title} <b>→</b></a>`).join('')}</div></div></section>`);
insert('gear.html','</main>',`<section class="content-section alt"><div class="wrap"><p class="kicker">RENT FIRST · THIN SOCK · HEEL TEST</p><div class="card-grid"><article class="card">${img(pages[1])}<div><h3><a href="${link(1)}">${pages[1].title}</a></h3><p>${pages[1].description}</p></div></article></div></div></section>`);
insert('destinations.html','</main>',`<section class="content-section alt"><div class="wrap"><p class="kicker">CANASTOTA · ONE LOOP · QUIET BLIND</p><div class="card-grid"><article class="card">${img(pages[0])}<div><h3><a href="${link(0)}">${pages[0].title}</a></h3><p>${pages[0].description}</p></div></article></div></div></section>`);
insert('outdoors.html','</main>',`<section class="content-section alt"><div class="wrap"><p class="kicker">WETLAND PLAN · WINTER FIT · NO-SPEND LAB</p><div class="simple-list"><a href="${link(0)}">${pages[0].title} <b>→</b></a><a href="${link(1)}">${pages[1].title} <b>→</b></a><a href="${link(2)}">${pages[2].title} <b>→</b></a></div></div></section>`);

export const reciprocal=[
 ['montezuma-national-wildlife-refuge-with-kids',0,'For a shorter self-guided wetland walk, use the Great Swamp one-loop, mud and quiet-blind gates.'],
 ['beaver-lake-nature-center-with-kids',0,'Compare this staffed nature-center plan with Great Swamp Conservancy’s free dawn-to-dusk trail option and call-ahead facility checks.'],
 ['family-wildlife-encounter-distance-plan',0,'Practice the distance script before a Great Swamp walk where wildlife observation—not approach—is the point.'],
 ['central-new-york-family-trail-picker',0,'Add Great Swamp Conservancy when a quiet wetland loop fits, but verify surface and facilities before choosing it.'],
 ['kids-winter-boots-pac-snow-hiking-guide',1,'Winter boots get the family to the rink; the ice-skate guide uses a separate rental-first heel and program fit.'],
 ['family-boot-dryer-fan-heated-passive-guide',1,'Skates need their manufacturer’s drying method and dry blade storage; do not assume a boot dryer is approved.'],
 ['family-outdoor-weather-cutoff-plan',1,'Use the weather cutoff before the rink drive, then use the rental-first skate fit guide inside.'],
 ['family-grocery-receipt-detective-25-minute-math-activity',2,'For fraction and ratio practice, the recipe-scaling lab doubles three fictional lines and cooks nothing.'],
 ['paper-bridge-load-test-25-minute-family-stem',2,'For a quieter paper-only math session, use the 25-minute recipe-scaling card and checked fraction proof.']
];
for(const [slug,i,label] of reciprocal)insert(`guides/${slug}.html`,'</main>',`<aside class="note"><a href="${pages[i].slug}.html"><strong>${label}</strong></a></aside>`);

let map=read('sitemap.xml');for(const p of pages){const url=`https://mradventuredad.com/guides/${p.slug}.html`;if(!map.includes(`<loc>${url}</loc>`))map=map.replace('</urlset>',`  <url><loc>${url}</loc><lastmod>${date}</lastmod></url>\n</urlset>`);}
for(const path of ['','adventures.html','destinations.html','gear.html','outdoors.html',...reciprocal.map(([s])=>`guides/${s}.html`)]){const url='https://mradventuredad.com/'+path;map=map.replace(new RegExp(`(<loc>${url.replaceAll('.','\\.')}</loc><lastmod>)[^<]+`),`$1${date}`);}write('sitemap.xml',map);

const credits=JSON.parse(read('assets/images/credits.json'));for(const p of pages)credits['assets/images/photos/'+p.image]={title:p.alt,creator:'Mr Adventure Dad Editorial Desk with OpenAI image generation',source:'Original AI-assisted conceptual editorial image',license:'Original AI-assisted image; published by Mr Adventure Dad',verified:date,notes:p.caption};write('assets/images/credits.json',JSON.stringify(credits,null,2)+'\n');
insert('photo-credits.html','</section><h2>Additional editorial photography</h2>',pages.map(p=>`<article class="photo-credit-card">${img(p)}<div><h2>${p.title}</h2><p>${p.caption}</p><p>Creator: Mr Adventure Dad Editorial Desk with OpenAI image generation. Original AI-assisted editorial asset, not third-party destination or exact product photography. Reviewed October 25, 2026.</p></div></article>`).join(''));

write('reports/editorial-decision-2026-10-25.md',`# Editorial decision record — October 25, 2026

## Inventory and duplication gate

The complete source and generated inventory contained 175 HTML pages before this batch. Existing titles, slugs, intents, locations, commercial categories and image records were checked, including October 11–24 and the separate October 24–25 roundup. Another cave, MOST, wagon, travel-bag, rain-boot, winter-boot or dated-event variation was rejected. Great Swamp is a distinct Canastota wetland route; ice skates answer a separate rink fit decision; recipe scaling is a no-cook fraction lab. No October 25 trio existed.

## Search Console decision

The private report was generated October 21, 2026 for September 21–October 18. MrAdventureDad.com recorded 781 impressions, 9 clicks, 1.15% CTR and average position 14.02. Howe Caverns (103 impressions / 2 clicks / position 8.7), MOST (45 / 1 / 15.47) and folding wagons (28 / 1 / 10.32) were meaningful, but each already received distinct support October 22–24. No page today is primarily data-led because another derivative would risk cannibalization. Seven-impression travel-bag activity and one- or two-impression fragments were too weak to steer the batch. The 0 indexed / 153 submitted sitemap row conflicts with observed clicks and remains a discovery warning, so crawl paths were strengthened.

## Portfolio labels

- **Authority-expansion — Great Swamp Conservancy With Kids:** adds a verified Canastota wetland route with five decision gates, quiet-blind rules and reciprocal nature-cluster links.
- **Authority-expansion — Kids’ Ice Skates:** adds a rent-first commercial decision distinct from winter boots, with program, heel, helmet, service and drying boundaries.
- **Exploration — Family Recipe-Scaling Lab:** adds a no-spend, no-cook fraction activity with a checked answer key and NIST measurement sources.

The trio is deliberately diverse in place, intent and format: a local outdoor plan, a commercial winter fit guide and a paper-only home math lab. No item competes with the current weekly event roundup.

## Authority action

Three citation-worthy tools were created: a five-gate wetland route card, a rental-first skate category and heel-fit matrix, and a three-line recipe-scaling card with two proofs. Nine established pages now link back contextually. Primary sourcing, explicit unknowns, date-stamped review, image labels, commercial separation and a correction route strengthen trust.

## Qualified opportunities — log only; no outreach sent

1. **Great Swamp Conservancy** — https://www.greatswampconservancy.org/contact — factual-correction and family-resource angle for the independent one-loop plan and explicit facility unknowns.
2. **Visit Madison County** — https://www.visitmadisoncounty.com/contact/ — local family-resource angle for a low-pressure Canastota wetland route that directs volatile details to the Conservancy.
3. **Learn to Skate USA** — https://learntoskateusa.com/contact — parent-resource angle for a rental-first fit framework grounded in its handbook; invite factual correction, not endorsement.

## Image gate before publication

Three unique 1600×900 editorial images were visually inspected against final titles, copy, captions, alt text, credits and linked context. The wetland scene is explicitly conceptual; the skates are generic unbranded categories; the recipe scene is a dry paper lab. Zero affiliate/product images are used. A second live rendered pass remains required.
`);
write('reports/image-qa-2026-10-25.md',`# Image QA — October 25, 2026\n\n## Pass 1: pre-publication\n\n- 3 unique 1600×900 editorial images visually inspected after final WebP conversion.\n- 0 affiliate/product images used.\n- Final title, copy, caption, alt, credit and linked destination/category context checked for all three assets.\n- Great Swamp image: generic wetland family-planning scene; not documentary destination evidence.\n- Ice-skate image: generic unbranded figure, hockey and adjustable category forms; no exact product or performance claim.\n- Recipe image: dry paper fraction activity; no food preparation or required-tool claim.\n\n## Pass 2: live rendered\n\n- Pending deployment.\n`);
if(!read('reports/search-console-editorial-log.md').includes('# 2026-10-25'))appendFileSync(resolve(root,'reports/search-console-editorial-log.md'),`\n# 2026-10-25\n\n- Report generated: 2026-10-21; window 2026-09-21 through 2026-10-18.\n- Used: overall discovery and CTR weakness to strengthen homepage, four hubs, sitemap and nine reciprocal links.\n- Deliberately not chased: Howe Caverns (103 impressions / 2 clicks), MOST (45 / 1) and folding wagons (28 / 1) already received distinct October 22–24 support.\n- Ignored as weak: seven-impression travel-bag activity and one- or two-impression fragments.\n- Portfolio: two authority-expansion items and one exploration; no derivative data-led page and no overlap with the October 24–25 roundup.\n`);
let auth=read('reports/authority-opportunities.md');if(!auth.includes('## 2026-10-25'))auth+=`\n## 2026-10-25\n\n- **Great Swamp Conservancy** — https://www.greatswampconservancy.org/contact — factual-correction and family-resource angle for the independent one-loop plan and explicit facility unknowns.\n- **Visit Madison County** — https://www.visitmadisoncounty.com/contact/ — local family-resource angle for a low-pressure Canastota wetland route that directs volatile details to the Conservancy.\n- **Learn to Skate USA** — https://learntoskateusa.com/contact — parent-resource angle for a rental-first fit framework grounded in its handbook; invite factual correction, not endorsement.\n\nNo outreach, submission or account creation was performed.\n`;write('reports/authority-opportunities.md',auth);
console.log('Generated exactly three October 25 guides, homepage time windows, four hubs, nine reciprocal links, sitemap, credits and authority records.');
