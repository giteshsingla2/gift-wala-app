import { requireUser } from "@/lib/app-auth";
import { serializeTask } from "@/lib/giveaways";
import { startHaazri } from "@/lib/haazri";
import { handle, json } from "@/lib/http";

// POST /api/v1/giveaways/:id/haazri/start
export const POST = handle(async (request: Request, ctx: RouteContext<"/api/v1/giveaways/[id]/haazri/start">) => {
  const user = await requireUser(request);
  const { attemptId, task, day } = await startHaazri(user.id, Number((await ctx.params).id));
  return json({ attemptId, day, task: serializeTask(task) });
});
