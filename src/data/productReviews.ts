// Realistic review pool. Each product shows a deterministic subset (based on its
// slug) so the reviews stay consistent between server render and client hydration.
// {model} is replaced with the product's box-type name.

export type ReviewSeed = { name: string; city: string; rating: number; text: string; days: number };
export type ProductReview = { name: string; city: string; rating: number; date: string; text: string; verified: boolean };

const POOL: ReviewSeed[] = [
  { name: "Marcus Bell", city: "Austin, TX", rating: 5, text: "The print quality on our {model} is incredible — colors matched our brand exactly. The free 3D mockup made approval a breeze.", days: 3 },
  { name: "Priya Nair", city: "Seattle, WA", rating: 5, text: "Ordered custom {model} for our product launch. Sturdy material, crisp printing, and they arrived two days early. Highly recommend.", days: 8 },
  { name: "Jordan Reyes", city: "Denver, CO", rating: 5, text: "The soft-touch finish and foil logo look so premium. Our unboxing videos have never looked better.", days: 12 },
  { name: "Emily Carter", city: "Chicago, IL", rating: 4, text: "Great boxes and the die-line fit our product perfectly. Took one round of proofing to nail the color, but the team was patient.", days: 20 },
  { name: "David Okafor", city: "Atlanta, GA", rating: 5, text: "No huge minimum order was the dealbreaker for us as a small brand. Quality rivals boxes that cost twice as much.", days: 5 },
  { name: "Sofia Marconi", city: "Miami, FL", rating: 5, text: "Beautiful rigid construction and a magnetic lid that closes with a satisfying snap. Customers keep complimenting the packaging.", days: 15 },
  { name: "Ryan Mitchell", city: "Portland, OR", rating: 5, text: "Third reorder now — consistent quality every single time. The design team even fixed our artwork bleed for free.", days: 25 },
  { name: "Hannah Weiss", city: "Boston, MA", rating: 4, text: "Solid boxes, shipped flat and easy to assemble. Good value for the finish we got.", days: 30 },
  { name: "Chris Palmer", city: "Nashville, TN", rating: 5, text: "The {model} were exactly to spec — dimensions spot on and the matte lamination is gorgeous. Turnaround was quick.", days: 18 },
  { name: "Aaliyah Brooks", city: "Phoenix, AZ", rating: 5, text: "Premium feel at a small-business price. The kraft option is eco-friendly and still prints beautifully.", days: 6 },
  { name: "Nathan Cole", city: "San Diego, CA", rating: 5, text: "Color and structure both excellent. Retailers noticed the upgrade immediately — shelf presence is a huge win.", days: 22 },
  { name: "Isabella Rossi", city: "New York, NY", rating: 5, text: "Instant reply from support and the whole order went smoothly. The mockup looked exactly like the final print.", days: 9 },
  { name: "Grace Sullivan", city: "Minneapolis, MN", rating: 4, text: "Comfortable ordering process and the boxes protect our product well in transit. Would order again.", days: 40 },
  { name: "Omar Haddad", city: "Dallas, TX", rating: 5, text: "Exactly as previewed — no surprises. Fast, free shipping and rock-solid packaging. Thank you!", days: 11 },
  { name: "Lily Chen", city: "San Francisco, CA", rating: 5, text: "The spot-UV detail on our {model} is stunning. Elevated our whole brand presentation.", days: 14 },
  { name: "Tyler Brooks", city: "Columbus, OH", rating: 5, text: "Great edge protection and clean creases — no cracking on the fold. Print is razor sharp.", days: 28 },
  { name: "Sara Lindqvist", city: "Salt Lake City, UT", rating: 5, text: "Matched the proof perfectly, zero difference. Highly recommended supplier for custom packaging.", days: 7 },
  { name: "Daniel Cruz", city: "San Antonio, TX", rating: 4, text: "Good boxes for the price and the material feels durable. Happy with the result.", days: 35 },
  { name: "Megan Foster", city: "Charlotte, NC", rating: 5, text: "The embossed logo came out crisp and the color is deep and rich. Couldn't be happier with the reorder.", days: 4 },
  { name: "Kevin Nguyen", city: "Las Vegas, NV", rating: 5, text: "Sturdy build, our products arrive safe every time. Five stars for both quality and service.", days: 10 },
];

function hash(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0;
  return Math.abs(h);
}

function ago(d: number): string {
  if (d < 1) return "today";
  if (d < 2) return "yesterday";
  if (d < 7) return `${d} days ago`;
  if (d < 14) return "1 week ago";
  if (d < 30) return `${Math.floor(d / 7)} weeks ago`;
  if (d < 60) return "1 month ago";
  return `${Math.floor(d / 30)} months ago`;
}

export function getProductReviews(slug: string, modelName: string) {
  const h = hash(slug);
  const count = 6 + (h % 7); // 6..12
  const start = h % POOL.length;
  const reviews: ProductReview[] = [];
  for (let i = 0; i < count; i++) {
    const base = POOL[(start + i) % POOL.length];
    reviews.push({
      name: base.name,
      city: base.city,
      rating: base.rating,
      date: ago(base.days + ((h + i) % 5)),
      text: base.text.replace(/\{model\}/g, modelName),
      verified: (h + i) % 6 !== 0,
    });
  }
  const total = reviews.reduce((s, r) => s + r.rating, 0);
  const average = Math.round((total / reviews.length) * 10) / 10;
  const distribution = [5, 4, 3, 2, 1].map((star) => ({
    star,
    count: reviews.filter((r) => r.rating === star).length,
  }));
  return { reviews, count: reviews.length, average, distribution };
}
