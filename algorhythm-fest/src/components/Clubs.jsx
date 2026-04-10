import { motion } from "framer-motion"

export default function Clubs() {
    const clubs = [
        {
            name: "TECHEON",
            logo: "techeon.png", // Tell user to place image here
            url: "#",
            width: "200px", // adjust this as needed
            height: "200px", // adjust this as needed
        },
        {
            name: "WINFINITY",
            logo: "/winifinity.png",
            url: "#",
            width: "150px", // adjust this as needed
            height: "150px", // adjust this as needed
        },
        {
            name: "GRAFIK",
            logo: "/grafik.png",
            url: "#",
            width: "110px", // adjust this as needed
            height: "110px", // adjust this as needed
        },
    ]

    return (
        <section id="clubs" className="py-28 px-6 relative">

            {/* Glow */}
            <div className="absolute inset-0 flex justify-center pointer-events-none">
                <div className="w-[500px] h-[400px] bg-[radial-gradient(circle,rgba(147,51,234,0.15)_0%,transparent_70%)] rounded-full will-change-transform"></div>
            </div>

            <div className="relative max-w-5xl mx-auto text-center z-10">
                <h2 className="text-4xl md:text-5xl font-bold mb-12 bg-gradient-to-r from-blue-400 via-purple-300 to-pink-400 bg-clip-text text-transparent">
                    Our Clubs
                </h2>
                <p className="text-gray-400 mb-12 max-w-2xl mx-auto">
                    Algo-Rhythm is proudly brought to you in association with our talented student communities.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-10 items-center justify-items-center">
                    {clubs.map((c, i) => (
                        <motion.a
                            key={i}
                            href={c.url}
                            onClick={(e) => { if (c.url === "#") e.preventDefault() }}
                            whileHover={{ scale: 1.05, y: -5 }}
                            className="group block bg-[#1a1c2e]/50 border border-white/10 rounded-2xl p-8 hover:border-purple-500/50 hover:bg-white/5 hover:shadow-[0_0_30px_rgba(168,85,247,0.15)] transition-all w-full max-w-[280px]"
                        >
                            <h3 className="text-xl font-bold text-white mb-6 group-hover:text-purple-300 transition">{c.name}</h3>

                            <div className="w-32 h-32 mx-auto rounded-xl flex items-center justify-center overflow-hidden relative">
                                <img
                                    src={c.logo}
                                    alt={c.name}
                                    className="object-contain opacity-80 group-hover:opacity-100 transition z-10"
                                    style={{
                                        width: c.width || '100px',
                                        height: c.height || '100px',
                                        aspectRatio: '1/1'
                                    }}
                                    onError={(e) => {
                                        // Fallback for missing images to show placeholder text natively
                                        e.target.style.display = 'none';
                                        e.target.nextElementSibling.classList.remove('hidden');
                                    }}
                                />

                                {/* Fallback placeholder text if image is missing from public folder */}
                                <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-500 text-[10px] text-center p-2 hidden">
                                    <svg className="w-6 h-6 mb-2 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                                    <span>Upload Logo:</span>
                                    <span className="font-mono text-purple-400/70 mt-1">{c.logo.split('/').pop()}</span>
                                </div>
                            </div>
                        </motion.a>
                    ))}
                </div>
            </div>
        </section>
    )
}
