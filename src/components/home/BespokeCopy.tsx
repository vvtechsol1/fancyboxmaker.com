import Link from "next/link";

export default function BespokeCopy() {
  return (
    <section className="bg-white py-14">
      <div className="container-x max-w-4xl text-left">
        <h2 className="font-display font-extrabold text-ink text-2xl md:text-3xl">
          Bespoke Boxes That Elevate Your Brand and Increase Sales
        </h2>

        <p className="mt-5 text-ink-soft leading-relaxed">
          In today&apos;s crowded market, customers don&apos;t simply buy
          products &mdash; they buy the{" "}
          <span className="text-green font-semibold">experience</span> that
          begins the very moment your packaging lands in their hands. Every
          fold, print and finish tells a story about who you are, and a
          thoughtfully designed box turns an ordinary delivery into a memorable
          moment worth sharing.
        </p>

        <p className="mt-4 text-ink-soft leading-relaxed">
          Whether you sell hot pizza on a Friday night or a piece of luxury
          jewelry, custom boxes do two jobs at once: they{" "}
          <span className="text-brand font-semibold">protect</span> your product
          in transit and they{" "}
          <span className="text-green font-semibold">promote</span> your brand on
          every doorstep. That combination of durability and design is what
          builds{" "}
          <span className="text-brand font-semibold">loyalty</span>, drives
          repeat orders and helps your business stand out from the competition.
        </p>

        <h3 className="font-display font-extrabold text-ink text-xl md:text-2xl mt-8">
          Why Custom Packaging Is Essential for Your Business
        </h3>

        <p className="mt-4 text-ink-soft leading-relaxed">
          Packaging is often the first physical touchpoint a customer has with
          your company, and first impressions are hard to undo. Custom boxes let
          you control that moment completely &mdash; shaping how people perceive
          your quality, your values and your attention to detail before they
          ever open the lid. In short, your packaging directly influences:
        </p>

        <ul className="list-disc pl-5 mt-4 text-ink-soft space-y-1.5">
          <li>Your brand identity</li>
          <li>Your brand&apos;s visual appeal</li>
          <li>Your customer&apos;s first impression</li>
        </ul>

        <div className="mt-8">
          <Link
            href="/about"
            className="inline-flex bg-brand text-white rounded-full px-6 py-2.5 text-sm font-semibold uppercase tracking-wide"
          >
            Read More
          </Link>
        </div>
      </div>
    </section>
  );
}
