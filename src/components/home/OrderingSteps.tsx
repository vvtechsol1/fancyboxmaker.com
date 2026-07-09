import { PencilLine, Send, PenTool, Package, Truck } from "lucide-react";
import type { LucideIcon } from "lucide-react";

const STEPS: { icon: LucideIcon; title: string; text: string }[] = [
  {
    icon: PencilLine,
    title: "Fill Out Free Quote Form",
    text: "Tell us your desired size, style, printing, material, finishing, quantity and contact details",
  },
  {
    icon: Send,
    title: "Get Instant Price Quotation",
    text: "Get a competitive quote based on your customized preferences and provided details",
  },
  {
    icon: PenTool,
    title: "Free Design Creation",
    text: "Our team of dedicated designers assist you in creating work-of-art packaging solutions",
  },
  {
    icon: Package,
    title: "Final Production",
    text: "After your approval we produce your customized packaging with utmost care and precision",
  },
  {
    icon: Truck,
    title: "Free Shipping",
    text: "Get your customized packaging at your doorstep free of cost with care and a tracking ID",
  },
];

export default function OrderingSteps() {
  return (
    <section
      className="py-16"
      style={{
        background:
          "radial-gradient(at 15% 15%, #7c3aed 0px, transparent 55%), radial-gradient(at 85% 20%, #18bcaa 0px, transparent 50%), radial-gradient(at 80% 90%, #db2777 0px, transparent 52%), radial-gradient(at 15% 85%, #6d28d9 0px, transparent 50%), linear-gradient(160deg, #1e1147 0%, #140a2e 100%)",
      }}
    >
      <div className="container-x">
        <h2 className="text-center font-display font-extrabold text-white text-3xl md:text-4xl">
          Fast, Easy &amp; Hassle Free Ordering
        </h2>
        <p className="mx-auto mt-5 max-w-3xl text-center text-white/70">
          At FancyBoxMaker, our ordering process is extremely simple, fast and
          robust. Just share your requirements, approve your design and let us handle the
          rest for you. From initial quote to doorstep delivery, we ensure a seamless
          process.
        </p>

        <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {STEPS.map(({ icon: Icon, title, text }) => (
            <div key={title} className="rounded-2xl bg-white p-5 text-center shadow-[var(--shadow-soft)]">
              <Icon size={28} className="mx-auto text-green" />
              <h3 className="mt-4 font-bold text-ink">{title}</h3>
              <p className="mt-2 text-sm text-ink-soft">{text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
