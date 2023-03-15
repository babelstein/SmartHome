import { endOfDay, endOfMonth, endOfWeek, startOfDay, startOfMonth, startOfWeek } from 'date-fns';
import { Express, Request, Response } from 'express';
import { BatChargeEntry } from '../api-models/bat-charge-entry';
import { PvChargeEntry } from '../api-models/pv-charge-entry';
import { Summary } from '../api-models/summary';
import { SummaryTimerange } from '../api-models/summary-timerange';
import { EnergyItem } from '../models/energy-item';
import { DBServiceMySQL } from "../services/db-service-mysql";
import { EnergyService } from '../services/energy.service';
import { modelValidator } from './model-validator';

export class SummaryController {
  private dbSvc: DBServiceMySQL;
  private energyService: EnergyService;
  private basePath: string = process.env.BASE_PATH as string;

  constructor(dbService: DBServiceMySQL) {
    this.dbSvc = dbService;
    this.energyService = new EnergyService();
  }

  public init(app: Express): void {
    app.get(this.basePath + '/summary', async (req: Request, res: Response) => {
      if (req.query.startDate || req.query.endDate) {
        await this.getDateRangeSummary(req, res);
      } else {
        await this.getCurrentSummary(res);
      }
    });

    app.get(this.basePath + '/summary/production', async (req: Request, res: Response) => {
      const error = modelValidator(req.query, [
        { name: 'date', type: 'string' },
        { name: 'aggregation', type: 'string', valuesAccepted: ['day', 'week', 'month'] }
      ], false);
      if (error !== null) {
        res.status(400).send(error);
        return;
      } else {
        const date = new Date(req.query.date as string);
        const aggregation = req.query.aggregation as 'day' | 'week' | 'month';
        await this.getProducedEnergySummary(date, aggregation, res);
      }
    })
  }

  private async getCurrentSummary(res: Response<any, Record<string, any>>) {
    const lastBattery = await this.dbSvc.getLastBatery();
    const lastPv = await this.dbSvc.getLastPv();

    const result = {
      batteryInfo: lastBattery,
      pvInfo: lastPv
    } as Summary;

    res.status(200).send(result);
  }

  private async getDateRangeSummary(req: Request, res: Response<any, Record<string, any>>) {
    const startDate = new Date(req.query.startDate as string);
    const endDate = new Date(req.query.endDate as string);

    const batteryEntries = (await this.dbSvc.getBateryTimerange(startDate, endDate)).map(a => (
      {
        id: a.id,
        creationTime: a.createdAt,
        current: a.current,
        temp: a.temp,
        voltage: a.voltage
      } as BatChargeEntry
    ));
    const pvEntries = (await this.dbSvc.getPvTimerange(startDate, endDate)).map(a => (
      {
        id: a.id,
        creationTime: a.createdAt,
        current: a.current,
        voltage: a.voltage,
        power: a.power
      } as PvChargeEntry
    ));

    const result = {
      battery: batteryEntries,
      pv: pvEntries
    } as SummaryTimerange;

    res.status(200).send(result);
  }

  private async getProducedEnergySummary(date: Date, aggregation: 'day' | 'month' | 'week', res: Response<any, Record<string, any>>) {
    let startDate = new Date();
    let endDate = new Date();

    switch (aggregation) {
      case 'day':
        startDate = startOfDay(date);
        endDate = endOfDay(date);
        break;
      case 'week':
        startDate = startOfWeek(date, { weekStartsOn: 1 });
        endDate = endOfWeek(date, { weekStartsOn: 1 });
        break;
      case 'month':
        startDate = startOfMonth(date);
        endDate = endOfMonth(date)
    };

    const pvEntries = (await this.dbSvc.getPvTimerange(startDate, endDate)).map(a => (
      {
        id: a.id,
        creationTime: a.createdAt,
        current: a.current,
        voltage: a.voltage,
        power: a.power
      } as EnergyItem
    ));
    
    const productionSummary = this.energyService.calculateEnergy(pvEntries);

    res.status(200).send(productionSummary);
  }
}