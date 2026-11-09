import {createHash} from 'crypto';
import {questionData} from './questionData';
import {Aspect} from './schema';

/**
 * Guard: the 100 test items are chosen carefully and must not change by accident.
 * The fingerprint below was taken from Elliot's original question list (commit da22d79,
 * July 2026), which matches Patrick's aspect key. If a change is ever intended, update the
 * fingerprint on purpose, with Patrick's sign-off.
 */
const ORIGINAL_FINGERPRINT = '7552caf8bdab9132776ea45de5e8c8c4fc5266574fd2cebb2679aad30b8e6b82';

const fingerprint = () =>
  createHash('sha256')
    .update(JSON.stringify(questionData.map((q) => [q.uid, q.text, q.reverse, q.aspect, q.ocean])))
    .digest('hex');

describe('the test questions', () => {
  it('are exactly the original 100 items, wording, scoring direction and aspect', () => {
    expect(fingerprint()).toBe(ORIGINAL_FINGERPRINT);
  });

  it('has 10 items for each of the 10 aspects', () => {
    expect(questionData).toHaveLength(100);
    for (const a of Object.values(Aspect)) {
      expect(questionData.filter((q) => q.aspect === a)).toHaveLength(10);
    }
  });
});

describe('the answer choices', () => {
  it('are the original five labels, in order', () => {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const {LABELS} = require('../components/QuestionComp');
    expect(LABELS).toEqual(['Strongly Disagree', 'Disagree', 'Neutral', 'Agree', 'Strongly Agree']);
  });
});
