import { test } from 'node:test'
import assert from 'node:assert/strict'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { createCliClient, urlsFromToolTraffic } from './claude-cli.ts'

test('urlsFromToolTraffic collects search result and fetch urls only', () => {
  const lines = [
    JSON.stringify({ type: 'assistant', message: { content: [{ type: 'tool_use', name: 'WebFetch', input: { url: 'https://bps.go.id/a' } }] } }),
    JSON.stringify({ type: 'user', message: { content: [{ type: 'tool_result', content: 'Links: [{"title":"T","url":"https://ojk.go.id/b"}]' }] } }),
    JSON.stringify({ type: 'assistant', message: { content: [{ type: 'text', text: 'see https://invented.example/c' }] } }),
    'not json',
  ]
  assert.deepEqual(urlsFromToolTraffic(lines).sort(), ['https://bps.go.id/a', 'https://ojk.go.id/b'])
})

/* A fake `claude` binary records its argv and stdin, so the test proves the
 * adapter passes writer.ts's system prompt, prompt and schema through intact. */
function fakeCli(reply: object): { bin: string; seen: () => { args: string[]; stdin: string; system: string } } {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'fake-claude-'))
  const bin = path.join(dir, 'claude')
  const log = path.join(dir, 'log.json')
  fs.writeFileSync(bin, `#!/usr/bin/env node
const fs = require('fs'); const args = process.argv.slice(2)
const sys = fs.readFileSync(args[args.indexOf('--system-prompt-file') + 1], 'utf8')
let stdin = ''; process.stdin.on('data', (d) => stdin += d).on('end', () => {
  fs.writeFileSync(${JSON.stringify(log)}, JSON.stringify({ args, stdin, system: sys }))
  process.stdout.write(${JSON.stringify(JSON.stringify(reply))})
})`)
  fs.chmodSync(bin, 0o755)
  return { bin, seen: () => JSON.parse(fs.readFileSync(log, 'utf8')) }
}

test('cli client passes system, prompt, schema and effort; returns structured output as text', async () => {
  const f = fakeCli({ subtype: 'success', is_error: false, result: '{"ok":true}', structured_output: { ok: true }, usage: { input_tokens: 3, output_tokens: 4 } })
  process.env.CLAUDE_BIN = f.bin
  const schema = { type: 'object', properties: { ok: { type: 'boolean' } } }
  const msg = await createCliClient().messages.stream({
    model: 'claude-opus-5',
    system: [{ type: 'text', text: 'CONTEXT' }, { type: 'text', text: 'ROLE' }],
    messages: [{ role: 'user', content: 'PROMPT' }],
    output_config: { effort: 'medium', format: { type: 'json_schema', schema } },
  }).finalMessage()
  const s = f.seen()
  assert.equal(s.stdin, 'PROMPT')
  assert.equal(s.system, 'CONTEXT\n\nROLE')
  assert.equal(s.args[s.args.indexOf('--json-schema') + 1], JSON.stringify(schema))
  assert.equal(s.args[s.args.indexOf('--effort') + 1], 'medium')
  assert.equal(s.args[s.args.indexOf('--tools') + 1], '')
  assert.equal(msg.content[0].text, '{"ok":true}')
  assert.equal(msg.usage.output_tokens, 4)
  delete process.env.CLAUDE_BIN
})

test('cli client surfaces a failed run as an error', async () => {
  const f = fakeCli({ subtype: 'error_max_turns', is_error: true, result: 'x' })
  process.env.CLAUDE_BIN = f.bin
  await assert.rejects(createCliClient().messages.stream({ model: 'm', messages: [{ role: 'user', content: 'p' }] }).finalMessage(), /error_max_turns/)
  delete process.env.CLAUDE_BIN
})
