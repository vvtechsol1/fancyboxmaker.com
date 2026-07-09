"use client";

import { useState } from "react";
import Image from "next/image";
import { Play } from "lucide-react";
import type { Colorway } from "@/data/products";
import BoxMockup from "./BoxMockup";

type Slide =
  | { kind: "image"; src: string }
  | { kind: "mockup" }
  | { kind: "video"; src: string };

export default function ProductGallery({
  images,
  video,
  colorway,
  alt,
}: {
  images?: string[];
  video?: string;
  colorway: Colorway;
  alt: string;
}) {
  const slides: Slide[] = [];
  if (images?.length) images.forEach((src) => slides.push({ kind: "image", src }));
  else slides.push({ kind: "mockup" });
  if (video) slides.push({ kind: "video", src: video });

  const [active, setActive] = useState(0);
  const current = slides[Math.min(active, slides.length - 1)];
  const poster = images?.[0];

  return (
    <div className="flex flex-col gap-4">
      <div className="relative aspect-square overflow-hidden rounded-2xl border border-line bg-surface">
        {current.kind === "image" && (
          <Image src={current.src} alt={alt} fill sizes="(max-width:768px) 100vw, 50vw" className="object-contain" priority />
        )}
        {current.kind === "mockup" && <BoxMockup colorway={colorway} label={alt} />}
        {current.kind === "video" && (
          <video
            src={current.src}
            poster={poster}
            controls
            autoPlay
            playsInline
            className="h-full w-full bg-black object-contain"
          />
        )}
      </div>

      {slides.length > 1 && (
        <div className="flex flex-wrap gap-3">
          {slides.map((s, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              aria-label={s.kind === "video" ? "Play review video" : `View ${i + 1}`}
              className={`relative h-20 w-20 overflow-hidden rounded-xl border-2 bg-surface transition-colors ${
                i === active ? "border-brand" : "border-line hover:border-ink-soft"
              }`}
            >
              {s.kind === "image" && <Image src={s.src} alt={`${alt} ${i + 1}`} fill sizes="80px" className="object-cover" />}
              {s.kind === "mockup" && <BoxMockup colorway={colorway} />}
              {s.kind === "video" && (
                <>
                  {poster ? (
                    <Image src={poster} alt="Review video" fill sizes="80px" className="object-cover opacity-70" />
                  ) : (
                    <span className="absolute inset-0 bg-ink" />
                  )}
                  <span className="absolute inset-0 grid place-items-center">
                    <span className="grid h-8 w-8 place-items-center rounded-full bg-brand text-white shadow">
                      <Play size={15} className="translate-x-[1px] fill-white" />
                    </span>
                  </span>
                  <span className="absolute bottom-0 inset-x-0 bg-black/60 py-0.5 text-center text-[9px] font-bold uppercase tracking-wide text-white">
                    Review
                  </span>
                </>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
