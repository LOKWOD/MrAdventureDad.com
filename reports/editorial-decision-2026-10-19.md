# October 19, 2026 — publication decision and preflight

## Inventory and duplication control

The complete pre-publication inventory is `inventory-2026-10-19.json`: 156 HTML pages, with titles, slugs, descriptions, section angles, explicit keywords, image associations and commercial markup. Reviewed the complete inventory and the previous fourteen days, including October 18's Sapsucker Woods, board-game and receipt-detective batch. No existing membership break-even tool, Syracuse first-climbing-visit plan or supervised four-hole-button lesson serves the new intents. No destination, product image or title was lightly renamed. The three new conceptual assets are byte-distinct from the existing credited collection.

The October 17–18 weekly roundup is an expired archive, not this week's recommendation. Its URL and archive access remain intact. The homepage's existing time-window lead is refreshed to October 19; no competing dated roundup or unverified event is created. October 18's daily cards move into the existing archive instead of stacking another current lead.

## Search Console decision

Read both `reports/latest.json` and `reports/latest.md` in `LOKWOD/site-analytics`. Generated October 14, 2026; reporting window September 14–October 11; property `mradventuredad.com`; no property error. The five-day-old report is usable: 747 impressions, nine clicks, 1.2% CTR, average position 11.9.

Howe Caverns has 98 impressions, two clicks, average position 8.90; MOST has 30 impressions, one click, average position 16.67. This modest, coherent paid-attraction signal supports one useful annual-purchase decision asset rather than another museum itinerary. It is not evidence of membership-query demand or a reason to rewrite working titles. The membership tool links into MOST, zoo, museum-system and outing-picker coverage; three established pages now link contextually back to it (before: zero).

Ignored as a new-topic mandate: the already-served binocular query (42 impressions at about position 1.21), travel-bag six-impression/two-click sample, one-impression hydration signal and branded noise. The sitemap reports zero indexed out of 140 submitted URLs, despite actual clicks and impressions; this is a discovery/reporting warning, not proof that nothing is indexed. Strengthened hubs, sitemap and nine reciprocal crawl paths rather than publishing isolated URLs.

## Balanced portfolio

1. **Data-led — Syracuse Family Membership Math: MOST, Zoo or Pay as You Go?** Original editable, integer-cent calculator and transparent eligibility/exclusion comparison. Purchase intent uses the actual operators, with no membership commission. Different purpose from existing attraction itineraries.
2. **Authority-expansion — Central Rock Gym Syracuse With Kids: Book the Help, Rent the Gear, Stop Early.** A first-active-sport call card and short visit envelope; local primary sources, rental-first purchasing and staff instruction, not an online climbing-technique tutorial. No invented price, instructor availability, physical access or first-person visit.
3. **Exploration — Sew a Button With Kids: Practice on Scrap, Repair One Shirt, Count the Needle Back.** A no-new-spend home repair session with adult roles, primary technique references, a paper alternative and counted-tool closeout. Not another destination or gear-shopping page.

## Authority and trust action

Created a reusable membership break-even asset with editable household costs, clear exact-tie behavior, winter-pricing caveat and source-dated examples. Added an eight-question first-climb booking card and a scrap-first repair/inspection protocol. Nine established guides now provide contextual entry paths. Every new page separates operator facts from editorial timing/age suggestions, supplies a review date, methodology and public correction route. Two exact-match, factual-correction/resource opportunities are logged in `authority-opportunities.md`; no outreach sent.

## Source and monetization checks

Primary references: MOST admission/membership; Rosamond Gifford Zoo admission/membership; ASTC passport FAQ; Central Rock Gym Syracuse, FAQ, first-time guide, instruction/day-pass routes, parking PDF and event-closure advisory; NWS Binghamton; UF/IFAS 4-H button lesson; Patagonia/iFixit four-hole repair guide. Fifteen original outgoing source/purchase routes returned HTTP 200 during preflight; the subsequently added CRG competition advisory was separately verified against its live official page. Dates and variable eligibility/booking terms remain explicit in copy.

The batch has zero new paid links and zero affiliate/product images. Membership, day-pass and instruction routes are ordinary unpaid provider links and say so visibly; the sewing lesson does not manufacture a kit purchase. Preserve all 210 existing active affiliate links, approved IDs, disclosures and tracking. The established injector explicitly excludes these three slugs from unrelated generic commerce modules. Existing CNAME, analytics, newsletter and visitor-beacon behavior remain unchanged.

## Images and rebuild

Three original 1600×900 WebP conceptual editorial images, eleven placements: three heroes, three homepage cards, one destination card, one gear card and three credit cards. No scene is presented as a real attraction, product, family visit or stitch diagram. Credits, accessible alt text and social-image descriptions are maintained in the established manifest and credit page.

Actual assets were visually inspected before publication against the final titles, copy, captions and provider destinations. An initial sewing variant incorrectly showed a headed pin; it was rejected and replaced. The selected corrected asset exposes no pin or needle. The climbing caption does not claim an image of Central Rock Gym. A second rendered-image pass on all three live pages and changed discovery surfaces remains a release verification task; it is not claimed here in advance.

Source of record: `scripts/content-2026-10-19.mjs`. Regenerate with `node scripts/publish-daily-2026-10-19.mjs`; this reads the retained versioned source renderer, not generated HTML. Rebuild is idempotent. Then run:

```
node scripts/test-membership-break-even.mjs
node scripts/inject-affiliate-commerce.mjs . guides/syracuse-family-membership-break-even-most-zoo.html
node scripts/inject-affiliate-commerce.mjs . guides/central-rock-gym-syracuse-with-kids-first-visit.html
node scripts/inject-affiliate-commerce.mjs . guides/sew-four-hole-button-with-kids-family-repair-lesson.html
node scripts/audit-daily-2026-10-19.mjs
node scripts/audit-site-integrity.mjs
git diff --check
```

Preflight passes: calculator examples/edge cases, exactly three substantial new pages, unique titles/slugs/images, canonical/social/schema, local links/assets/credits, responsive hero dimensions, nine reciprocal links, current homepage lead, 159-page sitemap and all 210 existing affiliate links. Full integrity audit checks 159 HTML pages and 630 image placements. Deployment and live verification must be recorded after completion, not inferred from these local checks.
