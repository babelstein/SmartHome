import { QueryTypes, Sequelize } from "sequelize";
import { PostBatCharge } from "../api-models/contracts/post-bat-charge";
import { PostPvCharge } from "../api-models/contracts/post-pv-charge";
import { BatChargeDTO } from "../models/bat-charge";
import { PvChargeDTO } from "../models/pv-charge";

export class DBServiceOldSQL {
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
    this.sequelize.query(
      `CREATE TABLE IF NOT EXISTS \`PvCharges\` 
      (
          \`id\` INTEGER PRIMARY KEY AUTO_INCREMENT, 
          \`voltage\` DECIMAL(5,2) NOT NULL, 
          \`current\` DECIMAL(5,2) NOT NULL, 
          \`power\` DECIMAL(5,2) NOT NULL, 
          \`createdAt\` DATETIME NOT NULL DEFAULT NOW()
      );`
    );

    this.sequelize.query(
      `CREATE TABLE IF NOT EXISTS \`BatCharges\` 
      (
          \`id\` INTEGER PRIMARY KEY AUTO_INCREMENT, 
          \`voltage\` DECIMAL(5,2) NOT NULL, 
          \`current\` DECIMAL(5,2) NOT NULL, 
          \`temp\` DECIMAL(5,2) NOT NULL, 
          \`createdAt\` DATETIME NOT NULL DEFAULT NOW()
      );`
    )
  }

  public async savePvEntry(pvChargeEntry: PostPvCharge): Promise<PvChargeDTO | null> {
    const result = await this.sequelize.query(
      `
      INSERT INTO \`PvCharges\` (\`voltage\`,\`current\`,\`power\`) 
      VALUES (${pvChargeEntry.voltage},${pvChargeEntry.current},${pvChargeEntry.power})
      `,
      { type: QueryTypes.INSERT, }
    );
    return this.getPvEntry(result[0]);
  }

  public async getPvEntry(id: number): Promise<PvChargeDTO | null> {
    const result = await this.sequelize.query(
      `
      SELECT * FROM \`PvCharges\` 
      WHERE \`id\` = ${id}
      `,
      { type: QueryTypes.SELECT, model: PvChargeDTO, mapToModel: true }
    );
    if (result.length > 0) {
      return result[0];
    } else {
      return null;
    }
  }

  public async saveBatEntry(batChargeEntry: PostBatCharge): Promise<BatChargeDTO | null> {
    const result = await this.sequelize.query(
      `
      INSERT INTO \`BatCharges\` (\`voltage\`,\`current\`,\`temp\`) 
      VALUES (${batChargeEntry.voltage},${batChargeEntry.current},${batChargeEntry.temp})
      `,
      { type: QueryTypes.INSERT, }
    );
    return this.getBatEntry(result[0]);
  }

  public async getBatEntry(id: number): Promise<BatChargeDTO | null> {
    const result = await this.sequelize.query(
      `
      SELECT * FROM \`BatCharges\` 
      WHERE \`id\` = ${id}
      `,
      { type: QueryTypes.SELECT, model: BatChargeDTO, mapToModel: true }
    );
    if (result.length > 0) {
      return result[0];
    } else {
      return null;
    }
  }
}