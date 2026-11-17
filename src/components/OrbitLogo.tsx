import OrbitIcon from './OrbitIcon'

interface OrbitLogoProps {
  className?: string
  variant?: 'color' | 'white' | 'dark'
  iconOnly?: boolean
  size?: 'sm' | 'md' | 'lg'
  showTagline?: boolean
}

export default function OrbitLogo({
  className = '',
  variant = 'color',
  iconOnly = false,
  size = 'md',
  showTagline = true,
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
        <span
          className={`font-black tracking-[0.14em] uppercase ${
            size === 'sm' ? 'text-sm' : size === 'lg' ? 'text-2xl' : 'text-lg'
          } ${isWhite ? 'text-white' : 'text-neutral-900'}`}
          style={{ fontFamily: "'Roboto', system-ui, sans-serif" }}
        >
          ORBIT
        </span>
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
