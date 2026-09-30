import { existsSync, readFileSync, readdirSync } from "node:fs";
import { resolve } from "node:path";

const root = resolve(process.argv[2] || ".");
const failures = [];
const fail = message => failures.push(message);
const read = path => readFileSync(resolve(root, path), "utf8");
const count = (text, pattern) => (text.match(pattern) || []).length;
const strip = html => html.replace(/<script[\s\S]*?<\/script>/gi," ").replace(/<style[\s\S]*?<\/style>/gi," ").replace(/<[^>]+>/g," ").replace(/\s+/g," ").trim();
const pages = [
  {path:"guides/after-school-nature-walk-30-minute-plan.html",title:"The 30-Minute After-School Nature Mission: One Loop, Three Clues, Home Before Dark",image:"after-school-nature-mission.webp",paid:0,sources:["cdc.gov/physical-activity-education/guidelines","nhtsa.gov/road-safety/pedestrian-safety","gml.noaa.gov/grad/solcalc"]},
  {path:"guides/family-library-night-45-minute-plan.html",title:"The 45-Minute Family Library Night: One Mission, One Bag, Leave on Time",image:"family-library-night.webp",paid:0,sources:["onlib.org/locations","onlib.org/find/using-library/using-your-library-card","onlib.org/learn/youth-resources"]},
  {path:"guides/family-charging-station-multiport-power-strip-dock-guide.html",title:"Family Charging Stations: Multiport Charger vs Power Strip vs Dock—and the Compatibility Card",image:"family-charging-station-categories.webp",paid:3,sources:["usb.org/usb-charger-pd","cpsc.gov/safety-education/safety-guides/electronics-and-electrical/electrical-safety","ul.com/services/power-strips-testing-and-certification"]}
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
  if (!html.includes('datePublished":"2026-09-30"') || !html.includes('dateModified":"2026-09-30"')) fail(`${page.path}: structured dates missing`);
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
    for(const label of ["Multiport USB-C chargers","Listed power strips","Passive device-charging organizers"])if(!html.includes(label))fail(`${page.path}: missing precise commercial category ${label}`);
  }
  if(count(sitemap,new RegExp(canonical.replace(/[.*+?^${}()|[\]\\]/g,"\\$&"),"g"))!==1)fail(`${page.path}: sitemap entry must appear once`);
  if(titles.has(page.title))fail(`${page.path}: duplicate batch title`);else titles.add(page.title);
}

for(const [key,note] of [
  ["assets/images/photos/after-school-nature-mission.webp","does not depict a named park"],
  ["assets/images/photos/family-library-night.webp","does not depict or promise"],
  ["assets/images/photos/family-charging-station-categories.webp","not a product image, certification claim"]
]){
  if(!credits[key])fail(`image credit missing: ${key}`);
  else if(!credits[key].notes.includes(note))fail(`image credit scope mismatch: ${key}`);
}

for(const [hub,targets] of Object.entries({
  "index.html":pages.map(page=>page.path),
  "adventures.html":pages.map(page=>page.path),
  "outdoors.html":[pages[0].path],
  "gear.html":[pages[2].path]
}))for(const target of targets)if(!read(hub).includes(`href="${target}"`))fail(`${hub}: missing ${target}`);

for(const [path,target] of Object.entries({
  "guides/clark-reservation-state-park-with-kids.html":"after-school-nature-walk-30-minute-plan.html",
  "guides/taughannock-falls-with-kids.html":"after-school-nature-walk-30-minute-plan.html",
  "guides/baltimore-woods-with-kids.html":"after-school-nature-walk-30-minute-plan.html",
  "guides/family-museum-day-system.html":"family-library-night-45-minute-plan.html",
  "guides/most-syracuse-with-kids.html":"family-library-night-45-minute-plan.html",
  "guides/family-day-trip-system.html":"family-library-night-45-minute-plan.html",
  "guides/family-power-banks-car-chargers.html":"family-charging-station-multiport-power-strip-dock-guide.html",
  "guides/family-location-trackers-bluetooth-gps-watch-phone.html":"family-charging-station-multiport-power-strip-dock-guide.html",
  "guides/family-hotel-room-system.html":"family-charging-station-multiport-power-strip-dock-guide.html"
}))if(!read(path).includes(`href="${target}"`))fail(`${path}: missing related ${target}`);

if(!read("index.html").includes("FRESH IDEAS · SEPTEMBER 30, 2026"))fail("homepage current-date lead missing");
if(!read("index.html").includes("weekend-october-3-4-2026.html"))fail("homepage current weekend roundup missing");
for(const id of ["nature-mission-card","library-mission-card","charging-compatibility-card"])if(!pages.some(page=>read(page.path).includes(`id="${id}"`)))fail(`authority matrix missing: ${id}`);

const allHtml=[];
const walk=directory=>{for(const entry of readdirSync(directory,{withFileTypes:true})){if(entry.name===".git")continue;const path=resolve(directory,entry.name);if(entry.isDirectory())walk(path);else if(entry.name.endsWith(".html"))allHtml.push(readFileSync(path,"utf8"));}};
walk(root);
const sitewidePaid=allHtml.reduce((total,html)=>total+count(html,/data-affiliate-active="true"/g),0);
if(sitewidePaid!==160)fail(`expected 160 active affiliate links sitewide, found ${sitewidePaid}`);
const placements=pages.reduce((total,page)=>total+allHtml.filter(html=>html.includes(page.image)).length,0);
if(placements!==11)fail(`expected 11 new editorial image placements, found ${placements}`);

if(failures.length){console.error(failures.map(message=>`FAIL ${message}`).join("\n"));process.exit(1);}
console.log("PASS daily 2026-09-30: 3 substantial pages, 3 verified editorial heroes across 11 placements, 0 product images, 3 new disclosed Amazon links, 160 active affiliate links sitewide, 3 authority matrices, 9 reciprocal links, protected weekend roundup and current homepage lead verified.");
