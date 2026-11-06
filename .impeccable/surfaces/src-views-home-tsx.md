---
version: 1
slug: "src-views-home-tsx"
primary_target: "src/views/Home.tsx"
related_targets: ["src/views/About.tsx","src/views/Faqs.tsx","src/views/Contact.tsx","src/views/BuyTest.tsx","src/views/Quiz.tsx","src/views/Results.tsx"]
---

# Marketing site (home, about, FAQs, contact, buy) + test & results

Mode: Persuade (marketing pages); test and results inherit the world in Operate/Read register.
Audience: adults, mostly on phones, deciding in one visit whether a $9.99 Big Five test is worth it.
Action: Take the test — $9.99 (routes to /buy).
Proof on hand: real citations, a licensed clinician, real report content. No testimonials, no refund policy.
Constraints: scoring, payment, auth, admin unchanged; Elliot's tests stay green.

## Direction contract

THESIS: Your traits only make sense together, like Albers' colours: you are five colours in your own proportion. Refuses the wellness-stock-photo hero and the cartoon-character test site.

OWN-WORLD: Flat ink colour fields on a neutral grey card ground (#EBECED, like the grey mount of an Albers plate; changed from warm #F3EFE6 to avoid the cream default) with navy ink (#15172B). The five trait colours are the only colours, always in the same order (E red, N purple, A blue, C teal, O green), used as whole fields and nested-square plates, never as gradients, shadows or glows. Square corners everywhere. One family, Archivo: expanded 125% black for display, normal width for text. Raises: five identical trait plates read as one row (VU bridge); full 0–100 range always faint behind a score, all answer options visible with the choice struck forward (cathode stack); every plate carries a strict label band: name, two aspects, one plain line (brine calendar).

STORY: The right man (bright, a little lost, often outside a church) sees how he is built by playing with his own mix, hears why it matters in the Bible's bigger story (God's imagers), opens each trait, sees the offer and the report, meets Patrick (LPC, personality researcher, biblical scholar), and takes the test. A results conversation is the follow-up, never counseling.

FIRST VIEWPORT (v2, concept B 'Shape yourself', chosen by Patrick 2026-11-05): desktop left column sticky: h1 'Find out how you're built. Then find out what for.' in Archivo Expanded Black, one credential sentence, navy 'Take the test — $9.99' link, sample-report link, facts line. Right column: the live sampler, a large nested-square plate driven by five trait sliders (square thumbs in trait colors), tagged 'Preview, not a result', with an aria-live hint giving the plain lower/higher reading. Phone: headline, offer and button first, sampler below. Next sections: faith (ink band, stacked questions landing on 'Understand the top. Master the bottom.'), trait explorer (five solid color tabs, selected widens; phone shows initials), how it works, sample report, who's behind it, close, phone dock.

FORM: Interaction of Color (Albers colour plates), position 3 of 7 on the ordered list; seed: 4f8db146ca473153. Signature interaction: the hero plate's nested squares re-proportion when you hover/tap a trait in the strip, showing how a different mix reads; reduced motion shows it static.

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance
