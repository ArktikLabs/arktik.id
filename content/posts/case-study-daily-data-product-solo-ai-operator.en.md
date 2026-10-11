---
title: 'Case Study: Running a Daily Data Product With One Person and an AI Operator'
excerpt: >-
  Jejak Saham is our own product, run by one person and an AI operator. Here is
  what checks, verification and human approval look like in daily production.
seoTitle: 'One Person, an AI Operator, a Daily Data Product'
seoDescription: >-
  How a daily data product gets built, checked and operated by one person with
  an AI operator agent, and what that means if you are commissioning software.
ctaTitle: Tell us which process goes wrong most often
ctaDescription: >-
  A free first call with no deck. Describe the process that most often has you
  apologising to a customer, and discovery gives you a written plan with a fixed
  price that stays yours whatever you decide.
tags:
  - ai in production
  - data quality
  - software ownership
  - case study
date: '2026-10-11'
updated: '2026-10-11'
category: case-studies
author: tika-aurora
image: >-
  https://images.unsplash.com/photo-1558494949-ef010cbdcc31?ixid=M3w4MTQwNzl8MHwxfHNlYXJjaHwxfHxzZXJ2ZXIlMjByYWNrJTIwbW9uaXRvcnxlbnwxfDB8fHwxNzkxNjgxOTY0fDA&ixlib=rb-4.1.0&w=1920&q=80&fm=jpg&fit=max
imageAlt: cable network
imageCredit:
  name: Taylor Vick
  profileUrl: 'https://unsplash.com/@tvick?utm_source=arktik&utm_medium=referral'
  photoUrl: >-
    https://unsplash.com/photos/cable-network-M5tzZtFCOfs?utm_source=arktik&utm_medium=referral
quality:
  owner: 8
  ops: 7
  developer: 8
  voice: 6
  rounds: 1
---
Jejak Saham is our own product, so here we are our own client. One person runs it, with one AI operator agent. Three things hold errors back: checks that run before anything is published, AI output rejected when the numbers do not agree, and every money decision left with the human.

Those are the same mechanisms we use on client work, and they come with the same commercial shape. Scope and price are agreed in writing before each stage begins, so you can stop after any stage without an argument, and the code, servers, domain and every account are in your name from day one.

## What the product does and who runs it

Jejak Saham reports which investors entered, added to, reduced or exited a stock on the Indonesia Stock Exchange. The source material is public disclosure from KSEI and IDX, so the data is already open. What we built is a way to read it daily without opening dozens of files.

The first commit was 27 September 2026, and the repository has been public since that day. There are 121 commits so far.

The team is one founder plus T.I.KA, an operator agent we built on Claude. T.I.KA reviews investor-name matching, prepares deploys and data fixes for approval, and routes payment confirmations.

## The daily cycle on trading days

On trading days the data is fetched twice. Once fetched, it is loaded into the database and checked, and only then do alerts go out to users, within one minute of the load finishing. So far 195 alerts have been sent.

The schedule is fixed, which is what makes the process auditable. If an alert is late, you can see which stage caused it.

There is one route out of the pipeline. The daily social posts draw on the same data, after the same checks, so there is nothing that publishes faster by skipping verification.

## Checks that run before anything is published

Every time data comes in, 22 automated data-quality checks run. Counting the loads since those checks went in, that has happened 24 times, and 2 of those runs held back suspicious data before it could be published. A hold stops the user alert and the social post until the human has cleared it.

One more layer sits on top of that. A random audit takes moves that have already been detected and matches them back against the raw IDX Excel files, using its own file reader rather than the one used in the main pipeline. The result was 560 of 560 matched.

Why does the reader have to be separate? If the check used the same code that loaded the data, a misreading in that code would pass twice. An independent reader gives the result a real chance to disagree, and that is what makes the 560 mean anything.

## Where AI is allowed to write and where it is not

We use Claude to extract revenue-segment tables from audited annual-report PDFs. The work suits AI: the format differs at every company, and retyping it by hand takes a person a long time.

The output is not used straight away. A table is stored only if its total matches the revenue figure from XBRL, the machine-readable version of the financial statements, so two separate sources have to agree before anything is kept.

Of the 889 reports processed so far, 578 have passed this check and 63 are held for manual review, with the rest still in the queue. Mismatched numbers are never shown to users.

Our position on AI in production is that AI can do the tedious part, as long as an independent figure has the power to reject the result.

## What the operator agent does, and what it never decides

T.I.KA does real work every day. It reviews investor-name matching and has handled 802 matching decisions. The same name is often written differently in different documents, and sorting that out takes judgement rather than rules alone.

Deploys and data fixes go the same way: the agent prepares them and the human approves them. Payment confirmations are pushed to a Telegram bot with Accept and Reject buttons.

The flow is always the same, with the agent preparing and the human pressing the button. Every business decision and every money decision stays with the human, and there is no path that lets the agent approve a payment on its own.

## Scale without a team

What is stored now is more than one person could maintain by hand.

- Daily holdings at 5 percent and above, roughly 850 tickers, since 29 May 2026, running to 163,000 rows.
- Monthly holdings from 1 percent and above, since February 2026.
- 12,663 detected ownership moves, spread across 5,719 investors.
- Daily prices since 2020, 1.37 million rows.

One person can run all of that because the checks run on their own and can stop a release. The person only needs to show up when something has been held back.

## What this means if you are commissioning software

A single wrong number turns into money immediately when the system handles stock, invoices or prices. Automated checks that can stop a release mean an error is caught before it reaches your customers, rather than being found by one of them.

The reasoning behind each technical decision is recorded next to the code it affects, so the next developer inherits the thinking rather than just the files. The parts themselves are ordinary ones that any competent developer has worked with before: a scheduled fetch, a database load, file parsing, a bot for approvals.

Cost works the same way as it does here. Because scope and price are agreed before each stage and everything is already in your name, stopping halfway leaves you with something that whoever you choose next can open and carry on.

## Tell us which process goes wrong most often

You do not need a requirements document. Just describe which process goes wrong often enough that you end up apologising to a customer, and who checks it today. The first call is free and there is no deck.

If an off-the-shelf tool already solves it, we will say so. If something does need building, discovery gives you a written plan and a fixed price within one to two weeks, and that document is yours whatever you decide afterwards. Use the contact form, which opens WhatsApp, or email hello@arktik.id.
