import { useEffect, useState } from "react"

export default function CountdownSciFi() {
  const target = new Date("2026-04-10T09:00:00")

  const calc = () => {
    const now = new Date()
    const diff = target - now

    return {
      d: Math.floor(diff / (1000 * 60 * 60 * 24)),
      h: Math.floor((diff / (1000 * 60 * 60)) % 24),
      m: Math.floor((diff / (1000 * 60)) % 60),
      s: Math.floor((diff / 1000) % 60),
    }
  }

  const [t, setT] = useState(calc())

  useEffect(() => {
    const i = setInterval(() => setT(calc()), 1000)
    return () => clearInterval(i)
  }, [])

  const Box = ({ v, l, highlight }) => (
    <div
      className={`
        w-20 h-24 md:w-24 md:h-28
        rounded-xl border
        backdrop-blur-xl
        flex flex-col items-center justify-center
        ${highlight
          ? "border-pink-500/60 text-pink-400 shadow-[0_0_20px_rgba(236,72,153,0.4)]"
          : "border-blue-400/40 text-blue-200"}
      `}
    >
      <span className="text-3xl md:text-4xl font-mono font-bold">
        {String(v).padStart(2, "0")}
      </span>
      <span className="text-[10px] tracking-widest opacity-70 mt-1">
        {l}
      </span>
    </div>
  )

  return (
    <div className="flex gap-4">
      <Box v={t.d} l="DAYS" />
      <Box v={t.h} l="HOURS" />
      <Box v={t.m} l="MINS" />
      <Box v={t.s} l="SECS" highlight />
    </div>
  )
}
