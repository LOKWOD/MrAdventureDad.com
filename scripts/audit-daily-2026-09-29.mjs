import { existsSync, readFileSync, readdirSync } from "node:fs";
import { resolve } from "node:path";

const root = resolve(process.argv[2] || ".");
const failures = [];
const fail = message => failures.push(message);
const read = path => readFileSync(resolve(root, path), "utf8");
const count = (text, pattern) => (text.match(pattern) || []).length;
const strip = html => html.replace(/<script[\s\S]*?<\/script>/gi," ").replace(/<style[\s\S]*?<\/style>/gi," ").replace(/<[^>]+>/g," ").replace(/\s+/g," ").trim();
const pages = [
  {path:"guides/baltimore-woods-with-kids.html",title:"Baltimore Woods With Kids: Pick One Loop, Sign In, Leave the Dog Home",image:"baltimore-woods-family-plan.webp",paid:0,sources:["baltimorewoods.org/visit/interpretive-center-trails","Baltimore-Woods-Nature-Center-Trails-2024_web.pdf","forecast.weather.gov/MapClick"]},
  {path:"guides/kids-hiking-socks-wool-synthetic-cotton-guide.html",title:"Kids’ Hiking Socks: Wool Blend vs Synthetic vs Cotton—and the Shoe-Fit Check",image:"kids-hiking-sock-categories.webp",paid:3,sources:["nps.gov/articles/hiking-safety","aad.org/public/everyday-care/injured-skin/burns/prevent-treat-blisters","cdc.gov/natural-disasters/psa-toolkit/preventing-trench-foot"]},
  {path:"guides/family-medicine-away-from-home-plan.html",title:"The Family Medicine Away-From-Home Plan: Pack, Lock, List, Return",image:"family-medicine-away-plan.webp",paid:0,sources:["fda.gov/drugs/information-consumers-and-patients-drugs/think-it-through","upandaway.org","wwwnc.cdc.gov/travel/page/travel-abroad-with-medicine","poison.org"]}
];
const sitemap = read("sitemap.xml");
const credits = JSON.parse(read("assets/images/credits.json"));
const titles = new Set();

