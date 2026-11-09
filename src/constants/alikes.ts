import {Aspect, Ocean} from './schema';

/**
 * Where two people are alike: what they share, the blind spot they share, and something to
 * try together. Being alike in a high score is a different story from being alike in a low one,
 * so each trait and aspect has a "both high" and a "both low" note.
 *
 * DRAFTS for Patrick to edit, drawn from his trait notes. Written to "you both", so no names.
 */
export interface AlikeSide {
  share: string;
  watch: string;
  together: string;
}

export interface AlikeNote {
  high: AlikeSide;
  low: AlikeSide;
}

export const alikes: Record<string, AlikeNote> = {
  [Ocean.Extraversion]: {
    high: {
      share: 'You both draw energy from people and good times, so life together can be full and lively.',
      watch: 'Together you may overbook, overspend, or say yes to the fun thing before the wise thing.',
      together: 'Before you say yes as a pair, check the calendar and the budget together.',
    },
    low: {
      share: 'You both value quiet, home and a few deep friendships, and you give each other room to recharge.',
      watch: 'You may both drift into isolation and let friendships and opportunities slip.',
      together: 'Plan one social outing a month on purpose, and keep it.',
    },
  },
  [Aspect.Enthusiasm]: {
    high: {
      share: 'You both feel joy easily and show it, so celebrating comes naturally.',
      watch: 'You may chase the next exciting thing together and skip the slow, steady work.',
      together: 'Celebrate small wins, and protect one ordinary habit together.',
    },
    low: {
      share: 'You both keep your joy quiet and steady, and neither of you needs constant excitement.',
      watch: 'Home can start to feel flat, and affection may go unspoken.',
      together: 'Say one thing you appreciate about each other out loud each day.',
    },
  },
  [Aspect.Assertiveness]: {
    high: {
      share: 'You both take initiative and say what you think, so things get decided.',
      watch: 'Two drivers can mean a struggle over who leads.',
      together: 'Divide the leadership: agree who makes which decisions.',
    },
    low: {
      share: 'You both make room for each other and rarely push.',
      watch: 'Decisions can stall while each of you waits for the other to lead.',
      together: 'Take turns being the one who decides, and set a deadline for it.',
    },
  },
  [Ocean.Neuroticism]: {
    high: {
      share: 'You both feel stress deeply, so you understand each other’s worries without long explanations.',
      watch: 'Worry can feed worry; you may both expect the worst and pass up good risks.',
      together: 'Build islands of stability together, like regular meals, bedtimes and a weekly check-in.',
    },
    low: {
      share: 'You are both steady under pressure, a calm home in a storm.',
      watch: 'You may both downplay real risks, and miss each other’s quieter pain.',
      together: 'Once a week, ask each other: what is weighing on you that I might not see?',
    },
  },
  [Aspect.Withdrawal]: {
    high: {
      share: 'You both sense danger early and value safety and the familiar.',
      watch: 'Together you may avoid new things, and your world can quietly shrink.',
      together: 'Pick one small new step to take side by side; facing it together makes the fear smaller.',
    },
    low: {
      share: 'You both face the unknown with confidence and rarely freeze.',
      watch: 'You may both rush into risks neither of you saw coming.',
      together: 'Before a big leap, list together what could go wrong and how you would handle it.',
    },
  },
  [Aspect.Volatility]: {
    high: {
      share: 'You both feel things strongly and say what matters; nothing stays hidden for long.',
      watch: 'Two quick tempers can escalate fast, especially when either feels criticized.',
      together: 'Agree on a pause word, and use it before the second sharp sentence.',
    },
    low: {
      share: 'You are both slow to anger, so conflict stays calm.',
      watch: 'Real frustrations can go unsaid until they pile up.',
      together: 'Set a regular time to name small irritations while they are still small.',
    },
  },
  [Ocean.Agreeableness]: {
    high: {
      share: 'You both care deeply and want peace, so your relationship can feel gentle and safe.',
      watch: 'You may both avoid hard conversations, and let others take advantage of you.',
      together: 'Practice disagreeing kindly on small things, so the big things can be said.',
    },
    low: {
      share: 'You both speak plainly and can handle honest disagreement; neither of you is easily used.',
      watch: 'Arguments can turn into contests, and tenderness may be rare.',
      together: 'After a hard conversation, each say one thing you value about the other.',
    },
  },
  [Aspect.Compassion]: {
    high: {
      share: 'You both feel other people’s pain and love to help, so you serve well together.',
      watch: 'You may both pour out until you are empty, and forget to care for each other.',
      together: 'Guard rest together, and check that you are giving to each other as much as to others.',
    },
    low: {
      share: 'You both keep clear boundaries and go straight to solutions.',
      watch: 'You may miss when each other, or your children, need comfort more than answers.',
      together: 'When one of you shares a problem, ask: “Do you want help, or do you want me to listen?”',
    },
  },
  [Aspect.Politeness]: {
    high: {
      share: 'You both value respect, courtesy and doing things the right way.',
      watch: 'You may both stay too polite to say what is real.',
      together: 'Give each other permission to be honest, kindly, about one hard thing each week.',
    },
    low: {
      share: 'You both question rules and say the hard thing, so there is little pretense between you.',
      watch: 'Respect, for each other and for others, can wear thin in a heated moment.',
      together: 'Agree on a few lines you will not cross when you argue.',
    },
  },
  [Ocean.Conscientiousness]: {
    high: {
      share: 'You both plan, follow through and keep your word, so life runs smoothly.',
      watch: 'You may both struggle to rest, and judge each other’s mistakes harshly.',
      together: 'Set “no work” hours together, and forgive small misses quickly.',
    },
    low: {
      share: 'You are both relaxed and flexible, and neither of you nags the other.',
      watch: 'Bills, chores and goals can slip for both of you.',
      together: 'Set a short weekly planning time, and choose the few things that must get done.',
    },
  },
  [Aspect.Industriousness]: {
    high: {
      share: 'You both love getting things done, and you push each other forward.',
      watch: 'Home can become all work and no rest, and guilt can creep in when you stop.',
      together: 'Pick one evening a week when neither of you works.',
    },
    low: {
      share: 'You both know how to enjoy downtime without guilt.',
      watch: 'Big goals may never get started.',
      together: 'Choose one shared goal, and give it one small step each week.',
    },
  },
  [Aspect.Orderliness]: {
    high: {
      share: 'You both like a tidy home and a steady routine, so you rarely clash over mess.',
      watch: 'You may both become rigid, or harsh, when plans change or things fall out of place.',
      together: 'Build one unplanned afternoon into each month, and let it be messy.',
    },
    low: {
      share: 'Neither of you minds a little chaos, so you are easy on each other.',
      watch: 'Clutter and missed details can pile up for both of you.',
      together: 'Pick one space to keep in order, and one simple routine to share.',
    },
  },
  [Ocean.Openness]: {
    high: {
      share: 'You both love new ideas, places and experiences, so life together rarely gets dull.',
      watch: 'You may both chase the next new thing and struggle to settle and finish.',
      together: 'Finish one shared project before you start the next.',
    },
    low: {
      share: 'You both value tradition, stability and what has been proven; you are guardians of what works.',
      watch: 'You may both resist change, even when it is needed.',
      together: 'Try one new thing together each season, however small.',
    },
  },
  [Aspect.Interest]: {
    high: {
      share: 'You both love to think, read and talk ideas through.',
      watch: 'You may live in your heads, and debate instead of doing.',
      together: 'End each big conversation with one thing you will actually do.',
    },
    low: {
      share: 'You both prefer the practical and concrete to the abstract.',
      watch: 'You may both avoid hard questions that need thinking through.',
      together: 'Read or listen to one thing together this month, and talk about it.',
    },
  },
  [Aspect.AestheticOpenness]: {
    high: {
      share: 'You are both moved by beauty, music and story, and you can share it deeply.',
      watch: 'Practical matters may slip while you both chase beauty.',
      together: 'Pair each creative plan with one practical step.',
    },
    low: {
      share: 'You are both practical and steady, and you keep life simple.',
      watch: 'Your life together may have little room for beauty and rest.',
      together: 'Make room for one beautiful thing each week: a walk, a song, a meal.',
    },
  },
};

/** "high" when both lean high, "low" when both lean low, null when they sit in the middle. */
export function alikeSide(a: number, b: number): 'high' | 'low' | null {
  const avg = (a + b) / 2;
  if (avg >= 60) return 'high';
  if (avg < 40) return 'low';
  return null;
}
