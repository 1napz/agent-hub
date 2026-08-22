ได้ครับ ด้านล่างเป็น version ที่แก้แล้ว โดยเน้น stable contract testing, ไม่ผูกกับจำนวนบรรทัดหรือ syntax ที่เปลี่ยนได้ง่าย และแยก TypeScript code block ออกจาก Markdown content ชัดเจนขึ้น

README.test.ts

import { beforeAll, describe, expect, it } from 'vitest'
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'

/**
 * Tests for __mocks__/README.md
 *
 * These tests validate the documentation contract for the Next.js mock
 * patterns used by the test suite.
 *
 * The tests intentionally focus on documented behavior and required
 * concepts instead of fragile formatting details such as exact line
 * counts or whitespace.
 */

const FILEPATH = resolve(__dirname, 'README.md')

let content: string
let lines: string[]
let codeBlocks: string[]

function extractTsCodeBlocks(markdown: string): string[] {
  return [...markdown.matchAll(/```ts\s*\n([\s\S]*?)```/g)].map(
    (match) => match[1],
  )
}

function extractUrls(markdown: string): string[] {
  return markdown.match(/https?:\/\/[^\s)]+/g) ?? []
}

beforeAll(() => {
  content = readFileSync(FILEPATH, 'utf-8')
  lines = content.split('\n')
  codeBlocks = extractTsCodeBlocks(content)
})

describe('__mocks__/README.md — Next.js mock documentation', () => {
  // ─────────────────────────────────────────────────────────────────────────
  // File basics
  // ─────────────────────────────────────────────────────────────────────────

  describe('file basics', () => {
    it('file exists and is readable', () => {
      expect(() => readFileSync(FILEPATH, 'utf-8')).not.toThrow()
    })

    it('file is non-empty', () => {
      expect(content.trim()).not.toBe('')
    })

    it('contains meaningful documentation', () => {
      expect(lines.length).toBeGreaterThan(10)
    })

    it('ends with a newline', () => {
      expect(content.endsWith('\n')).toBe(true)
    })
  })

  // ─────────────────────────────────────────────────────────────────────────
  // Section headings
  // ─────────────────────────────────────────────────────────────────────────

  describe('section headings', () => {
    it('contains the mock functionality section', () => {
      expect(content).toContain('การทำงานของ Mock ใน Next.js')
    })

    it('contains the next-server.ts example section', () => {
      expect(content).toContain('next-server.ts')
    })

    it('contains the GitHub Workflow integration section', () => {
      expect(content).toContain('เชื่อมโยงกับ GitHub Workflow')
    })
  })

  // ─────────────────────────────────────────────────────────────────────────
  // Documented concepts
  // ─────────────────────────────────────────────────────────────────────────

  describe('documented concepts', () => {
    it.each(['API Routes', 'SSR', 'CI/CD'])(
      'documents %s',
      (concept) => {
        expect(content).toContain(concept)
      },
    )
  })

  // ─────────────────────────────────────────────────────────────────────────
  // Code examples
  // ─────────────────────────────────────────────────────────────────────────

  describe('TypeScript code examples', () => {
    it('contains at least one TypeScript code block', () => {
      expect(codeBlocks.length).toBeGreaterThan(0)
    })

    it('documents the next-server.ts source path', () => {
      expect(content).toContain('// mocks/next-server.ts')
    })

    it('exports mockServer', () => {
      expect(codeBlocks.join('\n')).toContain(
        'export const mockServer',
      )
    })

    it('defines a get method', () => {
      expect(codeBlocks.join('\n')).toMatch(
        /\bget\s*:/,
      )
    })

    it('accepts a URL parameter', () => {
      expect(codeBlocks.join('\n')).toMatch(
        /\bget\s*:\s*jest\.fn\(\s*\(\s*url\s*\)/,
      )
    })

    it('documents the /api/users endpoint', () => {
      expect(codeBlocks.join('\n')).toContain('/api/users')
    })

    it('documents the mock user fixture', () => {
      const code = codeBlocks.join('\n')

      expect(code).toContain('"Mock User"')
      expect(code).toContain('id: 1')
    })

    it('documents the successful response', () => {
      const code = codeBlocks.join('\n')

      expect(code).toContain('Promise.resolve')
      expect(code).toContain('data: [{ id: 1')
    })

    it('documents the error response', () => {
      const code = codeBlocks.join('\n')

      expect(code).toContain('Promise.reject')
      expect(code).toContain('Not Found')
    })
  })

  // ─────────────────────────────────────────────────────────────────────────
  // Mocking tooling
  // ─────────────────────────────────────────────────────────────────────────

  describe('mocking tooling', () => {
    it('mentions Jest as the mocking library', () => {
      expect(content).toContain('Jest')
    })

    it('documents jest.fn usage', () => {
      expect(codeBlocks.join('\n')).toContain('jest.fn')
    })

    it('explains importing mockServer', () => {
      expect(content).toContain('import mockServer')
    })
  })

  // ─────────────────────────────────────────────────────────────────────────
  // Security / regression
  // ─────────────────────────────────────────────────────────────────────────

  describe('security and regression checks', () => {
    it('does not contain external API URLs', () => {
      const urls = extractUrls(content)

      expect(urls).toEqual([])
    })

    it('does not contain obvious hard-coded credentials', () => {
      const credentialPattern =
        /(api[_-]?key|client[_-]?secret|password|access[_-]?token)\s*[:=]\s*['"][^'"]+['"]/i

      expect(content).not.toMatch(credentialPattern)
    })

    it('documents only the expected users endpoint', () => {
      const endpoints = content.match(
        /\/api\/[a-zA-Z0-9_/-]+/g,
      ) ?? []

      expect(new Set(endpoints)).toEqual(
        new Set(['/api/users']),
      )
    })

    it('documents the expected unknown-route behavior', () => {
      expect(content).toContain('Not Found')
    })
  })

  // ─────────────────────────────────────────────────────────────────────────
  // Markdown structure
  // ─────────────────────────────────────────────────────────────────────────

  describe('Markdown structure', () => {
    it('contains at least three bullet points', () => {
      const bulletLines = lines.filter((line) =>
        line.trim().startsWith('-'),
      )

      expect(bulletLines.length).toBeGreaterThanOrEqual(3)
    })

    it('contains a TypeScript fenced code block', () => {
      expect(content).toMatch(/```ts\s*\n/)
    })

    it('contains the documented source file reference', () => {
      expect(content).toContain('next-server.ts')
    })
  })
})

สิ่งที่เปลี่ยนหลัก ๆ

OLD                              NEW
────────────────────────────────────────────────────
exactly 27 lines                > 10 lines
no trailing newline             requires standard newline
count `if (url ===`             checks documented endpoint
fragile URL regex                extracts and validates URLs
search code in whole README      extracts ```ts blocks
syntax-heavy regex              contract-focused assertions
single giant describe            grouped test domains
implementation detail            documented behavior

English summary: This version treats README.md as a documentation contract, not as a snapshot of exact formatting. That makes the test much safer for CI, CodeRabbit review, and future documentation changes.

จุดสำคัญอีกอย่างคือ ถ้า project นี้ใช้ Vitest จริง ผมแนะนำให้เปลี่ยน documentation จาก jest.fn เป็น vi.fn ด้วย เพราะตอนนี้ test runner กับ mocking API คนละ ecosystem กันอยู่เล็กน้อยแบบที่มนุษย์ชอบเรียกว่า "ตั้งใจไว้ก่อน เดี๋ยวค่อยแก้".
