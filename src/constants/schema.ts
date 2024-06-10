export enum Aspect {
  Withdrawal = 'Withdrawal',
  Volatility = 'Volatility',
  Politeness = 'Politeness',
  Compassion = 'Compassion',
  Industriousness = 'Industriousness',
  Orderliness = 'Orderliness',
  Enthusiasm = 'Enthusiasm',
  Assertiveness = 'Assertiveness',
  AestheticOpenness = 'Aesthetic Openness',
  Interest = 'Interest in Ideas',
}

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
};
