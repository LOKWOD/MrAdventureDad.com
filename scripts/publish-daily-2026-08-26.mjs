import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";

const root = resolve(process.argv[2] || ".");
const published = "2026-08-26";
const site = "https://mradventuredad.com";
const header = `<header class="site-header"><a class="brand" href="../index.html"><span class="brand-mark">MAD</span><span>MR <b>ADVENTURE</b> DAD</span></a><button class="menu-toggle" aria-label="Open navigation">☰</button><nav class="nav" aria-label="Primary navigation"><a href="../adventures.html">Adventures</a><a href="../destinations.html">Destinations</a><a href="../outdoors.html">Outdoors</a><a href="../gear.html">Gear</a><a href="../about.html">About</a></nav></header>`;
const footer = `<footer><div class="wrap copyright">© <span id="year"></span> Mr Adventure Dad. <a href="../index.html">Home</a> · <a href="../privacy.html">Privacy</a></div></footer>`;

const pages = [
  {
    path: "guides/watkins-glen-with-kids.html",
    title: "Watkins Glen With Kids: The Gorge-First Plan That Respects the Stairs",
    description: "A realistic Watkins Glen State Park family plan with the Gorge Trail, stairs, shuttle, 2026 pool hours and fees, parking, pets, accessibility, weather and backups.",
    eyebrow: "FINGER LAKES · STAIR-HEAVY FAMILY DAY",
    dek: "Walk the gorge while legs and patience are fresh, use the shuttle as a tool instead of a promise, and do not turn a waterfall into an endurance contest.",
    image: "assets/images/watkins-glen-family-plan.svg",
    alt: "Conceptual Watkins Glen family itinerary showing an early gorge walk, a stair checkpoint, an optional shuttle and a pool-or-exit decision",
    schemaType: ["Article", "Guide"],
    body: `
<div class="note"><strong>The blunt version:</strong> Watkins Glen is spectacular, but the famous part is not an easy stroller walk. The Gorge Trail packs 19 waterfalls into a one-mile stretch and includes many wet stone steps. A good family day starts early at the lower entrance, climbs only while the group is moving well, and treats the seasonal shuttle as an optional way to reduce backtracking—not as permission to push a tired child farther uphill.</div>
<h2>Who this day fits—and who should skip it</h2>
<p><strong>Good fit:</strong> school-age kids who can follow directions near drop-offs, manage uneven wet steps and stay with an adult in a crowded gorge. <strong>Skip or simplify:</strong> families that need a stroller route, anyone with balance or stair limitations, children who bolt, groups arriving during active thunderstorms, or anyone bringing a pet and expecting to use the Gorge Trail.</p>
<p>New York State Parks does not publish a simple age or height minimum for the trail. That does not make it appropriate for every child. The meaningful test is controlled movement on long stair sequences, not a birthday. If the group needs an easier waterfall walk, use the <a href="taughannock-falls-with-kids.html"><strong>Taughannock family plan</strong></a> instead.</p>
<h2>Current facts to check before leaving</h2>
<ul>
<li><strong>Address:</strong> the lower entrance and visitor center are at 1009 N. Franklin Street, Watkins Glen, NY 14891. The official page also lists campground and upper entrances.</li>
<li><strong>Drive:</strong> plan roughly 1 hour 25 minutes to 1 hour 50 minutes from the Syracuse area, depending on your start, traffic and route. That is a planning estimate; check navigation on departure.</li>
<li><strong>Hours:</strong> the park is open year-round dawn to dusk. The Gorge Trail opened May 9 for the 2026 season and normally closes around mid-October; rim trails remain the year-round option.</li>
<li><strong>Vehicle fee:</strong> the official 2026 page lists $10 per vehicle when collected, including pool access. Collection is listed sunrise to sunset from mid-May to mid-October.</li>
<li><strong>Shuttle:</strong> $6 per person each way. For 2026 it is listed daily June 28 through September 7, then weekends through the mid-October trail season. Operations and space can change; call before building the day around it.</li>
<li><strong>Pool:</strong> the posted 2026 season is June 27 through September 7, noon–5:45 p.m. weekdays and 11:30 a.m.–6:45 p.m. weekends. Confirm same-day operation with the park.</li>
<li><strong>Reservations:</strong> ordinary day use does not list a reservation requirement. Camping is by reservation through ReserveAmerica.</li>
<li><strong>Pets:</strong> pets are not allowed on the Gorge Trail. Up to two pets may be allowed in other day-use or camping areas under the posted leash, supervision and rabies-document rules, with additional exclusions.</li>
</ul>
<h2>The family itinerary that avoids the worst mistake</h2>
<h3>8:30 a.m. — Lower entrance, restroom, conditions</h3>
<p>Arrive before the main crowd, use the restroom and read every current closure and shuttle notice. Photograph the official map. Ask staff whether the entire Gorge Trail, upper exits and shuttle are operating. If the answer changes the plan, change the plan before the kids see the first waterfall.</p>
<h3>8:45 a.m. — Gorge first</h3>
<p>Enter only if the trail is open and conditions feel stable. Keep one adult in front and one behind when possible. The goal is not a mile count; it is a controlled climb through the best scenery. Stop where the path widens safely, not in a stair lane or under a dripping overhang where another group must squeeze around you.</p>
<h3>9:30 a.m. — The stair checkpoint</h3>
<p>Ask three questions: Are feet still controlled? Is anyone grabbing the wall because balance is fading? Can the group descend safely if the shuttle disappears? If one answer is bad, turn around. The return requires attention too. Do not spend every usable step on the climb.</p>
<h3>10:30 a.m. — Choose the exit</h3>
<p><strong>Option A:</strong> descend the route you know before it becomes crowded. <strong>Option B:</strong> continue to an open entrance only after confirming the shuttle is actually running and everyone can manage the remaining trail. <strong>Option C:</strong> use a rim connection shown on the current official map, understanding that it does not erase distance or elevation.</p>
<h3>Noon — Food before the second act</h3>
<p>Use a designated picnic area or a planned food stop. The park lists food as an amenity, but operating hours and selection are not a family nutrition plan. Bring water and a simple lunch in the car. Use the <a href="family-day-trip-cooler-guide.html"><strong>day-trip cooler guide</strong></a> if perishables are involved.</p>
<h3>1:00 p.m. — Pool, playground or exit</h3>
<p>If the pool is open, the weather is good and the kids still have judgment, swimming can be the second act. Bring suits and dry clothes but do not promise the pool before verifying it. The smarter alternative is a short playground stop or leaving. A successful gorge morning does not need four more attractions attached to it.</p>
<h2>What to pack</h2>
<ul><li>Closed-toe shoes with useful wet-surface traction; no loose slides for the gorge.</li><li>Water, simple food, required medication and compact first aid.</li><li>A light layer and a fully dry change of socks and clothes in the car.</li><li>Sun protection for exposed sections and rain gear that does not block a child's view of the steps.</li><li>A charged phone, current map screenshot and enough payment flexibility for parking or shuttle changes.</li><li>Swim gear only if the pool is part of the verified plan.</li></ul>
<p>The <a href="family-hiking-daypack-guide.html"><strong>family hiking daypack guide</strong></a> keeps the load realistic. The new <a href="family-sun-protection-guide.html"><strong>family sun-protection system</strong></a> covers shade, clothing and sunscreen without pretending one product solves the whole day.</p>
<h2>Food, restrooms and accessibility</h2>
<p>Use entrance facilities before committing to the gorge; do not assume a restroom will appear at the exact moment a child needs it. New York State Parks directs visitors to call the park at 607-535-4511 for current accessibility information. The state also warns that the gorge tour includes many stone steps and can be difficult for some visitors.</p>
<p>The lower visitor area, upper day-use facilities and pool are different access questions from the Gorge Trail. Call about the exact parking, restroom, pool and trail access your family needs. A stroller-friendly entrance does not make the gorge stroller-friendly.</p>
<h2>Weather, water and hard safety boundaries</h2>
<p>Wet stone is normal here; rushing is optional. Stay on open paths, obey barriers and keep hands available for balance. Do not enter Glen Creek or climb toward waterfalls. A photograph is not worth leaving the maintained route.</p>
<p>If thunder is audible, the gorge, a rock overhang and a picnic shelter are not safe shelters. Move to a substantial building or enclosed hard-topped vehicle and follow National Weather Service guidance to wait at least 30 minutes after the last thunder. If heavy rain, flooding concerns or closures appear, use the rim or leave. Rain gear changes comfort, not hydrology.</p>
<h2>Kid-meltdown and bad-weather backups</h2>
<p><strong>Early fade:</strong> turn around, eat, and call the main waterfall the win. <strong>Shuttle unavailable:</strong> descend before fatigue; do not argue with the schedule. <strong>Gorge closed:</strong> walk only the open rim segment your group can handle, use day-use facilities, or leave for a different day. <strong>Storm:</strong> shelter in the vehicle and abandon the gorge if the safe weather window does not return.</p>
<p>The <a href="family-day-trip-system.html"><strong>family day-trip system</strong></a> is built for this exact decision: preserve the family, not the itinerary. If rain is the only problem, consult the <a href="family-rain-gear-guide.html"><strong>rain-gear guide</strong></a>; if thunder is the problem, go inside.</p>
<h2>Official check-before-you-go sources</h2>
<p>Operational details were checked August 26, 2026 and are volatile. Verify trail status, shuttle, pool, fees, parking, pets and accessibility on the day of travel.</p>
<ul><li><a href="https://parks.ny.gov/visit/state-parks/watkins-glen-state-park" rel="noopener">New York State Parks: Watkins Glen State Park</a></li><li><a href="https://parks.ny.gov/visit/state-parks/watkins-glen-state-park#maps" rel="noopener">New York State Parks: maps and documents</a></li><li><a href="https://www.weather.gov/safety/lightning-tips" rel="noopener">National Weather Service: lightning safety</a></li></ul>`
  },
  {
    path: "guides/family-sun-protection-guide.html",
    title: "Family Sun Protection: Sunscreen vs UPF Clothing vs Shade",
    description: "Build a family sun-protection system using the UV Index, timing, shade, clothing, hats, sunglasses and correctly labeled sunscreen—with honest buying tradeoffs.",
    eyebrow: "GEAR SYSTEM · SUN AND HEAT",
    dek: "Stop asking one bottle to cover every failure. Time, shade and clothing do most of the structural work; sunscreen covers the exposed gaps.",
    image: "assets/images/family-sun-protection-stack.svg",
    alt: "Family sun-protection framework stacking trip timing, shade, protective clothing, hats, sunglasses and sunscreen",
    schemaType: ["Article", "WebPage"],
    body: `
<div class="note"><strong>The blunt version:</strong> sunscreen is not the whole plan. A durable family system starts with the UV Index and trip timing, adds reliable shade and clothing, then uses broad-spectrum sunscreen on exposed skin exactly as the label directs. Buy the missing layer—not three versions of the layer you already have.</div>
<h2>Who needs this system—and who should skip the shopping</h2>
<p><strong>Use it:</strong> any family spending sustained time outside, especially near water, sand or snow, where reflected radiation can increase exposure. <strong>Skip the purchase:</strong> families that already own suitable hats, tightly woven or UPF clothing, shade and an unexpired sunscreen the kids will tolerate. Organizing existing gear is a valid solution.</p>
<p>This is general planning information, not individualized medical advice. Ask a clinician about infants under six months, medication-related sun sensitivity, allergies, significant skin conditions or a prior serious reaction.</p>
<h2>Start with the UV Index, not the temperature</h2>
<p>The EPA's UV Index forecasts expected ultraviolet intensity on a scale from 1 to 11+. Heat and UV are different hazards: a cool clear day can still carry meaningful UV exposure. CDC guidance says protection is needed when the index is 3 or higher. Check the location and the hours you will actually be outside, then shorten or move the exposed part of the day when practical.</p>
<p>For beach, trail and park days, put the most exposed activity earlier, schedule lunch in real shade, and make the second half optional. The <a href="family-day-trip-system.html"><strong>family day-trip system</strong></a> already uses energy and weather checkpoints; sun protection belongs inside those checkpoints, not as a last-minute spray in the parking lot.</p>
<h2>The four-layer decision framework</h2>
<h3>Layer 1 — Timing</h3>
<p>FDA guidance advises limiting time in the sun, especially from 10 a.m. to 2 p.m.; EPA's broader planning guidance emphasizes 10 a.m. to 4 p.m. Use those windows as warnings, not a reason to cancel every summer day. Move the long hike, open-water time or metal-bleacher stretch away from solar midday when possible.</p>
<h3>Layer 2 — Shade</h3>
<p>Choose fixed shade first because it cannot blow away. A permitted canopy or umbrella can create a reliable base at a beach or field, but it needs the correct anchors, enough room and a real wind limit. Shade reduces exposure; it does not eliminate reflected or scattered UV, so clothing and sunscreen still matter.</p>
<h3>Layer 3 — Clothing, hats and sunglasses</h3>
<p>Tightly woven coverage is repeatable and does not need reapplication. A labeled UPF shirt can be useful for swimming, boating, all-day fields and children who resist repeated torso application. Check whether the manufacturer states how washing, stretching and wetting affect the rating. A broad-brim hat covers more than a baseball cap; if the child will only wear a cap, protect ears and neck another way.</p>
<p>For sunglasses, FDA recommends a UV400 rating or “100% UV protection.” Dark lenses alone do not prove UV protection, and toy sunglasses may not provide it.</p>
<h3>Layer 4 — Sunscreen on the gaps</h3>
<p>Choose a broad-spectrum product with at least SPF 15 and follow its Drug Facts directions. SPF 30 is a simple family default when the formula, label and skin tolerance fit, but a higher number does not cancel missed spots or skipped reapplication. Use a water-resistant product for swimming or sweating, and read whether the label specifies 40 or 80 minutes.</p>
<p>FDA says to apply liberally to exposed skin and reapply at least every two hours, more often after swimming or sweating and according to the label. No sunscreen is waterproof. Spray products may be flammable; follow the warning and keep them away from flame.</p>
<h2>Lotion, stick or spray?</h2>
<p><strong>Lotion or cream:</strong> easiest to see and spread over larger areas, but slower with impatient kids. <strong>Stick:</strong> tidy for faces and targeted reapplication, but multiple passes are needed for even coverage. <strong>Spray:</strong> fast for adults who can control application, yet wind, missed skin, inhalation concerns and flammability warnings make technique critical. Never let format marketing replace the Drug Facts label.</p>
<p>Do not invent homemade sunscreen. Do not buy by fragrance alone. Do not assume “mineral,” “natural,” “reef friendly” or a high SPF answers water resistance, broad-spectrum labeling, tolerance or destination rules. Compare the exact label.</p>
<h2>The trip-based buying decision</h2>
<ul><li><strong>Two-hour shaded park:</strong> existing clothing, hats and sunscreen may be enough. No canopy required.</li><li><strong>Beach or pool:</strong> UPF swim shirts reduce exposed area; add water-resistant sunscreen, eye protection and destination-approved shade.</li><li><strong>Open trail:</strong> prioritize breathable coverage, a stable hat and sunscreen that rides in the <a href="family-hiking-daypack-guide.html"><strong>family daypack</strong></a>.</li><li><strong>Amusement park or fair:</strong> pack a small reapplication kit and identify indoor or deeply shaded breaks before arrival.</li><li><strong>Snow day:</strong> exposed faces and reflected UV still matter; cold weather is not a UV shield.</li></ul>
<h2>The eight-minute departure protocol</h2>
<ol><li>Check the UV Index and forecast.</li><li>Move the most exposed activity if the timing is poor.</li><li>Dress children before screens, snacks or the car.</li><li>Apply sunscreen to exposed skin according to its label before sun exposure.</li><li>Pack the same product for reapplication; do not rely on remembering a different formula.</li><li>Add hats, sunglasses and a dry backup shirt.</li><li>Set one phone alarm tied to the label and activity, not a vague promise to remember.</li><li>Name the first shade and water break before leaving.</li></ol>
<h2>Food, water, restrooms and meltdown logistics</h2>
<p>Sun protection fails when adults are juggling lunch, bathrooms and a child who refuses to stand still. Apply before loading the car when the label allows, use the restroom on arrival, and schedule reapplication with food or a dry-clothes break. Keep sunscreen accessible rather than buried under the cooler.</p>
<p>Carry water and use the <a href="family-day-trip-cooler-guide.html"><strong>cooler guide</strong></a> for perishable food. Sun protection does not prevent heat illness. If a child becomes unusually weak, confused, faint, nauseated or stops acting normally, end the activity, move to a cooler place and seek appropriate medical help.</p>
<h2>Weather and kid-resistance backups</h2>
<p><strong>Hat refusal:</strong> use shade, clothing and exposed-skin sunscreen rather than turning the parking lot into a 20-minute argument. <strong>Sunscreen refusal:</strong> move to coverage and shade while addressing the reason; do not send bare skin into midday exposure to “teach a lesson.” <strong>Wind defeats the canopy:</strong> lower and remove it according to the manufacturer and destination rules; never let children hold it in gusts. <strong>Thunder:</strong> shade structures are not lightning shelters. Move to a substantial building or enclosed hard-topped vehicle.</p>
<p>The <a href="family-beach-day-system.html"><strong>family beach-day system</strong></a> shows where shade and dry-clothes breaks fit. The <a href="family-rain-gear-guide.html"><strong>rain-gear guide</strong></a> handles the opposite forecast without confusing comfort gear with storm safety.</p>
<h2>Commercial boundary and no-buy option</h2>
<p>The comparison links on this page use Mr Adventure Dad's approved Amazon Associate setup. They point to relevant categories, not claimed winners. We have not asserted hands-on testing, prices, stock, ratings, ingredient suitability, UPF durability, wind performance or medical superiority. Verify the exact product label, fit, instructions, recalls and destination rules.</p>
<p><strong>No-buy system:</strong> schedule earlier, use existing tightly woven coverage, choose built-in shade, wear verified sunglasses, and use an existing in-date broad-spectrum sunscreen as directed. Better behavior beats a premium bag of redundant gear.</p>
<h2>Official sources and check date</h2>
<p>Guidance was checked August 26, 2026. Product labels and public-health guidance can change.</p>
<ul><li><a href="https://www.fda.gov/consumers/consumer-updates/tips-stay-safe-sun-sunscreen-sunglasses" rel="noopener">FDA: sunscreen, sunglasses and sun-safety guidance</a></li><li><a href="https://www.cdc.gov/skin-cancer/sun-safety/index.html" rel="noopener">CDC: sun-safety facts</a></li><li><a href="https://www.epa.gov/sunsafety/uv-index-scale-0" rel="noopener">EPA: current UV Index scale</a></li><li><a href="https://www.weather.gov/safety/lightning-tips" rel="noopener">National Weather Service: lightning safety</a></li></ul>`
  }
];

