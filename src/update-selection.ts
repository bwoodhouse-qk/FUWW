// Textarea lines have no IDs. Match unchanged text first, then align edits to
// distinguish a renamed line from a deleted one. Equal duplicates match in order.
export function updatedSelection(before: string[], after: string[], selected: number): number {
  if (!after.length || !before.length) return 0;
  const occurrence = before.slice(0, selected + 1).filter((item) => item === before[selected]).length;
  const matches = after.flatMap((item, index) => item === before[selected] ? [index] : []);
  if (matches.length) return matches[Math.min(occurrence, matches.length) - 1];

  // Minimum number of line insertions, deletions, and replacements for each suffix.
  const costs = Array.from({ length: before.length + 1 }, () => Array<number>(after.length + 1).fill(0));
  for (let i = before.length; i >= 0; i--) {
    for (let j = after.length; j >= 0; j--) {
      if (i === before.length) costs[i][j] = after.length - j;
      else if (j === after.length) costs[i][j] = before.length - i;
      else costs[i][j] = before[i] === after[j] ? costs[i + 1][j + 1]
        : 1 + Math.min(costs[i + 1][j], costs[i][j + 1], costs[i + 1][j + 1]);
    }
  }

  let i = 0;
  let j = 0;
  while (i < before.length && j < after.length) {
    const unchanged = before[i] === after[j];
    // Prefer deletion/insertion over replacement on ties to retain neighbouring items.
    if (!unchanged && costs[i][j] === 1 + costs[i + 1][j]) {
      if (i === selected) return j;
      i++;
    } else if (!unchanged && costs[i][j] === 1 + costs[i][j + 1]) {
      j++;
    } else {
      if (i === selected) return j;
      i++;
      j++;
    }
  }
  return after.length - 1;
}
