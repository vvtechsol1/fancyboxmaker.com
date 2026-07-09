import { BadgeCheck, MessageCircle } from "lucide-react";
import type { ProductReview } from "@/data/productReviews";
import { whatsappChatLink } from "@/lib/site";
import Stars from "@/components/ui/Stars";

const AVATAR_COLORS = [
  "from-[#0b4aa2] to-[#3b82f6]", "from-[#9f1239] to-[#ef4444]", "from-[#14532d] to-[#22a35a]",
  "from-[#5b21b6] to-[#a78bfa]", "from-[#c2410c] to-[#fb923c]", "from-[#0e7490] to-[#22d3ee]",
  "from-[#be123c] to-[#fb7185]", "from-[#3f4756] to-[#8b93a3]",
];

function initials(name: string) {
  return name.split(" ").map((p) => p[0]).slice(0, 2).join("").toUpperCase();
}

export default function ProductReviews({
  reviews,
  count,
  average,
  distribution,
}: {
  reviews: ProductReview[];
  count: number;
  average: number;
  distribution: { star: number; count: number }[];
}) {
  return (
    <section id="reviews" className="mt-14 scroll-mt-24">
      <h2 className="mb-6 text-xl font-bold text-ink font-display">Customer Reviews</h2>

      <div className="grid gap-8 md:grid-cols-[260px_1fr]">
        {/* summary */}
        <div className="rounded-2xl border border-line bg-surface p-6 text-center md:text-left">
          <div className="flex items-baseline gap-2 md:block">
            <p className="text-5xl font-extrabold text-ink font-display">{average.toFixed(1)}</p>
            <div className="mt-1"><Stars rating={average} size={18} /></div>
          </div>
          <p className="mt-2 text-sm text-ink-soft">Based on {count} reviews</p>

          <div className="mt-4 space-y-1.5">
            {distribution.map((d) => (
              <div key={d.star} className="flex items-center gap-2 text-xs">
                <span className="w-6 text-ink-soft">{d.star}★</span>
                <div className="h-2 flex-1 overflow-hidden rounded-full bg-white">
                  <div className="h-full rounded-full bg-[var(--color-gold)]" style={{ width: `${count ? (d.count / count) * 100 : 0}%` }} />
                </div>
                <span className="w-5 text-right text-ink-soft">{d.count}</span>
              </div>
            ))}
          </div>

          <a
            href={whatsappChatLink("Assalam o Alaikum! Mujhe apna review share karna hai.")}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-full border border-line bg-white py-2.5 text-sm font-semibold text-ink transition hover:border-brand hover:text-brand"
          >
            <MessageCircle size={16} /> Share your review
          </a>
        </div>

        {/* list */}
        <div className="space-y-4">
          {reviews.map((r, i) => (
            <div key={i} className="rounded-2xl border border-line bg-white p-5">
              <div className="flex items-start gap-3">
                <span className={`grid h-10 w-10 shrink-0 place-items-center rounded-full bg-gradient-to-br ${AVATAR_COLORS[i % AVATAR_COLORS.length]} text-sm font-bold text-white`}>
                  {initials(r.name)}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5">
                    <span className="font-semibold text-ink">{r.name}</span>
                    {r.verified && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-green-50 px-2 py-0.5 text-[11px] font-semibold text-green-700">
                        <BadgeCheck size={12} /> Verified
                      </span>
                    )}
                    <span className="text-xs text-ink-soft">· {r.city}</span>
                  </div>
                  <div className="mt-1 flex items-center gap-2">
                    <Stars rating={r.rating} size={13} />
                    <span className="text-xs text-ink-soft">{r.date}</span>
                  </div>
                  <p className="mt-2 text-sm leading-relaxed text-ink">{r.text}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
