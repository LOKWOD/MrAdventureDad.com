import {readFileSync,readdirSync,existsSync} from 'node:fs';
import {resolve} from 'node:path';
import {pages} from './content-2026-10-18.mjs';
const root=resolve(process.argv[2]||'.'),read=p=>readFileSync(resolve(root,p),'utf8'),failures=[];
const fail=s=>failures.push(s),count=(s,re)=>(s.match(re)||[]).length,html=[];
function walk(d){for(const e of readdirSync(d,{withFileTypes:true})){if(['.git','node_modules'].includes(e.name))continue;const p=resolve(d,e.name);if(e.isDirectory())walk(p);else if(e.name.endsWith('.html'))html.push({path:p,body:readFileSync(p,'utf8')});}}walk(root);
const map=read('sitemap.xml'),credits=JSON.parse(read('assets/images/credits.json'));
for(const [i,p] of pages.entries()){
 const h=read('guides/'+p.slug+'.html'),url='https://mradventuredad.com/guides/'+p.slug+'.html';
 for(const s of [`<h1>${p.title}</h1>`,`rel="canonical" href="${url}"`,`property="og:url" content="${url}"`,'datePublished":"2026-10-18"','dateModified":"2026-10-18"','"Article"','"Guide"','data-cf-beacon=','data-site="mr-adventure-dad"',p.caption,p.alt])if(!h.includes(s))fail(p.slug+': missing '+s);
 const words=p.body.replace(/<[^>]+>/g,' ').split(/\s+/).filter(Boolean).length;if(words<850)fail(p.slug+': thin body '+words);
 if(count(h,/class="article-hero"/g)!==1)fail(p.slug+': hero count');
 if(!h.includes('width="1600" height="900" style="height:auto"'))fail(p.slug+': responsive hero dimensions');
 if(count(h,/data-affiliate-active="true"/g)!==(i===1?3:0))fail(p.slug+': paid count');
 if(i===1&&(!h.includes('As an Amazon Associate I earn from qualifying purchases')||count(h,/rel="sponsored nofollow noopener noreferrer"/g)!==3))fail(p.slug+': disclosure/rel');
 if(!map.includes(`<loc>${url}</loc><lastmod>2026-10-18</lastmod>`))fail(p.slug+': sitemap');
 const key='assets/images/photos/'+p.image;if(!existsSync(resolve(root,key))||!credits[key])fail(p.slug+': image/credit');
 const inlinks=[...p.body.matchAll(/href="([^":]+\.html)"/g)].map(m=>m[1]);if(new Set(inlinks).size<3)fail(p.slug+': contextual links');
 if(!h.includes('Sources')&&!h.includes('sources'))fail(p.slug+': sourcing');
}
const home=read('index.html');if(!home.includes('FRESH IDEAS · OCTOBER 18, 2026'))fail('homepage date');if(!home.includes('href="weekend-october-17-18-2026.html"'))fail('weekly protection');
for(const [hub,indices] of [['index.html',[0,1,2]],['adventures.html',[0,1,2]],['destinations.html',[0]],['gear.html',[1]],['outdoors.html',[0,1,2]]])for(const i of indices)if(!read(hub).includes(`href="guides/${pages[i].slug}.html"`))fail(hub+': discovery');
const reciprocal=[['family-binoculars-8x-vs-10x',0],['cornell-botanic-gardens-with-kids',0],['montezuma-national-wildlife-refuge-with-kids',0],['family-travel-games-guide',1],['living-room-picnic-30-minute-family-plan',1],['family-calendar-reset-20-minute-plan',1],['family-library-night-45-minute-plan',2],['one-on-one-dad-day',2],['family-day-trip-system',2]];
for(const [slug,i] of reciprocal)if(!read('guides/'+slug+'.html').includes(`href="${pages[i].slug}.html"`))fail(slug+': reciprocal');
const titles=new Set();for(const {body:h} of html){const t=h.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i)?.[1];if(titles.has(t))fail('duplicate h1 '+t);titles.add(t);for(const m of h.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)){try{JSON.parse(m[1]);}catch{fail('invalid JSON-LD');}}}
const urls=[...map.matchAll(/<loc>(.*?)<\/loc>/g)].map(m=>m[1]);if(urls.length!==156||new Set(urls).size!==156||html.length!==156)fail('page/sitemap total');
const paid=html.reduce((n,x)=>n+count(x.body,/data-affiliate-active="true"/g),0);if(paid!==210)fail('sitewide paid count '+paid);
const placements=pages.reduce((n,p)=>n+html.filter(x=>x.body.includes(p.image)).length,0);if(placements!==11)fail('image placement count '+placements);
if(failures.length){console.error(failures.map(s=>'FAIL '+s).join('\n'));process.exit(1);}console.log('PASS October 18: 3 substantial distinct pages; 3 editorial images / 11 placements; 0 product images; 3 disclosed affiliate links / 210 sitewide; 9 reciprocal links; 156 URLs; current homepage and protected weekly roundup.');
