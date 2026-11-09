import {Aspect, Ocean} from './schema';
import {alikes, alikeSide} from './alikes';

describe('alike notes', () => {
  it('has both-high and both-low notes for every trait and aspect', () => {
    for (const k of [...Object.values(Ocean), ...Object.values(Aspect)]) {
      for (const side of ['high', 'low'] as const) {
        expect(alikes[k]?.[side]?.share).toBeTruthy();
        expect(alikes[k]?.[side]?.watch).toBeTruthy();
        expect(alikes[k]?.[side]?.together).toBeTruthy();
      }
    }
  });

  it('reads both high, both low, or the middle from the two scores', () => {
    expect(alikeSide(84, 86)).toBe('high');
    expect(alikeSide(20, 28)).toBe('low');
    expect(alikeSide(48, 55)).toBeNull();
  });
});
