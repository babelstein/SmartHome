import express, { Express } from 'express';
import dotenv from 'dotenv';

import { BatController, PvController } from './controllers';
import { DBServiceMySQL } from './services/db-service-mysql';
import { SummaryController } from './controllers/summary-controller';

dotenv.config();

const app: Express = express();
const PORT = process.env.PORT;
const dbSvc = new DBServiceMySQL();
dbSvc.init().then(_ => {});

app.listen(
  PORT,
  () => console.log("Smart Home API is alive! (on port " + PORT + ")")
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

new PvController(dbSvc).init(app);
new BatController(dbSvc).init(app);
new SummaryController(dbSvc).init(app);

declare global {
  interface Date {
    toLocalISOString(): string;
  }
}

Date.prototype.toLocalISOString = function (): string {
  var tzoffset = (new Date()).getTimezoneOffset() * 60000;
  return (new Date(this.getTime() - tzoffset)).toISOString().slice(0, -1);
}