function render(page) {
  const canonical = `${site}/${page.path}`;
  const schema = {"@context":"https://schema.org","@type":page.schemaType,headline:page.title,description:page.description,datePublished:published,dateModified:published,mainEntityOfPage:canonical,author:{"@type":"Organization",name:"Mr Adventure Dad"},publisher:{"@type":"Organization",name:"Mr Adventure Dad"},image:`${site}/${page.image}`};
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${page.title} | Mr Adventure Dad</title><meta name="description" content="${page.description}"><link rel="canonical" href="${canonical}"><meta property="og:type" content="article"><meta property="og:site_name" content="Mr Adventure Dad"><meta property="og:title" content="${page.title}"><meta property="og:description" content="${page.description}"><meta property="og:url" content="${canonical}"><meta property="og:image" content="${site}/${page.image}"><meta name="twitter:card" content="summary_large_image"><meta name="twitter:title" content="${page.title}"><meta name="twitter:description" content="${page.description}"><meta name="twitter:image" content="${site}/${page.image}"><meta property="article:published_time" content="${published}"><meta property="article:modified_time" content="${published}"><link rel="stylesheet" href="../assets/css/style.css"><script defer src="../assets/js/site.js"></script><script type="application/ld+json">${JSON.stringify(schema)}</script></head><body>${header}<main class="article"><p class="eyebrow">${page.eyebrow}</p><h1>${page.title}</h1><p class="dek">${page.dek}</p><figure><img class="article-hero" src="../${page.image}" alt="${page.alt}"><figcaption>Original editorial planning diagram—not a destination photograph, trail map, medical diagram or product image. Verify current conditions and exact product instructions.</figcaption></figure>${page.body}<section class="cta"><p class="kicker">MAKE THE WEEKEND COUNT</p><h2>Useful beats heroic.</h2><p>Pick the version your family can finish well, then leave enough energy for the ride home.</p><a class="btn" href="../adventures.html">More family plans</a></section></main>${footer}<script defer src="https://static.cloudflareinsights.com/beacon.min.js" data-cf-beacon='{"token":"538731cceb42422db0560ea6680ac375"}'></script></body></html>`;
}

for (const page of pages) {
  const file = resolve(root, page.path);
  mkdirSync(dirname(file), { recursive: true });
  writeFileSync(file, render(page));
}

const visuals = {
  "watkins-glen-family-plan.svg": `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1600 900" role="img" aria-labelledby="t d"><title id="t">Watkins Glen gorge-first family plan</title><desc id="d">A conceptual sequence from lower entrance to gorge walk, stair checkpoint, optional shuttle and pool or exit decision</desc><rect width="1600" height="900" fill="#eef3ed"/><text x="800" y="96" text-anchor="middle" font-family="Arial" font-size="62" font-weight="700" fill="#17211b">WATKINS GLEN: GORGE FIRST</text><text x="800" y="150" text-anchor="middle" font-family="Arial" font-size="28" fill="#385246">A family sequence—not a trail map.</text><path d="M130 675 C315 650 340 470 515 475 S735 620 900 470 S1140 280 1460 320" fill="none" stroke="#2f7d6a" stroke-width="24" stroke-linecap="round"/><g font-family="Arial" fill="#17211b"><circle cx="150" cy="670" r="58" fill="#f2c87b"/><text x="150" y="676" text-anchor="middle" font-size="26" font-weight="700">8:30</text><text x="85" y="770" font-size="30" font-weight="700">LOWER ENTRY</text><text x="85" y="812" font-size="24">restroom · notices · map</text><circle cx="515" cy="475" r="58" fill="#b9ddd2"/><text x="515" y="482" text-anchor="middle" font-size="27" font-weight="700">WALK</text><text x="375" y="365" font-size="31" font-weight="700">GORGE WHILE FRESH</text><text x="375" y="407" font-size="24">wet steps · close control</text><circle cx="900" cy="470" r="64" fill="#f0b36d"/><text x="900" y="461" text-anchor="middle" font-size="24" font-weight="700">STAIR</text><text x="900" y="491" text-anchor="middle" font-size="24" font-weight="700">CHECK</text><text x="760" y="590" font-size="24">turn around before form fades</text><circle cx="1260" cy="345" r="66" fill="#c7d9e7"/><text x="1260" y="337" text-anchor="middle" font-size="23" font-weight="700">SHUTTLE</text><text x="1260" y="370" text-anchor="middle" font-size="23" font-weight="700">OPTION</text><text x="1135" y="460" font-size="24">confirm it is running</text><rect x="1075" y="560" width="415" height="180" rx="26" fill="#fff" stroke="#315e78" stroke-width="5"/><text x="1282" y="625" text-anchor="middle" font-size="30" font-weight="700">POOL OR EXIT?</text><text x="1282" y="674" text-anchor="middle" font-size="24">one second act is enough</text></g><text x="800" y="858" text-anchor="middle" font-family="Arial" font-size="29" font-weight="700" fill="#17211b">THE SHUTTLE REDUCES BACKTRACKING. IT DOES NOT CREATE MORE ENERGY.</text></svg>`,
  "family-sun-protection-stack.svg": `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1600 900" role="img" aria-labelledby="t d"><title id="t">Family sun-protection stack</title><desc id="d">A four-layer framework of timing, shade, clothing and sunscreen with hats, sunglasses and a no-buy option</desc><rect width="1600" height="900" fill="#fff4da"/><circle cx="1410" cy="130" r="70" fill="#f2b544"/><g stroke="#f2b544" stroke-width="14"><path d="M1410 25v-55M1410 235v55M1305 130h-55M1515 130h55M1335 55l-40-40M1485 205l40 40M1485 55l40-40M1335 205l-40 40"/></g><text x="110" y="105" font-family="Arial" font-size="62" font-weight="700" fill="#17211b">SUN PROTECTION IS A STACK</text><text x="115" y="158" font-family="Arial" font-size="28" fill="#654d20">Use every layer you already own before buying another bottle.</text><g font-family="Arial"><rect x="120" y="665" width="1120" height="120" rx="24" fill="#315e78"/><text x="170" y="716" font-size="27" font-weight="700" fill="#d9edf7">LAYER 1</text><text x="360" y="737" font-size="44" font-weight="700" fill="#fff">TIME THE EXPOSED PART</text><rect x="190" y="520" width="1120" height="120" rx="24" fill="#2f7d6a"/><text x="240" y="571" font-size="27" font-weight="700" fill="#d8efe9">LAYER 2</text><text x="430" y="592" font-size="44" font-weight="700" fill="#fff">BUILD REAL SHADE</text><rect x="260" y="375" width="1120" height="120" rx="24" fill="#8d6b36"/><text x="310" y="426" font-size="27" font-weight="700" fill="#fff1d4">LAYER 3</text><text x="500" y="447" font-size="44" font-weight="700" fill="#fff">COVER SKIN + EYES</text><rect x="330" y="230" width="1120" height="120" rx="24" fill="#d77a45"/><text x="380" y="281" font-size="27" font-weight="700" fill="#fff3e8">LAYER 4</text><text x="570" y="302" font-size="44" font-weight="700" fill="#fff">SCREEN THE GAPS</text><rect x="1260" y="665" width="225" height="120" rx="24" fill="#fff" stroke="#315e78" stroke-width="5"/><text x="1372" y="712" text-anchor="middle" font-size="25" font-weight="700" fill="#315e78">CHECK THE</text><text x="1372" y="750" text-anchor="middle" font-size="25" font-weight="700" fill="#315e78">UV INDEX</text></g><text x="800" y="855" text-anchor="middle" font-family="Arial" font-size="29" font-weight="700" fill="#17211b">NO-BUY OPTION: ORGANIZE THE COVERAGE, SHADE AND SUNSCREEN YOU ALREADY HAVE.</text></svg>`
};

