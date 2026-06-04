/**
 * Shuffles an array in-place using the Fisher-Yates algorithm.
 * Returns the shuffled array.
 */
export const shuffle = <T>(array: T[]): T[] => {
  let m = array.length;
  let t: T;
  let i: number;

  while (m) {
    i = Math.floor(Math.random() * m--);
    t = array[m];
    array[m] = array[i];
    array[i] = t;
  }

  return array;
};
