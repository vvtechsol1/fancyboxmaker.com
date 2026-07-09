// =============================================================
//  Box Category → Box Type taxonomy (powers the mega-menu / finder)
//  Three top-level groups mirror the industry standard:
//    • by-industry     — packaging organised by the product inside
//    • food-packaging  — food & beverage boxes and bags
//    • by-style        — packaging chosen by box construction/style
//  Every box-type slug is globally unique (it is the product FK).
// =============================================================

export type BoxType = {
  name: string; // display name, e.g. "Pizza Boxes"
  slug: string; // unique slug, e.g. "pizza-boxes"
};

export type BoxCategory = {
  slug: string;
  name: string;
  /** Short label used on chips / compact UIs. */
  short?: string;
  /** Marketing line shown in the mega-menu column header. */
  blurb?: string;
  popular?: boolean;
  types: BoxType[];
};

const t = (name: string, slug: string): BoxType => ({ name, slug });

export const categories: BoxCategory[] = [
  {
    slug: "by-industry",
    name: "Boxes by Industry",
    short: "Industry",
    blurb: "Custom packaging tailored to your product & industry",
    popular: true,
    types: [
      t("Cosmetic Boxes", "cosmetic-boxes"),
      t("Perfume Boxes", "perfume-boxes"),
      t("Jewelry Boxes", "jewelry-boxes"),
      t("Hair Extension Boxes", "hair-extension-boxes"),
      t("Candle Boxes", "candle-boxes"),
      t("Soap Boxes", "soap-boxes"),
      t("Pillow Boxes", "pillow-boxes"),
      t("Display Boxes", "display-boxes"),
      t("Insert Boxes", "insert-boxes"),
      t("Apparel Boxes", "apparel-boxes"),
      t("CBD Boxes", "cbd-boxes"),
      t("Vape Boxes", "vape-boxes"),
      t("Cigarette Boxes", "cigarette-boxes"),
      t("Child-Resistant Boxes", "child-resistant-boxes"),
      t("Gift Boxes", "gift-boxes"),
      t("Toy Boxes", "toy-boxes"),
      t("Custom Sleeve Boxes", "sleeve-boxes"),
      t("Custom Stickers", "custom-stickers"),
    ],
  },
  {
    slug: "food-packaging",
    name: "Food Packaging",
    short: "Food",
    blurb: "Food-safe boxes & bags for every menu",
    popular: true,
    types: [
      t("Pizza Boxes", "pizza-boxes"),
      t("Bakery Boxes", "bakery-boxes"),
      t("Burger Boxes", "burger-boxes"),
      t("Macaron Boxes", "macaron-boxes"),
      t("Cereal Boxes", "cereal-boxes"),
      t("Takeout Boxes", "takeout-boxes"),
      t("Beverage Boxes", "beverage-boxes"),
      t("Popcorn Boxes", "popcorn-boxes"),
      t("Chocolate Boxes", "chocolate-boxes"),
      t("Gable Boxes", "gable-boxes"),
      t("Mylar Bags", "mylar-bags"),
    ],
  },
  {
    slug: "by-style",
    name: "Boxes by Style",
    short: "Style",
    blurb: "Pick your box by construction & unboxing style",
    types: [
      t("Rigid Boxes", "rigid-boxes"),
      t("Mailer Boxes", "mailer-boxes"),
      t("Folding Cartons", "folding-cartons"),
      t("Tuck End Boxes", "tuck-end-boxes"),
      t("Two-Piece Boxes", "two-piece-boxes"),
      t("Hexagon Boxes", "hexagon-boxes"),
      t("Kraft Boxes", "kraft-boxes"),
      t("Sleeve Packaging", "sleeve-packaging"),
    ],
  },
];

// ---------------- helpers ----------------

export function getCategoryBySlug(slug: string): BoxCategory | undefined {
  return categories.find((c) => c.slug === slug);
}

/** Find which category a box-type slug belongs to. */
export function getCategoryOfType(typeSlug: string): BoxCategory | undefined {
  return categories.find((c) => c.types.some((tt) => tt.slug === typeSlug));
}

export function getBoxTypeBySlug(slug: string): BoxType | undefined {
  for (const c of categories) {
    const found = c.types.find((tt) => tt.slug === slug);
    if (found) return found;
  }
  return undefined;
}

/** All box types flattened (useful for seeding / sitemaps). */
export function allBoxTypes(): { category: BoxCategory; type: BoxType }[] {
  return categories.flatMap((c) => c.types.map((type) => ({ category: c, type })));
}

export const popularCategories = categories.filter((c) => c.popular);
