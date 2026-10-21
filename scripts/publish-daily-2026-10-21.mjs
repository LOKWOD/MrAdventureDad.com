import {readFileSync,writeFileSync} from 'node:fs';
import {resolve} from 'node:path';
import {pages} from './content-2026-10-21.mjs';
const root=resolve(process.argv[2]||'.'),date='2026-10-21',start='<!-- DAILY 2026-10-21 -->',end='<!-- END DAILY 2026-10-21 -->';
const read=p=>readFileSync(resolve(root,p),'utf8'),write=(p,s)=>writeFileSync(resolve(root,p),s);
if(pages.length!==3)throw Error('Exactly three October 21 sources required');
const template=read('scripts/publish-daily-2026-10-17.mjs').match(/const pageHtml=p=>(`[\s\S]*?`);\n\nfor\(const p of pages\)/)?.[1];
if(!template)throw Error('Versioned renderer changed');
const render=new Function('date','imageUrl',`return p=>${template}`)(date,n=>`https://mradventuredad.com/assets/images/photos/${n}`);
for(const p of pages){
 let h=render(p).replaceAll('v=20261017','v=20261021').replace(`src="../assets/images/photos/${p.image}"`,`src="../assets/images/photos/${p.image}" width="1600" height="900" style="height:auto"`);
 h=h.replace('<meta name="twitter:card"',`<meta property="og:image:width" content="1600"><meta property="og:image:height" content="900"><meta property="og:image:alt" content="${p.alt}"><meta name="twitter:image:alt" content="${p.alt}"><meta name="twitter:card"`);
 const crumbs={'@context':'https://schema.org','@type':'BreadcrumbList',itemListElement:[{'@type':'ListItem',position:1,name:'Home',item:'https://mradventuredad.com/'},{'@type':'ListItem',position:2,name:'Adventures',item:'https://mradventuredad.com/adventures.html'},{'@type':'ListItem',position:3,name:p.title}]};
 h=h.replace('</head>',`<script type="application/ld+json">${JSON.stringify(crumbs)}</script></head>`);write(`guides/${p.slug}.html`,h);
}
function insert(path,needle,block){let h=read(path).replace(new RegExp(`${start}[\\s\\S]*?${end}`,'g'),'');if(!h.includes(needle))throw Error(path+': insertion marker missing');write(path,h.replace(needle,start+block+end+needle));}
const link=i=>`guides/${pages[i].slug}.html`,img=p=>`<img src="assets/images/photos/${p.image}" width="1600" height="900" style="height:auto;aspect-ratio:16/9;object-fit:contain" alt="${p.alt}" loading="lazy" decoding="async">`;
let home=read('index.html').replace(new RegExp(`${start}[\\s\\S]*?${end}`,'g'),'');
const priorPattern=/<!-- DAILY 2026-10-20 -->[\s\S]*?<!-- END DAILY 2026-10-20 -->/g,prior=home.match(priorPattern)?.[0];home=home.replace(priorPattern,'');if(prior)home=home.replace('<div class="field-archive-content">','<div class="field-archive-content">'+prior);
const options=[
 ['TONIGHT · 30 MINUTES · NO-SPEND',link(2),'Make a no-burial time capsule','Copy, label and store six replaceable items. Nobody loses control of a private memory.'],
 ['WEEKEND · DATED SHORTLIST','weekend-october-24-25-2026.html','Use the October 24–25 roundup','The separate weekly guide owns current event dates, tickets and organizer checks.'],
 ['BREAK DAY · LONG DRIVE · SHORT HIKE',link(1),'Use Stony Brook’s current lower-gorge route','Confirm the open out-and-back and turn at the posted point. The full gorge is not open.'],
 ['AT HOME · CAMPING DECISION',link(0),'Measure pads inside the real tent','Compare tested R-value, body fit, valve burden and repair reality before buying.'],
 ['LOW ENERGY · FIVE MINUTES',link(2),'Seal one favorites envelope','One dated list and one future question count. Use a drawer, not the backyard.'],
 ['AFTER SCHOOL · 20 MINUTES','guides/family-claim-check-one-headline-20-minute-lesson.html','Check one calm claim','Ask who is behind it, what evidence is shown and when or where it applies.']
];
const lead=`<section class="now-plans wrap" aria-labelledby="now-plans-title"><div class="now-plans-head"><div><p class="kicker">FRESH IDEAS · OCTOBER 21, 2026</p><h2 id="now-plans-title">Pick the time you actually have.</h2><p>Make one small memory, plan one honest gorge route or solve the cold-ground problem before the next campout. The separate weekend roundup owns this week’s dated events.</p></div><a href="adventures.html">Browse all adventures →</a></div><div class="now-plans-grid">${options.map(o=>`<article class="now-plan"><span>${o[0]}</span><h3><a href="${o[1]}">${o[2]}</a></h3><p>${o[3]}</p></article>`).join('')}</div></section>`;
if(!/<section class="now-plans wrap"[\s\S]*?<section class="intro wrap">/.test(home))throw Error('Homepage lead missing');home=home.replace(/<section class="now-plans wrap"[\s\S]*?<section class="intro wrap">/,lead+'<section class="intro wrap">');
const cards=`${start}<section class="stories wrap"><div class="section-head"><div><p class="kicker">THREE DISTINCT FAMILY NEEDS</p><h2>Insulate the night. Respect the turnaround. Save the memory.</h2></div></div><div class="story-grid">${pages.map((p,i)=>`<article class="story-card">${img(p)}<div><span>${['CAMPING · PAD DECISION · GENERIC CATEGORY IMAGE','DANSVILLE · CURRENT ROUTE · CONCEPTUAL IMAGE','NO-SPEND · MEMORY PROJECT · CONCEPTUAL IMAGE'][i]}</span><h3><a href="${link(i)}">${p.title}</a></h3><p>${p.description}</p></div></article>`).join('')}</div></section>${end}`;
home=home.replace('<details class="field-archive wrap">',cards+'<details class="field-archive wrap">');write('index.html',home);
insert('adventures.html','<!-- MAD AFFILIATE COMMERCE -->',`<section class="content-section alt"><div class="wrap"><p class="kicker">CAMPING FIT · CURRENT GORGE ROUTE · NO-SPEND MEMORY</p><div class="simple-list">${pages.map((p,i)=>`<a href="${link(i)}">${p.title} <b>→</b></a>`).join('')}</div></div></section>`);
for(const [hub,i,kicker] of [['gear.html',0,'CAMPING · PAD DECISION · GENERIC CATEGORY IMAGE'],['destinations.html',1,'DANSVILLE · CURRENT ROUTE · CONCEPTUAL IMAGE']])insert(hub,'</main>',`<section class="content-section alt"><div class="wrap"><p class="kicker">${kicker}</p><div class="card-grid"><article class="card">${img(pages[i])}<div><h3><a href="${link(i)}">${pages[i].title}</a></h3><p>${pages[i].description}</p></div></article></div></div></section>`);
insert('outdoors.html','</main>',`<section class="content-section alt"><div class="wrap"><p class="kicker">SLEEP SYSTEM · TRAIL DECISION · AT-HOME FALLBACK</p><div class="simple-list">${pages.map((p,i)=>`<a href="${link(i)}">${p.title} <b>→</b></a>`).join('')}</div></div></section>`);
export const reciprocal=[
 ['family-camping-sleep-system-guide',0,'Choose the ground layer with the dedicated sleeping-pad R-value, tent-fit and repair gate.'],
 ['kids-sleeping-bag-temperature-rating-fit-fill-guide',0,'A bag rating cannot replace ground insulation: compare foam, self-inflating and insulated air pads separately.'],
 ['one-night-camping-with-kids',0,'Before the overnight, make every family pad pass the full-tent layout and darkened-room exit test.'],
 ['letchworth-state-park-with-kids',1,'For another western New York gorge day, compare Stony Brook’s currently limited lower-gorge out-and-back.'],
 ['watkins-glen-with-kids',1,'Do not transfer one gorge’s stairs or seasonal status to another: use the current Stony Brook route card separately.'],
 ['family-outdoor-weather-cutoff-plan',1,'Apply the five-gate Stony Brook decision before the long drive: trail, weather, mobility, daylight and energy all must pass.'],
 ['family-oral-history-interview-30-minute-no-posting-plan',2,'Turn one consenting copied memory into a no-burial time capsule with an inventory and private opening rule.'],
 ['family-photo-scavenger-hunt-30-minute-no-posting-plan',2,'Preserve a duplicate, not the only image: the time-capsule plan adds labels, consent and stable indoor storage.'],
 ['family-claim-check-one-headline-20-minute-lesson',2,'A copied artifact needs context too: the time-capsule inventory records what it is, when it was made and why it matters.']
];
for(const [slug,i,label] of reciprocal)insert(`guides/${slug}.html`,'</main>',`<aside class="note"><a href="${pages[i].slug}.html"><strong>${label}</strong></a></aside>`);
let map=read('sitemap.xml');for(const p of pages){const url=`https://mradventuredad.com/guides/${p.slug}.html`;if(!map.includes(`<loc>${url}</loc>`))map=map.replace('</urlset>',`  <url><loc>${url}</loc><lastmod>${date}</lastmod></url>\n</urlset>`);}
for(const path of ['','adventures.html','destinations.html','gear.html','outdoors.html',...reciprocal.map(([s])=>`guides/${s}.html`)]){const url='https://mradventuredad.com/'+path;map=map.replace(new RegExp(`(<loc>${url.replaceAll('.','\\.')}</loc><lastmod>)[^<]+`),`$1${date}`);}write('sitemap.xml',map);
const credits=JSON.parse(read('assets/images/credits.json'));for(const p of pages)credits['assets/images/photos/'+p.image]={title:p.alt,creator:'Mr Adventure Dad Editorial Desk with OpenAI image generation',source:'Original AI-assisted conceptual editorial image',license:'Original AI-assisted image; published by Mr Adventure Dad',verified:date,notes:p.caption};write('assets/images/credits.json',JSON.stringify(credits,null,2)+'\n');
insert('photo-credits.html','</section><h2>Additional editorial photography</h2>',pages.map(p=>`<article class="photo-credit-card">${img(p)}<div><h2>${p.title}</h2><p>${p.caption}</p><p>Creator: Mr Adventure Dad Editorial Desk with OpenAI image generation. Original AI-assisted editorial asset, not third-party destination or exact product photography. Reviewed October 21, 2026.</p></div></article>`).join(''));
let auth=read('reports/authority-opportunities.md');if(!auth.includes('## 2026-10-21'))auth+=`\n## 2026-10-21\n\n- **New York State Parks — Stony Brook State Park** — https://parks.ny.gov/visit/state-parks/stony-brook-state-park (public park contact: 585-335-8111) — current lower-gorge out-and-back decision card; factual-correction, trail-status and family-accessibility resource angle.\n- **Library of Congress Preservation Directorate** — https://www.loc.gov/preservation/about/contact/ — no-burial six-item family time-capsule checklist; household-preservation education and factual-correction angle.\n- **Leave No Trace educational resources** — https://lnt.org/contact/ — family turnaround, stay-on-trail and no-gorge-wading decision framework; practical family outdoor-ethics resource angle.\n\nNo outreach, submission or account creation was performed.\n`;write('reports/authority-opportunities.md',auth);
console.log('Generated exactly three October 21 guides, homepage time windows, four hubs, nine reciprocal links, sitemap and credits.');
