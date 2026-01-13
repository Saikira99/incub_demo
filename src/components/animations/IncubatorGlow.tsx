import { motion } from 'framer-motion';

interface IncubatorGlowProps {
  children: React.ReactNode;
  className?: string;
  intensity?: 'low' | 'medium' | 'high';
}

export function IncubatorGlow({ children, className = '', intensity = 'medium' }: IncubatorGlowProps) {
  const glowIntensity = {
    low: 'shadow-[0_0_30px_hsl(42_90%_55%/0.15)]',
    medium: 'shadow-[0_0_50px_hsl(42_90%_55%/0.25)]',
    high: 'shadow-[0_0_80px_hsl(42_90%_55%/0.35)]',
  };

  return (
    <motion.div
      className={`relative ${className}`}
      animate={{
        boxShadow: [
          '0 0 30px hsl(42 90% 55% / 0.2)',
          '0 0 50px hsl(42 90% 55% / 0.35)',
          '0 0 30px hsl(42 90% 55% / 0.2)',
        ],
      }}
      transition={{
        duration: 3,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
    >
      {children}
    </motion.div>
  );
}

export function HeatWaves({ className = '' }: { className?: string }) {
  return (
    <div className={`absolute inset-x-0 bottom-0 h-1/3 overflow-hidden pointer-events-none ${className}`}>
      {[...Array(5)].map((_, i) => (
        <motion.div
          key={i}
          initial={{ y: '100%', opacity: 0 }}
          animate={{ 
            y: '-100%',
            opacity: [0, 0.3, 0],
          }}
          transition={{
            duration: 3,
            delay: i * 0.4,
            repeat: Infinity,
            ease: 'easeOut',
          }}
          className="absolute bottom-0 left-0 right-0 h-8"
          style={{
            background: `linear-gradient(to top, hsl(24 85% 55% / 0.1), transparent)`,
            left: `${i * 20}%`,
            width: '20%',
          }}
        />
      ))}
    </div>
  );
}

export function TemperatureIndicator({ temp = 37.5, className = '' }: { temp?: number; className?: string }) {
  const isOptimal = temp >= 37 && temp <= 38;

  return (
    <motion.div
      animate={isOptimal ? {
        scale: [1, 1.05, 1],
      } : {}}
      transition={{ duration: 2, repeat: Infinity }}
      className={`flex items-center gap-2 px-4 py-2 rounded-full ${
        isOptimal ? 'bg-success/20 text-success' : 'bg-warning/20 text-warning'
      } ${className}`}
    >
      <motion.div
        animate={{ 
          scale: [1, 1.2, 1],
          opacity: [0.5, 1, 0.5],
        }}
        transition={{ duration: 1.5, repeat: Infinity }}
        className={`w-2 h-2 rounded-full ${isOptimal ? 'bg-success' : 'bg-warning'}`}
      />
      <span className="font-mono font-semibold text-sm">{temp.toFixed(1)}°C</span>
    </motion.div>
  );
}

export function HumidityIndicator({ humidity = 60, className = '' }: { humidity?: number; className?: string }) {
  return (
    <div className={`flex items-center gap-2 px-4 py-2 rounded-full bg-accent/20 ${className}`}>
      <motion.svg
        animate={{ 
          y: [0, -2, 0],
        }}
        transition={{ duration: 1, repeat: Infinity }}
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="currentColor"
        className="text-accent"
      >
        <path d="M8 2 C8 2 4 7 4 10 C4 12.5 5.8 14 8 14 C10.2 14 12 12.5 12 10 C12 7 8 2 8 2" />
      </motion.svg>
      <span className="font-mono font-semibold text-sm text-accent">{humidity}% RH</span>
    </div>
  );
}

export function ProgressRing({ progress = 75, size = 80, className = '' }: { progress?: number; size?: number; className?: string }) {
  const strokeWidth = 6;
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (progress / 100) * circumference;

  return (
    <div className={`relative ${className}`} style={{ width: size, height: size }}>
      <svg width={size} height={size} className="transform -rotate-90">
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="hsl(var(--muted))"
          strokeWidth={strokeWidth}
        />
        {/* Progress circle */}
        <motion.circle
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.5, ease: 'easeOut' }}
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="url(#progressGradient)"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
        />
        <defs>
          <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="hsl(24 85% 55%)" />
            <stop offset="100%" stopColor="hsl(42 90% 55%)" />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="font-display font-bold text-lg">{progress}%</span>
      </div>
    </div>
  );
}
