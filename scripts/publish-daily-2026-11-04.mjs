import {appendFileSync,readFileSync,writeFileSync} from 'node:fs';
import {resolve} from 'node:path';
import {pages} from './content-2026-11-04.mjs';

const root=resolve(process.argv[2]||'.'),date='2026-11-04',start='<!-- DAILY 2026-11-04 -->',end='<!-- END DAILY 2026-11-04 -->';
const read=p=>readFileSync(resolve(root,p),'utf8'),write=(p,s)=>writeFileSync(resolve(root,p),s);
if(pages.length!==3)throw Error('Exactly three November 4 sources required');

const template=read('scripts/publish-daily-2026-10-17.mjs').match(/const pageHtml=p=>(`[\s\S]*?`);\n\nfor\(const p of pages\)/)?.[1];
if(!template)throw Error('Versioned renderer changed');
const render=new Function('date','imageUrl',`return p=>${template}`)(date,n=>`https://mradventuredad.com/assets/images/photos/${n}`);
for(const [i,p] of pages.entries()){
 let h=render(p).replaceAll('v=20261017','v=20261104').replace(`src="../assets/images/photos/${p.image}"`,`src="../assets/images/photos/${p.image}" width="1600" height="900" style="height:auto"`);
 h=h.replace('<meta name="twitter:card"',`<meta property="og:image:width" content="1600"><meta property="og:image:height" content="900"><meta property="og:image:alt" content="${p.alt}"><meta name="twitter:image:alt" content="${p.alt}"><meta name="twitter:card"`);
 const section=['Destinations','Gear','Adventures'][i],sectionUrl=['destinations.html','gear.html','adventures.html'][i];
 const crumbs={'@context':'https://schema.org','@type':'BreadcrumbList',itemListElement:[{'@type':'ListItem',position:1,name:'Home',item:'https://mradventuredad.com/'},{'@type':'ListItem',position:2,name:section,item:`https://mradventuredad.com/${sectionUrl}`},{'@type':'ListItem',position:3,name:p.title}]};
 h=h.replace('</head>',`<script type="application/ld+json">${JSON.stringify(crumbs)}</script></head>`);
 write(`guides/${p.slug}.html`,h);
}

function insert(path,needle,block){let h=read(path).replace(new RegExp(`${start}[\\s\\S]*?${end}`,'g'),'');if(!h.includes(needle))throw Error(path+': insertion marker missing');write(path,h.replace(needle,start+block+end+needle));}
const link=i=>`guides/${pages[i].slug}.html`,img=p=>`<img src="assets/images/photos/${p.image}" width="1600" height="900" style="height:auto;aspect-ratio:16/9;object-fit:contain" alt="${p.alt}" loading="lazy" decoding="async">`;

let home=read('index.html').replace(new RegExp(`${start}[\\s\\S]*?${end}`,'g'),'');
home=home.replace(/<section class="stories" id="october-family-plans">[\s\S]*?(?=<section class="now-plans wrap")/,'');
const priorPattern=/<!-- DAILY 2026-11-03 -->[\s\S]*?<!-- END DAILY 2026-11-03 -->/g,prior=home.match(priorPattern)?.[0];
home=home.replace(priorPattern,'');
if(prior)home=home.replace('<div class="field-archive-content">','<div class="field-archive-content">'+prior);
const options=[
 ['TONIGHT · 30 MINUTES · NO-SPEND',link(2),'Open a three-object mini museum','Use three ordinary objects, honest labels and a two-minute family tour—then put everything away.'],
 ['WEEKEND · CURRENT EVENTS','weekend-november-7-8-2026.html','Use the November 7–8 family guide','The separate Wednesday roundup owns current event dates, tickets and schedules; today’s evergreen pages do not compete.'],
 ['WEEKEND · ONE-HOUR LOCAL WALK',link(0),'Start the Creekwalk at Inner Harbor','Check flood closures, walk out for 30 minutes and use the same known route back before dusk.'],
 ['GEAR CHECK · BEFORE ROAD SALT',link(1),'Run the floor-mat pedal gate','Read the exact vehicle manual, use every retention point, never stack coverings and reject uncertain clearance.'],
 ['AT HOME · LOW ENERGY',link(2),'Make one label, not three','Choose one safe object and write only what you notice, know and still want to ask.'],
 ['RAIN OR ICE · INDOOR BACKUP','guides/most-syracuse-with-kids.html','Use the MOST two-zone plan','Swap the urban walk for a verified indoor route when closures, ice or daylight make the trail a bad call.']
];
const lead=`<section class="now-plans wrap" aria-labelledby="now-plans-title"><div class="now-plans-head"><div><p class="kicker">FRESH IDEAS · NOVEMBER 4, 2026</p><h2 id="now-plans-title">Pick the time you actually have.</h2><p>Use a 30-minute home museum, a one-hour Creekwalk or a manual-first winter car check. The separate November 7–8 guide owns this week’s events.</p></div><a href="adventures.html">Browse all adventures →</a></div><div class="now-plans-grid">${options.map(o=>`<article class="now-plan"><span>${o[0]}</span><h3><a href="${o[1]}">${o[2]}</a></h3><p>${o[3]}</p></article>`).join('')}</div></section>`;
if(!/<section class="now-plans wrap"[\s\S]*?<section class="intro wrap">/.test(home))throw Error('Homepage lead missing');
home=home.replace(/<section class="now-plans wrap"[\s\S]*?<section class="intro wrap">/,lead+'<section class="intro wrap">');
const cards=`${start}<section class="stories wrap"><div class="section-head"><div><p class="kicker">THREE DIFFERENT FAMILY NEEDS</p><h2>Walk local. Protect the pedals. Curate three objects.</h2></div></div><div class="story-grid">${pages.map((p,i)=>`<article class="story-card">${img(p)}<div><span>${['SYRACUSE CREEKWALK · CONCEPTUAL PLANNING IMAGE','WINTER CAR · GENERIC CATEGORY IMAGE','AT HOME · CONCEPTUAL ACTIVITY IMAGE'][i]}</span><h3><a href="${link(i)}">${p.title}</a></h3><p>${p.dek}</p></div></article>`).join('')}</div></section>${end}`;
home=home.replace('<details class="field-archive wrap">',cards+'<details class="field-archive wrap">');
write('index.html',home);

