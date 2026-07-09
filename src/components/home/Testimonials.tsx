import { Star } from "lucide-react";

const testimonials = [
  {
    quote:
      "Reliable and professional from start to finish. The communication was excellent and they delivered exactly what we needed, right on schedule.",
    name: "Brett Cohen",
  },
  {
    quote:
      "We were up against a tight deadline and they still designed and delivered our custom boxes in under two weeks. The quality was excellent and exceeded expectations.",
    name: "Arvin Ross",
  },
  {
    quote:
      "They created elegant wedding-favor boxes and walked us through several options along the way. The price was fair and the final result looked absolutely beautiful.",
    name: "Frank Riek",
  },
];

export default function Testimonials() {
  return (
    <section className="bg-cream py-14">
      <div className="container-x">
        <h2 className="font-display font-extrabold text-ink text-3xl md:text-4xl text-center">
          What Our Customers Are Saying
        </h2>

        <div className="mt-8 grid md:grid-cols-3 gap-6">
          {testimonials.map(({ quote, name }) => (
            <figure key={name} className="bg-white rounded-2xl p-6">
              <blockquote className="italic text-ink-soft leading-relaxed">
                &ldquo;{quote}&rdquo;
              </blockquote>
              <div className="mt-4 flex items-center gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} size={16} className="fill-current text-gold" />
                ))}
              </div>
              <figcaption className="mt-3 text-ink font-bold">{name}</figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
