import { motion, AnimatePresence } from 'framer-motion'
import { useEffect, useState } from 'react'
import boltImg from '../assets/Brisque Icon 1.png'

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
   * 1 → bolt glides in from above            (400ms)
   * 2 → "brisque" glides in from right       (1500ms)
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
        style={{ gap: phase >= 2 ? 12 : 0 }}
        transition={LAYOUT}
      >

        {/* ── Bolt symbol ──
            Drifts in from above: y -30 → 0
            Fades in: opacity 0 → 1
            Scales in gently: 0.7 → 1
            Blur dissolves as it lands
        */}
        <AnimatePresence>
          {phase >= 1 && (
            <motion.div layout transition={LAYOUT}>
              <motion.img
                src={boltImg}
                alt="Brisque"
                className="object-contain select-none"
                style={{ height: 62, width: 'auto' }}
                initial={{ opacity: 0, y: -28, scale: 0.72, filter: 'blur(10px)' }}
                animate={{ opacity: 1, y: 0,   scale: 1,    filter: 'blur(0px)'  }}
                transition={{
                  opacity: { duration: 0.6,  ease: EXPO },
                  y:       { duration: 0.85, ease: EXPO },
                  scale:   { duration: 0.85, ease: EXPO },
                  filter:  { duration: 0.7,  ease: 'easeOut' },
                }}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Brand name ──
            Glides in from the right: x 50 → 0
            Bolt shifts left automatically via layout
        */}
        <AnimatePresence>
          {phase >= 2 && (
            <motion.div
              className="overflow-hidden"
              initial={{ width: 0 }}
              animate={{ width: 'auto' }}
              transition={LAYOUT}
            >
              <motion.span
                className="block whitespace-nowrap font-bold text-[#ef3340]"
                style={{
                  fontSize: 50,
                  letterSpacing: '-2px',
                  fontFamily: 'Georgia, "Times New Roman", serif',
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
                brisque
              </motion.span>
            </motion.div>
          )}
        </AnimatePresence>

      </motion.div>
    </motion.div>
  )
}
