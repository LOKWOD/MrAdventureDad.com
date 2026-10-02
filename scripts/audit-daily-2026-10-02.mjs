import { existsSync, readFileSync, readdirSync } from "node:fs";
import { resolve } from "node:path";

const root = resolve(process.argv[2] || ".");
const failures = [];
const fail = message => failures.push(message);
const read = path => readFileSync(resolve(root, path), "utf8");
const count = (text, pattern) => (text.match(pattern) || []).length;
const strip = html => html.replace(/<script[\s\S]*?<\/script>/gi," ").replace(/<style[\s\S]*?<\/style>/gi," ").replace(/<[^>]+>/g," ").replace(/\s+/g," ").trim();
const pages = [
  {path:"guides/central-new-york-family-trail-picker.html",title:"Central New York Family Trail Picker: Clark vs Green Lakes vs Baltimore Woods vs Beaver Lake",image:"cny-family-trail-choice.webp",paid:0,sources:["parks.ny.gov/visit/state-parks/clark-reservation-state-park","parks.ny.gov/visit/state-parks/green-lakes-state-park","baltimorewoods.org/frequently_asked_program_questions","onondagacountyparks.com/parks/beaver-lake-nature-center"]},
  {path:"guides/kids-hiking-gloves-fleece-shell-insulated-guide.html",title:"Kids’ Hiking Gloves: Fleece vs Shell Mittens vs Insulated Gloves—and the Grip Test",image:"kids-hiking-glove-categories.webp",paid:3,sources:["healthychildren.org/English/safety-prevention/at-play/Pages/Winter-Safety.aspx","weather.gov/safety/cold-during","dec.ny.gov/things-to-do/hiking/lost","cpsc.gov/Recalls"]},
  {path:"guides/flashlight-shadow-lab-30-minute-family-science.html",title:"The 30-Minute Flashlight Shadow Lab: Move the Light, Measure the Change",image:"family-flashlight-shadow-lab.webp",paid:0,sources:["exploratorium.edu/education/ifi/watch-and-do/shadows","exploratorium.edu/tinkering/projects/light-shadow-explorations"]}
];
const sitemap = read("sitemap.xml");
const credits = JSON.parse(read("assets/images/credits.json"));
const allHtml=[];
const walk=directory=>{for(const entry of readdirSync(directory,{withFileTypes:true})){if(entry.name===".git")continue;const path=resolve(directory,entry.name);if(entry.isDirectory())walk(path);else if(entry.name.endsWith(".html"))allHtml.push(readFileSync(path,"utf8"));}};
walk(root);

