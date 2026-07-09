// =============================================================
//  Central site configuration — edit values here in ONE place.
// =============================================================

export const SITE = {
  name: "FancyBoxMaker",
  tagline: "Custom Printed Boxes, Done Right",
  description:
    "FancyBoxMaker — full-color custom printed boxes & packaging for brands across the USA. Free 3D mockups, free professional design, low minimums from 50 units, premium finishes, and free shipping — all with a 6–8 business-day turnaround.",
  url: "https://fancyboxmaker.com",
  currency: "$",
  locale: "en_US",

  // 👉 Business WhatsApp number, international format (no +, no spaces).
  //    USA: 1 then the 10-digit number.
  whatsappNumber: "14065550142", // (406) 555-0142

  email: "hello@fancyboxmaker.com",
  phoneDisplay: "(406) 555-0142",
  instagram: "https://instagram.com/fancyboxmaker",
  facebook: "https://facebook.com/fancyboxmaker",
  tiktok: "https://tiktok.com/@fancyboxmaker",

  freeShippingThreshold: 250,
};

// Rotating selling points shown in the announcement bar.
export const announcements: string[] = [
  "🎨 Free 3D mockup & professional design",
  "📦 Low minimums — order from just 50 units",
  "🚚 Free shipping on orders over $250",
  "⚡ 6–8 business-day turnaround",
  "✨ Full-color CMYK printing & premium finishes",
];

// Trust / value props bar.
export const valueProps = [
  { icon: "truck", title: "Free Shipping", text: "On orders over $250" },
  { icon: "refresh", title: "Free 3D Mockup", text: "See it before you print" },
  { icon: "wallet", title: "Low Minimums", text: "Order from just 50 units" },
  { icon: "badge", title: "Premium Finishes", text: "Matte, gloss, foil & more" },
];

/**
 * Build a wa.me link that opens WhatsApp with a pre-filled quote message.
 */
export function whatsappOrderLink(opts: {
  productTitle: string;
  price?: number;
  variant?: string;
  url?: string;
}): string {
  const lines = [
    "Hi! 👋",
    "I'd like a quote for custom boxes:",
    "",
    `*${opts.productTitle}*`,
  ];
  if (opts.variant) lines.push(`Option: ${opts.variant}`);
  if (opts.price != null) lines.push(`Price: ${SITE.currency}${formatNumber(opts.price)}`);
  if (opts.url) lines.push("", opts.url);
  const text = encodeURIComponent(lines.join("\n"));
  return `https://wa.me/${SITE.whatsappNumber}?text=${text}`;
}

export function whatsappChatLink(message = "Hi! I'd like some information about custom printed boxes."): string {
  return `https://wa.me/${SITE.whatsappNumber}?text=${encodeURIComponent(message)}`;
}

/**
 * Full quote request → sent to the TEAM's WhatsApp with all customer + project details.
 * The customer submits the quote form and this opens WhatsApp pre-filled to the team.
 */
export function whatsappFullOrder(opts: {
  productTitle: string;
  variant?: string;
  qty: number;
  price?: number;
  name: string;
  phone: string;
  city: string;
  address: string;
  url?: string;
}): string {
  const total = opts.price != null ? opts.price * opts.qty : undefined;
  const lines = [
    "Hi! I'd like to request a quote for custom boxes 👇",
    "",
    `Product: *${opts.productTitle}*`,
    opts.variant ? `Option: ${opts.variant}` : "",
    `Quantity: ${opts.qty}`,
    total != null ? `Estimated total: ${SITE.currency}${formatNumber(total)}` : "",
    "",
    `Name: ${opts.name}`,
    `Phone: ${opts.phone}`,
    `City: ${opts.city}`,
    `Shipping address: ${opts.address}`,
    "",
    "Please send me a free 3D mockup and quote.",
    opts.url ? opts.url : "",
  ].filter(Boolean);
  return `https://wa.me/${SITE.whatsappNumber}?text=${encodeURIComponent(lines.join("\n"))}`;
}

/**
 * Deterministic thousands-separator formatting (always "1,234,567").
 * Avoids toLocaleString() whose output can differ between the server and the
 * browser locale (e.g. South-Asian 1,00,000 grouping) and cause hydration mismatches.
 */
export function formatNumber(n: number): string {
  return Math.round(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

export function formatPrice(n: number): string {
  return `${SITE.currency}${formatNumber(n)}`;
}
