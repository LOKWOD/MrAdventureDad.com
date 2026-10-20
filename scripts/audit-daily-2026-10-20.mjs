import {readFileSync,readdirSync,existsSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {resolve} from 'node:path';
import {pages} from './content-2026-10-20.mjs';
const root=resolve(process.argv[2]||'.'),read=p=>readFileSync(resolve(root,p),'utf8'),failures=[],html=[];
const fail=s=>failures.push(s),count=(s,re)=>(s.match(re)||[]).length;
function walk(dir){for(const e of readdirSync(dir,{withFileTypes:true})){if(['.git','node_modules'].includes(e.name))continue;const p=resolve(dir,e.name);if(e.isDirectory())walk(p);else if(e.name.endsWith('.html'))html.push({path:p,body:readFileSync(p,'utf8')});}}walk(root);
if(pages.length!==3)fail('Exactly three sources');
const map=read('sitemap.xml'),credits=JSON.parse(read('assets/images/credits.json')),hashes=new Set();
const approvedTag=read('scripts/inject-affiliate-commerce.mjs').match(/const tag = "([^"]+)"/)?.[1];
if(!approvedTag)fail('Approved affiliate configuration missing');
for(const [i,p] of pages.entries()){
 const h=read(`guides/${p.slug}.html`),url=`https://mradventuredad.com/guides/${p.slug}.html`;
 for(const s of [`<h1>${p.title}</h1>`,`rel="canonical" href="${url}"`,`property="og:url" content="${url}"`,'datePublished":"2026-10-20"','dateModified":"2026-10-20"','"Article"','"Guide"','"BreadcrumbList"','data-cf-beacon=','data-site="mr-adventure-dad"',p.alt,p.caption,'property="og:image:alt"','name="twitter:image:alt"'])if(!h.includes(s))fail(p.slug+': missing '+s);
 const words=p.body.replace(/<[^>]+>/g,' ').split(/\s+/).filter(Boolean).length;if(words<1000)fail(p.slug+': thin '+words);
 if(count(h,/class="article-hero"/g)!==1||!h.includes('width="1600" height="900" style="height:auto"'))fail(p.slug+': hero dimensions');
 if(count(h,/data-affiliate-active="true"/g)!==(i===1?3:0))fail(p.slug+': irrelevant or missing monetization');
 if(i===1){
  if(!h.includes('As an Amazon Associate I earn from qualifying purchases.'))fail('Missing disclosure');
  for(const m of h.matchAll(/<a\b[^>]*data-affiliate-active="true"[^>]*>/g)){
   const tag=m[0],href=tag.match(/href="([^"]+)"/)?.[1]?.replaceAll('&amp;','&'),rel=tag.match(/rel="([^"]+)"/)?.[1]?.split(/\s+/)||[];
   if(!href||new URL(href).searchParams.get('tag')!==approvedTag)fail('Missing approved tracking');
   for(const token of ['sponsored','nofollow','noopener','noreferrer'])if(!rel.includes(token))fail('Missing paid protection '+token);
  }
 }
 if(!map.includes(`<loc>${url}</loc><lastmod>2026-10-20</lastmod>`))fail(p.slug+': sitemap');
 const key='assets/images/photos/'+p.image;if(!existsSync(resolve(root,key))||!credits[key])fail(p.slug+': asset/credit');
 const sha=createHash('sha256').update(readFileSync(resolve(root,key))).digest('hex');if(hashes.has(sha))fail('Duplicate new image');hashes.add(sha);
 for(const other of Object.keys(credits)){if(other===key||!other.startsWith('assets/images/photos/')||!existsSync(resolve(root,other)))continue;if(createHash('sha256').update(readFileSync(resolve(root,other))).digest('hex')===sha)fail('Reused image '+key);}
 const internal=[...p.body.matchAll(/href="([^":]+\.html)"/g)].map(m=>m[1]);if(new Set(internal).size<3)fail(p.slug+': internal coverage');
 if(!p.body.includes('Sources and editorial method')||!p.caption.includes('AI-assisted'))fail(p.slug+': trust/source separation');
}
const home=read('index.html'),lead=home.match(/<section class="now-plans wrap"[\s\S]*?<section class="intro wrap">/)?.[0]||'';
if(!lead.includes('FRESH IDEAS · OCTOBER 20, 2026'))fail('Homepage date');
if(lead.includes('href="weekend-october-17-18-2026.html"'))fail('Expired event feature');
for(const token of ['TONIGHT','WEEKEND','BREAK DAY','AT HOME','LOW ENERGY'])if(!lead.includes(token))fail('Missing time window '+token);
for(const [hub,indices] of [['index.html',[0,1,2]],['adventures.html',[0,1,2]],['destinations.html',[0]],['gear.html',[1]],['outdoors.html',[0,1,2]]])for(const i of indices)if(!read(hub).includes(`href="guides/${pages[i].slug}.html"`))fail(hub+': discovery');
for(const [slug,i] of [['harriet-tubman-national-historical-park-with-kids',0],['howe-caverns-with-kids',0],['family-museum-day-system',0],['family-home-board-games-cooperative-strategy-dexterity-guide',1],['family-calendar-reset-20-minute-plan',1],['living-room-picnic-30-minute-family-plan',1],['family-library-night-45-minute-plan',2],['family-oral-history-interview-30-minute-no-posting-plan',2],['family-photo-scavenger-hunt-30-minute-no-posting-plan',2]])if(!read(`guides/${slug}.html`).includes(`href="${pages[i].slug}.html"`))fail(slug+': reciprocal');
const titles=new Set(),h1s=new Set();for(const {body:h} of html){for(const [name,re,set]of [['title',/<title>(.*?)<\/title>/i,titles],['h1',/<h1[^>]*>([\s\S]*?)<\/h1>/i,h1s]]){const value=h.match(re)?.[1];if(set.has(value))fail('Duplicate '+name+' '+value);set.add(value);}for(const m of h.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g))try{JSON.parse(m[1]);}catch{fail('Invalid schema');}}
const urls=[...map.matchAll(/<loc>(.*?)<\/loc>/g)].map(m=>m[1]);if(html.length!==162||urls.length!==162||new Set(urls).size!==162)fail('162-page coverage');
const paid=html.reduce((n,p)=>n+count(p.body,/data-affiliate-active="true"/g),0);if(paid!==213)fail('Paid total '+paid);
const placements=pages.reduce((n,p)=>n+html.filter(h=>h.body.includes(p.image)).length,0);if(placements!==11)fail('Image placements '+placements);
if(!existsSync(resolve(root,'weekend-october-17-18-2026.html')))fail('Weekly archive removed');
if(!pages[2].body.includes('Everything in this paragraph is invented for practice.'))fail('Fictional example not labeled');
if(failures.length){console.error(failures.map(s=>'FAIL '+s).join('\n'));process.exit(1);}
console.log('PASS October 20: exactly 3 substantial guides; 3 unique credited editorial assets / 11 placements; 0 product images; 3 protected disclosed paid links / 213 sitewide; 9 reciprocals; 162-URL sitemap; current homepage and preserved weekly archive.');
