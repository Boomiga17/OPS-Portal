import OrbitLogo from './OrbitLogo'

type Props = {
  className?: string
  variant?: 'light' | 'dark' | 'color' | 'white'
}

export default function BrisqueLogo({ className = '', variant = 'color' }: Props) {
  return <OrbitLogo className={className} variant={variant === 'light' ? 'white' : variant} />
}
