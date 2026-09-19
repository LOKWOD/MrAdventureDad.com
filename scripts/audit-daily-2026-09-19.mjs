import { existsSync, readFileSync, readdirSync } from "node:fs";
import { resolve } from "node:path";

const root = resolve(process.argv[2] || ".");
const failures = [];
const fail = message => failures.push(message);
const read = path => readFileSync(resolve(root, path), "utf8");
const count = (text, pattern) => (text.match(pattern) || []).length;
const strip = html => html.replace(/<script[\s\S]*?<\/script>/gi, " ").replace(/<style[\s\S]*?<\/style>/gi, " ").replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
const pages = [
  {path:"guides/cornell-botanic-gardens-with-kids.html",title:"Cornell Botanic Gardens With Kids: One Garden Loop, One Arboretum Stop",image:"Nevin%20Welcome%20Center%20at%20the%20Cornell%20Botanic%20Gardens.jpg",paid:0,sources:["cornellbotanicgardens.org/visit","cornellbotanicgardens.org/visit/visitor-faq","cornellbotanicgardens.org/visit/accessibility","forecast.weather.gov/MapClick"]},
  {path:"guides/family-dry-bag-roll-top-zippered-phone-pouch-guide.html",title:"Family Dry Bags: Roll-Top vs Zippered vs Phone Pouch—and the Dry-Run Rule",image:"family-dry-bag-categories.webp",paid:3,sources:["iec.ch/ip-ratings","nps.gov/subjects/watersafety","uscgboating.org/recreational-boaters/life-jacket-wear","nrs.com/learn/dry-bag-comparison"]},
  {path:"guides/family-wildlife-encounter-distance-plan.html",title:"The Family Wildlife-Encounter Plan: Stop, Group Up, Back Away",image:"family-wildlife-distance-plan.webp",paid:0,sources:["nps.gov/subjects/watchingwildlife/7ways.htm","nps.gov/subjects/watchingwildlife/gear.htm","nps.gov/subjects/bears/safety.htm","cdc.gov/rabies/prevention"]}
];
const credits = JSON.parse(read("assets/images/credits.json"));
const sitemap = read("sitemap.xml");
const titles = new Set();

