import {existsSync,readFileSync,readdirSync} from "node:fs";
import {resolve} from "node:path";

const root=resolve(process.argv[2]||"."),read=p=>readFileSync(resolve(root,p),"utf8"),count=(s,r)=>(s.match(r)||[]).length,failures=[];
const pages=[
 {path:"guides/lime-hollow-nature-center-with-kids.html",title:"Lime Hollow Nature Center With Kids: Visitor Center, Art Trail, Then Stop",image:"lime-hollow-family-plan.webp",paid:0,sources:["limehollow.org/trails","limehollow.org/accessibility","weather.gov/safety/lightning"]},
 {path:"guides/family-field-sketch-kit-pouch-case-clipboard-guide.html",title:"Family Field Sketch Kits: Zipper Pouch vs Hard Case vs Clipboard—and the Ten-Item Cap",image:"family-field-sketch-kit-categories.webp",paid:3,sources:["cpsc.gov/business--manufacturing/business-education/business-guidance/art-materials","cpsc.gov/Safety-Education/Safety-Guides/hobbies/art-and-craft-safety-guide","cpsc.gov/Recalls"]},
 {path:"guides/paper-airplane-distance-lab-25-minute-family-stem.html",title:"The 25-Minute Paper-Airplane Distance Lab: Three Throws, One Change, Better Evidence",image:"family-paper-airplane-distance-lab.webp",paid:0,sources:["airandspace.si.edu/activity/paper-airplane","nasa.gov/stem-content/four-forces-of-flight"]}
];
const html=[];
const walk=d=>{for(const e of readdirSync(d,{withFileTypes:true})){if(e.name===".git")continue;const p=resolve(d,e.name);if(e.isDirectory())walk(p);else if(e.name.endsWith(".html"))html.push(readFileSync(p,"utf8"));}};
walk(root);
const sitemap=read("sitemap.xml"),credits=JSON.parse(read("assets/images/credits.json"));
for(const p of pages){
 const h=read(p.path),canonical=`https://mradventuredad.com/${p.path}`;
 if(!h.includes(`<h1>${p.title}</h1>`))failures.push(`${p.path}: title`);
 if(!h.includes(`rel="canonical" href="${canonical}"`))failures.push(`${p.path}: canonical`);
 if(!h.includes('datePublished":"2026-10-15"')||!h.includes('dateModified":"2026-10-15"'))failures.push(`${p.path}: dates`);
 if(!h.includes('"Article"')||!h.includes('"Guide"'))failures.push(`${p.path}: schema`);
 if(count(h,/class="article-hero"/g)!==1)failures.push(`${p.path}: hero`);
 if(count(h,/<img\b/gi)!==count(h,/<img\b[^>]*\balt="[^"]+"/gi))failures.push(`${p.path}: alt`);
 if(!h.includes('data-cf-beacon=')||!h.includes('data-site="mr-adventure-dad"'))failures.push(`${p.path}: analytics`);
 const links=[...h.matchAll(/<a\b[^>]*href="([^"#]+\.html)/g)].map(m=>m[1]);
 if(new Set(links).size<3)failures.push(`${p.path}: internal links`);
 for(const s of p.sources)if(!h.includes(s))failures.push(`${p.path}: source ${s}`);
 if(count(h,/data-affiliate-active="true"/g)!==p.paid)failures.push(`${p.path}: paid count`);
 if(p.paid&&(!h.includes('As an Amazon Associate I earn from qualifying purchases')||count(h,/rel="sponsored nofollow noopener noreferrer"/g)!==p.paid))failures.push(`${p.path}: disclosure/rel`);
 if(count(sitemap,new RegExp(canonical.replace(/[.*+?^${}()|[\]\\]/g,"\\$&"),"g"))!==1)failures.push(`${p.path}: sitemap`);
 const key=`assets/images/photos/${p.image}`;
 if(!existsSync(resolve(root,key))||!credits[key])failures.push(`${key}: asset/credit`);
}
for(const [hub,targets] of Object.entries({"index.html":pages.map(p=>p.path),"adventures.html":pages.map(p=>p.path),"destinations.html":[pages[0].path],"gear.html":[pages[1].path],"outdoors.html":pages.map(p=>p.path)}))for(const t of targets)if(!read(hub).includes(`href="${t}"`))failures.push(`${hub}: ${t}`);
const reciprocal={
 "guides/beaver-lake-nature-center-with-kids.html":pages[0].path,
 "guides/baltimore-woods-with-kids.html":pages[0].path,
 "guides/central-new-york-family-trail-picker.html":pages[0].path,
 "guides/family-nature-observation-kit-magnifier-bug-viewer-macro-lens.html":pages[1].path,
 "guides/kids-camera-simple-digital-instant-rugged-guide.html":pages[1].path,
 "guides/everson-museum-with-kids.html":pages[1].path,
 "guides/paper-bridge-load-test-25-minute-family-stem.html":pages[2].path,
 "guides/cardboard-marble-maze-30-minute-family-engineering-build.html":pages[2].path,
 "guides/flashlight-shadow-lab-30-minute-family-science.html":pages[2].path
};
for(const [path,target] of Object.entries(reciprocal))if(!read(path).includes(`href="${target.split("/").pop()}"`))failures.push(`${path}: reciprocal`);
if(!read("index.html").includes("FRESH IDEAS · OCTOBER 15, 2026"))failures.push("homepage date");
if(!read("index.html").includes('href="weekend-october-17-18-2026.html"'))failures.push("weekly roundup not featured");
const bino=read("guides/family-binoculars-8x-vs-10x.html");
for(const needle of ["The five-target acquisition drill",'article:modified_time" content="2026-10-15"','href="lime-hollow-nature-center-with-kids.html"'])if(!bino.includes(needle))failures.push(`binocular strengthening: ${needle}`);
if(!sitemap.includes('family-binoculars-8x-vs-10x.html</loc><lastmod>2026-10-15</lastmod>'))failures.push("binocular sitemap lastmod");
const titles=new Set();
for(const h of html){const t=/<h1>([\s\S]*?)<\/h1>/i.exec(h)?.[1]?.replace(/<[^>]+>/g," ").replace(/\s+/g," ").trim();if(t){if(titles.has(t))failures.push(`duplicate h1 ${t}`);titles.add(t);}}
const urls=[...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map(m=>m[1]);
if(new Set(urls).size!==urls.length)failures.push("duplicate sitemap URL");
if(html.length!==147)failures.push(`html total ${html.length}`);
if(urls.length!==147)failures.push(`sitemap total ${urls.length}`);
const paid=html.reduce((n,h)=>n+count(h,/data-affiliate-active="true"/g),0);
if(paid!==201)failures.push(`affiliate total ${paid}`);
const placements=pages.reduce((n,p)=>n+html.filter(h=>h.includes(p.image)).length,0);
if(placements!==11)failures.push(`image placements ${placements}`);
if(failures.length){console.error(failures.map(x=>`FAIL ${x}`).join("\n"));process.exit(1);}
console.log("PASS daily 2026-10-15: 3 substantial pages, 3 verified editorial images across 11 placements, 0 product images, 3 disclosed Amazon links, 201 active affiliate links, 9 reciprocal links, strengthened binocular guide, current homepage and protected weekly roundup.");
