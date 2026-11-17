import { motion, AnimatePresence } from 'framer-motion'
import { useEffect, useState } from 'react'
import OrbitIcon from './OrbitIcon'

interface SplashScreenProps {
  onComplete: () => void
}

// Smooth expo-out curve — fast start, silky deceleration
const EXPO: [number, number, number, number] = [0.16, 1, 0.3, 1]
const LAYOUT = { duration: 0.75, ease: EXPO }

export default function SplashScreen({ onComplete }: SplashScreenProps) {
  const [phase, setPhase] = useState(0)
  /**
   * 0 → white canvas                         (0ms)
   * 1 → orbit icon glides in from above      (400ms)
   * 2 → "orbit" glides in from right         (1500ms)
   * 3 → fade out                             (3600ms)
   */
  useEffect(() => {
    const t = [
      setTimeout(() => setPhase(1),  400),
      setTimeout(() => setPhase(2), 1500),
      setTimeout(() => setPhase(3), 3600),
      setTimeout(onComplete,        4200),
    ]
    return () => t.forEach(clearTimeout)
  }, [onComplete])

  return (
    <motion.div
      className="fixed inset-0 z-[9999] bg-white flex items-center justify-center overflow-hidden"
      animate={{ opacity: phase === 3 ? 0 : 1 }}
      transition={{ duration: 0.6, ease: 'easeInOut' }}
    >
      <motion.div
        layout
        className="flex items-center"
        style={{ gap: phase >= 2 ? 14 : 0 }}
        transition={LAYOUT}
      >
        {/* ── Orbit icon symbol ── */}
        <AnimatePresence>
          {phase >= 1 && (
            <motion.div layout transition={LAYOUT}>
              <motion.div
                initial={{ opacity: 0, y: -28, scale: 0.72, filter: 'blur(10px)' }}
                animate={{ opacity: 1, y: 0,   scale: 1,    filter: 'blur(0px)'  }}
                transition={{
                  opacity: { duration: 0.6,  ease: EXPO },
                  y:       { duration: 0.85, ease: EXPO },
                  scale:   { duration: 0.85, ease: EXPO },
                  filter:  { duration: 0.7,  ease: 'easeOut' },
                }}
              >
                <OrbitIcon size={64} />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Brand name ── */}
        <AnimatePresence>
          {phase >= 2 && (
            <motion.div
              className="overflow-hidden"
              initial={{ width: 0 }}
              animate={{ width: 'auto' }}
              transition={LAYOUT}
            >
              <div className="flex items-center gap-2">
                <motion.span
                  className="block whitespace-nowrap font-black text-neutral-900 tracking-[0.14em] uppercase"
                  style={{
                    fontSize: 48,
                    fontFamily: "'Roboto', system-ui, sans-serif",
                    lineHeight: 1,
                  }}
                  initial={{ opacity: 0, x: 50, filter: 'blur(8px)' }}
                  animate={{ opacity: 1, x: 0,  filter: 'blur(0px)' }}
                  transition={{
                    opacity: { duration: 0.55, ease: EXPO },
                    x:       { duration: 0.75, ease: EXPO },
                    filter:  { duration: 0.65, ease: 'easeOut' },
                    delay: 0.05,
                  }}
                >
                  ORBIT
                </motion.span>
                <motion.span
                  className="rounded-md bg-[#ef3340] text-white px-2 py-0.5 text-xs font-bold tracking-wider uppercase"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.25, duration: 0.4 }}
                >
                  OPS
                </motion.span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  )
}
