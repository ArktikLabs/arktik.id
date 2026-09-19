import fs from 'node:fs'

export type Status = 'todo' | 'published' | 'needs-input' | 'failed'
export interface Row {
  date: string
  type: 'pillar' | 'regular'
  title: string
  category: string
  goal: string
  status: Status
  slug: string
  facts: string
}

export const COLUMNS = ['date', 'type', 'title', 'category', 'goal', 'status', 'slug', 'facts'] as const
const STATUSES: Status[] = ['todo', 'published', 'needs-input', 'failed']
const TYPES = ['pillar', 'regular']

/* RFC 4180 subset: quoted fields may contain commas, newlines and doubled
 * quotes. ponytail: ~30 lines instead of a csv dependency. */
function splitCsv(text: string): string[][] {
  const rows: string[][] = []
  let field = ''
  let row: string[] = []
  let quoted = false
  for (let i = 0; i < text.length; i++) {
    const c = text[i]
    if (quoted) {
      if (c === '"' && text[i + 1] === '"') { field += '"'; i++ }
      else if (c === '"') quoted = false
      else field += c
    } else if (c === '"') quoted = true
    else if (c === ',') { row.push(field); field = '' }
    else if (c === '\n') { row.push(field); rows.push(row); row = []; field = '' }
    else if (c !== '\r') field += c
  }
  if (field !== '' || row.length) { row.push(field); rows.push(row) }
  return rows
}

const quote = (v: string) => (/[",\n\r]/.test(v) ? `"${v.replace(/"/g, '""')}"` : v)

export function parseCsv(text: string): Row[] {
  const [header, ...lines] = splitCsv(text)
  if (header.join(',') !== COLUMNS.join(',')) throw new Error(`planner header must be ${COLUMNS.join(',')}`)
  return lines.filter((l) => l.some((v) => v !== '')).map((l, n) => {
    const r = Object.fromEntries(COLUMNS.map((k, i) => [k, l[i] ?? ''])) as unknown as Row
    if (!STATUSES.includes(r.status)) throw new Error(`row ${n + 2}: unknown status "${r.status}"`)
    if (!TYPES.includes(r.type)) throw new Error(`row ${n + 2}: unknown type "${r.type}"`)
    if (!/^\d{4}-\d{2}-\d{2}$/.test(r.date)) throw new Error(`row ${n + 2}: date must be YYYY-MM-DD`)
    return r
  })
}

export function serializeCsv(rows: Row[]): string {
  return [COLUMNS.join(','), ...rows.map((r) => COLUMNS.map((k) => quote(r[k])).join(','))].join('\n') + '\n'
}

export const readPlanner = (file: string): Row[] => parseCsv(fs.readFileSync(file, 'utf8'))
export const writePlanner = (file: string, rows: Row[]) => fs.writeFileSync(file, serializeCsv(rows))

export function dueRows(rows: Row[], today: string, titleFilter?: string): Row[] {
  const todo = rows.filter((r) => r.status === 'todo')
  if (titleFilter) {
    const f = titleFilter.toLowerCase()
    return todo.filter((r) => r.title.toLowerCase().includes(f))
  }
  return todo.filter((r) => r.date <= today).sort((a, b) => a.date.localeCompare(b.date))
}

export const isCaseStudy = (row: Row) => /^case study/i.test(row.title)

export function addDays(iso: string, days: number): string {
  const d = new Date(`${iso}T00:00:00Z`)
  d.setUTCDate(d.getUTCDate() + days)
  return d.toISOString().slice(0, 10)
}

export function rebase(rows: Row[], firstDate: string, everyDays: number): Row[] {
  let next = firstDate
  return rows.map((r) => {
    if (r.status === 'published') return r
    const out = { ...r, date: next }
    next = addDays(next, everyDays)
    return out
  })
}

export function latestPillarSlug(
  pillars: { slug: string; category: { slug: string }; date: string }[],
  category: string,
): string | undefined {
  return pillars
    .filter((p) => p.category.slug === category)
    .sort((a, b) => b.date.localeCompare(a.date))[0]?.slug
}
