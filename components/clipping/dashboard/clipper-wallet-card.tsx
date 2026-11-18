"use client";

import { useState, useTransition } from "react";
import { formatInr } from "@/lib/format";
import { CLIPPING_CONFIG } from "@/lib/config/clipping";
import { requestPayout } from "@/lib/actions/clipping";
import type { WalletSummary } from "@/lib/clipping/types";

export function ClipperWalletCard({ wallet }: { wallet: WalletSummary }) {
  const [isOpen, setIsOpen] = useState(false);
  const [upiId, setUpiId] = useState("");
  const [amount, setAmount] = useState<number>(wallet.netBalanceInr || 500);
  const [statusMsg, setStatusMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [isPending, startTransition] = useTransition();

  const canWithdraw = wallet.netBalanceInr >= CLIPPING_CONFIG.minPayoutInr && wallet.pendingPayoutInr === 0;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatusMsg(null);
    startTransition(async () => {
      const res = await requestPayout({
        amount_inr: amount,
        upi_id: upiId,
      });
      if (res.status === "success") {
        setStatusMsg({ type: "success", text: res.message });
        setUpiId("");
        setTimeout(() => setIsOpen(false), 2500);
      } else {
        setStatusMsg({ type: "error", text: res.message });
      }
    });
  }

  return (
    <div className="rounded-2xl border border-border bg-surface p-6 sm:p-8">
      <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-small uppercase tracking-wider text-silver">Net Available Wallet Balance</p>
          <p className="font-display mt-2 text-display-sm font-semibold tracking-tight text-lime sm:text-display">
            {formatInr(wallet.netBalanceInr)}
          </p>
          <p className="mt-1 text-small text-silver">
            Net after CIRCLE&apos;s 10% platform fee · Zero payout withdrawal fees
          </p>
        </div>

        <div>
          <button
            type="button"
            onClick={() => setIsOpen(true)}
            disabled={!canWithdraw}
            className="inline-flex min-h-11 items-center justify-center rounded-full bg-lime px-6 text-sm font-medium text-bg transition hover:bg-lime/90 disabled:cursor-not-allowed disabled:opacity-40"
          >
            {wallet.pendingPayoutInr > 0 ? "Payout in progress" : "Withdraw to UPI"}
          </button>
          {!canWithdraw && wallet.pendingPayoutInr === 0 && (
            <p className="mt-2 text-right text-xs text-silver">
              Minimum withdrawal: {formatInr(CLIPPING_CONFIG.minPayoutInr)}
            </p>
          )}
        </div>
      </div>

      <div className="mt-8 grid grid-cols-2 gap-4 border-t border-border pt-6 sm:grid-cols-4">
        <div>
          <p className="text-xs uppercase tracking-wider text-silver">Gross Views Earned</p>
          <p className="font-display mt-1 text-lead font-medium text-text">
            {formatInr(wallet.totalGrossEarnedInr)}
          </p>
        </div>
        <div>
          <p className="text-xs uppercase tracking-wider text-silver">Platform Fees (10%)</p>
          <p className="font-display mt-1 text-lead font-medium text-silver">
            {formatInr(wallet.totalFeesPaidInr)}
          </p>
        </div>
        <div>
          <p className="text-xs uppercase tracking-wider text-silver">Total Paid Out</p>
          <p className="font-display mt-1 text-lead font-medium text-text">
            {formatInr(wallet.totalNetPaidOutInr)}
          </p>
        </div>
        <div>
          <p className="text-xs uppercase tracking-wider text-silver">Pending Transfers</p>
          <p className="font-display mt-1 text-lead font-medium text-lime">
            {formatInr(wallet.pendingPayoutInr)}
          </p>
        </div>
      </div>

      {/* Payout Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
          <div className="w-full max-w-md rounded-2xl border border-border bg-surface p-6 shadow-2xl">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-lead font-medium uppercase tracking-tight text-text">
                Withdraw to UPI
              </h2>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="text-silver hover:text-text"
                aria-label="Close modal"
              >
                ✕
              </button>
            </div>

            <p className="mt-2 text-small text-silver">
              Withdraw your earned clip rewards. Payouts are batch-processed weekly via UPI banking with zero transfer fees.
            </p>

            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <div>
                <label htmlFor="payout-amount" className="block text-xs uppercase tracking-wider text-silver">
                  Amount in INR (Min {formatInr(CLIPPING_CONFIG.minPayoutInr)})
                </label>
                <input
                  id="payout-amount"
                  type="number"
                  min={CLIPPING_CONFIG.minPayoutInr}
                  max={wallet.netBalanceInr}
                  value={amount}
                  onChange={(e) => setAmount(Number(e.target.value))}
                  required
                  className="mt-1 w-full rounded-xl border border-border bg-bg px-4 py-3 text-text focus:border-lime focus:outline-none"
                />
              </div>

              <div>
                <label htmlFor="payout-upi" className="block text-xs uppercase tracking-wider text-silver">
                  Your UPI ID (VPA)
                </label>
                <input
                  id="payout-upi"
                  type="text"
                  placeholder="name@okhdfcbank or phone@upi"
                  value={upiId}
                  onChange={(e) => setUpiId(e.target.value)}
                  required
                  pattern="^[\w.-]+@[\w.-]+$"
                  className="mt-1 w-full rounded-xl border border-border bg-bg px-4 py-3 text-text focus:border-lime focus:outline-none"
                />
                <p className="mt-1 text-xs text-silver">
                  Double-check your UPI ID. Bank transfers to incorrect VPAs cannot be reversed.
                </p>
              </div>

              {statusMsg && (
                <div
                  className={`rounded-xl p-3 text-small ${
                    statusMsg.type === "success"
                      ? "border border-lime/30 bg-lime/10 text-lime"
                      : "border border-red-500/30 bg-red-500/10 text-red-400"
                  }`}
                >
                  {statusMsg.text}
                </div>
              )}

              <div className="mt-6 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="min-h-11 rounded-full border border-border px-5 text-sm text-silver transition hover:text-text"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isPending}
                  className="inline-flex min-h-11 items-center rounded-full bg-lime px-6 text-sm font-medium text-bg transition hover:bg-lime/90 disabled:opacity-50"
                >
                  {isPending ? "Submitting..." : "Confirm Withdrawal"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
