const express = require("express");
const cors = require("cors");
const axios = require("axios");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const { GoogleGenerativeAI } = require("@google/generative-ai");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(
  cors({
    origin: process.env.NODE_ENV === "production" 
      ? [
          process.env.FRONTEND_URL,
          /^https:\/\/.*\.vercel\.app$/,
          /^https:\/\/climate-project-.*\.vercel\.app$/
        ]
      : ["http://localhost:5000", "http://localhost:3000"],
    credentials: true,
  })
);
app.use(cookieParser());
app.use(express.json());
app.use(express.static("public"));

// Connect to MongoDB
mongoose
  .connect(
    process.env.MONGODB_URI || "mongodb://localhost:27017/climate-guardian"
  )
  .then(() => {
    console.log("📦 Connected to MongoDB");
    console.log("🔗 MongoDB URI:", process.env.MONGODB_URI ? "Set" : "Not set");
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
    console.error("🔗 MongoDB URI:", process.env.MONGODB_URI ? "Set but invalid" : "Not set");
  });

// Import routes
const authRoutes = require("./api/auth");
const dailyActionsRoutes = require("./api/daily-actions");

// Use routes
app.use("/api/auth", authRoutes);
app.use("/api/daily-actions", dailyActionsRoutes);

// Initialize Google Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

// Carbon footprint calculation factors (kg CO2 per unit)
const CARBON_FACTORS = {
  transport: {
    car: 0.21, // per km
    bike: 0, // per km
    public: 0.08, // per km
    walk: 0, // per km
  },
  energy: {
    electricity: 0.5, // per kWh
    gas: 2.0, // per m³
  },
  diet: {
    vegan: 1.5, // per day
    vegetarian: 2.5, // per day
    mixed: 4.0, // per day
    meat_heavy: 7.3, // per day
  },
  consumption: {
    low: 0.5, // per day
    moderate: 1.5, // per day
    high: 3.0, // per day
  },
};

// Daily eco-actions database
const ECO_ACTIONS = [
  "Turn off devices when not in use",
  "Take a walk instead of driving short distances",
  "Enjoy a meat-free meal today",
  "Use cold water for washing clothes",
  "Unplug chargers and electronics",
  "Choose stairs over elevators",
  "Use a reusable water bottle",
  "Buy locally produced food",
  "Air-dry clothes instead of using dryer",
  "Switch to LED light bulbs",
  "Use public transport or bike",
  "Reduce food waste by meal planning",
  "Take shorter showers",
  "Use a programmable thermostat",
  "Choose digital receipts over paper",
  "Bring reusable bags when shopping",
  "Use both sides of paper",
  "Choose products with minimal packaging",
  "Start a small herb garden",
  "Use energy-efficient appliances",
];

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({
    status: "OK",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || "development",
    mongodb: mongoose.connection.readyState === 1 ? "connected" : "disconnected",
    env_vars: {
      MONGODB_URI: !!process.env.MONGODB_URI,
      JWT_SECRET: !!process.env.JWT_SECRET,
      GEMINI_API_KEY: !!process.env.GEMINI_API_KEY,
      OPENWEATHER_API_KEY: !!process.env.OPENWEATHER_API_KEY
    }
  });
});

// API Routes

