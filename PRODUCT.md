# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Mostly men. Bright, curious, hardworking, a bit of a rule breaker; often high in openness and conscientiousness. He has a hard time fitting in, which may include a physical church. Not in deep crisis, but a little lost: he struggles to pull his identity and skills together, and because he is unsure of himself he sometimes settles. He may feel tied up in "predetermined ministry," or he may not know God at all. Often arrives on a phone from Patrick's social media (Mr.MindMorph).

What he wants: to understand his skills and how to use them in his area of competence, and to understand God's plan in a way that sets him free to show up at work and take responsibility.

## Product Purpose

Personality+ is Patrick Knicely's Big Five Aspects personality test: 100 questions, 10–20 minutes, $9.99, one take per purchase, with a report giving percentiles for 5 traits and 10 aspects plus written interpretation. The site is "Personality+ by Patrick": the test is the main thing to buy, and the site makes clear whose it is, what he believes, and why he built it. Success: the right man recognizes himself, understands the offer, takes the test, and uses what he learns.

## Positioning

Patrick helps people understand how God made them and discover their role in His Kingdom, using personality science and the Bible's bigger story. He combines the neuropsychology of personality (Peterson's Maps of Meaning, Jeffrey Gray, the Big Five Aspects of DeYoung, Quilty & Peterson) with Michael S. Heiser's Deuteronomy 32 / Divine Council worldview. High-level scholarship for everyday people, with compassion and real usefulness. Tying idea: Peterson has a missing map of meaning, and the Divine Council worldview is that map.

## Operating Context

- Purchase and accounts (AWS): Stripe checkout at $9.99 on `/buy`; a Stripe webhook Lambda creates the buyer's account (AWS Cognito) and emails a temporary login; on `/signup` they sign in with it and set their own password. One purchase = one account = one test (new email per purchase).
- Results are saved to their account (S3) after the test; they can log in anytime for permanent access.
- Test taken once; retake no sooner than about six months.
- Results viewed in-app and downloadable.
- Follow-up offer: a results conversation with Patrick (talking through your results), booked via Calendly. It is not counseling, therapy or coaching.
- Social: Mr.MindMorph (name drawn from Romans 12:2, being transformed by the renewing of your mind).

## Capabilities and Constraints

- React 17 SPA (CRA, TypeScript, Material UI v4/v5), AWS Amplify auth/storage, Stripe, hosted on Amplify/S3. Scoring, payment, auth, storage and admin logic unchanged by design work. Elliot's tests stay green (`npm ci --legacy-peer-deps`).
- Five traits / ten aspects: Extraversion (enthusiasm, assertiveness), Neuroticism (withdrawal, volatility), Agreeableness (compassion, politeness), Conscientiousness (industriousness, orderliness), Openness (interest in ideas, aesthetic openness).
- Open: the own-domain contact email (exists; address not yet given). Gmail stays until then (one constant).
- Planned (later): an interactive Future Authoring exercise through a Christian lens, inside the logged-in account, that uses the person's saved scores. Patrick already has the booklet; it is not built yet. It will likely need somewhere to save each person's writing (an AWS change for Elliot).

## Brand Commitments

- Name: "Personality+" (no space), presented as Personality+ by Patrick Knicely, with the line "You are His workmanship. Made for good works." (Ephesians 2:10). Renaming was considered and set aside for now.
- Homepage headline: "Find out how God made you. Then find out what for." Closing line of the faith section: "Know how you're made. Live what you're made for." (replaces "understand the top, master the bottom", which reads as innuendo).
- The five trait colors and the Albers-style nested color squares stay; the owner likes them. Order always E, N, A, C, O. Colors: E #ED5362, N #9A338E, A #3A81CD, C #00C9B7, O #344B47.
- Faith is woven in early on the homepage, alongside the science, not hidden and not a sermon.
- Voice: direct, compassionate, deep, clear; closer to Peterson than Heiser. Bird's-eye view first, then details. Stories and hooks; stacked questions; long passages landing on a short punchy line; cites sources, admits limits. No emojis, no shouting caps. Fewer names per paragraph and an earlier payoff for this reader.
- Phrases he uses (credit Heiser/Peterson where fitting): understand the top and master the bottom; if it's weird, it's important; the Bible was written for us, but not to us; believing loyalty; being God's imagers; sort yourself out; compare yourself to who you were yesterday; be a monster, then learn to control it.
- Never use: church clichés (a season of waiting, God laid it on my heart, let's do life together, guard your heart, being refined, let go and let God, more than you can handle, blessed, on fire for God, walking in his favor); self-help/manifesting words (manifest/manifesting, speak it into existence, boundaries, protect your peace, let them, healing journey, mind shift, growth mindset, self-care); therapy-speak (gaslighting, triggered, toxic, narcissist, trauma, codependent, inner child, nervous system regulation, dysregulated, shadow work, neurodivergence); internet slang. No AI filler lines.

## Evidence on Hand

- Credentials: Licensed teacher; Licensed Professional Counselor (LPC) in Virginia; personality researcher working with the Big Five Aspects model; biblical scholarship trained under Michael S. Heiser; former middle and high school teacher, wrestling and swimming coach, conference teacher for other counselors. Not currently seeing clients.
- Real citations: DeYoung, Quilty & Peterson (2007), JPSP 93, 880–896; Knicely & Forrest (2021), Counseling and personality: Introduction to the taxonomy of the Big Five as an assessment tool, The Virginia Counselors Journal 38, 32–39; Weisberg, DeYoung & Hirsh (2011), Gender differences in personality across the ten aspects of the Big Five, Frontiers in Psychology 2, 178; Costa; Wilt; Revelle (William).
- Norms: scoring picks the male or female mean and SD per trait and aspect (src/constants/escsData.tsx, maleDataMap/femaleDataMap), sourced per Patrick from Weisberg, DeYoung & Hirsh (2011), Table 2. Values in code not yet checked line by line against the paper.
- Real report content in `src/constants/` (interpretations).
- Patrick's own Big Five scores exist (brand homebase) but he chose not to feature them on the homepage.
- None exist: testimonials, user counts, press, refund policy. Do not fabricate.
- Source of brand truth: /Users/patrickknicely/my-business/brand-homebase.md

## Product Principles

1. People are built differently: never one size fits all.
2. Bird's-eye view first: show what this is and why before the details.
3. Show the offer before asking for money.
4. Scholarship made usable: depth with clarity, sources named, limits admitted.
5. Never diagnose, never promise a life without difficulty, never speak as the reader's counselor.

## Accessibility & Inclusion

WCAG 2.1 AA: 4.5:1 text contrast, semantic headings, keyboard-reachable controls (sampler sliders and explorer must work by keyboard and screen reader), reduced-motion respected. Neuroticism described without stigma.
