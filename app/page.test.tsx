import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react'
import PersonalPage from './page'

/**
 * Tests for app/page.tsx
 *
 * PersonalPage renders a personal profile page with:
 *   - A hero section with avatar "1N", h1 "1napz", and external links
 *   - An "About Me" section
 *   - A request form with name, email, type, message fields
 *   - Status feedback (success / error banners)
 *   - Submit button that is disabled while loading
 */

describe('PersonalPage component', () => {
  // ─── Rendering ──────────────────────────────────────────────────────────────

  it('renders without throwing', () => {
    expect(() => render(<PersonalPage />)).not.toThrow()
  })

  it('renders a <main> element', () => {
    render(<PersonalPage />)
    expect(screen.getByRole('main')).toBeDefined()
  })

  it('renders non-empty content', () => {
    const { container } = render(<PersonalPage />)
    expect(container.innerHTML.length).toBeGreaterThan(0)
  })

  it('can be rendered multiple times without error', () => {
    expect(() => {
      render(<PersonalPage />)
      render(<PersonalPage />)
    }).not.toThrow()
  })

  // ─── Hero Section ────────────────────────────────────────────────────────────

  it('renders the avatar text "1N"', () => {
    render(<PersonalPage />)
    expect(screen.getByText('1N')).toBeDefined()
  })

  it('renders the h1 heading "1napz"', () => {
    render(<PersonalPage />)
    const heading = screen.getByRole('heading', { level: 1 })
    expect(heading).toBeDefined()
    expect(heading.textContent).toBe('1napz')
  })

  it('renders the subtitle "Developer & AI Enthusiast"', () => {
    render(<PersonalPage />)
    expect(screen.getByText('Developer & AI Enthusiast')).toBeDefined()
  })

  it('renders a GitHub link with correct href', () => {
    render(<PersonalPage />)
    const githubLink = screen.getByRole('link', { name: /github/i })
    expect(githubLink).toBeDefined()
    expect((githubLink as HTMLAnchorElement).href).toContain('github.com/1napz')
  })

  it('renders an Agent Hub link with correct href', () => {
    render(<PersonalPage />)
    const agentHubLink = screen.getByRole('link', { name: /agent hub/i })
    expect(agentHubLink).toBeDefined()
    expect((agentHubLink as HTMLAnchorElement).href).toContain('agent-hub-snowy.vercel.app')
  })

  it('external links open in a new tab (target="_blank")', () => {
    render(<PersonalPage />)
    const links = screen.getAllByRole('link')
    links.forEach((link) => {
      expect((link as HTMLAnchorElement).target).toBe('_blank')
    })
  })

  // ─── About Section ───────────────────────────────────────────────────────────

  it('renders the "About Me" heading', () => {
    render(<PersonalPage />)
    const headings = screen.getAllByRole('heading', { level: 2 })
    const aboutHeading = headings.find((h) => h.textContent === 'About Me')
    expect(aboutHeading).toBeDefined()
  })

  it('renders About Me section content mentioning "Agent Hub"', () => {
    render(<PersonalPage />)
    const aboutText = screen.getByText(/Agent Hub/i)
    expect(aboutText).toBeDefined()
  })

  // ─── Request Form Section ────────────────────────────────────────────────────

  it('renders the "Send a Request" heading', () => {
    render(<PersonalPage />)
    const headings = screen.getAllByRole('heading', { level: 2 })
    const formHeading = headings.find((h) => h.textContent?.includes('Send a Request'))
    expect(formHeading).toBeDefined()
  })

  it('renders a form element', () => {
    render(<PersonalPage />)
    // form is not a role; verify via container
    const { container } = render(<PersonalPage />)
    expect(container.querySelector('form')).toBeDefined()
  })

  it('renders the name text input field', () => {
    const { container } = render(<PersonalPage />)
    const nameInput = container.querySelector('input[type="text"]')
    expect(nameInput).toBeDefined()
  })

  it('name input is required', () => {
    const { container } = render(<PersonalPage />)
    const nameInput = container.querySelector('input[type="text"]') as HTMLInputElement
    expect(nameInput.required).toBe(true)
  })

  it('renders the email input field', () => {
    const { container } = render(<PersonalPage />)
    const emailInput = container.querySelector('input[type="email"]')
    expect(emailInput).toBeDefined()
  })

  it('email input is not required', () => {
    const { container } = render(<PersonalPage />)
    const emailInput = container.querySelector('input[type="email"]') as HTMLInputElement
    expect(emailInput.required).toBe(false)
  })

  it('renders the type select field', () => {
    const { container } = render(<PersonalPage />)
    const select = container.querySelector('select')
    expect(select).toBeDefined()
  })

  it('type select has four options: feature, bug, collaboration, other', () => {
    const { container } = render(<PersonalPage />)
    const options = container.querySelectorAll('select option')
    expect(options).toHaveLength(4)
    const values = Array.from(options).map((o) => (o as HTMLOptionElement).value)
    expect(values).toContain('feature')
    expect(values).toContain('bug')
    expect(values).toContain('collaboration')
    expect(values).toContain('other')
  })

  it('type select defaults to "feature"', () => {
    const { container } = render(<PersonalPage />)
    const select = container.querySelector('select') as HTMLSelectElement
    expect(select.value).toBe('feature')
  })

  it('renders the message textarea field', () => {
    const { container } = render(<PersonalPage />)
    const textarea = container.querySelector('textarea')
    expect(textarea).toBeDefined()
  })

  it('message textarea is required', () => {
    const { container } = render(<PersonalPage />)
    const textarea = container.querySelector('textarea') as HTMLTextAreaElement
    expect(textarea.required).toBe(true)
  })

  it('message textarea has 4 rows', () => {
    const { container } = render(<PersonalPage />)
    const textarea = container.querySelector('textarea') as HTMLTextAreaElement
    expect(textarea.rows).toBe(4)
  })

  // ─── Submit Button Initial State ─────────────────────────────────────────────

  it('renders a submit button with initial text "ส่งคำขอ"', () => {
    render(<PersonalPage />)
    const btn = screen.getByRole('button', { name: 'ส่งคำขอ' })
    expect(btn).toBeDefined()
  })

  it('submit button is not disabled initially', () => {
    render(<PersonalPage />)
    const btn = screen.getByRole('button', { name: 'ส่งคำขอ' }) as HTMLButtonElement
    expect(btn.disabled).toBe(false)
  })

  // ─── Status Banners not shown on initial render ───────────────────────────────

  it('does not show success banner initially', () => {
    render(<PersonalPage />)
    expect(screen.queryByText(/ส่งคำขอเรียบร้อยแล้ว/)).toBeNull()
  })

  it('does not show error banner initially', () => {
    render(<PersonalPage />)
    expect(screen.queryByText(/เกิดข้อผิดพลาด/)).toBeNull()
  })

  // ─── Form Field Interactions ─────────────────────────────────────────────────

  it('name input updates value on change', () => {
    const { container } = render(<PersonalPage />)
    const nameInput = container.querySelector('input[type="text"]') as HTMLInputElement
    fireEvent.change(nameInput, { target: { value: 'Alice' } })
    expect(nameInput.value).toBe('Alice')
  })

  it('email input updates value on change', () => {
    const { container } = render(<PersonalPage />)
    const emailInput = container.querySelector('input[type="email"]') as HTMLInputElement
    fireEvent.change(emailInput, { target: { value: 'alice@example.com' } })
    expect(emailInput.value).toBe('alice@example.com')
  })

  it('type select updates value on change', () => {
    const { container } = render(<PersonalPage />)
    const select = container.querySelector('select') as HTMLSelectElement
    fireEvent.change(select, { target: { value: 'bug' } })
    expect(select.value).toBe('bug')
  })

  it('message textarea updates value on change', () => {
    const { container } = render(<PersonalPage />)
    const textarea = container.querySelector('textarea') as HTMLTextAreaElement
    fireEvent.change(textarea, { target: { value: 'This is a test message.' } })
    expect(textarea.value).toBe('This is a test message.')
  })

  // ─── Form Submission – Success Path ──────────────────────────────────────────

  describe('on successful form submission', () => {
    beforeEach(() => {
      vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: true }))
    })

    afterEach(() => {
      vi.unstubAllGlobals()
    })

    it('shows success banner after successful submission', async () => {
      const { container } = render(<PersonalPage />)
      const nameInput = container.querySelector('input[type="text"]') as HTMLInputElement
      const textarea = container.querySelector('textarea') as HTMLTextAreaElement
      const form = container.querySelector('form') as HTMLFormElement

      fireEvent.change(nameInput, { target: { value: 'Alice' } })
      fireEvent.change(textarea, { target: { value: 'Hello!' } })
      fireEvent.submit(form)

      await waitFor(() => {
        expect(screen.getByText(/ส่งคำขอเรียบร้อยแล้ว/)).toBeDefined()
      })
    })

    it('resets form fields to empty after successful submission', async () => {
      const { container } = render(<PersonalPage />)
      const nameInput = container.querySelector('input[type="text"]') as HTMLInputElement
      const emailInput = container.querySelector('input[type="email"]') as HTMLInputElement
      const textarea = container.querySelector('textarea') as HTMLTextAreaElement
      const form = container.querySelector('form') as HTMLFormElement

      fireEvent.change(nameInput, { target: { value: 'Alice' } })
      fireEvent.change(emailInput, { target: { value: 'alice@example.com' } })
      fireEvent.change(textarea, { target: { value: 'Hello!' } })
      fireEvent.submit(form)

      await waitFor(() => {
        expect(nameInput.value).toBe('')
        expect(emailInput.value).toBe('')
        expect(textarea.value).toBe('')
      })
    })

    it('resets type select to "feature" after successful submission', async () => {
      const { container } = render(<PersonalPage />)
      const select = container.querySelector('select') as HTMLSelectElement
      const nameInput = container.querySelector('input[type="text"]') as HTMLInputElement
      const textarea = container.querySelector('textarea') as HTMLTextAreaElement
      const form = container.querySelector('form') as HTMLFormElement

      fireEvent.change(select, { target: { value: 'bug' } })
      fireEvent.change(nameInput, { target: { value: 'Alice' } })
      fireEvent.change(textarea, { target: { value: 'Hello!' } })
      fireEvent.submit(form)

      await waitFor(() => {
        expect(select.value).toBe('feature')
      })
    })

    it('calls fetch with POST method and correct endpoint', async () => {
      const { container } = render(<PersonalPage />)
      const nameInput = container.querySelector('input[type="text"]') as HTMLInputElement
      const textarea = container.querySelector('textarea') as HTMLTextAreaElement
      const form = container.querySelector('form') as HTMLFormElement

      fireEvent.change(nameInput, { target: { value: 'Alice' } })
      fireEvent.change(textarea, { target: { value: 'Test message' } })
      fireEvent.submit(form)

      await waitFor(() => {
        expect(vi.mocked(fetch)).toHaveBeenCalledWith(
          '/api/requests',
          expect.objectContaining({ method: 'POST' })
        )
      })
    })

    it('calls fetch with Content-Type application/json header', async () => {
      const { container } = render(<PersonalPage />)
      const nameInput = container.querySelector('input[type="text"]') as HTMLInputElement
      const textarea = container.querySelector('textarea') as HTMLTextAreaElement
      const form = container.querySelector('form') as HTMLFormElement

      fireEvent.change(nameInput, { target: { value: 'Alice' } })
      fireEvent.change(textarea, { target: { value: 'Test' } })
      fireEvent.submit(form)

      await waitFor(() => {
        expect(vi.mocked(fetch)).toHaveBeenCalledWith(
          '/api/requests',
          expect.objectContaining({
            headers: { 'Content-Type': 'application/json' },
          })
        )
      })
    })

    it('sends form data serialized as JSON in the request body', async () => {
      const { container } = render(<PersonalPage />)
      const nameInput = container.querySelector('input[type="text"]') as HTMLInputElement
      const emailInput = container.querySelector('input[type="email"]') as HTMLInputElement
      const textarea = container.querySelector('textarea') as HTMLTextAreaElement
      const form = container.querySelector('form') as HTMLFormElement

      fireEvent.change(nameInput, { target: { value: 'Alice' } })
      fireEvent.change(emailInput, { target: { value: 'alice@example.com' } })
      fireEvent.change(textarea, { target: { value: 'Hello!' } })
      fireEvent.submit(form)

      await waitFor(() => {
        const callArgs = vi.mocked(fetch).mock.calls[0]
        const body = JSON.parse(callArgs[1]?.body as string)
        expect(body.name).toBe('Alice')
        expect(body.email).toBe('alice@example.com')
        expect(body.message).toBe('Hello!')
        expect(body.type).toBe('feature')
      })
    })

    it('does not show error banner after successful submission', async () => {
      const { container } = render(<PersonalPage />)
      const nameInput = container.querySelector('input[type="text"]') as HTMLInputElement
      const textarea = container.querySelector('textarea') as HTMLTextAreaElement
      const form = container.querySelector('form') as HTMLFormElement

      fireEvent.change(nameInput, { target: { value: 'Alice' } })
      fireEvent.change(textarea, { target: { value: 'Hello!' } })
      fireEvent.submit(form)

      await waitFor(() => {
        expect(screen.queryByText(/เกิดข้อผิดพลาด/)).toBeNull()
      })
    })
  })

  // ─── Form Submission – Error Path (non-ok response) ──────────────────────────

  describe('on failed form submission (non-ok response)', () => {
    beforeEach(() => {
      vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: false }))
    })

    afterEach(() => {
      vi.unstubAllGlobals()
    })

    it('shows error banner when API returns non-ok response', async () => {
      const { container } = render(<PersonalPage />)
      const nameInput = container.querySelector('input[type="text"]') as HTMLInputElement
      const textarea = container.querySelector('textarea') as HTMLTextAreaElement
      const form = container.querySelector('form') as HTMLFormElement

      fireEvent.change(nameInput, { target: { value: 'Alice' } })
      fireEvent.change(textarea, { target: { value: 'Hello!' } })
      fireEvent.submit(form)

      await waitFor(() => {
        expect(screen.getByText(/เกิดข้อผิดพลาด/)).toBeDefined()
      })
    })

    it('does not show success banner when API returns non-ok response', async () => {
      const { container } = render(<PersonalPage />)
      const nameInput = container.querySelector('input[type="text"]') as HTMLInputElement
      const textarea = container.querySelector('textarea') as HTMLTextAreaElement
      const form = container.querySelector('form') as HTMLFormElement

      fireEvent.change(nameInput, { target: { value: 'Alice' } })
      fireEvent.change(textarea, { target: { value: 'Hello!' } })
      fireEvent.submit(form)

      await waitFor(() => {
        expect(screen.queryByText(/ส่งคำขอเรียบร้อยแล้ว/)).toBeNull()
      })
    })

    it('does not reset form fields when API returns non-ok response', async () => {
      const { container } = render(<PersonalPage />)
      const nameInput = container.querySelector('input[type="text"]') as HTMLInputElement
      const textarea = container.querySelector('textarea') as HTMLTextAreaElement
      const form = container.querySelector('form') as HTMLFormElement

      fireEvent.change(nameInput, { target: { value: 'Alice' } })
      fireEvent.change(textarea, { target: { value: 'Hello!' } })
      fireEvent.submit(form)

      await waitFor(() => {
        expect(nameInput.value).toBe('Alice')
        expect(textarea.value).toBe('Hello!')
      })
    })
  })

  // ─── Form Submission – Network Error Path ────────────────────────────────────

  describe('on network error during form submission', () => {
    beforeEach(() => {
      vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('Network error')))
    })

    afterEach(() => {
      vi.unstubAllGlobals()
    })

    it('shows error banner when fetch throws a network error', async () => {
      const { container } = render(<PersonalPage />)
      const nameInput = container.querySelector('input[type="text"]') as HTMLInputElement
      const textarea = container.querySelector('textarea') as HTMLTextAreaElement
      const form = container.querySelector('form') as HTMLFormElement

      fireEvent.change(nameInput, { target: { value: 'Alice' } })
      fireEvent.change(textarea, { target: { value: 'Hello!' } })
      fireEvent.submit(form)

      await waitFor(() => {
        expect(screen.getByText(/เกิดข้อผิดพลาด/)).toBeDefined()
      })
    })

    it('does not show success banner when fetch throws', async () => {
      const { container } = render(<PersonalPage />)
      const nameInput = container.querySelector('input[type="text"]') as HTMLInputElement
      const textarea = container.querySelector('textarea') as HTMLTextAreaElement
      const form = container.querySelector('form') as HTMLFormElement

      fireEvent.change(nameInput, { target: { value: 'Alice' } })
      fireEvent.change(textarea, { target: { value: 'Hello!' } })
      fireEvent.submit(form)

      await waitFor(() => {
        expect(screen.queryByText(/ส่งคำขอเรียบร้อยแล้ว/)).toBeNull()
      })
    })
  })

  // ─── Loading State ────────────────────────────────────────────────────────────

  describe('loading state during submission', () => {
    it('disables the submit button while request is in-flight', async () => {
      // fetch that never resolves, so we can inspect the loading state
      let resolveFetch!: (value: unknown) => void
      vi.stubGlobal(
        'fetch',
        vi.fn().mockReturnValue(new Promise((resolve) => { resolveFetch = resolve }))
      )

      const { container } = render(<PersonalPage />)
      const nameInput = container.querySelector('input[type="text"]') as HTMLInputElement
      const textarea = container.querySelector('textarea') as HTMLTextAreaElement
      const form = container.querySelector('form') as HTMLFormElement

      fireEvent.change(nameInput, { target: { value: 'Alice' } })
      fireEvent.change(textarea, { target: { value: 'Hello!' } })

      await act(async () => {
        fireEvent.submit(form)
      })

      const btn = container.querySelector('button[type="submit"]') as HTMLButtonElement
      expect(btn.disabled).toBe(true)

      // Cleanup: resolve the promise to avoid unhandled rejection
      await act(async () => {
        resolveFetch({ ok: true })
      })

      vi.unstubAllGlobals()
    })

    it('shows loading text "กำลังส่ง..." on button while request is in-flight', async () => {
      let resolveFetch!: (value: unknown) => void
      vi.stubGlobal(
        'fetch',
        vi.fn().mockReturnValue(new Promise((resolve) => { resolveFetch = resolve }))
      )

      const { container } = render(<PersonalPage />)
      const nameInput = container.querySelector('input[type="text"]') as HTMLInputElement
      const textarea = container.querySelector('textarea') as HTMLTextAreaElement
      const form = container.querySelector('form') as HTMLFormElement

      fireEvent.change(nameInput, { target: { value: 'Alice' } })
      fireEvent.change(textarea, { target: { value: 'Hello!' } })

      await act(async () => {
        fireEvent.submit(form)
      })

      expect(screen.getByText('กำลังส่ง...')).toBeDefined()

      await act(async () => {
        resolveFetch({ ok: true })
      })

      vi.unstubAllGlobals()
    })
  })

  // ─── Regression & Boundary ───────────────────────────────────────────────────

  it('regression: submitting with only whitespace in name still sends the request', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: true }))

    const { container } = render(<PersonalPage />)
    const nameInput = container.querySelector('input[type="text"]') as HTMLInputElement
    const textarea = container.querySelector('textarea') as HTMLTextAreaElement
    const form = container.querySelector('form') as HTMLFormElement

    fireEvent.change(nameInput, { target: { value: '   ' } })
    fireEvent.change(textarea, { target: { value: 'message' } })
    fireEvent.submit(form)

    await waitFor(() => {
      expect(vi.mocked(fetch)).toHaveBeenCalledOnce()
    })

    vi.unstubAllGlobals()
  })

  it('boundary: selecting "other" type and submitting sends type="other" in body', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: true }))

    const { container } = render(<PersonalPage />)
    const nameInput = container.querySelector('input[type="text"]') as HTMLInputElement
    const textarea = container.querySelector('textarea') as HTMLTextAreaElement
    const select = container.querySelector('select') as HTMLSelectElement
    const form = container.querySelector('form') as HTMLFormElement

    fireEvent.change(nameInput, { target: { value: 'Bob' } })
    fireEvent.change(select, { target: { value: 'other' } })
    fireEvent.change(textarea, { target: { value: 'General inquiry' } })
    fireEvent.submit(form)

    await waitFor(() => {
      const callArgs = vi.mocked(fetch).mock.calls[0]
      const body = JSON.parse(callArgs[1]?.body as string)
      expect(body.type).toBe('other')
    })

    vi.unstubAllGlobals()
  })
})
