# Design — Arktik

A locked design system for arktik.id. Every page redesign reads this file before
emitting code. Do not regenerate per page — extend or amend this file when the
system needs to grow.

**v2 — 2026-08-13.** Amended, not regenerated, per redesign.md § 5.

What changed and why: v1 kept the brand's `#012233` dark blue as paper. That
ground sits at hue 236; the locked accent sits at 120. Two chromatic colours
116 degrees apart compete rather than one carrying the other, and the result
read muddy and under-powered — the client's words were "boring, doesn't feel
professional or trustworthy". v2 replaces the blue with a near-neutral carbon
tinted a whisper toward the accent's own hue, so the ground now serves the lime
instead of arguing with it.

**The accent `#DDFE55` is locked by the client and must not change.** Everything
else — ground, fonts, structure — was explicitly unlocked for v2.

Brief context that drives every decision below: this is a **new firm with a thin
portfolio whose founders stay anonymous**. That removes all three normal trust
levers at once — client logos, named people, scale numbers. The design therefore
has to carry trust that content usually carries, which is why Process is a
first-class section and why density is a requirement rather than a taste.

## Genre

**modern-minimal** (v1 was atmospheric). Atmospheric wanted mood and diffusion;
this brief needs legibility and evidence. Carbon ground, one hot accent, tight
grid, no ambience for its own sake.

## Macrostructure family

Pages within a family share the family's shape; they vary only in component
archetypes.

- **Marketing pages** (`/[locale]`) — **01 · Bento Grid** (v1 was Split Studio).
  Split Studio was structurally correct and visually thin: with three showcases
  and no client logos there was not enough proof to fill a diptych rhythm, so the
  page read sparse. Bento mixes registers in one dense composition — work tiles
  sit beside the commitments block, so density comes from size variation rather
  than from padding out a uniform card row.
- **Content pages** (`/[locale]/blog/**`) — **20 · Ecosystem Index** for index and
  category routes; **02 · Long Document** for a single post, pillar, or case study.
  Varies on: section-head archetype, card density.
- **Showcase pages** (`/[locale]/showcase/**`) — **18 · Portfolio Grid** for the
  index; **05 · Workbench** for a single showcase. Varies on: grid span pattern.

### Why Bento Grid for marketing (v2)

Restraint is a move you earn with proof. v1 optimised for it — spec sheets,
hairlines, generous air — and for a firm the buyer already trusts that reads as
confidence. For a firm they have never heard of it reads as unfinished. Bento
fixes that without volume-for-its-own-sake: tiles of different spans let work,
commitments and the CTA share one composition, so the page is dense with
*substance* rather than padded with decoration.

Section order is the argument the page makes: **work** (we have shipped things)
→ **process** (here is exactly what happens and what it costs) → **capabilities**
→ **why us** → **how we think** → **writing** (we know this field).

## Theme — custom, "carbon, bone, one hot accent"

Diversification axes: **dark paper · grotesk-sans display · chromatic-other accent**.

| Token | Value | Note |
| --- | --- | --- |
| `--color-paper` | `oklch(15.5% 0.012 150)` | `#090E0A` carbon |
| `--color-paper-2` | `oklch(20.5% 0.014 150)` | elevated |
| `--color-paper-3` | `oklch(26.5% 0.016 150)` | top elevation |
| `--color-paper-invert` | `oklch(96% 0.008 100)` | `#F3F2EC` bone — never `#fff` |
| `--color-ink` | `oklch(97% 0.006 150)` | |
| `--color-ink-2` | `oklch(74.5% 0.012 150)` | body on carbon |
| `--color-ink-3` | `oklch(63% 0.012 150)` | captions — 5.6:1 on paper (56.5% failed at 4.30:1) |
| `--color-accent` | `oklch(94.3% 0.192 120)` | `#DDFE55` — **LOCKED** |
| `--color-accent-ink` | `oklch(15.5% 0.012 150)` | label on accent fill |
| `--color-rule` | `oklch(28.5% 0.014 150)` | |

Every neutral is tinted toward hue 150 — the accent's own neighbourhood — at
0.006–0.016 chroma. Nothing is zero-chroma; pure grey reads synthetic (gate 22).
The tint is what makes the ground *serve* the lime instead of arguing with it,
and it is the whole reason v2 exists.

**Accent discipline: ≤ 5 % of any viewport as solid fill.** The accent is the
primary CTA, the banner strip, the focus ring, the step numerals, one section
rule. Larger accent surfaces (the bento CTA tile) are permitted only when the
tile carries `--color-accent-ink` text and passes gates 40–41.

Elevation is **lightness** (`paper` → `paper-2` → `paper-3`), never a coloured
glow. The shadcn HSL bridge in `tokens.css` is derived from these OKLCH values,
not eyeballed — the two layers must name the same colours or the system drifts.

## Typography

- **Display**: **Archivo**, weight 700, roman. Wide, institutional letterforms —
  they buy the authority a new firm cannot yet buy with client logos. Replaces
  Bricolage Grotesque, which is characterful but reads indie.
- **Body**: **Instrument Sans**, weight 400. Narrower and humanist, so the
  pairing contrasts on **width**, not just weight.
