import { BatChargeEntry } from "./bat-charge-entry";
import { PvChargeEntry } from "./pv-charge-entry";

export interface SummaryTimerange {
  battery: BatChargeEntry[],
  pv: PvChargeEntry[]
}