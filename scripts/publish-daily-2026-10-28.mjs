import {appendFileSync,readFileSync,writeFileSync} from 'node:fs';
import {resolve} from 'node:path';
import {pages} from './content-2026-10-28.mjs';

const root=resolve(process.argv[2]||'.'),date='2026-10-28',start='<!-- DAILY 2026-10-28 -->',end='<!-- END DAILY 2026-10-28 -->';
const read=p=>readFileSync(resolve(root,p),'utf8'),write=(p,s)=>writeFileSync(resolve(root,p),s);
if(pages.length!==3)throw Error('Exactly three October 28 sources required');
const template=read('scripts/publish-daily-2026-10-17.mjs').match(/const pageHtml=p=>(`[\s\S]*?`);\n\nfor\(const p of pages\)/)?.[1];
if(!template)throw Error('Versioned renderer changed');
const render=new Function('date','imageUrl',`return p=>${template}`)(date,n=>`https://mradventuredad.com/assets/images/photos/${n}`);
for(const p of pages){
 let h=render(p).replaceAll('v=20261017','v=20261028').replace(`src="../assets/images/photos/${p.image}"`,`src="../assets/images/photos/${p.image}" width="1600" height="900" style="height:auto"`);
 h=h.replace('<meta name="twitter:card"',`<meta property="og:image:width" content="1600"><meta property="og:image:height" content="900"><meta property="og:image:alt" content="${p.alt}"><meta name="twitter:image:alt" content="${p.alt}"><meta name="twitter:card"`);
 const crumbs={'@context':'https://schema.org','@type':'BreadcrumbList',itemListElement:[{'@type':'ListItem',position:1,name:'Home',item:'https://mradventuredad.com/'},{'@type':'ListItem',position:2,name:'Adventures',item:'https://mradventuredad.com/adventures.html'},{'@type':'ListItem',position:3,name:p.title}]};
 h=h.replace('</head>',`<script type="application/ld+json">${JSON.stringify(crumbs)}</script></head>`);write(`guides/${p.slug}.html`,h);
}
function insert(path,needle,block){let h=read(path).replace(new RegExp(`${start}[\\s\\S]*?${end}`,'g'),'');if(!h.includes(needle))throw Error(path+': insertion marker missing');write(path,h.replace(needle,start+block+end+needle));}
const link=i=>`guides/${pages[i].slug}.html`,img=p=>`<img src="assets/images/photos/${p.image}" width="1600" height="900" style="height:auto;aspect-ratio:16/9;object-fit:contain" alt="${p.alt}" loading="lazy" decoding="async">`;

