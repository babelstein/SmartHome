import mysql, { Connection } from "promise-mysql";
import { PostBatCharge } from "../api-models/contracts/post-bat-charge";
import { PostPvCharge } from "../api-models/contracts/post-pv-charge";
import { BatChargeDTO } from "../models/bat-charge";
import { PvChargeDTO } from "../models/pv-charge";

export class DBServiceMySQL {
  private connection?: Connection;

  constructor() { }

  public async init(): Promise<void> {
    await this.testConnection();
    await this.syncModels();
  }

  private async testConnection(): Promise<void> {
    this.connection = await mysql.createConnection(
      {
        host: process.env.DB_HOST as string,
        user: process.env.DB_USERNAME as string,
        password: process.env.DB_PASSWORD as string,
        database: process.env.DB_NAME as string,
      }
    );
  }

  private async syncModels(): Promise<void> {
    if (this.connection !== undefined)
      await this.connection.query(
        `CREATE TABLE IF NOT EXISTS \`PvCharges\` 
      (
          \`id\` INTEGER PRIMARY KEY AUTO_INCREMENT, 
          \`voltage\` DECIMAL(5,2) NOT NULL, 
          \`current\` DECIMAL(5,2) NOT NULL, 
          \`power\` DECIMAL(5,2) NOT NULL, 
          \`createdAt\` DATETIME NOT NULL DEFAULT NOW()
      );`
      );

    if (this.connection !== undefined)
      await this.connection.query(
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
    if (this.connection !== undefined) {
      const result = await this.connection.query(
        `
        INSERT INTO \`PvCharges\` (\`voltage\`,\`current\`,\`power\`) 
        VALUES (${pvChargeEntry.voltage},${pvChargeEntry.current},${pvChargeEntry.power})
        `,
      );
      console.log(result);
      return this.getPvEntry(result[0]);
    } else {
      return null;
    }
  }

  public async getPvEntry(id: number): Promise<PvChargeDTO | null> {
    if (this.connection !== undefined) {
      const result = await this.connection.query(
        `
      SELECT * FROM \`PvCharges\` 
      WHERE \`id\` = ${id}
      `,
      );
      if (result.length > 0) {
        return result[0];
      } else {
        return null;
      }
    } else {
      return null;
    }
  }

  public async saveBatEntry(batChargeEntry: PostBatCharge): Promise<BatChargeDTO | null> {
    if (this.connection !== undefined) {
      const result = await this.connection.query(
        `
      INSERT INTO \`BatCharges\` (\`voltage\`,\`current\`,\`temp\`) 
      VALUES (${batChargeEntry.voltage},${batChargeEntry.current},${batChargeEntry.temp})
      `
      );
      return this.getBatEntry(result[0]);
    } else {
      return null;
    }
  }

  public async getBatEntry(id: number): Promise<BatChargeDTO | null> {
    if (this.connection !== undefined) {
      const result = await this.connection.query(
        `
      SELECT * FROM \`BatCharges\` 
      WHERE \`id\` = ${id}
      `
      );
      if (result.length > 0) {
        return result[0];
      } else {
        return null;
      }
    } else {
      return null;
    }
  }
}