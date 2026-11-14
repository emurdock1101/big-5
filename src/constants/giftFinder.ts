import {Aspect} from './schema';
import {questionData} from './questionData';

/**
 * Gift Finder: the gift and blind-spot lists, motivation lines and writing prompts.
 *
 * WHERE THE ITEMS COME FROM (rebuilt Nov 10, 2026)
 * - Test items: word for word from the site's own 100-item test. Their aspect is set by research.
 * - Public items: word for word from the public IPIP item pool (ipip.ori.org, free to use).
 *   The aspect each one sits under is our call, made by meaning.
 * - Drafts: no public item carries the meaning, so the wording is ours. Marked `draft`.
 * Any item with `ask` is a question for Patrick to settle (shown in review mode on the preview).
 *
 * Each item sits on one side of one aspect ('high' or 'low'), so the page can put the items
 * that fit a person's scores first. The person still chooses.
 */

export type GiftKind = 'gift' | 'blind';
export type Side = 'high' | 'low';
export type ItemSource = 'test' | 'public' | 'draft';

export interface GiftItem {
  id: string;
  text: string;
  aspect: Aspect;
  side: Side;
  kind: GiftKind;
  source: ItemSource;
  /** A question for Patrick about this item. */
  ask?: string;
}

type Raw = string | {t: string; draft?: true; ask?: string};
type Lists = Record<GiftKind, Record<Side, Raw[]>>;

