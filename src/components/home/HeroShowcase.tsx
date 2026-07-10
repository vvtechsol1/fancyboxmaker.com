"use client";

import { useRef } from "react";
import Link from "next/link";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { COLORWAYS } from "@/data/products";
import type { SiteSettings } from "@/lib/settings";
import BoxMockup from "@/components/product/BoxMockup";

gsap.registerPlugin(useGSAP);

/** Colorful product tiles scattered around the edges (floating). */
const TILES = [
  { from: "#f97316", to: "#fb923c", box: COLORWAYS.navy, pos: "left-0 top-6", size: "w-36 xl:w-44", rot: "-7deg" },
  { from: "#0ea5e9", to: "#38bdf8", box: COLORWAYS.white, pos: "left-2 top-1/2 -translate-y-1/2", size: "w-44 xl:w-52", rot: "5deg" },
  { from: "#22c55e", to: "#4ade80", box: COLORWAYS.kraft, pos: "left-8 bottom-4", size: "w-36 xl:w-44", rot: "-4deg" },
  { from: "#14b8a6", to: "#2dd4bf", box: COLORWAYS.gold, pos: "right-0 top-6", size: "w-36 xl:w-44", rot: "6deg" },
  { from: "#ec4899", to: "#f472b6", box: COLORWAYS.white, pos: "right-2 top-1/2 -translate-y-1/2", size: "w-44 xl:w-52", rot: "-6deg" },
  { from: "#f59e0b", to: "#fbbf24", box: COLORWAYS.black, pos: "right-8 bottom-4", size: "w-36 xl:w-44", rot: "4deg" },
];

/** Bright category pills — different colour each. */
const PILLS = [
  { label: "Food Packaging", href: "/collection/food-packaging", bg: "#38bdf8", fg: "#082f49" },
  { label: "CBD Boxes", href: "/category/cbd-boxes", bg: "#f472b6", fg: "#500724" },
  { label: "Cosmetic Boxes", href: "/category/cosmetic-boxes", bg: "#4ade80", fg: "#052e16" },
  { label: "Mailer Boxes", href: "/category/mailer-boxes", bg: "#fbbf24", fg: "#451a03" },
  { label: "Chocolate Boxes", href: "/category/chocolate-boxes", bg: "#fb923c", fg: "#431407" },
  { label: "Rigid Boxes", href: "/category/rigid-boxes", bg: "#c084fc", fg: "#3b0764" },
  { label: "Kraft Boxes", href: "/category/kraft-boxes", bg: "#2dd4bf", fg: "#042f2e" },
  { label: "Gift Boxes", href: "/category/gift-boxes", bg: "#f87171", fg: "#450a0a" },
];

