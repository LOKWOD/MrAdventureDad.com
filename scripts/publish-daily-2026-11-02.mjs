import {appendFileSync,readFileSync,writeFileSync} from 'node:fs';
import {resolve} from 'node:path';
import {pages} from './content-2026-11-02.mjs';

const root=resolve(process.argv[2]||'.'),date='2026-11-02',start='<!-- DAILY 2026-11-02 -->',end='<!-- END DAILY 2026-11-02 -->';
const read=p=>readFileSync(resolve(root,p),'utf8'),write=(p,s)=>writeFileSync(resolve(root,p),s);
if(pages.length!==3)throw Error('Exactly three November 2 sources required');
const template=read('scripts/publish-daily-2026-10-17.mjs').match(/const pageHtml=p=>(`[\s\S]*?`);\n\nfor\(const p of pages\)/)?.[1];
if(!template)throw Error('Versioned renderer changed');
const render=new Function('date','imageUrl',`return p=>${template}`)(date,n=>`https://mradventuredad.com/assets/images/photos/${n}`);
for(const p of pages){
 let h=render(p).replaceAll('v=20261017','v=20261102').replace(`src="../assets/images/photos/${p.image}"`,`src="../assets/images/photos/${p.image}" width="1600" height="900" style="height:auto"`);
 h=h.replace('<meta name="twitter:card"',`<meta property="og:image:width" content="1600"><meta property="og:image:height" content="900"><meta property="og:image:alt" content="${p.alt}"><meta name="twitter:image:alt" content="${p.alt}"><meta name="twitter:card"`);
 const section=p.slug.startsWith('family-car-')?'Gear':p.slug.startsWith('labrador-')?'Destinations':'Adventures';
 const sectionUrl=section==='Gear'?'gear.html':section==='Destinations'?'destinations.html':'adventures.html';
 const crumbs={'@context':'https://schema.org','@type':'BreadcrumbList',itemListElement:[{'@type':'ListItem',position:1,name:'Home',item:'https://mradventuredad.com/'},{'@type':'ListItem',position:2,name:section,item:`https://mradventuredad.com/${sectionUrl}`},{'@type':'ListItem',position:3,name:p.title}]};
 h=h.replace('</head>',`<script type="application/ld+json">${JSON.stringify(crumbs)}</script></head>`);
 write(`guides/${p.slug}.html`,h);
}
function insert(path,needle,block){let h=read(path).replace(new RegExp(`${start}[\\s\\S]*?${end}`,'g'),'');if(!h.includes(needle))throw Error(path+': insertion marker missing');write(path,h.replace(needle,start+block+end+needle));}
const link=i=>`guides/${pages[i].slug}.html`,img=p=>`<img src="assets/images/photos/${p.image}" width="1600" height="900" style="height:auto;aspect-ratio:16/9;object-fit:contain" alt="${p.alt}" loading="lazy" decoding="async">`;

let home=read('index.html').replace(new RegExp(`${start}[\\s\\S]*?${end}`,'g'),'');
const priorPattern=/<!-- DAILY 2026-11-01 -->[\s\S]*?<!-- END DAILY 2026-11-01 -->/g,prior=home.match(priorPattern)?.[0];
home=home.replace(priorPattern,'');
if(prior)home=home.replace('<div class="field-archive-content">','<div class="field-archive-content">'+prior);
const options=[
 ['TONIGHT · 20 MINUTES · NO-SPEND',link(2),'Map the utilities without touching them','Kids mark exits and contacts. Adults identify controls. Nobody operates gas or electrical equipment for practice.'],
 ['WEEKEND · SOUTH OF SYRACUSE',link(0),'Walk Labrador Hollow boardwalk first','Bank the 0.4-mile loop, then choose Tinker Falls or the viewing pier—never both by default.'],
 ['CAR RESET · 15 MINUTES',link(1),'Run the hard-brake cargo test','Measure the real vehicle, preserve emergency access and secure the load through approved points.'],
 ['AT HOME · LOW ENERGY',link(2),'Draw exits and one meeting place','Use the five-minute utility-map version when the whole walk-through is too much.'],
 ['HALF DAY · NATURE',link(0),'Take the boardwalk-only win','Bring one snack and binoculars; leave when the short route is still fun.'],
 ['RAINY DAY · INDOOR BACKUP','guides/family-library-night-45-minute-plan.html','Use the 45-minute library plan','Pick one section, one shared read and one checkout rule when wet trails cancel the drive.']
];
const lead=`<section class="now-plans wrap" aria-labelledby="now-plans-title"><div class="now-plans-head"><div><p class="kicker">FRESH IDEAS · NOVEMBER 2, 2026</p><h2 id="now-plans-title">Pick the time you actually have.</h2><p>Bank a short boardwalk, fix the car-cargo system, or draw a calm no-spend utility map. Dated weekend events stay in the separate weekly guide.</p></div><a href="adventures.html">Browse all adventures →</a></div><div class="now-plans-grid">${options.map(o=>`<article class="now-plan"><span>${o[0]}</span><h3><a href="${o[1]}">${o[2]}</a></h3><p>${o[3]}</p></article>`).join('')}</div></section>`;
if(!/<section class="now-plans wrap"[\s\S]*?<section class="intro wrap">/.test(home))throw Error('Homepage lead missing');
home=home.replace(/<section class="now-plans wrap"[\s\S]*?<section class="intro wrap">/,lead+'<section class="intro wrap">');
const cards=`${start}<section class="stories wrap"><div class="section-head"><div><p class="kicker">THREE DIFFERENT FAMILY PROBLEMS</p><h2>Walk short. Pack safer. Map the house.</h2></div></div><div class="story-grid">${pages.map((p,i)=>`<article class="story-card">${img(p)}<div><span>${['LABRADOR HOLLOW · CONCEPTUAL TRIP-PLANNING IMAGE','CAR CARGO · GENERIC CATEGORY IMAGE','AT HOME · CONCEPTUAL MAP IMAGE'][i]}</span><h3><a href="${link(i)}">${p.title}</a></h3><p>${p.dek}</p></div></article>`).join('')}</div></section>${end}`;
home=home.replace('<details class="field-archive wrap">',cards+'<details class="field-archive wrap">');
write('index.html',home);

