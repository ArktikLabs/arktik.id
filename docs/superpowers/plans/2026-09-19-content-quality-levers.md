# Content Quality Levers Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Feed the writer the founder's own notes, judge and revise each article from the reader's seat, and, for flagged rows, ground claims in cited web sources, all inside the existing GitHub Action.

**Architecture:** Two planner columns (`notes`, `research`) and an optional notes file. The `Writer` interface gains `judge()` and `research()`; revision reuses the existing `edit()` with critiques passed as `notes`. The orchestrator gets one `qualityLoop()` per language after the voice guard and, for research rows, one research call before the brief whose returned URLs are the only citations allowed. Everything is stubbed in tests; no network.

**Tech Stack:** Same as the pipeline: Node 24, `@anthropic-ai/sdk` (server-side `web_search_20260209` and `web_fetch_20260209` tools), `gray-matter`, GitHub Actions.

**Spec:** `docs/superpowers/specs/2026-09-19-content-quality-levers-design.md` (extends `2026-09-19-automated-content-pipeline-design.md`)

## Global Constraints

- No new packages.
- Planner columns become exactly `date,type,title,category,goal,status,slug,facts,notes,research`. Every existing test that writes a planner header is updated to the new header; assertions on row values stay.
- `Writer` additions: `judge(ctx, brief, locale, article): Promise<Verdict>` and `research(ctx): Promise<Research>`. Revision is `edit(ctx, brief, locale, article, english?, notes)` with the critiques as `notes`; no new revise method.
- Judge thresholds: pass when every score is at least 7 and the mean is at least 8. At most two revision rounds per language. The best-scoring version is kept. A low score never fails a row.
- `quality: { owner, ops, developer, voice, rounds }` is written to frontmatter; the loader passes it through as `quality?: Record<string, number>`; nothing renders it.
- Research runs only when `row.research === 'yes'`. Citations in the brief (`backing` starting with `http`) must be URLs the research tool actually returned; others are dropped in code and logged. Articles with cited claims end with `## Sources` (en) or `## Sumber` (id). The honesty rule is otherwise unchanged.
- The pipeline never fails a row because research found nothing.
- Model `claude-opus-5` everywhere; the judge call uses `output_config.format` json_schema with no `minItems`, `maxItems`, or `pattern` (the API rejects them).
- Commits end with `Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>` and `Claude-Session: https://claude.ai/code/session_01DhGKPh2SrmHeVvHX2xTPQz`.
- `pnpm test` (currently 39) and `pnpm typecheck` stay green after every task. The cron stays enabled; every task leaves `main`-mergeable code.

---

## File Structure

Modified:
- `scripts/planner.ts` — two columns; `notesFor(root, row)` helper; `notesPath(row)`.
- `scripts/planner.test.ts`, `scripts/publish-due.test.ts` — headers, new tests.
- `content/planner.csv` — two empty columns appended to every row.
- `scripts/writer.ts` — `WriterContext.notes`, `Verdict`, `Research`, `judge()`, `research()`, brief and edit prompt changes, structure rule for the Sources section, `citationsAllowed()`.
- `scripts/writer.test.ts` — tests for the pure additions.
- `scripts/publish-due.ts` — `qualityLoop()`, research step, `--notes-path` flag, `quality` frontmatter.
- `lib/types/content.ts`, `lib/content.ts` — `quality` passthrough.
- `scripts/prompts/judge.md` — persona panel text (created).
- `AGENTS.md`, spec — docs.

---

### Task 1: Planner columns and founder notes loading

**Files:**
- Modify: `scripts/planner.ts`, `scripts/planner.test.ts`, `scripts/publish-due.test.ts` (header only), `content/planner.csv`

**Interfaces:**
- Produces:
  ```ts
  export interface Row { ...existing; notes: string; research: string }   // research: 'yes' | ''
  export const COLUMNS = ['date','type','title','category','goal','status','slug','facts','notes','research'] as const
  export function notesSlug(title: string): string          // lowercase, non-alphanumerics to '-', trimmed, max 80
  export function notesPath(root: string, row: Row): string // <root>/content/notes/<notesSlug(title)>.md
  export function notesFor(root: string, row: Row): string  // column text + '\n\n' + file text when both exist; '' when neither
  ```

