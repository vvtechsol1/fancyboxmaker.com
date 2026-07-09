import { Quote } from "lucide-react";
import { formatNumber } from "@/lib/site";
import Stars from "@/components/ui/Stars";
import SectionHeader from "@/components/ui/SectionHeader";
import Reveal from "@/components/ui/Reveal";

const reviewStats = { count: 4200, average: 4.9 };

const reviews = [
  {
    name: "Jordan Miles",
    city: "Austin, TX",
    rating: 5,
    text: "The print quality blew me away — colors are crisp and the soft-touch finish feels so premium. Our unboxing videos have never looked better.",
    product: "Custom Mailer Boxes",
    date: "2 weeks ago",
  },
  {
    name: "Priya Nair",
    city: "San Jose, CA",
    rating: 5,
    text: "The free 3D mockup made it easy to approve everything before printing. The boxes arrived exactly like the proof, and the foil logo is stunning.",
    product: "Rigid Gift Boxes",
    date: "3 weeks ago",
  },
  {
    name: "Marcus Bennett",
    city: "Chicago, IL",
    rating: 5,
    text: "Ordered just 100 units to test our launch and the low minimum was a lifesaver. Turnaround was quick and the kraft finish is right on brand.",
    product: "Kraft Soap Boxes",
    date: "1 month ago",
  },
  {
    name: "Sofia Alvarez",
    city: "Miami, FL",
    rating: 5,
    text: "Their design team fixed my artwork for free and it printed perfectly. Customers keep commenting on how professional the packaging looks.",
    product: "Cosmetic Boxes",
    date: "1 month ago",
  },
  {
    name: "Ethan Cole",
    city: "Denver, CO",
    rating: 5,
    text: "Sturdy corrugated boxes that survived shipping without a dent. Reordering was one message — same specs, no setup to redo.",
    product: "Corrugated Shipping Boxes",
    date: "5 days ago",
  },
  {
    name: "Hannah Brooks",
    city: "Seattle, WA",
    rating: 5,
    text: "Spot UV and embossing on matte stock — absolutely gorgeous. Delivered inside the 8-day window they promised. Highly recommend.",
    product: "Rigid Candle Boxes",
    date: "2 weeks ago",
  },
];

export default function Reviews() {
  return (
    <section className="container-x py-6 md:py-8">
      <SectionHeader
        title="Let our customers speak"
        subtitle={`${reviewStats.average} / 5 average rating from ${formatNumber(reviewStats.count)}+ brands who trust us with their packaging.`}
        center
      />
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {reviews.map((r, i) => (
          <Reveal key={r.name} delay={(i % 3) * 0.06}>
            <figure className="flex h-full flex-col rounded-2xl border border-line bg-white p-6">
              <Quote size={26} className="text-brand/30" />
              <blockquote className="mt-3 flex-1 text-sm leading-relaxed text-ink">{r.text}</blockquote>
              <div className="mt-4">
                <Stars rating={r.rating} size={14} />
                <figcaption className="mt-2 text-sm">
                  <span className="font-bold text-ink">{r.name}</span>
                  <span className="text-ink-soft"> · {r.city}</span>
                  <span className="block text-xs text-ink-soft">{r.product} · {r.date}</span>
                </figcaption>
              </div>
            </figure>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
