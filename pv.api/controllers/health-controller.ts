import { Express, Request, Response } from 'express';

export class HealthController {
  private basePath: string = process.env.BASE_PATH as string;

  constructor() {
  }

  public init(app: Express): void {
    app.get(this.basePath + '/health', async (_, res: Response<string>) => {
      res.status(200).send('*beep*');
    });
  }
}