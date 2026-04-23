import { RequestHandler } from "express";
import { Plant, PlantsResponse, PlantByIdResponse } from "@shared/api";

// Mock database of plants
let plantsDatabase: Plant[] = [
  {
    id: "p1",
    name: "My Rose Garden",
    flowerId: "1",
    lastWatered: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
    waterFrequency: 2,
  },
  {
    id: "p2",
    name: "Sunny Sunflower",
    flowerId: "2",
    lastWatered: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days ago
    waterFrequency: 5,
  },
  {
    id: "p3",
    name: "Exotic Orchid",
    flowerId: "3",
    lastWatered: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
    waterFrequency: 1,
  },
];

export const getAllPlants: RequestHandler = (_req, res) => {
  const response: PlantsResponse = {
    plants: plantsDatabase,
  };
  res.json(response);
};

export const getPlantById: RequestHandler = (req, res) => {
  const { id } = req.params;
  const plant = plantsDatabase.find((p) => p.id === id);

  if (!plant) {
    return res.status(404).json({ error: "Plant not found" });
  }

  const response: PlantByIdResponse = {
    plant,
  };
  res.json(response);
};

export const createPlant: RequestHandler = (req, res) => {
  const { name, flowerId, waterFrequency } = req.body;

  if (!name || !flowerId || !waterFrequency) {
    return res.status(400).json({ error: "Name, flowerId, and waterFrequency are required" });
  }

  const newPlant: Plant = {
    id: `p${Date.now()}`,
    name,
    flowerId,
    lastWatered: new Date().toISOString(),
    waterFrequency: parseInt(waterFrequency),
  };

  plantsDatabase.push(newPlant);
  res.status(201).json({ plant: newPlant });
};

export const updatePlant: RequestHandler = (req, res) => {
  const { id } = req.params;
  const { name, waterFrequency } = req.body;

  const plant = plantsDatabase.find((p) => p.id === id);
  if (!plant) {
    return res.status(404).json({ error: "Plant not found" });
  }

  if (name) plant.name = name;
  if (waterFrequency) plant.waterFrequency = waterFrequency;

  const response: PlantByIdResponse = {
    plant,
  };
  res.json(response);
};

export const deletePlant: RequestHandler = (req, res) => {
  const { id } = req.params;

  const index = plantsDatabase.findIndex((p) => p.id === id);
  if (index === -1) {
    return res.status(404).json({ error: "Plant not found" });
  }

  plantsDatabase.splice(index, 1);
  res.status(204).send();
};
