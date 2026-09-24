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
  notesUsed: string[]
  notesUnused: string[]
}
export interface Article { frontmatter: Record<string, unknown>; body: string }
export interface WriterContext {
  row: Row; productContext: string; honestCopyRule: string; copyNotes: string; notes: string; judgePrompt: string
  /* scripts/prompts/voice-id.md: Indonesian register, sentence length, banned calques. */
  voiceId?: string
  exemplars: { en: string[]; id: string[] }
  published: { slug: string; title: string; type: 'pillar' | 'regular' }[]
  usedSlugs: string[]
  research?: Research
  log?: (s: string) => void
}
/* `bahasa` is the Indonesian language seat; it is scored only on Indonesian articles. */
export interface Verdict { scores: { owner: number; ops: number; developer: number; voice: number; bahasa?: number }; critiques: { persona: string; sentence: string; problem: string; fix: string }[] }
export interface Research { text: string; urls: string[] }
export interface Writer {
  brief(ctx: WriterContext): Promise<Brief>
  /* Indonesian is written first, from the brief alone. English is written from
   * the finished Indonesian article, passed as `reference`. */
  write(ctx: WriterContext, brief: Brief, locale: 'en' | 'id', reference?: Article): Promise<Article>
  edit(ctx: WriterContext, brief: Brief, locale: 'en' | 'id', draft: Article, reference?: Article, notes?: string): Promise<Article>
  judge(ctx: WriterContext, brief: Brief, locale: 'en' | 'id', article: Article): Promise<Verdict>
  research(ctx: WriterContext): Promise<Research>
}

const MODEL = 'claude-opus-5'

/* Four seats at three critiques each. A longer list is the judge ignoring its
 * own cap, and every extra line is another instruction the editor must obey. */
const MAX_CRITIQUES = 12
const MAX_CRITIQUES_ID = 15  // five seats on Indonesian articles

const BRIEF_SCHEMA = {
  type: 'object',
  additionalProperties: false,
  required: ['title', 'slug', 'thesis', 'searchIntent', 'outline', 'claims', 'cta', 'internalLinks', 'unsplashQuery', 'notesUsed', 'notesUnused'],
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
    notesUsed: { type: 'array', items: { type: 'string' } },
    notesUnused: { type: 'array', items: { type: 'string' } },
  },
} as const

const SEATS = ['owner', 'ops', 'developer', 'voice'] as const
const verdictSchema = (seats: readonly string[]) => ({
  type: 'object',
  additionalProperties: false,
  required: ['scores', 'critiques'],
  properties: {
    scores: { type: 'object', additionalProperties: false, required: [...seats], properties: Object.fromEntries(seats.map((k) => [k, { type: 'integer' }])) },
    critiques: { type: 'array', items: { type: 'object', additionalProperties: false, required: ['persona', 'sentence', 'problem', 'fix'], properties: { persona: { type: 'string' }, sentence: { type: 'string' }, problem: { type: 'string' }, fix: { type: 'string' } } } },
  },
})

const seatScores = (v: Verdict) => Object.values(v.scores).filter((s): s is number => typeof s === 'number')
export const meanScore = (v: Verdict) => { const s = seatScores(v); return s.reduce((a, b) => a + b, 0) / s.length }
/* Revise only when a seat is genuinely unhappy. The mean-of-8 rule triggered
 * revisions that cost about 45 cents and moved no score in the first live run. */
export const passes = (v: Verdict) => seatScores(v).every((s) => s >= 7)
export const critiqueNotes = (v: Verdict) => v.critiques.map((c) => `- [${c.persona}] "${c.sentence}": ${c.problem}. Fix: ${c.fix}`).join('\n')

export const URL_RE = /https?:\/\/[^\s)\]}"']+/g

/* A backing is prose, so the URL can sit anywhere in it ("BPS 2025 survey
 * (https://...)"). Scan the whole string rather than testing its prefix. */
export function urlsIn(text: string): string[] {
  return text.match(URL_RE) ?? []
}

/* Trailing slash, a leading www., and the query string are the only
 * normalizations; anything else must match what research actually returned. */
