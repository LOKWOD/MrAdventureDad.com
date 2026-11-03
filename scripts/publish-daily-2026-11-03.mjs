import {appendFileSync,readFileSync,writeFileSync} from 'node:fs';
import {resolve} from 'node:path';
import {pages} from './content-2026-11-03.mjs';

const root=resolve(process.argv[2]||'.'),date='2026-11-03',start='<!-- DAILY 2026-11-03 -->',end='<!-- END DAILY 2026-11-03 -->';
const read=p=>readFileSync(resolve(root,p),'utf8'),write=(p,s)=>writeFileSync(resolve(root,p),s);
if(pages.length!==3)throw Error('Exactly three November 3 sources required');

const template=read('scripts/publish-daily-2026-10-17.mjs').match(/const pageHtml=p=>(`[\s\S]*?`);\n\nfor\(const p of pages\)/)?.[1];
if(!template)throw Error('Versioned renderer changed');
const render=new Function('date','imageUrl',`return p=>${template}`)(date,n=>`https://mradventuredad.com/assets/images/photos/${n}`);
for(const [i,p] of pages.entries()){
 let h=render(p).replaceAll('v=20261017','v=20261103').replace(`src="../assets/images/photos/${p.image}"`,`src="../assets/images/photos/${p.image}" width="1600" height="900" style="height:auto"`);
 h=h.replace('<meta name="twitter:card"',`<meta property="og:image:width" content="1600"><meta property="og:image:height" content="900"><meta property="og:image:alt" content="${p.alt}"><meta name="twitter:image:alt" content="${p.alt}"><meta name="twitter:card"`);
 const section=['Destinations','Gear','Adventures'][i],sectionUrl=['destinations.html','gear.html','adventures.html'][i];
 const crumbs={'@context':'https://schema.org','@type':'BreadcrumbList',itemListElement:[{'@type':'ListItem',position:1,name:'Home',item:'https://mradventuredad.com/'},{'@type':'ListItem',position:2,name:section,item:`https://mradventuredad.com/${sectionUrl}`},{'@type':'ListItem',position:3,name:p.title}]};
 h=h.replace('</head>',`<script type="application/ld+json">${JSON.stringify(crumbs)}</script></head>`);
 write(`guides/${p.slug}.html`,h);
}

function insert(path,needle,block){let h=read(path).replace(new RegExp(`${start}[\\s\\S]*?${end}`,'g'),'');if(!h.includes(needle))throw Error(path+': insertion marker missing');write(path,h.replace(needle,start+block+end+needle));}
const link=i=>`guides/${pages[i].slug}.html`,img=p=>`<img src="assets/images/photos/${p.image}" width="1600" height="900" style="height:auto;aspect-ratio:16/9;object-fit:contain" alt="${p.alt}" loading="lazy" decoding="async">`;

let home=read('index.html').replace(new RegExp(`${start}[\\s\\S]*?${end}`,'g'),'');
const priorPattern=/<!-- DAILY 2026-11-02 -->[\s\S]*?<!-- END DAILY 2026-11-02 -->/g,prior=home.match(priorPattern)?.[0];
home=home.replace(priorPattern,'');
if(prior)home=home.replace('<div class="field-archive-content">','<div class="field-archive-content">'+prior);
const options=[
 ['TONIGHT · 20 MINUTES · NO-SPEND',link(2),'Find one sky pattern, then go inside','Scout the backyard in daylight, choose one direction and stop before cold turns curiosity into a fight.'],
 ['WEEKEND · INDOOR HALF DAY',link(0),'Pick three Utica museum galleries','Use Build It Up, one choice gallery, The Cove and the Climber—with food and a clean exit between them.'],
 ['GEAR CHECK · BEFORE THE ICE',link(1),'Match traction to the surface','Compare low studs, coils and trail spikes only after the exact wearer, boot, manual and route pass.'],
 ['AT HOME · LOW ENERGY',link(2),'Use the five-minute window version','Find the Moon or one bright point from a safe window; no drive, telescope or perfect sky required.'],
 ['RAINY DAY · UTICA',link(0),'Use one gallery and The Cove','The short museum version is a complete visit when the highway, crowd or family energy shrinks the day.'],
 ['WEEKEND · OUTDOOR BACKUP','guides/labrador-hollow-boardwalk-with-kids.html','Bank a short boardwalk win','Use the 0.4-mile loop first and add only one stop if daylight, footing and patience still agree.']
];
const lead=`<section class="now-plans wrap" aria-labelledby="now-plans-title"><div class="now-plans-head"><div><p class="kicker">FRESH IDEAS · NOVEMBER 3, 2026</p><h2 id="now-plans-title">Pick the time you actually have.</h2><p>Use a 20-minute sky reset, a three-gallery indoor day, or a surface-first traction check. Dated weekend events stay in the separate weekly guide.</p></div><a href="adventures.html">Browse all adventures →</a></div><div class="now-plans-grid">${options.map(o=>`<article class="now-plan"><span>${o[0]}</span><h3><a href="${o[1]}">${o[2]}</a></h3><p>${o[3]}</p></article>`).join('')}</div></section>`;
if(!/<section class="now-plans wrap"[\s\S]*?<section class="intro wrap">/.test(home))throw Error('Homepage lead missing');
home=home.replace(/<section class="now-plans wrap"[\s\S]*?<section class="intro wrap">/,lead+'<section class="intro wrap">');
const cards=`${start}<section class="stories wrap"><div class="section-head"><div><p class="kicker">THREE DIFFERENT FAMILY NEEDS</p><h2>Play inside. Walk winter smarter. Look up.</h2></div></div><div class="story-grid">${pages.map((p,i)=>`<article class="story-card">${img(p)}<div><span>${['UTICA MUSEUM · CONCEPTUAL PLANNING IMAGE','WINTER TRACTION · GENERIC CATEGORY IMAGE','BACKYARD SKY · CONCEPTUAL NIGHT IMAGE'][i]}</span><h3><a href="${link(i)}">${p.title}</a></h3><p>${p.dek}</p></div></article>`).join('')}</div></section>${end}`;
home=home.replace('<details class="field-archive wrap">',cards+'<details class="field-archive wrap">');
write('index.html',home);

