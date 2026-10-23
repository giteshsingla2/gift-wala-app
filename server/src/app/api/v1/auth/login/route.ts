import { loginWithPhone, serializeUser } from "@/lib/app-auth";
import { handle, json, readJson } from "@/lib/http";

// POST /api/v1/auth/login { phone }
export const POST = handle(async (request: Request) => {
  const body = await readJson<{ phone?: string }>(request);
  const { token, user, isNew } = await loginWithPhone(String(body.phone ?? ""));
  return json({ token, user: serializeUser(user), isNew });
});