export function normUrl(u: string): string {
  return u.replace(/\?.*$/, '').replace(/^(https?:\/\/)www\./, '$1').replace(/\/$/, '')
}

/* A claim citing a URL research never retrieved is worse than no citation at
 * all, so it is dropped rather than trusted. One bad URL in a backing drops
 * the claim: the rest of the backing cannot be trusted either. */
export function citationsAllowed(brief: Brief, urls: string[], log: (s: string) => void): Brief {
  const allowed = new Set(urls.map(normUrl))
  const claims = brief.claims.filter((c) => {
    const found = urlsIn(c.backing)
    if (found.length === 0) return true
    if (found.every((u) => allowed.has(normUrl(u)))) return true
    log(`dropped uncited claim: ${c.claim} (${c.backing})`)
    return false
  })
  return { ...brief, claims }
}

/* The brief's claims list is enforced before writing, but the writer can still
 * put a URL in the body that no claim carried. Internal links are relative, so
 * they never match URL_RE and are left alone. */
export function stripUncitedLinks(body: string, allowed: string[]): { body: string; stripped: string[] } {
  const allow = new Set(allowed.map(normUrl))
  const stripped: string[] = []
  let out = body
  for (const url of new Set(urlsIn(body))) {
    if (allow.has(normUrl(url))) continue
    stripped.push(url)
    const escaped = url.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    out = out.replace(new RegExp(`\\[([^\\]]*)\\]\\(\\s*${escaped}\\s*\\)`, 'g'), '$1')
    out = out.split(url).join('')
  }
  return { body: out, stripped }
}

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

function structure(type: 'pillar' | 'regular', linkLines: string, hasSources: boolean): string {
  const frontmatterRule = type === 'pillar'
    ? 'introduction: one paragraph of 60 to 120 words, plain text; seoTitle under 60; seoDescription under 155; no excerpt, no tags.'
    : 'excerpt under 160 characters, seoTitle under 60, seoDescription under 155, tags: 3 to 5 short phrases.'
  const sourcesRule = hasSources
    ? '\n- If any claim\'s backing is a URL, end the article with a "## Sources" section (Indonesian: "## Sumber") listing each cited URL once as a plain Markdown link with the publisher as text, and cite inline with the same link where the claim appears.'
    : ''
  return `Structure rules:
- Do not repeat the title in the body. Open with one or two short paragraphs that answer the search intent directly, then use the outline's H2 headings in order.
- Use exactly the outline's H2 headings, in order.
- Link to each listed internal link exactly once, using the href given. Never invent other links.
${linkLines}
- Close with a CTA section that follows the brief's CTA framing; fill ctaTitle and ctaDescription in frontmatter with the same intent.
- ${frontmatterRule}
- Make only the claims in the brief's claims list. No statistics, client names, or outcomes that are not in that list.
- Quote every frontmatter string value with single quotes (escape an inner single quote by doubling it).${sourcesRule}
- Output one Markdown document: YAML frontmatter between --- lines, then the body. No code fences, no commentary.`
}

/* Measurable AI-writing tells. Density per 1000 words; the orchestrator sends
 * the offending snippets back to the editor once when a threshold is crossed. */
export function voiceTells(body: string): { words: number; dashes: number; reversals: string[]; verdicts: string[]; dashPer1k: number } {
  const words = body.split(/\s+/).filter(Boolean).length || 1
  const dashes = (body.match(/[\u2013\u2014]/g) ?? []).length
  const sentences = body.replace(/\n+/g, ' ').split(/(?<=[.!?])\s+/)
  const reversals: string[] = []
  const verdicts: string[] = []
  for (let i = 0; i < sentences.length; i++) {
    const a = sentences[i], b = sentences[i + 1] ?? ''
    if (/\b(is|are|was|were|isn't|aren't|bukan|bukanlah)\b[^.]*\bnot\b[^.]*\.$/i.test(a) && /^(It|That|This|Itu|Ini|Yang|Melainkan)\b/.test(b)) reversals.push(`${a} ${b}`)
    if (/^(That|This|It|The test|None of that|Itu|Ini)\b.{0,45}\.$/.test(a) && a.split(' ').length <= 8 && i > 0 && sentences[i - 1].split(' ').length > 12) verdicts.push(a)
  }
  return { words, dashes, reversals, verdicts, dashPer1k: (dashes * 1000) / words }
}

