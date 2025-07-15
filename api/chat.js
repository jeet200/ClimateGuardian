const { GoogleGenerativeAI } = require('@google/generative-ai');

export default async function handler(req, res) {
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
    const { message } = req.body;
    
    // Check if Gemini API key is available
    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({ 
        error: 'Chat service unavailable',
        fallback: "I'm currently unavailable. Here are some general tips: reduce energy usage, use sustainable transport, eat less meat, and minimize waste!"
      });
    }
    
    // Initialize Gemini
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    
    const systemPrompt = `You are ClimateBot, a helpful AI assistant focused on environmental sustainability and reducing carbon footprint. 
    Provide practical, actionable advice on climate-friendly practices. Keep responses concise and encouraging.
    Topics include: energy saving, sustainable transport, eco-friendly diet, waste reduction, and green lifestyle choices.`;
    
    const fullPrompt = `${systemPrompt}\n\nUser: ${message}\nClimateBot:`;
    
    const result = await model.generateContent(fullPrompt);
    const response = await result.response;
    const text = response.text();
    
    res.json({ response: text });
  } catch (error) {
    console.error('Gemini API error:', error);
    res.status(500).json({ 
      error: 'Chat service temporarily unavailable',
      fallback: "I'm having trouble connecting right now. Here are some general tips: reduce energy usage, use sustainable transport, eat less meat, and minimize waste!"
    });
  }
} 