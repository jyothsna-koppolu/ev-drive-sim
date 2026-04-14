import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import LandingPage from '@/components/ev/LandingPage';
import InputDashboard from '@/components/ev/InputDashboard';
import OutputDashboard from '@/components/ev/OutputDashboard';
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
      {/* Animated colorful background */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, hsl(var(--neon-blue) / 0.06) 1px, transparent 0)`,
          backgroundSize: '40px 40px',
        }} />
        {/* Colorful gradient orbs */}
        <div className="absolute top-[-10%] left-[-5%] w-[500px] h-[500px] rounded-full floating-animation"
          style={{ background: 'radial-gradient(circle, hsl(199 89% 48% / 0.12) 0%, transparent 70%)' }} />
        <div className="absolute top-[30%] right-[-10%] w-[600px] h-[600px] rounded-full floating-animation"
          style={{ background: 'radial-gradient(circle, hsl(152 69% 45% / 0.1) 0%, transparent 70%)', animationDelay: '-2s' }} />
        <div className="absolute bottom-[-10%] left-[20%] w-[550px] h-[550px] rounded-full floating-animation"
          style={{ background: 'radial-gradient(circle, hsl(270 80% 55% / 0.08) 0%, transparent 70%)', animationDelay: '-4s' }} />
        <div className="absolute top-[10%] right-[30%] w-[400px] h-[400px] rounded-full floating-animation"
          style={{ background: 'radial-gradient(circle, hsl(330 80% 50% / 0.06) 0%, transparent 70%)', animationDelay: '-3s' }} />
        <div className="absolute bottom-[20%] right-[10%] w-[450px] h-[450px] rounded-full floating-animation"
          style={{ background: 'radial-gradient(circle, hsl(50 90% 50% / 0.05) 0%, transparent 70%)', animationDelay: '-5s' }} />
      </div>

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
