import { addMinutes } from "date-fns";
import { EnergyItem } from "../models/energy-item";
import { EnergyService } from "./energy.service";

const testData500wh = [] as EnergyItem[];
for (var i = 0; i < 60; i++) {
  testData500wh.push(
    { id: i, creationTime: addMinutes(new Date('2023-01-01T10:00:00Z'), i), current: 10, voltage: 50, power: 500 }
  );
}

const testDataOneItem = [
  { id: 0, creationTime: new Date('2023-01-01T11:00:00Z'), current: 10, voltage: 300, power: 3000 }
];

const testData1kWh = [] as EnergyItem[];
for (var i = 0; i < 60; i++) {
  testData1kWh.push(
    { id: 60+i, creationTime: addMinutes(new Date('2023-01-01T15:00:00Z'), i), current: 20, voltage: 50, power: 1000 }
  );
}

describe('Energy service tests', () => {
  const energyService = new EnergyService();

  test('calculate energy should return 0.5kWh', () => {
    expect(energyService.calculateEnergy(testData500wh).energy).toBe(0.5);
  });

  test('should calculate energy when there\'s only one item in collection', () => {
    var result = energyService.calculateEnergy(testDataOneItem);
    expect(result).toBeTruthy();
    expect(result.energy).toBe(0.05);
  });

  test('should return null when no empty collection passed', () => {
    var result = energyService.calculateEnergy([]);
    expect(result).toBeNull();
  });

  test('should calculate properly when collection with gaps passed', () => {
    var result = energyService.calculateEnergy([...testData500wh, ...testData1kWh]);
    expect(result).toBeTruthy();
    expect(result.energy).toBe(1.5);
  });

  test('should calculate properly when collection is not ordered', () => {
    var result = energyService.calculateEnergy([...testData1kWh, ...testData500wh]);
    expect(result).toBeTruthy();
    expect(result.energy).toBe(1.5);
  });
});