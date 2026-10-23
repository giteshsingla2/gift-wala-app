"use client";

import { useActionState } from "react";

import { buttonClass, Field, FormMessage, inputClass } from "@/components/admin/ui";
import { adminLogin } from "@/server-actions/auth";

export function LoginForm() {
  const [state, action, pending] = useActionState(adminLogin, {});
  return (
    <form action={action} className="space-y-4">
      <Field label="Admin password">
        <input type="password" name="password" required autoFocus autoComplete="current-password" className={inputClass} />
      </Field>
      <FormMessage error={state.error} />
      <button type="submit" disabled={pending} className={`${buttonClass()} w-full`}>
        {pending ? "Signing in…" : "Sign in"}
      </button>
    </form>
  );
}
