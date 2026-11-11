import {Aspect, Ocean} from './schema';

/**
 * Gift Finder: the opening pages, from Patrick's workbook "Discover who you are"
 * (his own writing, lightly trimmed for the screen), plus the scenario predictions (drafts).
 */

export const DISCOVERING = {
  title: 'Discovering personality',
  kicker: 'Your guide to self-understanding',
  paragraphs: [
    'Understanding your personality is not about labeling yourself. It is about gaining insight that guides you through life’s challenges and opportunities. Personality traits act as key indicators, helping us find our way through the many kinds of behavior and interaction we meet.',
    'The Big Five shed light on how you engage with the world and how you can better understand yourself. This exercise invites you to explore these traits, recognize the habits they shape, and use that understanding to shape your future. These traits give you a framework, but they are not set in stone. With conscious effort, you can steer your development.',
  ],
  traits: {
    [Ocean.Extraversion]: {
      pair: 'Extraversion and introversion',
      line: 'Where you draw your energy from: time with people, or time on your own.',
    },
    [Ocean.Neuroticism]: {
      pair: 'Emotional stability and stress sensitivity',
      line: 'How calm you stay under pressure, and how strongly your emotions move.',
    },
    [Ocean.Agreeableness]: {
      pair: 'Agreeableness and disagreeableness',
      line: 'Whether you lean toward cooperation and kindness, or independence and assertiveness.',
    },
    [Ocean.Conscientiousness]: {
      pair: 'Conscientiousness and carefreeness',
      line: 'Whether you lean toward discipline and order, or spontaneity and flexibility.',
    },
    [Ocean.Openness]: {
      pair: 'Openness and traditionalism',
      line: 'How willing you are to take in new ideas and experiences, or how much you prefer routine and the familiar.',
    },
  } as Record<Ocean, {pair: string; line: string}>,
};

export const SCORES_PAGE = {
  title: 'Understanding your scores',
  paragraphs: [
    'Your Big Five aspect scores give a detailed map of your tendencies, preferences and behaviors, highlighting both your strengths and your areas for growth.',
    'As you look at each one, consider how it shows up in your daily life, and how it has shaped your interactions, your decisions and your well-being.',
  ],
};

export const ANEW = {
  title: 'Discovering yourself anew',
  paragraphs: [
    'Take a moment to appreciate what you have just uncovered. For many people, this is the first time they have seen themselves in words that truly fit: words that capture how they are made.',
    'That clarity brings more than understanding. It brings calm. It is a powerful thing to finally have language for your temperament and the patterns that guide your life. Let these questions take you deeper, and marvel at how you were made.',
  ],
};

const ord = (n: number) => {
  const v = Math.round(n);
  const s = v % 100 >= 11 && v % 100 <= 13 ? 'th' : ['th', 'st', 'nd', 'rd'][v % 10] || 'th';
  return `${v}${s}`;
};

/** Patrick's five reflection questions, with the person's own percentiles filled in. */
export const reflectionQuestion = (trait: Ocean, p: (a: string) => number): string => {
  const pc = (a: Aspect) => `${ord(p(a))} percentile in ${a}`;
  switch (trait) {
    case Ocean.Extraversion:
      return `You scored ${pc(Aspect.Enthusiasm)} and ${pc(Aspect.Assertiveness)}. What are your thoughts on these levels? How do they shape the way you interact with people, socially and at work? What do they reveal about how you engage with the world around you?`;
    case Ocean.Neuroticism:
      return `You scored ${pc(Aspect.Withdrawal)} and ${pc(Aspect.Volatility)}. What are your thoughts about these scores? How do they shape your emotional responses, especially in hard or stressful situations?`;
    case Ocean.Agreeableness:
      return `You scored ${pc(Aspect.Compassion)} and ${pc(Aspect.Politeness)}. How do these shape your relationships, and your ability to speak up for your own needs? Have there been times they deepened a connection, or pushed you to balance kindness with self-respect?`;
    case Ocean.Conscientiousness:
      return `You scored ${pc(Aspect.Industriousness)} and ${pc(Aspect.Orderliness)}. How do these show up in your daily life? How do they shape your sense of responsibility, organization or achievement? Can you see times they guided you toward success? How do they affect your ability to relax and be spontaneous?`;
    default:
      return `You scored ${pc(Aspect.Interest)} and ${pc(Aspect.AestheticOpenness)}. How do these drive your curiosity, creativity and willingness to explore? Can you think of a time they led to growth or something new? How do they shape the way you learn and solve problems?`;
  }
};

