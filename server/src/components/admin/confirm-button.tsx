"use client";

import { buttonClass } from "./ui";

// Submit button that asks before running a destructive form action.
export function ConfirmButton({ message, children, variant = "danger" }: { message: string; children: React.ReactNode; variant?: "danger" | "secondary" }) {
  return (
    <button
      type="submit"
      className={buttonClass(variant)}
      onClick={(e) => {
        if (!window.confirm(message)) e.preventDefault();
      }}>
      {children}
    </button>
  );
}
