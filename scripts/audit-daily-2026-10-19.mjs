import {readFileSync,readdirSync,existsSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {resolve} from 'node:path';
import {pages} from './content-2026-10-19.mjs';
const root=resolve(process.argv[2]||'.'),read=p=>readFileSync(resolve(root,p),'utf8'),failures=[];
const fail=s=>failures.push(s),count=(s,re)=>(s.match(re)||[]).length,html=[];
function walk(dir){for(const e of readdirSync(dir,{withFileTypes:true})){if(['.git','node_modules'].includes(e.name))continue;const p=resolve(dir,e.name);if(e.isDirectory())walk(p);else if(e.name.endsWith('.html'))html.push({path:p,body:readFileSync(p,'utf8')});}}walk(root);
if(pages.length!==3)fail('Exactly 3 new sources');
const map=read('sitemap.xml'),credits=JSON.parse(read('assets/images/credits.json')),hashes=new Set();
for(const p of pages){
 const h=read(`guides/${p.slug}.html`),url=`https://mradventuredad.com/guides/${p.slug}.html`;
 for(const s of [`<h1>${p.title}</h1>`,`rel="canonical" href="${url}"`,`property="og:url" content="${url}"`,'datePublished":"2026-10-19"','dateModified":"2026-10-19"','"Article"','"Guide"','"BreadcrumbList"','data-cf-beacon=','data-site="mr-adventure-dad"',p.alt,p.caption,'property="og:image:alt"'])if(!h.includes(s))fail(`${p.slug}: missing ${s}`);
 const words=p.body.replace(/<[^>]+>/g,' ').split(/\s+/).filter(Boolean).length;if(words<1000)fail(`${p.slug}: thin body ${words}`);
 if(count(h,/class="article-hero"/g)!==1||!h.includes('width="1600" height="900" style="height:auto"'))fail(p.slug+': responsive hero');
 if(count(h,/data-affiliate-active="true"/g)!==0||/amazon\.com/.test(h))fail(p.slug+': unrelated paid module');
 if(!map.includes(`<loc>${url}</loc><lastmod>2026-10-19</lastmod>`))fail(p.slug+': sitemap');
 const key='assets/images/photos/'+p.image;if(!existsSync(resolve(root,key))||!credits[key])fail(p.slug+': asset/credit');
 const sha=createHash('sha256').update(readFileSync(resolve(root,key))).digest('hex');if(hashes.has(sha))fail('duplicate new image');hashes.add(sha);
 for(const [other,c] of Object.entries(credits)){if(other===key||!other.startsWith('assets/images/photos/')||!existsSync(resolve(root,other)))continue;const hash=createHash('sha256').update(readFileSync(resolve(root,other))).digest('hex');if(hash===sha)fail('new image reuses existing bytes '+key);}
 const internal=[...p.body.matchAll(/href="([^":]+\.html)"/g)].map(m=>m[1]);if(new Set(internal).size<3)fail(p.slug+': internal links');
 if(!h.includes('Sources')||!h.includes('editorial'))fail(p.slug+': trust sourcing');
}
const home=read('index.html'),lead=home.match(/<section class="now-plans wrap"[\s\S]*?<section class="intro wrap">/)?.[0]||'';
if(!lead.includes('FRESH IDEAS · OCTOBER 19, 2026'))fail('home date');if(lead.includes('href="weekend-october-17-18-2026.html"')||lead.includes('THIS WEEKEND · OCTOBER 17'))fail('expired weekly roundup featured');
if(!existsSync(resolve(root,'weekend-october-17-18-2026.html')))fail('weekly archive removed');
for(const token of ['TONIGHT','WEEKEND','BREAK DAY','AT HOME','LOW ENERGY'])if(!lead.includes(token))fail('missing time window '+token);
for(const [hub,indices] of [['index.html',[0,1,2]],['adventures.html',[0,1,2]],['destinations.html',[1]],['gear.html',[2]],['outdoors.html',[0,1,2]]])for(const i of indices)if(!read(hub).includes(`href="guides/${pages[i].slug}.html"`))fail(hub+': discovery');
for(const [slug,i] of [['most-syracuse-with-kids',0],['rosamond-gifford-zoo-with-kids',0],['family-museum-day-system',0],['syracuse-family-outing-picker-most-zoo-erie-canal-museum',1],['one-on-one-dad-day',1],['first-ski-day-with-kids',1],['kids-fall-trail-layers-base-fleece-insulation-shell-guide',2],['family-field-sketch-kit-pouch-case-clipboard-guide',2],['family-calendar-reset-20-minute-plan',2]])if(!read(`guides/${slug}.html`).includes(`href="${pages[i].slug}.html"`))fail(slug+': reciprocal');
const titles=new Set(),h1s=new Set();for(const {body:h} of html){for(const [name,re,set] of [['title',/<title>(.*?)<\/title>/i,titles],['h1',/<h1[^>]*>([\s\S]*?)<\/h1>/i,h1s]]){const value=h.match(re)?.[1];if(set.has(value))fail('duplicate '+name+' '+value);set.add(value);}for(const m of h.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g))try{JSON.parse(m[1]);}catch{fail('invalid schema');}}
const urls=[...map.matchAll(/<loc>(.*?)<\/loc>/g)].map(m=>m[1]);if(html.length!==159||urls.length!==159||new Set(urls).size!==159)fail('159-page sitemap coverage');
const paid=html.reduce((n,p)=>n+count(p.body,/data-affiliate-active="true"/g),0);if(paid!==210)fail('unexpected paid total '+paid);
const placements=pages.reduce((n,p)=>n+html.filter(h=>h.body.includes(p.image)).length,0);if(placements!==11)fail('new image placement count '+placements);
const member=read(`guides/${pages[0].slug}.html`);for(const s of ['id="membership-cost-form"','role="status"','membership-break-even.mjs','membership-break-even.css','No personal information'])if(!member.includes(s))fail('calculator '+s);
if(failures.length){console.error(failures.map(s=>'FAIL '+s).join('\n'));process.exit(1);}
console.log('PASS October 19: 3 substantial distinct pages; 3 unique editorial images / 11 placements; 0 product images or new paid links; 210 paid links preserved; 9 reciprocal links; 159 URLs; current time-window lead and archived weekly roundup.');
