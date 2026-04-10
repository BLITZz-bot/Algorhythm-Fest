import { motion, useMotionValue } from "framer-motion"
import { useEffect } from "react"

export default function CursorGlow() {
  const x = useMotionValue(0)
  const y = useMotionValue(0)

  useEffect(() => {
    const move = (e) => {
      x.set(e.clientX)
      y.set(e.clientY)
    }
    window.addEventListener("mousemove", move)
    return () => window.removeEventListener("mousemove", move)
  }, [])

  return (
    <motion.div
      className="hidden md:block pointer-events-none fixed top-0 left-0 w-40 h-40 rounded-full bg-[radial-gradient(circle,rgba(168,85,247,0.3)_0%,transparent_70%)] -translate-x-1/2 -translate-y-1/2 z-30 will-change-transform"
      style={{ x, y }}
    />
  )
}
