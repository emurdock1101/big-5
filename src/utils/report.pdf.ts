import jsPDF from 'jspdf';
import {Ocean} from '../constants/schema';
import {TRAITS, BOOKING_URL} from '../design/traits';
import {getShortWriteup, ShortWriteup} from '../constants/shortWriteups';
import {getInterpretation, getScoreLevel} from './interpretations.utils';
import {aspectSplit} from '../constants/aspectSplits';
import {FACTOR_NAME, FACTOR_TRAITS, TREE_H, TREE_W, factorScores, ordinal} from '../design/tree';

/**
 * The downloadable report.
 *   Page 1 (landscape): the personality tree.
 *   Page 2: every score in plain text.
 *   Pages 3+: one section per trait with its short write-up, its two aspects, and any split.
 */

export interface ReportInput {
  name?: string;
  email: string;
  /** 'male' | 'female': the comparison group. */
  gender: string;
  percentiles: Record<string, number> | null;
  /** PNG data URL of the personality tree (see treePng). Omitted in tests or if drawing fails. */
  treeImage?: string | null;
  date?: Date;
  /** 'open' shows the PDF in a new tab instead of downloading it (used by the preview page). */
  mode?: 'save' | 'open';
}

const INK = '#15172b';
const INK_SOFT = '#4a4c60';
const RULE = '#c3c6cc';
const TRACK = '#dcdee1';
/** Darker versions of the trait colors that read well as text on white. */
const TEXT_COLOR: Record<string, string> = {
  [Ocean.Extraversion]: '#b52637',
  [Ocean.Neuroticism]: '#9a338e',
  [Ocean.Agreeableness]: '#255f9e',
  [Ocean.Conscientiousness]: '#00756b',
  [Ocean.Openness]: '#344b47',
};

