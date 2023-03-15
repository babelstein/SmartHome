export class EnergySummary {
  startTime;
  endTime;
  energy;
  constructor(startTime: Date, endTime: Date, energy: number) {
      this.startTime = startTime;
      this.endTime = endTime;
      this.energy = energy;
  }
}