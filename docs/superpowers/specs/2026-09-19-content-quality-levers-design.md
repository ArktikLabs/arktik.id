# Content quality levers: founder notes, judged revision, opt-in research

Date: 2026-09-19
Status: approved
Extends: `2026-09-19-automated-content-pipeline-design.md`

## Goal

Raise the quality of the pipeline's articles without changing how it runs.
Quality here means: only Arktik could have written it, it reads as a person,
and every claim is backed. Three levers, built in this order:

1. Founder notes per row, the raw material the writer works from.
2. A judged revision loop that scores each article from the reader's seat
   and revises until it clears a bar.
3. Opt-in web research with enforced citations, for evidence-led topics.

The runtime stays the GitHub Action. No agent framework.

## Lever 1: founder notes

### Planner

`content/planner.csv` gains one column, `notes`, after `facts`:

```
date,type,title,category,goal,status,slug,facts,notes
```

`notes` is free text (quoted CSV, may contain newlines): the founder's own
material for the topic. Anything goes: a client conversation, an opinion,
how Arktik actually does the thing, a mistake seen in the field, a number
the founders can stand behind. `facts` keeps its meaning for case-study
rows; `notes` applies to every row. Existing rows get an empty `notes`.

Rows can also carry notes as a file, `content/notes/<slug-of-title>.md`,
for anything longer than a few lines (a voice memo transcript). The loader
for notes concatenates the column and the file if both exist. The file name
is the planner title slugified, printed by a small helper so the founder
can see the expected name (`pnpm publish:due --notes-path "MVP Development"`).

### Brief

The brief prompt receives the notes in the user message, ahead of the row
facts; the product context stays in the cached system block. The prompt
states that notes take precedence. The prompt
is told: claims come from the notes first, then from the product context;
a note that contradicts the product context wins and is reported in the
brief's `backing` as `founder note`. The brief must state which notes it
used and which it left out, so the log shows whether the material landed.

### Behaviour without notes

Unchanged. A row with no notes writes as today. The log line
`no founder notes for "<title>"` makes the gap visible.

## Lever 2: judged revision loop

### Panel

Three personas taken verbatim from the Personas table in
`.agents/product-marketing.md`: the owner or business lead, the operations
lead, and the internal or contract developer. Each scores the article 1 to
10 on one question, "would this reader finish it and believe it?", and
returns at most three specific critiques with the sentence they point at.

A fourth judge, the voice judge, scores the article against
`scripts/prompts/voice.md` and lists violations. It replaces nothing; the
measured `voiceTells` guard stays as the hard floor.

### Loop

After the per-language edit and the voice guard:

1. Judge call: returns JSON `{ scores: { owner, ops, developer, voice },
   critiques: [{ persona, sentence, problem, fix }] }`.
2. Pass if every score is at least 7. (The copy-editing skill also asks for
   a mean of 8; that rule triggered revisions that cost about 45 cents and
   moved no score in the first live run, so it was dropped.)
3. Otherwise one revision call with the critiques quoted back, then one
   re-judge. One revision round per language (a second did not raise scores
   in the first live run).
4. After the cap, publish the best-scoring version and log the final scores.
   A low score is never a failure; it is a signal in the log.

Scores are written into frontmatter as `quality: { owner, ops, developer,
voice, rounds }`. The loader passes it through; no page renders it. It lets
scores be graphed over time from the repo alone.

### Cost

Per language: one judge call and at most one revision and re-judge pair,
plus a post-revision voice check that can add one edit. Measured in the
first runs: about 25 cents per call at high effort, most of it adaptive
thinking billed as output. Edits, judges, the Indonesian transcreation, and
research now run at medium effort; every call logs its usage and cost.

## Lever 3: opt-in research

### Opt-in

The planner gains a `research` column (`yes` or empty). Rows marked `yes`
run a research call before the brief. Nothing else changes for other rows.

### Research call

One call with the server-side `web_search` tool (`max_uses: 5`) and
`web_fetch` (`max_content_tokens: 12000`), instructed to find at most five
sources that bear on the working title, preferring Indonesian institutions
(BPS, OJK, Kominfo, Bank Indonesia, KADIN) and primary sources over
commentary, and to return a free-text list: URL, publisher, date, one-line
finding, and the exact figure or quote if any. The call is free-form text;
JSON output is not combined with server tools.

### Enforcement in code

- The orchestrator collects every URL that appeared in the tool results.
  A source in the brief whose URL is not in that set is dropped and logged.
- The brief's `claims[].backing` may now be a URL. The editor keeps every
  cited claim's link and removes any external figure without one.
- Articles with cited claims end with a short "Sources" list (`## Sources`
  in English, `## Sumber` in Indonesian), plain links, no commentary. This
  is the one structural addition; the structure rules allow the heading
  only when sources exist.
- "No credible source" is a normal outcome: the brief writes without the
  external claim. It is never a row failure.

### Honesty rule, restated

A claim traces to exactly one of: founder notes, the product context, the
`facts` column, or a URL that the research call actually returned. Nothing
else. The editor enforces it; the code enforces the URL half.

### Cost

About $0.20 to $0.30 per researched article: five searches at $10 per
thousand, roughly 20k result tokens as input, and one extra call. A
researched row also pays one extra cache write because the research call
declares tools. Runtime adds one to three minutes. A dry run of a
researched row makes the real research call.

## Rollout

1. Lever 1 and lever 2 land together. Dry run on one row with notes filled
   by the founder for that row, compare against the current published
   version of the same topic, read the scores in the log.
2. Lever 3 lands after, with `research=yes` set on two evidence-led rows
   first ("Measuring Digital ROI & Growth", "How Digital Transformation
   Boosts SMEs in Indonesia"), dry run, read the sources list.
3. Cron stays on throughout; rows without notes or research still publish.

## Out of scope

- Any agent framework or change of runtime.
- A human approval step. The 24-hour auto-merge PR idea stays an option
  for later, not part of this.
- Rewriting already published articles with the new levers.
- Rendering quality scores on the site.
