import {readFileSync,readdirSync,existsSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {resolve,relative,dirname} from 'node:path';
import {pages} from './content-2026-10-27.mjs';
const reciprocal=[['chittenango-falls-with-kids',0],['central-new-york-family-trail-picker',0],['family-outdoor-weather-cutoff-plan',0],['family-travel-bags-rolling-carry-on-duffel-backpack',1],['family-hotel-room-system',1],['family-day-trip-system',1],['family-grocery-receipt-detective-25-minute-math-activity',2],['family-food-allergy-day-trip-plan',2],['family-recipe-scaling-25-minute-math-lab',2]];
const root=resolve(process.argv[2]||'.'),read=p=>readFileSync(resolve(root,p),'utf8'),failures=[],html=[];
const fail=s=>failures.push(s),count=(s,re)=>(s.match(re)||[]).length;
function walk(dir){for(const e of readdirSync(dir,{withFileTypes:true})){if(['.git','node_modules'].includes(e.name))continue;const p=resolve(dir,e.name);if(e.isDirectory())walk(p);else if(e.name.endsWith('.html'))html.push({path:p,body:readFileSync(p,'utf8')});}}walk(root);
if(pages.length!==3)fail('Exactly three sources');
const map=read('sitemap.xml'),credits=JSON.parse(read('assets/images/credits.json')),hashes=new Set(),approvedTag=read('scripts/inject-affiliate-commerce.mjs').match(/const tag = "([^"]+)"/)?.[1];
for(const [i,p] of pages.entries()){
 const h=read(`guides/${p.slug}.html`),url=`https://mradventuredad.com/guides/${p.slug}.html`;
 for(const s of [`<h1>${p.title}</h1>`,`rel="canonical" href="${url}"`,`property="og:url" content="${url}"`,'datePublished":"2026-10-27"','dateModified":"2026-10-27"','"Article"','"Guide"','"BreadcrumbList"','data-cf-beacon=','data-site="mr-adventure-dad"',p.alt,p.caption,'property="og:image:alt"','name="twitter:image:alt"','Sources and editorial method'])if(!h.includes(s))fail(p.slug+': missing '+s);
 const words=p.body.replace(/<[^>]+>/g,' ').split(/\s+/).filter(Boolean).length;if(words<1100)fail(p.slug+': thin '+words);
 if(count(h,/class="article-hero"/g)!==1||!h.includes('width="1600" height="900" style="height:auto"'))fail(p.slug+': hero dimensions');
 if(count(h,/data-affiliate-active="true"/g)!==(i===1?3:0))fail(p.slug+': irrelevant or missing monetization');
 if(i===1){if(!h.includes('As an Amazon Associate I earn from qualifying purchases.'))fail('Missing disclosure');for(const m of h.matchAll(/<a\b[^>]*data-affiliate-active="true"[^>]*>/g)){const tag=m[0],href=tag.match(/href="([^"]+)"/)?.[1]?.replaceAll('&amp;','&'),rel=tag.match(/rel="([^"]+)"/)?.[1]?.split(/\s+/)||[];if(!href||new URL(href).searchParams.get('tag')!==approvedTag)fail('Missing approved tracking');for(const token of ['sponsored','nofollow','noopener','noreferrer'])if(!rel.includes(token))fail('Missing paid protection '+token);}}
 if(!map.includes(`<loc>${url}</loc><lastmod>2026-10-27</lastmod>`))fail(p.slug+': sitemap');
 const key='assets/images/photos/'+p.image;if(!existsSync(resolve(root,key))||!credits[key])fail(p.slug+': asset/credit');
 const sha=createHash('sha256').update(readFileSync(resolve(root,key))).digest('hex');if(hashes.has(sha))fail('Duplicate new image');hashes.add(sha);for(const other of Object.keys(credits)){if(other===key||!other.startsWith('assets/images/photos/')||!existsSync(resolve(root,other)))continue;if(createHash('sha256').update(readFileSync(resolve(root,other))).digest('hex')===sha)fail('Reused image '+key);}
 const internal=[...p.body.matchAll(/href="([^":]+\.html)"/g)].map(m=>m[1]);if(new Set(internal).size<3)fail(p.slug+': internal coverage');
}
const home=read('index.html'),lead=home.match(/<section class="now-plans wrap"[\s\S]*?<section class="intro wrap">/)?.[0]||'';
if(!lead.includes('FRESH IDEAS · OCTOBER 27, 2026')||!lead.includes('weekend-october-24-25-2026.html'))fail('Homepage date or preserved weekly guide');
for(const token of ['TONIGHT','WEEKEND','BREAK','AT HOME','HALF DAY','ARCHIVE'])if(!lead.includes(token))fail('Missing time window '+token);
for(const [hub,indices] of [['index.html',[0,1,2]],['adventures.html',[0,1,2]],['gear.html',[1]],['destinations.html',[0]],['outdoors.html',[0,1,2]]])for(const i of indices)if(!read(hub).includes(`href="guides/${pages[i].slug}.html"`))fail(hub+': discovery');
for(const [slug,i] of reciprocal)if(!read(`guides/${slug}.html`).includes(`href="${pages[i].slug}.html"`))fail(slug+': reciprocal');
const titles=new Set(),h1s=new Set();for(const {path,body:h} of html){for(const [name,re,set] of [['title',/<title>(.*?)<\/title>/i,titles],['h1',/<h1[^>]*>([\s\S]*?)<\/h1>/i,h1s]]){const value=h.match(re)?.[1];if(!value)fail(relative(root,path)+': missing '+name);else if(set.has(value))fail('Duplicate '+name+' '+value);else set.add(value);}for(const m of h.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g))try{JSON.parse(m[1]);}catch{fail(relative(root,path)+': invalid schema');}for(const m of h.matchAll(/href="([^"#?]+\.html)"/g)){const href=m[1];if(/^(https?:|mailto:|tel:)/.test(href))continue;const target=resolve(dirname(path),href);if(!existsSync(target))fail(relative(root,path)+': broken internal '+href);}}
const urls=[...map.matchAll(/<loc>(.*?)<\/loc>/g)].map(m=>m[1]);if(html.length!==184||urls.length!==184||new Set(urls).size!==184)fail(`184-page coverage html=${html.length} urls=${urls.length}`);
const paid=html.reduce((n,p)=>n+count(p.body,/data-affiliate-active="true"/g),0);if(paid!==234)fail('Paid total '+paid);
const placements=pages.reduce((n,p)=>n+html.filter(h=>h.body.includes(p.image)).length,0);if(placements!==11)fail('Image placements '+placements);
for(const archive of ['weekend-october-17-18-2026.html','weekend-october-24-25-2026.html'])if(!existsSync(resolve(root,archive)))fail('Weekly archive removed '+archive);
if(!read('reports/authority-opportunities.md').includes('## 2026-10-27')||!read('reports/image-qa-2026-10-27.md').includes('3 unique 1600×900 editorial images'))fail('Authority/image QA records');
if(failures.length){console.error(failures.map(s=>'FAIL '+s).join('\n'));process.exit(1);}console.log(`PASS October 27: exactly 3 substantial guides; 3 unique credited editorial assets / ${placements} placements; 0 product images; 3 protected disclosed paid links / ${paid} sitewide; 9 reciprocals; 184-URL sitemap; current homepage and preserved weekly archive.`);
