import {readFileSync,writeFileSync} from 'node:fs';
import {resolve} from 'node:path';
import {pages} from './content-2026-10-20.mjs';
const root=resolve(process.argv[2]||'.'),date='2026-10-20',start='<!-- DAILY 2026-10-20 -->',end='<!-- END DAILY 2026-10-20 -->';
const read=p=>readFileSync(resolve(root,p),'utf8'),write=(p,s)=>writeFileSync(resolve(root,p),s);
if(pages.length!==3)throw Error('Exactly three October 20 sources required');
// Retain the established, versioned publication design rather than patching generated articles.
const template=read('scripts/publish-daily-2026-10-17.mjs').match(/const pageHtml=p=>(`[\s\S]*?`);\n\nfor\(const p of pages\)/)?.[1];
if(!template)throw Error('Versioned renderer changed');
const render=new Function('date','imageUrl',`return p=>${template}`)(date,n=>`https://mradventuredad.com/assets/images/photos/${n}`);
for(const p of pages){
 let h=render(p).replaceAll('v=20261017','v=20261020').replace(`src="../assets/images/photos/${p.image}"`,`src="../assets/images/photos/${p.image}" width="1600" height="900" style="height:auto"`);
 h=h.replace('<meta name="twitter:card"',`<meta property="og:image:width" content="1600"><meta property="og:image:height" content="900"><meta property="og:image:alt" content="${p.alt}"><meta name="twitter:image:alt" content="${p.alt}"><meta name="twitter:card"`);
 const crumbs={'@context':'https://schema.org','@type':'BreadcrumbList',itemListElement:[{'@type':'ListItem',position:1,name:'Home',item:'https://mradventuredad.com/'},{'@type':'ListItem',position:2,name:'Adventures',item:'https://mradventuredad.com/adventures.html'},{'@type':'ListItem',position:3,name:p.title}]};
 h=h.replace('</head>',`<script type="application/ld+json">${JSON.stringify(crumbs)}</script></head>`);write(`guides/${p.slug}.html`,h);
}
function insert(path,needle,block){let h=read(path).replace(new RegExp(`${start}[\\s\\S]*?${end}`,'g'),'');if(!h.includes(needle))throw Error(path+': insertion marker missing');write(path,h.replace(needle,start+block+end+needle));}
const link=i=>`guides/${pages[i].slug}.html`,img=p=>`<img src="assets/images/photos/${p.image}" width="1600" height="900" style="height:auto;aspect-ratio:16/9;object-fit:contain" alt="${p.alt}" loading="lazy" decoding="async">`;
let home=read('index.html').replace(new RegExp(`${start}[\\s\\S]*?${end}`,'g'),'');
const priorPattern=/<!-- DAILY 2026-10-19 -->[\s\S]*?<!-- END DAILY 2026-10-19 -->/g,prior=home.match(priorPattern)?.[0];home=home.replace(priorPattern,'');if(prior)home=home.replace('<div class="field-archive-content">','<div class="field-archive-content">'+prior);
const options=[
 ['TONIGHT · 20 MINUTES · NO-SPEND',link(2),'Check one claim, then close the tabs','Use the fictional museum cards first. An unanswered question can remain unanswered.'],
 ['WEEKEND · AUBURN · RESERVE THE TOUR',link(0),'Book a guided Seward House visit','Confirm the actual slot, stairs and whole-group cost. This is not a drop-in gallery.'],
 ['BREAK DAY · LOCAL INDOOR PLAN','guides/most-syracuse-with-kids.html','Give the MOST three clear priorities','Use the established visit plan and current operator hours before building the day around it.'],
 ['AT HOME · ONE TABLE · ONE PROJECT',link(1),'Measure before buying a jigsaw','Read the age label and finished dimensions. Borrow a suitable puzzle before buying accessories.'],
 ['LOW ENERGY · FIVE MINUTES',link(2),'Spot the missing word','Compare every Saturday with first Saturday in an explicitly invented notice. No browser needed.'],
 ['NO-TICKET EVENING · CHECK BRANCH HOURS','guides/family-library-night-45-minute-plan.html','Keep a short library night ready','One shelf, one choice and a calm exit still count as a useful Tuesday.']
];
const lead=`<section class="now-plans wrap" aria-labelledby="now-plans-title"><div class="now-plans-head"><div><p class="kicker">FRESH IDEAS · OCTOBER 20, 2026</p><h2 id="now-plans-title">Pick the time you actually have.</h2><p>Book one guided visit, choose a puzzle that fits the table or check one claim at home. The October 17–18 roundup has ended; the separate weekly shortlist owns the next dated events.</p></div><a href="adventures.html">Browse all adventures →</a></div><div class="now-plans-grid">${options.map(o=>`<article class="now-plan"><span>${o[0]}</span><h3><a href="${o[1]}">${o[2]}</a></h3><p>${o[3]}</p></article>`).join('')}</div></section>`;
if(!/<section class="now-plans wrap"[\s\S]*?<section class="intro wrap">/.test(home))throw Error('Homepage lead missing');home=home.replace(/<section class="now-plans wrap"[\s\S]*?<section class="intro wrap">/,lead+'<section class="intro wrap">');
const cards=`${start}<section class="stories wrap"><div class="section-head"><div><p class="kicker">THREE DISTINCT FAMILY NEEDS</p><h2>Book the hour. Measure the table. Check the claim.</h2></div></div><div class="story-grid">${pages.map((p,i)=>`<article class="story-card">${img(p)}<div><span>${['AUBURN · GUIDED TOUR · CONCEPTUAL IMAGE','AT HOME · JIGSAW FIT · GENERIC CATEGORY IMAGE','NO-SPEND · MEDIA LITERACY · CONCEPTUAL IMAGE'][i]}</span><h3><a href="${link(i)}">${p.title}</a></h3><p>${p.description}</p></div></article>`).join('')}</div></section>${end}`;
home=home.replace('<details class="field-archive wrap">',cards+'<details class="field-archive wrap">');write('index.html',home);
insert('adventures.html','<!-- MAD AFFILIATE COMMERCE -->',`<section class="content-section alt"><div class="wrap"><p class="kicker">GUIDED HISTORY · TABLE FIT · SOURCE CHECKS</p><div class="simple-list">${pages.map((p,i)=>`<a href="${link(i)}">${p.title} <b>→</b></a>`).join('')}</div></div></section>`);
for(const [hub,i,kicker] of [['destinations.html',0,'AUBURN · GUIDED HISTORY · CONCEPTUAL IMAGE'],['gear.html',1,'AT HOME · JIGSAW FIT · GENERIC CATEGORY IMAGE']])insert(hub,'</main>',`<section class="content-section alt"><div class="wrap"><p class="kicker">${kicker}</p><div class="card-grid"><article class="card">${img(pages[i])}<div><h3><a href="${link(i)}">${pages[i].title}</a></h3><p>${pages[i].description}</p></div></article></div></div></section>`);
insert('outdoors.html','</main>',`<section class="content-section alt"><div class="wrap"><p class="kicker">WHEN THE FAMILY DAY MOVES INDOORS</p><div class="simple-list">${pages.map((p,i)=>`<a href="${link(i)}">${p.title} <b>→</b></a>`).join('')}</div></div></section>`);
export const reciprocal=[
 ['harriet-tubman-national-historical-park-with-kids',0,'Plan a separate Auburn history day with the Seward House guided-tour booking and access card; do not automatically stack two timed visits.'],
 ['howe-caverns-with-kids',0,'Prefer an above-ground guided history visit closer to Syracuse? Compare the Seward House tour, with its own stairs, timing and booking gate.'],
 ['family-museum-day-system',0,'A guided historic house needs a different plan from free gallery browsing: use the Seward House six-question booking card.'],
 ['family-home-board-games-cooperative-strategy-dexterity-guide',1,'Want shared image-building without turns or a winner? Use the separate jigsaw age-label, finished-size and table-fit guide.'],
 ['family-calendar-reset-20-minute-plan',1,'Protect the table as well as the time: a jigsaw project needs an actual pause-and-storage plan.'],
 ['living-room-picnic-30-minute-family-plan',1,'For another quiet home evening, borrow an appropriate jigsaw and prove the table fit before buying.'],
 ['family-library-night-45-minute-plan',2,'Add one source-checking question at home with the adult-led claim-check lesson; no social account or posting is required.'],
 ['family-oral-history-interview-30-minute-no-posting-plan',2,'Keep recollection separate from online claims: the family claim-check lesson asks who, what evidence and which date or place.'],
 ['family-photo-scavenger-hunt-30-minute-no-posting-plan',2,'A picture needs context too: use the claim-check lesson to separate a convincing image from verified source information.']
];
for(const [slug,i,label] of reciprocal)insert(`guides/${slug}.html`,'</main>',`<aside class="note"><a href="${pages[i].slug}.html"><strong>${label}</strong></a></aside>`);
let map=read('sitemap.xml');for(const p of pages){const url=`https://mradventuredad.com/guides/${p.slug}.html`;if(!map.includes(`<loc>${url}</loc>`))map=map.replace('</urlset>',`  <url><loc>${url}</loc><lastmod>${date}</lastmod></url>\n</urlset>`);}
for(const path of ['','adventures.html','destinations.html','gear.html','outdoors.html',...reciprocal.map(([s])=>`guides/${s}.html`)]){const url='https://mradventuredad.com/'+path;map=map.replace(new RegExp(`(<loc>${url.replaceAll('.','\\.')}</loc><lastmod>)[^<]+`),`$1${date}`);}write('sitemap.xml',map);
const credits=JSON.parse(read('assets/images/credits.json'));for(const p of pages)credits['assets/images/photos/'+p.image]={title:p.alt,creator:'Mr Adventure Dad Editorial Desk with OpenAI image generation',source:'Original AI-assisted conceptual editorial image',license:'Original AI-assisted image; published by Mr Adventure Dad',verified:date,notes:p.caption};write('assets/images/credits.json',JSON.stringify(credits,null,2)+'\n');
insert('photo-credits.html','</section><h2>Additional editorial photography</h2>',pages.map(p=>`<article class="photo-credit-card">${img(p)}<div><h2>${p.title}</h2><p>${p.caption}</p><p>Creator: Mr Adventure Dad Editorial Desk with OpenAI image generation. Original AI-assisted editorial asset, not third-party destination or product photography. Reviewed October 20, 2026.</p></div></article>`).join(''));
console.log('Generated exactly three October 20 guides, homepage time windows, four hubs, nine reciprocal links, sitemap and credits.');
