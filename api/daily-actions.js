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
  "Use energy-efficient appliances"
];

export default function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const today = new Date().toDateString();
    const randomSeed = today.split('').reduce((a, b) => a + b.charCodeAt(0), 0);
    
    // Generate 3 daily actions based on today's date
    const actions = [];
    for (let i = 0; i < 3; i++) {
      const index = (randomSeed + i * 7) % ECO_ACTIONS.length;
      actions.push({
        id: i + 1,
        action: ECO_ACTIONS[index],
        completed: false
      });
    }
    
    res.json({ date: today, actions });
  } catch (error) {
    console.error('Daily actions error:', error);
    res.status(500).json({ error: 'Failed to load daily actions' });
  }
} 