insert('adventures.html','<!-- MAD AFFILIATE COMMERCE -->',`<section class="content-section alt"><div class="wrap"><p class="kicker">ONE LOCAL WALK · ONE CAR FIT GATE · ONE HOME MUSEUM</p><div class="simple-list">${pages.map(p=>`<a href="guides/${p.slug}.html">${p.title} <b>→</b></a>`).join('')}</div></div></section>`);
insert('destinations.html','</main>',`<section class="content-section alt"><div class="wrap"><p class="kicker">SYRACUSE · ONE-HOUR URBAN WALK</p><div class="card-grid"><article class="card">${img(pages[0])}<div><span>INNER HARBOR · 30-MINUTE TURNAROUND</span><h3><a href="${link(0)}">Onondaga Creekwalk with kids</a></h3><p>Use an official access point, check the flood-closure feed and protect the return with a hard turnaround.</p></div></article></div></div></section>`);
insert('gear.html','</main>',`<section class="content-section alt"><div class="wrap"><p class="kicker">WINTER CAR · THE DRIVER FOOTWELL IS DIFFERENT</p><div class="card-grid"><article class="card">${img(pages[1])}<div><span>VEHICLE-SPECIFIC LINER · MAT · BOOT TRAY</span><h3><a href="${link(1)}">Family winter car floor protection</a></h3><p>Compare categories only after the exact owner manual, retention system and full pedal path pass.</p></div></article></div></div></section>`);
insert('outdoors.html','</main>',`<section class="content-section alt"><div class="wrap"><p class="kicker">URBAN TRAIL · CHECK THE CLOSURE FIRST</p><div class="simple-list"><a href="${link(0)}">Walk the Onondaga Creekwalk from Inner Harbor <b>→</b></a><a href="guides/family-walking-visibility-gear-reflective-vest-bands-clip-light.html">Use visibility gear without mistaking it for right-of-way <b>→</b></a><a href="guides/family-outdoor-weather-cutoff-plan.html">Make the weather cutoff before loading the car <b>→</b></a></div></div></section>`);