- [ ] **Step 1: Failing tests**

In `scripts/planner.test.ts` replace every literal header `date,type,title,category,goal,status,slug,facts` with `date,type,title,category,goal,status,slug,facts,notes,research`, append `,,` to every literal data row, and add `notes: '', research: ''` to the `row()` helper's defaults. Add:

```ts
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { notesSlug, notesPath, notesFor } from './planner.ts'

test('notesSlug and notesPath derive a stable file name from the title', () => {
  assert.equal(notesSlug('MVP Development: Why Start Small to Scale Fast'), 'mvp-development-why-start-small-to-scale-fast')
  assert.equal(notesSlug('  Ünïcode & symbols!!  '), 'nicode-symbols')
  assert.equal(notesPath('/r', row({ title: 'A: B' })), '/r/content/notes/a-b.md')
})

test('notesFor joins the column and the file, and is empty when neither exists', () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'notes-'))
  fs.mkdirSync(path.join(root, 'content/notes'), { recursive: true })
  const r = row({ title: 'Topic One', notes: 'column note' })
  assert.equal(notesFor(root, r), 'column note')
  fs.writeFileSync(path.join(root, 'content/notes/topic-one.md'), 'file note\n')
  assert.equal(notesFor(root, r), 'column note\n\nfile note')
  assert.equal(notesFor(root, row({ title: 'Nothing Here' })), '')
})

test('research column parses and defaults empty', () => {
  const rows = parseCsv('date,type,title,category,goal,status,slug,facts,notes,research\n2026-01-01,regular,T,c,g,todo,,,,yes\n2026-01-02,regular,U,c,g,todo,,,,\n')
  assert.equal(rows[0].research, 'yes')
  assert.equal(rows[1].research, '')
  assert.throws(() => parseCsv('date,type,title,category,goal,status,slug,facts,notes,research\n2026-01-01,regular,T,c,g,todo,,,,maybe\n'), /research/)
})
```

In `scripts/publish-due.test.ts` change `HEADER` to the ten-column header and append `,,` to every planner data row literal in that file (search for `,todo,,\n` and make it `,todo,,,,\n`). Keep the regex assertions like `/,published,new-post,/` and `/,todo,,/` unchanged; they still match.

Run: `pnpm test` → FAIL (header mismatch and missing exports).

- [ ] **Step 2: Implement**

`scripts/planner.ts`:
- `Row` gains `notes: string; research: string`.
- `COLUMNS` gains `'notes', 'research'`.
- In `parseCsv`, after the type check: `if (r.research !== '' && r.research !== 'yes') throw new Error(\`row ${n + 2}: research must be "yes" or empty\`)`.
- Add:
```ts
export function notesSlug(title: string): string {
  return title.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 80)
}
export const notesPath = (root: string, row: Row) => path.join(root, 'content', 'notes', `${notesSlug(row.title)}.md`)
export function notesFor(root: string, row: Row): string {
  const file = notesPath(root, row)
  const fromFile = fs.existsSync(file) ? fs.readFileSync(file, 'utf8').trim() : ''
  return [row.notes.trim(), fromFile].filter(Boolean).join('\n\n')
}
```
  (add `import path from 'node:path'`).

Note: `notesSlug('  Ünïcode & symbols!!  ')` yields `unicode-symbols` after NFD stripping; adjust the test expectation to `'unicode-symbols'` if the implementer's run shows that, and say so in the report. The point of the test is stability, not a specific transliteration.

- [ ] **Step 3: Migrate the planner file**

