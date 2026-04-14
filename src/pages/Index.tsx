import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import LandingPage from '@/components/ev/LandingPage';
import InputDashboard from '@/components/ev/InputDashboard';
import OutputDashboard from '@/components/ev/OutputDashboard';
import AnimatedBackground from '@/components/ev/AnimatedBackground';
import type { SimInputs } from '@/lib/evPhysics';

export type AppPhase = 'landing' | 'input' | 'output';

export interface VehicleSelection {
  brand: string;
  type: string;
}

const Index = () => {
  const [phase, setPhase] = useState<AppPhase>('landing');
  const [selection, setSelection] = useState<VehicleSelection>({ brand: '', type: '' });
  const [inputs, setInputs] = useState<SimInputs | null>(null);

  return (
    <div className="min-h-screen overflow-hidden relative">
      {/* Vibrant animated 3D background */}
      <AnimatedBackground vehicleType={selection.type} />

      <AnimatePresence mode="wait">
        {phase === 'landing' && (
          <motion.div key="landing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, x: -100 }} transition={{ duration: 0.4 }}>
            <LandingPage selection={selection} setSelection={setSelection} onStart={() => setPhase('input')} />
          </motion.div>
        )}
        {phase === 'input' && (
          <motion.div key="input" initial={{ opacity: 0, x: 100 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -100 }} transition={{ duration: 0.4 }}>
            <InputDashboard selection={selection} onBack={() => setPhase('landing')} onSimulate={(data) => { setInputs(data); setPhase('output'); }} />
          </motion.div>
        )}
        {phase === 'output' && inputs && (
          <motion.div key="output" initial={{ opacity: 0, x: 100 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -100 }} transition={{ duration: 0.4 }}>
            <OutputDashboard inputs={inputs} selection={selection} onBack={() => setPhase('input')} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Index;
