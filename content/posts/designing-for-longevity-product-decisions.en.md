---
title: 'Designing for Longevity: Product Decisions That Last'
excerpt: >-
  Design decisions age badly when nobody recorded the reason. Here is how to
  tell a decision from a taste choice, and how to test one before you commit.
seoTitle: Design decisions that last
seoDescription: >-
  Why design choices get thrown away after a year, how to record the reasoning
  next to the work, and the second-case test that catches shortcuts early.
ctaTitle: Bring one screen you expect to outgrow
ctaDescription: >-
  A free first call, no deck, straight with the engineers. Name the screen or
  process you think will stop fitting soon and we will work out what will not
  hold.
tags:
  - product design
  - design decisions
  - maintainability
  - design systems
  - ownership
date: '2026-11-22'
updated: '2026-11-22'
category: design-ux
author: tika-aurora
pillar: design-systems-for-scalable-products
image: >-
  https://images.unsplash.com/photo-1603901622056-0a5bee231395?ixid=M3w4MTQwNzl8MHwxfHNlYXJjaHwxfHxhcmNoaXRlY3QlMjBkcmF3aW5ncyUyMHdvcmtiZW5jaHxlbnwxfDB8fHwxNzk1MzEwNzc1fDA&ixlib=rb-4.1.0&w=1920&q=80&fm=jpg&fit=max
imageAlt: >-
  Architectural blueprints with drafting pencils, a metal ruler, and a storage
  tube
imageCredit:
  name: Lucas Kepner
  profileUrl: 'https://unsplash.com/@lucaskphoto?utm_source=arktik&utm_medium=referral'
  photoUrl: >-
    https://unsplash.com/photos/architectural-blueprints-with-drafting-tools-Yn8D5B8C-eY?utm_source=arktik&utm_medium=referral
quality:
  owner: 8
  ops: 8
  developer: 7
  voice: 6
  rounds: 1
---
The question usually arrives after the second incident. The site or app built a year ago still runs, but every time the business adds a product line, a location, or a new staff role, some screen has to be pulled apart. The vendor then quotes it like a fresh project.

A design decision lasts when the next person can still find the reason for it. The structural answer to that sits in the [guide to design systems for products that keep growing](/en/blog/design-ux/guides/design-systems-for-scalable-products/).

## What actually breaks first

The part that goes first is almost always the one built around a single case, at the moment the business adds a second.

The shapes repeat: a screen designed for one product type stops working when a second type with different attributes appears, and a label like "Store name" written into the code can only be changed by a developer. Flows get built for one role too, usually the owner who sees everything. Add a cashier and a warehouse clerk who need restricted access and the flow has to be rebuilt.

One more that gets missed: the table designed for four columns. Add a fifth and a sixth and it spreads sideways until nobody can read it on the laptop the admin team actually uses, let alone a phone. On day one nothing is wrong, and the problem only appears at the first change.

## The difference between taste and a decision

A taste choice cannot be re-derived. If the spacing is generous because the designer felt it looked better, the next person has nothing to work from. They can guess at the intent, or throw the choice out and start their own.

A decision has a reason attached to it. The rows are tight because the order table has to hold four columns on the laptop screen the admin team uses. The button sits bottom right because the warehouse clerk works one-handed while holding a box. The word "invoice" is used instead of "bill" because your staff have called it that for years.

Both can produce the same screen, and the difference shows up a year later, when somebody needs to change it and has to know which parts can move and which ones will break somebody's working day.

## Write the reasoning down next to the work

We keep the reasoning behind each decision alongside the code, so whoever inherits the product gets the thinking and not only the files. Design works the same way: a short paragraph beside the screen naming who uses it, on what device, and which constraint gave it that shape.

The part people forget is the rejected option. If filters were tried on the left and pushed the table off the screen, write that down. Without the note, the next designer tries the same thing and spends time arriving at a conclusion you already paid for.

None of this is a thick document. One or two sentences per decision, kept as a short paragraph beside the screen and the equivalent beside the code, rather than in a separate folder opened only during onboarding, because documents that live far from the work are never read and never updated.

## Conventional beats clever

Patterns people already recognise are cheaper to maintain, because a form that looks like a form and a table you can sort by clicking a column heading need no explanation from the person who built them. New staff need no training, and a new developer can add a column without reading anything first.

Unusual interaction becomes a liability the day its author leaves. Custom animation, invented navigation, components built from scratch because the standard one looked plain. All of it works while the person who designed it is still around. After that nobody can find a note saying which constraint forced the hand-rolled version, so rewriting it costs less than reading it.

Inconsistent interfaces are usually the visible symptom of decisions nobody recorded and somebody else later guessed at, which we cover in the piece on [UI consistency and brand trust](/en/blog/design-ux/ui-consistency-and-brand-trust/).

## Build the second case before you need it

Ask whether the screen still makes sense once there is a second of something. That check is narrower than forecasting five years of growth, and it is the one that finds the shortcuts.

Take the screen your team opens most and ask four things. If a new product type arrives with different attributes, does it still fit. If a second location opens, is there anywhere to record which location a record belongs to. If a third staff role appears that should only see part of the data, can the flow be restricted without tearing the page apart. And if the person using it has one hand free, can they still finish a job on this screen.

If any answer is no, a vendor will later bill the repair as new work. Today it is one or two sentences recorded beside the screen. After months of use it means old data has to be migrated and staff have to be retrained. Internal systems get caught by the role question more than any other, and there are examples in the piece on [UX for complex internal systems](/en/blog/design-ux/ux-for-complex-internal-systems/).

## Ownership is part of longevity

Good design is no use if you cannot change it yourself. If one label needs editing tomorrow, who holds the access?

The code, the design files, the servers, the domain and every account are registered to your business from day one rather than handed over at the end of a project. That is what lets the product outlive whoever built it, because nothing depends on us continuing.

The difference shows up on the day you want to replace the people building it. With everything in your name, the next developer can start that week. With the accounts in a vendor's name, their first job is negotiation, and you pay for that time.

## How to test a decision before you commit to it

Decisions that will not hold show up fastest on a screen you can click. We deliver product design as working screens rather than a PDF. A mockup in a document hides the problem until build time, because in a document every table fits and every product name is short.

The person who runs the process every day can open the preview link, do one real job in it, and say which part does not fit. That is possible because there is working software to open every week and a private preview link from week one, so a bad decision surfaces in week two instead of at launch.

## Bring one screen you expect to outgrow

You do not need to prepare a document or a mockup. Name one screen or one process you expect to stop fitting soon, who uses it, and what change is planned in the business. We will work through which parts will not hold and what is worth recording now.

If something is worth building, Discovery gives you a written plan and a fixed price for the first stage. Each later stage is agreed before it starts, so you can stop after any stage, and the plan stays yours whether you continue or not. The first call is free, no deck, straight with the engineers. Use the contact form, which opens WhatsApp, or email hello@arktik.id.
