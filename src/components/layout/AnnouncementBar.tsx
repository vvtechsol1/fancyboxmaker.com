import { announcements } from "@/lib/site";

export default function AnnouncementBar() {
  const items = [...announcements, ...announcements];
  return (
    <div className="overflow-hidden bg-brand text-white">
      <div className="flex w-max animate-marquee gap-10 py-2 text-xs font-medium">
        {items.map((a, i) => (
          <span key={i} className="flex items-center gap-2 whitespace-nowrap">
            {a}
            <span className="text-white/50">•</span>
          </span>
        ))}
      </div>
    </div>
  );
}
