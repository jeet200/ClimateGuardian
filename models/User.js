const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide your name'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Please provide your email'],
    unique: true,
    lowercase: true,
    match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email']
  },
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minlength: [8, 'Password must be at least 8 characters long'],
    select: false
  },
  // Streak and Progress Data
  streakData: {
    currentStreak: {
      type: Number,
      default: 0
    },
    longestStreak: {
      type: Number,
      default: 0
    },
    lastActiveDate: {
      type: Date,
      default: null
    },
    totalActionsCompleted: {
      type: Number,
      default: 0
    }
  },
  // Daily Actions History
  dailyActions: [{
    date: {
      type: Date,
      required: true
    },
    actions: [{
      id: Number,
      action: String,
      completed: {
        type: Boolean,
        default: false
      },
      completedAt: Date
    }],
    allCompleted: {
      type: Boolean,
      default: false
    },
    completedAt: Date
  }],
  // Carbon Footprint History for Progress Graph
  carbonFootprints: [{
    date: {
      type: Date,
      default: Date.now
    },
    monthlyFootprint: Number,
    annualFootprint: Number,
    breakdown: {
      transport: Number,
      energy: Number,
      diet: Number,
      consumption: Number
    }
  }],
  // Achievements
  achievements: [{
    type: String,
    unlockedAt: {
      type: Date,
      default: Date.now
    }
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Method to check if password matches
userSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Method to update streak
userSchema.methods.updateStreak = function(allActionsCompleted = false) {
  const today = new Date();
  const todayStr = today.toDateString();
  const lastActiveDate = this.streakData.lastActiveDate;
  
  if (allActionsCompleted) {
    // Check if this is a new day
    if (!lastActiveDate || lastActiveDate.toDateString() !== todayStr) {
      // Check if streak continues (yesterday or today)
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);
      
      if (!lastActiveDate || 
          (lastActiveDate.toDateString() !== yesterday.toDateString() && 
           lastActiveDate.toDateString() !== todayStr)) {
        // Streak broken, reset to 1
        this.streakData.currentStreak = 1;
      } else {
        // Streak continues
        this.streakData.currentStreak += 1;
      }
      
      this.streakData.lastActiveDate = today;
      
      // Update longest streak
      if (this.streakData.currentStreak > this.streakData.longestStreak) {
        this.streakData.longestStreak = this.streakData.currentStreak;
      }
    }
  }
  
  return this.streakData.currentStreak;
};

// Method to get today's actions
userSchema.methods.getTodayActions = function() {
  const today = new Date().toDateString();
  return this.dailyActions.find(day => 
    new Date(day.date).toDateString() === today
  );
};

// Method to add or update daily actions
userSchema.methods.updateDailyActions = function(actionsData) {
  const today = new Date();
  const todayStr = today.toDateString();
  
  // Find or create today's entry
  let todayEntry = this.dailyActions.find(day => 
    new Date(day.date).toDateString() === todayStr
  );
  
  if (!todayEntry) {
    todayEntry = {
      date: today,
      actions: actionsData,
      allCompleted: false
    };
    this.dailyActions.push(todayEntry);
  } else {
    todayEntry.actions = actionsData;
  }
  
  // Check if all actions are completed
  const allCompleted = actionsData.every(action => action.completed);
  todayEntry.allCompleted = allCompleted;
  
  if (allCompleted && !todayEntry.completedAt) {
    todayEntry.completedAt = new Date();
    this.streakData.totalActionsCompleted += actionsData.length;
  }
  
  return todayEntry;
};

const User = mongoose.model('User', userSchema);
module.exports = User; 