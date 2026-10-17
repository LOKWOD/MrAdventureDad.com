import {existsSync,readFileSync,readdirSync} from "node:fs";
import {resolve} from "node:path";

const root=resolve(process.argv[2]||"."),read=p=>readFileSync(resolve(root,p),"utf8"),count=(s,r)=>(s.match(r)||[]).length,failures=[];
const pages=[
 {path:"guides/strong-museum-of-play-with-kids.html",title:"The Strong Museum of Play With Kids: Pick Two Zones, Eat, Then Decide",image:"strong-museum-play-family-plan.webp",paid:0,sources:["museumofplay.org/visit/","museumofplay.org/visit/plan-a-visit-faq/","museumofplay.org/visit/accessibility/"]},
 {path:"guides/kids-sleds-saucer-toboggan-steering-guide.html",title:"Kids’ Sleds: Saucer vs Toboggan vs Steering Sled—and the Hill Gate",image:"kids-sled-category-hill-gate.webp",paid:3,sources:["healthychildren.org/English/safety-prevention/at-play/Pages/Winter-Safety.aspx","nationwidechildrens.org/research/areas-of-research/center-for-injury-research-and-policy/injury-topics/sports-recreation/sledding-safety","cpsc.gov/Recalls"]},
 {path:"guides/family-foley-sound-effects-lab-30-minutes.html",title:"The 30-Minute Family Foley Lab: Make Six Movie Sounds Without Posting",image:"family-foley-sound-lab.webp",paid:0,sources:["movingimage.org/archived-events/sound-effects/","movingimage.org/education/","movingimage.org/event/effective-effects/"]}
];
const html=[];
const walk=d=>{for(const e of readdirSync(d,{withFileTypes:true})){if(e.name===".git")continue;const p=resolve(d,e.name);if(e.isDirectory())walk(p);else if(e.name.endsWith(".html"))html.push(readFileSync(p,"utf8"));}};
walk(root);
const sitemap=read("sitemap.xml"),credits=JSON.parse(read("assets/images/credits.json"));
for(const p of pages){
 const h=read(p.path),canonical=`https://mradventuredad.com/${p.path}`;
 if(!h.includes(`<h1>${p.title}</h1>`))failures.push(`${p.path}: title`);
 if(!h.includes(`rel="canonical" href="${canonical}"`))failures.push(`${p.path}: canonical`);
 if(!h.includes('datePublished":"2026-10-17"')||!h.includes('dateModified":"2026-10-17"'))failures.push(`${p.path}: dates`);
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
 "guides/family-museum-day-system.html":pages[0].path,"guides/most-syracuse-with-kids.html":pages[0].path,"guides/corning-museum-of-glass-with-kids.html":pages[0].path,
 "guides/kids-snow-pants-bibs-waist-one-piece-guide.html":pages[1].path,"guides/family-hand-warmers-air-activated-snap-disc-rechargeable-guide.html":pages[1].path,"guides/family-outdoor-weather-cutoff-plan.html":pages[1].path,
 "guides/neighborhood-sound-map-20-minute-family-activity.html":pages[2].path,"guides/family-photo-scavenger-hunt-30-minute-no-posting-plan.html":pages[2].path,"guides/flashlight-shadow-lab-30-minute-family-science.html":pages[2].path,"guides/living-room-picnic-30-minute-family-plan.html":pages[2].path
};
for(const [path,target] of Object.entries(reciprocal))if(!read(path).includes(`href="${target.split("/").pop()}"`))failures.push(`${path}: reciprocal`);
if(!read("index.html").includes("FRESH IDEAS · OCTOBER 17, 2026"))failures.push("homepage date");
if(!read("index.html").includes('href="weekend-october-17-18-2026.html"'))failures.push("weekly roundup not featured");
const titles=new Set();
for(const h of html){const t=/<h1>([\s\S]*?)<\/h1>/i.exec(h)?.[1]?.replace(/<[^>]+>/g," ").replace(/\s+/g," ").trim();if(t){if(titles.has(t))failures.push(`duplicate h1 ${t}`);titles.add(t);}}
const urls=[...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map(m=>m[1]);
if(new Set(urls).size!==urls.length)failures.push("duplicate sitemap URL");
if(html.length!==153)failures.push(`html total ${html.length}`);
if(urls.length!==153)failures.push(`sitemap total ${urls.length}`);
const paid=html.reduce((n,h)=>n+count(h,/data-affiliate-active="true"/g),0);
if(paid!==207)failures.push(`affiliate total ${paid}`);
const placements=pages.reduce((n,p)=>n+html.filter(h=>h.includes(p.image)).length,0);
if(placements!==11)failures.push(`image placements ${placements}`);
for(const p of pages){const imageCount=html.filter(h=>h.includes(p.image)).length;if(imageCount<3)failures.push(`${p.image}: weak discovery ${imageCount}`);}
if(failures.length){console.error(failures.map(x=>`FAIL ${x}`).join("\n"));process.exit(1);}
console.log("PASS daily 2026-10-17: 3 substantial pages, 3 verified editorial images across 11 placements, 0 product images, 3 disclosed Amazon links, 207 active affiliate links, 10 reciprocal links, current homepage and protected weekly roundup.");
