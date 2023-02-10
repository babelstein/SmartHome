import { BatChargeEntry } from "./bat-charge-entry";
import { PvChargeEntry } from "./pv-charge-entry";

export interface Summary {
  batteryInfo: BatChargeEntry | null,
  pvInfo: PvChargeEntry | null
}