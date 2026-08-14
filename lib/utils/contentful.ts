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
 * Contentful returns protocol-relative asset URLs (`//images.ctfassets.net/…`).
 * `next/image` rejects those outright, so every URL handed to <Image> must go
 * through here first. Returns undefined when there's no URL, so callers can
 * fall back to a token-built surface instead of a broken image.
 */
export function toAbsoluteUrl(url: string): string {
  if (url.startsWith('//')) return `https:${url}`
  if (url.startsWith('http://')) return url.replace('http://', 'https://')
  return url
}

export function getImageUrl(asset: any): string | undefined {
  const url = getAssetUrl(asset)
  return url ? toAbsoluteUrl(url) : undefined
}

/**
 * Safely get asset title from Contentful asset
 */
export function getAssetTitle(asset: any): string | undefined {
  return asset?.fields?.title
}