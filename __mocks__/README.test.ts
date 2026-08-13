import { describe, it, expect, beforeAll } from 'vitest'
import { readFileSync } from 'fs'
import { resolve } from 'path'

/**
 * Tests for __mocks__/README.md
 *
 * This file documents Next.js mock patterns used in the test suite.
 * These tests validate the structure, content, and code examples
 * present in the README to ensure the documentation remains accurate
 * and complete.
 */

const FILEPATH = resolve(__dirname, 'README.md')
let content: string
let lines: string[]

beforeAll(() => {
  content = readFileSync(FILEPATH, 'utf-8')
  lines = content.split('\n')
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
    expect(lines.length).toBe(27)
  })

  it('file has no trailing newline', () => {
    expect(content.endsWith('\n')).toBe(false)
  })

  // ── Section headings ─────────────────────────────────────────────────────

  it('contains the mock functionality section heading', () => {
    expect(content).toContain('การทำงานของ Mock ใน Next.js')
  })

  it('contains the code example section heading', () => {
    expect(content).toContain('next-server.ts')
  })

  it('contains the GitHub Workflow integration section', () => {
    expect(content).toContain('เชื่อมโยงกับ GitHub Workflow')
  })

  // ── Documented concepts ──────────────────────────────────────────────────

  it('documents API Routes mocking concept', () => {
    expect(content).toContain('API Routes')
  })

  it('documents SSR (server-side rendering) testing', () => {
    expect(content).toContain('SSR')
  })

  it('documents CI/CD pipeline usage', () => {
    expect(content).toContain('CI/CD')
  })

  // ── Code example — mockServer object ────────────────────────────────────

  it('contains the mockServer export declaration', () => {
    expect(content).toContain('export const mockServer')
  })

  it('code example uses jest.fn for mocking', () => {
    expect(content).toContain('jest.fn')
  })

  it('code example targets the /api/users endpoint', () => {
    expect(content).toContain('/api/users')
  })

  it('code example includes the "Mock User" response fixture', () => {
    expect(content).toContain('"Mock User"')
  })

  it('code example includes a mock user id of 1', () => {
    expect(content).toContain('id: 1')
  })

  it('code example demonstrates the happy-path with Promise.resolve', () => {
    expect(content).toContain('Promise.resolve')
  })

  it('code example demonstrates the error-path with Promise.reject', () => {
    expect(content).toContain('Promise.reject')
  })

  it('code example returns a data array with user objects', () => {
    expect(content).toContain('data: [{ id: 1')
  })

  it('code example throws a "Not Found" error for unknown routes', () => {
    expect(content).toContain('Not Found')
  })

  // ── Code example — get method ────────────────────────────────────────────

  it('mockServer exposes a get method', () => {
    expect(content).toMatch(/mockServer\s*=\s*\{[\s\S]*get:/)
  })

  it('get method accepts a url parameter', () => {
    expect(content).toContain('get: jest.fn((url)')
  })

  // ── Code block format ────────────────────────────────────────────────────

  it('code block is prefixed with the ts language identifier', () => {
    // The code block uses backtick-delimited ts blocks
    expect(content).toMatch(/`ts\s*\n/)
  })

  it('code block includes the mocks/next-server.ts file path comment', () => {
    expect(content).toContain('// mocks/next-server.ts')
  })

  // ── Jest tooling mention ─────────────────────────────────────────────────

  it('mentions Jest as the mocking library', () => {
    expect(content).toContain('Jest')
  })

  it('explains that mockServer can be imported instead of real API calls', () => {
    expect(content).toContain('import mockServer')
  })

  // ── Regression: content integrity ────────────────────────────────────────

  it('does not reference any real external API URLs', () => {
    // The mock documentation should not embed live endpoint URLs
    const externalUrlPattern = /https?:\/\/(?!.*example)/g
    const matches = content.match(externalUrlPattern) ?? []
    expect(matches.length).toBe(0)
  })

  it('mockServer get handler only branches on the documented /api/users path', () => {
    // Ensure no undocumented conditional branches are described
    const ifStatements = content.match(/if \(url ===/g) ?? []
    expect(ifStatements).toHaveLength(1)
  })

  // ── Boundary: line-level checks ──────────────────────────────────────────

  it('first line introduces the next-server.ts topic', () => {
    expect(lines[0]).toContain('next-server.ts')
  })

  it('last line ends with a question prompt to the reader', () => {
    const lastLine = lines[lines.length - 1]
    expect(lastLine).toContain('?')
  })

  it('has at least three bullet-point items describing mock functionality', () => {
    const bulletLines = lines.filter((line) => line.trim().startsWith('-'))
    expect(bulletLines.length).toBeGreaterThanOrEqual(3)
  })
})
