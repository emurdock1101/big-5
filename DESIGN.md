---
name: Personality+
description: A Big Five test drawn as an Albers colour plate; five trait fields in fixed order on a grey mount.
colors:
  sheet: "#ebeced"
  sheet-deep: "#dcdee1"
  paper: "#ffffff"
  ink: "#15172b"
  ink-hover: "#2a2d4a"
  ink-soft: "#4a4c60"
  rule: "#c3c6cc"
  footer-muted: "#b9bacb"
  footer-rule: "#34375a"
  footer-outline: "#4a4d70"
  extraversion: "#ed5362"
  neuroticism: "#9a338e"
  agreeableness: "#3a81cd"
  conscientiousness: "#00c9b7"
  openness: "#344b47"
  extraversion-text: "#b52637"
  agreeableness-text: "#255f9e"
  conscientiousness-text: "#00756b"
typography:
  display:
    fontFamily: "Archivo, system-ui, sans-serif"
    fontSize: "clamp(42px, 5.6vw, 72px)"
    fontWeight: 850
    lineHeight: 0.98
    letterSpacing: "-0.02em"
    fontVariation: "'wdth' 125"
  headline:
    fontFamily: "Archivo, system-ui, sans-serif"
    fontSize: "clamp(32px, 4vw, 56px)"
    fontWeight: 850
    lineHeight: 0.98
    letterSpacing: "-0.02em"
    fontVariation: "'wdth' 125"
  title:
    fontFamily: "Archivo, system-ui, sans-serif"
    fontSize: "clamp(22px, 2vw, 28px)"
    fontWeight: 850
    lineHeight: 1.1
    letterSpacing: "-0.02em"
    fontVariation: "'wdth' 125"
  numeral:
    fontFamily: "Archivo, system-ui, sans-serif"
    fontSize: "56px"
    fontWeight: 850
    lineHeight: 1
    fontVariation: "'wdth' 125"
  lede:
    fontFamily: "Archivo, system-ui, sans-serif"
    fontSize: "clamp(19px, 1.6vw, 22px)"
    fontWeight: 400
    lineHeight: 1.5
  body:
    fontFamily: "Archivo, system-ui, sans-serif"
    fontSize: "18px"
    fontWeight: 400
    lineHeight: 1.55
    fontFeature: "'tnum'"
  small:
    fontFamily: "Archivo, system-ui, sans-serif"
    fontSize: "15px"
    fontWeight: 400
    lineHeight: 1.55
  label:
    fontFamily: "Archivo, system-ui, sans-serif"
    fontSize: "13px"
    fontWeight: 700
    lineHeight: 1.2
    fontVariation: "'wdth' 80"
rounded:
  none: "0px"
spacing:
  gutter: "clamp(16px, 5vw, 64px)"
  section: "clamp(72px, 10vw, 140px)"
  section-head: "clamp(32px, 4vw, 56px)"
  stack: "20px"
  band: "14px"
components:
  button-primary:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.paper}"
    rounded: "{rounded.none}"
    padding: "0 28px"
    height: "56px"
  button-primary-hover:
    backgroundColor: "{colors.ink-hover}"
  button-ghost:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    rounded: "{rounded.none}"
    padding: "0 28px"
    height: "56px"
  button-ghost-hover:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.paper}"
  button-light:
    backgroundColor: "{colors.sheet}"
    textColor: "{colors.ink}"
    rounded: "{rounded.none}"
    padding: "0 28px"
    height: "56px"
  button-light-hover:
    backgroundColor: "{colors.paper}"
  button-small:
    padding: "0 18px"
    height: "44px"
  report-sheet:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    rounded: "{rounded.none}"
    padding: "clamp(24px, 3vw, 40px)"
  answer:
    backgroundColor: "transparent"
    textColor: "{colors.ink-soft}"
    rounded: "{rounded.none}"
    padding: "10px 8px"
    height: "64px"
  answer-selected:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.paper}"
  header:
    backgroundColor: "{colors.sheet}"
    textColor: "{colors.ink}"
    height: "72px"
  footer:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.sheet}"
    padding: "64px 0 40px"
  dock:
    backgroundColor: "{colors.sheet}"
    padding: "12px 16px"
  scale-track:
    backgroundColor: "{colors.sheet-deep}"
    height: "14px"
  strip:
    height: "14px"