export const reciprocal={
 'guides/onondaga-lake-park-with-kids.html':`<aside class="note"><strong>Want a shorter Syracuse water walk?</strong> The <a href="${pages[0].slug}.html">Inner Harbor Creekwalk plan</a> uses a 30-minute turnaround and live flood-closure check.</aside>`,
 'guides/family-walking-visibility-gear-reflective-vest-bands-clip-light.html':`<aside class="note"><strong>Put the visibility gate on a real route:</strong> the <a href="${pages[0].slug}.html">Onondaga Creekwalk family plan</a> adds road crossings, daylight and flood-closure checks.</aside>`,
 'guides/after-school-nature-walk-30-minute-plan.html':`<aside class="note"><strong>Ready for a paved urban version?</strong> Use the <a href="${pages[0].slug}.html">Inner Harbor Creekwalk out-and-back</a> with a hard 30-minute turnaround.</aside>`,
 'guides/winter-car-adventure-kit.html':`<aside class="note"><strong>Protect the footwell without adding risk:</strong> the <a href="${pages[1].slug}.html">winter floor-mat pedal gate</a> starts with the exact vehicle manual and retention system.</aside>`,
 'guides/family-car-cargo-organizers-tote-folding-box-lidded-bin-guide.html':`<aside class="note"><strong>Contain the slush separately:</strong> pair the cargo zones with the <a href="${pages[1].slug}.html">liner, mat and boot-tray fit guide</a>.</aside>`,
 'guides/family-car-snow-removal-tools-scraper-brush-foam-guide.html':`<aside class="note"><strong>After clearing the outside:</strong> use the <a href="${pages[1].slug}.html">winter floor-protection pedal gate</a> before meltwater reaches the driver footwell.</aside>`,
 'guides/family-museum-day-system.html':`<aside class="note"><strong>Practice museum thinking at home:</strong> the <a href="${pages[2].slug}.html">three-object mini museum</a> uses honest labels and a two-minute tour.</aside>`,
 'guides/family-oral-history-interview-30-minute-no-posting-plan.html':`<aside class="note"><strong>Give one remembered object a careful label:</strong> the <a href="${pages[2].slug}.html">family mini-museum activity</a> separates observation, memory, source and unknown.</aside>`,
 'guides/family-library-night-45-minute-plan.html':`<aside class="note"><strong>Start with an object question:</strong> build the <a href="${pages[2].slug}.html">30-minute mini museum</a>, then use one unanswered label as the library search.</aside>`
};
for(const [path,block] of Object.entries(reciprocal))insert(path,'</main>',block);

for(const path of ['index.html','adventures.html','destinations.html','gear.html','outdoors.html'])write(path,read(path).replace(/href="assets\/css\/style\.css(?:\?v=\d+)?"/,'href="assets/css/style.css?v=20261104"'));

let map=read('sitemap.xml');
for(const p of pages)map=map.replace(new RegExp(`  <url><loc>https://mradventuredad\\.com/guides/${p.slug}\\.html</loc><lastmod>[^<]+</lastmod></url>\\n?`,'g'),'');
map=map.replace('</urlset>',pages.map(p=>`  <url><loc>https://mradventuredad.com/guides/${p.slug}.html</loc><lastmod>${date}</lastmod></url>`).join('\n')+'\n</urlset>');
write('sitemap.xml',map);

const credits=JSON.parse(read('assets/images/credits.json'));
credits['assets/images/photos/onondaga-creekwalk-family-plan.webp']={title:'Conceptual Onondaga Creekwalk family planning still life',creator:'Mr Adventure Dad Editorial Desk with OpenAI image generation',source:'Original AI-assisted editorial photography',license:'Copyright Mr Adventure Dad',verified:date,notes:'Generic paved creekside path and family walk gear; explicitly not Onondaga Creekwalk, Inner Harbor, a Syracuse landmark, current access, conditions or maintenance. Not affiliate/product imagery.'};
credits['assets/images/photos/family-winter-car-floor-mat-categories.webp']={title:'Generic winter car floor-protection categories',creator:'Mr Adventure Dad Editorial Desk with OpenAI image generation',source:'Original AI-assisted editorial photography',license:'Copyright Mr Adventure Dad',verified:date,notes:'Unbranded molded liner, flat mat and removable tray categories; not exact products, driver installation, vehicle fit, pedal clearance, testing or certification. Not affiliate/product imagery.'};
credits['assets/images/photos/family-three-object-mini-museum.webp']={title:'Conceptual three-object family mini museum',creator:'Mr Adventure Dad Editorial Desk with OpenAI image generation',source:'Original AI-assisted editorial photography',license:'Copyright Mr Adventure Dad',verified:date,notes:'Ordinary whisk, stone and wooden block with blank labels; no provenance, age, value, museum affiliation or historical significance claimed. Not affiliate/product imagery.'};
write('assets/images/credits.json',JSON.stringify(credits,null,2)+'\n');

insert('photo-credits.html','</section><h2>Additional editorial photography</h2>',pages.map((p,i)=>`<article class="photo-credit-card">${img(p)}<div><h2>${['Urban creekside family-walk planning','Winter car floor-protection categories','Three-object family mini museum'][i]}</h2><p>Original AI-assisted editorial photograph created for Mr Adventure Dad.</p><p>${['Conceptual only; not the Onondaga Creekwalk, Inner Harbor, a landmark or live trail evidence.','Generic unbranded categories; not exact products, affiliate imagery, fit proof, installation or pedal-clearance evidence.','Conceptual ordinary-object activity with blank labels; no provenance, age, value or historical claim.'][i]}</p></div></article>`).join(''));