```bash
node --input-type=module -e "
import fs from 'node:fs'
const lines = fs.readFileSync('content/planner.csv','utf8').split('\n')
if (lines[0] !== 'date,type,title,category,goal,status,slug,facts') throw new Error('unexpected header')
lines[0] += ',notes,research'
const out = lines.map((l, i) => (i === 0 || l === '') ? l : l + ',,')
fs.writeFileSync('content/planner.csv', out.join('\n'))
"
node --input-type=module -e "import('./scripts/planner.ts').then(p => { const r = p.readPlanner('content/planner.csv'); console.log(r.length, r.filter(x => x.status==='published').length, r.every(x => x.research === '')) })"
```
Expected: `71 11 true` (eleven published: ten imported plus the MVP article). If a `facts` field is quoted and multi-line, appending `,,` to a raw line would corrupt it; the check above catches that by throwing on parse. Today every `facts` is empty, so the raw append is safe.

- [ ] **Step 4: Run tests and commit**

Run: `pnpm test` → PASS, 42. `pnpm typecheck` clean.
```bash
mkdir -p content/notes && printf '# Founder notes\n\nOne file per planner row, named by `notesSlug(title)`. See the quality-levers spec.\n' > content/notes/README.md
git add scripts/planner.ts scripts/planner.test.ts scripts/publish-due.test.ts content/planner.csv content/notes/README.md
git commit -m "feat(content): planner gains notes and research columns; founder notes loader"
```

---

### Task 2: Founder notes reach the brief

**Files:**
- Modify: `scripts/writer.ts`, `scripts/publish-due.ts`, `scripts/publish-due.test.ts`

**Interfaces:**
- `WriterContext` gains `notes: string`.
- `Brief` gains `notesUsed: string[]` and `notesUnused: string[]` (short quotes or paraphrases).
- `publish-due.ts` gains `--notes-path "<title substring>"`: prints `notesPath` for the first matching row and exits 0 without running anything.

- [ ] **Step 1: Failing tests**

`scripts/publish-due.test.ts`: in the first "publishes a due row" test, write `content/notes/new-post.md` with `founder says X` into the scaffold before `run`, and capture the ctx the stub writer receives:
```ts
let seenCtx: any
const okWriter: Writer = { brief: async (ctx) => { seenCtx = ctx; return brief }, write: ..., edit: ... }
```
then assert `assert.equal(seenCtx.notes, 'founder says X')`. Add a test that with no notes the log contains `no founder notes for "New Post"` (collect logs in `deps.log`).

Run: `pnpm test` → FAIL.

- [ ] **Step 2: Implement**

`scripts/writer.ts`:
- `WriterContext` gains `notes: string`.
- `Brief` gains `notesUsed: string[]; notesUnused: string[]`; `BRIEF_SCHEMA` gains both as `{ type: 'array', items: { type: 'string' } }` and adds them to `required`.
- In `brief()`'s prompt, insert before the "Client facts" line:
```
${ctx.notes ? `Founder notes for this topic (first source for claims; a note beats the product context when they disagree; record such a backing as "founder note: <quote>"):\n<notes>\n${ctx.notes}\n</notes>\n` : 'No founder notes for this topic.\n'}
```
  and add to the Rules list: `- notesUsed: the notes you drew on, quoted briefly. notesUnused: the notes you left out and why, in one line each. Both empty when there are no notes.`
- In `write()`'s prompt, after the brief JSON: `${ctx.notes ? `Founder notes (use their wording where it is sharper than yours):\n<notes>\n${ctx.notes}\n</notes>\n` : ''}`.
- In the system block order, notes are not cached (they vary per row); they stay in the user message.

`scripts/publish-due.ts`:
- `contextFor` computes `const notes = notesFor(root, row)`; `if (!notes) log(\`no founder notes for "${row.title}"\`)`; returns `notes`.
- CLI: before building deps, `const np = process.argv.indexOf('--notes-path'); if (np >= 0) { const rows = readPlanner(...); const f = process.argv[np + 1].toLowerCase(); const row = rows.find((r) => r.title.toLowerCase().includes(f)); console.log(row ? notesPath(root, row) : 'no matching row'); process.exit(row ? 0 : 1) }`.
- Add `import { notesFor, notesPath } from './planner.ts'`.

