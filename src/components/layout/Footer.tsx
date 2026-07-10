import Link from "next/link";
import { Phone, Mail, MapPin, ShoppingCart } from "lucide-react";
import type { SiteSettings } from "@/lib/settings";

function IgIcon({ size = 17 }: { size?: number }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <rect x="2" y="2" width="20" height="20" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <line x1="17.5" y1="6.5" x2="17.5" y2="6.5" />
    </svg>
  );
}
function FbIcon({ size = 17 }: { size?: number }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="currentColor" aria-hidden>
      <path d="M14 9h3l.4-3H14V4.5c0-.8.3-1.5 1.6-1.5H17V.3C16.6.2 15.6 0 14.6 0 12.3 0 11 1.4 11 3.9V6H8v3h3v9h3V9z" />
    </svg>
  );
}
function XIcon({ size = 16 }: { size?: number }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="currentColor" aria-hidden>
      <path d="M18.9 1.5h3.3l-7.2 8.2 8.5 11.3h-6.6l-5.2-6.8-6 6.8H2.4l7.7-8.8L1.9 1.5h6.8l4.7 6.2 5.5-6.2zm-1.2 18h1.8L7.1 3.4H5.1L17.7 19.5z" />
    </svg>
  );
}

const POPULAR = [
  { label: "Toy Boxes", href: "/category/toy-boxes" },
  { label: "Food Packaging", href: "/collection/food-packaging" },
  { label: "Cereal Boxes", href: "/category/cereal-boxes" },
  { label: "Mailer Boxes", href: "/category/mailer-boxes" },
  { label: "Bakery Boxes", href: "/category/bakery-boxes" },
];

const QUICK = [
  { label: "About Us", href: "/about" },
  { label: "Contact", href: "/contact" },
  { label: "Get a Quote", href: "/quote" },
  { label: "Shop", href: "/shop" },
  { label: "Track Order", href: "/track-order" },
];

const INFO = [
  { label: "FAQs", href: "/faqs" },
  { label: "Shipping & Delivery", href: "/faqs" },
  { label: "Returns & Refunds", href: "/faqs" },
  { label: "Cart", href: "/cart" },
  { label: "My Quotes", href: "/quote" },
];

const PAYMENTS = ["VISA", "Mastercard", "PayPal", "Amex", "Discover"];

export default function Footer({ settings }: { settings: SiteSettings }) {
  const year = new Date().getFullYear();
  return (
    <footer className="mt-20 text-white/85" style={{ background: settings.colorPrimary }}>
      <div className="container-x grid gap-10 py-14 md:grid-cols-2 lg:grid-cols-5">
        {/* brand */}
        <div className="lg:col-span-1">
          <Link href="/" className="flex items-center gap-2">
            {settings.logoImage ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={settings.logoImage} alt={settings.brandName} className="h-9 w-auto max-w-[190px] object-contain" />
            ) : (
              <>
                <span className="grid h-9 w-9 place-items-center rounded-lg bg-white text-brand">
                  <ShoppingCart size={18} />
                </span>
                <span className="font-display text-lg font-extrabold tracking-tight text-white">
                  {settings.logoText1}<span className="text-white/70">{settings.logoText2}</span>
                </span>
              </>
            )}
          </Link>
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-white/55">
            {settings.footerDescription}
          </p>
        </div>

        <div>
          <h4 className="mb-4 text-sm font-bold uppercase tracking-wide text-white">Popular</h4>
          <ul className="space-y-2.5 text-sm">
            {POPULAR.map((l) => (
              <li key={l.label}><Link href={l.href} className="transition hover:text-white">{l.label}</Link></li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="mb-4 text-sm font-bold uppercase tracking-wide text-white">Quick Links</h4>
          <ul className="space-y-2.5 text-sm">
            {QUICK.map((l) => (
              <li key={l.label}><Link href={l.href} className="transition hover:text-white">{l.label}</Link></li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="mb-4 text-sm font-bold uppercase tracking-wide text-white">Information</h4>
          <ul className="space-y-2.5 text-sm">
            {INFO.map((l) => (
              <li key={l.label}><Link href={l.href} className="transition hover:text-white">{l.label}</Link></li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="mb-4 text-sm font-bold uppercase tracking-wide text-white">Need Help?</h4>
          <ul className="space-y-3 text-sm">
            <li>
              <a href={`tel:${settings.phone.replace(/[^0-9+]/g, "")}`} className="flex items-center gap-2 transition hover:text-white">
                <Phone size={15} className="text-white" /> {settings.phone}
              </a>
            </li>
            <li>
              <a href={`mailto:${settings.email}`} className="flex items-center gap-2 transition hover:text-white">
                <Mail size={15} className="text-white" /> {settings.email}
              </a>
            </li>
            <li className="flex items-start gap-2">
              <MapPin size={15} className="mt-0.5 text-white" /> <span>{settings.address}</span>
            </li>
          </ul>
          <div className="mt-4 flex gap-2">
            {[IgIcon, FbIcon, XIcon].map((Icon, i) => (
              <a key={i} href={[settings.instagram, settings.facebook, settings.twitter][i]} target="_blank" rel="noopener noreferrer"
                aria-label={["Instagram", "Facebook", "X"][i]}
                className="grid h-9 w-9 place-items-center rounded-full border border-white/20 text-white/80 transition hover:border-green hover:text-white">
                <Icon size={16} />
              </a>
            ))}
          </div>
        </div>
      </div>

      <div className="border-t border-white/20 bg-ink">
        <div className="container-x flex flex-col items-center justify-between gap-3 py-5 text-xs text-white/55 sm:flex-row">
          <p>{settings.footerCopyright.replace("{year}", String(year))}</p>
          <div className="flex items-center gap-2">
            {PAYMENTS.map((p) => (
              <span key={p} className="rounded bg-white/10 px-2 py-1 text-[10px] font-semibold text-white/80">{p}</span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
