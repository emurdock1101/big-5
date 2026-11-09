import {Ocean} from './schema';
import {aspectSplit, aspectSplits, SPLIT_GAP} from './aspectSplits';

describe('aspect splits', () => {
  it('has a complete card for both directions of all five traits', () => {
    for (const o of Object.values(Ocean)) {
      for (const side of [aspectSplits[o].firstHigher, aspectSplits[o].secondHigher]) {
        expect(side.name).toBeTruthy();
        expect(side.note).toBeTruthy();
        expect(side.headline).toBeTruthy();
        expect(side.gift).toBeTruthy();
        expect(side.showsUp).toHaveLength(3);
        expect(side.watchFor).toBeTruthy();
        expect(side.tryThis).toBeTruthy();
      }
    }
  });

  it('only counts a split at the cutoff or wider', () => {
    expect(aspectSplit(Ocean.Extraversion, 60, 60 - SPLIT_GAP + 1).split).toBe(false);
    expect(aspectSplit(Ocean.Extraversion, 60, 60 - SPLIT_GAP).split).toBe(true);
  });

  it('picks the side for whichever aspect is higher', () => {
    // Extraversion aspects: Enthusiasm, Assertiveness
    expect(aspectSplit(Ocean.Extraversion, 20, 80).card).toBe(aspectSplits[Ocean.Extraversion].secondHigher);
    expect(aspectSplit(Ocean.Extraversion, 80, 20).card).toBe(aspectSplits[Ocean.Extraversion].firstHigher);
  });

  it('keeps fun-seeking out of the high-Assertiveness, low-Enthusiasm card', () => {
    const side = aspectSplits[Ocean.Extraversion].secondHigher;
    expect(JSON.stringify(side).toLowerCase()).not.toContain('fun in the moment');
  });
});
