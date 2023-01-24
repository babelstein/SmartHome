import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import { PostPvCharge } from './api-models/contracts/post-pv-charge';
import { DBServiceOldSQL } from './services/db-service-oldsql';

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

app.get('/pv/entry/:id', async (req: Request, res: Response) => {
  const id = req.params.id as string;
  const entry = await dbSvc.getPvEntry(+id);
  
  res.status(200).send(entry);
});

app.post('/pv/entry', async (req: Request<PostPvCharge>, res: Response) => {
  if(!req.body.voltage) {
    res.status(418).send({message: 'voltage field is missing'})
  }
  if(!req.body.current) {
    res.status(418).send({message: 'current field is missing'})
  }
  if(!req.body.power) {
    res.status(418).send({message: 'power field is missing'})
  }

  const result = await dbSvc.savePvEntry(req.body as PostPvCharge);
  
  res.status(200).send(result);
})