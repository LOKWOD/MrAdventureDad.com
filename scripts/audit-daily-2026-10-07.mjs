import { existsSync, readFileSync, readdirSync } from "node:fs";
import { resolve } from "node:path";

const root=resolve(process.argv[2]||".");
const failures=[];
const fail=message=>failures.push(message);
const read=path=>readFileSync(resolve(root,path),"utf8");
const count=(text,pattern)=>(text.match(pattern)||[]).length;
const strip=html=>html.replace(/<script[\s\S]*?<\/script>/gi," ").replace(/<style[\s\S]*?<\/style>/gi," ").replace(/<[^>]+>/g," ").replace(/\s+/g," ").trim();
const pages=[
  {path:"guides/camillus-erie-canal-park-with-kids.html",title:"Camillus Erie Canal Park With Kids: Museum First, Towpath Second",image:"camillus-erie-canal-family-plan.webp",paid:0,sources:["townofcamillus.gov/default.aspx?PageID=858","camillusrecreation.com/erie-canal","eriecanalcamillus.org/visit-us"]},
  {path:"guides/kids-fall-trail-layers-base-fleece-insulation-shell-guide.html",title:"Kids’ Fall Trail Layers: Base Layer vs Fleece vs Insulation vs Shell",image:"kids-fall-trail-layer-categories.webp",paid:3,sources:["nps.gov/articles/winterweather","noaa.gov/explainers/great-outdoors-weather-safety","weather.gov/safety/cold-during"]},
  {path:"guides/paper-bridge-load-test-25-minute-family-stem.html",title:"The 25-Minute Paper Bridge Load Test: Fold, Predict, Measure, Improve",image:"family-paper-bridge-load-test.webp",paid:0,sources:["sciencebuddies.org/stem-activities/build-best-bridge","teachengineering.org/activities/nyu_bridge_activity1"]}
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
  if(!html.includes('datePublished":"2026-10-07"')||!html.includes('dateModified":"2026-10-07"'))fail(`${page.path}: structured dates missing`);
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
    for(const label of ["Kids’ moisture-managing base layers","Kids’ full-zip fleece midlayers","Kids’ weather shells"])if(!html.includes(label))fail(`${page.path}: missing precise commercial category ${label}`);
  }
  if(count(sitemap,new RegExp(canonical.replace(/[.*+?^${}()|[\]\\]/g,"\\$&"),"g"))!==1)fail(`${page.path}: sitemap entry must appear once`);
}

for(const [key,note] of [
  ["assets/images/photos/camillus-erie-canal-family-plan.webp","not a photograph"],
  ["assets/images/photos/kids-fall-trail-layer-categories.webp","no product was tested"],
  ["assets/images/photos/family-paper-bridge-load-test.webp","not a structural"]
]){
  if(!credits[key])fail(`image credit missing: ${key}`);
  else if(!credits[key].notes.includes(note))fail(`image credit scope mismatch: ${key}`);
  if(!existsSync(resolve(root,key)))fail(`image asset missing: ${key}`);
}

for(const [hub,targets] of Object.entries({
  "index.html":pages.map(page=>page.path),
  "adventures.html":pages.map(page=>page.path),
  "destinations.html":[pages[0].path],
  "outdoors.html":[pages[0].path,pages[1].path],
  "gear.html":[pages[1].path]
}))for(const target of targets)if(!read(hub).includes(`href="${target}"`))fail(`${hub}: missing ${target}`);

for(const [path,target] of Object.entries({
  "guides/erie-canal-museum-with-kids.html":"camillus-erie-canal-park-with-kids.html",
  "guides/syracuse-family-day-trip-guide.html":"camillus-erie-canal-park-with-kids.html",
  "guides/family-day-trip-system.html":"camillus-erie-canal-park-with-kids.html",
  "guides/family-rain-gear-guide.html":"kids-fall-trail-layers-base-fleece-insulation-shell-guide.html",
  "guides/kids-hiking-socks-wool-synthetic-cotton-guide.html":"kids-fall-trail-layers-base-fleece-insulation-shell-guide.html",
  "guides/family-hiking-daypack-guide.html":"kids-fall-trail-layers-base-fleece-insulation-shell-guide.html",
  "guides/flashlight-shadow-lab-30-minute-family-science.html":"paper-bridge-load-test-25-minute-family-stem.html",
  "guides/family-library-night-45-minute-plan.html":"paper-bridge-load-test-25-minute-family-stem.html",
  "guides/living-room-picnic-30-minute-family-plan.html":"paper-bridge-load-test-25-minute-family-stem.html"
}))if(!read(path).includes(`href="${target}"`))fail(`${path}: missing related ${target}`);

if(!read("index.html").includes("FRESH IDEAS · OCTOBER 7, 2026"))fail("homepage current-date lead missing");
if(!read("index.html").includes('href="weekend-october-10-11-2026.html"'))fail("homepage weekend card missing current roundup");
if(read("index.html").includes("THIS WEEKEND · OCTOBER 3–4"))fail("homepage still promotes expired October 3–4 card");
if(!existsSync(resolve(root,"reports/editorial-decision-2026-10-07.md")))fail("editorial decision and authority log missing");
for(const id of ["camillus-canal-plan","fall-layer-matrix","paper-bridge-test-card"])if(!pages.some(page=>read(page.path).includes(`id="${id}"`)))fail(`authority matrix missing: ${id}`);

const titles=new Map();
for(const html of allHtml){const title=/<h1>([\s\S]*?)<\/h1>/i.exec(html)?.[1]?.replace(/<[^>]+>/g," ").replace(/\s+/g," ").trim();if(title){if(titles.has(title))fail(`duplicate h1: ${title}`);else titles.set(title,true);}}
const sitewidePaid=allHtml.reduce((total,html)=>total+count(html,/data-affiliate-active="true"/g),0);
if(sitewidePaid!==178)fail(`expected 178 active affiliate links sitewide, found ${sitewidePaid}`);
const placements=pages.reduce((total,page)=>total+allHtml.filter(html=>html.includes(page.image)).length,0);
if(placements!==11)fail(`expected 11 new editorial image placements, found ${placements}`);
if(failures.length){console.error(failures.map(message=>`FAIL ${message}`).join("\n"));process.exit(1);}
console.log("PASS daily 2026-10-07: 3 substantial pages, 3 verified editorial heroes across 11 placements, 0 product images, 3 new disclosed Amazon links, 178 active affiliate links sitewide, 3 authority matrices, 9 reciprocal links, current weekly-roundup intent and homepage lead protected.");