const RAW: Record<Aspect, Lists> = {
  [Aspect.Enthusiasm]: {
    gift: {
      high: [
        'Make friends easily',
        'Warm up quickly to others',
        'Have a lot of fun',
        'Laugh a lot',
        'Feel comfortable around people',
        'Am the life of the party',
      ],
      low: [
        'Rarely get caught up in the excitement',
        'Am not a very excitable person',
        'Enjoy spending time by myself',
        'Think before I speak',
      ],
    },
    blind: {
      high: [
        'Am always looking for a rush of excitement',
        'Can’t stand being alone',
        'Spend more money than I have',
        'Find that my impulses often get me into trouble',
      ],
      low: [
        'Am hard to get to know',
        'Keep others at a distance',
        'Reveal little about myself',
        'Bottle up my feelings',
        'Find it difficult to approach others',
        'Am quiet around strangers',
      ],
    },
  },
  [Aspect.Assertiveness]: {
    gift: {
      high: [
        'Take charge',
        'See myself as a good leader',
        'Can talk others into doing things',
        'Know how to captivate people',
        'Am the first to act',
        'Defend my own beliefs',
      ],
      low: [
        'Love to let others share the spotlight',
        'Prefer to let others be the center of attention',
        'Am a good listener',
        'Support my teammates or fellow group members',
      ],
    },
    blind: {
      high: ['Make myself the center of attention', 'Try to outdo others', 'Demand to be the center of interest', 'Drown out conversations'],
      low: [
        'Wait for others to lead the way',
        'Hold back my opinions',
        'Lack the talent for influencing people',
        'Keep in the background',
        'Have little to say',
      ],
    },
  },
  [Aspect.Withdrawal]: {
    gift: {
      high: [
        'Can sense when danger or harm is coming',
        'Take precautions',
        'Am careful to avoid making mistakes',
        'Prefer safety over risk',
        'Avoid dangerous situations',
        {t: 'Would rather be careful than get hurt', draft: true},
        {t: 'Weigh whether a step is likely to help me or hurt me', draft: true},
      ],
      low: [
        'Feel comfortable with myself',
        'Am not embarrassed easily',
        'Rarely feel blue',
        'Am relaxed most of the time',
        'Remain calm under pressure',
        'Am comfortable in unfamiliar situations',
      ],
    },
    blind: {
      high: [
        'Worry about things',
        'Am easily discouraged',
        'Become overwhelmed by events',
        'Am filled with doubts about things',
        'Get stressed out easily',
        'Judge myself more harshly than others do',
      ],
      low: [
        'Ignore signs of danger',
        'Take risks that could cause trouble for me',
        {t: 'Am unaffected by criticism', draft: true},
      ],
    },
  },
  [Aspect.Volatility]: {
    gift: {
      high: [
        {t: 'Rise quickly to defend the people I care about', draft: true},
        {t: 'Notice right away when something blocks my goals', draft: true},
        {t: 'Can tell when my life is falling into disarray', draft: true},
        {t: 'Spot the gap between how things are and how they should be', draft: true},
      ],
      low: [
        'Keep my emotions under control',
        'Rarely get irritated',
        'Am not easily annoyed',
        'Rarely lose my self-control',
        'Am able to get over it quickly when someone hurts my feelings',
        'Am usually a patient person',
      ],
    },
    blind: {
      high: [
        'Get angry easily',
        'Get upset easily',
        'My mood can change a lot',
        'Get easily agitated',
        'Lose my temper',
        'Am easily hurt',
        'Can’t help but look upset when something bad happens',
      ],
      low: [
        'Find it difficult showing people that I’m angry with them',
        {t: 'Am unbothered by things that seem to upset others', draft: true},
      ],
    },
  },
  [Aspect.Compassion]: {
    gift: {
      high: [
        'Feel others’ emotions',
        'Inquire about others’ well-being',
        'Sympathize with others’ feelings',
        'Take an interest in other people’s lives',
        'Like to do things for others',
        'Have a soft heart',
        'Know how to comfort others',
        'Make people feel at ease',
        'Am never too busy to help a friend',
      ],
      low: [
        'Am not easily fooled by others',
        'Remain on guard to keep from being tricked or manipulated',
      ],
    },
    blind: {
      high: [
        {t: 'Notice I give a lot to others (time, energy, focus)', draft: true},
        'Am easy to fool',
        'Let others take advantage of me',
        'Am pretty trusting of others’ motives',
      ],
      low: [
        'Am indifferent to the feelings of others',
        'Take no time for others',
        'Can’t be bothered with other’s needs',
        'Don’t have a soft side',
        'Rarely interested in other people’s problems',
      ],
    },
  },
  [Aspect.Politeness]: {
    gift: {
      high: [
        'Respect authority',
        'Hate to seem pushy',
        'Avoid imposing my will on others',
        'Rarely put people under pressure',
        'Keep the peace',
        'Follow the rules',
      ],
      low: [
        'Am able to stand up for myself',
        'Am not afraid of providing criticism',
        'Won’t let others dominate me',
        'Refuse to be taken advantage of by others',
        'Feel that people must earn my trust',
        'Don’t hesitate to express an unpopular opinion',
      ],
    },
    blind: {
      high: [
        'Can’t stand confrontations',
        'Don’t speak my mind freely when there might be negative results',
        'Am nice to people I should be angry at',
        'Change myself to suit others',
      ],
      low: ['Insult people', 'Seek conflict', 'Love a good fight', 'Believe that I am better than others', 'Take advantage of others'],
    },
  },
  [Aspect.Industriousness]: {
    gift: {
      high: [
        'Carry out my plans',
        'Finish what I start',
        'Get things done quickly',
        'Always know what I am doing',
        'Get chores done right away',
        'Push myself very hard to succeed',
      ],
      low: [
        'Have time for play and relaxation',
        'Tend to live in the present',
        {t: 'Can enjoy downtime without stressing about to-dos', draft: true},
      ],
    },
    blind: {
      high: [
        'Am a workaholic, with little time for fun or pleasure',
        'Have noticed that I put my work ahead of too many other things',
        {t: 'Feel unproductive when I relax', draft: true},
      ],
      low: [
        'Find it difficult to get down to work',
        'Waste my time',
        'Postpone decisions',
        'Am easily distracted',
        'Mess things up',
        'Neglect my duties',
        'Do things in a half-way manner',
      ],
    },
  },
  [Aspect.Orderliness]: {
    gift: {
      high: [
        'Like order',
        'Keep things tidy',
        'Follow a schedule',
        'See that rules are observed',
        'Want every detail taken care of',
        'Pay attention to details',
        'Make plans and stick to them',
        'Am always prepared',
      ],
      low: ['Am not bothered by disorder', 'Am not bothered by messy people', 'Can change course, if necessary', 'Prefer variety to routine'],
    },
    blind: {
      high: [
        'Want everything to be “just right”',
        'Am a perfectionist',
        'Am unwilling to change appointments',
        'Become frustrated and angry with people when they don’t live up to my expectations',
      ],
      low: [
        'Leave my belongings around',
        'Dislike routine',
        'Often forget to put things back in their proper place',
        'Make a mess of things',
        'Often change plans at the last minute',
      ],
    },
  },
  [Aspect.Interest]: {
    gift: {
      high: [
        'Like to solve complex problems',
        'Am quick to understand things',
        'Can handle a lot of information',
        'Have a rich vocabulary',
        'Think quickly',
        'Formulate ideas clearly',
        'Am full of ideas',
        'Carry the conversation to a higher level',
      ],
      low: [
        'Think up practical solutions',
        'Deal efficiently with practical matters',
        {t: 'Am content with what I know works', draft: true},
      ],
    },
    blind: {
      high: [
        'Feel that my interests change quickly',
        'Often stop in the middle of one activity to start another one',
        {t: 'Struggle to pick one focus because so much interests me', draft: true},
      ],
      low: [
        'Avoid philosophical discussions',
        'Avoid difficult reading material',
        'Have difficulty understanding abstract ideas',
        'Will not probe deeply into a subject',
        'Am not interested in abstract ideas',
      ],
    },
  },
  [Aspect.AestheticOpenness]: {
    gift: {
      high: [
        'See beauty in things that others might not notice',
        'Enjoy the beauty of nature',
        'Believe in the importance of art',
        'Love to reflect on things',
        'Get deeply immersed in music',
        'Need a creative outlet',
        'Have a vivid imagination',
      ],
      low: [
        'Believe in the importance of tradition',
        'Keep old traditions',
        'Am told that I am down to earth',
      ],
    },
    blind: {
      high: ['Sometimes get lost in my daydreams', 'Spend much of the day fantasizing or daydreaming', 'Feel like my imagination can run wild'],
      low: [
        'Rarely notice the emotional aspects of paintings and pictures',
        'Don’t like the idea of change',
        'Am attached to conventional ways',
      ],
    },
  },
};

