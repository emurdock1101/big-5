import {Aspect, Ocean} from '../constants/schema';
import {TRAITS} from './traits';

/**
 * The personality tree: the person at the root, then the two higher-order factors
 * (DeYoung's Stability and Plasticity), then the five traits, then the ten aspects.
 * Circle area follows the percentile, so people can see how each part weighs in the whole.
 * The ring around the name and the two factor rings are split by score, so the colors
 * show how the person leans.
 *
 * One layout feeds two renderers: the SVG on the results page and a canvas drawing
 * for the PDF report.
 */

/** Plain-language names for the two higher-order factors. Change here to rename everywhere. */
export const FACTOR_NAME = {
  stability: 'Stability',
  /** Research name: Plasticity. */
  plasticity: 'Curiosity',
};

const INK = '#15172b';
const INK_SOFT = '#4a4c60';
const RULE = '#b8bbc2';

export const TREE_W = 1380;
export const TREE_H = 870;

export type NodeKind = 'root' | 'factor' | 'trait' | 'aspect';

export interface TreeNode {
  id: string;
  kind: NodeKind;
  /** Label lines shown under the circle (or inside it for the root). */
  lines: string[];
  /** Percentile 0–100; undefined for the root. */
  value?: number;
  x: number;
  y: number;
  r: number;
  /** Largest radius this level can have; labels line up under it. */
  rMax: number;
  /** One color = solid circle; several = a ring split into slices. */
  colors: string[];
  /** How big each slice is (same order as colors). */
  weights?: number[];
  parent?: string;
}

const LABEL_LINES: Record<string, string[]> = {
  [Aspect.Interest]: ['Interest', 'in Ideas'],
  [Aspect.AestheticOpenness]: ['Aesthetic', 'Openness'],
};

const color = (o: Ocean) => TRAITS.find((t) => t.ocean === o)!.color;
const aspectsOf = (o: Ocean) => TRAITS.find((t) => t.ocean === o)!.aspects;

/** Circle radius whose area follows the percentile, with a floor so tiny scores stay visible. */
const radius = (p: number, rMax: number) => rMax * Math.sqrt(Math.max(3, Math.min(100, p)) / 100);

/** Stability = Agreeableness, Conscientiousness and low Neuroticism; Plasticity = Extraversion and Openness. */
export function factorScores(p: (k: string) => number) {
  return {
    stability: Math.round((p(Ocean.Agreeableness) + p(Ocean.Conscientiousness) + (100 - p(Ocean.Neuroticism))) / 3),
    plasticity: Math.round((p(Ocean.Extraversion) + p(Ocean.Openness)) / 2),
  };
}

export const FACTOR_TRAITS: Record<'stability' | 'plasticity', Ocean[]> = {
  stability: [Ocean.Neuroticism, Ocean.Agreeableness, Ocean.Conscientiousness],
  plasticity: [Ocean.Extraversion, Ocean.Openness],
};

export function treeLayout(percentiles: Record<string, number>, name?: string): TreeNode[] {
  const p = (k: string) => percentiles[k] ?? 0;
  const f = factorScores(p);
  const nodes: TreeNode[] = [];

  const Y = {root: 90, factor: 300, trait: 530, aspect: 745};
  const R = {root: 80, factor: 68, trait: 50, aspect: 42};
  // Aspects sit in pairs: closer within a trait, wider between traits, widest between the two factors.
  const WITHIN = 122;
  const BETWEEN = 146;
  const FACTOR_GAP = 40;
  const leafX = (i: number) => 73 + Math.ceil(i / 2) * WITHIN + Math.floor(i / 2) * BETWEEN + (i >= 6 ? FACTOR_GAP : 0);

  nodes.push({
    id: 'root',
    kind: 'root',
    lines: [name && name.trim() && name !== 'name_unknown' ? name.trim() : 'You'],
    x: TREE_W / 2,
    y: Y.root,
    r: R.root,
    rMax: R.root,
    colors: TRAITS.map((t) => t.color),
    weights: TRAITS.map((t) => p(t.ocean)),
  });

  let leaf = 0;
  (['stability', 'plasticity'] as const).forEach((fk) => {
    const traits = FACTOR_TRAITS[fk];
    const first = leaf;
    traits.forEach((o) => {
      const aspects = aspectsOf(o);
      const a0 = leaf;
      aspects.forEach((a) => {
        nodes.push({
          id: a,
          kind: 'aspect',
          lines: LABEL_LINES[a] ?? [a],
          value: p(a),
          x: leafX(leaf),
          y: Y.aspect,
          r: radius(p(a), R.aspect),
          rMax: R.aspect,
          colors: [color(o)],
          parent: o,
        });
        leaf++;
      });
      nodes.push({
        id: o,
        kind: 'trait',
        lines: [o],
        value: p(o),
        x: (leafX(a0) + leafX(a0 + 1)) / 2,
        y: Y.trait,
        r: radius(p(o), R.trait),
        rMax: R.trait,
        colors: [color(o)],
        parent: fk,
      });
    });
    nodes.push({
      id: fk,
      kind: 'factor',
      lines: [FACTOR_NAME[fk]],
      value: f[fk],
      x: (leafX(first) + leafX(leaf - 1)) / 2,
      y: Y.factor,
      r: radius(f[fk], R.factor),
      rMax: R.factor,
      colors: traits.map(color),
      // Stability counts low Neuroticism, so its purple slice is 100 minus the Neuroticism score.
      weights: traits.map((o) => (o === Ocean.Neuroticism ? 100 - p(o) : p(o))),
      parent: 'root',
    });
  });

  return nodes;
}

