const faqs = [
  {
    q: "Do you offer different types of custom boxes and packaging?",
    a: "Absolutely. From mailer and shipping boxes to rigid gift boxes, product boxes, kraft cartons and retail displays, we produce virtually any style in the size, material and finish your brand needs.",
  },
  {
    q: "I don't have a design or artwork. Can you create it for me?",
    a: "Yes. Our in-house design team will craft a custom layout for your packaging at no extra cost, and you'll receive a free 2D and 3D mockup to review and approve before we ever go to print.",
  },
  {
    q: "Is there any minimum order quantity requirement?",
    a: "We keep minimums low so businesses of every size can order. Whether you need a small test batch or a large wholesale run, we'll happily accommodate your quantity and budget.",
  },
  {
    q: "What are the delivery timelines of my order?",
    a: "Standard production and delivery take roughly 6–8 business days after your design is approved. Rush options are available if you're working against a tighter deadline.",
  },
  {
    q: "Do you offer free shipping?",
    a: "Yes. We provide free nationwide shipping on all orders across the USA, so the price you're quoted is the price you pay — with no surprise freight charges.",
  },
  {
    q: "How am I supposed to track my order?",
    a: "Once your order ships you'll receive a tracking number by email, and our support team is available 24/7 to give you a real-time update on exactly where your boxes are.",
  },
  {
    q: "What happens if the boxes I receive are damaged?",
    a: "In the rare event your packaging arrives damaged or defective, contact us right away with a few photos and we'll arrange a prompt replacement or reprint at no additional cost to you.",
  },
];

export default function FaqSection() {
  return (
    <section className="bg-cream-2 py-14">
      <div className="container-x max-w-3xl">
        <h2 className="font-display font-extrabold text-ink text-3xl md:text-4xl text-center">
          FAQs
        </h2>

        <div className="mt-8">
          {faqs.map(({ q, a }) => (
            <details
              key={q}
              className="faq-item bg-white rounded-xl border border-line mb-3"
            >
              <summary className="flex items-center justify-between cursor-pointer list-none [&::-webkit-details-marker]:hidden px-5 py-4 font-semibold text-ink">
                <span>{q}</span>
                <span className="faq-plus text-green text-2xl leading-none transition-transform">
                  +
                </span>
              </summary>
              <div className="px-5 pb-4 text-ink-soft text-sm">{a}</div>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
