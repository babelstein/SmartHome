import { PostBatCharge } from "../api-models/contracts/post-bat-charge";
import { PostPvCharge } from "../api-models/contracts/post-pv-charge";
import { BatChargeDTO } from "../models/bat-charge";
import { PvChargeDTO } from "../models/pv-charge";

export interface DbService {
  init(): Promise<void>;
  getPvEntry(id: number): Promise<PvChargeDTO | null>;
  getBatEntry(id: number): Promise<BatChargeDTO | null>;
  getLastPv(): Promise<PvChargeDTO | null>;
  getLastBatery(): Promise<BatChargeDTO | null>;
  getPvTimerange(startDate: Date, endDate: Date): Promise<PvChargeDTO[]>;
  getBateryTimerange(startDate: Date, endDate: Date): Promise<BatChargeDTO[]>;
  savePvEntry(pvChargeEntry: PostPvCharge): Promise<PvChargeDTO | null>;
  saveBatEntry(batChargeEntry: PostBatCharge): Promise<BatChargeDTO | null>;
  areEntriesOutdated(): Promise<boolean | null>;
} 