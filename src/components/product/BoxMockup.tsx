import type { Colorway } from "@/data/products";

/**
 * A crisp, branded 3D box mockup used when a product has no real photo.
 * Renders an SVG carton (gradient front + lighter top + darker side) so seeded
 * products still look designed and premium rather than like broken placeholders.
 */
export default function BoxMockup({
  colorway,
  label,
  className = "",
  transparent = false,
}: {
  colorway: Colorway;
  label?: string;
  className?: string;
  /** When true, omit the white tile background so the box sits directly on a colored surface. */
  transparent?: boolean;
}) {
  const id = colorway.name.replace(/[^a-z0-9]/gi, "");
  const light = colorway.to.toLowerCase() === "#ffffff" || colorway.name === "Pearl White";
  const ink = light ? "#0d0f14" : "#ffffff";

  return (
    <div className={`relative h-full w-full ${className}`}>
      <svg viewBox="0 0 320 320" className="h-full w-full" role="img" aria-label={label ? `${label} mockup` : "Custom box"}>
        <defs>
          <linearGradient id={`front-${id}`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor={colorway.from} />
            <stop offset="100%" stopColor={colorway.to} />
          </linearGradient>
          <linearGradient id={`bg-${id}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="100%" stopColor="#f1f3f6" />
          </linearGradient>
          <filter id={`drop-${id}`} x="-30%" y="-30%" width="160%" height="160%">
            <feDropShadow dx="0" dy="18" stdDeviation="16" floodColor="#000000" floodOpacity="0.28" />
          </filter>
        </defs>

        {!transparent && <rect width="320" height="320" fill={`url(#bg-${id})`} />}

        {/* soft contact shadow */}
        <ellipse cx="168" cy="270" rx="96" ry="16" fill="#0d0f14" opacity={transparent ? 0.22 : 0.1} />

        <g filter={transparent ? `url(#drop-${id})` : undefined}>
        {/* right side face (darker) */}
        <polygon points="196,150 244,120 244,228 196,258" fill={colorway.from} />
        <polygon points="196,150 244,120 244,228 196,258" fill="#000000" opacity="0.22" />

        {/* top face (lighter) */}
        <polygon points="96,150 196,150 244,120 144,120" fill={colorway.to} />
        <polygon points="96,150 196,150 244,120 144,120" fill="#ffffff" opacity="0.22" />

        {/* top lid seam */}
        <line x1="170" y1="120" x2="122" y2="150" stroke="#000000" strokeOpacity="0.15" strokeWidth="1.5" />

        {/* front face */}
        <polygon points="96,150 196,150 196,258 96,258" fill={`url(#front-${id})`} />
        <polygon points="96,150 196,150 196,258 96,258" fill="none" stroke="#000000" strokeOpacity="0.08" strokeWidth="1.5" />

        {/* front lid flap line */}
        <line x1="96" y1="150" x2="196" y2="150" stroke="#000000" strokeOpacity="0.12" strokeWidth="1.5" />

        {/* printed label panel on the front */}
        <rect x="112" y="182" width="68" height="30" rx="5" fill={ink} opacity="0.12" />
        <text
          x="146" y="202" textAnchor="middle"
          fontFamily="ui-sans-serif, system-ui, sans-serif" fontWeight="800" fontSize="15"
          fill={ink} opacity="0.9" letterSpacing="1.5"
        >
          FBM
        </text>
        <text
          x="146" y="238" textAnchor="middle"
          fontFamily="ui-sans-serif, system-ui, sans-serif" fontWeight="700" fontSize="8"
          fill={ink} opacity="0.65" letterSpacing="1.5"
        >
          CUSTOM PRINTED
        </text>
        </g>
      </svg>
    </div>
  );
}
