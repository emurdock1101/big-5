import { getScoreLevel, getInterpretation, buildAIContext } from './interpretations.utils';
import { Ocean, Aspect } from '../constants/schema';

// ─── getScoreLevel ────────────────────────────────────────────────────────────

describe('getScoreLevel', () => {
  it('returns veryLow for percentiles below 10', () => {
    expect(getScoreLevel(0)).toBe('veryLow');
    expect(getScoreLevel(9)).toBe('veryLow');
  });

  it('returns low for percentiles 10–24', () => {
    expect(getScoreLevel(10)).toBe('low');
    expect(getScoreLevel(24)).toBe('low');
  });

  it('returns modLow for percentiles 25–39', () => {
    expect(getScoreLevel(25)).toBe('modLow');
    expect(getScoreLevel(39)).toBe('modLow');
  });

  it('returns average for percentiles 40–59', () => {
    expect(getScoreLevel(40)).toBe('average');
    expect(getScoreLevel(59)).toBe('average');
  });

  it('returns modHigh for percentiles 60–74', () => {
    expect(getScoreLevel(60)).toBe('modHigh');
    expect(getScoreLevel(74)).toBe('modHigh');
  });

  it('returns high for percentiles 75–89', () => {
    expect(getScoreLevel(75)).toBe('high');
    expect(getScoreLevel(89)).toBe('high');
  });

  it('returns veryHigh for percentiles 90 and above', () => {
    expect(getScoreLevel(90)).toBe('veryHigh');
    expect(getScoreLevel(99)).toBe('veryHigh');
    expect(getScoreLevel(100)).toBe('veryHigh');
  });
});

// ─── getInterpretation ────────────────────────────────────────────────────────

describe('getInterpretation', () => {
  it('returns an interpretation for a valid OCEAN trait + percentile', () => {
    const result = getInterpretation(Ocean.Openness, 72);
    expect(result).toBeDefined();
    expect(result?.trait).toBe(Ocean.Openness);
    expect(result?.scoreLevel).toBe('modHigh');
    expect(result?.paragraphs.length).toBeGreaterThan(0);
  });

  it('returns an interpretation for a valid Aspect trait + percentile', () => {
    const result = getInterpretation(Aspect.Enthusiasm, 45);
    expect(result).toBeDefined();
    expect(result?.trait).toBe(Aspect.Enthusiasm);
    expect(result?.scoreLevel).toBe('average');
  });

  it('returns undefined for an unknown trait', () => {
    const result = getInterpretation('NotARealTrait', 50);
    expect(result).toBeUndefined();
  });

  it('returns non-empty paragraphs for every OCEAN trait at every score level', () => {
    const traits = Object.values(Ocean);
    const percentiles = [5, 15, 30, 50, 65, 80, 95];
    for (const trait of traits) {
      for (const percentile of percentiles) {
        const result = getInterpretation(trait, percentile);
        expect(result).toBeDefined();
        expect(result?.paragraphs.length).toBeGreaterThan(0);
        result?.paragraphs.forEach((p) => expect(p.length).toBeGreaterThan(0));
      }
    }
  });

  it('returns non-empty paragraphs for every Aspect at every score level', () => {
    const aspects = Object.values(Aspect);
    const percentiles = [5, 15, 30, 50, 65, 80, 95];
    for (const aspect of aspects) {
      for (const percentile of percentiles) {
        const result = getInterpretation(aspect, percentile);
        expect(result).toBeDefined();
        expect(result?.paragraphs.length).toBeGreaterThan(0);
      }
    }
  });
});

// ─── buildAIContext ───────────────────────────────────────────────────────────

describe('buildAIContext', () => {
  const samplePercentiles: Record<string, number> = {
    [Ocean.Extraversion]: 65,
    [Ocean.Neuroticism]: 82,
    [Ocean.Agreeableness]: 45,
    [Ocean.Conscientiousness]: 30,
    [Ocean.Openness]: 91,
  };

  it('returns a non-empty string', () => {
    const result = buildAIContext(samplePercentiles);
    expect(typeof result).toBe('string');
    expect(result.length).toBeGreaterThan(0);
  });

  it('includes the header', () => {
    const result = buildAIContext(samplePercentiles);
    expect(result).toContain('=== Personality Assessment Results ===');
  });

  it('includes each trait name uppercased', () => {
    const result = buildAIContext(samplePercentiles);
    expect(result).toContain('EXTRAVERSION');
    expect(result).toContain('NEUROTICISM');
    expect(result).toContain('OPENNESS');
  });

  it('includes the percentile numbers', () => {
    const result = buildAIContext(samplePercentiles);
    expect(result).toContain('65th percentile');
    expect(result).toContain('82nd percentile');
  });

  it('includes score level labels', () => {
    const result = buildAIContext(samplePercentiles);
    expect(result).toContain('Moderately High'); // 65 → modHigh
    expect(result).toContain('Very High');        // 91 → veryHigh
  });

  it('returns an empty context (just header) for unknown traits', () => {
    const result = buildAIContext({ UnknownTrait: 50 });
    expect(result).toContain('=== Personality Assessment Results ===');
    expect(result).not.toContain('UNKNOWNTRAIT');
  });

  it('returns empty string for empty percentiles', () => {
    const result = buildAIContext({});
    expect(result.trim()).toBe('=== Personality Assessment Results ===');
  });
});
