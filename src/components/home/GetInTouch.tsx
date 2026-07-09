"use client";

import { useState } from "react";
import {
  FileText,
  BadgeCheck,
  Box,
  Sparkles,
  Truck,
  CheckCircle2,
  type LucideIcon,
} from "lucide-react";
import { categories } from "@/data/taxonomy";

const PROCESS: { icon: LucideIcon; title: string; text: string }[] = [
  {
    icon: FileText,
    title: "Share Your Details",
    text: "We'll create a design and 3D mock-up for your approval.",
  },
  {
    icon: BadgeCheck,
    title: "Quality Assurance",
    text: "Providing the promised quality of custom packaging boxes wholesale.",
  },
  {
    icon: Box,
    title: "Free 3D Mockup",
    text: "Finalize the order to enjoy the free 3D packaging design mockup.",
  },
  {
    icon: Sparkles,
    title: "Customization",
    text: "Approve the design to start the production of your bulk boxes.",
  },
  {
    icon: Truck,
    title: "Free Delivery",
    text: "Free shipping on both no-minimum and bulk packaging orders.",
  },
];

const MATERIALS = [
  "Kraft paperboard",
  "SBS cardboard",
  "E-flute corrugated",
  "Rigid greyboard",
  "Recycled kraft",
];
const COLORS = ["Kraft", "White", "Black", "Full-color CMYK", "Custom PMS"];
const SURFACES = ["Matte", "Gloss", "Soft-touch", "Foil", "Embossing", "Spot UV"];

const field =
  "h-11 w-full rounded-lg border border-line bg-white px-3 text-sm outline-none focus:border-brand";

type Status = "idle" | "sending" | "done" | "error";

export default function GetInTouch() {
  const [f, setF] = useState({
    name: "",
    email: "",
    phone: "",
    length: "",
    width: "",
    depth: "",
    quantity: "",
    boxType: "",
    material: "",
    color: "",
    surface: "",
    country: "",
    notes: "",
  });
  const [status, setStatus] = useState<Status>("idle");
  const [ref, setRef] = useState("");
  const [error, setError] = useState("");

  const set = (key: keyof typeof f) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => setF((prev) => ({ ...prev, [key]: e.target.value }));

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("sending");
    setError("");
    try {
      const res = await fetch("/api/quote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: f.name,
          email: f.email,
          phone: f.phone,
          length: f.length,
          width: f.width,
          depth: f.depth,
          quantity: f.quantity,
          boxType: f.boxType,
          material: f.material,
          color: f.color,
          finishes: [f.surface],
          notes: f.notes,
          company: "",
        }),
      });
      const data = await res.json();
      if (res.ok && data.ok) {
        setRef(data.ref ?? "");
        setStatus("done");
      } else {
        setError(data.error || "Something went wrong. Please try again.");
        setStatus("error");
      }
    } catch {
      setError("Network error. Please try again.");
      setStatus("error");
    }
  }

  return (
    <section className="bg-cream">
      <div className="container-x py-16">
        <div className="grid gap-10 lg:grid-cols-2">
          {/* LEFT — process */}
          <div>
            <h2 className="font-display text-3xl font-extrabold text-ink md:text-4xl">
              Get In Touch
            </h2>
            <ul className="mt-8 space-y-6">
              {PROCESS.map(({ icon: Icon, title, text }) => (
                <li key={title} className="flex items-start gap-4">
                  <span className="grid h-12 w-12 place-items-center rounded-full border-2 border-[#18bcaa] text-[#18bcaa] shrink-0">
                    <Icon size={22} />
                  </span>
                  <div>
                    <div className="font-bold text-ink">{title}</div>
                    <p className="mt-0.5 text-sm text-ink-soft">{text}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* RIGHT — form card */}
          <div className="rounded-2xl overflow-hidden border border-line bg-white shadow-soft">
            <div className="py-4 text-center text-xl font-bold text-white" style={{ background: "#18bcaa" }}>
              Get a Free Quote
            </div>

            {status === "done" ? (
              <div className="flex flex-col items-center justify-center gap-3 p-10 text-center">
                <CheckCircle2 size={56} className="text-[#18bcaa]" />
                <p className="text-lg font-bold text-ink">
                  Quote request received!
                </p>
                <p className="text-sm text-ink-soft">
                  Reference: <span className="font-semibold text-ink">{ref}</span>
                </p>
              </div>
            ) : (
              <form onSubmit={onSubmit} className="space-y-3 p-5">
                <input
                  className={field}
                  placeholder="Name *"
                  required
                  value={f.name}
                  onChange={set("name")}
                />
                <input
                  className={field}
                  type="email"
                  placeholder="Email *"
                  required
                  value={f.email}
                  onChange={set("email")}
                />
                <input
                  className={field}
                  placeholder="Phone *"
                  required
                  value={f.phone}
                  onChange={set("phone")}
                />

                <div className="grid grid-cols-4 gap-2">
                  <input
                    className={field}
                    placeholder="Length (in) *"
                    required
                    value={f.length}
                    onChange={set("length")}
                  />
                  <input
                    className={field}
                    placeholder="Width (in) *"
                    required
                    value={f.width}
                    onChange={set("width")}
                  />
                  <input
                    className={field}
                    placeholder="Depth (in) *"
                    required
                    value={f.depth}
                    onChange={set("depth")}
                  />
                  <input
                    className={field}
                    placeholder="Quantity"
                    value={f.quantity}
                    onChange={set("quantity")}
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <select className={field} value={f.boxType} onChange={set("boxType")}>
                    <option value="">Choose Box Types</option>
                    {categories.map((c) => (
                      <optgroup key={c.slug} label={c.name}>
                        {c.types.map((t) => (
                          <option key={t.slug} value={t.name}>
                            {t.name}
                          </option>
                        ))}
                      </optgroup>
                    ))}
                  </select>

                  <select className={field} value={f.material} onChange={set("material")}>
                    <option value="">Choose Material</option>
                    {MATERIALS.map((m) => (
                      <option key={m} value={m}>
                        {m}
                      </option>
                    ))}
                  </select>

                  <select className={field} value={f.color} onChange={set("color")}>
                    <option value="">Choose Color</option>
                    {COLORS.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>

                  <select className={field} value={f.surface} onChange={set("surface")}>
                    <option value="">Choose Surface</option>
                    {SURFACES.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>

                <input
                  className={field}
                  placeholder="Shipping Country"
                  value={f.country}
                  onChange={set("country")}
                />

                <textarea
                  className="min-h-24 w-full rounded-lg border border-line bg-white px-3 py-2 text-sm outline-none focus:border-brand"
                  placeholder="Additional Requirement"
                  value={f.notes}
                  onChange={set("notes")}
                />

                {status === "error" && (
                  <p className="text-sm font-medium text-red-600">{error}</p>
                )}

                <button
                  type="submit"
                  disabled={status === "sending"}
                  className="w-full rounded-full py-3 text-sm font-bold uppercase tracking-wide text-white transition hover:brightness-95 disabled:opacity-60"
                  style={{ background: "#18bcaa" }}
                >
                  {status === "sending" ? "Sending…" : "Request a Quote"}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
