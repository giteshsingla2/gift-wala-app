// Small helpers shared by the app API route handlers.

export class ApiError extends Error {
  constructor(
    public status: number,
    public code: string,
    message: string,
    public extra?: Record<string, unknown>,
  ) {
    super(message);
  }
}

export function json(data: unknown, init?: ResponseInit) {
  return Response.json(data, init);
}

/** Wraps a handler so thrown ApiErrors become JSON error responses. */
export function handle<Args extends unknown[]>(fn: (...args: Args) => Promise<Response>) {
  return async (...args: Args): Promise<Response> => {
    try {
      return await fn(...args);
    } catch (e) {
      if (e instanceof ApiError) {
        return Response.json({ error: { code: e.code, message: e.message, ...e.extra } }, { status: e.status });
      }
      console.error(e);
      return Response.json({ error: { code: "server_error", message: "Something went wrong." } }, { status: 500 });
    }
  };
}

export async function readJson<T = Record<string, unknown>>(request: Request): Promise<T> {
  try {
    return (await request.json()) as T;
  } catch {
    throw new ApiError(400, "bad_json", "Request body must be JSON.");
  }
}

/**
 * Absolute URL for a stored path like "/uploads/x.webp". Uses PUBLIC_URL when set (needed behind a
 * reverse proxy such as CloudPanel's Nginx, which forwards requests as localhost), then the forwarded
 * host headers, then the address the request came in on.
 */
export function absUrl(request: Request, path: string | null | undefined): string | null {
  if (!path) return null;
  if (/^https?:\/\//.test(path)) return path;
  return new URL(path, publicOrigin(request)).toString();
}

function publicOrigin(request: Request) {
  if (process.env.PUBLIC_URL) return process.env.PUBLIC_URL;
  const host = request.headers.get("x-forwarded-host");
  if (host) return `${request.headers.get("x-forwarded-proto")?.split(",")[0] ?? "https"}://${host.split(",")[0]}`;
  return request.url;
}
