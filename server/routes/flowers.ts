import { RequestHandler } from "express";
import { Flower, FlowersResponse, FlowerByIdResponse, IdentifyFlowerResponse } from "@shared/api";

// Mock database of flowers
const flowersDatabase: Flower[] = [
  {
    id: "1",
    name: "Rose",
    scientificName: "Rosa",
    family: "Rosaceae",
    description: "A classic flowering plant known for its beautiful blooms and fragrance. Requires regular watering and sunlight.",
    waterNeed: "medium",
  },
  {
    id: "2",
    name: "Sunflower",
    scientificName: "Helianthus annuus",
    family: "Asteraceae",
    description: "A tall flowering plant with large yellow blooms that follow the sun. Relatively drought tolerant.",
    waterNeed: "low",
  },
  {
    id: "3",
    name: "Orchid",
    scientificName: "Orchidaceae",
    family: "Orchidaceae",
    description: "An exotic tropical flower with intricate blooms. Requires high humidity and careful watering.",
    waterNeed: "high",
  },
  {
    id: "4",
    name: "Tulip",
    scientificName: "Tulipa",
    family: "Liliaceae",
    description: "A spring-blooming flower available in many colors. Moderate water needs.",
    waterNeed: "medium",
  },
  {
    id: "5",
    name: "Lavender",
    scientificName: "Lavandula",
    family: "Lamiaceae",
    description: "A fragrant purple flower known for its calming scent. Drought tolerant.",
    waterNeed: "low",
  },
  {
    id: "6",
    name: "Hydrangea",
    scientificName: "Hydrangea",
    family: "Hydrangeaceae",
    description: "Large flowering shrub with big blue, pink, or purple blooms. Requires regular watering.",
    waterNeed: "high",
  },
];

export const getAllFlowers: RequestHandler = (_req, res) => {
  const response: FlowersResponse = {
    flowers: flowersDatabase,
  };
  res.json(response);
};

export const getFlowerById: RequestHandler = (req, res) => {
  const { id } = req.params;
  const flower = flowersDatabase.find((f) => f.id === id);

  if (!flower) {
    return res.status(404).json({ error: "Flower not found" });
  }

  const response: FlowerByIdResponse = {
    flower,
  };
  res.json(response);
};

export const identifyFlower: RequestHandler = (req, res) => {
  const { description } = req.body;

  if (!description || typeof description !== "string") {
    return res.status(400).json({ error: "Description is required" });
  }

  // Simple mock identification based on keywords in description
  const lowerDesc = description.toLowerCase();
  let flowerIndex = 0;

  if (lowerDesc.includes("rose") || lowerDesc.includes("red") || lowerDesc.includes("fragrant")) {
    flowerIndex = 0;
  } else if (lowerDesc.includes("sunflower") || lowerDesc.includes("yellow") || lowerDesc.includes("tall")) {
    flowerIndex = 1;
  } else if (lowerDesc.includes("orchid") || lowerDesc.includes("exotic") || lowerDesc.includes("tropical")) {
    flowerIndex = 2;
  } else if (lowerDesc.includes("tulip") || lowerDesc.includes("spring")) {
    flowerIndex = 3;
  } else if (lowerDesc.includes("lavender") || lowerDesc.includes("purple") || lowerDesc.includes("scent")) {
    flowerIndex = 4;
  } else if (lowerDesc.includes("hydrangea") || lowerDesc.includes("blue")) {
    flowerIndex = 5;
  } else {
    flowerIndex = Math.floor(Math.random() * flowersDatabase.length);
  }

  const response: IdentifyFlowerResponse = {
    flower: flowersDatabase[flowerIndex],
    confidence: Math.random() * 0.3 + 0.7, // 70-100% confidence
  };
  res.json(response);
};
