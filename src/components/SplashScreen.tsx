import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import logoImg from '../assets/orbit-logo-color.png'

interface SplashScreenProps {
  onComplete: () => void
}

const EXPO: [number, number, number, number] = [0.16, 1, 0.3, 1]

export default function SplashScreen({ onComplete }: SplashScreenProps) {
  const [phase, setPhase] = useState(0)

  useEffect(() => {
    const t = [
      setTimeout(() => setPhase(1), 300),
      setTimeout(() => setPhase(2), 2600),
      setTimeout(onComplete, 3200),
    ]
    return () => t.forEach(clearTimeout)
  }, [onComplete])

  return (
    <motion.div
      className="fixed inset-0 z-[9999] bg-white flex items-center justify-center overflow-hidden"
      animate={{ opacity: phase === 2 ? 0 : 1 }}
      transition={{ duration: 0.6, ease: 'easeInOut' }}
    >
      <motion.div
        className="flex items-center justify-center p-6"
        initial={{ opacity: 0, scale: 0.82, filter: 'blur(12px)' }}
        animate={{
          opacity: phase >= 1 ? 1 : 0,
          scale: phase >= 1 ? 1 : 0.82,
          filter: phase >= 1 ? 'blur(0px)' : 'blur(12px)',
        }}
        transition={{
          opacity: { duration: 0.65, ease: EXPO },
          scale: { duration: 0.9, ease: EXPO },
          filter: { duration: 0.7, ease: 'easeOut' },
        }}
      >
        <img
          src={logoImg}
          alt="Orbit"
          className="h-16 sm:h-20 w-auto object-contain select-none"
        />
      </motion.div>
    </motion.div>
  )
}
