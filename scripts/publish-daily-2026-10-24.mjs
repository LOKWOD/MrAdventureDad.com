import {appendFileSync,readFileSync,writeFileSync} from 'node:fs';
import {resolve} from 'node:path';
import {pages} from './content-2026-10-24.mjs';
const root=resolve(process.argv[2]||'.'),date='2026-10-24',start='<!-- DAILY 2026-10-24 -->',end='<!-- END DAILY 2026-10-24 -->';
const read=p=>readFileSync(resolve(root,p),'utf8'),write=(p,s)=>writeFileSync(resolve(root,p),s);
if(pages.length!==3)throw Error('Exactly three October 24 sources required');
const template=read('scripts/publish-daily-2026-10-17.mjs').match(/const pageHtml=p=>(`[\s\S]*?`);\n\nfor\(const p of pages\)/)?.[1];
if(!template)throw Error('Versioned renderer changed');
const render=new Function('date','imageUrl',`return p=>${template}`)(date,n=>`https://mradventuredad.com/assets/images/photos/${n}`);
for(const p of pages){
 let h=render(p).replaceAll('v=20261017','v=20261024').replace(`src="../assets/images/photos/${p.image}"`,`src="../assets/images/photos/${p.image}" width="1600" height="900" style="height:auto"`);
 h=h.replace('<meta name="twitter:card"',`<meta property="og:image:width" content="1600"><meta property="og:image:height" content="900"><meta property="og:image:alt" content="${p.alt}"><meta name="twitter:image:alt" content="${p.alt}"><meta name="twitter:card"`);
 const crumbs={'@context':'https://schema.org','@type':'BreadcrumbList',itemListElement:[{'@type':'ListItem',position:1,name:'Home',item:'https://mradventuredad.com/'},{'@type':'ListItem',position:2,name:'Adventures',item:'https://mradventuredad.com/adventures.html'},{'@type':'ListItem',position:3,name:p.title}]};
 h=h.replace('</head>',`<script type="application/ld+json">${JSON.stringify(crumbs)}</script></head>`);write(`guides/${p.slug}.html`,h);
}
function insert(path,needle,block){let h=read(path).replace(new RegExp(`${start}[\\s\\S]*?${end}`,'g'),'');if(!h.includes(needle))throw Error(path+': insertion marker missing');write(path,h.replace(needle,start+block+end+needle));}
const link=i=>`guides/${pages[i].slug}.html`,img=p=>`<img src="assets/images/photos/${p.image}" width="1600" height="900" style="height:auto;aspect-ratio:16/9;object-fit:contain" alt="${p.alt}" loading="lazy" decoding="async">`;

