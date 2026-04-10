import { useState, useEffect, useRef, useMemo } from "react";
import { motion, AnimatePresence, useSpring, useMotionValue, useTransform } from "framer-motion";

// ─── PARTICLE BACKGROUND (Canvas for High Performance) ───
function ParticleBackground() {
    const canvasRef = useRef(null);
    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        let animationFrameId;

        const resize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };
        window.addEventListener('resize', resize);
        resize();

        const particles = Array.from({ length: 50 }, () => ({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            size: Math.random() * 2 + 0.5,
            speedX: (Math.random() - 0.5) * 0.5,
            speedY: (Math.random() - 0.5) * 0.5,
            opacity: Math.random() * 0.5 + 0.2
        }));

        const draw = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            particles.forEach(p => {
                p.x += p.speedX;
                p.y += p.speedY;
                if (p.x < 0) p.x = canvas.width;
                if (p.x > canvas.width) p.x = 0;
                if (p.y < 0) p.y = canvas.height;
                if (p.y > canvas.height) p.y = 0;

                ctx.beginPath();
                ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(168, 85, 247, ${p.opacity})`; 
                ctx.fill();
            });
            animationFrameId = requestAnimationFrame(draw);
        };
        draw();
        return () => {
            window.removeEventListener('resize', resize);
            cancelAnimationFrame(animationFrameId);
        };
    }, []);

    return <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none opacity-40 z-[2]" />;
}

// ─── IRIS OPENING OVERLAY ───
function IrisOverlay({ stage }) {
    return (
        <motion.div
            initial={{ clipPath: 'circle(120% at 50% 50%)' }}
            animate={{ clipPath: 'circle(0% at 50% 50%)' }}
            transition={{ duration: 1.2, ease: [0.77, 0, 0.175, 1] }}
            className="fixed inset-0 bg-black z-[200] pointer-events-none"
        />
    );
}

// ─── HACKER SCRAMBLE TEXT HOOK ───
function useScramble(text, active = false) {
    const chars = "!<>-_\\/[]{}—=+*^?#________";
    const [scrambled, setScrambled] = useState("");
    
    useEffect(() => {
        if (!active || !text) return;
        let iteration = 0;
        const interval = setInterval(() => {
            setScrambled(text.split("").map((_, index) => {
                if (index < iteration) return text[index];
                return chars[Math.floor(Math.random() * chars.length)];
            }).join(""));
            if (iteration >= text.length) clearInterval(interval);
            iteration += 1 / 3;
        }, 30);
        return () => clearInterval(interval);
    }, [text, active]);
    
    return scrambled;
}

// ─── TYPEWRITER HOOK ───
function useTypewriter(text, speed = 35, startTyping = false) {
    const [displayed, setDisplayed] = useState("");
    useEffect(() => {
        if (!startTyping || !text) { setDisplayed(""); return; }
        setDisplayed("");
        let i = 0;
        const timer = setInterval(() => {
            setDisplayed(text.slice(0, i + 1));
            i++;
            if (i >= text.length) clearInterval(timer);
        }, speed);
        return () => clearInterval(timer);
    }, [text, startTyping, speed]);
    return displayed;
}

// ─── FILM GRAIN OVERLAY ───
function FilmGrain() {
    return (
        <div className="pointer-events-none fixed inset-0 z-[1] opacity-[0.04]"
            style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.5'/%3E%3C/svg%3E")`,
                backgroundRepeat: 'repeat',
            }}
        />
    );
}

