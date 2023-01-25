import express, { Express } from 'express';
import dotenv from 'dotenv';
import { DBServiceOldSQL } from './services/db-service-oldsql';
import { BatController, PvController } from './controllers';

dotenv.config();

const app: Express = express();
const PORT = process.env.PORT;
const dbSvc = new DBServiceOldSQL();

app.listen(
  PORT,
  () => console.log("Smart Home API is alive! (on port " + PORT + ")")
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

new PvController(dbSvc).init(app);
new BatController(dbSvc).init(app);