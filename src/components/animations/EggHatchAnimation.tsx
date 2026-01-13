import { motion } from 'framer-motion';

interface EggHatchAnimationProps {
  size?: 'sm' | 'md' | 'lg';
  animate?: boolean;
}

export function EggHatchAnimation({ size = 'md', animate = true }: EggHatchAnimationProps) {
  const sizeClasses = {
    sm: 'w-16 h-20',
    md: 'w-24 h-32',
    lg: 'w-40 h-52',
  };

  return (
    <div className={`relative ${sizeClasses[size]}`}>
      {/* Egg Base */}
      <motion.div
        animate={animate ? {
          rotate: [-2, 2, -2],
        } : {}}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className="absolute inset-0 bg-gradient-to-br from-amber-50 via-orange-50 to-amber-100 rounded-egg shadow-egg"
        style={{
          background: 'radial-gradient(ellipse at 30% 30%, hsl(45 60% 98%) 0%, hsl(42 50% 92%) 40%, hsl(35 40% 88%) 100%)',
        }}
      >
        {/* Egg shine highlight */}
        <div 
          className="absolute top-[15%] left-[20%] w-[30%] h-[20%] bg-white/60 rounded-full blur-sm"
          style={{ transform: 'rotate(-30deg)' }}
        />
        
        {/* Crack lines - appear on hover */}
        <motion.div
          initial={{ opacity: 0 }}
          whileHover={{ opacity: 1 }}
          className="absolute top-1/3 left-1/2 -translate-x-1/2"
        >
          <svg width="40" height="30" viewBox="0 0 40 30" fill="none" className="text-amber-800/30">
            <path d="M20 0 L22 8 L18 6 L20 12 L16 10 L20 18 L14 14 L20 26" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            <path d="M20 0 L18 7 L24 5 L19 14 L26 11 L18 22" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
          </svg>
        </motion.div>
      </motion.div>

      {/* Warm glow underneath */}
      {animate && (
        <motion.div
          animate={{
            opacity: [0.3, 0.6, 0.3],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-[80%] h-4 bg-orange-400/30 rounded-full blur-lg"
        />
      )}
    </div>
  );
}

export function FloatingEggs() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          initial={{ 
            x: `${Math.random() * 100}%`, 
            y: '110%',
            rotate: Math.random() * 30 - 15,
          }}
          animate={{ 
            y: '-10%',
            rotate: Math.random() * 60 - 30,
          }}
          transition={{
            duration: 15 + Math.random() * 10,
            repeat: Infinity,
            delay: i * 2,
            ease: 'linear',
          }}
          className="absolute opacity-10"
        >
          <div 
            className="w-8 h-10 bg-gradient-to-br from-amber-200 to-orange-200"
            style={{ borderRadius: '50% 50% 50% 50% / 60% 60% 40% 40%' }}
          />
        </motion.div>
      ))}
    </div>
  );
}

export function WarmParticles() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {[...Array(20)].map((_, i) => (
        <motion.div
          key={i}
          initial={{ 
            x: `${Math.random() * 100}%`, 
            y: `${Math.random() * 100}%`,
            scale: 0,
            opacity: 0,
          }}
          animate={{ 
            y: [`${Math.random() * 100}%`, `${Math.random() * 100 - 20}%`],
            scale: [0, 1, 0],
            opacity: [0, 0.6, 0],
          }}
          transition={{
            duration: 4 + Math.random() * 3,
            repeat: Infinity,
            delay: i * 0.3,
            ease: 'easeInOut',
          }}
          className="absolute w-2 h-2 rounded-full"
          style={{
            background: `hsl(${38 + Math.random() * 10} ${80 + Math.random() * 15}% ${55 + Math.random() * 10}%)`,
            filter: 'blur(1px)',
          }}
        />
      ))}
    </div>
  );
}

export function HatchingEffect() {
  return (
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 1.2, opacity: 0 }}
      className="relative"
    >
      {/* Cracking egg shell pieces */}
      {[...Array(8)].map((_, i) => (
        <motion.div
          key={i}
          initial={{ x: 0, y: 0, rotate: 0, opacity: 1 }}
          animate={{ 
            x: (Math.random() - 0.5) * 100,
            y: (Math.random() - 0.5) * 100,
            rotate: Math.random() * 360,
            opacity: 0,
          }}
          transition={{ duration: 0.8, delay: i * 0.05 }}
          className="absolute top-1/2 left-1/2 w-4 h-4 bg-amber-100"
          style={{
            clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)',
          }}
        />
      ))}
    </motion.div>
  );
}