// ─── CHROMATIC GLITCH TEXT WITH PARALLAX ───
function GlitchTitle({ text }) {
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);
    const springX = useSpring(mouseX, { stiffness: 100, damping: 20 });
    const springY = useSpring(mouseY, { stiffness: 100, damping: 20 });
    const shiftRX = useTransform(springX, [-500, 500], [-10, 10]);
    const shiftGX = useTransform(springX, [-500, 500], [10, -10]);

    useEffect(() => {
        const handleMove = (e) => {
            mouseX.set(e.clientX - window.innerWidth / 2);
            mouseY.set(e.clientY - window.innerHeight / 2);
        };
        window.addEventListener("mousemove", handleMove);
        return () => window.removeEventListener("mousemove", handleMove);
    }, []);

    const scrambled = useScramble(text, true);

    return (
        <div className="relative inline-block select-none perspective">
            <motion.span 
                style={{ x: shiftRX, clipPath: 'inset(10% 0 60% 0)' }}
                className="absolute top-0 left-0 text-red-500/30 animate-pulse mix-blend-screen" 
            >
                {scrambled}
            </motion.span>
            <motion.span 
                style={{ x: shiftGX, clipPath: 'inset(50% 0 10% 0)' }}
                className="absolute top-0 left-0 text-cyan-400/30 animate-pulse mix-blend-screen" 
            >
                {scrambled}
            </motion.span>
            <motion.span 
                style={{ rotateX: useTransform(springY, [-500, 500], [5, -5]), rotateY: useTransform(springX, [-500, 500], [-5, 5]) }}
                className="relative z-10 text-white block drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]"
            >
                {scrambled}
            </motion.span>
        </div>
    );
}

