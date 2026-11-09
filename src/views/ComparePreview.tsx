import React from 'react';
import {Aspect, Ocean} from '../constants/schema';
import CompareView from '../design/CompareView';

/** Development-only page: the comparison view with two sample people, no login needed. */
const ME: Record<string, number> = {
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

const THEM: Record<string, number> = {
  [Ocean.Extraversion]: 41,
  [Aspect.Enthusiasm]: 55,
  [Aspect.Assertiveness]: 29,
  [Ocean.Neuroticism]: 62,
  [Aspect.Withdrawal]: 70,
  [Aspect.Volatility]: 48,
  [Ocean.Agreeableness]: 81,
  [Aspect.Compassion]: 84,
  [Aspect.Politeness]: 86,
  [Ocean.Conscientiousness]: 77,
  [Aspect.Industriousness]: 64,
  [Aspect.Orderliness]: 88,
  [Ocean.Openness]: 58,
  [Aspect.Interest]: 44,
  [Aspect.AestheticOpenness]: 75,
};

const ComparePreview: React.FC = () => (
  <CompareView me={{name: 'You', percentiles: ME}} them={{name: 'Sam', percentiles: THEM}} relationship='Spouse' />
);

export default ComparePreview;
