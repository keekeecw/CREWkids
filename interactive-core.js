// Core Interactive System for The Warrior's Mind

class WarriorMindInteractive {
    constructor() {
        this.user = {
            profile: null,
            achievements: [],
            progressTracking: {},
            notifications: []
        };
        this.initializeSystem();
    }

    initializeSystem() {
        // Check for existing user data
        const savedUserData = localStorage.getItem('warriorMindUserData');
        if (savedUserData) {
            this.user = JSON.parse(savedUserData);
        }

        // Set up core interactive elements
        this.setupAchievementSystem();
        this.setupNotificationSystem();
        this.setupProgressTracking();
    }

    // User Profile Management
    createProfile(profileData) {
        this.user.profile = {
            name: profileData.name || 'Anonymous Warrior',
            age: profileData.age,
            interests: profileData.interests || [],
            goals: profileData.goals || [],
            joinedDate: new Date().toISOString()
        };
        this.saveUserData();
        this.triggerWelcomeAchievement();
    }

    // Achievement System
    setupAchievementSystem() {
        const achievements = [
            {
                id: 'first_login',
                name: 'First Step Warrior',
                description: 'Created your first profile',
                icon: '🏁',
                points: 50
            },
            {
                id: 'completed_grounding',
                name: 'Mindfulness Master',
                description: 'Completed 5-4-3-2-1 Grounding Technique',
                icon: '🧘',
                points: 100
            },
            {
                id: 'role_model_analysis',
                name: 'Inspiration Seeker',
                description: 'Completed Role Model Analysis',
                icon: '🌟',
                points: 75
            },
            {
                id: 'week_streak',
                name: 'Consistency Champion',
                description: 'Completed activities for 7 consecutive days',
                icon: '🔥',
                points: 200
            }
        ];
        this.achievements = achievements;
    }

    triggerAchievement(achievementId) {
        const achievement = this.achievements.find(a => a.id === achievementId);
        if (achievement && !this.user.achievements.some(a => a.id === achievementId)) {
            this.user.achievements.push({
                ...achievement,
                earnedDate: new Date().toISOString()
            });
            this.createNotification(`Achievement Unlocked: ${achievement.name}`, achievement.icon);
            this.saveUserData();
        }
    }

    // Notification System
    setupNotificationSystem() {
        this.user.notifications = [];
    }

    createNotification(message, icon = '🔔') {
        const notification = {
            id: Date.now(),
            message,
            icon,
            timestamp: new Date().toISOString(),
            read: false
        };
        this.user.notifications.unshift(notification);
        
        // Limit notifications to last 20
        if (this.user.notifications.length > 20) {
            this.user.notifications.pop();
        }

        this.saveUserData();
        this.renderNotifications();
    }

    renderNotifications() {
        const notificationContainer = document.getElementById('notifications-container');
        if (notificationContainer) {
            notificationContainer.innerHTML = this.user.notifications.map(notification => `
                <div class="notification ${notification.read ? 'read' : 'unread'}">
                    <span class="notification-icon">${notification.icon}</span>
                    <span class="notification-message">${notification.message}</span>
                    <span class="notification-time">${this.formatTime(notification.timestamp)}</span>
                </div>
            `).join('');
        }
    }

    // Progress Tracking
    setupProgressTracking() {
        const defaultTracking = {
            mindfulnessSessions: 0,
            roleModelAnalyses: 0,
            consecutiveDays: 0,
            lastActivityDate: null
        };
        this.user.progressTracking = this.user.progressTracking || defaultTracking;
    }

    updateProgressTracking(activityType) {
        const today = new Date().toISOString().split('T')[0];
        const lastActivityDate = this.user.progressTracking.lastActivityDate;

        // Update activity count
        switch(activityType) {
            case 'mindfulness':
                this.user.progressTracking.mindfulnessSessions++;
                break;
            case 'role_model':
                this.user.progressTracking.roleModelAnalyses++;
                break;
        }

        // Consecutive days tracking
        if (lastActivityDate) {
            const lastDate = new Date(lastActivityDate);
            const currentDate = new Date();
            const dayDifference = (currentDate - lastDate) / (1000 * 60 * 60 * 24);

            if (dayDifference <= 1) {
                this.user.progressTracking.consecutiveDays++;
            } else if (dayDifference > 1) {
                this.user.progressTracking.consecutiveDays = 1;
            }
        } else {
            this.user.progressTracking.consecutiveDays = 1;
        }

        // Update last activity date
        this.user.progressTracking.lastActivityDate = today;

        // Check for week streak achievement
        if (this.user.progressTracking.consecutiveDays >= 7) {
            this.triggerAchievement('week_streak');
        }

        this.saveUserData();
        this.renderProgressDashboard();
    }

    renderProgressDashboard() {
        const dashboardContainer = document.getElementById('progress-dashboard');
        if (dashboardContainer) {
            dashboardContainer.innerHTML = `
                <div class="progress-stats">
                    <div class="stat">
                        <span class="stat-icon">🧘</span>
                        <span class="stat-value">${this.user.progressTracking.mindfulnessSessions}</span>
                        <span class="stat-label">Mindfulness Sessions</span>
                    </div>
                    <div class="stat">
                        <span class="stat-icon">🌟</span>
                        <span class="stat-value">${this.user.progressTracking.roleModelAnalyses}</span>
                        <span class="stat-label">Role Model Analyses</span>
                    </div>
                    <div class="stat">
                        <span class="stat-icon">🔥</span>
                        <span class="stat-value">${this.user.progressTracking.consecutiveDays}</span>
                        <span class="stat-label">Consecutive Days</span>
                    </div>
                </div>
            `;
        }
    }

    // Utility Methods
    saveUserData() {
        localStorage.setItem('warriorMindUserData', JSON.stringify(this.user));
    }

    formatTime(timestamp) {
        const date = new Date(timestamp);
        return date.toLocaleString();
    }

    // Guided Journaling Prompt Generator
    generateJournalingPrompt() {
        const prompts = [
            "What challenged you today, and how did you overcome it?",
            "Describe a moment when you felt truly confident.",
            "What does being a strong, compassionate man mean to you?",
            "Reflect on a role model who inspires you. Why do they inspire you?",
            "What personal goal are you currently working towards?",
            "How did you practice mindfulness today?",
            "What emotions are you experiencing right now?",
            "Describe a situation where you showed resilience.",
            "What are you grateful for today?",
            "How can you be kinder to yourself this week?"
        ];
        return prompts[Math.floor(Math.random() * prompts.length)];
    }
}

// Initialize the interactive system
const warriorMindSystem = new WarriorMindInteractive();