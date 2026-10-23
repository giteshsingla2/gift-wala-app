import { requireUser } from "@/lib/app-auth";
import { completeHaazri } from "@/lib/haazri";
import { handle, json, readJson } from "@/lib/http";

// POST /api/v1/giveaways/:id/haazri/complete { attemptId, sharesOpened? }
export const POST = handle(async (request: Request, ctx: RouteContext<"/api/v1/giveaways/[id]/haazri/complete">) => {
  const user = await requireUser(request);
  const body = await readJson<{ attemptId?: number; sharesOpened?: number }>(request);
  const progress = await completeHaazri(user.id, Number((await ctx.params).id), Number(body.attemptId), Number(body.sharesOpened ?? 0));
  return json({ progress });
});
