import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";

const root = resolve(process.argv[2] || ".");
const failures = [];
const fail = message => failures.push(message);
const read = path => readFileSync(resolve(root, path), "utf8");
const count = (text, re) => (text.match(re) || []).length;
const strip = html => html.replace(/<script[\s\S]*?<\/script>/gi," ").replace(/<style[\s\S]*?<\/style>/gi," ").replace(/<[^>]+>/g," ").replace(/\s+/g," ").trim();
const pages = [
  {path:"guides/howe-caverns-with-kids.html",title:"Howe Caverns With Kids: The Underground Day That Respects the Stairs",canonical:"https://mradventuredad.com/guides/howe-caverns-with-kids.html",photo:"howe-caverns.webp",paid:0},
  {path:"guides/family-binoculars-8x-vs-10x.html",title:"Family Binoculars: 8x vs 10x—and What Kids Can Actually Hold Still",canonical:"https://mradventuredad.com/guides/family-binoculars-8x-vs-10x.html",photo:"family-binoculars.webp",paid:3},
  {path:"guides/family-lost-kid-plan.html",title:"The Family Lost-Kid Plan: What Children Should Do Before You Get Separated",canonical:"https://mradventuredad.com/guides/family-lost-kid-plan.html",photo:"family-lost-kid-plan.webp",paid:0},
];
const credits = JSON.parse(read("assets/images/credits.json"));
const sitemap = read("sitemap.xml");
for (const page of pages) {
  if (!existsSync(resolve(root,page.path))) { fail(`${page.path}: missing`); continue; }
  const html=read(page.path);
  if(!html.includes(`<h1>${page.title}</h1>`))fail(`${page.path}: title mismatch`);
  if(!html.includes(`rel="canonical" href="${page.canonical}"`))fail(`${page.path}: canonical mismatch`);
  if(!html.includes('datePublished":"2026-09-01"')||!html.includes('dateModified":"2026-09-01"'))fail(`${page.path}: structured dates missing`);
  if(!/<meta property="og:title"/.test(html)||!/<meta name="twitter:card"/.test(html))fail(`${page.path}: social metadata missing`);
  if(!html.includes('application/ld+json')||!html.includes('"Article"'))fail(`${page.path}: Article schema missing`);
  if(count(html,/class="article-hero"/g)!==1||!html.includes(`/photos/${page.photo}`))fail(`${page.path}: verified photo hero missing`);
  if(count(html,/class="article-plan"/g)!==0)fail(`${page.path}: chart/diagram used in a hero-only editorial page`);
  if(count(html,/<img\b/gi)!==count(html,/<img\b[^>]*\balt="[^"]+"/gi))fail(`${page.path}: image alt text failure`);
  if(!credits[`assets/images/photos/${page.photo}`])fail(`${page.path}: image credit missing`);
  if(!html.includes('data-cf-beacon=')||!html.includes('data-site="mr-adventure-dad"'))fail(`${page.path}: analytics or visitor beacon missing`);
  const internal=[...html.matchAll(/<a\b[^>]*href="([^"#]+\.html(?:#[^"]*)?)"/gi)].map(m=>m[1]);
  if(new Set(internal).size<3)fail(`${page.path}: fewer than three internal targets`);
  if(strip(html).split(/\s+/).length<1100)fail(`${page.path}: insufficient substantial copy`);
  const paid=count(html,/data-affiliate-active="true"/g);
  if(paid!==page.paid)fail(`${page.path}: expected ${page.paid} paid links, found ${paid}`);
  if(paid){
    if(count(html,/tag=mradventuredad-20/g)!==paid)fail(`${page.path}: Amazon tag mismatch`);
    if(count(html,/rel="sponsored nofollow noopener noreferrer"/g)!==paid)fail(`${page.path}: paid-link rel mismatch`);
    if(!html.includes('As an Amazon Associate I earn from qualifying purchases'))fail(`${page.path}: disclosure missing`);
  }
  if(count(sitemap,new RegExp(page.canonical.replace(/[.*+?^${}()|[\]\\]/g,"\\$&"),"g"))!==1)fail(`${page.path}: sitemap entry must appear once`);
}
for(const [hub,targets] of Object.entries({"index.html":pages.map(p=>p.path),"adventures.html":pages.map(p=>p.path),"destinations.html":[pages[0].path],"outdoors.html":[pages[0].path,pages[1].path],"gear.html":[pages[1].path,pages[2].path]})){
  const html=read(hub); for(const target of targets)if(!html.includes(`href="${target}"`))fail(`${hub}: missing ${target}`);
}
for(const [path,targets] of Object.entries({"guides/beaver-lake-nature-center-with-kids.html":["family-binoculars-8x-vs-10x.html"],"guides/family-day-trip-system.html":["family-lost-kid-plan.html","howe-caverns-with-kids.html"],"guides/amusement-park-survival-plan.html":["family-lost-kid-plan.html"]})){
  const html=read(path); for(const target of targets)if(!html.includes(`href="${target}"`))fail(`${path}: missing related ${target}`);
}
if(failures.length){console.error(failures.map(item=>`FAIL ${item}`).join("\n"));process.exit(1);}
console.log("PASS daily 2026-09-01: 3 substantial pages, 3 photo heroes, 0 charts, 3 disclosed Amazon links, discovery and related links verified.");