insert('adventures.html','<!-- MAD AFFILIATE COMMERCE -->',`<section class="content-section alt"><div class="wrap"><p class="kicker">THREE DIFFERENT FAMILY NEEDS</p><div class="simple-list">${pages.map(p=>`<a href="guides/${p.slug}.html">${p.title} <b>→</b></a>`).join('')}</div></div></section>`);
insert('destinations.html','</main>',`<section class="content-section alt"><div class="wrap"><p class="kicker">CENTRAL NEW YORK · BOARDWALK FIRST</p><div class="card-grid"><article class="card">${img(pages[0])}<div><span>0.4-MILE LOOP · ONE OPTIONAL ADD-ON</span><h3><a href="${link(0)}">Labrador Hollow with kids</a></h3><p>Use the pond boardwalk as the guaranteed win, then choose Tinker Falls or the viewing pier only if the family earns it.</p></div></article></div></div></section>`);
insert('gear.html','</main>',`<section class="content-section alt"><div class="wrap"><p class="kicker">CAR CARGO · ORGANIZE, THEN SECURE</p><div class="card-grid"><article class="card">${img(pages[1])}<div><span>SOFT TOTE · FOLDING BOX · LIDDED BIN</span><h3><a href="${link(1)}">Family car cargo organizers</a></h3><p>Measure the real vehicle, protect emergency access and apply the parked hard-brake test before buying a container.</p></div></article></div></div></section>`);
insert('outdoors.html','</main>',`<section class="content-section alt"><div class="wrap"><p class="kicker">OUTSIDE, IN THE CAR OR AT HOME</p><div class="simple-list"><a href="${link(0)}">Walk the Labrador Hollow boardwalk first <b>→</b></a><a href="${link(1)}">Choose and secure a family car cargo organizer <b>→</b></a><a href="${link(2)}">Draw the adults-operate home utility map <b>→</b></a></div></div></section>`);

