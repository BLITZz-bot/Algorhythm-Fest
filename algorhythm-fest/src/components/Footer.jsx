import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function Footer() {
  const [showLinks, setShowLinks] = useState(false);
  const popupRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (popupRef.current && !popupRef.current.contains(event.target)) {
        setShowLinks(false);
      }
    }
    if (showLinks) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showLinks]);

  return (
    <footer className="relative mt-20">
      {/* Gradient divider */}
      <div className="h-px w-full bg-gradient-to-r from-transparent via-purple-500 to-transparent mb-8"></div>

      <div className="max-w-7xl mx-auto px-6 py-10 grid sm:grid-cols-2 lg:grid-cols-4 gap-12 text-center md:text-left">

        {/* Fest Info */}
        <div className="flex flex-col items-center md:items-start"> 
          <h3 className="text-xl font-bold bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400 bg-clip-text text-transparent">
            ALGO-RHYTHM 3.0
          </h3>
          <p className="text-gray-400 mt-2 font-medium">
            CSE and CSE(AI&ML)
          </p>
          <p className="text-gray-500 text-sm mt-1 leading-relaxed">
            GOPALAN COLLEGE OF ENGINEERING AND MANAGEMENT, BENGALURU
          </p>
        </div>

        {/* Social Media Links */}
        <div className="flex flex-col items-center">
          <h4 className="font-semibold mb-4 text-purple-300 tracking-wider uppercase text-xs">Connect With Us</h4>
          <div className="flex gap-4">
            {/* Instagram */}
            <a href="https://www.instagram.com/gcem.cse?igsh=MWhqeWNjN3BraXJ1MA==" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-[#E1306C] hover:text-white hover:border-transparent hover:bg-gradient-to-tr hover:from-[#F56040] hover:via-[#E1306C] hover:to-[#833AB4] transition-all group shadow-lg">
              <svg className="w-5 h-5 group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" /></svg>
            </a>
            {/* LinkedIn */}
            <a href="https://www.linkedin.com/in/department-of-computer-science-engineering-gopalan-college?utm_source=share_via&utm_content=profile&utm_medium=member_android" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-[#0A66C2] hover:text-white hover:border-[#0A66C2] hover:bg-[#0A66C2] transition-all group shadow-lg">
              <svg className="w-5 h-5 group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 24 24"><path d="M8 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" /></svg>
            </a>
            {/* Twitter (X) */}
            <a href="https://x.com/gcem_cse" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white hover:text-black hover:border-white hover:bg-white transition-all group shadow-lg">
              <svg className="w-5 h-5 group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" /></svg>
            </a>
          </div>
        </div>

        {/* Support Info */}
        <div className="flex flex-col items-center md:items-start">
          <h4 className="font-semibold mb-4 text-purple-300 tracking-wider uppercase text-xs">Help & Support</h4>
          <div className="space-y-3">
            <div className="flex flex-col gap-0.5 mb-2 px-1">
              <span className="text-[9px] text-purple-400 font-black uppercase tracking-[0.2em]"></span>
              <span className="text-white font-bold text-sm tracking-wide">Bharath</span>
            </div>
            <a href="mailto:bharatha9483@gmail.com" className="flex items-center gap-3 text-gray-400 hover:text-white transition-colors group">
              <div className="p-2 rounded-lg bg-white/5 border border-white/10 group-hover:border-purple-500/50 group-hover:bg-purple-500/10 transition-all">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
              </div>
              <span className="text-sm">bharatha9483@gmail.com</span>
            </a>
            <a href="tel:7975871167" className="flex items-center gap-3 text-gray-400 hover:text-white transition-colors group">
              <div className="p-2 rounded-lg bg-white/5 border border-white/10 group-hover:border-purple-500/50 group-hover:bg-purple-500/10 transition-all">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
              </div>
              <span className="text-sm">7975871167</span>
            </a>
          </div>
          <p className="text-[10px] text-gray-600 mt-4 uppercase tracking-[0.2em] font-bold"></p>
        </div>
 
        {/* Credits */}
        <div className="flex flex-col items-center">
          <h4 className="font-semibold mb-4 text-purple-300 tracking-wider uppercase text-xs">About</h4>
          <p className="text-gray-400 text-sm text-center leading-relaxed">
            Official fest website for ALGO-RHYTHM 3.0.<br />
            © 2026 ALGO-RHYTHM. All rights reserved.
          </p>
        </div>

      </div>



      {/* Designer Credits */}
      <div className="border-t border-white/10 mt-8 py-6 text-center">
        <div className="text-gray-600 text-sm flex items-center justify-center">
          Designed & Developed by
          <div className="relative inline-block ml-1" ref={popupRef}>
            <button
              onClick={() => setShowLinks(!showLinks)}
              className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 font-bold tracking-wide hover:from-pink-400 hover:to-purple-400 transition-all duration-300 focus:outline-none"
            >
              GRAFIK
            </button>

            {/* Professional Developer Card Popup */}
            <AnimatePresence>
              {showLinks && (
                <motion.div
                  initial={{ opacity: 0, y: 15, x: "-50%", scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, x: "-50%", scale: 1 }}
                  exit={{ opacity: 0, y: 10, x: "-50%", scale: 0.9 }}
                  transition={{ type: "spring", damping: 20, stiffness: 300 }}
                  className="absolute bottom-full left-1/2 mb-5 w-64 bg-[#0a0a0c]/90 backdrop-blur-2xl border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5)] rounded-2xl p-5 z-50 overflow-hidden"
                >
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500"></div>
                  
                  <div className="text-left">
                    <h5 className="text-white font-bold text-lg leading-tight"> M M BHARATH</h5>
                    <p className="text-purple-400 text-xs font-medium tracking-wider mt-1 uppercase">GRAFIK (Designer & Developer)</p>
                    
                    <div className="mt-4 space-y-2">
                      <a 
                        href="https://www.linkedin.com/in/bharath-m-m-a9960b309" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 w-full px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-gray-200 text-sm font-medium hover:bg-white/10 hover:border-white/20 transition-all group"
                      >
                        <svg className="w-4 h-4 text-[#0A66C2]" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" /></svg>
                        LinkedIn
                      </a>
                      <a 
                        href="https://www.instagram.com/bharatha01/" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 w-full px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-gray-200 text-sm font-medium hover:bg-white/10 hover:border-white/20 transition-all group"
                      >
                        <svg className="w-4 h-4 text-[#E1306C]" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" /></svg>
                        Instagram
                      </a>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

          </div>
        </div>
      </div>


    </footer>
  )
}