let home=read('index.html').replace(new RegExp(`${start}[\\s\\S]*?${end}`,'g'),'');
const priorPattern=/<!-- DAILY 2026-10-27 -->[\s\S]*?<!-- END DAILY 2026-10-27 -->/g,prior=home.match(priorPattern)?.[0];home=home.replace(priorPattern,'');if(prior)home=home.replace('<div class="field-archive-content">','<div class="field-archive-content">'+prior);
const options=[
 ['TONIGHT · 25 MINUTES · NO-SPEND',link(2),'Estimate six things, measure once','Use safe tabletop objects, record centimeters, and label the final sketch not to scale.'],
 ['WEEKEND · CURRENT ROUNDUP','weekend-october-31-november-1-2026.html','Use the Halloween-weekend shortlist','The separate Wednesday guide owns current events, tickets and forecasts. Recheck every official source before leaving.'],
 ['HALF DAY · OSWEGO · INDOORS',link(0),'Do the main maritime museum first','Use three exhibit anchors and treat vessels as a separate seasonal decision.'],
 ['COLD-WEATHER PREP · FIT FIRST',link(1),'Test the hat with the coat','Compare a beanie, earflap hat and balaclava without breaking visibility or helmet fit.'],
 ['AT HOME · LOW ENERGY',link(2),'Measure three books','Skip the room outline and sort three measured objects from shortest to longest.'],
 ['BREAK · WEATHER BACKUP','guides/family-museum-day-system.html','Use the three-anchor museum system','Keep a finishable indoor route ready when lake wind, ice or road conditions fail the trip gate.']
];
const lead=`<section class="now-plans wrap" aria-labelledby="now-plans-title"><div class="now-plans-head"><div><p class="kicker">FRESH IDEAS · OCTOBER 28, 2026</p><h2 id="now-plans-title">Pick the time you actually have.</h2><p>Use the current weekend shortlist for dated plans, measure a room safely tonight, or build a focused Oswego maritime visit. Fit winter headwear before cold-weather gear starts fighting the coat or helmet.</p></div><a href="adventures.html">Browse all adventures →</a></div><div class="now-plans-grid">${options.map(o=>`<article class="now-plan"><span>${o[0]}</span><h3><a href="${o[1]}">${o[2]}</a></h3><p>${o[3]}</p></article>`).join('')}</div></section>`;
if(!/<section class="now-plans wrap"[\s\S]*?<section class="intro wrap">/.test(home))throw Error('Homepage lead missing');home=home.replace(/<section class="now-plans wrap"[\s\S]*?<section class="intro wrap">/,lead+'<section class="intro wrap">');
const cards=`${start}<section class="stories wrap"><div class="section-head"><div><p class="kicker">THREE DIFFERENT FAMILY PROBLEMS</p><h2>Look closely. Fit the system. Measure the evidence.</h2></div></div><div class="story-grid">${pages.map((p,i)=>`<article class="story-card">${img(p)}<div><span>${['OSWEGO · GENERIC MARITIME GALLERY IMAGE','WINTER HEADWEAR · GENERIC CATEGORY IMAGE','AT HOME · NO-SPEND MEASUREMENT · CONCEPTUAL IMAGE'][i]}</span><h3><a href="${link(i)}">${p.title}</a></h3><p>${p.description}</p></div></article>`).join('')}</div></section>${end}`;
home=home.replace('<details class="field-archive wrap">',cards+'<details class="field-archive wrap">');write('index.html',home);

insert('adventures.html','<!-- MAD AFFILIATE COMMERCE -->',`<section class="content-section alt"><div class="wrap"><p class="kicker">MARITIME HISTORY · WINTER FIT · NO-SPEND MATH</p><div class="simple-list">${pages.map((p,i)=>`<a href="${link(i)}">${p.title} <b>→</b></a>`).join('')}</div></div></section>`);
insert('destinations.html','</main>',`<section class="content-section alt"><div class="wrap"><p class="kicker">OSWEGO · MAIN BUILDING FIRST · SEASONAL VESSELS</p><div class="card-grid"><article class="card">${img(pages[0])}<div><h3><a href="${link(0)}">${pages[0].title}</a></h3><p>${pages[0].description}</p></div></article></div></div></section>`);
insert('gear.html','</main>',`<section class="content-section alt"><div class="wrap"><p class="kicker">BEANIE · EARFLAP · BALACLAVA · HELMET CHECK</p><div class="card-grid"><article class="card">${img(pages[1])}<div><h3><a href="${link(1)}">${pages[1].title}</a></h3><p>${pages[1].description}</p></div></article></div></div></section>`);
insert('outdoors.html','</main>',`<section class="content-section alt"><div class="wrap"><p class="kicker">OSWEGO PLAN · COLD-WEATHER FIT · HOME MEASUREMENT</p><div class="simple-list"><a href="${link(0)}">${pages[0].title} <b>→</b></a><a href="${link(1)}">${pages[1].title} <b>→</b></a><a href="${link(2)}">${pages[2].title} <b>→</b></a></div></div></section>`);

