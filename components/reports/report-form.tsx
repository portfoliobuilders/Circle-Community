"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { submitReport } from "@/lib/actions/marketplace";
import { reportSchema } from "@/lib/validation/account";
import type { z } from "zod";

type Values = z.infer<typeof reportSchema>;

export function ReportForm({
  targetType,
  targetId,
}: {
  targetType: "profile" | "collab";
  targetId: string;
}) {
  const [message, setMessage] = useState<string | null>(null);
  const form = useForm<Values>({
    resolver: zodResolver(reportSchema),
    defaultValues: { target_type: targetType, target_id: targetId, message: "" },
  });

  async function onSubmit(values: Values) {
    const result = await submitReport({ ...values, target_type: targetType, target_id: targetId });
    setMessage(result.message);
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="mt-8 grid max-w-xl gap-3" noValidate>
      <label htmlFor={`report-${targetId}`} className="text-small font-medium">Report this {targetType}</label>
      <textarea id={`report-${targetId}`} rows={4} className="min-h-11 rounded-2xl border border-border bg-bg px-4 py-3" {...form.register("message")} />
      {message ? <p className="text-small text-silver">{message}</p> : null}
      <button type="submit" className="inline-flex min-h-11 w-fit items-center rounded-full border border-border px-4 text-sm">
        Send report
      </button>
    </form>
  );
}
