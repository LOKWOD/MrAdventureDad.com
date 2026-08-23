import { readdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { relative, resolve } from "node:path";

const root = resolve(process.argv[2] || ".");
const tag = "mradventuredad-20";
const markerStart = "<!-- MAD AFFILIATE COMMERCE -->";
const markerEnd = "<!-- END MAD AFFILIATE COMMERCE -->";
const skipDirectories = new Set([".git", "node_modules", ".wrangler"]);

const catalog = {
  daytrip: [
    ["family day trip backpack", "Family day-trip pack", "A comfortable pack keeps water, layers, snacks and small emergencies together."],
    ["insulated water bottle kids leakproof", "Leak-resistant water bottles", "Easy-to-carry bottles make regular water breaks less of a production."],
    ["family first aid kit travel compact", "Compact family first-aid kit", "Keep one organized kit where an adult can reach it quickly."],
  ],
  camping: [
    ["family camping tent easy setup", "Easy-setup family tent", "Compare packed size, weather protection and a setup you can manage before dark."],
    ["rechargeable camping lantern family", "Rechargeable camp lantern", "Area lighting is more useful around camp than another handheld flashlight."],
    ["self inflating camping sleeping pad", "Comfortable sleeping pads", "A better night usually matters more than adding another camp gadget."],
  ],
  water: [
    ["waterproof dry bag family beach kayak", "Waterproof dry bag", "Separate phones, keys and dry layers from the wet side of the day."],
    ["coast guard approved life jacket kids", "Properly fitted life jackets", "Match the device to the wearer, activity and current safety requirements."],
    ["beach wagon all terrain collapsible", "Collapsible beach wagon", "One organized load-in can save several hot walks back to the car."],
  ],
  trail: [
    ["hiking daypack family hydration", "Family hiking daypack", "Prioritize fit, reachable water and room for layers rather than maximum capacity."],
    ["rechargeable headlamp outdoor hiking", "Rechargeable headlamps", "Hands-free backup light belongs in the pack even on a daytime start."],
    ["compact hiking first aid kit", "Trail first-aid kit", "Choose a compact kit and learn what is inside before you need it."],
  ],
  road: [
    ["car trunk organizer family road trip", "Road-trip trunk organizer", "A few fixed zones keep arrival gear and emergency supplies reachable."],
    ["portable jump starter power bank car", "Portable jump starter", "Compare battery capacity, clamps, storage temperature and vehicle compatibility."],
    ["car emergency kit roadside family", "Family roadside kit", "Build around the climate, route and vehicle rather than a giant mystery bundle."],
  ],
  winter: [
    ["winter car emergency blanket family", "Winter emergency blankets", "Pack warmth for stopped time, not just the temperature inside a running car."],
    ["rechargeable hand warmers", "Rechargeable hand warmers", "Useful backup warmth for cold fingers during long outdoor waits."],
    ["compact snow shovel car", "Compact car snow shovel", "Keep it accessible after the vehicle is loaded, not under every suitcase."],
  ],
  bike: [
    ["bike repair kit portable pump tire levers", "Portable bike repair kit", "Carry only tools that fit the family bikes and that an adult knows how to use."],
    ["kids bicycle helmet adjustable", "Adjustable youth bike helmets", "Fit and current safety standards matter more than color or accessories."],
    ["bike water bottle cage kids", "Bike hydration setup", "Make drinking easy enough that children actually do it before they are tired."],
  ],
  fishing: [
    ["kids fishing rod combo beginner", "Beginner fishing combo", "A simple, correctly sized setup leaves more attention for safety and patience."],
    ["youth life jacket coast guard approved", "Youth life jacket", "Select by weight, fit, activity and current labeling—not age alone."],
    ["small fishing tackle box organizer", "Small tackle organizer", "A limited, orderly kit is easier to supervise around children."],
  ],
  cooler: [
    ["insulated soft cooler family day trip", "Soft day-trip coolers", "Best for one family meal, a short carry and easy storage after lunch."],
    ["hard cooler family road trip", "Hard coolers for car-base days", "Compare loaded weight, exterior dimensions, cleaning access and real cargo-space fit."],
    ["backpack cooler insulated leak resistant", "Backpack coolers", "Prioritize carry comfort, cleanability and the maker's exact leak-resistance claim."],
    ["refrigerator cooler thermometer", "Cooler thermometers", "An actual temperature is more useful than guessing from how the lid feels."],
  ],
  core: [
    ["family adventure backpack", "Grab-and-go adventure pack", "Keep the repeat-use basics together so leaving takes less work."],
    ["insulated soft cooler family day trip", "Day-trip soft cooler", "A practical cooler protects lunch without taking over the whole cargo area."],
    ["portable power bank rugged", "Portable power bank", "Reserve phone power for navigation, tickets, weather and emergencies."],
  ],
};

function htmlEscape(value) {
  return String(value).replaceAll("&", "&amp;").replaceAll('"', "&quot;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");
}

function amazonUrl(query) {
  return `https://www.amazon.com/s?k=${encodeURIComponent(query)}&tag=${tag}`;
}

function chooseCatalog(path, text) {
  const title = /<title[^>]*>([\s\S]*?)<\/title>/i.exec(text)?.[1] || "";
  const haystack = `${path} ${title}`.toLowerCase();
  if (/cooler/.test(haystack)) return catalog.cooler;
  if (/bike|bicycle|cycling/.test(haystack)) return catalog.bike;
  if (/fish|angling|tackle/.test(haystack)) return catalog.fishing;
  if (/winter|snow|ski|cold/.test(haystack)) return catalog.winter;
  if (/beach|lake|water|kayak|paddl|swim|island/.test(haystack)) return catalog.water;
  if (/camp|tent|sleeping bag/.test(haystack)) return catalog.camping;
  if (/hik(e|ing)|trail|waterfall|adirondack/.test(haystack)) return catalog.trail;
  if (/road.trip|packing|car kit|amusement/.test(haystack)) return catalog.road;
  return catalog.daytrip;
}

function productsFor(path, text) {
  const normalized = path.replaceAll("\\", "/").toLowerCase();
  if (["privacy.html", "about.html", "404.html"].includes(normalized)) return null;
  if (["guides/chimney-bluffs-with-kids.html", "guides/green-lakes-state-park-with-kids.html"].includes(normalized)) return null;
  if (normalized === "gear.html") return [...catalog.camping.slice(0, 2), ...catalog.trail.slice(0, 2), ...catalog.road.slice(0, 2)];
  if (normalized === "outdoors.html") return [...catalog.trail, catalog.water[0]];
  if (normalized === "adventures.html" || normalized === "index.html") return [...catalog.daytrip, catalog.core[2]];
  if (normalized === "weekend-august-22-23-2026.html" || normalized.startsWith("guides/")) return chooseCatalog(normalized, text);
  return null;
}

function moduleHtml(products) {
  const cards = products.map(([query, title, note]) => `
      <a class="commerce-card" href="${htmlEscape(amazonUrl(query))}" target="_blank" rel="sponsored nofollow noopener noreferrer" data-commercial-link="true" data-affiliate-active="true" data-affiliate-network="amazon" data-affiliate-tag="${tag}">
        <span>COMPARE ON AMAZON</span><h3>${htmlEscape(title)}</h3><p>${htmlEscape(note)}</p><b>See current options →</b>
      </a>`).join("");
  return `${markerStart}
  <section class="commerce-module" aria-labelledby="mad-commerce-heading">
    <p class="commerce-kicker">THE USEFUL STUFF</p>
    <h2 id="mad-commerce-heading">Gear that removes friction.</h2>
    <p class="commerce-intro">These are practical categories to compare—not a reason to overpack. Check fit, specifications and current reviews before buying.</p>
    <p class="affiliate-disclosure"><strong>Paid links:</strong> As an Amazon Associate I earn from qualifying purchases. You pay no additional cost.</p>
    <div class="commerce-grid">${cards}
    </div>
  </section>
  ${markerEnd}`;
}

function htmlFiles(directory) {
  const files = [];
  for (const entry of readdirSync(directory)) {
    if (skipDirectories.has(entry)) continue;
    const path = resolve(directory, entry);
    const stat = statSync(path);
    if (stat.isDirectory()) files.push(...htmlFiles(path));
    else if (entry.toLowerCase().endsWith(".html")) files.push(path);
  }
  return files;
}

let changed = 0;
let links = 0;
for (const file of htmlFiles(root)) {
  const path = relative(root, file).replaceAll("\\", "/");
  const original = readFileSync(file, "utf8");
  const cleaned = original.replace(new RegExp(`${markerStart}[\\s\\S]*?${markerEnd}\\s*`, "g"), "");
  const products = productsFor(path, cleaned);
  if (!products) continue;
  if (!/<\/main>/i.test(cleaned)) throw new Error(`Missing </main> in ${path}`);
  const depth = path.split("/").length - 1;
  const stylesheet = `<link rel="stylesheet" href="${"../".repeat(depth)}assets/css/affiliate-commerce.css">`;
  const withStyles = cleaned.includes("affiliate-commerce.css") ? cleaned : cleaned.replace(/<\/head>/i, `${stylesheet}</head>`);
  const next = withStyles.replace(/<\/main>/i, `${moduleHtml(products)}\n</main>`);
  writeFileSync(file, next);
  changed += 1;
  links += products.length;
}

console.log(`Mr Adventure Dad affiliate commerce: ${changed} revenue page(s), ${links} tagged link(s), tag=${tag}`);
