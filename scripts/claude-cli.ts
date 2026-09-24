/* Runs the writer's model calls through the Claude Code CLI (`claude -p`) on a
 * machine logged in with a Claude subscription, instead of the metered API.
 *
 * It is an adapter, not a second writer: it implements the one method
 * writer.ts uses on the SDK client, `messages.stream(params).finalMessage()`,
 * so every prompt, schema, voice rule and judge seat stays byte-for-byte the
 * code in writer.ts. Select it with WRITER=cli.
 */
import { spawn } from 'node:child_process'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'

type Block = { type: string; text?: string }
type Params = {
  model: string
  system?: Block[] | string
  messages: { role: string; content: unknown }[]
  output_config?: { effort?: string; format?: { type: string; schema: unknown } }
  tools?: { name: string }[]
}

const TIMEOUT_MS = 20 * 60 * 1000

function systemText(s: Params['system']): string {
  if (!s) return ''
  return typeof s === 'string' ? s : s.map((b) => b.text ?? '').join('\n\n')
}

function promptText(messages: Params['messages']): string {
  const last = messages[messages.length - 1]
  if (typeof last.content === 'string') return last.content
  return (last.content as Block[]).filter((b) => b.type === 'text').map((b) => b.text).join('\n\n')
}

/* WebSearch results arrive as text with an embedded `Links: [{"title","url"}]`
 * array; WebFetch URLs are in the tool input. Both count as retrieved. */
export function urlsFromToolTraffic(lines: string[]): string[] {
  const urls = new Set<string>()
  for (const line of lines) {
    let ev: any
    try { ev = JSON.parse(line) } catch { continue }
    for (const c of ev?.message?.content ?? []) {
      if (c?.type === 'tool_use' && c.name === 'WebFetch' && typeof c.input?.url === 'string') urls.add(c.input.url)
      if (c?.type === 'tool_result') {
        const text = typeof c.content === 'string' ? c.content : JSON.stringify(c.content)
        for (const m of text.matchAll(/"url":"(https?:\/\/[^"]+)"/g)) urls.add(m[1])
      }
    }
  }
  return [...urls]
}

function run(args: string[], stdin: string): Promise<string> {
  // A scratch cwd so no project CLAUDE.md or settings leak into the prompt.
  const cwd = fs.mkdtempSync(path.join(os.tmpdir(), 'arktik-writer-'))
  return new Promise((resolve, reject) => {
    const p = spawn(process.env.CLAUDE_BIN || 'claude', args, { cwd, stdio: ['pipe', 'pipe', 'pipe'] })
    let out = '', err = ''
    const timer = setTimeout(() => { p.kill('SIGTERM'); reject(new Error('claude cli timed out')) }, TIMEOUT_MS)
    p.stdout.on('data', (d) => { out += d })
    p.stderr.on('data', (d) => { err += d })
    p.on('error', reject)
    p.on('close', (code) => {
      clearTimeout(timer)
      fs.rmSync(cwd, { recursive: true, force: true })
      if (code !== 0 && !out) reject(new Error(`claude cli exit ${code}: ${err.slice(0, 400)}`))
      else resolve(out)
    })
    p.stdin.end(stdin)
  })
}

async function call(params: Params) {
  const sysFile = path.join(os.tmpdir(), `arktik-sys-${process.pid}-${Date.now()}.md`)
  fs.writeFileSync(sysFile, systemText(params.system))
  const research = (params.tools ?? []).some((t) => t.name === 'web_search')
  const schema = params.output_config?.format?.schema
  const args = ['-p', '--model', params.model, '--no-session-persistence', '--strict-mcp-config',
    '--system-prompt-file', sysFile, '--output-format', research ? 'stream-json' : 'json']
  if (params.output_config?.effort) args.push('--effort', params.output_config.effort)
  if (research) args.push('--verbose', '--tools', 'WebSearch,WebFetch', '--allowedTools', 'WebSearch,WebFetch')
  else args.push('--tools', '')
  if (schema) args.push('--json-schema', JSON.stringify(schema))
  try {
    const out = await run(args, promptText(params.messages))
    const lines = out.trim().split('\n')
    const result = JSON.parse(research ? lines.filter((l) => l.includes('"type":"result"')).pop() ?? '{}' : out)
    if (result.is_error || result.subtype !== 'success') throw new Error(`claude cli: ${result.subtype ?? 'no result'}: ${String(result.result ?? '').slice(0, 300)}`)
    const textOut = schema && result.structured_output !== undefined ? JSON.stringify(result.structured_output) : String(result.result ?? '')
    const content: any[] = []
    if (research) {
      // Shape the retrieved URLs like the API's server-tool blocks so
      // writer.research() collects them unchanged.
      content.push({ type: 'web_search_tool_result', content: urlsFromToolTraffic(lines).map((url) => ({ type: 'web_search_result', url })) })
    }
    content.push({ type: 'text', text: textOut })
    const u = result.usage ?? {}
    return {
      content,
      stop_reason: 'end_turn',
      usage: { input_tokens: u.input_tokens ?? 0, output_tokens: u.output_tokens ?? 0, cache_read_input_tokens: u.cache_read_input_tokens ?? 0, cache_creation_input_tokens: u.cache_creation_input_tokens ?? 0 },
    }
  } finally {
    fs.rmSync(sysFile, { force: true })
  }
}

/* Only the surface writer.ts touches. */
export function createCliClient(): any {
  return { messages: { stream: (params: Params) => ({ finalMessage: () => call(params) }) } }
}