---

# Design System: Personality+

## Overview

**Creative North Star: "Interaction of Color"**

The site is an Albers plate. A person is five colours in their own proportion, so the whole visual world is built from five flat trait fields set on a neutral grey mount (`sheet`), with navy ink for every word. The signature object is the nested-square plate: Extraversion as the outer field, Openness as the centre square, each ring sized by a score and the nesting dropped slightly toward the bottom edge as in *Homage to the Square*. Everywhere else the same five colours repeat as a strip, a legend, a row of five square fields, and the fills of score bars, always in the same order.

The material is paper and ink, not screen. Surfaces are flat; depth comes only from three tones of ground (grey sheet, deeper grey course, full navy course) and from white report sheets edged with a 1px navy hairline. Corners are square everywhere. Structure is drawn with rules: a 2px ink rule opens each list or label band, 1px grey hairlines divide rows. Type is one family, Archivo, used at expanded width and very heavy weight for display, at normal width for reading.

Information is shown whole. A score bar always carries the full 0-100 range as faint ticks behind the fill; a test question always shows all five answers, with the chosen one struck forward in solid ink; every trait field carries the same strict label band below it. Rejected outright by the direction: the wellness stock-photo hero and the cartoon-character test site.

**Key Characteristics:**
- Five trait colours, fixed order E-N-A-C-O, and nothing else chromatic.
- Flat fields, square corners, no shadow, no glow, no blended gradient.
- Archivo expanded black for display, normal width for text.
- Labels live in bands on the grey ground, never printed on a colour field.
- Full range always visible: 0-100 ticks behind scores, five answers behind a choice.

## Colors

Five saturated trait fields on a cool grey mount, with navy ink doing all the talking.

### Primary
- **The five trait fields** (`extraversion` red, `neuroticism` purple, `agreeableness` blue, `conscientiousness` teal, `openness` dark green): the brand identity, owned by the traits and already used in the results. They appear only as whole flat fields: plate rings, strip segments, legend chips, the square trait plates, score-bar fills, and the five-bar wordmark mark. Each colour means its trait and nothing else.

### Secondary
- **Text-safe trait inks** (`extraversion-text`, `agreeableness-text`, `conscientiousness-text`): darkened versions for small type on the grey sheet, where the base red (2.95:1), blue (3.41:1) and teal (1.77:1) fail AA. The red variant marks "Not answered yet" on test questions; the teal variant appears inline on the account views (login, signup, password reset, pre-test); the blue variant is defined for blue small type and not yet used. Neuroticism purple (5.48:1) and Openness green (7.91:1) pass on the sheet as they are and need no variant.

### Neutral
- **Albers Mount Grey** (`sheet`): the page ground, the header, the phone dock, and the light button. Chosen as the grey card of an Albers plate, deliberately not cream.
- **Deep Mount Grey** (`sheet-deep`): full-width alternate courses ("How it works", the closing band) and the faint tick segments of every score track.
- **Navy Ink** (`ink`): all text, primary buttons, the selected answer, 2px structural rules, the full-width report course and the footer. `ink-hover` is its one lifted state for primary-button hover.
- **Soft Ink** (`ink-soft`): secondary text (facts, aspects, notes, score captions, unselected answers); 7.1:1 on the sheet.
- **Hairline Grey** (`rule`): 1px row dividers, header and dock edges, unselected answer outlines.
- **Paper White** (`paper`): the report and price sheets, and text on ink.
- **Footer tints** (`footer-muted`, `footer-rule`, `footer-outline`): navy-derived tints used only inside the ink footer for headings and legal text, the legal divider, and social-link outlines.

### Named Rules
**The Five Colours Rule.** The trait colours are the only colours. Every other value is ink, grey or white. A new surface that wants an accent uses ink or a trait colour that means that trait.

**The Fixed Order Rule.** Whenever more than one trait appears, they run Extraversion, Neuroticism, Agreeableness, Conscientiousness, Openness: left to right in strips, legends and rows; outer to inner in plates; top to bottom in scale lists. Source of truth is the `TRAITS` array in `src/design/traits.ts`.

**The Flat Field Rule.** A trait colour is a whole, flat field. Never a gradient, tint wash, shadow, glow or translucent overlay.

