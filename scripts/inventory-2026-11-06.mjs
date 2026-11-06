import {readFileSync,readdirSync,statSync,writeFileSync} from 'node:fs';
import {relative,resolve} from 'node:path';
import {pages as sourcePages} from './content-2026-11-06.mjs';

const root=resolve(process.argv[2]||'.'),records=[];
const strip=s=>s.replace(/<script[\s\S]*?<\/script>/gi,' ').replace(/<style[\s\S]*?<\/style>/gi,' ').replace(/<[^>]+>/g,' ').replace(/&(?:amp|quot|#39|apos|nbsp);/gi,' ').replace(/\s+/g,' ').trim();
function walk(dir){for(const name of readdirSync(dir)){if(['.git','node_modules'].includes(name))continue;const p=resolve(dir,name);if(statSync(p).isDirectory())walk(p);else if(name.endsWith('.html'))records.push(parse(p));}}
function parse(file){
 const path=relative(root,file).replaceAll('\\','/'),h=readFileSync(file,'utf8');
 const heading=strip(/<h1[^>]*>([\s\S]*?)<\/h1>/i.exec(h)?.[1]||'');
 const title=strip(/<title>([\s\S]*?)<\/title>/i.exec(h)?.[1]||'');
 const description=/<meta\s+name="description"\s+content="([^"]*)"/i.exec(h)?.[1]||'';
 const slug=path==='index.html'?'home':path.replace(/\.html$/,'').split('/').pop();
 const primaryKeyword=heading.replace(/\s*[:—|].*$/,'').replace(/\bwith kids\b/i,'with kids').trim().toLowerCase();
 const angles=[...h.matchAll(/<h2[^>]*>([\s\S]*?)<\/h2>/gi)].map(m=>strip(m[1])).filter(Boolean);
 const images=[...h.matchAll(/<img\b[^>]*src="([^"]+)"[^>]*>/gi)].map(m=>({src:m[1],alt:/\balt="([^"]*)"/i.exec(m[0])?.[1]||''}));
 const commercialCategories=[...h.matchAll(/<a[^>]+data-affiliate-active="true"[^>]*>[\s\S]*?<h3>([\s\S]*?)<\/h3>/gi)].map(m=>strip(m[1]));
 const locations=['Syracuse','Central New York','Finger Lakes','Adirondacks','Thousand Islands','Western New York','Albany','New York State Museum','CNY Regional Market','Labrador Hollow','Tully','Cortland','Cazenovia','Rochester','Ithaca','Auburn','Oswego','Utica','Watertown','Buffalo','Onondaga Creekwalk','Inner Harbor'].filter(x=>new RegExp(x.replaceAll(' ','\\s*'),'i').test(`${heading} ${description} ${h}`));
 const published=/"datePublished":"([^"]+)"/.exec(h)?.[1]||/<meta property="article:published_time" content="([^"]+)/.exec(h)?.[1]||'';
 return {path,slug,title,heading,description,primaryKeyword,locations,tripAngles:angles,images,commercialCategories,datePublished:published};
}
walk(root);
records.sort((a,b)=>a.path.localeCompare(b.path));
const newSlugs=new Set(sourcePages.map(p=>p.slug));
const output={date:'2026-11-06',stage:'post-publication',previousCompleteInventory:'reports/inventory-2026-11-05.json',previousPageCount:213,pageCount:records.length,checkedDimensions:['path','slug','title','heading','description','primaryKeyword','locations','tripAngles','images','commercialCategories','datePublished'],newPages:records.filter(r=>newSlugs.has(r.slug)),pages:records,note:'Complete production HTML inventory regenerated from every page after checking the 213-page November 5 inventory, the separate November 7–8 weekly roundup, the previous fourteen days and all existing images and commercial categories.'};
if(records.length!==216)throw Error(`Expected 216 HTML documents after exactly three additions, found ${records.length}`);
if(output.newPages.length!==3)throw Error(`Expected 3 November 6 records, found ${output.newPages.length}`);
for(const key of ['slug','title','heading']){const values=records.map(r=>r[key]).filter(Boolean);if(new Set(values).size!==values.length)throw Error(`Duplicate ${key} in complete inventory`);}
writeFileSync(resolve(root,'reports/inventory-2026-11-06.json'),JSON.stringify(output,null,2)+'\n');
console.log(`Complete inventory records ${records.length} HTML documents after exactly three additions.`);
