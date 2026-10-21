---
title: 'CI/CD, Explained for the Person Paying for the Build'
excerpt: >-
  CI/CD is automatic checking and releasing, and the reason you can open a link
  and try your software instead of reading a status report.
seoTitle: What CI/CD Means If You Are Paying for the Build
seoDescription: >-
  A plain explanation of continuous integration and delivery for business
  owners: what runs automatically, what it changes, and what to ask a vendor.
ctaTitle: Tell us how often your software will change
ctaDescription: >-
  A free first call with no deck. Describe the process you want to move into
  software and how often its rules shift, and Discovery gives you a written plan
  with a fixed price that stays yours whatever you decide.
tags:
  - ci cd
  - weekly demos
  - handover
  - vendor questions
date: '2026-10-21'
updated: '2026-10-21'
category: software-development
author: tika-aurora
pillar: agile-lean-development-for-businesses
image: >-
  https://images.unsplash.com/photo-1683322499436-f4383dd59f5a?ixid=M3w4MTQwNzl8MHwxfHNlYXJjaHwxfHxzZXJ2ZXIlMjByYWNrJTIwY2FibGVzfGVufDF8MHx8fDE3OTI1NDU4NDN8MA&ixlib=rb-4.1.0&w=1920&q=80&fm=jpg&fit=max
imageAlt: a bunch of blue wires connected to each other
imageCredit:
  name: Scott Rodgerson
  profileUrl: 'https://unsplash.com/@scottrodgerson?utm_source=arktik&utm_medium=referral'
  photoUrl: >-
    https://unsplash.com/photos/a-bunch-of-blue-wires-connected-to-each-other-PSpf_XgOM5w?utm_source=arktik&utm_medium=referral
quality:
  owner: 8
  ops: 7
  developer: 7
  voice: 7
  rounds: 0
---
When CI/CD turns up in a technical proposal, it means automatic checking and automatic releasing. Every time a developer saves work into the shared codebase, a set of checks runs on its own. If those checks pass, the change goes up to a server and you can open it in a browser.

What changes for you is what you can see for yourself. Without this arrangement, progress reaches you as a status report. With it, you open a link and try the thing.

## What the two terms actually mean

Integration, the CI half, refers to merging code. Say two developers are working on one booking application. One is fixing the booking form, the other is changing how the total is calculated. Each time either of them saves work into the shared codebase, a machine runs checks to confirm the change has not broken something that already worked.

Delivery, the CD half, is the route from a passing check to software running on a real server. That fix to the booking form does not wait for someone to upload it by hand. Once it passes, it is sitting at an address you can open a few minutes later.

Both are usually set up once at the start of a project and then run without anyone tending to them. In proposals, the whole arrangement is often called a pipeline.

## The release day it replaces

The older shape of this was accumulation. Developers worked on their own machines for several weeks, everything was merged close to the release date, and the result was pushed to a server over one long evening.

If something broke that evening, nobody knew which part caused it. Dozens of changes had landed together and all of them were suspects. Tracing it took days, and your software was unusable throughout.

The cost to you arrives earlier than that. For weeks there is nothing you can try. Then the first thing you see is also the first thing that fails, in front of staff you gathered for training, and you are forced into a rushed decision: postpone, or use it as it is.

## What runs on every change

The sequence is roughly three steps, all of them automatic.

First, tests on the logic. If the rule is "the discount only applies above a certain order value", a check feeds in several figures and confirms the result matches the rule. Second, a check that the application still assembles into a working whole, because a single mistyped line can stop an entire page from rendering. Third, a release to a private preview link, which is a copy of the application only you and the team can open.

If any check fails, the change stops there. Customers never see it, and your admin does not find it during the busy hour. The failure is also recorded somewhere you can look, not only on a developer's laptop, so "there is still something to sort out" is something you can check yourself.

## Why this is what makes a weekly demo real

We ship working software every week, and a private preview link exists from the first week. Neither is possible unless pushing a change to a server is cheap and automatic.

Where every release needs one person, one evening and a long list of manual steps, no team will do it weekly. The weekly demo then turns into a presentation of screenshots, a progress list and a promise that you will be able to try it later, which puts you back to trusting the report.

We cover the weekly rhythm and how it works in the [guide to development you can watch happen](/en/blog/software-development/guides/agile-lean-development-for-businesses/). If you want to see which stage the preview link and the demos appear in across a whole project, the sequence is in [from idea to launch](/en/blog/software-development/from-idea-to-launch-end-to-end-development-approach/).

## What it means for you after handover

The release setup lives in your accounts, alongside the code, the servers and the domain. All of it is in your name from day one. At handover, ownership is confirmed rather than transferred.

The effect shows up when you hire your next developer. The setup is stored as files inside the project rather than as a habit in somebody's head, so that developer can read how your software is tested and released. The reasoning behind each decision is recorded next to the code, so what they inherit includes the thinking.

The tooling is conventional and proven rather than exotic. A new developer does not have to reconstruct the release process from a chat history or learn a tool almost nobody else uses.

## Fair questions to ask about it

These four work with any vendor, and you can judge the answers without reading code.

- Where is the preview link, and from which week can I open it.
- What runs automatically before a change reaches users.
- How long between my approving a change and that change being live.
- Whose account holds the release setup.

The shape of the answer tells you most of it. A vendor who has this in place will name an address, a service and a number of minutes, while one who does not will answer with adjectives. What else you can reasonably ask of a working relationship is set out in [what to expect from a software house partnership](/en/blog/software-development/what-clients-should-expect-in-a-software-house-partnership/).

## When it is more setup than the project needs

Honestly, not every project needs the same machinery. A company profile site whose content changes a few times a year can get by with far less than a booking system that handles customer money and is used every day.

What decides it is how often your software will change. If the answer is nearly every week all year, the automation saves more than it costs to set up. At twice a year, something simpler is enough and the rest of the budget is more useful elsewhere.

A third possibility gets missed often. If the process is actually finished by an off-the-shelf tool sold monthly, we will say so. You spend nothing on a build, and the whole question of releases disappears with it.

## Tell us how often your software will change

You do not need a technical requirements list. Describe the process you want to move into software, then your estimate of how often its rules shift: prices, opening hours, how delivery charges are worked out. From there we can talk about what your release process should look like. The first call is free and there is no deck.

If an off-the-shelf tool already solves it, we will say so. If something does need building, Discovery gives you a written plan and a fixed price, and that document is yours whatever you decide afterwards. Use the contact form, which opens WhatsApp, or email hello@arktik.id.
