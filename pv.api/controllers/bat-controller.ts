import { Express, Request, Response } from 'express';
import { BatChargeEntry } from '../api-models/bat-charge-entry';
import { PostBatCharge } from '../api-models/contracts/post-bat-charge';
import { DBServiceMySQL } from '../services/db-service-mysql';
import { modelValidator } from './model-validator';

export class BatController {
  private dbSvc: DBServiceMySQL;
  private basePath: string = process.env.BASE_PATH as string;

  constructor(dbService: DBServiceMySQL) {
    this.dbSvc = dbService;
  }

  public init(app: Express): void {
    app.get(this.basePath + '/bat/:id', async (req: Request, res: Response) => {
      const id = req.params.id as string;
      const entry = await this.dbSvc.getBatEntry(+id);

      res.status(200).send(entry);
    });

    app.post(this.basePath + '/bat', async (req: Request<PostBatCharge>, res: Response<BatChargeEntry | null | { errorMessage: string }>) => {
      const error = modelValidator(req.body, [
        { name: 'voltage', type: 'number' },
        { name: 'current', type: 'number' },
        { name: 'temp', type: 'number' },
      ]);
      if (error !== null) {
        res.status(418).send(error);
        return;
      } else {
        const result = await this.dbSvc.saveBatEntry(req.body as PostBatCharge);
        res.status(200).send(result as BatChargeEntry | null);
      }
    })
  }
}