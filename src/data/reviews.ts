export type Review = {
  name: string;
  city: string;
  rating: number;
  text: string;
  product: string;
  date: string;
};

export const reviewStats = {
  count: 11468,
  average: 4.9,
};

export const reviews: Review[] = [
  {
    name: "Ahsan Raza",
    city: "Lahore",
    rating: 5,
    text: "Bohat zabardast quality! Case bilkul perfect fit hua mere iPhone par. Delivery bhi sirf 2 din mein. Highly recommended.",
    product: "iPhone 15 Pro Max Liquid Silicone Case",
    date: "2 weeks ago",
  },
  {
    name: "Fatima Khan",
    city: "Karachi",
    rating: 5,
    text: "Real pictures jaisa hi product mila, no difference. COD bhi available tha. Bohat acha experience raha Case Bazar ke saath.",
    product: "Samsung Galaxy S24 Ultra Clear Case",
    date: "3 weeks ago",
  },
  {
    name: "Bilal Ahmed",
    city: "Islamabad",
    rating: 5,
    text: "Ordered on WhatsApp, reply within minutes. The leather case feels super premium and protects really well. 10/10.",
    product: "Kajsa Luxe Quilted Leather Case",
    date: "1 month ago",
  },
  {
    name: "Ayesha Siddiqui",
    city: "Rawalpindi",
    rating: 5,
    text: "Colour exactly same as shown. Packaging was excellent and the case quality is way better than what I got from local market.",
    product: "iPhone 16 Pro Max MagSafe Case",
    date: "1 month ago",
  },
  {
    name: "Hamza Tariq",
    city: "Faisalabad",
    rating: 5,
    text: "Fast delivery and original product. The armor case saved my phone from a nasty drop already. Will order again.",
    product: "OnePlus 13 Hybrid Armor Case",
    date: "5 days ago",
  },
  {
    name: "Maryam Noor",
    city: "Multan",
    rating: 5,
    text: "Customer service is amazing. They helped me pick the right case for my model on WhatsApp. Product is top notch.",
    product: "Xiaomi 15 Ultra Camera Guard Case",
    date: "2 weeks ago",
  },
];
