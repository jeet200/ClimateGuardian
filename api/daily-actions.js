const express = require('express');
const { authenticate, optionalAuth } = require('./middleware/auth');
const User = require('../models/User');
const router = express.Router();

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

// Generate daily actions based on date
function generateDailyActions(date = new Date()) {
  const dateStr = date.toDateString();
  const randomSeed = dateStr.split('').reduce((a, b) => a + b.charCodeAt(0), 0);
  
  const actions = [];
  for (let i = 0; i < 3; i++) {
    const index = (randomSeed + i * 7) % ECO_ACTIONS.length;
    actions.push({
      id: i + 1,
      action: ECO_ACTIONS[index],
      completed: false
    });
  }
  
  return actions;
}

// GET /api/daily-actions - Get today's daily actions
router.get('/', optionalAuth, async (req, res) => {
  try {
    const today = new Date();
    const todayStr = today.toDateString();
    
    if (req.user) {
      // User is authenticated - get from database
      const todayActions = req.user.getTodayActions();
      
      if (todayActions) {
        // Return saved actions
        res.json({
          date: todayStr,
          actions: todayActions.actions,
          streak: req.user.streakData.currentStreak,
          authenticated: true
        });
      } else {
        // Generate new actions for today
        const actions = generateDailyActions(today);
        
        res.json({
          date: todayStr,
          actions,
          streak: req.user.streakData.currentStreak,
          authenticated: true
        });
      }
    } else {
      // User not authenticated - generate actions but don't save
      const actions = generateDailyActions(today);
      
      res.json({
        date: todayStr,
        actions,
        streak: 0,
        authenticated: false,
        message: 'Login to save your progress and track streaks!'
      });
    }
  } catch (error) {
    console.error('Daily actions error:', error);
    res.status(500).json({ error: 'Failed to load daily actions' });
  }
});

// POST /api/daily-actions/complete - Complete an action
router.post('/complete', authenticate, async (req, res) => {
  try {
    const { actionId, completed } = req.body;
    const today = new Date();
    
    // Get or generate today's actions
    let todayActions = req.user.getTodayActions();
    
    if (!todayActions) {
      // Generate actions for today
      const actions = generateDailyActions(today);
      req.user.updateDailyActions(actions);
      todayActions = req.user.getTodayActions();
    }
    
    // Update the specific action
    const actionToUpdate = todayActions.actions.find(action => action.id === actionId);
    if (!actionToUpdate) {
      return res.status(404).json({ error: 'Action not found' });
    }
    
    actionToUpdate.completed = completed;
    if (completed) {
      actionToUpdate.completedAt = new Date();
    } else {
      actionToUpdate.completedAt = undefined;
    }
    
    // Update the daily actions entry
    req.user.updateDailyActions(todayActions.actions);
    
    // Check if all actions are completed and update streak
    const allCompleted = todayActions.actions.every(action => action.completed);
    if (allCompleted) {
      req.user.updateStreak(true);
    }
    
    await req.user.save();
    
    res.json({
      success: true,
      actions: todayActions.actions,
      streak: req.user.streakData.currentStreak,
      allCompleted,
      message: allCompleted ? 'Congratulations! All actions completed today!' : 'Action updated successfully'
    });
    
  } catch (error) {
    console.error('Complete action error:', error);
    res.status(500).json({ error: 'Failed to complete action' });
  }
});

// GET /api/daily-actions/streak - Get user's streak information
router.get('/streak', authenticate, async (req, res) => {
  try {
    res.json({
      currentStreak: req.user.streakData.currentStreak,
      longestStreak: req.user.streakData.longestStreak,
      totalActionsCompleted: req.user.streakData.totalActionsCompleted,
      lastActiveDate: req.user.streakData.lastActiveDate
    });
  } catch (error) {
    console.error('Streak error:', error);
    res.status(500).json({ error: 'Failed to get streak data' });
  }
});

// GET /api/daily-actions/history - Get user's action history for progress graph
router.get('/history', authenticate, async (req, res) => {
  try {
    const { days = 30 } = req.query;
    const daysAgo = new Date();
    daysAgo.setDate(daysAgo.getDate() - parseInt(days));
    
    const history = req.user.dailyActions
      .filter(day => new Date(day.date) >= daysAgo)
      .sort((a, b) => new Date(a.date) - new Date(b.date))
      .map(day => ({
        date: day.date,
        completed: day.allCompleted,
        actionsCount: day.actions.length,
        completedCount: day.actions.filter(action => action.completed).length
      }));
    
    res.json({
      history,
      streakData: req.user.streakData
    });
  } catch (error) {
    console.error('History error:', error);
    res.status(500).json({ error: 'Failed to get action history' });
  }
});

module.exports = router; 