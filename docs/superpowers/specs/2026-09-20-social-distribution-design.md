# Social distribution: six posts per article through Postiz

Date: 2026-09-20
Status: approved
Extends: `2026-09-19-automated-content-pipeline-design.md`,
`2026-09-19-content-quality-levers-design.md`

## Goal

Every article the pipeline publishes also produces six social posts, each
in its platform's format and persona, rendered images included, and hands
them to a self-hosted Postiz instance as scheduled posts over three days. No human step. Same
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
  answered, one idea per slide, last slide a save-leaning CTA with "Link di bio".
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

**Indonesian register** (amended 2026-09-25 after the first sample read as
translated). Indonesian posts are written in Indonesian from the article's
ideas, never translated from the English post or article sentences. Register
follows the persona: Instagram "kamu", santai-rapi; Facebook "Anda",
semi-formal spoken; company Threads "kamu", like a group chat; personal
Threads "aku". A post never mixes "Anda" with "aja/nggak". Everyday English
loanwords stay in English ("link di bio", not "tautan di bio"). The calque
list and per-platform samples live in `scripts/prompts/social/indonesian-voice.md`,
which is included in the generation prompt, and the voice guard flags the
listed calques.

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

PNGs are written to a temp directory, uploaded to Postiz, and not committed.
`playwright` is added as a dev dependency; the workflow installs Chromium.

## Postiz integration

The founders host Postiz (open source) and connect the six accounts there.
The pipeline only talks to its public API: base URL `<POSTIZ_URL>/public/v1`,
API key in the `Authorization` header. Endpoints used, per the public API
docs: `GET /integrations` to list connected accounts, `POST /upload` for
each PNG (returns an `id` and `path`), and `POST /posts` with
`type: "schedule"`, an ISO `date`, and a `posts` array where each item
targets one integration by id, carries the text and uploaded media, and a
`settings` object with `__type` set to the platform (`instagram`,
`facebook`, `linkedin-page`, `x`, `threads`). Instagram carousels use the
`post_as_images_carousel` setting; X threads are a `posts` array of
consecutive items on the same integration.

`scripts/postiz.ts` wraps this behind a `Poster` interface so tests stub
it:

```
interface Poster {
  integrations(): Promise<{ id: string; name: string; provider: string }[]>
  upload(png: Buffer, name: string): Promise<{ id: string; path: string }>
  schedule(post: { integrationId: string; provider: string; texts: string[]; media?: { id: string; path: string }[]; at: string }): Promise<{ id: string }>
}
```

`texts` holds one entry for a single post and several for an X thread.
Configuration in `scripts/social/config.json` (committed, no secrets):
integration IDs per platform, posting times, the founder's personal Threads
integration ID. `POSTIZ_URL` and `POSTIZ_API_KEY` are repository secrets.

**Unverified assumptions**, checked by the first task against the live
instance before any code depends on them: the exact `settings` keys per
provider, whether a LinkedIn or Facebook first comment is exposed over the
API (if not, the LinkedIn link goes at the end of the post body and the
log says so), and that the self-hosted instance exposes the public API on
the same paths as the hosted one.

## Orchestration

A new step at the end of a successful row in `publish-due.ts`, after the
push: `distribute(article, brief, deps)`. It never fails the row. Any
failure (including Postiz being unreachable) logs `social failed: <platform>: <message>` and continues; the
planner gains a `social` column recording `scheduled`, `partial`, or
`failed` so a retry is one dispatch with the title filter.

Dry run generates the JSON and the PNGs into the workflow artifact and
skips Postiz entirely, so the first check is a read of the texts and a look
at the slides.

Re-running social for an already published row: `--social-only "<title>"`
regenerates and schedules without touching the article.

## Cost

- Postiz self-hosted: no subscription. Hosting is the founders' existing
  server. The platform developer apps it needs (Meta, LinkedIn, X) are set
  up by the founders separately; X's API is pay-per-use as of 2026.
- One medium-effort generation call plus at most one voice re-edit: about
  $0.30 to $0.60 per article.
- Playwright rendering: free, about one minute of Action time.

## Rollout

1. With `POSTIZ_URL` and `POSTIZ_API_KEY` set, run a script that only
   calls `GET /integrations` and prints the six accounts with their ids
   and providers, and probes `POST /upload` with a tiny PNG. Record the
   real `settings` shapes in this spec before Task 2 starts.
2. Land generation, rendering, and the dry-run artifact. Dry run on the MVP
   article, read the six texts and the slides.
3. Land Postiz scheduling with the first article's posts scheduled a week
   out; check them in the Postiz calendar; then set the config to the
   normal times.
4. Cron unchanged.

## Out of scope

- Replies, comment monitoring, or analytics.
- Founder LinkedIn profile posting (a persona file and a config change
  when wanted).
- Reels or video.
- Re-posting older articles.
