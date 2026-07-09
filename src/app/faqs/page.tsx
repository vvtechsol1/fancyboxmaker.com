"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { whatsappChatLink } from "@/lib/site";

const FAQS = [
  { q: "What is your minimum order quantity (MOQ)?", a: "We keep minimums low so you can start small — most custom boxes begin at just 50 units. Need a bigger run? Per-unit pricing drops as your quantity grows." },
  { q: "Can I order a custom size?", a: "Yes. Every box is made to your exact length, width and depth. Share your product dimensions and we'll build a die-line that fits it perfectly — no standard-size limits." },
  { q: "What materials and stocks do you offer?", a: "Choose from sturdy kraft, white SBS cardstock, corrugated for shipping, and premium rigid board for a luxury feel. Food-grade and eco-friendly recycled options are available too." },
  { q: "What finishes can I add?", a: "Full-color CMYK printing plus premium finishes: matte, gloss or soft-touch lamination, metallic foil stamping, embossing/debossing and spot UV. Mix and match to match your brand." },
  { q: "What artwork files do you need?", a: "Print-ready PDF, AI or EPS files at 300 DPI in CMYK work best. No design yet? Our team creates your artwork for free and lays it out on your die-line." },
  { q: "Do I get a mockup before printing?", a: "Always. We send a free 3D digital mockup so you can review your box from every angle and approve it before we print a single unit." },
  { q: "How long is production and turnaround?", a: "Standard turnaround is 6–8 business days after you approve your mockup, plus shipping. Rush options are available on many products — just ask." },
  { q: "How much is shipping?", a: "Shipping is free on orders over $250 within the USA. Any shipping cost is confirmed with your quote before you pay." },
  { q: "Can I reorder easily?", a: "Absolutely. Once your design is on file, reorders are one message away — same specs, same print, no setup to redo." },
  { q: "Can I get a sample before a full order?", a: "Yes. We can produce a physical pre-production sample so you can check the print, material and finish in person before committing to your full run." },
];

export default function FaqsPage() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <div className="container-x py-12">
      <header className="mb-8 text-center">
        <h1 className="text-3xl font-extrabold tracking-tight text-ink font-display md:text-4xl">Frequently Asked Questions</h1>
        <p className="mt-3 text-sm text-ink-soft">Everything you need to know about ordering custom printed boxes — sizes, materials, finishes and turnaround.</p>
      </header>

      <div className="mx-auto max-w-2xl divide-y divide-line rounded-2xl border border-line bg-white">
        {FAQS.map((f, i) => (
          <div key={i}>
            <button
              onClick={() => setOpen(open === i ? null : i)}
              className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
            >
              <span className="font-semibold text-ink">{f.q}</span>
              <ChevronDown size={18} className={`shrink-0 text-ink-soft transition-transform ${open === i ? "rotate-180 text-brand" : ""}`} />
            </button>
            {open === i && <p className="px-5 pb-5 text-sm leading-relaxed text-ink-soft">{f.a}</p>}
          </div>
        ))}
      </div>

      <div className="mx-auto mt-8 max-w-2xl rounded-2xl bg-surface p-6 text-center">
        <p className="text-sm text-ink-soft">Still have a question?</p>
        <a href={whatsappChatLink()} target="_blank" rel="noopener noreferrer"
          className="mt-3 inline-flex rounded-full bg-[var(--color-wa)] px-6 py-3 text-sm font-semibold text-white hover:bg-[var(--color-wa-dark)]">
          Ask us on WhatsApp
        </a>
      </div>
    </div>
  );
}
