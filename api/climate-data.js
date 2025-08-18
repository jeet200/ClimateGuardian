const axios = require('axios');

export default async function handler(req, res) {
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
    const { city = 'Australia' } = req.query;
    const API_KEY = process.env.OPENWEATHER_API_KEY;
    
    if (!API_KEY) {
      return res.json({
        error: 'Weather API key not configured',
        fallback: {
          city: city,
          temperature: 'N/A',
          air_quality: 'N/A',
          climate_alert: 'Configure OpenWeatherMap API key for live data'
        }
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
      climate_alert: Math.abs(tempAnomaly) > 5 ? 
        `Temperature is ${Math.abs(tempAnomaly).toFixed(1)}°C ${tempAnomaly > 0 ? 'above' : 'below'} normal` : 
        'No climate alerts'
    });
  } catch (error) {
    console.error('Weather API error:', error);
    res.status(500).json({
      error: 'Weather data unavailable',
      fallback: {
        city: 'Global',
        temperature: 'N/A',
        air_quality: 'N/A',
        climate_alert: 'Weather service temporarily unavailable'
      }
    });
  }
} 