import { describe, it, expect, beforeAll } from 'vitest'
import { readFileSync } from 'fs'
import { resolve } from 'path'

/**
 * Tests for __mocks__/README.md
 * * This README documents the purpose and usage of the Next.js mock shim in Thai.
 * It explains: mocking API routes, SSR testing, response control, and CI/CD integration.
 * These tests validate that the documentation file is present, well-formed, and contains
 * the expected sections and illustrative code snippet.
 */

const FILEPATH = resolve(__dirname, 'README.md')
let content: string
beforeAll(() => {
  content = readFileSync(FILEPATH, 'utf-8')
})

describe('__mocks__/README.md — Next.js mock documentation', () => {
  // ── File basics ─────────────────────────────────────────────────────────

  it('file exists and is readable', () => {
    expect(() => readFileSync(FILEPATH, 'utf-8')).not.toThrow()
  })

  it('file is non-empty', () => {
    expect(content.trim().length).toBeGreaterThan(0)
  })

  it('file contains exactly 27 lines', () => {
    const lines = content.split('\n')
    expect(lines).toHaveLength(27)
  })

  it('file does not end with a trailing newline', () => {
    expect(content.endsWith('\n')).toBe(false)
  })

  // ── Main section headers ─────────────────────────────────────────────────

  it('contains the introduction referencing next-server.ts', () => {
    expect(content).toContain('next-server.ts')
  })

  it('contains the mock functionality section header (Thai)', () => {
    expect(content).toContain('การทำงานของ Mock ใน Next.js')
  })

  it('contains the code example section header (Thai)', () => {
    expect(content).toContain('ตัวอย่างโค้ด next-server.ts สำหรับการทดสอบ')
  })

  it('contains the GitHub workflow section header (Thai)', () => {
    expect(content).toContain('เชื่อมโยงกับ GitHub Workflow')
  })

  // ── Feature bullet points ─────────────────────────────────────────────────

  it('documents the API route mocking feature (Thai)', () => {
    expect(content).toContain('จำลอง API Routes')
  })

  it('documents the SSR testing feature (Thai)', () => {
    expect(content).toContain('ทดสอบ SSR')
  })

  it('documents the response control feature (Thai)', () => {
    expect(content).toContain('ควบคุมผลลัพธ์')
  })

  it('mentions the /api/users example endpoint', () => {
    expect(content).toContain('/api/users')
  })

  // ── Embedded code snippet ─────────────────────────────────────────────────

  it('contains the mockServer export declaration', () => {
    expect(content).toContain('export const mockServer')
  })

  it('code snippet uses jest.fn for mocking', () => {
    expect(content).toContain('jest.fn')
  })

  it('code snippet resolves with a Mock User data structure', () => {
    expect(content).toContain('Mock User')
  })

  it('code snippet resolves with an id field', () => {
    expect(content).toContain('id: 1')
  })

  it('code snippet returns a Promise.resolve for known routes', () => {
    expect(content).toContain('Promise.resolve')
  })

  it('code snippet rejects with an error for unknown routes', () => {
    expect(content).toContain('Promise.reject')
  })

  it('code snippet uses a Not Found error message for unknown routes', () => {
    expect(content).toContain('Not Found')
  })

  it('code snippet includes a get method on mockServer', () => {
    expect(content).toMatch(/mockServer\s*=\s*\{[\s\S]*get:/)
  })

  // ── CI/CD and integration notes ───────────────────────────────────────────

  it('mentions CI/CD pipeline usage (Thai)', () => {
    expect(content).toContain('CI/CD pipeline')
  })

  it('documents the benefit of reducing dependency on external APIs (Thai)', () => {
    expect(content).toContain('external API')
  })

  it('explains that mockServer can replace real API calls in tests (Thai)', () => {
    expect(content).toContain('import mockServer')
  })

  // ── mocks directory reference ─────────────────────────────────────────────

  it('references the mocks directory in the code comment', () => {
    expect(content).toContain('// mocks/next-server.ts')
  })

  // ── Regression: content integrity ─────────────────────────────────────────

  it('does not contain placeholder or Lorem Ipsum text', () => {
    expect(content).not.toMatch(/lorem ipsum/i)
    expect(content).not.toContain('TODO')
    expect(content).not.toContain('FIXME')
  })

  it('the mockServer get method checks the /api/users URL specifically', () => {
    expect(content).toMatch(/url\s*===\s*["']\/api\/users["']/)
  })

  // ── Boundary: snippet code structure ──────────────────────────────────────

  it('code snippet wraps the get handler in a url parameter', () => {
    expect(content).toMatch(/get:\s*jest\.fn\(\s*\(url\)/)
  })

  it('code snippet returns data as an array with one element', () => {
    expect(content).toMatch(/data:\s*\[\s*\{/)
  })
})
