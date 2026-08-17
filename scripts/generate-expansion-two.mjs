import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { pagesA } from "./expansion-two-pages-a.mjs";
import { pagesB } from "./expansion-two-pages-b.mjs";

const root = process.cwd();
const siteUrl = "https://mradventuredad.com";
const pages = [...pagesA, ...pagesB];
const esc = (value) => String(value).replace(/[&<>\"]/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[char]));
function render(page) {
  const canonical = `${siteUrl}/guides/${page.slug}`;
  const articleSchema = { "@context": "https://schema.org", "@type": "Article", headline: page.title, description: page.description, url: canonical, dateModified: "2026-08-17", author: { "@type": "Organization", name: "Mr Adventure Dad" }, publisher: { "@type": "Organization", name: "Mr Adventure Dad" } };
  const faqSchema = { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: page.faq.map(([q, a]) => ({ "@type": "Question", name: q, acceptedAnswer: { "@type": "Answer", text: a } })) };
  const sections = page.sections.map(([heading, paragraphs]) => `<h2>${esc(heading)}</h2>${paragraphs.map((p) => `<p>${esc(p)}</p>`).join("")}`).join("");
  const checklist = page.checklist.map((item) => `<li>${esc(item)}</li>`).join("");
  const faq = page.faq.map(([q, a]) => `<details><summary>${esc(q)}</summary><p>${esc(a)}</p></details>`).join("");
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${esc(page.title)} | Mr Adventure Dad</title><meta name="description" content="${esc(page.description)}"><link rel="canonical" href="${canonical}"><meta property="og:type" content="article"><meta property="og:site_name" content="Mr Adventure Dad"><meta property="og:title" content="${esc(page.title)}"><meta property="og:description" content="${esc(page.description)}"><meta property="og:url" content="${canonical}"><meta property="og:image" content="${page.image}"><meta name="twitter:card" content="summary_large_image"><link rel="stylesheet" href="../assets/css/style.css"><script defer src="../assets/js/site.js"></script><style>.article details{padding:1rem 0;border-bottom:1px solid rgba(0,0,0,.15)}.article summary{font-weight:800;cursor:pointer}.trip-checklist{padding:1.3rem 1.5rem;background:#f3efe3;border-left:5px solid #e1592a;margin:2rem 0}.trip-checklist li{margin:.6rem 0}</style><script type="application/ld+json">${JSON.stringify(articleSchema)}</script><script type="application/ld+json">${JSON.stringify(faqSchema)}</script></head><body><header class="site-header"><a class="brand" href="../index.html"><span class="brand-mark">MAD</span><span>MR <b>ADVENTURE</b> DAD</span></a><button class="menu-toggle">☰</button><nav class="nav"><a href="../adventures.html">Adventures</a><a href="../destinations.html">Destinations</a><a href="../outdoors.html">Outdoors</a><a href="../gear.html">Gear</a><a href="../about.html">About</a></nav></header><main class="article"><p class="eyebrow">${esc(page.eyebrow)}</p><h1>${esc(page.title)}</h1><p class="dek">${esc(page.lead)}</p><img class="article-hero" src="${page.image}" alt="${esc(page.imageAlt)}">${sections}<section class="trip-checklist"><h2>The working checklist</h2><ul>${checklist}</ul></section><section><h2>Frequently asked questions</h2>${faq}</section><hr><p><a class="button ghost" href="../adventures.html">← Back to adventures</a></p></main><footer><div class="wrap copyright">© <span id="year"></span> Mr Adventure Dad. <a href="../index.html">Home</a></div></footer></body></html>`;
}
function upsert(path, marker, block) {
  const full = join(root, path);
  let html = readFileSync(full, "utf8");
  const start = `<!-- ${marker} START -->`;
  const end = `<!-- ${marker} END -->`;
  const wrapped = `${start}${block}${end}`;
  const pattern = new RegExp(`${start.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}[\\s\\S]*?${end.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}`);
  html = pattern.test(html) ? html.replace(pattern, wrapped) : html.replace("</main>", `${wrapped}</main>`);
  writeFileSync(full, html);
}
for (const page of pages) {
  const full = join(root, "guides", page.slug);
  mkdirSync(dirname(full), { recursive: true });
  writeFileSync(full, render(page));
}
const cards = pages.map((page) => `<article class="card"><img src="${page.image}" alt="${esc(page.imageAlt)}"><div><span>${esc(page.eyebrow)}</span><h3><a href="guides/${page.slug}">${esc(page.title)}</a></h3><p>${esc(page.description)}</p></div></article>`).join("");
upsert("adventures.html", "MAD EXPANSION TWO", `<section class="content-section wrap"><p class="kicker">TEN NEW DAD-TESTED SYSTEMS</p><h2>Better days because the hard parts were planned first.</h2><p class="section-copy">Destinations, firsts, weather, gear, pacing and one-on-one time—complete plans built for real families.</p><div class="card-grid">${cards}</div></section>`);
const sitemapPath = join(root, "sitemap.xml");
let sitemap = readFileSync(sitemapPath, "utf8");
for (const page of pages) {
  const loc = `${siteUrl}/guides/${page.slug}`;
  const escaped = loc.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  sitemap = sitemap.replace(new RegExp(`<url>\\s*<loc>${escaped}<\\/loc>[\\s\\S]*?<\\/url>\\s*`, "g"), "");
}
sitemap = sitemap.replace("</urlset>", `${pages.map((page) => `<url><loc>${siteUrl}/guides/${page.slug}</loc><lastmod>2026-08-17</lastmod><changefreq>monthly</changefreq><priority>0.76</priority></url>`).join("")}</urlset>`);
writeFileSync(sitemapPath, sitemap);
console.log(`Generated ${pages.length} additional Mr Adventure Dad guides.`);
