import { readFile } from "node:fs/promises";
import path from "node:path";

import { uploadDir } from "@/lib/uploads";

// Serves images saved by lib/uploads.ts. Only plain file names, only from the upload folder.
export async function GET(_request: Request, ctx: RouteContext<"/uploads/[...file]">) {
  const { file } = await ctx.params;
  const name = file.join("/");
  if (!/^[\w.-]+\.webp$/.test(name)) return new Response("Not found", { status: 404 });
  try {
    const data = await readFile(path.join(uploadDir(), name));
    return new Response(data, {
      headers: { "Content-Type": "image/webp", "Cache-Control": "public, max-age=31536000, immutable" },
    });
  } catch {
    return new Response("Not found", { status: 404 });
  }
}
