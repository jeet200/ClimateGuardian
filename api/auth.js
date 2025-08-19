const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const router = express.Router();

// Signup endpoint
router.post('/signup', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Input validation
    if (!name || !email || !password) {
      return res.status(400).json({ 
        message: 'Please provide name, email, and password' 
      });
    }

    if (password.length < 8) {
      return res.status(400).json({ 
        message: 'Password must be at least 8 characters long' 
      });
    }

    // Check database connection
    if (!require('mongoose').connection.readyState) {
      console.error('Database disconnected during signup attempt');
      return res.status(503).json({ 
        message: 'Service temporarily unavailable. Please try again in a moment.',
        code: 'DB_CONNECTION_ERROR'
      });
    }

    // Check if user already exists
    let user = await User.findOne({ email });
    if (user) {
      console.log(`Signup attempt with existing email: ${email}`);
      return res.status(400).json({ message: 'User with this email already exists' });
    }

    // Verify JWT_SECRET exists
    if (!process.env.JWT_SECRET) {
      console.error('JWT_SECRET not configured');
      return res.status(500).json({ 
        message: 'Authentication service configuration error',
        code: 'JWT_CONFIG_ERROR'
      });
    }

    // Create new user
    user = await User.create({
      name,
      email,
      password
    });

    // Create token
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    // Set token in cookie
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 24 * 60 * 60 * 1000 // 24 hours
    });

    console.log(`New user registered: ${email}`);
    res.status(201).json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    });
  } catch (error) {
    console.error('Signup error:', {
      message: error.message,
      stack: error.stack,
      email: req.body.email
    });
    
    // Handle specific database errors
    if (error.name === 'MongoNetworkError' || error.name === 'MongoTimeoutError') {
      return res.status(503).json({ 
        message: 'Database connection issue. Please try again in a moment.',
        code: 'DB_NETWORK_ERROR'
      });
    }
    
    // Handle validation errors
    if (error.name === 'ValidationError') {
      return res.status(400).json({ 
        message: 'Invalid user data provided',
        details: error.message
      });
    }
    
    res.status(500).json({ 
      message: 'Registration service temporarily unavailable. Please try again.',
      code: 'INTERNAL_ERROR'
    });
  }
});

// Login endpoint
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Input validation
    if (!email || !password) {
      return res.status(400).json({ 
        message: 'Please provide both email and password' 
      });
    }

    // Check database connection
    if (!require('mongoose').connection.readyState) {
      console.error('Database disconnected during login attempt');
      return res.status(503).json({ 
        message: 'Service temporarily unavailable. Please try again in a moment.',
        code: 'DB_CONNECTION_ERROR'
      });
    }

    // Check if user exists
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      console.log(`Login attempt with non-existent email: ${email}`);
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Check password
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      console.log(`Failed login attempt for user: ${email}`);
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Verify JWT_SECRET exists
    if (!process.env.JWT_SECRET) {
      console.error('JWT_SECRET not configured');
      return res.status(500).json({ 
        message: 'Authentication service configuration error',
        code: 'JWT_CONFIG_ERROR'
      });
    }

    // Create token
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    // Set token in cookie
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 24 * 60 * 60 * 1000 // 24 hours
    });

    console.log(`Successful login for user: ${email}`);
    res.json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    });
  } catch (error) {
    console.error('Login error:', {
      message: error.message,
      stack: error.stack,
      email: req.body.email
    });
    
    // Handle specific database errors
    if (error.name === 'MongoNetworkError' || error.name === 'MongoTimeoutError') {
      return res.status(503).json({ 
        message: 'Database connection issue. Please try again in a moment.',
        code: 'DB_NETWORK_ERROR'
      });
    }
    
    res.status(500).json({ 
      message: 'Login service temporarily unavailable. Please try again.',
      code: 'INTERNAL_ERROR'
    });
  }
});

// Logout endpoint
router.post('/logout', (req, res) => {
  res.cookie('token', '', {
    httpOnly: true,
    expires: new Date(0)
  });
  res.json({ success: true, message: 'Logged out successfully' });
});

// Get current user endpoint
router.get('/me', async (req, res) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res.status(401).json({ message: 'Not authenticated' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    });
  } catch (error) {
    res.status(401).json({ message: 'Not authenticated' });
  }
});

module.exports = router; 