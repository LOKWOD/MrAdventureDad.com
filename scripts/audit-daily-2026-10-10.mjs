import { existsSync, readFileSync, readdirSync } from "node:fs";
import { resolve } from "node:path";

const root=resolve(process.argv[2]||".");
const failures=[];
const fail=message=>failures.push(message);
const read=path=>readFileSync(resolve(root,path),"utf8");
const count=(text,pattern)=>(text.match(pattern)||[]).length;
const strip=html=>html.replace(/<script[\s\S]*?<\/script>/gi," ").replace(/<style[\s\S]*?<\/style>/gi," ").replace(/<[^>]+>/g," ").replace(/\s+/g," ").trim();
const pages=[
  {path:"guides/everson-museum-with-kids.html",title:"Everson Museum With Kids: A 90-Minute Look, Sketch, Leave Plan",image:"everson-museum-family-plan.webp",paid:0,sources:["everson.org/visit/","everson.org/about/museum-policies/","everson.org/exhibitions/"]},
  {path:"guides/family-hand-warmers-air-activated-snap-disc-rechargeable-guide.html",title:"Family Hand Warmers: Air-Activated vs Snap-Disc vs Rechargeable—and the Recall Gate",image:"family-hand-warmer-categories.webp",paid:2,sources:["cpsc.gov/Recalls/2026/OCOOPA-Direct-Recalls","cpsc.gov/Recalls","poison.org/articles/iron-poisoning","warmers.com/","faa.gov/hazmat/packsafe"]},
  {path:"guides/teach-kids-read-trail-map-25-minute-game.html",title:"Teach Kids to Read a Trail Map: A 25-Minute Kitchen-Table Route Game",image:"kids-trail-map-reading-game.webp",paid:0,sources:["usgs.gov/educational-resources/topographic-map-symbols","usgs.gov/faqs/where-can-i-find-a-topographic-map-symbol-sheet","nps.gov/articles/10essentials.htm","nps.gov/subjects/healthandsafety/trip-planning-guide.htm"]}
];
const sitemap=read("sitemap.xml");
const credits=JSON.parse(read("assets/images/credits.json"));
const allHtml=[];
const walk=directory=>{for(const entry of readdirSync(directory,{withFileTypes:true})){if(entry.name===".git")continue;const path=resolve(directory,entry.name);if(entry.isDirectory())walk(path);else if(entry.name.endsWith(".html"))allHtml.push(readFileSync(path,"utf8"));}};
walk(root);

