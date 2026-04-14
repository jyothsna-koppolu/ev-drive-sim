import { motion } from 'framer-motion';
import type { VehicleSelection } from '@/pages/Index';
import { Zap, Car, Bike, Truck } from 'lucide-react';

const brands = ['Tata Motors', 'Tesla', 'Mahindra', 'Hyundai', 'BYD'];
const vehicleTypes = [
  { id: '2-Wheeler', icon: Bike, label: '2-Wheeler' },
  { id: '3-Wheeler', icon: Truck, label: '3-Wheeler' },
  { id: '4-Wheeler', icon: Car, label: '4-Wheeler' },
];

interface Props {
  selection: VehicleSelection;
  setSelection: (s: VehicleSelection) => void;
  onStart: () => void;
}

const LandingPage = ({ selection, setSelection, onStart }: Props) => {
  const canStart = selection.brand && selection.type;

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center px-4 py-8 z-10">
      {/* Title */}
      <motion.div initial={{ y: -30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.6 }} className="text-center mb-10">
        <h1 className="font-display text-3xl md:text-5xl font-bold text-primary neon-text-blue mb-3">
          EV Simulator
        </h1>
        <p className="text-muted-foreground text-lg font-body">3D Electric Vehicle Performance Simulator</p>
      </motion.div>

      {/* Brand Selection */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="w-full max-w-4xl mb-8">
        <h2 className="font-display text-sm uppercase tracking-widest text-muted-foreground mb-4 text-center">Select Brand</h2>
        <div className="perspective-container flex flex-wrap justify-center gap-3">
          {brands.map((brand, i) => (
            <motion.button
              key={brand}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + i * 0.05 }}
              whileHover={{ rotateX: -3, rotateY: 3, scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => setSelection({ ...selection, brand })}
              className={`card-3d glass-card px-6 py-4 font-display text-sm font-semibold tracking-wide cursor-pointer transition-all duration-300
                ${selection.brand === brand ? 'neon-glow-blue border-primary/60 text-primary' : 'text-muted-foreground hover:text-foreground'}`}
            >
              {brand}
            </motion.button>
          ))}
        </div>
      </motion.div>

      {/* Vehicle Type */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="w-full max-w-3xl mb-10">
        <h2 className="font-display text-sm uppercase tracking-widest text-muted-foreground mb-4 text-center">Vehicle Type</h2>
        <div className="perspective-container flex justify-center gap-4">
          {vehicleTypes.map((vt, i) => {
            const Icon = vt.icon;
            const selected = selection.type === vt.id;
            return (
              <motion.button
                key={vt.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 + i * 0.1 }}
                whileHover={{ rotateY: 5, scale: 1.05 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => setSelection({ ...selection, type: vt.id })}
                className={`card-3d glass-card px-8 py-6 flex flex-col items-center gap-3 cursor-pointer transition-all duration-300 min-w-[120px]
                  ${selected ? 'neon-glow-green border-secondary/60' : 'hover:border-primary/30'}`}
              >
                <Icon className={`w-8 h-8 ${selected ? 'text-secondary' : 'text-muted-foreground'}`} />
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
        whileHover={canStart ? { scale: 1.05 } : {}}
        whileTap={canStart ? { scale: 0.95 } : {}}
        disabled={!canStart}
        onClick={onStart}
        className={`gradient-btn font-display text-lg font-bold px-12 py-4 rounded-xl text-primary-foreground tracking-wider transition-all duration-300
          ${canStart ? 'pulse-glow cursor-pointer' : 'opacity-30 cursor-not-allowed'}`}
      >
        <span className="flex items-center gap-3">
          <Zap className="w-5 h-5" />
          Start Simulation
        </span>
      </motion.button>

      {!canStart && (
        <p className="text-muted-foreground text-sm mt-3 font-body">Select a brand and vehicle type to begin</p>
      )}
    </div>
  );
};

export default LandingPage;
