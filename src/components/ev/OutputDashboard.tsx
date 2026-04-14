import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Gauge, Zap, Battery, Wind, Activity, Download } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { computeSimulation, generateSpeedSweep, generateDriveCycleData, type SimInputs, type DriveCycle } from '@/lib/evPhysics';
import type { VehicleSelection } from '@/pages/Index';

interface Props {
  inputs: SimInputs;
  selection: VehicleSelection;
  onBack: () => void;
}

const cycles: { id: DriveCycle; label: string }[] = [
  { id: 'urban', label: 'Urban' },
  { id: 'highway', label: 'Highway' },
  { id: 'mixed', label: 'Mixed' },
];

const OutputDashboard = ({ inputs, selection, onBack }: Props) => {
  const [driveCycle, setDriveCycle] = useState<DriveCycle>('urban');

  const results = useMemo(() => computeSimulation(inputs), [inputs]);
  const speedSweep = useMemo(() => generateSpeedSweep(inputs), [inputs]);
  const cycleData = useMemo(() => generateDriveCycleData(inputs, driveCycle), [inputs, driveCycle]);

  const kpis = [
    { label: 'Motor Speed', value: results.motorSpeed.toFixed(1), unit: 'RPM', icon: Gauge, color: 'text-primary' },
    { label: 'Motor Torque', value: results.motorTorque.toFixed(2), unit: 'Nm', icon: Activity, color: 'text-secondary' },
    { label: 'Battery Power', value: results.batteryPower.toFixed(0), unit: 'W', icon: Battery, color: 'text-neon-cyan' },
    { label: 'Tractive Force', value: results.totalTractiveForce.toFixed(1), unit: 'N', icon: Wind, color: 'text-primary' },
    { label: 'Efficiency', value: results.overallEfficiency.toFixed(1), unit: '%', icon: Zap, color: 'text-secondary' },
    { label: 'PWM Duty', value: results.pwmDuty.toFixed(1), unit: '%', icon: Activity, color: 'text-neon-cyan' },
  ];

  const exportCSV = () => {
    const headers = 'Speed (km/h),Torque (Nm),Power (W),PWM (%)';
    const rows = speedSweep.map(r => `${r.speed},${r.torque},${r.power},${r.pwm}`).join('\n');
    const blob = new Blob([headers + '\n' + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ev_simulation_${selection.brand}_${selection.type}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="relative min-h-screen flex flex-col z-10 p-4 md:p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={onBack}
          className="glass-card px-4 py-2 flex items-center gap-2 text-muted-foreground hover:text-foreground cursor-pointer">
          <ArrowLeft className="w-4 h-4" />
          <span className="font-body text-sm">Back</span>
        </motion.button>
        <div className="text-center">
          <h1 className="font-display text-lg md:text-xl text-primary neon-text-blue">Simulation Results</h1>
          <p className="text-muted-foreground text-xs font-body">{selection.brand} • {selection.type}</p>
        </div>
        <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={exportCSV}
          className="glass-card px-4 py-2 flex items-center gap-2 text-primary cursor-pointer hover:neon-glow-blue">
          <Download className="w-4 h-4" />
          <span className="font-body text-sm">CSV</span>
        </motion.button>
      </div>

      {/* KPI Cards */}
      <div className="perspective-container grid grid-cols-3 md:grid-cols-6 gap-3 mb-4">
        {kpis.map((kpi, i) => {
          const Icon = kpi.icon;
          return (
            <motion.div
              key={kpi.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              whileHover={{ rotateX: -5, rotateY: 5, scale: 1.05 }}
              className="card-3d glass-card p-4 text-center"
            >
              <Icon className={`w-6 h-6 mx-auto mb-1 ${kpi.color}`} />
              <div className={`font-display text-2xl font-bold ${kpi.color}`}>{kpi.value}</div>
              <div className="text-muted-foreground text-xs font-body">{kpi.unit}</div>
              <div className="text-muted-foreground text-[10px] font-body mt-0.5">{kpi.label}</div>
            </motion.div>
          );
        })}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-1 min-h-0">
        {/* Speed vs Torque & Power */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="glass-card p-4 flex flex-col">
          <h3 className="font-display text-xs text-muted-foreground mb-2 uppercase tracking-wider">Speed vs Torque & Power</h3>
          <div className="flex-1 min-h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={speedSweep}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(217 33% 18%)" />
                <XAxis dataKey="speed" stroke="hsl(215 20% 55%)" tick={{ fontSize: 10 }} label={{ value: 'Speed (km/h)', position: 'insideBottom', offset: -5, style: { fontSize: 10, fill: 'hsl(215 20% 55%)' } }} />
                <YAxis yAxisId="torque" stroke="hsl(199 89% 48%)" tick={{ fontSize: 10 }} label={{ value: 'Torque (Nm)', angle: -90, position: 'insideLeft', style: { fontSize: 10, fill: 'hsl(199 89% 48%)' } }} />
                <YAxis yAxisId="power" orientation="right" stroke="hsl(152 69% 45%)" tick={{ fontSize: 10 }} label={{ value: 'Power (W)', angle: 90, position: 'insideRight', style: { fontSize: 10, fill: 'hsl(152 69% 45%)' } }} />
                <Tooltip contentStyle={{ backgroundColor: 'hsl(222 47% 8%)', border: '1px solid hsl(217 33% 18%)', borderRadius: 8, fontSize: 11 }} />
                <Legend wrapperStyle={{ fontSize: 10 }} />
                <Line yAxisId="torque" type="monotone" dataKey="torque" stroke="hsl(199 89% 48%)" strokeWidth={2} dot={false} name="Torque (Nm)" />
                <Line yAxisId="power" type="monotone" dataKey="power" stroke="hsl(152 69% 45%)" strokeWidth={2} dot={false} name="Power (W)" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* PWM Drive Cycle */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }} className="glass-card p-4 flex flex-col">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-display text-xs text-muted-foreground uppercase tracking-wider">PWM vs Drive Cycle</h3>
            <div className="flex gap-1">
              {cycles.map(c => (
                <button
                  key={c.id}
                  onClick={() => setDriveCycle(c.id)}
                  className={`px-2 py-0.5 rounded text-[10px] font-display transition-all cursor-pointer
                    ${driveCycle === c.id ? 'bg-primary/20 text-primary neon-glow-blue' : 'text-muted-foreground hover:text-foreground'}`}
                >
                  {c.label}
                </button>
              ))}
            </div>
          </div>
          <div className="flex-1 min-h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={cycleData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(217 33% 18%)" />
                <XAxis dataKey="time" stroke="hsl(215 20% 55%)" tick={{ fontSize: 10 }} label={{ value: 'Time (%)', position: 'insideBottom', offset: -5, style: { fontSize: 10, fill: 'hsl(215 20% 55%)' } }} />
                <YAxis stroke="hsl(215 20% 55%)" tick={{ fontSize: 10 }} />
                <Tooltip contentStyle={{ backgroundColor: 'hsl(222 47% 8%)', border: '1px solid hsl(217 33% 18%)', borderRadius: 8, fontSize: 11 }} />
                <Legend wrapperStyle={{ fontSize: 10 }} />
                <Line type="monotone" dataKey="speed" stroke="hsl(199 89% 48%)" strokeWidth={2} dot={false} name="Speed (km/h)" />
                <Line type="monotone" dataKey="pwm" stroke="hsl(152 69% 45%)" strokeWidth={2} dot={false} name="PWM (%)" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default OutputDashboard;
