import Anthropic from '@anthropic-ai/sdk'
import matter from 'gray-matter'
import type { Row } from './planner.ts'

export interface Brief {
  title: string; slug: string; thesis: string; searchIntent: string
  outline: { h2: string; point: string }[]
  claims: { claim: string; backing: string }[]
  cta: { framing: string; missingAsset: boolean }
  internalLinks: { slug: string; type: 'pillar' | 'regular'; why: string }[]
  unsplashQuery: string
}
export interface Article { frontmatter: Record<string, unknown>; body: string }
export interface WriterContext {
  row: Row; productContext: string; honestCopyRule: string; copyNotes: string
  exemplars: { en: string[]; id: string[] }
  published: { slug: string; title: string; type: 'pillar' | 'regular' }[]
  usedSlugs: string[]
}
export interface Writer {
  brief(ctx: WriterContext): Promise<Brief>
  write(ctx: WriterContext, brief: Brief, locale: 'en' | 'id', english?: Article): Promise<Article>
  edit(ctx: WriterContext, brief: Brief, locale: 'en' | 'id', draft: Article, english?: Article): Promise<Article>
}

const MODEL = 'claude-opus-5'

const BRIEF_SCHEMA = {
  type: 'object',
  additionalProperties: false,
  required: ['title', 'slug', 'thesis', 'searchIntent', 'outline', 'claims', 'cta', 'internalLinks', 'unsplashQuery'],
  properties: {
    title: { type: 'string' },
    slug: { type: 'string' },
    thesis: { type: 'string' },
    searchIntent: { type: 'string' },
    outline: { type: 'array', items: { type: 'object', additionalProperties: false, required: ['h2', 'point'], properties: { h2: { type: 'string' }, point: { type: 'string' } } } },
    claims: { type: 'array', items: { type: 'object', additionalProperties: false, required: ['claim', 'backing'], properties: { claim: { type: 'string' }, backing: { type: 'string' } } } },
    cta: { type: 'object', additionalProperties: false, required: ['framing', 'missingAsset'], properties: { framing: { type: 'string' }, missingAsset: { type: 'boolean' } } },
    internalLinks: { type: 'array', items: { type: 'object', additionalProperties: false, required: ['slug', 'type', 'why'], properties: { slug: { type: 'string' }, type: { type: 'string', enum: ['pillar', 'regular'] }, why: { type: 'string' } } } },
    unsplashQuery: { type: 'string' },
  },
} as const

const REQUIRED_KEYS = { regular: ['title', 'excerpt', 'seoTitle', 'seoDescription', 'ctaTitle', 'ctaDescription', 'tags'], pillar: ['title', 'introduction', 'seoTitle', 'seoDescription', 'ctaTitle', 'ctaDescription'] }

const MAX_TAGS = 5
const LIMITS: Record<string, number> = { excerpt: 160, seoTitle: 60, seoDescription: 155 }

/* The prompts state these limits, but the model is the one obeying them, so
 * they are enforced here too: the loader and the SEO tags have no room to
 * negotiate. Pure, so a test can call it without a model. */
export function clampFrontmatter(data: Record<string, unknown>, type: 'pillar' | 'regular'): Record<string, unknown> {
  const out = { ...data }
  if (type === 'regular' && Array.isArray(out.tags) && out.tags.length > MAX_TAGS) out.tags = out.tags.slice(0, MAX_TAGS)
  for (const [key, limit] of Object.entries(LIMITS)) {
    const value = out[key]
    if (typeof value !== 'string' || value.length <= limit) continue
    const cut = value.slice(0, limit)
    const space = cut.lastIndexOf(' ')
    out[key] = (space > 0 ? cut.slice(0, space) : cut).trimEnd()
    console.warn(`truncated ${key} to ${limit}`)
  }
  return out
}

export function parseArticle(text: string, type: 'pillar' | 'regular' = 'regular'): Article {
  const cleaned = text.trim().replace(/^```[a-z]*\s*\n/i, '').replace(/\n```\s*$/, '')
  const { data, content } = matter(cleaned)
  for (const k of REQUIRED_KEYS[type]) if (data[k] === undefined || data[k] === '') throw new Error(`article missing frontmatter "${k}"`)
  if (!content.trim()) throw new Error('article body is empty')
  return { frontmatter: clampFrontmatter(data, type), body: content.trim() + '\n' }
}