write('reports/editorial-decision-2026-11-04.md',`# Editorial decision record — November 4, 2026

## Inventory and duplication gate

The complete production site contained 207 HTML documents before this batch: the 206-page November 3 inventory plus the separate November 7–8 weekly roundup published November 4. Every title, slug, heading, description, intent, location, trip angle, commercial category and image was checked, including the previous fourteen days. No November 4 daily trio existed. Proposed Fort Ontario and sound-map pages were rejected because exact evergreen guides already exist. Today’s pages do not repeat or compete with the November 7–8 event roundup.

## Search Console decision

The private report was generated October 28, 2026 for September 28 through October 25—seven days old and within the eight-day gate. MrAdventureDad.com recorded 711 impressions, 7 clicks, 0.98% CTR and average position 17.96. Zero-click hub signals for Adventures (15 impressions, position 7.7), Destinations (9, 13.9) and Gear (10, 13.9) supported stronger homepage, hub, sitemap and reciprocal discovery. Existing Howe Caverns (81 impressions), folding wagon (27), camping sleep (9) and travel bags (8) already serve their intents, so derivatives were rejected. One- and two-impression fragments and branded noise were deliberately ignored as too weak.

## Portfolio labels

- **Authority-expansion — Onondaga Creekwalk With Kids:** a distinct close-to-home urban trail plan with official parking, crossing, flood-closure and dawn-to-dusk gates.
- **Authority-expansion — Family Winter Car Floor Mats:** a commercial manual-first fit framework that treats the driver pedal zone separately from passenger mats and gear trays.
- **Exploration — Three-Object Family Mini Museum:** a no-spend school-night activity using Smithsonian object-based learning without duplicating the museum-day, oral-history or photo-hunt pages.

No page is primarily Data-led because the credible report supports hub discovery rather than an uncovered query. The batch acts on that signal through three hubs, the current homepage lead, sitemap and nine reciprocal links without inventing demand.

## Authority action

The batch creates three citation-ready assets: a one-hour urban-trail card, a four-category floor-protection matrix with a strict pedal gate, and a five-line evidence label for family object study. Nine established guides link back, and every page carries current primary-source notes and explicit fact/inference boundaries.

## Image gate before publication

Three unique final 1600×900 editorial images were visually inspected against title, body, caption, alt, credit and linked subject. The Creekwalk and mini-museum images are explicitly conceptual; the floor-protection image shows three generic unbranded categories. There are zero affiliate/product images. A second rendered live pass remains required after deployment.
`);
write('reports/image-qa-2026-11-04.md',`# Image QA — November 4, 2026

## Pass 1: final assets

- 3 unique 1600×900 editorial images visually inspected after final WebP conversion.
- 0 affiliate/product images used.
- Creekwalk: generic paved creekside scene with walking gear; explicitly not the named trail, Inner Harbor, landmark or current conditions.
- Floor protection: molded liner, flat mat and tray accurately match the three categories; no driver installation, exact product, logo, fit or pedal-clearance claim.
- Mini museum: adult and child examine a whisk, stone and wooden block with blank labels; no provenance, value, age or museum claim.
- Titles, final copy, captions, alt text, credits and linked subject/category context checked.

## Pass 2: live rendered

- Pending deployment.
`);
if(!read('reports/search-console-editorial-log.md').includes('# 2026-11-04'))appendFileSync(resolve(root,'reports/search-console-editorial-log.md'),`
# 2026-11-04

- Report generated: 2026-10-28; window 2026-09-28 through 2026-10-25; age seven days.
- Used: 711 impressions, 7 clicks, 0.98% CTR and position 17.96, plus zero-click Adventures (15 / 7.7), Destinations (9 / 13.9) and Gear (10 / 13.9), to strengthen three hubs, homepage, sitemap and nine reciprocal paths.
- Deliberately not chased: Howe Caverns (81 impressions), folding wagons (27), camping sleep (9) and travel bags (8) already have dedicated pages and support.
- Ignored as weak: one- and two-impression fragments and branded or irrelevant noise.
- Portfolio: two authority-expansion pages and one exploration; no Data-led page because the usable evidence was hub-level rather than an uncovered query.
`);
let auth=read('reports/authority-opportunities.md');
if(!auth.includes('## 2026-11-04'))auth+=`
## 2026-11-04

- **City of Syracuse Parks & Recreation** — https://www.syr.gov/Departments/Parks-Recreation — factual-correction and family-access review for the one-hour Creekwalk card grounded in the city map, access list and closure route.
- **Smithsonian Learning Lab** — https://learninglab.si.edu/about/contact — family-resource angle for the no-spend three-object mini museum using Observe, Think, Connect and Reflect with explicit attribution.
- **NHTSA Vehicle Safety Hotline / consumer resources** — https://www.nhtsa.gov/contact-us — consumer-education angle for the owner-manual-first floor-mat pedal gate and VIN recall check; no product endorsement requested.

No outreach, submission, account creation or paid placement was performed.
`;
write('reports/authority-opportunities.md',auth);
console.log('Generated exactly three November 4 guides, current homepage time windows, three hubs, nine reciprocal links, sitemap, credits and authority records.');
