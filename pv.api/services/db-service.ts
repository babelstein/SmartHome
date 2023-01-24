import { QueryTypes, Sequelize } from "sequelize";
import { PostPvCharge } from "../api-models/contracts/post-pv-charge";
import { PvChargeDTO } from "../models/pv-charge";

export class DBService {
  private sequelize: Sequelize;

  constructor() {
    this.sequelize = new Sequelize(
      process.env.DB_NAME as string, 
      process.env.DB_USERNAME as string,
      process.env.DB_PASSWORD as string, {
      host: process.env.DB_HOST as string,
      dialect: 'mysql'
    });

    this.testConnection();
    this.syncModels();
  }

  private async testConnection(): Promise<void> {
    try {
      await this.sequelize.authenticate();
      console.log('Connection has been established successfully.');
    } catch (error) {
      console.error('Unable to connect to the database:', error);
    }
  }

  private async syncModels(): Promise<void> {
    console.info("Models syncronization");
    await PvChargeDTO.sync({ force: true });
    await this.sequelize.sync({ force: true });
  }

  public async savePvEntry(pvChargeEntry: PostPvCharge): Promise<PvChargeDTO> {
    console.log(pvChargeEntry.current);
    const entry = PvChargeDTO.build(
      {
        id: 10000,
        current: pvChargeEntry.current,
        power: pvChargeEntry.power,
        voltage: pvChargeEntry.voltage
      }
    );
    
    await this.sequelize.query(
      "INSERT INTO `PvCharges` (`id`,`voltage`,`current`,`power`,`createdAt`) VALUES (5555,5,5,25,'2023-01-22T10:15:07.979Z')", 
      { type: QueryTypes.INSERT, });

    
    return entry.save();
  }

  public getPvEntry(id: number): Promise<PvChargeDTO | null> {
    return PvChargeDTO.findByPk(id);
  }
}