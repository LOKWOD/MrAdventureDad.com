import {readFileSync,writeFileSync} from 'node:fs';
import {resolve} from 'node:path';
import {pages} from './content-2026-11-01.mjs';

const root=resolve(process.argv[2]||'.');
const prior=JSON.parse(readFileSync(resolve(root,'reports/inventory-2026-10-31.json'),'utf8'));
const strip=s=>s.replace(/<[^>]+>/g,' ').replace(/&[a-z0-9#]+;/gi,' ').replace(/\s+/g,' ').trim();
const fresh=pages.map(p=>{
 const path=`guides/${p.slug}.html`,h=readFileSync(resolve(root,path),'utf8');
 return {
  path,
  title:/<title>([^<]+)/i.exec(h)?.[1]||p.metaTitle,
  heading:p.title,
  description:p.description,
  keywords:'',
  datePublished:'2026-11-01',
  angles:[...h.matchAll(/<h2[^>]*>([\s\S]*?)<\/h2>/gi)].map(m=>strip(m[1])),
  images:[{src:`../assets/images/photos/${p.image}`,alt:p.alt}],
  commercialCategories:[...h.matchAll(/<h3>([^<]+)<\/h3><p>[^<]*<\/p><b>See current options/gi)].map(m=>strip(m[1]))
 };
});
const paths=new Set(fresh.map(x=>x.path));
const all=[...prior.pages.filter(x=>!paths.has(x.path)),...fresh].sort((a,b)=>a.path.localeCompare(b.path));
const out={date:'2026-11-01',stage:'post-publication',pageCount:all.length,pages:all};
if(out.pageCount!==200)throw Error(`Expected 200 HTML documents after exactly three additions, found ${out.pageCount}`);
writeFileSync(resolve(root,'reports/inventory-2026-11-01.json'),JSON.stringify(out,null,2)+'\n');
console.log(`Inventory records ${out.pageCount} HTML documents after exactly three additions.`);
