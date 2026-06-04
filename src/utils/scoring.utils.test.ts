import { scoreAdjective, getPercentilesFromAverages } from './scoring.utils';

// ─── scoreAdjective ───────────────────────────────────────────────────────────

describe('scoreAdjective', () => {
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
    expect(scoreAdjective(50)).toBe('average');
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
    expect(scoreAdjective(99)).toBe('veryHigh');
    expect(scoreAdjective(100)).toBe('veryHigh');
  });

  it('respects >= boundary semantics at every threshold', () => {
    // Each boundary value must land in the higher bucket, not the lower
    expect(scoreAdjective(10)).toBe('low');      // NOT veryLow
    expect(scoreAdjective(25)).toBe('modLow');   // NOT low
    expect(scoreAdjective(40)).toBe('average');  // NOT modLow
    expect(scoreAdjective(60)).toBe('modHigh');  // NOT average
    expect(scoreAdjective(75)).toBe('high');     // NOT modHigh
    expect(scoreAdjective(90)).toBe('veryHigh'); // NOT high
  });
});

// ─── getPercentilesFromAverages ───────────────────────────────────────────────

describe('getPercentilesFromAverages', () => {
  beforeEach(() => {
    sessionStorage.clear();
  });

  it('returns 50 when score equals the male group mean (Openness)', () => {
    sessionStorage.setItem('gender', 'male');
    // Male Openness: mean=3.6, stdDev=0.51 → z=0 → 50th percentile
    const averages: Map<string, [number, number]> = new Map([
      ['Openness', [1, 3.6]],
    ]);
    expect(getPercentilesFromAverages(averages)['Openness']).toBe(50);
  });

  it('returns 50 when score equals the female group mean (Openness)', () => {
    sessionStorage.setItem('gender', 'female');
    // Female Openness: mean=3.61, stdDev=0.52 → z=0 → 50th percentile
    const averages: Map<string, [number, number]> = new Map([
      ['Openness', [1, 3.61]],
    ]);
    expect(getPercentilesFromAverages(averages)['Openness']).toBe(50);
  });

  it('returns ~84 for a score 1 stdDev above the male mean', () => {
    sessionStorage.setItem('gender', 'male');
    // Male Openness: mean=3.6, stdDev=0.51 → score=4.11 → z=1 → ~84th pct
    const averages: Map<string, [number, number]> = new Map([
      ['Openness', [1, 4.11]],
    ]);
    expect(getPercentilesFromAverages(averages)['Openness']).toBe(84);
  });

  it('returns ~16 for a score 1 stdDev below the male mean', () => {
    sessionStorage.setItem('gender', 'male');
    // Male Openness: mean=3.6, stdDev=0.51 → score=3.09 → z=-1 → ~16th pct
    const averages: Map<string, [number, number]> = new Map([
      ['Openness', [1, 3.09]],
    ]);
    expect(getPercentilesFromAverages(averages)['Openness']).toBe(16);
  });

  it('clamps extreme high scores to 99', () => {
    sessionStorage.setItem('gender', 'male');
    const averages: Map<string, [number, number]> = new Map([
      ['Openness', [1, 99.0]], // far above mean
    ]);
    expect(getPercentilesFromAverages(averages)['Openness']).toBe(99);
  });

  it('clamps extreme low scores to 1', () => {
    sessionStorage.setItem('gender', 'male');
    const averages: Map<string, [number, number]> = new Map([
      ['Openness', [1, -99.0]], // far below mean
    ]);
    expect(getPercentilesFromAverages(averages)['Openness']).toBe(1);
  });

  it('handles multiple traits in a single call', () => {
    sessionStorage.setItem('gender', 'male');
    // Male Openness mean=3.6, Male Extraversion mean=3.37 → both at mean → both 50
    const averages: Map<string, [number, number]> = new Map([
      ['Openness', [1, 3.6]],
      ['Extraversion', [1, 3.37]],
    ]);
    const result = getPercentilesFromAverages(averages);
    expect(result['Openness']).toBe(50);
    expect(result['Extraversion']).toBe(50);
  });

  it('returns an empty object for an empty averages map', () => {
    sessionStorage.setItem('gender', 'male');
    expect(getPercentilesFromAverages(new Map())).toEqual({});
  });

  it('throws when an unknown key is passed', () => {
    sessionStorage.setItem('gender', 'male');
    const averages: Map<string, [number, number]> = new Map([
      ['NonExistentTrait', [1, 3.5]],
    ]);
    expect(() => getPercentilesFromAverages(averages)).toThrow(
      'Mean or std dev not found in data map for key: NonExistentTrait',
    );
  });

  it('all output percentiles are between 1 and 99 inclusive', () => {
    sessionStorage.setItem('gender', 'female');
    const averages: Map<string, [number, number]> = new Map([
      ['Openness', [1, 1.0]],
      ['Conscientiousness', [1, 5.0]],
      ['Extraversion', [1, 3.42]],
    ]);
    const result = getPercentilesFromAverages(averages);
    for (const val of Object.values(result)) {
      expect(val).toBeGreaterThanOrEqual(1);
      expect(val).toBeLessThanOrEqual(99);
    }
  });
});
