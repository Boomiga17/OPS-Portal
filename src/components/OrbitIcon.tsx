import type { SVGProps } from 'react'

interface OrbitIconProps extends SVGProps<SVGSVGElement> {
  size?: number | string
  variant?: 'color' | 'white' | 'dark'
}

export default function OrbitIcon({
  size = 32,
  variant = 'color',
  className = '',
  ...props
}: OrbitIconProps) {
  const isWhite = variant === 'white'
  const isDark = variant === 'dark'

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`shrink-0 ${className}`}
      {...props}
    >
      <defs>
        {/* Core sphere gradient */}
        <radialGradient id={`orbit-core-${variant}`} cx="38%" cy="32%" r="65%">
          <stop offset="0%" stopColor={isWhite ? '#ffffff' : '#ff5469'} />
          <stop offset="55%" stopColor={isWhite ? '#f3f4f6' : '#e0122b'} />
          <stop offset="100%" stopColor={isWhite ? '#e5e7eb' : '#99091b'} />
        </radialGradient>

        {/* Primary ring gradient */}
        <linearGradient id={`orbit-ring1-${variant}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={isWhite ? '#ffffff' : '#ef3340'} stopOpacity="0.95" />
          <stop offset="50%" stopColor={isWhite ? '#ffffff' : '#ff7a88'} stopOpacity="0.45" />
          <stop offset="100%" stopColor={isWhite ? '#ffffff' : '#c00a20'} stopOpacity="0.95" />
        </linearGradient>

        {/* Secondary tilted ring gradient */}
        <linearGradient id={`orbit-ring2-${variant}`} x1="100%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={isWhite ? '#ffffff' : '#ff8591'} stopOpacity="0.9" />
          <stop offset="60%" stopColor={isWhite ? '#ffffff' : '#ef3340'} stopOpacity="0.3" />
          <stop offset="100%" stopColor={isWhite ? '#ffffff' : '#b3091e'} stopOpacity="0.95" />
        </linearGradient>

        {/* Outer glow filter */}
        <filter id={`orbit-glow-${variant}`} x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>

      {/* Orbit Ring 1 Back-arc (behind the planet) */}
      <g transform="translate(50, 50) rotate(-28)">
        <ellipse
          cx="0"
          cy="0"
          rx="42"
          ry="15"
          stroke={isWhite ? '#ffffff' : `url(#orbit-ring1-${variant})`}
          strokeWidth="3.4"
          strokeLinecap="round"
          strokeDasharray="135 30"
          fill="none"
          opacity={isDark ? 0.9 : 1}
        />
      </g>

      {/* Orbit Ring 2 (tilted counter-orbit) */}
      <g transform="translate(50, 50) rotate(50)">
        <ellipse
          cx="0"
          cy="0"
          rx="38"
          ry="13"
          stroke={isWhite ? '#ffffff' : `url(#orbit-ring2-${variant})`}
          strokeWidth="2.4"
          strokeDasharray="105 32"
          fill="none"
          opacity={isWhite ? 0.75 : 0.75}
        />
      </g>

      {/* Central Planet Nucleus */}
      <circle
        cx="50"
        cy="50"
        r="17.5"
        fill={`url(#orbit-core-${variant})`}
        filter={isWhite ? undefined : `url(#orbit-glow-${variant})`}
      />

      {/* Celestial light highlight */}
      <circle
        cx="44"
        cy="43.5"
        r="5.5"
        fill="#ffffff"
        opacity={isWhite ? 0.45 : 0.6}
      />

      {/* Orbit Ring 1 Front-arc (cuts in front of core for real 3D depth) */}
      <g transform="translate(50, 50) rotate(-28)">
        <path
          d="M -39,6 A 42 15 0 0 0 39 5"
          stroke={isWhite ? '#ffffff' : `url(#orbit-ring1-${variant})`}
          strokeWidth="3.4"
          strokeLinecap="round"
          fill="none"
        />

        {/* Satellite Node on Ring 1 */}
        <circle
          cx="38"
          cy="5"
          r="4.2"
          fill="#ffffff"
          stroke={isWhite ? '#ef3340' : '#c00a20'}
          strokeWidth="2"
        />
      </g>

      {/* Satellite Node on Ring 2 */}
      <g transform="translate(50, 50) rotate(50)">
        <circle
          cx="-34"
          cy="-5"
          r="3"
          fill={isWhite ? '#ffffff' : '#ff4d61'}
        />
      </g>
    </svg>
  )
}
