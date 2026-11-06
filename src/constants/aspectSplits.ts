import {Ocean} from './schema';

/**
 * Splits inside a trait: when a person's two aspects of the same trait sit far apart
 * (for example high Compassion but low Politeness), the two pull different ways and can
 * cause friction the person may not understand in themselves.
 *
 * DRAFTS for Patrick to rewrite in his own words. One note for each direction:
 * `firstHigher` = the first aspect (as listed in TRAITS) is the higher one.
 */
export interface SplitNote {
  /** Short name for this split, shown as the note's title. */
  firstHigherName: string;
  firstHigher: string;
  secondHigherName: string;
  secondHigher: string;
}

/** How many percentile points apart two aspects must be to count as a split. */
export const SPLIT_GAP = 25;

export const aspectSplits: Record<string, SplitNote> = {
  [Ocean.Extraversion]: {
    firstHigherName: 'Warm, but not out front',
    firstHigher:
      'You light up around people and good things, but you don’t naturally take the lead. You can be the warmest person in the room and still wait for someone else to decide. That isn’t timidity, it’s a different way of being social. When something matters, practice saying what you want out loud.',
    secondHigherName: 'Out front, but not bubbly',
    secondHigher:
      'You speak up and take charge easily, but you don’t run on much visible excitement. People may read you as serious or intense when you are simply focused. Your drive is real even when it doesn’t look excited. Let people know when you are glad.',
  },
  [Ocean.Neuroticism]: {
    firstHigherName: 'Stress that goes inward',
    firstHigher:
      'When stress comes, it tends to turn inward: worry, second-guessing, pulling back, more than flashes of anger. People around you may not see how much you are carrying. Name it early, before it piles up.',
    secondHigherName: 'Stress that comes out',
    secondHigher:
      'When stress comes, it tends to come out: frustration rises fast and can spill over, even though you don’t dwell in worry. You may recover quickly and forget that others haven’t. Build a pause between feeling it and saying it.',
  },
  [Ocean.Agreeableness]: {
    firstHigherName: 'A big heart with a blunt edge',
    firstHigher:
      'You care deeply about people, but you don’t naturally soften your words. You may be the first to show up when someone is hurting and also the one who says the hard thing. People who only hear the words can miss the care behind them. It isn’t hypocrisy; they are two separate parts of you. Let the care show first.',
    secondHigherName: 'Courteous, but not easily moved',
    secondHigher:
      'You are respectful, fair and slow to offend, but you don’t feel other people’s pain as strongly as some do. You keep the peace well; warmth may take a deliberate choice. Pair your courtesy with a real question about how someone is doing.',
  },
  [Ocean.Conscientiousness]: {
    firstHigherName: 'Hard work in a messy room',
    firstHigher:
      'You push hard toward goals, but order and tidiness don’t come naturally. You may get a great deal done in the middle of some chaos. A few simple systems can protect the effort you are already putting in.',
    secondHigherName: 'Organized, but slow to launch',
    secondHigher:
      'You like things planned, neat and done the right way, but sustained drive is harder to find. You may organize the work instead of starting it. A start-small rule can turn your sense of order into real progress.',
  },
  [Ocean.Openness]: {
    firstHigherName: 'A thinker more than a feeler',
    firstHigher:
      'You love ideas, arguments and figuring things out, but art, beauty and imagination draw you less. You may think your way through what others feel their way through. Both are ways of knowing; let beauty teach you too.',
    secondHigherName: 'A feeler more than a thinker',
    secondHigher:
      'Beauty, music, imagination and feeling move you, but abstract debate draws you less. You may grasp things by sensing rather than analyzing. That is a real way of knowing, not a lesser one.',
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
}

/** Work out whether a trait's two aspects are split, and which note applies. */
export function aspectSplit(trait: string, first: number, second: number): AspectSplit {
  const gap = Math.round(Math.abs(first - second));
  const higher: 0 | 1 = first >= second ? 0 : 1;
  const split = gap >= SPLIT_GAP;
  const n = aspectSplits[trait];
  if (!split || !n) return {gap, split, higher};
  return higher === 0
    ? {gap, split, higher, name: n.firstHigherName, note: n.firstHigher}
    : {gap, split, higher, name: n.secondHigherName, note: n.secondHigher};
}
