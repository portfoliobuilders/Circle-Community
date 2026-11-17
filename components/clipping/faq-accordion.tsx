"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "cn";

interface FaqItem {
  question: string;
  answer: string;
}

const clippingFaqs: FaqItem[] = [
  {
    question: "Who is eligible to join clipping campaigns?",
    answer:
      "To join a campaign and submit clips, you must be at least 18 years old (confirmed via the date of birth on your CIRCLE profile to comply with India's DPDP Act), possess an active CIRCLE member account, and have verified ownership of the YouTube or Instagram account where clips will be published via our bio-code verification system.",
  },
  {
    question: "When and how are video views counted?",
    answer:
      "Views are verified exactly once, on day 7 (VIEW_HOLD_DAYS) following your submission to CIRCLE. For YouTube Shorts, views are automatically queried via the YouTube Data API. For Instagram Reels, verification is conducted against the public post and native Insights. Views occurring after day 7 do not generate additional earnings.",
  },
  {
    question: "What fees does CIRCLE charge for clipping?",
    answer:
      "Joining campaigns and submitting clips is 100% free with zero registration or withdrawal fees. CIRCLE charges a transparent dual-sided 10% fee: campaign owners pay a 10% service fee on top of their campaign budget, and CIRCLE deducts a 10% platform fee from each clip's locked gross earnings to cover automated view verification, fraud prevention, and UPI payout processing.",
  },
  {
    question: "How and when do clippers get paid?",
    answer:
      "Once views lock on day 7, net earnings immediately accrue to your CIRCLE wallet. Clippers can request a payout at any time as long as their net wallet balance meets the ₹500 minimum threshold (MIN_PAYOUT_INR). Payouts are batch-processed weekly directly to your Indian bank account via UPI.",
  },
  {
    question: "What are the rules regarding copyright, source footage, and disclosures?",
    answer:
      "Campaign owners legally certify that they own or license all source material provided for clipping. Clippers may only edit and monetize content from approved source links for the duration of the campaign. Under ASCI influencer marketing guidelines, every clip must include the designated #ad or #collab hashtag in its primary caption.",
  },
];

export function FaqAccordion() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  function toggle(index: number) {
    setOpenIndex(openIndex === index ? null : index);
  }

  return (
    <div className="flex flex-col divide-y divide-border border-y border-border">
      {clippingFaqs.map((faq, index) => {
        const isOpen = openIndex === index;
        const buttonId = `faq-btn-${index}`;
        const panelId = `faq-panel-${index}`;

        return (
          <div key={index} className="py-4 md:py-5">
            <button
              id={buttonId}
              type="button"
              aria-expanded={isOpen}
              aria-controls={panelId}
              onClick={() => toggle(index)}
              className="flex min-h-11 w-full items-center justify-between gap-4 text-left font-display text-base md:text-lg font-medium text-white transition-colors hover:text-lime focus-visible:outline focus-visible:outline-2 focus-visible:outline-lime"
            >
              <span>{faq.question}</span>
              <ChevronDown
                className={cn(
                  "size-5 shrink-0 text-silver transition-transform duration-200 motion-reduce:transition-none",
                  isOpen && "rotate-180 text-lime"
                )}
                aria-hidden="true"
              />
            </button>
            {isOpen && (
              <div
                id={panelId}
                role="region"
                aria-labelledby={buttonId}
                className="mt-3 text-sm text-silver leading-relaxed pr-6"
              >
                <p>{faq.answer}</p>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
