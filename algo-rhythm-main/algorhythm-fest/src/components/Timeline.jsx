import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"

const timelineData = {
  "APR 10": [
    { time: "09:00 AM – 10:30 AM", title: "INAUGURATION", type: "Ceremony" },
    { time: "10:30 AM – 01:30 PM", title: "ESCAPE ROOM", type: "Fun" },
    { time: "10:30 AM(APR 10) – 02:00 PM(APR 11)", title: "HIGHLIGHT REEL", type: "Reel Making" },
    { time: "10:30 AM – 02:30 PM", title: "CHESS", type: "Board Game" },
    { time: "11:30 AM – 03:30 PM", title: "CAMPUS CARNAGE", type: "Gaming" },
    { time: "12:30 PM – 02:30 PM", title: "CANVISTA", type: "Poster Making" },
    { time: "01:30 PM – 03:30 PM", title: "CODE SPRINT", type: "Tech" },
    { time: "01:30 PM – 04:30 PM", title: "VINTARA", type: "Fashion Show" },
  ],
  "APR 11": [
    { time: "09:00 AM – 01:30 PM", title: "TRIPLE THREAT CHALLENGE", type: "Fun" },
    { time: "09:30 AM – 12:30 PM", title: "THE WORD SYNDICATE", type: "Fun" },
    { time: "09:30 AM – 01:30 PM", title: "TECH DEBATE", type: "Tech" },
    { time: "10:30 AM – 12:30 PM", title: "SHOT CUT", type: "Editing" },
    { time: "10:30 AM – 02:00 PM", title: "IGNITE THE BEAT", type: "Dance" },
    { time: "12:30 PM – 02:00 PM", title: "BATTLE OF PROMPTS", type: "Tech" },
    { time: "02:00 PM – 04:30 PM", title: "VALEDICTORY", type: "Ceremony" },
  ],
}