/* Measurable Indonesian tells: sentences over 30 words (English rhythm carried
 * over) and calques from voice-id.md that are unambiguous enough to match. */
export const CALQUES: RegExp[] = [
  /hari selasa biasa/i, /punya biaya dengan nama/i, /biaya betulan/i, /batas jujur/i, /di ujung hari/i,
  /membuat perbedaan/i, /dalam rangka/i, /\byang mana\b/i, /\bmelakukan (pengecekan|pembuatan|penyesuaian|pemeriksaan)\b/i,
  /tautan pratinjau/i, /menyentuh sistem/i,
]
export const LONG_SENTENCE = 30
export function idTells(body: string): { sentences: number; long: string[]; calques: string[] } {
  const prose = body.split('\n').filter((l) => l.trim() && !/^\s*(#|\||```)/.test(l)).map((l) => l.replace(/^\s*[-*]\s+/, '')).join(' ')
  const sentences = prose.replace(/\[([^\]]*)\]\([^)]*\)/g, '$1').split(/(?<=[.!?])\s+/).filter((x) => x.trim())
  const long = sentences.filter((x) => x.split(/\s+/).length > LONG_SENTENCE)
  const calques = CALQUES.flatMap((re) => { const m = prose.match(re); return m ? [m[0]] : [] })
  return { sentences: sentences.length, long, calques }
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

/* Called only from the `en` branches: English is written from the finished
 * Indonesian article, while Indonesian is legitimately written without one. */
function requireReference(locale: 'en' | 'id', reference: Article | undefined): asserts reference is Article {
  if (locale === 'en' && !reference) throw new Error('English call requires the Indonesian article')
}

const idRules = (ctx: WriterContext) => ctx.voiceId ? `\n\nIndonesian language rules (these win over the exemplars and over any habit carried from English):\n<voice-id>\n${ctx.voiceId}\n</voice-id>` : ''

/* Opus 5 list prices per million tokens; thinking is billed as output. */
const PRICE = { input: 5, cacheRead: 0.5, cacheWrite: 6.25, output: 25 }
export const spend = { calls: 0, usd: 0 }

export function recordUsage(label: string, msg: Pick<Anthropic.Message, 'usage'>): number {
  const u = msg.usage
  const usd = ((u.input_tokens ?? 0) * PRICE.input + (u.cache_read_input_tokens ?? 0) * PRICE.cacheRead + (u.cache_creation_input_tokens ?? 0) * PRICE.cacheWrite + (u.output_tokens ?? 0) * PRICE.output) / 1e6
  spend.calls++; spend.usd += usd
  console.log(`usage ${label}: in=${u.input_tokens} cacheRead=${u.cache_read_input_tokens ?? 0} cacheWrite=${u.cache_creation_input_tokens ?? 0} out=${u.output_tokens} ~$${usd.toFixed(3)} (run total ~$${spend.usd.toFixed(2)} over ${spend.calls} calls)`)
  return usd
}

async function text(client: Anthropic, params: Omit<Anthropic.MessageCreateParamsStreaming, 'stream'>, label = 'call'): Promise<string> {
  const msg = await client.messages.stream({ ...params, stream: true }).finalMessage()
  recordUsage(label, msg)
  if (msg.stop_reason === 'refusal') throw new Error(`model refused: ${msg.stop_details?.explanation ?? 'no explanation'}`)
  if (msg.stop_reason === 'max_tokens') throw new Error('model hit max_tokens')
  return msg.content.filter((b): b is Anthropic.TextBlock => b.type === 'text').map((b) => b.text).join('')
}

export function createWriter(client: Anthropic = new Anthropic()): Writer {
  /* One effort level for the whole run: effort is part of the prompt-cache key,
 * so mixing levels rewrote the 14k-token context block mid-run. Medium held
 * quality in the judged runs and roughly halves thinking spend. */
const EFFORT = 'medium' as const
const base = { model: MODEL, max_tokens: 64000, thinking: { type: 'adaptive' as const }, output_config: { effort: EFFORT } }

  return {
    async brief(ctx) {
      const published = ctx.published.map((p) => `- ${p.type} "${p.title}" slug=${p.slug}`).join('\n') || '- none yet'
      const hasResearch = !!ctx.research?.urls.length
      const prompt = `Plan an article. Return JSON only.

Row: type=${ctx.row.type}, category=${ctx.row.category}, working title="${ctx.row.title}", goal="${ctx.row.goal}".
${ctx.notes ? `Founder notes for this topic (first source for claims; a note beats the product context when they disagree; record such a backing as "founder note: <quote>"):\n<notes>\n${ctx.notes}\n</notes>\n` : 'No founder notes for this topic.\n'}
${hasResearch ? `Research findings (the only allowed sources for external claims; cite by exact URL in backing):\n<research>\n${ctx.research!.text}\n</research>\n` : ''}
${ctx.row.facts ? `Client facts supplied by the founders (the only source for case-study claims):\n${ctx.row.facts}\n` : ''}
Published in this category (choose internalLinks from these only; prefer the pillar plus the closest post):
${published}

Slugs already used (do not reuse): ${ctx.usedSlugs.join(', ')}

Rules:
- claims: 3 to 5. Each backing must quote or name the section of the product context (or a line of the client facts) that supports it. If nothing supports a claim, leave it out.
${hasResearch ? '- A claim may be backed by one of the research URLs, written exactly. Never a URL you did not see above.\n' : ''}- cta.missingAsset is true when the goal names a download, checklist, template, ebook, or demo that does not exist. Then framing must fall back to an invitation to talk.
- unsplashQuery: two concrete nouns describing a scene, not the topic.
- outline: 3 to 8 H2 sections. Language-neutral; both an English and an Indonesian article will follow it.
- notesUsed: the notes you drew on, quoted briefly. notesUnused: the notes you left out and why, in one line each. Both empty when there are no notes.`
      const raw = await text(client, { ...base, max_tokens: 16000, system: system(ctx, 'You are a content strategist producing a brief.'), messages: [{ role: 'user', content: prompt }], output_config: { effort: EFFORT, format: { type: 'json_schema', schema: BRIEF_SCHEMA } } }, 'brief')
      let brief = JSON.parse(raw) as Brief
      if (!/^[a-z0-9][a-z0-9-]{3,80}$/.test(brief.slug)) throw new Error(`brief slug invalid: ${brief.slug}`)
      if (ctx.usedSlugs.includes(brief.slug)) throw new Error(`brief reused slug ${brief.slug}`)
      const knownByType = new Map(ctx.published.map((p) => [p.slug, p.type]))
      brief.internalLinks = brief.internalLinks
        .filter((l) => knownByType.has(l.slug))
        .map((l) => ({ ...l, type: knownByType.get(l.slug)! }))
      const log = ctx.log ?? console.log
      const before = brief.claims.length
      brief = citationsAllowed(brief, ctx.research?.urls ?? [], log)
      if (brief.claims.length !== before) log(`claims: ${before} -> ${brief.claims.length}`)
      return brief
    },

    async write(ctx, brief, locale, reference) {
      const exemplars = ctx.exemplars[locale].map((e, i) => `<exemplar n="${i + 1}">\n${e}\n</exemplar>`).join('\n\n')
      let audience = `Audience: pemilik atau pengambil keputusan UKM di Indonesia. This is the original article, written directly in Indonesian from the brief. There is no English version yet; do not draft in English in your head and render it. Think in Indonesian: local examples, institutions, rupiah, and situations this reader recognises where they fit the claims.${idRules(ctx)}`
      if (locale === 'en') {
        requireReference(locale, reference)
        audience = `Audience: an English-reading decision maker at a small or mid-sized company, international or Indonesia-based. This is the English edition of the Indonesian article below. Keep its argument, structure, and claims, but write native English for this reader; no sentence-by-sentence rendering of the Indonesian, and swap Indonesia-only examples for ones this reader recognises when the claim allows.\n\nIndonesian original for reference:\n<indonesian>\n${reference.body}\n</indonesian>`
      }
      const links = linkHrefs(ctx, brief, locale)
      const linkLines = links.map((l) => `- Link "${l.why}": href=${l.href}`).join('\n')
      const hasSources = brief.claims.some((c) => urlsIn(c.backing).length > 0)
      const prompt = `Write the ${locale === 'en' ? 'English' : 'Indonesian'} ${ctx.row.type === 'pillar' ? 'guide' : 'article'}.

Brief:
${JSON.stringify(brief, null, 2)}

${ctx.notes ? `Founder notes (use their wording where it is sharper than yours):\n<notes>\n${ctx.notes}\n</notes>\n` : ''}
${audience}

Frontmatter keys required: ${frontmatterKeys(ctx.row.type)}. Use the brief's title (translated with intent, not literally, for Indonesian).

${structure(ctx.row.type, linkLines, hasSources)}

Follow the "Voice rules" in the system context exactly; where an exemplar breaks one of them, the rule wins.

Match the length and formatting of these published exemplars${locale === 'id' ? ' (length and formatting only: several were translated from English and read stiff, so do not copy their sentence style)' : ''}:
${exemplars}`
      const raw = await text(client, { ...base, system: system(ctx, 'You are a senior content writer.'), messages: [{ role: 'user', content: prompt }] }, `write:${locale}`)
      return parseArticle(raw, ctx.row.type)
    },

    async edit(ctx, brief, locale, draft, reference, notes) {
      let comparison = `6. Indonesian language: apply the rules below. Split every sentence over 30 words, replace every calque, keep the "Anda" semi-formal register throughout. Rewrite the sentence rather than deleting the idea.${idRules(ctx)}`
      if (locale === 'en') {
        requireReference(locale, reference)
        comparison = `6. Compare with the Indonesian original: same claims, same sections. Do not make the English more literal; it must read as native English.\n\n<indonesian>\n${reference.body}\n</indonesian>`
      }
      const draftText = matter.stringify(draft.body, draft.frontmatter)
      const links = linkHrefs(ctx, brief, locale)
      const linkLines = links.map((l) => `- Link "${l.why}": href=${l.href}`).join('\n')
      const hasSources = brief.claims.some((c) => urlsIn(c.backing).length > 0)
      const prompt = `Edit this ${locale === 'en' ? 'English' : 'Indonesian'} draft and return the corrected document in the same format.

Checks, in order:
1. Every factual claim must trace to the brief's claims list. A claim whose backing is a URL keeps its inline link; any other external number or name is removed.
2. Cut filler, hedges, and repetition. Keep the exemplar voice. Do not shorten below roughly 80% of the draft.
3. Headings must equal the brief's outline H2s, in order.
4. Frontmatter: excerpt/introduction present; seoTitle under 60 chars; seoDescription under 155 chars; ctaTitle and ctaDescription match the CTA framing.
5. Internal links: only the hrefs listed below, verbatim.
${comparison}
7. Voice: the system context carries a "Voice rules" list. Treat every listed pattern as a defect. Remove every em-dash and en-dash, every "not X, it is Y" reversal, every one-line verdict, every bold lead-in, every forced triad. Rewrite the sentence rather than deleting the idea.
${notes ? `\n${notes.startsWith('READER CRITIQUES') ? 'Reader critiques. Apply a critique only if it can be fixed within the brief\'s claims list. If a critique asks for a fact, number, or example that is not in the brief, ignore it and say nothing.' : 'Specific violations found by an automated check; fix every one:'}\n${notes}\n` : ''}

Brief:
${JSON.stringify(brief, null, 2)}

Draft:
${draftText}

${structure(ctx.row.type, linkLines, hasSources)}`
      const raw = await text(client, { ...base, system: system(ctx, 'You are a copy editor.'), messages: [{ role: 'user', content: prompt }] }, `edit:${locale}${notes ? ':revise' : ''}`)
      return parseArticle(raw, ctx.row.type)
    },

    async judge(ctx, brief, locale, article) {
      const prompt = `Article (${locale}):\n${matter.stringify(article.body, article.frontmatter)}\n\nBrief thesis: ${brief.thesis}`
      const indonesian = locale === 'id' && !!ctx.voiceId
      const seats = indonesian ? [...SEATS, 'bahasa'] : [...SEATS]
      const bahasaSeat = indonesian ? `\n\nFifth seat, Indonesian articles only:\n- bahasa: seorang editor bahasa Indonesia yang memegang aturan di bawah. Setiap kalimat yang terdengar seperti terjemahan dari bahasa Inggris, lebih dari 30 kata, atau keluar dari register "Anda" semi-formal adalah satu kritik; sebutkan kalimatnya dan tulis ulang versi yang wajar sebagai fix. Skor turun seiring jumlahnya. 9 sampai 10: terasa ditulis orang Indonesia. 5 sampai 6: jelas terjemahan.${idRules(ctx)}` : ''
      const raw = await text(client, { ...base, max_tokens: 16000, system: system(ctx, ctx.judgePrompt + bahasaSeat), messages: [{ role: 'user', content: prompt }], output_config: { effort: EFFORT, format: { type: 'json_schema', schema: verdictSchema(seats) } } }, `judge:${locale}`)
      const parsed = JSON.parse(raw) as Verdict
      const clamp = (n: number) => Math.min(10, Math.max(1, Math.round(n)))
      const scores = Object.fromEntries(seats.map((k) => [k, clamp((parsed.scores as Record<string, number>)[k])])) as Verdict['scores']
      return { scores, critiques: parsed.critiques.slice(0, indonesian ? MAX_CRITIQUES_ID : MAX_CRITIQUES) }
    },

    async research(ctx) {
      const prompt = `Find at most five sources that bear on this topic for an Indonesian SME audience: "${ctx.row.title}" (${ctx.row.category}).
Prefer primary and Indonesian institutional sources (BPS, OJK, Kominfo, Bank Indonesia, KADIN, ministries), then reputable international bodies. Skip vendor blogs and listicles.
Return plain text, one block per source: URL, publisher, date, one-line finding, and the exact figure or quote if there is one. If nothing credible exists, say "No credible sources found" and stop.`
      const tools: Anthropic.ToolUnion[] = [
        { type: 'web_search_20260209', name: 'web_search', max_uses: 5 },
        { type: 'web_fetch_20260209', name: 'web_fetch', max_uses: 3, max_content_tokens: 12000 },
      ]
      const messages: Anthropic.MessageParam[] = [{ role: 'user', content: prompt }]
      const urls = new Set<string>()
      const textParts: string[] = []
      for (let i = 0; i < 4; i++) {
        const msg = await client.messages.stream({ model: MODEL, max_tokens: 16000, thinking: { type: 'adaptive' }, output_config: { effort: EFFORT }, tools, messages, system: system(ctx, 'You are a research assistant. Cite only what you actually retrieved.') }).finalMessage()
        if (msg.usage) recordUsage(`research:${i}`, msg)
        for (const b of msg.content) {
          if (b.type === 'web_search_tool_result' && Array.isArray(b.content)) for (const r of b.content) if (r.type === 'web_search_result') urls.add(r.url)
          if (b.type === 'web_fetch_tool_result' && b.content.type === 'web_fetch_result') urls.add(b.content.url)
        }
        if (msg.stop_reason === 'refusal') return { text: 'Research refused', urls: [] }
        const chunk = msg.content.filter((b): b is Anthropic.TextBlock => b.type === 'text').map((b) => b.text).join('')
        if (chunk) textParts.push(chunk)
        if (msg.stop_reason !== 'pause_turn') return { text: textParts.join('\n\n'), urls: [...urls] }
        messages.push({ role: 'assistant', content: msg.content })   // resume: the server continues where it paused
      }
      return { text: textParts.length ? textParts.join('\n\n') : 'Research paused too many times; no sources.', urls: [...urls] }
    },
  }
}
