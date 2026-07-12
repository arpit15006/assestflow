export type AssetStatus =
  | "Available"
  | "Allocated"
  | "Reserved"
  | "Maintenance"
  | "Lost"
  | "Retired"
  | "Disposed";

export type AssetCondition = "New" | "Good" | "Fair" | "Poor";

export interface Asset {
  id: string;
  assetTag: string;
  name: string;
  image?: string;
  category: string;
  status: AssetStatus;
  department: string;
  assignedTo: string;
  location: string;
  lastUpdated: string;
  condition: AssetCondition;
  serialNumber: string;
  purchaseDate: string;
  warrantyPeriod: number; // in months
  shared: boolean;
}
