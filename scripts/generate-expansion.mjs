import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";

const root = process.cwd();
const siteUrl = "https://mradventuredad.com";

const pages = [
  {
    slug: "thousand-islands-family-weekend.html",
    title: "A Thousand Islands Family Weekend That Does Not Feel Rushed",
    eyebrow: "DESTINATION · THOUSAND ISLANDS",
    description: "A flexible Thousand Islands family weekend plan with one boat-focused day, one shore-focused day, weather backups and realistic pacing for kids.",
    image: "https://images.unsplash.com/photo-1502786129293-79981df4e689?auto=format&fit=crop&w=1600&q=84",
    imageAlt: "Islands and open water under a bright sky",
    lead: "The Thousand Islands rewards curiosity, but it punishes an itinerary built like a scavenger hunt. Choose one home base, one meaningful water experience and one shore day with room for weather and kid energy.",
    sections: [
      ["Choose a home base that reduces driving", ["Pick lodging near the part of the river you actually plan to explore. A waterfront village, campground or family hotel works when meals, docks and the first activity are close enough that every transition does not require repacking the car.", "Before booking, decide whether the weekend is primarily about boating, a cruise, castles and history, fishing, swimming or simply seeing the river. One anchor purpose makes all the smaller decisions easier."]],
      ["Friday: arrive, eat and learn the layout", ["Use arrival evening for a village walk, an easy meal and a look at the water. Find parking, the dock, breakfast and the backup indoor option while nobody is under schedule pressure.", "Do not spend the first night chasing a sunset from three locations. Let the kids choose a treat, walk until energy starts dropping and get to bed before the main day."]],
      ["Saturday: make the river the main event", ["Choose one substantial water activity: your own boat, a sightseeing cruise, paddling in protected water or a fishing trip suited to the family. Book or verify it before the weekend, then keep the rest of the day light.", "Pack layers even in summer because wind over the river changes the feel of the day. Carry dry clothes, sun protection, water and a small snack that does not depend on a concession line."]],
      ["Add one island or castle experience", ["A historic island stop can be memorable, but docking, tickets, walking and crowds create more workload than the map suggests. Treat it as the second half of the main activity, not one stop among five.", "Give children a simple mission—find the best tower, sketch the strangest room or choose the family photograph—so the visit has a purpose beyond following adults through exhibits."]],
      ["Sunday: choose shore, nature or a short second run", ["Build Sunday around the weather and the drive home. A shoreline walk, short nature trail, museum, playground or relaxed brunch can close the weekend without starting another full expedition.", "Leave one optional stop for the return drive. Use it only when the family has energy; skipping it should feel like good judgment, not failure."]],
      ["Use a real weather backup", ["Rain and wind are different problems. Rain may still allow a sheltered cruise or short walk, while high wind can change boating plans even under blue sky. Your backup should work for the actual condition.", "Keep one indoor attraction, one scenic drive and one food-centered option saved offline. Make the decision before everyone is sitting in the car debating search results."]],
      ["What to book or verify first", ["Verify lodging, boat or cruise reservations, border-document requirements for any planned international travel, dock access, parking and attraction hours. Water levels, weather, schedules and operating rules can change.", "The weekend succeeds when the family experiences the river, not when every famous landmark receives a check mark."]]
    ],
    checklist: ["One home base selected", "Primary water activity reserved or verified", "Weather and wind backup chosen", "Dry clothes and layers packed", "Life jackets checked when boating", "Parking and dock location saved", "One child-friendly mission for the historic stop", "Sunday plan kept short", "Return-drive wildcard kept optional", "Current hours and rules verified before departure"],
    faq: [
      ["How many nights are enough for a first Thousand Islands trip?", "Two nights can work well when the home base and main activity are chosen in advance. A third night allows more weather flexibility."],
      ["Should a family try to visit both sides of the border?", "Only when documents, reporting requirements, time and the children's tolerance make it worthwhile. A strong first weekend can stay entirely on one side."],
      ["What age is best for a sightseeing cruise?", "Many ages can enjoy one when the duration, seating, weather and expectations fit the child. Bring a quiet activity for slower portions."],
      ["What is the biggest planning mistake?", "Spreading the weekend across too many villages and attractions. Driving and parking can consume the time that was supposed to feel like an escape."]
    ]
  },
  {
    slug: "finger-lakes-rainy-day-plan.html",
    title: "The Finger Lakes Rainy-Day Family Plan",
    eyebrow: "WEATHER PLAN · FINGER LAKES",
    description: "A flexible Finger Lakes rainy-day plan that combines one indoor anchor, one weather window, a good meal and a low-stress backup for families.",
    image: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1600&q=84",
    imageAlt: "Family road trip landscape with cloudy weather",
    lead: "Rain does not ruin a Finger Lakes day. Indecision does. Pick one indoor anchor, watch for a usable outdoor window and keep the driving radius small enough that the family still feels like it went somewhere.",
    sections: [
      ["Read the type of rain", ["A steady all-day rain, passing showers and a thunderstorm forecast require different plans. Check timing and radar before leaving, then decide which part of the day has the best chance for an outdoor stop.", "Do not interpret a low precipitation percentage as a guarantee at a specific lake. Long north-south lakes and local terrain can produce very different conditions within the region."]],
      ["Choose one indoor anchor", ["A science center, museum, historic site, indoor market, aquarium-style attraction, art space or hands-on workshop can carry two to four hours. Pick the one that best matches the children's current interests rather than the attraction adults feel obligated to appreciate.", "Buy timed tickets or confirm capacity when needed. Save the address and parking instructions before service becomes spotty."]],
      ["Use the weather window for one physical reset", ["When rain eases, take a short gorge overlook, village walk, lakefront stop or easy trail rather than committing to a long wet hike. Keep rain shells and spare socks accessible, not buried beneath luggage.", "Twenty minutes outside can reset the whole car. The purpose is movement and a sense of place, not completing a route at all costs."]],
      ["Make lunch part of the plan", ["Choose a meal that is reliably family-friendly and close to the indoor anchor. Have a backup that does not require another long drive or wait.", "Eat before everyone is exhausted. Rainy-day attractions create sensory fatigue, and hunger often arrives before adults notice it."]],
      ["Carry the rainy-day car kit", ["Keep compact umbrellas, rain shells, towels, dry socks, plastic bags, wipes and a small activity bag together. A separate wet bag prevents one muddy stop from taking over the vehicle.", "Add a thermos or warm drink in shoulder season. Cold rain can drain younger children much faster than a summer shower."]],
      ["Know when to shorten the day", ["If the rain becomes severe, roads flood, visibility drops or the family is done, head for lodging or home. An early finish with takeout and a movie can preserve the weekend.", "The goal is not to defeat the weather. It is to give the family one good shared memory without making everybody pay for it afterward."]]
    ],
    checklist: ["Forecast type and timing checked", "One indoor anchor selected", "Tickets or hours verified", "Short outdoor reset saved nearby", "Rain shells and spare socks accessible", "Wet bag and towels packed", "Lunch and backup chosen", "Driving radius limited", "Severe-weather exit plan clear", "Early finish treated as a valid option"],
    faq: [
      ["Which Finger Lake is best on a rainy day?", "The best choice is usually the lake area with the strongest indoor anchor and shortest drive from your lodging, not necessarily the most famous lake."],
      ["Are gorge trails safe in rain?", "Conditions vary. Wet rock, high water, closures and thunderstorms can make trails unsuitable. Verify current park information and use conservative judgment."],
      ["How many indoor attractions should be planned?", "One primary and one backup are enough. Stacking several often turns weather flexibility into another overloaded schedule."],
      ["What should stay in the car year-round?", "A small family kit with towels, wipes, bags, spare socks, water and simple snacks solves many ordinary weather problems."]
    ]
  },
  {
    slug: "syracuse-family-day-trip-guide.html",
    title: "The Syracuse Family Day-Trip Guide",
    eyebrow: "LOCAL GUIDE · SYRACUSE",
    description: "Build a Syracuse family day trip around animals, science, parks, history, food and an easy weather backup without zigzagging across the county.",
    image: "https://images.unsplash.com/photo-1470770841072-f978cf4d019e?auto=format&fit=crop&w=1600&q=84",
    imageAlt: "Green park and lake suitable for a family day trip",
    lead: "Syracuse has enough family options to create decision fatigue. The better method is to choose one zone, one anchor activity, one meal and one optional outdoor finish.",
    sections: [
      ["Choose the kind of day first", ["Decide whether the family needs animals, hands-on science, a playground, a nature walk, local history, water, sports or simply somewhere to move indoors. Matching the activity to the children beats choosing by reputation alone.", "Check current hours, ticket policies, parking and seasonal operations directly before leaving. Local attractions can change schedules for events, maintenance and weather."]],
      ["Build an animals-and-park day", ["An animal-focused morning works best when children arrive rested and the temperature is comfortable. Move at their pace and choose a small number of must-see areas rather than marching through every loop.", "Follow with lunch and a nearby park or playground. The open-ended second half lets children move differently after a structured attraction."]],
      ["Build a science-and-downtown day", ["Use a hands-on science or museum visit as the anchor, then add a short downtown walk, food stop or historic building. Confirm event-day traffic and parking before committing to a tight arrival time.", "Give each child one exhibit choice. Adults can handle the route while children retain ownership of part of the day."]],
      ["Build a nature day close to home", ["Central New York offers lakefront paths, forests, waterfalls, boardwalks and short elevation without requiring an Adirondack drive. Choose distance and terrain based on the youngest reliable walker.", "Pack dry shoes and a change of clothes. Mud, water and playgrounds are more likely than the emergency gear parents usually remember."]],
      ["Use one geographic zone", ["Avoid pairing far-west and far-east county stops simply because both sound good. The car time and parking transitions can consume the best hours of the day.", "Cluster the attraction, meal and outdoor option within a manageable radius. A shorter route also makes weather changes easier."]],
      ["Create a winter version", ["In cold weather, start with the indoor anchor and add only a short outdoor segment. Keep coats easy to remove and carry rather than turning the family into a pile of winter gear inside.", "Have a warm drink or early dinner plan. The dark arrives quickly, and an intentionally short winter day can feel more successful than a summer-style schedule forced into January."]],
      ["End before the family is empty", ["Leave while the final activity is still enjoyable. A treat for the ride home can create a clean ending without requiring another destination.", "The measure of a local day trip is whether it made an ordinary weekend feel different—not whether it exhausted every option in the county."]]
    ],
    checklist: ["Day type selected", "Current hours and parking checked", "One anchor activity", "One nearby meal", "One optional outdoor finish", "Stops kept in one geographic zone", "Dry clothes or winter gear organized", "Each child gets one choice", "Treat or quiet ride-home plan", "Departure timed before total fatigue"],
    faq: [
      ["How much should a Syracuse day trip cost?", "It can range from nearly free park and nature plans to ticketed attractions. Set the budget before presenting choices so cost does not become a mid-day argument."],
      ["What works best for mixed ages?", "Choose an anchor with broad appeal and give older and younger children separate small missions or choices within the same place."],
      ["Should two major attractions be combined?", "Usually not unless they are close and the family has unusual stamina. One major attraction plus a flexible extra is more reliable."],
      ["What is the best bad-weather backup?", "A backup close to the original route with confirmed hours and easy parking. The backup should reduce stress, not add a longer drive."]
    ]
  },
  {
    slug: "road-trip-packing-system.html",
    title: "The Family Road-Trip Packing System",
    eyebrow: "DAD SYSTEM · PACKING",
    description: "A family road-trip packing system using zones, day bags, permanent car gear, kid ownership and a final departure check that prevents avoidable chaos.",
    image: "https://images.unsplash.com/photo-1526772662000-3f88f10405ff?auto=format&fit=crop&w=1600&q=84",
    imageAlt: "Road through a mountain landscape",
    lead: "Packing works when every item has a time and place of use. Stop building one giant pile. Pack the car in zones so the next needed thing is reachable without unloading the trip.",
    sections: [
      ["Pack by moment, not by person alone", ["Personal bags are useful for clothing, but the car should also have shared systems: travel, arrival, weather, food, sleep and emergency. Think through the first three hours and the first ten minutes at the destination.", "The rain shell needed at a roadside stop does not belong under four suitcases simply because it is technically packed."]],
      ["Create a front-seat operations zone", ["Keep navigation, charging, toll or parking items, sunglasses, wipes, tissues, water and the next reservation information within adult reach. Avoid loose objects that can become hazards in a sudden stop.", "Use one small organizer rather than filling every cupholder. The driver should not search for anything while moving."]],
      ["Give each child a controlled travel bag", ["Let each child choose a limited set of books, headphones, drawing supplies, comfort items and one snack. Set the physical bag size first; boundaries are easier when the container makes the decision.", "Parents keep medication, important electronics and anything that can spill, melt or disappear at a rest area."]],
      ["Build a permanent car module", ["Keep a seasonal kit with first-aid supplies, flashlight, basic tools, bags, paper towels, spare charging cable, emergency contact information and appropriate roadside gear. Review it before long trips.", "A permanent snack bin can work when food is rotated and heat-safe. Do not leave medication or temperature-sensitive items in the vehicle."]],
      ["Use an arrival bag", ["Pack the first night's sleepwear, toiletries, medication, chargers and one clothing change together when arriving late. This prevents a complete unloading operation at bedtime.", "For camping or rentals, add the items required to make the first meal and sleeping space functional before opening recreation gear."]],
      ["Separate wet, dirty and emergency clothing", ["Carry empty bags for wet swimsuits, muddy shoes and trash. Keep one full dry outfit per child in a known reachable place.", "The dry outfit is not ordinary clothing inventory. It is the reset button after a spill, storm or unexpected water encounter."]],
      ["Run the departure sequence", ["Before leaving, verify people, medication, wallets, keys, phone, charging, reservations, house security, pets, fuel and the first navigation destination. Say the critical items aloud.", "Once the car is loaded, take one photograph of the arrangement. Repacking at the destination is faster when the original logic is visible."]]
    ],
    checklist: ["Front-seat operations organizer", "Child travel bags with size limits", "Permanent seasonal car module", "Reachable water and approved snacks", "Arrival bag for first night", "One dry outfit per child", "Wet and trash bags", "Medication kept with adult", "Chargers tested before departure", "Critical-item verbal check", "First destination loaded in navigation", "Photo of packed-car layout"],
    faq: [
      ["How early should packing begin?", "Create the list several days ahead, stage shared modules the day before and leave only daily-use items for departure morning."],
      ["Should children pack their own bags?", "Yes, within a defined list and container. An adult should verify weather, medication and essential clothing."],
      ["What is usually overpacked?", "Extra outfits, toys and specialized gear for unlikely scenarios. Shared layers and a laundry plan often reduce volume."],
      ["What is usually forgotten?", "Medication, charging cables, weather layers, swim or wet bags, sleep items and the practical details of the first meal or first night."]
    ]
  },
  {
    slug: "kids-first-hike-guide.html",
    title: "Your Kid's First Real Hike",
    eyebrow: "OUTDOORS · FIRST HIKE",
    description: "Plan a child's first real hike with the right distance, terrain, snacks, clothing, pacing, turnaround rule and a simple trail mission.",
    image: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=1600&q=84",
    imageAlt: "Sunlight passing through a forest trail",
    lead: "The first hike should end with a child who believes hiking is something the family does—not with an adult proving the child could finish a route.",
    sections: [
      ["Choose a trail with a payoff", ["Pick a short route with a clear feature: water, a view, a bridge, a giant rock, a fire tower seen from below or a loop that feels like exploration. Distance alone is not motivating.", "Check current trail conditions, closures, parking, hunting seasons, weather and any fees. A familiar local trail is often better than a famous route with a long drive and crowded start."]],
      ["Set the distance from the child, not the map", ["Use the youngest or least experienced hiker as the planning standard. For a first outing, leave enough energy for the return rather than assuming excitement will continue uphill.", "Build in a turnaround time independent of the destination. Reaching the end is optional; returning safely and positively is not."]],
      ["Dress for stops as well as movement", ["Children warm while climbing and cool quickly when stopping. Use layers that can be added without unpacking the whole bag. Avoid relying on cotton alone in cold or wet conditions.", "Footwear should fit and have been worn before. Spare socks can rescue a day after a puddle or blister begins."]],
      ["Give the trail a mission", ["Ask children to find three kinds of leaves, count bridges, photograph interesting textures, choose the snack rock or carry the map in a protected case. The mission turns slow progress into the activity.", "Do not turn nature into a constant lesson. Let the child lead some observation without an adult naming everything."]],
      ["Feed before the crash", ["Offer water and small snacks early rather than waiting for complaints. Use a special trail snack that is easy to carry and not dependent on perfect table manners.", "Pack out all waste and keep food secured from wildlife. Verify local guidance where bears or other animals are a concern."]],
      ["Manage risk in simple language", ["Teach the stop rule: if separated, stop moving, stay visible and call out. Keep children in sight, especially near water, cliffs, roads and trail junctions.", "Carry a basic first-aid kit, whistle, light, navigation, extra layer and emergency information appropriate to the location. Cell service is a convenience, not the plan."]],
      ["Turn around while it is still going well", ["Watch pace, mood, temperature and daylight. Turn around before the group is depleted, even when the destination is close.", "End with a small ritual—a photograph, warm drink, sticker on a trail map or choice of the next easy hike. Identity grows through repeatable success."]]
    ],
    checklist: ["Short trail with a visible payoff", "Current conditions checked", "Turnaround time selected", "Layers for movement and stops", "Worn-in footwear and spare socks", "Water and early snacks", "Simple trail mission", "First-aid kit, whistle and light", "Offline map or printed route", "Stop-if-separated rule taught", "Hazards identified before arrival", "Positive ending ritual"],
    faq: [
      ["How long should a child's first hike be?", "There is no universal mileage. Choose a route the child can complete with reserve, considering terrain, weather and prior walking experience."],
      ["Should a child carry a backpack?", "A light pack with water, a layer and one personal item can build ownership, but adults should carry emergency and shared gear."],
      ["What if the child wants to turn back immediately?", "Pause, eat, adjust clothing and try a small nearby objective. If the child remains done, turn back without making the hike a punishment."],
      ["Are rewards a bad idea?", "A small ritual or special snack can support positive association. The larger goal is curiosity and family identity, not payment for suffering."]
    ]
  },
  {
    slug: "one-night-camping-with-kids.html",
    title: "One-Night Camping With Kids: The Smart First Trip",
    eyebrow: "OUTDOORS · FAMILY CAMPING",
    description: "A one-night family camping plan covering campsite choice, sleep, food, weather, bathroom logistics, kid jobs and the fastest route home if needed.",
    image: "https://images.unsplash.com/photo-1475483768296-6163e08872a1?auto=format&fit=crop&w=1600&q=84",
    imageAlt: "Tent camping beneath trees",
    lead: "One night is long enough to learn the entire camping system and short enough to recover from the parts that do not work. Treat the first trip as a shakedown, not a wilderness test.",
    sections: [
      ["Choose an easy campsite on purpose", ["For the first trip, use a legal established campground within a manageable drive of home. A reserved site, nearby bathroom and clear vehicle access remove enough uncertainty for the family to learn sleeping, food and weather systems.", "Check current campground rules, fire restrictions, quiet hours, animal storage requirements, water availability and check-in procedures before departure."]],
      ["Practice the tent at home", ["Set up the complete sleep system before the trip: tent, footprint, pads, sleeping bags, pillows, lights and child sleep items. Time the setup and assign simple roles.", "A backyard test reveals missing stakes, dead batteries, leaking pads and the child who needs a different blanket before those problems occur in darkness."]],
      ["Keep food almost embarrassingly simple", ["Plan one dinner, one breakfast and two snack options that use minimal equipment. Prepare ingredients at home and avoid recipes that require perfect fire conditions.", "Store food and scented items according to campground and wildlife guidance. Never take food into the tent simply because the children are tired."]],
      ["Give children real jobs", ["One child can carry tent poles, another can place sleeping pads, gather approved kindling where permitted or organize headlamps. Jobs should be useful, short and matched to age.", "Do not assign every task. Children also need time to explore the site and become comfortable with the new environment."]],
      ["Plan the bathroom before bedtime", ["Show children the route to the bathroom in daylight. Place shoes, headlamps and a warm layer in the same reachable location for nighttime trips.", "For younger children, discuss what will happen before urgency. A clear plan prevents the tent from becoming a midnight search operation."]],
      ["Prepare for temperature drop", ["Even warm days can become cold or damp overnight. Use sleep systems rated for expected conditions and add dry base layers, hats or blankets as appropriate.", "Ventilate the tent to reduce condensation and avoid unsafe heaters or combustion devices. Follow manufacturer instructions for all equipment."]],
      ["Create the rain and exit plan", ["Know whether the family will stay through light rain, move meals under shelter or pack up when severe weather threatens. Keep essential clothing and bedding in waterproof storage.", "Park so departure remains possible. Going home at midnight is not a failed camping trip; it is the correct use of the backup when safety, illness or complete misery says the experiment is over."]],
      ["Debrief before buying more gear", ["After the trip, list what was missing, what was never used and what caused the most friction. Improve the system before purchasing specialized equipment.", "The second trip should be easier because the family has a shared sequence—not because the car contains twice as much stuff."]]
    ],
    checklist: ["Established campground near home", "Rules and weather verified", "Tent practiced before trip", "Sleep system tested", "One simple dinner and breakfast", "Food-storage plan", "Child jobs assigned", "Bathroom route shown in daylight", "Headlamps and shoes reachable", "Dry layers waterproofed", "Rain and early-exit rules", "Post-trip gear debrief"],
    faq: [
      ["What age is appropriate for a first camping trip?", "Families camp successfully with many ages. The site, weather, sleep expectations and proximity to home matter more than a single age rule."],
      ["Should the first trip be in the backyard?", "A backyard night is an excellent equipment and sleep test, even when the first official trip will be at a campground."],
      ["Do children need their own sleeping bags?", "They need a safe sleep system that fits expected temperatures and keeps them comfortable. Child-sized bags can reduce unused air space, but ratings and layering still matter."],
      ["What should be done if nobody sleeps?", "Keep the night calm, warm and safe. Use the exit plan when needed, then adjust pads, bedding, noise or timing before the next trip."]
    ]
  }
];

