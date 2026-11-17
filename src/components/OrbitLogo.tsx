import OrbitIcon from './OrbitIcon'

interface OrbitLogoProps {
  className?: string
  variant?: 'color' | 'white' | 'dark'
  iconOnly?: boolean
  size?: 'sm' | 'md' | 'lg'
  showTagline?: boolean
  showBadge?: boolean
}

export default function OrbitLogo({
  className = '',
  variant = 'color',
  iconOnly = false,
  size = 'md',
  showTagline = true,
  showBadge = true,
}: OrbitLogoProps) {
  const iconPixelSizes = {
    sm: 24,
    md: 32,
    lg: 44,
  }

  const isWhite = variant === 'white'

  if (iconOnly) {
    return <OrbitIcon size={iconPixelSizes[size]} variant={variant} className={className} />
  }

  return (
    <div className={`inline-flex items-center gap-2.5 select-none ${className}`}>
      <OrbitIcon size={iconPixelSizes[size]} variant={variant} />
      <div className="flex flex-col justify-center leading-none">
        <div className="flex items-center gap-1.5">
          <span
            className={`font-black tracking-[0.14em] uppercase ${
              size === 'sm' ? 'text-sm' : size === 'lg' ? 'text-2xl' : 'text-lg'
            } ${isWhite ? 'text-white' : 'text-neutral-900'}`}
            style={{ fontFamily: "'Roboto', system-ui, sans-serif" }}
          >
            ORBIT
          </span>
          {showBadge && (
            <span
              className={`rounded px-1.5 py-0.5 text-[9px] font-bold tracking-wider uppercase ${
                isWhite
                  ? 'bg-white/20 text-white'
                  : 'bg-[#ef3340] text-white'
              }`}
            >
              OPS
            </span>
          )}
        </div>
        {showTagline && (
          <span
            className={`text-[8px] font-semibold tracking-[0.24em] uppercase mt-0.5 ${
              isWhite ? 'text-white/70' : 'text-neutral-400'
            }`}
          >
            Command Center
          </span>
        )}
      </div>
    </div>
  )
}
