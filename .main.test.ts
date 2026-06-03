import { describe, it, expect, beforeAll } from 'vitest'
import { readFileSync } from 'fs'
import { resolve } from 'path'

/**
 * Tests for .main.py
 *
 * Despite the .py extension, this file contains an HTML fragment with
 * GitHub support contact links. These tests validate the structure and
 * content of that fragment.
 */

const FILEPATH = resolve(__dirname, '.main.py')
let content: string

beforeAll(() => {
  content = readFileSync(FILEPATH, 'utf-8')
})

describe('.main.py — HTML support contact links', () => {
  // ── File basics ─────────────────────────────────────────────────────────

  it('file exists and is readable', () => {
    expect(() => readFileSync(FILEPATH, 'utf-8')).not.toThrow()
  })

  it('file is non-empty', () => {
    expect(content.trim().length).toBeGreaterThan(0)
  })

  // ── Structural elements ──────────────────────────────────────────────────

  it('contains a div with id "s"', () => {
    expect(content).toMatch(/id=["']s["']/)
  })

  it('contains an opening <div> tag', () => {
    expect(content).toContain('<div')
  })

  it('contains a closing </div> tag', () => {
    expect(content).toContain('</div>')
  })

  it('contains a closing </body> tag', () => {
    expect(content).toContain('</body>')
  })

  it('contains exactly three anchor (<a>) tags', () => {
    const openingTags = content.match(/<a\s/g) ?? []
    expect(openingTags).toHaveLength(3)
  })

  it('each anchor tag has a closing </a>', () => {
    const closingTags = content.match(/<\/a>/g) ?? []
    expect(closingTags).toHaveLength(3)
  })

  // ── Link URLs ────────────────────────────────────────────────────────────

  it('contains the GitHub Support link URL', () => {
    expect(content).toContain('https://support.github.com')
  })

  it('contains the GitHub Status link URL', () => {
    expect(content).toContain('https://githubstatus.com')
  })

  it('contains the GitHub Status Twitter URL', () => {
    expect(content).toContain('https://twitter.com/githubstatus')
  })

  // ── Link text ────────────────────────────────────────────────────────────

  it('contains the "Contact Support" link text', () => {
    expect(content).toContain('Contact Support')
  })

  it('contains the "GitHub Status" link text', () => {
    expect(content).toContain('GitHub Status')
  })

  it('contains the "@githubstatus" link text', () => {
    expect(content).toContain('@githubstatus')
  })

  // ── HTML entities ────────────────────────────────────────────────────────

  it('uses &mdash; as separator between links', () => {
    expect(content).toContain('&mdash;')
  })

  it('contains exactly two &mdash; separators', () => {
    const mdashes = content.match(/&mdash;/g) ?? []
    expect(mdashes).toHaveLength(2)
  })

  // ── href attribute format ────────────────────────────────────────────────

  it('Contact Support link has correct href attribute', () => {
    expect(content).toMatch(/href=["']https:\/\/support\.github\.com["']/)
  })

  it('GitHub Status link has correct href attribute', () => {
    expect(content).toMatch(/href=["']https:\/\/githubstatus\.com["']/)
  })

  it('@githubstatus link has correct href attribute', () => {
    expect(content).toMatch(/href=["']https:\/\/twitter\.com\/githubstatus["']/)
  })

  // ── Regression: exact URLs are not swapped or altered ────────────────────

  it('Contact Support link is not pointing to githubstatus.com', () => {
    // Ensure the "Contact Support" text is associated with support.github.com, not the status URL
    const supportLinkPattern = /href=["']https:\/\/support\.github\.com["'][^>]*>\s*Contact Support/
    expect(content).toMatch(supportLinkPattern)
  })

  it('GitHub Status link is not pointing to support.github.com', () => {
    const statusLinkPattern = /href=["']https:\/\/githubstatus\.com["'][^>]*>\s*GitHub Status/
    expect(content).toMatch(statusLinkPattern)
  })

  it('@githubstatus link is not pointing to a non-twitter domain', () => {
    const twitterPattern = /href=["']https:\/\/twitter\.com\/githubstatus["'][^>]*>\s*@githubstatus/
    expect(content).toMatch(twitterPattern)
  })

  // ── Boundary: no unexpected external domains ─────────────────────────────

  it('only references expected external domains', () => {
    const hrefPattern = /href=["'](https?:\/\/[^"']+)["']/g
    const urls: string[] = []
    let match: RegExpExecArray | null
    while ((match = hrefPattern.exec(content)) !== null) {
      urls.push(match[1])
    }
    const allowedDomains = ['support.github.com', 'githubstatus.com', 'twitter.com']
    for (const url of urls) {
      const hostname = new URL(url).hostname
      expect(allowedDomains).toContain(hostname)
    }
    // Ensure we actually found URLs (guards against the regex silently matching nothing)
    expect(urls.length).toBeGreaterThan(0)
  })

  // ── Negative: must not reference insecure (http) links ───────────────────

  it('all links use https (not http)', () => {
    const httpOnlyPattern = /href=["']http:\/\//
    expect(content).not.toMatch(httpOnlyPattern)
  })
})
