import { OkPacket } from "mysql";
import mysql, { Connection } from "promise-mysql";
import { PostBatCharge } from "../api-models/contracts/post-bat-charge";
import { PostPvCharge } from "../api-models/contracts/post-pv-charge";
import { BatChargeDTO } from "../models/bat-charge";
import { PvChargeDTO } from "../models/pv-charge";
import { DbService } from "./db-service";

export class DBServiceMySQL implements DbService {
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
      ) as OkPacket;
      return this.getPvEntry(result.insertId);
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

  public async getLastPv(): Promise<PvChargeDTO | null> {
    if (this.connection !== undefined) {
      const result = await this.connection.query(
        `SELECT * FROM \`PvCharges\` ORDER BY \`createdAt\` DESC LIMIT 1`
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

  public async getPvTimerange(startDate: Date, endDate: Date): Promise<PvChargeDTO[]> {
    if (this.connection !== undefined) {
      const result = await this.connection.query(
        `SELECT * FROM \`PvCharges\` 
        WHERE \`createdAt\` > '${startDate.toLocalISOString().slice(0, 19).replace('T', ' ')}' 
        AND \`createdAt\` < '${endDate.toLocalISOString().slice(0, 19).replace('T', ' ')}' 
        ORDER BY \`createdAt\` ASC `
      );
      if (result.length > 0) {
        return result;
      } else {
        return [];
      }
    } else {
      return [];
    }
  }

  public async saveBatEntry(batChargeEntry: PostBatCharge): Promise<BatChargeDTO | null> {
    if (this.connection !== undefined) {
      const result = await this.connection.query(
        `
      INSERT INTO \`BatCharges\` (\`voltage\`,\`current\`,\`temp\`) 
      VALUES (${batChargeEntry.voltage},${batChargeEntry.current},${batChargeEntry.temp})
      `
      ) as OkPacket;
      return this.getBatEntry(result.insertId);
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

  public async getLastBatery(): Promise<BatChargeDTO | null> {
    if (this.connection !== undefined) {
      const result = await this.connection.query(
        `SELECT * FROM \`BatCharges\` ORDER BY \`createdAt\` DESC LIMIT 1`
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

  public async getBateryTimerange(startDate: Date, endDate: Date): Promise<BatChargeDTO[]> {
    if (this.connection !== undefined) {
      const result = await this.connection.query(
        `SELECT * FROM \`BatCharges\` 
        WHERE \`createdAt\` > '${startDate.toLocalISOString().slice(0, 19).replace('T', ' ')}' 
        AND \`createdAt\` < '${endDate.toLocalISOString().slice(0, 19).replace('T', ' ')}' 
        ORDER BY \`createdAt\` ASC `
      );
      if (result.length > 0) {
        return result;
      } else {
        return [];
      }
    } else {
      return [];
    }
  }

  public async areEntriesOutdated(): Promise<boolean | null> {
    if (this.connection !== undefined) {
      const resultBattery = await this.connection.query(
        `SELECT 1 FROM \`BatCharges\` WHERE \`createdAt\` > DATE_SUB(NOW(), INTERVAL 5 MINUTE) LIMIT 1;`
      );
      const resultPv = await this.connection.query(
        `SELECT 1 FROM \`PvCharges\` WHERE \`createdAt\` > DATE_SUB(NOW(), INTERVAL 5 MINUTE) LIMIT 1;`
      );
      if (resultPv.length > 0 || resultBattery.length > 0) {
        return false;
      } else {
        return true;
      }
    } else {
      return null;
    }
  }
}