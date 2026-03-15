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
        poster="/hero-poster.jpg"
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

      {/* ===== MOBILE LOGO (REPLACING LAGGY VIDEO) ===== */}
      <div className="md:hidden absolute inset-0 flex flex-col items-center justify-center bg-transparent overflow-hidden">
        



        <motion.div
           initial={{ opacity: 0, scale: 0.5, filter: 'blur(20px)' }}
           animate={{ 
             opacity: 1,
             scale: 1,
             filter: 'blur(0px)',
           }}
           transition={{
             opacity: { duration: 1.5, ease: "easeOut" },
             scale: { duration: 1.5, ease: "easeOut" },
             filter: { duration: 1.5, ease: "easeOut" },
           }}
           className="relative z-10 flex flex-col items-center"
        >
          {/* Main Logo with Gravitational Void effect */}
          <motion.div 
            animate={{
              // --- CHANGE MOBILE LOGO POSITION HERE ---
              x: -6,             // Move Logo Right (+) or Left (-)
              y: [0, -8, 0],    // Move Logo Down (+) or Up (-)
              z: 0,             // Move Logo Forward (+) or Backward (-)
              // -----------------------------------------
            }}
            transition={{ 
              y: { duration: 6, repeat: Infinity, ease: "easeInOut" } 
            }}
            className="relative group p-10"
          >
            {/* Pulsing Core Ripple */}
            {[1, 1.5, 2].map((s, i) => (
              <motion.div 
                key={i}
                animate={{
                  scale: [s, s + 0.5],
                  opacity: [0.15, 0],
                }}
                transition={{ duration: 4, repeat: Infinity, delay: i * 1.3 }}
                className="absolute inset-10 border border-blue-400/30 rounded-full z-0"
              />
            ))}
            
            <img 
              src="/go.png" 
              alt="Gopalan Logo" 
              className="w-full max-w-[200px] h-auto relative z-10 drop-shadow-[0_0_30px_rgba(59,130,246,0.3)]"
            />
          </motion.div>

          {/* Elegant Status Indicator with Position Controls */}
          <motion.div 
            animate={{
              // --- CHANGE 'WELCOME TO' POSITION HERE ---
              x: 0,             // Move Right (+) or Left (-)
              y: 0,             // Move Down (+) or Up (-)
              z: 0,             // Move Forward (+) or Backward (-)
              // ------------------------------------------
            }}
            className="flex items-center space-x-6 mt-2"
          >
             <div className="w-8 h-[1px] bg-gradient-to-r from-transparent to-blue-400/40" />
             <motion.div 
               animate={{ opacity: [0.3, 1, 0.3] }}
               transition={{ duration: 2, repeat: Infinity }}
               className="text-[9px] tracking-[0.5em] text-blue-300 font-bold uppercase"
             >
              WELCOME TO
             </motion.div>
             <div className="w-8 h-[1px] bg-gradient-to-l from-transparent to-blue-400/40" />
          </motion.div>

          {/* College Name - Premium Glassmorphism Reveal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1.2, duration: 1 }}
            className="mt-16 relative"
          >
            {/* Glassmorphic Container Layer */}
            <div className="relative px-6 py-4 rounded-2xl bg-white/[0.03] backdrop-blur-md border border-white/[0.08] shadow-[0_8px_32px_0_rgba(0,0,0,0.4)] overflow-hidden">
              
              {/* Internal Scanning Beam */}
              <motion.div 
                animate={{ 
                  left: ['-50%', '150%'],
                  opacity: [0, 0.4, 0]
                }}
                transition={{ 
                  duration: 2.5, 
                  repeat: Infinity, 
                  repeatDelay: 3,
                  ease: "easeInOut" 
                }}
                className="absolute top-0 w-20 h-full bg-gradient-to-r from-transparent via-blue-400/30 to-transparent skew-x-12 pointer-events-none"
              />

              <div className="flex flex-col items-center space-y-1">
                <motion.div className="flex flex-wrap justify-center gap-x-2">
                  {["GOPALAN", "COLLEGE", "OF"].map((word, i) => (
                    <motion.span
                      key={i}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 1.5 + i * 0.1, duration: 0.6 }}
                      className="text-xs tracking-[0.3em] font-bold text-blue-100/90"
                    >
                      {word}
                    </motion.span>
                  ))}
                </motion.div>
                
                <motion.div className="flex flex-wrap justify-center gap-x-2">
                  {["ENGINEERING", "AND", "MANAGEMENT"].map((word, i) => (
                    <motion.span
                      key={i}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 1.8 + i * 0.1, duration: 0.6 }}
                      className="text-xs tracking-[0.3em] font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-300 via-white to-purple-400"
                    >
                      {word}
                    </motion.span>
                  ))}
                </motion.div>
              </div>

              {/* Corner Accents for Tech Feel */}
              <div className="absolute top-1 left-1 w-2 h-2 border-t border-l border-blue-400/40 rounded-tl-sm" />
              <div className="absolute top-1 right-1 w-2 h-2 border-t border-r border-blue-400/40 rounded-tr-sm" />
              <div className="absolute bottom-1 left-1 w-2 h-2 border-b border-l border-blue-400/40 rounded-bl-sm" />
              <div className="absolute bottom-1 right-1 w-2 h-2 border-b border-r border-blue-400/40 rounded-br-sm" />
            </div>

            {/* Subtle Aura behind the card */}
            <motion.div 
               animate={{ opacity: [0.1, 0.2, 0.1] }}
               transition={{ duration: 4, repeat: Infinity }}
               className="absolute inset-0 bg-blue-500/10 blur-2xl rounded-2xl -z-10"
            />
          </motion.div>
        </motion.div>
      </div>

      {/* Overlay - Desktop Only to maintain consistency with mobile transparent background */}
      <div className="hidden md:block absolute inset-0 bg-black/30 pointer-events-none" />
    </div>
  )
}