- **Mono**: **Geist Mono** — labels, step numerals, the colophon.
- **Display leading is 0.95.** v1 ran display at 1.05, which is body leading on
  display type and a large part of why the page read flat. Display is loud or it
  is not display.
- `--text-display: clamp(2.75rem, 6vw + 0.5rem, 5.5rem)`.

Hero headline stays ≤ 50 characters. Indonesian runs ~15 % longer than English —
check `id.json` before shortening only the English string.

## Spacing

4-point named scale, `--space-3xs` … `--space-3xl`. Values live in `tokens.css`.
Pages must use named tokens, never raw values.

**Sections do not share padding.** The audit found `px-6 pt-20 pb-0 lg:px-12` on
five consecutive sections. Rhythm requires variation: a diptych row that pairs
with the row above it tightens to `--space-xl`; a family boundary opens to
`--space-3xl`.

## Motion

- Easings: `--ease-out: cubic-bezier(0.16, 1, 0.3, 1)`, `--ease-in-out:
  cubic-bezier(0.65, 0, 0.35, 1)`. Never the browser default `ease`, never an
  overshoot on UI state.
- Reveal pattern: **fade only**, and only on the diptych halves (staggered ~60 ms).
  No universal scroll-triggered fade-up. The page settles.
- Reduced-motion fallback: opacity-only, ≤ 150 ms.
- `transition-all` is banned. Name the properties.
- **One hover signal per element.** Not scale + border + shadow + three text
  colour shifts, which is what the cards ship today.
- Animate `transform` and `opacity` only.

## Microinteractions stance

- Silent success. No celebratory toast for a thing the user can see happened.
- Hover tooltip delay 800 ms · focus tooltip delay 0 ms.
- Focus rings appear **instantly** — never transitioned, never `ring-0` without a
  replacement indicator.
- Hover-only affordances are banned: anything revealed on hover has a visible
  resting state at ≥ 60 % opacity, because touch never hovers.
- The custom cursor never overrides `text` on inputs or `not-allowed` on disabled
  controls.

## CTA voice

- **Primary**: accent fill, `--color-accent-ink` label, pill radius
  (`--radius-pill`), `white-space: nowrap`. Copy is a verb + object, ≤ 3 words:
  *"Start a project"*, *"Message us"*. Never wraps to two lines at any width.
- **Secondary**: outlined chip (C1), `--color-rule` border, ink label. Same pill
  radius. Used for *"See the work"*.
- **Tertiary**: typographic link (C3) with a drawn accent underline on hover.
- One primary CTA per viewport. The persistent nav pill carries the global one.

## Per-page allowances

- **Marketing** MAY use enrichment: the showcase screenshots. **The aurora
  photograph is retired outright** (2026-08-14) — generic, and it pulled the
  palette back toward the blue carbon exists to replace. It briefly survived on
  the blog masthead; that was wrong twice over. Composited through
  `opacity-80` + a `carbon/30` tint + a 160px bottom fade + the text scrim it
  rendered as a near-black band, and it cost 186KB on the LCP path because the
  masthead loads `priority`. "Nothing rests on it" was an argument for deleting
  it. `BlogHeroSection` now takes an optional `imageUrl` with **no default**: a
  masthead renders only when the content supplies a real `featuredImage`.
  The Tier-A interactive demo is also gone — it had been unreferenced since the
  v2 hero, while still emitting a foreign palette into the CSS bundle.
- **Content** pages: typography only. No enrichment.
- **Showcase** pages: the work's own screenshots are the enrichment. Nothing added.

## What pages MUST share

- The wordmark and its placement in the N12 bar.
- The accent colour, its lock, and its ≤ 5 % budget.
- Archivo + Instrument Sans + Geist Mono, by token, never by literal.
- The CTA voice — pill radius, padding rhythm, verb-first copy.
- The N12 banner+retract nav and the Ft4 dense colophon footer.
- **Honest copy.** No invented metrics, client names or testimonials.
  The Process section's durations were confirmed by the client on 2026-08-14 and
  now live in `messages/*.json` (`process.stages.*.duration`) so they translate.
  They are commitments, not estimates — blank a value to fall back to "to
  confirm" rather than publish one you cannot hold to.
- The section-head pattern: display heading with a drawn accent underline
  beneath the first line — stacked vertically, never a two-column tag-left head.

## What pages MAY differ on

- Macrostructure within the page-type family.
- Card density and grid span pattern.
- Enrichment, per the allowances above.

## What is explicitly retired

Recorded so a later run doesn't reintroduce them. From `hallmark audit` on
2026-08-13 — 4 critical · 8 major · 6 minor.

- The `hsl(var(--x))` wrapper around `oklch()` values. It produced invalid CSS and
  silently broke every shadcn focus ring in the app.
- The AI nav (wordmark-left · 5 inline links · CTA-right · full-width).
- Four consecutive equal-column card grids.
- The icon-tile card (gradient rounded square → icon → heading → two lines).
- Coloured glow shadows on dark surfaces.
- The hand-drawn browser chrome in `interactive-demo.tsx` (traffic-light dots).
- `styles/globals.css` — dead, never imported. Superseded by `tokens.css`.

## Exports

See `tokens.css` at the project root for the canonical `:root` block; it is
imported by `app/globals.css` and consumed through `tailwind.config.ts`.
