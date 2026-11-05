# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Adults curious about their own personality who want a credible, readable explanation of who they are and how it shapes their emotions, behavior, relationships and work. They arrive mostly from social links and word of mouth, often on a phone, and decide in one visit whether a $9.99 test is worth it. A smaller group wants help acting on their results and may book a review session with the clinician.

## Product Purpose

Personality+ sells a one-time, 100-question Big Five Aspects personality test (10–20 minutes) with a personal report: a percentile for each of the five traits and their ten aspects, plus detailed paragraphs on what that means day to day. Success is a visitor understanding the offer, paying $9.99, finishing the test, and finding the report clear and usable.

## Positioning

Built on the published Big Five Aspects model (DeYoung, Quilty & Peterson, 2007, *Journal of Personality and Social Psychology* 93, 880–896) rather than pop typologies, and interpreted by a practicing licensed clinical mental health therapist, Patrick Knicely. Free versions of the scale exist; Personality+ competes on a clearer, more practical, more usable report.

## Operating Context

- Purchase: email + Stripe checkout at $9.99 on `/buy`; one purchase = one test, each purchase needs a different email.
- Test is taken once; retaking is discouraged for at least six months because prior knowledge biases answers.
- Results are viewed in-app after login and can be downloaded.
- Optional follow-up: a one-time results review or weekly/monthly sessions, booked through Calendly ("Book a call").

## Capabilities and Constraints

- React 17 single-page app (Create React App, TypeScript, Material UI v4/v5 mixed), AWS Amplify auth/storage/API, Stripe payments, hosted on S3/Amplify.
- Scoring, payment, auth and result storage logic must keep working exactly as today; redesign touches presentation and copy only.
- An admin view for browsing all users' results exists on GitHub master (not yet deployed); keep it working. Unit tests (`CI=true npx react-scripts test --watchAll=false`) must stay green. Install needs `npm ci --legacy-peer-deps`.
- Five traits and their aspects: Extraversion (assertiveness, enthusiasm), Neuroticism (withdrawal, volatility), Agreeableness (compassion, politeness), Conscientiousness (industriousness, orderliness), Openness (intellect/ideas, aesthetic openness).
- Open: exact license title for Patrick Knicely (confirmed licensed; title not yet given).
- Open: the own-domain contact email address (confirmed available; address not yet given). Replace the Gmail address once known.
- No refund policy exists; do not state one.

## Brand Commitments

- Name: "Personality+" (one word, plus sign, no space).
- Each trait owns a color, already used in the results: Extraversion #ED5362, Neuroticism #9A338E, Agreeableness #3A81CD, Conscientiousness #00C9B7, Openness #344B47. The owner chose to make the five traits the brand's visual identity.
- Voice: warm, encouraging, plain-spoken clinical expertise; "your personality is part of your story and adventure."

## Evidence on Hand

- Real citations: DeYoung, Quilty & Peterson (2007); Costa; Wilt; Revelle (William); Oxford Handbook of the Five Factor Model.
- Real team: Patrick Knicely (B.A. Roanoke College, M.S. Radford University, licensed clinical mental health therapist and clinical consultant), Elliot Murdock (software engineer, built the site). Photos in `src/images`.
- Real report content in `src/constants/content.ts` (trait interpretations) — usable for a sample-report preview.
- None exist: testimonials, user counts, press, refund policy. Do not fabricate them.

## Product Principles

1. Show the offer before asking for money: price, what's inside, and what the report looks like.
2. Earn clinical trust through care: accurate names, clean copy, real credentials, real citations.
3. Explain, never label: every trait term is described in plain, non-judgmental language.
4. The five traits are the identity; everything visual should come from them.
5. Phone first: most visitors decide on a small screen.

## Accessibility & Inclusion

WCAG 2.1 AA: 4.5:1 text contrast (trait colors must be paired with text colors that pass), semantic headings, keyboard-reachable nav and test controls, labeled icons. Neuroticism content must stay non-stigmatizing.
