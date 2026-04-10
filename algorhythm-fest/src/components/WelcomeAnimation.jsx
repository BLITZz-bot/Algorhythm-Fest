import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const WelcomeAnimation = ({ onComplete }) => {
    const [isVisible, setIsVisible] = useState(() => {
        // Initialize state by checking storage immediately to prevent flicker
        return !sessionStorage.getItem('hasSeenWelcome');
    });

    useEffect(() => {
        if (!isVisible) {
            onComplete && onComplete();
            return;
        }

        // Set timer to complete the animation
        const timer = setTimeout(() => {
            setIsVisible(false);
            sessionStorage.setItem('hasSeenWelcome', 'true');
            if (onComplete) onComplete();
        }, 3800);

        return () => clearTimeout(timer);
    }, [onComplete]);

    if (!isVisible) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.8, ease: "easeInOut" }}
                className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-black overflow-hidden"
            >
                {/* Background Glows */}
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.15)_0%,transparent_70%)]" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom,rgba(147,51,234,0.1)_0%,transparent_50%)]" />

                <div className="relative z-10 flex flex-col items-center text-center px-6 -mt-10 md:-mt-16">
                    {/* Logo Section */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{
                            opacity: 1,
                            scale: 1,
                            y: [0, -5, 0]
                        }}
                        transition={{
                            opacity: { duration: 0.6 },
                            scale: { duration: 0.8, ease: "easeOut" },
                            y: { duration: 4, repeat: Infinity, ease: "easeInOut" }
                        }}
                        className="mb-2 md:mb-4"
                    >
                        <div className="relative flex flex-row items-center gap-8 md:gap-14 group">
                            <motion.img
                                src="/algo.png"
                                alt="Logo 1"
                                className="w-24 h-24 md:w-70 md:h-70 relative z-10 object-contain"
                            />
                        </div>
                    </motion.div>

                    {/* Title Section */}
                    <div className="overflow-hidden mb-2">
                        <motion.h1
                            initial={{ y: 80, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.6, duration: 0.7, ease: "easeOut" }}
                            className="text-4xl md:text-7xl font-black tracking-tighter"
                        >
                            <span className="bg-gradient-to-r from-blue-400 via-white to-purple-400 bg-clip-text text-transparent">
                                ALGO-RHYTHM 3.0
                            </span>
                        </motion.h1>
                    </div>

                    {/* Subtitle Section */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 1.6, duration: 0.7 }}
                        className="flex flex-col items-center gap-2"
                    >
                        <p className="text-blue-300/60 uppercase tracking-[0.3em] font-medium text-[10px] md:text-xs">
                            DEPARTMENT OF CSE & CSE(AI&ML)
                        </p>

                        <div className="h-[1px] w-24 bg-gradient-to-r from-transparent via-blue-500/50 to-transparent my-1" />

                        <p className="text-white/40 text-[14px] md:text-[11px] font-light max-w-[250px] md:max-w-md uppercase tracking-wider leading-relaxed">
                            GRAFIK : CREATE TO INSPIRE <br />
                            ENTERING...
                        </p>
                    </motion.div>
                </div>

                {/* Progress Bar (Subtle) */}
                <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: "100%" }}
                    transition={{ duration: 3.5, ease: "linear" }}
                    className="absolute bottom-0 left-0 h-[2px] bg-gradient-to-r from-blue-600 via-purple-500 to-pink-500 shadow-[0_0_10px_rgba(37,99,235,0.8)]"
                />

                {/* Cinematic Lettering Reveal Overlays */}
                <div className="absolute inset-x-0 top-0 h-[10vh] bg-gradient-to-b from-black to-transparent" />
                <div className="absolute inset-x-0 bottom-0 h-[10vh] bg-gradient-to-t from-black to-transparent" />
            </motion.div>
        </AnimatePresence>
    );
};

export default WelcomeAnimation;