## Typography

**Display Font:** Archivo variable (wdth 72-125, wght 400-900), with system-ui fallback
**Body Font:** Archivo, same file, normal width
**Label/Mono Font:** none; tabular numerals are on site-wide (`font-variant-numeric: tabular-nums`)

**Character:** One grotesque family stretched two ways: wide and black, it reads like poster lettering on a colour plate; normal width at 18px, it reads plainly and warmly.

### Hierarchy
- **Display** (850, wdth 125, clamp 42-72px, 0.98): page and hero headlines only; balanced wrapping.
- **Headline** (850, wdth 125, clamp 32-56px, 0.98): section heads.
- **Title** (850, wdth 125, clamp 22-28px, 1.1): sub-heads, step titles, sheet titles. In the five-column trait row at desktop the trait names drop to 15-18px at normal width (wdth 100) so the longest name fits one line; in the stacked phone list they return to 22-28px at wdth 108-110.
- **Numeral** (850, wdth 125, 56px, 1): step numbers; the price uses the same face at 72px.
- **Lede** (400, clamp 19-22px, 1.5): one-sentence offers under headlines, max 34ch by default.
- **Body** (400, 18px, 1.55): reading text, max 60ch; FAQ questions and test statements step up to 19-22px at 650-750.
- **Small** (400, 15px, soft ink): facts rows, notes, captions.
- **Label** (700, 13px, wdth 80, 1.2): legend trait names under the plate; replaced on phones by a single wide initial (800, wdth 125).

### Named Rules
**The Two Widths Rule.** Expanded (125%) and very heavy (850-900) is for display, numerals and the wordmark. Reading text is normal width. Condensed (80%) appears only where five names must share one narrow row (the plate legend).

## Layout

Content sits in a 1280px column with a fluid gutter (16-64px). Pages are stacked full-width courses that alternate between the grey sheet, the deep grey course and the navy ink course; vertical section padding is fluid from 72px to 140px, with 32-56px under a section head.

The hero is two columns (copy 1.05fr, plate 0.95fr) that stack below 860px with the plate under the action on phones. Report, trust, buy and close sections use two-column grids that also stack at 860px or 760px. The five trait plates form one row of identical squares on desktop, sharing subgrid rows so name, aspects and line align across all five; below 1080px they become a list with a 96px (56px on small phones) square beside its band.

The header is sticky at 72px (64px under 560px); the inline nav folds into a menu button below 1140px, and the header price button hides below 560px, where the phone dock takes over. The test page pins a progress bar under the header and narrows to 920px. Answer groups run five across and stack to a single column below 600px.

## Elevation & Depth

Completely flat. No element carries a shadow at rest or in any state; the Material UI theme sets contained-button shadows to none and papers to elevation 0. Depth is tonal and edged: grey sheet, deeper grey course, navy course, and a white sheet with a 1px navy hairline that sits on either the grey or the navy course. Sticky layers (header, test progress, phone dock) separate with a 1px hairline, not a shadow.

### Named Rules
**The No-Lift Rule.** Never a box-shadow, drop-shadow or glow. If something needs to stand apart, change its ground or give it a hairline. Hard-stop `linear-gradient` is allowed only as a drawing tool for crisp marks (the score-track ticks, the FAQ plus sign), never as a colour blend.

## Shapes

Square corners everywhere (0px), including Material UI and Amplify controls bridged through the theme. Geometry is rectangles and nested squares: the plate's rings, the 1:1 trait fields, the 14px strip and chips, the 4:5 portraits. Borders are the only line work: 2px ink to open a list, band or section of rows; 1px grey hairline between rows; 2px outlines on buttons and answers; 1.5px outlines on the sample tag and social links.

## Components

### Buttons
Heavy, square ink blocks; the action is always a priced, plain-language label.
- **Shape:** square (0px), 2px ink border, 56px tall, 700 weight 18px.
- **Primary:** navy fill, white text. Hover lifts to `ink-hover`; active nudges down 1px; disabled at 50% opacity.
- **Ghost:** transparent with ink outline and ink text; hover fills with ink.
- **Light:** sheet-grey fill on the navy course; hover goes white.
- **Small:** 44px tall, 18px side padding, 16px text (header, test pager).
- **Text link:** bold, underlined 2px at 0.25em offset; the secondary action beside a button.
- **Focus:** 3px agreeableness-blue outline at 3px offset, site-wide.

