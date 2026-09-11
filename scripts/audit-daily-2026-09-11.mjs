import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";

const root=resolve(process.argv[2]||".");
const failures=[]; const fail=m=>failures.push(m); const read=p=>readFileSync(resolve(root,p),"utf8");
const count=(t,r)=>(t.match(r)||[]).length;
const strip=h=>h.replace(/<script[\s\S]*?<\/script>/gi," ").replace(/<style[\s\S]*?<\/style>/gi," ").replace(/<[^>]+>/g," ").replace(/\s+/g," ").trim();
const pages=[
 {path:"guides/pratts-falls-with-kids.html",title:"Pratt’s Falls With Kids: The Waterfall Day That Stops Before the Long Loop",canonical:"https://mradventuredad.com/guides/pratts-falls-with-kids.html",photo:"pratts-falls.webp",paid:0,sources:["onondagacountyparks.com/parks/pratts-falls-park","PrattsFallsMap2017.pdf","dec.ny.gov/things-to-do/freshwater-fishing/regulations","forecast.weather.gov/MapClick","commons.wikimedia.org/wiki/File:Pratts_falls"]},
 {path:"guides/family-roof-cargo-box-bag-basket-guide.html",title:"Family Roof Cargo: Box vs Bag vs Basket—and the Weakest-Limit Rule",canonical:"https://mradventuredad.com/guides/family-roof-cargo-box-bag-basket-guide.html",photo:"family-roof-cargo-options.webp",paid:3,sources:["nhtsa.gov/vehicle-safety/tires","nhtsa.gov/recalls","cpsc.gov/Recalls","thule.com/en-us/roof-rack/car-roof-racks","fitlookup.yakima.com"]},
 {path:"guides/multigenerational-family-day-trip-plan.html",title:"The Multigenerational Family Day-Trip Plan: Kids, Grandparents, and One Pace",canonical:"https://mradventuredad.com/guides/multigenerational-family-day-trip-plan.html",photo:"multigenerational-family-day-trip.webp",paid:0,sources:["nps.gov/subjects/accessibility","recreation.gov/articles/list/accessibility","weather.gov/safety/heat","airnow.gov"]}
];
const credits=JSON.parse(read("assets/images/credits.json")); const sitemap=read("sitemap.xml");
for(const p of pages){
 if(!existsSync(resolve(root,p.path))){fail(`${p.path}: missing`);continue;} const h=read(p.path);
 if(!h.includes(`<h1>${p.title}</h1>`))fail(`${p.path}: title mismatch`);
 if(!h.includes(`rel="canonical" href="${p.canonical}"`))fail(`${p.path}: canonical mismatch`);
 if(!h.includes('datePublished":"2026-09-11"')||!h.includes('dateModified":"2026-09-11"'))fail(`${p.path}: structured dates missing`);
 if(!/<meta property="og:title"/.test(h)||!/<meta name="twitter:card"/.test(h))fail(`${p.path}: social metadata missing`);
 if(!h.includes('application/ld+json')||!h.includes('"Article"')||!h.includes('"Guide"'))fail(`${p.path}: Article/Guide schema missing`);
 if(count(h,/class="article-hero"/g)!==1||!h.includes(`/photos/${p.photo}`))fail(`${p.path}: verified photo hero missing`);
 if(/<svg\b|<canvas\b|class="article-plan"|\bchart\b/i.test(h))fail(`${p.path}: chart or diagram used`);
 if(count(h,/<img\b/gi)!==count(h,/<img\b[^>]*\balt="[^"]+"/gi))fail(`${p.path}: image alt text failure`);
 if(!credits[`assets/images/photos/${p.photo}`])fail(`${p.path}: image credit missing`);
 if(!h.includes('data-cf-beacon=')||!h.includes('data-site="mr-adventure-dad"'))fail(`${p.path}: analytics or visitor beacon missing`);
 const internal=[...h.matchAll(/<a\b[^>]*href="([^"#]+\.html(?:#[^"]*)?)"/gi)].map(m=>m[1]); if(new Set(internal).size<3)fail(`${p.path}: fewer than three internal targets`);
 const words=strip(h).split(/\s+/).length; if(words<1050)fail(`${p.path}: insufficient substantial copy (${words} words)`);
 for(const s of p.sources)if(!h.toLowerCase().includes(s.toLowerCase()))fail(`${p.path}: missing authoritative source ${s}`);
 const paid=count(h,/data-affiliate-active="true"/g); if(paid!==p.paid)fail(`${p.path}: expected ${p.paid} paid links, found ${paid}`);
 if(paid){if(count(h,/tag=mradventuredad-20/g)!==paid)fail(`${p.path}: Amazon tag mismatch`);if(count(h,/rel="sponsored nofollow noopener noreferrer"/g)!==paid)fail(`${p.path}: paid-link rel mismatch`);if(!h.includes('As an Amazon Associate I earn from qualifying purchases'))fail(`${p.path}: disclosure missing`);}
 if(count(sitemap,new RegExp(p.canonical.replace(/[.*+?^${}()|[\]\\]/g,"\\$&"),"g"))!==1)fail(`${p.path}: sitemap entry must appear once`);
}
for(const [hub,targets] of Object.entries({"index.html":pages.map(p=>p.path),"adventures.html":pages.map(p=>p.path),"destinations.html":[pages[0].path],"outdoors.html":[pages[0].path,pages[2].path],"gear.html":[pages[1].path]})){const h=read(hub);for(const t of targets)if(!h.includes(`href="${t}"`))fail(`${hub}: missing ${t}`);}
for(const [path,target] of Object.entries({"guides/chittenango-falls-with-kids.html":"pratts-falls-with-kids.html","guides/road-trip-packing-system.html":"family-roof-cargo-box-bag-basket-guide.html","guides/one-on-one-dad-day.html":"multigenerational-family-day-trip-plan.html"}))if(!read(path).includes(`href="${target}"`))fail(`${path}: missing related ${target}`);
if(failures.length){console.error(failures.map(x=>`FAIL ${x}`).join("\n"));process.exit(1);} console.log("PASS daily 2026-09-11: 3 substantial pages, 3 photographic heroes, 0 charts, 3 disclosed Amazon links, authoritative sources, discovery and related links verified.");
