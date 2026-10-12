import { test } from 'node:test'
import assert from 'node:assert/strict'
import { breadcrumbs } from './schema.ts'

test('breadcrumbs: every crumb but the last carries item, home path "" included', () => {
  const list = breadcrumbs('id', [
    { name: 'Arktik', path: '' },
    { name: 'Produk', path: '', hash: 'products' },
    { name: 'Gerai' },
  ])
  const items = list.itemListElement as Array<Record<string, unknown>>
  assert.equal(items[0].item, 'https://www.arktik.id/')
  assert.equal(items[1].item, 'https://www.arktik.id/#products')
  assert.equal('item' in items[2], false)
})

test('breadcrumbs: en locale prefix', () => {
  const list = breadcrumbs('en', [{ name: 'Blog', path: 'blog' }, { name: 'X' }])
  assert.equal((list.itemListElement[0] as { item: string }).item, 'https://www.arktik.id/en/blog/')
})

test('breadcrumbs: a non-last crumb without path throws', () => {
  assert.throws(() => breadcrumbs('id', [{ name: 'A' }, { name: 'B' }]), /needs a path/)
})
