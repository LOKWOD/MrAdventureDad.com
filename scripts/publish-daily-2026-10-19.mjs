import {readFileSync,writeFileSync} from 'node:fs';
import {resolve} from 'node:path';
import {pages} from './content-2026-10-19.mjs';
const root=resolve(process.argv[2]||'.'),date='2026-10-19',start='<!-- DAILY 2026-10-19 -->',end='<!-- END DAILY 2026-10-19 -->';
const read=p=>readFileSync(resolve(root,p),'utf8'),write=(p,s)=>writeFileSync(resolve(root,p),s);
if(pages.length!==3)throw Error('Exactly three October 19 sources required');
const source=read('scripts/publish-daily-2026-10-17.mjs');
const template=source.match(/const pageHtml=p=>(`[\s\S]*?`);\n\nfor\(const p of pages\)/)?.[1];
if(!template)throw Error('Versioned source renderer changed');
const render=new Function('date','imageUrl',`return p=>${template}`)(date,n=>`https://mradventuredad.com/assets/images/photos/${n}`);
for(const [i,p] of pages.entries()){
 let h=render(p).replaceAll('v=20261017','v=20261019').replace(`src="../assets/images/photos/${p.image}"`,`src="../assets/images/photos/${p.image}" width="1600" height="900" style="height:auto"`);
 h=h.replace('<meta name="twitter:card"',`<meta property="og:image:width" content="1600"><meta property="og:image:height" content="900"><meta property="og:image:alt" content="${p.alt}"><meta name="twitter:image:alt" content="${p.alt}"><meta name="twitter:card"`);
 const crumbs={"@context":"https://schema.org","@type":"BreadcrumbList",itemListElement:[{"@type":"ListItem",position:1,name:'Home',item:'https://mradventuredad.com/'},{"@type":"ListItem",position:2,name:'Adventures',item:'https://mradventuredad.com/adventures.html'},{"@type":"ListItem",position:3,name:p.title}]};
 h=h.replace('</head>',`<script type="application/ld+json">${JSON.stringify(crumbs)}</script>${i===0?'<link rel="stylesheet" href="../assets/css/membership-break-even.css"><script type="module" src="../assets/js/membership-break-even.mjs"></script>':''}</head>`);
 write(`guides/${p.slug}.html`,h);
}
function insert(path,needle,block){let h=read(path).replace(new RegExp(`${start}[\\s\\S]*?${end}`,'g'),'');if(!h.includes(needle))throw Error(path+': insertion marker missing');write(path,h.replace(needle,start+block+end+needle));}
const link=i=>`guides/${pages[i].slug}.html`;
const img=p=>`<img src="assets/images/photos/${p.image}" width="1600" height="900" style="height:auto;aspect-ratio:16/9;object-fit:contain" alt="${p.alt}" loading="lazy" decoding="async">`;
let home=read('index.html').replace(new RegExp(`${start}[\\s\\S]*?${end}`,'g'),'');
const old=/<!-- DAILY 2026-10-18 -->[\s\S]*?<!-- END DAILY 2026-10-18 -->/g,prior=home.match(old)?.[0];home=home.replace(old,'');
if(prior)home=home.replace('<div class="field-archive-content">','<div class="field-archive-content">'+prior);
const options=[
 ['TONIGHT · 30 MINUTES · USE OWNED SUPPLIES',link(2),'Practice one button repair','Start on scrap. Let the adult manage the sharp tools and count the needle back.'],
 ['WEEKEND · BOOK HELP BEFORE TRAVEL',link(1),'Try a rental-first climbing visit','Confirm ages, supervision, whole-group cost and staff availability with the Syracuse gym.'],
 ['BREAK DAY · LOCAL INDOOR PLAN','guides/most-syracuse-with-kids.html','Keep a focused MOST visit','Choose a manageable museum route. Membership does not replace a current-hours check.'],
 ['AT HOME · 20-MINUTE PURCHASE CHECK',link(0),'Do the membership math first','Use actual household eligibility, current prices and real return dates—not imaginary savings.'],
 ['LOW ENERGY · FIVE MINUTES',link(2),'Find the spare button and stop','Compare its fit with the buttonhole. Save sharp-tool work for a rested, supervised session.'],
 ['NO-TICKET EVENING · CHECK BRANCH HOURS','guides/family-library-night-45-minute-plan.html','Use the library-night plan','One shelf, one choice and a clear exit can be enough for a Monday.']
];
const lead=`<section class="now-plans wrap" aria-labelledby="now-plans-title"><div class="now-plans-head"><div><p class="kicker">FRESH IDEAS · OCTOBER 19, 2026</p><h2 id="now-plans-title">Pick the time you actually have.</h2><p>A useful home repair, a first climbing visit or a clear membership decision. Pick the block that fits. The October 17–18 event roundup has ended; the separate weekly shortlist will own the next dated events.</p></div><a href="adventures.html">Browse all adventures →</a></div><div class="now-plans-grid">${options.map(o=>`<article class="now-plan"><span>${o[0]}</span><h3><a href="${o[1]}">${o[2]}</a></h3><p>${o[3]}</p></article>`).join('')}</div></section>`;
if(!/<section class="now-plans wrap"[\s\S]*?<section class="intro wrap">/.test(home))throw Error('Homepage lead missing');
home=home.replace(/<section class="now-plans wrap"[\s\S]*?<section class="intro wrap">/,lead+'<section class="intro wrap">');
const cards=`${start}<section class="stories wrap"><div class="section-head"><div><p class="kicker">THREE DISTINCT FAMILY NEEDS</p><h2>Check the value. Try a climb. Repair one thing.</h2></div></div><div class="story-grid">${pages.map((p,i)=>`<article class="story-card">${img(p)}<div><span>${['LOCAL MEMBERSHIP · REAL RETURN DATES','FIRST CLIMB · RENT AND LEARN','AT HOME · PRACTICAL REPAIR'][i]}</span><h3><a href="${link(i)}">${p.title}</a></h3><p>${p.description}</p></div></article>`).join('')}</div></section>${end}`;
home=home.replace('<details class="field-archive wrap">',cards+'<details class="field-archive wrap">');write('index.html',home);
insert('adventures.html','<!-- MAD AFFILIATE COMMERCE -->',`<section class="content-section alt"><div class="wrap"><p class="kicker">MEMBERSHIP MATH · FIRST CLIMB · REPAIR SKILL</p><div class="simple-list">${pages.map((p,i)=>`<a href="${link(i)}">${p.title} <b>→</b></a>`).join('')}</div></div></section>`);
for(const [hub,i,kicker] of [['destinations.html',1,'SYRACUSE · RENTAL-FIRST CLIMBING'],['gear.html',2,'DAD SYSTEMS · USE A SMALL OWNED KIT']])insert(hub,'</main>',`<section class="content-section alt"><div class="wrap"><p class="kicker">${kicker}</p><div class="card-grid"><article class="card">${img(pages[i])}<div><h3><a href="${link(i)}">${pages[i].title}</a></h3><p>${pages[i].description}</p></div></article></div></div></section>`);
insert('outdoors.html','</main>',`<section class="content-section alt"><div class="wrap"><p class="kicker">WHEN THE DAY MOVES INDOORS</p><div class="simple-list">${pages.map((p,i)=>`<a href="${link(i)}">${p.title} <b>→</b></a>`).join('')}</div></div></section>`);
export const reciprocal=[
 ['most-syracuse-with-kids',0,'Thinking about repeat visits? Use the membership break-even calculator before buying a year.'],
 ['rosamond-gifford-zoo-with-kids',0,'Compare actual household admission with the zoo membership tier and your realistic return dates.'],
 ['family-museum-day-system',0,'Separate a good museum day from a good annual purchase with the membership-value worksheet.'],
 ['syracuse-family-outing-picker-most-zoo-erie-canal-museum',1,'For a different active indoor need, use the rental-first Central Rock Gym call sheet and first-visit plan.'],
 ['one-on-one-dad-day',1,'A first climbing visit can stay small: book the right help, rent the equipment and let the child stop.'],
 ['first-ski-day-with-kids',1,'Trying a different first sport indoors? Keep instruction and equipment fit ahead of the ambition at Central Rock Gym.'],
 ['kids-fall-trail-layers-base-fleece-insulation-shell-guide',2,'An ordinary loose shirt button can become a supervised scrap-first repair lesson; do not alter safety equipment.'],
 ['family-field-sketch-kit-pouch-case-clipboard-guide',2,'Apply the small-kit principle at home with one supervised button repair and counted-tool cleanup.'],
 ['family-calendar-reset-20-minute-plan',2,'Protect a short practical-skill block: practice on scrap, then decide whether a real shirt is ready for repair.']
];
for(const [slug,i,label] of reciprocal)insert(`guides/${slug}.html`,'</main>',`<aside class="note"><a href="${pages[i].slug}.html"><strong>${label}</strong></a></aside>`);
let map=read('sitemap.xml');for(const p of pages){const url=`https://mradventuredad.com/guides/${p.slug}.html`;if(!map.includes(`<loc>${url}</loc>`))map=map.replace('</urlset>',`  <url><loc>${url}</loc><lastmod>${date}</lastmod></url>\n</urlset>`);}
for(const path of ['','adventures.html','destinations.html','gear.html','outdoors.html']){const url='https://mradventuredad.com/'+path;map=map.replace(new RegExp(`(<loc>${url.replaceAll('.','\\.')}</loc><lastmod>)[^<]+`),`$1${date}`);}write('sitemap.xml',map);
const credits=JSON.parse(read('assets/images/credits.json'));for(const p of pages)credits['assets/images/photos/'+p.image]={title:p.alt,creator:'Mr Adventure Dad Editorial Desk with OpenAI image generation',source:'Original AI-assisted conceptual editorial image',license:'Copyright Mr Adventure Dad',verified:date,notes:p.caption};write('assets/images/credits.json',JSON.stringify(credits,null,2)+'\n');
insert('photo-credits.html','</section><h2>Additional editorial photography</h2>',pages.map(p=>`<article class="photo-credit-card">${img(p)}<div><h2>${p.title}</h2><p>${p.caption}</p><p>Creator: Mr Adventure Dad Editorial Desk with OpenAI image generation. Original editorial asset; Copyright Mr Adventure Dad. Reviewed October 19, 2026.</p></div></article>`).join(''));
console.log('Generated exactly three October 19 pages, calculator, homepage time windows, four hubs, nine reciprocal links, sitemap and credits.');