/** Compare wording without caring about straight vs curly quotes. */
export const sameWords = (s: string) =>
  s
    .trim()
    .replace(/[’']/g, "'")
    .replace(/[“”"]/g, '"');
const TEST_TEXTS = new Set(questionData.map((q) => sameWords(q.text)));
const slug = (s: string) => s.toLowerCase().replace(/[^a-z]+/g, '-');

export const GIFT_ITEMS: GiftItem[] = (Object.keys(RAW) as Aspect[]).flatMap((aspect) =>
  (['gift', 'blind'] as GiftKind[]).flatMap((kind) =>
    (['high', 'low'] as Side[]).flatMap((side) =>
      RAW[aspect][kind][side].map((raw, i) => {
        const r = typeof raw === 'string' ? {t: raw} : raw;
        const source: ItemSource = r.draft ? 'draft' : TEST_TEXTS.has(sameWords(r.t)) ? 'test' : 'public';
        return {id: `${kind}-${slug(aspect)}-${side}-${i}`, text: r.t, aspect, side, kind, source, ask: r.ask};
      }),
    ),
  ),
);

export const itemById = (id: string) => GIFT_ITEMS.find((x) => x.id === id);

/** Does this item's side match the person's score on its aspect? Average scores (40–60) match neither. */
export const fitsScore = (item: GiftItem, percentile: number) =>
  item.side === 'high' ? percentile >= 60 : percentile <= 40;

/** Patrick's motivation lines from the workbook, lightly edited. Only the side that fits is shown. */
export const MOTIVATION: Record<Aspect, Record<Side, string>> = {
  [Aspect.Enthusiasm]: {
    high: 'You are less concerned with problems and more excited about opportunity.',
    low: 'You are less excitable and can take a calmer approach to the future.',
  },
  [Aspect.Assertiveness]: {
    high: 'You can lead and guide.',
    low: 'You are a great helper to those who like to lead the way.',
  },
  [Aspect.Withdrawal]: {
    high: 'You can sense when danger or harm is coming.',
    low: 'You more easily take on tasks that involve negative emotion.',
  },
  [Aspect.Volatility]: {
    high: 'You are great at defending.',
    low: 'You are not easily upset.',
  },
  [Aspect.Compassion]: {
    high: 'You care for others.',
    low: 'You make sure there are no freeloaders.',
  },
  [Aspect.Politeness]: {
    high: 'You make sure social decorum is followed.',
    low: 'You find faults in things that can be improved.',
  },
  [Aspect.Industriousness]: {
    high: 'You enjoy hard work.',
    low: 'You can enjoy downtime.',
  },
  [Aspect.Orderliness]: {
    high: 'You have a clear way of organizing life.',
    low: 'You are okay when plans don’t work out.',
  },
  [Aspect.Interest]: {
    high: 'You desire new intellectual pursuits.',
    low: 'You enjoy what you have and are comfortable with what you know.',
  },
  [Aspect.AestheticOpenness]: {
    high: 'You explore new cultures, ideas and creative pursuits.',
    low: 'You create stability with what is known, and you know the traditional answers to problems.',
  },
};

export const motivationFor = (aspect: Aspect, percentile: number) =>
  percentile >= 60
    ? MOTIVATION[aspect].high
    : percentile <= 40
      ? MOTIVATION[aspect].low
      : `You sit near the middle, so both can be true of you: ${MOTIVATION[aspect].high.replace(/^You /, 'you ').replace(/\.$/, '')}, and ${MOTIVATION[aspect].low.replace(/^You /, '').replace(/^are /, 'you are ').replace(/\.$/, '')}.`;

export type PartKey = 'story' | 'better' | 'forward' | 'serve';

/** The writing prompts: the workbook's three steps and the ABCDs, plus Patrick's fourth question. */
export const PROMPTS: Record<
  GiftKind,
  {
    story: {title: string; ask: string};
    abcd: {key: 'a' | 'b' | 'c' | 'd'; label: string; ask: string}[];
    better: {title: string; ask: string};
    forward: {title: string; ask: string};
    serve: {title: string; ask: string};
  }
> = {
  gift: {
    story: {
      title: 'A time it helped',
      ask: 'Tell the story of a time this gift made something go well. A few sentences is plenty.',
    },
    abcd: [
      {key: 'a', label: 'Felt', ask: 'What did you feel?'},
      {key: 'b', label: 'Did', ask: 'What did you do?'},
      {key: 'c', label: 'Thought', ask: 'What were you thinking?'},
      {key: 'd', label: 'Goal', ask: 'What goal or motivation was driving you?'},
    ],
    better: {
      title: 'What could have gone better',
      ask: 'Looking back, what could you have done to make it turn out even better?',
    },
    forward: {
      title: 'Using it from here',
      ask: 'How can you use this gift more on purpose, in what is in front of you now?',
    },
    serve: {
      title: 'Who could this serve?',
      ask: 'Name the people this gift could serve: at home, at work, in your church or neighborhood.',
    },
  },
  blind: {
    story: {
      title: 'A time it cost you',
      ask: 'Tell the story of a time this blind spot made something go worse. A few sentences is plenty.',
    },
    abcd: [
      {key: 'a', label: 'Felt', ask: 'What did you feel?'},
      {key: 'b', label: 'Did', ask: 'What did you do?'},
      {key: 'c', label: 'Thought', ask: 'What were you thinking?'},
      {key: 'd', label: 'Goal', ask: 'What goal or motivation was driving you?'},
    ],
    better: {
      title: 'What you could have done differently',
      ask: 'Looking back, what would have helped it go better?',
    },
    forward: {
      title: 'Working on it from here',
      ask: 'What is one thing you can do the next time this shows up?',
    },
    serve: {
      title: 'Who has paid for this?',
      ask: 'Who has carried the cost of this blind spot, including you? Name them honestly, without beating yourself up.',
    },
  },
};

/** What a person writes about one gift or blind spot. */
export type Entry = {story: string; a: string; b: string; c: string; d: string; better: string; forward: string; serve: string};
export const EMPTY_ENTRY: Entry = {story: '', a: '', b: '', c: '', d: '', better: '', forward: '', serve: ''};

/** The four parts of the writing, in order. A part counts as written once any of its boxes has words. */
export const PARTS: PartKey[] = ['story', 'better', 'forward', 'serve'];
export const partDone = (e: Entry | undefined, part: PartKey) =>
  !!e &&
  (part === 'story'
    ? [e.story, e.a, e.b, e.c, e.d].some((x) => x.trim())
    : !!e[part].trim());
