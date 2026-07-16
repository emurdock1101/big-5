/**
 * pdf.utils.test.ts
 *
 * Tests for generatePdfDoc — the function that builds and downloads a jsPDF
 * document from a user's personality percentile results.
 *
 * Strategy: mock jsPDF so no real PDF is rendered, then assert on the
 * sequence of calls made to the doc object (fonts, text, lines, save).
 */

// ── jsPDF mock ──────────────────────────────────────────────────────────────
// Must be called before `import {generatePdfDoc}` so babel-jest hoisting
// intercepts the require inside pdf.utils.ts.
jest.mock('jspdf');

import jsPDF from 'jspdf';
import {Ocean, Aspect} from '../constants/schema';
import {generatePdfDoc} from './pdf.utils';

// ── helpers ──────────────────────────────────────────────────────────────────

/** OCEAN traits in the order TRAIT_CONFIG defines them inside pdf.utils.ts. */
const OCEAN_ORDER = [
  Ocean.Extraversion,
  Ocean.Neuroticism,
  Ocean.Agreeableness,
  Ocean.Conscientiousness,
  Ocean.Openness,
] as const;

/** Aspect pairs, matching TRAIT_CONFIG's per-trait ordering. */
const ASPECT_PAIRS: readonly [Aspect, Aspect][] = [
  [Aspect.Enthusiasm, Aspect.Assertiveness],
  [Aspect.Withdrawal, Aspect.Volatility],
  [Aspect.Compassion, Aspect.Politeness],
  [Aspect.Industriousness, Aspect.Orderliness],
  [Aspect.AestheticOpenness, Aspect.Interest],
];

/** Build a complete percentile map with unique, non-99 values for every key. */
const makePercentiles = (): Record<string, number> => {
  const map: Record<string, number> = {};
  let score = 10;
  for (const ocean of OCEAN_ORDER) {
    map[ocean] = score++;
  }
  for (const [a1, a2] of ASPECT_PAIRS) {
    map[a1] = score++;
    map[a2] = score++;
  }
  return map;
};

/** Returns the mock jsPDF instance created during the most recent generatePdfDoc call. */
const lastDoc = () => (jsPDF as unknown as jest.Mock).mock.results[0]?.value as any;

// ── test setup ────────────────────────────────────────────────────────────────

const MockJsPDF = jsPDF as unknown as jest.Mock;

beforeEach(() => {
  jest.clearAllMocks();

  // Each `new jsPDF()` call returns a fresh stub so tests are isolated.
  MockJsPDF.mockImplementation(() => ({
    setFont: jest.fn(),
    setFontSize: jest.fn(),
    text: jest.fn(),
    getTextDimensions: jest.fn().mockReturnValue({w: 50}),
    internal: {pageSize: {width: 210}},
    setDrawColor: jest.fn(),
    line: jest.fn(),
    save: jest.fn(),
  }));
});

// ── tests ─────────────────────────────────────────────────────────────────────

const EMAIL = 'user@example.com';

