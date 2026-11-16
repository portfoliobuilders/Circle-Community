"use client";

import { useState } from "react";

import { updateMessageStatus } from "@/lib/actions/support";

export function MessageStatusForm({
  id,
  status,
}: {
  id: string;
  status: "new" | "in_progress" | "closed";
}) {
  const [message, setMessage] = useState<string | null>(null);

  return (
    <form
      className="flex flex-wrap items-end gap-3"
      action={async (formData) => {
        const result = await updateMessageStatus(
          String(formData.get("id")),
          String(formData.get("status")),
        );
        setMessage(result.message);
      }}
    >
      <input type="hidden" name="id" value={id} />
      <label htmlFor={`status-${id}`} className="text-small">
        Status
        <select
          id={`status-${id}`}
          name="status"
          defaultValue={status}
          className="mt-2 block min-h-11 rounded-2xl border border-border bg-bg px-3"
        >
          <option value="new">New</option>
          <option value="in_progress">In progress</option>
          <option value="closed">Closed</option>
        </select>
      </label>
      <button
        type="submit"
        className="inline-flex min-h-11 items-center rounded-full border border-border px-4 text-sm"
      >
        Update status
      </button>
      {message ? <p className="text-small text-silver">{message}</p> : null}
    </form>
  );
}
