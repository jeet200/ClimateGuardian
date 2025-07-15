// Carbon footprint calculation factors (kg CO2 per unit)
const CARBON_FACTORS = {
  transport: {
    car: 0.21,      // per km
    bike: 0,        // per km
    public: 0.08,   // per km
    walk: 0         // per km
  },
  energy: {
    electricity: 0.5,  // per kWh
    gas: 2.0          // per m³
  },
  diet: {
    vegan: 1.5,       // per day
    vegetarian: 2.5,  // per day
    mixed: 4.0,       // per day
    meat_heavy: 7.3   // per day
  },
  consumption: {
    low: 0.5,     // per day
    moderate: 1.5, // per day
    high: 3.0     // per day
  }
};

export default function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { transport, energy, diet, consumption } = req.body;
    
    let monthlyFootprint = 0;
    
    // Transport calculation (weekly km * 4.33 weeks)
    if (transport) {
      const weeklyKm = transport.weekly_km || 0;
      const transportType = transport.type || 'car';
      monthlyFootprint += weeklyKm * 4.33 * CARBON_FACTORS.transport[transportType];
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
      const dietType = diet.type || 'mixed';
      monthlyFootprint += 30 * CARBON_FACTORS.diet[dietType];
    }
    
    // Consumption calculation (daily * 30 days)
    if (consumption) {
      const consumptionLevel = consumption.level || 'moderate';
      monthlyFootprint += 30 * CARBON_FACTORS.consumption[consumptionLevel];
    }
    
    res.json({
      monthly_footprint: Math.round(monthlyFootprint),
      annual_footprint: Math.round(monthlyFootprint * 12),
      breakdown: {
        transport: transport ? Math.round(transport.weekly_km * 4.33 * CARBON_FACTORS.transport[transport.type || 'car']) : 0,
        energy: energy ? Math.round((energy.electricity || 0) * CARBON_FACTORS.energy.electricity + (energy.gas || 0) * CARBON_FACTORS.energy.gas) : 0,
        diet: diet ? Math.round(30 * CARBON_FACTORS.diet[diet.type || 'mixed']) : 0,
        consumption: consumption ? Math.round(30 * CARBON_FACTORS.consumption[consumption.level || 'moderate']) : 0
      }
    });
  } catch (error) {
    console.error('Calculation error:', error);
    res.status(500).json({ error: 'Calculation failed' });
  }
} 