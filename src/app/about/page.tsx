import type { Metadata } from "next";
import Link from "next/link";
import { ShieldCheck, Truck, Heart, Sparkles } from "lucide-react";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "About Us",
  description: `About ${SITE.name} — custom printed boxes & packaging for brands across the USA. Our story, values and promise.`,
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return (
    <div>
      <section className="gradient-mesh border-b border-line">
        <div className="container-x py-16 text-center">
          <h1 className="text-4xl font-extrabold tracking-tight text-ink font-display md:text-5xl">
            We help your brand <span className="text-brand">make a first impression</span>.
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-base text-ink-soft">
            FancyBoxMaker started with a simple idea — your packaging should sell as hard as the product inside it. We design, print and deliver custom boxes for brands across the USA, backed by free 3D mockups, honest pricing and premium finishes you can actually feel.
          </p>
        </div>
      </section>

      <section className="container-x grid gap-4 py-14 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { Icon: Sparkles, t: "Free design & 3D mockups", s: "Our designers build your artwork and send a free 3D mockup before anything prints." },
          { Icon: ShieldCheck, t: "Print you can trust", s: "Full-color CMYK on sturdy, premium stock — crisp, consistent and on-brand." },
          { Icon: Truck, t: "Fast & free shipping", s: "A 6–8 business-day turnaround with free shipping across the USA." },
          { Icon: Heart, t: "Built for your brand", s: "Low minimums from just 50 units, with support that treats small runs like they matter." },
        ].map(({ Icon, t, s }) => (
          <div key={t} className="rounded-2xl border border-line bg-white p-6">
            <span className="grid h-11 w-11 place-items-center rounded-full bg-brand-soft text-brand"><Icon size={20} /></span>
            <h3 className="mt-4 font-bold text-ink">{t}</h3>
            <p className="mt-1 text-sm text-ink-soft">{s}</p>
          </div>
        ))}
      </section>

      <section className="container-x pb-16">
        <div className="grid grid-cols-3 gap-4 rounded-2xl border border-line bg-surface p-8 text-center">
          {[
            { n: "2,000+", l: "Brands packaged" },
            { n: "40+", l: "Box styles & shapes" },
            { n: "4.9/5", l: "Average rating" },
          ].map((s) => (
            <div key={s.l}>
              <p className="text-3xl font-extrabold text-brand font-display md:text-4xl">{s.n}</p>
              <p className="mt-1 text-xs text-ink-soft md:text-sm">{s.l}</p>
            </div>
          ))}
        </div>
        <div className="mt-10 text-center">
          <Link href="/quote" className="inline-flex rounded-full bg-brand px-7 py-3.5 text-sm font-semibold text-white shadow-[var(--shadow-brand)] hover:bg-brand-dark">
            Get a Free Quote
          </Link>
        </div>
      </section>
    </div>
  );
}
