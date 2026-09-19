export interface Photo { url: string; alt: string; credit: { name: string; profileUrl: string; photoUrl: string } }
export interface ImageSource { find(query: string): Promise<Photo | null> }

const UTM = 'utm_source=arktik&utm_medium=referral'

export function createUnsplash(accessKey: string): ImageSource {
  const headers = { Authorization: `Client-ID ${accessKey}`, 'Accept-Version': 'v1' }
  return {
    async find(query) {
      const q = new URLSearchParams({ query, orientation: 'landscape', per_page: '1', content_filter: 'high' })
      const res = await fetch(`https://api.unsplash.com/search/photos?${q}`, { headers })
      if (!res.ok) throw new Error(`unsplash search ${res.status}`)
      const data = (await res.json()) as {
        results: {
          urls: { raw: string }
          links: { html: string; download_location: string }
          user: { name: string; links: { html: string } }
          alt_description?: string | null
          description?: string | null
        }[]
      }
      const p = data.results[0]
      if (!p) return null
      // API guideline: hit the download endpoint when the photo is used. The
      // photo itself is hotlinked, so a failure here must not lose the photo.
      try { await fetch(p.links.download_location, { headers }) } catch { /* best-effort per API terms */ }
      return {
        // Hotlinked from the Unsplash CDN, as the API terms require.
        url: `${p.urls.raw}&w=1920&q=80&fm=jpg&fit=max`,
        alt: p.alt_description || p.description || query,
        credit: { name: p.user.name, profileUrl: `${p.user.links.html}?${UTM}`, photoUrl: `${p.links.html}?${UTM}` },
      }
    },
  }
}