- [ ] **Step 3: Tests, typecheck, commit**

`pnpm test` → PASS (44). `pnpm typecheck` clean.
```bash
git add scripts/writer.ts scripts/publish-due.ts scripts/publish-due.test.ts
git commit -m "feat(content): founder notes feed the brief and the writer"
```

---

### Task 3: Judge loop

**Files:**
- Create: `scripts/prompts/judge.md`
- Modify: `scripts/writer.ts`, `scripts/writer.test.ts`, `scripts/publish-due.ts`, `scripts/publish-due.test.ts`, `lib/types/content.ts`, `lib/content.ts`, `lib/content.test.ts`, `lib/content.fixtures/posts/kedua.id.md`

**Interfaces:**
```ts
export interface Verdict { scores: { owner: number; ops: number; developer: number; voice: number }; critiques: { persona: string; sentence: string; problem: string; fix: string }[] }
export function passes(v: Verdict): boolean            // every score >= 7 and mean >= 8
export function meanScore(v: Verdict): number
export function critiqueNotes(v: Verdict): string      // one "- [persona] "<sentence>": <problem>. Fix: <fix>" line per critique
Writer.judge(ctx: WriterContext, brief: Brief, locale: 'en' | 'id', article: Article): Promise<Verdict>
```
`Deps` unchanged. `run()` result unchanged. Frontmatter gains `quality: { owner, ops, developer, voice, rounds }`.

- [ ] **Step 1: Judge prompt file**

`scripts/prompts/judge.md`:
```
# Judge panel

Score the article from four seats. Each seat answers one question, "would
this reader finish it and believe it?", with a whole number 1 to 10, and
gives at most three critiques. A critique names the exact sentence, the
problem, and the fix. Do not praise. Do not rewrite the article.

Seats (from the product context's Personas table):
- owner: the business owner or financial buyer. Cares about cost certainty
  and not being stranded. Has been burned by an agency before.
- ops: the operations lead who will use the software daily. Cares whether
  it fits the actual work.
- developer: the internal or contract developer who inherits the code.
  Cares whether the reasoning is sound and the tech is conventional.
- voice: a copy editor holding the "Voice rules" from the system context.
  Every rule broken is a critique; the score falls with the count.

Scoring anchors: 9 to 10, the reader would forward it; 7 to 8, finishes it,
one or two doubts; 5 to 6, skims, unconvinced; below 5, stops reading.
```

- [ ] **Step 2: Failing tests**

`scripts/writer.test.ts`:
```ts
import { passes, meanScore, critiqueNotes, type Verdict } from './writer.ts'
test('passes and meanScore follow the panel thresholds', () => {
  const v = (a: number, b: number, c: number, d: number): Verdict => ({ scores: { owner: a, ops: b, developer: c, voice: d }, critiques: [] })
  assert.equal(passes(v(8, 8, 8, 8)), true)
  assert.equal(passes(v(9, 9, 9, 6)), false)   // one seat below 7
  assert.equal(passes(v(7, 7, 7, 8)), false)   // mean 7.25 < 8
  assert.equal(meanScore(v(7, 8, 9, 8)), 8)
})
test('critiqueNotes formats one line per critique', () => {
  const n = critiqueNotes({ scores: { owner: 6, ops: 8, developer: 8, voice: 8 }, critiques: [{ persona: 'owner', sentence: 'Costs vary.', problem: 'vague', fix: 'name the stage price rule' }] })
  assert.equal(n, '- [owner] "Costs vary.": vague. Fix: name the stage price rule')
})
```

`scripts/publish-due.test.ts`: extend the stub writer with a scripted `judge`:
```ts
const judgeScript: Verdict[] = []
const okWriter: Writer = { ..., judge: async () => judgeScript.shift() ?? { scores: { owner: 9, ops: 9, developer: 9, voice: 9 }, critiques: [] }, research: async () => ({ text: '', urls: [] }) }
```
(the `research` stub is needed once Task 4 lands; adding it now keeps the interface satisfied in one go, so add `research(ctx): Promise<Research>` to the `Writer` interface in this task with `export interface Research { text: string; urls: string[] }`, and make the real implementation `async research() { return { text: '', urls: [] } }` until Task 4.)

