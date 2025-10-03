import { Document } from '@contentful/rich-text-types'
import { documentToPlainTextString } from '@contentful/rich-text-plain-text-renderer'

/**
 * Calculate estimated reading time for rich text content
 * @param content - Contentful rich text document
 * @param wordsPerMinute - Average reading speed (default: 200 words per minute)
 * @returns Reading time in minutes (rounded up to nearest minute)
 */
export function calculateReadingTime(content: Document, wordsPerMinute: number = 200): number {
  if (!content) return 0

  try {
    // Convert rich text to plain text
    const plainText = documentToPlainTextString(content)

    // Count words (split by whitespace and filter out empty strings)
    const wordCount = plainText
      .trim()
      .split(/\s+/)
      .filter(word => word.length > 0).length

    // Calculate reading time in minutes and round up
    const readingTimeMinutes = Math.ceil(wordCount / wordsPerMinute)

    // Ensure minimum of 1 minute
    return Math.max(1, readingTimeMinutes)
  } catch (error) {
    console.error('Error calculating reading time:', error)
    return 0
  }
}

/**
 * Calculate combined reading time for multiple rich text documents
 */
export function calculateCombinedReadingTime(
  contents: (Document | null | undefined)[],
  wordsPerMinute: number = 200
): number {
  const totalTime = contents
    .filter(Boolean)
    .reduce((total, content) => {
      return total + calculateReadingTime(content as Document, wordsPerMinute)
    }, 0)

  return Math.max(1, totalTime)
}