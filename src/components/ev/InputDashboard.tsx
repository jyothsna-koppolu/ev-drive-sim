import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Lock, Play, Weight, Wind, Gauge, CircleDot, RotateCw, Zap, Settings, Cog } from 'lucide-react';
import { AIR_DENSITY, GRAVITY, type SimInputs } from '@/lib/evPhysics';
import type { VehicleSelection } from '@/pages/Index';

interface Props {
  selection: VehicleSelection;
  onBack: () => void;
  onSimulate: (inputs: SimInputs) => void;
}

interface FieldDef {
  key: keyof SimInputs;
  label: string;
  unit: string;
  min: number;
  max: number;
  step: number;
  icon: React.ElementType;
  hasSlider?: boolean;
}

const fields: FieldDef[] = [
  { key: 'vehicleMass', label: 'Vehicle Mass', unit: 'kg', min: 0, max: 10000, step: 1, icon: Weight },
  { key: 'driverMass', label: 'Driver Mass', unit: 'kg', min: 0, max: 300, step: 1, icon: Weight },
  { key: 'frontalArea', label: 'Frontal Area', unit: 'm²', min: 0, max: 20, step: 0.01, icon: Wind },
  { key: 'dragCoefficient', label: 'Drag Coefficient', unit: '', min: 0, max: 2, step: 0.01, icon: Wind },
  { key: 'rollingResistance', label: 'Rolling Resistance', unit: '', min: 0, max: 1, step: 0.001, icon: CircleDot },
  { key: 'inclinationAngle', label: 'Inclination Angle', unit: '°', min: -30, max: 30, step: 0.5, icon: RotateCw },
  { key: 'acceleration', label: 'Acceleration', unit: 'm/s²', min: 0, max: 20, step: 0.1, icon: Gauge },
  { key: 'vehicleSpeed', label: 'Vehicle Speed', unit: 'km/h', min: 0, max: 150, step: 1, icon: Gauge, hasSlider: true },
  { key: 'wheelRadius', label: 'Wheel Radius', unit: 'm', min: 0, max: 2, step: 0.01, icon: CircleDot },
  { key: 'gearRatio', label: 'Gear Ratio', unit: '', min: 0, max: 50, step: 0.1, icon: Cog },
  { key: 'transmissionEfficiency', label: 'Transmission Eff.', unit: '', min: 0, max: 1, step: 0.01, icon: Settings, hasSlider: true },
  { key: 'motorEfficiency', label: 'Motor Efficiency', unit: '', min: 0, max: 1, step: 0.01, icon: Zap, hasSlider: true },
  { key: 'controllerEfficiency', label: 'Controller Eff.', unit: '', min: 0, max: 1, step: 0.01, icon: Settings, hasSlider: true },
];

const InputDashboard = ({ selection, onBack, onSimulate }: Props) => {
  const [values, setValues] = useState<Record<string, string>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});

  const setValue = useCallback((key: string, val: string) => {
    setValues(prev => ({ ...prev, [key]: val }));
    setErrors(prev => { const n = { ...prev }; delete n[key]; return n; });
  }, []);

  const validate = (): SimInputs | null => {
    const errs: Record<string, string> = {};
    const result: Record<string, number> = {};

    for (const f of fields) {
      const raw = values[f.key];
      if (!raw && raw !== '0') { errs[f.key] = 'Required'; continue; }
      const num = parseFloat(raw);
      if (isNaN(num)) { errs[f.key] = 'Invalid number'; continue; }
      if (f.key !== 'inclinationAngle' && num < 0) { errs[f.key] = 'No negatives'; continue; }
      if (num < f.min || num > f.max) { errs[f.key] = `${f.min}–${f.max}`; continue; }
      result[f.key] = num;
    }

    setErrors(errs);
    if (Object.keys(errs).length > 0) return null;
    return result as unknown as SimInputs;
  };

  const handleSimulate = () => {
    const data = validate();
    if (data) onSimulate(data);
  };

  return (
    <div className="relative min-h-screen flex flex-col z-10 p-4 md:p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={onBack}
          className="glass-card px-4 py-2 flex items-center gap-2 text-muted-foreground hover:text-foreground cursor-pointer">
          <ArrowLeft className="w-4 h-4" />
          <span className="font-body text-sm">Back</span>
        </motion.button>
        <div className="text-center">
          <h1 className="font-display text-lg md:text-xl text-primary neon-text-blue">Input Dashboard</h1>
          <p className="text-muted-foreground text-xs font-body">{selection.brand} • {selection.type}</p>
        </div>
        <div className="w-20" />
      </div>

      {/* Constants */}
      <div className="flex justify-center gap-3 mb-3">
        {[
          { label: 'Air Density', value: `${AIR_DENSITY} kg/m³` },
          { label: 'Gravity', value: `${GRAVITY} m/s²` },
        ].map(c => (
          <motion.div
            key={c.label}
            whileHover={{ rotateX: -3, rotateY: 3 }}
            className="card-3d glass-card-locked px-5 py-3 flex items-center gap-2"
          >
            <Lock className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground font-body">{c.label}:</span>
            <span className="text-sm text-foreground font-display font-semibold">{c.value}</span>
          </motion.div>
        ))}
      </div>

      {/* Input Grid */}
      <div className="perspective-container grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 flex-1">
        {fields.map((f, i) => {
          const Icon = f.icon;
          const err = errors[f.key];
          return (
            <motion.div
              key={f.key}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.03 }}
              whileHover={{ rotateX: -2, rotateY: 2, scale: 1.02 }}
              className={`card-3d glass-card p-3 flex flex-col gap-1.5 ${err ? 'border-destructive/50' : ''}`}
            >
              <label className="flex items-center gap-1.5 font-body text-muted-foreground" style={{ fontSize: '16px' }}>
                <Icon className="w-4 h-4 text-primary/70 flex-shrink-0" />
                <span className="truncate">{f.label}</span>
                {f.unit && <span className="text-primary/40 text-xs">({f.unit})</span>}
              </label>
              <div className="relative">
                <Icon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-primary/30 pointer-events-none" />
                <input
                  type="number"
                  step={f.step}
                  min={f.min}
                  max={f.max}
                  value={values[f.key] ?? ''}
                  onChange={e => setValue(f.key, e.target.value)}
                  placeholder={`${f.min}–${f.max}`}
                  className="input-futuristic w-full pl-9"
                  style={{ fontSize: '20px' }}
                />
              </div>
              {f.hasSlider && values[f.key] && (
                <input
                  type="range"
                  min={f.min}
                  max={f.max}
                  step={f.step}
                  value={parseFloat(values[f.key]) || f.min}
                  onChange={e => setValue(f.key, e.target.value)}
                  className="w-full h-2 bg-muted rounded-full appearance-none cursor-pointer accent-primary mt-1"
                />
              )}
              {err && <span className="text-destructive text-xs font-body">{err}</span>}
            </motion.div>
          );
        })}
      </div>

      {/* Simulate Button */}
      <div className="flex justify-center mt-4">
        <motion.button
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleSimulate}
          className="gradient-btn font-display text-base font-bold px-12 py-4 rounded-xl text-primary-foreground tracking-wider cursor-pointer pulse-glow"
        >
          <span className="flex items-center gap-2">
            <Play className="w-5 h-5" />
            Run Simulation
          </span>
        </motion.button>
      </div>
    </div>
  );
};

export default InputDashboard;
