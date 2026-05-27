import { cumulativeStdNormalProbability, zScore } from 'simple-statistics';
import { maleDataMap, femaleDataMap } from '../constants/escsData';
import { questionData } from '../constants/questionData';

/** Name and Gender are stored in session storage alongside answers. */
const NUM_OF_SESSION_STORAGE_ITEMS = 2;

/**
 * Reads all quiz answers from sessionStorage and returns a percentile map
 * for each of the 15 personality categories (5 OCEAN + 10 Aspects).
 */
export const getPercentiles = (): Record<string, number> => {
  if (sessionStorage.length - NUM_OF_SESSION_STORAGE_ITEMS !== questionData.length) {
    console.error(
      "Answer list isn't correct length. storageLength - 2: " +
        (sessionStorage.length - 2) +
        ', questionDataLength: ' +
        questionData.length,
    );
  }

  const averages: Map<string, [number, number]> = new Map();
  let mapTuple: [number, number] = [0, 0];

  for (const question of questionData) {
    const answerVal = sessionStorage.getItem(JSON.stringify(question));
    if (!answerVal) continue;

    const parsed = parseInt(answerVal);

    for (const key of [question.aspect.toString(), question.ocean.toString()]) {
      const existing = averages.get(key);
      if (existing) {
        const [count, avg] = existing;
        mapTuple = [count + 1, (avg * count + parsed) / (count + 1)];
      } else {
        mapTuple = [1, parsed];
      }
      averages.set(key, mapTuple);
    }
  }

  return getPercentilesFromAverages(averages);
};

/**
 * Converts a map of raw score averages into percentiles using z-score normalization
 * against gender-stratified ESCS normative data.
 */
export const getPercentilesFromAverages = (averages: Map<string, [number, number]>): Record<string, number> => {
  const percentiles: Record<string, number> = {};
  const isMale = sessionStorage.getItem('gender') === 'male';
  const dataMap = isMale ? maleDataMap : femaleDataMap;

  averages.forEach((value, key) => {
    const mean = dataMap.get(key)?.mean;
    const stdDev = dataMap.get(key)?.stdDev;

    if (mean === undefined || stdDev === undefined) {
      throw new Error(`Mean or std dev not found in data map for key: ${key}`);
    }

    let percentile = Math.round(cumulativeStdNormalProbability(zScore(value[1], mean, stdDev)) * 100);
    percentile = Math.max(1, Math.min(99, percentile));
    percentiles[key] = percentile;
  });

  return percentiles;
};

/**
 * Maps a percentile score to a descriptive adjective string.
 * Used to look up the correct interpretation bucket.
 */
export const scoreAdjective = (score: number): string => {
  if (score >= 90) return 'veryHigh';
  if (score >= 75) return 'high';
  if (score >= 60) return 'modHigh';
  if (score >= 40) return 'average';
  if (score >= 25) return 'modLow';
  if (score >= 10) return 'low';
  return 'veryLow';
};
