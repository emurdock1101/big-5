import {Aspect, Ocean} from '../constants/schema';
import {factorScores, scoreText, slicesOf, treeLayout} from './tree';

const SCORES: Record<string, number> = {
  [Ocean.Extraversion]: 72,
  [Aspect.Enthusiasm]: 68,
  [Aspect.Assertiveness]: 74,
  [Ocean.Neuroticism]: 20,
  [Aspect.Withdrawal]: 36,
  [Aspect.Volatility]: 3,
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

const node = (id: string) => treeLayout(SCORES, 'Alex').find((n) => n.id === id)!;
const share = (id: string, i: number) => {
  const s = slicesOf(node(id))[i];
  return (s.a1 - s.a0) / (2 * Math.PI);
};

describe('personality tree', () => {
  it('has the name, two factors, five traits and ten aspects', () => {
    const nodes = treeLayout(SCORES, 'Alex');
    expect(nodes).toHaveLength(18);
    expect(node('root').lines).toEqual(['Alex']);
  });

  it('shows "You" when there is no name', () => {
    expect(treeLayout(SCORES, 'name_unknown').find((n) => n.id === 'root')!.lines).toEqual(['You']);
  });

  it('splits the ring around the name by the five trait scores', () => {
    const total = 72 + 20 + 64 + 48 + 85;
    expect(share('root', 0)).toBeCloseTo(72 / total); // Extraversion
    expect(share('root', 4)).toBeCloseTo(85 / total); // Openness
    const slices = slicesOf(node('root'));
    expect(slices[slices.length - 1].a1 - slices[0].a0).toBeCloseTo(2 * Math.PI);
  });

  it('counts low Neuroticism in the Stability ring', () => {
    // Stability slices: Neuroticism (as 100 − N), Agreeableness, Conscientiousness
    const total = 80 + 64 + 48;
    expect(share('stability', 0)).toBeCloseTo(80 / total);
    expect(factorScores((k) => SCORES[k]).stability).toBe(Math.round((64 + 48 + 80) / 3));
  });

  it('writes the percentile inside circles that are big enough', () => {
    const s = scoreText(node(Aspect.Compassion))!;
    expect(s.text).toBe('86th');
    expect(s.y).toBe(node(Aspect.Compassion).y);
  });

  it('writes the percentile just under circles too small to hold it', () => {
    const n = node(Aspect.Volatility);
    const s = scoreText(n)!;
    expect(s.text).toBe('3rd');
    expect(s.y).toBeGreaterThan(n.y + n.r);
  });
});
