import { EnergyItem } from "../models/energy-item";
import { EnergySummary } from "../models/energy-summary";

const SECOND = 1000;

export class EnergyService {
  constructor() {
  }

  public calculateEnergy(energyData: EnergyItem[]): EnergySummary | null {
    const fiveMinutes = SECOND * 60 * 5;
    const oneHour = SECOND * 60 * 60;
    const oneMinute = SECOND * 60;
    var kWhEnergy = 0;
    var sumEnergy = 0;

    function errorCase(i: number): void {
      kWhEnergy = oneMinute / oneHour * energyData[i].voltage * energyData[i].current / 1000;
      sumEnergy = sumEnergy + kWhEnergy;
    }

    energyData.sort((a,b) => a.creationTime > b.creationTime ? 1 : -1);

    if (energyData.length > 0) {
      for (var i = 0; i < energyData.length; i++) {
        if (energyData[i + 1]) {
          var timeDiff = energyData[i + 1].creationTime.getTime() - energyData[i].creationTime.getTime()
          if (fiveMinutes > timeDiff && timeDiff > 0) {
            kWhEnergy = (timeDiff / oneHour) * (energyData[i].voltage * energyData[i].current / 1000);
            sumEnergy = sumEnergy + kWhEnergy;
          } else {
            errorCase(i);
          }
        } else {
          errorCase(i);
        }
      }

      const maxPower = Math.max(...(energyData.map(a => a.power)));
      const averagePower= energyData.filter(a => a.power !== 0).reduce((s, a) => s + a.power, 0) / energyData.filter(a => a.power !== 0).length;

      return new EnergySummary(
        energyData[0].creationTime,
        energyData[energyData.length - 1].creationTime,
        +sumEnergy.toFixed(3),
        maxPower,
        +averagePower.toFixed(3)
      );
    }

    return null;
  }
}