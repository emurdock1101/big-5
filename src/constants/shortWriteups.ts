import {ScoreLevel} from './schema';

/**
 * Short write-ups: the essentials of each trait or aspect at each score level,
 * condensed from Patrick's full write-ups in interpretations.ts (which stay available
 * behind "Read the full write-up").
 *
 * SAMPLE: Agreeableness, Compassion and Politeness only. Drafts for Patrick to edit.
 * Any trait or aspect without a card here falls back to the full write-up.
 */
export interface ShortWriteup {
  /** One sentence: what this score means. */
  headline: string;
  /** The strength at this level. Every level has one. */
  gift: string;
  /** Three short ways it tends to show up. */
  showsUp: [string, string, string];
  /** The risk to keep an eye on. */
  watchFor: string;
  /** One small, concrete thing to try. */
  tryThis: string;
}

type Key = `${string}|${ScoreLevel}`;

export const shortWriteups: Partial<Record<Key, ShortWriteup>> = {
  // ---------- Agreeableness ----------
  'Agreeableness|veryLow': {
    headline: 'You put your own needs and views first, and you are very hard to push around.',
    gift: 'You can negotiate, say no and hold your ground when others would cave.',
    showsUp: [
      'Arguments and hard conversations don’t rattle you; you may even enjoy them',
      'You doubt people’s motives until they prove themselves',
      'Other people’s problems rarely become your problems',
    ],
    watchFor: 'People may experience you as harsh or selfish, and close relationships can wear thin before you notice.',
    tryThis: 'This week, ask one person how they are really doing, and just listen.',
  },
  'Agreeableness|low': {
    headline: 'You lean toward your own interests, and you are not easily taken advantage of.',
    gift: 'You can stand up for yourself at work, at home and at the bargaining table.',
    showsUp: [
      'Conflict and heated discussion don’t scare you off',
      'You weigh your own feelings more than other people’s',
      'Keeping the peace isn’t your first goal',
    ],
    watchFor: 'You can come across as harsh or uncaring, especially when you are stressed.',
    tryThis: 'Before you push back, name what the other person wants. Then make your case.',
  },
  'Agreeableness|modLow': {
    headline: 'You tend to look out for yourself first, while still caring deeply about some people.',
    gift: 'You are not easily taken advantage of, and you can bargain for what you need.',
    showsUp: [
      'You will argue a point rather than smooth it over',
      'Forgiving and going along don’t come easily',
      'You are selective about whose problems you take on',
    ],
    watchFor: 'Others may read you as blunt or tough-minded when you don’t mean to be.',
    tryThis: 'Pick one relationship where a little more patience would pay off, and practice it there.',
  },
  'Agreeableness|average': {
    headline: 'You balance caring for others with caring for yourself.',
    gift: 'You can be kind or firm, cooperative or competitive, depending on what the moment needs.',
    showsUp: [
      'You feel for people without losing sight of your own needs',
      'You will argue when it is worth it, not just for its own sake',
      'You are rarely taken advantage of',
    ],
    watchFor: 'Stress, or your other traits, can tip the balance one way or the other.',
    tryThis: 'Notice which way you lean under pressure: giving in, or pushing back.',
  },
  'Agreeableness|modHigh': {
    headline: 'You see the best in people and work to keep the peace.',
    gift: 'You are generous, patient and quick to forgive, and people feel safe with you.',
    showsUp: [
      'Hurt feelings bother you, yours and other people’s',
      'You would rather cooperate than compete',
      'You feel for people who are left out or defeated',
    ],
    watchFor: 'It is hard to bargain for yourself, and unspoken needs can turn into quiet resentment.',
    tryThis: 'Say one thing you need, plainly, before you agree to the next request.',
  },
  'Agreeableness|high': {
    headline: 'You are generous and nurturing, and deeply motivated to keep the peace.',
    gift: 'You make people feel cared for, and you forgive readily.',
    showsUp: [
      'You feel other people’s emotions strongly',
      'Arguments and competition feel wrong to you',
      'You put other people’s interests ahead of your own',
    ],
    watchFor: 'You can be taken advantage of, and swallowed frustration can come out as resentment or hidden anger.',
    tryThis: 'When you feel the urge to smooth something over, ask yourself: what do I actually want here?',
  },
  'Agreeableness|veryHigh': {
    headline: 'You are extremely generous and nurturing, and peace matters to you more than almost anything.',
    gift: 'Your kindness and empathy run deep; people come to you when they are hurting.',
    showsUp: [
      'You feel other people’s pain almost as your own',
      'Conflict of any kind feels unbearable',
      'You keep giving, even when it costs you',
    ],
    watchFor: 'You may sacrifice yourself too much, and care can turn into managing other people’s lives.',
    tryThis: 'Practice one small, kind “no” this week, and notice that the relationship survives it.',
  },

  // ---------- Compassion ----------
  'Compassion|veryLow': {
    headline: 'Other people’s problems rarely pull at you; your focus stays on your own life.',
    gift: 'You protect your time and energy, and you aren’t drained by everyone else’s needs.',
    showsUp: [
      'Sympathy doesn’t come naturally',
      'You will compete or argue even if feelings get hurt',
      'You may not notice when someone close to you needs you',
    ],
    watchFor: 'Children, family and friends can feel neglected without you realizing it.',
    tryThis: 'Set a reminder to check in on one person who depends on you.',
  },
  'Compassion|low': {
    headline: 'You are more focused on your own life than on other people’s problems.',
    gift: 'You can give time to your own needs without guilt.',
    showsUp: [
      'Sympathizing takes effort',
      'You speak bluntly and compete hard',
      'You don’t get pulled into everyone’s troubles',
    ],
    watchFor: 'The people closest to you may need more attention than you naturally give.',
    tryThis: 'Next time someone shares a problem, ask one follow-up question before you respond.',
  },
  'Compassion|modLow': {
    headline: 'You are less drawn into other people’s problems than most people are.',
    gift: 'You keep a healthy focus on your own goals.',
    showsUp: [
      'You don’t often ask about other people’s struggles',
      'Conflict doesn’t stop you when something matters',
      'Listening patiently takes effort',
    ],
    watchFor: 'Family and friends may feel unheard at times.',
    tryThis: 'In your next hard conversation, let the other person finish before you offer a fix.',
  },
  'Compassion|average': {
    headline: 'You care about others without being consumed by their problems.',
    gift: 'You balance your own needs with other people’s well.',
    showsUp: [
      'You sympathize, but can step back when it costs you too much',
      'You are rarely the first to step in, but you do step in',
      'You neither ignore nor overprotect the people you love',
    ],
    watchFor: 'Your other traits can push you toward too much or too little involvement.',
    tryThis: 'Notice whose needs you tend to put first this week.',
  },
  'Compassion|modHigh': {
    headline: 'You are caring, sympathetic and a good listener.',
    gift: 'People feel heard by you; you notice when someone is struggling.',
    showsUp: [
      'You ask about other people’s problems and mean it',
      'You care about animals and the world, not only people',
      'You will help even when it costs you',
    ],
    watchFor: 'Your own needs can slip behind everyone else’s.',
    tryThis: 'Put one thing for yourself on the calendar, and keep it like a promise to a friend.',
  },
  'Compassion|high': {
    headline: 'You care deeply, and you notice when anyone is hurting.',
    gift: 'You comfort, listen and protect. People feel cared for around you.',
    showsUp: [
      'You feel other people’s pain',
      'You help others avoid hard things, even at your own expense',
      'You are protective of the people you love',
    ],
    watchFor: 'Your own needs get pushed aside, and protectiveness can become overprotectiveness.',
    tryThis: 'Practice asking for what you need as clearly as you would ask on someone else’s behalf.',
  },
  'Compassion|veryHigh': {
    headline: 'Your heart for others is enormous; you feel their pain almost as your own.',
    gift: 'You see and care for people others overlook.',
    showsUp: [
      'You almost always step in to help',
      'You avoid conflict to spare others',
      'You put other people’s needs far above your own',
    ],
    watchFor: 'You may ignore your own needs entirely, and protect people more than they need.',
    tryThis: 'Remember that caring for yourself is what lets you keep caring for others.',
  },

  // ---------- Politeness ----------
  'Politeness|veryLow': {
    headline: 'You challenge authority freely and believe respect has to be earned.',
    gift: 'You will say what others won’t, and you won’t be pushed around.',
    showsUp: [
      'Rules and orders don’t automatically move you',
      'You don’t mind pushing back or confronting people',
      'You put your own interests first',
    ],
    watchFor: 'Constant pushback can make it hard to fit in with teams, bosses and family, especially after a mistake or a loss.',
    tryThis: 'Before you challenge someone, ask whether this is a fight worth having today.',
  },
  'Politeness|low': {
    headline: 'You believe respect is earned, and you push back when challenged.',
    gift: 'You are direct and competitive, and rarely taken advantage of.',
    showsUp: [
      'You question authority instead of simply obeying',
      'You speak your mind even if feelings get hurt',
      'You don’t give what you don’t want to, so you carry little resentment',
    ],
    watchFor: 'Your directness can land as disrespect or arrogance.',
    tryThis: 'Keep your honesty, and add one sentence of respect before your critique.',
  },
  'Politeness|modLow': {
    headline: 'You lean toward questioning authority and speaking your mind.',
    gift: 'You can confront people when it is needed and hold your ground.',
    showsUp: [
      'Respect is something people earn from you',
      'You push back rather than go along',
      'You rarely end up resentful, because you don’t give what you don’t want to',
    ],
    watchFor: 'Others may see you as blunt or competitive.',
    tryThis: 'Notice when people are reacting to your tone rather than to what you said.',
  },
  'Politeness|average': {
    headline: 'You respect authority unless you are given a reason not to.',
    gift: 'You can speak your mind while still caring about other people’s feelings.',
    showsUp: [
      'You avoid conflict unless it is needed',
      'You push back if you are being taken advantage of',
      'You can be competitive when it counts',
    ],
    watchFor: 'Confrontation is a little uncomfortable, so you may wait too long to raise things.',
    tryThis: 'Practice raising a concern early, while it is still small.',
  },
  'Politeness|modHigh': {
    headline: 'You are respectful and courteous, and you follow the rules more than most.',
    gift: 'People trust you; you honor others and keep things orderly.',
    showsUp: [
      'You dislike seeming pushy',
      'Challenging the people in charge feels hard',
      'Competition isn’t your thing',
    ],
    watchFor: 'You may avoid healthy conflict and take on more than your share.',
    tryThis: 'Disagree once this week, respectfully, about something small.',
  },
  'Politeness|high': {
    headline: 'Respect and courtesy matter deeply to you, and you honor authority.',
    gift: 'You are gracious and dependable, and slow to give offense.',
    showsUp: [
      'You hate seeming pushy',
      'You avoid confrontation, even when it is needed',
      'You feel it is your duty to do more',
    ],
    watchFor: 'You can be taken advantage of, and needed conversations may never happen.',
    tryThis: 'Remember that honest disagreement can be a form of respect.',
  },
  'Politeness|veryHigh': {
    headline: 'You are deeply respectful and courteous, and devoted to doing what is expected.',
    gift: 'Your respect for others is rare; people know you will never belittle them.',
    showsUp: [
      'Pushing back on anyone in authority feels almost impossible',
      'Any conflict feels wrong to you',
      'You will spend your own resources to fulfill your duty',
    ],
    watchFor: 'Others may take advantage of your willingness, and you may stay silent when you need to speak.',
    tryThis: 'Write down what you would say if politeness weren’t a factor. Then find a kind way to say part of it.',
  },
};

export function getShortWriteup(trait: string, level: ScoreLevel): ShortWriteup | undefined {
  return shortWriteups[`${trait}|${level}` as Key];
}
