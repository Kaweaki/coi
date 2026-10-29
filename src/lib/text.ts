/** Lowercase, strip Vietnamese diacritics, and flatten punctuation. */
export function normalize(input: string): string {
  return input
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/[^a-z0-9'\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

/** Title-case a single lowercase phrase, keeping Vietnamese letters intact. */
export function sentenceCase(input: string): string {
  if (!input) return input
  return input.charAt(0).toUpperCase() + input.slice(1)
}
