import { requireUser } from "@/lib/app-auth";
import { handle, json } from "@/lib/http";
import { serializeWinner, spotlightWinner, winnersForRange } from "@/lib/winners";

const RANGES = ["yesterday", "week", "mega"] as const;

// GET /api/v1/winners?range=yesterday|week|mega
export const GET = handle(async (request: Request) => {
  await requireUser(request);
  const param = new URL(request.url).searchParams.get("range");
  const range = RANGES.find((r) => r === param) ?? "yesterday";
  const [{ rows, total }, spotlight] = await Promise.all([winnersForRange(range), spotlightWinner()]);
  return json({
    spotlight: spotlight ? serializeWinner(request, spotlight) : null,
    winners: rows.map((r) => serializeWinner(request, r)),
    total,
  });
});
