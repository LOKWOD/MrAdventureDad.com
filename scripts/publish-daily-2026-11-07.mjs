import {appendFileSync,readFileSync,writeFileSync} from 'node:fs';
import {resolve} from 'node:path';
import {pages} from './content-2026-11-07.mjs';

const root=resolve(process.argv[2]||'.'),date='2026-11-07',start='<!-- DAILY 2026-11-07 -->',end='<!-- END DAILY 2026-11-07 -->';
const read=p=>readFileSync(resolve(root,p),'utf8'),write=(p,s)=>writeFileSync(resolve(root,p),s);
if(pages.length!==3)throw Error('Exactly three November 7 sources required');

const template=read('scripts/publish-daily-2026-10-17.mjs').match(/const pageHtml=p=>(`[\s\S]*?`);\n\nfor\(const p of pages\)/)?.[1];
if(!template)throw Error('Versioned renderer changed');
const render=new Function('date','imageUrl',`return p=>${template}`)(date,n=>`https://mradventuredad.com/assets/images/photos/${n}`);
for(const [i,p] of pages.entries()){
 let h=render(p).replaceAll('v=20261017','v=20261107').replace(`src="../assets/images/photos/${p.image}"`,`src="../assets/images/photos/${p.image}" width="1600" height="900" style="height:auto"`);
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
const priorPattern=/<!-- DAILY 2026-11-06 -->[\s\S]*?<!-- END DAILY 2026-11-06 -->/g,prior=home.match(priorPattern)?.[0];
home=home.replace(priorPattern,'');
if(prior)home=home.replace('<div class="field-archive-content">','<div class="field-archive-content">'+prior);
const options=[
 ['TONIGHT · 30 MINUTES · NO-SPEND',link(2),'Make a 12-move stop-motion story','Use one object, 24 private photos and the phone you already own. No account or posting.'],
 ['WEEKEND · CURRENT EVENTS','weekend-november-7-8-2026.html','Use the November 7–8 family guide','The separate Wednesday roundup owns this week’s live dates, tickets and event schedules.'],
 ['WEEKEND · 90-MINUTE MUSEUM',link(0),'Pick three rooms in Norwich','Use one old-car question, one kid choice, one current exhibit and a clean exit.'],
 ['SCHOOL NIGHT · GEAR TEST',link(1),'Test radios before trusting range','Use one channel, one call script and the first failure point—not the box mileage.'],
 ['AT HOME · LOW ENERGY',link(2),'Make a six-move rough cut','Six positions, six photos and a manual swipe-through still teaches the trick.'],
 ['BREAK · RAINY-DAY BACKUP','guides/family-three-object-mini-museum-30-minute-activity.html','Build a three-object mini museum','Use one table and three labels when the Norwich drive or weather does not fit.']
];
const lead=`<section class="now-plans wrap" aria-labelledby="now-plans-title"><div class="now-plans-head"><div><p class="kicker">FRESH IDEAS · NOVEMBER 7, 2026</p><h2 id="now-plans-title">Pick the time you actually have.</h2><p>Make a private stop-motion story tonight, use the separate weekend roundup for live events, or give a Norwich museum visit a three-room finish line.</p></div><a href="adventures.html">Browse all adventures →</a></div><div class="now-plans-grid">${options.map(o=>`<article class="now-plan"><span>${o[0]}</span><h3><a href="${o[1]}">${o[2]}</a></h3><p>${o[3]}</p></article>`).join('')}</div></section>`;
if(!/<section class="now-plans wrap"[\s\S]*?<section class="intro wrap">/.test(home))throw Error('Homepage lead missing');
home=home.replace(/<section class="now-plans wrap"[\s\S]*?<section class="intro wrap">/,lead+'<section class="intro wrap">');
const cards=`${start}<section class="stories wrap"><div class="section-head"><div><p class="kicker">THREE DIFFERENT FAMILY NEEDS</p><h2>Pick three rooms. Test the radios. Make twelve moves.</h2></div></div><div class="story-grid">${pages.map((p,i)=>`<article class="story-card">${img(p)}<div><span>${['NORWICH MUSEUM · CONCEPTUAL PLANNING IMAGE','FAMILY TWO-WAY RADIOS · GENERIC CATEGORY IMAGE','AT HOME · EXACT STOP-MOTION SETUP'][i]}</span><h3><a href="${link(i)}">${p.title}</a></h3><p>${p.dek}</p></div></article>`).join('')}</div></section>${end}`;
home=home.replace('<details class="field-archive wrap">',cards+'<details class="field-archive wrap">');
write('index.html',home);

insert('adventures.html','<!-- MAD AFFILIATE COMMERCE -->',`<section class="content-section alt"><div class="wrap"><p class="kicker">CLASSIC CARS · FAMILY RADIOS · STOP-MOTION STORY</p><div class="simple-list">${pages.map(p=>`<a href="guides/${p.slug}.html">${p.title} <b>→</b></a>`).join('')}</div></div></section>`);
insert('destinations.html','</main>',`<section class="content-section alt"><div class="wrap"><p class="kicker">NORWICH · FINISHABLE INDOOR DAY TRIP</p><div class="card-grid"><article class="card">${img(pages[0])}<div><span>THREE ROOMS · CURRENT HOURS, COST, TOUCH AND ACCESS GATES</span><h3><a href="${link(0)}">Northeast Classic Car Museum with kids</a></h3><p>Choose three rooms, use only confirmed sit-in cars and leave before every hood looks the same.</p></div></article></div></div></section>`);
insert('gear.html','</main>',`<section class="content-section alt"><div class="wrap"><p class="kicker">FAMILY TWO-WAY RADIOS · TEST BEFORE TRUSTING</p><div class="card-grid"><article class="card">${img(pages[1])}<div><span>FRS · LICENSED GMRS · PHONE · STAY TOGETHER</span><h3><a href="${link(1)}">Choose family radios by the legal service and real route</a></h3><p>Start with license-free FRS, reject fantasy mileage and record the first contact failure.</p></div></article></div></div></section>`);

export const reciprocal={
 'guides/family-museum-day-system.html':`<aside class="note"><strong>Use the one-anchor museum rule in Norwich:</strong> the <a href="${pages[0].slug}.html">Northeast Classic Car Museum family plan</a> turns more than 160 vehicles into three finishable rooms.</aside>`,
 'guides/utica-childrens-museum-with-kids.html':`<aside class="note"><strong>Need a viewing-first museum instead?</strong> The <a href="${pages[0].slug}.html">Northeast Classic Car Museum plan</a> uses strict touch rules, two confirmed sit-in cars and a 90-minute exit.</aside>`,
 'guides/family-photo-scavenger-hunt-30-minute-no-posting-plan.html':`<aside class="note"><strong>Take the no-posting rule to a real collection:</strong> the <a href="${pages[0].slug}.html">Norwich classic-car museum guide</a> adds current photography and touch boundaries.</aside>`,
 'guides/family-no-cell-service-day-trip-plan.html':`<aside class="note"><strong>Radios are backup, not outside help:</strong> the <a href="${pages[1].slug}.html">FRS vs GMRS vs phone guide</a> starts with legal service, a real-route test and a no-reply return rule.</aside>`,
 'guides/family-emergency-contact-card-drill-20-minutes.html':`<aside class="note"><strong>Add one short call script:</strong> the <a href="${pages[1].slug}.html">family two-way radio guide</a> tests controls, contact failure and privacy before a trip.</aside>`,
 'guides/family-lost-kid-plan.html':`<aside class="note"><strong>Do not let a radio replace staying together:</strong> the <a href="${pages[1].slug}.html">family FRS and GMRS decision guide</a> keeps adult supervision and the meeting plan primary.</aside>`,
 'guides/family-three-object-mini-museum-30-minute-activity.html':`<aside class="note"><strong>Make the objects move next:</strong> the <a href="${pages[2].slug}.html">30-minute stop-motion story</a> uses one object, 12 moves and a no-posting boundary.</aside>`,
 'guides/family-oral-history-interview-30-minute-no-posting-plan.html':`<aside class="note"><strong>Try a camera activity without filming people:</strong> the <a href="${pages[2].slug}.html">private stop-motion plan</a> uses an ordinary object and keeps the first movie offline.</aside>`,
 'guides/paper-airplane-distance-lab-25-minute-family-stem.html':`<aside class="note"><strong>Want motion without a launch lane?</strong> The <a href="${pages[2].slug}.html">12-move stop-motion story</a> turns one household object into a private 24-photo rough cut.</aside>`
};
for(const [path,block] of Object.entries(reciprocal))insert(path,'</main>',block);

for(const path of ['index.html','adventures.html','destinations.html','gear.html'])write(path,read(path).replace(/href="assets\/css\/style\.css(?:\?v=\d+)?"/,'href="assets/css/style.css?v=20261107"'));

let map=read('sitemap.xml');
for(const p of pages)map=map.replace(new RegExp(`  <url><loc>https://mradventuredad\\.com/guides/${p.slug}\\.html</loc><lastmod>[^<]+</lastmod></url>\\n?`,'g'),'');
map=map.replace('</urlset>',pages.map(p=>`  <url><loc>https://mradventuredad.com/guides/${p.slug}.html</loc><lastmod>${date}</lastmod></url>`).join('\n')+'\n</urlset>');
write('sitemap.xml',map);

const credits=JSON.parse(read('assets/images/credits.json'));
credits['assets/images/photos/northeast-classic-car-museum-family-plan.webp']={title:'Conceptual classic-car museum family planning still life',creator:'Mr Adventure Dad Editorial Desk with OpenAI image generation',source:'Original AI-assisted editorial photography',license:'Copyright Mr Adventure Dad',verified:date,notes:'Blank three-room card, vintage-car silhouette cards, shoes, hearing protection, layer and water; explicitly not the named museum, a real exhibit, ticket, access feature or current condition. Not affiliate/product imagery.'};
credits['assets/images/photos/family-two-way-radio-categories.webp']={title:'Generic family two-way radio categories',creator:'Mr Adventure Dad Editorial Desk with OpenAI image generation',source:'Original AI-assisted editorial photography',license:'Copyright Mr Adventure Dad',verified:date,notes:'Fictional unbranded FRS-style and GMRS-style handheld forms plus phone and blank plan; not exact products, certifications, frequencies, range evidence, privacy claims or affiliate imagery.'};
credits['assets/images/photos/family-stop-motion-30-minute-no-posting.webp']={title:'Family stop-motion story setup',creator:'Mr Adventure Dad Editorial Desk with OpenAI image generation',source:'Original AI-assisted editorial photography',license:'Copyright Mr Adventure Dad',verified:date,notes:'Phone secured on books, original block character, paper stage, 12-box storyboard, pencil, tape and lamp; no child, app, copyrighted character, upload, result or product claim.'};
write('assets/images/credits.json',JSON.stringify(credits,null,2)+'\n');

insert('photo-credits.html','</section><h2>Additional editorial photography</h2>',pages.map((p,i)=>`<article class="photo-credit-card">${img(p)}<div><h2>${['Classic-car museum family planning','Family two-way radio categories','Family stop-motion story setup'][i]}</h2><p>Original AI-assisted editorial photograph created for Mr Adventure Dad.</p><p>${['Conceptual only; not the named museum, a real exhibit, ticket, access feature or live condition.','Generic fictional categories; not exact products, certification, range, privacy or affiliate evidence.','Exact generic setup; no child, app screen, copyrighted character, upload or claimed result.'][i]}</p></div></article>`).join(''));

write('reports/editorial-decision-2026-11-07.md',`# Editorial decision record — November 7, 2026

## Inventory and duplication gate

The complete production site contained 216 HTML documents before this batch. Every title, slug, heading, description, primary keyword, location, trip angle, commercial category and image was checked, including the previous fourteen days and the separate November 7–8 weekly roundup. No November 7 daily trio existed. A ski-sock guide was rejected because the hiking-sock guide and first-ski-day guide already cover one-sock fit intent. Erie Canal Museum, winter gloves, board games, oral history and daylight/stargazing variants were rejected as existing or near-duplicate intents. The Northeast Classic Car Museum, FRS/GMRS family decision and stop-motion activity have no dedicated page and do not compete with the roundup.

## Search Console decision

The private report was generated November 4, 2026 for October 5 through November 1—three days old and within the eight-day gate. MrAdventureDad.com recorded 660 impressions, 5 clicks, 0.8% CTR and average position 19.5. Folding wagon (23 impressions, one click, position 13.2), Howe Caverns (70/1/9.4), MOST (41/1/13.8) and Letchworth (3/1/9.7) already serve their intents, so derivative pages were rejected. Zero-click Adventures (16 impressions, position 12.2), Destinations (10/0/13.0) and Gear (12/0/19.8) supported stronger hub, homepage, sitemap and reciprocal discovery. One-to-three-impression query fragments, branded noise and isolated weak terms were deliberately ignored.

## Portfolio labels

- **Authority-expansion — Northeast Classic Car Museum With Kids:** a distinct all-weather Norwich destination with a three-room route and current hours, cost, touch, access and pet gates.
- **Authority-expansion — Family Two-Way Radios:** a commercial FRS/GMRS/phone framework grounded in FCC rules, real-route testing, privacy limits and an honest stay-together option.
- **Exploration — 30-Minute Family Stop-Motion Story:** a no-spend creative school-night plan with 12 moves, 24 photos, no app purchase and no posting.

No new page is primarily Data-led because the credible report supports hub discovery and existing page reinforcement rather than an uncovered query. Diversity is preserved across an indoor history destination, a technically grounded communication purchase and a private at-home media-making activity.

## Authority action

The batch creates three citation-ready assets: a three-room museum route, an FCC-grounded four-option communication matrix with a 20-minute failure-point test, and a 12-move no-posting stop-motion card. Nine established guides link back, the three primary hubs are strengthened, and every new page states source dates and fact/inference boundaries.

## Image gate before publication

Three unique final 1600×900 editorial images were visually inspected after WebP conversion against title, body, caption, alt, credit and linked subject. The museum image is explicitly conceptual; the radio image shows fictional unbranded service-category forms and a phone; the stop-motion image shows the exact safe generic setup. There are zero affiliate/product images. A second rendered live pass remains required after deployment.
`);
write('reports/image-qa-2026-11-07.md',`# Image QA — November 7, 2026

## Pass 1: final assets

- 3 unique 1600×900 editorial images visually inspected after final WebP conversion.
- 0 affiliate/product images used.
- Classic-car museum: blank three-room card, vintage-car silhouette cards, shoes, hearing protection, jacket and water; explicitly not the named museum, an exhibit, ticket or live condition.
- Family radios: two fictional compact FRS-style forms, one fictional larger GMRS-style form, phone and blank plan; no logo, exact product, certification, range or privacy claim.
- Stop motion: phone secured on books, original block character, paper stage, 12-box storyboard, pencil, tape and lamp; no child, app, copyrighted character, upload or result claim.
- Titles, final copy, captions, alt text, credits and linked subject/category context checked.

## Pass 2: live rendered

- Pending deployment.
`);
if(!read('reports/search-console-editorial-log.md').includes('# 2026-11-07'))appendFileSync(resolve(root,'reports/search-console-editorial-log.md'),`
# 2026-11-07

- Report generated: 2026-11-04; window 2026-10-05 through 2026-11-01; age three days.
- Used: 660 impressions, 5 clicks, 0.8% CTR and position 19.5, plus zero-click Adventures (16 / 12.2), Destinations (10 / 13.0) and Gear (12 / 19.8), to strengthen three hubs, homepage, sitemap and nine reciprocal paths.
- Deliberately not chased: folding wagon (23 impressions, one click, position 13.2), Howe Caverns (70/1/9.4), MOST (41/1/13.8) and Letchworth (3/1/9.7) already have dedicated pages and support.
- Ignored as weak: one-to-three-impression fragments, branded noise and unstable isolated positions.
- Portfolio: two authority-expansion pages and one exploration; no Data-led new page because the usable evidence was hub-level rather than an uncovered query.
`);
let auth=read('reports/authority-opportunities.md');
if(!auth.includes('## 2026-11-07'))auth+=`
## 2026-11-07

- **Northeast Classic Car Museum** — https://classiccarmuseum.org/contact-us/ — factual-correction and family-access review for the three-room route, especially the conflicting official closing times and current sit-in-car status.
- **New York State Amateur Radio Association council** — https://nysara.org/contact/ — resource-page fit for the FCC-grounded family FRS/GMRS decision card; pitch only the legal-service and range-reality asset, not an endorsement request.
- **Onondaga County Public Library family services** — https://www.onlib.org/contact-us — no-cost media-literacy activity fit for the 12-move, no-posting stop-motion card.

No outreach, submission, account creation or paid placement was performed.
`;
write('reports/authority-opportunities.md',auth);
console.log('Generated exactly three November 7 guides, current homepage time windows, three hubs, nine reciprocal links, sitemap, credits and authority records.');
