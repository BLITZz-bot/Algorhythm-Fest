import { useState } from "react"
import { motion } from "framer-motion"

export default function Navbar({ onOpenRegistrations, onOpenAdmin }) {
  const [open, setOpen] = useState(false)

  return (
    <>
      {/* LEFT HAMBURGER */}
      <motion.button
        onClick={() => setOpen(true)}
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.4 }}
        className="fixed top-4 left-4 z-50
                   text-3xl text-white
                   hover:text-purple-300
                   active:scale-95
                   transition"
      >
        ☰
      </motion.button>

      {/* OVERLAY */}
      {open && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
          onClick={() => setOpen(false)}
        />
      )}

      {/* SIDE MENU */}
      <motion.div
        initial={{ x: "-100%" }}
        animate={{ x: open ? 0 : "-100%" }}
        transition={{ type: "tween", duration: 0.35 }}
        className="fixed top-0 left-0 h-full w-72
                   bg-gradient-to-b from-purple-900 to-black
                   border-r border-white/10
                   z-50 p-8 flex flex-col"
      >
        {/* CLOSE */}
        <button
          onClick={() => setOpen(false)}
          className="text-2xl mb-10 hover:text-purple-300"
        >
          ✕
        </button>

        {/* LINKS */}
        <nav className="flex flex-col flex-1 gap-6 text-lg">
          <a href="#home" onClick={() => setOpen(false)}>Home</a>
          <a href="#about" onClick={() => setOpen(false)}>About</a>
          <a href="#schedule" onClick={() => setOpen(false)}>Schedule</a>
          <a href="#venue" onClick={() => setOpen(false)}>Venue</a>
          <a href="#clubs" onClick={() => setOpen(false)}>Clubs</a>

          <div className="w-full h-px bg-white/10 my-2"></div>

          <button
            onClick={() => { onOpenRegistrations(); setOpen(false); }}
            className="text-left font-semibold text-pink-400 hover:text-pink-300 transition flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
            Your Registrations
          </button>

          <button
            onClick={() => { onOpenAdmin(); setOpen(false); }}
            className="group relative flex items-center justify-between gap-2 px-6 py-4 rounded-2xl bg-white/5 border border-purple-500/20 hover:border-purple-500/50 transition-all duration-300 mt-auto"
          >
            <div className="flex items-center gap-3">
              <svg className="w-4 h-4 text-purple-400 group-hover:rotate-12 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
              <span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 tracking-wider text-sm">ADMIN CONSOLE</span>
            </div>
            <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl blur opacity-0 group-hover:opacity-10 transition duration-500" />
          </button>
        </nav>
      </motion.div>
    </>
  )
}
