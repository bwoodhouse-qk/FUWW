export function parseList(input: string): string[] {
  return input
    .split(/\r\n|\n|\r/)
    .map((line) => line.trim())
    .filter((line) => line.length > 0);
}
