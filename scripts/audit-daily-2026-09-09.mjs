import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";

const root=resolve(process.argv[2]||".");
const failures=[]; const fail=m=>failures.push(m); const read=p=>readFileSync(resolve(root,p),"utf8");
const count=(t,r)=>(t.match(r)||[]).length;
const strip=h=>h.replace(/<script[\s\S]*?<\/script>/gi," ").replace(/<style[\s\S]*?<\/style>/gi," ").replace(/<[^>]+>/g," ").replace(/\s+/g," ").trim();
const pages=[
 {path:"guides/most-syracuse-with-kids.html",title:"The MOST With Kids: A Three-Zone Syracuse Museum Day",canonical:"https://mradventuredad.com/guides/most-syracuse-with-kids.html",photo:"most-syracuse-exterior.webp",paid:0,sources:["most.org/visit/hours-prices","most.org/visit/directions-parking","most.org/visit/","most.org/snacks-drinks","most.org/watch","commons.wikimedia.org/wiki/File:Milton_J._Rubenstein_Museum"]},
 {path:"guides/family-folding-wagon-guide.html",title:"Family Folding Wagons: Pull Wagon vs Utility Cart—and When to Carry It",canonical:"https://mradventuredad.com/guides/family-folding-wagon-guide.html",photo:"family-folding-wagon.webp",paid:3,sources:["cpsc.gov/Recalls","cpsc.gov/Recalls/2026/Olympia-Tools-International-Recalls-Pack-N-Stroll","saferproducts.gov"]},
 {path:"guides/family-parking-lot-plan.html",title:"The Family Parking-Lot Plan: Unload, Regroup, and Leave Together",canonical:"https://mradventuredad.com/guides/family-parking-lot-plan.html",photo:"family-parking-lot-plan.webp",paid:0,sources:["nhtsa.gov/road-safety/child-safety","nhtsa.gov/road-safety/pedestrian-safety","nhtsa.gov/campaign/heatstroke","cdc.gov/pedestrian-bike-safety"]}
];
const credits=JSON.parse(read("assets/images/credits.json")); const sitemap=read("sitemap.xml");
for(const p of pages){
 if(!existsSync(resolve(root,p.path))){fail(`${p.path}: missing`);continue;} const h=read(p.path);
 if(!h.includes(`<h1>${p.title}</h1>`))fail(`${p.path}: title mismatch`);
 if(!h.includes(`rel="canonical" href="${p.canonical}"`))fail(`${p.path}: canonical mismatch`);
 if(!h.includes('datePublished":"2026-09-09"')||!h.includes('dateModified":"2026-09-09"'))fail(`${p.path}: structured dates missing`);
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
for(const [hub,targets] of Object.entries({"index.html":pages.map(p=>p.path),"adventures.html":pages.map(p=>p.path),"destinations.html":[pages[0].path],"outdoors.html":[pages[1].path,pages[2].path],"gear.html":[pages[1].path,pages[2].path]})){const h=read(hub);for(const t of targets)if(!h.includes(`href="${t}"`))fail(`${hub}: missing ${t}`);}
for(const [path,target] of Object.entries({"guides/syracuse-family-day-trip-guide.html":"most-syracuse-with-kids.html","guides/family-day-trip-system.html":"family-folding-wagon-guide.html","guides/family-lost-kid-plan.html":"family-parking-lot-plan.html"}))if(!read(path).includes(`href="${target}"`))fail(`${path}: missing related ${target}`);
if(failures.length){console.error(failures.map(x=>`FAIL ${x}`).join("\n"));process.exit(1);} console.log("PASS daily 2026-09-09: 3 substantial pages, 3 photographic heroes, 0 charts, 3 disclosed Amazon links, authoritative sources, discovery and related links verified.");