export const reciprocal=[
 ['fort-ontario-with-kids',0,'Pair Fort Ontario with the H. Lee White Maritime Museum only after verifying both schedules; the museum plan keeps its main building primary.'],
 ['family-museum-day-system',0,'Apply the three-anchor museum system to the H. Lee White visit and treat seasonal vessels as a separate decision.'],
 ['family-outdoor-weather-cutoff-plan',0,'Run the weather cutoff before the Oswego harbor drive; wind, lightning, snow or an icy pier can remove the outdoor add-on.'],
 ['kids-fall-trail-layers-base-fleece-insulation-shell-guide',1,'Finish the clothing system with the winter-hat fit guide: cover the head without blocking vision or breaking a required helmet fit.'],
 ['kids-hiking-gloves-fleece-shell-insulated-guide',1,'Match proven hand protection with a hat that passes the same coat, moisture and stop-signal checks.'],
 ['kids-ice-skates-figure-hockey-adjustable-fit-guide',1,'For rink days, let the activity helmet and its manual control; the winter-hat guide rejects improvised layers under protective equipment.'],
 ['paper-bridge-load-test-25-minute-family-stem',2,'Add the room-measure challenge before a build: estimate, verify and record the unit before testing a paper structure.'],
 ['cardboard-marble-maze-30-minute-family-engineering-build',2,'Use the measurement challenge to compare the maze base and wall lengths without turning the sketch into a construction drawing.'],
 ['family-claim-check-one-headline-20-minute-lesson',2,'The room-measure challenge uses the same evidence habit: keep the estimate visible, verify with a tool and label what the number means.']
];
for(const [slug,i,label] of reciprocal)insert(`guides/${slug}.html`,'</main>',`<aside class="note"><a href="${pages[i].slug}.html"><strong>${label}</strong></a></aside>`);

let map=read('sitemap.xml');for(const p of pages){const url=`https://mradventuredad.com/guides/${p.slug}.html`;if(!map.includes(`<loc>${url}</loc>`))map=map.replace('</urlset>',`  <url><loc>${url}</loc><lastmod>${date}</lastmod></url>\n</urlset>`);}
for(const path of ['','adventures.html','destinations.html','gear.html','outdoors.html',...reciprocal.map(([s])=>`guides/${s}.html`)]){const url='https://mradventuredad.com/'+path;map=map.replace(new RegExp(`(<loc>${url.replaceAll('.','\\.')}</loc><lastmod>)[^<]+`),`$1${date}`);}write('sitemap.xml',map);

const credits=JSON.parse(read('assets/images/credits.json'));for(const p of pages)credits['assets/images/photos/'+p.image]={title:p.alt,creator:'Mr Adventure Dad Editorial Desk with OpenAI image generation',source:'Original AI-assisted conceptual editorial image',license:'Original AI-assisted image; published by Mr Adventure Dad',verified:date,notes:p.caption};write('assets/images/credits.json',JSON.stringify(credits,null,2)+'\n');
insert('photo-credits.html','</section><h2>Additional editorial photography</h2>',pages.map(p=>`<article class="photo-credit-card">${img(p)}<div><h2>${p.title}</h2><p>${p.caption}</p><p>Creator: Mr Adventure Dad Editorial Desk with OpenAI image generation. Original AI-assisted editorial asset, not third-party destination or exact product photography. Reviewed October 28, 2026.</p></div></article>`).join(''));

