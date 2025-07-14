// Main Application Controller
class MindfulWarriorsApp {
    constructor() {
        this.currentSection = 'home';
        this.progressTracker = null;
        this.journalManager = null;
        this.mindfulnessGuide = null;
        this.groundingExercise = null;
    }

    async init() {
        try {
            // Initialize storage
            this.storage = new StorageManager();
            
            // Initialize modules
            this.progressTracker = new ProgressTracker(this.storage);
            this.journalManager = new JournalManager(this.storage);
            this.mindfulnessGuide = new MindfulnessGuide();
            this.groundingExercise = new GroundingExercise(this.storage);
            
            // Initialize all modules
            await this.progressTracker.init();
            await this.journalManager.init();
            await this.mindfulnessGuide.init();
            await this.groundingExercise.init();
            
            // Setup navigation
            this.setupNavigation();
            
            // Update progress badge
            this.updateProgressBadge();
            
            console.log('Mindful Warriors App initialized successfully');
        } catch (error) {
            console.error('Error initializing app:', error);
        }
    }

    setupNavigation() {
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href').substring(1);
                this.navigateToSection(targetId);
            });
        });

        // Handle scroll-based navigation highlighting
        window.addEventListener('scroll', () => {
            this.updateActiveNavigation();
        });
    }

    navigateToSection(sectionId) {
        const section = document.getElementById(sectionId);
        if (section) {
            section.scrollIntoView({ behavior: 'smooth' });
            this.currentSection = sectionId;
            this.updateActiveNavigation();
        }
    }

    updateActiveNavigation() {
        const navLinks = document.querySelectorAll('.nav-link');
        const sections = document.querySelectorAll('section[id]');
        
        let currentSection = '';
        sections.forEach(section => {
            const rect = section.getBoundingClientRect();
            if (rect.top <= 100 && rect.bottom >= 100) {
                currentSection = section.id;
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSection}`) {
                link.classList.add('active');
            }
        });
    }

    updateProgressBadge() {
        const stats = this.progressTracker.getProgressStats();
        const totalActivities = stats.completedGoals + stats.journalEntries + stats.mindfulnessSessions;
        document.getElementById('progress-badge').textContent = totalActivities;
    }
}

// Storage Manager Class
class StorageManager {
    save(key, data) {
        try {
            localStorage.setItem(key, JSON.stringify(data));
            return true;
        } catch (error) {
            console.error('Error saving data:', error);
            return false;
        }
    }

    load(key) {
        try {
            const data = localStorage.getItem(key);
            return data ? JSON.parse(data) : null;
        } catch (error) {
            console.error('Error loading data:', error);
            return null;
        }
    }

    remove(key) {
        try {
            localStorage.removeItem(key);
            return true;
        } catch (error) {
            console.error('Error removing data:', error);
            return false;
        }
    }

    clear() {
        try {
            localStorage.clear();
            return true;
        } catch (error) {
            console.error('Error clearing data:', error);
            return false;
        }
    }
}

// Progress Tracker Class
class ProgressTracker {
    constructor(storage) {
        this.storage = storage;
        this.goals = [];
        this.achievements = [];
    }

    async init() {
        this.loadData();
        this.renderGoals();
        this.updateStats();
    }

    loadData() {
        this.goals = this.storage.load('goals') || [];
        this.achievements = this.storage.load('achievements') || [];
    }

    saveData() {
        this.storage.save('goals', this.goals);
        this.storage.save('achievements', this.achievements);
    }

    addGoal() {
        const title = document.getElementById('goal-title').value.trim();
        const description = document.getElementById('goal-description').value.trim();
        const deadline = document.getElementById('goal-deadline').value;

        if (!title) {
            alert('Please enter a goal title');
            return;
        }

        const goal = {
            id: Date.now().toString(),
            title,
            description,
            progress: 0,
            deadline: deadline ? new Date(deadline) : null,
            completed: false,
            createdAt: new Date()
        };

        this.goals.push(goal);
        this.saveData();
        this.renderGoals();
        this.updateStats();

        // Clear form
        document.getElementById('goal-title').value = '';
        document.getElementById('goal-description').value = '';
        document.getElementById('goal-deadline').value = '';

        // Show success message
        this.showSuccessMessage('Goal added successfully!');
    }

    updateGoalProgress(goalId, progress) {
        const goal = this.goals.find(g => g.id === goalId);
        if (goal) {
            goal.progress = Math.max(0, Math.min(100, progress));
            if (goal.progress === 100 && !goal.completed) {
                goal.completed = true;
                this.addAchievement(`Completed: ${goal.title}`, 'goal-completion');
            }
            this.saveData();
            this.renderGoals();
            this.updateStats();
        }
    }

    completeGoal(goalId) {
        this.updateGoalProgress(goalId, 100);
    }

    addAchievement(title, category) {
        const achievement = {
            id: Date.now().toString(),
            title,
            category,
            dateEarned: new Date()
        };
        this.achievements.push(achievement);
        this.saveData();
    }

    renderGoals() {
        const goalsList = document.getElementById('goals-list');
        
        if (this.goals.length === 0) {
            goalsList.innerHTML = `
                <div class="text-center text-base-content/50 py-8">
                    <p>No goals set yet. Create your first goal to start tracking your progress!</p>
                </div>
            `;
            return;
        }

        goalsList.innerHTML = this.goals.map(goal => `
            <div class="card bg-base-100 shadow-sm">
                <div class="card-body p-4">
                    <div class="flex justify-between items-start mb-2">
                        <h4 class="font-semibold">${goal.title}</h4>
                        <div class="badge ${goal.completed ? 'badge-success' : 'badge-primary'}">${goal.progress}%</div>
                    </div>
                    ${goal.description ? `<p class="text-sm text-base-content/70 mb-3">${goal.description}</p>` : ''}
                    <div class="w-full bg-base-300 rounded-full h-2 mb-3">
                        <div class="goal-progress h-2 rounded-full" style="width: ${goal.progress}%"></div>
                    </div>
                    <div class="flex justify-between items-center">
                        <div class="flex gap-2">
                            <button class="btn btn-xs btn-primary" onclick="progressTracker.updateGoalProgress('${goal.id}', ${Math.min(100, goal.progress + 25)})">+25%</button>
                            <button class="btn btn-xs btn-success" onclick="progressTracker.completeGoal('${goal.id}')">Complete</button>
                        </div>
                        ${goal.deadline ? `<span class="text-xs text-base-content/50">${new Date(goal.deadline).toLocaleDateString()}</span>` : ''}
                    </div>
                </div>
            </div>
        `).join('');
    }

    updateStats() {
        const stats = this.getProgressStats();
        document.getElementById('total-goals').textContent = stats.totalGoals;
        document.getElementById('completed-goals').textContent = stats.completedGoals;
        document.getElementById('journal-count').textContent = stats.journalEntries;
        document.getElementById('current-streak').textContent = stats.currentStreak;
    }

    getProgressStats() {
        const journalEntries = this.storage.load('journalEntries') || [];
        const mindfulnessSessions = this.storage.load('mindfulnessSessions') || [];
        
        return {
            totalGoals: this.goals.length,
            completedGoals: this.goals.filter(g => g.completed).length,
            journalEntries: journalEntries.length,
            mindfulnessSessions: mindfulnessSessions.length,
            currentStreak: this.calculateStreak()
        };
    }

    calculateStreak() {
        const journalEntries = this.storage.load('journalEntries') || [];
        if (journalEntries.length === 0) return 0;

        const today = new Date();
        const sortedEntries = journalEntries
            .map(entry => new Date(entry.date))
            .sort((a, b) => b - a);

        let streak = 0;
        let currentDate = new Date(today);
        currentDate.setHours(0, 0, 0, 0);

        for (const entryDate of sortedEntries) {
            const entryDateOnly = new Date(entryDate);
            entryDateOnly.setHours(0, 0, 0, 0);

            if (entryDateOnly.getTime() === currentDate.getTime()) {
                streak++;
                currentDate.setDate(currentDate.getDate() - 1);
            } else if (entryDateOnly.getTime() < currentDate.getTime()) {
                break;
            }
        }

        return streak;
    }

    showSuccessMessage(message) {
        // Create and show a temporary success message
        const alert = document.createElement('div');
        alert.className = 'alert alert-success fixed top-4 right-4 z-50 w-auto success-animation';
        alert.innerHTML = `
            <svg class="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <span>${message}</span>
        `;
        document.body.appendChild(alert);

        setTimeout(() => {
            alert.remove();
        }, 3000);
    }
}

// Mindfulness Guide Class
class MindfulnessGuide {
    constructor() {
        this.currentTechnique = null;
        this.currentStep = 0;
        this.techniques = {
            breathing: {
                name: 'Warrior\'s Breath',
                duration: 5,
                instructions: [
                    'Sit comfortably with your back straight, like a warrior at rest.',
                    'Place one hand on your chest, one on your belly.',
                    'Breathe in through your nose for 4 counts.',
                    'Hold your breath for 7 counts.',
                    'Exhale through your mouth for 8 counts.',
                    'Repeat this cycle 4 times.',
                    'Feel the strength and calm flowing through you.'
                ]
            },
            bodyscan: {
                name: 'Body Awareness',
                duration: 10,
                instructions: [
                    'Lie down or sit comfortably.',
                    'Close your eyes and take three deep breaths.',
                    'Start at the top of your head. Notice any sensations.',
                    'Slowly move your attention down to your forehead, eyes, jaw.',
                    'Continue down your neck, shoulders, arms.',
                    'Focus on your chest, feeling it rise and fall.',
                    'Move to your stomach, lower back, hips.',
                    'Scan your thighs, knees, calves, feet.',
                    'Take a moment to feel your whole body.',
                    'Wiggle your fingers and toes, then open your eyes.'
                ]
            },
            visualization: {
                name: 'Victory Visualization',
                duration: 8,
                instructions: [
                    'Sit comfortably and close your eyes.',
                    'Think of a goal you want to achieve.',
                    'Picture yourself having already accomplished it.',
                    'See yourself celebrating this victory.',
                    'Notice how confident and strong you feel.',
                    'Hear the congratulations from people you respect.',
                    'Feel the pride and satisfaction in your body.',
                    'Remember: this success is possible for you.',
                    'Take three deep breaths and open your eyes.'
                ]
            }
        };
    }

    async init() {
        console.log('Mindfulness Guide initialized');
    }

    startTechnique(techniqueId) {
        if (!this.techniques[techniqueId]) return;

        this.currentTechnique = techniqueId;
        this.currentStep = 0;
        
        const technique = this.techniques[techniqueId];
        const modal = document.getElementById('technique-modal');
        
        document.getElementById('technique-title').textContent = technique.name;
        this.updateTechniqueContent();
        
        modal.showModal();
    }

    updateTechniqueContent() {
        const technique = this.techniques[this.currentTechnique];
        const progress = ((this.currentStep + 1) / technique.instructions.length) * 100;
        
        document.getElementById('technique-progress').style.setProperty('--value', progress);
        document.getElementById('technique-progress').textContent = `${Math.round(progress)}%`;
        
        const instructions = document.getElementById('technique-instructions');
        instructions.innerHTML = `
            <div class="step-indicator ${this.currentStep === 0 ? 'active' : ''}">${this.currentStep + 1}</div>
            <p class="text-lg text-center mb-4">${technique.instructions[this.currentStep]}</p>
        `;
        
        const actionButton = document.getElementById('technique-action');
        if (this.currentStep < technique.instructions.length - 1) {
            actionButton.textContent = 'Next';
            actionButton.onclick = () => this.nextStep();
        } else {
            actionButton.textContent = 'Complete';
            actionButton.onclick = () => this.completeTechnique();
        }
    }

    nextStep() {
        const technique = this.techniques[this.currentTechnique];
        if (this.currentStep < technique.instructions.length - 1) {
            this.currentStep++;
            this.updateTechniqueContent();
        }
    }

    completeTechnique() {
        // Save completed session
        const sessions = JSON.parse(localStorage.getItem('mindfulnessSessions') || '[]');
        sessions.push({
            technique: this.currentTechnique,
            date: new Date(),
            duration: this.techniques[this.currentTechnique].duration
        });
        localStorage.setItem('mindfulnessSessions', JSON.stringify(sessions));

        // Close modal
        document.getElementById('technique-modal').close();
        
        // Show success message
        this.showCompletionMessage();
        
        // Reset
        this.currentTechnique = null;
        this.currentStep = 0;
    }

    showCompletionMessage() {
        const alert = document.createElement('div');
        alert.className = 'alert alert-success fixed top-4 right-4 z-50 w-auto success-animation';
        alert.innerHTML = `
            <svg class="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <span>Mindfulness session completed! Well done, warrior.</span>
        `;
        document.body.appendChild(alert);

        setTimeout(() => {
            alert.remove();
        }, 4000);
    }
}

// Utility Functions
function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        section.scrollIntoView({ behavior: 'smooth' });
    }
}

// Global variables for module access
let app;
let progressTracker;
let journalManager;
let mindfulnessGuide;
let groundingExercise;

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', async () => {
    app = new MindfulWarriorsApp();
    await app.init();
    
    // Make modules globally accessible
    progressTracker = app.progressTracker;
    journalManager = app.journalManager;
    mindfulnessGuide = app.mindfulnessGuide;
    groundingExercise = app.groundingExercise;
});

export { MindfulWarriorsApp, StorageManager, ProgressTracker, MindfulnessGuide };