export default function Timeline() {
  const [activeTab, setActiveTab] = useState(Object.keys(timelineData)[0])
  const events = timelineData[activeTab]

  return (
    <section id="timeline" className="relative py-28 px-4 sm:px-6 overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(6,182,212,0.05)_0%,rgba(0,0,0,0)_100%)] pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[radial-gradient(circle_at_center,rgba(6,182,212,0.15)_0%,transparent_60%)] rounded-full pointer-events-none" />

      {/* Header */}
      <div className="text-center mb-16 relative z-10">
        <motion.h2
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-4xl md:text-5xl font-bold text-center mb-12 bg-gradient-to-r from-pink-400 via-purple-300 to-blue-400 bg-clip-text text-transparent"
        >
          SCHEDULE
        </motion.h2>
      </div>

      {/* Cyber Tabs */}
      <div className="flex justify-center mb-24 relative z-10">
        <div className="inline-flex bg-black/40 backdrop-blur-xl p-2 rounded-2xl border border-white/5 ring-1 ring-white/10 shadow-[0_0_40px_rgba(6,182,212,0.1)]">
          {Object.keys(timelineData).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`relative px-8 py-3.5 rounded-xl text-sm md:text-base font-bold tracking-widest uppercase transition-all duration-500 ${activeTab === tab
                ? "text-black"
                : "text-gray-400 hover:text-cyan-300"
                }`}
            >
              {activeTab === tab && (
                <motion.div
                  layoutId="cyber-tab"
                  className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-xl"
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                >
                  <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20 mix-blend-overlay border border-white/20 rounded-xl" />
                </motion.div>
              )}
              <span className="relative z-10">{tab}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Timeline Stream */}
      <div className="relative max-w-4xl mx-auto pl-8 md:pl-0 z-10">

        {/* Glowing Data Cable (Vertical Line) */}
        <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-[2px] md:-translate-x-1/2 overflow-hidden bg-white/5">
          <motion.div
            animate={{ y: ["-100%", "200%"] }}
            transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
            className="w-full h-1/3 bg-gradient-to-b from-transparent via-cyan-400 to-transparent"
          />
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-12 md:space-y-24"
          >
            {events.map((event, i) => (
              <TimelineNode key={i} event={event} index={i} />
            ))}
          </motion.div>
        </AnimatePresence>

        {/* Navigation Actions */}
        <div className="mt-20 flex justify-center relative z-20">
          {activeTab === "APR 10" ? (
            <button
              onClick={() => {
                setActiveTab("APR 11");
                const el = document.getElementById("timeline");
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              className="group flex items-center gap-2 px-6 py-3 rounded-xl bg-cyan-950/80 border border-cyan-500/40 text-cyan-300 font-bold hover:bg-cyan-900 hover:text-white transition-all shadow-[0_0_15px_rgba(6,182,212,0.2)]"
            >
              GO TO SECOND DAY TIMELINE 
              <span className="transform group-hover:translate-x-1 transition">→</span>
            </button>
          ) : (
            <button
              onClick={() => {
                setActiveTab("APR 10");
                const el = document.getElementById("timeline");
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              className="group flex items-center gap-2 px-6 py-3 rounded-xl bg-purple-950/80 border border-purple-500/40 text-purple-300 font-bold hover:bg-purple-900 hover:text-white transition-all shadow-[0_0_15px_rgba(168,85,247,0.2)]"
            >
              <span className="transform group-hover:-translate-x-1 transition">←</span>
              GO TO FIRST DAY TIMELINE
            </button>
          )}
        </div>

      </div>
    </section>
  )
}

function TimelineNode({ event, index }) {
  const isEven = index % 2 === 0;

  return (
    <motion.div
      initial={{ opacity: 0, x: isEven ? -20 : 20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className={`relative flex items-center md:items-start md:justify-between w-full group ${!isEven ? "md:flex-row-reverse" : ""}`}
    >

      {/* Node Orb */}
      <div className="absolute left-0 md:left-1/2 -translate-x-[calc(50%-1px)] md:-translate-x-1/2 w-4 h-4 mt-8 md:mt-10 z-20">
        <div className="absolute inset-0 bg-cyan-500 rounded-full opacity-20 group-hover:opacity-60 group-hover:animate-pulse transition-opacity duration-300" />
        <div className="w-full h-full bg-black border-2 border-cyan-400 rounded-full group-hover:bg-cyan-400 group-hover:scale-150 transition-all duration-300 z-10 relative" />
      </div>

      {/* Invisible spacer for opposite side on Desktop */}
      <div className="hidden md:block w-[45%]" />

      {/* Data Card Content */}
      <div className="w-full md:w-[45%] pl-8 md:pl-0">
        <div className={`
          relative border rounded-2xl p-4 md:p-5 overflow-hidden transition-colors duration-300
          ${isEven
            ? "bg-blue-900/40 border-blue-400/30 hover:border-blue-400/50 hover:bg-blue-900/50"
            : (index % 3 === 0)
              ? "bg-purple-900/40 border-purple-400/30 hover:border-purple-400/50 hover:bg-purple-900/50"
              : "bg-indigo-900/40 border-indigo-400/30 hover:border-indigo-400/50 hover:bg-indigo-900/50"
          }
        `}>

          {/* Cyber Scanline Hover Effect */}
          <div className="absolute inset-0 -translate-y-[100%] group-hover:animate-[scan_2s_ease-in-out_infinite] bg-gradient-to-b from-transparent via-cyan-500/10 to-transparent pointer-events-none opacity-0 group-hover:opacity-100" />

          <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-cyan-950/40 border border-cyan-500/30 text-cyan-300 text-[10px] sm:text-xs font-mono font-bold tracking-widest shadow-[inset_0_0_10px_rgba(6,182,212,0.1)]">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
              {event.time}
            </span>

            {/* Type Badge */}
            <span className="text-[10px] text-gray-500 uppercase tracking-widest font-bold hidden sm:block">
              [ // {event.type || 'SYSTEM'} ]
            </span>
          </div>

          <h3 className="text-lg md:text-xl font-bold text-white tracking-wide group-hover:text-cyan-100 transition-colors duration-300 relative z-10">
            {event.title}
          </h3>

          {/* Corner Decorative Elements */}
          <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-transparent group-hover:border-cyan-500/30 opacity-0 group-hover:opacity-100 transition-all duration-500 rounded-tr-2xl" />
          <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-transparent group-hover:border-cyan-500/30 opacity-0 group-hover:opacity-100 transition-all duration-500 rounded-bl-2xl" />
        </div>
      </div>

    </motion.div>
  )
}
