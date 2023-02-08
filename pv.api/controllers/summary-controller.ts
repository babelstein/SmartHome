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
      if (req.query.startTime || req.query.startTime) {
        const startTime = new Date(req.query.startTime as string);

        const bateryEntries = (await this.dbSvc.getBateryTimerange(startTime)).map(a => (
          {
            id: a.id,
            creationTime: a.createdAt,
            current: a.current,
            temp: a.temp,
            voltage: a.voltage
          } as BatChargeEntry
        ));
        const pvEntries = (await this.dbSvc.getPvTimerange(startTime)).map(a => (
          {
            id: a.id,
            creationTime: a.createdAt,
            current: a.current,
            voltage: a.voltage,
            power: a.power
          } as PvChargeEntry
        ));

        const result = {
          battery: bateryEntries,
          pv: pvEntries
        } as SummaryTimerange;

        res.status(200).send(result);
      } else {
        const lastBatery = await this.dbSvc.getLastBatery();
        const lastPv = await this.dbSvc.getLastPv();

        const result = {
          lastBatery,
          lastPv
        } as Summary;

        res.status(200).send(result);
      }
    });
  }
}