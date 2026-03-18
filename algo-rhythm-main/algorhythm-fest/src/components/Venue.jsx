import { motion } from "framer-motion"

export default function Venue() {
  return (
    <section id="venue" className="min-h-screen px-6 py-20">
      <h2 className="text-4xl md:text-5xl font-bold text-center mb-12">
        Venue
      </h2>

      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-10 items-stretch">

        {/* ===== Venue Info Card ===== */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-120px" }}
          transition={{ duration: 0.55, ease: "easeOut" }}
          className="rounded-2xl p-8 h-full
          bg-[linear-gradient(135deg,rgba(15,23,42,0.9),rgba(10,15,30,0.9))]
          border border-white/10 shadow-lg"
        >
          <h3 className="text-2xl font-semibold mb-4 text-purple-300">
            GOPALAN COLLEGE OF ENGINEERING AND MANAGEMENT
          </h3>

          <p className="text-gray-300">
            Behind SAP Labs, Seetharam Palya, Basavanagar, Hoodi
          </p>
          <p className="text-gray-300 mb-4">
            Bengaluru - 560048
          </p>

          <p className="text-gray-400 text-sm">
            Join us at GOPALAN COLLEGE OF ENGINEERING AND MANAGEMENT to celebrate ALGO-RHYTHM 3.0 togather.
          </p>

          <a
            href="https://maps.google.com/?q=Gopalan+College+of+Engineering+and+Management"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block mt-6 px-6 py-3 rounded-xl
            bg-gradient-to-r from-purple-500 to-blue-500 font-semibold
            hover:scale-105 transition"
          >
            Open in Google Maps
          </a>
        </motion.div>

        {/* ===== Map ===== */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-120px" }}
          transition={{ duration: 0.55, ease: "easeOut" }}
          className="w-full h-full min-h-[350px] rounded-2xl overflow-hidden border border-white/10 relative group z-10"
        >
          {/* Floating Expand Button (Always visible on mobile, hover on desktop) */}
          <a
            href="https://maps.google.com/?q=Gopalan+College+of+Engineering+and+Management"
            target="_blank"
            rel="noopener noreferrer"
            className="absolute top-4 right-4 z-30 px-4 py-2 bg-black/70 backdrop-blur-md rounded-xl text-white text-xs font-bold 
                 border border-white/20 shadow-xl hover:bg-purple-600 transition-all flex items-center gap-2
                 md:opacity-0 md:group-hover:opacity-100"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
            Expand Map
          </a>

          <iframe
            title="venue-map"
            src="https://www.google.com/maps?q=Gopalan+College+of+Engineering+and+Management&output=embed"
            className="w-full h-full border-0"
            loading="lazy"
          />
        </motion.div>
      </div>
    </section>
  )
}
