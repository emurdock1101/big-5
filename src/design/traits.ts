import {Aspect, Ocean} from '../constants/schema';

export interface TraitInfo {
  ocean: Ocean;
  color: string;
  aspects: [Aspect, Aspect];
  /** Plain-language gloss, non-judgmental. */
  plain: string;
  line: string;
}

/** Always in this order: E, N, A, C, O (outermost square to innermost). */
export const TRAITS: TraitInfo[] = [
  {
    ocean: Ocean.Extraversion,
    color: '#ED5362',
    aspects: [Aspect.Enthusiasm, Aspect.Assertiveness],
    plain: 'positive emotion',
    line: 'How strongly you feel joy and enthusiasm, and how much you seek out people and reward.',
  },
  {
    ocean: Ocean.Neuroticism,
    color: '#9A338E',
    aspects: [Aspect.Withdrawal, Aspect.Volatility],
    plain: 'sensitivity to stress',
    line: 'How strongly you feel worry, frustration and sadness, and how quickly they pass.',
  },
  {
    ocean: Ocean.Agreeableness,
    color: '#3A81CD',
    aspects: [Aspect.Compassion, Aspect.Politeness],
    plain: 'care for others',
    line: 'How much you weigh other people’s needs against your own, and how you handle conflict.',
  },
  {
    ocean: Ocean.Conscientiousness,
    color: '#00C9B7',
    aspects: [Aspect.Industriousness, Aspect.Orderliness],
    plain: 'order and responsibility',
    line: 'How much you plan, persist and keep things in order, and what drives you to work hard.',
  },
  {
    ocean: Ocean.Openness,
    color: '#344B47',
    aspects: [Aspect.Interest, Aspect.AestheticOpenness],
    plain: 'interest in ideas and beauty',
    line: 'How drawn you are to new ideas, art and creativity, and to the unfamiliar.',
  },
];

/** Trait names with soft hyphens, for narrow columns. */
export const SOFT_NAME: Record<string, string> = {
  Extraversion: 'Extra\u00ADversion',
  Neuroticism: 'Neuroti\u00ADcism',
  Agreeableness: 'Agree\u00ADableness',
  Conscientiousness: 'Conscien\u00ADtiousness',
  Openness: 'Open\u00ADness',
};

export const PRICE = '$9.99';
// Replace with the own-domain address once it is set up.
export const CONTACT_EMAIL = 'discoverpersonalityplus@gmail.com';
export const BOOKING_URL = 'https://calendly.com/discoverpersonalityplus';
export const SOCIAL = {
  facebook: 'https://www.facebook.com/DiscoverPersonalityPlus/',
  instagram: 'https://instagram.com/discover_personalityplus',
  x: 'https://x.com/PersonalityB5',
};
