import { existsSync, readFileSync, readdirSync } from "node:fs";
import { resolve } from "node:path";

const root=resolve(process.argv[2]||".");
const failures=[];
const fail=message=>failures.push(message);
const read=path=>readFileSync(resolve(root,path),"utf8");
const count=(text,pattern)=>(text.match(pattern)||[]).length;
const strip=html=>html.replace(/<script[\s\S]*?<\/script>/gi," ").replace(/<style[\s\S]*?<\/style>/gi," ").replace(/<[^>]+>/g," ").replace(/\s+/g," ").trim();
const pages=[
  {path:"guides/onondaga-lake-park-with-kids.html",title:"Onondaga Lake Park With Kids: Pick One Zone, Then Add the Trail",image:"onondaga-lake-park-family-plan.webp",paid:0,sources:["onondagacountyparks.com/parks/onondaga-lake-park/","onondagacountyparks.com/parks/onondaga-lake-park/trails/","weather.gov/bgm"]},
  {path:"guides/kids-sleeping-bag-temperature-rating-fit-fill-guide.html",title:"Kids’ Sleeping Bags: Ratings, Fit, Fill and the Pad-First Rule",image:"kids-sleeping-bag-categories.webp",paid:3,sources:["iso.org/standard/82789","weather.gov/safety/cold-before","support.nemoequipment.com/hc/en-us/articles/360054646751"]},
  {path:"guides/family-photo-scavenger-hunt-30-minute-no-posting-plan.html",title:"The 30-Minute Family Photo Scavenger Hunt: Six Clues, Zero Posting",image:"family-photo-scavenger-hunt.webp",paid:0,sources:["consumer.ftc.gov/articles/how-protect-your-privacy-apps","nps.gov/articles/leave-no-trace-seven-principles","weather.gov/safety"]}
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
  if(!html.includes('datePublished":"2026-10-08"')||!html.includes('dateModified":"2026-10-08"'))fail(`${page.path}: structured dates missing`);
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
    for(const label of ["Rectangular kids’ sleeping bags","Tapered kids’ sleeping bags","Adjustable-length youth sleeping bags"])if(!html.includes(label))fail(`${page.path}: missing precise commercial category ${label}`);
  }
  if(count(sitemap,new RegExp(canonical.replace(/[.*+?^${}()|[\]\\]/g,"\\$&"),"g"))!==1)fail(`${page.path}: sitemap entry must appear once`);
}

for(const [key,note] of [
  ["assets/images/photos/onondaga-lake-park-family-plan.webp","not a photograph"],
  ["assets/images/photos/kids-sleeping-bag-categories.webp","no product"],
  ["assets/images/photos/family-photo-scavenger-hunt.webp","no child"]
]){
  if(!credits[key])fail(`image credit missing: ${key}`);
  else if(!credits[key].notes.toLowerCase().includes(note))fail(`image credit scope mismatch: ${key}`);
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
  "guides/syracuse-family-day-trip-guide.html":"onondaga-lake-park-with-kids.html",
  "guides/family-day-trip-system.html":"onondaga-lake-park-with-kids.html",
  "guides/family-bike-ride-plan.html":"onondaga-lake-park-with-kids.html",
  "guides/family-camping-sleep-system-guide.html":"kids-sleeping-bag-temperature-rating-fit-fill-guide.html",
  "guides/one-night-camping-with-kids.html":"kids-sleeping-bag-temperature-rating-fit-fill-guide.html",
  "guides/family-headlamps-flashlights-lanterns.html":"kids-sleeping-bag-temperature-rating-fit-fill-guide.html",
  "guides/kids-camera-simple-digital-instant-rugged-guide.html":"family-photo-scavenger-hunt-30-minute-no-posting-plan.html",
  "guides/after-school-nature-walk-30-minute-plan.html":"family-photo-scavenger-hunt-30-minute-no-posting-plan.html",
  "guides/family-nature-observation-kit-magnifier-bug-viewer-macro-lens.html":"family-photo-scavenger-hunt-30-minute-no-posting-plan.html"
}))if(!read(path).includes(`href="${target}"`))fail(`${path}: missing related ${target}`);

if(!read("index.html").includes("FRESH IDEAS · OCTOBER 8, 2026"))fail("homepage current-date lead missing");
if(!read("index.html").includes('href="weekend-october-10-11-2026.html"'))fail("homepage weekend card missing current roundup");
if(read("index.html").includes("THIS WEEKEND · OCTOBER 3–4"))fail("homepage still promotes expired October 3–4 card");
if(!existsSync(resolve(root,"reports/editorial-decision-2026-10-08.md")))fail("editorial decision and authority log missing");
for(const id of ["onondaga-zone-card","kids-sleeping-bag-card","photo-hunt-clue-card"])if(!pages.some(page=>read(page.path).includes(`id="${id}"`)))fail(`authority matrix missing: ${id}`);

const titles=new Map();
for(const html of allHtml){const title=/<h1>([\s\S]*?)<\/h1>/i.exec(html)?.[1]?.replace(/<[^>]+>/g," ").replace(/\s+/g," ").trim();if(title){if(titles.has(title))fail(`duplicate h1: ${title}`);else titles.set(title,true);}}
const sitewidePaid=allHtml.reduce((total,html)=>total+count(html,/data-affiliate-active="true"/g),0);
if(sitewidePaid!==181)fail(`expected 181 active affiliate links sitewide, found ${sitewidePaid}`);
const placements=pages.reduce((total,page)=>total+allHtml.filter(html=>html.includes(page.image)).length,0);
if(placements!==11)fail(`expected 11 new editorial image placements, found ${placements}`);
if(failures.length){console.error(failures.map(message=>`FAIL ${message}`).join("\n"));process.exit(1);}
console.log("PASS daily 2026-10-08: 3 substantial pages, 3 verified editorial heroes across 11 placements, 0 product images, 3 new disclosed Amazon links, 181 active affiliate links sitewide, 3 authority matrices, 9 reciprocal links, current weekly-roundup intent and homepage lead protected.");
