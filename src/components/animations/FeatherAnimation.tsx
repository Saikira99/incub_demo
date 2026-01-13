import { motion } from 'framer-motion';

interface FeatherProps {
  className?: string;
  delay?: number;
  color?: string;
}

export function Feather({ className = '', delay = 0, color = 'hsl(28 45% 35%)' }: FeatherProps) {
  return (
    <motion.svg
      initial={{ y: -20, rotate: -45, opacity: 0 }}
      animate={{ 
        y: [0, 10, -5, 15, 0],
        rotate: [-45, -30, -50, -35, -45],
        opacity: [0, 1, 1, 1, 0],
      }}
      transition={{
        duration: 8,
        delay,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
      className={className}
      width="32"
      height="64"
      viewBox="0 0 32 64"
      fill="none"
    >
      <path
        d="M16 0 C16 0 8 16 8 32 C8 48 16 64 16 64 C16 64 24 48 24 32 C24 16 16 0 16 0"
        fill={color}
        opacity="0.8"
      />
      <path
        d="M16 8 L16 56"
        stroke="hsl(28 35% 25%)"
        strokeWidth="1"
        opacity="0.5"
      />
      {/* Feather barbs */}
      {[...Array(12)].map((_, i) => (
        <path
          key={i}
          d={`M16 ${12 + i * 4} L${8 + Math.sin(i) * 2} ${14 + i * 4}`}
          stroke={color}
          strokeWidth="0.5"
          opacity="0.6"
        />
      ))}
      {[...Array(12)].map((_, i) => (
        <path
          key={`r-${i}`}
          d={`M16 ${12 + i * 4} L${24 - Math.sin(i) * 2} ${14 + i * 4}`}
          stroke={color}
          strokeWidth="0.5"
          opacity="0.6"
        />
      ))}
    </motion.svg>
  );
}

export function FloatingFeathers() {
  const featherColors = [
    'hsl(28 45% 35%)',
    'hsl(35 50% 45%)',
    'hsl(42 40% 50%)',
    'hsl(24 55% 40%)',
  ];

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {[...Array(5)].map((_, i) => (
        <motion.div
          key={i}
          initial={{ 
            x: `${20 + i * 15}%`,
            y: '-10%',
          }}
          animate={{ 
            x: [`${20 + i * 15}%`, `${25 + i * 15}%`, `${15 + i * 15}%`, `${22 + i * 15}%`],
            y: ['110%'],
          }}
          transition={{
            duration: 20 + i * 3,
            delay: i * 4,
            repeat: Infinity,
            ease: 'linear',
          }}
          className="absolute"
        >
          <Feather 
            color={featherColors[i % featherColors.length]} 
            delay={i * 0.5}
          />
        </motion.div>
      ))}
    </div>
  );
}

export function ChickIcon({ className = '' }: { className?: string }) {
  return (
    <motion.div
      animate={{ y: [0, -3, 0] }}
      transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
      className={className}
    >
      <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
        {/* Body */}
        <ellipse cx="24" cy="30" rx="14" ry="12" fill="hsl(48 95% 65%)" />
        {/* Head */}
        <circle cx="24" cy="16" r="10" fill="hsl(48 95% 68%)" />
        {/* Beak */}
        <path d="M24 18 L28 22 L24 26 L20 22 Z" fill="hsl(24 90% 55%)" />
        {/* Eyes */}
        <circle cx="20" cy="14" r="2" fill="hsl(25 25% 15%)" />
        <circle cx="28" cy="14" r="2" fill="hsl(25 25% 15%)" />
        <circle cx="19" cy="13" r="0.8" fill="white" />
        <circle cx="27" cy="13" r="0.8" fill="white" />
        {/* Wing */}
        <ellipse cx="16" cy="30" rx="4" ry="6" fill="hsl(48 90% 60%)" />
        <ellipse cx="32" cy="30" rx="4" ry="6" fill="hsl(48 90% 60%)" />
        {/* Feet */}
        <path d="M20 42 L18 46 L20 46 L22 42" stroke="hsl(24 80% 50%)" strokeWidth="2" fill="none" />
        <path d="M28 42 L26 46 L28 46 L30 42" stroke="hsl(24 80% 50%)" strokeWidth="2" fill="none" />
        {/* Tuft */}
        <path d="M24 6 Q26 2 24 4 Q22 2 24 6" fill="hsl(24 80% 50%)" />
      </svg>
    </motion.div>
  );
}
