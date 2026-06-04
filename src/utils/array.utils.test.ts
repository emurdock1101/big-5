import { shuffle } from './array.utils';

describe('shuffle', () => {
  it('returns an array of the same length', () => {
    expect(shuffle([1, 2, 3, 4, 5])).toHaveLength(5);
  });

  it('returns an empty array unchanged', () => {
    expect(shuffle([])).toEqual([]);
  });

  it('returns a single-element array unchanged', () => {
    expect(shuffle([42])).toEqual([42]);
  });

  it('contains exactly the original elements (no additions or removals)', () => {
    const input = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    const result = shuffle([...input]);
    expect(result.sort((a, b) => a - b)).toEqual(input);
  });

  it('works with string arrays', () => {
    const input = ['a', 'b', 'c', 'd'];
    const result = shuffle([...input]);
    expect(result).toHaveLength(4);
    expect([...result].sort()).toEqual([...input].sort());
  });

  it('works with object arrays (preserves references)', () => {
    const obj1 = { id: 1 };
    const obj2 = { id: 2 };
    const obj3 = { id: 3 };
    const result = shuffle([obj1, obj2, obj3]);
    expect(result).toContain(obj1);
    expect(result).toContain(obj2);
    expect(result).toContain(obj3);
  });

  it('mutates the array in place and returns the same reference', () => {
    const input = [1, 2, 3, 4, 5];
    const result = shuffle(input);
    expect(result).toBe(input);
  });

  it('produces varied orderings across multiple runs (statistical check)', () => {
    // With 10 elements, the probability of getting the same permutation twice
    // in a row is 1/10! ≈ 2.76e-7. Ten identical runs is effectively impossible.
    const original = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    const seenOrders = new Set<string>();
    for (let i = 0; i < 10; i++) {
      seenOrders.add(shuffle([...original]).join(','));
    }
    expect(seenOrders.size).toBeGreaterThan(1);
  });

  it('handles arrays with duplicate values (does not deduplicate)', () => {
    const input = [1, 1, 2, 2, 3];
    const result = shuffle([...input]);
    expect(result).toHaveLength(5);
    expect(result.sort((a, b) => a - b)).toEqual([1, 1, 2, 2, 3]);
  });
});
