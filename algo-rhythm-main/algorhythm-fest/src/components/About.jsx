import { motion } from "framer-motion"

export default function About() {
  return (
    <motion.section
      id="about"
      initial={{ opacity: 0, y: 80 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.9, ease: "easeOut" }}
      className="relative py-24 px-6"
    >
      {/* Background glows */}
      <div className="absolute inset-0 pointer-events-none">

        {/* Center glow */}
        <div className="absolute w-[500px] h-[500px] bg-[radial-gradient(circle,rgba(147,51,234,0.15)_0%,transparent_70%)] rounded-full left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 animate-[float_18s_ease-in-out_infinite] will-change-transform" />

        {/* Secondary glow */}
        <div className="absolute w-[400px] h-[400px] bg-[radial-gradient(circle,rgba(236,72,153,0.15)_0%,transparent_70%)] rounded-full right-0 top-0 translate-x-1/3 -translate-y-1/3 animate-[float_22s_ease-in-out_infinite] will-change-transform" />

      </div>

      <div className="relative max-w-4xl mx-auto">

        {/* Title */}
        <motion.h2
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-4xl md:text-5xl font-bold text-center mb-12 bg-gradient-to-r from-pink-400 via-purple-300 to-blue-400 bg-clip-text text-transparent"
        >
          About us
        </motion.h2>

        {/* Glass Card */}
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9 }}
          whileHover={{ y: -6, scale: 1.01 }}
          className="bg-white/10 border border-white/20 backdrop-blur-xl rounded-3xl p-8 md:p-12 text-center shadow-xl hover:shadow-purple-500/20 transition"
        >
          <p className="text-gray-200 text-lg leading-relaxed">
            ALGO-RHYTHM 3.0 is an annual techno-cultural fest of the Department of CSE and CSE (AI & ML), Gopalan College of Engineering & Management, celebrating innovation, creativity, and collaboration. Over two dynamic days, students engage in exciting technical competitions, cultural performances, creative challenges, and gaming events. The fest provides a vibrant platform for participants to showcase their coding skills, artistic talents, strategic thinking, and teamwork, while fostering learning, networking, and fun.
          </p>
        </motion.div>

      </div>
      {/* Subtle Bottom Right Watermark */}
      {/* <div className="absolute bottom-2 right-4 opacity-80 pointer-events-none select-none">
        <span className="text-[10px] font-black tracking-[0.3em] bg-clip-text text-transparent bg-gradient-to-r from-gray-500 to-gray-400">GRAFIK</span>
      </div> */}
    </motion.section>
  )
}
