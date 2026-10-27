import { readdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { relative, resolve } from "node:path";

const root = resolve(process.argv[2] || ".");
const onlyPath = process.argv[3]?.replaceAll("\\", "/");
const tag = "mradventuredad-20";
const markerStart = "<!-- MAD AFFILIATE COMMERCE -->";
const markerEnd = "<!-- END MAD AFFILIATE COMMERCE -->";
const skipDirectories = new Set([".git", "node_modules", ".wrangler"]);

const catalog = {
  campingpads: [
    ["closed cell foam camping sleeping pad ASTM R value", "Closed-cell foam camping pads", "Compare exact length, width, packed bulk and maker-stated ASTM R-value. No valve improves failure tolerance, but foam still must fit the tent and vehicle."],
    ["self inflating camping sleeping pad ASTM R value", "Self-inflating camping pads", "Check the exact foam-core construction, ASTM R-value, valve, inflation finish, packed size, repair materials and long-term storage instructions."],
    ["insulated air camping sleeping pad ASTM R value", "Insulated air camping pads", "Require a documented ASTM R-value, body and tent fit, workable inflation method, compatible repair route and a home-tested nighttime exit."],
  ],
  homejigsaws: [
    ["kids interlocking cardboard jigsaw puzzles age labeled", "Children’s interlocking cardboard jigsaws", "Match the exact age label, warnings, image detail, grip and assembled dimensions to the child and usable workspace—not piece count alone."],
    ["large piece cardboard jigsaw puzzles age labeled", "Larger-piece cardboard jigsaws", "Check the actual age label and finished dimensions. Larger pieces do not automatically mean approval for younger children or a smaller table."],
    ["family cardboard jigsaw puzzles age labeled", "Shared family cardboard jigsaws", "Compare the exact edition’s age guidance, image complexity, finished width and height, missing-piece route and secure pause/storage needs."],
  ],
  homeboardgames: [
    ["cooperative family board games school age", "Cooperative family board games", "Check the exact age label, reading load, player count, shared-decision rules and small-parts warning. Cooperation does not eliminate adult over-coaching."],
    ["light strategy family board games ages 7", "Light strategy family board games", "Read the matching edition’s manual: count real players, turn waiting, conflict, elimination, teaching and cleanup before buying."],
    ["tabletop dexterity family games wooden blocks", "Tabletop dexterity family games", "Check piece size, stable table space, reach, motor fit, noise and younger-sibling access. Physical play is not automatically the right fit."],
  ],
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
  rainboots: [
    ["kids tall rain boots waterproof", "Tall pull-on kids’ rain boots", "Compare present fit, shaft clearance, heel hold, outsole, lining, drying instructions and the maker’s exact water-protection claim."],
    ["kids waterproof chelsea rain boots", "Low Chelsea-style kids’ rain boots", "Useful for quick independent changes when the lower coverage matches the puddle depth; verify elastic-panel construction and current fit."],
    ["kids insulated rain boots waterproof", "Insulated kids’ rain boots", "Choose insulation only when the forecast and activity require it; check lining material, removable components, drying method and the maker’s temperature guidance."],
  ],
  winterboots: [
    ["kids removable liner pac winter boots", "Kids’ removable-liner pac boots", "Check both-foot sizing with the real sock, heel security, shell and liner instructions, gaiter closure, loaded walking comfort, drying time and the maker’s exact water-protection claim."],
    ["kids insulated snow boots waterproof", "Kids’ insulated snow boots", "Compare the exact waterproof boundary, insulation, closure independence, weight, snow-pant interface, current size chart, drying method and recall status."],
    ["kids winter hiking boots waterproof insulated", "Kids’ winter hiking boots", "Choose for walking only after checking heel hold, toe room, flex, outsole, boot height, maker-stated insulation and water protection, and the child’s clean indoor gait test."],
  ],
  iceskates: [
    ["kids beginner figure ice skates", "Kids’ figure-skate categories", "Compare the exact maker size method, heel control, toe room, closure, blade attachment, return terms and the lesson provider’s allowed category."],
    ["youth beginner hockey ice skates", "Youth hockey-skate categories", "Check both-foot measurements, boot shape, current heel and ankle fit, blade service route and the program’s equipment requirements."],
    ["kids adjustable recreational ice skates", "Adjustable recreational skate categories", "Verify the current setting locks as instructed, holds the heel, matches the measured foot and is accepted by the rink or lesson program."],
  ],
  snowshoes: [
    ["kids molded snowshoes adjustable binding", "Molded youth snowshoe categories", "Compare the exact total-load range, boot range, binding sequence, deck dimensions, traction, replacement parts and current return terms."],
    ["youth aluminum frame snowshoes bindings", "Frame-and-deck youth snowshoe categories", "Match the dressed child plus carried load, waterproof boot, stride, trail surface and the manufacturer’s terrain and care instructions."],
    ["kids adjustable snowshoes winter boots", "Adjustable youth snowshoe categories", "Treat growth range as secondary: the current setting must lock correctly, hold today’s boot and remain inside every maker-defined user limit."],
  ],
  radio: [
    ["rechargeable FRS walkie talkies family", "Rechargeable FRS radios", "Compare control lock, charging method, certified radio service and a size children can actually manage."],
    ["water resistant FRS walkie talkies", "Weather-resistant FRS radios", "Verify the exact ingress rating and charging-cover design instead of trusting the word outdoor."],
    ["FRS walkie talkies replaceable batteries", "Replaceable-battery FRS radios", "Useful when a long weekend needs a spare-cell fallback instead of another proprietary charging cradle."],
  ],
  weatherradio: [
    ["NOAA weather radio SAME alert battery backup", "SAME desktop alert radios", "Compare county programming, alert controls, display, battery backup, external-device support and the exact manufacturer manual."],
    ["portable NOAA weather radio battery alert", "Portable weather radios", "Verify automatic alert behavior, common-cell power, antenna, control lock, reception guidance and storage instructions."],
    ["hand crank NOAA weather radio emergency", "Hand-crank multi-function weather radios", "Treat crank and solar as backup features; compare the real battery system, alert behavior, charge instructions and current recall status."],
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
  visibilitygear: [
    ["kids retroreflective safety vest walking", "Retroreflective walking vests", "Check the actual outer-layer fit, closure, visible coverage, materials and the maker's exact reflectivity and care claims."],
    ["retroreflective wrist ankle bands walking", "Retroreflective motion bands", "Compare secure fit, reflective area, edge comfort and whether the band stays visible on a moving wrist or ankle."],
    ["clip on safety light walking rechargeable", "Clip-on walking lights", "Verify mounting security, controls, battery access, runtime, charge method and the maker's exact weather-resistance statement."],
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
  packingcubes: [
    ["mesh packing cubes travel set", "Breathable mesh packing cubes", "Compare loaded dimensions, empty weight, mesh and seam construction, zipper path, care instructions, warranty and return terms; visibility does not provide spill protection."],
    ["wipe clean zip travel organizer pouch", "Wipe-clean travel pouches", "Verify usable dimensions, material, closure, cleanability and the maker's exact water-resistance claim; an ordinary zipper is not a waterproof seal."],
    ["compression packing cubes travel", "Zip-compression packing cubes", "Check loaded size, empty weight, zipper and gusset design, care, warranty and the real bag-weight result; compression changes volume, not mass."],
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
  drybags: [
    ["roll top dry bag waterproof family kayak", "Roll-top dry bags", "Compare usable volume, closure instructions, seam construction, attachment points and the maker's exact water-exposure claim."],
    ["water resistant zippered gear pouch", "Zippered water-resistant gear pouches", "Choose for access only after checking the finished pouch claim, zipper care, cleanability and dimensions of the real load."],
    ["waterproof phone pouch IPX8", "Waterproof phone pouches", "Verify the tested rating, internal dimensions, closure, lanyard instructions and phone controls before trusting the pouch."],
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
  howepacking: [
    ["kids lightweight fleece jacket", "Kids’ lightweight fleece layers", "Compare current size guidance, zipper comfort, sleeve length, care instructions and return terms on the actual child."],
    ["kids lightweight packable rain jacket", "Kids’ lightweight rain shells", "Use a shell only when outside weather earns it; verify fit over the warm layer and the maker’s exact water-protection claim."],
    ["kids comfortable closed toe walking shoes", "Kids’ closed-toe walking shoes", "Prioritize familiar fit, secure closure, heel hold and stair comfort; Howe’s current tour rule excludes flip-flops."],
  ],
  hikingsocks: [
    ["kids merino wool hiking socks", "Kids’ wool-blend hiking socks", "Check the exact fiber blend, size chart, cushion, care instructions and fit inside the child’s current trail shoe."],
    ["kids synthetic hiking socks moisture wicking", "Kids’ synthetic hiking socks", "Compare thickness, seams, drying, cuff pressure and return terms after testing one pair in the actual shoe."],
    ["kids lightweight hiking socks crew", "Lightweight kids’ hiking socks", "Choose a cuff above the shoe collar and enough room for toes without buying a multi-pack before the fit test."],
  ],
  hikinggloves: [
    ["kids fleece gloves hiking", "Kids’ fleece hiking gloves", "Compare hand measurement, seam comfort, cuff overlap, grip and the maker’s exact material and care instructions."],
    ["kids waterproof shell mittens", "Kids’ waterproof shell mittens", "Check whether the shell is insulated, how the seams and cuff are constructed, and which liner the maker permits."],
    ["kids insulated hiking gloves", "Kids’ insulated hiking gloves", "Prioritize present fit, jacket-cuff compatibility, grip and a realistic drying plan over a vague temperature claim."],
  ],
  trailclothing: [
    ["kids moisture wicking base layer long sleeve", "Kids’ moisture-managing base layers", "Compare fiber content, seam comfort, neck opening, sleeve length, care instructions and return terms on the actual child."],
    ["kids full zip fleece jacket hiking", "Kids’ full-zip fleece midlayers", "Check zipper comfort, shoulder movement, pack fit, fabric weight and whether the layer vents easily during active walking."],
    ["kids waterproof breathable rain shell jacket", "Kids’ weather shells", "Verify the finished garment’s water-protection claim, seam construction, hood visibility, layer room and care requirements."],
  ],
  kidssleepingbags: [
    ["kids sleeping bag camping rectangular", "Rectangular kids’ sleeping bags", "Compare present body fit, zipper access, fill, shell, care instructions, maker rating method and use with the actual insulated pad."],
    ["kids mummy sleeping bag camping", "Tapered kids’ sleeping bags", "Check shoulder and hip room, hood clearance, inside zipper operation, ventilation and the manufacturer’s explanation of every temperature claim."],
    ["youth sleeping bag adjustable length", "Adjustable-length youth sleeping bags", "Verify how the length adjustment works, current user dimensions, hardware, care and whether the child can enter, vent and self-exit."],
  ],
  foodjars: [
    ["10 oz insulated food jar kids", "About-10-ounce insulated food jars", "Use the measured meal, loaded weight, opening and child lid test; confirm the exact maker instructions and dimensions before keeping one."],
    ["14 oz wide mouth insulated food jar", "About-14-ounce wide-mouth food jars", "Compare mouth width, spoon reach, gasket access, cleaning method and verified temperature at the real serving time."],
    ["16 oz insulated food jar handle", "About-16-ounce insulated food jars", "Choose the larger category only for a genuinely larger portion; verify loaded carry, lid independence, headspace and the maker’s permitted uses."],
  ],
  snackcontainers: [
    ["divided snack box kids reusable", "Divided hard snack boxes", "Compare real bag footprint, latch independence, removable seals, compartment cleaning and the exact maker food-use instructions."],
    ["small screw top snack container wide mouth", "Wide-mouth screw-top snack cups", "Check child opening torque, thread and gasket cleaning, roll-away shape, usable volume and the maker's current leak claim."],
    ["reusable zipper snack bag food safe", "Reusable zipper snack pouches", "Best for compact dry-food carry only after checking food-contact use, closure alignment, corner cleaning, full drying and crush protection."],
  ],
  handwarmers: [
    ["air activated hand warmers sealed packets", "Air-activated hand-warmer packets", "Confirm the sealed packet's intended placement, age guidance, skin-contact limits, storage and disposal instructions; keep contents away from children and pets."],
    ["reusable sodium acetate snap disc hand warmers", "Reusable snap-disc hand warmers", "Compare pouch integrity, activation method, stated heat window and exact adult reset instructions; never improvise a microwave or boiling-water method."],
  ],
  snowpants: [
    ["kids insulated bib snow pants", "Kids’ insulated bib snow pants", "Compare current body measurements, strap range, rise, boot gaiter, finished-garment weather claim, care and return terms on the actual child."],
    ["kids insulated waist snow pants", "Kids’ waist snow pants", "Prioritize independent closures, squat coverage, waist security, boot overlap and the maker’s exact weather-protection and care instructions."],
    ["kids one piece snowsuit", "Kids’ one-piece snowsuits", "Check torso length, crouch freedom, bathroom access, boot cuffs, full-garment drying, car-seat guidance and return terms before keeping one."],
  ],
  chargingstations: [
    ["USB IF certified multiport USB C charger", "Multiport USB-C chargers", "Compare total and per-port output, shared-output behavior, supported protocols, certification record and the maker’s current instructions."],
    ["UL listed power strip wide spaced outlets", "Listed power strips", "Verify the exact listing, receptacle spacing, cord length, overload protection, surge status and permitted use before choosing a strip."],
    ["passive device charging station organizer no electronics", "Passive device-charging organizers", "Measure cased-device slots and cable routing, and confirm whether the organizer contains any electrical components before buying."],
  ],
  aabatteries: [
    ["AA AAA low self discharge NiMH rechargeable batteries", "Low-self-discharge NiMH AA/AAA cells", "Use only where the device manual permits NiMH, then keep same-age cells in labeled matched sets and follow exact charge instructions."],
    ["independent channel NiMH AA AAA smart charger", "NiMH chargers with independent channels", "Verify supported chemistry, cell sizes, indicators, input, fault behavior and the exact model manual before charging anything."],
    ["AA AAA battery storage case terminal protection", "AA/AAA battery storage cases", "Choose a dry case that keeps sizes, chemistry and charge state separate; it is organization, not a fireproof vault."],
  ],
  kidscameras: [
    ["simple digital camera for kids memory card", "Simple digital cameras", "Compare hand fit, memory-card compatibility, battery, transfer method, wireless controls and the return window before keeping one."],
    ["instant print camera for kids", "Instant-print cameras", "Confirm whether it uses instant film or thermal paper, then price the exact refill media and review the child-sharing workflow."],
    ["rugged waterproof compact digital camera", "Rugged compact cameras", "Verify the maker's exact depth, time, drop, temperature, seal-care and charging instructions rather than trusting the word rugged."],
  ],
  natureobservation: [
    ["handheld magnifying glass kids nature", "Handheld nature magnifiers", "Compare lens size, handle comfort, edge protection, materials and the maker's current age and care guidance."],
    ["ventilated bug viewer magnifying cup", "Ventilated clear viewing cups", "Choose only for lawful, brief adult-supervised observation; check ventilation, shade, cleanability and secure release."],
    ["clip on phone macro lens universal", "Clip-on phone macro lenses", "Verify alignment with the exact phone, case and camera, plus working distance, cleaning instructions and return terms."],
  ],
  fieldsketch: [
    ["zippered pencil pouch colored pencils travel", "Zippered field-art pouches", "Compare loaded size, zipper control, interior visibility, cleanability and whether the child can count every tool back in."],
    ["hard shell pencil case portable art supplies", "Slim hard-shell art cases", "Choose protection only after checking loaded weight, hinge and latch durability, tool retention and fit in the real daypack."],
    ["lightweight clipboard storage folio pencil holder", "Clipboard and folio systems", "Use a clipboard when the writing surface earns its bulk; compare clip control, paper protection, edge finish and tool storage."],
  ],
  bootdryers: [
    ["no heat forced air boot dryer", "No-heat forced-air boot dryers", "Compare port fit, airflow, fan noise, cord length, manual access and the footwear maker's permitted drying method."],
    ["boot dryer heat no heat timer", "Heat-or-no-heat boot dryers with timers", "Use heat only when both manuals permit it; verify temperature, timer, clearance, attachments and current safety information."],
    ["passive boot dryer rack absorbent inserts", "Passive boot-drying racks and inserts", "A cord-free option when overnight time is available; compare ventilation, insert reset care, capacity and actual storage space."],
  ],
  kidssleds: [
    ["kids snow saucer sled", "Kids’ snow saucers", "Compare the exact rider limit, handles, construction, current recall status and the lack of directional control before buying."],
    ["kids plastic toboggan sled", "Kids’ toboggan-style sleds", "Verify passenger and weight limits, seated fit, rope instructions, construction and the real hill’s straight runout."],
    ["kids steering snow sled brake", "Kids’ steering sleds", "Check seated reach in winter clothing, control and brake operation, maker limits, inspection steps, packed size and recall status."],
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
  if (path === "guides/family-home-board-games-cooperative-strategy-dexterity-guide.html") return catalog.homeboardgames;
  if (/family boot dryers|forced air.*low heat.*passive|material gate/.test(haystack)) return catalog.bootdryers;
  if (/kids.*sleds|saucer.*toboggan.*steering|sled.*hill gate/.test(haystack)) return catalog.kidssleds;
  if (/aa\/aaa battery system|alkaline.*nimh|battery.*junk drawer/.test(haystack)) return catalog.aabatteries;
  if (/noaa weather radio|same vs basic|hand.crank.*weather/.test(haystack)) return catalog.weatherradio;
  if (/kids.*rain boots|tall pull.on.*chelsea.*insulated|rain.boot.*fit.*dry/.test(haystack)) return catalog.rainboots;
  if (/kids.*winter boots|pac boot.*snow boot.*winter hiker|sock test/.test(haystack)) return catalog.winterboots;
  if (/kids.*snow pants|bibs.*waist.*one.piece|snow.pants.*bathroom/.test(haystack)) return catalog.snowpants;
  if (/family hand warmers|air.activated.*snap.disc.*rechargeable|recall gate/.test(haystack)) return catalog.handwarmers;
  if (/kids.*insulated food jars|10 oz.*14 oz.*16 oz|serving.time temperature/.test(haystack)) return catalog.foodjars;
  if (/kids.*sleeping bags|temperature rating.*pad.first|child.*sleep system.*iso/.test(haystack)) return catalog.kidssleepingbags;
  if (/kids.*fall trail layers|base layer.*fleece.*insulation.*shell|system before brand/.test(haystack)) return catalog.trailclothing;
  if (/walking visibility gear|reflective vest.*bands.*clip light|visibility is not right.of.way/.test(haystack)) return catalog.visibilitygear;
  if (/nature observation kit|magnifying glass.*bug viewer.*macro lens|observe.record.release/.test(haystack)) return catalog.natureobservation;
  if (/field sketch kit|zipper pouch.*hard case.*clipboard|ten.item cap/.test(haystack)) return catalog.fieldsketch;
  if (/what to wear at howe caverns|52.f.*139.stair|bag.free.*howe caverns/.test(haystack)) return catalog.howepacking;
  if (/kids.*hiking gloves|fleece.*shell mittens.*insulated.*gloves|glove.*grip test/.test(haystack)) return catalog.hikinggloves;
  if (/camera.*kids|simple digital.*instant.*rugged|instant.print camera/.test(haystack)) return catalog.kidscameras;
  if (/dry bag|roll.top.*zippered.*phone pouch|waterproof storage/.test(haystack)) return catalog.drybags;
  if (/booster seat|high.back.*backless|harness.*booster/.test(haystack)) return catalog.boosterseats;
  if (/kids.*bike helmet|bicycle helmet.*fit|helmet.*certification/.test(haystack)) return catalog.bikehelmets;
  if (/kids.*trekking poles|adjustable.*fixed.*folding/.test(haystack)) return catalog.trekkingpoles;
  if (/kids.*hiking socks|wool.*synthetic.*cotton.*sock/.test(haystack)) return catalog.hikingsocks;
  if (/family charging station|multiport charger.*power strip.*dock|charging compatibility card/.test(haystack)) return catalog.chargingstations;
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
  if (normalized === "guides/family-packing-cubes-pouches-compression-guide.html") return catalog.packingcubes;
  if (["guides/salmon-river-falls-with-kids.html", "guides/family-pantry-date-label-check-25-minute-plan.html"].includes(normalized)) return null;
  if (normalized === "guides/kids-snowshoes-molded-adjustable-frame-fit-guide.html") return catalog.snowshoes;
  if (["guides/ganondagan-state-historic-site-with-kids.html", "guides/family-coat-pocket-reset-20-minute-system.html"].includes(normalized)) return null;
  if (normalized === "guides/kids-ice-skates-figure-hockey-adjustable-fit-guide.html") return catalog.iceskates;
  if (["guides/great-swamp-conservancy-with-kids.html", "guides/family-recipe-scaling-25-minute-math-lab.html"].includes(normalized)) return null;
  if (["guides/rochester-museum-science-center-with-kids.html", "guides/family-laundry-care-label-sort-25-minute-lesson.html"].includes(normalized)) return null;
  if (["guides/first-cave-tour-with-kids-readiness-plan.html", "guides/old-erie-canal-state-historic-park-with-kids.html"].includes(normalized)) return null;
  if (normalized === "guides/family-day-trip-snack-containers-box-cup-pouch-guide.html") return catalog.snackcontainers;
  if (["guides/fillmore-glen-state-park-with-kids.html", "guides/seven-day-family-backyard-rain-log.html"].includes(normalized)) return null;
  if (normalized === "guides/family-camping-sleeping-pads-foam-self-inflating-air-guide.html") return catalog.campingpads;
  if (["guides/stony-brook-state-park-with-kids.html", "guides/family-time-capsule-30-minute-no-burial-plan.html"].includes(normalized)) return null;
  if (["guides/seward-house-museum-with-kids.html", "guides/family-claim-check-one-headline-20-minute-lesson.html"].includes(normalized)) return null;
  if (normalized === "guides/family-jigsaw-puzzles-piece-size-table-fit-guide.html") return catalog.homejigsaws;
  if (["guides/syracuse-family-membership-break-even-most-zoo.html", "guides/central-rock-gym-syracuse-with-kids-first-visit.html", "guides/sew-four-hole-button-with-kids-family-repair-lesson.html"].includes(normalized)) return null;
  if (["guides/sapsucker-woods-with-kids.html", "guides/family-grocery-receipt-detective-25-minute-math-activity.html"].includes(normalized)) return null;
  if (["privacy.html", "about.html", "404.html"].includes(normalized)) return null;
  if (normalized.startsWith("weekend-")) return null;
  if (["guides/strong-museum-of-play-with-kids.html", "guides/family-foley-sound-effects-lab-30-minutes.html"].includes(normalized)) return null;
  if (["guides/camillus-erie-canal-park-with-kids.html", "guides/paper-bridge-load-test-25-minute-family-stem.html", "guides/onondaga-lake-park-with-kids.html", "guides/family-photo-scavenger-hunt-30-minute-no-posting-plan.html", "guides/carpenters-brook-fish-hatchery-with-kids.html", "guides/seven-night-family-moon-observation-log.html", "guides/everson-museum-with-kids.html", "guides/teach-kids-read-trail-map-25-minute-game.html", "guides/moss-island-with-kids.html", "guides/fall-leaf-pigment-chromatography-family-lab.html", "guides/syracuse-october-family-plans-2026.html", "guides/museum-of-the-earth-with-kids.html", "guides/cardboard-marble-maze-30-minute-family-engineering-build.html", "guides/utica-zoo-with-kids.html", "guides/family-oral-history-interview-30-minute-no-posting-plan.html", "guides/rogers-environmental-education-center-with-kids.html", "guides/paper-helicopter-30-minute-family-flight-lab.html", "guides/lime-hollow-nature-center-with-kids.html", "guides/paper-airplane-distance-lab-25-minute-family-stem.html", "guides/corning-museum-of-glass-with-kids.html", "guides/family-emergency-contact-card-drill-20-minutes.html"].includes(normalized)) return null;
  if (["guides/chimney-bluffs-with-kids.html", "guides/green-lakes-state-park-with-kids.html", "guides/taughannock-falls-with-kids.html", "guides/beaver-lake-nature-center-with-kids.html", "guides/watkins-glen-with-kids.html", "guides/letchworth-state-park-with-kids.html", "guides/fort-ontario-with-kids.html", "guides/family-hotel-room-system.html", "guides/howe-caverns-with-kids.html", "guides/family-lost-kid-plan.html", "guides/montezuma-national-wildlife-refuge-with-kids.html", "guides/family-motion-sickness-car-plan.html", "guides/chittenango-falls-with-kids.html", "guides/family-museum-day-system.html", "guides/rosamond-gifford-zoo-with-kids.html", "guides/family-outdoor-weather-cutoff-plan.html", "guides/clark-reservation-state-park-with-kids.html", "guides/family-bathroom-stop-plan.html", "guides/most-syracuse-with-kids.html", "guides/family-parking-lot-plan.html", "guides/highland-forest-with-kids.html", "guides/pratts-falls-with-kids.html", "guides/multigenerational-family-day-trip-plan.html", "guides/fort-stanwix-with-kids.html", "guides/family-no-cell-service-day-trip-plan.html", "guides/erie-canal-museum-with-kids.html", "guides/family-roadside-breakdown-plan.html", "guides/harriet-tubman-national-historical-park-with-kids.html", "guides/family-tick-check-removal-plan.html", "guides/womens-rights-national-historical-park-with-kids.html", "guides/family-hotel-fire-escape-plan.html", "guides/cornell-botanic-gardens-with-kids.html", "guides/family-wildlife-encounter-distance-plan.html", "guides/buttermilk-falls-state-park-with-kids.html", "guides/family-food-allergy-day-trip-plan.html", "guides/baltimore-woods-with-kids.html", "guides/family-medicine-away-from-home-plan.html", "guides/after-school-nature-walk-30-minute-plan.html", "guides/family-library-night-45-minute-plan.html", "guides/iroquois-museum-with-kids.html", "guides/family-calendar-reset-20-minute-plan.html", "guides/central-new-york-family-trail-picker.html", "guides/flashlight-shadow-lab-30-minute-family-science.html", "guides/stone-quarry-hill-art-park-with-kids.html", "guides/neighborhood-sound-map-20-minute-family-activity.html", "guides/syracuse-family-outing-picker-most-zoo-erie-canal-museum.html", "guides/living-room-picnic-30-minute-family-plan.html", "guides/saratoga-national-historical-park-with-kids.html", "guides/family-home-fire-escape-drill-20-minute-plan.html"].includes(normalized)) return null;
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
  const hadGeneratedModule = original.includes(markerStart);
  const cleaned = original.replace(new RegExp(`${markerStart}[\\s\\S]*?${markerEnd}\\s*`, "g"), "");
  // Several early guides and the gear hub have hand-curated commerce modules.
  // Preserve those exact modules instead of stacking a generated block below them.
  const products = /class=["']commerce-module["']/.test(cleaned) ? null : productsFor(path, cleaned);
  if (!products) {
    const preserved = /class=["']commerce-module["']/.test(cleaned) || !hadGeneratedModule
      ? cleaned
      : cleaned.replace(/(?:\r?\n[ \t]*)?<link rel="stylesheet" href="(?:\.\.\/)*assets\/css\/affiliate-commerce\.css">(?:[ \t]*(?=\r?\n))?/g, "");
    if (preserved !== original) writeFileSync(file, preserved);
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
