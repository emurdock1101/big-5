import React from 'react';
import GiftFinderSaved from '../design/GiftFinderSaved';
import {tabStore} from '../utils/giftFinderStore';
import {SAMPLE_PERCENTILES} from '../constants/giftFinderSample';

/**
 * Development-only page: a clickable sample of the Gift Finder, no login or payment.
 * Progress is kept in this browser tab only, so a reload picks up where you left off.
 */
const GiftFinderPreview: React.FC = () => (
  <GiftFinderSaved
    store={tabStore}
    percentiles={SAMPLE_PERCENTILES}
    name='Alex'
    sample
    saveNote='Sample: kept in this browser tab only, so you can reload and pick up where you left off. Closing the tab clears it.'
  />
);

export default GiftFinderPreview;
