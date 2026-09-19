# Social distribution: six posts per article through Publer

Date: 2026-09-20
Status: approved
Extends: `2026-09-19-automated-content-pipeline-design.md`,
`2026-09-19-content-quality-levers-design.md`

## Goal

Every article the pipeline publishes also produces six social posts, each
in its platform's format and persona, rendered images included, and hands
them to Publer as scheduled posts over three days. No human step. Same
GitHub Action, same honesty rule, same voice rules.

## Accounts and formats

| Post | Account | Format | Language | Day |
|---|---|---|---|---|
| Instagram | company | carousel, 6 to 8 slides, 4:5 portrait PNGs, short caption, no link | Indonesian | 0 |
| Facebook | company | narrative with one 4:5 image, link in post | Indonesian | 0 |
| LinkedIn | company page | narrative with the same image, link in first comment | English | 0 |
| X | company | text, one to three posts as a thread, link in the last | English | 1 |
| Threads | company | text, conversational, no link | Indonesian | 1 |
| Threads | founder's personal | text, first person, no link | Indonesian | 2 |

Publish day is the day the article's commit lands. Times: 09:00 Jakarta for
day 0 and day 1 posts, 19:00 Jakarta for the personal Threads post. All
times are configuration.

## Personas

One character, six executions. The character is the brand voice in
`.agents/product-marketing.md`: candid, precise, unshowy, senior,
disciplined. Each persona is a file in `scripts/prompts/social/` and is the
only thing that differs between calls:

- `linkedin.md`: the firm speaking plainly in "we". A lesson from the
  article, 1,300 to 2,000 characters, hook inside the first 140, no link in
  the body, one line of what Arktik will not do.
- `instagram.md`: the teacher. Cover slide as a question the reader needs
  answered, one idea per slide, last slide the CTA with "link in bio".
  Caption under 150 words.
- `facebook.md`: the neighbour who runs a business. Story first, warmer
  than LinkedIn, the link in the post, 120 to 250 words.
- `x.md`: the engineer at the whiteboard. One sharp claim per post, no
  hedging, 240 characters per post, a thread only when the article has a
  sequence, link in the last post.
- `threads-company.md`: the conversation starter. A question or a
  contrarian take in plain Indonesian, under 400 characters, no link.
- `threads-personal.md`: the founder thinking out loud. First person,
  something the article made them notice about their own work, under 400
  characters, no link, never a pitch.

Every persona file ends with the same three lines: claims only from the
article's brief; voice rules apply; no invented numbers, clients, or
outcomes.

## Generation

One model call per article, after the article is published and pushed,
returning strict JSON:

```
{
  linkedin: { text, imageHeadline },
  facebook: { text },
  instagram: { caption, slides: [{ headline, body }] },   // 6 to 8
  x: { posts: [string] },                                  // 1 to 3
  threadsCompany: { text },
  threadsPersonal: { text },
  hashtags: { instagram: [string], linkedin: [string] }    // max 5 and 3
}
```

Inputs: the final English and Indonesian articles, the brief (claims list,
thesis, CTA framing), the six persona files, the voice rules, the product
context in the cached system block. Effort medium. Length limits and
counts are enforced in code after parsing: excess slides dropped, texts
clamped at a word boundary with a warning, X posts split only if the model
returned one over 240 characters.

The six texts run through the measured voice guard once; a violation
triggers one re-edit of the affected texts, no more.

## Images

Rendered in the Action, no image API:

- **Carousel slides**: one HTML template, `scripts/social/carousel.html`,
  filled per slide and screenshotted with Playwright at 1080 by 1350. Cover
  uses the accent colour on paper; body slides use paper on ink; the last
  slide carries the CTA and the site URL. Typography from the site's fonts
  (Archivo display, Instrument Sans body) copied from `public/assets/fonts`
  or fetched once in the workflow. A small Arktik mark on every slide.
- **Narrative image**: `scripts/social/card.html`, the article's
  `imageHeadline` on the same system, 1080 by 1350, shared by LinkedIn and
  Facebook.

PNGs are written to a temp directory, uploaded to Publer, and not committed.
`playwright` is added as a dev dependency; the workflow installs Chromium.

## Publer integration

`scripts/publer.ts` wraps the Publer REST API with a `Poster` interface so
tests stub it:

```
interface Poster {
  upload(png: Buffer, name: string): Promise<{ id: string }>
  schedule(post: { accountId: string; text: string; mediaIds?: string[]; at: string; firstComment?: string }): Promise<{ id: string }>
}
```

Configuration in `scripts/social/config.json` (committed, no secrets):
account IDs per platform, posting times, and the founder's personal
Threads account ID. `PUBLER_API_KEY` is a repository secret.

**Unverified assumptions**, to be checked in the first task before any
code depends on them: that the Publer API on the Business plan can create
Instagram carousels, Threads posts, X threads, and a LinkedIn first
comment; and the exact endpoint shapes. If a format is not supported over
the API, that post falls back to Publer's draft state for manual publish
and the log says so.

## Orchestration

A new step at the end of a successful row in `publish-due.ts`, after the
push: `distribute(article, brief, deps)`. It never fails the row. Any
failure logs `social failed: <platform>: <message>` and continues; the
planner gains a `social` column recording `scheduled`, `partial`, or
`failed` so a retry is one dispatch with the title filter.

Dry run generates the JSON and the PNGs into the workflow artifact and
skips Publer entirely, so the first check is a read of the texts and a look
at the slides.

Re-running social for an already published row: `--social-only "<title>"`
regenerates and schedules without touching the article.

## Cost

- Publer Business with five company accounts plus one personal Threads
  account: about $42 per month at monthly billing, about $35 annual.
- One medium-effort generation call plus at most one voice re-edit: about
  $0.30 to $0.60 per article.
- Playwright rendering: free, about one minute of Action time.

## Rollout

1. Verify the Publer API capabilities with the key, in a script that only
   lists accounts and media endpoints. Record what is and is not supported
   in this spec before Task 2 starts.
2. Land generation, rendering, and the dry-run artifact. Dry run on the MVP
   article, read the six texts and the slides.
3. Land Publer scheduling with every post created in Publer's draft state
   for the first article; check them in the Publer UI; then switch the
   config to scheduled.
4. Cron unchanged.

## Out of scope

- Replies, comment monitoring, or analytics.
- Founder LinkedIn profile posting (a persona file and a config change
  when wanted).
- Reels or video.
- Re-posting older articles.