for (const page of pages) {
  const canonical = `https://mradventuredad.com/${page.path}`;
  if (!existsSync(resolve(root, page.path))) { fail(`${page.path}: missing`); continue; }
  const html = read(page.path);
  if (!html.includes(`<h1>${page.title}</h1>`)) fail(`${page.path}: title mismatch`);
  if (!html.includes(`rel="canonical" href="${canonical}"`)) fail(`${page.path}: canonical mismatch`);
  if (!html.includes('datePublished":"2026-09-19"') || !html.includes('dateModified":"2026-09-19"')) fail(`${page.path}: structured dates missing`);
  if (!/<meta property="og:title"/.test(html) || !/<meta name="twitter:card"/.test(html)) fail(`${page.path}: social metadata missing`);
  if (!html.includes('application/ld+json') || !html.includes('"Article"') || !html.includes('"Guide"')) fail(`${page.path}: Article/Guide schema missing`);
  if (count(html, /class="article-hero"/g) !== 1 || !html.includes(page.image)) fail(`${page.path}: verified hero missing`);
  if (/<svg\b|<canvas\b|class="article-plan"/i.test(html)) fail(`${page.path}: chart or diagram used`);
  if (count(html, /<img\b/gi) !== count(html, /<img\b[^>]*\balt="[^"]+"/gi)) fail(`${page.path}: image alt text failure`);
  if (!html.includes('data-cf-beacon=') || !html.includes('data-site="mr-adventure-dad"')) fail(`${page.path}: analytics or visitor beacon missing`);
  const internal = [...html.matchAll(/<a\b[^>]*href="([^"#]+\.html(?:#[^"]*)?)"/gi)].map(match => match[1]);
  if (new Set(internal).size < 3) fail(`${page.path}: fewer than three internal targets`);
  const words = strip(html).split(/\s+/).length;
  if (words < 1100) fail(`${page.path}: insufficient substantial copy (${words} words)`);
  for (const source of page.sources) if (!html.toLowerCase().includes(source.toLowerCase())) fail(`${page.path}: missing source ${source}`);
  const paid = count(html, /data-affiliate-active="true"/g);
  if (paid !== page.paid) fail(`${page.path}: expected ${page.paid} paid links, found ${paid}`);
  if (paid) {
    if (count(html, /tag=mradventuredad-20/g) !== paid) fail(`${page.path}: Amazon tag mismatch`);
    if (count(html, /rel="sponsored nofollow noopener noreferrer"/g) !== paid) fail(`${page.path}: paid-link rel mismatch`);
    if (!html.includes('As an Amazon Associate I earn from qualifying purchases')) fail(`${page.path}: disclosure missing`);
    for (const label of ["Roll-top dry bags", "Zippered water-resistant gear pouches", "Waterproof phone pouches"]) if (!html.includes(label)) fail(`${page.path}: missing precise commercial category ${label}`);
  }
  if (count(sitemap, new RegExp(canonical.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "g")) !== 1) fail(`${page.path}: sitemap entry must appear once`);
  if (titles.has(page.title)) fail(`${page.path}: duplicate batch title`); else titles.add(page.title);
}

for (const [key, expected] of [
  ["https://commons.wikimedia.org/wiki/Special:Redirect/file/Nevin%20Welcome%20Center%20at%20the%20Cornell%20Botanic%20Gardens.jpg?width=1800", "Kenneth C. Zirkel"],
  ["assets/images/photos/family-dry-bag-categories.webp", "OpenAI image generation"],
  ["assets/images/photos/family-wildlife-distance-plan.webp", "OpenAI image generation"]
]) {
  if (!credits[key]) fail(`image credit missing: ${key}`);
  else if (!credits[key].creator.includes(expected)) fail(`image credit creator mismatch: ${key}`);
}

for (const [hub, targets] of Object.entries({
  "index.html": pages.map(page => page.path),
  "adventures.html": pages.map(page => page.path),
  "destinations.html": [pages[0].path],
  "outdoors.html": [pages[0].path, pages[2].path],
  "gear.html": [pages[1].path]
})) for (const target of targets) if (!read(hub).includes(`href="${target}"`)) fail(`${hub}: missing ${target}`);

for (const [path, target] of Object.entries({
  "guides/taughannock-falls-with-kids.html":"cornell-botanic-gardens-with-kids.html",
  "guides/buttermilk-falls-state-park-with-kids.html":"cornell-botanic-gardens-with-kids.html",
  "guides/finger-lakes-rainy-day-plan.html":"cornell-botanic-gardens-with-kids.html",
  "guides/family-beach-day-system.html":"family-dry-bag-roll-top-zippered-phone-pouch-guide.html",
  "guides/first-fishing-trip-with-kids.html":"family-dry-bag-roll-top-zippered-phone-pouch-guide.html",
  "guides/family-rain-gear-guide.html":"family-dry-bag-roll-top-zippered-phone-pouch-guide.html",
  "guides/montezuma-national-wildlife-refuge-with-kids.html":"family-wildlife-encounter-distance-plan.html",
  "guides/beaver-lake-nature-center-with-kids.html":"family-wildlife-encounter-distance-plan.html",
  "guides/family-binoculars-8x-vs-10x.html":"family-wildlife-encounter-distance-plan.html"
})) if (!read(path).includes(`href="${target}"`)) fail(`${path}: missing related ${target}`);

const wildlife = read(pages[2].path);
if (!wildlife.includes('id="wildlife-response-matrix"') || count(wildlife.match(/class="authority-matrix-grid"[\s\S]*?<\/div>/)?.[0] || "", /<article>/g) !== 4) fail("wildlife guide: four-scene authority matrix missing");
if (!wildlife.includes("the animal owns the space") || !wildlife.includes("species-specific instructions")) fail("wildlife guide: safety boundary missing");

const allHtml = [];
const walk = directory => {
  for (const entry of readdirSync(directory, {withFileTypes:true})) {
    if (entry.name === ".git") continue;
    const path = resolve(directory, entry.name);
    if (entry.isDirectory()) walk(path); else if (entry.name.endsWith(".html")) allHtml.push(readFileSync(path, "utf8"));
  }
};
walk(root);
const sitewidePaid = allHtml.reduce((total, html) => total + count(html, /data-affiliate-active="true"/g), 0);
if (sitewidePaid !== 154) fail(`expected 154 active affiliate links sitewide, found ${sitewidePaid}`);
const placements = pages.reduce((total, page) => total + allHtml.filter(html => html.includes(page.image)).length, 0);
if (placements !== 13) fail(`expected 13 new editorial image placements, found ${placements}`);

if (failures.length) { console.error(failures.map(message => `FAIL ${message}`).join("\n")); process.exit(1); }
console.log("PASS daily 2026-09-19: 3 substantial pages, 3 verified editorial heroes across 13 placements, 0 product images, 3 new disclosed Amazon links, 154 active affiliate links sitewide, authority matrix, authoritative sources, discovery and related links verified.");
