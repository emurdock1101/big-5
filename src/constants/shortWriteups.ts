import {ScoreLevel} from './schema';

/**
 * Short write-ups: the essentials of each trait or aspect at each score level,
 * condensed from Patrick's full write-ups in interpretations.ts (which stay available
 * behind "Read the full write-up").
 *
 * All 5 traits and 10 aspects, at all 7 levels. Drafts for Patrick to edit.
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
  // ---------- Extraversion ----------
  'Extraversion|veryLow': {
    headline: 'You are very quiet and private, and you are most at home on your own.',
    gift: 'You can focus deeply, work alone for long stretches and think before you act.',
    showsUp: [
      'You watch and listen long before you speak',
      'Parties and group events wear you out quickly',
      'You open up only about things you really care about',
    ],
    watchFor: 'People may read your quiet as coldness or lack of interest, and opportunities can pass you by.',
    tryThis: 'Choose one person this week and share one thing you are excited about.',
  },
  'Extraversion|low': {
    headline: 'You are quiet and reserved, and you recharge best by yourself.',
    gift: 'You are steady and thoughtful, and you rarely act on impulse.',
    showsUp: [
      'You hold back in new or unclear situations',
      'Chatter and interruptions annoy you when you are working',
      'Social events feel more tiring than fun',
    ],
    watchFor: 'Friends, a spouse or coworkers may wish you showed more warmth and enthusiasm.',
    tryThis: 'Say yes to one small social plan, and give yourself permission to leave early.',
  },
  'Extraversion|modLow': {
    headline: 'You lean quiet and reserved, and you need time alone to recharge.',
    gift: 'You do well with independent work, and you think before you speak.',
    showsUp: [
      'You would rather listen first than speak first',
      'Long social events drain you',
      'You engage most when the topic is one you love',
    ],
    watchFor: 'Your reserve can come across as being unimpressed or uninterested.',
    tryThis: 'In your next meeting or gathering, share one opinion early instead of waiting.',
  },
  'Extraversion|average': {
    headline: 'You are balanced between social and solitary, and you can do both well.',
    gift: 'You can adapt: you can lead a room or work happily on your own.',
    showsUp: [
      'You don’t always speak first, but you do speak up',
      'You can be convincing when the subject matters to you',
      'Too much time with people, or too much alone, tires you',
    ],
    watchFor: 'Your other traits can tip how social you are, especially under stress.',
    tryThis: 'Notice which recharges you more this week, people or quiet, and plan for it.',
  },
  'Extraversion|modHigh': {
    headline: 'You are talkative and social, and people energize you.',
    gift: 'You bring energy and warmth to friendships, family and work.',
    showsUp: [
      'You tend to speak first when a group meets',
      'You can be captivating and convincing',
      'Long stretches alone feel hard',
    ],
    watchFor: 'Fun in the moment can win out over what is wise for later.',
    tryThis: 'Before saying yes to the next fun plan, take one minute to check your calendar.',
  },
  'Extraversion|high': {
    headline: 'You are outgoing and expressive, and you come alive around people.',
    gift: 'You draw people in and get things moving; you shine in persuasion, teamwork and speaking.',
    showsUp: [
      'You act first in new situations',
      'You are easily pulled toward chatting and joking',
      'Studying or working alone is hard',
    ],
    watchFor: 'Impulsive choices, and taking over a conversation without meaning to.',
    tryThis: 'In your next conversation, ask two questions before you share your own story.',
  },
  'Extraversion|veryHigh': {
    headline: 'You are highly outgoing and expressive, and people are your fuel.',
    gift: 'Your energy is contagious; you can rally a room and make people feel welcome.',
    showsUp: [
      'You are almost always the first to speak',
      'You seek out fun, people and excitement',
      'Being alone for long can feel nearly impossible',
    ],
    watchFor: 'Acting now and thinking later, and leaving little room for quieter people.',
    tryThis: 'Build in a short daily pause, alone, to think before the day’s big decisions.',
  },

  // ---------- Enthusiasm ----------
  'Enthusiasm|veryLow': {
    headline: 'Your joy runs quiet; you rarely seek excitement or crowds.',
    gift: 'You are calm and private, and you don’t need constant stimulation to be content.',
    showsUp: [
      'You speak less, and with less animation',
      'Crowds drain you, and solitude restores you',
      'You keep most things private',
    ],
    watchFor: 'People may think you are uninterested in them. Low enthusiasm isn’t sadness, but it can look like it.',
    tryThis: 'Tell someone, out loud, one thing you appreciate about them.',
  },
  'Enthusiasm|low': {
    headline: 'You express happiness quietly, and you prefer small, calm settings.',
    gift: 'You are steady and unflappable, and content without a lot of excitement.',
    showsUp: [
      'You laugh and talk less than most',
      'You need time alone after being around people',
      'It takes a while for people to get to know you',
    ],
    watchFor: 'Your muted reactions can be read as disinterest.',
    tryThis: 'When something good happens to someone close to you, let them see your joy.',
  },
  'Enthusiasm|modLow': {
    headline: 'You are more reserved than most, and your happiness shows quietly.',
    gift: 'You are calm, private and comfortable with quiet.',
    showsUp: [
      'You avoid big crowds and loud events',
      'You keep a small circle and share carefully',
      'You recover from people with time alone',
    ],
    watchFor: 'You may come across as having no opinion, even when you do.',
    tryThis: 'Share one opinion this week that you would normally keep to yourself.',
  },
  'Enthusiasm|average': {
    headline: 'You enjoy people and fun, and you also enjoy your own company.',
    gift: 'You balance warmth with calm; you take life as it comes.',
    showsUp: [
      'You like social events in moderation',
      'You keep a real friend group, not just acquaintances',
      'You know when to share and when to keep things private',
    ],
    watchFor: 'You may not always show how much you are enjoying something.',
    tryThis: 'Plan one thing this month purely because it would be fun.',
  },
  'Enthusiasm|modHigh': {
    headline: 'You are warm, cheerful and easy to get to know.',
    gift: 'You encourage people, and you see life with optimism.',
    showsUp: [
      'You talk quickly and laugh easily',
      'You are drawn to where the people are',
      'Long stretches alone get irritating',
    ],
    watchFor: 'You can come across as dramatic, and stress can bring higher highs and lower lows.',
    tryThis: 'Spend twenty minutes alone this week and notice what you think about.',
  },
  'Enthusiasm|high': {
    headline: 'You are joyful and expressive, and you light up around people.',
    gift: 'You are encouraging and optimistic, and people feel welcome around you.',
    showsUp: [
      'You are animated, quick to laugh and quick to share',
      'Being around people restores you',
      'You keep few things private',
    ],
    watchFor: 'Time alone can drain you, and you may share more than others are comfortable with.',
    tryThis: 'Before sharing something personal, ask whether it is yours to share.',
  },
  'Enthusiasm|veryHigh': {
    headline: 'Your joy is big and visible, and you are drawn to people and excitement.',
    gift: 'Your warmth and optimism lift everyone around you.',
    showsUp: [
      'You are very animated, and you laugh a lot',
      'You keep people very close and very little private',
      'Time alone can feel exhausting',
    ],
    watchFor: 'Constant excitement-seeking, and big swings in mood when life gets stressful.',
    tryThis: 'Practice one quiet habit, like a walk or prayer alone, that steadies you.',
  },

  // ---------- Assertiveness ----------
  'Assertiveness|veryLow': {
    headline: 'You almost always let others lead and speak first.',
    gift: 'You listen well and support others without needing control.',
    showsUp: [
      'You rarely offer your own opinions',
      'You let others steer conversations and plans',
      'You are seldom impulsive',
    ],
    watchFor: 'Your ideas may go unheard, and people may mistake quiet for lack of interest or skill.',
    tryThis: 'Write down one idea before your next meeting, and say it out loud.',
  },
  'Assertiveness|low': {
    headline: 'You prefer to let others take the lead.',
    gift: 'You are a great support to people who lead, and you don’t dominate.',
    showsUp: [
      'You hold back your opinions',
      'You wait for others to start things',
      'You think before you act',
    ],
    watchFor: 'Group work can be hard when no one hears what you think.',
    tryThis: 'Volunteer for one small task you would usually leave to someone else.',
  },
  'Assertiveness|modLow': {
    headline: 'You would rather follow than lead, most of the time.',
    gift: 'You make room for others and rarely take over.',
    showsUp: [
      'You let others step in first',
      'You don’t feel the need to push your views',
      'You are comfortable outside the spotlight',
    ],
    watchFor: 'Others may underestimate what you can do.',
    tryThis: 'The next time a decision is open, suggest an answer instead of waiting.',
  },
  'Assertiveness|average': {
    headline: 'You sometimes lead and sometimes let others go first.',
    gift: 'You balance speaking up with listening.',
    showsUp: [
      'You share your opinions, but you don’t dominate',
      'You step in when it is needed',
      'You are happy to let others lead',
    ],
    watchFor: 'You may hold back in moments when your voice is needed.',
    tryThis: 'Notice one moment this week when you held back, and what it cost.',
  },
  'Assertiveness|modHigh': {
    headline: 'You are willing to take charge and make things happen.',
    gift: 'You are influential and action-oriented; people look to you.',
    showsUp: [
      'You put your opinions forward',
      'You start things rather than wait',
      'You lean toward leading',
    ],
    watchFor: 'Acting before thinking, and confidence that runs ahead of competence.',
    tryThis: 'Before your next decision, ask one person for their view first.',
  },
  'Assertiveness|high': {
    headline: 'You are commanding and take charge naturally.',
    gift: 'You are a natural leader: decisive, influential and quick to act.',
    showsUp: [
      'You state your views, sometimes forcefully',
      'You tend to steer conversations and groups',
      'You don’t wait for others to start',
    ],
    watchFor: 'Dominating others, and acting without thinking things through.',
    tryThis: 'In your next group setting, let someone else speak first and finish.',
  },
  'Assertiveness|veryHigh': {
    headline: 'You take charge almost by instinct.',
    gift: 'You move people to action, and you are not afraid to lead.',
    showsUp: [
      'You put your opinions forward strongly',
      'You tend to control social situations',
      'You act first, every time',
    ],
    watchFor: 'Others may feel run over, and boldness can be mistaken for being right.',
    tryThis: 'Ask “What am I missing?” before you commit to your next big call.',
  },

  // ---------- Neuroticism ----------
  'Neuroticism|veryLow': {
    headline: 'Stress rarely gets to you; you stay calm and bounce back fast.',
    gift: 'You are resilient and steady in life’s storms, and a calm presence for others.',
    showsUp: [
      'Setbacks don’t knock you down for long',
      'You worry little about health, money or loss',
      'You handle change and risk with ease',
    ],
    watchFor: 'You may overlook real risks, or seem unconcerned when others are hurting.',
    tryThis: 'Next time someone is anxious, ask what worries them before you reassure them.',
  },
  'Neuroticism|low': {
    headline: 'You feel little worry or upset under stress, and you recover quickly.',
    gift: 'You are resilient, and you navigate hard seasons well.',
    showsUp: [
      'You cope well with failure and setbacks',
      'You rarely worry about what could go wrong',
      'Change doesn’t rattle you',
    ],
    watchFor: 'Being so steady can make you miss warning signs, or miss how others feel.',
    tryThis: 'Before a big decision, list one thing that could go wrong, and plan for it.',
  },
  'Neuroticism|modLow': {
    headline: 'You feel less stress than most, and you cope well when it comes.',
    gift: 'You keep a hopeful outlook and handle change better than most.',
    showsUp: [
      'You tolerate hard times without being derailed',
      'You don’t dwell on what could be lost',
      'You recover from disappointment fairly quickly',
    ],
    watchFor: 'You may underestimate how heavy a situation feels to someone else.',
    tryThis: 'Check in this week with someone who is going through a hard time.',
  },
  'Neuroticism|average': {
    headline: 'You feel a normal amount of stress, and you recover in reasonable time.',
    gift: 'You have a balanced outlook: neither careless nor overwhelmed.',
    showsUp: [
      'Setbacks hurt, but you move past them',
      'You take sensible risks, not rash ones',
      'You keep reasonable concern for your health and future',
    ],
    watchFor: 'Very painful seasons may hit you harder than you expect.',
    tryThis: 'Notice what helps you recover after a hard day, and do more of it.',
  },
  'Neuroticism|modHigh': {
    headline: 'You feel stress and negative emotion more strongly than most.',
    gift: 'You notice danger early, and you take risks seriously.',
    showsUp: [
      'Setbacks take an emotional toll',
      'You may wonder whether you deserve good things',
      'You protect what you have rather than risk losing it',
    ],
    watchFor: 'Worry can shrink your world and keep you from good risks.',
    tryThis: 'Write down your biggest worry this week, then one small step you can take about it.',
  },
  'Neuroticism|high': {
    headline: 'You feel stress and negative emotion strongly, and it can linger.',
    gift: 'You are alert to risk and careful with what matters, and that has protected you.',
    showsUp: [
      'Failure or setbacks can feel devastating',
      'You worry about health, money and the future',
      'You avoid situations where you might lose',
    ],
    watchFor: 'Worry and low mood can build; good coping habits matter a great deal for you.',
    tryThis: 'Pick one steadying habit, like sleep, exercise or prayer, and protect it this week.',
  },
  'Neuroticism|veryHigh': {
    headline: 'You feel stress and negative emotion intensely.',
    gift: 'You sense trouble before others do, and you care about doing things safely.',
    showsUp: [
      'Setbacks can feel crushing',
      'Good news may make you wonder whether you deserve it',
      'You avoid risk wherever you can',
    ],
    watchFor: 'If worry or sadness is heavy most days, talk with a doctor or counselor. That is wisdom, not weakness.',
    tryThis: 'Name one person you can be honest with when stress is high, and reach out this week.',
  },

  // ---------- Withdrawal ----------
  'Withdrawal|veryLow': {
    headline: 'You rarely worry ahead of time, and the unknown doesn’t hold you back.',
    gift: 'You thrive in new, uncertain and complex situations.',
    showsUp: [
      'Rejection and embarrassment don’t stick',
      'Sadness and doubt pass quickly',
      'You walk into the unfamiliar without hesitating',
    ],
    watchFor: 'You can miss real danger, or walk into risks you didn’t see.',
    tryThis: 'Before your next leap, ask someone more cautious what they would watch for.',
  },
  'Withdrawal|low': {
    headline: 'Anticipating trouble rarely slows you down.',
    gift: 'You are resilient, and you handle the unexpected well.',
    showsUp: [
      'You don’t avoid new or uncertain situations',
      'You aren’t easily hurt by rejection',
      'You recover quickly from fear or sadness',
    ],
    watchFor: 'You may be unaware of risks others can see.',
    tryThis: 'List the downside of one decision you are making, even if it feels unnecessary.',
  },
  'Withdrawal|modLow': {
    headline: 'You don’t often worry ahead of time, and you handle the unknown easily.',
    gift: 'You face new and complex situations with confidence.',
    showsUp: [
      'Doubt and self-consciousness are mild for you',
      'Rejection doesn’t cut deep',
      'You bounce back from hurt quickly',
    ],
    watchFor: 'Others may need more reassurance than you do.',
    tryThis: 'Ask someone close what makes them anxious, and just listen.',
  },
  'Withdrawal|average': {
    headline: 'You sometimes worry ahead of time, but it doesn’t usually stop you.',
    gift: 'You handle new situations well, with healthy caution.',
    showsUp: [
      'You feel sadness and doubt, but not for too long',
      'Rejection stings, but you recover',
      'You aren’t constantly expecting the worst',
    ],
    watchFor: 'Big changes can stir more worry than you expect.',
    tryThis: 'When worry shows up, name it, then ask what is actually in your control.',
  },
  'Withdrawal|modHigh': {
    headline: 'You feel more worry than most about what might go wrong.',
    gift: 'You are careful and thoughtful about risk.',
    showsUp: [
      'You tend to avoid new or uncertain situations',
      'Rejection and embarrassment hurt more than expected',
      'It takes you a while to recover from fear or hurt',
    ],
    watchFor: 'Avoidance can quietly shrink your life.',
    tryThis: 'Choose one small thing you have been avoiding and do it this week.',
  },
  'Withdrawal|high': {
    headline: 'You feel strong worry about what might happen, and you tend to pull back.',
    gift: 'You notice risks others miss, and that care has protected you.',
    showsUp: [
      'New or uncertain situations feel very hard',
      'Doubt, sadness and self-consciousness come often',
      'Rejection hurts deeply, and calming down takes time',
    ],
    watchFor: 'Withdrawing can become a habit that keeps you from good things.',
    tryThis: 'Take one small step toward something new, with a trusted person beside you.',
  },
  'Withdrawal|veryHigh': {
    headline: 'Worry about what might happen is a constant companion for you.',
    gift: 'You are deeply careful and alert, and you rarely walk into danger unaware.',
    showsUp: [
      'The unknown feels very threatening',
      'Sadness, doubt and embarrassment come easily',
      'Rejection hurts deeply and lingers',
    ],
    watchFor: 'If anxiety or sadness is heavy most days, talk with a doctor or counselor. That is wisdom, not weakness.',
    tryThis: 'Write down one fear, then one truth that answers it. Keep it where you will see it.',
  },

  // ---------- Volatility ----------
  'Volatility|veryLow': {
    headline: 'Your moods are remarkably steady; very little upsets you.',
    gift: 'You are calming to be around, even in conflict.',
    showsUp: [
      'You almost never lose your composure',
      'Frustration and irritation pass almost immediately',
      'You stay calm even when provoked',
    ],
    watchFor: 'Others may not be able to tell when something does matter to you.',
    tryThis: 'Next time something bothers you, say so calmly, so people know where you stand.',
  },
  'Volatility|low': {
    headline: 'Your mood is stable, and you calm down quickly.',
    gift: 'You stay composed under stress, and people trust your steadiness.',
    showsUp: [
      'You are rarely irritable or argumentative',
      'You express frustration reasonably',
      'Upsets pass quickly',
    ],
    watchFor: 'You may expect others to recover as fast as you do.',
    tryThis: 'Give someone who is upset a little more time than you would need.',
  },
  'Volatility|modLow': {
    headline: 'Your mood is generally steady, and you rarely lash out.',
    gift: 'You keep your composure, and you handle frustration well.',
    showsUp: [
      'You are slow to anger',
      'You calm down quickly when upset',
      'You rarely argue for its own sake',
    ],
    watchFor: 'If provoked hard enough, you may react in kind.',
    tryThis: 'Notice what pushes you past calm, and plan a response ahead of time.',
  },
  'Volatility|average': {
    headline: 'Your mood is usually stable, though frustration can rise when you are pushed.',
    gift: 'You can feel frustration and still recover well.',
    showsUp: [
      'You get irritated sometimes, but not often',
      'You express frustration reasonably',
      'You regain your calm after a conflict',
    ],
    watchFor: 'Hard provocation, especially when you are tired, can bring a sharp reaction.',
    tryThis: 'When you feel the heat rising, take a breath before you answer.',
  },
  'Volatility|modHigh': {
    headline: 'Your mood can swing, and frustration rises quickly.',
    gift: 'You feel things fully, and you will defend what matters.',
    showsUp: [
      'Disappointment and frustration hit hard',
      'You may snap, then need time to recover',
      'Arguments can get heated',
    ],
    watchFor: 'Words said in the moment can hurt the people you love.',
    tryThis: 'Agree on a “pause” word with someone close, to use when things get heated.',
  },
  'Volatility|high': {
    headline: 'Your mood varies a great deal, and frustration can spill over.',
    gift: 'Your passion is real: you are a fierce defender of people and causes.',
    showsUp: [
      'You are easily irritated or upset',
      'You may lash out, then take a long time to settle',
      'You can lose your composure in arguments',
    ],
    watchFor: 'Relationships can wear thin from repeated blowups.',
    tryThis: 'Practice walking away for ten minutes before you respond when angry.',
  },
  'Volatility|veryHigh': {
    headline: 'Your emotions run hot and change quickly.',
    gift: 'You feel deeply, and you will fight for what is right.',
    showsUp: [
      'Small frustrations can feel big',
      'You may lash out and struggle to calm down',
      'Arguments can quickly turn heated',
    ],
    watchFor: 'Anger can damage trust, and recovery takes you longer than others expect.',
    tryThis: 'Find one calming practice that works for you, and use it at the first sign of heat.',
  },

  // ---------- Conscientiousness ----------
  'Conscientiousness|veryLow': {
    headline: 'You are very relaxed and present-minded, and plans and schedules matter little to you.',
    gift: 'You live in the moment, stay flexible when plans change, and rarely carry guilt over mishaps.',
    showsUp: [
      'You enjoy downtime without feeling it is wasted',
      'Deadlines and to-do lists slip easily',
      'You are open to unconventional ways of doing things',
    ],
    watchFor: 'Procrastination and missed commitments can cost you trust, and frustrate more orderly people around you.',
    tryThis: 'Pick one small daily task, and do it at the same time every day this week.',
  },
  'Conscientiousness|low': {
    headline: 'You are relaxed and easygoing, and you don’t lean on plans or lists.',
    gift: 'You are flexible, adaptable and slow to judge yourself or others.',
    showsUp: [
      'You enjoy leisure and rarely feel guilty about it',
      'You are easily distracted, and procrastination is common',
      'You can solve new problems in unexpected ways',
    ],
    watchFor: 'Others may see you as unreliable, and long or complex tasks can stall.',
    tryThis: 'Break your next big task into one step small enough to finish today.',
  },
  'Conscientiousness|modLow': {
    headline: 'You lean relaxed and flexible more than planned and driven.',
    gift: 'You adapt well when plans change, and you don’t beat yourself up over mistakes.',
    showsUp: [
      'Leisure comes easily to you',
      'You put things off more than you would like',
      'You are open to other people’s ways of doing things',
    ],
    watchFor: 'Being late or distracted can make you seem less dependable than you are.',
    tryThis: 'Use one simple tool, like a phone reminder or a short list, for this week’s commitments.',
  },
  'Conscientiousness|average': {
    headline: 'You balance hard work and focus with rest and leisure.',
    gift: 'You can be organized and reliable, and still flexible when things change.',
    showsUp: [
      'Some days are planned, others aren’t',
      'You usually do what you say, though distractions happen',
      'You value tradition without being bound by it',
    ],
    watchFor: 'Without a reason to push, you may stop short of what you could do.',
    tryThis: 'Choose one goal this month that matters to you, and plan its first step.',
  },
  'Conscientiousness|modHigh': {
    headline: 'You are hardworking, organized and drawn to duty.',
    gift: 'You are faithful to do what you say, and you persevere through setbacks.',
    showsUp: [
      'You make plans and keep them',
      'Wasted time and excuses bother you',
      'You do things carefully and by the book',
    ],
    watchFor: 'Guilt over failure, judging others who work less, and trouble relaxing.',
    tryThis: 'Schedule one block of real rest this week, and treat it as a commitment.',
  },
  'Conscientiousness|high': {
    headline: 'You are very hardworking and organized, with a strong sense of duty.',
    gift: 'You are dependable, disciplined and able to work long and hard toward a goal.',
    showsUp: [
      'Inactivity makes you restless',
      'You keep detailed plans and follow them',
      'Family traditions and responsibilities matter a great deal to you',
    ],
    watchFor: 'Harsh self-judgment, controlling others, rigidity when plans change, and burnout.',
    tryThis: 'When something goes wrong, ask: would I judge a friend this harshly?',
  },
  'Conscientiousness|veryHigh': {
    headline: 'You are extremely driven, detailed and devoted to duty.',
    gift: 'Your discipline and reliability are rare; people can count on you completely.',
    showsUp: [
      'Wasting time is almost unbearable',
      'You hold yourself and others to very high standards',
      'You take on extra work rather than leave something undone',
    ],
    watchFor: 'Intense guilt and shame over failure, micromanaging, and burnout from never stopping.',
    tryThis: 'Rest is part of faithful work. Practice one day this week with nothing to accomplish.',
  },

  // ---------- Industriousness ----------
  'Industriousness|veryLow': {
    headline: 'Work and duty rarely excite or drive you.',
    gift: 'You are easygoing and nonjudgmental, and you give people the benefit of the doubt.',
    showsUp: [
      'Focusing on work is very hard',
      'Deadlines and responsibilities slip',
      'You don’t carry much guilt about it',
    ],
    watchFor: 'Unfinished work can hold you back, and others may see you as an underachiever.',
    tryThis: 'Work for fifteen focused minutes on one task, then stop. Repeat tomorrow.',
  },
  'Industriousness|low': {
    headline: 'You are not especially driven by work or duty.',
    gift: 'You are relaxed and forgiving, of yourself and others.',
    showsUp: [
      'You put off responsibilities',
      'Schedules and timelines don’t concern you much',
      'You believe luck matters as much as effort',
    ],
    watchFor: 'You may need outside structure to finish what matters.',
    tryThis: 'Ask someone to check in on one goal with you each week.',
  },
  'Industriousness|modLow': {
    headline: 'You are less driven by work and duty than most.',
    gift: 'You don’t judge yourself or others harshly over work.',
    showsUp: [
      'Procrastination can creep in',
      'You are easily distracted',
      'You give people second chances',
    ],
    watchFor: 'Missed deadlines can cost you opportunities and trust.',
    tryThis: 'Finish one small thing you have been putting off, today.',
  },
  'Industriousness|average': {
    headline: 'You balance the drive to get things done with time to relax.',
    gift: 'You can separate work and leisure, and you know how to enjoy free time.',
    showsUp: [
      'You know what needs doing, without obsessing over it',
      'Schedules help you, but you don’t depend on them',
      'Failure stings, but not for long',
    ],
    watchFor: 'You may coast when a season calls for extra effort.',
    tryThis: 'Choose one area where more effort would really pay off, and give it an extra hour this week.',
  },
  'Industriousness|modHigh': {
    headline: 'You are driven to be useful, and you prefer doing something to doing nothing.',
    gift: 'You are focused and dutiful, and you finish what you start.',
    showsUp: [
      'You don’t like to put things off',
      'You prefer to be on a schedule',
      'You want to accomplish more in less time',
    ],
    watchFor: 'Judging people you see as lazy, and burning out without planned rest.',
    tryThis: 'Put leisure on your calendar this week, the same way you would a meeting.',
  },
  'Industriousness|high': {
    headline: 'You are very driven, and you always want to be doing something useful.',
    gift: 'Your focus and work ethic are exceptional; you get things done.',
    showsUp: [
      'Relaxing or doing nothing is hard',
      'You never put things off, and you hate mistakes',
      'You are quick to notice who isn’t pulling their weight',
    ],
    watchFor: 'Guilt when plans fail, harsh judgment of others, and eventual burnout.',
    tryThis: 'Learn to rest on purpose: take one evening off without checking work.',
  },
  'Industriousness|veryHigh': {
    headline: 'You are extremely driven; work and life feel like the same thing.',
    gift: 'Your focus and endurance are rare; you can accomplish a great deal.',
    showsUp: [
      'You can’t stand doing nothing',
      'You finish everything, on schedule',
      'You have little patience for laziness',
    ],
    watchFor: 'Intense guilt over any failure, and burnout if you never learn to rest.',
    tryThis: 'Practice one true Sabbath-style rest this week, and notice what comes up.',
  },

  // ---------- Orderliness ----------
  'Orderliness|veryLow': {
    headline: 'Mess and chaos don’t bother you, and you see a lot of grey in life.',
    gift: 'You are flexible and creative, and gentle with yourself and others when things go wrong.',
    showsUp: [
      'Schedules feel too rigid',
      'Things end up scattered, and that is fine with you',
      'Too much routine frustrates you',
    ],
    watchFor: 'Complex tasks can overwhelm you, and housework can become a source of friction at home.',
    tryThis: 'Pick one spot, like your desk or your keys, and give it a home this week.',
  },
  'Orderliness|low': {
    headline: 'You don’t mind mess, and you don’t see life in black and white.',
    gift: 'You are creative, flexible and slow to judge.',
    showsUp: [
      'You avoid rigid schedules',
      'Details and rules are not your focus',
      'Routine can feel stifling',
    ],
    watchFor: 'Disorder can frustrate the people you live and work with.',
    tryThis: 'Talk with your household about who handles which chores, before resentment builds.',
  },
  'Orderliness|modLow': {
    headline: 'You usually don’t mind mess, and you are comfortable with grey areas.',
    gift: 'You are flexible, creative and not harsh with yourself or others.',
    showsUp: [
      'You don’t keep a place for everything',
      'Schedules come and go',
      'You can live without routine',
    ],
    watchFor: 'Complex projects may get away from you without some structure.',
    tryThis: 'Use one simple system, like a single list, for your next complex project.',
  },
  'Orderliness|average': {
    headline: 'You are moderately tidy and organized, but mess doesn’t disturb you much.',
    gift: 'You can handle structure and disruption equally well.',
    showsUp: [
      'You like routine but cope when it is disrupted',
      'You use lists and schedules when you need them',
      'You think in more than black and white',
    ],
    watchFor: 'With complex work, you may need reminders to stay focused.',
    tryThis: 'Notice which parts of your life run better with a routine, and keep that one.',
  },
  'Orderliness|modHigh': {
    headline: 'You like a clean, ordered life, and mess bothers you.',
    gift: 'You are skilled at managing complex tasks, and you keep things running.',
    showsUp: [
      'You make schedules and stick to them',
      'You like a place for everything',
      'You focus on details and rules',
    ],
    watchFor: 'Black-and-white thinking, and being hard on yourself and others when order breaks.',
    tryThis: 'Let one small thing stay imperfect this week, on purpose.',
  },
  'Orderliness|high': {
    headline: 'Order and cleanliness matter deeply to you; mess really disturbs you.',
    gift: 'You bring structure and clarity, and you manage complexity well.',
    showsUp: [
      'Things must stay where they belong',
      'Rules, details and right-and-wrong matter a lot',
      'Losing your routine is very unsettling',
    ],
    watchFor: 'Harshness toward yourself and others, and creativity can feel like chaos to you.',
    tryThis: 'When something is out of place, pause before reacting and ask whether it truly matters.',
  },
  'Orderliness|veryHigh': {
    headline: 'You need order; mess and disruption are very hard for you.',
    gift: 'You create structure others rely on, and you handle complex work with precision.',
    showsUp: [
      'Everything has a place, and stays there',
      'You see things as clearly right or wrong',
      'You are agitated without routine',
    ],
    watchFor: 'Rigidity, and being very hard on yourself and others when things fall out of order.',
    tryThis: 'Share one household or work task with someone, and let them do it their way.',
  },

  // ---------- Openness ----------
  'Openness|veryLow': {
    headline: 'You prefer the familiar and the practical over novelty, art and abstract ideas.',
    gift: 'Your focus lets you settle on one path, master a skill, and stand firm in your convictions.',
    showsUp: [
      'You stick with what you know and how you were raised',
      'Routine and predictability help you thrive',
      'Abstract thinking feels tiring',
    ],
    watchFor: 'You may seem stuck in the past to more open people, and miss good new ideas.',
    tryThis: 'Try one new thing this month: a food, a route, or a type of book.',
  },
  'Openness|low': {
    headline: 'You value the traditional and the practical, and you keep your interests focused.',
    gift: 'You are steady in your beliefs, and you do things well the proven way.',
    showsUp: [
      'You prefer familiar movies, music and places',
      'Routine work suits you',
      'You rarely second-guess your convictions',
    ],
    watchFor: 'You may struggle to adapt when life demands change.',
    tryThis: 'Ask someone very different from you how they see one issue, and just listen.',
  },
  'Openness|modLow': {
    headline: 'You lean toward the familiar, and your interests are focused.',
    gift: 'You are practical and grounded, and confident in your path.',
    showsUp: [
      'You enjoy tradition and doing things the known way',
      'You read and explore when you need to, not for its own sake',
      'You like predictable work',
    ],
    watchFor: 'You may pass up new opportunities that would actually suit you.',
    tryThis: 'Say yes to one invitation outside your usual routine.',
  },
  'Openness|average': {
    headline: 'You are moderately curious, and open to new ideas without chasing change.',
    gift: 'You can appreciate the old and occasionally see it in new ways.',
    showsUp: [
      'You enjoy learning when the topic interests you',
      'You are comfortable with structure',
      'You don’t seek change for its own sake',
    ],
    watchFor: 'Comfort can keep you from exploring gifts you don’t know you have.',
    tryThis: 'Pick one subject you are curious about and spend an hour on it this week.',
  },
  'Openness|modHigh': {
    headline: 'You are curious and creative, and you see things in new ways.',
    gift: 'You generate ideas, learn quickly and find fresh solutions.',
    showsUp: [
      'You read widely and think quickly',
      'Routine work makes you restless',
      'New ventures excite you',
    ],
    watchFor: 'So many interests can make it hard to settle on one path.',
    tryThis: 'Choose one idea you have been carrying, and take one concrete step on it.',
  },
  'Openness|high': {
    headline: 'You are very curious, creative and drawn to change.',
    gift: 'You are visionary, quick to learn and full of ideas.',
    showsUp: [
      'You see old problems in a new light',
      'Rigid structures and routine chafe',
      'You like to shake things up',
    ],
    watchFor: 'Struggling to commit to one path, and second-guessing your own convictions.',
    tryThis: 'Write down your top three interests, and choose one to focus on for the next month.',
  },
  'Openness|veryHigh': {
    headline: 'Your curiosity and creativity are boundless; you constantly seek the new.',
    gift: 'You see possibilities others miss, and you are a natural visionary.',
    showsUp: [
      'You read and think about almost everything',
      'Routine feels nearly unbearable',
      'You are drawn to new ventures and big ideas',
    ],
    watchFor: 'Finding one identity or path can feel impossible, and ideas may outrun action.',
    tryThis: 'Finish one idea before starting the next. Pick it today.',
  },

  // ---------- Interest in Ideas ----------
  'Interest in Ideas|veryLow': {
    headline: 'You prefer the concrete and familiar to complex or abstract ideas.',
    gift: 'You can become highly skilled in proven, traditional methods.',
    showsUp: [
      'Complex information feels overwhelming',
      'Debates and issue-driven discussions don’t appeal to you',
      'You like clear rules for success',
    ],
    watchFor: 'New situations that demand fresh thinking can be hard. (This is about interest, not intelligence.)',
    tryThis: 'Ask “why?” about one thing you do every day, and see where it leads.',
  },
  'Interest in Ideas|low': {
    headline: 'You are less drawn to complex problems and abstract ideas than most.',
    gift: 'You master the tried-and-true and do it well.',
    showsUp: [
      'You avoid information overload',
      'You prefer straightforward work',
      'Putting ideas into words takes effort',
    ],
    watchFor: 'Adapting to new experiences can be harder. (This is about interest, not intelligence.)',
    tryThis: 'Read one short article on a subject that matters to your work or family.',
  },
  'Interest in Ideas|modLow': {
    headline: 'Complex ideas and debates draw you less than most.',
    gift: 'You are practical, and you get skilled at the proven way of doing things.',
    showsUp: [
      'You prefer clear, simple information',
      'You rarely seek out issue-driven discussions',
      'Traditional work with clear rules suits you',
    ],
    watchFor: 'You may hold back ideas because they are hard to put into words. (This is about interest, not intelligence.)',
    tryThis: 'Jot down one idea this week before you lose it, even if it isn’t polished.',
  },
  'Interest in Ideas|average': {
    headline: 'You enjoy learning, though complex new information doesn’t always draw you in.',
    gift: 'You engage deeply when a subject matters to you.',
    showsUp: [
      'You read and think when there is a reason to',
      'You join discussions about your own interests',
      'You can come up with new ideas, at your own pace',
    ],
    watchFor: 'You may not explore unless someone encourages you.',
    tryThis: 'Invite someone to talk through a question you have been wondering about.',
  },
  'Interest in Ideas|modHigh': {
    headline: 'You enjoy learning and wrestling with complex ideas.',
    gift: 'You are articulate, and you form ideas clearly and quickly.',
    showsUp: [
      'You read, often non-fiction, and want to discuss it',
      'You seek out new experiences and problems',
      'You are drawn to complex work',
    ],
    watchFor: 'Simple, routine work can leave you bored and frustrated.',
    tryThis: 'Teach someone one thing you have learned recently.',
  },
  'Interest in Ideas|high': {
    headline: 'You love ideas, and you are drawn to complex problems.',
    gift: 'You are curious, articulate and a strong problem solver.',
    showsUp: [
      'You start discussions about issues and ideas',
      'You prefer complex information to simple',
      'You generate new concepts readily',
    ],
    watchFor: 'You may live in your head, and routine roles can frustrate you.',
    tryThis: 'Turn one idea into action this week, however small.',
  },
  'Interest in Ideas|veryHigh': {
    headline: 'Ideas energize you; the more complex, the better.',
    gift: 'Your curiosity and clarity of thought are rare.',
    showsUp: [
      'You constantly explore and question',
      'You read, think and debate widely',
      'You develop new concepts with ease',
    ],
    watchFor: 'Thinking can replace doing, and simple work can feel unbearable.',
    tryThis: 'Pick one big idea and write down what doing it would actually take.',
  },

  // ---------- Aesthetic Openness ----------
  'Aesthetic Openness|veryLow': {
    headline: 'Art, beauty and imagination don’t draw you much, and that is fine with you.',
    gift: 'You are practical and stable; it is easier for you to settle into a career and an identity.',
    showsUp: [
      'You rarely daydream or get lost in a story',
      'Your taste in music and art is conventional',
      'You focus on what is useful',
    ],
    watchFor: 'You may miss the rest and meaning beauty can bring.',
    tryThis: 'Spend ten minutes outside this week, just noticing what is beautiful.',
  },
  'Aesthetic Openness|low': {
    headline: 'You are not especially drawn to art, beauty or creative pursuits.',
    gift: 'You are grounded and practical, and steady in your choices.',
    showsUp: [
      'Color and design rarely catch your attention',
      'You seldom daydream',
      'You enjoy familiar, popular entertainment',
    ],
    watchFor: 'Creative people around you may feel you don’t understand what moves them.',
    tryThis: 'Ask someone you love what piece of music or art moves them, and why.',
  },
  'Aesthetic Openness|modLow': {
    headline: 'Beauty and the arts draw you less than most people.',
    gift: 'You are practical and focused, and comfortable with who you are.',
    showsUp: [
      'You don’t feel the need for a creative outlet',
      'You rarely get immersed in a book or movie',
      'You are content with simple surroundings',
    ],
    watchFor: 'You may overlook beauty as a source of rest.',
    tryThis: 'Listen to one piece of music this week with full attention.',
  },
  'Aesthetic Openness|average': {
    headline: 'You enjoy beauty, art and music sometimes, without being driven by them.',
    gift: 'You are adaptable, comfortable in almost any setting.',
    showsUp: [
      'Creativity is a hobby, not a need',
      'You enjoy books and movies without getting lost in them',
      'Beauty moves you on occasion',
    ],
    watchFor: 'You may not make room for the creative side you do have.',
    tryThis: 'Make something this week: a meal, a sketch or a garden bed.',
  },
  'Aesthetic Openness|modHigh': {
    headline: 'You love beauty, art and music, and they move you deeply.',
    gift: 'Your imagination is powerful; you notice and create beauty.',
    showsUp: [
      'You need a creative outlet',
      'Your surroundings affect you strongly',
      'Stories and music can absorb you completely',
    ],
    watchFor: 'Practical matters can slip, and turning creativity into income can be hard.',
    tryThis: 'Protect one regular time for creative work, and guard it.',
  },
  'Aesthetic Openness|high': {
    headline: 'Beauty and creativity are central to who you are.',
    gift: 'You respond strongly to beauty, and you bring it into the world.',
    showsUp: [
      'Without a creative outlet, you wither',
      'You are very sensitive to color, design and space',
      'You can get lost in reflection',
    ],
    watchFor: 'You may seem impractical, especially if organization isn’t your strength.',
    tryThis: 'Pair your next creative project with one practical deadline.',
  },
  'Aesthetic Openness|veryHigh': {
    headline: 'You are deeply moved by beauty, art and imagination.',
    gift: 'Your sensitivity to beauty is a rare gift; you help others see it.',
    showsUp: [
      'Creative expression is a need, not a hobby',
      'Your environment strongly shapes your mood',
      'Music and stories can make the world disappear',
    ],
    watchFor: 'Daily responsibilities can slip, and making a living from creativity is hard.',
    tryThis: 'Share one thing you have made with someone this week.',
  },

};

export function getShortWriteup(trait: string, level: ScoreLevel): ShortWriteup | undefined {
  return shortWriteups[`${trait}|${level}` as Key];
}
