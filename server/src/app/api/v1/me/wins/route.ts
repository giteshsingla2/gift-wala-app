import { requireUser } from "@/lib/app-auth";
import { handle, json } from "@/lib/http";
import { serializeWinner, userWins, walletTotal } from "@/lib/winners";

// GET /api/v1/me/wins
export const GET = handle(async (request: Request) => {
  const user = await requireUser(request);
  const [rows, wallet] = await Promise.all([userWins(user.id), walletTotal(user.id)]);
  return json({ wins: rows.map((r) => serializeWinner(request, r)), wallet });
});
