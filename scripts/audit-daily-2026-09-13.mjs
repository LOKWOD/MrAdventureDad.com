import { existsSync, readFileSync, readdirSync } from "node:fs";
import { resolve } from "node:path";

const root = resolve(process.argv[2] || ".");
const failures = [];
const fail = message => failures.push(message);
const read = path => readFileSync(resolve(root, path), "utf8");
const count = (text, pattern) => (text.match(pattern) || []).length;
const strip = html => html.replace(/<script[\s\S]*?<\/script>/gi, " ").replace(/<style[\s\S]*?<\/style>/gi, " ").replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
const pages = [
  {path:"guides/erie-canal-museum-with-kids.html",title:"Erie Canal Museum With Kids: The 90-Minute Syracuse History Day",photo:"erie-canal-museum-syracuse.webp",paid:0,sources:["eriecanalmuseum.org/visit","eriecanalmuseum.org/parking","eriecanalmuseum.org/accessibility","eriecanalmuseum.org/exhibits","forecast.weather.gov/MapClick"]},
  {path:"guides/kids-trekking-poles-adjustable-fixed-folding-guide.html",title:"Kids’ Trekking Poles: Adjustable vs Fixed vs Folding—and When to Skip Them",photo:"kids-trekking-poles.webp",paid:3,sources:["blackdiamondequipment.com/pages/product-instructions","leki.com/us/en/Service/FAQ","nps.gov/articles/hiking-safety","cpsc.gov/Recalls"]},
  {path:"guides/family-roadside-breakdown-plan.html",title:"The Family Roadside-Breakdown Plan: Get Clear, Stay Buckled, Call for Help",photo:"family-roadside-breakdown.webp",paid:0,sources:["thruway.ny.gov/travelers/safety/emergency","thruway.ny.gov/travelers/map","ops.fhwa.dot.gov/publications/fhwahop10014/s4","nhtsa.gov/vehicle-safety/seat-belts","511ny.org"]}
];
const credits = JSON.parse(read("assets/images/credits.json"));
const sitemap = read("sitemap.xml");
const titles = new Map();
for (const path of ["index.html", ...Array.from({length:0})]) void path;
for (const page of pages) {
  const canonical = `https://mradventuredad.com/${page.path}`;
  if (!existsSync(resolve(root, page.path))) { fail(`${page.path}: missing`); continue; }
  const html = read(page.path);
  if (!html.includes(`<h1>${page.title}</h1>`)) fail(`${page.path}: title mismatch`);
  if (!html.includes(`rel="canonical" href="${canonical}"`)) fail(`${page.path}: canonical mismatch`);
  if (!html.includes('datePublished":"2026-09-13"') || !html.includes('dateModified":"2026-09-13"')) fail(`${page.path}: structured dates missing`);
  if (!/<meta property="og:title"/.test(html) || !/<meta name="twitter:card"/.test(html)) fail(`${page.path}: social metadata missing`);
  if (!html.includes('application/ld+json') || !html.includes('"Article"') || !html.includes('"Guide"')) fail(`${page.path}: Article/Guide schema missing`);
  if (count(html, /class="article-hero"/g) !== 1 || !html.includes(`/photos/${page.photo}`)) fail(`${page.path}: verified photo hero missing`);
  if (/<svg\b|<canvas\b|class="article-plan"/i.test(html)) fail(`${page.path}: chart or diagram used`);
  if (count(html, /<img\b/gi) !== count(html, /<img\b[^>]*\balt="[^"]+"/gi)) fail(`${page.path}: image alt text failure`);
  if (!credits[`assets/images/photos/${page.photo}`]) fail(`${page.path}: image credit missing`);
  if (!html.includes('data-cf-beacon=') || !html.includes('data-site="mr-adventure-dad"')) fail(`${page.path}: analytics or visitor beacon missing`);
  const internal = [...html.matchAll(/<a\b[^>]*href="([^"#]+\.html(?:#[^"]*)?)"/gi)].map(match => match[1]);
  if (new Set(internal).size < 3) fail(`${page.path}: fewer than three internal targets`);
  const words = strip(html).split(/\s+/).length;
  if (words < 1050) fail(`${page.path}: insufficient substantial copy (${words} words)`);
  for (const source of page.sources) if (!html.toLowerCase().includes(source.toLowerCase())) fail(`${page.path}: missing authoritative source ${source}`);
  const paid = count(html, /data-affiliate-active="true"/g);
  if (paid !== page.paid) fail(`${page.path}: expected ${page.paid} paid links, found ${paid}`);
  if (paid) {
    if (count(html, /tag=mradventuredad-20/g) !== paid) fail(`${page.path}: Amazon tag mismatch`);
    if (count(html, /rel="sponsored nofollow noopener noreferrer"/g) !== paid) fail(`${page.path}: paid-link rel mismatch`);
    if (!html.includes('As an Amazon Associate I earn from qualifying purchases')) fail(`${page.path}: disclosure missing`);
  }
  if (count(sitemap, new RegExp(canonical.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "g")) !== 1) fail(`${page.path}: sitemap entry must appear once`);
  if (titles.has(page.title)) fail(`${page.path}: duplicate title in batch`); else titles.set(page.title, page.path);
}
for (const [hub, targets] of Object.entries({
  "index.html": pages.map(page => page.path),
  "adventures.html": pages.map(page => page.path),
  "destinations.html": [pages[0].path],
  "outdoors.html": [pages[1].path, pages[2].path],
  "gear.html": [pages[1].path]
})) {
  const html = read(hub);
  for (const target of targets) if (!html.includes(`href="${target}"`)) fail(`${hub}: missing ${target}`);
}
for (const [path, target] of Object.entries({
  "guides/most-syracuse-with-kids.html":"erie-canal-museum-with-kids.html",
  "guides/kids-hiking-footwear-trail-runner-shoe-boot.html":"kids-trekking-poles-adjustable-fixed-folding-guide.html",
  "guides/family-portable-tire-inflator-guide.html":"family-roadside-breakdown-plan.html"
})) if (!read(path).includes(`href="${target}"`)) fail(`${path}: missing related ${target}`);
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
if (sitewidePaid !== 142) fail(`expected 142 active affiliate links sitewide, found ${sitewidePaid}`);
if (failures.length) { console.error(failures.map(message => `FAIL ${message}`).join("\n")); process.exit(1); }
console.log("PASS daily 2026-09-13: 3 substantial pages, 3 verified photographic heroes, 0 charts, 3 new disclosed Amazon links, 142 active affiliate links sitewide, authoritative sources, discovery and related links verified.");
