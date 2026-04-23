import "dotenv/config";
import express from "express";
import cors from "cors";
import { handleDemo } from "./routes/demo";
import {
  getAllFlowers,
  getFlowerById,
  identifyFlower,
} from "./routes/flowers";
import {
  getAllPlants,
  getPlantById,
  createPlant,
  updatePlant,
  deletePlant,
} from "./routes/plants";
import {
  getWaterRecords,
  createWaterRecord,
  updateWaterRecord,
  deleteWaterRecord,
} from "./routes/water-records";

export function createServer() {
  const app = express();

  // Middleware
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Example API routes
  app.get("/api/ping", (_req, res) => {
    const ping = process.env.PING_MESSAGE ?? "ping";
    res.json({ message: ping });
  });

  app.get("/api/demo", handleDemo);

  // Flower routes
  app.get("/api/flowers", getAllFlowers);
  app.get("/api/flowers/:id", getFlowerById);
  app.post("/api/flowers/identify", identifyFlower);

  // Plant routes
  app.get("/api/plants", getAllPlants);
  app.get("/api/plants/:id", getPlantById);
  app.post("/api/plants", createPlant);
  app.put("/api/plants/:id", updatePlant);
  app.delete("/api/plants/:id", deletePlant);

  // Water records routes
  app.get("/api/water-records", getWaterRecords);
  app.post("/api/water-records", createWaterRecord);
  app.put("/api/water-records/:id", updateWaterRecord);
  app.delete("/api/water-records/:id", deleteWaterRecord);

  return app;
}
