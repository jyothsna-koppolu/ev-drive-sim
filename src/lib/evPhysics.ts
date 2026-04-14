export const AIR_DENSITY = 1.225; // kg/m³
export const GRAVITY = 9.81; // m/s²

export interface SimInputs {
  vehicleMass: number;
  driverMass: number;
  frontalArea: number;
  dragCoefficient: number;
  rollingResistance: number;
  inclinationAngle: number;
  acceleration: number;
  vehicleSpeed: number; // km/h
  wheelRadius: number;
  gearRatio: number;
  transmissionEfficiency: number;
  motorEfficiency: number;
  controllerEfficiency: number;
}

export interface SimResults {
  gvw: number;
  aerodynamicForce: number;
  rollingResistanceForce: number;
  gradientForce: number;
  accelerationForce: number;
  totalTractiveForce: number;
  wheelTorque: number;
  wheelSpeed: number;
  motorTorque: number;
  motorSpeed: number;
  motorPower: number;
  batteryPower: number;
  overallEfficiency: number;
  pwmDuty: number;
}

export function computeSimulation(inputs: SimInputs): SimResults {
  const speedMs = inputs.vehicleSpeed / 3.6;
  const gvw = inputs.vehicleMass + inputs.driverMass;
  const incRad = (inputs.inclinationAngle * Math.PI) / 180;

  const aerodynamicForce = 0.5 * AIR_DENSITY * inputs.dragCoefficient * inputs.frontalArea * speedMs * speedMs;
  const rollingResistanceForce = inputs.rollingResistance * gvw * GRAVITY * Math.cos(incRad);
  const gradientForce = gvw * GRAVITY * Math.sin(incRad);
  const accelerationForce = gvw * inputs.acceleration;
  const totalTractiveForce = aerodynamicForce + rollingResistanceForce + gradientForce + accelerationForce;

  const wheelSpeed = inputs.wheelRadius > 0 ? speedMs / inputs.wheelRadius : 0; // rad/s
  const wheelTorque = totalTractiveForce * inputs.wheelRadius;

  const motorSpeed = wheelSpeed * inputs.gearRatio; // rad/s
  const motorSpeedRPM = (motorSpeed * 60) / (2 * Math.PI);
  const motorTorque = inputs.gearRatio > 0 && inputs.transmissionEfficiency > 0
    ? wheelTorque / (inputs.gearRatio * inputs.transmissionEfficiency)
    : 0;

  const motorPower = motorTorque * motorSpeed;
  const overallEff = inputs.motorEfficiency * inputs.controllerEfficiency * inputs.transmissionEfficiency;
  const batteryPower = overallEff > 0 ? motorPower / overallEff : 0;

  // PWM duty cycle approximation (based on speed ratio to max 150 km/h)
  let pwmDuty = (inputs.vehicleSpeed / 150) * 100;
  if (inputs.inclinationAngle > 5) pwmDuty = Math.min(100, pwmDuty * 1.2);
  if (inputs.acceleration > 2) pwmDuty = Math.min(100, pwmDuty * 1.1);
  pwmDuty = Math.max(0, Math.min(100, pwmDuty));

  return {
    gvw,
    aerodynamicForce,
    rollingResistanceForce,
    gradientForce,
    accelerationForce,
    totalTractiveForce,
    wheelTorque,
    wheelSpeed,
    motorTorque,
    motorSpeed: motorSpeedRPM,
    motorPower,
    batteryPower,
    overallEfficiency: overallEff * 100,
    pwmDuty,
  };
}

export type DriveCycle = 'urban' | 'highway' | 'uphill' | 'braking';

export interface DriveCyclePoint {
  time: number;
  speed: number;
  pwm: number;
  torque: number;
  power: number;
}

export function generateDriveCycleData(inputs: SimInputs, cycle: DriveCycle): DriveCyclePoint[] {
  const points: DriveCyclePoint[] = [];
  const steps = 50;

  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    let speed: number;

    switch (cycle) {
      case 'urban':
        speed = 40 * Math.sin(t * Math.PI * 2) * 0.5 + 30;
        break;
      case 'highway':
        speed = 80 + 40 * t;
        break;
      case 'uphill':
        speed = 60 * (1 - 0.3 * t);
        break;
      case 'braking':
        speed = 100 * (1 - t * t);
        break;
    }
    speed = Math.max(0, speed);

    const sim = computeSimulation({ ...inputs, vehicleSpeed: speed });
    points.push({
      time: Math.round(t * 100),
      speed: Math.round(speed * 10) / 10,
      pwm: Math.round(sim.pwmDuty * 10) / 10,
      torque: Math.round(sim.motorTorque * 100) / 100,
      power: Math.round(sim.motorPower),
    });
  }
  return points;
}

export function generateSpeedSweep(inputs: SimInputs): { speed: number; torque: number; power: number; pwm: number }[] {
  const data = [];
  for (let s = 0; s <= 150; s += 5) {
    const sim = computeSimulation({ ...inputs, vehicleSpeed: s });
    data.push({
      speed: s,
      torque: Math.round(sim.motorTorque * 100) / 100,
      power: Math.round(sim.motorPower),
      pwm: Math.round(sim.pwmDuty * 10) / 10,
    });
  }
  return data;
}
