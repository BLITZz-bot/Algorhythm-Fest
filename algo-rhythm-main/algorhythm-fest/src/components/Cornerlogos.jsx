import { useState, useEffect } from "react"
import { motion } from "framer-motion"

export default function CornerLogos() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="fixed top-3 right-3 flex flex-col gap-2 z-50 pointer-events-auto">

      {/* Logo 1 */}
      <motion.img
        src="/logo1.png"
        alt="Logo 1"
        initial={{ opacity: 0, y: -15, scale: 0.9 }}
        animate={{
          opacity: 1,
          scale: 1,

          // --- CHANGE POSITION HERE (Mobile : Desktop) ---
          x: isMobile ? 0 : 0,
          y: isMobile ? 0 : 0,
          z: isMobile ? 0 : 0
          // ----------------------------------------------
        }}
        transition={{ duration: 0.4 }}
        whileHover={{ scale: 1.15 }}
        whileTap={{ scale: 1.1 }}   // mobile tap feedback
        className="w-12 h-12 md:w-20 md:h-20 object-contain
                   drop-shadow-[0_0_12px_rgba(0,200,255,0.7)]
                   transition-transform duration-150 ease-out"
      />

      {/* Logo 2 */}
      <motion.img
        src="/logo2.png"
        alt="Logo 2"
        initial={{ opacity: 0, y: -15, scale: 0.9 }}
        animate={{
          opacity: 1,
          scale: 1,

          // --- CHANGE POSITION HERE (Mobile : Desktop) ---
          x: isMobile ? 1.8 : 2.2,
          y: isMobile ? 0 : 0,
          z: isMobile ? 0 : 0
          // ----------------------------------------------
        }}
        transition={{ duration: 0.5 }}
        whileHover={{ scale: 1.15 }}
        whileTap={{ scale: 1.1 }}
        className="w-12 h-12 md:w-20 md:h-20 object-contain
                   drop-shadow-[0_0_12px_rgba(255,0,200,0.7)]
                   transition-transform duration-150 ease-out"
      />
    </div>
  )
}