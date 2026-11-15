import React from 'react';
import GiftFinderSaved from '../design/GiftFinderSaved';
import {tabStore} from '../utils/giftFinderStore';
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

/**
 * Development-only page: a clickable sample of the Gift Finder, no login or payment.
 * Progress is kept in this browser tab only, so a reload picks up where you left off.
 */
const GiftFinderPreview: React.FC = () => (
  <GiftFinderSaved
    store={tabStore}
    percentiles={SAMPLE}
    name='Alex'
    sample
    saveNote='Sample: kept in this browser tab only, so you can reload and pick up where you left off. Closing the tab clears it.'
  />
);

export default GiftFinderPreview;
