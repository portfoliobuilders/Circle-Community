"use client";

import { useState } from "react";

import { setApplicationStatus } from "@/lib/actions/marketplace";

export function ApplicationActions({
  applicationId,
  collabId,
}: {
  applicationId: string;
  collabId: string;
}) {
  const [message, setMessage] = useState<string | null>(null);

  async function choose(status: "accepted" | "declined") {
    const result = await setApplicationStatus({ application_id: applicationId, collab_id: collabId, status });
    setMessage(result.message);
  }

  return (
    <div className="mt-3 flex flex-wrap gap-2">
      <button type="button" onClick={() => choose("accepted")} className="inline-flex min-h-11 items-center rounded-full bg-lime px-4 text-sm font-medium text-bg">Accept</button>
      <button type="button" onClick={() => choose("declined")} className="inline-flex min-h-11 items-center rounded-full border border-border px-4 text-sm">Decline</button>
      {message ? <p className="w-full text-small text-silver">{message}</p> : null}
    </div>
  );
}
