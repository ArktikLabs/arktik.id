---
title: 'Microservices or a Monolith: Which One Fits Your Business'
excerpt: >-
  Microservices and monoliths are two ways of splitting up code. For most small
  companies the single application is cheaper and easier to maintain.
seoTitle: Microservices or a Monolith for a Small Company
seoDescription: >-
  What microservices and monoliths actually mean, what splitting a system costs
  you each month, and the signals that justify it. Written for owners.
ctaTitle: Bring your architecture question to the first call
ctaDescription: >-
  A free first call with no deck, straight with the engineers. Describe the
  process and bring any quote you have. Discovery gives you a written plan and a
  fixed price that stays yours whatever you decide.
tags:
  - architecture
  - microservices
  - monolith
  - vendor questions
  - maintainability
date: '2026-10-25'
updated: '2026-10-25'
category: software-development
author: tika-aurora
pillar: software-architecture-future-proofing-for-business-owners
image: >-
  https://images.unsplash.com/photo-1606964212858-c215029db704?ixid=M3w4MTQwNzl8MHwxfHNlYXJjaHwxfHxzaGlwcGluZyUyMGNvbnRhaW5lcnMlMjBjcmFuZXxlbnwxfDB8fHwxNzkyODkxNTYzfDA&ixlib=rb-4.1.0&w=1920&q=80&fm=jpg&fit=max
imageAlt: red and blue cargo containers
imageCredit:
  name: Barrett Ward
  profileUrl: 'https://unsplash.com/@barrettward?utm_source=arktik&utm_medium=referral'
  photoUrl: >-
    https://unsplash.com/photos/red-and-blue-cargo-containers-5WQJ_ejZ7y8?utm_source=arktik&utm_medium=referral
quality:
  owner: 8
  ops: 7
  developer: 7
  voice: 7
  rounds: 0
---
When a vendor or a developer says microservices, they are talking about how the code is divided. Your system can be built as one application, or as several small applications that talk to each other over a network. Both can run exactly the same business process.

For most small and mid-sized companies, one whole application is cheaper and easier to maintain. The decision is worth holding onto because it changes your monthly bill, who you can hire, and how easily the next developer picks up the work. The other architecture decisions that belong to you rather than to your vendor are collected in the [guide to software architecture for business owners](/en/blog/software-development/guides/software-architecture-future-proofing-for-business-owners/).

## What the two words actually describe

Take an order system. Inside it there are three jobs: checkout, stock deduction, and invoicing.

If those three jobs live in one program deployed to one server, that shape is a monolith. One application, one release process, one database. The word sounds like an insult and only means whole.

If the three are separated into three applications, each deployed on its own and sending messages across a network, that shape is microservices. Checkout calls the stock service, the stock service answers, then the invoice service runs afterwards. Your customer cannot tell the difference. What differs is the number of parts that have to be run, watched and maintained.

## Why microservices became the default answer

The shape came out of a problem large companies have. With hundreds of developers in one codebase, they wait on each other. One team cannot ship a small fix because it has to ride another team's release schedule. Splitting the system gives each team its own piece and its own release button.

The second problem is load. In a company with very uneven traffic, one part of the system gets hit far harder than the rest. Separating it lets that part be scaled up on its own instead of duplicating the whole application.

Both problems are real, and splitting makes sense for the companies that have them. Then the approach got copied by teams that have neither. The word also reads well in a proposal. Microservices sounds more advanced than "one application", so it gets included as a signal that the vendor keeps up. Before you judge the architecture, settle whether building at all is the right move; that sequence is in the [guide to custom software development](/en/blog/software-development/guides/custom-software-development-definitive-guide/).

## What splitting a system apart costs you

Every separated service needs its own release process, its own monitoring, its own logs. On top of that sits the harder problem: the data boundaries have to be clear so two services never change the same stock figure. Three services mean three sets of that work.

