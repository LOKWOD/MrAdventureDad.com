import {existsSync,readFileSync,readdirSync} from "node:fs";
import {resolve} from "node:path";

const root=resolve(process.argv[2]||"."),read=p=>readFileSync(resolve(root,p),"utf8"),count=(s,r)=>(s.match(r)||[]).length,failures=[];
const pages=[
 {path:"guides/corning-museum-of-glass-with-kids.html",title:"Corning Museum of Glass With Kids: Demo First, One Gallery Loop, Then Decide",image:"corning-glass-museum-family-plan.webp",paid:0,sources:["visit.cmog.org/plan-your-visit","visit.cmog.org/visiting-with-kids","glassmaking.cmog.org/make-your-own-glass"]},
 {path:"guides/family-boot-dryer-fan-heated-passive-guide.html",title:"Family Boot Dryers: Forced Air vs Low Heat vs Passive—and the Material Gate",image:"family-boot-dryer-categories.webp",paid:3,sources:["peetdryer.com/pages/product-instructions","dryguy.com/products/force-dry-dx","cpsc.gov/Safety-Education/Safety-Guides/Electronics-and-Electrical/Safety-at-Home-Extension-Cords"]},
 {path:"guides/family-emergency-contact-card-drill-20-minutes.html",title:"The 20-Minute Family Emergency Contact Card Drill: Read, Call, Carry, Update",image:"family-emergency-contact-card-drill.webp",paid:0,sources:["ready.gov/sites/default/files/2025-06/family-communication-plan_fillable-card.pdf","ready.gov/kids","911.gov/calling-911"]}
];
const html=[];
const walk=d=>{for(const e of readdirSync(d,{withFileTypes:true})){if(e.name===".git")continue;const p=resolve(d,e.name);if(e.isDirectory())walk(p);else if(e.name.endsWith(".html"))html.push(readFileSync(p,"utf8"));}};
walk(root);
const sitemap=read("sitemap.xml"),credits=JSON.parse(read("assets/images/credits.json"));
for(const p of pages){
 const h=read(p.path),canonical=`https://mradventuredad.com/${p.path}`;
 if(!h.includes(`<h1>${p.title}</h1>`))failures.push(`${p.path}: title`);
 if(!h.includes(`rel="canonical" href="${canonical}"`))failures.push(`${p.path}: canonical`);
 if(!h.includes('datePublished":"2026-10-16"')||!h.includes('dateModified":"2026-10-16"'))failures.push(`${p.path}: dates`);
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
 "guides/family-museum-day-system.html":pages[0].path,"guides/most-syracuse-with-kids.html":pages[0].path,"guides/museum-of-the-earth-with-kids.html":pages[0].path,
 "guides/kids-rain-boots-tall-chelsea-insulated-guide.html":pages[1].path,"guides/kids-hiking-footwear-trail-runner-shoe-boot.html":pages[1].path,"guides/kids-snow-pants-bibs-waist-one-piece-guide.html":pages[1].path,
 "guides/family-lost-kid-plan.html":pages[2].path,"guides/family-home-fire-escape-drill-20-minute-plan.html":pages[2].path,"guides/family-no-cell-service-day-trip-plan.html":pages[2].path,"guides/family-hotel-fire-escape-plan.html":pages[2].path
};
for(const [path,target] of Object.entries(reciprocal))if(!read(path).includes(`href="${target.split("/").pop()}"`))failures.push(`${path}: reciprocal`);
if(!read("index.html").includes("FRESH IDEAS · OCTOBER 16, 2026"))failures.push("homepage date");
if(!read("index.html").includes('href="weekend-october-17-18-2026.html"'))failures.push("weekly roundup not featured");
const titles=new Set();
for(const h of html){const t=/<h1>([\s\S]*?)<\/h1>/i.exec(h)?.[1]?.replace(/<[^>]+>/g," ").replace(/\s+/g," ").trim();if(t){if(titles.has(t))failures.push(`duplicate h1 ${t}`);titles.add(t);}}
const urls=[...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map(m=>m[1]);
if(new Set(urls).size!==urls.length)failures.push("duplicate sitemap URL");
if(html.length!==150)failures.push(`html total ${html.length}`);
if(urls.length!==150)failures.push(`sitemap total ${urls.length}`);
const paid=html.reduce((n,h)=>n+count(h,/data-affiliate-active="true"/g),0);
if(paid!==204)failures.push(`affiliate total ${paid}`);
const placements=pages.reduce((n,p)=>n+html.filter(h=>h.includes(p.image)).length,0);
if(placements!==11)failures.push(`image placements ${placements}`);
for(const p of pages){const imageCount=html.filter(h=>h.includes(p.image)).length;if(imageCount<3)failures.push(`${p.image}: weak discovery ${imageCount}`);}
if(failures.length){console.error(failures.map(x=>`FAIL ${x}`).join("\n"));process.exit(1);}
console.log("PASS daily 2026-10-16: 3 substantial pages, 3 verified editorial images across 11 placements, 0 product images, 3 disclosed Amazon links, 204 active affiliate links, 10 reciprocal links, current homepage and protected weekly roundup.");
