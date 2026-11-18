"use client";

import * as React from "react";
import { Dialog } from "@base-ui/react/dialog";
import { CheckCircle2, X } from "lucide-react";
import { PillLink } from "@/components/site/pill-link";

interface JoinDialogProps {
  campaignTitle: string;
}

export function JoinDialog({ campaignTitle }: JoinDialogProps) {
  const [open, setOpen] = React.useState(false);

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger
        render={
          <button
            type="button"
            className="inline-flex min-h-12 w-full sm:w-auto items-center justify-center rounded-full bg-lime px-8 text-base font-semibold text-bg transition-colors hover:bg-lime/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          >
            Join campaign
          </button>
        }
      />
      <Dialog.Portal>
        <Dialog.Backdrop className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm transition-opacity duration-150 data-ending-style:opacity-0 data-starting-style:opacity-0" />
        <Dialog.Popup className="fixed left-1/2 top-1/2 z-50 w-full max-w-lg -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-border bg-card p-6 md:p-8 shadow-2xl transition duration-200 ease-out data-ending-style:scale-95 data-ending-style:opacity-0 data-starting-style:scale-95 data-starting-style:opacity-0">
          <div className="flex items-start justify-between gap-4">
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-lime">
                Campaign Registration
              </span>
              <Dialog.Title className="font-display mt-1 text-2xl font-bold tracking-tight text-white">
                Joining Opens Soon
              </Dialog.Title>
            </div>
            <Dialog.Close
              render={
                <button
                  type="button"
                  aria-label="Close dialog"
                  className="rounded-full p-2 text-silver hover:bg-surface hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-white"
                >
                  <X className="size-5" />
                </button>
              }
            />
          </div>

          <Dialog.Description className="mt-3 text-sm text-silver leading-relaxed">
            Direct campaign joining and submission queues will unlock in the upcoming release. Prepare your CIRCLE creator account by ensuring all prerequisites are met:
          </Dialog.Description>

          {/* Eligibility Checklist */}
          <div className="mt-6 space-y-3 rounded-xl border border-border bg-surface p-4 text-sm">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-white">
              Clipper Eligibility Checklist
            </h4>
            <ul className="space-y-3 pt-2">
              <li className="flex items-start gap-3 text-silver">
                <CheckCircle2 className="size-4 shrink-0 text-lime mt-0.5" aria-hidden="true" />
                <div>
                  <strong className="font-medium text-white">Age 18 or above:</strong> Verified date of birth on your member profile compliant with the DPDP Act.
                </div>
              </li>
              <li className="flex items-start gap-3 text-silver">
                <CheckCircle2 className="size-4 shrink-0 text-lime mt-0.5" aria-hidden="true" />
                <div>
                  <strong className="font-medium text-white">Active CIRCLE Account:</strong> In good standing with zero unaddressed fraud flags.
                </div>
              </li>
              <li className="flex items-start gap-3 text-silver">
                <CheckCircle2 className="size-4 shrink-0 text-lime mt-0.5" aria-hidden="true" />
                <div>
                  <strong className="font-medium text-white">Verified Channel / Handle:</strong> Bio-code verified YouTube Shorts channel or Instagram Reels profile.
                </div>
              </li>
            </ul>
          </div>

          <div className="mt-6 flex flex-col sm:flex-row items-center gap-3">
            <PillLink href="/dashboard/clipping" className="w-full sm:w-auto">
              Open Clipper Studio
            </PillLink>
            <PillLink href="/dashboard" variant="secondary" className="w-full sm:w-auto">
              Check Profile
            </PillLink>
          </div>

          <p className="mt-4 text-[11px] text-silver/70">
            For campaign: <span className="text-silver font-medium">{campaignTitle}</span>
          </p>
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
