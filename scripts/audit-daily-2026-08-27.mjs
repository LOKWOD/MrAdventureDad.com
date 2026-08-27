import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { dirname, relative, resolve } from "node:path";

const root = resolve(process.argv[2] || ".");
const failures = [];
const files = [];
const targets = ["guides/letchworth-state-park-with-kids.html", "guides/family-headlamps-flashlights-lanterns.html"];
const fail = value => failures.push(value);
const count = (text, pattern) => (text.match(pattern) || []).length;
function walk(directory) { for (const name of readdirSync(directory)) { if ([".git", "node_modules"].includes(name)) continue; const path = resolve(directory, name); if (statSync(path).isDirectory()) walk(path); else if (name.endsWith(".html")) files.push(path); } }
walk(root);

const titles = new Map();
const canonicals = new Map();
for (const file of files) {
  const rel = relative(root, file).replaceAll("\\", "/");
  const html = readFileSync(file, "utf8");
  const title = html.match(/<title>([^<]+)/i)?.[1];
  const canonical = html.match(/<link rel="canonical" href="([^"]+)/i)?.[1];
  if (title) { if (titles.has(title)) fail(`duplicate title ${title}`); titles.set(title, rel); }
  if (canonical) { if (canonicals.has(canonical)) fail(`duplicate canonical ${canonical}`); canonicals.set(canonical, rel); }
  for (const match of html.matchAll(/<img\b[^>]*src="([^"]+)"[^>]*>/gi)) {
    if (!/alt="[^"]+"/i.test(match[0])) fail(`${rel}: image alt missing`);
    if (!/^(https?:|data:|\/)/.test(match[1]) && !existsSync(resolve(dirname(file), match[1]))) fail(`${rel}: missing image ${match[1]}`);
  }
}

for (const rel of targets) {
  const file = resolve(root, rel);
  if (!existsSync(file)) { fail(`${rel}: missing`); continue; }
  const html = readFileSync(file, "utf8");
  for (const required of ['meta name="description"','link rel="canonical"','property="og:image"','name="twitter:card"','application/ld+json','2026-08-27','data-site="mr-adventure-dad"']) if (!html.includes(required)) fail(`${rel}: missing ${required}`);
  if (count(html, /<h1\b/gi) !== 1) fail(`${rel}: h1 count`);
  if (count(html, /<h2\b/gi) < 8) fail(`${rel}: thin sections`);
  if (html.replace(/<[^>]+>/g, " ").split(/\s+/).filter(Boolean).length < 1300) fail(`${rel}: under 1300 words`);
  const internal = new Set([...html.matchAll(/href="([^"#]+\.html)"/g)].map(match => match[1]).filter(url => !url.startsWith("http")));
  if (internal.size < 3) fail(`${rel}: under 3 internal links`);
  for (const url of internal) if (!existsSync(resolve(dirname(file), url))) fail(`${rel}: broken ${url}`);
  try { JSON.parse(html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)?.[1] || ""); } catch { fail(`${rel}: bad schema`); }
}

const destination = readFileSync(resolve(root, targets[0]), "utf8");
const gear = readFileSync(resolve(root, targets[1]), "utf8");
if (count(destination, /data-affiliate-active="true"/g) !== 0) fail("destination must have no paid links");
if (count(gear, /data-affiliate-active="true"/g) !== 3) fail("lighting guide must have exactly 3 paid links");
if (count(gear, /As an Amazon Associate I earn from qualifying purchases/g) !== 1) fail("affiliate disclosure count");
for (const match of gear.matchAll(/<a\b[^>]*data-affiliate-active="true"[^>]*>/gi)) for (const required of ["tag=mradventuredad-20", "sponsored", "nofollow", "noopener"]) if (!match[0].includes(required)) fail(`affiliate link missing ${required}`);
for (const required of ["Portageville entrance", "$10 per vehicle", "6 a.m.–11 p.m.", "Trail 7", "585-493-3600", "Who this plan fits"]) if (!destination.toLowerCase().includes(required.toLowerCase())) fail(`destination missing ${required}`);
for (const required of ["Rechargeable vs replaceable", "Lumens are output", "IP ratings", "no-buy option", "Who needs this"]) if (!gear.toLowerCase().includes(required.toLowerCase())) fail(`lighting guide missing ${required}`);
for (const source of ["parks.ny.gov", "weather.gov"]) if (!destination.includes(source)) fail(`destination missing official source ${source}`);
for (const source of ["nps.gov", "ready.gov", "cpsc.gov", "iec.ch"]) if (!gear.includes(source)) fail(`lighting guide missing official source ${source}`);
for (const asset of ["assets/images/letchworth-overlook-family-plan.svg", "assets/images/family-lighting-system.svg"]) { const svg = readFileSync(resolve(root, asset), "utf8"); if (!/<title\b/.test(svg) || !/<desc\b/.test(svg)) fail(`${asset}: accessibility metadata`); }
const credits = JSON.parse(readFileSync(resolve(root, "assets/images/credits.json"), "utf8"));
for (const asset of ["assets/images/letchworth-overlook-family-plan.svg", "assets/images/family-lighting-system.svg"]) for (const field of ["title", "creator", "source", "license", "created", "notes"]) if (!credits[asset]?.[field]) fail(`${asset}: missing credit ${field}`);
const sitemap = readFileSync(resolve(root, "sitemap.xml"), "utf8");
for (const rel of targets) if (count(sitemap, new RegExp(`https://mradventuredad\\.com/${rel}`, "g")) !== 1) fail(`sitemap ${rel}`);
for (const surface of ["index.html", "adventures.html", "destinations.html", "outdoors.html", "gear.html"]) if (!readFileSync(resolve(root, surface), "utf8").includes("DAILY 2026-08-27")) fail(`${surface}: discovery missing`);
for (const weekend of ["weekend-august-22-23-2026.html", "weekend-august-29-30-2026.html"]) { const html = readFileSync(resolve(root, weekend), "utf8"); for (const rel of targets) if (html.includes(rel)) fail(`${weekend}: daily page competing with roundup`); }
for (const other of files.filter(file => !targets.includes(relative(root, file).replaceAll("\\", "/")))) { const html = readFileSync(other, "utf8").toLowerCase(); if (html.includes("<h1") && (html.match(/<h1[^>]*>([^<]+)/i)?.[1] || "").toLowerCase().includes("letchworth")) fail(`existing Letchworth thesis ${relative(root, other)}`); }

if (failures.length) { console.error(failures.map(item => `FAIL ${item}`).join("\n")); process.exit(1); }
console.log(`PASS ${files.length} HTML pages; exactly 2 substantial guides; unique titles/canonicals; internal links; official sources; sitemap; discovery and 3 disclosed earning links verified.`);
