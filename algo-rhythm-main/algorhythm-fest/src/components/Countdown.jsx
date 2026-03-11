import { useEffect, useState } from "react"

export default function Countdown() {
  const festDate = new Date("2026-03-27T09:00:00")

  const calculateTimeLeft = () => {
    const difference = festDate - new Date()
    if (difference <= 0) return null

    return {
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((difference / (1000 * 60)) % 60),
      seconds: Math.floor((difference / 1000) % 60),
    }
  }

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft())

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft())
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  if (!timeLeft) return null

  return (
    <div className="flex justify-center gap-4 mt-6 flex-wrap">
      {Object.entries(timeLeft).map(([label, value]) => (
        <div
          key={label}
          className="bg-white/10 border border-white/20 backdrop-blur-md rounded-xl px-4 py-3 min-w-[70px]"
        >
          <p className="text-2xl font-bold">{value}</p>
          <p className="text-xs uppercase text-gray-300">{label}</p>
        </div>
      ))}
    </div>
  )
}
