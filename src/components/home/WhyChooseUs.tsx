import {
  Ruler,
  Package,
  PenTool,
  Truck,
  Clock,
  Box,
  Layers,
  Zap,
  type LucideIcon,
} from "lucide-react";

type Feature = {
  icon: LucideIcon;
  title: string;
  text: string;
};

const features: Feature[] = [
  {
    icon: Ruler,
    title: "Tailored Box Dimensions",
    text: "Packaging that fits your product flawlessly — any size, style or shape.",
  },
  {
    icon: Package,
    title: "Easy to Handle Packaging",
    text: "Practical designs that are simple to carry, store, ship and unbox.",
  },
  {
    icon: PenTool,
    title: "Free Creative Design Help",
    text: "Our professional designers bring your ideas to life at no extra cost.",
  },
  {
    icon: Truck,
    title: "Fast & Free Delivery",
    text: "Free nationwide shipping in a quick, reliable turnaround.",
  },
  {
    icon: Clock,
    title: "Around-the-Clock Support",
    text: "Our team is available 24/7 for order tracking and expert help.",
  },
  {
    icon: Box,
    title: "Digital 2D & 3D Mockups",
    text: "Review mockups before production for total confidence in the design.",
  },
  {
    icon: Layers,
    title: "Low to No Minimum Orders",
    text: "From small batches to bulk wholesale, we accommodate every budget.",
  },
  {
    icon: Zap,
    title: "Quick Production Timeline",
    text: "Fast 6–8 business-day turnaround across the USA for runs of any size.",
  },
];

export default function WhyChooseUs() {
  return (
    <section className="bg-cream-2 py-14">
      <div className="container-x">
        <h2 className="font-display font-extrabold text-ink text-3xl md:text-4xl">
          Why Choose Us?
        </h2>

        <div className="mt-8 grid md:grid-cols-2 gap-x-10 gap-y-6">
          {features.map(({ icon: Icon, title, text }) => (
            <div key={title} className="flex items-start gap-3">
              <Icon size={22} className="text-green shrink-0 mt-0.5" />
              <div>
                <h3 className="text-ink font-bold">{title}</h3>
                <p className="text-ink-soft text-sm">{text}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
