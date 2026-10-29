---
title: >-
  Predictive Analytics for Decision-Making: What It Takes Before the Forecast Is
  Worth Anything
introduction: >-
  Predictive analytics changes a decision only when the record behind it is
  reliable and somebody owns the decision the number feeds. Most businesses
  asking about forecasting have plenty of models available to them and no
  dependable history, because the process still runs in spreadsheets and in one
  person's memory. The honest sequence starts by getting that process into a
  system, letting the data record itself as a by-product of daily work, then
  forecasting one or two things that move money. This guide covers which
  decisions are worth forecasting first, how much data is enough, which methods
  to use, and when to build nothing.
seoTitle: 'Predictive Analytics: What It Takes to Be Worth It'
seoDescription: >-
  Which decisions are worth forecasting first, how much history a forecast
  needs, and when an existing tool or a plain report is the better answer.
ctaTitle: Bring one decision you would like to forecast
ctaDescription: >-
  A free first call, no deck. Describe the decision that makes you guess most
  often and we will say whether your records can forecast it yet. If a build is
  the right answer, Discovery gives you a written plan and a fixed price that
  stays yours either way.
date: '2026-10-29'
updated: '2026-10-29'
category: ai-automation
author: tika-aurora
image: >-
  https://images.unsplash.com/photo-1644079446600-219068676743?ixid=M3w4MTQwNzl8MHwxfHNlYXJjaHwxfHx3YXJlaG91c2UlMjBzaGVsdmVzJTIwY2xpcGJvYXJkfGVufDF8MHx8fDE3OTMyMzc5NzV8MA&ixlib=rb-4.1.0&w=1920&q=80&fm=jpg&fit=max
imageAlt: a large warehouse filled with lots of shelves
imageCredit:
  name: Lance Chang
  profileUrl: 'https://unsplash.com/@carmendis?utm_source=arktik&utm_medium=referral'
  photoUrl: >-
    https://unsplash.com/photos/a-large-warehouse-filled-with-lots-of-shelves-h3pVxOIpnzk?utm_source=arktik&utm_medium=referral
quality:
  owner: 8
  ops: 8
  developer: 7
  voice: 7
  rounds: 1
---
Most businesses that reach this question already have plenty of options for models. What they lack is a trustworthy record of what happened, because the process still runs in spreadsheets and in the memory of whoever has done the job longest.

So the order usually runs backwards from how it gets sold. Get the process out of the spreadsheet, make sure the data is captured as a result of daily work rather than as an extra chore, then forecast one or two things that genuinely move money. Predictive analytics is one branch of a larger decision about AI and automation, and the cost and payback side of that is covered in our [guide to AI and automation for businesses](/en/blog/ai-automation/guides/ai-automation-for-businesses/).

## What a prediction is actually for

Predictive analytics is easiest to define by the decision it changes rather than by the technique behind it. The output is a number with a date attached: expected sales for the next two weeks, or the likelihood that a particular invoice gets paid late.

That number earns its cost when somebody behaves differently because of it. The warehouse lead orders more, a manager adds a person to the morning shift, or someone in finance calls a customer before the due date instead of a fortnight after it.

Where nothing changes, you have paid for decoration. A lot of forecasting dashboards end up there: the figures render neatly, everyone nods in the review meeting, and the ordering still happens the way it always did.

So start with the decision you want to change and the person who has authority to change it, before you get to the question of what data you hold. If nobody clearly owns that decision, even an accurate forecast evaporates.

## The decisions worth forecasting first

A few candidates tend to suit a growing business, and they share two features: the cost is already visible today, and there is a named person who can act on the number.

Demand and stock for the coming weeks. Too much stock parks cash on a shelf, too little sends the order to a competitor. The owner is obvious, being whoever signs purchase orders.

Which invoices are likely to be paid late. If you can tell at the start of the month, collections work can start early on the accounts that actually carry risk rather than going out to everyone at once.

Which customers are drifting away. In any business with repeat purchase, the decline is usually visible for several weeks before the customer is gone. One call at the right moment costs less than replacing them.

When inbound requests will pile up. Support and operations teams often sense this pattern without measuring it. The person who builds the rota sees the expected volume of requests for the coming week before they assign shifts.

Pick one to begin with, because two decisions at once usually produces two half-finished features.

## Why the spreadsheet blocks the forecast

Forecasting needs consistent history, and hand-filled spreadsheets produce inconsistent history.

Columns change mid-year because somebody added a notes field. Old cells get overwritten during a correction, so yesterday's figure disappears without a trace. The same customer is entered three different ways over the year, with the company suffix, without it, and in lower case. Order status is marked by cell colour, and the meaning of each colour lives in the head of one person in admin.

None of that interferes with daily work, because the people doing it know what they mean. The trouble starts when you want to calculate a pattern from two years of records, since no machine can infer intent that was never written down.

The first fix is usually recording the process properly rather than modelling anything. When an order is entered through a form in a system, the date, quantity and status are captured the same way every time. The form fixes the field set and the allowed status values, so the shape of the record cannot drift mid-year. Forecastable history then accumulates as a by-product of the work, with nobody needing to be reminded to be diligent.

