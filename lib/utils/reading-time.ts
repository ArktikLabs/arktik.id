/* Plain-text view of a Markdown string. Good enough for word counts and
 * meta descriptions; not a parser. */
export function markdownToText(md: string | null | undefined): string {
  if (!md) return ''
  return md
    .replace(/!\[[^\]]*\]\([^)]*\)/g, '') // images
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1') // links -> text
    .replace(/^\s*(#{1,6}|>|[-*+]|\d+\.)\s+/gm, '') // headings, quotes, bullets
    .replace(/^\s*-{3,}\s*$/gm, '') // rules
    .replace(/(\*\*|\*|`|\b_+|_+\b)/g, '') // emphasis and code marks
    .replace(/\s+/g, ' ')
    .trim()
}

export function calculateReadingTime(content: string | null | undefined, wordsPerMinute = 200): number {
  const words = markdownToText(content).split(' ').filter(Boolean).length
  if (words === 0) return 0
  return Math.max(1, Math.ceil(words / wordsPerMinute))
}

export function calculateCombinedReadingTime(
  contents: (string | null | undefined)[],
  wordsPerMinute = 200,
): number {
  const total = contents.reduce((sum, c) => sum + calculateReadingTime(c, wordsPerMinute), 0)
  return Math.max(1, total)
}
