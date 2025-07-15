# ClimateGuardian Setup Instructions

## Quick Start

1. **Install Dependencies** (already done):
   ```bash
   npm install
   ```

2. **Create Environment Variables**:
   Create a `.env` file in the root directory with:
   ```
   GEMINI_API_KEY=your_gemini_api_key_here
   OPENWEATHER_API_KEY=your_openweather_api_key_here
   PORT=3000
   ```

3. **Get API Keys**:
   - **Gemini API Key**: Visit [Google AI Studio](https://makersuite.google.com/app/apikey) 
   - **OpenWeatherMap API Key**: Visit [OpenWeatherMap](https://openweathermap.org/api) (optional)

4. **Run the Application**:
   ```bash
   npm start          # Production mode
   npm run dev        # Development mode with auto-restart
   ```

5. **Access the App**:
   Open your browser to: `http://localhost:3000`

## Troubleshooting

- If you get API errors, check that your `.env` file has valid API keys
- Make sure port 3000 is not already in use
- The OpenWeatherMap API key is optional - weather features will show fallback messages without it

## Project Structure

- `server.js` - Express server with all API endpoints
- `public/` - Frontend files (HTML, CSS, JS)
- `api/` - Serverless functions for Vercel deployment
- `.env` - Environment variables (create this file)

## Features

- Carbon footprint calculator
- AI chat assistant (requires Gemini API key)
- Daily eco-friendly action suggestions
- Weather and climate data (requires OpenWeatherMap API key) 