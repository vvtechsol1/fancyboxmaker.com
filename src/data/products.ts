// =============================================================
//  Product catalogue — custom printed boxes
//  ---------------------------------------------------------------
//  Products are seeded across every box type (see taxonomy.ts) so the
//  store looks full from day one. Each seeded product renders a
//  branded <BoxMockup> (coloured) instead of a photo.
//  Replace seeded items with real products + photos any time:
//  drop images in /public/products and set `images: [...]`.
//  NOTE: prices are USD for a standard pack of 100 units; larger
//  quantity tiers live in `variants` (per-unit cost drops with volume).
// =============================================================

import { allBoxTypes, getBoxTypeBySlug, getCategoryOfType } from "./taxonomy";

export type Colorway = { name: string; from: string; to: string };

/** A purchasable variation (here: a quantity tier) with its own price/stock. */
export type Variant = {
  label: string; // e.g. "250 units" or "Full-Color Both Sides"
  price?: number; // overrides base price when set
  oldPrice?: number;
  inStock: boolean;
  sku?: string;
};

/** A single spec row (key → value). */
export type Spec = { label: string; value: string };

export type Product = {
  slug: string;
  name: string;
  type: string; // box construction/material, e.g. "Corrugated Mailer"
  boxType: string; // box-type slug (FK into taxonomy.ts)
  boxTypeName: string;
  category: string; // category slug (FK into taxonomy.ts)
  categoryName: string;
  price: number; // USD, standard pack of 100 units
  oldPrice?: number;
  taxPercent?: number; // optional tax % (0 = tax inclusive / none)
  colorway: Colorway; // primary colour (drives the mockup)
  colors: Colorway[]; // available colours (swatches)
  images?: string[]; // real photos (optional); falls back to mockup
  video?: string; // optional product video URL (mp4 or YouTube/embed)
  variants?: Variant[]; // quantity tiers
  specifications?: Spec[]; // spec table
  rating: number;
  reviews: number;
  inStock: boolean;
  isNew?: boolean;
  isHot?: boolean;
  featured?: boolean;
  shortDescription: string;
  descriptionHtml: string;
};

// ---- palette of colourways used by seeded products / swatches ----
export const COLORWAYS: Record<string, Colorway> = {
  kraft: { name: "Natural Kraft", from: "#b07a48", to: "#d8a874" },
  white: { name: "Pearl White", from: "#e9ecf0", to: "#ffffff" },
  black: { name: "Matte Black", from: "#1b1d22", to: "#3a3e47" },
  teal: { name: "Deep Teal", from: "#0b5d5c", to: "#14a8a5" },
  navy: { name: "Midnight Navy", from: "#12233b", to: "#2b4a75" },
  green: { name: "Forest Green", from: "#14532d", to: "#22a35a" },
  red: { name: "Crimson Red", from: "#9f1239", to: "#ef4444" },
  gold: { name: "Metallic Gold", from: "#8a6a1f", to: "#e9c66a" },
  pink: { name: "Blush Pink", from: "#be5a72", to: "#fbc2d0" },
  purple: { name: "Royal Purple", from: "#5b21b6", to: "#a78bfa" },
};

/** Box construction/material templates. `base` = USD per pack of 100. */
type BoxStyle = { type: string; base: number; blurb: string; material: string };
const BOX_STYLES: BoxStyle[] = [
  { type: "Corrugated Mailer", base: 89, blurb: "Sturdy E-flute corrugated stock with a self-locking mailer build — ships flat, protects hard.", material: "E-flute corrugated cardboard" },
  { type: "Kraft Folding Carton", base: 65, blurb: "Eco-friendly kraft paperboard folding carton with a secure tuck-top closure.", material: "Kraft paperboard (350gsm)" },
  { type: "Rigid Setup Box", base: 239, blurb: "Luxury rigid setup box wrapped in premium art paper for a high-end unboxing.", material: "Greyboard + wrapped art paper" },
  { type: "Full-Color Cardboard Box", base: 119, blurb: "Smooth SBS cardboard with edge-to-edge full-CMYK printing and a crisp finish.", material: "SBS cardboard (18pt)" },
  { type: "Window Display Box", base: 99, blurb: "Retail-ready box with a clear PVC window that shows off the product inside.", material: "SBS cardboard + PVC window" },
  { type: "Eco Kraft Box", base: 59, blurb: "100% recycled brown kraft with a natural matte finish and a minimal look.", material: "Recycled kraft board" },
];

const QTY_TIERS: { label: string; mult: number }[] = [
  { label: "100 units", mult: 1 },
  { label: "250 units", mult: 2.2 },
  { label: "500 units", mult: 3.9 },
  { label: "1000 units", mult: 6.4 },
];

const slugify = (s: string) =>
  s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");

function buildVariants(base: number, sale: boolean): Variant[] {
  return QTY_TIERS.map((tier, i) => {
    const price = Math.round(base * tier.mult);
    return {
      label: tier.label,
      price,
      oldPrice: sale && i === 0 ? Math.round((price * 1.3) / 5) * 5 : undefined,
      inStock: true,
      sku: `${slugify(tier.label)}`,
    };
  });
}

function buildSpecs(style: BoxStyle, boxTypeName: string): Spec[] {
  return [
    { label: "Product", value: boxTypeName },
    { label: "Style", value: style.type },
    { label: "Material", value: style.material },
    { label: "Dimensions", value: "Custom — made to your exact size" },
    { label: "Printing", value: "Full-color CMYK / PMS, inside & out" },
    { label: "Finishing", value: "Matte / Gloss / Soft-touch, Foil, Emboss, Spot UV" },
    { label: "Min. order", value: "As low as 50 units — no large MOQ" },
    { label: "Turnaround", value: "6–8 business days + free shipping" },
  ];
}

