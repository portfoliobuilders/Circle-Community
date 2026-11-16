"use client";

import { useState } from "react";

import { setOwnNewsletter } from "@/lib/actions/support";

export function NewsletterToggle({ confirmed }: { confirmed: boolean }) {
  const [on, setOn] = useState(confirmed);
  const [message, setMessage] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function change(next: boolean) {
    setPending(true);
    const result = await setOwnNewsletter(next);
    setPending(false);
    if (result.status === "error") {
      setMessage(result.message);
      return;
    }
    setOn(next && result.message === "confirmed");
    setMessage(
      result.message === "pending"
        ? "Check your email to confirm. News is not sent until you do."
        : result.message === "unsubscribed"
          ? "Newsletter turned off."
          : "Already confirmed.",
    );
  }

  return (
    <div>
      <p className="font-medium">Newsletter</p>
      <p className="mt-2 max-w-xl text-small text-silver">
        Turning this on sends a confirmation email. Nothing is mailed until you confirm.
      </p>
      <button
        type="button"
        disabled={pending}
        aria-pressed={on}
        onClick={() => change(!on)}
        className="mt-4 inline-flex min-h-11 items-center rounded-full border border-border px-5 text-sm"
      >
        {on ? "Turn newsletter off" : "Turn newsletter on"}
      </button>
      {message ? <p className="mt-3 text-small text-silver">{message}</p> : null}
    </div>
  );
}
