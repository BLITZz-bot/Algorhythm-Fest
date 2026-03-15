import { motion } from "framer-motion"
import { useMemo } from "react"

export default function StarBackground() {
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768
  
  const stars = useMemo(() => {
    const count = isMobile ? 40 : 120
    return Array.from({ length: count }).map(() => ({
      size: Math.random() * 2.5 + 1,
      duration: 6 + Math.random() * 8,
      delay: Math.random() * 10,
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
    }))
  }, [isMobile])

  return (
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden transform-gpu">
      {stars.map((star, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full bg-cyan-200 will-change-transform"
          style={{
            width: star.size,
            height: star.size,
            left: star.left,
            top: star.top,
          }}
          animate={{
            y: [0, -30, 0],
            opacity: [0.2, 0.8, 0.2],
          }}
          transition={{
            duration: star.duration,
            repeat: Infinity,
            delay: star.delay,
            ease: "linear",
          }}
        />
      ))}
    </div>
  )
}
