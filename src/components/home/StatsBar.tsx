/**
 * Dark full-bleed band of headline stats/social-proof pills.
 * Server component — purely presentational.
 */
const STATS: { value: string; label: string; bg: string }[] = [
  { value: "12K+", label: "Orders Done", bg: "bg-brand" },
  { value: "98%", label: "Positive Rating", bg: "bg-green" },
  { value: "3.5K+", label: "Trusted Clients", bg: "bg-brand" },
  { value: "4.9★", label: "Trustpilot Rating", bg: "bg-brand" },
];

export default function StatsBar() {
  return (
    <section className="bg-brand-dark py-10">
      <div className="container-x">
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {STATS.map((s) => (
            <div
              key={s.label}
              className={`flex flex-col items-center justify-center rounded-xl py-5 text-center ${s.bg}`}
            >
              <div className="text-3xl font-extrabold text-white">{s.value}</div>
              <div className="mt-1 text-sm text-white/80">{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
