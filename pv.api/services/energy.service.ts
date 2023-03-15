import { EnergyItem } from "../models/energy-item";
import { EnergySummary } from "../models/energy-summary";

const SECOND = 1000;

export class EnergyService {
  constructor() {
  }

  public calculateEnergy(energyData: EnergyItem[]): EnergySummary {
    const fiveMinutes = SECOND * 60 * 5;
    const oneHour = SECOND * 60 * 60;
    const oneMinute = SECOND * 60;
    var kWhEnergy = 0;
    var sumEnergy = 0;
    for (var i = 0; i < energyData.length - 1; i++) {
      var timeDiff = energyData[i + 1].creationTime.getTime() - energyData[i].creationTime.getTime()
      if (fiveMinutes > timeDiff && timeDiff > 0) {
        kWhEnergy = (timeDiff / oneHour) * (energyData[i].voltage * energyData[i].current / 1000);
        sumEnergy = sumEnergy + kWhEnergy;
      }
      else {
        kWhEnergy = oneMinute / oneHour * energyData[i].voltage * energyData[i].current / 1000;
        sumEnergy = sumEnergy + kWhEnergy;
      }
    }

    return new EnergySummary(
      energyData[0].creationTime,
      energyData[energyData.length - 1].creationTime,
      +sumEnergy.toFixed(3)
    );
  }
}