function structure(type: 'pillar' | 'regular', linkLines: string): string {
  const frontmatterRule = type === 'pillar'
    ? 'introduction: one paragraph of 60 to 120 words, plain text; seoTitle under 60; seoDescription under 155; no excerpt, no tags.'
    : 'excerpt under 160 characters, seoTitle under 60, seoDescription under 155, tags: 3 to 5 short phrases.'
  return `Structure rules:
- Do not repeat the title in the body. Open with one or two short paragraphs that answer the search intent directly, then use the outline's H2 headings in order.
- Use exactly the outline's H2 headings, in order.
- Link to each listed internal link exactly once, using the href given. Never invent other links.
${linkLines}
- Close with a CTA section that follows the brief's CTA framing; fill ctaTitle and ctaDescription in frontmatter with the same intent.
- ${frontmatterRule}
- Make only the claims in the brief's claims list. No statistics, client names, or outcomes that are not in that list.
- Quote every frontmatter string value with single quotes (escape an inner single quote by doubling it).
- Output one Markdown document: YAML frontmatter between --- lines, then the body. No code fences, no commentary.`
}

export function linkHrefs(ctx: WriterContext, brief: Brief, locale: 'en' | 'id'): { slug: string; type: 'pillar' | 'regular'; why: string; href: string }[] {
  return brief.internalLinks.map((l) => ({
    ...l,
    href: `${locale === 'en' ? '/en' : ''}/blog/${ctx.row.category}/${l.type === 'pillar' ? 'guides/' : ''}${l.slug}/`,
  }))
}

function frontmatterKeys(type: 'pillar' | 'regular') {
  return type === 'pillar'
    ? 'title, introduction (one paragraph, plain text), seoTitle, seoDescription, ctaTitle, ctaDescription'
    : 'title, excerpt, seoTitle, seoDescription, ctaTitle, ctaDescription, tags (YAML list)'
}

function system(ctx: WriterContext, extra: string): Anthropic.TextBlockParam[] {
  return [
    { type: 'text', text: `You write for Arktik, a software house. Product and audience context follows.\n\n${ctx.productContext}\n\n${ctx.honestCopyRule}\n\n${ctx.copyNotes}`, cache_control: { type: 'ephemeral' } },
    { type: 'text', text: extra },
  ]
}

/* Called only from the `id` branches, so it never asserts anything about an
 * English call, where `english` is legitimately undefined. */
function requireEnglish(locale: 'en' | 'id', english: Article | undefined): asserts english is Article {
  if (locale === 'id' && !english) throw new Error('Indonesian call requires the English article')
}

async function text(client: Anthropic, params: Omit<Anthropic.MessageCreateParamsStreaming, 'stream'>): Promise<string> {
  const msg = await client.messages.stream({ ...params, stream: true }).finalMessage()
  if (msg.stop_reason === 'refusal') throw new Error(`model refused: ${msg.stop_details?.explanation ?? 'no explanation'}`)
  if (msg.stop_reason === 'max_tokens') throw new Error('model hit max_tokens')
  return msg.content.filter((b): b is Anthropic.TextBlock => b.type === 'text').map((b) => b.text).join('')
}

