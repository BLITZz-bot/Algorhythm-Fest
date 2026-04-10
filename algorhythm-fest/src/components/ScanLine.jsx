import { motion } from "framer-motion"

export default function ScanLine() {
  return (
    <div className="pointer-events-none fixed inset-0 z-[5] overflow-hidden">

      <motion.div
        initial={{ y: "-10vh" }}
        animate={{ y: "110vh" }}
        transition={{
          duration: 6,     // smooth slow
          ease: "linear",
          repeat: Infinity,
        }}
        className="absolute left-0 w-full h-[1.5px]"
        style={{
          background:
            "linear-gradient(90deg, transparent, rgba(178, 53, 223, 0.8), transparent)",
          boxShadow:
            "0 0 6px rgba(217, 72, 162, 0.7), 0 0 14px rgba(96,165,250,0.35)",
        }}
      />

    </div>
  )
}
