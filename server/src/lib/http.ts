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

/** Absolute URL for a stored path like "/uploads/x.webp", based on the host the app called. */
export function absUrl(request: Request, path: string | null | undefined): string | null {
  if (!path) return null;
  if (/^https?:\/\//.test(path)) return path;
  return new URL(path, request.url).toString();
}