Add tests:
```ts
test('judge below threshold triggers one revision, quality lands in frontmatter', async () => {
  const root = scaffold(HEADER + '2026-09-21,regular,New Post,web,Awareness,todo,,,,\n')
  const edits: string[] = []
  const w: Writer = { ...okWriter, edit: async (_c, _b, l, d, _e, notes) => { edits.push(`${l}:${notes ?? ''}`); return d } }
  judgeScript.length = 0
  judgeScript.push(
    { scores: { owner: 5, ops: 8, developer: 8, voice: 8 }, critiques: [{ persona: 'owner', sentence: 'S', problem: 'P', fix: 'F' }] }, // en round 0
    { scores: { owner: 8, ops: 8, developer: 8, voice: 8 }, critiques: [] },                                                       // en round 1
    { scores: { owner: 9, ops: 9, developer: 9, voice: 9 }, critiques: [] },                                                       // id round 0
  )
  const d = deps(root, w)
  await run({ dryRun: false }, d)
  // en: initial edit (no notes) + one revision with critique notes; id: initial edit only
  assert.deepEqual(edits.filter((e) => e.startsWith('en:')).length, 2)
  assert.ok(edits.some((e) => e.startsWith('en:- [owner] "S": P. Fix: F')))
  assert.equal(edits.filter((e) => e.startsWith('id:')).length, 1)
  const data = matter(fs.readFileSync(path.join(root, 'content/posts/new-post.en.md'), 'utf8')).data as any
  assert.deepEqual(data.quality, { owner: 8, ops: 8, developer: 8, voice: 8, rounds: 1 })
})

test('judge cap: after two revisions the best-scoring version is kept, row still publishes', async () => {
  const root = scaffold(HEADER + '2026-09-21,regular,New Post,web,Awareness,todo,,,,\n')
  let n = 0
  const w: Writer = { ...okWriter, edit: async (_c, _b, l, d) => ({ ...d, body: `${d.body}v${++n}\n`.replace(/^v\d+\n/, '') }) }
  judgeScript.length = 0
  judgeScript.push(
    { scores: { owner: 5, ops: 6, developer: 6, voice: 6 }, critiques: [{ persona: 'owner', sentence: 'a', problem: 'b', fix: 'c' }] },
    { scores: { owner: 7, ops: 7, developer: 7, voice: 7 }, critiques: [{ persona: 'ops', sentence: 'a', problem: 'b', fix: 'c' }] },
    { scores: { owner: 6, ops: 6, developer: 6, voice: 6 }, critiques: [] },
    { scores: { owner: 9, ops: 9, developer: 9, voice: 9 }, critiques: [] }, // id
  )
  const d = deps(root, w)
  const r = await run({ dryRun: false }, d)
  assert.deepEqual(r.published, ['new-post'])
  const data = matter(fs.readFileSync(path.join(root, 'content/posts/new-post.en.md'), 'utf8')).data as any
  assert.deepEqual(data.quality, { owner: 7, ops: 7, developer: 7, voice: 7, rounds: 2 })  // best mean was round 1
})
```

`lib/content.test.ts`: add `quality: { owner: 8, ops: 9, developer: 7, voice: 8, rounds: 1 }` to `kedua.id.md` frontmatter and assert `post.quality` deep-equals it.

Run: `pnpm test` → FAIL.

- [ ] **Step 3: Implement**

`lib/types/content.ts`: `quality?: Record<string, number>` on `Post` and `Pillar`. `lib/content.ts`: `quality: d.quality,` in `toPost` and `toPillar`.

