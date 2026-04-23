/**
 * Shared code between client and server
 * Useful to share types between client and server
 * and/or small pure JS functions that can be used on both client and server
 */

// Flower types
export interface Flower {
  id: string;
  name: string;
  scientificName: string;
  family: string;
  description: string;
  waterNeed: "low" | "medium" | "high";
}

// Plant types
export interface Plant {
  id: string;
  name: string;
  flowerId: string;
  flower?: Flower;
  lastWatered: string; // ISO date string
  waterFrequency: number; // days between watering
}

// Water Record types
export interface WaterRecord {
  id: string;
  plantId: string;
  date: string; // YYYY-MM-DD
  amount: number; // ml
  notes?: string;
}

// API Response types
export interface FlowersResponse {
  flowers: Flower[];
}

export interface FlowerByIdResponse {
  flower: Flower;
}

export interface PlantsResponse {
  plants: Plant[];
}

export interface PlantByIdResponse {
  plant: Plant;
}

export interface WaterRecordsResponse {
  records: WaterRecord[];
}

export interface IdentifyFlowerResponse {
  flower: Flower;
  confidence: number;
}

export interface DemoResponse {
  message: string;
}
