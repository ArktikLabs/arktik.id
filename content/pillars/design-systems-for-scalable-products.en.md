---
title: 'Design Systems: Keeping One Product Consistent as It Grows'
introduction: >-
  A design system earns its cost at the point where your product stops being a
  handful of screens and becomes something people work in every day. Before
  that, building one usually adds work rather than removing it. It contains less
  than the term suggests: components the developers call directly in code, rules
  about when each one is used, and a written record of why the choices were
  made. This guide covers what goes inside, the symptoms that say you need one,
  when to skip it, and two numbers you can use to decide.
seoTitle: 'Design Systems: What They Are and When to Build One'
seoDescription: >-
  What a design system contains, the symptoms that say your product needs one,
  when to skip it, and how to decide using the number of screens you have
ctaTitle: Show us the screens you already have
ctaDescription: >-
  A free first call, no deck. Open your product with us and we will say whether
  a design system is worth paying for yet. If it is, Discovery gives you a
  written plan and a fixed price that stays yours either way.
date: '2026-10-17'
updated: '2026-10-17'
category: design-ux
author: tika-aurora
image: >-
  https://images.unsplash.com/photo-1692465422791-7456ef767879?ixid=M3w4MTQwNzl8MHwxfHNlYXJjaHwxfHx3b29kZW4lMjBkcmF3ZXIlMjB0eXBlJTIwYmxvY2tzfGVufDF8MHx8fDE3OTIyMDA0Mzh8MA&ixlib=rb-4.1.0&w=1920&q=80&fm=jpg&fit=max
imageAlt: a bunch of wooden boxes sitting on top of a table
imageCredit:
  name: Giacomo Carra
  profileUrl: 'https://unsplash.com/@giacomocarra?utm_source=arktik&utm_medium=referral'
  photoUrl: >-
    https://unsplash.com/photos/a-bunch-of-wooden-boxes-sitting-on-top-of-a-table-DjMzEKYwwm4?utm_source=arktik&utm_medium=referral
quality:
  owner: 8
  ops: 7
  developer: 8
  voice: 7
  rounds: 0
---
Most people hear design system and picture a brand document: colour swatches, logo spacing, a page about tone of voice. That document is a different object, and developers rarely open it twice.

What changes how a product grows is a set of components living in the codebase, with rules attached and reasons written down. Below is what that contains, when it is worth buying, and when we will tell you to wait.

## What a design system actually contains

The first layer is components: buttons, input fields, tables, notifications, and the view a screen shows when there is no data yet. These exist as code a developer can call, not as pictures inside a design file.

Underneath the components sit tokens, which are the base values used over and over: colours, the spacing between elements, type sizes, corner radius. Tokens let one small change apply across the whole product. Correct the brand blue once and every screen follows, so you stop having two versions of it in circulation at the same time.

The third layer is usage rules. These answer when the primary button is used and when it is not, how a date is written, where error messages sit, and how a long table behaves on a phone. Without rules, a collection of components is a drawer of parts that can still be assembled four different ways.

The layer most often missing is the record of reasoning. It explains why the delivery form was split into two steps, or why deleting a record asks the user to type the name again instead of ticking a box. Someone arriving a year later needs that. Without it, they will simplify something that was made complicated on purpose.

Accessibility requirements are also cheapest to enforce inside shared components. Colour contrast, touch target size and labels on input fields get fixed once in the button, then hold wherever the button appears. The business case for that is in our piece on [accessible and inclusive design](/en/blog/design-ux/accessibility-inclusive-design-for-business/).

Two things get mistaken for a design system. One is a PDF of colour and logo guidance, which no developer opens. The other is a pile of components with no rules and no reasoning, which still produces a fresh argument every time someone adds a screen.

## The symptoms that say you need one

The symptoms show up in daily work rather than in strategy meetings:

- Four screens display a date four different ways, and your admin has to pause to tell a date apart from a reference number.
- Adding one small feature costs a week of design discussion, because no earlier decision can be used as a precedent.
- New staff learn every page separately, since the save button moves around.
- Two shades of the same brand blue are running in production and nobody knows which is correct.