function descriptionHtml(style: BoxStyle, boxTypeName: string, colorName: string) {
  const lower = boxTypeName.toLowerCase();
  return `
<p>${style.blurb} Our custom <strong>${lower}</strong> are built to fit your product perfectly and turn every unboxing into a branded experience.</p>
<h3>Why brands choose these boxes</h3>
<ul>
  <li><strong>Made to your size:</strong> Any length × width × depth — a die-line built around your product, not a generic box.</li>
  <li><strong>Full-color printing:</strong> Edge-to-edge CMYK/PMS artwork, inside and out, with a sharp ${colorName} base.</li>
  <li><strong>Premium finishes:</strong> Matte, gloss or soft-touch lamination plus optional foil stamping, embossing and spot UV.</li>
  <li><strong>Sturdy material:</strong> ${style.material} that protects the product and holds its shape in transit.</li>
</ul>
<h3>Free with every order</h3>
<ul>
  <li>Free 3D digital mockup before we print</li>
  <li>Free professional design assistance</li>
  <li>Free shipping · 6–8 business-day turnaround · no plate or die charges</li>
</ul>
`;
}

// ----------------- featured hero product -----------------
const HERO: Product = (() => {
  const style = BOX_STYLES[2]; // Rigid Setup Box
  const bt = getBoxTypeBySlug("rigid-boxes")!;
  const cat = getCategoryOfType("rigid-boxes")!;
  const primary = COLORWAYS.teal;
  return {
    slug: "signature-rigid-magnetic-gift-box-teal",
    name: "Signature Magnetic-Close Rigid Gift Box",
    type: style.type,
    boxType: bt.slug,
    boxTypeName: bt.name,
    category: cat.slug,
    categoryName: cat.name,
    price: 259,
    oldPrice: 329,
    colorway: primary,
    colors: [COLORWAYS.teal, COLORWAYS.black, COLORWAYS.kraft, COLORWAYS.gold],
    variants: buildVariants(259, true),
    specifications: buildSpecs(style, bt.name),
    rating: 5,
    reviews: 41,
    inStock: true,
    isHot: true,
    featured: true,
    isNew: true,
    shortDescription:
      "Our best-selling luxury rigid box with a magnetic-close lid, soft-touch lamination and foil-stamped logo. The premium unboxing brands love.",
    descriptionHtml: descriptionHtml(style, bt.name, primary.name),
  };
})();

// ----------------- seeded catalogue -----------------
function buildSeed(): Product[] {
  const out: Product[] = [];
  allBoxTypes().forEach(({ category, type: boxType }, ti) => {
    // 2 products per box type (rotating styles & colours)
    for (let k = 0; k < 2; k++) {
      const style = BOX_STYLES[(ti + k) % BOX_STYLES.length];
      const colorKeys = Object.keys(COLORWAYS);
      const primary = COLORWAYS[colorKeys[(ti * 2 + k) % colorKeys.length]];
      const secondary = COLORWAYS[colorKeys[(ti * 2 + k + 3) % colorKeys.length]];
      const third = COLORWAYS[colorKeys[(ti * 2 + k + 6) % colorKeys.length]];
      const price = style.base + ((ti % 3) * 10);
      const onSale = (ti + k) % 3 === 0;
      const oldPrice = onSale ? Math.round((price * 1.3) / 5) * 5 : undefined;
      const rating = 4 + (((ti + k) % 10) >= 4 ? 1 : 0); // 4 or 5
      const reviews = 6 + ((ti * 7 + k * 13) % 90);
      out.push({
        slug: `${boxType.slug}-${slugify(style.type)}-${slugify(primary.name)}`,
        name: `${style.type} ${boxType.name}`,
        type: style.type,
        boxType: boxType.slug,
        boxTypeName: boxType.name,
        category: category.slug,
        categoryName: category.name,
        price,
        oldPrice,
        colorway: primary,
        colors: [primary, secondary, third],
        variants: buildVariants(price, onSale),
        specifications: buildSpecs(style, boxType.name),
        rating,
        reviews,
        inStock: (ti + k) % 13 !== 0,
        isNew: ti < 5,
        isHot: k === 0 && ti % 3 === 0,
        featured: k === 0 && ti % 4 === 0,
        shortDescription: `${style.blurb} Custom-printed ${boxType.name.toLowerCase()} in ${primary.name.toLowerCase()}.`,
        descriptionHtml: descriptionHtml(style, boxType.name, primary.name),
      });
    }
  });
  return out;
}

/**
 * Initial seed catalogue. The live catalogue is stored in data/products.json
 * (see src/lib/store.ts) and is seeded from this array on first run, after
 * which the Admin panel becomes the source of truth.
 */
export const seedProducts: Product[] = [HERO, ...buildSeed()];

// ---------------- pure, client-safe helpers ----------------
export function discountPct(p: Product): number | null {
  if (!p.oldPrice || p.oldPrice <= p.price) return null;
  return Math.round(((p.oldPrice - p.price) / p.oldPrice) * 100);
}

/** Price incl. tax when a taxPercent is set. */
export function priceWithTax(p: Pick<Product, "price" | "taxPercent">): number {
  return p.taxPercent ? Math.round(p.price * (1 + p.taxPercent / 100)) : p.price;
}
