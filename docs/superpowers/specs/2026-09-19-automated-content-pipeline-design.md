# Automated content writing and publishing

Date: 2026-09-19
Status: approved

## Goal

Turn the content planner into a pipeline that, on schedule and without a
human in the loop, writes each planned article in English and Indonesian,
picks a stock photo, commits the files to `main`, and marks the planner row
published. Publishing is a git push; Vercel deploys.

## Context

- Blog content lives in `content/` as Markdown with frontmatter, loaded by
  `lib/content.ts`. Posts go in `content/posts/<slug>.{id,en}.md`, guides in
  `content/pillars/`. Images live in `public/assets/blog/`. See
  `2026-09-19-local-markdown-content-design.md` and the "Blog content" section
  of `AGENTS.md`.
- The planner is a Google Sheet with 71 rows across six months, one every two
  days, each bilingual. Columns: Month, Week, Type (Pillar or Regular), Title,
  Category, CTA / Goal, Language, Status, Date.
- `.agents/product-marketing.md` (v5) holds product overview, personas,
  customer language, brand voice, proof points, objections, differentiation.
- `design.md` carries the honest-copy rule: copy asserts only facts the
  company holds. No invented clients, numbers, or outcomes.
- The one author is `content/authors/tika-aurora.md`.

## Decisions taken during brainstorming

| Decision | Choice |
|---|---|
| Human in the loop | None. Write, commit to `main`, mark published. |
| Runtime | GitHub Actions on a daily cron, plus manual dispatch. |
| Case-study rows | Written only when the row's `facts` column is filled; otherwise marked `needs-input`. |
| Featured image | Unsplash search by keyword, hotlinked to the Unsplash CDN per its guidelines, credit shown on the page. |
| Planner source | Moved into the repo as `content/planner.csv`. The sheet is retired. |
| Translation | Transcreation. English written first; Indonesian written as its own article for its own reader, with the English visible for tone and claims. |
| Writing model | `claude-opus-5` for all calls. |

## Planner file

`content/planner.csv`, UTF-8, header row:

```
date,type,title,category,goal,status,slug,facts,notes,research
```

- `date`: ISO `YYYY-MM-DD`. The day the row becomes due.
- `type`: `pillar` or `regular`.
- `title`: the working title from the sheet. The writer may refine it; the
  final title lives in the article frontmatter.
- `category`: a slug matching `content/categories/<slug>.id.md`. The sheet's
  display names map as: Digital Strategy & Business Growth →
  `digital-strategy`; Software Development & Technology →
  `software-development`; AI, Automation & Innovation → `ai-automation`;
  Design & User Experience → `design-ux`; Case Studies & Client Insights →
  `case-studies`.
- `goal`: the sheet's CTA / Goal text, passed to the writer to shape the CTA.
- `status`: `todo`, `published`, `needs-input`, `failed`.
- `slug`: empty until published, then the URL slug.
- `facts`: free text. Real client details for case-study rows. Quoted CSV
  field, may contain newlines.
- `notes`: free text, the founder's own material for the topic, used first by
  the brief.
- `research`: `yes` or empty, runs the opt-in web research step.

### One-time import

A throwaway script converts the sheet export to this file:

- Rows already live in the repo (matched by title to a post or pillar) get
  `status = published`, `slug` from the file, and `date` from the file's
  frontmatter. This corrects the three sheet rows marked "drafted" that are
  actually published.
- Every remaining row keeps the sheet's order and is re-dated to the
  every-two-days cadence starting on 2026-09-21, so nothing is overdue on the
  first run.
- Month, Week, and Language columns are dropped. Language is always both.

## Pipeline

`scripts/publish-due.ts`, run with `node --experimental-strip-types` (Node 24
in the workflow), same style as the loader tests. Steps per run:

1. Read `content/planner.csv`. Select rows with `status = todo` and
   `date <= today` (UTC). Process them in date order. A manual dispatch may
   pass a title substring to select exactly one row regardless of date.
2. Case-study gate: if `title` starts with `Case Study`, or `category` is
   `case-studies`, and `facts` is empty, set `status = needs-input` and
   continue to the next row. Anything in that category is a client story and
   must not be invented.
3. Brief call. Ask the model for a language-neutral brief as JSON: refined
   title, thesis, H2 outline with one line per section, the three to five
   claims the article will make and which product-context proof point or
   `facts` line backs each, CTA framing derived from `goal`, a search intent
   sentence, a two-word Unsplash query, internal links chosen from the
   published titles and slugs in the same category (the pillar and the
   closest post), and a URL slug (lowercase, hyphens, ASCII, not already
   used). A claim with no backing source is not allowed; the brief must
   omit it. If `goal` names an asset that does not exist (a checklist,
   template, ebook, or demo), the brief flags it and the CTA framing falls
   back to a consultation invite, so the article never promises a download
   that is not there. The brief JSON is printed to the workflow log for
   every row so a bad article can be traced to its plan.
4. English writing call. Inputs: the brief, `.agents/product-marketing.md`,
   the honest-copy rule, the copywriting reference notes, two published
   English exemplars of the same `type` (most recent), the structure
   checklist below, and the localisation instruction for an
   English-reading, international or Indonesian-based decision maker. Output:
   frontmatter and body in the loader's format.
5. Indonesian writing call. Same inputs with Indonesian exemplars and the
   finished English article as a reference for tone and claims, plus an
   explicit instruction: write an original article for an Indonesian SME
   owner; keep the argument and the claims; replace examples, idioms,
   institutions, and currency with local ones where they fit; use the formal
   register of the exemplars; do not translate sentence by sentence.