export function createWriter(): Writer {
  const client = new Anthropic()
  const base = { model: MODEL, max_tokens: 64000, thinking: { type: 'adaptive' as const }, output_config: { effort: 'high' as const } }

  return {
    async brief(ctx) {
      const published = ctx.published.map((p) => `- ${p.type} "${p.title}" slug=${p.slug}`).join('\n') || '- none yet'
      const prompt = `Plan an article. Return JSON only.

Row: type=${ctx.row.type}, category=${ctx.row.category}, working title="${ctx.row.title}", goal="${ctx.row.goal}".
${ctx.row.facts ? `Client facts supplied by the founders (the only source for case-study claims):\n${ctx.row.facts}\n` : ''}
Published in this category (choose internalLinks from these only; prefer the pillar plus the closest post):
${published}

Slugs already used (do not reuse): ${ctx.usedSlugs.join(', ')}

Rules:
- claims: 3 to 5. Each backing must quote or name the section of the product context (or a line of the client facts) that supports it. If nothing supports a claim, leave it out.
- cta.missingAsset is true when the goal names a download, checklist, template, ebook, or demo that does not exist. Then framing must fall back to an invitation to talk.
- unsplashQuery: two concrete nouns describing a scene, not the topic.
- outline: 3 to 8 H2 sections. Language-neutral; both an English and an Indonesian article will follow it.`
      const raw = await text(client, { ...base, max_tokens: 16000, system: system(ctx, 'You are a content strategist producing a brief.'), messages: [{ role: 'user', content: prompt }], output_config: { effort: 'high', format: { type: 'json_schema', schema: BRIEF_SCHEMA } } })
      const brief = JSON.parse(raw) as Brief
      if (!/^[a-z0-9][a-z0-9-]{3,80}$/.test(brief.slug)) throw new Error(`brief slug invalid: ${brief.slug}`)
      if (ctx.usedSlugs.includes(brief.slug)) throw new Error(`brief reused slug ${brief.slug}`)
      const knownByType = new Map(ctx.published.map((p) => [p.slug, p.type]))
      brief.internalLinks = brief.internalLinks
        .filter((l) => knownByType.has(l.slug))
        .map((l) => ({ ...l, type: knownByType.get(l.slug)! }))
      return brief
    },

    async write(ctx, brief, locale, english) {
      const exemplars = ctx.exemplars[locale].map((e, i) => `<exemplar n="${i + 1}">\n${e}\n</exemplar>`).join('\n\n')
      let audience = 'Audience: an English-reading decision maker at a small or mid-sized company, international or Indonesia-based. Examples and references may be global.'
      if (locale === 'id') {
        requireEnglish(locale, english)
        audience = `Audience: pemilik atau pengambil keputusan UKM di Indonesia. This is an original Indonesian article, not a translation. Keep the argument, structure, and claims of the English version, but write for this reader: local examples, institutions, currency (rupiah), and idioms where they fit; the formal register of the exemplars; no sentence-by-sentence rendering of the English.\n\nEnglish version for reference:\n<english>\n${english.body}\n</english>`
      }
      const links = linkHrefs(ctx, brief, locale)
      const linkLines = links.map((l) => `- Link "${l.why}": href=${l.href}`).join('\n')
      const prompt = `Write the ${locale === 'en' ? 'English' : 'Indonesian'} ${ctx.row.type === 'pillar' ? 'guide' : 'article'}.

Brief:
${JSON.stringify(brief, null, 2)}

${audience}

Frontmatter keys required: ${frontmatterKeys(ctx.row.type)}. Use the brief's title (translated with intent, not literally, for Indonesian).

${structure(ctx.row.type, linkLines)}

Match the voice, length, and formatting of these published exemplars:
${exemplars}`
      const raw = await text(client, { ...base, system: system(ctx, 'You are a senior content writer.'), messages: [{ role: 'user', content: prompt }] })
      return parseArticle(raw, ctx.row.type)
    },

    async edit(ctx, brief, locale, draft, english) {
      let comparison = ''
      if (locale === 'id') {
        requireEnglish(locale, english)
        comparison = `6. Compare with the English version: same claims, same sections. Do not make the Indonesian more literal; it must read as native Indonesian in the formal register.\n\n<english>\n${english.body}\n</english>`
      }
      const draftText = matter.stringify(draft.body, draft.frontmatter)
      const links = linkHrefs(ctx, brief, locale)
      const linkLines = links.map((l) => `- Link "${l.why}": href=${l.href}`).join('\n')
      const prompt = `Edit this ${locale === 'en' ? 'English' : 'Indonesian'} draft and return the corrected document in the same format.

Checks, in order:
1. Every factual claim must trace to the brief's claims list. Remove or rephrase anything else. No numbers or names that are not in the list.
2. Cut filler, hedges, and repetition. Keep the exemplar voice. Do not shorten below roughly 80% of the draft.
3. Headings must equal the brief's outline H2s, in order.
4. Frontmatter: excerpt/introduction present; seoTitle under 60 chars; seoDescription under 155 chars; ctaTitle and ctaDescription match the CTA framing.
5. Internal links: only the hrefs listed below, verbatim.
${comparison}

Brief:
${JSON.stringify(brief, null, 2)}

Draft:
${draftText}

${structure(ctx.row.type, linkLines)}`
      const raw = await text(client, { ...base, system: system(ctx, 'You are a copy editor.'), messages: [{ role: 'user', content: prompt }] })
      return parseArticle(raw, ctx.row.type)
    },
  }
}