let home=read('index.html').replace(new RegExp(`${start}[\\s\\S]*?${end}`,'g'),'');
const priorPattern=/<!-- DAILY 2026-10-23 -->[\s\S]*?<!-- END DAILY 2026-10-23 -->/g,prior=home.match(priorPattern)?.[0];home=home.replace(priorPattern,'');if(prior)home=home.replace('<div class="field-archive-content">','<div class="field-archive-content">'+prior);
const options=[
 ['TONIGHT · 25 MINUTES · NO-SPEND',link(2),'Read five care labels, wash nothing','Sort by the strictest instruction while every detergent and machine stays out of the lesson.'],
 ['WEEKEND · DATED SHORTLIST','weekend-october-24-25-2026.html','Use the October 24–25 roundup','The separate weekly guide owns current event dates, tickets and organizer checks.'],
 ['BREAK DAY · ROCHESTER · INDOORS',link(0),'Use two museum floors, lunch, then decide','Make one after-lunch choice: a third floor, a booked planetarium show, or the drive home.'],
 ['AT HOME · WINTER GEAR',link(1),'Run the sock, walk and dry tests','Compare pac, snow and winter-hiking boots only after the activity and fit gates.'],
 ['LOW ENERGY · ONE GARMENT',link(2),'Find wash, dry and one warning','One correct label translation is enough; return the garment and stop.'],
 ['AFTER SCHOOL · 30 MINUTES','guides/flashlight-shadow-lab-30-minute-family-science.html','Run a private light-and-shadow lab','Use the closer no-spend science option when the drive or museum plan is too much.']
];
const lead=`<section class="now-plans wrap" aria-labelledby="now-plans-title"><div class="now-plans-head"><div><p class="kicker">FRESH IDEAS · OCTOBER 24, 2026</p><h2 id="now-plans-title">Pick the time you actually have.</h2><p>Build one finishable science-museum day, fit winter boots with the real sock, or teach care-label judgment without touching detergent. The separate weekend roundup owns this week's dated events.</p></div><a href="adventures.html">Browse all adventures →</a></div><div class="now-plans-grid">${options.map(o=>`<article class="now-plan"><span>${o[0]}</span><h3><a href="${o[1]}">${o[2]}</a></h3><p>${o[3]}</p></article>`).join('')}</div></section>`;
if(!/<section class="now-plans wrap"[\s\S]*?<section class="intro wrap">/.test(home))throw Error('Homepage lead missing');home=home.replace(/<section class="now-plans wrap"[\s\S]*?<section class="intro wrap">/,lead+'<section class="intro wrap">');
const cards=`${start}<section class="stories wrap"><div class="section-head"><div><p class="kicker">THREE DISTINCT FAMILY NEEDS</p><h2>Pick two floors. Fit the sock. Read the label.</h2></div></div><div class="story-grid">${pages.map((p,i)=>`<article class="story-card">${img(p)}<div><span>${['ROCHESTER · SCIENCE DAY · CONCEPTUAL IMAGE','WINTER BOOTS · CATEGORY GUIDE · GENERIC IMAGE','AT HOME · NO-SPEND SKILL · CONCEPTUAL IMAGE'][i]}</span><h3><a href="${link(i)}">${p.title}</a></h3><p>${p.description}</p></div></article>`).join('')}</div></section>${end}`;
home=home.replace('<details class="field-archive wrap">',cards+'<details class="field-archive wrap">');write('index.html',home);

insert('adventures.html','<!-- MAD AFFILIATE COMMERCE -->',`<section class="content-section alt"><div class="wrap"><p class="kicker">SCIENCE DAY · WINTER FIT · HOME SKILL</p><div class="simple-list">${pages.map((p,i)=>`<a href="${link(i)}">${p.title} <b>→</b></a>`).join('')}</div></div></section>`);
insert('gear.html','</main>',`<section class="content-section alt"><div class="wrap"><p class="kicker">REAL SOCK · CLEAN WALK · DRYING PLAN</p><div class="card-grid"><article class="card">${img(pages[1])}<div><h3><a href="${link(1)}">${pages[1].title}</a></h3><p>${pages[1].description}</p></div></article></div></div></section>`);
insert('destinations.html','</main>',`<section class="content-section alt"><div class="wrap"><p class="kicker">ROCHESTER · TWO FLOORS · LUNCH HINGE</p><div class="card-grid"><article class="card">${img(pages[0])}<div><h3><a href="${link(0)}">${pages[0].title}</a></h3><p>${pages[0].description}</p></div></article></div></div></section>`);
insert('outdoors.html','</main>',`<section class="content-section alt"><div class="wrap"><p class="kicker">WEATHER BACKUP · WINTER FIT · NO-SPEND SKILL</p><div class="simple-list"><a href="${link(0)}">${pages[0].title} <b>→</b></a><a href="${link(1)}">${pages[1].title} <b>→</b></a><a href="${link(2)}">${pages[2].title} <b>→</b></a></div></div></section>`);

