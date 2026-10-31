import { useEffect, useState } from 'react'

type Props = {
  percent: number
  size?: number
  strokeWidth?: number
  color?: string
  trackColor?: string
  label: string
  value: string
}

export default function CircularProgress({
  percent,
  size = 180,
  strokeWidth = 16,
  color = '#e0122b',
  trackColor = '#f3d9dc',
  label,
  value,
}: Props) {
  const [animatedPercent, setAnimatedPercent] = useState(0)
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const dash = (animatedPercent / 100) * circumference
  const percentageValue = value.match(/^(\d+(?:\.\d+)?)%$/)
  const animatedValue = percentageValue
    ? `${animatedPercent.toFixed(percentageValue[1].includes('.') ? 1 : 0)}%`
    : value

  useEffect(() => {
    const startTime = performance.now()
    let frame = 0

    function animate(now: number) {
      const progress = Math.min((now - startTime) / 1200, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setAnimatedPercent(percent * eased)
      if (progress < 1) frame = requestAnimationFrame(animate)
    }

    frame = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(frame)
  }, [percent])

  return (
    <div
      className="relative flex items-center justify-center"
      style={{ width: size, height: size }}
    >
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={trackColor}
          strokeWidth={strokeWidth}
        />
        {percent >= 100 && animatedPercent >= 99.9 ? (
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth={strokeWidth}
          />
        ) : (
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth={strokeWidth}
            strokeDasharray={`${dash} ${circumference}`}
            strokeLinecap="round"
          />
        )}
      </svg>
      <div className="absolute flex flex-col items-center justify-center text-center">
        <span className={`${size < 140 ? 'text-[22px]' : 'text-3xl'} font-bold text-neutral-900 leading-none`}>{animatedValue}</span>
        <span className={`text-neutral-500 mt-0.5 ${size < 140 ? 'text-[9px]' : 'text-xs'}`}>{label}</span>
      </div>
    </div>
  )
}
