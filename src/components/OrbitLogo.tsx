import logoColor from '../assets/orbit-logo-color.png'
import logoWhiteText from '../assets/orbit-logo-white-text.png'
import logoAllWhite from '../assets/orbit-logo-all-white.png'
import OrbitIcon from './OrbitIcon'

interface OrbitLogoProps {
  className?: string
  variant?: 'color' | 'white' | 'dark'
  iconOnly?: boolean
  size?: 'sm' | 'md' | 'lg'
}

export default function OrbitLogo({
  className = '',
  variant = 'color',
  iconOnly = false,
  size = 'md',
}: OrbitLogoProps) {
  if (iconOnly) {
    const iconSizes = { sm: 26, md: 34, lg: 46 }
    return <OrbitIcon size={iconSizes[size]} className={className} />
  }

  const sizeClasses = {
    sm: 'h-6 sm:h-7',
    md: 'h-8 sm:h-9',
    lg: 'h-11 sm:h-12',
  }

  let src = logoColor
  if (variant === 'white') {
    src = logoAllWhite
  } else if (variant === 'dark') {
    src = logoWhiteText
  }

  return (
    <img
      src={src}
      alt="Orbit"
      className={`object-contain select-none w-auto ${sizeClasses[size]} ${className}`}
    />
  )
}