export const reciprocal=[
 ['most-syracuse-with-kids',0,'For a larger regional science day, use the Rochester Museum & Science Center two-floor route and separate planetarium gate.'],
 ['family-museum-day-system',0,'Apply the one-anchor museum system to the Rochester Museum & Science Center with two floors, lunch and one optional add-on.'],
 ['strong-museum-of-play-with-kids',0,'For a science-and-history Rochester day instead of a play-first day, use the RMSC two-floor route.'],
 ['kids-rain-boots-tall-chelsea-insulated-guide',1,'When the forecast turns colder than a rain-boot job, use the winter-boot sock, walk and dry tests.'],
 ['kids-hiking-socks-wool-synthetic-cotton-guide',1,'Bring the exact sock into the winter-boot fitting; thickness that crowds the foot is not extra warmth.'],
 ['family-boot-dryer-fan-heated-passive-guide',1,'A winter boot only fits the household if its liner and toe box can dry safely before the next use.'],
 ['kids-snow-pants-bibs-waist-one-piece-guide',1,'Test the snow-pant cuff and gaiter with the exact winter boot before keeping either item.'],
 ['sew-four-hole-button-with-kids-family-repair-lesson',2,'Read the garment care label before repairing it; the 25-minute sort teaches wash, dry and warning boundaries without using products.'],
 ['family-calendar-reset-20-minute-plan',2,'Add one recurring clothing-care check only after the family can read labels and separate special-care garments.']
];
for(const [slug,i,label] of reciprocal)insert(`guides/${slug}.html`,'</main>',`<aside class="note"><a href="${pages[i].slug}.html"><strong>${label}</strong></a></aside>`);

let map=read('sitemap.xml');for(const p of pages){const url=`https://mradventuredad.com/guides/${p.slug}.html`;if(!map.includes(`<loc>${url}</loc>`))map=map.replace('</urlset>',`  <url><loc>${url}</loc><lastmod>${date}</lastmod></url>\n</urlset>`);}
for(const path of ['','adventures.html','destinations.html','gear.html','outdoors.html',...reciprocal.map(([s])=>`guides/${s}.html`)]){const url='https://mradventuredad.com/'+path;map=map.replace(new RegExp(`(<loc>${url.replaceAll('.','\\.')}</loc><lastmod>)[^<]+`),`$1${date}`);}write('sitemap.xml',map);

const credits=JSON.parse(read('assets/images/credits.json'));for(const p of pages)credits['assets/images/photos/'+p.image]={title:p.alt,creator:'Mr Adventure Dad Editorial Desk with OpenAI image generation',source:'Original AI-assisted conceptual editorial image',license:'Original AI-assisted image; published by Mr Adventure Dad',verified:date,notes:p.caption};write('assets/images/credits.json',JSON.stringify(credits,null,2)+'\n');
insert('photo-credits.html','</section><h2>Additional editorial photography</h2>',pages.map(p=>`<article class="photo-credit-card">${img(p)}<div><h2>${p.title}</h2><p>${p.caption}</p><p>Creator: Mr Adventure Dad Editorial Desk with OpenAI image generation. Original AI-assisted editorial asset, not third-party destination or exact product photography. Reviewed October 24, 2026.</p></div></article>`).join(''));

