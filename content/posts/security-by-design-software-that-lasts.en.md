---
title: 'Security by Design: What It Means When Someone Else Holds the Keys'
excerpt: >-
  For a small company, most security failures are access and ownership failures.
  You can check all of them by logging in and looking.
seoTitle: What security by design obliges your vendor to do
seoDescription: >-
  Shared logins, accounts in the vendor's name, no record of who changed what.
  What to verify before you sign a build, and what to ask after launch.
ctaTitle: Let's work out who holds your accounts
ctaDescription: >-
  A free first call with no deck, straight with the engineers. Describe the
  software you use now and who built it, and Discovery gives you a written plan
  with a fixed price that stays yours whatever you decide.
tags:
  - security
  - ownership
  - access control
  - audit trails
  - vendor questions
date: '2026-10-27'
updated: '2026-10-27'
category: software-development
author: tika-aurora
pillar: software-architecture-future-proofing-for-business-owners
image: >-
  https://images.unsplash.com/flagged/photo-1564767609342-620cb19b2357?ixid=M3w4MTQwNzl8MHwxfHNlYXJjaHwxfHxvZmZpY2UlMjBkb29yJTIwa2V5c3xlbnwxfDB8fHwxNzkzMDY0MjYzfDA&ixlib=rb-4.1.0&w=1920&q=80&fm=jpg&fit=max
imageAlt: keys on hand
imageCredit:
  name: Maria Ziegler
  profileUrl: >-
    https://unsplash.com/@schluesseldienstvergleich_eu?utm_source=arktik&utm_medium=referral
  photoUrl: >-
    https://unsplash.com/photos/keys-on-hand-jJnZg7vBfMs?utm_source=arktik&utm_medium=referral
quality:
  owner: 8
  ops: 8
  developer: 7
  voice: 7
  rounds: 0
---
When a vendor writes "security by design" into a proposal, you are entitled to know what it commits them to. At the scale of a small or mid-sized company, it almost always comes down to access and ownership: whose name is on the accounts, who can open which data, and whether the system records who changed something.

You can check all three without reading a line of code, by logging in and looking. If you are still deciding whether to build at all and want the whole sequence first, that is in the [guide to custom software development](/en/blog/software-development/guides/custom-software-development-definitive-guide/).

## The risks a small business actually faces

What damages a small company is rarely a planned attack from outside. The usual shapes are far more ordinary, and most of them are already sitting in offices today.

- One admin login passed between several people, with the password in a team chat.
- A staff member who left months ago can still open the dashboard, because nobody remembered to revoke the access.
- Customer records including phone numbers exported to a spreadsheet and emailed to whoever asked.
- The company domain registered under a developer's personal email, paid for on their personal card.

None of those four need technical knowledge to spot. They get expensive precisely because they look trivial until something happens. An order disappears and there is nobody you can ask for an explanation. The domain lapses on a Saturday and you cannot renew it yourself.

## Whose name is on the accounts

Your software runs on top of several separate accounts: hosting, the domain name, the database, email, the payment gateway, and App Store or Play Store listings if there is a mobile app. Each one has a registered owner.

The moment any of those sits in the vendor's name, security and continuity become the same problem. A vendor you cannot reach means you have lost the ability to revoke someone else's access, renew the domain, or move the server. Nobody has to act in bad faith for that to hurt, because the key is already in someone else's hand.

At Arktik the code, servers, domain and every account are in your name from day one rather than handed over at the end of a project. Checking it is simple: open the email registered against each account, confirm it is a company address, and try logging in yourself. If you can get in without asking anyone for help, the ownership is real.

## Who can see what, and who decided that

Permissions get filed under technical work and then left to a developer's guess. You are the one who knows who should see what. A developer has no way of knowing that the special pricing for one reseller must stay hidden from counter staff, or that salary figures are for two people in the office and nobody else.

You do not need technical vocabulary to say it. Name the role and what that role is allowed to do. Counter staff can create orders and see stock levels, but not margins. Warehouse admin can adjust stock counts, but cannot cancel an order. A supervisor can cancel an order, and the cancellation needs a written reason.

Rules in that form get discussed during discovery and written into the plan before any building starts. The price is fixed, and the plan document is yours whatever you decide afterwards. Working in that order keeps the access decisions with the person who carries the consequences on the floor.

## Keeping a record of who changed what

If you ask for nothing else, ask for this: the system should record who changed what, and when. When one product's price suddenly sits far below where it should, that record tells you which account changed it and at what time.

The value shows up during a disagreement. Stock in the system does not match stock in the warehouse, and several people have different versions of the story. Without a record you can only guess and be annoyed at everyone. With one you know which account entered the deduction and when, so you can go and ask that person directly.

Accountants and auditors want the same thing. Cancelled orders, revised invoices and payments marked as paid by hand all need a trail. So when you talk to a vendor, name the events that must leave a trace in your business. Order cancellations, price changes, stock adjustments and customer record deletions usually cover most of what comes up.

## Security that still works after the people change

The components inside your software keep getting updated, and some of those updates close security holes. Meanwhile staff change and the developer who built it moves on.

Three things decide whether the next person can patch a hole without pulling the whole thing apart. First, the technology is conventional and proven, so plenty of developers in the market recognise it and the fix is routine work. Second, the reasoning behind each decision is recorded next to the code, so a new developer inherits the thinking rather than a pile of files, and knows why one part was built that way on purpose before deciding to change it.

The third is how a fix reaches users at all. When every release depends on one person uploading files by hand, a security patch waits until that person has time. Automate the process and the fix can go up the same day. That pipeline is explained in [CI/CD for the person paying for the build](/en/blog/software-development/ci-cd-explained-for-business-owners/). This sits alongside the other architecture decisions worth keeping in your own hands, which are collected in the [guide to software architecture for business owners](/en/blog/software-development/guides/software-architecture-future-proofing-for-business-owners/).

## What to ask a vendor before you sign

Four questions are enough for a first call, and you can judge the answers yourself.

- Whose name is registered on the hosting, the domain, the database and the payment gateway, and when do I log in for the first time?
- If a vulnerability is found on a Monday, what route does the fix take to reach users, and how long does it take?
- If we stop working together, what happens to your team's access to my system?
- What events does the system record, and where can I read them without asking a developer?

The shape of the answer already tells you something. A usable answer names accounts, services and lengths of time. An answer to be wary of stops at adjectives: secure, encrypted, industry standard. What else you can reasonably expect from a working relationship is set out in [what to expect from a software house partnership](/en/blog/software-development/what-clients-should-expect-in-a-software-house-partnership/).

## After launch: patching is a job, not an event

Once the software is running, some of the work never finishes. Components need their updates applied and certificates need renewing. Someone also has to watch for server failures, so that a customer's message is not how you hear about one.

Each of those jobs needs an owner by name, whether that is your own team or someone else on a monthly fee. Left with no owner, an expired certificate is what gets your site flagged as unsafe in a customer's browser.

We offer a monthly service for it: hosting, monitoring, fixes and small changes. It is optional, you can stop it at any time, and every account stays in your name during the service and after it. If you have your own IT staff and would rather keep this in house, that is also a good answer.

## Let's work out who holds your accounts

You do not need to prepare any technical vocabulary. Tell us what software you use now and who built it. We will go through which accounts should move into your name, and which events your next system needs to record. The first call is free, there is no deck, and you are talking to the engineers who would do the work.

If an off-the-shelf tool sold by the month already finishes the job, we will say so. If something does need building, discovery gives you a written plan and a fixed price, and that document is yours whatever you decide afterwards. Use the contact form, which opens WhatsApp, or email hello@arktik.id.
