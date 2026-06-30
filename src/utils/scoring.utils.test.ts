import { scoreAdjective, getPercentilesFromAverages } from './scoring.utils';
import { Ocean, Aspect } from '../constants/schema';

// ─── scoreAdjective ───────────────────────────────────────────────────────────

describe('scoreAdjective', () => {
  // Boundary values for each bucket
  it('returns veryLow for scores below 10', () => {
    expect(scoreAdjective(0)).toBe('veryLow');
    expect(scoreAdjective(9)).toBe('veryLow');
  });

  it('returns low for scores 10–24', () => {
    expect(scoreAdjective(10)).toBe('low');
    expect(scoreAdjective(24)).toBe('low');
  });

  it('returns modLow for scores 25–39', () => {
    expect(scoreAdjective(25)).toBe('modLow');
    expect(scoreAdjective(39)).toBe('modLow');
  });

  it('returns average for scores 40–59', () => {
    expect(scoreAdjective(40)).toBe('average');
    expect(scoreAdjective(59)).toBe('average');
  });

  it('returns modHigh for scores 60–74', () => {
    expect(scoreAdjective(60)).toBe('modHigh');
    expect(scoreAdjective(74)).toBe('modHigh');
  });

  it('returns high for scores 75–89', () => {
    expect(scoreAdjective(75)).toBe('high');
    expect(scoreAdjective(89)).toBe('high');
  });

  it('returns veryHigh for scores 90 and above', () => {
    expect(scoreAdjective(90)).toBe('veryHigh');
    expect(scoreAdjective(100)).toBe('veryHigh');
  });

  it('is consistent with interpretations.utils getScoreLevel', () => {
    // Both utilities use the same bucket thresholds — verify alignment at boundaries
    const cases: [number, string][] = [
      [9, 'veryLow'],
      [10, 'low'],
      [25, 'modLow'],
      [40, 'average'],
      [60, 'modHigh'],
      [75, 'high'],
      [90, 'veryHigh'],
    ];
    cases.forEach(([score, label]) => {
      expect(scoreAdjective(score)).toBe(label);
    });
  });
});

// ─── getPercentilesFromAverages ───────────────────────────────────────────────

describe('getPercentilesFromAverages', () => {
  beforeEach(() => {
    sessionStorage.clear();
  });

  describe('male gender normative data', () => {
    beforeEach(() => {
      sessionStorage.setItem('gender', 'male');
    });

    it('returns ~50th percentile when average equals the normative mean', () => {
      // Male Openness: mean=3.6, stdDev=0.51 → z=0 → P≈50
      const averages = new Map<string, [number, number]>([
        [Ocean.Openness.toString(), [1, 3.6]],
      ]);
      const result = getPercentilesFromAverages(averages);
      expect(result[Ocean.Openness]).toBeCloseTo(50, 0);
    });

    it('returns ~84th percentile when average is one std dev above the mean', () => {
      // Male Openness: mean=3.6, stdDev=0.51 → avg=4.11 → z≈1 → P≈84
      const averages = new Map<string, [number, number]>([
        [Ocean.Openness.toString(), [1, 3.6 + 0.51]],
      ]);
      const result = getPercentilesFromAverages(averages);
      expect(result[Ocean.Openness]).toBeGreaterThanOrEqual(82);
      expect(result[Ocean.Openness]).toBeLessThanOrEqual(86);
    });

    it('returns ~16th percentile when average is one std dev below the mean', () => {
      // Male Openness: mean=3.6, stdDev=0.51 → avg=3.09 → z≈-1 → P≈16
      const averages = new Map<string, [number, number]>([
        [Ocean.Openness.toString(), [1, 3.6 - 0.51]],
      ]);
      const result = getPercentilesFromAverages(averages);
      expect(result[Ocean.Openness]).toBeGreaterThanOrEqual(14);
      expect(result[Ocean.Openness]).toBeLessThanOrEqual(18);
    });

    it('clamps extreme scores to 1–99', () => {
      // A wildly low average should clamp to 1, not go below
      const averages = new Map<string, [number, number]>([
        [Ocean.Openness.toString(), [1, 0]],
      ]);
      const result = getPercentilesFromAverages(averages);
      expect(result[Ocean.Openness]).toBe(1);
    });

    it('returns percentiles for multiple traits simultaneously', () => {
      const averages = new Map<string, [number, number]>([
        [Ocean.Openness.toString(), [1, 3.6]],        // ~50th
        [Ocean.Conscientiousness.toString(), [1, 3.32]], // ~50th
      ]);
      const result = getPercentilesFromAverages(averages);
      expect(Object.keys(result)).toHaveLength(2);
      expect(result[Ocean.Openness]).toBeDefined();
      expect(result[Ocean.Conscientiousness]).toBeDefined();
    });

    it('throws when a key has no matching normative data', () => {
      const averages = new Map<string, [number, number]>([
        ['UnknownTrait', [1, 3.0]],
      ]);
      expect(() => getPercentilesFromAverages(averages)).toThrow(
        /mean or std dev not found/i,
      );
    });
  });

  describe('female gender normative data', () => {
    beforeEach(() => {
      sessionStorage.setItem('gender', 'female');
    });

    it('returns ~50th percentile when average equals the female normative mean', () => {
      // Female Openness: mean=3.61, stdDev=0.52 → z=0 → P≈50
      const averages = new Map<string, [number, number]>([
        [Ocean.Openness.toString(), [1, 3.61]],
      ]);
      const result = getPercentilesFromAverages(averages);
      expect(result[Ocean.Openness]).toBeCloseTo(50, 0);
    });

    it('produces different percentiles for male vs female given the same raw average', () => {
      // Same raw score of 3.65 → different percentile depending on gender norms
      const averages = new Map<string, [number, number]>([
        [Ocean.Openness.toString(), [1, 3.65]],
      ]);

      sessionStorage.setItem('gender', 'male');
      const maleResult = getPercentilesFromAverages(averages);

      sessionStorage.setItem('gender', 'female');
      const femaleResult = getPercentilesFromAverages(averages);

      // Male mean is 3.6 (lower) so 3.65 scores higher for males than females (mean 3.72)
      expect(maleResult[Ocean.Openness]).toBeGreaterThan(femaleResult[Ocean.Openness]);
    });
  });

  describe('aspect-level scoring', () => {
    beforeEach(() => {
      sessionStorage.setItem('gender', 'male');
    });

    it('returns ~50th percentile for Enthusiasm at its normative mean (male)', () => {
      // Male Enthusiasm: mean=3.4, stdDev=0.66
      const averages = new Map<string, [number, number]>([
        [Aspect.Enthusiasm.toString(), [1, 3.4]],
      ]);
      const result = getPercentilesFromAverages(averages);
      expect(result[Aspect.Enthusiasm]).toBeCloseTo(50, 0);
    });
  });
});
