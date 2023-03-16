export class EnergySummary {
  startTime: Date;
  endTime: Date;
  energy: number;
  maxPower: number;
  averagePower: number;

  constructor(startTime: Date, endTime: Date, energy: number, maxPower: number, averagePower: number) {
      this.startTime = startTime;
      this.endTime = endTime;
      this.energy = energy;
      this.maxPower = maxPower;
      this.averagePower = averagePower;
  }
}