import {Ocean} from './schema';
import {ShortWriteup} from './shortWriteups';

/**
 * Splits inside a trait: when a person's two aspects of the same trait sit far apart
 * (for example high Compassion but low Politeness), the two pull different ways. The regular
 * trait card blends both aspects, so for a split it would describe someone who doesn't exist.
 * A split side replaces the trait card with one written for that exact mix.
 *
 * DRAFTS for Patrick to edit, drawn from his trait notes (Personality research and write ups).
 * `firstHigher` = the first aspect (as listed in TRAITS) is the higher one:
 *   Extraversion: Enthusiasm, Assertiveness
 *   Neuroticism: Withdrawal, Volatility
 *   Agreeableness: Compassion, Politeness
 *   Conscientiousness: Industriousness, Orderliness
 *   Openness: Interest in Ideas, Aesthetic Openness
 */
export interface SplitSide extends ShortWriteup {
  /** Short name for this mix, shown as its title. */
  name: string;
  /** A paragraph on the tension, used in the "Inside each trait" view. */
  note: string;
}

export interface SplitNote {
  firstHigher: SplitSide;
  secondHigher: SplitSide;
}

/** How many percentile points apart two aspects must be to count as a split. */
export const SPLIT_GAP = 25;

export const aspectSplits: Record<string, SplitNote> = {
  [Ocean.Extraversion]: {
    firstHigher: {
      name: 'Warm, but not out front',
      note: 'You light up around people and good things, but you don’t naturally take the lead. You can be the warmest person in the room and still wait for someone else to decide. That isn’t timidity, it’s a different way of being social. When something matters, practice saying what you want out loud.',
      headline: 'You light up around people and good things, but you would rather not be the one in charge.',
      gift: 'Your warmth and joy draw people in and make them feel welcome.',
      showsUp: [
        'You love being with people and having fun',
        'You let others make the call',
        'You encourage more than you direct',
      ],
      watchFor: 'Fun in the moment can win out over what is wise for later, and your own ideas may go unsaid.',
      tryThis: 'Next time a group is deciding, say what you would choose before anyone else does.',
    },
    secondHigher: {
      name: 'Out front, but not bubbly',
      note: 'You speak up and take charge easily, but you don’t run on much visible excitement. People may read you as serious or intense when you are simply focused. Your drive is real even when it doesn’t look excited. Let people know when you are glad.',
      headline: 'You take charge and make things happen, but you don’t run on big, visible excitement.',
      gift: 'You are decisive and steady; you can lead without needing the room to be fun.',
      showsUp: [
        'You speak up and steer when something needs doing',
        'You enjoy people in smaller doses, and recharge alone',
        'Your drive looks serious, even when you are glad',
      ],
      watchFor: 'People may read you as all business, and you may push ahead without bringing them along.',
      tryThis: 'When you lead this week, tell people why the goal excites you, not just what to do.',
    },
  },
  [Ocean.Neuroticism]: {
    firstHigher: {
      name: 'Stress that goes inward',
      note: 'When stress comes, it tends to turn inward: worry, second-guessing, pulling back, more than flashes of anger. People around you may not see how much you are carrying. Name it early, before it piles up.',
      headline: 'When stress comes, you pull inward: worry, second-guessing and holding back, more than anger.',
      gift: 'You think before you react, and you notice risks early.',
      showsUp: [
        'You freeze or hesitate when things feel uncertain',
        'You replay worries rather than lash out',
        'You reach for the familiar when you feel threatened',
      ],
      watchFor: 'People may not see how much you carry, and avoiding things can quietly shrink your world.',
      tryThis: 'Name one worry out loud to someone you trust, before it piles up.',
    },
    secondHigher: {
      name: 'Stress that comes out',
      note: 'When stress comes, it tends to come out: frustration rises fast and can spill over, even though you don’t dwell in worry. You may recover quickly and forget that others haven’t. Build a pause between feeling it and saying it.',
      headline: 'When stress comes, it comes out: frustration rises fast, though you don’t dwell in worry.',
      gift: 'You face problems head-on, and you will defend yourself and the people you love.',
      showsUp: [
        'You can go from calm to irritated quickly',
        'Criticism can feel like an attack, and you push back',
        'You recover fast and move on',
      ],
      watchFor: 'Sharp words in the moment can hurt people long after you have forgotten them.',
      tryThis: 'When you feel the heat rising, pause and ask: what am I protecting right now?',
    },
  },
  [Ocean.Agreeableness]: {
    firstHigher: {
      name: 'A big heart with a blunt edge',
      note: 'You care deeply about people, but you don’t naturally soften your words. You may be the first to show up when someone is hurting and also the one who says the hard thing. People who only hear the words can miss the care behind them. It isn’t hypocrisy; they are two separate parts of you. Let the care show first.',
      headline: 'You care deeply about people, but you don’t soften your words or bow to rules for their own sake.',
      gift: 'You show up when people are hurting, and you will tell them the hard truth they need.',
      showsUp: [
        'You feel other people’s pain and move to help',
        'You question authority and push back when something is wrong',
        'You can be tender one minute and blunt the next',
      ],
      watchFor: 'People who only hear your words can miss the care behind them.',
      tryThis: 'Before you say the hard thing, say why you care. Let the care show first.',
    },
    secondHigher: {
      name: 'Courteous, but not easily moved',
      note: 'You are respectful, fair and slow to offend, but you don’t feel other people’s pain as strongly as some do. You keep the peace well; warmth may take a deliberate choice. Pair your courtesy with a real question about how someone is doing.',
      headline: 'You are respectful and follow the rules, but other people’s pain moves you less than most.',
      gift: 'You treat people fairly, keep the peace and honor those in charge.',
      showsUp: [
        'You avoid rudeness and needless conflict',
        'You do right by people even when you don’t feel for them',
        'You help because it is right, more than because you are moved',
      ],
      watchFor: 'Courtesy without warmth can feel distant to someone who needs comfort.',
      tryThis: 'Pair your courtesy with one real question: “How are you doing, really?”',
    },
  },
  [Ocean.Conscientiousness]: {
    firstHigher: {
      name: 'Hard work in a messy room',
      note: 'You push hard toward goals, but order and tidiness don’t come naturally. You may get a great deal done in the middle of some chaos. A few simple systems can protect the effort you are already putting in.',
      headline: 'You work hard and push toward goals, but order and routine don’t come naturally.',
      gift: 'You get things done, and you finish what you start.',
      showsUp: [
        'You can work long hours toward a goal',
        'Your desk, calendar or inbox may be a mess',
        'You would rather start than plan',
      ],
      watchFor: 'Chaotic productivity: effort lost to missed details, misplaced things and last-minute scrambles.',
      tryThis: 'End each workday with a ten-minute reset: clear the desk and write down tomorrow’s first step.',
    },
    secondHigher: {
      name: 'Organized, but slow to launch',
      note: 'You like things planned, neat and done the right way, but sustained drive is harder to find. You may organize the work instead of starting it. A start-small rule can turn your sense of order into real progress.',
      headline: 'You like things planned, neat and done right, but steady drive is harder to find.',
      gift: 'You bring structure, and you notice when things are out of place.',
      showsUp: [
        'Mess and disorder bother you',
        'You may organize the work instead of starting it',
        'You enjoy routine more than pushing hard',
      ],
      watchFor: 'Stagnation: everything is in order, but the big goal never moves.',
      tryThis: 'Do fifteen minutes on the hardest task first, before you tidy or plan.',
    },
  },
  [Ocean.Openness]: {
    firstHigher: {
      name: 'A thinker more than a feeler',
      note: 'You love ideas, arguments and figuring things out, but art, beauty and imagination draw you less. You may think your way through what others feel their way through. Both are ways of knowing; let beauty teach you too.',
      headline: 'You love ideas, arguments and figuring things out, but art and imagination draw you less.',
      gift: 'You reason clearly and enjoy hard problems; understanding is its own reward to you.',
      showsUp: [
        'You read and debate to understand',
        'You think your way through what others feel their way through',
        'Art and daydreaming can seem less useful to you',
      ],
      watchFor: 'You may treat beauty, story and feeling as lesser ways of knowing.',
      tryThis: 'Spend time with one piece of art or music this week, and notice what it teaches you.',
    },
    secondHigher: {
      name: 'A feeler more than a thinker',
      note: 'Beauty, music, imagination and feeling move you, but abstract debate draws you less. You may grasp things by sensing rather than analyzing. That is a real way of knowing, not a lesser one.',
      headline: 'Beauty, imagination and feeling move you deeply, but abstract debate draws you less.',
      gift: 'You notice patterns, beauty and emotion that others miss.',
      showsUp: [
        'You get lost in music, stories and nature',
        'You grasp things by sensing rather than analyzing',
        'Long arguments about ideas can leave you cold',
      ],
      watchFor: 'You may doubt your own insight because you can’t always explain it in words.',
      tryThis: 'Write down one thing you sensed this week, then try to put the “why” into one sentence.',
    },
  },
};

export interface AspectSplit {
  /** Percentile points between the two aspects. */
  gap: number;
  /** True when the gap is SPLIT_GAP or more. */
  split: boolean;
  /** 0 when the first aspect is higher, 1 when the second is. */
  higher: 0 | 1;
  name?: string;
  note?: string;
  /** The card that replaces the regular trait card for this mix. */
  card?: SplitSide;
}

/** Work out whether a trait's two aspects are split, and which side applies. */
export function aspectSplit(trait: string, first: number, second: number): AspectSplit {
  const gap = Math.round(Math.abs(first - second));
  const higher: 0 | 1 = first >= second ? 0 : 1;
  const split = gap >= SPLIT_GAP;
  const n = aspectSplits[trait];
  if (!split || !n) return {gap, split, higher};
  const side = higher === 0 ? n.firstHigher : n.secondHigher;
  return {gap, split, higher, name: side.name, note: side.note, card: side};
}
