import { useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Props {
  vehicleType?: string;
}

const vehicleThemes: Record<string, { orbs: string[]; accent: string }> = {
  '2-Wheeler': {
    orbs: [
      'radial-gradient(circle, #00F5FF33 0%, transparent 70%)',
      'radial-gradient(circle, #0EA5E922 0%, transparent 70%)',
      'radial-gradient(circle, #22D3EE1A 0%, transparent 70%)',
    ],
    accent: '#00F5FF',
  },
  '3-Wheeler': {
    orbs: [
      'radial-gradient(circle, #22C55E2A 0%, transparent 70%)',
      'radial-gradient(circle, #EAB30822 0%, transparent 70%)',
      'radial-gradient(circle, #10B98118 0%, transparent 70%)',
    ],
    accent: '#22C55E',
  },
  '4-Wheeler': {
    orbs: [
      'radial-gradient(circle, #8B5CF62A 0%, transparent 70%)',
      'radial-gradient(circle, #EC489922 0%, transparent 70%)',
      'radial-gradient(circle, #A855F718 0%, transparent 70%)',
    ],
    accent: '#8B5CF6',
  },
};

const defaultTheme = {
  orbs: [
    'radial-gradient(circle, #00F5FF20 0%, transparent 70%)',
    'radial-gradient(circle, #8B5CF618 0%, transparent 70%)',
    'radial-gradient(circle, #EC489912 0%, transparent 70%)',
  ],
  accent: '#00F5FF',
};

const AnimatedBackground = ({ vehicleType }: Props) => {
  const theme = vehicleType ? vehicleThemes[vehicleType] || defaultTheme : defaultTheme;

  // Generate particles
  const particles = useMemo(() => {
    return Array.from({ length: 30 }, (_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      size: Math.random() * 3 + 1,
      duration: Math.random() * 8 + 6,
      delay: Math.random() * 10,
      color: ['#00F5FF', '#8B5CF6', '#EC4899', '#22C55E', '#EAB308'][Math.floor(Math.random() * 5)],
    }));
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {/* Base animated gradient */}
      <div className="absolute inset-0 bg-animated-gradient" />

      {/* Dark readability overlay */}
      <div className="absolute inset-0 bg-background/50" />

      {/* Moving 3D grid floor */}
      <div className="absolute bottom-0 left-0 right-0 h-[50vh] moving-grid opacity-40"
        style={{ transformOrigin: 'bottom center' }} />

      {/* Light ray */}
      <div className="absolute top-[-50%] left-[25%] w-[800px] h-[800px] light-ray"
        style={{
          background: `conic-gradient(from 0deg, transparent 0deg, ${theme.accent}08 30deg, transparent 60deg, ${theme.accent}05 150deg, transparent 180deg, ${theme.accent}08 270deg, transparent 300deg)`,
        }}
      />

      {/* Glowing orbs that change with vehicle type */}
      <AnimatePresence mode="wait">
        <motion.div
          key={vehicleType || 'default'}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.2 }}
          className="absolute inset-0"
        >
          {/* Orb 1 - top left */}
          <div
            className="absolute top-[-5%] left-[-5%] w-[550px] h-[550px] rounded-full orb-1"
            style={{ background: theme.orbs[0], filter: 'blur(40px)' }}
          />
          {/* Orb 2 - right center */}
          <div
            className="absolute top-[25%] right-[-8%] w-[650px] h-[650px] rounded-full orb-2"
            style={{ background: theme.orbs[1], filter: 'blur(50px)' }}
          />
          {/* Orb 3 - bottom */}
          <div
            className="absolute bottom-[-10%] left-[15%] w-[600px] h-[600px] rounded-full orb-3"
            style={{ background: theme.orbs[2], filter: 'blur(45px)' }}
          />
        </motion.div>
      </AnimatePresence>

      {/* Extra accent orbs for vibrancy */}
      <div
        className="absolute top-[60%] right-[25%] w-[400px] h-[400px] rounded-full orb-2"
        style={{ background: 'radial-gradient(circle, #EC489910 0%, transparent 70%)', filter: 'blur(30px)' }}
      />
      <div
        className="absolute top-[10%] left-[40%] w-[350px] h-[350px] rounded-full orb-3"
        style={{ background: 'radial-gradient(circle, #EAB3080A 0%, transparent 70%)', filter: 'blur(25px)' }}
      />

      {/* Floating particles */}
      {particles.map(p => (
        <div
          key={p.id}
          className="particle"
          style={{
            left: p.left,
            width: `${p.size}px`,
            height: `${p.size}px`,
            background: p.color,
            boxShadow: `0 0 ${p.size * 3}px ${p.color}60`,
            animationDuration: `${p.duration}s`,
            animationDelay: `${p.delay}s`,
          }}
        />
      ))}

      {/* Dot grid overlay */}
      <div className="absolute inset-0" style={{
        backgroundImage: `radial-gradient(circle at 1px 1px, hsl(199 89% 48% / 0.04) 1px, transparent 0)`,
        backgroundSize: '40px 40px',
      }} />
    </div>
  );
};

export default AnimatedBackground;
