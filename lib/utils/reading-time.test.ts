import { test } from 'node:test'
import assert from 'node:assert/strict'
import { markdownToText, calculateReadingTime, calculateCombinedReadingTime } from './reading-time.ts'

test('markdownToText strips syntax', () => {
  const md = '# Judul\n\nTeks **tebal** dan _miring_ dengan [tautan](https://x.id) dan ![gambar](/a.png).\n\n- satu\n1. dua\n\n> kutip\n\n---\n'
  assert.equal(markdownToText(md), 'Judul Teks tebal dan miring dengan tautan dan . satu dua kutip')
  assert.equal(markdownToText(undefined), '')
  assert.equal(markdownToText('- level1\n    - level2\n  - level2b'), 'level1 level2 level2b')
  assert.equal(markdownToText('Use `my_var_name` and snake_case_word, not _miring_ or __tebal__.'), 'Use my_var_name and snake_case_word, not miring or tebal.')
})

test('reading time rounds up with a minimum of one minute', () => {
  assert.equal(calculateReadingTime('satu dua tiga'), 1)
  assert.equal(calculateReadingTime(Array(401).fill('kata').join(' ')), 3)
  assert.equal(calculateReadingTime(''), 0)
})

test('combined reading time sums parts', () => {
  const twoHundred = Array(200).fill('kata').join(' ')
  assert.equal(calculateCombinedReadingTime([twoHundred, twoHundred, null]), 2)
  assert.equal(calculateCombinedReadingTime([null]), 1)
})
