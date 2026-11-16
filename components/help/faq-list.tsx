"use client";

import { useMemo, useState } from "react";

import { faqCategories, type Faq } from "@/lib/content/faqs";

export function FaqList({ faqs }: { faqs: Faq[] }) {
  const [category, setCategory] = useState<(typeof faqCategories)[number] | "All">("All");
  const [query, setQuery] = useState("");
  const [openId, setOpenId] = useState<string | null>(null);

  const visible = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return faqs.filter((faq) => {
      const inCategory = category === "All" || faq.category === category;
      const inSearch =
        needle.length === 0 ||
        faq.question.toLowerCase().includes(needle) ||
        faq.answer_md.toLowerCase().includes(needle);
      return inCategory && inSearch;
    });
  }, [faqs, category, query]);

  return (
    <div>
      <label htmlFor="faq-search" className="text-small font-medium">
        Search questions
      </label>
      <input
        id="faq-search"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        className="mt-2 w-full min-h-11 rounded-2xl border border-border bg-bg px-4"
      />
      <div className="mt-6 flex gap-2 overflow-x-auto pb-2" role="tablist" aria-label="FAQ categories">
        {(["All", ...faqCategories] as const).map((item) => {
          const selected = category === item;
          return (
            <button
              key={item}
              type="button"
              role="tab"
              aria-selected={selected}
              onClick={() => setCategory(item)}
              className={
                selected
                  ? "inline-flex min-h-11 shrink-0 items-center rounded-full bg-text px-4 text-small text-bg"
                  : "inline-flex min-h-11 shrink-0 items-center rounded-full border border-border px-4 text-small text-silver"
              }
            >
              {item}
            </button>
          );
        })}
      </div>
      <div className="mt-8 divide-y divide-border border-y border-border">
        {visible.length === 0 ? (
          <p className="py-6 text-silver">No questions match that search.</p>
        ) : (
          visible.map((faq) => {
            const open = openId === faq.id;
            const panelId = `faq-panel-${faq.id}`;
            const buttonId = `faq-button-${faq.id}`;
            return (
              <div key={faq.id} className="py-2">
                <h3>
                  <button
                    id={buttonId}
                    type="button"
                    aria-expanded={open}
                    aria-controls={panelId}
                    onClick={() => setOpenId(open ? null : faq.id)}
                    className="flex min-h-11 w-full items-center justify-between gap-4 py-3 text-left font-medium"
                  >
                    {faq.question}
                    <span aria-hidden="true" className="text-silver">{open ? "–" : "+"}</span>
                  </button>
                </h3>
                {open ? (
                  <div id={panelId} role="region" aria-labelledby={buttonId} className="pb-4 text-silver whitespace-pre-wrap">
                    {faq.answer_md}
                  </div>
                ) : null}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
