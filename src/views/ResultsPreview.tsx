import React from 'react';
import ResultsWalk from '../design/ResultsWalk';
import {treePng} from '../design/tree';
import {generateReport} from '../utils/report.pdf';
import ShareManager from '../design/ShareManager';
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
  [Aspect.Compassion]: 86,
  [Aspect.Politeness]: 34,
  [Ocean.Conscientiousness]: 48,
  [Aspect.Industriousness]: 66,
  [Aspect.Orderliness]: 30,
  [Ocean.Openness]: 85,
  [Aspect.Interest]: 88,
  [Aspect.AestheticOpenness]: 79,
};

/** Development-only page: the results walk with sample scores, no login needed. */
const ResultsPreview: React.FC = () => (
  <ResultsWalk
    look='cinematic'
    percentiles={SAMPLE}
    gender='male'
    name='Alex'
    sample
    share={<ShareManager name='Alex' gender='male' percentiles={SAMPLE} demo />}
    onDownload={async () => {
      const treeImage = await treePng(SAMPLE, 'Alex');
      generateReport({name: 'Alex', email: 'sample@example.com', gender: 'male', percentiles: SAMPLE, treeImage, mode: 'open'});
    }}
  />
);

export default ResultsPreview;
