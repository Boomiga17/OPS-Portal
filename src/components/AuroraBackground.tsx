import backgroundImage from '../assets/bg.png'

export default function AuroraBackground() {
  return (
    <div
      className="absolute inset-0 overflow-hidden bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: `url(${backgroundImage})` }}
      aria-hidden="true"
    >
      <div className="absolute inset-0 bg-black/10" />
    </div>
  )
}
