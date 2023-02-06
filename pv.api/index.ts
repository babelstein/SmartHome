import express, { Express } from 'express';
import dotenv from 'dotenv';

import { BatController, PvController } from './controllers';
import { DBServiceMySQL } from './services/db-service-mysql';

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