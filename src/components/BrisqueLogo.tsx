import whiteLogo from '../assets/white logo.png'

type Props = {
  className?: string
  variant?: 'light' | 'dark'
}

export default function BrisqueLogo({ className = '' }: Props) {
  return <img src={whiteLogo} alt="brisque" className={`w-24 ${className}`} />
}
