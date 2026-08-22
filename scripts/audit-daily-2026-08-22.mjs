import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { dirname, relative, resolve } from "node:path";

const root = resolve(process.argv[2] || ".");
const targets = [
  "guides/chimney-bluffs-with-kids.html",
  "guides/family-day-trip-cooler-guide.html",
];
const failures = [];
const htmlFiles = [];

function walk(dir) {
  for (const name of readdirSync(dir)) {
    if ([".git", "node_modules", ".wrangler"].includes(name)) continue;
    const path = resolve(dir, name);
    if (statSync(path).isDirectory()) walk(path);
    else if (name.endsWith(".html")) htmlFiles.push(path);
  }
}
function count(text, pattern) { return (text.match(pattern) || []).length; }
function fail(message) { failures.push(message); }

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
  for (const [,src] of html.matchAll(/<img\b[^>]*\bsrc="([^"]+)"[^>]*>/gi)) {
    const tag = html.match(new RegExp(`<img\\b[^>]*\\bsrc="${src.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}"[^>]*>`, "i"))?.[0] || "";
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
  for (const required of ["<meta name=\"description\"", "<link rel=\"canonical\"", "property=\"og:title\"", "name=\"twitter:card\"", "application/ld+json", "datePublished", "data-site=\"mr-adventure-dad\""]) if (!html.includes(required)) fail(`${rel}: missing ${required}`);
  if (count(html, /<h1\b/gi) !== 1) fail(`${rel}: must have exactly one h1`);
  if (count(html, /<h2\b/gi) < 6) fail(`${rel}: too little section structure`);
  if (html.replace(/<[^>]+>/g, " ").trim().split(/\s+/).length < 1000) fail(`${rel}: fewer than 1,000 words`);
  const internal = new Set([...html.matchAll(/href="([^"#]+\.html)"/gi)].map((m) => m[1]).filter((href) => !href.startsWith("http")));
  if (internal.size < 3) fail(`${rel}: fewer than 3 meaningful internal links`);
  for (const href of internal) if (!existsSync(resolve(dirname(path), href))) fail(`${rel}: broken internal link ${href}`);
  try { JSON.parse(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/i.exec(html)?.[1] || ""); } catch { fail(`${rel}: invalid JSON-LD`); }
}

const destination = readFileSync(resolve(root, targets[0]), "utf8");
const cooler = readFileSync(resolve(root, targets[1]), "utf8");
if (/data-affiliate-active="true"/.test(destination)) fail("destination guide must not contain paid links");
if (count(cooler, /data-affiliate-active="true"/g) !== 4) fail("cooler guide must contain exactly 4 contextual paid links");
if (count(cooler, /As an Amazon Associate I earn from qualifying purchases/g) !== 1) fail("cooler guide affiliate disclosure missing or duplicated");
for (const tag of cooler.matchAll(/<a\b[^>]*data-affiliate-active="true"[^>]*>/gi)) {
  if (!/tag=mradventuredad-20/.test(tag[0])) fail("affiliate link missing approved tag");
  for (const rel of ["sponsored", "nofollow", "noopener", "noreferrer"]) if (!new RegExp(`rel="[^"]*${rel}`).test(tag[0])) fail(`affiliate link missing ${rel}`);
}
const sitemap = readFileSync(resolve(root, "sitemap.xml"), "utf8");
for (const slug of targets) if (count(sitemap, new RegExp(`https://mradventuredad\\.com/${slug}`, "g")) !== 1) fail(`sitemap missing or duplicates ${slug}`);
for (const surface of ["index.html", "adventures.html", "destinations.html", "gear.html"]) {
  const html = readFileSync(resolve(root, surface), "utf8");
  if (!html.includes("DAILY 2026-08-22")) fail(`${surface}: discovery module missing`);
}
if (failures.length) {
  console.error(failures.map((failure) => `FAIL: ${failure}`).join("\n"));
  process.exit(1);
}
console.log(`Daily publication audit passed: ${htmlFiles.length} HTML pages; 2 substantial guides; metadata, schema, images, internal links, sitemap and 4 disclosed earning links verified.`);