insert('adventures.html','<!-- MAD AFFILIATE COMMERCE -->',`<section class="content-section alt"><div class="wrap"><p class="kicker">INDOOR, WINTER OR ONE CLEAR PATCH OF SKY</p><div class="simple-list">${pages.map(p=>`<a href="guides/${p.slug}.html">${p.title} <b>→</b></a>`).join('')}</div></div></section>`);
insert('destinations.html','</main>',`<section class="content-section alt"><div class="wrap"><p class="kicker">UTICA · THREE GALLERIES, NOT SIX</p><div class="card-grid"><article class="card">${img(pages[0])}<div><span>INDOOR HALF DAY · CALM RESET INCLUDED</span><h3><a href="${link(0)}">Utica Children’s Museum with kids</a></h3><p>Choose three galleries, protect lunch and use The Cove before the Climber turns the whole day into an exit negotiation.</p></div></article></div></div></section>`);
insert('gear.html','</main>',`<section class="content-section alt"><div class="wrap"><p class="kicker">WINTER TRACTION · SURFACE BEFORE METAL</p><div class="card-grid"><article class="card">${img(pages[1])}<div><span>PAVEMENT STUDS · COILS · TRAIL SPIKES</span><h3><a href="${link(1)}">Family winter footwear traction</a></h3><p>Use the child-fit gate, exact boot and real route before comparing a single device.</p></div></article></div></div></section>`);
insert('outdoors.html','</main>',`<section class="content-section alt"><div class="wrap"><p class="kicker">ONE SAFE WINTER ROUTE · ONE SAFE SKY VIEW</p><div class="simple-list"><a href="${link(1)}">Match winter traction to the exact surface <b>→</b></a><a href="${link(2)}">Run the 20-minute backyard stargazing reset <b>→</b></a><a href="${link(0)}">Use the three-gallery indoor weather backup <b>→</b></a></div></div></section>`);

export const reciprocal={
 'guides/utica-zoo-with-kids.html':`<aside class="note"><strong>Need an indoor Utica plan instead?</strong> The <a href="${pages[0].slug}.html">three-gallery Utica Children’s Museum route</a> includes current hour checks, a calm reset and a clean exit.</aside>`,
 'guides/family-museum-day-system.html':`<aside class="note"><strong>Apply the museum system in Utica:</strong> the <a href="${pages[0].slug}.html">Utica Children’s Museum family plan</a> chooses three galleries and protects food, sensory regulation and departure.</aside>`,
 'guides/most-syracuse-with-kids.html':`<aside class="note"><strong>Comparing indoor drives?</strong> The <a href="${pages[0].slug}.html">Utica Children’s Museum plan</a> is a play-based three-gallery day with a disclosed Wednesday-hours conflict.</aside>`,
 'guides/kids-winter-boots-pac-snow-hiking-guide.html':`<aside class="note"><strong>When boots need more grip:</strong> use the <a href="${pages[1].slug}.html">studs, coils and trail-spikes framework</a> only after the exact boot and child pass the manufacturer gate.</aside>`,
 'guides/kids-snowshoes-molded-adjustable-frame-fit-guide.html':`<aside class="note"><strong>Traction device or snowshoe?</strong> The <a href="${pages[1].slug}.html">winter footwear-traction guide</a> separates hard-surface grip from deep-snow float and technical terrain.</aside>`,
 'guides/family-outdoor-weather-cutoff-plan.html':`<aside class="note"><strong>Ice is a route decision first:</strong> pair this cutoff with the <a href="${pages[1].slug}.html">family winter-traction child-fit gate</a>.</aside>`,
 'guides/seven-night-family-moon-observation-log.html':`<aside class="note"><strong>Need a shorter first night?</strong> Start with the <a href="${pages[2].slug}.html">20-minute family stargazing reset</a>, then begin the Moon log on a clear evening.</aside>`,
 'guides/family-headlamps-flashlights-lanterns.html':`<aside class="note"><strong>Use light without erasing the sky:</strong> the <a href="${pages[2].slug}.html">backyard stargazing reset</a> uses dim red chart light but switches to normal white light whenever safety needs it.</aside>`,
 'guides/family-binoculars-8x-vs-10x.html':`<aside class="note"><strong>Eyes first, optics second:</strong> the <a href="${pages[2].slug}.html">20-minute stargazing plan</a> finds one unaided-eye target before a stationary binocular fit check.</aside>`
};
for(const [path,block] of Object.entries(reciprocal))insert(path,'</main>',block);

