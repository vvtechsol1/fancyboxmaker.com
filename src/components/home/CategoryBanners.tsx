import Link from "next/link";
import { ArrowRight } from "lucide-react";
import Reveal from "@/components/ui/Reveal";

const BANNERS = [
  {
    title: "Rigid Luxury Boxes",
    desc: "Premium setup boxes for a high-end unboxing",
    href: "/category/rigid-boxes",
    gradient: "from-ink to-ink-soft",
    badge: "Luxury",
    cta: "Shop now",
  },
  {
    title: "Food Packaging",
    desc: "Food-safe boxes & bags for every menu",
    href: "/collection/food-packaging",
    gradient: "from-brand-glow to-brand",
    badge: "Food-Safe",
    cta: "Explore",
  },
  {
    title: "Free 3D Mockup",
    desc: "See your box before you print — free design too",
    href: "/quote",
    gradient: "from-brand-dark to-brand",
    badge: "Free",
    cta: "Get a quote",
  },
];

export default function CategoryBanners() {
  return (
    <section className="container-x py-6 md:py-8">
      <div className="grid gap-4 md:grid-cols-3">
        {BANNERS.map((b, i) => (
          <Reveal key={b.title} delay={i * 0.08}>
            <Link
              href={b.href}
              className={`group relative flex h-52 flex-col justify-between overflow-hidden rounded-2xl bg-gradient-to-br ${b.gradient} p-6 text-white`}
            >
              <div className="absolute -right-8 -top-8 h-40 w-40 rounded-full bg-white/10 blur-2xl transition-transform group-hover:scale-125" />
              <span className="w-fit rounded-full bg-white/15 px-3 py-1 text-xs font-semibold backdrop-blur">{b.badge}</span>
              <div>
                <h3 className="text-2xl font-extrabold font-display">{b.title}</h3>
                <p className="mt-1 text-sm text-white/75">{b.desc}</p>
                <span className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold">
                  {b.cta} <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
                </span>
              </div>
            </Link>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
