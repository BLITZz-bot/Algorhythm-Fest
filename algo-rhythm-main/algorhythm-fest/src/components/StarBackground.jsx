import { motion } from "framer-motion"

export default function StarBackground() {
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768
  const stars = Array.from({ length: isMobile ? 40 : 120 })

  return (
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden transform-gpu">
      {stars.map((_, i) => {
        const size = Math.random() * 2.5 + 1
        const duration = 6 + Math.random() * 8
        const delay = Math.random() * 10

        return (
          <motion.div
            key={i}
            className="absolute rounded-full bg-cyan-200 will-change-transform"
            style={{
              width: size,
              height: size,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              // Removed expensive box-shadow completely for scroll performance
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0.2, 0.8, 0.2],
            }}
            transition={{
              duration,
              repeat: Infinity,
              delay,
              ease: "linear",
            }}
          />
        )
      })}
    </div>
  )
}
