import { Star } from "lucide-react";

export default function Stars({
  rating,
  size = 14,
  showValue = false,
  reviews,
}: {
  rating: number;
  size?: number;
  showValue?: boolean;
  reviews?: number;
}) {
  return (
    <div className="flex items-center gap-1">
      <div className="flex items-center">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            size={size}
            className={i < Math.round(rating) ? "fill-[var(--color-gold)] text-[var(--color-gold)]" : "fill-neutral-200 text-neutral-200"}
          />
        ))}
      </div>
      {showValue && <span className="text-xs font-medium text-ink-soft">{rating.toFixed(1)}</span>}
      {reviews != null && <span className="text-xs text-ink-soft">({reviews})</span>}
    </div>
  );
}