for(const path of ['index.html','adventures.html','destinations.html','gear.html','outdoors.html'])write(path,read(path).replace(/href="assets\/css\/style\.css(?:\?v=\d+)?"/,'href="assets/css/style.css?v=20261103"'));

let map=read('sitemap.xml');
for(const p of pages)map=map.replace(new RegExp(`  <url><loc>https://mradventuredad\\.com/guides/${p.slug}\\.html</loc><lastmod>[^<]+</lastmod></url>\\n?`,'g'),'');
map=map.replace('</urlset>',pages.map(p=>`  <url><loc>https://mradventuredad.com/guides/${p.slug}.html</loc><lastmod>${date}</lastmod></url>`).join('\n')+'\n</urlset>');
write('sitemap.xml',map);

const credits=JSON.parse(read('assets/images/credits.json'));
credits['assets/images/photos/utica-childrens-museum-family-plan.webp']={title:'Conceptual children’s museum three-gallery planning scene',creator:'Mr Adventure Dad Editorial Desk with OpenAI image generation',source:'Original AI-assisted editorial photography',license:'Copyright Mr Adventure Dad',verified:date,notes:'Conceptual generic play-and-planning scene; explicitly not Utica Children’s Museum, its exhibits, layout, access, crowd or tickets. Not affiliate/product imagery.'};
credits['assets/images/photos/family-winter-traction-categories.webp']={title:'Generic winter footwear traction categories',creator:'Mr Adventure Dad Editorial Desk with OpenAI image generation',source:'Original AI-assisted editorial photography',license:'Copyright Mr Adventure Dad',verified:date,notes:'Unbranded low-stud, coil and chain-and-spike category forms; not exact products, affiliate images, testing, sizing proof, certification or slip-prevention guarantees.'};
credits['assets/images/photos/family-stargazing-reset.webp']={title:'Conceptual family backyard stargazing reset',creator:'Mr Adventure Dad Editorial Desk with OpenAI image generation',source:'Original AI-assisted editorial photography',license:'Copyright Mr Adventure Dad',verified:date,notes:'Conceptual safe-yard scene; stars are illustrative and not a date-specific chart, navigation aid, named place, weather report or astronomical record. Not affiliate/product imagery.'};
write('assets/images/credits.json',JSON.stringify(credits,null,2)+'\n');

insert('photo-credits.html','</section><h2>Additional editorial photography</h2>',pages.map((p,i)=>`<article class="photo-credit-card"><img src="assets/images/photos/${p.image}" alt="${p.alt}" loading="lazy" decoding="async"><div><h2>${['Children’s museum planning still life','Winter footwear traction categories','Family backyard stargazing reset'][i]}</h2><p>Original AI-assisted editorial photograph created for Mr Adventure Dad.</p><p>${['Conceptual only; not Utica Children’s Museum, a real exhibit, current layout or access evidence.','Generic unbranded categories; not exact products, affiliate imagery, tests, fit proof, certification or slip guarantee.','Conceptual only; the stars are not a current chart, navigation aid, named-place view or weather evidence.'][i]}</p></div></article>`).join(''));

