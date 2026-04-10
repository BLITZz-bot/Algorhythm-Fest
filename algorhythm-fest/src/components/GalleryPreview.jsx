import { useState } from "react"
import GalleryModal from "./GalleryModal"
import { motion } from "framer-motion"
import StarBackground from "./StarBackground"

export default function GalleryPreview() {
  const [open, setOpen] = useState(false)

  return (
    <section id="gallery" className="py-28 px-6">
      <div className="max-w-6xl mx-auto text-center">

        {/* ⭐ STARS BACKGROUND - Handled globally in App.jsx */}

        {/* Title */}
        <motion.h2
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-4xl md:text-5xl font-bold mb-12
          bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400
          bg-clip-text text-transparent"
        >
          Gallery
        </motion.h2>

        {/* YouTube Video Section */}
        <div className="mb-12 rounded-2xl overflow-hidden shadow-lg shadow-purple-500/20 border border-white/10 w-full max-w-4xl mx-auto aspect-video relative group">
          <iframe
            width="100%"
            height="100%"
            src="https://www.youtube.com/embed/XyraaZhT-n4?rel=0"
            title="YouTube video player"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            className="w-full h-full"
          ></iframe>
          {/* <div className="absolute top-2 left-2 bg-black/70 backdrop-blur-sm text-pink-400 text-xs px-3 py-1 rounded-full border border-pink-500/30 opacity-80 group-hover:opacity-100 transition">
            Replace "dQw4w9WgXcQ" in code with your Video ID
          </div> */}
        </div>

        {/* Preview images */}
        <div className="grid md:grid-cols-3 gap-6">
          <img src="/Gallery/img1.JPG" className="rounded-2xl h-60 w-full object-cover shadow-[0_0_15px_rgba(255,255,255,0.05)]" />
          <img src="/Gallery/img2.JPG" className="rounded-2xl h-60 w-full object-cover shadow-[0_0_15px_rgba(255,255,255,0.05)]" />
          <img src="/Gallery/img3.JPG" className="rounded-2xl h-60 w-full object-cover shadow-[0_0_15px_rgba(255,255,255,0.05)]" />
        </div>

        {/* Button */}
        <div className="mt-12">
          <button
            onClick={() => setOpen(true)}
            className="px-10 py-4 rounded-xl bg-gradient-to-r from-pink-500 to-purple-600
            font-semibold text-lg shadow-lg shadow-purple-700/40
            hover:shadow-purple-500/80 hover:scale-105 transition"
          >
            View Gallery
          </button>
        </div>

      </div>

      {/* Modal */}
      <GalleryModal open={open} onClose={() => setOpen(false)} />
    </section>
  )
}
