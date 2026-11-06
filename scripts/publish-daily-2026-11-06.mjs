import {appendFileSync,readFileSync,writeFileSync} from 'node:fs';
import {resolve} from 'node:path';
import {pages} from './content-2026-11-06.mjs';

const root=resolve(process.argv[2]||'.'),date='2026-11-06',start='<!-- DAILY 2026-11-06 -->',end='<!-- END DAILY 2026-11-06 -->';
const read=p=>readFileSync(resolve(root,p),'utf8'),write=(p,s)=>writeFileSync(resolve(root,p),s);
if(pages.length!==3)throw Error('Exactly three November 6 sources required');

const template=read('scripts/publish-daily-2026-10-17.mjs').match(/const pageHtml=p=>(`[\s\S]*?`);\n\nfor\(const p of pages\)/)?.[1];
if(!template)throw Error('Versioned renderer changed');
const render=new Function('date','imageUrl',`return p=>${template}`)(date,n=>`https://mradventuredad.com/assets/images/photos/${n}`);
for(const [i,p] of pages.entries()){
 let h=render(p).replaceAll('v=20261017','v=20261106').replace(`src="../assets/images/photos/${p.image}"`,`src="../assets/images/photos/${p.image}" width="1600" height="900" style="height:auto"`);
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
const priorPattern=/<!-- DAILY 2026-11-05 -->[\s\S]*?<!-- END DAILY 2026-11-05 -->/g,prior=home.match(priorPattern)?.[0];
home=home.replace(priorPattern,'');
if(prior)home=home.replace('<div class="field-archive-content">','<div class="field-archive-content">'+prior);
const options=[
 ['TONIGHT · 20 MINUTES · NO-SPEND',link(2),'Map four drafts without fixing anything','Use tissue strips at safe, ordinary doors and windows. Record moves, still or unsure—then stop.'],
 ['WEEKEND · CURRENT EVENTS','weekend-november-7-8-2026.html','Use the November 7–8 family guide','The separate Wednesday roundup owns this week’s live dates, tickets and event schedules.'],
 ['WEEKEND · 60–75 MINUTES',link(0),'Give the Regional Market a three-item finish line','One known item, one useful question, one child choice, then leave before the second lap.'],
 ['SCHOOL NIGHT · TRANSITION RESET',link(1),'Test a timer before buying one','Use the phone you already own for seven transitions; buy only for a missing display, control or sound feature.'],
 ['AT HOME · LOW ENERGY',link(2),'Check one exterior door','One tissue strip, one mark, full cleanup. That still counts.'],
 ['BREAK · RAINY-DAY BACKUP','guides/family-library-night-45-minute-plan.html','Run the 45-minute library plan','Use one shelf, one seat and one clean exit when the market or weather does not fit.']
];
const lead=`<section class="now-plans wrap" aria-labelledby="now-plans-title"><div class="now-plans-head"><div><p class="kicker">FRESH IDEAS · NOVEMBER 6, 2026</p><h2 id="now-plans-title">Pick the time you actually have.</h2><p>Run a no-flame home draft hunt tonight, give the Regional Market a finish line this weekend, or test a visual timer before buying one.</p></div><a href="adventures.html">Browse all adventures →</a></div><div class="now-plans-grid">${options.map(o=>`<article class="now-plan"><span>${o[0]}</span><h3><a href="${o[1]}">${o[2]}</a></h3><p>${o[3]}</p></article>`).join('')}</div></section>`;
if(!/<section class="now-plans wrap"[\s\S]*?<section class="intro wrap">/.test(home))throw Error('Homepage lead missing');
home=home.replace(/<section class="now-plans wrap"[\s\S]*?<section class="intro wrap">/,lead+'<section class="intro wrap">');
const cards=`${start}<section class="stories wrap"><div class="section-head"><div><p class="kicker">THREE DIFFERENT FAMILY NEEDS</p><h2>Shop three things. Fix one transition. Map four drafts.</h2></div></div><div class="story-grid">${pages.map((p,i)=>`<article class="story-card">${img(p)}<div><span>${['SYRACUSE MARKET · CONCEPTUAL PLANNING IMAGE','FAMILY VISUAL TIMERS · GENERIC CATEGORY IMAGE','AT HOME · EXACT NO-FLAME SETUP'][i]}</span><h3><a href="${link(i)}">${p.title}</a></h3><p>${p.dek}</p></div></article>`).join('')}</div></section>${end}`;
home=home.replace('<details class="field-archive wrap">',cards+'<details class="field-archive wrap">');
write('index.html',home);

insert('adventures.html','<!-- MAD AFFILIATE COMMERCE -->',`<section class="content-section alt"><div class="wrap"><p class="kicker">REGIONAL MARKET · TRANSITION TIMER · NO-FLAME DRAFT HUNT</p><div class="simple-list">${pages.map(p=>`<a href="guides/${p.slug}.html">${p.title} <b>→</b></a>`).join('')}</div></div></section>`);
insert('destinations.html','</main>',`<section class="content-section alt"><div class="wrap"><p class="kicker">SYRACUSE · FINISHABLE MARKET MORNING</p><div class="card-grid"><article class="card">${img(pages[0])}<div><span>THREE ITEMS · CURRENT HOURS, ACCESS AND PAYMENT GATES</span><h3><a href="${link(0)}">CNY Regional Market with kids</a></h3><p>Give the family one known item, one useful question, one child choice and a clean exit.</p></div></article></div></div></section>`);
insert('gear.html','</main>',`<section class="content-section alt"><div class="wrap"><p class="kicker">FAMILY VISUAL TIMERS · TEST BEFORE BUYING</p><div class="card-grid"><article class="card">${img(pages[1])}<div><span>ANALOG DISK · DIGITAL COUNTDOWN · PHONE · NO TIMER</span><h3><a href="${link(1)}">Choose a visual timer by the transition job</a></h3><p>Compare display, controls, sound and placement only after the free seven-day test.</p></div></article></div></div></section>`);

export const reciprocal={
 'guides/family-day-trip-system.html':`<aside class="note"><strong>Give a local errand a real finish line:</strong> the <a href="${pages[0].slug}.html">CNY Regional Market family mission</a> uses three purchases, a fixed budget and one clean exit.</aside>`,
 'guides/family-grocery-receipt-detective-25-minute-math-activity.html':`<aside class="note"><strong>Collect the evidence at a real market:</strong> use the <a href="${pages[0].slug}.html">three-item Regional Market plan</a>, then run receipt math at home.</aside>`,
 'guides/family-parking-lot-plan.html':`<aside class="note"><strong>Use the transfer system at a working market:</strong> the <a href="${pages[0].slug}.html">CNY Regional Market plan</a> adds current parking, crowd, payment and pet gates.</aside>`,
 'guides/family-calendar-reset-20-minute-plan.html':`<aside class="note"><strong>Make one transition visible:</strong> the <a href="${pages[1].slug}.html">family visual-timer guide</a> starts with a seven-day no-buy test and a six-word next action.</aside>`,
 'guides/after-school-nature-walk-30-minute-plan.html':`<aside class="note"><strong>Need a cleaner launch?</strong> Test the <a href="${pages[1].slug}.html">visual countdown transition system</a> before buying another school-night device.</aside>`,
 'guides/family-library-night-45-minute-plan.html':`<aside class="note"><strong>Make the exit predictable:</strong> the <a href="${pages[1].slug}.html">family visual-timer guide</a> compares analog, digital, phone and no-timer options.</aside>`,
 'guides/family-home-utility-map-20-minute-adults-operate.html':`<aside class="note"><strong>Observe without operating anything:</strong> the <a href="${pages[2].slug}.html">20-minute no-flame draft hunt</a> keeps children away from electrical, fuel and ventilation systems.</aside>`,
 'guides/family-energyguide-label-check-25-minute-activity.html':`<aside class="note"><strong>Move from appliance estimates to room observations:</strong> the <a href="${pages[2].slug}.html">family draft hunt</a> records tissue movement without claiming a diagnosis.</aside>`,
 'guides/family-power-outage-drill-20-minutes.html':`<aside class="note"><strong>Keep the no-flame boundary:</strong> the <a href="${pages[2].slug}.html">four-room draft hunt</a> teaches observation without smoke, repairs or combustion work.</aside>`
};
for(const [path,block] of Object.entries(reciprocal))insert(path,'</main>',block);

for(const path of ['index.html','adventures.html','destinations.html','gear.html'])write(path,read(path).replace(/href="assets\/css\/style\.css(?:\?v=\d+)?"/,'href="assets/css/style.css?v=20261106"'));

let map=read('sitemap.xml');
for(const p of pages)map=map.replace(new RegExp(`  <url><loc>https://mradventuredad\\.com/guides/${p.slug}\\.html</loc><lastmod>[^<]+</lastmod></url>\\n?`,'g'),'');
map=map.replace('</urlset>',pages.map(p=>`  <url><loc>https://mradventuredad.com/guides/${p.slug}.html</loc><lastmod>${date}</lastmod></url>`).join('\n')+'\n</urlset>');
write('sitemap.xml',map);

const credits=JSON.parse(read('assets/images/credits.json'));
credits['assets/images/photos/cny-regional-market-family-mission.webp']={title:'Conceptual CNY Regional Market family mission still life',creator:'Mr Adventure Dad Editorial Desk with OpenAI image generation',source:'Original AI-assisted editorial photography',license:'Copyright Mr Adventure Dad',verified:date,notes:'Generic market-planning objects, produce, blank map and checklist; explicitly not the named market, a real vendor, current product, parking, crowd or access evidence. Not affiliate/product imagery.'};
credits['assets/images/photos/family-visual-timer-categories.webp']={title:'Generic family visual timer categories',creator:'Mr Adventure Dad Editorial Desk with OpenAI image generation',source:'Original AI-assisted editorial photography',license:'Copyright Mr Adventure Dad',verified:date,notes:'Unbranded analog disk, digital countdown and face-down phone category stand-ins; not exact products, app screens, accessibility claims, testing or affiliate imagery.'};
credits['assets/images/photos/family-home-draft-hunt.webp']={title:'Family no-flame home draft-hunt setup',creator:'Mr Adventure Dad Editorial Desk with OpenAI image generation',source:'Original AI-assisted editorial photography',license:'Copyright Mr Adventure Dad',verified:date,notes:'Closed door and window with tissue strips, removable tape and blank four-box map; no flame, smoke, outlet, combustion appliance, repair, leak diagnosis or product claim.'};
write('assets/images/credits.json',JSON.stringify(credits,null,2)+'\n');

insert('photo-credits.html','</section><h2>Additional editorial photography</h2>',pages.map((p,i)=>`<article class="photo-credit-card">${img(p)}<div><h2>${['Regional Market family mission planning','Family visual timer categories','Family no-flame draft hunt'][i]}</h2><p>Original AI-assisted editorial photograph created for Mr Adventure Dad.</p><p>${['Conceptual only; not the named market, a real vendor, live parking, crowd, product or access evidence.','Generic unbranded categories; not exact products, affiliate imagery, accessibility, testing or app evidence.','Exact safe observation setup; no flame, smoke, outlet, fuel appliance, diagnosis, repair or claimed result.'][i]}</p></div></article>`).join(''));

write('reports/editorial-decision-2026-11-06.md',`# Editorial decision record — November 6, 2026

## Inventory and duplication gate

The complete production site contained 213 HTML documents before this batch. Every title, slug, heading, description, primary keyword, location, trip angle, commercial category and image was checked, including the previous fourteen days and the separate November 7–8 weekly roundup. No November 6 daily trio existed. A kids’ winter base-layer page was rejected because the October 7 fall-layer guide already covers that intent and monetizes base layers. The Regional Market had no evergreen family guide, visual timers had no decision page, and the site had no no-flame home draft observation activity. None competes with the November 7–8 event roundup.

## Search Console decision

The private report was generated November 4, 2026 for October 5 through November 1—two days old and within the eight-day gate. MrAdventureDad.com recorded 660 impressions, 5 clicks, 0.8% CTR and average position 19.5. The folding-wagon page (23 impressions, one click, position 13.2), Howe Caverns (70/1/9.4), MOST (41/1/13.8) and Letchworth (3/1/9.7) already serve their intents, so derivative pages were rejected. Zero-click Adventures (16 impressions, position 12.2), Destinations (10/0/13.0) and Gear (12/0/19.8) supported stronger hub, homepage, sitemap and reciprocal discovery. One-to-three-impression query fragments, branded noise and isolated weak terms were deliberately ignored.

## Portfolio labels

- **Authority-expansion — CNY Regional Market With Kids:** a distinct local food-and-math mission with current official hours, parking, payment, access, restroom and pet gates.
- **Authority-expansion — Family Visual Timers:** a commercial school-night decision framework with a seven-day no-buy test, analog/digital/phone/no-timer matrix and honest limits.
- **Exploration — Family Home Draft Hunt:** a no-spend four-room observation activity that excludes flame, smoke, repairs, electrical access and combustion work.

No new page is primarily Data-led because the credible report supports hub discovery and existing page reinforcement rather than an uncovered query. Diversity is preserved across a local working-market outing, a commercially useful school-night system and a no-spend home-energy observation activity.

## Authority action

The batch creates three citation-ready assets: a three-item market mission, a four-format timer decision card with a seven-day free test, and a four-room evidence map separating observation from diagnosis. Nine established guides link back, the three primary hubs are strengthened, and every new page states source dates and fact/inference boundaries.

## Image gate before publication

Three unique final 1600×900 editorial images were visually inspected after WebP conversion against title, body, caption, alt, credit and linked subject. The market image is explicitly conceptual; the timer image shows three generic unbranded formats; the draft image shows the exact no-flame observation setup. There are zero affiliate/product images. A second rendered live pass remains required after deployment.
`);
write('reports/image-qa-2026-11-06.md',`# Image QA — November 6, 2026

## Pass 1: final assets

- 3 unique 1600×900 editorial images visually inspected after final WebP conversion.
- 0 affiliate/product images used.
- Regional Market: reusable tote, produce, blank conceptual map, three-item card, cash, hat and water; explicitly not the named market, a vendor or live conditions.
- Visual timers: separate unbranded analog disk, digital countdown and face-down phone forms; no app screen, logo, exact product or accessibility claim.
- Draft hunt: closed ordinary window and door, two tissue strips, removable tape, pencil and blank four-box sheet; no flame, smoke, outlet, fuel appliance or repair work.
- Titles, final copy, captions, alt text, credits and linked subject/category context checked.

## Pass 2: live rendered

- Pending deployment.
`);
if(!read('reports/search-console-editorial-log.md').includes('# 2026-11-06'))appendFileSync(resolve(root,'reports/search-console-editorial-log.md'),`
# 2026-11-06

- Report generated: 2026-11-04; window 2026-10-05 through 2026-11-01; age two days.
- Used: 660 impressions, 5 clicks, 0.8% CTR and position 19.5, plus zero-click Adventures (16 / 12.2), Destinations (10 / 13.0) and Gear (12 / 19.8), to strengthen three hubs, homepage, sitemap and nine reciprocal paths.
- Deliberately not chased: folding wagon (23 impressions, one click, position 13.2), Howe Caverns (70/1/9.4), MOST (41/1/13.8) and Letchworth (3/1/9.7) already have dedicated pages and support.
- Ignored as weak: one-to-three-impression fragments, branded noise and unstable isolated positions.
- Portfolio: two authority-expansion pages and one exploration; no Data-led new page because the usable evidence was hub-level rather than an uncovered query.
`);
let auth=read('reports/authority-opportunities.md');
if(!auth.includes('## 2026-11-06'))auth+=`
## 2026-11-06

- **CNY Regional Market Authority** — https://www.cnyregionalmarket.org/contact — factual-correction and family-access review for the three-item mission grounded in current official hours, payment, access and pet rules.
- **Home Performance with ENERGY STAR** — https://www.energystar.gov/saveathome/improvements/find-home-energy-assessor — family handout angle for the observation-versus-diagnosis draft map, with an explicit certified-assessor gate.
- **Onondaga County Public Library family services** — https://www.onlib.org/contact-us — practical family-routine resource angle for the seven-day timer test and no-buy option; no product endorsement requested.

No outreach, submission, account creation or paid placement was performed.
`;
write('reports/authority-opportunities.md',auth);
console.log('Generated exactly three November 6 guides, current homepage time windows, three hubs, nine reciprocal links, sitemap, credits and authority records.');
