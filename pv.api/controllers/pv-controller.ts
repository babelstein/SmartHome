import { Express, Request, Response } from 'express';
import { PostPvCharge } from '../api-models/contracts/post-pv-charge';
import { PvChargeEntry } from '../api-models/pv-charge-entry';
import { DBServiceOldSQL } from '../services/db-service-oldsql';
import { modelValidator } from './model-validator';

export class PvController {
  private dbSvc: DBServiceOldSQL;

  constructor(dbService: DBServiceOldSQL) {
    this.dbSvc = dbService;
  }

  public init(app: Express): void {
    app.get('/pv/entry/:id', async (req: Request, res: Response<PvChargeEntry | null>) => {
      const id = req.params.id as string;
      const entry = await this.dbSvc.getPvEntry(+id);

      res.status(200).send(entry as PvChargeEntry | null);
    });

    app.post('/pv/entry', async (req: Request<PostPvCharge>, res: Response<PvChargeEntry | null | { errorMessage: string }>) => {
      const error = modelValidator(req.body, [
        { name: 'voltage', type: 'number' },
        { name: 'current', type: 'number' },
        { name: 'power', type: 'number' },
      ]);
      if (error !== null) {
        res.status(418).send(error);
        return;
      } else {
        const result = await this.dbSvc.savePvEntry(req.body);
        res.status(200).send(result as PvChargeEntry | null);
      }
    })
  }
}