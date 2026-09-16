import { existsSync, readFileSync, readdirSync } from "node:fs";
import { resolve } from "node:path";

const root = resolve(process.argv[2] || ".");
const failures = [];
const fail = message => failures.push(message);
const read = path => readFileSync(resolve(root, path), "utf8");
const count = (text, pattern) => (text.match(pattern) || []).length;
const strip = html => html.replace(/<script[\s\S]*?<\/script>/gi, " ").replace(/<style[\s\S]*?<\/style>/gi, " ").replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
const pages = [
  {path:"guides/womens-rights-national-historical-park-with-kids.html",title:"Women’s Rights National Historical Park With Kids: The Chapel-First Seneca Falls Day",photo:"womens-rights-history-day.webp",paid:0,modified:"2026-09-16",sources:["nps.gov/wori/planyourvisit/hours","nps.gov/wori/planyourvisit/conditions","nps.gov/wori/planyourvisit/accessibility","nps.gov/wori/planyourvisit/pets","nps.gov/wori/planyourvisit/fees","nps.gov/wori/faqs","nps.gov/wori/planyourvisit/maps"]},
  {path:"guides/family-car-jump-starter-lithium-jump-box-cables-guide.html",title:"Family Car Jump Starters: Lithium Pack vs Jump Box vs Cables—and the Manual-First Rule",photo:"family-jump-starter-options.webp",paid:3,sources:["ul.com/services/portable-power-pack-testing","nhtsa.gov/recalls","cpsc.gov/Recalls","no.co/support/how-to-jump-start-using-gb40","assets.sia.toyota.com"]},
  {path:"guides/family-hotel-fire-escape-plan.html",title:"The Family Hotel Fire-Escape Plan: Two Exits, Shoes, Keys, Go",photo:"family-hotel-fire-escape-plan.webp",paid:0,sources:["usfa.fema.gov/prevention/hotel-fires","usfa.fema.gov/gallery/pictographs/hotels","usfa.fema.gov/prevention/home-fires/prepare-for-fire/home-fire-escape-plans","usfa.fema.gov/blog/protecting-people-who-live-or-work-in-high-rises","ready.gov/home-fires","redcross.org/get-help/how-to-prepare-for-emergencies/types-of-emergencies/fire/if-a-fire-starts"]}
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
  if (!html.includes('datePublished":"2026-09-15"') || !html.includes(`dateModified":"${page.modified || "2026-09-15"}"`)) fail(`${page.path}: structured dates missing`);
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
  if (words < 1100) fail(`${page.path}: insufficient substantial copy (${words} words)`);
  for (const source of page.sources) if (!html.toLowerCase().includes(source.toLowerCase())) fail(`${page.path}: missing authoritative source ${source}`);
  const paid = count(html, /data-affiliate-active="true"/g);
  if (paid !== page.paid) fail(`${page.path}: expected ${page.paid} paid links, found ${paid}`);
  if (paid) {
    if (count(html, /tag=mradventuredad-20/g) !== paid) fail(`${page.path}: Amazon tag mismatch`);
    if (count(html, /rel="sponsored nofollow noopener noreferrer"/g) !== paid) fail(`${page.path}: paid-link rel mismatch`);
    if (!html.includes('As an Amazon Associate I earn from qualifying purchases')) fail(`${page.path}: disclosure missing`);
    for (const label of ["Lithium vehicle jump starters", "Larger portable jump boxes", "Heavy-duty jumper cables"]) if (!html.includes(label)) fail(`${page.path}: missing precise commercial category ${label}`);
  }
  if (count(sitemap, new RegExp(canonical.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "g")) !== 1) fail(`${page.path}: sitemap entry must appear once`);
  if (titles.has(page.title)) fail(`${page.path}: duplicate batch title`); else titles.add(page.title);
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
  "guides/harriet-tubman-national-historical-park-with-kids.html":"womens-rights-national-historical-park-with-kids.html",
  "guides/taughannock-falls-with-kids.html":"womens-rights-national-historical-park-with-kids.html",
  "guides/fort-stanwix-with-kids.html":"womens-rights-national-historical-park-with-kids.html",
  "guides/family-roadside-breakdown-plan.html":"family-car-jump-starter-lithium-jump-box-cables-guide.html",
  "guides/family-hotel-room-system.html":"family-hotel-fire-escape-plan.html"
})) if (!read(path).includes(`href="${target}"`)) fail(`${path}: missing related ${target}`);

const women = read("guides/womens-rights-national-historical-park-with-kids.html");
if (!women.includes('class="authority-matrix"') || count(women, /class="authority-matrix-grid"[\s\S]*?<article>/g) !== 1 || count(women.match(/class="authority-matrix-grid"[\s\S]*?<\/div>/)?.[0] || "", /<article>/g) !== 4) fail("Women’s Rights guide: four-site authority matrix missing");
if (!women.includes('href="taughannock-falls-with-kids.html"')) fail("Women’s Rights guide: Taughannock cluster link missing");

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
if (sitewidePaid !== 148) fail(`expected 148 active affiliate links sitewide, found ${sitewidePaid}`);
const placements = pages.reduce((total, page) => total + allHtml.filter(html => html.includes(page.photo)).length, 0);
if (placements !== 13) fail(`expected 13 new editorial image placements, found ${placements}`);

if (failures.length) { console.error(failures.map(message => `FAIL ${message}`).join("\n")); process.exit(1); }
console.log("PASS daily 2026-09-15: 3 substantial pages, 3 verified photographic heroes across 13 placements, 0 product images, 3 new disclosed Amazon links, 148 active affiliate links sitewide, authoritative sources, discovery and related links verified.");
