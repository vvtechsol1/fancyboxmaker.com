import { Truck, RefreshCw, Wallet, BadgeCheck } from "lucide-react";
import { valueProps } from "@/lib/site";

const ICONS = { truck: Truck, refresh: RefreshCw, wallet: Wallet, badge: BadgeCheck } as const;

export default function TrustBar() {
  return (
    <section className="border-y border-line bg-surface">
      <div className="container-x grid grid-cols-2 gap-4 py-8 md:grid-cols-4">
        {valueProps.map((v) => {
          const Icon = ICONS[v.icon as keyof typeof ICONS] ?? BadgeCheck;
          return (
            <div key={v.title} className="flex items-center gap-3">
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-brand-soft text-brand">
                <Icon size={20} />
              </span>
              <div>
                <p className="text-sm font-bold text-ink">{v.title}</p>
                <p className="text-xs text-ink-soft">{v.text}</p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
