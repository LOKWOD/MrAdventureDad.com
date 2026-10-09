import { existsSync, readFileSync, readdirSync } from "node:fs";
import { resolve } from "node:path";

const root=resolve(process.argv[2]||".");
const failures=[];
const fail=message=>failures.push(message);
const read=path=>readFileSync(resolve(root,path),"utf8");
const count=(text,pattern)=>(text.match(pattern)||[]).length;
const strip=html=>html.replace(/<script[\s\S]*?<\/script>/gi," ").replace(/<style[\s\S]*?<\/style>/gi," ").replace(/<[^>]+>/g," ").replace(/\s+/g," ").trim();
const pages=[
  {path:"guides/carpenters-brook-fish-hatchery-with-kids.html",title:"Carpenter’s Brook Fish Hatchery With Kids: Feed Fish, Read the Guide, Stop at 90 Minutes",image:"carpenters-brook-family-plan.webp",paid:0,sources:["onondagacountyparks.com/parks/carpenters-brook-fish-hatchery/","onondagacountyparks.com/activity/educational-tours/","weather.gov/bgm"]},
  {path:"guides/kids-insulated-food-jars-10-14-16-ounce-guide.html",title:"Kids’ Insulated Food Jars: 10 oz vs 14 oz vs 16 oz—and the Temperature Check",image:"kids-insulated-food-jar-sizes.webp",paid:3,sources:["fsis.usda.gov/news-events/news-press-releases/back-school-food-safety-tips-parents-and-caregivers","fsis.usda.gov/food-safety/safe-food-handling-and-preparation/food-safety-basics/keeping-bag-lunches-safe"]},
  {path:"guides/seven-night-family-moon-observation-log.html",title:"The Seven-Night Family Moon Log: Ten Minutes Outside, No Telescope",image:"family-seven-night-moon-log.webp",paid:0,sources:["science.nasa.gov/resource/moon-observation-journal/","science.nasa.gov/moon/moon-phases/","jpl.nasa.gov/edu/resources/project/look-at-the-moon-journaling-project/"]}
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
  if(!html.includes('datePublished":"2026-10-09"')||!html.includes('dateModified":"2026-10-09"'))fail(`${page.path}: structured dates missing`);
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
    for(const label of ["About-10-ounce insulated food jars","About-14-ounce wide-mouth food jars","About-16-ounce insulated food jars"])if(!html.includes(label))fail(`${page.path}: missing precise commercial category ${label}`);
  }
  if(count(sitemap,new RegExp(canonical.replace(/[.*+?^${}()|[\]\\]/g,"\\$&"),"g"))!==1)fail(`${page.path}: sitemap entry must appear once`);
}

for(const [key,note] of [
  ["assets/images/photos/carpenters-brook-family-plan.webp","not a photograph"],
  ["assets/images/photos/kids-insulated-food-jar-sizes.webp","no product"],
  ["assets/images/photos/family-seven-night-moon-log.webp","not a sky chart"]
]){
  if(!credits[key])fail(`image credit missing: ${key}`);
  else if(!credits[key].notes.toLowerCase().includes(note))fail(`image credit scope mismatch: ${key}`);
  if(!existsSync(resolve(root,key)))fail(`image asset missing: ${key}`);
}

for(const [hub,targets] of Object.entries({
  "index.html":pages.map(page=>page.path),
  "adventures.html":pages.map(page=>page.path),
  "destinations.html":[pages[0].path],
  "outdoors.html":[pages[0].path,pages[2].path],
  "gear.html":[pages[1].path]
}))for(const target of targets)if(!read(hub).includes(`href="${target}"`))fail(`${hub}: missing ${target}`);

for(const [path,target] of Object.entries({
  "guides/syracuse-family-day-trip-guide.html":"carpenters-brook-fish-hatchery-with-kids.html",
  "guides/first-fishing-trip-with-kids.html":"carpenters-brook-fish-hatchery-with-kids.html",
  "guides/family-day-trip-system.html":"carpenters-brook-fish-hatchery-with-kids.html",
  "guides/family-day-trip-cooler-guide.html":"kids-insulated-food-jars-10-14-16-ounce-guide.html",
  "guides/family-food-allergy-day-trip-plan.html":"kids-insulated-food-jars-10-14-16-ounce-guide.html",
  "guides/family-hydration-gear-guide.html":"kids-insulated-food-jars-10-14-16-ounce-guide.html",
  "guides/after-school-nature-walk-30-minute-plan.html":"seven-night-family-moon-observation-log.html",
  "guides/family-binoculars-8x-vs-10x.html":"seven-night-family-moon-observation-log.html",
  "guides/flashlight-shadow-lab-30-minute-family-science.html":"seven-night-family-moon-observation-log.html"
}))if(!read(path).includes(`href="${target}"`))fail(`${path}: missing related ${target}`);

if(!read("index.html").includes("FRESH IDEAS · OCTOBER 9, 2026"))fail("homepage current-date lead missing");
if(!read("index.html").includes('href="weekend-october-10-11-2026.html"'))fail("homepage weekend card missing current roundup");
if(read("index.html").includes("THIS WEEKEND · OCTOBER 3–4"))fail("homepage still promotes expired October 3–4 card");
if(!existsSync(resolve(root,"reports/editorial-decision-2026-10-09.md")))fail("editorial decision and authority log missing");
for(const id of ["hatchery-visit-card","food-jar-size-card","moon-log-card"])if(!pages.some(page=>read(page.path).includes(`id="${id}"`)))fail(`authority matrix missing: ${id}`);

const titles=new Map();
for(const html of allHtml){const title=/<h1>([\s\S]*?)<\/h1>/i.exec(html)?.[1]?.replace(/<[^>]+>/g," ").replace(/\s+/g," ").trim();if(title){if(titles.has(title))fail(`duplicate h1: ${title}`);else titles.set(title,true);}}
const sitewidePaid=allHtml.reduce((total,html)=>total+count(html,/data-affiliate-active="true"/g),0);
if(sitewidePaid!==184)fail(`expected 184 active affiliate links sitewide, found ${sitewidePaid}`);
const placements=pages.reduce((total,page)=>total+allHtml.filter(html=>html.includes(page.image)).length,0);
if(placements!==11)fail(`expected 11 new editorial image placements, found ${placements}`);
if(failures.length){console.error(failures.map(message=>`FAIL ${message}`).join("\n"));process.exit(1);}
console.log("PASS daily 2026-10-09: 3 substantial pages, 3 verified editorial heroes across 11 placements, 0 product images, 3 new disclosed Amazon links, 184 active affiliate links sitewide, 3 authority matrices, 9 reciprocal links, current weekly-roundup intent and homepage lead protected.");
