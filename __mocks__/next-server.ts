// __mocks__/next-server.ts
/**
 * Expanded shim for next/server used in tests.
 * Provides minimal implementations of NextResponse, NextRequest,
 * and helpers like redirect/rewrite.
 */

export class NextRequest extends Request {
  constructor(input: RequestInfo, init?: RequestInit) {
    super(input, init)
  }

  // Mimic NextRequest.url and nextUrl
  get nextUrl(): URL {
    return new URL(this.url)
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

  redirect(url: string, status: number = 307): Response {
    return new Response(null, {
      status,
      headers: { Location: url },
    })
  },

  rewrite(url: string, init?: ResponseInit): Response {
    return new Response(null, {
      status: init?.status ?? 200,
      headers: {
        'x-mock-rewrite': url,
        ...(init?.headers as Record<string, string> | undefined),
      },
    })
  },
}