for (const page of pages) {
  const canonical = `https://mradventuredad.com/${page.path}`;
  if (!existsSync(resolve(root,page.path))) { fail(`${page.path}: missing`); continue; }
  const html = read(page.path);
  if (!html.includes(`<h1>${page.title}</h1>`)) fail(`${page.path}: title mismatch`);
  if (!html.includes(`rel="canonical" href="${canonical}"`)) fail(`${page.path}: canonical mismatch`);
  if (!html.includes('datePublished":"2026-10-02"') || !html.includes('dateModified":"2026-10-02"')) fail(`${page.path}: structured dates missing`);
  if (!/<meta property="og:title"/.test(html) || !/<meta name="twitter:card"/.test(html)) fail(`${page.path}: social metadata missing`);
  if (!html.includes('application/ld+json') || !html.includes('"Article"') || !html.includes('"Guide"')) fail(`${page.path}: Article/Guide schema missing`);
  if (count(html,/class="article-hero"/g)!==1 || !html.includes(page.image)) fail(`${page.path}: verified hero missing`);
  if (count(html,/<img\b/gi)!==count(html,/<img\b[^>]*\balt="[^"]+"/gi)) fail(`${page.path}: image alt text failure`);
  if (!html.includes('data-cf-beacon=') || !html.includes('data-site="mr-adventure-dad"')) fail(`${page.path}: analytics or visitor beacon missing`);
  const internal=[...html.matchAll(/<a\b[^>]*href="([^"#]+\.html(?:#[^"]*)?)"/gi)].map(match=>match[1]);
  if(new Set(internal).size<3)fail(`${page.path}: fewer than three internal targets`);
  const words=strip(html).split(/\s+/).length;
  if(words<1200)fail(`${page.path}: insufficient substantial copy (${words} words)`);
  for(const source of page.sources)if(!html.toLowerCase().includes(source.toLowerCase()))fail(`${page.path}: missing source ${source}`);
  const paid=count(html,/data-affiliate-active="true"/g);
  if(paid!==page.paid)fail(`${page.path}: expected ${page.paid} paid links, found ${paid}`);
  if(paid){
    if(count(html,/tag=mradventuredad-20/g)!==paid)fail(`${page.path}: Amazon tag mismatch`);
    if(count(html,/rel="sponsored nofollow noopener noreferrer"/g)!==paid)fail(`${page.path}: paid-link rel mismatch`);
    if(!html.includes('As an Amazon Associate I earn from qualifying purchases'))fail(`${page.path}: disclosure missing`);
    for(const label of ["Kids’ fleece hiking gloves","Kids’ waterproof shell mittens","Kids’ insulated hiking gloves"])if(!html.includes(label))fail(`${page.path}: missing precise commercial category ${label}`);
  }
  if(count(sitemap,new RegExp(canonical.replace(/[.*+?^${}()|[\]\\]/g,"\\$&"),"g"))!==1)fail(`${page.path}: sitemap entry must appear once`);
}

for(const [key,note] of [
  ["assets/images/photos/cny-family-trail-choice.webp","does not depict a real trail"],
  ["assets/images/photos/kids-hiking-glove-categories.webp","not a product image, tested item"],
  ["assets/images/photos/family-flashlight-shadow-lab.webp","no identifiable family"]
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
  "guides/clark-reservation-state-park-with-kids.html":"central-new-york-family-trail-picker.html",
  "guides/green-lakes-state-park-with-kids.html":"central-new-york-family-trail-picker.html",
  "guides/baltimore-woods-with-kids.html":"central-new-york-family-trail-picker.html",
  "guides/beaver-lake-nature-center-with-kids.html":"central-new-york-family-trail-picker.html",
  "guides/kids-hiking-socks-wool-synthetic-cotton-guide.html":"kids-hiking-gloves-fleece-shell-insulated-guide.html",
  "guides/kids-hiking-footwear-trail-runner-shoe-boot.html":"kids-hiking-gloves-fleece-shell-insulated-guide.html",
  "guides/family-outdoor-weather-cutoff-plan.html":"kids-hiking-gloves-fleece-shell-insulated-guide.html",
  "guides/family-library-night-45-minute-plan.html":"flashlight-shadow-lab-30-minute-family-science.html",
  "guides/family-calendar-reset-20-minute-plan.html":"flashlight-shadow-lab-30-minute-family-science.html"
}))if(!read(path).includes(`href="${target}"`))fail(`${path}: missing related ${target}`);

if(!read("index.html").includes("FRESH IDEAS · OCTOBER 2, 2026"))fail("homepage current-date lead missing");
if(!read("index.html").includes("weekend-october-3-4-2026.html"))fail("homepage current weekend roundup missing");
for(const id of ["trail-picker-matrix","glove-category-matrix","shadow-lab-card"])if(!pages.some(page=>read(page.path).includes(`id="${id}"`)))fail(`authority matrix missing: ${id}`);

const titles=new Map();
for(const html of allHtml){const title=/<h1>([\s\S]*?)<\/h1>/i.exec(html)?.[1]?.replace(/<[^>]+>/g," ").replace(/\s+/g," ").trim();if(title){if(titles.has(title))fail(`duplicate h1: ${title}`);else titles.set(title,true);}}
const sitewidePaid=allHtml.reduce((total,html)=>total+count(html,/data-affiliate-active="true"/g),0);
if(sitewidePaid!==166)fail(`expected 166 active affiliate links sitewide, found ${sitewidePaid}`);
const placements=pages.reduce((total,page)=>total+allHtml.filter(html=>html.includes(page.image)).length,0);
if(placements!==11)fail(`expected 11 new editorial image placements, found ${placements}`);
if(failures.length){console.error(failures.map(message=>`FAIL ${message}`).join("\n"));process.exit(1);}
console.log("PASS daily 2026-10-02: 3 substantial pages, 3 verified editorial heroes across 11 placements, 0 product images, 3 new disclosed Amazon links, 166 active affiliate links sitewide, 3 authority matrices, 9 reciprocal links, protected October 3–4 roundup and current homepage lead verified.");
