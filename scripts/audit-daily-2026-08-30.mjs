import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";

const root = resolve(process.argv[2] || ".");
const failures = [];
const fail = message => failures.push(message);
const read = path => readFileSync(resolve(root, path), "utf8");
const count = (text, re) => (text.match(re) || []).length;
const strip = html => html.replace(/<script[\s\S]*?<\/script>/gi, " ").replace(/<style[\s\S]*?<\/style>/gi, " ").replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();

const pages = [
  {
    path: "guides/fort-ontario-with-kids.html",
    title: "Fort Ontario With Kids: The Short History Day That Leaves Room for the Lake",
    canonical: "https://mradventuredad.com/guides/fort-ontario-with-kids.html",
    photo: "fort-ontario.webp",
    plan: "fort-ontario-family-plan.svg",
    paid: 0,
  },
  {
    path: "guides/family-power-banks-car-chargers.html",
    title: "Family Power Banks: 5,000 vs 10,000 vs 20,000 mAh—and the Car-Charger Option",
    canonical: "https://mradventuredad.com/guides/family-power-banks-car-chargers.html",
    photo: "family-power-bank.webp",
    plan: "family-power-plan.svg",
    paid: 3,
  },
  {
    path: "guides/family-hotel-room-system.html",
    title: "The Family Hotel Room System: Sleep, Gear, and a Fast Morning Exit",
    canonical: "https://mradventuredad.com/guides/family-hotel-room-system.html",
    photo: "family-hotel-room.webp",
    plan: "family-hotel-room-system.svg",
    paid: 0,
  },
];

const credits = JSON.parse(read("assets/images/credits.json"));
const sitemap = read("sitemap.xml");

for (const page of pages) {
  if (!existsSync(resolve(root, page.path))) { fail(`${page.path}: missing`); continue; }
  const html = read(page.path);
  if (!html.includes(`<h1>${page.title}</h1>`)) fail(`${page.path}: title mismatch`);
  if (!html.includes(`rel="canonical" href="${page.canonical}"`)) fail(`${page.path}: canonical mismatch`);
  if (!html.includes('datePublished":"2026-08-30"') || !html.includes('dateModified":"2026-08-30"')) fail(`${page.path}: structured dates missing`);
  if (!/<meta property="og:title"/.test(html) || !/<meta name="twitter:card"/.test(html)) fail(`${page.path}: social metadata missing`);
  if (!html.includes('application/ld+json') || !html.includes('"Article"')) fail(`${page.path}: Article schema missing`);
  if (!html.includes('class="article-hero"') || !html.includes(`/photos/${page.photo}`)) fail(`${page.path}: verified photo missing`);
  if (!html.includes('class="article-plan"') || !html.includes(`/${page.plan}`)) fail(`${page.path}: verified planning visual missing`);
  if (!html.includes('alt="') || count(html, /<img\b/gi) !== count(html, /<img\b[^>]*\balt="[^"]+"/gi)) fail(`${page.path}: image alt text failure`);
  if (!credits[`assets/images/photos/${page.photo}`] || !credits[`assets/images/${page.plan}`]) fail(`${page.path}: image credit record missing`);
  if (!html.includes('data-cf-beacon=') || !html.includes('data-site="mr-adventure-dad"')) fail(`${page.path}: analytics or visitor beacon missing`);
  const internal = [...html.matchAll(/<a\b[^>]*href="([^"#]+\.html(?:#[^"]*)?)"/gi)].map(match => match[1]);
  if (new Set(internal).size < 3) fail(`${page.path}: fewer than three internal-link targets`);
  if (strip(html).split(/\s+/).length < 950) fail(`${page.path}: insufficient substantial copy`);
  const paid = count(html, /data-affiliate-active="true"/g);
  if (paid !== page.paid) fail(`${page.path}: expected ${page.paid} paid links, found ${paid}`);
  if (paid) {
    if (count(html, /tag=mradventuredad-20/g) !== paid) fail(`${page.path}: Amazon tag mismatch`);
    if (count(html, /rel="sponsored nofollow noopener noreferrer"/g) !== paid) fail(`${page.path}: paid-link rel mismatch`);
    if (!html.includes('As an Amazon Associate I earn from qualifying purchases')) fail(`${page.path}: disclosure missing`);
  }
  if (count(sitemap, new RegExp(page.canonical.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "g")) !== 1) fail(`${page.path}: sitemap entry must appear once`);
}

for (const [hub, paths] of Object.entries({
  "index.html": pages.map(page => page.path),
  "adventures.html": pages.map(page => page.path),
  "destinations.html": [pages[0].path],
  "gear.html": [pages[1].path, pages[2].path],
})) {
  const html = read(hub);
  for (const path of paths) if (!html.includes(`href="${path}"`)) fail(`${hub}: missing discovery link to ${path}`);
}

for (const [page, targets] of Object.entries({
  "weekend-getaways-september-4-6-2026.html": [pages[2].path],
  "guides/road-trip-packing-system.html": ["family-power-banks-car-chargers.html", "family-hotel-room-system.html"],
  "guides/syracuse-family-day-trip-guide.html": ["fort-ontario-with-kids.html"],
  "guides/winter-car-adventure-kit.html": ["family-power-banks-car-chargers.html"],
})) {
  const html = read(page);
  for (const target of targets) if (!html.includes(`href="${target}"`)) fail(`${page}: missing related link ${target}`);
}

const allTitles = [...read("sitemap.xml").matchAll(/<loc>(.*?)<\/loc>/g)].map(match => match[1]);
if (new Set(allTitles).size !== allTitles.length) fail("sitemap contains duplicate URLs");

if (failures.length) {
  console.error(failures.map(item => `FAIL ${item}`).join("\n"));
  process.exit(1);
}

console.log("PASS daily 2026-08-30: 3 substantial pages, 6 credited editorial visuals, 3 disclosed Amazon links, discovery and related links verified.");
