import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface LoadingScreenProps {
    isLoading: boolean;
}

const LoadingScreen: React.FC<LoadingScreenProps> = ({ isLoading }) => {
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        if (isLoading) {
            const interval = setInterval(() => {
                setProgress(prev => (prev < 90 ? prev + (Math.random() * 15) : prev));
            }, 500);
            return () => clearInterval(interval);
        } else {
            setProgress(100);
        }
    }, [isLoading]);

    return (
        <AnimatePresence>
            {isLoading && (
                <motion.div
                    key="loading-screen"
                    initial={{ opacity: 1 }}
                    exit={{
                        opacity: 0,
                        transition: { duration: 0.8, ease: "easeInOut" }
                    }}
                    className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#030712] overflow-hidden"
                >
                    {/* Theme-Matched Background Gradient */}
                    <div className="absolute inset-0 z-0">
                        <div className="absolute inset-0 bg-gradient-to-b from-gray-950/80 via-gray-950/60 to-gray-950" />
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-orange-500/5 rounded-full blur-[120px]" />
                    </div>

                    <div className="relative z-10 flex flex-col items-center max-w-2xl px-6 text-center">

                        {/* Centerpiece: Glassmorphism Egg Shell containing the GIF */}
                        <motion.div
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ duration: 1, ease: "easeOut" }}
                            className="relative w-64 h-80 md:w-72 md:h-96 mb-12 flex items-center justify-center"
                        >
                            {/* Soft Incubation Glow */}
                            <motion.div
                                animate={{ scale: [1, 1.1, 1], opacity: [0.1, 0.2, 0.1] }}
                                transition={{ duration: 4, repeat: Infinity }}
                                className="absolute inset-0 bg-orange-500 rounded-full blur-[80px]"
                            />

                            {/* Glass Shell Container */}
                            <div className="relative w-full h-full bg-white/5 backdrop-blur-xl border border-white/10 rounded-[50%_50%_50%_50%_/_70%_70%_30%_30%] p-8 shadow-2xl overflow-hidden group">
                                {/* Loader GIF with soft masking */}
                                <div
                                    className="w-full h-full relative"
                                    style={{
                                        maskImage: 'radial-gradient(circle, black 30%, transparent 80%)',
                                        WebkitMaskImage: 'radial-gradient(circle, black 30%, transparent 80%)'
                                    }}
                                >
                                    <img
                                        src="/loader.gif"
                                        alt="Loading..."
                                        className="w-full h-full object-contain scale-125"
                                    />
                                </div>

                                {/* Subtle Glass Reflection */}
                                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent pointer-events-none" />
                            </div>
                        </motion.div>

                        {/* Theme-Matched Typography */}
                        <motion.div
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.3, duration: 0.8 }}
                        >
                            <h1 className="text-4xl md:text-6xl font-bold text-white leading-tight mb-4">
                                Hatch Success
                                <span className="block bg-gradient-to-r from-orange-400 via-amber-400 to-yellow-400 bg-clip-text text-transparent">
                                    Starts Here
                                </span>
                            </h1>
                            <p className="text-gray-400 text-sm md:text-base tracking-widest uppercase font-medium mb-10 opacity-70">
                                Precision Incubation Technology
                            </p>
                        </motion.div>

                        {/* Custom Theme-Matched Progress Loader */}
                        <div className="w-64 md:w-80 flex flex-col gap-3">
                            <div className="flex justify-between text-[10px] text-gray-500 font-bold tracking-widest uppercase mb-1">
                                <span>Incubating Data</span>
                                <span>{Math.round(progress)}%</span>
                            </div>
                            <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden border border-white/5 p-[1px]">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${progress}%` }}
                                    className="h-full bg-gradient-to-r from-orange-500 to-amber-500 rounded-full shadow-[0_0_10px_rgba(249,115,22,0.4)]"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Background Detail: Slow Floating Specs */}
                    <div className="absolute inset-0 pointer-events-none">
                        {[...Array(8)].map((_, i) => (
                            <motion.div
                                key={i}
                                initial={{
                                    x: `${Math.random() * 100}%`,
                                    y: '110%',
                                    opacity: 0
                                }}
                                animate={{
                                    y: '-10%',
                                    opacity: [0, 0.3, 0],
                                    scale: [1, 1.2, 1]
                                }}
                                transition={{
                                    duration: 10 + Math.random() * 10,
                                    repeat: Infinity,
                                    delay: Math.random() * 5
                                }}
                                className="absolute w-1 h-1 bg-white/20 rounded-full blur-[1px]"
                            />
                        ))}
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default LoadingScreen;
