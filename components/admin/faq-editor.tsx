"use client";

import { useState } from "react";

import { saveFaq } from "@/lib/actions/support";
import { faqCategories, type Faq } from "@/lib/content/faqs";

const inputClass =
  "mt-2 w-full min-h-11 rounded-2xl border border-border bg-bg px-4";

export function FaqEditor({ faqs }: { faqs: Faq[] }) {
  const [message, setMessage] = useState<string | null>(null);

  async function onSubmit(formData: FormData) {
    const id = String(formData.get("id") ?? "");
    const result = await saveFaq({
      id: id || undefined,
      category: formData.get("category"),
      question: formData.get("question"),
      answer_md: formData.get("answer_md"),
      sort: formData.get("sort"),
      published: formData.get("published") === "on",
    });
    setMessage(result.message);
  }

  return (
    <div className="grid gap-10">
      <form action={onSubmit} className="grid max-w-xl gap-4">
        <h2 className="font-display text-title-sm font-medium">New question</h2>
        <label className="text-small" htmlFor="faq-category">
          Category
          <select id="faq-category" name="category" className={inputClass}>
            {faqCategories.map((category) => (
              <option key={category}>{category}</option>
            ))}
          </select>
        </label>
        <label className="text-small" htmlFor="faq-question">
          Question
          <input id="faq-question" name="question" className={inputClass} required />
        </label>
        <label className="text-small" htmlFor="faq-answer">
          Answer
          <textarea id="faq-answer" name="answer_md" rows={5} className={`${inputClass} py-3`} required />
        </label>
        <label className="text-small" htmlFor="faq-sort">
          Sort
          <input id="faq-sort" name="sort" type="number" defaultValue={100} className={inputClass} />
        </label>
        <label className="flex min-h-11 items-center gap-3 text-small">
          <input type="checkbox" name="published" />
          Published
        </label>
        <button type="submit" className="inline-flex min-h-11 w-fit items-center rounded-full bg-lime px-5 text-sm font-medium text-bg">
          Save FAQ
        </button>
        {message ? <p className="text-small text-silver">{message}</p> : null}
      </form>
      <ul className="divide-y divide-border border-y border-border">
        {faqs.map((faq) => (
          <li key={faq.id} className="py-4">
            <p className="text-small text-silver">
              {faq.category} · {faq.published ? "Published" : "Draft"} · {faq.sort}
            </p>
            <p className="mt-1 font-medium">{faq.question}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
