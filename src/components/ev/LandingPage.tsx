import { motion, AnimatePresence } from 'framer-motion';
import type { VehicleSelection } from '@/pages/Index';
import { Zap } from 'lucide-react';
import ev2Wheeler from '@/assets/ev-2wheeler.jpg';
import ev3Wheeler from '@/assets/ev-3wheeler.jpg';
import ev4Wheeler from '@/assets/ev-4wheeler.jpg';
import icon2Wheeler from '@/assets/icon-2wheeler.png';
import icon3Wheeler from '@/assets/icon-3wheeler.png';
import icon4Wheeler from '@/assets/icon-4wheeler.png';

const brands = [
  { name: 'Tata Motors', initials: 'T', color: '#0066CC' },
  { name: 'Tesla', initials: 'T', color: '#E31937' },
  { name: 'Mahindra', initials: 'M', color: '#D4213D' },
  { name: 'Hyundai', initials: 'H', color: '#002C5F' },
  { name: 'BYD', initials: 'B', color: '#1A1A1A' },
  { name: 'Ola Electric', initials: 'O', color: '#00B140' },
  { name: 'MG Motor', initials: 'MG', color: '#C8102E' },
  { name: 'Kia', initials: 'K', color: '#05141F' },
  { name: 'BMW', initials: 'BMW', color: '#0066B1' },
  { name: 'Mercedes-Benz', initials: 'MB', color: '#333333' },
  { name: 'Audi', initials: 'A', color: '#BB0A30' },
  { name: 'Rivian', initials: 'R', color: '#F5A623' },
  { name: 'NIO', initials: 'N', color: '#00A0E8' },
  { name: 'Ather Energy', initials: 'AE', color: '#00C853' },
  { name: 'Hero Electric', initials: 'HE', color: '#E60012' },
];
const vehicleTypes = [
  { id: '2-Wheeler', image: icon2Wheeler, label: '2-Wheeler' },
  { id: '3-Wheeler', image: icon3Wheeler, label: '3-Wheeler' },
  { id: '4-Wheeler', image: icon4Wheeler, label: '4-Wheeler' },
];

const vehicleImages: Record<string, string> = {
  '2-Wheeler': ev2Wheeler,
  '3-Wheeler': ev3Wheeler,
  '4-Wheeler': ev4Wheeler,
};

interface Props {
  selection: VehicleSelection;
  setSelection: (s: VehicleSelection) => void;
  onStart: () => void;
}

const LandingPage = ({ selection, setSelection, onStart }: Props) => {
  const canStart = selection.brand && selection.type;
  const bgImage = selection.type ? vehicleImages[selection.type] : null;

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center px-4 py-8 z-10 overflow-hidden">
      {/* Dynamic EV Background */}
      <AnimatePresence mode="wait">
        {bgImage && (
          <motion.div
            key={selection.type}
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 0.18, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.8 }}
            className="fixed inset-0 z-0 pointer-events-none"
          >
            <img
              src={bgImage}
              alt=""
              className="w-full h-full object-cover floating-animation"
              style={{ filter: 'blur(3px)' }}
              width={1920}
              height={1080}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-background/40" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Title */}
      <motion.div initial={{ y: -30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.6 }} className="text-center mb-8 relative z-10">
        <h1 className="font-display text-2xl md:text-4xl lg:text-5xl font-bold text-primary neon-text-blue mb-3 leading-tight">
          Automated Motor Speed Control
          <br />
          <span className="text-secondary neon-text-green">&amp; Braking System</span>
        </h1>
        <p className="text-muted-foreground text-base md:text-lg font-body mt-2">
          PWM-Based Electric Vehicle Simulator with Real-Time Physics
        </p>
      </motion.div>

      {/* Brand Selection */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="w-full max-w-4xl mb-8 relative z-10">
        <h2 className="font-display text-sm uppercase tracking-widest text-muted-foreground mb-4 text-center">Select Brand</h2>
        <div className="perspective-container flex flex-wrap justify-center gap-3">
          {brands.map((brand, i) => (
            <motion.button
              key={brand.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + i * 0.05 }}
              whileHover={{ rotateX: -5, rotateY: 5, scale: 1.08, z: 30 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => setSelection({ ...selection, brand: brand.name })}
              className={`card-3d glass-card px-5 py-3 font-display text-sm font-semibold tracking-wide cursor-pointer transition-all duration-300 flex items-center gap-2.5
                ${selection.brand === brand.name ? 'neon-glow-blue border-primary/60 text-primary' : 'text-muted-foreground hover:text-foreground'}`}
            >
              <span
                className="flex items-center justify-center rounded-full text-white font-bold text-[10px] shrink-0"
                style={{ background: brand.color, width: 28, height: 28, boxShadow: `0 0 10px ${brand.color}60` }}
              >
                {brand.initials}
              </span>
              {brand.name}
            </motion.button>
          ))}
        </div>
      </motion.div>

      {/* Vehicle Type */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="w-full max-w-3xl mb-10 relative z-10">
        <h2 className="font-display text-sm uppercase tracking-widest text-muted-foreground mb-4 text-center">Vehicle Type</h2>
        <div className="perspective-container flex justify-center gap-4">
          {vehicleTypes.map((vt, i) => {
            const selected = selection.type === vt.id;
            return (
              <motion.button
                key={vt.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 + i * 0.1 }}
                whileHover={{ rotateY: 8, scale: 1.08 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => setSelection({ ...selection, type: vt.id })}
                className={`card-3d glass-card px-8 py-6 flex flex-col items-center gap-3 cursor-pointer transition-all duration-300 min-w-[150px]
                  ${selected ? 'neon-glow-green border-secondary/60' : 'hover:border-primary/30'}`}
              >
                <img src={vt.image} alt={vt.label} className="w-16 h-16 object-contain" width={64} height={64} />
                <span className={`font-display text-xs font-semibold tracking-wide ${selected ? 'text-secondary neon-text-green' : 'text-muted-foreground'}`}>
                  {vt.label}
                </span>
              </motion.button>
            );
          })}
        </div>
      </motion.div>

      {/* Start Button */}
      <motion.button
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.8 }}
        whileHover={canStart ? { scale: 1.08 } : {}}
        whileTap={canStart ? { scale: 0.95 } : {}}
        disabled={!canStart}
        onClick={onStart}
        className={`relative z-10 gradient-btn font-display text-lg font-bold px-14 py-5 rounded-xl text-primary-foreground tracking-wider transition-all duration-300
          ${canStart ? 'pulse-glow cursor-pointer' : 'opacity-30 cursor-not-allowed'}`}
      >
        <span className="flex items-center gap-3">
          <Zap className="w-6 h-6" />
          Start Simulation
        </span>
      </motion.button>

      {!canStart && (
        <p className="text-muted-foreground text-sm mt-3 font-body relative z-10">Select a brand and vehicle type to begin</p>
      )}
    </div>
  );
};

export default LandingPage;