/** Text sizes (in tree units) and where each label line sits. */
export const LABEL = {
  size: {factor: 26, trait: 21, aspect: 16},
  pctSize: {factor: 20, trait: 17, aspect: 15},
  lineGap: {factor: 28, trait: 24, aspect: 19},
};

export interface LabelLine {
  text: string;
  y: number;
  size: number;
  weight: number;
  soft?: boolean;
}

export function labelLines(n: TreeNode): LabelLine[] {
  if (n.kind === 'root') return [];
  const k = n.kind;
  const top = n.y + n.rMax + 26;
  return n.lines.map((text, i) => ({text, y: top + i * LABEL.lineGap[k], size: LABEL.size[k], weight: 750}));
}

export interface Slice {
  color: string;
  a0: number;
  a1: number;
}

/** Ring slices, sized by weight, starting at 12 o'clock. A small floor keeps every color visible. */
export function slicesOf(n: TreeNode): Slice[] {
  const w = (n.weights ?? n.colors.map(() => 1)).map((v) => Math.max(4, v));
  const total = w.reduce((a, b) => a + b, 0);
  let a = -Math.PI / 2;
  return n.colors.map((c, i) => {
    const a0 = a;
    a += (w[i] / total) * Math.PI * 2;
    return {color: c, a0, a1: a};
  });
}

/** Inner radius of a ring (root and factors); trait and aspect circles are solid. */
export const innerRadius = (n: TreeNode) => (n.kind === 'root' ? n.r - 16 : n.kind === 'factor' ? n.r * 0.6 : 0);

const luminance = (hex: string) => {
  const v = parseInt(hex.slice(1), 16);
  const ch = [(v >> 16) & 255, (v >> 8) & 255, v & 255].map((c) => {
    const x = c / 255;
    return x <= 0.03928 ? x / 12.92 : ((x + 0.04) / 1.055) ** 2.4;
  });
  return 0.2126 * ch[0] + 0.7152 * ch[1] + 0.0722 * ch[2];
};

export interface Score {
  text: string;
  x: number;
  y: number;
  size: number;
  fill: string;
}

/**
 * Where a node's percentile is written: inside the circle (or ring hole) when it fits,
 * otherwise just under a very small circle.
 */
export function scoreText(n: TreeNode): Score | null {
  if (n.kind === 'root' || n.value === undefined) return null;
  const text = ordinal(n.value);
  const room = n.kind === 'factor' ? innerRadius(n) : n.r;
  const size = Math.min(n.kind === 'factor' ? 22 : 20, Math.max(12, room * 0.62));
  const width = text.length * size * 0.58;
  if (width <= room * 1.75) {
    const fill =
      n.kind === 'factor' ? INK : luminance(n.colors[0]) > 0.4 ? INK : '#ffffff';
    return {text, x: n.x, y: n.y, size, fill};
  }
  return {text, x: n.x, y: n.y + n.r + 15, size: 13, fill: INK_SOFT};
}

