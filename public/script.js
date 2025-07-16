// Global variables
let currentPage = "home";
let userProgress = {
  footprints: [],
  completedActions: [],
  streak: 0,
  achievements: ["first-calculation"],
};

// Initialize the application
document.addEventListener("DOMContentLoaded", function () {
  initializeApp();
});

// Initialize application
function initializeApp() {
  setupEventListeners();
  loadUserProgress();
  loadDailyActions();
  loadClimateData();
  showPage("home");
}

// Setup event listeners
function setupEventListeners() {
  // Navigation
  document.querySelectorAll(".nav-link").forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      const targetPage = link.getAttribute("href").substring(1);
      showPage(targetPage);
    });
  });

  // Mobile menu toggle
  const hamburger = document.querySelector(".hamburger");
  const navMenu = document.querySelector(".nav-menu");

  hamburger.addEventListener("click", () => {
    navMenu.classList.toggle("active");
  });

  // Add mouse tracking for navigation links
  setupMouseTracking();

  // Calculator form
  const carbonForm = document.getElementById("carbon-form");
  carbonForm.addEventListener("submit", handleCarbonCalculation);

  // Chat functionality
  const chatInput = document.getElementById("chat-input");
  chatInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      sendMessage();
    }
  });

  // Update navigation active state
  document.querySelectorAll(".nav-link").forEach((link) => {
    link.addEventListener("click", (e) => {
      document
        .querySelectorAll(".nav-link")
        .forEach((l) => l.classList.remove("active"));
      link.classList.add("active");
    });
  });
}

// Page navigation
function showPage(pageId) {
  // Hide all pages
  document.querySelectorAll(".page").forEach((page) => {
    page.classList.remove("active");
  });

  // Show target page
  const targetPage = document.getElementById(pageId);
  if (targetPage) {
    targetPage.classList.add("active");
    currentPage = pageId;

    // Update navigation active state
    document.querySelectorAll(".nav-link").forEach((link) => {
      link.classList.remove("active");
      if (link.getAttribute("href") === `#${pageId}`) {
        link.classList.add("active");
      }
    });

    // Load page-specific content
    switch (pageId) {
      case "progress":
        loadProgressData();
        break;
      case "tips":
        loadDailyActions();
        break;
      case "chat":
        focusChatInput();
        break;
    }
  }

  // Close mobile menu
  document.querySelector(".nav-menu").classList.remove("active");
  
  // Re-initialize mouse tracking after navigation
  setupMouseTracking();
}

// Carbon footprint calculation
async function handleCarbonCalculation(e) {
  e.preventDefault();

  const formData = {
    transport: {
      type: document.getElementById("transport-type").value,
      weekly_km: parseFloat(document.getElementById("weekly-km").value),
    },
    energy: {
      electricity: parseFloat(document.getElementById("electricity").value),
      gas: parseFloat(document.getElementById("gas").value),
    },
    diet: {
      type: document.getElementById("diet-type").value,
    },
    consumption: {
      level: document.getElementById("consumption-level").value,
    },
  };

  try {
    const response = await fetch("/api/calculate-footprint", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    const result = await response.json();

    if (response.ok) {
      displayResults(result);
      saveFootprintData(result);
      updateAchievements("calculation");
    } else {
      showError("Calculation failed. Please try again.");
    }
  } catch (error) {
    console.error("Error calculating footprint:", error);
    showError("Network error. Please check your connection.");
  }
}

// Display calculation results
function displayResults(result) {
  document.getElementById(
    "monthly-result"
  ).textContent = `${result.monthly_footprint} kg CO₂`;
  document.getElementById(
    "annual-result"
  ).textContent = `${result.annual_footprint} kg CO₂`;

  document.getElementById(
    "transport-breakdown"
  ).textContent = `${result.breakdown.transport} kg`;
  document.getElementById(
    "energy-breakdown"
  ).textContent = `${result.breakdown.energy} kg`;
  document.getElementById(
    "diet-breakdown"
  ).textContent = `${result.breakdown.diet} kg`;
  document.getElementById(
    "consumption-breakdown"
  ).textContent = `${result.breakdown.consumption} kg`;

  document.getElementById("results").classList.remove("hidden");
  document.getElementById("results").scrollIntoView({ behavior: "smooth" });
}

// Save footprint data
function saveFootprintData(result) {
  const footprintData = {
    date: new Date().toISOString().split("T")[0],
    monthly: result.monthly_footprint,
    annual: result.annual_footprint,
    breakdown: result.breakdown,
  };

  userProgress.footprints.push(footprintData);
  saveUserProgress();
}

// AI Chat functionality
async function sendMessage() {
  const input = document.getElementById("chat-input");
  const message = input.value.trim();

  if (!message) return;

  // Add user message to chat
  addMessageToChat("user", message);
  input.value = "";

  // Show typing indicator
  showTypingIndicator();

  try {
    const response = await fetch("/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ message }),
    });

    const result = await response.json();

    // Remove typing indicator
    removeTypingIndicator();

    if (response.ok) {
      addMessageToChat("bot", result.response);
    } else {
      addMessageToChat(
        "bot",
        result.fallback ||
          "I apologize, but I'm having trouble right now. Please try again later."
      );
    }
  } catch (error) {
    console.error("Chat error:", error);
    removeTypingIndicator();
    addMessageToChat(
      "bot",
      "I'm having connection issues. Here are some general tips: reduce energy usage, use sustainable transport, eat less meat, and minimize waste!"
    );
  }
}

