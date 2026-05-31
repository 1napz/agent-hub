import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import Home from './page'

/**
 * Tests for apps/web/app/page.tsx
 *
 * Home renders a page with:
 *   - An <h1> "Agent Hub"
 *   - A <p> describing the three integrated packages
 *   - An <ol> with 3 setup instructions
 */
describe('Home page component', () => {
  it('renders without throwing', () => {
    expect(() => render(<Home />)).not.toThrow()
  })

  it('renders the "Agent Hub" heading', () => {
    render(<Home />)
    expect(screen.getByRole('heading', { level: 1 })).toBeDefined()
    expect(screen.getByRole('heading', { level: 1 }).textContent).toBe('Agent Hub')
  })

  it('renders a <main> element', () => {
    render(<Home />)
    expect(screen.getByRole('main')).toBeDefined()
  })

  it('<main> has inline padding style set to 48', () => {
    render(<Home />)
    const main = screen.getByRole('main')
    expect((main as HTMLElement).style.padding).toBe('48px')
  })

  it('<main> has inline fontFamily style set to system-ui', () => {
    render(<Home />)
    const main = screen.getByRole('main')
    expect((main as HTMLElement).style.fontFamily).toBe('system-ui')
  })

  it('renders a description paragraph mentioning pure-agent-dev', () => {
    render(<Home />)
    const para = screen.getByText(/pure-agent-dev/i)
    expect(para).toBeDefined()
  })

  it('renders a description paragraph mentioning crystalcastle-ai', () => {
    render(<Home />)
    const para = screen.getByText(/crystalcastle-ai/i)
    expect(para).toBeDefined()
  })

  it('renders a description paragraph mentioning claude-code', () => {
    render(<Home />)
    const para = screen.getByText(/claude-code/i)
    expect(para).toBeDefined()
  })

  it('renders an ordered list', () => {
    render(<Home />)
    expect(screen.getByRole('list')).toBeDefined()
    // The list should be an <ol>
    expect(screen.getByRole('list').tagName.toLowerCase()).toBe('ol')
  })

  it('ordered list has 3 items', () => {
    render(<Home />)
    const items = screen.getAllByRole('listitem')
    expect(items).toHaveLength(3)
  })

  it('first list item mentions crystalcastle', () => {
    render(<Home />)
    const items = screen.getAllByRole('listitem')
    expect(items[0].textContent).toContain('crystalcastle')
  })

  it('second list item mentions Supabase', () => {
    render(<Home />)
    const items = screen.getAllByRole('listitem')
    expect(items[1].textContent).toContain('Supabase')
  })

  it('third list item mentions pnpm dev', () => {
    render(<Home />)
    const items = screen.getAllByRole('listitem')
    expect(items[2].textContent).toContain('pnpm dev')
  })

  // Regression: component should produce a non-empty DOM subtree
  it('renders non-empty content', () => {
    const { container } = render(<Home />)
    expect(container.innerHTML.length).toBeGreaterThan(0)
  })

  // Boundary: multiple renders are independent (no shared mutable state)
  it('can be rendered multiple times without error', () => {
    expect(() => {
      render(<Home />)
      render(<Home />)
    }).not.toThrow()
  })
})