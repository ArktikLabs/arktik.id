# Product Marketing Context

**Document version:** v5
**Last updated:** 2026-08-14

> **Provenance.** Drafted from the codebase (`design.md`, both locale message
> files, route structure) and confirmed with the founders on 2026-08-14.
> Two things are known-unknown by decision rather than by omission: there is **no
> voice-of-customer data**, and the studio publishes **no metrics or testimonials**
> on purpose. Do not fill either from inference — see those sections. Everything
> else is traceable to shipped copy or the locked design system.

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

### Direct — named by the founders as who they're compared against

**Antikode** (antikode.com) — "Digital Customer Experience & Development Agency".
Positions on scale and polish: *"Leading in Designing and Developing Seamless
Digital Experiences"*, *"design, development, and strategy that drive real
impact"*. Nav is Services / Work / Contact; publishes "Featured Insights".
*Profiled from their live site on 2026-08-14 — homepage copy only, not a deep audit.*

> **The gap is tonal as much as operational.** Antikode speaks the established-agency
> register — "seamless", "drive real impact", "leading" — which is precisely the
> vocabulary Arktik's v2 copy pass removed. Against them, Arktik is the
> anti-agency: named mechanisms (staged fixed price, day-one ownership, weekly
> demos) instead of adjectives. Do not compete on polish; compete on verifiability.
> Falls short for this buyer on: no visible cost model, agency-scale process
> implies account management between client and engineer.

**Nore Inovasi** (nore.co.id) — full-service Indonesian IT provider: consulting,
websites, information systems, mobile apps, **digital marketing**, and system
maintenance. Positioning pillars are literally *"Easy · Inovative · Affordable"*.
Headlines: *"Let us do the work, so you can focus on what matters"* and *"We Don't
Just Build Projects. We Solve Problems."* Nav carries Portfolio and Insights.
Claims "Affordable" but shows no pricing.
*Profiled from their live site on 2026-08-14 — homepage only.*

> **Two distinct tensions here, and they pull opposite ways.**
>
> **Price.** Nore competes on affordability. Arktik must not follow — the studio's
> stated position is that custom software is expensive and should be the right
> call, and that it quotes what the work costs rather than what wins the deal. If
> a prospect is choosing on price, Nore is a legitimate answer and Arktik should
> say so; that refusal is the "We say no" differentiator working as intended.
>
> **Delegation vs visibility.** "Let us do the work, so you can focus on what
> matters" sells *not having to look*. Arktik sells the opposite — weekly demos, a
> preview link from week one, decisions written down. Same buyer instinct
> (*tidak mau repot*), opposite answer. Note the overlap: Arktik's own "Running it
> after launch" serves that instinct too, but as an **optional service after
> ownership transfers**, not as the shape of the whole relationship. Keep that
> distinction sharp in copy or the two blur.
>
> Falls short for this buyer on: "Affordable" with no published pricing is the
> same cost opacity Arktik attacks; broad scope including digital marketing means
> software is one line of many, not the craft.

**Code.id / PT Code Development Indonesia** (code.id) — "Custom Software
Development Company", Jakarta **and Australia**, **15+ years**. Services span
custom software, IT outsourcing ("Smartsourcing"), AI and cloud. Also sells its
own products (Activo asset management, Klaim management, ROCKEYE). Site carries
Our Projects, Blog, and a Career section. H1: *"Empower Your Business with
AI-Powered Custom Software – Smarter, Faster, and Built for the Future."*
No pricing shown. Enterprise/corporate signals throughout.
*Profiled from their live site on 2026-08-14 — homepage only.*

> **The hardest competitor on paper, and the wrong one to fight head-on.**
> Code.id has precisely what Arktik lacks: fifteen years, a named legal entity,
> two countries, a hiring pipeline, a visible project list, and its own shipped
> products. Any comparison decided on track record or scale is lost before it
> starts. **Do not try to out-credential them.**
>
> The counter is that their strengths carry costs Arktik doesn't have. Scale
> implies an account layer between buyer and engineer — which is the exact thing
> `header.banner` attacks ("You talk to the engineers, not an account manager").
> "IT Outsourcing / Smartsourcing" is a bodies-for-hire model; Arktik sells a
> fixed-scope outcome per stage. And a company selling its own products has an
> incentive to steer you toward them, where Arktik's stated position is to send
> you to an off-the-shelf tool when it fits.
>
> **Segment away, don't argue.** Code.id is built for enterprise and corporate
> buyers with procurement. Arktik's ICP is the SME owner-operator who wants the
> person building it on the other end of WhatsApp. Those are different buyers;
> competing for Code.id's is a losing use of a three-project portfolio.
>
> Falls short for this buyer on: no cost model, enterprise process overhead,
> and the same "Empower / AI-Powered / Smarter, Faster" register Arktik removed.

### Positioning map — where each one sits