const esc = (value) => String(value).replace(/[&<>\"]/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[char]));

function render(page) {
  const canonical = `${siteUrl}/guides/${page.slug}`;
  const sections = page.sections.map(([heading, paragraphs]) => `<h2>${esc(heading)}</h2>${paragraphs.map((p) => `<p>${esc(p)}</p>`).join("")}`).join("");
  const checklist = page.checklist.map((item) => `<li>${esc(item)}</li>`).join("");
  const faq = page.faq.map(([q, a]) => `<details><summary>${esc(q)}</summary><p>${esc(a)}</p></details>`).join("");
  const articleSchema = { "@context": "https://schema.org", "@type": "Article", headline: page.title, description: page.description, url: canonical, dateModified: "2026-08-17", author: { "@type": "Organization", name: "Mr Adventure Dad" }, publisher: { "@type": "Organization", name: "Mr Adventure Dad" } };
  const faqSchema = { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: page.faq.map(([q, a]) => ({ "@type": "Question", name: q, acceptedAnswer: { "@type": "Answer", text: a } })) };
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${esc(page.title)} | Mr Adventure Dad</title><meta name="description" content="${esc(page.description)}"><link rel="canonical" href="${canonical}"><meta property="og:type" content="article"><meta property="og:site_name" content="Mr Adventure Dad"><meta property="og:title" content="${esc(page.title)}"><meta property="og:description" content="${esc(page.description)}"><meta property="og:url" content="${canonical}"><meta property="og:image" content="${page.image}"><meta name="twitter:card" content="summary_large_image"><link rel="stylesheet" href="../assets/css/style.css"><script defer src="../assets/js/site.js"></script><style>.article details{padding:1rem 0;border-bottom:1px solid rgba(24,39,31,.18)}.article summary{cursor:pointer;font-weight:800}.field-check{padding:1.4rem;margin:2rem 0;background:#eef3e8;border-left:5px solid #ec7a2d}.article .updated{font-size:.9rem;color:#5a665f}.article .dek{max-width:850px}</style><script type="application/ld+json">${JSON.stringify(articleSchema)}</script><script type="application/ld+json">${JSON.stringify(faqSchema)}</script></head><body><header class="site-header"><a class="brand" href="../index.html"><span class="brand-mark">MAD</span><span>MR <b>ADVENTURE</b> DAD</span></a><button class="menu-toggle" type="button" aria-label="Open navigation">☰</button><nav class="nav"><a href="../adventures.html">Adventures</a><a href="../destinations.html">Destinations</a><a href="../outdoors.html">Outdoors</a><a href="../gear.html">Gear</a><a href="../about.html">About</a></nav></header><main class="article"><p class="eyebrow">${esc(page.eyebrow)}</p><h1>${esc(page.title)}</h1><p class="dek">${esc(page.lead)}</p><p class="updated"><strong>Updated August 17, 2026.</strong> Verify current hours, rules, weather and availability directly before travel.</p><img class="article-hero" src="${page.image}" alt="${esc(page.imageAlt)}">${sections}<section class="field-check"><h2>The dad checklist</h2><ul>${checklist}</ul></section><section><h2>Frequently asked questions</h2>${faq}</section><div class="note"><strong>Dad rule:</strong> The plan is successful when it creates a good family day and leaves enough energy to want another one.</div><hr><p><a class="button ghost" href="../adventures.html">← Back to family adventures</a></p></main><footer><div class="wrap copyright">© <span id="year"></span> Mr Adventure Dad. <a href="../index.html">Home</a></div></footer></body></html>`;
}

function upsert(path, marker, block) {
  const full = join(root, path);
  let html = readFileSync(full, "utf8");
  const start = `<!-- ${marker} START -->`;
  const end = `<!-- ${marker} END -->`;
  const wrapped = `${start}${block}${end}`;
  const pattern = new RegExp(`${start.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}[\\s\\S]*?${end.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}`);
  if (pattern.test(html)) html = html.replace(pattern, wrapped);
  else html = html.replace("</main>", `${wrapped}</main>`);
  writeFileSync(full, html);
}

for (const page of pages) {
  const full = join(root, "guides", page.slug);
  mkdirSync(dirname(full), { recursive: true });
  writeFileSync(full, render(page));
}

const cards = `<section class="content-section alt" id="new-field-guides"><div class="wrap"><p class="kicker">NEW FAMILY FIELD GUIDES</p><h2>Six plans built to survive real kids, real weather and real weekends.</h2><p class="section-copy">Destination weekends, rainy-day pivots, packing, hiking and a first camping trip—organized around the decisions that usually make or break the day.</p><div class="card-grid">${pages.map((page) => `<article class="card"><img src="${page.image}" alt="${esc(page.imageAlt)}"><div><span>${esc(page.eyebrow.split(" · ")[0])}</span><h3><a href="guides/${page.slug}">${esc(page.title)}</a></h3><p>${esc(page.description)}</p></div></article>`).join("")}</div></div></section>`;
upsert("adventures.html", "MAD EXPANSION", cards);

const sitemapPath = join(root, "sitemap.xml");
let sitemap = readFileSync(sitemapPath, "utf8");
for (const page of pages) {
  const loc = `${siteUrl}/guides/${page.slug}`;
  const escaped = loc.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  sitemap = sitemap.replace(new RegExp(`<url>\\s*<loc>${escaped}<\\/loc>[\\s\\S]*?<\\/url>\\s*`, "g"), "");
}
const entries = pages.map((page) => `<url><loc>${siteUrl}/guides/${page.slug}</loc><lastmod>2026-08-17</lastmod><changefreq>monthly</changefreq><priority>0.74</priority></url>`).join("");
sitemap = sitemap.replace("</urlset>", `${entries}</urlset>`);
writeFileSync(sitemapPath, sitemap);

console.log(`Generated ${pages.length} substantial Mr Adventure Dad guides and refreshed the adventure hub and sitemap.`);