export default function ThemeRevealModal({ isOpen, onClose }) {
    const [stage, setStage] = useState("entry"); // entry | shutter | title | reveal
    const [email, setEmail] = useState("");
    const [verifying, setVerifying] = useState(false);
    const [error, setError] = useState("");
    const [userName, setUserName] = useState("");
    const [isFullscreen, setIsFullscreen] = useState(false);
    const modalRef = useRef(null);

    // Theme data from server
    const [themeTitle, setThemeTitle] = useState("");
    const [themeDesc, setThemeDesc] = useState("");
    const [isRevealed, setIsRevealed] = useState(false);
    const [loading, setLoading] = useState(true);

    const typedDesc = useTypewriter(themeDesc, 25, stage === "reveal");

    // Fetch theme status on mount
    useEffect(() => {
        if (!isOpen) return;
        setStage("entry");
        setEmail("");
        setError("");
        setUserName("");
        setLoading(true);

        (async () => {
            try {
                const res = await fetch(`${import.meta.env.VITE_API_URL}/api/theme/status`);
                const data = await res.json();
                if (data.success) {
                    setIsRevealed(data.revealed);
                    setThemeTitle(data.title);
                    setThemeDesc(data.description);
                }
            } catch (err) {
                console.error("Theme fetch failed", err);
            } finally {
                setLoading(false);
            }
        })();
    }, [isOpen]);

    // Fullscreen Toggle logic
    const toggleFullscreen = () => {
        if (!document.fullscreenElement) {
            modalRef.current.requestFullscreen().catch(err => {
                console.error(`Error attempting to enable full-screen mode: ${err.message}`);
            });
            setIsFullscreen(true);
        } else {
            document.exitFullscreen();
            setIsFullscreen(false);
        }
    };

    // Auto-exit fullscreen on close
    const handleClose = () => {
        if (document.fullscreenElement) document.exitFullscreen();
        setIsFullscreen(false);
        onClose();
    };

    useEffect(() => {
        const handleFsChange = () => setIsFullscreen(!!document.fullscreenElement);
        document.addEventListener('fullscreenchange', handleFsChange);
        return () => document.removeEventListener('fullscreenchange', handleFsChange);
    }, []);

    // Handle back button
    useEffect(() => {
        if (!isOpen) return;
        window.history.pushState({ modal: "themeReveal" }, "");
        const handlePop = (e) => {
            if (!e.state || e.state.modal !== "themeReveal") handleClose();
        };
        window.addEventListener("popstate", handlePop);
        return () => {
            window.removeEventListener("popstate", handlePop);
            if (window.history.state?.modal === "themeReveal") window.history.back();
        };
    }, [isOpen]);

    const handleVerify = async (e) => {
        e.preventDefault();
        setVerifying(true);
        setError("");
        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/theme/verify`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: email.trim() })
            });
            const data = await res.json();
            if (data.success && data.verified) {
                setUserName(data.name);
                setStage("shutter");
                setTimeout(() => setStage("title"), 2500);
            } else {
                setError(data.message || "You don't have access to this reveal.");
            }
        } catch (err) {
            setError("Server error. Please try again.");
        } finally {
            setVerifying(false);
        }
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <motion.div
                ref={modalRef}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[100] bg-black flex items-center justify-center overflow-hidden font-sans"
            >
                <FilmGrain />
                <ParticleBackground />
                <IrisOverlay key={stage} />

                {/* --- TOP CONTROLS --- */}
                <div className="fixed top-5 right-5 z-[250] flex items-center gap-3">
                    <button
                        onClick={toggleFullscreen}
                        className="p-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full text-gray-400 hover:text-white transition-all backdrop-blur-md"
                        title={isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen"}
                    >
                        {isFullscreen ? (
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 9L4 4m0 0l5-5m-5 5h16M15 15l5 5m0 0l-5 5m5-5H4" /></svg>
                        ) : (
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" /></svg>
                        )}
                    </button>
                    <button
                        onClick={handleClose}
                        className="p-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full text-gray-400 hover:text-white transition-all backdrop-blur-md"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                </div>

                {/* === LOADING === */}
                {loading && (
                    <div className="flex flex-col items-center gap-4 relative z-[10]">
                        <div className="w-16 h-16 border-2 border-white/10 border-t-purple-500 rounded-full animate-spin shadow-[0_0_30px_rgba(147,51,234,0.3)]" />
                    </div>
                )}

                {/* === VAULT LOCKED === */}
                {!loading && !isRevealed && (
                    <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-center p-8 max-w-lg relative z-20">
                        <div className="w-32 h-32 mx-auto mb-10 rounded-[2.5rem] bg-gradient-to-br from-gray-800 to-black border border-white/10 flex items-center justify-center shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
                            <svg className="w-16 h-16 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                        </div>
                        <h2 className="text-5xl font-black text-white mb-4 tracking-tighter uppercase italic">Vault Access Denied</h2>
                        <p className="text-gray-500 text-lg uppercase tracking-widest font-mono">Status: Awaiting System Trigger</p>
                    </motion.div>
                )}

                {/* === ENTRY STAGE (Gmail Verification) === */}
                {!loading && isRevealed && stage === "entry" && (
                    <motion.div
                        key="entry"
                        initial={{ y: 50, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: -50, opacity: 0 }}
                        className="relative z-[150] w-full max-w-md m-4"
                    >
                        <div className="bg-[#0a0a0a]/90 border border-white/10 rounded-[2.5rem] p-10 backdrop-blur-2xl shadow-[0_0_80px_rgba(147,51,234,0.15)] ring-1 ring-white/5">
                            <div className="flex items-center justify-between mb-10">
                                <span className="text-[10px] font-black tracking-[0.3em] text-purple-500 uppercase px-3 py-1 bg-purple-500/10 border border-purple-500/20 rounded-full">GRAFIK</span>
                                <span className="text-[10px] font-mono text-gray-700">CREATE TO INSPIRE</span>
                            </div>

                            <div className="text-center mb-10">
                                <h1 className="text-3xl font-black text-white mb-2 leading-none uppercase italic tracking-tighter">Enter the GMAIL</h1>
                                <p className="text-gray-500 text-xs font-mono uppercase tracking-wider">Restricted to Registered Leads</p>
                            </div>

                            <form onSubmit={handleVerify} className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-mono text-gray-600 uppercase tracking-widest ml-1">Identity Verification [Gmail]</label>
                                    <div className="relative group">
                                        <div className="absolute inset-y-0 left-5 flex items-center text-gray-600 group-focus-within:text-purple-400 transition-colors">
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" /></svg>
                                        </div>
                                        <input
                                            type="email"
                                            required
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            className="w-full bg-white/[0.03] border border-white/10 rounded-2xl pl-12 pr-6 py-4 text-white focus:outline-none focus:border-purple-500/50 focus:bg-white/[0.06] transition-all font-medium"
                                            placeholder="algorhythm@gmail.com"
                                        />
                                    </div>
                                </div>
                                {error && (
                                    <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="flex items-center gap-3 p-4 bg-red-500/5 border border-red-500/10 rounded-2xl text-red-400 text-[10px] font-bold uppercase tracking-wider">
                                        <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                                        {error}
                                    </motion.div>
                                )}
                                <button
                                    type="submit"
                                    disabled={verifying}
                                    className={`w-full group relative overflow-hidden h-16 rounded-[1.25rem] font-black text-sm uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-3 ${verifying ? 'bg-gray-800 text-gray-600' : 'bg-white text-black hover:bg-purple-500 hover:text-white'}`}
                                >
                                    <span className="relative z-10">{verifying ? 'Initing Auth...' : 'Initialize Reveal'}</span>
                                    {!verifying && (
                                        <div className="absolute inset-0 bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 bg-[length:200%_100%] animate-gradient opacity-0 group-hover:opacity-100 transition-opacity" />
                                    )}
                                </button>
                            </form>
                        </div>
                    </motion.div>
                )}

                {/* === SHUTTER STAGE (Camera Iris / Clapperboard) === */}
                {!loading && isRevealed && stage === "shutter" && (
                    <motion.div
                        key="shutter"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="fixed inset-0 z-10 flex items-center justify-center bg-black"
                    >
                        <div className="fixed top-0 left-0 right-0 h-14 sm:h-20 bg-black z-30 border-b border-white/5 flex items-center overflow-hidden gap-8 px-4 opacity-30">
                           {Array.from({ length: 15 }).map((_, i) => <div key={i} className="w-10 sm:w-16 h-6 sm:h-8 rounded-sm bg-white/10 flex-shrink-0" />)}
                        </div>
                        <div className="fixed bottom-0 left-0 right-0 h-14 sm:h-20 bg-black z-30 border-t border-white/5 flex items-center overflow-hidden gap-8 px-4 opacity-30">
                           {Array.from({ length: 15 }).map((_, i) => <div key={i} className="w-10 sm:w-16 h-6 sm:h-8 rounded-sm bg-white/10 flex-shrink-0" />)}
                        </div>
                        <div className="flex flex-col items-center gap-10">
                            <motion.div
                                initial={{ rotate: 180, scale: 0.5, opacity: 0 }}
                                animate={{ rotate: 0, scale: 1, opacity: 1 }}
                                transition={{ type: "spring", damping: 12, stiffness: 100 }}
                                className="w-32 h-32 text-8xl flex items-center justify-center font-emoji"
                            >
                                🎬
                            </motion.div>
                            <div className="flex flex-col items-center gap-2">
                                <motion.p className="text-white text-lg font-black italic tracking-tighter uppercase">Compiling Scene...</motion.p>
                                <div className="w-64 h-1 bg-white/5 rounded-full overflow-hidden relative">
                                    <motion.div initial={{ width: 0 }} animate={{ width: "100%" }} transition={{ duration: 2.2, ease: "easeInOut" }} className="h-full bg-gradient-to-r from-purple-600 via-pink-400 to-purple-600 rounded-full" />
                                </div>
                                <span className="text-[9px] font-mono text-gray-600 tracking-[0.4em] uppercase mt-2">Buffer: {userName.split(' ')[0]}</span>
                            </div>
                        </div>
                        <div className="absolute inset-0 opacity-10 font-mono text-[10px] text-purple-500 flex justify-around pointer-events-none select-none overflow-hidden uppercase">
                            {Array.from({ length: 10 }).map((_, i) => (
                                <motion.div key={i} animate={{ y: ['0%', '-100%'] }} transition={{ duration: Math.random() * 5 + 3, repeat: Infinity, ease: 'linear' }} className="flex flex-col gap-4">
                                   {Array.from({ length: 20 }).map((_, j) => <span key={j}>{Math.random().toString(36).substring(7)}</span>)}
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                )}

                {/* === TITLE STAGE (Glitch Title Reveal) === */}
                {!loading && isRevealed && stage === "title" && (
                    <motion.div
                        key="title"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="fixed inset-0 z-10 flex flex-col items-center justify-center bg-black px-6"
                    >
                        <motion.div
                            initial={{ scale: 1.2, filter: 'blur(20px)', opacity: 0 }}
                            animate={{ scale: 1, filter: 'blur(0px)', opacity: 1 }}
                            transition={{ duration: 0.8 }}
                            className="text-center"
                        >
                            <h1 className="text-5xl sm:text-7xl md:text-[8rem] font-black tracking-tighter leading-none italic uppercase">
                                <GlitchTitle text={themeTitle || "REVEAL"} />
                            </h1>
                        </motion.div>
                        <motion.div className="flex flex-col items-center mt-12 gap-8">
                             <motion.div initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: 1, delay: 0.5 }} className="w-64 h-px bg-gradient-to-r from-transparent via-purple-500 to-transparent" />
                            <motion.button
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 1 }}
                                onClick={() => setStage("reveal")}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="group px-10 py-5 rounded-2xl bg-white text-black font-black uppercase text-xs tracking-[0.3em] flex items-center gap-4 transition-all hover:shadow-[0_0_40px_rgba(255,255,255,0.2)]"
                            >
                                Play Scene
                                <svg className="w-5 h-5 group-hover:translate-x-2 transition-transform" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                            </motion.button>
                        </motion.div>
                    </motion.div>
                )}

                {/* === REVEAL STAGE (Typewriter Description) === */}
                {!loading && isRevealed && stage === "reveal" && (
                    <motion.div
                        key="reveal"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="fixed inset-0 z-10 flex flex-col items-center bg-black px-6 overflow-auto"
                    >
                        {/* Widescreen Borders */}
                        <div className="pointer-events-none fixed top-0 left-0 right-0 h-[12vh] bg-black z-30 shadow-[0_10px_30px_rgba(0,0,0,0.8)] border-b border-white/5" />
                        <div className="pointer-events-none fixed bottom-0 left-0 right-0 h-[12vh] bg-black z-30 shadow-[0_-10px_30px_rgba(0,0,0,0.8)] border-t border-white/5" />

                        <div className="max-w-6xl w-full text-center relative z-20 pt-[15vh] pb-[20vh]">
                            {/* Title recall removed as per user request */}

                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.1 }}
                                className="relative"
                            >
                                <div className="text-left py-10 sm:py-16">
                                    <div className="flex items-center gap-3 mb-10 pb-6 border-b border-white/5 max-w-xs">
                                        <div className="w-3 h-3 rounded-full bg-red-600 animate-pulse" />
                                        <span className="text-[10px] font-mono text-gray-500 tracking-[0.4em] uppercase font-bold">DESCRIPTION</span>
                                    </div>

                                    <p className="text-gray-200 text-lg sm:text-2xl leading-[1.3] font-semibold text-left tracking-tight whitespace-pre-wrap font-mono uppercase">
                                        {typedDesc}
                                        <motion.span animate={{ opacity: [1, 0] }} transition={{ repeat: Infinity, duration: 0.8 }} className="inline-block w-2.5 h-6 sm:h-8 bg-purple-500 ml-2" />
                                    </p>
                                </div>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 2.5 }}
                                className="mt-16 flex flex-col items-center gap-12"
                            >
                                <div className="flex flex-col items-center opacity-50">
                                    <p className="text-gray-400 text-[10px] font-mono tracking-[0.4em] uppercase text-center max-w-sm">Directed by GRAFIK • CREATE TO INSPIRE</p>
                                </div>
                                
                                <button
                                    onClick={() => setStage("title")}
                                    className="group relative px-10 py-5 rounded-full overflow-hidden transition-all hover:scale-105 active:scale-95"
                                >
                                    <div className="absolute inset-0 bg-white/5 border border-white/10 group-hover:bg-white/10 transition-colors" />
                                    <div className="relative z-10 flex items-center gap-3 text-white text-xs font-black tracking-[0.2em] uppercase">
                                        <svg className="w-5 h-5 group-hover:rotate-[-180deg] transition-transform duration-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/></svg>
                                        🎬 Replay Title
                                    </div>
                                </button>
                            </motion.div>
                        </div>
                    </motion.div>
                )}
            </motion.div>
        </AnimatePresence>
    );
}