`scripts/writer.ts`:
```ts
export interface Verdict { scores: { owner: number; ops: number; developer: number; voice: number }; critiques: { persona: string; sentence: string; problem: string; fix: string }[] }
export interface Research { text: string; urls: string[] }
const VERDICT_SCHEMA = { type: 'object', additionalProperties: false, required: ['scores', 'critiques'], properties: {
  scores: { type: 'object', additionalProperties: false, required: ['owner', 'ops', 'developer', 'voice'], properties: { owner: { type: 'integer' }, ops: { type: 'integer' }, developer: { type: 'integer' }, voice: { type: 'integer' } } },
  critiques: { type: 'array', items: { type: 'object', additionalProperties: false, required: ['persona', 'sentence', 'problem', 'fix'], properties: { persona: { type: 'string' }, sentence: { type: 'string' }, problem: { type: 'string' }, fix: { type: 'string' } } } },
} } as const
export const meanScore = (v: Verdict) => Object.values(v.scores).reduce((a, b) => a + b, 0) / 4
export const passes = (v: Verdict) => Object.values(v.scores).every((s) => s >= 7) && meanScore(v) >= 8
export const critiqueNotes = (v: Verdict) => v.critiques.map((c) => `- [${c.persona}] "${c.sentence}": ${c.problem}. Fix: ${c.fix}`).join('\n')
```
`judge()` in `createWriter`: system = `system(ctx, judgeText)` where `judgeText` is `scripts/prompts/judge.md` content passed through `ctx` (add `judgePrompt: string` to `WriterContext`, read in `contextFor` like copy notes; missing file → log and use a one-line fallback "Score 1-10 per seat: owner, ops, developer, voice."); user message = `Article (${locale}):\n${matter.stringify(article.body, article.frontmatter)}\n\nBrief thesis: ${brief.thesis}`; `output_config: { effort: 'high', format: { type: 'json_schema', schema: VERDICT_SCHEMA } }`, `max_tokens: 8000`; parse and clamp each score to 1..10.

`scripts/publish-due.ts`:
```ts
const MAX_ROUNDS = 2
async function qualityLoop(deps: Deps, ctx: WriterContext, brief: Brief, locale: 'en' | 'id', article: Article, english?: Article): Promise<{ article: Article; quality: Record<string, number> }> {
  let best = article, bestV = await deps.writer.judge(ctx, brief, locale, article), rounds = 0
  deps.log(`judge (${locale}) round 0: ${JSON.stringify(bestV.scores)}`)
  let current = article, currentV = bestV
  while (!passes(currentV) && rounds < MAX_ROUNDS) {
    rounds++
    current = await deps.writer.edit(ctx, brief, locale, current, english, critiqueNotes(currentV))
    currentV = await deps.writer.judge(ctx, brief, locale, current)
    deps.log(`judge (${locale}) round ${rounds}: ${JSON.stringify(currentV.scores)}`)
    if (meanScore(currentV) > meanScore(bestV)) { best = current; bestV = currentV }
  }
  return { article: best, quality: { ...bestV.scores, rounds } }
}
```
Call after each `voiceGuard`: `const enQ = await qualityLoop(...)`; use `enQ.article` downstream; write `quality: enQ.quality` per locale into that locale's frontmatter (the `extra` object is shared, so pass a per-locale merge: `toFile(article, { ...extra, quality })`).

- [ ] **Step 4: Tests, typecheck, commit**

`pnpm test` → PASS (49). `pnpm typecheck` clean.
```bash
git add scripts/prompts/judge.md scripts/writer.ts scripts/writer.test.ts scripts/publish-due.ts scripts/publish-due.test.ts lib
git commit -m "feat(content): persona judge loop with capped revisions and quality scores in frontmatter"
```

---

### Task 4: Opt-in research with enforced citations

**Files:**
- Modify: `scripts/writer.ts`, `scripts/writer.test.ts`, `scripts/publish-due.ts`, `scripts/publish-due.test.ts`

**Interfaces:**
```ts
Writer.research(ctx): Promise<Research>                 // { text, urls }
export function citationsAllowed(brief: Brief, urls: string[], log: (s: string) => void): Brief   // drops claims whose backing starts with http and is not in urls
WriterContext gains research?: Research
```