export const reciprocal={
 'guides/central-new-york-family-trail-picker.html':`<aside class="note"><strong>Apply the route gate to a real stop:</strong> the <a href="${pages[0].slug}.html">Labrador Hollow boardwalk-first plan</a> banks a 0.4-mile win before one optional add-on.</aside>`,
 'guides/family-outdoor-weather-cutoff-plan.html':`<aside class="note"><strong>Use the cutoff on a boardwalk day:</strong> pair it with the <a href="${pages[0].slug}.html">Labrador Hollow family plan</a> for the short route, restroom check and winter stop rule.</aside>`,
 'guides/family-binoculars-8x-vs-10x.html':`<aside class="note"><strong>Take the fit test outside:</strong> use the binoculars on the <a href="${pages[0].slug}.html">Labrador Hollow boardwalk-first plan</a> without stepping off the route for a sighting.</aside>`,
 'guides/road-trip-packing-system.html':`<aside class="note"><strong>Make the load behave:</strong> use the <a href="${pages[1].slug}.html">soft-tote, folding-box and lidded-bin cargo guide</a> after the packing list is honest.</aside>`,
 'guides/winter-car-adventure-kit.html':`<aside class="note"><strong>Keep this kit reachable:</strong> the <a href="${pages[1].slug}.html">family car cargo organizer guide</a> protects emergency access and adds a parked hard-brake test.</aside>`,
 'guides/family-roadside-breakdown-plan.html':`<aside class="note"><strong>Do not bury the roadside system:</strong> pair it with the <a href="${pages[1].slug}.html">car cargo organizer decision framework</a>.</aside>`,
 'guides/family-power-outage-drill-20-minutes.html':`<aside class="note"><strong>Map before the outage drill:</strong> the <a href="${pages[2].slug}.html">20-minute home utility map</a> marks exits and adult-only locations without operating equipment.</aside>`,
 'guides/family-home-fire-escape-drill-20-minute-plan.html':`<aside class="note"><strong>Add the household systems layer:</strong> the <a href="${pages[2].slug}.html">adults-operate utility map</a> keeps exits primary and utilities hands-off for kids.</aside>`,
 'guides/family-emergency-contact-card-drill-20-minutes.html':`<aside class="note"><strong>Connect the card to the house:</strong> the <a href="${pages[2].slug}.html">family utility map</a> adds the meeting place and utility contacts without publishing private details.</aside>`
};
for(const [path,block] of Object.entries(reciprocal))insert(path,'</main>',block);

for(const path of ['index.html','adventures.html','destinations.html','gear.html','outdoors.html'])write(path,read(path).replace(/href="assets\/css\/style\.css(?:\?v=\d+)?"/,'href="assets/css/style.css?v=20261102"'));

let map=read('sitemap.xml');
for(const p of pages)map=map.replace(new RegExp(`  <url><loc>https://mradventuredad\\.com/guides/${p.slug}\\.html</loc><lastmod>[^<]+</lastmod></url>\\n?`,'g'),'');
map=map.replace('</urlset>',pages.map(p=>`  <url><loc>https://mradventuredad.com/guides/${p.slug}.html</loc><lastmod>${date}</lastmod></url>`).join('\n')+'\n</urlset>');
write('sitemap.xml',map);

const credits=JSON.parse(read('assets/images/credits.json'));
credits['assets/images/photos/labrador-hollow-boardwalk-plan.webp']={title:'Conceptual Labrador Hollow family nature-walk planning still life',creator:'Mr Adventure Dad Editorial Desk with OpenAI image generation',source:'Original AI-assisted editorial photography',license:'Copyright Mr Adventure Dad',verified:date,notes:'Conceptual generic pond-side family planning scene; explicitly not Labrador Hollow, its boardwalk, Tinker Falls, fishing pier, current access or conditions. Not affiliate/product imagery.'};
credits['assets/images/photos/family-car-cargo-organizer-categories.webp']={title:'Generic family car cargo organizer categories',creator:'Mr Adventure Dad Editorial Desk with OpenAI image generation',source:'Original AI-assisted editorial photography',license:'Copyright Mr Adventure Dad',verified:date,notes:'Unbranded soft tote, folding divided box and lidded bin categories; not exact products, testing, crash performance, capacity or vehicle fit. Not affiliate/product imagery.'};
credits['assets/images/photos/family-home-utility-map.webp']={title:'Conceptual family home-utility map activity',creator:'Mr Adventure Dad Editorial Desk with OpenAI image generation',source:'Original AI-assisted editorial photography',license:'Copyright Mr Adventure Dad',verified:date,notes:'Conceptual adult-and-child mapping activity; no actual utility hardware, operating procedure, address, private detail or emergency. Not affiliate/product imagery.'};
write('assets/images/credits.json',JSON.stringify(credits,null,2)+'\n');

insert('photo-credits.html','</section><h2>Additional editorial photography</h2>',pages.map((p,i)=>`<article class="photo-credit-card"><img src="assets/images/photos/${p.image}" alt="${p.alt}" loading="lazy" decoding="async"><div><h2>${['Labrador Hollow planning still life','Family car cargo organizer categories','Family home-utility map activity'][i]}</h2><p>Original AI-assisted editorial photograph created for Mr Adventure Dad.</p><p>${['Conceptual only; not Labrador Hollow, its boardwalk, waterfall, pier, access or current conditions.','Generic unbranded categories; not affiliate imagery, exact products, testing, crash performance, capacity or vehicle fit.','Conceptual map activity; no real utility equipment, operating instruction, address, private detail or emergency.'][i]}</p></div></article>`).join(''));