// Carbon footprint calculation
app.post("/api/calculate-footprint", (req, res) => {
  try {
    const { transport, energy, diet, consumption } = req.body;

    let monthlyFootprint = 0;

    // Transport calculation (weekly km * 4.33 weeks)
    if (transport) {
      const weeklyKm = transport.weekly_km || 0;
      const transportType = transport.type || "car";
      monthlyFootprint +=
        weeklyKm * 4.33 * CARBON_FACTORS.transport[transportType];
    }

    // Energy calculation (monthly usage)
    if (energy) {
      const electricityKwh = energy.electricity || 0;
      const gasM3 = energy.gas || 0;
      monthlyFootprint += electricityKwh * CARBON_FACTORS.energy.electricity;
      monthlyFootprint += gasM3 * CARBON_FACTORS.energy.gas;
    }

    // Diet calculation (daily * 30 days)
    if (diet) {
      const dietType = diet.type || "mixed";
      monthlyFootprint += 30 * CARBON_FACTORS.diet[dietType];
    }

    // Consumption calculation (daily * 30 days)
    if (consumption) {
      const consumptionLevel = consumption.level || "moderate";
      monthlyFootprint += 30 * CARBON_FACTORS.consumption[consumptionLevel];
    }

    res.json({
      monthly_footprint: Math.round(monthlyFootprint),
      annual_footprint: Math.round(monthlyFootprint * 12),
      breakdown: {
        transport: transport
          ? Math.round(
              transport.weekly_km *
                4.33 *
                CARBON_FACTORS.transport[transport.type || "car"]
            )
          : 0,
        energy: energy
          ? Math.round(
              (energy.electricity || 0) * CARBON_FACTORS.energy.electricity +
                (energy.gas || 0) * CARBON_FACTORS.energy.gas
            )
          : 0,
        diet: diet
          ? Math.round(30 * CARBON_FACTORS.diet[diet.type || "mixed"])
          : 0,
        consumption: consumption
          ? Math.round(
              30 * CARBON_FACTORS.consumption[consumption.level || "moderate"]
            )
          : 0,
      },
    });
  } catch (error) {
    res.status(500).json({ error: "Calculation failed" });
  }
});

// AI Chat Assistant
app.post("/api/chat", async (req, res) => {
  try {
    const { message } = req.body;

    const systemPrompt = `You are ClimateBot, a helpful AI assistant focused on environmental sustainability and reducing carbon footprint. 
    Provide practical, actionable advice on climate-friendly practices. Keep responses concise and encouraging.
    Topics include: energy saving, sustainable transport, eco-friendly diet, waste reduction, and green lifestyle choices.`;

    const fullPrompt = `${systemPrompt}\n\nUser: ${message}\nClimateBot:`;

    const result = await model.generateContent(fullPrompt);
    const response = await result.response;
    const text = response.text();

    res.json({ response: text });
  } catch (error) {
    console.error("Gemini API error:", error);
    res.status(500).json({
      error: "Chat service temporarily unavailable",
      fallback:
        "I'm having trouble connecting right now. Here are some general tips: reduce energy usage, use sustainable transport, eat less meat, and minimize waste!",
    });
  }
});

// Note: Daily actions now handled by /api/daily-actions router

// Weather and climate data
app.get("/api/climate-data", async (req, res) => {
  try {
    const { city = "Australia" } = req.query;
    const API_KEY = process.env.OPENWEATHER_API_KEY;

    if (!API_KEY) {
      return res.json({
        error: "Weather API key not configured",
        fallback: {
          city: city,
          temperature: "N/A",
          air_quality: "N/A",
          climate_alert: "Configure OpenWeatherMap API key for live data",
        },
      });
    }

    const weatherResponse = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
    );

    const airQualityResponse = await axios.get(
      `https://api.openweathermap.org/data/2.5/air_pollution?lat=${weatherResponse.data.coord.lat}&lon=${weatherResponse.data.coord.lon}&appid=${API_KEY}`
    );

    const temp = weatherResponse.data.main.temp;
    const normalTemp = 15; // Approximate normal temperature
    const tempAnomaly = temp - normalTemp;

    res.json({
      city: weatherResponse.data.name,
      temperature: temp,
      temperature_anomaly: tempAnomaly,
      air_quality_index: airQualityResponse.data.list[0].main.aqi,
      climate_alert:
        Math.abs(tempAnomaly) > 5
          ? `Temperature is ${Math.abs(tempAnomaly).toFixed(1)}°C ${
              tempAnomaly > 0 ? "above" : "below"
            } normal`
          : "No climate alerts",
    });
  } catch (error) {
    console.error("Weather API error:", error);
    res.status(500).json({ error: "Weather data unavailable" });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`🌱 ClimateGuardian server running on port ${PORT}`);
  console.log(`📊 Visit http://localhost:${PORT} to use the application`);
});
