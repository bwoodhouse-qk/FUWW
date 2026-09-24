import { describe, expect, it } from 'vitest';
import { updatedSelection } from './update-selection.js';

describe('updatedSelection', () => {
  it.each([
    { before: ['Milk', 'Bread', 'Eggs'], after: ['Apples', 'Milk', 'Bread', 'Eggs'], selected: 1, expected: 2 },
    { before: ['Milk', 'Bread', 'Eggs'], after: ['Bread', 'Eggs'], selected: 1, expected: 0 },
    { before: ['Milk', 'Bread', 'Eggs'], after: ['Milk', 'Eggs'], selected: 1, expected: 1 },
    { before: ['Milk', 'Bread', 'Eggs'], after: ['Eggs'], selected: 1, expected: 0 },
    { before: ['Milk', 'Bread', 'Eggs'], after: ['Milk', 'Bread'], selected: 2, expected: 1 },
    { before: ['Milk', 'Bread', 'Eggs'], after: ['Milk', 'Wholemeal bread', 'Eggs'], selected: 1, expected: 1 },
    { before: ['Milk', 'Bread', 'Eggs'], after: ['Apples', 'Milk', 'Wholemeal bread', 'Eggs'], selected: 1, expected: 2 },
    { before: ['Milk', 'Milk', 'Eggs'], after: ['Apples', 'Milk', 'Milk', 'Eggs'], selected: 1, expected: 2 },
    { before: ['Milk', 'Bread'], after: ['Bread', 'Milk'], selected: 1, expected: 0 },
    { before: ['Milk'], after: [], selected: 0, expected: 0 },
    { before: [], after: ['Eggs'], selected: 0, expected: 0 },
  ])('preserves selection for $before → $after at $selected', ({ before, after, selected, expected }) => {
    expect(updatedSelection(before, after, selected)).toBe(expected);
  });
});