for (const page of pages) {
  const canonical = `https://mradventuredad.com/${page.path}`;
  if (!existsSync(resolve(root,page.path))) { fail(`${page.path}: missing`); continue; }
  const html = read(page.path);
  if (!html.includes(`<h1>${page.title}</h1>`)) fail(`${page.path}: title mismatch`);
  if (!html.includes(`rel="canonical" href="${canonical}"`)) fail(`${page.path}: canonical mismatch`);
  if (!html.includes('datePublished":"2026-09-29"') || !html.includes('dateModified":"2026-09-29"')) fail(`${page.path}: structured dates missing`);
  if (!/<meta property="og:title"/.test(html) || !/<meta name="twitter:card"/.test(html)) fail(`${page.path}: social metadata missing`);
  if (!html.includes('application/ld+json') || !html.includes('"Article"') || !html.includes('"Guide"')) fail(`${page.path}: Article/Guide schema missing`);
  if (count(html,/class="article-hero"/g)!==1 || !html.includes(page.image)) fail(`${page.path}: verified hero missing`);
  if (/<svg\b|<canvas\b|class="article-plan"/i.test(html)) fail(`${page.path}: unexpected diagram used`);
  if (count(html,/<img\b/gi)!==count(html,/<img\b[^>]*\balt="[^"]+"/gi)) fail(`${page.path}: image alt text failure`);
  if (!html.includes('data-cf-beacon=') || !html.includes('data-site="mr-adventure-dad"')) fail(`${page.path}: analytics or visitor beacon missing`);
  const internal=[...html.matchAll(/<a\b[^>]*href="([^"#]+\.html(?:#[^"]*)?)"/gi)].map(match=>match[1]);
  if(new Set(internal).size<3)fail(`${page.path}: fewer than three internal targets`);
  const words=strip(html).split(/\s+/).length;
  if(words<1050)fail(`${page.path}: insufficient substantial copy (${words} words)`);
  for(const source of page.sources)if(!html.toLowerCase().includes(source.toLowerCase()))fail(`${page.path}: missing source ${source}`);
  const paid=count(html,/data-affiliate-active="true"/g);
  if(paid!==page.paid)fail(`${page.path}: expected ${page.paid} paid links, found ${paid}`);
  if(paid){
    if(count(html,/tag=mradventuredad-20/g)!==paid)fail(`${page.path}: Amazon tag mismatch`);
    if(count(html,/rel="sponsored nofollow noopener noreferrer"/g)!==paid)fail(`${page.path}: paid-link rel mismatch`);
    if(!html.includes('As an Amazon Associate I earn from qualifying purchases'))fail(`${page.path}: disclosure missing`);
    for(const label of ["Kids’ wool-blend hiking socks","Kids’ synthetic hiking socks","Lightweight kids’ hiking socks"])if(!html.includes(label))fail(`${page.path}: missing precise commercial category ${label}`);
  }
  if(count(sitemap,new RegExp(canonical.replace(/[.*+?^${}()|[\]\\]/g,"\\$&"),"g"))!==1)fail(`${page.path}: sitemap entry must appear once`);
  if(titles.has(page.title))fail(`${page.path}: duplicate batch title`);else titles.add(page.title);
}

for(const [key,note] of [
  ["assets/images/photos/baltimore-woods-family-plan.webp","not depict Baltimore Woods"],
  ["assets/images/photos/kids-hiking-sock-categories.webp","No product, fiber content or performance was tested"],
  ["assets/images/photos/family-medicine-away-plan.webp","No child-resistance, storage, temperature or dosing claim"]
]){
  if(!credits[key])fail(`image credit missing: ${key}`);
  else if(!credits[key].notes.includes(note))fail(`image credit scope mismatch: ${key}`);
}

for(const [hub,targets] of Object.entries({
  "index.html":pages.map(page=>page.path),
  "adventures.html":pages.map(page=>page.path),
  "destinations.html":[pages[0].path],
  "outdoors.html":[pages[0].path,pages[1].path],
  "gear.html":[pages[1].path]
}))for(const target of targets)if(!read(hub).includes(`href="${target}"`))fail(`${hub}: missing ${target}`);

for(const [path,target] of Object.entries({
  "guides/clark-reservation-state-park-with-kids.html":"baltimore-woods-with-kids.html",
  "guides/beaver-lake-nature-center-with-kids.html":"baltimore-woods-with-kids.html",
  "guides/kids-first-hike-guide.html":"baltimore-woods-with-kids.html",
  "guides/kids-hiking-footwear-trail-runner-shoe-boot.html":"kids-hiking-socks-wool-synthetic-cotton-guide.html",
  "guides/family-hiking-daypack-guide.html":"kids-hiking-socks-wool-synthetic-cotton-guide.html",
  "guides/family-tick-check-removal-plan.html":"kids-hiking-socks-wool-synthetic-cotton-guide.html",
  "guides/family-first-aid-kit-guide.html":"family-medicine-away-from-home-plan.html",
  "guides/family-food-allergy-day-trip-plan.html":"family-medicine-away-from-home-plan.html",
  "guides/family-hotel-room-system.html":"family-medicine-away-from-home-plan.html"
}))if(!read(path).includes(`href="${target}"`))fail(`${path}: missing related ${target}`);

if(!read("index.html").includes("FRESH IDEAS · SEPTEMBER 29, 2026"))fail("homepage current-date lead missing");
for(const id of ["baltimore-route-matrix","sock-decision-matrix","medicine-transfer-matrix"])if(!pages.some(page=>read(page.path).includes(`id="${id}"`)))fail(`authority matrix missing: ${id}`);

const allHtml=[];
const walk=directory=>{for(const entry of readdirSync(directory,{withFileTypes:true})){if(entry.name===".git")continue;const path=resolve(directory,entry.name);if(entry.isDirectory())walk(path);else if(entry.name.endsWith(".html"))allHtml.push(readFileSync(path,"utf8"));}};
walk(root);
const sitewidePaid=allHtml.reduce((total,html)=>total+count(html,/data-affiliate-active="true"/g),0);
if(sitewidePaid!==157)fail(`expected 157 active affiliate links sitewide, found ${sitewidePaid}`);
const placements=pages.reduce((total,page)=>total+allHtml.filter(html=>html.includes(page.image)).length,0);
if(placements!==13)fail(`expected 13 new editorial image placements, found ${placements}`);

if(failures.length){console.error(failures.map(message=>`FAIL ${message}`).join("\n"));process.exit(1);}
console.log("PASS daily 2026-09-29: 3 substantial pages, 3 verified editorial heroes across 13 placements, 0 product images, 3 new disclosed Amazon links, 157 active affiliate links sitewide, 3 authority matrices, 9 reciprocal links and current homepage lead verified.");