write('reports/editorial-decision-2026-11-02.md',`# Editorial decision record — November 2, 2026

## Inventory and duplication gate

The complete November 1 production inventory contained 200 HTML documents before this batch. Titles, slugs, locations, trip angles, primary intent, commercial categories, images, the previous fourteen days and the separate October 31–November 1 weekend roundup were checked. No November 2 trio existed. Labrador Hollow had no dedicated guide; the cargo page solves vehicle organization and load access rather than duplicating travel bags, roof cargo or packing cubes; the utility map is a location-and-contact exercise, not the existing simulated outage drill.

## Search Console decision

The private report was generated October 28, 2026 for September 28 through October 25. MrAdventureDad.com recorded 711 impressions, 7 clicks, 0.98% CTR and average position 17.96. Zero-click hub signals for Adventures (15 impressions, position 7.7), Destinations (9, 13.9) and Gear (10, 13.9) supported stronger homepage, hub, sitemap and reciprocal discovery. Howe Caverns (81 impressions), folding wagons (27), camping sleep (9) and travel bags (8) already have established pages and recent support; another derivative page would risk cannibalization. One- and two-impression fragments were ignored as too weak.

## Portfolio labels

- **Authority-expansion — Labrador Hollow With Kids:** a distinct Central New York boardwalk-first destination plan using the current DEC route, parking, access and hunting-zone facts.
- **Authority-expansion — Family Car Cargo Organizers:** a commercial but safety-first framework for three container types, measured vehicle fit and a parked hard-brake test.
- **Exploration — Family Home-Utility Map:** a no-spend, adults-operate home system distinct from the existing outage drill.

## Authority action

The batch creates three citation-ready assets: a three-parking-area Labrador Hollow decision route, a six-measurement cargo framework, and a four-color home-utility map with explicit adult/professional boundaries. Nine established guides now link back, while the current homepage, four hubs, sitemap and source notes strengthen discovery and trust.

## Image gate before publication

Three original editorial images were visually inspected at final 1600×900 dimensions against title, copy, caption, alt and credits. All are explicitly conceptual or generic. There are zero affiliate/product images. A second rendered live pass remains required after deployment.
`);
write('reports/image-qa-2026-11-02.md',`# Image QA — November 2, 2026

## Pass 1: final assets

- Labrador Hollow page: final 1600×900 conceptual planning image visually checked; it shows generic family nature-walk gear beside a pond and is explicitly not the named place or current conditions.
- Car-cargo page: final 1600×900 generic category image visually checked; it shows an unbranded soft tote, folding divided box and lidded bin without exact product, capacity, crash or fit claims.
- Home-utility page: final 1600×900 conceptual mapping image visually checked; it shows hands, a blank house outline, color tags, flashlight and phone, with no real equipment or operating instruction.
- Affiliate/product images: 0.

## Pass 2: live rendered

- Pending deployment.
`);
if(!read('reports/search-console-editorial-log.md').includes('# 2026-11-02'))appendFileSync(resolve(root,'reports/search-console-editorial-log.md'),`
# 2026-11-02

- Report generated: 2026-10-28; window 2026-09-28 through 2026-10-25.
- Used: 711 impressions, 7 clicks, 0.98% CTR and position 17.96, plus zero-click Adventures (15 / 7.7), Destinations (9 / 13.9) and Gear (10 / 13.9), to strengthen discovery through the homepage, four hubs, sitemap and nine reciprocal links.
- Deliberately not chased: Howe Caverns (81 impressions), folding wagons (27), camping sleep (9) and travel bags (8) already have established pages and recent support; another derivative page risked cannibalization.
- Ignored as weak: one- and two-impression query fragments.
- Portfolio: two authority-expansion items and one exploration; no derivative data-led page and no overlap with the October 31–November 1 roundup.
`);
let auth=read('reports/authority-opportunities.md');
if(!auth.includes('## 2026-11-02'))auth+=`
## 2026-11-02

- **NYS DEC Region 7 / Labrador Hollow Unique Area** — https://dec.ny.gov/places/labrador-hollow-unique-area — factual-correction and accessible-route review for the independent boardwalk-first family plan; no endorsement implied.
- **National Highway Traffic Safety Administration** — https://www.nhtsa.gov/contact — consumer-education angle for the six-measurement cargo framework and parked hard-brake test grounded in Secure Your Load guidance.
- **American Red Cross, Central & Northern New York** — https://www.redcross.org/local/new-york/central-and-northern-new-york.html — preparedness-resource angle for the four-color, adults-operate family utility map grounded in Red Cross utility guidance.

No outreach, submission, account creation or paid placement was performed.
`;
write('reports/authority-opportunities.md',auth);
console.log('Generated exactly three November 2 guides, homepage time windows, four hubs, nine reciprocal links, sitemap, credits and authority records.');
