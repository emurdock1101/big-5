import {EMPTY_ENTRY, fitsScore, GIFT_ITEMS, motivationFor, partDone} from './giftFinder';
import {predict, reflectionQuestion, SCENARIOS} from './giftFinderPages';
import {Aspect, Ocean} from './schema';

test('every item has a unique id, and each aspect has items on both sides for both kinds', () => {
  expect(new Set(GIFT_ITEMS.map((x) => x.id)).size).toBe(GIFT_ITEMS.length);
  for (const a of Object.values(Aspect)) {
    for (const kind of ['gift', 'blind'] as const) {
      for (const side of ['high', 'low'] as const) {
        expect(GIFT_ITEMS.some((x) => x.aspect === a && x.kind === kind && x.side === side)).toBe(true);
      }
    }
  }
});

test('items from the test are recognized as test items', () => {
  expect(GIFT_ITEMS.find((x) => x.text === 'Feel others’ emotions')?.source).toBe('test');
  expect(GIFT_ITEMS.find((x) => x.text === 'Take precautions')?.source).toBe('public');
  expect(GIFT_ITEMS.filter((x) => x.source === 'test').length).toBeGreaterThan(60);
});

test('items fit high or low scores, and average scores fit neither side', () => {
  const high = GIFT_ITEMS.find((x) => x.side === 'high')!;
  const low = GIFT_ITEMS.find((x) => x.side === 'low')!;
  expect(fitsScore(high, 86)).toBe(true);
  expect(fitsScore(low, 86)).toBe(false);
  expect(fitsScore(low, 27)).toBe(true);
  expect(fitsScore(high, 50)).toBe(false);
  expect(fitsScore(low, 50)).toBe(false);
});

test('only the motivation line that fits the score is shown', () => {
  expect(motivationFor(Aspect.Compassion, 86)).toMatch(/care for others/);
  expect(motivationFor(Aspect.Compassion, 20)).toMatch(/freeloaders/);
  expect(motivationFor(Aspect.Compassion, 50)).toMatch(/middle/);
});

test('reflection questions quote the person’s own percentiles', () => {
  const p = (a: string) => (a === Aspect.Compassion ? 86 : 34);
  expect(reflectionQuestion(Ocean.Agreeableness, p)).toMatch(/86th percentile in Compassion and 34th percentile in Politeness/);
});

test('scenario predictions only use aspects that are clearly high or low', () => {
  const party = SCENARIOS.find((s) => s.id === 'party')!;
  const lines = predict(party, (a) => (a === Aspect.Enthusiasm ? 80 : 50));
  expect(lines.map((l) => l.aspect)).toEqual([Aspect.Enthusiasm]);
});

test('a writing part counts as done once any of its boxes has words', () => {
  expect(partDone(undefined, 'story')).toBe(false);
  expect(partDone({...EMPTY_ENTRY, c: 'thinking'}, 'story')).toBe(true);
  expect(partDone({...EMPTY_ENTRY, serve: ' '}, 'serve')).toBe(false);
});
