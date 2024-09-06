import {cumulativeStdNormalProbability, zScore} from 'simple-statistics';
import {maleDataMap, femaleDataMap} from './constants/escsData';
import {questionData} from './constants/questionData';
import jsPDF from 'jspdf';
import {Aspect, Ocean} from './constants/schema';

/**
 * Name and Gender are stored in session storage.
 **/
const NUM_OF_SESSION_STORAGE_ITEMS = 2;

/**
 * Returns a map of percentiles for each category key string.
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

  let answerVal;
  let aspectCount: number | undefined;
  let aspectVal: number | undefined;
  let oceanVal: number | undefined;
  let oceanCount: number | undefined;
  let mapTuple: [number, number] = [0, 0];

  for (const question of questionData) {
    answerVal = sessionStorage.getItem(JSON.stringify(question));

    aspectCount = averages.get(question.aspect.toString())?.[0];
    oceanCount = averages.get(question.ocean.toString())?.[0];
    aspectVal = averages.get(question.aspect.toString())?.[1];
    oceanVal = averages.get(question.ocean.toString())?.[1];

    if (answerVal) {
      // Add to aspect total
      if (aspectVal && aspectCount) {
        // calculate new average aspect val
        aspectVal = (aspectVal * aspectCount + parseInt(answerVal)) / (aspectCount + 1);
        mapTuple = [aspectCount + 1, aspectVal];
        averages.set(question.aspect.toString(), mapTuple);
      } else {
        // set average for new aspect element
        mapTuple = [1, parseInt(answerVal)];
        averages.set(question.aspect.toString(), mapTuple);
      }

      if (oceanVal && oceanCount) {
        // calculate new average ocean val
        oceanVal = (oceanVal * oceanCount + parseInt(answerVal)) / (oceanCount + 1);
        mapTuple = [oceanCount + 1, oceanVal];
        averages.set(question.ocean.toString(), mapTuple);
      } else {
        // set average for new ocean element
        mapTuple = [1, parseInt(answerVal)];
        averages.set(question.ocean.toString(), mapTuple);
      }
    }
  }

  return getPercentilesFromAverages(averages);
};

/**
 * Calculates percentiles from averages using z score logic. Returns string->number map of each categories' percentile.
 *
 * @param averages the map of averages for all 15 categories
 */
export const getPercentilesFromAverages = (averages: Map<string, [number, number]>): Record<string, number> => {
  const percentiles: Record<string, number> = {};
  let currMean: number | undefined;
  let currStdDev: number | undefined;
  let currFormattedPerc: number;

  const isMale: boolean = sessionStorage.getItem('gender') === 'male';
  const dataMap = isMale ? maleDataMap : femaleDataMap;

  averages.forEach((value: [number, number], key: string) => {
    currMean = dataMap.get(key)?.mean;
    currStdDev = dataMap.get(key)?.stdDev;

    if (currMean && currStdDev) {
      currFormattedPerc = Math.round(cumulativeStdNormalProbability(zScore(value[1], currMean, currStdDev)) * 100);

      if (currFormattedPerc <= 0) currFormattedPerc = 1;
      else if (currFormattedPerc >= 100) currFormattedPerc = 99;
      percentiles[`${key}`] = currFormattedPerc;
    } else {
      throw new Error('Mean or std dev from data map not defined. value: ' + value + ', key: ' + key);
    }
  });

  return percentiles;
};

/**
 * Returns the right adjective to describe how high/low a score is.
 *
 * @param score a percentile
 */
export const scoreAdjective = (score: number): string => {
  if (score >= 90) {
    return 'veryHigh';
  } else if (score >= 75 && score < 90) {
    return 'high';
  } else if (score >= 60 && score < 75) {
    return 'modHigh';
  } else if (score >= 40 && score < 60) {
    return 'average';
  } else if (score >= 25 && score < 40) {
    return 'modLow';
  } else if (score >= 10 && score < 25) {
    return 'low';
  } else if (score < 10) {
    return 'veryLow';
  }

  return 'error';
};

/**
 * Shuffles an array of any type
 */
export const shuffle = <T>(array: T[]): T[] => {
  let m = array.length,
    t,
    i;

  // While there remain elements to shuffle…
  while (m) {
    // Pick a remaining element…
    i = Math.floor(Math.random() * m--);

    // And swap it with the current element.
    t = array[m];
    array[m] = array[i];
    array[i] = t;
  }

  return array;
};

