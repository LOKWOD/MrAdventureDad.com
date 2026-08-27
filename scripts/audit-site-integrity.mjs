import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { dirname, relative, resolve } from "node:path";

const root=resolve(process.argv[2]||".");
const failures=[];
const htmlFiles=[];
const fail=message=>failures.push(message);
function walk(dir){
  for(const name of readdirSync(dir)){
    if([".git","node_modules"].includes(name))continue;
    const path=resolve(dir,name);
    if(statSync(path).isDirectory())walk(path);
    else if(name.endsWith(".html"))htmlFiles.push(path);
  }
}
function count(text,re){return (text.match(re)||[]).length;}
function normalize(base,value){
  const clean=value.split(/[?#]/)[0];
  return resolve(base,clean);
}
walk(root);
const titles=new Map();
const canonicals=new Map();
const imageSources=new Map();
const usedLocalImages=new Set();
const allowedUnsplash=[
  "1507525428034-b723cf961d3e","1475483768296-6163e08872a1",
  "1523987355523-c7b5b0dd90a7","1441974231531-c6227db76b6e",
  "1551632811-561732d1e306","1489447068241-b3490214e879",
  "1469854523086-cc02fe5d8800","1483664852095-d6cc6870702d"
];
const retiredImageIds=[
  "1500530855697-b586d89ba3ee","1472396961693-142e6e269027",
  "1500534314209-a25ddb2bd429","1502786129293-79981df4e689",
  "1464822759023-fed622ff2c3b","1520975958225-9e4be0f3066d",
  "1445307806294-bff7f67ff225"
];
const destinationGuideMedia={
  "guides/chimney-bluffs-with-kids.html":["chimney-bluffs.webp","chimney-bluffs-family-plan.svg"],
  "guides/green-lakes-state-park-with-kids.html":["green-lakes.webp","green-lakes-family-day-plan.svg"],
  "guides/taughannock-falls-with-kids.html":["taughannock-falls.webp","taughannock-family-day-plan.svg"],
  "guides/beaver-lake-nature-center-with-kids.html":["beaver-lake-nature-center.webp","beaver-lake-family-plan.svg"],
  "guides/watkins-glen-with-kids.html":["watkins-glen.webp","watkins-glen-family-plan.svg"],
  "guides/letchworth-state-park-with-kids.html":["letchworth-upper-falls.webp","letchworth-overlook-family-plan.svg"]
};
const gearGuideMedia={
  "guides/family-day-trip-cooler-guide.html":["family-cooler.webp","family-cooler-decision.svg"],
  "guides/family-hiking-daypack-guide.html":["family-hiking-daypack.webp","family-hiking-daypack-loadouts.svg"],
  "guides/family-rain-gear-guide.html":["family-rain-gear.webp","family-rain-gear-decision.svg"],
  "guides/family-walkie-talkie-guide.html":["family-radios.webp","family-radio-decision.svg"],
  "guides/family-sun-protection-guide.html":["family-sun-protection.webp","family-sun-protection-stack.svg"],
  "guides/family-headlamps-flashlights-lanterns.html":["family-lighting.webp","family-lighting-system.svg"]
};
const photoOnlyGearGuides={
  "guides/family-first-aid-kit-guide.html":"family-first-aid.webp",
  "guides/family-hydration-gear-guide.html":"family-hydration.webp",
  "guides/family-bug-protection-guide.html":"family-bug-protection.webp",
  "guides/family-camping-sleep-system-guide.html":"family-sleep-system.webp"
};
for(const file of htmlFiles){
  const rel=relative(root,file).replaceAll("\\","/");
  const html=readFileSync(file,"utf8");
  for(const [label,re] of [
    ["title",/<title>[\s\S]*?<\/title>/gi],
    ["description",/<meta\s+name=["']description["']/gi],
    ["canonical",/<link\s+rel=["']canonical["']/gi],
    ["h1",/<h1\b/gi],
    ["primary nav",/<nav\s+class=["']nav["'][^>]*id=["']site-navigation["']/gi]
  ])if(count(html,re)!==1)fail(rel+": "+label+" count is "+count(html,re));
  const title=html.match(/<title>([\s\S]*?)<\/title>/i)?.[1]?.trim();
  const canonical=html.match(/<link\s+rel=["']canonical["'][^>]*href=["']([^"']+)/i)?.[1];
  if(title){if(titles.has(title))fail("duplicate title: "+title);titles.set(title,rel);}
  if(canonical){if(canonicals.has(canonical))fail("duplicate canonical: "+canonical);canonicals.set(canonical,rel);}
  const ids=[...html.matchAll(/\sid=["']([^"']+)["']/gi)].map(match=>match[1]);
  for(const id of new Set(ids))if(ids.filter(value=>value===id).length>1)fail(rel+": duplicate id "+id);
  for(const match of html.matchAll(/<img\b[^>]*>/gi)){
    const tag=match[0];
    const src=tag.match(/\ssrc=(["'])(.*?)\1/i)?.[2];
    const alt=tag.match(/\salt=(["'])(.*?)\1/i)?.[2];
    if(!src)fail(rel+": image missing src");
    if(!alt)fail(rel+": image missing useful alt");
    if(!/\sloading=(["'])(?:lazy|eager)\1/i.test(tag))fail(rel+": image missing loading policy");
    if(!/\sdecoding=(["'])async\1/i.test(tag))fail(rel+": image missing decoding policy");
    if(!src)continue;
    imageSources.set(src,(imageSources.get(src)||0)+1);
    if(/^https?:/.test(src)){
      if(src.includes("images.unsplash.com")&&!allowedUnsplash.some(id=>src.includes(id)))fail(rel+": unverified Unsplash image "+src);
      if(!src.includes("images.unsplash.com")&&!src.includes("commons.wikimedia.org"))fail(rel+": unapproved image host "+src);
    }else{
      const target=normalize(dirname(file),src);
      if(!existsSync(target))fail(rel+": missing local image "+src);
      usedLocalImages.add(relative(root,target).replaceAll("\\","/"));
    }
    if(retiredImageIds.some(id=>src.includes(id)))fail(rel+": retired mismatched image "+src);
  }
  for(const match of html.matchAll(/<a\b[^>]*\shref=(["'])(.*?)\1/gi)){
    const href=match[2];
    if(!href||/^(?:https?:|mailto:|tel:|javascript:|#)/.test(href))continue;
    const path=href.split(/[?#]/)[0];
    if(path.endsWith(".html")&&!existsSync(normalize(dirname(file),path)))fail(rel+": broken page link "+href);
  }
}
if(htmlFiles.length!==45)fail("expected 45 HTML pages, found "+htmlFiles.length);
const credits=JSON.parse(readFileSync(resolve(root,"assets/images/credits.json"),"utf8"));
for(const src of imageSources.keys()){
  if(src.includes("commons.wikimedia.org")&&!credits[src])fail("missing photo credit: "+src);
}
for(const src of usedLocalImages){
  if(src.endsWith(".svg")&&!credits[src])fail("missing illustration credit: "+src);
  if(src.startsWith("assets/images/photos/")&&!credits[src])fail("missing local photo credit: "+src);
}
for(const [rel,[photo,plan]] of Object.entries(destinationGuideMedia)){
  const html=readFileSync(resolve(root,rel),"utf8");
  const hero='class="article-hero" src="../assets/images/photos/'+photo+'"';
  const diagram='class="article-plan"';
  const planSrc='src="../assets/images/'+plan+'"';
  if(!html.includes(hero))fail(rel+": destination photograph is not the article hero");
  if(count(html,new RegExp(plan.replaceAll(".","\\."),"g"))!==1)fail(rel+": planning diagram must appear exactly once");
  if(!html.includes(diagram)||!html.includes(planSrc))fail(rel+": planning diagram is not embedded in the article");
  if(html.indexOf(hero)>html.indexOf(planSrc))fail(rel+": planning diagram appears before destination photograph");
  for(const file of htmlFiles){
    const other=relative(root,file).replaceAll("\\","/");
    if(other===rel)continue;
    const otherHtml=readFileSync(file,"utf8");
    if(otherHtml.includes('src="assets/images/'+plan+'"'))fail(other+": destination planning diagram is still used as a card image");
  }
}
for(const [rel,[photo,plan]] of Object.entries(gearGuideMedia)){
  const html=readFileSync(resolve(root,rel),"utf8");
  const hero='class="article-hero" src="../assets/images/photos/'+photo+'"';
  const diagram='class="article-plan"';
  const planSrc='src="../assets/images/'+plan+'"';
  if(!html.includes(hero))fail(rel+": gear photograph is not the article hero");
  if(count(html,new RegExp(plan.replaceAll(".","\\."),"g"))!==1)fail(rel+": gear planning diagram must appear exactly once");
  if(!html.includes(diagram)||!html.includes(planSrc))fail(rel+": gear planning diagram is not embedded in the article");
  if(html.indexOf(hero)>html.indexOf(planSrc))fail(rel+": gear planning diagram appears before gear photograph");
  for(const file of htmlFiles){
    const other=relative(root,file).replaceAll("\\","/");
    if(other===rel)continue;
    const otherHtml=readFileSync(file,"utf8");
    if(otherHtml.includes('src="assets/images/'+plan+'"'))fail(other+": gear planning diagram is still used as a card image");
  }
}
for(const [rel,photo] of Object.entries(photoOnlyGearGuides)){
  const html=readFileSync(resolve(root,rel),"utf8");
  const hero='class="article-hero" src="../assets/images/photos/'+photo+'"';
  if(!html.includes(hero))fail(rel+": real gear photograph is not the article hero");
  if(count(html,/class="article-hero"/g)!==1)fail(rel+": must contain exactly one article hero");
  if(count(html,/class="article-plan"/g)!==0)fail(rel+": planning diagram must not replace or duplicate the hero photograph");
}
const sitemap=readFileSync(resolve(root,"sitemap.xml"),"utf8");
const sitemapUrls=[...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map(match=>match[1]);
if(sitemapUrls.length!==45)fail("expected 45 sitemap URLs, found "+sitemapUrls.length);
if(new Set(sitemapUrls).size!==sitemapUrls.length)fail("duplicate sitemap URL");
for(const file of htmlFiles){
  const rel=relative(root,file).replaceAll("\\","/");
  const expected="https://mradventuredad.com/"+(rel==="index.html"?"":rel);
  if(!sitemapUrls.includes(expected))fail("sitemap missing "+expected);
}
if(failures.length){
  console.error(failures.map(item=>"FAIL "+item).join("\n"));
  process.exit(1);
}
console.log("PASS "+htmlFiles.length+" pages; "+[...imageSources.values()].reduce((a,b)=>a+b,0)+" image placements; metadata, navigation, links, image relevance allowlist, credits and sitemap verified.");