describe('generatePdfDoc', () => {
  // ── filename ────────────────────────────────────────────────────────────────

  it('saves the PDF with a filename derived from the email address', () => {
    generatePdfDoc(EMAIL, null);
    expect(lastDoc().save).toHaveBeenCalledTimes(1);
    expect(lastDoc().save).toHaveBeenCalledWith(`${EMAIL}_personality_plus_results.pdf`);
  });

  it('preserves special characters in the email when naming the file', () => {
    const fancy = 'user+tag@sub.domain.com';
    generatePdfDoc(fancy, null);
    expect(lastDoc().save).toHaveBeenCalledWith(`${fancy}_personality_plus_results.pdf`);
  });

  // ── title & email text ──────────────────────────────────────────────────────

  it('renders the literal title "Personality Plus Results"', () => {
    generatePdfDoc(EMAIL, null);
    const texts: string[] = lastDoc().text.mock.calls.map((c: any[]) => c[0]);
    expect(texts).toContain('Personality Plus Results');
  });

  it('renders the email address as a body text element', () => {
    generatePdfDoc(EMAIL, null);
    const texts: string[] = lastDoc().text.mock.calls.map((c: any[]) => c[0]);
    expect(texts).toContain(EMAIL);
  });

  // ── font sizes ──────────────────────────────────────────────────────────────

  it('uses font size 24 for the title', () => {
    generatePdfDoc(EMAIL, null);
    const sizes: number[] = lastDoc().setFontSize.mock.calls.map((c: any[]) => c[0]);
    expect(sizes).toContain(24);
  });

  it('uses font size 16 for the email', () => {
    generatePdfDoc(EMAIL, null);
    const sizes: number[] = lastDoc().setFontSize.mock.calls.map((c: any[]) => c[0]);
    expect(sizes).toContain(16);
  });

  it('uses font size 20 for OCEAN trait labels', () => {
    generatePdfDoc(EMAIL, null);
    const sizes: number[] = lastDoc().setFontSize.mock.calls.map((c: any[]) => c[0]);
    expect(sizes).toContain(20);
  });

  it('uses font size 18 for aspect labels', () => {
    generatePdfDoc(EMAIL, null);
    const sizes: number[] = lastDoc().setFontSize.mock.calls.map((c: any[]) => c[0]);
    expect(sizes).toContain(18);
  });

  // ── null percentiles → 99 fallback ─────────────────────────────────────────

  it('falls back to 99 for all OCEAN scores when percentiles is null', () => {
    generatePdfDoc(EMAIL, null);
    const texts: string[] = lastDoc().text.mock.calls.map((c: any[]) => c[0]);
    for (const ocean of OCEAN_ORDER) {
      expect(texts).toContain(`${ocean}: 99`);
    }
  });

  it('falls back to 99 for all Aspect scores when percentiles is null', () => {
    generatePdfDoc(EMAIL, null);
    const texts: string[] = lastDoc().text.mock.calls.map((c: any[]) => c[0]);
    for (const [a1, a2] of ASPECT_PAIRS) {
      expect(texts).toContain(`${a1}: 99`);
      expect(texts).toContain(`${a2}: 99`);
    }
  });

  it('falls back to 99 for any trait absent from the percentiles map', () => {
    // Only Extraversion is in the map — all others should show 99.
    generatePdfDoc(EMAIL, {[Ocean.Extraversion]: 75});
    const texts: string[] = lastDoc().text.mock.calls.map((c: any[]) => c[0]);
    expect(texts).toContain(`${Ocean.Extraversion}: 75`);
    expect(texts).toContain(`${Ocean.Neuroticism}: 99`);
    expect(texts).toContain(`${Ocean.Agreeableness}: 99`);
  });

  // ── real percentile values used ─────────────────────────────────────────────

  it('renders the actual OCEAN score when percentiles are provided', () => {
    const percentiles = makePercentiles();
    generatePdfDoc(EMAIL, percentiles);
    const texts: string[] = lastDoc().text.mock.calls.map((c: any[]) => c[0]);
    for (const ocean of OCEAN_ORDER) {
      expect(texts).toContain(`${ocean}: ${percentiles[ocean]}`);
    }
  });

  it('renders the actual Aspect scores when percentiles are provided', () => {
    const percentiles = makePercentiles();
    generatePdfDoc(EMAIL, percentiles);
    const texts: string[] = lastDoc().text.mock.calls.map((c: any[]) => c[0]);
    for (const [a1, a2] of ASPECT_PAIRS) {
      expect(texts).toContain(`${a1}: ${percentiles[a1]}`);
      expect(texts).toContain(`${a2}: ${percentiles[a2]}`);
    }
  });

  it('does NOT render 99 for traits that have explicit values', () => {
    const percentiles = makePercentiles();
    generatePdfDoc(EMAIL, percentiles);
    const texts: string[] = lastDoc().text.mock.calls.map((c: any[]) => c[0]);
    // None of the OCEAN trait labels should appear with ": 99" since all have real scores.
    for (const ocean of OCEAN_ORDER) {
      expect(texts).not.toContain(`${ocean}: 99`);
    }
  });

  // ── separator lines ─────────────────────────────────────────────────────────

  it('draws exactly 5 separator lines — one per OCEAN trait', () => {
    generatePdfDoc(EMAIL, null);
    expect(lastDoc().line).toHaveBeenCalledTimes(5);
  });

  it('draws each separator line from x=20 to x=190', () => {
    generatePdfDoc(EMAIL, null);
    for (const call of lastDoc().line.mock.calls) {
      expect(call[0]).toBe(20);   // x1
      expect(call[2]).toBe(190);  // x2
    }
  });

  // ── setDrawColor ────────────────────────────────────────────────────────────

  it('calls setDrawColor exactly 5 times — once per trait', () => {
    generatePdfDoc(EMAIL, null);
    expect(lastDoc().setDrawColor).toHaveBeenCalledTimes(5);
  });

  it('uses distinct colors for all 5 OCEAN traits', () => {
    generatePdfDoc(EMAIL, null);
    const colorStrings = (lastDoc().setDrawColor.mock.calls as any[][]).map((c) => c.join(','));
    const unique = new Set(colorStrings);
    expect(unique.size).toBe(5);
  });

  // ── total text calls ─────────────────────────────────────────────────────────

  it('produces exactly 17 text calls: 1 title + 1 email + 5 OCEAN + 10 Aspects', () => {
    generatePdfDoc(EMAIL, null);
    // 1 title + 1 email + 5 ocean scores + 10 aspect scores (2 per trait × 5 traits)
    expect(lastDoc().text).toHaveBeenCalledTimes(17);
  });

  // ── jsPDF constructor ───────────────────────────────────────────────────────

  it('instantiates jsPDF exactly once per call', () => {
    generatePdfDoc(EMAIL, null);
    expect(MockJsPDF).toHaveBeenCalledTimes(1);
  });

  it('creates a new jsPDF instance on each generatePdfDoc call', () => {
    generatePdfDoc(EMAIL, null);
    generatePdfDoc('second@example.com', null);
    expect(MockJsPDF).toHaveBeenCalledTimes(2);
  });
});