export const UNIQUE = {
  title: 'Manifest uniqueness',
  paragraphs: [
    'Your personality is a compass. It guides you through life by shaping your emotions (Affect), your actions (Behavior), your thoughts (Cognition) and your goals (Desire): the ABCDs. Tap each one to see how your temperament is linked to it.',
  ],
  abcd: [
    {
      key: 'a',
      letter: 'A',
      name: 'Affect',
      plain: 'Emotion',
      body: 'Your traits shape how you respond emotionally. Someone high in Neuroticism may feel emotions more intensely; someone lower may stay steady, or even seem detached. Picture a stressful moment like public speaking: a higher score may bring a surge of anxiety, a lower one a sense of calm.',
      ask: 'How do your scores shape your emotional responses? Can you name a time when understanding this brought clarity or calm?',
    },
    {
      key: 'b',
      letter: 'B',
      name: 'Behavior',
      plain: 'Action',
      body: 'The way you act reflects your personality. Someone high in Conscientiousness may be naturally organized and reliable, excelling in structured settings but finding it hard to be flexible or to unwind.',
      ask: 'How do your traits guide what you do, in familiar and new situations? Can you recall a moment when recognizing this helped you handle a challenge?',
    },
    {
      key: 'c',
      letter: 'C',
      name: 'Cognition',
      plain: 'Thought',
      body: 'Cognition is how you think, solve problems and decide. Someone high in Openness tends to enjoy abstract ideas and creative thinking, and is drawn to new and unconventional solutions.',
      ask: 'How do your traits shape the way you make decisions? How does knowing this help you plan and solve problems?',
    },
    {
      key: 'd',
      letter: 'D',
      name: 'Desire',
      plain: 'Goal and motivation',
      body: 'Your personality also shapes what you go after: your goals and what drives you toward them. Someone high in Extraversion may be energized by people and seek out chances to connect. Are you driven by connection, achievement or creativity?',
      ask: 'How do your traits line up with your goals? Can you name goals that come straight out of how you are built?',
    },
  ] as const,
  patterns: [
    'Do you see any patterns in your answers across the scenarios?',
    'How do you think your Big Five traits shaped those responses?',
    'Can you think of real situations where you responded the same way?',
  ],
};

type Lean = {high?: string; low?: string};

export interface Scenario {
  id: string;
  title: string;
  lines: [Aspect, Lean][];
}

/** The workbook's five scenarios. The predictions are drafts for Patrick. */
export const SCENARIOS: Scenario[] = [
  {
    id: 'party',
    title: 'You are at a party where you don’t know many people.',
    lines: [
      [
        Aspect.Enthusiasm,
        {
          high: 'You will probably warm up fast and start talking with people.',
          low: 'You will probably find one or two people and stay with them, or slip out early.',
        },
      ],
      [Aspect.Assertiveness, {high: 'Before long you may be steering the conversation.', low: 'You will likely let others start the conversations.'}],
      [Aspect.Withdrawal, {high: 'Walking in may bring a wave of nerves first.', low: 'Walking in alone won’t bother you much.'}],
    ],
  },
  {
    id: 'project',
    title: 'You have a large project due at work or school in a month.',
    lines: [
      [
        Aspect.Industriousness,
        {high: 'You will likely start early and chip away at it.', low: 'You may wait until the deadline feels close, then push hard.'},
      ],
      [Aspect.Orderliness, {high: 'You will want a plan with steps and dates.', low: 'You will work it out as you go.'}],
      [Aspect.Withdrawal, {high: 'The deadline may sit on your mind the whole month.'}],
    ],
  },
  {
    id: 'lead',
    title: 'You are asked to lead a team to organize an event at work.',
    lines: [
      [
        Aspect.Assertiveness,
        {high: 'You will likely step in, hand out roles and set the direction.', low: 'You may feel more at home helping than directing.'},
      ],
      [Aspect.Orderliness, {high: 'You will build the schedule and the checklists.', low: 'You will keep it loose and adjust on the day.'}],
      [Aspect.Enthusiasm, {high: 'Your energy will get people excited about it.'}],
    ],
  },
  {
    id: 'help',
    title: 'Someone close to you is asking for a lot of your time and help, and you are exhausted.',
    lines: [
      [Aspect.Compassion, {high: 'You will likely keep giving, even past empty.', low: 'You will likely tell them plainly that you need a break.'}],
      [Aspect.Politeness, {high: 'Saying no may feel rude, so you may not say it.', low: 'You will say what you can and can’t do.'}],
      [Aspect.Withdrawal, {high: 'You may feel guilty whichever way you choose.'}],
    ],
  },
  {
    id: 'disagree',
    title: 'You have a disagreement with a close friend or partner.',
    lines: [
      [Aspect.Politeness, {high: 'You will likely smooth it over to keep the peace.', low: 'You will say what you think, directly.'}],
      [Aspect.Volatility, {high: 'It may heat up quickly, and you will need time to settle.', low: 'You will likely stay level through it.'}],
      [Aspect.Compassion, {high: 'You will feel their side even while you argue yours.'}],
    ],
  },
];

/** The prediction for one scenario: only the lines that fit the person's scores. */
export const predict = (s: Scenario, p: (a: string) => number) =>
  s.lines
    .map(([a, lean]) => {
      const v = p(a);
      const line = v >= 60 ? lean.high : v <= 40 ? lean.low : undefined;
      return line ? {aspect: a, line} : null;
    })
    .filter((x): x is {aspect: Aspect; line: string} => !!x);

/** The move from personality to imager. Draft for Patrick to rewrite in his voice. */
export const IMAGER = {
  title: 'From personality to imager',
  draft: true,
  paragraphs: [
    'Everything so far describes how you are built. Now the question changes. Not only “What am I like?” but “What am I for?”',
    'You were made to image God: to represent him in the place he has put you, among the people he has put around you. Your temperament is part of how you were made for that. Your gifts are tools for it. Your blind spots are places where he is still at work.',
    'Nothing you find here earns his love, and nothing you find here loses it. This is about becoming who you were made to be.',
  ],
  verse: 'Genesis 1:26–27',
};

/**
 * Verses for "Putting it together": a short list per trait, chosen by Patrick.
 * The page offers the verses for the traits behind the person's top gifts.
 * Empty until Patrick sends his list. Give the reference and, if wanted, the text in his chosen translation.
 */
export const VERSES: Record<Ocean, {ref: string; text?: string}[]> = {
  [Ocean.Extraversion]: [],
  [Ocean.Neuroticism]: [],
  [Ocean.Agreeableness]: [],
  [Ocean.Conscientiousness]: [],
  [Ocean.Openness]: [],
};
