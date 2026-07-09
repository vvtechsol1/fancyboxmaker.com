import Link from "next/link";

export default function NotFound() {
  return (
    <div className="container-x py-24 text-center">
      <p className="text-sm font-semibold uppercase tracking-wide text-brand">404</p>
      <h1 className="mt-2 text-4xl font-extrabold tracking-tight text-ink font-display">Page not found</h1>
      <p className="mt-3 text-ink-soft">The page you're looking for doesn't exist or has moved.</p>
      <Link href="/" className="mt-7 inline-flex rounded-full bg-brand px-6 py-3 font-semibold text-white shadow-[var(--shadow-brand)] hover:bg-brand-dark">
        Back to Home
      </Link>
    </div>
  );
}