| | Competes on | Buyer promise | Arktik's counter |
|---|---|---|---|
| **Code.id** | Track record, scale, capability breadth | "15+ years, AI-powered, one-stop" | Segment away — no account layer, small and senior |
| **Antikode** | Polish, scale, brand | "Seamless experiences, real impact" | Verifiable mechanisms beat adjectives |
| **Nore** | Price, breadth, convenience | "Let us handle it, affordably" | We quote what it costs; you watch it get built |
| **Freelancers** | Cost, speed | "Cheap and quick" | Documentation, continuity, handover |
| **Off-the-shelf** | Zero build cost | "It already exists" | We'll send you there when it fits |

**Pattern across all three named competitors:** every one leads with a capability
adjective — *seamless*, *affordable*, *AI-powered* — and none publishes a cost
model or a stop-point. They are differentiated from each other but identical in
what they ask of the buyer: trust the claim.

**The open lane:** none of the named competitors publishes a cost model or a
stage-gated commitment. Cost certainty *before* committing is the least contested
ground Arktik holds — and it is the one thing the buyer most fears getting wrong.

### Secondary
Freelancers and small dev collectives — fall short on documentation, continuity,
and handover.

### Indirect
Off-the-shelf SaaS and no-code — fall short only once the business outgrows them,
which is precisely when this buyer appears. Note: Arktik *deliberately* sends
people back to this option when it fits ("We say no").

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

**Why customers choose us:** Trust — stated by the founders (2026-08-14). No
win/loss interviews exist, so this is self-assessed rather than customer-reported.

**How to use that in copy — important.** "Trustworthy" is what every agency
claims, so asserting it is worthless; this studio wins because it makes trust
*checkable*. Never write "we are trustworthy". Write the mechanism that would let
someone verify it without taking your word:

| Instead of claiming | Show the mechanism |
|---|---|
| "You can trust us" | Price and scope agreed in writing before each stage; stop after any stage |
| "We're transparent" | A working demo every week and a private preview link from week one |
| "No lock-in" | Code, servers, domain and accounts in your name from day one |
| "We're honest" | We will tell you to buy the off-the-shelf tool when it fits |
| "Senior team" | You talk to the engineers; nothing subcontracted, nobody swapped |

Every one of those is falsifiable, which is what makes it persuasive to a buyer
who cannot evaluate the technical work.

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
**Status: not collected, and no source currently available** (confirmed with the
founders, 2026-08-14). There are no interview transcripts, and this is not a
pending task — treat the two fields below as genuinely unknown.

**Do not fabricate them.** Any downstream skill that wants voice-of-customer must
work from the *words-to-use / words-to-avoid* lists below, which are real (they
come from the shipped bilingual copy), rather than inventing quotes. A plausible
invented verbatim is worse than an empty field, because it silently steers every
piece of copy that reads it.

**If a source ever opens up:** the contact form opens WhatsApp, so inbound lead
threads are a real corpus of customer language in Indonesian, already in the
founders' possession — no scheduling required.

**How they describe the problem:** _unknown_
**How they describe us:** _unknown_

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
**Metrics:** None, and that is a settled decision — not a gap (founders, 2026-08-14).
The studio publishes no performance metrics. `design.md` forbids invented ones, and
the design is explicitly built to carry trust that proof content usually carries.
Do not add a metric to any page without a real, attributable source.

**Customers:** Three delivered projects — Lenggah (e-commerce), Mata Screen Print
(business site), Serenity Cove (hotel landing page). All three are presented as
delivered and handed over; closed at the founders' direction on 2026-08-14.

**Testimonials:** None, by choice (founders, 2026-08-14). Founders are deliberately
anonymous and there are no client logos or quotes. `design.md` states the design
carries the trust that content usually would. The `/blog/case-studies` route
therefore ships an honest empty state rather than filler — that copy is doing real
work and should not be replaced with placeholder studies.

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
- v5 (2026-08-14) — Replaced Metatech (unreachable) with Code.id / PT Code
  Development Indonesia, the closest category competitor and the strongest on
  paper: 15+ years, two countries, own products. Guidance is to segment away
  rather than out-credential. Noted the pattern across all three — every one
  leads with a capability adjective and none publishes a cost model.
- v4 (2026-08-14) — Added Nore Inovasi (competes on price and breadth, and sells
  delegation where Arktik sells visibility). Added a positioning map across all
  four competitor types; named cost certainty before committing as the least
  contested ground Arktik holds.
- v3 (2026-08-14) — Closed Metrics and Testimonials as deliberate choices, not
  gaps. Recorded "why customers choose us" as founder-stated trust, with a
  claim→mechanism table so downstream skills show trust instead of asserting it.
  Marked customer language as unavailable rather than pending.
- v2 (2026-08-14) — Competitive Landscape: added Antikode (profiled from their live
  site; the differentiation against them is tonal as well as operational) and
  Metatech (named, unreachable, unprofiled). Closed the Serenity Cove flag in
  Proof Points at the founders' direction.
- v1 (2026-08-14) — Initial context, auto-drafted from `design.md`, both locale
  message files, and the v2 copy pass. Customer language, competitors, win/loss
  and metrics left explicitly empty rather than inferred.