const rgb = (hex: string): [number, number, number] => {
  const n = parseInt(hex.slice(1), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
};

export const levelWord = (p: number) =>
  p >= 90
    ? 'very high'
    : p >= 75
    ? 'high'
    : p >= 60
    ? 'moderately high'
    : p >= 40
    ? 'average'
    : p >= 25
    ? 'moderately low'
    : p >= 10
    ? 'low'
    : 'very low';

export const cleanName = (name?: string) => (name && name.trim() && name !== 'name_unknown' ? name.trim() : '');

export const reportFileName = (name?: string) => {
  const slug = cleanName(name)
    .replace(/[^A-Za-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
  return `Personality-Plus-${slug || 'results'}.pdf`;
};

export function generateReport({
  name,
  gender,
  percentiles,
  treeImage,
  date = new Date(),
  mode = 'save',
}: ReportInput): void {
  if (!percentiles) return;
  const p = (k: string) => Math.round(percentiles[k] ?? 0);
  const who = cleanName(name);
  const group = gender === 'male' ? 'men' : gender === 'female' ? 'women' : 'people';
  const when = date.toLocaleDateString('en-US', {year: 'numeric', month: 'long', day: 'numeric'});

  const doc = new jsPDF({orientation: 'landscape', unit: 'pt', format: 'letter'});
  const M = 48;
  let pageW = 792;
  let y = 0;
  const BOTTOM = 792 - 60;

  const color = (hex: string) => doc.setTextColor(...rgb(hex));
  const font = (style: 'normal' | 'bold', size: number) => {
    doc.setFont('helvetica', style);
    doc.setFontSize(size);
  };
  const strip = (top: number, width: number) => {
    const w = width / TRAITS.length;
    TRAITS.forEach((t, i) => {
      doc.setFillColor(...rgb(t.color));
      doc.rect(M + i * w, top, w, 5, 'F');
    });
  };
  const bar = (x: number, top: number, w: number, value: number, hex: string) => {
    doc.setFillColor(...rgb(TRACK));
    doc.rect(x, top, w, 6, 'F');
    doc.setFillColor(...rgb(hex));
    doc.rect(x, top, (w * Math.max(0, Math.min(100, value))) / 100, 6, 'F');
  };
  const newPage = () => {
    doc.addPage('letter', 'portrait');
    pageW = 612;
    strip(36, pageW - 2 * M);
    y = 80;
  };
  const need = (h: number) => {
    if (y + h > BOTTOM) newPage();
  };
  const lines = (text: string, width: number, size: number, style: 'normal' | 'bold' = 'normal'): string[] => {
    font(style, size);
    return doc.splitTextToSize(text, width);
  };

  // ---------- page 1: the tree (landscape) ----------
  strip(36, pageW - 2 * M);
  font('bold', 8);
  color(INK_SOFT);
  doc.text('PERSONALITY+  ·  BY PATRICK KNICELY', M, 60, {charSpace: 0.8});
  font('bold', 26);
  color(INK);
  doc.text(who ? `${who}’s personality` : 'Your personality', M, 92);
  font('normal', 10);
  color(INK_SOFT);
  doc.text(`Big Five Aspect Scales  ·  compared with other ${group}  ·  ${when}`, pageW - M, 92, {align: 'right'});

  const treeW = pageW - 2 * M;
  const treeH = (treeW * TREE_H) / TREE_W;
  if (treeImage) {
    doc.addImage(treeImage, 'PNG', M, 106, treeW, treeH);
  }
  font('normal', 8.5);
  color(INK_SOFT);
  doc.text(
    lines(
      `Circle size and the number inside show your percentile. The ring around your name is split by your five trait scores. ${FACTOR_NAME.stability} averages your Agreeableness, Conscientiousness and low Neuroticism, so its purple slice is 100 minus your Neuroticism. ${FACTOR_NAME.plasticity} averages your Extraversion and Openness.`,
      treeW,
      8.5,
    ),
    M,
    106 + treeH + 14,
  );

  // ---------- page 2: plain scores ----------
  newPage();
  font('bold', 22);
  color(INK);
  doc.text('Your scores', M, y);
  y += 20;
  doc.text(
    lines(
      `Each score is a percentile: the share of other ${group} who scored lower than you. Average is 40th to 59th.`,
      pageW - 2 * M,
      10,
    ),
    M,
    y,
  );
  y += 30;

  const f = factorScores((k) => percentiles[k] ?? 0);
  const row = (label: string, value: number, hex: string, indent: number, strong: boolean) => {
    font(strong ? 'bold' : 'normal', strong ? 11.5 : 10);
    color(INK);
    doc.text(label, M + indent, y);
    font('normal', 10);
    color(INK_SOFT);
    doc.text(`${ordinal(value)} · ${levelWord(value)}`, M + 300, y);
    bar(M + 420, y - 6, pageW - 2 * M - 420, value, hex);
    y += strong ? 18 : 15;
  };
  (['stability', 'plasticity'] as const).forEach((fk) => {
    need(40);
    font('bold', 9);
    color(INK_SOFT);
    doc.text(FACTOR_NAME[fk].toUpperCase(), M, y, {charSpace: 0.8});
    y += 16;
    row(FACTOR_NAME[fk], f[fk], INK, 0, true);
    y += 4;
    FACTOR_TRAITS[fk].forEach((o) => {
      const t = TRAITS.find((x) => x.ocean === o)!;
      row(o, p(o), t.color, 0, true);
      t.aspects.forEach((a) => row(a, p(a), t.color, 16, false));
      y += 6;
    });
    y += 12;
  });
  font('normal', 9);
  color(INK_SOFT);
  doc.text(
    lines(
      'Every score has advantages and disadvantages; there is a place for each kind of personality. If a description feels harsher than seems fair, you may have been hard on yourself, or answered on a tired or anxious day.',
      pageW - 2 * M,
      9,
    ),
    M,
    y,
  );

  // ---------- trait pages ----------
  const card = (c: ShortWriteup) => {
    const width = pageW - 2 * M;
    const head = lines(c.headline, width, 12, 'bold');
    need(head.length * 15 + 40);
    color(INK);
    doc.text(head, M, y);
    y += head.length * 15 + 4;
    const labelW = 96;
    const valueW = width - labelW;
    const rows: [string, string[], boolean][] = [
      ['YOUR GIFT', lines(c.gift, valueW, 10, 'bold'), true],
      ['SHOWS UP AS', c.showsUp.flatMap((s) => lines(`•  ${s}`, valueW, 10)), false],
      ['WATCH FOR', lines(c.watchFor, valueW, 10), false],
      ['TRY THIS', lines(c.tryThis, valueW, 10), false],
    ];
    rows.forEach(([label, text, strong]) => {
      const h = text.length * 13.5 + 12;
      need(h);
      doc.setDrawColor(...rgb(RULE));
      doc.setLineWidth(0.6);
      doc.line(M, y, pageW - M, y);
      y += 15;
      font('bold', 7.5);
      color(INK_SOFT);
      doc.text(label, M, y, {charSpace: 0.6});
      font(strong ? 'bold' : 'normal', 10);
      color(INK);
      doc.text(text, M + labelW, y);
      y += h - 15;
    });
    doc.line(M, y, pageW - M, y);
    y += 18;
  };
  const writeup = (trait: string, value: number) => {
    const c = getShortWriteup(trait, getScoreLevel(value));
    if (c) return card(c);
    const lead = getInterpretation(trait, value)?.paragraphs.find(Boolean);
    if (!lead) return;
    const l = lines(lead, pageW - 2 * M, 10.5);
    need(l.length * 14 + 10);
    color(INK);
    doc.text(l, M, y);
    y += l.length * 14 + 12;
  };
  const scoreLine = (value: number, hex: string) => {
    font('normal', 10);
    color(INK_SOFT);
    doc.text(`${ordinal(value)} percentile · ${levelWord(value)}`, M, y);
    y += 8;
    bar(M, y, pageW - 2 * M, value, hex);
    y += 24;
  };

  /**
   * One aspect in a column: name, score bar, then its short write-up with each label above its text.
   * With draw = false it only measures. Returns the height used.
   */
  const aspectColumn = (a: string, value: number, hex: string, x: number, w: number, top: number, draw: boolean) => {
    let yy = top;
    const put = (text: string | string[], size: number, style: 'normal' | 'bold', ink: string, opts?: object) => {
      if (!draw) return;
      font(style, size);
      color(ink);
      doc.text(text, x, yy, opts);
    };
    put(a, 15, 'bold', INK);
    yy += 16;
    put(`${ordinal(value)} percentile · ${levelWord(value)}`, 10, 'normal', INK_SOFT);
    yy += 8;
    if (draw) bar(x, yy, w, value, hex);
    yy += 24;
    const c = getShortWriteup(a, getScoreLevel(value));
    if (!c) {
      const lead = lines(getInterpretation(a, value)?.paragraphs.find(Boolean) ?? '', w, 10);
      put(lead, 10, 'normal', INK);
      return yy + lead.length * 13 - top;
    }
    const head = lines(c.headline, w, 11.5, 'bold');
    put(head, 11.5, 'bold', INK);
    yy += head.length * 14 + 2;
    const rows: [string, string[], boolean][] = [
      ['YOUR GIFT', lines(c.gift, w, 9.5, 'bold'), true],
      ['SHOWS UP AS', c.showsUp.flatMap((s) => lines(`•  ${s}`, w, 9.5)), false],
      ['WATCH FOR', lines(c.watchFor, w, 9.5), false],
      ['TRY THIS', lines(c.tryThis, w, 9.5), false],
    ];
    rows.forEach(([label, text, strong]) => {
      if (draw) {
        doc.setDrawColor(...rgb(RULE));
        doc.setLineWidth(0.6);
        doc.line(x, yy, x + w, yy);
      }
      yy += 13;
      put(label, 7, 'bold', INK_SOFT, {charSpace: 0.6});
      yy += 12;
      put(text, 9.5, strong ? 'bold' : 'normal', INK);
      yy += text.length * 12.5 + 2;
    });
    return yy - top;
  };

  TRAITS.forEach((t) => {
    newPage();
    const hex = TEXT_COLOR[t.ocean] ?? INK;
    font('bold', 26);
    color(hex);
    doc.text(t.ocean, M, y);
    y += 20;
    scoreLine(p(t.ocean), t.color);
    const s = aspectSplit(t.ocean, p(t.aspects[0]), p(t.aspects[1]));
    if (s.split && s.card) {
      // A split trait gets the card written for its mix instead of the blended trait card.
      const hi = t.aspects[s.higher];
      const lo = t.aspects[1 - s.higher];
      const title = lines(s.name ?? '', pageW - 2 * M, 15, 'bold');
      need(60 + title.length * 18);
      doc.setDrawColor(...rgb(INK));
      doc.setLineWidth(2);
      doc.line(M, y, pageW - M, y);
      y += 18;
      font('bold', 7.5);
      color(INK_SOFT);
      doc.text(
        `YOUR MIX  ·  HIGHER ${hi.toUpperCase()} ${ordinal(p(hi))}, LOWER ${lo.toUpperCase()} ${ordinal(p(lo))}  ·  ${s.gap} POINTS APART`,
        M,
        y,
        {charSpace: 0.5},
      );
      y += 20;
      font('bold', 15);
      color(INK);
      doc.text(title, M, y);
      y += title.length * 18 + 4;
      card(s.card);
      font('normal', 9);
      color(INK_SOFT);
      const frame = lines(
        'A split isn’t a flaw. It is two real parts of you pulling different ways. Once you can name it, you can stop thinking something is wrong with you.',
        pageW - 2 * M,
        9,
      );
      need(frame.length * 12 + 10);
      doc.text(frame, M, y - 6);
      y += frame.length * 12 + 10;
    } else {
      writeup(t.ocean, p(t.ocean));
    }

    // The two aspects side by side, each as a stacked card.
    const gap = 24;
    const colW = (pageW - 2 * M - gap) / 2;
    const heights = t.aspects.map((a) => aspectColumn(a, p(a), t.color, M, colW, y, false));
    need(Math.max(...heights));
    const top = y;
    const ends = t.aspects.map((a, k) => aspectColumn(a, p(a), t.color, M + k * (colW + gap), colW, top, true));
    y = top + Math.max(...ends) + 10;
  });

  // ---------- close ----------
  need(110);
  y += 10;
  doc.setDrawColor(...rgb(INK));
  doc.setLineWidth(1.2);
  doc.line(M, y, pageW - M, y);
  y += 26;
  font('bold', 15);
  color(INK);
  doc.text('Know how you’re made. Live what you’re made for.', M, y);
  y += 18;
  font('normal', 10);
  color(INK_SOFT);
  doc.text('You are His workmanship, made for good works. (Ephesians 2:10)', M, y);
  y += 22;
  color(INK);
  doc.text(`Want to talk your results through? Book a results conversation: ${BOOKING_URL}`, M, y);

  // ---------- footers ----------
  const pages = doc.getNumberOfPages();
  for (let i = 1; i <= pages; i++) {
    doc.setPage(i);
    const w = i === 1 ? 792 : 612;
    const h = i === 1 ? 612 : 792;
    font('normal', 8);
    color(INK_SOFT);
    doc.text(`Personality+ by Patrick Knicely  ·  discoverpersonalityplus.com`, M, h - 30);
    doc.text(`${i} of ${pages}`, w - M, h - 30, {align: 'right'});
  }

  if (mode === 'open') {
    const url = String(doc.output('bloburl'));
    (window as any).__ppReportUrl = url;
    window.open(url, '_blank');
    return;
  }
  doc.save(reportFileName(name));
}