### Header
Sticky grey bar, 1px hairline below. Wordmark left: "Personality+" in wide 900 at 22px beside a 5-bar mark (five 5px trait bars, 22px tall). Nav links 600 16px with a 2px ink underline on hover and on the current page. Right: log in text link and the small priced primary button. Below 1140px a 48px square outlined menu button opens a panel of wide 22px links split by hairlines.

### Colour Plate (signature)
Five absolutely positioned squares nested from Extraversion (outer) to Openness (centre), each ring's thickness proportional to its score with a floor so no colour vanishes, and the nesting offset downward (top inset 1.25x, bottom 0.75x). Rings re-proportion over 0.9s when a trait is focused (that trait's weight x1.9). Always labelled as an image with all five scores in its accessible name.

### Legend and Strip
The **strip** is five equal 14px trait bars, decorative, used above page titles (max 280px) and in the closing band. The **legend** under the hero plate is five pressable columns: a 14px chip (grows to 28px when pressed), the trait name in the condensed label style, and the score in soft ink. Hover, focus or tap focuses that trait on the plate.

### Trait Plates
Five identical 1:1 flat trait fields in one row, each with a strict label band on the grey ground beneath it: a 2px ink rule, the trait name, its two aspects (700 14px soft ink, separated by a middle dot), and one plain line (16px).

### Score Scale
Row of trait name and percentile (700), then a 14px track whose full 0-100 range is always drawn as ten deep-grey segments with 2px gaps, then the trait-colour fill on top (animates width over 1s), then the two aspect scores in 14px soft ink, spread to either end.

### Report Sheet
White sheet, 1px navy hairline, 24-40px padding, square. Carries a small outlined "Sample" disclosure tag when it shows example content, and is reused as the sticky price panel on the buy page (72px wide numeral).

### Answer Radio Group
All five answers ("Strongly disagree" to "Strongly agree") are always visible as equal square tiles, 64px tall, 2px grey outline, soft-ink 650 14px text. Hover darkens outline and text to ink; the chosen answer is struck forward as a solid ink tile with white text. Arrow keys move the choice with roving tabindex. Unanswered questions show "Not answered yet" in the red text ink.

### FAQ
Native disclosure list opened by a 2px ink rule, hairline between items; questions at 750 19-22px; a drawn 18px plus sign rotates 45 degrees to a cross when open.

### Footer
Full navy course, grey text. Three columns (1.4fr / 1fr / 1fr) stacking at 760px: wordmark, one-line description and three 44px square outlined social links; then two link lists under 14px muted headings. Legal row under a 1px navy-tint rule. Links underline on hover.

### Phone Dock
Below 760px only: a fixed bottom bar on the grey sheet with a 1px hairline above, holding one full-width primary button. It slides up (0.4s) only after the hero button has scrolled away and no other primary action is on screen; respects the safe-area inset, and the footer pads its bottom to clear it.

## Do's and Don'ts

### Do:
- **Do** take trait order and colours from `TRAITS` in `src/design/traits.ts` and keep E-N-A-C-O in every strip, legend, row, plate and list.
- **Do** put trait names, scores and captions in a label band on the grey ground beside or below the colour, in ink or soft ink.
- **Do** use the text-safe trait inks for any small trait-coloured type on the sheet.
- **Do** show the whole range: ten-segment 0-100 ticks behind every score fill, all five answers behind every choice.
- **Do** open lists and bands with a 2px ink rule and divide rows with 1px hairlines.
- **Do** set display type in Archivo at wdth 125, weight 850, and reading text at normal width.
- **Do** keep every corner square (0px), including Material UI overrides.
- **Do** honour reduced motion: plate, chip, fill and dock transitions collapse to instant.

### Don't:
- **Don't** introduce any chromatic colour outside the five trait colours.
- **Don't** use a trait colour for anything but its own trait.
- **Don't** print labels or text on top of a trait-colour field.
- **Don't** blend colours in gradients, or add box-shadows, drop-shadows or glows.
- **Don't** round corners.
- **Don't** let a ring, chip or bar vanish at a low score; every trait stays visibly present.
