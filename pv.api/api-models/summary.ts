import { BatChargeEntry } from "./bat-charge-entry";
import { PvChargeEntry } from "./pv-charge-entry";

export interface Summary {
  lastBatery: BatChargeEntry | null,
  lastPv: PvChargeEntry | null
}