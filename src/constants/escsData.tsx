// Norms: mean and SD for each trait and aspect, by gender, from
// Weisberg, DeYoung & Hirsh (2011), Gender differences in personality across the ten aspects of the Big Five,
// Frontiers in Psychology 2, 178, Table 2. Scoring (utils/scoring.utils.ts) picks the column matching the
// group chosen before the test. Raw-score columns. Name mapping from the paper: 'Openness/Intellect' (domain)
// = Openness; 'Intellect' (aspect) = Interest in Ideas; 'Openness' (aspect) = Aesthetic Openness.
// Checked against Table 2 on 2026-11-05: all 30 values match.
import {Aspect, EscsData, Ocean} from './schema';

export const escsMap: Map<string, EscsData> = new Map([
  [
    Ocean.Openness.toString(),
    {
      mean: 3.72,
      stdDev: 0.53,
    },
  ],
  [
    Aspect.AestheticOpenness.toString(),
    {
      mean: 3.74,
      stdDev: 0.61,
    },
  ],
  [
    Aspect.Interest.toString(),
    {
      mean: 3.7,
      stdDev: 0.68,
    },
  ],
  [
    Ocean.Conscientiousness.toString(),
    {
      mean: 3.76,
      stdDev: 0.51,
    },
  ],

  [
    Aspect.Industriousness.toString(),
    {
      mean: 3.8,
      stdDev: 0.61,
    },
  ],
  [
    Aspect.Orderliness.toString(),
    {
      mean: 3.73,
      stdDev: 0.62,
    },
  ],

  [
    Ocean.Extraversion.toString(),
    {
      mean: 3.48,
      stdDev: 0.6,
    },
  ],
  [
    Aspect.Enthusiasm.toString(),
    {
      mean: 3.59,
      stdDev: 0.72,
    },
  ],
  [
    Aspect.Assertiveness.toString(),
    {
      mean: 3.36,
      stdDev: 0.7,
    },
  ],
  [
    Ocean.Agreeableness.toString(),
    {
      mean: 4.11,
      stdDev: 0.45,
    },
  ],
  [
    Aspect.Compassion.toString(),
    {
      mean: 4.11,
      stdDev: 0.54,
    },
  ],
  [
    Aspect.Politeness.toString(),
    {
      mean: 4.1,
      stdDev: 0.53,
    },
  ],
  [
    Ocean.Neuroticism.toString(),
    {
      mean: 2.46,
      stdDev: 0.63,
    },
  ],
  [
    Aspect.Withdrawal.toString(),
    {
      mean: 2.45,
      stdDev: 0.71,
    },
  ],
  [
    Aspect.Volatility.toString(),
    {
      mean: 2.48,
      stdDev: 0.7,
    },
  ],
]);

export const maleDataMap: Map<string, EscsData> = new Map([
  [
    Ocean.Openness.toString(),
    {
      mean: 3.6,
      stdDev: 0.51,
    },
  ],
  [
    Aspect.AestheticOpenness.toString(),
    {
      mean: 3.57,
      stdDev: 0.61,
    },
  ],
  [
    Aspect.Interest.toString(),
    {
      mean: 3.62,
      stdDev: 0.61,
    },
  ],
  [
    Ocean.Conscientiousness.toString(),
    {
      mean: 3.32,
      stdDev: 0.54,
    },
  ],
  [
    Aspect.Industriousness.toString(),
    {
      mean: 3.25,
      stdDev: 0.68,
    },
  ],
  [
    Aspect.Orderliness.toString(),
    {
      mean: 3.38,
      stdDev: 0.61,
    },
  ],
  [
    Ocean.Extraversion.toString(),
    {
      mean: 3.37,
      stdDev: 0.55,
    },
  ],
  [
    Aspect.Enthusiasm.toString(),
    {
      mean: 3.4,
      stdDev: 0.66,
    },
  ],
  [
    Aspect.Assertiveness.toString(),
    {
      mean: 3.34,
      stdDev: 0.64,
    },
  ],
  [
    Ocean.Agreeableness.toString(),
    {
      mean: 3.65,
      stdDev: 0.5,
    },
  ],
  [
    Aspect.Compassion.toString(),
    {
      mean: 3.78,
      stdDev: 0.6,
    },
  ],
  [
    Aspect.Politeness.toString(),
    {
      mean: 3.52,
      stdDev: 0.61,
    },
  ],
  [
    Ocean.Neuroticism.toString(),
    {
      mean: 2.68,
      stdDev: 0.65,
    },
  ],
  [
    Aspect.Withdrawal.toString(),
    {
      mean: 2.73,
      stdDev: 0.69,
    },
  ],
  [
    Aspect.Volatility.toString(),
    {
      mean: 2.63,
      stdDev: 0.75,
    },
  ],
]);

export const femaleDataMap: Map<string, EscsData> = new Map([
  [
    Ocean.Openness.toString(),
    {
      mean: 3.61,
      stdDev: 0.52,
    },
  ],
  [
    Aspect.AestheticOpenness.toString(),
    {
      mean: 3.74,
      stdDev: 0.6,
    },
  ],
  [
    Aspect.Interest.toString(),
    {
      mean: 3.48,
      stdDev: 0.63,
    },
  ],
  [
    Ocean.Conscientiousness.toString(),
    {
      mean: 3.35,
      stdDev: 0.58,
    },
  ],

  [
    Aspect.Industriousness.toString(),
    {
      mean: 3.21,
      stdDev: 0.73,
    },
  ],
  [
    Aspect.Orderliness.toString(),
    {
      mean: 3.49,
      stdDev: 0.63,
    },
  ],
  [
    Ocean.Extraversion.toString(),
    {
      mean: 3.42,
      stdDev: 0.59,
    },
  ],
  [
    Aspect.Enthusiasm.toString(),
    {
      mean: 3.56,
      stdDev: 0.68,
    },
  ],
  [
    Aspect.Assertiveness.toString(),
    {
      mean: 3.28,
      stdDev: 0.68,
    },
  ],
  [
    Ocean.Agreeableness.toString(),
    {
      mean: 3.89,
      stdDev: 0.5,
    },
  ],

  [
    Aspect.Compassion.toString(),
    {
      mean: 4.04,
      stdDev: 0.56,
    },
  ],
  [
    Aspect.Politeness.toString(),
    {
      mean: 3.74,
      stdDev: 0.61,
    },
  ],
  [
    Ocean.Neuroticism.toString(),
    {
      mean: 2.94,
      stdDev: 0.67,
    },
  ],
  [
    Aspect.Withdrawal.toString(),
    {
      mean: 3.02,
      stdDev: 0.71,
    },
  ],
  [
    Aspect.Volatility.toString(),
    {
      mean: 2.86,
      stdDev: 0.77,
    },
  ],
]);
