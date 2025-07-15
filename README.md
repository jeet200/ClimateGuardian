[▶ Watch the demo video](https://drive.google.com/file/d/1YSPO-77La2v6qh_L6KuNjEHj7B8B6G0z/preview)

# 🌱 ClimateGuardian MVP - Futuristic Edition

A stunning, futuristic web platform that helps users understand and reduce their carbon footprint through AI-driven advice and actionable daily tasks. Features a cyberpunk-inspired design with glassmorphism effects, glowing elements, and smooth animations.

## ✨ Features

### 🧮 Carbon Footprint Calculator

- Calculate monthly CO₂ emissions from:
  - Transportation (car, bike, public transport, walking)
  - Energy usage (electricity, gas)
  - Diet (vegan, vegetarian, mixed, meat-heavy)
  - Consumption patterns (low, moderate, high)
- Visual breakdown by category
- Track progress over time

### 🤖 AI Chat Assistant (ClimateBot)

- Get personalized climate advice using Google Gemini 1.5 Flash
- Ask questions about:
  - Energy saving tips
  - Sustainable transportation
  - Eco-friendly diet choices
  - Waste reduction strategies
- Quick question buttons for common queries

### 📊 Progress Tracker

- Visual dashboard with carbon footprint trends
- Achievement badges for milestones
- Progress charts using Chart.js
- Streak counter for consistency

### ✅ Daily Eco-Actions

- 3 daily climate-friendly actions
- Interactive completion tracking
- Progress bar and streak system
- Celebration animations for completed actions

### 🌍 Local Climate Data

- Real-time local weather information
- Air quality index
- Temperature anomaly tracking
- Climate alerts and warnings

## 🛠️ Tech Stack

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Backend**: Node.js, Express.js
- **AI**: Google Gemini 1.5 Flash API
- **Charts**: Chart.js
- **APIs**: OpenWeatherMap API
- **Storage**: Local Storage (client-side)
- **Styling**: Futuristic CSS with glassmorphism, cyberpunk theme, and responsive design

## 🎨 Design Features

### Futuristic UI Elements

- **Dark Theme**: Cyberpunk-inspired dark background with animated gradients
- **Glassmorphism**: Translucent cards with backdrop blur effects
- **Glowing Effects**: Neon-style text and button animations
- **Smooth Animations**: Floating elements, hover effects, and page transitions
- **Interactive Elements**: Glowing buttons, animated particles, and responsive feedback

### Color Scheme

- **Primary**: Electric cyan (#00f5ff) with glowing effects
- **Secondary**: Deep blue gradients (#0099ff, #00d4ff)
- **Background**: Animated dark gradient with particle effects
- **Text**: High contrast white and cyan for optimal readability

## 🚀 Quick Start

### Prerequisites

- Vercel account (for deployment)
- Google Gemini API key (optional)
- OpenWeatherMap API key (optional)

### Local Development

1. **Clone or download the project**

   ```bash
   cd ClimateGuardian
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env` file in the root directory:

   ```env
   GEMINI_API_KEY=your_gemini_api_key_here
   OPENWEATHER_API_KEY=your_openweathermap_api_key_here
   ```

4. **Start development server**

   ```bash
   npm run dev
   ```

5. **Open in browser**
   Navigate to `http://localhost:3000`

## 📱 Usage

### Carbon Footprint Calculator

1. Navigate to the Calculator page
2. Fill in your lifestyle data:
   - Transportation method and weekly distance
   - Monthly energy consumption
   - Dietary preferences
   - Shopping habits
3. Click "Calculate My Footprint"
4. View detailed results and breakdown

### AI Chat Assistant

1. Go to the AI Chat page
2. Type your question about climate/sustainability
3. Use quick question buttons for common queries
4. Get personalized advice and tips

### Daily Actions

1. Visit the Daily Tips page
2. View 3 daily eco-actions
3. Click checkboxes to mark actions as completed
4. Track your streak and progress

### Progress Tracking

1. Access the Progress page
2. View your carbon footprint trends
3. Check achievement badges
4. See local climate data

## 🎯 Success Criteria

- ✅ Users can calculate footprint in under 2 minutes
- ✅ Chatbot provides relevant, helpful answers
- ✅ 20+ daily eco-actions available
- ✅ Visual feedback motivates continued use
- ✅ Responsive design works on all devices
- ✅ Local storage preserves user progress

## 🔧 Development

### Project Structure

```
ClimateGuardian/
├── public/
│   ├── index.html      # Main HTML file
│   ├── styles.css      # CSS styling
│   └── script.js       # JavaScript functionality
├── server.js           # Express server
├── package.json        # Dependencies
└── README.md          # This file
```

### Available Scripts

- `npm start` - Start production server
- `npm run dev` - Start development server with nodemon

### Carbon Calculation Factors

The application uses scientifically-based carbon factors:

- **Transport**: 0.21 kg CO₂/km (car), 0.08 kg CO₂/km (public)
- **Energy**: 0.5 kg CO₂/kWh (electricity), 2.0 kg CO₂/m³ (gas)
- **Diet**: 1.5-7.3 kg CO₂/day based on diet type
- **Consumption**: 0.5-3.0 kg CO₂/day based on shopping habits

### API Endpoints

- `POST /api/calculate-footprint` - Calculate carbon footprint
- `POST /api/chat` - AI chat assistant
- `GET /api/daily-actions` - Get daily eco-actions
- `GET /api/climate-data` - Get local climate data

## 🌟 Features Breakdown

### Implemented (MVP)

- ✅ Carbon footprint calculator
- ✅ AI-powered chat assistant
- ✅ Daily eco-actions with tracking
- ✅ Progress dashboard with charts
- ✅ Local climate data integration
- ✅ Responsive design
- ✅ Local storage for persistence
- ✅ Achievement system

### Future Enhancements

- 🔄 User authentication system
- 🔄 Social features and leaderboards
- 🔄 More detailed carbon calculations
- 🔄 Integration with smart home devices
- 🔄 Mobile app version
- 🔄 Offset purchasing integration

## 🎨 Design Principles

- **User-Friendly**: Simple, intuitive interface
- **Educational**: Clear information about climate impact
- **Motivational**: Gamification elements and progress tracking
- **Accessible**: Responsive design for all devices
- **Beautiful**: Modern, clean visual design

## 🔒 Privacy & Data

- All user data stored locally in browser
- No personal information sent to servers
- API calls only for carbon calculations and AI chat
- Climate data retrieved from public APIs

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

MIT License - Feel free to use and modify for your projects.

## 🆘 Support

If you encounter any issues:

1. Check that all dependencies are installed
2. Verify API keys are correctly configured
3. Ensure Node.js version is 14 or higher
4. Check browser console for any error messages

---

**Together for a sustainable future! 🌱**

Made with ❤️ for the planet and future generations.
