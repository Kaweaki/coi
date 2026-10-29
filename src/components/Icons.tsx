type IconProps = {
  size?: number
  className?: string
}

const stroke = {
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.25,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
  vectorEffect: 'non-scaling-stroke' as const,
}

export function SearchIcon({ size = 18, className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} className={className} aria-hidden {...stroke}>
      <circle cx="10.8" cy="10.8" r="6.4" />
      <path d="M15.6 15.6 20 20" />
    </svg>
  )
}

export function TreeIcon({ size = 20, className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} className={className} aria-hidden {...stroke}>
      <circle cx="12" cy="4.2" r="1.9" />
      <path d="M12 6.1v2.6" />
      <path d="M5.6 8.7h12.8" />
      <path d="M5.6 8.7v2.4M12 8.7v2.4M18.4 8.7v2.4" />
      <circle cx="5.6" cy="13.2" r="1.9" />
      <circle cx="12" cy="13.2" r="1.9" />
      <circle cx="18.4" cy="13.2" r="1.9" />
      <path d="M12 15.1v2.7" />
      <circle cx="12" cy="20" r="1.9" />
    </svg>
  )
}

export function BookIcon({ size = 20, className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} className={className} aria-hidden {...stroke}>
      <path d="M3.8 5.6c2.6-1.2 5.4-1 8.2.7 2.8-1.7 5.6-1.9 8.2-.7v12.2c-2.6-1.2-5.4-1-8.2.7-2.8-1.7-5.6-1.9-8.2-.7Z" />
      <path d="M12 6.3v12.2" />
    </svg>
  )
}

export function SoundIcon({ size = 16, className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} className={className} aria-hidden {...stroke}>
      <path d="M4.5 9.6h2.8L11.6 6v12L7.3 14.4H4.5Z" />
      <path d="M15 9.4a3.8 3.8 0 0 1 0 5.2" />
      <path d="M17.6 6.8a7.4 7.4 0 0 1 0 10.4" />
    </svg>
  )
}

export function StarIcon({ size = 15, className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} className={className} aria-hidden {...stroke}>
      <path d="m12 4 2.35 4.9 5.15.7-3.75 3.8.9 5.3L12 16.2l-4.65 2.5.9-5.3L4.5 9.6l5.15-.7Z" />
    </svg>
  )
}

export function CloseIcon({ size = 14, className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} className={className} aria-hidden {...stroke}>
      <path d="M6 6 18 18M18 6 6 18" />
    </svg>
  )
}

export function ArrowIcon({ size = 14, className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} className={className} aria-hidden {...stroke}>
      <path d="M7.5 16.5 16.5 7.5" />
      <path d="M9 7.5h7.5V15" />
    </svg>
  )
}

export function ShareIcon({ size = 14, className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} className={className} aria-hidden {...stroke}>
      <path d="M12 14.9V3.7" />
      <path d="M8.3 7.4 12 3.7l3.7 3.7" />
      <path d="M6 11.8v6.6a1.6 1.6 0 0 0 1.6 1.6h8.8a1.6 1.6 0 0 0 1.6-1.6v-6.6" />
    </svg>
  )
}

export function SparkIcon({ size = 13, className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} className={className} aria-hidden {...stroke}>
      <path d="M12 3.5c.7 4.6 3.2 7.1 7.8 7.8-4.6.7-7.1 3.2-7.8 7.8-.7-4.6-3.2-7.1-7.8-7.8 4.6-.7 7.1-3.2 7.8-7.8Z" />
    </svg>
  )
}
