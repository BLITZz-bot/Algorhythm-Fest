import { motion, useInView } from "framer-motion"
import { useEffect, useState, useRef } from "react"

function Counter({ value, duration = 1.5 }) {
  const [count, setCount] = useState(0)
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true })

  useEffect(() => {
    if (isInView) {
      let start = 0
      const end = parseInt(value)
      const frames = duration * 60
      const increment = Math.ceil(end / frames)

      const timer = setInterval(() => {
        start += increment
        if (start >= end) {
          setCount(end)
          clearInterval(timer)
        } else {
          setCount(start)
        }
      }, 16) // ~60fps

      return () => clearInterval(timer)
    }
  }, [value, duration, isInView])

  return (
    <span ref={ref}>
      ₹ {count.toLocaleString()}
    </span>
  )
}

export default function PrizePool() {
  return (
    <section className="relative py-12 md:py-20 px-6 overflow-hidden flex justify-center items-center">
      {/* Minimal Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-blue-500/10 blur-[80px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        viewport={{ once: true }}
        className="relative z-10 w-full max-w-xl px-6 py-10 md:px-10 md:py-12 rounded-[2rem] bg-white/[0.02] border border-white/10 text-center backdrop-blur-sm"
      >
        <motion.span
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="inline-block text-xs md:text-sm font-semibold text-blue-400 tracking-[0.25em] uppercase mb-4"
        >
          Grand Prize Pool
        </motion.span>

        <div className="text-5xl md:text-7xl font-extrabold mb-6 tracking-tight relative group">
          <span className="bg-gradient-to-r from-cyan-300 via-blue-500 to-indigo-600 bg-clip-text text-transparent drop-shadow-[0_0_15px_rgba(59,130,246,0.2)]">
            <Counter value="100000" />
          </span>
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-gray-400 text-sm md:text-base max-w-md mx-auto leading-relaxed font-medium"
        >
          
        </motion.p>

        {/* Elegant Animated Divider */}
        <div className="relative mt-10 h-px w-full max-w-[200px] mx-auto overflow-hidden bg-white/5">
          <motion.div
            initial={{ left: "-100%" }}
            whileInView={{ left: "100%" }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="absolute top-0 w-1/2 h-full bg-gradient-to-r from-transparent via-blue-500/50 to-transparent"
          />
        </div>
      </motion.div>
    </section>
  )
}