write('reports/editorial-decision-2026-11-03.md',`# Editorial decision record — November 3, 2026

## Inventory and duplication gate

The complete November 2 production inventory contained 203 HTML documents before this batch. Titles, slugs, headings, descriptions, primary intent, locations, trip angles, commercial categories, image sources and the previous fourteen days were checked. The separate October 31–November 1 weekend roundup remains the current dated event page and was not duplicated. No November 3 trio existed. Utica Children’s Museum appeared only as a one-line event mention in an expired September roundup; no evergreen destination guide existed. Footwear traction is distinct from winter boots, snowshoes and snow tools. The stargazing reset is a single-evening orientation plan, not the existing seven-night Moon log.

## Search Console decision

The private report was generated October 28, 2026 for September 28 through October 25—six days old and within the eight-day gate. MrAdventureDad.com recorded 711 impressions, 7 clicks, 0.98% CTR and average position 17.96. Zero-click hub signals for Adventures (15 impressions, position 7.7), Destinations (9, 13.9) and Gear (10, 13.9) supported a diverse batch with stronger homepage, hub, sitemap and reciprocal discovery. Howe Caverns (81 impressions), folding wagons (27), camping sleep (9) and travel bags (8) already have dedicated pages and recent support, so another derivative was rejected. One- and two-impression query fragments were ignored as too weak.

## Portfolio labels

- **Authority-expansion — Utica Children’s Museum With Kids:** a distinct indoor Central New York destination plan that discloses the official Wednesday-hours conflict and turns six galleries into a finishable three-gallery route.
- **Authority-expansion — Family Winter Footwear Traction:** a commercial, primary-source comparison with a manufacturer-specific child-fit gate rather than another winter-boot or snowshoe page.
- **Exploration — 20-Minute Family Stargazing Reset:** a no-spend school-night plan using one safe direction and one pattern, with no telescope or event dependency.

No item is labeled primarily Data-led because the credible report supports hubs, not a new uncovered query. The batch still uses that signal by strengthening all three relevant hubs and reciprocal crawl paths without fabricating keyword demand.

## Authority action

The batch creates three citation-ready assets: a three-gallery museum route with source-conflict disclosure, a winter-traction child-fit decision gate that contrasts manufacturer limits, and a one-direction stargazing card grounded in NASA guidance. Nine established guides now link back; the homepage, four hubs, sitemap, image-credit record and primary-source notes strengthen discovery and trust.

## Image gate before publication

Three unique 1600×900 editorial images were visually inspected against final title, body, caption, alt, credit and linked subject. The museum and stargazing images are explicitly conceptual; the traction image shows generic unbranded categories. There are zero affiliate/product images. A second rendered live pass remains required after deployment.
`);
write('reports/image-qa-2026-11-03.md',`# Image QA — November 3, 2026

## Pass 1: final assets

- Utica museum guide: final 1600×900 conceptual planning image visually checked; it shows generic play materials, a blank route card, lunch gear and hearing earmuffs and is explicitly not the named museum or current conditions.
- Winter traction guide: final 1600×900 generic category image visually checked; it shows three distinct unbranded traction forms with shoes, boots, measuring tape and inspection card and makes no exact-product or performance claim.
- Stargazing guide: final 1600×900 conceptual backyard image visually checked; it shows an adult and school-age child inside a fenced yard with a dim red light; the sky is explicitly illustrative, not a chart.
- Affiliate/product images: 0.

## Pass 2: live rendered

- Pending deployment.
`);
if(!read('reports/search-console-editorial-log.md').includes('# 2026-11-03'))appendFileSync(resolve(root,'reports/search-console-editorial-log.md'),`
# 2026-11-03

- Report generated: 2026-10-28; window 2026-09-28 through 2026-10-25; age six days.
- Used: 711 impressions, 7 clicks, 0.98% CTR and position 17.96, plus zero-click Adventures (15 / 7.7), Destinations (9 / 13.9) and Gear (10 / 13.9), to strengthen all three hubs, homepage, sitemap and nine reciprocal links.
- Deliberately not chased: Howe Caverns (81 impressions), folding wagons (27), camping sleep (9) and travel bags (8) already have dedicated pages and recent support; another derivative risked cannibalization.
- Ignored as weak: one- and two-impression query fragments and unrelated/branded noise.
- Portfolio: two authority-expansion items and one exploration; no page labeled Data-led because the usable signal was hub-level rather than an uncovered query.
`);
let auth=read('reports/authority-opportunities.md');
if(!auth.includes('## 2026-11-03'))auth+=`
## 2026-11-03

- **Utica Children’s Museum** — https://www.uticachildrensmuseum.org/contact/ — factual-correction and family-planning review for the independent three-gallery route and disclosed Wednesday-hours conflict; no endorsement implied.
- **NYS DEC Hike Smart NY** — https://dec.ny.gov/things-to-do/hiking/hike-smart-ny — consumer-education angle for the child-fit winter-traction decision gate grounded in DEC winter guidance and current manufacturer manuals.
- **NASA Night Sky Network** — https://nightsky.jpl.nasa.gov/ — family-outreach angle for the no-spend one-direction stargazing card grounded in NASA site-scouting and Polaris guidance.

No outreach, submission, account creation or paid placement was performed.
`;
write('reports/authority-opportunities.md',auth);
console.log('Generated exactly three November 3 guides, homepage time windows, four hubs, nine reciprocal links, sitemap, credits and authority records.');