/** The connector from a parent to a child: down, across, down. */
export function edgePath(parent: TreeNode, child: TreeNode): [number, number][] {
  const lines = labelLines(parent);
  const startY = parent.kind === 'root' ? parent.y + parent.r + 10 : (lines[lines.length - 1]?.y ?? parent.y) + 12;
  const endY = child.y - child.r - 6;
  const midY = (startY + child.y - child.rMax) / 2;
  return [
    [parent.x, startY],
    [parent.x, midY],
    [child.x, midY],
    [child.x, endY],
  ];
}

export function ordinal(n: number) {
  const v = Math.round(n);
  const s = v % 100 >= 11 && v % 100 <= 13 ? 'th' : ['th', 'st', 'nd', 'rd'][v % 10] || 'th';
  return `${v}${s}`;
}

/** Root label font size that fits the name inside the inner disc. */
export function rootFontSize(name: string, measure: (size: number) => number, maxWidth = 118): number {
  let size = 30;
  while (size > 12 && measure(size) > maxWidth) size -= 1;
  return size;
}

/** Draw the tree on a canvas (for the PDF). `scale` maps tree units to canvas pixels. */
export function drawTree(ctx: CanvasRenderingContext2D, nodes: TreeNode[], scale: number) {
  const byId = Object.fromEntries(nodes.map((n) => [n.id, n]));
  ctx.save();
  ctx.scale(scale, scale);
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, TREE_W, TREE_H);

  // connectors
  ctx.strokeStyle = RULE;
  ctx.lineWidth = 2.5;
  ctx.lineJoin = 'round';
  nodes.forEach((n) => {
    if (!n.parent) return;
    const pts = edgePath(byId[n.parent], n);
    ctx.beginPath();
    pts.forEach(([x, y], i) => (i ? ctx.lineTo(x, y) : ctx.moveTo(x, y)));
    ctx.stroke();
  });

  nodes.forEach((n) => {
    if (n.colors.length === 1) {
      ctx.fillStyle = n.colors[0];
      ctx.beginPath();
      ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
      ctx.fill();
    } else {
      slicesOf(n).forEach((sl) => {
        ctx.fillStyle = sl.color;
        ctx.beginPath();
        ctx.moveTo(n.x, n.y);
        ctx.arc(n.x, n.y, n.r, sl.a0, sl.a1);
        ctx.closePath();
        ctx.fill();
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2.5;
        ctx.stroke();
      });
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(n.x, n.y, innerRadius(n), 0, Math.PI * 2);
      ctx.fill();
    }
    const sc = scoreText(n);
    if (sc) {
      ctx.font = `800 ${sc.size}px Archivo, sans-serif`;
      ctx.fillStyle = sc.fill;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(sc.text, sc.x, sc.y + 1);
    }
    if (n.kind === 'root') {
      const name = n.lines[0];
      const size = rootFontSize(name, (s) => {
        ctx.font = `850 ${s}px Archivo, sans-serif`;
        return ctx.measureText(name).width;
      });
      ctx.font = `850 ${size}px Archivo, sans-serif`;
      ctx.fillStyle = INK;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(name, n.x, n.y + 1);
    }
    ctx.textAlign = 'center';
    ctx.textBaseline = 'alphabetic';
    labelLines(n).forEach((l) => {
      ctx.font = `${l.weight} ${l.size}px Archivo, sans-serif`;
      ctx.fillStyle = INK;
      ctx.fillText(l.text, n.x, l.y);
    });
  });
  ctx.restore();
}

/** Render the tree to a PNG data URL (white background) for the PDF. */
export async function treePng(percentiles: Record<string, number>, name?: string, scale = 2.4): Promise<string | null> {
  try {
    if (document.fonts) {
      await Promise.all([
        document.fonts.load('850 24px Archivo'),
        document.fonts.load('750 20px Archivo'),
        document.fonts.load('800 16px Archivo'),
      ]);
    }
    const c = document.createElement('canvas');
    c.width = Math.round(TREE_W * scale);
    c.height = Math.round(TREE_H * scale);
    const ctx = c.getContext('2d');
    if (!ctx) return null;
    drawTree(ctx, treeLayout(percentiles, name), scale);
    return c.toDataURL('image/png');
  } catch {
    return null;
  }
}
