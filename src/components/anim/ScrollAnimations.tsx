"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/**
 * Site-wide scroll-reveal layer. Mounted once in the root layout; re-runs on
 * every route change.
 *
 * BULLETPROOF BY DESIGN: elements are NEVER pre-hidden. They stay visible in
 * their natural state and only briefly animate (opacity/translate) via `onEnter`
 * when they scroll into view. If a ScrollTrigger fails to fire for any reason,
 * the content simply stays visible — it can never get stuck hidden. A safety
 * sweep also force-clears any element that somehow ends up transparent.
 * Respects prefers-reduced-motion.
 */
export default function ScrollAnimations() {
  const pathname = usePathname();

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = gsap.context(() => {
      // 1) Reveal each top-level page block (skip hero / scripts / stagger-grids).
      const blocks = gsap.utils
        .toArray<HTMLElement>("main > *")
        .filter(
          (el) =>
            el.tagName !== "SCRIPT" &&
            el.tagName !== "STYLE" &&
            !el.hasAttribute("data-no-reveal") &&
            !el.querySelector(".gsap-stagger")
        );

      blocks.forEach((el) => {
        ScrollTrigger.create({
          trigger: el,
          start: "top 90%",
          once: true,
          onEnter: () =>
            gsap.fromTo(
              el,
              { opacity: 0, y: 40 },
              { opacity: 1, y: 0, duration: 0.7, ease: "power2.out", clearProps: "transform,opacity" }
            ),
        });
      });

      // 2) Cascade the children of any opted-in grid.
      gsap.utils.toArray<HTMLElement>(".gsap-stagger").forEach((grid) => {
        const kids = Array.from(grid.children) as HTMLElement[];
        if (!kids.length) return;
        ScrollTrigger.create({
          trigger: grid,
          start: "top 90%",
          once: true,
          onEnter: () =>
            gsap.fromTo(
              kids,
              { opacity: 0, y: 28 },
              { opacity: 1, y: 0, duration: 0.5, ease: "power2.out", stagger: 0.07, clearProps: "transform,opacity" }
            ),
        });
      });
    });

    // Recalculate trigger positions after layout/fonts/images settle.
    const refresh = () => ScrollTrigger.refresh();
    const raf = requestAnimationFrame(refresh);
    window.addEventListener("load", refresh);

    // Safety net: nothing must ever remain invisible. Any element left transparent
    // (e.g. a missed trigger) gets forced back to visible.
    const safety = setTimeout(() => {
      gsap.utils.toArray<HTMLElement>("main > *, .gsap-stagger > *").forEach((el) => {
        if (parseFloat(getComputedStyle(el).opacity) < 0.05) {
          gsap.set(el, { opacity: 1, y: 0, clearProps: "transform,opacity" });
        }
      });
    }, 2000);

    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(safety);
      window.removeEventListener("load", refresh);
      ctx.revert();
    };
  }, [pathname]);

  return null;
}