mkdirSync(resolve(root, "assets/images"), { recursive: true });
for (const [name, svg] of Object.entries(visuals)) writeFileSync(resolve(root, "assets/images", name), svg);

function upsert(file, marker, block, before = "</main>") {
  const target = resolve(root, file);
  let html = readFileSync(target, "utf8");
  const start = `<!-- ${marker} -->`;
  const end = `<!-- END ${marker} -->`;
  const wrapped = `${start}${block}${end}`;
  const pattern = new RegExp(`${start}[\\s\\S]*?${end}`, "g");
  html = pattern.test(html) ? html.replace(pattern, wrapped) : html.replace(before, `${wrapped}${before}`);
  writeFileSync(target, html);
}

const marker = "DAILY 2026-08-26";
const destinationCard = `<article class="card"><img src="assets/images/watkins-glen-family-plan.svg" alt="Watkins Glen gorge-first family itinerary" style="object-fit:contain;background:#eef3ed"><div><span>FINGER LAKES · STAIR-HEAVY DAY</span><h3><a href="guides/watkins-glen-with-kids.html">Watkins Glen with kids</a></h3><p>Gorge first, a hard stair checkpoint, an optional shuttle and no obligation to make the day heroic.</p></div></article>`;
const gearCard = `<article class="card"><img src="assets/images/family-sun-protection-stack.svg" alt="Four-layer family sun-protection framework" style="object-fit:contain;background:#fff4da"><div><span>GEAR SYSTEM · SUN</span><h3><a href="guides/family-sun-protection-guide.html">Family sun protection</a></h3><p>Time, shade, clothing and sunscreen—plus the no-buy system.</p></div></article>`;
upsert("index.html", marker, `<section class="stories"><div class="wrap"><div class="section-head"><div><p class="kicker">TODAY'S FIELD PLANS</p><h2>One serious gorge. One sun system.</h2></div></div><div class="story-grid">${destinationCard.replace('class="card"','class="story-card"')}${gearCard.replace('class="card"','class="story-card"')}</div></div></section>`);
upsert("adventures.html", marker, `<section class="content-section alt"><div class="wrap"><p class="kicker">LATEST GUIDES</p><div class="simple-list"><a href="guides/watkins-glen-with-kids.html">Watkins Glen with kids <b>→</b></a><a href="guides/family-sun-protection-guide.html">Family sun protection <b>→</b></a></div></div></section>`);
upsert("destinations.html", marker, `<section class="content-section alt"><div class="wrap"><p class="kicker">FINGER LAKES DAY PLAN</p><div class="card-grid two">${destinationCard}</div></div></section>`);
upsert("outdoors.html", marker, `<section class="content-section alt"><div class="wrap"><p class="kicker">NEW OUTDOOR SYSTEMS</p><div class="card-grid two">${destinationCard}${gearCard}</div></div></section>`);
upsert("gear.html", marker, `<section class="content-section alt"><div class="wrap"><p class="kicker">SUN AND HEAT</p><div class="card-grid two">${gearCard}</div></div></section>`);
upsert("guides/family-day-trip-system.html", marker, `<aside class="note"><strong>New field plans:</strong> use the <a href="watkins-glen-with-kids.html">Watkins Glen gorge-first plan</a> and the <a href="family-sun-protection-guide.html">family sun-protection system</a>.</aside>`);
upsert("guides/taughannock-falls-with-kids.html", marker, `<aside class="note"><strong>Choosing a gorge:</strong> compare this easier family walk with the stair-heavy <a href="watkins-glen-with-kids.html">Watkins Glen family plan</a>.</aside>`);
upsert("guides/family-rain-gear-guide.html", marker, `<aside class="note"><strong>Opposite forecast:</strong> for exposed hot days, use the <a href="family-sun-protection-guide.html">family sun-protection system</a>.</aside>`);

let sitemap = readFileSync(resolve(root, "sitemap.xml"), "utf8");
for (const page of pages) {
  const url = `${site}/${page.path}`;
  if (!sitemap.includes(url)) sitemap = sitemap.replace("</urlset>", `<url><loc>${url}</loc><lastmod>${published}</lastmod></url>\n</urlset>`);
}
writeFileSync(resolve(root, "sitemap.xml"), sitemap);
console.log("Published exactly two Mr Adventure Dad pages for 2026-08-26.");
