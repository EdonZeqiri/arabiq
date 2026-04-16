interface ProgressRingProps {
  progress: number; // 0–100
  size?: number;
  stroke?: number;
  label?: string;
  color?: string;
  trackColor?: string;
  className?: string;
}

export function ProgressRing({
  progress,
  size = 40,
  stroke = 4,
  label,
  color = '#059669',
  trackColor = 'rgba(148,163,184,0.25)',
  className,
}: ProgressRingProps) {
  const clamped = Math.max(0, Math.min(100, progress));
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (clamped / 100) * circumference;

  return (
    <div
      className={`relative inline-flex items-center justify-center ${className ?? ''}`}
      style={{ width: size, height: size }}
    >
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={trackColor}
          strokeWidth={stroke}
          fill="none"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth={stroke}
          strokeLinecap="round"
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{ transition: 'stroke-dashoffset 400ms ease' }}
        />
      </svg>
      {label !== undefined && (
        <span
          className="absolute inset-0 flex items-center justify-center font-semibold"
          style={{ fontSize: Math.max(10, size * 0.28) }}
        >
          {label}
        </span>
      )}
    </div>
  );
}
