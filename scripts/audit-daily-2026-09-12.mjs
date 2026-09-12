import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";

const root=resolve(process.argv[2]||".");
const failures=[]; const fail=m=>failures.push(m); const read=p=>readFileSync(resolve(root,p),"utf8");
const count=(t,r)=>(t.match(r)||[]).length;
const strip=h=>h.replace(/<script[\s\S]*?<\/script>/gi," ").replace(/<style[\s\S]*?<\/style>/gi," ").replace(/<[^>]+>/g," ").replace(/\s+/g," ").trim();
const pages=[
 {path:"guides/fort-stanwix-with-kids.html",title:"Fort Stanwix With Kids: The Free History Day That Fits in Two Hours",canonical:"https://mradventuredad.com/guides/fort-stanwix-with-kids.html",photo:"fort-stanwix-national-monument.webp",paid:0,sources:["nps.gov/fost/planyourvisit/basicinfo","nps.gov/fost/planyourvisit/hours","nps.gov/fost/planyourvisit/accessibility","nps.gov/fost/planyourvisit/pets","nps.gov/fost/faqs"]},
 {path:"guides/kids-hiking-footwear-trail-runner-shoe-boot.html",title:"Kids’ Hiking Footwear: Trail Runner vs Hiking Shoe vs Boot—and the Fit-First Rule",canonical:"https://mradventuredad.com/guides/kids-hiking-footwear-trail-runner-shoe-boot.html",photo:"kids-hiking-footwear-categories.webp",paid:3,sources:["cpsc.gov/Recalls","merrell.com/US/en/content","salomon.com/en-us/sizingchart"]},
 {path:"guides/family-no-cell-service-day-trip-plan.html",title:"The Family No-Service Day-Trip Plan: Maps, Meeting Points, and the Turnaround Rule",canonical:"https://mradventuredad.com/guides/family-no-cell-service-day-trip-plan.html",photo:"family-no-cell-service-plan.webp",paid:0,sources:["ready.gov/plan","nps.gov/articles/10essentials","nps.gov/subjects/trails/index","support.google.com/maps/answer/6291838","support.apple.com/en-us/105084","weather.gov/safety"]}
];
const credits=JSON.parse(read("assets/images/credits.json")); const sitemap=read("sitemap.xml");
for(const p of pages){
 if(!existsSync(resolve(root,p.path))){fail(`${p.path}: missing`);continue;} const h=read(p.path);
 if(!h.includes(`<h1>${p.title}</h1>`))fail(`${p.path}: title mismatch`);
 if(!h.includes(`rel="canonical" href="${p.canonical}"`))fail(`${p.path}: canonical mismatch`);
 if(!h.includes('datePublished":"2026-09-12"')||!h.includes('dateModified":"2026-09-12"'))fail(`${p.path}: structured dates missing`);
 if(!/<meta property="og:title"/.test(h)||!/<meta name="twitter:card"/.test(h))fail(`${p.path}: social metadata missing`);
 if(!h.includes('application/ld+json')||!h.includes('"Article"')||!h.includes('"Guide"'))fail(`${p.path}: Article/Guide schema missing`);
 if(count(h,/class="article-hero"/g)!==1||!h.includes(`/photos/${p.photo}`))fail(`${p.path}: verified photo hero missing`);
 if(/<svg\b|<canvas\b|class="article-plan"/i.test(h))fail(`${p.path}: chart or diagram used`);
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
for(const [hub,targets] of Object.entries({"index.html":pages.map(p=>p.path),"adventures.html":pages.map(p=>p.path),"destinations.html":[pages[0].path],"outdoors.html":[pages[1].path,pages[2].path],"gear.html":[pages[1].path]})){const h=read(hub);for(const t of targets)if(!h.includes(`href="${t}"`))fail(`${hub}: missing ${t}`);}
for(const [path,target] of Object.entries({"guides/fort-ontario-with-kids.html":"fort-stanwix-with-kids.html","guides/kids-first-hike-guide.html":"kids-hiking-footwear-trail-runner-shoe-boot.html","guides/family-location-trackers-bluetooth-gps-watch-phone.html":"family-no-cell-service-day-trip-plan.html"}))if(!read(path).includes(`href="${target}"`))fail(`${path}: missing related ${target}`);
if(failures.length){console.error(failures.map(x=>`FAIL ${x}`).join("\n"));process.exit(1);} console.log("PASS daily 2026-09-12: 3 substantial pages, 3 photographic heroes, 0 charts, 3 disclosed Amazon links, authoritative sources, discovery and related links verified.");
