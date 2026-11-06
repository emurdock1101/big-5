import {Ocean} from './schema';

/**
 * Notes on how two traits work together, written by Patrick.
 * Key: the two trait names joined by " + ", in E, N, A, C, O order
 * (e.g. "Extraversion + Agreeableness"). Leave a note empty until it is written;
 * the results page shows "coming soon" for empty notes.
 *
 * Each pair may have one general note, plus optional notes for when both are
 * higher, both lower, or one higher and one lower.
 */
export interface CombinationNote {
  general?: string;
  bothHigher?: string;
  bothLower?: string;
  firstHigher?: string;
  secondHigher?: string;
}

export const combinations: Record<string, CombinationNote> = {
  [`${Ocean.Extraversion} + ${Ocean.Neuroticism}`]: {},
  [`${Ocean.Extraversion} + ${Ocean.Agreeableness}`]: {},
  [`${Ocean.Extraversion} + ${Ocean.Conscientiousness}`]: {},
  [`${Ocean.Extraversion} + ${Ocean.Openness}`]: {},
  [`${Ocean.Neuroticism} + ${Ocean.Agreeableness}`]: {},
  [`${Ocean.Neuroticism} + ${Ocean.Conscientiousness}`]: {},
  [`${Ocean.Neuroticism} + ${Ocean.Openness}`]: {},
  [`${Ocean.Agreeableness} + ${Ocean.Conscientiousness}`]: {},
  [`${Ocean.Agreeableness} + ${Ocean.Openness}`]: {},
  [`${Ocean.Conscientiousness} + ${Ocean.Openness}`]: {},
};

/** Pick the most specific written note for this pair and these two scores. */
export function combinationNote(first: string, second: string, a: number, b: number): string | undefined {
  const n = combinations[`${first} + ${second}`];
  if (!n) return undefined;
  const hi = (s: number) => s >= 60;
  const lo = (s: number) => s < 40;
  if (hi(a) && hi(b) && n.bothHigher) return n.bothHigher;
  if (lo(a) && lo(b) && n.bothLower) return n.bothLower;
  if (a - b >= 20 && n.firstHigher) return n.firstHigher;
  if (b - a >= 20 && n.secondHigher) return n.secondHigher;
  return n.general || undefined;
}