- [ ] **Step 1: Failing tests**

`scripts/writer.test.ts`:
```ts
import { citationsAllowed } from './writer.ts'
test('citationsAllowed drops claims citing URLs the research did not return', () => {
  const b = { ...minimalBrief, claims: [
    { claim: 'a', backing: 'product context > Proof Points' },
    { claim: 'b', backing: 'https://bps.go.id/x' },
    { claim: 'c', backing: 'https://invented.example/y' },
  ] }
  const logs: string[] = []
  const out = citationsAllowed(b as any, ['https://bps.go.id/x'], (s) => logs.push(s))
  assert.deepEqual(out.claims.map((c) => c.claim), ['a', 'b'])
  assert.match(logs[0], /invented\.example/)
})
```
(`minimalBrief` is the literal the existing `linkHrefs` test builds; reuse or duplicate it.)

`scripts/publish-due.test.ts`:
```ts
test('research runs only for research=yes rows and its text reaches the brief', async () => {
  const root = scaffold(HEADER + '2026-09-21,regular,New Post,web,Awareness,todo,,,,yes\n')
  let researched = 0, seen: any
  const w: Writer = { ...okWriter, research: async () => { researched++; return { text: 'SOURCE LIST', urls: ['https://bps.go.id/a'] } }, brief: async (ctx) => { seen = ctx; return brief } }
  await run({ dryRun: true }, deps(root, w))
  assert.equal(researched, 1)
  assert.equal(seen.research.text, 'SOURCE LIST')
})
test('research is skipped when the column is empty', async () => {
  const root = scaffold(HEADER + '2026-09-21,regular,New Post,web,Awareness,todo,,,,\n')
  let researched = 0
  const w: Writer = { ...okWriter, research: async () => { researched++; return { text: '', urls: [] } } }
  await run({ dryRun: true }, deps(root, w))
  assert.equal(researched, 0)
})
```

Run: `pnpm test` → FAIL.

- [ ] **Step 2: Implement**

`scripts/writer.ts`:
- `WriterContext` gains `research?: Research`.
- `citationsAllowed` as specified; a claim with `backing` starting with `http` whose URL (exact string, trailing slash ignored) is not in `urls` is removed with `log(\`dropped uncited claim: ${claim} (${backing})\`)`.
- `research()` in `createWriter`:
```ts
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
  for (let i = 0; i < 4; i++) {
    const msg = await client.messages.stream({ model: MODEL, max_tokens: 16000, thinking: { type: 'adaptive' }, tools, messages, system: system(ctx, 'You are a research assistant. Cite only what you actually retrieved.') }).finalMessage()
    for (const b of msg.content) {
      if (b.type === 'web_search_tool_result' && Array.isArray(b.content)) for (const r of b.content) if (r.type === 'web_search_result') urls.add(r.url)
      if (b.type === 'web_fetch_tool_result' && b.content && 'url' in b.content && typeof b.content.url === 'string') urls.add(b.content.url)
    }
    if (msg.stop_reason !== 'pause_turn') {
      const text = msg.content.filter((b): b is Anthropic.TextBlock => b.type === 'text').map((b) => b.text).join('')
      return { text, urls: [...urls] }
    }
    messages.push({ role: 'assistant', content: msg.content })   // resume: the server continues where it paused
  }
  return { text: 'Research paused too many times; no sources.', urls: [...urls] }
}
```
  If the SDK's types name these block types differently, use the names from `node_modules/@anthropic-ai/sdk` (search for `WebSearchToolResultBlock` and `WebFetchToolResultBlock`) and note the adjustment; do not cast to `any`. A `refusal` stop reason returns `{ text: 'Research refused', urls: [] }`, not a throw.
- In `brief()`: when `ctx.research?.text`, insert after the notes block:
```
Research findings (the only allowed sources for external claims; cite by exact URL in backing):
<research>
${ctx.research.text}
</research>
```
  and add the rule `- A claim may be backed by one of the research URLs, written exactly. Never a URL you did not see above.` After parsing: `if (ctx.research) brief = citationsAllowed(brief, ctx.research.urls, console.log)` (pass a logger through `ctx` instead of `console.log` if simpler: add `log?: (s: string) => void` to `WriterContext`).
