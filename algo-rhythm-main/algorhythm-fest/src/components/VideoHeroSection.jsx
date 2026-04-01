export default function VideoHeroSection() {
  return (
    <section className="relative h-screen w-full overflow-hidden">
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
      >
        <source src="/ALGO TESTT.mp4" type="video/mp4" />
      </video>

      {/* dark overlay for readability */}
      <div className="absolute inset-0 bg-black/40" />
    </section>
  )
}
