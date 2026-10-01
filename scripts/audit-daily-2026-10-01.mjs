import { existsSync, readFileSync, readdirSync } from "node:fs";
import { resolve } from "node:path";

const root = resolve(process.argv[2] || ".");
const failures = [];
const fail = message => failures.push(message);
const read = path => readFileSync(resolve(root, path), "utf8");
const count = (text, pattern) => (text.match(pattern) || []).length;
const strip = html => html.replace(/<script[\s\S]*?<\/script>/gi," ").replace(/<style[\s\S]*?<\/style>/gi," ").replace(/<[^>]+>/g," ").replace(/\s+/g," ").trim();
const pages = [
  {path:"guides/iroquois-museum-with-kids.html",title:"Iroquois Museum With Kids: Art First, Nature Trail Second",image:"iroquois-museum-family-plan.webp",paid:0,sources:["iroquoismuseum.org/visit","iroquoismuseum.org/current-exhibition","iroquoismuseum.org/nature-park"]},
  {path:"guides/family-calendar-reset-20-minute-plan.html",title:"The 20-Minute Family Calendar Reset: Tonight, Weekend, Break, Home",image:"family-calendar-reset.webp",paid:0,sources:["healthychildren.org/English/family-life/family-dynamics/Pages/The-Importance-of-Family-Routines.aspx","consumer.gov/your-money/making-budget"]},
  {path:"guides/kids-camera-simple-digital-instant-rugged-guide.html",title:"Cameras for Kids: Simple Digital vs Instant Print vs Rugged—and the Privacy Check",image:"kids-camera-categories.webp",paid:3,sources:["consumer.ftc.gov/articles/protecting-your-childs-privacy-online","cpsc.gov/Recalls","tsa.gov/travel/security-screening"]}
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
  if (!html.includes('datePublished":"2026-10-01"') || !html.includes('dateModified":"2026-10-01"')) fail(`${page.path}: structured dates missing`);
  if (!/<meta property="og:title"/.test(html) || !/<meta name="twitter:card"/.test(html)) fail(`${page.path}: social metadata missing`);
  if (!html.includes('application/ld+json') || !html.includes('"Article"') || !html.includes('"Guide"')) fail(`${page.path}: Article/Guide schema missing`);
  if (count(html,/class="article-hero"/g)!==1 || !html.includes(page.image)) fail(`${page.path}: verified hero missing`);
  if (/<svg\b|<canvas\b|class="article-plan"/i.test(html)) fail(`${page.path}: unexpected diagram used`);
  if (count(html,/<img\b/gi)!==count(html,/<img\b[^>]*\balt="[^"]+"/gi)) fail(`${page.path}: image alt text failure`);
  if (!html.includes('data-cf-beacon=') || !html.includes('data-site="mr-adventure-dad"')) fail(`${page.path}: analytics or visitor beacon missing`);
  const internal=[...html.matchAll(/<a\b[^>]*href="([^"#]+\.html(?:#[^"]*)?)"/gi)].map(match=>match[1]);
  if(new Set(internal).size<3)fail(`${page.path}: fewer than three internal targets`);
  const words=strip(html).split(/\s+/).length;
  if(words<1100)fail(`${page.path}: insufficient substantial copy (${words} words)`);
  for(const source of page.sources)if(!html.toLowerCase().includes(source.toLowerCase()))fail(`${page.path}: missing source ${source}`);
  const paid=count(html,/data-affiliate-active="true"/g);
  if(paid!==page.paid)fail(`${page.path}: expected ${page.paid} paid links, found ${paid}`);
  if(paid){
    if(count(html,/tag=mradventuredad-20/g)!==paid)fail(`${page.path}: Amazon tag mismatch`);
    if(count(html,/rel="sponsored nofollow noopener noreferrer"/g)!==paid)fail(`${page.path}: paid-link rel mismatch`);
    if(!html.includes('As an Amazon Associate I earn from qualifying purchases'))fail(`${page.path}: disclosure missing`);
    for(const label of ["Simple digital cameras","Instant-print cameras","Rugged compact cameras"])if(!html.includes(label))fail(`${page.path}: missing precise commercial category ${label}`);
  }
  if(count(sitemap,new RegExp(canonical.replace(/[.*+?^${}()|[\]\\]/g,"\\$&"),"g"))!==1)fail(`${page.path}: sitemap entry must appear once`);
  if(titles.has(page.title))fail(`${page.path}: duplicate batch title`);else titles.add(page.title);
}

for(const [key,note] of [
  ["assets/images/photos/iroquois-museum-family-plan.webp","does not depict the museum building"],
  ["assets/images/photos/family-calendar-reset.webp","no private family schedule"],
  ["assets/images/photos/kids-camera-categories.webp","not a product image, tested item"]
]){
  if(!credits[key])fail(`image credit missing: ${key}`);
  else if(!credits[key].notes.includes(note))fail(`image credit scope mismatch: ${key}`);
}

for(const [hub,targets] of Object.entries({
  "index.html":pages.map(page=>page.path),
  "adventures.html":pages.map(page=>page.path),
  "destinations.html":[pages[0].path],
  "gear.html":[pages[2].path]
}))for(const target of targets)if(!read(hub).includes(`href="${target}"`))fail(`${hub}: missing ${target}`);

for(const [path,target] of Object.entries({
  "guides/howe-caverns-with-kids.html":"iroquois-museum-with-kids.html",
  "guides/family-museum-day-system.html":"iroquois-museum-with-kids.html",
  "guides/family-day-trip-system.html":"iroquois-museum-with-kids.html",
  "guides/after-school-nature-walk-30-minute-plan.html":"family-calendar-reset-20-minute-plan.html",
  "guides/family-library-night-45-minute-plan.html":"family-calendar-reset-20-minute-plan.html",
  "guides/family-outdoor-weather-cutoff-plan.html":"family-calendar-reset-20-minute-plan.html",
  "guides/family-travel-games-guide.html":"kids-camera-simple-digital-instant-rugged-guide.html",
  "guides/family-charging-station-multiport-power-strip-dock-guide.html":"kids-camera-simple-digital-instant-rugged-guide.html",
  "guides/family-location-trackers-bluetooth-gps-watch-phone.html":"kids-camera-simple-digital-instant-rugged-guide.html"
}))if(!read(path).includes(`href="${target}"`))fail(`${path}: missing related ${target}`);

if(!read("index.html").includes("FRESH IDEAS · OCTOBER 1, 2026"))fail("homepage current-date lead missing");
if(!read("index.html").includes("weekend-october-3-4-2026.html"))fail("homepage current weekend roundup missing");
for(const id of ["iroquois-visit-card","calendar-four-horizon","camera-category-card"])if(!pages.some(page=>read(page.path).includes(`id="${id}"`)))fail(`authority matrix missing: ${id}`);

const allHtml=[];
const walk=directory=>{for(const entry of readdirSync(directory,{withFileTypes:true})){if(entry.name===".git")continue;const path=resolve(directory,entry.name);if(entry.isDirectory())walk(path);else if(entry.name.endsWith(".html"))allHtml.push(readFileSync(path,"utf8"));}};
walk(root);
const sitewidePaid=allHtml.reduce((total,html)=>total+count(html,/data-affiliate-active="true"/g),0);
if(sitewidePaid!==163)fail(`expected 163 active affiliate links sitewide, found ${sitewidePaid}`);
const placements=pages.reduce((total,page)=>total+allHtml.filter(html=>html.includes(page.image)).length,0);
if(placements!==11)fail(`expected 11 new editorial image placements, found ${placements}`);

if(failures.length){console.error(failures.map(message=>`FAIL ${message}`).join("\n"));process.exit(1);}
console.log("PASS daily 2026-10-01: 3 substantial pages, 3 verified editorial heroes across 11 placements, 0 product images, 3 new disclosed Amazon links, 163 active affiliate links sitewide, 3 authority matrices, 9 reciprocal links, protected weekend roundup and current homepage lead verified.");