- `structure()`: add `- If any claim's backing is a URL, end the article with a "## Sources" section (Indonesian: "## Sumber") listing each cited URL once as a plain Markdown link with the publisher as text, and cite inline with the same link where the claim appears. Otherwise no Sources section.` Pass `hasSources` from the brief so the rule can be omitted entirely when no URL backing exists.
- `edit()` check 1 becomes: `1. Every factual claim must trace to the brief's claims list. A claim whose backing is a URL keeps its inline link; any other external number or name is removed.`

`scripts/publish-due.ts`: before `brief`, `if (row.research === 'yes') { ctx.research = await deps.writer.research(ctx); deps.log(\`research: ${ctx.research.urls.length} urls\`) }` and pass `deps.log` as `ctx.log`.

- [ ] **Step 3: Tests, typecheck, commit**

`pnpm test` → PASS (52). `pnpm typecheck` clean.
```bash
git add scripts/writer.ts scripts/writer.test.ts scripts/publish-due.ts scripts/publish-due.test.ts
git commit -m "feat(content): opt-in web research with citations restricted to retrieved URLs"
```

---

### Task 5: Docs and rollout

**Files:**
- Modify: `AGENTS.md`, `docs/superpowers/specs/2026-09-19-automated-content-pipeline-design.md` (planner columns line)

- [ ] **Step 1: Docs**

`AGENTS.md` blog section, append:
```
Founder notes: put your own material for a topic in the planner's `notes`
column or in `content/notes/<slug>.md` (get the path with
`pnpm publish:due --notes-path "<title>"`). The brief uses notes first.
Research: set the planner's `research` column to `yes` for evidence-led
rows; citations are limited to URLs the research call returned, and the
article ends with a Sources list. Every article carries `quality` scores
(owner, ops, developer, voice, 1-10) in frontmatter from the judge loop.
```
Spec: update the planner header line to the ten columns.

- [ ] **Step 2: Commit**

```bash
git add AGENTS.md docs
git commit -m "docs: founder notes, research flag, quality scores"
```

- [ ] **Step 3: Rollout (controller with the user)**

1. Push. Ask the founder for a few lines of notes on one upcoming row (suggested: "The Business Value of Great UX Design") and put them in the column or file.
2. Dispatch `dry_run=true` with that title. Read the log: `no founder notes` absent, `judge (en) round 0` scores, revision rounds if any. Render the artifact as before and compare against the live version of the nearest topic.
3. Set `research=yes` on "Measuring Digital ROI & Growth" and dry-run it. Check the log for `research: N urls`, `dropped uncited claim` lines, and the Sources section.
4. No cron change; it is already on.

---

## Self-review

**Spec coverage:** Lever 1 planner column, notes file, `--notes-path`, brief precedence, `notesUsed`/`notesUnused`, no-notes log (Tasks 1, 2). Lever 2 panel from personas, thresholds, cap, best version kept, `quality` frontmatter and passthrough, never fails (Task 3). Lever 3 opt-in column, research call with both tools and Indonesian preference, URL enforcement in code, Sources section, editor rule, no-source is not failure (Task 4). Rollout order and docs (Task 5). Cost notes need no task.

**Placeholders:** none. The two "if the SDK names differ" notes are instructions to consult installed types, not gaps.

**Type consistency:** `Verdict`, `Research`, `passes`, `meanScore`, `critiqueNotes`, `citationsAllowed` defined in Tasks 3 and 4 and used with the same names in the orchestrator and tests. `Writer.judge`/`research` are added to the interface in Task 3 so the stub writer in tests compiles from then on. `HEADER` in tests is ten columns from Task 1. `quality` shape `{ owner, ops, developer, voice, rounds }` is identical in Task 3's orchestrator, tests, and the loader fixture.
