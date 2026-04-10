import { motion } from "framer-motion"

export default function FestivalHeroBg() {
  return (
    <div className="absolute inset-0 -z-10 overflow-hidden">

      {/* Animated gradient beams */}
      <motion.div
        initial={{ rotate: 0 }}
        animate={{ rotate: 360 }}
        transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
        className="absolute w-[800px] h-[800px] sm:w-[1400px] sm:h-[1400px] 
        bg-[conic-gradient(from_0deg,transparent,rgba(168,85,247,0.15),transparent)]
        top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 will-change-transform"
      />

      <motion.div
        initial={{ rotate: 360 }}
        animate={{ rotate: 0 }}
        transition={{ duration: 80, repeat: Infinity, ease: "linear" }}
        className="absolute w-[600px] h-[600px] sm:w-[1200px] sm:h-[1200px] 
        bg-[conic-gradient(from_180deg,transparent,rgba(236,72,153,0.15),transparent)]
        top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 will-change-transform"
      />

      {/* Floating shapes */}
      <motion.div
        animate={{ y: [0, -40, 0] }}
        transition={{ duration: 12, repeat: Infinity }}
        className="absolute w-48 h-48 sm:w-96 sm:h-96 bg-[radial-gradient(circle,rgba(168,85,247,0.15)_0%,transparent_70%)] rounded-full top-[10%] left-[10%] will-change-transform"
      />

      <motion.div
        animate={{ y: [0, 40, 0] }}
        transition={{ duration: 16, repeat: Infinity }}
        className="absolute w-48 h-48 sm:w-96 sm:h-96 bg-[radial-gradient(circle,rgba(236,72,153,0.15)_0%,transparent_70%)] rounded-full bottom-[10%] right-[10%] will-change-transform"
      />

      {/* Radial glow center */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(168,85,247,0.15),transparent_70%)]" />

    </div>
  )
}
