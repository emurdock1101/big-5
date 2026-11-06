import React from 'react';
import ResultsWalk from '../design/ResultsWalk';
import {Aspect, Ocean} from '../constants/schema';

// Sample scores for previewing the results page during development. Not a real person.
const SAMPLE: Record<string, number> = {
  [Ocean.Extraversion]: 72,
  [Aspect.Enthusiasm]: 68,
  [Aspect.Assertiveness]: 74,
  [Ocean.Neuroticism]: 31,
  [Aspect.Withdrawal]: 36,
  [Aspect.Volatility]: 27,
  [Ocean.Agreeableness]: 64,
  [Aspect.Compassion]: 70,
  [Aspect.Politeness]: 57,
  [Ocean.Conscientiousness]: 48,
  [Aspect.Industriousness]: 44,
  [Aspect.Orderliness]: 52,
  [Ocean.Openness]: 85,
  [Aspect.Interest]: 88,
  [Aspect.AestheticOpenness]: 79,
};

/** Development-only page: the results walk with sample scores, no login needed. */
const ResultsPreview: React.FC = () => (
  <ResultsWalk percentiles={SAMPLE} gender='male' sample onDownload={() => window.alert('The PDF download needs a signed-in account.')} />
);

export default ResultsPreview;