export default function HeroShowcase({ settings }: { settings: SiteSettings }) {
  const root = useRef<HTMLElement>(null);
  const typeRef = useRef<HTMLSpanElement>(null);
  const WORDS = settings.heroWords.length ? settings.heroWords : ["Custom Boxes"];

  useGSAP(
    () => {
      // ── entrance timeline (runs once) ───────────────────────────────
      const tl = gsap.timeline({
        defaults: { ease: "power3.out" },
        onComplete: () =>
          gsap.set(
            [".hero-eyebrow", ".hero-h1", ".hero-sub", ".hero-cta", ".hero-pill"],
            { clearProps: "opacity,transform" }
          ),
      });
      tl.from(".hero-tile-inner", { scale: 0.5, opacity: 0, duration: 0.7, stagger: 0.09, ease: "back.out(1.6)" })
        .from(".hero-eyebrow", { y: 24, opacity: 0, duration: 0.6 }, 0.15)
        .from(".hero-h1", { y: 40, opacity: 0, duration: 0.8 }, "-=0.35")
        .from(".hero-sub", { y: 20, opacity: 0, duration: 0.6 }, "-=0.45")
        .from(".hero-cta", { y: 18, opacity: 0, scale: 0.92, duration: 0.5, stagger: 0.12 }, "-=0.3")
        .from(".hero-pill", { y: 16, opacity: 0, scale: 0.85, duration: 0.45, stagger: 0.06 }, "-=0.25");

      // ── continuous float on the 6 tiles ─────────────────────────────
      gsap.to(".hero-tile-inner", {
        y: "-=16",
        duration: 3,
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true,
        delay: 1,
        stagger: { each: 0.5, from: "random" },
      });

      // ── typewriter: type → pause → select(highlight) → delete → next ─
      const el = typeRef.current;
      if (el) {
        const tw = gsap.timeline({ repeat: -1, delay: 1.4 });
        WORDS.forEach((word) => {
          const o = { n: 0 };
          tw.to(o, {
            n: word.length,
            duration: word.length * 0.085,
            ease: "none",
            onUpdate: () => {
              el.textContent = word.slice(0, Math.round(o.n));
            },
          })
            .to({}, { duration: 1.1 }) // hold the finished word
            .add(() => el.classList.add("is-selected")) // simulate selecting it (blue highlight)
            .to({}, { duration: 0.6 }) // hold the selection
            .add(() => {
              el.classList.remove("is-selected"); // then delete the selected text at once
              el.textContent = "";
            })
            .to({}, { duration: 0.45 }); // brief pause before the next word
        });
      }
    },
    { scope: root, dependencies: [] }
  );

  return (
    <section
      ref={root}
      data-no-reveal
      className="relative overflow-hidden rounded-b-[40px]"
      style={{
        background: `radial-gradient(at 18% 20%, #7c3aed 0px, transparent 55%), radial-gradient(at 82% 12%, ${settings.colorPrimary} 0px, transparent 50%), radial-gradient(at 78% 88%, #db2777 0px, transparent 52%), radial-gradient(at 12% 82%, #6d28d9 0px, transparent 50%), linear-gradient(160deg, #1e1147 0%, #140a2e 100%)`,
      }}
    >
      {/* soft top glow */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-white/10 to-transparent" />

      {/* 6 floating colourful product tiles */}
      {TILES.map((tile, idx) => (
        <div
          key={idx}
          className={`hero-tile absolute z-0 hidden lg:block ${tile.pos} ${tile.size}`}
          style={{ rotate: tile.rot }}
        >
          <div
            className="hero-tile-inner overflow-hidden rounded-3xl shadow-2xl ring-1 ring-white/20"
            style={{ background: `linear-gradient(140deg, ${tile.from}, ${tile.to})` }}
          >
            <div className="aspect-square p-3">
              <BoxMockup colorway={tile.box} label={tile.box.name} transparent />
            </div>
          </div>
        </div>
      ))}

      {/* centred content */}
      <div className="relative z-10 mx-auto flex max-w-3xl flex-col items-center px-6 py-20 text-center md:py-28">
        <span className="hero-eyebrow text-sm font-bold uppercase tracking-[0.3em] text-pink-400">
          {settings.heroEyebrow}
        </span>

        <h1 className="hero-h1 mt-6 w-full font-serif text-4xl leading-tight text-white sm:text-5xl md:text-6xl">
          <span className="block">{settings.heroHeadingPrefix}</span>
          <span className="mt-1 block min-h-[1.2em] font-semibold">
            <span ref={typeRef} className="hero-type" />
            <span className="hero-caret">|</span>
          </span>
        </h1>

        <p className="hero-sub mx-auto mt-6 max-w-2xl text-lg text-white/70">
          {settings.heroSubtitle}
        </p>

        {/* CTAs */}
        <div className="mt-9 flex flex-wrap items-center justify-center gap-4">
          <Link
            href={settings.heroCtaPrimaryHref}
            className="hero-cta rounded-full bg-white px-7 py-3.5 text-sm font-bold uppercase tracking-wide text-[#1a0f3d] shadow-lg transition hover:bg-white/90 active:scale-[.98]"
          >
            {settings.heroCtaPrimaryLabel}
          </Link>
          <Link
            href={settings.heroCtaSecondaryHref}
            className="hero-cta rounded-full border border-white/40 px-7 py-3.5 text-sm font-bold uppercase tracking-wide text-white transition hover:bg-white/10 active:scale-[.98]"
          >
            {settings.heroCtaSecondaryLabel}
          </Link>
        </div>

        {/* colourful category pills */}
        <div className="mt-10 flex max-w-3xl flex-wrap items-center justify-center gap-3">
          {PILLS.map((p) => (
            <Link
              key={p.label}
              href={p.href}
              className="hero-pill rounded-full px-4 py-2 text-sm font-semibold shadow-md transition hover:-translate-y-0.5 hover:shadow-lg"
              style={{ background: p.bg, color: p.fg }}
            >
              # {p.label}
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
