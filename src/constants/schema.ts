// These should always be ordered this way
export enum Aspect {
  Enthusiasm = 'Enthusiasm',
  Assertiveness = 'Assertiveness',

  Withdrawal = 'Withdrawal',
  Volatility = 'Volatility',

  Compassion = 'Compassion',
  Politeness = 'Politeness',

  Industriousness = 'Industriousness',
  Orderliness = 'Orderliness',

  AestheticOpenness = 'Aesthetic Openness',
  Interest = 'Interest in Ideas',
}

// These should also always be ordered this way
export enum Ocean {
  Extraversion = 'Extraversion',
  Neuroticism = 'Neuroticism',
  Agreeableness = 'Agreeableness',
  Conscientiousness = 'Conscientiousness',
  Openness = 'Openness',
}

export type Big5Data = {
  category: string;
  categoryAbbr: string;
  isOcean: boolean;
};

export type Question = {
  uid: string;
  text: string;
  reverse: boolean;
  aspect: Aspect;
  ocean: Ocean;
};

export type Answer = {
  percentile: number;
  aspect: Aspect;
  ocean: Ocean;
};

export type EscsData = {
  mean: number;
  stdDev: number;
};

export type User = {
  loggedIn?: boolean;
  completed?: boolean;
  isAdmin?: boolean;
};

export type ScoreLevel = 'veryLow' | 'low' | 'modLow' | 'average' | 'modHigh' | 'high' | 'veryHigh';

export interface Interpretation {
  trait: string; // Ocean or Aspect value
  scoreLevel: ScoreLevel;
  paragraphs: string[]; // replaces part1/part2/etc
}

export interface TraitOverview {
  trait: Ocean;
  label: string;
  paragraphs: string[]; // replaces part1/part2/etc
  color: string;
}
