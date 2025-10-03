import { Document } from '@contentful/rich-text-types'
import { documentToPlainTextString } from '@contentful/rich-text-plain-text-renderer'

/**
 * Safely extract plain text from Contentful rich text or return string as-is
 */
export function getPlainTextFromRichText(content: string | Document | undefined): string {
  if (!content) return ''

  if (typeof content === 'string') {
    return content
  }

  try {
    return documentToPlainTextString(content)
  } catch (error) {
    console.warn('Error parsing rich text content:', error)
    return 'Content not available'
  }
}

/**
 * Safely get asset URL from Contentful asset
 */
export function getAssetUrl(asset: any): string | undefined {
  return asset?.fields?.file?.url
}

/**
 * Safely get asset title from Contentful asset
 */
export function getAssetTitle(asset: any): string | undefined {
  return asset?.fields?.title
}