All four come from the same cause: each screen was built as a new decision. While the product is three or four pages, that costs very little. Once you pass a dozen screens and more than one person is adding to it, the cost accumulates in developer time and in the time of the staff using the system.

Internal systems feel the benefit most, because the same people open the same screens dozens of times a day. We go into that at length in [UX for complex internal systems](/en/blog/design-ux/ux-for-complex-internal-systems/).

## When a design system is the wrong purchase

We will tell you to wait if your product is a single flow, say a sign-up form with one confirmation page. The same applies to a landing page, and to a build that is still testing whether anyone wants the thing.

In those cases a design system adds work up front for a consistency nobody has felt the absence of. Worse, it locks in design decisions before you know what shape the product should be.

At small scale the right answer is usually already available: take a mature component library, then add one short page of rules. Brand colours, type sizes, how dates and currency are written, and the list of components allowed. That single page does most of the job and costs close to nothing.

If the library you can already install covers what you need, we will show you and suggest you stop there. The wider question of when design is worth paying for is covered in [the business value of UX design](/en/blog/design-ux/guides/business-value-of-ux-design/).

## Building it out of work that already shipped

A design system drawn up on paper before the product exists is almost always the wrong size. Some components never get used, and some real needs have no component at all.

The safer order starts from work already running. Build the first screens against real requirements. After a few weeks, look at what repeats: tables with filters, summary cards, confirmation dialogs. Promote the repeats into shared components, and write down the reason for each shape while it is still fresh.

Staged delivery suits that order, because scope and price for each stage are agreed in writing before the stage starts. You can approve one stage to promote the components that have proven they repeat, then stop if you think that is enough. Nothing commits you to the whole system at the outset, and stopping after any stage does not have to become a dispute.

## Design delivered as working screens

What we hand over is working screens, not a PDF. The components arrive as code the developers use directly.

A design file with no coded counterpart drifts within weeks. The developer hits a case the file does not cover, a product name too long for the card or a table that has to fit a mid-range phone. They decide it in code, the design file is not updated, and from then on the two tell different stories. A few months later nobody trusts the file.

Because the components live in the code, you can watch the system work instead of reading a description of it. There is a working demo every week and a private preview link from the first week. Open three different screens and see for yourself whether the buttons, the spacing and the date format match.

## Who maintains it after launch

The components, the repository and every account are in your company's name from day one rather than transferred at the end. Handover only confirms what has been yours since the start.

The reasoning behind each decision is recorded alongside the code it belongs to. An internal or contract developer arriving later needs a few things to add a component without breaking the old ones: a list of the existing components and how to call them, the tokens as the single source for colour and spacing values, and the notes explaining why a particular rule exists. With those, they inherit the thinking rather than a folder of files.

If your team would rather not handle updates and small fixes, there is a monthly service for running it. It is optional, cancellable, and the accounts stay in your name.

## What it costs and when it pays back

A design system adds cost at the start. Promoting components, tidying tokens and writing the rules produce no new screens for your customers.

The return arrives on the fourth screen, the tenth and the twentieth. New screens get assembled from parts that already exist and have already been tested, rather than designed again. The more screens you still intend to build, the sooner the difference closes.

You can rest the decision on two numbers you already know. First, how many screens are planned over the next year. If the answer is under ten, an existing library plus one page of rules is usually enough. Second, how many people will add something to the product next year, counting contract developers and anyone touching design. If that answer is more than one person, consistency has to be agreed in one place, and a shared system starts to make sense.

If both numbers are small, wait. If both are large, build it out of screens that already shipped, one stage at a time, with the price agreed before each stage begins.

## Show us the screens you already have

There is no ebook to download here and no deck. Open your current product with us on a free first call, and we will count together how much repeats and how many screens you still have planned.

If the honest answer is an existing library plus one page of rules, we will say so. If a design system is worth paying for, Discovery gives you a written plan and a fixed price. Both stay yours whether or not you continue with us.

Message us on WhatsApp at +62 851-1769-7889 or email hello@arktik.id.
