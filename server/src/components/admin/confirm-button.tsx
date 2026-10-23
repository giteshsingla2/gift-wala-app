"use client";

import { useState } from "react";
import { useFormStatus } from "react-dom";

import { buttonClass } from "./ui";

// Two-step submit for destructive form actions: the first click asks inline, the second submits.
// Avoids window.confirm, which some browsers and embedded webviews silently block.
export function ConfirmButton({ message, children, confirmLabel = "Yes, delete" }: { message: string; children: React.ReactNode; confirmLabel?: string }) {
  const [armed, setArmed] = useState(false);
  const { pending } = useFormStatus();

  if (!armed) {
    return (
      <button type="button" className={buttonClass("danger")} onClick={() => setArmed(true)}>
        {children}
      </button>
    );
  }
  return (
    <span className="inline-flex flex-wrap items-center gap-2" role="group" aria-label={message}>
      <span className="text-sm font-medium text-red-700">{message}</span>
      <button type="submit" disabled={pending} className={`${buttonClass("primary")} !bg-red-600 hover:!bg-red-700`} autoFocus>
        {pending ? "Deleting…" : confirmLabel}
      </button>
      <button type="button" disabled={pending} className={buttonClass("secondary")} onClick={() => setArmed(false)}>
        Cancel
      </button>
    </span>
  );
}
