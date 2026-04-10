import { motion, useScroll, useTransform } from "framer-motion"

import Navbar from "./components/Navbar"
import Schedule from "./components/Schedule"
// import Countdown from "./components/Countdown"
import Venue from "./components/Venue"
import Footer from "./components/Footer"
import ParticlesBg from "./components/ParticlesBg"
import About from "./components/About"
import Clubs from "./components/Clubs"
import ScrollProgress from "./components/ScrollProgress"
import CursorGlow from "./components/CursorGlow"
import Section from "./components/Section"
import FestivalHero from "./components/FestivalHero"
import HeroVideo from "./components/HeroVideo"
import GalleryPreview from "./components/GalleryPreview"
import CountdownSciFi from "./components/CountdownSciFi"
import StarBackground from "./components/StarBackground"
import Timeline from "./components/Timeline"
// import ScanLine from "./components/ScanLine"
import CornerLogos from "./components/Cornerlogos"
import MyRegistrations from "./components/MyRegistrations"
import AdminDashboard from "./components/AdminDashboard"
import FixedWatermark from "./components/FixedWatermark"
import WelcomeAnimation from "./components/WelcomeAnimation"
import PrizePool from "./components/PrizePool"
import ThemeRevealModal from "./components/ThemeRevealModal"
import { useState, useEffect } from "react"

export default function App() {
  const [isRegistrationsOpen, setIsRegistrationsOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isWelcomeDone, setIsWelcomeDone] = useState(() => {
    return sessionStorage.getItem('hasSeenWelcome') === 'true';
  });
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [isThemeRevealOpen, setIsThemeRevealOpen] = useState(false);


  /* ===== Scroll Parallax ===== */
  const { scrollY } = useScroll()

  const ySlow = useTransform(scrollY, [0, 2000], [0, -200])
  const yFast = useTransform(scrollY, [0, 2000], [0, -400])
  const yTitle = useTransform(scrollY, [0, 800], [0, -120])

  /* ===== URL Deep-Linking for Pass Downloads ===== */
  const [initialRegEmail, setInitialRegEmail] = useState("");
  const [autoDownload, setAutoDownload] = useState(false);
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('openPass') === 'true' && params.get('email')) {
      const email = params.get('email');
      setInitialRegEmail(email);
      setAutoDownload(params.get('autoDownload') === 'true');
      setIsRegistrationsOpen(true);
      // Clean up URL without refreshing
      const newUrl = window.location.origin + window.location.pathname + window.location.hash;
      window.history.replaceState({}, '', newUrl);
    }
  }, []);

  return (
    <>
      <WelcomeAnimation onComplete={() => setIsWelcomeDone(true)} />

      <div className={`min-h-screen overflow-x-hidden bg-gradient-to-br from-purple-900 via-black to-blue-900 text-white transition-opacity duration-1000 ${isWelcomeDone ? 'opacity-100' : 'opacity-0'}`}>

        {/* ⭐ STAR BACKGROUND — place here */}
        <StarBackground />
        {/* ================= GLOBAL BACKGROUNDS ================= */}

        <ParticlesBg />

        {/* <ScanLine /> */}

        {/* Vignette - Hardware accelerated */}
        <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_center,transparent_60%,black_95%)] opacity-40 transform-gpu will-change-transform" />

        {/* Parallax glow center - Replaced blur-3xl with highly performant radial gradient */}
        <motion.div
          style={{ y: ySlow }}
          className="fixed w-[300px] h-[300px] md:w-[700px] md:h-[700px] bg-[radial-gradient(circle,rgba(147,51,234,0.15)_0%,transparent_70%)] rounded-full top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none -z-10 will-change-transform"
        />

        {/* Parallax glow top-left - Replaced blur-3xl with performant radial gradient */}
        <motion.div
          style={{ y: yFast }}
          className="fixed w-[250px] h-[250px] md:w-[500px] md:h-[500px] bg-[radial-gradient(circle,rgba(37,99,235,0.15)_0%,transparent_70%)] rounded-full top-[10%] left-[10%] pointer-events-none -z-10 will-change-transform"
        />

        {/* Floating blobs - Removed blur-3xl and localized heavy transitions to GPU */}
        <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden transform-gpu">
          <div className="absolute w-40 h-40 md:w-96 md:h-96 bg-[radial-gradient(circle,rgba(236,72,153,0.15)_0%,transparent_70%)] rounded-full top-[12%] left-[75%] animate-[float_18s_ease-in-out_infinite] will-change-transform" />
          <div className="absolute w-60 h-60 md:w-[500px] md:h-[500px] bg-[radial-gradient(circle,rgba(168,85,247,0.15)_0%,transparent_70%)] rounded-full bottom-[8%] left-[8%] animate-[float_22s_ease-in-out_infinite] will-change-transform" />
        </div>

        <CursorGlow />

        <Navbar
          onOpenRegistrations={() => setIsRegistrationsOpen(true)}
          onOpenAdmin={() => setIsAdminOpen(true)}
          onOpenThemeReveal={() => setIsThemeRevealOpen(true)}
        />

        <MyRegistrations
          isOpen={isRegistrationsOpen}
          onClose={() => { setIsRegistrationsOpen(false); setInitialRegEmail(""); setAutoDownload(false); }}
          initialEmail={initialRegEmail}
          autoDownload={autoDownload}
        />
        <AdminDashboard isOpen={isAdminOpen} onClose={() => setIsAdminOpen(false)} />
        <ThemeRevealModal isOpen={isThemeRevealOpen} onClose={() => setIsThemeRevealOpen(false)} />

        <CornerLogos
          isWelcomeDone={isWelcomeDone}
          hide={isRegistrationsOpen || isAdminOpen || isScheduleModalOpen}
        />
        <FixedWatermark />

        <ScrollProgress />

        {/* ================= VIDEO HERO ================= */}
        <section className="relative h-screen w-full overflow-hidden">
          <HeroVideo />

          {/* Optional center scroll hint */}
          <div className="absolute bottom-10 left-1/2 -translate-x-1/2 text-white/70 text-sm animate-bounce">
            Scroll ↓
          </div>
        </section>


        {/* ================= HERO ================= */}
        <Section id="home">
          <section
            className="relative min-h-screen flex items-center justify-center px-6 text-center overflow-hidden"
          >

            <FestivalHero />

            <motion.div
              style={{ y: yTitle }}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1 }}
              className="relative z-20 flex flex-col items-center mt-28 md:mt-66 will-change-transform"
            >
              <div className="mt-6 flex flex-col items-center">
                <CountdownSciFi />
              </div>

              <div className="mt-12">
                <a
                  href="#events"
                  className="px-8 py-3 rounded-xl bg-gradient-to-r from-pink-500 to-purple-600 font-semibold shadow-lg shadow-purple-700/40 hover:shadow-purple-500/80 hover:scale-105 transition"
                >
                  EXPLORE EVENTS
                </a>
              </div>
            </motion.div>
          </section>
        </Section>

        <PrizePool />

        {/* ================= ABOUT ================= */}
        <Section id="about">
          <About />
        </Section>

        <GalleryPreview />

        {/* ================= EVENTS ================= */}
        <Section id="events">
          <Schedule onModalToggle={setIsScheduleModalOpen} />
        </Section>

        <Timeline />

        {/* ================= VENUE ================= */}
        <Section id="venue">
          <Venue />
        </Section>



        {/* ================= CLUBS ================= */}
        <Section id="clubs">
          <Clubs />
        </Section>

        {/* ================= FOOTER ================= */}
        <Footer />
      </div>
    </>
  )
}
