import {Aspect, Ocean} from './schema';
import {fillRub, rubs} from './rubs';

describe('rub notes', () => {
  it('has a note for every trait and aspect', () => {
    for (const k of [...Object.values(Ocean), ...Object.values(Aspect)]) {
      expect(rubs[k]?.hi).toBeTruthy();
      expect(rubs[k]?.lo).toBeTruthy();
      expect(rubs[k]?.together).toBeTruthy();
    }
  });

  it('fills in names', () => {
    expect(fillRub(rubs[Aspect.Politeness].hi, 'Sam', 'Alex')).toBe('Sam may hear Alex as rude, or as disrespecting the people in charge.');
  });

  it('writes "you" in lowercase mid-sentence and capitalized at the start', () => {
    expect(fillRub(rubs[Aspect.Politeness].hi, 'Sam', 'You')).toBe('Sam may hear you as rude, or as disrespecting the people in charge.');
    expect(fillRub(rubs[Aspect.Politeness].together, 'Sam', 'You')).toBe(
      'You can soften the opening, and Sam can say the real thing plainly.',
    );
    expect(fillRub(rubs[Aspect.Volatility].together, 'Sam', 'You')).toBe(
      'Agree on a pause word. Afterward, you can ask what felt threatening, and Sam can say it calmly.',
    );
  });
});
