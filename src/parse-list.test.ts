import { describe, expect, it } from 'vitest';
import { parseList } from './parse-list.js';

describe('parseList', () => {
  it('parses one item per line in the original order', () => {
    expect(parseList('Milk\nBread\nApples')).toEqual(['Milk', 'Bread', 'Apples']);
  });

  it('trims surrounding whitespace and ignores empty lines', () => {
    expect(parseList('\n  Milk  \n \t\n\tBread\t\n')).toEqual(['Milk', 'Bread']);
  });

  it.each(['', ' \t\n\r\n '])('returns no items for blank input %j', (input) => {
    expect(parseList(input)).toEqual([]);
  });

  it('supports Windows, Unix, and carriage-return line endings', () => {
    expect(parseList('Milk\r\nBread\nApples\rEggs')).toEqual([
      'Milk', 'Bread', 'Apples', 'Eggs',
    ]);
  });

  it('preserves duplicates and wording within each line', () => {
    expect(parseList('Milk\nMilk\n2 x  oat milk, unsweetened\n- Apples')).toEqual([
      'Milk', 'Milk', '2 x  oat milk, unsweetened', '- Apples',
    ]);
  });

  it('keeps markup-like input as ordinary item text', () => {
    expect(parseList('<b>Milk</b>')).toEqual(['<b>Milk</b>']);
  });
});
