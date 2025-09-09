export interface BatteryInfo {
  id: number;
  voltage: number; // in volts
  current: number; // in amperes
  temp: number; // in Celsius
  createdAt: string; // timestamp
}

export interface PVInfo {
  id: number;
  voltage: number; // in volts
  current: number; // in amperes
  power: number; // in watts
  createdAt: string; // timestamp
}

export interface LiveDataResponse {
  batteryInfo: BatteryInfo;
  pvInfo: PVInfo;
}

export interface GaugeSegment {
  from: number;
  to: number;
  color: string;
}