export const generatePdfDoc = (email: string, percentiles: Record<string, number> | null): void => {
  const doc = new jsPDF();
  doc.setFont('Monaco', undefined, 700);
  let xPosition: number;
  let yPosition: number = 15;

  // title
  const title = 'Personality Plus Results';
  doc.setFontSize(24);
  xPosition = getCenteredTextPosition(doc, title);
  doc.text(title, xPosition, yPosition);

  doc.setFontSize(16);

  // email
  xPosition = getCenteredTextPosition(doc, email);
  doc.text(email, xPosition, (yPosition += 10));

  // separator
  doc.setDrawColor(240, 109, 121);
  doc.line(20, yPosition + 5, 190, yPosition + 5);

  // Extraversion
  const extraversionText: string = Ocean.Extraversion.toString();
  const extraversionScore: number = percentiles?.[`${extraversionText}`] ?? 99;
  doc.setFontSize(20);
  doc.text(extraversionText + ': ' + extraversionScore, 20, (yPosition += 15));
  // Enthusiasm
  const enthusiasmText: string = Aspect.Enthusiasm.toString();
  const enthusiasmScore: number = percentiles?.[`${enthusiasmText}`] ?? 99;
  doc.setFontSize(18);
  doc.text(enthusiasmText + ': ' + enthusiasmScore, 100, yPosition);
  // Assertiveness
  const assertivenessText: string = Aspect.Assertiveness.toString();
  const assertivenessScore: number = percentiles?.[`${assertivenessText}`] ?? 99;
  doc.text(assertivenessText + ': ' + assertivenessScore, 100, (yPosition += 10));

  // separator
  doc.setDrawColor(169, 81, 159);
  doc.line(20, yPosition + 5, 190, yPosition + 5);

  // Neuroticism
  const neurotocismText: string = Ocean.Neuroticism.toString();
  const neurotocismScore: number = percentiles?.[`${neurotocismText}`] ?? 99;
  doc.setFontSize(20);
  doc.text(neurotocismText + ': ' + neurotocismScore, 20, (yPosition += 15));
  // Withdrawal
  const withdrawalText: string = Aspect.Withdrawal.toString();
  const withdrawalScore: number = percentiles?.[`${withdrawalText}`] ?? 99;
  doc.setFontSize(18);
  doc.text(withdrawalText + ': ' + withdrawalScore, 100, yPosition);
  // Volatility
  const volatilityText: string = Aspect.Volatility.toString();
  const volatilityScore: number = percentiles?.[`${volatilityText}`] ?? 99;
  doc.text(volatilityText + ': ' + volatilityScore, 100, (yPosition += 10));

  // separator
  doc.setDrawColor(87, 148, 212);
  doc.line(20, yPosition + 5, 190, yPosition + 5);

  // Agreeableness
  const agreeablenessText: string = Ocean.Agreeableness.toString();
  const agreeablenessScore: number = percentiles?.[`${agreeablenessText}`] ?? 99;
  doc.setFontSize(20);
  doc.text(agreeablenessText + ': ' + agreeablenessScore, 20, (yPosition += 15));
  // Compassion
  const compassionText: string = Aspect.Compassion.toString();
  const compassionScore: number = percentiles?.[`${compassionText}`] ?? 99;
  doc.setFontSize(18);
  doc.text(compassionText + ': ' + compassionScore, 100, yPosition);
  // Politeness
  const politenessText: string = Aspect.Politeness.toString();
  const politenessScore: number = percentiles?.[`${politenessText}`] ?? 99;
  doc.text(politenessText + ': ' + politenessScore, 100, (yPosition += 10));

  // separator
  doc.setDrawColor(38, 209, 194);
  doc.line(20, yPosition + 5, 190, yPosition + 5);

  // Conscientiousness
  const conscientiousnessText: string = Ocean.Conscientiousness.toString();
  const conscientiousnessScore: number = percentiles?.[`${conscientiousnessText}`] ?? 99;
  doc.setFontSize(20);
  doc.text(conscientiousnessText + ': ' + conscientiousnessScore, 20, (yPosition += 15));
  // Industriousness
  const industriousnessText: string = Aspect.Industriousness.toString();
  const industriousnessScore: number = percentiles?.[`${industriousnessText}`] ?? 99;
  doc.setFontSize(18);
  doc.text(industriousnessText + ': ' + industriousnessScore, 100, yPosition);
  // Orderliness
  const orderlinessText: string = Aspect.Orderliness.toString();
  const orderlinessScore: number = percentiles?.[`${orderlinessText}`] ?? 99;
  doc.text(orderlinessText + ': ' + orderlinessScore, 100, (yPosition += 10));

  // separator
  doc.setDrawColor(52, 75, 71);
  doc.line(20, yPosition + 5, 190, yPosition + 5);

  // Openness
  const opennessText: string = Ocean.Openness.toString();
  const opennessScore: number = percentiles?.[`${opennessText}`] ?? 99;
  doc.setFontSize(20);
  doc.text(opennessText + ': ' + opennessScore, 20, (yPosition += 15));
  // Aesthetic Openness
  const aestheticOpennessText: string = Aspect.AestheticOpenness.toString();
  const aestheticOpennessScore: number = percentiles?.[`${aestheticOpennessText}`] ?? 99;
  doc.setFontSize(18);
  doc.text(aestheticOpennessText + ': ' + aestheticOpennessScore, 100, yPosition);
  // Interest
  const interestText: string = Aspect.Interest.toString();
  const interestScore: number = percentiles?.[`${interestText}`] ?? 99;
  doc.text(interestText + ': ' + interestScore, 100, (yPosition += 10));

  doc.save(`${email}_personality_plus_results.pdf`);
};

const getCenteredTextPosition = (doc: jsPDF, text: string): number => {
  const textWidth = doc.getTextDimensions(text).w; // Calculate text width
  const pageWidth = doc.internal.pageSize.width; // Get page width
  return (pageWidth - textWidth) / 2;
};
