"use server";

import { redirect } from "next/navigation";

import { checkAdminPassword, clearAdminCookie, setAdminCookie } from "@/lib/admin-auth";
import { str, type ActionState } from "@/lib/form";

export async function adminLogin(_prev: ActionState, fd: FormData): Promise<ActionState> {
  if (!checkAdminPassword(str(fd, "password"))) return { error: "Wrong password." };
  await setAdminCookie();
  redirect("/admin");
}

export async function adminLogout() {
  await clearAdminCookie();
  redirect("/admin/login");
}
