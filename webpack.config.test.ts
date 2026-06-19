import { describe, it, expect } from 'vitest'
import { resolve } from 'path'

/**
 * Tests for webpack.config.js
 *
 * Validates the exported webpack configuration object: entry point,
 * output settings, and build mode.
 */

// eslint-disable-next-line @typescript-eslint/no-require-imports
const config = require('./webpack.config.js')

describe('webpack.config.js', () => {
  // ── Module shape ─────────────────────────────────────────────────────────

  it('exports an object', () => {
    expect(config).toBeDefined()
    expect(typeof config).toBe('object')
    expect(config).not.toBeNull()
  })

  // ── Entry point ──────────────────────────────────────────────────────────

  it('entry is set to ./src/index.js', () => {
    expect(config.entry).toBe('./src/index.js')
  })

  it('entry is a string (not an array or object)', () => {
    expect(typeof config.entry).toBe('string')
  })

  it('entry points to a .js file', () => {
    expect(config.entry).toMatch(/\.js$/)
  })

  // ── Output ───────────────────────────────────────────────────────────────

  it('output is defined', () => {
    expect(config.output).toBeDefined()
    expect(typeof config.output).toBe('object')
  })

  it('output.filename is main.js', () => {
    expect(config.output.filename).toBe('main.js')
  })

  it('output.path resolves to an absolute path ending in dist', () => {
    const expectedPath = resolve(__dirname, 'dist')
    expect(config.output.path).toBe(expectedPath)
  })

  it('output.path is an absolute path', () => {
    expect(config.output.path).toMatch(/^\//)
  })

  it('output.path ends with the directory name "dist"', () => {
    expect(config.output.path).toMatch(/(\/|\\)dist$/)
  })

  // ── Mode ─────────────────────────────────────────────────────────────────

  it('mode is set to production', () => {
    expect(config.mode).toBe('production')
  })

  it('mode is not development', () => {
    expect(config.mode).not.toBe('development')
  })

  it('mode is not none', () => {
    expect(config.mode).not.toBe('none')
  })

  // ── Regression: output filename is not mangled ───────────────────────────

  it('output.filename does not contain a content hash placeholder', () => {
    expect(config.output.filename).not.toMatch(/\[contenthash\]/)
    expect(config.output.filename).not.toMatch(/\[hash\]/)
  })

  it('output.filename does not have an unexpected extension', () => {
    expect(config.output.filename).not.toMatch(/\.min\.js$/)
    expect(config.output.filename).toMatch(/\.js$/)
  })

  // ── Boundary: no unexpected top-level keys ───────────────────────────────

  it('contains exactly the expected top-level keys', () => {
    const keys = Object.keys(config).sort()
    expect(keys).toEqual(['entry', 'mode', 'output'])
  })

  it('output contains exactly filename and path keys', () => {
    const outputKeys = Object.keys(config.output).sort()
    expect(outputKeys).toEqual(['filename', 'path'])
  })

  // ── Negative: entry does not point to a non-JS file ─────────────────────

  it('entry does not reference a TypeScript file', () => {
    expect(config.entry).not.toMatch(/\.ts$/)
  })

  it('entry does not reference the output dist directory', () => {
    expect(config.entry).not.toContain('dist')
  })
})








































  it('entry path contains no whitespace', () => {
    expect(config.entry).not.toMatch(/\s/)
  })

  // ── Additional: mode is a string type ────────────────────────────────────

  it('mode is a string type', () => {
    expect(typeof config.mode).toBe('string')
  })

  // ── Additional: output.path is a child of __dirname ──────────────────────

  it('output.path is nested under the project root directory', () => {
    expect(config.output.path.startsWith(__dirname)).toBe(true)
  })

  // ── Additional: output.path length exceeds __dirname length ──────────────

  it('output.path is longer than __dirname (dist was appended, not stripped)', () => {
    expect(config.output.path.length).toBeGreaterThan(__dirname.length)
  })

  // ── Additional: entry references the src directory ───────────────────────

  it('entry path includes the "src" directory segment', () => {
    expect(config.entry).toContain('src')
  })

  // ── Additional: output object is not null ────────────────────────────────

  it('output is not null', () => {
    expect(config.output).not.toBeNull()
  })

  // ── Additional: output.filename is a non-empty string ────────────────────

  it('output.filename is a non-empty string', () => {
    expect(typeof config.output.filename).toBe('string')
    expect(config.output.filename.length).toBeGreaterThan(0)
  })
})
