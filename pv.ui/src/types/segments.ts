import { GaugeSegment } from "./models";

export const BATTERY_VOLTAGE: GaugeSegment[] = [
    { from: 17, to: 20, color: 'red' },
    { from: 20, to: 22, color: 'orange' },
    { from: 22, to: 29, color: 'green' },
]

export const BATTERY_CURRENT: GaugeSegment[] = [
    { from: 0, to: 30, color: '#3b82f6' },
]

export const CHARGER_TEMP: GaugeSegment[] = [
    { from: -20, to: 20, color: '#3b82f6' },
    { from: 20, to: 38, color: 'orange' },
    { from: 38, to: 60, color: 'red' },
]

export const PV_VOLTAGE: GaugeSegment[] = [
    { from: 0, to: 80, color: '#3b82f6' },
]
export const PV_CURRENT: GaugeSegment[] = [
    { from: 0, to: 30, color: '#3b82f6' },
]
export const PV_POWER: GaugeSegment[] = [
    { from: 0, to: 1200, color: '#3b82f6' },
]