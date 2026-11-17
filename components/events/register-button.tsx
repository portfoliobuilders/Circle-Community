"use client";

import { useState } from "react";

import { registerForEvent } from "@/lib/actions/marketplace";

export function RegisterButton({ eventId }: { eventId: string }) {
  const [message, setMessage] = useState<string | null>(null);

  return (
    <div>
      <button
        type="button"
        onClick={async () => {
          const result = await registerForEvent(eventId);
          setMessage(result.message);
        }}
        className="inline-flex min-h-11 items-center rounded-full border border-border px-4 text-sm"
      >
        Register free
      </button>
      {message ? <p className="mt-2 text-small text-silver">{message}</p> : null}
    </div>
  );
}
