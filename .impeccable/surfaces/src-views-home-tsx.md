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

STORY: Visitor sees what it is (100-question Big Five test, 15 minutes, $9.99, a licensed therapist), sees the five traits explained plainly and what a report looks like, trusts the science and the person, and takes the test.

FIRST VIEWPORT: Desktop: nav bar (wordmark left, 4 links + priced button right); left half the headline in Archivo Expanded Black ~84px, one sentence of offer, navy "Take the test — $9.99" button, five-colour strip; right half a large nested-square plate of the five trait colours. Mobile: headline, offer, button above the fold, plate below.

FORM: Interaction of Color (Albers colour plates), position 3 of 7 on the ordered list; seed: 4f8db146ca473153. Signature interaction: the hero plate's nested squares re-proportion when you hover/tap a trait in the strip, showing how a different mix reads; reduced motion shows it static.

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance
