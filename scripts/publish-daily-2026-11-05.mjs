import {appendFileSync,readFileSync,writeFileSync} from 'node:fs';
import {resolve} from 'node:path';
import {pages} from './content-2026-11-05.mjs';

const root=resolve(process.argv[2]||'.'),date='2026-11-05',start='<!-- DAILY 2026-11-05 -->',end='<!-- END DAILY 2026-11-05 -->';
const read=p=>readFileSync(resolve(root,p),'utf8'),write=(p,s)=>writeFileSync(resolve(root,p),s);
if(pages.length!==3)throw Error('Exactly three November 5 sources required');

const template=read('scripts/publish-daily-2026-10-17.mjs').match(/const pageHtml=p=>(`[\s\S]*?`);\n\nfor\(const p of pages\)/)?.[1];
if(!template)throw Error('Versioned renderer changed');
const render=new Function('date','imageUrl',`return p=>${template}`)(date,n=>`https://mradventuredad.com/assets/images/photos/${n}`);
for(const [i,p] of pages.entries()){
 let h=render(p).replaceAll('v=20261017','v=20261105').replace(`src="../assets/images/photos/${p.image}"`,`src="../assets/images/photos/${p.image}" width="1600" height="900" style="height:auto"`);
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
const priorPattern=/<!-- DAILY 2026-11-04 -->[\s\S]*?<!-- END DAILY 2026-11-04 -->/g,prior=home.match(priorPattern)?.[0];
home=home.replace(priorPattern,'');
if(prior)home=home.replace('<div class="field-archive-content">','<div class="field-archive-content">'+prior);
const options=[
 ['TONIGHT · 20 MINUTES · NO-SPEND',link(2),'Run one quiet sound test','Use one box, one safe band and three pencil spacings. Change one thing and write down what actually happened.'],
 ['WEEKEND · CURRENT EVENTS','weekend-november-7-8-2026.html','Use the November 7–8 family guide','The separate Wednesday roundup owns this week’s live dates, tickets and event schedules.'],
 ['WEEKEND · FULL INDOOR DAY',link(0),'Pick three State Museum galleries','Check the Albany entrance, bag rule, parking and gallery list; treat the carousel as a bonus.'],
 ['GEAR CHECK · BEFORE SKI DAY',link(1),'Run the ski-helmet four-gate test','Certification, current fit, real goggle interface and known history all have to pass.'],
 ['AT HOME · LOW ENERGY',link(2),'Watch one band vibrate','One adult pluck, one observation, safe cleanup. That still counts.'],
 ['BREAK · SHORTER DRIVE','guides/most-syracuse-with-kids.html','Use the MOST two-zone plan','Choose the shorter Syracuse indoor day when Albany’s round trip or road weather does not work.']
];
const lead=`<section class="now-plans wrap" aria-labelledby="now-plans-title"><div class="now-plans-head"><div><p class="kicker">FRESH IDEAS · NOVEMBER 5, 2026</p><h2 id="now-plans-title">Pick the time you actually have.</h2><p>Use a 20-minute sound lab tonight, a three-gallery Albany day this weekend or a strict ski-helmet fit gate before the first run.</p></div><a href="adventures.html">Browse all adventures →</a></div><div class="now-plans-grid">${options.map(o=>`<article class="now-plan"><span>${o[0]}</span><h3><a href="${o[1]}">${o[2]}</a></h3><p>${o[3]}</p></article>`).join('')}</div></section>`;
if(!/<section class="now-plans wrap"[\s\S]*?<section class="intro wrap">/.test(home))throw Error('Homepage lead missing');
home=home.replace(/<section class="now-plans wrap"[\s\S]*?<section class="intro wrap">/,lead+'<section class="intro wrap">');
const cards=`${start}<section class="stories wrap"><div class="section-head"><div><p class="kicker">THREE DIFFERENT FAMILY NEEDS</p><h2>Plan Albany. Fit the helmet. Test one sound.</h2></div></div><div class="story-grid">${pages.map((p,i)=>`<article class="story-card">${img(p)}<div><span>${['ALBANY MUSEUM · CONCEPTUAL PLANNING IMAGE','YOUTH SKI HELMETS · GENERIC CATEGORY IMAGE','AT HOME · EXACT ACTIVITY SETUP'][i]}</span><h3><a href="${link(i)}">${p.title}</a></h3><p>${p.dek}</p></div></article>`).join('')}</div></section>${end}`;
home=home.replace('<details class="field-archive wrap">',cards+'<details class="field-archive wrap">');
write('index.html',home);

insert('adventures.html','<!-- MAD AFFILIATE COMMERCE -->',`<section class="content-section alt"><div class="wrap"><p class="kicker">ALBANY DAY · HELMET FIT · NO-SPEND SOUND LAB</p><div class="simple-list">${pages.map(p=>`<a href="guides/${p.slug}.html">${p.title} <b>→</b></a>`).join('')}</div></div></section>`);
insert('destinations.html','</main>',`<section class="content-section alt"><div class="wrap"><p class="kicker">ALBANY · THREE-GALLERY FAMILY DAY</p><div class="card-grid"><article class="card">${img(pages[0])}<div><span>FREE ADMISSION · CURRENT PARKING AND BAG GATES</span><h3><a href="${link(0)}">New York State Museum with kids</a></h3><p>Pick three galleries, eat before the crash and treat the historic carousel as a current-status bonus.</p></div></article></div></div></section>`);
insert('gear.html','</main>',`<section class="content-section alt"><div class="wrap"><p class="kicker">YOUTH SNOW-SPORT HELMET · FOUR GATES</p><div class="card-grid"><article class="card">${img(pages[1])}<div><span>CERTIFICATION · FIT · GOGGLE INTERFACE · HISTORY</span><h3><a href="${link(1)}">Kids’ ski-helmet fit and replacement guide</a></h3><p>Compare construction only after the exact standard, current head fit, real goggles and crash history pass.</p></div></article></div></div></section>`);

export const reciprocal={
 'guides/family-museum-day-system.html':`<aside class="note"><strong>Put the three-zone system on a full day:</strong> the <a href="${pages[0].slug}.html">New York State Museum family plan</a> adds current Albany entrance, bag, parking, food and carousel gates.</aside>`,
 'guides/erie-canal-museum-with-kids.html':`<aside class="note"><strong>Need a bigger indoor history day?</strong> Compare the local visit with the <a href="${pages[0].slug}.html">three-gallery New York State Museum plan</a> before committing to the drive.</aside>`,
 'guides/most-syracuse-with-kids.html':`<aside class="note"><strong>Considering an Albany day instead?</strong> The <a href="${pages[0].slug}.html">New York State Museum plan</a> handles the longer drive, parking, bag rule and carousel uncertainty.</aside>`,
 'guides/first-ski-day-with-kids.html':`<aside class="note"><strong>Fit the head before the first run:</strong> use the <a href="${pages[1].slug}.html">kids’ ski-helmet certification, fit, goggle and history gates</a>.</aside>`,
 'guides/kids-ski-goggles-youth-otg-low-light-fit-guide.html':`<aside class="note"><strong>Test the full interface:</strong> the <a href="${pages[1].slug}.html">ski-helmet guide</a> checks snow-sport labels, current head fit, goggle gap and replacement history.</aside>`,
 'guides/kids-winter-hats-beanie-earflap-balaclava-fit-guide.html':`<aside class="note"><strong>The helmet manual wins:</strong> use the <a href="${pages[1].slug}.html">kids’ ski-helmet fit guide</a> before putting any layer under a snow-sport helmet.</aside>`,
 'guides/neighborhood-sound-map-20-minute-family-activity.html':`<aside class="note"><strong>Want one controlled sound test?</strong> The <a href="${pages[2].slug}.html">20-minute rubber-band lab</a> changes only vibrating length and records three runs.</aside>`,
 'guides/family-foley-sound-effects-lab-30-minutes.html':`<aside class="note"><strong>Switch from storytelling to evidence:</strong> the <a href="${pages[2].slug}.html">rubber-band sound lab</a> uses one variable, three observations and a no-launch gate.</aside>`,
 'guides/paper-bridge-load-test-25-minute-family-stem.html':`<aside class="note"><strong>Prefer sound to structures?</strong> Use the <a href="${pages[2].slug}.html">20-minute rubber-band lab</a> with one box, three spacings and a clean stop.</aside>`
};
for(const [path,block] of Object.entries(reciprocal))insert(path,'</main>',block);

for(const path of ['index.html','adventures.html','destinations.html','gear.html'])write(path,read(path).replace(/href="assets\/css\/style\.css(?:\?v=\d+)?"/,'href="assets/css/style.css?v=20261105"'));

let map=read('sitemap.xml');
for(const p of pages)map=map.replace(new RegExp(`  <url><loc>https://mradventuredad\\.com/guides/${p.slug}\\.html</loc><lastmod>[^<]+</lastmod></url>\\n?`,'g'),'');
map=map.replace('</urlset>',pages.map(p=>`  <url><loc>https://mradventuredad.com/guides/${p.slug}.html</loc><lastmod>${date}</lastmod></url>`).join('\n')+'\n</urlset>');
write('sitemap.xml',map);

const credits=JSON.parse(read('assets/images/credits.json'));
credits['assets/images/photos/new-york-state-museum-family-plan.webp']={title:'Conceptual New York State Museum family planning still life',creator:'Mr Adventure Dad Editorial Desk with OpenAI image generation',source:'Original AI-assisted editorial photography',license:'Copyright Mr Adventure Dad',verified:date,notes:'Generic museum-day planning objects and abstract map; explicitly not the New York State Museum building, galleries, exhibits, carousel, parking or current access. Not affiliate/product imagery.'};
credits['assets/images/photos/kids-ski-helmet-fit-categories.webp']={title:'Generic youth snow-sport helmet fit categories',creator:'Mr Adventure Dad Editorial Desk with OpenAI image generation',source:'Original AI-assisted editorial photography',license:'Copyright Mr Adventure Dad',verified:date,notes:'Three unbranded generic youth ski/snowboard helmet forms with fit tools; no exact product, certification, fit, impact performance, testing or affiliate claim.'};
credits['assets/images/photos/family-rubber-band-sound-lab.webp']={title:'Family rubber-band sound lab setup',creator:'Mr Adventure Dad Editorial Desk with OpenAI image generation',source:'Original AI-assisted editorial photography',license:'Copyright Mr Adventure Dad',verified:date,notes:'Exact generic activity setup with tissue box, three bands, two unsharpened pencils and blank observation card. Not product imagery.'};
write('assets/images/credits.json',JSON.stringify(credits,null,2)+'\n');

insert('photo-credits.html','</section><h2>Additional editorial photography</h2>',pages.map((p,i)=>`<article class="photo-credit-card">${img(p)}<div><h2>${['Albany museum-day planning','Youth snow-sport helmet categories','Family rubber-band sound lab'][i]}</h2><p>Original AI-assisted editorial photograph created for Mr Adventure Dad.</p><p>${['Conceptual only; not the New York State Museum, its galleries, carousel, parking or live access evidence.','Generic unbranded categories; not exact products, affiliate imagery, certification, fit or impact evidence.','Exact generic activity setup; no product, performance or classroom certification claim.'][i]}</p></div></article>`).join(''));

write('reports/editorial-decision-2026-11-05.md',`# Editorial decision record — November 5, 2026

## Inventory and duplication gate

The complete production site contained 210 HTML documents before this batch. Every title, slug, heading, description, primary keyword, location, trip angle, commercial category and image was checked, including the previous fourteen days and the separate November 7–8 weekly roundup. No November 5 daily trio existed. Proposed kids’ snow pants and flashlight shadow experiments were rejected because exact evergreen guides already exist. The New York State Museum appears only as an event mention, not an evergreen destination guide. Today’s three pages do not repeat or compete with the November 7–8 event roundup.

## Search Console decision

The private report was generated November 4, 2026 for October 5 through November 1—one day old and within the eight-day gate. MrAdventureDad.com recorded 660 impressions, 5 clicks, 0.8% CTR and average position 19.5. The folding-wagon page (23 impressions, one click, position 13.2), Howe Caverns (70/1/9.4), MOST (41/1/13.8) and Letchworth (3/1/9.7) already serve their intents, so derivative pages were rejected. Zero-click Adventures (16 impressions, position 12.2), Destinations (10/0/13.0) and Gear (12/0/19.8) supported stronger hub, homepage, sitemap and reciprocal discovery. One-to-three-impression query fragments and branded noise were deliberately ignored as too weak.

## Portfolio labels

- **Authority-expansion — New York State Museum With Kids:** a distinct full indoor Albany day with current official entrance, bag, parking, food, access and carousel gates.
- **Authority-expansion — Kids’ Ski Helmets:** a commercial seasonal fit-and-replacement framework that extends the first-ski-day and goggle cluster without duplicating either intent.
- **Exploration — Rubber-Band Sound Lab:** a no-spend school-night activity with a one-variable evidence table and explicit no-launch, allergy and sensory boundaries.

No new page is primarily Data-led because the credible report supports hub discovery and existing page reinforcement rather than an uncovered query. Diversity is preserved across destination planning, high-intent safety gear and at-home science.

## Authority action

The batch creates three citation-ready assets: a three-gallery museum route card, a four-gate snow-sport helmet decision matrix, and a three-run sound-evidence table. Nine established guides link back, the three primary hubs are strengthened, and every new page states current source dates and fact/inference boundaries.

## Image gate before publication

Three unique final 1600×900 editorial images were visually inspected after WebP conversion against title, body, caption, alt, credit and linked subject. The destination image is explicitly conceptual; the helmet image shows generic unbranded snow-sport categories; the sound-lab image shows the exact generic setup. There are zero affiliate/product images. A second rendered live pass remains required after deployment.
`);
write('reports/image-qa-2026-11-05.md',`# Image QA — November 5, 2026

## Pass 1: final assets

- 3 unique 1600×900 editorial images visually inspected after final WebP conversion.
- 0 affiliate/product images used.
- State Museum: generic map, fossil/train sketch cards, jacket, water, snack and parking note; explicitly not the named museum or live conditions.
- Ski helmets: three complete generic youth snow-sport helmet forms, ear pads and straps, with no logos, labels, certification marks or exact product claims.
- Sound lab: one tissue box, three bands, two unsharpened pencils, blank three-row card and supervised hands; no launcher or sharp tool.
- Titles, final copy, captions, alt text, credits and linked subject/category context checked.

## Pass 2: live rendered

- Pending deployment.
`);
if(!read('reports/search-console-editorial-log.md').includes('# 2026-11-05'))appendFileSync(resolve(root,'reports/search-console-editorial-log.md'),`
# 2026-11-05

- Report generated: 2026-11-04; window 2026-10-05 through 2026-11-01; age one day.
- Used: 660 impressions, 5 clicks, 0.8% CTR and position 19.5, plus zero-click Adventures (16 / 12.2), Destinations (10 / 13.0) and Gear (12 / 19.8), to strengthen three hubs, homepage, sitemap and nine reciprocal paths.
- Deliberately not chased: folding wagon (23 impressions, one click, position 13.2), Howe Caverns (70/1/9.4), MOST (41/1/13.8) and Letchworth (3/1/9.7) already have dedicated pages and support.
- Ignored as weak: one-to-three-impression fragments, branded noise and unstable isolated positions.
- Portfolio: two authority-expansion pages and one exploration; no Data-led new page because the usable evidence was hub-level rather than an uncovered query.
`);
let auth=read('reports/authority-opportunities.md');
if(!auth.includes('## 2026-11-05'))auth+=`
## 2026-11-05

- **New York State Museum Visitor Services** — https://nysm.nysed.gov/museum-contact — factual-correction and family-access review for the three-gallery route grounded in the museum’s current visit, exhibition, renovation and carousel pages.
- **CDC HEADS UP** — https://www.cdc.gov/heads-up/about/contact-us.html — family-resource angle for the snow-sport helmet four-gate matrix using CDC certification, fit and replacement guidance without product endorsement.
- **Science Buddies** — https://www.sciencebuddies.org/about/contact-us — family-resource angle for the one-variable rubber-band sound table with clear attribution and added no-launch/allergy gates.

No outreach, submission, account creation or paid placement was performed.
`;
write('reports/authority-opportunities.md',auth);
console.log('Generated exactly three November 5 guides, current homepage time windows, three hubs, nine reciprocal links, sitemap, credits and authority records.');
