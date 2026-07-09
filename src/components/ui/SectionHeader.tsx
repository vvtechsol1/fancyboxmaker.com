import Link from "next/link";

export default function SectionHeader({
  title,
  subtitle,
  viewAllHref,
  center = false,
}: {
  title: string;
  subtitle?: string;
  viewAllHref?: string;
  center?: boolean;
}) {
  return (
    <div className={`mb-6 flex items-end justify-between gap-4 ${center ? "flex-col text-center" : ""}`}>
      <div className={center ? "mx-auto" : ""}>
        <h2 className="heading-accent text-2xl font-extrabold tracking-tight text-ink font-display md:text-3xl">
          {title}
        </h2>
        {subtitle && <p className="mt-3 text-sm text-ink-soft">{subtitle}</p>}
      </div>
      {viewAllHref && !center && (
        <Link href={viewAllHref} className="shrink-0 text-sm font-semibold text-brand hover:underline">
          View all →
        </Link>
      )}
    </div>
  );
}
