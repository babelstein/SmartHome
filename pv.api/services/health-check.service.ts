import cron from 'node-cron';
import { DbService } from './db-service';

export class HealthCheckService {
  private dbSvc: DbService;
  
  constructor(dbService: DbService) {
    this.dbSvc = dbService;
  }

  start(): void {
    cron.schedule('10 * * * *', async () => {
      console.log('DB values check');
      if(await this.dbSvc.areEntriesOutdated()){
       
      }
    });
  }

  
}