// Add message to chat
function addMessageToChat(sender, message) {
  const chatMessages = document.getElementById("chat-messages");
  const messageDiv = document.createElement("div");
  messageDiv.className = `message ${sender}`;

  messageDiv.innerHTML = `
        <div class="message-content">
            <p>${message}</p>
        </div>
    `;

  chatMessages.appendChild(messageDiv);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Show typing indicator
function showTypingIndicator() {
  const typingDiv = document.createElement("div");
  typingDiv.className = "message bot typing-indicator";
  typingDiv.innerHTML = `
        <div class="message-content">
            <p>ClimateBot is typing...</p>
        </div>
    `;

  document.getElementById("chat-messages").appendChild(typingDiv);
  document.getElementById("chat-messages").scrollTop =
    document.getElementById("chat-messages").scrollHeight;
}

// Remove typing indicator
function removeTypingIndicator() {
  const typingIndicator = document.querySelector(".typing-indicator");
  if (typingIndicator) {
    typingIndicator.remove();
  }
}

// Quick question functionality
function askQuickQuestion(question) {
  document.getElementById("chat-input").value = question;
  sendMessage();
}

// Focus chat input
function focusChatInput() {
  setTimeout(() => {
    document.getElementById("chat-input").focus();
  }, 100);
}

// Load daily actions
async function loadDailyActions() {
  try {
    const response = await fetch("/api/daily-actions");
    const result = await response.json();

    if (response.ok) {
      displayDailyActions(result.actions);
    } else {
      showError("Failed to load daily actions");
    }
  } catch (error) {
    console.error("Error loading daily actions:", error);
    displayFallbackActions();
  }
}

// Display daily actions
function displayDailyActions(actions) {
  const container = document.getElementById("daily-actions");
  container.innerHTML = "";

  actions.forEach((action) => {
    const actionDiv = document.createElement("div");
    actionDiv.className = "action-item";
    actionDiv.innerHTML = `
            <div class="action-checkbox ${action.completed ? "checked" : ""}" 
                 onclick="toggleAction(${action.id})">
                ${action.completed ? "✓" : ""}
            </div>
            <span class="action-text">${action.action}</span>
        `;

    if (action.completed) {
      actionDiv.classList.add("completed");
    }

    container.appendChild(actionDiv);
  });

  updateProgressBar();
}

// Toggle action completion
function toggleAction(actionId) {
  const checkbox = document.querySelector(
    `[onclick="toggleAction(${actionId})"]`
  );
  const actionItem = checkbox.closest(".action-item");
  const isCompleted = checkbox.classList.contains("checked");

  if (isCompleted) {
    // Uncomplete action
    checkbox.classList.remove("checked");
    checkbox.innerHTML = "";
    actionItem.classList.remove("completed");

    // Remove from completed actions
    const index = userProgress.completedActions.indexOf(actionId);
    if (index > -1) {
      userProgress.completedActions.splice(index, 1);
    }
  } else {
    // Complete action
    checkbox.classList.add("checked");
    checkbox.innerHTML = "✓";
    actionItem.classList.add("completed");

    // Add to completed actions
    if (!userProgress.completedActions.includes(actionId)) {
      userProgress.completedActions.push(actionId);
    }

    // Celebrate completion
    celebrateActionCompletion();
  }

  updateProgressBar();
  saveUserProgress();
}

// Update progress bar
function updateProgressBar() {
  const completedActions = document.querySelectorAll(
    ".action-item.completed"
  ).length;
  const totalActions = document.querySelectorAll(".action-item").length;
  const percentage =
    totalActions > 0 ? (completedActions / totalActions) * 100 : 0;

  document.querySelector(".progress-fill").style.width = `${percentage}%`;

  // Update streak
  if (completedActions === totalActions && totalActions > 0) {
    userProgress.streak++;
    updateAchievements("streak");
  }

  document.getElementById("streak-count").textContent = userProgress.streak;
}

// Celebrate action completion
function celebrateActionCompletion() {
  // Simple celebration animation
  const celebration = document.createElement("div");
  celebration.innerHTML = "🎉";
  celebration.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        font-size: 3rem;
        z-index: 9999;
        pointer-events: none;
        animation: celebration 1s ease-out forwards;
    `;

  document.body.appendChild(celebration);

  setTimeout(() => {
    celebration.remove();
  }, 1000);
}

// Load climate data
async function loadClimateData() {
  try {
    const response = await fetch("/api/climate-data");
    const result = await response.json();

    if (response.ok) {
      displayClimateData(result);
    } else {
      displayFallbackClimateData();
    }
  } catch (error) {
    console.error("Error loading climate data:", error);
    displayFallbackClimateData();
  }
}

// Display climate data
function displayClimateData(data) {
  const container = document.getElementById("climate-data");
  container.innerHTML = `
        <div class="climate-item">
            <h4>📍 ${data.city}</h4>
            <p>Temperature: ${data.temperature}°C</p>
        </div>
        <div class="climate-item">
            <h4>🌡️ Anomaly</h4>
            <p>${
              data.temperature_anomaly > 0 ? "+" : ""
            }${data.temperature_anomaly.toFixed(1)}°C</p>
        </div>
        <div class="climate-item">
            <h4>🌬️ Air Quality</h4>
            <p>Index: ${data.air_quality_index}</p>
        </div>
        <div class="climate-item">
            <h4>⚠️ Alerts</h4>
            <p>${data.climate_alert}</p>
        </div>
    `;
}

// Display fallback climate data
function displayFallbackClimateData() {
  const container = document.getElementById("climate-data");
  container.innerHTML = `
        <div class="climate-item">
            <h4>🌍 Global Status</h4>
            <p>Configure API keys for live data</p>
        </div>
        <div class="climate-item">
            <h4>🌡️ Temperature</h4>
            <p>Global average: +1.1°C</p>
        </div>
        <div class="climate-item">
            <h4>🌬️ CO₂ Levels</h4>
            <p>421 ppm (2023)</p>
        </div>
        <div class="climate-item">
            <h4>⚠️ Action Needed</h4>
            <p>Reduce emissions now!</p>
        </div>
    `;
}

// Load progress data
function loadProgressData() {
  displayFootprintChart();
  displayAchievements();
}

// Display footprint chart
function displayFootprintChart() {
  const ctx = document.getElementById("footprint-chart").getContext("2d");

  // Prepare data for chart
  const labels = userProgress.footprints.map((fp) => fp.date);
  const data = userProgress.footprints.map((fp) => fp.monthly);

  // If no data, show sample data
  if (labels.length === 0) {
    labels.push("Sample Data");
    data.push(0);
  }

  new Chart(ctx, {
    type: "line",
    data: {
      labels: labels,
      datasets: [
        {
          label: "Monthly Carbon Footprint (kg CO₂)",
          data: data,
          borderColor: "#4a7c59",
          backgroundColor: "rgba(74, 124, 89, 0.1)",
          borderWidth: 2,
          fill: true,
          tension: 0.4,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: {
          beginAtZero: true,
          title: {
            display: true,
            text: "kg CO₂",
            font: {
              size: 12,
            },
          },
          ticks: {
            font: {
              size: 10,
            },
          },
        },
        x: {
          ticks: {
            font: {
              size: 10,
            },
          },
        },
      },
      plugins: {
        legend: {
          display: false,
        },
      },
      elements: {
        point: {
          radius: 4,
        },
      },
    },
  });
}

// Display achievements
function displayAchievements() {
  const container = document.getElementById("achievements");

  // Achievement definitions
  const achievements = [
    {
      id: "first-calculation",
      icon: "fas fa-seedling",
      text: "First Calculation",
    },
    { id: "week-streak", icon: "fas fa-star", text: "Week Streak" },
    { id: "month-streak", icon: "fas fa-trophy", text: "Month Streak" },
  ];

  container.innerHTML = "";

  achievements.forEach((achievement) => {
    const achievementDiv = document.createElement("div");
    achievementDiv.className = `achievement ${
      userProgress.achievements.includes(achievement.id) ? "" : "locked"
    }`;
    achievementDiv.innerHTML = `
            <i class="${achievement.icon}"></i>
            <span>${achievement.text}</span>
        `;
    container.appendChild(achievementDiv);
  });
}

// Update achievements
function updateAchievements(type) {
  switch (type) {
    case "calculation":
      if (!userProgress.achievements.includes("first-calculation")) {
        userProgress.achievements.push("first-calculation");
      }
      break;
    case "streak":
      if (
        userProgress.streak >= 7 &&
        !userProgress.achievements.includes("week-streak")
      ) {
        userProgress.achievements.push("week-streak");
      }
      if (
        userProgress.streak >= 30 &&
        !userProgress.achievements.includes("month-streak")
      ) {
        userProgress.achievements.push("month-streak");
      }
      break;
  }

  saveUserProgress();
}

// Fallback actions for offline mode
function displayFallbackActions() {
  const actions = [
    { id: 1, action: "Turn off devices when not in use", completed: false },
    { id: 2, action: "Take a walk instead of driving", completed: false },
    { id: 3, action: "Enjoy a meat-free meal today", completed: false },
  ];

  displayDailyActions(actions);
}

// Local storage functions
function saveUserProgress() {
  localStorage.setItem("climateGuardianProgress", JSON.stringify(userProgress));
}

function loadUserProgress() {
  const saved = localStorage.getItem("climateGuardianProgress");
  if (saved) {
    userProgress = { ...userProgress, ...JSON.parse(saved) };
  }
}

// Error handling
function showError(message) {
  const errorDiv = document.createElement("div");
  errorDiv.className = "error-message";
  errorDiv.innerHTML = `
        <div style="
            position: fixed;
            top: 20px;
            right: 20px;
            background: #ff4444;
            color: white;
            padding: 1rem;
            border-radius: 8px;
            z-index: 9999;
            box-shadow: 0 4px 15px rgba(0,0,0,0.2);
        ">
            ⚠️ ${message}
        </div>
    `;

  document.body.appendChild(errorDiv);

  setTimeout(() => {
    errorDiv.remove();
  }, 5000);
}

// Add celebration animation CSS
const celebrationCSS = `
    @keyframes celebration {
        0% { transform: translate(-50%, -50%) scale(0); opacity: 0; }
        50% { transform: translate(-50%, -50%) scale(1.2); opacity: 1; }
        100% { transform: translate(-50%, -50%) scale(1) translateY(-100px); opacity: 0; }
    }
`;

const style = document.createElement("style");
style.textContent = celebrationCSS;
document.head.appendChild(style);

// Initialize tooltips and additional features
function initializeTooltips() {
  // Add tooltips to important elements
  const tooltipElements = document.querySelectorAll("[data-tooltip]");

  tooltipElements.forEach((element) => {
    element.addEventListener("mouseenter", showTooltip);
    element.addEventListener("mouseleave", hideTooltip);
  });
}

function showTooltip(e) {
  const tooltip = document.createElement("div");
  tooltip.className = "tooltip";
  tooltip.textContent = e.target.dataset.tooltip;
  tooltip.style.cssText = `
        position: absolute;
        background: #333;
        color: white;
        padding: 0.5rem;
        border-radius: 4px;
        font-size: 0.8rem;
        z-index: 1000;
        pointer-events: none;
        top: ${e.pageY - 40}px;
        left: ${e.pageX}px;
    `;

  document.body.appendChild(tooltip);
  e.target.tooltip = tooltip;
}

function hideTooltip(e) {
  if (e.target.tooltip) {
    e.target.tooltip.remove();
    e.target.tooltip = null;
  }
}

// Mouse tracking for navigation links
function setupMouseTracking() {
  const navLinks = document.querySelectorAll(".nav-link");
  
  navLinks.forEach(link => {
    link.addEventListener("mousemove", (e) => {
      const rect = link.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      
      link.style.setProperty("--mouse-x", `${x}%`);
      link.style.setProperty("--mouse-y", `${y}%`);
    });
    
    link.addEventListener("mouseleave", () => {
      link.style.setProperty("--mouse-x", "50%");
      link.style.setProperty("--mouse-y", "50%");
    });
    
    // Add click ripple effect
    link.addEventListener("click", (e) => {
      const rect = link.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const ripple = document.createElement("span");
      ripple.className = "click-ripple";
      ripple.style.left = `${x}px`;
      ripple.style.top = `${y}px`;
      
      link.appendChild(ripple);
      
      setTimeout(() => {
        ripple.remove();
      }, 600);
    });
  });
}

// Export functions for global access
window.showPage = showPage;
window.sendMessage = sendMessage;
window.askQuickQuestion = askQuickQuestion;
window.toggleAction = toggleAction;
