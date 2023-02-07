import { Express, Request, Response } from 'express';
import { PostPvCharge } from '../api-models/contracts/post-pv-charge';
import { PvChargeEntry } from '../api-models/pv-charge-entry';
import { DBServiceMySQL } from '../services/db-service-mysql';
import { modelValidator } from './model-validator';

export class PvController {
  private dbSvc: DBServiceMySQL;
  private basePath: string = process.env.BASE_PATH as string;
  private secret: string = process.env.SECRET as string;

  constructor(dbService: DBServiceMySQL) {
    this.dbSvc = dbService;
  }

  public init(app: Express): void {
    app.get(this.basePath + '/pv/:id', async (req: Request, res: Response<PvChargeEntry | null>) => {
      const id = req.params.id as string;
      const entry = await this.dbSvc.getPvEntry(+id);

      res.status(200).send(entry as PvChargeEntry | null);
    });

    app.post(this.basePath + '/pv', async (req: Request<PostPvCharge>, res: Response<PvChargeEntry | null | { errorMessage: string }>) => {
      if (this.secret !== req.headers['authorization']) {
        res.status(401).send();
        return;
      }
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