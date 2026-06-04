import jsPDF from 'jspdf';
import { Aspect, Ocean } from '../constants/schema';

interface TraitConfig {
  ocean: Ocean;
  aspects: [Aspect, Aspect];
  separatorColor: [number, number, number];
}

const TRAIT_CONFIG: TraitConfig[] = [
  { ocean: Ocean.Extraversion,     aspects: [Aspect.Enthusiasm,       Aspect.Assertiveness], separatorColor: [240, 109, 121] },
  { ocean: Ocean.Neuroticism,      aspects: [Aspect.Withdrawal,       Aspect.Volatility],    separatorColor: [169,  81, 159] },
  { ocean: Ocean.Agreeableness,    aspects: [Aspect.Compassion,       Aspect.Politeness],    separatorColor: [ 87, 148, 212] },
  { ocean: Ocean.Conscientiousness,aspects: [Aspect.Industriousness,  Aspect.Orderliness],   separatorColor: [ 38, 209, 194] },
  { ocean: Ocean.Openness,         aspects: [Aspect.AestheticOpenness,Aspect.Interest],      separatorColor: [ 52,  75,  71] },
];

/**
 * Generates and downloads a PDF summary of the user's personality results.
 */
export const generatePdfDoc = (email: string, percentiles: Record<string, number> | null): void => {
  const doc = new jsPDF();
  doc.setFont('Monaco', undefined, 700);
  let xPosition: number;
  let yPosition = 15;

  // Title
  const title = 'Personality Plus Results';
  doc.setFontSize(24);
  xPosition = getCenteredTextPosition(doc, title);
  doc.text(title, xPosition, yPosition);

  // Email
  doc.setFontSize(16);
  xPosition = getCenteredTextPosition(doc, email);
  doc.text(email, xPosition, (yPosition += 10));

  // One block per OCEAN trait + its two aspects
  for (const { ocean, aspects, separatorColor } of TRAIT_CONFIG) {
    const oceanLabel = ocean.toString();
    const oceanScore = percentiles?.[oceanLabel] ?? 99;

    doc.setFontSize(20);
    doc.text(`${oceanLabel}: ${oceanScore}`, 20, (yPosition += 15));

    aspects.forEach((aspect, i) => {
      const aspectLabel = aspect.toString();
      const aspectScore = percentiles?.[aspectLabel] ?? 99;
      doc.setFontSize(18);
      doc.text(`${aspectLabel}: ${aspectScore}`, 100, i === 0 ? yPosition : (yPosition += 10));
    });

    const [r, g, b] = separatorColor;
    doc.setDrawColor(r, g, b);
    doc.line(20, yPosition + 5, 190, yPosition + 5);
  }

  doc.save(`${email}_personality_plus_results.pdf`);
};

const getCenteredTextPosition = (doc: jsPDF, text: string): number => {
  const textWidth = doc.getTextDimensions(text).w;
  const pageWidth = doc.internal.pageSize.width;
  return (pageWidth - textWidth) / 2;
};
