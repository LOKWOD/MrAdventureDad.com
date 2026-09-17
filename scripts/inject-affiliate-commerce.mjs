import { readdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { relative, resolve } from "node:path";

const root = resolve(process.argv[2] || ".");
const onlyPath = process.argv[3]?.replaceAll("\\", "/");
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
  bikehelmets: [
    ["kids bicycle helmet CPSC certified", "Youth bicycle helmets", "Confirm the CPSC bicycle label, current head measurement, shell shape and return terms for the exact child."],
    ["kids extended coverage bicycle helmet", "Extended-coverage youth bike helmets", "Compare current certification, usable size range, rear coverage, ventilation and the manufacturer’s intended riding use."],
    ["kids multi sport helmet CPSC ASTM F1492", "Dual-certified youth bike-and-skate helmets", "Require visible labeling for every intended activity; the words multi-sport alone do not prove dual certification."],
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
  rain: [
    ["kids waterproof rain jacket hood", "Kids' waterproof rain jackets", "Compare hood visibility, layer room, cuff fit, seam construction and the maker's exact waterproof claim."],
    ["adult packable waterproof rain shell", "Packable adult rain shells", "Prioritize loaded fit, ventilation and verified construction over the smallest packed bundle."],
    ["reusable rain poncho family", "Reusable family rain ponchos", "Useful for quick event coverage when loose fabric will not create a snag or trip hazard."],
  ],
  radio: [
    ["rechargeable FRS walkie talkies family", "Rechargeable FRS radios", "Compare control lock, charging method, certified radio service and a size children can actually manage."],
    ["water resistant FRS walkie talkies", "Weather-resistant FRS radios", "Verify the exact ingress rating and charging-cover design instead of trusting the word outdoor."],
    ["FRS walkie talkies replaceable batteries", "Replaceable-battery FRS radios", "Useful when a long weekend needs a spare-cell fallback instead of another proprietary charging cradle."],
  ],
  sun: [
    ["broad spectrum sunscreen SPF 30 family", "Broad-spectrum family sunscreen", "Read the Drug Facts label, water-resistance time and reapplication directions instead of buying by scent or package size."],
    ["kids UPF 50 long sleeve sun shirt", "Kids' UPF sun shirts", "Compare coverage, wet comfort, care instructions and the maker's stated UPF rating."],
    ["portable sun shade canopy family beach", "Portable family shade", "Check the packed size, anchoring method, wind limits and whether the destination allows it."],
  ],
  lighting: [
    ["rechargeable headlamp lock mode hiking", "Rechargeable headlamps", "Compare fit, a real lock mode, low-output control, charge-port design and the maker's runtime table."],
    ["AAA headlamp hiking family", "Replaceable-battery headlamps", "A common-cell model can be easier to revive away from outlets; store matched spares separately and dry."],
    ["rechargeable camping lantern dimmable", "Dimmable camp lanterns", "Use area light at the table or tent, not as a substitute for the hands-free light each moving person needs."],
  ],
  power: [
    ["10000mAh USB C PD power bank", "10,000 mAh USB-C power banks", "Compare watt-hours, port output, device compatibility, size and the maker's current safety information."],
    ["dual port USB C PD car charger", "Dual-port USB-C car chargers", "A good fit when the vehicle is the base: verify socket clearance, output per port and cable compatibility."],
    ["short USB C charging cable durable", "Short USB-C charging cables", "Short, known-good cables reduce front-seat clutter; confirm the connector and power requirement for every device."],
  ],
  binoculars: [
    ["8x32 binoculars wide field waterproof", "Family-friendly 8x32 binoculars", "Compare minimum eye spacing, field of view, eye relief, weight and the maker's exact waterproofing claim."],
    ["8x42 binoculars bird watching wide field", "Adult-shared 8x42 binoculars", "A brighter full-size option when an adult carries it; verify the child's grip and merged view before keeping it."],
    ["8x25 compact binoculars kids nature", "Compact 8x25 binoculars", "Choose low weight only after checking focus-wheel access, eye spacing, field of view and return terms."],
  ],
  travelgames: [
    ["family card games travel compact", "Compact family card games", "Favor quick setup, rules the whole table understands and a case that closes securely."],
    ["magnetic travel board games kids", "Magnetic travel board games", "Compare the closure, piece storage, magnet strength and the maker's current age guidance."],
    ["reusable activity book travel kids", "Reusable travel activity books", "Check the age fit, included marker, cleanability and whether the format works in your actual travel space."],
  ],
  travelbags: [
    ["rolling carry on luggage family travel", "Rolling carry-on luggage", "Compare the external dimensions, loaded weight, wheel clearance and every carrier's current limits."],
    ["weekender duffel bag travel", "Weekend travel duffels", "Look for a comfortable loaded carry, a stable opening and dimensions that fit the actual trunk or luggage rack."],
    ["travel backpack carry on panel opening", "Carry-on travel backpacks", "Prioritize torso fit, strap comfort, panel access and the strictest carrier or venue rule on the trip."],
  ],
  hearingprotection: [
    ["kids hearing protection earmuffs NRR", "Youth hearing-protection earmuffs", "Compare the labeled NRR, cup dimensions, headband adjustment and seal on the actual child."],
    ["reusable musician earplugs NRR", "Labeled reusable earplugs", "Check the size range, insertion method, cleaning instructions and real NRR rather than a vague noise-reducing claim."],
    ["foam earplugs NRR travel case", "Labeled foam earplugs", "Choose clean, individually stored plugs only for users who can insert and wear them correctly."],
  ],
  seating: [
    ["water resistant picnic blanket foldable", "Foldable picnic blankets", "Compare open size, packed shape, underside material, care instructions and the maker's exact moisture-resistance claim."],
    ["folding camp chair lightweight adult", "Folding camp chairs", "Check stated capacity, seat height, packed length, total weight, locking points and foot shape before buying a set."],
    ["padded stadium seat bleacher back support", "Padded stadium seats", "Verify width, attachments and the exact venue policy before choosing a bleacher seat with a back."],
  ],
  wagons: [
    ["folding utility wagon cargo", "Cargo-only folding utility wagons", "Confirm the maker permits the intended load, then compare folded size, loaded control, wheel type and the destination rule."],
    ["folding wagon stroller child restraint", "Child-approved folding wagons", "Require explicit passenger approval, current age and fit guidance, required restraints, brake instructions and a clean recall check."],
    ["folding utility cart large wheels", "Folding utility carts with larger wheels", "Match wheels to the real surface and measure the folded cart against the loaded vehicle before buying."],
  ],
  tireinflators: [
    ["12V portable tire inflator auto shutoff", "12-volt portable tire inflators", "Verify outlet current, fuse, cord reach, hose reach, duty cycle and the vehicle maker's operating instructions."],
    ["cordless tire inflator removable battery", "Cordless tire inflators", "Compare battery compatibility, storage limits, charge-state visibility, duty cycle and a separate pressure-gauge check."],
    ["digital tire pressure gauge vehicle", "Tire-pressure gauges", "Use the vehicle placard for the target and a separate gauge to verify pressure instead of trusting auto-stop alone."],
  ],
  jumpstarters: [
    ["12V lithium vehicle jump starter UL 2743", "Lithium vehicle jump starters", "Verify the exact vehicle voltage, supported engine, clamp reach, storage range, certification and the manufacturer’s recharge instructions."],
    ["portable jump box vehicle battery booster", "Larger portable jump boxes", "Compare battery chemistry, loaded weight, cable reach, charge-state display, service path and vehicle compatibility."],
    ["heavy duty jumper cables pure copper", "Heavy-duty jumper cables", "Confirm conductor material, gauge, length, clamp geometry and that both vehicle manuals permit the donor procedure."],
  ],
  boosterseats: [
    ["high back belt positioning booster seat", "High-back belt-positioning booster seats", "Compare child limits, shoulder-belt guide, vehicle head-restraint rules, width and exact instructions in the seating position."],
    ["backless belt positioning booster seat", "Backless belt-positioning booster seats", "Use only when the child is booster-ready and the vehicle provides the head support and belt geometry required by the seat."],
    ["combination harness booster car seat", "Harness-to-booster combination seats", "Check harness and booster limits separately, top-tether instructions, vehicle fit and the child's readiness for each mode."],
  ],
  trackers: [
    ["bluetooth item tracker luggage backpack", "Bluetooth item trackers", "Choose for a backpack or other item, then verify phone ecosystem, attachment, battery and unwanted-tracker protections."],
    ["kids GPS watch cellular location", "Cellular GPS watches", "Compare service, coverage, charging, age and fit guidance, school rules, privacy and the limits of emergency features."],
    ["reusable kids ID wristband contact", "Reusable child ID wristbands", "Use minimal contact information, check fit and durability, and keep the practiced family separation plan primary."],
  ],
  roofcargo: [
    ["roof cargo box universal crossbars", "Hard rooftop cargo boxes", "Verify the exact vehicle, roof, crossbars, bar spacing, hatch clearance and every published load limit before choosing a box."],
    ["waterproof rooftop cargo bag crossbars", "Soft rooftop cargo bags", "Compare the maker's required rack or bare-roof method, seam and closure claims, loaded dimensions, restraints and vehicle compatibility."],
    ["roof cargo basket crossbars", "Open rooftop cargo baskets", "Choose only after checking crossbar fit, carrier weight, restraint points, weather exposure and the vehicle's total carrying capacity."],
  ],
  hikingfootwear: [
    ["kids trail running shoes hiking", "Kids’ trail-running shoes", "Compare current size guidance, heel security, toe room, outsole, weight and return terms for the actual child."],
    ["kids hiking shoes waterproof", "Kids’ hiking shoes", "Check width, closure, tread, drying time and the maker’s exact water-protection claim rather than choosing by ankle height."],
    ["kids hiking boots waterproof", "Kids’ hiking boots", "Use a taller boot only when its added coverage, structure and weather protection solve a real route problem and the fit works now."],
  ],
  trekkingpoles: [
    ["kids adjustable trekking poles hiking", "Adjustable trekking poles for kids", "Verify the minimum usable length, grip size, lock security, section markings and current return terms for the actual child."],
    ["youth aluminum trekking poles adjustable", "Youth aluminum trekking poles", "Compare usable range, pair weight, lock type, replacement tips and the manufacturer’s inspection instructions."],
    ["compact folding trekking poles", "Compact folding trekking poles", "Choose folding construction only after confirming the seated connections, tension system, packed length and child-sized usable range."],
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
  if (/booster seat|high.back.*backless|harness.*booster/.test(haystack)) return catalog.boosterseats;
  if (/kids.*bike helmet|bicycle helmet.*fit|helmet.*certification/.test(haystack)) return catalog.bikehelmets;
  if (/kids.*trekking poles|adjustable.*fixed.*folding/.test(haystack)) return catalog.trekkingpoles;
  if (/kids.*hiking footwear|trail runner.*hiking shoe.*boot/.test(haystack)) return catalog.hikingfootwear;
  if (/roof cargo|cargo box|rooftop bag|cargo basket/.test(haystack)) return catalog.roofcargo;
  if (/tire inflator|portable inflator|foot pump|pressure gauge/.test(haystack)) return catalog.tireinflators;
  if (/jump starter|jump pack|jump box|jumper cable|battery booster/.test(haystack)) return catalog.jumpstarters;
  if (/location tracker|bluetooth tag|gps watch|item tracker/.test(haystack)) return catalog.trackers;
  if (/folding wagon|utility wagon|wagon guide|utility cart/.test(haystack)) return catalog.wagons;
  if (/picnic seating|camp chair|stadium seat|blanket vs chair/.test(haystack)) return catalog.seating;
  if (/hearing protection|earmuff|earplug/.test(haystack)) return catalog.hearingprotection;
  if (/travel bag|rolling carry|duffel|luggage/.test(haystack)) return catalog.travelbags;
  if (/travel game|card game|magnetic game|activity book/.test(haystack)) return catalog.travelgames;
  if (/power bank|car charger|phone power/.test(haystack)) return catalog.power;
  if (/binocular|bird watching optics/.test(haystack)) return catalog.binoculars;
  if (/headlamp|flashlight|lantern|family lighting/.test(haystack)) return catalog.lighting;
  if (/sun protection|sunscreen|\bupf\b|sun shade/.test(haystack)) return catalog.sun;
  if (/rain|poncho|waterproof shell/.test(haystack)) return catalog.rain;
  if (/walkie|two.way radio|\bfrs\b|\bgmrs\b/.test(haystack)) return catalog.radio;
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
  if (normalized.startsWith("weekend-")) return null;
  if (["guides/chimney-bluffs-with-kids.html", "guides/green-lakes-state-park-with-kids.html", "guides/taughannock-falls-with-kids.html", "guides/beaver-lake-nature-center-with-kids.html", "guides/watkins-glen-with-kids.html", "guides/letchworth-state-park-with-kids.html", "guides/fort-ontario-with-kids.html", "guides/family-hotel-room-system.html", "guides/howe-caverns-with-kids.html", "guides/family-lost-kid-plan.html", "guides/montezuma-national-wildlife-refuge-with-kids.html", "guides/family-motion-sickness-car-plan.html", "guides/chittenango-falls-with-kids.html", "guides/family-museum-day-system.html", "guides/rosamond-gifford-zoo-with-kids.html", "guides/family-outdoor-weather-cutoff-plan.html", "guides/clark-reservation-state-park-with-kids.html", "guides/family-bathroom-stop-plan.html", "guides/most-syracuse-with-kids.html", "guides/family-parking-lot-plan.html", "guides/highland-forest-with-kids.html", "guides/pratts-falls-with-kids.html", "guides/multigenerational-family-day-trip-plan.html", "guides/fort-stanwix-with-kids.html", "guides/family-no-cell-service-day-trip-plan.html", "guides/erie-canal-museum-with-kids.html", "guides/family-roadside-breakdown-plan.html", "guides/harriet-tubman-national-historical-park-with-kids.html", "guides/family-tick-check-removal-plan.html", "guides/womens-rights-national-historical-park-with-kids.html", "guides/family-hotel-fire-escape-plan.html"].includes(normalized)) return null;
  if (normalized === "gear.html") return [...catalog.camping.slice(0, 2), ...catalog.trail.slice(0, 2), ...catalog.road.slice(0, 2)];
  if (normalized === "outdoors.html") return [...catalog.trail, catalog.water[0]];
  if (normalized === "adventures.html" || normalized === "index.html") return [...catalog.daytrip, catalog.core[2]];
  if (normalized.startsWith("guides/")) return chooseCatalog(normalized, text);
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
  if (onlyPath && path !== onlyPath) continue;
  const original = readFileSync(file, "utf8");
  const cleaned = original.replace(new RegExp(`${markerStart}[\\s\\S]*?${markerEnd}\\s*`, "g"), "");
  // Several early guides and the gear hub have hand-curated commerce modules.
  // Preserve those exact modules instead of stacking a generated block below them.
  const products = /class=["']commerce-module["']/.test(cleaned) ? null : productsFor(path, cleaned);
  if (!products) {
    if (cleaned !== original) writeFileSync(file, cleaned);
    continue;
  }
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