Finding the cause of a problem also gets longer. In one application, a developer follows a single path through the code from start to finish. With five services, one failed order can stop anywhere between five applications and the network between them. The developer has to gather logs from five places before knowing which part went wrong. Meanwhile your admin is looking at an order hanging with no status, and the customer is waiting for an answer nobody can give until the cause turns up.

The bill arrives in three places: hosting, build time, and maintenance after launch. Hosting rises with the number of services running, so five services mean five things to pay for and watch every month instead of one. Budget spent on that plumbing does not become features, and the order screen your admin uses every day lands later. After launch, the pool of people who can maintain it narrows, and that is the part you feel most. For a business with no in-house engineering team, it is the most expensive risk on the list.

## When a monolith is the right answer

The signs are usually visible in the business rather than the code: one small team on one product, traffic that still sits comfortably on a single server, and requirements that are still moving because the final shape of the process is not settled.

In that situation, the separation you need can be done inside one application. We write checkout, stock and invoicing as separate modules in a single application, each with its own data and one entry point the other modules call. The next developer can read one module without understanding the whole system, and can still run everything on their own laptop to try it.

We judge architecture on whether the next developer can maintain the system, not on how modern the shape sounds. That is why we build on conventional, proven technology and record the reasoning behind each decision next to the code. A new developer inherits the thinking as well, not just a pile of files.

## The signals that genuinely justify splitting

Some conditions make separation worth paying for. Check this list against your own business, and ask the people who use the process daily, because usage patterns show up most clearly from there.

- One part of the system has a load pattern nothing else shares. Product search runs thousands of times an hour while invoicing runs a few times a day.
- One part needs a different language or runtime. Image processing or an AI model sometimes genuinely lives in another environment.
- Separate teams own separate areas, and their release schedules get in each other's way.
- One part has to keep working when the rest is down. Checkout that keeps taking orders while the reporting system is broken belongs here.

If none of those four describe your business, you are probably paying for plumbing against a problem you do not have yet. If an off-the-shelf tool sold by the month already finishes the process, we will say so, and the architecture question disappears with it. How to compare the two options is set out in [custom build or off-the-shelf tool](/en/blog/software-development/custom-vs-off-the-shelf-software-right-fit/).

## You do not have to choose once and forever

The cheapest sequence usually starts with one application and tidy internal boundaries. Run it, see which part actually gets hammered, then pull that part out into its own service once it has earned it. Pull out one piece, not five at once.

That fits a build that starts small and grows against real usage. The reasoning is in [start small, then grow](/en/blog/software-development/mvp-development-start-small-scale-fast/).

An architecture decision stays changeable when the internal boundaries were tidy from the start, the reasoning behind the first decision is written down, and the code and accounts are in your name. Tidy boundaries let one module come out without dismantling the rest. The written reasoning tells the next person what was weighed at the time and what has changed since. Without ownership of the code, the servers, the domain and every account, only the vendor who built it can change the architecture, and the decision moves into their hands. At Arktik all of it is in your name from day one, so nothing depends on us still being here.

## Questions to put to whoever is building it

You do not need to read the code to judge the answers, and these five are enough.

- What breaks if this is built as one application instead of five?
- What will hosting and third-party services cost per month for the shape you are proposing, compared with a simpler shape?
- Who can maintain this after handover, and how many developers in the market know this tooling?
- Where is the reasoning for this decision recorded, and can I read it?
- If it turns out to be wrong later, how much work is it to change?

The shape of the answer already tells you something. A usable answer names a monthly figure in rupiah, a technology, and where the notes live. An answer worth distrusting mentions scalability and the future with no numbers in it at all.

## Bring your architecture question to the first call

You do not need to prepare any technical vocabulary. Describe the process you want to move into software and how many people will use it. If you already have a quote from someone else, bring the quote. We will talk through which shape makes sense at your size, straight with the engineers who would do the work. The first call is free and there is no deck.

If you already have your own developers and only want a second opinion on one architecture decision, we do that too. The whole build does not have to come to us. If something does need building, discovery gives you a written plan and a fixed price, and that document is yours whatever you decide afterwards. Use the contact form, which opens WhatsApp, or email hello@arktik.id.
