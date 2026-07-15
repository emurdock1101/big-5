import {shuffle} from './array.utils';

describe('shuffle', () => {
  it('returns the same array reference (in-place)', () => {
    const arr = [1, 2, 3, 4, 5];
    const result = shuffle(arr);
    expect(result).toBe(arr); // same reference, not a copy
  });

  it('preserves the original length', () => {
    const arr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    shuffle(arr);
    expect(arr).toHaveLength(10);
  });

  it('preserves all original elements (no additions or deletions)', () => {
    const original = [1, 2, 3, 4, 5];
    const copy = [...original];
    shuffle(original);
    expect(original.sort((a, b) => a - b)).toEqual(copy.sort((a, b) => a - b));
  });

  it('works correctly on an empty array', () => {
    const arr: number[] = [];
    const result = shuffle(arr);
    expect(result).toEqual([]);
  });

  it('works correctly on a single-element array', () => {
    const arr = [42];
    const result = shuffle(arr);
    expect(result).toEqual([42]);
  });

  it('works correctly on a two-element array', () => {
    const arr = ['a', 'b'];
    shuffle(arr);
    expect(arr).toHaveLength(2);
    expect(arr).toContain('a');
    expect(arr).toContain('b');
  });

  it('works with string arrays', () => {
    const arr = ['Extraversion', 'Neuroticism', 'Agreeableness', 'Conscientiousness', 'Openness'];
    const copy = [...arr];
    shuffle(arr);
    expect(arr.sort()).toEqual(copy.sort());
  });

  it('works with object arrays without corrupting references', () => {
    const obj1 = {id: 1};
    const obj2 = {id: 2};
    const obj3 = {id: 3};
    const arr = [obj1, obj2, obj3];
    shuffle(arr);
    expect(arr).toContain(obj1);
    expect(arr).toContain(obj2);
    expect(arr).toContain(obj3);
  });

  it('does not always return the original order (probabilistic)', () => {
    // With 8 elements, the chance of getting the original order is 1/40320 (<0.003%)
    // Run 10 shuffles; at least one should differ from [1..8]
    const base = [1, 2, 3, 4, 5, 6, 7, 8];
    const original = [...base];
    let everDiffer = false;

    for (let i = 0; i < 10; i++) {
      const candidate = [...original];
      shuffle(candidate);
      if (!candidate.every((v, idx) => v === original[idx])) {
        everDiffer = true;
        break;
      }
    }

    expect(everDiffer).toBe(true);
  });
});
