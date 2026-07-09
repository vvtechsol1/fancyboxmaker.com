import type { Metadata } from "next";
import Link from "next/link";
import { Phone, Mail, MapPin, Clock, MessageCircle } from "lucide-react";
import { SITE, whatsappChatLink } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contact Us",
  description: `Get in touch with ${SITE.name}. Request a free quote and 3D mockup for your custom printed boxes — fast replies by email or WhatsApp.`,
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return (
    <div className="container-x py-12">
      <header className="mb-10 text-center">
        <h1 className="text-3xl font-extrabold tracking-tight text-ink font-display md:text-4xl">We're here to help</h1>
        <p className="mx-auto mt-3 max-w-xl text-sm text-ink-soft">
          Have a project in mind? Send us your box type, size and quantity — we'll reply fast with a free quote and 3D mockup.
        </p>
      </header>

      <div className="mx-auto grid max-w-4xl gap-4 md:grid-cols-2">
        <a
          href={whatsappChatLink()}
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-col items-start gap-3 rounded-2xl border border-line bg-[var(--color-wa)]/5 p-6 transition hover:border-[var(--color-wa)]"
        >
          <span className="grid h-12 w-12 place-items-center rounded-full bg-[var(--color-wa)] text-white"><MessageCircle size={22} /></span>
          <h3 className="font-bold text-ink">Chat on WhatsApp</h3>
          <p className="text-sm text-ink-soft">Send your box specs, artwork or questions. Fastest response.</p>
          <span className="mt-1 text-sm font-semibold text-[var(--color-wa-dark)]">Start chat →</span>
        </a>

        <div className="grid gap-4">
          {[
            { Icon: Phone, t: "Call / WhatsApp", v: SITE.phoneDisplay },
            { Icon: Mail, t: "Email", v: SITE.email },
            { Icon: Clock, t: "Hours", v: "Mon–Fri, 9 AM – 6 PM EST" },
            { Icon: MapPin, t: "Ships to", v: "USA & international" },
          ].map(({ Icon, t, v }) => (
            <div key={t} className="flex items-center gap-3 rounded-2xl border border-line bg-white p-4">
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-brand-soft text-brand"><Icon size={18} /></span>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-ink-soft">{t}</p>
                <p className="text-sm font-medium text-ink">{v}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mx-auto mt-8 max-w-4xl text-center">
        <Link
          href="/quote"
          className="inline-flex rounded-full bg-brand px-7 py-3.5 text-sm font-semibold text-white shadow-[var(--shadow-brand)] hover:bg-brand-dark"
        >
          Get a Free Quote
        </Link>
      </div>
    </div>
  );
}
