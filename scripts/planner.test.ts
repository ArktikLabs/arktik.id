import { test } from 'node:test'
import assert from 'node:assert/strict'
import { parseCsv, serializeCsv, dueRows, isCaseStudy, rebase, latestPillarSlug, addDays, type Row } from './planner.ts'

const row = (o: Partial<Row>): Row => ({
  date: '2026-09-21', type: 'regular', title: 'T', category: 'digital-strategy', goal: 'Awareness',
  status: 'todo', slug: '', facts: '', ...o,
})

test('csv round-trips quoted, multi-line facts and commas in titles', () => {
  const rows = [row({ title: 'Hello, world', facts: 'Client: "Toko A"\nSaved 30%' }), row({ title: 'Plain' })]
  const text = serializeCsv(rows)
  assert.equal(text.split('\n')[0], 'date,type,title,category,goal,status,slug,facts')
  assert.deepEqual(parseCsv(text), rows)
})

test('parseCsv rejects unknown status and type', () => {
  assert.throws(() => parseCsv('date,type,title,category,goal,status,slug,facts\n2026-01-01,regular,T,c,g,done,,'), /status/)
  assert.throws(() => parseCsv('date,type,title,category,goal,status,slug,facts\n2026-01-01,article,T,c,g,todo,,'), /type/)
})

test('dueRows picks todo rows on or before today, in date order', () => {
  const rows = [
    row({ date: '2026-09-25', title: 'later' }),
    row({ date: '2026-09-21', title: 'due' }),
    row({ date: '2026-09-19', title: 'overdue' }),
    row({ date: '2026-09-19', title: 'done', status: 'published' }),
    row({ date: '2026-09-19', title: 'blocked', status: 'needs-input' }),
  ]
  assert.deepEqual(dueRows(rows, '2026-09-21').map((r) => r.title), ['overdue', 'due'])
})

test('dueRows with a title filter ignores date and status todo only', () => {
  const rows = [row({ date: '2027-01-01', title: 'Far Future Post' }), row({ date: '2027-01-01', title: 'Other', status: 'failed' })]
  assert.deepEqual(dueRows(rows, '2026-09-21', 'future').map((r) => r.title), ['Far Future Post'])
  assert.deepEqual(dueRows(rows, '2026-09-21', 'other').map((r) => r.title), [])
})

test('isCaseStudy matches the title prefix only', () => {
  assert.equal(isCaseStudy(row({ title: 'Case Study: X' })), true)
  assert.equal(isCaseStudy(row({ title: 'Case study: X' })), true)
  assert.equal(isCaseStudy(row({ title: 'A Case Study About X' })), false)
})

test('rebase re-dates only unpublished rows, keeping order and cadence', () => {
  const rows = [
    row({ title: 'p', status: 'published', date: '2025-10-01' }),
    row({ title: 'a', date: '2026-10-10' }),
    row({ title: 'b', date: '2026-10-12' }),
  ]
  const out = rebase(rows, '2026-09-21', 2)
  assert.deepEqual(out.map((r) => [r.title, r.date]), [['p', '2025-10-01'], ['a', '2026-09-21'], ['b', '2026-09-23']])
})

test('latestPillarSlug returns the newest pillar in the category or undefined', () => {
  const pillars = [
    { slug: 'old', category: { slug: 'c' }, date: '2025-01-01' },
    { slug: 'new', category: { slug: 'c' }, date: '2025-06-01' },
    { slug: 'other', category: { slug: 'd' }, date: '2026-01-01' },
  ]
  assert.equal(latestPillarSlug(pillars, 'c'), 'new')
  assert.equal(latestPillarSlug(pillars, 'zzz'), undefined)
})

test('addDays handles month boundaries in UTC', () => {
  assert.equal(addDays('2026-09-30', 2), '2026-10-02')
})