6. Edit call, once per language. Inputs: the article, the brief, the product
   context, the copy-editing checks. The editor tightens prose, removes
   filler, verifies every factual claim traces to the brief's backing list,
   confirms the excerpt and SEO fields exist and fit their length limits, and
   returns the corrected article. For Indonesian it also receives the English
   article and confirms both make the same claims.
7. Image. Query Unsplash search with the brief's query, orientation
   landscape, take the first result, trigger the download endpoint as the
   API terms require, and record the photo's hotlink URL (the `regular`
   size, or `raw` with width and quality parameters) as `image`, with
   `imageAlt` (the photo's alt description or the title) and `imageCredit`
   as `{ name, profileUrl, photoUrl }` in frontmatter. Photos are never
   downloaded into the repo: Unsplash's guidelines require hotlinking to
   their CDN, so `next.config.mjs` allowlists `images.unsplash.com` for the
   image optimiser. If Unsplash fails, the article is written without an
   image; the cards and hero already handle that.
8. Write `content/<posts|pillars>/<slug>.en.md` and `.id.md` with:
   `date` = run date, `updated` = same, `category`, `author: tika-aurora`,
   and for regular posts `pillar` = the slug of the most recently published
   pillar in the same category, if one exists. Tags come from the writer, at
   most five.
9. Sanity check: import `lib/content.ts` and call `getBlogPostBySlug` or
   `getPillarPageBySlug` for both locales. A throw fails the row.
10. Set the row to `published` with `slug`. Commit the two Markdown files
    and the planner with message
    `content: publish "<title>"`, where `<title>` is the refined title from
    the brief, not the planner's working title, then push. One commit per row
    so a bad article reverts alone.
11. On any failure after step 2, set the row to `failed`, commit only the
    planner, push, and exit non-zero so the workflow run is red. Files
    written for that row are removed before the commit.

### Structure checklist given to the writer

- The title is the H1; the body starts at H2.
- The first paragraph answers the search intent directly.
- One internal link to the category's pillar when one exists, one to a
  related published post (the writer receives the list of published slugs
  and titles in that category).
- A closing CTA section whose wording matches `goal`, with the frontmatter
  `ctaTitle` and `ctaDescription` filled.
- `excerpt` under 160 characters, `seoTitle` under 60, `seoDescription`
  under 155.
- No claims outside the brief's backing list. No invented statistics.

### Frontmatter produced

Same keys the loader reads today plus `imageCredit`:

```yaml
title, excerpt, date, updated, category, pillar, author, image, imageAlt,
imageCredit: { name, profileUrl, photoUrl }, tags, seoTitle, seoDescription,
ctaTitle, ctaDescription
```

Pillars use `introduction` instead of `excerpt` and no `pillar` or `tags`.

## Workflow

`.github/workflows/publish-content.yml`:

- `schedule: cron "0 1 * * *"` (08:00 Jakarta) and `workflow_dispatch` with
  inputs `title` (optional substring) and `dry_run` (boolean).
- Steps: checkout with a token that can push to `main`, setup Node 24, pnpm
  install, run the script, done. The script itself commits and pushes.
- Secrets: `ANTHROPIC_API_KEY`, `UNSPLASH_ACCESS_KEY`. Pushing uses the
  default `GITHUB_TOKEN` with `contents: write`, unless branch protection
  requires a personal token, in which case `CONTENT_BOT_TOKEN`.
- Concurrency group `publish-content` so two runs never push at once.

## Page change

One addition: post and pillar pages render a single credit line under the
hero when `imageCredit` exists, "Photo by <name> on Unsplash", with both
links, as Unsplash's API guidelines require. Styled with the existing
`label-mono` class. No other layout change.

`Post` and `Pillar` types gain `imageCredit?: { name; profileUrl; photoUrl }`
and the loader passes it through.

## Dry run and tests

- `--dry-run` writes the Markdown files to the working tree, skips the
  Unsplash call (no external side effects or download counts in a preview),
  updates the planner in memory only, and skips commit and push. The
  workflow's `dry_run` input maps to it and uploads the written files as a
  build artifact so they can be read from the run page.
- `scripts/publish-due.test.ts` covers the pure parts: row selection by
  status and date, the case-study gate, the pillar lookup, the re-dating
  logic of the import, and CSV round-tripping with a multi-line `facts`
  field. API calls are behind a small interface so the tests never touch the
  network.
- `pnpm test` picks the file up through the existing glob once it is widened
  to `'{lib,scripts}/**/*.test.ts'`.

## Rollout

1. Land the planner file, the script, the workflow, the credit line, and the
   tests with the cron disabled (workflow present, schedule commented out).
2. Manual dispatch in dry-run on the first todo row. Read the output on the
   run page. Adjust prompts if needed. Repeat once.
3. Manual dispatch for real on that row. Confirm the commit, the deploy, and
   the live page.
4. Enable the cron.

## Cost

Per article: one brief call, two writing calls, two edit calls on
`claude-opus-5`, roughly 40 to 60 thousand tokens in total. At the planned
cadence that is one article every two days.

## Out of scope

- Social posting, newsletters, or any channel besides the blog.
- Case-study content type pages (`content/case-studies/`). Sheet rows in the
  "Case Studies & Client Insights" category are regular posts in the
  `case-studies` blog category, matching how the live site already treats
  them.
- Generated images or any image source besides Unsplash.
- Editing the planner through a UI. It is a CSV in the repo.
- Rewriting or refreshing already published articles.