write('reports/editorial-decision-2026-10-28.md',`# Editorial decision record — October 28, 2026

## Inventory and duplication gate

The complete inventory contained 185 HTML pages before this batch. Existing titles, slugs, intents, locations, commercial categories, section angles and image records were checked, including October 14–27 and the separate October 31–November 1 roundup published today. Another Howe Caverns, MOST, folding-wagon, binocular, waterfall, packing or dated-event variation was rejected. The maritime museum adds a distinct Oswego indoor-history plan; winter hats add a headwear/helmet-compatibility decision; the room-measure challenge adds no-spend estimation and spatial evidence. No October 28 daily trio existed.

## Search Console decision

The private report was generated October 21, 2026 for September 21–October 18. MrAdventureDad.com recorded 781 impressions, 9 clicks, 1.15% CTR and average position 14.02. Howe Caverns (103 impressions / 2 clicks / position 8.7), MOST (45 / 1 / 15.47) and folding wagons (28 / 1 / 10.32) remain credible, but each already received distinct support. The binocular query family already has a ranking guide, while seven travel-bag impressions and one- or two-impression fragments were too weak to steer another page. No item today is labeled Data-led. The contradictory zero-indexed/153-submitted sitemap row remains a discovery warning, so homepage, four hubs, sitemap and nine reciprocal paths were strengthened.

## Portfolio labels

- **Authority-expansion — H. Lee White Maritime Museum With Kids:** a current official-source Oswego plan separating the main building from seasonal vessels and reserved lighthouse tours.
- **Authority-expansion — Kids’ Winter Hats:** a commercially useful no-buy-first framework comparing beanies, earflap hats and balaclavas with moisture, drawstring, vision and helmet-manual gates.
- **Exploration — Family Room-Measure Challenge:** a no-spend school-night estimation and measurement activity grounded in NIST learning resources.

The trio is deliberately diverse in place, intent and format: a regional indoor destination, a cold-weather purchase decision and an at-home math activity. No page competes with the separate weekly event roundup.

## Authority action

Three citation-ready tools were created: a three-anchor maritime museum route, an eight-step headwear fit test and a six-object measurement evidence card. Nine established pages now link back contextually. Primary sourcing, dated review, explicit uncertainty, correction routes, image labels and commercial separation strengthen trust.

## Qualified opportunities — log only; no outreach sent

1. **H. Lee White Maritime Museum** — https://hlwmm.org/pages/contact — factual-correction angle for the independent main-building-first family route; invite corrections without asking for endorsement.
2. **Oswego County Tourism** — https://visitoswegocounty.com/contact/ — family-resource angle for an indoor maritime plan that sends hours, vessel access and accessibility questions back to the museum.
3. **NIST Office of Weights and Measures** — https://www.nist.gov/pml/owm/contact-us — educational-resource angle for the no-spend estimate/measure/record activity with direct NIST attribution.

## Image gate before publication

Three unique 1600×900 editorial images were visually inspected against final titles, copy, captions, alt text, credits and linked context. The maritime image is explicitly conceptual and not destination evidence; the headwear image shows the three exact generic categories plus a separate helmet without implying compatibility; the measurement image shows a safe supervised activity and no private or construction data. Zero affiliate/product images are used. A second live rendered pass remains required.
`);
write('reports/image-qa-2026-10-28.md',`# Image QA — October 28, 2026\n\n## Pass 1: pre-publication\n\n- 3 unique 1600×900 editorial images visually inspected after final WebP conversion.\n- 0 affiliate/product images used.\n- Final title, copy, caption, alt, credit and linked destination/category context checked for all three assets.\n- Maritime museum image: generic conceptual maritime-history gallery; explicitly not the named museum, real exhibits, harbor, access or live conditions.\n- Winter-hat image: generic unbranded beanie, earflap and balaclava categories beside a separate helmet; no exact product, warmth, certification or compatibility claim.\n- Measurement image: generic supervised estimate/measure/sketch activity; no private dimensions, readable data, construction or engineering claim.\n\n## Pass 2: live rendered\n\n- Pending deployment.\n`);
if(!read('reports/search-console-editorial-log.md').includes('# 2026-10-28'))appendFileSync(resolve(root,'reports/search-console-editorial-log.md'),`\n# 2026-10-28\n\n- Report generated: 2026-10-21; window 2026-09-21 through 2026-10-18.\n- Used: overall discovery and CTR weakness to strengthen homepage, four hubs, sitemap and nine reciprocal links.\n- Deliberately not chased: Howe Caverns (103 impressions / 2 clicks), MOST (45 / 1) and folding wagons (28 / 1) already received distinct support; binocular intent already has a ranking guide.\n- Ignored as weak: seven-impression travel-bag activity and one- or two-impression fragments.\n- Portfolio: two authority-expansion items and one exploration; no derivative data-led page and no overlap with the October 31–November 1 roundup.\n`);
let auth=read('reports/authority-opportunities.md');if(!auth.includes('## 2026-10-28'))auth+=`\n## 2026-10-28\n\n- **H. Lee White Maritime Museum** — https://hlwmm.org/pages/contact — factual-correction angle for the independent main-building-first family route; invite corrections without asking for endorsement.\n- **Oswego County Tourism** — https://visitoswegocounty.com/contact/ — family-resource angle for an indoor maritime plan that sends hours, vessel access and accessibility questions back to the museum.\n- **NIST Office of Weights and Measures** — https://www.nist.gov/pml/owm/contact-us — educational-resource angle for the no-spend estimate/measure/record activity with direct NIST attribution.\n\nNo outreach, submission or account creation was performed.\n`;write('reports/authority-opportunities.md',auth);
console.log('Generated exactly three October 28 guides, homepage time windows, four hubs, nine reciprocal links, sitemap, credits and authority records.');