This is also why a fair number of AI projects at this size turn out to be record-keeping projects. It makes for a duller conversation, and it is where most of the value sits.

## What counts as enough data

There is no magic row count, though there are two things you can check yourself.

The first is how far back the history goes. To forecast a weekly pattern you need enough weeks for the pattern to repeat rather than look like coincidence. For seasonal swings such as the end-of-year peak, you need several instances of the same season, which means years rather than months. With six months of data, a seasonal forecast is still a guess wrapped in a number.

The second is regularity. A few hundred rows from a process that has always been recorded the same way beats tens of thousands of rows from a mixed-up export. Large messy data consumes time in cleaning, and what survives the clean is often far smaller than anyone expected.

If you have neither yet, the right work now is to start recording. Decide today what you want to forecast a year from now, then start recording this month so the history exists when you come to ask for the forecast. Waiting a year feels long, and the year passes either way, with or without the records.

## Simple methods before machine learning

Forecasting methods form a ladder, and most decisions at this scale stop on the lower rungs.

At the bottom are plain rules. If stock falls below average sales for two weeks, reorder. There is no model at all, the decision changes, and the effect shows up immediately.

Above that sit moving averages with a seasonal adjustment. You take average sales across recent weeks and adjust for the usual shape of the month. That already settles a great deal of stock planning, and anyone on the team can see where the number came from.

The next rung is regression, which relates an outcome to several factors at once: order volume, day of the week, price, and whatever promotion is running. The result can still be explained in one sentence to the person who has to use it.

Trained models start to make sense when the factors are numerous, their relationships curve and interact, and large tidy data genuinely exists to learn from. That rung is also where a successor stops being able to read the reasoning off the code. Short of it, simpler methods usually give a good enough answer at a fraction of the cost.

There is a second reason to stay low on the ladder as long as possible. Conventional, explainable methods are the ones a successor can maintain. We build with proven approaches and record the reasoning beside the code, so the reason a moving average was chosen over regression sits next to the code that computes it.

## Where prediction sits in the software

A forecast is most useful inside the system people already use, at the moment the decision gets made.

The stock estimate appears on the purchasing screen, next to the order button. The late-payment flag appears in the invoice list rather than in a separate monthly report. If somebody has to open another dashboard to see the number, on most days they will not open it.

The number also needs its reasoning next to it. "Estimate is up because the last four weeks rose and this month usually runs busy" is more usable than a bare figure, because the person acting on it needs to know when to override it.

Prediction and automation are worth commissioning at the points where manual work is the bottleneck, such as sorting incoming requests, reading documents, or summarising. Treating it as a general upgrade across every function rarely pays. More concrete examples at this scale are collected in [practical AI use cases for growing SMEs](/en/blog/ai-automation/ai-in-business-practical-use-cases-for-growing-smes/).

A first predictive feature can be scoped as a single stage, with scope and price agreed in writing before that stage starts. Discovery produces a written plan and a fixed price, and both stay yours. If the forecast turns out not to help the decision, you stop there without an argument.

## Checking whether the forecast is any good

A forecast that never gets compared with reality drifts quietly. Markets move, the product mix changes, a large customer arrives or leaves, and the old pattern stops holding.

The comparison follows the same by-product principle. The system keeps each prediction alongside the actual figure it already records, so nobody has to maintain the comparison or retype anything. After a few weeks you have a list of gaps, and that list is the assessment.

Decide up front how wrong the forecast can be and still be worth acting on. For reordering stock, missing by a margin may still beat guessing. For a decision that is expensive to reverse, the threshold has to be tighter. Agree it before the system goes live, rather than after the numbers arrive and everyone starts looking for justification.

Show the gap to the people who use the forecast, not only in the report that goes to management. A warehouse lead who sees that last month's estimate fell outside the margin you agreed for that category will adjust how much weight they give it. Those adjustments are the most useful input you will get for the next round of work.

## When not to build this

Several situations should end without anything being built.

Accounting systems, point-of-sale systems and e-commerce platforms often include sales estimates and stock alerts already. Where a subscription tool you can simply buy forecasts what you need, the right advice is to buy that tool. Rebuilding something that already exists rarely makes sense on cost. If a tool you can buy covers your case, we will tell you on the first call.

A question about the past needs a report. "Which product sold most last quarter" is answered by an ordinary table.

If the decision only comes up a few times a year, the time saved will not cover the cost of building. An hour in a room with the person who knows the goods is cheaper.

Where somebody on the team already knows the pattern and is rarely far off, start by writing down how they think. That often produces a simple rule anyone else can apply, which solves the larger problem underneath: knowledge held in a single head.

Telling these apart before you spend anything takes about a minute. Name the decision, name its owner, and say what that person would do differently if the number existed. If you cannot fill in all three, leave it for now.

## Bring one decision you would like to forecast

There is no deck here and no checklist to download. Pick the decision that makes you guess most often, whether it concerns stock, collections or staffing, and talk it through on a free first call.

We will look at whether your existing records are good enough to forecast it. The honest answer may be a tool already on the market, or tidying up how the process is recorded first. If it does need building, Discovery gives you a written plan and a fixed price, and both stay yours whether or not you continue with us.

Message us on WhatsApp at +62 851-1769-7889 or email hello@arktik.id.
