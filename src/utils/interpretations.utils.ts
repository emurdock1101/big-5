import { ScoreLevel, Interpretation } from '../constants/schema';
import { interpretations } from '../constants/interpretations';

/**
 * Maps a percentile score to a ScoreLevel bucket.
 */
export function getScoreLevel(percentile: number): ScoreLevel {
  if (percentile >= 90) return 'veryHigh';
  if (percentile >= 75) return 'high';
  if (percentile >= 60) return 'modHigh';
  if (percentile >= 40) return 'average';
  if (percentile >= 25) return 'modLow';
  if (percentile >= 10) return 'low';
  return 'veryLow';
}

/**
 * Returns the interpretation entry for a given trait + percentile score.
 */
export function getInterpretation(trait: string, percentile: number): Interpretation | undefined {
  const level = getScoreLevel(percentile);
  return interpretations.find((i) => i.trait === trait && i.scoreLevel === level);
}

/**
 * Returns the correct English ordinal suffix for a given integer.
 * e.g. 1 → "st", 2 → "nd", 3 → "rd", 4–20 → "th", 21 → "st", 22 → "nd", …
 */
function ordinalSuffix(n: number): string {
  const abs = Math.abs(n);
  const lastTwo = abs % 100;
  // 11th, 12th, 13th are irregular
  if (lastTwo >= 11 && lastTwo <= 13) return 'th';
  switch (abs % 10) {
    case 1: return 'st';
    case 2: return 'nd';
    case 3: return 'rd';
    default: return 'th';
  }
}

function getScoreLevelLabel(level: ScoreLevel): string {
  const labels: Record<ScoreLevel, string> = {
    veryLow: 'Very Low',
    low: 'Low',
    modLow: 'Moderately Low',
    average: 'Average',
    modHigh: 'Moderately High',
    high: 'High',
    veryHigh: 'Very High',
  };
  return labels[level];
}

/**
 * Builds a prompt-ready string containing all personality interpretations
 * for a given set of percentile scores. Use this as context for an AI chat
 * system — pass the output into a system prompt alongside the user's question.
 *
 * @param percentiles - Record mapping trait names (Ocean/Aspect values) to percentile scores
 * @returns Formatted string ready to drop into an LLM system prompt
 *
 * @example
 * const context = buildAIContext(results.percentiles);
 * // "=== Personality Assessment Results ===\n\nEXTRAVERSION — 65th percentile..."
 */
export function buildAIContext(percentiles: Record<string, number>): string {
  const lines: string[] = ['=== Personality Assessment Results ===\n'];

  for (const [trait, percentile] of Object.entries(percentiles)) {
    const interp = getInterpretation(trait, percentile);
    if (!interp) continue;
    const label = getScoreLevelLabel(interp.scoreLevel);
    lines.push(`${trait.toUpperCase()} — ${percentile}${ordinalSuffix(percentile)} percentile (${label})`);
    lines.push(interp.paragraphs.join('\n\n'));
    lines.push('');
  }

  return lines.join('\n');
}
