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

      {/* ===== MOBILE VIDEO (NO CROP) ===== */}
      <video
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        className="
          block md:hidden
          absolute inset-0
          w-full h-full
          object-cover
          bg-black
          pointer-events-none
          transform-gpu will-change-transform
        "
      >
        <source src="/hero1.mp4" type="video/mp4" />
      </video>

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/30" />
    </div>
  )
}
