import { Express, Request, Response } from 'express';
import { BatChargeEntry } from '../api-models/bat-charge-entry';
import { PvChargeEntry } from '../api-models/pv-charge-entry';
import { Summary } from '../api-models/summary';
import { SummaryTimerange } from '../api-models/summary-timerange';
import { DBServiceMySQL } from "../services/db-service-mysql";

export class SummaryController {
  private dbSvc: DBServiceMySQL;
  private basePath: string = process.env.BASE_PATH as string;

  constructor(dbService: DBServiceMySQL) {
    this.dbSvc = dbService;
  }

  public init(app: Express): void {
    app.get(this.basePath + '/summary', async (req: Request, res: Response) => {
      if (req.query.startDate || req.query.endDate) {
        await this.getDateRangeSummary(req, res);
      } else {
        await this.getCurrentSummary(res);
      }
    });
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
}