/**
 * Minimal shim for next/server used in tests.
 * Provides a NextResponse.json that wraps the standard Web API Response.
 */
export const NextResponse = {
  json: (body: unknown, init?: ResponseInit) => {
    return new Response(JSON.stringify(body), {
      status: init?.status ?? 200,
      headers: {
        'Content-Type': 'application/json',
        ...(init?.headers as Record<string, string> | undefined),
      },
    })
  },
}