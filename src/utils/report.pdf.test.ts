/**
 * Tests for generateReport, the downloadable PDF report.
 * jsPDF is mocked; we check what the report says, not where it is drawn.
 */
jest.mock('jspdf');

import jsPDF from 'jspdf';
import {Aspect, Ocean} from '../constants/schema';
import {generateReport, reportFileName, levelWord, cleanName} from './report.pdf';
import {getShortWriteup} from '../constants/shortWriteups';

const MockJsPDF = jsPDF as unknown as jest.Mock;

const makeDoc = () => {
  let pages = 1;
  return {
    setFont: jest.fn(),
    setFontSize: jest.fn(),
    setTextColor: jest.fn(),
    setFillColor: jest.fn(),
    setDrawColor: jest.fn(),
    setLineWidth: jest.fn(),
    rect: jest.fn(),
    line: jest.fn(),
    text: jest.fn(),
    addImage: jest.fn(),
    addPage: jest.fn(() => {
      pages++;
    }),
    splitTextToSize: jest.fn((t: string) => [t]),
    getNumberOfPages: jest.fn(() => pages),
    setPage: jest.fn(),
    save: jest.fn(),
  };
};

const lastDoc = () => MockJsPDF.mock.results[MockJsPDF.mock.results.length - 1]?.value;
/** Every string the report wrote, flattened. */
const allText = (): string[] =>
  lastDoc().text.mock.calls.flatMap((c: any[]) => (Array.isArray(c[0]) ? c[0] : [c[0]]));

const SCORES: Record<string, number> = {
  [Ocean.Extraversion]: 72,
  [Aspect.Enthusiasm]: 68,
  [Aspect.Assertiveness]: 74,
  [Ocean.Neuroticism]: 31,
  [Aspect.Withdrawal]: 36,
  [Aspect.Volatility]: 27,
  [Ocean.Agreeableness]: 64,
  [Aspect.Compassion]: 86,
  [Aspect.Politeness]: 34,
  [Ocean.Conscientiousness]: 48,
  [Aspect.Industriousness]: 66,
  [Aspect.Orderliness]: 30,
  [Ocean.Openness]: 85,
  [Aspect.Interest]: 88,
  [Aspect.AestheticOpenness]: 79,
};

const base = {name: 'Alex', email: 'alex@example.com', gender: 'male', percentiles: SCORES};

beforeEach(() => {
  jest.clearAllMocks();
  MockJsPDF.mockImplementation(makeDoc);
});

describe('generateReport', () => {
  it('does nothing when there are no scores', () => {
    generateReport({...base, percentiles: null});
    expect(MockJsPDF).not.toHaveBeenCalled();
  });

  it('starts with a landscape page for the tree, then portrait pages', () => {
    generateReport(base);
    expect(MockJsPDF.mock.calls[0][0]).toMatchObject({orientation: 'landscape', format: 'letter'});
    for (const call of lastDoc().addPage.mock.calls) expect(call).toEqual(['letter', 'portrait']);
    // tree + scores + one page per trait, at least
    expect(lastDoc().getNumberOfPages()).toBeGreaterThanOrEqual(7);
  });

  it('titles the report with the person’s name', () => {
    generateReport(base);
    expect(allText()).toContain('Alex’s personality');
  });

  it('falls back to "Your personality" without a name', () => {
    generateReport({...base, name: 'name_unknown'});
    expect(allText()).toContain('Your personality');
  });

  it('names the comparison group', () => {
    generateReport(base);
    expect(allText().some((t) => t.includes('compared with other men'))).toBe(true);
  });

  it('lists every trait and aspect with its percentile', () => {
    generateReport(base);
    const text = allText();
    for (const [key, value] of Object.entries(SCORES)) {
      expect(text).toContain(key);
      expect(text).toContain(`${value}${['th', 'st', 'nd', 'rd'][value % 10] || 'th'} · ${levelWord(value)}`);
    }
  });

  it('includes the short write-up headline for each trait', () => {
    generateReport(base);
    const card = getShortWriteup(Ocean.Agreeableness, 'modHigh');
    expect(allText()).toContain(card!.headline);
  });

  it('includes a split box when a trait’s aspects are far apart', () => {
    generateReport(base);
    expect(allText().some((t) => t.startsWith('A SPLIT INSIDE THIS TRAIT'))).toBe(true);
  });

  it('places the tree image when one is provided', () => {
    generateReport({...base, treeImage: 'data:image/png;base64,AAAA'});
    expect(lastDoc().addImage).toHaveBeenCalledTimes(1);
  });

  it('still builds the report when the tree could not be drawn', () => {
    generateReport({...base, treeImage: null});
    expect(lastDoc().addImage).not.toHaveBeenCalled();
    expect(lastDoc().save).toHaveBeenCalledTimes(1);
  });

  it('saves the file under the person’s name', () => {
    generateReport(base);
    expect(lastDoc().save).toHaveBeenCalledWith('Personality-Plus-Alex.pdf');
  });
});

describe('helpers', () => {
  it('makes safe file names', () => {
    expect(reportFileName('Mary Ann O’Neil')).toBe('Personality-Plus-Mary-Ann-O-Neil.pdf');
    expect(reportFileName('')).toBe('Personality-Plus-results.pdf');
    expect(reportFileName('name_unknown')).toBe('Personality-Plus-results.pdf');
  });

  it('cleans placeholder names', () => {
    expect(cleanName('  Alex ')).toBe('Alex');
    expect(cleanName(undefined)).toBe('');
  });

  it('labels percentile levels', () => {
    expect(levelWord(95)).toBe('very high');
    expect(levelWord(50)).toBe('average');
    expect(levelWord(5)).toBe('very low');
  });
});
