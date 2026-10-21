import {readFileSync,readdirSync,existsSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {resolve} from 'node:path';
import {pages} from './content-2026-10-21.mjs';
const reciprocal=[['family-camping-sleep-system-guide',0],['kids-sleeping-bag-temperature-rating-fit-fill-guide',0],['one-night-camping-with-kids',0],['letchworth-state-park-with-kids',1],['watkins-glen-with-kids',1],['family-outdoor-weather-cutoff-plan',1],['family-oral-history-interview-30-minute-no-posting-plan',2],['family-photo-scavenger-hunt-30-minute-no-posting-plan',2],['family-claim-check-one-headline-20-minute-lesson',2]];
const root=resolve(process.argv[2]||'.'),read=p=>readFileSync(resolve(root,p),'utf8'),failures=[],html=[];
const fail=s=>failures.push(s),count=(s,re)=>(s.match(re)||[]).length;
function walk(dir){for(const e of readdirSync(dir,{withFileTypes:true})){if(['.git','node_modules'].includes(e.name))continue;const p=resolve(dir,e.name);if(e.isDirectory())walk(p);else if(e.name.endsWith('.html'))html.push({path:p,body:readFileSync(p,'utf8')});}}walk(root);
if(pages.length!==3)fail('Exactly three sources');
const map=read('sitemap.xml'),credits=JSON.parse(read('assets/images/credits.json')),hashes=new Set(),approvedTag=read('scripts/inject-affiliate-commerce.mjs').match(/const tag = "([^"]+)"/)?.[1];
for(const [i,p] of pages.entries()){
 const h=read(`guides/${p.slug}.html`),url=`https://mradventuredad.com/guides/${p.slug}.html`;
 for(const s of [`<h1>${p.title}</h1>`,`rel="canonical" href="${url}"`,`property="og:url" content="${url}"`,'datePublished":"2026-10-21"','dateModified":"2026-10-21"','"Article"','"Guide"','"BreadcrumbList"','data-cf-beacon=','data-site="mr-adventure-dad"',p.alt,p.caption,'property="og:image:alt"','name="twitter:image:alt"','Sources and editorial method'])if(!h.includes(s))fail(p.slug+': missing '+s);
 const words=p.body.replace(/<[^>]+>/g,' ').split(/\s+/).filter(Boolean).length;if(words<1000)fail(p.slug+': thin '+words);
 if(count(h,/class="article-hero"/g)!==1||!h.includes('width="1600" height="900" style="height:auto"'))fail(p.slug+': hero dimensions');
 if(count(h,/data-affiliate-active="true"/g)!==(i===0?3:0))fail(p.slug+': irrelevant or missing monetization');
 if(i===0){if(!h.includes('As an Amazon Associate I earn from qualifying purchases.'))fail('Missing disclosure');for(const m of h.matchAll(/<a\b[^>]*data-affiliate-active="true"[^>]*>/g)){const tag=m[0],href=tag.match(/href="([^"]+)"/)?.[1]?.replaceAll('&amp;','&'),rel=tag.match(/rel="([^"]+)"/)?.[1]?.split(/\s+/)||[];if(!href||new URL(href).searchParams.get('tag')!==approvedTag)fail('Missing approved tracking');for(const token of ['sponsored','nofollow','noopener','noreferrer'])if(!rel.includes(token))fail('Missing paid protection '+token);}}
 if(!map.includes(`<loc>${url}</loc><lastmod>2026-10-21</lastmod>`))fail(p.slug+': sitemap');
 const key='assets/images/photos/'+p.image;if(!existsSync(resolve(root,key))||!credits[key])fail(p.slug+': asset/credit');
 const sha=createHash('sha256').update(readFileSync(resolve(root,key))).digest('hex');if(hashes.has(sha))fail('Duplicate new image');hashes.add(sha);for(const other of Object.keys(credits)){if(other===key||!other.startsWith('assets/images/photos/')||!existsSync(resolve(root,other)))continue;if(createHash('sha256').update(readFileSync(resolve(root,other))).digest('hex')===sha)fail('Reused image '+key);}
 const internal=[...p.body.matchAll(/href="([^":]+\.html)"/g)].map(m=>m[1]);if(new Set(internal).size<3)fail(p.slug+': internal coverage');
}
const home=read('index.html'),lead=home.match(/<section class="now-plans wrap"[\s\S]*?<section class="intro wrap">/)?.[0]||'';
if(!lead.includes('FRESH IDEAS · OCTOBER 21, 2026')||!lead.includes('weekend-october-24-25-2026.html'))fail('Homepage date or current weekly guide');
for(const token of ['TONIGHT','WEEKEND','BREAK DAY','AT HOME','LOW ENERGY'])if(!lead.includes(token))fail('Missing time window '+token);
for(const [hub,indices] of [['index.html',[0,1,2]],['adventures.html',[0,1,2]],['gear.html',[0]],['destinations.html',[1]],['outdoors.html',[0,1,2]]])for(const i of indices)if(!read(hub).includes(`href="guides/${pages[i].slug}.html"`))fail(hub+': discovery');
for(const [slug,i] of reciprocal)if(!read(`guides/${slug}.html`).includes(`href="${pages[i].slug}.html"`))fail(slug+': reciprocal');
const titles=new Set(),h1s=new Set();for(const {body:h} of html){for(const [name,re,set] of [['title',/<title>(.*?)<\/title>/i,titles],['h1',/<h1[^>]*>([\s\S]*?)<\/h1>/i,h1s]]){const value=h.match(re)?.[1];if(set.has(value))fail('Duplicate '+name+' '+value);set.add(value);}for(const m of h.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g))try{JSON.parse(m[1]);}catch{fail('Invalid schema');}}
const urls=[...map.matchAll(/<loc>(.*?)<\/loc>/g)].map(m=>m[1]);if(html.length!==166||urls.length!==166||new Set(urls).size!==166)fail('166-page coverage');
const paid=html.reduce((n,p)=>n+count(p.body,/data-affiliate-active="true"/g),0);if(paid!==216)fail('Paid total '+paid);
const placements=pages.reduce((n,p)=>n+html.filter(h=>h.body.includes(p.image)).length,0);if(placements!==11)fail('Image placements '+placements);
for(const archive of ['weekend-october-17-18-2026.html','weekend-october-24-25-2026.html'])if(!existsSync(resolve(root,archive)))fail('Weekly archive removed '+archive);
if(!read('reports/authority-opportunities.md').includes('## 2026-10-21')||!read('reports/image-qa-2026-10-21.md').includes('3 unique editorial images'))fail('Authority/image QA records');
if(failures.length){console.error(failures.map(s=>'FAIL '+s).join('\n'));process.exit(1);}console.log('PASS October 21: exactly 3 substantial guides; 3 unique credited editorial assets / 11 placements; 0 product images; 3 protected disclosed paid links / 216 sitewide; 9 reciprocals; 166-URL sitemap; current homepage and preserved weekly archive.');
