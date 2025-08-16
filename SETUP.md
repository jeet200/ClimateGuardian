# 🌱 ClimateGuardian Setup Instructions

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local installation or MongoDB Atlas)
- Git

### Installation

1. **Install Dependencies** (already done):
   ```bash
   npm install
   ```

2. **Environment Configuration**:
   Create a `.env` file in the root directory with:
   ```env
   # Database Configuration (REQUIRED for authentication)
   MONGODB_URI=mongodb://localhost:27017/climate-guardian
   
   # JWT Secret Key (REQUIRED - generate a secure random string)
   JWT_SECRET=your-super-secure-jwt-secret-key-minimum-32-characters
   
   # Google Gemini AI API Key (optional - for chat functionality)
   GEMINI_API_KEY=your_gemini_api_key_here
   
   # OpenWeatherMap API Key (optional - for weather data)
   OPENWEATHER_API_KEY=your_openweather_api_key_here
   
   # Server Configuration
   PORT=5000
   NODE_ENV=development
   FRONTEND_URL=http://localhost:5000
   ```

3. **Database Setup**:
   - **Option A - Local MongoDB**: 
     - Install MongoDB locally
     - Start MongoDB service
     - Use: `MONGODB_URI=mongodb://localhost:27017/climate-guardian`
   
   - **Option B - MongoDB Atlas** (Recommended):
     - Create free account at [MongoDB Atlas](https://www.mongodb.com/atlas)
     - Create a cluster and get connection string
     - Use your Atlas connection string in `MONGODB_URI`

4. **Get API Keys** (Optional):
   - **Gemini API Key**: Visit [Google AI Studio](https://makersuite.google.com/app/apikey) 
   - **OpenWeatherMap API Key**: Visit [OpenWeatherMap](https://openweathermap.org/api)

5. **Generate JWT Secret**:
   ```bash
   # Generate a secure random string (32+ characters)
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   ```

6. **Run the Application**:
   ```bash
   npm start          # Production mode
   npm run dev        # Development mode with auto-restart
   ```

7. **Access the App**:
   Open your browser to: `http://localhost:5000`

## 🎨 New Authentication Features

### ✨ Enhanced Login Page
- **Modern Glassmorphism Design**: Frosted glass effects with animated gradients
- **Real-time Form Validation**: Instant feedback on email and password fields
- **Smooth Animations**: Beautiful hover effects and transitions
- **Loading States**: Elegant loading spinner during authentication
- **Success Feedback**: Animated messages with particle effects
- **Mobile Optimized**: Touch-friendly responsive design

### 🔐 Advanced Signup Page
- **Password Strength Indicator**: Real-time visualization of password strength
- **Requirements Checker**: Live validation of password requirements
- **Enhanced Form Validation**: Comprehensive client-side validation
- **Floating Particles**: Animated background elements
- **Celebration Animation**: Particle explosion on successful registration
- **Name Validation**: Real-time validation for full name field

### 🛡️ Security Improvements
- **JWT Authentication**: Secure token-based authentication
- **HTTP-Only Cookies**: Enhanced security for token storage
- **Password Hashing**: bcrypt with salt rounds for secure password storage
- **Input Sanitization**: Protection against common attacks
- **CORS Configuration**: Proper cross-origin resource sharing setup

## 🔧 Configuration Details

### Required Environment Variables
- `MONGODB_URI`: Your MongoDB connection string (local or Atlas)
- `JWT_SECRET`: Secure secret key for JWT tokens (minimum 32 characters)

### Optional Environment Variables
- `GEMINI_API_KEY`: For AI chat functionality
- `OPENWEATHER_API_KEY`: For weather data integration
- `PORT`: Server port (default: 5000)
- `NODE_ENV`: Environment mode (development/production)
- `FRONTEND_URL`: Frontend URL for CORS configuration

## 🛠️ Troubleshooting

### Authentication Issues
1. **"User registration failed"**
   - Check MongoDB connection
   - Verify MONGODB_URI in .env file
   - Ensure MongoDB service is running

2. **"JWT Secret not configured"**
   - Generate and set JWT_SECRET in .env file
   - Must be at least 32 characters long

3. **"Database connection error"**
   - Verify MongoDB URI format
   - Check network connectivity
   - For Atlas: ensure IP whitelist is configured

### General Issues
- **Port already in use**: Change PORT in .env file or kill existing process
- **API keys not working**: Verify keys are valid and have proper quotas
- **Styling issues**: Clear browser cache and hard refresh

## 📱 Mobile Experience

The new authentication system is fully optimized for mobile:
- Touch-friendly input fields with proper spacing
- Responsive breakpoints for all screen sizes
- Optimized animations for mobile performance
- Improved accessibility with proper ARIA labels
- Swipe-friendly navigation and interactions

## 🎯 Features Overview

### ✅ Completed Features
- **Secure User Authentication**: Registration and login system
- **Password Security**: Strength indicators and validation
- **Modern UI/UX**: Glassmorphism design with smooth animations
- **Real-time Validation**: Instant form feedback
- **Mobile Responsive**: Optimized for all devices
- **Error Handling**: Graceful error messages and recovery

### 🔄 Existing Features
- Carbon footprint calculator
- AI chat assistant (requires Gemini API key)
- Daily eco-friendly action suggestions
- Weather and climate data (requires OpenWeatherMap API key)

## 📞 Support

If you encounter issues:
1. Check the troubleshooting section above
2. Review browser console for error messages
3. Verify all environment variables are set correctly
4. Ensure MongoDB is properly connected
5. Check server logs for detailed error information

---

**Climate Guardian** - Now with next-level authentication! 🌍✨ 