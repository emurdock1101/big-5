import React from 'react';
import GiftFinder from '../design/GiftFinder';
import {Aspect, Ocean} from '../constants/schema';

// Same sample scores as the results preview ("Alex"). Not a real person.
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

/** Development-only page: a clickable sample of the Gift Finder. No login, payment or saving. */
const GiftFinderPreview: React.FC = () => <GiftFinder percentiles={SAMPLE} name='Alex' sample />;

export default GiftFinderPreview;
