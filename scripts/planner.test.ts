import { test } from 'node:test'
import assert from 'node:assert/strict'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { parseCsv, serializeCsv, dueRows, isCaseStudy, rebase, latestPillarSlug, addDays, notesSlug, notesPath, notesFor, type Row } from './planner.ts'

const row = (o: Partial<Row>): Row => ({
  date: '2026-09-21', type: 'regular', title: 'T', category: 'digital-strategy', goal: 'Awareness',
  status: 'todo', slug: '', facts: '', notes: '', research: '', ...o,
})

test('csv round-trips quoted, multi-line facts and commas in titles', () => {
  const rows = [row({ title: 'Hello, world', facts: 'Client: "Toko A"\nSaved 30%' }), row({ title: 'Plain' })]
  const text = serializeCsv(rows)
  assert.equal(text.split('\n')[0], 'date,type,title,category,goal,status,slug,facts,notes,research')
  assert.deepEqual(parseCsv(text), rows)
})

test('parseCsv rejects unknown status and type', () => {
  assert.throws(() => parseCsv('date,type,title,category,goal,status,slug,facts,notes,research\n2026-01-01,regular,T,c,g,done,,,,'), /status/)
  assert.throws(() => parseCsv('date,type,title,category,goal,status,slug,facts,notes,research\n2026-01-01,article,T,c,g,todo,,,,'), /type/)
})

test('notesSlug and notesPath derive a stable file name from the title', () => {
  assert.equal(notesSlug('MVP Development: Why Start Small to Scale Fast'), 'mvp-development-why-start-small-to-scale-fast')
  assert.equal(notesSlug('  Ünïcode & symbols!!  '), 'unicode-symbols')
  assert.equal(notesPath('/r', row({ title: 'A: B' })), '/r/content/notes/a-b.md')
})

test('notesFor joins the column and the file, and is empty when neither exists', () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'notes-'))
  fs.mkdirSync(path.join(root, 'content/notes'), { recursive: true })
  const r = row({ title: 'Topic One', notes: 'column note' })
  assert.equal(notesFor(root, r), 'column note')
  fs.writeFileSync(path.join(root, 'content/notes/topic-one.md'), 'file note\n')
  assert.equal(notesFor(root, r), 'column note\n\nfile note')
  assert.equal(notesFor(root, row({ title: 'Nothing Here' })), '')
})

test('research column parses and defaults empty', () => {
  const rows = parseCsv('date,type,title,category,goal,status,slug,facts,notes,research\n2026-01-01,regular,T,c,g,todo,,,,yes\n2026-01-02,regular,U,c,g,todo,,,,\n')
  assert.equal(rows[0].research, 'yes')
  assert.equal(rows[1].research, '')
  assert.throws(() => parseCsv('date,type,title,category,goal,status,slug,facts,notes,research\n2026-01-01,regular,T,c,g,todo,,,,maybe\n'), /research/)
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
