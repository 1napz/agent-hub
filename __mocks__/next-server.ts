// __mocks__/next-server.ts
/**
 * Expanded shim for next/server used in tests.
 * Provides minimal implementations of NextResponse, NextRequest,
 * and middleware helpers.
 */

export class NextRequest extends Request {
  constructor(input: RequestInfo, init?: RequestInit) {
    super(input, init)
  }

  get nextUrl(): URL {
    return new URL(this.url)
  }
}

export class MiddlewareResponse extends Response {
  constructor(body?: BodyInit | null, init?: ResponseInit) {
    super(body, init)
  }

  // Mimic setting headers in middleware
  setHeader(name: string, value: string) {
    this.headers.set(name, value)
  }

  // Mimic setting cookies in middleware
  setCookie(name: string, value: string) {
    this.headers.append('Set-Cookie', `${name}=${value}`)
  }
}

export const NextResponse = {
  json<T>(body: T, init?: ResponseInit): Response {
    return new Response(JSON.stringify(body), {
      status: init?.status ?? 200,
      headers: {
        'Content-Type': 'application/json',
        ...(init?.headers instanceof Headers
          ? Object.fromEntries(init.headers.entries())
          : (init?.headers as Record<string, string> | undefined)),
      },
    })
  },

  redirect(url: string, status: number = 307): MiddlewareResponse {
    return new MiddlewareResponse(null, {
      status,
      headers: { Location: url },
    })
  },

  rewrite(url: string, init?: ResponseInit): MiddlewareResponse {
    return new MiddlewareResponse(null, {
      status: init?.status ?? 200,
      headers: {
        'x-mock-rewrite': url,
        ...(init?.headers as Record<string, string> | undefined),
      },
    })
  },

  next(init?: ResponseInit): MiddlewareResponse {
    return new MiddlewareResponse(null, {
      status: init?.status ?? 200,
      headers: {
        ...(init?.headers as Record<string, string> | undefined),
      },
    })
  },
}