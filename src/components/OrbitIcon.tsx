import iconImg from '../assets/orbit-icon.png'

interface OrbitIconProps {
  size?: number | string
  className?: string
  variant?: 'color' | 'white' | 'dark'
}

export default function OrbitIcon({
  size = 32,
  className = '',
}: OrbitIconProps) {
  return (
    <img
      src={iconImg}
      alt="Orbit"
      style={{ width: size, height: size }}
      className={`object-contain shrink-0 select-none ${className}`}
    />
  )
}
