import { RequestHandler } from "express";
import { WaterRecord, WaterRecordsResponse } from "@shared/api";

// Mock database of water records
let waterRecordsDatabase: WaterRecord[] = [
  {
    id: "w1",
    plantId: "p1",
    date: "2024-12-20",
    amount: 500,
    notes: "Morning watering",
  },
  {
    id: "w2",
    plantId: "p1",
    date: "2024-12-19",
    amount: 600,
    notes: "",
  },
  {
    id: "w3",
    plantId: "p2",
    date: "2024-12-18",
    amount: 400,
    notes: "Weekend watering",
  },
  {
    id: "w4",
    plantId: "p3",
    date: "2024-12-20",
    amount: 300,
    notes: "Light watering for orchid",
  },
  {
    id: "w5",
    plantId: "p1",
    date: "2024-12-18",
    amount: 550,
  },
  {
    id: "w6",
    plantId: "p2",
    date: "2024-12-17",
    amount: 350,
  },
  {
    id: "w7",
    plantId: "p3",
    date: "2024-12-19",
    amount: 280,
  },
];

export const getWaterRecords: RequestHandler = (req, res) => {
  const { plantId, date, startDate, endDate } = req.query;

  let filtered = [...waterRecordsDatabase];

  if (plantId) {
    filtered = filtered.filter((r) => r.plantId === plantId);
  }

  if (date) {
    filtered = filtered.filter((r) => r.date === date);
  }

  if (startDate && endDate) {
    filtered = filtered.filter(
      (r) => r.date >= (startDate as string) && r.date <= (endDate as string)
    );
  }

  const response: WaterRecordsResponse = {
    records: filtered,
  };
  res.json(response);
};

export const createWaterRecord: RequestHandler = (req, res) => {
  const { plantId, date, amount, notes } = req.body;

  if (!plantId || !date || !amount) {
    return res.status(400).json({ error: "plantId, date, and amount are required" });
  }

  const newRecord: WaterRecord = {
    id: `w${Date.now()}`,
    plantId,
    date,
    amount: parseInt(amount),
    notes: notes || "",
  };

  waterRecordsDatabase.push(newRecord);
  res.status(201).json({ record: newRecord });
};

export const updateWaterRecord: RequestHandler = (req, res) => {
  const { id } = req.params;
  const { amount, notes } = req.body;

  const record = waterRecordsDatabase.find((r) => r.id === id);
  if (!record) {
    return res.status(404).json({ error: "Water record not found" });
  }

  if (amount) record.amount = parseInt(amount);
  if (notes !== undefined) record.notes = notes;

  res.json({ record });
};

export const deleteWaterRecord: RequestHandler = (req, res) => {
  const { id } = req.params;

  const index = waterRecordsDatabase.findIndex((r) => r.id === id);
  if (index === -1) {
    return res.status(404).json({ error: "Water record not found" });
  }

  waterRecordsDatabase.splice(index, 1);
  res.status(204).send();
};