const report=`# Editorial decision record — October 24, 2026

## Inventory and duplication gate

The complete source and generated inventory contained 172 HTML pages before this batch. All existing guide intents, titles, slugs, locations, commercial categories and image records were checked, including October 10–23 and the separate October 24–25 roundup. Another cave support page, canal variation, container variation, generic museum comparison and dated event page were rejected. Winter boots remain distinct from the existing rain-boot, hiking-footwear, snow-pant and boot-dryer intents because this page answers cold-weather boot category and sock-fit decisions. No October 24 trio existed.

## Search Console decision

The private report was generated October 21, 2026 for September 21–October 18. MrAdventureDad.com recorded 781 impressions, 9 clicks, 1.15% CTR and average position 14.02. The MOST page had 45 impressions, 1 click and average position 15.47, enough to support one distinct regional science-attraction itinerary: Rochester Museum & Science Center. It does not target MOST, a Syracuse membership comparison or this weekend's Chemistry Day; it serves a separate Rochester destination and a two-floor/planetarium decision. Howe Caverns at 103 impressions / 2 clicks was deliberately not chased again after the October 23 cave-readiness support page. The seven-impression travel-bag page and one- or two-impression query fragments were too weak to steer the batch. The 0 indexed / 153 submitted sitemap row conflicts with observable clicks and was treated as a discovery warning, so crawl paths were reinforced.

## Portfolio labels

- **Data-led — Rochester Museum & Science Center With Kids:** extends credible regional indoor-science demand with a distinct two-floor Rochester itinerary and separate planetarium gate.
- **Authority-expansion — Kids’ Winter Boots:** connects the winter clothing, socks, rain boots and boot-drying cluster through an activity-first category matrix and eight-check fit framework.
- **Exploration — Family Laundry Label Sort:** adds a no-spend home-life skill with FTC-backed label literacy, dry sorting and hard chemical/appliance boundaries.

## Authority action

The batch creates three reusable decision assets: a two-floor/lunch/one-more museum route, an eight-check winter-boot fit and drying card, and a five-card laundry-label lesson with a checked fictional answer. Nine established pages now provide reciprocal contextual links, while dated primary sourcing, official fallbacks, commercial separation, conceptual-image labels and a correction route strengthen trust.

## Qualified opportunities — log only; no outreach sent

1. **Rochester Museum & Science Center visitor services** — https://rmsc.org/contact/ — factual-correction and family-resource angle for the independent two-floor route, separate planetarium decision and volatile-price labels.
2. **Visit Rochester** — https://www.visitrochester.com/contact-us/ — regional family-resource angle for a finishable four-hour science-and-history day that routes every volatile detail to official pages.
3. **Federal Trade Commission consumer education** — https://www.ftc.gov/about-ftc/contact — household-literacy angle for a dry, no-products family lesson derived from the FTC care-label framework; invite factual correction, not endorsement.

## Image gate before publication

Three unique 1600×900 editorial images were visually inspected against final title, copy, caption, alt, credit and destination/category context. The museum image is explicitly generic and not RMSC; the boot image shows generic category forms and not affiliate products; the laundry image depicts a dry label-reading lesson without chemicals or operating appliances. Zero affiliate/product images are used. A second live rendered pass remains required.
`;
write('reports/editorial-decision-2026-10-24.md',report);
write('reports/image-qa-2026-10-24.md',`# Image QA — October 24, 2026\n\n## Pass 1: pre-publication\n\n- 3 unique 1600×900 editorial images visually inspected after final WebP conversion.\n- 0 affiliate/product images used.\n- Final title, copy, caption, alt, credit and linked destination/category context checked for all three assets.\n- Museum image: generic science-museum planning still life; not RMSC, an official map, real exhibit or current access evidence.\n- Winter-boot image: three generic unbranded category forms with a removable liner, socks and foot outline; no exact product, test, certification, temperature or traction claim.\n- Laundry image: dry tabletop label-reading lesson with adult and child hands; no detergent, chemicals, private data or operating appliance.\n\n## Pass 2: live rendered\n\n- Pending deployment.\n`);
if(!read('reports/search-console-editorial-log.md').includes('# 2026-10-24'))appendFileSync(resolve(root,'reports/search-console-editorial-log.md'),`\n# 2026-10-24\n\n- Report generated: 2026-10-21; window 2026-09-21 through 2026-10-18.\n- Used: MOST page at 45 impressions / 1 click / position 15.47 for one distinct Rochester science-museum itinerary with a two-floor route and separate planetarium gate.\n- Ignored: Howe Caverns at 103 impressions / 2 clicks because the October 23 batch already supplied distinct support; the seven-impression travel-bag page and one- or two-impression query fragments were too weak.\n- Discovery: homepage, four hubs, sitemap and nine reciprocal links strengthened; 0 indexed / 153 submitted treated as a warning because it conflicts with observed clicks.\n- Portfolio: one data-led regional indoor destination, one authority-expansion winter-footwear decision and one no-spend home-skill exploration; the October 24–25 roundup remains featured and unduplicated.\n`);
let auth=read('reports/authority-opportunities.md');if(!auth.includes('## 2026-10-24'))auth+=`\n## 2026-10-24\n\n- **Rochester Museum & Science Center visitor services** — https://rmsc.org/contact/ — factual-correction and family-resource angle for the independent two-floor route, separate planetarium decision and volatile-price labels.\n- **Visit Rochester** — https://www.visitrochester.com/contact-us/ — regional family-resource angle for a finishable four-hour science-and-history day that routes volatile details to official pages.\n- **Federal Trade Commission consumer education** — https://www.ftc.gov/about-ftc/contact — household-literacy angle for a dry, no-products family lesson derived from the FTC care-label framework; invite factual correction, not endorsement.\n\nNo outreach, submission or account creation was performed.\n`;write('reports/authority-opportunities.md',auth);
console.log('Generated exactly three October 24 guides, homepage time windows, four hubs, nine reciprocal links, sitemap, credits and authority records.');
