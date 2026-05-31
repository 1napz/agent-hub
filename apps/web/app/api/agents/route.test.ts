import { describe, it, expect } from 'vitest'
import { GET } from './route'

/**
 * Tests for apps/web/app/api/agents/route.ts
 *
 * GET handler returns NextResponse.json({ agents: ['pure', 'crystalcastle', 'claude'] })
 *
 * `next/server` is aliased to a lightweight shim in vitest.config.ts so that the
 * handler can be exercised without the full Next.js runtime.
 */
describe('GET /api/agents', () => {
  it('returns a Response', async () => {
    const response = await GET()
    expect(response).toBeInstanceOf(Response)
  })

  it('responds with HTTP 200 status', async () => {
    const response = await GET()
    expect(response.status).toBe(200)
  })

  it('response body is valid JSON', async () => {
    const response = await GET()
    const text = await response.text()
    expect(() => JSON.parse(text)).not.toThrow()
  })

  it('response JSON contains an "agents" property', async () => {
    const response = await GET()
    const json = await response.clone().json()
    expect(json).toHaveProperty('agents')
  })

  it('agents is an array', async () => {
    const response = await GET()
    const { agents } = await response.clone().json()
    expect(Array.isArray(agents)).toBe(true)
  })

  it('agents array contains exactly three entries', async () => {
    const response = await GET()
    const { agents } = await response.clone().json()
    expect(agents).toHaveLength(3)
  })

  it('agents array contains "pure"', async () => {
    const response = await GET()
    const { agents } = await response.clone().json()
    expect(agents).toContain('pure')
  })

  it('agents array contains "crystalcastle"', async () => {
    const response = await GET()
    const { agents } = await response.clone().json()
    expect(agents).toContain('crystalcastle')
  })

  it('agents array contains "claude"', async () => {
    const response = await GET()
    const { agents } = await response.clone().json()
    expect(agents).toContain('claude')
  })

  it('agents array contains exactly the expected entries', async () => {
    const response = await GET()
    const { agents } = await response.clone().json()
    expect(agents).toEqual(expect.arrayContaining(['pure', 'crystalcastle', 'claude']))
    expect(agents).toHaveLength(3)
  })

  it('all agent names in the response are non-empty strings', async () => {
    const response = await GET()
    const { agents } = await response.clone().json()
    agents.forEach((name: unknown) => {
      expect(typeof name).toBe('string')
      expect((name as string).length).toBeGreaterThan(0)
    })
  })

  // Regression: response should not include unexpected top-level keys
  it('response JSON has only the "agents" key at the top level', async () => {
    const response = await GET()
    const json = await response.clone().json()
    expect(Object.keys(json)).toEqual(['agents'])
  })

  // Boundary: GET is idempotent — two calls return equivalent responses
  it('GET is idempotent across multiple calls', async () => {
    const r1 = await GET()
    const r2 = await GET()
    const j1 = await r1.json()
    const j2 = await r2.json()
    expect(j1).toEqual(j2)
  })
})