for(const page of pages){
  const canonical=`https://mradventuredad.com/${page.path}`;
  if(!existsSync(resolve(root,page.path))){fail(`${page.path}: missing`);continue;}
  const html=read(page.path);
  if(!html.includes(`<h1>${page.title}</h1>`))fail(`${page.path}: title mismatch`);
  if(!html.includes(`rel="canonical" href="${canonical}"`))fail(`${page.path}: canonical mismatch`);
  if(!html.includes('datePublished":"2026-10-10"')||!html.includes('dateModified":"2026-10-10"'))fail(`${page.path}: structured dates missing`);
  if(!/<meta property="og:title"/.test(html)||!/<meta name="twitter:card"/.test(html))fail(`${page.path}: social metadata missing`);
  if(!html.includes('application/ld+json')||!html.includes('"Article"')||!html.includes('"Guide"'))fail(`${page.path}: Article/Guide schema missing`);
  if(count(html,/class="article-hero"/g)!==1||!html.includes(page.image))fail(`${page.path}: verified hero missing`);
  if(count(html,/<img\b/gi)!==count(html,/<img\b[^>]*\balt="[^"]+"/gi))fail(`${page.path}: image alt text failure`);
  if(!html.includes('data-cf-beacon=')||!html.includes('data-site="mr-adventure-dad"'))fail(`${page.path}: analytics or visitor beacon missing`);
  const internal=[...html.matchAll(/<a\b[^>]*href="([^"#]+\.html(?:#[^"]*)?)"/gi)].map(match=>match[1]);
  if(new Set(internal).size<3)fail(`${page.path}: fewer than three internal targets`);
  const words=strip(html).split(/\s+/).length;
  if(words<1000)fail(`${page.path}: insufficient substantial copy (${words} words)`);
  for(const source of page.sources)if(!html.toLowerCase().includes(source.toLowerCase()))fail(`${page.path}: missing source ${source}`);
  const paid=count(html,/data-affiliate-active="true"/g);
  if(paid!==page.paid)fail(`${page.path}: expected ${page.paid} paid links, found ${paid}`);
  if(paid){
    if(count(html,/tag=mradventuredad-20/g)!==paid)fail(`${page.path}: Amazon tag mismatch`);
    if(count(html,/rel="sponsored nofollow noopener noreferrer"/g)!==paid)fail(`${page.path}: paid-link rel mismatch`);
    if(!html.includes('As an Amazon Associate I earn from qualifying purchases'))fail(`${page.path}: disclosure missing`);
    for(const label of ["Air-activated hand-warmer packets","Reusable snap-disc hand warmers"])if(!html.includes(label))fail(`${page.path}: missing commercial category ${label}`);
    if(/commerce-module[\s\S]*?<img/i.test(html))fail(`${page.path}: product image present in commerce module`);
  }
  if(count(sitemap,new RegExp(canonical.replace(/[.*+?^${}()|[\]\\]/g,"\\$&"),"g"))!==1)fail(`${page.path}: sitemap entry must appear once`);
}

for(const [key,note] of [
  ["assets/images/photos/everson-museum-family-plan.webp","not the everson"],
  ["assets/images/photos/family-hand-warmer-categories.webp","unbranded category"],
  ["assets/images/photos/kids-trail-map-reading-game.webp","intentionally fictional"]
]){
  if(!credits[key])fail(`image credit missing: ${key}`);
  else if(!credits[key].notes.toLowerCase().includes(note))fail(`image credit scope mismatch: ${key}`);
  if(!existsSync(resolve(root,key)))fail(`image asset missing: ${key}`);
}

for(const [hub,targets] of Object.entries({
  "index.html":pages.map(page=>page.path),
  "adventures.html":pages.map(page=>page.path),
  "destinations.html":[pages[0].path],
  "gear.html":[pages[1].path],
  "outdoors.html":[pages[1].path,pages[2].path]
}))for(const target of targets)if(!read(hub).includes(`href="${target}"`))fail(`${hub}: missing ${target}`);

for(const [path,target] of Object.entries({
  "guides/family-museum-day-system.html":"everson-museum-with-kids.html",
  "guides/syracuse-family-outing-picker-most-zoo-erie-canal-museum.html":"everson-museum-with-kids.html",
  "guides/most-syracuse-with-kids.html":"everson-museum-with-kids.html",
  "guides/kids-hiking-gloves-fleece-shell-insulated-guide.html":"family-hand-warmers-air-activated-snap-disc-rechargeable-guide.html",
  "guides/kids-fall-trail-layers-base-fleece-insulation-shell-guide.html":"family-hand-warmers-air-activated-snap-disc-rechargeable-guide.html",
  "guides/family-outdoor-weather-cutoff-plan.html":"family-hand-warmers-air-activated-snap-disc-rechargeable-guide.html",
  "guides/family-no-cell-service-day-trip-plan.html":"teach-kids-read-trail-map-25-minute-game.html",
  "guides/central-new-york-family-trail-picker.html":"teach-kids-read-trail-map-25-minute-game.html",
  "guides/kids-first-hike-guide.html":"teach-kids-read-trail-map-25-minute-game.html"
}))if(!read(path).includes(`href="${target}"`))fail(`${path}: missing related ${target}`);

if(!read("index.html").includes("FRESH IDEAS · OCTOBER 10, 2026"))fail("homepage current-date lead missing");
if(!read("index.html").includes('href="weekend-october-10-11-2026.html"'))fail("homepage current weekly roundup missing");
if(count(read("index.html"),/weekend-october-10-11-2026\.html/g)!==2)fail("homepage weekly-roundup links changed unexpectedly");
if(!existsSync(resolve(root,"reports/editorial-decision-2026-10-10.md")))fail("editorial decision report missing");
if(!existsSync(resolve(root,"reports/authority-opportunities.md")))fail("authority opportunity log missing");
for(const id of ["everson-visit-card","hand-warmer-decision-card","map-game-card"])if(!pages.some(page=>read(page.path).includes(`id="${id}"`)))fail(`authority matrix missing: ${id}`);

const titles=new Map();
for(const html of allHtml){const title=/<h1>([\s\S]*?)<\/h1>/i.exec(html)?.[1]?.replace(/<[^>]+>/g," ").replace(/\s+/g," ").trim();if(title){if(titles.has(title))fail(`duplicate h1: ${title}`);else titles.set(title,true);}}
const sitemapUrls=[...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map(match=>match[1]);
if(new Set(sitemapUrls).size!==sitemapUrls.length)fail("sitemap contains duplicate URLs");
const sitewidePaid=allHtml.reduce((total,html)=>total+count(html,/data-affiliate-active="true"/g),0);
if(sitewidePaid!==186)fail(`expected 186 active affiliate links sitewide, found ${sitewidePaid}`);
const placements=pages.reduce((total,page)=>total+allHtml.filter(html=>html.includes(page.image)).length,0);
if(placements!==11)fail(`expected 11 new editorial image placements, found ${placements}`);
if(allHtml.length!==131)fail(`expected 131 HTML documents, found ${allHtml.length}`);
if(count(sitemap,/<url>/g)!==131)fail(`expected 131 sitemap URLs, found ${count(sitemap,/<url>/g)}`);
if(failures.length){console.error(failures.map(message=>`FAIL ${message}`).join("\n"));process.exit(1);}
console.log("PASS daily 2026-10-10: 3 substantial pages, 3 verified editorial heroes across 11 placements, 0 product images, 2 new disclosed Amazon links, 186 active affiliate links sitewide, 3 authority matrices, 9 reciprocal links, current weekly-roundup intent and homepage lead protected.");
