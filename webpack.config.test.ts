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

  // ── Additional: single-compiler config (not an array) ───────────────────

  it('config is not an array (single-compiler config, not multi-compiler)', () => {
    expect(Array.isArray(config)).toBe(false)
  })

  // ── Additional: entry uses a relative path ───────────────────────────────

  it('entry starts with "./" indicating a relative path', () => {
    expect(config.entry).toMatch(/^\.\//)
  })

  // ── Additional: output.filename is a bare filename, no path separators ───

  it('output.filename contains no path separators', () => {
    expect(config.output.filename).not.toContain('/')
    expect(config.output.filename).not.toContain('\\')
  })

  // ── Additional: output.path is not just __dirname (dist was appended) ────

  it('output.path is not equal to the project root directory alone', () => {
    expect(config.output.path).not.toBe(__dirname)
  })

  // ── Additional: mode is one of the three valid webpack mode values ────────

  it('mode is one of the valid webpack mode values', () => {
    const validModes = ['production', 'development', 'none']
    expect(validModes).toContain(config.mode)
  })

  // ── Additional: output.filename has no whitespace ────────────────────────

  it('output.filename contains no whitespace', () => {
    expect(config.output.filename).not.toMatch(/\s/)
  })

  // ── Additional: entry has no whitespace ──────────────────────────────────

  it('entry path contains no whitespace', () => {
    expect(config.entry).not.toMatch(/\s/)
  })
})
