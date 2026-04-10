import { motion } from "framer-motion"

export default function FestivalHero() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none flex flex-col items-center justify-center">

      {/* ===== ALGO ===== */}
      <motion.h1
        initial={{ y: -120, opacity: 0 }}
        animate={{ y: 0, opacity: 0.5 }}
        transition={{ duration: 1.6, ease: "easeOut" }}
        className="text-[26vw] md:text-[15vw] font-extrabold leading-none text-white/10 whitespace-nowrap select-none"
      >
        ALGO-
      </motion.h1>

      {/* ===== RHYTHM ===== */}
      <motion.h1
        initial={{ y: 120, opacity: 0 }}
        animate={{ y: 0, opacity: 0.5 }}
        transition={{ duration: 1.6, ease: "easeOut", delay: 0.05 }}
        className="-mt-[4vw] md:-mt-[2vw] text-[26vw] md:text-[18vw] font-extrabold leading-none text-white/10 whitespace-nowrap select-none"
      >
        RHYTHM
      </motion.h1>

      {/* ===== 3.0 ===== */}
      <motion.h1
        initial={{ y: 140, opacity: 0 }}
        animate={{ y: 0, opacity: 0.5 }}
        transition={{ duration: 1.6, ease: "easeOut", delay: 0.1 }}
        className="-mt-[6vw] md:-mt-[3vw] text-[22vw] md:text-[14vw] font-extrabold leading-none text-white/10 whitespace-nowrap select-none"
      >
        3.0
      </motion.h1>

    </div>
  )
}


{/* ===== MAIN TITLE ABOVE ===== */ }
{/* <motion.div
        initial={{  x: -500,y: 180, opacity: 0}}
        animate={{  x: -255 , y: 180, opacity: 1}}
        transition={{ duration: 1.2, ease: "easeOut" }}
        className="absolute inset-0 flex items-start justify-center z-20"
      >
        <h1
          className="text-5xl md:text-7xl lg:text-8xl font-extrabold 
          bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400
          bg-[length:200%_200%] animate-[gradientShift_8s_ease_infinite]
          bg-clip-text text-transparent
          drop-shadow-[0_12px_40px_rgba(0,0,0,0.9)]"
        >
          ALGO-
        </h1>
      </motion.div>

      <motion.div
        initial={{  x: 500 ,y: 180, opacity: 0}}
        animate={{  x: 200 , y: 180, opacity: 1}}
        transition={{ duration: 1.2, ease: "easeOut" }}
        className="absolute inset-0 flex items-start justify-center z-20"
      >
        <h1
          className="text-5xl md:text-7xl lg:text-8xl font-extrabold 
          bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400
          bg-[length:200%_200%] animate-[gradientShift_8s_ease_infinite]
          bg-clip-text text-transparent
          drop-shadow-[0_12px_40px_rgba(0,0,0,0.9)]"
        >
           RHYTHM 3.0
        </h1>
      </motion.div> */}


// </div>
//   )
// }
