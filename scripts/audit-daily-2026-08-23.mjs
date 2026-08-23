import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { dirname, relative, resolve } from "node:path";

const root = resolve(process.argv[2] || ".");
const targets = [
  "guides/green-lakes-state-park-with-kids.html",
  "guides/family-hiking-daypack-guide.html",
];
const failures = [];
const htmlFiles = [];
const fail = (message) => failures.push(message);
const count = (text, pattern) => (text.match(pattern) || []).length;

function walk(dir) {
  for (const name of readdirSync(dir)) {
    if ([".git", "node_modules", ".wrangler"].includes(name)) continue;
    const path = resolve(dir, name);
    if (statSync(path).isDirectory()) walk(path);
    else if (name.endsWith(".html")) htmlFiles.push(path);
  }
}

walk(root);
const titles = new Map();
const canonicals = new Map();
for (const file of htmlFiles) {
  const rel = relative(root, file).replaceAll("\\", "/");
  const html = readFileSync(file, "utf8");
  const title = /<title>([^<]+)<\/title>/i.exec(html)?.[1]?.trim();
  const canonical = /<link rel="canonical" href="([^"]+)"/i.exec(html)?.[1];
  if (title) titles.set(title, [...(titles.get(title) || []), rel]);
  if (canonical) canonicals.set(canonical, [...(canonicals.get(canonical) || []), rel]);
  for (const match of html.matchAll(/<img\b[^>]*\bsrc="([^"]+)"[^>]*>/gi)) {
    const tag = match[0];
    const src = match[1];
    if (!/\balt="[^"]+"/i.test(tag)) fail(`${rel}: image missing useful alt text (${src})`);
    if (!/^(https?:|data:|\/)/.test(src) && !existsSync(resolve(dirname(file), src))) fail(`${rel}: missing image ${src}`);
  }
}
for (const [title, files] of titles) if (files.length > 1) fail(`duplicate title: ${title} (${files.join(", ")})`);
for (const [url, files] of canonicals) if (files.length > 1) fail(`duplicate canonical: ${url}`);

for (const rel of targets) {
  const path = resolve(root, rel);
  if (!existsSync(path)) { fail(`${rel}: missing`); continue; }
  const html = readFileSync(path, "utf8");
  for (const required of ["<meta name=\"description\"", "<link rel=\"canonical\"", "property=\"og:title\"", "property=\"og:image\"", "name=\"twitter:card\"", "application/ld+json", "datePublished", "2026-08-23", "data-site=\"mr-adventure-dad\""]) if (!html.includes(required)) fail(`${rel}: missing ${required}`);
  if (count(html, /<h1\b/gi) !== 1) fail(`${rel}: must have exactly one h1`);
  if (count(html, /<h2\b/gi) < 8) fail(`${rel}: too little section structure`);
  if (html.replace(/<[^>]+>/g, " ").trim().split(/\s+/).length < 1_300) fail(`${rel}: fewer than 1,300 words`);
  const internal = new Set([...html.matchAll(/href="([^"#]+\.html)"/gi)].map((m) => m[1]).filter((href) => !href.startsWith("http")));
  if (internal.size < 3) fail(`${rel}: fewer than 3 meaningful internal links`);
  for (const href of internal) if (!existsSync(resolve(dirname(path), href))) fail(`${rel}: broken internal link ${href}`);
  try {
    const schema = JSON.parse(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/i.exec(html)?.[1] || "");
    if (schema.mainEntityOfPage !== /<link rel="canonical" href="([^"]+)"/i.exec(html)?.[1]) fail(`${rel}: schema/canonical mismatch`);
  } catch { fail(`${rel}: invalid JSON-LD`); }
}

const destination = readFileSync(resolve(root, targets[0]), "utf8");
const pack = readFileSync(resolve(root, targets[1]), "utf8");
if (count(destination, /data-affiliate-active="true"/g) !== 0) fail("Green Lakes guide must not contain paid links");
if (count(pack, /data-affiliate-active="true"/g) !== 3) fail("daypack guide must contain exactly 3 contextual paid links");
if (count(pack, /As an Amazon Associate I earn from qualifying purchases/g) !== 1) fail("daypack guide affiliate disclosure missing or duplicated");
for (const tag of pack.matchAll(/<a\b[^>]*data-affiliate-active="true"[^>]*>/gi)) {
  if (!/tag=mradventuredad-20/.test(tag[0])) fail("affiliate link missing approved tag");
  if (!/target="_blank"/.test(tag[0])) fail("affiliate link missing safe target");
  for (const rel of ["sponsored", "nofollow", "noopener", "noreferrer"]) if (!new RegExp(`rel="[^"]*${rel}`).test(tag[0])) fail(`affiliate link missing ${rel}`);
}
for (const phrase of ["Green Lakes State Park", "current beach-status guidance", "official trail map", "Who should skip this version"]) if (!destination.includes(phrase)) fail(`destination guide missing ${phrase}`);
for (const phrase of ["National Park Service", "New York State DEC", "Who should skip buying", "What not to buy"]) if (!pack.includes(phrase)) fail(`daypack guide missing ${phrase}`);

for (const image of ["assets/images/green-lakes-family-day-plan.svg", "assets/images/family-hiking-daypack-loadouts.svg"]) {
  const path = resolve(root, image);
  if (!existsSync(path)) { fail(`${image}: missing`); continue; }
  const svg = readFileSync(path, "utf8");
  if (!/<title\b/.test(svg) || !/<desc\b/.test(svg) || !/viewBox="0 0 1600 900"/.test(svg)) fail(`${image}: missing SVG accessibility metadata or expected canvas`);
}

const sitemap = readFileSync(resolve(root, "sitemap.xml"), "utf8");
for (const rel of targets) if (count(sitemap, new RegExp(`https://mradventuredad\\.com/${rel}`, "g")) !== 1) fail(`sitemap missing or duplicates ${rel}`);
for (const surface of ["index.html", "adventures.html", "destinations.html", "outdoors.html", "gear.html"]) {
  const html = readFileSync(resolve(root, surface), "utf8");
  if (!html.includes("DAILY 2026-08-23")) fail(`${surface}: discovery module missing`);
}
for (const surface of ["index.html", "destinations.html", "outdoors.html"]) {
  const html = readFileSync(resolve(root, surface), "utf8");
  if (!/green-lakes-family-day-plan\.svg[^>]*object-fit:contain/.test(html)) fail(`${surface}: Green Lakes card can crop the planning diagram`);
}
for (const surface of ["index.html", "outdoors.html", "gear.html"]) {
  const html = readFileSync(resolve(root, surface), "utf8");
  if (!/family-hiking-daypack-loadouts\.svg[^>]*object-fit:contain/.test(html)) fail(`${surface}: daypack card can crop the loadout diagram`);
}
for (const rel of ["guides/family-day-trip-system.html", "guides/chimney-bluffs-with-kids.html"]) {
  if (!readFileSync(resolve(root, rel), "utf8").includes("DAILY 2026-08-23")) fail(`${rel}: related-guide module missing`);
}

if (failures.length) {
  console.error(failures.map((failure) => `FAIL: ${failure}`).join("\n"));
  process.exit(1);
}
console.log(`Daily publication audit passed: ${htmlFiles.length} HTML pages; 2 substantial guides; unique titles/canonicals; metadata, schema, local links, SVG accessibility, discovery, sitemap and 3 disclosed earning links verified.`);
