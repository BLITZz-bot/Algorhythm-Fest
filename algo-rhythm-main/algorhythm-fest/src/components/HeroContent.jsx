import Countdown from "./Countdown"

export default function HeroContent() {
  return (
    <section className="min-h-screen flex items-center justify-center px-6 text-center">
      <div className="max-w-4xl mx-auto">

        <h1 className="text-5xl md:text-7xl font-extrabold mb-6 
        bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400
        bg-clip-text text-transparent">
          ALGO-RHYTHM 3.0
        </h1>

        <p className="text-xl md:text-3xl text-purple-200 mb-2">
          APRIL 10 and 11
        </p>

        <p className="text-xl md:text-2xl text-purple-200 mb-4">
          2026
        </p>

        <p className="text-lg md:text-xl text-gray-300 mb-10">
          GOPALAN COLLEGE OF ENGINEERING AND MANAGEMENT
        </p>

        <Countdown />

        <div className="mt-12 flex gap-4 justify-center flex-wrap">
          <a
            href="#events"
            className="px-8 py-3 rounded-xl bg-gradient-to-r from-pink-500 to-purple-600 font-semibold shadow-lg shadow-purple-700/40 hover:scale-105 transition"
          >
            View Gallery
          </a>
        </div>

      </div>
    </section>
  )
}
