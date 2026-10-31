import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

type Segment = {
  value: number
  color: string
}

type Props = {
  segments: Segment[]
  size?: number
  strokeWidth?: number
  centerValue: string | number
  centerLabel: string
}

export default function DonutChart({
  segments,
  size = 180,
  strokeWidth = 16,
  centerValue,
  centerLabel,
}: Props) {
  const [progress, setProgress] = useState(0)

  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius

  // Filter only segments with positive values
  const activeSegments = segments.filter((s) => s.value > 0)
  const total = activeSegments.reduce((sum, s) => sum + s.value, 0)

  // Smooth ease-out animation on mount or when data changes
  useEffect(() => {
    let frameId: number
    const startTime = performance.now()
    const duration = 1200 // 1.2s smooth animation

    function animate(now: number) {
      const elapsed = now - startTime
      const raw = Math.min(elapsed / duration, 1)
      // Ease-out cubic: 1 - (1 - t)^3
      const eased = 1 - Math.pow(1 - raw, 3)
      setProgress(eased)

      if (raw < 1) {
        frameId = requestAnimationFrame(animate)
      }
    }

    frameId = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(frameId)
  }, [total, centerValue])

  // Count up center value if numeric
  const numericValue = typeof centerValue === 'number' ? centerValue : parseFloat(centerValue)
  const isNumeric = !isNaN(numericValue)
  const displayedValue = isNumeric
    ? Math.round(numericValue * progress)
    : centerValue

  // Check if there is only 1 segment (e.g. 100% completed)
  const isSingleFull =
    activeSegments.length === 1 ||
    (activeSegments.length > 0 && activeSegments[0].value === total)

  // Pre-calculate segment geometry without mutating during render
  const segmentGap = isSingleFull ? 0 : Math.min(circumference * 0.02, 6)

  let cumulativeFraction = 0
  const computedSegments = activeSegments.map((segment) => {
    const fraction = total > 0 ? segment.value / total : 0
    const rawDash = fraction * circumference
    const dash = Math.max(0, (isSingleFull ? rawDash : rawDash - segmentGap) * progress)
    const offset = -cumulativeFraction * circumference * progress
    cumulativeFraction += fraction

    return {
      ...segment,
      fraction,
      dash,
      offset,
    }
  })

  return (
    <div
      className="relative flex items-center justify-center select-none"
      style={{ width: size, height: size }}
    >
      <svg
        width={size}
        height={size}
        className="-rotate-90 overflow-visible"
        style={{ transformOrigin: 'center' }}
      >
        {/* Background Track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#eef0f2"
          strokeWidth={strokeWidth}
        />

        {/* When 100% full and animation is complete, render seamless circle with 0 gap/notch */}
        {isSingleFull && progress >= 0.999 ? (
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={activeSegments[0]?.color || '#4caf60'}
            strokeWidth={strokeWidth}
          />
        ) : (
          /* Animated stroke segment(s) */
          computedSegments.map((seg, i) => (
            <circle
              key={i}
              cx={size / 2}
              cy={size / 2}
              r={radius}
              fill="none"
              stroke={seg.color}
              strokeWidth={strokeWidth}
              strokeDasharray={`${seg.dash} ${circumference}`}
              strokeDashoffset={seg.offset}
              strokeLinecap="round"
            />
          ))
        )}
      </svg>

      {/* Center Value & Label */}
      <motion.div
        initial={{ opacity: 0, scale: 0.88 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="absolute flex flex-col items-center justify-center text-center pointer-events-none"
      >
        <span
          className={`font-bold leading-none text-neutral-900 ${
            size < 140 ? 'text-[28px]' : 'text-3xl'
          }`}
        >
          {displayedValue}
        </span>
        <span
          className={`mt-1 font-medium text-neutral-500 ${
            size < 140 ? 'text-[11px]' : 'text-xs'
          }`}
        >
          {centerLabel}
        </span>
      </motion.div>
    </div>
  )
}
