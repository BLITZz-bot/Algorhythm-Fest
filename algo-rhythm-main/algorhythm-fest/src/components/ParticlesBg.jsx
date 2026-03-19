import Particles, { initParticlesEngine } from "@tsparticles/react"
import { loadSlim } from "@tsparticles/slim"
import { useEffect, useState } from "react"

export default function ParticlesBg() {
  const [init, setInit] = useState(false)

  useEffect(() => {
    initParticlesEngine(async (engine) => {
      await loadSlim(engine)
    }).then(() => {
      setInit(true)
    })
  }, [])

  if (!init) return null

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">

      {/* Particles */}
      <Particles
        id="tsparticles"
        options={{
          background: { color: "transparent" },
          fpsLimit: 60,
          particles: {
            color: { value: "#a855f7" },
            links: {
              enable: false, // Disabled links to prevent expensive canvas line drawing during scroll
            },
            move: { enable: true, speed: 0.4 },
            number: { 
              value: typeof window !== 'undefined' && window.innerWidth < 768 ? 12 : 25 
            }, 
            opacity: { value: 0.3 },
            size: { value: 2 },
          },
        }}
        className="absolute inset-0"
      />

      {/* Large center glow */}
      <div className="absolute w-[900px] h-[900px] bg-[radial-gradient(circle,rgba(147,51,234,0.15)_0%,transparent_70%)] rounded-full top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-[float_18s_ease-in-out_infinite] will-change-transform" />

      {/* Top right glow */}
      <div className="absolute w-[600px] h-[600px] bg-[radial-gradient(circle,rgba(236,72,153,0.15)_0%,transparent_70%)] rounded-full top-0 right-0 translate-x-1/3 -translate-y-1/3 animate-[float_22s_ease-in-out_infinite] will-change-transform" />

      {/* Bottom left glow */}
      <div className="absolute w-[600px] h-[600px] bg-[radial-gradient(circle,rgba(59,130,246,0.15)_0%,transparent_70%)] rounded-full bottom-0 left-0 -translate-x-1/3 translate-y-1/3 animate-[float_20s_ease-in-out_infinite] will-change-transform" />

    </div>
  )
}
