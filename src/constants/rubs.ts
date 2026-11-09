import {Aspect, Ocean} from './schema';

/**
 * Where two people tend to rub when they sit far apart on a trait or aspect.
 * DRAFTS for Patrick to edit.
 *
 * {hi} is the person higher on it, {lo} the person lower. Either may be "you" (the reader),
 * so write sentences that work with a name or with "you": use "may" or "can" after {hi} and
 * {lo}, and avoid "is/are", possessives and pronouns that point back to them.
 */
export interface RubNote {
  hi: string;
  lo: string;
  together: string;
}

export const rubs: Record<string, RubNote> = {
  [Ocean.Extraversion]: {
    hi: '{hi} may want more people, plans and noise than {lo} has energy for.',
    lo: '{lo} may need quiet to recharge, and that can look like pulling away.',
    together: 'Plan social time and recovery time on purpose, and agree ahead of time when to leave.',
  },
  [Ocean.Neuroticism]: {
    hi: '{hi} may feel worry and stress that {lo} doesn’t notice or understand.',
    lo: '{lo} may seem unbothered, and can wave off fears that feel very real.',
    together: 'When one of you is anxious, the steadier one can listen first and reassure second.',
  },
  [Ocean.Agreeableness]: {
    hi: '{hi} may give in to keep the peace, then quietly resent it.',
    lo: '{lo} may say the hard thing bluntly and move on, while the other is still hurting.',
    together: 'Make it safe to disagree: {lo} can soften the start, and {hi} can say plainly what is needed.',
  },
  [Ocean.Conscientiousness]: {
    hi: '{hi} may feel like the only one who plans, tidies and follows through.',
    lo: '{lo} may feel nagged, judged or boxed in by schedules.',
    together: 'Agree on the few things that must be done on time, and let the rest stay flexible.',
  },
  [Ocean.Openness]: {
    hi: '{hi} may crave new ideas, places and change.',
    lo: '{lo} may prefer what is proven and familiar, and feel pushed.',
    together: 'Take turns: one new thing, then one familiar thing you both enjoy.',
  },
  [Aspect.Enthusiasm]: {
    hi: '{hi} may want celebration and fun that feels like a lot to {lo}.',
    lo: '{lo} may show joy quietly, and that can be mistaken for not caring.',
    together: 'Say out loud what you enjoy about each other, so neither has to guess.',
  },
  [Aspect.Assertiveness]: {
    hi: '{hi} may take charge and decide quickly.',
    lo: '{lo} may go along, then feel unheard.',
    together: 'Before a decision, {hi} can ask and wait, and {lo} can name a preference first.',
  },
  [Aspect.Withdrawal]: {
    hi: '{hi} may worry ahead and want to plan for what could go wrong.',
    lo: '{lo} may see that worry as needless and want to push ahead.',
    together: 'Name the worry, then decide together which risks are worth planning for.',
  },
  [Aspect.Volatility]: {
    hi: '{hi} may get frustrated fast and say it sharply.',
    lo: '{lo} may stay calm on the outside, then feel attacked or shut down.',
    together: 'Agree on a pause word, and come back to it once you are both calm.',
  },
  [Aspect.Compassion]: {
    hi: '{hi} may feel other people’s pain deeply and want to help right away.',
    lo: '{lo} may go straight to solutions or boundaries, and can seem cold.',
    together: 'Lead with care, then plan: {lo} can listen first, and {hi} can let the plan follow.',
  },
  [Aspect.Politeness]: {
    hi: '{hi} may hear {lo} as rude or disrespectful.',
    lo: '{lo} may hear {hi} as stiff, or as avoiding what is real.',
    together: '{lo} can soften the opening, and {hi} can say the real thing plainly.',
  },
  [Aspect.Industriousness]: {
    hi: '{hi} may push to keep working when {lo} wants to rest.',
    lo: '{lo} may feel judged as lazy.',
    together: 'Agree when work stops for the day, and protect rest together.',
  },
  [Aspect.Orderliness]: {
    hi: '{hi} may be bothered by mess and changes in routine.',
    lo: '{lo} may not notice the mess, and can feel controlled by rules.',
    together: 'Pick a few shared spaces to keep tidy, and let the rest be.',
  },
  [Aspect.Interest]: {
    hi: '{hi} may want to debate, analyze and dig into ideas.',
    lo: '{lo} may find long debates draining or beside the point.',
    together: 'Put a time limit on debates, and ask what the other actually needs from the conversation.',
  },
  [Aspect.AestheticOpenness]: {
    hi: '{hi} may be deeply moved by beauty and want to share it.',
    lo: '{lo} may not feel it the same way, which can leave the other feeling unseen.',
    together: 'Take turns choosing: one beautiful thing, one practical thing.',
  },
};

/**
 * Fill {hi} and {lo} with names. "You" is written as "you" mid-sentence and "You" at the
 * start of a sentence.
 */
export function fillRub(template: string, hi: string, lo: string): string {
  return template.replace(/\{(hi|lo)\}/g, (_m, which: string, offset: number) => {
    const name = which === 'hi' ? hi : lo;
    if (name.toLowerCase() !== 'you') return name;
    const before = template.slice(0, offset).trimEnd();
    const startsSentence = before === '' || /[.!?]$/.test(before);
    return startsSentence ? 'You' : 'you';
  });
}
