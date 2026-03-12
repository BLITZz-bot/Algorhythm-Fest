import { motion } from "framer-motion";

export default function FixedWatermark() {
  return (
    <div className="fixed bottom-24 right-0 z-[60] pointer-events-none select-none origin-bottom-right -rotate-90">
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 1, duration: 1 }}
        className="flex items-center gap-4 px-4 pr-1"
      >
        <span className="text-[9px] font-black tracking-[0.6em] uppercase text-white/30">
          GRAFIK
        </span>
      </motion.div>
    </div>
  );
}
