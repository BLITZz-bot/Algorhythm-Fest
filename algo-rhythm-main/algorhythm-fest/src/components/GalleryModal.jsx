import { motion } from "framer-motion"

export default function GalleryModal({ open, onClose }) {
  if (!open) return null

const images = [
  "/Gallery/img1.JPG",
  "/Gallery/img2.JPG",
  "/Gallery/img3.JPG",
  "/Gallery/img4.JPG",
  "/Gallery/img5.JPG",
  "/Gallery/img6.JPG",
]


  return (
    <motion.div
      className="fixed inset-0 bg-black/95 backdrop-blur-xl z-[100] p-6 overflow-y-auto"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      {/* Close button */}
      <button
        onClick={onClose}
        className="fixed top-6 right-6 text-3xl text-white hover:text-purple-400"
      >
        ✕
      </button>

      <div className="max-w-6xl mx-auto mt-20 grid md:grid-cols-3 gap-6">
        {images.map((src, i) => (
          <motion.img
            key={i}
            src={src}
            className="rounded-2xl object-cover w-full h-72"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.05 }}
          />
        ))}
      </div>
    </motion.div>
  )
}
