import { appendFileSync, readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { pages } from "./content-2026-10-08.mjs";

const root = resolve(process.argv[2] || ".");
const date = "2026-10-08";
const read = path => readFileSync(resolve(root, path), "utf8");
const write = (path, text) => writeFileSync(resolve(root, path), text);
const imageUrl = value => `https://mradventuredad.com/assets/images/photos/${value}`;
const imageSrc = value => `../assets/images/photos/${value}`;
const hubImage = value => `assets/images/photos/${value}`;

const pageHtml = page => `<!DOCTYPE html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${page.metaTitle} | Mr Adventure Dad</title><meta name="description" content="${page.description}"><link rel="canonical" href="https://mradventuredad.com/guides/${page.slug}.html"><meta property="og:type" content="article"><meta property="og:site_name" content="Mr Adventure Dad"><meta property="og:title" content="${page.title}"><meta property="og:description" content="${page.description}"><meta property="og:url" content="https://mradventuredad.com/guides/${page.slug}.html"><meta property="og:image" content="${imageUrl(page.image)}"><meta name="twitter:card" content="summary_large_image"><meta name="twitter:title" content="${page.title}"><meta name="twitter:description" content="${page.description}"><meta name="twitter:image" content="${imageUrl(page.image)}"><meta property="article:published_time" content="${date}"><meta property="article:modified_time" content="${date}"><link rel="stylesheet" href="../assets/css/style.css?v=20261008"><script defer src="../assets/js/site.js"></script><script type="application/ld+json">${JSON.stringify({"@context":"https://schema.org","@type":["Article",page.type],headline:page.title,description:page.description,datePublished:date,dateModified:date,mainEntityOfPage:`https://mradventuredad.com/guides/${page.slug}.html`,author:{"@type":"Organization",name:"Mr Adventure Dad"},publisher:{"@type":"Organization",name:"Mr Adventure Dad"},image:imageUrl(page.image)})}</script><link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link href="https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&family=Oswald:wght@500;600;700&display=swap" rel="stylesheet"></head><body><header class="site-header"><a class="brand" href="../index.html" aria-label="Mr Adventure Dad home"><span class="brand-mark">MAD</span><span>MR <b>ADVENTURE</b> DAD</span></a><button class="menu-toggle" type="button" aria-label="Open menu" aria-expanded="false" aria-controls="site-navigation"><span aria-hidden="true">☰</span></button><nav class="nav" id="site-navigation" aria-label="Primary navigation"><a href="../adventures.html">Adventures</a><a href="../destinations.html">Destinations</a><a href="../outdoors.html">Outdoors</a><a href="../gear.html">Gear</a><a href="../about.html">About</a></nav></header><main class="article"><p class="eyebrow">${page.eyebrow}</p><h1>${page.title}</h1><p class="dek">${page.dek}</p><figure class="${page.heroClass}"><img class="article-hero" src="${imageSrc(page.image)}" alt="${page.alt}" decoding="async" loading="eager" fetchpriority="high"><figcaption>${page.caption}</figcaption></figure>${page.body}<section class="cta"><p class="kicker">MAKE THE DAY COUNT</p><h2>Useful beats heroic.</h2><p>Build the plan your family can finish well, then leave enough energy for the next part of the day.</p><a class="btn" href="../adventures.html">More family plans</a></section></main><footer><div class="wrap copyright">© <span id="year"></span> Mr Adventure Dad. <a href="../index.html">Home</a> · <a href="../privacy.html">Privacy</a></div><p class="footer-credit-link"><a href="../photo-credits.html">Photo credits</a></p></footer><script defer src="https://static.cloudflareinsights.com/beacon.min.js" data-cf-beacon='{"token":"538731cceb42422db0560ea6680ac375"}'></script><!-- LOKWOD Website Visitor Beacon --><script defer src="https://lokwod-visitor-beacon.syracuseappraiser.workers.dev/beacon.js" data-site="mr-adventure-dad"></script><!-- End LOKWOD Website Visitor Beacon --></body></html>`;

for (const page of pages) write(`guides/${page.slug}.html`, pageHtml(page));

const markerStart = "<!-- DAILY 2026-10-08 -->";
const markerEnd = "<!-- END DAILY 2026-10-08 -->";
const upsertBefore = (path, needle, block) => {
  const clean = read(path).replace(new RegExp(`${markerStart}[\\s\\S]*?${markerEnd}`, "g"), "");
  if (!clean.includes(needle)) throw new Error(`${path}: insertion point missing`);
  write(path, clean.replace(needle, `${markerStart}${block}${markerEnd}${needle}`));
};

const homepageLead = `<section class="now-plans wrap" aria-labelledby="now-plans-title"><div class="now-plans-head"><div><p class="kicker">FRESH IDEAS · OCTOBER 8, 2026</p><h2 id="now-plans-title">Pick the time you actually have.</h2><p>Useful plans for tonight, the weekend, a break day or home. Check official hours, weather, closures and product instructions before committing.</p></div><a href="adventures.html">Browse all adventures →</a></div><div class="now-plans-grid"><article class="now-plan"><span>TONIGHT · 30 MINUTES · FREE</span><h3><a href="guides/${pages[2].slug}.html">Shoot six clues, post nothing</a></h3><p>Use one device, keep five frames and end with a privacy check.</p></article><article class="now-plan"><span>AFTER SCHOOL · 90 MINUTES–2 HOURS</span><h3><a href="guides/${pages[0].slug}.html">Pick one Onondaga Lake zone</a></h3><p>Start at Wegmans Landing, choose walking or wheels, and turn back early.</p></article><article class="now-plan"><span>THIS WEEKEND · VERIFIED EVENTS</span><h3><a href="weekend-october-10-11-2026.html">Use the October 10–11 family guide</a></h3><p>Compare the apple festival, sky ride, historic village, foliage train, farm and gorge.</p></article><article class="now-plan"><span>BREAK DAY · LOCAL + FREE CORE</span><h3><a href="guides/${pages[0].slug}.html">Run the playground-and-trail plan</a></h3><p>Check closures, use the family restroom and leave the other park zones for later.</p></article><article class="now-plan"><span>AT HOME · 20-MINUTE FIT TEST</span><h3><a href="guides/${pages[1].slug}.html">Test the whole sleep system</a></h3><p>Check pad, bag, zipper and self-exit before buying another layer of insulation.</p></article><article class="now-plan"><span>LOW-ENERGY BACKUP · 10 MINUTES</span><h3><a href="guides/${pages[2].slug}.html">Find three frames from one chair</a></h3><p>Use shape, texture and a two-object story without leaving the room.</p></article></div></section>`;
let home = read("index.html");
home = home.replace(new RegExp(`${markerStart}[\\s\\S]*?${markerEnd}`, "g"), "");
const priorPattern = /<!-- DAILY 2026-10-07 -->[\s\S]*?<!-- END DAILY 2026-10-07 -->/g;
const priorBlock = home.match(priorPattern)?.[0];
home = home.replace(priorPattern, "");
if (priorBlock && !home.includes(priorBlock) && home.includes('<div class="field-archive-content">')) home = home.replace('<div class="field-archive-content">', `<div class="field-archive-content">${priorBlock}`);
if (!/<section class="now-plans wrap"[\s\S]*?<section class="intro wrap">/.test(home)) throw new Error("index.html: current time-window lead missing");
home = home.replace(/<section class="now-plans wrap"[\s\S]*?<section class="intro wrap">/, `${homepageLead}<section class="intro wrap">`);
const homeCards = `${markerStart}<section class="stories wrap"><div class="section-head"><div><p class="kicker">NEW FAMILY FIELD PLANS</p><h2>Pick the zone. Read the claim. Keep five frames.</h2></div></div><div class="story-grid"><article class="story-card"><img src="${hubImage(pages[0].image)}" alt="Conceptual lakefront day setup with helmet, daypack, water, snack and jacket beside a paved trail" decoding="async" loading="lazy"><div><span>LOCAL OUTING · LIVERPOOL</span><h3><a href="guides/${pages[0].slug}.html">Onondaga Lake Park with kids</a></h3><p>Use Wegmans Landing as the base, choose one movement mode and protect the early exit.</p></div></article><article class="story-card"><img src="${hubImage(pages[1].image)}" alt="Three unbranded child-size sleeping bag categories beside a foam sleeping pad" decoding="async" loading="lazy"><div><span>CAMPING · BUYING GUIDE</span><h3><a href="guides/${pages[1].slug}.html">Kids’ sleeping bags without rating theater</a></h3><p>Start with the pad, present fit and self-exit—not a child temperature number the adult ISO standard does not cover.</p></div></article><article class="story-card"><img src="${hubImage(pages[2].image)}" alt="Conceptual photo hunt with a dark-screen phone, generic camera, six icon cards and safe household objects" decoding="async" loading="lazy"><div><span>AFTER SCHOOL · 30 MINUTES · FREE</span><h3><a href="guides/${pages[2].slug}.html">The zero-posting photo scavenger hunt</a></h3><p>Shoot six clues, keep five frames and delete private details before putting the device away.</p></div></article></div></section>${markerEnd}`;
if (!home.includes('<details class="field-archive wrap">')) throw new Error("index.html: archive marker missing");
home = home.replace('<details class="field-archive wrap">', `${homeCards}<details class="field-archive wrap">`);
write("index.html", home);

upsertBefore("adventures.html", "<!-- MAD AFFILIATE COMMERCE -->", `<section class="content-section alt"><div class="wrap"><p class="kicker">THREE DIFFERENT FAMILY NEEDS</p><div class="simple-list"><a href="guides/${pages[0].slug}.html">Pick one Onondaga Lake Park zone <b>→</b></a><a href="guides/${pages[1].slug}.html">Choose a kids’ sleeping bag by the whole system <b>→</b></a><a href="guides/${pages[2].slug}.html">Run a 30-minute zero-posting photo hunt <b>→</b></a></div></div></section>`);
upsertBefore("destinations.html", "</main>", `<section class="content-section alt"><div class="wrap"><p class="kicker">LIVERPOOL · LAKEFRONT DAY</p><div class="card-grid"><article class="card"><img src="${hubImage(pages[0].image)}" alt="Conceptual lakefront family day setup with helmet, daypack, water and a folded jacket" decoding="async" loading="lazy"><div><span>PLAYGROUND · TRAIL · ONE ZONE</span><h3><a href="guides/${pages[0].slug}.html">Onondaga Lake Park with kids</a></h3><p>Use Wegmans Landing as the base, separate walking from wheels and check closures before unloading.</p></div></article></div></div></section>`);
upsertBefore("outdoors.html", "</main>", `<section class="content-section alt"><div class="wrap"><p class="kicker">LOCAL MOVEMENT · CAMP NIGHT</p><div class="simple-list"><a href="guides/${pages[0].slug}.html">Choose one Onondaga Lake Park trail mode <b>→</b></a><a href="guides/${pages[1].slug}.html">Build the child sleep system from the pad up <b>→</b></a></div></div></section>`);
upsertBefore("gear.html", "</main>", `<section class="content-section alt"><div class="wrap"><p class="kicker">KIDS’ SLEEPING BAGS · CLAIM BEFORE COLOR</p><div class="card-grid"><article class="card"><img src="${hubImage(pages[1].image)}" alt="Three unbranded child-size sleeping bag shapes beside a foam pad" decoding="async" loading="lazy"><div><span>RATING · FIT · FILL · PAD</span><h3><a href="guides/${pages[1].slug}.html">Do not treat a child rating as an ISO promise</a></h3><p>Compare present fit, self-exit, insulation and the complete pad-and-bag system.</p></div></article></div></div></section>`);

const related = {
  "guides/syracuse-family-day-trip-guide.html": `<aside class="note"><strong>Want the easiest lakefront base?</strong> The <a href="${pages[0].slug}.html">Onondaga Lake Park family plan</a> uses Wegmans Landing, one trail mode and a firm turnaround.</aside>`,
  "guides/family-day-trip-system.html": `<aside class="note"><strong>Need a local one-zone example?</strong> The <a href="${pages[0].slug}.html">Onondaga Lake Park plan</a> separates playground, walking, wheels and west-shore days.</aside>`,
  "guides/family-bike-ride-plan.html": `<aside class="note"><strong>Ready for a local paved out-and-back?</strong> Use the <a href="${pages[0].slug}.html">Onondaga Lake Park zone plan</a> and confirm the trail’s current wheel rules and closures first.</aside>`,
  "guides/family-camping-sleep-system-guide.html": `<aside class="note"><strong>Choosing the child’s bag?</strong> The <a href="${pages[1].slug}.html">kids’ sleeping-bag guide</a> explains why adult ISO ratings do not predict child comfort and why the pad comes first.</aside>`,
  "guides/one-night-camping-with-kids.html": `<aside class="note"><strong>Test the night before the campsite:</strong> Use the <a href="${pages[1].slug}.html">kids’ sleeping-bag full-system check</a> for pad, present fit, zipper and self-exit.</aside>`,
  "guides/family-headlamps-flashlights-lanterns.html": `<aside class="note"><strong>Light is only one part of the night:</strong> Pair the child’s headlamp with the <a href="${pages[1].slug}.html">pad-first kids’ sleeping-bag decision</a>.</aside>`,
  "guides/kids-camera-simple-digital-instant-rugged-guide.html": `<aside class="note"><strong>Use the camera before buying another one:</strong> The <a href="${pages[2].slug}.html">30-minute zero-posting photo hunt</a> works with one family-controlled device and six simple clues.</aside>`,
  "guides/after-school-nature-walk-30-minute-plan.html": `<aside class="note"><strong>Swap the nature clue for a frame:</strong> The <a href="${pages[2].slug}.html">family photo scavenger hunt</a> adds a privacy check and a five-photo edit.</aside>`,
  "guides/family-nature-observation-kit-magnifier-bug-viewer-macro-lens.html": `<aside class="note"><strong>Turn observation into a short edit:</strong> Use the <a href="${pages[2].slug}.html">zero-posting photo hunt</a> to practice shape, texture and detail without disturbing wildlife.</aside>`
};
for (const [path, block] of Object.entries(related)) upsertBefore(path, "</main>", block);

for (const path of ["about.html","adventures.html","destinations.html","gear.html","outdoors.html"]) write(path, read(path).replace(/href="assets\/css\/style\.css(?:\?v=\d+)?"/, 'href="assets/css/style.css?v=20261008"'));

let sitemap = read("sitemap.xml").replace(/  <url><loc>https:\/\/mradventuredad\.com\/guides\/(?:onondaga-lake-park-with-kids|kids-sleeping-bag-temperature-rating-fit-fill-guide|family-photo-scavenger-hunt-30-minute-no-posting-plan)\.html<\/loc><lastmod>[^<]+<\/lastmod><\/url>\n/g, "");
const rows = pages.map(page => `  <url><loc>https://mradventuredad.com/guides/${page.slug}.html</loc><lastmod>${date}</lastmod></url>`).join("\n");
sitemap = sitemap.replace("</urlset>", `${rows}\n</urlset>`);
sitemap = sitemap.replace(/(<loc>https:\/\/mradventuredad\.com\/(?:<\/loc>|(?:index|adventures|destinations|gear|outdoors|photo-credits)\.html<\/loc>)<lastmod>)[^<]+/g, `$1${date}`);
write("sitemap.xml", sitemap);

const credits = JSON.parse(read("assets/images/credits.json"));
credits["assets/images/photos/onondaga-lake-park-family-plan.webp"] = {title:"Conceptual Onondaga Lake Park family planning setup",creator:"Mr Adventure Dad Editorial Desk with OpenAI image generation",source:"Original AI-assisted editorial photography",license:"Copyright Mr Adventure Dad",verified:date,notes:"Conceptual generic lakefront planning scene; not a photograph of Onondaga Lake Park, a park facility, landmark or official route map."};
credits["assets/images/photos/kids-sleeping-bag-categories.webp"] = {title:"Kids’ sleeping-bag shape categories",creator:"Mr Adventure Dad Editorial Desk with OpenAI image generation",source:"Original AI-assisted editorial photography",license:"Copyright Mr Adventure Dad",verified:date,notes:"Conceptual unbranded rectangular, mummy and youth sleeping bags; no product, insulation, temperature claim, certification or performance was tested or endorsed."};
credits["assets/images/photos/family-photo-scavenger-hunt.webp"] = {title:"Family photo scavenger-hunt setup",creator:"Mr Adventure Dad Editorial Desk with OpenAI image generation",source:"Original AI-assisted editorial photography",license:"Copyright Mr Adventure Dad",verified:date,notes:"Conceptual generic devices and icon clues; no child, private information, social interface or identifiable product is shown."};
write("assets/images/credits.json", `${JSON.stringify(credits, null, 2)}\n`);

upsertBefore("photo-credits.html", "</section><h2>Additional editorial photography</h2>", `<article class="photo-credit-card"><img src="${hubImage(pages[0].image)}" alt="Conceptual lakefront family day setup with helmet, daypack, water and jacket" loading="lazy" decoding="async"><div><h2>Conceptual Onondaga Lake Park family plan</h2><p>Original AI-assisted editorial photograph created for Mr Adventure Dad.</p><p>Generic lakefront scene only; not Onondaga Lake Park, a facility, landmark or official map.</p></div></article><article class="photo-credit-card"><img src="${hubImage(pages[1].image)}" alt="Three unbranded child-size sleeping bag shapes beside a foam pad" loading="lazy" decoding="async"><div><h2>Kids’ sleeping-bag categories</h2><p>Original AI-assisted editorial photograph created for Mr Adventure Dad.</p><p>Unbranded shapes only; no product, rating, insulation or performance was tested or endorsed.</p></div></article><article class="photo-credit-card"><img src="${hubImage(pages[2].image)}" alt="Conceptual photo hunt with generic devices, six icon cards and safe household objects" loading="lazy" decoding="async"><div><h2>Family photo scavenger hunt</h2><p>Original AI-assisted editorial photograph created for Mr Adventure Dad.</p><p>No child, private information, social interface or identifiable product is shown.</p></div></article>`);

const editorialReport = `# Editorial decision record — October 8, 2026

## Inventory and duplication gate

The production inventory contained 122 HTML documents, 105 guide pages, 122 sitemap URLs and 333 tracked files before this batch. Every guide title, slug, primary subject, search intent, destination, commercial category and image reference was checked, with a separate review of the September 24–October 8 publication window. The separately published October 10–11 roundup already owns this week’s event intent; none of today’s pages is an event roundup or repeats one of its six featured plans. The Wegmans-Landing-first Onondaga Lake Park itinerary, child-specific sleeping-bag claim guide and zero-posting photo hunt were absent and answer distinct reader questions.

## Search Console decision

The private \`LOKWOD/site-analytics\` report was generated October 7, 2026 for the September 7–October 4 window, so it was one day old. MrAdventureDad.com recorded 689 impressions, 7 clicks, 1.02% CTR and average position 10.55. The family camping sleep-system page had 13 impressions, one click, 7.69% CTR and average position 8.0; that coherent page-level signal supported one narrower child-bag decision guide with a clearly separate intent and reciprocal links. Howe Caverns (88 impressions, position 8.86), Clark Reservation (35 impressions, position 16.09) and MOST (23 impressions, position 13.74) already received focused support in the October 2–4 batches, so they were deliberately not chased again. The family travel-bag page’s two clicks came from only four impressions and was ignored as too small to justify a new packing-cube page. The sitemap row reported 0 indexed of 114 submitted despite observable page impressions and clicks; that contradiction was treated as reporting lag or API inconsistency, not proof of zero indexing. Crawl paths were strengthened without inventing an emergency.

## Portfolio labels

- **Data-led — Kids’ Sleeping Bags:** uses the camping sleep-system page’s position-8 signal for a non-cannibalizing, child-specific ratings, fit and pad guide. It adds three precise Amazon category searches only after a no-buy and home-test path.
- **Authority-expansion — Onondaga Lake Park With Kids:** adds a first-visit decision framework for a major local park, grounded in current county pages and connected to established Syracuse, biking and day-trip guides.
- **Exploration — 30-Minute Family Photo Scavenger Hunt:** creates a no-spend school-night activity with a six-clue observation card, local-only default and privacy-first five-photo edit.

The trio is diverse by setting, search intent, format and transaction: one local destination plan, one commercial camping decision and one no-purchase at-home activity. No item competes with the October 10–11 event roundup.

## Authority action

The sleeping-bag page turns an easy-to-miss primary-source fact—the adult ISO standard explicitly excludes children and babies—into a reusable claim-checking matrix, pad-first protocol and full-system home test. The Onondaga page adds a citation-ready one-zone decision card that reconciles trail mode, dog-season and closure rules. Nine reciprocal contextual links strengthen the local Syracuse, family camping and practical photo-learning clusters. These assets improve the site even if no external link is earned.

## Qualified authority opportunities — log only, no outreach sent

1. **Onondaga County Parks**

   Target: [Onondaga Lake Park official page](https://onondagacountyparks.com/parks/onondaga-lake-park/) and parks@onondaga.gov.

   Asset match: the Wegmans-Landing-first family itinerary, trail-mode matrix and current dog/closure checks.

   Honest pitch angle: ask staff to correct any access or seasonal-rule detail, then consider the independent guide only if they maintain a family-planning resource list; disclose the site’s commercial nature.

2. **Family Times of Central New York**

   Target: [Family Times CNY](https://familytimescny.com/) and the public contact route listed on the site.

   Asset match: the local park decision card and no-spend, privacy-first photo activity.

   Honest pitch angle: offer either resource for factual review or optional editorial reference when a genuinely relevant family-planning story is being assembled; no reciprocal link request.

3. **Camp New York**

   Target: [Camp New York](https://www.campnewyork.com/) and info@campnewyork.com.

   Asset match: the child sleeping-bag claim checklist, ISO scope note and pad-first home-test protocol.

   Honest pitch angle: ask whether the independent safety-oriented checklist could help families preparing for a first campground stay; request technical corrections, not endorsement or a paid placement.

## Image gate before publication

Three original editorial WebP assets were visually inspected at full resolution against the final title, page copy, captions, alt text, credits and scope. The lakefront image is explicitly a generic planning scene and not Onondaga Lake Park or a route map. The sleeping-bag image clearly shows three unbranded shape categories beside a pad without product or rating claims. The photo-hunt image shows generic devices, icon-only clues and ordinary household objects with no child or private information. There are zero affiliate/product images. A second rendered inspection is required on all live page and hub placements after deployment.
`;
write("reports/editorial-decision-2026-10-08.md", editorialReport);

const searchLog = `\n# 2026-10-08\n\n- Report generated: 2026-10-07; current window 2026-09-07 through 2026-10-04.\n- Used: family camping sleep system, 13 impressions / 1 click / 7.69% CTR / position 8.0, for one distinct child-specific sleeping-bag ratings, fit and pad guide with reciprocal links; the established broad sleep-system URL stayed stable.\n- Ignored: Howe Caverns, Clark Reservation and MOST already received focused support on October 2–4; the travel-bag page’s 2 clicks came from only 4 impressions and was too small to justify a packing-cube page.\n- Discovery: strengthened homepage, hubs, sitemap and nine reciprocal paths while treating the reported 0 indexed / 114 submitted sitemap row as inconsistent with observable impressions, not as proof of zero indexing.\n- Portfolio: one data-led camping buying decision, one local destination authority expansion and one no-spend school-night exploration. The October 10–11 roundup remains the sole page for this week’s event intent.\n`;
const existingLog = read("reports/search-console-editorial-log.md");
if (!existingLog.includes("# 2026-10-08")) appendFileSync(resolve(root, "reports/search-console-editorial-log.md"), searchLog);

console.log(`Published ${pages.length} source-of-record HTML pages for ${date}.`);
