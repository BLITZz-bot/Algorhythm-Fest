import { motion } from "framer-motion"

export default function HeroVideo() {
  return (
    <div className="absolute inset-0 overflow-hidden z-0">

      {/* ===== DESKTOP VIDEO ===== */}
      <video
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        poster="/enry.jpeg"
        className="
          hidden md:block
          absolute inset-0
          w-full h-full
          object-cover
          pointer-events-none
          transform-gpu will-change-transform
        "
      >
        <source src="/hero.mp4" type="video/mp4" />
      </video>
      {/* ===== DESKTOP LOGO (TOP RIGHT) ===== */}
      <motion.div
        initial={{
          x: -1200,
          y: -16,
          z: 0,
          opacity: 0,
          filter: 'blur(10px)'
        }}
        animate={{
          opacity: 1,
          filter: 'blur(0px)',
          // --- CHANGE DESKTOP LOGO POSITION HERE ---
          x: -1200,
          y: -16,
          z: 0,
          // ------------------------------------------
        }}
        transition={{
          opacity: { duration: 1.5, ease: "easeOut" },
          filter: { duration: 1.5, ease: "easeOut" },
        }}
        className="hidden md:block absolute top-8 right-8 z-20"
      >
        <img
          src="/gopalanlogo.png"
          alt="Gopalan College Logo"
          className="w-48 h-auto drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]"
        />
      </motion.div>

      {/* ===== MOBILE VIDEO BACKGROUND ===== */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="md:hidden absolute inset-0 w-full h-full object-cover pointer-events-none"
      >
        <source src="/hero2.mp4" type="video/mp4" />
      </video>

      {/* ===== MOBILE TOP LEFT LOGO (Next to Navbar) ===== */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{
          opacity: 1,
          // --- ADJUST MOBILE LOGO POSITION HERE ---
          x: 100,
          y: 28,
          // ------------------------------------------
        }}
        transition={{
          opacity: { duration: 1.5, ease: "easeOut" },
          filter: { duration: 1.5, ease: "easeOut" },
        }}
        className="md:hidden absolute top-0 left-0 pointer-events-none"
      >
        <img
          src="/gopalanlogo.png"
          alt="Gopalan Logo"
          // --- ADJUST MOBILE LOGO SIZE HERE ---
          className="w-30 h-auto drop-shadow-lg"
        // ----------------------------------------------
        />
      </motion.div>

      {/* Overlay - Desktop Only to maintain consistency with mobile transparent background */}
      <div className="hidden md:block absolute inset-0 bg-black/30 pointer-events-none" />
    </div>
  )
}