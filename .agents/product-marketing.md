# Product Marketing Context

**Document version:** v1
**Last updated:** 2026-08-14

> **Draft status.** Auto-drafted from the codebase (`design.md`, `messages/en.json`,
> `messages/id.json`, route structure) — not from customer interviews. Sections
> marked **⚠ NEEDS REAL INPUT** are deliberately empty: filling them from
> inference would fabricate customer language and proof, which both `design.md`
> and this studio's own positioning forbid. Everything else is traceable to
> shipped copy or the locked design system.

## Product Overview
**One-liner:** Custom software, without the black box.

**What it does:** A small software studio in Indonesia that builds custom web and
mobile applications for businesses that have outgrown spreadsheets and
off-the-shelf tools. Scope and price are agreed before each stage begins, working
software ships weekly, and the client owns the code and every account from day one.

**Product category:** Custom software development studio / software house
(Indonesian market, bilingual ID/EN).

**Product type:** Professional services, project-based, with an optional monthly
managed-service line ("Running it after launch" — hosting, monitoring, fixes,
small changes; cancellable, accounts stay in the client's name).

**Business model:** Staged fixed-price engagements. Discovery produces a written
plan and a fixed price that the client keeps whether or not they continue. Each
subsequent stage is agreed before it starts, so the client can stop after any
stage. Optional monthly retainer after launch.

## Target Audience
**Target companies:** Indonesian SMEs and growing businesses whose operations have
outgrown spreadsheets and generic SaaS. Not enterprise procurement; not funded
startups seeking a technical co-founder.

**Decision-makers:** Owner-operators and business leads — the person who feels the
operational pain and controls budget. Typically non-technical, which is why the
"you talk to the engineers, not an account manager" line carries weight.

**Primary use case:** Replace a manual or brittle process with software that is
actually owned by the business.

**Jobs to be done:**
- "Get this process out of spreadsheets before it breaks something."
- "Build the thing without being locked into the people who built it."
- "Know what it costs and when it lands, before committing."

**Use cases (from `services` copy):**
- Customer portals, booking systems, internal systems, online shops
- Internal systems and third-party integrations
- Automation and AI where manual work is the bottleneck (documents, sorting
  requests, summarising, internal assistants)
- Technical consulting — a review or second opinion for teams that already have
  developers
- Product design delivered as working screens, not a PDF
- Post-launch operation for teams who would rather not run it themselves

## Personas
| Persona | Cares about | Challenge | Value we promise |
|---|---|---|---|
| Owner / business lead (decision maker + financial buyer, usually the same person) | Cost certainty, not getting stranded | Has been burned or has heard of being burned by an agency | Price agreed per stage; stop after any stage; the plan is yours regardless |
| Operations lead (user, champion) | Whether the thing actually fits the work | Current process is manual, brittle, or lives in one person's head | Weekly working software they can open and react to |
| Internal/contract developer (technical influencer, when present) | Whether they can maintain it after handover | Inheriting undocumented, exotic code | Proven, conventional tech; reasoning recorded alongside the code |

## Problems & Pain Points
**Core problem:** Commissioning custom software is opaque. The buyer cannot see
progress, cannot predict cost, and ends up dependent on the vendor afterwards.

**Why alternatives fall short:**
- Agencies: the people who pitched are not the people who build; progress is
  invisible until a big reveal; scope changes become invoices
- Freelancers: cheap and fast until they disappear, with no documentation
- Off-the-shelf SaaS: fine until the business outgrows it — which is the trigger
  event for this buyer
- Offshore shops: cost advantage offset by communication distance and handover risk

**What it costs them:** Time lost to manual process, decisions made on stale data,
and — when a build goes wrong — the sunk cost plus starting over.

**Emotional tension:** Fear of being taken for a ride on something they cannot
evaluate technically. The whole site is built to defuse that specific fear.

## Competitive Landscape
**⚠ NEEDS REAL INPUT — no competitor research has been done.** The categories below
are inferred from positioning; no specific competitors have been named or profiled.

**Direct:** Indonesian software houses and digital agencies — fall short on
transparency and continuity (swapped teams, subcontracting, invisible progress).
**Secondary:** Freelancers and small dev collectives — fall short on documentation,
continuity, and handover.
**Indirect:** Off-the-shelf SaaS and no-code — fall short only once the business
outgrows them, which is precisely when this buyer appears. Note: Arktik
*deliberately* sends people back to this option when it fits ("We say no").

## Differentiation
**Key differentiators:**
- Scope and price agreed in writing **before each stage**, so the client can stop
  after any stage without an argument
- Client owns the code, servers, domain and every account **from day one**, not at
  handover
- Direct contact with the engineers; nothing subcontracted, nobody swapped after
  signing
- Will actively tell a prospect not to buy if an off-the-shelf tool solves it
- Decisions and their reasoning recorded alongside the code, so the next person
  inherits the thinking, not just the files
- Optional post-launch operation — staying is the client's choice, not a contract
  obligation

**How we do it differently:** Transparency is structural, not a promise. Weekly
working demos, a private preview link from week one, staged fixed prices, and
day-one ownership are mechanisms the client can verify.

**Why that's better:** It removes the buyer's largest risk (being stranded mid-build
or afterwards) without asking them to trust a claim they can't evaluate.

**Why customers choose us:** ⚠ **NEEDS REAL INPUT** — no win/loss data exists.

## Objections
| Objection | Response |
|---|---|
| "You're new — where's your portfolio?" | Three projects, delivered and handed over. The process is the argument, and every stage is agreed before it starts, so the risk of trying us is one stage. |
| "Custom software is expensive." | Agreed — which is why we'll tell you if an off-the-shelf tool solves it. Discovery gives you a written plan and a fixed price that's yours to keep either way. |
| "What if you disappear?" | The code, servers, domain and accounts are in your name from day one. Nothing depends on us continuing. |
| "Who am I actually working with?" | The engineers. Nobody is swapped out after signing and nothing is subcontracted. |

**Anti-persona:** Anyone whose problem an existing tool already solves — Arktik
sends them to that tool. Also: buyers wanting the cheapest possible bid, and
enterprises needing formal procurement, RFPs, or large-team scale.

## Switching Dynamics
**Push:** Spreadsheets breaking, a process only one person understands, an
off-the-shelf tool that no longer fits, or a previous build that went badly.
**Pull:** Cost certainty per stage, visible weekly progress, day-one ownership.
**Habit:** "The spreadsheet still works" — inertia plus fear of disruption.
**Anxiety:** Being unable to judge technical quality; getting locked in; paying for
something that never ships.

## Customer Language
**⚠ NEEDS REAL INPUT — this section is currently inference, not verbatim.**
No customer interviews, sales calls, or support tickets have been mined. Populate
from real transcripts before using this for copy; invented "customer language" is
worse than none, because it reads plausible and is wrong.

**How they describe the problem:** _(to capture — likely in Indonesian)_
**How they describe us:** _(to capture)_

**Words to use** (established in the copy pass, both locales):
Plain and concrete — "agreed", "handed over", "in your name", "working software",
"stop after any stage", "we say no". Indonesian register: formal *Anda*, and
*tidak mau repot* for the buyer who'd rather not run it themselves.

**Words to avoid** (all removed from the site during the v2 copy pass — do not
reintroduce):
"solutions", "insights", "expertise", "Knowledge Hub", "drive business growth",
"team of experts", "ambitious ideas", "elevate", "unlock", "seamless",
"streamline", "cutting-edge", "innovative", "empower", exclamation marks, and any
invented metric or statistic.

**Glossary:**
| Term | Meaning |
|---|---|
| Discovery | Stage 1 (1–2 weeks). Produces a written plan + fixed price the client keeps regardless. |
| Handover | Stage 4 (1 week). Ownership is *confirmed*, not transferred — the client already owns everything from day one. |
| Running it after launch | The optional monthly managed service. Accounts stay in the client's name. |

## Brand Voice
**Tone:** Plain, direct, understated. Confident without adjectives. British
spelling ("summarising", "organised").

**Style:** Second person. Short declarative sentences. Specific over vague — name
the number, the week, the artefact. States what it will *not* do as readily as
what it will. No exclamation marks. Never invents a metric, duration, client name,
or testimonial (`design.md`, "Honest copy").

**Personality:** Candid · precise · unshowy · senior · disciplined.

## Proof Points
**Metrics:** ⚠ **NEEDS REAL INPUT.** The studio publishes no performance metrics by
design — `design.md` forbids invented ones, and no real ones have been supplied.
Do not add any without a source.

**Customers:** Three delivered projects — Lenggah (e-commerce), Mata Screen Print
(business site), Serenity Cove (hotel landing page).
⚠ **Serenity Cove links to a `vercel.app` subdomain**, unlike the other two, which
have real client domains. Confirm whether it is client work or a self-initiated
demo — `works.subtitle` currently claims all three were "agreed, delivered, and
handed over in full."

**Testimonials:** None. ⚠ Founders are deliberately anonymous and there are no
client logos or quotes; `design.md` states the design carries the trust that
content usually would.

**Value themes:**
| Theme | Proof |
|---|---|
| Cost certainty | Stage-gated fixed prices; Discovery plan is yours either way |
| No lock-in | Code, servers, domain, accounts in the client's name from day one |
| Real access | Direct engineer contact; nothing subcontracted |
| Maintainability | Proven conventional tech; reasoning recorded with the code |
| Honesty | Will tell you to buy off-the-shelf when that's the right call |
| Seniority | Seven years building product inside established technology companies |

## Goals
**Business goal:** Win first-stage engagements (Discovery) from Indonesian SMEs;
convert delivered projects into ongoing monthly operation where the client wants it.

**Conversion action:** Start a conversation — contact form that opens WhatsApp
(+62 851-1769-7889), or email hello@arktik.id. The offer is a free first call with
no deck, and the resulting plan is the client's to keep.

**Current metrics:** ⚠ **NEEDS REAL INPUT** — no analytics baseline captured here.
GTM (GTM-WDNKG95C) and Vercel Analytics are installed; `lead_form_start` and
`generate_lead` events fire on the contact form.

## Changelog
*Newest first. One line per revision: what changed and why.*
- v1 (2026-08-14) — Initial context, auto-drafted from `design.md`, both locale
  message files, and the v2 copy pass. Customer language, competitors, win/loss
  and metrics left explicitly empty rather than inferred.
