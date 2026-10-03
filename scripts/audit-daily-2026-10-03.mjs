import { existsSync, readFileSync, readdirSync } from "node:fs";
import { resolve } from "node:path";

const root=resolve(process.argv[2]||".");
const failures=[];
const fail=message=>failures.push(message);
const read=path=>readFileSync(resolve(root,path),"utf8");
const count=(text,pattern)=>(text.match(pattern)||[]).length;
const strip=html=>html.replace(/<script[\s\S]*?<\/script>/gi," ").replace(/<style[\s\S]*?<\/style>/gi," ").replace(/<[^>]+>/g," ").replace(/\s+/g," ").trim();
const pages=[
  {path:"guides/what-to-wear-howe-caverns-with-kids.html",title:"What to Wear at Howe Caverns With Kids: The 52°F, 139-Stair Packing Plan",image:"howe-caverns-52-degree-packing.webp",paid:3,sources:["howecaverns.com/cave-tours","howecaverns.com/howe-caverns-pricing"]},
  {path:"guides/stone-quarry-hill-art-park-with-kids.html",title:"Stone Quarry Hill Art Park With Kids: A 90-Minute Gravel Loop and Art-Stop Plan",image:"stone-quarry-art-park-family-plan.webp",paid:0,sources:["sqhap.org/visit"]},
  {path:"guides/neighborhood-sound-map-20-minute-family-activity.html",title:"The 20-Minute Neighborhood Sound Map: Sit, Listen, Draw What You Hear",image:"family-neighborhood-sound-map.webp",paid:0,sources:["nps.gov/teachers/classrooms/young-sound-seekers-soundwalk","home.nps.gov/articles/exploring-sounds"]}
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
  if(!html.includes('datePublished":"2026-10-03"')||!html.includes('dateModified":"2026-10-03"'))fail(`${page.path}: structured dates missing`);
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
    for(const label of ["Kids’ lightweight fleece layers","Kids’ lightweight rain shells","Kids’ closed-toe walking shoes"])if(!html.includes(label))fail(`${page.path}: missing precise commercial category ${label}`);
  }
  if(count(sitemap,new RegExp(canonical.replace(/[.*+?^${}()|[\]\\]/g,"\\$&"),"g"))!==1)fail(`${page.path}: sitemap entry must appear once`);
}

for(const [key,note] of [
  ["assets/images/photos/howe-caverns-52-degree-packing.webp","not a product image"],
  ["assets/images/photos/stone-quarry-art-park-family-plan.webp","does not depict Stone Quarry Hill"],
  ["assets/images/photos/family-neighborhood-sound-map.webp","no person, address"]
]){
  if(!credits[key])fail(`image credit missing: ${key}`);
  else if(!credits[key].notes.includes(note))fail(`image credit scope mismatch: ${key}`);
  if(!existsSync(resolve(root,key)))fail(`image asset missing: ${key}`);
}

for(const [hub,targets] of Object.entries({
  "index.html":pages.map(page=>page.path),
  "adventures.html":pages.map(page=>page.path),
  "destinations.html":[pages[1].path],
  "outdoors.html":[pages[1].path,pages[2].path],
  "gear.html":[pages[0].path]
}))for(const target of targets)if(!read(hub).includes(`href="${target}"`))fail(`${hub}: missing ${target}`);

for(const [path,target] of Object.entries({
  "guides/howe-caverns-with-kids.html":"what-to-wear-howe-caverns-with-kids.html",
  "guides/kids-hiking-footwear-trail-runner-shoe-boot.html":"what-to-wear-howe-caverns-with-kids.html",
  "guides/family-travel-bags-rolling-carry-on-duffel-backpack.html":"what-to-wear-howe-caverns-with-kids.html",
  "guides/central-new-york-family-trail-picker.html":"stone-quarry-hill-art-park-with-kids.html",
  "guides/iroquois-museum-with-kids.html":"stone-quarry-hill-art-park-with-kids.html",
  "guides/family-hydration-gear-guide.html":"stone-quarry-hill-art-park-with-kids.html",
  "guides/after-school-nature-walk-30-minute-plan.html":"neighborhood-sound-map-20-minute-family-activity.html",
  "guides/family-calendar-reset-20-minute-plan.html":"neighborhood-sound-map-20-minute-family-activity.html",
  "guides/flashlight-shadow-lab-30-minute-family-science.html":"neighborhood-sound-map-20-minute-family-activity.html"
}))if(!read(path).includes(`href="${target}"`))fail(`${path}: missing related ${target}`);

if(!read("index.html").includes("FRESH IDEAS · OCTOBER 3, 2026"))fail("homepage current-date lead missing");
if(!read("index.html").includes("weekend-october-3-4-2026.html"))fail("homepage current weekend roundup missing");
for(const id of ["howe-layer-matrix","stone-quarry-route-card","sound-map-matrix"])if(!pages.some(page=>read(page.path).includes(`id="${id}"`)))fail(`authority matrix missing: ${id}`);

const titles=new Map();
for(const html of allHtml){const title=/<h1>([\s\S]*?)<\/h1>/i.exec(html)?.[1]?.replace(/<[^>]+>/g," ").replace(/\s+/g," ").trim();if(title){if(titles.has(title))fail(`duplicate h1: ${title}`);else titles.set(title,true);}}
const sitewidePaid=allHtml.reduce((total,html)=>total+count(html,/data-affiliate-active="true"/g),0);
if(sitewidePaid!==169)fail(`expected 169 active affiliate links sitewide, found ${sitewidePaid}`);
const placements=pages.reduce((total,page)=>total+allHtml.filter(html=>html.includes(page.image)).length,0);
if(placements!==11)fail(`expected 11 new editorial image placements, found ${placements}`);
if(failures.length){console.error(failures.map(message=>`FAIL ${message}`).join("\n"));process.exit(1);}
console.log("PASS daily 2026-10-03: 3 substantial pages, 3 verified editorial heroes across 11 placements, 0 product images, 3 new disclosed Amazon links, 169 active affiliate links sitewide, 3 authority matrices, 9 reciprocal links, protected October 3–4 roundup and current homepage lead verified.");
